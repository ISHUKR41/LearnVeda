/**
 * FILE: route.ts
 * LOCATION: src/app/api/content/subjects/route.ts
 * PURPOSE: Returns subject cards used by the battle lobby and other
 *          content pickers. Pulls from PostgreSQL when available and
 *          falls back to the Class 9 catalog for offline/local previews.
 * USED BY: src/app/battle/BattleClient.tsx
 * DEPENDENCIES: postgres.ts, cbse-catalog.ts, api-response helpers
 * LAST UPDATED: 2026-05-28
 */

import type { NextRequest } from "next/server";
import { getPostgresPool } from "@/lib/server/database/postgres";
import { shouldAllowStaticFallbackData } from "@/lib/server/env";
import { CLASS_9_CATALOG } from "@/lib/curriculum/cbse-catalog";
import { apiError, apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

interface SubjectRow {
  id: string;
  track: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  sequence_order: number;
}

interface SubjectCard {
  id: string;
  track: string;
  slug: string;
  name: string;
  description?: string | null;
  icon: string;
  color: string;
}

function formatSubjectCard(row: SubjectRow): SubjectCard {
  return {
    id: row.id,
    track: row.track,
    slug: row.slug,
    name: row.name,
    description: row.description,
    icon: row.icon,
    color: row.color,
  };
}

function buildFallbackSubjects(track: string | null): SubjectCard[] {
  if (track && track !== CLASS_9_CATALOG.id) {
    return [];
  }

  return CLASS_9_CATALOG.subjects.map((subject) => ({
    id: subject.slug,
    track: CLASS_9_CATALOG.id,
    slug: subject.slug,
    name: subject.name,
    description: subject.description,
    icon: subject.icon,
    color: subject.color,
  }));
}

/** Returns subject cards for the requested learning track. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const track = searchParams.get("track");

  try {
    const pool = getPostgresPool();
    const params: string[] = [];
    const whereClause = track ? "WHERE track = $1" : "";

    if (track) {
      params.push(track);
    }

    const result = await pool.query<SubjectRow>(
      `SELECT
         id::text,
         track,
         slug,
         name,
         description,
         icon,
         color,
         sequence_order
       FROM eduquest_subjects
       ${whereClause}
       ORDER BY track ASC, sequence_order ASC`,
      params,
    );

    return apiSuccess(
      { subjects: result.rows.map(formatSubjectCard) },
      { headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    if (shouldAllowStaticFallbackData()) {
      return apiSuccess(
        { subjects: buildFallbackSubjects(track) },
        { headers: NO_STORE_HEADERS },
      );
    }

    console.error("[GET /api/content/subjects] DB error:", error);
    return apiError(
      "DB_ERROR",
      "Unable to load subjects right now.",
      500,
      undefined,
      NO_STORE_HEADERS,
    );
  }
}
