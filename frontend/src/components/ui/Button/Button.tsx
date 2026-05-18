/**
 * FILE: Button.tsx
 * LOCATION: src/components/ui/Button/Button.tsx
 * PURPOSE: Shared reusable button component with multiple style variants
 *          (primary, secondary, outline, ghost, danger) and size options.
 *          Used across all pages for consistent button styling and behavior.
 * USED BY: All pages that need interactive buttons
 * DEPENDENCIES: React, lucide-react (for Loader2 spinner), Button.module.css
 * LAST UPDATED: 2026-05-11
 */

import React from "react";
import { Loader2 } from "lucide-react";
import styles from "./Button.module.css";

/**
 * Button variant options — controls the visual style of the button.
 * - primary: Main action button with gradient background
 * - secondary: Subdued action with muted background
 * - outline: Bordered button with transparent background
 * - ghost: Minimal button with no background or border
 * - danger: Destructive action button (red tones)
 */
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

/**
 * Button size options — controls the padding and font size.
 * - sm: Compact button for tight spaces
 * - md: Default size for most use cases
 * - lg: Large button for prominent CTAs
 */
type ButtonSize = "sm" | "md" | "lg";

/**
 * ButtonProps interface — extends standard HTML button attributes with
 * custom props for variant, size, loading state, and left/right icons.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant — defaults to "primary" */
  variant?: ButtonVariant;
  /** Size of the button — defaults to "md" */
  size?: ButtonSize;
  /** When true, shows a spinner and disables interaction */
  isLoading?: boolean;
  /** Optional icon to show before the button text */
  leftIcon?: React.ReactNode;
  /** Optional icon to show after the button text */
  rightIcon?: React.ReactNode;
  /** When true, button stretches to fill its container width */
  fullWidth?: boolean;
}

/**
 * Button Component
 *
 * A flexible, accessible button component that supports multiple variants,
 * sizes, loading states, and icon positioning. Uses CSS modules for
 * zero-collision styling.
 *
 * @example
 * <Button variant="primary" leftIcon={<Zap size={16} />}>
 *   Start Learning
 * </Button>
 *
 * @example
 * <Button variant="outline" size="sm" isLoading>
 *   Saving...
 * </Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className,
      disabled,
      ...rest
    },
    ref,
  ) => {
    /* Build the CSS class list from variant, size, and state props.
       Each prop maps to a specific CSS module class. */
    const classNames = [
      styles.button,
      styles[variant],
      styles[size],
      fullWidth ? styles.fullWidth : "",
      isLoading ? styles.loading : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...rest}
      >
        {/* Left icon — replaced with spinner during loading state */}
        {isLoading ? (
          <Loader2 size={16} className={styles.spinner} aria-hidden="true" />
        ) : leftIcon ? (
          <span className={styles.iconLeft} aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}

        {/* Button label text */}
        {children && <span className={styles.label}>{children}</span>}

        {/* Right icon — hidden during loading state */}
        {!isLoading && rightIcon && (
          <span className={styles.iconRight} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

/* Display name for React DevTools debugging */
Button.displayName = "Button";

export default Button;
