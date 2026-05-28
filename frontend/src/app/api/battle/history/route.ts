/**
 * FILE: route.ts
 * LOCATION: src/app/api/battle/history/route.ts
 * PURPOSE: Returns recent battle history and summary stats for the signed-in
 *          student. This powers the battle lobby sidebar.
 * USED BY: src/app/battle/BattleClient.tsx
 * DEPENDENCIES: current-user, postgres pool, api-response helpers
 * LAST UPDATED: 2026-05-28
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { getPostgresPool } from "@/lib/server/database/postgres";
import { apiError, apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

interface BattleHistoryRow {
  match_id: string;
  opponent_name: string | null;
  category: string;
  result: "win" | "loss" | "draw" | "abandoned";
  user_score: number;
  opponent_score: number;
  xp_earned: number;
  played_at: string;
}

interface BattleStatsRow {
  total_battles: string;
  wins: string;
  losses: string;
  total_xp: string;
}

function formatCategoryLabel(category: string): string {
  if (!category) {
    return "General";
  }

  return category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/** Returns the authenticated user's recent battle history. */
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError(
      "UNAUTHENTICATED",
      "Please sign in to view your battle history.",
      401,
      undefined,
      NO_STORE_HEADERS,
    );
  }

  const { searchParams } = new URL(request.url);
  const limitParam = parseInt(searchParams.get("limit") ?? "5", 10);
  const limit = Math.min(Math.max(limitParam, 1), 20);

  try {
    const pool = getPostgresPool();

    const [statsResult, historyResult] = await Promise.all([
      pool.query<BattleStatsRow>(
        `SELECT
           COUNT(*)::text AS total_battles,
           COUNT(*) FILTER (WHERE result = 'win')::text AS wins,
           COUNT(*) FILTER (WHERE result = 'loss')::text AS losses,
           COALESCE(SUM(xp_earned), 0)::text AS total_xp
         FROM eduquest_battle_history
         WHERE user_id = $1`,
        [user.id],
      ),
      pool.query<BattleHistoryRow>(
        `SELECT
           match_id,
           opponent_name,
           category,
           result,
           user_score,
           opponent_score,
           xp_earned,
           played_at::text
         FROM eduquest_battle_history
         WHERE user_id = $1
         ORDER BY played_at DESC
         LIMIT $2`,
        [user.id, limit],
      ),
    ]);

    const statsRow = statsResult.rows[0];
    const stats = {
      totalBattles: Number(statsRow?.total_battles ?? 0),
      wins: Number(statsRow?.wins ?? 0),
      losses: Number(statsRow?.losses ?? 0),
      totalXPFromBattles: Number(statsRow?.total_xp ?? 0),
    };

    const matches = historyResult.rows.map((row) => ({
      matchId: row.match_id,
      subjectName: formatCategoryLabel(row.category),
      myScore: row.user_score,
      opponentScore: row.opponent_score,
      opponentName: row.opponent_name ?? "Opponent",
      iWon: row.result === "win",
      xpEarned: row.xp_earned,
      startTime: row.played_at,
    }));

    return apiSuccess(
      { stats, matches },
      { headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    console.error("[GET /api/battle/history] DB error:", error);

    return apiSuccess(
      {
        stats: { totalBattles: 0, wins: 0, losses: 0, totalXPFromBattles: 0 },
        matches: [],
      },
      { headers: NO_STORE_HEADERS },
    );
  }
}
