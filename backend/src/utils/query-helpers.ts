/**
 * FILE: query-helpers.ts
 * LOCATION: backend/src/utils/query-helpers.ts
 * PURPOSE: Reusable utility functions for building safe, parameterized SQL queries.
 *          Provides pagination, sorting, filtering, and input parsing helpers
 *          that prevent SQL injection and enforce consistent query patterns
 *          across all route handlers.
 *
 * WHY THIS EXISTS:
 *  - Prevents SQL injection by using parameterized queries and whitelists
 *  - Enforces consistent pagination limits (max 100 items per page)
 *  - Centralizes query building logic instead of duplicating in every route
 *  - Makes it easy to add cursor-based pagination later without changing routes
 *
 * USED BY: All route files (content.ts, community.ts, leaderboard.ts, etc.)
 * DEPENDENCIES: None (pure utility functions)
 * LAST UPDATED: 2026-05-26
 */

/* ─────────────────────────────────────────────
 * PAGINATION HELPERS
 * Standard offset-based pagination with safety limits.
 * All routes should use these instead of raw parseInt.
 * ───────────────────────────────────────────── */

/**
 * Maximum number of items any API endpoint can return in a single page.
 * This hard limit prevents clients from requesting ALL records at once,
 * which would overwhelm the database with 10k+ users.
 */
const MAX_PAGE_SIZE = 100;

/**
 * Default number of items returned if the client doesn't specify a limit.
 * Small enough for fast responses, large enough to be useful.
 */
const DEFAULT_PAGE_SIZE = 20;

/**
 * Parsed and validated pagination parameters.
 * Used by all paginated API endpoints.
 */
export interface PaginationParams {
  /** Number of items to return (1 to MAX_PAGE_SIZE) */
  limit: number;
  /** Number of items to skip (0 or positive integer) */
  offset: number;
  /** Current page number (1-based, derived from offset) */
  page: number;
}

/**
 * Parses and validates pagination parameters from query strings.
 * Ensures limit is between 1 and MAX_PAGE_SIZE, offset is non-negative.
 *
 * Usage in route handlers:
 * ```typescript
 * const { limit, offset } = parsePagination(req.query);
 * const result = await pool.query(`SELECT * FROM posts LIMIT $1 OFFSET $2`, [limit, offset]);
 * ```
 *
 * @param query - Express req.query object (values are strings or undefined)
 * @returns {PaginationParams} Safe, validated pagination values
 */
export function parsePagination(
  query: Record<string, unknown>
): PaginationParams {
  /* Parse limit — default to DEFAULT_PAGE_SIZE, cap at MAX_PAGE_SIZE */
  const rawLimit = parseIntSafe(query.limit as string, DEFAULT_PAGE_SIZE);
  const limit = Math.min(Math.max(rawLimit, 1), MAX_PAGE_SIZE);

  /* Parse offset — ensure it's a non-negative integer */
  const rawOffset = parseIntSafe(query.offset as string, 0);
  const offset = Math.max(rawOffset, 0);

  /* Calculate 1-based page number from offset */
  const page = limit > 0 ? Math.floor(offset / limit) + 1 : 1;

  return { limit, offset, page };
}

/**
 * Builds a pagination metadata object for API responses.
 * Clients use this to display page navigation (Next/Previous buttons).
 *
 * Example response:
 * ```json
 * {
 *   "data": [...],
 *   "pagination": {
 *     "page": 1,
 *     "limit": 20,
 *     "total": 150,
 *     "totalPages": 8,
 *     "hasNext": true,
 *     "hasPrev": false
 *   }
 * }
 * ```
 *
 * @param total - Total number of items in the database (from COUNT query)
 * @param params - Current pagination parameters
 * @returns Pagination metadata object for the API response
 */
export function buildPaginationMeta(total: number, params: PaginationParams) {
  const totalPages = Math.ceil(total / params.limit);

  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages,
    hasNext: params.page < totalPages,
    hasPrev: params.page > 1,
  };
}

/* ─────────────────────────────────────────────
 * SORTING HELPERS
 * Whitelist-based sorting to prevent SQL injection.
 * Only allows sorting by pre-approved column names.
 * ───────────────────────────────────────────── */

/**
 * Validates and builds a safe ORDER BY clause.
 * Uses a whitelist of allowed column names to prevent SQL injection.
 *
 * SECURITY NOTE:
 *  Column names CANNOT be parameterized in PostgreSQL ($1, $2, etc.).
 *  Therefore, we MUST validate them against a whitelist.
 *  This function rejects any column name not in the allowed list.
 *
 * Usage:
 * ```typescript
 * const orderBy = buildSortClause(req.query.sort, req.query.order, ['name', 'createdAt', 'xp']);
 * const result = await pool.query(`SELECT * FROM users ${orderBy}`);
 * ```
 *
 * @param field - Requested sort field from query params
 * @param direction - Requested sort direction ("asc" or "desc")
 * @param allowedFields - Whitelist of column names that can be sorted
 * @param defaultField - Default sort field if none specified
 * @param defaultDirection - Default sort direction if none specified
 * @returns {string} Safe SQL ORDER BY clause (e.g., 'ORDER BY "createdAt" DESC')
 */
export function buildSortClause(
  field: string | undefined,
  direction: string | undefined,
  allowedFields: string[],
  defaultField: string = "createdAt",
  defaultDirection: "ASC" | "DESC" = "DESC"
): string {
  /* Validate field against whitelist — reject anything not in the list */
  const safeField = field && allowedFields.includes(field) ? field : defaultField;

  /* Validate direction — only ASC or DESC are valid */
  const rawDir = (direction ?? "").toUpperCase();
  const safeDirection = rawDir === "ASC" || rawDir === "DESC" ? rawDir : defaultDirection;

  /* Return quoted column name to handle camelCase PostgreSQL column names */
  return `ORDER BY "${safeField}" ${safeDirection}`;
}

/* ─────────────────────────────────────────────
 * INPUT PARSING HELPERS
 * Safe conversion of query string values to typed values.
 * ───────────────────────────────────────────── */

/**
 * Safely parses a string value to an integer.
 * Returns the default value if the input is null, undefined, NaN, or not a valid integer.
 *
 * This should be used instead of raw parseInt() throughout the codebase
 * because parseInt("abc") returns NaN, which can cause unexpected behavior
 * in SQL queries and calculations.
 *
 * @param value - Raw string value from query params or request body
 * @param defaultValue - Value to return if parsing fails
 * @returns {number} Parsed integer or default value
 */
export function parseIntSafe(value: string | undefined | null, defaultValue: number): number {
  if (value === null || value === undefined || value === "") {
    return defaultValue;
  }

  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Safely parses a string value to a boolean.
 * Handles common truthy string representations.
 *
 * @param value - Raw string value from query params
 * @param defaultValue - Value to return if parsing fails
 * @returns {boolean} Parsed boolean or default value
 */
export function parseBoolSafe(value: string | undefined | null, defaultValue: boolean): boolean {
  if (value === null || value === undefined || value === "") {
    return defaultValue;
  }

  const lower = value.toLowerCase().trim();
  if (["true", "1", "yes", "on"].includes(lower)) return true;
  if (["false", "0", "no", "off"].includes(lower)) return false;

  return defaultValue;
}

/* ─────────────────────────────────────────────
 * FILTER HELPERS
 * Build dynamic WHERE clauses with parameterized values.
 * ───────────────────────────────────────────── */

/**
 * A single filter condition for building WHERE clauses.
 */
export interface FilterCondition {
  /** Column name (must be in the allowed whitelist) */
  column: string;
  /** Comparison operator */
  operator: "=" | "!=" | ">" | ">=" | "<" | "<=" | "LIKE" | "ILIKE" | "IN";
  /** Value to compare against (parameterized) */
  value: unknown;
}

/**
 * Builds a parameterized WHERE clause from a list of filter conditions.
 * All values are parameterized ($1, $2, $3...) to prevent SQL injection.
 *
 * Usage:
 * ```typescript
 * const filters: FilterCondition[] = [
 *   { column: "classId", operator: "=", value: "abc123" },
 *   { column: "isActive", operator: "=", value: true },
 * ];
 * const { clause, params } = buildWhereClause(filters, ["classId", "isActive"]);
 * // clause = 'WHERE "classId" = $1 AND "isActive" = $2'
 * // params = ["abc123", true]
 * ```
 *
 * @param filters - Array of filter conditions
 * @param allowedColumns - Whitelist of allowed column names
 * @param startParamIndex - Starting parameter index (default: 1)
 * @returns Object with the SQL clause string and parameter values array
 */
export function buildWhereClause(
  filters: FilterCondition[],
  allowedColumns: string[],
  startParamIndex: number = 1
): { clause: string; params: unknown[] } {
  /* Filter out any conditions using non-whitelisted columns */
  const safeFilters = filters.filter((f) => allowedColumns.includes(f.column));

  if (safeFilters.length === 0) {
    return { clause: "", params: [] };
  }

  const conditions: string[] = [];
  const params: unknown[] = [];

  for (let i = 0; i < safeFilters.length; i++) {
    const filter = safeFilters[i];
    const paramIndex = startParamIndex + i;

    if (filter.operator === "IN" && Array.isArray(filter.value)) {
      /* Handle IN operator — create multiple parameter placeholders */
      const placeholders = (filter.value as unknown[])
        .map((_, idx) => `$${paramIndex + idx}`)
        .join(", ");
      conditions.push(`"${filter.column}" IN (${placeholders})`);
      params.push(...(filter.value as unknown[]));
    } else {
      /* Standard comparison operator */
      conditions.push(`"${filter.column}" ${filter.operator} $${paramIndex}`);
      params.push(filter.value);
    }
  }

  return {
    clause: `WHERE ${conditions.join(" AND ")}`,
    params,
  };
}

/* ─────────────────────────────────────────────
 * SLUG HELPERS
 * Convert titles to URL-safe slugs for routes.
 * ───────────────────────────────────────────── */

/**
 * Generates a URL-safe slug from a title string.
 * Used when creating new subjects, chapters, topics, etc.
 *
 * Examples:
 *  - "Number Systems" → "number-systems"
 *  - "Introduction to Euclid's Geometry" → "introduction-to-euclids-geometry"
 *  - "The d- and f-Block Elements" → "the-d-and-f-block-elements"
 *
 * @param title - Raw title string
 * @returns {string} URL-safe slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, "")           // Remove apostrophes
    .replace(/[^a-z0-9]+/g, "-")    // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, "")        // Trim leading/trailing hyphens
    .replace(/-{2,}/g, "-");        // Collapse multiple hyphens
}

/**
 * Generates a unique slug by appending a random suffix.
 * Used when creating user-generated content where slug collisions are possible.
 *
 * @param title - Raw title string
 * @returns {string} URL-safe slug with random suffix
 */
export function generateUniqueSlug(title: string): string {
  const base = generateSlug(title);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

/* ─────────────────────────────────────────────
 * RESPONSE HELPERS
 * Standard API response formats for consistency.
 * ───────────────────────────────────────────── */

/**
 * Creates a standard success response object.
 * All API endpoints should use this format for consistency.
 *
 * @param data - Response payload
 * @param meta - Optional metadata (pagination, etc.)
 * @returns Standard success response object
 */
export function successResponse<T>(data: T, meta?: Record<string, unknown>) {
  return {
    ok: true,
    data,
    ...(meta ? { meta } : {}),
  };
}

/**
 * Creates a standard error response object.
 * All API endpoints should use this format for consistency.
 *
 * @param message - Human-readable error message
 * @param code - Machine-readable error code
 * @param statusCode - HTTP status code (for internal use)
 * @returns Standard error response object
 */
export function errorResponse(
  message: string,
  code: string = "INTERNAL_ERROR",
  statusCode: number = 500
) {
  return {
    ok: false,
    error: { code, message },
    _statusCode: statusCode, // Internal use — stripped before sending
  };
}
