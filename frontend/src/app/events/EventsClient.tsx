/*
 * FILE: EventsClient.tsx
 * LOCATION: src/app/events/EventsClient.tsx
 * PURPOSE: Interactive Events page UI with registration flow and event cards.
 * USED BY: src/app/events/page.tsx
 * DEPENDENCIES: next/image, next/link, lucide-react, Events.module.css
 * LAST UPDATED: 2026-05-17
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Code2,
  Loader2,
  Swords,
  Trophy,
  Users,
} from "lucide-react";
import styles from "./Events.module.css";

interface SerializableEvent {
  id: string;
  title: string;
  desc: string;
  date: string;
  location: string;
  participants: number;
  status: "live" | "upcoming" | "completed";
  gradient: string;
}

interface EventsApiResponse {
  ok: boolean;
  data?: {
    events: SerializableEvent[];
    registeredEventIds: string[];
  };
  error?: { message: string };
}

interface RegistrationApiResponse {
  ok: boolean;
  data?: {
    registration: {
      id: string;
      eventId: string;
      userId: string;
      createdAt: string;
    };
  };
  error?: { message: string };
}

/*
 * Resolves a Lucide icon for each event based on its ID.
 * New events added via migration 019 are included here.
 */
const EVENT_ICONS: Record<string, typeof BookOpen> = {
  "science-olympiad-2026":    BookOpen,
  "code-sprint-dsa":          Code2,
  "math-battle-royale":       Swords,
  "inter-college-hackathon":  Code2,
  "class-10-board-mock":      BookOpen,
  "python-championship":      Trophy,
  /* migration 019 events */
  "jee-advanced-mock-marathon":  BookOpen,
  "neet-biology-olympiad":       BookOpen,
  "class-12-board-grand-mock":   BookOpen,
  "python-coding-championship":  Code2,
  "class-10-science-battle":     Swords,
  "dsa-weekly-challenge-may":    Code2,
  "cbse-class-9-math-quiz":      BookOpen,
  "chemistry-jee-sprint":        BookOpen,
  "inter-school-debate-tech":    Trophy,
  "open-source-hackathon-2026":  Code2,
};

/*
 * Maps event ID keyword patterns to a human-readable event type label.
 * Displayed as a chip on each event card so students know what to expect.
 */
function inferEventType(eventId: string): string {
  if (eventId.includes("mock") || eventId.includes("sprint")) return "Mock Exam";
  if (eventId.includes("olympiad") || eventId.includes("debate")) return "Olympiad";
  if (eventId.includes("hackathon")) return "Hackathon";
  if (eventId.includes("battle") || eventId.includes("royale")) return "Battle";
  if (eventId.includes("championship") || eventId.includes("challenge") || eventId.includes("coding")) return "Coding Test";
  if (eventId.includes("quiz")) return "Quiz";
  return "Competition";
}

/*
 * Returns a CSS module class name for the event type chip background.
 * Keeps colours consistent without a map for every possible string.
 */
function eventTypeClass(type: string): string {
  if (type === "Mock Exam")   return "typeExam";
  if (type === "Olympiad")    return "typeOlympiad";
  if (type === "Hackathon")   return "typeHackathon";
  if (type === "Battle")      return "typeBattle";
  if (type === "Coding Test") return "typeCoding";
  return "typeDefault";
}

type NoticeTone = "success" | "error" | "info";

/** 
 * Converts backend event status into the UI label used on each event card. 
 */
function getStatusText(status: SerializableEvent["status"]): string {
  if (status === "live") return "Live Now";
  if (status === "upcoming") return "Upcoming";
  return "Completed";
}

/** 
 * Renders the backend-connected events catalog and protected registration flow. 
 */
export default function EventsClient() {
  const [events, setEvents] = useState<SerializableEvent[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyEventId, setBusyEventId] = useState("");
  const [notice, setNotice] = useState("");
  const [noticeTone, setNoticeTone] = useState<NoticeTone>("info");
  const [activeFilter, setActiveFilter] = useState<"all" | "live" | "upcoming" | "completed">("all");

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      setIsLoading(true);
      setNotice("");

      try {
        const response = await fetch("/api/events", { cache: "no-store" });
        const payload = (await response.json()) as EventsApiResponse;

        if (!isMounted) return;

        if (!response.ok || !payload.ok || !payload.data) {
          setNotice(payload.error?.message ?? "Unable to load events right now.");
          setNoticeTone("error");
          return;
        }

        setEvents(payload.data.events);
        setRegisteredEventIds(payload.data.registeredEventIds);
      } catch {
        if (isMounted) {
          setNotice("Network error while loading events.");
          setNoticeTone("error");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return events;
    return events.filter(e => e.status === activeFilter);
  }, [events, activeFilter]);

  /** 
   * Registers the signed-in student for a live or upcoming event. 
   */
  const handleRegister = async (eventId: string) => {
    setBusyEventId(eventId);
    setNotice("");

    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const payload = (await response.json()) as RegistrationApiResponse;

      if (response.status === 401) {
        setNotice("Please sign in before registering for an event.");
        setNoticeTone("error");
        return;
      }

      if (!response.ok || !payload.ok || !payload.data?.registration) {
        setNotice(payload.error?.message ?? "Unable to save your registration.");
        setNoticeTone("error");
        return;
      }

      setRegisteredEventIds((current) =>
        current.includes(eventId) ? current : [...current, eventId],
      );
      setNotice("Registration saved. You are on the event list.");
      setNoticeTone("success");
    } catch {
      setNotice("Network error while saving your registration.");
      setNoticeTone("error");
    } finally {
      setBusyEventId("");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Events & Competitions</h1>
            <p className={styles.subtitle}>
              Participate in live coding challenges, academic olympiads, and mock tests.
            </p>
          </div>
          <Image
            src="/images/community-events-hero.png"
            alt="Events Hero"
            width={400}
            height={300}
            className={styles.heroImage}
            priority
          />
        </div>

        {notice && (
          <div className={`${styles.notice} ${styles[`notice${noticeTone.charAt(0).toUpperCase() + noticeTone.slice(1)}`]}`}>
            {noticeTone === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{notice}</span>
            {noticeTone === "error" && <Link href="/sign-in" className={styles.noticeLink}>Sign In</Link>}
          </div>
        )}

        <div className={styles.filters}>
          {(["all", "live", "upcoming", "completed"] as const).map(filter => (
            <button
              key={filter}
              className={`${styles.filterBtn} ${activeFilter === filter ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className={styles.loadingPanel}>
            <Loader2 size={32} className={styles.spinner} />
            <p>Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className={styles.emptyState}>
            <Calendar size={48} />
            <h3>No events found</h3>
            <p>Check back later for new competitions and academic events.</p>
          </div>
        ) : (
          <div className={styles.eventGrid}>
            {filteredEvents.map((event) => {
              const Icon = EVENT_ICONS[event.id as keyof typeof EVENT_ICONS] ?? Trophy;
              const isRegistered = registeredEventIds.includes(event.id);
              const isCompleted = event.status === "completed";
              const isLive = event.status === "live";
              const isBusy = busyEventId === event.id;

              /* Infer human-readable event type from the event ID */
              const eventType = inferEventType(event.id);
              const typeClass = eventTypeClass(eventType);

              return (
                <article key={event.id} className={styles.eventCard}>
                  <div className={styles.eventBanner} style={{ "--event-gradient": event.gradient } as React.CSSProperties}>
                    <div className={styles.eventIcon}><Icon size={48} /></div>

                    {/* Status badge — top right corner */}
                    <div className={styles.statusBadgeWrapper}>
                      <span className={`${styles.statusBadge} ${styles[`status${event.status}`]}`}>
                        {isLive && <span className={styles.pulseDot} />}
                        {getStatusText(event.status)}
                      </span>
                    </div>

                    {/* Event type chip — top left corner */}
                    <div className={styles.eventTypeBadgeWrapper}>
                      <span className={`${styles.eventTypeBadge} ${styles[typeClass]}`}>
                        {eventType}
                      </span>
                    </div>
                  </div>

                  <div className={styles.eventBody}>
                    <h2 className={styles.eventTitle}>{event.title}</h2>
                    <p className={styles.eventOrg}>{event.location}</p>
                    
                    <div className={styles.eventMeta}>
                      <div className={styles.metaItem}>
                        <Calendar size={14} />
                        <span>{event.date}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <Users size={14} />
                        <span>{event.participants.toLocaleString()} joined</span>
                      </div>
                    </div>

                    <p className={styles.eventDesc}>{event.desc}</p>

                    <div className={styles.eventActions}>
                      <button
                        className={`${styles.actionBtn} ${isRegistered ? styles.btnSuccess : isCompleted ? styles.btnDisabled : styles.btnPrimary}`}
                        disabled={isCompleted || isRegistered || isBusy}
                        onClick={() => handleRegister(event.id)}
                      >
                        {isBusy ? (
                          <Loader2 size={16} className={styles.spinner} />
                        ) : isRegistered ? (
                          <><CheckCircle2 size={16} /> Registered</>
                        ) : isCompleted ? (
                          "View Results"
                        ) : isLive ? (
                          "Join Now"
                        ) : (
                          "Register"
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
