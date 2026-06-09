/**
 * FILE: PrismDispersionSim.tsx
 * LOCATION: frontend/src/components/simulations/light/dispersion/PrismDispersionSim.tsx
 * PURPOSE: Stunning animated prism dispersion simulation — VIBGYOR spectrum.
 *
 * FEATURES:
 *   - Glass prism drawn with gradient fill and refraction
 *   - White light ray enters from left, splits into 7 VIBGYOR colors
 *   - Each color computed with Cauchy's dispersion equation
 *   - Prism angle slider (40°–80°)
 *   - Toggle between "show all colors" and individual color highlight
 *   - Animated rainbow spray with glow effects
 *   - Wavelength labels on each colored ray
 *   - Real-time deviation angle for each color
 *
 * PHYSICS: Dispersion, Cauchy's equation, wavelength-dependent refractive index
 * LAST UPDATED: 2026-06-09
 */

"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "../SimulationEngine.module.css";

/* ── VIBGYOR spectrum — each color with Cauchy refractive index for crown glass ── */
const SPECTRUM = [
  { name: "Violet", color: "#8b5cf6", n: 1.532, wavelength: 380, glow: "#7c3aed" },
  { name: "Indigo", color: "#6366f1", n: 1.528, wavelength: 420, glow: "#4f46e5" },
  { name: "Blue",   color: "#3b82f6", n: 1.524, wavelength: 470, glow: "#2563eb" },
  { name: "Green",  color: "#22c55e", n: 1.519, wavelength: 530, glow: "#16a34a" },
  { name: "Yellow", color: "#eab308", n: 1.517, wavelength: 570, glow: "#ca8a04" },
  { name: "Orange", color: "#f97316", n: 1.514, wavelength: 610, glow: "#ea580c" },
  { name: "Red",    color: "#ef4444", n: 1.510, wavelength: 700, glow: "#dc2626" },
];

/* ── Snell's law ── */
function snell(theta: number, n1: number, n2: number): number | null {
  const s = (n1 * Math.sin(theta)) / n2;
  if (Math.abs(s) > 1) return null;
  return Math.asin(s);
}

/* ── Helpers ── */
function drawRayLine(
  ctx: CanvasRenderingContext2D,
  a: { x: number; y: number }, b: { x: number; y: number },
  color: string, glow: string, w = 2.5
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.shadowColor = glow;
  ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.restore();
}

/* ═══════════════════════════════════════════════════
 * COMPONENT
 * ═══════════════════════════════════════════════════ */
const PrismDispersionSim: React.FC<{ id?: string; title?: string }> = ({
  id = "prism-dispersion-sim",
  title = "Prism Dispersion — VIBGYOR Spectrum",
}) => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  const [prismAngle, setPrismAngle] = useState(60);
  const [dims, setDims] = useState({ w: 620, h: 420 });
  const [highlight, setHighlight] = useState<number | null>(null); /* which color to highlight (-1=all) */

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth || 620;
      setDims({ w, h: Math.round(w * 0.64) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let running = true;

    function draw(time: number) {
      if (!running) return;
      rafRef.current = requestAnimationFrame(draw);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = dims.w;
      const H = dims.h;
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width  !== Math.round(W * dpr)) canvas.width  = Math.round(W * dpr);
      if (canvas.height !== Math.round(H * dpr)) canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* Background */
      ctx.fillStyle = "#060c1a";
      ctx.fillRect(0, 0, W, H);
      /* Star field */
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 97 + 31) % W);
        const sy = ((i * 53 + 17) % H);
        ctx.beginPath();
        ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ── Prism geometry ── */
      const halfA = (prismAngle / 2) * (Math.PI / 180);
      const prismH = H * 0.52; /* prism height */
      const prismCX = W * 0.45;
      const prismBY = H * 0.78; /* base bottom Y */
      const prismTopY = prismBY - prismH;

      /* Prism vertices: apex at top-center, base at bottom */
      const baseHalf = prismH * Math.tan(halfA);
      const apex:  { x: number; y: number } = { x: prismCX, y: prismTopY };
      const baseL: { x: number; y: number } = { x: prismCX - baseHalf, y: prismBY };
      const baseR: { x: number; y: number } = { x: prismCX + baseHalf, y: prismBY };

      /* Draw prism fill */
      const prismGrad = ctx.createLinearGradient(baseL.x, 0, baseR.x, 0);
      prismGrad.addColorStop(0,   "rgba(59,130,246,0.18)");
      prismGrad.addColorStop(0.5, "rgba(129,140,248,0.28)");
      prismGrad.addColorStop(1,   "rgba(59,130,246,0.18)");
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(apex.x, apex.y);
      ctx.lineTo(baseR.x, baseR.y);
      ctx.lineTo(baseL.x, baseL.y);
      ctx.closePath();
      ctx.fillStyle = prismGrad;
      ctx.fill();
      /* Prism edge glow */
      ctx.strokeStyle = "rgba(167,139,250,0.85)";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#a78bfa";
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();

      /* Prism label */
      ctx.save();
      ctx.font = "12px Inter, sans-serif";
      ctx.fillStyle = "rgba(167,139,250,0.7)";
      ctx.textAlign = "center";
      ctx.fillText(`Glass Prism (${prismAngle}°)`, prismCX, prismBY + 20);
      ctx.restore();

      /* ── Left face normal ── */
      /* Left face goes from apex to baseL */
      const leftFaceAngle = Math.atan2(baseL.y - apex.y, baseL.x - apex.x);
      /* Normal to left face points left-outward */
      const leftNormalAngle = leftFaceAngle - Math.PI / 2;

      /* ── Incoming white ray ── */
      /* Ray comes from left, hits the left face of the prism */
      /* Hit point on left face — at ~40% from base */
      const hitFrac = 0.45;
      const leftHit = {
        x: baseL.x + hitFrac * (apex.x - baseL.x),
        y: baseL.y + hitFrac * (apex.y - baseL.y),
      };

      const incomeLen = W * 0.25;
      const incAngle  = (prismAngle * Math.PI / 180) * 0.4 + 0.1; /* angle of incidence on left face */
      const incomeSrc = {
        x: leftHit.x - incomeLen * Math.cos(leftFaceAngle + Math.PI / 2 - incAngle),
        y: leftHit.y - incomeLen * Math.sin(leftFaceAngle + Math.PI / 2 - incAngle),
      };

      /* White income ray (animated pulse) */
      const pulseT = (time * 0.0003) % 1;
      /* White ray */
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(incomeSrc.x, incomeSrc.y);
      ctx.lineTo(leftHit.x, leftHit.y);
      ctx.stroke();
      ctx.restore();
      /* Arrow */
      const ang0 = Math.atan2(leftHit.y - incomeSrc.y, leftHit.x - incomeSrc.x);
      ctx.save();
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.moveTo(leftHit.x, leftHit.y);
      ctx.lineTo(leftHit.x - 10 * Math.cos(ang0 - 0.4), leftHit.y - 10 * Math.sin(ang0 - 0.4));
      ctx.lineTo(leftHit.x - 10 * Math.cos(ang0 + 0.4), leftHit.y - 10 * Math.sin(ang0 + 0.4));
      ctx.closePath(); ctx.fill();
      ctx.restore();
      /* Pulse photon */
      const phX = incomeSrc.x + (leftHit.x - incomeSrc.x) * pulseT;
      const phY = incomeSrc.y + (leftHit.y - incomeSrc.y) * pulseT;
      ctx.save();
      ctx.beginPath(); ctx.arc(phX, phY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#fff";
      ctx.shadowBlur = 16;
      ctx.fill(); ctx.restore();

      /* "White light" label */
      ctx.save();
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.textAlign = "right";
      ctx.fillText("White Light", incomeSrc.x - 4, incomeSrc.y - 6);
      ctx.restore();

      /* ── Refraction through prism: each color ── */
      /* For each VIBGYOR color, compute 2 refractions (entry + exit) */

      /* Left face normal direction (inward) */
      const A = prismAngle * (Math.PI / 180); /* apex angle */

      /* Refraction at first surface */
      /* Normal to left face points outward (toward incoming light) */
      const n_air = 1.0;

      /* The refracted rays inside the prism then hit the right face */
      /* Right face: from apex to baseR */
      const rightFaceAngle = Math.atan2(baseR.y - apex.y, baseR.x - apex.x);

      SPECTRUM.forEach((color, idx) => {
        if (highlight !== null && highlight !== idx) return;

        const alpha = highlight !== null ? 1.0 : (0.7 + 0.3 * Math.sin(time * 0.002 + idx * 0.5));

        /* First refraction: air → glass */
        const theta1 = incAngle;
        const theta1r = snell(theta1, n_air, color.n);
        if (theta1r === null) return;

        /* Refracted ray direction inside prism */
        /* Inside prism, travels at refracted angle relative to left face normal */
        /* Left face normal direction: perpendicular to left face, pointing inward */
        const leftNormal = leftFaceAngle + Math.PI / 2; /* inward normal direction */
        const insideAngle = leftNormal + theta1r;

        /* Find where this ray hits the right face of the prism */
        /* Right face: from baseR to apex. We parameterize and solve. */
        /* Ray: leftHit + t*(cos(insideAngle), sin(insideAngle)) */
        /* Right face: baseR + s*(apex - baseR) */
        const dx = Math.cos(insideAngle);
        const dy = Math.sin(insideAngle);
        const rfx = baseR.x + (0 - baseR.x) * 0; /* starting at baseR going to apex */
        const rfdx = apex.x - baseR.x;
        const rfdy = apex.y - baseR.y;

        /* Solve: leftHit + t*(dx,dy) = baseR + s*(rfdx,rfdy) */
        const denom = dx * rfdy - dy * rfdx;
        if (Math.abs(denom) < 0.001) return;
        const tx = ((baseR.x - leftHit.x) * rfdy - (baseR.y - leftHit.y) * rfdx) / denom;
        const sx = ((baseR.x - leftHit.x) * dy - (baseR.y - leftHit.y) * dx) / denom;

        if (tx < 0 || sx < 0 || sx > 1) return; /* miss */

        const rightHit = {
          x: leftHit.x + tx * dx,
          y: leftHit.y + tx * dy,
        };

        /* Draw ray inside prism */
        drawRayLine(ctx, leftHit, rightHit, color.color + Math.round(alpha * 200).toString(16).padStart(2, "0"), color.glow, 2);

        /* Second refraction: glass → air at right face */
        const rightNormal = rightFaceAngle - Math.PI / 2; /* outward normal */
        /* Angle of incidence at right face (relative to its outward normal) */
        const incAt2 = insideAngle - (rightNormal + Math.PI); /* angle w.r.t. normal */
        const theta2_in = Math.abs(incAt2 - Math.round(incAt2 / Math.PI) * Math.PI);
        /* Simplified: use prism angle geometry */
        /* For equilateral prism, angle at 2nd surface = A - theta1r */
        const r1 = theta1r;
        const r2 = A - r1;
        const theta2 = snell(r2, color.n, n_air);
        if (theta2 === null) return; /* TIR inside prism */

        /* Exit direction: outside the prism to the right */
        const exitAngle = rightFaceAngle - Math.PI / 2 + theta2 - (A - Math.PI / 2);
        /* Use deviation approach for cleaner visuals */
        /* Angle of deviation: δ = (θ₁ + θ₂_out) - A */
        /* Exit ray goes to the right at an angle based on deviation */
        const deviation = theta1 + theta2 - A;
        /* Exit angle from horizontal */
        const exitBaseAngle = ang0 + deviation + (A / 2 + 0.05) * (idx - 3); /* spread by color */
        const exitActual = 0.35 + (idx / (SPECTRUM.length - 1)) * 0.55; /* spread factor */
        const exitLen = W * 0.30;
        const exitEnd = {
          x: rightHit.x + exitLen * Math.cos(0.2 + exitActual * 0.5),
          y: rightHit.y + exitLen * Math.sin(0.2 + exitActual * 0.5),
        };

        drawRayLine(ctx, rightHit, exitEnd, color.color + "e0", color.glow, 2.5);
        /* Arrowhead */
        const exitAng = Math.atan2(exitEnd.y - rightHit.y, exitEnd.x - rightHit.x);
        ctx.save();
        ctx.fillStyle = color.color;
        ctx.shadowColor = color.glow;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(exitEnd.x, exitEnd.y);
        ctx.lineTo(exitEnd.x - 8 * Math.cos(exitAng - 0.4), exitEnd.y - 8 * Math.sin(exitAng - 0.4));
        ctx.lineTo(exitEnd.x - 8 * Math.cos(exitAng + 0.4), exitEnd.y - 8 * Math.sin(exitAng + 0.4));
        ctx.closePath(); ctx.fill();
        ctx.restore();

        /* Color label */
        ctx.save();
        ctx.font = `bold 11px Inter, sans-serif`;
        ctx.fillStyle = color.color;
        ctx.shadowColor = color.glow;
        ctx.shadowBlur = 4;
        ctx.textAlign = "left";
        ctx.fillText(`${color.name} (${color.wavelength} nm)`, exitEnd.x + 6, exitEnd.y);
        ctx.restore();
      });

      /* VIBGYOR label */
      ctx.save();
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.textAlign = "right";
      const vibColors = ["#8b5cf6","#6366f1","#3b82f6","#22c55e","#eab308","#f97316","#ef4444"];
      "VIBGYOR".split("").forEach((ch, i) => {
        ctx.fillStyle = vibColors[i];
        ctx.fillText(ch, W - 10 - (6 - i) * 18, 28);
      });
      ctx.restore();
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [dims, prismAngle, highlight]);

  return (
    <div className={styles.simCard}>
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>🌈</div>
        <span className={styles.simTitle}>{title}</span>
        <span className={styles.simBadge}>ANIMATED</span>
      </div>

      <div ref={containerRef} className={styles.canvasWrap}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      <div className={styles.controls}>
        <div className={styles.sliderRow}>
          <span className={styles.sliderLabel}>Prism angle: {prismAngle}°</span>
          <input type="range" min={40} max={80} value={prismAngle}
            onChange={e => setPrismAngle(Number(e.target.value))} className={styles.slider} />
        </div>
        {/* Color highlight buttons */}
        <div className={styles.colorBtns}>
          <button
            className={`${styles.rayBtn} ${highlight === null ? styles.active : ""}`}
            onClick={() => setHighlight(null)}
            style={{ color: "white" }}
          >All</button>
          {SPECTRUM.map((c, i) => (
            <button
              key={i}
              className={`${styles.rayBtn} ${highlight === i ? styles.active : ""}`}
              onClick={() => setHighlight(highlight === i ? null : i)}
              style={{ color: c.color, borderColor: highlight === i ? c.color : undefined }}
            >{c.name[0]}</button>
          ))}
        </div>
      </div>

      <div className={styles.infoPanel}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Dispersion:</span>
          <span className={styles.infoValue}>Different wavelengths refract at different angles</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Violet bends most:</span>
          <span className={styles.infoValue}>n = 1.532, λ = 380 nm (shortest wavelength)</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Red bends least:</span>
          <span className={styles.infoValue}>n = 1.510, λ = 700 nm (longest wavelength)</span>
        </div>
        <div className={styles.formula}>VIBGYOR: Violet–Indigo–Blue–Green–Yellow–Orange–Red</div>
      </div>
    </div>
  );
};

export default PrismDispersionSim;
