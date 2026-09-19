import { NextResponse } from "next/server";
import {
  getSupabaseServerClient,
  isSupabaseConfigured,
  ProjectRow,
  slugify,
} from "@/lib/supabaseServer";
import { authenticateAdminRequest } from "@/lib/adminAuth";
import type { SupabaseClient } from "@supabase/supabase-js";

async function getUniqueSlug(
  supabase: SupabaseClient,
  baseSlug: string,
  currentId?: string
): Promise<string> {
  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    let query = supabase.from("projects").select("id").eq("slug", candidate);
    if (currentId) {
      query = query.neq("id", currentId);
    }
    const { data } = await query;
    if (!data || data.length === 0) {
      return candidate;
    }
    counter++;
    candidate = `${baseSlug}-${counter}`;
  }
}

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
    const category = searchParams.get("category") || "all";
    const status = searchParams.get("status") || "all";
    const publishedOnly = searchParams.get("publishedOnly") === "true";

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        devMode: true,
        message: "Supabase not connected. Add credentials in .env.local to persist projects.",
        projects: [],
      });
    }

    const supabase = getSupabaseServerClient();
    let query = supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (category !== "all") {
      query = query.eq("category", category);
    }
    if (status !== "all") {
      query = query.eq("status", status);
    }
    if (publishedOnly) {
      query = query.eq("is_published", true);
    }
    if (search) {
      query = query.or(
        `project_name.ilike.%${search}%,developer_name.ilike.%${search}%,location.ilike.%${search}%,address.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      const isMissingTable =
        error.code === "42P01" ||
        error.code === "PGRST205" ||
        error.message?.includes("Could not find the table") ||
        error.message?.includes("does not exist");

      if (isMissingTable) {
        console.warn(
          "⚠️ [API /api/admin/projects GET] 'projects' table not found in Supabase schema. Run supabase/schema.sql."
        );
        return NextResponse.json({
          success: true,
          tableMissing: true,
          message:
            "The 'projects' table has not been created in Supabase yet. Please run the SQL in supabase/schema.sql in your Supabase Dashboard SQL Editor.",
          projects: [],
        });
      }
      console.error("❌ [API /api/admin/projects GET] Supabase query error:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to fetch projects." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      projects: (data as ProjectRow[]) || [],
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/projects GET] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
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
        {
          success: false,
          error: "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      developer_name,
      project_name,
      location,
      address,
      category = "buy_new",
      status = "ready_to_move",
      brokerage_label = "0% Brokerage",
      is_featured = false,
      rera_number,
      rera_verified = false,
      price_min,
      price_max,
      price_unit = "Lakhs",
      price_per_sqft,
      configurations = [],
      property_type = "Residential",
      carpet_area_min,
      carpet_area_max,
      rera_usable = true,
      possession_text,
      possession_status_tag,
      description,
      highlights = [],
      amenities = [],
      cover_image_url,
      gallery_image_urls = [],
      brochure_url,
      contact_phone = "919029923246",
      is_published = true,
      display_order = 0,
    } = body;

    if (!project_name?.trim() || !developer_name?.trim() || !location?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Project Name, Developer Name, and Location are required fields.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const rawSlug = body.slug?.trim() ? slugify(body.slug) : slugify(project_name);
    const uniqueSlug = await getUniqueSlug(supabase, rawSlug);

    const insertPayload: Record<string, unknown> = {
      developer_name: developer_name.trim(),
      project_name: project_name.trim(),
      slug: uniqueSlug,
      location: location.trim(),
      address: (address || location).trim(),
      category,
      status,
      brokerage_label: brokerage_label.trim(),
      is_featured: Boolean(is_featured),
      rera_number: rera_number?.trim() || null,
      rera_verified: Boolean(rera_verified),
      price_min: price_min ? Number(price_min) : null,
      price_max: price_max ? Number(price_max) : null,
      price_unit: price_unit || "Lakhs",
      price_per_sqft: price_per_sqft ? Number(price_per_sqft) : null,
      configurations: Array.isArray(configurations) ? configurations : [],
      property_type: property_type || "Residential",
      carpet_area_min: carpet_area_min ? Number(carpet_area_min) : null,
      carpet_area_max: carpet_area_max ? Number(carpet_area_max) : null,
      rera_usable: Boolean(rera_usable),
      possession_text: possession_text?.trim() || null,
      possession_status_tag: possession_status_tag?.trim() || null,
      description: description?.trim() || null,
      highlights: Array.isArray(highlights) ? highlights.filter(Boolean) : [],
      amenities: Array.isArray(amenities) ? amenities.filter(Boolean) : [],
      cover_image_url: cover_image_url?.trim() || null,
      gallery_image_urls: Array.isArray(gallery_image_urls)
        ? gallery_image_urls.filter(Boolean)
        : [],
      brochure_url: brochure_url?.trim() || null,
      contact_phone: contact_phone?.trim() || "919029923246",
      is_published: is_published !== false,
      display_order: Number(display_order) || 0,
    };

    let { data, error } = await supabase
      .from("projects")
      .insert(insertPayload)
      .select()
      .single();

    if (error && (error.message?.includes("slug") || error.code === "42703" || error.code === "PGRST204")) {
      const payloadWithoutSlug = { ...insertPayload };
      delete payloadWithoutSlug.slug;
      const fallback = await supabase
        .from("projects")
        .insert(payloadWithoutSlug)
        .select()
        .single();
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.error("❌ [API /api/admin/projects POST] Supabase insert error:", error);
      const isMissingTable =
        error.code === "42P01" ||
        error.code === "PGRST205" ||
        error.message?.includes("Could not find the table") ||
        error.message?.includes("does not exist");

      return NextResponse.json(
        {
          success: false,
          error: isMissingTable
            ? "The 'projects' table does not exist in Supabase yet. Please execute the SQL in supabase/schema.sql in your Supabase Dashboard SQL editor."
            : `Failed to create project: ${error.message}`,
        },
        { status: isMissingTable ? 400 : 500 }
      );
    }

    return NextResponse.json({ success: true, project: data });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/projects POST] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
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
        { success: false, error: "Supabase is not configured." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing project ID." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    // Clean payload types
    const sanitizedUpdates: Record<string, unknown> = {};
    if (updates.developer_name !== undefined) sanitizedUpdates.developer_name = updates.developer_name.trim();
    if (updates.project_name !== undefined) sanitizedUpdates.project_name = updates.project_name.trim();
    if (updates.slug !== undefined || updates.project_name !== undefined) {
      const raw = updates.slug?.trim()
        ? slugify(updates.slug)
        : updates.project_name
        ? slugify(updates.project_name)
        : undefined;
      if (raw) {
        sanitizedUpdates.slug = await getUniqueSlug(supabase, raw, id);
      }
    }
    if (updates.location !== undefined) sanitizedUpdates.location = updates.location.trim();
    if (updates.address !== undefined) sanitizedUpdates.address = updates.address.trim();
    if (updates.category !== undefined) sanitizedUpdates.category = updates.category;
    if (updates.status !== undefined) sanitizedUpdates.status = updates.status;
    if (updates.brokerage_label !== undefined) sanitizedUpdates.brokerage_label = updates.brokerage_label.trim();
    if (updates.is_featured !== undefined) sanitizedUpdates.is_featured = Boolean(updates.is_featured);
    if (updates.rera_number !== undefined) sanitizedUpdates.rera_number = updates.rera_number ? updates.rera_number.trim() : null;
    if (updates.rera_verified !== undefined) sanitizedUpdates.rera_verified = Boolean(updates.rera_verified);
    if (updates.price_min !== undefined) sanitizedUpdates.price_min = updates.price_min ? Number(updates.price_min) : null;
    if (updates.price_max !== undefined) sanitizedUpdates.price_max = updates.price_max ? Number(updates.price_max) : null;
    if (updates.price_unit !== undefined) sanitizedUpdates.price_unit = updates.price_unit;
    if (updates.price_per_sqft !== undefined) sanitizedUpdates.price_per_sqft = updates.price_per_sqft ? Number(updates.price_per_sqft) : null;
    if (updates.configurations !== undefined) sanitizedUpdates.configurations = Array.isArray(updates.configurations) ? updates.configurations : [];
    if (updates.property_type !== undefined) sanitizedUpdates.property_type = updates.property_type;
    if (updates.carpet_area_min !== undefined) sanitizedUpdates.carpet_area_min = updates.carpet_area_min ? Number(updates.carpet_area_min) : null;
    if (updates.carpet_area_max !== undefined) sanitizedUpdates.carpet_area_max = updates.carpet_area_max ? Number(updates.carpet_area_max) : null;
    if (updates.rera_usable !== undefined) sanitizedUpdates.rera_usable = Boolean(updates.rera_usable);
    if (updates.possession_text !== undefined) sanitizedUpdates.possession_text = updates.possession_text ? updates.possession_text.trim() : null;
    if (updates.possession_status_tag !== undefined) sanitizedUpdates.possession_status_tag = updates.possession_status_tag ? updates.possession_status_tag.trim() : null;
    if (updates.description !== undefined) sanitizedUpdates.description = updates.description ? updates.description.trim() : null;
    if (updates.highlights !== undefined) sanitizedUpdates.highlights = Array.isArray(updates.highlights) ? updates.highlights.filter(Boolean) : [];
    if (updates.amenities !== undefined) sanitizedUpdates.amenities = Array.isArray(updates.amenities) ? updates.amenities.filter(Boolean) : [];
    if (updates.cover_image_url !== undefined) sanitizedUpdates.cover_image_url = updates.cover_image_url ? updates.cover_image_url.trim() : null;
    if (updates.gallery_image_urls !== undefined) sanitizedUpdates.gallery_image_urls = Array.isArray(updates.gallery_image_urls) ? updates.gallery_image_urls.filter(Boolean) : [];
    if (updates.brochure_url !== undefined) sanitizedUpdates.brochure_url = updates.brochure_url ? updates.brochure_url.trim() : null;
    if (updates.contact_phone !== undefined) sanitizedUpdates.contact_phone = updates.contact_phone.trim();
    if (updates.is_published !== undefined) sanitizedUpdates.is_published = Boolean(updates.is_published);
    if (updates.display_order !== undefined) sanitizedUpdates.display_order = Number(updates.display_order) || 0;

    let { data, error } = await supabase
      .from("projects")
      .update(sanitizedUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error && (error.message?.includes("slug") || error.code === "42703" || error.code === "PGRST204")) {
      const updatesWithoutSlug = { ...sanitizedUpdates };
      delete updatesWithoutSlug.slug;
      const fallback = await supabase
        .from("projects")
        .update(updatesWithoutSlug)
        .eq("id", id)
        .select()
        .single();
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.error("❌ [API /api/admin/projects PUT] Supabase error:", error);
      const isMissingTable =
        error.code === "42P01" ||
        error.code === "PGRST205" ||
        error.message?.includes("Could not find the table") ||
        error.message?.includes("does not exist");

      return NextResponse.json(
        {
          success: false,
          error: isMissingTable
            ? "The 'projects' table does not exist in Supabase yet. Please execute the SQL in supabase/schema.sql in your Supabase Dashboard SQL editor."
            : "Failed to update project.",
        },
        { status: isMissingTable ? 400 : 500 }
      );
    }

    return NextResponse.json({ success: true, project: data });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/projects PUT] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
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
        { success: false, error: "Supabase is not configured." },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing project ID parameter." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error("❌ [API /api/admin/projects DELETE] Supabase error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to delete project." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully." });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/projects DELETE] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
