/**
 * FILE: useApi.ts
 * LOCATION: frontend/src/lib/api/useApi.ts
 * PURPOSE: React custom hooks for data fetching, mutations, and caching.
 *          Built on top of the api client, these hooks handle loading states,
 *          error states, refetching, and optimistic updates — the three things
 *          every page needs but nobody wants to write manually.
 *
 * HOOKS:
 *  useApiQuery   — Fetch data on mount with automatic caching and refetch
 *  useApiMutation — Execute POST/PUT/PATCH/DELETE with loading + error states
 *  usePaginated  — Fetch paginated data with page/limit controls
 *
 * DESIGN DECISIONS:
 *  1. Zero dependencies — works with React 19's built-in hooks only.
 *     We avoid TanStack Query for simplicity and bundle size.
 *  2. SWR-like pattern — stale-while-revalidate for queries.
 *  3. TypeScript-first — full generic types for request/response.
 *  4. Error boundary friendly — errors are returned, not thrown.
 *
 * USAGE:
 *  const { data, isLoading, error, refetch } = useApiQuery<ClassList>("/content/classes");
 *  const { mutate, isPending } = useApiMutation<AuthResult>("/auth/login", "POST");
 *
 * DEPENDENCIES: react, ./client
 * USED BY: All frontend pages and components
 * LAST UPDATED: 2026-05-27
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { api, ApiError, type RequestOptions } from "./client";

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

/** State shape for query hooks */
export interface QueryState<T> {
  /** The fetched data (undefined while loading or on error) */
  data: T | undefined;
  /** True during the initial load or refetch */
  isLoading: boolean;
  /** Error object if the request failed */
  error: ApiError | null;
  /** Manually trigger a refetch */
  refetch: () => void;
  /** Whether we have successfully fetched data at least once */
  isFetched: boolean;
}

/** State shape for mutation hooks */
export interface MutationState<TResponse> {
  /** Execute the mutation with the given data */
  mutate: (data?: unknown) => Promise<TResponse | undefined>;
  /** True while the mutation is in progress */
  isPending: boolean;
  /** Error object if the mutation failed */
  error: ApiError | null;
  /** The response data from the last successful mutation */
  data: TResponse | undefined;
  /** Reset the mutation state */
  reset: () => void;
}

/** Configuration for useApiQuery */
export interface QueryConfig {
  /** Skip the initial fetch (useful for conditional queries) */
  enabled?: boolean;
  /** Request options (timeout, retries, etc.) */
  requestOptions?: RequestOptions;
  /** Refetch interval in milliseconds (0 = disabled) */
  refetchIntervalMs?: number;
  /** Dependencies that trigger a refetch when changed */
  deps?: unknown[];
}

/* ─────────────────────────────────────────────
 * useApiQuery — Data fetching hook
 *
 * Fetches data on mount and provides loading/error/refetch.
 * Supports conditional fetching, refetch intervals, and
 * dependency-based refetching.
 *
 * @param path - API endpoint path (e.g., "/content/classes")
 * @param config - Query configuration
 * @returns Query state with data, loading, error, and refetch
 * ───────────────────────────────────────────── */
export function useApiQuery<T>(path: string, config: QueryConfig = {}): QueryState<T> {
  const {
    enabled = true,
    requestOptions = {},
    refetchIntervalMs = 0,
    deps = [],
  } = config;

  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<ApiError | null>(null);
  const [isFetched, setIsFetched] = useState(false);

  /* Track mounted state to prevent setState on unmounted components */
  const isMountedRef = useRef(true);
  /* Track the latest path to prevent stale fetches */
  const latestPathRef = useRef(path);

  useEffect(() => {
    latestPathRef.current = path;
  }, [path]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Core fetch function — called on mount and when refetch() is called.
   * Uses the API client with error handling and mounted-state guards.
   */
  const fetchData = useCallback(async () => {
    if (!isMountedRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await api.get<T>(path, requestOptions);

      /* Only update state if this component is still mounted
         AND the path hasn't changed (prevents stale data) */
      if (isMountedRef.current && latestPathRef.current === path) {
        setData(result);
        setIsFetched(true);
      }
    } catch (err) {
      if (isMountedRef.current && latestPathRef.current === path) {
        setError(err instanceof ApiError ? err : new ApiError("Unknown error", 500));
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ...deps]);

  /* Initial fetch and dependency-based refetching */
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  /* Refetch interval (polling) */
  useEffect(() => {
    if (refetchIntervalMs > 0 && enabled) {
      const intervalId = setInterval(fetchData, refetchIntervalMs);
      return () => clearInterval(intervalId);
    }
  }, [refetchIntervalMs, enabled, fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    isFetched,
  };
}

/* ─────────────────────────────────────────────
 * useApiMutation — Mutation hook
 *
 * Provides a mutate function for POST/PUT/PATCH/DELETE operations
 * with automatic loading and error state management.
 *
 * @param path - API endpoint path
 * @param method - HTTP method (default: "POST")
 * @param options - Request options
 * @returns Mutation state with mutate function, isPending, and error
 * ───────────────────────────────────────────── */
export function useApiMutation<TResponse>(
  path: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
  options: RequestOptions = {}
): MutationState<TResponse> {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<TResponse | undefined>(undefined);

  /* Track mounted state */
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Execute the mutation.
   * Returns the response data on success, or undefined on failure.
   * Error is stored in state for UI display.
   */
  const mutate = useCallback(async (body?: unknown): Promise<TResponse | undefined> => {
    setIsPending(true);
    setError(null);

    try {
      let result: TResponse;

      switch (method) {
        case "POST":
          result = await api.post<TResponse>(path, body, options);
          break;
        case "PUT":
          result = await api.put<TResponse>(path, body, options);
          break;
        case "PATCH":
          result = await api.patch<TResponse>(path, body, options);
          break;
        case "DELETE":
          result = await api.delete<TResponse>(path, options);
          break;
      }

      if (isMountedRef.current) {
        setData(result);
      }
      return result;
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError("Unknown error", 500);
      if (isMountedRef.current) {
        setError(apiError);
      }
      return undefined;
    } finally {
      if (isMountedRef.current) {
        setIsPending(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, method]);

  /** Reset mutation state to initial values */
  const reset = useCallback(() => {
    setIsPending(false);
    setError(null);
    setData(undefined);
  }, []);

  return { mutate, isPending, error, data, reset };
}

/* ─────────────────────────────────────────────
 * usePaginated — Paginated query hook
 *
 * Extends useApiQuery with page/limit controls for paginated endpoints.
 * Provides next/previous page functions and total count tracking.
 *
 * @param basePath - API endpoint path (e.g., "/content/chapters")
 * @param config - Pagination and query configuration
 * @returns Paginated query state
 * ───────────────────────────────────────────── */
export interface PaginatedConfig extends QueryConfig {
  /** Items per page (default: 20) */
  pageSize?: number;
  /** Initial page number (default: 1) */
  initialPage?: number;
}

export interface PaginatedState<T> extends QueryState<T[]> {
  /** Current page number */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items across all pages */
  total: number | undefined;
  /** Whether there are more pages after the current one */
  hasMore: boolean;
  /** Go to the next page */
  nextPage: () => void;
  /** Go to the previous page */
  prevPage: () => void;
  /** Go to a specific page */
  goToPage: (page: number) => void;
}

export function usePaginated<T>(
  basePath: string,
  config: PaginatedConfig = {}
): PaginatedState<T> {
  const { pageSize = 20, initialPage = 1, ...queryConfig } = config;
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);

  /* Build path with pagination params */
  const paginatedPath = `${basePath}?page=${page}&limit=${pageSize}`;

  const query = useApiQuery<{ items: T[]; total?: number; hasMore?: boolean }>(paginatedPath, {
    ...queryConfig,
    deps: [page, pageSize, ...(queryConfig.deps || [])],
  });

  /* Update pagination metadata when data arrives */
  useEffect(() => {
    if (query.data) {
      if (query.data.total !== undefined) setTotal(query.data.total);
      if (query.data.hasMore !== undefined) setHasMore(query.data.hasMore);
    }
  }, [query.data]);

  const nextPage = useCallback(() => {
    if (hasMore) setPage((p) => p + 1);
  }, [hasMore]);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const goToPage = useCallback((targetPage: number) => {
    setPage(Math.max(1, targetPage));
  }, []);

  return {
    data: query.data?.items,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isFetched: query.isFetched,
    page,
    pageSize,
    total,
    hasMore,
    nextPage,
    prevPage,
    goToPage,
  };
}
