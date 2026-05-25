/**
 * FILE: page.tsx
 * LOCATION: src/app/contact/page.tsx
 * PURPOSE: Contact page — provides multiple contact methods for students,
 *          parents, institutions, and event organizers. Includes an FAQ
 *          section for common questions and a CTA to join the platform.
 * USED BY: Footer "Contact" link, navbar navigation
 * DEPENDENCIES: next/link, lucide-react, Contact.module.css
 * LAST UPDATED: 2026-05-11
 */

import Link from "next/link";
import {
  ArrowRight,
  HelpCircle,
  Mail,
  MessageSquare,
  School,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import styles from "./Contact.module.css";

/* ISR: Contact page rarely changes — revalidate every 24 hours */
export const revalidate = 86400;

/** SEO metadata — ensures proper indexing of the Contact page. */
export const metadata = {
  title: "Contact EduQuest — Support, Partnerships & Events",
  description:
    "Contact EduQuest for student support, institutional partnerships, event collaborations, and community questions.",
};

/**
 * Contact methods data — each represents a different way to reach EduQuest.
 * Includes: icon, gradient for the icon circle, title, description, and contact detail.
 */
const CONTACT_METHODS = [
  {
    icon: Mail,
    gradient: "linear-gradient(135deg, #3B82F6, #06B6D4)",
    title: "Student Support",
    description:
      "Having trouble with your account, study plans, or battle system? Our support team responds within 24 hours.",
    detail: "support@eduquest.local",
    detailType: "email" as const,
  },
  {
    icon: School,
    gradient: "linear-gradient(135deg, #8B5CF6, #A855F7)",
    title: "Institutions & Schools",
    description:
      "Interested in bringing EduQuest to your school or coaching center? We offer institutional licensing and bulk onboarding.",
    detail: "partners@eduquest.local",
    detailType: "email" as const,
  },
  {
    icon: Trophy,
    gradient: "linear-gradient(135deg, #F59E0B, #F97316)",
    title: "Events & Sponsorship",
    description:
      "Want to sponsor a coding contest, olympiad, or championship event? Let us know your proposal.",
    detail: "events@eduquest.local",
    detailType: "email" as const,
  },
  {
    icon: MessageSquare,
    gradient: "linear-gradient(135deg, #10B981, #14B8A6)",
    title: "Community Questions",
    description:
      "Academic questions, study tips, and peer discussions belong in the community forum where experts can help.",
    detail: "Visit Community",
    detailType: "link" as const,
  },
  {
    icon: Users,
    gradient: "linear-gradient(135deg, #EC4899, #F43F5E)",
    title: "Content Creators",
    description:
      "If you create educational content and want to contribute chapter notes, solutions, or video explanations, reach out.",
    detail: "creators@eduquest.local",
    detailType: "email" as const,
  },
  {
    icon: HelpCircle,
    gradient: "linear-gradient(135deg, #64748B, #475569)",
    title: "General Inquiries",
    description:
      "For press, media, career opportunities, or anything else that does not fit the categories above.",
    detail: "hello@eduquest.local",
    detailType: "email" as const,
  },
];

/**
 * FAQ data — frequently asked questions with answers.
 * These address common concerns students and parents have about the platform.
 */
const FAQ_ITEMS = [
  {
    question: "Is EduQuest free to use?",
    answer:
      "Yes! EduQuest offers a free tier that includes access to all class subjects, coding tracks, and the community forum. Premium features like advanced analytics and event participation may require a subscription in the future.",
  },
  {
    question: "Which classes and subjects does EduQuest cover?",
    answer:
      "EduQuest covers Class 9 through 12 with NCERT-aligned subjects including Mathematics, Science, English, Social Science, and Hindi. Stream-specific subjects are available for Class 11-12 (Science, Commerce, Arts). The Engineering track covers 12+ programming languages.",
  },
  {
    question: "How does the Battle Arena work?",
    answer:
      "The Battle Arena matches you with opponents at a similar skill level. Both players answer timed quiz questions simultaneously. Points are awarded for accuracy and speed. Anti-cheat measures ensure fair play.",
  },
  {
    question: "Can I use EduQuest on my phone?",
    answer:
      "EduQuest is built with a responsive design that works across all devices — desktop, tablet, and mobile. A dedicated mobile app is planned for a future release.",
  },
  {
    question: "How is my data protected?",
    answer:
      "We use server-side password hashing, httpOnly session cookies, rate limiting, and input validation on every endpoint. We never store plaintext passwords and follow security best practices.",
  },
  {
    question: "How do I report a bug or suggest a feature?",
    answer:
      "Use the community forum to share bug reports and feature suggestions. You can also email support@eduquest.local with detailed descriptions and screenshots.",
  },
];

/**
 * ContactPage Component
 *
 * Comprehensive contact page with multiple reach-out methods, FAQ section,
 * and CTA. Designed to help different user types (students, parents,
 * institutions, creators) find the right contact channel quickly.
 *
 * Sections:
 * 1. Hero — headline and subtitle
 * 2. Contact Methods — 6 cards with different contact channels
 * 3. FAQ — 6 frequently asked questions with answers
 * 4. CTA — prompt to join the platform
 */
export default function ContactPage() {
  return (
    <div className={styles.page}>
      {/* ==================== HERO SECTION ==================== */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          {/* Kicker badge */}
          <div className={styles.kicker}>
            <Sparkles size={14} />
            Contact Us
          </div>

          {/* Main heading */}
          <h1 className={styles.heroTitle}>
            Reach the right EduQuest team.
          </h1>

          {/* Subtitle */}
          <p className={styles.heroSubtitle}>
            Whether you are a student needing help, a school exploring partnerships,
            or a creator looking to contribute — we are here to help.
          </p>
        </div>
      </section>

      {/* ==================== CONTACT METHODS ==================== */}
      {/* Grid of 6 contact cards — each for a different user type and purpose. */}
      <section className={styles.methodsSection}>
        <div className={styles.methodsGrid}>
          {CONTACT_METHODS.map((method) => (
            <article key={method.title} className={styles.methodCard}>
              {/* Icon circle with gradient background */}
              <div className={styles.methodIcon} style={{ "--icon-gradient": method.gradient } as React.CSSProperties}>
                <method.icon size={22} />
              </div>

              {/* Card content */}
              <h3>{method.title}</h3>
              <p>{method.description}</p>

              {/* Contact detail — email or link */}
              {method.detailType === "email" ? (
                <a
                  href={`mailto:${method.detail}`}
                  className={styles.methodDetail}
                >
                  <Mail size={14} />
                  {method.detail}
                </a>
              ) : (
                <Link href="/community" className={styles.methodDetail}>
                  <MessageSquare size={14} />
                  {method.detail}
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      {/* Frequently asked questions — helps reduce support email volume
          by answering common questions directly on the page. */}
      <section className={styles.faqSection}>
        <div className={styles.faqInner}>
          <div className={styles.faqHeader}>
            <span className={styles.sectionLabel}>FAQ</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionSubtitle}>
              Quick answers to common questions about EduQuest, accounts, and the platform.
            </p>
          </div>

          <div className={styles.faqList}>
            {FAQ_ITEMS.map((item) => (
              <div key={item.question} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{item.question}</h3>
                <p className={styles.faqAnswer}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Join the EduQuest Community</h2>
          <p className={styles.ctaSubtitle}>
            Create your free account and start learning with structured plans,
            competitions, and a supportive community of learners.
          </p>
          <Link href="/sign-up" className={styles.ctaBtn}>
            Get Started Free <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
