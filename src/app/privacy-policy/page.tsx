import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import LegalTableOfContents from "@/components/legal/LegalTableOfContents";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPageBanner } from "@/lib/contentQueries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy | PM Properties",
  description:
    "Read how PM Properties protects client inquiry details in full compliance with the Digital Personal Data Protection (DPDP) Act and MahaRERA mandates.",
  alternates: {
    canonical: "https://www.thepmproperties.in/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | PM Properties",
    description:
      "Information governance, data privacy, and compliance guidelines governing property inquiries and advisory interactions at PM Properties.",
    url: "https://www.thepmproperties.in/privacy-policy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | PM Properties",
    description:
      "Information governance, data privacy, and compliance guidelines governing property inquiries and advisory interactions at PM Properties.",
  },
};

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "data-we-collect", title: "Information We Collect" },
  { id: "collection-methods", title: "How Data is Collected" },
  { id: "purpose-use", title: "How We Use Your Information" },
  { id: "storage-security", title: "Data Storage & Security" },
  { id: "third-parties", title: "Data Sharing & Confidentiality" },
  { id: "cookies-analytics", title: "Cookies & Website Analytics" },
  { id: "user-rights", title: "Your Rights (DPDP Act, 2023 - India)" },
  { id: "retention", title: "Data Retention Policy" },
  { id: "minors", title: "Minors & Children's Privacy" },
  { id: "policy-updates", title: "Changes to This Privacy Policy" },
  { id: "contact-desk", title: "Contact Us & Grievance Redressal" },
];

export default async function PrivacyPolicyPage() {
  const bannerUrl = await getPageBanner("about");

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-slate-900 font-sans antialiased">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.thepmproperties.in" },
          { name: "Privacy Policy", url: "https://www.thepmproperties.in/privacy-policy" },
        ]}
      />
      {/* ── Hero Page Banner ── */}
      <section className="relative min-h-[38vh] sm:min-h-[44vh] flex flex-col justify-center py-16 sm:py-22 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerUrl}
            alt="Privacy Policy - PM Properties"
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
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Data Protection &amp; Privacy</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white mb-3 leading-[1.15] tracking-[-0.02em]">
              Privacy Policy
            </h1>
            <p className="font-body font-normal text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-[1.6]">
              Last Updated: March 2026 &bull; Compliant with Indian Information Technology (IT) Act &amp; DPDP Principles
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
          <span className="text-slate-800 font-medium">Privacy Policy</span>
        </div>
      </div>

      {/* ── Main Content Grid Body ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ── Left Sticky Sidebar (Dual Card: TOC + Questions Card) ── */}
          <LegalTableOfContents
            sections={sections}
            supportHelpText="Our compliance and advisory support team is available to clarify any terms or data inquiries."
          />

          {/* ── Right Content: Separate Clean White Cards per Section ── */}
          <article className="col-span-12 lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Top Official Entity Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <span className="text-[11px] font-heading uppercase tracking-wider text-slate-400 block mb-1">
                    Official Entity
                  </span>
                  <h2 className="font-heading font-bold text-base text-slate-900">
                    The PM Properties
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-heading uppercase tracking-wider text-slate-400 block mb-1">
                    Industry Affiliation
                  </span>
                  <span className="font-heading text-xs font-bold text-brand-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md inline-block">
                    Verified Member: KDRA
                  </span>
                </div>
              </div>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed">
                This document is published in accordance with the provisions of applicable Indian laws including the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023. By accessing or using this website, you acknowledge that you have read and understood these provisions.
              </p>
            </div>

            {/* Section 1 */}
            <section
              id="introduction"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  01
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  Introduction
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  <strong>The PM Properties</strong> (&ldquo;PM Properties,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), founded by Pritesh Pravin Mhamunkar and headquartered in Dombivli West, Maharashtra, is committed to safeguarding your privacy and personal information.
                </p>
                <p>
                  This Privacy Policy articulates our transparent practices regarding how personal details are collected, processed, and safeguarded when you visit our website, submit property inquiries, schedule site visits, or connect with our advisory team via telephone or messaging channels.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section
              id="data-we-collect"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  02
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  Information We Collect
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  We maintain a strict minimal-data philosophy. We collect only what is strictly necessary to arrange property showings, verify contactability, and present curated housing or commercial inventory:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                    <span className="text-xs font-heading font-bold block mb-1 text-brand-600">
                      Contact Details
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Full Name and verified 10-digit Indian Mobile Number to connect via phone call or WhatsApp for site visit coordination.
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                    <span className="text-xs font-heading font-bold block mb-1 text-brand-600">
                      Property Preference
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Configuration requirement (1 BHK, 2 BHK, 3 BHK, Commercial) and estimated budget bracket (₹30–40L, ₹50–60L, ₹60L+).
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                    <span className="text-xs font-heading font-bold block mb-1 text-brand-600">
                      Timeline &amp; Context
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Property readiness stage (Ready to Move, Under Construction) and the project listing where your inquiry originated.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-950 leading-relaxed">
                  <strong className="font-heading font-bold text-amber-900 block mb-0.5">
                    What We DO NOT Collect:
                  </strong>
                  This website does not ask for or store email addresses, bank accounts, credit/debit card numbers, Aadhaar cards, PAN cards, or payment credentials.
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section
              id="collection-methods"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  03
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  How Data is Collected
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  Information is collected exclusively through explicit, voluntary actions taken by you:
                </p>
                <ul className="space-y-2.5 my-3">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span><strong>Book Consultation Modal:</strong> When selecting budget and configuration parameters and clicking &ldquo;Request Free Consultation&rdquo;.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span><strong>Contact Us Form:</strong> When submitting an inquiry through our dedicated contact page form.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span><strong>WhatsApp Direct Chat:</strong> When you click the WhatsApp widget or brochure download buttons to initiate a conversation with pre-filled parameters.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section
              id="purpose-use"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  04
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  How We Use Your Information
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  The information we collect is utilized strictly for legitimate real estate advisory and facilitation operations:
                </p>
                <ul className="space-y-2.5 my-3">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span><strong>Consultation &amp; Advisory:</strong> To contact you directly regarding matching residential or commercial developments across Kalyan, Dombivli, Thane, and MMR.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span><strong>Site Visits &amp; Inspections:</strong> To coordinate in-person property tours, builder sales office appointments, and sample flat inspections.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span><strong>Documentation Sharing:</strong> To dispatch official project brochures, cost sheets, floor plans, and verified MahaRERA certificates via WhatsApp or email.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span><strong>Internal Records:</strong> To maintain consultation histories and ensure high standards of customer advisory accountability.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section
              id="storage-security"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  05
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  Data Storage &amp; Security
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  Inquiry data submitted through our web forms is transmitted over encrypted Transport Layer Security (TLS/HTTPS) and stored in an enterprise PostgreSQL database managed by <strong>Supabase Inc.</strong>
                </p>
                <p>
                  We implement PostgreSQL <strong>Row Level Security (RLS)</strong> policies. The public cannot read, enumerate, or access submitted lead entries. Access to inquiries is strictly restricted to authenticated PM Properties advisory personnel via secure administrative credentials.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section
              id="third-parties"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  06
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  Data Sharing &amp; Confidentiality
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <div className="p-3.5 bg-red-50/70 border border-red-200/80 rounded-xl mb-3">
                  <p className="font-semibold text-slate-950 text-xs sm:text-sm">
                    We do not sell, rent, trade, or commercially monetize your personal data to external telemarketers or third-party lead brokers under any circumstances.
                  </p>
                </div>
                <p>
                  We share contact details only with trusted technical and developer partners essential to service fulfillment:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 mt-2">
                  <li><strong>Meta Platforms, Inc. (WhatsApp Business):</strong> When you initiate direct chat inquiries through WhatsApp.</li>
                  <li><strong>Verified Partner Developers:</strong> With your prior consent, to facilitate visitor registration when booking an official site visit or developer desk appointment.</li>
                  <li><strong>Regulatory &amp; Legal Authorities:</strong> Only where strictly mandated by applicable laws of India or official MahaRERA directives.</li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section
              id="cookies-analytics"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  07
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  Cookies &amp; Website Analytics
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  Our website uses minimal, functional cookies and aggregate analytics tools (Google Analytics 4, Measurement ID: G-ZC4KVNR69F) to monitor page load performance, scroll depth, and general engagement trends.
                </p>
                <p>
                  <strong>Zero PII in Analytics:</strong> Names, telephone numbers, and inquiry contents are strictly prevented from transmission to Google Analytics. Only non-personally identifiable events are recorded. You may opt out anytime using the{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 font-semibold underline inline-flex items-center gap-1"
                  >
                    Google Analytics Opt-out Add-on <ExternalLink className="w-3 h-3 inline" />
                  </a>.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section
              id="user-rights"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  08
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  Your Rights (DPDP Act, 2023 - India)
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  In compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> of India, you hold the following rights regarding your personal data:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="font-bold text-xs text-slate-900 block mb-1">Right to Access</span>
                    <p className="text-xs text-slate-600">Request confirmation of personal details and contact records held in our advisory system.</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="font-bold text-xs text-slate-900 block mb-1">Right to Correction</span>
                    <p className="text-xs text-slate-600">Request correction or update of inaccurate phone numbers, preferences, or profile data.</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="font-bold text-xs text-slate-900 block mb-1">Right to Erasure</span>
                    <p className="text-xs text-slate-600">Request complete removal of your phone number from our active advisory records.</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600">
                  To exercise any of these rights, please email our grievance desk at{" "}
                  <a href="mailto:thepmproperties4u@gmail.com" className="text-brand-600 font-semibold underline">
                    thepmproperties4u@gmail.com
                  </a>.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section
              id="retention"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  09
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  Data Retention Policy
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  We retain client inquiry records for as long as necessary to provide personalized real estate advisory services, fulfill ongoing property transactions, comply with MahaRERA record-keeping mandates, or resolve transaction inquiries. Once an inquiry is resolved or upon verified deletion request, records are securely archived or erased.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section
              id="minors"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  10
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  Minors &amp; Children&apos;s Privacy
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  Our advisory services and property listings are directed exclusively at individuals who have attained 18 years of age and possess legal capacity to enter into real estate transactions. We do not knowingly collect personal data from minors.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section
              id="policy-updates"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-brand-600 font-mono text-xs font-bold shrink-0">
                  11
                </span>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                  Changes to This Privacy Policy
                </h2>
              </div>
              <div className="font-body text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
                <p>
                  We reserve the right to amend this Privacy Policy periodically to reflect updates in regulatory mandates (such as MahaRERA rules or DPDP Act notifications) or enhancements to our digital services. Any modifications will be posted directly to this page with an updated &ldquo;Last Updated&rdquo; revision timestamp.
                </p>
              </div>
            </section>

            {/* Section 12 — REDESIGNED IN-DEPTH WHITE CONTACT CARD (Image 2 Redesign) */}
            <section
              id="contact-desk"
              className="scroll-mt-28 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xl shadow-slate-200/60 relative overflow-hidden ring-1 ring-slate-100 before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-brand-600 before:via-red-500 before:to-brand-700 transition-all"
            >
              {/* Header info */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-brand-700 text-xs font-heading font-bold uppercase tracking-wider mb-2.5">
                  <Building2 className="w-3.5 h-3.5 text-brand-600" />
                  <span>Real Estate Consultancy</span>
                </div>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-950 tracking-tight">
                  The PM Properties
                </h2>
                <p className="text-sm text-slate-600 mt-1 font-body">
                  Founder &amp; Principal Broker: <strong className="text-slate-950 font-semibold">Pritesh Pravin Mhamunkar</strong>
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-xs text-slate-600 font-body">
                  <span className="font-semibold text-slate-900">Member: KDRA (Kalyan Dombivli Realtors Welfare Association)</span>
                </div>
              </div>

              {/* Details Grid */}
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
                      Official Compliance Email
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
                      Advisory Hours
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
