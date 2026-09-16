"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionDecoration from "@/components/ui/SectionDecoration";

const testimonialImages = [
  "/images/testimonials/testimonial-1.jpeg",
  "/images/testimonials/testimonial-2.jpeg",
  "/images/testimonials/testimonial-3.jpeg",
  "/images/testimonials/testimonial-4.jpeg",
  "/images/testimonials/testimonial-5.jpeg",
  "/images/testimonials/testimonial-6.jpeg",
  "/images/testimonials/testimonial-7.jpeg",
  "/images/testimonials/testimonial-8.jpeg",
  "/images/testimonials/testimonial-9.jpg",
  "/images/testimonials/testimonial-10.jpg",
];

const ImageTestimonialCard = ({ src, index }: { src: string; index: number }) => (
  <div className="shrink-0 bg-white rounded-[1.25rem] sm:rounded-[1.5rem] p-1.5 sm:p-2 border border-slate-200/80 transition-all hover:border-brand-500/40 group shadow-md sm:shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1.5 duration-500 relative">
    <div className="relative rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
      {/* Adjusted size: smaller images for a more elegant UI on mobile */}
      <Image 
        src={src} 
        alt={`Happy Client ${index + 1}`} 
        width={320}
        height={320}
        className="h-[180px] sm:h-[240px] md:h-[320px] w-auto object-contain transition-transform duration-700 group-hover:scale-105"
      />
      {/* Subtle overlay for better blending */}
      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl pointer-events-none" />
    </div>
  </div>
);

export default function Testimonials() {
  const allImages = testimonialImages;
  
  // Duplicate a few times to ensure smooth infinite scrolling even on large screens
  const duplicatedImages = [...allImages, ...allImages, ...allImages];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-brand-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full mb-12 md:mb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
            <SectionDecoration className="mb-6" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-heading text-xs sm:text-sm font-semibold uppercase tracking-[0.05em] leading-none text-brand-500 mb-4">
                Client Love
              </p>
              <h2 className="font-heading text-2xl md:text-4xl lg:text-4xl font-bold leading-[1.15] tracking-[-0.02em] text-slate-900 mb-6">
                Real Stories. Real Results.
              </h2>
              <p className="font-body font-normal text-sm sm:text-base leading-[1.6] text-slate-600 max-w-2xl mx-auto">
                Join these happy families and satisfied clients who trusted us to find their perfect home. Take a look at the smiles and stories behind our success.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full">
        
        {/* MOBILE SLIDER (Native Scroll) */}
        <div className="md:hidden w-full relative pt-4 pb-10">
          <div 
            className="flex overflow-x-auto px-6 gap-4 sm:gap-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonialImages.map((src, index) => (
              <div key={`mobile-${index}`} className="snap-center shrink-0">
                <ImageTestimonialCard src={src} index={index} />
              </div>
            ))}
          </div>
          
          {/* Subtle Swipe Indicator */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center pointer-events-none">
            <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.05em] leading-none text-slate-400 flex items-center gap-2">
              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Swipe
              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
          </div>
        </div>

        {/* DESKTOP MARQUEE (Framer Motion) */}
        <div className="hidden md:flex relative flex-col gap-8 overflow-hidden py-4">
          
          {/* Fading Edges */}
          <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-50 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-50 to-transparent z-20 pointer-events-none" />

          {/* Single Row - Moving Left */}
          <motion.div
            className="flex gap-8 w-max"
            animate={{ x: ["0%", "-33.33%"] }}
            transition={{
              duration: 80, // Greatly slowed down for elegant readability
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {duplicatedImages.map((src, index) => (
              <ImageTestimonialCard key={`desktop-${index}`} src={src} index={index} />
            ))}
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
