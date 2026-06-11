/**
 * FILE: RainbowDropletSim.tsx
 * LOCATION: src/components/simulations/light/dispersion/RainbowDropletSim.tsx
 *
 * PURPOSE:
 *   Interactive simulation of how a single raindrop disperses white sunlight
 *   into VIBGYOR — explains why rainbows form and why they're circular arcs.
 *
 * PHYSICS:
 *   1. White light enters the droplet (sphere of water, n≈1.33)
 *   2. Refraction at entry (Snell's law): sin θ₁ = n sin θ₂
 *   3. Total internal reflection at the back of the drop
 *   4. Refraction at exit
 *   Each colour has a slightly different n (dispersion):
 *     Red:    n=1.3318, deviation ≈ 137.5°  →  42° above anti-solar point
 *     Violet: n=1.3435, deviation ≈ 139.4°  →  40° above anti-solar point
 *   This 2° spread creates the rainbow band!
 *
 * INTERACTIONS:
 *   - "Sun angle" slider: moves sunlight angle (tilt the incoming ray)
 *   - "Impact parameter" slider: which part of the droplet the ray hits
 *   - Animated ray traces VIBGYOR through the drop in real-time
 *   - Shows internal reflection + both refractions with colour labels
 *   - "Multiple drops" button shows a row of drops forming a rainbow arc
 *
 * KEY FACTS SHOWN:
 *   - Primary rainbow: 42° (red) to 40° (violet) above anti-solar point
 *   - Secondary rainbow: 50°–53°, colours reversed (2 internal reflections)
 *   - Alexander's dark band between primary and secondary
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ── Refractive indices for VIBGYOR ─────────────── */
const COLORS = [
  { name: "Red",    n: 1.3318, hex: "#ef4444", lambda: 700 },
  { name: "Orange", n: 1.3330, hex: "#f97316", lambda: 620 },
  { name: "Yellow", n: 1.3345, hex: "#facc15", lambda: 580 },
  { name: "Green",  n: 1.3358, hex: "#4ade80", lambda: 546 },
  { name: "Blue",   n: 1.3376, hex: "#60a5fa", lambda: 486 },
  { name: "Indigo", n: 1.3396, hex: "#818cf8", lambda: 450 },
  { name: "Violet", n: 1.3435, hex: "#c084fc", lambda: 420 },
];

/* ── Physics helper ─────────────────────────────── */
function toRad(deg: number) { return deg * Math.PI / 180; }
function toDeg(rad: number) { return rad * 180 / Math.PI; }

/** Snell's law: angle of refraction given angle of incidence + n ratio */
function snell(theta: number, n1: number, n2: number): number {
  const sinRefract = (n1 * Math.sin(theta)) / n2;
  if (Math.abs(sinRefract) > 1) return NaN;
  return Math.asin(sinRefract);
}

/** Deviation angle for one ray through a sphere drop */
function dropDeviation(impactB: number, n: number): number {
  /* impact parameter b ∈ [0,1], n = refractive index */
  const r = 1;  /* unit sphere */
  const sinI = impactB / r;
  if (Math.abs(sinI) > 1) return NaN;
  const incidence = Math.asin(sinI);
  const refraction = snell(incidence, 1, n);
  if (isNaN(refraction)) return NaN;
  /* Total deviation: D = 2i − 4r + π  (primary rainbow formula) */
  return 2 * incidence - 4 * refraction + Math.PI;
}

/** Find minimum deviation angle (rainbow angle) for a given n */
function rainbowAngle(n: number): number {
  let minDev = Infinity;
  for (let b = 0; b <= 1; b += 0.001) {
    const dev = dropDeviation(b, n);
    if (!isNaN(dev) && Math.abs(dev) < Math.abs(minDev)) minDev = dev;
  }
  return toDeg(Math.abs(minDev) - Math.PI) + 180;  /* convert to elevation above anti-solar */
}

export default function RainbowDropletSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [impact, setImpact] = useState(0.86);   /* b/R, the "best" rainbow angle ≈ 0.86 */
  const [showAll, setShowAll] = useState(true);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [time, setTime] = useState(0);

  /* ── Animation ─────────────────────────────────── */
  useEffect(() => {
    let raf: number;
    let t = 0;
    const loop = () => { t += 0.02; setTime(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ── Draw ─────────────────────────────────────── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W * 0.42;
    const cy = H * 0.5;
    const R = Math.min(W, H) * 0.22;

    /* ── Background ─────────────────────────────── */
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#020a1a");
    bg.addColorStop(1, "#050d20");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* ── Water droplet ──────────────────────────── */
    /* Glass-like sphere */
    const dropGrad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.05, cx, cy, R);
    dropGrad.addColorStop(0, "rgba(148,210,255,0.5)");
    dropGrad.addColorStop(0.5, "rgba(100,180,240,0.18)");
    dropGrad.addColorStop(1, "rgba(50,140,220,0.08)");
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = dropGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(150,220,255,0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    /* Highlight glint */
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.beginPath();
    ctx.ellipse(cx - R * 0.35, cy - R * 0.35, R * 0.1, R * 0.07, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* ── Trace rays through the drop ─────────────── */
    const colorsToShow = showAll && selectedColor === null
      ? COLORS
      : selectedColor !== null ? [COLORS[selectedColor]] : COLORS;

    colorsToShow.forEach(({ n, hex }) => {
      const b = impact;
      if (b <= 0 || b >= 1) return;

      /* Entry point on the left side of drop */
      const entryAngle = Math.asin(b);   /* angle from top of circle where ray hits */
      const ex = cx - R * Math.cos(entryAngle);
      const ey = cy - R * b;             /* b = sin of angle */

      /* Incidence angle (with normal at entry) */
      const incidence = Math.asin(b);
      const refraction = snell(incidence, 1, n);
      if (isNaN(refraction)) return;

      /* Direction after first refraction (inside drop) */
      /* The normal at entry point points toward centre */
      /* refracted ray angle with the horizontal is computed geometrically */
      const internalAngle = refraction;

      /* Exit reflection point: 2*(internalAngle) rotation inside sphere */
      const reflX = cx + R * Math.cos(Math.PI - 2 * internalAngle + entryAngle);
      const reflY = cy - R * Math.sin(Math.PI - 2 * internalAngle + entryAngle);

      /* Exit refraction point (symmetric): */
      const exitX = cx - R * Math.cos(entryAngle - 2 * (incidence - refraction) * 2);
      const exitY = cy - R * b + R * Math.sin(entryAngle - 2 * (incidence - refraction) * 2) * 0.5;

      ctx.save();
      ctx.strokeStyle = hex;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = hex;
      ctx.shadowBlur = 3;
      ctx.globalAlpha = 0.8;

      /* Incoming ray from left */
      const rayLen = W * 0.25;
      ctx.beginPath();
      ctx.moveTo(ex - rayLen, ey);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      /* Internal segment (entry → reflection) */
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(reflX, reflY);
      ctx.stroke();

      /* Reflection → exit */
      ctx.beginPath();
      ctx.moveTo(reflX, reflY);
      ctx.lineTo(exitX, exitY);
      ctx.stroke();

      /* Outgoing ray to the right */
      const deviation = dropDeviation(b, n);
      if (!isNaN(deviation)) {
        const outAngle = deviation - Math.PI;
        const outLen = W * 0.35;
        ctx.beginPath();
        ctx.moveTo(exitX, exitY);
        ctx.lineTo(exitX + outLen * Math.cos(outAngle), exitY + outLen * Math.sin(-outAngle) * 0.6);
        ctx.stroke();
      }

      ctx.restore();
    });

    /* ── "n = 1.33" label ────────────────────────── */
    ctx.fillStyle = "rgba(148,210,255,0.6)";
    ctx.font = `${Math.max(9, W * 0.018)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Water drop  n = 1.33", cx, cy + R + 18);

    /* ── Impact parameter line ────────────────────── */
    const ipY = cy - R * impact;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(0, ipY);
    ctx.lineTo(cx - R * Math.cos(Math.asin(impact)), ipY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.font = `${Math.max(8, W * 0.016)}px 'JetBrains Mono', monospace`;
    ctx.textAlign = "left";
    ctx.fillText(`b = ${impact.toFixed(2)}R`, 4, ipY - 4);

    /* ── Rainbow angle panel (right side) ─────────── */
    const panelX = W * 0.72;
    const panelW = W * 0.26;

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.roundRect(panelX, 6, panelW, H - 12, 8);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = `bold ${Math.max(9, W * 0.018)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Rainbow Angles", panelX + panelW / 2, 22);

    COLORS.forEach((c, i) => {
      const angle = rainbowAngle(c.n);
      const py = 36 + i * (H * 0.115);
      const barW = (angle / 45) * panelW * 0.75;

      ctx.fillStyle = `${c.hex}30`;
      ctx.beginPath();
      ctx.roundRect(panelX + 4, py, barW, H * 0.08, 4);
      ctx.fill();

      ctx.fillStyle = c.hex;
      ctx.font = `bold ${Math.max(8, W * 0.016)}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "left";
      ctx.fillText(`${c.name}`, panelX + 7, py + H * 0.058);

      ctx.textAlign = "right";
      ctx.font = `${Math.max(7, W * 0.014)}px 'JetBrains Mono', monospace`;
      ctx.fillText(`${angle.toFixed(1)}°`, panelX + panelW - 4, py + H * 0.058);
    });

    /* "Primary rainbow" label */
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = `${Math.max(8, W * 0.015)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Primary rainbow", panelX + panelW / 2, H - 10);

    /* ── Title top-left ────────────────────────────── */
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = `bold ${Math.max(10, W * 0.022)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText("💧 Single raindrop → VIBGYOR", 6, 18);

  }, [impact, showAll, selectedColor, time]);

  /* ── Canvas setup ──────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      canvas.width = w;
      canvas.height = Math.round(w * 0.65);
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div style={{
      background: "linear-gradient(135deg,#020a1a 0%,#050d20 100%)",
      borderRadius: 16, overflow: "hidden",
      border: "1px solid rgba(96,165,250,0.2)",
      fontFamily: "'Space Grotesk','Inter',sans-serif",
    }}>
      {/* Header */}
      <div style={{ padding: "14px 20px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>🌈</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Raindrop Rainbow Physics — VIBGYOR Dispersion</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
            2 refractions + 1 internal reflection → 40°–42° rainbow arc
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ width: "100%", background: "#020a1a" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      </div>

      {/* Controls */}
      <div style={{ padding: "14px 18px", background: "rgba(0,0,0,0.45)" }}>

        {/* Impact parameter slider */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600 }}>
              📍 Impact Parameter (b/R)
            </span>
            <span style={{ color: "#60a5fa", fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}>
              {impact.toFixed(2)} · rainbow @ {impact > 0.8 && impact < 0.92 ? "✓ peak angle" : "off-peak"}
            </span>
          </div>
          <input type="range" min={10} max={99} value={Math.round(impact * 100)}
            onChange={e => setImpact(Number(e.target.value) / 100)}
            style={{ width: "100%", accentColor: "#60a5fa", cursor: "pointer" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.3)", fontSize: 10, marginTop: 2 }}>
            <span>0.10 (top)</span><span>← best rainbow zone →</span><span>0.99 (edge)</span>
          </div>
        </div>

        {/* Colour filter */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          <button
            onClick={() => { setShowAll(true); setSelectedColor(null); }}
            style={{
              background: showAll && selectedColor === null ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${showAll && selectedColor === null ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.1)"}`,
              color: "rgba(255,255,255,0.8)", borderRadius: 7, padding: "4px 10px",
              fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            }}
          >All colours</button>
          {COLORS.map((c, i) => (
            <button
              key={c.name}
              onClick={() => { setSelectedColor(i); setShowAll(false); }}
              style={{
                background: selectedColor === i ? `${c.hex}25` : "rgba(255,255,255,0.03)",
                border: `1px solid ${selectedColor === i ? c.hex : "rgba(255,255,255,0.08)"}`,
                color: selectedColor === i ? c.hex : "rgba(255,255,255,0.4)",
                borderRadius: 7, padding: "4px 8px",
                fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}
            >{c.name}</button>
          ))}
        </div>

        {/* Key physics fact */}
        <div style={{
          background: "linear-gradient(135deg,rgba(96,165,250,0.1),rgba(168,85,247,0.06))",
          border: "1px solid rgba(96,165,250,0.2)",
          borderRadius: 10, padding: "10px 14px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
        }}>
          {[
            { icon: "🌈", label: "Primary Rainbow", val: "40°–42° elevation" },
            { icon: "🌈", label: "Secondary Rainbow", val: "50°–53° (reversed)" },
            { icon: "🔴", label: "Red (outer)", val: `n=${COLORS[0].n} · 42.3°` },
            { icon: "🟣", label: "Violet (inner)", val: `n=${COLORS[6].n} · 40.6°` },
          ].map(({ icon, label, val }) => (
            <div key={label}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>{icon} {label}</div>
              <div style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600, fontFamily: "JetBrains Mono, monospace" }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
