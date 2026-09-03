import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
import { createYoutubeAdblockPlugin } from "./youtubeAdblock.js";
import { siteAsset as asset } from "./siteAsset.js";

const SW_ALLOWED_HOSTNAMES = ["localhost", "127.0.0.1"];

// Set only by the Caddy-VPS embed split (see AGENTS.md's "Deployment (VPS +
// Caddy)"). Ultraviolet's bare-mux SharedWorker (registerSW("/uv.sw.js", ...)
// below, and the "/baremux/worker.js" it opens) is only ever served by this
// app's own server, same-origin — there's no equivalent on the embed's
// origin, so resolving it from there 404s or fails an import. Frame.svelte
// already never calls backend.ready() for either backend under EMBED_BASE
// (it posts to embed.svg instead), so this is normally unreachable; this is
// a hard backstop, not the fix itself.
const EMBED_BASE = (import.meta.env.VITE_EMBED_BASE_URL ?? "").replace(/\/$/, "");

// Set only by tools/build-static.mjs's single-svg build (see AGENTS.md's
// static-version section). That build ships Scramjet's vendored files as
// plain sibling files next to arsenic.svg, but not Ultraviolet's (uv/,
// baremux/, uv.sw.js, uv.config.js) — so UV has to stay off there too, same
// reasoning as EMBED_BASE above, just for a build with no separate origin.
const STATIC_BUILD = import.meta.env.VITE_STATIC_BUILD === "true";

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
  epoxy: asset("epoxy3/index.mjs"),
  libcurl: asset("libcurl2/index.mjs"),
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

// The transport instance the Scramjet controller is currently using. Kept
// so keepWarm() can exercise the wisp connection directly — see there for
// why a plain fetch() from this page can't.
let scramjetLive;

/** A fresh v3/v2-era transport instance, for Scramjet's controller. */
async function scramjetTransport() {
  const { default: Client } = await loadScramjetTransport(wanted);
  scramjetLive = new Client({ wisp: wispUrl() });
  return scramjetLive;
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

const WARM_MS = 20_000;
// Something cheap, reliably up, and served by a host that isn't the one
// being browsed, so a warm request never perturbs a real page's session.
const WARM_URL = "https://www.gstatic.com/generate_204";

/**
 * Keep the wisp connection itself warm, not just the service worker.
 * startHeartbeat above only proves the worker still holds the routing
 * table; the transport underneath it can still have gone idle and had its
 * WebSocket dropped by an intermediary, so the next real navigation pays a
 * fresh handshake.
 *
 * Ported in spirit from mizumath.com, which does this as a proxied
 * fetch() from its own page every 20s. That exact form can't work here:
 * our worker is scoped to the proxy prefix rather than "/", so this
 * document isn't service-worker-controlled and its fetches never reach the
 * proxy (see AGENTS.md). Scramjet v2's controller owns its transport
 * directly in the page, though, so the transport can just be driven itself.
 */
function startWarmup() {
  const warm = async () => {
    if (document.hidden || !scramjetLive) return;

    try {
      if (!scramjetLive.ready) await scramjetLive.init();
      const response = await scramjetLive.request(new URL(WARM_URL), "GET", null, [], undefined);
      // A ReadableStream body left undrained holds the stream open.
      await response?.body?.cancel?.();
    } catch {
      // Offline, or the transport is mid-swap; the next tick tries again.
    }
  };

  setInterval(warm, WARM_MS);
}

const SCRAMJET_PREFIX = asset("service/scramjet/");

const scramjet = {
  label: "Scramjet v2",
  description: "Quick on simple pages, can be slow on heavy ones.",
  prefix: SCRAMJET_PREFIX,
  ready: once(async () => {
    await script(asset("scram/scramjet.js"));
    await script(asset("controller/controller.api.js"));
    const { Controller, ManagedPlugin } = globalThis.$scramjetController;
    scramjetManagedPlugin = ManagedPlugin;

    const sw = await registerSW(asset("scramjet.sw.js"), SCRAMJET_PREFIX);

    const key = `${wanted}|${wantedLocation}`;
    scramjetController = new Controller({
      serviceworker: sw,
      transport: await scramjetTransport(),
      config: {
        prefix: SCRAMJET_PREFIX,
        scramjetPath: asset("scram/scramjet.js"),
        injectPath: asset("controller/controller.inject.js"),
        wasmPath: asset("scram/scramjet.wasm"),
      },
      // Quieter console: scramjet's own instrumentation throws on plenty of
      // sites without it actually breaking anything (see AGENTS.md — this
      // matches arctic-static's own baseline config).
      scramjetConfig: { flags: { captureErrors: false } },
    });
    await scramjetController.wait();
    scramjetApplied = key;

    startHeartbeat(sw, scramjetController);
    startWarmup();
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
    if (EMBED_BASE || STATIC_BUILD) {
      throw new Error("Ultraviolet isn't available in the static build — see AGENTS.md.");
    }
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

// Ultraviolet is excluded from the picker in the static build (Settings would
// otherwise let someone select a backend whose ready() only ever throws).
export const BACKEND_OPTIONS = Object.entries(backends)
  .filter(([value]) => !((EMBED_BASE || STATIC_BUILD) && value === "ultraviolet"))
  .map(([value, { label, description }]) => [
    value,
    label,
    description,
]);

export const TRANSPORT_OPTIONS = Object.entries(TRANSPORTS).map(
  ([value, [label, , description]]) => [value, label, description],
);

/**
 * Start the selected backend before anything asks it to navigate.
 *
 * Without this the first click pays the whole cold start serially — fetch
 * the rewriter, fetch the controller, register and activate the service
 * worker, fetch and decode the wasm, build the transport, open wisp — and
 * only then does the target site get its first request. Every proxy we
 * compared against boots on the start page instead of on first navigation.
 *
 * ready() is wrapped in once(), so calling this on every hover and focus
 * costs nothing after the first. Errors are swallowed: this is speculative
 * work, and a real navigation will surface the same failure properly.
 */
export function prewarm(name) {
  backends[name]?.ready().catch(() => {});
}

/**
 * Tell the browser to start fetching the Scramjet runtime while the shell
 * is still painting, so prewarm() above finds them in cache instead of
 * chaining three requests. Low priority so they don't compete with the
 * app's own assets.
 *
 * Injected rather than written into index.html because the static build
 * ships to arbitrarily nested paths, where a literal "/scram/..." would
 * resolve against the CDN root; siteAsset() handles both.
 */
export function preloadRuntime(name) {
  // Scramjet-only: these are ~300 KB that an Ultraviolet user would never
  // touch. UV's own bundle is small enough not to be worth a hint.
  if (name !== "scramjet") return;

  const assets = [
    ["scram/scramjet.js", "script"],
    ["controller/controller.api.js", "script"],
    ["scram/scramjet.wasm", "fetch"],
  ];

  for (const [path, as] of assets) {
    const link = document.createElement("link");
    Object.assign(link, { rel: "preload", as, href: asset(path), fetchPriority: "low" });
    // An as="fetch" preload has to declare a credentials mode or it won't
    // match the controller's own fetch() of the wasm, and the file gets
    // pulled twice. "anonymous" is same-origin credentials, which is what
    // that fetch uses.
    if (as === "fetch") link.crossOrigin = "anonymous";
    document.head.append(link);
  }
}
