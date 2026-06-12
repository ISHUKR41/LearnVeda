/**
 * FILE: page.tsx
 * LOCATION: src/app/events/page.tsx
 * PURPOSE: Server page shell for the events area. The interactive event catalog
 *          and registration flow live in EventsClient.tsx and are dynamically
 *          imported so the page keeps metadata server-side while the browser
 *          downloads only the JavaScript it actually needs.
 * USED BY: Next.js App Router — renders at "/events"
 * DEPENDENCIES: next/dynamic, EventsClient, EventsLoadingSkeleton
 * LAST UPDATED: 2026-05-12
 */

import dynamic from "next/dynamic";
import EventsLoadingSkeleton from "./EventsLoadingSkeleton";

/* ISR: events list revalidates every 5 minutes */
export const revalidate = 300;

export const metadata = {
  title: "Events & Competitions — LearnVeda by Ishu | Students India",
  description:
    "LearnVeda by Ishu — Academic competitions, coding hackathons, and knowledge tournaments for Indian students. Win prizes, earn XP, climb leaderboard. CBSE Class 9-12 + Engineering events India.",
  keywords: [
    "student events India", "academic competitions India", "coding hackathon India students",
    "knowledge tournament India", "CBSE competition online India",
    "LearnVeda events", "ishu events platform", "student quiz competition India",
    "win prizes study India", "online competition Indian students",
    "gamified events India", "LearnVeda tournaments",
  ],
  icons: { icon: "/favicons/events.svg" },
  openGraph: {
    title: "Events & Competitions — LearnVeda by Ishu | India",
    description: "Competitions, hackathons, tournaments for Indian students by Ishu. Win prizes, earn XP. India's #1.",
    type: "website",
  },
};

/** Lazy client boundary keeps the event catalog fast on first paint. */
const EventsClient = dynamic(() => import("./EventsClient"), {
  loading: () => <EventsLoadingSkeleton />,
});

/** Renders the lazily-loaded events client boundary. */
export default function EventsPage() {
  return <EventsClient />;
}
