/**
 * FILE: loading.tsx
 * LOCATION: src/app/community/post/[id]/loading.tsx
 * PURPOSE: Route-local loading skeleton for one community post. This keeps the
 *          dynamic route feeling responsive while the server loads post data.
 * USED BY: Next.js App Router during `/community/post/[id]` navigation
 * DEPENDENCIES: CommunityPostDetail.module.css
 * LAST UPDATED: 2026-05-19
 */

import styles from "./CommunityPostDetail.module.css";

/** Renders a stable reading skeleton with no layout shift. */
export default function CommunityPostLoading() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.article}>
          <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
          <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
          <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
          <div className={`${styles.skeleton} ${styles.skeletonLine} ${styles.skeletonLineShort}`} />
        </div>
      </div>
    </main>
  );
}
