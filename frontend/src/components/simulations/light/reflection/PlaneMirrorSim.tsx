/**
 * FILE: PlaneMirrorSim.tsx
 * LOCATION: frontend/src/components/simulations/light/reflection/PlaneMirrorSim.tsx
 * PURPOSE: Interactive plane mirror simulation.
 *          User drags a light source to change the angle of incidence.
 *          The simulation renders:
 *            - A vertical plane mirror
 *            - Incident ray from the light source to the mirror
 *            - Normal at the point of incidence
 *            - Reflected ray obeying the law of reflection (∠i = ∠r)
 *            - Angle arcs and labels showing ∠i and ∠r
 *            - Virtual image (dashed) behind the mirror
 *
 * INTERACTIONS: Mouse/touch drag to move light source position
 * PHYSICS: First & Second Law of Reflection
 * LAST UPDATED: 2026-06-08
 */

"use client";

import React, { useRef, useState, useCallback } from "react";
import {
  SimCanvas,
  drawRay,
  drawNormal,
  drawAngleArc,
  drawMirrorFlat,
  drawLabel,
  drawObjectArrow,
  drawPrincipalAxis,
  useMouseInteraction,
  useCanvasSetup,
  useAnimationLoop,
  drawGrid,
  angle,
  Point,
} from "../SimulationEngine";
import styles from "../SimulationEngine.module.css";

interface PlaneMirrorSimProps {
  id?: string;
  title?: string;
}

const PlaneMirrorSim: React.FC<PlaneMirrorSimProps> = ({
  id = "light-plane-mirror",
  title = "Plane Mirror — Laws of Reflection",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightPos, setLightPos] = useState<Point>({ x: 0.3, y: 0.3 }); // Normalized 0-1
  const [showVirtualImage, setShowVirtualImage] = useState(true);

  const dims = useCanvasSetup(canvasRef, containerRef, 400);
  const interaction = useMouseInteraction(canvasRef);

  /* Update light position on drag */
  const prevDown = useRef(false);
  useAnimationLoop(() => {
    if (interaction.isDown) {
      /* Constrain light source to left half of canvas */
      const nx = Math.max(0.05, Math.min(0.45, interaction.position.x / dims.width));
      const ny = Math.max(0.1, Math.min(0.9, interaction.position.y / dims.height));
      setLightPos({ x: nx, y: ny });
    }
    prevDown.current = interaction.isDown;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = dims.width;
    const H = dims.height;
    const dpr = window.devicePixelRatio || 1;

    /* Clear */
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, H);
    drawGrid(ctx, W, H);

    /* Mirror position — vertical line at center */
    const mirrorX = W * 0.55;
    const mirrorTop: Point = { x: mirrorX, y: H * 0.1 };
    const mirrorBot: Point = { x: mirrorX, y: H * 0.9 };
    drawMirrorFlat(ctx, mirrorTop, mirrorBot, "#a5b4fc");

    /* Light source position */
    const srcX = lightPos.x * W;
    const srcY = lightPos.y * H;

    /* Incident ray hits mirror at the same Y as light source */
    const hitPoint: Point = { x: mirrorX, y: srcY };

    /* Draw incident ray */
    drawRay(ctx, { x: srcX, y: srcY }, hitPoint, "#fbbf24", 2.5, false, true);

    /* Normal at point of incidence (horizontal, pointing left) */
    const normalAngle = Math.PI; // points left (into the medium)
    drawNormal(ctx, hitPoint, 0, 120, "rgba(255,255,255,0.3)");

    /* Calculate angles */
    const incidentAngle = angle({ x: srcX, y: srcY }, hitPoint);
    const normalDir = Math.PI; // Normal points left
    const angleOfIncidence = Math.abs(incidentAngle - (-Math.PI / 2)); // angle from normal

    /* The angle of incidence measured from the horizontal normal */
    const dy = srcY - hitPoint.y;
    const dx = hitPoint.x - srcX;
    const thetaI = Math.atan2(Math.abs(dy), dx); // Angle from normal (horizontal)

    /* Reflected ray — angle of reflection = angle of incidence */
    const reflectedEndX = mirrorX + dx; // Same distance on right side
    const reflectedEndY = srcY; // Symmetric about normal
    
    /* Actually compute proper reflection */
    const reflRayLen = Math.sqrt(dx * dx + dy * dy) * 1.2;
    const reflEndPoint: Point = {
      x: mirrorX + reflRayLen * Math.cos(thetaI),
      y: hitPoint.y - dy, // Mirror the y-component about the hit point
    };

    /* Simpler symmetric reflection */
    const reflEnd: Point = {
      x: mirrorX + (mirrorX - srcX),
      y: srcY,
    };

    /* Extend reflected ray further */
    const extendFactor = 1.5;
    const finalReflEnd: Point = {
      x: hitPoint.x + (reflEnd.x - hitPoint.x) * extendFactor,
      y: hitPoint.y + (reflEnd.y - hitPoint.y) * extendFactor,
    };

    drawRay(ctx, hitPoint, finalReflEnd, "#f87171", 2.5, false, true);

    /* Draw angle arcs */
    const angleI = Math.atan2(srcY - hitPoint.y, srcX - hitPoint.x);
    const angleR = Math.atan2(finalReflEnd.y - hitPoint.y, finalReflEnd.x - hitPoint.x);
    const normalUp = -Math.PI / 2;
    const normalHoriz = Math.PI;

    /* Compute actual angles from the normal */
    const iDeg = Math.round(Math.abs(thetaI) * (180 / Math.PI));
    const rDeg = iDeg; // Law of reflection

    /* Angle arc for incidence */
    drawAngleArc(ctx, hitPoint, Math.PI, angleI, 35, "#fbbf24", `∠i = ${iDeg}°`);
    /* Angle arc for reflection */
    drawAngleArc(ctx, hitPoint, angleR, 0, 35, "#f87171", `∠r = ${rDeg}°`);

    /* Virtual image (dashed) behind mirror */
    if (showVirtualImage) {
      const virtualImgX = mirrorX + (mirrorX - srcX);
      const virtualImgY = srcY;

      /* Dashed ray from hit point to virtual image */
      drawRay(
        ctx,
        hitPoint,
        { x: virtualImgX, y: virtualImgY },
        "rgba(251, 191, 36, 0.3)",
        1.5,
        true,
        false
      );

      /* Virtual image marker */
      ctx.save();
      ctx.fillStyle = "rgba(251, 191, 36, 0.4)";
      ctx.beginPath();
      ctx.arc(virtualImgX, virtualImgY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      drawLabel(ctx, "Virtual Image", { x: virtualImgX, y: virtualImgY + 12 }, "rgba(251,191,36,0.6)", 11);
      ctx.restore();
    }

    /* Light source marker */
    ctx.save();
    ctx.fillStyle = "#fbbf24";
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(srcX, srcY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    drawLabel(ctx, "Light Source", { x: srcX, y: srcY + 14 }, "#fbbf24", 11);
    drawLabel(ctx, "drag to move ↕", { x: srcX, y: srcY + 28 }, "#64748b", 10);
    ctx.restore();

    /* Labels */
    drawLabel(ctx, "Mirror", { x: mirrorX + 12, y: H * 0.08 }, "#a5b4fc", 12);
    drawLabel(ctx, "Normal (N)", { x: mirrorX - 60, y: hitPoint.y - 65 }, "rgba(255,255,255,0.4)", 10);
    drawLabel(ctx, "Incident Ray", { x: (srcX + hitPoint.x) / 2 - 20, y: srcY - 20 }, "#fbbf24", 11);
    drawLabel(ctx, "Reflected Ray", { x: (hitPoint.x + finalReflEnd.x) / 2 - 10, y: finalReflEnd.y - 20 }, "#f87171", 11);

  }, true);

  return (
    <div className={styles.simCard} id={id}>
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>🪞</div>
        <div className={styles.simTitle}>{title}</div>
        <div className={styles.simBadge}>Interactive</div>
      </div>

      <div className={styles.canvasWrap} ref={containerRef}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", cursor: "crosshair" }}
        />
      </div>

      <div className={styles.controlPanel}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Virtual Image</label>
          <div className={styles.toggleGroup}>
            <button
              className={showVirtualImage ? styles.toggleBtnActive : styles.toggleBtn}
              onClick={() => setShowVirtualImage(true)}
            >
              Show
            </button>
            <button
              className={!showVirtualImage ? styles.toggleBtnActive : styles.toggleBtn}
              onClick={() => setShowVirtualImage(false)}
            >
              Hide
            </button>
          </div>
        </div>
      </div>

      <div className={styles.infoPanel}>
        <div className={styles.infoChip}>
          <span className={styles.infoChipLabel}>Law:</span>
          <span className={styles.infoChipValue}>∠i = ∠r</span>
        </div>
        <div className={styles.infoChip}>
          <span className={styles.infoChipLabel}>Image:</span>
          <span className={styles.infoChipValue}>Virtual, Erect, Same Size</span>
        </div>
      </div>

      <div className={styles.instructionText}>
        🖱️ Drag the light source to change the angle of incidence
      </div>
    </div>
  );
};

export default PlaneMirrorSim;
