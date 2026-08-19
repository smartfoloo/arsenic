import { unlinkSync } from "node:fs";

import { RETENTION_CHANNEL_THRESHOLD, RETENTION_MS } from "./constants.js";
import { db } from "./db.js";

const dueMessagesStmt = db.prepare(
  "SELECT id, channel_id AS channelId, image_path AS imagePath FROM messages WHERE pinned = 0 AND expires_at < ?",
);
const newerCountStmt = db.prepare("SELECT COUNT(*) AS n FROM messages WHERE channel_id = ? AND id > ?");
const deleteMessageStmt = db.prepare("DELETE FROM messages WHERE id = ?");
const extendExpiryStmt = db.prepare("UPDATE messages SET expires_at = expires_at + ? WHERE id = ?");
const deleteOldDmsStmt = db.prepare("DELETE FROM dm_messages WHERE created_at < ?");

export function sweepOldMessages() {
  const now = Date.now();

  for (const row of dueMessagesStmt.all(now)) {
    const { n: newerCount } = newerCountStmt.get(row.channelId, row.id);
    if (newerCount > RETENTION_CHANNEL_THRESHOLD) {
      deleteMessageStmt.run(row.id);
      if (row.imagePath) {
        try {
          unlinkSync(row.imagePath);
        } catch {
          // already gone; nothing to clean up
        }
      }
    } else {
      extendExpiryStmt.run(RETENTION_MS, row.id);
    }
  }

  deleteOldDmsStmt.run(now - RETENTION_MS);
}
