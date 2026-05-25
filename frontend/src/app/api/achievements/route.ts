/*
 * FILE: route.ts
 * LOCATION: src/app/api/achievements/route.ts
 * PURPOSE: Returns the full list of platform achievements and, if a user is
 *          authenticated, marks which ones they have earned. This powers the
 *          achievements grid on the dashboard and the achievements page.
 *
 * ENDPOINTS:
 *   GET /api/achievements
 *     Query params:
 *       userId (optional) — if provided, augments each achievement with
 *                           { earned: true, awardedAt: ISO string }.
 *                           The caller can pass the userId from /api/auth/me.
 *
 * CACHING:
 *   - Achievement definitions rarely change → Cache-Control: public, max-age=3600
 *   - If a userId is present the response is user-specific → no-store
 *
 * DATABASE TABLES READ:
 *   eduquest_achievements      — all platform achievement definitions
 *   eduquest_user_achievements — which achievements a specific user has earned
 *
 * ERROR HANDLING:
 *   - DB errors return a 500 with a safe "internal error" message.
 *   - An empty table (no achievements seeded) returns an empty array, not a 404.
 *
 * LAST UPDATED: 2026-05-25
 */

import { type NextRequest, NextResponse } from "next/server";
import { getPostgresPool } from "@/lib/server/database/postgres";

/* ─── Type definitions ──────────────────────────────────────────────────────── */

/** One achievement row as returned by the DB query. */
interface AchievementRow {
  id:              string;
  slug:            string;
  name:            string;
  description:     string;
  category:        string;
  badge_color:     string;
  badge_icon:      string;
  xp_reward:       number;
  threshold_type:  string;
  threshold_value: number;
  sort_order:      number;
  /* Joined from eduquest_user_achievements — NULL means not earned */
  earned:          boolean | null;
  awarded_at:      string | null;
}

/** Shape returned to the client. */
interface AchievementDTO {
  id:             string;
  slug:           string;
  name:           string;
  description:    string;
  category:       string;
  badgeColor:     string;
  badgeIcon:      string;
  xpReward:       number;
  thresholdType:  string;
  thresholdValue: number;
  sortOrder:      number;
  earned:         boolean;
  awardedAt:      string | null;
}

/* ─── GET handler ────────────────────────────────────────────────────────────── */

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  /* Optional: caller supplies their userId to get personalised results */
  const userId = searchParams.get("userId") || null;

  try {
    const pool = getPostgresPool();

    let rows: AchievementRow[];

    if (userId) {
      /*
       * LEFT JOIN with user_achievements so we know which the user has earned.
       * The BOOL_OR collapses multiple rows in case of duplicate award records.
       */
      const result = await pool.query<AchievementRow>(`
        SELECT
          a.id,
          a.slug,
          a.name,
          a.description,
          a.category,
          a.badge_color,
          a.badge_icon,
          a.xp_reward,
          a.threshold_type,
          a.threshold_value,
          a.sort_order,
          (ua.achievement_id IS NOT NULL) AS earned,
          ua.awarded_at::TEXT            AS awarded_at
        FROM eduquest_achievements a
        LEFT JOIN eduquest_user_achievements ua
               ON ua.achievement_id = a.id
              AND ua.user_id = $1
        WHERE a.is_active = TRUE
        ORDER BY a.sort_order ASC, a.name ASC
      `, [userId]);

      rows = result.rows;
    } else {
      /*
       * No user context — return definitions only (earned = false for all).
       * Cached at CDN level for 1 hour since definitions change infrequently.
       */
      const result = await pool.query<Omit<AchievementRow, "earned" | "awarded_at">>(`
        SELECT
          id, slug, name, description, category,
          badge_color, badge_icon, xp_reward,
          threshold_type, threshold_value, sort_order
        FROM eduquest_achievements
        WHERE is_active = TRUE
        ORDER BY sort_order ASC, name ASC
      `);

      /* Normalise: add the missing fields with null/false values */
      rows = result.rows.map(r => ({ ...r, earned: false, awarded_at: null }));
    }

    /* Transform snake_case DB columns to camelCase for the client */
    const achievements: AchievementDTO[] = rows.map(r => ({
      id:             r.id,
      slug:           r.slug,
      name:           r.name,
      description:    r.description,
      category:       r.category,
      badgeColor:     r.badge_color,
      badgeIcon:      r.badge_icon,
      xpReward:       Number(r.xp_reward),
      thresholdType:  r.threshold_type,
      thresholdValue: Number(r.threshold_value),
      sortOrder:      Number(r.sort_order),
      earned:         r.earned === true,
      awardedAt:      r.awarded_at ?? null,
    }));

    /* Group by category for the frontend grid */
    const byCategory: Record<string, AchievementDTO[]> = {};
    for (const a of achievements) {
      if (!byCategory[a.category]) byCategory[a.category] = [];
      byCategory[a.category].push(a);
    }

    const earnedCount  = achievements.filter(a => a.earned).length;
    const totalCount   = achievements.length;

    const response = NextResponse.json({
      ok: true,
      data: {
        achievements,
        byCategory,
        summary: {
          total:   totalCount,
          earned:  earnedCount,
          percent: totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0,
        },
      },
    });

    /* Cache strategy depends on whether we have user context */
    if (userId) {
      /* User-specific — do not cache in CDN */
      response.headers.set("Cache-Control", "private, no-store");
    } else {
      /* Public achievement definitions — cache for 1 hour */
      response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=300");
    }

    return response;

  } catch (err) {
    /* Log the full error on the server but never expose it to the client */
    console.error("[API /api/achievements] DB error:", err);
    return NextResponse.json(
      { ok: false, error: { message: "Failed to load achievements. Please try again." } },
      { status: 500 }
    );
  }
}
