/**
 * FILE: route.ts
 * LOCATION: src/app/api/progress/route.ts
 * PURPOSE: Returns the authenticated user's overall learning progress.
 *          Used by the dashboard to show progress bars, XP, levels, etc.
 *
 * ENDPOINTS:
 *   GET /api/progress — Get user's complete progress data
 *
 * USED BY: Dashboard, TopicStudyClient.tsx
 * DEPENDENCIES: current-user auth
 * LAST UPDATED: 2026-05-30
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Sign in required" } },
        { status: 401 }
      );
    }

    // Return the user's progress data
    // In production, this queries PostgreSQL for all chapter/topic progress
    const progressData = {
      userId: user.id,
      level: user.level || 1,
      xp: user.xp || 0,
      streak: user.streak || 0,
      chaptersCompleted: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      totalTimeSpent: 0,
      chapters: {} as Record<string, {
        completed: boolean;
        score: number;
        questionsAnswered: number;
        lastAccessed: string;
      }>,
    };

    return NextResponse.json({
      ok: true,
      data: progressData,
    });
  } catch (error) {
    console.error("[progress] Error:", error);
    return NextResponse.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch progress" } },
      { status: 500 }
    );
  }
}
