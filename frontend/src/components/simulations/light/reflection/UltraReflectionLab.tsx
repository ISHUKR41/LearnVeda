"use client";
/**
 * FILE: UltraReflectionLab.tsx
 * PURPOSE: Ultra-realistic Laws of Reflection interactive lab:
 *   - Click anywhere on canvas to set incident ray direction
 *   - Animated photon traveling along incident and reflected rays
 *   - Live angle display (∠i and ∠r arcs)
 *   - Wavefront animation showing wave nature
 *   - Regular vs Diffuse reflection toggle
 *   - Multiple mirror modes: plane, concave, convex overview
 *   - AMBULANCE lateral inversion demo
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

const H_CSS = 420;
type ReflectionMode = "laws" | "diffuse" | "lateral";

export default function UltraReflectionLab() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const modeRef     = useRef<ReflectionMode>("laws");
  const incAngleRef = useRef(40);
  const timeRef     = useRef(0);
  const rafRef      = useRef(0);
  const dragging    = useRef(false);

  const [mode,     setMode]     = useState<ReflectionMode>("laws");
  const [incAngle, setIncAngle] = useState(40);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W   = canvas.clientWidth || 700;
    const H   = canvas.clientHeight || H_CSS;
    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr; canvas.height = H * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    timeRef.current += 0.014;
    const t    = timeRef.current;
    const md   = modeRef.current;
    const angD = incAngleRef.current;
    const angR = (angD * Math.PI) / 180;

    /* ─ Background ─ */
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#030b14"); bg.addColorStop(1, "#060f1c");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(99,102,241,0.04)"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 45) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 45) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    if (md === "laws") drawLawsMode(ctx, W, H, t, angR, angD);
    else if (md === "diffuse") drawDiffuseMode(ctx, W, H, t);
    else drawLateralMode(ctx, W, H, t);

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => { rafRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  const handleCanvas = (e: React.MouseEvent) => {
    if (mode !== "laws") return;
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const mirrorY = (canvas.clientHeight || H_CSS) * 0.62;
    const cx      = (canvas.clientWidth  || 700)   * 0.5;
    if (my < mirrorY) {
      const angle = Math.max(5, Math.min(85, (Math.atan2(Math.abs(mx - cx), mirrorY - my) * 180) / Math.PI));
      incAngleRef.current = angle;
      setIncAngle(Math.round(angle));
    }
  };

  const btnS = (active: boolean, c: string) => ({
    padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" as const,
    border: "1px solid", borderColor: active ? c : "rgba(255,255,255,0.1)",
    background: active ? `${c}28` : "transparent", color: active ? c : "#94a3b8", transition: "all .2s",
  });

  return (
    <div style={{ fontFamily: "Inter,sans-serif", userSelect: "none" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={() => setMode("laws")}    style={btnS(mode === "laws",    "#60a5fa")}>🪞 Laws of Reflection</button>
        <button onClick={() => setMode("diffuse")} style={btnS(mode === "diffuse", "#34d399")}>✨ Regular vs Diffuse</button>
        <button onClick={() => setMode("lateral")} style={btnS(mode === "lateral", "#f472b6")}>🔄 Lateral Inversion</button>
        {mode === "laws" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>∠i:</span>
            <input type="range" min={5} max={85} value={incAngle}
              onChange={e => { incAngleRef.current = Number(e.target.value); setIncAngle(Number(e.target.value)); }}
              style={{ width: 100, accentColor: "#60a5fa" }}
            />
            <span style={{ fontSize: 13, color: "#60a5fa", fontFamily: "monospace", minWidth: 36 }}>{incAngle}°</span>
          </div>
        )}
      </div>
      <canvas ref={canvasRef}
        style={{ width: "100%", height: H_CSS, display: "block", borderRadius: 14, cursor: "crosshair",
          border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 0 40px rgba(96,165,250,0.1)" }}
        onClick={handleCanvas}
        onMouseMove={e => { if (e.buttons === 1) handleCanvas(e); }}
      />
      {mode === "laws" && (
        <div style={{ marginTop: 10, padding: "10px 16px", background: "rgba(8,14,30,0.85)",
          borderRadius: 10, border: "1px solid rgba(96,165,250,0.15)",
          display: "flex", gap: 20, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#60a5fa", fontFamily: "monospace" }}>
            <strong>∠i = ∠r</strong>  (angle of incidence = angle of reflection)
          </span>
          <span style={{ fontSize: 12, color: "#64748b" }}>
            ∠i = {incAngle}°  →  ∠r = {incAngle}°
          </span>
          <span style={{ fontSize: 11, color: "#475569", marginLeft: "auto" }}>
            Click or drag on canvas to change angle
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Laws of Reflection mode ──────────────────────────────────── */
function drawLawsMode(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, angR: number, angD: number) {
  const mirrorY = H * 0.62;
  const cx      = W * 0.5;
  const rayLen  = Math.max(W, H) * 0.55;

  /* Mirror */
  ctx.save();
  const mirrorGrad = ctx.createLinearGradient(W * 0.15, mirrorY, W * 0.85, mirrorY + 6);
  mirrorGrad.addColorStop(0, "rgba(148,163,184,0.0)");
  mirrorGrad.addColorStop(0.5, "rgba(148,163,184,0.9)");
  mirrorGrad.addColorStop(1, "rgba(148,163,184,0.0)");
  ctx.strokeStyle = mirrorGrad; ctx.lineWidth = 4;
  ctx.shadowColor = "#94a3b8"; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.moveTo(W * 0.15, mirrorY); ctx.lineTo(W * 0.85, mirrorY); ctx.stroke();
  /* hatching below */
  ctx.strokeStyle = "rgba(100,116,139,0.3)"; ctx.lineWidth = 1.5; ctx.shadowBlur = 0;
  for (let x = W * 0.15; x < W * 0.85; x += 18) {
    ctx.beginPath(); ctx.moveTo(x, mirrorY); ctx.lineTo(x - 12, mirrorY + 12); ctx.stroke();
  }
  ctx.fillStyle = "rgba(148,163,184,0.5)"; ctx.font = "11px Inter,sans-serif"; ctx.textAlign = "center";
  ctx.fillText("Plane Mirror (Polished Surface)", cx, mirrorY + 26);
  ctx.restore();

  /* Normal */
  ctx.save();
  ctx.strokeStyle = "rgba(148,163,184,0.35)"; ctx.lineWidth = 1.5; ctx.setLineDash([6, 5]);
  ctx.beginPath(); ctx.moveTo(cx, mirrorY - 120); ctx.lineTo(cx, mirrorY + 40); ctx.stroke();
  ctx.fillStyle = "rgba(148,163,184,0.4)"; ctx.font = "11px Inter,sans-serif"; ctx.textAlign = "left"; ctx.setLineDash([]);
  ctx.fillText("Normal", cx + 5, mirrorY - 110);
  ctx.restore();

  /* Incident ray */
  const incFromX = cx - Math.sin(angR) * rayLen;
  const incFromY = mirrorY - Math.cos(angR) * rayLen;
  glowRay(ctx, incFromX, incFromY, cx, mirrorY, "#fbbf24", 2.5, 16);

  /* Reflected ray */
  const reflToX = cx + Math.sin(angR) * rayLen;
  const reflToY = mirrorY - Math.cos(angR) * rayLen;
  glowRay(ctx, cx, mirrorY, reflToX, reflToY, "#60a5fa", 2.5, 16);

  /* Angle arcs */
  /* i arc */
  ctx.save();
  ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2; ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(cx, mirrorY, 52, -Math.PI / 2 - angR, -Math.PI / 2); ctx.stroke();
  ctx.fillStyle = "#fbbf24"; ctx.font = "bold 13px Inter,sans-serif"; ctx.textAlign = "center"; ctx.shadowBlur = 0;
  ctx.fillText(`∠i = ${angD}°`, cx - Math.sin(angR / 2) * 80, mirrorY - Math.cos(angR / 2) * 80 + 4);
  ctx.restore();

  /* r arc */
  ctx.save();
  ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 2; ctx.shadowColor = "#60a5fa"; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(cx, mirrorY, 52, -Math.PI / 2, -Math.PI / 2 + angR); ctx.stroke();
  ctx.fillStyle = "#60a5fa"; ctx.font = "bold 13px Inter,sans-serif"; ctx.textAlign = "center"; ctx.shadowBlur = 0;
  ctx.fillText(`∠r = ${angD}°`, cx + Math.sin(angR / 2) * 80, mirrorY - Math.cos(angR / 2) * 80 + 4);
  ctx.restore();

  /* Animated photons */
  [
    { x1: incFromX, y1: incFromY, x2: cx, y2: mirrorY, color: "#fbbf24" },
    { x1: cx, y1: mirrorY, x2: reflToX, y2: reflToY, color: "#60a5fa" },
  ].forEach(({ x1, y1, x2, y2, color }, pi) => {
    for (let k = 0; k < 2; k++) {
      const ph = (t * 0.55 + pi * 0.5 + k * 0.5) % 1;
      const px = x1 + (x2 - x1) * ph;
      const py = y1 + (y2 - y1) * ph;
      ctx.save();
      ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 18;
      ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  });

  /* Labels */
  ctx.save();
  ctx.fillStyle = "#fbbf24"; ctx.font = "13px Inter,sans-serif"; ctx.textAlign = "right";
  ctx.fillText("Incident Ray", incFromX - 8, incFromY + 4);
  ctx.fillStyle = "#60a5fa"; ctx.textAlign = "left";
  ctx.fillText("Reflected Ray", reflToX + 8, reflToY + 4);
  ctx.restore();

  /* Plane of incidence label */
  ctx.save();
  ctx.fillStyle = "rgba(148,163,184,0.3)"; ctx.font = "11px Inter,sans-serif"; ctx.textAlign = "center";
  ctx.fillText("All rays in the same plane of incidence", cx, H * 0.92);
  ctx.restore();
}

/* ─── Diffuse mode ─────────────────────────────────────────────── */
function drawDiffuseMode(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const halfW   = W / 2;
  const mirrorY = H * 0.58;

  /* Left: smooth (regular) */
  ctx.save();
  ctx.fillStyle = "#1e3a5f"; ctx.font = "bold 14px Inter,sans-serif"; ctx.textAlign = "center";
  ctx.fillText("Regular Reflection", halfW * 0.5, 30);
  ctx.fillStyle = "rgba(56,189,248,0.5)"; ctx.font = "11px Inter,sans-serif";
  ctx.fillText("Smooth surface → parallel reflected rays", halfW * 0.5, 48);
  ctx.restore();

  /* Smooth mirror */
  ctx.save();
  ctx.strokeStyle = "rgba(148,163,184,0.8)"; ctx.lineWidth = 3;
  ctx.shadowColor = "#94a3b8"; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.moveTo(W * 0.06, mirrorY); ctx.lineTo(halfW - 20, mirrorY); ctx.stroke();
  ctx.restore();

  /* Parallel incident rays → parallel reflected rays */
  for (let i = -2; i <= 2; i++) {
    const x  = halfW * 0.5 + i * 24;
    const y0 = mirrorY - 100;
    glowRay(ctx, x, y0, x, mirrorY, "#fbbf24", 1.5, 8);
    glowRay(ctx, x, mirrorY, x - 30, mirrorY - 80, "#60a5fa", 1.5, 8);
  }

  /* Right: rough (diffuse) */
  ctx.save();
  ctx.fillStyle = "#1e3a5f"; ctx.font = "bold 14px Inter,sans-serif"; ctx.textAlign = "center";
  ctx.fillText("Diffuse Reflection", halfW + halfW * 0.5, 30);
  ctx.fillStyle = "rgba(52,211,153,0.5)"; ctx.font = "11px Inter,sans-serif";
  ctx.fillText("Rough surface → scattered reflected rays", halfW + halfW * 0.5, 48);
  ctx.restore();

  /* Rough surface */
  ctx.save();
  ctx.strokeStyle = "rgba(148,163,184,0.6)"; ctx.lineWidth = 2;
  ctx.shadowColor = "#94a3b8"; ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(halfW + 20, mirrorY);
  for (let x = halfW + 20; x < W - 20; x += 14) {
    ctx.lineTo(x + 7, mirrorY - 6 - (Math.sin(x * 0.3) * 5));
    ctx.lineTo(x + 14, mirrorY + (Math.sin(x * 0.25) * 4));
  }
  ctx.stroke();
  ctx.restore();

  /* Scattered reflected rays */
  const angles = [-70, -40, -10, 20, 55, 75, 15, -55, -25, 40];
  for (let i = 0; i < 5; i++) {
    const x  = halfW * 1.35 + i * 20;
    const ra = ((angles[i] || 30) * Math.PI) / 180;
    glowRay(ctx, x, mirrorY - 90, x, mirrorY, "#fbbf24", 1.5, 8);
    glowRay(ctx, x, mirrorY, x + Math.sin(ra) * 80, mirrorY - Math.abs(Math.cos(ra)) * 80, "#34d399", 1.5, 8);
  }

  /* Divider */
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(halfW, 0); ctx.lineTo(halfW, H); ctx.stroke();
  ctx.restore();

  /* Legend */
  ctx.save();
  ctx.fillStyle = "rgba(148,163,184,0.4)"; ctx.font = "11px Inter,sans-serif"; ctx.textAlign = "center";
  ctx.fillText("Regular reflection → forms CLEAR IMAGE (mirror)", halfW * 0.5, H - 18);
  ctx.fillText("Diffuse reflection → MAKES OBJECTS VISIBLE everywhere", halfW + halfW * 0.5, H - 18);
  ctx.restore();
}

/* ─── Lateral inversion mode ───────────────────────────────────── */
function drawLateralMode(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const mirrorX = W * 0.52;
  const cy      = H * 0.5;

  /* Mirror (vertical) */
  ctx.save();
  const mg = ctx.createLinearGradient(mirrorX, H * 0.1, mirrorX, H * 0.9);
  mg.addColorStop(0, "rgba(148,163,184,0)"); mg.addColorStop(0.5, "rgba(148,163,184,0.85)"); mg.addColorStop(1, "rgba(148,163,184,0)");
  ctx.strokeStyle = mg; ctx.lineWidth = 4; ctx.shadowColor = "#94a3b8"; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.moveTo(mirrorX, H * 0.1); ctx.lineTo(mirrorX, H * 0.9); ctx.stroke();
  for (let y = H * 0.1; y < H * 0.9; y += 16) {
    ctx.strokeStyle = "rgba(100,116,139,0.3)"; ctx.lineWidth = 1.5; ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.moveTo(mirrorX, y); ctx.lineTo(mirrorX + 12, y + 8); ctx.stroke();
  }
  ctx.restore();

  /* AMBULANCE text (object) */
  ctx.save();
  ctx.font = "bold 32px 'Space Grotesk', monospace";
  ctx.fillStyle = "#f59e0b"; ctx.shadowColor = "#f59e0b"; ctx.shadowBlur = 12;
  ctx.textAlign = "right";
  ctx.fillText("AMBULANCE", mirrorX - 24, cy + 10);
  ctx.restore();

  /* Mirror image (reversed) */
  ctx.save();
  ctx.save();
  ctx.translate(mirrorX + 24, cy + 10);
  ctx.scale(-1, 1);
  ctx.font = "bold 32px 'Space Grotesk', monospace";
  ctx.fillStyle = "rgba(245,158,11,0.55)"; ctx.shadowColor = "#f59e0b"; ctx.shadowBlur = 8;
  ctx.textAlign = "left";
  ctx.fillText("AMBULANCE", 0, 0);
  ctx.restore();
  ctx.restore();

  /* Arrow showing reflection rays */
  glowRay(ctx, mirrorX - 150, cy - 10, mirrorX, cy - 10, "#fbbf24", 1.5, 8);
  glowRay(ctx, mirrorX, cy - 10, mirrorX + 150, cy - 10, "#60a5fa", 1.5, 8, true);

  /* Explanation */
  ctx.save();
  ctx.fillStyle = "#64748b"; ctx.font = "12px Inter,sans-serif"; ctx.textAlign = "center";
  ctx.fillText("Plane mirror swaps LEFT ↔ RIGHT (lateral inversion)", W / 2, cy + 60);
  ctx.fillText("UP ↔ DOWN is NOT reversed in a plane mirror", W / 2, cy + 78);
  ctx.fillStyle = "#f472b6"; ctx.font = "bold 12px Inter,sans-serif";
  ctx.fillText("This is why AMBULANCE is written reversed →", W / 2, cy + 100);
  ctx.fillText("so drivers read it correctly in their rear-view mirror", W / 2, cy + 118);
  ctx.restore();
}

function glowRay(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, lw: number, blur: number, dashed = false) {
  ctx.save();
  if (dashed) ctx.setLineDash([5, 5]);
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.shadowColor = color; ctx.shadowBlur = blur; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  if (!dashed) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 9 * Math.cos(a - 0.4), y2 - 9 * Math.sin(a - 0.4));
    ctx.lineTo(x2 - 9 * Math.cos(a + 0.4), y2 - 9 * Math.sin(a + 0.4));
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
