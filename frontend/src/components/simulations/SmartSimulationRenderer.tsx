/**
 * FILE: SmartSimulationRenderer.tsx
 * LOCATION: src/components/simulations/SmartSimulationRenderer.tsx
 *
 * PURPOSE: Unified simulation renderer that works for BOTH the Light chapter
 *          (using light/SimulationRegistry) AND the Force/Motion chapter.
 *          Supports two display modes:
 *            - Default mode: compact cards stacked vertically in the Learn tab
 *            - expandedMode: large, prominent cards in the dedicated Simulations tab
 *
 * KEY FEATURES:
 *   - IntersectionObserver lazy mounting (simulations mount only when they
 *     scroll into view, preventing dozens of RAF loops running at once)
 *   - Professional loading skeleton while the canvas boots
 *   - Category-colour coded cards (mirrors = blue, lenses = purple, etc.)
 *   - expandedMode shows metadata header above the canvas for better UX
 *   - Fully responsive — canvas components scale to container width
 *   - Zero-warning: unknown IDs are silently skipped (logged in dev)
 *
 * USED BY:
 *   • DeepResearchChapterClient.tsx  (chapter view — normal + simulations tab)
 *   • TopicStudyClient.tsx           (focus/topic mode)
 *
 * DEPENDENCIES:
 *   • light/SimulationRegistry.tsx   — getSimulationInfo(), getSimulationComponent()
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, ComponentType } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
 * LAZY IMPORTS — import both registries at module level.
 * ─────────────────────────────────────────────────────────────────────────── */
import { getSimulationInfo } from "./light/SimulationRegistry";

/* ─────────────────────────────────────────────────────────────────────────────
 * CATEGORY COLOUR MAPPING
 * Each simulation category gets a distinct accent colour for its card border
 * and icon background, creating a clear visual taxonomy for students.
 * ─────────────────────────────────────────────────────────────────────────── */
const CATEGORY_COLORS: Record<string, { border: string; bg: string; label: string; glow: string }> = {
  reflection: { border: "rgba(59,130,246,0.4)",  bg: "rgba(59,130,246,0.10)",  label: "Reflection",  glow: "rgba(59,130,246,0.15)"  },
  mirrors:    { border: "rgba(168,85,247,0.4)",  bg: "rgba(168,85,247,0.10)",  label: "Mirrors",     glow: "rgba(168,85,247,0.15)"  },
  refraction: { border: "rgba(16,185,129,0.4)",  bg: "rgba(16,185,129,0.10)",  label: "Refraction",  glow: "rgba(16,185,129,0.15)"  },
  lenses:     { border: "rgba(245,158,11,0.4)",  bg: "rgba(245,158,11,0.10)",  label: "Lenses",      glow: "rgba(245,158,11,0.15)"  },
  dispersion: { border: "rgba(236,72,153,0.4)",  bg: "rgba(236,72,153,0.10)",  label: "Dispersion",  glow: "rgba(236,72,153,0.15)"  },
  eye:        { border: "rgba(239,68,68,0.4)",   bg: "rgba(239,68,68,0.10)",   label: "Human Eye",   glow: "rgba(239,68,68,0.15)"   },
  default:    { border: "rgba(99,102,241,0.4)",  bg: "rgba(99,102,241,0.10)",  label: "Simulation",  glow: "rgba(99,102,241,0.15)"  },
};

/* ─────────────────────────────────────────────────────────────────────────────
 * RESOLVE SIMULATION
 * Given an ID string, returns the component and metadata by checking the
 * light simulation registry. Returns null if the ID is unregistered.
 * ─────────────────────────────────────────────────────────────────────────── */
interface ResolvedSim {
  Comp: ComponentType<any>;
  title: string;
  description: string;
  icon: string;
  category: string;
}

function resolveSim(id: string): ResolvedSim | null {
  /* Try light registry */
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
 * Each simulation is wrapped in a card with optional metadata header.
 * The canvas component only MOUNTS when the card scrolls into the viewport
 * (IntersectionObserver with 400px lead) to prevent performance issues.
 * ─────────────────────────────────────────────────────────────────────────── */
interface LazySimCardProps {
  id: string;
  resolved: ResolvedSim;
  index: number;
  /** When true, shows a prominent metadata header above the simulation canvas */
  expandedMode?: boolean;
}

function LazySimCard({ id, resolved, index, expandedMode = false }: LazySimCardProps) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  /* Mount the canvas component only when it scrolls near viewport.
   * The 400px rootMargin gives a generous lead so the simulation is
   * already running by the time the student scrolls to it. */
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
        borderRadius: "18px",
        boxShadow: `0 0 0 1px ${colors.border}, 0 8px 40px rgba(0,0,0,0.45)`,
        overflow: "hidden",
        background: "rgba(8,14,26,0.95)",
        /* Staggered entrance animation */
        animationName: "simCardIn",
        animationDuration: "0.5s",
        animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        animationFillMode: "both",
        animationDelay: `${index * 0.08}s`,
      }}
    >
      {/* ── METADATA HEADER — ALWAYS VISIBLE ──
          Every simulation shows its title, description, and category badge
          so every detail is clearly visible to the student.
          In expandedMode: taller header with more padding.
          In compact mode: slimmer header but still fully visible. */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: expandedMode ? "14px" : "10px",
        padding: expandedMode ? "16px 20px" : "10px 16px",
        background: `linear-gradient(135deg, ${colors.glow} 0%, rgba(0,0,0,0) 100%)`,
        borderBottom: `1px solid ${colors.border}`,
      }}>
        {/* Category icon bubble */}
        <div style={{
          width: expandedMode ? "42px" : "34px",
          height: expandedMode ? "42px" : "34px",
          borderRadius: "10px",
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: expandedMode ? "20px" : "16px",
          flexShrink: 0,
        }}>
          {resolved.icon}
        </div>

        {/* Title + description — always shown for maximum detail */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 700,
            fontSize: expandedMode ? "0.9rem" : "0.82rem",
            color: "#e2e8f0",
            marginBottom: expandedMode ? "3px" : "1px",
            fontFamily: "Inter, system-ui, sans-serif",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {resolved.title}
          </div>
          <div style={{
            fontSize: expandedMode ? "0.78rem" : "0.72rem",
            color: "#64748b",
            lineHeight: 1.4,
            fontFamily: "Inter, system-ui, sans-serif",
            display: "-webkit-box",
            WebkitLineClamp: expandedMode ? 3 : 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {resolved.description}
          </div>
        </div>

        {/* Category label pill */}
        <div style={{
          padding: "4px 10px", borderRadius: "6px",
          background: colors.bg, border: `1px solid ${colors.border}`,
          fontSize: "0.7rem", fontWeight: 600, color: "#94a3b8",
          flexShrink: 0, fontFamily: "Inter, system-ui, sans-serif",
          letterSpacing: "0.03em",
        }}>
          {colors.label}
        </div>
      </div>

      {/* ── Simulation canvas or loading skeleton ── */}
      {mounted ? (
        <Comp id={id} title={resolved.title} />
      ) : (
        /* Loading skeleton — shown until card scrolls into view */
        <div
          style={{
            height: expandedMode ? "420px" : "320px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            background: "rgba(8,14,26,0.95)",
          }}
        >
          {/* Category icon with glow */}
          <div style={{
            fontSize: "36px", lineHeight: 1,
            filter: "drop-shadow(0 0 12px rgba(255,255,255,0.15))",
          }}>{resolved.icon}</div>

          {/* Loading spinner */}
          <div style={{
            width: "36px", height: "36px",
            borderRadius: "50%",
            border: `2.5px solid ${colors.border}`,
            borderTopColor: "transparent",
            animation: "spinSim 0.8s linear infinite",
          }} />

          <div style={{
            fontSize: "12px", color: "#475569",
            fontFamily: "Inter, system-ui, sans-serif",
          }}>
            Loading {resolved.title}…
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SMART SIMULATION RENDERER — the main export
 * Accepts an array of simulation ID strings, resolves each one, and renders
 * a vertical stack of LazySimCard components.
 *
 * Props:
 *   simulationIds — array of simulation ID strings from topic content files
 *   expandedMode  — if true, shows metadata header above each simulation canvas
 * ─────────────────────────────────────────────────────────────────────────── */
interface SmartSimulationRendererProps {
  /** Array of simulation ID strings from topic content files */
  simulationIds: string[];
  /**
   * If true, shows a metadata header (title, description, category badge)
   * above each simulation canvas. Use this in the dedicated Simulations tab.
   * Default: false (compact mode for the Learn tab).
   */
  expandedMode?: boolean;
}

export default function SmartSimulationRenderer({
  simulationIds,
  expandedMode = false,
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

      {/* Simulation cards — stacked vertically with a gap */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: expandedMode ? "32px" : "24px",
          margin: expandedMode ? "0" : "32px 0",
        }}
      >
        {resolved.map(({ id, sim }, index) => (
          <LazySimCard
            key={id}
            id={id}
            resolved={sim}
            index={index}
            expandedMode={expandedMode}
          />
        ))}
      </div>
    </>
  );
}
