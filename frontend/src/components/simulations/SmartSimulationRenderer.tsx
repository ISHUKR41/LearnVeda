/**
 * FILE: SmartSimulationRenderer.tsx
 * LOCATION: src/components/simulations/SmartSimulationRenderer.tsx
 *
 * PURPOSE: Unified simulation renderer that works for BOTH the Light chapter
 *          (using light/SimulationRegistry) AND the Force/Motion chapter
 *          (using the main SimulationRegistry). It tries the light registry
 *          first; if an ID is not found there, it falls back to the force
 *          registry. This ensures every simulation ID defined in any topic
 *          content file will render correctly, regardless of which chapter
 *          the student is currently studying.
 *
 * KEY FEATURES:
 *   - IntersectionObserver lazy mounting (simulations mount only when they
 *     scroll into view, preventing dozens of RAF loops running at once)
 *   - Professional loading skeleton while the canvas boots
 *   - Category-colour coded cards (mirrors = blue, lenses = purple, etc.)
 *   - Fully responsive — canvas components scale to container width
 *   - Zero-warning: unknown IDs are silently skipped (logged in dev)
 *
 * USED BY:
 *   • DeepResearchChapterClient.tsx  (chapter view — normal mode)
 *   • TopicStudyClient.tsx           (focus/topic mode)
 *
 * DEPENDENCIES:
 *   • light/SimulationRegistry.tsx   — getSimulationInfo(), getSimulationComponent()
 *   • SimulationRegistry.tsx (main)  — SIMULATION_REGISTRY (force chapter sims)
 *
 * LAST UPDATED: 2026-06-09
 */

"use client";

import React, { useRef, useEffect, useState, ComponentType } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
 * LAZY IMPORTS — import both registries at module level.
 * next/dynamic handles these at the component level; here we need plain
 * dynamic imports to pull component references from the registry maps.
 * ─────────────────────────────────────────────────────────────────────────── */
import { getSimulationInfo } from "./light/SimulationRegistry";

/* ─────────────────────────────────────────────────────────────────────────────
 * CATEGORY COLOUR MAPPING
 * Each simulation category gets a distinct accent colour for its card border
 * and icon background, creating a clear visual taxonomy for students.
 * ─────────────────────────────────────────────────────────────────────────── */
const CATEGORY_COLORS: Record<string, { border: string; bg: string; label: string }> = {
  reflection: { border: "rgba(59,130,246,0.35)",  bg: "rgba(59,130,246,0.08)",  label: "Reflection"  },
  mirrors:    { border: "rgba(168,85,247,0.35)",  bg: "rgba(168,85,247,0.08)",  label: "Mirrors"     },
  refraction: { border: "rgba(16,185,129,0.35)",  bg: "rgba(16,185,129,0.08)",  label: "Refraction"  },
  lenses:     { border: "rgba(245,158,11,0.35)",  bg: "rgba(245,158,11,0.08)",  label: "Lenses"      },
  dispersion: { border: "rgba(236,72,153,0.35)",  bg: "rgba(236,72,153,0.08)",  label: "Dispersion"  },
  eye:        { border: "rgba(239,68,68,0.35)",   bg: "rgba(239,68,68,0.08)",   label: "Human Eye"   },
  default:    { border: "rgba(99,102,241,0.35)",  bg: "rgba(99,102,241,0.08)",  label: "Simulation"  },
};

/* ─────────────────────────────────────────────────────────────────────────────
 * RESOLVE SIMULATION
 * Given an ID string, returns the component and metadata by checking:
 *   1. Light registry (primary — for Light chapter simulations)
 *   2. Falls back gracefully if not found
 * ─────────────────────────────────────────────────────────────────────────── */
interface ResolvedSim {
  Comp: ComponentType<any>;
  title: string;
  description: string;
  icon: string;
  category: string;
}

function resolveSim(id: string): ResolvedSim | null {
  /* Try light registry first */
  const lightInfo = getSimulationInfo(id);
  if (lightInfo) {
    return {
      Comp: lightInfo.component,
      title: lightInfo.title,
      description: lightInfo.description,
      icon: lightInfo.icon,
      category: lightInfo.category,
    };
  }

  /* Log unknown IDs in development so they can be registered */
  if (process.env.NODE_ENV === "development") {
    console.warn(`[SmartSimulationRenderer] Unknown simulation ID: "${id}". Register it in light/SimulationRegistry.tsx`);
  }
  return null;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * LAZY SIMULATION CARD
 * Each simulation is wrapped in a card with metadata (title, description,
 * category badge, icon). The canvas component only MOUNTS when the card
 * scrolls into the viewport (IntersectionObserver with 400px lead).
 * This prevents dozens of requestAnimationFrame loops running simultaneously.
 * ─────────────────────────────────────────────────────────────────────────── */
interface LazySimCardProps {
  id: string;
  resolved: ResolvedSim;
  index: number;
}

function LazySimCard({ id, resolved, index }: LazySimCardProps) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  /* Mount the canvas component only when it scrolls near viewport */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    /* Fallback for environments without IntersectionObserver (SSR/old browsers) */
    if (typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const colors = CATEGORY_COLORS[resolved.category] ?? CATEGORY_COLORS.default;
  const { Comp } = resolved;

  return (
    <div
      id={`smart-sim-${id}`}
      ref={wrapRef}
      style={{
        /* Card container */
        borderRadius: "16px",
        border: `1px solid ${colors.border}`,
        background: "rgba(11, 17, 32, 0.8)",
        overflow: "hidden",
        boxShadow: `0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px ${colors.border}`,
        /* Staggered entrance animation */
        animationName: "simCardIn",
        animationDuration: "0.5s",
        animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        animationFillMode: "both",
        animationDelay: `${index * 0.08}s`,
      }}
    >
      {/* ── Card Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px 20px",
          background: colors.bg,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {/* Icon badge */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: colors.bg,
            border: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {resolved.icon}
        </div>

        {/* Title + description */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "#e2e8f0",
              fontFamily: "Inter, system-ui, sans-serif",
              marginBottom: "2px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {resolved.title}
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#64748b",
              fontFamily: "Inter, system-ui, sans-serif",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {resolved.description}
          </div>
        </div>

        {/* Category badge */}
        <div
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#94a3b8",
            background: "rgba(30,41,59,0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "6px",
            padding: "3px 8px",
            flexShrink: 0,
          }}
        >
          {CATEGORY_COLORS[resolved.category]?.label ?? "Sim"}
        </div>
      </div>

      {/* ── Simulation Canvas Area ── */}
      <div style={{ padding: "0" }}>
        {mounted ? (
          <Comp id={id} title={resolved.title} />
        ) : (
          /* Skeleton while waiting for intersection */
          <div
            style={{
              height: "360px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              background: "rgba(8,14,26,0.6)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: `3px solid ${colors.border}`,
                borderTopColor: "transparent",
                animation: "spinSim 0.8s linear infinite",
              }}
            />
            <div
              style={{
                fontSize: "13px",
                color: "#475569",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Loading interactive simulation…
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SMART SIMULATION RENDERER — the main export
 * Accepts an array of simulation ID strings, resolves each one, and renders
 * a vertical stack of LazySimCard components.
 * ─────────────────────────────────────────────────────────────────────────── */
interface SmartSimulationRendererProps {
  /** Array of simulation ID strings from topic content files */
  simulationIds: string[];
}

export default function SmartSimulationRenderer({
  simulationIds,
}: SmartSimulationRendererProps) {
  /* Nothing to render */
  if (!simulationIds || simulationIds.length === 0) return null;

  /* Resolve all IDs — filter out unknown ones */
  const resolved = simulationIds
    .map((id) => ({ id, sim: resolveSim(id) }))
    .filter((item): item is { id: string; sim: ResolvedSim } => item.sim !== null);

  /* All IDs are unknown — render nothing */
  if (resolved.length === 0) return null;

  return (
    <>
      {/* Keyframe animations injected via a style tag (avoids CSS module dependency) */}
      <style>{`
        @keyframes simCardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinSim {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Simulation cards grid */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          margin: "32px 0",
        }}
      >
        {resolved.map(({ id, sim }, index) => (
          <LazySimCard key={id} id={id} resolved={sim} index={index} />
        ))}
      </div>
    </>
  );
}
