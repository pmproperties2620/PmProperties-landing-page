"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from "react";
import { useAdminAuth } from "@/app/admin/AdminAuthContext";

interface PushNotificationContextType {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission | "unsupported";
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  refreshUnreadCount: () => Promise<void>;
  subscribeToPush: () => Promise<boolean>;
  sendTestPush: () => Promise<{ success: boolean; message: string }>;
}

const PushNotificationContext = createContext<PushNotificationContextType>({
  isSupported: false,
  isSubscribed: false,
  permission: "unsupported",
  unreadCount: 0,
  setUnreadCount: () => {},
  refreshUnreadCount: async () => {},
  subscribeToPush: async () => false,
  sendTestPush: async () => ({ success: false, message: "" }),
});

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, passcode } = useAdminAuth();

  // Pure React 19 hydration check
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isSupported =
    isHydrated &&
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;

  const [customPermission, setCustomPermission] = useState<NotificationPermission | null>(null);

  const permission: NotificationPermission | "unsupported" = !isSupported
    ? "unsupported"
    : customPermission || (typeof window !== "undefined" && "Notification" in window ? window.Notification.permission : "unsupported");

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Sync PWA App Badge API
  const updateAppBadge = useCallback((count: number) => {
    if (typeof window !== "undefined" && "setAppBadge" in navigator) {
      if (count > 0) {
        navigator.setAppBadge(count).catch(() => {});
      } else {
        navigator.clearAppBadge().catch(() => {});
      }
    }
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const activePasscode = passcode || sessionStorage.getItem("pm_admin_passcode") || "";
      const res = await fetch("/api/admin/leads/unread-count", {
        headers: { "x-admin-passcode": activePasscode },
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.count === "number") {
          setUnreadCount(data.count);
          updateAppBadge(data.count);
        }
      }
    } catch {
      // Ignore background network errors
    }
  }, [isAuthenticated, passcode, updateAppBadge]);

  // Register Service Worker and check existing subscription
  useEffect(() => {
    if (!isSupported) return;
    let active = true;

    async function initSW() {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        const subscription = await registration.pushManager.getSubscription();
        if (active) {
          setIsSubscribed(Boolean(subscription));
        }
      } catch (err) {
        console.warn("⚠️ [PWA]: Service worker registration failed:", err);
      }
    }

    initSW();

    return () => {
      active = false;
    };
  }, [isSupported]);

  // Subscribe to push notifications on user interaction
  const subscribeToPush = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const currentPermission = await Notification.requestPermission();
      setCustomPermission(currentPermission);

      if (currentPermission !== "granted") {
        return false;
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.error("❌ Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY");
        return false;
      }

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
      }

      // Send subscription to server
      const activePasscode = passcode || sessionStorage.getItem("pm_admin_passcode") || "";
      const res = await fetch("/api/admin/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": activePasscode,
        },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      if (res.ok) {
        setIsSubscribed(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("❌ Failed to subscribe to push notifications:", err);
      return false;
    }
  }, [isSupported, passcode]);

  // Fetch unread count on mount and window focus
  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;

    async function loadCount() {
      try {
        const activePasscode = passcode || sessionStorage.getItem("pm_admin_passcode") || "";
        const res = await fetch("/api/admin/leads/unread-count", {
          headers: { "x-admin-passcode": activePasscode },
        });
        if (res.ok) {
          const data = await res.json();
          if (active && typeof data.count === "number") {
            setUnreadCount(data.count);
            updateAppBadge(data.count);
          }
        }
      } catch {
        // Ignore network errors
      }
    }

    loadCount();

    const onFocus = () => {
      loadCount();
    };
    window.addEventListener("focus", onFocus);
    const interval = setInterval(loadCount, 30000);

    return () => {
      active = false;
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, [isAuthenticated, passcode, updateAppBadge]);

  // Send a test push notification
  const sendTestPush = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const activePasscode = passcode || sessionStorage.getItem("pm_admin_passcode") || "";
      const res = await fetch("/api/admin/push/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": activePasscode,
        },
      });

      const data = await res.json();
      return {
        success: Boolean(res.ok && data.success),
        message: data.message || data.error || "Failed to trigger test notification.",
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, message: msg };
    }
  };

  return (
    <PushNotificationContext.Provider
      value={{
        isSupported,
        isSubscribed,
        permission,
        unreadCount,
        setUnreadCount,
        refreshUnreadCount,
        subscribeToPush,
        sendTestPush,
      }}
    >
      {children}
    </PushNotificationContext.Provider>
  );
}

export function usePushNotifications() {
  return useContext(PushNotificationContext);
}
