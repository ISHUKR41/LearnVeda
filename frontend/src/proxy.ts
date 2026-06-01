/**
 * FILE: proxy.ts
 * LOCATION: src/proxy.ts
 * PURPOSE: Next.js 16 proxy (formerly middleware) for Clerk authentication.
 *          Protects dashboard, battle, profile, wallet, and settings while
 *          keeping curriculum and subject pages public.
 *
 *   IMPORTANT: Uses auth.protect() from Clerk — NOT manual redirect logic.
 *   Manual redirects caused an infinite loop:
 *     dashboard → 401 → sign-in → (Clerk sees user logged in) → dashboard → loop
 *
 *   Using auth.protect() lets Clerk handle all redirect logic correctly.
 *
 *   Public routes: everything except the explicitly protected list.
 *   Class content pages (/class-9/..., /class-10/...) are intentionally PUBLIC
 *   so students can preview without signing in.
 *
 * LAST UPDATED: 2026-06-01
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/* Routes that REQUIRE an active Clerk session.
 * Everything not listed here is public (chapters, sign-in, home, etc.). */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/wallet(.*)",
  "/settings(.*)",
  "/notifications(.*)",
  "/admin(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  /*
   * auth.protect() handles ALL redirect logic internally:
   *  - Unauthenticated user on protected route → sends to sign-in (with ?redirect_url)
   *  - Authenticated user on any route → lets them through
   *  - Does NOT redirect authenticated users away from sign-in (avoids loop)
   *
   * We deliberately do NOT add any manual redirect for sign-in/sign-up routes.
   * Clerk's <SignIn> and <SignUp> components handle "already signed in" themselves.
   */
  if (isProtectedRoute(request)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT static assets and Next.js internals.
     * Standard Clerk matcher — skips _next, images, fonts, etc.
     */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
