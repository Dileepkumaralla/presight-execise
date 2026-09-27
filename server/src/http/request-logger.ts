import type { NextFunction, Request, Response } from "express";
import type { ILogger } from "../logging/logger";

export function requestLogger(logger: ILogger) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startedAt = Date.now();

    res.on("finish", () => {
      logger.info("HTTP request completed", {
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - startedAt,
      });
    });

    next();
  };
}
