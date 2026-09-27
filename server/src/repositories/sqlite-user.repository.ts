import type { SqliteDatabase } from "../db/connection";
import { DatabaseError } from "../errors/app.error";
import type { ILogger } from "../logging/logger";
import type {
  DirectoryFacets,
  DirectoryFilters,
  DirectoryQuery,
  FacetValue,
  PaginatedUsers,
} from "../models/user.model";
import { DirectoryQueryBuilder } from "./sql/directory.query-builder";
import { mapFacetRow, mapUserRow, type IUserRepository, type UserRow } from "./user.repository";

export class SqliteUserRepository implements IUserRepository {
  constructor(
    private readonly db: SqliteDatabase,
    private readonly queryBuilder: DirectoryQueryBuilder,
    private readonly logger: ILogger,
  ) {}

  findMany(query: DirectoryQuery): PaginatedUsers {
    try {
      const offset = (query.page - 1) * query.limit;
      const list = this.queryBuilder.buildListQuery(query, query.sortBy, query.sortDir);
      const count = this.queryBuilder.buildCountQuery(query);

      const rows = this.db.prepare(list.sql).all(...list.params, query.limit, offset) as unknown as UserRow[];
      const countRow = this.db.prepare(count.sql).get(...count.params) as unknown as {
        total: number | bigint;
      };
      const total = Number(countRow.total);

      return {
        users: rows.map(mapUserRow),
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          hasMore: offset + rows.length < total,
        },
      };
    } catch (error) {
      this.logger.error("Failed to query users", { error, query });
      throw new DatabaseError("Unable to load users for the current filters");
    }
  }

  findFacets(filters: DirectoryFilters): DirectoryFacets {
    try {
      const hobbyQuery = this.queryBuilder.buildHobbyFacetQuery(filters);
      const nationalityQuery = this.queryBuilder.buildNationalityFacetQuery(filters);

      const hobbies = this.db
        .prepare(hobbyQuery.sql)
        .all(...hobbyQuery.params) as unknown as FacetValue[];
      const nationalities = this.db
        .prepare(nationalityQuery.sql)
        .all(...nationalityQuery.params) as unknown as FacetValue[];

      return {
        hobbies: hobbies.map(mapFacetRow),
        nationalities: nationalities.map(mapFacetRow),
      };
    } catch (error) {
      this.logger.error("Failed to query directory facets", { error, filters });
      throw new DatabaseError("Unable to load filter counts for the current result set");
    }
  }
}
