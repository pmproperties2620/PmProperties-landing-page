import { NextResponse } from "next/server";
import { authenticateAdminRequest } from "@/lib/adminAuth";
import { sendPushToAllSubscribers, getUnreadLeadsCount } from "@/lib/pushNotifications";

export async function POST(request: Request) {
  try {
    if (!(await authenticateAdminRequest(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid passcode." },
        { status: 401 }
      );
    }

    const unreadCount = await getUnreadLeadsCount();

    const result = await sendPushToAllSubscribers({
      title: "PM Properties: Test Notification",
      body: "Push notification system is working! You will receive live alerts for new leads.",
      url: "/admin/leads",
      unreadCount,
      tag: "test-notification-" + Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: `Test push sent to ${result.sent} device(s) (${result.failed} failed).`,
      sent: result.sent,
      failed: result.failed,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("❌ [API /api/admin/push/test]:", errorMsg);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
