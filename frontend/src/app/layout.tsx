/**
 * FILE: layout.tsx
 * LOCATION: src/app/layout.tsx
 * PURPOSE: Root layout for the entire EduQuest application.
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
import { ClerkProvider } from "@clerk/nextjs";
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
    "education platform India", "gamified learning", "CBSE Class 9",
    "CBSE Class 10", "CBSE Class 11", "CBSE Class 12", "engineering coding",
    "JEE preparation", "NEET preparation", "competitive programming India",
    "online quiz battles", "streak learning", "XP points education",
    "learn coding India", "study platform",
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
        url: "/images/eduquest-home-hero.png",
        width: 1200,
        height: 630,
        alt: "EduQuest — India's Gamified Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: ["/images/eduquest-home-hero.png"],
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
 * RootLayout — the outermost shell of the EduQuest application.
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
