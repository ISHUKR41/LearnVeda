/**
 * FILE: page.tsx
 * LOCATION: src/app/sign-up/[[...sign-up]]/page.tsx
 * PURPOSE: Renders the Clerk SignUp component. 
 *          It acts as the entry point for new users attempting to register an account.
 *          This file utilizes Next.js catch-all routes [[...sign-up]] to let Clerk 
 *          handle all the internal routing for authentication flows (like email verification).
 * USED BY: Next.js App Router for the /sign-up route.
 * DEPENDENCIES: @clerk/nextjs
 * LAST UPDATED: 2026-05-27
 */

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-[var(--background)]">
      {/* 
        Clerk SignUp component automatically handles the UI and logic for registering. 
        It provides secure workflows like OAuth, Email OTP, and password creation.
      */}
      <SignUp />
    </div>
  );
}
