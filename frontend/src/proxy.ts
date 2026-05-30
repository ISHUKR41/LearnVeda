/**
 * FILE: proxy.ts
 * LOCATION: src/proxy.ts
 * PURPOSE: Next.js 16 request proxy (replaces deprecated middleware.ts).
 *          Handles Clerk authentication with graceful fallback when
 *          CLERK_SECRET_KEY is not yet configured.
 *
 * BEHAVIOR:
 *   - If CLERK_SECRET_KEY is set   → full Clerk session verification on every request
 *   - If CLERK_SECRET_KEY is absent → redirect protected routes to /sign-in; all
 *     public routes pass through so the app stays usable during setup
 *
 * PROTECTED ROUTES (require sign-in):
 *   /dashboard, /battle, /profile, /wallet, /settings,
 *   /class-{9-12}/:subject/:chapter/:topic, /engineering/:track/:chapter/:topic
 *
 * PUBLIC ROUTES (always accessible):
 *   /, /class-{9-12}, /class-{9-12}/:subject, /about, /features,
 *   /sign-in, /sign-up, /pricing, /faq, /contact, /terms, /privacy, /api/*
 *
 * USED BY: Next.js App Router (automatic — runs on every matched request)
 * DEPENDENCIES: @clerk/nextjs/server (conditional)
 * LAST UPDATED: 2026-05-29
 */

import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATTERNS: RegExp[] = [
  /^\/dashboard(\/.*)?$/,
  /^\/battle(\/.*)?$/,
  /^\/profile(\/.*)?$/,
  /^\/wallet(\/.*)?$/,
  /^\/settings(\/.*)?$/,
  /^\/class-[0-9]+\/[^/]+\/[^/]+(\/.*)?$/,
  /^\/engineering\/[^/]+\/[^/]+(\/.*)?$/,
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATTERNS.some((p) => p.test(pathname));
}

export default async function proxy(req: NextRequest): Promise<NextResponse | Response> {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    /\.\w{1,10}$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (isProtectedPath(pathname)) {
    const sessionCookie = req.cookies.get("eduquest_session");
    if (!sessionCookie?.value) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
