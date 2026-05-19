/**
 * FILE: page.tsx
 * LOCATION: src/app/community/post/[id]/page.tsx
 * PURPOSE: Server-rendered community post detail page. It fixes the feed's
 *          "Read More" path by loading real persisted post data through the
 *          backend service layer instead of rendering placeholder content.
 * USED BY: Next.js App Router — renders at "/community/post/[id]"
 * DEPENDENCIES: next/link, lucide-react, community-service, local CSS module
 * LAST UPDATED: 2026-05-19
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, MessageSquare, ThumbsUp, UserCircle } from "lucide-react";
import { loadCommunityPostById } from "@/lib/server/services/community-service";
import styles from "./CommunityPostDetail.module.css";

interface CommunityPostPageProps {
  params: Promise<{ id: string }>;
}

/** Builds compact initials for the author avatar without requesting a profile. */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Formats persisted timestamps for a readable discussion header. */
function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

/** Renders one persisted community discussion with professional reading layout. */
export default async function CommunityPostPage({ params }: CommunityPostPageProps) {
  const { id } = await params;
  const post = await loadCommunityPostById(id, { incrementViews: true });

  if (!post) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link href="/community" className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to community
        </Link>

        <article className={styles.article}>
          <header className={styles.articleHeader}>
            <div className={styles.metaRow}>
              <span className={styles.authorPill}>
                <span className={styles.avatar}>{getInitials(post.authorName)}</span>
                {post.authorName}
              </span>
              <span aria-hidden="true">•</span>
              <span>{formatDate(post.createdAt)}</span>
              <span aria-hidden="true">•</span>
              <span className={styles.authorPill}>
                <UserCircle size={16} />
                Student discussion
              </span>
            </div>

            <h1 className={styles.title}>{post.title}</h1>

            {post.tags.length > 0 && (
              <div className={styles.tags} aria-label="Post tags">
                {post.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className={styles.body}>{post.body}</div>

          <footer className={styles.stats} aria-label="Discussion statistics">
            <span className={styles.stat}>
              <ThumbsUp size={16} />
              {post.likes} likes
            </span>
            <span className={styles.stat}>
              <MessageSquare size={16} />
              {post.comments} comments
            </span>
            <span className={styles.stat}>
              <Eye size={16} />
              {post.views} views
            </span>
          </footer>
        </article>
      </div>
    </main>
  );
}
