/*
 * FILE: CommunityClient.tsx
 * LOCATION: src/app/community/CommunityClient.tsx
 * PURPOSE: Interactive community feed with category filtering and post creation.
 * USED BY: src/app/community/page.tsx
 * DEPENDENCIES: lucide-react, Community.module.css
 * LAST UPDATED: 2026-05-17
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Code2, 
  Eye, 
  Loader2, 
  MessageSquare, 
  Send, 
  ThumbsUp, 
  Trophy, 
  Users,
  PlusCircle,
  Search,
  Filter,
  MoreVertical
} from "lucide-react";
import type { CommunityPost } from "@/lib/server/data/platform-store";
import styles from "./Community.module.css";

interface PostsApiResponse {
  ok: boolean;
  data?: { posts: CommunityPost[]; post?: CommunityPost };
  error?: { message: string };
}

const CATEGORIES = [
  { name: "All Posts",   tag: "all",         icon: Users,       color: "var(--color-primary)" },
  { name: "General",     tag: "general",      icon: MessageSquare, color: "var(--color-text-secondary)" },
  { name: "Class 9",     tag: "class-9",      icon: BookOpen,    color: "var(--color-success)" },
  { name: "Class 10",    tag: "class-10",     icon: BookOpen,    color: "var(--color-primary-light)" },
  { name: "Class 11",    tag: "class-11",     icon: BookOpen,    color: "#A78BFA" },
  { name: "Class 12",    tag: "class-12",     icon: BookOpen,    color: "#FB923C" },
  { name: "Engineering", tag: "engineering",  icon: Code2,       color: "var(--color-secondary)" },
  { name: "Battles",     tag: "battle",       icon: Trophy,      color: "var(--color-accent)" },
];

/** 
 * Formats a post timestamp into a short student-friendly label. 
 */
function formatPostTime(isoDate: string): string {
  const diff = Date.now() - Date.parse(isoDate);
  const minutes = Math.max(1, Math.round(diff / 60000));

  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

/** 
 * Renders persisted community posts with improved visual design. 
 */
export default function CommunityClient() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagText, setTagText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "posting" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      setStatus("loading");
      setMessage("");

      try {
        const response = await fetch("/api/community/posts", { cache: "no-store" });
        const payload = (await response.json()) as PostsApiResponse;

        if (!isMounted) return;

        if (!response.ok || !payload.ok || !payload.data) {
          setStatus("error");
          setMessage(payload.error?.message ?? "Unable to load community posts.");
          return;
        }

        setPosts(payload.data.posts);
        setStatus("idle");
      } catch {
        if (isMounted) {
          setStatus("error");
          setMessage("Network error while loading community posts.");
        }
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  /* Filter posts by both category and search query */
  const visiblePosts = useMemo(() => {
    let filtered = posts;
    /* Apply category filter */
    if (activeCategory !== "all") {
      filtered = filtered.filter((post) =>
        post.tags.some((tag) => tag.toLowerCase().includes(activeCategory.toLowerCase())) ||
        (activeCategory === "general" && post.tags.length === 0)
      );
    }
    /* Apply search filter (title + body) */
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.body.toLowerCase().includes(q) ||
          post.authorName.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [activeCategory, searchQuery, posts]);

  /** 
   * Creates a new post through the protected community API route. 
   */
  const handleCreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("posting");
    setMessage("");

    const tags = tagText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 4);

    try {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, tags }),
      });
      const payload = (await response.json()) as PostsApiResponse;

      if (response.status === 401) {
        setStatus("error");
        setMessage("Please sign in before posting.");
        return;
      }

      if (!response.ok || !payload.ok || !payload.data?.post) {
        setStatus("error");
        setMessage(payload.error?.message ?? "Unable to create post.");
        return;
      }

      setPosts((currentPosts) => [payload.data!.post!, ...currentPosts]);
      setTitle("");
      setBody("");
      setTagText("");
      setStatus("idle");
      setShowCreateForm(false);
      setMessage("Post created successfully.");
    } catch {
      setStatus("error");
      setMessage("Network error while creating your post.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>LearnVeda Community</h1>
            <p className={styles.subtitle}>Collaborate with fellow students and share knowledge.</p>
          </div>
          <button 
            className={styles.newPostBtn} 
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <PlusCircle size={20} />
            Ask a Question
          </button>
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.searchBar}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search discussions..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>
                <Filter size={16} /> Categories
              </h3>
              <div className={styles.categories}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.tag}
                    className={`${styles.categoryCard} ${activeCategory === cat.tag ? styles.categoryCardActive : ""}`}
                    onClick={() => setActiveCategory(cat.tag)}
                  >
                    <div className={`${styles.categoryIcon} ${styles[`catIcon_${cat.tag.replace(/-/g, "_")}`]}`}>
                      <cat.icon size={18} />
                    </div>
                    <span className={styles.categoryName}>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className={styles.mainContent}>
            {showCreateForm && (
              <form className={styles.createPost} onSubmit={handleCreatePost}>
                <h2 className={styles.formTitle}>New Discussion</h2>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input
                    className={styles.formInput}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What is your question about?"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Details</label>
                  <textarea
                    className={styles.formTextarea}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Describe your question or share your knowledge..."
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Tags (comma separated)</label>
                  <input
                    className={styles.formInput}
                    value={tagText}
                    onChange={(e) => setTagText(e.target.value)}
                    placeholder="e.g. Class 10, Physics, Electricity"
                  />
                </div>
                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.cancelBtn} 
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className={styles.submitBtn} 
                    type="submit" 
                    disabled={status === "posting"}
                  >
                    {status === "posting" ? <Loader2 size={16} className={styles.spinner} /> : <Send size={16} />}
                    {status === "posting" ? "Posting..." : "Submit Post"}
                  </button>
                </div>
                {message && (
                  <div className={`${styles.formNotice} ${status === "error" ? styles.noticeError : styles.noticeSuccess}`}>
                    {message}
                  </div>
                )}
              </form>
            )}

            <div className={styles.postList}>
              {status === "loading" ? (
                <div className={styles.loadingState}>
                  <Loader2 className={styles.spinner} size={32} />
                  <p>Loading community feed...</p>
                </div>
              ) : visiblePosts.length === 0 ? (
                <div className={styles.emptyState}>
                  <Users size={48} />
                  <h3>No posts found</h3>
                  <p>Be the first to start a discussion in this category!</p>
                </div>
              ) : (
                visiblePosts.map((post) => (
                  <article key={post.id} className={styles.postCard}>
                    <div className={styles.postHeader}>
                      <div className={styles.postAuthorInfo}>
                        <div className={styles.authorAvatar}>
                          {post.authorName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div className={styles.authorMeta}>
                          <span className={styles.authorName}>
                            {post.authorName} 
                            <span className={styles.authorLevel}>Lv.8</span>
                          </span>
                          <span className={styles.postDate}>{formatPostTime(post.createdAt)}</span>
                        </div>
                      </div>
                      <button className={styles.postMenuBtn}><MoreVertical size={18} /></button>
                    </div>

                    <div className={styles.postContent}>
                      <h2 className={styles.postTitle}>{post.title}</h2>
                      <p className={styles.postExcerpt}>{post.body}</p>
                    </div>

                    <div className={styles.postTags}>
                      {post.tags.map((tag) => (
                        <span key={tag} className={styles.tagChip}>{tag}</span>
                      ))}
                    </div>

                    <div className={styles.postFooter}>
                      <div className={styles.postStats}>
                        <button className={styles.statBtn}><ThumbsUp size={16} /> {post.likes}</button>
                        <button className={styles.statBtn}><MessageSquare size={16} /> {post.comments}</button>
                        <span className={styles.statView}><Eye size={16} /> {post.views}</span>
                      </div>
                      <Link href={`/community/post/${post.id}`} className={styles.readMoreLink}>
                        Read More
                      </Link>
                    </div>
                  </article>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
