"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Key, BadgeDollarSign, Building2, Briefcase, ArrowRight } from "lucide-react";
import { useState } from "react";
import SectionDecoration from "@/components/ui/SectionDecoration";

const services = [
  {
    title: "Property Buying",
    description: "Find your dream home with our curated listings and expert guidance every step of the way.",
    examples: "e.g. Residential homes, luxury estates, investment properties",
    icon: Key,
    yOffset: 0,
  },
  {
    title: "Property Selling",
    description: "Maximize your property's value with our strategic marketing and extensive buyer network.",
    examples: "e.g. Market analysis, staging, premium listings",
    icon: BadgeDollarSign,
    yOffset: 24, // Staggered down
  },
  {
    title: "Property Renting",
    description: "Discover premium rental properties or find reliable tenants for your valuable investments.",
    examples: "e.g. Tenant screening, property management, leasing",
    icon: Building2,
    yOffset: 48, // Staggered further down
  },
  {
    title: "Property Consultation",
    description: "Get personalized insights and market analysis from our seasoned real estate professionals.",
    examples: "e.g. Portfolio strategy, ROI analysis, market trends",
    icon: Briefcase,
    yOffset: 12, // Staggered slightly
  },
];

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative pt-8 pb-16 md:pt-12 md:pb-20 bg-white overflow-hidden">
      {/* Background Dotted Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{ 
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-16 flex flex-col items-center">
          <SectionDecoration className="mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Our Services
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A clear approach to navigating the real estate market.
          </p>
        </div>

        {/* Outer Container with subtle border similar to image */}
        <div className="bg-slate-50/50 border border-slate-200 rounded-3xl p-4 sm:p-8 md:p-12 shadow-sm min-h-0 md:min-h-[500px] flex flex-col md:flex-row items-center justify-center overflow-x-auto pb-8 md:pb-20">
          
          <div className="flex flex-col md:flex-row items-stretch md:items-start justify-center gap-4 md:gap-4 mx-auto w-full md:min-w-max">
            {services.map((service, index) => {
              const isActive = hoveredIndex === index;
              const Icon = service.icon;

              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="w-full md:w-auto"
                >
                  <motion.div
                    layout
                    initial={false}
                    animate={{
                      // On mobile we want it to be auto/100%, but framer motion needs a way to know. 
                      // We'll rely on CSS for mobile and only animate on md screens if possible.
                      // Since we can't easily detect md in JS without a hook, we'll use a trick:
                      // Make the motion div full width in its container, and control the container.
                    }}
                    transition={{
                      type: "tween",
                      ease: "easeInOut",
                      duration: 0.4,
                    }}
                    className={`
                      relative cursor-pointer bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col
                      transition-shadow hover:shadow-md duration-500
                      w-full md:w-[220px] h-auto md:h-[320px]
                      ${isActive ? 'md:!w-[340px] md:!h-[360px]' : ''}
                      ${!isActive && service.yOffset > 0 ? `md:translate-y-[${service.yOffset}px]` : ''}
                    `}
                  >
                    {/* Left Brand Border for Active State */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "100%", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="hidden md:block absolute left-0 top-0 w-1.5 bg-brand-500"
                        />
                      )}
                    </AnimatePresence>

                    <div className={`p-6 sm:p-8 flex flex-col h-full transition-all duration-500 ease-out md:pl-8 ${isActive ? 'md:pl-10' : ''}`}>
                      {/* Top Icons */}
                      <div className="flex items-center justify-between mb-4 md:mb-auto">
                        <div className={`
                          w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-colors
                          ${isActive ? 'text-brand-500 bg-brand-50' : 'text-slate-400 bg-slate-50'}
                        `}>
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />
                        </div>
                        
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="hidden md:block"
                            >
                              <ArrowRight className="w-6 h-6 text-brand-500" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col md:mt-8">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 md:mb-0">
                          {service.title}
                        </h3>

                        {/* On mobile, always show description. On desktop, show on hover. */}
                        <div className={`
                          flex flex-col gap-2 sm:gap-4 md:overflow-hidden
                          ${isActive ? 'md:max-h-[200px] md:mt-4 md:opacity-100' : 'md:max-h-0 md:mt-0 md:opacity-0'}
                          transition-all duration-500 ease-in-out
                        `}>
                          <p className="text-slate-600 text-sm leading-relaxed">
                            {service.description}
                          </p>
                          <p className="text-brand-500 text-xs italic font-medium leading-relaxed">
                            {service.examples}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
          
        </div>
      </div>
    </section>
  );
}
