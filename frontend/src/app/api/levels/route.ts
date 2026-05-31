/**
 * FILE: route.ts
 * LOCATION: src/app/api/levels/route.ts
 * PURPOSE: Level progression API — returns current and next level metadata for a
 *          given user level number. Level definitions are hardcoded in-memory
 *          (no DB table required — levels are product constants, not user data).
 *
 * ROUTES:
 *   GET /api/levels                  → All level definitions
 *   GET /api/levels?n=5              → Single level by number
 *   GET /api/levels?user_level=7     → Current + next level (for dashboard XP bar)
 *
 * USED BY: DashboardClient.tsx (LevelProgressCard)
 * LAST UPDATED: 2026-05-31
 */

import type { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/* ─────────────────────────────────────────────
 * Level definitions — hardcoded product constants.
 * xpRequired = cumulative XP to reach that level.
 * ───────────────────────────────────────────── */

interface LevelDef {
  levelNumber: number;
  xpRequired:  number;
  xpToNext:    number;
  title:       string;
  badgeName:   string;
  badgeIcon:   string;
  badgeColor:  string;
  perks:       Record<string, string>;
}

/* 10 levels — each level ~50–100% more XP than the previous */
const LEVEL_DEFS: Omit<LevelDef, "xpToNext">[] = [
  { levelNumber: 1,  xpRequired: 0,     title: "Learner",     badgeName: "Seedling",    badgeIcon: "🌱", badgeColor: "#6B7280", perks: { community: "Post in community",       battle: "Join casual battles"        } },
  { levelNumber: 2,  xpRequired: 150,   title: "Explorer",    badgeName: "Sprout",      badgeIcon: "🌿", badgeColor: "#10B981", perks: { leaderboard: "Class leaderboard",    profile: "Custom avatar border"       } },
  { levelNumber: 3,  xpRequired: 400,   title: "Practitioner",badgeName: "Star",        badgeIcon: "⭐", badgeColor: "#F59E0B", perks: { badges: "Milestone badges",          battle: "Rated battles"               } },
  { levelNumber: 4,  xpRequired: 800,   title: "Scholar",     badgeName: "Scholar",     badgeIcon: "📖", badgeColor: "#3B82F6", perks: { wallet: "Bonus Stars on streaks",   analytics: "Study analytics"          } },
  { levelNumber: 5,  xpRequired: 1400,  title: "Achiever",    badgeName: "Achiever",    badgeIcon: "🏅", badgeColor: "#8B5CF6", perks: { events: "Priority registration",    star: "Gold profile star"             } },
  { levelNumber: 6,  xpRequired: 2200,  title: "Expert",      badgeName: "Expert",      badgeIcon: "🔷", badgeColor: "#06B6D4", perks: { battle: "Expert battle tier",       simulations: "Premium simulations"   } },
  { levelNumber: 7,  xpRequired: 3200,  title: "Master",      badgeName: "Master",      badgeIcon: "💎", badgeColor: "#EC4899", perks: { leaderboard: "Global leaderboard", mentorship: "Mentor badge"            } },
  { levelNumber: 8,  xpRequired: 4500,  title: "Champion",    badgeName: "Champion",    badgeIcon: "🏆", badgeColor: "#F97316", perks: { events: "Exclusive championships", rank: "Champion rank badge"           } },
  { levelNumber: 9,  xpRequired: 6200,  title: "Legend",      badgeName: "Legend",      badgeIcon: "🌟", badgeColor: "#EF4444", perks: { all: "Full platform access",        prestige: "Legend prestige frame"     } },
  { levelNumber: 10, xpRequired: 8500,  title: "Grandmaster", badgeName: "Grandmaster", badgeIcon: "👑", badgeColor: "#FBBF24", perks: { hall: "Hall of Fame entry",         ultimate: "Grandmaster crown"         } },
];

/* Pre-compute xpToNext for each level */
const LEVELS: LevelDef[] = LEVEL_DEFS.map((def, i) => ({
  ...def,
  xpToNext: i < LEVEL_DEFS.length - 1
    ? LEVEL_DEFS[i + 1].xpRequired - def.xpRequired
    : 0, /* Max level — no "next" */
}));

/* ─────────────────────────────────────────────
 * Cache headers — level definitions never change between deploys
 * ───────────────────────────────────────────── */
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
} as const;

/* ─────────────────────────────────────────────
 * GET /api/levels
 * ───────────────────────────────────────────── */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  /* Mode 1: Single level by number (?n=5) */
  const nParam = searchParams.get("n");
  if (nParam !== null) {
    const n = parseInt(nParam, 10);
    const level = LEVELS.find(l => l.levelNumber === n);
    if (!level) {
      return apiError("LEVEL_NOT_FOUND", `Level ${n} not found.`, 404);
    }
    return apiSuccess({ level }, { headers: CACHE_HEADERS });
  }

  /* Mode 2: Current + next level for dashboard XP bar (?user_level=7) */
  const userLevelParam = searchParams.get("user_level");
  if (userLevelParam !== null) {
    const userLevel = Math.max(1, Math.min(parseInt(userLevelParam, 10) || 1, 10));
    const current = LEVELS.find(l => l.levelNumber === userLevel) ?? LEVELS[0];
    const next    = LEVELS.find(l => l.levelNumber === userLevel + 1) ?? null;
    return apiSuccess({ current, next }, { headers: CACHE_HEADERS });
  }

  /* Mode 3: All levels */
  return apiSuccess({ levels: LEVELS, total: LEVELS.length }, { headers: CACHE_HEADERS });
}
