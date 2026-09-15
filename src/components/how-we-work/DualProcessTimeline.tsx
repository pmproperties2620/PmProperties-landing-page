"use client";

import { useEffect, useState } from "react";
import { 
  MoveRight, 
  Search,
  Heart,
  FileText,
  Key,
  PhoneCall,
  ClipboardCheck,
  Handshake,
  Camera 
} from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

const buyingSteps = [
  {
    step: 1,
    icon: PhoneCall,
    title: "Free Consultation",
    description:
      "We start with a coffee (or call) to understand your goals, budget, timeline, and must-haves. No pressure, just honest conversation.",
    details: [
      "Discuss your needs & preferences",
      "Review your financial readiness",
      "Explain market conditions",
      "Set realistic expectations",
      "Answer every question",
    ],
  },
  {
    step: 2,
    icon: Search,
    title: "Property Search",
    description:
      "We curate a personalized list of properties that match your criteria. You only see homes that truly fit — no spam, no time wasted.",
    details: [
      "Personalized MLS searches",
      "Pre-market off-market listings",
      "Neighborhood deep dives",
      "School & commute analysis",
      "Virtual tour arrangements",
    ],
  },
  {
    step: 3,
    icon: Heart,
    title: "Find Your Match",
    description:
      "When you find the one, we move fast. We arrange private showings, provide honest feedback, and help you compare options side by side.",
    details: [
      "Private property showings",
      "Honest pros & cons analysis",
      "Comparison reports",
      "Second-viewing arrangements",
      "Neighborhood walkthroughs",
    ],
  },
  {
    step: 4,
    icon: FileText,
    title: "Make an Offer",
    description:
      "We craft a compelling offer strategy backed by market data. We handle all negotiations, counteroffers, and paperwork so you stay stress-free.",
    details: [
      "Market-backed offer strategy",
      "Expert negotiation",
      "Counteroffer management",
      "Contract preparation",
      "Deadline coordination",
    ],
  },
  {
    step: 5,
    icon: Key,
    title: "Close & Celebrate",
    description:
      "From inspection to closing day, we coordinate every detail. When you get those keys, we're still here for any questions that come up.",
    details: [
      "Inspection coordination",
      "Appraisal management",
      "Financing liaison",
      "Closing day support",
      "Post-move check-in",
    ],
  },
];

const sellingSteps = [
  {
    step: 1,
    icon: ClipboardCheck,
    title: "Free Home Valuation",
    description:
      "We analyze your property's value using recent sales, market trends, and home features. You get a clear, honest number — no inflated promises.",
  },
  {
    step: 2,
    icon: Camera,
    title: "Premium Marketing",
    description:
      "We transform your listing into a must-see. Professional photography, virtual tours, social media campaigns, and targeted ads reach serious buyers fast.",
  },
  {
    step: 3,
    icon: Search,
    title: "Showings & Open Houses",
    description:
      "We schedule and manage all showings, host open houses, and gather buyer feedback. You don't lift a finger.",
  },
  {
    step: 4,
    icon: Handshake,
    title: "Offer & Negotiation",
    description:
      "We present every offer with full context, negotiate aggressively on your behalf, and guide you through contingencies to the best possible deal.",
  },
  {
    step: 5,
    icon: Key,
    title: "Closing & Beyond",
    description:
      "We coordinate inspections, appraisals, and closing details. After you hand over the keys, you're still part of the PM Properties family.",
  },
];

type Step = {
  step: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  details?: string[];
};

import { TracingBeam } from "@/components/ui/tracing-beam";

export default function DualProcessTimeline() {
  const ProcessColumn = ({ title, steps }: { title: string, steps: Step[] }) => (
    <div className="flex flex-col h-fit bg-white rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-[#0a1128]">{title}</h3>
      <div className="flex-1">
        <TracingBeam className="pl-6">
          <div className="flex flex-col gap-12 relative z-10 w-full pt-4 pb-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="relative flex items-start text-left group">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center border border-brand-100 shrink-0">
                        <Icon className="w-5 h-5 text-brand-600" />
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900">{s.title}</h4>
                    </div>
                    
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">{s.description}</p>
                    
                    {s.details && (
                      <div className="grid grid-cols-1 gap-2">
                        {s.details.map((d) => (
                          <div key={d} className="flex items-start gap-2 text-sm text-slate-600">
                            <MoveRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-brand-500" />
                            <span className="text-slate-700">{d}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TracingBeam>
      </div>
    </div>
  );

  return (
    <section className="py-16 md:py-24 bg-[#f8f9fc] overflow-hidden relative">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <ProcessColumn title="For Buyers" steps={buyingSteps} />
          <ProcessColumn title="For Sellers" steps={sellingSteps} />
        </div>
      </div>
    </section>
  );
}
