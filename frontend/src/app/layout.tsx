/**
 * FILE: layout.tsx
 * LOCATION: src/app/layout.tsx
 * PURPOSE: Root layout for the entire LearnVeda application.
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
    /* ── Brand: LearnVeda ── */
    "LearnVeda", "LearnVeda India", "LearnVeda by Ishu", "learnveda.in",
    "LearnVeda login", "LearnVeda sign up", "LearnVeda app", "LearnVeda free",
    "LearnVeda dashboard", "LearnVeda battle arena", "LearnVeda community",
    "LearnVeda leaderboard", "LearnVeda CBSE", "LearnVeda Class 10",
    "LearnVeda Class 9", "LearnVeda Class 11", "LearnVeda Class 12",
    "LearnVeda engineering", "LearnVeda review", "LearnVeda platform",
    "what is LearnVeda", "LearnVeda kya hai", "LearnVeda for students",
    /* ── Creator: Ishu (every possible search variation) ── */
    "ishu", "ishu education", "ishu website", "ishu learning",
    "ishu learning platform", "ishu study platform", "ishu gamified",
    "ishu India", "ishu CBSE", "ishu class 9", "ishu class 10",
    "ishu class 11", "ishu class 12", "ishu engineering platform",
    "ishu quiz", "ishu quiz battles", "ishu leaderboard", "ishu XP",
    "ishu ka website", "ishu education platform", "ishu study app",
    "ishu online classes", "ishu competitive learning", "ishu board exam",
    "education by ishu", "platform by ishu", "created by ishu",
    "ishu JEE", "ishu NEET", "ishu coding", "ishu programming",
    "best education platform by ishu", "ishu's learning platform",
    "ishu student platform", "ishu gamification education",
    /* ── Platform & Mission ── */
    "India's #1 gamified learning platform", "best education platform India 2025",
    "best education website India", "top learning platform India",
    "free online education India", "gamified learning India",
    "quiz battle platform India", "study and earn XP India",
    "learn and battle India", "XP points education platform",
    "streak learning India", "level up learning India",
    "online study platform India", "India education gamification",
    "competitive learning India", "battle quiz India students",
    "study platform with leaderboard India", "earn XP while studying",
    /* ── CBSE Classes ── */
    "CBSE Class 9", "CBSE Class 10", "CBSE Class 11", "CBSE Class 12",
    "CBSE board exam preparation", "CBSE online study 2025",
    "class 9 study platform", "class 10 study platform",
    "class 11 study platform", "class 12 study platform",
    "class 10 science notes", "class 10 light reflection refraction",
    "class 10 maths", "class 9 science", "class 11 physics",
    "class 12 chemistry", "CBSE chapter-wise study",
    "day-wise study plan India", "CBSE revision platform",
    "class 10 board exam tips", "class 12 board exam tips",
    /* ── Engineering & Coding ── */
    "engineering coding India", "learn coding India free",
    "competitive programming India", "Python learning India",
    "Java learning platform India", "C++ tutorials India",
    "engineering coding roadmap", "30-day coding plan India",
    "programming for students India", "coding battles India",
    "DSA learning platform India", "web development course India",
    /* ── Entrance Exams ── */
    "JEE preparation online", "NEET preparation online",
    "JEE study platform India", "NEET study platform India",
    "JEE Main 2025", "NEET 2025", "entrance exam India online",
    "competitive exam India online", "JEE mock tests free",
    /* ── All 28 Indian States ── */
    "study platform Maharashtra", "study platform Delhi",
    "study platform Uttar Pradesh", "study platform Bihar",
    "study platform Rajasthan", "study platform Madhya Pradesh",
    "study platform Tamil Nadu", "study platform Karnataka",
    "study platform Kerala", "study platform Gujarat",
    "study platform West Bengal", "study platform Andhra Pradesh",
    "study platform Telangana", "study platform Punjab",
    "study platform Haryana", "study platform Odisha",
    "study platform Jharkhand", "study platform Assam",
    "study platform Chhattisgarh", "study platform Uttarakhand",
    "study platform Himachal Pradesh", "study platform Goa",
    "study platform Manipur", "study platform Meghalaya",
    "study platform Nagaland", "study platform Tripura",
    "study platform Jammu Kashmir", "study platform Sikkim",
    "CBSE students India all states", "Hindi medium students online",
    /* ── Features ── */
    "online quiz battles education", "real-time quiz platform India",
    "interactive physics simulations India", "study leaderboard India",
    "global leaderboard students India", "student XP ranking India",
    "flashcards online India", "mind maps study India",
    "mock tests online CBSE free", "chapter-wise tests India",
    "day-wise study plan CBSE", "gamified education streaks",
    /* ── Long-tail Questions ── */
    "best app to study for CBSE board", "gamified study for Indian students",
    "study platform with games India", "learn CBSE with battles",
    "how to rank 1 in class India", "best study website for class 10",
    "best study website for class 12 India", "free CBSE study platform",
    "online learning platform free India students", "study and win prizes India",
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
        url: "/images/learnveda-home-hero.png",
        width: 1200,
        height: 630,
        alt: "LearnVeda — India's Gamified Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: ["/images/learnveda-home-hero.png"],
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
 * RootLayout — the outermost shell of the LearnVeda application.
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
          {/* JSON-LD Schema Block 1: WebSite with SearchAction — enables Google Sitelinks Search Box */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "LearnVeda",
                "alternateName": ["LearnVeda by Ishu", "LearnVeda India", "learnveda.in"],
                "url": SITE_CONFIG.url,
                "description": SITE_CONFIG.description,
                "inLanguage": "en-IN",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_CONFIG.url}/search?q={search_term_string}`
                  },
                  "query-input": "required name=search_term_string"
                }
              })
            }}
          />
          {/* JSON-LD Schema Block 2: EducationalOrganization — tells Google this is a school/edu platform */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "EducationalOrganization",
                "name": "LearnVeda",
                "alternateName": "LearnVeda by Ishu",
                "url": SITE_CONFIG.url,
                "logo": {
                  "@type": "ImageObject",
                  "url": `${SITE_CONFIG.url}/favicons/home.svg`,
                  "caption": "LearnVeda — India's #1 Gamified Learning Platform"
                },
                "description": "LearnVeda by Ishu — India's #1 gamified learning platform for CBSE Class 9–12 and Engineering students. Study, Battle, Level Up.",
                "foundingDate": "2024",
                "founder": {
                  "@type": "Person",
                  "name": "Ishu",
                  "jobTitle": "Founder & Creator of LearnVeda",
                  "description": "Ishu is the creator of LearnVeda, India's #1 gamified education platform for students.",
                  "url": SITE_CONFIG.url,
                  "sameAs": [SITE_CONFIG.url]
                },
                "areaServed": {
                  "@type": "Country",
                  "name": "India"
                },
                "knowsAbout": [
                  "CBSE Class 9", "CBSE Class 10", "CBSE Class 11", "CBSE Class 12",
                  "JEE Preparation", "NEET Preparation", "Engineering Coding",
                  "Gamified Learning", "Quiz Battles", "Student Leaderboard"
                ],
                "audience": {
                  "@type": "EducationalAudience",
                  "educationalRole": "student",
                  "geographicArea": "India"
                }
              })
            }}
          />
          {/* JSON-LD Schema Block 3: Person schema for "Ishu" — makes Ishu searchable on Google */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                "name": "Ishu",
                "jobTitle": "Educator & Founder of LearnVeda",
                "description": "Ishu is the founder and creator of LearnVeda — India's #1 gamified learning platform for CBSE Class 9–12 and Engineering students. Search 'ishu education' or 'ishu LearnVeda' to find this platform.",
                "url": SITE_CONFIG.url,
                "knowsAbout": [
                  "Education Technology", "Gamified Learning", "CBSE Curriculum",
                  "JEE Preparation", "NEET Preparation", "Engineering Education",
                  "Online Learning Platforms", "India Education"
                ],
                "worksFor": {
                  "@type": "EducationalOrganization",
                  "name": "LearnVeda",
                  "url": SITE_CONFIG.url
                },
                "nationality": {
                  "@type": "Country",
                  "name": "India"
                }
              })
            }}
          />
          {/* JSON-LD Schema Block 4: SoftwareApplication — helps rank as an app in Google */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "LearnVeda",
                "operatingSystem": "Web Browser",
                "applicationCategory": "EducationApplication",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "INR"
                },
                "description": "LearnVeda by Ishu — Free gamified learning app for Indian students. CBSE Class 9–12, JEE, NEET, Engineering. Study, Battle, Level Up.",
                "url": SITE_CONFIG.url,
                "inLanguage": "en-IN",
                "audience": {
                  "@type": "EducationalAudience",
                  "educationalRole": "student"
                }
              })
            }}
          />
          {/* JSON-LD Schema Block 5: FAQPage — Google shows this as rich result with Q&A on search page */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is LearnVeda?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "LearnVeda is India's #1 free gamified learning platform created by Ishu, designed for CBSE Class 9-12 and Engineering students. Students study chapter-wise, earn XP, compete in quiz battles, and climb a global leaderboard."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Who created LearnVeda? Who is Ishu?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "LearnVeda was created by Ishu — an Indian educator and tech builder passionate about making education gamified, competitive, and rewarding for every Indian student from Class 9 to Engineering."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is LearnVeda free for Indian students?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! LearnVeda by Ishu is 100% free for all Indian students. CBSE Class 9, 10, 11, 12, Engineering, JEE and NEET preparation — all features including quiz battles, XP, leaderboard, and community are completely free."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Which classes does LearnVeda cover?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "LearnVeda covers CBSE Class 9, Class 10, Class 11 (Science, Commerce, Arts), Class 12 (Science, Commerce, Arts), JEE preparation, NEET preparation, and Engineering coding tracks including C, C++, Java, Python, DSA, and System Design."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How does LearnVeda help students rank #1 in India?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "LearnVeda uses gamification — students earn XP points, build daily study streaks, win real-time quiz battles against peers, and compete on a global leaderboard. This competitive system motivates students from all 28 Indian states to study consistently and rank higher."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "ishu website kya hai? ishu ka platform kaunsa hai?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Ishu ka website LearnVeda.in hai — India ka #1 gamified education platform. Ishu ne yeh platform Indian students ke liye banaya hai. CBSE Class 9-12, JEE, NEET, Engineering sab free mein available hai."
                    }
                  }
                ]
              })
            }}
          />
          {/* JSON-LD Schema Block 6: BreadcrumbList — helps Google show page hierarchy in search results */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "LearnVeda Learning Paths",
                "description": "All learning paths available on LearnVeda by Ishu",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "CBSE Class 9", "url": `${SITE_CONFIG.url}/class-9` },
                  { "@type": "ListItem", "position": 2, "name": "CBSE Class 10 Board Prep", "url": `${SITE_CONFIG.url}/class-10` },
                  { "@type": "ListItem", "position": 3, "name": "CBSE Class 11", "url": `${SITE_CONFIG.url}/class-11` },
                  { "@type": "ListItem", "position": 4, "name": "CBSE Class 12 + JEE/NEET", "url": `${SITE_CONFIG.url}/class-12` },
                  { "@type": "ListItem", "position": 5, "name": "Engineering Coding", "url": `${SITE_CONFIG.url}/engineering` },
                  { "@type": "ListItem", "position": 6, "name": "Quiz Battle Arena", "url": `${SITE_CONFIG.url}/battle` },
                  { "@type": "ListItem", "position": 7, "name": "Global Leaderboard", "url": `${SITE_CONFIG.url}/leaderboard` },
                ]
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
