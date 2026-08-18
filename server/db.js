import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import Database from "better-sqlite3";

const dataDir = fileURLToPath(new URL("./data/", import.meta.url));
mkdirSync(dataDir, { recursive: true });

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

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    body TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS messages_created_at ON messages(created_at);
`);

const getUserByUsernameStmt = db.prepare("SELECT * FROM users WHERE username = ? COLLATE NOCASE");
const createUserStmt = db.prepare(
  "INSERT INTO users (username, password_hash, created_at, accepted_legal_at) VALUES (?, ?, ?, ?)",
);
const insertMessageStmt = db.prepare(
  "INSERT INTO messages (user_id, body, created_at) VALUES (?, ?, ?)",
);
const recentMessagesStmt = db.prepare(`
  SELECT messages.id, messages.body, messages.created_at AS createdAt, users.username
  FROM messages
  JOIN users ON users.id = messages.user_id
  ORDER BY messages.created_at DESC
  LIMIT ?
`);

export function getUserByUsername(username) {
  return getUserByUsernameStmt.get(username);
}

export function createUser({ username, passwordHash }) {
  const now = Date.now();
  const { lastInsertRowid } = createUserStmt.run(username, passwordHash, now, now);
  return { id: lastInsertRowid, username };
}

export function insertMessage({ userId, body }) {
  const createdAt = Date.now();
  const { lastInsertRowid } = insertMessageStmt.run(userId, body, createdAt);
  return { id: lastInsertRowid, createdAt };
}

export function recentMessages(limit = 50) {
  return recentMessagesStmt.all(limit).reverse();
}
