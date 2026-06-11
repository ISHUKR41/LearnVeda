/**
 * FILE: SphericalMirrorTermsSim.tsx
 * LOCATION: frontend/src/components/simulations/light/mirrors/SphericalMirrorTermsSim.tsx
 *
 * PURPOSE: Interactive labeled diagram of spherical mirror terminology.
 *          Students can hover over each labeled point to see its definition
 *          and formula. Animates a concave or convex mirror cross-section
 *          with all key terms: P, C, F, R, f, principal axis, aperture.
 *
 * FEATURES:
 *   - Toggle between Concave and Convex mirror
 *   - Animated pulse at each labeled point (P, C, F)
 *   - Click/hover any label for pop-up definition
 *   - Live rays showing R = 2f relationship
 *   - Principal axis with arrows, aperture lines
 *   - Colour-coded: Blue = mirror, Gold = focus, Green = C, Red = axis
 *   - Responsive canvas via ResizeObserver + devicePixelRatio
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import styles from "../SimulationEngine.module.css";

type MirrorType = "concave" | "convex";

interface LabelInfo {
  key: string;
  name: string;
  formula: string;
  def: string;
  color: string;
}

const LABELS: LabelInfo[] = [
  { key: "P",  name: "Pole (P)",                  formula: "at mirror surface",  def: "The geometric centre of the reflecting surface. All distances are measured from the pole.", color: "#60a5fa" },
  { key: "C",  name: "Centre of Curvature (C)",    formula: "PC = R",             def: "The centre of the hollow glass sphere of which the mirror is a part. C = 2F from pole.", color: "#34d399" },
  { key: "F",  name: "Principal Focus (F)",        formula: "PF = f = R/2",       def: "For concave: where parallel rays converge after reflection. For convex: where they appear to diverge from.", color: "#fbbf24" },
  { key: "f",  name: "Focal Length (f)",           formula: "f = R/2",            def: "Distance between Pole (P) and Principal Focus (F). Always half the radius of curvature.", color: "#f97316" },
  { key: "R",  name: "Radius of Curvature (R)",   formula: "R = 2f",             def: "Distance from Pole (P) to Centre of Curvature (C). R = 2f for mirrors with small aperture.", color: "#a78bfa" },
  { key: "PA", name: "Principal Axis",             formula: "line through P and C", def: "The straight line passing through the Pole and Centre of Curvature. All distances measured along this line.", color: "#94a3b8" },
  { key: "AP", name: "Aperture",                   formula: "diameter of mirror",  def: "The effective diameter of the reflecting surface. Smaller aperture → sharper focus (less aberration).", color: "#f87171" },
];

export default function SphericalMirrorTermsSim() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef      = useRef<number>(0);
  const timeRef     = useRef<number>(0);

  const [mirrorType, setMirrorType] = useState<MirrorType>("concave");
  const [hovered,    setHovered]    = useState<string | null>(null);
  const mirrorRef    = useRef<MirrorType>("concave");
  const hoveredRef   = useRef<string | null>(null);

  mirrorRef.current  = mirrorType;
  hoveredRef.current = hovered;

  /* ── Draw loop ── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const dpr = window.devicePixelRatio || 1;
    const w = W / dpr, h = H / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    timeRef.current += 0.016;
    const t = timeRef.current;

    /* ── Background ── */
    ctx.fillStyle = "#080e1a";
    ctx.fillRect(0, 0, w, h);

    /* ── Grid dots ── */
    ctx.fillStyle = "rgba(148,163,184,0.06)";
    for (let gx = 0; gx < w; gx += 24) {
      for (let gy = 0; gy < h; gy += 24) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const cx = w * 0.52;   /* optical centre x (where mirror pole is) */
    const cy = h * 0.50;   /* centre y */
    const R  = Math.min(w, h) * 0.35;   /* radius of curvature (in pixels) */
    const f  = R / 2;                   /* focal length (pixels) */
    const isConcave = mirrorRef.current === "concave";

    /* ── Principal Axis ── */
    const axisY = cy;
    ctx.save();
    ctx.strokeStyle = "rgba(148,163,184,0.35)";
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.moveTo(20, axisY);
    ctx.lineTo(w - 20, axisY);
    ctx.stroke();
    ctx.setLineDash([]);
    /* Arrows on axis */
    const arrowHead = (ax: number, ay: number, dir: number) => {
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax - dir * 10, ay - 5);
      ctx.lineTo(ax - dir * 10, ay + 5);
      ctx.closePath();
      ctx.fillStyle = "rgba(148,163,184,0.5)";
      ctx.fill();
    };
    arrowHead(w - 22, axisY, -1);
    ctx.restore();

    /* ── Draw mirror arc ── */
    const mirrorX  = cx;
    const arcRadius = R * 1.3;  /* visual arc radius — larger than physics R for clarity */
    const arcSpan   = 0.55;     /* half-angle of arc in radians */

    ctx.save();
    ctx.strokeStyle = hoveredRef.current === "AP" ? "#f87171" : "#3b82f6";
    ctx.lineWidth   = 5;
    ctx.shadowColor = "#3b82f6";
    ctx.shadowBlur  = 16;
    ctx.beginPath();
    if (isConcave) {
      /* Concave: arc opens to the left (object side) — centre of circle is to the right */
      ctx.arc(mirrorX + arcRadius, cy, arcRadius, Math.PI - arcSpan, Math.PI + arcSpan);
    } else {
      /* Convex: arc opens to the right — centre of circle is to the left */
      ctx.arc(mirrorX - arcRadius, cy, arcRadius, -arcSpan, arcSpan);
    }
    ctx.stroke();
    ctx.restore();

    /* ── Compute key points ── */
    const P: [number, number] = [mirrorX, cy];

    /* F: focal point — to the left of P for concave, to the right (virtual) for convex */
    const Fpx: number = isConcave ? mirrorX - f : mirrorX + f;
    const F: [number, number] = [Fpx, cy];

    /* C: centre of curvature */
    const Cpx: number = isConcave ? mirrorX - R : mirrorX + R;
    const C: [number, number] = [Cpx, cy];

    /* Aperture top/bottom */
    const aperY = Math.sin(arcSpan) * arcRadius;
    const APT: [number, number] = [mirrorX, cy - aperY * 0.85];
    const APB: [number, number] = [mirrorX, cy + aperY * 0.85];

    /* ── Draw R and f distance arrows ── */
    const drawDistArrow = (x1: number, x2: number, y: number, color: string, label: string) => {
      const oy = y + 30;
      ctx.save();
      ctx.strokeStyle = color; ctx.lineWidth = 1.8;
      ctx.shadowColor = color; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.moveTo(x1, oy); ctx.lineTo(x2, oy); ctx.stroke();
      /* end ticks */
      ctx.beginPath(); ctx.moveTo(x1, oy - 5); ctx.lineTo(x1, oy + 5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x2, oy - 5); ctx.lineTo(x2, oy + 5); ctx.stroke();
      /* label */
      ctx.fillStyle = color; ctx.font = "bold 13px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, (x1 + x2) / 2, oy - 8);
      ctx.restore();
    };

    if (isConcave) {
      drawDistArrow(P[0], F[0], cy, hoveredRef.current === "f" ? "#fb923c" : "rgba(251,191,36,0.7)", "f");
      drawDistArrow(P[0], C[0], cy, hoveredRef.current === "R" ? "#a78bfa" : "rgba(167,139,250,0.5)", "R = 2f");
    } else {
      drawDistArrow(F[0], P[0], cy, hoveredRef.current === "f" ? "#fb923c" : "rgba(251,191,36,0.7)", "f");
      drawDistArrow(C[0], P[0], cy, hoveredRef.current === "R" ? "#a78bfa" : "rgba(167,139,250,0.5)", "R = 2f");
    }

    /* ── Draw aperture dimension lines ── */
    ctx.save();
    ctx.strokeStyle = hoveredRef.current === "AP" ? "#f87171" : "rgba(248,113,113,0.4)";
    ctx.lineWidth = 1.5;
    const apX = mirrorX + (isConcave ? 18 : -18);
    ctx.beginPath(); ctx.moveTo(apX, APT[1]); ctx.lineTo(apX, APB[1]); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(apX - 5, APT[1]); ctx.lineTo(apX + 5, APT[1]); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(apX - 5, APB[1]); ctx.lineTo(apX + 5, APB[1]); ctx.stroke();
    ctx.fillStyle = hoveredRef.current === "AP" ? "#f87171" : "rgba(248,113,113,0.7)";
    ctx.font = "bold 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Aperture", apX + 8, cy - 6);
    ctx.restore();

    /* ── Pulsing point helper ── */
    const drawPoint = (x: number, y: number, color: string, radius = 6) => {
      const pulse = 1 + 0.25 * Math.sin(t * 3 + x * 0.01);
      ctx.save();
      ctx.fillStyle   = color;
      ctx.shadowColor = color;
      ctx.shadowBlur  = 20;
      ctx.beginPath();
      ctx.arc(x, y, radius * pulse, 0, Math.PI * 2);
      ctx.fill();
      /* outer ring */
      ctx.strokeStyle   = color;
      ctx.lineWidth     = 1.5;
      ctx.globalAlpha   = 0.3;
      ctx.beginPath();
      ctx.arc(x, y, radius * pulse * 2.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    /* ── Label helper ── */
    const drawLabelPoint = (x: number, y: number, labelText: string, fullName: string, color: string, offset: [number, number]) => {
      const isHov = hoveredRef.current === labelText;
      const r = isHov ? 9 : 7;
      drawPoint(x, y, isHov ? color : color + "99", r);
      ctx.save();
      ctx.font      = `bold ${isHov ? 16 : 14}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = isHov ? color : color + "cc";
      ctx.shadowColor = color;
      ctx.shadowBlur  = isHov ? 12 : 0;
      ctx.textAlign   = "left";
      ctx.fillText(labelText, x + offset[0], y + offset[1]);
      if (isHov) {
        ctx.font      = "13px Inter, system-ui, sans-serif";
        ctx.fillStyle = "#cbd5e1";
        ctx.shadowBlur = 0;
        ctx.fillText(fullName, x + offset[0], y + offset[1] + 18);
      }
      ctx.restore();
    };

    /* ── Draw key points ── */
    drawLabelPoint(P[0], P[1], "P", "Pole", "#60a5fa", [10, -14]);
    drawLabelPoint(F[0], F[1], "F", "Principal Focus", "#fbbf24", [10, -14]);
    drawLabelPoint(C[0], C[1], "C", "Centre of Curvature", "#34d399", [10, -14]);

    /* ── Example incident ray (parallel to axis → reflects through F) ── */
    if (isConcave) {
      const rayY = cy - aperY * 0.5;
      /* incoming ray */
      ctx.save();
      ctx.strokeStyle = "rgba(253,224,71,0.8)";
      ctx.lineWidth   = 2;
      ctx.shadowColor = "#fde047";
      ctx.shadowBlur  = 10;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.moveTo(20, rayY);
      ctx.lineTo(mirrorX - 2, rayY);
      ctx.stroke();
      ctx.setLineDash([]);
      /* reflected ray through F */
      ctx.strokeStyle = "rgba(253,224,71,0.8)";
      ctx.shadowBlur  = 12;
      ctx.beginPath();
      ctx.moveTo(mirrorX, rayY);
      ctx.lineTo(F[0], cy);
      ctx.stroke();
      ctx.restore();
    }

    timeRef.current = t;
    rafRef.current  = requestAnimationFrame(draw);
  }, []);

  /* ── ResizeObserver ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = el.clientWidth  * dpr;
      canvas.height = el.clientHeight * dpr;
    });
    obs.observe(el);
    rafRef.current = requestAnimationFrame(draw);
    return () => { obs.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  const hoveredInfo = hovered ? LABELS.find(l => l.key === hovered) : null;

  return (
    <div className={styles.simWrapper}>
      {/* ── Header ── */}
      <div className={styles.simHeader}>
        <span className={styles.simIcon}>📐</span>
        <div>
          <div className={styles.simTitle}>Spherical Mirror — Terminology Explorer</div>
          <div className={styles.simDesc}>Hover labels for definitions · P, C, F, R, f, Aperture</div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Mirror Type</span>
          <div style={{ display: "flex", gap: "8px" }}>
            {(["concave", "convex"] as MirrorType[]).map((mt) => (
              <button
                key={mt}
                className={`${styles.presetBtn} ${mirrorType === mt ? styles.presetBtnActive : ""}`}
                onClick={() => setMirrorType(mt)}
              >
                {mt === "concave" ? "Concave (converging)" : "Convex (diverging)"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Canvas ── */}
      <div ref={containerRef} className={styles.canvasWrap}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      {/* ── Clickable label glossary ── */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px", fontWeight: 600, letterSpacing: "0.05em" }}>
          CLICK A TERM TO SEE ITS DEFINITION
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {LABELS.map((l) => (
            <button
              key={l.key}
              onMouseEnter={() => setHovered(l.key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setHovered(hovered === l.key ? null : l.key)}
              style={{
                padding: "5px 12px",
                borderRadius: "7px",
                border: `1px solid ${hovered === l.key ? l.color : l.color + "40"}`,
                background: hovered === l.key ? l.color + "15" : "transparent",
                color: hovered === l.key ? l.color : "#94a3b8",
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {l.key}
            </button>
          ))}
        </div>
        {/* Definition pop-up */}
        {hoveredInfo && (
          <div style={{
            marginTop: "12px", padding: "14px 16px",
            borderRadius: "10px",
            background: hoveredInfo.color + "12",
            border: `1px solid ${hoveredInfo.color}30`,
          }}>
            <div style={{ color: hoveredInfo.color, fontWeight: 700, fontSize: "0.88rem", marginBottom: "4px" }}>
              {hoveredInfo.name} — <code style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.82rem" }}>{hoveredInfo.formula}</code>
            </div>
            <div style={{ color: "#cbd5e1", fontSize: "0.82rem", lineHeight: 1.55 }}>
              {hoveredInfo.def}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
