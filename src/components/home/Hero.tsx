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
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              Find your <br /> Future Comfort and <br /> Happiness Here
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-xl">
              Your trusted partner in finding the perfect property that matches your lifestyle and investment goals.
            </p>
          </motion.div>

          {/* CTA Block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8"
          >
            <button
              type="button"
              onClick={() => openModal()}
              className="bg-white text-[#0a1128] px-8 py-4 rounded-full font-bold text-[15px] hover:bg-gray-100 transition-colors shadow-xl flex items-center gap-2 cursor-pointer"
            >
              Book Your Consultation
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
            
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md py-2 px-4 rounded-full shadow-lg border border-white/20">
              <div className="flex -space-x-3">
                <Image width={40} height={40} className="w-10 h-10 rounded-full border-2 border-[#8E1200] bg-slate-200" src="https://i.pravatar.cc/100?img=11" alt="Avatar 1" unoptimized />
                <Image width={40} height={40} className="w-10 h-10 rounded-full border-2 border-[#8E1200] bg-slate-200" src="https://i.pravatar.cc/100?img=12" alt="Avatar 2" unoptimized />
                <Image width={40} height={40} className="w-10 h-10 rounded-full border-2 border-[#8E1200] bg-slate-200" src="https://i.pravatar.cc/100?img=13" alt="Avatar 3" unoptimized />
                <div className="w-10 h-10 rounded-full border-2 border-[#8E1200] bg-black flex items-center justify-center text-white text-sm font-bold leading-none">+</div>
              </div>
              <div className="flex flex-col items-start ml-1">
                <div className="flex gap-2 items-center">
                  <div className="flex gap-0.5 text-[#FFC107]">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-white font-medium">4.9/5 rating</span>
                </div>
                <span className="text-xs text-white/80 font-medium mt-0.5">500+ Happy customers</span>
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
                 <svg viewBox="0 0 100 100" className="absolute w-full h-full animate-[spin_20s_linear_infinite]">
                   <path
                     id="circlePath"
                     d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                     fill="transparent"
                   />
                   <text className="text-[7px] sm:text-[10px] font-bold fill-[#0a1128] tracking-widest uppercase" style={{ letterSpacing: '0.15em' }}>
                     <textPath href="#circlePath" startOffset="0%">
                       THE BEST PROPERTY CONSULTANT • THE BEST PROPERTY CONSULTANT • 
                     </textPath>
                   </text>
                 </svg>
                 
                 <motion.svg
                   animate={{ rotate: 360 }}
                   transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                   className="w-6 h-6 sm:w-10 sm:h-10 text-[#8E1200] fill-current"
                   viewBox="0 0 24 24"
                 >
                   <path d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z" />
                 </motion.svg>
               </div>
             </div>

          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
