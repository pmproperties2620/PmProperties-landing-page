import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  Scale,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import LegalTableOfContents from "@/components/legal/LegalTableOfContents";
import { getPageBanner } from "@/lib/contentQueries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Disclaimer & Legal Disclosures | PM Properties",
  description:
    "Important regulatory disclosures regarding MahaRERA registration, real estate intermediary status, property pricing, project details, and zero brokerage terms.",
};

const sections = [
  { id: "nature-of-business", title: "Nature of Business & Intermediary Role" },
  { id: "maharera-compliance", title: "MahaRERA Regulatory Disclosures" },
  { id: "property-accuracy", title: "Property Details, Pricing & Availability" },
  { id: "zero-brokerage-terms", title: "'0% Brokerage' Policy Clarification" },
  { id: "no-financial-advice", title: "No Legal, Tax or Financial Advice" },
  { id: "developer-trademarks", title: "Developer Content, Logos & Floorplans" },
  { id: "external-links", title: "External Platforms & WhatsApp Links" },
  { id: "testimonials-notice", title: "Client Testimonials & Results Notice" },
  { id: "limitation-liability", title: "Limitation of Liability" },
  { id: "governing-law", title: "Jurisdiction & Governing Law" },
  { id: "contact-queries", title: "Compliance & Clarification Contact" },
];

export default async function DisclaimerPage() {
  const bannerUrl = await getPageBanner("how_we_work");

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-slate-900 font-sans antialiased">
      {/* ── Hero Page Banner ── */}
      <section className="relative min-h-[38vh] sm:min-h-[44vh] flex flex-col justify-center py-16 sm:py-22 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerUrl}
            alt="Disclaimer - PM Properties"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/95 via-red-600/80 to-red-950/50" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center w-full">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-heading font-semibold uppercase tracking-[0.05em] mb-4">
              <Scale className="w-4 h-4 text-amber-300" />
              <span>Statutory Legal Notice &amp; Disclosures</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white mb-3 leading-[1.15] tracking-[-0.02em]">
              Disclaimer &amp; Disclosures
            </h1>
            <p className="font-body font-normal text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-[1.6]">
              Last Updated: March 2026 &bull; Real Estate (Regulation and Development) Act (RERA) Compliance
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Breadcrumb Navigation ── */}
      <div className="bg-white border-b border-slate-200/90 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3.5 flex items-center gap-2 text-xs font-body text-slate-500">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-medium">Disclaimer</span>
        </div>
      </div>

      {/* ── Main Content Grid Body ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ── Left Sticky Sidebar (Dual Card: TOC + Questions Card) ── */}
          <LegalTableOfContents
            sections={sections}
            supportHelpText="Questions regarding project disclosures, MahaRERA filings, or developer mandates?"
          />

          {/* ── Right Content: Separate Clean White Cards per Section ── */}
          <article className="col-span-12 lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Regulatory Notice Banner Card */}
            <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex items-start gap-4 text-amber-950 font-body text-xs sm:text-sm leading-[1.7]">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-heading font-bold block text-sm text-amber-900 mb-1">
                  Important Public Notice for Property Buyers &amp; Investors
                </strong>
                The information provided on this website is for general informational, educational, and lead-facilitation purposes only. It does not constitute an offer, contractual solicitation, or guarantee by PM Properties. All real estate transactions are subject to market conditions and developer contractual terms.
              </div>
            </div>

            {/* Section 1 */}
            <section
              id="nature-of-business"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  01
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  Nature of Business &amp; Intermediary Role
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  <strong>The PM Properties</strong> (&ldquo;PM Properties&rdquo;) operates strictly in the capacity of an independent <strong>Real Estate Broker, Channel Partner, and Advisory Consultancy</strong>.
                </p>
                <div className="bg-slate-50/90 rounded-xl p-4 border border-slate-200/80 space-y-2">
                  <p>
                    <strong className="text-slate-950 font-heading">We are NOT the developer, builder, architect, or promoter</strong> of the newly constructed residential or commercial projects displayed on this website (including, without limitation, Regency Antilia, Lodha Palava, Runwal Gardens, or any other third-party developments).
                  </p>
                  <p>
                    Our role is limited to marketing, arranging site visits, guiding prospective purchasers on market inventory, and facilitating interactions between buyers/tenants and verified developers or property owners. The formal contract of sale, allotment letter, agreement for sale, or lease deed is executed strictly and directly between the purchaser/tenant and the respective promoter or title owner.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section
              id="maharera-compliance"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  02
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  MahaRERA Regulatory Disclosures
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  We strictly uphold the compliance standards prescribed under the <em>Real Estate (Regulation and Development) Act, 2016 (RERA)</em> and the rules promulgated by the <strong>Maharashtra Real Estate Regulatory Authority (MahaRERA)</strong>.
                </p>
                <ul className="space-y-2.5 my-3">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">Brokerage Registration &amp; Affiliation:</strong> Authorized real estate advisory consultancy and verified member of the Kalyan Dombivli Realtors Welfare Association (KDRA).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">Project RERA Registration Numbers:</strong> Featured MahaRERA numbers across our listing cards belong solely to the respective developers and projects.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">Independent Verification:</strong> Prospective buyers are strongly advised to independently verify all registered details on the official MahaRERA website at{" "}
                      <a
                        href="https://maharera.maharashtra.gov.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-600 underline inline-flex items-center gap-1 font-semibold"
                      >
                        maharera.maharashtra.gov.in <ExternalLink className="w-3 h-3 inline" />
                      </a>.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section
              id="property-accuracy"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  03
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  Property Details, Pricing &amp; Availability
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  While PM Properties exercises reasonable diligence to source current and authentic data from developers and authorized property owners:
                </p>
                <ul className="space-y-2.5 my-3">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span><strong>Pricing &amp; Rates:</strong> Displayed pricing is indicative baseline developer figures and is subject to immediate revision without notice.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span><strong>Inventory &amp; Unit Availability:</strong> Configurations (1 BHK, 2 BHK, 3 BHK), floor levels, and tower inventories change rapidly based on real-time developer bookings.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span><strong>Carpet Areas:</strong> Stated areas reflect RERA usable carpet areas declared by developers. Specific unit measurements must be verified against sanctioned layout plans.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span><strong>Possession Schedules:</strong> Projected timelines reflect developer announcements and official MahaRERA filings, subject to promoter timeline revisions.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section
              id="zero-brokerage-terms"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  04
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  &ldquo;0% Brokerage&rdquo; Policy Terms
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  The promotional <strong>&ldquo;0% Brokerage&rdquo;</strong> badge displayed across select residential and commercial projects is governed by clear industry guidelines:
                </p>
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 text-emerald-950 space-y-2 leading-relaxed">
                  <p>
                    <strong>Direct Builder Bookings:</strong> The zero-brokerage benefit applies strictly to prospective buyers purchasing <strong>fresh inventory directly from partner real estate developers</strong> in projects where PM Properties acts as an authorized channel partner remunerated directly by the promoter.
                  </p>
                  <p>
                    <strong>Resale, Lease &amp; Bespoke Mandates:</strong> Secondary market transactions (resale flats, existing homeowner sales), tenancy leases, and custom mandates are subject to customary advisory commissions agreed upon in writing prior to closure.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section
              id="no-financial-advice"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  05
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  No Legal, Tax or Financial Advice
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  Content published on this website, consultation calls, WhatsApp exchanges, and brochures provided by our advisors are intended to facilitate property discovery:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 mt-2">
                  <li>Nothing on this website constitutes chartered accountancy, formal financial advisory, capital gains tax guidance, structural engineering assessments, or title certification.</li>
                  <li>Projected rental yields, appreciation estimates, and infrastructure growth indicators reflect historical market trends and do not guarantee future returns.</li>
                  <li>Clients are advised to engage independent legal advocates for title search and chartered accountants for taxation analysis before committing financially.</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section
              id="developer-trademarks"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  06
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  Developer Content, Logos &amp; Floorplans
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  All developer trademarks, corporate logos (including Regency Group, Lodha Group, Runwal Group, Godrej Properties, Kalpataru, Hiranandani Communities, etc.), project names, elevations, 3D artist renderings, and project brochures belong to their respective copyright and trademark owners.
                </p>
                <p>
                  Their display on this platform is solely for informational identification of properties where PM Properties provides channel partner advisory and does not imply endorsement or ownership of those proprietary assets.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section
              id="external-links"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  07
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  External Platforms &amp; WhatsApp Links
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  Our website includes external links to third-party platforms, such as WhatsApp (Meta Platforms, Inc.), Google Maps, YouTube, Instagram, and government portals (MahaRERA). We do not control or assume responsibility for the privacy practices or content of these external services. Your interactions with third-party platforms are governed exclusively by their respective terms.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section
              id="testimonials-notice"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  08
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  Client Testimonials &amp; Results Notice
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  Photographs and testimonials displayed under our &ldquo;Client Love&rdquo; and &ldquo;Our Journey&rdquo; sections depict real families assisted by PM Properties. These testimonials represent individual experiences. Past closing timelines, negotiated discounts, or market outcomes achieved for one client do not guarantee identical results for future transactions, as real estate transactions vary based on personal parameters.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section
              id="limitation-liability"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  09
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  Limitation of Liability
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  To the fullest extent permissible by applicable law, The PM Properties, its founder Pritesh Pravin Mhamunkar, affiliates, and advisors shall not be liable for:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 mt-2">
                  <li>Typographical inaccuracies, inadvertent omissions, or outdated pricing displayed on the website.</li>
                  <li>Developer construction delays, force majeure events, material specification alterations, or failure of developers to deliver amenities as advertised.</li>
                  <li>Financial investment decisions made solely based on website information without independent legal and financial due diligence.</li>
                </ul>
              </div>
            </section>

            {/* Section 10 */}
            <section
              id="governing-law"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  10
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  Jurisdiction &amp; Governing Law
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  This Disclaimer, website terms, and all real estate advisory interactions shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising in connection with this platform shall be subject to the exclusive jurisdiction of the competent courts in <strong>Kalyan / Thane District, Maharashtra</strong>.
                </p>
              </div>
            </section>

            {/* Section 11 — REDESIGNED IN-DEPTH WHITE CONTACT CARD */}
            <section
              id="contact-queries"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xl shadow-slate-200/60 relative overflow-hidden ring-1 ring-slate-100 before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-brand-600 before:via-red-500 before:to-brand-700 transition-all"
            >
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-brand-700 text-xs font-heading font-bold uppercase tracking-wider mb-2.5">
                  <Building2 className="w-3.5 h-3.5 text-brand-600" />
                  <span>Regulatory Advisory Desk</span>
                </div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-slate-950 tracking-tight">
                  The PM Properties
                </h3>
                <p className="text-sm text-slate-600 mt-1 font-body">
                  Principal Real Estate Consultant: <strong className="text-slate-950 font-semibold">Pritesh Pravin Mhamunkar</strong>
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-xs text-slate-600 font-body">
                  <span className="font-semibold text-slate-900">Member: KDRA (Kalyan Dombivli Realtors Welfare Association)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100 text-xs sm:text-sm font-body">
                {/* Phone */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-red-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 text-brand-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-heading font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Direct Phone / WhatsApp
                    </span>
                    <a
                      href="tel:+919029923246"
                      className="font-bold text-slate-950 hover:text-brand-600 transition-colors"
                    >
                      +91 90299 23246 / 99877 23246
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-red-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 text-brand-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-heading font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Official Clarification Email
                    </span>
                    <a
                      href="mailto:thepmproperties4u@gmail.com"
                      className="font-bold text-slate-950 hover:text-brand-600 transition-colors break-all"
                    >
                      thepmproperties4u@gmail.com
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 sm:col-span-2">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-heading font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Office Location
                    </span>
                    <p className="text-slate-800 font-medium leading-snug">
                      Shop No: 6, Gangeshwar Maya CHS, Opp KDMC H Ward Office, Phule Road, Dombivli West 421202, Maharashtra, India
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 sm:col-span-2">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 text-brand-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-heading font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Office Hours
                    </span>
                    <p className="text-slate-800 font-medium">
                      Monday – Sunday, 10:00 AM – 10:00 PM (All 7 Days)
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}
