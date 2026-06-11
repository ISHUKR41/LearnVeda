/**
 * FILE: WaveNatureLightSim.tsx
 * PURPOSE: Animated electromagnetic wave simulation showing the wave nature of light.
 *          Visualises E-field (electric) and B-field (magnetic) oscillations, wavelength,
 *          frequency, speed of light, and the visible spectrum colour mapping.
 *
 * FEATURES:
 *   - Full 3D-perspective EM wave animation with E and B field vectors
 *   - Interactive: adjust frequency (λ changes in real time)
 *   - Colour of wave changes with frequency (VIBGYOR mapping)
 *   - Speed of light formula c = fλ shown live
 *   - Pause / Resume button
 *   - Professional dark physics-lab aesthetic
 *
 * PHYSICS: Light is an electromagnetic wave. The electric field (E) and magnetic
 *          field (B) oscillate perpendicular to each other and to the direction of
 *          propagation. Speed = frequency × wavelength (c = fλ).
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════
 * CONSTANTS
 * ═══════════════════════════════════════════════════ */
const SPEED_OF_LIGHT = 3e8; // m/s

/** Approximate colour from wavelength (nm) → CSS hsl string */
function wavelengthToColor(nm: number): string {
  if (nm < 380)  return "hsl(280,100%,60%)";  // UV-violet
  if (nm < 450)  return "hsl(270,100%,65%)";  // Violet
  if (nm < 495)  return "hsl(240,100%,65%)";  // Blue
  if (nm < 570)  return "hsl(120,100%,50%)";  // Green
  if (nm < 590)  return "hsl(55,100%,50%)";   // Yellow
  if (nm < 625)  return "hsl(30,100%,55%)";   // Orange
  if (nm < 750)  return "hsl(0,100%,55%)";    // Red
  return "hsl(0,70%,40%)";                     // IR
}

/** Named colour region */
function wavelengthToName(nm: number): string {
  if (nm < 380)  return "Ultra-Violet";
  if (nm < 450)  return "Violet";
  if (nm < 495)  return "Blue";
  if (nm < 570)  return "Green";
  if (nm < 590)  return "Yellow";
  if (nm < 625)  return "Orange";
  if (nm < 750)  return "Red";
  return "Infra-Red";
}

/* ═══════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════ */
export default function WaveNatureLightSim() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const tRef       = useRef<number>(0);       // animation time
  const pausedRef  = useRef<boolean>(false);

  /* Frequency in THz (visible: ~430–770 THz) */
  const [freqTHz, setFreqTHz] = useState<number>(580);
  const [paused,  setPaused]  = useState<boolean>(false);
  const [showBField, setShowBField] = useState<boolean>(true);

  /* Derived */
  const wavelengthNm = Math.round(SPEED_OF_LIGHT / (freqTHz * 1e12) * 1e9);
  const colour       = wavelengthToColor(wavelengthNm);
  const colourName   = wavelengthToName(wavelengthNm);

  /* Toggle pause */
  const togglePause = useCallback(() => {
    pausedRef.current = !pausedRef.current;
    setPaused(p => !p);
  }, []);

  /* ── Draw loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* Resolve canvas pixel size */
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width  * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (timestamp: number) => {
      if (!pausedRef.current) tRef.current = timestamp;
      const t = tRef.current / 1000; // seconds

      const W = canvas.getBoundingClientRect().width;
      const H = canvas.getBoundingClientRect().height;
      const cx = W / 2;
      const cy = H / 2;

      /* Clear */
      ctx.clearRect(0, 0, W, H);

      /* Background */
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#040a14");
      bg.addColorStop(1, "#060d1a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      /* ── Grid lines (subtle) ── */
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      /* ── Propagation axis (x-axis = direction of travel) ── */
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(W, cy);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      /* ── Wave parameters ── */
      /* Map freq to wave spatial frequency on canvas */
      const k    = (freqTHz - 430) / (770 - 430); // 0..1 across visible range
      const waveLen = W * 0.22 - k * W * 0.08;    // pixels per wavelength (380..750nm maps here)
      const amplitude = H * 0.22;
      const omega = (2 * Math.PI * freqTHz * 1e12) * 0.00000000001; // scaled for animation
      const phase = t * 2.5;                        // animation phase

      /* ── Electric field wave (vertical oscillation) ── */
      ctx.beginPath();
      let first = true;
      for (let px = 0; px <= W; px += 2) {
        const phaseAtX = phase - (px / waveLen) * 2 * Math.PI;
        const Ey = Math.sin(phaseAtX) * amplitude;
        if (first) { ctx.moveTo(px, cy - Ey); first = false; }
        else        { ctx.lineTo(px, cy - Ey); }
      }
      ctx.strokeStyle = colour;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = colour;
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.shadowBlur = 0;

      /* Draw E-field vectors (vertical arrows at every half-wavelength) */
      const arrowStep = waveLen / 2;
      ctx.strokeStyle = colour;
      ctx.fillStyle   = colour;
      for (let px = arrowStep / 2; px < W; px += arrowStep) {
        const phaseAtX = phase - (px / waveLen) * 2 * Math.PI;
        const Ey = Math.sin(phaseAtX) * amplitude;
        if (Math.abs(Ey) < 4) continue; // skip near-zero vectors
        drawArrow(ctx, px, cy, px, cy - Ey, colour, 1.5);
      }

      /* ── Magnetic field wave (horizontal oscillation — into/out of page perspective) ── */
      if (showBField) {
        ctx.beginPath();
        first = true;
        for (let px = 0; px <= W; px += 2) {
          const phaseAtX = phase - (px / waveLen) * 2 * Math.PI;
          /* Bz field oscillates 90° phase from Ey, drawn as y-offset from axis */
          const Bz = Math.sin(phaseAtX) * amplitude * 0.65;
          /* Draw B field slightly offset below axis in a perspective-like way */
          const perspX = px - Bz * 0.4;
          const perspY = cy + Bz * 0.6 + 6;
          if (first) { ctx.moveTo(perspX, perspY); first = false; }
          else        { ctx.lineTo(perspX, perspY); }
        }
        ctx.strokeStyle = "rgba(34,211,238,0.8)";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      /* ── Labels ── */
      ctx.font = "bold 11px 'Inter', system-ui, sans-serif";
      ctx.fillStyle = colour;
      ctx.fillText("E  (Electric field)", 12, cy - amplitude - 14);

      if (showBField) {
        ctx.fillStyle = "#22d3ee";
        ctx.fillText("B  (Magnetic field)", 12, cy + amplitude * 0.7 + 20);
      }

      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillText("→  Direction of propagation (c)", 12, cy + 20);

      /* ── Wavelength indicator ── */
      const wStartX = 60;
      const wEndX   = wStartX + waveLen;
      const indicatorY = cy + amplitude + 36;
      ctx.beginPath();
      ctx.moveTo(wStartX, indicatorY);
      ctx.lineTo(wEndX,   indicatorY);
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Tick marks
      [wStartX, wEndX].forEach(x => {
        ctx.beginPath(); ctx.moveTo(x, indicatorY - 5); ctx.lineTo(x, indicatorY + 5);
        ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.stroke();
      });
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "bold 10px 'Inter', system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`λ = ${wavelengthNm} nm`, (wStartX + wEndX) / 2, indicatorY + 14);
      ctx.textAlign = "left";

      /* ── Moving photon dot ── */
      const photonX = ((phase * waveLen / (2 * Math.PI)) % W + W) % W;
      const phaseAtPhoton = phase - (photonX / waveLen) * 2 * Math.PI;
      const photonY = cy - Math.sin(phaseAtPhoton) * amplitude;
      ctx.beginPath();
      ctx.arc(photonX, photonY, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = colour;
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [freqTHz, colour, showBField]);

  return (
    <div style={{
      background: "#040a14",
      borderRadius: "16px",
      overflow: "hidden",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "280px", display: "block" }}
      />

      {/* Controls */}
      <div style={{
        padding: "20px 24px",
        background: "rgba(8,14,26,0.98)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Frequency slider */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginBottom: "8px",
          }}>
            <span style={{ color: "#94a3b8", fontSize: "12px" }}>Frequency</span>
            <span style={{
              color: colour, fontSize: "13px", fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {freqTHz} THz — {wavelengthNm} nm — {colourName}
            </span>
          </div>
          <input
            type="range" min={380} max={790} step={5}
            value={freqTHz}
            onChange={e => setFreqTHz(Number(e.target.value))}
            style={{ width: "100%", accentColor: colour }}
          />
          {/* Spectrum gradient bar */}
          <div style={{
            height: "8px", borderRadius: "4px", marginTop: "6px",
            background: "linear-gradient(to right, #6a0dad, #4040ff, #00cc44, #ffff00, #ff9900, #ff3333)",
          }} />
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: "10px", color: "#64748b", marginTop: "2px",
          }}>
            <span>380 THz (Violet)</span>
            <span>790 THz (Red)</span>
          </div>
        </div>

        {/* Buttons row */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={togglePause} style={{
            padding: "8px 20px", borderRadius: "8px", border: "none",
            background: paused ? "#22c55e" : "#3b82f6",
            color: "#fff", fontWeight: 700, fontSize: "12px", cursor: "pointer",
          }}>
            {paused ? "▶ Resume" : "⏸ Pause"}
          </button>
          <button onClick={() => setShowBField(b => !b)} style={{
            padding: "8px 20px", borderRadius: "8px",
            border: "1px solid rgba(34,211,238,0.4)",
            background: showBField ? "rgba(34,211,238,0.1)" : "transparent",
            color: showBField ? "#22d3ee" : "#64748b",
            fontWeight: 600, fontSize: "12px", cursor: "pointer",
          }}>
            {showBField ? "🔵 B-field ON" : "⚫ B-field OFF"}
          </button>
        </div>

        {/* Formula display */}
        <div style={{
          marginTop: "16px", padding: "12px 16px",
          background: "rgba(251,191,36,0.06)",
          border: "1px solid rgba(251,191,36,0.2)",
          borderLeft: "4px solid #fbbf24",
          borderRadius: "0 8px 8px 0",
        }}>
          <div style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 700, marginBottom: "4px" }}>
            📐 SPEED OF LIGHT FORMULA
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "14px", color: "#fde047",
          }}>
            c = f × λ
            <span style={{ color: "#94a3b8", fontSize: "11px", marginLeft: "12px" }}>
              = {freqTHz} THz × {wavelengthNm} nm
              = {(freqTHz * 1e12 * wavelengthNm * 1e-9 / 1e8).toFixed(2)} × 10⁸ m/s ≈ 3 × 10⁸ m/s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Helper: draw arrow ─── */
function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  color: string,
  lineWidth: number
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 3) return;
  const angle = Math.atan2(dy, dx);
  const headLen = 8;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLen * Math.cos(angle - Math.PI / 6),
    y2 - headLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    x2 - headLen * Math.cos(angle + Math.PI / 6),
    y2 - headLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}
