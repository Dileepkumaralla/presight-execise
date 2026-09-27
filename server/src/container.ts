import path from "node:path";
import { env } from "./config/env";
import { createDatabase } from "./db/connection";
import { seedDatabase } from "./db/seed";
import { UserController } from "./controllers/user.controller";
import { createRootLogger, type ILogger, type LogLevel } from "./logging/logger";
import { DirectoryQueryBuilder } from "./repositories/sql/directory.query-builder";
import { SqliteUserRepository } from "./repositories/sqlite-user.repository";
import { UserService } from "./services/user.service";
import { createApp } from "./app";

export function bootstrap() {
  const logger = createRootLogger(env.logLevel as LogLevel);
  const db = createDatabase(env.dbPath, logger.child("db"));
  seedDatabase(db, env.seedUserCount, logger.child("seed"));

  const userRepository = new SqliteUserRepository(
    db,
    new DirectoryQueryBuilder(),
    logger.child("userRepository"),
  );
  const userService = new UserService(userRepository, logger.child("userService"));
  const userController = new UserController(userService);

  const clientDistPath =
    env.nodeEnv === "production"
      ? path.resolve(__dirname, "../../client/dist")
      : undefined;

  const app = createApp({
    logger,
    userController,
    clientOrigin: env.clientOrigin,
    clientDistPath,
  });

  return { app, db, logger };
}
