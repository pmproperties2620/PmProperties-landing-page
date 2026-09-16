import { NextResponse } from "next/server";
import { authenticateAdminRequest } from "@/lib/adminAuth";
import { savePushSubscription } from "@/lib/pushNotifications";

export async function POST(request: Request) {
  try {
    if (!(await authenticateAdminRequest(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid passcode." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { subscription } = body;

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json(
        { success: false, error: "Invalid Web Push subscription format." },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get("user-agent") || undefined;

    const result = await savePushSubscription(
      subscription.endpoint,
      subscription.keys,
      userAgent
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to save subscription." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Push notification subscription registered successfully.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("❌ [API /api/admin/push/subscribe]:", errorMsg);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
