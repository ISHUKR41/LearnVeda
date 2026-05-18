/**
 * FILE: route.ts
 * LOCATION: src/app/api/community/route.ts
 * PURPOSE: Compatibility wrapper for the Community API. The real community
 *          implementation lives in /api/community/posts, where input is
 *          validated and post authors are taken from the signed session.
 * USED BY: Legacy clients during the route migration
 * DEPENDENCIES: community service and shared API response helpers
 * LAST UPDATED: 2026-05-16
 */

import { loadCommunityFeed } from "@/lib/server/services/community-service";
import { apiError, apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/** Returns the same safe persisted feed as /api/community/posts. */
export async function GET() {
  const posts = await loadCommunityFeed();
  return apiSuccess({ posts }, { headers: NO_STORE_HEADERS });
}

/** Blocks the old client-supplied authorId flow because it can spoof users. */
export async function POST() {
  return apiError(
    "USE_COMMUNITY_POSTS",
    "Create community posts through /api/community/posts so the author comes from the secure session.",
    405,
    undefined,
    { ...NO_STORE_HEADERS, Allow: "GET" },
  );
}
