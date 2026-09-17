"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { faqs } from "@/data/properties";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import SectionDecoration from "@/components/ui/SectionDecoration";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-12 md:py-16 bg-[#F8F9FA] relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 flex flex-col items-center">
          <SectionDecoration className="mb-4" />
          <motion.h2 
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.5 }}
            className="font-heading text-2xl md:text-4xl font-bold leading-[1.15] tracking-[-0.02em] text-slate-900 mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, delay: shouldReduceMotion ? 0 : 0.1 }}
            className="font-body font-normal text-sm sm:text-base leading-[1.6] text-slate-500 max-w-lg mx-auto"
          >
            Quick solutions to help you understand our real estate services better.
          </motion.p>
        </div>

        <motion.div 
          variants={{
            hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: shouldReduceMotion ? 0.01 : 0.6, 
                ease: [0.16, 1, 0.3, 1],
                staggerChildren: shouldReduceMotion ? 0 : 0.08,
                delayChildren: shouldReduceMotion ? 0 : 0.1
              } 
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-10 md:p-12"
        >
          <div className="space-y-2">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div 
                  key={i} 
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                  className="group border-b border-slate-100 last:border-0 pb-2 mb-2 last:pb-0 last:mb-0"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex items-center justify-between w-full py-4 text-left transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`font-heading font-bold text-base sm:text-lg leading-snug tracking-[-0.01em] pr-4 transition-colors ${
                        isOpen ? "text-brand-600" : "text-slate-900 group-hover:text-brand-600"
                      }`}
                    >
                      {faq.q}
                    </span>
                    <div 
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isOpen 
                          ? 'bg-brand-50 text-brand-600' 
                          : 'bg-[#F1F4F3] text-slate-600 group-hover:bg-[#E8ECEB]'
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-5 pt-1 font-body font-normal text-xs sm:text-sm leading-[1.6] text-slate-500 pr-12 whitespace-pre-line">
                          {faq.a.split("• New Projects: No brokerage for buyers.").map((part, index, arr) => (
                            <span key={index}>
                              {part}
                              {index < arr.length - 1 && (
                                <strong className="font-bold text-slate-900">
                                  • New Projects: No brokerage for buyers.
                                </strong>
                              )}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
