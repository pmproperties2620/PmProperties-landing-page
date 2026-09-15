"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "@/data/properties";
import SectionDecoration from "@/components/ui/SectionDecoration";

export default function Testimonials() {
  const firstRow = testimonials;
  const secondRow = [...testimonials].reverse();

  const duplicatedFirstRow = [...firstRow, ...firstRow];
  const duplicatedSecondRow = [...secondRow, ...secondRow];

  const TestimonialCard = ({ t }: { t: typeof testimonials[0] }) => (
    <div className="w-[320px] md:w-[400px] shrink-0 bg-[#0a0a0a] rounded-2xl p-8 border border-white/5 transition-all hover:border-brand-500/30 group overflow-hidden flex flex-col shadow-2xl hover:-translate-y-1 duration-300">
      {/* Header: Avatar/Name/Role and Stars */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-500 font-bold text-lg shrink-0">
            {t.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-white text-base leading-tight">{t.name}</h3>
            <p className="text-xs text-slate-400 mt-1">{t.location}</p>
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-brand-500 text-brand-500" />
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 mt-2">
        <h4 className="text-white font-semibold mb-3 text-lg">Excellent Experience</h4>
        <p className="text-slate-400 leading-relaxed text-sm">
          {t.content}
        </p>
      </div>
    </div>
  );

  return (
    <section className="py-10 sm:py-16 bg-[#050505] relative overflow-hidden">
      {/* Background ambient glow - using brand color (red) instead of purple to match codebase */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12 flex flex-col items-center">
            <SectionDecoration className="mb-4" light={true} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-brand-500 font-semibold text-sm tracking-widest uppercase mb-4">
                Client Testimonials
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
                What Our Clients Say
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
                Don&apos;t just take our word for it. Hear directly from our satisfied clients about their
                experiences working with us. Read on for real stories of success and satisfaction.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Marquee Container */}
        <div className="relative flex flex-col gap-6 md:gap-8 overflow-hidden">
          
          {/* Fading Edges */}
          <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

          {/* First Row - Moving Left */}
          <motion.div
            className="flex gap-6 md:gap-8 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 35,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {duplicatedFirstRow.map((t, index) => (
              <TestimonialCard key={`row1-${t.id}-${index}`} t={t} />
            ))}
          </motion.div>

          {/* Second Row - Moving Right */}
          <motion.div
            className="flex gap-6 md:gap-8 w-max"
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              duration: 35,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {duplicatedSecondRow.map((t, index) => (
              <TestimonialCard key={`row2-${t.id}-${index}`} t={t} />
            ))}
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
