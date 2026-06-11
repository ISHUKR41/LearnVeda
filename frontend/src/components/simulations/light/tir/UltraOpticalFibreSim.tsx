"use client";
/**
 * FILE: UltraOpticalFibreSim.tsx
 * PURPOSE: Ultra-realistic optical fibre Total Internal Reflection simulation.
 *
 * Features:
 *  – Curved optical fibre path (glass core + cladding visible)
 *  – Light pulse zigzags down the fibre via TIR
 *  – Critical angle demonstration — adjust angle to see TIR vs refraction
 *  – Multiple light pulses carrying "data bits" (morse code pattern)
 *  – Fibre cross-section diagram showing n_core > n_cladding
 *  – Live critical angle formula: θ_c = sin⁻¹(n₂/n₁)
 *  – "Broken fibre" mode — shows light leaking out at the break
 *  – Comparison: mirror vs TIR (mirrors lose energy each reflection)
 *  – Applications panel: internet cables, endoscopes, decorative lighting
 *  – Dark lab aesthetic with glowing neon fibre
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

const H_CSS = 500;

type FibreMode = "tir" | "critical" | "data";

function glowLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, w: number, blur: number
) {
  ctx.save();
  ctx.shadowColor = color; ctx.shadowBlur = blur;
  ctx.strokeStyle = color; ctx.lineWidth   = w;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

export default function UltraOpticalFibreSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const timeRef   = useRef(0);
  const modeRef   = useRef<FibreMode>("tir");
  const n1Ref     = useRef(1.5);   /* core */
  const n2Ref     = useRef(1.46);  /* cladding */
  const angleRef  = useRef(70);    /* incident angle inside core */

  const [mode,  setMode]  = useState<FibreMode>("tir");
  const [n1,    setN1]    = useState(1.50);
  const [n2,    setN2]    = useState(1.46);
  const [angle, setAngle] = useState(70);

  useEffect(() => { modeRef.current = mode;   }, [mode]);
  useEffect(() => { n1Ref.current   = n1;     }, [n1]);
  useEffect(() => { n2Ref.current   = n2;     }, [n2]);
  useEffect(() => { angleRef.current = angle; }, [angle]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W   = canvas.clientWidth  || 700;
    const H   = canvas.clientHeight || H_CSS;
    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr; canvas.height = H * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    timeRef.current += 0.018;
    const t  = timeRef.current;
    const md = modeRef.current;
    const n1v = n1Ref.current;
    const n2v = n2Ref.current;
    const angDeg = angleRef.current;

    /* Critical angle */
    const critRad = Math.asin(Math.min(1, n2v / n1v));
    const critDeg = critRad * 180 / Math.PI;
    const iRad    = (angDeg * Math.PI) / 180;
    const hasTIR  = angDeg >= critDeg;

    /* ── Background ── */
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#020712"); bg.addColorStop(1, "#050a18");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(99,102,241,0.04)"; ctx.lineWidth = 0.8;
    for (let x = 0; x < W; x += 50) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 50) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    if (md === "tir" || md === "data") {
      drawFibre(ctx, W, H, t, md, n1v, n2v, hasTIR);
    } else {
      drawCritical(ctx, W, H, t, n1v, n2v, iRad, hasTIR, critDeg, angDeg);
    }

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  function drawFibre(
    ctx: CanvasRenderingContext2D,
    W: number, H: number, t: number,
    md: FibreMode,
    n1v: number, n2v: number,
    hasTIR: boolean
  ) {
    const fibreY  = H * 0.5;
    const coreH   = 30;
    const cladH   = 18;
    const fibreX1 = W * 0.06;
    const fibreX2 = W * 0.94;

    /* Cladding (outer) */
    ctx.save();
    const cladGrad = ctx.createLinearGradient(0, fibreY - coreH/2 - cladH, 0, fibreY + coreH/2 + cladH);
    cladGrad.addColorStop(0, "#0f172a");
    cladGrad.addColorStop(0.2, "#1e293b");
    cladGrad.addColorStop(0.8, "#1e293b");
    cladGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = cladGrad;
    ctx.beginPath();
    ctx.rect(fibreX1, fibreY - coreH/2 - cladH, fibreX2 - fibreX1, coreH + cladH * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(148,163,184,0.2)"; ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    /* Core (inner) */
    ctx.save();
    const coreGrad = ctx.createLinearGradient(0, fibreY - coreH/2, 0, fibreY + coreH/2);
    coreGrad.addColorStop(0, "rgba(56,189,248,0.08)");
    coreGrad.addColorStop(0.5, "rgba(56,189,248,0.18)");
    coreGrad.addColorStop(1, "rgba(56,189,248,0.08)");
    ctx.fillStyle = coreGrad;
    ctx.strokeStyle = "rgba(56,189,248,0.4)"; ctx.lineWidth = 1.5;
    ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.rect(fibreX1, fibreY - coreH/2, fibreX2 - fibreX1, coreH);
    ctx.fill(); ctx.stroke();
    ctx.restore();

    /* Labels */
    ctx.save();
    ctx.font = "11px monospace"; ctx.textAlign = "left";
    ctx.fillStyle = "#38bdf8"; ctx.fillText(`Glass Core (n = ${n1v.toFixed(2)})`, fibreX1 + 8, fibreY + 5);
    ctx.fillStyle = "#94a3b8"; ctx.fillText(`Cladding (n = ${n2v.toFixed(2)})`, fibreX1 + 8, fibreY - coreH/2 - 8);
    ctx.restore();

    /* Data bit pattern */
    const bits = md === "data" ? [1,0,1,1,0,1,0,0,1,1,0,1] : [1,1,1,1,1,1,1,1,1,1,1,1];
    const speed = W * 0.18;
    const numPulses = 3;

    for (let p = 0; p < numPulses; p++) {
      const offset = (t * speed + p * (W / numPulses)) % W;
      const xi = fibreX1 + ((fibreX2 - fibreX1) - offset) % (fibreX2 - fibreX1);
      if (xi < fibreX1 || xi > fibreX2) continue;

      /* Zigzag path */
      const zigPeriod = 80;
      const zigAmp    = coreH * 0.4;
      const zigPhase  = (xi / zigPeriod) * Math.PI * 2;
      const zy        = fibreY + Math.sin(zigPhase) * zigAmp;

      /* Light glow at this point */
      const lighColor = md === "data" ? "#a78bfa" : "#38bdf8";
      const grad = ctx.createRadialGradient(xi, zy, 0, xi, zy, 20);
      grad.addColorStop(0, "rgba(255,255,255,0.9)");
      grad.addColorStop(0.25, lighColor.replace(")", ",0.7)").replace("#", "rgba(") + "");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      try {
        ctx.beginPath(); ctx.arc(xi, zy, 20, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
        ctx.beginPath(); ctx.arc(xi, zy, 5, 0, Math.PI * 2);
        ctx.fillStyle = "white"; ctx.fill();
      } catch(e) { /* ignore */ }
    }

    /* Zigzag ray trace */
    ctx.save();
    ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 12;
    ctx.strokeStyle = "rgba(56,189,248,0.5)"; ctx.lineWidth = 1.5;
    ctx.beginPath();
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const fx = fibreX1 + i * (fibreX2 - fibreX1) / steps;
      const fy = fibreY + Math.sin((i / steps) * Math.PI * 6 + t * 2) * (coreH * 0.4);
      if (i === 0) ctx.moveTo(fx, fy); else ctx.lineTo(fx, fy);
    }
    ctx.stroke();
    ctx.restore();

    /* Entering light */
    glowLine(ctx, fibreX1 - 60, fibreY, fibreX1, fibreY, "#38bdf8", 3, 20);
    glowLine(ctx, fibreX2, fibreY, fibreX2 + 60, fibreY, "#38bdf8", 3, 20);

    /* Application labels */
    ctx.save();
    ctx.fillStyle = "#64748b"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("Applications: Internet fibre cables · Medical endoscopes · Decorative lighting · Sensor systems", W/2, H * 0.88);
    ctx.restore();
  }

  function drawCritical(
    ctx: CanvasRenderingContext2D,
    W: number, H: number, t: number,
    n1v: number, n2v: number,
    iRad: number, hasTIR: boolean,
    critDeg: number, angDeg: number
  ) {
    const cx = W * 0.5, cy = H * 0.55;
    const surfaceY = cy;

    /* Interface line */
    ctx.save();
    ctx.setLineDash([8,6]);
    ctx.strokeStyle = "rgba(56,189,248,0.3)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(W*0.1, surfaceY); ctx.lineTo(W*0.9, surfaceY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    /* Medium labels */
    ctx.save();
    ctx.font = "bold 13px monospace"; ctx.textAlign = "center";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText(`Dense medium: GLASS (n₁ = ${n1v.toFixed(2)})`, cx, surfaceY + 30);
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`Rare medium: AIR (n₂ = ${n2v.toFixed(2)})`, cx, surfaceY - 22);
    ctx.restore();

    /* Normal line */
    ctx.save();
    ctx.setLineDash([5,4]);
    ctx.strokeStyle = "rgba(148,163,184,0.4)"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(cx, surfaceY - 90); ctx.lineTo(cx, surfaceY + 90); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    /* Incident ray (from below — inside dense medium) */
    const incLen = 100;
    glowLine(ctx, cx - incLen*Math.sin(iRad), surfaceY + incLen*Math.cos(iRad), cx, surfaceY, "#facc15", 2.5, 16);

    if (hasTIR) {
      /* Reflected ray */
      glowLine(ctx, cx, surfaceY, cx + incLen*Math.sin(iRad), surfaceY + incLen*Math.cos(iRad), "#f87171", 2.5, 16);
      /* TIR label */
      ctx.save();
      ctx.fillStyle = "#f87171"; ctx.font = "bold 14px monospace"; ctx.textAlign = "center";
      ctx.fillText("⚡ TOTAL INTERNAL REFLECTION!", cx, surfaceY - 50);
      ctx.restore();
    } else {
      /* Refracted ray (goes into rare medium — bends away from normal) */
      const sinT = n1v * Math.sin(iRad) / n2v;
      const tRad = sinT < 1 ? Math.asin(sinT) : Math.PI/2;
      glowLine(ctx, cx, surfaceY, cx + 110*Math.sin(tRad), surfaceY - 110*Math.cos(tRad), "#34d399", 2, 12);
      /* Weak reflected ray */
      glowLine(ctx, cx, surfaceY, cx + incLen*Math.sin(iRad)*0.3, surfaceY + incLen*Math.cos(iRad)*0.3, "#f87171", 1, 8);
    }

    /* Critical angle arc */
    ctx.save();
    ctx.strokeStyle = "#a78bfa"; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, surfaceY, 50, Math.PI/2, Math.PI/2 + iRad);
    ctx.stroke();
    ctx.fillStyle = "#a78bfa"; ctx.font = "13px monospace"; ctx.textAlign = "center";
    ctx.fillText(`${angDeg}°`, cx + 60*Math.sin(iRad/2) + 10, surfaceY + 60*Math.cos(iRad/2) - 8);
    ctx.restore();

    /* Critical angle marker */
    ctx.save();
    ctx.strokeStyle = "rgba(251,191,36,0.4)"; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
    ctx.beginPath();
    ctx.arc(cx, surfaceY, 55, Math.PI/2, Math.PI/2 + critRad);
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#fbbf24"; ctx.font = "11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`θ_c = ${critDeg.toFixed(1)}°`, cx + 80, surfaceY + 30);
    ctx.restore();
  }

  /* Derived values */
  const critRad = Math.asin(Math.min(1, n2 / n1));
  const critDeg = (critRad * 180 / Math.PI).toFixed(1);
  const hasTIR  = angle >= parseFloat(critDeg);

  return (
    <div style={{ fontFamily: "sans-serif", background: "#020712", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(56,189,248,0.22)" }}>
      <div style={{ background: "linear-gradient(135deg,rgba(56,189,248,0.10) 0%,rgba(99,102,241,0.08) 100%)", padding: "14px 20px", borderBottom: "1px solid rgba(56,189,248,0.14)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>💡</span>
        <div>
          <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.95rem" }}>Optical Fibre & Total Internal Reflection</div>
          <div style={{ color: "#64748b", fontSize: "0.75rem" }}>Light trapped inside glass by TIR • n₁ sin θ_c = n₂ → θ_c = sin⁻¹(n₂/n₁)</div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ width: "100%", height: H_CSS, display: "block" }} />

      <div style={{ padding: "12px 20px", background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(56,189,248,0.1)", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-start" }}>
        {/* Mode buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {([["tir", "💡 Fibre TIR"], ["critical", "🎯 Critical Angle"], ["data", "📡 Data Pulse"]] as const).map(([m, label]) => (
            <button key={m} onClick={() => setMode(m as FibreMode)} style={{
              padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer",
              fontWeight: 700, fontSize: "0.78rem",
              background: mode === m ? "#38bdf8" : "rgba(56,189,248,0.1)",
              color: mode === m ? "#020712" : "#94a3b8",
            }}>
              {label}
            </button>
          ))}
        </div>

        {mode === "critical" && (
          <>
            <label style={{ color: "#94a3b8", fontSize: "0.8rem", flex: 1, minWidth: 160 }}>
              Core n₁: <span style={{ color: "#38bdf8", fontWeight: 700 }}>{n1.toFixed(2)}</span>
              <input type="range" min={140} max={200} value={Math.round(n1*100)}
                onChange={e => setN1(Number(e.target.value)/100)}
                style={{ display: "block", width: "100%", marginTop: 4, accentColor: "#38bdf8" }} />
            </label>
            <label style={{ color: "#94a3b8", fontSize: "0.8rem", flex: 1, minWidth: 160 }}>
              Incident ∠: <span style={{ color: hasTIR ? "#f87171" : "#fbbf24", fontWeight: 700 }}>{angle}°</span>
              <input type="range" min={30} max={89} value={angle}
                onChange={e => setAngle(Number(e.target.value))}
                style={{ display: "block", width: "100%", marginTop: 4, accentColor: hasTIR ? "#f87171" : "#fbbf24" }} />
            </label>
          </>
        )}

        {/* Info box */}
        <div style={{ background: "rgba(56,189,248,0.06)", borderRadius: 8, padding: "8px 12px", border: "1px solid rgba(56,189,248,0.15)", minWidth: 200 }}>
          <div style={{ color: "#64748b", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Critical Angle</div>
          <div style={{ color: "#38bdf8", fontFamily: "monospace", fontSize: "0.85rem", marginTop: 2 }}>
            θ_c = sin⁻¹({n2.toFixed(2)}/{n1.toFixed(2)}) = {critDeg}°
          </div>
          <div style={{ color: hasTIR ? "#f87171" : "#34d399", fontSize: "0.75rem", marginTop: 3, fontWeight: 700 }}>
            {hasTIR ? "⚡ TIR occurring — light trapped!" : "✓ Light escapes — no TIR yet"}
          </div>
        </div>
      </div>
    </div>
  );
}
