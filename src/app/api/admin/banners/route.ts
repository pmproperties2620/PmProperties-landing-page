import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabaseServer";
import { authenticateAdminRequest } from "@/lib/adminAuth";

const DEFAULT_BANNERS = [
  { page_key: "home_hero", label: "Homepage Hero Banner Backdrop", image_url: "/images/hero-bg-new.png" },
  { page_key: "about", label: "About Us Page Hero Banner", image_url: "/images/hero-bg-new.png" },
  { page_key: "how_we_work", label: "How We Work Page Hero Banner", image_url: "/images/hero-bg-new.png" },
  { page_key: "services", label: "Services Page Hero Banner", image_url: "/images/hero-bg-new.png" },
  { page_key: "contact", label: "Contact Us Page Hero Banner", image_url: "/images/hero-bg-new.png" },
];

const DEFAULT_HERO_SHOWCASE = "/images/hero_img_right.png";

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
        banners: DEFAULT_BANNERS,
        heroShowcase: { image_url: DEFAULT_HERO_SHOWCASE },
        tableMissing: true,
      });
    }

    const supabase = getSupabaseServerClient();

    // Fetch page banners
    const { data: bannersData, error: bannersError } = await supabase
      .from("page_banners")
      .select("*");

    // Fetch hero showcase
    const { data: heroData, error: heroError } = await supabase
      .from("hero_showcase")
      .select("*")
      .limit(1)
      .maybeSingle();

    const isMissing =
      (bannersError && bannersError.code === "42P01") ||
      (heroError && heroError.code === "42P01");

    if (isMissing) {
      return NextResponse.json({
        success: true,
        banners: DEFAULT_BANNERS,
        heroShowcase: { image_url: DEFAULT_HERO_SHOWCASE },
        tableMissing: true,
      });
    }

    // Merge fetched banners with defaults so all 5 slots are always present
    const bannersMap = new Map((bannersData || []).map((b) => [b.page_key, b]));
    const mergedBanners = DEFAULT_BANNERS.map((def) => {
      const live = bannersMap.get(def.page_key);
      return live || def;
    });

    return NextResponse.json({
      success: true,
      banners: mergedBanners,
      heroShowcase: heroData || { image_url: DEFAULT_HERO_SHOWCASE },
      tableMissing: false,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/banners GET] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching banners." },
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
    const { type, page_key, image_url, hero_image_url } = body;
    const supabase = getSupabaseServerClient();

    // Updating Hero Showcase Card
    if (type === "hero_showcase") {
      if (!hero_image_url || typeof hero_image_url !== "string") {
        return NextResponse.json(
          { success: false, error: "Hero showcase image URL is required." },
          { status: 400 }
        );
      }

      // Check if row exists
      const { data: existing } = await supabase
        .from("hero_showcase")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from("hero_showcase")
          .update({ image_url: hero_image_url.trim(), updated_at: new Date().toISOString() })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        revalidatePath("/");
        return NextResponse.json({ success: true, heroShowcase: data });
      } else {
        const { data, error } = await supabase
          .from("hero_showcase")
          .insert({ image_url: hero_image_url.trim() })
          .select()
          .single();

        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        revalidatePath("/");
        return NextResponse.json({ success: true, heroShowcase: data });
      }
    }

    // Updating a Page Banner
    if (!page_key || !image_url) {
      return NextResponse.json(
        { success: false, error: "Page key and image URL are required." },
        { status: 400 }
      );
    }

    const targetDef = DEFAULT_BANNERS.find((b) => b.page_key === page_key);
    const label = targetDef ? targetDef.label : page_key;

    const { data, error } = await supabase
      .from("page_banners")
      .upsert(
        {
          page_key,
          label,
          image_url: image_url.trim(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "page_key" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const bannerRouteMap: Record<string, string> = {
      home_hero: "/",
      about: "/about",
      how_we_work: "/how-we-work",
      services: "/services",
      contact: "/contact",
    };
    const targetRoute = bannerRouteMap[page_key] || "/";
    revalidatePath(targetRoute);

    return NextResponse.json({
      success: true,
      banner: data,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/banners PUT] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error updating banner." },
      { status: 500 }
    );
  }
}
