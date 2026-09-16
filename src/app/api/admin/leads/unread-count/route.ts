import { NextResponse } from "next/server";
import { authenticateAdminRequest } from "@/lib/adminAuth";
import { getUnreadLeadsCount } from "@/lib/pushNotifications";
import { isSupabaseConfigured } from "@/lib/supabaseServer";
import { getMockLeads } from "@/lib/mockLeads";

export async function GET(request: Request) {
  try {
    if (!(await authenticateAdminRequest(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid passcode." },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured()) {
      const mockUnread = getMockLeads().filter((l) => l.is_read === false || (l.status === "new" && l.is_read !== true)).length;
      return NextResponse.json({ success: true, count: mockUnread });
    }

    const count = await getUnreadLeadsCount();
    return NextResponse.json({ success: true, count });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
