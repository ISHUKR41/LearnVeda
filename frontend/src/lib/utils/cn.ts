/**
 * FILE: cn.ts
 * LOCATION: src/lib/utils/cn.ts
 * PURPOSE: Utility function that merges Tailwind CSS classes intelligently.
 *          Combines clsx (conditional class names) with tailwind-merge (resolves conflicts).
 *          Example: cn("px-4 px-8") returns "px-8" instead of both.
 * USED BY: Every component in the application uses this for className props.
 * DEPENDENCIES: clsx, tailwind-merge
 * LAST UPDATED: 2026-05-11
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class names together, resolving Tailwind CSS conflicts.
 * This is the standard way to combine conditional classes in EduQuest.
 *
 * @param inputs - Any number of class name strings, arrays, or objects
 * @returns A single merged class name string with conflicts resolved
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-primary", "px-8")
 * // Returns: "py-2 bg-primary px-8" (px-4 is overridden by px-8)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
