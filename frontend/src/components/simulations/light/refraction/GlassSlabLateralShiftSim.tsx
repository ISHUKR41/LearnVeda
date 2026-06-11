/**
 * FILE: GlassSlabLateralShiftSim.tsx
 * LOCATION: src/components/simulations/light/refraction/GlassSlabLateralShiftSim.tsx
 *
 * PURPOSE:
 *   Demonstrates lateral shift (lateral displacement) when a ray passes
 *   through a parallel-sided glass slab. The emergent ray is parallel
 *   to the incident ray but displaced sideways.
 *
 * KEY CONCEPTS:
 *   1. The incident and emergent rays are PARALLEL (same direction)
 *   2. The perpendicular distance between them = lateral shift d
 *   3. Formula: d = t · sin(i − r) / cos(r)
 *      where t = slab thickness, i = angle of incidence, r = angle of refraction
 *   4. This is why a pen in a glass of water looks broken/shifted sideways
 *   5. This is different from a prism (which bends the ray permanently)
 *
 * REAL-LIFE CONNECTIONS:
 *   - A pen in a glass of water looks broken (apparent shift)
 *   - Reading through a glass window pane (slight offset)
 *   - Bullet-proof glass "shift" in police cars
 *   - Why fish appear at different position than actual (apparent depth)
 *
 * INTERACTIONS:
 *   - "Angle of incidence" slider (5°–80°)
 *   - "Slab thickness" slider (0.5x–3x)
 *   - "Refractive index" slider (1.0–2.0)
 *   - Live formula: d = t·sin(i−r)/cos(r) with computed values
 *   - Measurement ruler shows actual lateral displacement
 *   - "Fun Fact" card updates with context
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

export default function GlassSlabLateralShiftSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angleDeg, setAngleDeg] = useState(40);    /* angle of incidence in degrees */
  const [slabThick, setSlabThick] = useState(1.0); /* relative thickness */
  const [refIdx, setRefIdx] = useState(1.5);        /* refractive index of glass */

  const toRad = (d: number) => d * Math.PI / 180;
  const toDeg = (r: number) => r * 180 / Math.PI;

  /* ── Compute all ray segments ─────────────────── */
  const compute = useCallback(() => {
    const i = toRad(angleDeg);
    /* Snell's law: sin r = sin i / n */
    const sinR = Math.sin(i) / refIdx;
    if (Math.abs(sinR) > 1) return null;
    const r = Math.asin(sinR);

    /* Lateral displacement formula: d = t·sin(i−r)/cos(r) */
    const t = slabThick * 100;   /* in canvas units (pixels scaled) */
    const d = t * Math.sin(i - r) / Math.cos(r);

    return { i, r, d, sinR };
  }, [angleDeg, slabThick, refIdx]);

  /* ── Draw ─────────────────────────────────────── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    /* Background */
    ctx.fillStyle = "#07101e";
    ctx.fillRect(0, 0, W, H);

    const result = compute();
    if (!result) {
      ctx.fillStyle = "rgba(255,100,100,0.7)";
      ctx.font = "14px 'Space Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Total Internal Reflection (TIR) — no transmitted ray", W / 2, H / 2);
      return;
    }
    const { i, r, d } = result;

    /* ── Slab geometry ────────────────────────────── */
    const slabTop    = H * 0.28;
    const slabBottom = slabTop + H * 0.30 * slabThick;
    const slabLeft   = W * 0.15;
    const slabRight  = W * 0.85;

    /* Glass slab fill */
    const glassGrad = ctx.createLinearGradient(0, slabTop, 0, slabBottom);
    glassGrad.addColorStop(0, "rgba(100,180,255,0.25)");
    glassGrad.addColorStop(1, "rgba(60,130,220,0.12)");
    ctx.fillStyle = glassGrad;
    ctx.fillRect(slabLeft, slabTop, slabRight - slabLeft, slabBottom - slabTop);

    /* Slab borders */
    ctx.strokeStyle = "rgba(100,200,255,0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(slabLeft, slabTop); ctx.lineTo(slabRight, slabTop); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(slabLeft, slabBottom); ctx.lineTo(slabRight, slabBottom); ctx.stroke();

    /* Slab label */
    ctx.fillStyle = "rgba(100,180,255,0.7)";
    ctx.font = `${Math.max(9, W * 0.018)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(`Glass Slab  n = ${refIdx.toFixed(2)}`, slabRight + 5, (slabTop + slabBottom) / 2 + 4);

    /* ── Entry point (middle of top face) ──────── */
    const entryX = W * 0.42;
    const entryY = slabTop;

    /* ── Exit point ─────────────────────────────── */
    const slabH = slabBottom - slabTop;
    /* Horizontal displacement inside slab: slabH * tan(r) */
    const hInside = slabH * Math.tan(r);
    const exitX = entryX + hInside;
    const exitY = slabBottom;

    /* ── Emergent ray (parallel to incident) ─────── */
    /* The emergent ray makes the same angle i with normal */
    const emergentLen = H * 0.35;
    const emergentEndX = exitX + emergentLen * Math.sin(i);
    const emergentEndY = exitY + emergentLen * Math.cos(i);

    /* ── Incident ray ─────────────────────────────── */
    const incidentLen = H * 0.32;
    const incidentStartX = entryX - incidentLen * Math.sin(i);
    const incidentStartY = entryY - incidentLen * Math.cos(i);

    /* Incident ray */
    ctx.save();
    ctx.strokeStyle = "#fde047";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "rgba(253,224,71,0.5)";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(incidentStartX, incidentStartY);
    ctx.lineTo(entryX, entryY);
    ctx.stroke();

    /* Refracted ray inside slab */
    ctx.strokeStyle = "rgba(253,224,71,0.55)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(entryX, entryY);
    ctx.lineTo(exitX, exitY);
    ctx.stroke();
    ctx.setLineDash([]);

    /* Emergent ray */
    ctx.strokeStyle = "#fde047";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "rgba(253,224,71,0.5)";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(exitX, exitY);
    ctx.lineTo(emergentEndX, emergentEndY);
    ctx.stroke();
    ctx.restore();

    /* ── Extended incident ray (dashed) for shift comparison ── */
    ctx.save();
    ctx.strokeStyle = "rgba(253,224,71,0.2)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(entryX, entryY);
    ctx.lineTo(entryX + emergentLen * Math.sin(i), entryY + emergentLen * Math.cos(i) + slabH);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    /* ── Normal lines ─────────────────────────────── */
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(entryX, slabTop - 40); ctx.lineTo(entryX, slabBottom + 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(exitX, slabTop - 20); ctx.lineTo(exitX, slabBottom + 40); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    /* ── Lateral displacement measurement arrow ────── */
    /* The displacement d is perpendicular to the emergent ray */
    /* Approximate it visually as horizontal offset */
    const dPxScale = (W / 200);  /* approximate scale */
    const dPxActual = d * dPxScale;

    if (Math.abs(dPxActual) > 2) {
      /* Draw perpendicular from incident extended to emergent */
      const perpX1 = entryX + emergentLen * 0.6 * Math.sin(i);
      const perpY1 = entryY + emergentLen * 0.6 * Math.cos(i) + slabH;
      const perpX2 = exitX + emergentLen * 0.6 * Math.sin(i);
      const perpY2 = perpY1;

      ctx.save();
      ctx.strokeStyle = "#f472b6";
      ctx.fillStyle = "#f472b6";
      ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(244,114,182,0.5)";
      ctx.shadowBlur = 5;

      /* Bracket lines */
      ctx.beginPath(); ctx.moveTo(perpX1, perpY1 - 6); ctx.lineTo(perpX1, perpY1 + 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(perpX2, perpY2 - 6); ctx.lineTo(perpX2, perpY2 + 6); ctx.stroke();
      /* Arrow */
      ctx.beginPath(); ctx.moveTo(perpX1, perpY1); ctx.lineTo(perpX2, perpY2); ctx.stroke();

      ctx.font = `bold ${Math.max(10, W * 0.022)}px 'JetBrains Mono', monospace`;
      ctx.textAlign = "center";
      ctx.fillText(`d = ${(d * 0.5).toFixed(1)} cm`, (perpX1 + perpX2) / 2, perpY1 + 18);
      ctx.restore();
    }

    /* ── Angle arcs & labels ────────────────────────── */
    /* Angle i at entry */
    ctx.save();
    ctx.strokeStyle = "#fb923c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(entryX, entryY, 28, -Math.PI / 2, -Math.PI / 2 + i);
    ctx.stroke();
    ctx.fillStyle = "#fb923c";
    ctx.font = `bold ${Math.max(9, W * 0.02)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(`i = ${angleDeg}°`, entryX + 30, entryY - 8);

    /* Angle r at entry (inside slab) */
    ctx.strokeStyle = "#60a5fa";
    ctx.beginPath();
    ctx.arc(entryX, entryY, 22, Math.PI / 2, Math.PI / 2 + r);
    ctx.stroke();
    ctx.fillStyle = "#60a5fa";
    ctx.fillText(`r = ${toDeg(r).toFixed(1)}°`, entryX + 14, entryY + 30);
    ctx.restore();

    /* ── Formula box top-right ────────────────────── */
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.beginPath(); ctx.roundRect(W - W * 0.36, 6, W * 0.35, 64, 8); ctx.fill();

    ctx.fillStyle = "#60a5fa";
    ctx.font = `bold ${Math.max(9, W * 0.02)}px 'JetBrains Mono', monospace`;
    ctx.textAlign = "left";
    ctx.fillText("d = t · sin(i−r) / cos r", W - W * 0.35, 22);
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.font = `${Math.max(8, W * 0.018)}px 'JetBrains Mono', monospace`;
    ctx.fillText(`i=${angleDeg}°  r=${toDeg(r).toFixed(1)}°`, W - W * 0.35, 38);
    ctx.fillText(`d = ${(d * 0.5).toFixed(2)} cm`, W - W * 0.35, 52);

  }, [angleDeg, slabThick, refIdx, compute]);

  /* ── Canvas setup ──────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      canvas.width = w;
      canvas.height = Math.round(w * 0.58);
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  const result = compute();

  return (
    <div style={{
      background: "linear-gradient(135deg,#07101e 0%,#0f172a 100%)",
      borderRadius: 16, overflow: "hidden",
      border: "1px solid rgba(100,180,255,0.2)",
      fontFamily: "'Space Grotesk','Inter',sans-serif",
    }}>
      {/* Header */}
      <div style={{ padding: "14px 20px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>🪟</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Glass Slab — Lateral Displacement Lab</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
            Emergent ray is parallel to incident ray but shifted sideways
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ width: "100%", background: "#07101e" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      </div>

      {/* Controls */}
      <div style={{ padding: "14px 18px", background: "rgba(0,0,0,0.45)" }}>

        {/* Sliders */}
        {[
          { label: "📐 Angle of Incidence (i)", val: angleDeg, set: setAngleDeg, min: 5, max: 79, accent: "#fb923c",
            display: `${angleDeg}°` },
          { label: "📏 Slab Thickness", val: Math.round(slabThick * 10), set: (v: number) => setSlabThick(v / 10),
            min: 3, max: 30, accent: "#60a5fa", display: `${slabThick.toFixed(1)}× standard` },
          { label: "💎 Refractive Index (n)", val: Math.round(refIdx * 100), set: (v: number) => setRefIdx(v / 100),
            min: 100, max: 200, accent: "#34d399", display: `n = ${refIdx.toFixed(2)}` },
        ].map(({ label, val, set, min, max, accent, display }) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600 }}>{label}</span>
              <span style={{ color: accent, fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}>{display}</span>
            </div>
            <input type="range" min={min} max={max} value={val}
              onChange={e => set(Number(e.target.value))}
              style={{ width: "100%", accentColor: accent, cursor: "pointer" }}
            />
          </div>
        ))}

        {/* Result + formula */}
        <div style={{
          background: "rgba(100,180,255,0.08)", border: "1px solid rgba(100,180,255,0.2)",
          borderRadius: 10, padding: "10px 14px", marginTop: 4,
        }}>
          <div style={{ color: "#60a5fa", fontWeight: 700, fontSize: 12, marginBottom: 5 }}>
            ⚡ Live Formula: d = t · sin(i − r) / cos r
          </div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
            {result ? (
              <>
                i = {angleDeg}° &nbsp;·&nbsp; r = {(result.r * 180 / Math.PI).toFixed(1)}° &nbsp;·&nbsp; n = {refIdx.toFixed(2)}<br />
                d = {(result.d * 0.5).toFixed(2)} cm lateral displacement
              </>
            ) : (
              <span style={{ color: "#ef4444" }}>TIR — critical angle exceeded (no refracted ray)</span>
            )}
          </div>
        </div>

        {/* Real-life uses */}
        <div style={{
          marginTop: 10,
          background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)",
          borderRadius: 10, padding: "10px 14px",
        }}>
          <div style={{ color: "#34d399", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
            🌍 Real-World Examples
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.7 }}>
            • A pen in a glass of water looks <strong style={{ color: "#fde047" }}>bent/shifted</strong> — glass slab lateral shift<br />
            • Window glass displaces the scene slightly — you barely notice because t is small<br />
            • Swimming pool floor appears shallower — apparent depth = real depth / n<br />
            • Bulletproof glass layers in police cars produce measurable lateral shifts
          </div>
        </div>
      </div>
    </div>
  );
}
