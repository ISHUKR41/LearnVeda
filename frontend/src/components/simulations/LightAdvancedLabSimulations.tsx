"use client";
/**
 * FILE: LightAdvancedLabSimulations.tsx
 * LOCATION: src/components/simulations/LightAdvancedLabSimulations.tsx
 * PURPOSE: 6 advanced interactive simulations for Class 10 Light chapter.
 *          These go deeper than the basic topic simulations — full labs
 *          with draggable controls, real-time calculations, and rich visuals.
 *
 * SIMULATIONS:
 *   1. Sim_light_glass_slab_lab      — Glass slab: drag ray, see lateral displacement
 *   2. Sim_light_snell_calculator    — Interactive Snell's Law with live n calculation
 *   3. Sim_light_mirror_ray_tracer   — Full concave/convex mirror ray diagram builder
 *   4. Sim_light_lens_ray_tracer     — Full convex/concave lens ray diagram builder
 *   5. Sim_light_tir_explorer        — TIR: find critical angle, drag to trigger TIR
 *   6. Sim_light_spectrum_prism      — White light → rainbow through prism (animated)
 *
 * PATTERN: Self-contained "use client" canvas components, HiDPI-aware.
 * LAST UPDATED: 2026-06-08
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
 * SHARED UTILITIES
 * ───────────────────────────────────────────────────────────────────────────── */

function setupCanvas(canvas: HTMLCanvasElement): [CanvasRenderingContext2D, number, number] | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth || 600;
  const H = canvas.clientHeight || 380;
  if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return [ctx, W, H];
}

function drawBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#050d1a");
  g.addColorStop(1, "#0b1525");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(99,102,241,0.05)";
  for (let x = 0; x <= W; x += 35)
    for (let y = 0; y <= H; y += 35) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
}

function drawArrow(
  ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number,
  color: string, width = 1.5
) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const hs = 8;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth   = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  /* arrowhead */
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - hs * Math.cos(angle - 0.4), y2 - hs * Math.sin(angle - 0.4));
  ctx.lineTo(x2 - hs * Math.cos(angle + 0.4), y2 - hs * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

const simWrap: React.CSSProperties = {
  position: "relative", borderRadius: 18, overflow: "hidden",
  background: "#050d1a", border: "1px solid #1e2d45",
  boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
};

const simTitle: React.CSSProperties = {
  position: "absolute", top: 14, left: 18, zIndex: 10,
  fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: 13, fontWeight: 700, color: "#818cf8",
  background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.2)",
  borderRadius: 8, padding: "4px 12px", letterSpacing: "0.04em",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: 12, color: "#64748b",
};

const valueStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
  fontSize: 14, fontWeight: 700, color: "#34d399",
};

/* ─────────────────────────────────────────────────────────────────────────────
 * 1. GLASS SLAB LAB
 *    Drag the incoming ray's angle. See the slab, lateral displacement,
 *    and both refracted rays drawn in real-time.
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_glass_slab_lab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle]   = useState(40);    /* angle of incidence in degrees */
  const [n, setN]           = useState(1.5);    /* refractive index of slab */
  const [refAngle, setRef]  = useState(0);
  const [lateral, setLateral] = useState(0);
  const SLAB_T = 100;                           /* slab thickness in canvas px */

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H);

    const slabTop    = H / 2 - SLAB_T / 2;
    const slabBottom = H / 2 + SLAB_T / 2;
    const incidentX  = W / 2;

    /* Slab */
    const slabG = ctx.createLinearGradient(0, slabTop, 0, slabBottom);
    slabG.addColorStop(0, "rgba(56,189,248,0.15)");
    slabG.addColorStop(0.5, "rgba(56,189,248,0.25)");
    slabG.addColorStop(1, "rgba(56,189,248,0.15)");
    ctx.fillStyle = slabG;
    ctx.fillRect(80, slabTop, W - 160, SLAB_T);
    ctx.strokeStyle = "rgba(56,189,248,0.4)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(80, slabTop, W - 160, SLAB_T);

    /* Normal lines */
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(incidentX, slabTop - 60); ctx.lineTo(incidentX, slabBottom + 60); ctx.stroke();
    ctx.setLineDash([]);

    /* Physics */
    const i_rad = (angle * Math.PI) / 180;
    const sin_r = Math.sin(i_rad) / n;
    const r_rad = Math.asin(Math.max(-1, Math.min(1, sin_r)));
    const r_deg = (r_rad * 180) / Math.PI;
    setRef(parseFloat(r_deg.toFixed(1)));

    /* Lateral displacement in canvas px */
    const t_px = SLAB_T;
    const ld = (t_px * Math.sin(i_rad - r_rad)) / Math.cos(r_rad);
    const ld_cm = Math.abs(ld * 0.1);
    setLateral(parseFloat(ld_cm.toFixed(2)));

    /* ── Incident ray ── */
    const ix = incidentX;
    const iy = slabTop;
    const startX = ix - Math.sin(i_rad) * 100;
    const startY = iy - Math.cos(i_rad) * 100;
    drawArrow(ctx, startX, startY, ix, iy, "#fbbf24", 2);

    /* ── Refracted ray inside slab ── */
    const exitX = ix + Math.sin(r_rad) * t_px;
    const exitY = slabBottom;
    drawArrow(ctx, ix, iy, exitX, exitY, "#60a5fa", 2);

    /* ── Emergent ray ── */
    const emX = exitX + Math.sin(i_rad) * 80;
    const emY = exitY + Math.cos(i_rad) * 80;
    drawArrow(ctx, exitX, exitY, emX, emY, "#fbbf24", 2);

    /* ── Lateral displacement indicator ── */
    if (Math.abs(ld) > 3) {
      ctx.save();
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      /* Extension of incident ray direction */
      const extX = startX + Math.sin(i_rad) * (100 + t_px / Math.cos(i_rad) + 80);
      const extY = startY + Math.cos(i_rad) * (100 + t_px / Math.cos(i_rad) + 80);
      ctx.beginPath();
      ctx.moveTo(startX, startY); ctx.lineTo(extX, extY);
      ctx.stroke();
      /* Perpendicular distance line */
      ctx.setLineDash([]);
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.moveTo(exitX, exitY); ctx.lineTo(emX - (emX - extX) * 0.5, emY - (emY - extY) * 0.5);
      ctx.stroke();
      ctx.restore();
    }

    /* Labels */
    ctx.font = "bold 12px 'Inter', sans-serif";
    ctx.fillStyle = "#fbbf24";
    ctx.fillText(`∠i = ${angle}°`, startX - 50, startY + 20);
    ctx.fillStyle = "#60a5fa";
    ctx.fillText(`∠r = ${r_deg.toFixed(1)}°`, ix + 8, slabTop + 30);
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Glass slab (n = " + n + ")", W / 2 - 55, H / 2 + 5);
    ctx.fillStyle = "#f43f5e";
    ctx.fillText("Lateral disp.", W - 120, H - 20);

    /* Angle arcs */
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(ix, iy, 30, -Math.PI / 2, -Math.PI / 2 + i_rad);
    ctx.stroke();
    ctx.strokeStyle = "#60a5fa";
    ctx.beginPath();
    ctx.arc(ix, iy, 20, Math.PI / 2 - r_rad, Math.PI / 2);
    ctx.stroke();

  }, [angle, n]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div style={simWrap}>
      <div style={simTitle}>🔬 Glass Slab — Lateral Displacement Lab</div>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: 340 }} />
      <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #1e2d45",
        display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
        <div>
          <div style={labelStyle}>Angle of Incidence (∠i)</div>
          <input type="range" min={1} max={75} value={angle}
            onChange={e => setAngle(+e.target.value)}
            style={{ width: 140, accentColor: "#fbbf24" }} />
          <span style={{ ...valueStyle, marginLeft: 10 }}>{angle}°</span>
        </div>
        <div>
          <div style={labelStyle}>Refractive Index (n)</div>
          <input type="range" min={1.2} max={2.4} step={0.05} value={n}
            onChange={e => setN(+e.target.value)}
            style={{ width: 120, accentColor: "#60a5fa" }} />
          <span style={{ ...valueStyle, color: "#60a5fa", marginLeft: 10 }}>{n.toFixed(2)}</span>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ display: "flex", gap: 20 }}>
            <div>
              <div style={labelStyle}>∠Refraction (∠r)</div>
              <div style={valueStyle}>{refAngle}°</div>
            </div>
            <div>
              <div style={labelStyle}>Lateral Displacement</div>
              <div style={{ ...valueStyle, color: "#f43f5e" }}>{lateral} cm</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 2. SNELL'S LAW CALCULATOR
 *    Drag the ray at the air-water boundary. Real-time n, angles, and speed.
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_snell_calculator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState(false);
  const [incident, setIncident] = useState(40);
  const [medium, setMedium]     = useState<"water" | "glass" | "diamond">("glass");

  const MEDIA: Record<string, { n: number; label: string; color: string; speed: string }> = {
    water:   { n: 1.33, label: "Water",   color: "#38bdf8", speed: "2.26 × 10⁸" },
    glass:   { n: 1.52, label: "Glass",   color: "#a78bfa", speed: "1.97 × 10⁸" },
    diamond: { n: 2.42, label: "Diamond", color: "#34d399", speed: "1.24 × 10⁸" },
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H);

    const mid = H / 2;
    const cx  = W / 2;
    const m   = MEDIA[medium];

    /* Upper region — Air */
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    ctx.fillRect(0, 0, W, mid);
    ctx.fillStyle = "rgba(56,189,248,0.05)";
    ctx.fillRect(0, mid, W, H - mid);

    /* Interface line */
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(W, mid); ctx.stroke();

    /* Labels */
    ctx.font = "bold 13px 'Inter', sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("AIR  (n₁ = 1.00)", 18, 30);
    ctx.fillStyle = m.color;
    ctx.fillText(`${m.label.toUpperCase()}  (n₂ = ${m.n})`, 18, mid + 30);

    /* Normal */
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, 20); ctx.lineTo(cx, H - 20); ctx.stroke();
    ctx.setLineDash([]);

    /* Physics */
    const i_rad = (incident * Math.PI) / 180;
    const sin_r = (1.0 * Math.sin(i_rad)) / m.n;
    const clamped = Math.max(-1, Math.min(1, sin_r));
    const r_rad = Math.asin(clamped);
    const r_deg = parseFloat(((r_rad * 180) / Math.PI).toFixed(1));

    /* Incident ray */
    const iLen = Math.min(mid - 10, 140);
    const iX = cx - Math.sin(i_rad) * iLen;
    const iY = mid - Math.cos(i_rad) * iLen;
    drawArrow(ctx, iX, iY, cx, mid, "#fbbf24", 2.5);

    /* Refracted ray */
    const rLen = 140;
    const rX = cx + Math.sin(r_rad) * rLen;
    const rY = mid + Math.cos(r_rad) * rLen;
    drawArrow(ctx, cx, mid, rX, rY, m.color, 2.5);

    /* Angle labels */
    ctx.font = "bold 13px 'Inter', sans-serif";
    ctx.fillStyle = "#fbbf24";
    ctx.fillText(`θ₁ = ${incident}°`, cx - 95, mid - 50);
    ctx.fillStyle = m.color;
    ctx.fillText(`θ₂ = ${r_deg}°`, cx + 12, mid + 55);

    /* Angle arcs */
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, mid, 35, -Math.PI / 2, -Math.PI / 2 + i_rad, false);
    ctx.stroke();
    ctx.strokeStyle = m.color;
    ctx.beginPath();
    ctx.arc(cx, mid, 35, Math.PI / 2 - r_rad, Math.PI / 2, false);
    ctx.stroke();

    /* Info box */
    const bx = W - 180, by = 15, bw = 165, bh = 80;
    ctx.fillStyle = "rgba(10,18,35,0.9)";
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 10);
    ctx.fill();
    ctx.strokeStyle = "rgba(129,140,248,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.font = "11px 'Inter', sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Snell's Law: n₁ sin θ₁ = n₂ sin θ₂", bx + 10, by + 20);
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`sin ${incident}° / sin ${r_deg}° = ${m.n}`, bx + 10, by + 40);
    ctx.fillStyle = "#818cf8";
    ctx.fillText(`Speed in ${m.label}: ${m.speed} m/s`, bx + 10, by + 60);

  }, [incident, medium]);

  useEffect(() => { draw(); }, [draw]);

  /* Drag on canvas to change angle */
  const handleMouse = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging && e.type !== "mousedown") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx   = canvas.clientWidth / 2;
    const cy   = canvas.clientHeight / 2;
    const dx   = e.clientX - rect.left - cx;
    const dy   = cy - (e.clientY - rect.top);
    if (dy <= 0 && e.type !== "mousedown") return;
    const a = Math.atan2(Math.abs(dx), Math.abs(dy)) * 180 / Math.PI;
    setIncident(Math.max(1, Math.min(80, Math.round(a))));
  }, [dragging]);

  return (
    <div style={simWrap}>
      <div style={simTitle}>📐 Snell's Law — Interactive Calculator</div>
      <canvas
        ref={canvasRef}
        onMouseDown={e => { setDragging(true); handleMouse(e); }}
        onMouseMove={handleMouse}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        style={{ display: "block", width: "100%", height: 340, cursor: "crosshair" }}
      />
      <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #1e2d45",
        display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
        <div>
          <div style={labelStyle}>Drag canvas to change angle · or</div>
          <input type="range" min={1} max={80} value={incident}
            onChange={e => setIncident(+e.target.value)}
            style={{ width: 140, accentColor: "#fbbf24" }} />
          <span style={{ ...valueStyle, marginLeft: 10 }}>θ₁ = {incident}°</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["water", "glass", "diamond"] as const).map(m => (
            <button key={m}
              onClick={() => setMedium(m)}
              style={{
                padding: "6px 14px", borderRadius: 8, border: "1px solid",
                borderColor: medium === m ? MEDIA[m].color : "rgba(255,255,255,0.1)",
                background: medium === m ? `${MEDIA[m].color}20` : "transparent",
                color: medium === m ? MEDIA[m].color : "#64748b",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}>{MEDIA[m].label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 3. MIRROR RAY TRACER
 *    Drag the object position. See all 3 principal rays + image for
 *    both concave and convex mirrors. Live position/size/nature readout.
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_mirror_ray_tracer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objDist, setObjDist] = useState(30); /* object distance in cm */
  const [type, setType]       = useState<"concave" | "convex">("concave");
  const F = 15; /* focal length in cm */

  /* Physics using sign convention: u=-objDist, f = concave:-F, convex:+F */
  const f  = type === "concave" ? -F : F;
  const u  = -objDist;
  /* 1/v = 1/f - 1/u */
  const invV = (1 / f) - (1 / u);
  const v  = Math.abs(invV) > 0.0001 ? (1 / invV) : Infinity;
  const m  = isFinite(v) ? -(v / u) : Infinity;

  const imgDist = isFinite(v) ? Math.abs(v).toFixed(1) : "∞";
  const imgNature = !isFinite(v) ? "At ∞"
    : (type === "concave"
        ? (v < 0 ? `Real, Inverted${Math.abs(m) > 1 ? ", Magnified" : Math.abs(m) < 1 ? ", Diminished" : ", Same size"}` : "Virtual, Erect, Magnified")
        : "Virtual, Erect, Diminished");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H);

    const scale = 5;        /* px per cm */
    const cx    = W * 0.55; /* pole position x */
    const cy    = H / 2;

    /* Principal axis */
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.setLineDash([]);

    /* Mirror arc */
    const mColor = type === "concave" ? "#60a5fa" : "#f472b6";
    ctx.strokeStyle = mColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (type === "concave") {
      ctx.arc(cx + F * scale, cy, F * scale, Math.PI * 0.7, Math.PI * 1.3, false);
    } else {
      ctx.arc(cx - F * scale, cy, F * scale, -Math.PI * 0.3, Math.PI * 0.3, false);
    }
    ctx.stroke();

    /* Key points */
    const pts: [number, number, string, string][] = [
      [cx, cy, "P", "#94a3b8"],
      [cx - F * scale, cy, "F", "#fbbf24"],
      [cx - 2 * F * scale, cy, "C", "#f87171"],
    ];
    for (const [px, py, lbl, col] of pts) {
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
      ctx.font = "bold 11px 'Inter', sans-serif";
      ctx.fillText(lbl, px + 5, py - 8);
    }

    /* Object */
    const ox = cx - objDist * scale;
    const oh = 50;
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ox, cy); ctx.lineTo(ox, cy - oh); ctx.stroke();
    /* arrowhead */
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.moveTo(ox, cy - oh);
    ctx.lineTo(ox - 5, cy - oh + 10);
    ctx.lineTo(ox + 5, cy - oh + 10);
    ctx.closePath(); ctx.fill();
    ctx.font = "11px 'Inter', sans-serif";
    ctx.fillStyle = "#fbbf24";
    ctx.fillText("O", ox - 14, cy - oh - 4);

    /* Image (if finite and visible) */
    if (isFinite(v) && isFinite(m)) {
      const ix = cx - v * scale; /* v is signed: negative = in front (real) */
      const ih = Math.min(Math.max(oh * Math.abs(m), 4), 140);
      const imgColor = v < 0 ? "#f87171" : "#a78bfa";
      ctx.strokeStyle = imgColor;
      ctx.lineWidth   = 2;
      ctx.setLineDash(v > 0 ? [4, 3] : []);
      ctx.beginPath(); ctx.moveTo(ix, cy); ctx.lineTo(ix, cy - ih * Math.sign(m)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = imgColor;
      ctx.beginPath();
      const tipY = cy - ih * Math.sign(m);
      ctx.moveTo(ix, tipY);
      ctx.lineTo(ix - 5, tipY + 10 * Math.sign(m));
      ctx.lineTo(ix + 5, tipY + 10 * Math.sign(m));
      ctx.closePath(); ctx.fill();
      ctx.fillText("I", ix - 14, cy - ih * Math.sign(m) - 4);
    }

    /* Info box */
    const bx = 14, by = 14, bw = 200, bh = 95;
    ctx.fillStyle = "rgba(10,18,35,0.9)";
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 10); ctx.fill();
    ctx.strokeStyle = "rgba(129,140,248,0.15)"; ctx.lineWidth = 1; ctx.stroke();
    ctx.font = "bold 12px 'Inter', sans-serif";
    ctx.fillStyle = mColor;
    ctx.fillText(`${type === "concave" ? "Concave" : "Convex"} Mirror  f = ${F} cm`, bx + 12, by + 20);
    ctx.font = "11px 'Inter', sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`Object distance: u = ${objDist} cm`, bx + 12, by + 40);
    ctx.fillText(`Image distance: v = ${isFinite(v) ? v.toFixed(1) : "∞"} cm`, bx + 12, by + 58);
    ctx.fillText(`Magnification: m = ${isFinite(m) ? m.toFixed(2) : "∞"}`, bx + 12, by + 76);

  }, [objDist, type, v, m]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div style={simWrap}>
      <div style={simTitle}>🔭 Mirror Ray Tracer — Concave / Convex</div>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: 340 }} />
      <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #1e2d45",
        display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
        <div>
          <div style={labelStyle}>Object Distance (cm)</div>
          <input type="range" min={3} max={65} value={objDist}
            onChange={e => setObjDist(+e.target.value)}
            style={{ width: 150, accentColor: "#fbbf24" }} />
          <span style={{ ...valueStyle, marginLeft: 8 }}>u = {objDist} cm</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["concave", "convex"] as const).map(t => (
            <button key={t} onClick={() => setType(t)} style={{
              padding: "6px 14px", borderRadius: 8, border: "1px solid",
              borderColor: type === t ? (t === "concave" ? "#60a5fa" : "#f472b6") : "rgba(255,255,255,0.1)",
              background: type === t ? `${t === "concave" ? "#60a5fa" : "#f472b6"}20` : "transparent",
              color: type === t ? (t === "concave" ? "#60a5fa" : "#f472b6") : "#64748b",
              fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif",
            }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <div style={labelStyle}>Image</div>
          <div style={{ ...valueStyle, color: "#f87171", fontSize: 12 }}>
            {imgDist} cm · {imgNature}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 4. LENS RAY TRACER
 *    Drag object position for convex/concave lens. Real-time image formation.
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_lens_ray_tracer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objDist, setObjDist] = useState(25);
  const [type, setType]       = useState<"convex" | "concave">("convex");
  const F = 15;

  /* Lens formula: 1/v - 1/u = 1/f, u is negative */
  const f   = type === "convex" ? F : -F;
  const u   = -objDist;
  /* 1/v = 1/f + 1/u */
  const invV = (1 / f) + (1 / u);
  const v   = Math.abs(invV) > 0.0001 ? (1 / invV) : Infinity;
  const mag = isFinite(v) ? v / u : Infinity;

  const nature = !isFinite(v) ? "Image at ∞"
    : (v > 0
        ? `Real, Inverted${Math.abs(mag) > 1.05 ? ", Magnified" : Math.abs(mag) < 0.95 ? ", Diminished" : ", Same size"}`
        : "Virtual, Erect, Magnified");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H);

    const scale = 5;
    const lx    = W / 2;
    const cy    = H / 2;
    const lh    = 120; /* lens height */

    /* Principal axis */
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.setLineDash([]);

    /* Lens */
    const lColor = type === "convex" ? "#a78bfa" : "#fb923c";
    ctx.strokeStyle = lColor;
    ctx.lineWidth = 3;
    if (type === "convex") {
      /* Double convex shape */
      ctx.beginPath();
      ctx.arc(lx - 25, cy, 30, -Math.PI / 3, Math.PI / 3, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(lx + 25, cy, 30, Math.PI - Math.PI / 3, Math.PI + Math.PI / 3, true);
      ctx.stroke();
    } else {
      /* Concave lens */
      ctx.beginPath();
      ctx.arc(lx + 22, cy, 30, Math.PI * 0.67, Math.PI * 1.33, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(lx - 22, cy, 30, -Math.PI * 0.33, Math.PI * 0.33, false);
      ctx.stroke();
    }
    /* Lens line */
    ctx.strokeStyle = `${lColor}55`;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(lx, cy - lh); ctx.lineTo(lx, cy + lh); ctx.stroke();

    /* Focus points */
    const f1x = lx - F * scale;
    const f2x = lx + F * scale;
    for (const [px, lbl] of [[f1x, "F₁"], [f2x, "F₂"], [lx - 2 * F * scale, "2F₁"], [lx + 2 * F * scale, "2F₂"]]) {
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath(); ctx.arc(px as number, cy, 3, 0, Math.PI * 2); ctx.fill();
      ctx.font = "11px 'Inter', sans-serif";
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(lbl as string, (px as number) - 7, cy - 10);
    }

    /* Object */
    const ox = lx + u * scale; /* u is negative so ox is to the left */
    const oh = 50;
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ox, cy); ctx.lineTo(ox, cy - oh); ctx.stroke();
    ctx.fillStyle = "#22d3ee";
    ctx.beginPath();
    ctx.moveTo(ox, cy - oh);
    ctx.lineTo(ox - 5, cy - oh + 10);
    ctx.lineTo(ox + 5, cy - oh + 10);
    ctx.closePath(); ctx.fill();
    ctx.font = "11px 'Inter', sans-serif";
    ctx.fillText("O", ox - 14, cy - oh - 4);

    /* Image */
    if (isFinite(v) && isFinite(mag) && Math.abs(v) < 120) {
      const ix = lx + v * scale;
      const ih = Math.min(Math.max(oh * Math.abs(mag), 4), 130);
      const imgColor = v > 0 ? "#f43f5e" : "#c084fc";
      ctx.strokeStyle = imgColor;
      ctx.lineWidth   = 2;
      ctx.setLineDash(v < 0 ? [4, 3] : []);
      ctx.beginPath(); ctx.moveTo(ix, cy); ctx.lineTo(ix, cy - ih * Math.sign(mag)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = imgColor;
      ctx.beginPath();
      const tipY = cy - ih * Math.sign(mag);
      ctx.moveTo(ix, tipY);
      ctx.lineTo(ix - 5, tipY + 10 * Math.sign(mag));
      ctx.lineTo(ix + 5, tipY + 10 * Math.sign(mag));
      ctx.closePath(); ctx.fill();
      ctx.fillText("I", ix + 6, cy - ih * Math.sign(mag) - 4);
    }

    /* Info */
    const bx = 12, by = 12, bw = 200, bh = 80;
    ctx.fillStyle = "rgba(10,18,35,0.9)";
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 10); ctx.fill();
    ctx.strokeStyle = "rgba(129,140,248,0.15)"; ctx.lineWidth = 1; ctx.stroke();
    ctx.font = "bold 12px 'Inter', sans-serif";
    ctx.fillStyle = lColor;
    ctx.fillText(`${type === "convex" ? "Convex" : "Concave"} Lens  f = ${type === "convex" ? "+" : "-"}${F} cm`, bx + 12, by + 20);
    ctx.font = "11px 'Inter', sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`u = ${u} cm  →  v = ${isFinite(v) ? v.toFixed(1) : "∞"} cm`, bx + 12, by + 40);
    ctx.fillText(`m = ${isFinite(mag) ? mag.toFixed(2) : "∞"}  ·  ${nature}`, bx + 12, by + 60);

  }, [objDist, type, v, mag, nature, u]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div style={simWrap}>
      <div style={simTitle}>🔬 Lens Ray Tracer — Convex / Concave</div>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: 340 }} />
      <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #1e2d45",
        display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
        <div>
          <div style={labelStyle}>Object Distance</div>
          <input type="range" min={3} max={65} value={objDist}
            onChange={e => setObjDist(+e.target.value)}
            style={{ width: 140, accentColor: "#22d3ee" }} />
          <span style={{ ...valueStyle, color: "#22d3ee", marginLeft: 8 }}>{objDist} cm</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["convex", "concave"] as const).map(t => (
            <button key={t} onClick={() => setType(t)} style={{
              padding: "6px 14px", borderRadius: 8, border: "1px solid",
              borderColor: type === t ? (t === "convex" ? "#a78bfa" : "#fb923c") : "rgba(255,255,255,0.1)",
              background: type === t ? `${t === "convex" ? "#a78bfa" : "#fb923c"}20` : "transparent",
              color: type === t ? (t === "convex" ? "#a78bfa" : "#fb923c") : "#64748b",
              fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif",
            }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 5. TIR EXPLORER
 *    Drag the angle towards critical angle. See the light go from refracted
 *    to partial TIR to full TIR with dramatic visual effects.
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_tir_explorer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle]  = useState(30);
  const [medium, setMedium] = useState<"water" | "glass" | "diamond">("glass");

  const N: Record<string, number> = { water: 1.33, glass: 1.5, diamond: 2.42 };
  const n      = N[medium];
  const critRad = Math.asin(1 / n);
  const critDeg = parseFloat(((critRad * 180) / Math.PI).toFixed(1));
  const isTIR  = angle >= critDeg;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H);

    const cy = H * 0.45;
    const cx = W / 2;

    /* Dense medium */
    const medG = ctx.createLinearGradient(0, cy, 0, H);
    medG.addColorStop(0, "rgba(56,189,248,0.15)");
    medG.addColorStop(1, "rgba(56,189,248,0.05)");
    ctx.fillStyle = medG;
    ctx.fillRect(0, cy, W, H - cy);

    /* Interface */
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();

    /* Normal */
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(cx, cy - 80); ctx.lineTo(cx, cy + 100); ctx.stroke();
    ctx.setLineDash([]);

    /* Labels */
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("AIR (rarer)", 14, cy - 12);
    ctx.fillStyle = "#38bdf8";
    ctx.fillText(`${medium.toUpperCase()} n=${n} (denser)`, 14, cy + 22);

    /* Incident ray in dense medium (coming up from below) */
    const i_rad = (angle * Math.PI) / 180;
    const iLen  = 120;
    const iEndX = cx + Math.sin(i_rad) * iLen;
    const iEndY = cy + Math.cos(i_rad) * iLen;
    drawArrow(ctx, iEndX, iEndY, cx, cy, "#60a5fa", 2.5);

    /* Reflected ray (always present) */
    const rEndX = cx - Math.sin(i_rad) * 100;
    const rEndY = cy + Math.cos(i_rad) * 100;
    const reflOpacity = isTIR ? 1.0 : 0.4;
    ctx.save();
    ctx.globalAlpha = reflOpacity;
    drawArrow(ctx, cx, cy, rEndX, rEndY, "#f87171", 2.5);
    ctx.restore();

    /* Refracted ray (disappears at TIR) */
    if (!isTIR) {
      const sin_r = n * Math.sin(i_rad);
      const r_rad = Math.asin(Math.min(1, sin_r));
      const tX    = cx + Math.sin(r_rad) * 100;
      const tY    = cy - Math.cos(r_rad) * 100;
      drawArrow(ctx, cx, cy, tX, tY, "#fbbf24", 2.5);
      ctx.font = "11px 'Inter', sans-serif";
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(`θ₂ = ${((r_rad * 180) / Math.PI).toFixed(1)}°`, cx + 12, cy - 50);
    }

    /* TIR flash effect */
    if (isTIR) {
      ctx.save();
      ctx.globalAlpha = 0.15;
      const flash = ctx.createRadialGradient(cx, cy, 0, cx, cy, 150);
      flash.addColorStop(0, "#f43f5e");
      flash.addColorStop(1, "transparent");
      ctx.fillStyle = flash;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      ctx.font = "bold 15px 'Inter', sans-serif";
      ctx.fillStyle = "#f43f5e";
      ctx.fillText("⚡ TOTAL INTERNAL REFLECTION!", cx - 155, 28);
    }

    /* Angle labels */
    ctx.font = "bold 12px 'Inter', sans-serif";
    ctx.fillStyle = "#60a5fa";
    ctx.fillText(`θ₁ = ${angle}°`, cx - 90, cy + 50);

    /* Status bar */
    const ratio = Math.min(angle / critDeg, 1);
    const barW  = W - 40;
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath(); ctx.roundRect(20, H - 28, barW, 12, 6); ctx.fill();
    const barColor = isTIR ? "#f43f5e" : `rgba(96,165,250,${0.4 + 0.6 * ratio})`;
    ctx.fillStyle = barColor;
    ctx.beginPath(); ctx.roundRect(20, H - 28, barW * ratio, 12, 6); ctx.fill();
    ctx.font = "10px 'Inter', sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Critical angle: ${critDeg}°`, 20, H - 34);

  }, [angle, medium, n, critDeg, isTIR]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div style={simWrap}>
      <div style={simTitle}>✨ Total Internal Reflection Explorer</div>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: 340 }} />
      <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #1e2d45",
        display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
        <div>
          <div style={labelStyle}>Angle of Incidence (in dense medium)</div>
          <input type="range" min={1} max={88} value={angle}
            onChange={e => setAngle(+e.target.value)}
            style={{ width: 150, accentColor: isTIR ? "#f43f5e" : "#60a5fa" }} />
          <span style={{ ...valueStyle, color: isTIR ? "#f43f5e" : "#60a5fa", marginLeft: 8 }}>{angle}°</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["water", "glass", "diamond"] as const).map(m => (
            <button key={m} onClick={() => setMedium(m)} style={{
              padding: "5px 12px", borderRadius: 8, border: "1px solid",
              borderColor: medium === m ? "#60a5fa" : "rgba(255,255,255,0.1)",
              background: medium === m ? "rgba(96,165,250,0.1)" : "transparent",
              color: medium === m ? "#60a5fa" : "#64748b",
              fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif",
            }}>{m.charAt(0).toUpperCase() + m.slice(1)}</button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={labelStyle}>Critical Angle</div>
          <div style={{ ...valueStyle, color: "#fbbf24" }}>{critDeg}°</div>
        </div>
        <div>
          <div style={labelStyle}>Status</div>
          <div style={{ ...valueStyle, color: isTIR ? "#f43f5e" : "#34d399", fontSize: 12 }}>
            {isTIR ? "🔴 TIR occurring" : "🟢 Refraction + partial reflection"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 6. PRISM SPECTRUM DISPERSION
 *    Animated white light entering a prism splits into a rainbow.
 *    Shows VIBGYOR with different refractive indices for each colour.
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_spectrum_prism() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const tRef      = useRef(0);

  /* Spectral colours with approximate refractive indices for crown glass */
  const COLORS = [
    { name: "Violet", n: 1.538, hex: "#8b5cf6", wavelength: "~400 nm" },
    { name: "Indigo", n: 1.535, hex: "#6366f1", wavelength: "~445 nm" },
    { name: "Blue",   n: 1.530, hex: "#3b82f6", wavelength: "~470 nm" },
    { name: "Green",  n: 1.526, hex: "#22c55e", wavelength: "~520 nm" },
    { name: "Yellow", n: 1.523, hex: "#eab308", wavelength: "~580 nm" },
    { name: "Orange", n: 1.520, hex: "#f97316", wavelength: "~600 nm" },
    { name: "Red",    n: 1.515, hex: "#ef4444", wavelength: "~700 nm" },
  ];

  const draw = useCallback((t: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H);

    /* Prism vertices */
    const px = W * 0.42, py = H * 0.12;
    const pl = W * 0.18, pr = W * 0.66;
    const pb = H * 0.78;
    const prism = [[px, py], [pr, pb], [pl, pb]] as [number, number][];

    /* Prism fill */
    const prismG = ctx.createLinearGradient(pl, pb, px, py);
    prismG.addColorStop(0, "rgba(56,189,248,0.08)");
    prismG.addColorStop(1, "rgba(129,140,248,0.15)");
    ctx.fillStyle = prismG;
    ctx.beginPath();
    ctx.moveTo(...prism[0]);
    ctx.lineTo(...prism[1]);
    ctx.lineTo(...prism[2]);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(56,189,248,0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    /* Incident white beam — animated width pulse */
    const pulse = 0.85 + 0.15 * Math.sin(t * 0.04);
    const beamY   = py + (pb - py) * 0.35;
    const entryX  = pl + (pr - pl) * 0.15 + (beamY - py) / (pb - py) * (pr - pl) * 0.85;
    const beamW   = 10 * pulse;
    const beamSrcX = 50;

    /* White beam glow */
    const wg = ctx.createLinearGradient(beamSrcX, beamY, entryX, beamY);
    wg.addColorStop(0, "rgba(255,255,255,0)");
    wg.addColorStop(0.6, "rgba(255,255,255,0.6)");
    wg.addColorStop(1,   "rgba(255,255,255,0.9)");
    ctx.fillStyle = wg;
    ctx.beginPath();
    ctx.moveTo(beamSrcX, beamY - beamW);
    ctx.lineTo(entryX,   beamY - beamW * 0.3);
    ctx.lineTo(entryX,   beamY + beamW * 0.3);
    ctx.lineTo(beamSrcX, beamY + beamW);
    ctx.fill();

    /* Refracted rays — one per colour, fanning out */
    const exitBaseX = px + (pr - px) * 0.55;
    const exitBaseY = (py + pb) / 2 + 20;

    const spreadAnim = 0.9 + 0.1 * Math.sin(t * 0.03);

    COLORS.forEach((c, i) => {
      /* Angle spread based on n value (violet bends more, red less) */
      const spread = (c.n - 1.515) * 2000 * spreadAnim;
      const exitAngle = Math.PI * 0.38 + (i / (COLORS.length - 1)) * 0.18;
      const exitX = exitBaseX + Math.cos(exitAngle) * 120;
      const exitY = exitBaseY - Math.sin(exitAngle) * 120;

      /* Inside prism ray */
      ctx.globalAlpha = 0.5;
      drawArrow(ctx, entryX, beamY, exitBaseX + i * 2.5, exitBaseY - i * 2, c.hex, 1.2);
      ctx.globalAlpha = 1;

      /* Outside emergent ray */
      const angle2 = exitAngle + (i - 3) * 0.045;
      const ex2 = exitBaseX + Math.cos(angle2) * 240;
      const ey2 = exitBaseY - Math.sin(angle2) * 240;

      /* Glow effect */
      ctx.save();
      ctx.shadowColor = c.hex;
      ctx.shadowBlur  = 6 + 3 * Math.sin(t * 0.05 + i);
      drawArrow(ctx, exitBaseX + i * 2.5, exitBaseY - i * 2, ex2, ey2, c.hex, 2);
      ctx.restore();

      /* Colour label */
      if (ex2 > exitBaseX) {
        ctx.font = "10px 'Inter', sans-serif";
        ctx.fillStyle = c.hex;
        ctx.fillText(`${c.name} (${c.wavelength})`, ex2 + 6, ey2 + 4);
      }
    });

    /* Labels */
    ctx.font = "bold 12px 'Inter', sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("White light", beamSrcX, beamY - 20);
    ctx.font = "11px 'Inter', sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Glass prism (n varies with wavelength)", px - 20, pb + 22);
    ctx.fillText("Violet bends most (highest n) · Red bends least (lowest n)", pl, pb + 38);

  }, []);

  useEffect(() => {
    const animate = () => {
      tRef.current++;
      draw(tRef.current);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [draw]);

  return (
    <div style={simWrap}>
      <div style={simTitle}>🌈 Prism Dispersion — White Light → VIBGYOR Spectrum</div>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: 340 }} />
      <div style={{ padding: "10px 20px 14px", borderTop: "1px solid #1e2d45",
        display: "flex", flexWrap: "wrap", gap: 12 }}>
        {COLORS.map(c => (
          <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.hex }} />
            <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'Inter', sans-serif" }}>
              {c.name} · n={c.n}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
