/**
 * FILE: auth.middleware.ts
 * LOCATION: backend/src/middlewares/auth.middleware.ts
 * PURPOSE: Express middleware for authenticating API requests using JWT tokens.
 *          Validates the Bearer token from the Authorization header, extracts
 *          the user identity, and attaches it to the request object.
 *
 * USAGE: Apply to any route that requires authentication:
 *        router.get("/protected", authMiddleware, handler);
 *
 * FLOW:
 *  1. Extract Bearer token from Authorization header
 *  2. Verify token signature and expiry using JWT utils
 *  3. Attach user payload to req.user
 *  4. Call next() to proceed to the route handler
 *  5. If invalid: return 401 Unauthorized JSON response
 *
 * DEPENDENCIES: ../utils/jwt
 * USED BY: Protected API routes (progress, battle, community write ops, settings)
 * LAST UPDATED: 2026-05-19
 */

import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, AccessTokenPayload } from "../utils/jwt";

/* ─────────────────────────────────────────────
 * Extend Express Request type to include user payload
 * This allows route handlers to access req.user safely
 * ───────────────────────────────────────────── */
declare global {
  namespace Express {
    interface Request {
      /** Authenticated user payload — only present after authMiddleware */
      user?: AccessTokenPayload;
    }
  }
}

/* ─────────────────────────────────────────────
 * Authentication Middleware
 * ───────────────────────────────────────────── */

/**
 * Middleware that verifies JWT access tokens on protected routes.
 *
 * Expected header format: Authorization: Bearer <token>
 *
 * On success: Attaches decoded user payload to req.user and calls next()
 * On failure: Returns 401 with a descriptive error message
 *
 * This middleware does NOT check roles — use roleMiddleware for that.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  /* Step 1: Extract the Authorization header */
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      ok: false,
      error: {
        code: "NO_AUTH_HEADER",
        message: "Authentication required. Please log in to access this resource.",
      },
    });
    return;
  }

  /* Step 2: Validate the Bearer prefix */
  if (!authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      ok: false,
      error: {
        code: "INVALID_AUTH_FORMAT",
        message: "Invalid authorization format. Expected: Bearer <token>",
      },
    });
    return;
  }

  /* Step 3: Extract the token string */
  const token = authHeader.slice(7);

  if (!token || token.length < 10) {
    res.status(401).json({
      ok: false,
      error: {
        code: "EMPTY_TOKEN",
        message: "Authentication token is missing or malformed.",
      },
    });
    return;
  }

  /* Step 4: Verify the token (checks signature + expiry) */
  const payload = verifyAccessToken(token);

  if (!payload) {
    res.status(401).json({
      ok: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Your session has expired or the token is invalid. Please log in again.",
      },
    });
    return;
  }

  /* Step 5: Attach the verified user payload to the request */
  req.user = payload;

  /* Step 6: Continue to the next middleware or route handler */
  next();
}

/* ─────────────────────────────────────────────
 * Optional Auth Middleware
 * Same as authMiddleware but does NOT reject unauthenticated requests.
 * Useful for routes that have different behavior for logged-in vs anonymous users.
 * ───────────────────────────────────────────── */

/**
 * Optional authentication — extracts user info if a token is present,
 * but allows the request to proceed even without authentication.
 *
 * Use case: Community post listing shows "your post" badges for logged-in users
 *           but still works for anonymous browsing.
 */
export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  // Always proceed — no 401 errors from optional auth
  next();
}

/* ─────────────────────────────────────────────
 * Role-Based Access Control Middleware
 * Checks if the authenticated user has one of the required roles.
 * Must be used AFTER authMiddleware.
 * ───────────────────────────────────────────── */

/**
 * Creates a middleware that checks if the user's role matches one of the allowed roles.
 *
 * @param allowedRoles - Array of role strings that can access the route
 * @returns Express middleware function
 *
 * Usage:
 *   router.post("/admin/users", authMiddleware, roleMiddleware(["ADMIN"]), handler);
 *   router.put("/content", authMiddleware, roleMiddleware(["ADMIN", "TEACHER"]), handler);
 */
export function roleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        ok: false,
        error: {
          code: "NOT_AUTHENTICATED",
          message: "Authentication required before role check.",
        },
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        ok: false,
        error: {
          code: "INSUFFICIENT_PERMISSIONS",
          message: `This action requires one of these roles: ${allowedRoles.join(", ")}`,
        },
      });
      return;
    }

    next();
  };
}

export default authMiddleware;
