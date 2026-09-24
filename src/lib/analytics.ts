// ==============================================================================
// The PM Properties - Enterprise Google Analytics 4 (GA4) Tracking Client
// Measurement ID: G-ZC4KVNR69F
// ==============================================================================

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-ZC4KVNR69F";

// Global Window augmentation for Google tag
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Checks if window and gtag are ready
 */
export function isGtagAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.gtag === "function" &&
    Boolean(GA_MEASUREMENT_ID)
  );
}

/**
 * Clean debug logging in development mode
 */
function logDebug(eventName: string, params?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "development") {
    console.log(
      `%c[GA4] %c${eventName}`,
      "color: #8E1200; font-weight: bold;",
      "color: #1e293b; font-weight: 600;",
      params ?? ""
    );
  }
}

/**
 * Safe invocation of gtag
 */
export function safeGtag(
  command: "config" | "event" | "js" | "set",
  targetOrEvent: string | Date,
  params?: Record<string, unknown>
): void {
  if (!isGtagAvailable()) return;
  try {
    if (params) {
      window.gtag!(command, targetOrEvent, params);
    } else {
      window.gtag!(command, targetOrEvent);
    }
  } catch (err) {
    console.error("[GA4] Execution error:", err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Specific High-Value Event Dispatchers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 1. Track Page View
 * Fired on initial load and Next.js SPA client-side route navigations.
 */
export function trackPageView(url: string, title?: string): void {
  const pageTitle =
    title || (typeof document !== "undefined" ? document.title : "");
  const pageLocation =
    typeof window !== "undefined" ? window.location.href : url;

  logDebug("page_view", { page_path: url, page_title: pageTitle });

  safeGtag("event", "page_view", {
    page_title: pageTitle,
    page_location: pageLocation,
    page_path: url,
    send_to: GA_MEASUREMENT_ID,
  });
}

/**
 * 2. Track Scroll Depth Milestones (25%, 50%, 75%, 90%, 100%)
 */
export function trackScrollDepth(percent: number, pagePath: string): void {
  logDebug(`scroll_depth_${percent}%`, { percent, page_path: pagePath });

  // Standard GA4 scroll event
  safeGtag("event", "scroll", {
    percent_scrolled: percent,
    page_path: pagePath,
  });

  // Dedicated custom event for effortless Funnel creation in GA4 Explore
  safeGtag("event", "scroll_depth_milestone", {
    milestone_percent: percent,
    page_path: pagePath,
  });
}

/**
 * 3. Track CTA Button Clicks
 */
export interface CtaClickParams {
  ctaName: string;
  ctaLocation:
    | "header_desktop"
    | "header_mobile"
    | "hero_banner"
    | "bottom_cta_section"
    | "services_page"
    | "how_we_work_page"
    | "projects_page"
    | "contact_page"
    | "footer"
    | string;
  destination?: string;
  ctaType?: "button" | "link";
}

export function trackCtaClick(params: CtaClickParams): void {
  logDebug("cta_click", { ...params });

  safeGtag("event", "cta_click", {
    cta_name: params.ctaName,
    cta_location: params.ctaLocation,
    destination_url: params.destination || "",
    cta_type: params.ctaType || "button",
  });
}

/**
 * 4. Track Form Submits & Lead Conversions
 */
export interface LeadSubmissionParams {
  formName: "consultation_modal" | "contact_page_form" | string;
  status: "success" | "error";
  requirement?: string;
  priceRange?: string;
  propertyStage?: string;
  errorMessage?: string;
  source?: string;
}

export function trackLeadSubmission(params: LeadSubmissionParams): void {
  logDebug("lead_submission", { ...params });

  // Custom detailed form submit event
  safeGtag("event", "form_submit", {
    form_name: params.formName,
    submission_status: params.status,
    requirement: params.requirement || "unspecified",
    price_range: params.priceRange || "unspecified",
    property_stage: params.propertyStage || "unspecified",
    error_message: params.errorMessage || "",
    lead_source: params.source || "web",
  });

  // GA4 Recommended conversion event on success
  if (params.status === "success") {
    safeGtag("event", "generate_lead", {
      currency: "INR",
      value: 1, // Conversion weighting
      lead_type: params.requirement || "general_consultation",
      form_name: params.formName,
    });
  }
}

/**
 * 5. Track Project Card Interactions
 */
export interface ProjectClickParams {
  projectId: string;
  projectTitle: string;
  developer?: string;
  locality?: string;
  city?: string;
  price?: string;
  action:
    | "card_click"
    | "title_click"
    | "details_button"
    | "whatsapp_inquire"
    | "modal_open"
    | "brochure_download";
}

export function trackProjectClick(params: ProjectClickParams): void {
  logDebug("project_interaction", { ...params });

  // GA4 Recommended Content Selection event
  safeGtag("event", "select_content", {
    content_type: "project",
    item_id: params.projectId,
    item_name: params.projectTitle,
  });

  // Rich custom event for real estate funnel analysis
  safeGtag("event", "project_card_click", {
    project_id: params.projectId,
    project_title: params.projectTitle,
    developer: params.developer || "",
    locality: params.locality || "",
    city: params.city || "",
    price: params.price || "",
    interaction_action: params.action,
  });
}

/**
 * 6. Track Our Services Card Interactions
 */
export interface ServiceClickParams {
  serviceId: string;
  serviceTitle: string;
  category?: string;
  action?: "card_hover" | "card_click" | "whatsapp_enquire" | "view_details";
}

export function trackServiceClick(params: ServiceClickParams): void {
  logDebug("service_interaction", { ...params });

  // GA4 Recommended Content Selection event
  safeGtag("event", "select_content", {
    content_type: "service",
    item_id: params.serviceId,
    item_name: params.serviceTitle,
  });

  safeGtag("event", "service_card_click", {
    service_id: params.serviceId,
    service_title: params.serviceTitle,
    service_category: params.category || "",
    interaction_action: params.action || "card_click",
  });
}

/**
 * 7. Track Direct Contact Actions (WhatsApp, Phone, Email)
 */
export interface ContactClickParams {
  method: "whatsapp" | "phone" | "email" | "instagram" | "youtube" | "brochure_pdf";
  location:
    | "floating_widget"
    | "header"
    | "footer"
    | "project_card"
    | "project_modal"
    | "contact_page"
    | "services_page"
    | string;
  destination?: string;
  label?: string;
}

export function trackContactClick(params: ContactClickParams): void {
  logDebug("contact_interaction", { ...params });

  safeGtag("event", "contact_click", {
    contact_method: params.method,
    contact_location: params.location,
    contact_destination: params.destination || "",
    contact_label: params.label || "",
  });
}

/**
 * 8. Generic Custom Event Tracker
 */
export function trackCustomEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  logDebug(eventName, params);
  safeGtag("event", eventName, params);
}
