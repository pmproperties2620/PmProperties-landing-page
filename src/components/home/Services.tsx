"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Key,
  BadgeDollarSign,
  Building2,
  Briefcase,
  ArrowRight,
  Paintbrush,
  ShieldCheck,
  Store,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import SectionDecoration from "@/components/ui/SectionDecoration";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  examples: string;
  icon: LucideIcon;
  yOffsetClass: string;
}

const primaryServices: ServiceItem[] = [
  {
    id: "buying",
    title: "Property Buying",
    description: "Find your dream home with our curated listings and expert guidance every step of the way.",
    examples: "e.g. Residential homes, luxury estates, investment properties",
    icon: Key,
    yOffsetClass: "md:translate-y-0",
  },
  {
    id: "selling",
    title: "Property Selling",
    description: "Maximize your property's value with our strategic marketing and extensive buyer network.",
    examples: "e.g. Market analysis, staging, premium listings",
    icon: BadgeDollarSign,
    yOffsetClass: "md:translate-y-6", // 24px
  },
  {
    id: "renting",
    title: "Property Renting",
    description: "Discover premium rental properties or find reliable tenants for your valuable investments.",
    examples: "e.g. Tenant screening, property management, leasing",
    icon: Building2,
    yOffsetClass: "md:translate-y-12", // 48px
  },
  {
    id: "consultation",
    title: "Property Consultation",
    description: "Get personalized insights and market analysis from our seasoned real estate professionals.",
    examples: "e.g. Portfolio strategy, ROI analysis, market trends",
    icon: Briefcase,
    yOffsetClass: "md:translate-y-3", // 12px
  },
];

const specializedServices: ServiceItem[] = [
  {
    id: "interior-design",
    title: "Interior Design",
    description: "Transform your living or work spaces with bespoke aesthetic concepts, custom modular interiors, and turnkey execution.",
    examples: "e.g. Modular kitchens, luxury interiors, 3D space planning & styling",
    icon: Paintbrush,
    yOffsetClass: "md:translate-y-0",
  },
  {
    id: "invisible-grills",
    title: "Invisible Grills",
    description: "Secure balconies and windows with high-tensile stainless steel safety cables without obstructing panoramic outdoor views.",
    examples: "e.g. Balcony safety, bird protection, child & pet proofing",
    icon: ShieldCheck,
    yOffsetClass: "md:translate-y-6", // 24px
  },
  {
    id: "commercial-buy-sell",
    title: "Commercial Property (Buy/Sell)",
    description: "Acquire or sell prime commercial real estate, corporate offices, and high-street retail showrooms for optimal returns.",
    examples: "e.g. Office spaces, retail showrooms, commercial plots & floors",
    icon: Store,
    yOffsetClass: "md:translate-y-12", // 48px
  },
  {
    id: "commercial-industrial-rental",
    title: "Commercial & Industrial Rental",
    description: "Connect with expansive warehousing, manufacturing units, industrial sheds, and corporate lease spaces tailored for growth.",
    examples: "e.g. Logistics warehouses, industrial sheds, corporate lease spaces",
    icon: Warehouse,
    yOffsetClass: "md:translate-y-3", // 12px
  },
];

export default function Services() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const renderServiceCard = (service: ServiceItem) => {
    const isActive = hoveredId === service.id;
    const Icon = service.icon;

    return (
      <div
        key={service.id}
        onMouseEnter={() => setHoveredId(service.id)}
        onMouseLeave={() => setHoveredId(null)}
        className="w-full md:w-auto"
      >
        <motion.div
          layout
          initial={false}
          transition={{
            type: "tween",
            ease: "easeInOut",
            duration: 0.4,
          }}
          className={`
            relative cursor-pointer bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col
            transition-shadow hover:shadow-md duration-500
            w-full md:w-[220px] h-auto md:h-[320px]
            ${isActive ? "md:!w-[340px] md:!h-[360px]" : ""}
            ${!isActive ? service.yOffsetClass : ""}
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

          <div
            className={`p-6 sm:p-8 flex flex-col h-full transition-all duration-500 ease-out md:pl-8 ${
              isActive ? "md:pl-10" : ""
            }`}
          >
            {/* Top Icons */}
            <div className="flex items-center justify-between mb-4 md:mb-auto">
              <div
                className={`
                w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-colors
                ${isActive ? "text-brand-500 bg-brand-50" : "text-slate-400 bg-slate-50"}
              `}
              >
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
              <h3 className="font-heading text-lg lg:text-xl font-bold leading-tight tracking-[-0.02em] text-slate-900 mb-2 md:mb-0">
                {service.title}
              </h3>

              {/* On mobile, always show description. On desktop, show on hover. */}
              <div
                className={`
                flex flex-col gap-2 sm:gap-4 md:overflow-hidden
                ${
                  isActive
                    ? "md:max-h-[200px] md:mt-4 md:opacity-100"
                    : "md:max-h-0 md:mt-0 md:opacity-0"
                }
                transition-all duration-500 ease-in-out
              `}
              >
                <p className="font-body font-normal text-xs sm:text-sm leading-[1.6] text-slate-600">
                  {service.description}
                </p>
                <p className="font-body font-normal text-xs italic leading-[1.6] text-brand-500">
                  {service.examples}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <section id="services" className="relative pt-8 pb-16 md:pt-12 md:pb-20 bg-white overflow-hidden">
      {/* Background Dotted Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-16 flex flex-col items-center">
          <SectionDecoration className="mb-4" />
          <h2 className="font-heading text-2xl md:text-4xl font-bold leading-[1.15] tracking-[-0.02em] text-slate-900 mb-6">
            Our Services
          </h2>
          <p className="font-body font-normal text-sm sm:text-base leading-[1.6] text-slate-600 max-w-2xl mx-auto">
            A clear approach to navigating the real estate market and property solutions.
          </p>
        </div>

        {/* Outer Container */}
        <div className="bg-slate-50/50 border border-slate-200 rounded-3xl p-4 sm:p-8 md:p-12 shadow-sm flex flex-col items-center justify-center overflow-x-auto pb-10 md:pb-24 gap-8 md:gap-16">
          {/* Row 1: Core Property Services */}
          <div className="flex flex-col md:flex-row items-stretch md:items-start justify-center gap-4 md:gap-4 mx-auto w-full md:min-w-max">
            {primaryServices.map(renderServiceCard)}
          </div>

          {/* Row 2: Specialized & Commercial Services */}
          <div className="flex flex-col md:flex-row items-stretch md:items-start justify-center gap-4 md:gap-4 mx-auto w-full md:min-w-max">
            {specializedServices.map(renderServiceCard)}
          </div>
        </div>
      </div>
    </section>
  );
}
