import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabaseServer";

// ==============================================================================
// Types
// ==============================================================================

export interface TestimonialItem {
  id: string;
  client_name?: string | null;
  image_url: string;
  is_published?: boolean;
  display_order?: number;
}

export interface PartnerLogoItem {
  id: string;
  company_name?: string | null;
  logo_url: string;
  is_published?: boolean;
  display_order?: number;
}

export interface AboutShowcaseItem {
  id: string;
  image_url: string;
  display_order?: number;
  is_published?: boolean;
}

export interface TimelineMilestoneItem {
  id: string;
  year_label: string;
  title: string;
  description: string;
  image_urls: string[];
  display_order?: number;
  is_published?: boolean;
}

export interface PageBannerItem {
  page_key: string;
  label: string;
  image_url: string;
}

export interface IndustryPresenceItem {
  id: string;
  caption?: string | null;
  image_url: string;
  is_published?: boolean;
  display_order?: number;
  created_at?: string;
}

// ==============================================================================
// Default Fallbacks (Guaranteeing 100% Zero Downtime / Missing DB Safety)
// ==============================================================================

export const FALLBACK_TESTIMONIALS: TestimonialItem[] = [
  { id: "fallback-1", client_name: "Happy Family 1", image_url: "/images/testimonials/testimonial-1.jpeg", display_order: 1 },
  { id: "fallback-2", client_name: "Happy Family 2", image_url: "/images/testimonials/testimonial-2.jpeg", display_order: 2 },
  { id: "fallback-3", client_name: "Happy Family 3", image_url: "/images/testimonials/testimonial-3.jpeg", display_order: 3 },
  { id: "fallback-4", client_name: "Happy Family 4", image_url: "/images/testimonials/testimonial-4.jpeg", display_order: 4 },
  { id: "fallback-5", client_name: "Happy Family 5", image_url: "/images/testimonials/testimonial-5.jpeg", display_order: 5 },
  { id: "fallback-6", client_name: "Happy Family 6", image_url: "/images/testimonials/testimonial-6.jpeg", display_order: 6 },
  { id: "fallback-7", client_name: "Happy Family 7", image_url: "/images/testimonials/testimonial-7.jpeg", display_order: 7 },
  { id: "fallback-8", client_name: "Happy Family 8", image_url: "/images/testimonials/testimonial-8.jpeg", display_order: 8 },
  { id: "fallback-9", client_name: "Happy Family 9", image_url: "/images/testimonials/testimonial-9.jpg", display_order: 9 },
  { id: "fallback-10", client_name: "Happy Family 10", image_url: "/images/testimonials/testimonial-10.jpg", display_order: 10 },
];

export const FALLBACK_PARTNERS: PartnerLogoItem[] = [
  { id: "fallback-1", company_name: "Partner 1", logo_url: "/logos/logo1.png", display_order: 1 },
  { id: "fallback-2", company_name: "Partner 2", logo_url: "/logos/logo2.png", display_order: 2 },
  { id: "fallback-3", company_name: "Partner 3", logo_url: "/logos/logo3.png", display_order: 3 },
  { id: "fallback-4", company_name: "Partner 4", logo_url: "/logos/logo4.png", display_order: 4 },
  { id: "fallback-5", company_name: "Partner 5", logo_url: "/logos/logo5.png", display_order: 5 },
  { id: "fallback-6", company_name: "Partner 6", logo_url: "/logos/logo6.png", display_order: 6 },
];

export const FALLBACK_ABOUT_SHOWCASE: string[] = [
  "/images/about1.png",
  "/images/about2.png",
  "/images/about3.png",
  "/images/about4.png",
];

export const FALLBACK_TIMELINE: TimelineMilestoneItem[] = [
  {
    id: "fallback-1",
    year_label: "Pre-2020",
    title: "Building the Foundation",
    description:
      "Graduating with Distinction in B.Com, I built a strong foundation through 8 years of experience in leadership roles at top MNCs like Sutherland, TinyOwl, and Wipro. Yet, deep down, I always nurtured a dream—to build an honest business that earns people's trust.",
    image_urls: ["/images/whatsapp-avatar.jpeg"],
    display_order: 1,
  },
  {
    id: "fallback-2",
    year_label: "2020",
    title: "The Turning Point",
    description:
      "The 2020 pandemic became my catalyst. Seeing acquaintances face scams and poor guidance while buying homes, I found my calling. I decided to step up and ensure people get their rightful homes through transparent, secure, and guided transactions.",
    image_urls: ["/images/timeline_2_new.jpg"],
    display_order: 2,
  },
  {
    id: "fallback-3",
    year_label: "September 1, 2020",
    title: "The Beginning",
    description:
      "Equipped with proper RERA training and licensing, I took the leap and founded 'Siddhivinayak Enterprise – Real Estate & Interior'. Despite early hurdles, my resolve was unbreakable—there was no turning back. With determination, the journey began.",
    image_urls: ["/images/timeline_3_new.jpeg"],
    display_order: 3,
  },
  {
    id: "fallback-4",
    year_label: "2021 - 2024",
    title: "Growth & Partnerships",
    description:
      "The journey blossomed as I joined KDRA (Kalyan Dombivli Realtors Welfare Association) and collaborated with renowned developers like Regency Group, Lodha Group, and Runwal Group. To date, I've had the privilege of helping over 500 families find their perfect homes.",
    image_urls: [
      "/images/timeline_4_1.jpeg",
      "/images/timeline_4_2.jpeg",
      "/images/timeline_4_3.jpeg",
      "/images/timeline_4_4.jpeg",
      "/images/timeline_4_5.jpeg",
    ],
    display_order: 4,
  },
  {
    id: "fallback-5",
    year_label: "Early 2025",
    title: "A New Identity",
    description:
      "Celebrating 5 years of trust, we took a monumental step forward. To secure a distinct and official identity, the company evolved into 'The PM Properties' with a registered trademark. Fulfilling your dream of a home remains my greatest privilege.",
    image_urls: [
      "/images/PM_propreties.jpeg",
      "/images/pm.jpeg",
      "/images/pm3.jpeg",
      "/images/pm1.jpeg",
      "/images/pm2.jpeg",
    ],
    display_order: 5,
  },
];

export const FALLBACK_HERO_SHOWCASE = "/images/hero_img_right.png";
export const FALLBACK_BANNER = "/images/hero-bg-new.png";

export const FALLBACK_INDUSTRY_PRESENCE: IndustryPresenceItem[] = [
  {
    id: "fallback-ip-1",
    caption: "KDRA Association Annual Summit & Developer Connect",
    image_url: "/images/timeline_4_1.jpeg",
    display_order: 1,
  },
  {
    id: "fallback-ip-2",
    caption: "Excellence in Real Estate Advisory Award Ceremony",
    image_url: "/images/pm.jpeg",
    display_order: 2,
  },
  {
    id: "fallback-ip-3",
    caption: "Strategic Developer Partners Meet & Keynote",
    image_url: "/images/timeline_4_2.jpeg",
    display_order: 3,
  },
  {
    id: "fallback-ip-4",
    caption: "Kalyan-Dombivli Property Expo & Showcase",
    image_url: "/images/pm1.jpeg",
    display_order: 4,
  },
  {
    id: "fallback-ip-5",
    caption: "Real Estate Leadership & Channel Partner Forum",
    image_url: "/images/timeline_4_3.jpeg",
    display_order: 5,
  },
  {
    id: "fallback-ip-6",
    caption: "PM Properties Milestone Celebration & Honor",
    image_url: "/images/pm2.jpeg",
    display_order: 6,
  },
];

// ==============================================================================
// Server Fetch Functions
// ==============================================================================

export async function getTestimonials(): Promise<TestimonialItem[]> {
  if (!isSupabaseConfigured()) return FALLBACK_TESTIMONIALS;
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, client_name, image_url, display_order")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return FALLBACK_TESTIMONIALS;
    }
    return data;
  } catch (err) {
    console.error("Failed to load testimonials:", err);
    return FALLBACK_TESTIMONIALS;
  }
}

export async function getTrustedPartners(): Promise<PartnerLogoItem[]> {
  if (!isSupabaseConfigured()) return FALLBACK_PARTNERS;
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("trusted_partners")
      .select("id, company_name, logo_url, display_order")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return FALLBACK_PARTNERS;
    }
    return data;
  } catch (err) {
    console.error("Failed to load trusted partners:", err);
    return FALLBACK_PARTNERS;
  }
}

export async function getAboutShowcase(): Promise<string[]> {
  if (!isSupabaseConfigured()) return FALLBACK_ABOUT_SHOWCASE;
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("about_showcase")
      .select("image_url, display_order")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return FALLBACK_ABOUT_SHOWCASE;
    }
    return data.map((item) => item.image_url);
  } catch (err) {
    console.error("Failed to load about showcase:", err);
    return FALLBACK_ABOUT_SHOWCASE;
  }
}

export async function getTimelineMilestones(): Promise<TimelineMilestoneItem[]> {
  if (!isSupabaseConfigured()) return FALLBACK_TIMELINE;
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("timeline_milestones")
      .select("id, year_label, title, description, image_urls, display_order")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return FALLBACK_TIMELINE;
    }
    return data;
  } catch (err) {
    console.error("Failed to load timeline milestones:", err);
    return FALLBACK_TIMELINE;
  }
}

export async function getPageBanner(pageKey: string): Promise<string> {
  if (!isSupabaseConfigured()) return FALLBACK_BANNER;
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("page_banners")
      .select("image_url")
      .eq("page_key", pageKey)
      .maybeSingle();

    if (error || !data || !data.image_url) {
      return FALLBACK_BANNER;
    }
    return data.image_url;
  } catch {
    return FALLBACK_BANNER;
  }
}

export async function getHeroShowcase(): Promise<string> {
  if (!isSupabaseConfigured()) return FALLBACK_HERO_SHOWCASE;
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("hero_showcase")
      .select("image_url")
      .limit(1)
      .maybeSingle();

    if (error || !data || !data.image_url) {
      return FALLBACK_HERO_SHOWCASE;
    }
    return data.image_url;
  } catch {
    return FALLBACK_HERO_SHOWCASE;
  }
}

export async function getIndustryPresence(limit?: number): Promise<IndustryPresenceItem[]> {
  if (!isSupabaseConfigured()) {
    return limit ? FALLBACK_INDUSTRY_PRESENCE.slice(0, limit) : FALLBACK_INDUSTRY_PRESENCE;
  }
  try {
    const supabase = getSupabaseServerClient();
    let query = supabase
      .from("industry_presence")
      .select("id, caption, image_url, display_order, created_at")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (limit && limit > 0) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return limit ? FALLBACK_INDUSTRY_PRESENCE.slice(0, limit) : FALLBACK_INDUSTRY_PRESENCE;
    }
    return data;
  } catch (err) {
    console.error("Failed to load industry presence items:", err);
    return limit ? FALLBACK_INDUSTRY_PRESENCE.slice(0, limit) : FALLBACK_INDUSTRY_PRESENCE;
  }
}
