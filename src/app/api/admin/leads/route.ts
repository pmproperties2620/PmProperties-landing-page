import { NextResponse } from "next/server";
import {
  getSupabaseServerClient,
  isSupabaseConfigured,
  LeadStatus,
} from "@/lib/supabaseServer";
import { updateMockLead, getMockLeads } from "@/lib/mockLeads";
import { authenticateAdminRequest } from "@/lib/adminAuth";
import { invalidateAnalyticsCache } from "@/lib/analyticsCache";

export async function GET(request: Request) {
  try {
    if (!(await authenticateAdminRequest(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid or missing Admin Passcode." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const status = searchParams.get("status") || "all";
    const source = searchParams.get("source") || "all";
    const requirement = searchParams.get("requirement") || "all";
    const leadId = searchParams.get("id") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "15", 10));
    const offset = (page - 1) * limit;

    // Fallback/Preview Mode
    if (!isSupabaseConfigured()) {
      let filtered = [...getMockLeads()];
      if (leadId) {
        filtered = filtered.filter((l) => l.id === leadId);
      }
      if (status !== "all") {
        filtered = filtered.filter((l) => l.status === status);
      }
      if (source !== "all") {
        filtered = filtered.filter((l) => l.source === source);
      }
      if (requirement !== "all") {
        filtered = filtered.filter((l) => l.requirement.toLowerCase() === requirement.toLowerCase());
      }
      if (search) {
        filtered = filtered.filter(
          (l) =>
            l.full_name.toLowerCase().includes(search) ||
            l.phone.includes(search)
        );
      }
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filtered = filtered.filter((l) => new Date(l.created_at) >= start);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filtered = filtered.filter((l) => new Date(l.created_at) <= end);
      }

      // Sort by created_at desc
      filtered.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      const total = filtered.length;
      const paginatedLeads = filtered.slice(offset, offset + limit);

      return NextResponse.json({
        success: true,
        devMode: true,
        message: "Showing preview records. Connect Supabase in .env.local for live database records.",
        leads: paginatedLeads,
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      });
    }

    // Live Supabase Query with pagination
    const supabase = getSupabaseServerClient();
    let query = supabase
      .from("leads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (leadId) {
      query = query.eq("id", leadId);
    }
    if (status !== "all") {
      query = query.eq("status", status);
    }
    if (source !== "all") {
      query = query.eq("source", source);
    }
    if (requirement !== "all") {
      query = query.eq("requirement", requirement);
    }
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`);
    }
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      query = query.gte("created_at", start.toISOString());
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query = query.lte("created_at", end.toISOString());
    }

    // Apply pagination range
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      console.error("❌ [API /api/admin/leads] Supabase query error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch leads from database." },
        { status: 500 }
      );
    }

    const total = count || 0;

    return NextResponse.json({
      success: true,
      leads: data || [],
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
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
    if (!(await authenticateAdminRequest(request))) {
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
      const updated = updateMockLead(id, {
        ...(status && { status }),
        ...(typeof notes === "string" && { notes }),
      });
      invalidateAnalyticsCache();
      return NextResponse.json({ success: true, lead: updated, devMode: true });
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

    invalidateAnalyticsCache();
    return NextResponse.json({ success: true, lead: data });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/leads PATCH] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
