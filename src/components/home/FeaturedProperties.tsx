"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { properties } from "@/data/properties";
import PropertyCard from "@/components/ui/PropertyCard";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

export default function FeaturedProperties() {
  const featured = properties.filter((p) => p.featured);

  return (
    <section className="py-20 sm:py-28 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-brand-600 font-semibold text-sm tracking-wide uppercase mb-3">
                Featured Listings
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Premium Properties
              </h2>
              <p className="text-slate-600 mt-3 max-w-2xl">
                Hand-picked selection of our finest listings. Each property meets our
                stringent quality standards for location, design, and value.
              </p>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition-colors shrink-0 group"
            >
              View All{" "}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimatedSection>

        <StaggerContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featured.map((property) => (
              <StaggerItem key={property.id}>
                <PropertyCard property={property} />
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
