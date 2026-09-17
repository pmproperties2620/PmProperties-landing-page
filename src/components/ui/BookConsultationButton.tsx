"use client";

import React, { ReactNode } from "react";
import { useConsultationModal, ConsultationFormInitialData } from "@/context/ConsultationModalContext";
import { trackCtaClick } from "@/lib/analytics";

interface BookConsultationButtonProps {
  children?: ReactNode;
  className?: string;
  initialData?: ConsultationFormInitialData;
  trackingLocation?: string;
}

export default function BookConsultationButton({
  children = "Book Consultation",
  className = "inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl font-heading font-semibold text-sm lg:text-[15px] leading-none hover:bg-brand-700 transition-all shadow-lg cursor-pointer",
  initialData,
  trackingLocation = "page_content",
}: BookConsultationButtonProps) {
  const { openModal } = useConsultationModal();

  const handleClick = () => {
    trackCtaClick({
      ctaName: typeof children === "string" ? children : "Book Consultation",
      ctaLocation: trackingLocation,
    });
    openModal(initialData);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}
