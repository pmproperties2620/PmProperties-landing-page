"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useConsultationModal } from "@/context/ConsultationModalContext";

export default function Hero() {
  const { openModal } = useConsultationModal();

  return (
    <section className="relative min-h-screen w-full flex flex-col overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/images/hero-bg-new.png')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-white/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#8E1200]/85 via-[#8E1200]/65 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between flex-1 px-4 sm:px-6 lg:px-8 pt-28 pb-12 lg:py-0">
        
        {/* Left Side: Text and CTA */}
        <div className="flex flex-col items-start text-left max-w-2xl lg:pr-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#FFC107] animate-pulse" />
              <span className="font-heading text-white text-xs sm:text-sm font-bold tracking-wide uppercase">Premier Real Estate</span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-[-0.02em] mb-6">
              Prime Properties in Prime Locations
            </h1>
            
            <p className="font-body font-normal text-base sm:text-lg leading-[1.6] text-white/90 mb-8 max-w-xl">
              From premium residences to high-yield commercial hubs, we guide your real estate journey with complete transparency and trust.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button 
              type="button"
              onClick={() => openModal()}
              className="bg-white hover:bg-slate-100 text-[#8E1200] font-heading font-black text-base px-8 py-4 rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            >
              Book Your Consultation
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
            
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md py-2 px-4 rounded-full shadow-lg border border-white/20">
              <div className="flex -space-x-3">
                <Image width={40} height={40} className="w-10 h-10 rounded-full border-2 border-[#8E1200] bg-slate-200" src="https://i.pravatar.cc/100?img=11" alt="Avatar 1" unoptimized />
                <Image width={40} height={40} className="w-10 h-10 rounded-full border-2 border-[#8E1200] bg-slate-200" src="https://i.pravatar.cc/100?img=12" alt="Avatar 2" unoptimized />
                <Image width={40} height={40} className="w-10 h-10 rounded-full border-2 border-[#8E1200] bg-slate-200" src="https://i.pravatar.cc/100?img=13" alt="Avatar 3" unoptimized />
                <div className="w-10 h-10 rounded-full border-2 border-[#8E1200] bg-black flex items-center justify-center text-white font-heading text-xs sm:text-sm font-bold leading-none">+</div>
              </div>
              <div className="flex flex-col items-start ml-1">
                <div className="flex gap-2 items-center">
                  <div className="flex gap-0.5 text-[#FFC107]">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                  <span className="text-xs text-white font-body font-normal leading-[1.4]"><strong className="font-heading font-black">4.9/5</strong> rating</span>
                </div>
                <span className="text-xs text-white/80 font-body font-normal leading-[1.4] mt-0.5"><strong className="font-heading font-black">500+</strong> Happy customers</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Image Card */}
        <motion.div 
          className="mt-12 lg:mt-0 w-full max-w-lg relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="relative w-full bg-white rounded-[2rem] p-4 shadow-2xl">
             <div className="relative w-full aspect-[4/3] rounded-[1.25rem] overflow-hidden">
                <Image src="/images/hero_img_right.png" alt="Hero Right" fill sizes="(max-width: 768px) 100vw, 500px" className="object-cover" priority />
             </div>
             
             {/* Rotating Badge on Card */}
             <div className="absolute -bottom-4 -right-4 sm:-bottom-8 sm:-right-8 z-30">
               <div className="relative w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center bg-white rounded-full shadow-xl">
                 <svg className="w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
                   <path
                     id="textPath"
                     d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                     fill="none"
                   />
                   <text className="font-heading text-[9px] sm:text-[10.5px] font-bold tracking-[0.2em] fill-[#8E1200] uppercase">
                     <textPath href="#textPath" startOffset="0%">
                       PM Properties • Real Estate •
                     </textPath>
                   </text>
                 </svg>
                 <div className="absolute inset-0 m-auto w-8 h-8 sm:w-12 sm:h-12 bg-[#8E1200] rounded-full flex items-center justify-center text-white shadow-inner">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                 </div>
               </div>
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
