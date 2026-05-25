/**
 * FILE: useAntiCheat.ts
 * LOCATION: src/hooks/useAntiCheat.ts
 * PURPOSE: A custom React hook to enforce anti-cheat controls.
 *          Blocks right-click (contextmenu), copy/cut/paste, developer tools key
 *          combinations, and reports focus/blur events to the Socket.io backend.
 * USED BY: src/app/battle/[matchId]/page.tsx
 * DEPENDENCIES: React
 * LAST UPDATED: 2026-05-22
 */

"use client";

import { useEffect } from "react";

interface AntiCheatOptions {
  enabled?: boolean;
  onCheat?: (type: string) => void;
}

/**
 * useAntiCheat Hook
 *
 * Enforces browser-level controls to prevent copying questions, launching developer tools,
 * or switching tabs during a competitive match.
 *
 * @param matchId - The active match ID to report cheats for
 * @param socket - The Socket.io client instance
 * @param options - Custom configuration (enabled flag, custom callbacks)
 */
export function useAntiCheat(
  matchId: string | null,
  socket: any,
  options: AntiCheatOptions = {}
) {
  const { enabled = true, onCheat } = options;

  useEffect(() => {
    if (!enabled || !matchId || typeof window === "undefined") return;

    // 1. Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerCheatWarning("context_menu");
    };

    // 2. Prevent copy, cut, paste
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerCheatWarning("copy_attempt");
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerCheatWarning("cut_attempt");
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerCheatWarning("paste_attempt");
    };

    // 3. Prevent keyboard shortcuts (F12, DevTools, Copy-Paste, View Source, Print)
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const ctrlOrCmd = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      let isCheat = false;
      let cheatType = "";

      // F12 key
      if (e.key === "F12") {
        isCheat = true;
        cheatType = "devtools_f12";
      }
      // Ctrl+Shift+I / J / C / K (DevTools)
      else if (ctrlOrCmd && shift && (key === "i" || key === "j" || key === "c" || key === "k")) {
        isCheat = true;
        cheatType = `devtools_shortcut_${key}`;
      }
      // Ctrl+U (View Source)
      else if (ctrlOrCmd && key === "u") {
        isCheat = true;
        cheatType = "view_source";
      }
      // Ctrl+S (Save Page)
      else if (ctrlOrCmd && key === "s") {
        isCheat = true;
        cheatType = "save_page";
      }
      // Ctrl+P (Print Page)
      else if (ctrlOrCmd && key === "p") {
        isCheat = true;
        cheatType = "print_page";
      }
      // Ctrl+C (Copy)
      else if (ctrlOrCmd && key === "c") {
        isCheat = true;
        cheatType = "copy_shortcut";
      }
      // Ctrl+V (Paste)
      else if (ctrlOrCmd && key === "v") {
        isCheat = true;
        cheatType = "paste_shortcut";
      }
      // Ctrl+X (Cut)
      else if (ctrlOrCmd && key === "x") {
        isCheat = true;
        cheatType = "cut_shortcut";
      }

      if (isCheat) {
        e.preventDefault();
        e.stopPropagation();
        triggerCheatWarning(cheatType);
      }
    };

    // 4. Prevent tab switching or window defocusing (blur)
    const handleBlur = () => {
      triggerCheatWarning("window_blur");
    };

    // Common function to emit alert to socket and run callback
    function triggerCheatWarning(type: string) {
      if (socket && socket.connected) {
        socket.emit("cheat_detected", { matchId, type });
      }
      if (onCheat) {
        onCheat(type);
      }
    }

    // Attach listeners to window and document
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("paste", handlePaste);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleBlur);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("paste", handlePaste);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleBlur);
    };
  }, [enabled, matchId, socket, onCheat]);
}
