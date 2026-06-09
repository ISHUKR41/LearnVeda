/**
 * FILE: SnellsLawSim.tsx
 * LOCATION: frontend/src/components/simulations/light/refraction/SnellsLawSim.tsx
 * PURPOSE: Interactive Snell's Law refraction simulation.
 *          User adjusts the angle of incidence and selects different media pairs.
 *          The simulation renders:
 *            - Two media (upper and lower) with different refractive indices
 *            - Incident ray bending at the interface
 *            - Normal at the point of incidence
 *            - Refracted ray computed via Snell's Law (n₁ sin θ₁ = n₂ sin θ₂)
 *            - Angle arcs and real-time sin ratio display
 *            - Total Internal Reflection when angle exceeds critical angle
 *
 * INTERACTIONS: Slider for angle, dropdown for media pairs
 * PHYSICS: Snell's Law, Critical Angle, Total Internal Reflection
 * LAST UPDATED: 2026-06-08
 */

"use client";

import React, { useRef, useState } from "react";
import {
  drawRay,
  drawNormal,
  drawAngleArc,
  drawLabel,
  drawGrid,
  useCanvasSetup,
  useAnimationLoop,
  snellsLaw,
  criticalAngle,
  Point,
} from "../SimulationEngine";
import styles from "../SimulationEngine.module.css";

/* Media options with refractive indices */
const MEDIA_PAIRS = [
  { name: "Air → Glass", n1: 1.0, n2: 1.5, color1: "rgba(135, 206, 250, 0.08)", color2: "rgba(96, 165, 250, 0.15)" },
  { name: "Air → Water", n1: 1.0, n2: 1.33, color1: "rgba(135, 206, 250, 0.08)", color2: "rgba(59, 130, 246, 0.12)" },
  { name: "Air → Diamond", n1: 1.0, n2: 2.42, color1: "rgba(135, 206, 250, 0.08)", color2: "rgba(168, 85, 247, 0.15)" },
  { name: "Water → Glass", n1: 1.33, n2: 1.5, color1: "rgba(59, 130, 246, 0.12)", color2: "rgba(96, 165, 250, 0.15)" },
  { name: "Glass → Air (TIR possible)", n1: 1.5, n2: 1.0, color1: "rgba(96, 165, 250, 0.15)", color2: "rgba(135, 206, 250, 0.08)" },
  { name: "Diamond → Air (TIR possible)", n1: 2.42, n2: 1.0, color1: "rgba(168, 85, 247, 0.15)", color2: "rgba(135, 206, 250, 0.08)" },
];

interface SnellsLawSimProps {
  id?: string;
  title?: string;
}

const SnellsLawSim: React.FC<SnellsLawSimProps> = ({
  id = "snells-law-sim",
  title = "Snell's Law — Refraction of Light",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [angleDeg, setAngleDeg] = useState(30);
  const [mediaIdx, setMediaIdx] = useState(0);

  const dims = useCanvasSetup(canvasRef, containerRef, 420);

  const media = MEDIA_PAIRS[mediaIdx];
  const angleRad = (angleDeg * Math.PI) / 180;
  const refractedAngle = snellsLaw(angleRad, media.n1, media.n2);
  const isTIR = refractedAngle === null;
  const critAngle = media.n1 > media.n2 ? criticalAngle(media.n1, media.n2) : null;

  useAnimationLoop(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = dims.width;
    const H = dims.height;
    const dpr = window.devicePixelRatio || 1;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* Draw the two media */
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, H);

    /* Upper medium */
    ctx.fillStyle = media.color1;
    ctx.fillRect(0, 0, W, H / 2);

    /* Lower medium */
    ctx.fillStyle = media.color2;
    ctx.fillRect(0, H / 2, W, H / 2);

    drawGrid(ctx, W, H);

    /* Interface line */
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();
    ctx.restore();

    /* Point of incidence */
    const hitPoint: Point = { x: W / 2, y: H / 2 };

    /* Draw normal */
    drawNormal(ctx, hitPoint, -Math.PI / 2, H * 0.7, "rgba(255,255,255,0.2)");

    /* Incident ray — comes from upper-left */
    const rayLength = H * 0.4;
    const incidentStart: Point = {
      x: hitPoint.x - rayLength * Math.sin(angleRad),
      y: hitPoint.y - rayLength * Math.cos(angleRad),
    };
    drawRay(ctx, incidentStart, hitPoint, "#fbbf24", 2.5);

    /* Angle arc for incidence */
    const iArcStart = -Math.PI / 2;
    const iArcEnd = -Math.PI / 2 - angleRad;
    drawAngleArc(ctx, hitPoint, Math.min(iArcStart, iArcEnd), Math.max(iArcStart, iArcEnd), 40, "#fbbf24", `θ₁ = ${angleDeg}°`);

    if (isTIR) {
      /* Total Internal Reflection — ray reflects back into same medium */
      const reflectedEnd: Point = {
        x: hitPoint.x + rayLength * Math.sin(angleRad),
        y: hitPoint.y - rayLength * Math.cos(angleRad),
      };
      drawRay(ctx, hitPoint, reflectedEnd, "#f87171", 2.5);

      /* TIR Label */
      ctx.save();
      ctx.fillStyle = "#f87171";
      ctx.font = "bold 15px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("⚡ Total Internal Reflection!", W / 2, 30);

      if (critAngle) {
        ctx.font = "12px Inter, system-ui, sans-serif";
        ctx.fillStyle = "#fb923c";
        ctx.fillText(`Critical Angle = ${(critAngle * 180 / Math.PI).toFixed(1)}°`, W / 2, 50);
      }
      ctx.restore();

      /* Reflected angle arc */
      const rArcStart = -Math.PI / 2;
      const rArcEnd = -Math.PI / 2 + angleRad;
      drawAngleArc(ctx, hitPoint, Math.min(rArcStart, rArcEnd), Math.max(rArcStart, rArcEnd), 40, "#f87171", `θᵣ = ${angleDeg}°`);

    } else {
      /* Refracted ray */
      const refAngle = refractedAngle!;
      const refractedEnd: Point = {
        x: hitPoint.x + rayLength * Math.sin(refAngle),
        y: hitPoint.y + rayLength * Math.cos(refAngle),
      };
      drawRay(ctx, hitPoint, refractedEnd, "#34d399", 2.5);

      /* Angle arc for refraction */
      const rDeg = Math.round(refAngle * 180 / Math.PI);
      const rArcStart = Math.PI / 2;
      const rArcEnd = Math.PI / 2 - refAngle;
      drawAngleArc(ctx, hitPoint, Math.min(rArcStart, rArcEnd), Math.max(rArcStart, rArcEnd), 40, "#34d399", `θ₂ = ${rDeg}°`);

      /* Snell's Law verification */
      ctx.save();
      ctx.fillStyle = "rgba(226, 232, 240, 0.7)";
      ctx.font = "13px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      const sinI = Math.sin(angleRad).toFixed(3);
      const sinR = Math.sin(refAngle).toFixed(3);
      const ratio = (Math.sin(angleRad) / Math.sin(refAngle)).toFixed(3);
      ctx.fillText(`sin(${angleDeg}°) / sin(${rDeg}°) = ${sinI} / ${sinR} = ${ratio}`, W / 2, 30);

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 13px Inter, system-ui, sans-serif";
      ctx.fillText(`n₂/n₁ = ${(media.n2 / media.n1).toFixed(3)} ✓`, W / 2, 50);
      ctx.restore();
    }

    /* Media labels */
    drawLabel(ctx, `Medium 1: n₁ = ${media.n1}`, { x: 14, y: 14 }, "#94a3b8", 12, "left");
    drawLabel(ctx, `Medium 2: n₂ = ${media.n2}`, { x: 14, y: H / 2 + 14 }, "#94a3b8", 12, "left");

    /* Point of incidence glow */
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(hitPoint.x, hitPoint.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* Ray labels */
    drawLabel(ctx, "Incident Ray", { x: incidentStart.x + 10, y: incidentStart.y + 10 }, "#fbbf24", 11, "left");

    if (!isTIR) {
      drawLabel(ctx, "Refracted Ray", { x: W / 2 + 30, y: H * 0.75 }, "#34d399", 11, "left");
    } else {
      drawLabel(ctx, "Reflected Ray", { x: W / 2 + 30, y: H * 0.3 }, "#f87171", 11, "left");
    }

    drawLabel(ctx, "Normal", { x: W / 2 + 8, y: H * 0.12 }, "rgba(255,255,255,0.3)", 10, "left");

  }, true);

  return (
    <div className={styles.simCard} id={id}>
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>🌊</div>
        <div className={styles.simTitle}>{title}</div>
        <div className={styles.simBadge}>
          {isTIR ? "⚡ TIR" : "Interactive"}
        </div>
      </div>

      <div className={styles.canvasWrap} ref={containerRef}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", cursor: "crosshair" }}
        />
      </div>

      <div className={styles.controlPanel}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Angle of Incidence</label>
          <input
            type="range"
            className={styles.slider}
            min="0"
            max="89"
            step="1"
            value={angleDeg}
            onChange={(e) => setAngleDeg(parseInt(e.target.value))}
          />
          <div className={styles.controlValue}>{angleDeg}°</div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Media Pair</label>
          <div className={styles.toggleGroup} style={{ flexWrap: "wrap" }}>
            {MEDIA_PAIRS.map((pair, idx) => (
              <button
                key={idx}
                className={mediaIdx === idx ? styles.toggleBtnActive : styles.toggleBtn}
                onClick={() => { setMediaIdx(idx); setAngleDeg(30); }}
                style={{ fontSize: "10px", padding: "4px 8px" }}
              >
                {pair.name.split("(")[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.infoPanel}>
        <div className={styles.infoChip}>
          <span className={styles.infoChipLabel}>n₁ =</span>
          <span className={styles.infoChipValue}>{media.n1}</span>
        </div>
        <div className={styles.infoChip}>
          <span className={styles.infoChipLabel}>n₂ =</span>
          <span className={styles.infoChipValue}>{media.n2}</span>
        </div>
        <div className={styles.infoChip}>
          <span className={styles.infoChipLabel}>θ₁ =</span>
          <span className={styles.infoChipValue}>{angleDeg}°</span>
        </div>
        <div className={styles.infoChip}>
          <span className={styles.infoChipLabel}>θ₂ =</span>
          <span className={styles.infoChipValue}>
            {isTIR ? "TIR ⚡" : `${Math.round((refractedAngle! * 180) / Math.PI)}°`}
          </span>
        </div>
        {critAngle && (
          <div className={styles.infoChip}>
            <span className={styles.infoChipLabel}>θc =</span>
            <span className={styles.infoChipValue}>{(critAngle * 180 / Math.PI).toFixed(1)}°</span>
          </div>
        )}
      </div>

      <div className={styles.instructionText}>
        🎛️ Adjust the angle and switch media pairs. Watch for Total Internal Reflection!
      </div>
    </div>
  );
};

export default SnellsLawSim;
