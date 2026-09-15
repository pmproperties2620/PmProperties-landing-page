"use client";

import React, { ReactNode } from "react";
import { useConsultationModal, ConsultationFormInitialData } from "@/context/ConsultationModalContext";

interface BookConsultationButtonProps {
  children?: ReactNode;
  className?: string;
  initialData?: ConsultationFormInitialData;
}

export default function BookConsultationButton({
  children = "Book Consultation",
  className = "inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-brand-700 transition-all shadow-lg cursor-pointer",
  initialData,
}: BookConsultationButtonProps) {
  const { openModal } = useConsultationModal();

  return (
    <button
      type="button"
      onClick={() => openModal(initialData)}
      className={className}
    >
      {children}
    </button>
  );
}
