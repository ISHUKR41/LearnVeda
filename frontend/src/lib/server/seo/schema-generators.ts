/**
 * FILE: schema-generators.ts
 * LOCATION: src/lib/server/seo/schema-generators.ts
 * PURPOSE: Rich Structured Data (JSON-LD) generation engine for Google Search rich features.
 *          Creates highly-optimized, type-safe schema blocks to dominate People Also Ask,
 *          Featured Snippets, Course cards, and Article listings.
 *
 * SCHEMAS GENERATED:
 *  - Course Schema (For CBSE subjects / programming lessons)
 *  - FAQ Schema (For search results accordion integrations)
 *  - Article Schema (For study notes, BTech semester outlines with E-E-A-T signals)
 *  - Breadcrumb Schema (For hierarchical crawl visualization)
 *  - HowTo Schema (For lab manual solutions and coding guidelines)
 *
 * USED BY: All programmatic SEO pages
 * DEPENDENCIES: Node.js process variables, clean JSON-LD structures
 * LAST UPDATED: 2026-05-26
 */

const CANONICAL_DOMAIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eduquest.vercel.app";

interface FAQItem {
  question: string;
  answer: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

/**
 * Generates Google-compliant Course Schema.
 * Displays subject syllabus cards directly in educational search lists.
 */
export function generateCourseSchema(input: {
  name: string;
  description: string;
  providerName?: string;
}): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": input.name,
    "description": input.description,
    "provider": {
      "@type": "Organization",
      "name": input.providerName ?? "EduQuest India",
      "sameAs": CANONICAL_DOMAIN
    }
  };

  return JSON.stringify(schema, null, 2);
}

/**
 * Generates FAQ Page Schema.
 * Optimizes the site to capture 'People Also Ask' accordions in search listings.
 */
export function generateFAQSchema(items: FAQItem[]): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return JSON.stringify(schema, null, 2);
}

/**
 * Generates Article/Blog Schema with rich E-E-A-T authorship signals.
 * Crucial for school syllabus and semester exam prep authority validation.
 */
export function generateArticleSchema(input: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  authorTitle?: string;
  citations?: string[];
}): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": input.title,
    "description": input.description,
    "image": input.imageUrl ?? `${CANONICAL_DOMAIN}/images/eduquest-home-hero.png`,
    "datePublished": input.datePublished,
    "dateModified": input.dateModified,
    "author": {
      "@type": "Person",
      "name": input.authorName,
      "jobTitle": input.authorTitle ?? "Academic Subject Matter Expert",
      "affiliation": {
        "@type": "Organization",
        "name": "EduQuest Faculty Board"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "EduQuest",
      "logo": {
        "@type": "ImageObject",
        "url": `${CANONICAL_DOMAIN}/favicons/home.svg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": input.url
    },
    "citation": input.citations ?? [
      "https://ncert.nic.in/",
      "https://www.cbse.gov.in/"
    ]
  };

  return JSON.stringify(schema, null, 2);
}

/**
 * Generates Breadcrumb Schema.
 * Standardizes clear navigation paths like: Home > Class 9 > Mathematics > Polynomials.
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${CANONICAL_DOMAIN}${item.url}`
    }))
  };

  return JSON.stringify(schema, null, 2);
}

/**
 * Generates HowTo Schema.
 * Tells crawlers step-by-step instructions (e.g. "How to Compile C++ Program").
 */
export function generateHowToSchema(input: {
  name: string;
  description: string;
  steps: HowToStep[];
}): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": input.name,
    "description": input.description,
    "step": input.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "url": step.url ?? `${CANONICAL_DOMAIN}/engineering`
    }))
  };

  return JSON.stringify(schema, null, 2);
}
