/**
 * FILE: SpeedInMediumSim.tsx
 * LOCATION: src/components/simulations/light/lenses/SpeedInMediumSim.tsx
 *
 * PURPOSE:
 *   Visual demonstration of how light speed changes in different media,
 *   and how this connects to the refractive index (n = c/v).
 *
 * KEY CONCEPTS:
 *   - Speed of light in vacuum: c = 3 × 10⁸ m/s (the universal speed limit)
 *   - In any medium with refractive index n: v = c/n
 *   - The denser the medium (higher n), the slower light travels
 *   - Wavelength λ = λ₀/n — wavelength compresses in denser medium
 *   - Frequency f stays CONSTANT (it's set by the source, not the medium)
 *   - v = fλ — since f is fixed and λ decreases, v must decrease
 *
 * MEDIA SHOWN (selectable):
 *   Vacuum: n=1.00, v=3.00×10⁸  — fastest possible
 *   Air:    n=1.0003, v≈3.00×10⁸ — almost vacuum
 *   Ice:    n=1.31, v=2.29×10⁸
 *   Water:  n=1.33, v=2.26×10⁸  — swimming pool "shallower" effect
 *   Glass:  n=1.50, v=2.00×10⁸
 *   Diamond:n=2.42, v=1.24×10⁸  — slowest! explains sparkle
 *
 * INTERACTIONS:
 *   - Click a medium card to select it
 *   - Animated "photon" shows actual relative speed with particle trail
 *   - Wavefront compression bar shows wavelength shortening
 *   - Live formula: n = c/v displayed with computed values
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════
 * MEDIA DATA
 * ═══════════════════════════════════════════════════ */
const MEDIA = [
  { name: "Vacuum",  n: 1.000,  color: "#60a5fa", icon: "🌌", fact: "Absolute maximum speed — Einstein's universal constant c" },
  { name: "Air",     n: 1.0003, color: "#93c5fd", icon: "💨", fact: "Almost the same as vacuum — atmosphere barely slows light" },
  { name: "Ice",     n: 1.31,   color: "#bae6fd", icon: "🧊", fact: "Glaciers appear blue — different speeds for different λ" },
  { name: "Water",   n: 1.33,   color: "#38bdf8", icon: "💧", fact: "Why pools look shallower — apparent depth = real/n" },
  { name: "Glass",   n: 1.50,   color: "#a78bfa", icon: "🪟", fact: "Standard crown glass — used in lenses and windows" },
  { name: "Diamond", n: 2.42,   color: "#f9a8d4", icon: "💎", fact: "Highest n of any natural material — causes TIR sparkle" },
];

const C = 3e8; /* Speed of light in vacuum (m/s) */

/* ═══════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════ */
export default function SpeedInMediumSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState(3);  /* Water by default */
  const [time, setTime] = useState(0);

  /* Animation loop */
  useEffect(() => {
    let raf: number;
    let t = 0;
    const loop = () => {
      t += 0.016;
      setTime(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const medium = MEDIA[selected];
  const v = C / medium.n;
  const speedFraction = 1 / medium.n;  /* fraction of c */

  /* ── Draw ─────────────────────────────────────── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    /* Background */
    ctx.fillStyle = "#070c18";
    ctx.fillRect(0, 0, W, H);

    const trackY = H * 0.45;
    const trackH = H * 0.15;

    /* ── Track / medium box ────────────────────── */
    /* Gradient fill representing medium density */
    const grad = ctx.createLinearGradient(0, trackY, 0, trackY + trackH);
    grad.addColorStop(0, `${medium.color}22`);
    grad.addColorStop(1, `${medium.color}08`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(20, trackY, W - 40, trackH, 8);
    ctx.fill();
    ctx.strokeStyle = `${medium.color}40`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    /* Medium label inside track */
    ctx.fillStyle = `${medium.color}80`;
    ctx.font = `${Math.max(9, W * 0.018)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(`${medium.icon} ${medium.name}  (n = ${medium.n})`, 30, trackY + 14);

    /* ── Wavefronts (vertical lines moving right) ─ */
    /* In denser medium: wavefronts are closer together (shorter λ) */
    /* Base wavelength at n=1: waveLen0; compressed: waveLen0/n */
    const waveLen0 = W * 0.12;
    const waveLen  = waveLen0 / medium.n;

    const startX = 20;
    const endX   = W - 20;
    const numWaves = Math.ceil((endX - startX) / waveLen) + 2;

    /* Animate: offset moves right at speed proportional to 1/n */
    const offset = ((time * speedFraction * waveLen * 0.8) % waveLen);

    for (let i = -1; i < numWaves; i++) {
      const wx = startX + i * waveLen + offset;
      if (wx < startX - 2 || wx > endX + 2) continue;

      ctx.save();
      ctx.strokeStyle = `${medium.color}60`;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = medium.color;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.moveTo(wx, trackY + 2);
      ctx.lineTo(wx, trackY + trackH - 2);
      ctx.stroke();
      ctx.restore();
    }

    /* ── Photon dot (moves at speed proportional to 1/n) ── */
    const photonX = startX + ((time * speedFraction * W * 0.45) % (endX - startX));

    /* Trail */
    const trailLen = 40 * speedFraction;
    for (let t2 = 0; t2 < 8; t2++) {
      const tx = photonX - (t2 / 8) * trailLen;
      const alpha = (1 - t2 / 8) * 0.7;
      if (tx > startX) {
        ctx.beginPath();
        ctx.arc(tx, trackY + trackH / 2, (4 - t2 * 0.35) * speedFraction + 1, 0, Math.PI * 2);
        ctx.fillStyle = `${medium.color}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`;
        ctx.fill();
      }
    }

    /* Photon main dot */
    ctx.save();
    ctx.shadowColor = medium.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(photonX, trackY + trackH / 2, 6, 0, Math.PI * 2);
    ctx.fillStyle = medium.color;
    ctx.fill();
    ctx.restore();

    /* ── Speed bar (horizontal gauge) ─────────────── */
    const barY   = trackY + trackH + 22;
    const barH   = 14;
    const barW   = W - 40;

    /* Background */
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath();
    ctx.roundRect(20, barY, barW, barH, 7);
    ctx.fill();

    /* Fill */
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(20, barY, barW * speedFraction, barH, 7);
    const barGrad = ctx.createLinearGradient(20, 0, 20 + barW, 0);
    barGrad.addColorStop(0, medium.color);
    barGrad.addColorStop(1, `${medium.color}88`);
    ctx.fillStyle = barGrad;
    ctx.shadowColor = medium.color;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();

    /* Speed label */
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = `${Math.max(10, W * 0.022)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(`v = ${(v / 1e8).toFixed(3)} × 10⁸ m/s`, 20, barY - 6);
    ctx.textAlign = "right";
    ctx.fillStyle = medium.color;
    ctx.fillText(`${(speedFraction * 100).toFixed(1)}% of c`, W - 20, barY - 6);

    /* ── All media comparison bars ─────────────── */
    const compY = barY + barH + 18;
    const compBarH = 6;
    const compBarW = W - 40;
    const compSpacing = compBarH + 10;

    ctx.font = `${Math.max(8, W * 0.016)}px 'Space Grotesk', sans-serif`;

    MEDIA.forEach((m, i) => {
      const byY = compY + i * compSpacing;
      const frac = 1 / m.n;
      const isSelected = i === selected;

      /* Background track */
      ctx.fillStyle = isSelected ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)";
      ctx.beginPath();
      ctx.roundRect(20, byY, compBarW, compBarH, 3);
      ctx.fill();

      /* Fill */
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(20, byY, compBarW * frac, compBarH, 3);
      ctx.fillStyle = isSelected ? m.color : `${m.color}60`;
      if (isSelected) { ctx.shadowColor = m.color; ctx.shadowBlur = 6; }
      ctx.fill();
      ctx.restore();

      /* Label */
      ctx.fillStyle = isSelected ? m.color : "rgba(255,255,255,0.35)";
      ctx.textAlign = "left";
      ctx.fillText(`${m.icon}`, 22, byY + compBarH - 1);
      ctx.fillText(m.name, 33, byY + compBarH - 1);
      ctx.textAlign = "right";
      ctx.fillText(`n=${m.n}`, W - 20, byY + compBarH - 1);
    });

  }, [selected, time, medium, v, speedFraction]);

  /* ── Canvas setup ──────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      canvas.width = w;
      canvas.height = Math.round(w * 0.72);
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div style={{
      background: "linear-gradient(135deg,#070c18 0%,#0f172a 100%)",
      borderRadius: 16,
      overflow: "hidden",
      border: "1px solid rgba(56,189,248,0.2)",
      fontFamily: "'Space Grotesk','Inter',sans-serif",
    }}>

      {/* Header */}
      <div style={{
        padding: "14px 20px 10px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>⚡</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
            Speed of Light in Different Media
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
            n = c/v — higher refractive index = slower light = shorter wavelength
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ width: "100%", background: "#070c18" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      </div>

      {/* Medium selector */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8,
        padding: "12px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        {MEDIA.map((m, i) => (
          <button
            key={m.name}
            onClick={() => setSelected(i)}
            style={{
              background: selected === i
                ? `rgba(${hexToRgb(m.color)},0.18)`
                : "rgba(255,255,255,0.04)",
              border: `1.5px solid ${selected === i ? m.color : "rgba(255,255,255,0.08)"}`,
              borderRadius: 10, padding: "8px 6px",
              cursor: "pointer", textAlign: "center",
              transition: "all 0.15s",
            }}
          >
            <div style={{ fontSize: 16 }}>{m.icon}</div>
            <div style={{
              color: selected === i ? m.color : "rgba(255,255,255,0.6)",
              fontSize: 11, fontWeight: 700, marginTop: 2,
            }}>{m.name}</div>
            <div style={{
              color: "rgba(255,255,255,0.35)", fontSize: 10, fontFamily: "JetBrains Mono, monospace",
            }}>n = {m.n}</div>
          </button>
        ))}
      </div>

      {/* Formula + fact */}
      <div style={{ padding: "12px 16px", background: "rgba(0,0,0,0.35)" }}>

        {/* Live formula */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10, padding: "10px 14px",
          textAlign: "center", marginBottom: 10,
          fontFamily: "JetBrains Mono, monospace",
        }}>
          <div style={{ color: "#60a5fa", fontSize: 14, fontWeight: 700 }}>
            n = c / v
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 3 }}>
            {medium.n} = 3.00×10⁸ / {(v / 1e8).toFixed(3)}×10⁸
          </div>
        </div>

        {/* Fun fact */}
        <div style={{
          background: `rgba(${hexToRgb(medium.color)},0.08)`,
          border: `1px solid rgba(${hexToRgb(medium.color)},0.2)`,
          borderRadius: 10, padding: "10px 14px",
          display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>{medium.icon}</span>
          <div>
            <div style={{ color: medium.color, fontWeight: 700, fontSize: 12, marginBottom: 3 }}>
              {medium.name} — Did You Know?
            </div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, lineHeight: 1.6 }}>
              {medium.fact}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
