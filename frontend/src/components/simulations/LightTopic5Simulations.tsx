"use client";
/**
 * FILE: LightTopic5Simulations.tsx
 * LOCATION: src/components/simulations/LightTopic5Simulations.tsx
 * PURPOSE: 4 interactive canvas simulations for Class 10 Light — Topic 5:
 *          Image Formation by Lenses.
 *
 * SIMULATIONS:
 *   1. Sim_light_convex_lens     — interactive convex lens with draggable object
 *   2. Sim_light_concave_lens    — interactive concave lens
 *   3. Sim_light_lens_positions  — all positions for convex lens (interactive)
 *   4. Sim_light_lens_compare    — side-by-side convex vs concave comparison
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
  const W = canvas.clientWidth || 580;
  const H = canvas.clientHeight || 340;
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
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(99,102,241,0.04)";
  for (let x = 0; x <= W; x += 40)
    for (let y = 0; y <= H; y += 40) {
      ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
    }
}

function ray(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, glow = 7, lw = 1.8,
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

function dash(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color = "rgba(148,163,184,0.4)",
) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

function t(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number,
  color = "#e2e8f0", size = 11, bold = false,
) {
  ctx.save();
  ctx.font = `${bold ? "bold " : ""}${size}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = color; ctx.fillText(text, x, y);
  ctx.restore();
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Draw a convex (biconvex) lens at position (lx, axisY) with height lh
 * ───────────────────────────────────────────────────────────────────────────── */
function drawConvexLens(
  ctx: CanvasRenderingContext2D,
  lx: number, axisY: number, lh: number,
  color = "#34d399",
) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 2.5;
  ctx.shadowColor = color; ctx.shadowBlur = 10;
  /* Biconvex shape using two arcs */
  const bulge = lh * 0.35;
  ctx.beginPath();
  ctx.moveTo(lx, axisY - lh);
  ctx.quadraticCurveTo(lx + bulge, axisY, lx, axisY + lh);
  ctx.quadraticCurveTo(lx - bulge, axisY, lx, axisY - lh);
  ctx.closePath();
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
  ctx.stroke();
  ctx.restore();
  /* Arrows at tips indicating converging */
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color; ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(lx, axisY - lh - 6);
  ctx.lineTo(lx - 5, axisY - lh + 4);
  ctx.lineTo(lx + 5, axisY - lh + 4);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(lx, axisY + lh + 6);
  ctx.lineTo(lx - 5, axisY + lh - 4);
  ctx.lineTo(lx + 5, axisY + lh - 4);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Draw a concave (biconcave) lens
 * ───────────────────────────────────────────────────────────────────────────── */
function drawConcaveLens(
  ctx: CanvasRenderingContext2D,
  lx: number, axisY: number, lh: number,
  color = "#f97316",
) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 2.5;
  ctx.shadowColor = color; ctx.shadowBlur = 10;
  const bulge = lh * 0.3;
  /* Biconcave shape */
  ctx.beginPath();
  ctx.moveTo(lx - bulge * 0.5, axisY - lh);
  ctx.quadraticCurveTo(lx + bulge, axisY, lx - bulge * 0.5, axisY + lh);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(lx + bulge * 0.5, axisY - lh);
  ctx.quadraticCurveTo(lx - bulge, axisY, lx + bulge * 0.5, axisY + lh);
  ctx.stroke();
  /* Vertical ends */
  ctx.beginPath();
  ctx.moveTo(lx - bulge * 0.5, axisY - lh);
  ctx.lineTo(lx + bulge * 0.5, axisY - lh);
  ctx.moveTo(lx - bulge * 0.5, axisY + lh);
  ctx.lineTo(lx + bulge * 0.5, axisY + lh);
  ctx.stroke();
  ctx.restore();
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 1: Interactive Convex Lens
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_convex_lens() {
  const [objDist, setObjDist] = useState(200); /* u in px */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    bg(ctx, W, H);

    const axisY = H / 2 + 10;
    const lensX = W * 0.6;
    const f = 90;
    const F1_x = lensX - f; /* first focus (same side as object) */
    const F2_x = lensX + f; /* second focus (other side) */
    const lensH = 85;

    /* Axis */
    dash(ctx, 20, axisY, W - 20, axisY, "rgba(100,116,139,0.35)");

    /* Lens */
    drawConvexLens(ctx, lensX, axisY, lensH);
    t(ctx, "Convex Lens", lensX - 30, axisY + lensH + 16, "#34d399", 10, true);

    /* Focal points */
    for (const [fx, lb] of [[F1_x, "F₁"], [F2_x, "F₂"]]) {
      ctx.save();
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.arc(fx as number, axisY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      t(ctx, lb as string, (fx as number) - 6, axisY + 14, "#f97316", 10, true);
    }
    /* 2F points */
    for (const [fx, lb] of [[lensX - 2 * f, "2F₁"], [lensX + 2 * f, "2F₂"]]) {
      if ((fx as number) > 0 && (fx as number) < W) {
        ctx.save();
        ctx.fillStyle = "#64748b";
        ctx.beginPath();
        ctx.arc(fx as number, axisY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        t(ctx, lb as string, (fx as number) - 8, axisY + 14, "#64748b", 9);
      }
    }
    /* Lens center mark */
    ctx.save();
    ctx.fillStyle = "#34d399";
    ctx.beginPath();
    ctx.arc(lensX, axisY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    t(ctx, "O", lensX - 4, axisY + 14, "#34d399", 10, true);

    /* Object */
    const objX = lensX - objDist;
    const objH = 60;
    const objTopY = axisY - objH;

    if (objX > 20) {
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
      ctx.closePath(); ctx.fill();
      ctx.restore();
      t(ctx, "Object", objX - 20, objTopY - 10, "#fbbf24", 10, true);
    }

    /* Image using lens formula: 1/v - 1/u = 1/f (u negative, f positive) */
    /* In standard form: 1/v = 1/f + 1/u → with u=-objDist, f=+f */
    const u = -objDist;
    const v = (u * f) / (u + f); /* = -objDist*f / (-objDist + f) */
    const m = v / u;

    let nature = "";
    if (objDist > 2 * f) nature = "Real, Inverted, Diminished";
    else if (Math.abs(objDist - 2 * f) < 5) nature = "Real, Inverted, Same Size";
    else if (objDist > f && objDist < 2 * f) nature = "Real, Inverted, Enlarged";
    else if (Math.abs(objDist - f) < 5) nature = "Image at infinity";
    else nature = "Virtual, Erect, Enlarged";

    /* Draw image */
    if (Math.abs(v) > 0 && Math.abs(v) < 280) {
      const imgX = lensX + v;
      const imgH = Math.abs(m) * objH;
      const imgTopY = v > 0 ? axisY - imgH : axisY + imgH - imgH; /* inverted */

      if (imgX > 20 && imgX < W - 10) {
        ctx.save();
        ctx.strokeStyle = "#f87171";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 8;
        if (v < 0) ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(imgX, axisY);
        ctx.lineTo(imgX, v > 0 ? axisY - imgH : axisY + imgH);
        ctx.stroke();
        ctx.fillStyle = "#f87171";
        const tipY = v > 0 ? axisY - imgH : axisY + imgH;
        const dir = v > 0 ? -1 : 1;
        ctx.beginPath();
        ctx.moveTo(imgX, tipY);
        ctx.lineTo(imgX - 5, tipY - dir * 10);
        ctx.lineTo(imgX + 5, tipY - dir * 10);
        ctx.closePath(); ctx.fill();
        ctx.restore();
        t(ctx, "Image", imgX - 16, (v > 0 ? axisY - imgH : axisY + imgH) - 12, "#f87171", 9, true);
      }
    }

    /* Ray 1: Parallel to axis → refracts through F2 */
    if (objX > 20) {
      ray(ctx, objX, objTopY, lensX, objTopY, "#f472b6", 6, 1.8);
      if (Math.abs(v) < 280 && v > 0) {
        ray(ctx, lensX, objTopY, lensX + (v < 300 ? v : 300), axisY - (v < 300 ? Math.abs(m) * objH : 0), "#f472b6", 6, 1.8);
      } else {
        ray(ctx, lensX, objTopY, F2_x + 40, axisY, "#f472b6", 6, 1.8);
      }
      /* Ray 2: Through optical center — straight */
      ray(ctx, objX, objTopY, lensX, axisY, "#34d399", 6, 1.8);
      if (Math.abs(v) < 280 && v > 0) {
        const imgX = lensX + v;
        const imgH = Math.abs(m) * objH;
        ray(ctx, lensX, axisY, imgX + 20, axisY - imgH * 0.8, "#34d399", 6, 1.8);
      }
    }

    /* Info box */
    const bx = 14, by = 12;
    ctx.save();
    ctx.fillStyle = "rgba(15,23,42,0.92)";
    ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect?.(bx, by, 240, 88, 8);
    ctx.fill(); ctx.stroke();
    ctx.restore();
    t(ctx, "Convex Lens", bx + 8, by + 16, "#34d399", 12, true);
    t(ctx, `u = −${objDist} cm   f = +${f} cm`, bx + 8, by + 32, "#94a3b8", 10);
    t(ctx, `v = ${v.toFixed(1)} cm   m = ${m.toFixed(2)}`, bx + 8, by + 48, "#f87171", 11, true);
    t(ctx, nature, bx + 8, by + 64, "#e2e8f0", 10);
    t(ctx, "Lens formula: 1/v − 1/u = 1/f", bx + 8, by + 80, "#64748b", 9);
  }, [objDist]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          🔬 Convex (Converging) Lens — Ray Diagram
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Slide the object to see how image changes — used in magnifying glasses, cameras
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 310, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid #1e293b" }}>
        <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui" }}>Object distance u:</span>
        <input type="range" min={20} max={340} step={5} value={objDist}
          onChange={e => setObjDist(Number(e.target.value))}
          style={{ flex: 1, accentColor: "#34d399" }} />
        <span style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 55 }}>
          u = {objDist}px
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 2: Interactive Concave Lens
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_concave_lens() {
  const [objDist, setObjDist] = useState(180);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    bg(ctx, W, H);

    const axisY = H / 2 + 10;
    const lensX = W * 0.58;
    const f = 80; /* focal length magnitude */
    const F1_x = lensX - f;
    const F2_x = lensX + f;
    const lensH = 80;

    dash(ctx, 20, axisY, W - 20, axisY, "rgba(100,116,139,0.35)");

    drawConcaveLens(ctx, lensX, axisY, lensH);
    t(ctx, "Concave Lens", lensX - 30, axisY + lensH + 16, "#f97316", 10, true);

    for (const [fx, lb] of [[F1_x, "F₁"], [F2_x, "F₂"]]) {
      ctx.save();
      ctx.fillStyle = "#a78bfa";
      ctx.beginPath();
      ctx.arc(fx as number, axisY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      t(ctx, lb as string, (fx as number) - 6, axisY + 14, "#a78bfa", 10, true);
    }

    ctx.save();
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(lensX, axisY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    t(ctx, "O", lensX - 4, axisY + 14, "#f97316", 10, true);

    const objX = lensX - objDist;
    const objH = 60;
    const objTopY = axisY - objH;

    if (objX > 20) {
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
      ctx.closePath(); ctx.fill();
      ctx.restore();
      t(ctx, "Object", objX - 20, objTopY - 10, "#fbbf24", 10, true);
    }

    /* Concave lens: f is negative → 1/v = 1/u + 1/f with u=-objDist, f=-80 */
    const u = -objDist;
    const fNeg = -f;
    const v = (u * fNeg) / (u + fNeg);
    const m = v / u;

    /* Concave lens always forms virtual, erect, diminished image on same side as object */
    const nature = "Virtual, Erect, Diminished";

    /* Draw virtual image — always between F1 and lens on object side */
    if (v < 0 && Math.abs(v) < 250) {
      const imgX = lensX + v; /* v is negative → imgX < lensX */
      const imgH = Math.abs(m) * objH;
      const imgTopY = axisY - imgH;

      if (imgX > 20) {
        ctx.save();
        ctx.strokeStyle = "#f87171";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 8;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(imgX, axisY);
        ctx.lineTo(imgX, imgTopY);
        ctx.stroke();
        ctx.fillStyle = "#f87171";
        ctx.beginPath();
        ctx.moveTo(imgX, imgTopY);
        ctx.lineTo(imgX - 5, imgTopY + 10);
        ctx.lineTo(imgX + 5, imgTopY + 10);
        ctx.closePath(); ctx.fill();
        ctx.restore();
        t(ctx, "Virtual Image", imgX - 40, imgTopY - 10, "#f87171", 9, true);
      }
    }

    /* Rays */
    if (objX > 20) {
      /* Ray 1: Parallel to axis → refracts as if coming from F1 (virtual focus) */
      ray(ctx, objX, objTopY, lensX, objTopY, "#f472b6", 6, 1.8);
      /* After lens: diverges as if from F1 */
      const divDx = lensX - F1_x, divDy = axisY - objTopY;
      const divLen = Math.sqrt(divDx * divDx + divDy * divDy);
      const scale = 120 / divLen;
      ray(ctx, lensX, objTopY, lensX + divDx * scale, objTopY + divDy * scale, "#f472b6", 6, 1.8);
      /* Dashed back to F1 */
      dash(ctx, lensX, objTopY, F1_x, axisY, "rgba(244,114,182,0.3)");

      /* Ray 2: Through optical center */
      ray(ctx, objX, objTopY, lensX, axisY, "#34d399", 6, 1.8);
      const imgX2 = lensX + v;
      if (imgX2 > 20) {
        ray(ctx, lensX, axisY, lensX + (lensX - objX) * 0.6, axisY - 30, "#34d399", 6, 1.8);
      }
    }

    /* Info box */
    const bx = 14, by = 12;
    ctx.save();
    ctx.fillStyle = "rgba(15,23,42,0.92)";
    ctx.strokeStyle = "#431407"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect?.(bx, by, 240, 88, 8);
    ctx.fill(); ctx.stroke();
    ctx.restore();
    t(ctx, "Concave (Diverging) Lens", bx + 8, by + 16, "#f97316", 12, true);
    t(ctx, `u = −${objDist} px   f = −${f} px`, bx + 8, by + 32, "#94a3b8", 10);
    t(ctx, `v = ${v.toFixed(1)} px   m = +${Math.abs(m).toFixed(2)}`, bx + 8, by + 48, "#f87171", 11, true);
    t(ctx, nature, bx + 8, by + 64, "#e2e8f0", 10);
    t(ctx, "ALWAYS forms virtual, erect, diminished image", bx + 8, by + 80, "#64748b", 9);
  }, [objDist]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          🔭 Concave (Diverging) Lens — Ray Diagram
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Always forms virtual, erect, diminished image — regardless of object position
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 310, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid #1e293b" }}>
        <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui" }}>Object distance:</span>
        <input type="range" min={30} max={340} step={5} value={objDist}
          onChange={e => setObjDist(Number(e.target.value))}
          style={{ flex: 1, accentColor: "#f97316" }} />
        <span style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 55 }}>
          u = {objDist}px
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 3: Convex Lens — All Positions
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_lens_positions() {
  const [selected, setSelected] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cases = [
    { label: "Object at ∞",          u: "∞",       v: "At F₂",       nature: "Real, Inverted, Diminished (point)" },
    { label: "Object beyond 2F₁",    u: "> 2f",    v: "F₂ & 2F₂",    nature: "Real, Inverted, Diminished" },
    { label: "Object at 2F₁",        u: "= 2f",    v: "At 2F₂",      nature: "Real, Inverted, Same Size" },
    { label: "Object between F₁&2F₁",u: "f < u<2f",v: "Beyond 2F₂",  nature: "Real, Inverted, Enlarged" },
    { label: "Object at F₁",         u: "= f",     v: "∞",            nature: "Image at Infinity" },
    { label: "Object between O & F₁",u: "< f",     v: "Same side as object", nature: "Virtual, Erect, Enlarged" },
  ];

  const uPxMap: number[] = [400, 250, 180, 130, 90, 50];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    bg(ctx, W, H);

    const axisY = H / 2 + 20;
    const lensX = W * 0.56;
    const f = 90;
    const lensH = 80;

    dash(ctx, 20, axisY, W - 20, axisY, "rgba(100,116,139,0.3)");
    drawConvexLens(ctx, lensX, axisY, lensH);

    /* Key points */
    for (const [px, lb] of [
      [lensX - f, "F₁"], [lensX + f, "F₂"],
      [lensX - 2 * f, "2F₁"], [lensX + 2 * f, "2F₂"],
      [lensX, "O"],
    ] as [number, string][]) {
      if (px > 0 && px < W) {
        ctx.save();
        ctx.fillStyle = "#64748b";
        ctx.beginPath(); ctx.arc(px, axisY, 3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        t(ctx, lb, px - 8, axisY + 14, "#64748b", 9);
      }
    }

    /* Object */
    const objU = uPxMap[selected];
    const objX = lensX - objU;
    const objH = 55;
    const objTopY = axisY - objH;

    if (objX > 20) {
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
      ctx.closePath(); ctx.fill();
      ctx.restore();
      t(ctx, "Object", objX - 16, objTopY - 10, "#fbbf24", 9, true);
    } else {
      t(ctx, "Object at ∞ ——>", 14, axisY - 50, "#fbbf24", 11, true);
    }

    /* Image using lens formula */
    const u = -objU;
    const fP = f;
    const v = Math.abs(u) < 2 ? 99999 : (u * fP) / (u + fP);
    const mAbs = Math.abs(v / u);

    if (isFinite(v) && Math.abs(v) < 280) {
      const imgX = lensX + v;
      const imgH = mAbs * objH;

      if (imgX > 20 && imgX < W - 10) {
        ctx.save();
        ctx.strokeStyle = "#f87171";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 8;
        if (v < 0) ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(imgX, axisY);
        ctx.lineTo(imgX, v > 0 ? axisY - imgH : axisY + imgH);
        ctx.stroke();
        ctx.fillStyle = "#f87171";
        const tipY = v > 0 ? axisY - imgH : axisY + imgH;
        const dir = v > 0 ? -1 : 1;
        ctx.beginPath();
        ctx.moveTo(imgX, tipY);
        ctx.lineTo(imgX - 4, tipY - dir * 8);
        ctx.lineTo(imgX + 4, tipY - dir * 8);
        ctx.closePath(); ctx.fill();
        ctx.restore();
        t(ctx, "Image", imgX - 12, (v > 0 ? axisY - imgH : axisY + imgH) - 12, "#f87171", 9, true);
      }
    } else if (!isFinite(v)) {
      t(ctx, "Image at ∞", W - 90, axisY - 30, "#f87171", 11, true);
    }

    /* Info panel */
    const cs = cases[selected];
    const bx = 14, by = 12;
    ctx.save();
    ctx.fillStyle = "rgba(15,23,42,0.9)";
    ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect?.(bx, by, 260, 80, 8);
    ctx.fill(); ctx.stroke();
    ctx.restore();
    t(ctx, `Case ${selected + 1}: ${cs.label}`, bx + 8, by + 16, "#60a5fa", 11, true);
    t(ctx, `Object: u ${cs.u}`, bx + 8, by + 32, "#fbbf24", 10);
    t(ctx, `Image: v = ${cs.v}`, bx + 8, by + 48, "#f87171", 10);
    t(ctx, `Nature: ${cs.nature}`, bx + 8, by + 64, "#34d399", 9, true);
  }, [selected]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          📋 Convex Lens — All 6 Image Positions
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Each object position produces a completely different image
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 270, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", flexWrap: "wrap", gap: 6, borderTop: "1px solid #1e293b" }}>
        {cases.map((c, i) => (
          <button key={i} onClick={() => setSelected(i)}
            style={{
              padding: "5px 10px", fontSize: 11, borderRadius: 6,
              border: `1px solid ${i === selected ? "#3b82f6" : "#1e293b"}`,
              background: i === selected ? "rgba(59,130,246,0.15)" : "transparent",
              color: i === selected ? "#60a5fa" : "#64748b",
              cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif",
            }}>
            Case {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 4: Convex vs Concave Comparison
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_lens_compare() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    bg(ctx, W, H);

    const halfW = W / 2;
    const axisY = H / 2;
    const f = 70;

    /* Divider */
    ctx.save();
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(halfW, 0);
    ctx.lineTo(halfW, H);
    ctx.stroke();
    ctx.restore();

    /* ─── LEFT: CONVEX LENS ─── */
    const lx1 = halfW * 0.58;
    const lx2 = halfW + halfW * 0.58;
    const lH = 70;

    dash(ctx, 10, axisY, halfW - 10, axisY, "rgba(100,116,139,0.3)");
    drawConvexLens(ctx, lx1, axisY, lH);

    /* Parallel rays → converge at F2 */
    const F2_1 = lx1 + f;
    for (const yOff of [-35, 0, 35]) {
      ray(ctx, 14, axisY + yOff, lx1, axisY + yOff, "#f97316", 7, 1.5);
      ray(ctx, lx1, axisY + yOff, F2_1 + (yOff !== 0 ? 5 : 0), axisY + yOff * 0.1, "#f97316", 7, 1.5);
    }
    ctx.save();
    ctx.fillStyle = "#f97316";
    ctx.shadowColor = "#f97316";
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(F2_1, axisY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    t(ctx, "CONVEX LENS", halfW * 0.18, 22, "#34d399", 12, true);
    t(ctx, "Converging", halfW * 0.18, 38, "#34d399", 10);
    t(ctx, "Rays meet at F₂ →", halfW * 0.18, 54, "#f97316", 10);
    t(ctx, "Used in: cameras, eyes, magnifiers", 12, H - 14, "#64748b", 9);

    /* ─── RIGHT: CONCAVE LENS ─── */
    dash(ctx, halfW + 10, axisY, W - 10, axisY, "rgba(100,116,139,0.3)");
    drawConcaveLens(ctx, lx2, axisY, lH);

    /* Parallel rays → diverge as if from F1 */
    const F1_2 = lx2 - f;
    for (const yOff of [-35, 0, 35]) {
      ray(ctx, halfW + 10, axisY + yOff, lx2, axisY + yOff, "#f97316", 7, 1.5);
      /* Diverge after lens */
      const spreadFactor = 1.5;
      ray(ctx, lx2, axisY + yOff, W - 14, axisY + yOff * spreadFactor, "#f97316", 7, 1.5);
    }
    /* Dashed lines to virtual F1 */
    for (const yOff of [-35, 35]) {
      dash(ctx, lx2, axisY + yOff, F1_2, axisY, "rgba(248,113,113,0.4)");
    }
    ctx.save();
    ctx.fillStyle = "#f87171";
    ctx.strokeStyle = "#f87171";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(F1_2, axisY, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    t(ctx, "CONCAVE LENS", halfW + halfW * 0.12, 22, "#f97316", 12, true);
    t(ctx, "Diverging", halfW + halfW * 0.12, 38, "#f97316", 10);
    t(ctx, "Rays spread away from F₁ →", halfW + halfW * 0.12, 54, "#a78bfa", 10);
    t(ctx, "Used in: spectacles for myopia", halfW + 10, H - 14, "#64748b", 9);

    /* Center labels */
    t(ctx, "F", lx1 + f - 4, axisY + 14, "#f97316", 10, true);
    t(ctx, "F (virtual)", F1_2 - 30, axisY + 14, "#f87171", 9);
  }, []);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          ⚖️ Convex vs Concave Lens Comparison
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Left: Converging lens focuses rays. Right: Diverging lens spreads rays apart.
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 280, display: "block" }} />
    </div>
  );
}
