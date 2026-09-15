"use client";

import { useEffect, useState } from "react";
import { PhoneCall, Search, FileText, Key } from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import SectionDecoration from "@/components/ui/SectionDecoration";

const steps = [
  {
    step: "1",
    title: "Consultation",
    description: "We start by understanding your unique goals, budget, and timeline.",
    icon: PhoneCall,
  },
  {
    step: "2",
    title: "Property Search",
    description: "We curate a personalized list of properties that perfectly match your criteria.",
    icon: Search,
  },
  {
    step: "3",
    title: "Make an Offer",
    description: "We craft a winning strategy and handle all negotiations on your behalf.",
    icon: FileText,
  },
  {
    step: "4",
    title: "Close & Celebrate",
    description: "We coordinate every detail until the keys are safely in your hands.",
    icon: Key,
  },
];

export default function HowWeWorkSection() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1500); // 1.5 seconds per step
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-28 bg-[#f8f9fc] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-16 md:mb-24 flex flex-col items-center">
            <SectionDecoration className="mb-4" />
            <h2 className="text-sm font-bold tracking-widest text-[#0a1128] uppercase mb-3">
              Process
            </h2>
            <h2 className="text-3xl md:text-5xl font-bold text-[#0a1128] mb-6">How We Work</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              A simple, transparent 4-step process designed to make your real estate journey smooth and stress-free.
            </p>
          </div>
        </AnimatedSection>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-[2px] bg-slate-200">
            <div 
              className="absolute top-0 left-0 bottom-0 bg-brand-600 transition-all duration-1000 ease-in-out"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
          {/* Connecting Line (Mobile) */}
          <div className="md:hidden absolute left-[2.5rem] top-12 bottom-12 w-[2px] bg-slate-200">
            <div 
              className="absolute top-0 left-0 right-0 bg-brand-600 transition-all duration-1000 ease-in-out"
              style={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />
          </div>

          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative z-10">
              {steps.map((s, i) => {
                const Icon = s.icon;
                const isActive = activeStep >= i;
                const isCurrent = activeStep === i;

                return (
                  <StaggerItem key={s.step}>
                    <div className="relative flex md:flex-col items-start md:items-center text-left md:text-center group">
                      {/* Circle Number */}
                      <div 
                        className={`relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full border-4 md:border-[8px] flex items-center justify-center mb-0 md:mb-8 mr-6 md:mr-0 z-10 transition-all duration-700 
                          ${isActive ? "border-brand-600 bg-brand-50" : "bg-white border-[#f8f9fc] shadow-[0_8px_30px_rgb(0,0,0,0.06)] group-hover:scale-110"}
                          ${isCurrent ? "scale-110 shadow-xl shadow-brand-600/20" : ""}
                        `}
                      >
                        <span className={`text-2xl md:text-3xl font-bold transition-colors duration-700 ${isActive ? "text-brand-600" : "text-[#0a1128]"}`}>
                          {s.step}
                        </span>
                        {/* Subtle Icon Background */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05]">
                           <Icon className={`w-12 h-12 md:w-14 md:h-14 transition-colors duration-700 ${isActive ? "text-brand-600" : "text-slate-900"}`} />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="pt-2 md:pt-0">
                        <h3 className={`text-xl font-bold transition-colors duration-700 mb-2 md:mb-3 ${isActive ? "text-brand-600" : "text-slate-900"}`}>{s.title}</h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">{s.description}</p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </div>
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
