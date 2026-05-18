/**
 * FILE: subject-routing.ts
 * LOCATION: src/lib/curriculum/subject-routing.ts
 * PURPOSE: Shared subject/chapter URL builders for class routes. This keeps
 *          path generation consistent across search results, subject cards, and
 *          chapter detail deep links.
 * USED BY: Class pages, search API, subject plan rendering
 * LAST UPDATED: 2026-05-18
 */

/**
 * Core route payload needed to build a canonical subject URL.
 */
export interface SubjectRouteInput {
  track: string;
  slug: string;
  stream?: string | null;
}

/** Lowercases and keeps only URL-safe slug characters. */
export function sanitizeSlugSegment(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
}

/** Removes the leading track prefix from database subject slugs. */
function trimTrackPrefix(track: string, slug: string): string {
  const prefix = `${track}-`;
  return slug.startsWith(prefix) ? slug.slice(prefix.length) : slug;
}

/**
 * Converts a DB subject row into the route path used by the frontend.
 * Examples:
 * - class-9 + class-9-mathematics -> /class-9/mathematics
 * - class-11 + class-11-science-physics -> /class-11/science/physics
 */
export function buildSubjectPath({ track, slug, stream }: SubjectRouteInput): string {
  const baseSegment = trimTrackPrefix(track, slug);

  if ((track === "class-11" || track === "class-12") && stream) {
    const streamPrefix = `${stream}-`;
    const subjectSegment = baseSegment.startsWith(streamPrefix)
      ? baseSegment.slice(streamPrefix.length)
      : baseSegment;
    return `/${track}/${sanitizeSlugSegment(stream)}/${sanitizeSlugSegment(subjectSegment)}`;
  }

  return `/${track}/${sanitizeSlugSegment(baseSegment)}`;
}

/** Builds a chapter deep-link from a subject route payload and chapter slug. */
export function buildChapterPath(subject: SubjectRouteInput, chapterSlug: string): string {
  return `${buildSubjectPath(subject)}/${sanitizeSlugSegment(chapterSlug)}`;
}

