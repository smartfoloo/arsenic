// Service worker for the single-file build's embed. Lives at
// /service/scramjet/sw.js so its default scope covers /service/scramjet/ on
// any static host (no Service-Worker-Allowed header needed). The relative
// importScripts keeps the folder portable to a subpath.
importScripts("../../scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      await scramjet.loadConfig();
      if (scramjet.route(event)) return scramjet.fetch(event);

      return fetch(event.request);
    })(),
  );
});
