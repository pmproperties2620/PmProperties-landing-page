"use client";

import Image from "next/image";
import Link from "next/link";
import SectionDecoration from "@/components/ui/SectionDecoration";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { StaggerGrid, FadeInCard, ScaleInBadge } from "@/components/ui/AnimatedSection";
import { FALLBACK_ABOUT_SHOWCASE } from "@/lib/contentQueries";

interface AboutSectionProps {
  initialImages?: string[];
}

export default function AboutSection({ initialImages }: AboutSectionProps = {}) {
  const showcaseImages =
    initialImages && initialImages.length > 0 ? initialImages : FALLBACK_ABOUT_SHOWCASE;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (showcaseImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % showcaseImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [showcaseImages.length]);

  return (
    <section className="bg-black py-0 md:py-2 px-4 sm:px-6 lg:px-8">
      <StaggerGrid className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        
        {/* Left Column - S-Curve Bento */}
        <FadeInCard className="lg:col-span-4 bg-[#f8f9fc] rounded-[2rem] md:rounded-[2.5rem] flex flex-col relative overflow-hidden">
          
          {/* Top Content */}
          <div className="p-4 md:p-5 pb-0 md:pb-0 flex-grow flex flex-col">
            <h3 className="font-body font-normal text-xs sm:text-sm leading-snug text-gray-500 mb-2">Families Helped Find Their Dream Home</h3>
            <ScaleInBadge>
              <p className="font-heading text-3xl md:text-4xl font-black leading-tight tracking-[-0.02em] text-[#0a1128] mb-2 md:mb-3">500+</p>
            </ScaleInBadge>
            <p className="font-body font-normal text-xs sm:text-sm leading-[1.6] text-gray-600 max-w-sm mb-2">
              With over five years of trusted experience, we&apos;ve guided 500+ families toward safe, transparent, and value-driven property investments.
            </p>
          </div>

          {/* S-Curve SVG Separator */}
          <div className="w-full relative h-[40px] md:h-[60px] flex-shrink-0 -my-2 md:-my-3 z-10 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full text-[#0a1128] fill-current">
              <path d="
                M -1 10
                L 35 10
                C 50 10, 50 70, 65 70
                L 101 70
                L 101 94
                L 65 94
                C 50 94, 50 34, 35 34
                L -1 34
                Z" />
            </svg>
          </div>

          {/* Bottom Content */}
          <div className="p-4 md:p-5 pt-0 md:pt-0 flex-grow flex flex-col items-start justify-end">
            <div className="mb-3 md:mb-4 mt-1 md:mt-2">
              <h3 className="font-heading text-xs sm:text-sm font-semibold uppercase tracking-[0.05em] leading-none text-gray-800 mb-2 md:mb-3">Introduction</h3>
              <h2 className="font-heading text-2xl md:text-4xl font-bold leading-[1.15] tracking-[-0.02em] text-[#0a1128] mb-2">
                A Journey Built on Trust.
              </h2>
              <p className="font-body font-normal text-xs sm:text-sm leading-[1.6] text-slate-600 mb-2">
                Founded by Pritesh Pravin Mhamunkar, The PM Properties is a RERA-Certified Real Estate Consultancy dedicated to honest, transparent, and stress-free property solutions.
              </p>
              <p className="font-body font-normal text-xs sm:text-sm leading-[1.6] text-slate-600">
                Since 2020, we have helped 500+ families find their ideal homes while partnering with trusted developers to deliver verified properties, expert guidance, and complete transparency.
              </p>
            </div>
            <Link 
              href="/about" 
              className="inline-flex items-center justify-center bg-[#0a1128] text-white px-6 py-3 rounded-full font-heading text-sm font-semibold leading-none hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 mt-auto"
            >
              Learn More
            </Link>
          </div>

        </FadeInCard>

        {/* Right Column */}
        <FadeInCard className="lg:col-span-8 bg-[#f8f9fc] rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-5 flex flex-col relative overflow-hidden">
          <div className="px-2 md:px-0 flex flex-col items-start mb-4">
             <SectionDecoration className="mb-4" />
             <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-[-0.02em] text-[#0a1128]">
              About PM Properties
            </h2>
          </div>
         
          <div className="flex-grow w-full relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden min-h-[150px] sm:min-h-[200px] lg:min-h-[150px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <Image 
                  src={showcaseImages[currentIndex] || FALLBACK_ABOUT_SHOWCASE[0]}
                  alt="Property Showcase"
                  fill
                  className="object-contain object-center bg-[#f8f9fc]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </FadeInCard>

      </StaggerGrid>
    </section>
  );
}
