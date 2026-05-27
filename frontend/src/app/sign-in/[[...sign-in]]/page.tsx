/**
 * FILE: page.tsx
 * LOCATION: src/app/sign-in/[[...sign-in]]/page.tsx
 * PURPOSE: Renders the Clerk SignIn component inside a branded EduQuest wrapper.
 *          The catch-all route [[...sign-in]] lets Clerk handle all internal
 *          authentication sub-routes (MFA, forgot password, magic link, etc.)
 *          without any additional Next.js route setup.
 *
 *          Layout:
 *            - `.page` — full-height background with blue gradient tint
 *            - The Clerk component is centred within the page
 *
 * USED BY: Next.js App Router at /sign-in
 * DEPENDENCIES: @clerk/nextjs, SignIn.module.css
 * LAST UPDATED: 2026-05-27
 */

import { SignIn } from "@clerk/nextjs";
import styles from "../SignIn.module.css";

export const metadata = {
  title: "Sign In — EduQuest",
  description: "Sign in to your EduQuest account to continue learning, battling, and earning XP.",
};

export default function SignInPage() {
  return (
    /*
     * `.page` from SignIn.module.css provides:
     *   - min-height: calc(100vh - navbar-height)
     *   - display: grid; place-items: center
     *   - subtle blue gradient from the top
     *   - var(--color-bg-secondary) base background
     */
    <div className={styles.page}>
      {/*
        Clerk SignIn component handles all authentication UI and logic.
        It automatically connects to Clerk via the environment keys.
        Appearance, theming, and redirect URLs are configured in ClerkProvider.
      */}
      <SignIn />
    </div>
  );
}
