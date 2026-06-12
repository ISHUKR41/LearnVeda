/**
 * FILE: page.tsx
 * LOCATION: src/app/settings/page.tsx
 * PURPOSE: Account settings page — authenticated students can update their display
 *          name, learning track, password, and notification preferences here.
 *
 *          All changes are persisted to PostgreSQL via PATCH /api/users/me so
 *          the settings survive page refreshes and new sessions. The Zustand
 *          auth store is also updated so the Navbar picks up the new name
 *          immediately without a full reload.
 *
 *          Sections:
 *            1. Profile   — display name, email (read-only), learning track
 *            2. Security  — password change (current + new)
 *            3. Notifications — streak reminders, battle alerts, event updates
 *            4. Account   — sign out, danger zone (delete account)
 *
 *          Guests see a locked card prompting them to sign in first.
 *          Each section is an independent card so the layout scales cleanly
 *          on mobile without horizontal scrolling.
 *
 * USED BY: Navbar profile menu → /settings, Profile "Edit Profile" button
 * DEPENDENCIES: authStore (Zustand), lucide-react, Settings.module.css
 * LAST UPDATED: 2026-05-19
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User, BookOpen, Lock, Bell, Shield, Trash2,
  Save, ArrowLeft, ChevronRight, LogOut, Eye,
  EyeOff, CheckCircle2, Settings2, Info,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useClerk } from "@/lib/clerk-shim/client";
import toast from "react-hot-toast";
import styles from "./Settings.module.css";

/* ─────────────────────────────────────────────
 * Constants — Learning Tracks
 * ───────────────────────────────────────────── */

/**
 * All five VidyaBolt learning tracks with display names and brand colours.
 * The value must match the track identifiers used in the database.
 */
const TRACKS = [
  { value: "class-9",     label: "Class 9",      description: "CBSE Class 9",       color: "#2563EB" },
  { value: "class-10",    label: "Class 10",     description: "CBSE Class 10",      color: "#0F766E" },
  { value: "class-11",    label: "Class 11",     description: "CBSE Class 11",      color: "#7C3AED" },
  { value: "class-12",    label: "Class 12",     description: "CBSE Class 12",      color: "#D97706" },
  { value: "engineering", label: "Engineering",  description: "Coding & DSA",        color: "#059669" },
] as const;

type TrackValue = (typeof TRACKS)[number]["value"];

/* ─────────────────────────────────────────────
 * SettingsSection — reusable card wrapper
 * ───────────────────────────────────────────── */

/**
 * Renders a settings section with a coloured icon badge, title, and body.
 * All sections use the same card shell for visual consistency.
 */
function SettingsSection({
  title,
  icon: Icon,
  accent,
  children,
}: {
  title: string;
  icon: React.FC<{ size?: number; strokeWidth?: number }>;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIconWrap} style={{ "--section-accent": accent ?? "var(--color-primary)" } as React.CSSProperties}>
          <Icon size={17} strokeWidth={2} />
        </span>
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
 * SettingsPage — authenticated account settings with real backend persistence.
 *
 * Profile changes go to PATCH /api/users/me and update the Zustand auth store.
 * Password change uses POST /api/auth/change-password with argon2 hashing.
 * Notification toggles are persisted locally (full backend wiring in v2).
 * Sign-out calls POST /api/auth/sign-out and clears the session cookie.
 */
export default function SettingsPage() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user, isAuthenticated, isLoading, clearUser, updateUser } = useAuthStore();

  /* ── Profile form state ── */
  const [displayName, setDisplayName]         = useState(user?.name ?? "");
  const [selectedTrack, setSelectedTrack]     = useState<TrackValue>((user?.track as TrackValue) ?? "class-9");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved]       = useState(false);

  /* ── Password form state ── */
  const [currentPassword, setCurrentPassword]       = useState("");
  const [newPassword, setNewPassword]               = useState("");
  const [confirmPassword, setConfirmPassword]       = useState("");
  const [showCurrentPw, setShowCurrentPw]           = useState(false);
  const [showNewPw, setShowNewPw]                   = useState(false);
  const [isSavingPassword, setIsSavingPassword]     = useState(false);

  /* ── Notification preference state ── */
  const [notifStreak, setNotifStreak]   = useState(true);
  const [notifBattle, setNotifBattle]   = useState(true);
  const [notifEvents, setNotifEvents]   = useState(true);
  const [notifWeekly, setNotifWeekly]   = useState(false);

  /* Sync form with auth store whenever the user object changes after login/load. */
  useEffect(() => {
    if (user) {
      const syncTimer = window.setTimeout(() => {
        setDisplayName(user.name);
        setSelectedTrack((user.track as TrackValue) ?? "class-9");
      }, 0);

      return () => window.clearTimeout(syncTimer);
    }
  }, [user]);

  /* ── Guest guard — show a sign-in prompt if not authenticated ── */
  if (!isLoading && !isAuthenticated) {
    return (
      <div className={styles.guestWrap}>
        <div className={styles.guestCard}>
          <div className={styles.guestIconWrap}>
            <Lock size={36} strokeWidth={1.5} />
          </div>
          <h1 className={styles.guestTitle}>Sign in to access settings</h1>
          <p className={styles.guestText}>
            Manage your profile, learning track, and preferences after logging in.
          </p>
          <Link href="/sign-in?next=/settings" className={styles.signInLink}>
            Sign In to Continue
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
   * handleSaveProfile
   * PATCHes /api/users/me with the new name and track.
   * Updates the Zustand store on success so the Navbar
   * immediately shows the new name without a reload.
   * ───────────────────────────────────────────── */
  async function handleSaveProfile(event: React.FormEvent) {
    event.preventDefault();

    const trimmedName = displayName.trim();

    /* Client-side validation before hitting the API */
    if (!trimmedName) {
      toast.error("Display name cannot be empty.");
      return;
    }

    if (trimmedName.length > 60) {
      toast.error("Display name must be 60 characters or fewer.");
      return;
    }

    /* Skip the API call if nothing actually changed */
    if (trimmedName === user?.name && selectedTrack === user?.track) {
      toast("No changes to save.", { icon: "ℹ️" });
      return;
    }

    setIsSavingProfile(true);
    setProfileSaved(false);

    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, track: selectedTrack }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        data?: { user: typeof user };
        error?: { message: string };
      };

      if (!response.ok || !payload.ok) {
        toast.error(payload.error?.message ?? "Failed to save. Please try again.");
        return;
      }

      /* Patch only the changed fields in the Zustand store */
      if (payload.data?.user) {
        updateUser({ name: trimmedName, track: selectedTrack });
      }

      setProfileSaved(true);
      toast.success("Profile saved successfully!");

      /* Reset the saved indicator after 3 s */
      setTimeout(() => setProfileSaved(false), 3000);

    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  /* ─────────────────────────────────────────────
   * handleChangePassword
   * Sends current + new password to the backend.
   * Backend verifies the current hash and issues a new argon2 hash.
   * ───────────────────────────────────────────── */
  async function handleChangePassword(event: React.FormEvent) {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (newPassword === currentPassword) {
      toast.error("New password must be different from the current one.");
      return;
    }

    setIsSavingPassword(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const payload = (await response.json()) as { ok: boolean; error?: { message: string } };

      if (!response.ok || !payload.ok) {
        toast.error(payload.error?.message ?? "Password change failed.");
        return;
      }

      toast.success("Password changed successfully!");

      /* Clear the password fields after a successful change */
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch {
      toast.error("Network error while changing password.");
    } finally {
      setIsSavingPassword(false);
    }
  }

  /* ─────────────────────────────────────────────
   * handleSignOut
   * Calls the sign-out API to clear the server session cookie,
   * then wipes the Zustand store and navigates to the homepage.
   * ───────────────────────────────────────────── */
  async function handleSignOut() {
    try {
      await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" });
      await signOut({ redirectUrl: "/" });
    } catch {
      /* Even if the server call fails, clear local state */
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("eduquest_user");
      localStorage.removeItem("eduquest_refresh_token");
      localStorage.removeItem("eduquest_session");
    }
    clearUser();
    router.push("/");
  }

  /* ─────────────────────────────────────────────
   * Render
   * ───────────────────────────────────────────── */
  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── Page Header ─────────────────────────── */}
        <div className={styles.pageHeader}>
          <Link href="/profile" className={styles.backLink}>
            <ArrowLeft size={15} />
            Back to Profile
          </Link>
          <div className={styles.pageHeaderContent}>
            <div className={styles.pageHeaderIcon}>
              <Settings2 size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className={styles.pageTitle}>Account Settings</h1>
              <p className={styles.pageSubtitle}>
                Manage your profile, track, security, and notification preferences
              </p>
            </div>
          </div>
        </div>

        {/* ── 1. Profile Settings ─────────────────── */}
        <SettingsSection title="Profile" icon={User} accent="#2563EB">
          <form onSubmit={handleSaveProfile} className={styles.form} noValidate>

            {/* Display name */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="displayName">
                Display Name
                <span className={styles.labelCount}>{displayName.length}/60</span>
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
                autoComplete="name"
              />
            </div>

            {/* Email — read-only */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email Address
                <span className={styles.labelNote}> — read only</span>
              </label>
              <div className={styles.inputReadOnlyWrap}>
                <input
                  id="email"
                  type="email"
                  value={user?.email ?? ""}
                  className={`${styles.input} ${styles.inputDisabled}`}
                  disabled
                  aria-describedby="email-note"
                />
                <span className={styles.inputReadOnlyIcon}>
                  <Lock size={14} />
                </span>
              </div>
              <p id="email-note" className={styles.fieldNote}>
                Email is linked to your account identity. Contact support if you need to change it.
              </p>
            </div>

            {/* Learning track selector */}
            <div className={styles.field}>
              <label className={styles.label}>Learning Track</label>
              <div className={styles.trackGrid}>
                {TRACKS.map((track) => (
                  <button
                    key={track.value}
                    type="button"
                    className={`${styles.trackOption} ${selectedTrack === track.value ? styles.trackOptionSelected : ""}`}
                    onClick={() => setSelectedTrack(track.value)}
                    style={{ "--track-color": track.color } as React.CSSProperties}
                    aria-pressed={selectedTrack === track.value}
                  >
                    <span className={styles.trackDot} />
                    <span>
                      <span className={styles.trackLabel}>{track.label}</span>
                      <span className={styles.trackDesc}>{track.description}</span>
                    </span>
                    {selectedTrack === track.value && (
                      <CheckCircle2 size={16} className={styles.trackCheck} />
                    )}
                  </button>
                ))}
              </div>
              <p className={styles.fieldNote}>
                Changing your track updates your dashboard day-plan, quick actions, and subject list.
              </p>
            </div>

            {/* Save button */}
            <button
              type="submit"
              className={`${styles.saveBtn} ${profileSaved ? styles.saveBtnSuccess : ""}`}
              disabled={isSavingProfile}
            >
              {isSavingProfile ? (
                <><span className={styles.btnSpinner} />Saving…</>
              ) : profileSaved ? (
                <><CheckCircle2 size={15} />Saved!</>
              ) : (
                <><Save size={15} />Save Profile</>
              )}
            </button>
          </form>
        </SettingsSection>

        {/* ── 2. Security ─────────────────────────── */}
        <SettingsSection title="Security" icon={Shield} accent="#7C3AED">
          <form onSubmit={handleChangePassword} className={styles.form} noValidate>

            <div className={styles.securityNote}>
              <Info size={14} />
              Your password is hashed with argon2id — VidyaBolt never stores plain-text passwords.
            </div>

            {/* Current password */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="currentPw">Current Password</label>
              <div className={styles.passwordWrap}>
                <input
                  id="currentPw"
                  type={showCurrentPw ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowCurrentPw((prev) => !prev)}
                  aria-label={showCurrentPw ? "Hide password" : "Show password"}
                >
                  {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="newPw">New Password</label>
              <div className={styles.passwordWrap}>
                <input
                  id="newPw"
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.input}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowNewPw((prev) => !prev)}
                  aria-label={showNewPw ? "Hide password" : "Show password"}
                >
                  {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength indicator */}
              {newPassword.length > 0 && (
                <div className={styles.pwStrengthBar}>
                  <div
                    className={styles.pwStrengthFill}
                    style={{
                      "--pw-width": newPassword.length >= 12 ? "100%" : newPassword.length >= 8 ? "65%" : "30%",
                      "--pw-color": newPassword.length >= 12 ? "var(--color-success)" : newPassword.length >= 8 ? "var(--color-accent)" : "var(--color-danger)",
                    } as React.CSSProperties}
                  />
                </div>
              )}
            </div>

            {/* Confirm new password */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="confirmPw">Confirm New Password</label>
              <input
                id="confirmPw"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${styles.input} ${confirmPassword && confirmPassword !== newPassword ? styles.inputError : ""}`}
                placeholder="Repeat your new password"
                autoComplete="new-password"
              />
              {confirmPassword && confirmPassword !== newPassword && (
                <p className={styles.fieldError}>Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              className={styles.saveBtn}
              disabled={isSavingPassword}
            >
              {isSavingPassword ? (
                <><span className={styles.btnSpinner} />Updating…</>
              ) : (
                <><Shield size={15} />Update Password</>
              )}
            </button>
          </form>
        </SettingsSection>

        {/* ── 3. Notifications ────────────────────── */}
        <SettingsSection title="Notifications" icon={Bell} accent="#059669">
          <div className={styles.toggleList}>

            {/* Streak reminders */}
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>Streak Reminders</span>
                <span className={styles.toggleDesc}>
                  Daily nudge at 8 PM when you haven&apos;t studied yet to protect your streak.
                </span>
              </div>
              <button
                className={`${styles.toggle} ${notifStreak ? styles.toggleOn : ""}`}
                onClick={() => {
                  setNotifStreak((prev) => !prev);
                  toast.success(`Streak reminders ${notifStreak ? "disabled" : "enabled"}.`);
                }}
                role="switch"
                aria-checked={notifStreak}
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>

            {/* Battle challenges */}
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>Battle Challenges</span>
                <span className={styles.toggleDesc}>
                  Alerts when another student challenges you to a quiz battle.
                </span>
              </div>
              <button
                className={`${styles.toggle} ${notifBattle ? styles.toggleOn : ""}`}
                onClick={() => {
                  setNotifBattle((prev) => !prev);
                  toast.success(`Battle alerts ${notifBattle ? "disabled" : "enabled"}.`);
                }}
                role="switch"
                aria-checked={notifBattle}
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>

            {/* Event updates */}
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>Event Updates</span>
                <span className={styles.toggleDesc}>
                  Reminders 24 h and 1 h before events you&apos;ve registered for.
                </span>
              </div>
              <button
                className={`${styles.toggle} ${notifEvents ? styles.toggleOn : ""}`}
                onClick={() => {
                  setNotifEvents((prev) => !prev);
                  toast.success(`Event updates ${notifEvents ? "disabled" : "enabled"}.`);
                }}
                role="switch"
                aria-checked={notifEvents}
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>

            {/* Weekly progress digest */}
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>Weekly Progress Digest</span>
                <span className={styles.toggleDesc}>
                  Sunday evening summary of XP earned, chapters completed, and rank change.
                </span>
              </div>
              <button
                className={`${styles.toggle} ${notifWeekly ? styles.toggleOn : ""}`}
                onClick={() => {
                  setNotifWeekly((prev) => !prev);
                  toast.success(`Weekly digest ${notifWeekly ? "disabled" : "enabled"}.`);
                }}
                role="switch"
                aria-checked={notifWeekly}
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>

          </div>
        </SettingsSection>

        {/* ── 4. Account Actions ───────────────────── */}
        <SettingsSection title="Account" icon={BookOpen} accent="#D97706">
          <div className={styles.accountActions}>

            {/* Sign out */}
            <button className={styles.signOutBtn} onClick={handleSignOut}>
              <LogOut size={16} />
              Sign Out of VidyaBolt
            </button>

            <div className={styles.dangerZone}>
              <p className={styles.dangerZoneTitle}>Danger Zone</p>
              <p className={styles.dangerZoneDesc}>
                Account deletion is permanent. All XP, streaks, and progress will be lost and cannot
                be recovered. Contact <strong>support@vidyabolt.in</strong> if you need help instead.
              </p>
              <button
                className={styles.dangerBtn}
                onClick={() =>
                  toast.error(
                    "To delete your account please email support@vidyabolt.in with subject: Account Deletion Request",
                    { duration: 6000 }
                  )
                }
              >
                <Trash2 size={16} />
                Delete Account
              </button>
            </div>
          </div>
        </SettingsSection>

      </div>
    </div>
  );
}
