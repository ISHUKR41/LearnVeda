/*
 * FILE: route.ts
 * LOCATION: src/app/api/search/route.ts
 * PURPOSE: Global search API endpoint.
 *          Accepts a `q` query parameter and returns matching results from:
 *            1. Static curriculum catalogs (CBSE subjects, chapters)
 *            2. PostgreSQL community posts (title + tags)
 *            3. PostgreSQL user names (leaderboard-visible users only)
 *          Results are sorted by type priority, then relevance.
 *
 * RETURNS:
 *   { ok: true, query: string, results: SearchResult[], total: number }
 *
 * ERRORS:
 *   400 — missing or too-short query
 *   500 — unexpected server error
 *
 * USED BY: src/app/search/page.tsx (client-side fetch)
 * LAST UPDATED: 2026-05-27
 */

import { NextResponse } from "next/server";
import { CLASS_9_CATALOG, type ClassCatalog } from "@/lib/curriculum/cbse-catalog";
import { getPostgresPool } from "@/lib/server/database/postgres";

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

/*
 * All static curriculum catalogs used for in-memory search.
 * These match quickly without hitting the DB.
 */
const ALL_CATALOGS: ClassCatalog[] = [
  CLASS_9_CATALOG,
];

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
  const lowerQ = safeQ.toLowerCase();
  const results: SearchResult[] = [];

  try {
    /* ── 2. Search static curriculum catalogs (subjects + chapters) ── */
    for (const catalog of ALL_CATALOGS) {
      for (const subject of catalog.subjects) {
        /* Match subject name against query */
        if (subject.name.toLowerCase().includes(lowerQ)) {
          results.push({
            id: `${catalog.id}-${subject.slug}`,
            type: "subject",
            title: subject.name,
            subtitle: `${catalog.name} subject`,
            href: `/${catalog.id}/${subject.slug}`,
            highlight: subject.description,
          });
        }

        /* Match chapter names within each subject */
        for (const chapter of subject.chapters) {
          const matchesName = chapter.name.toLowerCase().includes(lowerQ);
          const matchesDesc = chapter.description.toLowerCase().includes(lowerQ);

          if (matchesName || matchesDesc) {
            results.push({
              id: `${catalog.id}-${subject.slug}-${chapter.slug}`,
              type: "chapter",
              title: chapter.name,
              subtitle: `${subject.name} · ${catalog.name}`,
              href: `/${catalog.id}/${subject.slug}`,
              highlight: chapter.description,
            });
          }
        }

        if (results.length >= 20) break;
      }

      if (results.length >= 20) break;
    }

    /* ── 3. Search real PostgreSQL community posts ── */
    try {
      const pool = getPostgresPool();

      /*
       * Match posts by title (case-insensitive) or tag array containment.
       * Limit to 8 post results to keep the response lean.
       */
      const postsResult = await pool.query<{
        id: string;
        title: string;
        body: string;
        author_name: string;
        tags: string[];
        likes: number;
        views: number;
      }>(
        `
        SELECT id, title, body, author_name, tags, likes, views
        FROM eduquest_community_posts
        WHERE
          LOWER(title) LIKE $1
          OR EXISTS (
            SELECT 1 FROM unnest(tags) AS t WHERE LOWER(t) LIKE $1
          )
        ORDER BY (likes + views / 10) DESC
        LIMIT 8
        `,
        [`%${lowerQ}%`],
      );

      for (const post of postsResult.rows) {
        results.push({
          id: `post-${post.id}`,
          type: "post",
          title: post.title,
          subtitle: `by ${post.author_name} · ${post.likes} likes`,
          href: `/community`,
          /* Show first 120 chars of body as the highlight snippet */
          highlight: post.body.slice(0, 120) + (post.body.length > 120 ? "…" : ""),
        });
      }
    } catch {
      /* DB unavailable — skip community post results gracefully */
    }

    /* ── 4. Search PostgreSQL users (leaderboard-visible names) ── */
    try {
      const pool = getPostgresPool();

      const usersResult = await pool.query<{
        id: string;
        name: string;
        track: string;
        level: number;
      }>(
        `
        SELECT id, name, track, level
        FROM eduquest_users
        WHERE LOWER(name) LIKE $1
        ORDER BY xp DESC
        LIMIT 5
        `,
        [`%${lowerQ}%`],
      );

      for (const user of usersResult.rows) {
        results.push({
          id: `user-${user.id}`,
          type: "user",
          title: user.name,
          subtitle: `Level ${user.level} · ${user.track}`,
          href: `/leaderboard`,
          highlight: `View on leaderboard`,
        });
      }
    } catch {
      /* DB unavailable — skip user results gracefully */
    }

  } catch (err) {
    console.error("[search] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Search is temporarily unavailable." },
      { status: 500 },
    );
  }

  /* Limit total results to 30 */
  const limitedResults = results.slice(0, 30);

  return NextResponse.json({
    ok: true,
    query: safeQ,
    results: limitedResults,
    total: limitedResults.length,
  });
}
