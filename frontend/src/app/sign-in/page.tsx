/**
 * FILE: page.tsx
 * LOCATION: src/app/sign-in/page.tsx
 * PURPOSE: Sign In page — allows existing users to authenticate via the
 *          production-shaped credentials API. Includes client validation,
 *          pending states, and clear error messages.
 * USED BY: Next.js App Router — renders at "/sign-in"
 * DEPENDENCIES: next/navigation, lucide-react, SignIn.module.css
 * LAST UPDATED: 2026-05-11
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Globe, Loader2, Lock, Mail, ShieldCheck, Zap } from "lucide-react";
import { signInSchema } from "@/lib/validation/auth";
import styles from "./SignIn.module.css";

interface AuthApiResponse {
  ok: boolean;
  error?: {
    message: string;
    details?: {
      fieldErrors?: Record<string, string[]>;
    };
  };
}

/**
 * SignInPage Component
 * 
 * A clean, centered authentication form with:
 * - Email + password fields
 * - Forgot password link
 * - Backend API integration with httpOnly session cookies
 * - Link to sign up page
 */
export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Sends the credentials to POST /api/auth/sign-in.
   * The API sets the httpOnly cookie; the client only redirects after success.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});

    const parsed = signInSchema.safeParse({ email, password });

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        email: errors.email?.[0] ?? "",
        password: errors.password?.[0] ?? "",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * API call: POST /api/auth/sign-in
       * Why: verifies credentials on the server and creates a secure session cookie.
       */
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const payload = (await response.json()) as AuthApiResponse;

      if (!response.ok || !payload.ok) {
        setFormError(payload.error?.message ?? "Unable to sign in right now.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.panel} aria-label="Secure login benefits">
          <div className={styles.panelBadge}>
            <ShieldCheck size={16} />
            Secure Student Workspace
          </div>
          <h2 className={styles.panelTitle}>Pick up exactly where you stopped.</h2>
          <p className={styles.panelText}>
            Your streaks, battles, class progress, and coding plans stay connected
            through one protected EduQuest account.
          </p>
          <div className={styles.panelStats}>
            <span>7-day sessions</span>
            <span>Rate-limited auth</span>
            <span>httpOnly cookies</span>
          </div>
        </section>

        <div className={styles.card}>
        {/* Header with logo and title */}
        <div className={styles.header}>
          <div className={styles.logo}>
            <Zap size={24} />
          </div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to continue your learning journey</p>
        </div>

        {/* Sign In Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className={styles.field}>
            <label htmlFor="signin-email" className={styles.label}>Email</label>
            <div className={styles.inputWrap}>
              <Mail size={18} className={styles.inputIcon} aria-hidden="true" />
              <input
                id="signin-email"
                type="email"
                className={`${styles.input} ${styles.inputWithIcon}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "signin-email-error" : undefined}
              />
            </div>
            {fieldErrors.email && (
              <p id="signin-email-error" className={styles.fieldError}>{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className={styles.field}>
            <label htmlFor="signin-password" className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <Lock size={18} className={styles.inputIcon} aria-hidden="true" />
              <input
                id="signin-password"
                type="password"
                className={`${styles.input} ${styles.inputWithIcon}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? "signin-password-error" : undefined}
              />
            </div>
            {fieldErrors.password && (
              <p id="signin-password-error" className={styles.fieldError}>{fieldErrors.password}</p>
            )}
            <Link href="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          {formError && (
            <div className={styles.formError} role="alert">
              <AlertCircle size={16} />
              {formError}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 size={16} className={styles.spinner} /> : <ArrowRight size={16} />}
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className={styles.divider}>or continue with</div>

        {/* Google Sign In */}
        <button className={styles.socialBtn} type="button" disabled title="Google OAuth will connect in the next backend phase">
          <Globe size={18} />
          Google OAuth Coming Soon
        </button>

        {/* Footer — link to Sign Up */}
        <p className={styles.footerText}>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className={styles.footerLink}>Sign up free</Link>
        </p>
        </div>
      </div>
    </div>
  );
}
