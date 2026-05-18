/**
 * FILE: audit-log.ts
 * LOCATION: src/lib/server/audit/audit-log.ts
 * PURPOSE: Shared audit log contracts for security, moderation, and critical
 *          product events. Backend services use these types so every adapter
 *          stores the same durable audit shape.
 * USED BY: Repository contracts, JSON adapter, PostgreSQL adapter, services
 * DEPENDENCIES: None
 * LAST UPDATED: 2026-05-16
 */

/** Actor type keeps audit rows readable without requiring a user for every event. */
export type AuditActorType = "anonymous" | "student" | "system";

/** Severity helps operations teams filter normal activity from risky activity. */
export type AuditSeverity = "info" | "warning" | "critical";

/** Supported audit actions are intentionally explicit so dashboards stay reliable. */
export type AuditAction =
  | "auth.sign_up.succeeded"
  | "auth.sign_in.succeeded"
  | "auth.sign_in.failed"
  | "battle.matchmaking.queued"
  | "community.post.created"
  | "event.registration.created"
  | "jobs.intent.created";

/** Metadata values are limited to safe primitives so secrets cannot be nested. */
export type AuditMetadataValue = string | number | boolean | null;

/** Extra audit context. Keep this small and never place private payloads here. */
export type AuditMetadata = Record<string, AuditMetadataValue>;

/** Input accepted by repository adapters when a service records an audit event. */
export interface CreateAuditLogInput {
  action: AuditAction;
  actorId?: string;
  actorType: AuditActorType;
  targetType: string;
  targetId?: string;
  severity: AuditSeverity;
  metadata?: AuditMetadata;
}

/** Durable audit entry returned by local and production storage adapters. */
export interface AuditLogEntry extends CreateAuditLogInput {
  id: string;
  metadata: AuditMetadata;
  createdAt: string;
}
