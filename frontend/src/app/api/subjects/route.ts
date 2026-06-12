/*
 * FILE: route.ts
 * LOCATION: src/app/api/subjects/route.ts
 * PURPOSE: REST API endpoint for fetching VidyaBolt CBSE subjects.
 *          Supports filtering by learning track (e.g. class-9) and optionally
 *          by stream (science / commerce / arts) for Class 11 and 12.
 *          Returns subjects from PostgreSQL in sequence_order.
 * USED BY: Class landing pages (/class-9, /class-10, etc.)
 *          Dashboard subject picker
 *          Battle lobby subject selector
 * DEPENDENCIES: curriculum-repository.ts, NextResponse
 * LAST UPDATED: 2026-05-17
 */

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import {
  getSubjectsByTrack,
  getSubjectsByTrackAndStream,
} from "@/lib/server/repositories/curriculum-repository";

/** Valid learning tracks this endpoint supports */
const ALLOWED_TRACKS = ["class-9", "class-10", "class-11", "class-12", "engineering"] as const;

/** Valid stream values (only applicable for class-11 and class-12) */
const ALLOWED_STREAMS = ["science", "commerce", "arts"] as const;

/**
 * GET /api/subjects
 *
 * Query Parameters:
 *   track  (required) — The learning track, e.g. 'class-9'
 *   stream (optional) — Stream filter for class-11/12: 'science' | 'commerce' | 'arts'
 *
 * Response Body:
 *   { subjects: CurriculumSubject[], count: number, track: string, stream: string | null }
 *
 * Cache: 5 minutes (subjects change rarely)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = request.nextUrl;

    /* ── Validate required 'track' parameter ──────────────────────────────────
     * Without a track, we cannot scope the query to the right set of subjects.
     * Returning 400 here gives the frontend a clear actionable error message.
     */
    const track = searchParams.get("track");

    if (!track) {
      return NextResponse.json(
        {
          error:   "Missing required query parameter: track",
          example: "/api/subjects?track=class-9",
        },
        { status: 400 },
      );
    }

    /* ── Guard against unknown track values ───────────────────────────────────
     * This prevents SQL injection risk and gives helpful error messages.
     */
    if (!(ALLOWED_TRACKS as readonly string[]).includes(track)) {
      return NextResponse.json(
        {
          error:   `Invalid track: "${track}". Allowed values: ${ALLOWED_TRACKS.join(", ")}`,
        },
        { status: 400 },
      );
    }

    /* ── Validate optional 'stream' parameter ─────────────────────────────────
     * Stream is only meaningful for class-11 and class-12.
     * We still validate the value to prevent unexpected queries.
     */
    const stream = searchParams.get("stream");

    if (stream && !(ALLOWED_STREAMS as readonly string[]).includes(stream)) {
      return NextResponse.json(
        {
          error: `Invalid stream: "${stream}". Allowed values: ${ALLOWED_STREAMS.join(", ")}`,
        },
        { status: 400 },
      );
    }

    /* ── Fetch subjects from PostgreSQL ───────────────────────────────────────
     * Use the stream-specific query when both track and stream are provided,
     * otherwise fetch all subjects for the track.
     */
    const useStreamFilter =
      !!stream && (track === "class-11" || track === "class-12");

    const subjects = useStreamFilter
      ? await getSubjectsByTrackAndStream(track, stream!)
      : await getSubjectsByTrack(track);

    /* ── Return the data with cache headers ───────────────────────────────────
     * Curriculum data is seeded at deployment time and rarely changes,
     * so 5-minute public caching + 60s stale-while-revalidate is safe here.
     */
    return NextResponse.json(
      {
        subjects,
        count:  subjects.length,
        track,
        stream: stream ?? null,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        },
      },
    );
  } catch (error) {
    /* ── Catch-all for unexpected database or runtime errors ──────────────── */
    console.error("[GET /api/subjects] Unhandled error:", error);

    return NextResponse.json(
      { error: "An unexpected server error occurred. Please try again." },
      { status: 500 },
    );
  }
}
