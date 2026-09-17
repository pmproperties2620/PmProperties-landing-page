import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabaseServer";
import { authenticateAdminRequest } from "@/lib/adminAuth";

export async function GET(request: Request) {
  try {
    if (!(await authenticateAdminRequest(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid or missing Admin Passcode." },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        milestones: [],
        tableMissing: true,
      });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("timeline_milestones")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json({
          success: true,
          milestones: [],
          tableMissing: true,
        });
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      milestones: data || [],
      tableMissing: false,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/timeline-milestones GET] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching timeline milestones." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await authenticateAdminRequest(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid or missing Admin Passcode." },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Supabase credentials are not configured." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      year_label,
      title,
      description = "",
      image_urls = [],
      is_published = true,
      display_order = 0,
    } = body;

    if (!year_label || !title) {
      return NextResponse.json(
        { success: false, error: "Year label and Title are required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("timeline_milestones")
      .insert({
        year_label: year_label.trim(),
        title: title.trim(),
        description: description?.trim() || "",
        image_urls: Array.isArray(image_urls) ? image_urls : [],
        is_published: Boolean(is_published),
        display_order: Number(display_order) || 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      milestone: data,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/timeline-milestones POST] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error creating timeline milestone." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await authenticateAdminRequest(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid or missing Admin Passcode." },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Supabase credentials are not configured." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { id, year_label, title, description, image_urls, is_published, display_order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Milestone ID is required." },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (year_label !== undefined) updates.year_label = year_label.trim();
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description?.trim() || "";
    if (image_urls !== undefined) updates.image_urls = Array.isArray(image_urls) ? image_urls : [];
    if (is_published !== undefined) updates.is_published = Boolean(is_published);
    if (display_order !== undefined) updates.display_order = Number(display_order) || 0;

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("timeline_milestones")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      milestone: data,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/timeline-milestones PUT] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error updating timeline milestone." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await authenticateAdminRequest(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid or missing Admin Passcode." },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Supabase credentials are not configured." },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Milestone ID is required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("timeline_milestones").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      deletedId: id,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/timeline-milestones DELETE] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error deleting timeline milestone." },
      { status: 500 }
    );
  }
}
