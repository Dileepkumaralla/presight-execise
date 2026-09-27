import type { DirectoryPage, DirectoryQuery } from "../types";
import { getJson } from "./httpClient";

function toSearchParams(query: DirectoryQuery): string {
  const params = new URLSearchParams();
  if (query.query) params.set("q", query.query);
  if (query.hobbies.length) params.set("hobbies", query.hobbies.join(","));
  if (query.nationalities.length) params.set("nationalities", query.nationalities.join(","));
  params.set("sortBy", query.sortBy);
  params.set("sortDir", query.sortDir);
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));
  return params.toString();
}

export function fetchDirectory(
  query: DirectoryQuery,
  signal?: AbortSignal,
): Promise<DirectoryPage> {
  return getJson<DirectoryPage>(`/api/users?${toSearchParams(query)}`, signal);
}
