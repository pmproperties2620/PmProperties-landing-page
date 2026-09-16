// PM Properties Service Worker for Push Notifications and Badging
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
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
        // If a window is already open at /admin, navigate and focus it
        for (const client of windowClients) {
          const clientUrl = new URL(client.url);
          if (clientUrl.pathname.startsWith("/admin") && "focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
