import webpush from "web-push";
import { getSupabaseServerClient, isSupabaseConfigured } from "./supabaseServer";

export interface PushNotificationPayload {
  title: string;
  body: string;
  url?: string;
  leadId?: string;
  unreadCount?: number;
  tag?: string;
}

export interface StoredPushSubscription {
  id?: string;
  endpoint: string;
  keys_p256dh: string;
  keys_auth: string;
  user_agent?: string;
  created_at?: string;
}

// In-memory fallback for local dev when Supabase is not configured
const memorySubscriptions: Map<string, StoredPushSubscription> = new Map();

function setupVapid(): boolean {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:admin@pmproperties.in";

  if (!publicKey || !privateKey) {
    console.warn("⚠️ [PushNotifications]: Missing VAPID keys in environment variables.");
    return false;
  }

  try {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    return true;
  } catch (err) {
    console.error("❌ [PushNotifications] Failed to configure VAPID:", err);
    return false;
  }
}

/**
 * Fetch total number of unread leads
 */
export async function getUnreadLeadsCount(): Promise<number> {
  if (!isSupabaseConfigured()) {
    return 0;
  }

  try {
    const supabase = getSupabaseServerClient();
    const { count, error } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false);

    if (error) {
      // If column is_read doesn't exist yet, fall back to status = 'new'
      const { count: fallbackCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "new");
      return fallbackCount || 0;
    }

    return count || 0;
  } catch (err) {
    console.warn("⚠️ Could not get unread count from Supabase:", err);
    return 0;
  }
}

/**
 * Save or update a Web Push subscription in Supabase (or memory fallback)
 */
export async function savePushSubscription(
  endpoint: string,
  keys: { p256dh: string; auth: string },
  userAgent?: string
): Promise<{ success: boolean; error?: string }> {
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return { success: false, error: "Invalid subscription payload." };
  }

  if (!isSupabaseConfigured()) {
    memorySubscriptions.set(endpoint, {
      endpoint,
      keys_p256dh: keys.p256dh,
      keys_auth: keys.auth,
      user_agent: userAgent,
    });
    return { success: true };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          endpoint,
          keys_p256dh: keys.p256dh,
          keys_auth: keys.auth,
          user_agent: userAgent || null,
          created_at: new Date().toISOString(),
        },
        { onConflict: "endpoint" }
      );

    if (error) {
      console.error("❌ Failed to persist push subscription to Supabase:", error.message);
      // Still store in memory as resilient backup
      memorySubscriptions.set(endpoint, {
        endpoint,
        keys_p256dh: keys.p256dh,
        keys_auth: keys.auth,
        user_agent: userAgent,
      });
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Send push notification to all stored browser subscriptions
 */
export async function sendPushToAllSubscribers(
  payload: PushNotificationPayload
): Promise<{ sent: number; failed: number }> {
  if (!setupVapid()) {
    return { sent: 0, failed: 0 };
  }

  let subscriptions: StoredPushSubscription[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("push_subscriptions")
        .select("endpoint, keys_p256dh, keys_auth");

      if (!error && data) {
        subscriptions = data;
      }
    } catch (err) {
      console.warn("⚠️ Failed to query push_subscriptions from Supabase:", err);
    }
  }

  // Merge with any in-memory subscriptions
  for (const [ep, sub] of memorySubscriptions.entries()) {
    if (!subscriptions.some((s) => s.endpoint === ep)) {
      subscriptions.push(sub);
    }
  }

  if (subscriptions.length === 0) {
    return { sent: 0, failed: 0 };
  }

  const payloadString = JSON.stringify(payload);
  let sent = 0;
  let failed = 0;
  const expiredEndpoints: string[] = [];

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.keys_p256dh,
              auth: sub.keys_auth,
            },
          },
          payloadString
        );
        sent++;
      } catch (err: unknown) {
        failed++;
        const statusCode = (err as { statusCode?: number })?.statusCode;
        // 404 or 410 means the user unsubscribed or the subscription expired
        if (statusCode === 404 || statusCode === 410) {
          expiredEndpoints.push(sub.endpoint);
        }
      }
    })
  );

  // Clean up expired subscriptions from Supabase
  if (expiredEndpoints.length > 0 && isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServerClient();
      await supabase
        .from("push_subscriptions")
        .delete()
        .in("endpoint", expiredEndpoints);
    } catch {
      // Best-effort cleanup
    }
    for (const ep of expiredEndpoints) {
      memorySubscriptions.delete(ep);
    }
  }

  return { sent, failed };
}
