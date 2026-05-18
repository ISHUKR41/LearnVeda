/**
 * FILE: auth-service.ts
 * LOCATION: src/lib/server/services/auth-service.ts
 * PURPOSE: Backend authentication orchestration. Route handlers validate the
 *          request shape, then this service coordinates password hashing,
 *          credential verification, and safe public-user creation.
 * USED BY: Auth API route handlers
 * DEPENDENCIES: password helpers, platform store, validation input types
 * LAST UPDATED: 2026-05-12
 */

import { hashPassword, verifyPassword } from "@/lib/server/auth/password";
import { getPlatformRepository } from "@/lib/server/repositories/get-platform-repository";
import type { SignInInput, SignUpInput } from "@/lib/validation/auth";
import type { PublicUser } from "@/types/auth";

/**
 * Verifies a student's sign-in credentials.
 * Returning null keeps route handlers free to use a generic invalid-credentials
 * message without revealing whether an email exists.
 */
export async function authenticateStudent(input: SignInInput): Promise<PublicUser | null> {
  const repository = getPlatformRepository();
  const storedUser = await repository.users.findByEmail(input.email);
  const isValidPassword = storedUser
    ? await verifyPassword(input.password, storedUser.passwordHash)
    : false;

  return storedUser && isValidPassword ? repository.users.toPublic(storedUser) : null;
}

/**
 * Creates a new student account after the route has already validated all fields.
 * Password hashing stays here so routes never need to know storage internals.
 */
export async function registerStudentAccount(input: SignUpInput): Promise<PublicUser> {
  const repository = getPlatformRepository();
  const passwordHash = await hashPassword(input.password);

  return repository.users.create({
    name: input.name,
    email: input.email,
    passwordHash,
    track: input.selectedClass,
  });
}
