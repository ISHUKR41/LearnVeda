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

/* ─────────────────────────────────────────────────────────────────────────
 * Protected-path matcher — pure regex, no Clerk dependency.
 * Used as fallback when CLERK_SECRET_KEY is absent.
 * ───────────────────────────────────────────────────────────────────────── */
const PROTECTED_PATTERNS: RegExp[] = [
  /^\/dashboard(\/.*)?$/,
  /^\/battle(\/.*)?$/,
  /^\/profile(\/.*)?$/,
  /^\/wallet(\/.*)?$/,
  /^\/settings(\/.*)?$/,
  /* Chapter-level content requires sign-in */
  /^\/class-[0-9]+\/[^/]+\/[^/]+(\/.*)?$/,
  /^\/engineering\/[^/]+\/[^/]+(\/.*)?$/,
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATTERNS.some((p) => p.test(pathname));
}

/* ─────────────────────────────────────────────────────────────────────────
 * Main proxy handler
 * ───────────────────────────────────────────────────────────────────────── */
export default async function proxy(req: NextRequest): Promise<NextResponse | Response> {
  const { pathname } = req.nextUrl;

  /* ── Skip Next.js internals and static assets ── */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/__clerk") ||
    /\.\w{1,10}$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  /* ── Clerk not yet configured ─────────────────────────────────────────
   * Allow public pages to render; redirect protected pages to sign-in.
   * The user will see a "Sign in required" page instead of a 500 crash.
   * ──────────────────────────────────────────────────────────────────── */
  if (!process.env.CLERK_SECRET_KEY) {
    if (isProtectedPath(pathname)) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  /* ── Clerk IS configured — run full auth middleware ────────────────────
   * We wrap in try/catch so a bad token doesn't break the entire request.
   * ──────────────────────────────────────────────────────────────────── */
  try {
    const { clerkMiddleware, createRouteMatcher } = await import(
      "@clerk/nextjs/server"
    );

    const isProtectedRoute = createRouteMatcher([
      "/dashboard(.*)",
      "/battle(.*)",
      "/profile(.*)",
      "/wallet(.*)",
      "/settings(.*)",
      /* Full chapter pages require sign-in */
      "/class-9/:subject/:chapter(.*)",
      "/class-10/:subject/:chapter(.*)",
      "/class-11/:subject/:chapter(.*)",
      "/class-12/:subject/:chapter(.*)",
      "/engineering/:track/:chapter(.*)",
    ]);

    const handler = clerkMiddleware(async (auth) => {
      if (isProtectedRoute(req)) {
        await auth.protect();
      }
    });

    const res = await handler(req, undefined as any);
    return res || NextResponse.next();
  } catch (err) {
    /* Auth failed (invalid token, network issue, etc.) */
    const msg = err instanceof Error ? err.message : String(err);
    /* If it's a genuine auth error on a protected page, redirect to sign-in */
    if (isProtectedPath(pathname)) {
      console.warn("[proxy] Clerk auth error on protected route:", msg);
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    /* For public pages, let the request through even if Clerk errors */
    return NextResponse.next();
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 * Matcher — which paths this proxy runs on.
 * Excludes static files and Next.js internals for performance.
 * ───────────────────────────────────────────────────────────────────────── */
export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico, images, fonts, and other static resources
     */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
