import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
        partners: [],
        tableMissing: true,
      });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("trusted_partners")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json({
          success: true,
          partners: [],
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
      partners: data || [],
      tableMissing: false,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/partners GET] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching partners." },
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
    const { company_name, logo_url, is_published = true, display_order = 0 } = body;

    if (!logo_url || typeof logo_url !== "string") {
      return NextResponse.json(
        { success: false, error: "Logo URL is required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("trusted_partners")
      .insert({
        company_name: company_name?.trim() || null,
        logo_url: logo_url.trim(),
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

    revalidatePath("/");
    return NextResponse.json({
      success: true,
      partner: data,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/partners POST] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error creating partner." },
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
    const { id, company_name, logo_url, is_published, display_order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Partner ID is required." },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (company_name !== undefined) updates.company_name = company_name?.trim() || null;
    if (logo_url !== undefined) updates.logo_url = logo_url.trim();
    if (is_published !== undefined) updates.is_published = Boolean(is_published);
    if (display_order !== undefined) updates.display_order = Number(display_order) || 0;

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("trusted_partners")
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

    revalidatePath("/");
    return NextResponse.json({
      success: true,
      partner: data,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/partners PUT] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error updating partner." },
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
        { success: false, error: "Partner ID is required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("trusted_partners").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    revalidatePath("/");
    return NextResponse.json({
      success: true,
      deletedId: id,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/partners DELETE] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error deleting partner." },
      { status: 500 }
    );
  }
}
