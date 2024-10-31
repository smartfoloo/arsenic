importScripts('/dynamic/dynamic.config.js');
importScripts('/dynamic/dynamic.worker.js');
importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');
importScripts(__uv$config.sw || '/uv/uv.sw.js');
importScripts(
  '/scramjet/scramjet.codecs.js',
  '/scramjet/scramjet.config.js',
  '/scramjet/scramjet.shared.js',
  '/scramjet/scramjet.worker.js'
);

const uv = new UVServiceWorker();
const dynamic = new Dynamic();
const scramjet = new ScramjetServiceWorker();

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(location.origin + '/service/dynamic/')) {
    event.respondWith(dynamic.fetch(event));
    console.log("Tried to fetch Dynamic");
  }
  if (event.request.url.startsWith(location.origin + '/service/uv/')) {
    event.respondWith(uv.fetch(event));
    console.log("Tried to fetch UV");
  }
  if (event.request.url.startsWith(location.origin + '/service/aero/')) {
    event.respondWith(uv.fetch(event));
    console.log("Tried to fetch Aero");
  }
  if (event.request.url.startsWith(location.origin + '/service/scramjet/')) {
    event.respondWith(scramjet.fetch(event));
    console.log("Tried to fetch Scramjet");
  }
});