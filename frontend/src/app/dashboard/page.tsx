/**
 * FILE: page.tsx
 * LOCATION: src/app/dashboard/page.tsx
 * PURPOSE: Server page shell for the user dashboard. The interactive dashboard
 *          body lives in DashboardClient.tsx and is dynamically loaded so only
 *          the parts that need hooks are shipped as client JavaScript. It also
 *          performs a server-side auth guard so guests do not see a dashboard
 *          shell before the client redirects them.
 * USED BY: Next.js App Router — renders at "/dashboard"
 * DEPENDENCIES: next/dynamic, DashboardClient, DashboardLoadingSkeleton
 * LAST UPDATED: 2026-05-12
 */

import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthenticatedUserFromToken } from "@/lib/server/auth/current-user";
import { SESSION_COOKIE_NAME } from "@/lib/server/auth/session";
import DashboardLoadingSkeleton from "./DashboardLoadingSkeleton";

export const metadata = {
  title: "Dashboard",
  description: "Your EduQuest learning progress, streaks, XP, battles, and quick actions.",
};

/** Lazy client boundary keeps the dashboard route lightweight before hydration. */
const DashboardClient = dynamic(() => import("./DashboardClient"), {
  loading: () => <DashboardLoadingSkeleton />,
});

/** Renders the lazily-loaded dashboard client boundary after a server auth check. */
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const user = await getAuthenticatedUserFromToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!user) {
    redirect("/sign-in?next=/dashboard");
  }

  return <DashboardClient />;
}
