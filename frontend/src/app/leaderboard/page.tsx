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
/* ISR: leaderboard revalidates every 5 minutes */
export const revalidate = 300;

export const metadata = {
  title: "Leaderboard — LearnVeda by Ishu | Top Students India",
  description: "See India's top students on LearnVeda by Ishu. Global and class-specific rankings, XP scores, and streaks. Climb the leaderboard and become #1!",
  keywords: [
    "LearnVeda leaderboard", "ishu leaderboard", "top students India",
    "student ranking India", "CBSE leaderboard online", "XP leaderboard India",
    "best students leaderboard India", "ishu LearnVeda ranking",
  ],
  icons: {
    icon: "/favicons/leaderboard.svg",
  },
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
