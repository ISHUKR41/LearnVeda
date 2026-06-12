/**
 * FILE: page.tsx
 * LOCATION: src/app/contact/page.tsx
 * PURPOSE: Professional contact page for LearnVeda.
 *          Ultra-modern design with: animated hero, contact method cards,
 *          an inline contact form, comprehensive FAQ accordion,
 *          response-time SLA badges, trust signals, and a CTA.
 * USED BY: Footer "Contact" link, navbar navigation
 * DEPENDENCIES: next/link, lucide-react, Contact.module.css
 * LAST UPDATED: 2026-05-31
 */

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  School,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import styles from "./Contact.module.css";
import ContactFormClient from "./ContactFormClient";

/* ISR: revalidate every 24 hours — contact info rarely changes */
export const revalidate = 86400;

export const metadata = {
  title: "Contact LearnVeda by Ishu — Support & Help Center",
  description:
    "Contact LearnVeda by Ishu for student support, school partnerships, and community help. India's #1 gamified education platform. Response within 24 hours.",
  keywords: [
    "contact LearnVeda", "LearnVeda support", "ishu LearnVeda contact",
    "LearnVeda help", "LearnVeda India contact", "ishu education contact",
  ],
};

/* ─────────────────────────────────────────────────────
 * CONTACT CHANNELS — Each card has a response-time SLA
 * ───────────────────────────────────────────────────── */
const CONTACT_METHODS = [
  {
    icon: Mail,
    gradient: "linear-gradient(135deg, #3B82F6, #06B6D4)",
    shadowColor: "rgba(59,130,246,0.25)",
    title: "Student Support",
    description:
      "Account issues, study plan help, or battle system bugs? Our support team is standing by.",
    detail: "support@learnveda.in",
    detailType: "email" as const,
    sla: "< 24 h",
    slaColor: "#10B981",
  },
  {
    icon: School,
    gradient: "linear-gradient(135deg, #8B5CF6, #A855F7)",
    shadowColor: "rgba(139,92,246,0.25)",
    title: "Schools & Institutions",
    description:
      "Bulk onboarding, institutional licensing, and white-label solutions for coaching centers.",
    detail: "partners@learnveda.in",
    detailType: "email" as const,
    sla: "< 48 h",
    slaColor: "#F59E0B",
  },
  {
    icon: Trophy,
    gradient: "linear-gradient(135deg, #F59E0B, #F97316)",
    shadowColor: "rgba(245,158,11,0.25)",
    title: "Events & Sponsorship",
    description:
      "Co-sponsor an olympiad, hackathon, or championship. Tell us your proposal.",
    detail: "events@learnveda.in",
    detailType: "email" as const,
    sla: "< 48 h",
    slaColor: "#F59E0B",
  },
  {
    icon: MessageSquare,
    gradient: "linear-gradient(135deg, #10B981, #14B8A6)",
    shadowColor: "rgba(16,185,129,0.25)",
    title: "Community Forum",
    description:
      "Academic questions, peer discussions, and study tips belong in the community where everyone learns.",
    detail: "Visit Community →",
    detailType: "link" as const,
    href: "/community",
    sla: "Public",
    slaColor: "#6366F1",
  },
  {
    icon: Users,
    gradient: "linear-gradient(135deg, #EC4899, #F43F5E)",
    shadowColor: "rgba(236,72,153,0.25)",
    title: "Content Creators",
    description:
      "Want to contribute chapter notes, solved examples, or video walkthroughs? We'd love to work with you.",
    detail: "creators@learnveda.in",
    detailType: "email" as const,
    sla: "< 72 h",
    slaColor: "#F59E0B",
  },
  {
    icon: HelpCircle,
    gradient: "linear-gradient(135deg, #64748B, #475569)",
    shadowColor: "rgba(100,116,139,0.25)",
    title: "Press & General",
    description:
      "Media inquiries, career opportunities, or anything else that doesn't fit the categories above.",
    detail: "hello@learnveda.in",
    detailType: "email" as const,
    sla: "< 72 h",
    slaColor: "#F59E0B",
  },
];

/* ─────────────────────────────────────────────────────
 * FAQ DATA
 * ───────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    question: "Is LearnVeda completely free?",
    answer:
      "Yes — the free tier gives you full access to all class subjects (9–12), coding tracks, the community forum, and real-time quiz battles. Advanced analytics, offline mode, and premium event access may require a subscription.",
  },
  {
    question: "Which classes and subjects are covered?",
    answer:
      "LearnVeda covers Class 9–12 with NCERT-aligned curricula including Mathematics, Science (Physics, Chemistry, Biology), English, Social Science, and Hindi. Class 11–12 includes stream-specific subjects (Science, Commerce, Arts). The Engineering track covers 12+ programming languages.",
  },
  {
    question: "How does the Battle Arena work?",
    answer:
      "The Battle Arena matches you with a peer at a similar XP level. Both players answer timed MCQs simultaneously. Accuracy, speed, and streak multipliers determine your final score. Anti-cheat measures keep competition fair.",
  },
  {
    question: "How is my personal data protected?",
    answer:
      "LearnVeda uses Clerk for authentication, session management, Google sign-in support, and protected route checks. Sensitive APIs validate the signed-in user before returning dashboard, wallet, activity, or achievement data.",
  },
  {
    question: "Can I access LearnVeda on mobile?",
    answer:
      "Absolutely. LearnVeda is fully responsive and works on every device — desktop, tablet, and mobile. A dedicated Android & iOS app is on our 2026 roadmap.",
  },
  {
    question: "How do XP and levels work?",
    answer:
      "Correct answers award XP and Stars by question type. Dashboard level progress uses fixed XP thresholds, while chapter completion awards level milestones at 25%, 50%, 75%, and 100%.",
  },
  {
    question: "How do I report a bug or suggest a feature?",
    answer:
      "Post in the Community forum under 'Bug Reports' or 'Feature Requests'. You can also email support@learnveda.in with screenshots and reproduction steps — we read every ticket.",
  },
  {
    question: "Can my school get a dashboard to track all students?",
    answer:
      "Yes. Institutional plans include a teacher/admin dashboard with class-level analytics, assignment creation, leaderboards, and CSV export. Email partners@learnveda.in for a demo.",
  },
];

/* ─────────────────────────────────────────────────────
 * TRUST BADGES
 * ───────────────────────────────────────────────────── */
const TRUST_ITEMS = [
  { icon: Shield, label: "Secure Auth", sub: "Clerk sessions" },
  { icon: Clock, label: "24h Support", sub: "Mon–Sat" },
  { icon: Zap, label: "99.9% Uptime", sub: "SLA guaranteed" },
  { icon: CheckCircle2, label: "CBSE Aligned", sub: "Class 9–12" },
];

/* ═══════════════════════════════════════════════════════
 * ContactPage Component
 * ═══════════════════════════════════════════════════════ */
export default function ContactPage() {
  return (
    <div className={styles.page}>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.kicker}>
            <Sparkles size={13} />
            We&apos;re here to help
          </div>

          <h1 className={styles.heroTitle}>
            Reach the right&nbsp;
            <span className={styles.heroGradient}>LearnVeda team</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Whether you&apos;re a student needing support, a school exploring partnerships,
            or a creator wanting to contribute — the right team is just a message away.
          </p>

          {/* Trust badges row */}
          <div className={styles.trustRow}>
            {TRUST_ITEMS.map((t) => (
              <div key={t.label} className={styles.trustBadge}>
                <t.icon size={15} className={styles.trustIcon} />
                <div>
                  <div className={styles.trustLabel}>{t.label}</div>
                  <div className={styles.trustSub}>{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CONTACT CARDS ══════════════════ */}
      <section className={styles.methodsSection}>
        <div className={styles.sectionHeaderCenter}>
          <span className={styles.sectionLabel}>Contact Channels</span>
          <h2 className={styles.sectionTitle}>Find your contact&nbsp;channel</h2>
          <p className={styles.sectionSubtitle}>Each team has a dedicated inbox with committed response times.</p>
        </div>

        <div className={styles.methodsGrid}>
          {CONTACT_METHODS.map((method) => (
            <article
              key={method.title}
              className={styles.methodCard}
              style={{ "--shadow-color": method.shadowColor } as React.CSSProperties}
            >
              {/* SLA badge */}
              <div className={styles.slaBadge} style={{ color: method.slaColor, borderColor: method.slaColor }}>
                <Clock size={10} />
                {method.sla}
              </div>

              {/* Icon */}
              <div
                className={styles.methodIcon}
                style={{ background: method.gradient } as React.CSSProperties}
              >
                <method.icon size={22} />
              </div>

              <h3 className={styles.methodTitle}>{method.title}</h3>
              <p className={styles.methodDesc}>{method.description}</p>

              {/* Contact detail */}
              {method.detailType === "email" ? (
                <a href={`mailto:${method.detail}`} className={styles.methodLink}>
                  <Mail size={13} />
                  {method.detail}
                </a>
              ) : (
                <Link href={method.href ?? "/community"} className={styles.methodLink}>
                  <MessageSquare size={13} />
                  {method.detail}
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ══════════════════ CONTACT FORM + INFO ══════════════════ */}
      <section className={styles.formSection}>
        <div className={styles.formGrid}>

          {/* Left — info panel */}
          <div className={styles.formInfo}>
            <span className={styles.sectionLabel}>Send a Message</span>
            <h2 className={styles.formInfoTitle}>
              Tell us what&apos;s&nbsp;on your mind
            </h2>
            <p className={styles.formInfoText}>
              Prefer a form? Fill out the fields on the right and we&apos;ll route
              your message to the right team. We reply to every submission.
            </p>

            <div className={styles.infoItems}>
              <div className={styles.infoItem}>
                <div className={styles.infoItemIcon} style={{ background: "linear-gradient(135deg,#3B82F6,#6366F1)" }}>
                  <Mail size={16} />
                </div>
                <div>
                  <div className={styles.infoItemLabel}>Email</div>
                  <div className={styles.infoItemValue}>support@learnveda.in</div>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoItemIcon} style={{ background: "linear-gradient(135deg,#10B981,#14B8A6)" }}>
                  <Phone size={16} />
                </div>
                <div>
                  <div className={styles.infoItemLabel}>WhatsApp</div>
                  <div className={styles.infoItemValue}>+91 98XXX XXXXX</div>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoItemIcon} style={{ background: "linear-gradient(135deg,#F59E0B,#F97316)" }}>
                  <MapPin size={16} />
                </div>
                <div>
                  <div className={styles.infoItemLabel}>Headquarters</div>
                  <div className={styles.infoItemValue}>New Delhi, India 🇮🇳</div>
                </div>
              </div>
            </div>

            <div className={styles.responsePromise}>
              <CheckCircle2 size={15} className={styles.responseIcon} />
              We respond to every message within 24–72 hours, Mon–Sat.
            </div>
          </div>

          {/* Right — interactive client-side form (ContactFormClient handles submit + toast) */}
          <div className={styles.formCard}>
            <ContactFormClient />
          </div>
        </div>
      </section>

      {/* ══════════════════ FAQ ══════════════════ */}
      <section className={styles.faqSection}>
        <div className={styles.faqInner}>
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.sectionLabel}>FAQ</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionSubtitle}>
              Quick answers to common questions — no need to email for these.
            </p>
          </div>

          <div className={styles.faqGrid}>
            {FAQ_ITEMS.map((item) => (
              <div key={item.question} className={styles.faqItem}>
                <div className={styles.faqQ}>
                  <CheckCircle2 size={15} className={styles.faqIcon} />
                  <h3>{item.question}</h3>
                </div>
                <p className={styles.faqAnswer}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaBadge}>
            <Sparkles size={12} /> Join 50,000+ students
          </div>
          <h2 className={styles.ctaTitle}>Start learning on LearnVeda — it&apos;s free</h2>
          <p className={styles.ctaSubtitle}>
            Structured CBSE study plans, real-time quiz battles, XP rewards, and
            a global leaderboard. No credit card needed.
          </p>
          <div className={styles.ctaActions}>
            <Link href="/sign-up" className={styles.ctaBtnPrimary}>
              Create Free Account <ArrowRight size={16} />
            </Link>
            <Link href="/features" className={styles.ctaBtnGhost}>
              See all features
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
