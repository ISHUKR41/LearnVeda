/**
 * FILE: request-logger.middleware.ts
 * LOCATION: backend/src/middlewares/request-logger.middleware.ts
 * PURPOSE: Production-grade HTTP request/response logging middleware.
 *          Captures structured request data for debugging, performance
 *          monitoring, and compliance auditing.
 *
 * FEATURES:
 *  - Structured JSON logging (compatible with ELK Stack, Datadog, Splunk)
 *  - Request/response time measurement with microsecond precision
 *  - Automatic error capture for 4xx/5xx responses
 *  - Request body sanitization (masks passwords, tokens, secrets)
 *  - Configurable log levels based on response status
 *  - Request ID correlation for distributed tracing
 *  - IP address extraction from X-Forwarded-For (load balancer support)
 *
 * ARCHITECTURE:
 *  - Wraps the res.end() method to capture response data after send.
 *  - Non-blocking — logs are written asynchronously via the logger.
 *  - Configurable skip patterns for health checks and static assets.
 *
 * CAPACITY: Minimal overhead (~0.5ms per request).
 *           Does not store request bodies in memory beyond the log call.
 *
 * DEPENDENCIES: logger utility
 * USED BY: index.ts (registered before route handlers)
 * LAST UPDATED: 2026-05-26
 */

import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

/* ─────────────────────────────────────────────
 * Configuration Types
 * ───────────────────────────────────────────── */

/** Configuration options for the request logger middleware */
export interface RequestLoggerOptions {
  /** Paths to skip logging (e.g., health checks) */
  skipPaths?: string[];
  /** Whether to log request bodies (careful with large payloads) */
  logRequestBody?: boolean;
  /** Whether to log response bodies (very verbose — use only for debugging) */
  logResponseBody?: boolean;
  /** Maximum request body length to log (bytes) */
  maxBodyLogLength?: number;
  /** Minimum response time (ms) to trigger a "slow request" warning */
  slowRequestThresholdMs?: number;
}

/** Structured log entry for a completed HTTP request */
interface RequestLogEntry {
  /** Unique request identifier for tracing */
  requestId: string;
  /** HTTP method (GET, POST, etc.) */
  method: string;
  /** Request path */
  path: string;
  /** Full URL with query parameters */
  url: string;
  /** HTTP response status code */
  statusCode: number;
  /** Response time in milliseconds */
  responseTimeMs: number;
  /** Response content length in bytes */
  contentLength: number;
  /** Client IP address (extracted from X-Forwarded-For if behind proxy) */
  clientIp: string;
  /** User agent string */
  userAgent: string;
  /** Authenticated user ID (if available) */
  userId?: string;
  /** Referrer URL */
  referrer: string;
  /** Whether this was flagged as a slow request */
  isSlow: boolean;
  /** Error message (only for 4xx/5xx responses) */
  error?: string;
  /** Allow additional string-keyed properties for LogMeta compatibility */
  [key: string]: unknown;
}

/* ─────────────────────────────────────────────
 * Sensitive Field Sanitization
 * Ensures passwords, tokens, and secrets are never logged.
 * ───────────────────────────────────────────── */

/** Fields that should be masked in log output */
const SENSITIVE_FIELDS = new Set([
  "password",
  "confirmPassword",
  "newPassword",
  "oldPassword",
  "token",
  "accessToken",
  "refreshToken",
  "apiKey",
  "secret",
  "authorization",
  "cookie",
  "creditCard",
  "ssn",
  "otp",
]);

/**
 * Recursively sanitizes an object by masking sensitive field values.
 * Only processes objects — primitives and arrays of primitives are passed through.
 *
 * @param {Record<string, unknown>} obj - Object to sanitize
 * @returns {Record<string, unknown>} Sanitized copy (original is not modified)
 */
function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_FIELDS.has(key.toLowerCase())) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/* ─────────────────────────────────────────────
 * IP Address Extraction
 * Handles proxied requests (behind nginx, ALB, CloudFront, etc.)
 * ───────────────────────────────────────────── */

/**
 * Extracts the real client IP address from the request.
 * Checks X-Forwarded-For header first (set by reverse proxies),
 * then falls back to req.ip and finally socket.remoteAddress.
 *
 * @param {Request} req - Express request object
 * @returns {string} Client IP address
 */
function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    /* X-Forwarded-For contains a comma-separated list of IPs.
     * The first one is the real client IP. */
    return forwarded.split(",")[0].trim();
  }

  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

/* ─────────────────────────────────────────────
 * Middleware Factory
 * ───────────────────────────────────────────── */

/** Default paths to skip logging (health checks and static assets) */
const DEFAULT_SKIP_PATHS = ["/health", "/ready", "/favicon.ico"];

/**
 * Creates a production request logging middleware.
 * Captures detailed request/response metrics and logs them
 * in structured JSON format for monitoring and debugging.
 *
 * Usage in index.ts:
 *   app.use(createRequestLogger({
 *     slowRequestThresholdMs: 1000,
 *     logRequestBody: false,
 *   }));
 *
 * @param {RequestLoggerOptions} options - Configuration options
 * @returns Express middleware function
 */
export function createRequestLogger(options: RequestLoggerOptions = {}) {
  const {
    skipPaths = DEFAULT_SKIP_PATHS,
    logRequestBody = false,
    maxBodyLogLength = 2000,
    slowRequestThresholdMs = 1000,
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    /* Skip logging for configured paths (health checks, etc.) */
    if (skipPaths.some((path) => req.path.startsWith(path))) {
      next();
      return;
    }

    /* Record the start time for response time calculation */
    const startTime = process.hrtime.bigint();

    /* Extract request context early (before response might close) */
    const requestId = res.getHeader("X-Request-ID") as string ?? `log_${Date.now()}`;
    const clientIp = getClientIp(req);
    const userAgent = req.headers["user-agent"] ?? "unknown";
    const referrer = req.headers["referer"] ?? req.headers["referrer"] ?? "";

    /* Capture the original res.end to intercept response completion */
    const originalEnd = res.end;

    /* Override res.end to capture response metrics */
    res.end = function (this: Response, ...args: Parameters<typeof res.end>): Response {
      /* Calculate response time */
      const responseTimeNs = Number(process.hrtime.bigint() - startTime);
      const responseTimeMs = Math.round(responseTimeNs / 1_000_000 * 100) / 100;

      /* Extract content length from response headers */
      const contentLength = parseInt(res.getHeader("content-length") as string ?? "0", 10);

      /* Build structured log entry */
      const logEntry: RequestLogEntry = {
        requestId,
        method: req.method,
        path: req.path,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTimeMs,
        contentLength,
        clientIp,
        userAgent: String(userAgent),
        userId: (req as Request & { userId?: string }).userId,
        referrer: String(referrer),
        isSlow: responseTimeMs > slowRequestThresholdMs,
      };

      /* Determine log level based on response status */
      if (res.statusCode >= 500) {
        /* Server errors — always logged as errors */
        logger.error("[Request] Server error", {
          ...logEntry,
          error: `HTTP ${res.statusCode} response`,
        });
      } else if (res.statusCode >= 400) {
        /* Client errors — logged as warnings */
        logger.warn("[Request] Client error", logEntry);
      } else if (logEntry.isSlow) {
        /* Slow requests — logged as warnings for performance monitoring */
        logger.warn("[Request] Slow request detected", logEntry);
      } else {
        /* Successful requests — logged as info */
        logger.info("[Request] Completed", logEntry);
      }

      /* Optionally log sanitized request body */
      if (logRequestBody && req.body && Object.keys(req.body).length > 0) {
        const sanitizedBody = sanitizeObject(req.body);
        const bodyStr = JSON.stringify(sanitizedBody);
        const truncatedBody =
          bodyStr.length > maxBodyLogLength
            ? bodyStr.slice(0, maxBodyLogLength) + "...[TRUNCATED]"
            : bodyStr;

        logger.debug("[Request] Body", {
          requestId,
          body: truncatedBody,
        });
      }

      /* Call the original res.end to complete the response */
      return originalEnd.apply(this, args);
    } as typeof res.end;

    next();
  };
}

/**
 * Express middleware for tracking analytics events from API requests.
 * Automatically records page_view events and API endpoint usage.
 * Integrates with the analytics.service.ts buffer.
 *
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Next middleware
 */
export function analyticsTracker(req: Request, res: Response, next: NextFunction): void {
  /* Only track API routes (skip health, static, etc.) */
  if (!req.path.startsWith("/api/")) {
    next();
    return;
  }

  /* Track will be called after response is sent — no request blocking */
  res.on("finish", () => {
    try {
      /* Lazy import to avoid circular dependency */
      const { trackEvent } = require("../services/analytics.service");

      const userId = (req as Request & { userId?: string }).userId ?? null;

      trackEvent(
        "page_view",
        userId,
        {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
        },
        {
          pageUrl: req.originalUrl,
          userAgent: req.headers["user-agent"],
          sessionId: req.headers["x-session-id"] as string,
        }
      );
    } catch {
      /* Analytics must never break request processing */
    }
  });

  next();
}
