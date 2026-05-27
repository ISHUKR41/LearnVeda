/**
 * FILE: seo.ts
 * LOCATION: backend/src/routes/seo.ts
 * PURPOSE: SEO API endpoints for dynamic sitemap, structured data,
 *          robots.txt, and SEO metadata generation.
 *
 * ENDPOINTS:
 *  GET /api/seo/sitemap.xml     — Dynamic XML sitemap from database
 *  GET /api/seo/robots.txt      — Robots.txt for crawlers
 *  GET /api/seo/schema/:type    — JSON-LD structured data by type
 *  GET /api/seo/meta/:slug      — SEO metadata for a specific page
 *  GET /api/seo/breadcrumbs     — Breadcrumb trail for a URL path
 *  GET /api/seo/internal-links  — Internal linking suggestions
 *
 * CACHING: Sitemap is cached for 1 hour, schemas for 24 hours.
 * USED BY: Frontend SSR, search engine crawlers, monitoring
 * LAST UPDATED: 2026-05-26
 */

import { Router, Request, Response } from "express";
import {
  generateSitemap,
  generateRobotsTxt,
  getWebsiteSchema,
  getCourseSchema,
  getArticleSchema,
  getFaqSchema,
  getBreadcrumbSchema,
  generateBreadcrumbs,
  getInternalLinks,
  generatePageSeo,
  getOpenGraphMeta,
} from "../services/seo.service";
import logger from "../utils/logger";

const router = Router();

/* ─────────────────────────────────────────────
 * In-memory sitemap cache (regenerated every hour)
 * ───────────────────────────────────────────── */
let sitemapCache: { xml: string; generatedAt: number } | null = null;
const SITEMAP_CACHE_TTL = 60 * 60 * 1000; // 1 hour

/* ─────────────────────────────────────────────
 * GET /api/seo/sitemap.xml
 * Dynamic XML sitemap generated from database content.
 * Cached for 1 hour to reduce database load.
 * ───────────────────────────────────────────── */
router.get("/sitemap.xml", async (_req: Request, res: Response) => {
  try {
    /* Check cache validity */
    if (sitemapCache && Date.now() - sitemapCache.generatedAt < SITEMAP_CACHE_TTL) {
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.setHeader("X-Cache", "HIT");
      res.send(sitemapCache.xml);
      return;
    }

    /* Generate fresh sitemap */
    const xml = await generateSitemap();
    sitemapCache = { xml, generatedAt: Date.now() };

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("X-Cache", "MISS");
    res.send(xml);
  } catch (error) {
    logger.error("[SEO] Sitemap generation failed", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    res.status(500).json({ ok: false, error: "Sitemap generation failed" });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/seo/robots.txt
 * Robots.txt for search engine crawlers.
 * ───────────────────────────────────────────── */
router.get("/robots.txt", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(generateRobotsTxt());
});

/* ─────────────────────────────────────────────
 * GET /api/seo/schema/website
 * JSON-LD structured data for the homepage.
 * ───────────────────────────────────────────── */
router.get("/schema/website", (_req: Request, res: Response) => {
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.json(getWebsiteSchema());
});

/* ─────────────────────────────────────────────
 * GET /api/seo/schema/course
 * JSON-LD Course schema for a subject/chapter.
 * ───────────────────────────────────────────── */
router.get("/schema/course", (req: Request, res: Response) => {
  const name = String(req.query.name ?? "");
  const description = String(req.query.description ?? "");
  const slug = String(req.query.slug ?? "");
  const classLevel = req.query.classLevel ? String(req.query.classLevel) : undefined;

  if (!name || !slug) {
    res.status(400).json({ ok: false, error: "name and slug are required" });
    return;
  }

  res.json(getCourseSchema({ name, description, slug, classLevel }));
});

/* ─────────────────────────────────────────────
 * GET /api/seo/schema/faq
 * JSON-LD FAQPage schema from provided Q&A pairs.
 * ───────────────────────────────────────────── */
router.post("/schema/faq", (req: Request, res: Response) => {
  const { faqs } = req.body;
  if (!Array.isArray(faqs) || faqs.length === 0) {
    res.status(400).json({ ok: false, error: "faqs array is required" });
    return;
  }
  res.json(getFaqSchema(faqs));
});

/* ─────────────────────────────────────────────
 * GET /api/seo/breadcrumbs
 * Breadcrumb trail for a URL path.
 * ───────────────────────────────────────────── */
router.get("/breadcrumbs", (req: Request, res: Response) => {
  const path = String(req.query.path ?? "/");
  const breadcrumbs = generateBreadcrumbs(path);
  res.json({
    ok: true,
    breadcrumbs,
    schema: getBreadcrumbSchema(breadcrumbs),
  });
});

/* ─────────────────────────────────────────────
 * GET /api/seo/meta/:type/:slug
 * SEO metadata for a specific page type.
 * ───────────────────────────────────────────── */
router.get("/meta/:type/:slug", (req: Request, res: Response) => {
  const type = String(req.params.type) as "subject" | "chapter" | "notes" | "mcqs" | "interview" | "pyq" | "roadmap" | "semester";
  const slug = String(req.params.slug);
  const name = String(req.query.name ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()));

  const seo = generatePageSeo({ type, name });
  const og = getOpenGraphMeta({
    title: seo.title,
    description: seo.description,
    path: `/${type}/${slug}`,
  });

  res.json({
    ok: true,
    seo,
    openGraph: og,
  });
});

/* ─────────────────────────────────────────────
 * GET /api/seo/internal-links/:subjectSlug
 * Internal linking suggestions for a subject.
 * ───────────────────────────────────────────── */
router.get("/internal-links/:subjectSlug", async (req: Request, res: Response) => {
  try {
    const subjectSlug = String(req.params.subjectSlug);
    const contentType = String(req.query.contentType ?? "");
    const links = await getInternalLinks(subjectSlug, contentType);

    res.json({
      ok: true,
      links,
      totalSuggestions: links.length,
    });
  } catch (error) {
    logger.error("[SEO] Internal links generation failed", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    res.status(500).json({ ok: false, error: "Failed to generate internal links" });
  }
});

export default router;
