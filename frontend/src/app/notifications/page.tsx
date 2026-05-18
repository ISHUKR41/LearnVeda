/*
 * FILE: page.tsx
 * LOCATION: src/app/notifications/page.tsx
 * PURPOSE: Notifications inbox — shows all platform notifications for the signed-in
 *          student. Notification types include: battle results, streak milestones,
 *          level-ups, community replies, event reminders, and system announcements.
 *          Fetches from /api/notifications and supports mark-all-read.
 * USED BY: Next.js App Router — accessible at /notifications
 * DEPENDENCIES: lucide-react, Notifications.module.css, /api/notifications
 * LAST UPDATED: 2026-05-17
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell, BellOff, Swords, Flame, Zap, CalendarDays,
  Trophy, MessageSquare, Info, CheckCheck, Loader2, ArrowLeft, AlertCircle
} from "lucide-react";
import styles from "./Notifications.module.css";

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

type NotificationType =
  | "battle"
  | "streak"
  | "level"
  | "community"
  | "event"
  | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string; /* ISO string */
  href?: string;
}

interface NotificationsApiResponse {
  ok: boolean;
  notifications: Notification[];
  unreadCount: number;
  data?: {
    notifications: Notification[];
    unreadCount: number;
  };
}

/* Icon and colour map per notification type */
const TYPE_META: Record<NotificationType, { icon: typeof Bell; colorClass: string }> = {
  battle:    { icon: Swords,          colorClass: "typeBattle"    },
  streak:    { icon: Flame,           colorClass: "typeStreak"    },
  level:     { icon: Zap,             colorClass: "typeLevel"     },
  community: { icon: MessageSquare,   colorClass: "typeCommunity" },
  event:     { icon: CalendarDays,    colorClass: "typeEvent"     },
  system:    { icon: Info,            colorClass: "typeSystem"    },
};

/* Human-friendly relative time formatter */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/* ─────────────────────────────────────────────
 * Component
 * ───────────────────────────────────────────── */

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingRead, setMarkingRead] = useState(false);

  /* Load notifications on mount */
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch("/api/notifications", { cache: "no-store" });

        if (res.status === 401) {
          router.push("/sign-in");
          return;
        }

        const payload = (await res.json()) as NotificationsApiResponse;

        if (!mounted) return;

        if (!res.ok || !payload.ok) {
          setError("Could not load notifications.");
          return;
        }

        const responseData = payload.data ?? payload;
        setNotifications(responseData.notifications ?? []);
        setUnreadCount(responseData.unreadCount ?? 0);
      } catch {
        if (mounted) setError("Network error. Please try again.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [router]);

  /** Marks all unread notifications as read via PATCH /api/notifications. */
  const handleMarkAllRead = async () => {
    if (unreadCount === 0 || markingRead) return;

    setMarkingRead(true);
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } finally {
      setMarkingRead(false);
    }
  };

  /* ── Render States ── */

  if (isLoading) {
    return (
      <div className={styles.loadingPage}>
        <Loader2 size={28} className={styles.spinner} />
        <span>Loading notifications…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorPage}>
        <AlertCircle size={24} />
        <p>{error}</p>
        <Link href="/dashboard" className={styles.backLink}>Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/dashboard" className={styles.backBtn}>
              <ArrowLeft size={16} /> Dashboard
            </Link>
            <div className={styles.titleRow}>
              <Bell size={22} className={styles.titleIcon} />
              <h1 className={styles.title}>Notifications</h1>
              {unreadCount > 0 && (
                <span className={styles.unreadBadge}>{unreadCount}</span>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              className={styles.markReadBtn}
              onClick={handleMarkAllRead}
              disabled={markingRead}
            >
              {markingRead
                ? <><Loader2 size={14} className={styles.spinner} /> Marking…</>
                : <><CheckCheck size={15} /> Mark all read</>
              }
            </button>
          )}
        </div>

        {/* NOTIFICATION LIST */}
        {notifications.length === 0 ? (
          /* Empty state */
          <div className={styles.emptyState}>
            <BellOff size={48} className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>All caught up!</h2>
            <p className={styles.emptyText}>
              You have no notifications right now. Start learning to earn some!
            </p>
            <Link href="/dashboard" className={styles.emptyAction}>
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <ul className={styles.list} role="list">
            {notifications.map((notif) => {
              const meta = TYPE_META[notif.type] ?? TYPE_META.system;
              const Icon = meta.icon;

              const card = (
                <div
                  className={`${styles.notifCard} ${!notif.isRead ? styles.unread : ""}`}
                  role={notif.href ? undefined : "listitem"}
                >
                  {/* Unread indicator stripe */}
                  {!notif.isRead && <div className={styles.unreadStripe} aria-hidden="true" />}

                  {/* Type icon */}
                  <div className={`${styles.notifIcon} ${styles[meta.colorClass]}`}>
                    <Icon size={18} />
                  </div>

                  {/* Content */}
                  <div className={styles.notifContent}>
                    <p className={styles.notifTitle}>{notif.title}</p>
                    <p className={styles.notifMessage}>{notif.message}</p>
                    <time className={styles.notifTime} dateTime={notif.createdAt}>
                      {timeAgo(notif.createdAt)}
                    </time>
                  </div>

                  {/* Trophy icon for achievements/level notifications */}
                  {(notif.type === "level") && (
                    <Trophy size={16} className={styles.notifTrophy} aria-hidden="true" />
                  )}
                </div>
              );

              return (
                <li key={notif.id}>
                  {notif.href ? (
                    <Link href={notif.href} className={styles.notifLink}>
                      {card}
                    </Link>
                  ) : (
                    card
                  )}
                </li>
              );
            })}
          </ul>
        )}

      </div>
    </div>
  );
}
