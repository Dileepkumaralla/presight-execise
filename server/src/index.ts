import { env } from "./config/env";
import { closeDatabase } from "./db/connection";
import { bootstrap } from "./container";

const { app, db, logger } = bootstrap();

const server = app.listen(env.port, () => {
  logger.info("User directory API started", {
    port: env.port,
    env: env.nodeEnv,
    dbPath: env.dbPath,
  });
});

function shutdown(signal: string): void {
  logger.info("Shutting down", { signal });
  server.close(() => {
    closeDatabase(db, logger);
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (error) => {
  logger.error("Unhandled promise rejection", { error });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", { error });
  closeDatabase(db, logger);
  process.exit(1);
});
