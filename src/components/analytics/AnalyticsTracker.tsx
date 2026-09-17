"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView, trackScrollDepth } from "@/lib/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Keep track of milestones hit per page to prevent duplicate triggers
  const trackedMilestonesRef = useRef<Set<number>>(new Set());
  const rafIdRef = useRef<number | null>(null);

  // 1. Route Change & Page View Tracking
  useEffect(() => {
    // Exclude internal admin dashboard routes from customer analytics
    if (!pathname || pathname.startsWith("/admin")) {
      return;
    }

    const queryString = searchParams?.toString();
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname;

    // Reset scroll milestones on navigation to a new route
    trackedMilestonesRef.current.clear();

    // Trigger page view
    trackPageView(fullPath, document.title);
  }, [pathname, searchParams]);

  // 2. High-Performance Scroll Depth Milestones (25%, 50%, 75%, 90%, 100%)
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) {
      return;
    }

    const milestones = [25, 50, 75, 90, 100];

    const checkScrollDepth = () => {
      if (typeof window === "undefined") return;

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || 0;
      const clientHeight =
        document.documentElement.clientHeight || window.innerHeight;
      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;

      const totalScrollable = scrollHeight - clientHeight;
      if (totalScrollable <= 0) return; // Not enough content to scroll

      const currentScrollPercent = Math.min(
        100,
        Math.round((scrollTop / totalScrollable) * 100)
      );

      for (const milestone of milestones) {
        if (
          currentScrollPercent >= milestone &&
          !trackedMilestonesRef.current.has(milestone)
        ) {
          trackedMilestonesRef.current.add(milestone);
          trackScrollDepth(milestone, pathname);
        }
      }
    };

    const handleScroll = () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(checkScrollDepth);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check (in case page loads halfway scrolled or short page)
    const initialTimer = setTimeout(checkScrollDepth, 500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(initialTimer);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [pathname]);

  return null;
}
