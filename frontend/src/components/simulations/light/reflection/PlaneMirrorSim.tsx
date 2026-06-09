/**
 * FILE: PlaneMirrorSim.tsx
 * LOCATION: frontend/src/components/simulations/light/reflection/PlaneMirrorSim.tsx
 * PURPOSE: Fully interactive, animated plane mirror simulation.
 *
 * FEATURES:
 *   - Drag the light source anywhere on the left half of the canvas
 *   - Animated photon pulse traveling along the incident ray
 *   - Reflected ray computed via ∠i = ∠r
 *   - Normal line at point of incidence
 *   - Virtual image shown as dashed arrow behind the mirror
 *   - Live readout of ∠i and ∠r (always equal)
 *   - Toggle virtual image visibility
 *   - Responsive canvas that scales with container width
 *
 * PHYSICS: First & Second Laws of Reflection
 * LAST UPDATED: 2026-06-09
 */

"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import styles from "../SimulationEngine.module.css";

/* ─── Point type ─── */
interface Point { x: number; y: number; }

/* ─── helpers ─── */
function deg(rad: number) { return ((rad * 180) / Math.PI).toFixed(1); }
function dist(a: Point, b: Point) { return Math.hypot(b.x - a.x, b.y - a.y); }

/* ─── draw helpers ─── */
function ray(
  ctx: CanvasRenderingContext2D,
  a: Point, b: Point,
  color: string, width = 2.5,
  dashed = false, glow = true
) {
  ctx.save();
  if (glow) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  if (dashed) ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function arrowHead(ctx: CanvasRenderingContext2D, from: Point, to: Point, color: string) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const size = 10;
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - size * Math.cos(angle - 0.4), to.y - size * Math.sin(angle - 0.4));
  ctx.lineTo(to.x - size * Math.cos(angle + 0.4), to.y - size * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color = "#e2e8f0", size = 13) {
  ctx.save();
  ctx.font = `${size}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
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
  const timeRef      = useRef<number>(0);

  /* Normalized 0–1 position of the light source */
  const [lightPos, setLightPos] = useState<Point>({ x: 0.28, y: 0.35 });
  const [showVirtual, setShowVirtual] = useState(true);
  const [dims, setDims] = useState({ w: 600, h: 400 });
  const isDragging = useRef(false);

  /* Responsive canvas size */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth || 600;
      const h = Math.round(w * 0.62);
      setDims({ w, h });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── Mouse / Touch drag ── */
  const toNorm = useCallback((clientX: number, clientY: number): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return lightPos;
    const rect = canvas.getBoundingClientRect();
    const scaleX = dims.w / rect.width;
    const scaleY = dims.h / rect.height;
    return {
      x: Math.max(0.05, Math.min(0.44, ((clientX - rect.left) * scaleX) / dims.w)),
      y: Math.max(0.08, Math.min(0.92, ((clientY - rect.top)  * scaleY) / dims.h)),
    };
  }, [dims, lightPos]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    setLightPos(toNorm(e.clientX, e.clientY));
  }, [toNorm]);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setLightPos(toNorm(e.clientX, e.clientY));
  }, [toNorm]);
  const onMouseUp = useCallback(() => { isDragging.current = false; }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    isDragging.current = true;
    const t = e.touches[0];
    setLightPos(toNorm(t.clientX, t.clientY));
  }, [toNorm]);
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDragging.current) return;
    const t = e.touches[0];
    setLightPos(toNorm(t.clientX, t.clientY));
  }, [toNorm]);

  /* ── Animation loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function draw(time: number) {
      rafRef.current = requestAnimationFrame(draw);
      const dt = time - timeRef.current;
      timeRef.current = time;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = dims.w;
      const H = dims.h;
      const dpr = window.devicePixelRatio || 1;

      /* Set actual canvas resolution for HiDPI */
      if (canvas.width  !== Math.round(W * dpr)) canvas.width  = Math.round(W * dpr);
      if (canvas.height !== Math.round(H * dpr)) canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* ── Background ── */
      ctx.fillStyle = "#080f1f";
      ctx.fillRect(0, 0, W, H);

      /* Subtle grid */
      ctx.strokeStyle = "rgba(148,163,184,0.05)";
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x <= W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      /* ── Mirror (vertical) ── */
      const mirrorX = W * 0.56;
      const mirrorTop: Point    = { x: mirrorX, y: H * 0.07 };
      const mirrorBot: Point    = { x: mirrorX, y: H * 0.93 };

      /* Mirror gradient body */
      const mGrad = ctx.createLinearGradient(mirrorX - 6, 0, mirrorX + 6, 0);
      mGrad.addColorStop(0, "rgba(148,163,184,0.6)");
      mGrad.addColorStop(0.5, "rgba(209,213,219,0.95)");
      mGrad.addColorStop(1, "rgba(148,163,184,0.6)");
      ctx.save();
      ctx.strokeStyle = mGrad as unknown as string;
      ctx.lineWidth = 5;
      ctx.shadowColor = "#94a3b8";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(mirrorX, mirrorTop.y);
      ctx.lineTo(mirrorX, mirrorBot.y);
      ctx.stroke();
      ctx.restore();

      /* Mirror hatching (shows it's a reflective surface) */
      ctx.save();
      ctx.strokeStyle = "rgba(148,163,184,0.2)";
      ctx.lineWidth = 1;
      const hatchStep = 16;
      for (let y = mirrorTop.y; y < mirrorBot.y; y += hatchStep) {
        ctx.beginPath();
        ctx.moveTo(mirrorX, y);
        ctx.lineTo(mirrorX + 10, y + 10);
        ctx.stroke();
      }
      ctx.restore();

      /* ── Geometry ── */
      const srcX = lightPos.x * W;
      const srcY = lightPos.y * H;

      /* Hit point is fixed at the CENTER of the mirror.
       * This lets the user drag the source anywhere on the left
       * and see the angle of incidence change accordingly. */
      const hit: Point = { x: mirrorX, y: H * 0.50 };

      /* Incident ray vector: source → hit */
      const dx = hit.x - srcX;
      const dy = hit.y - srcY;
      const incLen = dist({ x: srcX, y: srcY }, hit);

      /* For a VERTICAL mirror, the normal is HORIZONTAL.
       * Angle of incidence = angle between incident ray and the horizontal normal.
       * i.e., angleI = atan2(|dy|, |dx|) measured from horizontal.  */
      const angleI = Math.atan2(Math.abs(dy), Math.abs(dx));

      /* Normal line (horizontal through hit point) */
      const normalLen = W * 0.14;
      ray(ctx,
        { x: hit.x - normalLen, y: hit.y },
        { x: hit.x + normalLen, y: hit.y },
        "rgba(148,163,184,0.5)", 1.5, true, false
      );
      label(ctx, "N", hit.x + normalLen + 10, hit.y, "#94a3b8", 12);
      /* Arrowheads on normal */
      ctx.save();
      ctx.fillStyle = "rgba(148,163,184,0.5)";
      ctx.beginPath();
      ctx.moveTo(hit.x - normalLen, hit.y);
      ctx.lineTo(hit.x - normalLen + 7, hit.y - 4);
      ctx.lineTo(hit.x - normalLen + 7, hit.y + 4);
      ctx.closePath(); ctx.fill();
      ctx.restore();

      /* Incident ray: source → hit */
      ray(ctx, { x: srcX, y: srcY }, hit, "#fbbf24", 2.5, false, true);
      arrowHead(ctx, { x: srcX, y: srcY }, hit, "#fbbf24");

      /* Reflected ray: reflect the incident vector about the horizontal normal.
       * For a vertical mirror: reflected direction = (−dx, dy) normalized.
       * i.e., the x-component flips sign, y-component stays the same. */
      const reflLen = W * 0.36;
      /* Unit vector of incident ray: (dx/len, dy/len)
       * Reflected unit vector across vertical mirror normal: (-dx/len, dy/len) */
      const reflUX = -dx / incLen;
      const reflUY =  dy / incLen;
      const reflEndX = hit.x + reflLen * reflUX;
      const reflEndY = hit.y + reflLen * reflUY;

      ray(ctx, hit, { x: reflEndX, y: reflEndY }, "#34d399", 2.5, false, true);
      arrowHead(ctx, hit, { x: reflEndX, y: reflEndY }, "#34d399");

      /* ── Animated photon on incident ray ── */
      const speed = 0.0002;
      const t = ((time * speed) % 1);
      const phX = srcX + (hit.x - srcX) * t;
      const phY = srcY + (hit.y - srcY) * t;
      ctx.save();
      ctx.beginPath();
      ctx.arc(phX, phY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#fde68a";
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.restore();

      /* ── Virtual image (behind mirror) ── */
      if (showVirtual) {
        const virtX = mirrorX + (mirrorX - srcX);
        const virtY = srcY;
        /* Dashed line from hit to virtual image source */
        ray(ctx, hit, { x: virtX, y: virtY }, "rgba(167,139,250,0.55)", 1.5, true, false);
        /* Virtual image arrow */
        ctx.save();
        ctx.strokeStyle = "rgba(167,139,250,0.7)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(virtX, virtY + 20);
        ctx.lineTo(virtX, virtY - 20);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
        label(ctx, "Virtual Image", virtX + 2, virtY - 32, "rgba(167,139,250,0.85)", 11);
      }

      /* ── Angle arcs ── */
      const arcR = 40;
      /* ∠i arc (from normal to incident ray, on left side) */
      const iAngleStart = Math.PI; /* Normal points left */
      const iAngleSign  = srcY < hit.y ? 1 : -1;
      ctx.save();
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(hit.x, hit.y, arcR,
        Math.PI,
        Math.PI + iAngleSign * angleI,
        iAngleSign < 0
      );
      ctx.stroke();
      ctx.restore();
      label(ctx, `∠i=${deg(angleI)}°`, hit.x - arcR - 18, hit.y + iAngleSign * (arcR * 0.55), "#fbbf24", 12);

      /* ∠r arc */
      ctx.save();
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(hit.x, hit.y, arcR + 6,
        0,
        iAngleSign * angleI,
        iAngleSign < 0
      );
      ctx.stroke();
      ctx.restore();
      label(ctx, `∠r=${deg(angleI)}°`, hit.x + arcR + 18, hit.y + iAngleSign * (arcR * 0.55), "#34d399", 12);

      /* ── Light source indicator ── */
      ctx.save();
      ctx.beginPath();
      ctx.arc(srcX, srcY, 10, 0, Math.PI * 2);
      const srcGrad = ctx.createRadialGradient(srcX, srcY, 0, srcX, srcY, 10);
      srcGrad.addColorStop(0, "#fef3c7");
      srcGrad.addColorStop(0.5, "#fbbf24");
      srcGrad.addColorStop(1, "rgba(251,191,36,0)");
      ctx.fillStyle = srcGrad;
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.restore();
      label(ctx, "💡 Drag me", srcX, srcY - 20, "#fde68a", 11);

      /* ── Mirror label ── */
      label(ctx, "Plane Mirror", mirrorX + 18, H * 0.1, "#94a3b8", 12);

      /* ── Key ── */
      const ky = H - 26;
      ctx.save();
      ctx.fillStyle = "rgba(251,191,36,0.8)"; ctx.beginPath(); ctx.rect(14, ky - 5, 20, 3); ctx.fill();
      ctx.restore();
      label(ctx, "Incident", 80, ky, "#fde68a", 11);
      ctx.save();
      ctx.fillStyle = "rgba(52,211,153,0.8)"; ctx.beginPath(); ctx.rect(130, ky - 5, 20, 3); ctx.fill();
      ctx.restore();
      label(ctx, "Reflected", 196, ky, "#6ee7b7", 11);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [dims, lightPos, showVirtual]);

  return (
    <div className={styles.simCard}>
      {/* Header */}
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>🪞</div>
        <span className={styles.simTitle}>{title}</span>
        <span className={styles.simBadge}>INTERACTIVE</span>
      </div>

      {/* Canvas */}
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

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.toggleBtn}
          style={{ background: showVirtual ? "rgba(167,139,250,0.2)" : undefined }}
          onClick={() => setShowVirtual(v => !v)}
        >
          {showVirtual ? "Hide" : "Show"} Virtual Image
        </button>
        <div className={styles.infoChip}>∠i = ∠r (Law of Reflection)</div>
      </div>

      {/* Info panel */}
      <div className={styles.infoPanel}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Law 1:</span>
          <span className={styles.infoValue}>Angle of incidence = Angle of reflection</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Law 2:</span>
          <span className={styles.infoValue}>Incident ray, reflected ray and normal are coplanar</span>
        </div>
      </div>
    </div>
  );
};

export default PlaneMirrorSim;
