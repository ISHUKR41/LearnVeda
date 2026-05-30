/**
 * FILE: page.tsx
 * LOCATION: src/app/dashboard/page.tsx
 * PURPOSE: Server page shell for the user dashboard. The interactive dashboard
 *          body lives in DashboardClient.tsx and is dynamically loaded so only
 *          the parts that need hooks are shipped as client JavaScript.
 *          Uses Clerk's server-side auth() to verify the session. If the user
 *          is not signed in, they are redirected to the Clerk sign-in page.
 *          The clerkMiddleware in middleware.ts also protects this route, but
 *          this server guard acts as a defense-in-depth layer.
 * USED BY: Next.js App Router — renders at "/dashboard"
 * DEPENDENCIES: next/dynamic, DashboardClient, DashboardLoadingSkeleton, @clerk/nextjs/server
 * LAST UPDATED: 2026-05-30
 */

import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import DashboardLoadingSkeleton from "./DashboardLoadingSkeleton";

/* ─────────────────────────────────────────────
 * SEO Metadata
 * Applied when the /dashboard route is rendered.
 * ───────────────────────────────────────────── */
export const metadata = {
  title: "Dashboard",
  description: "Your EduQuest learning progress, streaks, XP, battles, and quick actions.",
  icons: {
    icon: "/favicons/dashboard.svg",
  },
};

/**
 * Lazy client boundary keeps the dashboard route lightweight before hydration.
 * The DashboardClient component contains all the interactive UI (charts,
 * streak counters, battle history, etc.) and loads only after the server
 * confirms the user is authenticated.
 */
const DashboardClient = dynamic(() => import("./DashboardClient"), {
  loading: () => <DashboardLoadingSkeleton />,
});

/**
 * DashboardPage — server component that guards the dashboard route.
 * 
 * Auth Flow:
 *   1. Clerk middleware has already verified the session at the edge
 *   2. This server guard double-checks using auth() from @clerk/nextjs/server
 *   3. If no userId is found, redirect to sign-in with a return URL
 *   4. If authenticated, render the lazy-loaded DashboardClient
 */
export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/dashboard");
  }

  return <DashboardClient />;
}
