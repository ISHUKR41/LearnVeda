"use client";
/**
 * FILE: LightTopic2Simulations.tsx
 * LOCATION: src/components/simulations/LightTopic2Simulations.tsx
 * PURPOSE: 5 interactive canvas simulations for Class 10 Light — Topic 2:
 *          Spherical Mirrors (Concave and Convex).
 *
 * SIMULATIONS:
 *   1. Sim_light_concave_rays       — interactive concave mirror with draggable object
 *   2. Sim_light_convex_rays        — interactive convex mirror
 *   3. Sim_light_mirror_terms       — labeled diagram of all mirror terminology
 *   4. Sim_light_concave_positions  — all 6 object positions for concave mirror
 *   5. Sim_light_mirror_uses        — real-life applications animation
 *
 * PATTERN: Self-contained React canvas components, HiDPI-aware, interactive.
 * LAST UPDATED: 2026-06-08
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ── Canvas utilities (duplicated per file for zero cross-file dependency) ── */
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

function drawRay(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, glow = 8, lw = 2,
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
  /* Arrowhead */
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 8) { ctx.restore(); return; }
  const ux = dx / len, uy = dy / len;
  const ah = 11;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - ah * (ux - 0.4 * uy), y2 - ah * (uy + 0.4 * ux));
  ctx.lineTo(x2 - ah * (ux + 0.4 * uy), y2 - ah * (uy - 0.4 * ux));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function dashed(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color = "rgba(148,163,184,0.4)",
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function lbl(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number,
  color = "#e2e8f0", size = 11, bold = false,
) {
  ctx.save();
  ctx.font = `${bold ? "bold " : ""}${size}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SHARED: Draw a concave mirror arc (parabolic approximation) centered at mirX
 * The mirror arc is drawn as a circular arc. Reflecting surface is on left (inside).
 * ───────────────────────────────────────────────────────────────────────────── */
function drawConcaveMirror(
  ctx: CanvasRenderingContext2D,
  cx: number, /* center X of the arc circle */
  cy: number, /* center Y (principal axis) */
  R: number,  /* radius of curvature (arc radius) */
  half: number, /* half-height of mirror aperture */
) {
  /* The mirror pole P is at (cx - R, cy) */
  /* Arc spans from angle -arcsin(half/R) to +arcsin(half/R) */
  const halfAngle = Math.asin(Math.min(1, half / R));
  ctx.save();
  ctx.strokeStyle = "#60a5fa";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#3b82f6";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  /* arc going from top to bottom, facing LEFT (reflecting surface on left of center) */
  ctx.arc(cx, cy, R, Math.PI - halfAngle, Math.PI + halfAngle);
  ctx.stroke();
  ctx.restore();
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 1: Interactive Concave Mirror
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_concave_rays() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* Object distance from pole (in canvas px, positive = left of mirror) */
  const [objDist, setObjDist] = useState(240);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;
    drawDarkBg(ctx, W, H);

    /* Layout: mirror on right side, principal axis is horizontal */
    const axisY = H / 2;
    const poleX = W * 0.75; /* Pole P of mirror */
    const R = 160;           /* radius of curvature */
    const f = R / 2;         /* focal length */
    const C_x = poleX - R;  /* centre of curvature X */
    const F_x = poleX - f;  /* focus X */

    /* Draw principal axis */
    dashed(ctx, 20, axisY, W - 20, axisY, "rgba(100,116,139,0.4)");
    /* Draw infinity arrows on left */
    lbl(ctx, "←  Principal Axis  →", W * 0.3, axisY - 8, "#1e293b", 9);

    /* Draw concave mirror */
    drawConcaveMirror(ctx, poleX + R, axisY, R, 100);

    /* Key points */
    const pts = [
      { x: poleX, label: "P", dy: 14 },
      { x: F_x, label: "F", dy: 14 },
      { x: C_x, label: "C", dy: 14 },
    ];
    for (const pt of pts) {
      ctx.save();
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.arc(pt.x, axisY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      lbl(ctx, pt.label, pt.x - 4, axisY + pt.dy, "#94a3b8", 11, true);
    }

    /* Object arrow (vertical, on principal axis at objDist from pole) */
    const objX = Math.max(30, poleX - objDist);
    const objH = 60; /* object height */
    const objTopY = axisY - objH;

    ctx.save();
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(objX, axisY);
    ctx.lineTo(objX, objTopY);
    ctx.stroke();
    /* Arrowhead */
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.moveTo(objX, objTopY);
    ctx.lineTo(objX - 6, objTopY + 12);
    ctx.lineTo(objX + 6, objTopY + 12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    lbl(ctx, "Object", objX - 22, objTopY - 8, "#fbbf24", 10, true);

    /* ── Ray 1: Parallel to axis → reflects through F ── */
    /* From object tip: goes right parallel to axis, hits mirror at objTopY height */
    /* Mirror hit point: approx at (poleX, objTopY) when parallel to axis */
    const r1HitX = poleX;
    const r1HitY = objTopY; /* simplified: hits pole side at same height */
    drawRay(ctx, objX, objTopY, r1HitX, r1HitY, "#f472b6", 8, 1.8);

    /* ── Ray 2: Through centre of curvature → retraces ── */
    /* Direction from objTip to C */
    const toCdx = C_x - objX, toCdy = axisY - objTopY;
    const toClen = Math.sqrt(toCdx * toCdx + toCdy * toCdy);
    const r2scale = 120 / toClen;
    const r2HitX = objX + toCdx * r2scale;
    const r2HitY = objTopY + toCdy * r2scale;
    drawRay(ctx, objX, objTopY, r2HitX, r2HitY, "#34d399", 8, 1.8);

    /* Image: formed at intersection of reflected rays */
    /* Ray 1 reflected: from (r1HitX, r1HitY) through F */
    /* Using mirror formula: 1/v + 1/u = 1/f  (all in canvas px, sign convention) */
    /* u = objDist (positive, object on left) */
    const u = objDist; /* object distance from pole (px) */
    let v: number;
    let imgType = "";
    let imgNature = "";

    if (Math.abs(u - f) < 5) {
      /* Object at F: image at infinity */
      v = 99999;
      imgType = "Image at ∞";
      imgNature = "Real, Inverted, Highly Enlarged";
    } else if (u > 0 && u < f) {
      /* Object between P and F: virtual image */
      v = -(u * f) / (f - u);
      imgType = "Virtual Image (behind mirror)";
      imgNature = "Virtual, Erect, Enlarged";
    } else {
      /* Real image */
      v = (u * f) / (u - f);
      imgType = "Real Image";
      if (u > 2 * f) {
        imgNature = "Real, Inverted, Diminished";
      } else if (Math.abs(u - 2 * f) < 5) {
        imgNature = "Real, Inverted, Same Size";
      } else {
        imgNature = "Real, Inverted, Enlarged";
      }
    }

    /* Draw image if real (v > 0) */
    if (v > 0 && v < 300) {
      const imgX = poleX - v;
      if (imgX > 20) {
        const imgH = (objH * v) / u;
        const imgTopY = axisY - imgH;
        ctx.save();
        ctx.strokeStyle = "#f87171";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 8;
        ctx.setLineDash([4, 3]);
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
        lbl(ctx, "Image", imgX - 18, imgTopY - 8, "#f87171", 10, true);

        /* Reflected ray 1: from mirror hit through F to image */
        drawRay(ctx, r1HitX, r1HitY, imgX, imgTopY, "#f472b6", 8, 1.8);
        drawRay(ctx, r2HitX, r2HitY, imgX, imgTopY, "#34d399", 8, 1.8);
      }
    }

    /* Info panel */
    const infoX = 14;
    lbl(ctx, "Concave Mirror", infoX, 22, "#60a5fa", 13, true);
    lbl(ctx, `u = ${objDist} px   f = ${f} px   R = ${R} px`, infoX, 40, "#94a3b8", 10);
    lbl(ctx, imgType, infoX, 58, "#fbbf24", 12, true);
    lbl(ctx, imgNature, infoX, 74, "#e2e8f0", 11);

    /* f and R labels */
    dashed(ctx, poleX, axisY + 20, F_x, axisY + 20, "rgba(248,113,113,0.4)");
    lbl(ctx, `f`, (poleX + F_x) / 2 - 3, axisY + 32, "#f87171", 10);
    dashed(ctx, poleX, axisY + 40, C_x, axisY + 40, "rgba(99,102,241,0.4)");
    lbl(ctx, `R = 2f`, (poleX + C_x) / 2 - 15, axisY + 52, "#818cf8", 10);
  }, [objDist]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          🔵 Concave Mirror — Ray Diagram
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Slide the object to see how image changes — converging mirror
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 310, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid #1e293b" }}>
        <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui" }}>Object distance:</span>
        <input
          type="range" min={30} max={300} step={5} value={objDist}
          onChange={e => setObjDist(Number(e.target.value))}
          style={{ flex: 1, accentColor: "#3b82f6" }}
        />
        <span style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 55 }}>
          u = {objDist}px
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 2: Interactive Convex Mirror
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_convex_rays() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objDist, setObjDist] = useState(200);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;
    drawDarkBg(ctx, W, H);

    const axisY = H / 2;
    const poleX = W * 0.65;
    const R = 160;
    const f = R / 2;
    /* For convex: F and C are BEHIND the mirror (to the right of pole) */
    const F_x = poleX + f;
    const C_x = poleX + R;

    /* Principal axis */
    dashed(ctx, 20, axisY, W - 20, axisY, "rgba(100,116,139,0.4)");

    /* Convex mirror arc: reflecting surface faces LEFT */
    /* Arc center is to the RIGHT of pole */
    ctx.save();
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#7c3aed";
    ctx.shadowBlur = 10;
    const halfAngle = Math.asin(Math.min(1, 90 / R));
    ctx.beginPath();
    ctx.arc(poleX - R, axisY, R, -halfAngle, halfAngle);
    ctx.stroke();
    ctx.restore();

    /* Key points */
    ctx.save();
    ctx.fillStyle = "#94a3b8";
    for (const [px, lb] of [[poleX, "P"], [F_x, "F (virtual)"], [C_x, "C (virtual)"]]) {
      ctx.beginPath();
      ctx.arc(px as number, axisY, 3, 0, Math.PI * 2);
      ctx.fill();
      lbl(ctx, lb as string, (px as number) - 8, axisY + 16, "#94a3b8", 9);
    }
    ctx.restore();

    /* Virtual F and C shown dashed */
    dashed(ctx, F_x - 8, axisY - 50, F_x - 8, axisY + 50);
    dashed(ctx, C_x - 8, axisY - 50, C_x - 8, axisY + 50);

    /* Object */
    const objX = Math.max(30, poleX - objDist);
    const objH = 55;
    const objTopY = axisY - objH;
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
    lbl(ctx, "Object", objX - 22, objTopY - 8, "#fbbf24", 10, true);

    /* Convex mirror: image is always virtual, erect, diminished */
    /* v = -uf / (u + f) (both u and f positive in magnitude) */
    const u = objDist;
    const v_mag = (u * f) / (u + f);
    const imgX = poleX + v_mag; /* image is behind mirror (positive x) */
    const imgH = (objH * v_mag) / u;
    const imgTopY = axisY - imgH;

    /* Draw virtual image (dashed, behind mirror) */
    ctx.save();
    ctx.strokeStyle = "#f87171";
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(imgX, axisY);
    ctx.lineTo(imgX, imgTopY);
    ctx.stroke();
    ctx.fillStyle = "#f87171";
    ctx.beginPath();
    ctx.moveTo(imgX, imgTopY);
    ctx.lineTo(imgX - 4, imgTopY + 8);
    ctx.lineTo(imgX + 4, imgTopY + 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    lbl(ctx, "Virtual Image", imgX - 35, imgTopY - 10, "#f87171", 9, true);

    /* Incident ray 1: parallel to axis from object tip, reflects as if from F */
    drawRay(ctx, objX, objTopY, poleX, objTopY, "#f472b6", 7, 1.8);
    /* Reflected ray diverges away from F (extended back through F) */
    const r1RefDx = (poleX - F_x), r1RefDy = (axisY - objTopY);
    const r1RefLen = Math.sqrt(r1RefDx * r1RefDx + r1RefDy * r1RefDy);
    const r1Scale = 80 / r1RefLen;
    drawRay(ctx, poleX, objTopY, poleX - r1RefDx * r1Scale * 1.5, objTopY - r1RefDy * r1Scale, "#f472b6", 7, 1.8);

    /* Incident ray 2: aimed at C, reflects back */
    drawRay(ctx, objX, objTopY, poleX - 2, objTopY * 0.4 + axisY * 0.6, "#34d399", 7, 1.8);

    /* Info panel */
    lbl(ctx, "Convex Mirror", 14, 22, "#a78bfa", 13, true);
    lbl(ctx, "Always forms: Virtual + Erect + Diminished image", 14, 40, "#e2e8f0", 11);
    lbl(ctx, `u = ${u} px   |v| = ${Math.round(v_mag)} px (behind mirror)`, 14, 57, "#94a3b8", 10);
    lbl(ctx, "→ Used as rear-view mirror (wider field of view)", 14, H - 12, "#94a3b8", 10);
  }, [objDist]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          🔴 Convex Mirror — Ray Diagram
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Diverging mirror — image is always virtual, erect, and diminished
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 300, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid #1e293b" }}>
        <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui" }}>Object distance:</span>
        <input
          type="range" min={60} max={350} step={5} value={objDist}
          onChange={e => setObjDist(Number(e.target.value))}
          style={{ flex: 1, accentColor: "#7c3aed" }}
        />
        <span style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 55 }}>
          u = {objDist}px
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 3: Mirror Terminology Labeled Diagram
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_mirror_terms() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;
    drawDarkBg(ctx, W, H);

    const axisY = H / 2 + 10;
    const poleX = W * 0.72;
    const R = 170;
    const f = R / 2;
    const F_x = poleX - f;
    const C_x = poleX - R;

    /* Principal axis */
    dashed(ctx, 10, axisY, W - 10, axisY, "rgba(100,116,139,0.5)");
    lbl(ctx, "Principal Axis", W * 0.35 - 40, axisY - 10, "#334155", 9);

    /* Concave mirror */
    const halfAngle = Math.asin(100 / R);
    ctx.save();
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#3b82f6";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(poleX + R, axisY, R, Math.PI - halfAngle, Math.PI + halfAngle);
    ctx.stroke();
    /* Mirror backing */
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(poleX + R, axisY, R, Math.PI - halfAngle, Math.PI + halfAngle);
    ctx.lineTo(poleX, axisY + 100);
    ctx.lineTo(poleX, axisY - 100);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.restore();

    /* Aperture brace */
    const topMir = axisY - 98;
    const botMir = axisY + 98;
    ctx.save();
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(poleX + 12, topMir);
    ctx.lineTo(poleX + 20, topMir);
    ctx.lineTo(poleX + 20, botMir);
    ctx.lineTo(poleX + 12, botMir);
    ctx.stroke();
    ctx.restore();
    lbl(ctx, "Aperture", poleX + 22, axisY + 4, "#94a3b8", 10);

    /* Key points with annotations */
    const annPts = [
      { x: poleX, y: axisY, label: "P (Pole)", color: "#60a5fa", anchorDy: 14 },
      { x: F_x, y: axisY, label: "F (Focus)", color: "#f97316", anchorDy: 14 },
      { x: C_x, y: axisY, label: "C (Centre)", color: "#a78bfa", anchorDy: 14 },
    ];
    for (const pt of annPts) {
      ctx.save();
      ctx.fillStyle = pt.color;
      ctx.shadowColor = pt.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      lbl(ctx, pt.label, pt.x - 14, pt.y + pt.anchorDy + 8, pt.color, 10, true);
    }

    /* Focal length arrow */
    ctx.save();
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 1;
    const fY = axisY - 26;
    ctx.beginPath();
    ctx.moveTo(poleX, fY);
    ctx.lineTo(F_x, fY);
    ctx.stroke();
    /* Arrowheads */
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(poleX, fY); ctx.lineTo(poleX + 8, fY - 4); ctx.lineTo(poleX + 8, fY + 4); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(F_x, fY); ctx.lineTo(F_x - 8, fY - 4); ctx.lineTo(F_x - 8, fY + 4); ctx.closePath(); ctx.fill();
    ctx.restore();
    lbl(ctx, "f (focal length)", (poleX + F_x) / 2 - 35, fY - 8, "#f97316", 10);

    /* R arrow */
    ctx.save();
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 1;
    const rY = axisY - 46;
    ctx.beginPath();
    ctx.moveTo(poleX, rY);
    ctx.lineTo(C_x, rY);
    ctx.stroke();
    ctx.fillStyle = "#a78bfa";
    ctx.beginPath();
    ctx.moveTo(poleX, rY); ctx.lineTo(poleX + 8, rY - 4); ctx.lineTo(poleX + 8, rY + 4); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(C_x, rY); ctx.lineTo(C_x - 8, rY - 4); ctx.lineTo(C_x - 8, rY + 4); ctx.closePath(); ctx.fill();
    ctx.restore();
    lbl(ctx, "R = 2f (radius of curvature)", (poleX + C_x) / 2 - 65, rY - 8, "#a78bfa", 10);

    /* Parallel ray showing focus */
    drawRay(ctx, 20, axisY - 50, poleX - 2, axisY - 50, "#34d399", 6, 1.5);
    drawRay(ctx, poleX - 2, axisY - 50, F_x, axisY, "#34d399", 6, 1.5);
    lbl(ctx, "Parallel ray converges at F", 20, axisY - 58, "#34d399", 9);

    /* Title */
    lbl(ctx, "Concave Mirror — Key Terminology", 14, 20, "#f1f5f9", 13, true);
    lbl(ctx, "R = 2f   |   All distances measured from Pole P", 14, 38, "#94a3b8", 10);
  }, []);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          📐 Mirror Terminology — Labeled Diagram
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Pole (P), Focus (F), Centre of Curvature (C), focal length f, and radius R = 2f
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, display: "block" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 4: All 6 Image Positions for Concave Mirror
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_concave_positions() {
  const positions = [
    { label: "Object at ∞", u: "∞", v: "At F", nature: "Real, Inverted, Point-sized" },
    { label: "Object beyond C", u: "> 2f", v: "Between F & C", nature: "Real, Inverted, Diminished" },
    { label: "Object at C", u: "= 2f", v: "At C", nature: "Real, Inverted, Same Size" },
    { label: "Object between C & F", u: "f < u < 2f", v: "Beyond C", nature: "Real, Inverted, Enlarged" },
    { label: "Object at F", u: "= f", v: "∞", nature: "Image at Infinity" },
    { label: "Object between P & F", u: "< f", v: "Behind mirror", nature: "Virtual, Erect, Enlarged" },
  ];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;
    drawDarkBg(ctx, W, H);

    const pos = positions[selected];
    const axisY = H / 2 + 20;
    const poleX = W * 0.72;
    const R = 150;
    const f = R / 2;
    const F_x = poleX - f;
    const C_x = poleX - R;

    dashed(ctx, 10, axisY, W - 10, axisY, "rgba(100,116,139,0.35)");

    /* Mirror */
    const halfAngle = Math.asin(90 / R);
    ctx.save();
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#3b82f6";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(poleX + R, axisY, R, Math.PI - halfAngle, Math.PI + halfAngle);
    ctx.stroke();
    ctx.restore();

    /* Points */
    const ptsMap: Record<string, number> = { P: poleX, F: F_x, C: C_x };
    for (const [lb, px] of Object.entries(ptsMap)) {
      ctx.save();
      ctx.fillStyle = "#64748b";
      ctx.beginPath();
      ctx.arc(px, axisY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      lbl(ctx, lb, px - 4, axisY + 14, "#64748b", 10, true);
    }

    /* Draw object based on position */
    const uMap: Record<number, number> = { 0: 400, 1: 220, 2: R, 3: 110, 4: f, 5: 40 };
    const objU = uMap[selected];
    const objX = poleX - objU;
    if (objX > 20) {
      const objH = 55;
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
      lbl(ctx, "Object", objX - 16, axisY - objH - 10, "#fbbf24", 9, true);
    } else {
      lbl(ctx, "Object at ∞ →", 12, axisY - 60, "#fbbf24", 11, true);
    }

    /* Info card */
    const cardX = 14, cardY = 12;
    ctx.save();
    ctx.fillStyle = "rgba(15,23,42,0.9)";
    ctx.strokeStyle = "#1e3a5f";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect?.(cardX - 4, cardY - 4, 280, 80, 8);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    lbl(ctx, `Case ${selected + 1}: ${pos.label}`, cardX, cardY + 14, "#60a5fa", 12, true);
    lbl(ctx, `Object: u ${pos.u}`, cardX, cardY + 32, "#fbbf24", 10);
    lbl(ctx, `Image: v = ${pos.v}`, cardX, cardY + 48, "#f87171", 10);
    lbl(ctx, `Nature: ${pos.nature}`, cardX, cardY + 64, "#34d399", 10);
  }, [selected]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          📋 Concave Mirror — All 6 Object Positions
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Click each position to see where the image forms
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 260, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", flexWrap: "wrap", gap: 6, borderTop: "1px solid #1e293b" }}>
        {positions.map((p, i) => (
          <button key={i} onClick={() => setSelected(i)}
            style={{
              padding: "5px 10px", fontSize: 11, borderRadius: 6,
              border: `1px solid ${i === selected ? "#3b82f6" : "#1e293b"}`,
              background: i === selected ? "rgba(59,130,246,0.2)" : "transparent",
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
 * SIMULATION 5: Real-life Uses of Mirrors (animated)
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_mirror_uses() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);
  const [active, setActive] = useState(0);

  const uses = [
    {
      name: "Concave: Torch/Headlight",
      color: "#fbbf24",
      desc: "Object at F → Parallel beam emerges",
    },
    {
      name: "Concave: Shaving/Makeup Mirror",
      color: "#34d399",
      desc: "Object between P & F → Virtual, enlarged image",
    },
    {
      name: "Convex: Rear-view Mirror",
      color: "#f472b6",
      desc: "Always virtual, erect, diminished → wider view",
    },
    {
      name: "Concave: Solar Concentrator",
      color: "#f97316",
      desc: "Parallel sun rays converge at F → intense heat",
    },
  ];

  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      const canvas = canvasRef.current;
      if (!canvas) { rafRef.current = requestAnimationFrame(loop); return; }
      const result = setupCanvas(canvas);
      if (!result) { rafRef.current = requestAnimationFrame(loop); return; }
      const [ctx, W, H] = result;
      tRef.current += 0.04;
      const t = tRef.current;
      drawDarkBg(ctx, W, H);

      const use = uses[active];
      const axisY = H / 2 + 20;
      const poleX = W * 0.68;
      const f = 80;
      const R = 2 * f;
      const F_x = poleX - f;

      dashed(ctx, 20, axisY, W - 20, axisY, "rgba(100,116,139,0.35)");

      if (active === 2) {
        /* Convex mirror */
        const halfA = Math.asin(80 / R);
        ctx.save();
        ctx.strokeStyle = "#a78bfa";
        ctx.lineWidth = 3;
        ctx.shadowColor = "#7c3aed";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(poleX - R, axisY, R, -halfA, halfA);
        ctx.stroke();
        ctx.restore();
      } else {
        /* Concave mirror */
        const halfA = Math.asin(80 / R);
        ctx.save();
        ctx.strokeStyle = "#60a5fa";
        ctx.lineWidth = 3;
        ctx.shadowColor = "#3b82f6";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(poleX + R, axisY, R, Math.PI - halfA, Math.PI + halfA);
        ctx.stroke();
        ctx.restore();
      }

      /* Animated rays for each use case */
      const numRays = 4;
      for (let i = 0; i < numRays; i++) {
        const yOff = (i - (numRays - 1) / 2) * 22;
        const phase = (i / numRays) * Math.PI * 2 - t * 1.5;
        const brightness = 0.5 + 0.5 * Math.sin(phase);

        ctx.save();
        ctx.globalAlpha = 0.4 + brightness * 0.5;

        if (active === 0) {
          /* Torch: from F, reflect as parallel beams */
          drawRay(ctx, F_x, axisY, poleX - 2, axisY + yOff * 0.6, use.color, 6, 1.5);
          drawRay(ctx, poleX - 2, axisY + yOff * 0.6, 20, axisY + yOff, use.color, 6, 1.5);
        } else if (active === 1) {
          /* Shaving mirror: close object, diverging reflected rays */
          const objX = poleX - 30;
          drawRay(ctx, objX + yOff * 0.2, axisY - 30, poleX - 2, axisY + yOff * 0.5, use.color, 6, 1.5);
          drawRay(ctx, poleX - 2, axisY + yOff * 0.5, objX - 30 + yOff * 0.2, axisY - 50 + yOff * 0.8, use.color, 6, 1.5);
        } else if (active === 2) {
          /* Rear view: parallel rays → diverge */
          drawRay(ctx, 20, axisY + yOff, poleX - 2, axisY + yOff * 0.5, use.color, 6, 1.5);
          drawRay(ctx, poleX - 2, axisY + yOff * 0.5, poleX + 60, axisY + yOff * 1.5, use.color, 6, 1.5);
        } else {
          /* Solar concentrator: parallel to axis → converge at F */
          drawRay(ctx, 20, axisY + yOff, poleX - 2, axisY + yOff * 0.5, use.color, 8, 1.5);
          drawRay(ctx, poleX - 2, axisY + yOff * 0.5, F_x, axisY, use.color, 8, 1.5);
        }
        ctx.restore();
      }

      /* Sun/heat effect at F for solar concentrator */
      if (active === 3) {
        ctx.save();
        const glow = 8 + 6 * Math.sin(t * 3);
        ctx.fillStyle = "#fbbf24";
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = glow * 2;
        ctx.beginPath();
        ctx.arc(F_x, axisY, glow * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        lbl(ctx, "🔥 Heat!", F_x - 20, axisY - 20, "#fbbf24", 12, true);
      }

      lbl(ctx, use.name, 14, 22, use.color, 13, true);
      lbl(ctx, use.desc, 14, 40, "#94a3b8", 11);
      lbl(ctx, "F", F_x - 4, axisY + 14, "#f97316", 10, true);
      lbl(ctx, "P", poleX - 4, axisY + 14, "#60a5fa", 10, true);

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [active]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          🌟 Real-life Uses of Mirrors
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Animated demonstration of mirrors in everyday life
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 280, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", flexWrap: "wrap", gap: 6, borderTop: "1px solid #1e293b" }}>
        {uses.map((u, i) => (
          <button key={i} onClick={() => setActive(i)}
            style={{
              padding: "5px 10px", fontSize: 11, borderRadius: 6,
              border: `1px solid ${i === active ? u.color : "#1e293b"}`,
              background: i === active ? "rgba(30,41,59,0.8)" : "transparent",
              color: i === active ? u.color : "#64748b",
              cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif",
            }}>
            {i + 1}. {u.name.split(":")[1]?.trim() || u.name}
          </button>
        ))}
      </div>
    </div>
  );
}
