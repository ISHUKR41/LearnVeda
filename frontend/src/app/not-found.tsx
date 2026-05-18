/**
 * FILE: not-found.tsx
 * LOCATION: src/app/not-found.tsx
 * PURPOSE: Friendly 404 page for routes that do not exist yet. It gives users
 *          clear ways back into learning instead of leaving them stranded.
 * USED BY: Next.js App Router automatically
 * DEPENDENCIES: next/link, AppState.module.css, lucide-react
 * LAST UPDATED: 2026-05-11
 */

import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";
import styles from "./AppState.module.css";

/** Shows the missing-page recovery screen. */
export default function NotFound() {
  return (
    <div className={styles.statePage}>
      <div className={styles.stateCard}>
        <div className={styles.stateIcon}>
          <SearchX size={22} />
        </div>
        <h1 className={styles.stateTitle}>Page not found</h1>
        <p className={styles.stateText}>
          This learning area is not available yet. Jump back to a working section and keep moving.
        </p>
        <div className={styles.stateActions}>
          <Link href="/" className={styles.stateButton}>
            Go Home <ArrowRight size={16} />
          </Link>
          <Link href="/dashboard" className={`${styles.stateButton} ${styles.stateButtonSecondary}`}>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
