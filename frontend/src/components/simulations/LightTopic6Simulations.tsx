"use client";
/**
 * FILE: LightTopic6Simulations.tsx
 * LOCATION: src/components/simulations/LightTopic6Simulations.tsx
 * PURPOSE: 4 interactive canvas simulations for Class 10 Light — Topic 6:
 *          Lens Formula, Magnification, and Power of a Lens.
 *
 * SIMULATIONS:
 *   1. Sim_light_lens_formula_calc  — interactive lens formula calculator
 *   2. Sim_light_power_lens         — power of a lens and combination of lenses
 *   3. Sim_light_eye_defects        — myopia and hyperopia correction animation
 *   4. Sim_light_prism_dispersion   — white light dispersion through a prism
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

function bg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#050c18");
  g.addColorStop(1, "#0a1628");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(99,102,241,0.04)";
  for (let x = 0; x <= W; x += 40)
    for (let y = 0; y <= H; y += 40) {
      ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
    }
}

function txt(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number,
  color = "#e2e8f0", size = 11, bold = false,
) {
  ctx.save();
  ctx.font = `${bold ? "bold " : ""}${size}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = color; ctx.fillText(text, x, y);
  ctx.restore();
}

function r(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, glow = 7, lw = 2,
) {
  ctx.save();
  ctx.shadowColor = color; ctx.shadowBlur = glow;
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len > 8) {
    const ux = dx / len, uy = dy / len, ah = 10;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - ah * (ux - 0.4 * uy), y2 - ah * (uy + 0.4 * ux));
    ctx.lineTo(x2 - ah * (ux + 0.4 * uy), y2 - ah * (uy - 0.4 * ux));
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function d(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color = "rgba(148,163,184,0.4)",
) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

function drawConvexLens(
  ctx: CanvasRenderingContext2D,
  lx: number, ay: number, lh: number, color = "#34d399",
) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 2.5;
  ctx.shadowColor = color; ctx.shadowBlur = 10;
  const b = lh * 0.35;
  ctx.beginPath();
  ctx.moveTo(lx, ay - lh);
  ctx.quadraticCurveTo(lx + b, ay, lx, ay + lh);
  ctx.quadraticCurveTo(lx - b, ay, lx, ay - lh);
  ctx.closePath();
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
  ctx.stroke();
  ctx.restore();
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 1: Lens Formula Calculator
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_lens_formula_calc() {
  const [u, setU] = useState(-30); /* object distance in cm (negative = left) */
  const [f, setF] = useState(15);  /* focal length in cm (positive = convex) */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const compute = () => {
    /* Lens formula: 1/v - 1/u = 1/f */
    const v = 1 / (1 / f + 1 / u) * (u * f) / (u * f); /* simplified */
    /* Correct: 1/v = 1/f + 1/u */
    const v2 = (u * f) / (u + f);
    const m = v2 / u;
    const P = f !== 0 ? (100 / f).toFixed(2) : "∞";
    return { v: v2, m, P };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    bg(ctx, W, H);

    const { v, m, P } = compute();
    const scale = 2.2; /* px per cm */
    const axisY = H / 2 + 10;
    const lensX = W * 0.6;
    const fPx = Math.abs(f) * scale;
    const lensH = 80;

    d(ctx, 20, axisY, W - 20, axisY, "rgba(100,116,139,0.35)");

    /* Lens */
    const lensColor = f > 0 ? "#34d399" : "#f97316";
    drawConvexLens(ctx, lensX, axisY, lensH, lensColor);
    txt(ctx, f > 0 ? "Convex" : "Concave", lensX - 20, axisY + lensH + 16, lensColor, 9, true);

    /* Mark F and 2F */
    const F2x = lensX + Math.sign(f) * fPx;
    const F1x = lensX - Math.sign(f) * fPx;
    for (const [px, lb, c] of [
      [lensX, "O", lensColor],
      [F1x, "F₁", "#f97316"],
      [F2x, "F₂", "#f97316"],
    ] as [number, string, string][]) {
      ctx.save(); ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(px, axisY, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      txt(ctx, lb, px - 6, axisY + 14, c, 9, true);
    }

    /* Object arrow */
    const uPx = u * scale;
    const objX = lensX + uPx; /* u is negative → objX left of lens */
    const objH = 55;
    if (objX > 20 && objX < W - 20) {
      ctx.save();
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2.5;
      ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.moveTo(objX, axisY); ctx.lineTo(objX, axisY - objH); ctx.stroke();
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.moveTo(objX, axisY - objH);
      ctx.lineTo(objX - 5, axisY - objH + 10);
      ctx.lineTo(objX + 5, axisY - objH + 10);
      ctx.closePath(); ctx.fill();
      ctx.restore();
      txt(ctx, "Object", objX - 18, axisY - objH - 10, "#fbbf24", 9, true);
    }

    /* Image arrow */
    const vPx = v * scale;
    const imgX = lensX + vPx;
    const imgH = Math.abs(m) * objH;
    if (isFinite(v) && imgX > 20 && imgX < W - 10) {
      ctx.save();
      ctx.strokeStyle = "#f87171"; ctx.lineWidth = 2;
      ctx.shadowColor = "#ef4444"; ctx.shadowBlur = 8;
      if (v < 0) ctx.setLineDash([3, 3]);
      const imgTopY = v > 0 ? axisY - imgH : axisY + imgH;
      ctx.beginPath(); ctx.moveTo(imgX, axisY); ctx.lineTo(imgX, imgTopY); ctx.stroke();
      ctx.fillStyle = "#f87171";
      const dir = v > 0 ? -1 : 1;
      ctx.beginPath();
      ctx.moveTo(imgX, imgTopY);
      ctx.lineTo(imgX - 4, imgTopY - dir * 8);
      ctx.lineTo(imgX + 4, imgTopY - dir * 8);
      ctx.closePath(); ctx.fill();
      ctx.restore();
      txt(ctx, "Image", imgX - 14, imgTopY - 12, "#f87171", 9, true);
    }

    /* Formula card */
    const bx = 12, by = 12;
    ctx.save();
    ctx.fillStyle = "rgba(15,23,42,0.93)";
    ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect?.(bx, by, 250, 130, 8);
    ctx.fill(); ctx.stroke();
    ctx.restore();

    txt(ctx, "Lens Formula: 1/v − 1/u = 1/f", bx + 8, by + 18, "#60a5fa", 11, true);
    txt(ctx, `f = ${f > 0 ? "+" : ""}${f} cm   u = ${u} cm`, bx + 8, by + 36, "#94a3b8", 10);
    const vLabel = isFinite(v) ? `v = ${v.toFixed(2)} cm` : "v = ∞";
    txt(ctx, vLabel, bx + 8, by + 54, "#f87171", 12, true);
    const mLabel = isFinite(m) ? `m = v/u = ${m.toFixed(3)}` : "m = ∞";
    txt(ctx, mLabel, bx + 8, by + 72, "#34d399", 11, true);
    txt(ctx, `Power P = 1/f(m) = ${P} D`, bx + 8, by + 90, "#fbbf24", 11, true);
    const imgNature = !isFinite(v) ? "At infinity" :
      v > 0 ? (m < 0 ? "Real + Inverted" : "Virtual + Erect") :
        "Virtual + Erect";
    txt(ctx, imgNature, bx + 8, by + 108, "#e2e8f0", 10);
    const magNature = !isFinite(m) ? "" : Math.abs(m) > 1.02 ? "(Enlarged)" : Math.abs(m) < 0.98 ? "(Diminished)" : "(Same size)";
    txt(ctx, magNature, bx + 8, by + 122, "#94a3b8", 9);
  }, [u, f]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          🔢 Lens Formula Calculator
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          1/v − 1/u = 1/f — also calculates Power P = 1/f(m) in Dioptres
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 290, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui", width: 120 }}>Object distance u:</span>
          <input type="range" min={-120} max={-5} step={1} value={u}
            onChange={e => setU(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#fbbf24" }} />
          <span style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 55 }}>{u} cm</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui", width: 120 }}>Focal length f:</span>
          <input type="range" min={-80} max={80} step={1} value={f}
            onChange={e => setF(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#34d399" }} />
          <span style={{ color: "#34d399", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 55 }}>{f} cm</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 2: Power of a Lens
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_power_lens() {
  const [f1, setF1] = useState(20); /* cm */
  const [f2, setF2] = useState(30); /* cm */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    bg(ctx, W, H);

    const P1 = (100 / f1).toFixed(2);
    const P2 = (100 / f2).toFixed(2);
    const Pcomb = (100 / f1 + 100 / f2).toFixed(2);
    const fComb = (100 / (100 / f1 + 100 / f2)).toFixed(2);

    const axisY = H / 2 + 20;
    const lensX1 = W * 0.3;
    const lensX2 = W * 0.7;
    const lH = 70;

    d(ctx, 20, axisY, W - 20, axisY, "rgba(100,116,139,0.3)");

    /* Lens 1 */
    drawConvexLens(ctx, lensX1, axisY, lH, "#34d399");
    /* Lens 2 */
    drawConvexLens(ctx, lensX2, axisY, lH, "#f472b6");

    /* Rays through both lenses */
    const fPx1 = Math.abs(f1) * 2;
    const fPx2 = Math.abs(f2) * 2;
    for (const yOff of [-30, 0, 30]) {
      /* Incident */
      r(ctx, 20, axisY + yOff, lensX1, axisY + yOff, "#f97316", 7, 1.5);
      /* Between lenses — intermediate bend */
      const midY = axisY + yOff * 0.5;
      r(ctx, lensX1, axisY + yOff, lensX2, midY, "#f97316", 7, 1.5);
      /* After second lens — converge */
      const combF = parseFloat(fComb);
      r(ctx, lensX2, midY, lensX2 + combF * 2.2, axisY, "#f97316", 7, 1.5);
    }

    /* Labels */
    txt(ctx, `Lens 1 (f₁ = ${f1} cm)`, lensX1 - 55, axisY + lH + 18, "#34d399", 10, true);
    txt(ctx, `P₁ = 100/${f1} = ${P1} D`, lensX1 - 55, axisY + lH + 32, "#34d399", 9);

    txt(ctx, `Lens 2 (f₂ = ${f2} cm)`, lensX2 - 55, axisY + lH + 18, "#f472b6", 10, true);
    txt(ctx, `P₂ = 100/${f2} = ${P2} D`, lensX2 - 55, axisY + lH + 32, "#f472b6", 9);

    /* Combined focus dot */
    const combFPx = parseFloat(fComb) * 2.2;
    ctx.save();
    ctx.fillStyle = "#fbbf24";
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(lensX2 + combFPx, axisY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    txt(ctx, "Combined Focus", lensX2 + combFPx - 45, axisY + 20, "#fbbf24", 10, true);

    /* Formula panel */
    const bx = 14, by = 14;
    ctx.save();
    ctx.fillStyle = "rgba(15,23,42,0.92)";
    ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect?.(bx, by, 240, 115, 8);
    ctx.fill(); ctx.stroke();
    ctx.restore();

    txt(ctx, "Power of a Lens:", bx + 8, by + 18, "#60a5fa", 12, true);
    txt(ctx, "P = 1/f (f in metres) = 100/f (f in cm)", bx + 8, by + 34, "#94a3b8", 9);
    txt(ctx, "Unit: Dioptre (D)", bx + 8, by + 48, "#e2e8f0", 10);
    txt(ctx, "Convex lens → positive power", bx + 8, by + 64, "#34d399", 10);
    txt(ctx, "Concave lens → negative power", bx + 8, by + 78, "#f87171", 10);
    txt(ctx, `Combined: P = P₁ + P₂`, bx + 8, by + 94, "#fbbf24", 11, true);
    txt(ctx, `= ${P1} + ${P2} = ${Pcomb} D (f = ${fComb} cm)`, bx + 8, by + 110, "#fbbf24", 10);
  }, [f1, f2]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          ⚡ Power of a Lens — P = 1/f (Dioptres)
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Combined power of lenses in contact: P = P₁ + P₂
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 280, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#34d399", fontSize: 12, fontFamily: "Inter, system-ui", width: 110 }}>f₁ (Lens 1):</span>
          <input type="range" min={5} max={100} step={1} value={f1}
            onChange={e => setF1(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#34d399" }} />
          <span style={{ color: "#34d399", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 50 }}>{f1} cm</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#f472b6", fontSize: 12, fontFamily: "Inter, system-ui", width: 110 }}>f₂ (Lens 2):</span>
          <input type="range" min={5} max={100} step={1} value={f2}
            onChange={e => setF2(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#f472b6" }} />
          <span style={{ color: "#f472b6", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 50 }}>{f2} cm</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 3: Eye Defects — Myopia & Hyperopia Correction
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_eye_defects() {
  const [defect, setDefect] = useState<"normal" | "myopia" | "hyperopia">("myopia");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    bg(ctx, W, H);

    const eyeX = W * 0.7;
    const eyeY = H / 2;
    const eyeR = 55; /* eye radius */
    const retina_x = eyeX + eyeR; /* back of eye (retina) */

    /* Draw eye */
    ctx.save();
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#3b82f6";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "rgba(30,58,138,0.2)";
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.restore();

    /* Pupil */
    ctx.save();
    ctx.fillStyle = "#1e3a8a";
    ctx.beginPath();
    ctx.arc(eyeX - eyeR * 0.6, eyeY, eyeR * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* Retina line */
    ctx.save();
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(retina_x - 10, eyeY - 30);
    ctx.lineTo(retina_x - 10, eyeY + 30);
    ctx.stroke();
    ctx.restore();
    txt(ctx, "Retina", retina_x, eyeY + 6, "#fbbf24", 9, true);

    /* Draw corrective lens if needed */
    const lensX = eyeX - eyeR - 45;
    if (defect === "myopia") {
      /* Concave lens correction */
      ctx.save();
      ctx.strokeStyle = "#f87171";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#f87171";
      ctx.shadowBlur = 10;
      const lh = 40, b = lh * 0.3;
      ctx.beginPath();
      ctx.moveTo(lensX - b * 0.5, eyeY - lh);
      ctx.quadraticCurveTo(lensX + b, eyeY, lensX - b * 0.5, eyeY + lh);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lensX + b * 0.5, eyeY - lh);
      ctx.quadraticCurveTo(lensX - b, eyeY, lensX + b * 0.5, eyeY + lh);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lensX - b * 0.5, eyeY - lh); ctx.lineTo(lensX + b * 0.5, eyeY - lh);
      ctx.moveTo(lensX - b * 0.5, eyeY + lh); ctx.lineTo(lensX + b * 0.5, eyeY + lh);
      ctx.stroke();
      ctx.restore();
      txt(ctx, "Concave\n(−ve) lens", lensX - 30, eyeY - lh - 14, "#f87171", 9, true);
    } else if (defect === "hyperopia") {
      /* Convex lens correction */
      ctx.save();
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#34d399";
      ctx.shadowBlur = 10;
      const lh = 40, b = lh * 0.35;
      ctx.beginPath();
      ctx.moveTo(lensX, eyeY - lh);
      ctx.quadraticCurveTo(lensX + b, eyeY, lensX, eyeY + lh);
      ctx.quadraticCurveTo(lensX - b, eyeY, lensX, eyeY - lh);
      ctx.closePath();
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = "#34d399";
      ctx.fill();
      ctx.restore();
      ctx.stroke();
      ctx.restore();
      txt(ctx, "Convex\n(+ve) lens", lensX - 24, eyeY - 40 - 14, "#34d399", 9, true);
    }

    /* Parallel rays from object */
    const srcX = 20;
    const numRays = 4;
    for (let i = 0; i < numRays; i++) {
      const yOff = (i - (numRays - 1) / 2) * 18;

      if (defect === "myopia") {
        /* Rays without lens would focus in front of retina */
        r(ctx, srcX, eyeY + yOff, lensX, eyeY + yOff, "#f97316", 6, 1.5);
        /* Diverged by concave lens */
        const spreadY = yOff * 1.4;
        r(ctx, lensX, eyeY + yOff, eyeX - eyeR * 0.5, eyeY + spreadY, "#f97316", 6, 1.5);
        /* Then converges at retina */
        r(ctx, eyeX - eyeR * 0.5, eyeY + spreadY, retina_x - 10, eyeY, "#f97316", 6, 1.5);
      } else if (defect === "hyperopia") {
        r(ctx, srcX, eyeY + yOff, lensX, eyeY + yOff, "#f97316", 6, 1.5);
        /* Converged by convex lens */
        const convergedY = yOff * 0.5;
        r(ctx, lensX, eyeY + yOff, eyeX - eyeR * 0.5, eyeY + convergedY, "#f97316", 6, 1.5);
        r(ctx, eyeX - eyeR * 0.5, eyeY + convergedY, retina_x - 10, eyeY, "#f97316", 6, 1.5);
      } else {
        /* Normal vision — converges naturally at retina */
        r(ctx, srcX, eyeY + yOff, eyeX - eyeR * 0.5, eyeY + yOff * 0.6, "#f97316", 6, 1.5);
        r(ctx, eyeX - eyeR * 0.5, eyeY + yOff * 0.6, retina_x - 10, eyeY, "#f97316", 6, 1.5);
      }
    }

    /* Focus point on retina */
    ctx.save();
    ctx.fillStyle = "#34d399";
    ctx.shadowColor = "#34d399";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(retina_x - 10, eyeY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    txt(ctx, "✅ Focus on retina", retina_x - 110, eyeY - 44, "#34d399", 10, true);

    /* Info panel */
    const descriptions = {
      normal: ["Normal Vision", "Eye lens focuses parallel light exactly on retina.", "No corrective lens needed.", "Far and near objects both clear."],
      myopia: ["Short-Sightedness (Myopia)", "Eyeball too long — image forms BEFORE retina.", "Correction: Concave (−ve) lens", "Can see near, not far objects."],
      hyperopia: ["Long-Sightedness (Hyperopia)", "Eyeball too short — image would form BEHIND retina.", "Correction: Convex (+ve) lens", "Can see far, not near objects."],
    };
    const info = descriptions[defect];
    const bx = 14, by = 14;
    ctx.save();
    ctx.fillStyle = "rgba(15,23,42,0.9)";
    ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect?.(bx, by, 250, 88, 8);
    ctx.fill(); ctx.stroke();
    ctx.restore();
    const colors = { normal: "#34d399", myopia: "#f87171", hyperopia: "#fbbf24" };
    txt(ctx, info[0], bx + 8, by + 18, colors[defect], 12, true);
    txt(ctx, info[1], bx + 8, by + 36, "#94a3b8", 9);
    txt(ctx, info[2], bx + 8, by + 52, colors[defect], 10, true);
    txt(ctx, info[3], bx + 8, by + 68, "#e2e8f0", 9);
  }, [defect]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          👁 Eye Defects & Correction
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Myopia corrected by concave lens (−D), Hyperopia by convex lens (+D)
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 290, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", gap: 8, borderTop: "1px solid #1e293b" }}>
        {(["normal", "myopia", "hyperopia"] as const).map(d => (
          <button key={d} onClick={() => setDefect(d)}
            style={{
              flex: 1, padding: "7px 10px", borderRadius: 8, fontSize: 12,
              border: `1px solid ${defect === d ? "#3b82f6" : "#1e293b"}`,
              background: defect === d ? "rgba(59,130,246,0.15)" : "transparent",
              color: defect === d ? "#60a5fa" : "#64748b",
              cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif", textTransform: "capitalize",
            }}>
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 4: Prism Dispersion (animated)
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_prism_dispersion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      const canvas = canvasRef.current;
      if (!canvas) { rafRef.current = requestAnimationFrame(loop); return; }
      const res = setupCanvas(canvas);
      if (!res) { rafRef.current = requestAnimationFrame(loop); return; }
      const [ctx, W, H] = res;
      tRef.current += 0.015;
      const t = tRef.current;
      bg(ctx, W, H);

      /* Prism */
      const px = W * 0.42, py = H * 0.72; /* bottom-left */
      const pw = 140, ph = 120;
      const ptop = { x: px + pw / 2, y: py - ph };

      ctx.save();
      ctx.fillStyle = "rgba(99,102,241,0.1)";
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#4f46e5";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + pw, py);
      ctx.lineTo(ptop.x, ptop.y);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.restore();
      txt(ctx, "PRISM", ptop.x - 20, ptop.y - 14, "#818cf8", 10, true);
      txt(ctx, "Glass (n ≈ 1.5)", px + 30, py + 14, "#6366f1", 9);

      /* Incident white light ray */
      const incX1 = px - 100, incY1 = H * 0.35;
      const incX2 = px + 30, incY2 = py - 45;
      r(ctx, incX1, incY1, incX2, incY2, "#ffffff", 12, 2.5);
      txt(ctx, "White light", incX1 - 55, incY1 - 4, "#f1f5f9", 10, true);

      /* Emerging spectrum rays — VIBGYOR */
      const specColors = [
        { color: "#8b5cf6", label: "V (Violet)", shift: 0 },
        { color: "#6366f1", label: "I (Indigo)", shift: 1 },
        { color: "#3b82f6", label: "B (Blue)", shift: 2 },
        { color: "#10b981", label: "G (Green)", shift: 3 },
        { color: "#f59e0b", label: "Y (Yellow)", shift: 4 },
        { color: "#f97316", label: "O (Orange)", shift: 5 },
        { color: "#ef4444", label: "R (Red)", shift: 6 },
      ];

      const exitX = px + pw - 30, exitY = py - 35;
      const spread = 22;

      specColors.forEach(({ color, label, shift }) => {
        const spread_y = (shift - 3) * spread * 0.8;
        const endX = exitX + 130;
        const endY = exitY - 40 + spread_y;
        /* Pulse glow */
        const pulse = 0.7 + 0.3 * Math.sin(t * 2 + shift * 0.5);
        ctx.save();
        ctx.globalAlpha = pulse;
        r(ctx, exitX, exitY, endX, endY, color, 8, 2);
        /* Color label */
        txt(ctx, label, endX + 4, endY + 4, color, 9, true);
        ctx.restore();
      });

      /* Refracted ray inside prism */
      ctx.save();
      ctx.globalAlpha = 0.5;
      r(ctx, incX2, incY2, exitX, exitY, "#e2e8f0", 4, 1.5);
      ctx.restore();

      /* Info panel */
      const bx = 14, by = 14;
      ctx.save();
      ctx.fillStyle = "rgba(15,23,42,0.9)";
      ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect?.(bx, by, 240, 98, 8);
      ctx.fill(); ctx.stroke();
      ctx.restore();
      txt(ctx, "Dispersion of Light", bx + 8, by + 18, "#f1f5f9", 12, true);
      txt(ctx, "White light = 7 colours (VIBGYOR)", bx + 8, by + 36, "#94a3b8", 10);
      txt(ctx, "Different colours bend by different amounts", bx + 8, by + 52, "#94a3b8", 9);
      txt(ctx, "Violet bends most (highest n)", bx + 8, by + 66, "#8b5cf6", 10, true);
      txt(ctx, "Red bends least (lowest n)", bx + 8, by + 80, "#ef4444", 10, true);
      txt(ctx, "→ Rainbow is dispersion by water droplets", bx + 8, by + 94, "#64748b", 9);

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          🌈 Prism — Dispersion of White Light
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          White light splits into VIBGYOR — violet bends most, red bends least
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, display: "block" }} />
    </div>
  );
}
