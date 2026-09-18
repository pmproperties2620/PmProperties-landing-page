import type Lenis from "lenis";

/**
 * Utility to reliably lock and unlock page scrolling across the site.
 * Handles locking document body, documentElement, and stopping/resuming Lenis smooth scrolling.
 */

let lockCount = 0;
let lenisInstance: Lenis | null = null;
type ScrollCallback = (data: { scroll: number }) => void;
const scrollCallbacks = new Set<ScrollCallback>();

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function onLenisScroll(cb: ScrollCallback): () => void {
  scrollCallbacks.add(cb);
  return () => {
    scrollCallbacks.delete(cb);
  };
}

export function registerLenis(instance: Lenis | null) {
  lenisInstance = instance;
  if (instance) {
    instance.on("scroll", (e: { scroll: number }) => {
      scrollCallbacks.forEach((cb) => cb(e));
    });
  }
  // If scroll was already locked when lenis registered, stop it immediately
  if (lockCount > 0 && lenisInstance) {
    lenisInstance.stop();
  }
}

export function lockScroll() {
  if (typeof window === "undefined") return;
  lockCount++;
  if (lockCount === 1) {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    lenisInstance?.stop();
  }
}

export function unlockScroll() {
  if (typeof window === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    lenisInstance?.start();
  }
}
