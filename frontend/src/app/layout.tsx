/**
 * FILE: layout.tsx
 * LOCATION: src/app/layout.tsx
 * PURPOSE: Root layout for the entire VidyaBolt application.
 *          Wraps every page with the Navbar, Footer, all global providers
 *          (TanStack Query, React Hot Toast, Zustand theme sync), global styles,
 *          font imports, and SEO metadata defaults.
 *          This is the outermost shell — every route renders inside this component.
 * USED BY: Next.js App Router — automatically applied to every page in src/app/
 * DEPENDENCIES: globals.css, Navbar, Footer, Providers, @fontsource fonts
 * LAST UPDATED: 2026-05-19
 * AUTHOR NOTE: This file must remain a SERVER component. All "use client" logic
 *              is isolated inside the Providers wrapper. Never add "use client"
 *              to this file — it would force the entire layout to render on the client.
 */

import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@/lib/clerk-shim/client";
import { SITE_CONFIG } from "@/lib/constants";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import Providers from "@/components/providers/Providers";
import "@/styles/globals.css";
import "katex/dist/katex.min.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-next",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading-next",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-next",
  display: "swap",
});


/* ─────────────────────────────────────────────
 * Viewport Configuration
 * Controls mobile scaling and theme color in the browser chrome.
 * ───────────────────────────────────────────── */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#050d1a" },
  ],
};

/* ─────────────────────────────────────────────
 * SEO Metadata
 * Applied to every page by default. Individual pages override specific fields.
 * ───────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    /* Brand & Creator */
    "VidyaBolt", "VidyaBolt by Ishu", "VidyaBolt India", "vidyabolt.in",
    "ishu", "ishu website", "ishu education", "ishu learning platform",
    "ishu study platform", "ishu gamified learning", "education by ishu",
    "ishu India", "ishu CBSE", "ishu class 9", "ishu class 10",
    "ishu class 11", "ishu class 12", "ishu engineering",
    "ishu quiz battles", "ishu leaderboard", "ishu XP",
    "best education platform by ishu", "ishu's learning platform",
    /* Platform */
    "India's #1 gamified learning platform", "best education platform India",
    "best education website India 2025", "1st rank education platform India",
    "top learning platform India", "free online education platform India",
    "gamified learning India", "quiz battle platform India",
    "study and earn XP", "learn and battle India", "XP points education",
    "streak learning India", "level up learning platform",
    "online study platform India", "India education gamification",
    "competitive learning India", "battle quiz India",
    /* CBSE Classes */
    "CBSE Class 9", "CBSE Class 10", "CBSE Class 11", "CBSE Class 12",
    "CBSE board exam preparation", "CBSE online study",
    "class 9 study platform", "class 10 study platform",
    "class 11 study platform", "class 12 study platform",
    "class 10 science notes", "class 10 light reflection refraction",
    "class 10 maths", "class 9 science", "class 11 physics",
    "class 12 chemistry", "CBSE chapter-wise study",
    "day-wise study plan India", "CBSE revision platform",
    /* Engineering & Coding */
    "engineering coding India", "learn coding India",
    "competitive programming India", "Python learning India",
    "Java learning platform India", "C++ tutorials India",
    "engineering coding roadmap", "30-day coding plan India",
    "programming for students India", "coding battles India",
    /* Exams */
    "JEE preparation online", "NEET preparation online",
    "JEE study platform", "NEET study platform",
    "entrance exam India", "competitive exam India",
    /* All-India State Coverage */
    "study platform Maharashtra", "study platform Delhi",
    "study platform UP", "study platform Bihar",
    "study platform Rajasthan", "study platform MP",
    "study platform Tamil Nadu", "study platform Karnataka",
    "study platform Kerala", "study platform Gujarat",
    "study platform West Bengal", "study platform Andhra Pradesh",
    "study platform Telangana", "study platform Punjab",
    "study platform Haryana", "study platform Odisha",
    "CBSE students India all states", "Hindi medium students online",
    /* Features */
    "online quiz battles", "real-time quiz platform",
    "interactive physics simulations", "study leaderboard India",
    "global leaderboard students", "student XP ranking",
    "flashcards online India", "mind maps study",
    "mock tests online CBSE", "chapter-wise tests India",
    /* Long-tail SEO */
    "VidyaBolt login", "VidyaBolt sign up", "VidyaBolt app",
    "VidyaBolt dashboard", "VidyaBolt battle arena",
    "VidyaBolt community", "VidyaBolt leaderboard",
    "best app to study for CBSE board", "gamified study for Indian students",
    "study platform with games India", "learn CBSE with battles",
    "skills.sh", "getdesign.md"
  ],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    images: [
      {
        url: "/images/vidyabolt-home-hero.png",
        width: 1200,
        height: 630,
        alt: "VidyaBolt — India's Gamified Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: ["/images/vidyabolt-home-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicons/home.svg",
    shortcut: "/favicons/home.svg",
  },
};

/* ─────────────────────────────────────────────
 * Root Layout Component
 * ───────────────────────────────────────────── */

interface RootLayoutProps {
  /** The active page content rendered by Next.js App Router */
  children: React.ReactNode;
}

/**
 * RootLayout — the outermost shell of the VidyaBolt application.
 *
 * Structure:
 *   <html>
 *     <body>
 *       <Providers>          ← TanStack Query + React Hot Toast + theme sync
 *         <Navbar />         ← sticky top navigation bar
 *         <main>             ← page content area
 *           {children}
 *         </main>
 *         <Footer />         ← site footer
 *       </Providers>
 *     </body>
 *   </html>
 *
 * suppressHydrationWarning on <html> prevents a React warning caused by
 * browser extensions injecting attributes into the HTML element.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider
      afterSignOutUrl="/"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} dark`} data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
        <body>
          {/* JSON-LD Schema for Google SEO & AI Bots */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "EducationalOrganization",
                "name": "VidyaBolt by Ishu",
                "url": SITE_CONFIG.url,
                "logo": `${SITE_CONFIG.url}/favicons/home.svg`,
                "sameAs": [
                  "https://www.skills.sh/",
                  "https://getdesign.md/"
                ],
                "description": "India's #1 gamified learning platform created by Ishu.",
                "founder": {
                  "@type": "Person",
                  "name": "Ishu"
                }
              })
            }}
          />
          {/*
           * Providers wraps everything that needs client-side context.
           * It is a "use client" component but keeps the layout itself as a server component.
           * Inside: QueryClientProvider, Toaster, ThemeInitializer
           */}
            <Providers>
              {/* Global sticky navigation bar — appears on every page */}
              <Navbar />

              {/*
               * Main content area — each page component renders here.
               * flex: 1 ensures this area expands to fill available height
               * so the footer always stays at the bottom even on short pages.
               */}
              <main className="app-main">
                {children}
              </main>

              {/* Global footer — appears on every page */}
              <Footer />
            </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
