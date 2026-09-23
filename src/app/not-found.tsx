"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home,
  Building2,
  Briefcase,
  Users,
  Phone,
  ArrowRight,
  Compass,
} from "lucide-react";
import SectionDecoration from "@/components/ui/SectionDecoration";

export default function NotFound() {
  const quickLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Featured Projects", href: "/projects", icon: Building2 },
    { label: "Our Services", href: "/services", icon: Briefcase },
    { label: "About Us", href: "/about", icon: Users },
    { label: "Contact Advisory", href: "/contact", icon: Phone },
  ];

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center py-16 sm:py-24 bg-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-slate-100 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Subtle decorative mark */}
        <SectionDecoration className="mb-4" />

        {/* 404 Disconnected Wires Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-[560px] mb-8"
        >
          <svg
            viewBox="0 0 800 420"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto drop-shadow-sm select-none"
            role="img"
            aria-label="404 Disconnected Connection Illustration"
          >
            {/* Background Center Circular Frame */}
            <circle
              cx="400"
              cy="210"
              r="120"
              fill="#F8FAFC"
              stroke="#E2E8F0"
              strokeWidth="3"
            />
            <circle
              cx="400"
              cy="210"
              r="104"
              fill="#F1F5F9"
              fillOpacity="0.5"
            />

            {/* Left Number '4' */}
            <g id="left-4" className="text-slate-300">
              <path
                d="M210 100 L110 270 H220 V100 H260 V270 H290 V310 H260 V360 H210 V310 H90 V260 L200 80 H260 V100 H210 Z"
                fill="#E2E8F0"
                stroke="#CBD5E1"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Wire loops wrapping around left 4 */}
              <path
                d="M140 270 C100 240 100 170 150 170 C190 170 170 240 220 250"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M130 310 C160 350 200 340 240 310 C270 290 280 340 310 330"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Right Number '4' */}
            <g id="right-4" className="text-slate-300">
              <path
                d="M650 100 L550 270 H660 V100 H700 V270 H730 V310 H700 V360 H650 V310 H530 V260 L640 80 H700 V100 H650 Z"
                fill="#E2E8F0"
                stroke="#CBD5E1"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Wire loops wrapping around right 4 */}
              <path
                d="M670 170 C720 170 720 240 680 270 C640 290 620 230 580 260"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M680 310 C650 350 610 350 570 310 C530 280 510 330 480 320"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Coiled Cables from left 4 to left hand */}
            <path
              d="M180 270 C240 290 230 350 280 320 C320 300 270 220 320 195"
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Coiled Cables from right 4 to right hand */}
            <path
              d="M640 270 C570 290 580 350 530 320 C490 300 520 220 480 195"
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Center Character (The Puzzled Tech/Agent) */}
            <g id="character">
              {/* Torso & Shirt (Brand Burgundy) */}
              <path
                d="M350 320 L360 215 C360 195 440 195 440 215 L450 320 Z"
                fill="#491612"
              />

              {/* Shirt Placket & Buttons */}
              <line
                x1="400"
                y1="220"
                x2="400"
                y2="320"
                stroke="#330F0C"
                strokeWidth="2"
              />
              <circle cx="400" cy="240" r="2.5" fill="#FFFFFF" opacity="0.9" />
              <circle cx="400" cy="265" r="2.5" fill="#FFFFFF" opacity="0.9" />
              <circle cx="400" cy="290" r="2.5" fill="#FFFFFF" opacity="0.9" />

              {/* Shirt Pocket */}
              <rect
                x="414"
                y="240"
                width="18"
                height="22"
                rx="3"
                fill="#330F0C"
                stroke="#E2E8F0"
                strokeWidth="1"
                opacity="0.6"
              />

              {/* Left Arm extended outwards */}
              <path
                d="M362 215 L300 240 L310 260 L365 240 Z"
                fill="#491612"
              />
              {/* Left Forearm & Hand */}
              <path
                d="M305 242 L285 200 L300 195 L318 240 Z"
                fill="#F8D3B3"
              />
              {/* Left Hand Fingers gripping plug */}
              <circle cx="288" cy="195" r="10" fill="#F8D3B3" />

              {/* Right Arm extended outwards */}
              <path
                d="M438 215 L500 240 L490 260 L435 240 Z"
                fill="#491612"
              />
              {/* Right Forearm & Hand */}
              <path
                d="M495 242 L515 200 L500 195 L482 240 Z"
                fill="#F8D3B3"
              />
              {/* Right Hand Fingers gripping socket */}
              <circle cx="512" cy="195" r="10" fill="#F8D3B3" />

              {/* Neck */}
              <rect x="388" y="180" width="24" height="25" rx="3" fill="#F8D3B3" />

              {/* Collar (White luxury fold) */}
              <path d="M382 195 L400 220 L395 195 Z" fill="#FFFFFF" />
              <path d="M418 195 L400 220 L405 195 Z" fill="#FFFFFF" />

              {/* Head & Ears */}
              <circle cx="365" cy="160" r="7" fill="#F8D3B3" />
              <circle cx="435" cy="160" r="7" fill="#F8D3B3" />
              <ellipse cx="400" cy="155" rx="33" ry="38" fill="#F8D3B3" />

              {/* Modern Haircut */}
              <path
                d="M365 150 C365 115 435 115 435 150 C435 130 425 120 400 120 C375 120 365 130 365 150 Z"
                fill="#0F172A"
              />
              <path
                d="M365 145 C375 135 410 135 430 145 C435 138 415 125 395 125 C375 125 368 135 365 145 Z"
                fill="#1E293B"
              />

              {/* Eyebrows (Puzzled / Inquiring Expression) */}
              <path
                d="M380 144 C385 141 392 143 394 146"
                stroke="#0F172A"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M406 146 C408 143 415 141 420 144"
                stroke="#0F172A"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Eyes */}
              <circle cx="387" cy="154" r="3.5" fill="#0F172A" />
              <circle cx="413" cy="154" r="3.5" fill="#0F172A" />
              {/* Eye sparkle highlights */}
              <circle cx="388" cy="153" r="1" fill="#FFFFFF" />
              <circle cx="414" cy="153" r="1" fill="#FFFFFF" />

              {/* Nose */}
              <path
                d="M400 157 L397 166 H403"
                stroke="#C48D65"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Slightly Quirky/Puzzled Mouth */}
              <path
                d="M392 176 C397 178 403 178 408 174"
                stroke="#0F172A"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* Left Hand: Male Disconnected Plug (Warm Amber Shell) */}
            <g id="left-plug">
              {/* Plug Body */}
              <path
                d="M260 178 C255 178 250 183 250 190 L250 200 C250 207 255 212 260 212 L290 212 C295 212 300 207 300 200 L300 190 C300 183 295 178 290 178 Z"
                fill="#F59E0B"
                stroke="#D97706"
                strokeWidth="2"
              />
              {/* Metallic Prongs */}
              <rect x="298" y="184" width="14" height="4.5" rx="1.5" fill="#94A3B8" stroke="#64748B" strokeWidth="1" />
              <rect x="298" y="201" width="14" height="4.5" rx="1.5" fill="#94A3B8" stroke="#64748B" strokeWidth="1" />
              {/* Wire Connection Tail */}
              <path
                d="M250 195 L230 195"
                stroke="#1E293B"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>

            {/* Right Hand: Female Disconnected Socket (Warm Amber Shell) */}
            <g id="right-socket">
              {/* Socket Body */}
              <path
                d="M510 178 C505 178 500 183 500 190 L500 200 C500 207 505 212 510 212 L540 212 C545 212 550 207 550 200 L550 190 C550 183 545 178 540 178 Z"
                fill="#F59E0B"
                stroke="#D97706"
                strokeWidth="2"
              />
              {/* Socket Receptacle Holes */}
              <rect x="502" y="184" width="5" height="5" rx="1" fill="#78350F" />
              <rect x="502" y="201" width="5" height="5" rx="1" fill="#78350F" />
              {/* Wire Connection Tail */}
              <path
                d="M550 195 L570 195"
                stroke="#1E293B"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>

            {/* Disconnection Spark Accents in Center Gap */}
            <g id="spark-accents" opacity="0.8">
              <path
                d="M395 192 L400 182 L405 192"
                stroke="#EAB308"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="400" cy="198" r="1.5" fill="#EAB308" />
              <line x1="388" y1="188" x2="383" y2="185" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="412" y1="188" x2="417" y2="185" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </svg>
        </motion.div>

        {/* Text Content matching user request */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          <p className="font-heading text-xs sm:text-sm font-semibold uppercase tracking-[0.06em] text-brand-600 mb-2">
            Error 404 &bull; Page Not Found
          </p>

          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Lost in Transit?
          </h1>

          <p className="font-body text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
            The requested URL was not found on this server.
            <br />
            You can try the following links.
          </p>

          {/* Primary Action: Back to Home Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-heading font-semibold text-sm leading-none transition-all duration-300 shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/35 hover:-translate-y-0.5 cursor-pointer group"
            >
              <Home className="w-4 h-4 text-white transition-transform duration-300 group-hover:scale-110" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/90 font-heading font-semibold text-sm leading-none transition-all duration-300 hover:border-slate-300 cursor-pointer group"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4 text-slate-500 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* "You can try the following links" Navigation Pills */}
          <div className="pt-6 border-t border-slate-100">
            <p className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-brand-600" />
              <span>Helpful Directories</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-brand-50 text-slate-600 hover:text-brand-600 border border-slate-200/80 hover:border-brand-500/30 text-xs font-heading font-medium transition-all duration-200 shadow-2xs"
                  >
                    <Icon className="w-3 h-3 text-slate-400 group-hover:text-brand-600" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
