import { SORT_FIELDS, type DirectoryFilters, type SortDirection, type SortField } from "../types";

const SORT_LABELS: Record<SortField, string> = {
  first_name: "First name",
  last_name: "Last name",
  age: "Age",
  nationality: "Nationality",
};

interface DirectoryToolbarProps {
  filters: DirectoryFilters;
  total: number;
  onQueryChange: (value: string) => void;
  onSortChange: (sortBy: SortField, sortDir: SortDirection) => void;
  onOpenFilters: () => void;
}

export function DirectoryToolbar({
  filters,
  total,
  onQueryChange,
  onSortChange,
  onOpenFilters,
}: DirectoryToolbarProps) {
  return (
    <header className="border-b border-line bg-card/90 px-4 py-4 backdrop-blur md:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-4xl">Find people</h1>
          <p className="mt-1 text-sm text-muted">
            {total.toLocaleString()} people in the current result set
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="directory-search">
            Search by first or last name
          </label>
          <input
            id="directory-search"
            value={filters.query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search first or last name"
            className="h-11 w-full rounded-full border border-line bg-paper px-4 text-sm outline-none ring-accent focus:ring-2 sm:w-72"
          />

          <div className="flex gap-2">
            <select
              aria-label="Sort field"
              value={filters.sortBy}
              onChange={(event) =>
                onSortChange(event.target.value as SortField, filters.sortDir)
              }
              className="h-11 rounded-full border border-line bg-paper px-3 text-sm"
            >
              {SORT_FIELDS.map((field) => (
                <option key={field} value={field}>
                  {SORT_LABELS[field]}
                </option>
              ))}
            </select>
            <select
              aria-label="Sort direction"
              value={filters.sortDir}
              onChange={(event) =>
                onSortChange(filters.sortBy, event.target.value as SortDirection)
              }
              className="h-11 rounded-full border border-line bg-paper px-3 text-sm"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <button
              type="button"
              onClick={onOpenFilters}
              className="h-11 rounded-full bg-accent px-4 text-sm font-semibold text-paper lg:hidden"
            >
              Filters
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
