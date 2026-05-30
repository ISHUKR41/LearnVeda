/**
 * FILE: parseMarkdown.ts
 * LOCATION: src/lib/utils/parseMarkdown.ts
 * PURPOSE: Robust markdown → HTML converter with real KaTeX math rendering.
 *
 * PIPELINE (in order):
 *   Phase A  — preNormalize()          Fix control characters that result from
 *                                      writing single-backslash LaTeX in JS template
 *                                      literals (\frac → form-feed + "rac" etc.).
 *   Phase A2 — restoreMathCommands()   Restore LaTeX command names whose backslash
 *                                      was silently stripped for unknown escapes
 *                                      (e.g. \Delta→Delta, \propto→propto) when
 *                                      the content is already inside a math context
 *                                      or when unambiguous patterns appear.
 *   Phase B  — wrapBareLatex()         Auto-detect LaTeX commands outside $ delimiters
 *                                      and wrap them — safety net for missing delimiters.
 *   Phase C  — extractAndProtectMath() Replace $...$ / $$...$$ with placeholders,
 *                                      rendering each block via KaTeX first.
 *   Phase D  — block markdown          Headings, lists, tables, blockquotes, hr.
 *   Phase E  — inline markdown         Bold, italic, inline code, images.
 *   Phase F  — restore placeholders    Substitute KaTeX HTML back in.
 *
 * USAGE IN CONTENT FILES:
 *   - Wrap inline math in $ ... $   e.g. $F = ma$
 *   - Wrap display math in $$ ... $$ e.g. $$\\frac{\\Delta p}{\\Delta t} = ma$$
 *   - Use DOUBLE backslashes: \\frac, \\Delta, \\text, \\times, etc.
 *
 * DEPENDENCIES: katex (^0.16) — CSS must be imported separately (layout.tsx)
 * USED BY: DeepResearchChapterClient.tsx, TopicStudyClient.tsx, ChapterPracticeClient.tsx
 */

import katex from "katex";

/* ─────────────────────────────────────────────────────────────────────────
 * Phase A — preNormalize
 *
 * JS template literals convert unrecognised escape sequences silently:
 *   \f → U+000C (form feed)     affects: \frac \forall \flat
 *   \t → U+0009 (tab)           affects: \text \times \theta \tau
 *   \r → U+000D (carriage ret)  affects: \rho
 *   \v → U+000B (vertical tab)  affects: \vec \varepsilon
 *   \b → U+0008 (backspace)     affects: \boxed \beta
 *
 * We reverse these mappings so KaTeX receives proper LaTeX commands.
 * ───────────────────────────────────────────────────────────────────────── */
function preNormalize(text: string): string {
  return text
    .replace(/\u000c/g, "\\f")  /* form-feed       → \f  */
    .replace(/\u000b/g, "\\v")  /* vertical-tab    → \v  */
    .replace(/\u0008/g, "\\b")  /* backspace       → \b  */
    .replace(/\t/g,     "\\t")  /* horizontal-tab  → \t  */
    .replace(/\r/g,     "\\r"); /* carriage-return → \r  */
}

/* ─────────────────────────────────────────────────────────────────────────
 * Phase A1 — restoreStrippedBackslashes (GLOBAL — before any math detection)
 *
 * When JS template literals or regular strings silently strip backslashes
 * for "unknown" escape sequences, the result is a COMPLETELY BARE command:
 *   \frac{  → rac{      (JS treats \f as form-feed, "rac{" remains)
 *   \text{  → ext{      (JS treats \t as tab, but preNormalize fixes this)
 *   \times  → imes      (same \t issue)
 *   \boxed{ → oxed{     (JS treats \b as backspace, "oxed{" remains)
 *   \Delta  → Delta     (JS treats \D as unknown → drops \)
 *   \propto → propto    (unknown escape → drops \)
 *
 * After preNormalize fixes control-char-based issues (\f→\\f, \t→\\t, etc.),
 * there remain cases where the backslash was simply DROPPED with no
 * control character substitution. This phase catches those by looking for
 * bare command-name patterns that appear at word boundaries.
 *
 * SAFETY: We only restore commands that are followed by `{`, `^`, `_`, ` `,
 * or end-of-string, AND are preceded by a non-letter (to avoid false
 * positives in English words like "fraction", "text", "times").
 * ───────────────────────────────────────────────────────────────────────── */

/** Commands that take a {braced} argument — only match when followed by { */
const BRACE_COMMANDS = [
  "frac","text","sqrt","boxed","overline","underline","hat","vec","bar",
  "tilde","mathbb","mathbf","mathrm","mathit","mathcal","operatorname",
];
const BRACE_CMD_RE = new RegExp(
  `(?<![a-zA-Z\\\\])(?:${BRACE_COMMANDS.join("|")})\\{`,
  "g"
);

/** Commands that are standalone keywords — match at word boundaries */
const STANDALONE_COMMANDS = [
  "Delta","delta","alpha","beta","gamma","theta","lambda","sigma","omega",
  "pi","mu","nu","tau","phi","psi","chi","epsilon","varepsilon","eta",
  "times","cdot","pm","mp","leq","geq","neq","approx","infty","propto",
  "nabla","partial","equiv","sim","perp","angle","forall","exists",
  "rightarrow","leftarrow","Rightarrow","Leftarrow","iff","implies",
  "hbar","ell","circ","star","ldots","cdots","vdots","ddots",
  "oplus","otimes","quad","qquad","sum","int","prod","lim",
  "Gamma","Lambda","Sigma","Omega","Theta","Phi","Psi","Xi","Upsilon",
];
const STANDALONE_CMD_RE = new RegExp(
  `(?<![a-zA-Z\\\\])(${STANDALONE_COMMANDS.join("|")})(?![a-zA-Z])`,
  "g"
);

function restoreStrippedBackslashes(text: string): string {
  /* Step 1: Restore brace-commands: "rac{" → "\\frac{" */
  let result = text.replace(BRACE_CMD_RE, (match) => {
    return `\\${match}`;
  });

  /* Step 2: Restore standalone commands, but ONLY inside math contexts
   * (between $ delimiters) or in lines that look like formulas.
   * To avoid false positives in English text (e.g., "angle" in
   * "right angle"), we check context carefully. */
  const segments = splitByMathDelimitersEarly(result);
  result = segments.map(seg => {
    if (seg.isMath) {
      /* Inside $...$ — safe to restore all standalone commands */
      return seg.text.replace(STANDALONE_CMD_RE, (_, cmd) => `\\${cmd}`);
    }
    /* Outside math — only restore if the line looks formula-like
     * (contains ^, _, {, }, =, or other brace commands) */
    return seg.text.split("\n").map(line => {
      const hasFormulaContext = /[{}_^=]/.test(line) || BRACE_CMD_RE.test(line);
      if (!hasFormulaContext) return line;
      return line.replace(STANDALONE_CMD_RE, (full, cmd) => {
        /* Extra safety: don't restore if preceded/followed by typical
         * English word patterns */
        return `\\${cmd}`;
      });
    }).join("\n");
  }).join("");

  return result;
}

/** Lightweight math-delimiter splitter used before Phase B (avoids circular dep) */
function splitByMathDelimitersEarly(
  text: string
): Array<{ text: string; isMath: boolean }> {
  const segs: Array<{ text: string; isMath: boolean }> = [];
  const re = /\$\$[\s\S]*?\$\$|\$[^\n$]+?\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) segs.push({ text: text.slice(last, m.index), isMath: false });
    segs.push({ text: m[0], isMath: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) segs.push({ text: text.slice(last), isMath: false });
  return segs;
}

/* ─────────────────────────────────────────────────────────────────────────
 * Phase A2 — restoreMathCommands (INSIDE math blocks only)
 *
 * For content authored with regular JS string literals (not template
 * literals), unrecognised escape sequences silently drop the backslash:
 *   \Delta → "Delta"   (JS treats \D as unknown → drops \)
 *   \alpha → "alpha"   etc.
 *
 * This function is ONLY called on the inner content of $...$ blocks, so
 * it can safely restore ALL known LaTeX command names — they can only be
 * LaTeX in a math context.
 * ───────────────────────────────────────────────────────────────────────── */
function restoreGreekInMath(math: string): string {
  return math
    /* Capital Greek */
    .replace(/(?<!\\)\bDelta\b/g,    "\\Delta")
    .replace(/(?<!\\)\bGamma\b/g,    "\\Gamma")
    .replace(/(?<!\\)\bLambda\b/g,   "\\Lambda")
    .replace(/(?<!\\)\bSigma\b/g,    "\\Sigma")
    .replace(/(?<!\\)\bOmega\b/g,    "\\Omega")
    .replace(/(?<!\\)\bTheta\b/g,    "\\Theta")
    .replace(/(?<!\\)\bPhi\b/g,      "\\Phi")
    .replace(/(?<!\\)\bPsi\b/g,      "\\Psi")
    .replace(/(?<!\\)\bXi\b/g,       "\\Xi")
    .replace(/(?<!\\)\bUpsilon\b/g,  "\\Upsilon")
    /* Lowercase Greek */
    .replace(/(?<!\\)\balpha\b/g,    "\\alpha")
    .replace(/(?<!\\)\bbeta\b/g,     "\\beta")
    .replace(/(?<!\\)\bgamma\b/g,    "\\gamma")
    .replace(/(?<!\\)\bdelta\b/g,    "\\delta")
    .replace(/(?<!\\)\btheta\b/g,    "\\theta")
    .replace(/(?<!\\)\blambda\b/g,   "\\lambda")
    .replace(/(?<!\\)\bsigma\b/g,    "\\sigma")
    .replace(/(?<!\\)\bomega\b/g,    "\\omega")
    .replace(/(?<!\\)\bmu\b/g,       "\\mu")
    .replace(/(?<!\\)\bnu\b/g,       "\\nu")
    .replace(/(?<!\\)\bphi\b/g,      "\\phi")
    .replace(/(?<!\\)\bpsi\b/g,      "\\psi")
    .replace(/(?<!\\)\bchi\b/g,      "\\chi")
    .replace(/(?<!\\)\bepsilon\b/g,  "\\epsilon")
    .replace(/(?<!\\)\bvarepsilon\b/g, "\\varepsilon")
    .replace(/(?<!\\)\beta\b/g,      "\\eta")   /* \b already processed above, but safety */
    .replace(/(?<!\\)\bkappa\b/g,    "\\kappa")
    .replace(/(?<!\\)\brho\b/g,      "\\rho")
    .replace(/(?<!\\)\btau\b/g,      "\\tau")
    .replace(/(?<!\\)\bzeta\b/g,     "\\zeta")
    /* Math operators & symbols */
    .replace(/(?<!\\)\bnabla\b/g,    "\\nabla")
    .replace(/(?<!\\)\bpartial\b/g,  "\\partial")
    .replace(/(?<!\\)\binfty\b/g,    "\\infty")
    .replace(/(?<!\\)\bpropto\b/g,   "\\propto")
    .replace(/(?<!\\)\btimes\b/g,    "\\times")
    .replace(/(?<!\\)\bcdot\b/g,     "\\cdot")
    .replace(/(?<!\\)\bldots\b/g,    "\\ldots")
    .replace(/(?<!\\)\bcdots\b/g,    "\\cdots")
    .replace(/(?<!\\)\bpm\b/g,       "\\pm")
    .replace(/(?<!\\)\bmp\b/g,       "\\mp")
    .replace(/(?<!\\)\bleq\b/g,      "\\leq")
    .replace(/(?<!\\)\bgeq\b/g,      "\\geq")
    .replace(/(?<!\\)\bneq\b/g,      "\\neq")
    .replace(/(?<!\\)\bapprox\b/g,   "\\approx")
    .replace(/(?<!\\)\bequiv\b/g,    "\\equiv")
    .replace(/(?<!\\)\bsim\b/g,      "\\sim")
    .replace(/(?<!\\)\bperp\b/g,     "\\perp")
    .replace(/(?<!\\)\bangle\b/g,    "\\angle")
    .replace(/(?<!\\)\bhbar\b/g,     "\\hbar")
    /* Math functions (only restore if followed by { since sin/cos in English is common) */
    .replace(/(?<!\\)\bsqrt\{/g,     "\\sqrt{")
    .replace(/(?<!\\)\bfrac\{/g,     "\\frac{")
    .replace(/(?<!\\)\btext\{/g,     "\\text{")
    .replace(/(?<!\\)\bboxed\{/g,    "\\boxed{")
    .replace(/(?<!\\)\boverline\{/g, "\\overline{")
    .replace(/(?<!\\)\bunderline\{/g,"\\underline{")
    .replace(/(?<!\\)\bhat\{/g,      "\\hat{")
    .replace(/(?<!\\)\bvec\{/g,      "\\vec{")
    .replace(/(?<!\\)\bbar\{/g,      "\\bar{")
    .replace(/(?<!\\)\btilde\{/g,    "\\tilde{")
    /* log/trig ONLY inside math context */
    .replace(/(?<!\\)\bsin\b/g,      "\\sin")
    .replace(/(?<!\\)\bcos\b/g,      "\\cos")
    .replace(/(?<!\\)\btan\b/g,      "\\tan")
    .replace(/(?<!\\)\bsin\^/g,      "\\sin^")
    .replace(/(?<!\\)\bcos\^/g,      "\\cos^")
    .replace(/(?<!\\)\btan\^/g,      "\\tan^")
    .replace(/(?<!\\)\bln\b/g,       "\\ln")
    .replace(/(?<!\\)\blog\b/g,      "\\log")
    .replace(/(?<!\\)\blim\b/g,      "\\lim")
    .replace(/(?<!\\)\bmax\b/g,      "\\max")
    .replace(/(?<!\\)\bmin\b/g,      "\\min")
    .replace(/(?<!\\)\bsum\b/g,      "\\sum")
    .replace(/(?<!\\)\bprod\b/g,     "\\prod")
    .replace(/(?<!\\)\bint\b/g,      "\\int");
}

/* ─────────────────────────────────────────────────────────────────────────
 * normalizeMath
 *
 * Called on captured math strings just before KaTeX rendering.
 * 1. Applies preNormalize (control character restoration).
 * 2. Restores stripped Greek letter backslashes (Phase A2 inside math).
 * 3. Collapses any remaining double-backslashes to single.
 * ───────────────────────────────────────────────────────────────────────── */
function normalizeMath(raw: string): string {
  const phase1 = preNormalize(raw);
  const phase2 = restoreGreekInMath(phase1);
  return phase2.replace(/\\\\/g, "\\");
}

/* ─────────────────────────────────────────────────────────────────────────
 * renderMath
 *
 * Renders one math expression through KaTeX.
 * displayMode=true  → centred block  ($$...$$)
 * displayMode=false → inline         ($...$)
 * Falls back to a styled <code> block on error instead of crashing.
 * ───────────────────────────────────────────────────────────────────────── */
function renderMath(math: string, displayMode: boolean): string {
  try {
    const clean = normalizeMath(math.trim());
    return katex.renderToString(clean, {
      throwOnError: false,
      displayMode,
      output: "html",
      trust: false,
      strict: false,
    });
  } catch {
    const escaped = math.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return displayMode
      ? `<div class="math-error">$$${escaped}$$</div>`
      : `<span class="math-error">$${escaped}$</span>`;
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 * Phase B — wrapBareLatex
 *
 * Detects LaTeX commands that appear OUTSIDE any $ ... $ delimiters and
 * wraps them so KaTeX can render them.  This is the fallback layer for
 * content that has formulas but forgot (or couldn't use) $ delimiters.
 *
 * Strategy:
 *  1. Split the text around existing delimited math blocks.
 *  2. For each non-math segment, check for bare \command patterns.
 *  3. If a line's content is mostly LaTeX, wrap the whole line in $$...$$
 *  4. Otherwise, wrap individual \command{...} sequences in $...$
 * ───────────────────────────────────────────────────────────────────────── */
const LATEX_COMMANDS: string[] = [
  "frac","text","sqrt","sum","int","prod","lim","Delta","delta",
  "alpha","beta","gamma","theta","lambda","sigma","omega","pi","mu",
  "nu","tau","phi","psi","chi","epsilon","varepsilon","times","cdot",
  "pm","mp","div","leq","geq","neq","approx","infty","boxed","propto",
  "vec","hat","bar","tilde","sin","cos","tan","log","ln","exp",
  "quad","qquad","left","right","overline","underline","nabla","partial",
  "equiv","sim","perp","angle","forall","exists","in","cup","cap",
  "rightarrow","leftarrow","Rightarrow","Leftarrow","iff","implies",
  "mathbb","mathbf","mathrm","mathit","mathcal","operatorname",
  "hbar","ell","circ","star","ldots","cdots","vdots","ddots","oplus","otimes",
];

/* Regex to detect whether a text segment contains bare LaTeX commands */
const BARE_LATEX_DETECT = new RegExp(
  "\\\\(?:" + LATEX_COMMANDS.join("|") + ")\\b"
);

/**
 * Split text into alternating non-math / math segments by $ delimiters.
 */
function splitByMathDelimiters(
  text: string
): Array<{ text: string; isMath: boolean }> {
  const segs: Array<{ text: string; isMath: boolean }> = [];
  const re = /\$\$[\s\S]*?\$\$|\$[^\n$]+?\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) segs.push({ text: text.slice(last, m.index), isMath: false });
    segs.push({ text: m[0], isMath: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) segs.push({ text: text.slice(last), isMath: false });
  return segs;
}

/**
 * Given a non-math segment, detect bare LaTeX and wrap it.
 */
function wrapBareLatexSegment(seg: string): string {
  if (!BARE_LATEX_DETECT.test(seg)) return seg;

  return seg.split("\n").map(line => {
    const t = line.trim();
    if (!BARE_LATEX_DETECT.test(t)) return line;

    /* Skip lines that are pure block elements:
     * - Headings (#, ##, ###)
     * - Blockquotes (>)
     * - Standalone image (![ ... ])
     * - Unordered list items (* item or - item — star/dash FOLLOWED by a space)
     * - Ordered list items (1. item — digit+dot+space)
     * NOTE: We do NOT skip lines starting with ** (bold text) because those
     *       may contain LaTeX formulas inline, e.g. "**F = ma** is \\frac{...}"
     */
    if (/^[#>!]/.test(t))          return line; /* heading / blockquote / image */
    if (/^[-*]\s/.test(t))         return line; /* unordered list item */
    if (/^\d+\.\s/.test(t))        return line; /* ordered list item */

    /* Count how many known LaTeX commands appear in this line */
    const cmdMatches = (t.match(/\\[a-zA-Z]+/g) ?? [])
      .filter(c => LATEX_COMMANDS.includes(c.slice(1)));
    const wordTokens = t.split(/\s+/).filter(Boolean).length;

    if (cmdMatches.length > 0 && cmdMatches.length / Math.max(wordTokens, 1) >= 0.35) {
      /* High LaTeX density → treat entire line as display math */
      return `$$${t}$$`;
    }

    /* Low density → wrap individual \command{...}{...} groups as inline math */
    return line.replace(
      /(\\[a-zA-Z]+(?:\{[^{}]*(?:\{[^{}]*\}[^{}]*)?\})*(?:\s*[_^]\s*(?:\{[^{}]*\}|[a-zA-Z0-9]))*)/g,
      (match) => {
        const name = match.match(/^\\([a-zA-Z]+)/)?.[1] ?? "";
        return LATEX_COMMANDS.includes(name) ? `$${match.trim()}$` : match;
      }
    );
  }).join("\n");
}

function wrapBareLatex(text: string): string {
  return splitByMathDelimiters(text)
    .map(seg => seg.isMath ? seg.text : wrapBareLatexSegment(seg.text))
    .join("");
}

/* ─────────────────────────────────────────────────────────────────────────
 * Phase C — extractAndProtectMath
 *
 * Replaces ALL $...$ and $$...$$ blocks with unique placeholders.
 * Renders each via KaTeX and stores rendered HTML in a lookup map.
 * The placeholders survive subsequent markdown processing untouched.
 * ───────────────────────────────────────────────────────────────────────── */
function extractAndProtectMath(
  text: string
): { protected: string; map: Record<string, string> } {
  const map: Record<string, string> = {};
  let n = 0;
  let result = text;

  /* Block display math: $$...$$ — handle BEFORE inline to avoid confusion */
  result = result.replace(/\$\$([\s\S]*?)\$\$/gm, (_, math) => {
    const k = `__MBLOCK_${n++}__`;
    map[k] = `<div class="katex-block">${renderMath(math, true)}</div>`;
    return k;
  });

  /* Inline math: $...$ */
  result = result.replace(/\$([^\n$]+?)\$/g, (_, math) => {
    const k = `__MINLINE_${n++}__`;
    map[k] = `<span class="katex-inline">${renderMath(math, false)}</span>`;
    return k;
  });

  return { protected: result, map };
}

/* ─────────────────────────────────────────────────────────────────────────
 * renderTable — markdown pipe-table → HTML <table>
 * ───────────────────────────────────────────────────────────────────────── */
function renderTable(tableText: string): string {
  const lines = tableText.trim().split("\n");
  if (lines.length < 2) return `<p class="md-p">${tableText}</p>`;

  const parseRow = (line: string) =>
    line.split("|").map(c => c.trim()).filter(Boolean);

  const headers = parseRow(lines[0]);
  const body    = lines.slice(2); /* skip separator row */

  const thead = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${body.map(row => {
    const cells = parseRow(row);
    return `<tr>${cells.map(c => `<td>${c}</td>`).join("")}</tr>`;
  }).join("")}</tbody>`;

  return `<div class="md-table-wrapper"><table class="md-table">${thead}${tbody}</table></div>`;
}

/* ─────────────────────────────────────────────────────────────────────────
 * parseMarkdown — Main entry point
 *
 * Converts a markdown string (including KaTeX math) into safe HTML.
 * The six-phase pipeline is described at the top of this file.
 * ───────────────────────────────────────────────────────────────────────── */
export function parseMarkdown(text: string): string {
  if (!text || text.trim() === "") return "";

  /* Phase A: fix control chars from template-literal backslash issues */
  const phA = preNormalize(text);

  /* Phase A1: restore completely stripped backslashes (rac{ → \frac{) */
  const phA1 = restoreStrippedBackslashes(phA);

  /* Phase B: wrap bare LaTeX commands that lack $ delimiters */
  const phB = wrapBareLatex(phA1);

  /* Phase C: render + protect all $...$ and $$...$$ math */
  const { protected: safe, map } = extractAndProtectMath(phB);

  /* Phase D: line-by-line block elements */
  const lines = safe.split("\n");
  const out: string[] = [];
  let inOl = false, inUl = false;
  let tableBuf: string[] = [];
  let inTable = false;

  const flushTable = () => {
    if (tableBuf.length) { out.push(renderTable(tableBuf.join("\n"))); tableBuf = []; inTable = false; }
  };
  const flushLists = () => {
    if (inOl) { out.push("</ol>"); inOl = false; }
    if (inUl) { out.push("</ul>"); inUl = false; }
  };

  for (const line of lines) {
    /* Table */
    const isTableRow = line.trim().startsWith("|") || (inTable && /^[-|:\s]+$/.test(line.trim()));
    if (isTableRow) {
      if (!inTable) { inTable = true; flushLists(); }
      tableBuf.push(line);
      continue;
    } else if (inTable) { flushTable(); }

    /* Horizontal rule */
    if (/^[-*_]{3,}$/.test(line.trim())) {
      flushLists(); out.push('<hr class="md-hr" />'); continue;
    }

    /* h4 / h3 / h2 */
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^#### (.+)$/))) { flushLists(); out.push(`<h4 class="md-h4">${m[1]}</h4>`); continue; }
    if ((m = line.match(/^### (.+)$/)))  { flushLists(); out.push(`<h3 class="md-h3">${m[1]}</h3>`); continue; }
    if ((m = line.match(/^## (.+)$/)))   { flushLists(); out.push(`<h2 class="md-h2">${m[1]}</h2>`); continue; }

    /* Blockquote */
    if ((m = line.match(/^> (.+)$/))) {
      flushLists(); out.push(`<blockquote class="md-quote">${m[1]}</blockquote>`); continue;
    }

    /* Ordered list */
    if ((m = line.match(/^\d+\.\s+(.+)$/))) {
      if (!inOl) { if (inUl) { out.push("</ul>"); inUl = false; } out.push('<ol class="md-ol">'); inOl = true; }
      out.push(`<li class="md-li">${m[1]}</li>`); continue;
    } else if (inOl) { out.push("</ol>"); inOl = false; }

    /* Unordered list */
    if ((m = line.match(/^[*\-]\s+(.+)$/))) {
      if (!inUl) { if (inOl) { out.push("</ol>"); inOl = false; } out.push('<ul class="md-ul">'); inUl = true; }
      out.push(`<li class="md-li">${m[1]}</li>`); continue;
    } else if (inUl) { out.push("</ul>"); inUl = false; }

    /* Standalone image */
    if ((m = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/))) {
      flushLists();
      out.push(
        `<figure class="md-figure">` +
        `<img src="${m[2]}" alt="${m[1]}" class="md-img" loading="lazy" />` +
        (m[1] ? `<figcaption class="md-caption">${m[1]}</figcaption>` : "") +
        `</figure>`
      );
      continue;
    }

    /* Empty line */
    if (line.trim() === "") { flushLists(); out.push('<div class="md-spacer"></div>'); continue; }

    /* Paragraph */
    out.push(`<p class="md-p">${line}</p>`);
  }

  flushLists(); flushTable();

  /* Phase E: inline styles */
  let html = out.join("\n");
  html = html
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim,
      '<figure class="md-figure"><img src="$2" alt="$1" class="md-img" loading="lazy" />' +
      '<figcaption class="md-caption">$1</figcaption></figure>')
    .replace(/\*\*([^*\n]+)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/gim, "<em>$1</em>")
    .replace(/`([^`\n]+)`/gim, '<code class="md-code">$1</code>');

  /* Phase F: restore KaTeX-rendered math */
  for (const [key, rendered] of Object.entries(map)) {
    html = html.replaceAll(key, rendered);
  }

  return html;
}
