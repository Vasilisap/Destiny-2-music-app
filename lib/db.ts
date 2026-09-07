import "server-only";
import { DatabaseSync } from "node:sqlite";

export const db = new DatabaseSync("data/app.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS favorites (
    track_id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL
  )
`);
