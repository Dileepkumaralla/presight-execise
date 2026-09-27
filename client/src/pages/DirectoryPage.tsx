import { useMemo, useState } from "react";
import { DirectoryToolbar } from "../components/DirectoryToolbar";
import { FilterSidebar } from "../components/FilterSidebar";
import { UserList } from "../components/UserList";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useDirectory } from "../hooks/useDirectory";
import { useFilterParams } from "../hooks/useFilterParams";

export function DirectoryPage() {
  const { filters, setQuery, toggleHobby, toggleNationality, setSort, clearFilters } =
    useFilterParams();
  const debouncedQuery = useDebouncedValue(filters.query, 300);
  const requestFilters = useMemo(
    () => ({ ...filters, query: debouncedQuery }),
    [debouncedQuery, filters],
  );
  const directory = useDirectory(requestFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const sidebar = (
    <FilterSidebar
      filters={filters}
      facets={directory.facets}
      onToggleHobby={toggleHobby}
      onToggleNationality={toggleNationality}
      onClear={clearFilters}
    />
  );

  return (
    <div className="flex h-dvh overflow-hidden">
      <aside className="hidden w-[320px] shrink-0 border-r border-line bg-card lg:block">
        {sidebar}
      </aside>

      {filtersOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-20 bg-black/60"
            onClick={() => setFiltersOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-30 w-[320px] border-r border-line bg-card shadow-2xl">
            <FilterSidebar
              filters={filters}
              facets={directory.facets}
              onToggleHobby={toggleHobby}
              onToggleNationality={toggleNationality}
              onClear={clearFilters}
            />
          </aside>
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <DirectoryToolbar
          filters={filters}
          total={directory.total}
          onQueryChange={setQuery}
          onSortChange={setSort}
          onOpenFilters={() => setFiltersOpen(true)}
        />
        <main className="min-h-0 flex-1">
          <UserList
            users={directory.users}
            isInitialLoading={directory.isInitialLoading}
            isLoadingMore={directory.isLoadingMore}
            hasMore={directory.hasMore}
            error={directory.error}
            onLoadMore={directory.loadMore}
            onRetry={directory.retry}
            onClearFilters={clearFilters}
          />
        </main>
      </div>
    </div>
  );
}
