"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";
import SectionDecoration from "@/components/ui/SectionDecoration";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { IndustryPresenceItem, FALLBACK_INDUSTRY_PRESENCE } from "@/lib/contentQueries";

interface IndustryPresenceGalleryProps {
  initialItems?: IndustryPresenceItem[];
}

export default function IndustryPresenceGallery({ initialItems }: IndustryPresenceGalleryProps = {}) {
  const items =
    initialItems && initialItems.length > 0
      ? initialItems
      : FALLBACK_INDUSTRY_PRESENCE;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Responsive visible cards count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, items.length - visibleCards);
  const activeIndex = Math.min(currentIndex, maxIndex);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const cur = Math.min(prev, maxIndex);
      return cur >= maxIndex ? 0 : cur + 1;
    });
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => {
      const cur = Math.min(prev, maxIndex);
      return cur <= 0 ? maxIndex : cur - 1;
    });
  }, [maxIndex]);

  // Automatic scrolling interval (pauses on hover)
  useEffect(() => {
    if (isPaused || items.length <= visibleCards) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused, handleNext, items.length, visibleCards]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="industry-presence"
      className="scroll-mt-24 py-16 sm:py-24 bg-white relative overflow-hidden border-t border-slate-100"
    >
      {/* Background ambient accents */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading (Centered & Elegant) */}
        <AnimatedSection>
          <div className="text-center mb-12 md:mb-16 flex flex-col items-center">
            <SectionDecoration className="mb-4" />
            <p className="font-heading text-xs sm:text-sm font-semibold uppercase tracking-[0.05em] leading-none text-brand-500 mb-3">
              Leadership & Recognitions
            </p>
            <h2 className="font-heading text-2xl md:text-4xl font-bold leading-[1.15] tracking-[-0.02em] text-[#0a1128] mb-4">
              Industry Presence
            </h2>
            <p className="font-body font-normal text-sm sm:text-base leading-[1.6] text-slate-600 max-w-2xl mx-auto">
              From award ceremonies to property expos, we stay actively engaged with the real estate community.
            </p>
          </div>
        </AnimatedSection>

        {/* Carousel Container with Arrows Next to the Images */}
        <div className="relative px-2 sm:px-12 lg:px-14">
          {/* Left Arrow Button (Next to Images) */}
          {items.length > visibleCards && (
            <button
              type="button"
              onClick={handlePrev}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="absolute left-0 sm:left-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.1)] text-slate-800 hover:text-brand-600 hover:border-brand-500/50 hover:bg-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group"
              aria-label="Previous photos"
            >
              <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
            </button>
          )}

          {/* Right Arrow Button (Next to Images) */}
          {items.length > visibleCards && (
            <button
              type="button"
              onClick={handleNext}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="absolute right-0 sm:right-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.1)] text-slate-800 hover:text-brand-600 hover:border-brand-500/50 hover:bg-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group"
              aria-label="Next photos"
            >
              <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          )}

          {/* Carousel Viewport & Track */}
          <div
            className="overflow-hidden py-2"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                transform: `translateX(-${activeIndex * (100 / visibleCards)}%)`,
              }}
            >
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="shrink-0 px-2.5 sm:px-3.5"
                  style={{ width: `${100 / visibleCards}%` }}
                >
                  {/* Premium Minimalist Card */}
                  <div className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:border-brand-500/40 transition-all duration-500 flex flex-col h-full hover:-translate-y-1">
                    {/* Photo area */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <Image
                        src={item.image_url}
                        alt={item.caption || `Industry presence photo ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300" />

                      {/* Minimalist Floating Badge */}
                      <div className="absolute top-3.5 left-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-heading font-semibold uppercase tracking-wider bg-white/90 text-slate-800 backdrop-blur-md shadow-xs">
                          <Award className="w-3 h-3 text-brand-600" />
                          <span>Event</span>
                        </span>
                      </div>
                    </div>

                    {/* Clean Typography */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
                      <p className="font-heading font-semibold text-sm sm:text-base text-slate-800 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
                        {item.caption || "Real Estate Summit & Industry Recognition"}
                      </p>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-body text-slate-400">The PM Properties Presence</span>
                        <span className="text-[11px] font-mono text-slate-400">#{item.display_order || idx + 1}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Pagination Indicators Below */}
        {maxIndex > 0 && (
          <div className="mt-8 sm:mt-10 flex items-center justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(dotIdx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  dotIdx === activeIndex
                    ? "w-7 h-2 bg-brand-600 shadow-xs"
                    : "w-2 h-2 bg-slate-200 hover:bg-slate-300"
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
