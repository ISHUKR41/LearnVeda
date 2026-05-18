/**
 * FILE: auth.ts
 * LOCATION: src/lib/validation/auth.ts
 * PURPOSE: Zod schemas for authentication requests. The same schemas are used
 *          by client forms for instant feedback and by API routes for trusted
 *          server-side validation.
 * USED BY: sign-in page, sign-up page, auth API route handlers
 * DEPENDENCIES: zod, shared auth types
 * LAST UPDATED: 2026-05-11
 */

import { z } from "zod";
import { LEARNING_TRACKS } from "@/types/auth";

/** Normalizes emails before validation and storage to avoid duplicate accounts. */
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Please enter a valid email address.");

/** Password rule designed for students: secure enough, still understandable. */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Za-z]/, "Password must contain at least one letter.")
  .regex(/[0-9]/, "Password must contain at least one number.");

/** Payload expected by POST /api/auth/sign-in. */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});

/** Payload expected by POST /api/auth/sign-up. */
export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long.")
    .max(80, "Name must be under 80 characters."),
  email: emailSchema,
  password: passwordSchema,
  selectedClass: z.enum(LEARNING_TRACKS, {
    error: "Please select your learning track.",
  }),
  acceptTerms: z.literal(true, {
    error: "Please accept the learning and community rules.",
  }),
});

/** Payload expected by POST /api/battle/matchmaking. */
export const battleMatchmakingSchema = z.object({
  category: z.string().trim().min(2).max(40).default("all"),
});

/** Payload expected by POST /api/community/posts. */
export const communityPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(8, "Title must be at least 8 characters.")
    .max(120, "Title must stay under 120 characters."),
  body: z
    .string()
    .trim()
    .min(20, "Question details must be at least 20 characters.")
    .max(1200, "Question details must stay under 1200 characters."),
  tags: z
    .array(z.string().trim().min(2).max(24))
    .min(1, "Add at least one tag.")
    .max(4, "Use up to four tags."),
});

/** Payload expected by POST /api/events/register. */
export const eventRegistrationSchema = z.object({
  eventId: z.string().trim().min(2).max(80),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type BattleMatchmakingInput = z.infer<typeof battleMatchmakingSchema>;
export type CommunityPostInput = z.infer<typeof communityPostSchema>;
export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;
