"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { FileText, HelpCircle, ArrowRight } from "lucide-react";
import { getLenis, onLenisScroll } from "@/lib/scrollLock";

interface Section {
  id: string;
  title: string;
}

interface LegalTableOfContentsProps {
  sections: Section[];
  supportHelpText?: string;
}

export default function LegalTableOfContents({
  sections,
  supportHelpText = "Our compliance and advisory support team is available to clarify any terms or data inquiries.",
}: LegalTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "");
  const isClickingRef = useRef<boolean>(false);

  const checkActive = useCallback(() => {
    if (isClickingRef.current) return;

    // Check if scrolled near the bottom of the page
    const isNearBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 140;

    if (isNearBottom) {
      setActiveId(sections[sections.length - 1].id);
      return;
    }

    // 160px reading offset below header
    const offset = 160;
    let current = sections[0].id;

    for (let i = 0; i < sections.length; i++) {
      const el = document.getElementById(sections[i].id);
      if (el) {
        const top = el.getBoundingClientRect().top;
        if (top <= offset) {
          current = sections[i].id;
        }
      }
    }

    setActiveId(current);
  }, [sections]);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      checkActive();
    });

    // 1. Lenis scroll event
    const unsubLenis = onLenisScroll(() => {
      checkActive();
    });

    // 2. Native scroll listener
    window.addEventListener("scroll", checkActive, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      unsubLenis();
      window.removeEventListener("scroll", checkActive);
    };
  }, [checkActive]);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    setActiveId(id);
    isClickingRef.current = true;
    setTimeout(() => {
      isClickingRef.current = false;
    }, 800);

    const yOffset = -110;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(el, { offset: yOffset, duration: 0.8 });
    } else {
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    window.history.pushState(null, "", `#${id}`);
  };

  return (
    <>
      {/* ── Mobile Horizontal Quick-Jump Bar ── */}
      <div className="lg:hidden col-span-12 sticky top-20 z-40 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2.5 shadow-md -mt-4 mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {sections.map((sec, index) => {
            const isActive = activeId === sec.id;
            const num = String(index + 1).padStart(2, "0");
            return (
              <button
                key={sec.id}
                type="button"
                onClick={(e) => scrollToSection(e, sec.id)}
                className={`
                  shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-heading transition-all whitespace-nowrap
                  ${
                    isActive
                      ? "bg-brand-600 text-white font-bold shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
                  }
                `}
              >
                <span className={isActive ? "text-white/80" : "text-slate-400"}>
                  {num}
                </span>
                <span>{sec.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Desktop Sticky Left Sidebar (Exact Samarth Reference Design) ── */}
      <aside className="hidden lg:block lg:col-span-4 sticky top-24 print:hidden space-y-6">
        {/* Card 1: Document Contents */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
          <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-slate-500 mb-3.5 flex items-center gap-2 px-1">
            <FileText className="w-3.5 h-3.5 text-brand-600" />
            <span>Document Contents</span>
          </h3>

          <nav className="space-y-0.5 text-xs">
            {sections.map((sec, index) => {
              const isActive = activeId === sec.id;
              const num = String(index + 1).padStart(2, "0");
              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={(e) => scrollToSection(e, sec.id)}
                  className={`
                    flex items-start gap-2.5 py-2 px-3 rounded-lg transition-all duration-150 border-l-2
                    ${
                      isActive
                        ? "bg-red-50/80 border-brand-600 text-brand-600 font-bold shadow-xs"
                        : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                    }
                  `}
                >
                  <span
                    className={`text-[11px] font-mono font-bold shrink-0 mt-0.5 ${
                      isActive ? "text-brand-600" : "text-slate-400"
                    }`}
                  >
                    {num}
                  </span>
                  <span className="line-clamp-2 leading-snug">{sec.title}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Card 2: Have Questions? */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] border border-slate-200/90 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4 text-red-600" />
            </div>
            <h4 className="font-heading font-bold text-sm text-slate-900">
              Have Questions?
            </h4>
          </div>
          <p className="font-body text-xs text-slate-700 font-medium leading-relaxed">
            {supportHelpText}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-xl font-heading text-xs font-semibold transition-all shadow-md shadow-red-600/20 hover:shadow-red-600/30 group"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </aside>
    </>
  );
}
