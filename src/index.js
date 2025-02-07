const { createBareServer } = require("@tomphttp/bare-server-node");
const express = require("express");
const { createServer } = require("node:http");
const { uvPath } = require("@titaniumnetwork-dev/ultraviolet");
const { hostname } = require("node:os");
const { join } = require("path");
const wisp = require("wisp-server-node");
const { baremuxPath } = require('@mercuryworkshop/bare-mux/node');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const bare = createBareServer("/bare/");
const app = express();

app.use(express.static("./public"));
app.use("/uv/", express.static(uvPath));
app.use('/baremux/', express.static(baremuxPath));
app.get('/server-info', async (req, res) => {
  try {
    const ipResponse = await fetch('https://checkip.amazonaws.com/');
    const ip = (await ipResponse.text()).trim();

    const geoResponse = await fetch(`https://ipinfo.io/${ip}/json?token=YOUR_IPINFO_TOKEN`);
    const geoData = await geoResponse.json();

    if (!geoData.ip) throw new Error("Invalid API response");

    res.json({
      ip: geoData.ip,
      city: geoData.city || "Unknown",
      region: geoData.region || "Unknown",
      country: geoData.country || "Unknown"
    });
  } catch (error) {
    console.error("Error fetching server info:", error);
    res.status(500).json({ error: 'Failed to fetch server details' });
  }
});


const server = createServer();

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else if (req.url.endsWith('/wisp/')) {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.end();
  }
});

let port = parseInt(process.env.PORT, 10);
if (isNaN(port)) port = 8080;

server.on("listening", () => {
  const address = server.address();
  console.log("Listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${hostname()}:${address.port}`);
  console.log(`\thttp://${address.family === "IPv6" ? `[${address.address}]` : address.address}:${address.port}`);
});

// Graceful shutdown
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close();
  bare.close();
  process.exit(0);
}

server.listen({ port });
