/* global UVServiceWorker */
/* /uv/ is Ultraviolet's own dist, served straight out of node_modules. */
importScripts("/uv/uv.bundle.js");
importScripts("/uv.config.js");
importScripts("/uv/uv.sw.js");

const uv = new UVServiceWorker();

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      if (uv.route(event)) return uv.fetch(event);

      return fetch(event.request);
    })(),
  );
});
