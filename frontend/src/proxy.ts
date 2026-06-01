/**
 * FILE: proxy.ts
 * LOCATION: src/proxy.ts
 * PURPOSE: Next.js + Clerk request proxy for authentication boundaries.
 *          ONLY account-specific surfaces require a Clerk session.
 *          Class content pages are PUBLIC — auth is handled client-side.
 *          This prevents the sign-in ↔ dashboard redirect loop caused by
 *          Clerk middleware failing to verify sessions behind Replit's proxy.
 * LAST UPDATED: 2026-06-01
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/* Routes that REQUIRE a logged-in account. Everything else is public. */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/wallet(.*)",
  "/settings(.*)",
  "/notifications(.*)",
  "/admin(.*)",
]);

/* Auth pages — signed-in users should not re-visit these */
const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

/* Battle is optional-auth: show UI but require sign-in to queue */
const isBattleRoute = createRouteMatcher(["/battle(.*)"]);

function getSafeRedirectTarget(request: Request): URL {
  const url = new URL(request.url);
  const requested = url.searchParams.get("redirect_url");

  /* Only allow same-origin relative paths — no open-redirect */
  if (requested && requested.startsWith("/") && !requested.startsWith("//")) {
    return new URL(requested, request.url);
  }

  return new URL("/dashboard", request.url);
}

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;
  const { userId } = await auth();
  const isAuthenticated = Boolean(userId);

  /* If authenticated and trying to reach sign-in/sign-up → redirect away */
  if (isAuthenticated && isAuthRoute(request)) {
    return NextResponse.redirect(getSafeRedirectTarget(request));
  }

  /* Protect account routes — unauthenticated users go to sign-in */
  if (isProtectedRoute(request) && !isAuthenticated) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  /* Battle route: let through but we note auth status for client */
  if (isBattleRoute(request) && !isAuthenticated) {
    /* Allow through — the Battle page will show a sign-in prompt client-side */
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT static assets and Next.js internals.
     * This is the standard Clerk matcher pattern.
     */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
