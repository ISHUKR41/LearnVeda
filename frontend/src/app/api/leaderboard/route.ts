/**
 * FILE: route.ts
 * LOCATION: src/app/api/leaderboard/route.ts
 * PURPOSE: Public leaderboard endpoint backed by the active repository adapter.
 *          It keeps ranking logic on the server so the client does not ship
 *          mock users or duplicate database ordering rules.
 * USED BY: src/app/leaderboard/LeaderboardClient.tsx
 * DEPENDENCIES: repository adapter, current-user helper, API response helpers
 * LAST UPDATED: 2026-05-16
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { getPlatformRepository } from "@/lib/server/repositories/get-platform-repository";
import { apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";
import type { LearningTrack } from "@/types/auth";

export const runtime = "nodejs";

const VALID_SCOPES = new Set(["global", "class-9", "class-10", "class-11", "class-12", "engineering"]);

/** Converts a query string into the repository scope, falling back safely. */
function normalizeScope(scope: string | null): "global" | LearningTrack {
  if (!scope || !VALID_SCOPES.has(scope)) {
    return "global";
  }

  return scope as "global" | LearningTrack;
}

/** Returns ranked users for the requested public leaderboard scope. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scope = normalizeScope(searchParams.get("scope"));
  const currentUser = await getAuthenticatedUser(request);
  const repository = getPlatformRepository();
  const entries = await repository.leaderboard.listTopUsers(scope, currentUser?.id);

  return apiSuccess(
    {
      scope,
      entries,
      currentUserId: currentUser?.id ?? null,
    },
    { headers: NO_STORE_HEADERS },
  );
}
