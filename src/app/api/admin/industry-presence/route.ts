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
        items: [],
        tableMissing: true,
      });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("industry_presence")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json({
          success: true,
          items: [],
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
      items: data || [],
      tableMissing: false,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/industry-presence GET] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching industry presence items." },
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
    const { caption, image_url, is_published = true, display_order = 0 } = body;

    if (!image_url || typeof image_url !== "string") {
      return NextResponse.json(
        { success: false, error: "Image URL is required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("industry_presence")
      .insert({
        caption: caption?.trim() || null,
        image_url: image_url.trim(),
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
    revalidatePath("/about");

    return NextResponse.json({
      success: true,
      item: data,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/industry-presence POST] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error creating industry presence item." },
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
    const { id, caption, image_url, is_published, display_order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Item ID is required." },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (caption !== undefined) updates.caption = caption?.trim() || null;
    if (image_url !== undefined) updates.image_url = image_url.trim();
    if (is_published !== undefined) updates.is_published = Boolean(is_published);
    if (display_order !== undefined) updates.display_order = Number(display_order) || 0;

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("industry_presence")
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
    revalidatePath("/about");

    return NextResponse.json({
      success: true,
      item: data,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/industry-presence PUT] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error updating industry presence item." },
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
        { success: false, error: "Item ID is required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("industry_presence").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    revalidatePath("/");
    revalidatePath("/about");

    return NextResponse.json({
      success: true,
      deletedId: id,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/industry-presence DELETE] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error deleting industry presence item." },
      { status: 500 }
    );
  }
}
