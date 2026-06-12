/**
 * FILE: LevelUpModal.tsx
 * LOCATION: src/components/gamification/LevelUpModal.tsx
 * PURPOSE: Full-screen celebration modal that appears when the student crosses
 *          a level threshold. It shows:
 *            - Animated confetti burst via react-confetti
 *            - The new level number in large type
 *            - The tier name (e.g. "Apprentice", "Expert")
 *            - A short encouragement message personalised per tier
 *            - A "Continue" button that dismisses the modal
 *          The modal reads from useLevelStore — it auto-shows when
 *          showLevelUpModal is true and auto-dismisses on Continue click.
 * USED BY: Providers.tsx (global shell — one instance, always mounted)
 * DEPENDENCIES: react-confetti, lucide-react, useLevelStore, LevelUpModal.module.css
 * LAST UPDATED: 2026-05-16
 * AUTHOR NOTE: react-confetti requires window.innerWidth/innerHeight which is
 *              only available in the browser, so we read those inside the component.
 */

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Star, Zap, X } from "lucide-react";
import { useLevelStore } from "@/store/levelStore";
import styles from "./LevelUpModal.module.css";

/* Dynamically import react-confetti to avoid SSR errors */
const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

/* ─────────────────────────────────────────────
 * Tier Messages
 * A celebratory message shown at key level milestones.
 * ───────────────────────────────────────────── */

/**
 * Returns a short achievement message based on the new level.
 * Milestone levels (10, 25, 50, 75, 100) get special messages.
 * Regular levels get a generic congratulatory message.
 */
function getLevelUpMessage(level: number): string {
  if (level >= 100) return "You've reached the pinnacle — LEGEND status. An incredible achievement.";
  if (level >= 75)  return "MASTER tier unlocked. You are in the top 1% of all LearnVeda students.";
  if (level >= 50)  return "EXPERT status achieved. The hard work is paying off — keep going!";
  if (level >= 25)  return "SKILLED tier unlocked. Your consistency is building real knowledge.";
  if (level >= 10)  return "APPRENTICE tier achieved. The journey is just getting started — stay consistent!";
  if (level === 5)  return "Excellent momentum! You're building great study habits already.";
  return `Level ${level} reached! Keep solving questions and maintaining your streak.`;
}

/** Returns the tier name for the given level */
function getTierName(level: number): string {
  if (level >= 100) return "Legend";
  if (level >= 75)  return "Master";
  if (level >= 50)  return "Expert";
  if (level >= 25)  return "Skilled";
  if (level >= 10)  return "Apprentice";
  return "Novice";
}

/** Returns the tier gradient colour for the modal accent */
function getTierColor(level: number): string {
  if (level >= 100) return "linear-gradient(135deg, #FBBF24, #F59E0B)";
  if (level >= 75)  return "linear-gradient(135deg, #EA580C, #F97316)";
  if (level >= 50)  return "linear-gradient(135deg, #7C3AED, #A78BFA)";
  if (level >= 25)  return "linear-gradient(135deg, #059669, #34D399)";
  if (level >= 10)  return "linear-gradient(135deg, #2563EB, #0EA5E9)";
  return "linear-gradient(135deg, #6B7280, #9CA3AF)";
}

/* ─────────────────────────────────────────────
 * Component
 * ───────────────────────────────────────────── */

/**
 * LevelUpModal — renders a celebration overlay when a level threshold is crossed.
 *
 * Usage: mount once at the app level inside Providers.tsx.
 * The component auto-shows/hides based on the Zustand levelStore state.
 */
export default function LevelUpModal() {
  const showModal         = useLevelStore((state) => state.showLevelUpModal);
  const newLevel          = useLevelStore((state) => state.newLevel);
  const dismissLevelUpModal = useLevelStore((state) => state.dismissLevelUpModal);

  /* Track window size for confetti — re-read on resize */
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  /* Read window dimensions safely (client-only) */
  useEffect(() => {
    function updateSize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  /* Close modal on Escape key press */
  useEffect(() => {
    if (!showModal) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") dismissLevelUpModal();
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showModal, dismissLevelUpModal]);

  /* Don't render anything when the modal is hidden */
  if (!showModal) return null;

  const tierGradient = getTierColor(newLevel);
  const tierName     = getTierName(newLevel);
  const message      = getLevelUpMessage(newLevel);
  const isLegend     = newLevel >= 100;

  return (
    <>
      {/* Confetti burst — appears above everything */}
      {showModal && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={200}
          recycle={false}
          colors={["#2563EB", "#F59E0B", "#10B981", "#7C3AED", "#F97316", "#EC4899"]}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 9999 }}
        />
      )}

      {/* Modal backdrop */}
      <div
        className={styles.backdrop}
        onClick={dismissLevelUpModal}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={`Level up! You reached Level ${newLevel}`}
      >
        {/* Close button */}
        <button
          className={styles.closeBtn}
          onClick={dismissLevelUpModal}
          aria-label="Dismiss level-up celebration"
        >
          <X size={18} />
        </button>

        {/* Level badge (large) */}
        <div className={styles.levelBadge} style={{ background: tierGradient }}>
          {isLegend ? <Star size={28} /> : <Zap size={28} />}
        </div>

        {/* "LEVEL UP!" heading */}
        <p className={styles.levelUpLabel}>LEVEL UP!</p>

        {/* The new level number */}
        <h2 className={styles.levelNumber}>Level {newLevel}</h2>

        {/* Tier name */}
        <p className={styles.tierName} style={{ background: tierGradient }}>
          {tierName}
        </p>

        {/* Achievement message */}
        <p className={styles.message}>{message}</p>

        {/* XP progress hint */}
        <p className={styles.hint}>
          Keep solving questions to reach Level {newLevel + 1}!
        </p>

        {/* Continue button */}
        <button
          className={styles.continueBtn}
          onClick={dismissLevelUpModal}
          style={{ background: tierGradient }}
        >
          Continue
        </button>
      </div>
    </>
  );
}
