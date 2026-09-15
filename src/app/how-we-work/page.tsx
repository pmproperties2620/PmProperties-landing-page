import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import {
  Search,
  Heart,
  FileText,
  Key,
  PhoneCall,
  ClipboardCheck,
  Handshake,
  MoveRight,
  Camera,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How We Work | PM Properties",
  description:
    "Our proven 5-step process makes buying or selling your property simple, transparent, and stress-free.",
};

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

function StepCard({
  step,
  icon: Icon,
  title,
  description,
  details,
}: {
  step: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  details?: string[];
}) {
  return (
    <div className="relative pl-16 sm:pl-20 pb-12 last:pb-0">
      <div className="absolute left-0 top-0 flex flex-col items-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm sm:text-base font-bold shadow-lg">
          {step}
        </div>
        <div className="w-0.5 flex-1 bg-slate-200 mt-3" />
      </div>
      <div>
        <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center mb-3">
          <Icon className="w-5 h-5 text-brand-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 leading-relaxed mb-4">{description}</p>
        {details && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {details.map((d) => (
              <div key={d} className="flex items-center gap-2 text-sm text-slate-600">
                <MoveRight className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                {d}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HowWeWorkPage() {
  return (
    <>
      <section className="relative min-h-[60vh] flex flex-col justify-center py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero_about.png" 
            alt="How We Work" 
            fill 
            className="object-cover"
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/95 via-red-500/75 to-transparent" />
        </div>
        
        {/* Left Blueprint Graphic */}
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[450px] md:h-[450px] opacity-20 mix-blend-screen pointer-events-none -translate-x-12 translate-y-16">
          <Image
            src="/images/blueprint_left.png"
            alt=""
            fill
            className="object-contain object-left-bottom"
            priority
          />
        </div>

        {/* Right Blueprint Graphic */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[550px] md:h-[550px] opacity-20 mix-blend-screen pointer-events-none translate-x-16 translate-y-24">
          <Image
            src="/images/blueprint_right.png"
            alt=""
            fill
            className="object-contain object-right-bottom"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center w-full">
          <AnimatedSection>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">How We Work</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              A transparent, proven process designed to make your real estate journey smooth, predictable, and successful.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-600 font-semibold text-sm tracking-wide uppercase mb-3">
              For Buyers
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Your Journey to a New Home
            </h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              From first conversation to signing day, here&apos;s exactly how we&apos;ll help you
              find and close on your dream property.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {buyingSteps.map((step) => (
              <StepCard key={step.step} {...step} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-600 font-semibold text-sm tracking-wide uppercase mb-3">
              For Sellers
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Your Path to a Great Sale
            </h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              A streamlined process designed to get you top dollar with minimum hassle.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {sellingSteps.map((step) => (
              <StepCard key={step.step} {...step} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Whether you&apos;re buying, selling, or just exploring — your first consultation is
            always free and comes with zero obligations.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-white text-brand-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all shadow-lg"
          >
            Book Your Free Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
