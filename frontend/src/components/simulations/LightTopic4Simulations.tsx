"use client";
/**
 * FILE: LightTopic4Simulations.tsx
 * LOCATION: src/components/simulations/LightTopic4Simulations.tsx
 * PURPOSE: 5 interactive canvas simulations for Class 10 Light — Topic 4:
 *          Refraction of Light and Laws of Refraction.
 *
 * SIMULATIONS:
 *   1. Sim_light_refraction_demo    — refraction at interface with adjustable angle
 *   2. Sim_light_snells_law         — Snell's law interactive (n1 sinθ1 = n2 sinθ2)
 *   3. Sim_light_tir                — total internal reflection with critical angle
 *   4. Sim_light_optical_fiber      — light bouncing in optical fiber
 *   5. Sim_light_apparent_depth     — apparent depth vs real depth demo
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
  color: string, glow = 8, lw = 2, arrow = true,
) {
  ctx.save();
  ctx.shadowColor = color; ctx.shadowBlur = glow;
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  if (arrow) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > 10) {
      const ux = dx / len, uy = dy / len, ah = 10;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - ah * (ux - 0.4 * uy), y2 - ah * (uy + 0.4 * ux));
      ctx.lineTo(x2 - ah * (ux + 0.4 * uy), y2 - ah * (uy - 0.4 * ux));
      ctx.closePath(); ctx.fill();
    }
  }
  ctx.restore();
}

function dash(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color = "rgba(148,163,184,0.4)", d = [5, 4],
) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.setLineDash(d);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

function txt(
  ctx: CanvasRenderingContext2D,
  t: string, x: number, y: number,
  color = "#e2e8f0", size = 11, bold = false,
) {
  ctx.save();
  ctx.font = `${bold ? "bold " : ""}${size}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = color; ctx.fillText(t, x, y);
  ctx.restore();
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 1: Refraction Demo
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_refraction_demo() {
  const [angle, setAngle] = useState(40); /* angle of incidence in degrees */
  const [n2, setN2] = useState(1.5);      /* refractive index of second medium */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    bg(ctx, W, H);

    const ifaceY = H / 2; /* interface y */
    const ifaceX = W / 2; /* center */

    /* Medium labels */
    ctx.save();
    ctx.fillStyle = "rgba(59,130,246,0.08)";
    ctx.fillRect(0, 0, W, ifaceY);
    ctx.fillStyle = "rgba(99,102,241,0.12)";
    ctx.fillRect(0, ifaceY, W, H - ifaceY);
    ctx.restore();

    txt(ctx, "Medium 1: Air (n₁ = 1.00)", 14, 20, "#60a5fa", 11, true);
    txt(ctx, "Medium 2: Glass (n₂ = " + n2.toFixed(2) + ")", 14, ifaceY + 22, "#a78bfa", 11, true);

    /* Interface line */
    ctx.save();
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, ifaceY);
    ctx.lineTo(W, ifaceY);
    ctx.stroke();
    ctx.restore();

    /* Normal line (dashed) */
    dash(ctx, ifaceX, 20, ifaceX, H - 20, "rgba(250,204,21,0.4)");
    txt(ctx, "Normal", ifaceX + 6, 30, "#fbbf24", 9);

    /* Incident ray */
    const incAngleRad = (angle * Math.PI) / 180;
    const rayLen = 120;
    const incX1 = ifaceX - Math.sin(incAngleRad) * rayLen;
    const incY1 = ifaceY - Math.cos(incAngleRad) * rayLen;
    ray(ctx, incX1, incY1, ifaceX, ifaceY, "#f97316", 10, 2.5);
    txt(ctx, "Incident Ray", incX1 - 75, incY1 - 4, "#f97316", 10, true);

    /* Refracted ray using Snell's law: n1 sinθ1 = n2 sinθ2 */
    const n1 = 1.0;
    const sinθ2 = (n1 * Math.sin(incAngleRad)) / n2;
    const isTIR = sinθ2 > 1;

    if (!isTIR) {
      const θ2 = Math.asin(sinθ2);
      const refX2 = ifaceX + Math.sin(θ2) * rayLen;
      const refY2 = ifaceY + Math.cos(θ2) * rayLen;
      ray(ctx, ifaceX, ifaceY, refX2, refY2, "#a78bfa", 10, 2.5);
      txt(ctx, "Refracted Ray", refX2 - 20, refY2 + 14, "#a78bfa", 10, true);
      /* Refracted angle arc */
      ctx.save();
      ctx.strokeStyle = "#a78bfa";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(ifaceX, ifaceY, 44, Math.PI / 2, Math.PI / 2 + θ2);
      ctx.stroke();
      ctx.restore();
      txt(ctx, `θ₂=${Math.round(θ2 * 180 / Math.PI)}°`, ifaceX + 10, ifaceY + 50, "#a78bfa", 11, true);
    } else {
      /* TIR */
      const reflX2 = ifaceX + Math.sin(incAngleRad) * rayLen;
      const reflY2 = ifaceY - Math.cos(incAngleRad) * rayLen;
      ray(ctx, ifaceX, ifaceY, reflX2, reflY2, "#f87171", 10, 2.5);
      txt(ctx, "⚡ Total Internal Reflection!", ifaceX - 80, ifaceY + 26, "#f87171", 11, true);
    }

    /* Incident angle arc */
    ctx.save();
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(ifaceX, ifaceY, 44, -Math.PI / 2, -Math.PI / 2 + incAngleRad, true);
    ctx.stroke();
    ctx.restore();
    txt(ctx, `θ₁=${angle}°`, ifaceX - 68, ifaceY - 48, "#f97316", 11, true);

    /* Snell's law display */
    const θ2Deg = isTIR ? "TIR" : Math.round(Math.asin(sinθ2) * 180 / Math.PI) + "°";
    txt(ctx, "Snell's Law:", W - 180, 18, "#94a3b8", 10);
    txt(ctx, "n₁ sin θ₁ = n₂ sin θ₂", W - 180, 32, "#e2e8f0", 11, true);
    txt(ctx, `1.00 × sin(${angle}°) = ${n2.toFixed(2)} × sin(θ₂)`, W - 180, 48, "#94a3b8", 10);
    txt(ctx, `θ₂ = ${θ2Deg}`, W - 180, 64, "#a78bfa", 13, true);

    /* Bending direction note */
    if (!isTIR && angle > 0) {
      const bends = n2 > n1 ? "bends TOWARDS normal (denser medium)" : "bends AWAY from normal";
      txt(ctx, bends, 14, H - 12, "#64748b", 10);
    }
  }, [angle, n2]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          🌊 Refraction of Light
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Light bends when it changes medium — adjust angle and refractive index
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 300, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui", width: 130 }}>Angle of incidence:</span>
          <input type="range" min={0} max={89} step={1} value={angle}
            onChange={e => setAngle(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#f97316" }} />
          <span style={{ color: "#f97316", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 40 }}>{angle}°</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui", width: 130 }}>n₂ (glass index):</span>
          <input type="range" min={1.0} max={2.5} step={0.05} value={n2}
            onChange={e => setN2(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#a78bfa" }} />
          <span style={{ color: "#a78bfa", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 40 }}>{n2.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 2: Snell's Law Interactive
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_snells_law() {
  const [n1, setN1] = useState(1.0);
  const [n2, setN2] = useState(1.5);
  const [theta1, setTheta1] = useState(45);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    bg(ctx, W, H);

    const ifY = H / 2;
    const cx = W / 2;
    const t1 = (theta1 * Math.PI) / 180;
    const sinT2 = (n1 * Math.sin(t1)) / n2;
    const isTIR = sinT2 >= 1;
    const t2 = isTIR ? null : Math.asin(sinT2);

    /* Media blocks */
    ctx.save();
    ctx.fillStyle = `rgba(59,130,246,${Math.min(0.15, n1 * 0.06)})`;
    ctx.fillRect(0, 0, W, ifY);
    ctx.fillStyle = `rgba(99,102,241,${Math.min(0.2, n2 * 0.07)})`;
    ctx.fillRect(0, ifY, W, H - ifY);
    ctx.restore();

    /* Interface */
    ctx.save();
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, ifY);
    ctx.lineTo(W, ifY);
    ctx.stroke();
    ctx.restore();

    dash(ctx, cx, 15, cx, H - 15, "rgba(250,204,21,0.5)");

    /* Incident */
    const rLen = 130;
    const ix = cx - Math.sin(t1) * rLen, iy = ifY - Math.cos(t1) * rLen;
    ray(ctx, ix, iy, cx, ifY, "#f97316", 12, 2.5);

    if (isTIR) {
      /* Reflected ray */
      const rx = cx + Math.sin(t1) * rLen, ry = ifY - Math.cos(t1) * rLen;
      ray(ctx, cx, ifY, rx, ry, "#f87171", 12, 2.5);
      txt(ctx, "⚡ TIR — increase n₂ or decrease θ₁", cx - 130, ifY + 30, "#f87171", 11, true);
    } else if (t2 !== null) {
      const rx2 = cx + Math.sin(t2) * rLen, ry2 = ifY + Math.cos(t2) * rLen;
      ray(ctx, cx, ifY, rx2, ry2, "#a78bfa", 12, 2.5);
      txt(ctx, `θ₂ = ${(t2 * 180 / Math.PI).toFixed(1)}°`, cx + 10, ifY + 58, "#a78bfa", 12, true);
      /* Angle arc refracted */
      ctx.save();
      ctx.strokeStyle = "#a78bfa";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, ifY, 50, Math.PI / 2, Math.PI / 2 + t2);
      ctx.stroke();
      ctx.restore();
    }

    /* Angle arc incident */
    ctx.save();
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, ifY, 50, -Math.PI / 2 + t1, -Math.PI / 2, true);
    ctx.stroke();
    ctx.restore();
    txt(ctx, `θ₁ = ${theta1}°`, cx - 80, ifY - 54, "#f97316", 12, true);

    /* Medium labels */
    txt(ctx, `n₁ = ${n1.toFixed(2)}`, 14, 20, "#60a5fa", 12, true);
    txt(ctx, `n₂ = ${n2.toFixed(2)}`, 14, ifY + 22, "#a78bfa", 12, true);

    /* Big formula */
    txt(ctx, "n₁ sin θ₁ = n₂ sin θ₂", W - 220, 24, "#f1f5f9", 13, true);
    txt(ctx, `${n1.toFixed(2)} × sin(${theta1}°) = ${n2.toFixed(2)} × sin(θ₂)`, W - 220, 42, "#94a3b8", 10);
    txt(ctx, isTIR ? "No refraction (TIR)" : `sin θ₂ = ${sinT2.toFixed(4)}`, W - 220, 58, isTIR ? "#f87171" : "#a78bfa", 11, true);

    /* Critical angle */
    if (n2 < n1) {
      const critA = Math.asin(n2 / n1) * 180 / Math.PI;
      txt(ctx, `Critical angle = ${critA.toFixed(1)}°`, W - 200, H - 14, "#fbbf24", 10);
    }

    txt(ctx, "Incident ray passes from medium 1 → medium 2", 14, H - 12, "#334155", 9);
  }, [n1, n2, theta1]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          📐 Snell's Law — n₁ sin θ₁ = n₂ sin θ₂
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Adjust refractive indices and angle — watch the refracted ray change
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 290, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: 7, borderTop: "1px solid #1e293b" }}>
        {[
          { label: "n₁:", val: n1, set: setN1, min: 1.0, max: 2.5, step: 0.05, color: "#60a5fa" },
          { label: "n₂:", val: n2, set: setN2, min: 1.0, max: 2.5, step: 0.05, color: "#a78bfa" },
          { label: "θ₁:", val: theta1, set: setTheta1, min: 0, max: 89, step: 1, color: "#f97316" },
        ].map(ctrl => (
          <div key={ctrl.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui", width: 30 }}>{ctrl.label}</span>
            <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step} value={ctrl.val}
              onChange={e => ctrl.set(Number(e.target.value) as any)}
              style={{ flex: 1, accentColor: ctrl.color }} />
            <span style={{ color: ctrl.color, fontSize: 12, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 45 }}>
              {ctrl.label === "θ₁:" ? ctrl.val + "°" : (ctrl.val as number).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 3: Total Internal Reflection
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_tir() {
  const [angle, setAngle] = useState(35);
  const [n, setN] = useState(1.5); /* refractive index of denser medium */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    bg(ctx, W, H);

    const critAngle = Math.asin(1.0 / n) * 180 / Math.PI;
    const ifY = H * 0.4; /* interface — light going from glass (below) to air (above) */
    const cx = W / 2;

    /* Media */
    ctx.save();
    ctx.fillStyle = "rgba(99,102,241,0.12)";
    ctx.fillRect(0, ifY, W, H - ifY);
    ctx.fillStyle = "rgba(14,165,233,0.06)";
    ctx.fillRect(0, 0, W, ifY);
    ctx.restore();

    txt(ctx, "Air (n = 1.00) — less dense", 14, 20, "#38bdf8", 11, true);
    txt(ctx, `Glass (n = ${n.toFixed(2)}) — denser medium`, 14, ifY + 22, "#a78bfa", 11, true);

    /* Interface */
    ctx.save();
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, ifY);
    ctx.lineTo(W, ifY);
    ctx.stroke();
    ctx.restore();

    dash(ctx, cx, 10, cx, H - 10, "rgba(250,204,21,0.4)");

    const t1 = (angle * Math.PI) / 180;
    const rLen = 130;

    /* Incident ray from below (glass medium) */
    const incX = cx - Math.sin(t1) * rLen, incY = ifY + Math.cos(t1) * rLen;
    ray(ctx, incX, incY, cx, ifY, "#f97316", 12, 2.5);
    txt(ctx, "Incident Ray", incX - 60, incY + 14, "#f97316", 10, true);

    /* Refracted or TIR */
    const sinOut = n * Math.sin(t1);
    const isTIR = sinOut >= 1.0;

    if (isTIR) {
      /* Total internal reflection */
      const rX = cx + Math.sin(t1) * rLen, rY = ifY + Math.cos(t1) * rLen;
      ray(ctx, cx, ifY, rX, rY, "#f87171", 14, 3);
      txt(ctx, "Reflected Ray (TIR)", rX - 20, rY + 14, "#f87171", 10, true);
      txt(ctx, "⚡ TOTAL INTERNAL REFLECTION!", cx - 120, ifY - 25, "#fbbf24", 12, true);
      /* Glow at interface */
      ctx.save();
      ctx.fillStyle = "rgba(251,191,36,0.2)";
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(cx, ifY, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      /* Partial refraction and partial reflection */
      const tOut = Math.asin(sinOut);
      const refX = cx + Math.sin(tOut) * rLen, refY = ifY - Math.cos(tOut) * rLen;
      ray(ctx, cx, ifY, refX, refY, "#38bdf8", 8, 2);
      txt(ctx, "Refracted Ray", refX - 10, refY - 12, "#38bdf8", 10, true);
      /* Partial reflection */
      const rX = cx + Math.sin(t1) * rLen * 0.4, rY = ifY + Math.cos(t1) * rLen * 0.4;
      ctx.save();
      ctx.globalAlpha = 0.35;
      ray(ctx, cx, ifY, rX, rY, "#f87171", 6, 1.5);
      ctx.restore();
      txt(ctx, `Refracted: ${(tOut * 180 / Math.PI).toFixed(1)}°`, cx + 10, ifY - 48, "#38bdf8", 11, true);
    }

    /* Angle arc */
    ctx.save();
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, ifY, 48, Math.PI / 2, Math.PI / 2 + t1);
    ctx.stroke();
    ctx.restore();
    txt(ctx, `θ = ${angle}°`, cx + 12, ifY + 52, "#f97316", 11, true);

    /* Critical angle info */
    const isTIRState = isTIR;
    txt(ctx, `Critical Angle = ${critAngle.toFixed(1)}°`, W - 200, 18, "#fbbf24", 11, true);
    txt(ctx, `θ_c = sin⁻¹(1/n₂) = sin⁻¹(1/${n.toFixed(2)})`, W - 200, 34, "#94a3b8", 9);
    txt(ctx, isTIRState ? `✅ θ > θ_c → TIR occurs` : `θ < θ_c → light passes through`, W - 200, 50,
      isTIRState ? "#34d399" : "#94a3b8", 10, isTIRState);
    txt(ctx, "Applications: Optical fibre, diamonds, prisms", 14, H - 12, "#64748b", 9);
  }, [angle, n]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          💎 Total Internal Reflection (TIR)
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          When angle exceeds critical angle, light cannot escape the denser medium
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 300, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: 7, borderTop: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui", width: 130 }}>Angle of incidence:</span>
          <input type="range" min={0} max={89} step={1} value={angle}
            onChange={e => setAngle(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#f97316" }} />
          <span style={{ color: "#f97316", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 40 }}>{angle}°</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui", width: 130 }}>n₂ (glass):</span>
          <input type="range" min={1.2} max={2.8} step={0.05} value={n}
            onChange={e => setN(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#a78bfa" }} />
          <span style={{ color: "#a78bfa", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 40 }}>{n.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 4: Optical Fiber (animated)
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_optical_fiber() {
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
      tRef.current += 0.03;
      const t = tRef.current;
      bg(ctx, W, H);

      const fiberY = H / 2;
      const fiberH = 50; /* half-height of fiber */
      const fiberX1 = 40, fiberX2 = W - 40;

      /* Draw fiber cladding */
      ctx.save();
      ctx.fillStyle = "rgba(30,58,138,0.3)";
      ctx.strokeStyle = "#1e3a8a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(fiberX1, fiberY - fiberH - 8, fiberX2 - fiberX1, (fiberH + 8) * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      /* Draw fiber core */
      ctx.save();
      ctx.fillStyle = "rgba(99,102,241,0.15)";
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.rect(fiberX1, fiberY - fiberH, fiberX2 - fiberX1, fiberH * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      /* Labels */
      txt(ctx, "Glass Core (denser)", fiberX1 + 8, fiberY + fiberH + 18, "#818cf8", 10, true);
      txt(ctx, "Cladding (less dense)", fiberX1 + 8, fiberY + fiberH + 30, "#1e40af", 9);
      txt(ctx, "Total Internal Reflection →", fiberX1, 20, "#fbbf24", 11, true);
      txt(ctx, "Light signal travels thousands of km with zero loss!", fiberX1, 36, "#64748b", 9);

      /* Animated bouncing light ray */
      const period = 120; /* px per bounce cycle */
      const numBounces = Math.floor((fiberX2 - fiberX1) / (period / 2)) + 1;
      const phase = (t * 40) % period;

      /* Draw the zigzag light path */
      const points: [number, number][] = [];
      let x = fiberX1;
      let goingUp = true;
      while (x <= fiberX2) {
        const y = goingUp ? fiberY - fiberH + 4 : fiberY + fiberH - 4;
        points.push([x, y]);
        x += period / 2;
        goingUp = !goingUp;
      }

      /* Animated light pulse on path */
      const pathLen = (points.length - 1) * (period / 2);
      const pulseT = (t * 50) % pathLen;

      /* Draw path */
      for (let i = 0; i < points.length - 1; i++) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[i + 1];
        const segStart = i * (period / 2);
        const segEnd = (i + 1) * (period / 2);
        const alpha = (pulseT >= segStart - 20 && pulseT <= segEnd + 20) ? 1.0 : 0.25;
        ctx.save();
        ctx.globalAlpha = alpha;
        ray(ctx, x1, y1, x2, y2, "#f97316", 10, 2, false);
        ctx.restore();
      }

      /* Reflection dots at walls */
      for (let i = 1; i < points.length - 1; i++) {
        const [rx, ry] = points[i];
        ctx.save();
        ctx.fillStyle = "#fbbf24";
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(rx, ry, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      /* Light source on left */
      ctx.save();
      ctx.fillStyle = "#fef08a";
      ctx.shadowColor = "#fef08a";
      ctx.shadowBlur = 15 + 5 * Math.sin(t * 4);
      ctx.beginPath();
      ctx.arc(fiberX1 - 12, fiberY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      txt(ctx, "💡", fiberX1 - 30, fiberY + 4, "#fef08a", 14);

      /* Receiver on right */
      ctx.save();
      ctx.fillStyle = "#34d399";
      ctx.shadowColor = "#34d399";
      ctx.shadowBlur = 12 + 4 * Math.sin(t * 4 + 2);
      ctx.beginPath();
      ctx.arc(fiberX2 + 12, fiberY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      txt(ctx, "📡", fiberX2 + 4, fiberY + 4, "#34d399", 12);

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          🔆 Optical Fiber — TIR in Action
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Light bounces by total internal reflection, carrying data with zero loss
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 240, display: "block" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 5: Apparent Depth Demo
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_apparent_depth() {
  const [realDepth, setRealDepth] = useState(120); /* px */
  const [n, setN] = useState(1.33); /* water */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    bg(ctx, W, H);

    const waterTopY = H * 0.3;
    const cx = W / 2;

    /* Water */
    ctx.save();
    ctx.fillStyle = "rgba(14,165,233,0.12)";
    ctx.fillRect(0, waterTopY, W, H - waterTopY);
    ctx.strokeStyle = "#0369a1";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, waterTopY);
    ctx.lineTo(W, waterTopY);
    ctx.stroke();
    ctx.restore();

    txt(ctx, "Air", 14, waterTopY - 10, "#38bdf8", 11, true);
    txt(ctx, "Water (n = " + n.toFixed(2) + ")", 14, waterTopY + 18, "#0ea5e9", 11, true);

    const coinY = waterTopY + realDepth;
    const appDepth = realDepth / n;
    const appCoinY = waterTopY + appDepth;

    /* Real coin at bottom */
    ctx.save();
    ctx.fillStyle = "#fbbf24";
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.ellipse(cx, coinY, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    txt(ctx, "Real coin", cx + 24, coinY + 4, "#fbbf24", 10, true);
    txt(ctx, `Real depth = ${realDepth}px`, cx + 24, coinY + 16, "#fbbf24", 9);

    /* Virtual image of coin (apparent position) */
    ctx.save();
    ctx.fillStyle = "rgba(248,113,113,0.4)";
    ctx.strokeStyle = "#f87171";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.ellipse(cx, appCoinY, 18, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    txt(ctx, "Apparent coin", cx + 24, appCoinY - 4, "#f87171", 10, true);
    txt(ctx, `Apparent depth = ${appDepth.toFixed(0)}px`, cx + 24, appCoinY + 8, "#f87171", 9);

    /* Rays going from real coin to eye */
    const eyeX = cx - 50, eyeY = waterTopY - 50;
    /* Two diverging rays from coin, bending at surface */
    for (const offset of [-20, 20]) {
      const hitX = cx + offset;
      const hitY = waterTopY;
      /* In water */
      ray(ctx, cx, coinY, hitX, hitY, "#fbbf24", 6, 1.5);
      /* In air (bends away from normal) */
      const extraX = hitX - cx; /* direction */
      const outX = hitX + extraX * 0.7, outY = waterTopY - 50;
      ray(ctx, hitX, hitY, outX, outY, "#38bdf8", 6, 1.5);
      /* Dashed extension to apparent image */
      dash(ctx, hitX, hitY, cx, appCoinY, "rgba(248,113,113,0.4)");
    }

    /* Eye */
    ctx.save();
    ctx.fillStyle = "#f1f5f9";
    ctx.shadowColor = "#f1f5f9";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(cx, eyeY - 10, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    txt(ctx, "👁 Observer", cx - 30, eyeY - 24, "#94a3b8", 10);

    /* Formula box */
    const bx = 14, by = 12;
    ctx.save();
    ctx.fillStyle = "rgba(15,23,42,0.9)";
    ctx.strokeStyle = "#1e3a5f";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect?.(bx, by, 220, 72, 8);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    txt(ctx, "Apparent Depth Formula:", bx + 8, by + 16, "#60a5fa", 11, true);
    txt(ctx, "d_apparent = d_real / n", bx + 8, by + 32, "#e2e8f0", 11);
    txt(ctx, `= ${realDepth} / ${n.toFixed(2)} = ${appDepth.toFixed(1)} px`, bx + 8, by + 48, "#34d399", 12, true);
    txt(ctx, "Object appears shallower than it is!", bx + 8, by + 62, "#94a3b8", 9);

    txt(ctx, "Why a swimming pool looks shallower than it is →", 14, H - 10, "#64748b", 9);
  }, [realDepth, n]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          🏊 Apparent Depth — Why pools look shallow
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Refraction makes objects in water appear closer to the surface than they are
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: 7, borderTop: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui", width: 110 }}>Real depth:</span>
          <input type="range" min={50} max={180} step={5} value={realDepth}
            onChange={e => setRealDepth(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#fbbf24" }} />
          <span style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 50 }}>{realDepth}px</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui", width: 110 }}>n (liquid):</span>
          <input type="range" min={1.0} max={2.0} step={0.01} value={n}
            onChange={e => setN(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#0ea5e9" }} />
          <span style={{ color: "#0ea5e9", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 50 }}>{n.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
