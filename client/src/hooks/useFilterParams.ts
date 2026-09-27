import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SORT_DIRECTIONS,
  SORT_FIELDS,
  type DirectoryFilters,
  type SortDirection,
  type SortField,
} from "../types";

function parseCsv(value: string | null): string[] {
  return value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function isSortField(value: string | null): value is SortField {
  return SORT_FIELDS.includes(value as SortField);
}

function isSortDirection(value: string | null): value is SortDirection {
  return SORT_DIRECTIONS.includes(value as SortDirection);
}

export function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<DirectoryFilters>(() => {
    const sortBy = searchParams.get("sortBy");
    const sortDir = searchParams.get("sortDir");

    return {
      query: searchParams.get("q") ?? "",
      hobbies: parseCsv(searchParams.get("hobbies")),
      nationalities: parseCsv(searchParams.get("nationalities")),
      sortBy: isSortField(sortBy) ? sortBy : "last_name",
      sortDir: isSortDirection(sortDir) ? sortDir : "asc",
    };
  }, [searchParams]);

  const replaceFilters = useCallback(
    (next: DirectoryFilters) => {
      const params = new URLSearchParams();
      if (next.query) params.set("q", next.query);
      if (next.hobbies.length) params.set("hobbies", next.hobbies.join(","));
      if (next.nationalities.length) params.set("nationalities", next.nationalities.join(","));
      if (next.sortBy !== "last_name") params.set("sortBy", next.sortBy);
      if (next.sortDir !== "asc") params.set("sortDir", next.sortDir);
      setSearchParams(params, { replace: true });
    },
    [setSearchParams],
  );

  const setQuery = useCallback(
    (query: string) => replaceFilters({ ...filters, query }),
    [filters, replaceFilters],
  );

  const toggleHobby = useCallback(
    (hobby: string) => {
      const hobbies = filters.hobbies.includes(hobby)
        ? filters.hobbies.filter((item) => item !== hobby)
        : [...filters.hobbies, hobby];
      replaceFilters({ ...filters, hobbies });
    },
    [filters, replaceFilters],
  );

  const toggleNationality = useCallback(
    (nationality: string) => {
      const nationalities = filters.nationalities.includes(nationality)
        ? filters.nationalities.filter((item) => item !== nationality)
        : [...filters.nationalities, nationality];
      replaceFilters({ ...filters, nationalities });
    },
    [filters, replaceFilters],
  );

  const setSort = useCallback(
    (sortBy: SortField, sortDir: SortDirection) => {
      replaceFilters({ ...filters, sortBy, sortDir });
    },
    [filters, replaceFilters],
  );

  const clearFilters = useCallback(() => {
    replaceFilters({
      query: filters.query,
      hobbies: [],
      nationalities: [],
      sortBy: filters.sortBy,
      sortDir: filters.sortDir,
    });
  }, [filters, replaceFilters]);

  return {
    filters,
    setQuery,
    toggleHobby,
    toggleNationality,
    setSort,
    clearFilters,
  };
}
