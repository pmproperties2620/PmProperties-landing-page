import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection, { FadeInSection } from "@/components/ui/AnimatedSection";
import DualProcessTimeline from "@/components/how-we-work/DualProcessTimeline";
import BookConsultationButton from "@/components/ui/BookConsultationButton";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPageBanner } from "@/lib/contentQueries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "5-Step Real Estate Advisory Process | PM Properties",
  description:
    "Our transparent 5-step property process makes buying or selling residential & commercial real estate in Dombivli & Kalyan predictable and stress-free.",
  alternates: {
    canonical: "https://www.thepmproperties.in/how-we-work",
  },
  openGraph: {
    title: "5-Step Real Estate Advisory Process | PM Properties",
    description:
      "A transparent, proven process designed to make your real estate journey smooth, predictable, and successful across Dombivli & Kalyan.",
    url: "https://www.thepmproperties.in/how-we-work",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "5-Step Real Estate Advisory Process | PM Properties",
    description:
      "A transparent, proven process designed to make your real estate journey smooth, predictable, and successful across Dombivli & Kalyan.",
  },
};

export default async function HowWeWorkPage() {
  const bannerUrl = await getPageBanner("how_we_work");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.thepmproperties.in" },
          { name: "How We Work", url: "https://www.thepmproperties.in/how-we-work" },
        ]}
      />
      <section className="relative min-h-[60vh] flex flex-col justify-center py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={bannerUrl} 
            alt="How We Work" 
            fill 
            sizes="100vw"
            className="object-cover"
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/95 via-red-500/75 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center w-full">
          <AnimatedSection>
            <h1 className="font-heading font-black text-3xl sm:text-6xl text-white mb-4 leading-[1.15] tracking-[-0.02em]">How We Work</h1>
            <p className="font-body font-normal text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-[1.6]">
              A transparent, proven process designed to make your real estate journey smooth, predictable, and successful.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Dual Process Timeline containing both Buyers and Sellers */}
      <DualProcessTimeline />

      <section className="py-16 sm:py-20 bg-brand-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeInSection>
            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white mb-4 leading-[1.15] tracking-[-0.02em]">
              Ready to Get Started?
            </h2>
            <p className="font-body font-normal text-sm sm:text-base text-white/80 max-w-2xl mx-auto mb-8 leading-[1.6]">
              Whether you&apos;re buying, selling, or just exploring — your first consultation is
              always free and comes with zero obligations.
            </p>
            <BookConsultationButton className="inline-flex items-center justify-center gap-2 bg-white text-brand-600 px-8 py-4 rounded-xl font-heading font-semibold text-sm sm:text-base leading-none hover:bg-slate-50 transition-all shadow-lg cursor-pointer">
              Book Your Free Consultation
            </BookConsultationButton>
          </FadeInSection>
        </div>
      </section>
    </>
  );
}
