// Service worker for the single-file build's embed. Lives at
// /service/scramjet/sw.js so its default scope covers /service/scramjet/ on
// any static host (no Service-Worker-Allowed header needed). The relative
// importScripts keeps the folder portable to a subpath.
importScripts("../../controller/controller.sw.js");

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// Same heartbeat reply as the main app's public/scramjet.sw.js — answers the
// embed's keepalive ping (see startHeartbeat in embed.svg) so a tab notices
// within about a second if the browser evicted this worker mid-session,
// instead of only on the library's own passive revive-on-restart broadcast.
self.addEventListener("message", (event) => {
  const prefix = event.data && event.data.$arsenic$keepalive && event.data.$arsenic$keepalive.prefix;
  if (typeof prefix !== "string" || event.source === null) return;

  let alive = false;
  try {
    const url = new URL(prefix, self.location.href).href;
    alive = self.$scramjetController.shouldRoute({ request: { url } });
  } catch {
    alive = false;
  }
  event.source.postMessage({ $arsenic$controller: { prefix, alive } });
});

self.addEventListener("fetch", (event) => {
  try {
    if (self.$scramjetController && self.$scramjetController.shouldRoute(event)) {
      event.respondWith(self.$scramjetController.route(event));
    }
  } catch (err) {
    console.error("[scramjet sw] routing error", err);
  }
});
