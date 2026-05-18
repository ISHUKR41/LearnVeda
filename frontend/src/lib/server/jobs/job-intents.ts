/**
 * FILE: job-intents.ts
 * LOCATION: src/lib/server/jobs/job-intents.ts
 * PURPOSE: Shared background job intent contracts. These records make future
 *          notification, certificate, analytics, and battle workers durable
 *          instead of hiding side effects inside route handlers.
 * USED BY: Repository contracts, JSON adapter, PostgreSQL adapter, services
 * DEPENDENCIES: None
 * LAST UPDATED: 2026-05-16
 */

/** Job kind identifies the worker capability needed to process the record. */
export type BackgroundJobKind =
  | "notification.send"
  | "certificate.prepare"
  | "event.registration.sync"
  | "battle.queue.timeout-check";

/** Job status is stored durably so workers can retry failed work safely. */
export type BackgroundJobStatus = "pending" | "processing" | "completed" | "failed";

/** Job payload values stay primitive to avoid storing secrets or large blobs. */
export type BackgroundJobPayloadValue = string | number | boolean | null;

/** Extra worker context. Keep payloads small and safe to log. */
export type BackgroundJobPayload = Record<string, BackgroundJobPayloadValue>;

/** Input accepted by repository adapters when services create background work. */
export interface CreateBackgroundJobInput {
  kind: BackgroundJobKind;
  subjectType: string;
  subjectId: string;
  payload?: BackgroundJobPayload;
  runAfter?: string;
}

/** Durable job intent stored by local and production adapters. */
export interface BackgroundJobIntent extends CreateBackgroundJobInput {
  id: string;
  status: BackgroundJobStatus;
  payload: BackgroundJobPayload;
  attempts: number;
  createdAt: string;
  runAfter: string;
}
