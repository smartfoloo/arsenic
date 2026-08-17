import { createServer } from "node:http";
import { hostname } from "node:os";
import { fileURLToPath } from "node:url";

import express from "express";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import { createBareServer } from "@tomphttp/bare-server-node";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";

const distPath = fileURLToPath(new URL("../dist/", import.meta.url));

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.argv[2] || process.env.PORT) || 8080;

logging.set_level(logging.NONE);

const app = express();
const server = createServer();
// Legacy bare v2. Only the Dynamic backend speaks it; Scramjet and Ultraviolet
// go through bare-mux over wisp instead.
const bare = createBareServer("/bare/");

app.use((req, res, next) => {
  // Cross-origin isolation, so Scramjet can use SharedArrayBuffer for sync XHR.
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// Timed by the start page's latency readout; no-store so a reverse proxy
// in front of us can't answer it from cache.
app.get("/ping", (req, res) => res.set("Cache-Control", "no-store").status(204).end());

app.use("/scram/", express.static(scramjetPath));
app.use("/uv/", express.static(uvPath));
app.use("/baremux/", express.static(baremuxPath));
app.use("/epoxy/", express.static(epoxyPath));

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

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) bare.routeRequest(req, res);
  else app(req, res);
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) bare.routeUpgrade(req, socket, head);
  else if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
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
    bare.close();
    process.exit(0);
  });
}

server.listen({ port });
