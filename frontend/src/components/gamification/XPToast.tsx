/**
 * FILE: XPToast.tsx
 * LOCATION: src/components/gamification/XPToast.tsx
 * PURPOSE: Utility function for showing XP-earned toast notifications.
 *          Wraps react-hot-toast with a styled EduQuest XP notification that
 *          shows the XP amount gained (e.g. "+50 XP") with the correct colour.
 *          Call this function anywhere after awarding XP to the student.
 * USED BY: Question pages, battle result screen, chapter completion handler
 * DEPENDENCIES: react-hot-toast
 * LAST UPDATED: 2026-05-16
 */

import toast from "react-hot-toast";

/* ─────────────────────────────────────────────
 * showXPToast — call after awarding XP
 * ───────────────────────────────────────────── */

/**
 * Shows a styled "+X XP" toast notification.
 *
 * @param amount    - Number of XP earned (e.g. 50)
 * @param label     - Optional action label (e.g. "Correct answer!", "Chapter complete!")
 *
 * Usage:
 *   showXPToast(50, "Correct answer!");
 *   showXPToast(200, "Chapter complete!");
 */
export function showXPToast(amount: number, label = "XP earned!") {
  toast.success(`+${amount} XP — ${label}`, {
    duration: 3000,
    style: {
      background: "#EFF6FF",
      color: "#1D4ED8",
      border: "1px solid #BFDBFE",
      fontWeight: 600,
    },
    iconTheme: {
      primary: "#2563EB",
      secondary: "#EFF6FF",
    },
  });
}

/**
 * Shows a styled streak toast notification.
 *
 * @param days - Number of consecutive days
 *
 * Usage:
 *   showStreakToast(7);  // "🔥 7-day streak! Keep going!"
 */
export function showStreakToast(days: number) {
  const message =
    days === 1
      ? "Streak started! Come back tomorrow to build it."
      : `🔥 ${days}-day streak! Keep going!`;

  toast(message, {
    duration: 4000,
    icon: "🔥",
    style: {
      background: "#FFF7ED",
      color: "#C2410C",
      border: "1px solid #FED7AA",
      fontWeight: 600,
    },
  });
}

/**
 * Shows a styled battle result toast.
 *
 * @param won - Whether the student won the battle
 * @param xpGained - XP earned from the battle
 */
export function showBattleResultToast(won: boolean, xpGained: number) {
  if (won) {
    toast.success(`⚔️ Battle won! +${xpGained} XP`, {
      duration: 5000,
      style: {
        background: "#EEF2FF",
        color: "#4338CA",
        border: "1px solid #C7D2FE",
        fontWeight: 700,
        fontSize: "15px",
      },
    });
  } else {
    toast(`Better luck next time! +${xpGained} XP for participating`, {
      duration: 4000,
      icon: "💪",
      style: {
        background: "#F8FAFC",
        color: "#475569",
        border: "1px solid #E2E8F0",
        fontWeight: 600,
      },
    });
  }
}
