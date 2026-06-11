"use client";
/**
 * FILE: UltraTIRSim.tsx
 * PURPOSE: Ultra-realistic Total Internal Reflection simulation:
 *   - Dense-to-rare medium boundary (glass → air)
 *   - Drag angle past critical angle to trigger TIR
 *   - Optical fibre mode with zig-zag light path
 *   - Diamond brilliance mode
 *   - Critical angle formula display
 *   - Animated photon pulses
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

const H_CSS = 440;
type TIRMode = "basic" | "fibre" | "diamond";

const MEDIA: Record<string, { n: number; label: string; color: string; critFrom1: string }> = {
  "glass-air":    { n: 1.50, label: "Glass → Air",    color: "#38bdf8", critFrom1: `sin⁻¹(1.00/1.50) = 41.8°` },
  "water-air":    { n: 1.33, label: "Water → Air",    color: "#22d3ee", critFrom1: `sin⁻¹(1.00/1.33) = 48.8°` },
  "diamond-air":  { n: 2.42, label: "Diamond → Air",  color: "#f9a8d4", critFrom1: `sin⁻¹(1.00/2.42) = 24.4°` },
};

export default function UltraTIRSim() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const modeRef    = useRef<TIRMode>("basic");
  const angleRef   = useRef(35);
  const mediumRef  = useRef("glass-air");
  const timeRef    = useRef(0);
  const rafRef     = useRef(0);

  const [mode,   setMode]   = useState<TIRMode>("basic");
  const [angle,  setAngle]  = useState(35);
  const [medium, setMedium] = useState("glass-air");

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
    timeRef.current += 0.016;
    const t = timeRef.current;
    const md = modeRef.current;

    /* Background */
    ctx.fillStyle = "#030b14"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(99,102,241,0.04)"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    if (md === "basic") drawBasicTIR(ctx, W, H, t, angleRef.current, mediumRef.current);
    else if (md === "fibre") drawFibreMode(ctx, W, H, t);
    else drawDiamondMode(ctx, W, H, t);

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => { rafRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { mediumRef.current = medium; }, [medium]);

  const med = MEDIA[medium] || MEDIA["glass-air"];
  const critAngle = Math.asin(1 / med.n) * 180 / Math.PI;
  const isTIR = angle >= critAngle;

  const btnS = (active: boolean, c: string) => ({
    padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" as const,
    border: "1px solid", borderColor: active ? c : "rgba(255,255,255,0.1)",
    background: active ? `${c}28` : "transparent", color: active ? c : "#94a3b8",
  });

  return (
    <div style={{ fontFamily: "Inter,sans-serif", userSelect: "none" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={() => setMode("basic")}   style={btnS(mode === "basic",   "#f97316")}>⚡ TIR Lab</button>
        <button onClick={() => setMode("fibre")}   style={btnS(mode === "fibre",   "#38bdf8")}>💡 Optical Fibre</button>
        <button onClick={() => setMode("diamond")} style={btnS(mode === "diamond", "#f9a8d4")}>💎 Diamond Brilliance</button>
        {mode === "basic" && (<>
          <div style={{ display: "flex", gap: 6 }}>
            {Object.entries(MEDIA).map(([k, v]) => (
              <button key={k} onClick={() => setMedium(k)} style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                border: "1px solid", borderColor: medium === k ? v.color : "rgba(255,255,255,0.08)",
                background: medium === k ? `${v.color}22` : "transparent",
                color: medium === k ? v.color : "#64748b",
              }}>{v.label}</button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            <span style={{ fontSize: 11, color: "#64748b" }}>θ:</span>
            <input type="range" min={0} max={89} value={angle}
              onChange={e => { angleRef.current = Number(e.target.value); setAngle(Number(e.target.value)); }}
              style={{ width: 100, accentColor: isTIR ? "#f97316" : "#38bdf8" }} />
            <span style={{ fontSize: 13, fontFamily: "monospace", color: isTIR ? "#f97316" : "#38bdf8", minWidth: 40 }}>
              {angle}°{isTIR ? "🔥" : ""}
            </span>
          </div>
        </>)}
      </div>
      <canvas ref={canvasRef}
        style={{ width: "100%", height: H_CSS, display: "block", borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: isTIR ? "0 0 50px rgba(249,115,22,0.25)" : "0 0 30px rgba(56,189,248,0.1)" }} />
      {mode === "basic" && (
        <div style={{
          marginTop: 10, padding: "10px 16px", background: "rgba(8,14,30,0.85)",
          borderRadius: 10, border: `1px solid ${isTIR ? "rgba(249,115,22,0.3)" : "rgba(56,189,248,0.15)"}`,
          display: "flex", gap: 16, flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 12, color: "#38bdf8", fontFamily: "monospace" }}>
            Critical angle: <strong>θ_c = sin⁻¹(n₂/n₁) = {critAngle.toFixed(1)}°</strong>
          </span>
          <span style={{ fontSize: 12, color: isTIR ? "#f97316" : "#94a3b8", fontWeight: isTIR ? 700 : 400 }}>
            {isTIR ? "⚡ TIR ACTIVE — θ ≥ θ_c" : `θ < θ_c → refraction occurs`}
          </span>
        </div>
      )}
    </div>
  );
}

function drawBasicTIR(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, angleDeg: number, medium: string) {
  const med       = MEDIA[medium] || MEDIA["glass-air"];
  const n1        = med.n;
  const n2        = 1.0;
  const critAngle = Math.asin(n2 / n1) * 180 / Math.PI;
  const isTIR     = angleDeg >= critAngle;
  const cx        = W * 0.5;
  const interfaceY = H * 0.52;
  const angleRad  = angleDeg * Math.PI / 180;
  const rayLen    = Math.max(W, H) * 0.5;

  /* Dense medium fill */
  ctx.save();
  const denseGrad = ctx.createLinearGradient(0, interfaceY, 0, H);
  denseGrad.addColorStop(0, `${med.color}22`);
  denseGrad.addColorStop(1, `${med.color}08`);
  ctx.fillStyle = denseGrad; ctx.fillRect(0, interfaceY, W, H - interfaceY);

  /* Medium labels */
  ctx.fillStyle = med.color; ctx.font = "bold 14px Inter,sans-serif"; ctx.textAlign = "left";
  ctx.shadowColor = med.color; ctx.shadowBlur = 8;
  ctx.fillText(`${medium === "glass-air" ? "Glass" : medium === "water-air" ? "Water" : "Diamond"}  n₁ = ${n1}`, 14, interfaceY + 28);
  ctx.shadowBlur = 0; ctx.fillStyle = "rgba(148,163,184,0.6)";
  ctx.fillText(`Air  n₂ = 1.00`, 14, interfaceY - 18);
  ctx.restore();

  /* Interface */
  ctx.save();
  ctx.strokeStyle = "rgba(148,163,184,0.4)"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, interfaceY); ctx.lineTo(W, interfaceY); ctx.stroke();
  ctx.restore();

  /* Normal */
  ctx.save(); ctx.strokeStyle = "rgba(148,163,184,0.25)"; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(cx, interfaceY - 100); ctx.lineTo(cx, interfaceY + 80); ctx.stroke(); ctx.restore();

  /* Critical angle marker */
  const critX = cx + Math.sin(critAngle * Math.PI / 180) * 70;
  ctx.save(); ctx.strokeStyle = "rgba(248,113,113,0.5)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(cx, interfaceY); ctx.lineTo(critX, interfaceY - Math.cos(critAngle * Math.PI / 180) * 70); ctx.stroke();
  ctx.fillStyle = "rgba(248,113,113,0.7)"; ctx.font = "11px Inter,sans-serif"; ctx.textAlign = "left"; ctx.setLineDash([]);
  ctx.fillText(`θ_c = ${critAngle.toFixed(1)}°`, critX + 6, interfaceY - 55);
  ctx.restore();

  /* Incident ray (in dense medium, going upward) */
  const incFromX = cx - Math.sin(angleRad) * rayLen;
  const incFromY = interfaceY + Math.cos(angleRad) * rayLen;
  drawGlowRay2(ctx, incFromX, incFromY, cx, interfaceY, "#fbbf24", 2.5, 14);

  /* Reflected ray */
  const reflToX = cx + Math.sin(angleRad) * rayLen;
  const reflToY = interfaceY + Math.cos(angleRad) * rayLen;
  drawGlowRay2(ctx, cx, interfaceY, reflToX, reflToY,
    isTIR ? "#f97316" : "rgba(251,146,60,0.45)", isTIR ? 2.5 : 1.5, isTIR ? 16 : 5);

  if (!isTIR) {
    /* Refracted ray in rare medium */
    const sinRef = n1 * Math.sin(angleRad) / n2;
    if (sinRef <= 1) {
      const refractAngle = Math.asin(sinRef);
      const refrToX = cx + Math.sin(refractAngle) * rayLen;
      const refrToY = interfaceY - Math.cos(refractAngle) * rayLen;
      drawGlowRay2(ctx, cx, interfaceY, refrToX, refrToY, "#38bdf8", 2.5, 14);
      /* Refracted angle arc */
      ctx.save(); ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 1.5; ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.arc(cx, interfaceY, 50, -Math.PI / 2, -Math.PI / 2 + refractAngle); ctx.stroke();
      ctx.fillStyle = "#38bdf8"; ctx.font = "bold 12px Inter,sans-serif"; ctx.textAlign = "center"; ctx.shadowBlur = 0;
      ctx.fillText(`θ_t = ${(refractAngle * 180 / Math.PI).toFixed(1)}°`, cx + 72, interfaceY - 28);
      ctx.restore();
    }
  } else {
    /* TIR flash */
    const grd = ctx.createRadialGradient(cx, interfaceY, 0, cx, interfaceY, 80);
    grd.addColorStop(0, "rgba(249,115,22,0.55)"); grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(cx, interfaceY, 80, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.font = "bold 20px Inter,sans-serif"; ctx.textAlign = "center";
    ctx.fillStyle = "#f97316"; ctx.shadowColor = "#f97316"; ctx.shadowBlur = 24;
    ctx.fillText("⚡ TOTAL INTERNAL REFLECTION", W / 2, H * 0.12); ctx.restore();
  }

  /* Incident angle arc */
  ctx.save(); ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5; ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 6;
  ctx.beginPath(); ctx.arc(cx, interfaceY, 50, Math.PI / 2, Math.PI / 2 + angleRad); ctx.stroke();
  ctx.fillStyle = "#fbbf24"; ctx.font = "bold 12px Inter,sans-serif"; ctx.textAlign = "center"; ctx.shadowBlur = 0;
  ctx.fillText(`θ = ${angleDeg}°`, cx - 72, interfaceY + 30);
  ctx.restore();

  /* Animated photons */
  for (let k = 0; k < 3; k++) {
    const ph = (t * 0.5 + k * 0.33) % 1;
    const px = incFromX + (cx - incFromX) * ph;
    const py = incFromY + (interfaceY - incFromY) * ph;
    ctx.save(); ctx.fillStyle = "#fbbf24"; ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    if (isTIR) {
      const rph = (t * 0.5 + k * 0.33) % 1;
      const rx = cx + (reflToX - cx) * rph;
      const ry = interfaceY + (reflToY - interfaceY) * rph;
      ctx.save(); ctx.fillStyle = "#f97316"; ctx.shadowColor = "#f97316"; ctx.shadowBlur = 16;
      ctx.beginPath(); ctx.arc(rx, ry, 3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
  }
}

function drawFibreMode(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const fibreTop = H * 0.35, fibreBot = H * 0.65;
  const fibreH   = fibreBot - fibreTop;

  /* Fibre walls */
  ctx.save();
  const wallGrad = ctx.createLinearGradient(0, fibreTop, 0, fibreBot);
  wallGrad.addColorStop(0, "rgba(56,189,248,0.35)"); wallGrad.addColorStop(1, "rgba(56,189,248,0.1)");
  ctx.fillStyle = wallGrad; ctx.fillRect(0, fibreTop, W, fibreH);
  ctx.strokeStyle = "rgba(56,189,248,0.6)"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, fibreTop); ctx.lineTo(W, fibreTop); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, fibreBot); ctx.lineTo(W, fibreBot); ctx.stroke();
  ctx.fillStyle = "rgba(56,189,248,0.5)"; ctx.font = "11px Inter,sans-serif"; ctx.textAlign = "right";
  ctx.fillText("Core (Glass  n=1.5)", W - 10, (fibreTop + fibreBot) / 2 + 4);
  ctx.fillText("Cladding (n=1.46)", W - 10, fibreTop - 8);
  ctx.restore();

  /* Zig-zag light paths */
  const bounceCount = 8;
  const colors = ["#38bdf8", "#818cf8", "#34d399"];
  colors.forEach((color, ci) => {
    const yBase = fibreTop + fibreH * (0.3 + ci * 0.2);
    const yAmp  = fibreH * 0.35;
    const freq  = bounceCount;
    const phaseOff = ci * 0.3;

    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = 2;
    ctx.shadowColor = color; ctx.shadowBlur = 10;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 4) {
      const bounce = Math.sin((x / W) * freq * Math.PI);
      const y      = yBase + bounce * yAmp;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    /* Animated photon */
    const ph = (t * 0.35 + phaseOff) % 1;
    const px = W * ph;
    const py = yBase + Math.sin((px / W) * freq * Math.PI) * yAmp;
    ctx.fillStyle = color; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });

  /* TIR bounce markers */
  const bounceX = W / bounceCount;
  for (let i = 1; i < bounceCount; i++) {
    const bx = i * bounceX;
    ctx.save(); ctx.fillStyle = "rgba(249,115,22,0.6)"; ctx.shadowColor = "#f97316"; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(bx, fibreTop + 4, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(bx, fibreBot - 4, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  /* Info */
  ctx.save();
  ctx.fillStyle = "#94a3b8"; ctx.font = "bold 14px Inter,sans-serif"; ctx.textAlign = "center";
  ctx.fillText("Optical Fibre — Light travels by Total Internal Reflection", W / 2, 28);
  ctx.fillStyle = "#64748b"; ctx.font = "12px Inter,sans-serif";
  ctx.fillText("Each bounce off the cladding is a TIR event (θ > critical angle)", W / 2, 48);
  ctx.fillText("Light travels thousands of km with minimal loss — used in internet cables!", W / 2, H - 20);
  ctx.restore();
}

function drawDiamondMode(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  /* Diamond shape */
  const cx = W / 2, cy = H * 0.45;
  const dw = 120, dh = 160;

  ctx.save();
  const dg = ctx.createRadialGradient(cx, cy, 0, cx, cy, dw);
  dg.addColorStop(0, "rgba(249,168,212,0.35)"); dg.addColorStop(0.7, "rgba(167,139,250,0.2)"); dg.addColorStop(1, "rgba(56,189,248,0.1)");
  ctx.fillStyle = dg;
  ctx.strokeStyle = "rgba(249,168,212,0.6)"; ctx.lineWidth = 1.5; ctx.shadowColor = "#f9a8d4"; ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.moveTo(cx, cy - dh * 0.5);
  ctx.lineTo(cx + dw * 0.6, cy);
  ctx.lineTo(cx + dw * 0.3, cy + dh * 0.4);
  ctx.lineTo(cx, cy + dh * 0.5);
  ctx.lineTo(cx - dw * 0.3, cy + dh * 0.4);
  ctx.lineTo(cx - dw * 0.6, cy);
  ctx.closePath();
  ctx.fill(); ctx.stroke(); ctx.restore();

  /* Multiple internal reflections */
  const bounceAngles = [20, 45, 70, 30, 55, 80];
  bounceAngles.forEach((a, i) => {
    const x1 = cx + Math.cos((a + t * 15 + i * 60) * Math.PI / 180) * dw * 0.4;
    const y1 = cy + Math.sin((a + t * 15 + i * 60) * Math.PI / 180) * dh * 0.35;
    const x2 = cx - Math.cos((a + t * 15 + i * 60) * Math.PI / 180) * dw * 0.4;
    const y2 = cy - Math.sin((a + t * 15 + i * 60) * Math.PI / 180) * dh * 0.35;
    const rainbowColors = ["#ff0000", "#ff7700", "#ffff00", "#00ff00", "#0000ff", "#8b00ff"];
    ctx.save(); ctx.strokeStyle = rainbowColors[i % 6]; ctx.lineWidth = 1.5;
    ctx.shadowColor = rainbowColors[i % 6]; ctx.shadowBlur = 12; ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
  });

  ctx.save();
  ctx.fillStyle = "#f9a8d4"; ctx.font = "bold 15px Inter,sans-serif"; ctx.textAlign = "center";
  ctx.shadowColor = "#f9a8d4"; ctx.shadowBlur = 12;
  ctx.fillText("Diamond — Critical angle only 24.4°", W / 2, 28);
  ctx.shadowBlur = 0; ctx.fillStyle = "#64748b"; ctx.font = "12px Inter,sans-serif";
  ctx.fillText("Most light undergoes TIR inside → brilliant sparkle", W / 2, 48);
  ctx.fillText("Diamond's high n (2.42) causes dispersion → rainbow colours", W / 2, H - 20);
  ctx.restore();
}

function drawGlowRay2(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, lw: number, blur: number) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.shadowColor = color; ctx.shadowBlur = blur; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const a = Math.atan2(y2 - y1, x2 - x1);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 9 * Math.cos(a - 0.4), y2 - 9 * Math.sin(a - 0.4));
  ctx.lineTo(x2 - 9 * Math.cos(a + 0.4), y2 - 9 * Math.sin(a + 0.4));
  ctx.closePath(); ctx.fill(); ctx.restore();
}
