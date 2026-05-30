/**
 * FILE: middleware.ts
 * LOCATION: src/middleware.ts
 * PURPOSE: Next.js middleware using Clerk to protect routes.
 *          Clerk intercepts requests before they reach page/API handlers,
 *          verifying the session JWT and making auth() available downstream.
 *
 *          Protected routes (dashboard, profile, etc.) will redirect
 *          unauthenticated users to the sign-in page automatically.
 *
 * DEPENDENCIES: @clerk/nextjs/server
 * LAST UPDATED: 2026-05-30
 */

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Protect specific routes (like dashboard, profile, etc.)
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/wallet(.*)',
  '/settings(.*)',
  '/notifications(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
