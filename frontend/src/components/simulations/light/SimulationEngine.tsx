/**
 * FILE: SimulationEngine.tsx
 * LOCATION: frontend/src/components/simulations/light/SimulationEngine.tsx
 * PURPOSE: Shared Canvas-based simulation engine for all Light chapter simulations.
 *          Provides reusable hooks, physics utilities, and a base Canvas component
 *          that handles responsive sizing, high-DPI rendering, animation loops,
 *          and unified mouse/touch interaction.
 *
 * FEATURES:
 *   - useCanvasSetup: Hook for responsive, retina-ready canvas
 *   - useAnimationLoop: requestAnimationFrame loop with delta time
 *   - useMouseInteraction: Unified mouse + touch drag handling
 *   - Physics helpers: Snell's law, mirror formula, lens formula, ray geometry
 *   - Drawing helpers: rays, arcs, arrows, labels, grids
 *
 * USED BY: All simulation components under /simulations/light/
 * LAST UPDATED: 2026-06-08
 */

"use client";

import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";

/* ═══════════════════════════════════════════════════
 * TYPES
 * ═══════════════════════════════════════════════════ */

/** 2D point used throughout simulations */
export interface Point {
  x: number;
  y: number;
}

/** A single light ray segment from start to end */
export interface RaySegment {
  start: Point;
  end: Point;
  color?: string;
  dashed?: boolean;
}

/** Mouse/touch interaction state */
export interface InteractionState {
  isDown: boolean;
  position: Point;
  dragStart: Point | null;
  dragDelta: Point;
}

/** Props for the base SimCanvas component */
export interface SimCanvasProps {
  /** Drawing function called every animation frame */
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => void;
  /** Optional width override (defaults to 100% of container) */
  width?: number;
  /** Desired canvas height in CSS pixels */
  height?: number;
  /** Additional CSS class name for the wrapper */
  className?: string;
  /** Whether the simulation is actively animating */
  animate?: boolean;
  /** Callback when mouse/touch moves over canvas */
  onInteraction?: (state: InteractionState) => void;
  /** Background color (defaults to transparent) */
  backgroundColor?: string;
}

/* ═══════════════════════════════════════════════════
 * PHYSICS UTILITIES
 * ═══════════════════════════════════════════════════ */

/**
 * Snell's Law: Calculate refracted angle given incident angle and refractive indices.
 * Returns null if total internal reflection occurs (angle > critical angle).
 *
 * @param angleIncident - Angle of incidence in radians
 * @param n1 - Refractive index of medium 1 (incoming)
 * @param n2 - Refractive index of medium 2 (outgoing)
 * @returns Angle of refraction in radians, or null for TIR
 */
export function snellsLaw(angleIncident: number, n1: number, n2: number): number | null {
  const sinRefracted = (n1 * Math.sin(angleIncident)) / n2;
  if (Math.abs(sinRefracted) > 1) return null; // Total internal reflection
  return Math.asin(sinRefracted);
}

/**
 * Critical angle for TIR (denser → rarer medium).
 * @param n1 - Refractive index of denser medium
 * @param n2 - Refractive index of rarer medium (default: 1 for air)
 * @returns Critical angle in radians
 */
export function criticalAngle(n1: number, n2: number = 1): number {
  return Math.asin(n2 / n1);
}

/**
 * Mirror formula: 1/v + 1/u = 1/f
 * Given any two of u, v, f → compute the third.
 *
 * @param u - Object distance (negative for real objects)
 * @param v - Image distance
 * @param f - Focal length
 * @returns The missing value
 */
export function mirrorFormula(
  u?: number,
  v?: number,
  f?: number
): { u: number; v: number; f: number } {
  if (u !== undefined && v !== undefined) {
    const fCalc = (u * v) / (u + v);
    return { u, v, f: fCalc };
  }
  if (u !== undefined && f !== undefined) {
    const vCalc = (u * f) / (u - f);
    return { u, v: vCalc, f };
  }
  if (v !== undefined && f !== undefined) {
    const uCalc = (v * f) / (v - f);
    return { u: uCalc, v, f };
  }
  throw new Error("mirrorFormula: provide at least 2 of u, v, f");
}

/**
 * Lens formula: 1/v - 1/u = 1/f
 * Given any two of u, v, f → compute the third.
 */
export function lensFormula(
  u?: number,
  v?: number,
  f?: number
): { u: number; v: number; f: number } {
  if (u !== undefined && v !== undefined) {
    const fCalc = (u * v) / (v - u);
    return { u, v, f: fCalc };
  }
  if (u !== undefined && f !== undefined) {
    const vCalc = (u * f) / (u + f);
    return { u, v: vCalc, f };
  }
  if (v !== undefined && f !== undefined) {
    const uCalc = (v * f) / (v - f);
    return { u: uCalc, v, f };
  }
  throw new Error("lensFormula: provide at least 2 of u, v, f");
}

/**
 * Calculate magnification for mirrors: m = -v/u
 */
export function mirrorMagnification(v: number, u: number): number {
  return -v / u;
}

/**
 * Calculate magnification for lenses: m = v/u
 */
export function lensMagnification(v: number, u: number): number {
  return v / u;
}

/**
 * Power of a lens in dioptres: P = 1/f (f in metres)
 */
export function lensPower(fMetres: number): number {
  return 1 / fMetres;
}

/**
 * Distance between two points
 */
export function distance(a: Point, b: Point): number {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

/**
 * Angle of line from a to b (in radians, measured from positive x-axis)
 */
export function angle(a: Point, b: Point): number {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

/**
 * Reflect a ray direction about a normal direction.
 * Both angles in radians.
 */
export function reflectAngle(incidentAngle: number, normalAngle: number): number {
  return 2 * normalAngle - incidentAngle - Math.PI;
}

/* ═══════════════════════════════════════════════════
 * DRAWING UTILITIES
 * ═══════════════════════════════════════════════════ */

/**
 * Draw a light ray (line) with optional arrowhead.
 */
export function drawRay(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  color: string = "#fbbf24",
  lineWidth: number = 2,
  dashed: boolean = false,
  showArrow: boolean = true
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  if (dashed) ctx.setLineDash([6, 4]);

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

  if (showArrow) {
    const arrowLen = 10;
    const ang = angle(start, end);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - arrowLen * Math.cos(ang - Math.PI / 6),
      end.y - arrowLen * Math.sin(ang - Math.PI / 6)
    );
    ctx.lineTo(
      end.x - arrowLen * Math.cos(ang + Math.PI / 6),
      end.y - arrowLen * Math.sin(ang + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draw a normal line (dashed perpendicular line) at a point on a surface.
 */
export function drawNormal(
  ctx: CanvasRenderingContext2D,
  point: Point,
  normalAngle: number,
  length: number = 80,
  color: string = "rgba(255,255,255,0.4)"
) {
  const half = length / 2;
  drawRay(
    ctx,
    {
      x: point.x - half * Math.cos(normalAngle),
      y: point.y - half * Math.sin(normalAngle),
    },
    {
      x: point.x + half * Math.cos(normalAngle),
      y: point.y + half * Math.sin(normalAngle),
    },
    color,
    1,
    true,
    false
  );
}

/**
 * Draw an angle arc between two directions at a point.
 */
export function drawAngleArc(
  ctx: CanvasRenderingContext2D,
  center: Point,
  startAngle: number,
  endAngle: number,
  radius: number = 30,
  color: string = "#60a5fa",
  label?: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, startAngle, endAngle, false);
  ctx.stroke();

  if (label) {
    const midAngle = (startAngle + endAngle) / 2;
    const labelRadius = radius + 14;
    ctx.fillStyle = color;
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      label,
      center.x + labelRadius * Math.cos(midAngle),
      center.y + labelRadius * Math.sin(midAngle)
    );
  }

  ctx.restore();
}

/**
 * Draw a flat mirror surface.
 */
export function drawMirrorFlat(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  color: string = "#94a3b8"
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

  /* Hatching behind mirror */
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / len;
  const ny = dx / len;
  const hatchLen = 8;
  const hatchSpacing = 10;
  const steps = Math.floor(len / hatchSpacing);

  ctx.strokeStyle = "rgba(148, 163, 184, 0.5)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const px = start.x + dx * t;
    const py = start.y + dy * t;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + nx * hatchLen, py + ny * hatchLen);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draw a concave or convex mirror arc.
 * @param type - "concave" or "convex"
 */
export function drawMirrorCurved(
  ctx: CanvasRenderingContext2D,
  center: Point,
  radius: number,
  aperture: number,
  type: "concave" | "convex",
  color: string = "#94a3b8"
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;

  const halfAngle = Math.asin(aperture / (2 * radius));
  const startAngle = type === "concave" ? -halfAngle : Math.PI - halfAngle;
  const endAngle = type === "concave" ? halfAngle : Math.PI + halfAngle;

  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, startAngle, endAngle);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw a convex or concave lens shape.
 */
export function drawLens(
  ctx: CanvasRenderingContext2D,
  center: Point,
  height: number,
  type: "convex" | "concave",
  color: string = "rgba(96, 165, 250, 0.3)"
) {
  ctx.save();
  const halfH = height / 2;
  const bulge = type === "convex" ? 15 : -10;

  ctx.fillStyle = color;
  ctx.strokeStyle = "#60a5fa";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(center.x, center.y - halfH);
  ctx.quadraticCurveTo(center.x + bulge, center.y, center.x, center.y + halfH);
  ctx.quadraticCurveTo(center.x - bulge, center.y, center.x, center.y - halfH);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  /* Arrow tips at top and bottom */
  const arrowSize = 6;
  ctx.fillStyle = "#60a5fa";

  /* Top arrow */
  ctx.beginPath();
  ctx.moveTo(center.x, center.y - halfH);
  ctx.lineTo(center.x - arrowSize, center.y - halfH + arrowSize);
  ctx.lineTo(center.x + arrowSize, center.y - halfH + arrowSize);
  ctx.closePath();
  ctx.fill();

  /* Bottom arrow */
  ctx.beginPath();
  ctx.moveTo(center.x, center.y + halfH);
  ctx.lineTo(center.x - arrowSize, center.y + halfH - arrowSize);
  ctx.lineTo(center.x + arrowSize, center.y + halfH - arrowSize);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Draw a principal axis (horizontal line through center).
 */
export function drawPrincipalAxis(
  ctx: CanvasRenderingContext2D,
  y: number,
  width: number,
  color: string = "rgba(255,255,255,0.15)"
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw a label at a position.
 */
export function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  position: Point,
  color: string = "#e2e8f0",
  fontSize: number = 13,
  align: CanvasTextAlign = "center"
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  ctx.fillText(text, position.x, position.y);
  ctx.restore();
}

/**
 * Draw an object arrow (upward arrow representing the object).
 */
export function drawObjectArrow(
  ctx: CanvasRenderingContext2D,
  base: Point,
  height: number,
  color: string = "#34d399"
) {
  const top: Point = { x: base.x, y: base.y - height };
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;

  /* Shaft */
  ctx.beginPath();
  ctx.moveTo(base.x, base.y);
  ctx.lineTo(top.x, top.y);
  ctx.stroke();

  /* Arrowhead */
  const arrowSize = 8;
  ctx.beginPath();
  ctx.moveTo(top.x, top.y);
  ctx.lineTo(top.x - arrowSize, top.y + arrowSize);
  ctx.lineTo(top.x + arrowSize, top.y + arrowSize);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Draw the background grid for simulations.
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spacing: number = 40,
  color: string = "rgba(255,255,255,0.03)"
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  for (let x = 0; x < width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y < height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

/* ═══════════════════════════════════════════════════
 * HOOKS
 * ═══════════════════════════════════════════════════ */

/**
 * Hook: manages canvas setup, high-DPI scaling, and resize handling.
 */
export function useCanvasSetup(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  desiredHeight?: number
) {
  const [dimensions, setDimensions] = useState({ width: 600, height: desiredHeight || 400 });

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = desiredHeight || Math.floor(rect.width * 0.55);
      setDimensions({ width: w, height: h });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [containerRef, desiredHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, [canvasRef, dimensions]);

  return dimensions;
}

/**
 * Hook: requestAnimationFrame loop with time tracking.
 */
export function useAnimationLoop(
  callback: (time: number) => void,
  active: boolean = true
) {
  const frameRef = useRef<number>(0);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!active) return;

    const loop = (timestamp: number) => {
      callbackRef.current(timestamp);
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active]);
}

/**
 * Hook: unified mouse + touch interaction for canvas.
 */
export function useMouseInteraction(
  canvasRef: React.RefObject<HTMLCanvasElement | null>
): InteractionState {
  const [state, setState] = useState<InteractionState>({
    isDown: false,
    position: { x: 0, y: 0 },
    dragStart: null,
    dragDelta: { x: 0, y: 0 },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPos = (e: MouseEvent | Touch): Point => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onMouseDown = (e: MouseEvent) => {
      const pos = getPos(e);
      setState((s) => ({ ...s, isDown: true, position: pos, dragStart: pos }));
    };

    const onMouseMove = (e: MouseEvent) => {
      const pos = getPos(e);
      setState((s) => ({
        ...s,
        position: pos,
        dragDelta: s.dragStart
          ? { x: pos.x - s.dragStart.x, y: pos.y - s.dragStart.y }
          : { x: 0, y: 0 },
      }));
    };

    const onMouseUp = () => {
      setState((s) => ({
        ...s,
        isDown: false,
        dragStart: null,
        dragDelta: { x: 0, y: 0 },
      }));
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const pos = getPos(e.touches[0]);
      setState((s) => ({ ...s, isDown: true, position: pos, dragStart: pos }));
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const pos = getPos(e.touches[0]);
      setState((s) => ({
        ...s,
        position: pos,
        dragDelta: s.dragStart
          ? { x: pos.x - s.dragStart.x, y: pos.y - s.dragStart.y }
          : { x: 0, y: 0 },
      }));
    };

    const onTouchEnd = () => {
      setState((s) => ({
        ...s,
        isDown: false,
        dragStart: null,
        dragDelta: { x: 0, y: 0 },
      }));
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [canvasRef]);

  return state;
}

/* ═══════════════════════════════════════════════════
 * BASE CANVAS COMPONENT
 * ═══════════════════════════════════════════════════ */

/**
 * SimCanvas — The foundation component for all simulations.
 * Handles responsive sizing, high-DPI rendering, animation loop,
 * and background clearing. Each simulation provides a `draw` function.
 */
export const SimCanvas: React.FC<SimCanvasProps> = ({
  draw,
  height: desiredHeight,
  className,
  animate = true,
  backgroundColor = "#0f172a",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dims = useCanvasSetup(canvasRef, containerRef, desiredHeight);

  useAnimationLoop((time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* Clear with background */
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, dims.width, dims.height);

    /* Draw subtle grid */
    drawGrid(ctx, dims.width, dims.height);

    /* Call simulation-specific draw function */
    draw(ctx, dims.width, dims.height, time);
  }, animate);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          cursor: "crosshair",
        }}
      />
    </div>
  );
};

export default SimCanvas;
