import { db } from "./db.js";

const RETENTION_MS = 72 * 60 * 60 * 1000;

export function sweepOldMessages() {
  const cutoff = Date.now() - RETENTION_MS;
  db.prepare("DELETE FROM messages WHERE created_at < ?").run(cutoff);
  db.prepare("DELETE FROM dm_messages WHERE created_at < ?").run(cutoff);
}
