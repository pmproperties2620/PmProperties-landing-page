"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
} from "lucide-react";
import type { Project } from "@/data/projects";

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

  if (prevProject !== project) {
    setPrevProject(project);
    setActiveImageIndex(0);
  }

  // Lock body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [project]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const getWhatsAppMessage = (action: string) => {
    const text = `Hi PM Properties, I would like to ${action} for ${project.title} (${project.location.locality}, ${project.location.city}). Please connect with me regarding details and site visit.`;
    return `https://wa.me/919029923246?text=${encodeURIComponent(text)}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Dialog Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col border border-slate-200"
        >
          {/* Close Button Floating */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Scrollable Content */}
          <div className="overflow-y-auto overflow-x-hidden flex-1">
            {/* Visual Header / Image Carousel */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-slate-900 overflow-hidden">
              <Image
                src={project.images[activeImageIndex] || project.images[0]}
                alt={project.title}
                fill
                priority
                className="object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

              {/* Multiple Images Navigation Controls */}
              {project.images.length > 1 && (
                <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none">
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? project.images.length - 1 : prev - 1
                      )
                    }
                    className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md pointer-events-auto transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === project.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md pointer-events-auto transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Header Details Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full font-heading font-bold text-xs uppercase tracking-[0.05em] bg-brand-600 text-white">
                    {project.developer}
                  </span>
                  {project.zeroBrokerage && (
                    <span className="px-2.5 py-0.5 rounded-full font-heading font-semibold text-xs bg-emerald-500/90 text-white flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> 0% Brokerage
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full font-heading font-semibold text-xs bg-white/20 backdrop-blur-md text-white">
                    {project.possession}
                  </span>
                </div>

                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-[-0.02em] leading-[1.15]">
                  {project.title}
                </h2>
                <div className="flex items-center gap-1.5 font-body font-normal text-xs sm:text-sm text-slate-300 mt-1">
                  <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>
                    {project.location.locality}, {project.location.city} &bull;{" "}
                    {project.location.landmark}
                  </span>
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {project.images.length > 1 && (
              <div className="flex gap-2 p-3 bg-slate-100 border-b border-slate-200 overflow-x-auto">
                {project.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? "border-brand-500 ring-2 ring-brand-500/30"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${project.title} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Content Details Body */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Key Specs Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="font-heading font-bold text-[10px] uppercase tracking-[0.05em] text-slate-400">
                    Price Guide
                  </span>
                  <div className="font-heading font-normal text-lg sm:text-xl text-brand-600 mt-0.5">
                    {project.priceDisplay}
                  </div>
                  {project.pricePerSqft && (
                    <span className="font-body font-normal text-[11px] text-slate-500">
                      {project.pricePerSqft}
                    </span>
                  )}
                </div>

                <div>
                  <span className="font-heading font-bold text-[10px] uppercase tracking-[0.05em] text-slate-400">
                    Configurations
                  </span>
                  <div className="font-heading font-bold text-sm sm:text-base text-slate-800 mt-0.5">
                    {project.configurations.join(", ")}
                  </div>
                  <span className="font-body font-normal text-[11px] text-slate-500">
                    {project.category}
                  </span>
                </div>

                <div>
                  <span className="font-heading font-bold text-[10px] uppercase tracking-[0.05em] text-slate-400">
                    Carpet Area
                  </span>
                  <div className="font-heading font-bold text-sm sm:text-base text-slate-800 mt-0.5">
                    {project.carpetArea}
                  </div>
                  <span className="font-body font-normal text-[11px] text-slate-500 flex items-center gap-1">
                    <Ruler className="w-3 h-3" /> RERA Usable
                  </span>
                </div>

                <div>
                  <span className="font-heading font-bold text-[10px] uppercase tracking-[0.05em] text-slate-400">
                    Possession
                  </span>
                  <div className="font-heading font-bold text-sm sm:text-base text-slate-800 mt-0.5">
                    {project.possessionDate}
                  </div>
                  <span className="font-body font-normal text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {project.possession}
                  </span>
                </div>
              </div>

              {/* RERA Notice Strip */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 font-body font-medium text-emerald-900 text-xs sm:text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-heading font-bold">MahaRERA Verified:</span>{" "}
                  <span className="font-mono">{project.reraId}</span> &bull;
                  Clear marketable title, legally vetted by PM Properties
                  experts.
                </div>
              </div>

              {/* About the Project */}
              <div>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-900 mb-2 leading-[1.2] tracking-[-0.02em]">
                  About {project.title}
                </h3>
                <p className="font-body font-normal text-xs sm:text-sm text-slate-600 leading-[1.6]">
                  {project.description}
                </p>
              </div>

              {/* Key Highlights */}
              <div>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-900 mb-3 leading-[1.2] tracking-[-0.02em]">
                  Key Project Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.highlights.map((highlight, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 font-body font-normal text-xs sm:text-sm text-slate-700 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 leading-[1.6]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-900 mb-3 leading-[1.2] tracking-[-0.02em]">
                  World-Class Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-body font-medium text-xs sm:text-sm"
                    >
                      <Building2 className="w-3.5 h-3.5 text-brand-500" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Action Footer */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <span className="font-body text-xs text-slate-500 block">
                Have questions about pricing or floor plans?
              </span>
              <span className="font-heading font-bold text-sm text-slate-800">
                Direct Consultation with PM Properties Expert
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <a
                href="tel:+919029923246"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-heading font-semibold text-sm leading-none transition-colors"
              >
                <Phone className="w-4 h-4 text-slate-600" />
                <span>Call Now</span>
              </a>

              <a
                href={getWhatsAppMessage("request the official brochure")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-heading font-semibold text-sm leading-none transition-all shadow-md hover:shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Get Brochure &amp; Site Visit</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
