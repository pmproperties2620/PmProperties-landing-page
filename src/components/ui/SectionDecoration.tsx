"use client";

import { motion } from "framer-motion";

export default function SectionDecoration({ className = "", light = false }: { className?: string, light?: boolean }) {
  const strokeColor = light ? "text-white/20" : "text-slate-300";
  const starColor = "text-brand-600";

  return (
    <div className={`relative w-16 h-16 inline-flex justify-center items-center ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
        {/* Circles */}
        <circle cx="42" cy="58" r="32" stroke="currentColor" strokeWidth="1.5" className={strokeColor} />
        <circle cx="58" cy="42" r="32" stroke="currentColor" strokeWidth="1.5" className={strokeColor} />
        
        {/* Star / Sparkle */}
        <motion.path
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          d="M26 14 Q 26 26 38 26 Q 26 26 26 38 Q 26 26 14 26 Q 26 26 26 14 Z"
          fill="currentColor"
          className={starColor}
          style={{ transformOrigin: "26px 26px" }}
        />
      </svg>
    </div>
  );
}
