import path from "node:path";

function readNumber(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: readNumber(process.env.PORT, 3001),
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  dbPath: process.env.DB_PATH ?? path.resolve(__dirname, "../../data/users.sqlite"),
  logLevel: process.env.LOG_LEVEL ?? "info",
  seedUserCount: readNumber(process.env.SEED_USER_COUNT, 2500),
} as const;

export type Env = typeof env;
