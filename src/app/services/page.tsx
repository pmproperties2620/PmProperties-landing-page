import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Search,
  DollarSign,
  Camera,
  FileText,
  Handshake,
  ClipboardCheck,
  BarChart3,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Our Services | PM Properties",
  description:
    "Comprehensive real estate services including buying, selling, property valuation, marketing, and expert consultation.",
};

const services = [
  {
    icon: Search,
    title: "Home Buying",
    description:
      "From first-time buyers to seasoned investors, we guide you through every step. Personalized property searches, neighborhood insights, school reports, and expert negotiation to secure your ideal home at the best price.",
    features: [
      "Personalized property matching",
      "Neighborhood & market analysis",
      "School district reports",
      "Expert offer negotiation",
      "Mortgage broker referrals",
      "Closing coordination",
    ],
  },
  {
    icon: DollarSign,
    title: "Home Selling",
    description:
      "Our proven marketing strategy sells homes faster and for top dollar. We handle everything from staging and photography to showings and closing.",
    features: [
      "Complimentary home valuation",
      "Professional staging consultation",
      "Aerial drone photography",
      "Virtual 3D tours",
      "Targeted digital marketing",
      "Open house management",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Property Valuation",
    description:
      "Accurate, data-driven property valuations powered by local market intelligence. Know exactly what your home is worth before listing or making an offer.",
    features: [
      "Comparative market analysis",
      "Recent sale data",
      "Market trend reports",
      "Renovation ROI estimates",
      "Rental income projections",
      "Free consultation",
    ],
  },
  {
    icon: Camera,
    title: "Property Marketing",
    description:
      "Cinematic property presentations that captivate buyers. Our marketing transforms listings into must-see destinations.",
    features: [
      "Professional photography",
      "Aerial drone videography",
      "Interactive virtual tours",
      "Social media campaigns",
      "Email marketing to buyers",
      "Premium listing placements",
    ],
  },
  {
    icon: FileText,
    title: "Legal & Paperwork",
    description:
      "Navigate contracts, disclosures, and closing documents with confidence. Our network of real estate attorneys ensures everything is handled correctly.",
    features: [
      "Contract preparation & review",
      "Disclosure management",
      "Title search coordination",
      "Escrow facilitation",
      "Closing document review",
      "Legal network access",
    ],
  },
  {
    icon: BarChart3,
    title: "Investment Advisory",
    description:
      "Data-driven investment strategies for real estate portfolios. Identify high-growth markets, analyze ROI, and build wealth through strategic property investments.",
    features: [
      "Market trend analysis",
      "ROI projections",
      "Portfolio diversification",
      "Rental property analysis",
      "1031 exchange guidance",
      "Exit strategy planning",
    ],
  },
  {
    icon: Handshake,
    title: "Relocation Services",
    description:
      "Seamless relocation support for families and professionals moving to a new city. We take the stress out of your move with concierge-level service.",
    features: [
      "City & neighborhood tours",
      "School & amenity research",
      "Temporary housing assistance",
      "Moving company referrals",
      "Utility setup coordination",
      "Community orientation",
    ],
  },
  {
    icon: Home,
    title: "Property Management",
    description:
      "Full-service property management for landlords and investors. Tenant placement, maintenance, rent collection, and financial reporting included.",
    features: [
      "Tenant screening & placement",
      "Rent collection & accounting",
      "Maintenance coordination",
      "Regular property inspections",
      "Lease enforcement",
      "Monthly financial reports",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="relative min-h-[60vh] flex flex-col justify-center py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero_about.png" 
            alt="Our Services" 
            fill 
            className="object-cover"
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/95 via-red-500/75 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Everything you need to buy, sell, or invest in real estate — all under one roof.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 sm:gap-10 relative max-w-[900px] mx-auto">
            {services.map((service, i) => {
              const Icon = service.icon;
              const isEven = i % 2 === 0;
              return (
                <div
                  key={service.title}
                  className={`w-full max-w-[650px] bg-white rounded-2xl shadow-sm p-3 sm:p-4 flex flex-col sm:flex-row gap-5 sm:gap-8 items-center ${
                    isEven ? "md:self-end" : "md:self-start"
                  }`}
                >
                  <div className="w-full sm:w-[260px] shrink-0 aspect-[4/3] rounded-xl bg-brand-50 flex items-center justify-center">
                    <Icon className="w-20 h-20 text-brand-600 opacity-80" strokeWidth={1} />
                  </div>
                  <div className="w-full sm:flex-1 py-2 sm:py-4 sm:pr-6 text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">{service.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Not Sure What You Need?
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Book a free no-obligation consultation. We&apos;ll listen to your goals and recommend the
            perfect plan.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-brand-700 transition-all shadow-lg"
          >
            Book a Free Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
