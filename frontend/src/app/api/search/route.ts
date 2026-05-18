/*
 * FILE: route.ts
 * LOCATION: src/app/api/search/route.ts
 * PURPOSE: Global search API endpoint.
 *          Accepts a `q` query parameter and returns matching results from:
 *            1. eduquest_subjects   — by subject name
 *            2. eduquest_chapters   — by chapter name (includes subject context)
 *            3. eduquest_community_posts — by post title / first 200 chars of content
 *            4. eduquest_users      — by display name or email
 *
 *          All queries are ILIKE-based (case-insensitive partial match) with a
 *          combined LIMIT of 30 results across all categories.
 *
 * RETURNS:
 *   { ok: true, query: string, results: SearchResult[], total: number }
 *
 * ERRORS:
 *   400 — missing or too-short query
 *   500 — database error
 *
 * USED BY: src/app/search/page.tsx (client-side fetch)
 * LAST UPDATED: 2026-05-17
 */

import { NextResponse } from "next/server";
import { getPool } from "@/lib/server/database/pool";

/** Shape of a single search result sent to the client */
interface SearchResult {
  id: string;
  type: "chapter" | "subject" | "post" | "user";
  title: string;
  subtitle?: string;
  href: string;
  highlight?: string;
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  /* ── 1. Parse and validate the query parameter ── */
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!q || q.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Query must be at least 2 characters." },
      { status: 400 },
    );
  }

  /* Safety: limit query length to prevent abuse */
  const safeQ = q.slice(0, 100);
  const pattern = `%${safeQ}%`; /* ILIKE pattern */

  const pool = getPool();
  const results: SearchResult[] = [];

  try {
    /* ── 2. Search subjects ── */
    const subjectsRes = await pool.query<{
      id: string;
      name: string;
      track: string;
      slug: string;
    }>(
      `SELECT id::text, name, track, slug
       FROM eduquest_subjects
       WHERE name ILIKE $1
       LIMIT 5`,
      [pattern],
    );

    for (const row of subjectsRes.rows) {
      results.push({
        id: row.id,
        type: "subject",
        title: row.name,
        subtitle: `${row.track.replace(/-/g, " ")} subject`,
        href: `/${row.track}/${row.slug.replace(`${row.track}-`, "")}`,
      });
    }

    /* ── 3. Search chapters ── */
    const chaptersRes = await pool.query<{
      id: string;
      name: string;
      subject_name: string;
      track: string;
      subject_slug: string;
    }>(
      `SELECT ch.id::text, ch.name, s.name AS subject_name,
              s.track, s.slug AS subject_slug
       FROM eduquest_chapters ch
       JOIN eduquest_subjects s ON ch.subject_id = s.id
       WHERE ch.name ILIKE $1
       LIMIT 8`,
      [pattern],
    );

    for (const row of chaptersRes.rows) {
      results.push({
        id: row.id,
        type: "chapter",
        title: row.name,
        subtitle: `${row.subject_name} · ${row.track.replace(/-/g, " ")}`,
        href: `/${row.track}/${row.subject_slug.replace(`${row.track}-`, "")}`,
      });
    }

    /* ── 4. Search community posts ── */
    const postsRes = await pool.query<{
      id: string;
      title: string;
      body: string;
      author_name: string;
    }>(
      `SELECT p.id::text, p.title,
              LEFT(p.body, 200) AS body,
              p.author_name
       FROM eduquest_community_posts p
       WHERE p.title ILIKE $1 OR p.body ILIKE $1
       ORDER BY p.likes DESC, p.created_at DESC
       LIMIT 8`,
      [pattern],
    );

    for (const row of postsRes.rows) {
      results.push({
        id: row.id,
        type: "post",
        title: row.title,
        subtitle: `by ${row.author_name}`,
        href: `/community`,
        highlight: row.body.length > 120 ? row.body.slice(0, 120) + "..." : row.body,
      });
    }

    /* ── 5. Search users ── */
    const usersRes = await pool.query<{
      id: string;
      name: string;
      level: number;
      track: string;
    }>(
      `SELECT id::text, name, level, track
       FROM eduquest_users
       WHERE name ILIKE $1 OR email ILIKE $1
       LIMIT 5`,
      [pattern],
    );

    for (const row of usersRes.rows) {
      results.push({
        id: row.id,
        type: "user",
        title: row.name,
        subtitle: `Level ${row.level} · ${row.track.replace(/-/g, " ")}`,
        href: `/leaderboard`,
      });
    }

  } catch (err) {
    console.error("[search] Database error:", err);
    return NextResponse.json(
      { ok: false, error: "Search is temporarily unavailable." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    query: safeQ,
    results,
    total: results.length,
  });
}
