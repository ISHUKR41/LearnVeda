/**
 * FILE: route.ts
 * LOCATION: src/app/api/achievements/route.ts
 * PURPOSE: Returns achievement definitions with earned status for a user.
 *          Achievements are hardcoded product constants checked against real
 *          user data (XP, level, streak) — no separate DB tables required.
 *
 * ENDPOINT:
 *   GET /api/achievements?userId=<id>
 *
 * RESPONSE:
 *   {
 *     ok: true,
 *     data: {
 *       achievements: AchievementDTO[],
 *       summary: { total, earned, percent }
 *     }
 *   }
 *
 * USED BY: DashboardClient.tsx (AchievementsCard)
 * LAST UPDATED: 2026-05-31
 */

import { type NextRequest, NextResponse } from "next/server";
import { getPostgresPool } from "@/lib/server/database/postgres";

export const runtime = "nodejs";

/* ─────────────────────────────────────────────
 * Achievement definitions — hardcoded product constants.
 * Each has a threshold type and value used to check if the user has earned it.
 * ───────────────────────────────────────────── */

interface AchievementDef {
  id:             string;
  slug:           string;
  name:           string;
  description:    string;
  category:       string;
  badgeColor:     string;
  badgeIcon:      string;
  xpReward:       number;
  thresholdType:  "xp" | "level" | "streak" | "chapters" | "always";
  thresholdValue: number;
}

const ACHIEVEMENT_DEFS: AchievementDef[] = [
  /* ── First steps ──────────────────────────────────────────── */
  {
    id: "first-login", slug: "first-login",
    name: "First Login", description: "Signed up and started your learning journey.",
    category: "milestone", badgeColor: "#10B981", badgeIcon: "🎉",
    xpReward: 50, thresholdType: "always", thresholdValue: 0,
  },
  {
    id: "first-xp", slug: "first-xp",
    name: "First XP", description: "Earned your first experience points.",
    category: "milestone", badgeColor: "#F59E0B", badgeIcon: "⚡",
    xpReward: 25, thresholdType: "xp", thresholdValue: 10,
  },
  /* ── XP milestones ────────────────────────────────────────── */
  {
    id: "xp-100", slug: "xp-100",
    name: "Century", description: "Reached 100 XP — you're off to a great start!",
    category: "xp", badgeColor: "#3B82F6", badgeIcon: "💯",
    xpReward: 50, thresholdType: "xp", thresholdValue: 100,
  },
  {
    id: "xp-500", slug: "xp-500",
    name: "Rising Star", description: "Accumulated 500 XP through consistent study.",
    category: "xp", badgeColor: "#8B5CF6", badgeIcon: "🌟",
    xpReward: 100, thresholdType: "xp", thresholdValue: 500,
  },
  {
    id: "xp-1000", slug: "xp-1000",
    name: "Knowledge Seeker", description: "Crossed 1,000 XP — a true learner!",
    category: "xp", badgeColor: "#EC4899", badgeIcon: "🏅",
    xpReward: 150, thresholdType: "xp", thresholdValue: 1000,
  },
  {
    id: "xp-2500", slug: "xp-2500",
    name: "Scholar Elite", description: "2,500 XP — placing you in the top tier.",
    category: "xp", badgeColor: "#F97316", badgeIcon: "💎",
    xpReward: 250, thresholdType: "xp", thresholdValue: 2500,
  },
  /* ── Level milestones ─────────────────────────────────────── */
  {
    id: "level-3", slug: "level-3",
    name: "Practitioner", description: "Reached Level 3 — Practitioner status.",
    category: "level", badgeColor: "#10B981", badgeIcon: "⭐",
    xpReward: 75, thresholdType: "level", thresholdValue: 3,
  },
  {
    id: "level-5", slug: "level-5",
    name: "Achiever", description: "Reached Level 5 — you're an Achiever!",
    category: "level", badgeColor: "#F59E0B", badgeIcon: "🏆",
    xpReward: 150, thresholdType: "level", thresholdValue: 5,
  },
  {
    id: "level-7", slug: "level-7",
    name: "Master", description: "Reached Level 7 — the rank of Master.",
    category: "level", badgeColor: "#EF4444", badgeIcon: "🔥",
    xpReward: 300, thresholdType: "level", thresholdValue: 7,
  },
  /* ── Streak achievements ──────────────────────────────────── */
  {
    id: "streak-3", slug: "streak-3",
    name: "Consistent", description: "Maintained a 3-day study streak.",
    category: "streak", badgeColor: "#F97316", badgeIcon: "🔥",
    xpReward: 50, thresholdType: "streak", thresholdValue: 3,
  },
  {
    id: "streak-7", slug: "streak-7",
    name: "Week Warrior", description: "Studied 7 days in a row — unstoppable!",
    category: "streak", badgeColor: "#EF4444", badgeIcon: "📅",
    xpReward: 100, thresholdType: "streak", thresholdValue: 7,
  },
  {
    id: "streak-30", slug: "streak-30",
    name: "Iron Will", description: "30-day streak — your dedication is legendary.",
    category: "streak", badgeColor: "#DC2626", badgeIcon: "⚔️",
    xpReward: 500, thresholdType: "streak", thresholdValue: 30,
  },
];

/* ─────────────────────────────────────────────
 * GET /api/achievements?userId=<id>
 * ───────────────────────────────────────────── */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || null;

  /* Fetch the user's real stats to determine which achievements are earned */
  let userXp    = 0;
  let userLevel = 1;
  let userStreak = 0;

  if (userId) {
    try {
      const pool = getPostgresPool();
      const userResult = await pool.query<{ xp: number | null; level: number | null; streak: number | null }>(
        `SELECT xp, level, streak FROM eduquest_users WHERE id = $1`,
        [userId],
      );
      const row = userResult.rows[0];
      if (row) {
        userXp     = Number(row.xp     ?? 0);
        userLevel  = Number(row.level  ?? 1);
        userStreak = Number(row.streak ?? 0);
      }
    } catch {
      /* DB error — leave stats at default 0. Achievements will all be locked. */
    }
  }

  /* Evaluate each achievement against the user's stats */
  const achievements = ACHIEVEMENT_DEFS.map(def => {
    let earned = false;
    if (userId) {
      switch (def.thresholdType) {
        case "always":   earned = true;                           break;
        case "xp":       earned = userXp     >= def.thresholdValue; break;
        case "level":    earned = userLevel  >= def.thresholdValue; break;
        case "streak":   earned = userStreak >= def.thresholdValue; break;
        case "chapters": earned = false; /* future: check chapter completions */ break;
      }
    }
    return {
      id:             def.id,
      slug:           def.slug,
      name:           def.name,
      description:    def.description,
      category:       def.category,
      badgeColor:     def.badgeColor,
      badgeIcon:      def.badgeIcon,
      xpReward:       def.xpReward,
      thresholdType:  def.thresholdType,
      thresholdValue: def.thresholdValue,
      earned,
      awardedAt:      earned ? new Date().toISOString() : null,
    };
  });

  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount  = achievements.length;

  const response = NextResponse.json({
    ok: true,
    data: {
      achievements,
      summary: {
        total:   totalCount,
        earned:  earnedCount,
        percent: totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0,
      },
    },
  });

  /* User-specific — never cache at CDN */
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
