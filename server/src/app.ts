import path from "node:path";
import express, { type Express } from "express";
import type { ILogger } from "./logging/logger";
import { errorHandler } from "./http/error-handler";
import { notFoundHandler } from "./http/not-found-handler";
import { requestContext } from "./http/request-context";
import { requestLogger } from "./http/request-logger";
import { createUserRoutes } from "./routes/user.routes";
import type { UserController } from "./controllers/user.controller";

interface CreateAppOptions {
  logger: ILogger;
  userController: UserController;
  clientOrigin: string;
  clientDistPath?: string;
}

export function createApp(options: CreateAppOptions): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json());
  app.use(requestContext);
  app.use(requestLogger(options.logger));
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", options.clientOrigin);
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Request-Id");
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
    next();
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/users", createUserRoutes(options.userController));

  if (options.clientDistPath) {
    app.use(express.static(options.clientDistPath));
    app.use((req, res, next) => {
      if (req.path.startsWith("/api")) {
        next();
        return;
      }

      res.sendFile(path.join(options.clientDistPath as string, "index.html"));
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler(options.logger));

  return app;
}
