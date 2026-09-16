import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import DualProcessTimeline from "@/components/how-we-work/DualProcessTimeline";
import BookConsultationButton from "@/components/ui/BookConsultationButton";

export const metadata: Metadata = {
  title: "How We Work | PM Properties",
  description:
    "Our proven 5-step process makes buying or selling your property simple, transparent, and stress-free.",
};

export default function HowWeWorkPage() {
  return (
    <>
      <section className="relative min-h-[60vh] flex flex-col justify-center py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-bg-new.png" 
            alt="How We Work" 
            fill 
            className="object-cover"
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/95 via-red-500/75 to-transparent" />
        </div>
        
        {/* Left Blueprint Graphic */}
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[450px] md:h-[450px] opacity-20 mix-blend-screen pointer-events-none -translate-x-12 translate-y-16">
          <Image
            src="/images/blueprint_left.png"
            alt=""
            fill
            className="object-contain object-left-bottom"
            priority
          />
        </div>

        {/* Right Blueprint Graphic */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[550px] md:h-[550px] opacity-20 mix-blend-screen pointer-events-none translate-x-16 translate-y-24">
          <Image
            src="/images/blueprint_right.png"
            alt=""
            fill
            className="object-contain object-right-bottom"
            priority
          />
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
        </div>
      </section>
    </>
  );
}
