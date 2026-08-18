import { WebSocketServer } from "ws";

import { insertMessage, recentMessages } from "./db.js";
import { readSession } from "./session.js";

const MAX_BODY_LENGTH = 1000;

const wss = new WebSocketServer({ noServer: true });
const clients = new Set();

wss.on("connection", (ws, req, user) => {
  clients.add(ws);
  ws.user = user;

  ws.send(JSON.stringify({ type: "history", messages: recentMessages() }));

  ws.on("message", (data) => {
    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch {
      return;
    }
    if (parsed?.type !== "message" || typeof parsed.body !== "string") return;

    const body = parsed.body.trim();
    if (!body || body.length > MAX_BODY_LENGTH) return;

    const { id, createdAt } = insertMessage({ userId: ws.user.uid, body });
    const broadcast = JSON.stringify({
      type: "message",
      id,
      username: ws.user.username,
      body,
      createdAt,
    });
    for (const client of clients) {
      if (client.readyState === client.OPEN) client.send(broadcast);
    }
  });

  ws.on("close", () => clients.delete(ws));
  ws.on("error", () => clients.delete(ws));
});

export function handleChatUpgrade(req, socket, head) {
  const user = readSession(req.headers.cookie);
  if (!user) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req, user);
  });
}
