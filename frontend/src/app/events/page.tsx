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

export const metadata = {
  title: "Events",
  description: "Participate in academic competitions, coding hackathons, and knowledge tournaments.",
};

/** Lazy client boundary keeps the event catalog fast on first paint. */
const EventsClient = dynamic(() => import("./EventsClient"), {
  loading: () => <EventsLoadingSkeleton />,
});

/** Renders the lazily-loaded events client boundary. */
export default function EventsPage() {
  return <EventsClient />;
}
