/**
 * FILE: pool.ts
 * LOCATION: src/lib/server/database/pool.ts
 * PURPOSE: Backward-compatible PostgreSQL pool export for API routes that need
 *          direct access to the shared `pg` Pool instance. The canonical
 *          connection logic stays in postgres.ts; this file only prevents route
 *          handlers from creating their own pools or importing an outdated path.
 * USED BY: src/app/api/search/route.ts and any route that still expects getPool()
 * DEPENDENCIES: postgres.ts
 * LAST UPDATED: 2026-05-18
 */

import { getPostgresPool } from "@/lib/server/database/postgres";

/**
 * Returns the process-wide PostgreSQL pool.
 *
 * Keep this as a thin alias so future code can migrate to getPostgresPool()
 * without breaking older route handlers during the transition.
 */
export function getPool() {
  return getPostgresPool();
}
