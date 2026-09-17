import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "closed";
export type LeadSource = "modal" | "contact_page" | "website";

export interface Lead {
  id: string;
  full_name: string;
  phone: string;
  requirement: string;
  price_range: string;
  property_stage: string;
  source: LeadSource;
  status: LeadStatus;
  notes?: string | null;
  is_read?: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeadInput {
  full_name: string;
  phone: string;
  requirement: string;
  price_range: string;
  property_stage: string;
  source?: LeadSource;
  notes?: string;
}

let supabaseServerClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (supabaseServerClient) {
    return supabaseServerClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prefer service role key for backend admin operations, fallback to anon key if service role is not set
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase credentials are missing. Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env.local"
    );
  }

  supabaseServerClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseServerClient;
}

export function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(supabaseUrl && supabaseKey && supabaseUrl.startsWith("http"));
}

// ============================================================================
// PROJECTS CMS TYPES & INTERFACES
// ============================================================================

export type ProjectDbCategory =
  | "buy_new"
  | "verified_resale"
  | "commercial"
  | "industrial_rental";

export type ProjectDbStatus = "ready_to_move" | "under_construction";

export interface ProjectRow {
  id: string;
  developer_name: string;
  project_name: string;
  location: string;
  address: string;
  category: ProjectDbCategory | string;
  status: ProjectDbStatus | string;
  brokerage_label: string;
  is_featured: boolean;
  rera_number?: string | null;
  rera_verified: boolean;
  price_min?: number | null;
  price_max?: number | null;
  price_unit: "Lakhs" | "Cr" | string;
  price_per_sqft?: number | null;
  configurations: string[];
  property_type: string;
  carpet_area_min?: number | null;
  carpet_area_max?: number | null;
  rera_usable: boolean;
  possession_text?: string | null;
  possession_status_tag?: string | null;
  description?: string | null;
  highlights: string[];
  amenities: string[];
  cover_image_url?: string | null;
  gallery_image_urls: string[];
  brochure_url?: string | null;
  contact_phone: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type ProjectInput = Omit<ProjectRow, "id" | "created_at" | "updated_at">;

import type {
  Project,
  ProjectCategory,
  ListingType,
  PossessionStatus,
} from "@/data/projects";

function detectCity(
  address?: string,
  locality?: string
): "Kalyan" | "Dombivli" | "Thane" | "Ambernath" | "Badlapur" | "Bhiwandi" {
  const combined = `${locality || ""} ${address || ""}`.toLowerCase();
  if (combined.includes("dombivli") || combined.includes("palava") || combined.includes("kombadbhuva")) return "Dombivli";
  if (combined.includes("thane") || combined.includes("ghodbunder") || combined.includes("majiwada") || combined.includes("kasarvadavali")) return "Thane";
  if (combined.includes("ambernath") || combined.includes("ambarnath")) return "Ambernath";
  if (combined.includes("badlapur")) return "Badlapur";
  if (combined.includes("bhiwandi")) return "Bhiwandi";
  return "Kalyan";
}

export function mapProjectRowToClient(row: ProjectRow): Project {
  // Category mapping
  let category: ProjectCategory = "Residential";
  if (row.category === "commercial") category = "Commercial";
  else if (row.category === "industrial_rental") category = "Industrial";

  // Listing type mapping
  let listingType: ListingType = "Buy";
  if (row.category === "verified_resale") listingType = "Resale";
  else if (row.category === "industrial_rental") listingType = "Rental";

  // Possession status mapping
  let possession: PossessionStatus = "Under Construction";
  if (row.status === "ready_to_move") possession = "Ready to Move";

  // Price calculations
  const unit = (row.price_unit || "Lakhs").trim();
  const minMultiplier = unit.toLowerCase() === "cr" ? 10000000 : 100000;
  const priceStarting = row.price_min ? Number(row.price_min) * minMultiplier : 0;

  let priceDisplay = "Price on Request";
  if (row.price_min && row.price_max) {
    priceDisplay = `₹${row.price_min} ${unit} - ₹${row.price_max} ${unit}`;
  } else if (row.price_min) {
    priceDisplay = `From ₹${row.price_min} ${unit}`;
  }

  // Carpet area display
  let carpetArea = "On Request";
  if (row.carpet_area_min && row.carpet_area_max) {
    carpetArea = `${row.carpet_area_min} - ${row.carpet_area_max} sq.ft.`;
  } else if (row.carpet_area_min) {
    carpetArea = `${row.carpet_area_min} sq.ft.`;
  }

  // Images array assembly
  const images: string[] = [];
  if (row.cover_image_url?.trim()) {
    images.push(row.cover_image_url.trim());
  }
  if (Array.isArray(row.gallery_image_urls)) {
    row.gallery_image_urls.forEach((url) => {
      if (url && url.trim() && !images.includes(url.trim())) {
        images.push(url.trim());
      }
    });
  }
  if (images.length === 0) {
    images.push("/images/modern_building.png");
  }

  const slug = `${row.project_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${(row.location || "kalyan").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return {
    id: row.id,
    slug,
    title: row.project_name,
    developer: row.developer_name,
    tagline:
      row.possession_status_tag ||
      (row.description ? row.description.slice(0, 65) + "..." : "Premium Curated Real Estate"),
    category,
    listingType,
    possession,
    possessionDate:
      row.possession_text ||
      (row.status === "ready_to_move" ? "Ready to Move" : "Under Construction"),
    reraId: row.rera_number || "RERA Approved",
    location: {
      locality: row.location,
      city: detectCity(row.address, row.location),
      landmark: row.address,
    },
    priceStarting,
    priceDisplay,
    pricePerSqft: row.price_per_sqft
      ? `₹${Number(row.price_per_sqft).toLocaleString("en-IN")} / sq.ft.`
      : undefined,
    configurations:
      row.configurations && row.configurations.length > 0
        ? row.configurations
        : ["1 BHK", "2 BHK"],
    carpetArea,
    images,
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    description: row.description || "",
    zeroBrokerage: row.brokerage_label ? row.brokerage_label.includes("0%") : true,
    featured: Boolean(row.is_featured),
  };
}

export async function getPublishedProjectsServer(): Promise<Project[]> {
  try {
    if (!isSupabaseConfigured()) {
      return [];
    }
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) {
        console.warn("⚠️ [Supabase] Could not fetch projects from DB:", error.message);
      }
      return [];
    }

    return (data as ProjectRow[]).map(mapProjectRowToClient);
  } catch (err) {
    console.error("❌ [getPublishedProjectsServer] Error:", err);
    return [];
  }
}

