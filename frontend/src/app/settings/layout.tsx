/**
 * FILE: layout.tsx
 * LOCATION: src/app/settings/layout.tsx
 * PURPOSE: Route layout for /settings to apply custom server-side metadata and the
 *          custom settings.svg favicon, while keeping the main settings page as a
 *          pure Client Component.
 * USED BY: Next.js App Router — automatically applied to /settings route
 * DEPENDENCIES: next
 * LAST UPDATED: 2026-05-26
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings — Customize Your Account",
  description: "Configure your Learnova account settings, adjust notification preferences, and manage security settings.",
  icons: {
    icon: "/favicons/settings.svg",
    shortcut: "/favicons/settings.svg",
  },
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return <>{children}</>;
}
