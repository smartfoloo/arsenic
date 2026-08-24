import "./env.js";

import { createServer } from "node:http";
import { hostname } from "node:os";
import { fileURLToPath } from "node:url";

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

app.use((req, res, next) => {
  // Cross-origin isolation, so Scramjet can use SharedArrayBuffer for sync XHR.
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
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

app.use("/scram/", express.static(scramjetPath));
app.use("/uv/", express.static(uvPath));
app.use("/baremux/", express.static(baremuxPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/libcurl/", express.static(libcurlPath));

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
