"use client";
/**
 * FILE: LightTopic1Simulations.tsx
 * LOCATION: src/components/simulations/LightTopic1Simulations.tsx
 * PURPOSE: 5 interactive canvas simulations for Class 10 Light — Topic 1:
 *          Introduction to Light and Laws of Reflection.
 *
 * SIMULATIONS:
 *   1. Sim_light_plane_mirror      — drag the light source, see ∠i = ∠r live
 *   2. Sim_light_regular_diffuse   — smooth vs rough surface reflection comparison
 *   3. Sim_light_lateral_inversion — animated lateral inversion demo (letter + mirror)
 *   4. Sim_light_two_mirrors       — two mirrors at 90°, counts multiple images
 *   5. Sim_light_min_mirror        — minimum mirror height for full body image
 *
 * PATTERN: Each export is a self-contained "use client" React component.
 *          Canvas is HiDPI-aware, auto-starts on mount, cleaned up on unmount.
 * LAST UPDATED: 2026-06-08
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
 * SHARED UTILITIES
 * ───────────────────────────────────────────────────────────────────────────── */

/** Set up a HiDPI canvas and return [ctx, CSS-width, CSS-height]. */
function setupCanvas(
  canvas: HTMLCanvasElement,
): [CanvasRenderingContext2D, number, number] | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth || 560;
  const H = canvas.clientHeight || 340;
  if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
    canvas.width = W * dpr;
    canvas.height = H * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return [ctx, W, H];
}

/** Dark gradient background with subtle dot grid. */
function drawDarkBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  /* Background gradient */
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#050c18");
  grad.addColorStop(1, "#0b1525");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  /* Subtle dot grid */
  ctx.fillStyle = "rgba(99,102,241,0.06)";
  for (let x = 0; x <= W; x += 40)
    for (let y = 0; y <= H; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
}

/** Draw a glowing ray from (x1,y1) to (x2,y2). */
function drawRay(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  color: string,
  glow = 8,
  lw = 2,
) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = glow;
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  /* Arrowhead */
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 12) { ctx.restore(); return; }
  const ux = dx / len, uy = dy / len;
  const ah = 12;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - ah * (ux - 0.4 * uy), y2 - ah * (uy + 0.4 * ux));
  ctx.lineTo(x2 - ah * (ux + 0.4 * uy), y2 - ah * (uy - 0.4 * ux));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Draw a dashed line. */
function drawDashed(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  color = "rgba(148,163,184,0.5)",
  dash = [6, 4],
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

/** Label helper. */
function label(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number, y: number,
  color = "#e2e8f0",
  size = 12,
  bold = false,
) {
  ctx.save();
  ctx.font = `${bold ? "bold " : ""}${size}px 'Inter', system-ui, sans-serif`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 1: Plane Mirror — Interactive (drag light source)
 * Shows angle of incidence = angle of reflection in real time.
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_plane_mirror() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* sourceX, sourceY are the draggable light source position (CSS coords) */
  const [src, setSrc] = useState({ x: 130, y: 80 });
  const dragging = useRef(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;
    drawDarkBg(ctx, W, H);

    /* Mirror sits horizontally in the middle */
    const mY = H / 2 + 20;    /* mirror Y */
    const mX1 = W * 0.15;
    const mX2 = W * 0.85;
    const mXmid = W / 2;

    /* Draw mirror */
    ctx.save();
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#3b82f6";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(mX1, mY);
    ctx.lineTo(mX2, mY);
    ctx.stroke();
    ctx.restore();
    /* Mirror label */
    label(ctx, "Plane Mirror", mX2 + 8, mY + 4, "#60a5fa", 11);

    /* The point of incidence is where the ray hits the mirror (directly below source along mirror) */
    /* Actually: ray from src goes straight down to the mirror => point of incidence = (src.x, mY) */
    /* Clamp to mirror bounds */
    const poi_x = Math.max(mX1 + 10, Math.min(mX2 - 10, src.x));
    const poi_y = mY;

    /* Normal at point of incidence (vertical dashed line) */
    drawDashed(ctx, poi_x, mY - 100, poi_x, mY + 80, "rgba(250,204,21,0.5)");
    label(ctx, "Normal", poi_x + 5, mY - 105, "#fbbf24", 11);

    /* Incident ray: from src to poi */
    const incDx = poi_x - src.x;
    const incDy = poi_y - src.y;
    drawRay(ctx, src.x, src.y, poi_x, poi_y, "#f97316", 12, 2.5);
    label(ctx, "Incident Ray", src.x - 90, src.y - 10, "#f97316", 11);

    /* Reflected ray: mirror image of source across horizontal mirror */
    /* The reflected ray continues from poi with mirrored direction */
    const lenRay = Math.sqrt(incDx * incDx + incDy * incDy);
    const scale = 1.4;
    const refX = poi_x + incDx * scale;   /* horizontal component same */
    const refY = poi_y - incDy * scale;   /* vertical component flipped = mirror reflection */
    drawRay(ctx, poi_x, poi_y, refX, refY, "#34d399", 12, 2.5);
    label(ctx, "Reflected Ray", refX - 10, refY - 12, "#34d399", 11);

    /* Angle of incidence (measured from normal) */
    /* Normal is vertical. Angle with normal = arctan(|horizontal|/|vertical|) */
    const angleDeg = Math.round(
      (Math.atan2(Math.abs(incDx), Math.abs(incDy)) * 180) / Math.PI,
    );

    /* Draw angle arc for incidence (between incident ray and normal, above mirror) */
    ctx.save();
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 1.5;
    const arcR = 32;
    /* Incident direction angle from normal (upward = 270° = -PI/2, rotated by incDx/incDy) */
    const incAngleRad = Math.atan2(-incDy, incDx); /* angle in standard coords */
    ctx.beginPath();
    ctx.arc(poi_x, poi_y, arcR, -Math.PI / 2, incAngleRad, true);
    ctx.stroke();
    ctx.restore();

    /* Draw angle arc for reflection (symmetric) */
    ctx.save();
    ctx.strokeStyle = "#34d399";
    ctx.lineWidth = 1.5;
    const refAngleRad = Math.atan2(-(refY - poi_y), refX - poi_x);
    ctx.beginPath();
    ctx.arc(poi_x, poi_y, arcR, -Math.PI / 2, refAngleRad);
    ctx.stroke();
    ctx.restore();

    /* Angle labels */
    const midAngle = -Math.PI / 2 - (incAngleRad + Math.PI / 2) / 2;
    label(ctx, `∠i = ${angleDeg}°`, poi_x - arcR - 52, poi_y - arcR / 2, "#f97316", 12, true);
    label(ctx, `∠r = ${angleDeg}°`, poi_x + arcR + 6, poi_y - arcR / 2, "#34d399", 12, true);

    /* Light source dot */
    ctx.save();
    ctx.fillStyle = "#fef08a";
    ctx.shadowColor = "#fef08a";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(src.x, src.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    label(ctx, "💡 Drag me", src.x + 10, src.y - 12, "#fef08a", 11);

    /* Point of incidence dot */
    ctx.save();
    ctx.fillStyle = "#60a5fa";
    ctx.shadowColor = "#60a5fa";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(poi_x, poi_y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    label(ctx, "O", poi_x + 5, poi_y - 7, "#60a5fa", 10);

    /* LAW display */
    label(ctx, "First Law of Reflection:", 14, 20, "#94a3b8", 11);
    label(ctx, `∠i = ∠r = ${angleDeg}°`, 14, 38, "#ffffff", 14, true);
    label(ctx, "Move the light source ↑ to change the angle", W / 2 - 140, H - 12, "#475569", 11);
  }, [src]);

  useEffect(() => { draw(); }, [draw]);

  /* Mouse + touch handlers for dragging the light source */
  const getPos = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement,
  ) => {
    const rect = canvas.getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getPos(e, canvas);
    const dx = pos.x - src.x, dy = pos.y - src.y;
    if (Math.sqrt(dx * dx + dy * dy) < 20) dragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getPos(e, canvas);
    const mY = (canvas.clientHeight || 340) / 2 + 20;
    /* Keep source above the mirror with some margin */
    setSrc({ x: pos.x, y: Math.min(mY - 30, Math.max(10, pos.y)) });
  };

  const handleMouseUp = () => { dragging.current = false; };

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          🪞 Plane Mirror — Laws of Reflection
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Drag the light source to change the angle — watch ∠i always equal ∠r
        </p>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 340, display: "block", cursor: "grab" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 2: Regular vs Diffuse Reflection
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_regular_diffuse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      const canvas = canvasRef.current;
      if (!canvas) { rafRef.current = requestAnimationFrame(loop); return; }
      const result = setupCanvas(canvas);
      if (!result) { rafRef.current = requestAnimationFrame(loop); return; }
      const [ctx, W, H] = result;
      tRef.current += 0.025;
      const t = tRef.current;
      drawDarkBg(ctx, W, H);

      const halfW = W / 2;

      /* ── LEFT PANEL: Regular (Specular) Reflection ── */
      label(ctx, "Regular (Specular) Reflection", 12, 22, "#60a5fa", 12, true);
      label(ctx, "Smooth mirror surface", 12, 38, "#64748b", 10);

      /* Mirror surface — flat line */
      const mirY = H * 0.6;
      ctx.save();
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#60a5fa";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(20, mirY);
      ctx.lineTo(halfW - 20, mirY);
      ctx.stroke();
      ctx.restore();

      /* 4 animated parallel incident rays hitting smooth surface */
      const numRays = 4;
      const spacing = (halfW - 60) / (numRays + 1);
      for (let i = 0; i < numRays; i++) {
        const px = 40 + spacing * (i + 1);
        const srcY = mirY - 90;
        const phase = i * 0.4 - t;
        const alpha = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(phase * Math.PI));
        /* Incident ray */
        ctx.save();
        ctx.globalAlpha = alpha;
        drawRay(ctx, px - 30, srcY, px, mirY, "#f97316", 6, 1.5);
        /* Reflected ray — parallel, same angle */
        drawRay(ctx, px, mirY, px + 30, srcY, "#34d399", 6, 1.5);
        ctx.restore();
      }
      label(ctx, "→ Parallel reflected rays", 12, mirY + 28, "#34d399", 11);
      label(ctx, "→ Forms a CLEAR IMAGE", 12, mirY + 44, "#a3e635", 11, true);

      /* ── RIGHT PANEL: Diffuse Reflection ── */
      label(ctx, "Diffuse (Irregular) Reflection", halfW + 8, 22, "#f472b6", 12, true);
      label(ctx, "Rough paper/wall surface", halfW + 8, 38, "#64748b", 10);

      /* Rough surface — jagged line */
      ctx.save();
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#a855f7";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      const segs = 14;
      const segW = (halfW - 60) / segs;
      ctx.moveTo(halfW + 20, mirY);
      for (let s = 0; s <= segs; s++) {
        const rx = halfW + 20 + s * segW;
        const ry = mirY + (s % 2 === 0 ? -5 : 5) * (0.7 + 0.3 * Math.sin(s));
        ctx.lineTo(rx, ry);
      }
      ctx.stroke();
      ctx.restore();

      /* 5 animated incident rays hitting rough surface, reflecting in random directions */
      const diffRayAngles = [
        -70, -45, -20, 10, 35, 60,
      ]; /* degrees from vertical */
      const diffPosX = [
        halfW + 40, halfW + 80, halfW + 120, halfW + 160, halfW + 200,
      ];
      for (let i = 0; i < 5; i++) {
        const px = diffPosX[i];
        const phase = i * 0.6 - t * 1.2;
        const alpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(phase * Math.PI));
        const ang = (diffRayAngles[i] * Math.PI) / 180;
        ctx.save();
        ctx.globalAlpha = alpha;
        /* Incident ray — same direction for all */
        drawRay(ctx, px - 22, mirY - 75, px, mirY, "#f97316", 6, 1.5);
        /* Reflected ray — scattered direction */
        const refLen = 70;
        drawRay(
          ctx, px, mirY,
          px + Math.sin(ang) * refLen,
          mirY - Math.cos(ang) * refLen,
          "#f472b6", 6, 1.5,
        );
        ctx.restore();
      }
      label(ctx, "→ Scattered in all directions", halfW + 8, mirY + 28, "#f472b6", 11);
      label(ctx, "→ No image, but VISIBLE everywhere", halfW + 8, mirY + 44, "#fb923c", 11, true);

      /* Divider */
      ctx.save();
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(halfW, 0);
      ctx.lineTo(halfW, H);
      ctx.stroke();
      ctx.restore();

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          ✨ Regular vs Diffuse Reflection
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Smooth surfaces form images; rough surfaces scatter light in all directions
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 300, display: "block" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 3: Lateral Inversion Demo
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_lateral_inversion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      const canvas = canvasRef.current;
      if (!canvas) { rafRef.current = requestAnimationFrame(loop); return; }
      const result = setupCanvas(canvas);
      if (!result) { rafRef.current = requestAnimationFrame(loop); return; }
      const [ctx, W, H] = result;
      tRef.current += 0.008;
      drawDarkBg(ctx, W, H);

      const mirX = W / 2; /* Mirror is vertical at center */
      const mirY1 = 20, mirY2 = H - 20;

      /* Draw vertical mirror */
      ctx.save();
      ctx.strokeStyle = "#60a5fa";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#3b82f6";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(mirX, mirY1);
      ctx.lineTo(mirX, mirY2);
      ctx.stroke();
      /* Mirror sheen */
      const sheen = ctx.createLinearGradient(mirX - 4, 0, mirX + 4, 0);
      sheen.addColorStop(0, "rgba(147,197,253,0)");
      sheen.addColorStop(0.5, "rgba(147,197,253,0.3)");
      sheen.addColorStop(1, "rgba(147,197,253,0)");
      ctx.fillStyle = sheen;
      ctx.fillRect(mirX - 4, mirY1, 8, mirY2 - mirY1);
      ctx.restore();
      label(ctx, "Mirror", mirX - 22, H - 6, "#60a5fa", 11, true);

      /* Object: the letter "P" drawn on left */
      const objX = mirX - 120;
      const objY = H / 2;
      ctx.save();
      ctx.font = "bold 72px 'Inter', system-ui, sans-serif";
      ctx.fillStyle = "#f97316";
      ctx.shadowColor = "#f97316";
      ctx.shadowBlur = 15;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("P", objX, objY);
      ctx.restore();
      label(ctx, "Object", objX - 18, objY + 50, "#f97316", 11);
      label(ctx, "(letter P)", objX - 22, objY + 64, "#f97316", 10);

      /* Image: mirror image of "P" — drawn flipped horizontally on right */
      const imgX = mirX + 120;
      ctx.save();
      ctx.font = "bold 72px 'Inter', system-ui, sans-serif";
      ctx.fillStyle = "rgba(248,113,113,0.85)";
      ctx.shadowColor = "#f87171";
      ctx.shadowBlur = 15;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      /* Flip horizontally around imgX */
      ctx.translate(imgX, objY);
      ctx.scale(-1, 1);
      ctx.fillText("P", 0, 0);
      ctx.restore();

      label(ctx, "Virtual Image", imgX - 30, objY + 50, "#f87171", 11);
      label(ctx, "(appears as 'q')", imgX - 34, objY + 64, "#f87171", 10);

      /* Animated reflection rays */
      const nRays = 5;
      for (let i = 0; i < nRays; i++) {
        const ry = objY - 60 + i * 30;
        const brightness = 0.3 + 0.7 * Math.abs(Math.sin(tRef.current + i * 0.8));
        ctx.save();
        ctx.globalAlpha = brightness * 0.5;
        /* Ray from object point to mirror */
        drawRay(ctx, objX + 36, ry, mirX, ry, "#fbbf24", 4, 1);
        /* Reflected ray going to right */
        drawRay(ctx, mirX, ry, imgX - 36, ry, "#94a3b8", 4, 1);
        ctx.restore();
      }

      /* Label arrows */
      label(ctx, "← Object at distance d →", mirX - 130, 28, "#64748b", 10);
      label(ctx, "← Image at same distance d →", mirX - 10, 28, "#64748b", 10);

      /* Lateral inversion label */
      label(ctx, "LATERAL INVERSION:", W / 2 - 75, H - 40, "#fbbf24", 11, true);
      label(ctx, "Left ↔ Right reversed. Same size, same distance.", W / 2 - 145, H - 24, "#94a3b8", 10);

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          🔄 Lateral Inversion in Plane Mirror
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Why AMBULANCE is written backwards — the mirror reverses left and right
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 300, display: "block" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 4: Two Plane Mirrors at 90° — Multiple Images
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_two_mirrors() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(90);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;
    drawDarkBg(ctx, W, H);

    /* Number of images = 360/angle - 1 */
    const n = angle === 0 ? "∞" : String(Math.round(360 / angle) - 1);

    /* Draw two mirrors at 'angle' from corner at bottom-center */
    const ox = W * 0.5, oy = H * 0.82;
    const mirLen = 160;
    const rad = (angle * Math.PI) / 180;

    /* Mirror 1 — horizontal going left */
    const m1x2 = ox - mirLen, m1y2 = oy;
    /* Mirror 2 — at angle going up-right */
    const m2x2 = ox + Math.cos(Math.PI - rad) * mirLen;
    const m2y2 = oy + Math.sin(Math.PI - rad) * mirLen;

    ctx.save();
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#3b82f6";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(m1x2, m1y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(m2x2, m2y2);
    ctx.stroke();
    ctx.restore();

    /* Object: a bright dot inside the angle */
    const objAngle = ((angle / 2) * Math.PI) / 180;
    const objDist = 80;
    /* Object is between the two mirrors */
    const objX = ox - Math.cos(objAngle) * objDist;
    const objY = oy - Math.sin(objAngle) * objDist;

    ctx.save();
    ctx.fillStyle = "#fef08a";
    ctx.shadowColor = "#fef08a";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(objX, objY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    label(ctx, "Object", objX - 20, objY - 16, "#fef08a", 11, true);

    /* Angle arc */
    ctx.save();
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(ox, oy, 50, -Math.PI + (0.3), -(0.3), false);
    ctx.stroke();
    ctx.restore();
    label(ctx, `θ = ${angle}°`, ox - 100, oy - 55, "#fbbf24", 13, true);

    /* Formula and answer */
    label(ctx, "No. of Images = (360° / θ) − 1", W / 2 - 130, 24, "#94a3b8", 12);
    label(ctx, `= (360 / ${angle}) − 1 = ${n}`, W / 2 - 70, 46, "#ffffff", 15, true);

    /* Draw ghost image dots */
    const numImg = angle === 0 ? 8 : Math.min(11, Math.round(360 / angle) - 1);
    const radius = 90;
    for (let i = 1; i <= numImg; i++) {
      const imgAngle = ((360 / (numImg + 1)) * i * Math.PI) / 180;
      const ix = ox + Math.cos(imgAngle) * radius;
      const iy = oy - Math.sin(imgAngle) * radius;
      ctx.save();
      ctx.fillStyle = "rgba(248,113,113,0.6)";
      ctx.shadowColor = "#f87171";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(ix, iy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    label(ctx, "Mirror 1", ox - mirLen / 2 - 15, oy + 14, "#60a5fa", 10);
    label(ctx, "Mirror 2", ox + 30, oy - 50, "#60a5fa", 10);
    label(ctx, "🔴 = Virtual Images", W / 2 - 60, H - 12, "#f87171", 11);
  }, [angle]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          🪞🪞 Two Mirrors — Multiple Images
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          Formula: Number of images = (360° ÷ θ) − 1
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 280, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid #1e293b" }}>
        <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui" }}>Angle θ:</span>
        <input
          type="range" min={30} max={180} step={5} value={angle}
          onChange={e => setAngle(Number(e.target.value))}
          style={{ flex: 1, accentColor: "#3b82f6" }}
        />
        <span style={{ color: "#fbbf24", fontSize: 14, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 40 }}>
          {angle}°
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIMULATION 5: Minimum Mirror Height for Full Body Image
 * ───────────────────────────────────────────────────────────────────────────── */
export function Sim_light_min_mirror() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [height, setHeight] = useState(160); /* person height in cm */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;
    drawDarkBg(ctx, W, H);

    /* Draw person on left */
    const personH = (height / 200) * (H * 0.75);
    const personX = W * 0.25;
    const feetY = H * 0.88;
    const headY = feetY - personH;
    const eyeY = headY + personH * 0.07; /* eyes ~7% from top */
    const mirrorX = W * 0.6;

    /* Person stick figure */
    ctx.save();
    ctx.strokeStyle = "#f97316";
    ctx.fillStyle = "#f97316";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#f97316";
    ctx.shadowBlur = 8;
    /* Head */
    ctx.beginPath();
    ctx.arc(personX, headY + 10, 10, 0, Math.PI * 2);
    ctx.stroke();
    /* Body */
    ctx.beginPath();
    ctx.moveTo(personX, headY + 20);
    ctx.lineTo(personX, feetY - 30);
    ctx.stroke();
    /* Arms */
    ctx.beginPath();
    ctx.moveTo(personX - 18, headY + 40);
    ctx.lineTo(personX + 18, headY + 40);
    ctx.stroke();
    /* Legs */
    ctx.beginPath();
    ctx.moveTo(personX, feetY - 30);
    ctx.lineTo(personX - 14, feetY);
    ctx.moveTo(personX, feetY - 30);
    ctx.lineTo(personX + 14, feetY);
    ctx.stroke();
    /* Eyes marker */
    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.arc(personX + 5, eyeY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    label(ctx, `Height = ${height} cm`, personX - 25, feetY + 16, "#f97316", 11);

    /* Mirror min length = height / 2 */
    const minMirrorH = personH / 2;
    const mirTopY = eyeY - minMirrorH / 2; /* mirror starts midway between head and eyes */
    const mirBotY = eyeY + minMirrorH;

    /* Full mirror (background reference) */
    ctx.save();
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(mirrorX, headY);
    ctx.lineTo(mirrorX, feetY);
    ctx.stroke();
    ctx.restore();

    /* Minimum mirror highlighted */
    ctx.save();
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 5;
    ctx.shadowColor = "#60a5fa";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(mirrorX, mirTopY);
    ctx.lineTo(mirrorX, mirBotY);
    ctx.stroke();
    /* Bracket indicators */
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#60a5fa";
    ctx.beginPath();
    ctx.moveTo(mirrorX - 8, mirTopY);
    ctx.lineTo(mirrorX + 8, mirTopY);
    ctx.moveTo(mirrorX - 8, mirBotY);
    ctx.lineTo(mirrorX + 8, mirBotY);
    ctx.stroke();
    ctx.restore();

    /* Rays: head → mirror → eye, foot → mirror → eye */
    const mirHeadY = (headY + eyeY) / 2;
    const mirFootY = (feetY + eyeY) / 2;

    ctx.save();
    ctx.globalAlpha = 0.7;
    /* Head ray */
    drawRay(ctx, personX, headY + 10, mirrorX, mirHeadY, "#fbbf24", 6, 1.5);
    drawRay(ctx, mirrorX, mirHeadY, personX + 5, eyeY, "#34d399", 6, 1.5);
    /* Foot ray */
    drawRay(ctx, personX, feetY, mirrorX, mirFootY, "#fbbf24", 6, 1.5);
    drawRay(ctx, mirrorX, mirFootY, personX + 5, eyeY, "#34d399", 6, 1.5);
    ctx.restore();

    /* Labels */
    label(ctx, "Mirror", mirrorX + 8, H / 2, "#60a5fa", 11);
    label(ctx, `Min. length`, mirrorX + 8, H / 2 + 16, "#60a5fa", 11);
    label(ctx, `= ${Math.round(height / 2)} cm`, mirrorX + 8, H / 2 + 32, "#60a5fa", 13, true);
    label(ctx, "= Height / 2", mirrorX + 8, H / 2 + 50, "#94a3b8", 10);

    /* Title */
    label(ctx, "Key Fact:", 10, 22, "#94a3b8", 11);
    label(ctx, "Min. mirror = ½ your height (regardless of distance)", 10, 40, "#e2e8f0", 12, true);
  }, [height]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
          📏 Minimum Mirror Height for Full Body Image
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
          The minimum mirror size is always exactly half your height
        </p>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 300, display: "block" }} />
      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid #1e293b" }}>
        <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Inter, system-ui" }}>Height:</span>
        <input
          type="range" min={100} max={200} step={5} value={height}
          onChange={e => setHeight(Number(e.target.value))}
          style={{ flex: 1, accentColor: "#3b82f6" }}
        />
        <span style={{ color: "#f97316", fontSize: 14, fontWeight: 700, fontFamily: "Inter, system-ui", minWidth: 55 }}>
          {height} cm
        </span>
      </div>
    </div>
  );
}
