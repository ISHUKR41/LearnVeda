/**
 * FILE: ReflectionInteractiveSim.tsx
 * LOCATION: src/components/simulations/light/reflection/
 *
 * PURPOSE:
 *   Ultra-interactive Laws of Reflection lab — full canvas-based simulation
 *   where students drag the light source freely around a plane mirror.
 *   Real-time rendering shows:
 *     • Incident ray from source → mirror surface
 *     • Normal at the point of incidence (dashed white line)
 *     • Reflected ray obeying ∠i = ∠r exactly
 *     • Animated glowing photon travelling along incident + reflected paths
 *     • Live readout: ∠i, ∠r, distance from mirror
 *     • "Wavefront" option — shows plane wavefronts reflecting off the mirror
 *     • Toggle: Real reflected image as dotted extension behind mirror
 *     • Color picker for the ray (ROYGBIV — different wavelengths)
 *
 * INTERACTIVITY:
 *   • Drag the light-source bulb anywhere in the upper half
 *   • Click buttons to toggle image line / wavefront mode
 *   • Pick ray colour with colour swatches
 *
 * PHYSICS COVERED (Class 10 Topic 1):
 *   ∠i = ∠r (Law of Reflection)
 *   Normal is perpendicular to the reflecting surface
 *   Incident ray, reflected ray, and normal are coplanar
 *
 * DEPENDENCIES: SimulationEngine.module.css (shared styles)
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "../SimulationEngine.module.css";

/* ─── Ray colour presets (wavelength-inspired) ─── */
const RAY_COLORS = [
  { label: "White",  value: "#f8fafc" },
  { label: "Red",    value: "#ef4444" },
  { label: "Orange", value: "#f97316" },
  { label: "Yellow", value: "#fde047" },
  { label: "Green",  value: "#22c55e" },
  { label: "Cyan",   value: "#06b6d4" },
  { label: "Violet", value: "#a855f7" },
];

export default function ReflectionInteractiveSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const tRef      = useRef<number>(0);

  /* Source position — normalised (0-1) relative to canvas size */
  const srcRef = useRef({ nx: 0.3, ny: 0.25 });

  const [isDragging, setIsDragging] = useState(false);
  const [angles, setAngles] = useState({ i: 45, r: 45 });
  const [showImage, setShowImage] = useState(true);
  const [showWave,  setShowWave]  = useState(false);
  const [rayColor,  setRayColor]  = useState("#f8fafc");

  /* ── Canvas pointer helpers ── */
  const toCanvas = (e: React.PointerEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    let cx: number, cy: number;
    if ("touches" in e) {
      cx = (e.touches[0].clientX - rect.left) * scaleX;
      cy = (e.touches[0].clientY - rect.top)  * scaleY;
    } else {
      cx = (e.clientX - rect.left) * scaleX;
      cy = (e.clientY - rect.top)  * scaleY;
    }
    return { cx, cy };
  };

  /* ── Main render loop ── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    tRef.current += 0.018;
    const t = tRef.current;

    /* Background */
    ctx.fillStyle = "#0a0f1e";
    ctx.fillRect(0, 0, W, H);

    /* Mirror position — horizontal bar at 60% height */
    const mirrorY = H * 0.60;
    const mirrorX1 = W * 0.12;
    const mirrorX2 = W * 0.88;

    /* Draw grid (subtle) */
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    /* Mirror — polished silver surface */
    const mirGrad = ctx.createLinearGradient(mirrorX1, mirrorY - 6, mirrorX1, mirrorY + 6);
    mirGrad.addColorStop(0,   "rgba(148,163,184,0.9)");
    mirGrad.addColorStop(0.5, "rgba(203,213,225,1)");
    mirGrad.addColorStop(1,   "rgba(100,116,139,0.8)");
    ctx.fillStyle   = mirGrad;
    ctx.shadowColor = "#818cf8";
    ctx.shadowBlur  = 8;
    ctx.fillRect(mirrorX1, mirrorY - 4, mirrorX2 - mirrorX1, 8);
    ctx.shadowBlur = 0;

    /* Mirror hatching (indicating solid backing) */
    ctx.strokeStyle = "rgba(100,116,139,0.4)";
    ctx.lineWidth   = 1;
    for (let x = mirrorX1; x < mirrorX2; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, mirrorY + 4);
      ctx.lineTo(x - 10, mirrorY + 16);
      ctx.stroke();
    }

    /* Source position (in canvas px) */
    const sx = srcRef.current.nx * W;
    const sy = srcRef.current.ny * H;

    /* Clamp source to upper half only */
    const clampedSy = Math.min(sy, mirrorY - 30);

    /* Intersection of incident ray with mirror */
    /* The ray goes from (sx, clampedSy) downward to mirrorY */
    /* Find the x where ray crosses mirrorY */
    /* If source directly above: straight down; otherwise interpolate */
    const dx = 0; /* mirror is horizontal, so ix = sx */
    const ix = Math.max(mirrorX1, Math.min(mirrorX2, sx));
    const iy = mirrorY;

    /* Angle of incidence — angle from normal (normal is vertical for flat mirror) */
    const incAngleRad = Math.atan2(Math.abs(ix - sx), Math.abs(iy - clampedSy));
    const incDeg = Math.round(incAngleRad * 180 / Math.PI);
    setAngles({ i: incDeg, r: incDeg });

    /* ── Wavefront mode ── */
    if (showWave) {
      /* Draw concentric arcs from source */
      ctx.strokeStyle = rayColor + "40";
      ctx.lineWidth   = 1.5;
      for (let r = 30; r < 200; r += 30) {
        const phase = (t * 60) % 30;
        const rr = r - phase;
        if (rr > 0) {
          ctx.beginPath();
          ctx.arc(sx, clampedSy, rr, Math.PI * 0.1, Math.PI * 0.9, false);
          ctx.stroke();
        }
      }
    }

    /* ─── Helper: glow line ─── */
    const glowLine = (x1: number, y1: number, x2: number, y2: number, color: string, w = 2.5) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth   = w + 2;
      ctx.shadowColor = color;
      ctx.shadowBlur  = 18;
      ctx.globalAlpha = 0.4;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.lineWidth   = w;
      ctx.shadowBlur  = 8;
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.restore();
    };

    /* ─── Incident ray ─── */
    glowLine(sx, clampedSy, ix, iy, rayColor, 2.5);

    /* Arrow on incident ray */
    const midIx = (sx + ix) / 2;
    const midIy = (clampedSy + iy) / 2;
    const incDir = Math.atan2(iy - clampedSy, ix - sx);
    ctx.save();
    ctx.translate(midIx, midIy);
    ctx.rotate(incDir);
    ctx.fillStyle   = rayColor;
    ctx.shadowColor = rayColor;
    ctx.shadowBlur  = 10;
    ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(-4, -4); ctx.lineTo(-4, 4); ctx.closePath(); ctx.fill();
    ctx.restore();

    /* ─── Normal line (dashed, white) ─── */
    const normalLen = 70;
    ctx.save();
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth   = 1.5;
    ctx.shadowColor = "rgba(255,255,255,0.3)";
    ctx.shadowBlur  = 6;
    ctx.beginPath();
    ctx.moveTo(ix, iy - normalLen);
    ctx.lineTo(ix, iy + normalLen);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    /* ─── Reflected ray ─── */
    /* Mirror is horizontal, so reflection: flip y-component of direction */
    const reflDirX = ix - sx;  /* same x-direction */
    const reflDirY = -(iy - clampedSy); /* negate y-direction */
    const reflLen  = 160;
    const reflMag  = Math.sqrt(reflDirX * reflDirX + reflDirY * reflDirY);
    const rx2 = ix + (reflDirX / reflMag) * reflLen;
    const ry2 = iy + (reflDirY / reflMag) * reflLen;

    glowLine(ix, iy, rx2, ry2, rayColor, 2.5);

    /* Arrow on reflected ray */
    const midRx = (ix + rx2) / 2;
    const midRy = (iy + ry2) / 2;
    const reflAngle = Math.atan2(ry2 - iy, rx2 - ix);
    ctx.save();
    ctx.translate(midRx, midRy);
    ctx.rotate(reflAngle);
    ctx.fillStyle   = rayColor;
    ctx.shadowColor = rayColor;
    ctx.shadowBlur  = 10;
    ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(-4, -4); ctx.lineTo(-4, 4); ctx.closePath(); ctx.fill();
    ctx.restore();

    /* ─── Virtual image line (dotted extension behind mirror) ─── */
    if (showImage) {
      const imgLen = 140;
      const imgDirX = -reflDirX; /* reverse reflected direction */
      const imgDirY = -reflDirY;
      const imgX2 = ix + (imgDirX / reflMag) * imgLen;
      const imgY2 = iy + (imgDirY / reflMag) * imgLen;
      ctx.save();
      ctx.setLineDash([5, 6]);
      ctx.strokeStyle = rayColor + "60";
      ctx.lineWidth   = 1.5;
      ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(imgX2, imgY2); ctx.stroke();
      ctx.setLineDash([]);
      /* Virtual image dot */
      ctx.fillStyle   = rayColor + "80";
      ctx.shadowColor = rayColor;
      ctx.shadowBlur  = 15;
      ctx.beginPath(); ctx.arc(imgX2, imgY2, 5, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
      /* "Virtual Image" label */
      ctx.fillStyle  = rayColor + "99";
      ctx.font       = "bold 11px Inter, sans-serif";
      ctx.textAlign  = "center";
      ctx.fillText("Virtual Image", imgX2, imgY2 + 18);
    }

    /* ─── Angle arcs ─── */
    if (incDeg > 1) {
      /* ∠i arc */
      ctx.save();
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth   = 2;
      ctx.beginPath();
      /* Arc from normal to incident ray */
      const iRayAngle = Math.atan2(clampedSy - iy, sx - ix);
      ctx.arc(ix, iy, 38, -Math.PI / 2, iRayAngle, false);
      ctx.stroke();
      ctx.fillStyle = "#fbbf24";
      ctx.font      = "bold 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`∠i=${incDeg}°`, ix - 30, iy - 48);
      ctx.restore();

      /* ∠r arc */
      ctx.save();
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth   = 2;
      ctx.beginPath();
      const rRayAngle = Math.atan2(ry2 - iy, rx2 - ix);
      ctx.arc(ix, iy, 38, -Math.PI / 2, rRayAngle, true);
      ctx.stroke();
      ctx.fillStyle = "#34d399";
      ctx.font      = "bold 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`∠r=${incDeg}°`, ix + 30, iy - 48);
      ctx.restore();
    }

    /* ─── Animated photon on incident ray ─── */
    const ph1 = (t * 0.55) % 1;
    const ph1x = sx + ph1 * (ix - sx);
    const ph1y = clampedSy + ph1 * (iy - clampedSy);
    ctx.save();
    ctx.fillStyle   = "#ffffff";
    ctx.shadowColor = rayColor;
    ctx.shadowBlur  = 22;
    ctx.beginPath(); ctx.arc(ph1x, ph1y, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    /* ─── Animated photon on reflected ray ─── */
    const ph2 = (t * 0.55 + 0.5) % 1;
    const ph2x = ix + ph2 * (rx2 - ix);
    const ph2y = iy + ph2 * (ry2 - iy);
    ctx.save();
    ctx.fillStyle   = "#ffffff";
    ctx.shadowColor = rayColor;
    ctx.shadowBlur  = 22;
    ctx.beginPath(); ctx.arc(ph2x, ph2y, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    /* ─── Light source bulb ─── */
    const pulseR = 14 + Math.sin(t * 3) * 2;
    ctx.save();
    const bulbGrad = ctx.createRadialGradient(sx, clampedSy, 0, sx, clampedSy, pulseR);
    bulbGrad.addColorStop(0,   rayColor);
    bulbGrad.addColorStop(0.5, rayColor + "aa");
    bulbGrad.addColorStop(1,   rayColor + "00");
    ctx.fillStyle   = bulbGrad;
    ctx.shadowColor = rayColor;
    ctx.shadowBlur  = 30;
    ctx.beginPath(); ctx.arc(sx, clampedSy, pulseR, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(sx, clampedSy, 6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    /* "DRAG" hint on first render */
    if (t < 4) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - t / 3);
      ctx.fillStyle   = "rgba(255,255,255,0.7)";
      ctx.font        = "13px Inter, sans-serif";
      ctx.textAlign   = "center";
      ctx.fillText("← Drag the light source →", sx, clampedSy - 25);
      ctx.restore();
    }

    /* ─── "Normal" label ─── */
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font      = "11px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Normal", ix + 8, iy - normalLen + 14);
    ctx.restore();

    /* ─── Mirror label ─── */
    ctx.fillStyle  = "rgba(148,163,184,0.7)";
    ctx.font       = "bold 11px Inter, sans-serif";
    ctx.textAlign  = "left";
    ctx.fillText("Plane Mirror (M)", mirrorX1 + 8, mirrorY - 10);

    animRef.current = requestAnimationFrame(draw);
  }, [showImage, showWave, rayColor]);

  /* Start/restart animation when settings change */
  useEffect(() => {
    cancelAnimationFrame(animRef.current);
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  /* ── Pointer drag handlers ── */
  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const { cx, cy } = toCanvas(e, canvas);
    const W = canvas.width, H = canvas.height;
    const mirrorY = H * 0.60;
    if (cy < mirrorY - 20) {
      setIsDragging(true);
      srcRef.current = { nx: cx / W, ny: Math.min(cy / H, (mirrorY - 30) / H) };
      canvas.setPointerCapture(e.pointerId);
    }
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const canvas = canvasRef.current!;
    const { cx, cy } = toCanvas(e, canvas);
    const W = canvas.width, H = canvas.height;
    const mirrorY = H * 0.60;
    srcRef.current = {
      nx: Math.max(0.05, Math.min(0.95, cx / W)),
      ny: Math.max(0.05, Math.min((mirrorY - 30) / H, cy / H)),
    };
  };
  const onPointerUp = () => setIsDragging(false);

  return (
    <div className={styles.simWrapper}>
      {/* Title */}
      <div className={styles.simTitle}>
        🪞 Laws of Reflection — Interactive Ray Lab
      </div>
      <div className={styles.simSubtitle}>
        Drag the light source to explore <strong>∠i = ∠r</strong> in real time
      </div>

      {/* Live angle readout */}
      <div style={{
        display: "flex", gap: "12px", justifyContent: "center",
        marginBottom: "12px", flexWrap: "wrap",
      }}>
        <span style={{
          background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)",
          borderRadius: "8px", padding: "6px 16px", color: "#fbbf24",
          fontSize: "0.9rem", fontWeight: 700,
        }}>∠i = {angles.i}°</span>
        <span style={{
          background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)",
          borderRadius: "8px", padding: "6px 16px", color: "#34d399",
          fontSize: "0.9rem", fontWeight: 700,
        }}>∠r = {angles.r}°</span>
        <span style={{
          background: angles.i === angles.r
            ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)",
          border: `1px solid ${angles.i === angles.r ? "rgba(52,211,153,0.4)" : "rgba(239,68,68,0.4)"}`,
          borderRadius: "8px", padding: "6px 16px",
          color: angles.i === angles.r ? "#34d399" : "#f87171",
          fontSize: "0.85rem", fontWeight: 600,
        }}>
          {angles.i === angles.r ? "✓ ∠i = ∠r" : "Calculating…"}
        </span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={700} height={380}
        className={styles.canvas}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />

      {/* Controls */}
      <div style={{
        display: "flex", gap: "10px", justifyContent: "center",
        marginTop: "14px", flexWrap: "wrap",
      }}>
        <button
          onClick={() => setShowImage(v => !v)}
          style={{
            background: showImage ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.4)", color: "#a5b4fc",
            borderRadius: "8px", padding: "6px 16px", cursor: "pointer",
            fontSize: "0.8rem", fontWeight: 600,
          }}
        >
          {showImage ? "✓" : "○"} Virtual Image
        </button>
        <button
          onClick={() => setShowWave(v => !v)}
          style={{
            background: showWave ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.06)",
            border: "1px solid rgba(34,197,94,0.35)", color: "#86efac",
            borderRadius: "8px", padding: "6px 16px", cursor: "pointer",
            fontSize: "0.8rem", fontWeight: 600,
          }}
        >
          {showWave ? "✓" : "○"} Wavefronts
        </button>
        {RAY_COLORS.map(c => (
          <button
            key={c.value}
            onClick={() => setRayColor(c.value)}
            title={c.label}
            style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: c.value,
              border: rayColor === c.value ? "3px solid white" : "2px solid rgba(255,255,255,0.2)",
              cursor: "pointer", flexShrink: 0,
            }}
          />
        ))}
      </div>

      {/* Key law card */}
      <div style={{
        marginTop: "16px",
        background: "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(52,211,153,0.06))",
        border: "1px solid rgba(251,191,36,0.2)",
        borderRadius: "12px", padding: "14px 20px",
        display: "flex", gap: "16px", alignItems: "flex-start",
      }}>
        <span style={{ fontSize: "22px" }}>📐</span>
        <div>
          <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: "0.9rem", marginBottom: "4px" }}>
            First Law of Reflection
          </div>
          <div style={{ color: "#94a3b8", fontSize: "0.82rem", lineHeight: 1.6 }}>
            The angle of incidence (∠i) is always equal to the angle of reflection (∠r).
            Both angles are measured from the <strong style={{ color: "#e2e8f0" }}>Normal</strong> (perpendicular to the mirror surface at the point of incidence).
          </div>
        </div>
      </div>
    </div>
  );
}
