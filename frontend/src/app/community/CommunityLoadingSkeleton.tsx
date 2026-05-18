/**
 * FILE: CommunityLoadingSkeleton.tsx
 * LOCATION: src/app/community/CommunityLoadingSkeleton.tsx
 * PURPOSE: Route-local loading skeleton for the Community page. It keeps
 *          dynamic loading UI in its own file so page.tsx only owns metadata
 *          and routing.
 * USED BY: src/app/community/page.tsx
 * DEPENDENCIES: Community.module.css
 * LAST UPDATED: 2026-05-16
 */

import styles from "./Community.module.css";

/** Shows a stable community feed layout while the CommunityClient bundle loads. */
export default function CommunityLoadingSkeleton() {
  return (
    <div className={styles.loadingShell} aria-busy="true" aria-live="polite">
      <div className={`${styles.loadingTitle} ${styles.skeletonShimmer}`} />
      <div className={`${styles.loadingSubtitle} ${styles.skeletonShimmer}`} />
      <div className={styles.loadingGrid}>
        <div className={styles.loadingFeed}>
          <div className={`${styles.loadingPost} ${styles.skeletonShimmer}`} />
          <div className={`${styles.loadingPost} ${styles.skeletonShimmer}`} />
        </div>
        <div className={`${styles.loadingSidebar} ${styles.skeletonShimmer}`} />
      </div>
    </div>
  );
}
