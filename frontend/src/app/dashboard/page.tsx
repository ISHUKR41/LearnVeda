/**
 * FILE: page.tsx
 * LOCATION: src/app/dashboard/page.tsx
 * PURPOSE: Dashboard page server component. Auth is handled entirely by
 *          Clerk middleware (clerkMiddleware + createRouteMatcher in middleware.ts),
 *          so this page can safely assume the user is signed in before it renders.
 *          DashboardClient fetches real data from /api/dashboard once mounted.
 * USED BY: Next.js App Router — /dashboard route
 * DEPENDENCIES: DashboardClient (dynamic), DashboardLoadingSkeleton
 * LAST UPDATED: 2026-05-31
 */

import dynamic from "next/dynamic";
import DashboardLoadingSkeleton from "./DashboardLoadingSkeleton";

export const metadata = {
  title: "Dashboard | Learnova",
  description: "Your Learnova learning progress, streaks, XP, battles, and quick actions.",
  icons: {
    icon: "/favicons/dashboard.svg",
  },
};

/* Lazy-load the heavy client bundle — DashboardLoadingSkeleton shown while loading */
const DashboardClient = dynamic(() => import("./DashboardClient"), {
  loading: () => <DashboardLoadingSkeleton />,
});

/**
 * Dashboard page — Clerk middleware already enforces authentication before
 * this component runs, so no manual session check is needed here.
 * The DashboardClient component calls /api/dashboard to hydrate its state.
 */
export default function DashboardPage() {
  return <DashboardClient />;
}
