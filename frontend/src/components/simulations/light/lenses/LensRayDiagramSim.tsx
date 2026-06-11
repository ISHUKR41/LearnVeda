/**
 * FILE: LensRayDiagramSim.tsx
 * LOCATION: src/components/simulations/light/lenses/
 *
 * PURPOSE:
 *   Complete convex/concave lens simulation showing all 3 principal rays
 *   with real-time image formation. Student drags or sliders the object
 *   position to observe all image cases.
 *
 *   Three principal rays for a CONVEX lens:
 *     Ray 1 — parallel to axis → after lens, passes through F₂
 *     Ray 2 — passes through optical centre O → continues straight (undeviated)
 *     Ray 3 — passes through F₁ → after lens, becomes parallel to axis
 *
 *   Image properties:
 *     • Real / Virtual
 *     • Erect / Inverted
 *     • Magnified / Same / Diminished
 *
 * PHYSICS: Lens formula 1/v - 1/u = 1/f, Magnification m = v/u
 * COVERED IN: Class 10 Topic 5 (Image formation by lenses) and Topic 6
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "../SimulationEngine.module.css";

type LensType = "convex" | "concave";

function lensFormula(u: number, f: number): number {
  /* 1/v = 1/f + 1/u */
  if (Math.abs(1 / f - 1 / u) < 0.0001) return Infinity;
  return 1 / (1 / f + 1 / u);
}

export default function LensRayDiagramSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const tRef      = useRef<number>(0);

  const [lensType, setLensType]   = useState<LensType>("convex");
  const [objDist,  setObjDist]    = useState(48); /* |u| in cm */
  const [showRays, setShowRays]   = useState(true);

  /* Sign convention: object always to the left → u is negative */
  const f   = lensType === "convex" ? 20 : -20; /* focal length cm */
  const u   = -objDist;
  const v   = lensFormula(u, f);
  const m   = isFinite(v) ? v / u : Infinity;
  const real = isFinite(v) && v > 0;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    tRef.current += 0.016;

    ctx.fillStyle = "#060d1a";
    ctx.fillRect(0, 0, W, H);

    const SCALE  = 3.5; /* px per cm */
    const ox_px  = W / 2; /* lens centre (optical axis) */
    const ay_px  = H / 2; /* principal axis */

    /* Subtle grid */
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.restore();

    /* Principal axis */
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.setLineDash([8, 6]);
    ctx.beginPath(); ctx.moveTo(0, ay_px); ctx.lineTo(W, ay_px); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    /* ─── Lens shape ─── */
    const lensH = 100;
    ctx.save();
    const lGrad = ctx.createLinearGradient(ox_px - 12, 0, ox_px + 12, 0);
    if (lensType === "convex") {
      lGrad.addColorStop(0, "rgba(6,182,212,0.15)");
      lGrad.addColorStop(0.5, "rgba(6,182,212,0.5)");
      lGrad.addColorStop(1, "rgba(6,182,212,0.15)");
    } else {
      lGrad.addColorStop(0, "rgba(6,182,212,0.5)");
      lGrad.addColorStop(0.5, "rgba(6,182,212,0.15)");
      lGrad.addColorStop(1, "rgba(6,182,212,0.5)");
    }
    ctx.strokeStyle = "#06b6d4";
    ctx.fillStyle   = lGrad;
    ctx.shadowColor = "#06b6d4";
    ctx.shadowBlur  = 14;
    ctx.lineWidth   = 2.5;

    /* Lens outline paths */
    const lt = lensType === "convex";
    ctx.beginPath();
    /* Left edge */
    ctx.moveTo(ox_px, ay_px - lensH);
    ctx.bezierCurveTo(
      ox_px + (lt ? -20 : 20), ay_px - lensH / 2,
      ox_px + (lt ? -20 : 20), ay_px + lensH / 2,
      ox_px, ay_px + lensH,
    );
    /* Right edge */
    ctx.bezierCurveTo(
      ox_px + (lt ? 20 : -20), ay_px + lensH / 2,
      ox_px + (lt ? 20 : -20), ay_px - lensH / 2,
      ox_px, ay_px - lensH,
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();

    /* ─── F₁, F₂ (focal points) ─── */
    const f1x = ox_px - Math.abs(f) * SCALE; /* F₁ to the left */
    const f2x = ox_px + Math.abs(f) * SCALE; /* F₂ to the right */
    const drawFocus = (x: number, label: string) => {
      ctx.save();
      ctx.fillStyle   = "#fbbf24";
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur  = 12;
      ctx.beginPath(); ctx.arc(x, ay_px, 5, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.font       = "bold 12px Inter, sans-serif";
      ctx.textAlign  = "center";
      ctx.fillStyle  = "#fbbf24";
      ctx.fillText(label, x, ay_px + 18);
      ctx.restore();
    };
    drawFocus(lensType === "convex" ? f1x : f2x, "F₁");
    drawFocus(lensType === "convex" ? f2x : f1x, "F₂");

    /* ─── Object arrow ─── */
    const objX  = ox_px - objDist * SCALE;
    const objH  = 60;
    ctx.save();
    ctx.strokeStyle = "#22c55e"; ctx.fillStyle = "#22c55e";
    ctx.shadowColor = "#22c55e"; ctx.shadowBlur = 12; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(objX, ay_px); ctx.lineTo(objX, ay_px - objH); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(objX - 7, ay_px - objH + 10);
    ctx.lineTo(objX, ay_px - objH);
    ctx.lineTo(objX + 7, ay_px - objH + 10);
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.font = "bold 11px Inter, sans-serif"; ctx.textAlign = "center";
    ctx.fillStyle = "#86efac";
    ctx.fillText("Object (AB)", objX, ay_px + 18);
    ctx.restore();

    /* ─── Image arrow ─── */
    if (isFinite(v) && Math.abs(v) < 220) {
      const imgX = ox_px + v * SCALE;
      const imgH_px = Math.min(Math.abs(objH * m), 130);
      const imgTop = real ? ay_px + imgH_px : ay_px - imgH_px;
      const ic = real ? "#ef4444" : "#38bdf8";
      ctx.save();
      ctx.strokeStyle = ic; ctx.fillStyle = ic;
      ctx.shadowColor = ic; ctx.shadowBlur = 12; ctx.lineWidth = 2;
      ctx.setLineDash(real ? [] : [5, 4]);
      ctx.beginPath(); ctx.moveTo(imgX, ay_px); ctx.lineTo(imgX, imgTop); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(imgX - 6, imgTop + (real ? -10 : 10));
      ctx.lineTo(imgX, imgTop);
      ctx.lineTo(imgX + 6, imgTop + (real ? -10 : 10));
      ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.font = "bold 11px Inter, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(real ? "Image (A'B') Real" : "Image (A'B') Virtual", imgX, ay_px + 18);
      ctx.restore();
    }

    /* ─── 3 Principal Rays (convex lens) ─── */
    if (showRays && objDist > 0) {
      const tipX = objX;
      const tipY = ay_px - objH;

      /* Ray 1: parallel to axis → through F₂ */
      const rayColor1 = "#fde047";
      const drawRay = (pts: [number,number][], color: string, dashed = false) => {
        ctx.save();
        ctx.strokeStyle = color; ctx.lineWidth = 1.8;
        ctx.shadowColor = color; ctx.shadowBlur = 8;
        if (dashed) ctx.setLineDash([5, 5]);
        ctx.beginPath();
        pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
        ctx.restore();
      };

      if (lensType === "convex") {
        /* Ray 1: horizontal → after lens goes through F₂ */
        const r1endX = isFinite(v) ? ox_px + v * SCALE + 60 : W;
        const r1slope = isFinite(v) ? (ay_px - tipY) / v / SCALE * (r1endX - ox_px) : 0;
        drawRay([[tipX, tipY], [ox_px, tipY], [r1endX, tipY + r1slope]], rayColor1);

        /* Ray 2: through centre O → straight */
        const slope2  = (tipY - ay_px) / (tipX - ox_px);
        const extX    = ox_px + 220;
        const extY    = ay_px + slope2 * 220;
        drawRay([[tipX, tipY], [extX, extY]], "#f97316");

        /* Ray 3: through F₁ → parallel after lens */
        const dirX = ox_px - f1x;
        const dirY = ay_px - tipY; /* going toward lens */
        const scale3 = (ox_px - tipX) / dirX;
        const atLensY = tipY + dirY * scale3;
        drawRay([[tipX, tipY], [ox_px, atLensY], [ox_px + 200, atLensY]], "#c084fc");
      } else {
        /* Concave lens: rays diverge */
        drawRay([[tipX, tipY], [ox_px, tipY], [W, tipY + 30]], rayColor1);
        const slope2 = (tipY - ay_px) / (tipX - ox_px);
        drawRay([[tipX, tipY], [W, ay_px + slope2 * (W - ox_px)]], "#f97316");
      }
    }

    /* ─── Animated photon ─── */
    const ph = (tRef.current * 0.45) % 1;
    const phx = ox_px - objDist * SCALE * (1 - ph);
    ctx.save();
    ctx.fillStyle = "#fde047"; ctx.shadowColor = "#fde047"; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.arc(phx, ay_px, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    /* Labels */
    ctx.fillStyle = "#64748b"; ctx.font = "11px Inter, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("2F₁", ox_px - 2 * Math.abs(f) * SCALE, ay_px + 18);
    ctx.fillText("2F₂", ox_px + 2 * Math.abs(f) * SCALE, ay_px + 18);

    animRef.current = requestAnimationFrame(draw);
  }, [lensType, objDist, f, u, v, m, real, showRays]);

  useEffect(() => {
    cancelAnimationFrame(animRef.current);
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const imgProperties = () => {
    if (!isFinite(v) || Math.abs(v) > 800) return { nature: "At Infinity", orient: "—", size: "—" };
    return {
      nature: real ? "Real" : "Virtual",
      orient: isFinite(m) ? (m < 0 ? "Inverted" : "Erect") : "—",
      size: isFinite(m) ? (Math.abs(m) > 1 ? "Magnified" : Math.abs(m) < 1 ? "Diminished" : "Same size") : "—",
    };
  };
  const ip = imgProperties();

  return (
    <div className={styles.simWrapper}>
      <div className={styles.simTitle}>🔭 Lens Ray Diagram — Full Interactive Lab</div>
      <div className={styles.simSubtitle}>
        Slide the object to see all image positions — 1/v − 1/u = 1/f
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "10px", flexWrap: "wrap" }}>
        {(["convex", "concave"] as LensType[]).map(lt => (
          <button key={lt} onClick={() => setLensType(lt)} style={{
            background: lensType === lt ? "rgba(6,182,212,0.2)" : "rgba(30,41,59,0.8)",
            border: `1px solid ${lensType === lt ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.1)"}`,
            color: lensType === lt ? "#67e8f9" : "#94a3b8",
            borderRadius: "8px", padding: "7px 18px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
          }}>
            {lt === "convex" ? "⊕ Convex (Converging)" : "⊖ Concave (Diverging)"}
          </button>
        ))}
        <button onClick={() => setShowRays(v => !v)} style={{
          background: showRays ? "rgba(253,224,71,0.15)" : "rgba(30,41,59,0.8)",
          border: `1px solid ${showRays ? "rgba(253,224,71,0.35)" : "rgba(255,255,255,0.1)"}`,
          color: showRays ? "#fde047" : "#94a3b8",
          borderRadius: "8px", padding: "7px 18px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
        }}>{showRays ? "✓" : "○"} Show Rays</button>
      </div>

      <div style={{ textAlign: "center", marginBottom: "6px" }}>
        <label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
          |u| = <strong style={{ color: "#22c55e" }}>{objDist} cm</strong>
          {" "}({objDist > 40 ? "> 2F" : objDist === 40 ? "= 2F" : objDist > 20 ? "between F & 2F" : objDist === 20 ? "= F" : "< F"})
        </label>
        <input type="range" min={5} max={80} value={objDist}
          onChange={e => setObjDist(Number(e.target.value))}
          style={{ width: "min(320px,90%)", display: "block", margin: "8px auto" }} />
      </div>

      <canvas ref={canvasRef} width={700} height={320} className={styles.canvas} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "10px", marginTop: "12px" }}>
        {[
          { label: "Nature",   value: ip.nature,   color: real ? "#f87171" : "#34d399" },
          { label: "Erect?",   value: ip.orient,   color: "#94a3b8" },
          { label: "Size",     value: ip.size,     color: "#94a3b8" },
          { label: "v",        value: isFinite(v) ? `${v.toFixed(1)} cm` : "∞", color: "#fbbf24" },
          { label: "m = v/u", value: isFinite(m) ? m.toFixed(2) : "∞", color: "#a78bfa" },
        ].map(c => (
          <div key={c.label} style={{
            background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px", padding: "10px", textAlign: "center",
          }}>
            <div style={{ color: "#64748b", fontSize: "0.72rem", marginBottom: "4px" }}>{c.label}</div>
            <div style={{ color: c.color, fontWeight: 700, fontSize: "0.88rem" }}>{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
