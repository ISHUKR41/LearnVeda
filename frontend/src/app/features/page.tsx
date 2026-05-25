/**
 * FILE: page.tsx
 * LOCATION: src/app/features/page.tsx
 * PURPOSE: Features page — comprehensive showcase of EduQuest's core
 *          capabilities organized into a bento grid layout with comparison
 *          section and CTA. Each feature includes icon, title, description,
 *          and relevant tags for SEO and user understanding.
 * USED BY: Footer "Features" link, navbar navigation
 * DEPENDENCIES: next/link, lucide-react, Features.module.css
 * LAST UPDATED: 2026-05-11
 */

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Calendar,
  Code2,
  Flame,
  Layers,
  MessageSquare,
  Shield,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import styles from "./Features.module.css";

/* ISR: Features page content rarely changes — revalidate every 12 hours */
export const revalidate = 43200;

/** SEO metadata — helps search engines properly index the Features page. */
export const metadata = {
  title: "Features — EduQuest Platform Capabilities",
  description:
    "Explore EduQuest features: day-wise learning plans, XP leveling, real-time battles, streaks, smart analytics, community forums, and anti-cheat protection.",
};

/**
 * Feature cards data — each represents a core platform capability.
 * Includes: icon component, gradient for icon background, title, description,
 * and tags for quick scanning.
 */
const FEATURES = [
  {
    icon: Target,
    gradient: "linear-gradient(135deg, #3B82F6, #06B6D4)",
    title: "Day-Wise Learning Plans",
    description:
      "Every subject and coding track comes with a structured 15 to 60 day plan. Students follow clear daily tasks instead of guessing what to study next. Plans adapt to Class 9-12 NCERT syllabi and engineering programming tracks.",
    tags: ["15-60 Day Plans", "NCERT Aligned", "Self-Paced"],
  },
  {
    icon: Flame,
    gradient: "linear-gradient(135deg, #F59E0B, #F97316)",
    title: "Daily Streak Tracking",
    description:
      "Build consistency with GitHub-style streak tracking. Complete daily study goals to maintain your streak, earn bonus XP for milestones, and see visual progress heat maps on your dashboard. Never break the chain!",
    tags: ["Streak Counter", "Heat Map", "Bonus XP"],
  },
  {
    icon: Swords,
    gradient: "linear-gradient(135deg, #EF4444, #F97316)",
    title: "Real-Time Battle Arena",
    description:
      "Challenge friends or get matched with opponents at your skill level. Each battle tests subject knowledge through timed quiz rounds with anti-cheat protection, tab-switch detection, and fair scoring rules.",
    tags: ["Matchmaking", "Anti-Cheat", "Timed Rounds"],
  },
  {
    icon: Trophy,
    gradient: "linear-gradient(135deg, #8B5CF6, #A855F7)",
    title: "XP Leveling System",
    description:
      "Earn XP for completing chapters, winning battles, maintaining streaks, and helping peers. Progress through named levels from Newcomer to Ultimate Legend with visible rank badges across the platform.",
    tags: ["XP Rewards", "Named Levels", "Rank Badges"],
  },
  {
    icon: BarChart3,
    gradient: "linear-gradient(135deg, #10B981, #14B8A6)",
    title: "Smart Analytics Dashboard",
    description:
      "Track your learning journey with detailed charts showing subject-wise performance, XP history, battle win rate, and time spent studying. Identify strengths and weaknesses at a glance.",
    tags: ["Performance Charts", "Win Rate", "Study Time"],
  },
  {
    icon: MessageSquare,
    gradient: "linear-gradient(135deg, #06B6D4, #3B82F6)",
    title: "Community Forums",
    description:
      "Ask questions, share study tips, and discuss problems with peers. Community threads are organized by subject and track, making it easy to find relevant discussions and expert answers.",
    tags: ["Subject Forums", "Peer Help", "Expert Answers"],
  },
  {
    icon: Code2,
    gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    title: "Engineering Code Tracks",
    description:
      "Structured programming plans cover C, C++, Java, Python, JavaScript, TypeScript, Rust, Kotlin, Swift, SQL, Dart, and Ruby. The catalog is already route-connected and ready for deeper problem content.",
    tags: ["12+ Languages", "Practice Problems", "Projects"],
  },
  {
    icon: Shield,
    gradient: "linear-gradient(135deg, #64748B, #475569)",
    title: "Anti-Cheat Protection",
    description:
      "The current foundation already includes server-side validation, signed sessions, protected API routes, and rate limiting. Higher-stakes browser controls belong to the next secure exam phase.",
    tags: ["Protected Routes", "Rate Limiting", "Server Validation"],
  },
  {
    icon: Calendar,
    gradient: "linear-gradient(135deg, #EC4899, #F43F5E)",
    title: "Events & Competitions",
    description:
      "Explore backend-connected event registration today, with a clean service boundary ready for future certificates, organizer tooling, and richer competition workflows.",
    tags: ["Live Catalog", "Registration API", "Organizer Ready"],
  },
];

/**
 * Comparison cards data — shows what makes EduQuest different
 * from traditional education platforms.
 */
const COMPARISONS = [
  {
    icon: Layers,
    title: "Structure Over Chaos",
    description:
      "Unlike video playlists, EduQuest provides clear day-wise study plans that eliminate the guesswork of what to study next.",
  },
  {
    icon: Zap,
    title: "Motivation Built In",
    description:
      "XP, streaks, levels, and battles create intrinsic motivation loops that make consistent daily study feel rewarding.",
  },
  {
    icon: Brain,
    title: "Active Over Passive",
    description:
      "Practice problems, quiz battles, and coding exercises replace passive video watching with active knowledge application.",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Peer forums, study groups, and collaborative events create a support network that textbooks and videos cannot provide.",
  },
];

/**
 * FeaturesPage Component
 *
 * Comprehensive showcase of all EduQuest platform capabilities.
 * Designed to help students and parents understand the full value
 * proposition before signing up.
 *
 * Sections:
 * 1. Hero — headline and subtitle
 * 2. Features Grid — 9 feature cards in bento layout
 * 3. Comparison — 4 cards showing EduQuest advantages
 * 4. CTA — account creation prompt
 */
export default function FeaturesPage() {
  return (
    <div className={styles.page}>
      {/* ==================== HERO SECTION ==================== */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          {/* Kicker badge */}
          <div className={styles.kicker}>
            <Sparkles size={14} />
            Platform Features
          </div>

          {/* Main heading */}
          <h1 className={styles.heroTitle}>
            Everything students need,{" "}
            <span className={styles.heroHighlight}>without the clutter.</span>
          </h1>

          {/* Subtitle */}
          <p className={styles.heroSubtitle}>
            From structured study plans to real-time competitions — explore every
            capability designed to make learning effective and genuinely engaging.
          </p>
        </div>
      </section>

      {/* ==================== FEATURES GRID ==================== */}
      {/* Bento-style grid showcasing all 9 core features.
          Each card includes icon, title, description, and tags. */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className={index === 0 ? styles.featureCardFeatured : styles.featureCard}
            >
              {/* Feature icon — rounded square with gradient background */}
              <div className={styles.featureIcon} style={{ "--icon-gradient": feature.gradient } as React.CSSProperties}>
                <feature.icon size={20} />
              </div>

              {/* Feature content */}
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.description}</p>

              {/* Feature tags — pill badges for quick scanning */}
              <div className={styles.featureTags}>
                {feature.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== COMPARISON SECTION ==================== */}
      {/* Shows what makes EduQuest different from traditional platforms. */}
      <section className={styles.comparisonSection}>
        <div className={styles.comparisonInner}>
          <div className={styles.comparisonHeader}>
            <span className={styles.sectionLabel}>Why EduQuest</span>
            <h2 className={styles.sectionTitle}>Built Different</h2>
            <p className={styles.sectionSubtitle}>
              EduQuest is not just another content library. It is a complete learning
              system designed for consistent progress and healthy competition.
            </p>
          </div>

          <div className={styles.comparisonGrid}>
            {COMPARISONS.map((item) => (
              <article key={item.title} className={styles.comparisonCard}>
                <item.icon size={24} />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Experience Every Feature</h2>
          <p className={styles.ctaSubtitle}>
            Create a free account and explore structured study plans, battles,
            and analytics — all designed to make your learning journey effective.
          </p>
          <Link href="/sign-up" className={styles.ctaBtn}>
            Start Learning Free <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
