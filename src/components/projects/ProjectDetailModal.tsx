"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
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
  ExternalLink,
  Images,
} from "lucide-react";
import type { Project } from "@/data/projects";
import { trackProjectClick, trackContactClick } from "@/lib/analytics";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import ProjectBrochureSection from "./ProjectBrochureSection";

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetailModal({
  project,
  onClose,
}: ProjectDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [prevProject, setPrevProject] = useState(project);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  if (prevProject !== project) {
    setPrevProject(project);
    setActiveImageIndex(0);
  }

  // Lock body scroll and pause Lenis when modal is open and track view
  useEffect(() => {
    if (project) {
      lockScroll();
      trackProjectClick({
        projectId: project.id,
        projectTitle: project.title,
        developer: project.developer,
        locality: project.location.locality,
        city: project.location.city,
        price: project.priceDisplay,
        action: "modal_open",
      });
      return () => {
        unlockScroll();
      };
    }
  }, [project]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[activeImageIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [activeImageIndex]);

  if (!project) return null;

  const totalImages = project.images?.length || 1;

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }
  ) => {
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -400) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > 400) {
      handlePrev();
    }
  };

  const getWhatsAppMessage = () => {
    const text = `Hi The PM Properties, I am interested in ${project.title} (${project.location.locality}, ${project.location.city}). Please share more details and pricing.`;
    return `https://wa.me/919029923246?text=${encodeURIComponent(text)}`;
  };

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent
        className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-hidden"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Modal Dialog Container: Two-column split on desktop */}
        <motion.div
          data-lenis-prevent
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl lg:max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[calc(100dvh-1.25rem)] md:h-[86vh] md:max-h-[760px] flex flex-col md:flex-row border border-slate-200/80"
        >
          {/* ========================================================================= */}
          {/* LEFT SIDE: Interactive Swipeable Gallery & Thumbnails                     */}
          {/* ========================================================================= */}
          <div className="w-full md:w-1/2 lg:w-[48%] flex flex-col bg-slate-950 shrink-0 relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-800/80">
            {/* Main Interactive Swipe Viewport */}
            <div className="relative flex-1 min-h-[250px] sm:min-h-[320px] md:min-h-0 bg-slate-950 overflow-hidden select-none">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={activeImageIndex}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={handleDragEnd}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  title="Swipe left or right to view more photos"
                >
                  <Image
                    src={
                      project.images?.[activeImageIndex] ||
                      project.images?.[0] ||
                      "/images/modern_building.png"
                    }
                    alt={`${project.title} - Photo ${activeImageIndex + 1}`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover pointer-events-none"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Gradient overlays for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

              {/* Floating Badges (Top Left) */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 flex-wrap pointer-events-none">
                <span className="px-2.5 py-0.5 rounded-full font-heading font-bold text-[11px] uppercase tracking-[0.06em] bg-brand-600 text-white shadow-md">
                  {project.developer}
                </span>
                {project.zeroBrokerage && (
                  <span className="px-2.5 py-0.5 rounded-full font-heading font-semibold text-[11px] bg-emerald-500/90 text-white flex items-center gap-1 shadow-md backdrop-blur-sm">
                    <Sparkles className="w-3 h-3" /> 0% Brokerage
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full font-heading font-semibold text-[11px] bg-slate-900/80 text-white/90 shadow-md backdrop-blur-sm border border-white/10">
                  {project.possession}
                </span>
              </div>

              {/* Image Counter Badge (Bottom Right of Image) */}
              <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/75 backdrop-blur-md text-white/90 text-xs font-heading font-semibold border border-white/10 shadow-lg">
                  <Images className="w-3.5 h-3.5 text-brand-400" />
                  <span>
                    {activeImageIndex + 1} / {totalImages}
                  </span>
                </span>
              </div>

              {/* Swipe Hint Indicator for Touch & Mouse */}
              <div className="absolute bottom-3 left-3 z-20 pointer-events-none hidden sm:block">
                <span className="text-[10px] text-white/60 font-body px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm">
                  Swipe or use arrows
                </span>
              </div>

              {/* Multiple Images Navigation Arrow Controls */}
              {totalImages > 1 && (
                <div className="absolute inset-y-0 inset-x-2.5 flex items-center justify-between pointer-events-none z-20">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous photo"
                    className="p-2 sm:p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white backdrop-blur-md pointer-events-auto transition-all shadow-lg border border-white/10 hover:scale-105 active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next photo"
                    className="p-2 sm:p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white backdrop-blur-md pointer-events-auto transition-all shadow-lg border border-white/10 hover:scale-105 active:scale-95"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail Navigation Strip */}
            {totalImages > 1 && (
              <div
                ref={thumbnailsRef}
                className="flex gap-2 p-2.5 bg-slate-950/95 border-t border-white/10 shrink-0 overflow-x-auto scroll-smooth"
                style={{ scrollbarWidth: "thin" }}
              >
                {project.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`Select photo ${idx + 1}`}
                    className={`relative w-14 h-11 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 transition-all duration-200 ${
                      activeImageIndex === idx
                        ? "ring-2 ring-brand-500 border-2 border-white scale-100 opacity-100 shadow-md"
                        : "opacity-45 hover:opacity-90 border border-white/15"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${project.title} thumb ${idx + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* RIGHT SIDE: Scrollable Information & Details Panel                        */}
          {/* ========================================================================= */}
          <div className="w-full md:w-1/2 lg:w-[52%] flex flex-col bg-white overflow-hidden min-h-0">
            {/* Header: Title, Locality, and Action Controls */}
            <div className="p-4 sm:p-5 lg:p-6 pb-3 sm:pb-4 border-b border-slate-100 flex items-start justify-between gap-3 shrink-0 bg-white/95 backdrop-blur-sm z-10">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-heading font-bold text-[10px] uppercase tracking-[0.08em] text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                    {project.developer}
                  </span>
                  <span className="font-heading font-medium text-[11px] text-slate-400">
                    &bull; {project.category}
                  </span>
                </div>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-[-0.02em] leading-tight truncate">
                  {project.title}
                </h2>
                <div className="flex items-center gap-1.5 font-body text-xs sm:text-sm text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                  <span className="truncate">
                    {project.location.locality}, {project.location.city} &bull;{" "}
                    {project.location.landmark}
                  </span>
                </div>
              </div>

              {/* Controls: Full Page Link & Close */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  href={`/projects/${project.slug}`}
                  onClick={onClose}
                  title="Open dedicated full page"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-heading font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>Full Page</span>
                </Link>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="p-1.5 sm:p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Details Body */}
            <div
              data-lenis-prevent
              className="overflow-y-auto overflow-x-hidden flex-1 min-h-0 p-4 sm:p-6 lg:p-7 space-y-6 overscroll-contain"
            >
              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm">
                <div>
                  <span className="font-heading font-bold text-[10px] uppercase tracking-[0.06em] text-slate-400 block">
                    Price Guide
                  </span>
                  <div className="font-heading font-bold text-lg text-brand-600 mt-0.5 leading-tight">
                    {project.priceDisplay}
                  </div>
                  {project.pricePerSqft && (
                    <span className="font-body font-normal text-[11px] text-slate-500">
                      {project.pricePerSqft}
                    </span>
                  )}
                </div>

                <div>
                  <span className="font-heading font-bold text-[10px] uppercase tracking-[0.06em] text-slate-400 block">
                    Configurations
                  </span>
                  <div className="font-heading font-bold text-sm sm:text-base text-slate-800 mt-0.5 leading-tight">
                    {project.configurations.join(", ")}
                  </div>
                  <span className="font-body font-normal text-[11px] text-slate-500">
                    Premium Residences
                  </span>
                </div>

                <div>
                  <span className="font-heading font-bold text-[10px] uppercase tracking-[0.06em] text-slate-400 block">
                    Carpet Area
                  </span>
                  <div className="font-heading font-bold text-sm sm:text-base text-slate-800 mt-0.5 leading-tight">
                    {project.carpetArea}
                  </div>
                  <span className="font-body font-normal text-[11px] text-slate-500 flex items-center gap-1">
                    <Ruler className="w-3 h-3 text-brand-500" /> RERA Usable Area
                  </span>
                </div>

                <div>
                  <span className="font-heading font-bold text-[10px] uppercase tracking-[0.06em] text-slate-400 block">
                    Possession
                  </span>
                  <div className="font-heading font-bold text-sm sm:text-base text-slate-800 mt-0.5 leading-tight">
                    {project.possessionDate}
                  </div>
                  <span className="font-body font-normal text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-brand-500" /> {project.possession}
                  </span>
                </div>
              </div>

              {/* MahaRERA Notice Strip */}
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70 font-body text-emerald-900 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span className="font-heading font-bold">MahaRERA Verified:</span>{" "}
                  <span className="font-mono font-medium">{project.reraId}</span> &bull; Legally vetted by The PM Properties advisory team.
                </div>
              </div>

              {/* About the Project */}
              <div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 mb-2 leading-tight tracking-[-0.01em]">
                  About {project.title}
                </h3>
                <p className="font-body font-normal text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Key Highlights */}
              <div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 mb-2.5 leading-tight tracking-[-0.01em]">
                  Key Project Highlights
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {project.highlights.map((highlight, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 font-body text-xs sm:text-sm text-slate-700 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                      <span className="leading-snug">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 mb-2.5 leading-tight tracking-[-0.01em]">
                  World-Class Amenities
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-body font-medium text-xs"
                    >
                      <Building2 className="w-3.5 h-3.5 text-brand-500" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dedicated Project Brochure Section */}
              <ProjectBrochureSection project={project} variant="modal" />
            </div>

            {/* Pinned Bottom Sticky Action Footer */}
            <div className="p-3.5 sm:p-5 bg-slate-50/95 backdrop-blur-md border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
              <div className="text-center sm:text-left hidden sm:block">
                <span className="font-body text-[11px] text-slate-500 block">
                  Questions about pricing or floor plans?
                </span>
                <span className="font-heading font-bold text-xs text-slate-800">
                  Direct The PM Properties Consultation
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href={`/projects/${project.slug}`}
                  onClick={onClose}
                  className="sm:hidden flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-heading font-semibold text-xs transition-colors"
                  title="View full dedicated property page"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>Full Page</span>
                </Link>

                <a
                  href="tel:+919029923246"
                  onClick={() => {
                    trackContactClick({
                      method: "phone",
                      location: "project_modal",
                      destination: "tel:+919029923246",
                      label: project.title,
                    });
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-heading font-semibold text-xs sm:text-sm transition-colors shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Call Now</span>
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
                      location: "project_modal",
                      destination: getWhatsAppMessage(),
                      label: `${project.title} Modal Inquiry`,
                    });
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-heading font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg"
                  title="Enquire via WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Enquire Now</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
