/*
 * FILE: route.ts
 * LOCATION: src/app/api/search/route.ts
 * PURPOSE: Global search API endpoint.
 *          Accepts a `q` query parameter and returns matching results from:
 *            1. Static curriculum catalogs (CBSE subjects, chapters)
 *            2. Learning catalog (Class 9-12 subjects, engineering plans)
 *          Uses the in-memory TypeScript data so search works WITHOUT a
 *          running PostgreSQL server. When the full database is available
 *          in production, extend this to also search community posts
 *          and user profiles.
 *
 * RETURNS:
 *   { ok: true, query: string, results: SearchResult[], total: number }
 *
 * ERRORS:
 *   400 — missing or too-short query
 *   500 — unexpected server error
 *
 * USED BY: src/app/search/page.tsx (client-side fetch)
 * LAST UPDATED: 2026-05-28
 */

import { NextResponse } from "next/server";
import { CLASS_9_CATALOG, type ClassCatalog } from "@/lib/curriculum/cbse-catalog";

/** Shape of a single search result sent to the client */
interface SearchResult {
  id: string;
  type: "chapter" | "subject" | "topic" | "post" | "user";
  title: string;
  subtitle?: string;
  href: string;
  highlight?: string;
}

export const dynamic = "force-dynamic";

/**
 * All available catalogs for searching.
 * Add more catalogs here as class data is added (CLASS_10_CATALOG, etc.)
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
    /* ── 2. Search through all curriculum catalogs ── */
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

        /* Stop searching if we have enough results */
        if (results.length >= 30) break;
      }

      if (results.length >= 30) break;
    }
  } catch (err) {
    console.error("[search] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Search is temporarily unavailable." },
      { status: 500 },
    );
  }

  /* Limit total results to 30 for performance */
  const limitedResults = results.slice(0, 30);

  return NextResponse.json({
    ok: true,
    query: safeQ,
    results: limitedResults,
    total: limitedResults.length,
  });
}
