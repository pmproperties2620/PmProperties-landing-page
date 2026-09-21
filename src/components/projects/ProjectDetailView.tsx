"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  ShieldCheck,
  Sparkles,
  Calendar,
  Ruler,
  CheckCircle2,
  Phone,
  MessageCircle,
  Building2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Share2,
  Check,
} from "lucide-react";
import type { Project } from "@/data/projects";
import { trackProjectClick, trackContactClick } from "@/lib/analytics";
import ProjectBrochureSection from "./ProjectBrochureSection";

interface ProjectDetailViewProps {
  project: Project;
}

export default function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const getWhatsAppMessage = () => {
    const text = `Hi PM Properties, I am interested in ${project.title} (${project.location.locality}, ${project.location.city}). Please share more details and connect with me regarding site visit and pricing.`;
    return `https://wa.me/919029923246?text=${encodeURIComponent(text)}`;
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : `https://www.thepmproperties.in/projects/${project.slug}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${project.title} | PM Properties`,
          text: `Explore ${project.title} by ${project.developer} in ${project.location.locality}, ${project.location.city}.`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const images = project.images && project.images.length > 0
    ? project.images
    : ["/images/modern_building.png"];

  return (
    <div className="bg-slate-50 min-h-screen pb-28 pt-20 sm:pt-24">
      {/* ── Breadcrumb & Top Navigation Bar ── */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-20 backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-semibold text-slate-600 hover:text-brand-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to All Projects</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-heading font-semibold transition-colors cursor-pointer"
              title="Share or Copy Link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-8">
        {/* ── Visual Showcase Card ── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Main Image Slider */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-slate-900 overflow-hidden">
            <Image
              src={images[activeImageIndex] || images[0]}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

            {/* Carousel Navigation Buttons */}
            {images.length > 1 && (
              <div className="absolute inset-y-0 inset-x-4 flex items-center justify-between pointer-events-none z-10">
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  aria-label="Previous image"
                  className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md pointer-events-auto transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  aria-label="Next image"
                  className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md pointer-events-auto transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Header Details Overlay */}
            <div className="absolute bottom-6 left-6 right-6 text-white z-10">
              <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-full font-heading font-bold text-xs uppercase tracking-[0.05em] bg-brand-600 text-white shadow-sm">
                  {project.developer}
                </span>
                {project.zeroBrokerage && (
                  <span className="px-3 py-1 rounded-full font-heading font-semibold text-xs bg-emerald-500/95 text-white flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" /> 0% Brokerage
                  </span>
                )}
                <span className="px-3 py-1 rounded-full font-heading font-semibold text-xs bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {project.possession}
                </span>
              </div>

              <h1 className="font-heading font-bold text-2xl sm:text-4xl text-white tracking-[-0.02em] leading-[1.15]">
                {project.title}
              </h1>

              <div className="flex items-center gap-2 font-body font-normal text-xs sm:text-sm text-slate-200 mt-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>
                  {project.location.locality}, {project.location.city} &bull;{" "}
                  {project.location.landmark}
                </span>
              </div>
            </div>
          </div>

          {/* Thumbnail Gallery Row */}
          {images.length > 1 && (
            <div className="flex gap-2 p-3 sm:p-4 bg-slate-100 border-b border-slate-200 overflow-x-auto no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? "border-brand-600 ring-2 ring-brand-600/30"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${project.title} thumbnail ${idx + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Content Details Body */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Key Specs Bar (4-Pillar Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div>
                <span className="font-heading font-bold text-[10px] sm:text-xs uppercase tracking-[0.05em] text-slate-400">
                  Price Guide
                </span>
                <div className="font-heading font-bold text-lg sm:text-2xl text-brand-600 mt-0.5">
                  {project.priceDisplay}
                </div>
                {project.pricePerSqft && (
                  <span className="font-body font-normal text-xs text-slate-500">
                    {project.pricePerSqft}
                  </span>
                )}
              </div>

              <div>
                <span className="font-heading font-bold text-[10px] sm:text-xs uppercase tracking-[0.05em] text-slate-400">
                  Configurations
                </span>
                <div className="font-heading font-bold text-sm sm:text-lg text-slate-800 mt-0.5">
                  {project.configurations.join(", ")}
                </div>
                <span className="font-body font-normal text-xs text-slate-500">
                  {project.category}
                </span>
              </div>

              <div>
                <span className="font-heading font-bold text-[10px] sm:text-xs uppercase tracking-[0.05em] text-slate-400">
                  Carpet Area
                </span>
                <div className="font-heading font-bold text-sm sm:text-lg text-slate-800 mt-0.5">
                  {project.carpetArea}
                </div>
                <span className="font-body font-normal text-xs text-slate-500 flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5 text-slate-400" /> RERA Usable
                </span>
              </div>

              <div>
                <span className="font-heading font-bold text-[10px] sm:text-xs uppercase tracking-[0.05em] text-slate-400">
                  Possession
                </span>
                <div className="font-heading font-bold text-sm sm:text-lg text-slate-800 mt-0.5">
                  {project.possessionDate}
                </div>
                <span className="font-body font-normal text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {project.possession}
                </span>
              </div>
            </div>

            {/* MahaRERA Verified Notice Strip */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 font-body text-emerald-950 text-xs sm:text-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <span className="font-heading font-bold">MahaRERA Verified:</span>{" "}
                <span className="font-mono font-semibold">{project.reraId}</span> &bull;{" "}
                Clear marketable title, 100% legally vetted by PM Properties advisory team.
              </div>
            </div>

            {/* About the Project */}
            {project.description && (
              <div>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 mb-3 leading-[1.2] tracking-[-0.02em]">
                  About {project.title}
                </h2>
                <p className="font-body font-normal text-sm sm:text-base text-slate-600 leading-[1.7] whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            )}

            {/* Key Project Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 mb-4 leading-[1.2] tracking-[-0.02em]">
                  Key Project Highlights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.highlights.map((highlight, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 font-body font-normal text-sm text-slate-700 p-3.5 rounded-xl bg-slate-50 border border-slate-100 leading-[1.6]"
                    >
                      <CheckCircle2 className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* World-Class Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <div>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 mb-4 leading-[1.2] tracking-[-0.02em]">
                  World-Class Amenities
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {project.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-body font-medium text-xs sm:text-sm border border-slate-200/60"
                    >
                      <Building2 className="w-4 h-4 text-brand-600" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dedicated Project Brochure Section */}
            <ProjectBrochureSection project={project} variant="page" />
          </div>
        </div>
      </div>

      {/* ── Fixed Floating Action Footer ── */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl p-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left hidden sm:block">
            <span className="font-body text-xs text-slate-500 block">
              Interested in {project.title}? Direct builder booking with 0% brokerage.
            </span>
            <span className="font-heading font-bold text-sm text-slate-900">
              Speak with a PM Properties Property Specialist
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href="tel:+919029923246"
              onClick={() => {
                trackContactClick({
                  method: "phone",
                  location: "project_page",
                  destination: "tel:+919029923246",
                  label: project.title,
                });
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-heading font-semibold text-sm leading-none transition-colors shadow-xs"
            >
              <Phone className="w-4 h-4 text-slate-600" />
              <span>Call Advisor</span>
            </a>

            <a
              href={getWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackProjectClick({
                  projectId: project.id,
                  projectTitle: project.title,
                  developer: project.developer,
                  locality: project.location.locality,
                  city: project.location.city,
                  price: project.priceDisplay,
                  action: "whatsapp_inquire",
                });
                trackContactClick({
                  method: "whatsapp",
                  location: "project_page",
                  destination: getWhatsAppMessage(),
                  label: `${project.title} Page Inquiry`,
                });
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-heading font-semibold text-sm leading-none transition-all shadow-md hover:shadow-lg"
              title="Enquire via WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enquire Now</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
