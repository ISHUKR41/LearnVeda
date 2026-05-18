/**
 * FILE: Card.tsx
 * LOCATION: src/components/ui/Card/Card.tsx
 * PURPOSE: Shared reusable card component with variants for content sections,
 *          feature highlights, and interactive cards. Supports header, body,
 *          and footer slots with optional hover effects.
 * USED BY: Dashboard, Features, About, and content pages
 * DEPENDENCIES: React, Card.module.css
 * LAST UPDATED: 2026-05-11
 */

import React from "react";
import styles from "./Card.module.css";

/**
 * Card variant options — controls visual style.
 * - default: Standard card with border and shadow
 * - elevated: Card with stronger shadow for prominence
 * - outlined: Minimal card with only a border
 * - interactive: Card that lifts on hover (for clickable items)
 */
type CardVariant = "default" | "elevated" | "outlined" | "interactive";

/** CardProps — extends standard HTML div attributes with custom card props. */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant — defaults to "default" */
  variant?: CardVariant;
  /** Optional colored accent bar at the top of the card */
  accentColor?: string;
  /** When true, removes all padding (useful for custom content) */
  noPadding?: boolean;
}

/**
 * Card Component
 *
 * A flexible container component for grouping related content.
 * Supports multiple visual variants and an optional colored accent bar.
 *
 * @example
 * <Card variant="interactive" accentColor="linear-gradient(135deg, #3B82F6, #06B6D4)">
 *   <h3>Feature Title</h3>
 *   <p>Feature description text here.</p>
 * </Card>
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", accentColor, noPadding, children, className, style, ...rest }, ref) => {
    const classNames = [
      styles.card,
      styles[variant],
      noPadding ? styles.noPadding : "",
      accentColor ? styles.hasAccent : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={classNames}
        style={{
          ...style,
          /* CSS custom property for the accent bar gradient */
          ...(accentColor ? ({ "--card-accent": accentColor } as React.CSSProperties) : {}),
        }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

/* ==================== CARD SUB-COMPONENTS ==================== */

/** Card header — provides top section with optional bottom border. */
function CardHeader({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${styles.header} ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
}

/** Card body — main content area with default padding. */
function CardBody({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${styles.body} ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
}

/** Card footer — bottom section typically used for actions or metadata. */
function CardFooter({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${styles.footer} ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
}

/* Export the main Card component and its sub-components */
export { Card, CardHeader, CardBody, CardFooter };
export default Card;
