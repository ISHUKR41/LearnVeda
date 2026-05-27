/**
 * FILE: layout.tsx
 * LOCATION: src/app/wallet/layout.tsx
 * PURPOSE: Route layout for /wallet to apply custom server-side metadata and the
 *          custom wallet.svg favicon, while keeping the main wallet page as a
 *          pure Client Component.
 * USED BY: Next.js App Router — automatically applied to /wallet route
 * DEPENDENCIES: next
 * LAST UPDATED: 2026-05-26
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stars Wallet — Virtual Earning Rewards",
  description: "Check your Stars balance, earn rewards through consistency milestones, and view bet limits on EduQuest.",
  icons: {
    icon: "/favicons/wallet.svg",
    shortcut: "/favicons/wallet.svg",
  },
};

interface WalletLayoutProps {
  children: React.ReactNode;
}

export default function WalletLayout({ children }: WalletLayoutProps) {
  return <>{children}</>;
}
