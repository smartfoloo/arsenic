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

import authRouter, { serveAvatar } from "./auth.js";
import { handleChatUpgrade } from "./chat.js";
import { createDecoyApp } from "./decoy.js";
import { sweepOldMessages } from "./retention.js";

const distPath = fileURLToPath(new URL("../dist/", import.meta.url));

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.argv[2] || process.env.PORT) || 5000;
// Off by default: any domain forwarded to this port gets a fake "learn to
// code" site instead of arsenic, with a hero-button login modal that
// redirects to the real app on the correct password. Wildcard by
// construction — it doesn't look at the Host header at all.
const decoyPort = process.env.ARSENIC_DECOY_PORT ? Number(process.env.ARSENIC_DECOY_PORT) : null;
if (decoyPort && !process.env.ARSENIC_DECOY_PASSWORD) {
  console.error("ARSENIC_DECOY_PASSWORD must be set when ARSENIC_DECOY_PORT is used");
  process.exit(1);
}
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

if (chatEnabled) {
  app.use("/chat/api", express.json({ limit: "1kb" }), authRouter);
  app.get("/chat/avatars/:uid", serveAvatar);
} else {
  app.use(["/chat/api", "/chat/avatars"], (req, res) => res.status(404).json({ error: "chat_disabled" }));
}

app.use("/scram/", express.static(scramjetPath));
app.use("/uv/", express.static(uvPath));
app.use("/baremux/", express.static(baremuxPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/libcurl/", express.static(libcurlPath));

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

if (decoyPort) {
  const decoyApp = createDecoyApp({
    password: process.env.ARSENIC_DECOY_PASSWORD,
    cookieName: process.env.ARSENIC_DECOY_COOKIE || "reader_session",
  });
  decoyApp.listen(decoyPort, () => console.log(`Decoy listening on http://localhost:${decoyPort}`));
}
