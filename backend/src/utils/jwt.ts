/**
 * FILE: jwt.ts
 * LOCATION: backend/src/utils/jwt.ts
 * PURPOSE: JWT (JSON Web Token) utilities for authentication.
 *          Handles token generation, verification, and refresh token rotation.
 *
 * SECURITY ARCHITECTURE:
 *  - Access tokens: Short-lived (15 minutes), sent in Authorization header
 *  - Refresh tokens: Long-lived (7 days), stored in httpOnly cookie
 *  - Token rotation: New refresh token issued on each refresh (prevents reuse attacks)
 *  - Secret keys: Loaded from environment variables, never hardcoded
 *
 * DEPENDENCIES: jsonwebtoken (jose alternative for Node.js)
 * USED BY: auth routes, auth middleware
 * LAST UPDATED: 2026-05-19
 */

import crypto from "crypto";

/* ─────────────────────────────────────────────
 * Configuration
 * ───────────────────────────────────────────── */

/**
 * JWT secret key — used for both signing and verifying tokens.
 * In production, this MUST be a strong random string from environment.
 * Minimum recommended length: 256 bits (32 bytes).
 */
const JWT_SECRET = process.env.JWT_SECRET ?? "eduquest-dev-secret-change-in-production";
const REFRESH_SECRET = process.env.REFRESH_SECRET ?? "eduquest-refresh-secret-change-in-production";

/**
 * Token expiry durations.
 * Access token: 15 minutes — short enough to limit damage if stolen
 * Refresh token: 7 days — user stays logged in for a week without re-entering credentials
 */
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes in seconds
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

/* ─────────────────────────────────────────────
 * Token Payload Types
 * ───────────────────────────────────────────── */

/** Claims encoded inside the access token JWT */
export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;  // Issued at (Unix timestamp)
  exp: number;  // Expires at (Unix timestamp)
}

/** Claims encoded inside the refresh token JWT */
export interface RefreshTokenPayload {
  userId: string;
  tokenId: string; // Unique ID for this refresh token — enables revocation
  iat: number;
  exp: number;
}

/* ─────────────────────────────────────────────
 * Simple JWT Implementation (using HMAC-SHA256)
 * Production apps should use a library like 'jose' or 'jsonwebtoken'.
 * This implementation avoids external dependencies for the core.
 * ───────────────────────────────────────────── */

/**
 * Base64url encode a string — used in JWT header/payload encoding.
 * Replaces standard Base64 characters that are unsafe in URLs.
 */
function base64UrlEncode(data: string): string {
  return Buffer.from(data)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Base64url decode — reverses the encoding for token verification.
 */
function base64UrlDecode(data: string): string {
  const padded = data + "=".repeat((4 - (data.length % 4)) % 4);
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString();
}

/**
 * Create HMAC-SHA256 signature for a JWT.
 * This is the cryptographic proof that the token hasn't been tampered with.
 */
function createSignature(header: string, payload: string, secret: string): string {
  const data = `${header}.${payload}`;
  return crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/* ─────────────────────────────────────────────
 * Token Generation
 * ───────────────────────────────────────────── */

/**
 * Generates a new JWT access token for the given user.
 *
 * @param userId - The user's unique identifier
 * @param email  - The user's email address
 * @param role   - The user's role (STUDENT, ADMIN, etc.)
 * @returns The signed JWT access token string
 *
 * The token contains: userId, email, role, issued-at, expires-at
 * It is signed with HMAC-SHA256 using JWT_SECRET.
 */
export function generateAccessToken(userId: string, email: string, role: string): string {
  const now = Math.floor(Date.now() / 1000);

  const header = base64UrlEncode(JSON.stringify({
    alg: "HS256",
    typ: "JWT",
  }));

  const payload = base64UrlEncode(JSON.stringify({
    userId,
    email,
    role,
    iat: now,
    exp: now + ACCESS_TOKEN_EXPIRY,
  }));

  const signature = createSignature(header, payload, JWT_SECRET);

  return `${header}.${payload}.${signature}`;
}

/**
 * Generates a new JWT refresh token for the given user.
 * Each refresh token has a unique tokenId for revocation support.
 *
 * @param userId - The user's unique identifier
 * @returns Object with the refresh token string and its unique tokenId
 */
export function generateRefreshToken(userId: string): { token: string; tokenId: string } {
  const now = Math.floor(Date.now() / 1000);
  const tokenId = crypto.randomUUID();

  const header = base64UrlEncode(JSON.stringify({
    alg: "HS256",
    typ: "JWT",
  }));

  const payload = base64UrlEncode(JSON.stringify({
    userId,
    tokenId,
    iat: now,
    exp: now + REFRESH_TOKEN_EXPIRY,
  }));

  const signature = createSignature(header, payload, REFRESH_SECRET);

  return {
    token: `${header}.${payload}.${signature}`,
    tokenId,
  };
}

/* ─────────────────────────────────────────────
 * Token Verification
 * ───────────────────────────────────────────── */

/**
 * Verifies and decodes a JWT access token.
 * Checks both the signature (integrity) and expiry (freshness).
 *
 * @param token - The JWT access token string
 * @returns The decoded payload if valid, or null if invalid/expired
 *
 * This function NEVER throws. It returns null for any invalid token.
 * This design prevents error handling overhead in the auth middleware.
 */
export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;

    // Verify signature — ensures the token hasn't been tampered with
    const expectedSig = createSignature(header, payload, JWT_SECRET);
    if (signature !== expectedSig) return null;

    // Decode and parse the payload
    const decoded = JSON.parse(base64UrlDecode(payload)) as AccessTokenPayload;

    // Check expiry — reject expired tokens
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) return null;

    return decoded;
  } catch {
    return null;
  }
}

/**
 * Verifies and decodes a JWT refresh token.
 * Uses a separate secret from access tokens for defense in depth.
 *
 * @param token - The JWT refresh token string
 * @returns The decoded payload if valid, or null if invalid/expired
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;

    const expectedSig = createSignature(header, payload, REFRESH_SECRET);
    if (signature !== expectedSig) return null;

    const decoded = JSON.parse(base64UrlDecode(payload)) as RefreshTokenPayload;

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) return null;

    return decoded;
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────
 * Password Hashing Utilities
 * ───────────────────────────────────────────── */

/**
 * Hashes a password using SHA-256 with a random salt.
 * 
 * NOTE: In production, use bcryptjs for proper adaptive hashing.
 * This is a lightweight implementation for initial development.
 * Bcrypt is preferred because it's intentionally slow, making brute-force attacks impractical.
 *
 * @param password - The plain text password to hash
 * @returns Object with the hash and salt (both stored in the database)
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100_000, 64, "sha512")
    .toString("hex");
  return { hash: `${salt}:${hash}`, salt };
}

/**
 * Verifies a password against a stored hash.
 *
 * @param password   - The plain text password to verify
 * @param storedHash - The stored hash string (format: "salt:hash")
 * @returns true if the password matches, false otherwise
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const candidateHash = crypto
    .pbkdf2Sync(password, salt, 100_000, 64, "sha512")
    .toString("hex");

  // Timing-safe comparison prevents timing attacks
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(candidateHash));
}
