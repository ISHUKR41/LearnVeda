/**
 * FILE: lucide-icon-map.ts
 * LOCATION: src/lib/ui/lucide-icon-map.ts
 * PURPOSE: Maps icon names stored in curriculum records to Lucide React icon
 *          components. This allows DB-driven subjects to keep visual identity
 *          without hardcoding icon imports in every page.
 * USED BY: Class pages and learning plan pages
 * LAST UPDATED: 2026-05-18
 */

import type { LucideIcon } from "lucide-react";
import {
  Atom,
  Beaker,
  BookOpen,
  Brain,
  Briefcase,
  Calculator,
  Clock,
  Code2,
  Dna,
  FlaskConical,
  Globe,
  Landmark,
  Languages,
  Leaf,
  MapPin,
  Monitor,
  Receipt,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

/** Safe icon registry keyed by DB icon names. */
export const CURRICULUM_ICON_MAP: Record<string, LucideIcon> = {
  Atom,
  Beaker,
  BookOpen,
  Brain,
  Briefcase,
  Calculator,
  Clock,
  Code2,
  Dna,
  FlaskConical,
  Globe,
  Landmark,
  Languages,
  Leaf,
  MapPin,
  Monitor,
  Receipt,
  TrendingUp,
  Users,
  Zap,
};

/** Resolves an icon by name and falls back to BookOpen when unknown. */
export function resolveCurriculumIcon(name: string | null | undefined): LucideIcon {
  if (!name) {
    return BookOpen;
  }

  return CURRICULUM_ICON_MAP[name] ?? BookOpen;
}

