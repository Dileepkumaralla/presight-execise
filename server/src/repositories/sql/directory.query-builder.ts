import type { SQLInputValue } from "node:sqlite";
import type { DirectoryFilters, SortDirection, SortField } from "../../models/user.model";

export interface SqlFragment {
  sql: string;
  params: SQLInputValue[];
}

const SORT_COLUMN: Record<SortField, string> = {
  first_name: "u.first_name",
  last_name: "u.last_name",
  age: "u.age",
  nationality: "u.nationality",
};

export class DirectoryQueryBuilder {
  buildFilteredUsersCte(filters: DirectoryFilters): SqlFragment {
    const conditions: string[] = [];
    const params: SQLInputValue[] = [];

    const query = filters.query.trim();
    if (query) {
      conditions.push("(u.first_name LIKE ? OR u.last_name LIKE ?)");
      const like = `%${query}%`;
      params.push(like, like);
    }

    if (filters.nationalities.length > 0) {
      conditions.push(
        `u.nationality IN (${filters.nationalities.map(() => "?").join(", ")})`,
      );
      params.push(...filters.nationalities);
    }

    if (filters.hobbies.length > 0) {
      conditions.push(`
        u.id IN (
          SELECT uh.user_id
          FROM user_hobbies uh
          JOIN hobbies h ON h.id = uh.hobby_id
          WHERE h.name IN (${filters.hobbies.map(() => "?").join(", ")})
          GROUP BY uh.user_id
          HAVING COUNT(DISTINCT h.name) = ?
        )
      `);
      params.push(...filters.hobbies, filters.hobbies.length);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    return {
      sql: `filtered_users AS (
        SELECT u.id, u.nationality
        FROM users u
        ${where}
      )`,
      params,
    };
  }

  buildListQuery(
    filters: DirectoryFilters,
    sortBy: SortField,
    sortDir: SortDirection,
  ): SqlFragment {
    const filtered = this.buildFilteredUsersCte(filters);
    const direction = sortDir === "desc" ? "DESC" : "ASC";

    return {
      sql: `
        WITH ${filtered.sql}
        SELECT
          u.id,
          u.avatar,
          u.first_name,
          u.last_name,
          u.age,
          u.nationality,
          (
            SELECT GROUP_CONCAT(h.name, ',')
            FROM user_hobbies uh
            JOIN hobbies h ON h.id = uh.hobby_id
            WHERE uh.user_id = u.id
          ) AS hobbies
        FROM users u
        JOIN filtered_users f ON f.id = u.id
        ORDER BY ${SORT_COLUMN[sortBy]} ${direction}, u.id ASC
        LIMIT ? OFFSET ?
      `,
      params: filtered.params,
    };
  }

  buildCountQuery(filters: DirectoryFilters): SqlFragment {
    const filtered = this.buildFilteredUsersCte(filters);

    return {
      sql: `
        WITH ${filtered.sql}
        SELECT COUNT(*) AS total
        FROM filtered_users
      `,
      params: filtered.params,
    };
  }

  buildHobbyFacetQuery(filters: DirectoryFilters): SqlFragment {
    const filtered = this.buildFilteredUsersCte(filters);

    return {
      sql: `
        WITH ${filtered.sql}
        SELECT h.name AS value, COUNT(*) AS count
        FROM filtered_users f
        JOIN user_hobbies uh ON uh.user_id = f.id
        JOIN hobbies h ON h.id = uh.hobby_id
        GROUP BY h.name
        ORDER BY count DESC, h.name ASC
        LIMIT 20
      `,
      params: filtered.params,
    };
  }

  buildNationalityFacetQuery(filters: DirectoryFilters): SqlFragment {
    const filtered = this.buildFilteredUsersCte(filters);

    return {
      sql: `
        WITH ${filtered.sql}
        SELECT f.nationality AS value, COUNT(*) AS count
        FROM filtered_users f
        GROUP BY f.nationality
        ORDER BY count DESC, f.nationality ASC
        LIMIT 20
      `,
      params: filtered.params,
    };
  }
}
