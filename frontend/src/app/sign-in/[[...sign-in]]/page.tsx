/**
 * FILE: page.tsx
 * LOCATION: src/app/sign-in/[[...sign-in]]/page.tsx
 * PURPOSE: Renders the Clerk SignIn component. 
 *          It acts as the entry point for users attempting to log into the application.
 *          This file utilizes Next.js catch-all routes [[...sign-in]] to let Clerk 
 *          handle all the internal routing for authentication (like MFA, forgot password, etc).
 * USED BY: Next.js App Router for the /sign-in route.
 * DEPENDENCIES: @clerk/nextjs
 * LAST UPDATED: 2026-05-27
 */

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-[var(--background)]">
      {/* 
        Clerk SignIn component automatically handles the UI and logic for logging in. 
        It connects directly to the Clerk backend configured via the environment variables.
      */}
      <SignIn />
    </div>
  );
}
