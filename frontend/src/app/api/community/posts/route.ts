/**
 * FILE: route.ts
 * LOCATION: src/app/api/community/posts/route.ts
 * PURPOSE: Community posts API. GET returns persisted posts; POST lets signed-in
 *          users create a new discussion with validated title/body/tags.
 * USED BY: src/app/community/CommunityClient.tsx
 * DEPENDENCIES: current-user, platform-store, validation schemas, response helpers
 * LAST UPDATED: 2026-05-11
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { loadCommunityFeed, publishCommunityPost } from "@/lib/server/services/community-service";
import { checkRateLimit, getClientKey } from "@/lib/server/security/rate-limit";
import { apiError, apiSuccess, NO_STORE_HEADERS, readJsonBody } from "@/lib/server/utils/api-response";
import { communityPostSchema } from "@/lib/validation/auth";

export const runtime = "nodejs";

/** Returns all community posts in newest-first order. */
export async function GET() {
  const posts = await loadCommunityFeed();
  return apiSuccess({ posts }, { headers: NO_STORE_HEADERS });
}

/** Creates a new community post for the signed-in user. */
export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError("UNAUTHENTICATED", "Please sign in before posting in the community.", 401, undefined, NO_STORE_HEADERS);
  }

  const rateLimit = await checkRateLimit({
    key: getClientKey(request, `community:post:${user.id}`),
    limit: 6,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return apiError(
      "RATE_LIMITED",
      `Too many community posts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
      429,
      undefined,
      { ...NO_STORE_HEADERS, "Retry-After": rateLimit.retryAfterSeconds.toString() },
    );
  }

  const parsed = communityPostSchema.safeParse(await readJsonBody(request));

  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Please check your post fields.", 422, parsed.error.flatten());
  }

  const post = await publishCommunityPost(user, parsed.data);

  return apiSuccess({ post }, { status: 201, message: "Community post created.", headers: NO_STORE_HEADERS });
}
