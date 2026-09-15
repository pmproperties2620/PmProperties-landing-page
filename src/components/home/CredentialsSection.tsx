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
    title: "5+ Years of Trust",
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
            <h2 className="text-sm font-bold tracking-widest text-[#0a1128] uppercase mb-3">
              Trust & Transparency
            </h2>
            <h2 className="text-3xl md:text-5xl font-bold text-[#0a1128] mb-6">Our Credentials</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-4">
              We operate with strict adherence to industry regulations and ethical standards to ensure your investments are always safe.
            </p>
          </div>
        </AnimatedSection>

        <StaggerContainer>
          <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-8 md:gap-16 max-w-6xl mx-auto">
            {badges.map((badge, i) => (
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
