/*
 * FILE: page.tsx
 * LOCATION: src/app/search/page.tsx
 * PURPOSE: Global search page — allows students to search across subjects, chapters,
 *          community posts, and usernames. Results are fetched from the /api/search
 *          endpoint with a debounce of 300ms to avoid hammering the server.
 *          Renders a minimal, focused UI so the student can find content fast.
 * USED BY: Next.js App Router — accessible at /search
 * DEPENDENCIES: lucide-react, Search.module.css, /api/search route
 * LAST UPDATED: 2026-05-17
 */

"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Search, BookOpen, FileText, Users, Hash,
  Loader2, AlertCircle, ArrowRight, X, Layers
} from "lucide-react";
import styles from "./Search.module.css";

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

interface SearchResult {
  id: string;
  type: "chapter" | "subject" | "post" | "user";
  title: string;
  subtitle?: string;
  href: string;
  highlight?: string;
}

interface SearchApiResponse {
  ok: boolean;
  query: string;
  results: SearchResult[];
  total: number;
}

/* ─────────────────────────────────────────────
 * Category tab definitions
 * ───────────────────────────────────────────── */

const FILTER_TABS = [
  { id: "all",     label: "All",      icon: Layers },
  { id: "chapter", label: "Chapters", icon: BookOpen },
  { id: "subject", label: "Subjects", icon: FileText },
  { id: "post",    label: "Posts",    icon: Hash },
  { id: "user",    label: "Users",    icon: Users },
] as const;

type FilterId = typeof FILTER_TABS[number]["id"];

/** Map result type to a lucide icon */
const RESULT_ICONS: Record<string, typeof BookOpen> = {
  chapter: BookOpen,
  subject: FileText,
  post:    Hash,
  user:    Users,
};

/* ─────────────────────────────────────────────
 * Component
 * ───────────────────────────────────────────── */

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [searched, setSearched] = useState(false);

  /* Debounce timer ref — prevents firing on every keystroke */
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Fires the /api/search request after a 300ms debounce.
   * Clears previous results while loading to avoid stale state.
   */
  const performSearch = useCallback(async (q: string) => {
    if (!q.trim() || q.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      const payload = (await res.json()) as SearchApiResponse;

      if (!res.ok || !payload.ok) {
        setError("Search failed. Please try again.");
        setResults([]);
        return;
      }

      setResults(payload.results);
      setSearched(true);
    } catch {
      setError("Network error. Please check your connection.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInput = (value: string) => {
    setQuery(value);

    /* Debounce — cancel any previous timer, then set a new 300ms one */
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => performSearch(value), 300);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
    setError("");
  };

  /* Filter results by the active tab */
  const filtered = activeFilter === "all"
    ? results
    : results.filter(r => r.type === activeFilter);

  /* Count per category for badge display */
  const counts: Record<string, number> = {};
  for (const r of results) counts[r.type] = (counts[r.type] ?? 0) + 1;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* PAGE HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>Search LearnVeda</h1>
          <p className={styles.subtitle}>
            Find chapters, subjects, community posts, and students across the platform.
          </p>
        </div>

        {/* SEARCH INPUT */}
        <div className={styles.inputWrapper}>
          <Search size={20} className={styles.inputIcon} aria-hidden="true" />
          <input
            type="search"
            className={styles.input}
            placeholder="Search chapters, subjects, posts, students…"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            aria-label="Search"
          />
          {query && (
            <button className={styles.clearBtn} onClick={clearSearch} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </div>

        {/* FILTER TABS — shown once we have results */}
        {searched && results.length > 0 && (
          <div className={styles.filterRow} role="tablist" aria-label="Filter results by type">
            {FILTER_TABS.map((tab) => {
              const Icon = tab.icon;
              const count = tab.id === "all" ? results.length : (counts[tab.id] ?? 0);
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeFilter === tab.id}
                  className={`${styles.filterTab} ${activeFilter === tab.id ? styles.filterTabActive : ""}`}
                  onClick={() => setActiveFilter(tab.id)}
                >
                  <Icon size={14} />
                  {tab.label}
                  {count > 0 && <span className={styles.filterBadge}>{count}</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* LOADING STATE */}
        {isLoading && (
          <div className={styles.loadingState}>
            <Loader2 size={24} className={styles.spinner} />
            <span>Searching…</span>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !isLoading && (
          <div className={styles.errorState}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* RESULTS LIST */}
        {!isLoading && !error && filtered.length > 0 && (
          <ul className={styles.resultList} role="list">
            {filtered.map((result) => {
              const Icon = RESULT_ICONS[result.type] ?? BookOpen;
              return (
                <li key={`${result.type}-${result.id}`}>
                  <Link href={result.href} className={styles.resultCard}>
                    <div className={`${styles.resultIcon} ${styles[`resultIcon_${result.type}`]}`}>
                      <Icon size={18} />
                    </div>
                    <div className={styles.resultContent}>
                      <span className={styles.resultTitle}>{result.title}</span>
                      {result.subtitle && (
                        <span className={styles.resultSubtitle}>{result.subtitle}</span>
                      )}
                      {result.highlight && (
                        <span className={styles.resultHighlight}>{result.highlight}</span>
                      )}
                    </div>
                    <span className={`${styles.resultTypeBadge} ${styles[`typeBadge_${result.type}`]}`}>
                      {result.type}
                    </span>
                    <ArrowRight size={14} className={styles.resultArrow} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* EMPTY STATE — query entered but no results */}
        {!isLoading && !error && searched && filtered.length === 0 && (
          <div className={styles.emptyState}>
            <Search size={40} className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>No results found</h2>
            <p className={styles.emptyText}>
              Try different keywords or check your spelling.
            </p>
          </div>
        )}

        {/* INITIAL STATE — nothing typed yet */}
        {!isLoading && !searched && !query && (
          <div className={styles.suggestions}>
            <h2 className={styles.suggestionsTitle}>Quick searches</h2>
            <div className={styles.suggestionPills}>
              {["Triangles", "Newton's Laws", "Pointers in C", "Trigonometry", "Photosynthesis", "Python basics"].map((s) => (
                <button
                  key={s}
                  className={styles.suggestionPill}
                  onClick={() => handleInput(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
