/**
 * FILE: PlaneMirrorSim.tsx
 * LOCATION: frontend/src/components/simulations/light/reflection/PlaneMirrorSim.tsx
 * PURPOSE: Ultra-professional, highly animated plane mirror simulation with
 *          realistic light physics and stunning visual effects.
 *
 * FEATURES:
 *   ─ Drag the light source anywhere on the left half of the canvas
 *   ─ Multiple simultaneous photon particles (4 on incident + 4 on reflected ray)
 *   ─ Glowing particle trails behind each photon (fading comet tails)
 *   ─ Sparkle star burst animation at the reflection hit point
 *   ─ Pulsing wave rings emanating from the light source
 *   ─ Soft gradient light beams (realistic cross-sectional glow)
 *   ─ Three modes: Single Ray / Fan of 5 Rays / Parallel Rays
 *   ─ Toggle virtual image with dashed purple extension
 *   ─ Live animated angle display (∠i = ∠r in real time)
 *   ─ Dot-grid professional background with ambient glow
 *   ─ Fully responsive (ResizeObserver), HiDPI / Retina canvas
 *   ─ Touch + mouse drag support
 *
 * PHYSICS: 1st & 2nd Laws of Reflection
 * LAST UPDATED: 2026-06-09
 */

"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import styles from "../SimulationEngine.module.css";

/* ─────────────────────────────────────────
 * TYPES
 * ───────────────────────────────────────── */
interface Point { x: number; y: number; }
type RayMode = "single" | "fan" | "parallel";

/* ─────────────────────────────────────────
 * MATH HELPERS
 * ───────────────────────────────────────── */
const deg = (rad: number) => ((rad * 180) / Math.PI).toFixed(1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ─────────────────────────────────────────
 * DRAWING HELPERS
 * ───────────────────────────────────────── */

/**
 * Draw a realistic glowing light beam with soft cross-section.
 * Draws 4 layers: wide outer glow → mid glow → bright core → specular center.
 */
function glowBeam(
  ctx: CanvasRenderingContext2D,
  a: Point, b: Point,
  hexColor: string,
  alpha = 1.0,
  baseWidth = 2.5
) {
  const layers = [
    { w: baseWidth * 8, a: 0.06 },
    { w: baseWidth * 4, a: 0.14 },
    { w: baseWidth * 2, a: 0.45 },
    { w: baseWidth,     a: 1.00 },
  ];

  layers.forEach(({ w, a: la }) => {
    ctx.save();
    ctx.strokeStyle = hexColor;
    ctx.lineWidth = w;
    ctx.globalAlpha = la * alpha;
    ctx.shadowColor = hexColor;
    ctx.shadowBlur = w * 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.restore();
  });
}

/**
 * Draw a dashed line (used for normals, virtual image extensions).
 */
function dashedLine(
  ctx: CanvasRenderingContext2D,
  a: Point, b: Point,
  color: string,
  width = 1.5,
  dash = [6, 5]
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.globalAlpha = 0.7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw arrowhead at the 'to' end of a ray.
 */
function arrowHead(ctx: CanvasRenderingContext2D, from: Point, to: Point, color: string, size = 10) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - size * Math.cos(angle - 0.42), to.y - size * Math.sin(angle - 0.42));
  ctx.lineTo(to.x - size * Math.cos(angle + 0.42), to.y + size * -Math.sin(angle + 0.42));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Draw a glowing dot (used for key points).
 */
function glowDot(ctx: CanvasRenderingContext2D, p: Point, color: string, r = 5) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2);
  grad.addColorStop(0, color);
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.fill();
  ctx.restore();
}

/**
 * Draw centered text label with optional background box.
 */
function labelText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number, y: number,
  color = "#e2e8f0",
  size = 12,
  withBox = false
) {
  ctx.save();
  ctx.font = `600 ${size}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (withBox) {
    const w = ctx.measureText(text).width + 10;
    ctx.fillStyle = "rgba(8,15,31,0.7)";
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - size / 2 - 3, w, size + 6, 4);
    ctx.fill();
  }
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

/* ─────────────────────────────────────────
 * ANIMATION EFFECTS
 * ───────────────────────────────────────── */

/** Draw pulsing wave rings emanating from the light source */
function drawWaveRings(ctx: CanvasRenderingContext2D, cx: number, cy: number, time: number, color: string) {
  const NUM_RINGS = 4;
  const PERIOD_MS = 1800;
  const MAX_R = 55;

  for (let i = 0; i < NUM_RINGS; i++) {
    const phase = ((time / PERIOD_MS) + i / NUM_RINGS) % 1;
    const radius = phase * MAX_R;
    const alpha = (1 - phase) * 0.5;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = alpha;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

/** Draw animated sparkle star at the reflection hit point */
function drawSparkle(ctx: CanvasRenderingContext2D, cx: number, cy: number, time: number) {
  const ROT_SPEED = 0.0008;
  const rotation = time * ROT_SPEED;
  const NUM_SPIKES = 8;
  const pulse = 0.75 + 0.25 * Math.sin(time * 0.004);
  const outerR = 13 * pulse;
  const innerR = 5;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.fillStyle = "#fef3c7";
  ctx.shadowColor = "#fbbf24";
  ctx.shadowBlur = 22;
  ctx.beginPath();
  for (let i = 0; i < NUM_SPIKES * 2; i++) {
    const angle = (i * Math.PI) / NUM_SPIKES;
    const r = i % 2 === 0 ? outerR : innerR;
    if (i === 0) ctx.moveTo(r * Math.cos(angle), r * Math.sin(angle));
    else ctx.lineTo(r * Math.cos(angle), r * Math.sin(angle));
  }
  ctx.closePath();
  ctx.fill();

  /* Inner bright core */
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.shadowBlur = 30;
  ctx.fill();
  ctx.restore();
}

/**
 * Draw multiple photon particles with glowing comet trails along a ray.
 * @param t0 - phase offset for this set of photons (0-1)
 */
function drawPhotons(
  ctx: CanvasRenderingContext2D,
  from: Point, to: Point,
  time: number,
  color: string,
  numPhotons = 4,
  speed = 0.00018
) {
  const TRAIL_STEPS = 4;
  const TRAIL_SPACING = 0.04;

  for (let i = 0; i < numPhotons; i++) {
    const basePhase = ((time * speed) + i / numPhotons) % 1;

    /* Comet trail: 4 fading dots behind the photon */
    for (let t = TRAIL_STEPS; t >= 1; t--) {
      const trailPhase = Math.max(0, basePhase - t * TRAIL_SPACING);
      const tx = lerp(from.x, to.x, trailPhase);
      const ty = lerp(from.y, to.y, trailPhase);
      const trailAlpha = (1 - t / (TRAIL_STEPS + 1)) * 0.4;
      const trailR = Math.max(1, 4 - t);

      ctx.save();
      ctx.beginPath();
      ctx.arc(tx, ty, trailR, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = trailAlpha;
      ctx.fill();
      ctx.restore();
    }

    /* Photon head */
    const px = lerp(from.x, to.x, basePhase);
    const py = lerp(from.y, to.y, basePhase);

    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(px, py, 0, px, py, 6);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.4, color);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.restore();
  }
}

/** Draw dot-pattern grid (more professional than line grid) */
function drawDotGrid(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const step = 36;
  ctx.save();
  ctx.fillStyle = "rgba(148,163,184,0.06)";
  for (let x = step; x < W; x += step) {
    for (let y = step; y < H; y += step) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/* ═══════════════════════════════════════════════════
 * COMPONENT: PlaneMirrorSim
 * ═══════════════════════════════════════════════════ */
const PlaneMirrorSim: React.FC<{ id?: string; title?: string }> = ({
  id = "light-plane-mirror",
  title = "Plane Mirror — Laws of Reflection",
}) => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const isDragging   = useRef(false);

  const [lightPos, setLightPos] = useState<Point>({ x: 0.26, y: 0.32 });
  const [showVirtual, setShowVirtual] = useState(true);
  const [rayMode, setRayMode] = useState<RayMode>("single");
  const [dims, setDims] = useState({ w: 620, h: 400 });
  const [angles, setAngles] = useState({ i: 0, r: 0 });

  /* ── Responsive canvas size ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = Math.max(280, el.clientWidth || 620);
      setDims({ w, h: Math.round(w * 0.62) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── Coordinate helpers ── */
  const toNorm = useCallback((clientX: number, clientY: number): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return lightPos;
    const rect = canvas.getBoundingClientRect();
    const scaleX = dims.w / rect.width;
    const scaleY = dims.h / rect.height;
    return {
      x: Math.max(0.04, Math.min(0.44, ((clientX - rect.left) * scaleX) / dims.w)),
      y: Math.max(0.06, Math.min(0.94, ((clientY - rect.top)  * scaleY) / dims.h)),
    };
  }, [dims, lightPos]);

  /* ── Mouse events ── */
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    setLightPos(toNorm(e.clientX, e.clientY));
  }, [toNorm]);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setLightPos(toNorm(e.clientX, e.clientY));
  }, [toNorm]);
  const onMouseUp = useCallback(() => { isDragging.current = false; }, []);

  /* ── Touch events ── */
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    isDragging.current = true;
    setLightPos(toNorm(e.touches[0].clientX, e.touches[0].clientY));
  }, [toNorm]);
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDragging.current) return;
    setLightPos(toNorm(e.touches[0].clientX, e.touches[0].clientY));
  }, [toNorm]);

  /* ══════════════════════════════════════════
   * ANIMATION LOOP
   * ══════════════════════════════════════════ */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let running = true;

    function draw(time: number) {
      if (!running) return;
      rafRef.current = requestAnimationFrame(draw);
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = dims.w;
      const H = dims.h;
      const dpr = window.devicePixelRatio || 1;

      /* ── HiDPI scaling ── */
      if (canvas.width  !== Math.round(W * dpr)) canvas.width  = Math.round(W * dpr);
      if (canvas.height !== Math.round(H * dpr)) canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* ── Background: deep navy with radial ambient glow ── */
      const bgGrad = ctx.createRadialGradient(W * 0.35, H * 0.5, 0, W * 0.35, H * 0.5, W * 0.7);
      bgGrad.addColorStop(0, "#0d1829");
      bgGrad.addColorStop(1, "#070d18");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      /* ── Dot grid ── */
      drawDotGrid(ctx, W, H);

      /* ── Layout constants ── */
      const mirrorX  = W * 0.58;
      const mirrorTop: Point = { x: mirrorX, y: H * 0.06 };
      const mirrorBot: Point = { x: mirrorX, y: H * 0.94 };
      const srcX = lightPos.x * W;
      const srcY = lightPos.y * H;

      /* ── Mirror ── */
      /* Main reflective surface with gradient */
      const mGrad = ctx.createLinearGradient(mirrorX - 5, 0, mirrorX + 5, 0);
      mGrad.addColorStop(0, "rgba(148,163,184,0.4)");
      mGrad.addColorStop(0.5, "rgba(226,232,240,0.95)");
      mGrad.addColorStop(1, "rgba(148,163,184,0.4)");
      ctx.save();
      ctx.strokeStyle = mGrad as unknown as string;
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.shadowColor = "#cbd5e1";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(mirrorX, mirrorTop.y);
      ctx.lineTo(mirrorX, mirrorBot.y);
      ctx.stroke();
      ctx.restore();

      /* Mirror hatching (shows it's a physical reflective surface) */
      ctx.save();
      ctx.strokeStyle = "rgba(148,163,184,0.18)";
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      for (let y = mirrorTop.y + 8; y < mirrorBot.y; y += 18) {
        ctx.beginPath();
        ctx.moveTo(mirrorX, y);
        ctx.lineTo(mirrorX + 12, y + 12);
        ctx.stroke();
      }
      ctx.restore();

      /* Mirror label */
      labelText(ctx, "Plane Mirror", mirrorX + 20, H * 0.09, "rgba(148,163,184,0.7)", 11, true);

      /* ── Hit point (center of mirror) ── */
      const hit: Point = { x: mirrorX, y: H * 0.50 };

      /* Geometry for reflection */
      const dx = hit.x - srcX;
      const dy = hit.y - srcY;
      const incLen = Math.hypot(dx, dy);
      const angleI = Math.atan2(Math.abs(dy), Math.abs(dx));

      /* ── Reflected ray direction (vertical mirror normal = horizontal) ── */
      /* Unit reflected vector: x-component flips, y stays */
      const reflUX = -dx / incLen;
      const reflUY =  dy / incLen;
      const reflLen = W * 0.38;
      const reflEnd: Point = {
        x: hit.x + reflLen * reflUX,
        y: hit.y + reflLen * reflUY,
      };

      /* Update angle display */
      const angleDeg = parseFloat(deg(angleI));
      setAngles({ i: angleDeg, r: angleDeg });

      /* ═══════════════════════════════
       * DRAW RAYS BASED ON MODE
       * ═══════════════════════════════ */
      if (rayMode === "single") {
        /* ── Normal line (dashed) ── */
        const normalLen = W * 0.13;
        dashedLine(ctx,
          { x: hit.x - normalLen, y: hit.y },
          { x: hit.x + normalLen, y: hit.y },
          "#94a3b8", 1.5
        );
        labelText(ctx, "N", hit.x + normalLen + 12, hit.y, "#64748b", 11);

        /* ── Incident ray (amber) ── */
        glowBeam(ctx, { x: srcX, y: srcY }, hit, "#fbbf24");
        arrowHead(ctx, { x: srcX, y: srcY }, hit, "#fbbf24");

        /* ── Reflected ray (emerald green) ── */
        glowBeam(ctx, hit, reflEnd, "#10b981");
        arrowHead(ctx, hit, reflEnd, "#10b981");

        /* ── Photon particles on incident ray ── */
        drawPhotons(ctx, { x: srcX, y: srcY }, hit, time, "#fbbf24", 4, 0.00018);

        /* ── Photon particles on reflected ray ── */
        drawPhotons(ctx, hit, reflEnd, time, "#10b981", 4, 0.00018);

        /* ── Angle arcs ── */
        const arcR = 42;
        const iSign = srcY < hit.y ? 1 : -1;

        /* Incident angle arc (amber) */
        ctx.save();
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = 6;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(hit.x, hit.y, arcR, Math.PI, Math.PI + iSign * angleI, iSign < 0);
        ctx.stroke();
        ctx.restore();
        labelText(ctx, `∠i = ${deg(angleI)}°`, hit.x - arcR - 32, hit.y + iSign * (arcR * 0.6),
          "#fde68a", 12, true);

        /* Reflected angle arc (green) */
        ctx.save();
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = 6;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(hit.x, hit.y, arcR + 8, 0, iSign * angleI, iSign < 0);
        ctx.stroke();
        ctx.restore();
        labelText(ctx, `∠r = ${deg(angleI)}°`, hit.x + arcR + 32, hit.y + iSign * (arcR * 0.6),
          "#6ee7b7", 12, true);

        /* ── Virtual image ── */
        if (showVirtual) {
          const virtX = mirrorX + (mirrorX - srcX);
          const virtY = srcY;
          dashedLine(ctx, hit, { x: virtX, y: virtY }, "rgba(167,139,250,0.6)", 1.5);
          /* Virtual source dot */
          ctx.save();
          ctx.beginPath();
          ctx.arc(virtX, virtY, 8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(167,139,250,0.2)";
          ctx.strokeStyle = "rgba(167,139,250,0.6)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
          labelText(ctx, "Virtual Image", virtX, virtY - 22, "rgba(196,181,253,0.85)", 11, true);
        }

      } else if (rayMode === "fan") {
        /* ── Fan of 5 rays from same source ── */
        const fanAngles = [-30, -15, 0, 15, 30];
        fanAngles.forEach((offsetDeg, fi) => {
          const offsetRad = (offsetDeg * Math.PI) / 180;
          /* Compute ray direction from srcX,srcY to a mirror hit at different y positions */
          const fanHitY = hit.y + Math.tan(offsetRad + Math.atan2(dy, dx) - Math.atan2(Math.abs(dy), Math.abs(dx)) * Math.sign(dy)) * 0 + (fi - 2) * H * 0.12;
          const fanHit: Point = { x: mirrorX, y: Math.max(mirrorTop.y + 5, Math.min(mirrorBot.y - 5, fanHitY)) };
          const fdx = fanHit.x - srcX;
          const fdy = fanHit.y - srcY;
          const flen = Math.hypot(fdx, fdy);
          const fanReflUX = -fdx / flen;
          const fanReflUY =  fdy / flen;
          const fanReflEnd: Point = { x: fanHit.x + reflLen * fanReflUX, y: fanHit.y + reflLen * fanReflUY };

          /* Draw with reduced alpha for outer rays */
          const rayAlpha = fi === 2 ? 1.0 : 0.55;
          ctx.save();
          ctx.globalAlpha = rayAlpha;
          glowBeam(ctx, { x: srcX, y: srcY }, fanHit, "#fbbf24", rayAlpha);
          glowBeam(ctx, fanHit, fanReflEnd, "#10b981", rayAlpha);
          arrowHead(ctx, { x: srcX, y: srcY }, fanHit, "#fbbf24");
          arrowHead(ctx, fanHit, fanReflEnd, "#10b981");
          ctx.restore();
        });

        /* Single photon on center ray */
        drawPhotons(ctx, { x: srcX, y: srcY }, hit, time, "#fbbf24", 3, 0.0002);
        drawPhotons(ctx, hit, reflEnd, time, "#10b981", 3, 0.0002);

      } else {
        /* ── Parallel rays (useful for showing concave convergence concept) ── */
        const numParallel = 5;
        const spacing = H * 0.14;
        const direction = { x: 1, y: 0 }; /* parallel to principal axis */

        for (let pi = 0; pi < numParallel; pi++) {
          const ry = hit.y + (pi - Math.floor(numParallel / 2)) * spacing;
          const pHit: Point = { x: mirrorX, y: Math.max(mirrorTop.y + 5, Math.min(mirrorBot.y - 5, ry)) };
          const parStart: Point = { x: 0, y: ry };

          /* Incident ray */
          const rayAlpha = pi === Math.floor(numParallel / 2) ? 1.0 : 0.5;
          ctx.save();
          ctx.globalAlpha = rayAlpha;
          glowBeam(ctx, parStart, pHit, "#fbbf24", rayAlpha);
          arrowHead(ctx, parStart, pHit, "#fbbf24");
          /* Reflect parallel ray off vertical mirror (reflections are all horizontal back) */
          const parRefl: Point = { x: pHit.x - reflLen, y: ry };
          glowBeam(ctx, pHit, parRefl, "#10b981", rayAlpha);
          arrowHead(ctx, pHit, parRefl, "#10b981");
          ctx.restore();
        }
      }

      /* ── Sparkle at hit point ── */
      drawSparkle(ctx, hit.x, hit.y, time);

      /* ── Wave rings from light source ── */
      drawWaveRings(ctx, srcX, srcY, time, "#fbbf24");

      /* ── Light source bulb ── */
      ctx.save();
      const srcGrad = ctx.createRadialGradient(srcX, srcY, 0, srcX, srcY, 18);
      srcGrad.addColorStop(0, "#ffffff");
      srcGrad.addColorStop(0.3, "#fef3c7");
      srcGrad.addColorStop(0.7, "#fbbf24");
      srcGrad.addColorStop(1, "rgba(251,191,36,0)");
      ctx.fillStyle = srcGrad;
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(srcX, srcY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      /* Drag hint label */
      labelText(ctx, "💡 Drag me", srcX, srcY - 22, "#fde68a", 11, true);

      /* ── Legend ── */
      const ly = H - 20;
      ctx.save();
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(12, ly - 4, 20, 3);
      ctx.restore();
      labelText(ctx, "Incident", 68, ly, "#fde68a", 10);
      ctx.save();
      ctx.fillStyle = "#10b981"; ctx.fillRect(118, ly - 4, 20, 3);
      ctx.restore();
      labelText(ctx, "Reflected", 178, ly, "#6ee7b7", 10);
      if (showVirtual && rayMode === "single") {
        ctx.save();
        ctx.strokeStyle = "rgba(167,139,250,0.7)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(226, ly - 3);
        ctx.lineTo(246, ly - 3);
        ctx.stroke();
        ctx.restore();
        labelText(ctx, "Virtual", 280, ly, "rgba(196,181,253,0.8)", 10);
      }
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [dims, lightPos, showVirtual, rayMode]);

  /* ═══════════════════════════════════════════════════
   * RENDER
   * ═══════════════════════════════════════════════════ */
  return (
    <div className={styles.simCard}>
      {/* ── Header ── */}
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>🪞</div>
        <span className={styles.simTitle}>{title}</span>
        <span className={styles.simBadge}>INTERACTIVE</span>
      </div>

      {/* ── Canvas ── */}
      <div
        ref={containerRef}
        className={styles.canvasWrap}
        style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "auto", display: "block", touchAction: "none" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onMouseUp}
        />
      </div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        {/* Ray mode selector */}
        <div className={styles.btnGroup}>
          <button
            className={`${styles.toggleBtn} ${rayMode === "single" ? styles.active : ""}`}
            onClick={() => setRayMode("single")}
          >
            Single Ray
          </button>
          <button
            className={`${styles.toggleBtn} ${rayMode === "fan" ? styles.active : ""}`}
            onClick={() => setRayMode("fan")}
          >
            Fan of Rays
          </button>
          <button
            className={`${styles.toggleBtn} ${rayMode === "parallel" ? styles.active : ""}`}
            onClick={() => setRayMode("parallel")}
          >
            Parallel Rays
          </button>
        </div>

        {/* Virtual image toggle */}
        {rayMode === "single" && (
          <button
            className={`${styles.toggleBtn} ${showVirtual ? styles.active : ""}`}
            onClick={() => setShowVirtual(v => !v)}
          >
            Virtual Image
          </button>
        )}
      </div>

      {/* ── Info panel: live angles + laws ── */}
      <div className={styles.infoRow}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>∠ Incidence</span>
          <span className={styles.infoValue} style={{ color: "#fbbf24" }}>
            {angles.i.toFixed(1)}°
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>∠ Reflection</span>
          <span className={styles.infoValue} style={{ color: "#10b981" }}>
            {angles.r.toFixed(1)}°
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Law Verified</span>
          <span className={styles.infoValue} style={{ color: "#818cf8" }}>
            ∠i = ∠r ✓
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Mode</span>
          <span className={styles.infoValue} style={{ color: "#60a5fa", fontSize: "11px" }}>
            {rayMode === "single" ? "Single Ray" : rayMode === "fan" ? "Fan of Rays" : "Parallel Rays"}
          </span>
        </div>
      </div>

      {/* ── Physics laws ── */}
      <div className={styles.formula}>
        <span className={styles.formulaLabel}>Laws of Reflection</span>
        <span className={styles.formulaExpr}>∠i = ∠r &nbsp;|&nbsp; Incident ray, Normal & Reflected ray are coplanar</span>
      </div>
    </div>
  );
};

export default PlaneMirrorSim;
