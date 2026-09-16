import { NextResponse } from "next/server";
import {
  getSupabaseServerClient,
  isSupabaseConfigured,
  LeadSource,
} from "@/lib/supabaseServer";
import { invalidateAnalyticsCache } from "@/lib/analyticsCache";
import { sendPushToAllSubscribers, getUnreadLeadsCount } from "@/lib/pushNotifications";
import {
  REQUIREMENTS,
  PRICE_RANGES,
  PROPERTY_STAGES,
} from "@/data/consultation";

const VALID_REQUIREMENTS = new Set(REQUIREMENTS.map((r) => r.id));
const VALID_PRICE_RANGES = new Set(PRICE_RANGES.map((p) => p.id));
const VALID_PROPERTY_STAGES = new Set(PROPERTY_STAGES.map((s) => s.id));
const VALID_SOURCES = new Set<LeadSource>(["modal", "contact_page", "website"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      phone,
      requirement,
      priceRange,
      propertyStage,
      source = "modal",
    } = body;

    const errors: Record<string, string> = {};

    // 1. Full Name Validation
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      errors.fullName = "Please enter your full name (minimum 2 characters).";
    } else if (fullName.trim().length > 100) {
      errors.fullName = "Full name must be under 100 characters.";
    }

    // 2. Phone Validation (Strict 10-digit Indian Mobile)
    const cleanPhone = typeof phone === "string" ? phone.replace(/\D/g, "") : "";
    if (!cleanPhone || cleanPhone.length !== 10) {
      errors.phone = "Please enter a valid 10-digit mobile number.";
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.phone = "Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.";
    }

    // 3. Requirement Selection Validation
    if (!requirement || !VALID_REQUIREMENTS.has(requirement)) {
      errors.requirement = "Please select a valid property requirement.";
    }

    // 4. Budget Range Validation
    if (!priceRange || !VALID_PRICE_RANGES.has(priceRange)) {
      errors.price = "Please select an estimated budget range.";
    }

    // 5. Property Stage Validation
    if (!propertyStage || !VALID_PROPERTY_STAGES.has(propertyStage)) {
      errors.stage = "Please select a property stage.";
    }

    // 6. Source validation
    const sanitizedSource: LeadSource = VALID_SOURCES.has(source) ? source : "modal";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          errors,
        },
        { status: 400 }
      );
    }

    // Check if Supabase credentials are configured in .env.local
    if (!isSupabaseConfigured()) {
      console.warn(
        "⚠️ [API /api/leads]: Supabase is not configured yet in .env.local. Returning dev preview response."
      );
      const devLeadId = "dev-lead-" + Date.now();

      // Trigger test push notification in dev mode (non-blocking)
      try {
        await sendPushToAllSubscribers({
          title: `New Lead: ${fullName.trim()}`,
          body: `${requirement} • ₹${priceRange} Lakhs • ${sanitizedSource.replace("_", " ")}`,
          url: `/admin/leads?id=${devLeadId}`,
          leadId: devLeadId,
          unreadCount: 1,
          tag: `lead-${devLeadId}`,
        });
      } catch (pushErr) {
        console.warn("⚠️ [Push] Push notification dispatch error (dev preview):", pushErr);
      }

      return NextResponse.json(
        {
          success: true,
          devMode: true,
          message:
            "Lead validated successfully! Add your Supabase credentials in .env.local to persist directly into PostgreSQL.",
          lead: {
            id: devLeadId,
            full_name: fullName.trim(),
            phone: cleanPhone,
            requirement,
            price_range: priceRange,
            property_stage: propertyStage,
            source: sanitizedSource,
            status: "new",
            is_read: false,
            created_at: new Date().toISOString(),
          },
        },
        { status: 201 }
      );
    }

    // Insert into Supabase
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        full_name: fullName.trim(),
        phone: cleanPhone,
        requirement,
        price_range: priceRange,
        property_stage: propertyStage,
        source: sanitizedSource,
        status: "new",
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.error("❌ [API /api/leads] Supabase insertion error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save consultation request to database.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    invalidateAnalyticsCache();

    // Trigger PWA Web Push notification to broker devices (non-blocking)
    try {
      const unreadCount = await getUnreadLeadsCount();
      await sendPushToAllSubscribers({
        title: `New Lead: ${fullName.trim()}`,
        body: `${requirement} • ₹${priceRange} Lakhs • ${sanitizedSource.replace("_", " ")}`,
        url: `/admin/leads?id=${data.id}`,
        leadId: data.id,
        unreadCount,
        tag: `lead-${data.id}`,
      });
    } catch (pushErr) {
      console.warn("⚠️ [Push] Web push notification dispatch error (non-blocking):", pushErr);
    }

    return NextResponse.json(
      {
        success: true,
        lead: data,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("❌ [API /api/leads] Unexpected error:", errorMsg);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while processing your request.",
        details: errorMsg,
      },
      { status: 500 }
    );
  }
}
