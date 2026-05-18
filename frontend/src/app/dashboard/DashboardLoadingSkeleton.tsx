/**
 * FILE: DashboardLoadingSkeleton.tsx
 * LOCATION: src/app/dashboard/DashboardLoadingSkeleton.tsx
 * PURPOSE: Route-local loading skeleton for the Dashboard page. This file keeps
 *          dynamic loading presentation separate from dashboard data-fetching
 *          logic and avoids inline styling in page.tsx.
 * USED BY: src/app/dashboard/page.tsx
 * DEPENDENCIES: Dashboard.module.css
 * LAST UPDATED: 2026-05-12
 */

import styles from "./Dashboard.module.css";

/** Shows a stable dashboard layout while the interactive dashboard bundle loads. */
export default function DashboardLoadingSkeleton() {
  return (
    <div className={styles.loadingShell} aria-busy="true" aria-live="polite">
      <div className={`${styles.loadingTitle} ${styles.skeletonBlock}`} />
      <div className={styles.loadingStatsGrid}>
        <div className={`${styles.loadingStat} ${styles.skeletonBlock}`} />
        <div className={`${styles.loadingStat} ${styles.skeletonBlock}`} />
        <div className={`${styles.loadingStat} ${styles.skeletonBlock}`} />
        <div className={`${styles.loadingStat} ${styles.skeletonBlock}`} />
      </div>
      <div className={styles.loadingMainGrid}>
        <div className={`${styles.loadingPanel} ${styles.skeletonBlock}`} />
        <div className={`${styles.loadingPanel} ${styles.skeletonBlock}`} />
      </div>
    </div>
  );
}
