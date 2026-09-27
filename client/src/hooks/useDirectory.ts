import { useCallback, useEffect, useRef, useState } from "react";
import { fetchDirectory } from "../api/userApi";
import { ApiError } from "../api/httpClient";
import type { DirectoryFacets, DirectoryFilters, User } from "../types";

const PAGE_SIZE = 20;

interface DirectoryState {
  users: User[];
  facets: DirectoryFacets;
  page: number;
  hasMore: boolean;
  total: number;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
}

const EMPTY_FACETS: DirectoryFacets = { hobbies: [], nationalities: [] };

const INITIAL_STATE: DirectoryState = {
  users: [],
  facets: EMPTY_FACETS,
  page: 0,
  hasMore: false,
  total: 0,
  isInitialLoading: true,
  isLoadingMore: false,
  error: null,
};

export function useDirectory(filters: DirectoryFilters) {
  const [state, setState] = useState<DirectoryState>(INITIAL_STATE);
  const requestIdRef = useRef(0);

  const loadPage = useCallback(
    async (page: number, append: boolean) => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      setState((current) => ({
        ...current,
        isInitialLoading: !append,
        isLoadingMore: append,
        error: null,
        users: append ? current.users : [],
      }));

      try {
        const result = await fetchDirectory({
          ...filters,
          page,
          limit: PAGE_SIZE,
        });

        if (requestId !== requestIdRef.current) {
          return;
        }

        setState((current) => ({
          users: append ? [...current.users, ...result.data] : result.data,
          facets: result.facets,
          page,
          hasMore: result.pagination.hasMore,
          total: result.pagination.total,
          isInitialLoading: false,
          isLoadingMore: false,
          error: null,
        }));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (requestId !== requestIdRef.current) {
          return;
        }

        const message =
          error instanceof ApiError
            ? error.message
            : "Unable to load the user directory. Please try again.";

        setState((current) => ({
          ...current,
          isInitialLoading: false,
          isLoadingMore: false,
          error: message,
        }));
      }
    },
    [filters],
  );

  useEffect(() => {
    void loadPage(1, false);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (state.isInitialLoading || state.isLoadingMore || !state.hasMore) {
      return;
    }

    void loadPage(state.page + 1, true);
  }, [loadPage, state.hasMore, state.isInitialLoading, state.isLoadingMore, state.page]);

  const retry = useCallback(() => {
    void loadPage(state.users.length > 0 ? state.page : 1, state.users.length > 0);
  }, [loadPage, state.page, state.users.length]);

  return { ...state, loadMore, retry };
}
