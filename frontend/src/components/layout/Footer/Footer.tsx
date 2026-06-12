/*
 * FILE: Footer.tsx
 * LOCATION: src/components/layout/Footer/Footer.tsx
 * PURPOSE: Site-wide footer component displayed at the bottom of every page.
 * USED BY: src/app/layout.tsx
 * DEPENDENCIES: next/link, lucide-react, Footer.module.css
 * LAST UPDATED: 2026-05-17
 */

import Link from "next/link";
import { BookOpen } from "lucide-react";
import styles from "./Footer.module.css";

/**
 * Footer Component
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          
          {/* Brand Col */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              <BookOpen size={24} className={styles.logoIcon} />
              <span className={styles.logoText}>LearnVeda</span>
            </Link>
            <p className={styles.tagline}>
              India&apos;s #1 gamified learning platform for CBSE & Engineering students.
            </p>
          </div>

          {/* Learn Col */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Learn</h4>
            <Link href="/class-9" className={styles.link}>Class 9</Link>
            <Link href="/class-10" className={styles.link}>Class 10</Link>
            <Link href="/class-11" className={styles.link}>Class 11</Link>
            <Link href="/class-12" className={styles.link}>Class 12</Link>
            <Link href="/engineering" className={styles.link}>Engineering</Link>
            <Link href="/test" className={styles.link}>Test Center</Link>
          </div>

          {/* Platform Col */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Platform</h4>
            <Link href="/dashboard" className={styles.link}>Dashboard</Link>
            <Link href="/battle" className={styles.link}>Live Battles</Link>
            <Link href="/leaderboard" className={styles.link}>Leaderboard</Link>
            <Link href="/community" className={styles.link}>Community</Link>
            <Link href="/events" className={styles.link}>Events</Link>
            <Link href="/pricing" className={styles.link}>Pricing</Link>
          </div>

          {/* Company Col */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Company</h4>
            <Link href="/about" className={styles.link}>About</Link>
            <Link href="/features" className={styles.link}>Features</Link>
            <Link href="/contact" className={styles.link}>Contact</Link>
            <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
            <Link href="/terms" className={styles.link}>Terms of Service</Link>
          </div>

          {/* Resources Col */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Resources & Partners</h4>
            <a href="https://www.skills.sh/" target="_blank" rel="noopener noreferrer" className={styles.link}>skills.sh</a>
            <a href="https://getdesign.md/" target="_blank" rel="noopener noreferrer" className={styles.link}>getdesign.md</a>
          </div>

        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © 2026 LearnVeda | Made with ♥ for Indian students
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/contact" className={styles.bottomLink}>Support</Link>
            <Link href="/privacy" className={styles.bottomLink}>Privacy</Link>
            <Link href="/terms" className={styles.bottomLink}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
