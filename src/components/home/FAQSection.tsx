"use client";

import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/data/properties";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import SectionDecoration from "@/components/ui/SectionDecoration";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-[#F8F9FA] relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 flex flex-col items-center">
          <SectionDecoration className="mb-4" />
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-lg mx-auto"
          >
            Quick solutions to help you understand our real estate services better.
          </motion.p>
        </div>

        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 40, scale: 0.98 },
            visible: { 
              opacity: 1, 
              y: 0,
              scale: 1,
              transition: { 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1], // easeOutQuint
                staggerChildren: 0.1,
                delayChildren: 0.2
              } 
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
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
                    className="flex items-center justify-between w-full py-4 text-left transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-slate-800 pr-4 text-base sm:text-lg group-hover:text-brand-600 transition-colors">
                      {faq.q}
                    </span>
                    <div 
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isOpen 
                          ? 'bg-slate-200 text-slate-800' 
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
                        <div className="pb-5 pt-1 text-slate-500 leading-relaxed pr-12">
                          {faq.a}
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
