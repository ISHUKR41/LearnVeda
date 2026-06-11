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
  /* NEW: Fully interactive draggable reflection lab */
  "reflection-interactive-sim": {
    title: "Laws of Reflection — Live Ray Lab",
    description: "Drag light source anywhere · live ∠i = ∠r · wavefront mode · colour picker · virtual image line",
    category: "reflection",
    icon: "🪞",
    component: lazyLoad(() => import("./reflection/ReflectionInteractiveSim")),
  },
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
    description: "Adjust angle between mirrors and count images: n = 360°/θ − 1",
    category: "reflection",
    icon: "🔱",
    component: lazyLoad(() => import("./reflection/TwoMirrorsSim")),
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
    component: lazyLoad(() => import("./mirrors/ConcaveMirrorSim")),
  },
  "mirror-formula-calc": {
    title: "Mirror Formula Calculator",
    description: "Input u and f, compute v with live ray diagram",
    category: "mirrors",
    icon: "🧮",
    component: lazyLoad(() => import("./mirrors/ConcaveMirrorSim")),
  },
  /* NEW: Full object-image relationship for all 6 positions */
  "mirror-object-image-sim": {
    title: "Mirror Object-Image Lab — All 6 Positions",
    description: "Slide object distance · mirror formula 1/v+1/u=1/f · concave & convex · image property cards",
    category: "mirrors",
    icon: "🔮",
    component: lazyLoad(() => import("./mirrors/MirrorObjectImageSim")),
  },
  /* NEW: Spherical mirror terminology interactive diagram */
  "mirror-terms-diagram": {
    title: "Spherical Mirror — Terminology Diagram",
    description: "Click P, C, F, R, f, Aperture to see definitions and formulas — interactive glossary",
    category: "mirrors",
    icon: "📐",
    component: lazyLoad(() => import("./mirrors/SphericalMirrorTermsSim")),
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
    description: "Light through parallel glass surfaces — emergent ray displaced but parallel",
    category: "refraction",
    icon: "🔲",
    component: lazyLoad(() => import("./refraction/GlassSlabSim")),
  },
  "tir-sim": {
    title: "Total Internal Reflection",
    description: "Increase angle until critical angle is reached",
    category: "refraction",
    icon: "⚡",
    component: lazyLoad(() => import("./refraction/SnellsLawSim")),
  },
  /* NEW: Dedicated Critical Angle / TIR simulation */
  "critical-angle-sim": {
    title: "Critical Angle — TIR Explorer",
    description: "Drag θ past the critical angle to trigger TIR · Glass, Water, Diamond, Optical Fibre",
    category: "refraction",
    icon: "⚡",
    component: lazyLoad(() => import("./refraction/CriticalAngleSim")),
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
  /* NEW: Full ray diagram with 3 principal rays, all positions, convex/concave toggle */
  "lens-ray-diagram-sim": {
    title: "Lens Ray Diagram — 3 Principal Rays",
    description: "Slide object along axis · 3 principal rays drawn live · 1/v−1/u=1/f · convex & concave lenses",
    category: "lenses",
    icon: "🔭",
    component: lazyLoad(() => import("./lenses/LensRayDiagramSim")),
  },
  /* NEW: Dedicated Power of Lens simulation with combination lenses */
  "power-dioptre-sim": {
    title: "Power of Lens — P = 1/f (Dioptres)",
    description: "Adjust f₁ and f₂, see combined power · reading glasses, myopia specs · P = P₁ + P₂",
    category: "lenses",
    icon: "💪",
    component: lazyLoad(() => import("./lenses/PowerOfLensSim")),
  },

  /* NEW: Interactive prism colour lab with VIBGYOR + rainbow mode */
  "prism-color-lab-sim": {
    title: "Prism Dispersion — Interactive Colour Lab",
    description: "Adjust apex angle, refractive index, incidence angle · VIBGYOR splitting · rainbow mode",
    category: "dispersion",
    icon: "🌈",
    component: lazyLoad(() => import("./dispersion/PrismColorLabSim")),
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
    description: "Refraction + TIR + dispersion inside water droplets — VIBGYOR at 40°–42°",
    category: "dispersion",
    icon: "🌦️",
    component: lazyLoad(() => import("./dispersion/RainbowFormationSim")),
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

  /* ─────────────────────────────────────────────────────────────────
   * EXTENDED TOPIC 1 — Reflection & Plane Mirrors
   * Extra simulation IDs referenced in topic-1 content file.
   * Mapped to PlaneMirrorSim which handles multiple modes.
   * ───────────────────────────────────────────────────────────────── */
  "light-min-mirror": {
    title: "Minimum Mirror Height for Full-Body Image",
    description: "Prove that you need only half your height to see yourself fully",
    category: "reflection",
    icon: "📐",
    component: lazyLoad(() => import("./reflection/PlaneMirrorSim")),
  },
  "light-glass-slab-lab": {
    title: "Glass Slab — Lateral Displacement Lab",
    description: "Trace a ray through a glass slab and measure the lateral shift",
    category: "refraction",
    icon: "🔲",
    component: lazyLoad(() => import("./refraction/GlassSlabSim")),
  },

  /* ─────────────────────────────────────────────────────────────────
   * EXTENDED TOPIC 2 — Spherical Mirrors
   * ───────────────────────────────────────────────────────────────── */
  "light-concave-rays": {
    title: "Concave Mirror — Principal Rays",
    description: "Draw the 3 principal rays and find the image position",
    category: "mirrors",
    icon: "🔍",
    component: lazyLoad(() => import("./mirrors/ConcaveMirrorSim")),
  },
  "light-convex-rays": {
    title: "Convex Mirror — Ray Diagram",
    description: "See why convex mirrors always form virtual, diminished images",
    category: "mirrors",
    icon: "🚗",
    component: lazyLoad(() => import("./mirrors/ConcaveMirrorSim")),
  },
  "light-mirror-terms": {
    title: "Spherical Mirror Terminology",
    description: "Interactive diagram: Pole, Centre of Curvature, Focus, Principal Axis",
    category: "mirrors",
    icon: "📚",
    component: lazyLoad(() => import("./mirrors/ConcaveMirrorSim")),
  },
  "light-concave-positions": {
    title: "Concave Mirror — All 6 Object Positions",
    description: "Move the object through all 6 positions and observe image changes",
    category: "mirrors",
    icon: "📍",
    component: lazyLoad(() => import("./mirrors/ConcaveMirrorSim")),
  },
  "light-mirror-uses": {
    title: "Real-Life Applications of Mirrors",
    description: "Headlights, solar furnaces, dentist mirrors, and rear-view mirrors",
    category: "mirrors",
    icon: "🔆",
    component: lazyLoad(() => import("./mirrors/ConcaveMirrorSim")),
  },
  "light-mirror-ray-tracer": {
    title: "Mirror Ray Tracer",
    description: "Drag object and focal length to compute image using mirror formula",
    category: "mirrors",
    icon: "✏️",
    component: lazyLoad(() => import("./mirrors/ConcaveMirrorSim")),
  },

  /* ─────────────────────────────────────────────────────────────────
   * EXTENDED TOPIC 3 — Mirror Formula & Sign Convention
   * ───────────────────────────────────────────────────────────────── */
  "light-sign-convention": {
    title: "New Cartesian Sign Convention",
    description: "Interactive axes showing positive/negative distance conventions",
    category: "mirrors",
    icon: "📏",
    component: lazyLoad(() => import("./mirrors/ConcaveMirrorSim")),
  },
  "light-mirror-formula-calc": {
    title: "Mirror Formula Calculator",
    description: "Enter u and f, compute v with live ray diagram (1/v + 1/u = 1/f)",
    category: "mirrors",
    icon: "🧮",
    component: lazyLoad(() => import("./mirrors/ConcaveMirrorSim")),
  },
  "light-magnification-demo": {
    title: "Magnification Visualiser",
    description: "See how image size compares to object: m = -v/u",
    category: "mirrors",
    icon: "🔭",
    component: lazyLoad(() => import("./mirrors/ConcaveMirrorSim")),
  },
  "light-mirror-ray-builder": {
    title: "Mirror Ray Diagram Builder",
    description: "Step-by-step ray diagram construction for concave and convex mirrors",
    category: "mirrors",
    icon: "🖊️",
    component: lazyLoad(() => import("./mirrors/ConcaveMirrorSim")),
  },

  /* ─────────────────────────────────────────────────────────────────
   * EXTENDED TOPIC 4 — Refraction & Snell's Law
   * ───────────────────────────────────────────────────────────────── */
  "light-refraction-demo": {
    title: "Refraction at a Boundary",
    description: "Watch light bend as it crosses from one medium to another",
    category: "refraction",
    icon: "🌊",
    component: lazyLoad(() => import("./refraction/SnellsLawSim")),
  },
  "light-snells-law": {
    title: "Snell's Law Interactive",
    description: "Adjust angle of incidence and refractive index to verify n₁sinθ₁ = n₂sinθ₂",
    category: "refraction",
    icon: "📐",
    component: lazyLoad(() => import("./refraction/SnellsLawSim")),
  },
  "light-tir": {
    title: "Total Internal Reflection",
    description: "Slowly increase the angle until TIR occurs at the critical angle",
    category: "refraction",
    icon: "⚡",
    component: lazyLoad(() => import("./refraction/SnellsLawSim")),
  },
  "light-optical-fiber": {
    title: "Optical Fibre — Light Bouncing",
    description: "Animated photon bouncing through a bent optical fibre using TIR",
    category: "refraction",
    icon: "💡",
    component: lazyLoad(() => import("./refraction/SnellsLawSim")),
  },
  "light-apparent-depth": {
    title: "Apparent Depth Illusion",
    description: "Why a pool appears shallower than it really is",
    category: "refraction",
    icon: "🏊",
    component: lazyLoad(() => import("./refraction/SnellsLawSim")),
  },
  "light-snell-calculator": {
    title: "Snell's Law Calculator",
    description: "Input n₁, n₂, and θ₁ to compute θ₂ and critical angle",
    category: "refraction",
    icon: "🧮",
    component: lazyLoad(() => import("./refraction/SnellsLawSim")),
  },
  "light-tir-explorer": {
    title: "TIR Critical Angle Explorer",
    description: "Drag refractive index sliders to find the exact critical angle",
    category: "refraction",
    icon: "🔬",
    component: lazyLoad(() => import("./refraction/SnellsLawSim")),
  },

  /* ─────────────────────────────────────────────────────────────────
   * EXTENDED TOPIC 5 — Spherical Lenses
   * ───────────────────────────────────────────────────────────────── */
  "light-convex-lens": {
    title: "Convex Lens — Image Formation",
    description: "Drag object through all 6 positions with principal rays",
    category: "lenses",
    icon: "🔬",
    component: lazyLoad(() => import("./lenses/ConvexLensSim")),
  },
  "light-concave-lens": {
    title: "Concave Lens — Always Virtual",
    description: "Diverging lens: always forms virtual, erect, diminished image",
    category: "lenses",
    icon: "🔎",
    component: lazyLoad(() => import("./lenses/ConvexLensSim")),
  },
  "light-lens-positions": {
    title: "Lens — All 6 Object Positions",
    description: "Move the object and watch image type and position change",
    category: "lenses",
    icon: "📍",
    component: lazyLoad(() => import("./lenses/ConvexLensSim")),
  },
  "light-lens-compare": {
    title: "Convex vs Concave Lens Comparison",
    description: "Side-by-side comparison of converging vs diverging lenses",
    category: "lenses",
    icon: "⚖️",
    component: lazyLoad(() => import("./lenses/ConvexLensSim")),
  },
  "light-lens-ray-tracer": {
    title: "Lens Ray Diagram Tracer",
    description: "Build ray diagrams step-by-step for any lens position",
    category: "lenses",
    icon: "✏️",
    component: lazyLoad(() => import("./lenses/ConvexLensSim")),
  },

  /* ─────────────────────────────────────────────────────────────────
   * EXTENDED TOPIC 6 — Lens Formula & Power
   * ───────────────────────────────────────────────────────────────── */
  "light-lens-formula-calc": {
    title: "Lens Formula Calculator",
    description: "1/v − 1/u = 1/f — enter any two values to find the third",
    category: "lenses",
    icon: "🧮",
    component: lazyLoad(() => import("./lenses/ConvexLensSim")),
  },
  "light-power-lens": {
    title: "Power of a Lens",
    description: "Adjust focal length and see power change in dioptres (P = 1/f)",
    category: "lenses",
    icon: "💪",
    component: lazyLoad(() => import("./lenses/ConvexLensSim")),
  },
  "light-eye-defects": {
    title: "Eye Defects & Lens Correction",
    description: "Myopia, hypermetropia, and presbyopia — causes and corrections",
    category: "eye",
    icon: "👓",
    component: lazyLoad(() => import("./eye/HumanEyeSim")),
  },
  "light-prism-dispersion": {
    title: "Prism Dispersion",
    description: "White light enters a prism and splits into VIBGYOR spectrum",
    category: "dispersion",
    icon: "🌈",
    component: lazyLoad(() => import("./dispersion/PrismDispersionSim")),
  },
  "light-spectrum-prism": {
    title: "Visible Spectrum through Prism",
    description: "Explore wavelengths of each colour in the visible spectrum",
    category: "dispersion",
    icon: "🎨",
    component: lazyLoad(() => import("./dispersion/PrismDispersionSim")),
  },

  /* ─────────────────────────────────────────────────────────────────
   * EXTENDED TOPIC 7 — Total Internal Reflection
   * ───────────────────────────────────────────────────────────────── */
  "light-tir-critical-angle": {
    title: "Critical Angle — TIR Switch",
    description: "Drag angle to watch TIR snap on/off at the critical angle",
    category: "refraction",
    icon: "⚡",
    component: lazyLoad(() => import("./refraction/SnellsLawSim")),
  },
  "light-fiber-optic-path": {
    title: "Optical Fibre — Photon Path",
    description: "Animated photon bouncing through a bent fibre using TIR",
    category: "refraction",
    icon: "🌐",
    component: lazyLoad(() => import("./refraction/SnellsLawSim")),
  },
  "light-mirage-formation": {
    title: "Mirage Formation",
    description: "Hot road causes curved rays that create a virtual mirage",
    category: "refraction",
    icon: "🌡️",
    component: lazyLoad(() => import("./refraction/SnellsLawSim")),
  },
  "light-diamond-sparkle": {
    title: "Diamond Sparkle — Gem TIR",
    description: "TIR inside a diamond creates total sparkle from all facets",
    category: "refraction",
    icon: "💎",
    component: lazyLoad(() => import("./refraction/SnellsLawSim")),
  },
  "light-snell-tir-calc": {
    title: "Snell's Law & TIR Calculator",
    description: "Slide n₁/n₂ to compute critical angle with live diagram",
    category: "refraction",
    icon: "🧮",
    component: lazyLoad(() => import("./refraction/SnellsLawSim")),
  },

  /* ─────────────────────────────────────────────────────────────────
   * EXTENDED TOPIC 8 — Dispersion & Human Eye
   * ───────────────────────────────────────────────────────────────── */
  "light-prism-dispersion-adv": {
    title: "Advanced Prism — VIBGYOR Fan",
    description: "Drag apex angle to fan out the full spectrum with wavelength display",
    category: "dispersion",
    icon: "🌈",
    component: lazyLoad(() => import("./dispersion/PrismDispersionSim")),
  },
  "light-rainbow-droplet": {
    title: "Rainbow — Water Droplet",
    description: "Refraction + TIR + dispersion inside a single water droplet",
    category: "dispersion",
    icon: "🌦️",
    component: lazyLoad(() => import("./dispersion/PrismDispersionSim")),
  },
  "light-rayleigh-sky": {
    title: "Rayleigh Scattering — Blue Sky / Red Sunset",
    description: "Drag the Sun angle to see why sky is blue and sunsets are red",
    category: "dispersion",
    icon: "🌅",
    component: lazyLoad(() => import("./dispersion/PrismDispersionSim")),
  },
  "light-eye-anatomy": {
    title: "Human Eye — Interactive Anatomy",
    description: "Click each part of the eye to learn its function",
    category: "eye",
    icon: "👁️",
    component: lazyLoad(() => import("./eye/HumanEyeSim")),
  },
  "light-vision-defect-fix": {
    title: "Vision Defect Correction",
    description: "Myopia / Hypermetropia — see corrective lens in action",
    category: "eye",
    icon: "🤓",
    component: lazyLoad(() => import("./eye/HumanEyeSim")),
  },

  /* ═══════════════════════════════════════════════════
   * BRAND-NEW PURPOSE-BUILT SIMULATIONS (2026-06-11)
   * Ultra-detailed, fully interactive, original designs
   * ═══════════════════════════════════════════════════ */

  /* ── Wave Nature of Light ── */
  "wave-nature-light-sim": {
    title: "Wave Nature of Light — E & B Field Animation",
    description: "Drag frequency slider to see wavelength change · E-field & B-field oscillate · c = fλ live formula · colour shifts across VIBGYOR spectrum",
    category: "reflection",
    icon: "🌊",
    component: lazyLoad(() => import("./reflection/WaveNatureLightSim")),
  },

  /* ── Mirror Formula Interactive Lab ── */
  "mirror-formula-lab-sim": {
    title: "Mirror Formula Lab — Live Ray Diagram",
    description: "Slide u and f · 1/v + 1/u = 1/f solved instantly · real ray diagram drawn · concave & convex toggle · image nature panel",
    category: "mirrors",
    icon: "🧮",
    component: lazyLoad(() => import("./mirrors/MirrorFormulaLabSim")),
  },

  /* ── Human Eye Anatomy (Detailed) ── */
  "eye-anatomy-detailed-sim": {
    title: "Human Eye — Interactive Anatomy",
    description: "Click cornea, iris, lens, retina, fovea, blind spot, optic nerve · exam notes per part · Normal / Myopia / Hypermetropia vision modes",
    category: "eye",
    icon: "👁️",
    component: lazyLoad(() => import("./eye/EyeAnatomyDetailedSim")),
  },

  /* ── Apparent Depth / Refraction Illusion ── */
  "apparent-depth-sim": {
    title: "Apparent Depth — Refraction Illusion",
    description: "Coin at bottom of water appears shallower · n = Real/Apparent Depth · drag observer · switch Water/Glass/Diamond/Ice",
    category: "refraction",
    icon: "🏊",
    component: lazyLoad(() => import("./refraction/ApparentDepthSim")),
  },

  /* ── Advanced Prism Dispersion with Cauchy equation ── */
  "prism-advanced-sim": {
    title: "Prism Dispersion — VIBGYOR with Cauchy Equation",
    description: "Adjust apex angle & incidence · all 7 VIBGYOR rays with real n values · deviation δ per colour · Crown/Flint/Dense glass types",
    category: "dispersion",
    icon: "🌈",
    component: lazyLoad(() => import("./dispersion/PrismAdvancedSim")),
  },

  /* ═══════════════════════════════════════════════════
   * NEW SIMULATIONS — June 2026 Mega-Enhancement
   * All-new components, not reusing existing ones
   * ═══════════════════════════════════════════════════ */

  /* ── Optical Fibre TIR — dedicated animated component ── */
  "optical-fibre-tir-sim": {
    title: "Optical Fibre — Animated TIR Simulation",
    description: "Photons bounce inside a bent fibre via TIR · bend angle slider · Glass/Plastic/Diamond fibre · critical angle live display",
    category: "refraction",
    icon: "🔆",
    component: lazyLoad(() => import("./tir/OpticalFibreTIRSim")),
  },

  /* ── Rayleigh Scattering — Blue Sky & Red Sunset ── */
  "scattering-blue-sky-sim": {
    title: "Rayleigh Scattering — Blue Sky & Red Sunset",
    description: "Time-of-day slider · scatter particles · blue vs red transmission bars · path length visualiser · sky colour perception badge",
    category: "dispersion",
    icon: "🌅",
    component: lazyLoad(() => import("./dispersion/ScatteringBlueSkySimNew")),
  },

  /* ── Lens Formula Interactive Lab ── */
  "lens-formula-lab-sim": {
    title: "Lens Formula Lab — Live Ray Diagram",
    description: "Slide u & f · 1/v−1/u=1/f computed instantly · 3 principal rays drawn · convex/concave toggle · image nature cards",
    category: "lenses",
    icon: "🔭",
    component: lazyLoad(() => import("./lenses/LensFormulaLabSim")),
  },

  /* ── Eye Defects Ray Diagram — canvas-based ── */
  "eye-defects-ray-diagram-sim": {
    title: "Eye Defects — Ray Diagram Simulation",
    description: "Normal / Myopia / Hypermetropia / Presbyopia · canvas ray diagram · toggle corrective lens · corrective power shown",
    category: "eye",
    icon: "👓",
    component: lazyLoad(() => import("./eye/EyeDefectsRayDiagramSim")),
  },

  /* ═══════════════════════════════════════════════════
   * NEW SIMULATIONS BATCH 2 — skills.sh inspired design
   * Ultra-engaging, modern, production-level simulations
   * ═══════════════════════════════════════════════════ */

  /* ── Additive Colour Mixing — RGB spotlight lab ── */
  "color-mixing-light-sim": {
    title: "Additive Colour Mixing — RGB Light Lab",
    description: "Three RGB spotlights · drag intensity sliders · watch Yellow/Cyan/Magenta/White form live · hex colour code display · TV pixel analogy",
    category: "dispersion",
    icon: "🎨",
    component: lazyLoad(() => import("./reflection/ColorMixingLightSim")),
  },

  /* ── Periscope — two plane mirrors at 45° ── */
  "periscope-sim": {
    title: "Periscope Simulator — Two Mirror Reflections",
    description: "Adjust mirror angle (20–70°) · animated photon bouncing between mirrors · shows why 45° gives straight-up view · applications: submarine, tank",
    category: "reflection",
    icon: "🔭",
    component: lazyLoad(() => import("./reflection/PeriscopeSim")),
  },

  /* ── Pinhole Camera — rectilinear propagation ── */
  "pinhole-camera-sim": {
    title: "Pinhole Camera (Camera Obscura)",
    description: "Drag object distance & hole size · see inverted real image form on screen · live magnification = v/u · larger hole = blurry vs sharp",
    category: "reflection",
    icon: "📷",
    component: lazyLoad(() => import("./reflection/PinholeCameraSim")),
  },

  /* ── Huygens Wavefront Refraction ── */
  "wavefront-refraction-sim": {
    title: "Huygens Wavefront — Why Light Bends",
    description: "Animated wavefronts cross a medium boundary · slows down in denser medium → tilts → Snell's Law derived geometrically · n₁sinθ₁=n₂sinθ₂ live",
    category: "refraction",
    icon: "🌊",
    component: lazyLoad(() => import("./refraction/WavefrontRefractionSim")),
  },

  /* ── Mirror Applications Gallery ── */
  "mirror-applications-sim": {
    title: "Mirror Applications — Real World Gallery",
    description: "6 interactive scenes: torch, solar furnace, makeup mirror, rear-view, telescope, security camera · click to see ray diagram + why it works",
    category: "mirrors",
    icon: "🪞",
    component: lazyLoad(() => import("./mirrors/MirrorApplicationsSim")),
  },

  /* ── Speed of Light in Different Media ── */
  "speed-in-medium-sim": {
    title: "Speed of Light in Different Media",
    description: "Select vacuum/air/ice/water/glass/diamond · animated photon at correct speed · wavefront compression · n=c/v live formula · comparison bar chart",
    category: "refraction",
    icon: "⚡",
    component: lazyLoad(() => import("./lenses/SpeedInMediumSim")),
  },

  /* ── Kaleidoscope — multiple plane mirror reflections ── */
  "kaleidoscope-sim": {
    title: "Kaleidoscope — Multiple Mirror Reflections",
    description: "Adjust 3–12 mirrors · animated seed pattern · n mirrors → n-fold symmetry · formula: images = 360°/θ − 1 · Islamic art, toy kaleidoscopes, domes",
    category: "reflection",
    icon: "🔮",
    component: lazyLoad(() => import("./dispersion/KaleidoscopeSim")),
  },

  /* ── Human Eye Interactive Biology Lab ── */
  "light-biology-sim": {
    title: "Human Eye — Interactive Biology Lab",
    description: "Light level → pupil dilation live · object distance → lens accommodation · Normal/Myopia/Hypermetropia mode · corrective lens appears · retina image inverted",
    category: "eye",
    icon: "👁",
    component: lazyLoad(() => import("./eye/LightBiologySim")),
  },

  /* ── Virtual Optics Bench — Lens Ray Tracer ── */
  "lens-ray-tracer-sim": {
    title: "Virtual Optics Bench — Lens Ray Tracer",
    description: "Drag object · convex/concave toggle · change f · all 3 principal rays live · 1/v−1/u=1/f auto-computed · real/virtual/magnified detection",
    category: "lenses",
    icon: "🔬",
    component: lazyLoad(() => import("./lenses/LensRayTracerSim")),
  },

  /* ── Raindrop Rainbow Physics ── */
  "rainbow-droplet-sim": {
    title: "Raindrop Rainbow Physics — VIBGYOR Dispersion",
    description: "Impact parameter slider · traces all 7 colours through drop · Snell's law applied · rainbow angles 40°–42° shown · filter by colour",
    category: "dispersion",
    icon: "🌈",
    component: lazyLoad(() => import("./dispersion/RainbowDropletSim")),
  },

  /* ── Glass Slab Lateral Displacement Lab ── */
  "glass-slab-lateral-shift-sim": {
    title: "Glass Slab — Lateral Displacement Lab",
    description: "Angle/thickness/n sliders · emergent ray parallel to incident · d=t·sin(i−r)/cos r live · pen-in-water real-world connection · TIR detection",
    category: "refraction",
    icon: "🪟",
    component: lazyLoad(() => import("./refraction/GlassSlabLateralShiftSim")),
  },

  /* ── Shadow Formation & Eclipses Lab ── */
  "shadow-formation-sim": {
    title: "Shadow Formation & Eclipses Lab",
    description: "Umbra + penumbra · point vs extended source · solar/lunar eclipse modes · adjust source size, object & screen position · rectilinear propagation",
    category: "reflection",
    icon: "🔦",
    component: lazyLoad(() => import("./reflection/ShadowFormationSim")),
  },

  /* ── Apparent Depth — Why Pools Look Shallower ── */
  "apparent-depth-vis-sim": {
    title: "Apparent Depth — Why Pools Look Shallower",
    description: "Real depth slider · Water/Glass/Diamond/Oil/Ice media · observer angle · refracted rays · d'=d/n live · % reduction · fun facts per medium",
    category: "refraction",
    icon: "🏊",
    component: lazyLoad(() => import("./refraction/ApparentDepthSim")),
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
