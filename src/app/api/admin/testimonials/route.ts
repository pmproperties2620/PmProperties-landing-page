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
        testimonials: [],
        tableMissing: true,
      });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json({
          success: true,
          testimonials: [],
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
      testimonials: data || [],
      tableMissing: false,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/testimonials GET] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching testimonials." },
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
    const { client_name, image_url, is_published = true, display_order = 0 } = body;

    if (!image_url || typeof image_url !== "string") {
      return NextResponse.json(
        { success: false, error: "Image URL is required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        client_name: client_name?.trim() || null,
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
    return NextResponse.json({
      success: true,
      testimonial: data,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/testimonials POST] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error creating testimonial." },
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
    const { id, client_name, image_url, is_published, display_order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Testimonial ID is required." },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (client_name !== undefined) updates.client_name = client_name?.trim() || null;
    if (image_url !== undefined) updates.image_url = image_url.trim();
    if (is_published !== undefined) updates.is_published = Boolean(is_published);
    if (display_order !== undefined) updates.display_order = Number(display_order) || 0;

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("testimonials")
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
      testimonial: data,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/testimonials PUT] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error updating testimonial." },
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
        { success: false, error: "Testimonial ID is required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);

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
    console.error("❌ [API /api/admin/testimonials DELETE] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error deleting testimonial." },
      { status: 500 }
    );
  }
}
