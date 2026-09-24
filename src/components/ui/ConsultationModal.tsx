"use client";

import React, { useState, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Clock,
  MessageSquare,
  MapPin,
  ShieldCheck,
  Building2,
  ArrowRight,
  Phone,
} from "lucide-react";
import { useConsultationModal } from "@/context/ConsultationModalContext";
import {
  RequirementType,
  PriceType,
  StageType,
  REQUIREMENTS,
  PRICE_RANGES,
  PROPERTY_STAGES,
  createConsultationWhatsAppUrl,
} from "@/data/consultation";
import { trackLeadSubmission, trackContactClick } from "@/lib/analytics";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

export default function ConsultationModal() {
  const { isOpen, closeModal, initialData } = useConsultationModal();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRequirement, setSelectedRequirement] = useState<RequirementType | "">("");
  const [selectedPrice, setSelectedPrice] = useState<PriceType | "">("");
  const [selectedStage, setSelectedStage] = useState<StageType | "">("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<{
    fullName?: string;
    phone?: string;
    requirement?: string;
    price?: string;
    stage?: string;
  }>({});

  const nameInputId = useId();
  const phoneInputId = useId();

  // Populate initial data when opened
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      if (initialData?.requirements && ["1bhk", "2bhk", "3bhk", "other"].includes(initialData.requirements)) {
        setSelectedRequirement(initialData.requirements as RequirementType);
      }
      if (initialData?.price && ["30-40", "40-50", "50-60", "60+"].includes(initialData.price)) {
        setSelectedPrice(initialData.price as PriceType);
      }
      if (
        initialData?.stage &&
        ["rtmi", "under_construction", "resell", "nearing_possession"].includes(initialData.stage)
      ) {
        setSelectedStage(initialData.stage as StageType);
      }
    }
  }

  useEffect(() => {
    if (!isOpen) {
      // Reset after exit
      const timer = setTimeout(() => {
        setIsSubmitted(false);
        setIsSubmitting(false);
        setSubmitError("");
        setErrors({});
        setFullName("");
        setPhone("");
        setSelectedRequirement("");
        setSelectedPrice("");
        setSelectedStage("");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll and pause Lenis
  useEffect(() => {
    if (isOpen) {
      lockScroll();
      return () => {
        unlockScroll();
      };
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeModal]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full name (minimum 2 characters)";
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = "Mobile number must start with 6, 7, 8, or 9";
    }
    if (!selectedRequirement) {
      newErrors.requirement = "Please select your requirement";
    }
    if (!selectedPrice) {
      newErrors.price = "Please select a budget range";
    }
    if (!selectedStage) {
      newErrors.stage = "Please select property stage";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.replace(/\D/g, ""),
          requirement: selectedRequirement,
          priceRange: selectedPrice,
          propertyStage: selectedStage,
          source: "modal",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        trackLeadSubmission({
          formName: "consultation_modal",
          status: "error",
          requirement: selectedRequirement || undefined,
          priceRange: selectedPrice || undefined,
          propertyStage: selectedStage || undefined,
          errorMessage: data.error || "Validation error",
          source: "modal",
        });
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setSubmitError(data.error || "Failed to submit request. Please try again.");
        }
        return;
      }

      trackLeadSubmission({
        formName: "consultation_modal",
        status: "success",
        requirement: selectedRequirement || undefined,
        priceRange: selectedPrice || undefined,
        propertyStage: selectedStage || undefined,
        source: "modal",
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error("Lead submission error:", err);
      trackLeadSubmission({
        formName: "consultation_modal",
        status: "error",
        requirement: selectedRequirement || undefined,
        priceRange: selectedPrice || undefined,
        propertyStage: selectedStage || undefined,
        errorMessage: "Network error",
        source: "modal",
      });
      setSubmitError("Unable to connect to server. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppUrl = () =>
    createConsultationWhatsAppUrl({
      fullName,
      phone,
      selectedRequirement,
      selectedPrice,
      selectedStage,
      source: "Consultation Modal",
    });

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto overscroll-contain no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultation-modal-title"
            className="relative w-full max-w-4xl bg-[#111114] text-white border border-white/[0.1] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden z-10 my-auto"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-zinc-400 hover:text-white border border-white/[0.08] transition-all duration-150"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {isSubmitted ? (
              /* Success Confirmation View */
              <div className="p-6 sm:p-10 md:p-12 flex flex-col items-center text-center max-w-xl mx-auto">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-lg shadow-emerald-500/10"
                >
                  <Check className="w-8 h-8 stroke-[2.5]" />
                </motion.div>

                <span className="font-heading font-semibold text-xs sm:text-sm uppercase tracking-[0.05em] leading-none text-emerald-400 mb-2">
                  Request Confirmed
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-xl leading-tight tracking-[-0.02em] text-white mb-3">
                  You&apos;re All Set, {fullName.split(" ")[0]}!
                </h3>
                <p className="font-body font-normal text-xs sm:text-sm leading-[1.6] text-zinc-400 mb-8">
                  Your consultation request has been dispatched to our senior property advisors. We will contact you at{" "}
                  <span className="text-white font-medium">+91 {phone}</span> shortly.
                </p>

                {/* Choices recap card */}
                <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 sm:p-5 text-left mb-8 space-y-2.5">
                  <div className="font-heading text-xs font-semibold uppercase tracking-[0.05em] leading-none text-zinc-400 mb-2">
                    Consultation Summary
                  </div>
                  <div className="grid grid-cols-2 gap-3 font-body text-xs sm:text-sm leading-[1.6]">
                    <div>
                      <span className="text-zinc-400">Requirement: </span>
                      <span className="text-white font-medium">
                        {REQUIREMENTS.find((r) => r.id === selectedRequirement)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Budget: </span>
                      <span className="text-white font-medium">
                        {PRICE_RANGES.find((p) => p.id === selectedPrice)?.label}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-zinc-400">Property Stage: </span>
                      <span className="text-white font-medium">
                        {PROPERTY_STAGES.find((s) => s.id === selectedStage)?.label} (
                        {PROPERTY_STAGES.find((s) => s.id === selectedStage)?.tag})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instant Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackContactClick({
                        method: "whatsapp",
                        location: "consultation_modal_success",
                        destination: getWhatsAppUrl(),
                        label: fullName,
                      });
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-black font-heading font-semibold text-sm lg:text-[15px] leading-none px-6 py-3.5 rounded-xl transition-all shadow-lg cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-black text-black" />
                    Instant WhatsApp Connect
                  </a>
                  <button
                    onClick={closeModal}
                    className="px-6 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/[0.08] font-heading font-semibold text-sm lg:text-[15px] leading-none transition-all cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              /* Two-Column Cal.com Inspired Split Layout */
              <div className="grid grid-cols-1 md:grid-cols-12">
                {/* ── Left Sidebar (Cal.com Context Brand Panel) ── */}
                <div className="md:col-span-5 p-6 sm:p-7 bg-[#0d0d10] border-b md:border-b-0 md:border-r border-white/[0.08] flex flex-col justify-start">
                  <div>
                    {/* Brand Identifier */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-black border border-white/20 flex items-center justify-center text-white shadow-md">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-heading text-xs uppercase tracking-[0.05em] leading-none text-zinc-400 font-semibold mb-1">
                          The PM Properties
                        </div>
                        <div className="font-heading text-sm font-medium leading-none text-white">Private Advisory</div>
                      </div>
                    </div>

                    <h2
                      id="consultation-modal-title"
                      className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.02em] leading-[1.15] text-white mb-2.5"
                    >
                      Free Strategy Consultation
                    </h2>

                    <p className="font-body font-normal text-sm sm:text-base leading-[1.6] text-zinc-400 mb-5">
                      Looking for the ideal property in Mumbai &amp; MMR? Speak directly with our verified experts.
                    </p>

                    {/* Cal.com style bullet list */}
                    <ul className="space-y-2.5 font-body font-normal text-xs sm:text-sm leading-[1.6] text-zinc-300 mb-5">
                      <li className="flex items-start gap-2.5">
                        <span className="text-zinc-400 font-mono select-none">→</span>
                        <span>Your exact requirements &amp; timeline</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-zinc-400 font-mono select-none">→</span>
                        <span>Curated inventory with developer direct pricing</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-zinc-400 font-mono select-none">→</span>
                        <span>Clear budget breakdown &amp; ROI projection</span>
                      </li>
                    </ul>

                    {/* Metadata Tags */}
                    <div className="pt-4 border-t border-white/[0.08] space-y-2 font-body font-normal text-xs leading-[1.6]">
                      <div className="flex items-center gap-2.5 text-zinc-400">
                        <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span>15 – 20 min dedicated session</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-zinc-400">
                        <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span>Direct Phone Call or WhatsApp</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-zinc-400">
                        <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span>Mumbai &bull; Thane &bull; Navi Mumbai</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Right Column: Interactive Minimalist Form ── */}
                <div className="md:col-span-7 p-6 sm:p-7 bg-[#111114]">
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {/* Header Label */}
                    <div>
                      <h3 className="font-heading text-lg sm:text-xl font-bold leading-tight tracking-[-0.02em] text-white">Specify Your Preferences</h3>
                    </div>

                    {/* Inputs: Full Name & Phone Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor={nameInputId}
                          className="block font-heading text-xs font-semibold leading-none text-zinc-300 mb-1.5"
                        >
                          Full Name <span className="text-rose-400">*</span>
                        </label>
                        <input
                          id={nameInputId}
                          type="text"
                          autoFocus
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                          }}
                          placeholder="e.g. Rahul Sharma"
                          className={`w-full px-3 py-2 rounded-xl bg-white/[0.04] text-white placeholder:text-zinc-600 font-body text-sm border transition-all duration-150 focus:outline-none ${
                            errors.fullName
                              ? "border-rose-500/80 focus:border-rose-500"
                              : "border-white/[0.1] focus:border-white/40 focus:ring-1 focus:ring-white/20"
                          }`}
                        />
                        {errors.fullName && (
                          <p className="mt-1 font-body text-xs text-rose-400">{errors.fullName}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor={phoneInputId}
                          className="block font-heading text-xs font-semibold leading-none text-zinc-300 mb-1.5"
                        >
                          Phone Number <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs text-zinc-400 font-body font-medium select-none pointer-events-none">
                            +91
                          </span>
                          <input
                            id={phoneInputId}
                            type="tel"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setPhone(val);
                              if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                            }}
                            placeholder="98765 43210"
                            className={`w-full pl-11 pr-3 py-2 rounded-xl bg-white/[0.04] text-white placeholder:text-zinc-600 font-body text-sm border transition-all duration-150 focus:outline-none ${
                              errors.phone
                                ? "border-rose-500/80 focus:border-rose-500"
                                : "border-white/[0.1] focus:border-white/40 focus:ring-1 focus:ring-white/20"
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 font-body text-xs text-rose-400">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Requirement (BHK) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-heading text-xs font-semibold leading-none text-zinc-300">
                          Requirements <span className="text-rose-400">*</span>
                        </label>
                        <span className="font-body text-[11px] text-zinc-400">Select configuration</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {REQUIREMENTS.map((item) => {
                          const isSelected = selectedRequirement === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setSelectedRequirement(item.id);
                                if (errors.requirement)
                                  setErrors((prev) => ({ ...prev, requirement: undefined }));
                              }}
                              className={`py-2 px-2.5 rounded-xl font-heading text-xs leading-none border transition-all duration-150 flex items-center justify-center text-center cursor-pointer ${
                                isSelected
                                  ? "bg-white text-zinc-950 border-white shadow-sm font-semibold"
                                  : "bg-white/[0.03] text-zinc-300 border-white/[0.08] hover:bg-white/[0.07] hover:border-white/20 hover:text-white font-medium"
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                      {errors.requirement && (
                        <p className="mt-1 font-body text-xs text-rose-400">{errors.requirement}</p>
                      )}
                    </div>

                    {/* Price Range */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-heading text-xs font-semibold leading-none text-zinc-300">
                          Budget Range <span className="text-rose-400">*</span>
                        </label>
                        <span className="font-body text-[11px] text-zinc-400">Estimated budget</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {PRICE_RANGES.map((item) => {
                          const isSelected = selectedPrice === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setSelectedPrice(item.id);
                                if (errors.price)
                                  setErrors((prev) => ({ ...prev, price: undefined }));
                              }}
                              className={`py-2 px-2 rounded-xl font-heading text-xs leading-none border transition-all duration-150 flex items-center justify-center text-center cursor-pointer ${
                                isSelected
                                  ? "bg-white text-zinc-950 border-white shadow-sm font-semibold"
                                  : "bg-white/[0.03] text-zinc-300 border-white/[0.08] hover:bg-white/[0.07] hover:border-white/20 hover:text-white font-medium"
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                      {errors.price && (
                        <p className="mt-1 font-body text-xs text-rose-400">{errors.price}</p>
                      )}
                    </div>

                    {/* Property Stage */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-heading text-xs font-semibold leading-none text-zinc-300">
                          Property Stage <span className="text-rose-400">*</span>
                        </label>
                        <span className="font-body text-[11px] text-zinc-400">Select any one type</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                        {PROPERTY_STAGES.map((item) => {
                          const isSelected = selectedStage === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setSelectedStage(item.id);
                                if (errors.stage)
                                  setErrors((prev) => ({ ...prev, stage: undefined }));
                              }}
                              className={`p-2 rounded-xl text-left border transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                                isSelected
                                  ? "bg-white text-zinc-950 border-white shadow-sm"
                                  : "bg-white/[0.03] text-zinc-300 border-white/[0.08] hover:bg-white/[0.07] hover:border-white/20 hover:text-white"
                              }`}
                            >
                              <span
                                className={`font-heading text-xs font-semibold leading-tight ${
                                  isSelected ? "text-zinc-950" : "text-white"
                                }`}
                              >
                                {item.label}
                              </span>
                              <span
                                className={`font-body text-[11px] mt-0.5 leading-snug ${
                                  isSelected ? "text-zinc-700" : "text-zinc-400"
                                }`}
                              >
                                {item.tag}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {errors.stage && (
                        <p className="mt-1 font-body text-xs text-rose-400">{errors.stage}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-1.5">
                      {submitError && (
                        <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-body text-xs flex items-center gap-2">
                          <span className="font-semibold">Error:</span>
                          <span>{submitError}</span>
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full group bg-white text-zinc-950 hover:bg-zinc-100 active:scale-[0.99] font-heading font-semibold py-3 px-6 rounded-xl transition-all duration-150 shadow-lg flex items-center justify-center gap-2 text-sm lg:text-[15px] leading-none disabled:opacity-70 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                            <span>Confirming...</span>
                          </div>
                        ) : (
                          <>
                            <span>Confirm Consultation Request</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                          </>
                        )}
                      </button>

                      {/* Cal.com reassurance footer */}
                      <div className="mt-2.5 flex items-center justify-center gap-1.5 font-body text-[11px] leading-[1.6] text-zinc-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>100% Confidential &bull; Verified Advisor &bull; No Broker Spam</span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
