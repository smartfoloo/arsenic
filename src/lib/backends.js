import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

const SW_ALLOWED_HOSTNAMES = ["localhost", "127.0.0.1"];
const EPOXY = "/epoxy/index.mjs";

/** Run an async setup step at most once, no matter how often it's asked for. */
function once(fn) {
  let promise;

  return () => (promise ??= fn());
}

const scripts = {};
function script(src) {
  scripts[src] ??= new Promise((resolve, reject) => {
    const el = document.createElement("script");
    Object.assign(el, { src, onload: resolve, onerror: reject });
    document.head.append(el);
  });

  return scripts[src];
}

/** Scramjet and Ultraviolet share one bare-mux transport over our wisp server. */
const transport = once(async () => {
  const scheme = location.protocol === "https:" ? "wss" : "ws";
  const connection = new BareMuxConnection("/baremux/worker.js");
  await connection.setTransport(EPOXY, [{ wisp: `${scheme}://${location.host}/wisp/` }]);
});

async function registerSW(path, scope) {
  if (!navigator.serviceWorker) {
    throw new Error(
      location.protocol === "https:" || SW_ALLOWED_HOSTNAMES.includes(location.hostname)
        ? "This browser doesn't support service workers."
        : "Service workers can't be registered without https.",
    );
  }

  const registration = await navigator.serviceWorker.register(path, { scope });
  const worker = registration.installing ?? registration.waiting;
  if (!worker || worker.state === "activated") return;

  // The first proxied request would miss a worker that's still installing.
  await new Promise((resolve) => {
    worker.addEventListener("statechange", () => worker.state === "activated" && resolve());
  });
}

const SCRAMJET_PREFIX = "/service/scramjet/";
let controller;

const scramjet = {
  label: "Scramjet",
  prefix: SCRAMJET_PREFIX,
  ready: once(async () => {
    await script("/scram/scramjet.all.js");
    const { ScramjetController } = $scramjetLoadController();
    controller = new ScramjetController({
      prefix: SCRAMJET_PREFIX,
      files: {
        wasm: "/scram/scramjet.wasm.wasm",
        all: "/scram/scramjet.all.js",
        sync: "/scram/scramjet.sync.js",
      },
    });
    // Hands the service worker its config through IndexedDB.
    await controller.init();
    await registerSW("/scramjet.sw.js", SCRAMJET_PREFIX);
    await transport();
  }),
  attach: (iframe) => controller.createFrame(iframe),
  go: (frame, url) => frame.go(url),
  reload: (frame) => frame.reload(),
  encode: (url) => controller.encodeUrl(url),
  decode: (href) => controller.decodeUrl(href),
};

/** Ultraviolet's xor codec, which Dynamic also happens to use. */
const codec = once(async () => {
  await script("/uv/uv.bundle.js");
  await script("/uv.config.js");
});

function xorBackend({ label, prefix, sw, wisp }) {
  return {
    label,
    prefix,
    ready: once(async () => {
      await codec();
      await registerSW(sw, prefix);
      if (wisp) await transport();
    }),
    attach: (iframe) => iframe,
    go: (iframe, url) => (iframe.src = prefix + __uv$config.encodeUrl(url)),
    reload: (iframe) => iframe.contentWindow?.location.reload(),
    encode: (url) => prefix + __uv$config.encodeUrl(url),
    decode: (href) => __uv$config.decodeUrl(href.slice((location.origin + prefix).length)),
  };
}

export const backends = {
  scramjet,
  ultraviolet: xorBackend({
    label: "Ultraviolet",
    prefix: "/service/uv/",
    sw: "/uv.sw.js",
    wisp: true,
  }),
  // Dynamic predates bare-mux and talks to the legacy bare server instead.
  dynamic: xorBackend({
    label: "Dynamic",
    prefix: "/service/dynamic/",
    sw: "/dynamic.sw.js",
  }),
};

export const BACKEND_OPTIONS = Object.entries(backends).map(([value, { label }]) => [value, label]);
