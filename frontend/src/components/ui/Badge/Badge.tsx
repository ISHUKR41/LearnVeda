/**
 * FILE: Badge.tsx
 * LOCATION: src/components/ui/Badge/Badge.tsx
 * PURPOSE: Shared reusable badge/pill component for status indicators,
 *          tags, labels, and small metadata displays throughout the platform.
 * USED BY: Dashboard (rank badges), Leaderboard (level tags), Features (tags)
 * DEPENDENCIES: React, Badge.module.css
 * LAST UPDATED: 2026-05-11
 */

import React from "react";
import styles from "./Badge.module.css";

/**
 * Badge variant options — controls the color and style.
 * - default: Neutral gray badge
 * - primary: Brand indigo color
 * - success: Green for positive states
 * - warning: Amber for caution states
 * - danger: Red for error/negative states
 * - info: Blue for informational states
 */
type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info";

/**
 * Badge size options — controls the padding and font size.
 * - sm: Small badge for inline use
 * - md: Default badge size
 * - lg: Large badge for prominent labels
 */
type BadgeSize = "sm" | "md" | "lg";

/** BadgeProps — extends standard span attributes with custom props. */
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant — defaults to "default" */
  variant?: BadgeVariant;
  /** Size of the badge — defaults to "md" */
  size?: BadgeSize;
  /** Optional icon to show before the badge text */
  icon?: React.ReactNode;
  /** When true, shows a small pulsing dot to indicate active/live state */
  dot?: boolean;
}

/**
 * Badge Component
 *
 * A small pill-shaped label for status indicators, tags, and metadata.
 * Supports multiple color variants, sizes, optional icons, and a
 * pulsing dot for active/live states.
 *
 * @example
 * <Badge variant="success" icon={<CheckCircle2 size={12} />}>
 *   Active
 * </Badge>
 *
 * @example
 * <Badge variant="warning" dot>
 *   Live
 * </Badge>
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", size = "md", icon, dot, children, className, ...rest }, ref) => {
    const classNames = [
      styles.badge,
      styles[variant],
      styles[size],
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classNames} {...rest}>
        {/* Pulsing dot indicator for active/live states */}
        {dot && <span className={styles.dot} aria-hidden="true" />}

        {/* Optional icon before the label text */}
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Badge label text */}
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export default Badge;
