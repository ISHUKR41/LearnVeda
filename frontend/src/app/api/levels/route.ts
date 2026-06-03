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
export const dynamic = "force-dynamic";

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

const TIER_NAMES = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Sapphire",
  "Emerald",
  "Ruby",
  "Diamond",
  "Legend",
  "Grandmaster"
];

const TIER_ICONS = ["🌱", "🌿", "⭐", "📖", "🏅", "🔷", "💎", "🏆", "🌟", "👑"];
const TIER_COLORS = [
  "#6B7280", // Bronze
  "#10B981", // Silver
  "#F59E0B", // Gold
  "#3B82F6", // Sapphire
  "#8B5CF6", // Emerald
  "#06B6D4", // Platinum
  "#EC4899", // Ruby
  "#F97316", // Diamond
  "#EF4444", // Legend
  "#FBBF24"  // Grandmaster
];

const BASE_TITLES = [
  "Learner",
  "Explorer",
  "Practitioner",
  "Scholar",
  "Achiever",
  "Expert",
  "Master",
  "Champion",
  "Legend",
  "Grandmaster"
];

const LEVELS: LevelDef[] = Array.from({ length: 100 }, (_, idx) => {
  const n = idx + 1;
  const tierIdx = Math.min(9, Math.floor((n - 1) / 10));
  const titleIdx = (n - 1) % 10;
  const xpRequired = 100 * (n - 1) * (n - 1);
  const xpToNext = n < 100 ? 100 * n * n - xpRequired : 0;

  const title = tierIdx === 0 ? BASE_TITLES[titleIdx] : `${TIER_NAMES[tierIdx]} ${BASE_TITLES[titleIdx]}`;
  const badgeName = title;
  const badgeIcon = TIER_ICONS[tierIdx];
  const badgeColor = TIER_COLORS[tierIdx];

  const perks: Record<string, string> = {
    community: `Access to Tier ${tierIdx + 1} community chat`,
    battle: `Unlock Tier ${tierIdx + 1} battles`,
  };
  if (n % 5 === 0) {
    perks.bonus = `Special milestone bonus stars unlocked`;
  }

  return {
    levelNumber: n,
    xpRequired,
    xpToNext,
    title,
    badgeName,
    badgeIcon,
    badgeColor,
    perks
  };
});

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
    const userLevel = Math.max(1, Math.min(parseInt(userLevelParam, 10) || 1, 100));
    const current = LEVELS.find(l => l.levelNumber === userLevel) ?? LEVELS[0];
    const next    = LEVELS.find(l => l.levelNumber === userLevel + 1) ?? null;
    return apiSuccess({ current, next }, { headers: CACHE_HEADERS });
  }

  /* Mode 3: All levels */
  return apiSuccess({ levels: LEVELS, total: LEVELS.length }, { headers: CACHE_HEADERS });
}
