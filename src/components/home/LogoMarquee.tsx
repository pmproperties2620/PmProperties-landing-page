"use client";

import Image from "next/image";
import styles from "./LogoMarquee.module.css";
import { FadeInSection } from "@/components/ui/AnimatedSection";
import { PartnerLogoItem, FALLBACK_PARTNERS } from "@/lib/contentQueries";

interface LogoMarqueeProps {
  initialLogos?: PartnerLogoItem[];
}

function LogoGroup({ logos }: { logos: PartnerLogoItem[] }) {
  return (
    <div className={styles.group}>
      {logos.map((logo, index) => {
        const src = logo.logo_url;
        const alt = logo.company_name || `Partner Logo ${index + 1}`;
        return (
          <div key={`${logo.id || index}-${index}`} className={styles.item}>
            <Image 
              src={src} 
              alt={alt} 
              width={140}
              height={48}
              className={styles.image}
              style={{
                transform: src.includes('logo6') ? 'scale(2.2)' : src.includes('logo1') ? 'scale(1.8)' : undefined
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function LogoMarquee({ initialLogos }: LogoMarqueeProps = {}) {
  const activeLogos =
    initialLogos && initialLogos.length > 0 ? initialLogos : FALLBACK_PARTNERS;

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 border-b border-slate-100">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white pointer-events-none" />
      
      <FadeInSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center relative z-10">
        <p className="font-heading font-semibold text-xs sm:text-sm uppercase tracking-[0.05em] leading-none text-slate-400">
          Trusted By Industry Leaders
        </p>
      </FadeInSection>

      <div className={`relative ${styles.viewport} z-10`}>
        {/* Fading edges for the marquee */}
        <div aria-hidden="true" className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div aria-hidden="true" className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

        <div aria-hidden="true" className={`${styles.track}`}>
          <LogoGroup logos={activeLogos} />
          <LogoGroup logos={activeLogos} />
          <LogoGroup logos={activeLogos} />
          <LogoGroup logos={activeLogos} />
        </div>
      </div>
    </section>
  );
}
