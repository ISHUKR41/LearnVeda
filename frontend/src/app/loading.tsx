/**
 * FILE: loading.tsx
 * LOCATION: src/app/loading.tsx
 * PURPOSE: App-level loading UI. Next.js streams this skeleton during route
 *          transitions so users get instant feedback instead of a blank screen.
 * USED BY: Next.js App Router automatically
 * DEPENDENCIES: AppState.module.css
 * LAST UPDATED: 2026-05-11
 */

import styles from "./AppState.module.css";

/** Displays a compact skeleton while route content is loading. */
export default function Loading() {
  return (
    <div className={styles.statePage}>
      <div className={styles.stateCard} aria-busy="true" aria-live="polite">
        <div className={styles.stateIcon} />
        <p className={styles.stateText}>Loading your EduQuest workspace...</p>
        <div className={styles.loadingRows}>
          <span className={styles.loadingRow} />
          <span className={styles.loadingRow} />
          <span className={styles.loadingRow} />
        </div>
      </div>
    </div>
  );
}
