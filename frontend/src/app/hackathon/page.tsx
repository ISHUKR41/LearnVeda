/**
 * FILE: page.tsx
 * LOCATION: src/app/hackathon/page.tsx
 * PURPOSE: Server-side entry page for the Hackathon portal.
 *          Exposes detailed, targeted SEO metadata and dynamic route configurations
 *          while dynamically importing the interactive React Client component.
 * USED BY: Next.js App Router — renders at "/hackathon"
 * DEPENDENCIES: next/dynamic, HackathonClient
 * LAST UPDATED: 2026-05-27
 */

import dynamic from "next/dynamic";

// Server-side dynamic metadata for Indian engineering and BTech coding students
export const metadata = {
  title: "Engineering Hackathons & Coding Tournaments",
  description: "Participate in national-level 24-hour coding hackathons, build innovative full-stack software, submit repositories, and win certificates.",
  keywords: [
    "engineering hackathons India",
    "BTech coding challenges",
    "24 hour hackathon",
    "student coding tournaments",
    "placement preparation",
    "learn web development India",
  ],
  icons: {
    icon: "/favicons/events.svg",
  },
};

/** Dynamic loading placeholder skeletal loader */
function HackathonLoadingSkeleton() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "#050d1a",
      color: "#8b949e",
      fontFamily: "sans-serif"
    }}>
      <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>Loading Hackathon Portal...</p>
    </div>
  );
}

// Dynamically import the client shell with our custom loading state (code splitting)
const HackathonClient = dynamic(() => import("./HackathonClient"), {
  loading: () => <HackathonLoadingSkeleton />,
  ssr: false // Client state depends on window/localStorage, disable server-side render for safety
});

export default function HackathonPage() {
  return <HackathonClient />;
}
