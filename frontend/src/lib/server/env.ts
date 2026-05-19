/**
 * FILE: env.ts
 * LOCATION: src/lib/server/env.ts
 * PURPOSE: Centralized environment access for backend-only code. Values are
 *          read lazily inside functions so Next.js builds do not fail while
 *          prerendering modules before runtime secrets are available.
 * USED BY: session signing helpers, production data guards, backend adapters
 * LAST UPDATED: 2026-05-19
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

/**
 * Returns true only when the app should behave like the public production
 * deployment, not merely when a local build command sets NODE_ENV=production.
 *
 * Next.js production builds often run before runtime services are attached.
 * This helper therefore requires a PostgreSQL-backed runtime signal before
 * disabling local fallback data. That keeps CI/builds practical while still
 * preventing fake data from leaking into a real deployed environment.
 */
export function isStrictProductionDataMode(): boolean {
  if (process.env.EDUQUEST_STRICT_DATA_MODE === "true") {
    return true;
  }

  return Boolean(
    process.env.NODE_ENV === "production"
    && process.env.EDUQUEST_PERSISTENCE_ADAPTER === "postgres"
    && process.env.DATABASE_URL
    && process.env.EDUQUEST_ALLOW_STATIC_FALLBACKS !== "true",
  );
}

/**
 * Returns whether static local fallback catalogs may be shown when the database
 * is not available. Development can use fallback data for fast previews, but
 * strict production must use PostgreSQL as the source of truth.
 */
export function shouldAllowStaticFallbackData(): boolean {
  return !isStrictProductionDataMode() || process.env.EDUQUEST_ALLOW_STATIC_FALLBACKS === "true";
}

/**
 * Blocks demo seed data from being inserted into a real production database.
 * The curriculum itself is versioned in SQL migrations; this seed script is
 * only for local previews and staging rehearsals that explicitly opt in.
 */
export function assertDemoSeedIsAllowed(): void {
  const explicitlyAllowed = process.env.EDUQUEST_ALLOW_DEMO_SEED === "true";

  if ((process.env.NODE_ENV === "production" || isStrictProductionDataMode()) && !explicitlyAllowed) {
    throw new Error(
      "Demo seed data is blocked for production. Set EDUQUEST_ALLOW_DEMO_SEED=true only for an approved staging/demo database.",
    );
  }
}
