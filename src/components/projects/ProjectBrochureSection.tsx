"use client";

import { FileDown, MessageCircle, Sparkles } from "lucide-react";
import type { Project } from "@/data/projects";
import { trackProjectClick, trackContactClick } from "@/lib/analytics";

interface ProjectBrochureSectionProps {
  project: Project;
  variant?: "modal" | "page";
}

export default function ProjectBrochureSection({
  project,
  variant = "modal",
}: ProjectBrochureSectionProps) {
  const hasDirectBrochure = Boolean(project.brochureUrl && project.brochureUrl.trim());

  const getWhatsAppBrochureUrl = () => {
    const message = `Hi The PM Properties, I would like to request the official brochure for ${project.title} (${project.location.locality}, ${project.location.city}). Please share the PDF brochure, floor plans, and pricing sheet.`;
    return `https://wa.me/919029923246?text=${encodeURIComponent(message)}`;
  };

  const isModal = variant === "modal";

  return (
    <div className={isModal ? "mt-5 pt-5 border-t border-slate-100" : "mt-8 pt-8 border-t border-slate-100"}>
      {/* Section Header */}
      <h3
        className={
          isModal
            ? "font-heading font-bold text-base sm:text-lg text-slate-900 mb-2 leading-tight tracking-[-0.01em]"
            : "font-heading font-bold text-xl sm:text-2xl text-slate-900 mb-3 leading-[1.2] tracking-[-0.02em]"
        }
      >
        Project Brochure &amp; Floor Plans
      </h3>

      {/* Brochure CTA Card Box */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-50 via-white to-brand-50/30 border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Icon & Details */}
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0 text-brand-600 mt-0.5 sm:mt-0">
            <FileDown className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-heading font-bold text-sm sm:text-base text-slate-900 leading-snug">
                Official {project.title} Brochure
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100/70 text-brand-700">
                <Sparkles className="w-2.5 h-2.5" /> Verified
              </span>
            </div>
            <p className="font-body font-normal text-xs sm:text-sm text-slate-600 leading-relaxed">
              Get the complete project details, master layout, floor plans, and current price list.
            </p>
          </div>
        </div>

        {/* Right Side: Dedicated Action Button */}
        <div className="shrink-0 w-full sm:w-auto">
          {hasDirectBrochure ? (
            <a
              href={project.brochureUrl}
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
                  action: "brochure_download",
                });
                trackContactClick({
                  method: "brochure_pdf",
                  location: isModal ? "project_modal_brochure" : "project_page_brochure",
                  destination: project.brochureUrl || "",
                  label: `${project.title} Direct PDF`,
                });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl border-2 border-brand-600 bg-white hover:bg-brand-600 text-brand-700 hover:text-white font-heading font-semibold text-xs sm:text-sm leading-none transition-all shadow-xs hover:shadow-md cursor-pointer group"
              title="Download official PDF brochure"
            >
              <FileDown className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              <span>Download Brochure</span>
            </a>
          ) : (
            <a
              href={getWhatsAppBrochureUrl()}
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
                  action: "brochure_download",
                });
                trackContactClick({
                  method: "whatsapp",
                  location: isModal ? "project_modal_brochure" : "project_page_brochure",
                  destination: getWhatsAppBrochureUrl(),
                  label: `${project.title} WhatsApp Brochure Request`,
                });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl border-2 border-brand-600 bg-white hover:bg-brand-600 text-brand-700 hover:text-white font-heading font-semibold text-xs sm:text-sm leading-none transition-all shadow-xs hover:shadow-md cursor-pointer group"
              title="Request brochure via WhatsApp"
            >
              <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Request Brochure</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
