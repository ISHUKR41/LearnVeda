/**
 * FILE: middleware.ts
 * LOCATION: src/middleware.ts
 * PURPOSE: Next.js + Clerk middleware for authentication boundaries.
 *          Protects dashboard, battle, profile, wallet, and settings while
 *          keeping curriculum and subject pages public.
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Keep curriculum pages (/class-9, etc.) public so users can browse them without being forced to log in.
const isProtectedRoute = createRouteMatcher([
  "/battle(.*)",
  "/community(.*)",
  "/dashboard(.*)",
  "/profile(.*)",
  "/wallet(.*)",
  "/settings(.*)",
  "/notifications(.*)",
  "/admin(.*)",
]);

const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

function getSafeRedirectTarget(request: Request): URL {
  const url = new URL(request.url);
  const requested = url.searchParams.get("redirect_url");

  if (requested?.startsWith("/") && !requested.startsWith("//")) {
    return new URL(requested, request.url);
  }

  return new URL("/dashboard", request.url);
}

export default clerkMiddleware(async (auth, request) => {
  const { pathname, search } = request.nextUrl;
  const { isAuthenticated } = await auth();

  if (isAuthenticated && isAuthRoute(request)) {
    return NextResponse.redirect(getSafeRedirectTarget(request));
  }

  if (isProtectedRoute(request) && !isAuthenticated) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", `${pathname}${search}`);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
