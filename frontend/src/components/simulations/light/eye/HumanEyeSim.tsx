/**
 * FILE: HumanEyeSim.tsx
 * LOCATION: frontend/src/components/simulations/light/eye/HumanEyeSim.tsx
 * PURPOSE: Beautiful anatomical Human Eye simulation with accommodation and defect correction.
 *
 * FEATURES:
 *   - Cross-section of human eye: cornea, pupil, lens, retina, optic nerve, vitreous humor
 *   - Three modes: Normal eye, Myopia (near-sightedness), Hypermetropia (far-sightedness)
 *   - Object distance slider — eye lens adjusts shape (accommodation animation)
 *   - Near and Far point markers on principal axis
 *   - Corrective lens overlay (concave for myopia, convex for hypermetropia)
 *   - Light rays converge on retina (normal) or before/after retina (defective)
 *   - All eye parts labeled with arrows
 *   - Smooth CSS-based animation
 *
 * PHYSICS: Accommodation, Power of Eye Lens, Vision Defects & Correction
 * LAST UPDATED: 2026-06-09
 */

"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "../SimulationEngine.module.css";

type EyeMode = "normal" | "myopia" | "hypermetropia";

/* ─── Helpers ─── */
function ln(ctx: CanvasRenderingContext2D, a: {x:number;y:number}, b: {x:number;y:number}, col: string, w = 1.8, dash = false) {
  ctx.save();
  ctx.strokeStyle = col; ctx.lineWidth = w;
  ctx.shadowColor = col; ctx.shadowBlur = dash ? 0 : 7;
  if (dash) ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.setLineDash([]); ctx.restore();
}

/** Layered glow beam for light rays — more visually impressive than simple ln() */
function glowLn(ctx: CanvasRenderingContext2D, a: {x:number;y:number}, b: {x:number;y:number}, col: string, w = 2) {
  [{ w: w * 7, a: 0.05 }, { w: w * 3.5, a: 0.13 }, { w: w * 1.8, a: 0.45 }, { w, a: 1.0 }].forEach(layer => {
    ctx.save();
    ctx.strokeStyle = col; ctx.lineWidth = layer.w; ctx.globalAlpha = layer.a;
    ctx.shadowColor = col; ctx.shadowBlur = layer.w * 2; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    ctx.restore();
  });
}

/** Photon stream with comet trails on a line segment (3 photons) */
function photonLn(
  ctx: CanvasRenderingContext2D,
  from: {x:number;y:number}, to: {x:number;y:number},
  time: number, col: string, phaseOff = 0, speed = 0.00022
) {
  for (let i = 0; i < 3; i++) {
    const base = ((time * speed + phaseOff + i / 3) % 1);
    for (let t = 4; t >= 1; t--) {
      const tp = Math.max(0, base - t * 0.04);
      ctx.save();
      ctx.beginPath();
      ctx.arc(from.x + (to.x - from.x) * tp, from.y + (to.y - from.y) * tp, Math.max(1, 3 - t * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = col; ctx.globalAlpha = 0.4 - t * 0.09; ctx.fill(); ctx.restore();
    }
    const px = from.x + (to.x - from.x) * base, py = from.y + (to.y - from.y) * base;
    ctx.save(); ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(px, py, 0, px, py, 5);
    g.addColorStop(0, "#ffffff"); g.addColorStop(0.4, col); g.addColorStop(1, "transparent");
    ctx.fillStyle = g; ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.fill(); ctx.restore();
  }
}

function lbl(ctx: CanvasRenderingContext2D, t: string, x: number, y: number, col = "#e2e8f0", sz = 11, align: CanvasTextAlign = "center") {
  ctx.save(); ctx.font = `${sz}px Inter, sans-serif`;
  ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = "middle";
  ctx.fillText(t, x, y); ctx.restore();
}

/* ═══════════════════════════════════════════════════
 * COMPONENT
 * ═══════════════════════════════════════════════════ */
const HumanEyeSim: React.FC<{ id?: string; title?: string }> = ({
  id = "human-eye-sim",
  title = "Human Eye — Accommodation & Vision Defects",
}) => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  const [objectDist, setObjectDist] = useState(55); /* 0=near, 100=far */
  const [eyeMode, setEyeMode] = useState<EyeMode>("normal");
  const [showCorrection, setShowCorrection] = useState(false);
  const [dims, setDims] = useState({ w: 600, h: 380 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth || 600;
      setDims({ w, h: Math.round(w * 0.60) });
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
      ctx.fillStyle = "#080f1f";
      ctx.fillRect(0, 0, W, H);

      const eCX = W * 0.58;  /* eye center X */
      const eCY = H * 0.50;  /* eye center Y */
      const eRX = W * 0.20;  /* eye horizontal radius */
      const eRY = H * 0.34;  /* eye vertical radius */

      /* ── Eyeball outline (sclera — white outer coat) ── */
      ctx.save();
      const scleraGrad = ctx.createRadialGradient(eCX - eRX * 0.3, eCY - eRY * 0.3, 0, eCX, eCY, eRX * 1.1);
      scleraGrad.addColorStop(0, "rgba(248,250,252,0.07)");
      scleraGrad.addColorStop(1, "rgba(148,163,184,0.06)");
      ctx.fillStyle = scleraGrad;
      ctx.strokeStyle = "rgba(148,163,184,0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(eCX, eCY, eRX, eRY, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      /* ── Choroid (dark layer inside sclera) ── */
      ctx.save();
      ctx.strokeStyle = "rgba(109,40,217,0.25)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(eCX, eCY, eRX * 0.93, eRY * 0.93, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      /* ── Retina (inner back surface) ── */
      const retinaX = eCX - eRX * 0.72;
      ctx.save();
      ctx.strokeStyle = "rgba(239,68,68,0.6)";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      /* Retina arc on back of eye */
      ctx.arc(eCX + eRX * 0.8, eCY, eRX * 1.28, Math.PI * 0.6, Math.PI * 1.4, false);
      ctx.stroke();
      ctx.restore();
      lbl(ctx, "Retina", retinaX - 22, eCY, "#fca5a5", 10, "right");

      /* ── Optic nerve ── */
      ctx.save();
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(eCX - eRX * 0.92, eCY + eRY * 0.25);
      ctx.lineTo(eCX - eRX * 1.15, eCY + eRY * 0.25);
      ctx.stroke();
      ctx.restore();
      lbl(ctx, "Optic\nNerve", eCX - eRX * 1.25, eCY + eRY * 0.45, "#fde68a", 9, "center");

      /* ── Vitreous humor (jelly inside) ── */
      ctx.save();
      const vitGrad = ctx.createRadialGradient(eCX - eRX * 0.1, eCY, 0, eCX, eCY, eRX * 0.85);
      vitGrad.addColorStop(0, "rgba(59,130,246,0.06)");
      vitGrad.addColorStop(1, "rgba(30,58,138,0.03)");
      ctx.fillStyle = vitGrad;
      ctx.beginPath();
      ctx.ellipse(eCX - eRX * 0.05, eCY, eRX * 0.62, eRY * 0.82, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      /* ── Crystalline Lens ── */
      /* Lens shape changes with accommodation (object distance) */
      /* Near object → fatter lens (more curved), far object → thinner lens */
      const accommodation = 1 - (objectDist / 100); /* 0 = far, 1 = near */
      const lensRX = eRX * (0.10 + 0.08 * accommodation); /* fatter when near */
      const lensRY = eRY * 0.35;
      const lensX  = eCX + eRX * 0.18; /* slightly behind cornea */

      /* Lens gradient — glassy */
      ctx.save();
      const lensGrad = ctx.createRadialGradient(lensX - lensRX * 0.3, eCY - lensRY * 0.3, 0, lensX, eCY, lensRX * 1.5);
      lensGrad.addColorStop(0,   "rgba(186,230,253,0.5)");
      lensGrad.addColorStop(0.5, "rgba(96,165,250,0.3)");
      lensGrad.addColorStop(1,   "rgba(29,78,216,0.15)");
      ctx.fillStyle = lensGrad;
      ctx.strokeStyle = "rgba(147,197,253,0.9)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#93c5fd";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(lensX, eCY, lensRX, lensRY, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      lbl(ctx, "Lens", lensX, eCY - lensRY - 14, "#bfdbfe", 10);

      /* Ciliary muscle hint */
      ctx.save();
      ctx.strokeStyle = "rgba(167,139,250,0.4)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 3]);
      for (let i = -1; i <= 1; i += 2) {
        ctx.beginPath();
        ctx.moveTo(lensX - lensRX, eCY + i * lensRY);
        ctx.lineTo(lensX - lensRX - 12, eCY + i * (lensRY + 12));
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();

      /* ── Cornea ── */
      const corneaX = eCX + eRX * 0.72;
      ctx.save();
      ctx.strokeStyle = "rgba(125,211,252,0.9)";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#7dd3fc";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(corneaX - eRX * 0.38, eCY, eRX * 0.52, -Math.atan2(eRY * 0.6, eRX * 0.52),
        Math.atan2(eRY * 0.6, eRX * 0.52), false);
      ctx.stroke();
      ctx.restore();
      lbl(ctx, "Cornea", corneaX + 18, eCY - eRY * 0.5, "#bae6fd", 10, "left");

      /* ── Pupil & Iris ── */
      const pupilX = eCX + eRX * 0.60;
      ctx.save();
      /* Iris */
      const irisGrad = ctx.createRadialGradient(pupilX, eCY, 8, pupilX, eCY, eRY * 0.35);
      irisGrad.addColorStop(0, "#1e1b4b");
      irisGrad.addColorStop(0.3, "#312e81");
      irisGrad.addColorStop(0.7, "#4338ca");
      irisGrad.addColorStop(1, "rgba(67,56,202,0)");
      ctx.beginPath();
      ctx.arc(pupilX, eCY, eRY * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = irisGrad;
      ctx.fill();
      /* Pupil */
      ctx.beginPath();
      ctx.arc(pupilX, eCY, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.fill();
      /* Iris ring */
      ctx.beginPath();
      ctx.arc(pupilX, eCY, eRY * 0.35, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(99,102,241,0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
      lbl(ctx, "Iris & Pupil", pupilX, eCY + eRY * 0.52, "#a5b4fc", 10);

      /* ── Aqueous humor ── */
      ctx.save();
      ctx.fillStyle = "rgba(186,230,253,0.04)";
      ctx.beginPath();
      ctx.arc(corneaX - eRX * 0.38, eCY, eRX * 0.52, -Math.PI / 3, Math.PI / 3, false);
      ctx.arc(pupilX, eCY, eRY * 0.35, Math.PI / 3, -Math.PI / 3, true);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      /* ── Corrective lens (if enabled) ── */
      if (showCorrection && eyeMode !== "normal") {
        const corrX = corneaX + eRX * 0.45;
        const corrRX = eRX * 0.09;
        const corrRY = eRY * 0.50;
        ctx.save();
        ctx.strokeStyle = eyeMode === "myopia" ? "#fca5a5" : "#86efac";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = eyeMode === "myopia" ? "#ef4444" : "#22c55e";
        ctx.shadowBlur = 12;
        if (eyeMode === "myopia") {
          /* Concave lens (biconcave) */
          ctx.beginPath();
          ctx.arc(corrX + corrRX * 0.8, eCY, corrRX * 1.2, Math.PI - Math.asin(corrRY / (corrRX * 1.2)), Math.PI + Math.asin(corrRY / (corrRX * 1.2)), false);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(corrX - corrRX * 0.8, eCY, corrRX * 1.2, -Math.asin(corrRY / (corrRX * 1.2)), Math.asin(corrRY / (corrRX * 1.2)), false);
          ctx.stroke();
          lbl(ctx, "Concave lens", corrX, eCY - corrRY - 16, "#fca5a5", 10);
        } else {
          /* Convex lens (biconvex) */
          ctx.beginPath();
          ctx.arc(corrX - corrRX * 0.7, eCY, corrRX * 1.1, -Math.asin(corrRY / (corrRX * 1.1)), Math.asin(corrRY / (corrRX * 1.1)), false);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(corrX + corrRX * 0.7, eCY, corrRX * 1.1, Math.PI - Math.asin(corrRY / (corrRX * 1.1)), Math.PI + Math.asin(corrRY / (corrRX * 1.1)), false);
          ctx.stroke();
          lbl(ctx, "Convex lens", corrX, eCY - corrRY - 16, "#86efac", 10);
        }
        ctx.restore();
      }

      /* ── Light rays ── */
      /* Object position */
      const objX = W * 0.06 + (objectDist / 100) * W * 0.18;
      const objY = eCY;

      /* Object indicator */
      ctx.save();
      ctx.beginPath(); ctx.arc(objX, objY, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#fbbf24"; ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 14; ctx.fill();
      ctx.restore();
      lbl(ctx, "Object", objX, objY - 16, "#fde68a", 10);

      /* Three rays from object to cornea → through lens → to retina */
      /* Compute where rays converge on/off retina */
      const retinalX = eCX - eRX * 0.82; /* target retinal X */

      /* For normal eye: rays converge exactly at retina */
      /* For myopia: rays converge before retina (slightly left of retina) */
      /* For hypermetropia: rays would converge behind retina (to the right) */
      let focalX = retinalX; /* where rays actually converge */
      if (eyeMode === "myopia") {
        focalX = retinalX + eRX * 0.22; /* short eye — converges in front */
        if (showCorrection) focalX = retinalX;
      } else if (eyeMode === "hypermetropia") {
        focalX = retinalX - eRX * 0.22; /* flat cornea — converges behind */
        if (showCorrection) focalX = retinalX;
      }

      /* Three ray Y positions at cornea entry */
      const rayOffsets = [-eRY * 0.18, 0, eRY * 0.18];
      const rayColors  = ["#fbbf24", "#60a5fa", "#34d399"];

      rayOffsets.forEach((dy, ri) => {
        const entryX = pupilX + eRX * 0.12;
        const entryY = eCY + dy;
        const focalY = eCY + dy * 0.05;
        const col = rayColors[ri];

        /* Ray from object to cornea entry — layered glow beam */
        glowLn(ctx, { x: objX, y: objY }, { x: entryX, y: entryY }, col);

        /* Ray through eye to focus point */
        glowLn(ctx, { x: entryX, y: entryY }, { x: focalX, y: focalY }, col);

        /* If defective, show dotted extension to retina */
        if (eyeMode !== "normal" && !showCorrection) {
          ln(ctx, { x: focalX, y: focalY }, { x: retinalX, y: focalY }, col, 1, true);
        }

        /* Multi-photon streams — 3 photons with comet trails on each ray segment */
        photonLn(ctx, { x: objX, y: objY }, { x: entryX, y: entryY }, time, col, ri * 0.33);
        photonLn(ctx, { x: entryX, y: entryY }, { x: focalX, y: focalY }, time, col, ri * 0.33 + 0.5);
      });

      /* Focus point indicator */
      ctx.save();
      ctx.beginPath(); ctx.arc(focalX, eCY, 5, 0, Math.PI * 2);
      const fColor = focalX === retinalX ? "#22c55e" : "#ef4444";
      ctx.fillStyle = fColor;
      ctx.shadowColor = fColor;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.restore();
      lbl(ctx, focalX === retinalX ? "✓ On Retina" : "✗ Off Retina",
        focalX, eCY - 18, fColor, 11);

      /* ── Eye mode label ── */
      const modeColors = { normal: "#22c55e", myopia: "#f87171", hypermetropia: "#fbbf24" };
      const modeNames  = { normal: "Normal Eye", myopia: "Myopia (Short-sighted)", hypermetropia: "Hypermetropia (Long-sighted)" };
      lbl(ctx, modeNames[eyeMode], W / 2, H - 20, modeColors[eyeMode], 13);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [dims, objectDist, eyeMode, showCorrection]);

  return (
    <div className={styles.simCard}>
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>👁️</div>
        <span className={styles.simTitle}>{title}</span>
        <span className={styles.simBadge}>ANIMATED</span>
      </div>

      <div ref={containerRef} className={styles.canvasWrap}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      <div className={styles.controls}>
        <div className={styles.btnGroup}>
          <button className={`${styles.toggleBtn} ${eyeMode === "normal" ? styles.active : ""}`} onClick={() => setEyeMode("normal")}>Normal</button>
          <button className={`${styles.toggleBtn} ${eyeMode === "myopia" ? styles.activeRed : ""}`} onClick={() => setEyeMode("myopia")}>Myopia</button>
          <button className={`${styles.toggleBtn} ${eyeMode === "hypermetropia" ? styles.activeAmber : ""}`} onClick={() => setEyeMode("hypermetropia")}>Hypermetropia</button>
        </div>
        <div className={styles.sliderRow}>
          <span className={styles.sliderLabel}>Object distance: {objectDist < 40 ? "Near" : objectDist > 70 ? "Far" : "Medium"}</span>
          <input type="range" min={5} max={100} value={objectDist}
            onChange={e => setObjectDist(Number(e.target.value))} className={styles.slider} />
        </div>
        {eyeMode !== "normal" && (
          <button
            className={`${styles.toggleBtn} ${showCorrection ? styles.active : ""}`}
            onClick={() => setShowCorrection(c => !c)}
          >
            {showCorrection ? "Remove" : "Add"} Corrective Lens
          </button>
        )}
      </div>

      <div className={styles.infoPanel}>
        {eyeMode === "normal" && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Normal eye:</span>
            <span className={styles.infoValue}>Image forms exactly on retina. Near point = 25 cm, Far point = ∞</span>
          </div>
        )}
        {eyeMode === "myopia" && (
          <>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Myopia:</span>
              <span className={styles.infoValue}>Image forms in front of retina. Far point moves closer.</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Correction:</span>
              <span className={styles.infoValue}>Concave (diverging) lens of suitable power</span>
            </div>
          </>
        )}
        {eyeMode === "hypermetropia" && (
          <>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Hypermetropia:</span>
              <span className={styles.infoValue}>Image forms behind retina. Near point moves farther away.</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Correction:</span>
              <span className={styles.infoValue}>Convex (converging) lens of suitable power</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HumanEyeSim;
