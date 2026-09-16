"use client";

import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import SectionDecoration from "@/components/ui/SectionDecoration";
import { RatingBadge } from "@/components/foundations/rating-badge";

const badges = [
  {
    title: "MahaRERA Registered",
    subtitle: "Authorized & Verified Agent",
    rating: 5,
  },
  {
    title: "KDRA Member",
    subtitle: "Certified Professional Realtor",
    rating: 5,
  },
  {
    title: "10+ Years of Trust",
    subtitle: "Proven Track Record",
    rating: 5,
  }
];

export default function CredentialsSection() {
  return (
    <section className="pt-12 pb-8 md:pt-16 md:pb-10 bg-white overflow-hidden relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-10 flex flex-col items-center">
            <SectionDecoration className="mb-4" />
            <p className="font-heading text-xs sm:text-sm font-semibold uppercase tracking-[0.05em] leading-none text-[#0a1128] mb-3">
              Trust & Transparency
            </p>
            <h2 className="font-heading text-2xl md:text-4xl font-bold leading-[1.15] tracking-[-0.02em] text-[#0a1128] mb-6">Our Credentials</h2>
            <p className="font-body font-normal text-sm sm:text-base leading-[1.6] text-slate-600 max-w-2xl mx-auto mb-4">
              We operate with strict adherence to industry regulations and ethical standards to ensure your investments are always safe.
            </p>
          </div>
        </AnimatedSection>

        <StaggerContainer>
          <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-8 md:gap-16 max-w-6xl mx-auto">
            {badges.map((badge) => (
              <StaggerItem key={badge.title}>
                <div className="hover:scale-105 transition-transform duration-300">
                  <RatingBadge 
                    rating={badge.rating} 
                    title={badge.title} 
                    subtitle={badge.subtitle} 
                    theme="dark" 
                  />
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
