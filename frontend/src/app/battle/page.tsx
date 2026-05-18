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
export const metadata = {
  title: "Battle Arena",
  description: "Challenge opponents in real-time quiz battles. Win XP and climb the ranks on EduQuest.",
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
