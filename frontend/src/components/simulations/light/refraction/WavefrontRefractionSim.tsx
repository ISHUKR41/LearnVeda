/**
 * FILE: WavefrontRefractionSim.tsx
 * LOCATION: src/components/simulations/light/refraction/WavefrontRefractionSim.tsx
 *
 * PURPOSE:
 *   Huygens' wavefront construction showing WHY light bends at a boundary.
 *   Animated plane wavefronts (lines of equal phase) hit a glass/water
 *   surface at an angle — students see each part of the wavefront slow
 *   down at different times → the wavefront tilts → direction changes.
 *
 * KEY CONCEPTS:
 *   - Huygens' Principle: every point on a wavefront is a new source of
 *     secondary wavelets (small circles).
 *   - Refraction is a consequence of the CHANGE IN SPEED at the boundary.
 *   - In denser medium: wavelength λ decreases, speed v decreases,
 *     but FREQUENCY f stays the same.
 *   - n₁ sin θ₁ = n₂ sin θ₂ (Snell's Law) derived geometrically from wavefronts.
 *   - Why light bends TOWARD normal when entering denser medium:
 *     the part that hits the boundary first slows down → the wavefront
 *     tilts toward the normal.
 *
 * INTERACTIONS:
 *   - "Angle of Incidence" slider (0–85°)
 *   - "Medium 2 Refractive Index" slider (1.0–2.5)
 *   - Live display of θ₁, θ₂, n₁, n₂, and ratio λ₁/λ₂
 *   - Toggle: show wavefronts vs show only ray arrows
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

export default function WavefrontRefractionSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(45);      /* incidence angle in degrees */
  const [n2, setN2] = useState(1.5);            /* refractive index of medium 2 */
  const [showWaves, setShowWaves] = useState(true);
  const [time, setTime] = useState(0);

  const n1 = 1.0; /* medium 1 is always air */

  /* Snell's law — compute refraction angle */
  const sinTheta2 = (n1 / n2) * Math.sin((angle * Math.PI) / 180);
  const theta2 = sinTheta2 >= 1
    ? null /* TIR */
    : (Math.asin(sinTheta2) * 180) / Math.PI;

  /* ── Animation ────────────────────────────────── */
  useEffect(() => {
    let raf: number;
    let t = 0;
    const loop = () => {
      t += 0.018;
      setTime(t);
      raf = requestAnimationFrame(loop);
    };
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
    const boundaryY = H * 0.5;
    const cx = W / 2;

    /* Clear */
    ctx.fillStyle = "#070b14";
    ctx.fillRect(0, 0, W, H);

    /* ── Medium labels ───────────────────────────── */
    /* Medium 1 (top) — air (blue tint) */
    ctx.fillStyle = "rgba(59,130,246,0.05)";
    ctx.fillRect(0, 0, W, boundaryY);

    /* Medium 2 (bottom) — glass/water (amber tint) */
    ctx.fillStyle = "rgba(245,158,11,0.07)";
    ctx.fillRect(0, boundaryY, W, H - boundaryY);

    /* Boundary line */
    ctx.strokeStyle = "rgba(148,163,184,0.5)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(0, boundaryY);
    ctx.lineTo(W, boundaryY);
    ctx.stroke();
    ctx.setLineDash([]);

    /* Normal (dashed vertical at centre) */
    ctx.strokeStyle = "rgba(148,163,184,0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, H);
    ctx.stroke();
    ctx.setLineDash([]);

    /* Medium labels */
    ctx.font = `bold ${Math.max(10, W * 0.022)}px 'Space Grotesk', sans-serif`;
    ctx.fillStyle = "rgba(147,197,253,0.7)";
    ctx.textAlign = "left";
    ctx.fillText(`Medium 1 (Air)  n₁ = ${n1.toFixed(1)}`, 10, 22);
    ctx.fillStyle = "rgba(252,211,77,0.7)";
    ctx.fillText(`Medium 2 (Glass)  n₂ = ${n2.toFixed(1)}`, 10, boundaryY + 20);

    /* ── Incident and refracted ray directions ────── */
    const theta1Rad = (angle * Math.PI) / 180;
    const theta2Rad = theta2 !== null ? (theta2 * Math.PI) / 180 : null;

    const rayLen = Math.min(W, H) * 0.38;

    /* Incident ray (going downward toward boundary) */
    const incDirX = Math.sin(theta1Rad);
    const incDirY = Math.cos(theta1Rad);
    const incStart = { x: cx - incDirX * rayLen, y: boundaryY - incDirY * rayLen };
    const incEnd   = { x: cx, y: boundaryY };

    /* Refracted ray (going downward from boundary) */
    let refEnd = { x: cx, y: H };
    if (theta2Rad !== null) {
      const refDirX = Math.sin(theta2Rad);
      const refDirY = Math.cos(theta2Rad);
      refEnd = { x: cx + refDirX * rayLen, y: boundaryY + refDirY * rayLen };
    }

    /* ── Animated wavefronts ─────────────────────── */
    if (showWaves) {
      /* Wavefronts are lines perpendicular to the ray direction, moving toward boundary */
      const numWaves = 5;
      const waveSpacing = 28; /* pixels between wavefronts */
      const waveLen = W * 0.55;

      for (let i = 0; i < numWaves; i++) {
        /* Phase offset for each wavefront based on time */
        const phase = ((time * 0.6 + i / numWaves) % 1);
        /* Distance along ray from incStart to incEnd */
        const progress = phase;
        const wX = incStart.x + (incEnd.x - incStart.x) * progress;
        const wY = incStart.y + (incEnd.y - incStart.y) * progress;

        /* Only draw wavefront if it's still in medium 1 */
        if (wY < boundaryY) {
          ctx.save();
          ctx.translate(wX, wY);
          ctx.rotate(theta1Rad - Math.PI / 2); /* perpendicular to ray */
          ctx.strokeStyle = `rgba(96,165,250,${0.7 - progress * 0.3})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-waveLen / 2, 0);
          ctx.lineTo(waveLen / 2, 0);
          ctx.stroke();
          ctx.restore();
        }
      }

      /* Refracted wavefronts in medium 2 */
      if (theta2Rad !== null) {
        for (let i = 0; i < numWaves; i++) {
          const phase = ((time * 0.6 * (n1 / n2) + i / numWaves) % 1); /* slower in denser medium */
          const wX = incEnd.x + (refEnd.x - incEnd.x) * phase;
          const wY = incEnd.y + (refEnd.y - incEnd.y) * phase;

          if (wY > boundaryY) {
            ctx.save();
            ctx.translate(wX, wY);
            ctx.rotate(theta2Rad - Math.PI / 2);
            /* Wavefronts are closer together (shorter wavelength) in denser medium */
            const compressedLen = waveLen * (n1 / n2);
            ctx.strokeStyle = `rgba(252,211,77,${0.7 - phase * 0.3})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-compressedLen / 2, 0);
            ctx.lineTo(compressedLen / 2, 0);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    /* ── Draw rays (arrows) ──────────────────────── */
    /* Incident ray */
    ctx.save();
    ctx.strokeStyle = "rgba(96,165,250,0.9)";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "rgba(96,165,250,0.5)";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(incStart.x, incStart.y);
    ctx.lineTo(incEnd.x, incEnd.y);
    ctx.stroke();
    ctx.restore();

    /* Refracted ray */
    if (theta2Rad !== null) {
      ctx.save();
      ctx.strokeStyle = "rgba(252,211,77,0.9)";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "rgba(252,211,77,0.5)";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(incEnd.x, incEnd.y);
      ctx.lineTo(refEnd.x, refEnd.y);
      ctx.stroke();
      ctx.restore();
    } else {
      /* TIR — reflected ray */
      ctx.save();
      ctx.strokeStyle = "rgba(239,68,68,0.9)";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "rgba(239,68,68,0.5)";
      ctx.shadowBlur = 8;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, boundaryY);
      ctx.lineTo(cx + incDirX * rayLen, boundaryY - incDirY * rayLen);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      ctx.fillStyle = "rgba(239,68,68,0.8)";
      ctx.font = `bold ${Math.max(10, W * 0.022)}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("⚡ Total Internal Reflection!", cx, boundaryY - 30);
    }

    /* ── Angle arcs ──────────────────────────────── */
    const arcR = 28;
    /* θ₁ arc */
    ctx.strokeStyle = "rgba(96,165,250,0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    /* Angle from normal (vertical) to incident ray */
    ctx.arc(cx, boundaryY, arcR, -Math.PI / 2 - theta1Rad, -Math.PI / 2, false);
    ctx.stroke();
    ctx.fillStyle = "rgba(96,165,250,0.8)";
    ctx.font = `bold ${Math.max(10, W * 0.02)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText(`θ₁=${angle}°`, cx - arcR - 4, boundaryY - 12);

    /* θ₂ arc */
    if (theta2 !== null) {
      ctx.strokeStyle = "rgba(252,211,77,0.6)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, boundaryY, arcR, Math.PI / 2, Math.PI / 2 + (theta2 * Math.PI) / 180, false);
      ctx.stroke();
      ctx.fillStyle = "rgba(252,211,77,0.8)";
      ctx.textAlign = "left";
      ctx.fillText(`θ₂=${theta2.toFixed(1)}°`, cx + arcR + 4, boundaryY + 18);
    }

  }, [angle, n2, showWaves, time]);

  /* ── Canvas setup ──────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      canvas.width = w;
      canvas.height = Math.round(w * 0.62);
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div style={{
      background: "linear-gradient(135deg,#070b14 0%,#0f172a 100%)",
      borderRadius: 16,
      overflow: "hidden",
      border: "1px solid rgba(245,158,11,0.2)",
      fontFamily: "'Space Grotesk','Inter',sans-serif",
    }}>

      {/* Header */}
      <div style={{
        padding: "14px 20px 10px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>🌊</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
            Huygens Wavefront — Why Light Bends
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
            Watch wavefronts slow down in denser media → direction changes
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ width: "100%", background: "#070b14" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      </div>

      {/* Controls */}
      <div style={{ padding: "16px 20px", background: "rgba(0,0,0,0.4)" }}>

        {/* Snell's law live */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10, padding: "10px 14px",
          marginBottom: 14, textAlign: "center",
        }}>
          <span style={{ color: "#93c5fd", fontWeight: 700, fontFamily: "JetBrains Mono, monospace", fontSize: 14 }}>
            n₁ sin θ₁ = n₂ sin θ₂
          </span>
          <br />
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
            {n1.toFixed(1)} × sin({angle}°) = {n2.toFixed(1)} × sin({theta2 !== null ? theta2.toFixed(1) : "—"}°)
          </span>
          <br />
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
            = {(n1 * Math.sin((angle * Math.PI) / 180)).toFixed(4)}
            {theta2 !== null ? ` = ${(n2 * Math.sin((theta2 * Math.PI) / 180)).toFixed(4)} ✓` : " → TIR!"}
          </span>
        </div>

        {/* Sliders */}
        {[
          { label: "📐 Angle of Incidence (θ₁)", val: angle, set: setAngle, min: 0, max: 85, accent: "#60a5fa", display: `${angle}°` },
          { label: "🔬 Refractive Index (n₂)", val: n2 * 10, set: (v: number) => setN2(v / 10), min: 10, max: 25, accent: "#fbbf24", display: n2.toFixed(1) },
        ].map(({ label, val, set, min, max, accent, display }) => (
          <div key={label} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600 }}>{label}</span>
              <span style={{ color: accent, fontSize: 13, fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>{display}</span>
            </div>
            <input
              type="range" min={min} max={max} value={val}
              onChange={e => set(Number(e.target.value))}
              style={{ width: "100%", accentColor: accent, cursor: "pointer" }}
            />
          </div>
        ))}

        {/* Toggle */}
        <button
          onClick={() => setShowWaves(v => !v)}
          style={{
            background: showWaves ? "rgba(245,158,11,0.2)" : "rgba(99,102,241,0.15)",
            border: `1px solid ${showWaves ? "rgba(245,158,11,0.4)" : "rgba(99,102,241,0.3)"}`,
            color: showWaves ? "#fbbf24" : "rgba(255,255,255,0.5)",
            borderRadius: 8, padding: "7px 16px",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {showWaves ? "🌊 Wavefronts ON" : "➡️ Ray Only"}
        </button>

        {/* Key insight */}
        <div style={{
          marginTop: 14,
          background: "linear-gradient(135deg,rgba(245,158,11,0.1),rgba(251,191,36,0.05))",
          border: "1px solid rgba(245,158,11,0.25)",
          borderRadius: 10, padding: "10px 14px",
        }}>
          <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: 12, marginBottom: 3 }}>⚡ Why Light Bends</div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, lineHeight: 1.6 }}>
            The wavefront hits the glass at an angle. The part that enters glass first
            slows down (<em>speed = c/n</em>) while the rest is still in air. This creates
            a pivot → the entire wavefront tilts toward the normal.
            Shorter spacing of wavefronts = shorter wavelength in denser medium.
          </div>
        </div>
      </div>
    </div>
  );
}
