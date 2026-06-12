/**
 * FILE: page.tsx
 * LOCATION: src/app/features/page.tsx
 * PURPOSE: Features page — comprehensive showcase of LearnVeda's platform
 *          capabilities organized into sections with comparison grid,
 *          stats banner, and strong CTA.
 * LAST UPDATED: 2026-06-01
 */

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  Code2,
  FlameIcon,
  Layers,
  MessageSquare,
  Shield,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Users,
  Zap,
  CheckCircle2,
  Activity,
  Star,
  Globe2,
} from "lucide-react";
import styles from "./Features.module.css";

export const revalidate = 43200;

export const metadata = {
  title: "Features — LearnVeda by Ishu | Gamified Learning Platform India",
  description:
    "LearnVeda by Ishu: NCERT-aligned day-wise study plans, animated simulations, XP leveling, real-time quiz battles, streaks, leaderboard, community forums. India's best free gamified education platform for CBSE Class 9-12 and Engineering.",
  keywords: [
    "LearnVeda features", "ishu LearnVeda features", "gamified learning features India",
    "CBSE study platform features", "quiz battle platform India", "XP learning India",
    "streak study India", "leaderboard students India", "free education features India",
  ],
};

const FEATURES = [
  {
    icon: Target,
    gradient: "linear-gradient(135deg, #3B82F6, #06B6D4)",
    title: "Day-Wise Learning Plans",
    description:
      "Every subject comes with a structured 15-to-60-day plan. Students follow clear daily tasks instead of guessing what to study. Plans align to Class 9-12 NCERT syllabi and 12 engineering programming tracks — no planning required, just open and start.",
    tags: ["15-60 Day Plans", "NCERT Aligned", "Self-Paced", "Engineering Tracks"],
  },
  {
    icon: FlameIcon,
    gradient: "linear-gradient(135deg, #F59E0B, #F97316)",
    title: "Daily Streak Tracking",
    description:
      "A GitHub-style 12-week activity heatmap and a 7-day streak calendar keep students consistent. Miss a day and the streak resets — study daily and watch it climb. Longest streak is permanently recorded on the dashboard.",
    tags: ["Heatmap Graph", "7-Day Calendar", "Streak Records", "Daily Motivation"],
  },
  {
    icon: Activity,
    gradient: "linear-gradient(135deg, #8B5CF6, #6366F1)",
    title: "Animated Physics Simulations",
    description:
      "Class 9 Force & Laws of Motion includes 25+ professional canvas-based simulations with interactive sliders: Newton's laws, momentum conservation, balanced forces, inertia demos, rocket launches, pendulums, and more — all CBSE syllabus aligned.",
    tags: ["25+ Simulations", "Interactive Sliders", "CBSE Class 9", "Canvas Physics"],
  },
  {
    icon: Swords,
    gradient: "linear-gradient(135deg, #EF4444, #F97316)",
    title: "Real-Time Battle Arena",
    description:
      "Challenge friends or get matched with skill-level opponents. Both players answer timed MCQs simultaneously. Anti-cheat systems detect tab switching. Accuracy, speed, and streak multipliers determine winner. Battle records appear on your dashboard.",
    tags: ["1v1 Matches", "Matchmaking", "Anti-Cheat", "Timed Rounds"],
  },
  {
    icon: Trophy,
    gradient: "linear-gradient(135deg, #8B5CF6, #A855F7)",
    title: "100-Level XP System",
    description:
      "Earn XP for every correct answer (MCQ: 15 XP, Short: 25 XP, Long: 30 XP, Deep: 35 XP). Chapter completion awards level milestones: 25% = 1 level, 50% = 2 levels, 75% = 3 levels, 100% = 4 levels. Progress through named tiers from Learner to Grandmaster.",
    tags: ["100 Levels", "Named Tiers", "XP Per Question", "Chapter Milestones"],
  },
  {
    icon: Star,
    gradient: "linear-gradient(135deg, #F59E0B, #FBBF24)",
    title: "Stars Wallet",
    description:
      "Earn Stars (virtual currency) alongside XP for every correct answer. Stars appear in your wallet with a full transaction ledger. The wallet tracks total earned, total spent, and running balance — viewable from the dashboard sidebar.",
    tags: ["Virtual Currency", "Transaction Ledger", "Balance Tracking", "Earn Per Answer"],
  },
  {
    icon: BarChart3,
    gradient: "linear-gradient(135deg, #10B981, #14B8A6)",
    title: "Smart Analytics Dashboard",
    description:
      "A real-time dashboard shows XP, level progress bar, streak calendar, activity heatmap, battle tickets, leaderboard rank, wallet balance, and recent activity feed — all from a single authenticated view that refreshes automatically when you return from studying.",
    tags: ["XP Progress Bar", "Activity Heatmap", "Real-Time", "Auto-Refresh"],
  },
  {
    icon: MessageSquare,
    gradient: "linear-gradient(135deg, #06B6D4, #3B82F6)",
    title: "Community Forums",
    description:
      "Subject-organized discussion threads let students ask questions, share study tips, and solve problems together. Community posts are tied to your account and visible to peers. Dedicated sections for bug reports and feature requests let students shape the platform.",
    tags: ["Subject Forums", "Peer Help", "Study Tips", "Feature Requests"],
  },
  {
    icon: Code2,
    gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    title: "Engineering Code Tracks",
    description:
      "Structured programming learning plans cover C, C++, Java, Python, JavaScript, TypeScript, Rust, Kotlin, Swift, SQL, Dart, and Ruby — 12 languages in total. Each track is day-wise, gamified with XP, and designed to take beginners to job-ready proficiency.",
    tags: ["12+ Languages", "Day-Wise Plans", "XP Rewards", "Beginner to Pro"],
  },
  {
    icon: BookOpen,
    gradient: "linear-gradient(135deg, #EC4899, #F43F5E)",
    title: "Chapter Deep Dives",
    description:
      "Class 9 Science chapters include multi-thousand-word deep content: every topic broken into subtopics with key points, formulas, real-world examples, and illustrations. 20 questions per topic across MCQ, Short Answer, Long Answer, and HOTS formats.",
    tags: ["NCERT Chapters", "20 Qs Per Topic", "MCQ + HOTS", "Examples & Formulas"],
  },
  {
    icon: Calendar,
    gradient: "linear-gradient(135deg, #14B8A6, #06B6D4)",
    title: "Events & Competitions",
    description:
      "Browse and register for academic olympiads, coding hackathons, and subject championships directly within LearnVeda. Event registrations are saved to your account and visible from your notifications dashboard.",
    tags: ["Olympiads", "Hackathons", "Registration API", "Notifications"],
  },
  {
    icon: Shield,
    gradient: "linear-gradient(135deg, #64748B, #475569)",
    title: "Security & Anti-Cheat",
    description:
      "Clerk handles all authentication with signed JWTs. Every protected API route validates the session server-side. Battle answers are submitted via server-validated endpoints. Rate limiting prevents spam. Tab-switch detection runs during timed battles.",
    tags: ["Clerk Auth", "Server Validation", "Rate Limiting", "Tab Detection"],
  },
];

const COMPARISONS = [
  {
    icon: Layers,
    title: "Structure Over Content Dumps",
    description:
      "Unlike video playlists that leave students wondering what to watch next, LearnVeda provides clear day-wise paths through every subject. Open the app, see today's task, get it done.",
  },
  {
    icon: Zap,
    title: "Motivation Built Into the Product",
    description:
      "XP, levels, streaks, stars, battles, and leaderboards create powerful daily motivation loops. Students return not because they have to — but because it feels like progress.",
  },
  {
    icon: Brain,
    title: "Active Learning Over Passive Watching",
    description:
      "Practice problems, physics simulations, quiz battles, and coding exercises replace passive video watching with active knowledge engagement — the proven way to retain information.",
  },
  {
    icon: Globe2,
    title: "Built for India, by Indians",
    description:
      "NCERT-aligned content, CBSE chapter progression, JEE/NEET level question patterns, and Hindi-medium support — designed specifically for Class 9-12 Indian students.",
  },
  {
    icon: Users,
    title: "Community Accelerates Learning",
    description:
      "Peer forums, subject discussions, and collaborative events create a learning network that textbooks and solitary videos cannot. Teaching peers is the fastest way to learn.",
  },
  {
    icon: CheckCircle2,
    title: "Free to Start, No Credit Card",
    description:
      "Full access to all study plans, simulations, battles, community, and XP system — completely free. No paywalls, no ads, no credit card required to create an account.",
  },
];

const PLATFORM_STATS = [
  { number: "12+",  label: "Programming languages" },
  { number: "100",  label: "XP levels" },
  { number: "25+",  label: "Physics simulations" },
  { number: "9–12", label: "CBSE classes covered" },
];

export default function FeaturesPage() {
  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.kicker}>
            <Sparkles size={14} />
            Platform Features
          </div>
          <h1 className={styles.heroTitle}>
            Everything students need,{" "}
            <span className={styles.heroHighlight}>nothing they don&apos;t.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            From animated CBSE simulations to real-time quiz battles — explore every
            capability built to make daily study structured, competitive, and genuinely rewarding.
          </p>

          {/* Quick stats */}
          <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
            {PLATFORM_STATS.map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-text-primary)" }}>
                  {stat.number}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO GRID ── */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className={index === 0 ? styles.featureCardFeatured : styles.featureCard}
            >
              <div
                className={styles.featureIcon}
                style={{ "--icon-gradient": feature.gradient } as React.CSSProperties}
              >
                <feature.icon size={20} />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.description}</p>
              <div className={styles.featureTags}>
                {feature.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY EDUQUEST ── */}
      <section className={styles.comparisonSection}>
        <div className={styles.comparisonInner}>
          <div className={styles.comparisonHeader}>
            <span className={styles.sectionLabel}>Why LearnVeda</span>
            <h2 className={styles.sectionTitle}>Built Different</h2>
            <p className={styles.sectionSubtitle}>
              LearnVeda is not just another content library. It is a complete
              learning system designed for consistent daily progress and healthy
              academic competition.
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

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Experience Every Feature — Free</h2>
          <p className={styles.ctaSubtitle}>
            Create a free account in 30 seconds and get immediate access to structured
            study plans, animated physics simulations, live quiz battles, your personal
            XP dashboard, and a 50,000+ student community. No credit card. No ads.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/sign-up" className={styles.ctaBtn}>
              Start Learning Free <ArrowRight size={16} />
            </Link>
            <Link
              href="/class-9/science/force-laws-of-motion"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.75rem 1.5rem", border: "1px solid var(--color-border)",
                borderRadius: "10px", color: "var(--color-text-secondary)",
                textDecoration: "none", fontSize: "0.9rem", fontWeight: 600,
              }}
            >
              Try a Free Simulation
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
