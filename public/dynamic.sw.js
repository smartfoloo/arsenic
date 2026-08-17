/* global Dynamic */
importScripts("/dynamic/dynamic.config.js");
importScripts("/dynamic/dynamic.worker.js");

const dynamic = new Dynamic();

/**
 * Dynamic predates cross-origin isolation and serves frames without the header
 * an isolated page requires, so the policy is stamped on here.
 */
function isolate(response) {
  const headers = new Headers(response.headers);
  headers.set("Cross-Origin-Embedder-Policy", "require-corp");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      if (await dynamic.route(event)) return isolate(await dynamic.fetch(event));

      return fetch(event.request);
    })(),
  );
});
