importScripts(
  "/scramjet/scramjet.wasm.js",
  "/scramjet/scramjet.codecs.js",
  "/scramjet/scramjet.shared.js",
  "/scramjet/scramjet.worker.js"
);

const scramjet = new ScramjetServiceWorker();

async function handleRequest(event) {
  if (event.request.url.startsWith(location.origin + "/service/scramjet/")) {
    return scramjet.fetch(event);
  }

  return await fetch(event.request)
}

self.addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event));
});
