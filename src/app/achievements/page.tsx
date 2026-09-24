import type { Metadata } from "next";
import Image from "next/image";
import { Award, ShieldCheck, Users, Building, Sparkles } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AchievementsGallery from "@/components/achievements/AchievementsGallery";
import CTASection from "@/components/home/CTASection";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPageBanner, getIndustryPresence } from "@/lib/contentQueries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Achievements | The PM Properties — Real Estate Milestones & Recognitions",
  description:
    "Explore the milestones, real estate summits, award ceremonies, and industry achievements of The PM Properties, led by Pritesh Mhamunkar in Dombivli & Kalyan.",
  alternates: {
    canonical: "https://www.thepmproperties.in/achievements",
  },
  openGraph: {
    title: "Achievements | The PM Properties",
    description:
      "Explore the milestones, real estate summits, award ceremonies, and industry achievements of The PM Properties, led by Pritesh Mhamunkar in Dombivli & Kalyan.",
    url: "https://www.thepmproperties.in/achievements",
    siteName: "The PM Properties",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Achievements | The PM Properties",
    description:
      "Explore the milestones, real estate summits, award ceremonies, and industry achievements of The PM Properties, led by Pritesh Mhamunkar in Dombivli & Kalyan.",
  },
};

export default async function AchievementsPage() {
  const [bannerUrl, industryPresence] = await Promise.all([
    getPageBanner("achievements"),
    getIndustryPresence(),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.thepmproperties.in" },
          { name: "Achievements", url: "https://www.thepmproperties.in/achievements" },
        ]}
      />

      {/* ─── Hero Banner ─── */}
      <section className="relative min-h-[55vh] sm:min-h-[60vh] flex flex-col justify-center py-20 sm:py-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerUrl}
            alt="Achievements - The PM Properties"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/95 via-red-600/80 to-slate-950/70" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center w-full">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-heading font-semibold uppercase tracking-wider mb-5">
              <Award className="w-4 h-4 text-amber-300" />
              <span>Recognitions & Milestones</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-6xl text-white mb-4 leading-[1.15] tracking-[-0.02em]">
              Achievements
            </h1>
            <p className="font-body font-normal text-sm sm:text-base text-slate-200 max-w-3xl mx-auto leading-[1.6]">
              Celebrating over 5 years of trusted real estate leadership in Dombivli & Kalyan.
              From high-profile builder summits and KDRA community forums to industry honors,
              see how The PM Properties leads with integrity and excellence.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Milestone Highlights Bar ─── */}
      <section className="bg-white border-b border-slate-100 py-10 relative z-20 -mt-8 mx-4 sm:mx-8 md:mx-auto max-w-6xl rounded-2xl shadow-xl shadow-slate-900/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 px-6 sm:px-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="pt-4 md:pt-0">
            <div className="flex items-center justify-center gap-1.5 text-brand-600 mb-1">
              <Users className="w-5 h-5" />
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900">500+</span>
            </div>
            <p className="font-heading text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wider">
              Families Guided
            </p>
          </div>

          <div className="pt-4 md:pt-0">
            <div className="flex items-center justify-center gap-1.5 text-brand-600 mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900">MahaRERA</span>
            </div>
            <p className="font-heading text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wider">
              Reg: A51700019203
            </p>
          </div>

          <div className="pt-4 md:pt-0">
            <div className="flex items-center justify-center gap-1.5 text-brand-600 mb-1">
              <Building className="w-5 h-5 text-amber-500" />
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900">KDRA</span>
            </div>
            <p className="font-heading text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wider">
              Active Association Member
            </p>
          </div>

          <div className="pt-4 md:pt-0">
            <div className="flex items-center justify-center gap-1.5 text-brand-600 mb-1">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900">0%</span>
            </div>
            <p className="font-heading text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wider">
              Brokerage on New Projects
            </p>
          </div>
        </div>
      </section>

      {/* ─── Main Gallery Section ─── */}
      <AchievementsGallery initialItems={industryPresence} />

      {/* ─── Why Our Industry Presence Matters to You ─── */}
      <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="font-heading text-xs sm:text-sm font-semibold uppercase tracking-[0.05em] text-brand-500 mb-2">
              Why Our Presence Matters
            </p>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Leadership That Delivers Real Client Value
            </h2>
            <p className="font-body text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
              Our active presence across state expos, developer forums, and realtor associations is not just about honors — it directly benefits our clients every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-3">
                Direct Developer Access
              </h3>
              <p className="font-body text-sm text-slate-600 leading-relaxed">
                Direct coordination with top developers (Regency, Lodha, Runwal, Mohan) grants The PM Properties clients first-look inventory access and priority booking terms.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-3">
                100% Legal & RERA Scrutiny
              </h3>
              <p className="font-body text-sm text-slate-600 leading-relaxed">
                As registered KDRA and MahaRERA professionals, every project showcased by The PM Properties undergoes rigorous title checks and legal compliance reviews.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-3">
                Honest & Transparent Advisory
              </h3>
              <p className="font-body text-sm text-slate-600 leading-relaxed">
                Recognized across the region for client advocacy: zero hidden costs, 0% brokerage on developer units, and dedicated support from inquiry to possession.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <CTASection />
    </>
  );
}
