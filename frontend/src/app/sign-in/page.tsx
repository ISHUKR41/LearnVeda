/**
 * FILE: page.tsx
 * LOCATION: src/app/sign-in/page.tsx
 * PURPOSE: Sign In page using Clerk components. Renders the secure sign-in card.
 * USED BY: Next.js App Router — renders at "/sign-in"
 * DEPENDENCIES: @clerk/nextjs, SignIn.module.css
 * LAST UPDATED: 2026-05-27
 */

import { SignIn } from "@clerk/nextjs";
import { ShieldCheck } from "lucide-react";
import styles from "./SignIn.module.css";

export default function SignInPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        {/* Left benefits panel — preloaded brand features */}
        <section className={styles.panel} aria-label="Secure login benefits">
          <div className={styles.panelBadge}>
            <ShieldCheck size={16} />
            Secure Student Workspace
          </div>

          <div className={styles.panelBody}>
            <h2 className={styles.panelTitle}>Pick up exactly where you stopped.</h2>
            <p className={styles.panelText}>
              Your streaks, battles, class progress, and coding plans stay connected
              through one protected EduQuest account.
            </p>
          </div>

          <div className={styles.panelStats}>
            <span>10k+ Active Users</span>
            <span>Clerk Secured</span>
            <span>Zero-Downtime scaling</span>
          </div>
        </section>

        {/* Clerk Sign-In Component Container */}
        <div className={styles.card} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "500px", padding: 0 }}>
          <SignIn 
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full flex justify-center",
                card: "bg-transparent shadow-none border-0 text-white w-full",
                headerTitle: "text-[#e8e8f0]",
                headerSubtitle: "text-[#a0a0b8]",
                socialButtonsBlockButton: "bg-[#141423] hover:bg-[#1e1e32] border border-[rgba(255,255,255,0.06)] text-[#e8e8f0]",
                formButtonPrimary: "bg-[#7c6aff] hover:opacity-90 text-white",
                footerActionLink: "text-[#7c6aff] hover:underline",
                identityPreviewText: "text-[#e8e8f0]",
                formFieldLabel: "text-[#a0a0b8]",
                formFieldInput: "bg-[#141423] text-white border border-[rgba(255,255,255,0.06)] focus:border-[#7c6aff]",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
