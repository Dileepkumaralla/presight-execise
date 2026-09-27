export const SORT_FIELDS = ["first_name", "last_name", "age", "nationality"] as const;
export const SORT_DIRECTIONS = ["asc", "desc"] as const;

export type SortField = (typeof SORT_FIELDS)[number];
export type SortDirection = (typeof SORT_DIRECTIONS)[number];

export interface User {
  id: number;
  avatar: string;
  firstName: string;
  lastName: string;
  age: number;
  nationality: string;
  hobbies: string[];
}

export interface FacetValue {
  value: string;
  count: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface DirectoryFacets {
  hobbies: FacetValue[];
  nationalities: FacetValue[];
}

export interface DirectoryPage {
  data: User[];
  pagination: PaginationMeta;
  facets: DirectoryFacets;
}

export interface DirectoryFilters {
  query: string;
  hobbies: string[];
  nationalities: string[];
  sortBy: SortField;
  sortDir: SortDirection;
}

export interface DirectoryQuery extends DirectoryFilters {
  page: number;
  limit: number;
}
