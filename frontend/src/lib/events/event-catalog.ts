/**
 * FILE: event-catalog.ts
 * LOCATION: src/lib/events/event-catalog.ts
 * PURPOSE: Shared event catalog used by the Events page and Events API. Keeping
 *          the catalog here prevents the UI and backend route from disagreeing
 *          about valid event ids, titles, statuses, and registration behavior.
 * USED BY: src/app/events/EventsClient.tsx, src/app/api/events route handlers
 * LAST UPDATED: 2026-05-11
 */

import type { LucideIcon } from "lucide-react";
import { BookOpen, Code2, Swords, Trophy } from "lucide-react";

export type EventStatus = "live" | "upcoming" | "completed";

export interface PlatformEvent {
  id: string;
  title: string;
  desc: string;
  date: string;
  location: string;
  participants: number;
  status: EventStatus;
  gradient: string;
  icon: LucideIcon;
}

/** Event cards shown publicly and accepted by backend registration routes. */
export const PLATFORM_EVENTS: PlatformEvent[] = [
  {
    id: "science-olympiad-2026",
    title: "Science Olympiad 2026",
    desc: "Test your science knowledge across Physics, Chemistry, and Biology in this national-level competition.",
    date: "May 24, 2026",
    location: "Online",
    participants: 1250,
    status: "upcoming",
    gradient: "linear-gradient(135deg, #3B82F6, #06B6D4)",
    icon: BookOpen,
  },
  {
    id: "code-sprint-dsa",
    title: "Code Sprint — DSA Challenge",
    desc: "Solve 10 DSA problems in 2 hours. Top performers win premium subscriptions and certificates.",
    date: "May 12, 2026",
    location: "Online",
    participants: 890,
    status: "live",
    gradient: "linear-gradient(135deg, #EF4444, #F97316)",
    icon: Code2,
  },
  {
    id: "math-battle-royale",
    title: "Math Battle Royale",
    desc: "50 players, 1 winner. Quick-fire math questions with elimination rounds.",
    date: "Jun 2, 2026",
    location: "Online",
    participants: 650,
    status: "upcoming",
    gradient: "linear-gradient(135deg, #8B5CF6, #A855F7)",
    icon: Swords,
  },
  {
    id: "inter-college-hackathon",
    title: "Inter-College Hackathon",
    desc: "Build a full-stack project in 24 hours. Teams of 3-4. Open to all engineering students.",
    date: "Jun 20, 2026",
    location: "Delhi NCR",
    participants: 420,
    status: "upcoming",
    gradient: "linear-gradient(135deg, #10B981, #14B8A6)",
    icon: Code2,
  },
  {
    id: "class-10-board-mock",
    title: "Board Exam Mock Test — Class 10",
    desc: "Full-length mock exam simulating actual CBSE board exam conditions with instant analysis.",
    date: "Apr 28, 2026",
    location: "Online",
    participants: 2100,
    status: "completed",
    gradient: "linear-gradient(135deg, #6B7280, #9CA3AF)",
    icon: BookOpen,
  },
  {
    id: "python-championship",
    title: "Python Championship",
    desc: "Competitive programming contest focused on Python. Beginner to advanced problems included.",
    date: "Jul 5, 2026",
    location: "Online",
    participants: 780,
    status: "upcoming",
    gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
    icon: Trophy,
  },
];

/** Returns true when an event exists and can accept registration. */
export function canRegisterForEvent(eventId: string): boolean {
  const event = PLATFORM_EVENTS.find((item) => item.id === eventId);
  return Boolean(event && event.status !== "completed");
}

/** Returns the event object without React icon functions for API responses. */
export function getSerializableEvents() {
  return PLATFORM_EVENTS.map((event) => {
    const { icon, ...serializableEvent } = event;
    void icon;
    return serializableEvent;
  });
}
