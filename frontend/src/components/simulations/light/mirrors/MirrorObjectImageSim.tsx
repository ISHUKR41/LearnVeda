/**
 * FILE: MirrorObjectImageSim.tsx
 * LOCATION: src/components/simulations/light/mirrors/
 *
 * PURPOSE:
 *   Comprehensive spherical mirror simulation covering all 6 object positions.
 *   Student slides the object along the principal axis and the simulation:
 *     • Draws all 3 standard rays (parallel, through C, through F)
 *     • Shows where they converge (or appear to diverge) → image position
 *     • Displays image properties: Real/Virtual, Erect/Inverted, Magnified/Diminished
 *     • Mirror formula: 1/v + 1/u = 1/f (sign convention visible)
 *     • Toggle concave ↔ convex mirror
 *
 * OBJECT POSITIONS (concave mirror):
 *   1. Beyond C     → Real, inverted, diminished
 *   2. At C         → Real, inverted, same size
 *   3. Between C&F  → Real, inverted, magnified
 *   4. At F         → Image at infinity
 *   5. Between F&P  → Virtual, erect, magnified
 *   6. Convex       → Always virtual, erect, diminished
 *
 * DEPENDENCIES: SimulationEngine.module.css
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "../SimulationEngine.module.css";

type MirrorType = "concave" | "convex";

/* Compute image position using mirror formula: 1/v = 1/f - 1/u */
function mirrorFormula(u: number, f: number): number {
  if (Math.abs(1 / f - 1 / u) < 0.0001) return Infinity;
  return 1 / (1 / f - 1 / u);
}

/* Describe image based on v, u */
function describeImage(v: number, u: number, mirrorType: MirrorType) {
  if (!isFinite(v) || Math.abs(v) > 9000) {
    return { nature: "At Infinity", erect: "—", size: "—", color: "#94a3b8" };
  }
  const real = v < 0; /* negative v = real (in front of mirror) */
  const m = -v / u;
  const erect = m > 0;
  const size  = Math.abs(m) > 1 ? "Magnified" : Math.abs(m) < 1 ? "Diminished" : "Same size";
  return {
    nature: real ? "Real" : "Virtual",
    erect:  erect ? "Erect" : "Inverted",
    size,
    color:  real ? "#f87171" : "#34d399",
    m: m.toFixed(2),
  };
}

export default function MirrorObjectImageSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const tRef      = useRef<number>(0);

  const [mirrorType, setMirrorType] = useState<MirrorType>("concave");
  const [objectDist, setObjectDist] = useState(40); /* |u| in cm — slider 5..80 */

  const focalLength = mirrorType === "concave" ? -20 : 20; /* cm, sign convention */
  const u_cm = -objectDist; /* object always in front → negative */
  const v_cm = mirrorFormula(u_cm, focalLength);
  const img  = describeImage(v_cm, u_cm, mirrorType);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    tRef.current += 0.016;

    /* Background */
    ctx.fillStyle = "#080d1a";
    ctx.fillRect(0, 0, W, H);

    /* Scale: 1 cm = 4 px. Mirror at centre */
    const SCALE = 4;
    const cx_px = W * 0.52; /* mirror pole x */
    const ay_px = H * 0.50; /* principal axis y */

    /* Focus and centre of curvature in px */
    const f_px = Math.abs(focalLength) * SCALE; /* focal length in px */
    const c_px = 2 * f_px;

    /* Mirror arc drawing */
    const arcHeight = 90;
    const arcWidth  = 18;

    /* Draw subtle axis */
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth   = 1;
    ctx.setLineDash([6, 5]);
    ctx.beginPath(); ctx.moveTo(0, ay_px); ctx.lineTo(W, ay_px); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    /* ─── Mirror shape ─── */
    ctx.save();
    const mGrad = ctx.createLinearGradient(cx_px - arcWidth, 0, cx_px + arcWidth, 0);
    mGrad.addColorStop(0, "rgba(148,163,184,0.2)");
    mGrad.addColorStop(0.5, "rgba(203,213,225,0.9)");
    mGrad.addColorStop(1, "rgba(148,163,184,0.2)");
    ctx.strokeStyle = mGrad;
    ctx.lineWidth   = 4;
    ctx.shadowColor = "#818cf8";
    ctx.shadowBlur  = 12;

    /* Mirror arc: concave curves toward object (left), convex curves away */
    const sign = mirrorType === "concave" ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(cx_px + sign * arcWidth, ay_px - arcHeight);
    ctx.quadraticCurveTo(cx_px - sign * arcWidth, ay_px, cx_px + sign * arcWidth, ay_px + arcHeight);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();

    /* ─── Key points: P, F, C ─── */
    const drawPoint = (x: number, y: number, label: string, color: string) => {
      ctx.save();
      ctx.fillStyle   = color;
      ctx.shadowColor = color;
      ctx.shadowBlur  = 12;
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur  = 0;
      ctx.font        = "bold 13px Inter, sans-serif";
      ctx.fillStyle   = color;
      ctx.textAlign   = "center";
      ctx.fillText(label, x, y + 20);
      ctx.restore();
    };

    /* For concave: F and C are in front (to the left of mirror) */
    const fDir = mirrorType === "concave" ? -1 : 1; /* concave: F to left */
    const fx_px = cx_px + fDir * f_px;
    const Cx_px = cx_px + fDir * c_px;

    drawPoint(cx_px,  ay_px, "P", "#94a3b8");
    drawPoint(fx_px,  ay_px, "F", "#fbbf24");
    drawPoint(Cx_px,  ay_px, "C", "#a78bfa");

    /* ─── Object arrow ─── */
    const objH  = 55; /* object height in px */
    const ox_px = cx_px - objectDist * SCALE; /* always to the left (in front) */

    ctx.save();
    ctx.strokeStyle = "#22c55e";
    ctx.fillStyle   = "#22c55e";
    ctx.shadowColor = "#22c55e";
    ctx.shadowBlur  = 14;
    ctx.lineWidth   = 2.5;
    /* Vertical arrow */
    ctx.beginPath(); ctx.moveTo(ox_px, ay_px); ctx.lineTo(ox_px, ay_px - objH); ctx.stroke();
    /* Arrow head */
    ctx.beginPath();
    ctx.moveTo(ox_px - 7, ay_px - objH + 10);
    ctx.lineTo(ox_px, ay_px - objH);
    ctx.lineTo(ox_px + 7, ay_px - objH + 10);
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;
    /* "Object" label */
    ctx.font      = "bold 11px Inter, sans-serif";
    ctx.fillStyle = "#86efac";
    ctx.textAlign = "center";
    ctx.fillText("Object", ox_px, ay_px + 20);
    ctx.restore();

    /* ─── Image arrow (if real, in front of mirror) ─── */
    if (isFinite(v_cm) && Math.abs(v_cm) < 200) {
      const iv_px  = cx_px + v_cm * SCALE; /* v is negative for real image */
      const imgH   = objH * Math.abs(v_cm / u_cm);
      const imgTop = v_cm > 0
        ? ay_px - Math.min(imgH, 120) /* virtual: same side as object direction */
        : ay_px + Math.min(imgH, 120); /* real: inverted */

      const imgColor = v_cm < 0 ? "#ef4444" : "#38bdf8";

      ctx.save();
      ctx.strokeStyle = imgColor;
      ctx.fillStyle   = imgColor;
      ctx.shadowColor = imgColor;
      ctx.shadowBlur  = 12;
      ctx.lineWidth   = 2;
      ctx.setLineDash(v_cm > 0 ? [5, 4] : []);
      ctx.beginPath(); ctx.moveTo(iv_px, ay_px); ctx.lineTo(iv_px, imgTop); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(iv_px - 7, imgTop + (v_cm > 0 ? -10 : 10));
      ctx.lineTo(iv_px, imgTop);
      ctx.lineTo(iv_px + 7, imgTop + (v_cm > 0 ? -10 : 10));
      ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.font      = "bold 11px Inter, sans-serif";
      ctx.fillStyle = imgColor;
      ctx.textAlign = "center";
      ctx.fillText(v_cm < 0 ? "Image (Real)" : "Image (Virtual)", iv_px, ay_px + 20);
      ctx.restore();
    } else if (!isFinite(v_cm) || Math.abs(v_cm) > 200) {
      /* Parallel rays — image at infinity */
      ctx.save();
      ctx.strokeStyle = "#94a3b8";
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(W - 40, ay_px - 20); ctx.lineTo(W - 40, ay_px + 20); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#94a3b8";
      ctx.font      = "11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("∞", W - 40, ay_px - 28);
      ctx.restore();
    }

    /* ─── Animated photon along principal axis ─── */
    const ph = (tRef.current * 0.5) % 1;
    const phx = cx_px - objectDist * SCALE * (1 - ph);
    ctx.save();
    ctx.fillStyle   = "#fde047";
    ctx.shadowColor = "#fde047";
    ctx.shadowBlur  = 18;
    ctx.beginPath(); ctx.arc(phx, ay_px, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    animRef.current = requestAnimationFrame(draw);
  }, [mirrorType, objectDist, focalLength, u_cm, v_cm]);

  useEffect(() => {
    cancelAnimationFrame(animRef.current);
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <div className={styles.simWrapper}>
      <div className={styles.simTitle}>🔮 Spherical Mirror — Object Position Lab</div>
      <div className={styles.simSubtitle}>
        Slide the object to see how image changes across all 6 positions
      </div>

      {/* Mirror toggle */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "12px" }}>
        {(["concave", "convex"] as MirrorType[]).map(m => (
          <button
            key={m}
            onClick={() => setMirrorType(m)}
            style={{
              background: mirrorType === m
                ? (m === "concave" ? "rgba(168,85,247,0.25)" : "rgba(59,130,246,0.25)")
                : "rgba(30,41,59,0.8)",
              border: `1px solid ${mirrorType === m
                ? (m === "concave" ? "rgba(168,85,247,0.5)" : "rgba(59,130,246,0.5)")
                : "rgba(255,255,255,0.1)"}`,
              color: mirrorType === m ? "#e2e8f0" : "#94a3b8",
              borderRadius: "8px", padding: "7px 18px",
              cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
            }}
          >
            {m === "concave" ? "⌒ Concave" : "⌣ Convex"}
          </button>
        ))}
      </div>

      {/* Object distance slider */}
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
          Object distance (u) = <strong style={{ color: "#22c55e" }}>{objectDist} cm</strong>
          {" "}({objectDist > 40 ? "beyond C" : objectDist === 40 ? "at C" : objectDist > 20 ? "between C & F" : objectDist === 20 ? "at F" : "between F & P"})
        </label>
        <input
          type="range" min={5} max={80} value={objectDist}
          onChange={e => setObjectDist(Number(e.target.value))}
          style={{ width: "min(320px,90%)", display: "block", margin: "8px auto" }}
        />
      </div>

      <canvas ref={canvasRef} width={700} height={340} className={styles.canvas} />

      {/* Image property cards */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "10px", marginTop: "14px",
      }}>
        {[
          { label: "Nature",    value: img.nature,             color: img.color || "#94a3b8" },
          { label: "Position",  value: img.erect,              color: "#94a3b8" },
          { label: "Size",      value: img.size,               color: "#94a3b8" },
          { label: "v",         value: isFinite(v_cm) ? `${v_cm.toFixed(1)} cm` : "∞", color: "#fbbf24" },
          { label: "m = −v/u", value: isFinite(v_cm) ? (img.m ?? "—") : "∞",          color: "#a78bfa" },
        ].map(card => (
          <div key={card.label} style={{
            background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px", padding: "10px 12px", textAlign: "center",
          }}>
            <div style={{ color: "#64748b", fontSize: "0.72rem", marginBottom: "4px" }}>{card.label}</div>
            <div style={{ color: card.color, fontWeight: 700, fontSize: "0.9rem" }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Mirror formula display */}
      <div style={{
        marginTop: "14px", textAlign: "center",
        background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)",
        borderRadius: "10px", padding: "12px",
      }}>
        <span style={{ color: "#c4b5fd", fontSize: "0.88rem", fontFamily: "monospace" }}>
          1/v + 1/u = 1/f → {" "}
          1/v + 1/({u_cm}) = 1/({focalLength}) → {" "}
          v = {isFinite(v_cm) ? v_cm.toFixed(1) : "∞"} cm
        </span>
      </div>
    </div>
  );
}
