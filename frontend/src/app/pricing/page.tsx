/**
 * FILE: page.tsx
 * LOCATION: src/app/pricing/page.tsx
 * PURPOSE: Professional pricing page for EduQuest. Shows three clear tiers —
 *          Free, Student Pro, and School Partner — with feature comparisons and
 *          a clear hierarchy of value. The Free tier covers all current features.
 *          Pro and School tiers are future-positioned with honest messaging.
 *          Designed to convert visitors without misleading them.
 * USED BY: Footer platform links, Navbar
 * DEPENDENCIES: next/link, lucide-react, Pricing.module.css
 * LAST UPDATED: 2026-05-16
 */

import Link from "next/link";
import {
  CheckCircle2, Minus, Zap, Sparkles, ArrowRight,
  Users, School, BookOpen, Swords, BarChart3, Shield,
  Flame, Code2, Trophy, Star
} from "lucide-react";
import styles from "./Pricing.module.css";

/* ISR: Pricing rarely changes — revalidate every 24 hours */
export const revalidate = 86400;

export const metadata = {
  title: "Pricing",
  description: "EduQuest is free for all students. Explore our plans and see exactly what's included.",
};

/**
 * PRICING_PLANS Array
 * Three tier definitions. Each plan has a gradient, badge, price, description,
 * and a list of features with whether they're included.
 */
const PRICING_PLANS = [
  {
    id: "free",
    name: "Student Free",
    badge: "Current Plan",
    price: "₹0",
    period: "forever",
    description: "Complete access to all core learning features. No credit card, no time limit.",
    gradient: "linear-gradient(135deg, #2563EB, #0EA5E9)",
    badgeClass: "badgeFree",
    popular: false,
    cta: "Get Started Free",
    ctaHref: "/sign-up",
    features: [
      { label: "All class tracks (9-12)", included: true },
      { label: "12 Engineering language plans", included: true },
      { label: "Day-wise structured plans", included: true },
      { label: "Streak & XP dashboard", included: true },
      { label: "Real-time battle arena", included: true },
      { label: "Global leaderboard", included: true },
      { label: "Community forums", included: true },
      { label: "Event registration", included: true },
      { label: "Dark mode", included: true },
      { label: "Advanced analytics", included: false },
      { label: "Offline downloads", included: false },
      { label: "Priority battle queue", included: false },
    ],
  },
  {
    id: "pro",
    name: "Student Pro",
    badge: "Coming Soon",
    price: "₹299",
    period: "/month",
    description: "Premium tools for serious aspirants preparing for boards and entrance exams.",
    gradient: "linear-gradient(135deg, #7C3AED, #2563EB)",
    badgeClass: "badgePro",
    popular: true,
    cta: "Join Waitlist",
    ctaHref: "/sign-up",
    features: [
      { label: "Everything in Free", included: true },
      { label: "Advanced analytics dashboard", included: true },
      { label: "Priority battle matchmaking", included: true },
      { label: "Offline content downloads", included: true },
      { label: "Board exam mock tests", included: true },
      { label: "1-on-1 doubt sessions", included: true },
      { label: "AI-powered study planner", included: true },
      { label: "Custom battle practice", included: true },
      { label: "Performance reports (PDF)", included: true },
      { label: "Early feature access", included: true },
      { label: "School team support", included: false },
      { label: "Bulk enrollment", included: false },
    ],
  },
  {
    id: "school",
    name: "School Partner",
    badge: "For Institutions",
    price: "Custom",
    period: "per institution",
    description: "Complete EduQuest deployment for schools with teacher dashboards and bulk enrollment.",
    gradient: "linear-gradient(135deg, #0F766E, #10B981)",
    badgeClass: "badgeSchool",
    popular: false,
    cta: "Contact Us",
    ctaHref: "/contact",
    features: [
      { label: "Everything in Pro", included: true },
      { label: "School admin dashboard", included: true },
      { label: "Teacher progress view", included: true },
      { label: "Bulk student enrollment", included: true },
      { label: "Custom class schedules", included: true },
      { label: "School-wide analytics", included: true },
      { label: "Private battle leagues", included: true },
      { label: "Dedicated onboarding", included: true },
      { label: "API access", included: true },
      { label: "SLA & uptime guarantee", included: true },
      { label: "Custom branding", included: true },
      { label: "Invoice billing", included: true },
    ],
  },
];

/**
 * COMPARISON_FEATURES Array
 * Used in the feature comparison table at the bottom.
 * Maps feature names to which plan includes them.
 */
const COMPARISON_FEATURES = [
  { label: "Class 9-12 Tracks", free: true, pro: true, school: true, icon: BookOpen },
  { label: "Engineering Coding Plans", free: true, pro: true, school: true, icon: Code2 },
  { label: "Battle Arena", free: true, pro: true, school: true, icon: Swords },
  { label: "XP & Leaderboard", free: true, pro: true, school: true, icon: Trophy },
  { label: "Streak Tracking", free: true, pro: true, school: true, icon: Flame },
  { label: "Community Forums", free: true, pro: true, school: true, icon: Users },
  { label: "Advanced Analytics", free: false, pro: true, school: true, icon: BarChart3 },
  { label: "Mock Tests", free: false, pro: true, school: true, icon: Shield },
  { label: "School Admin Dashboard", free: false, pro: false, school: true, icon: School },
  { label: "Bulk Enrollment", free: false, pro: false, school: true, icon: Star },
];

/**
 * PricingPage Component
 *
 * Structured into 4 sections:
 * 1. Hero — headline and current free plan message
 * 2. Plan Cards — three tier cards side by side
 * 3. Comparison Table — feature-by-feature matrix
 * 4. FAQ / Trust — reassurance notes
 */
export default function PricingPage() {
  return (
    <div className={styles.page}>

      {/* ==================== SECTION 1: HERO ==================== */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <Sparkles size={13} />
            Transparent Pricing
          </div>
          <h1 className={styles.heroTitle}>
            Start free. Upgrade when you&apos;re ready.
          </h1>
          <p className={styles.heroSubtitle}>
            Every core EduQuest feature is free forever — class tracks, battles, streaks, leaderboard.
            Pro tools for serious exam prep are coming soon.
          </p>
        </div>
      </section>

      {/* ==================== SECTION 2: PLAN CARDS ==================== */}
      <section className={styles.plansSection}>
        <div className={styles.plansInner}>
          <div className={styles.plansGrid}>
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`${styles.planCard} ${plan.popular ? styles.planCardPopular : ""}`}
              >
                {/* Popular badge on Pro card */}
                {plan.popular && (
                  <div className={styles.popularBadge}>
                    <Star size={12} />
                    Most Requested
                  </div>
                )}

                {/* Plan gradient header bar */}
                <div
                  className={styles.planHeader}
                  style={{ "--plan-gradient": plan.gradient } as React.CSSProperties}
                >
                  <span className={styles.planBadge}>{plan.badge}</span>
                  <h2 className={styles.planName}>{plan.name}</h2>
                  <div className={styles.planPricing}>
                    <span className={styles.planPrice}>{plan.price}</span>
                    <span className={styles.planPeriod}>{plan.period}</span>
                  </div>
                </div>

                {/* Plan description */}
                <p className={styles.planDesc}>{plan.description}</p>

                {/* CTA Button */}
                <Link
                  href={plan.ctaHref}
                  className={`${styles.planCta} ${plan.popular ? styles.planCtaPrimary : styles.planCtaSecondary}`}
                >
                  {plan.id === "free" && <Zap size={15} />}
                  {plan.cta}
                  <ArrowRight size={14} />
                </Link>

                {/* Feature list */}
                <ul className={styles.featureList}>
                  {plan.features.map((feature) => (
                    <li key={feature.label} className={styles.featureItem}>
                      {feature.included ? (
                        <CheckCircle2
                          size={16}
                          className={styles.featureCheckIncluded}
                        />
                      ) : (
                        <Minus
                          size={16}
                          className={styles.featureCheckExcluded}
                        />
                      )}
                      <span
                        className={feature.included ? styles.featureLabelIncluded : styles.featureLabelExcluded}
                      >
                        {feature.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3: COMPARISON TABLE ==================== */}
      <section className={styles.comparisonSection}>
        <div className={styles.comparisonInner}>
          <div className={styles.comparisonHeader}>
            <span className={styles.sectionLabel}>Feature Comparison</span>
            <h2 className={styles.sectionTitle}>What&apos;s in each plan?</h2>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.compTable}>
              <thead>
                <tr>
                  <th className={styles.thFeature}>Feature</th>
                  <th className={styles.thPlan}>Free</th>
                  <th className={styles.thPlan}>Pro</th>
                  <th className={styles.thPlan}>School</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row) => (
                  <tr key={row.label} className={styles.tableRow}>
                    <td className={styles.tdFeature}>
                      <row.icon size={15} className={styles.tableIcon} />
                      {row.label}
                    </td>
                    <td className={styles.tdCheck}>
                      {row.free
                        ? <CheckCircle2 size={17} className={styles.checkYes} />
                        : <Minus size={17} className={styles.checkNo} />
                      }
                    </td>
                    <td className={styles.tdCheck}>
                      {row.pro
                        ? <CheckCircle2 size={17} className={styles.checkYes} />
                        : <Minus size={17} className={styles.checkNo} />
                      }
                    </td>
                    <td className={styles.tdCheck}>
                      {row.school
                        ? <CheckCircle2 size={17} className={styles.checkYes} />
                        : <Minus size={17} className={styles.checkNo} />
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 4: TRUST / FAQ ==================== */}
      <section className={styles.trustSection}>
        <div className={styles.trustInner}>
          <div className={styles.trustGrid}>
            <div className={styles.trustCard}>
              <Shield size={20} className={styles.trustIcon} />
              <h3>No Credit Card Required</h3>
              <p>The free plan needs zero payment info. Sign up with just your email and start learning immediately.</p>
            </div>
            <div className={styles.trustCard}>
              <Flame size={20} className={styles.trustIcon} />
              <h3>Free Is Genuinely Free</h3>
              <p>We do not lock core learning features behind trials. Battles, streaks, and all class tracks stay free forever.</p>
            </div>
            <div className={styles.trustCard}>
              <BarChart3 size={20} className={styles.trustIcon} />
              <h3>Pro Is Not Ready Yet</h3>
              <p>We are being honest — Pro features are in development. Join the waitlist and be the first to access them.</p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className={styles.finalCta}>
            <h2>Ready to start learning?</h2>
            <p>Join thousands of students already using EduQuest — completely free.</p>
            <Link href="/sign-up" className={styles.finalCtaBtn}>
              Create Free Account
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
