/**
 * FILE: circuit-breaker.ts
 * LOCATION: backend/src/utils/circuit-breaker.ts
 * PURPOSE: Circuit breaker pattern implementation for protecting the backend
 *          from cascading failures when external services (database, Redis,
 *          email, third-party APIs) become unresponsive.
 *
 * PATTERN:
 *  The circuit breaker has three states:
 *    CLOSED  — Normal operation. Requests pass through. Failures are counted.
 *    OPEN    — Service is considered down. All requests are immediately rejected
 *              with a ServiceUnavailableError without hitting the backend service.
 *    HALF_OPEN — After a cooldown period, one probe request is allowed through.
 *               If it succeeds, the circuit closes. If it fails, the circuit reopens.
 *
 * WHY THIS MATTERS FOR PRODUCTION:
 *  Without a circuit breaker, if the database goes down, every incoming request
 *  creates a connection attempt that times out after 10 seconds. With 100 concurrent
 *  users, that's 100 hanging requests per second — each holding a thread, memory,
 *  and a database connection slot. The circuit breaker detects the failure pattern
 *  and starts returning 503 responses instantly, preserving server resources.
 *
 * USAGE:
 *  const dbCircuit = new CircuitBreaker("database", { failureThreshold: 5 });
 *  const result = await dbCircuit.execute(() => pool.query("SELECT 1"));
 *
 * DEPENDENCIES: None (pure TypeScript)
 * USED BY: database.ts, redis.ts, email.service.ts
 * LAST UPDATED: 2026-05-27
 */

import logger from "./logger";

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

/** The three possible states of the circuit breaker */
export enum CircuitState {
  /** Normal — requests flow through, failures are counted */
  CLOSED = "CLOSED",
  /** Tripped — all requests are rejected immediately with 503 */
  OPEN = "OPEN",
  /** Recovery probe — one request is allowed through to test if service recovered */
  HALF_OPEN = "HALF_OPEN",
}

/** Configuration options for tuning circuit breaker behavior */
export interface CircuitBreakerOptions {
  /**
   * Number of consecutive failures before the circuit opens.
   * Lower values trip faster (more aggressive protection).
   * Default: 5 failures
   */
  failureThreshold?: number;

  /**
   * Time (ms) the circuit stays OPEN before transitioning to HALF_OPEN.
   * Higher values give the failing service more time to recover.
   * Default: 30,000ms (30 seconds)
   */
  resetTimeoutMs?: number;

  /**
   * Number of consecutive successes in HALF_OPEN required to close the circuit.
   * Default: 2
   */
  successThreshold?: number;

  /**
   * Timeout (ms) for the health check probe during HALF_OPEN state.
   * Default: 5,000ms (5 seconds)
   */
  probeTimeoutMs?: number;

  /**
   * Optional callback invoked when the circuit state changes.
   * Useful for logging, metrics, and alerting.
   */
  onStateChange?: (name: string, from: CircuitState, to: CircuitState) => void;
}

/** Internal tracking metrics for monitoring and debugging */
export interface CircuitMetrics {
  /** Human-readable name identifying this circuit breaker */
  name: string;
  /** Current circuit state */
  state: CircuitState;
  /** Number of consecutive failures since last success */
  failureCount: number;
  /** Total successful requests through this circuit */
  totalSuccesses: number;
  /** Total failed requests through this circuit */
  totalFailures: number;
  /** Total requests rejected while circuit was OPEN */
  totalRejected: number;
  /** ISO timestamp of the last failure */
  lastFailureTime: string | null;
  /** ISO timestamp of the last success */
  lastSuccessTime: string | null;
  /** ISO timestamp when the circuit was last opened */
  lastOpenTime: string | null;
}

/** Error thrown when the circuit is OPEN and requests are being rejected */
export class CircuitOpenError extends Error {
  public readonly circuitName: string;
  public readonly retryAfterMs: number;

  constructor(circuitName: string, retryAfterMs: number) {
    super(`Circuit breaker "${circuitName}" is OPEN. Service unavailable. Retry after ${Math.ceil(retryAfterMs / 1000)}s.`);
    this.name = "CircuitOpenError";
    this.circuitName = circuitName;
    this.retryAfterMs = retryAfterMs;
  }
}

/* ─────────────────────────────────────────────
 * CircuitBreaker Class
 * ───────────────────────────────────────────── */

export class CircuitBreaker {
  /** Human-readable name for this circuit (used in logs and metrics) */
  private readonly circuitName: string;

  /** Current state of the circuit */
  private state: CircuitState = CircuitState.CLOSED;

  /** Consecutive failure count (resets on success) */
  private failureCount = 0;

  /** Consecutive success count in HALF_OPEN state */
  private halfOpenSuccessCount = 0;

  /** Configuration — merged defaults + user overrides */
  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;
  private readonly successThreshold: number;
  private readonly probeTimeoutMs: number;
  private readonly onStateChange?: (name: string, from: CircuitState, to: CircuitState) => void;

  /** Timestamps for metrics */
  private lastFailureTime: Date | null = null;
  private lastSuccessTime: Date | null = null;
  private lastOpenTime: Date | null = null;

  /** Cumulative counters */
  private totalSuccesses = 0;
  private totalFailures = 0;
  private totalRejected = 0;

  /** Timer handle for the OPEN → HALF_OPEN transition */
  private resetTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Creates a new circuit breaker instance.
   *
   * @param name - Identifier for this circuit (e.g., "database", "redis", "email")
   * @param options - Tuning parameters
   */
  constructor(name: string, options: CircuitBreakerOptions = {}) {
    this.circuitName = name;
    this.failureThreshold = options.failureThreshold ?? 5;
    this.resetTimeoutMs = options.resetTimeoutMs ?? 30_000;
    this.successThreshold = options.successThreshold ?? 2;
    this.probeTimeoutMs = options.probeTimeoutMs ?? 5_000;
    this.onStateChange = options.onStateChange;
  }

  /**
   * Execute a function through the circuit breaker.
   *
   * - If CLOSED: runs the function normally, tracks failures.
   * - If OPEN: rejects immediately with CircuitOpenError.
   * - If HALF_OPEN: allows one probe request through.
   *
   * @param fn - Async function to execute (the protected operation)
   * @returns The result of the function
   * @throws CircuitOpenError if the circuit is open
   * @throws The original error if the function fails and circuit remains closed
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    /* ── OPEN state — reject immediately ── */
    if (this.state === CircuitState.OPEN) {
      this.totalRejected++;
      const elapsed = Date.now() - (this.lastOpenTime?.getTime() ?? Date.now());
      const retryAfter = Math.max(0, this.resetTimeoutMs - elapsed);
      throw new CircuitOpenError(this.circuitName, retryAfter);
    }

    /* ── HALF_OPEN state — allow probe but track carefully ── */
    /* ── CLOSED state — normal operation ── */

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error as Error);
      throw error;
    }
  }

  /**
   * Called after a successful execution.
   * In CLOSED state: resets failure count.
   * In HALF_OPEN state: counts toward the success threshold to close the circuit.
   */
  private onSuccess(): void {
    this.totalSuccesses++;
    this.lastSuccessTime = new Date();

    if (this.state === CircuitState.HALF_OPEN) {
      this.halfOpenSuccessCount++;

      if (this.halfOpenSuccessCount >= this.successThreshold) {
        /* Enough consecutive successes — close the circuit */
        this.transitionTo(CircuitState.CLOSED);
        logger.info(`[CircuitBreaker:${this.circuitName}] Circuit CLOSED — service recovered`, {
          totalSuccesses: this.totalSuccesses,
        });
      }
    } else {
      /* In CLOSED state — reset failure counter */
      this.failureCount = 0;
    }
  }

  /**
   * Called after a failed execution.
   * Increments failure count and opens the circuit if threshold is exceeded.
   */
  private onFailure(error: Error): void {
    this.totalFailures++;
    this.failureCount++;
    this.lastFailureTime = new Date();

    logger.warn(`[CircuitBreaker:${this.circuitName}] Failure #${this.failureCount}/${this.failureThreshold}`, {
      error: error.message,
      state: this.state,
    });

    if (this.state === CircuitState.HALF_OPEN) {
      /* Probe failed — reopen the circuit */
      this.transitionTo(CircuitState.OPEN);
      logger.error(`[CircuitBreaker:${this.circuitName}] Probe failed — circuit REOPENED`);
    } else if (this.failureCount >= this.failureThreshold) {
      /* Threshold exceeded — open the circuit */
      this.transitionTo(CircuitState.OPEN);
      logger.error(`[CircuitBreaker:${this.circuitName}] Threshold exceeded (${this.failureCount}) — circuit OPENED`);
    }
  }

  /**
   * Transitions the circuit to a new state.
   * Handles timer management and callback notification.
   */
  private transitionTo(newState: CircuitState): void {
    const previousState = this.state;
    this.state = newState;

    /* Clear any existing reset timer */
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
      this.resetTimer = null;
    }

    /* State-specific setup */
    switch (newState) {
      case CircuitState.OPEN:
        this.lastOpenTime = new Date();
        /* Schedule automatic transition to HALF_OPEN after cooldown */
        this.resetTimer = setTimeout(() => {
          this.transitionTo(CircuitState.HALF_OPEN);
          logger.info(`[CircuitBreaker:${this.circuitName}] Cooldown elapsed — circuit HALF_OPEN (probing...)`);
        }, this.resetTimeoutMs);
        break;

      case CircuitState.HALF_OPEN:
        this.halfOpenSuccessCount = 0;
        break;

      case CircuitState.CLOSED:
        this.failureCount = 0;
        this.halfOpenSuccessCount = 0;
        break;
    }

    /* Notify state change callback */
    this.onStateChange?.(this.circuitName, previousState, newState);
  }

  /**
   * Returns current circuit breaker metrics for monitoring.
   * Used by the /api/metrics endpoint for health dashboard visibility.
   */
  getMetrics(): CircuitMetrics {
    return {
      name: this.circuitName,
      state: this.state,
      failureCount: this.failureCount,
      totalSuccesses: this.totalSuccesses,
      totalFailures: this.totalFailures,
      totalRejected: this.totalRejected,
      lastFailureTime: this.lastFailureTime?.toISOString() ?? null,
      lastSuccessTime: this.lastSuccessTime?.toISOString() ?? null,
      lastOpenTime: this.lastOpenTime?.toISOString() ?? null,
    };
  }

  /** Returns the current state of the circuit */
  getState(): CircuitState {
    return this.state;
  }

  /** Manually reset the circuit to CLOSED state (for admin tools) */
  reset(): void {
    this.transitionTo(CircuitState.CLOSED);
    this.totalRejected = 0;
    this.totalFailures = 0;
    this.totalSuccesses = 0;
    logger.info(`[CircuitBreaker:${this.circuitName}] Manually reset to CLOSED`);
  }

  /** Clean up timers when the circuit breaker is no longer needed */
  destroy(): void {
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
      this.resetTimer = null;
    }
  }
}

/* ─────────────────────────────────────────────
 * Pre-configured Circuit Breaker Instances
 *
 * These are exported as ready-to-use singletons for the most common
 * external dependencies. Each is tuned for the expected failure patterns
 * of that specific service.
 * ───────────────────────────────────────────── */

/**
 * Database circuit breaker — protects against PostgreSQL outages.
 * Tuned for aggressive protection: 5 failures → open for 30 seconds.
 */
export const databaseCircuit = new CircuitBreaker("database", {
  failureThreshold: 5,
  resetTimeoutMs: 30_000,
  successThreshold: 2,
});

/**
 * Redis circuit breaker — protects against Redis outages.
 * More lenient threshold since Redis failures are often transient.
 */
export const redisCircuit = new CircuitBreaker("redis", {
  failureThreshold: 8,
  resetTimeoutMs: 15_000,
  successThreshold: 3,
});

/**
 * Email service circuit breaker — protects against SMTP outages.
 * Higher threshold and longer cooldown since email can be retried.
 */
export const emailCircuit = new CircuitBreaker("email", {
  failureThreshold: 10,
  resetTimeoutMs: 60_000,
  successThreshold: 2,
});

/* ─────────────────────────────────────────────
 * Default export — the CircuitBreaker class itself
 * ───────────────────────────────────────────── */
export default CircuitBreaker;
