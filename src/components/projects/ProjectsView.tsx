"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { projectsData, type Project } from "@/data/projects";
import { FadeInSection, StaggerGrid, ScaleInBadge } from "@/components/ui/AnimatedSection";
import ProjectCard from "./ProjectCard";
import ProjectFilters, { type FilterState } from "./ProjectFilters";
import ProjectDetailModal from "./ProjectDetailModal";

const initialFilters: FilterState = {
  search: "",
  category: "all",
  city: "all",
  config: "all",
  budget: "all",
  possession: "all",
};

interface ProjectsViewProps {
  initialProjects?: Project[];
}

export default function ProjectsView({ initialProjects }: ProjectsViewProps = {}) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projectsList =
    initialProjects && initialProjects.length > 0 ? initialProjects : projectsData;

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  const filteredProjects = useMemo(() => {
    return projectsList.filter((project) => {
      // Search filter
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = project.title.toLowerCase().includes(query);
        const matchesDev = project.developer.toLowerCase().includes(query);
        const matchesLoc = project.location.locality.toLowerCase().includes(query);
        const matchesCity = project.location.city.toLowerCase().includes(query);
        if (!matchesName && !matchesDev && !matchesLoc && !matchesCity) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== "all") {
        if (filters.category === "Buy" && project.listingType !== "Buy") {
          return false;
        }
        if (filters.category === "Resale" && project.listingType !== "Resale") {
          return false;
        }
        if (filters.category === "Commercial" && project.category !== "Commercial") {
          return false;
        }
        if (
          filters.category === "Rental" &&
          project.listingType !== "Rental" &&
          project.category !== "Industrial"
        ) {
          return false;
        }
      }

      // City filter
      if (filters.city !== "all" && project.location.city !== filters.city) {
        return false;
      }

      // Configuration filter
      if (filters.config !== "all") {
        if (filters.config === "Commercial") {
          if (project.category !== "Commercial" && project.category !== "Industrial") {
            return false;
          }
        } else {
          const hasConfig = project.configurations.some((c) =>
            c.toLowerCase().includes(filters.config.toLowerCase())
          );
          if (!hasConfig) return false;
        }
      }

      // Budget filter
      if (filters.budget !== "all") {
        const price = project.priceStarting;
        if (filters.budget === "under-50l" && price >= 5000000) return false;
        if (filters.budget === "50l-1cr" && (price < 5000000 || price > 10000000))
          return false;
        if (filters.budget === "1cr-2cr" && (price < 10000000 || price > 20000000))
          return false;
        if (filters.budget === "above-2cr" && price <= 20000000) return false;
      }

      // Possession filter
      if (
        filters.possession !== "all" &&
        project.possession !== filters.possession
      ) {
        return false;
      }

      return true;
    });
  }, [projectsList, filters]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Editorial Page Header */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 bg-slate-900 text-white overflow-hidden">
        {/* Decorative Grid Lines */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-white font-heading font-semibold text-xs uppercase tracking-[0.05em] leading-none text-brand-600 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Curated Real Estate Portfolio</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-6xl text-white mb-6 leading-[1.15] tracking-[-0.02em]">
            Featured Projects &amp; Properties
          </h1>

          <p className="font-body font-normal text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-[1.6] mb-10">
            Discover verified residential townships, luxury apartments, resale
            residences, and high-yield commercial assets across Kalyan,
            Dombivli, Thane, and Badlapur.
          </p>

          {/* Quick Metrics Bar */}
          <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800 text-left">
            <ScaleInBadge>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <div className="font-heading font-black text-lg sm:text-xl text-white leading-tight tracking-[-0.02em]">100% RERA</div>
                  <div className="font-body font-normal text-xs text-slate-400 leading-[1.4]">Registered Projects</div>
                </div>
              </div>
            </ScaleInBadge>

            <ScaleInBadge>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="font-heading font-black text-lg sm:text-xl text-white leading-tight tracking-[-0.02em]">0% Brokerage</div>
                  <div className="font-body font-normal text-xs text-slate-400 leading-[1.4]">On Direct Bookings</div>
                </div>
              </div>
            </ScaleInBadge>

            <ScaleInBadge>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-heading font-black text-lg sm:text-xl text-white leading-tight tracking-[-0.02em]">10+ Years</div>
                  <div className="font-body font-normal text-xs text-slate-400 leading-[1.4]">Market Authority</div>
                </div>
              </div>
            </ScaleInBadge>

            <ScaleInBadge>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="font-heading font-black text-lg sm:text-xl text-white leading-tight tracking-[-0.02em]">500+ Families</div>
                  <div className="font-body font-normal text-xs text-slate-400 leading-[1.4]">Happily Housed</div>
                </div>
              </div>
            </ScaleInBadge>
          </StaggerGrid>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Filters and Controls */}
        <ProjectFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          totalCount={projectsList.length}
          filteredCount={filteredProjects.length}
        />

        {/* Projects Grid */}
        <h2 className="sr-only">Available Properties &amp; Developments</h2>
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectCard
                    project={project}
                    onQuickView={setSelectedProject}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 mb-2 leading-[1.2] tracking-[-0.02em]">
              No matching properties found
            </h2>
            <p className="font-body font-normal text-xs sm:text-sm text-slate-500 mb-6 leading-[1.6]">
              We couldn&apos;t find any properties matching your exact criteria. Try
              loosening your budget or location filters, or contact our team for
              unlisted upcoming inventory.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white font-heading font-semibold text-xs sm:text-sm leading-none hover:bg-slate-800 transition-colors"
              >
                Reset All Filters
              </button>
              <a
                href="https://wa.me/919029923246?text=Hi%20PM%20Properties,%20I%20am%20looking%20for%20a%20property%20with%20custom%20requirements.%20Please%20guide%20me."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-heading font-semibold text-xs sm:text-sm leading-none hover:bg-brand-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask via WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* Sell / List Your Property CTA Banner */}
        <FadeInSection>
          <div className="mt-16 sm:mt-24 rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-12 text-slate-900 relative overflow-hidden shadow-xl shadow-slate-200/70">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 border border-brand-100 font-heading font-semibold text-xs uppercase tracking-[0.05em] leading-none mb-4">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>For Property Owners &amp; Developers</span>
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 mb-3 leading-[1.15] tracking-[-0.02em]">
                  Looking to Sell, Lease, or Partner with PM Properties?
                </h2>
                <p className="font-body font-normal text-xs sm:text-sm text-slate-600 leading-[1.6]">
                  Get your property listed before 10,000+ verified active buyers
                  and investors. Benefit from professional staging, legal
                  verification, and swift closing without hassle.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-heading font-semibold text-sm leading-none transition-all shadow-lg shadow-brand-600/20 hover:shadow-xl hover:shadow-brand-600/30"
                >
                  <span>List Your Property</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:+919029923246"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-heading font-semibold text-sm leading-none transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-brand-600" />
                  <span>Call Advisor</span>
                </a>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>

      {/* Quick Details Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
