"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Building2,
  Briefcase,
  Settings,
  Users,
  Phone,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useConsultationModal } from "@/context/ConsultationModalContext";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import { trackCtaClick } from "@/lib/analytics";

/* ─── Types ──────────────────────────────────── */
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

/* ─── Navigation Data ────────────────────────── */
const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
  { label: "Projects", href: "/projects", icon: <Building2 className="w-4 h-4" /> },
  { label: "Our Services", href: "/services", icon: <Briefcase className="w-4 h-4" /> },
  { label: "How We Work", href: "/how-we-work", icon: <Settings className="w-4 h-4" /> },
  { label: "About Us", href: "/about", icon: <Users className="w-4 h-4" /> },
  { label: "Contact Us", href: "/contact", icon: <Phone className="w-4 h-4" /> },
] as const;

/* ─── Component ──────────────────────────────── */
export default function Header() {
  const { openModal } = useConsultationModal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      // Hero section usually takes most of the viewport
      if (window.scrollY > (window.innerHeight * 0.8)) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Lock body scroll and pause Lenis when mobile menu is open */
  useEffect(() => {
    if (mobileOpen) {
      lockScroll();
      return () => {
        unlockScroll();
      };
    }
  }, [mobileOpen]);

  /* Escape key closes mobile menu */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname === href || pathname.startsWith(href + "/");
    },
    [pathname],
  );

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* ═══════════════════════════════════════════
          HEADER — floating centered navbar
      ═══════════════════════════════════════════ */}
      <header
        className="fixed top-3 sm:top-6 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 lg:px-8 pointer-events-none"
        role="banner"
      >
        <div className="w-full max-w-7xl pointer-events-auto">
          <div className="flex items-center justify-between">
            {/* ── Logo ──────────────────────────── */}
            <Link
              href="/"
              aria-label="PM Properties — Go to homepage"
              className="relative h-20 w-64 sm:h-24 sm:w-80 lg:h-32 lg:w-96 shrink-0 opacity-90 hover:opacity-100 transition-opacity"
              prefetch={false}
            >
              <Image
                src="/images/logo.png"
                alt="PM Properties"
                fill
                sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                className={`object-contain object-left transition-all duration-300 ${!isScrolled ? 'brightness-0 invert' : ''}`}
                priority
                loading="eager"
              />
            </Link>

            {/* ── Desktop Navigation ────────────── */}
            <nav
              aria-label="Main navigation"
              className="hidden md:flex items-center gap-1 bg-white rounded-full p-1.5 shadow-xl absolute left-1/2 -translate-x-1/2"
            >
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`
                      relative flex items-center px-5 py-2.5 rounded-full
                      font-heading text-[15px] lg:text-base font-semibold leading-none whitespace-nowrap
                      transition-colors duration-200 ease-out
                      ${
                        active
                          ? "text-brand-600"
                          : "text-gray-600 hover:text-brand-600 hover:bg-gray-50"
                      }
                    `}
                  >
                    {active && (
                      <motion.div
                        layoutId="active-nav-pill"
                        className="absolute inset-0 bg-brand-50 border border-brand-600 shadow-sm rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* ── Desktop CTA ───────────────────── */}
            <div className="hidden md:flex items-center gap-1 bg-white rounded-full p-1.5 shadow-xl shrink-0">
              <button
                type="button"
                onClick={() => {
                  trackCtaClick({
                    ctaName: "Book Consultation",
                    ctaLocation: "header_desktop",
                  });
                  openModal();
                }}
                className="px-6 py-2.5 rounded-full font-heading text-[15px] lg:text-base font-bold leading-none bg-[#0a0a0a] text-white hover:bg-black shadow-md transition-all duration-200 cursor-pointer"
              >
                Book Consultation
              </button>
            </div>

            {/* ── Mobile Hamburger ──────────────── */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden p-3 rounded-full bg-white text-[#0a0a0a] shadow-xl hover:bg-gray-50 transition-all duration-200"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                  className="flex"
                >
                  {mobileOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════
          MOBILE MENU — bottom sheet
      ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Scrim / backdrop */}
            <motion.div
              key="mobile-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Bottom sheet panel */}
            <motion.div
              key="mobile-sheet"
              id="mobile-nav-menu"
              role="dialog"
              aria-label="Mobile navigation menu"
              data-lenis-prevent
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
            >
              <div
                data-lenis-prevent
                className="mx-3 mb-3 rounded-3xl overflow-hidden bg-[#111]/96 backdrop-blur-2xl border border-white/[0.08] shadow-[0_-8px_32px_rgba(0,0,0,0.6)]"
              >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-8 h-1 rounded-full bg-white/20" />
                </div>

                {/* Nav links */}
                <nav className="p-3 space-y-0.5" aria-label="Mobile navigation">
                  {NAV_ITEMS.map((item, i) => {
                    const active = isActive(item.href);
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.2 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`
                            flex items-center gap-3 px-4 py-3.5 rounded-2xl
                            font-heading text-base font-semibold leading-none transition-all duration-150 border
                            ${
                              active
                                ? "bg-brand-50 border-brand-600 text-brand-600"
                                : "border-transparent text-white/55 hover:text-white hover:bg-white/[0.07]"
                            }
                          `}
                        >
                          <span
                            className={`
                              flex items-center justify-center w-8 h-8 rounded-xl
                              ${active ? "bg-brand-100 text-brand-600" : "bg-white/[0.06] text-white/40"}
                            `}
                          >
                            {item.icon}
                          </span>
                          <span className="flex-1">{item.label}</span>
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* CTA */}
                <div className="px-3 pb-4 pt-1 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => {
                      trackCtaClick({
                        ctaName: "Book Consultation",
                        ctaLocation: "header_mobile",
                      });
                      setMobileOpen(false);
                      openModal();
                    }}
                    className="w-full mt-3 text-center py-3.5 rounded-2xl font-heading text-base font-bold leading-none bg-[#0a0a0a] text-white hover:bg-black transition-all duration-200 shadow-md cursor-pointer"
                  >
                    Book Consultation
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
