/**
 * FILE: middleware.ts
 * LOCATION: src/middleware.ts
 * PURPOSE: Next.js Edge Middleware for Clerk authentication.
 *          This file runs on EVERY request before the page renders.
 *
 *   CRITICAL FIX: This is the proper Next.js middleware file.
 *   Next.js only recognises "middleware.ts" — NOT "proxy.ts".
 *   Without this file, /dashboard had NO server-side protection, causing:
 *     - Unauthenticated users seeing a blank dashboard then client-redirect to /sign-in
 *     - Clerk's <SignIn> component re-redirecting back to /dashboard
 *     - Infinite redirect loop between /sign-in ↔ /dashboard
 *
 *   HOW THIS FIXES THE LOOP:
 *     1. Unauthenticated user visits /dashboard  → middleware redirects to /sign-in
 *     2. User signs in via Clerk                 → Clerk sends back to /dashboard
 *     3. If user is signed in and visits /sign-in → middleware redirects to /dashboard
 *        (prevents the "already signed in but Clerk loads sign-in page" flicker)
 *
 * AUTHOR: EduQuest Team
 * LAST UPDATED: 2026-06-01
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse }                        from "next/server";

/* ── Routes that require an active Clerk session ───────────────────────────
 * Any path that matches one of these patterns will trigger auth.protect().
 * Class content pages (/class-9/…, /class-10/…) are intentionally PUBLIC
 * so students can preview chapters without an account. */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/wallet(.*)",
  "/settings(.*)",
  "/notifications(.*)",
  "/admin(.*)",
]);

/* ── Auth pages where a signed-in user should NOT stay ─────────────────────
 * If a logged-in user lands on /sign-in or /sign-up we immediately redirect
 * them to /dashboard.  This is the key fix for the redirect loop. */
const isAuthPage = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  /* Read the Clerk session (already computed by the middleware wrapper — no
   * additional round-trip to Clerk servers needed). */
  const { userId } = await auth();

  /* ── Already signed in → send away from auth pages ─────────────────────
   * Without this, Clerk's <SignIn> component would:
   *   1. Detect the existing session client-side
   *   2. Redirect to /dashboard
   *   3. Dashboard API returns 401 (transient JWT propagation delay)
   *   4. Error state shows "Sign In" link → user clicks → back to /sign-in
   *   5. Repeat forever
   *
   * With this guard the round-trip never happens — we redirect at the EDGE
   * before the sign-in page even begins to load. */
  if (userId && isAuthPage(request)) {
    const url = new URL("/dashboard", request.url);
    return NextResponse.redirect(url);
  }

  /* ── Protect authenticated routes ───────────────────────────────────────
   * auth.protect() will:
   *   - Allow the request if userId is present
   *   - Redirect to /sign-in?redirect_url=<current path> if userId is null
   *
   * We rely on Clerk's built-in redirect logic here — no manual NextResponse
   * redirect needed, which prevents double-redirect edge cases. */
  if (isProtectedRoute(request)) {
    await auth.protect();
  }

  /* All other public routes pass through unchanged */
  return NextResponse.next();
});

/* ── Next.js route matcher ──────────────────────────────────────────────────
 * Applies middleware to EVERY path except:
 *   - _next/ (Next.js internal assets, HMR, prefetch)
 *   - Static file extensions (images, fonts, CSS, JS chunks, etc.)
 * Standard Clerk-recommended matcher for App Router projects. */
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
