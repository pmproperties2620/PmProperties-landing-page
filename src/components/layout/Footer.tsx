"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FadeInSection } from "@/components/ui/AnimatedSection";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="bg-slate-100 text-slate-900 pt-24 pb-8 border-t border-slate-200">
      <FadeInSection className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Logo */}
        <Link href="/" className="block relative h-20 w-56 sm:h-32 sm:w-[22rem] lg:h-48 lg:w-[32rem] mb-8 max-w-[90vw]">
          <Image
            src="/images/logo.png"
            alt="PM Properties"
            fill
            sizes="(max-width: 640px) 224px, (max-width: 1024px) 352px, 512px"
            className="object-contain opacity-90 hover:opacity-100 transition-opacity"
          />
        </Link>
        
        {/* Text */}
        <p className="font-body font-normal text-xs sm:text-sm leading-[1.6] text-slate-600 text-center max-w-md md:max-w-lg mb-8">
          We take great pride in ensuring the satisfaction<br className="hidden sm:block"/>
          of our customers, delivering excellence in real estate.
        </p>
        
        {/* Social Icons */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mb-16">
          <a
            href="https://www.instagram.com/the.pmproperties/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center p-3 rounded-2xl text-slate-500 hover:text-[#E1306C] hover:bg-slate-200/50 transition-all duration-200"
            aria-label="Instagram"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 transition-transform duration-200 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a
            href="https://www.youtube.com/@ThePMProperties"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center p-3 rounded-2xl text-slate-500 hover:text-[#FF0000] hover:bg-slate-200/50 transition-all duration-200"
            aria-label="YouTube"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 transition-transform duration-200 group-hover:scale-110"
              fill="currentColor"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
        
        {/* Divider */}
        <div className="w-full border-t border-slate-300 mb-10"></div>
        
        {/* Bottom Nav Links */}
        <div className="flex flex-wrap justify-center items-center gap-y-4 gap-x-6 md:gap-x-10 font-heading text-sm lg:text-[15px] font-medium leading-none mb-10">
          <Link href="/" className="text-slate-700 hover:text-brand-600 transition-colors">Home</Link>
          <div className="w-px h-4 bg-slate-300 hidden md:block"></div>
          <Link href="/projects" className="text-slate-700 hover:text-brand-600 transition-colors">Projects</Link>
          <div className="w-px h-4 bg-slate-300 hidden md:block"></div>
          <Link href="/services" className="text-slate-700 hover:text-brand-600 transition-colors">Our Services</Link>
          <div className="w-px h-4 bg-slate-300 hidden md:block"></div>
          <Link href="/how-we-work" className="text-slate-700 hover:text-brand-600 transition-colors">How We Work</Link>
          <div className="w-px h-4 bg-slate-300 hidden md:block"></div>
          <Link href="/about" className="text-slate-700 hover:text-brand-600 transition-colors">About Us</Link>
          <div className="w-px h-4 bg-slate-300 hidden md:block"></div>
          <Link href="/contact" className="text-slate-700 hover:text-brand-600 transition-colors">Contact Us</Link>
        </div>

        {/* Office Location & MahaRERA NAP Line */}
        <p className="text-center font-body text-xs text-slate-500 leading-relaxed max-w-4xl mx-auto mb-4">
          Shop No. 6, Gangeshwar Maya CHS, Opp KDMC H Ward Office, Phule Road, Dombivli West 421202 &bull; Phone:{" "}
          <a href="tel:+919029923246" className="text-slate-600 hover:text-brand-600 transition-colors">
            +91 90299 23246
          </a>{" "}
          &bull; MahaRERA Agent Reg. No: <span className="text-slate-600 font-medium">A51700019203</span> (KDRA Member)
        </p>

        {/* Copyright & Legal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 font-body text-xs sm:text-sm text-slate-500 leading-[1.6]">
          <p>&copy; {new Date().getFullYear()} PM Properties. All rights reserved.</p>
          <span className="hidden sm:inline text-slate-300">&bull;</span>
          <div className="flex items-center gap-3">
            <Link
              href="/privacy-policy"
              className="text-slate-500 hover:text-brand-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-slate-300">&bull;</span>
            <Link
              href="/disclaimer"
              className="text-slate-500 hover:text-brand-600 transition-colors"
            >
              Disclaimer
            </Link>
          </div>
        </div>

        {/* Creator Credit */}
        <div className="mt-4 flex items-center justify-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-100 border border-slate-200/80 text-[11px] sm:text-xs text-slate-500 font-body shadow-2xs transition-all hover:border-slate-300">
            <span>Crafted with</span>
            <span className="text-rose-500 inline-block animate-pulse text-[13px] leading-none" role="img" aria-label="love">
              ❤️
            </span>
            <span>by</span>
            <a
              href="https://omkar-potphode-portfolio-phi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading font-semibold text-slate-800 hover:text-brand-600 transition-colors underline-offset-4 hover:underline"
            >
              Omkar Potphode
            </a>
          </div>
        </div>
      </FadeInSection>
    </footer>
  );
}
