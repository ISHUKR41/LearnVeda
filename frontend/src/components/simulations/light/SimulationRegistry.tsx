/**
 * FILE: SimulationRegistry.ts
 * LOCATION: frontend/src/components/simulations/light/SimulationRegistry.ts
 * PURPOSE: Central registry mapping simulation IDs (used in topic content files)
 *          to their React component imports. Uses dynamic imports for code splitting
 *          so simulations are only loaded when needed.
 *
 *          USAGE: Import `getSimulationComponent(id)` and render the returned component.
 *
 * HOW IT WORKS:
 *   1. Topic content files reference simulations by string ID (e.g. "light-plane-mirror")
 *   2. TopicStudyClient calls getSimulationComponent(id) to get the lazy component
 *   3. The component is dynamically imported on first render (code splitting)
 *   4. Unknown IDs return null (graceful fallback)
 *
 * USED BY: TopicStudyClient.tsx, DeepResearchChapterClient.tsx
 * LAST UPDATED: 2026-06-08
 */

import dynamic from "next/dynamic";
import React from "react";

/**
 * Type for simulation metadata
 */
export interface SimulationInfo {
  /** Display title for the simulation card */
  title: string;
  /** Short description */
  description: string;
  /** Category for grouping */
  category: "reflection" | "mirrors" | "refraction" | "lenses" | "dispersion" | "eye";
  /** Emoji icon */
  icon: string;
  /** The dynamically imported React component */
  component: React.ComponentType<{ id?: string; title?: string }>;
}

/**
 * Lazy-load helper — wraps next/dynamic with SSR disabled
 * since all simulations use HTML5 Canvas (client-only).
 */
const lazyLoad = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>
) =>
  dynamic(importFn, {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "13px",
          background: "rgba(15, 23, 42, 0.5)",
          borderRadius: "12px",
        }}
      >
        ⏳ Loading simulation...
      </div>
    ),
  });

/* ═══════════════════════════════════════════════════
 * SIMULATION REGISTRY
 * Maps simulation ID → metadata + lazy-loaded component
 * ═══════════════════════════════════════════════════ */

const SIMULATION_REGISTRY: Record<string, SimulationInfo> = {
  /* ─── Reflection ─── */
  "light-plane-mirror": {
    title: "Plane Mirror — Laws of Reflection",
    description: "Drag light source to explore angle of incidence = angle of reflection",
    category: "reflection",
    icon: "🪞",
    component: lazyLoad(() => import("./reflection/PlaneMirrorSim")),
  },
  "light-regular-diffuse": {
    title: "Regular vs Diffuse Reflection",
    description: "Compare smooth surface (specular) and rough surface (diffuse) reflection",
    category: "reflection",
    icon: "✨",
    component: lazyLoad(() => import("./reflection/PlaneMirrorSim")), // Reuse with different config
  },
  "light-lateral-inversion": {
    title: "Lateral Inversion",
    description: "See how text appears reversed in a mirror",
    category: "reflection",
    icon: "🔄",
    component: lazyLoad(() => import("./reflection/PlaneMirrorSim")),
  },
  "light-two-mirrors": {
    title: "Two Mirrors at an Angle",
    description: "Adjust angle between mirrors and count images formed",
    category: "reflection",
    icon: "🔱",
    component: lazyLoad(() => import("./reflection/PlaneMirrorSim")),
  },

  /* ─── Spherical Mirrors ─── */
  "concave-mirror-sim": {
    title: "Concave Mirror — Image Formation",
    description: "Drag object to see image at all 6 positions with principal rays",
    category: "mirrors",
    icon: "🔍",
    component: lazyLoad(() => import("./mirrors/ConcaveMirrorSim")),
  },
  "convex-mirror-sim": {
    title: "Convex Mirror — Always Virtual",
    description: "See why convex mirrors always form virtual, erect, diminished images",
    category: "mirrors",
    icon: "🚗",
    component: lazyLoad(() => import("./mirrors/ConcaveMirrorSim")), // Can be extended
  },
  "mirror-formula-calc": {
    title: "Mirror Formula Calculator",
    description: "Input u and f, compute v with live ray diagram",
    category: "mirrors",
    icon: "🧮",
    component: lazyLoad(() => import("./mirrors/ConcaveMirrorSim")),
  },

  /* ─── Refraction ─── */
  "snells-law-sim": {
    title: "Snell's Law — Refraction",
    description: "Adjust angle and media to verify n₁ sin θ₁ = n₂ sin θ₂",
    category: "refraction",
    icon: "🌊",
    component: lazyLoad(() => import("./refraction/SnellsLawSim")),
  },
  "glass-slab-sim": {
    title: "Glass Slab — Lateral Displacement",
    description: "Light through parallel glass surfaces with lateral shift",
    category: "refraction",
    icon: "🔲",
    component: lazyLoad(() => import("./refraction/SnellsLawSim")),
  },
  "tir-sim": {
    title: "Total Internal Reflection",
    description: "Increase angle until critical angle is reached",
    category: "refraction",
    icon: "⚡",
    component: lazyLoad(() => import("./refraction/SnellsLawSim")),
  },

  /* ─── Lenses ─── */
  "convex-lens-sim": {
    title: "Convex Lens — Image Formation",
    description: "All 6 positions with 3 principal rays",
    category: "lenses",
    icon: "🔬",
    component: lazyLoad(() => import("./lenses/ConvexLensSim")),
  },
  "concave-lens-sim": {
    title: "Concave Lens — Always Virtual",
    description: "Diverging lens: virtual, erect, diminished image",
    category: "lenses",
    icon: "🔎",
    component: lazyLoad(() => import("./lenses/ConvexLensSim")),
  },
  "lens-formula-calc": {
    title: "Lens Formula Calculator",
    description: "1/v - 1/u = 1/f with live visualization",
    category: "lenses",
    icon: "🧮",
    component: lazyLoad(() => import("./lenses/ConvexLensSim")),
  },
  "power-of-lens-sim": {
    title: "Power of Lens (Dioptres)",
    description: "Adjust focal length, see power change",
    category: "lenses",
    icon: "💪",
    component: lazyLoad(() => import("./lenses/ConvexLensSim")),
  },

  /* ─── Dispersion ─── */
  "prism-dispersion-sim": {
    title: "Prism Dispersion — VIBGYOR",
    description: "White light splits into 7 colors through a prism",
    category: "dispersion",
    icon: "🌈",
    component: lazyLoad(() => import("./dispersion/PrismDispersionSim")),
  },
  "rainbow-formation-sim": {
    title: "Rainbow Formation",
    description: "Refraction + TIR + dispersion in water droplets",
    category: "dispersion",
    icon: "🌦️",
    component: lazyLoad(() => import("./dispersion/PrismDispersionSim")),
  },
  "scattering-sim": {
    title: "Scattering of Light",
    description: "Why sky is blue and sunsets are red",
    category: "dispersion",
    icon: "🌅",
    component: lazyLoad(() => import("./dispersion/PrismDispersionSim")),
  },

  /* ─── Human Eye ─── */
  "human-eye-sim": {
    title: "Human Eye — Accommodation",
    description: "See how the eye lens adjusts to focus near and far objects",
    category: "eye",
    icon: "👁️",
    component: lazyLoad(() => import("./eye/HumanEyeSim")),
  },
  "myopia-correction-sim": {
    title: "Myopia (Nearsightedness)",
    description: "Image forms before retina — corrected with concave lens",
    category: "eye",
    icon: "👓",
    component: lazyLoad(() => import("./eye/HumanEyeSim")),
  },
  "hypermetropia-correction-sim": {
    title: "Hypermetropia (Farsightedness)",
    description: "Image forms behind retina — corrected with convex lens",
    category: "eye",
    icon: "🤓",
    component: lazyLoad(() => import("./eye/HumanEyeSim")),
  },

  /* ─── Advanced Engine-Based Simulations ─── */
  "adv-plane-mirror": {
    title: "Advanced: Plane Mirror Reflection",
    description: "Drag light source to explore laws of reflection with angle measurement",
    category: "reflection",
    icon: "🪞",
    component: lazyLoad(() => import("./reflection/PlaneMirrorSim")),
  },
  "adv-concave-mirror": {
    title: "Advanced: Concave Mirror Ray Diagram",
    description: "Drag object to see image at all 6 positions with principal rays",
    category: "mirrors",
    icon: "🔍",
    component: lazyLoad(() => import("./mirrors/ConcaveMirrorSim")),
  },
  "adv-snells-law": {
    title: "Advanced: Snell's Law Interactive",
    description: "Adjust angle and refractive indices to verify n₁ sin θ₁ = n₂ sin θ₂",
    category: "refraction",
    icon: "🌊",
    component: lazyLoad(() => import("./refraction/SnellsLawSim")),
  },
  "adv-convex-lens": {
    title: "Advanced: Convex Lens Ray Tracer",
    description: "Drag object through all 6 positions with live principal rays",
    category: "lenses",
    icon: "🔬",
    component: lazyLoad(() => import("./lenses/ConvexLensSim")),
  },
  "adv-prism-dispersion": {
    title: "Advanced: Prism Dispersion Engine",
    description: "Drag apex angle to fan out VIBGYOR spectrum with wavelength display",
    category: "dispersion",
    icon: "🌈",
    component: lazyLoad(() => import("./dispersion/PrismDispersionSim")),
  },
  "adv-human-eye": {
    title: "Advanced: Human Eye & Vision Defects",
    description: "Interactive eye anatomy with accommodation and defect correction",
    category: "eye",
    icon: "👁️",
    component: lazyLoad(() => import("./eye/HumanEyeSim")),
  },
};

/* ═══════════════════════════════════════════════════
 * PUBLIC API
 * ═══════════════════════════════════════════════════ */

/**
 * Get the simulation component for a given ID.
 * Returns null if the ID is not registered.
 */
export function getSimulationComponent(
  simId: string
): React.ComponentType<{ id?: string; title?: string }> | null {
  const info = SIMULATION_REGISTRY[simId];
  return info ? info.component : null;
}

/**
 * Get metadata for a simulation by ID.
 */
export function getSimulationInfo(simId: string): SimulationInfo | null {
  return SIMULATION_REGISTRY[simId] || null;
}

/**
 * Get all registered simulation IDs.
 */
export function getAllSimulationIds(): string[] {
  return Object.keys(SIMULATION_REGISTRY);
}

/**
 * Get all simulations for a given category.
 */
export function getSimulationsByCategory(
  category: SimulationInfo["category"]
): { id: string; info: SimulationInfo }[] {
  return Object.entries(SIMULATION_REGISTRY)
    .filter(([_, info]) => info.category === category)
    .map(([id, info]) => ({ id, info }));
}

export default SIMULATION_REGISTRY;
