"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Calendar } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useConsultationModal } from "@/context/ConsultationModalContext";

export default function CTASection() {
  const { openModal } = useConsultationModal();

  return (
    <section className="relative py-8 sm:py-12 bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/cta-bg.jpg')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/95 to-slate-50/90" />

      <motion.div
        className="absolute top-10 left-10 w-32 h-32 border border-brand-500/10 rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-48 h-48 border border-brand-500/10 rounded-full"
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, delay: 2 }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-brand-500 font-semibold text-sm tracking-wide uppercase mb-4">
              Ready to Get Started?
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Your Dream Property Is Waiting
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Whether you&apos;re buying, selling, or just exploring, our team is ready
              to help you take the next step. No pressure, just expert guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <button
                  type="button"
                  onClick={() => openModal()}
                  className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/25 cursor-pointer"
                >
                  <Calendar className="w-5 h-5" />
                  Book a Consultation
                </button>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
