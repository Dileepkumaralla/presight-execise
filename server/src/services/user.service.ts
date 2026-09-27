import { ValidationError } from "../errors/app.error";
import type { ILogger } from "../logging/logger";
import type { DirectoryPage, DirectoryQuery } from "../models/user.model";
import { SORT_DIRECTIONS, SORT_FIELDS } from "../models/user.model";
import type { IUserRepository } from "../repositories/user.repository";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILogger,
  ) {}

  getDirectory(query: DirectoryQuery): DirectoryPage {
    const normalized = this.normalizeQuery(query);
    this.logger.debug("Loading user directory", { query: normalized });

    const [page, facets] = [
      this.userRepository.findMany(normalized),
      this.userRepository.findFacets(normalized),
    ];

    return {
      data: page.users,
      pagination: page.pagination,
      facets,
    };
  }

  private normalizeQuery(query: DirectoryQuery): DirectoryQuery {
    if (!SORT_FIELDS.includes(query.sortBy)) {
      throw new ValidationError("Unsupported sort field", { sortBy: query.sortBy });
    }

    if (!SORT_DIRECTIONS.includes(query.sortDir)) {
      throw new ValidationError("Unsupported sort direction", { sortDir: query.sortDir });
    }

    if (!Number.isInteger(query.page) || query.page < 1) {
      throw new ValidationError("page must be a positive integer", { page: query.page });
    }

    if (!Number.isInteger(query.limit) || query.limit < 1 || query.limit > MAX_LIMIT) {
      throw new ValidationError(`limit must be between 1 and ${MAX_LIMIT}`, {
        limit: query.limit,
      });
    }

    return {
      query: query.query.trim(),
      nationalities: this.uniqueValues(query.nationalities),
      hobbies: this.uniqueValues(query.hobbies),
      sortBy: query.sortBy,
      sortDir: query.sortDir,
      page: query.page || DEFAULT_PAGE,
      limit: query.limit || DEFAULT_LIMIT,
    };
  }

  private uniqueValues(values: string[]): string[] {
    return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
  }
}
