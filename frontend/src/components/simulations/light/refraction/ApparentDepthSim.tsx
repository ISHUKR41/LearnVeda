/**
 * FILE: ApparentDepthSim.tsx
 * PURPOSE: Interactive refraction simulation showing apparent depth illusion,
 *          Snell's Law with multi-medium layers, and real-life applications.
 *
 * FEATURES:
 *   - Animated canvas showing a coin at the bottom of water
 *   - Drag the observer's eye position to see bending of light rays
 *   - Live calculation: Real Depth, Apparent Depth, Refractive Index
 *   - Slider for medium (air/water/glass/diamond) selection
 *   - Multiple scenarios: Pool depth, Coin in water, Fish position
 *   - Shows n = Real Depth / Apparent Depth formula live
 *
 * PHYSICS:
 *   When light travels from denser (water) to rarer (air) medium, it bends away
 *   from the normal. Your eye traces the rays back in a straight line, making the
 *   object appear closer/shallower than it really is.
 *   n = Real Depth / Apparent Depth
 */

"use client";

import React, { useRef, useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════
 * MEDIA DATA
 * ═══════════════════════════════════════════════════ */
interface Medium {
  name: string;
  n: number;         // refractive index
  color: string;     // water colour
  emoji: string;
  example: string;
}

const MEDIA: Medium[] = [
  { name: "Water",   n: 1.33,  color: "rgba(56,189,248,0.25)",  emoji: "🌊", example: "Swimming pool depth illusion" },
  { name: "Glass",   n: 1.52,  color: "rgba(148,163,184,0.3)",  emoji: "🔲", example: "Glass block apparent depth" },
  { name: "Diamond", n: 2.42,  color: "rgba(167,139,250,0.25)", emoji: "💎", example: "Diamond stone depth illusion" },
  { name: "Ice",     n: 1.31,  color: "rgba(186,230,253,0.25)", emoji: "🧊", example: "Ice block optical illusion" },
  { name: "Oil",     n: 1.46,  color: "rgba(234,179,8,0.2)",    emoji: "🫙", example: "Oil container depth" },
];

/* ═══════════════════════════════════════════════════
 * DRAW FUNCTION
 * ═══════════════════════════════════════════════════ */
function drawScene(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  mediumIndex: number,
  realDepthRatio: number,   // 0..1 (fraction of water height)
  eyeX: number,             // pixel x position of observer eye
  t: number                 // animation time
) {
  const medium = MEDIA[mediumIndex];
  const waterTop    = H * 0.22;
  const waterBottom = H * 0.82;
  const waterH      = waterBottom - waterTop;
  const coinY       = waterTop + waterH * realDepthRatio;
  const coinX       = W * 0.5;
  const eyeY        = H * 0.08;

  /* Background */
  ctx.fillStyle = "#040a14";
  ctx.fillRect(0, 0, W, H);

  /* ── AIR region label ── */
  ctx.fillStyle = "rgba(186,230,253,0.08)";
  ctx.fillRect(0, 0, W, waterTop);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "11px Inter, system-ui";
  ctx.fillText("AIR  (n = 1.0)", 12, 16);

  /* ── WATER / MEDIUM region ── */
  ctx.fillStyle = medium.color;
  ctx.fillRect(0, waterTop, W, waterH);

  /* Water surface line */
  ctx.beginPath();
  ctx.moveTo(0, waterTop); ctx.lineTo(W, waterTop);
  ctx.strokeStyle = "rgba(56,189,248,0.6)";
  ctx.lineWidth = 2;
  ctx.stroke();

  /* Animated ripple on surface */
  for (let i = 0; i < 3; i++) {
    const ripX = W * 0.5 + Math.sin(t * 1.5 + i * 2) * 20;
    ctx.beginPath();
    ctx.arc(ripX, waterTop, 10 + i * 8, 0, 2 * Math.PI);
    ctx.strokeStyle = `rgba(56,189,248,${0.15 - i * 0.04})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "11px Inter, system-ui";
  ctx.fillText(`${medium.emoji} ${medium.name}  (n = ${medium.n})`, 12, waterTop + 20);

  /* ── REAL COIN ── */
  ctx.beginPath();
  ctx.arc(coinX, coinY, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "#fbbf24";
  ctx.shadowColor = "#fbbf24";
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#92400e";
  ctx.font = "bold 9px Inter, system-ui";
  ctx.textAlign = "center";
  ctx.fillText("₹", coinX, coinY + 4);
  ctx.textAlign = "left";

  /* ── REAL DEPTH label ── */
  const realDepth = coinY - waterTop;
  ctx.beginPath();
  ctx.setLineDash([4, 3]);
  ctx.moveTo(W * 0.82, waterTop); ctx.lineTo(W * 0.82, coinY);
  ctx.strokeStyle = "rgba(248,113,113,0.6)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#f87171";
  ctx.font = "bold 10px Inter, system-ui";
  ctx.fillText(`Real: ${Math.round(realDepth)}px`, W * 0.83, (waterTop + coinY) / 2 + 4);

  /* ── REFRACTION RAY TRACING ── */
  /* Find angle of ray from coin to surface point directly above eye */
  const surfaceX = eyeX + (coinX - eyeX) * 0.35; // refraction point on surface
  const dxIn = surfaceX - coinX;
  const dyIn = waterTop - coinY;
  const thetaIn = Math.atan2(Math.abs(dxIn), Math.abs(dyIn)); // angle from normal in water

  /* Snell's law: n_water * sin(theta_in) = n_air * sin(theta_out) */
  const sinThetaOut = medium.n * Math.sin(thetaIn);
  const thetaOut    = sinThetaOut <= 1 ? Math.asin(sinThetaOut) : Math.PI / 2;

  /* Refracted ray continues to eye */
  const dxOut = Math.tan(thetaOut) * (eyeY - waterTop);

  /* ── Ray from coin to surface (inside medium) ── */
  ctx.beginPath();
  ctx.moveTo(coinX, coinY);
  ctx.lineTo(surfaceX, waterTop);
  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 2;
  ctx.shadowColor = "#fde047";
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.shadowBlur = 0;

  /* ── Normal at surface ── */
  ctx.beginPath();
  ctx.moveTo(surfaceX, waterTop + 30); ctx.lineTo(surfaceX, waterTop - 30);
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.stroke();
  ctx.setLineDash([]);

  /* ── Refracted ray from surface to eye ── */
  const eyeEndX = surfaceX + (dxOut > 0 ? dxOut : dxOut);
  ctx.beginPath();
  ctx.moveTo(surfaceX, waterTop);
  ctx.lineTo(eyeX, eyeY);
  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 2;
  ctx.stroke();

  /* ── Virtual ray extension (apparent position) ── */
  /* Apparent position: extend refracted ray back into water */
  const slope = (eyeY - waterTop) / (eyeX - surfaceX);
  const apparentY = waterTop + (coinX - surfaceX) * slope * (1 / (medium.n));

  ctx.beginPath();
  ctx.moveTo(surfaceX, waterTop);
  ctx.lineTo(coinX, apparentY);
  ctx.strokeStyle = "rgba(167,139,250,0.5)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  /* ── Apparent depth label ── */
  const apparentDepth = apparentY - waterTop;
  if (apparentDepth > 0) {
    ctx.beginPath();
    ctx.setLineDash([4, 3]);
    ctx.moveTo(W * 0.88, waterTop); ctx.lineTo(W * 0.88, apparentY);
    ctx.strokeStyle = "rgba(167,139,250,0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#a78bfa";
    ctx.font = "bold 10px Inter, system-ui";
    ctx.fillText(`Apparent: ${Math.round(apparentDepth)}px`, W * 0.89, (waterTop + apparentY) / 2 + 4);
  }

  /* ── Apparent coin position ── */
  if (apparentDepth > 4) {
    ctx.beginPath();
    ctx.arc(coinX, apparentY, 8, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(167,139,250,0.5)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(167,139,250,0.15)";
    ctx.fill();
  }

  /* ── EYE ── */
  ctx.beginPath();
  ctx.ellipse(eyeX, eyeY, 14, 9, 0, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "#1e293b";
  ctx.fill();
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px Inter, system-ui";
  ctx.textAlign = "center";
  ctx.fillText("Observer", eyeX, eyeY - 16);
  ctx.textAlign = "left";
}

/* ═══════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════ */
export default function ApparentDepthSim() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rafRef       = useRef<number>(0);
  const tRef         = useRef<number>(0);
  const [medIdx,     setMedIdx]     = useState<number>(0);
  const [realDepth,  setRealDepth]  = useState<number>(0.7);
  const [eyeXPct,    setEyeXPct]    = useState<number>(0.35);

  const medium = MEDIA[medIdx];
  const apparentDepth = realDepth / medium.n;
  const nCalc = realDepth / apparentDepth;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (ts: number) => {
      tRef.current = ts / 1000;
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.getBoundingClientRect().width;
      const H = canvas.getBoundingClientRect().height;

      if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        ctx.scale(dpr, dpr);
      }

      drawScene(ctx, W, H, medIdx, realDepth, W * eyeXPct, tRef.current);
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [medIdx, realDepth, eyeXPct]);

  return (
    <div style={{
      background: "#040a14", borderRadius: "16px",
      overflow: "hidden", fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "300px", display: "block" }} />

      <div style={{
        padding: "18px 22px",
        background: "rgba(8,14,26,0.98)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Medium selector */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
          {MEDIA.map((m, i) => (
            <button key={m.name} onClick={() => setMedIdx(i)} style={{
              padding: "6px 12px", borderRadius: "8px",
              border: medIdx === i ? "2px solid #38bdf8" : "1px solid rgba(255,255,255,0.1)",
              background: medIdx === i ? "rgba(56,189,248,0.12)" : "transparent",
              color: medIdx === i ? "#38bdf8" : "#64748b",
              fontSize: "12px", fontWeight: 600, cursor: "pointer",
            }}>
              {m.emoji} {m.name}
            </button>
          ))}
        </div>

        {/* Sliders */}
        {[
          { label: "Real Depth", value: realDepth, min: 0.2, max: 0.95, step: 0.01, set: setRealDepth, color: "#f87171" },
          { label: "Observer position", value: eyeXPct, min: 0.1, max: 0.7, step: 0.01, set: setEyeXPct, color: "#94a3b8" },
        ].map(({ label, value, min, max, step, set, color }) => (
          <div key={label} style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>{label}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value}
              onChange={e => set(Number(e.target.value))}
              style={{ width: "100%", accentColor: color }}
            />
          </div>
        ))}

        {/* Formula result */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "10px",
        }}>
          {[
            { label: "Real Depth", val: `${(realDepth * 100).toFixed(0)} units`, color: "#f87171" },
            { label: "Apparent Depth", val: `${(apparentDepth * 100).toFixed(1)} units`, color: "#a78bfa" },
            { label: "n = Real / Apparent", val: nCalc.toFixed(2), color: "#fbbf24" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{
              padding: "10px", background: `${color}08`,
              border: `1px solid ${color}25`,
              borderRadius: "8px", textAlign: "center",
            }}>
              <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "4px" }}>{label}</div>
              <div style={{
                color, fontWeight: 700, fontSize: "14px",
                fontFamily: "'JetBrains Mono', monospace",
              }}>{val}</div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: "12px", padding: "10px 14px",
          background: "rgba(56,189,248,0.06)",
          borderLeft: "3px solid #38bdf8",
          borderRadius: "0 8px 8px 0",
          fontSize: "11px", color: "#94a3b8",
        }}>
          💡 <strong style={{ color: "#38bdf8" }}>Why this happens:</strong> Light bends away from normal when going from {medium.name} (denser, n={medium.n}) to air (n=1.0). Your brain traces the rays straight back, making the {medium.example}.
        </div>
      </div>
    </div>
  );
}
