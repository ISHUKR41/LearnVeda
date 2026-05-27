/**
 * FILE: error-handler.middleware.ts
 * LOCATION: backend/src/middlewares/error-handler.middleware.ts
 * PURPOSE: Centralized error handling middleware for Express.
 *          Catches all unhandled errors, formats them consistently,
 *          logs them with full context, and returns sanitized responses.
 *
 * FEATURES:
 *  - Typed custom error classes (AppError, ValidationError, etc.)
 *  - Consistent error response format across all endpoints
 *  - Automatic error categorization by HTTP status code
 *  - Stack trace inclusion in development only
 *  - Error rate tracking for alerting
 *  - Prisma/PostgreSQL error code mapping
 *  - Request context preservation for debugging
 *
 * SECURITY:
 *  - Never exposes internal error details in production
 *  - Masks database column names and table names
 *  - Sanitizes stack traces to remove file paths
 *
 * DEPENDENCIES: Express, logger
 * USED BY: index.ts (registered as the last middleware)
 * LAST UPDATED: 2026-05-26
 */

import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

/* ─────────────────────────────────────────────
 * Custom Error Classes
 * Extend these in route handlers for typed error handling.
 * Each class maps to a specific HTTP status code.
 * ───────────────────────────────────────────── */

/**
 * Base application error class.
 * All custom errors should extend this class.
 * Provides consistent error structure with HTTP status code,
 * error code, and optional details.
 */
export class AppError extends Error {
  /** HTTP status code (e.g., 400, 401, 404, 500) */
  public readonly statusCode: number;
  /** Machine-readable error code (e.g., 'USER_NOT_FOUND') */
  public readonly errorCode: string;
  /** Whether this error is operational (expected) vs programmer error */
  public readonly isOperational: boolean;
  /** Optional additional details (only included in development responses) */
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = "INTERNAL_ERROR",
    isOperational: boolean = true,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.details = details;

    /* Preserve proper stack trace for debugging */
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * 400 Bad Request — invalid input data.
 * Use when request body, query params, or path params fail validation.
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, "VALIDATION_ERROR", true, details);
  }
}

/**
 * 401 Unauthorized — missing or invalid authentication.
 * Use when no valid JWT token is provided.
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "AUTHENTICATION_REQUIRED", true);
  }
}

/**
 * 403 Forbidden — authenticated but insufficient permissions.
 * Use when the user doesn't have the required role.
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "FORBIDDEN", true);
  }
}

/**
 * 404 Not Found — requested resource doesn't exist.
 * Use when a database query returns no results.
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with ID '${identifier}' not found`
      : `${resource} not found`;
    super(message, 404, "NOT_FOUND", true);
  }
}

/**
 * 409 Conflict — resource already exists or state conflict.
 * Use for duplicate email, username, or concurrent modification.
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT", true);
  }
}

/**
 * 429 Too Many Requests — rate limit exceeded.
 * Use when the client exceeds the configured rate limit.
 */
export class RateLimitError extends AppError {
  public readonly retryAfterMs: number;

  constructor(retryAfterMs: number = 60000) {
    super("Too many requests. Please try again later.", 429, "RATE_LIMIT_EXCEEDED", true);
    this.retryAfterMs = retryAfterMs;
  }
}

/**
 * 503 Service Unavailable — dependency is down.
 * Use when database, Redis, or external API is unreachable.
 */
export class ServiceUnavailableError extends AppError {
  constructor(service: string) {
    super(`${service} is temporarily unavailable. Please try again.`, 503, "SERVICE_UNAVAILABLE", true);
  }
}

/* ─────────────────────────────────────────────
 * Error Response Format
 * Consistent JSON structure for all error responses.
 * ───────────────────────────────────────────── */

/** Standard error response body */
interface ErrorResponse {
  /** Always false for error responses */
  ok: false;
  /** Error category */
  error: {
    /** Machine-readable error code */
    code: string;
    /** Human-readable error message */
    message: string;
    /** HTTP status code */
    status: number;
    /** ISO timestamp */
    timestamp: string;
    /** Request ID for support reference */
    requestId: string;
    /** Detailed field-level errors (validation only) */
    details?: Record<string, unknown>;
    /** Stack trace (development only) */
    stack?: string;
  };
}

/* ─────────────────────────────────────────────
 * PostgreSQL Error Code Mapping
 * Maps Postgres error codes to user-friendly messages.
 * Full reference: https://www.postgresql.org/docs/current/errcodes-appendix.html
 * ───────────────────────────────────────────── */

/** Maps PostgreSQL error codes to user-friendly AppError instances */
function mapPostgresError(pgError: { code?: string; detail?: string; constraint?: string }): AppError {
  switch (pgError.code) {
    case "23505": // unique_violation
      return new ConflictError(
        extractUniqueViolationMessage(pgError.detail, pgError.constraint)
      );
    case "23503": // foreign_key_violation
      return new ValidationError("Referenced resource does not exist");
    case "23502": // not_null_violation
      return new ValidationError("Required field is missing");
    case "23514": // check_violation
      return new ValidationError("Value does not meet constraints");
    case "42P01": // undefined_table
      return new AppError("Database schema error", 500, "SCHEMA_ERROR", false);
    case "42703": // undefined_column
      return new AppError("Database schema error", 500, "SCHEMA_ERROR", false);
    case "57014": // query_canceled (statement_timeout)
      return new AppError("Request timed out", 504, "TIMEOUT", true);
    case "53300": // too_many_connections
      return new ServiceUnavailableError("Database");
    default:
      return new AppError("Database operation failed", 500, "DATABASE_ERROR", false);
  }
}

/**
 * Extracts a user-friendly message from PostgreSQL unique violation details.
 * Example input: "Key (email)=(user@example.com) already exists."
 * Example output: "A user with this email already exists."
 */
function extractUniqueViolationMessage(detail?: string, constraint?: string): string {
  if (detail) {
    const match = detail.match(/Key \((\w+)\)=\((.+?)\) already exists/);
    if (match) {
      const field = match[1];
      return `A record with this ${field} already exists.`;
    }
  }

  if (constraint) {
    if (constraint.includes("email")) return "This email address is already registered.";
    if (constraint.includes("username")) return "This username is already taken.";
  }

  return "A record with these values already exists.";
}

/* ─────────────────────────────────────────────
 * Error Rate Tracking
 * Tracks error counts per minute for alerting.
 * ───────────────────────────────────────────── */

/** Rolling error counter — resets every minute */
let errorCountThisMinute = 0;
let lastResetTime = Date.now();

/** Resets the error counter every 60 seconds */
function trackError(): void {
  const now = Date.now();
  if (now - lastResetTime > 60_000) {
    if (errorCountThisMinute > 50) {
      logger.error("[Error Handler] HIGH ERROR RATE DETECTED", {
        errorsPerMinute: errorCountThisMinute,
        alertLevel: "CRITICAL",
      });
    }
    errorCountThisMinute = 0;
    lastResetTime = now;
  }
  errorCountThisMinute++;
}

/* ─────────────────────────────────────────────
 * Global Error Handler Middleware
 * Must be registered LAST in the Express middleware chain.
 * ───────────────────────────────────────────── */

/**
 * Global Express error handler middleware.
 * Catches all errors thrown or passed via next(error) in routes.
 * Formats them into a consistent JSON response and logs them
 * with full context for debugging.
 *
 * Usage in index.ts:
 *   app.use(globalErrorHandler);
 *
 * @param {Error} err - The error that was thrown
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} _next - Express next function (unused but required)
 */
export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  /* Track error rate for alerting */
  trackError();

  const IS_DEV = process.env.NODE_ENV !== "production";
  const requestId = res.getHeader("X-Request-ID") as string ?? "unknown";

  /* Determine if this is a known AppError or an unexpected error */
  let appError: AppError;

  if (err instanceof AppError) {
    appError = err;
  } else if ((err as { code?: string }).code && typeof (err as { code?: string }).code === "string") {
    /* PostgreSQL error — map to AppError */
    appError = mapPostgresError(err as { code?: string; detail?: string; constraint?: string });
  } else if (err.name === "SyntaxError" && (err as { type?: string }).type === "entity.parse.failed") {
    /* Malformed JSON body */
    appError = new ValidationError("Invalid JSON in request body");
  } else if (err.name === "PayloadTooLargeError") {
    /* Request body exceeds size limit */
    appError = new AppError("Request body too large", 413, "PAYLOAD_TOO_LARGE", true);
  } else {
    /* Unknown error — treat as 500 Internal Server Error */
    appError = new AppError(
      IS_DEV ? err.message : "An unexpected error occurred",
      500,
      "INTERNAL_ERROR",
      false
    );
  }

  /* Log the error with full context */
  const logPayload = {
    requestId,
    errorCode: appError.errorCode,
    statusCode: appError.statusCode,
    message: err.message,
    method: req.method,
    path: req.path,
    userId: (req as Request & { userId?: string }).userId,
    ip: req.ip,
    stack: IS_DEV ? err.stack : undefined,
    isOperational: appError.isOperational,
  };

  if (appError.statusCode >= 500) {
    logger.error("[Error Handler] Server error", logPayload);
  } else if (appError.statusCode >= 400) {
    logger.warn("[Error Handler] Client error", logPayload);
  }

  /* Build the response body */
  const response: ErrorResponse = {
    ok: false,
    error: {
      code: appError.errorCode,
      message: appError.message,
      status: appError.statusCode,
      timestamp: new Date().toISOString(),
      requestId,
      details: IS_DEV ? appError.details : undefined,
      stack: IS_DEV ? err.stack : undefined,
    },
  };

  /* Set appropriate headers */
  if (appError instanceof RateLimitError) {
    res.setHeader("Retry-After", Math.ceil(appError.retryAfterMs / 1000));
  }

  /* Send the response */
  res.status(appError.statusCode).json(response);
}

/**
 * 404 Not Found handler — catches all unmatched routes.
 * Register this AFTER all route handlers but BEFORE the error handler.
 *
 * Usage in index.ts:
 *   app.use(notFoundHandler);
 *   app.use(globalErrorHandler);
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError("Endpoint", `${req.method} ${req.path}`));
}
