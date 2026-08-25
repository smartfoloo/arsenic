import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

const SW_ALLOWED_HOSTNAMES = ["localhost", "127.0.0.1"];

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

/**
 * Both backends share one bare-mux connection over our wisp server. Which TLS
 * client sits on the far end of it is the user's choice; the two differ in
 * speed and in which sites they trip over, not in what they can address.
 */
const TRANSPORTS = {
  epoxy: ["Epoxy", "/epoxy/index.mjs", "Fine for pages, slow on large downloads."],
  libcurl: ["libcurl", "/libcurl/index.mjs", "Fine for pages, faster on large downloads."],
};

/**
 * Where proxied traffic exits to the internet from. "default" is same-origin
 * (whatever domain served this page), which always works and needs no
 * dedicated infrastructure. Other entries are fixed endpoints that trade that
 * guarantee for a specific exit region — if one goes down or gets blocked,
 * selectLocation falls back to "default" rather than breaking the app.
 */
const LOCATIONS = {
  default: null,
  // TODO: set once a Japan-hosted domain has been picked for this.
  japan: "wss://charityschools.a2zrealty.biz/wisp/",
};

export const LOCATION_OPTIONS = [
  ["default", "Philadelphia, PA", "", "fi-us"],
  ["japan", "Tokyo, Japan", "", "fi-jp"],
];

let connection;
let wanted = "epoxy";
let wantedLocation = "default";
let applied;
let pending = Promise.resolve();

// Exported for Frame.svelte's static-build path (see EMBED_BASE there),
// which needs it to build the ?wisp= query param for embed.svg — that
// document runs on a separate origin and can't reach this module's private
// connection state directly.
export function wispUrl() {
  const fixed = LOCATIONS[wantedLocation];
  if (fixed) return fixed;

  const scheme = location.protocol === "https:" ? "wss" : "ws";
  return `${scheme}://${location.host}/wisp/`;
}

function transport() {
  // Serialized, because ready() and a settings change can both land here.
  pending = pending.then(async () => {
    connection ??= new BareMuxConnection("/baremux/worker.js");
    const key = `${wanted}|${wantedLocation}`;
    if (applied === key) return;

    await connection.setTransport(TRANSPORTS[wanted][1], [{ wisp: wispUrl() }]);
    applied = key;
  });

  return pending;
}

/**
 * Switch transports. bare-mux hands the new one to every service worker on its
 * next request, so open tabs move over without a reload.
 */
export function selectTransport(name) {
  if (!TRANSPORTS[name] || name === wanted) return;

  wanted = name;
  if (connection) transport();
}

/** Switch exit location. Same live-handoff as selectTransport. */
export function selectLocation(name) {
  if (!(name in LOCATIONS) || name === wantedLocation) return;

  wantedLocation = name;
  if (connection) transport();
}

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
  description: "Quick on simple pages, can be slow on heavy ones.",
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

const UV_PREFIX = "/service/uv/";

/** Ultraviolet's xor codec. */
const codec = once(async () => {
  await script("/uv/uv.bundle.js");
  await script("/uv.config.js");
});

const ultraviolet = {
  label: "Ultraviolet",
  description: "Slower to start, better on heavy pages.",
  prefix: UV_PREFIX,
  ready: once(async () => {
    await codec();
    await registerSW("/uv.sw.js", UV_PREFIX);
    await transport();
  }),
  attach: (iframe) => iframe,
  go: (iframe, url) => (iframe.src = UV_PREFIX + __uv$config.encodeUrl(url)),
  reload: (iframe) => iframe.contentWindow?.location.reload(),
  encode: (url) => UV_PREFIX + __uv$config.encodeUrl(url),
  decode: (href) => __uv$config.decodeUrl(href.slice((location.origin + UV_PREFIX).length)),
};

export const backends = { scramjet, ultraviolet };

export const BACKEND_OPTIONS = Object.entries(backends).map(([value, { label, description }]) => [
  value,
  label,
  description,
]);

export const TRANSPORT_OPTIONS = Object.entries(TRANSPORTS).map(
  ([value, [label, , description]]) => [value, label, description],
);
