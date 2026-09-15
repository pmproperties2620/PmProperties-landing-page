"use client";

import Image from "next/image";
import Link from "next/link";
import SectionDecoration from "@/components/ui/SectionDecoration";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/images/about1.png",
  "/images/about2.png",
  "/images/about3.png",
  "/images/about4.png"
];

export default function AboutSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-black py-0 md:py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        
        {/* Left Column - S-Curve Bento */}
        <div className="lg:col-span-4 bg-[#f8f9fc] rounded-[2rem] md:rounded-[2.5rem] flex flex-col relative overflow-hidden">
          
          {/* Top Content */}
          <div className="p-4 md:p-5 pb-0 md:pb-0 flex-grow flex flex-col">
            <h3 className="text-xs font-medium text-gray-500 mb-2">Families Helped Find Their Dream Home</h3>
            <p className="text-4xl md:text-5xl font-bold text-[#0a1128] mb-2 md:mb-3 tracking-tight">500+</p>
            <p className="text-gray-600 text-xs md:text-sm leading-relaxed max-w-sm mb-2">
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
              <h3 className="text-xs font-medium text-gray-800 mb-2 md:mb-3">Introduction</h3>
              <h2 className="text-xl md:text-2xl font-semibold text-[#0a1128] leading-[1.2] mb-2">
                A Journey Built on Trust.
              </h2>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-2">
                Founded by Pritesh Pravin Mhamunkar, The PM Properties is a RERA-Certified Real Estate Consultancy dedicated to honest, transparent, and stress-free property solutions.
              </p>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                Since 2020, we have helped 500+ families find their ideal homes while partnering with trusted developers to deliver verified properties, expert guidance, and complete transparency.
              </p>
            </div>
            <Link 
              href="/about" 
              className="inline-flex items-center justify-center bg-[#0a1128] text-white px-6 py-3 rounded-full text-xs font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 mt-auto"
            >
              Learn More
            </Link>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 bg-[#f8f9fc] rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-5 flex flex-col relative overflow-hidden">
          <div className="px-2 md:px-0 flex flex-col items-start mb-4">
             <SectionDecoration className="mb-4" />
             <h2 className="text-4xl leading-[1.05] md:text-6xl lg:text-7xl font-bold text-[#0a1128] tracking-tighter">
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
                  src={images[currentIndex]}
                  alt="Property Showcase"
                  fill
                  className="object-contain object-center bg-[#f8f9fc]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
