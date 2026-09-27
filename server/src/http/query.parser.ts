import { ValidationError } from "../errors/app.error";
import type { DirectoryQuery, SortDirection, SortField } from "../models/user.model";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asCsv(value: unknown): string[] {
  return asString(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function asInteger(value: unknown, fallback: number, field: string): number {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    throw new ValidationError(`${field} must be an integer`, { [field]: value });
  }

  return parsed;
}

export function parseDirectoryQuery(query: Record<string, unknown>): DirectoryQuery {
  return {
    query: asString(query.q),
    nationalities: asCsv(query.nationalities),
    hobbies: asCsv(query.hobbies),
    sortBy: (asString(query.sortBy) || "last_name") as SortField,
    sortDir: (asString(query.sortDir) || "asc") as SortDirection,
    page: asInteger(query.page, 1, "page"),
    limit: asInteger(query.limit, 20, "limit"),
  };
}
