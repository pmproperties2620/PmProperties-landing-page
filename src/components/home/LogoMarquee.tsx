import Image from "next/image";
import styles from "./LogoMarquee.module.css";

const logos = [
  "/logos/logo1.png",
  "/logos/logo2.png",
  "/logos/logo3.png",
  "/logos/logo4.png",
  "/logos/logo5.png",
  "/logos/logo6.png",
];

function LogoGroup() {
  return (
    <div className={styles.group}>
      {logos.map((src, index) => (
        <div key={index} className={styles.item}>
          <Image 
            src={src} 
            alt={`Partner Logo ${index + 1}`} 
            width={140}
            height={48}
            className={styles.image}
            style={{
              transform: src.includes('logo6') ? 'scale(2.2)' : src.includes('logo1') ? 'scale(1.8)' : undefined
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function LogoMarquee() {
  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 border-b border-slate-100">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center relative z-10">
        <p className="font-heading font-semibold text-xs sm:text-sm uppercase tracking-[0.05em] leading-none text-slate-400">
          Trusted By Industry Leaders
        </p>
      </div>

      <div className={`relative ${styles.viewport} z-10`}>
        {/* Fading edges for the marquee */}
        <div aria-hidden="true" className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div aria-hidden="true" className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

        <div aria-hidden="true" className={`${styles.track}`}>
          <LogoGroup />
          <LogoGroup />
          <LogoGroup />
          <LogoGroup />
        </div>
      </div>
    </section>
  );
}
