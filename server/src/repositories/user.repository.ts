import type {
  DirectoryFacets,
  DirectoryFilters,
  DirectoryQuery,
  FacetValue,
  PaginatedUsers,
  User,
} from "../models/user.model";

export interface IUserRepository {
  findMany(query: DirectoryQuery): PaginatedUsers;
  findFacets(filters: DirectoryFilters): DirectoryFacets;
}

export interface UserRow {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string;
  hobbies: string | null;
}

export function mapUserRow(row: UserRow): User {
  return {
    id: Number(row.id),
    avatar: row.avatar,
    firstName: row.first_name,
    lastName: row.last_name,
    age: Number(row.age),
    nationality: row.nationality,
    hobbies: row.hobbies ? row.hobbies.split(",").filter(Boolean) : [],
  };
}

export function mapFacetRow(row: FacetValue): FacetValue {
  return {
    value: String(row.value),
    count: Number(row.count),
  };
}
