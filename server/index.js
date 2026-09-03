import "./env.js";

import { createRequire } from "node:module";
import { createServer } from "node:http";
import { dirname } from "node:path";
import { hostname } from "node:os";
import { fileURLToPath } from "node:url";

import compression from "compression";
import express from "express";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";

import { aiEnabled, handleAiChat, handleAiStatus } from "./ai.js";
import authRouter, { serveAvatar, serveMessageImage } from "./auth.js";
import { handleChatUpgrade } from "./chat.js";
import { renderDecoyPage } from "./decoy.js";
import { evaluateDomain } from "./domainGate.js";
import { sweepOldMessages } from "./retention.js";

const distPath = fileURLToPath(new URL("../dist/", import.meta.url));

// None of these three ship a "./path"-style export (scramjet-controller has
// none at all; the v3/v2-era transport packages only expose one in a CJS
// subpath their "exports" map doesn't wire up), so resolve their package
// root from the main entry point instead, same trick as the "./path"
// exports do internally.
const require = createRequire(import.meta.url);
const distDirOf = (pkg) => dirname(require.resolve(pkg));
const scramjetControllerPath = distDirOf("@mercuryworkshop/scramjet-controller");
const epoxy3Path = distDirOf("@mercuryworkshop/epoxy-transport-3");
const libcurl2Path = distDirOf("@mercuryworkshop/libcurl-transport-2");

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.argv[2] || process.env.PORT) || 5000;
// Off by default: with this set, "/" serves a fake "learn to code" site
// instead of arsenic, with a "Sign in to continue" popup that opens on
// load. Clicking Continue pulls the real app in over the same document
// (see decoy.js) rather than via redirect, so the URL never changes and
// nothing persists across a reload — every reload lands back on the decoy.
const decoyEnabled = process.env.ARSENIC_DECOY_ENABLED === "true";
// Off by default: an open-source clone only gets a working chatroom when its
// own operator deliberately opts in, not just by having the code.
const chatEnabled = process.env.ARSENIC_CHAT_ENABLED === "true";

logging.set_level(logging.NONE);

const app = express();
const server = createServer();

// Trust the reverse proxy's X-Forwarded-For in production, so req.ip (used
// for login rate limiting) reflects the real client rather than the proxy.
if (!dev) app.set("trust proxy", 1);

// Vendored proxy runtime is ~800 KB of JS and wasm uncompressed and is on
// the critical path of the first navigation; gzip takes it to roughly a
// third. Express serves it directly, so this can't be left to whatever
// reverse proxy happens to be in front. SSE is excluded because the
// middleware would buffer /ai/chat's stream into one chunk at the end.
app.use(
  compression({
    filter: (req, res) =>
      String(res.getHeader("Content-Type") ?? "").includes("text/event-stream")
        ? false
        : compression.filter(req, res),
  }),
);

app.use((req, res, next) => {
  // Cross-origin isolation, so Scramjet can use SharedArrayBuffer for sync XHR.
  // "credentialless" rather than "require-corp": it still sets
  // crossOriginIsolated, but instead of demanding a CORP header on every
  // cross-origin subresource it just loads them without credentials. Same
  // guarantee for Scramjet, without the rule that anything the shell itself
  // loads has to be same-origin. Matches nocturne.lol's deployment.
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
  next();
});

// Timed by the start page's latency readout; no-store so a reverse proxy
// in front of us can't answer it from cache.
app.get("/ping", (req, res) => res.set("Cache-Control", "no-store").status(204).end());

// Caddy's on_demand_tls "ask" check (see Caddyfile) — hit for every never-
// before-seen hostname before Caddy spends a Let's Encrypt issuance on it.
// Self-serve custom domains stay self-serve; this only turns away hostnames
// matching the phishing-style abuse pattern (chained brand names on
// wildcard-DNS-for-hire providers) and rate-limits bursts of brand-new
// domains. See domainGate.js for the actual rules.
app.get("/internal/tls-ask", (req, res) => {
  const { allow, reason } = evaluateDomain(req.query.domain);
  if (!allow) console.warn(`[tls-ask] denied ${req.query.domain}: ${reason}`);
  res.status(allow ? 200 : 403).end();
});

if (chatEnabled) {
  app.use("/chat/api", express.json({ limit: "1kb" }), authRouter);
  app.get("/chat/avatars/:uid", serveAvatar);
  app.get("/chat/messages/:id/image", serveMessageImage);
} else {
  app.use(["/chat/api", "/chat/avatars", "/chat/messages"], (req, res) =>
    res.status(404).json({ error: "chat_disabled" }),
  );
}

// No login gate (unlike chat) — the sidebar hides the icon entirely when
// this is off, so /ai/status just needs to exist unconditionally for it to
// find out. The chat route only exists when enabled.
app.get("/ai/status", handleAiStatus);
if (aiEnabled) {
  app.post("/ai/chat", express.json({ limit: "64kb" }), handleAiChat);
}

// Every path below is pinned to an exact version in package.json, so its
// bytes can never change without a redeploy under a fresh node_modules —
// serving them immutable turns a conditional request per file per page load
// into nothing at all. Deliberately not applied to the service worker
// wrappers in public/ (scramjet.sw.js, uv.sw.js): the browser's SW update
// algorithm byte-diffs the registered script, so those must stay
// revalidated or a worker fix can never ship.
const vendored = (path) => express.static(path, { maxAge: "1y", immutable: true });

app.use("/scram/", vendored(scramjetPath));
app.use("/controller/", vendored(scramjetControllerPath));
app.use("/uv/", vendored(uvPath));
app.use("/baremux/", vendored(baremuxPath));
// Ultraviolet still goes through bare-mux, which only speaks these
// packages' 2.x/1.x-era transport interface (see AGENTS.md); Scramjet's
// controller needs the interface these packages moved to at 3.x/2.x, which
// bare-mux can't carry. Two major versions of the same package, so they're
// installed under aliases and served at separate paths.
app.use("/epoxy/", vendored(epoxyPath));
app.use("/libcurl/", vendored(libcurlPath));
app.use("/epoxy3/", vendored(epoxy3Path));
app.use("/libcurl2/", vendored(libcurl2Path));

// Decoy is a production-only, opt-in concern; dev keeps serving the real
// app at "/" via Vite regardless of this env var.
if (decoyEnabled && !dev) {
  app.get("/", (req, res) => res.type("html").send(renderDecoyPage()));
  app.get("/__app", (req, res) => res.sendFile(`${distPath}index.html`));
}

if (dev) {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    appType: "spa",
    server: { middlewareMode: true, hmr: { server } },
  });
  app.use(vite.middlewares);
} else {
  // Vite content-hashes everything under assets/, so those are immutable
  // too. Mounted first so the general handler below never sees them — it
  // has to stay uncached for index.html and the service worker wrappers.
  app.use("/assets/", express.static(`${distPath}assets/`, { maxAge: "1y", immutable: true }));
  app.use(express.static(distPath));
  app.use((req, res) => res.sendFile(`${distPath}index.html`));
}

server.on("request", app);

server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
  else if (req.url === "/chat/ws") {
    if (chatEnabled) handleChatUpgrade(req, socket, head);
    else socket.end();
  }
  // In dev anything else is Vite's HMR socket, handled by its own listener.
  else if (!dev) socket.end();
});

server.on("listening", () => {
  const { port, address, family } = server.address();
  console.log("Listening on:");
  console.log(`\thttp://localhost:${port}`);
  console.log(`\thttp://${hostname()}:${port}`);
  console.log(`\thttp://${family === "IPv6" ? `[${address}]` : address}:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close();
    process.exit(0);
  });
}

sweepOldMessages();
setInterval(sweepOldMessages, 30 * 60 * 1000);

server.listen({ port });
