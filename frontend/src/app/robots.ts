/**
 * FILE: robots.ts
 * LOCATION: src/app/robots.ts
 * PURPOSE: Dynamically generates the robots.txt rules for EduQuest.
 *          Tells search engines how to crawl the site, which paths are disallowed,
 *          and dynamically sets the absolute canonical path to our XML sitemap.
 *
 * RULES:
 *  - Allow complete crawl access to educational subjects, notes, and interactive pathways.
 *  - Restrict access to administrative portals, session callbacks, and temporary test zones.
 *  - Points directly to the dynamic sitemap.ts route.
 *
 * DEPENDENCIES: Next.js metadata system, Node.js process environment
 * LAST UPDATED: 2026-05-26
 */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eduquest.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/dashboard/",
        "/settings/",
        "/forgot-password/",
        "/api/auth/",
        "/api/progress/",
        "/test/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
