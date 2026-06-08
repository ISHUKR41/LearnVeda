"use client";
/**
 * FILE: LightTopic3Simulations.tsx
 * LOCATION: src/components/simulations/LightTopic3Simulations.tsx
 * PURPOSE: 4 interactive canvas simulations for Class 10 Light — Topic 3:
 *          Mirror Formula and Magnification.
 *
 * SIMULATIONS:
 *   1. Sim_light_mirror_formula_calc  — live mirror formula calculator with ray diagram
 *   2. Sim_light_magnification_demo   — animated magnification visualization
 *   3. Sim_light_sign_convention      — New Cartesian sign convention diagram
 *   4. Sim_light_mirror_ray_builder   — step-by-step ray diagram construction
 *
 * LAST UPDATED: 2026-06-08
 */

import React, { useRef, useEffect, useState } from "react";

function setupCanvas(
  canvas: HTMLCanvasElement,
): [CanvasRenderingContext2D, number, number] | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth || 560;
  const H = canvas.clientHeight || 320;
  if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
    canvas.width = W * dpr;
    canvas.height = H * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return [ctx, W, H];
}

function drawDarkBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#050c18");
  g.addColorStop(1, "#0a1628");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(99,102,241,0.04)";
  for (let x = 0; x <= W; x += 40)
    for (let y = 0; y <= H; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
}

function drawRayLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, glow = 6, lw = 1.8,
) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = glow;
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len > 8) {
    const ux = dx / len, uy = dy / len, ah = 10;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - ah * (ux - 0.4 * uy), y2 - ah * (uy + 0.4 * ux));
    ctx.lineTo(x2 - ah * (ux + 0.4 * uy), y2 - ah * (uy - 0.4 * ux));
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function lbl(
  ctx: CanvasRenderingContext2D,
  t: string, x: number, y: number,
  color = "#e2e8f0", size = 11, bold = false,
) {
  ctx.save();
  ctx.font = `${bold ? "bold " : ""}${size}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = color;
  ctx.fillText(t, x, y);
  ctx.restore();
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 1: Mirror Formula Calculator
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_mirror_formula_calc() {
  /* f fixed; u is user-controlled (object distance from mirror, cm) */
  const [f, setF] = useState(15); /* focal length in cm */
  const [u, setU] = useState(40); /* object distance in cm */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const compute = () => {
    /* Mirror formula: 1/f = 1/v + 1/u */
    /* New Cartesian sign: object left of mirror → u = negative */
    /* For concave mirror: f = negative (focus in front of mirror) */
    /* Simplified: using magnitude convention here for clarity in display */
    /* Using: 1/v = 1/f - 1/(-u) = 1/f + 1/u for concave where f, u both positive magnitudes */
    /* Real formula: 1/v = 1/f - 1/u → v = uf/(u-f) */
    const v = (u * f) / (u - f);
    const m = -(v / u); /* m = -v/u */
    return { v: isFinite(v) ? v : Infinity, m: isFinite(m) ? m : Infinity };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;
    drawDarkBg(ctx, W, H);

    const { v, m } = compute();
    const scale = 1.2; /* px per cm */
    const axisY = H / 2 + 10;
    const poleX = W * 0.72;
    const fPx = f * scale;
    const F_x = poleX - fPx;
    const C_x = poleX - 2 * fPx;

    /* Axis */
    ctx.save();
    ctx.strokeStyle = "rgba(100,116,139,0.35)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(20, axisY);
    ctx.lineTo(W - 20, axisY);
    ctx.stroke();
    ctx.restore();

    /* Mirror arc */
    ctx.save();
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#3b82f6";
    ctx.shadowBlur = 10;
    const R = 2 * fPx;
    const halfA = Math.asin(Math.min(1, 80 / R));
    ctx.beginPath();
    ctx.arc(poleX + R, axisY, R, Math.PI - halfA, Math.PI + halfA);
    ctx.stroke();
    ctx.restore();

    /* Mark P, F, C */
    for (const [px, lb, c] of [
      [poleX, "P", "#60a5fa"],
      [F_x, "F", "#f97316"],
      [C_x, "C", "#a78bfa"],
    ] as [number, string, string][]) {
      ctx.save();
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(px, axisY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      lbl(ctx, lb, px - 4, axisY + 14, c, 10, true);
    }

    /* Object arrow */
    const uPx = u * scale;
    const objX = poleX - uPx;
    const objH = 55;
    if (objX > 20) {
      ctx.save();
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(objX, axisY);
      ctx.lineTo(objX, axisY - objH);
      ctx.stroke();
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.moveTo(objX, axisY - objH);
      ctx.lineTo(objX - 5, axisY - objH + 10);
      ctx.lineTo(objX + 5, axisY - objH + 10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      lbl(ctx, "A (object tip)", objX - 50, axisY - objH - 10, "#fbbf24", 9, true);
    }

    /* Image arrow */
    if (isFinite(v) && v > 0 && v < 250 / scale) {
      const vPx = v * scale;
      const imgX = poleX - vPx;
      const imgH = Math.abs(m) * objH;
      const imgTopY = m > 0 ? axisY - imgH : axisY - imgH; /* always inverted for real */

      if (imgX > 20) {
        ctx.save();
        ctx.strokeStyle = "#f87171";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 8;
        if (v < 0) ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(imgX, axisY);
        ctx.lineTo(imgX, imgTopY);
        ctx.stroke();
        ctx.fillStyle = "#f87171";
        ctx.beginPath();
        ctx.moveTo(imgX, imgTopY);
        ctx.lineTo(imgX - 5, imgTopY + 10);
        ctx.lineTo(imgX + 5, imgTopY + 10);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        lbl(ctx, "A' (image)", imgX - 30, imgTopY - 10, "#f87171", 9, true);
      }
    }

    /* Ray from object tip to pole */
    if (objX > 20) {
      drawRayLine(ctx, objX, axisY - 55, poleX, axisY - 55, "#f472b6", 6, 1.5);
    }

    /* Formula box */
    const bx = 12, by = 10;
    ctx.save();
    ctx.fillStyle = "rgba(15,23,42,0.92)";
    ctx.strokeStyle = "#1e3a5f";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect?.(bx, by, 230, 120, 8);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    lbl(ctx, "Mirror Formula: 1/f = 1/v + 1/u", bx + 8, by + 18, "#60a5fa", 11, true);
    lbl(ctx, `f = ${f} cm   u = −${u} cm (sign conv.)`, bx + 8, by + 36, "#94a3b8", 10);
    const vLabel = isFinite(v) ? `v = ${v > 0 ? "−" : "+"}${Math.abs(v).toFixed(1)} cm` : "v = ∞";
    const nature = !isFinite(v) ? "At Infinity" :
      v > 0 ? (u < f ? "Virtual (behind mirror)" : "Real (in front)") : "Behind mirror";
    lbl(ctx, vLabel, bx + 8, by + 54, "#f87171", 11, true);
    lbl(ctx, nature, bx + 8, by + 70, "#e2e8f0", 10);
    const mLabel = isFinite(m) ? `m = −v/u = ${m.toFixed(2)}` : "m = undefined";
    const mNature = !isFinite(m) ? "" : Math.abs(m) > 1 ? "(Enlarged)" : Math.abs(m) < 1 ? "(Diminished)" : "(Same size)";
    lbl(ctx, mLabel, bx + 8, by + 86, "#34d399", 11, true);
    lbl(ctx, mNature, bx + 8, by + 102, "#94a3b8", 10);
  }, [f, u]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          🔢 Mirror Formula Calculator
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          1/f = 1/v + 1/u — adjust object distance and focal length
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 280, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui", width: 120 }}>Focal length f:</span>
          <input type="range" min={8} max={60} step={1} value={f}
            onChange={e => setF(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#f97316" }} />
          <span style={{ color: "#f97316", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 50 }}>{f} cm</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui", width: 120 }}>Object distance u:</span>
          <input type="range" min={5} max={120} step={1} value={u}
            onChange={e => setU(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#fbbf24" }} />
          <span style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 50 }}>{u} cm</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 2: Magnification Visualizer
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_magnification_demo() {
  const [mag, setMag] = useState(2.0); /* magnification value */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;
    drawDarkBg(ctx, W, H);

    const axisY = H * 0.72;
    const midX = W / 2;

    /* Object on left */
    const objX = midX - 160;
    const objH = 60;
    ctx.save();
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(objX, axisY);
    ctx.lineTo(objX, axisY - objH);
    ctx.stroke();
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.moveTo(objX, axisY - objH);
    ctx.lineTo(objX - 6, axisY - objH + 12);
    ctx.lineTo(objX + 6, axisY - objH + 12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    lbl(ctx, "Object", objX - 22, axisY - objH - 14, "#fbbf24", 10, true);
    lbl(ctx, `h = ${objH} px`, objX - 22, axisY - objH - 2, "#fbbf24", 9);

    /* Image on right */
    const imgH = Math.abs(mag) * objH;
    const imgX = midX + 80;
    /* If mag > 0 it's erect, if < 0 it's inverted */
    const imgTopY = mag < 0 ? axisY : axisY - imgH; /* inverted: tip below axis */
    const imgBotY = mag < 0 ? axisY + imgH : axisY;
    const imgColor = mag > 0 ? "#34d399" : "#f87171";
    ctx.save();
    ctx.strokeStyle = imgColor;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = imgColor;
    ctx.shadowBlur = 8;
    ctx.setLineDash(mag < 0 ? [] : [4, 3]);
    ctx.beginPath();
    ctx.moveTo(imgX, imgBotY);
    ctx.lineTo(imgX, imgTopY);
    ctx.stroke();
    ctx.fillStyle = imgColor;
    /* Arrowhead */
    const arrowY = mag < 0 ? imgBotY : imgTopY;
    const arrowDir = mag < 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(imgX, arrowY);
    ctx.lineTo(imgX - 6, arrowY + arrowDir * 12);
    ctx.lineTo(imgX + 6, arrowY + arrowDir * 12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    const imgLabel = mag > 0 ? "Virtual (erect)" : "Real (inverted)";
    lbl(ctx, imgLabel, imgX - 35, Math.min(imgTopY, imgBotY) - 14, imgColor, 10, true);
    lbl(ctx, `h' = ${imgH.toFixed(0)} px`, imgX - 35, Math.min(imgTopY, imgBotY) - 2, imgColor, 9);

    /* Axis */
    ctx.save();
    ctx.strokeStyle = "rgba(100,116,139,0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(20, axisY);
    ctx.lineTo(W - 20, axisY);
    ctx.stroke();
    ctx.restore();

    /* Mirror symbol in middle */
    ctx.save();
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#3b82f6";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(midX - 5, axisY - 80);
    ctx.lineTo(midX - 5, axisY + 80);
    ctx.stroke();
    ctx.restore();
    lbl(ctx, "Mirror", midX + 4, axisY - 85, "#60a5fa", 9);

    /* Formula */
    const mSign = mag < 0 ? "−" : "+";
    lbl(ctx, "Magnification m = −v/u = h'/h", W / 2 - 100, 22, "#60a5fa", 11, true);
    lbl(ctx, `m = ${mSign}${Math.abs(mag).toFixed(1)}`, W / 2 - 30, 42, "#ffffff", 16, true);
    const mDesc = Math.abs(mag) > 1.05 ? "ENLARGED" : Math.abs(mag) < 0.95 ? "DIMINISHED" : "SAME SIZE";
    const mDescColor = Math.abs(mag) > 1.05 ? "#34d399" : Math.abs(mag) < 0.95 ? "#f87171" : "#fbbf24";
    lbl(ctx, mDesc, W / 2 - 35, 60, mDescColor, 13, true);
    const eLine = mag < 0 ? "Real + Inverted" : "Virtual + Erect";
    lbl(ctx, eLine, W / 2 - 50, 78, "#94a3b8", 10);
  }, [mag]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          🔍 Magnification — Visual Demo
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          m = h'/h = −v/u — drag to see enlarged/diminished/inverted images
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 280, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid #1e293b" }}>
        <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui" }}>m value:</span>
        <input type="range" min={-3} max={3} step={0.1} value={mag}
          onChange={e => setMag(Number(e.target.value))}
          style={{ flex: 1, accentColor: "#a78bfa" }} />
        <span style={{ color: "#a78bfa", fontSize: 14, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 50 }}>
          {mag > 0 ? "+" : ""}{mag.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 3: New Cartesian Sign Convention
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_sign_convention() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;
    drawDarkBg(ctx, W, H);

    const ox = W / 2;  /* origin = pole of mirror */
    const oy = H / 2;  /* y-axis center */

    /* Draw X-Y axes with arrows */
    /* X-axis (principal axis) */
    ctx.save();
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(20, oy);
    ctx.lineTo(W - 20, oy);
    ctx.stroke();
    /* Y-axis */
    ctx.beginPath();
    ctx.moveTo(ox, 15);
    ctx.lineTo(ox, H - 15);
    ctx.stroke();
    ctx.restore();

    /* Axis arrowheads and labels */
    ctx.save();
    ctx.fillStyle = "#475569";
    /* Right arrowhead */
    ctx.beginPath();
    ctx.moveTo(W - 20, oy);
    ctx.lineTo(W - 30, oy - 5);
    ctx.lineTo(W - 30, oy + 5);
    ctx.closePath();
    ctx.fill();
    /* Up arrowhead */
    ctx.beginPath();
    ctx.moveTo(ox, 15);
    ctx.lineTo(ox - 5, 25);
    ctx.lineTo(ox + 5, 25);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    lbl(ctx, "+x (right of mirror)", W - 120, oy - 10, "#475569", 9);
    lbl(ctx, "−x (left of mirror)", 20, oy - 10, "#475569", 9);
    lbl(ctx, "+y", ox + 6, 28, "#475569", 9);
    lbl(ctx, "−y", ox + 6, H - 18, "#475569", 9);

    /* Mirror at origin (vertical) */
    ctx.save();
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#3b82f6";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(ox, oy - 90);
    ctx.lineTo(ox, oy + 90);
    ctx.stroke();
    ctx.restore();
    lbl(ctx, "Mirror (Pole P = origin)", ox + 8, oy + 102, "#60a5fa", 9, true);

    /* Positive direction: right → */
    ctx.save();
    ctx.fillStyle = "rgba(52,211,153,0.15)";
    ctx.fillRect(ox, oy - 90, W - ox - 20, 180);
    ctx.strokeStyle = "rgba(52,211,153,0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(ox, oy - 90, W - ox - 20, 180);
    ctx.restore();
    lbl(ctx, "POSITIVE DIRECTION →", ox + 10, oy - 96, "#34d399", 10, true);
    lbl(ctx, "(distances to right of mirror)", ox + 10, oy - 84, "#34d399", 9);

    /* Negative direction: left ← */
    ctx.save();
    ctx.fillStyle = "rgba(248,113,113,0.12)";
    ctx.fillRect(20, oy - 90, ox - 20, 180);
    ctx.strokeStyle = "rgba(248,113,113,0.25)";
    ctx.lineWidth = 1;
    ctx.strokeRect(20, oy - 90, ox - 20, 180);
    ctx.restore();
    lbl(ctx, "← NEGATIVE DIRECTION", 28, oy - 96, "#f87171", 10, true);
    lbl(ctx, "(distances to left of mirror)", 28, oy - 84, "#f87171", 9);

    /* Object arrow on left (negative u) */
    const objX = ox - 120;
    ctx.save();
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(objX, oy);
    ctx.lineTo(objX, oy - 55);
    ctx.stroke();
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.moveTo(objX, oy - 55);
    ctx.lineTo(objX - 5, oy - 43);
    ctx.lineTo(objX + 5, oy - 43);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    lbl(ctx, "Object", objX - 20, oy - 68, "#fbbf24", 10, true);

    /* u label with negative sign */
    ctx.save();
    ctx.strokeStyle = "#f87171";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(objX, oy + 20);
    ctx.lineTo(ox, oy + 20);
    ctx.stroke();
    /* Arrowheads */
    ctx.fillStyle = "#f87171";
    ctx.beginPath();
    ctx.moveTo(objX, oy + 20);
    ctx.lineTo(objX + 8, oy + 16);
    ctx.lineTo(objX + 8, oy + 24);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(ox, oy + 20);
    ctx.lineTo(ox - 8, oy + 16);
    ctx.lineTo(ox - 8, oy + 24);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    lbl(ctx, "u = −12 cm  (object always left)", (objX + ox) / 2 - 65, oy + 34, "#f87171", 9, true);

    /* Key rules */
    lbl(ctx, "New Cartesian Sign Convention:", 14, 20, "#f1f5f9", 12, true);
    const rules = [
      "• All distances measured from Pole (P) at origin",
      "• Distances in direction of incident light → POSITIVE",
      "• Distances opposite to incident light → NEGATIVE",
      "• Heights above principal axis → POSITIVE",
      "• Heights below principal axis → NEGATIVE",
      "• Object is always to the LEFT → u is always negative",
      "• Concave mirror: f and R are negative (focus in front)",
      "• Convex mirror: f and R are positive (focus behind)",
    ];
    rules.forEach((r, i) => {
      lbl(ctx, r, 14, 38 + i * 14, i < 2 ? "#e2e8f0" : "#94a3b8", 9);
    });
  }, []);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          📌 New Cartesian Sign Convention
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Origin = Pole of mirror; incident light travels left → right
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 360, display: "block" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 4: Step-by-step Ray Diagram Builder
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_mirror_ray_builder() {
  const [step, setStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const steps = [
    "Setup: Object AB in front of concave mirror",
    "Ray 1: Parallel to axis → reflects through F",
    "Ray 2: Through C (centre) → retraces path",
    "Ray 3: Through F → reflects parallel to axis",
    "Image: Intersection of reflected rays",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;
    drawDarkBg(ctx, W, H);

    const axisY = H / 2 + 10;
    const poleX = W * 0.72;
    const f = 80, R = 160;
    const F_x = poleX - f;
    const C_x = poleX - R;
    const objX = poleX - 220;
    const objH = 60;
    const objTopY = axisY - objH;

    /* Axis */
    ctx.save();
    ctx.strokeStyle = "rgba(100,116,139,0.35)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(20, axisY);
    ctx.lineTo(W - 20, axisY);
    ctx.stroke();
    ctx.restore();

    /* Mirror */
    ctx.save();
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#3b82f6";
    ctx.shadowBlur = 8;
    const halfA = Math.asin(85 / R);
    ctx.beginPath();
    ctx.arc(poleX + R, axisY, R, Math.PI - halfA, Math.PI + halfA);
    ctx.stroke();
    ctx.restore();

    /* Points */
    for (const [px, lb, c] of [
      [poleX, "P", "#60a5fa"],
      [F_x, "F", "#f97316"],
      [C_x, "C", "#a78bfa"],
    ] as [number, string, string][]) {
      ctx.save();
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(px, axisY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      lbl(ctx, lb, px - 4, axisY + 14, c, 10, true);
    }

    /* Object */
    if (step >= 0) {
      ctx.save();
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(objX, axisY);
      ctx.lineTo(objX, objTopY);
      ctx.stroke();
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      ctx.lineTo(objX - 5, objTopY + 10);
      ctx.lineTo(objX + 5, objTopY + 10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      lbl(ctx, "A", objX - 14, objTopY - 8, "#fbbf24", 11, true);
      lbl(ctx, "B", objX - 14, axisY + 16, "#fbbf24", 11, true);
    }

    /* Compute image position: u = 220, f = 80 → v = uf/(u-f) = 220*80/140 = 125.7 */
    const u = 220;
    const v = (u * f) / (u - f); /* ≈ 125.7 */
    const imgX = poleX - v;
    const imgH = (objH * v) / u; /* ≈ 34 */
    const imgTopY = axisY - imgH;

    /* Ray 1: parallel to axis from A → hits mirror at same height → reflects through F */
    if (step >= 1) {
      drawRayLine(ctx, objX, objTopY, poleX, objTopY, "#f472b6", 7, 2);
      /* Reflected: from (poleX, objTopY) through F to image */
      /* Extend beyond image */
      const r1Dir_x = F_x - poleX, r1Dir_y = axisY - objTopY;
      const r1Len = Math.sqrt(r1Dir_x * r1Dir_x + r1Dir_y * r1Dir_y);
      const scale = 200 / r1Len;
      drawRayLine(ctx, poleX, objTopY, poleX + r1Dir_x * scale, objTopY + r1Dir_y * scale, "#f472b6", 7, 2);
      lbl(ctx, "Ray 1 (parallel → through F)", objX, objTopY - 14, "#f472b6", 9, true);
    }

    /* Ray 2: through C → retraces */
    if (step >= 2) {
      /* From A toward C */
      const toCdx = C_x - objX, toCdy = axisY - objTopY;
      const toClen = Math.sqrt(toCdx * toCdx + toCdy * toCdy);
      const scale2 = toClen * 0.55;
      const hitX = objX + (toCdx / toClen) * scale2;
      const hitY = objTopY + (toCdy / toClen) * scale2;
      drawRayLine(ctx, objX, objTopY, hitX, hitY, "#34d399", 7, 2);
      drawRayLine(ctx, hitX, hitY, objX + 20, objTopY + 10, "#34d399", 7, 2);
      lbl(ctx, "Ray 2 (through C → retraces)", objX + 30, objTopY - 28, "#34d399", 9, true);
    }

    /* Ray 3: through F → reflects parallel to axis */
    if (step >= 3) {
      /* From A through F */
      const toFdx = F_x - objX, toFdy = axisY - objTopY;
      const toFlen = Math.sqrt(toFdx * toFdx + toFdy * toFdy);
      const scale3 = 80 / toFlen;
      const hitX3 = objX + toFdx * scale3;
      const hitY3 = objTopY + toFdy * scale3;
      drawRayLine(ctx, objX, objTopY, hitX3, hitY3, "#fbbf24", 7, 2);
      drawRayLine(ctx, hitX3, hitY3, imgX - 20, hitY3, "#fbbf24", 7, 2);
    }

    /* Image */
    if (step >= 4) {
      ctx.save();
      ctx.strokeStyle = "#f87171";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(imgX, axisY);
      ctx.lineTo(imgX, imgTopY);
      ctx.stroke();
      ctx.fillStyle = "#f87171";
      ctx.beginPath();
      ctx.moveTo(imgX, imgTopY);
      ctx.lineTo(imgX - 5, imgTopY + 10);
      ctx.lineTo(imgX + 5, imgTopY + 10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      lbl(ctx, "A' (Image)", imgX - 16, imgTopY - 12, "#f87171", 10, true);
      lbl(ctx, "Real, Inverted, Diminished", imgX - 55, imgTopY - 26, "#f87171", 9);
    }

    /* Step label */
    lbl(ctx, `Step ${step + 1}/5: ${steps[step]}`, 14, 20, "#f1f5f9", 11, true);
  }, [step]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          🎯 Step-by-Step Ray Diagram Builder
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Build a concave mirror ray diagram one step at a time
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 290, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #1e293b" }}>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            padding: "7px 18px", borderRadius: 8, border: "1px solid #1e293b",
            background: step === 0 ? "transparent" : "rgba(59,130,246,0.1)",
            color: step === 0 ? "#334155" : "#60a5fa",
            cursor: step === 0 ? "not-allowed" : "pointer",
            fontFamily: "Inter, system-ui, sans-serif", fontSize: 12,
          }}>
          ← Previous
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%",
              background: i === step ? "#3b82f6" : i < step ? "#1d4ed8" : "#1e293b",
              transition: "background 0.2s",
            }} />
          ))}
        </div>
        <button
          onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          style={{
            padding: "7px 18px", borderRadius: 8, border: "1px solid #1e293b",
            background: step === steps.length - 1 ? "transparent" : "rgba(59,130,246,0.15)",
            color: step === steps.length - 1 ? "#334155" : "#60a5fa",
            cursor: step === steps.length - 1 ? "not-allowed" : "pointer",
            fontFamily: "Inter, system-ui, sans-serif", fontSize: 12,
          }}>
          Next →
        </button>
      </div>
    </div>
  );
}
