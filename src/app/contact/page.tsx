"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import { faqs } from "@/data/properties";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import FAQSection from "@/components/home/FAQSection";

const contactInfo = [
  { icon: Phone, label: "Phone & WhatsApp", value: "9029923246 / 9987723246", href: "tel:+919029923246" },
  { icon: Mail, label: "Email", value: "thepmproperties4u@gmail.com", href: "mailto:thepmproperties4u@gmail.com" },
  {
    icon: MapPin,
    label: "Office Address",
    value: "Shop No : 6, Gangeshwar Maya CHS,\nOpp KDMC H Ward Office, Phule Road,\nDombivli West 421202",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon–Fri: 9am – 7pm\nSat: 10am – 5pm\nSun: By appointment",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <section className="relative min-h-[60vh] flex flex-col justify-center py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero_about.png" 
            alt="Contact Us" 
            fill 
            className="object-cover"
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/95 via-red-500/75 to-transparent" />
        </div>
        
        {/* Left Blueprint Graphic */}
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[450px] md:h-[450px] opacity-20 mix-blend-screen pointer-events-none -translate-x-12 translate-y-16">
          <Image
            src="/images/blueprint_left.png"
            alt=""
            fill
            className="object-contain object-left-bottom"
            priority
          />
        </div>

        {/* Right Blueprint Graphic */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[550px] md:h-[550px] opacity-20 mix-blend-screen pointer-events-none translate-x-16 translate-y-24">
          <Image
            src="/images/blueprint_right.png"
            alt=""
            fill
            className="object-contain object-right-bottom"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center w-full">
          <AnimatedSection>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Ready to find your dream home or discuss selling your property? We&apos;re here to
              help.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <AnimatedSection>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send Us a Message</h2>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 rounded-2xl p-8 text-center border border-emerald-200"
                >
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-600 mb-4">
                    Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="interest"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      I&apos;m interested in
                    </label>
                    <select
                      id="interest"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm bg-white"
                    >
                      <option>Buying a property</option>
                      <option>Selling my property</option>
                      <option>Property valuation</option>
                      <option>General inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm resize-none"
                      placeholder="Tell us about what you're looking for..."
                    />
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <button
                      type="submit"
                      className="w-full bg-brand-600 text-white py-4 rounded-xl font-semibold hover:bg-brand-700 transition-colors shadow-md shadow-brand-600/25 text-base"
                    >
                      Send Message
                    </button>
                  </motion.div>
                </form>
              )}
            </AnimatedSection>

            <div>
              <AnimatedSection delay={0.2}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>
                <div className="space-y-6 mb-12">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;
                    const content = (
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-brand-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{item.label}</p>
                          <p className="text-slate-600 text-sm whitespace-pre-line">
                            {item.value}
                          </p>
                        </div>
                      </motion.div>
                    );
                    return "href" in item ? (
                      <a key={item.label} href={item.href} className="block">
                        {content}
                      </a>
                    ) : (
                      <div key={item.label}>{content}</div>
                    );
                  })}
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
