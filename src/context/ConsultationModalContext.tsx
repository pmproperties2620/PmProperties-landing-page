"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface ConsultationFormInitialData {
  requirements?: "1bhk" | "2bhk" | "3bhk" | "other" | string;
  price?: "30-40" | "40-50" | "50-60" | "60+" | string;
  stage?: "rtmi" | "under_construction" | "resell" | "nearing_possession" | string;
  notes?: string;
}

interface ConsultationModalContextType {
  isOpen: boolean;
  initialData: ConsultationFormInitialData | null;
  openModal: (data?: ConsultationFormInitialData) => void;
  closeModal: () => void;
}

const ConsultationModalContext = createContext<ConsultationModalContextType | undefined>(
  undefined
);

export function ConsultationModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialData, setInitialData] = useState<ConsultationFormInitialData | null>(null);

  const openModal = useCallback((data?: ConsultationFormInitialData) => {
    if (data) setInitialData(data);
    else setInitialData(null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setInitialData(null);
  }, []);

  return (
    <ConsultationModalContext.Provider
      value={{
        isOpen,
        initialData,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ConsultationModalContext.Provider>
  );
}

export function useConsultationModal() {
  const context = useContext(ConsultationModalContext);
  if (!context) {
    throw new Error("useConsultationModal must be used within a ConsultationModalProvider");
  }
  return context;
}
