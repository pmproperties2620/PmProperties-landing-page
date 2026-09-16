"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="bg-slate-100 text-slate-900 pt-24 pb-8 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
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
        <div className="flex gap-6 mb-16">
          <a href="https://www.facebook.com/the.pm.properties?mibextid=wwXIfr&mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#1877F2] transition-colors" aria-label="Facebook">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/the.pmproperties?igsh=ODJ0bWZpMmV4cXE%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#E1306C] transition-colors" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="https://www.youtube.com/@ThePMProperties4u" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#FF0000] transition-colors" aria-label="YouTube">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
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
          <Link href="/how-we-work" className="text-slate-700 hover:text-brand-600 transition-colors">How We Works</Link>
          <div className="w-px h-4 bg-slate-300 hidden md:block"></div>
          <Link href="/about" className="text-slate-700 hover:text-brand-600 transition-colors">About Us</Link>
          <div className="w-px h-4 bg-slate-300 hidden md:block"></div>
          <Link href="/contact" className="text-slate-700 hover:text-brand-600 transition-colors">Contact Us</Link>
        </div>

        {/* Copyright */}
        <div className="text-center font-body text-xs sm:text-sm text-slate-500 leading-[1.6]">
          <p>&copy; {new Date().getFullYear()} PM Properties. All rights reserved.</p>
        </div>
        
      </div>
    </footer>
  );
}
