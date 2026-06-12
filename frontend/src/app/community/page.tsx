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

/* ISR: community posts change frequently, revalidate every 2 minutes */
export const revalidate = 120;

export const metadata = {
  title: "Student Community Forum — Learnova by Ishu | India Students",
  description:
    "Learnova by Ishu — Student community forum for Indian students. Ask doubts, share notes, discuss CBSE, JEE, NEET, Engineering. Join India's #1 gamified learning community.",
  keywords: [
    "student community India", "CBSE doubt forum India", "Learnova community",
    "ishu community platform", "student forum India online", "JEE doubt community",
    "NEET doubt forum India", "study community India", "Learnova forum",
    "gamified student community India", "ishu student forum",
  ],
  icons: { icon: "/favicons/community.svg" },
  openGraph: {
    title: "Student Community — Learnova by Ishu | India",
    description: "Student forum by Ishu. Ask doubts, share notes, CBSE, JEE, NEET discussions. India's #1 learning community.",
    type: "website",
  },
};

/** Lazy client boundary keeps the community route responsive on first load. */
const CommunityClient = dynamic(() => import("./CommunityClient"), {
  loading: () => <CommunityLoadingSkeleton />,
});

/** Renders the lazily-loaded community client boundary. */
export default function CommunityPage() {
  return <CommunityClient />;
}
