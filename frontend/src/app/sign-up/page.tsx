/**
 * FILE: page.tsx
 * LOCATION: src/app/sign-up/page.tsx
 * PURPOSE: Sign Up page — production-shaped registration flow with its own
 *          page-specific CSS module, client validation, backend API submission,
 *          class/track selection, and consent capture.
 * USED BY: Next.js App Router — renders at "/sign-up"
 * DEPENDENCIES: next/navigation, lucide-react, SignUp.module.css, auth validation
 * LAST UPDATED: 2026-05-11
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Globe,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";
import { signUpSchema } from "@/lib/validation/auth";
import type { LearningTrack } from "@/types/auth";
import styles from "./SignUp.module.css";

interface AuthApiResponse {
  ok: boolean;
  error?: {
    message: string;
    details?: {
      fieldErrors?: Record<string, string[]>;
    };
  };
}

const TRACK_OPTIONS: Array<{
  value: LearningTrack;
  label: string;
  description: string;
}> = [
  { value: "class-9", label: "Class 9", description: "Foundation subjects" },
  { value: "class-10", label: "Class 10", description: "Board preparation" },
  { value: "class-11", label: "Class 11", description: "Stream learning" },
  { value: "class-12", label: "Class 12", description: "Boards + entrance" },
  { value: "engineering", label: "Engineering", description: "Coding + CS skills" },
];

/**
 * SignUpPage Component
 *
 * Creates a new account through POST /api/auth/sign-up.
 * The API hashes the password, creates the user, and sets the session cookie.
 */
export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedClass, setSelectedClass] = useState<LearningTrack | "">("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Validates form values locally before sending them to the backend API. */
  const validateForm = () => {
    const parsed = signUpSchema.safeParse({
      name,
      email,
      password,
      selectedClass,
      acceptTerms,
    });

    if (parsed.success) {
      setFieldErrors({});
      return parsed.data;
    }

    const errors = parsed.error.flatten().fieldErrors;
    setFieldErrors({
      name: errors.name?.[0] ?? "",
      email: errors.email?.[0] ?? "",
      password: errors.password?.[0] ?? "",
      selectedClass: errors.selectedClass?.[0] ?? "",
      acceptTerms: errors.acceptTerms?.[0] ?? "",
    });
    return null;
  };

  /**
   * API call: POST /api/auth/sign-up
   * Why: account creation must happen on the server so password hashing and
   * session cookie creation never run inside browser JavaScript.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    const validData = validateForm();
    if (!validData) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validData),
      });
      const payload = (await response.json()) as AuthApiResponse;

      if (!response.ok || !payload.ok) {
        setFormError(payload.error?.message ?? "Unable to create account right now.");
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
        <section className={styles.promisePanel} aria-label="EduQuest account benefits">
          <div className={styles.promiseBadge}>
            <GraduationCap size={16} />
            Student-first onboarding
          </div>
          <h2 className={styles.promiseTitle}>One account for classes, coding, battles, and progress.</h2>
          <div className={styles.promiseList}>
            <span><CheckCircle2 size={16} /> Track class chapters</span>
            <span><CheckCircle2 size={16} /> Unlock battle readiness</span>
            <span><CheckCircle2 size={16} /> Keep streaks and XP safe</span>
          </div>
        </section>

        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo}><Zap size={24} /></div>
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>Start your gamified learning journey today</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="signup-name" className={styles.label}>Full Name</label>
              <div className={styles.inputWrap}>
                <User size={18} className={styles.inputIcon} aria-hidden="true" />
                <input
                  id="signup-name"
                  type="text"
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  aria-invalid={Boolean(fieldErrors.name)}
                />
              </div>
              {fieldErrors.name && <p className={styles.fieldError}>{fieldErrors.name}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="signup-email" className={styles.label}>Email</label>
              <div className={styles.inputWrap}>
                <Mail size={18} className={styles.inputIcon} aria-hidden="true" />
                <input
                  id="signup-email"
                  type="email"
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  aria-invalid={Boolean(fieldErrors.email)}
                />
              </div>
              {fieldErrors.email && <p className={styles.fieldError}>{fieldErrors.email}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="signup-password" className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <Lock size={18} className={styles.inputIcon} aria-hidden="true" />
                <input
                  id="signup-password"
                  type="password"
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  aria-invalid={Boolean(fieldErrors.password)}
                />
              </div>
              {fieldErrors.password && <p className={styles.fieldError}>{fieldErrors.password}</p>}
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Your Learning Track</span>
              <div className={styles.trackGrid}>
                {TRACK_OPTIONS.map((track) => (
                  <button
                    key={track.value}
                    type="button"
                    className={`${styles.trackOption} ${selectedClass === track.value ? styles.trackOptionActive : ""}`}
                    onClick={() => setSelectedClass(track.value)}
                    aria-pressed={selectedClass === track.value}
                  >
                    <BookOpen size={16} />
                    <span>
                      <strong>{track.label}</strong>
                      <small>{track.description}</small>
                    </span>
                  </button>
                ))}
              </div>
              {fieldErrors.selectedClass && <p className={styles.fieldError}>{fieldErrors.selectedClass}</p>}
            </div>

            <label className={styles.consentRow}>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <span>
                I agree to safe learning battles, respectful community rules, and EduQuest account terms.
              </span>
            </label>
            {fieldErrors.acceptTerms && <p className={styles.fieldError}>{fieldErrors.acceptTerms}</p>}

            {formError && (
              <div className={styles.formError} role="alert">
                <AlertCircle size={16} />
                {formError}
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={16} className={styles.spinner} /> : <ArrowRight size={16} />}
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className={styles.divider}>or continue with</div>

          <button className={styles.socialBtn} type="button" disabled title="Google OAuth will connect in the next backend phase">
            <Globe size={18} /> Google OAuth Coming Soon
          </button>

          <p className={styles.footerText}>
            Already have an account?{" "}
            <Link href="/sign-in" className={styles.footerLink}>Sign in</Link>
          </p>

          <div className={styles.securityNote}>
            <ShieldCheck size={15} />
            Passwords are hashed on the server before storage.
          </div>
        </div>
      </div>
    </div>
  );
}
