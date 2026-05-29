/**
 * FILE: page.tsx
 * LOCATION: src/app/sign-up/[[...sign-up]]/page.tsx
 * PURPOSE: Renders the Clerk SignUp component inside a branded EduQuest wrapper.
 *          The catch-all route [[...sign-up]] lets Clerk handle all internal
 *          registration sub-routes (email verification, OAuth callback, etc.)
 *          without any additional Next.js route setup.
 *
 *          Layout:
 *            - `.page` — full-height background with green gradient tint
 *            - The Clerk component is centred within the page
 *
 * USED BY: Next.js App Router at /sign-up
 * DEPENDENCIES: @clerk/nextjs, SignUp.module.css
 * LAST UPDATED: 2026-05-27
 */

import { SignUp } from "@clerk/nextjs";
import styles from "../SignUp.module.css";

export const metadata = {
  title: "Create Account — EduQuest",
  description: "Join EduQuest free — Class 9–12 CBSE study plans, quiz battles, leaderboards, and more.",
};

export default function SignUpPage() {
  return (
    /*
     * `.page` from SignUp.module.css provides:
     *   - min-height: calc(100vh - navbar-height)
     *   - display: grid; place-items: center
     *   - subtle green gradient from the top
     *   - var(--color-bg-secondary) base background
     */
    <div className={styles.page}>
      {/*
        Clerk SignUp component handles all registration UI and logic.
        It provides secure workflows: OAuth, Email OTP, password creation.
        Appearance, theming, and redirect URLs are configured in ClerkProvider.
      */}
      <SignUp fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard" />
    </div>
  );
}
