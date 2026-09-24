import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AboutTimeline from "@/components/about/AboutTimeline";
import IndustryPresenceGallery from "@/components/about/IndustryPresenceGallery";
import CTASection from "@/components/home/CTASection";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPageBanner, getTimelineMilestones, getIndustryPresence } from "@/lib/contentQueries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About The PM Properties | Real Estate Advisory Dombivli",
  description:
    "Founded by Pritesh Mhamunkar, The PM Properties is a KDRA-member consultancy in Dombivli & Kalyan, helping 500+ families secure verified dream properties.",
  alternates: {
    canonical: "https://www.thepmproperties.in/about",
  },
  openGraph: {
    title: "About The PM Properties | Real Estate Advisory Dombivli",
    description:
      "Founded by Pritesh Pravin Mhamunkar, The PM Properties is a KDRA-member real estate consultancy with over 5 years of trusted advisory in Dombivli & Kalyan.",
    url: "https://www.thepmproperties.in/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About The PM Properties | Real Estate Advisory Dombivli",
    description:
      "Founded by Pritesh Pravin Mhamunkar, The PM Properties is a KDRA-member real estate consultancy with over 5 years of trusted advisory in Dombivli & Kalyan.",
  },
};

export default async function AboutPage() {
  const [bannerUrl, milestones, industryPresence] = await Promise.all([
    getPageBanner("about"),
    getTimelineMilestones(),
    getIndustryPresence(),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.thepmproperties.in" },
          { name: "About Us", url: "https://www.thepmproperties.in/about" },
        ]}
      />
      <section className="relative min-h-[60vh] flex flex-col justify-center py-20 sm:py-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image 
            src={bannerUrl} 
            alt="About The PM Properties" 
            fill 
            sizes="100vw"
            className="object-cover"
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/95 via-red-500/80 to-red-900/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center w-full">
          <AnimatedSection>
            <h1 className="font-heading font-black text-3xl sm:text-6xl text-white mb-4 leading-[1.15] tracking-[-0.02em]">
              About The PM Properties
            </h1>
            <p className="font-body font-normal text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-[1.6]">
              A boutique real estate agency built on trust, market expertise, and a genuine passion
              for helping people find their perfect place.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <AboutTimeline initialMilestones={milestones} />

      <IndustryPresenceGallery initialItems={industryPresence} />

      <CTASection />
    </>
  );
}
