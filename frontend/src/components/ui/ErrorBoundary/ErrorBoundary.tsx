/**
 * FILE: ErrorBoundary.tsx
 * LOCATION: src/components/ui/ErrorBoundary/ErrorBoundary.tsx
 * PURPOSE: React Error Boundary component that catches rendering errors in child
 *          components and displays a user-friendly fallback instead of crashing
 *          the entire page. Critical for production stability with 100+ users.
 * USED BY: Layout wrapper, Dashboard, Battle, and other complex pages
 * DEPENDENCIES: React
 * LAST UPDATED: 2026-05-11
 */

"use client";

import React from "react";

/** Props for the ErrorBoundary component */
interface ErrorBoundaryProps {
  /** Child components to protect from render crashes */
  children: React.ReactNode;
  /** Optional custom fallback UI to show when an error occurs */
  fallback?: React.ReactNode;
  /** Optional callback when an error is caught (for error reporting services) */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/** Internal state tracking whether an error has been caught */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 *
 * A React class component that catches JavaScript errors in its child component
 * tree, logs those errors, and displays a fallback UI instead of crashing.
 * This is essential for production resilience — if one widget fails, the rest
 * of the page continues working.
 *
 * @example
 * <ErrorBoundary fallback={<p>Something went wrong.</p>}>
 *   <DashboardWidget />
 * </ErrorBoundary>
 *
 * Note: Error boundaries must be class components — React does not yet support
 * error boundaries in functional components.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Called when a child component throws an error during rendering.
   * Updates state so the next render shows the fallback UI.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * Called after an error has been thrown by a descendant component.
   * Use this for logging to error reporting services (Sentry, etc).
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    /* Log to console in all environments for debugging */
    console.error("[ErrorBoundary] Caught error:", error);
    console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);

    /* Notify parent component if an onError callback was provided */
    this.props.onError?.(error, errorInfo);
  }

  /** Resets the error state so the user can try again */
  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      /* Show custom fallback if provided */
      if (this.props.fallback) {
        return this.props.fallback;
      }

      /* Default fallback — minimal, professional error message */
      return (
        <div
          role="alert"
          style={{
            padding: "2rem",
            textAlign: "center",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "0.75rem",
            margin: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "#991B1B",
              marginBottom: "0.5rem",
            }}
          >
            Something went wrong
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#B91C1C", marginBottom: "1rem" }}>
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: "0.5rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#fff",
              background: "#DC2626",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    /* No error — render children normally */
    return this.props.children;
  }
}

export default ErrorBoundary;
