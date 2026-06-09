/**
 * FILE: ConvexLensSim.tsx
 * LOCATION: frontend/src/components/simulations/light/lenses/ConvexLensSim.tsx
 * PURPOSE: Interactive convex lens ray diagram simulation.
 *          User drags object along principal axis to see image formation
 *          at all 6 standard positions for a convex (converging) lens:
 *            1. At infinity → Image at F₂ (point, real, inverted)
 *            2. Beyond 2F₁ → Image between F₂ and 2F₂ (diminished, real, inverted)
 *            3. At 2F₁    → Image at 2F₂ (same size, real, inverted)
 *            4. Between F₁ and 2F₁ → Image beyond 2F₂ (magnified, real, inverted)
 *            5. At F₁     → Image at infinity
 *            6. Between O and F₁ → Image same side (magnified, virtual, erect)
 *
 * INTERACTIONS: Slider for object distance, toggle individual rays
 * PHYSICS: Lens formula 1/v - 1/u = 1/f, magnification m = v/u
 * LAST UPDATED: 2026-06-08
 */

"use client";

import React, { useRef, useState } from "react";
import {
  drawRay,
  drawLabel,
  drawObjectArrow,
  drawPrincipalAxis,
  drawLens,
  drawGrid,
  useCanvasSetup,
  useAnimationLoop,
  Point,
} from "../SimulationEngine";
import styles from "../SimulationEngine.module.css";

interface ConvexLensSimProps {
  id?: string;
  title?: string;
}

const ConvexLensSim: React.FC<ConvexLensSimProps> = ({
  id = "convex-lens-sim",
  title = "Convex Lens — Image Formation",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [objDist, setObjDist] = useState(0.5); // 0 = at lens, 1 = far left
  const [showRay1, setShowRay1] = useState(true);
  const [showRay2, setShowRay2] = useState(true);
  const [showRay3, setShowRay3] = useState(true);

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

    /* Layout */
    const axisY = H * 0.55;
    const lensX = W * 0.5;
    const f = W * 0.14; // Focal length in pixels
    const lensHeight = H * 0.55;

    /* Key points */
    const f1X = lensX - f;
    const f2X = lensX + f;
    const twoF1X = lensX - 2 * f;
    const twoF2X = lensX + 2 * f;

    /* Draw principal axis */
    drawPrincipalAxis(ctx, axisY, W, "rgba(255,255,255,0.12)");

    /* Draw lens */
    drawLens(ctx, { x: lensX, y: axisY }, lensHeight, "convex", "rgba(96, 165, 250, 0.2)");

    /* Mark key points */
    const markPoint = (x: number, label: string, color: string) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, axisY, 4, 0, Math.PI * 2);
      ctx.fill();
      drawLabel(ctx, label, { x, y: axisY + 14 }, color, 11, "center");
      ctx.restore();
    };

    markPoint(lensX, "O", "#94a3b8");
    markPoint(f1X, "F₁", "#fbbf24");
    markPoint(f2X, "F₂", "#fbbf24");
    markPoint(twoF1X, "2F₁", "#fb923c");
    markPoint(twoF2X, "2F₂", "#fb923c");

    /* Object position */
    const objectX = lensX - objDist * (W * 0.45);
    const objectHeight = 45;
    const objTop: Point = { x: objectX, y: axisY - objectHeight };

    /* Lens formula: 1/v - 1/u = 1/f */
    const u = -(lensX - objectX); // u is negative (object on left)
    let v: number;
    let imgExists = true;
    let isVirtual = false;
    let positionLabel = "";

    if (Math.abs(u + f) < 3) {
      /* Object at F — image at infinity */
      v = 99999;
      imgExists = false;
      positionLabel = "At F₁ → Image at ∞";
    } else {
      /* 1/v = 1/f + 1/u = 1/f - 1/|u| */
      v = (u * f) / (u + f);
      isVirtual = v < 0;

      if (objectX < twoF1X) {
        positionLabel = "Beyond 2F₁ → Diminished, Real, Inverted";
      } else if (Math.abs(objectX - twoF1X) < 8) {
        positionLabel = "At 2F₁ → Same Size, Real, Inverted";
      } else if (objectX > twoF1X && objectX < f1X) {
        positionLabel = "Between F₁ & 2F₁ → Magnified, Real, Inverted";
      } else if (Math.abs(objectX - f1X) < 8) {
        positionLabel = "At F₁ → Image at Infinity";
      } else if (objectX > f1X && objectX < lensX) {
        positionLabel = "Between O & F₁ → Magnified, Virtual, Erect";
      }
    }

    const m = imgExists ? v / u : 0;
    const imageHeight = m * objectHeight;
    const imageX = lensX + v;

    /* Draw object */
    drawObjectArrow(ctx, { x: objectX, y: axisY }, objectHeight, "#34d399");
    drawLabel(ctx, "Object", { x: objectX, y: axisY - objectHeight - 18 }, "#34d399", 11);

    /* Draw principal rays */
    if (imgExists || Math.abs(u + f) < 3) {

      /* Ray 1: Parallel to axis → refracts through F₂ */
      if (showRay1) {
        const hitLens1: Point = { x: lensX, y: objTop.y };
        drawRay(ctx, objTop, hitLens1, "#fbbf24", 2);

        if (Math.abs(u + f) < 3) {
          /* At F — goes parallel on other side (to infinity) */
          drawRay(ctx, hitLens1, { x: W, y: objTop.y }, "#fbbf24", 2);
        } else if (!isVirtual) {
          drawRay(ctx, hitLens1, { x: Math.min(W, imageX), y: axisY - imageHeight }, "#fbbf24", 2);
        } else {
          /* Virtual — refracted ray diverges, appears to come from virtual image */
          const slope = (objTop.y - axisY) / (lensX - f2X); // Slope toward F₂
          const farX = W;
          const farY = objTop.y + slope * (farX - lensX);
          drawRay(ctx, hitLens1, { x: farX, y: farY }, "#fbbf24", 2);

          /* Dashed extension backward to virtual image */
          drawRay(ctx, hitLens1, { x: Math.max(0, imageX), y: axisY - imageHeight }, "rgba(251,191,36,0.3)", 1.5, true, false);
        }
      }

      /* Ray 2: Through optical center → goes straight (undeviated) */
      if (showRay2) {
        const slope2 = (axisY - objTop.y) / (lensX - objectX);
        const farX2 = isVirtual ? 0 : W;
        const farY2 = objTop.y + (farX2 - objectX) * (-slope2);
        const endY2 = axisY + (lensX - objectX > 0 ? slope2 * (W - lensX) : 0);

        drawRay(ctx, objTop, { x: lensX, y: axisY }, "#a78bfa", 2);
        if (!isVirtual) {
          drawRay(ctx, { x: lensX, y: axisY }, { x: W, y: axisY + slope2 * (W - lensX) }, "#a78bfa", 2);
        } else {
          drawRay(ctx, { x: lensX, y: axisY }, { x: W, y: axisY + slope2 * (W - lensX) }, "#a78bfa", 2);
        }
      }

      /* Ray 3: Through F₁ → refracts parallel to axis */
      if (showRay3 && objectX < f1X) {
        const slopeF = (axisY - objTop.y) / (f1X - objectX);
        const hitLensY3 = objTop.y + (lensX - objectX) * (-slopeF);

        if (Math.abs(hitLensY3 - axisY) < lensHeight / 2) {
          drawRay(ctx, objTop, { x: lensX, y: hitLensY3 }, "#fb923c", 2);
          /* Refracts parallel */
          drawRay(ctx, { x: lensX, y: hitLensY3 }, { x: W, y: hitLensY3 }, "#fb923c", 2);
        }
      }
    }

    /* Draw image */
    if (imgExists && Math.abs(imageX) < W * 3) {
      const clampedImgX = Math.max(10, Math.min(W - 10, imageX));

      if (isVirtual) {
        ctx.save();
        ctx.strokeStyle = "#f87171";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(clampedImgX, axisY);
        ctx.lineTo(clampedImgX, axisY - imageHeight);
        ctx.stroke();

        ctx.fillStyle = "rgba(248, 113, 113, 0.6)";
        ctx.beginPath();
        const arrowDir = imageHeight > 0 ? -1 : 1;
        ctx.moveTo(clampedImgX, axisY - imageHeight);
        ctx.lineTo(clampedImgX - 6, axisY - imageHeight + arrowDir * 8);
        ctx.lineTo(clampedImgX + 6, axisY - imageHeight + arrowDir * 8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        drawLabel(ctx, "Virtual Image", { x: clampedImgX, y: axisY - imageHeight - 18 }, "#f87171", 11);
      } else {
        drawObjectArrow(ctx, { x: clampedImgX, y: axisY }, -imageHeight, "#f87171");
        drawLabel(ctx, "Real Image", { x: clampedImgX, y: axisY + Math.abs(imageHeight) + 8 }, "#f87171", 11);
      }
    }

    /* Position label */
    ctx.save();
    ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
    ctx.font = "bold 13px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(positionLabel, W / 2, 22);
    ctx.restore();

  }, true);

  /* Info panel values */
  const W = dims.width;
  const f = W * 0.14;
  const lensX = W * 0.5;
  const objectX = lensX - objDist * (W * 0.45);
  const u = -(lensX - objectX);
  let vDisplay = 0;
  let mDisplay = 0;

  if (Math.abs(u + f) > 3) {
    vDisplay = (u * f) / (u + f);
    mDisplay = vDisplay / u;
  }

  return (
    <div className={styles.simCard} id={id}>
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>🔬</div>
        <div className={styles.simTitle}>{title}</div>
        <div className={styles.simBadge}>6 Positions</div>
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
            min="0.05"
            max="0.95"
            step="0.01"
            value={objDist}
            onChange={(e) => setObjDist(parseFloat(e.target.value))}
          />
          <div className={styles.controlValue}>
            {objDist < 0.15 ? "Between O & F₁" :
             objDist < 0.25 ? "Near F₁" :
             objDist < 0.45 ? "Between F₁ & 2F₁" :
             objDist < 0.55 ? "Near 2F₁" :
             "Beyond 2F₁"}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Principal Rays</label>
          <div className={styles.toggleGroup}>
            <button
              className={showRay1 ? styles.toggleBtnActive : styles.toggleBtn}
              onClick={() => setShowRay1(!showRay1)}
              title="Parallel → through F₂"
            >
              ∥→F
            </button>
            <button
              className={showRay2 ? styles.toggleBtnActive : styles.toggleBtn}
              onClick={() => setShowRay2(!showRay2)}
              title="Through center O"
            >
              →O
            </button>
            <button
              className={showRay3 ? styles.toggleBtnActive : styles.toggleBtn}
              onClick={() => setShowRay3(!showRay3)}
              title="Through F₁ → parallel"
            >
              F→∥
            </button>
          </div>
        </div>
      </div>

      <div className={styles.infoPanel}>
        <div className={styles.infoChip}>
          <span className={styles.infoChipLabel}>u =</span>
          <span className={styles.infoChipValue}>{u.toFixed(0)}</span>
        </div>
        <div className={styles.infoChip}>
          <span className={styles.infoChipLabel}>v =</span>
          <span className={styles.infoChipValue}>
            {Math.abs(u + f) < 3 ? "∞" : vDisplay.toFixed(0)}
          </span>
        </div>
        <div className={styles.infoChip}>
          <span className={styles.infoChipLabel}>m =</span>
          <span className={styles.infoChipValue}>
            {Math.abs(u + f) < 3 ? "∞" : mDisplay.toFixed(2)}
          </span>
        </div>
        <div className={styles.infoChip}>
          <span className={styles.infoChipLabel}>f =</span>
          <span className={styles.infoChipValue}>+{f.toFixed(0)}</span>
        </div>
      </div>

      <div className={styles.instructionText}>
        🔬 Slide the object through all 6 positions to see image changes!
      </div>
    </div>
  );
};

export default ConvexLensSim;
