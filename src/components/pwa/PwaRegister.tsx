"use client";

import { useEffect } from "react";

/**
 * Registers the PWA service worker in supporting browsers
 */
export default function PwaRegister() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !window.location.protocol.startsWith("http")
    ) {
      return;
    }

    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (process.env.NODE_ENV === "development" || isLocalhost) {
      // In development, unregister any service workers to avoid stale chunk caching and hydration mismatches
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
      if ("caches" in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => caches.delete(key));
        });
      }
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // Check for service worker updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (
                installingWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New update available
                console.info("[PWA] New version available.");
              }
            };
          }
        };
      })
      .catch((error) => {
        console.warn("[PWA] Service worker registration failed:", error);
      });
  }, []);

  return null;
}
