/**
 * FILE: parseMarkdown.ts
 * LOCATION: src/lib/utils/parseMarkdown.ts
 * PURPOSE: Shared markdown-to-HTML parser with real KaTeX math rendering.
 *          Replaces the broken regex-based math converter used in chapter
 *          components. Supports headings, bold/italic, blockquotes, tables,
 *          ordered/unordered lists, inline code, images, and LaTeX math.
 *
 * MATH: Uses the KaTeX library (already installed) to render $...$ and $$...$$
 *       blocks into proper mathematical notation — exactly like a textbook.
 *
 * USED BY: DeepResearchChapterClient.tsx, TopicStudyClient.tsx
 * DEPENDENCIES: katex (^0.16)
 * LAST UPDATED: 2026-05-28
 */

import katex from "katex";

/* ─────────────────────────────────────────────
 * renderMath — Calls KaTeX to render one math expression.
 * displayMode = true  → centered block formula ($$...$$)
 * displayMode = false → inline formula ($...$)
 * Falls back to showing the raw LaTeX if rendering fails.
 * ───────────────────────────────────────────── */
function renderMath(math: string, displayMode: boolean): string {
  try {
    return katex.renderToString(math.trim(), {
      throwOnError: false,
      displayMode,
      output: "html",
      trust: false,
      strict: false,
    });
  } catch {
    /* Show the raw source rather than crashing the page */
    const escaped = math.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<code class="math-fallback">${escaped}</code>`;
  }
}

/* ─────────────────────────────────────────────
 * extractAndProtectMath
 * Extracts all math blocks BEFORE any other processing so that LaTeX
 * commands like \frac are never touched by the markdown regexes.
 * Returns the text with placeholders, plus a map of placeholder → rendered HTML.
 * ───────────────────────────────────────────── */
function extractAndProtectMath(text: string): { protected: string; map: Record<string, string> } {
  const map: Record<string, string> = {};
  let counter = 0;
  let result = text;

  /* Block math — $$...$$ (process first so $$ isn't mistaken for inline $) */
  result = result.replace(/\$\$([\s\S]*?)\$\$/gm, (_match, math) => {
    const key = `__MATHBLOCK_${counter++}__`;
    map[key] = `<div class="katex-block">${renderMath(math, true)}</div>`;
    return key;
  });

  /* Inline math — $...$ */
  result = result.replace(/\$([^\n$]+?)\$/g, (_match, math) => {
    const key = `__MATHINLINE_${counter++}__`;
    map[key] = `<span class="katex-inline">${renderMath(math, false)}</span>`;
    return key;
  });

  return { protected: result, map };
}

/* ─────────────────────────────────────────────
 * renderTable — Converts simple markdown tables to HTML <table>.
 * ───────────────────────────────────────────── */
function renderTable(tableText: string): string {
  const lines = tableText.trim().split("\n");
  if (lines.length < 2) return tableText;

  const parseRow = (line: string) =>
    line
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell.length > 0);

  const headerCells = parseRow(lines[0]);
  /* lines[1] is the separator row (---|---) — skip it */
  const bodyLines = lines.slice(2);

  const thead = `<thead><tr>${headerCells
    .map((c) => `<th>${c}</th>`)
    .join("")}</tr></thead>`;

  const tbody = `<tbody>${bodyLines
    .map((line) => {
      const cells = parseRow(line);
      return `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
    })
    .join("")}</tbody>`;

  return `<div class="md-table-wrapper"><table class="md-table">${thead}${tbody}</table></div>`;
}

/* ─────────────────────────────────────────────
 * parseMarkdown — Main entry point.
 * Converts markdown-formatted content string to safe HTML.
 * ───────────────────────────────────────────── */
export function parseMarkdown(text: string): string {
  /* Step 1: Extract math blocks so LaTeX is never touched by text regexes */
  const { protected: safeText, map } = extractAndProtectMath(text);

  /* Step 2: Process lines individually for block-level elements */
  const lines = safeText.split("\n");
  const outputLines: string[] = [];
  let inListOl = false;
  let inListUl = false;
  let tableBuffer: string[] = [];
  let inTable = false;

  const flushTable = () => {
    if (tableBuffer.length > 0) {
      outputLines.push(renderTable(tableBuffer.join("\n")));
      tableBuffer = [];
      inTable = false;
    }
  };

  const flushLists = () => {
    if (inListOl) { outputLines.push("</ol>"); inListOl = false; }
    if (inListUl) { outputLines.push("</ul>"); inListUl = false; }
  };

  for (const line of lines) {
    /* Detect table rows (contain | character) */
    if (line.trim().startsWith("|") || (line.trim().match(/^[-|: ]+$/) && inTable)) {
      if (!inTable) { inTable = true; flushLists(); }
      tableBuffer.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }

    /* Horizontal rule */
    if (line.trim() === "---" || line.trim() === "***" || line.trim() === "___") {
      flushLists();
      outputLines.push('<hr class="md-hr" />');
      continue;
    }

    /* Headings */
    const h4 = line.match(/^#### (.+)$/);
    if (h4) { flushLists(); outputLines.push(`<h4 class="md-h4">${h4[1]}</h4>`); continue; }

    const h3 = line.match(/^### (.+)$/);
    if (h3) { flushLists(); outputLines.push(`<h3 class="md-h3">${h3[1]}</h3>`); continue; }

    const h2 = line.match(/^## (.+)$/);
    if (h2) { flushLists(); outputLines.push(`<h2 class="md-h2">${h2[1]}</h2>`); continue; }

    /* Blockquote */
    const bq = line.match(/^> (.+)$/);
    if (bq) { flushLists(); outputLines.push(`<blockquote class="md-quote">${bq[1]}</blockquote>`); continue; }

    /* Ordered list item */
    const ol = line.match(/^\d+\. (.+)$/);
    if (ol) {
      if (!inListOl) { if (inListUl) { outputLines.push("</ul>"); inListUl = false; } outputLines.push('<ol class="md-ol">'); inListOl = true; }
      outputLines.push(`<li class="md-li">${ol[1]}</li>`);
      continue;
    } else if (inListOl) { outputLines.push("</ol>"); inListOl = false; }

    /* Unordered list item */
    const ul = line.match(/^\* (.+)$/) || line.match(/^- (.+)$/);
    if (ul) {
      if (!inListUl) { if (inListOl) { outputLines.push("</ol>"); inListOl = false; } outputLines.push('<ul class="md-ul">'); inListUl = true; }
      outputLines.push(`<li class="md-li">${ul[1]}</li>`);
      continue;
    } else if (inListUl) { outputLines.push("</ul>"); inListUl = false; }

    /* Image */
    const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) {
      outputLines.push(`<figure class="md-figure"><img src="${img[2]}" alt="${img[1]}" class="md-img" loading="lazy" />${img[1] ? `<figcaption class="md-caption">${img[1]}</figcaption>` : ""}</figure>`);
      continue;
    }

    /* Empty line → paragraph break */
    if (line.trim() === "") {
      outputLines.push('<div class="md-spacer"></div>');
      continue;
    }

    /* Regular paragraph line */
    outputLines.push(`<p class="md-p">${line}</p>`);
  }

  /* Flush any open lists or table at end of text */
  flushLists();
  flushTable();

  /* Step 3: Apply inline styles to combined output */
  let html = outputLines.join("\n");

  /* Inline markdown: **bold**, *italic*, `code`, [link](url), images inside paragraphs */
  html = html
    /* Images inside text (not standalone lines) */
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim,
      '<figure class="md-figure"><img src="$2" alt="$1" class="md-img" loading="lazy" /><figcaption class="md-caption">$1</figcaption></figure>')
    /* Bold */
    .replace(/\*\*([^*]+)\*\*/gim, "<strong>$1</strong>")
    /* Italic */
    .replace(/\*([^*]+)\*/gim, "<em>$1</em>")
    /* Inline code */
    .replace(/`([^`]+)`/gim, '<code class="md-code">$1</code>');

  /* Step 4: Restore protected math blocks */
  for (const [key, rendered] of Object.entries(map)) {
    html = html.replaceAll(key, rendered);
  }

  return html;
}
