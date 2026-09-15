import { NextResponse } from "next/server";
import {
  getSupabaseServerClient,
  isSupabaseConfigured,
  LeadStatus,
  Lead,
} from "@/lib/supabaseServer";

const DEFAULT_ADMIN_PASSCODE = "pmadmin2026";

function authenticateAdmin(request: Request): boolean {
  const adminPasscode = process.env.ADMIN_PASSCODE || DEFAULT_ADMIN_PASSCODE;
  const authHeader = request.headers.get("x-admin-passcode");
  return Boolean(authHeader && authHeader === adminPasscode);
}

// In-memory mock leads for preview when Supabase is not yet configured
const MOCK_LEADS: Lead[] = [
  {
    id: "lead-demo-1",
    full_name: "Amit Deshmukh",
    phone: "9820112233",
    requirement: "2bhk",
    price_range: "40-50",
    property_stage: "under_construction",
    source: "modal",
    status: "new",
    notes: "Interested in Khadakpada riverfront towers",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "lead-demo-2",
    full_name: "Pooja Kulkarni",
    phone: "9988776655",
    requirement: "3bhk",
    price_range: "60+",
    property_stage: "rtmi",
    source: "contact_page",
    status: "contacted",
    notes: "Site visit requested for this Saturday",
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    updated_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "lead-demo-3",
    full_name: "Vikas Patil",
    phone: "9167234567",
    requirement: "1bhk",
    price_range: "30-40",
    property_stage: "nearing_possession",
    source: "modal",
    status: "qualified",
    notes: "Pre-approved loan from HDFC",
    created_at: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid or missing Admin Passcode." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const status = searchParams.get("status") || "all";
    const source = searchParams.get("source") || "all";

    // If Supabase is not yet configured, return the demo mock data with a banner flag
    if (!isSupabaseConfigured()) {
      let filtered = [...MOCK_LEADS];
      if (status !== "all") {
        filtered = filtered.filter((l) => l.status === status);
      }
      if (source !== "all") {
        filtered = filtered.filter((l) => l.source === source);
      }
      if (search) {
        filtered = filtered.filter(
          (l) =>
            l.full_name.toLowerCase().includes(search) ||
            l.phone.includes(search)
        );
      }

      return NextResponse.json({
        success: true,
        devMode: true,
        message: "Showing preview records. Connect Supabase in .env.local for live database records.",
        leads: filtered,
        total: filtered.length,
      });
    }

    const supabase = getSupabaseServerClient();
    let query = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (status !== "all") {
      query = query.eq("status", status);
    }
    if (source !== "all") {
      query = query.eq("source", source);
    }
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("❌ [API /api/admin/leads] Supabase query error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch leads from database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      leads: data || [],
      total: (data || []).length,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/leads] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid or missing Admin Passcode." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid lead id." },
        { status: 400 }
      );
    }

    const validStatuses = new Set<LeadStatus>([
      "new",
      "contacted",
      "qualified",
      "converted",
      "closed",
    ]);

    if (status && !validStatuses.has(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      // Update in mock demo list
      const leadIndex = MOCK_LEADS.findIndex((l) => l.id === id);
      if (leadIndex !== -1) {
        if (status) MOCK_LEADS[leadIndex].status = status;
        if (typeof notes === "string") MOCK_LEADS[leadIndex].notes = notes;
        MOCK_LEADS[leadIndex].updated_at = new Date().toISOString();
        return NextResponse.json({ success: true, lead: MOCK_LEADS[leadIndex], devMode: true });
      }
      return NextResponse.json({ success: true, message: "Lead updated in preview mode" });
    }

    const supabase = getSupabaseServerClient();
    const updatePayload: Record<string, unknown> = {};
    if (status) updatePayload.status = status;
    if (typeof notes === "string") updatePayload.notes = notes;

    const { data, error } = await supabase
      .from("leads")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("❌ [API /api/admin/leads PATCH] Supabase error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update lead." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, lead: data });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/leads PATCH] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
