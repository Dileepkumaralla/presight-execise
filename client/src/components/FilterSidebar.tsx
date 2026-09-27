import type { DirectoryFacets, DirectoryFilters } from "../types";

interface FilterSidebarProps {
  filters: DirectoryFilters;
  facets: DirectoryFacets;
  onToggleHobby: (hobby: string) => void;
  onToggleNationality: (nationality: string) => void;
  onClear: () => void;
}

function mergeSelected(items: { value: string; count: number }[], selected: string[]) {
  const values = new Set(items.map((item) => item.value));
  return [
    ...items,
    ...selected
      .filter((value) => !values.has(value))
      .map((value) => ({ value, count: 0 })),
  ];
}

function FilterGroup({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: { value: string; count: number }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{title}</h3>
      <ul className="mt-3 space-y-1.5">
        {items.length === 0 ? (
          <li className="text-sm text-muted">No values in this result set</li>
        ) : (
          items.map((item) => {
            const isSelected = selected.includes(item.value);
            return (
              <li key={item.value}>
                <button
                  type="button"
                  onClick={() => onToggle(item.value)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                    isSelected
                      ? "bg-accent text-paper"
                      : "bg-card text-ink hover:bg-line"
                  }`}
                >
                  <span>{item.value}</span>
                  <span className={isSelected ? "text-paper/80" : "text-muted"}>{item.count}</span>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}

export function FilterSidebar({
  filters,
  facets,
  onToggleHobby,
  onToggleNationality,
  onClear,
}: FilterSidebarProps) {
  const hasActiveFilters = filters.hobbies.length + filters.nationalities.length > 0;
  const hobbies = mergeSelected(facets.hobbies, filters.hobbies);
  const nationalities = mergeSelected(facets.nationalities, filters.nationalities);

  return (
    <aside className="flex h-full flex-col gap-6 overflow-y-auto p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Current result set
          </p>
          <h2 className="font-display mt-1 text-2xl">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button type="button" onClick={onClear} className="text-sm font-semibold text-accent">
            Clear
          </button>
        )}
      </div>

      <FilterGroup
        title="Hobbies"
        items={hobbies}
        selected={filters.hobbies}
        onToggle={onToggleHobby}
      />
      <FilterGroup
        title="Nationalities"
        items={nationalities}
        selected={filters.nationalities}
        onToggle={onToggleNationality}
      />
    </aside>
  );
}
