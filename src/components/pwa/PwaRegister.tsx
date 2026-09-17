"use client";

import { useEffect } from "react";

/**
 * Registers the PWA service worker in supporting browsers
 */
export default function PwaRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.location.protocol.startsWith("http")
    ) {
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
    }
  }, []);

  return null;
}
