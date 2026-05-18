/**
 * FILE: BattleLoadingSkeleton.tsx
 * LOCATION: src/app/battle/BattleLoadingSkeleton.tsx
 * PURPOSE: Route-local loading skeleton for the Battle page. It keeps the
 *          dynamic import fallback separate from the server route metadata and
 *          avoids inline styles inside page.tsx.
 * USED BY: src/app/battle/page.tsx
 * DEPENDENCIES: Battle.module.css
 * LAST UPDATED: 2026-05-16
 */

import styles from "./Battle.module.css";

/** Shows a stable battle layout while the interactive BattleClient bundle loads. */
export default function BattleLoadingSkeleton() {
  return (
    <div className={styles.loadingShell} aria-busy="true" aria-live="polite">
      <div className={`${styles.loadingTitle} ${styles.skeletonShimmer}`} />
      <div className={`${styles.loadingSubtitle} ${styles.skeletonShimmer}`} />
      <div className={`${styles.loadingMatchCard} ${styles.skeletonShimmer}`} />
      <div className={styles.loadingStatsGrid}>
        <div className={`${styles.loadingStat} ${styles.skeletonShimmer}`} />
        <div className={`${styles.loadingStat} ${styles.skeletonShimmer}`} />
        <div className={`${styles.loadingStat} ${styles.skeletonShimmer}`} />
        <div className={`${styles.loadingStat} ${styles.skeletonShimmer}`} />
      </div>
    </div>
  );
}
