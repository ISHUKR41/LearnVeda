/**
 * FILE: env.ts
 * LOCATION: src/lib/server/env.ts
 * PURPOSE: Centralized environment access for backend-only code. Values are
 *          read lazily inside functions so Next.js builds do not fail while
 *          prerendering modules before runtime secrets are available.
 * USED BY: session signing helpers and future backend adapters
 * LAST UPDATED: 2026-05-11
 */

/**
 * Returns the session signing secret.
 * Production must define EDUQUEST_SESSION_SECRET; development gets a stable
 * fallback so the local app can run immediately after cloning.
 */
export function getSessionSecret(): string {
  const secret = process.env.EDUQUEST_SESSION_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("Missing EDUQUEST_SESSION_SECRET in production.");
  }

  return secret ?? "eduquest-development-session-secret-change-before-production";
}
