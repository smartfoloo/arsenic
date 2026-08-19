import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import Database from "better-sqlite3";

import { RETENTION_MS } from "./constants.js";

const dataDir = fileURLToPath(new URL("./data/", import.meta.url));
mkdirSync(dataDir, { recursive: true });
mkdirSync(`${dataDir}avatars`, { recursive: true });
mkdirSync(`${dataDir}message-images`, { recursive: true });

export const db = new Database(`${dataDir}chat.db`);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    accepted_legal_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS channels (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE COLLATE NOCASE,
    created_by INTEGER REFERENCES users(id),
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    body TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS dm_messages (
    id INTEGER PRIMARY KEY,
    from_user_id INTEGER NOT NULL REFERENCES users(id),
    to_user_id INTEGER NOT NULL REFERENCES users(id),
    body TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS messages_created_at ON messages(created_at);
  CREATE INDEX IF NOT EXISTS dm_messages_created_at ON dm_messages(created_at);
`);

// Migration-safe boot init: add columns that a v1 install won't have yet.
// No migrations table — just idempotent checks against the live schema.
function columnNames(table) {
  return new Set(db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name));
}

const userColumns = columnNames("users");
if (!userColumns.has("avatar_path")) db.exec("ALTER TABLE users ADD COLUMN avatar_path TEXT");
if (!userColumns.has("avatar_mime")) db.exec("ALTER TABLE users ADD COLUMN avatar_mime TEXT");
if (!userColumns.has("avatar_updated_at")) db.exec("ALTER TABLE users ADD COLUMN avatar_updated_at INTEGER");
if (!userColumns.has("banned_at")) db.exec("ALTER TABLE users ADD COLUMN banned_at INTEGER");

const messageColumns = columnNames("messages");
if (!messageColumns.has("channel_id")) {
  db.exec("ALTER TABLE messages ADD COLUMN channel_id INTEGER REFERENCES channels(id)");
}
if (!messageColumns.has("pinned")) db.exec("ALTER TABLE messages ADD COLUMN pinned INTEGER NOT NULL DEFAULT 0");
if (!messageColumns.has("expires_at")) db.exec("ALTER TABLE messages ADD COLUMN expires_at INTEGER");
if (!messageColumns.has("image_path")) db.exec("ALTER TABLE messages ADD COLUMN image_path TEXT");
if (!messageColumns.has("image_mime")) db.exec("ALTER TABLE messages ADD COLUMN image_mime TEXT");
db.exec("CREATE INDEX IF NOT EXISTS messages_channel_id ON messages(channel_id, id)");
db.prepare("UPDATE messages SET expires_at = created_at + ? WHERE expires_at IS NULL").run(RETENTION_MS);

const channelColumns = columnNames("channels");
if (!channelColumns.has("position")) db.exec("ALTER TABLE channels ADD COLUMN position INTEGER");
db.exec("UPDATE channels SET position = id WHERE position IS NULL");

// Every install needs at least one channel — seed "general" if none exist,
// and backfill any pre-channels messages (a v1 upgrade) into it.
let generalId = db.prepare("SELECT id FROM channels ORDER BY id LIMIT 1").get()?.id;
if (!generalId) {
  generalId = db
    .prepare("INSERT INTO channels (name, created_by, created_at, position) VALUES ('general', NULL, ?, 1)")
    .run(Date.now()).lastInsertRowid;
}
db.prepare("UPDATE messages SET channel_id = ? WHERE channel_id IS NULL").run(generalId);

const getUserByUsernameStmt = db.prepare("SELECT * FROM users WHERE username = ? COLLATE NOCASE");
const createUserStmt = db.prepare(
  "INSERT INTO users (username, password_hash, created_at, accepted_legal_at) VALUES (?, ?, ?, ?)",
);
const insertMessageStmt = db.prepare(
  "INSERT INTO messages (user_id, channel_id, body, created_at, expires_at) VALUES (?, ?, ?, ?, ?)",
);
const MESSAGE_SELECT = `
  SELECT messages.id, messages.body, messages.created_at AS createdAt, messages.channel_id AS channelId,
         messages.pinned AS pinned, messages.image_mime AS imageMime,
         users.id AS userId, users.username, users.avatar_mime AS avatarMime,
         users.avatar_updated_at AS avatarUpdatedAt
  FROM messages
  JOIN users ON users.id = messages.user_id
`;
const recentMessagesStmt = db.prepare(`
  ${MESSAGE_SELECT}
  WHERE messages.channel_id = ? AND users.banned_at IS NULL
  ORDER BY messages.created_at DESC
  LIMIT ?
`);
const olderMessagesStmt = db.prepare(`
  ${MESSAGE_SELECT}
  WHERE messages.channel_id = ? AND messages.id < ? AND users.banned_at IS NULL
  ORDER BY messages.created_at DESC
  LIMIT ?
`);
const messageChannelIdStmt = db.prepare("SELECT channel_id AS channelId FROM messages WHERE id = ?");
const messageImagePathStmt = db.prepare("SELECT image_path AS path FROM messages WHERE id = ?");
const getMessageImageStmt = db.prepare("SELECT image_path AS path, image_mime AS mime FROM messages WHERE id = ?");
const channelImagePathsStmt = db.prepare(
  "SELECT image_path AS path FROM messages WHERE channel_id = ? AND image_path IS NOT NULL",
);
const deleteMessageStmt = db.prepare("DELETE FROM messages WHERE id = ?");
const clearChannelStmt = db.prepare("DELETE FROM messages WHERE channel_id = ?");
const pinMessageStmt = db.prepare("UPDATE messages SET pinned = 1 WHERE id = ?");
const unpinMessageStmt = db.prepare("UPDATE messages SET pinned = 0 WHERE id = ?");
const setMessageImageStmt = db.prepare("UPDATE messages SET image_path = ?, image_mime = ? WHERE id = ?");

const listChannelsStmt = db.prepare("SELECT id, name FROM channels ORDER BY position, id");
const listChannelsForReorderStmt = db.prepare("SELECT id, position FROM channels ORDER BY position, id");
const updateChannelPositionStmt = db.prepare("UPDATE channels SET position = ? WHERE id = ?");
const createChannelStmt = db.prepare(`
  INSERT INTO channels (name, created_by, created_at, position)
  VALUES (?, ?, ?, (SELECT COALESCE(MAX(position), 0) + 1 FROM channels))
`);
const renameChannelStmt = db.prepare("UPDATE channels SET name = ? WHERE id = ?");
const deleteChannelStmt = db.prepare("DELETE FROM channels WHERE id = ?");
const countChannelsStmt = db.prepare("SELECT COUNT(*) AS n FROM channels");

const banUserStmt = db.prepare("UPDATE users SET banned_at = ? WHERE id = ?");
const unbanUserStmt = db.prepare("UPDATE users SET banned_at = NULL WHERE id = ?");
const setAvatarStmt = db.prepare(
  "UPDATE users SET avatar_path = ?, avatar_mime = ?, avatar_updated_at = ? WHERE id = ?",
);
const getAvatarStmt = db.prepare(
  "SELECT avatar_path AS path, avatar_mime AS mime, avatar_updated_at AS updatedAt FROM users WHERE id = ?",
);
const isBannedStmt = db.prepare("SELECT banned_at FROM users WHERE id = ?");
const listBannedStmt = db.prepare("SELECT username FROM users WHERE banned_at IS NOT NULL ORDER BY banned_at DESC");

const insertDmStmt = db.prepare(
  "INSERT INTO dm_messages (from_user_id, to_user_id, body, created_at) VALUES (?, ?, ?, ?)",
);
const dmHistoryStmt = db.prepare(`
  SELECT dm_messages.id, dm_messages.body, dm_messages.created_at AS createdAt,
         dm_messages.from_user_id AS fromUserId, dm_messages.to_user_id AS toUserId,
         fromUser.username AS fromUsername, toUser.username AS toUsername,
         fromUser.avatar_mime AS fromAvatarMime, fromUser.avatar_updated_at AS fromAvatarUpdatedAt
  FROM dm_messages
  JOIN users AS fromUser ON fromUser.id = dm_messages.from_user_id
  JOIN users AS toUser ON toUser.id = dm_messages.to_user_id
  WHERE ((dm_messages.from_user_id = ? AND dm_messages.to_user_id = ?)
      OR (dm_messages.from_user_id = ? AND dm_messages.to_user_id = ?))
    AND fromUser.banned_at IS NULL AND toUser.banned_at IS NULL
  ORDER BY dm_messages.created_at DESC
  LIMIT ?
`);
const olderDmHistoryStmt = db.prepare(`
  SELECT dm_messages.id, dm_messages.body, dm_messages.created_at AS createdAt,
         dm_messages.from_user_id AS fromUserId, dm_messages.to_user_id AS toUserId,
         fromUser.username AS fromUsername, toUser.username AS toUsername,
         fromUser.avatar_mime AS fromAvatarMime, fromUser.avatar_updated_at AS fromAvatarUpdatedAt
  FROM dm_messages
  JOIN users AS fromUser ON fromUser.id = dm_messages.from_user_id
  JOIN users AS toUser ON toUser.id = dm_messages.to_user_id
  WHERE ((dm_messages.from_user_id = ? AND dm_messages.to_user_id = ?)
      OR (dm_messages.from_user_id = ? AND dm_messages.to_user_id = ?))
    AND dm_messages.id < ?
    AND fromUser.banned_at IS NULL AND toUser.banned_at IS NULL
  ORDER BY dm_messages.created_at DESC
  LIMIT ?
`);
const dmPartnersStmt = db.prepare(`
  SELECT DISTINCT users.username
  FROM dm_messages
  JOIN users ON users.id = CASE
    WHEN dm_messages.from_user_id = @uid THEN dm_messages.to_user_id
    ELSE dm_messages.from_user_id
  END
  WHERE (dm_messages.from_user_id = @uid OR dm_messages.to_user_id = @uid)
    AND users.banned_at IS NULL
`);

export function getUserByUsername(username) {
  return getUserByUsernameStmt.get(username);
}

export function findUserByUsername(username) {
  return getUserByUsernameStmt.get(username);
}

export function createUser({ username, passwordHash }) {
  const now = Date.now();
  const { lastInsertRowid } = createUserStmt.run(username, passwordHash, now, now);
  return { id: lastInsertRowid, username };
}

export function insertMessage({ userId, channelId, body }) {
  const createdAt = Date.now();
  const expiresAt = createdAt + RETENTION_MS;
  const { lastInsertRowid } = insertMessageStmt.run(userId, channelId, body, createdAt, expiresAt);
  return { id: lastInsertRowid, createdAt };
}

export function recentMessages(channelId, limit = 50) {
  return recentMessagesStmt.all(channelId, limit).reverse();
}

export function olderMessages(channelId, beforeId, limit = 50) {
  return olderMessagesStmt.all(channelId, beforeId, limit).reverse();
}

export function messageChannelId(id) {
  return messageChannelIdStmt.get(id)?.channelId ?? null;
}

export function messageImagePath(id) {
  return messageImagePathStmt.get(id)?.path ?? null;
}

export function getMessageImage(id) {
  return getMessageImageStmt.get(id);
}

export function channelImagePaths(channelId) {
  return channelImagePathsStmt.all(channelId).map((row) => row.path);
}

export function deleteMessage(id) {
  return deleteMessageStmt.run(id).changes > 0;
}

export function clearChannel(channelId) {
  clearChannelStmt.run(channelId);
}

export function pinMessage(id) {
  pinMessageStmt.run(id);
}

export function unpinMessage(id) {
  unpinMessageStmt.run(id);
}

export function setMessageImage(id, path, mime) {
  setMessageImageStmt.run(path, mime, id);
}

export function listChannels() {
  return listChannelsStmt.all();
}

export function createChannel(name, createdBy) {
  const { lastInsertRowid } = createChannelStmt.run(name, createdBy, Date.now());
  return { id: lastInsertRowid, name };
}

export function renameChannel(id, name) {
  renameChannelStmt.run(name, id);
}

export function moveChannel(id, direction) {
  const rows = listChannelsForReorderStmt.all();
  const idx = rows.findIndex((row) => row.id === id);
  if (idx === -1) return false;

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= rows.length) return false;

  const a = rows[idx];
  const b = rows[swapIdx];
  updateChannelPositionStmt.run(b.position, a.id);
  updateChannelPositionStmt.run(a.position, b.id);
  return true;
}

export function deleteChannel(id) {
  clearChannelStmt.run(id);
  deleteChannelStmt.run(id);
}

export function channelCount() {
  return countChannelsStmt.get().n;
}

export function banUser(userId) {
  banUserStmt.run(Date.now(), userId);
}

export function unbanUser(userId) {
  unbanUserStmt.run(userId);
}

export function setAvatar(userId, path, mime) {
  setAvatarStmt.run(path, mime, Date.now(), userId);
}

export function getAvatar(userId) {
  return getAvatarStmt.get(userId);
}

export function isUserBanned(userId) {
  return !!isBannedStmt.get(userId)?.banned_at;
}

export function listBannedUsers() {
  return listBannedStmt.all().map((row) => row.username);
}

export function insertDm({ fromUserId, toUserId, body }) {
  const createdAt = Date.now();
  const { lastInsertRowid } = insertDmStmt.run(fromUserId, toUserId, body, createdAt);
  return { id: lastInsertRowid, createdAt };
}

export function dmHistory(uidA, uidB, limit = 50) {
  return dmHistoryStmt.all(uidA, uidB, uidB, uidA, limit).reverse();
}

export function olderDmHistory(uidA, uidB, beforeId, limit = 50) {
  return olderDmHistoryStmt.all(uidA, uidB, uidB, uidA, beforeId, limit).reverse();
}

export function dmPartners(userId) {
  return dmPartnersStmt.all({ uid: userId }).map((row) => row.username);
}
