/**
 * FILE: auth-service.ts
 * LOCATION: src/lib/server/services/auth-service.ts
 * PURPOSE: Backend authentication orchestration. Route handlers validate the
 *          request shape, then this service coordinates password hashing,
 *          credential verification, safe public-user creation, and audit logs.
 * USED BY: Auth API route handlers
 * DEPENDENCIES: password helpers, repository adapters, validation input types
 * LAST UPDATED: 2026-05-19
 */

import { hashPassword, verifyPassword } from "@/lib/server/auth/password";
import { getPlatformRepository } from "@/lib/server/repositories/get-platform-repository";
import type { SignInInput, SignUpInput } from "@/lib/validation/auth";
import type { PublicUser } from "@/types/auth";

interface AuthAuditContext {
  clientKey?: string;
}

/**
 * Verifies a student's sign-in credentials.
 * Returning null keeps route handlers free to use a generic invalid-credentials
 * message without revealing whether an email exists.
 */
export async function authenticateStudent(
  input: SignInInput,
  auditContext: AuthAuditContext = {},
): Promise<PublicUser | null> {
  const repository = getPlatformRepository();
  const storedUser = await repository.users.findByEmail(input.email);
  const isValidPassword = storedUser
    ? await verifyPassword(input.password, storedUser.passwordHash)
    : false;

  if (!storedUser || !isValidPassword) {
    await repository.audit.create({
      action: "auth.sign_in.failed",
      actorType: "anonymous",
      targetType: "user",
      severity: "warning",
      metadata: {
        emailDomain: input.email.split("@")[1]?.toLowerCase() ?? "unknown",
        clientKey: auditContext.clientKey ?? null,
      },
    });

    return null;
  }

  await repository.audit.create({
    action: "auth.sign_in.succeeded",
    actorId: storedUser.id,
    actorType: "student",
    targetType: "user",
    targetId: storedUser.id,
    severity: "info",
    metadata: {
      track: storedUser.track,
      clientKey: auditContext.clientKey ?? null,
    },
  });

  return repository.users.toPublic(storedUser);
}

/**
 * Creates a new student account after the route has already validated all fields.
 * Password hashing stays here so routes never need to know storage internals.
 */
export async function registerStudentAccount(
  input: SignUpInput,
  auditContext: AuthAuditContext = {},
): Promise<PublicUser> {
  const repository = getPlatformRepository();
  const passwordHash = await hashPassword(input.password);

  const user = await repository.users.create({
    name: input.name,
    email: input.email,
    passwordHash,
    track: input.selectedClass,
  });

  await repository.audit.create({
    action: "auth.sign_up.succeeded",
    actorId: user.id,
    actorType: "student",
    targetType: "user",
    targetId: user.id,
    severity: "info",
    metadata: {
      track: user.track,
      clientKey: auditContext.clientKey ?? null,
    },
  });

  return user;
}
