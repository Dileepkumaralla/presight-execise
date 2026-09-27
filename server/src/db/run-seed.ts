import { env } from "../config/env";
import { createDatabase, closeDatabase } from "./connection";
import { seedDatabase } from "./seed";
import { createRootLogger } from "../logging/logger";

const logger = createRootLogger();
const db = createDatabase(env.dbPath, logger.child("db"));

try {
  seedDatabase(db, env.seedUserCount, logger.child("seed"));
} finally {
  closeDatabase(db, logger);
}
