// v2.1 — bump this comment whenever the file needs to change on its own so the
// browser's service-worker update algorithm (byte-diff on the registered
// script) picks it up. Needed once after the v1→v2 Scramjet migration: a
// stale v1 worker (which bundled bare-mux and logged its endless
// "failed to get a bare-mux SharedWorker MessagePort" retry) keeps running
// under its old scope until the browser notices this file changed and
// installs the new one — skipWaiting()/clients.claim() below then hand
// control over immediately instead of waiting for all v1 tabs to close.
// Relative, not "/controller/controller.sw.js": importScripts resolves
// against this worker's own URL, and a static deployment can have this file
// nested under an arbitrary path (see tools/build-static.mjs) rather than
// served from the origin root the way the normal app always is — this form
// resolves the same for both.
importScripts("./controller/controller.sw.js");

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// Answers the page's keepalive ping (see startHeartbeat in backends.js) with
// whether this worker still has that tab's prefix in its routing table. A
// service worker the browser evicted and respawned mid-session starts with
// an empty table until each open tab re-registers; this lets a tab notice
// within about a second instead of only on the library's own passive
// revive-on-restart broadcast. Ported from arctic-static's sw.js/s.js.
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
