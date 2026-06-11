/**
 * FILE: CriticalAngleSim.tsx
 * LOCATION: frontend/src/components/simulations/light/refraction/CriticalAngleSim.tsx
 *
 * PURPOSE: Dedicated interactive simulation for Total Internal Reflection (TIR)
 *          and Critical Angle. Students drag a slider to increase the angle of
 *          incidence until TIR "snaps on" at the critical angle.
 *
 * FEATURES:
 *   - Two media: denser (glass/water/diamond) on top, rarer (air) on bottom
 *   - Angle of incidence slider (0°–89°)
 *   - Live refracted ray (Snell's law) — disappears exactly at critical angle
 *   - DRAMATIC TIR glow effect when angle ≥ critical angle
 *   - Critical angle computed live: sin(θc) = n₂/n₁
 *   - Refractive index presets: Glass, Water, Diamond, Optical Fibre
 *   - Refracted ray bends toward 90° as θ approaches θc
 *   - Animated photon traversal (bounces at interface under TIR)
 *   - "TIR ACTIVE" banner with flash animation when triggered
 *   - Responsive canvas via ResizeObserver + devicePixelRatio
 *
 * PHYSICS:
 *   Snell's law: n₁ sin θ₁ = n₂ sin θ₂
 *   Critical angle: θc = arcsin(n₂/n₁) [only when n₁ > n₂]
 *   TIR occurs when θ₁ ≥ θc
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import styles from "../SimulationEngine.module.css";

const toRad = (d: number) => d * Math.PI / 180;
const toDeg = (r: number) => r * 180 / Math.PI;

interface Medium {
  name: string;
  n: number;
  color: string;
}

const MEDIA: Medium[] = [
  { name: "Glass",         n: 1.50, color: "#60a5fa" },
  { name: "Water",         n: 1.33, color: "#34d399" },
  { name: "Diamond",       n: 2.42, color: "#a78bfa" },
  { name: "Optical Fibre", n: 1.62, color: "#fb923c" },
  { name: "Dense Glass",   n: 1.72, color: "#fbbf24" },
];

function glowLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, w = 2.5, alpha = 1
) {
  [
    { w: w * 6, a: alpha * 0.07 },
    { w: w * 3, a: alpha * 0.16 },
    { w: w * 1.5, a: alpha * 0.55 },
    { w, a: alpha },
  ].forEach(layer => {
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = layer.w; ctx.globalAlpha = layer.a;
    ctx.shadowColor = color; ctx.shadowBlur = layer.w * 2; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.restore();
  });
}

export default function CriticalAngleSim() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const timeRef      = useRef<number>(0);

  const [angleDeg,  setAngleDeg]  = useState<number>(30);
  const [mediumIdx, setMediumIdx] = useState<number>(0);

  const stateRef = useRef({ angleDeg: 30, mediumIdx: 0 });
  stateRef.current = { angleDeg, mediumIdx };

  const medium    = MEDIA[mediumIdx];
  const n1        = medium.n;       /* denser medium (glass side) */
  const n2        = 1.0;            /* air */
  const critDeg   = toDeg(Math.asin(n2 / n1));
  const isTIR     = angleDeg >= critDeg;
  const refractDeg = isTIR ? null : toDeg(Math.asin((n1 / n2) * Math.sin(toRad(angleDeg))));

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr, H = canvas.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    timeRef.current += 0.016;
    const t = timeRef.current;

    const { angleDeg: aD, mediumIdx: mIdx } = stateRef.current;
    const med = MEDIA[mIdx];
    const n1v = med.n;
    const critDegV = toDeg(Math.asin(n2 / n1v));
    const isTIRv   = aD >= critDegV;
    const refAngle = isTIRv ? null : toDeg(Math.asin((n1v / n2) * Math.sin(toRad(aD))));

    /* Background */
    ctx.fillStyle = "#080e1a";
    ctx.fillRect(0, 0, W, H);

    /* ── Media fill ── */
    const interfaceY = H * 0.52;

    /* Denser medium (glass/water) — top half */
    const denseGrad = ctx.createLinearGradient(0, 0, 0, interfaceY);
    denseGrad.addColorStop(0,   med.color + "18");
    denseGrad.addColorStop(1,   med.color + "30");
    ctx.fillStyle = denseGrad;
    ctx.fillRect(0, 0, W, interfaceY);

    /* Rarer medium (air) — bottom half */
    ctx.fillStyle = "rgba(15,23,42,0.6)";
    ctx.fillRect(0, interfaceY, W, H - interfaceY);

    /* Interface line */
    const ifGlow = isTIRv ? "#f87171" : med.color;
    ctx.save();
    ctx.strokeStyle = ifGlow; ctx.lineWidth = 2; ctx.shadowColor = ifGlow; ctx.shadowBlur = isTIRv ? 24 : 10;
    ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.moveTo(0, interfaceY); ctx.lineTo(W, interfaceY); ctx.stroke();
    ctx.restore();

    /* Medium labels */
    ctx.save();
    ctx.font = "bold 13px Inter, system-ui, sans-serif"; ctx.fillStyle = med.color + "cc"; ctx.textAlign = "left";
    ctx.fillText(`${med.name} (n₁ = ${n1v.toFixed(2)})`, 16, 22);
    ctx.fillStyle = "rgba(148,163,184,0.7)";
    ctx.fillText("Air (n₂ = 1.00)", 16, interfaceY + 20);
    ctx.restore();

    /* ── Normal line (dashed, vertical at centre) ── */
    const ox = W * 0.5, oy = interfaceY;
    ctx.save();
    ctx.strokeStyle = "rgba(148,163,184,0.3)"; ctx.lineWidth = 1.5; ctx.setLineDash([7, 5]);
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();

    /* ── Incident ray (from top-left, coming down to interface) ── */
    const incRad = toRad(aD);
    /* incident ray endpoint: from top travelling toward interface */
    const incLen = interfaceY - 5;
    const incX1 = ox - incLen * Math.sin(incRad);
    const incY1 = oy - incLen * Math.cos(incRad);

    glowLine(ctx, incX1, incY1, ox, oy, "#fde047", 2.5);

    /* Photon on incident ray */
    const ph1 = (t * 0.5) % 1;
    const px1 = incX1 + ph1 * (ox - incX1);
    const py1 = incY1 + ph1 * (oy - incY1);
    ctx.save();
    ctx.fillStyle = "#fde047"; ctx.shadowColor = "#fde047"; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.arc(px1, py1, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    /* ── Reflected ray ── */
    const refLen = isTIRv ? incLen * 1.05 : incLen * 0.7;
    const refX2 = ox + refLen * Math.sin(incRad);
    const refY2 = oy - refLen * Math.cos(incRad);
    const refColor = isTIRv ? "#f87171" : "#fde04755";
    glowLine(ctx, ox, oy, refX2, refY2, refColor, isTIRv ? 3 : 1.5, isTIRv ? 1.0 : 0.4);

    /* TIR photon bouncing on reflected ray */
    if (isTIRv) {
      const ph2 = (t * 0.5 + 0.5) % 1;
      const px2 = ox + ph2 * (refX2 - ox);
      const py2 = oy + ph2 * (refY2 - oy);
      ctx.save();
      ctx.fillStyle = "#f87171"; ctx.shadowColor = "#f87171"; ctx.shadowBlur = 20;
      ctx.beginPath(); ctx.arc(px2, py2, 5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    /* ── Refracted ray (only when not TIR) ── */
    if (!isTIRv && refAngle !== null) {
      const refRad = toRad(refAngle);
      const refOutLen = (H - interfaceY) * 0.85;
      const refX2r = ox + refOutLen * Math.sin(refRad);
      const refY2r = oy + refOutLen * Math.cos(refRad);
      glowLine(ctx, ox, oy, refX2r, refY2r, "#34d399", 2.5);

      /* angle arc label */
      ctx.save();
      ctx.strokeStyle = "#34d39966"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(ox, oy, 35, Math.PI / 2, Math.PI / 2 + refRad); ctx.stroke();
      ctx.fillStyle = "#34d399cc"; ctx.font = "11px Inter, system-ui, sans-serif"; ctx.textAlign = "left";
      ctx.fillText(`θ₂=${refAngle.toFixed(1)}°`, ox + 38, oy + 22);
      ctx.restore();

      /* photon on refracted */
      const ph3 = (t * 0.5 + 0.25) % 1;
      const px3 = ox + ph3 * (refX2r - ox);
      const py3 = oy + ph3 * (refY2r - oy);
      ctx.save();
      ctx.fillStyle = "#34d399"; ctx.shadowColor = "#34d399"; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.arc(px3, py3, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    /* ── Angle arcs for incidence ── */
    ctx.save();
    ctx.strokeStyle = "#fde04766"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(ox, oy, 38, -Math.PI / 2, -Math.PI / 2 + incRad, true); ctx.stroke();
    ctx.fillStyle = "#fde047cc"; ctx.font = "11px Inter, system-ui, sans-serif"; ctx.textAlign = "right";
    ctx.fillText(`θ₁=${aD.toFixed(1)}°`, ox - 40, oy - 16);
    ctx.restore();

    /* ── TIR banner ── */
    if (isTIRv) {
      const flash = 0.7 + 0.3 * Math.sin(t * 8);
      ctx.save();
      ctx.globalAlpha = flash;
      const bh = 34;
      const bg = ctx.createLinearGradient(0, H - bh - 8, W, H - 8);
      bg.addColorStop(0, "rgba(239,68,68,0.25)");
      bg.addColorStop(1, "rgba(239,68,68,0.05)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, H - bh - 8, W, bh);
      ctx.font = "bold 14px Inter, system-ui, sans-serif";
      ctx.fillStyle = "#f87171";
      ctx.textAlign = "center";
      ctx.shadowColor = "#f87171"; ctx.shadowBlur = 12;
      ctx.fillText("⚡ TOTAL INTERNAL REFLECTION ACTIVE ⚡", W / 2, H - 18);
      ctx.restore();
    }

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = el.clientWidth  * dpr;
      canvas.height = el.clientHeight * dpr;
    });
    obs.observe(el);
    rafRef.current = requestAnimationFrame(draw);
    return () => { obs.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  return (
    <div className={styles.simWrapper}>
      <div className={styles.simHeader}>
        <span className={styles.simIcon}>⚡</span>
        <div>
          <div className={styles.simTitle}>Total Internal Reflection — Critical Angle</div>
          <div className={styles.simDesc}>
            Drag angle past θc = {critDeg.toFixed(1)}° to trigger TIR · n₁ = {n1.toFixed(2)}, n₂ = 1.00
          </div>
        </div>
      </div>

      {/* ── TIR Status ── */}
      <div style={{ padding: "0 20px 4px", display: "flex", gap: "12px", alignItems: "center" }}>
        <div style={{
          padding: "6px 16px", borderRadius: "8px",
          background: isTIR ? "rgba(239,68,68,0.15)" : "rgba(52,211,153,0.10)",
          border: `1px solid ${isTIR ? "rgba(239,68,68,0.4)" : "rgba(52,211,153,0.3)"}`,
          fontWeight: 700, fontSize: "0.82rem",
          color: isTIR ? "#f87171" : "#34d399",
        }}>
          {isTIR ? "⚡ TIR ACTIVE" : "🌊 Refraction Active"}
        </div>
        <div style={{ color: "#64748b", fontSize: "0.8rem" }}>
          Critical angle θc = <strong style={{ color: "#fbbf24" }}>{critDeg.toFixed(1)}°</strong>
        </div>
        {!isTIR && refractDeg !== null && (
          <div style={{ color: "#64748b", fontSize: "0.8rem" }}>
            θ₂ = <strong style={{ color: "#34d399" }}>{refractDeg.toFixed(1)}°</strong>
          </div>
        )}
      </div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>
            Angle of Incidence θ₁ = <strong style={{ color: isTIR ? "#f87171" : "#fbbf24" }}>{angleDeg}°</strong>
            {angleDeg >= critDeg - 1 && angleDeg < critDeg + 1 && (
              <span style={{ color: "#f97316", marginLeft: "8px" }}>← critical angle!</span>
            )}
          </label>
          <input
            type="range" min={0} max={89} step={1}
            value={angleDeg}
            onChange={(e) => setAngleDeg(Number(e.target.value))}
            className={styles.slider}
          />
        </div>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Dense Medium (n₁)</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {MEDIA.map((m, i) => (
              <button
                key={m.name}
                className={`${styles.presetBtn} ${mediumIdx === i ? styles.presetBtnActive : ""}`}
                onClick={() => { setMediumIdx(i); setAngleDeg(30); }}
                style={{ color: mediumIdx === i ? m.color : undefined, borderColor: mediumIdx === i ? m.color + "60" : undefined }}
              >
                {m.name} (n={m.n})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={containerRef} className={styles.canvasWrap}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      {/* ── Formula info panel ── */}
      <div style={{ padding: "12px 20px 20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <div style={{
          flex: "1 1 200px", padding: "12px 14px", borderRadius: "10px",
          background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)",
        }}>
          <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: "0.8rem", marginBottom: "6px" }}>
            Critical Angle Formula
          </div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.9rem", color: "#e2e8f0" }}>
            sin θc = n₂/n₁
          </div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.8rem", color: "#94a3b8", marginTop: "4px" }}>
            = 1/{n1.toFixed(2)} = {(n2/n1).toFixed(4)}
          </div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.8rem", color: "#fbbf24", marginTop: "4px" }}>
            θc = {critDeg.toFixed(1)}°
          </div>
        </div>
        <div style={{
          flex: "1 1 200px", padding: "12px 14px", borderRadius: "10px",
          background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)",
        }}>
          <div style={{ color: "#34d399", fontWeight: 700, fontSize: "0.8rem", marginBottom: "6px" }}>
            Real-Life Applications
          </div>
          {[
            "💎 Diamond sparkle — n=2.42, θc=24.4°",
            "🔆 Optical fibres — data at speed of light",
            "🌡️ Mirages on hot roads",
            "🔬 Medical endoscopes",
          ].map(a => (
            <div key={a} style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "3px" }}>{a}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
