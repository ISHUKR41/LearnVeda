/**
 * FILE: ConcaveMirrorSim.tsx
 * LOCATION: frontend/src/components/simulations/light/mirrors/ConcaveMirrorSim.tsx
 * PURPOSE: Interactive concave mirror ray diagram simulation.
 *          User drags an object arrow along the principal axis to see
 *          how the image changes at all 6 standard positions:
 *            1. At infinity → Image at F (point, real, inverted)
 *            2. Beyond C  → Image between F and C (diminished, real, inverted)
 *            3. At C      → Image at C (same size, real, inverted)
 *            4. Between C and F → Image beyond C (magnified, real, inverted)
 *            5. At F      → Image at infinity
 *            6. Between F and P → Image behind mirror (magnified, virtual, erect)
 *
 *          Three principal rays are drawn:
 *            Ray 1: Parallel to axis → reflects through F
 *            Ray 2: Through F → reflects parallel to axis
 *            Ray 3: Through C → reflects back on itself
 *
 * INTERACTIONS: Slider to change object distance, toggle rays on/off
 * PHYSICS: Mirror formula 1/v + 1/u = 1/f, magnification m = -v/u
 * LAST UPDATED: 2026-06-08
 */

"use client";

import React, { useRef, useState, useCallback } from "react";
import {
  drawRay,
  drawLabel,
  drawObjectArrow,
  drawPrincipalAxis,
  drawGrid,
  useCanvasSetup,
  useAnimationLoop,
  mirrorFormula,
  mirrorMagnification,
  Point,
} from "../SimulationEngine";
import styles from "../SimulationEngine.module.css";

interface ConcaveMirrorSimProps {
  id?: string;
  title?: string;
}

const ConcaveMirrorSim: React.FC<ConcaveMirrorSimProps> = ({
  id = "concave-mirror-sim",
  title = "Concave Mirror — Image Formation",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Object distance as a fraction of canvas width (0 = at mirror, 1 = far left) */
  const [objDist, setObjDist] = useState(0.45); // Between C and beyond C
  const [showRay1, setShowRay1] = useState(true); // Parallel → through F
  const [showRay2, setShowRay2] = useState(true); // Through F → parallel
  const [showRay3, setShowRay3] = useState(true); // Through C → back

  const dims = useCanvasSetup(canvasRef, containerRef, 420);

  useAnimationLoop(() => {
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

    /* Layout constants */
    const axisY = H * 0.55;
    const mirrorX = W * 0.78;     // Mirror at right side
    const focalLength = W * 0.15; // F distance from mirror
    const radius = focalLength * 2; // C = 2F

    const poleX = mirrorX;
    const focusX = mirrorX - focalLength;
    const centerX = mirrorX - radius;

    /* Draw principal axis */
    drawPrincipalAxis(ctx, axisY, W, "rgba(255,255,255,0.12)");

    /* Draw concave mirror arc */
    ctx.save();
    ctx.strokeStyle = "#a5b4fc";
    ctx.lineWidth = 3;
    const mirrorHeight = H * 0.6;
    const curvature = focalLength * 0.6;
    ctx.beginPath();
    ctx.moveTo(mirrorX, axisY - mirrorHeight / 2);
    ctx.quadraticCurveTo(mirrorX - curvature, axisY, mirrorX, axisY + mirrorHeight / 2);
    ctx.stroke();

    /* Hatching behind mirror */
    ctx.strokeStyle = "rgba(165, 180, 252, 0.3)";
    ctx.lineWidth = 1;
    for (let i = 0; i < mirrorHeight; i += 10) {
      const y = axisY - mirrorHeight / 2 + i;
      const t = i / mirrorHeight;
      const xOffset = curvature * 4 * t * (1 - t);
      ctx.beginPath();
      ctx.moveTo(mirrorX - xOffset, y);
      ctx.lineTo(mirrorX - xOffset + 8, y + 6);
      ctx.stroke();
    }
    ctx.restore();

    /* Mark key points */
    const markPoint = (x: number, label: string, color: string) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, axisY, 4, 0, Math.PI * 2);
      ctx.fill();
      drawLabel(ctx, label, { x, y: axisY + 12 }, color, 12, "center");
      ctx.restore();
    };

    markPoint(poleX, "P", "#94a3b8");
    markPoint(focusX, "F", "#fbbf24");
    markPoint(centerX, "C", "#f87171");

    /* Object position */
    const objectX = mirrorX - objDist * (W * 0.7);
    const objectHeight = 50;

    /* Mirror formula calculation */
    const u = -(mirrorX - objectX); // u is negative (real object)
    const f = -focalLength;           // f is negative for concave mirror

    let v: number;
    let imgExists = true;
    let isVirtual = false;
    let positionLabel = "";

    /* Edge cases */
    if (Math.abs(u - f) < 3) {
      /* Object at F — image at infinity */
      v = -99999;
      imgExists = false;
      positionLabel = "At F → Image at ∞";
    } else {
      v = (u * f) / (u - f);
      isVirtual = v > 0;

      /* Determine position label */
      if (Math.abs(objectX - centerX) < 8) {
        positionLabel = "At C → Same size, Real, Inverted";
      } else if (objectX < centerX) {
        positionLabel = "Beyond C → Diminished, Real, Inverted";
      } else if (objectX > centerX && objectX < focusX) {
        positionLabel = "Between C & F → Magnified, Real, Inverted";
      } else if (objectX > focusX && objectX < poleX) {
        positionLabel = "Between F & P → Magnified, Virtual, Erect";
      } else {
        positionLabel = "Beyond C → Diminished, Real, Inverted";
      }
    }

    const m = imgExists ? -v / u : 0;
    const imageHeight = m * objectHeight;

    /* Image position on canvas */
    const imageX = mirrorX + v; // v positive = behind mirror (virtual)

    /* Draw object arrow */
    drawObjectArrow(ctx, { x: objectX, y: axisY }, objectHeight, "#34d399");
    drawLabel(ctx, "Object", { x: objectX, y: axisY - objectHeight - 18 }, "#34d399", 11);

    /* Draw principal rays */
    if (imgExists || Math.abs(u - f) < 3) {
      const objTop: Point = { x: objectX, y: axisY - objectHeight };

      /* Ray 1: Parallel to axis → reflects through F */
      if (showRay1) {
        /* Incident: horizontal from object top to mirror */
        const mirrorHitY1 = axisY - objectHeight;
        const mirrorHitX1 = mirrorX; // Simplified — hits mirror at same height
        drawRay(ctx, objTop, { x: mirrorHitX1, y: mirrorHitY1 }, "#fbbf24", 2);

        if (Math.abs(u - f) < 3) {
          /* At F — reflected ray goes parallel (to infinity) */
          // The reflected ray should go through F direction
          drawRay(ctx, { x: mirrorHitX1, y: mirrorHitY1 }, { x: 0, y: axisY + (mirrorHitY1 - axisY) * ((mirrorHitX1) / (mirrorHitX1 - focusX)) }, "#fbbf24", 2);
        } else if (!isVirtual) {
          /* Real image — ray goes through F and continues */
          drawRay(ctx, { x: mirrorHitX1, y: mirrorHitY1 }, { x: focusX, y: axisY }, "#fbbf24", 2);
          /* Extend to image */
          if (imageX > 0 && imageX < W) {
            drawRay(ctx, { x: focusX, y: axisY }, { x: imageX, y: axisY - imageHeight }, "#fbbf24", 1.5, true);
          }
        } else {
          /* Virtual image — ray appears to come from behind mirror */
          drawRay(ctx, { x: mirrorHitX1, y: mirrorHitY1 }, { x: focusX, y: axisY }, "#fbbf24", 2);
        }
      }

      /* Ray 2: Through center of curvature → reflects back */
      if (showRay3) {
        /* Only if C is accessible */
        if (objectX < centerX || objectX > focusX) {
          const dx = centerX - objectX;
          const dy = axisY - (axisY - objectHeight);
          const slope = dy / dx;
          const hitY = axisY - objectHeight + slope * (mirrorX - objectX);

          if (hitY > axisY - mirrorHeight / 2 && hitY < axisY + mirrorHeight / 2) {
            drawRay(ctx, objTop, { x: mirrorX, y: hitY }, "#a78bfa", 2);
            /* Reflects back along same path */
            const reflectEndX = objectX - (mirrorX - objectX) * 0.3;
            drawRay(ctx, { x: mirrorX, y: hitY }, { x: reflectEndX, y: hitY + (hitY - objTop.y) * 0.3 }, "#a78bfa", 2);
          }
        }
      }

      /* Ray 3: Through focus → reflects parallel */
      if (showRay2 && objectX < focusX) {
        const dx = focusX - objectX;
        const dy = axisY - objTop.y;
        const slope = dy / dx;
        const hitY2 = objTop.y + slope * (mirrorX - objectX);

        if (hitY2 > axisY - mirrorHeight / 2 && hitY2 < axisY + mirrorHeight / 2) {
          drawRay(ctx, objTop, { x: mirrorX, y: hitY2 }, "#fb923c", 2);
          /* Reflects parallel to axis */
          drawRay(ctx, { x: mirrorX, y: hitY2 }, { x: 0, y: hitY2 }, "#fb923c", 2);
        }
      }
    }

    /* Draw image arrow (if exists and visible) */
    if (imgExists && Math.abs(imageX) < W * 2) {
      const clampedImageX = Math.max(10, Math.min(W - 10, imageX));
      
      if (isVirtual) {
        /* Virtual image — dashed, erect */
        ctx.save();
        ctx.strokeStyle = "#f87171";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(clampedImageX, axisY);
        ctx.lineTo(clampedImageX, axisY - imageHeight);
        ctx.stroke();

        /* Dashed arrowhead */
        const arrowDir = imageHeight > 0 ? -1 : 1;
        ctx.fillStyle = "rgba(248, 113, 113, 0.6)";
        ctx.beginPath();
        ctx.moveTo(clampedImageX, axisY - imageHeight);
        ctx.lineTo(clampedImageX - 6, axisY - imageHeight + arrowDir * 8);
        ctx.lineTo(clampedImageX + 6, axisY - imageHeight + arrowDir * 8);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
        drawLabel(ctx, "Virtual Image", { x: clampedImageX, y: axisY - imageHeight - 18 }, "#f87171", 11);
      } else {
        /* Real image — solid, inverted */
        drawObjectArrow(ctx, { x: clampedImageX, y: axisY }, -imageHeight, "#f87171");
        drawLabel(ctx, "Real Image", { x: clampedImageX, y: axisY + Math.abs(imageHeight) + 8 }, "#f87171", 11);
      }
    }

    /* Position label */
    ctx.save();
    ctx.fillStyle = "rgba(226, 232, 240, 0.8)";
    ctx.font = "bold 13px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(positionLabel, W / 2, 24);
    ctx.restore();

  }, true);

  /* Computed values for info panel */
  const W = dims.width;
  const focalLength = W * 0.15;
  const mirrorX = W * 0.78;
  const objectX = mirrorX - objDist * (W * 0.7);
  const u = -(mirrorX - objectX);
  const f = -focalLength;
  let vDisplay = 0;
  let mDisplay = 0;

  if (Math.abs(u - f) > 3) {
    vDisplay = (u * f) / (u - f);
    mDisplay = -vDisplay / u;
  }

  return (
    <div className={styles.simCard} id={id}>
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>🔍</div>
        <div className={styles.simTitle}>{title}</div>
        <div className={styles.simBadge}>Drag to Explore</div>
      </div>

      <div className={styles.canvasWrap} ref={containerRef}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", cursor: "ew-resize" }}
        />
      </div>

      <div className={styles.controlPanel}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Object Distance</label>
          <input
            type="range"
            className={styles.slider}
            min="0.08"
            max="0.85"
            step="0.01"
            value={objDist}
            onChange={(e) => setObjDist(parseFloat(e.target.value))}
          />
          <div className={styles.controlValue}>
            {objDist < 0.15 ? "Between F & P" :
             objDist < 0.22 ? "Near F" :
             objDist < 0.35 ? "Between C & F" :
             objDist < 0.45 ? "Near C" :
             "Beyond C"}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Principal Rays</label>
          <div className={styles.toggleGroup}>
            <button
              className={showRay1 ? styles.toggleBtnActive : styles.toggleBtn}
              onClick={() => setShowRay1(!showRay1)}
            >
              Ray 1
            </button>
            <button
              className={showRay2 ? styles.toggleBtnActive : styles.toggleBtn}
              onClick={() => setShowRay2(!showRay2)}
            >
              Ray 2
            </button>
            <button
              className={showRay3 ? styles.toggleBtnActive : styles.toggleBtn}
              onClick={() => setShowRay3(!showRay3)}
            >
              Ray 3
            </button>
          </div>
        </div>
      </div>

      <div className={styles.infoPanel}>
        <div className={styles.infoChip}>
          <span className={styles.infoChipLabel}>u =</span>
          <span className={styles.infoChipValue}>{u.toFixed(0)} px</span>
        </div>
        <div className={styles.infoChip}>
          <span className={styles.infoChipLabel}>v =</span>
          <span className={styles.infoChipValue}>
            {Math.abs(u - f) < 3 ? "∞" : vDisplay.toFixed(0) + " px"}
          </span>
        </div>
        <div className={styles.infoChip}>
          <span className={styles.infoChipLabel}>m =</span>
          <span className={styles.infoChipValue}>
            {Math.abs(u - f) < 3 ? "∞" : mDisplay.toFixed(2)}
          </span>
        </div>
        <div className={styles.infoChip}>
          <span className={styles.infoChipLabel}>f =</span>
          <span className={styles.infoChipValue}>{f.toFixed(0)} px</span>
        </div>
      </div>

      <div className={styles.instructionText}>
        🎛️ Use the slider to move the object. Watch how the image changes at each position.
      </div>
    </div>
  );
};

export default ConcaveMirrorSim;
