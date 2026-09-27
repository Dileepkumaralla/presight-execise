export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogMeta {
  [key: string]: unknown;
}

export interface ILogger {
  debug(message: string, meta?: LogMeta): void;
  info(message: string, meta?: LogMeta): void;
  warn(message: string, meta?: LogMeta): void;
  error(message: string, meta?: LogMeta): void;
  child(context: string): ILogger;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function serializeError(error: unknown): LogMeta | undefined {
  if (!(error instanceof Error)) {
    return undefined;
  }

  return {
    errorName: error.name,
    errorMessage: error.message,
    stack: error.stack,
  };
}

export class Logger implements ILogger {
  constructor(
    private readonly context: string,
    private readonly minLevel: LogLevel = "info",
  ) {}

  child(context: string): ILogger {
    return new Logger(`${this.context}.${context}`, this.minLevel);
  }

  debug(message: string, meta?: LogMeta): void {
    this.write("debug", message, meta);
  }

  info(message: string, meta?: LogMeta): void {
    this.write("info", message, meta);
  }

  warn(message: string, meta?: LogMeta): void {
    this.write("warn", message, meta);
  }

  error(message: string, meta?: LogMeta): void {
    this.write("error", message, meta);
  }

  private write(level: LogLevel, message: string, meta: LogMeta = {}): void {
    if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[this.minLevel]) {
      return;
    }

    const { error, ...rest } = meta;
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      ...serializeError(error),
      ...rest,
    };

    const serialized = JSON.stringify(entry);
    if (level === "error") {
      console.error(serialized);
      return;
    }

    console.log(serialized);
  }
}

export function createRootLogger(minLevel: LogLevel = "info"): ILogger {
  return new Logger("app", minLevel);
}
