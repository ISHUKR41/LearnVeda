/**
 * FILE: page.tsx
 * LOCATION: src/app/leaderboard/page.tsx
 * PURPOSE: Server page shell for the Leaderboard. The interactive rankings UI
 *          lives in LeaderboardClient.tsx and is lazily loaded via next/dynamic
 *          to keep the initial bundle small for 100+ concurrent users.
 * USED BY: Next.js App Router — renders at "/leaderboard"
 * DEPENDENCIES: next/dynamic, LeaderboardClient, LeaderboardLoadingSkeleton
 * LAST UPDATED: 2026-05-16
 */

import dynamic from "next/dynamic";
import LeaderboardLoadingSkeleton from "./LeaderboardLoadingSkeleton";

/**
 * SEO metadata for the Leaderboard page — stays server-side because page.tsx
 * is a server component. The heavy client JS loads asynchronously.
 */
export const metadata = {
  title: "Leaderboard",
  description: "See where you stand among the best learners on EduQuest. Global and class-specific rankings.",
};

/**
 * Dynamically import the interactive LeaderboardClient component.
 * This prevents the rankings table, filter logic, and crown icons from being
 * included in the initial page JavaScript bundle.
 */
const LeaderboardClient = dynamic(() => import("./LeaderboardClient"), {
  loading: () => <LeaderboardLoadingSkeleton />,
});

/** Renders the lazily-loaded Leaderboard client boundary. */
export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
