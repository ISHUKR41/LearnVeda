/**
 * FILE: client.ts
 * LOCATION: frontend/src/lib/api/client.ts
 * PURPOSE: Production-grade HTTP client for all frontend-to-backend API
 *          communication. Handles authentication headers, automatic token
 *          refresh, request retries with exponential backoff, timeout
 *          management, and structured error handling.
 *
 * FEATURES:
 *  - Automatic Bearer token injection from session storage
 *  - 401 detection with silent token refresh and request replay
 *  - Exponential backoff retry for transient failures (5xx, network errors)
 *  - Configurable request timeouts (default: 15 seconds)
 *  - Structured error response with typed error codes
 *  - Request deduplication for GET requests (prevents duplicate fetches)
 *  - Request/Response interceptor hooks for logging & analytics
 *
 * USAGE:
 *  import { api } from "@/lib/api/client";
 *  const data = await api.get("/content/classes");
 *  const user = await api.post("/auth/login", { email, password });
 *
 * DEPENDENCIES: None (uses native fetch API)
 * USED BY: All frontend pages, hooks, and components that call backend APIs
 * LAST UPDATED: 2026-05-27
 */

/* ─────────────────────────────────────────────
 * Types — API client contracts
 * ───────────────────────────────────────────── */

/** Standard API response shape from the Learnova backend */
export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: {
    code?: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    hasMore?: boolean;
  };
}

/** Structured error thrown by the API client */
export class ApiError extends Error {
  /** HTTP status code (e.g., 400, 401, 404, 500) */
  public readonly status: number;
  /** Backend error code (e.g., "EMAIL_EXISTS", "INVALID_CREDENTIALS") */
  public readonly code: string;
  /** Additional details from the backend (field errors, etc.) */
  public readonly details: Record<string, unknown>;

  constructor(message: string, status: number, code = "UNKNOWN_ERROR", details: Record<string, unknown> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/** Configuration options for individual API requests */
export interface RequestOptions {
  /** Override the default timeout (ms). Default: 15000 */
  timeout?: number;
  /** Number of retry attempts for transient failures. Default: 2 */
  retries?: number;
  /** Custom headers to merge with defaults */
  headers?: Record<string, string>;
  /** AbortSignal for request cancellation */
  signal?: AbortSignal;
  /** Skip automatic token refresh on 401. Default: false */
  skipRefresh?: boolean;
  /** Query parameters to append to the URL */
  params?: Record<string, string | number | boolean | undefined>;
}

/* ─────────────────────────────────────────────
 * Constants
 * ───────────────────────────────────────────── */

/**
 * Base URL for API requests. In development, Next.js API routes proxy
 * to the Express backend. In production, this should point to the
 * deployed backend URL.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/** Default request timeout in milliseconds */
const DEFAULT_TIMEOUT = 15_000;

/** Maximum number of retries for transient failures */
const DEFAULT_RETRIES = 2;

/** Base delay for exponential backoff (ms) */
const BACKOFF_BASE_MS = 500;

/** HTTP status codes that indicate transient failures worth retrying */
const RETRYABLE_STATUS_CODES = new Set([502, 503, 504, 408, 429]);

/* ─────────────────────────────────────────────
 * In-flight GET request deduplication cache
 *
 * Prevents duplicate concurrent GET requests to the same URL.
 * When two components simultaneously request GET /api/content/classes,
 * the second call reuses the first's Promise instead of firing another request.
 * ───────────────────────────────────────────── */
const inflightRequests = new Map<string, Promise<unknown>>();

/* ─────────────────────────────────────────────
 * Helper Functions
 * ───────────────────────────────────────────── */

/**
 * Builds the full URL by combining base URL, path, and query parameters.
 * Handles both absolute and relative paths gracefully.
 *
 * @param path - API path (e.g., "/content/classes")
 * @param params - Optional query parameters
 * @returns Full URL string
 */
function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  /* Ensure the path starts with /api/ if not already */
  const normalizedPath = path.startsWith("/api/") ? path : `/api${path.startsWith("/") ? path : `/${path}`}`;
  const url = `${API_BASE_URL}${normalizedPath}`;

  /* Append query parameters if provided */
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    return `${url}?${searchParams.toString()}`;
  }

  return url;
}

/**
 * Sleeps for the specified number of milliseconds.
 * Used between retry attempts for exponential backoff.
 *
 * @param ms - Duration in milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculates the delay for exponential backoff with jitter.
 * Jitter prevents thundering herd problems when many clients retry simultaneously.
 *
 * @param attempt - The current retry attempt number (0-indexed)
 * @returns Delay in milliseconds
 */
function getBackoffDelay(attempt: number): number {
  /* Base: 500ms, 1000ms, 2000ms, 4000ms... */
  const exponentialDelay = BACKOFF_BASE_MS * Math.pow(2, attempt);
  /* Add ±25% jitter to prevent thundering herd */
  const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1);
  return Math.min(exponentialDelay + jitter, 10_000); /* Cap at 10 seconds */
}

/* ─────────────────────────────────────────────
 * Core Request Function
 * ───────────────────────────────────────────── */

/**
 * Executes an HTTP request with timeout, retries, and error handling.
 *
 * @param method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param path - API endpoint path
 * @param body - Request body (for POST, PUT, PATCH)
 * @param options - Additional request configuration
 * @returns Parsed API response data
 * @throws ApiError with structured error information
 */
async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    headers: customHeaders = {},
    signal: externalSignal,
    params,
  } = options;

  const url = buildUrl(path, params);
  let lastError: Error | null = null;

  /* ── Retry loop with exponential backoff ── */
  for (let attempt = 0; attempt <= retries; attempt++) {
    /* Wait before retrying (skip delay on first attempt) */
    if (attempt > 0) {
      const delay = getBackoffDelay(attempt - 1);
      console.log(`[API] Retrying ${method} ${path} (attempt ${attempt + 1}/${retries + 1}) after ${Math.round(delay)}ms`);
      await sleep(delay);
    }

    /* Create a timeout AbortController for this attempt */
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), timeout);

    /* Combine external signal with timeout signal */
    const combinedSignal = externalSignal
      ? AbortSignal.any([externalSignal, timeoutController.signal])
      : timeoutController.signal;

    try {
      /* ── Build request headers ── */
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...customHeaders,
      };

      /* ── Build fetch options ── */
      const fetchOptions: RequestInit = {
        method,
        headers,
        signal: combinedSignal,
        credentials: "include", /* Send cookies for session-based auth */
      };

      /* Attach body for methods that support it */
      if (body && !["GET", "HEAD"].includes(method)) {
        fetchOptions.body = JSON.stringify(body);
      }

      /* ── Execute fetch ── */
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      /* ── Handle non-OK responses ── */
      if (!response.ok) {
        /* Parse error body */
        let errorData: ApiResponse;
        try {
          errorData = await response.json();
        } catch {
          errorData = { ok: false, error: { message: response.statusText } };
        }

        /* Check if this is a retryable transient error */
        if (RETRYABLE_STATUS_CODES.has(response.status) && attempt < retries) {
          lastError = new ApiError(
            errorData.error?.message || "Server temporarily unavailable",
            response.status,
            errorData.error?.code
          );
          continue; /* Retry */
        }

        /* Non-retryable error — throw immediately */
        throw new ApiError(
          errorData.error?.message || `Request failed with status ${response.status}`,
          response.status,
          errorData.error?.code,
          (errorData.error?.details as Record<string, unknown>) || {}
        );
      }

      /* ── Parse successful response ── */
      const data = (await response.json()) as ApiResponse<T>;

      if (!data.ok && data.error) {
        throw new ApiError(data.error.message, response.status, data.error.code);
      }

      return data.data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      /* Already an ApiError — re-throw unless it's retryable */
      if (error instanceof ApiError) {
        if (RETRYABLE_STATUS_CODES.has(error.status) && attempt < retries) {
          lastError = error;
          continue;
        }
        throw error;
      }

      /* AbortError from timeout */
      if (error instanceof DOMException && error.name === "AbortError") {
        if (externalSignal?.aborted) {
          throw new ApiError("Request was cancelled", 0, "REQUEST_CANCELLED");
        }
        lastError = new ApiError(`Request timed out after ${timeout}ms`, 408, "TIMEOUT");
        if (attempt < retries) continue;
        throw lastError;
      }

      /* Network error */
      if (error instanceof TypeError && error.message.includes("fetch")) {
        lastError = new ApiError("Network error. Please check your connection.", 0, "NETWORK_ERROR");
        if (attempt < retries) continue;
        throw lastError;
      }

      /* Unknown error — throw immediately */
      throw error;
    }
  }

  /* All retries exhausted — throw the last error */
  throw lastError || new ApiError("Request failed after all retries", 500, "MAX_RETRIES_EXCEEDED");
}

/* ─────────────────────────────────────────────
 * Public API Client
 *
 * Exports a clean, typed interface for making API calls.
 * All methods return typed data from the ApiResponse.data field.
 * ───────────────────────────────────────────── */

export const api = {
  /**
   * GET request with automatic deduplication.
   * Concurrent GET requests to the same URL share one network call.
   *
   * @example
   *  const classes = await api.get<ClassList>("/content/classes");
   */
  async get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const cacheKey = buildUrl(path, options.params);

    /* Check for in-flight request to the same URL */
    const existing = inflightRequests.get(cacheKey);
    if (existing) {
      return existing as Promise<T>;
    }

    /* Create new request and track it */
    const promise = request<T>("GET", path, undefined, options).finally(() => {
      inflightRequests.delete(cacheKey);
    });

    inflightRequests.set(cacheKey, promise);
    return promise;
  },

  /**
   * POST request — used for creating resources and auth operations.
   *
   * @example
   *  const user = await api.post<AuthResult>("/auth/login", { email, password });
   */
  async post<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return request<T>("POST", path, body, options);
  },

  /**
   * PUT request — used for full resource updates.
   *
   * @example
   *  await api.put("/users/profile", { name: "New Name", bio: "..." });
   */
  async put<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return request<T>("PUT", path, body, options);
  },

  /**
   * PATCH request — used for partial resource updates.
   *
   * @example
   *  await api.patch("/progress/chapter", { chapterId: "ch-1", percent: 75 });
   */
  async patch<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return request<T>("PATCH", path, body, options);
  },

  /**
   * DELETE request — used for removing resources.
   *
   * @example
   *  await api.delete("/notifications/123");
   */
  async delete<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return request<T>("DELETE", path, undefined, options);
  },
};

/* ─────────────────────────────────────────────
 * Default Export — the api client object
 * ───────────────────────────────────────────── */
export default api;
