import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import Database from "better-sqlite3";

const dataDir = fileURLToPath(new URL("./data/", import.meta.url));
mkdirSync(dataDir, { recursive: true });
mkdirSync(`${dataDir}avatars`, { recursive: true });

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

// Every install needs at least one channel — seed "general" if none exist,
// and backfill any pre-channels messages (a v1 upgrade) into it.
let generalId = db.prepare("SELECT id FROM channels ORDER BY id LIMIT 1").get()?.id;
if (!generalId) {
  generalId = db
    .prepare("INSERT INTO channels (name, created_by, created_at) VALUES ('general', NULL, ?)")
    .run(Date.now()).lastInsertRowid;
}
db.prepare("UPDATE messages SET channel_id = ? WHERE channel_id IS NULL").run(generalId);

const getUserByUsernameStmt = db.prepare("SELECT * FROM users WHERE username = ? COLLATE NOCASE");
const createUserStmt = db.prepare(
  "INSERT INTO users (username, password_hash, created_at, accepted_legal_at) VALUES (?, ?, ?, ?)",
);
const insertMessageStmt = db.prepare(
  "INSERT INTO messages (user_id, channel_id, body, created_at) VALUES (?, ?, ?, ?)",
);
const recentMessagesStmt = db.prepare(`
  SELECT messages.id, messages.body, messages.created_at AS createdAt, messages.channel_id AS channelId,
         users.id AS userId, users.username, users.avatar_mime AS avatarMime,
         users.avatar_updated_at AS avatarUpdatedAt
  FROM messages
  JOIN users ON users.id = messages.user_id
  WHERE messages.channel_id = ? AND users.banned_at IS NULL
  ORDER BY messages.created_at DESC
  LIMIT ?
`);
const messageChannelIdStmt = db.prepare("SELECT channel_id AS channelId FROM messages WHERE id = ?");
const deleteMessageStmt = db.prepare("DELETE FROM messages WHERE id = ?");
const clearChannelStmt = db.prepare("DELETE FROM messages WHERE channel_id = ?");

const listChannelsStmt = db.prepare("SELECT id, name FROM channels ORDER BY id");
const createChannelStmt = db.prepare(
  "INSERT INTO channels (name, created_by, created_at) VALUES (?, ?, ?)",
);
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
  const { lastInsertRowid } = insertMessageStmt.run(userId, channelId, body, createdAt);
  return { id: lastInsertRowid, createdAt };
}

export function recentMessages(channelId, limit = 50) {
  return recentMessagesStmt.all(channelId, limit).reverse();
}

export function messageChannelId(id) {
  return messageChannelIdStmt.get(id)?.channelId ?? null;
}

export function deleteMessage(id) {
  return deleteMessageStmt.run(id).changes > 0;
}

export function clearChannel(channelId) {
  clearChannelStmt.run(channelId);
}

export function listChannels() {
  return listChannelsStmt.all();
}

export function createChannel(name, createdBy) {
  const { lastInsertRowid } = createChannelStmt.run(name, createdBy, Date.now());
  return { id: lastInsertRowid, name };
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

export function insertDm({ fromUserId, toUserId, body }) {
  const createdAt = Date.now();
  const { lastInsertRowid } = insertDmStmt.run(fromUserId, toUserId, body, createdAt);
  return { id: lastInsertRowid, createdAt };
}

export function dmHistory(uidA, uidB, limit = 50) {
  return dmHistoryStmt.all(uidA, uidB, uidB, uidA, limit).reverse();
}
