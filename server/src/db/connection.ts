import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { ILogger } from "../logging/logger";
import { DatabaseError } from "../errors/app.error";
import { SCHEMA_SQL } from "./schema";

export type SqliteDatabase = DatabaseSync;

export function createDatabase(dbPath: string, logger: ILogger): SqliteDatabase {
  try {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    const db = new DatabaseSync(dbPath);
    db.exec(SCHEMA_SQL);
    logger.info("SQLite connection ready", { dbPath });
    return db;
  } catch (error) {
    logger.error("Failed to initialize SQLite", { error, dbPath });
    throw new DatabaseError("Unable to initialize the user directory database");
  }
}

export function closeDatabase(db: SqliteDatabase, logger: ILogger): void {
  try {
    db.close();
    logger.info("SQLite connection closed");
  } catch (error) {
    logger.error("Failed to close SQLite connection", { error });
  }
}
