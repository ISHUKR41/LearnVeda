/**
 * FILE: route.ts
 * LOCATION: src/app/api/profile/route.ts
 * PURPOSE: Profile-specific API endpoint that returns a richer data format
 *          than the dashboard endpoint. Provides:
 *            - User stats (XP, level, streak, battles, questions, chapters)
 *            - Recent activity feed with typed events
 *            - Subject-wise progress bars
 *          The profile page uses this to populate XP bars, stat cards,
 *          progress rings, and the activity timeline.
 *          Falls back gracefully when no real user_stats row exists yet
 *          (new users see zeroed-out stats rather than an error).
 * USED BY: src/app/profile/page.tsx via TanStack Query
 * DEPENDENCIES: getAuthenticatedUser, postgres pool, api-response utils
 * LAST UPDATED: 2026-05-16
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { getPostgresPool } from "@/lib/server/database/postgres";
import { apiError, apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/* ─────────────────────────────────────────────
 * Response Types
 * ───────────────────────────────────────────── */

interface ProfileStats {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  battlesWon: number;
  totalBattles: number;
  questionsSolved: number;
  chaptersCompleted: number;
}

interface ActivityItem {
  id: string;
  type: "question" | "battle" | "chapter" | "level_up" | "streak";
  title: string;
  xpEarned: number;
  timestamp: string;
}

interface SubjectProgress {
  subject: string;
  color: string;
  completedChapters: number;
  totalChapters: number;
  percentComplete: number;
}

interface ProfileResponse {
  stats: ProfileStats;
  recentActivity: ActivityItem[];
  subjectProgress: SubjectProgress[];
}

/* ─────────────────────────────────────────────
 * Subject Color Mapping
 * Used to colour the progress bars for each subject on the profile page
 * ───────────────────────────────────────────── */

const SUBJECT_COLORS: Record<string, string> = {
  mathematics: "#2563EB",
  "mathematics-standard": "#2563EB",
  "mathematics-basic": "#4F46E5",
  science: "#059669",
  "social-science": "#7C3AED",
  english: "#D97706",
  hindi: "#DC2626",
  "computer-applications": "#0891B2",
  physics: "#2563EB",
  chemistry: "#059669",
  biology: "#D97706",
  "computer-science": "#0891B2",
  accountancy: "#059669",
  "business-studies": "#2563EB",
  economics: "#D97706",
  history: "#D97706",
  geography: "#059669",
  "political-science": "#7C3AED",
};

/* ─────────────────────────────────────────────
 * GET Handler
 * ───────────────────────────────────────────── */

/**
 * GET /api/profile
 *
 * Returns the authenticated user's profile data including stats,
 * recent activity, and subject-wise progress.
 * Returns 401 if no valid session is found.
 */
export async function GET(request: NextRequest) {
  /* Verify the session cookie */
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError(
      "UNAUTHENTICATED",
      "Please sign in to view your profile.",
      401,
      undefined,
      NO_STORE_HEADERS,
    );
  }

  const pool = getPostgresPool();

  try {
    /* ── 1. Aggregate stats from the real daily activity schema ── */
    const statsResult = await pool.query<{
      questions_solved: string;
      battles_won: string;
      total_battles: string;
    }>(
      `SELECT
         COALESCE(SUM(questions_solved), 0)::text AS questions_solved,
         COALESCE(SUM(battles_won), 0)::text      AS battles_won,
         COALESCE(SUM(battles_played), 0)::text   AS total_battles
       FROM eduquest_user_stats
       WHERE user_id = $1`,
      [user.id],
    );

    const chaptersResult = await pool.query<{ chapters_completed: string }>(
      `SELECT COUNT(*)::text AS chapters_completed
       FROM eduquest_user_progress
       WHERE user_id = $1
         AND is_complete = TRUE`,
      [user.id],
    );

    /* Use aggregate DB stats when present, otherwise fall back to user table values + zeros. */
    const dbStats = statsResult.rows[0];
    const stats: ProfileStats = {
      xp:               user.xp,
      level:            user.level,
      streak:           user.streak,
      longestStreak:    user.streak,
      battlesWon:       dbStats ? parseInt(dbStats.battles_won, 10)    : 0,
      totalBattles:     dbStats ? parseInt(dbStats.total_battles, 10)   : 0,
      questionsSolved:  dbStats ? parseInt(dbStats.questions_solved, 10): 0,
      chaptersCompleted: parseInt(chaptersResult.rows[0]?.chapters_completed ?? "0", 10),
    };

    /* ── 2. Fetch recent activity from user_progress ── */
    const activityResult = await pool.query<{
      id: string;
      subject_slug: string;
      subject_name: string;
      chapter_slug: string;
      chapter_name: string;
      status: string;
      score: number | null;
      completed_at: string | null;
      started_at: string;
    }>(
      `SELECT
         up.id::text,
         s.slug AS subject_slug,
         s.name AS subject_name,
         c.slug AS chapter_slug,
         c.name AS chapter_name,
         CASE WHEN up.is_complete THEN 'completed' ELSE 'in_progress' END AS status,
         up.score,
         up.completed_at,
         up.started_at
       FROM eduquest_user_progress up
       JOIN eduquest_subjects s ON s.id = up.subject_id
       JOIN eduquest_chapters c ON c.id = up.chapter_id
       WHERE up.user_id = $1
       ORDER BY COALESCE(up.completed_at, up.started_at) DESC
       LIMIT 10`,
      [user.id],
    );

    /*
     * Map progress rows to typed activity items.
     * "chapter_completed" → activity type "chapter"
     * "quiz_passed" → activity type "question"
     */
    const recentActivity: ActivityItem[] = activityResult.rows.map((row) => {
      const type: ActivityItem["type"] =
        row.status === "completed" ? "chapter" : "question";

      return {
        id: row.id,
        type,
        title: `${row.subject_name} — ${row.chapter_name}`,
        xpEarned: row.score ?? 0,
        timestamp: row.completed_at ?? row.started_at,
      };
    });

    /* ── 3. Fetch subject-wise progress ── */
    const subjectResult = await pool.query<{
      subject_slug: string;
      subject_name: string;
      color: string;
      completed_chapters: string;
      total_chapters: string;
    }>(
      `SELECT
         s.slug AS subject_slug,
         s.name AS subject_name,
         s.color,
         COUNT(DISTINCT up.chapter_id) FILTER (WHERE up.is_complete = TRUE)::text AS completed_chapters,
         COUNT(DISTINCT c.id)::text AS total_chapters
       FROM eduquest_subjects s
       JOIN eduquest_chapters c ON c.subject_id = s.id
       LEFT JOIN eduquest_user_progress up
              ON up.subject_id = s.id
             AND up.chapter_id = c.id
             AND up.user_id = $1
       WHERE s.track = $2
       GROUP BY s.slug, s.name, s.color, s.sequence_order
       ORDER BY s.sequence_order ASC, s.name ASC`,
      [user.id, user.track],
    );

    const subjectProgress: SubjectProgress[] = subjectResult.rows.map((row) => {
      const completed = parseInt(row.completed_chapters, 10);
      const total     = parseInt(row.total_chapters, 10);
      return {
        subject: row.subject_name,
        color: row.color ?? SUBJECT_COLORS[row.subject_slug] ?? "var(--color-primary)",
        completedChapters: completed,
        totalChapters: total,
        percentComplete: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });

    const response: ProfileResponse = { stats, recentActivity, subjectProgress };

    return apiSuccess(response, { headers: NO_STORE_HEADERS });

  } catch (error) {
    /* Log the error server-side but return a clean fallback to the client */
    console.error("[profile API] Database query error:", error);

    /*
     * Even if the DB query fails, return a valid profile with zeroed-out stats
     * rather than an error. This prevents the profile page from showing a crash
     * state for new users who haven't accumulated any data yet.
     */
    const fallback: ProfileResponse = {
      stats: {
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        longestStreak: user.streak,
        battlesWon: 0,
        totalBattles: 0,
        questionsSolved: 0,
        chaptersCompleted: 0,
      },
      recentActivity: [],
      subjectProgress: [],
    };

    return apiSuccess(fallback, { headers: NO_STORE_HEADERS });
  }
}
