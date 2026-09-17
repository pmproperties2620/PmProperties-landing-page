import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AboutTimeline from "@/components/about/AboutTimeline";
import CTASection from "@/components/home/CTASection";
import { getPageBanner, getTimelineMilestones } from "@/lib/contentQueries";

export const metadata = {
  title: "About Us | PM Properties",
  description:
    "A boutique real estate agency built on trust, market expertise, and a genuine passion for helping people find their perfect place.",
};

export default async function AboutPage() {
  const [bannerUrl, milestones] = await Promise.all([
    getPageBanner("about"),
    getTimelineMilestones(),
  ]);

  return (
    <>
      <section className="relative min-h-[60vh] flex flex-col justify-center py-20 sm:py-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image 
            src={bannerUrl} 
            alt="About PM Properties" 
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
              About PM Properties
            </h1>
            <p className="font-body font-normal text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-[1.6]">
              A boutique real estate agency built on trust, market expertise, and a genuine passion
              for helping people find their perfect place.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <AboutTimeline initialMilestones={milestones} />

      <CTASection />
    </>
  );
}
