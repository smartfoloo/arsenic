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
  channelImagePaths,
  clearChannel,
  createChannel,
  createUser,
  deleteChannel,
  deleteMessage,
  dmPartners,
  findUserByUsername,
  getAvatar,
  getMessageImage,
  getUserByUsername,
  insertMessage,
  isChannelLocked,
  listBannedUsers,
  listChannels,
  listUsers,
  lockChannel,
  messageChannelId,
  messageImagePath,
  moveChannel,
  pinMessage,
  renameChannel,
  unlockChannel,
  setAvatar,
  setBio,
  setMessageImage,
  unbanUser,
  unpinMessage,
} from "./db.js";
import { clearSessionCookie, readSession, setSessionCookie } from "./session.js";

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;
const CHANNEL_NAME_PATTERN = /^[a-z0-9-]{2,30}$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_BIO_LENGTH = 190;
const AVATAR_MIME_EXT = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
const avatarsDir = fileURLToPath(new URL("./data/avatars/", import.meta.url));
const messageImagesDir = fileURLToPath(new URL("./data/message-images/", import.meta.url));

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
  return avatar?.mime ? `/chat/avatars/${userId}?v=${avatar.updatedAt ?? 0}` : null;
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

const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
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

  res.json({ avatarUrl: avatarUrlFor(req.session.uid) });
});

router.post("/me/bio", requireAuth, (req, res) => {
  const { bio } = req.body ?? {};
  if (typeof bio !== "string" || bio.length > MAX_BIO_LENGTH) {
    return res.status(400).json({ error: "invalid_bio" });
  }

  const trimmed = bio.trim();
  setBio(req.session.uid, trimmed);
  res.json({ bio: trimmed });
});

router.get("/users/:username", requireAuth, (req, res) => {
  const target = getUserByUsername(req.params.username);
  if (!target) return res.status(404).json({ error: "user_not_found" });

  res.json({
    username: target.username,
    isAdmin: isAdmin(target.username),
    avatarUrl: avatarUrlFor(target.id),
    bio: target.bio ?? "",
    joinedAt: target.created_at,
    banned: isAdmin(req.session.username) ? !!target.banned_at : undefined,
  });
});

router.get("/channels", requireAuth, (req, res) => {
  res.json({ channels: listChannels() });
});

router.get("/members", requireAuth, (req, res) => {
  const members = listUsers().map((user) => ({
    username: user.username,
    avatarUrl: user.avatarMime ? `/chat/avatars/${user.id}?v=${user.avatarUpdatedAt ?? 0}` : null,
    isAdmin: isAdmin(user.username),
  }));
  res.json({ members });
});

router.get("/dms", requireAuth, (req, res) => {
  res.json({ partners: dmPartners(req.session.uid) });
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

function unlinkImages(paths) {
  for (const path of paths) {
    try {
      unlinkSync(path);
    } catch {
      // already gone; nothing to clean up
    }
  }
}

router.delete("/admin/channels/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (channelCount() <= 1) {
    return res.status(400).json({ error: "at_least_one_channel_required" });
  }

  unlinkImages(channelImagePaths(id));
  deleteChannel(id);
  broadcast({ type: "channelDeleted", id });
  res.json({});
});

router.post("/admin/channels/:id/clear", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  unlinkImages(channelImagePaths(id));
  clearChannel(id);
  broadcast({ type: "channelCleared", channelId: id });
  res.json({});
});

router.post("/admin/channels/:id/rename", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body ?? {};
  if (typeof name !== "string" || !CHANNEL_NAME_PATTERN.test(name)) {
    return res.status(400).json({ error: "invalid_channel_name" });
  }

  try {
    renameChannel(id, name);
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "channel_taken" });
    }
    throw err;
  }

  broadcast({ type: "channelRenamed", id, name });
  res.json({});
});

router.post("/admin/channels/:id/move", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const { direction } = req.body ?? {};
  if (direction !== "up" && direction !== "down") {
    return res.status(400).json({ error: "invalid_direction" });
  }

  moveChannel(id, direction);
  broadcast({ type: "channelsReordered", channels: listChannels() });
  res.json({});
});

router.post("/admin/channels/:id/lock", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const { locked } = req.body ?? {};
  if (typeof locked !== "boolean") return res.status(400).json({ error: "invalid_locked" });

  if (locked) lockChannel(id);
  else unlockChannel(id);
  broadcast({ type: "channelLocked", id, locked });
  res.json({});
});

// Open to any authenticated user, not just admins — still gated by the same
// channel-lock rule the WS text-message path uses (chat.js), since without
// it a user excluded from a locked channel could still post via images.
router.post("/channels/:id/image", requireAuth, uploadImage.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "invalid_image" });

  const channelId = Number(req.params.id);
  if (isChannelLocked(channelId) && !isAdmin(req.session.username)) {
    return res.status(403).json({ error: "channel_locked" });
  }

  const caption = typeof req.body?.body === "string" ? req.body.body.trim() : "";
  const ext = AVATAR_MIME_EXT[req.file.mimetype];

  const { id, createdAt } = insertMessage({ userId: req.session.uid, channelId, body: caption });
  const path = `${messageImagesDir}${id}.${ext}`;
  writeFileSync(path, req.file.buffer);
  setMessageImage(id, path, req.file.mimetype);

  const avatar = getAvatar(req.session.uid);
  broadcast({
    type: "message",
    channelId,
    id,
    userId: req.session.uid,
    username: req.session.username,
    avatarUrl: avatarUrlFor(req.session.uid),
    isAdmin: isAdmin(req.session.username),
    body: caption,
    createdAt,
    pinned: false,
    imageUrl: `/chat/messages/${id}/image`,
  });
  res.json({});
});

router.post("/admin/messages/:id/delete", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const channelId = messageChannelId(id);
  if (!channelId) return res.status(404).json({ error: "message_not_found" });

  const imagePath = messageImagePath(id);
  if (!deleteMessage(id)) return res.status(404).json({ error: "message_not_found" });
  if (imagePath) unlinkImages([imagePath]);

  broadcast({ type: "messageDeleted", id, channelId });
  res.json({});
});

router.post("/admin/messages/:id/pin", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const channelId = messageChannelId(id);
  if (!channelId) return res.status(404).json({ error: "message_not_found" });

  pinMessage(id);
  broadcast({ type: "messagePinned", id, channelId });
  res.json({});
});

router.post("/admin/messages/:id/unpin", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const channelId = messageChannelId(id);
  if (!channelId) return res.status(404).json({ error: "message_not_found" });

  unpinMessage(id);
  broadcast({ type: "messageUnpinned", id, channelId });
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

router.get("/admin/banned", requireAdmin, (req, res) => {
  res.json({ users: listBannedUsers() });
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

  // The URL carries a ?v= version bumped on every upload, so a given URL's
  // content never changes — safe to cache aggressively and publicly.
  res.setHeader("Content-Type", avatar.mime);
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.sendFile(avatar.path);
}

export function serveMessageImage(req, res) {
  const image = getMessageImage(Number(req.params.id));
  if (!image?.path) return res.status(404).end();

  // Message images are never replaced, only deleted — the URL's content
  // never changes, so it's safe to cache aggressively and publicly.
  res.setHeader("Content-Type", image.mime);
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.sendFile(image.path);
}

export default router;
