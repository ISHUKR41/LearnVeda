/**
 * FILE: HumanEyeSim.tsx
 * LOCATION: frontend/src/components/simulations/light/eye/HumanEyeSim.tsx
 * PURPOSE: Interactive Human Eye cross-section simulation.
 *          Shows how the eye lens focuses light onto the retina, with:
 *            - Adjustable object distance (accommodation)
 *            - Ciliary muscle tension visualization
 *            - Focal length changes as object moves
 *            - Near point and far point markers
 *            - Toggle between normal, myopic, and hypermetropic eye
 *            - Corrective lens overlay for defective vision
 *
 * INTERACTIONS: Slider for object distance, toggle eye defects, show correction
 * PHYSICS: Power of accommodation, lens formula, corrective lenses
 * LAST UPDATED: 2026-06-08
 */

"use client";

import React, { useRef, useState } from "react";
import {
  drawRay,
  drawLabel,
  drawGrid,
  useCanvasSetup,
  useAnimationLoop,
  Point,
} from "../SimulationEngine";
import styles from "../SimulationEngine.module.css";

type EyeMode = "normal" | "myopia" | "hypermetropia";

interface HumanEyeSimProps {
  id?: string;
  title?: string;
}

const HumanEyeSim: React.FC<HumanEyeSimProps> = ({
  id = "human-eye-sim",
  title = "Human Eye — Accommodation & Defects",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [objectDist, setObjectDist] = useState(0.5); // 0=near, 1=far
  const [eyeMode, setEyeMode] = useState<EyeMode>("normal");
  const [showCorrection, setShowCorrection] = useState(false);

  const dims = useCanvasSetup(canvasRef, containerRef, 380);

  useAnimationLoop((time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = dims.width;
    const H = dims.height;
    const dpr = window.devicePixelRatio || 1;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, H);
    drawGrid(ctx, W, H);

    const centerY = H * 0.5;
    const eyeCenterX = W * 0.6;
    const eyeRadiusX = W * 0.18;
    const eyeRadiusY = H * 0.32;

    /* Draw eyeball */
    ctx.save();
    const eyeGrad = ctx.createRadialGradient(
      eyeCenterX, centerY, 0,
      eyeCenterX, centerY, eyeRadiusX
    );
    eyeGrad.addColorStop(0, "rgba(255, 255, 255, 0.03)");
    eyeGrad.addColorStop(0.8, "rgba(255, 255, 255, 0.01)");
    eyeGrad.addColorStop(1, "rgba(148, 163, 184, 0.08)");

    ctx.fillStyle = eyeGrad;
    ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(eyeCenterX, centerY, eyeRadiusX, eyeRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    /* Cornea (front bulge) */
    const corneaX = eyeCenterX - eyeRadiusX;
    ctx.save();
    ctx.strokeStyle = "rgba(96, 165, 250, 0.5)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(corneaX + 8, centerY, eyeRadiusY * 0.6, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();
    ctx.restore();
    drawLabel(ctx, "Cornea", { x: corneaX - 10, y: centerY - eyeRadiusY * 0.6 - 10 }, "#60a5fa", 10);

    /* Lens position */
    const lensX = eyeCenterX - eyeRadiusX * 0.5;
    
    /* Lens thickness changes with accommodation */
    const lensThickness = eyeMode === "myopia" ? 18 : eyeMode === "hypermetropia" ? 8 : 
      10 + 8 * (1 - objectDist); // Thicker for near objects
    const lensHeightHalf = eyeRadiusY * 0.35;

    /* Draw lens */
    ctx.save();
    ctx.fillStyle = "rgba(251, 191, 36, 0.15)";
    ctx.strokeStyle = "rgba(251, 191, 36, 0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lensX, centerY - lensHeightHalf);
    ctx.quadraticCurveTo(lensX + lensThickness, centerY, lensX, centerY + lensHeightHalf);
    ctx.quadraticCurveTo(lensX - lensThickness, centerY, lensX, centerY - lensHeightHalf);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    drawLabel(ctx, "Lens", { x: lensX, y: centerY + lensHeightHalf + 8 }, "#fbbf24", 10);

    /* Retina (back of eye) */
    const retinaX = eyeCenterX + eyeRadiusX * 0.85;
    ctx.save();
    ctx.strokeStyle = "#f87171";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(eyeCenterX + eyeRadiusX * 0.15, centerY, eyeRadiusX * 0.72, -0.4, 0.4);
    ctx.stroke();
    ctx.restore();
    drawLabel(ctx, "Retina", { x: retinaX + 8, y: centerY - 20 }, "#f87171", 10, "left");

    /* Optic nerve */
    ctx.save();
    ctx.strokeStyle = "rgba(168, 85, 247, 0.5)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(eyeCenterX + eyeRadiusX, centerY);
    ctx.lineTo(eyeCenterX + eyeRadiusX + 25, centerY + 15);
    ctx.stroke();
    ctx.restore();
    drawLabel(ctx, "Optic Nerve", { x: eyeCenterX + eyeRadiusX + 5, y: centerY + 20 }, "#a78bfa", 9, "left");

    /* Iris/Pupil */
    ctx.save();
    ctx.fillStyle = "rgba(30, 58, 138, 0.6)";
    ctx.beginPath();
    ctx.ellipse(lensX - 5, centerY, 3, lensHeightHalf * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* Light rays from object */
    const objectX = W * 0.05 + objectDist * W * 0.3;
    const rayColor = "#fbbf24";

    /* Object */
    ctx.save();
    ctx.fillStyle = "#34d399";
    ctx.beginPath();
    ctx.moveTo(objectX, centerY - 30);
    ctx.lineTo(objectX - 5, centerY);
    ctx.lineTo(objectX + 5, centerY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    drawLabel(ctx, "Object", { x: objectX, y: centerY - 40 }, "#34d399", 10);

    /* Three rays from object top to lens */
    const objTopY = centerY - 25;
    const rayPaths = [
      { from: { x: objectX, y: objTopY }, to: { x: lensX, y: objTopY } },      // Parallel ray
      { from: { x: objectX, y: objTopY }, to: { x: lensX, y: centerY } },       // Central ray
      { from: { x: objectX, y: objTopY }, to: { x: lensX, y: objTopY + 15 } },  // Lower ray
    ];

    /* Calculate focal point based on eye mode */
    let focalX: number;
    if (eyeMode === "normal") {
      focalX = retinaX; // Normal: focuses exactly on retina
    } else if (eyeMode === "myopia") {
      focalX = retinaX - eyeRadiusX * 0.25; // Myopia: focuses before retina
    } else {
      focalX = retinaX + eyeRadiusX * 0.2; // Hypermetropia: focuses behind retina
    }

    /* Apply correction */
    if (showCorrection) {
      focalX = retinaX; // Correction brings focus back to retina
    }

    /* Draw rays: object → lens */
    rayPaths.forEach((ray) => {
      drawRay(ctx, ray.from, ray.to, "rgba(251, 191, 36, 0.6)", 1.5, false, false);
    });

    /* Draw rays: lens → focal point (converge) */
    const convergencePoint: Point = { x: focalX, y: centerY + (eyeMode === "normal" || showCorrection ? 8 : eyeMode === "myopia" ? 15 : -5) };
    rayPaths.forEach((ray) => {
      drawRay(ctx, ray.to, convergencePoint, "rgba(251, 191, 36, 0.8)", 1.5, false, false);
    });

    /* Focal point marker */
    ctx.save();
    const focusOnRetina = Math.abs(focalX - retinaX) < 5;
    ctx.fillStyle = focusOnRetina ? "#34d399" : "#f87171";
    ctx.shadowColor = focusOnRetina ? "#34d399" : "#f87171";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(focalX, convergencePoint.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* Corrective lens (if showing correction for defective eye) */
    if (showCorrection && eyeMode !== "normal") {
      const corrLensX = lensX - 30;
      ctx.save();
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);

      if (eyeMode === "myopia") {
        /* Concave lens */
        ctx.beginPath();
        ctx.moveTo(corrLensX, centerY - 35);
        ctx.quadraticCurveTo(corrLensX + 8, centerY, corrLensX, centerY + 35);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(corrLensX, centerY - 35);
        ctx.quadraticCurveTo(corrLensX - 8, centerY, corrLensX, centerY + 35);
        ctx.stroke();
        drawLabel(ctx, "Concave Lens", { x: corrLensX, y: centerY + 40 }, "#22d3ee", 9);
      } else {
        /* Convex lens */
        ctx.beginPath();
        ctx.moveTo(corrLensX, centerY - 35);
        ctx.quadraticCurveTo(corrLensX + 12, centerY, corrLensX, centerY + 35);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(corrLensX, centerY - 35);
        ctx.quadraticCurveTo(corrLensX - 12, centerY, corrLensX, centerY + 35);
        ctx.stroke();
        drawLabel(ctx, "Convex Lens", { x: corrLensX, y: centerY + 40 }, "#22d3ee", 9);
      }
      ctx.restore();
    }

    /* Status text */
    ctx.save();
    ctx.font = "bold 13px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";

    if (eyeMode === "normal") {
      ctx.fillStyle = "#34d399";
      ctx.fillText("✅ Normal Eye — Image on Retina", W / 2, 22);
    } else if (eyeMode === "myopia") {
      ctx.fillStyle = showCorrection ? "#22d3ee" : "#f87171";
      ctx.fillText(
        showCorrection
          ? "✅ Myopia Corrected — Concave Lens" 
          : "❌ Myopia (Nearsightedness) — Image Before Retina",
        W / 2, 22
      );
    } else {
      ctx.fillStyle = showCorrection ? "#22d3ee" : "#f87171";
      ctx.fillText(
        showCorrection
          ? "✅ Hypermetropia Corrected — Convex Lens"
          : "❌ Hypermetropia (Farsightedness) — Image Behind Retina",
        W / 2, 22
      );
    }
    ctx.restore();

    /* Ciliary muscles indicator */
    const tension = 1 - objectDist;
    ctx.save();
    ctx.fillStyle = `rgba(${Math.round(34 + tension * 200)}, ${Math.round(211 - tension * 80)}, ${Math.round(153 - tension * 50)}, 0.8)`;
    ctx.font = "11px Inter, system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Ciliary Tension: ${(tension * 100).toFixed(0)}%`, 10, H - 12);
    ctx.restore();

  }, true);

  return (
    <div className={styles.simCard} id={id}>
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>👁️</div>
        <div className={styles.simTitle}>{title}</div>
        <div className={styles.simBadge}>
          {eyeMode === "normal" ? "Normal" : eyeMode === "myopia" ? "Myopia" : "Hypermetropia"}
        </div>
      </div>

      <div className={styles.canvasWrap} ref={containerRef}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", cursor: "default" }}
        />
      </div>

      <div className={styles.controlPanel}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Object Distance</label>
          <input
            type="range"
            className={styles.slider}
            min="0"
            max="1"
            step="0.01"
            value={objectDist}
            onChange={(e) => setObjectDist(parseFloat(e.target.value))}
          />
          <div className={styles.controlValue}>
            {objectDist < 0.2 ? "Very Near (< 25cm)" :
             objectDist < 0.5 ? "Near" :
             objectDist < 0.8 ? "Medium Distance" :
             "Far Away (∞)"}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Eye Type</label>
          <div className={styles.toggleGroup}>
            <button
              className={eyeMode === "normal" ? styles.toggleBtnActive : styles.toggleBtn}
              onClick={() => { setEyeMode("normal"); setShowCorrection(false); }}
            >
              Normal
            </button>
            <button
              className={eyeMode === "myopia" ? styles.toggleBtnActive : styles.toggleBtn}
              onClick={() => setEyeMode("myopia")}
            >
              Myopia
            </button>
            <button
              className={eyeMode === "hypermetropia" ? styles.toggleBtnActive : styles.toggleBtn}
              onClick={() => setEyeMode("hypermetropia")}
            >
              Hypermetropia
            </button>
          </div>
        </div>

        {eyeMode !== "normal" && (
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Corrective Lens</label>
            <div className={styles.toggleGroup}>
              <button
                className={showCorrection ? styles.toggleBtnActive : styles.toggleBtn}
                onClick={() => setShowCorrection(true)}
              >
                Show Fix
              </button>
              <button
                className={!showCorrection ? styles.toggleBtnActive : styles.toggleBtn}
                onClick={() => setShowCorrection(false)}
              >
                No Correction
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.infoPanel}>
        <div className={styles.infoChip}>
          <span className={styles.infoChipLabel}>Near Point:</span>
          <span className={styles.infoChipValue}>25 cm</span>
        </div>
        <div className={styles.infoChip}>
          <span className={styles.infoChipLabel}>Far Point:</span>
          <span className={styles.infoChipValue}>∞</span>
        </div>
        <div className={styles.infoChip}>
          <span className={styles.infoChipLabel}>Correction:</span>
          <span className={styles.infoChipValue}>
            {eyeMode === "normal" ? "None needed" :
             eyeMode === "myopia" ? "Concave lens" : "Convex lens"}
          </span>
        </div>
      </div>

      <div className={styles.instructionText}>
        👁️ Switch between Normal, Myopic, and Hypermetropic eye to see how defects affect vision!
      </div>
    </div>
  );
};

export default HumanEyeSim;
