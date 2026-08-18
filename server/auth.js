import { unlinkSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import argon2 from "argon2";
import { Router } from "express";
import multer from "multer";

import { isAdmin } from "./admin.js";
import { broadcast, disconnectUser } from "./chat.js";
import {
  banUser,
  channelCount,
  clearChannel,
  createChannel,
  createUser,
  deleteChannel,
  deleteMessage,
  findUserByUsername,
  getAvatar,
  getUserByUsername,
  listChannels,
  messageChannelId,
  setAvatar,
  unbanUser,
} from "./db.js";
import { clearSessionCookie, readSession, setSessionCookie } from "./session.js";

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;
const CHANNEL_NAME_PATTERN = /^[a-z0-9-]{2,30}$/;
const MIN_PASSWORD_LENGTH = 8;
const AVATAR_MIME_EXT = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
const avatarsDir = fileURLToPath(new URL("./data/avatars/", import.meta.url));

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 10;
const loginAttempts = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX_ATTEMPTS;
}

function avatarUrlFor(userId) {
  const avatar = getAvatar(userId);
  return avatar?.mime ? `/chat/avatars/${userId}` : null;
}

function requireAuth(req, res, next) {
  const session = readSession(req.headers.cookie);
  if (!session) return res.status(401).json({ error: "not_authenticated" });

  req.session = session;
  next();
}

function requireAdmin(req, res, next) {
  const session = readSession(req.headers.cookie);
  if (!session) return res.status(401).json({ error: "not_authenticated" });
  if (!isAdmin(session.username)) return res.status(403).json({ error: "not_admin" });

  req.session = session;
  next();
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, file.mimetype in AVATAR_MIME_EXT),
});

const router = Router();

router.post("/signup", async (req, res) => {
  const { username, password, agreedToLegal } = req.body ?? {};

  if (typeof username !== "string" || !USERNAME_PATTERN.test(username)) {
    return res.status(400).json({ error: "invalid_username" });
  }
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ error: "invalid_password" });
  }
  if (agreedToLegal !== true) {
    return res.status(400).json({ error: "must_agree_to_legal" });
  }

  const passwordHash = await argon2.hash(password);

  let user;
  try {
    user = createUser({ username, passwordHash });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "username_taken" });
    }
    throw err;
  }

  setSessionCookie(res, { uid: user.id, username: user.username });
  res.json({ username: user.username });
});

router.post("/login", async (req, res) => {
  const ip = req.ip;
  if (rateLimited(ip)) {
    return res.status(429).json({ error: "rate_limited" });
  }

  const { username, password } = req.body ?? {};
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "invalid_input" });
  }

  const user = getUserByUsername(username);
  const valid = user && (await argon2.verify(user.password_hash, password));
  if (!valid) {
    return res.status(401).json({ error: "invalid_credentials" });
  }
  if (user.banned_at) {
    return res.status(403).json({ error: "banned" });
  }

  setSessionCookie(res, { uid: user.id, username: user.username });
  res.json({ username: user.username });
});

router.post("/logout", (req, res) => {
  clearSessionCookie(res);
  res.json({});
});

router.get("/me", (req, res) => {
  const session = readSession(req.headers.cookie);
  if (!session) return res.json({ username: null });

  res.json({
    username: session.username,
    isAdmin: isAdmin(session.username),
    avatarUrl: avatarUrlFor(session.uid),
  });
});

router.post("/avatar", requireAuth, upload.single("avatar"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "invalid_image" });

  const ext = AVATAR_MIME_EXT[req.file.mimetype];
  const previous = getAvatar(req.session.uid);
  if (previous?.path) {
    try {
      unlinkSync(previous.path);
    } catch {
      // already gone; nothing to clean up
    }
  }

  const path = `${avatarsDir}${req.session.uid}.${ext}`;
  writeFileSync(path, req.file.buffer);
  setAvatar(req.session.uid, path, req.file.mimetype);

  res.json({ avatarUrl: `/chat/avatars/${req.session.uid}` });
});

router.get("/channels", requireAuth, (req, res) => {
  res.json({ channels: listChannels() });
});

router.post("/admin/channels", requireAdmin, (req, res) => {
  const { name } = req.body ?? {};
  if (typeof name !== "string" || !CHANNEL_NAME_PATTERN.test(name)) {
    return res.status(400).json({ error: "invalid_channel_name" });
  }

  let channel;
  try {
    channel = createChannel(name, req.session.uid);
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "channel_taken" });
    }
    throw err;
  }

  broadcast({ type: "channelCreated", channel });
  res.json({ channel });
});

router.delete("/admin/channels/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (channelCount() <= 1) {
    return res.status(400).json({ error: "at_least_one_channel_required" });
  }

  deleteChannel(id);
  broadcast({ type: "channelDeleted", id });
  res.json({});
});

router.post("/admin/channels/:id/clear", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  clearChannel(id);
  broadcast({ type: "channelCleared", channelId: id });
  res.json({});
});

router.post("/admin/messages/:id/delete", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const channelId = messageChannelId(id);
  if (!channelId || !deleteMessage(id)) {
    return res.status(404).json({ error: "message_not_found" });
  }

  broadcast({ type: "messageDeleted", id, channelId });
  res.json({});
});

router.post("/admin/ban", requireAdmin, (req, res) => {
  const { username } = req.body ?? {};
  const target = typeof username === "string" ? findUserByUsername(username) : null;
  if (!target) return res.status(404).json({ error: "user_not_found" });
  if (target.username.toLowerCase() === req.session.username.toLowerCase()) {
    return res.status(400).json({ error: "cannot_ban_self" });
  }
  if (isAdmin(target.username)) {
    return res.status(400).json({ error: "cannot_ban_admin" });
  }

  banUser(target.id);
  disconnectUser(target.id);
  broadcast({ type: "userBanned", username: target.username });
  res.json({});
});

router.post("/admin/unban", requireAdmin, (req, res) => {
  const { username } = req.body ?? {};
  const target = typeof username === "string" ? findUserByUsername(username) : null;
  if (!target) return res.status(404).json({ error: "user_not_found" });

  unbanUser(target.id);
  broadcast({ type: "userUnbanned", username: target.username });
  res.json({});
});

export function serveAvatar(req, res) {
  const avatar = getAvatar(Number(req.params.uid));
  if (!avatar?.path) return res.status(404).end();

  res.setHeader("Content-Type", avatar.mime);
  res.setHeader("Cache-Control", "private, max-age=300");
  res.sendFile(avatar.path);
}

export default router;
