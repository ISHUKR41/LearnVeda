/**
 * FILE: internal-linker.ts
 * LOCATION: src/lib/server/seo/internal-linker.ts
 * PURPOSE: Automated semantic internal linking injection engine.
 *          Parses educational text in real-time, matching synonyms of target
 *          educational entities and replacing them with context-aware,
 *          high-CTR internal links.
 *
 * RULES:
 *  - Every programmatic SEO page must present at least 5 to 10 context-relevance links.
 *  - Prevents linking the same URL multiple times inside the same block of text.
 *  - Supports both HTML/JSX and Markdown formats.
 *
 * USED BY: notes/[slug], mcqs/[slug], interviews/[slug], semester/[slug]
 * DEPENDENCIES: topical-authority-map.json, Node.js environment
 * LAST UPDATED: 2026-05-26
 */

import path from "path";
import fs from "fs";

interface EntityMapping {
  name: string;
  synonyms: string[];
  type: string;
  description: string;
  related_topics: string[];
  anchor_texts: string[];
}

interface LinkingCluster {
  hub: string;
  nodes: string[];
}

interface TopicalAuthorityMap {
  niche: string;
  domain: string;
  target_audiences: string[];
  primary_hubs: Record<string, unknown>;
  semantic_entities: EntityMapping[];
  linking_clusters: LinkingCluster[];
}

// Load the topical authority map JSON dynamically
let authorityMap: TopicalAuthorityMap | null = null;
try {
  // Try relative path from runtime
  const mapPath = path.join(process.cwd(), "src/lib/server/seo/topical-authority-map.json");
  if (fs.existsSync(mapPath)) {
    const rawData = fs.readFileSync(mapPath, "utf-8");
    authorityMap = JSON.parse(rawData);
  }
} catch (error) {
  console.error("[Internal Linker] Failed to load topical-authority-map.json:", error);
}

/**
 * Helper to retrieve target links associated with a matching entity name or synonym.
 */
function getLinkForEntity(entityName: string): { href: string; anchorText: string } | null {
  if (!authorityMap) return null;

  const entity = authorityMap.semantic_entities.find(
    (e) =>
      e.name.toLowerCase() === entityName.toLowerCase() ||
      e.synonyms.some((syn) => syn.toLowerCase() === entityName.toLowerCase())
  );

  if (!entity) return null;

  // Find associated linking cluster to resolve path
  const cluster = authorityMap.linking_clusters.find((c) => c.hub.toLowerCase() === entity.name.toLowerCase());
  const href = cluster && cluster.nodes.length > 0 ? cluster.nodes[0] : "/";
  
  // Pick a random anchor text for organic variation
  const anchorText = entity.anchor_texts[Math.floor(Math.random() * entity.anchor_texts.length)] || entity.name;

  return { href, anchorText };
}

/**
 * Automates semantic internal link injection in a block of HTML text.
 * Avoids overwriting existing <a> tags or image tags.
 *
 * @param content - Raw HTML content of the page
 * @returns Fully linked HTML content
 */
export function injectInternalLinks(content: string): string {
  if (!authorityMap) return content;

  let processed = content;
  const linkedUrls = new Set<string>();

  // Extract all entity names and synonyms sorted by length descending (to match longest synonyms first)
  const synonymsMap = new Map<string, EntityMapping>();
  authorityMap.semantic_entities.forEach((entity) => {
    synonymsMap.set(entity.name.toLowerCase(), entity);
    entity.synonyms.forEach((syn) => synonymsMap.set(syn.toLowerCase(), entity));
  });

  const sortedSynonyms = Array.from(synonymsMap.keys()).sort((a, b) => b.length - a.length);

  // Iterate over matching synonyms and replace the first occurrence in non-linked text
  for (const synonym of sortedSynonyms) {
    const target = getLinkForEntity(synonym);
    if (!target) continue;

    // Skip if we have already linked to this URL in this page block to prevent keyword stuff
    if (linkedUrls.has(target.href)) continue;

    // Regex to match the word only outside existing <a> tags or HTML attribute definitions
    // Matches the synonym as a whole word case-insensitively
    const escapeRegex = (str: string) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(?<!<a[^>]*>|href=["']|src=["']|class=["'])\\b(${escapeRegex(synonym)})\\b(?![^<]*</a>)(?![^<]*>)`, "i");

    if (regex.test(processed)) {
      processed = processed.replace(regex, `<a href="${target.href}" class="underline text-blue-600 hover:text-blue-800 transition-colors font-semibold" title="${target.anchorText}">$1</a>`);
      linkedUrls.add(target.href);
    }
  }

  return processed;
}

/**
 * Returns a list of structured related-topics cards to render in programmatic sidebars.
 * Captures secondary links dynamically to guarantee minimum 10 internal links per page.
 */
export function getRelatedLinksList(hubSlug: string): Array<{ name: string; href: string }> {
  if (!authorityMap) return [];

  const list: Array<{ name: string; href: string }> = [];

  // Find current active hub
  const entity = authorityMap.semantic_entities.find(
    (e) => e.name.toLowerCase() === hubSlug.toLowerCase()
  );

  if (entity) {
    // Find related topics and fetch paths
    entity.related_topics.forEach((topic) => {
      const topicEntity = authorityMap?.semantic_entities.find(
        (e) => e.name.toLowerCase() === topic.toLowerCase()
      );
      if (topicEntity) {
        const cluster = authorityMap?.linking_clusters.find((c) => c.hub.toLowerCase() === topicEntity.name.toLowerCase());
        if (cluster && cluster.nodes.length > 0) {
          list.push({
            name: topicEntity.anchor_texts[0] || topicEntity.name,
            href: cluster.nodes[0],
          });
        }
      }
    });
  }

  // Fallback links to ensure we always present links count
  if (list.length < 5) {
    list.push({ name: "Class 9 Curriculum", href: "/class-9" });
    list.push({ name: "Class 10 Board Prep", href: "/class-10" });
    list.push({ name: "Class 11 Science Tracks", href: "/class-11" });
    list.push({ name: "Class 12 Prep Portal", href: "/class-12" });
    list.push({ name: "Engineering Placement Dashboard", href: "/engineering" });
  }

  return list;
}
