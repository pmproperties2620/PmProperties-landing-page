"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award } from "lucide-react";
import SectionDecoration from "@/components/ui/SectionDecoration";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import { IndustryPresenceItem, FALLBACK_INDUSTRY_PRESENCE } from "@/lib/contentQueries";

interface IndustryPresenceTeaserProps {
  initialItems?: IndustryPresenceItem[];
}

export default function IndustryPresenceTeaser({ initialItems }: IndustryPresenceTeaserProps = {}) {
  const items =
    initialItems && initialItems.length > 0
      ? initialItems.slice(0, 3)
      : FALLBACK_INDUSTRY_PRESENCE.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden border-t border-slate-100">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* 3 Premium Minimalist Cards */}
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {items.map((item, idx) => (
              <StaggerItem key={item.id || idx}>
                <div className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:border-brand-500/40 transition-all duration-500 flex flex-col h-full hover:-translate-y-1">
                  {/* Image container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={item.image_url}
                      alt={item.caption || `Industry Presence ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                    
                    {/* Minimalist Floating Accent */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-heading font-semibold uppercase tracking-wider bg-white/90 text-slate-800 backdrop-blur-md shadow-xs">
                        <Award className="w-3 h-3 text-brand-600" />
                        <span>Featured</span>
                      </span>
                    </div>
                  </div>

                  {/* Minimalist Typography */}
                  <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                    <p className="font-heading font-semibold text-sm sm:text-[15px] text-slate-800 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
                      {item.caption || "Real Estate Leadership & Industry Summit"}
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-body text-slate-400">PM Properties Journey</span>
                      <span className="text-xs font-heading font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        View <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* Brand-Colored Action Button */}
        <AnimatedSection>
          <div className="mt-12 text-center">
            <Link
              href="/about#industry-presence"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-heading font-semibold text-sm leading-none transition-all duration-300 shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/35 hover:-translate-y-0.5 cursor-pointer group"
            >
              <span>Explore Our Industry Journey</span>
              <ArrowRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
