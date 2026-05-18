/**
 * FILE: LeaderboardLoadingSkeleton.tsx
 * LOCATION: src/app/leaderboard/LeaderboardLoadingSkeleton.tsx
 * PURPOSE: Route-local loading skeleton for the Leaderboard page. It preserves
 *          the final page shape while the interactive leaderboard bundle loads.
 * USED BY: src/app/leaderboard/page.tsx
 * DEPENDENCIES: Leaderboard.module.css
 * LAST UPDATED: 2026-05-16
 */

import styles from "./Leaderboard.module.css";

/** Shows stable ranking placeholders while the LeaderboardClient bundle loads. */
export default function LeaderboardLoadingSkeleton() {
  return (
    <div className={styles.loadingShell} aria-busy="true" aria-live="polite">
      <div className={`${styles.loadingTitle} ${styles.skeletonShimmer}`} />
      <div className={`${styles.loadingSubtitle} ${styles.skeletonShimmer}`} />
      <div className={styles.loadingFilters}>
        <div className={`${styles.loadingFilter} ${styles.skeletonShimmer}`} />
        <div className={`${styles.loadingFilter} ${styles.skeletonShimmer}`} />
        <div className={`${styles.loadingFilter} ${styles.skeletonShimmer}`} />
        <div className={`${styles.loadingFilter} ${styles.skeletonShimmer}`} />
      </div>
      <div className={styles.loadingPodium}>
        <div className={`${styles.loadingPodiumSide} ${styles.skeletonShimmer}`} />
        <div className={`${styles.loadingPodiumCenter} ${styles.skeletonShimmer}`} />
        <div className={`${styles.loadingPodiumSide} ${styles.skeletonShimmer}`} />
      </div>
      <div className={styles.loadingRows}>
        <div className={`${styles.loadingRow} ${styles.skeletonShimmer}`} />
        <div className={`${styles.loadingRow} ${styles.skeletonShimmer}`} />
        <div className={`${styles.loadingRow} ${styles.skeletonShimmer}`} />
        <div className={`${styles.loadingRow} ${styles.skeletonShimmer}`} />
      </div>
    </div>
  );
}
