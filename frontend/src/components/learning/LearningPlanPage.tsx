/**
 * FILE: LearningPlanPage.tsx
 * LOCATION: src/components/learning/LearningPlanPage.tsx
 * PURPOSE: Reusable server-safe detail-page renderer for class subjects and engineering plans.
 *
 * ARCHITECTURE: Pure Server Component (no "use client").
 *   — Chapter rows use the CSS "stretched-link" pattern so the entire row is clickable
 *     without nesting <a> inside <a> (which is invalid HTML and causes Next.js errors).
 *   — The primary chapter link is placed first in the DOM and stretched to cover the full
 *     row via position:absolute + inset:0 in CSS (class: moduleStretchLink).
 *   — Secondary action elements (study button) have position:relative z-index:1 so they
 *     intercept their own clicks above the stretched primary link — zero JS needed.
 *   — No onClick handlers anywhere = no server/client boundary violations.
 *
 * USED BY: src/app/class-9/[subject]/page.tsx, class-10, class-11, class-12, engineering
 * DEPENDENCIES: lucide-react, next/link, LearningPlanPage.module.css
 * LAST UPDATED: 2026-05-28
 */

import Link from "next/link";
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2,
  Clock, Target, Flame, Trophy, Zap, Calendar,
  ChevronRight, Star, TrendingUp, Users, Brain,
  Activity,
} from "lucide-react";
import type { LearningPlan } from "@/lib/curriculum/learning-catalog";
import styles from "./LearningPlanPage.module.css";

/* ─────────────────────────────────────────
 * Types
 * ───────────────────────────────────────── */

interface LearningPlanPageProps {
  plan: LearningPlan;
}

/** A single chapter after all shape variations are normalised to one type. */
interface NormalizedChapter {
  slug: string;
  name: string;
  description: string;
  dayCount: number;
  questionCount: number;
  difficulty: "easy" | "medium" | "hard";
}

/* ─────────────────────────────────────────
 * Helpers
 * ───────────────────────────────────────── */

/**
 * Converts the mixed chapter array (string | object) from LearningPlan into a
 * uniform NormalizedChapter array so the render loop stays clean.
 *
 * String chapters (e.g. "Polynomials") are auto-slugified and get sensible defaults.
 * Object chapters already carry explicit metadata.
 */
function normalizeChapters(plan: LearningPlan): NormalizedChapter[] {
  const fallbackDays = Math.max(
    1,
    Math.round(plan.durationDays / Math.max(plan.chapters.length, 1)),
  );

  return plan.chapters.map((chapter, index) => {
    if (typeof chapter === "string") {
      return {
        slug: chapter.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: chapter,
        description: "Structured concepts, solved examples, and chapter practice.",
        dayCount: index === 0 ? fallbackDays + 1 : fallbackDays,
        questionCount: 15,
        difficulty:
          index < 2
            ? "easy"
            : index > plan.chapters.length - 3
              ? "hard"
              : "medium",
      };
    }

    return {
      slug: chapter.slug,
      name: chapter.name,
      description:
        chapter.description ??
        "Structured concepts, solved examples, and chapter practice.",
      dayCount: chapter.dayCount ?? fallbackDays,
      questionCount: chapter.questionCount ?? 15,
      difficulty: chapter.difficulty ?? "medium",
    };
  });
}

/**
 * Returns subject-aware study tips shown in the sidebar.
 * These are short and actionable — not generic padding text.
 */
function getStudyTips(plan: LearningPlan): string[] {
  const title = plan.title.toLowerCase();

  if (title.includes("math")) {
    return [
      "Solve at least 5 practice problems per day — don't just read the theory",
      "Write out all steps even for simple problems to build exam habits",
      "Attempt the hard questions without hints first — then check the explanation",
    ];
  }
  if (
    title.includes("science") ||
    title.includes("chemistry") ||
    title.includes("physics") ||
    title.includes("biology")
  ) {
    return [
      "Draw diagrams from memory after reading each chapter — it forces recall",
      "Focus on understanding the 'why' behind each concept, not just the 'what'",
      "Review previous chapters' questions every 3 days to prevent forgetting",
    ];
  }
  if (title.includes("english")) {
    return [
      "Read each passage aloud once before answering comprehension questions",
      "Maintain a vocabulary notebook — add 5 new words per session",
      "Practice essay writing with a timer to build exam writing speed",
    ];
  }
  if (
    title.includes("python") ||
    title.includes("java") ||
    title.includes("c++") ||
    title.includes("code") ||
    title.includes("computer")
  ) {
    return [
      "Type every code example yourself — never copy-paste while learning",
      "After reading a concept, close the book and try to code it from scratch",
      "Debug your own errors before looking for solutions — it builds real skill",
    ];
  }
  return [
    "Create a one-page summary for each chapter after you finish studying it",
    "Practice writing answers with a time limit to simulate exam conditions",
    "Use dates, names, and key terms as anchor points for memory recall",
  ];
}

/* ─────────────────────────────────────────
 * Component
 * ───────────────────────────────────────── */

export default function LearningPlanPage({ plan }: LearningPlanPageProps) {
  /* ── Derived data ── */
  const normalizedChapters = normalizeChapters(plan);

  const totalDays = Math.max(
    plan.durationDays,
    normalizedChapters.reduce((acc, ch) => acc + ch.dayCount, 0),
  );
  const estimatedQuestions = normalizedChapters.reduce(
    (acc, ch) => acc + ch.questionCount,
    0,
  );
  const estimatedXp = normalizedChapters.length * 100 + totalDays * 50;
  const studyTips = getStudyTips(plan);

  const isEngineeringPlan =
    plan.backHref === "/engineering" ||
    plan.eyebrow.toLowerCase().includes("engineering");

  /* ── Sidebar resource links — context-aware ── */
  const resourceLinks = isEngineeringPlan
    ? [
        { title: "Interview Prep", description: "Placement-focused Q&A packs with model answers.", href: "/interviews" },
        { title: "MCQ Practice", description: "Interactive quizzes for quick concept checks.", href: "/mcqs" },
        { title: "Semester Guides", description: "Step-by-step exam survival plans.", href: "/semester" },
        { title: "Study Notes", description: "Downloadable revision sheets and PDFs.", href: "/notes" },
        { title: "Community Help", description: "Ask doubts and track peer solutions.", href: "/community" },
        { title: "Events & Hackathons", description: "Join verified coding contests and events.", href: "/events" },
      ]
    : [
        { title: "Study Notes", description: "Chapter summaries and quick revision sheets.", href: "/notes" },
        { title: "MCQ Practice", description: "Topic-wise practice tests with explanations.", href: "/mcqs" },
        { title: "Study Community", description: "Share doubts and learn with peers.", href: "/community" },
        { title: "Events & Quizzes", description: "Join safe school-level competitions.", href: "/events" },
        { title: "Engineering Track", description: "Explore coding and tech skills paths.", href: "/engineering" },
        { title: "Interview Prep", description: "Preview higher-grade placement prep.", href: "/interviews" },
      ];

  return (
    <div className={styles.page}>

      {/* ── Back navigation ── */}
      <Link href={plan.backHref} className={styles.backLink}>
        <ArrowLeft size={16} /> Back to {plan.eyebrow}
      </Link>

      {/* ── Hero section: title, description, key stats ── */}
      <section className={styles.hero} style={{ borderTop: `6px solid ${plan.accent}` }}>
        <div className={styles.heroInner}>
          <div>
            <span className={styles.eyebrow} style={{ color: plan.accent }}>
              {plan.eyebrow}
            </span>
            <h1 className={styles.heroTitle}>{plan.title}</h1>
            <p className={styles.heroDesc}>{plan.description}</p>

            {/* Key plan metrics displayed as pills */}
            <div className={styles.metrics}>
              <span className={styles.metricPill}>
                <Calendar size={16} /> {totalDays} Day Plan
              </span>
              <span className={styles.metricPill}>
                <BookOpen size={16} /> {normalizedChapters.length} Chapters
              </span>
              <span className={styles.metricPill}>
                <Target size={16} /> {estimatedQuestions}+ Questions
              </span>
              <span className={styles.metricPill}>
                <Zap size={16} color="#F59E0B" /> {estimatedXp.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main grid: chapter list + sidebar ── */}
      <div className={styles.grid}>

        {/* ── Left: chapter module list ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <BookOpen size={20} color={plan.accent} />
              Curriculum Modules
            </h2>
            <span className={styles.cardBadge}>{normalizedChapters.length} Modules</span>
          </div>

          <ol className={styles.moduleList}>
            {normalizedChapters.map((chapter, index) => {
              /*
               * Difficulty badge class — easy=green, medium=blue, hard=red.
               * These map to CSS classes: .badge-easy, .badge-medium, .badge-hard
               */
              const difficultyClass =
                chapter.difficulty === "easy"
                  ? styles["badge-easy"]
                  : chapter.difficulty === "medium"
                    ? styles["badge-medium"]
                    : styles["badge-hard"];

              /*
               * Build the chapter URL only if the plan provides a base path.
               * Format: /class-9/science/force-and-laws-of-motion
               */
              const chapterHref = plan.chapterHrefBase
                ? `${plan.chapterHrefBase}/${chapter.slug}`
                : undefined;

              /*
               * Study sub-page URL: /class-9/science/force-and-laws-of-motion/study
               */
              const studyHref = chapterHref ? `${chapterHref}/study` : undefined;

              /*
               * ── STRETCHED LINK PATTERN ──
               *
               * Problem: We want the whole chapter row to be clickable, BUT we also
               * want a secondary "Study material" button inside the row. Nesting <a>
               * inside <a> is invalid HTML and crashes Next.js / Turbopack.
               *
               * Solution: CSS stretched-link technique (same as Bootstrap's .stretched-link):
               *   1. The <li> gets position:relative (moduleItem class).
               *   2. The primary chapter link gets ::after { position:absolute; inset:0 }
               *      — this invisible overlay covers the entire row, making ANY click on
               *      the card navigate to the chapter page.
               *   3. The secondary "Study material" link gets position:relative z-index:1
               *      — this raises it ABOVE the stretched overlay, so clicking it goes to
               *      the study page instead of the chapter page.
               *
               * Result: Zero onClick, zero nested anchors, fully accessible, works with
               * both Turbopack and webpack, pure Server Component.
               */
              return (
                <li
                  key={chapter.slug}
                  className={
                    chapterHref
                      ? styles.moduleItem          /* navigable row */
                      : `${styles.moduleItem} ${styles.moduleItemLocked}` /* locked row */
                  }
                >
                  {/* Chapter number badge — colored with subject accent */}
                  <span
                    className={styles.moduleNumber}
                    style={{ background: plan.accent }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Chapter content: title, description, meta tags, action links */}
                  <div className={styles.moduleContent}>
                    <strong className={styles.moduleName}>
                      {/*
                       * The chapter name doubles as the primary clickable text.
                       * The moduleStretchLink class adds ::after {position:absolute;inset:0}
                       * which stretches this link to cover the entire <li> card.
                       */}
                      {chapterHref ? (
                        <Link
                          href={chapterHref}
                          className={styles.moduleStretchLink}
                          aria-label={`Open ${chapter.name} chapter`}
                        >
                          {chapter.name}
                        </Link>
                      ) : (
                        chapter.name
                      )}
                    </strong>

                    <p className={styles.moduleDescription}>{chapter.description}</p>

                    {/* Metadata tags: days, questions, difficulty level */}
                    <div className={styles.moduleMeta}>
                      <span className={styles.moduleTag}>
                        <Clock size={12} /> {chapter.dayCount} days
                      </span>
                      <span className={styles.moduleTag}>
                        <Target size={12} /> {chapter.questionCount} practice questions
                      </span>
                      <span className={`${styles.moduleTag} ${difficultyClass}`}>
                        <Activity size={12} />{" "}
                        {chapter.difficulty.charAt(0).toUpperCase() +
                          chapter.difficulty.slice(1)}
                      </span>
                    </div>

                    {/*
                     * Action row — only shown when the chapter has a URL.
                     * "Open chapter practice" is text-only (the stretched link already
                     * handles the click for the whole row via ::after overlay).
                     * "Study material" IS a real link with position:relative z-index:1
                     * so it sits above the stretched overlay and intercepts its own click.
                     */}
                    {chapterHref ? (
                      <div className={styles.moduleActions}>
                        {/* Visual label — not a link (the stretched link covers the row) */}
                        <span className={styles.moduleHintLink}>
                          Open chapter practice
                        </span>

                        {/* Real secondary link — position:relative z-index:1 in CSS */}
                        {studyHref && (
                          <Link
                            href={studyHref}
                            className={styles.moduleSecondaryLink}
                          >
                            Study material
                          </Link>
                        )}
                      </div>
                    ) : (
                      <small className={styles.moduleHint}>
                        Study the theory, complete the interactive questions, and pass the chapter quiz to unlock the next module.
                      </small>
                    )}
                  </div>

                  {/* Arrow icon — purely decorative, signals navigability */}
                  <ChevronRight size={20} className={styles.moduleArrow} />
                </li>
              );
            })}
          </ol>
        </div>

        {/* ── Right: sidebar ── */}
        <aside className={styles.sidebar}>

          {/* CTA card: prompt to start the plan */}
          <div className={styles.ctaCard} style={{ borderTopColor: plan.accent }}>
            <div
              className={styles.ctaIcon}
              style={{ background: `${plan.accent}1A`, color: plan.accent }}
            >
              <TrendingUp size={28} />
            </div>
            <h3 className={styles.ctaTitle}>Ready to begin?</h3>
            <p className={styles.ctaText}>
              Start this {totalDays}-day plan to master {plan.title} and earn up to{" "}
              {estimatedXp.toLocaleString()} XP.
            </p>

            <div className={styles.ctaStats}>
              <div className={styles.ctaStat}>
                <span className={styles.ctaStatValue}>{totalDays}</span>
                <span className={styles.ctaStatLabel}>Days</span>
              </div>
              <div className={styles.ctaStatDivider} />
              <div className={styles.ctaStat}>
                <span className={styles.ctaStatValue}>{normalizedChapters.length}</span>
                <span className={styles.ctaStatLabel}>Chapters</span>
              </div>
            </div>

            <Link
              href="/sign-up"
              className={styles.primaryAction}
              style={{ background: plan.accent }}
            >
              Start Day 1 <ArrowRight size={18} />
            </Link>

            <p className={styles.ctaAlready}>
              Already a student?{" "}
              <Link href="/sign-in" style={{ color: plan.accent, fontWeight: "bold" }}>
                Sign in
              </Link>
            </p>
          </div>

          {/* Plan features checklist */}
          <div className={styles.sideCard}>
            <h3 className={styles.sideCardTitle}>
              <Star size={20} style={{ marginRight: 8, color: plan.accent }} />
              Plan Features
            </h3>
            <ul className={styles.featureList}>
              {[
                { icon: CheckCircle2, text: "Curriculum aligned chapter questions" },
                { icon: Flame, text: "Daily streak tracking to build habits" },
                { icon: Trophy, text: "Battle opponents in this subject" },
                { icon: Zap, text: "XP rewards for every correct answer" },
                { icon: Brain, text: "Detailed hints after wrong answers" },
                { icon: Users, text: "Community discussions for doubts" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className={styles.featureItem}>
                  <Icon size={16} color="var(--color-success)" style={{ marginTop: 2 }} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Related resource links */}
          <div className={styles.sideCard}>
            <h3 className={styles.sideCardTitle}>
              <BookOpen size={20} style={{ marginRight: 8, color: plan.accent }} />
              Related Resources
            </h3>
            <ul className={styles.resourceList}>
              {resourceLinks.map((resource) => (
                <li key={resource.title} className={styles.resourceItem}>
                  <Link href={resource.href} className={styles.resourceLink}>
                    <span className={styles.resourceTitle}>{resource.title}</span>
                    <span className={styles.resourceDesc}>{resource.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subject-specific study tips */}
          <div className={styles.sideCard}>
            <h3 className={styles.sideCardTitle}>
              <Brain size={20} style={{ marginRight: 8, color: plan.accent }} />
              Study Tips
            </h3>
            <ol className={styles.tipList}>
              {studyTips.map((tip, i) => (
                <li key={i} className={styles.tipItem}>
                  <span className={styles.tipNumber}>{i + 1}</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ol>
          </div>

        </aside>
      </div>
    </div>
  );
}
