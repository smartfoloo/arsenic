import { WebSocketServer } from "ws";

import { isAdmin } from "./admin.js";
import {
  getAvatar,
  insertMessage,
  isChannelLocked,
  isUserBanned,
  olderMessages,
  recentMessages,
  timeoutUntil,
} from "./db.js";
import { getRoles } from "./roles.js";
import { readSession } from "./session.js";

export const MAX_BODY_LENGTH = 300;
const MESSAGE_COOLDOWN_MS = 1000;
const PAGE_SIZE = 50;

// In-memory only — a 1s spam cooldown doesn't need to survive a restart.
const lastMessageAt = new Map();

export function canSendMessage(userId) {
  const last = lastMessageAt.get(userId);
  return !last || Date.now() - last >= MESSAGE_COOLDOWN_MS;
}

export function recordMessageSent(userId) {
  lastMessageAt.set(userId, Date.now());
}

const wss = new WebSocketServer({ noServer: true });
const clients = new Set();
const clientsByUserId = new Map();

function avatarUrl(userId, avatarMime, updatedAt) {
  return avatarMime ? `/chat/avatars/${userId}?v=${updatedAt ?? 0}` : null;
}

function withAvatar(row) {
  return {
    ...row,
    avatarUrl: avatarUrl(row.userId, row.avatarMime, row.avatarUpdatedAt),
    isAdmin: isAdmin(row.username),
    pinned: !!row.pinned,
    imageUrl: row.imageMime ? `/chat/messages/${row.id}/image` : null,
    roles: getRoles(row.username),
  };
}

export function broadcast(payload) {
  const data = JSON.stringify(payload);
  for (const client of clients) {
    if (client.readyState === client.OPEN) client.send(data);
  }
}

export function sendToUser(userId, payload) {
  const sockets = clientsByUserId.get(userId);
  if (!sockets) return;

  const data = JSON.stringify(payload);
  for (const ws of sockets) {
    if (ws.readyState === ws.OPEN) ws.send(data);
  }
}

export function disconnectUser(userId) {
  const sockets = clientsByUserId.get(userId);
  if (!sockets) return;

  for (const ws of sockets) ws.close();
}

function trackClient(ws, userId) {
  clients.add(ws);
  if (!clientsByUserId.has(userId)) clientsByUserId.set(userId, new Set());
  clientsByUserId.get(userId).add(ws);
}

function untrackClient(ws, userId) {
  clients.delete(ws);
  const sockets = clientsByUserId.get(userId);
  if (!sockets) return;

  sockets.delete(ws);
  if (!sockets.size) clientsByUserId.delete(userId);
}

wss.on("connection", (ws, req, user) => {
  ws.user = user;
  trackClient(ws, user.uid);

  ws.on("message", (data) => {
    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch {
      return;
    }
    if (!parsed || typeof parsed.type !== "string") return;

    if (parsed.type === "message") {
      const channelId = Number(parsed.channelId);
      const body = typeof parsed.body === "string" ? parsed.body.trim() : "";
      if (!channelId || !body) return;

      if (body.length > MAX_BODY_LENGTH) {
        ws.send(JSON.stringify({ type: "error", context: "message", message: "too_long" }));
        return;
      }

      if (isChannelLocked(channelId) && !isAdmin(ws.user.username)) {
        ws.send(JSON.stringify({ type: "error", context: "message", message: "channel_locked" }));
        return;
      }

      const timedOutUntil = timeoutUntil(ws.user.uid);
      if (timedOutUntil) {
        ws.send(JSON.stringify({ type: "error", context: "message", message: "timed_out", until: timedOutUntil }));
        return;
      }

      if (!canSendMessage(ws.user.uid)) {
        ws.send(JSON.stringify({ type: "error", context: "message", message: "rate_limited" }));
        return;
      }

      const { id, createdAt } = insertMessage({ userId: ws.user.uid, channelId, body });
      recordMessageSent(ws.user.uid);
      const avatar = getAvatar(ws.user.uid);
      broadcast({
        type: "message",
        channelId,
        id,
        userId: ws.user.uid,
        username: ws.user.username,
        avatarUrl: avatarUrl(ws.user.uid, avatar?.mime, avatar?.updatedAt),
        isAdmin: isAdmin(ws.user.username),
        roles: getRoles(ws.user.username),
        body,
        createdAt,
      });
      return;
    }

    if (parsed.type === "history") {
      const channelId = Number(parsed.channelId);
      if (!channelId) return;

      ws.send(
        JSON.stringify({
          type: "history",
          channelId,
          messages: recentMessages(channelId).map(withAvatar),
        }),
      );
      return;
    }

    if (parsed.type === "olderMessages") {
      const channelId = Number(parsed.channelId);
      const beforeId = Number(parsed.beforeId);
      if (!channelId || !beforeId) return;

      const messages = olderMessages(channelId, beforeId).map(withAvatar);
      ws.send(
        JSON.stringify({ type: "olderMessages", channelId, messages, hasMore: messages.length === PAGE_SIZE }),
      );
      return;
    }

  });

  ws.on("close", () => untrackClient(ws, user.uid));
  ws.on("error", () => untrackClient(ws, user.uid));
});

export function handleChatUpgrade(req, socket, head) {
  const user = readSession(req.headers.cookie);
  if (!user || isUserBanned(user.uid)) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req, user);
  });
}
