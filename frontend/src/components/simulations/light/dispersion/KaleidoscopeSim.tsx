/**
 * FILE: KaleidoscopeSim.tsx
 * LOCATION: src/components/simulations/light/dispersion/KaleidoscopeSim.tsx
 *
 * PURPOSE:
 *   Interactive kaleidoscope simulation showing how multiple plane mirrors
 *   at equal angles create beautiful symmetrical image patterns.
 *
 * KEY CONCEPTS:
 *   - Multiple reflections: with n mirrors at 360°/n apart, you see (n-1) images
 *   - Angle of mirrors determines number of segments: 6 mirrors → 6-fold symmetry
 *   - Each reflection flips the image (left-right)
 *   - Kaleidoscopes use 3 mirrors (triangle) → 6-fold beautiful symmetry
 *   - Toy kaleidoscopes, architectural domes, and Islamic geometric patterns
 *     all use this multi-reflection principle
 *
 * INTERACTIONS:
 *   - Slider: number of mirror segments (3–12)
 *   - Animated coloured shapes at the centre rotate slowly
 *   - The reflected image updates in real time
 *   - "Formula" badge shows: images = 360°/θ − 1
 *
 * TECHNIQUE:
 *   We draw a "seed" pattern in one triangular wedge, then use
 *   ctx.save() / ctx.rotate() / ctx.scale(-1,1) to tile it n times.
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

export default function KaleidoscopeSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [segments, setSegments] = useState(6);
  const [time, setTime] = useState(0);

  /* ── Animation ─────────────────────────────────── */
  useEffect(() => {
    let raf: number;
    let t = 0;
    const loop = () => {
      t += 0.012;
      setTime(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ── Draw one seed wedge ─────────────────────────── */
  const drawSeed = useCallback((
    ctx: CanvasRenderingContext2D,
    R: number,
    t: number,
    segAngle: number,
  ) => {
    /* A collection of animated coloured circles/arcs as the "seed" */
    const shapes = [
      { r: R * 0.22, angle: segAngle * 0.3 + t * 0.3, dist: R * 0.38, color: "#f97316" },
      { r: R * 0.15, angle: segAngle * 0.5 + t * 0.5, dist: R * 0.55, color: "#8b5cf6" },
      { r: R * 0.12, angle: segAngle * 0.7 - t * 0.7, dist: R * 0.45, color: "#06b6d4" },
      { r: R * 0.10, angle: segAngle * 0.2 + t * 0.4, dist: R * 0.25, color: "#f43f5e" },
      { r: R * 0.08, angle: segAngle * 0.8 - t * 0.2, dist: R * 0.62, color: "#22c55e" },
      { r: R * 0.18, angle: segAngle * 0.4 + t * 0.15, dist: R * 0.20, color: "#fde047" },
    ];

    shapes.forEach(({ r, angle, dist, color }) => {
      /* Only draw if the shape centre is inside the wedge clip */
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color + "cc";
      ctx.fill();
    });

    /* Radial line decoration */
    for (let i = 0; i < 3; i++) {
      const lineAngle = segAngle * (0.2 + i * 0.3) + t * 0.1 * (i + 1);
      const x1 = Math.cos(lineAngle) * R * 0.1;
      const y1 = Math.sin(lineAngle) * R * 0.1;
      const x2 = Math.cos(lineAngle) * R * 0.75;
      const y2 = Math.sin(lineAngle) * R * 0.75;

      const lineColors = ["rgba(251,146,60,0.5)", "rgba(139,92,246,0.5)", "rgba(6,182,212,0.5)"];
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = lineColors[i];
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, []);

  /* ── Main draw ──────────────────────────────────── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = Math.min(W, H) * 0.42;

    /* Dark background */
    ctx.fillStyle = "#050912";
    ctx.fillRect(0, 0, W, H);

    /* Outer circle clip */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();

    /* Tile the seed wedge n times with alternating reflections */
    const segAngle = (Math.PI * 2) / segments;
    ctx.translate(cx, cy);

    for (let i = 0; i < segments; i++) {
      ctx.save();
      ctx.rotate(i * segAngle);

      /* Clip to this wedge */
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, R, 0, segAngle);
      ctx.closePath();
      ctx.clip();

      /* Even segments: normal; odd segments: mirror-flipped */
      if (i % 2 === 1) {
        /* Reflect about the bisector of the wedge */
        ctx.rotate(segAngle);
        ctx.scale(1, -1);
      }

      drawSeed(ctx, R, time, segAngle);
      ctx.restore();
      ctx.restore();
    }

    ctx.restore(); /* remove outer circle clip + translate */

    /* Outer ring */
    ctx.save();
    ctx.strokeStyle = "rgba(99,102,241,0.4)";
    ctx.lineWidth = 3;
    ctx.shadowColor = "rgba(99,102,241,0.5)";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    /* Mirror lines (radii) */
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.translate(cx, cy);
    for (let i = 0; i < segments; i++) {
      const a = i * segAngle;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();

    /* Centre label */
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.font = `${Math.max(9, W * 0.018)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(`${segments} mirrors → ${segments}-fold symmetry`, cx, H - 12);

  }, [segments, time, drawSeed]);

  /* ── Canvas setup ──────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      canvas.width = w;
      canvas.height = Math.round(w * 0.75);
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  const numImages = segments; /* each segment shows 1 image including original */

  return (
    <div style={{
      background: "linear-gradient(135deg,#050912 0%,#0f0a1e 100%)",
      borderRadius: 16,
      overflow: "hidden",
      border: "1px solid rgba(139,92,246,0.25)",
      fontFamily: "'Space Grotesk','Inter',sans-serif",
    }}>

      {/* Header */}
      <div style={{
        padding: "14px 20px 10px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>🔮</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
            Kaleidoscope — Multiple Mirror Reflections
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
            n mirrors at equal angles → n-fold symmetrical pattern
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ width: "100%", background: "#050912" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      </div>

      {/* Controls */}
      <div style={{ padding: "14px 18px", background: "rgba(0,0,0,0.4)" }}>

        {/* Segments slider */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600 }}>
              🪞 Number of Mirrors
            </span>
            <span style={{ color: "#a78bfa", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
              {segments} mirrors · {numImages}-fold symmetry
            </span>
          </div>
          <input
            type="range" min={3} max={12} value={segments}
            onChange={e => setSegments(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#8b5cf6", cursor: "pointer" }}
          />
          <div style={{
            display: "flex", justifyContent: "space-between",
            color: "rgba(255,255,255,0.3)", fontSize: 10, marginTop: 2,
          }}>
            <span>3 (triangle)</span><span>6 (classic)</span><span>12 (complex)</span>
          </div>
        </div>

        {/* Preset buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {[3, 6, 8, 12].map(n => (
            <button
              key={n}
              onClick={() => setSegments(n)}
              style={{
                background: segments === n ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${segments === n ? "#8b5cf6" : "rgba(255,255,255,0.1)"}`,
                color: segments === n ? "#a78bfa" : "rgba(255,255,255,0.5)",
                borderRadius: 8, padding: "5px 12px",
                fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}
            >{n} mirrors</button>
          ))}
        </div>

        {/* Formula + insight */}
        <div style={{
          background: "linear-gradient(135deg,rgba(139,92,246,0.12),rgba(99,102,241,0.08))",
          border: "1px solid rgba(139,92,246,0.25)",
          borderRadius: 10, padding: "10px 14px",
        }}>
          <div style={{ color: "#a78bfa", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
            ⚡ Mirror Formula: Images = 360°/θ − 1
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.6 }}>
            With {segments} mirrors at {(360/segments).toFixed(0)}° apart:
            you see <strong style={{ color: "#c4b5fd" }}>{segments - 1} reflected images</strong> + 1 original = {segments} total.
            <br />
            <strong style={{ color: "#4ade80" }}>Real-world uses:</strong> Toy kaleidoscopes (3 mirrors),
            Islamic geometric art, architectural domes, fashion fabric design, optical instruments.
          </div>
        </div>
      </div>
    </div>
  );
}
