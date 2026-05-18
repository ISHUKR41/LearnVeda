/**
 * FILE: EventsLoadingSkeleton.tsx
 * LOCATION: src/app/events/EventsLoadingSkeleton.tsx
 * PURPOSE: Route-local loading skeleton for the Events page. Keeping the
 *          skeleton in its own file makes the dynamic loading boundary easier
 *          to maintain and keeps page.tsx focused only on routing metadata.
 * USED BY: src/app/events/page.tsx
 * DEPENDENCIES: Events.module.css
 * LAST UPDATED: 2026-05-12
 */

import styles from "./Events.module.css";

/** Shows a stable events layout while the interactive events bundle loads. */
export default function EventsLoadingSkeleton() {
  return (
    <div className={styles.loadingShell} aria-busy="true" aria-live="polite">
      <div className={`${styles.loadingHero} ${styles.skeletonShimmer}`} />
      <div className={styles.loadingGrid}>
        <div className={`${styles.loadingCard} ${styles.skeletonShimmer}`} />
        <div className={`${styles.loadingCard} ${styles.skeletonShimmer}`} />
        <div className={`${styles.loadingCard} ${styles.skeletonShimmer}`} />
      </div>
    </div>
  );
}
