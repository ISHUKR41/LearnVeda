/**
 * FILE: page.tsx
 * LOCATION: src/app/battle/page.tsx
 * PURPOSE: Server page shell for the Battle Arena. The interactive matchmaking
 *          UI lives in BattleClient.tsx and is lazily loaded via next/dynamic
 *          to keep the initial bundle small for 100+ concurrent users.
 * USED BY: Next.js App Router — renders at "/battle"
 * DEPENDENCIES: next/dynamic, BattleClient, BattleLoadingSkeleton
 * LAST UPDATED: 2026-05-16
 */

import dynamic from "next/dynamic";
import BattleLoadingSkeleton from "./BattleLoadingSkeleton";

/**
 * SEO metadata for the Battle page — stays server-side because page.tsx
 * is a server component. The heavy client JS loads asynchronously.
 */
/* ISR: Battle shell revalidates every 5 minutes */
export const revalidate = 300;

export const metadata = {
  title: "Quiz Battle Arena — Learnova by Ishu | Real-Time Quiz Battles India",
  description:
    "Learnova by Ishu — Real-time quiz battle platform for Indian students. Challenge opponents, win XP, climb the leaderboard. CBSE Class 9-12, Engineering. India's #1 gamified quiz battle platform.",
  keywords: [
    "quiz battle India", "real-time quiz battles India", "online quiz competition India",
    "CBSE quiz battle", "student quiz battle platform India",
    "Learnova battle", "ishu quiz battle", "earn XP quiz India",
    "competitive quiz India students", "live quiz battles India",
    "quiz battle leaderboard India", "gamified quiz India",
  ],
  icons: { icon: "/favicons/battle.svg" },
  openGraph: {
    title: "Quiz Battle Arena — Learnova by Ishu | Real-Time India",
    description: "Real-time quiz battles by Ishu. Challenge, win XP, climb leaderboard. India's #1 gamified quiz battle.",
    type: "website",
  },
};

/**
 * Dynamically import the interactive BattleClient component.
 * This prevents the matchmaking logic, icons, and event handlers from being
 * included in the initial page JavaScript bundle.
 */
const BattleClient = dynamic(() => import("./BattleClient"), {
  loading: () => <BattleLoadingSkeleton />,
});

/** Renders the lazily-loaded Battle client boundary. */
export default function BattlePage() {
  return <BattleClient />;
}
