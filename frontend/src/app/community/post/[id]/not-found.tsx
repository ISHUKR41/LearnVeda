/**
 * FILE: not-found.tsx
 * LOCATION: src/app/community/post/[id]/not-found.tsx
 * PURPOSE: Friendly not-found state for missing community discussions.
 * USED BY: page.tsx when the backend repository cannot find a requested post
 * DEPENDENCIES: next/link, CommunityPostDetail.module.css
 * LAST UPDATED: 2026-05-19
 */

import Link from "next/link";
import styles from "./CommunityPostDetail.module.css";

/** Shows a clear recovery path when a post id is invalid or removed. */
export default function CommunityPostNotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.emptyState}>
          <h1>Discussion not found</h1>
          <p>This post may have been removed, renamed, or never existed.</p>
          <Link href="/community" className={styles.backLink}>
            Back to community
          </Link>
        </section>
      </div>
    </main>
  );
}
