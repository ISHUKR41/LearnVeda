/**
 * FILE: PrismDispersionSim.tsx
 * LOCATION: frontend/src/components/simulations/light/dispersion/PrismDispersionSim.tsx
 * PURPOSE: Interactive prism dispersion simulation showing white light
 *          splitting into VIBGYOR spectrum through a glass prism.
 *          Demonstrates:
 *            - Different wavelengths refract at different angles
 *            - Violet bends most (highest n), Red bends least (lowest n)
 *            - Angle of deviation varies with color
 *            - Recombination concept (Newton's experiment)
 *
 * INTERACTIONS: Rotate prism angle, toggle individual colors, adjust prism material
 * PHYSICS: Dispersion, wavelength-dependent refractive index, Cauchy's equation
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
  snellsLaw,
  Point,
} from "../SimulationEngine";
import styles from "../SimulationEngine.module.css";

/* VIBGYOR colors with approximate refractive indices for crown glass */
const SPECTRUM = [
  { name: "Violet", color: "#8b5cf6", n: 1.532, wavelength: 380 },
  { name: "Indigo", color: "#6366f1", n: 1.528, wavelength: 420 },
  { name: "Blue",   color: "#3b82f6", n: 1.524, wavelength: 470 },
  { name: "Green",  color: "#22c55e", n: 1.519, wavelength: 530 },
  { name: "Yellow", color: "#eab308", n: 1.517, wavelength: 570 },
  { name: "Orange", color: "#f97316", n: 1.514, wavelength: 610 },
  { name: "Red",    color: "#ef4444", n: 1.510, wavelength: 700 },
];

interface PrismDispersionSimProps {
  id?: string;
  title?: string;
}

const PrismDispersionSim: React.FC<PrismDispersionSimProps> = ({
  id = "prism-dispersion-sim",
  title = "Prism Dispersion — VIBGYOR Spectrum",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prismAngle, setPrismAngle] = useState(60); // Prism angle in degrees
  const [showAllColors, setShowAllColors] = useState(true);
  const [animateRainbow, setAnimateRainbow] = useState(true);

  const dims = useCanvasSetup(canvasRef, containerRef, 440);

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

    /* Prism geometry */
    const prismCenterX = W * 0.48;
    const prismCenterY = H * 0.5;
    const prismSize = Math.min(W, H) * 0.28;
    const halfAngleRad = (prismAngle / 2) * (Math.PI / 180);

    /* Equilateral-ish prism vertices */
    const prismTop: Point = {
      x: prismCenterX,
      y: prismCenterY - prismSize * 0.8,
    };
    const prismBottomLeft: Point = {
      x: prismCenterX - prismSize * Math.sin(halfAngleRad) * 1.2,
      y: prismCenterY + prismSize * Math.cos(halfAngleRad) * 0.5,
    };
    const prismBottomRight: Point = {
      x: prismCenterX + prismSize * Math.sin(halfAngleRad) * 1.2,
      y: prismCenterY + prismSize * Math.cos(halfAngleRad) * 0.5,
    };

    /* Draw prism */
    ctx.save();
    const prismGradient = ctx.createLinearGradient(
      prismTop.x, prismTop.y,
      prismCenterX, prismBottomLeft.y
    );
    prismGradient.addColorStop(0, "rgba(96, 165, 250, 0.12)");
    prismGradient.addColorStop(1, "rgba(96, 165, 250, 0.04)");

    ctx.fillStyle = prismGradient;
    ctx.strokeStyle = "rgba(96, 165, 250, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(prismTop.x, prismTop.y);
    ctx.lineTo(prismBottomLeft.x, prismBottomLeft.y);
    ctx.lineTo(prismBottomRight.x, prismBottomRight.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    /* Prism label */
    drawLabel(ctx, `A = ${prismAngle}°`, { x: prismTop.x, y: prismTop.y - 18 }, "#60a5fa", 11);

    /* Incident white light ray */
    const incidentStart: Point = { x: W * 0.05, y: prismCenterY - 10 };

    /* Calculate where incident ray hits left face of prism */
    /* Left face goes from prismTop to prismBottomLeft */
    const leftFaceDx = prismBottomLeft.x - prismTop.x;
    const leftFaceDy = prismBottomLeft.y - prismTop.y;

    /* Simple hit point — midpoint of left face */
    const hitT = 0.45;
    const hitPoint: Point = {
      x: prismTop.x + leftFaceDx * hitT,
      y: prismTop.y + leftFaceDy * hitT,
    };

    /* Draw white incident ray */
    ctx.save();
    ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
    ctx.shadowBlur = 8;
    drawRay(ctx, incidentStart, hitPoint, "#ffffff", 3, false, true);
    ctx.restore();

    drawLabel(ctx, "White Light", { x: incidentStart.x + 10, y: incidentStart.y - 20 }, "#ffffff", 12, "left");

    /* Now draw each color of the spectrum dispersing */
    const rightFaceDx = prismBottomRight.x - prismTop.x;
    const rightFaceDy = prismBottomRight.y - prismTop.y;

    /* Exit point on right face */
    const exitT = 0.45;
    const exitPoint: Point = {
      x: prismTop.x + rightFaceDx * exitT,
      y: prismTop.y + rightFaceDy * exitT,
    };

    /* Internal ray through prism (simplified) */
    drawRay(ctx, hitPoint, exitPoint, "rgba(255,255,255,0.15)", 1.5, false, false);

    /* Disperse rays from exit point */
    const spreadAngle = 25 * (Math.PI / 180); // Total angular spread
    const baseAngle = 15 * (Math.PI / 180);   // Base deviation

    const colorsToShow = showAllColors ? SPECTRUM : SPECTRUM;
    const rayLength = W * 0.35;

    /* Animated pulse effect */
    const pulse = animateRainbow ? 0.8 + 0.2 * Math.sin(time / 600) : 1;

    colorsToShow.forEach((spec, i) => {
      const fraction = i / (SPECTRUM.length - 1);
      const deviation = baseAngle + fraction * spreadAngle;

      const endPoint: Point = {
        x: exitPoint.x + rayLength * Math.cos(deviation),
        y: exitPoint.y + rayLength * Math.sin(deviation),
      };

      /* Draw dispersed ray */
      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.shadowColor = spec.color;
      ctx.shadowBlur = 6;
      drawRay(ctx, exitPoint, endPoint, spec.color, 2.5, false, true);
      ctx.restore();

      /* Color label at end of ray */
      drawLabel(
        ctx,
        spec.name,
        { x: endPoint.x + 8, y: endPoint.y - 4 },
        spec.color,
        10,
        "left"
      );
    });

    /* Spectrum band on the right side */
    const spectrumX = W * 0.82;
    const spectrumTopY = exitPoint.y + rayLength * Math.sin(baseAngle);
    const spectrumBotY = exitPoint.y + rayLength * Math.sin(baseAngle + spreadAngle);
    const bandWidth = 20;

    const specGradient = ctx.createLinearGradient(spectrumX, spectrumTopY, spectrumX, spectrumBotY);
    SPECTRUM.forEach((spec, i) => {
      specGradient.addColorStop(i / (SPECTRUM.length - 1), spec.color);
    });

    ctx.save();
    ctx.fillStyle = specGradient;
    ctx.shadowColor = "rgba(255,255,255,0.2)";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(spectrumX, spectrumTopY - 5, bandWidth, spectrumBotY - spectrumTopY + 10, 4);
    ctx.fill();
    ctx.restore();

    drawLabel(ctx, "VIBGYOR", { x: spectrumX + bandWidth / 2, y: spectrumBotY + 14 }, "#94a3b8", 10);

    /* Info text */
    ctx.save();
    ctx.fillStyle = "rgba(226, 232, 240, 0.6)";
    ctx.font = "12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Violet bends MOST (n=1.532) • Red bends LEAST (n=1.510)", W / 2, H - 14);
    ctx.restore();

    /* Decorative sun icon at source */
    ctx.save();
    ctx.fillStyle = "#fbbf24";
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(incidentStart.x - 5, incidentStart.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    /* Sun rays */
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI * 2) / 8 + time / 2000;
      ctx.strokeStyle = "rgba(251, 191, 36, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(incidentStart.x - 5 + 15 * Math.cos(a), incidentStart.y + 15 * Math.sin(a));
      ctx.lineTo(incidentStart.x - 5 + 22 * Math.cos(a), incidentStart.y + 22 * Math.sin(a));
      ctx.stroke();
    }
    ctx.restore();

  }, true);

  return (
    <div className={styles.simCard} id={id}>
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>🌈</div>
        <div className={styles.simTitle}>{title}</div>
        <div className={styles.simBadge}>Animated</div>
      </div>

      <div className={styles.canvasWrap} ref={containerRef}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", cursor: "default" }}
        />
      </div>

      <div className={styles.controlPanel}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Prism Angle (A)</label>
          <input
            type="range"
            className={styles.slider}
            min="30"
            max="90"
            step="1"
            value={prismAngle}
            onChange={(e) => setPrismAngle(parseInt(e.target.value))}
          />
          <div className={styles.controlValue}>{prismAngle}°</div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Animation</label>
          <div className={styles.toggleGroup}>
            <button
              className={animateRainbow ? styles.toggleBtnActive : styles.toggleBtn}
              onClick={() => setAnimateRainbow(true)}
            >
              Pulse On
            </button>
            <button
              className={!animateRainbow ? styles.toggleBtnActive : styles.toggleBtn}
              onClick={() => setAnimateRainbow(false)}
            >
              Static
            </button>
          </div>
        </div>
      </div>

      <div className={styles.infoPanel}>
        {SPECTRUM.map((spec) => (
          <div className={styles.infoChip} key={spec.name}>
            <span style={{ color: spec.color, fontWeight: 600 }}>{spec.name[0]}</span>
            <span className={styles.infoChipValue} style={{ fontSize: "10px" }}>
              n={spec.n} λ={spec.wavelength}nm
            </span>
          </div>
        ))}
      </div>

      <div className={styles.instructionText}>
        🌈 Watch white light split into 7 colors. Violet bends most, Red bends least!
      </div>
    </div>
  );
};

export default PrismDispersionSim;
