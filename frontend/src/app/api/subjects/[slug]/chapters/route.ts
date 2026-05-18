/*
 * FILE: route.ts
 * LOCATION: src/app/api/subjects/[slug]/chapters/route.ts
 * PURPOSE: REST API endpoint for fetching all chapters of a specific CBSE subject.
 *          The [slug] path segment identifies the subject (e.g. 'class-9-mathematics').
 *          Returns chapters in NCERT sequence order from the PostgreSQL database.
 *          Also returns the parent subject metadata for convenience.
 * USED BY: Subject detail pages (/class-9/mathematics chapter list)
 *          LearningPlanPage component
 *          Battle lobby chapter selector
 * DEPENDENCIES: curriculum-repository.ts, NextResponse
 * LAST UPDATED: 2026-05-17
 */

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import {
  getSubjectBySlug,
  getChaptersBySubjectSlug,
} from "@/lib/server/repositories/curriculum-repository";

/** Route params shape for Next.js App Router dynamic segments */
interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/subjects/[slug]/chapters
 *
 * Path Parameters:
 *   slug — The unique subject slug, e.g. 'class-9-mathematics'
 *
 * Response Body:
 *   {
 *     subject:  CurriculumSubject,         (parent subject metadata)
 *     chapters: CurriculumChapter[],       (ordered by sequence_order ASC)
 *     count:    number
 *   }
 *
 * Error codes:
 *   400 — Invalid slug format
 *   404 — Subject not found for the given slug
 *   500 — Database or runtime error
 *
 * Cache: 10 minutes (chapter lists are stable after initial seeding)
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  try {
    /* ── Resolve the dynamic [slug] segment ────────────────────────────────── */
    const { slug } = await params;

    /* ── Validate slug format — only lowercase alphanumeric + hyphens ─────── */
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        {
          error:   "Invalid subject slug. Use lowercase letters, digits, and hyphens only.",
          example: "/api/subjects/class-9-mathematics/chapters",
        },
        { status: 400 },
      );
    }

    /* ── Confirm the subject exists before querying chapters ─────────────────
     * This gives a 404 rather than an empty chapters array when the slug is
     * mistyped — easier for clients to distinguish "no chapters yet" from "wrong URL".
     */
    const subject = await getSubjectBySlug(slug);

    if (!subject) {
      return NextResponse.json(
        {
          error: `Subject not found: "${slug}". Check the slug and try again.`,
        },
        { status: 404 },
      );
    }

    /* ── Fetch chapters in NCERT sequence order ───────────────────────────── */
    const chapters = await getChaptersBySubjectSlug(slug);

    /* ── Return combined subject + chapters payload ───────────────────────── */
    return NextResponse.json(
      {
        subject,
        chapters,
        count: chapters.length,
      },
      {
        status: 200,
        headers: {
          /* Chapters are static curriculum data — cache for 10 minutes */
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=120",
        },
      },
    );
  } catch (error) {
    console.error("[GET /api/subjects/[slug]/chapters] Unhandled error:", error);

    return NextResponse.json(
      { error: "An unexpected server error occurred while fetching chapters." },
      { status: 500 },
    );
  }
}
