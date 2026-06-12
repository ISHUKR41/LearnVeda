/**
 * FILE: layout.tsx
 * LOCATION: src/app/profile/layout.tsx
 * PURPOSE: Route layout for /profile to apply custom server-side metadata and the
 *          custom profile.svg favicon, while keeping the main profile page as a
 *          pure Client Component.
 * USED BY: Next.js App Router — automatically applied to /profile route
 * DEPENDENCIES: next
 * LAST UPDATED: 2026-05-26
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile — Track Your Achievements",
  description: "View your badges, unlocked milestones, course progress, and active streaks on your LearnVeda profile.",
  icons: {
    icon: "/favicons/profile.svg",
    shortcut: "/favicons/profile.svg",
  },
};

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return <>{children}</>;
}
