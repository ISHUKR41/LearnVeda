/**
 * FILE: sitemap.ts
 * LOCATION: src/app/sitemap.ts
 * PURPOSE: Dynamically generates the XML Sitemap for EduQuest in production.
 *          Queries live PGlite PostgreSQL database (via `queryPostgres` pool on port 5432)
 *          to automatically register all Class 9-12 subjects, chapters, community posts,
 *          and dynamic Programmatic SEO routes mapping to high-authority hubs.
 *
 * SYSTEM DESIGN:
 *  - Dynamically builds canonical URLs using NEXT_PUBLIC_SITE_URL or fallbacks.
 *  - Captures 100% of subject syllabus pathways and nested chapter lessons in real-time.
 *  - Includes all programmatic SEO nodes parsed from our topical authority map.
 *  - Ensures maximum Google indexation speed with daily/weekly updates.
 *
 * DEPENDENCIES: postgres.ts, topical-authority-map.json, next/server
 * LAST UPDATED: 2026-05-26
 */

import { MetadataRoute } from "next";
import { queryPostgres } from "@/lib/server/database/postgres";
import path from "path";
import fs from "fs";

interface DBSubject {
  track: string;
  slug: string;
  created_at: string | Date;
}

interface DBChapter {
  track: string;
  subject_slug: string;
  chapter_slug: string;
  created_at: string | Date;
}

interface DBPost {
  id: string;
  created_at: string | Date;
}

interface TopicalAuthorityMap {
  linking_clusters: Array<{
    hub: string;
    nodes: string[];
  }>;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eduquest.vercel.app";

  // 1. Define high-level static marketing and hub pages
  const staticRoutes = [
    "",
    "/pricing",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/class-9",
    "/class-10",
    "/class-11",
    "/class-12",
    "/engineering",
    "/community",
    "/leaderboard",
    "/events",
    // ── Class 10 Light Chapter (all subtopic pages, high educational value) ──
    "/class-10/light-reflection-and-refraction",
    "/class-10/light-reflection-and-refraction/reflection",
    "/class-10/light-reflection-and-refraction/refraction",
    "/class-10/light-reflection-and-refraction/lenses",
    "/class-10/light-reflection-and-refraction/summary",
  ];

  const sitemapItems: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    // Light chapter subtopic pages get highest priority (0.95) — rich educational content
    priority:
      route === "" ? 1.0
      : route.includes("/light-reflection-and-refraction/") ? 0.95
      : route === "/class-10/light-reflection-and-refraction" ? 0.92
      : route.startsWith("/class-") || route === "/engineering" ? 0.9
      : 0.6,
  }));

  // 2. Fetch dynamic subjects from the live database
  try {
    const subjectsResult = await queryPostgres<DBSubject>(
      `SELECT track, slug, created_at FROM eduquest_subjects ORDER BY created_at DESC`
    );

    subjectsResult.rows.forEach((subject) => {
      // Map BTech subjects properly to engineering hubs and school tracks to school route parameters
      const pathSegment = subject.track === "engineering" ? "engineering" : subject.track;
      sitemapItems.push({
        url: `${baseUrl}/${pathSegment}/${subject.slug}`,
        lastModified: new Date(subject.created_at),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });
  } catch (error) {
    console.error("[Sitemap Generator] Failed to query eduquest_subjects:", error);
  }

  // 3. Fetch nested chapters from the live database
  try {
    const chaptersResult = await queryPostgres<DBChapter>(
      `SELECT s.track, s.slug as subject_slug, c.slug as chapter_slug, c.created_at
       FROM eduquest_chapters c
       JOIN eduquest_subjects s ON s.id = c.subject_id
       ORDER BY c.created_at DESC`
    );

    chaptersResult.rows.forEach((chapter) => {
      const pathSegment = chapter.track === "engineering" ? "engineering" : chapter.track;
      sitemapItems.push({
        url: `${baseUrl}/${pathSegment}/${chapter.subject_slug}/${chapter.chapter_slug}`,
        lastModified: new Date(chapter.created_at),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error("[Sitemap Generator] Failed to query eduquest_chapters:", error);
  }

  // 4. Fetch dynamic community posts from the live database
  try {
    const postsResult = await queryPostgres<DBPost>(
      `SELECT id, created_at FROM eduquest_community_posts ORDER BY created_at DESC LIMIT 500`
    );

    postsResult.rows.forEach((post) => {
      sitemapItems.push({
        url: `${baseUrl}/community/post/${post.id}`,
        lastModified: new Date(post.created_at),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    });
  } catch (error) {
    console.error("[Sitemap Generator] Failed to query eduquest_community_posts:", error);
  }

  // 5. Load dynamic Programmatic SEO routes from topical-authority-map.json nodes
  try {
    const mapPath = path.join(process.cwd(), "src/lib/server/seo/topical-authority-map.json");
    if (fs.existsSync(mapPath)) {
      const rawData = fs.readFileSync(mapPath, "utf-8");
      const authorityMap: TopicalAuthorityMap = JSON.parse(rawData);

      // Collect all dynamic programmatic nodes
      const programmaticNodes = new Set<string>();
      authorityMap.linking_clusters.forEach((cluster) => {
        cluster.nodes.forEach((node) => {
          if (node.startsWith("/notes/") || node.startsWith("/mcqs/") || node.startsWith("/interviews/") || node.startsWith("/semester/")) {
            programmaticNodes.add(node);
          }
        });
      });

      programmaticNodes.forEach((node) => {
        sitemapItems.push({
          url: `${baseUrl}${node}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.85, // Direct target queries (e.g. C++ Notes) get high priority boost
        });
      });
    }
  } catch (error) {
    console.error("[Sitemap Generator] Failed to parse programmatic routes from topical-authority-map.json:", error);
  }

  return sitemapItems;
}
