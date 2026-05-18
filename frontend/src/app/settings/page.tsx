/**
 * FILE: page.tsx
 * LOCATION: src/app/settings/page.tsx
 * PURPOSE: Account settings page — lets the authenticated user update their
 *          display name, change their learning track, and manage preferences.
 *          This is a protected page — guests are shown a sign-in prompt.
 *          The page is intentionally minimal for MVP. Full profile editing,
 *          password change, notification preferences, and data export will
 *          be added in subsequent iterations.
 * USED BY: Profile page "Edit Profile" button → /settings
 * DEPENDENCIES: authStore (Zustand), lucide-react, Settings.module.css
 * LAST UPDATED: 2026-05-16
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User, BookOpen, Lock, Bell, Shield, Trash2,
  Save, ArrowLeft, ChevronRight, LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import styles from "./Settings.module.css";

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

/** All learning tracks a user can switch to */
const TRACKS = [
  { value: "class-9",      label: "Class 9",       color: "#2563EB" },
  { value: "class-10",     label: "Class 10",      color: "#0F766E" },
  { value: "class-11",     label: "Class 11",      color: "#7C3AED" },
  { value: "class-12",     label: "Class 12",      color: "#D97706" },
  { value: "engineering",  label: "Engineering",   color: "#059669" },
] as const;

/* ─────────────────────────────────────────────
 * Section Components
 * ───────────────────────────────────────────── */

/** A settings section card with a title and icon */
function SettingsSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.FC<{ size?: number }>;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}><Icon size={18} /></span>
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

/* ─────────────────────────────────────────────
 * Main Component
 * ───────────────────────────────────────────── */

/**
 * SettingsPage — authenticated account settings.
 *
 * Sections:
 * 1. Profile — name, email (read-only), track selection
 * 2. Security — change password (placeholder)
 * 3. Notifications — preference toggles (placeholder)
 * 4. Danger Zone — delete account (placeholder)
 */
export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, clearUser } = useAuthStore();

  /* Local form state — pre-filled from the auth store */
  const [displayName, setDisplayName] = useState(user?.name ?? "");
  const [selectedTrack, setSelectedTrack] = useState(user?.track ?? "class-9");
  const [isSaving, setIsSaving] = useState(false);

  /* ── Guest guard ── */
  if (!isLoading && !isAuthenticated) {
    return (
      <div className={styles.guestWrap}>
        <div className={styles.guestCard}>
          <div className={styles.lockIconWrap}><Lock size={40} /></div>
          <h1 className={styles.guestTitle}>Sign in to access settings</h1>
          <p className={styles.guestText}>Manage your profile, track, and preferences after logging in.</p>
          <Link href="/sign-in?next=/settings" className={styles.signInLink}>
            Sign In
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  /** Handles form submission for profile settings */
  async function handleSaveProfile(event: React.FormEvent) {
    event.preventDefault();

    if (!displayName.trim()) {
      toast.error("Display name cannot be empty.");
      return;
    }

    setIsSaving(true);

    try {
      /*
       * In production this would PATCH /api/users/me with the new name and track.
       * For MVP, we simulate a successful save with a toast notification.
       * The backend endpoint will be added in the next iteration.
       */
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Profile settings saved!");
    } catch {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  /** Signs the user out and redirects to home */
  async function handleSignOut() {
    await fetch("/api/auth/sign-out", { method: "POST" });
    clearUser();
    router.push("/");
    router.refresh();
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── Page Header ── */}
        <div className={styles.pageHeader}>
          <Link href="/profile" className={styles.backLink}>
            <ArrowLeft size={15} />
            Back to Profile
          </Link>
          <div>
            <h1 className={styles.pageTitle}>Account Settings</h1>
            <p className={styles.pageSubtitle}>
              Manage your profile, learning track, and preferences
            </p>
          </div>
        </div>

        {/* ── 1. Profile Settings ── */}
        <SettingsSection title="Profile" icon={User}>
          <form onSubmit={handleSaveProfile} className={styles.form}>

            {/* Display name */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="displayName">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={styles.input}
                placeholder="Your full name"
                maxLength={60}
                required
              />
            </div>

            {/* Email — read-only (tied to account, can't change without verification) */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email Address
                <span className={styles.labelNote}> — cannot be changed</span>
              </label>
              <input
                id="email"
                type="email"
                value={user?.email ?? ""}
                className={`${styles.input} ${styles.inputDisabled}`}
                disabled
                aria-describedby="email-note"
              />
              <p id="email-note" className={styles.fieldNote}>
                Email is linked to your account and cannot be changed. Contact support if needed.
              </p>
            </div>

            {/* Learning track selector */}
            <div className={styles.field}>
              <label className={styles.label}>
                Learning Track
              </label>
              <div className={styles.trackGrid}>
                {TRACKS.map((track) => (
                  <button
                    key={track.value}
                    type="button"
                    className={`${styles.trackOption} ${selectedTrack === track.value ? styles.trackOptionSelected : ""}`}
                    onClick={() => setSelectedTrack(track.value)}
                    style={{ "--track-color": track.color } as React.CSSProperties}
                  >
                    <span className={styles.trackDot} />
                    {track.label}
                  </button>
                ))}
              </div>
              <p className={styles.fieldNote}>
                Changing your track updates your dashboard learning plan and quick actions.
              </p>
            </div>

            {/* Save button */}
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={isSaving}
            >
              {isSaving ? (
                <>Saving…</>
              ) : (
                <>
                  <Save size={15} />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </SettingsSection>

        {/* ── 2. Security ── */}
        <SettingsSection title="Security" icon={Shield}>
          <div className={styles.comingSoon}>
            <Lock size={24} color="var(--color-text-tertiary)" />
            <div>
              <p className={styles.comingSoonTitle}>Password change coming soon</p>
              <p className={styles.comingSoonText}>
                Password management with secure token-based reset will be available in the next update.
              </p>
            </div>
          </div>
        </SettingsSection>

        {/* ── 3. Notifications ── */}
        <SettingsSection title="Notifications" icon={Bell}>
          <div className={styles.comingSoon}>
            <Bell size={24} color="var(--color-text-tertiary)" />
            <div>
              <p className={styles.comingSoonTitle}>Notification preferences coming soon</p>
              <p className={styles.comingSoonText}>
                Streak reminders, battle invites, and event alerts will be configurable here.
              </p>
            </div>
          </div>
        </SettingsSection>

        {/* ── 4. Account Actions ── */}
        <SettingsSection title="Account" icon={BookOpen}>
          <div className={styles.accountActions}>
            {/* Sign out */}
            <button className={styles.signOutBtn} onClick={handleSignOut}>
              <LogOut size={16} />
              Sign Out of EduQuest
            </button>

            {/* Delete account — placeholder */}
            <button
              className={styles.dangerBtn}
              onClick={() => toast.error("Account deletion requires contacting support. Email us at support@eduquest.in")}
            >
              <Trash2 size={16} />
              Delete Account
            </button>
          </div>
        </SettingsSection>

      </div>
    </div>
  );
}
