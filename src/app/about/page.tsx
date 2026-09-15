"use client";

import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AboutTimeline from "@/components/about/AboutTimeline";
import CTASection from "@/components/home/CTASection";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <>
      <section className="relative min-h-[85vh] flex flex-col justify-center py-20 sm:py-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero_services.png" 
            alt="About PM Properties" 
            fill 
            className="object-cover"
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/95 via-red-500/80 to-red-900/40" />
        </div>

        {/* Floating Elements Container */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Left Staggered Split Circle */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute hidden lg:block top-[20%] left-[8%] w-28 h-28 xl:w-36 xl:h-36"
            >
              {/* Top Semicircle */}
              <div className="absolute top-0 left-0 w-[85%] h-1/2 overflow-hidden rounded-t-full shadow-2xl z-10 border-b-2 border-white/10">
                <Image src="/images/modern_building.png" alt="Modern Building" fill className="object-cover object-bottom" />
              </div>
              {/* Bottom Semicircle (shifted right and colored) */}
              <div className="absolute bottom-0 right-0 w-[85%] h-1/2 overflow-hidden rounded-b-full shadow-2xl z-0">
                <Image src="/images/hero_services.png" alt="Villa" fill className="object-cover object-top" />
                <div className="absolute inset-0 bg-brand-600/30 mix-blend-color" />
                <div className="absolute inset-0 bg-brand-600/20 mix-blend-multiply" />
              </div>
            </motion.div>

            {/* Right Staggered Split Circle */}
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute hidden lg:block bottom-[15%] right-[8%] w-24 h-24 xl:w-32 xl:h-32"
            >
              {/* Top Semicircle (shifted right and colored) */}
              <div className="absolute top-0 right-0 w-[85%] h-1/2 overflow-hidden rounded-t-full shadow-2xl z-0 border-b-2 border-white/10">
                <Image src="/images/hero_about.png" alt="Property Site" fill className="object-cover object-bottom" />
                <div className="absolute inset-0 bg-brand-600/30 mix-blend-color" />
                <div className="absolute inset-0 bg-brand-600/20 mix-blend-multiply" />
              </div>
              {/* Bottom Semicircle */}
              <div className="absolute bottom-0 left-0 w-[85%] h-1/2 overflow-hidden rounded-b-full shadow-2xl z-10">
                <Image src="/images/hero-bg.png" alt="Estate" fill className="object-cover object-top" />
              </div>
            </motion.div>
        </div>


        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center w-full">
          <AnimatedSection>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              About PM Properties
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              A boutique real estate agency built on trust, market expertise, and a genuine passion
              for helping people find their perfect place.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <AboutTimeline />

      <CTASection />
    </>
  );
}
