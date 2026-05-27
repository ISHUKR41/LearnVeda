/**
 * FILE: auth.middleware.ts
 * LOCATION: backend/src/middlewares/auth.middleware.ts
 * PURPOSE: Express middleware for authenticating API requests. Supports both
 *          legacy local HS256 tokens and Clerk RS256 multi-tenant JWTs.
 *          Decodes tokens, verifies signature/expiry, and attaches user info to req.user.
 *
 * USAGE: Apply to any route that requires authentication:
 *        router.get("/protected", authMiddleware, handler);
 *
 * DEPENDENCIES: crypto, https, ../utils/jwt
 * LAST UPDATED: 2026-05-27
 */

import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import https from "https";
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

// In-memory cache for Clerk JWKS keys to achieve sub-millisecond response times
let jwksCache: Record<string, string> = {};
let lastFetchedJwks = 0;
const JWKS_CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache TTL

/**
 * Dynamically fetches and parses Clerk public JWKS keys.
 * Caches keys locally to prevent excessive round-trips.
 */
async function fetchClerkKeys(): Promise<Record<string, string>> {
  const now = Date.now();
  if (Object.keys(jwksCache).length > 0 && now - lastFetchedJwks < JWKS_CACHE_TTL) {
    return jwksCache;
  }

  const jwksUrl = process.env.CLERK_JWKS_URL || "https://accurate-serval-62.clerk.accounts.dev/.well-known/jwks.json";

  return new Promise((resolve, reject) => {
    https.get(jwksUrl, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const { keys } = JSON.parse(data) as { keys: Array<{ kid: string; x5c: string[] }> };
          const newCache: Record<string, string> = {};
          
          for (const key of keys) {
            if (key.kid && key.x5c?.[0]) {
              // Convert cert chain to PEM format
              const pem = `-----BEGIN CERTIFICATE-----\n${key.x5c[0].match(/.{1,64}/g)?.join("\n")}\n-----END CERTIFICATE-----`;
              newCache[key.kid] = pem;
            }
          }

          jwksCache = newCache;
          lastFetchedJwks = now;
          resolve(jwksCache);
        } catch (err) {
          reject(err);
        }
      });
    }).on("error", (err) => reject(err));
  });
}

/**
 * Cryptographically verifies a Clerk RS256 JWT using public certificates from JWKS.
 */
async function verifyClerkToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    
    // Decode header to find 'kid' (Key ID)
    const header = JSON.parse(Buffer.from(headerB64, "base64url").toString("utf8"));
    if (header.alg !== "RS256" || !header.kid) return null;

    // Fetch latest keys from Clerk JWKS
    const keys = await fetchClerkKeys();
    const publicKey = keys[header.kid];
    if (!publicKey) return null;

    // Cryptographically verify signature using Node's native crypto module
    const verifier = crypto.createVerify("SHA256");
    verifier.update(`${headerB64}.${payloadB64}`);
    
    const signature = Buffer.from(signatureB64, "base64url");
    const isValid = verifier.verify(publicKey, signature);
    if (!isValid) return null;

    // Decode and parse payload claims
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));

    // Verify expiration claim
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;

    // Map Clerk payload claims to EduQuest standard AccessTokenPayload
    return {
      userId: payload.sub,
      email: payload.email || "",
      role: payload.role || "STUDENT",
      iat: payload.iat || now,
      exp: payload.exp || (now + 900),
    };
  } catch (err) {
    console.error("[verifyClerkToken] Verification failed:", err);
    return null;
  }
}

/* ─────────────────────────────────────────────
 * Authentication Middleware
 * ───────────────────────────────────────────── */

/**
 * Middleware that verifies JWT access tokens on protected routes.
 * Handles both local HS256 tokens and Clerk RS256 tokens.
 */
export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
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

  // 1. Try local legacy token verification first (HS256)
  let payload = verifyAccessToken(token);

  if (!payload) {
    // 2. Fallback: Try Clerk JWT verification (RS256)
    payload = await verifyClerkToken(token);
  }

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

  req.user = payload;
  next();
}

/* ─────────────────────────────────────────────
 * Optional Auth Middleware
 * ───────────────────────────────────────────── */

/**
 * Optional authentication — extracts user info if a token is present,
 * but allows the request to proceed even without authentication.
 */
export async function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    
    // 1. Try HS256
    let payload = verifyAccessToken(token);
    if (!payload) {
      // 2. Try RS256
      payload = await verifyClerkToken(token);
    }

    if (payload) {
      req.user = payload;
    }
  }

  next();
}

/* ─────────────────────────────────────────────
 * Role-Based Access Control Middleware
 * ───────────────────────────────────────────── */

/**
 * Creates a middleware that checks if the user's role matches one of the allowed roles.
 * Must be used AFTER authMiddleware.
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

/**
 * Convenience wrapper for roleMiddleware that accepts variadic role arguments.
 */
export function requireRole(...roles: string[]) {
  return roleMiddleware(roles);
}

export default authMiddleware;
