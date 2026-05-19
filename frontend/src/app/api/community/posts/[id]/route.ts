/**
 * FILE: route.ts
 * LOCATION: src/app/api/community/posts/[id]/route.ts
 * PURPOSE: Community post detail API. It returns one persisted discussion and
 *          optionally increments the view counter for full page reads.
 * USED BY: src/app/community/post/[id]/page.tsx and future mobile clients
 * DEPENDENCIES: community-service, shared API response helpers
 * LAST UPDATED: 2026-05-19
 */

import type { NextRequest } from "next/server";
import { loadCommunityPostById } from "@/lib/server/services/community-service";
import { apiError, apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** Returns one post by id; `?view=1` records that the post detail was opened. */
export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const shouldIncrementViews = request.nextUrl.searchParams.get("view") === "1";
  const post = await loadCommunityPostById(id, { incrementViews: shouldIncrementViews });

  if (!post) {
    return apiError("NOT_FOUND", "Community post not found.", 404, undefined, NO_STORE_HEADERS);
  }

  return apiSuccess({ post }, { headers: NO_STORE_HEADERS });
}
