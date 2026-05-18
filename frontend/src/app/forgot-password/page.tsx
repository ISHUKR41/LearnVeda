/**
 * FILE: page.tsx
 * LOCATION: src/app/forgot-password/page.tsx
 * PURPOSE: Forgot password page. This page captures a reset email and presents
 *          a production-ready flow placeholder until email delivery is wired.
 * USED BY: /sign-in forgot password link
 * DEPENDENCIES: lucide-react, ForgotPassword.module.css
 * LAST UPDATED: 2026-05-11
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import styles from "./ForgotPassword.module.css";

/** Password reset request screen for users who cannot sign in. */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <Link href="/sign-in" className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
        <div className={styles.iconBox}>
          {submitted ? <CheckCircle2 size={24} /> : <Mail size={24} />}
        </div>
        <h1 className={styles.title}>{submitted ? "Check your inbox" : "Reset your password"}</h1>
        <p className={styles.subtitle}>
          {submitted
            ? "If this email exists, EduQuest will send password reset instructions after email delivery is connected."
            : "Enter your account email and we will prepare a secure reset flow for your account."}
        </p>
        {!submitted && (
          <form className={styles.form} onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
            <label htmlFor="reset-email" className={styles.label}>Email</label>
            <input
              id="reset-email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
            <button className={styles.submitBtn} type="submit">Prepare Reset</button>
          </form>
        )}
      </section>
    </div>
  );
}
