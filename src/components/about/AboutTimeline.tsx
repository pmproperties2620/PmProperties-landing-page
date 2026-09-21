"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { TimelineMilestoneItem, FALLBACK_TIMELINE } from "@/lib/contentQueries";

function ImageSlider({ images, fit }: { images: string[]; fit: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-full">
      {images.map((img, idx) => (
        <Image
          key={img}
          src={img}
          alt={`Slider image ${idx + 1}`}
          fill
          className={`
            ${fit ? "object-contain bg-slate-100 p-2" : "object-cover"} 
            transition-all duration-1000 ease-in-out group-hover:scale-105
            ${idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}
          `}
          sizes="(max-width: 768px) 100vw, 45vw"
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full pointer-events-auto shadow-sm">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === currentIndex
                  ? "w-4 h-1.5 bg-white shadow-sm"
                  : "w-1.5 h-1.5 bg-white/50 hover:bg-white/90"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface AboutTimelineProps {
  initialMilestones?: TimelineMilestoneItem[];
}

export default function AboutTimeline({ initialMilestones }: AboutTimelineProps = {}) {
  const milestones =
    initialMilestones && initialMilestones.length > 0
      ? initialMilestones
      : FALLBACK_TIMELINE;

  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-16 bg-white relative overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <p className="font-heading font-semibold text-xs sm:text-sm uppercase tracking-[0.05em] leading-none text-[#0a1128] mb-2">
              Our Journey
            </p>
            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-slate-900 mb-4 leading-[1.15] tracking-[-0.02em]">
              The Story of PM Properties
            </h2>
            <p className="font-body font-normal text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-[1.6]">
              A journey of determination, honesty, and a commitment to helping people find their
              rightful homes.
            </p>
          </div>
        </AnimatedSection>

        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line Track */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 transform md:-translate-x-1/2 rounded-full" />
          
          {/* Animated Vertical Line Fill */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-8 md:left-1/2 top-0 w-1 bg-brand-600 transform md:-translate-x-1/2 origin-top rounded-full z-0"
          />

          {milestones.map((item, index) => {
            const isEven = index % 2 === 0;
            const images = item.image_urls || [];
            const year = item.year_label;

            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                className={`relative flex flex-col md:flex-row items-center justify-between mb-16 last:mb-0 ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Dot */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute left-8 md:left-1/2 w-5 h-5 rounded-full bg-brand-600 border-4 border-white shadow-md transform -translate-x-1/2 mt-1.5 md:mt-0 z-10"
                />

                {/* Content Side */}
                <div className={`w-full md:w-[45%] pl-16 md:pl-0 ${isEven ? "md:text-left" : "md:text-right"}`}>
                  <div className="bg-slate-50 p-6 rounded-3xl shadow-sm ring-1 ring-slate-100 hover:shadow-md transition-shadow">
                    <span className="inline-block py-1 px-3 rounded-full bg-[#0a1128]/5 text-[#0a1128] font-heading font-semibold text-xs mb-3">
                      {year}
                    </span>
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-900 mb-3 leading-[1.2] tracking-[-0.02em]">{item.title}</h3>
                    <p className="font-body font-normal text-xs sm:text-sm text-slate-600 leading-[1.6]">{item.description}</p>
                  </div>
                </div>

                {/* Image Side */}
                <div className={`w-full md:w-[45%] pl-16 md:pl-0 mt-6 md:mt-0 ${isEven ? "md:pr-10" : "md:pl-10"}`}>
                  <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden shadow-lg group">
                    {images.length > 1 ? (
                      <ImageSlider images={images} fit={index <= 3} />
                    ) : images.length === 1 ? (
                      <Image
                        src={images[0]}
                        alt={item.title}
                        fill
                        className={`${index <= 3 ? "object-contain bg-slate-100 p-2" : "object-cover"} transition-transform duration-700 group-hover:scale-105`}
                        sizes="(max-width: 768px) 100vw, 45vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-heading">
                        PM Properties
                      </div>
                    )}
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-20 pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <AnimatedSection>
          <div className="mt-20 text-center max-w-3xl mx-auto">
            <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mb-8">
              <div className="bg-white rounded-[14px] px-6 py-8">
                <p className="font-body font-medium text-base md:text-lg text-slate-800 italic leading-[1.6] mb-6">
                  &ldquo;To play a part in fulfilling someone&apos;s dream of a home is my privilege. I pray to God that this service continues uninterrupted.&rdquo;
                </p>
                <div className="flex flex-col items-center justify-center">
                  <p className="font-heading font-semibold text-xs uppercase tracking-[0.05em] text-slate-500 mb-1">Yours sincerely,</p>
                  <p className="font-heading font-bold text-lg sm:text-xl text-[#0a1128]">Mr. Pritesh Pravin Mhamunkar</p>
                  <p className="font-body font-normal text-xs sm:text-sm text-slate-600 mt-1">Founder, PM Properties</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
