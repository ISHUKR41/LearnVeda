/**
 * FILE: proxy.ts
 * LOCATION: src/proxy.ts
 * PURPOSE: Replit's custom Next.js 16 build uses "proxy.ts" (not "middleware.ts")
 *          as the middleware entry point. This file runs on EVERY request at the Edge.
 *
 *   ROOT CAUSE OF AUTH LOOP (now fixed):
 *     Previous versions omitted the "signed-in user on /sign-in" guard.
 *     This caused:
 *       1. User signs in → Clerk sends them to /dashboard
 *       2. Dashboard API returns a transient 401 → error state shown
 *       3. Error state shows "Sign In" link → user clicks → lands on /sign-in
 *       4. Clerk's <SignIn> component detects existing session → redirects to /dashboard
 *       5. Repeat steps 2-4 forever (infinite loop)
 *
 *   THIS FIX:
 *     Step 4 is now short-circuited HERE at the Edge.
 *     If userId exists AND request is to /sign-in or /sign-up, we immediately
 *     307-redirect to /dashboard BEFORE the page even loads, breaking the loop.
 *
 *   CHAPTER PAGES (/class-9/…, /class-10/…) are intentionally PUBLIC —
 *   students can preview chapters without signing in.
 *
 * LAST UPDATED: 2026-06-01
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse }                        from "next/server";

/* ── Protected routes — require an active Clerk session ───────────────────
 * Everything NOT in this list is public (home, about, chapter pages, etc.). */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/wallet(.*)",
  "/settings(.*)",
  "/notifications(.*)",
  "/admin(.*)",
]);

/* ── Auth pages — signed-in users must NOT stay here ─────────────────────
 * If a signed-in user lands on these pages, redirect them to /dashboard.
 * This is the KEY fix that breaks the infinite redirect loop. */
const isAuthPage = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  /* Get the current Clerk session (no extra network round-trip — Clerk
   * computes this from the request JWT synchronously in the Edge runtime). */
  const { userId } = await auth();

  /* ── LOOP-BREAKER: Signed-in user on auth page → send to dashboard ──────
   * Without this guard, a signed-in user who clicks "Sign In" (from an error
   * state) would see a Clerk sign-in form, which then auto-redirects back to
   * /dashboard, which might show another error, which shows the "Sign In"
   * link again — creating a permanent redirect loop.
   *
   * With this guard: the browser receives a 307 to /dashboard immediately,
   * never loading the Clerk UI at all. */
  if (userId && isAuthPage(request)) {
    const url = new URL("/dashboard", request.url);
    return NextResponse.redirect(url);
  }

  /* ── Protect dashboard and related routes ───────────────────────────────
   * auth.protect() handles the redirect automatically:
   *   - Authenticated user → allowed through
   *   - Unauthenticated user → redirect to /sign-in?redirect_url=<current>
   *
   * We rely on Clerk's built-in redirect (NOT a manual NextResponse.redirect)
   * because Clerk properly sets the ?redirect_url param so the user returns
   * to the correct page after signing in. */
  if (isProtectedRoute(request)) {
    await auth.protect();
  }

  /* All public routes pass through unchanged */
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT Next.js internals and static assets.
     * Standard Clerk-recommended matcher for Next.js App Router.
     */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
