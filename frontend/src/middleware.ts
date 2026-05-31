/**
 * FILE: middleware.ts
 * LOCATION: src/middleware.ts
 * PURPOSE: Clerk authentication middleware for Next.js App Router.
 *          This file MUST be at src/middleware.ts — Next.js only reads middleware
 *          from this exact path. Placing it anywhere else (e.g. proxy.ts) means
 *          NO middleware runs at all, causing all auth issues.
 *
 * WHAT THIS DOES:
 *   1. If a signed-in user hits /sign-in or /sign-up → redirect to /dashboard
 *      (prevents the sign-in → dashboard → sign-in redirect loop)
 *   2. If an unauthenticated user hits a protected route → Clerk redirects to
 *      /sign-in with a redirect_url param so the user returns to their page after login.
 *
 * PROTECTED ROUTES (require authentication):
 *   /dashboard, /profile, /wallet, /settings, /notifications
 *
 * NOTE: Class pages (class-9, class-10, etc.) are intentionally NOT in protected
 * routes — users can browse content freely. Authentication is required only
 * when submitting answers (handled inline by each chapter component).
 *
 * LAST UPDATED: 2026-05-31
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/* ── Routes that require a signed-in user ──────────────────────────────────── */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/wallet(.*)",
  "/settings(.*)",
  "/notifications(.*)",
]);

/* ── Auth pages — signed-in users should be redirected away from these ─────── */
const isAuthPage = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  /* If already authenticated and visiting sign-in/sign-up, go to dashboard.
   * This prevents the redirect loop: sign-in → dashboard → sign-in → ... */
  if (userId && isAuthPage(request)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  /* Protect dashboard and account-level routes.
   * Clerk's auth.protect() will redirect to /sign-in?redirect_url=<current-path>
   * so after login the user lands back on the page they were trying to access. */
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

/* ── Matcher: run middleware on all routes except static assets ─────────────── */
export const config = {
  matcher: [
    /* Skip Next.js internals and all static files */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    /* Always run for API routes */
    "/(api|trpc)(.*)",
  ],
};
