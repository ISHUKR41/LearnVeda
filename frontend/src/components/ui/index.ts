/**
 * FILE: index.ts
 * LOCATION: src/components/ui/index.ts
 * PURPOSE: Barrel export file for all shared UI components.
 *          Provides a single import path for consuming pages.
 * USED BY: Any page or component that needs shared UI elements
 * DEPENDENCIES: Button, Card, Badge, Skeleton
 * LAST UPDATED: 2026-05-11
 *
 * @example
 * import { Button, Card, Badge, Skeleton } from "@/components/ui";
 */

/* Button component — primary, secondary, outline, ghost, danger variants */
export { default as Button } from "./Button/Button";

/* Card component with sub-components — default, elevated, outlined, interactive variants */
export { Card, CardHeader, CardBody, CardFooter } from "./Card/Card";

/* Badge component — status indicators, tags, and labels */
export { default as Badge } from "./Badge/Badge";

/* Skeleton component — loading placeholders for lazy-loaded content */
export { default as Skeleton } from "./Skeleton/Skeleton";

/* ErrorBoundary component — catches rendering crashes for production resilience */
export { default as ErrorBoundary } from "./ErrorBoundary/ErrorBoundary";
