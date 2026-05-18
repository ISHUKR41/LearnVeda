/**
 * FILE: Skeleton.tsx
 * LOCATION: src/components/ui/Skeleton/Skeleton.tsx
 * PURPOSE: Loading skeleton placeholder component for content that is being
 *          dynamically imported or fetched from the server. Used as a fallback
 *          for next/dynamic() and React.Suspense boundaries.
 * USED BY: Dashboard, Battle, Leaderboard (lazy-loaded sections)
 * DEPENDENCIES: React, Skeleton.module.css
 * LAST UPDATED: 2026-05-11
 */

import React from "react";
import styles from "./Skeleton.module.css";

/**
 * Skeleton variant options — controls the shape.
 * - text: Rounded rectangle for text lines
 * - circular: Perfect circle for avatars
 * - rectangular: Sharp-cornered rectangle for images/cards
 */
type SkeletonVariant = "text" | "circular" | "rectangular";

/** SkeletonProps — extends standard div attributes with shape and size props. */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shape variant — defaults to "text" */
  variant?: SkeletonVariant;
  /** Width of the skeleton (CSS value) — defaults to "100%" */
  width?: string | number;
  /** Height of the skeleton (CSS value) — defaults to "1rem" for text */
  height?: string | number;
  /** Number of skeleton lines to render — defaults to 1 */
  lines?: number;
}

/**
 * Skeleton Component
 *
 * A shimmer-animated placeholder that shows where content will appear
 * once loading is complete. Use inside Suspense fallbacks and dynamic()
 * loading functions.
 *
 * @example
 * <Skeleton variant="text" width="60%" />
 * <Skeleton variant="circular" width={48} height={48} />
 * <Skeleton variant="rectangular" height={200} />
 * <Skeleton lines={3} />
 */
const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  width = "100%",
  height,
  lines = 1,
  className,
  style,
  ...rest
}) => {
  /* Calculate the final height based on variant if not explicitly provided */
  const finalHeight = height ?? (variant === "text" ? "1rem" : variant === "circular" ? width : "4rem");

  /* For multiple lines, render a stack of skeleton text elements */
  if (lines > 1 && variant === "text") {
    return (
      <div className={styles.stack} {...rest}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={`${styles.skeleton} ${styles.text} ${className ?? ""}`}
            style={{
              ...style,
              /* Make the last line shorter for a natural appearance */
              width: i === lines - 1 ? "70%" : typeof width === "number" ? `${width}px` : width,
              height: typeof finalHeight === "number" ? `${finalHeight}px` : finalHeight,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${className ?? ""}`}
      style={{
        ...style,
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof finalHeight === "number" ? `${finalHeight}px` : finalHeight,
      }}
      {...rest}
    />
  );
};

export default Skeleton;
