/**
 * FILE: page.tsx
 * LOCATION: src/app/sign-up/page.tsx
 * PURPOSE: Sign Up page using Clerk components. Renders the secure sign-up card.
 * USED BY: Next.js App Router — renders at "/sign-up"
 * DEPENDENCIES: @clerk/nextjs, SignUp.module.css
 * LAST UPDATED: 2026-05-27
 */

import { SignUp } from "@clerk/nextjs";
import { GraduationCap, CheckCircle2, ShieldCheck } from "lucide-react";
import styles from "./SignUp.module.css";

export default function SignUpPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        {/* Left benefits panel — preloaded brand features */}
        <section className={styles.promisePanel} aria-label="EduQuest account benefits">
          <div className={styles.promiseBadge}>
            <GraduationCap size={16} />
            Student-first onboarding
          </div>

          <div className={styles.promiseBottom} style={{ marginTop: "2rem" }}>
            <h2 className={styles.promiseTitle}>One account for classes, coding, battles, and progress.</h2>
            <div className={styles.promiseList} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "1rem" }}>
              <span><CheckCircle2 size={15} /> Track chapter progress across all subjects</span>
              <span><CheckCircle2 size={15} /> Unlock battle readiness and matchmaking</span>
              <span><CheckCircle2 size={15} /> Streaks, XP, and rank always saved securely</span>
              <span><CheckCircle2 size={15} /> Compete in BTech and CBSE events</span>
            </div>
          </div>

          <div className={styles.securityNote} style={{ marginTop: "auto", display: "flex", gap: "8px", alignItems: "center", color: "#a0a0b8", fontSize: "0.8rem" }}>
            <ShieldCheck size={15} />
            Secure multi-tenant Clerk encryption.
          </div>
        </section>

        {/* Clerk Sign-Up Component Container */}
        <div className={styles.card} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "500px", padding: 0 }}>
          <SignUp 
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
