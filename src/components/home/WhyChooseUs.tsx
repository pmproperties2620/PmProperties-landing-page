"use client";

import { motion } from "framer-motion";
import { Award, Clock, Headphones, Shield, TrendingUp, Users } from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

const processSteps = [
  {
    icon: Shield,
    title: "Understand the Goal",
    description:
      "We start with your timeline, budget, must-haves, and concerns so every recommendation has a clear reason behind it.",
  },
  {
    icon: TrendingUp,
    title: "Build the Strategy",
    description:
      "Our team studies the market, compares opportunities, and maps the best path before you spend time on the wrong options.",
  },
  {
    icon: Clock,
    title: "Move with Focus",
    description:
      "We keep the process tight with clear next steps, quick communication, and practical guidance at every decision point.",
  },
  {
    icon: Users,
    title: "Coordinate the Details",
    description:
      "From appointments to paperwork, your advisor keeps everyone aligned so the experience feels calm and organized.",
  },
  {
    icon: Award,
    title: "Negotiate with Care",
    description:
      "We protect your interests with careful negotiation, transparent advice, and a steady read on the deal.",
  },
  {
    icon: Headphones,
    title: "Support After Closing",
    description:
      "Our relationship does not end at closing. We stay available for questions, referrals, and future planning.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="how-we-work" className="scroll-mt-28 py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-brand-600 font-semibold text-sm tracking-wide uppercase mb-3">
              How We Work
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              A Clear Process from First Call to Final Step
            </h2>
            <p className="text-slate-600 text-lg">
              We keep every move intentional, transparent, and easy to follow so clients
              always know what is happening and why it matters.
            </p>
          </div>
        </AnimatedSection>

        <StaggerContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step) => {
              const Icon = step.icon;
              return (
                <StaggerItem key={step.title}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="group p-6 sm:p-8 rounded-2xl border border-slate-200 hover:border-brand-200 hover:bg-brand-50/50 transition-all duration-300"
                  >
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-4 group-hover:bg-brand-200 transition-colors"
                    >
                      <Icon className="w-6 h-6 text-brand-600" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
