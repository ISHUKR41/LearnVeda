/**
 * FILE: page.tsx
 * LOCATION: src/app/faq/page.tsx
 * PURPOSE: Frequently Asked Questions page — professional accordion-style FAQ
 *          covering platform features, accounts, billing, technical support,
 *          and educational content. Organized into categories for easy navigation.
 *
 * DESIGN:
 *  - Category tabs for filtering questions by topic
 *  - Smooth accordion animations with CSS transitions
 *  - Search functionality for finding specific answers
 *  - Mobile-responsive layout with collapsible sections
 *  - CTA section linking to contact page for unanswered questions
 *
 * SEO:
 *  - JSON-LD FAQ structured data for Google rich results
 *  - Semantic HTML with proper heading hierarchy
 *  - Static generation with 24-hour ISR revalidation
 *
 * USED BY: Footer links, Navigation menu, Help section
 * DEPENDENCIES: next/link, lucide-react, FAQ.module.css
 * LAST UPDATED: 2026-05-27
 */

"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  BookOpen,
  Shield,
  Zap,
  CreditCard,
  Code2,
  Users,
  HelpCircle,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Swords,
  Trophy,
} from "lucide-react";
import styles from "./FAQ.module.css";

/* ─────────────────────────────────────────────
 * FAQ Data Types
 * ───────────────────────────────────────────── */

/** Represents a single FAQ item */
interface FAQItem {
  /** Unique identifier for the FAQ item */
  id: string;
  /** The question text */
  question: string;
  /** The answer text (supports basic text) */
  answer: string;
  /** Category this FAQ belongs to */
  category: FAQCategory;
}

/** Available FAQ categories */
type FAQCategory =
  | "getting-started"
  | "academics"
  | "engineering"
  | "battles"
  | "account"
  | "billing"
  | "community"
  | "technical";

/** Category metadata for the tab navigation */
interface CategoryMeta {
  id: FAQCategory;
  label: string;
  icon: React.ElementType;
  description: string;
}

/* ─────────────────────────────────────────────
 * Category Definitions
 *
 * Each category has an icon, label, and description
 * for the filter tab navigation.
 * ───────────────────────────────────────────── */
const CATEGORIES: CategoryMeta[] = [
  { id: "getting-started", label: "Getting Started", icon: Zap, description: "New to Zingpath? Start here." },
  { id: "academics", label: "Academics", icon: BookOpen, description: "Class tracks, subjects, and study plans." },
  { id: "engineering", label: "Engineering", icon: Code2, description: "Coding tracks, languages, and DSA." },
  { id: "battles", label: "Battles & XP", icon: Swords, description: "Battle arena, XP, and rankings." },
  { id: "account", label: "Account", icon: Shield, description: "Profile, settings, and security." },
  { id: "billing", label: "Billing", icon: CreditCard, description: "Plans, pricing, and payments." },
  { id: "community", label: "Community", icon: Users, description: "Forums, events, and hackathons." },
  { id: "technical", label: "Technical", icon: HelpCircle, description: "Browser support, bugs, and API." },
];

/* ─────────────────────────────────────────────
 * FAQ Content Database
 *
 * Comprehensive Q&A covering all aspects of the Zingpath platform.
 * Each item has a unique ID for anchor linking and analytics tracking.
 * ───────────────────────────────────────────── */
const FAQ_DATA: FAQItem[] = [
  /* ── Getting Started ── */
  {
    id: "what-is-zingpath",
    question: "What is Zingpath?",
    answer: "Zingpath is a gamified education platform designed for Indian students in Class 9-12 and Engineering. It combines structured NCERT-aligned academic content, 12+ programming language tracks, real-time quiz battles, and a full XP/leveling system to make daily study genuinely rewarding. Think of it as a learning RPG where your character levels up by mastering real subjects.",
    category: "getting-started",
  },
  {
    id: "how-to-sign-up",
    question: "How do I create an account?",
    answer: "Visit zingpath.in/sign-up and enter your name, email, and password. You will be asked to select your class level (9-12 or Engineering) and stream (Science, Commerce, Arts). Account creation is completely free and takes less than 60 seconds. You will receive 100 starter Stars in your wallet immediately.",
    category: "getting-started",
  },
  {
    id: "what-is-free",
    question: "Is Zingpath really free?",
    answer: "Yes. Every core feature is free forever — all class tracks (9-12), all 12 engineering language plans, the battle arena, XP system, streak tracking, leaderboard, community forums, and event registration. We are building premium features (Pro plan) for serious exam aspirants, but the free tier will never lose features.",
    category: "getting-started",
  },
  {
    id: "who-is-it-for",
    question: "Who is Zingpath built for?",
    answer: "Zingpath serves three main groups: (1) Class 9-12 CBSE/ICSE students who need structured, day-wise study plans for board exam preparation, (2) Engineering students learning programming languages and Data Structures, and (3) Competitive exam aspirants (JEE, NEET preparation tracks coming soon). Parents and teachers can also use the platform to monitor student progress.",
    category: "getting-started",
  },
  {
    id: "platforms-supported",
    question: "What devices can I use Zingpath on?",
    answer: "Zingpath is a fully responsive web application that works on any device with a modern web browser — desktops, laptops, tablets, and smartphones. We support Chrome, Firefox, Safari, and Edge. A native mobile app (iOS and Android) is planned for the next major release.",
    category: "getting-started",
  },

  /* ── Academics ── */
  {
    id: "class-tracks",
    question: "Which classes and subjects are available?",
    answer: "We currently offer complete tracks for Class 9, Class 10, Class 11, and Class 12. Each class includes Science (Physics, Chemistry, Biology/Computer Science), Mathematics, and Social Science. Subjects are organized into chapters with day-wise study plans, practice questions, and progress tracking. Content is aligned with the NCERT/CBSE curriculum.",
    category: "academics",
  },
  {
    id: "study-plans",
    question: "How do day-wise study plans work?",
    answer: "Every chapter is broken into a structured plan spanning 3 to 15 days depending on complexity. Each day covers a specific set of concepts, followed by practice questions. The system tracks which days you have completed, maintains your streak count, and adjusts recommendations based on your progress. You can study at your own pace — the plan is a guide, not a deadline.",
    category: "academics",
  },
  {
    id: "board-exams",
    question: "Does Zingpath help with board exam preparation?",
    answer: "Absolutely. All academic content is NCERT-aligned with board exam patterns in mind. We provide chapter-wise notes, important formulas, previous year question patterns, and mock tests. The upcoming Pro plan will add timed board-style mock exams with detailed performance analytics.",
    category: "academics",
  },
  {
    id: "question-types",
    question: "What types of questions are available?",
    answer: "Zingpath offers four question types: (1) Multiple Choice Questions (MCQs) — with explanation for correct answers, (2) Short Answer Questions — for conceptual understanding, (3) Long Answer Questions — for comprehensive responses, (4) Thinking Questions — higher-order problems that test application and analysis. Each question has difficulty tags (Easy, Medium, Hard) and bloom's taxonomy alignment.",
    category: "academics",
  },
  {
    id: "ncert-alignment",
    question: "Is the content aligned with NCERT?",
    answer: "Yes. All academic content follows the NCERT curriculum structure, chapter ordering, and learning outcomes. Our chapters use NCERT textbook references as the primary source, supplemented with additional examples and real-world applications to deepen understanding beyond the textbook.",
    category: "academics",
  },

  /* ── Engineering & Coding ── */
  {
    id: "programming-languages",
    question: "Which programming languages are available?",
    answer: "Zingpath offers structured learning plans for 12+ languages: C, C++, Python, Java, JavaScript, TypeScript, Go, Rust, Ruby, Swift, Kotlin, and SQL. Each language has a complete curriculum from basics to advanced topics, with hands-on coding problems and real-world project ideas. Additional languages (PHP, Scala, Dart) are in development.",
    category: "engineering",
  },
  {
    id: "dsa-coverage",
    question: "How comprehensive is the Data Structures & Algorithms content?",
    answer: "Our DSA track covers 15+ data structures (arrays, linked lists, stacks, queues, trees, graphs, heaps, tries, hash maps, etc.) and 20+ algorithm families (sorting, searching, dynamic programming, greedy, backtracking, graph algorithms, etc.). Each topic has theory, visual explanations, practice problems graded by difficulty, and interview-preparation patterns.",
    category: "engineering",
  },
  {
    id: "coding-practice",
    question: "Can I practice coding on the platform?",
    answer: "Yes. Each engineering topic includes practice problems with expected input/output, hints, and solution explanations. Our coding problem system tracks your solve rate, time spent, and progress through each language track. Full in-browser code execution is planned for the next release.",
    category: "engineering",
  },
  {
    id: "web-development",
    question: "Is there a Web Development track?",
    answer: "Yes. The Web Development track covers HTML, CSS, JavaScript fundamentals, React.js, Node.js, Express.js, databases (PostgreSQL, MongoDB), REST API design, authentication, deployment, and modern tooling (TypeScript, Git, Docker). It is structured as a 90-day learning plan.",
    category: "engineering",
  },

  /* ── Battles & XP ── */
  {
    id: "what-are-battles",
    question: "What are Quiz Battles?",
    answer: "Quiz Battles are real-time competitive quiz matches between two students. You are matched with an opponent of similar skill level, and both players answer the same set of 10-15 questions under a time limit. Points are awarded for correct answers and speed. Winners earn XP, Stars, and climb the leaderboard. It is like Clash Royale, but for education.",
    category: "battles",
  },
  {
    id: "xp-system",
    question: "How does the XP and leveling system work?",
    answer: "You earn XP (Experience Points) for completing chapters, answering questions, winning battles, maintaining streaks, and participating in events. XP accumulates to increase your Level (1-100). Each level requires progressively more XP. Higher levels unlock profile badges, special battle arena access, and premium content previews. Your XP is displayed on your profile and the leaderboard.",
    category: "battles",
  },
  {
    id: "streaks",
    question: "What are daily streaks?",
    answer: "A streak is the number of consecutive days you have used Zingpath for active learning (completing at least one lesson or practice session). Streaks are a powerful motivation tool — they are displayed on your profile, the dashboard, and the leaderboard. Maintaining a streak earns bonus XP. If you miss a day, your streak resets to zero, but your highest streak is always preserved.",
    category: "battles",
  },
  {
    id: "leaderboard",
    question: "How does the leaderboard work?",
    answer: "Zingpath has multiple leaderboard views: Global (all users), Class-specific (your class level), Weekly (resets every Monday), and Battle (ranked by win rate). Rankings are based on XP. The top 10 users receive special badges and Stars rewards. The leaderboard is updated in real-time as users earn XP.",
    category: "battles",
  },
  {
    id: "stars-wallet",
    question: "What are Stars and the wallet?",
    answer: "Stars are the in-platform currency. You earn Stars by winning battles (10-50 per win), completing chapters (20-100 per chapter), maintaining streaks (5 per day), and winning events. Stars can be used for premium profile customization, battle power-ups, and future marketplace items. Every new account starts with 100 bonus Stars.",
    category: "battles",
  },

  /* ── Account ── */
  {
    id: "change-password",
    question: "How do I change my password?",
    answer: "Go to Settings (click your avatar in the top-right corner, then select Settings). Under the Security tab, you can change your password by entering your current password and your new password. Passwords must be at least 8 characters long.",
    category: "account",
  },
  {
    id: "delete-account",
    question: "Can I delete my account?",
    answer: "Yes. Account deletion is available under Settings → Account → Delete Account. This action is permanent and irreversible — all your progress, XP, Stars, battle history, and community posts will be permanently deleted. We hold your data for 30 days before final deletion in case you change your mind.",
    category: "account",
  },
  {
    id: "data-privacy",
    question: "How is my data protected?",
    answer: "Zingpath takes data security seriously. Passwords are hashed with PBKDF2-SHA512 (100,000 iterations). Sessions use httpOnly cookies. All communication is encrypted via HTTPS. We do not sell user data to third parties. We follow GDPR-inspired data handling practices and will comply with India's DPDP Act requirements.",
    category: "account",
  },
  {
    id: "change-class",
    question: "Can I switch my class level after signing up?",
    answer: "Yes. Go to Settings → Profile and update your class level. Your academic progress from your previous class will be preserved, and you will gain access to the new class content immediately. Note that your leaderboard ranking may change as you move to a different class-level leaderboard.",
    category: "account",
  },

  /* ── Billing ── */
  {
    id: "pricing-plans",
    question: "What plans does Zingpath offer?",
    answer: "Currently, Zingpath is completely free. We offer three tiers: (1) Student Free — all core features forever at ₹0, (2) Student Pro (coming soon, ₹299/month) — advanced analytics, mock tests, AI study planner, (3) School Partner (custom pricing) — institutional deployment with admin dashboards. Visit /pricing for full details.",
    category: "billing",
  },
  {
    id: "pro-release",
    question: "When will the Pro plan launch?",
    answer: "The Pro plan is currently in development. We expect to launch it in Q3 2026. You can join the waitlist on the pricing page to be notified first. Early waitlist members will receive a 30% launch discount.",
    category: "billing",
  },
  {
    id: "school-pricing",
    question: "How does School Partner pricing work?",
    answer: "School Partner pricing is customized based on the number of students, required features, and deployment needs. It includes teacher dashboards, bulk enrollment, school-wide analytics, and dedicated support. Contact us at support@zingpath.in or visit /contact for a custom quote.",
    category: "billing",
  },

  /* ── Community ── */
  {
    id: "discussion-forums",
    question: "How do the community forums work?",
    answer: "Zingpath has chapter-specific and general discussion forums where students can ask doubts, share study tips, and help each other. You can create posts, comment on others' posts, and upvote helpful content. Forum participation earns XP. Moderators ensure discussions stay respectful and on-topic.",
    category: "community",
  },
  {
    id: "hackathons",
    question: "What are Zingpath Hackathons?",
    answer: "We host periodic hackathons — coding competitions where students solve real-world problems in teams. Hackathons have themes (e.g., health tech, education tools, sustainability), time limits (24-48 hours), and prizes (Stars, premium badges, certificates). Registration is free and open to all Zingpath users.",
    category: "community",
  },
  {
    id: "events",
    question: "What events does Zingpath host?",
    answer: "Zingpath hosts weekly quiz tournaments, monthly coding challenges, seasonal hackathons, and special board exam preparation workshops. All events are free to join and visible on the Events page. Winners earn Stars, XP, and exclusive profile badges. Past events and their results are archived for reference.",
    category: "community",
  },

  /* ── Technical ── */
  {
    id: "browser-support",
    question: "Which browsers are supported?",
    answer: "Zingpath works best on the latest versions of Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge. We recommend Chrome for the best experience. Internet Explorer is not supported. JavaScript must be enabled.",
    category: "technical",
  },
  {
    id: "offline-access",
    question: "Can I use Zingpath offline?",
    answer: "Currently, Zingpath requires an active internet connection. Offline access (downloadable lessons and practice sets) is a planned Pro feature. We will implement Progressive Web App (PWA) capabilities to enable limited offline functionality.",
    category: "technical",
  },
  {
    id: "report-bug",
    question: "How do I report a bug?",
    answer: "If you find a bug, please report it through the Contact page (/contact) or email us at support@zingpath.in. Include: (1) What you were doing, (2) What you expected to happen, (3) What actually happened, (4) Your browser and device. Screenshots are very helpful. We triage all bug reports within 24 hours.",
    category: "technical",
  },
  {
    id: "api-access",
    question: "Does Zingpath have a public API?",
    answer: "Yes. Zingpath exposes a RESTful API at /api with endpoints for content, progress, battles, leaderboards, and more. The API is documented at /api (root endpoint). Public API access for third-party integrations (School Partner plan) is planned for launch alongside the Pro plan.",
    category: "technical",
  },
];

/* ─────────────────────────────────────────────
 * FAQPage Component
 * ───────────────────────────────────────────── */

export default function FAQPage() {
  /* Search query state */
  const [searchQuery, setSearchQuery] = useState("");
  /* Active category filter (null = show all) */
  const [activeCategory, setActiveCategory] = useState<FAQCategory | null>(null);
  /* Set of open accordion item IDs */
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  /**
   * Toggles an accordion item open/closed.
   * Uses functional Set update to avoid stale closures.
   */
  const toggleItem = useCallback((id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  /**
   * Filtered FAQ items based on search query and active category.
   * Memoized to prevent unnecessary re-computation on renders.
   */
  const filteredFAQs = useMemo(() => {
    let items = FAQ_DATA;

    /* Filter by category if one is selected */
    if (activeCategory) {
      items = items.filter((item) => item.category === activeCategory);
    }

    /* Filter by search query */
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );
    }

    return items;
  }, [searchQuery, activeCategory]);

  /** Count of FAQs per category (for badge display) */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      counts[cat.id] = FAQ_DATA.filter((item) => item.category === cat.id).length;
    }
    return counts;
  }, []);

  return (
    <div className={styles.page}>
      {/* ==================== HERO SECTION ==================== */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <MessageSquare size={14} />
            Help Center
          </div>
          <h1 className={styles.heroTitle}>
            Frequently Asked{" "}
            <span className={styles.heroHighlight}>Questions</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Everything you need to know about Zingpath — from getting started to
            mastering the battle arena. Can&apos;t find your answer? Reach out to our team.
          </p>

          {/* Search bar */}
          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} aria-hidden="true" />
            <input
              id="faq-search"
              type="text"
              className={styles.searchInput}
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search FAQ questions"
            />
            {searchQuery && (
              <button
                className={styles.searchClear}
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ==================== CATEGORY TABS ==================== */}
      <section className={styles.categoriesSection}>
        <div className={styles.categoriesInner}>
          {/* "All" tab */}
          <button
            className={`${styles.categoryTab} ${activeCategory === null ? styles.categoryTabActive : ""}`}
            onClick={() => setActiveCategory(null)}
          >
            <Sparkles size={15} />
            All
            <span className={styles.categoryCount}>{FAQ_DATA.length}</span>
          </button>

          {/* Category tabs */}
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.categoryTab} ${activeCategory === cat.id ? styles.categoryTabActive : ""}`}
              onClick={() => setActiveCategory(cat.id)}
              title={cat.description}
            >
              <cat.icon size={15} />
              {cat.label}
              <span className={styles.categoryCount}>{categoryCounts[cat.id]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ==================== FAQ ACCORDION ==================== */}
      <section className={styles.faqSection}>
        <div className={styles.faqInner}>
          {/* Results count */}
          <p className={styles.resultsCount}>
            {filteredFAQs.length === 0
              ? "No questions match your search."
              : `Showing ${filteredFAQs.length} question${filteredFAQs.length !== 1 ? "s" : ""}`}
          </p>

          {/* Accordion items */}
          <div className={styles.accordion} role="list">
            {filteredFAQs.map((item) => {
              const isOpen = openItems.has(item.id);
              /* Find the icon for this item's category */
              const catMeta = CATEGORIES.find((c) => c.id === item.category);
              const CategoryIcon = catMeta?.icon ?? HelpCircle;

              return (
                <article
                  key={item.id}
                  id={`faq-${item.id}`}
                  className={`${styles.accordionItem} ${isOpen ? styles.accordionItemOpen : ""}`}
                  role="listitem"
                >
                  {/* Question header — clickable to toggle */}
                  <button
                    className={styles.accordionHeader}
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                  >
                    <div className={styles.accordionLeft}>
                      <div className={styles.accordionIcon}>
                        <CategoryIcon size={16} />
                      </div>
                      <span className={styles.accordionQuestion}>{item.question}</span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`${styles.accordionChevron} ${isOpen ? styles.accordionChevronOpen : ""}`}
                    />
                  </button>

                  {/* Answer body — animated open/close */}
                  <div
                    id={`faq-answer-${item.id}`}
                    className={`${styles.accordionBody} ${isOpen ? styles.accordionBodyOpen : ""}`}
                    role="region"
                    aria-labelledby={`faq-${item.id}`}
                  >
                    <div className={styles.accordionAnswer}>
                      {item.answer}
                    </div>
                    <div className={styles.accordionMeta}>
                      <span className={styles.accordionCategory}>
                        <CategoryIcon size={12} />
                        {catMeta?.label ?? item.category}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <Trophy size={28} className={styles.ctaIcon} />
          <h2 className={styles.ctaTitle}>Still have questions?</h2>
          <p className={styles.ctaSubtitle}>
            Our team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className={styles.ctaPrimary}>
              Contact Us <ArrowRight size={15} />
            </Link>
            <Link href="/community" className={styles.ctaSecondary}>
              Ask the Community <Users size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
