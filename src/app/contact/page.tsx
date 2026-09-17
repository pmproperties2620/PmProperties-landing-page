"use client";

import { motion } from "framer-motion";
import { useState, useId } from "react";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Check,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Building2,
  ExternalLink,
  Award,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import FAQSection from "@/components/home/FAQSection";
import {
  RequirementType,
  PriceType,
  StageType,
  REQUIREMENTS,
  PRICE_RANGES,
  PROPERTY_STAGES,
  createConsultationWhatsAppUrl,
} from "@/data/consultation";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone & WhatsApp",
    value: "+91 90299 23246 / 99877 23246",
    href: "tel:+919029923246",
    actionLabel: "Call Now",
  },
  {
    icon: Mail,
    label: "Official Email",
    value: "thepmproperties4u@gmail.com",
    href: "mailto:thepmproperties4u@gmail.com",
    actionLabel: "Send Email",
  },
  {
    icon: MapPin,
    label: "Head Office Address",
    value: "Shop No: 6, Gangeshwar Maya CHS,\nOpp KDMC H Ward Office, Phule Road,\nDombivli West 421202",
    href: "https://maps.google.com/?q=Dombivli+West+421202",
    actionLabel: "View on Map",
  },
  {
    icon: Clock,
    label: "Advisory Hours",
    value: "Mon–Fri: 9:00 AM – 7:00 PM\nSat: 10:00 AM – 5:00 PM\nSun: By Appointment",
    actionLabel: "Available",
  },
];

export default function ContactPage() {
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
          source: "contact_page",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setSubmitError(data.error || "Failed to submit request. Please try again.");
        }
        return;
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Lead submission error:", err);
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
      source: "Contact Page Form",
    });

  return (
    <>
      {/* Hero Header */}
      <section className="relative min-h-[50vh] flex flex-col justify-center py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg-new.png"
            alt="Contact Us"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/95 via-red-500/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center w-full">
          <AnimatedSection>
            <span className="inline-block font-heading font-semibold text-xs uppercase tracking-[0.05em] leading-none text-white/80 bg-white/10 px-3.5 py-1.5 rounded-full mb-4 backdrop-blur-sm border border-white/20">
              Direct Advisory Channel
            </span>
            <h1 className="font-heading font-black text-3xl sm:text-6xl text-white mb-4 leading-[1.15] tracking-[-0.02em]">
              Get in Touch
            </h1>
            <p className="font-body font-normal text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-[1.6]">
              Book your private consultation or connect directly with senior property advisors across Mumbai, Thane &amp; Navi Mumbai.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Form & Info Section */}
      <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* ── Left Column: Consultation Form (Matching Modal Form 1:1) ── */}
            <div className="lg:col-span-7">
              <AnimatedSection>
                <div className="bg-[#111114] text-white p-6 sm:p-8 md:p-9 rounded-2xl md:rounded-3xl border border-white/[0.1] shadow-2xl relative overflow-hidden">
                  {isSubmitted ? (
                    /* Success Confirmation View */
                    <div className="py-8 sm:py-12 flex flex-col items-center text-center max-w-lg mx-auto">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-lg shadow-emerald-500/10"
                      >
                        <Check className="w-8 h-8 stroke-[2.5]" />
                      </motion.div>

                      <span className="font-heading font-semibold text-xs uppercase tracking-[0.05em] text-emerald-400 mb-2">
                        Request Confirmed
                      </span>
                      <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-3 leading-[1.15] tracking-[-0.02em]">
                        You&apos;re All Set, {fullName.split(" ")[0]}!
                      </h3>
                      <p className="font-body font-normal text-xs sm:text-sm text-zinc-400 leading-[1.6] mb-6">
                        Your consultation request has been dispatched to our senior property advisors. We will contact you at{" "}
                        <span className="text-white font-medium">+91 {phone}</span> shortly.
                      </p>

                      {/* Choices recap card */}
                      <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 sm:p-5 text-left mb-6 space-y-2.5">
                        <div className="font-heading font-semibold text-xs text-zinc-400 uppercase tracking-[0.05em] mb-2">
                          Consultation Summary
                        </div>
                        <div className="grid grid-cols-2 gap-3 font-body font-normal text-xs sm:text-sm leading-[1.6]">
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

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <a
                          href={getWhatsAppUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-black font-heading font-semibold px-6 py-3.5 rounded-xl transition-all shadow-lg text-sm leading-none"
                        >
                          <MessageSquare className="w-4 h-4 fill-black text-black" />
                          Instant WhatsApp Connect
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSubmitted(false);
                            setFullName("");
                            setPhone("");
                            setSelectedRequirement("");
                            setSelectedPrice("");
                            setSelectedStage("");
                          }}
                          className="px-6 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/[0.08] font-heading font-medium text-sm leading-none transition-all cursor-pointer"
                        >
                          Send Another
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Interactive Form */
                    <div>
                      {/* Card Header */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-black border border-white/20 flex items-center justify-center text-white shadow-sm">
                            <Building2 className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-heading font-semibold text-xs uppercase tracking-[0.05em] text-zinc-400">
                            PM Properties &bull; Private Advisory
                          </span>
                        </div>
                        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white leading-[1.15] tracking-[-0.02em]">
                          Specify Your Preferences
                        </h2>
                        <p className="font-body font-normal text-xs sm:text-sm text-zinc-400 mt-1 leading-[1.6]">
                          Fill out the form below to receive curated inventory with developer direct pricing.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
                        {/* Full Name & Phone Number */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {/* Name */}
                          <div>
                            <label
                              htmlFor={nameInputId}
                              className="block font-heading font-medium text-xs text-zinc-300 mb-1"
                            >
                              Full Name <span className="text-rose-400">*</span>
                            </label>
                            <input
                              id={nameInputId}
                              type="text"
                              value={fullName}
                              onChange={(e) => {
                                setFullName(e.target.value);
                                if (errors.fullName)
                                  setErrors((prev) => ({ ...prev, fullName: undefined }));
                              }}
                              placeholder="e.g. Rahul Sharma"
                              className={`w-full px-3 py-2.5 rounded-xl bg-white/[0.04] text-white placeholder:text-zinc-600 font-body text-sm border transition-all duration-150 focus:outline-none ${
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
                              className="block font-heading font-medium text-xs text-zinc-300 mb-1"
                            >
                              Phone Number <span className="text-rose-400">*</span>
                            </label>
                            <div className="relative flex items-center">
                              <span className="absolute left-3 font-heading font-medium text-xs text-zinc-400 select-none pointer-events-none">
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
                                  if (errors.phone)
                                    setErrors((prev) => ({ ...prev, phone: undefined }));
                                }}
                                placeholder="98765 43210"
                                className={`w-full pl-11 pr-3 py-2.5 rounded-xl bg-white/[0.04] text-white placeholder:text-zinc-600 font-body text-sm border transition-all duration-150 focus:outline-none ${
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

                        {/* Requirements (BHK) */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="font-heading font-medium text-xs text-zinc-300">
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
                                  className={`py-2 px-2.5 rounded-xl font-heading font-medium text-xs border transition-all duration-150 flex items-center justify-center text-center cursor-pointer ${
                                    isSelected
                                      ? "bg-white text-zinc-950 border-white shadow-sm font-semibold"
                                      : "bg-white/[0.03] text-zinc-300 border-white/[0.08] hover:bg-white/[0.07] hover:border-white/20 hover:text-white"
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

                        {/* Budget Range */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="font-heading font-medium text-xs text-zinc-300">
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
                                  className={`py-2 px-2 rounded-xl font-heading font-medium text-xs border transition-all duration-150 flex items-center justify-center text-center cursor-pointer ${
                                    isSelected
                                      ? "bg-white text-zinc-950 border-white shadow-sm font-semibold"
                                      : "bg-white/[0.03] text-zinc-300 border-white/[0.08] hover:bg-white/[0.07] hover:border-white/20 hover:text-white"
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
                            <label className="font-heading font-medium text-xs text-zinc-300">
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
                                    className={`font-heading text-xs font-semibold ${
                                      isSelected ? "text-zinc-950" : "text-white"
                                    }`}
                                  >
                                    {item.label}
                                  </span>
                                  <span
                                    className={`font-body text-[11px] mt-0.5 ${
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
                            <div className="mb-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-body">
                              <span className="font-semibold">Error:</span>
                              <span>{submitError}</span>
                            </div>
                          )}
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full group bg-white text-zinc-950 hover:bg-zinc-100 active:scale-[0.99] font-heading font-semibold py-3.5 px-6 rounded-xl transition-all duration-150 shadow-lg flex items-center justify-center gap-2 text-sm leading-none disabled:opacity-70 cursor-pointer"
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

                          {/* Reassurance footer */}
                          <div className="mt-3 flex items-center justify-center gap-1.5 font-body text-[11px] text-zinc-400">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>100% Confidential &bull; Verified Advisor &bull; No Broker Spam</span>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            </div>

            {/* ── Right Column: Direct Contact & Office Details ── */}
            <div className="lg:col-span-5 space-y-6">
              <AnimatedSection delay={0.15}>
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 font-heading font-semibold text-xs uppercase tracking-[0.05em] leading-none text-brand-600">
                    <Award className="w-4 h-4 text-brand-600" />
                    <span>Verified Real Estate Advisory</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-900 mb-2 leading-[1.2] tracking-[-0.02em]">Direct Contact Information</h3>
                  <p className="font-body font-normal text-xs sm:text-sm text-slate-600 mb-6 leading-[1.6]">
                    Have an urgent inquiry or want to arrange an on-site property walkthrough? Reach our executive desk directly.
                  </p>

                  <div className="space-y-4">
                    {contactInfo.map((item) => {
                      const Icon = item.icon;
                      const content = (
                        <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0 text-brand-600 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-heading font-semibold text-xs uppercase tracking-[0.05em] text-slate-500">
                                {item.label}
                              </p>
                              {"href" in item && (
                                <span className="font-heading font-semibold text-[11px] text-brand-600 flex items-center gap-0.5">
                                  {item.actionLabel}
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </div>
                            <p className="font-body font-medium text-xs sm:text-sm text-slate-900 mt-0.5 whitespace-pre-line leading-[1.6]">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      );

                      return item.href ? (
                        <a
                          key={item.label}
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="block group"
                        >
                          {content}
                        </a>
                      ) : (
                        <div key={item.label}>{content}</div>
                      );
                    })}
                  </div>

                  {/* Instant WhatsApp Quick Button */}
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <a
                      href="https://wa.me/919029923246?text=Hi%20PM%20Properties,%20I%20would%20like%20to%20inquire%20about%20available%20properties."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-black font-heading font-semibold py-3 px-4 rounded-xl text-sm leading-none transition-all shadow-md"
                    >
                      <MessageSquare className="w-4 h-4 fill-black text-black" />
                      Chat on WhatsApp (+91 90299 23246)
                    </a>
                  </div>
                </div>
              </AnimatedSection>

              {/* Verified Trust Card */}
              <AnimatedSection delay={0.25}>
                <div className="bg-gradient-to-br from-slate-900 to-zinc-950 text-white rounded-2xl p-5 sm:p-6 border border-zinc-800 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-white">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-white mb-1 leading-[1.2]">MahaRERA &amp; KDRA Certified</h4>
                    <p className="font-body font-normal text-xs text-zinc-400 leading-[1.6]">
                      Every property presented by PM Properties undergoes complete legal due diligence, title verification, and RERA registration checks.
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />
    </>
  );
}
