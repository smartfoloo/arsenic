import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
import { createYoutubeAdblockPlugin } from "./youtubeAdblock.js";

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
 * Ultraviolet still goes through bare-mux — both backends shared one
 * connection here until Scramjet moved to v2, which needs the transport
 * interface these packages moved to at 3.x/2.x (bare-mux only speaks the
 * 2.x/1.x-era one; see AGENTS.md). UV has no v2-equivalent to move to yet,
 * so it keeps the old packages and the shared bare-mux connection below;
 * Scramjet gets its own transport instances via scramjetTransport().
 */
const TRANSPORTS = {
  epoxy: ["Epoxy", "/epoxy/index.mjs", "Fine for pages, slow on large downloads."],
  libcurl: ["libcurl", "/libcurl/index.mjs", "Fine for pages, faster on large downloads."],
};

/**
 * Same two choices, but the v3/v2-era modules Scramjet's controller can use
 * directly. Built from a non-literal path (not a plain string in the import()
 * call) — these are server-served paths, not part of Vite's module graph, and
 * a literal specifier makes Vite try to resolve them at build time and fail.
 */
const SCRAMJET_TRANSPORT_PATHS = {
  epoxy: "/epoxy3/index.mjs",
  libcurl: "/libcurl2/index.mjs",
};
function loadScramjetTransport(name) {
  const path = SCRAMJET_TRANSPORT_PATHS[name];
  return import(/* @vite-ignore */ path);
}

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

// Set only in the static build (see vite.static.config.mjs). The "default"
// location is normally same-origin wisp — fine for the main app, but
// embed.svg runs on its own origin and the outer page (wherever
// arsenic.html ends up hosted) has no wisp of its own to fall back to, so
// wisp needs a fixed known-good domain instead of location.host. Empty here
// means the main app's normal same-origin behavior, unchanged.
const WISP_BASE = (import.meta.env.VITE_WISP_BASE_URL ?? "").replace(/\/$/, "");

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
  if (WISP_BASE) return `wss://${WISP_BASE}/wisp/`;

  const scheme = location.protocol === "https:" ? "wss" : "ws";
  return `${scheme}://${location.host}/wisp/`;
}

/** A fresh v3/v2-era transport instance, for Scramjet's controller. */
async function scramjetTransport() {
  const { default: Client } = await loadScramjetTransport(wanted);
  return new Client({ wisp: wispUrl() });
}

// Set once scramjet.ready() has constructed it; selectTransport/selectLocation
// hand it a fresh transport directly instead of going through bare-mux.
let scramjetController;
let scramjetApplied;
let scramjetManagedPlugin;

function transport() {
  // Serialized, because ready() and a settings change can both land here.
  pending = pending.then(async () => {
    const key = `${wanted}|${wantedLocation}`;

    if (applied !== key) {
      connection ??= new BareMuxConnection("/baremux/worker.js");
      await connection.setTransport(TRANSPORTS[wanted][1], [{ wisp: wispUrl() }]);
      applied = key;
    }

    if (scramjetController && scramjetApplied !== key) {
      scramjetController.setTransport(await scramjetTransport());
      scramjetApplied = key;
    }
  });

  return pending;
}

/**
 * Switch transports. bare-mux hands the new one to every service worker on its
 * next request, so open tabs move over without a reload; Scramjet's controller
 * gets a fresh transport instance the same way, via setTransport().
 */
export function selectTransport(name) {
  if (!TRANSPORTS[name] || name === wanted) return;

  wanted = name;
  if (connection || scramjetController) transport();
}

/** Switch exit location. Same live-handoff as selectTransport. */
export function selectLocation(name) {
  if (!(name in LOCATIONS) || name === wantedLocation) return;

  wantedLocation = name;
  if (connection || scramjetController) transport();
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
  const worker = registration.installing ?? registration.waiting ?? registration.active;
  if (worker && worker.state !== "activated") {
    await new Promise((resolve) => {
      worker.addEventListener("statechange", () => worker.state === "activated" && resolve());
    });
  }

  // navigator.serviceWorker.ready/.controller only resolve for a worker whose
  // scope covers *this* page — ours is scoped to the prefix, not "/", so
  // registration.active (a real, usable ServiceWorker reference either way)
  // is what Controller needs, not the page's own controller.
  return registration.active;
}

/**
 * Service workers can be evicted by the browser at any point, and the
 * controller's own routing table lives in that worker's memory — so a killed
 * worker forgets every open tab until each one re-registers. The library's
 * only built-in recovery is passive (the worker broadcasts on its own
 * restart); this polls instead, so a tab notices and re-registers within
 * about a second even if that broadcast doesn't arrive in time. Ported from
 * arctic-static's production heartbeat.
 */
function startHeartbeat(sw, controller) {
  const prefix = controller.prefix;
  let handling = false;

  const onMessage = (event) => {
    const info = event.data && event.data.$arsenic$controller;
    if (!info || info.prefix !== prefix || info.alive !== false || handling) return;

    handling = true;
    try {
      controller.setupMessagePort();
    } finally {
      setTimeout(() => (handling = false), 250);
    }
  };
  navigator.serviceWorker.addEventListener("message", onMessage);

  const ping = () => {
    try {
      sw.postMessage({ $arsenic$keepalive: { prefix } });
    } catch {
      // sw reference is gone (e.g. mid-restart); the next tick tries again
    }
  };
  setInterval(ping, 1000);
  ping();
}

const SCRAMJET_PREFIX = "/service/scramjet/";

const scramjet = {
  label: "Scramjet v2",
  description: "Quick on simple pages, can be slow on heavy ones.",
  prefix: SCRAMJET_PREFIX,
  ready: once(async () => {
    await script("/scram/scramjet.js");
    await script("/controller/controller.api.js");
    const { Controller, ManagedPlugin } = globalThis.$scramjetController;
    scramjetManagedPlugin = ManagedPlugin;

    const sw = await registerSW("/scramjet.sw.js", SCRAMJET_PREFIX);

    const key = `${wanted}|${wantedLocation}`;
    scramjetController = new Controller({
      serviceworker: sw,
      transport: await scramjetTransport(),
      config: {
        prefix: SCRAMJET_PREFIX,
        scramjetPath: "/scram/scramjet.js",
        injectPath: "/controller/controller.inject.js",
        wasmPath: "/scram/scramjet.wasm",
      },
      // Quieter console: scramjet's own instrumentation throws on plenty of
      // sites without it actually breaking anything (see AGENTS.md — this
      // matches arctic-static's own baseline config).
      scramjetConfig: { flags: { captureErrors: false } },
    });
    await scramjetController.wait();
    scramjetApplied = key;

    startHeartbeat(sw, scramjetController);
  }),
  attach: (iframe, options = {}) => {
    const plugins = options.youtubeAdblock ? [createYoutubeAdblockPlugin(scramjetManagedPlugin)] : [];
    const frame = scramjetController.createFrame(iframe, { plugins });
    // Each frame gets its own randomized sub-prefix under the controller's
    // (also randomized) one — unlike v1's single flat prefix, so decoding a
    // frame's URL needs that specific frame's context, not just a static
    // constant. Callers that need the real prefix/decode for a given tab
    // should prefer frame.prefix/frame.decode over backend.prefix/decode.
    frame.decode = (href) => globalThis.$scramjet.unrewriteUrl(href, frame.context);
    return frame;
  },
  go: (frame, url) => frame.go(url),
  reload: (frame) => frame.reload(),
  // No controller-level encode/decode: unlike v1's single flat prefix, every
  // v2 frame gets its own randomized sub-prefix, so rewriting a URL requires
  // a specific frame's context. Callers hold the frame already (it's what
  // attach() returned) — use frame.decode(href) directly, which Frame.svelte
  // and url.js's faviconFor both do, falling back to this only if no frame
  // exists yet.
  decode: (href) => href,
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
