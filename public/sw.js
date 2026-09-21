// PM Properties Service Worker
// Supports offline fallback, asset caching, push notifications, and app badging

const CACHE_NAME = "pm-properties-admin-v2";
const PRECACHE_ASSETS = [
  "/offline.html",
  "/admin-manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/badge-72x72.png",
  "/images/logo.png"
];

// Install: precache offline fallback and essential icons
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[PWA SW] Precache warning:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old cache versions immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      const isDev =
        self.location.hostname === "localhost" ||
        self.location.hostname === "127.0.0.1";

      return Promise.all(
        cacheNames
          .filter((name) => isDev || name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Never intercept Next.js chunks or localhost dev requests
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // In development, or for non-GET, Next.js internal files, or API requests: DO NOT INTERCEPT
  if (
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    request.method !== "GET" ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/")
  ) {
    return;
  }

  // Handle navigation requests (HTML pages) only for admin
  if (request.mode === "navigate") {
    if (url.pathname.startsWith("/admin")) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response.status === 200) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(async () => {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) return cachedResponse;
            const offlinePage = await caches.match("/offline.html");
            return offlinePage || new Response("Offline", { status: 503, statusText: "Service Unavailable" });
          })
      );
    }
    return;
  }

  // Handle static assets (only icons, fonts, and explicit images - NEVER /_next/static/)
  if (
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/fonts/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".svg")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        }).catch(() => cached);
      })
    );
    return;
  }
});

// Push notification event handler
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    try {
      payload = { title: "PM Properties Alert", body: event.data.text() };
    } catch {
      payload = { title: "PM Properties Alert", body: "New lead received." };
    }
  }

  const title = payload.title || "PM Properties: New Lead";
  const options = {
    body: payload.body || "A new consultation inquiry has been submitted.",
    icon: payload.icon || "/icons/icon-192x192.png",
    badge: payload.badge || "/icons/badge-72x72.png",
    data: {
      url: payload.url || "/admin/leads",
      leadId: payload.leadId,
    },
    tag: payload.tag || "pm-lead-notification",
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: true,
    actions: [
      {
        action: "view",
        title: "View Lead",
      },
    ],
  };

  // Sync PWA App Badge if supported
  if ("setAppBadge" in self.navigator) {
    if (typeof payload.unreadCount === "number" && payload.unreadCount > 0) {
      self.navigator.setAppBadge(payload.unreadCount).catch(() => {});
    } else {
      self.navigator.setAppBadge().catch(() => {});
    }
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event handler - Focus or navigate to leads page
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl =
    (event.notification.data && event.notification.data.url) || "/admin/leads";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          const clientUrl = new URL(client.url);
          if (clientUrl.pathname.startsWith("/admin") && "focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
