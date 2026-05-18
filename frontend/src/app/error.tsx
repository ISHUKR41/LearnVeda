/**
 * FILE: error.tsx
 * LOCATION: src/app/error.tsx
 * PURPOSE: App-level error boundary for unexpected rendering failures. It gives
 *          users a recovery action and keeps production errors from becoming a
 *          blank page.
 * USED BY: Next.js App Router automatically
 * DEPENDENCIES: AppState.module.css, lucide-react
 * LAST UPDATED: 2026-05-11
 */

"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import styles from "./AppState.module.css";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Shows a professional fallback when a route throws during rendering. */
export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <div className={styles.statePage}>
      <div className={styles.stateCard} role="alert">
        <div className={styles.stateIcon}>
          <AlertTriangle size={22} />
        </div>
        <h1 className={styles.stateTitle}>Something went wrong</h1>
        <p className={styles.stateText}>
          The page could not finish loading. You can retry safely without losing your account session.
        </p>
        <div className={styles.stateActions}>
          <button className={styles.stateButton} onClick={reset}>
            <RotateCcw size={16} />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
