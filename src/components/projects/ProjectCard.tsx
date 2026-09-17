"use client";

import Image from "next/image";
import {
  MapPin,
  Ruler,
  Calendar,
  Sparkles,
  ShieldCheck,
  Eye,
  MessageCircle,
} from "lucide-react";
import type { Project } from "@/data/projects";
import { trackProjectClick, trackContactClick } from "@/lib/analytics";

interface ProjectCardProps {
  project: Project;
  onQuickView: (project: Project) => void;
}

export default function ProjectCard({ project, onQuickView }: ProjectCardProps) {
  const getStatusBadge = () => {
    if (project.listingType === "Resale") {
      return {
        text: "Verified Resale",
        className: "bg-blue-50 text-blue-700 border-blue-200",
      };
    }
    if (project.listingType === "Rental") {
      return {
        text: "For Lease",
        className: "bg-purple-50 text-purple-700 border-purple-200",
      };
    }
    if (project.possession === "Ready to Move") {
      return {
        text: "Ready to Move",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    }
    if (project.possession === "Under Construction") {
      return {
        text: "Under Construction",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      };
    }
    return {
      text: "New Launch",
      className: "bg-rose-50 text-rose-700 border-rose-200",
    };
  };

  const statusBadge = getStatusBadge();

  const getWhatsAppUrl = () => {
    const message = `Hi PM Properties, I am interested in ${project.title} (${project.location.locality}, ${project.location.city}). Please share the latest brochure, pricing sheet, and arrange a site visit.`;
    return `https://wa.me/919029923246?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Gallery Showcase */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={project.images[0] || "/images/modern_building.png"}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Soft Dark Vignette for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

        {/* Badges Top Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {project.zeroBrokerage && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-heading font-bold text-xs bg-brand-600 text-white shadow-sm">
                <Sparkles className="w-3 h-3" />
                0% Brokerage
              </span>
            )}
            {project.featured && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full font-heading font-semibold text-xs bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
                Featured
              </span>
            )}
          </div>

          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full font-heading font-semibold text-xs border backdrop-blur-md bg-white/95 shadow-sm ${statusBadge.className}`}
          >
            {statusBadge.text}
          </span>
        </div>

        {/* Bottom Image Overlay: RERA info & Location */}
        <div className="absolute bottom-3 left-3 right-3 z-10 text-white flex items-end justify-between">
          <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate drop-shadow-sm font-mono tracking-tight">
              RERA: {project.reraId}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Developer & Locality */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="font-heading font-bold text-xs uppercase tracking-[0.05em] text-brand-600">
            {project.developer}
          </span>
          <div className="flex items-center gap-1 font-body font-medium text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{project.location.city}</span>
          </div>
        </div>

        {/* Project Title */}
        <h3
          onClick={() => {
            trackProjectClick({
              projectId: project.id,
              projectTitle: project.title,
              developer: project.developer,
              locality: project.location.locality,
              city: project.location.city,
              price: project.priceDisplay,
              action: "title_click",
            });
            onQuickView(project);
          }}
          className="font-heading font-bold text-lg sm:text-xl text-slate-900 mb-1 leading-[1.2] tracking-[-0.02em] group-hover:text-brand-600 transition-colors cursor-pointer"
        >
          {project.title}
        </h3>

        {/* Locality & Landmark */}
        <p className="font-body font-normal text-xs text-slate-500 line-clamp-1 mb-4 leading-[1.6]">
          {project.location.locality} &bull; {project.location.landmark}
        </p>

        {/* Key Specs Grid */}
        <div className="grid grid-cols-[1fr_1.35fr] gap-2 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 mb-5 text-xs text-slate-600 overflow-hidden">
          <div className="flex items-start gap-2 min-w-0">
            <Ruler className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold leading-none mb-1">
                Area
              </span>
              <span className="font-heading font-semibold text-xs text-slate-800 leading-snug break-words">
                {project.carpetArea}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 min-w-0">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold leading-none mb-1">
                Possession
              </span>
              <span className="font-heading font-semibold text-xs text-slate-800 leading-snug break-words">
                {project.possessionDate}
              </span>
            </div>
          </div>
        </div>

        {/* Configuration Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.configurations.map((config) => (
            <span
              key={config}
              className="font-heading font-medium text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60"
            >
              {config}
            </span>
          ))}
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="block font-heading font-bold text-[10px] uppercase tracking-[0.05em] text-slate-400">
              Pricing
            </span>
            <div className="font-heading font-normal text-lg sm:text-xl text-slate-900 leading-tight">
              {project.priceDisplay}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                trackProjectClick({
                  projectId: project.id,
                  projectTitle: project.title,
                  developer: project.developer,
                  locality: project.location.locality,
                  city: project.location.city,
                  price: project.priceDisplay,
                  action: "details_button",
                });
                onQuickView(project);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 font-heading font-semibold text-xs leading-none text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              title="Quick Details"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>

            <a
              href={getWhatsAppUrl()}
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
                  location: "project_card",
                  destination: getWhatsAppUrl(),
                  label: project.title,
                });
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 font-heading font-semibold text-xs leading-none text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-sm hover:shadow"
              title="Inquire via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Inquire</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
