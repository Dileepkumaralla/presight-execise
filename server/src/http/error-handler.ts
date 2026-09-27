import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error";
import type { ILogger } from "../logging/logger";

export function errorHandler(logger: ILogger) {
  return (error: unknown, req: Request, res: Response, _next: NextFunction): void => {
    const appError =
      error instanceof AppError
        ? error
        : new AppError("An unexpected error occurred", 500, "INTERNAL_ERROR");

    const isUnexpected = !(error instanceof AppError);

    logger.error(appError.message, {
      requestId: req.requestId,
      code: appError.code,
      statusCode: appError.statusCode,
      details: appError.details,
      path: req.originalUrl,
      method: req.method,
      error: isUnexpected ? error : undefined,
    });

    res.status(appError.statusCode).json({
      error: {
        code: appError.code,
        message: appError.message,
        details: appError.details,
        requestId: req.requestId,
      },
    });
  };
}
