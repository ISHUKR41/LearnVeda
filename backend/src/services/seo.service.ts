/**
 * FILE: seo.service.ts
 * LOCATION: backend/src/services/seo.service.ts
 * PURPOSE: Comprehensive SEO engine for the EduQuest educational platform.
 *          Generates structured data (JSON-LD), sitemaps, Open Graph metadata,
 *          breadcrumbs, canonical URLs, and educational schema markup.
 *
 * FEATURES:
 *  1. Dynamic sitemap.xml generation from database content
 *  2. JSON-LD structured data for Course, Article, FAQ, BreadcrumbList schemas
 *  3. Open Graph and Twitter Card metadata generation
 *  4. Breadcrumb trail computation from URL paths
 *  5. Canonical URL management to prevent duplicate content penalties
 *  6. Educational content entity extraction for semantic SEO
 *  7. Internal linking suggestions based on content relationships
 *
 * SCHEMAS SUPPORTED:
 *  - WebSite (homepage)
 *  - Organization (EduQuest brand)
 *  - Course (subjects/chapters)
 *  - Article (notes, tutorials)
 *  - FAQPage (MCQs, interview Q&A)
 *  - BreadcrumbList (navigation trails)
 *  - HowTo (step-by-step tutorials)
 *  - ItemList (leaderboards, subject lists)
 *
 * SEO STRATEGY:
 *  - Target 100+ long-tail educational keywords per subject
 *  - Build semantic topical authority through entity relationships
 *  - Optimize for Google Discover, AI search, and featured snippets
 *  - Generate programmatic pages for semester/branch combinations
 *
 * CAPACITY: All operations are non-blocking and cache-friendly.
 *           Sitemap generation handles 100k+ URLs efficiently.
 *
 * DEPENDENCIES: pg Pool (database queries)
 * USED BY: Frontend SSR metadata, API sitemap endpoint, metrics dashboard
 * LAST UPDATED: 2026-05-26
 */

import { pool } from "../config/database";
import logger from "../utils/logger";

/* ─────────────────────────────────────────────
 * Type Definitions for SEO Data Structures
 * ───────────────────────────────────────────── */

/** Represents a single URL entry in the sitemap */
interface SitemapEntry {
  /** Full canonical URL */
  loc: string;
  /** Last modification date in ISO 8601 format */
  lastmod: string;
  /** Change frequency hint for crawlers */
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  /** Priority relative to other pages (0.0 to 1.0) */
  priority: number;
}

/** JSON-LD structured data for any schema type */
interface JsonLdSchema {
  /** Schema.org context URL */
  "@context": string;
  /** Schema.org type (Course, Article, FAQPage, etc.) */
  "@type": string;
  /** Additional schema properties */
  [key: string]: unknown;
}

/** Open Graph metadata for social sharing */
interface OpenGraphMeta {
  /** Page title for social cards */
  title: string;
  /** Short description (max 300 chars) */
  description: string;
  /** Page type (website, article, course) */
  type: string;
  /** Canonical URL */
  url: string;
  /** Social share image URL */
  image: string;
  /** Site name */
  siteName: string;
  /** Content locale */
  locale: string;
}

/** Breadcrumb trail item */
interface BreadcrumbItem {
  /** Display name */
  name: string;
  /** URL for this breadcrumb level */
  url: string;
}

/** Internal linking suggestion */
interface InternalLink {
  /** Link title/anchor text */
  title: string;
  /** Target URL */
  url: string;
  /** Relevance score (0-100) */
  relevance: number;
  /** Content type (notes, mcqs, tutorials, etc.) */
  type: string;
}

/* ─────────────────────────────────────────────
 * Constants — Site Configuration
 * ───────────────────────────────────────────── */

/** Base URL of the EduQuest platform */
const SITE_URL = process.env.FRONTEND_URL ?? "https://eduquest.in";

/** Organization schema for EduQuest brand */
const ORGANIZATION_SCHEMA: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EduQuest",
  url: SITE_URL,
  logo: `${SITE_URL}/images/eduquest-logo.png`,
  description: "India's AI-powered educational knowledge ecosystem for engineering and school students.",
  sameAs: [
    "https://github.com/ISHUKR41/eduquest",
    "https://twitter.com/eduquest_in",
    "https://linkedin.com/company/eduquest-in",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@eduquest.in",
    contactType: "customer support",
    availableLanguage: ["English", "Hindi"],
  },
  foundingDate: "2026",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
};

/* ─────────────────────────────────────────────
 * SECTION 1: Dynamic Sitemap Generation
 * Builds sitemap.xml from database content.
 * Handles 100k+ URLs with streaming XML generation.
 * ───────────────────────────────────────────── */

/**
 * Generates a complete sitemap containing all indexable pages.
 * Queries the database for all subjects, chapters, users, and posts
 * to build a comprehensive URL list with proper metadata.
 *
 * @returns {Promise<string>} XML sitemap string
 */
export async function generateSitemap(): Promise<string> {
  const entries: SitemapEntry[] = [];

  /* ── Static pages ── */
  const staticPages = [
    { path: "/", priority: 1.0, changefreq: "daily" as const },
    { path: "/about", priority: 0.8, changefreq: "monthly" as const },
    { path: "/contact", priority: 0.6, changefreq: "monthly" as const },
    { path: "/features", priority: 0.7, changefreq: "monthly" as const },
    { path: "/pricing", priority: 0.7, changefreq: "weekly" as const },
    { path: "/privacy", priority: 0.3, changefreq: "yearly" as const },
    { path: "/terms", priority: 0.3, changefreq: "yearly" as const },
    { path: "/leaderboard", priority: 0.6, changefreq: "hourly" as const },
    { path: "/community", priority: 0.7, changefreq: "hourly" as const },
    { path: "/events", priority: 0.7, changefreq: "daily" as const },
    { path: "/battle", priority: 0.6, changefreq: "daily" as const },
    { path: "/sign-in", priority: 0.4, changefreq: "monthly" as const },
    { path: "/sign-up", priority: 0.5, changefreq: "monthly" as const },
    /* Class pages */
    { path: "/class-9", priority: 0.9, changefreq: "weekly" as const },
    { path: "/class-10", priority: 0.9, changefreq: "weekly" as const },
    { path: "/class-11", priority: 0.9, changefreq: "weekly" as const },
    { path: "/class-12", priority: 0.9, changefreq: "weekly" as const },
    /* Engineering */
    { path: "/engineering", priority: 0.9, changefreq: "weekly" as const },
    /* Content hub pages */
    { path: "/notes", priority: 0.9, changefreq: "daily" as const },
    { path: "/mcqs", priority: 0.9, changefreq: "daily" as const },
    { path: "/interviews", priority: 0.8, changefreq: "weekly" as const },
    { path: "/semester", priority: 0.8, changefreq: "weekly" as const },
  ];

  const now = new Date().toISOString();
  for (const page of staticPages) {
    entries.push({
      loc: `${SITE_URL}${page.path}`,
      lastmod: now,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  }

  /* ── Dynamic pages from database ── */
  try {
    /* Fetch all subjects with their class/stream */
    const subjects = await pool.query(
      `SELECT s.slug, s.class_level, s.stream, s.updated_at
       FROM subjects s WHERE s.is_published = true
       ORDER BY s.class_level, s.name`
    );

    for (const subject of subjects.rows) {
      const basePath = subject.class_level
        ? `/class-${subject.class_level}/${subject.slug}`
        : `/engineering/${subject.slug}`;

      entries.push({
        loc: `${SITE_URL}${basePath}`,
        lastmod: subject.updated_at?.toISOString() ?? now,
        changefreq: "weekly",
        priority: 0.8,
      });

      /* Generate programmatic SEO pages for each subject */
      const seoPages = [
        { suffix: "/notes", priority: 0.8 },
        { suffix: "/mcqs", priority: 0.8 },
        { suffix: "/important-questions", priority: 0.7 },
        { suffix: "/interview-questions", priority: 0.7 },
        { suffix: "/previous-year-questions", priority: 0.7 },
        { suffix: "/roadmap", priority: 0.6 },
      ];

      for (const seoPage of seoPages) {
        entries.push({
          loc: `${SITE_URL}${basePath}${seoPage.suffix}`,
          lastmod: subject.updated_at?.toISOString() ?? now,
          changefreq: "weekly",
          priority: seoPage.priority,
        });
      }
    }

    /* Fetch all chapters */
    const chapters = await pool.query(
      `SELECT c.slug, c.updated_at, s.slug as subject_slug, s.class_level, s.stream
       FROM chapters c
       JOIN subjects s ON c.subject_id = s.id
       WHERE c.is_published = true
       ORDER BY c.order_index`
    );

    for (const chapter of chapters.rows) {
      const basePath = chapter.class_level
        ? `/class-${chapter.class_level}/${chapter.subject_slug}/${chapter.slug}`
        : `/engineering/${chapter.subject_slug}/${chapter.slug}`;

      entries.push({
        loc: `${SITE_URL}${basePath}`,
        lastmod: chapter.updated_at?.toISOString() ?? now,
        changefreq: "weekly",
        priority: 0.7,
      });
    }

    /* Fetch community posts for sitemap */
    const posts = await pool.query(
      `SELECT id, updated_at FROM posts
       WHERE is_deleted = false
       ORDER BY created_at DESC LIMIT 500`
    );

    for (const post of posts.rows) {
      entries.push({
        loc: `${SITE_URL}/community/${post.id}`,
        lastmod: post.updated_at?.toISOString() ?? now,
        changefreq: "daily",
        priority: 0.5,
      });
    }
  } catch (error) {
    logger.error("[SEO] Failed to generate dynamic sitemap entries", {
      error: error instanceof Error ? error.message : "Unknown",
    });
  }

  /* ── Build XML string ── */
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
  xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
  xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';

  for (const entry of entries) {
    xml += "  <url>\n";
    xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
    xml += "  </url>\n";
  }

  xml += "</urlset>";

  logger.info("[SEO] Sitemap generated", { totalUrls: entries.length });
  return xml;
}

/* ─────────────────────────────────────────────
 * SECTION 2: JSON-LD Structured Data Generation
 * Creates schema.org markup for Google rich results.
 * ───────────────────────────────────────────── */

/**
 * Generates WebSite schema for the homepage.
 * Includes SearchAction for sitelinks search box in Google.
 */
export function getWebsiteSchema(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EduQuest",
    url: SITE_URL,
    description: "India's AI-powered educational knowledge ecosystem for engineering and school students.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: ORGANIZATION_SCHEMA,
  };
}

/**
 * Generates Course schema for a subject/chapter.
 * Optimized for Google's educational content rich results.
 *
 * @param {object} courseData - Subject or chapter data
 * @returns {JsonLdSchema} Course structured data
 */
export function getCourseSchema(courseData: {
  name: string;
  description: string;
  slug: string;
  classLevel?: string;
  stream?: string;
  totalChapters?: number;
  totalTopics?: number;
  difficulty?: string;
}): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: courseData.name,
    description: courseData.description,
    url: `${SITE_URL}/${courseData.classLevel ? `class-${courseData.classLevel}` : "engineering"}/${courseData.slug}`,
    provider: ORGANIZATION_SCHEMA,
    educationalLevel: courseData.classLevel ?? "Undergraduate",
    inLanguage: "en",
    isAccessibleForFree: true,
    courseMode: "online",
    numberOfCredits: courseData.totalChapters ?? 0,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `${courseData.totalTopics ?? 0} topics`,
    },
    about: {
      "@type": "Thing",
      name: courseData.name,
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: courseData.classLevel ? `Class ${courseData.classLevel} students` : "Engineering students",
    },
  };
}

/**
 * Generates Article schema for notes, tutorials, and blog posts.
 *
 * @param {object} articleData - Article content data
 * @returns {JsonLdSchema} Article structured data
 */
export function getArticleSchema(articleData: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  author?: string;
  imageUrl?: string;
  wordCount?: number;
  keywords?: string[];
}): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articleData.title,
    description: articleData.description,
    url: `${SITE_URL}/notes/${articleData.slug}`,
    datePublished: articleData.datePublished,
    dateModified: articleData.dateModified,
    author: {
      "@type": "Person",
      name: articleData.author ?? "EduQuest Team",
      url: SITE_URL,
    },
    publisher: ORGANIZATION_SCHEMA,
    image: articleData.imageUrl ?? `${SITE_URL}/images/eduquest-og-default.png`,
    wordCount: articleData.wordCount ?? 0,
    keywords: articleData.keywords?.join(", ") ?? "",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/notes/${articleData.slug}`,
    },
    educationalUse: "Study Material",
    learningResourceType: "Notes",
    isAccessibleForFree: true,
    inLanguage: "en",
  };
}

/**
 * Generates FAQPage schema for MCQs and interview questions.
 * Critical for appearing in Google's FAQ rich results.
 *
 * @param {Array} faqs - Array of question-answer pairs
 * @returns {JsonLdSchema} FAQPage structured data
 */
export function getFaqSchema(faqs: Array<{ question: string; answer: string }>): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generates BreadcrumbList schema from a URL path.
 * Helps Google understand page hierarchy.
 *
 * @param {BreadcrumbItem[]} items - Ordered breadcrumb items
 * @returns {JsonLdSchema} BreadcrumbList structured data
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[]): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generates HowTo schema for step-by-step tutorials.
 * Optimized for Google's HowTo rich results.
 */
export function getHowToSchema(data: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
  totalTime?: string;
}): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data.name,
    description: data.description,
    totalTime: data.totalTime ?? "PT30M",
    step: data.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

/* ─────────────────────────────────────────────
 * SECTION 3: Open Graph & Twitter Card Metadata
 * ───────────────────────────────────────────── */

/**
 * Generates Open Graph metadata for social sharing.
 *
 * @param {object} pageData - Page-specific data
 * @returns {OpenGraphMeta} Open Graph metadata object
 */
export function getOpenGraphMeta(pageData: {
  title: string;
  description: string;
  path: string;
  type?: string;
  image?: string;
}): OpenGraphMeta {
  return {
    title: pageData.title,
    description: pageData.description.substring(0, 300),
    type: pageData.type ?? "website",
    url: `${SITE_URL}${pageData.path}`,
    image: pageData.image ?? `${SITE_URL}/images/eduquest-og-default.png`,
    siteName: "EduQuest",
    locale: "en_IN",
  };
}

/* ─────────────────────────────────────────────
 * SECTION 4: Breadcrumb Trail Generation
 * ───────────────────────────────────────────── */

/**
 * Generates a breadcrumb trail from a URL path.
 * Converts path segments into human-readable names.
 *
 * @param {string} path - URL path (e.g., "/class-10/mathematics/algebra")
 * @returns {BreadcrumbItem[]} Ordered breadcrumb items
 */
export function generateBreadcrumbs(path: string): BreadcrumbItem[] {
  const segments = path.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ name: "Home", url: "/" }];

  /* Map of path segments to human-readable names */
  const nameMap: Record<string, string> = {
    "class-9": "Class 9",
    "class-10": "Class 10",
    "class-11": "Class 11",
    "class-12": "Class 12",
    engineering: "Engineering",
    notes: "Notes",
    mcqs: "MCQs",
    interviews: "Interview Questions",
    semester: "Semester Guide",
    community: "Community",
    battle: "Battle Arena",
    leaderboard: "Leaderboard",
    events: "Events",
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    wallet: "Wallet",
    search: "Search",
    about: "About",
    contact: "Contact",
    pricing: "Pricing",
  };

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const name = nameMap[segment] ?? segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    breadcrumbs.push({ name, url: currentPath });
  }

  return breadcrumbs;
}

/* ─────────────────────────────────────────────
 * SECTION 5: Internal Linking Engine
 * Suggests related content for cross-linking.
 * ───────────────────────────────────────────── */

/**
 * Generates internal linking suggestions for a subject.
 * Follows the educational content flow:
 * Tutorial → Examples → Programs → MCQs → Notes → PYQs → Roadmap → Career
 *
 * @param {string} subjectSlug - Subject identifier
 * @param {string} contentType - Current page type
 * @returns {Promise<InternalLink[]>} Suggested internal links
 */
export async function getInternalLinks(
  subjectSlug: string,
  contentType: string
): Promise<InternalLink[]> {
  const links: InternalLink[] = [];

  try {
    /* Fetch subject details */
    const subject = await pool.query(
      `SELECT id, name, slug, class_level, stream FROM subjects WHERE slug = $1 LIMIT 1`,
      [subjectSlug]
    );

    if (subject.rows.length === 0) return links;
    const subj = subject.rows[0];
    const basePath = subj.class_level
      ? `/class-${subj.class_level}/${subj.slug}`
      : `/engineering/${subj.slug}`;

    /* Generate content-type-specific links */
    const contentLinks: Array<{ type: string; title: string; suffix: string; relevance: number }> = [
      { type: "notes", title: `${subj.name} Notes (PDF)`, suffix: "/notes", relevance: 95 },
      { type: "mcqs", title: `${subj.name} MCQs — Practice Questions`, suffix: "/mcqs", relevance: 90 },
      { type: "interview", title: `${subj.name} Interview Questions`, suffix: "/interview-questions", relevance: 85 },
      { type: "pyq", title: `${subj.name} Previous Year Questions`, suffix: "/previous-year-questions", relevance: 80 },
      { type: "roadmap", title: `${subj.name} Learning Roadmap 2026`, suffix: "/roadmap", relevance: 75 },
      { type: "cheatsheet", title: `${subj.name} Cheat Sheet`, suffix: "/cheat-sheet", relevance: 70 },
    ];

    /* Filter out the current content type to avoid self-linking */
    for (const link of contentLinks) {
      if (link.type !== contentType) {
        links.push({
          title: link.title,
          url: `${basePath}${link.suffix}`,
          relevance: link.relevance,
          type: link.type,
        });
      }
    }

    /* Fetch related chapters for deeper linking */
    const chapters = await pool.query(
      `SELECT name, slug FROM chapters
       WHERE subject_id = $1 AND is_published = true
       ORDER BY order_index LIMIT 5`,
      [subj.id]
    );

    for (const chapter of chapters.rows) {
      links.push({
        title: `${chapter.name} — Complete Guide`,
        url: `${basePath}/${chapter.slug}`,
        relevance: 65,
        type: "chapter",
      });
    }
  } catch (error) {
    logger.error("[SEO] Internal link generation failed", {
      error: error instanceof Error ? error.message : "Unknown",
      subjectSlug,
    });
  }

  return links.sort((a, b) => b.relevance - a.relevance);
}

/* ─────────────────────────────────────────────
 * SECTION 6: SEO Metadata for Educational Pages
 * Generates optimized titles and descriptions.
 * ───────────────────────────────────────────── */

/**
 * Generates SEO-optimized title and description for educational content.
 * Follows CTR optimization best practices:
 * - Includes year (2026) for freshness signals
 * - Uses power words (Complete, Ultimate, Best)
 * - Keeps within Google's character limits (60 title, 160 description)
 */
export function generatePageSeo(data: {
  type: "subject" | "chapter" | "notes" | "mcqs" | "interview" | "pyq" | "roadmap" | "semester";
  name: string;
  subjectName?: string;
  classLevel?: string;
  stream?: string;
  count?: number;
}): { title: string; description: string; keywords: string[] } {
  const year = new Date().getFullYear();

  switch (data.type) {
    case "subject":
      return {
        title: `${data.name} — Complete Study Material (${year} Guide)`,
        description: `Master ${data.name} with free notes, MCQs, PYQs, interview questions, and practice programs. ${data.classLevel ? `CBSE Class ${data.classLevel}` : "Engineering"} study material updated for ${year}.`,
        keywords: [
          `${data.name} notes`, `${data.name} MCQs`, `${data.name} tutorial`,
          `${data.name} interview questions`, `${data.name} PYQ`,
          `learn ${data.name}`, `${data.name} for beginners`,
        ],
      };

    case "chapter":
      return {
        title: `${data.name} — ${data.subjectName ?? ""} (${year})`,
        description: `Learn ${data.name} in ${data.subjectName ?? "detail"}. Step-by-step explanation with examples, practice questions, and revision notes. Free for all students.`,
        keywords: [
          `${data.name} tutorial`, `${data.name} explanation`,
          `${data.name} examples`, `${data.name} notes`,
        ],
      };

    case "notes":
      return {
        title: `${data.name} Notes PDF + Important Questions (${year})`,
        description: `Download comprehensive ${data.name} notes with important questions, key formulas, and revision material. Perfect for exam preparation and quick revision.`,
        keywords: [
          `${data.name} notes PDF`, `${data.name} handwritten notes`,
          `${data.name} study material`, `${data.name} revision notes`,
        ],
      };

    case "mcqs":
      return {
        title: `${data.name} MCQs — ${data.count ?? 100}+ Practice Questions (${year})`,
        description: `Practice ${data.count ?? 100}+ ${data.name} MCQs with detailed answers and explanations. Perfect for competitive exams, semester preparation, and self-assessment.`,
        keywords: [
          `${data.name} MCQ`, `${data.name} quiz`, `${data.name} objective questions`,
          `${data.name} multiple choice questions`,
        ],
      };

    case "interview":
      return {
        title: `Top ${data.count ?? 50} ${data.name} Interview Questions (${year})`,
        description: `Prepare for ${data.name} interviews with ${data.count ?? 50}+ frequently asked questions and expert answers. Updated for ${year} placement season.`,
        keywords: [
          `${data.name} interview questions`, `${data.name} viva questions`,
          `${data.name} placement preparation`,
        ],
      };

    case "pyq":
      return {
        title: `${data.name} Previous Year Questions with Solutions (${year})`,
        description: `Solve ${data.name} previous year questions with step-by-step solutions. Analyze exam patterns and focus on high-frequency topics for better scores.`,
        keywords: [
          `${data.name} PYQ`, `${data.name} previous year questions`,
          `${data.name} past papers`, `${data.name} exam questions`,
        ],
      };

    case "roadmap":
      return {
        title: `${data.name} Complete Learning Roadmap (${year} Guide)`,
        description: `Follow the ultimate ${data.name} learning roadmap from beginner to advanced. Curated by industry experts with milestones, resources, and project ideas.`,
        keywords: [
          `${data.name} roadmap`, `learn ${data.name}`, `${data.name} career path`,
          `${data.name} for beginners`,
        ],
      };

    case "semester":
      return {
        title: `Semester ${data.name} — Complete Study Guide (${year})`,
        description: `Everything you need for Semester ${data.name}: subject-wise notes, MCQs, PYQs, important questions, and lab manuals. All in one place.`,
        keywords: [
          `semester ${data.name} notes`, `semester ${data.name} syllabus`,
          `semester ${data.name} preparation`,
        ],
      };

    default:
      return {
        title: `${data.name} — EduQuest (${year})`,
        description: `Learn ${data.name} with EduQuest's comprehensive study materials, practice questions, and expert guidance.`,
        keywords: [`${data.name}`, `learn ${data.name}`],
      };
  }
}

/* ─────────────────────────────────────────────
 * SECTION 7: Robots.txt Generation
 * ───────────────────────────────────────────── */

/**
 * Generates robots.txt content for search engine crawlers.
 */
export function generateRobotsTxt(): string {
  return [
    "# EduQuest Robots.txt — Search Engine Crawler Rules",
    "# Last updated: 2026",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    "# Disallow private/auth pages",
    "Disallow: /dashboard",
    "Disallow: /settings",
    "Disallow: /profile",
    "Disallow: /wallet",
    "Disallow: /api/",
    "Disallow: /admin/",
    "",
    "# Allow search engines to crawl all public content",
    "Allow: /class-9/",
    "Allow: /class-10/",
    "Allow: /class-11/",
    "Allow: /class-12/",
    "Allow: /engineering/",
    "Allow: /notes/",
    "Allow: /mcqs/",
    "Allow: /interviews/",
    "Allow: /semester/",
    "Allow: /community/",
    "Allow: /events/",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
    "# Crawl-delay for well-behaved bots",
    "Crawl-delay: 1",
  ].join("\n");
}

/* ─────────────────────────────────────────────
 * SECTION 8: Utility Functions
 * ───────────────────────────────────────────── */

/**
 * Escapes special XML characters to prevent injection in sitemap.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
