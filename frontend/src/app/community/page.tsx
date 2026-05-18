/**
 * FILE: page.tsx
 * LOCATION: src/app/community/page.tsx
 * PURPOSE: Server page shell for the community area. The interactive feed and
 *          post form live in CommunityClient.tsx and are dynamically loaded so
 *          metadata stays server-side without front-loading unnecessary JS.
 * USED BY: Next.js App Router — renders at "/community"
 * DEPENDENCIES: next/dynamic, CommunityClient, CommunityLoadingSkeleton
 * LAST UPDATED: 2026-05-16
 */

import dynamic from "next/dynamic";
import CommunityLoadingSkeleton from "./CommunityLoadingSkeleton";

export const metadata = {
  title: "Community",
  description: "Join discussions, ask questions, and help others on the EduQuest community forums.",
};

/** Lazy client boundary keeps the community route responsive on first load. */
const CommunityClient = dynamic(() => import("./CommunityClient"), {
  loading: () => <CommunityLoadingSkeleton />,
});

/** Renders the lazily-loaded community client boundary. */
export default function CommunityPage() {
  return <CommunityClient />;
}
