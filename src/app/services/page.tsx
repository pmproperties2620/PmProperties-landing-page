import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  DollarSign,
  Key,
  Handshake,
  Paintbrush,
  ShieldCheck,
  Building2,
  Warehouse,
  ArrowUpRight,
  Sparkles,
  Compass,
  Check,
  type LucideIcon,
} from "lucide-react";
import BookConsultationButton from "@/components/ui/BookConsultationButton";

export const metadata: Metadata = {
  title: "Our Services | PM Properties",
  description:
    "Comprehensive residential, specialized, and commercial real estate solutions tailored to your unique property goals.",
};

interface ServiceSpec {
  scope: string;
  timeline: string;
  deliverable: string;
}

interface ServiceItem {
  id: string;
  code: string;
  categoryTag: string;
  icon: LucideIcon;
  title: string;
  description: string;
  specs: ServiceSpec;
  schematicType:
    | "floorplan"
    | "elevation"
    | "lease"
    | "strategy"
    | "interior"
    | "grill"
    | "commercial"
    | "warehouse";
  inquiryMessage: string;
}

const residentialServices: ServiceItem[] = [
  {
    id: "buying",
    code: "RES-ACQ // 01",
    categoryTag: "Acquisitions",
    icon: Search,
    title: "Property Buying",
    description:
      "From curated luxury listings to rigorous price negotiations, we guide you to your ideal home with total confidence.",
    specs: {
      scope: "Luxury Villas, Apartments & Plots",
      timeline: "15 to 45 Days Average",
      deliverable: "Title Clearance & Deal Closing",
    },
    schematicType: "floorplan",
    inquiryMessage: "Hi PM Properties, I would like to inquire about Property Buying services.",
  },
  {
    id: "selling",
    code: "RES-DSP // 02",
    categoryTag: "Dispositions",
    icon: DollarSign,
    title: "Property Selling",
    description:
      "Maximize property valuation through strategic staging, drone media, and targeted high-net-worth buyer outreach.",
    specs: {
      scope: "Premium Residential Assets",
      timeline: "Fast-Track Buyer Sourcing",
      deliverable: "Max Valuation & Closing Support",
    },
    schematicType: "elevation",
    inquiryMessage: "Hi PM Properties, I would like to inquire about Property Selling services.",
  },
  {
    id: "renting",
    code: "RES-LSE // 03",
    categoryTag: "Leasing",
    icon: Key,
    title: "Property Renting",
    description:
      "Discover prime rental residences or secure reliable, vetted corporate tenants for consistent investment returns.",
    specs: {
      scope: "High-End Rentals & Penthouse Suites",
      timeline: "7 to 14 Days Placement",
      deliverable: "Vetted Tenants & Registered Lease",
    },
    schematicType: "lease",
    inquiryMessage: "Hi PM Properties, I would like to inquire about Property Renting services.",
  },
  {
    id: "consultation",
    code: "RES-ADV // 04",
    categoryTag: "Advisory",
    icon: Handshake,
    title: "Property Consultation",
    description:
      "Strategic portfolio advisory, market cycle intelligence, and yield forecasting from seasoned industry specialists.",
    specs: {
      scope: "Portfolio & Capital Allocation",
      timeline: "Dedicated 1-on-1 Sessions",
      deliverable: "Custom Market & ROI Roadmap",
    },
    schematicType: "strategy",
    inquiryMessage: "Hi PM Properties, I would like to inquire about Property Consultation services.",
  },
];

const specializedServices: ServiceItem[] = [
  {
    id: "interior-design",
    code: "SPC-INT // 05",
    categoryTag: "Turnkey Interiors",
    icon: Paintbrush,
    title: "Interior Design",
    description:
      "Bespoke architectural concepts, customized modular carpentry, and complete end-to-end turnkey execution.",
    specs: {
      scope: "Bespoke Residential & Offices",
      timeline: "45 to 60 Days Handover",
      deliverable: "3D Visuals & Turnkey Finish",
    },
    schematicType: "interior",
    inquiryMessage: "Hi PM Properties, I would like to inquire about Interior Design services.",
  },
  {
    id: "invisible-grills",
    code: "SPC-SEC // 06",
    categoryTag: "Architectural Safety",
    icon: ShieldCheck,
    title: "Invisible Grills",
    description:
      "Grade-316 stainless steel safety cable systems safeguarding balconies and windows without compromising views.",
    specs: {
      scope: "Balconies, French Windows, Terraces",
      timeline: "24 to 48 Hour Installation",
      deliverable: "Grade-316 Steel Warranty",
    },
    schematicType: "grill",
    inquiryMessage: "Hi PM Properties, I would like to inquire about Invisible Grills installation.",
  },
  {
    id: "commercial-buy-sell",
    code: "COM-AST // 07",
    categoryTag: "Commercial Assets",
    icon: Building2,
    title: "Commercial Property (Buy/Sell)",
    description:
      "High-grade corporate offices, retail showrooms, and institutional plots engineered for optimal rental yields.",
    specs: {
      scope: "Grade-A Offices & Retail Strips",
      timeline: "Bespoke Mandate Cycle",
      deliverable: "Institutional Yield Advisory",
    },
    schematicType: "commercial",
    inquiryMessage: "Hi PM Properties, I would like to inquire about Commercial Property (Buy/Sell) services.",
  },
  {
    id: "commercial-industrial-rental",
    code: "COM-IND // 08",
    categoryTag: "Industrial Logistics",
    icon: Warehouse,
    title: "Commercial & Industrial Rental",
    description:
      "Expansive Grade-A logistics warehouses, manufacturing plants, and corporate leasing spaces built for scale.",
    specs: {
      scope: "Warehouses, Logistics & Sheds",
      timeline: "Rapid Site Match",
      deliverable: "Compliant Long-Term Leases",
    },
    schematicType: "warehouse",
    inquiryMessage: "Hi PM Properties, I would like to inquire about Commercial & Industrial Rental spaces.",
  },
];

/* ─── Bespoke Architectural Vector Schematics ────────────────── */
function SchematicGraphic({ type }: { type: ServiceItem["schematicType"] }) {
  switch (type) {
    case "floorplan":
      return (
        <svg viewBox="0 0 200 120" fill="none" className="w-full h-full stroke-current">
          {/* Architectural room boundary */}
          <rect x="15" y="15" width="170" height="90" strokeWidth="1.2" strokeDasharray="3 2" />
          <rect x="25" y="25" width="90" height="70" strokeWidth="1" />
          <rect x="120" y="25" width="55" height="40" strokeWidth="1" />
          <rect x="120" y="70" width="55" height="25" strokeWidth="1" />
          {/* Door arc swing */}
          <path d="M75 95 A 20 20 0 0 0 95 75" strokeWidth="0.8" strokeDasharray="2 2" />
          <line x1="75" y1="95" x2="95" y2="95" strokeWidth="1" />
          {/* Dimension indicator */}
          <line x1="25" y1="18" x2="115" y2="18" strokeWidth="0.6" />
          <text x="65" y="14" fill="currentColor" stroke="none" fontSize="6" fontFamily="monospace" textAnchor="middle">
            8.50m
          </text>
          {/* North Compass Arrow */}
          <circle cx="170" cy="35" r="7" strokeWidth="0.6" />
          <line x1="170" y1="31" x2="170" y2="39" strokeWidth="0.8" />
          <line x1="166" y1="35" x2="174" y2="35" strokeWidth="0.8" />
          <text x="170" y="27" fill="currentColor" stroke="none" fontSize="5" fontFamily="monospace" textAnchor="middle">
            N
          </text>
        </svg>
      );
    case "elevation":
      return (
        <svg viewBox="0 0 200 120" fill="none" className="w-full h-full stroke-current">
          {/* House elevation outline */}
          <line x1="10" y1="105" x2="190" y2="105" strokeWidth="1.2" />
          <rect x="35" y="45" width="130" height="60" strokeWidth="1" />
          <polygon points="30,45 100,15 170,45" strokeWidth="1" />
          {/* Balcony & Windows */}
          <rect x="50" y="55" width="35" height="30" strokeWidth="0.8" />
          <line x1="67.5" y1="55" x2="67.5" y2="85" strokeWidth="0.6" />
          <line x1="50" y1="70" x2="85" y2="70" strokeWidth="0.6" />
          <rect x="110" y="55" width="35" height="50" strokeWidth="0.8" />
          {/* Elevation Level Marks */}
          <line x1="175" y1="15" x2="190" y2="15" strokeWidth="0.6" />
          <text x="182" y="12" fill="currentColor" stroke="none" fontSize="6" fontFamily="monospace" textAnchor="middle">
            +7.2m
          </text>
          <line x1="175" y1="45" x2="190" y2="45" strokeWidth="0.6" />
          <text x="182" y="42" fill="currentColor" stroke="none" fontSize="6" fontFamily="monospace" textAnchor="middle">
            +3.5m
          </text>
        </svg>
      );
    case "lease":
      return (
        <svg viewBox="0 0 200 120" fill="none" className="w-full h-full stroke-current">
          {/* Contract / Registry sheet */}
          <rect x="40" y="15" width="120" height="90" rx="3" strokeWidth="1" />
          <line x1="55" y1="30" x2="115" y2="30" strokeWidth="1.5" />
          <line x1="55" y1="42" x2="145" y2="42" strokeWidth="0.6" strokeDasharray="3 3" />
          <line x1="55" y1="52" x2="145" y2="52" strokeWidth="0.6" strokeDasharray="3 3" />
          <line x1="55" y1="62" x2="130" y2="62" strokeWidth="0.6" strokeDasharray="3 3" />
          {/* Key Graphic */}
          <circle cx="120" cy="80" r="8" strokeWidth="1" />
          <line x1="128" y1="80" x2="145" y2="80" strokeWidth="1.2" />
          <line x1="140" y1="80" x2="140" y2="85" strokeWidth="1.2" />
          <line x1="144" y1="80" x2="144" y2="84" strokeWidth="1.2" />
          {/* Verification stamp */}
          <circle cx="75" cy="80" r="12" strokeWidth="0.8" strokeDasharray="2 2" />
          <path d="M70 80 L74 84 L81 76" strokeWidth="1" />
        </svg>
      );
    case "strategy":
      return (
        <svg viewBox="0 0 200 120" fill="none" className="w-full h-full stroke-current">
          {/* Coordinate grid & growth trajectory */}
          <line x1="30" y1="15" x2="30" y2="105" strokeWidth="0.8" />
          <line x1="30" y1="105" x2="180" y2="105" strokeWidth="0.8" />
          {/* Grid lines */}
          <line x1="30" y1="75" x2="180" y2="75" strokeWidth="0.4" strokeDasharray="2 2" />
          <line x1="30" y1="45" x2="180" y2="45" strokeWidth="0.4" strokeDasharray="2 2" />
          {/* Growth curve */}
          <path d="M35 95 Q 85 85 110 55 T 175 25" strokeWidth="1.5" />
          {/* Node points */}
          <circle cx="35" cy="95" r="2.5" fill="currentColor" />
          <circle cx="85" cy="75" r="2.5" fill="currentColor" />
          <circle cx="130" cy="45" r="2.5" fill="currentColor" />
          <circle cx="175" cy="25" r="3" fill="currentColor" />
          <text x="175" y="16" fill="currentColor" stroke="none" fontSize="6" fontFamily="monospace" textAnchor="middle">
            MAX ROI
          </text>
        </svg>
      );
    case "interior":
      return (
        <svg viewBox="0 0 200 120" fill="none" className="w-full h-full stroke-current">
          {/* 3D Isometric room corner */}
          <line x1="100" y1="20" x2="100" y2="100" strokeWidth="1" />
          <line x1="100" y1="100" x2="25" y2="60" strokeWidth="1" />
          <line x1="100" y1="100" x2="175" y2="60" strokeWidth="1" />
          {/* Modular cabinetry schematic */}
          <polygon points="110,65 155,40 155,75 110,95" strokeWidth="0.8" />
          <line x1="132" y1="52" x2="132" y2="85" strokeWidth="0.6" />
          {/* Pendant light line */}
          <line x1="60" y1="20" x2="60" y2="55" strokeWidth="0.6" />
          <circle cx="60" cy="60" r="6" strokeWidth="0.8" />
        </svg>
      );
    case "grill":
      return (
        <svg viewBox="0 0 200 120" fill="none" className="w-full h-full stroke-current">
          {/* Architectural Balcony Frame */}
          <rect x="25" y="20" width="150" height="80" rx="2" strokeWidth="1" />
          {/* High-tensile vertical cables */}
          {[40, 55, 70, 85, 100, 115, 130, 145, 160].map((x) => (
            <line key={x} x1={x} y1="20" x2={x} y2="100" strokeWidth="0.6" strokeDasharray="1 1" />
          ))}
          {/* Top and Bottom tension track */}
          <line x1="25" y1="26" x2="175" y2="26" strokeWidth="0.8" />
          <line x1="25" y1="94" x2="175" y2="94" strokeWidth="0.8" />
          {/* Grade-316 Spec Tag */}
          <text x="100" y="112" fill="currentColor" stroke="none" fontSize="5.5" fontFamily="monospace" textAnchor="middle">
            GRADE-316 SS // 2.0mm HIGH-TENSILE
          </text>
        </svg>
      );
    case "commercial":
      return (
        <svg viewBox="0 0 200 120" fill="none" className="w-full h-full stroke-current">
          {/* Modern corporate glass tower */}
          <polygon points="50,110 50,25 110,15 110,110" strokeWidth="1" />
          <polygon points="110,15 160,35 160,110 110,110" strokeWidth="1" />
          {/* Glass facade floor divisions */}
          {[35, 50, 65, 80, 95].map((y) => (
            <line key={y} x1="50" y1={y} x2="110" y2={y - 8} strokeWidth="0.6" />
          ))}
          {[45, 60, 75, 90, 105].map((y) => (
            <line key={y} x1="110" y1={y - 12} x2="160" y2={y} strokeWidth="0.6" />
          ))}
        </svg>
      );
    case "warehouse":
      return (
        <svg viewBox="0 0 200 120" fill="none" className="w-full h-full stroke-current">
          {/* Industrial truss structure */}
          <line x1="15" y1="105" x2="185" y2="105" strokeWidth="1" />
          <polygon points="25,105 25,60 100,30 175,60 175,105" strokeWidth="1" />
          {/* Roof trusses */}
          <line x1="25" y1="60" x2="175" y2="60" strokeWidth="0.8" />
          <line x1="60" y1="60" x2="100" y2="30" strokeWidth="0.6" />
          <line x1="140" y1="60" x2="100" y2="30" strokeWidth="0.6" />
          {/* Loading dock bay doors */}
          <rect x="40" y="75" width="30" height="30" strokeWidth="0.8" />
          <rect x="85" y="75" width="30" height="30" strokeWidth="0.8" />
          <rect x="130" y="75" width="30" height="30" strokeWidth="0.8" />
        </svg>
      );
  }
}

export default function ServicesPage() {
  return (
    <>
      {/* ─── Hero Section (Kept Unchanged) ─────────────────────────── */}
      <section className="relative min-h-[60vh] flex flex-col justify-center py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg-new.png"
            alt="Our Services"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/95 via-red-500/75 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Everything you need to buy, sell, or invest in real estate — all under one roof.
          </p>
        </div>
      </section>

      {/* ─── Categorized Architectural Blueprint Services ─────────── */}
      <section className="relative py-20 sm:py-28 bg-[#FAF7F5] overflow-hidden">
        {/* Subtle Architectural Grid Canvas */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #d8cac6 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />

        {/* Ambient atmospheric backdrop accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-brand-100/30 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ════ Category 1: Residential Services (Featured Tier) ════ */}
          <div>
            {/* Category Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#FDE8E8] text-brand-600 border border-brand-200/70 shadow-xs mb-3.5">
                <Compass className="w-3.5 h-3.5 text-brand-600" />
                <span>Primary Practice</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
                Residential Services
              </h2>
              <p className="text-base sm:text-lg text-slate-600 font-normal">
                Everything you need to buy, sell, or rent a home
              </p>
            </div>

            {/* 2x2 Grid (Desktop 2 cols, Mobile 1 col) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-8 max-w-5xl mx-auto">
              {residentialServices.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.id}
                    href={`https://wa.me/919029923246?text=${encodeURIComponent(service.inquiryMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_24px_50px_-12px_rgba(73,22,18,0.16)] hover:border-brand-300 transition-all duration-300 ease-out hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Top Architectural Blueprint Visor Bar */}
                    <div className="relative h-28 sm:h-32 bg-gradient-to-b from-[#F7F2F0] to-[#FAF6F4] border-b border-slate-200/70 p-4 sm:p-5 flex items-center justify-between overflow-hidden">
                      {/* Blueprint Graphic Inset */}
                      <div className="absolute right-3 top-2 bottom-2 w-48 text-brand-900/15 group-hover:text-brand-700/25 transition-colors duration-300 pointer-events-none">
                        <SchematicGraphic type={service.schematicType} />
                      </div>

                      {/* Left: Code Spec & Icon */}
                      <div className="relative z-10 flex items-center gap-3.5">
                        {/* Soft Pink Rounded-XL Icon Box */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FDE8E8] border border-brand-200/60 flex items-center justify-center text-brand-600 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:bg-[#FCD8D8]">
                          <Icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.8} />
                        </div>
                        <div>
                          <span className="block text-[11px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                            {service.code}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/90 text-brand-700 border border-brand-200/50 shadow-2xs mt-1">
                            {service.categoryTag}
                          </span>
                        </div>
                      </div>

                      {/* Top Right Action Arrow Badge */}
                      <div className="relative z-10 w-9 h-9 rounded-full bg-white/90 border border-slate-200/70 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-all duration-300 shadow-2xs">
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>

                    {/* Middle Content Area */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title */}
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2.5 tracking-tight group-hover:text-brand-600 transition-colors duration-200">
                          {service.title}
                        </h3>

                        {/* 2-line max description */}
                        <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed line-clamp-2 mb-6">
                          {service.description}
                        </p>
                      </div>

                      {/* Architectural Service Specification Table */}
                      <div className="bg-[#FAF7F6] rounded-2xl p-3.5 sm:p-4 border border-slate-200/70 space-y-2 mb-5">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                              Scope
                            </span>
                            <span className="font-medium text-slate-800 line-clamp-1">
                              {service.specs.scope}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                              Timeline
                            </span>
                            <span className="font-medium text-slate-800 line-clamp-1">
                              {service.specs.timeline}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                              Deliverable
                            </span>
                            <span className="font-medium text-brand-700 font-semibold line-clamp-1">
                              {service.specs.deliverable}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom CTA Affordance */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-500 group-hover:text-slate-900 transition-colors duration-200">
                          Verified Brokerage Mandate
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-brand-600 font-bold uppercase tracking-wider text-[11px] group-hover:translate-x-0.5 transition-transform duration-200">
                          Consult on WhatsApp &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ════ Architectural Section Divider ════ */}
          <div className="my-16 sm:my-24 max-w-5xl mx-auto flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-slate-200" />
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-semibold text-slate-600">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              <span>Specialized &amp; Commercial Solutions</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-slate-300 to-transparent" />
          </div>

          {/* ════ Category 2: Specialized & Commercial Services (Secondary Tier) ════ */}
          <div>
            {/* Category Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#FDE8E8] text-brand-600 border border-brand-200/70 shadow-xs mb-3.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Specialized Practice</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
                Specialized &amp; Commercial Services
              </h2>
              <p className="text-base sm:text-lg text-slate-600 font-normal">
                Beyond the basics — design, safety, and commercial solutions.
              </p>
            </div>

            {/* 3-Column Desktop Grid (Wraps to 2 on Tablet, 1 on Mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {specializedServices.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.id}
                    href={`https://wa.me/919029923246?text=${encodeURIComponent(service.inquiryMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-12px_rgba(73,22,18,0.15)] hover:border-brand-300 transition-all duration-300 ease-out hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Top Blueprint Inset Visor Bar */}
                    <div className="relative h-24 sm:h-26 bg-gradient-to-b from-[#F7F2F0] to-[#FAF6F4] border-b border-slate-200/70 p-4 flex items-center justify-between overflow-hidden">
                      {/* Blueprint Graphic */}
                      <div className="absolute right-2 top-2 bottom-2 w-40 text-brand-900/15 group-hover:text-brand-700/25 transition-colors duration-300 pointer-events-none">
                        <SchematicGraphic type={service.schematicType} />
                      </div>

                      {/* Left: Code Spec & Smaller Icon (Secondary Tier) */}
                      <div className="relative z-10 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#FDE8E8] border border-brand-200/60 flex items-center justify-center text-brand-600 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:bg-[#FCD8D8]">
                          <Icon className="w-6 h-6" strokeWidth={1.8} />
                        </div>
                        <div>
                          <span className="block text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                            {service.code}
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-white/90 text-brand-700 border border-brand-200/50 shadow-2xs mt-0.5">
                            {service.categoryTag}
                          </span>
                        </div>
                      </div>

                      {/* Top Right Action Arrow */}
                      <div className="relative z-10 w-8 h-8 rounded-full bg-white/90 border border-slate-200/70 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-all duration-300 shadow-2xs">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Middle Content */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 tracking-tight group-hover:text-brand-600 transition-colors duration-200">
                          {service.title}
                        </h3>

                        {/* 2-line max description */}
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-5">
                          {service.description}
                        </p>
                      </div>

                      {/* Mini Spec Sheet */}
                      <div className="bg-[#FAF7F6] rounded-xl p-3 border border-slate-200/70 space-y-1.5 mb-4 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                            Scope
                          </span>
                          <span className="font-medium text-slate-800 line-clamp-1 text-right max-w-[65%]">
                            {service.specs.scope}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                            Key Benefit
                          </span>
                          <span className="font-semibold text-brand-700 line-clamp-1 text-right max-w-[65%]">
                            {service.specs.deliverable}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Action Footer */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-400 text-[11px]">Turnkey / Mandate</span>
                        <span className="text-brand-600 text-[11px] font-bold uppercase tracking-wider group-hover:translate-x-0.5 transition-transform duration-200">
                          Inquire &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bottom Navy Band (Kept Unchanged) ────────────────────── */}
      <section className="py-16 sm:py-20 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Not Sure What You Need?
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Book a free no-obligation consultation. We&apos;ll listen to your goals and recommend the
            perfect plan.
          </p>
          <BookConsultationButton className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-brand-700 transition-all shadow-lg cursor-pointer">
            Book a Free Consultation
          </BookConsultationButton>
        </div>
      </section>
    </>
  );
}
