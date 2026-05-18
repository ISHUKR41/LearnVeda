/**
 * FILE: password.ts
 * LOCATION: src/lib/server/auth/password.ts
 * PURPOSE: Backend-only password hashing and verification using Node's scrypt.
 *          This keeps raw passwords out of storage and avoids insecure client
 *          handling. The functions are async because password hashing is CPU
 *          work that should never block the event loop synchronously.
 * USED BY: Sign-up and sign-in API route handlers
 * DEPENDENCIES: node:crypto, node:util
 * LAST UPDATED: 2026-05-11
 */

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

/** Creates a salted password hash in the format salt:hash. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

/** Verifies a password against a stored salt:hash value using constant-time compare. */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const storedKey = Buffer.from(hash, "hex");
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedKey, derivedKey);
}
