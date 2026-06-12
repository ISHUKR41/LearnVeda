"use client";
/**
 * FILE: LightTopic8Simulations.tsx
 * LOCATION: src/components/simulations/LightTopic8Simulations.tsx
 * PURPOSE: 5 fully interactive, animated Canvas-based physics simulations for
 *          Class 10 Light — Topic 8: Dispersion of Light, Scattering & the Human Eye.
 *
 * SIMULATIONS (each is a named export):
 *   1. Sim_light_prism_dispersion_adv  — Drag prism angle → VIBGYOR splits apart
 *   2. Sim_light_rainbow_droplet       — Animated water droplet rainbow cross-section
 *   3. Sim_light_rayleigh_sky          — Drag sun position → sky colour changes
 *   4. Sim_light_eye_anatomy           — Interactive human eye cross-section with labels
 *   5. Sim_light_vision_defect_fix     — Switch myopia/hyperopia → see lens correction
 *
 * DESIGN SYSTEM:
 *   - Background: #050c18 → #0a1628 dark gradient (VidyaBolt palette)
 *   - White light: #ffffff glow, dispersed: full spectrum colours
 *   - Labels: amber #fbbf24, axis: #334155
 *
 * PHYSICS:
 *   - Dispersion: each colour has a slightly different refractive index (Cauchy's eq.)
 *   - Rainbow: primary arc at 42°, secondary at 51°
 *   - Rayleigh: scatter intensity ∝ 1/λ⁴ — blue scatters most
 *   - Human eye: cornea + lens + retina focus chain
 *
 * LAST UPDATED: 2026-06-08
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────
 * Shared canvas helpers (same as LightTopic7Simulations)
 * ───────────────────────────────────────────────────────────── */

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

function drawBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#050c18");
  g.addColorStop(1, "#0a1628");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(99,102,241,0.03)";
  for (let x = 0; x <= W; x += 36)
    for (let y = 0; y <= H; y += 36) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
}

function txt(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color = "#e2e8f0",
  size = 11,
  bold = false,
  align: CanvasTextAlign = "left",
) {
  ctx.save();
  ctx.font = `${bold ? "bold " : ""}${size}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function ray(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  color = "#ffffff",
  width = 2,
  glow = 10,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.shadowColor = color;
  ctx.shadowBlur = glow;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

/* VIBGYOR spectrum colours with approximate Cauchy refractive indices (glass) */
const SPECTRUM = [
  { name: "V", wavelengthNm: 400, color: "#7c3aed", n: 1.532 },
  { name: "I", wavelengthNm: 430, color: "#6d28d9", n: 1.528 },
  { name: "B", wavelengthNm: 470, color: "#2563eb", n: 1.524 },
  { name: "G", wavelengthNm: 530, color: "#16a34a", n: 1.520 },
  { name: "Y", wavelengthNm: 580, color: "#ca8a04", n: 1.517 },
  { name: "O", wavelengthNm: 610, color: "#ea580c", n: 1.515 },
  { name: "R", wavelengthNm: 650, color: "#dc2626", n: 1.513 },
];

/* ═══════════════════════════════════════════════════════════════
 * SIMULATION 1 — Prism Dispersion (Advanced)
 * Drag the apex angle slider. White light enters and VIBGYOR
 * fans out, each colour bent differently by the prism.
 * ═══════════════════════════════════════════════════════════════ */
export function Sim_light_prism_dispersion_adv() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [apexAngle, setApexAngle] = useState(60); /* degrees */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;
    drawBg(ctx, W, H);

    const cx = W / 2 - 30;
    const cy = H / 2 + 20;
    const size = Math.min(W, H) * 0.32;
    const apexRad = (apexAngle * Math.PI) / 180;

    /* ── Prism triangle ── */
    const tip: [number, number] = [cx, cy - size * 0.8];
    const bl: [number, number] = [cx - size * Math.cos(Math.PI / 6), cy + size * 0.4];
    const br: [number, number] = [cx + size * Math.cos(Math.PI / 6), cy + size * 0.4];

    const prismGrad = ctx.createLinearGradient(bl[0], bl[1], br[0], br[1]);
    prismGrad.addColorStop(0, "rgba(147,197,253,0.12)");
    prismGrad.addColorStop(0.5, "rgba(99,102,241,0.08)");
    prismGrad.addColorStop(1, "rgba(147,197,253,0.06)");

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(tip[0], tip[1]);
    ctx.lineTo(bl[0], bl[1]);
    ctx.lineTo(br[0], br[1]);
    ctx.closePath();
    ctx.fillStyle = prismGrad;
    ctx.fill();
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "#60a5fa";
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.restore();

    /* Apex angle label */
    txt(ctx, `${apexAngle}°`, tip[0] - 8, tip[1] - 10, "#fbbf24", 12, true);

    /* ── Incident white ray ── */
    const incAngleDeg = 40;
    const incAngleRad = (incAngleDeg * Math.PI) / 180;
    /* Entry point on left face */
    const entX = (tip[0] + bl[0]) / 2 - 5;
    const entY = (tip[1] + bl[1]) / 2 + 10;

    ray(ctx, entX - 80 * Math.cos(incAngleRad), entY - 80 * Math.sin(incAngleRad) * 0.5, entX, entY, "#ffffff", 2.5, 14);

    /* ── Dispersed rays (each colour exits at a slightly different angle) ── */
    SPECTRUM.forEach((spec, i) => {
      /* Simplified exit angle calculation:
         Using Snell's law at entry, propagation, and exit from prism. */
      const n = spec.n;
      /* Refraction at first surface */
      const sinIn = Math.sin(incAngleRad);
      const sinRef1 = sinIn / n;
      if (sinRef1 > 1) return;
      const ref1 = Math.asin(sinRef1);

      /* Angle of incidence at second surface */
      const apexHalf = apexRad / 2;
      const ang2 = apexHalf - ref1;
      const sinOut = n * Math.sin(ang2);
      if (Math.abs(sinOut) > 1) return;
      const exitAngle = Math.asin(sinOut);

      /* Fan out exit direction */
      const fanAngle = exitAngle + Math.PI / 4 + (i - 3) * 0.03;

      const exitX = (tip[0] + br[0]) / 2 + 5;
      const exitY = (tip[1] + br[1]) / 2 + 5 + i * 2;

      ray(ctx, entX, entY, exitX, exitY, spec.color + "88", 1.5, 6);
      ray(ctx, exitX, exitY, exitX + 90 * Math.cos(fanAngle), exitY - 90 * Math.sin(fanAngle - Math.PI / 6), spec.color, 2, 10);
      txt(ctx, spec.name, exitX + 95 * Math.cos(fanAngle) + 2, exitY - 95 * Math.sin(fanAngle - Math.PI / 6), spec.color, 11, true);
    });

    txt(ctx, "White Light Dispersion Through Prism", W / 2, 22, "#94a3b8", 12, false, "center");
    txt(ctx, "White", entX - 85, entY - 20, "#e2e8f0", 11);
    txt(ctx, "light →", entX - 85, entY - 6, "#e2e8f0", 11);
    txt(ctx, "VIBGYOR", W - 80, H - 20, "#94a3b8", 11);
  }, [apexAngle]);

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 340, borderRadius: 14, display: "block", border: "1px solid #1e293b" }}
      />
      <div style={{ marginTop: 12, padding: "0 4px" }}>
        <label style={{ color: "#94a3b8", fontSize: 13, display: "flex", justifyContent: "space-between" }}>
          <span>Prism Apex Angle</span>
          <strong style={{ color: "#fbbf24" }}>{apexAngle}°</strong>
        </label>
        <input
          type="range" min={30} max={80} step={1} value={apexAngle}
          onChange={(e) => setApexAngle(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#fbbf24" }}
        />
        <p style={{ fontSize: 12, color: "#64748b", margin: "8px 0 0" }}>
          🌈 Newton proved white light is a mixture of 7 colours. Each colour has a slightly different speed in glass, so each bends by a slightly different amount — creating the spectrum.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * SIMULATION 2 — Rainbow Formation in a Water Droplet
 * Shows how a single spherical droplet disperses sunlight:
 * two refractions + one internal reflection → primary rainbow at ~42°
 * ═══════════════════════════════════════════════════════════════ */
export function Sim_light_rainbow_droplet() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const tRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const result = setupCanvas(canvas);
      if (!result) return;
      const [ctx, W, H] = result;
      tRef.current += 0.012;
      const t = tRef.current;

      drawBg(ctx, W, H);

      const cx = W * 0.45;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.22;

      /* ── Water droplet ── */
      const dropGrad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 0, cx, cy, R);
      dropGrad.addColorStop(0, "rgba(147,197,253,0.25)");
      dropGrad.addColorStop(0.6, "rgba(59,130,246,0.12)");
      dropGrad.addColorStop(1, "rgba(37,99,235,0.04)");
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = dropGrad;
      ctx.fill();
      ctx.strokeStyle = "#60a5fa50";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      txt(ctx, "Water droplet  n = 1.33", cx, cy + R + 14, "#64748b", 10, false, "center");

      /* ── Animate through VIBGYOR rays ── */
      SPECTRUM.forEach((spec, si) => {
        /* Entry angle for each colour ray */
        const entryY = cy - R * 0.4 + (si - 3) * (R * 0.15);
        const entX = cx - R - 10;

        /* Refraction at first surface */
        const n = spec.n / 1.0; /* air → water */
        const nWater = 1.33 + (spec.n - 1.52) * 0.3;
        const incRay = Math.PI; /* horizontal left to right */
        const sinRef = (1.0 / nWater) * Math.sin(Math.PI / 2 - Math.acos((entryY - cy) / R));
        const refAngle = Math.asin(Math.min(1, Math.abs(sinRef)));

        const alpha = 0.7 + 0.3 * Math.sin(t + si);

        /* Draw simplified three-segment path: enter → bounce → exit */
        /* Entry point on left side of droplet */
        const epX = cx - R;
        const epY = entryY;

        /* Internal bounce point at back of droplet */
        const bpX = cx + R * 0.85;
        const bpY = cy + (entryY - cy) * 0.1;

        /* Exit point — downward at rainbow angle ≈ 42° */
        const exitAngle = (42 + si * 0.8) * Math.PI / 180;
        const exX = cx + R * Math.cos(Math.PI + exitAngle);
        const exY = cy + R * Math.sin(Math.PI + exitAngle);

        ctx.save();
        ctx.globalAlpha = alpha * 0.85;
        ctx.strokeStyle = spec.color;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = spec.color;
        ctx.shadowBlur = 8;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(epX - 40, epY);
        ctx.lineTo(epX, epY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(epX, epY);
        ctx.lineTo(bpX, bpY);
        ctx.lineTo(exX, exY);
        ctx.stroke();
        /* Exit ray going out to right */
        ctx.beginPath();
        ctx.moveTo(exX, exY);
        ctx.lineTo(exX - 50 * Math.cos(exitAngle - Math.PI), exY - 50 * Math.sin(exitAngle - Math.PI));
        ctx.stroke();
        ctx.restore();
      });

      /* ── Rainbow arc on right side ── */
      const arcCx = W * 0.88;
      const arcCy = H * 0.65;
      for (let si = 0; si < SPECTRUM.length; si++) {
        const spec = SPECTRUM[si];
        const arcR = H * 0.1 + si * 8;
        ctx.save();
        ctx.strokeStyle = spec.color;
        ctx.lineWidth = 5;
        ctx.shadowColor = spec.color;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.arc(arcCx, arcCy, arcR, Math.PI * 0.7, Math.PI * 1.4);
        ctx.stroke();
        ctx.restore();
      }
      txt(ctx, "Primary", arcCx - 28, arcCy - H * 0.1 - SPECTRUM.length * 8 - 10, "#94a3b8", 10);
      txt(ctx, "Rainbow", arcCx - 28, arcCy - H * 0.1 - SPECTRUM.length * 8 + 2, "#94a3b8", 10);
      txt(ctx, "≈ 42°", arcCx - 18, arcCy + 14, "#fbbf24", 10, true);

      /* Sunlight arrows */
      for (let i = 0; i < 4; i++) {
        const sy = H * 0.2 + i * H * 0.15;
        ray(ctx, 20, sy, cx - R - 14, sy, "#fbbf24", 1.5, 8);
      }
      txt(ctx, "☀ Sunlight", 22, H * 0.15, "#fbbf24", 11, true);

      txt(ctx, "Rainbow Formation — Water Droplet Cross-Section", W / 2, 22, "#94a3b8", 12, false, "center");

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 340, borderRadius: 14, display: "block", border: "1px solid #1e293b" }}
      />
      <p style={{ fontSize: 12, color: "#64748b", marginTop: 10, fontFamily: "Inter, system-ui, sans-serif" }}>
        🌈 Inside each water droplet: sunlight is refracted in, reflected off the back, then refracted out. Each colour exits at a slightly different angle — red at ~42°, violet at ~40° — producing the arc of colours we see as a rainbow.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * SIMULATION 3 — Rayleigh Scattering & Sky Colour
 * Drag the sun position from horizon to zenith. The sky colour
 * shifts from deep orange (sunrise/sunset) to vivid blue (midday).
 * Rayleigh scattering intensity ∝ 1/λ⁴ — blue scatters much more.
 * ═══════════════════════════════════════════════════════════════ */
export function Sim_light_rayleigh_sky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sunHeight, setSunHeight] = useState(50); /* 0 = horizon, 100 = zenith */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;

    /* ── Sky gradient — shifts from orange (low sun) to blue (high sun) ── */
    const blueAmt = sunHeight / 100;
    const horizonR = Math.round(180 * (1 - blueAmt) + 15 * blueAmt);
    const horizonG = Math.round(100 * (1 - blueAmt) + 60 * blueAmt);
    const horizonB = Math.round(30 * (1 - blueAmt) + 160 * blueAmt);
    const zenithR = Math.round(220 * (1 - blueAmt) + 8 * blueAmt);
    const zenithG = Math.round(80 * (1 - blueAmt) + 40 * blueAmt);
    const zenithB = Math.round(20 * (1 - blueAmt) + 120 * blueAmt);

    const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.8);
    skyGrad.addColorStop(0, `rgb(${zenithR},${zenithG},${zenithB})`);
    skyGrad.addColorStop(1, `rgb(${horizonR},${horizonG},${horizonB})`);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H * 0.82);

    /* Ground */
    const groundGrad = ctx.createLinearGradient(0, H * 0.82, 0, H);
    groundGrad.addColorStop(0, "#1a2e0a");
    groundGrad.addColorStop(1, "#0d1a05");
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, H * 0.82, W, H * 0.18);

    /* ── Sun position ── */
    const sunX = W * 0.5;
    const sunY = H * 0.8 - (sunHeight / 100) * H * 0.72;
    const sunR = 22;
    const sunColor = sunHeight > 40
      ? `rgba(255,255,200,${0.85 + blueAmt * 0.15})`
      : `rgba(255,180,50,0.9)`;

    /* Glow */
    const glowR = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 3);
    glowR.addColorStop(0, sunColor);
    glowR.addColorStop(0.5, sunHeight > 40 ? "rgba(255,255,180,0.3)" : "rgba(255,140,30,0.35)");
    glowR.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save();
    ctx.fillStyle = glowR;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = sunColor;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* ── Scattering dots ── */
    /* Show more blue dots at high sun angle (more scattering of blue) */
    const numBlue = Math.round(blueAmt * 60 + 10);
    const numRed = Math.round((1 - blueAmt) * 30 + 5);
    const rng = (seed: number) => {
      /* Deterministic pseudo-random from seed */
      let s = Math.sin(seed * 127.1) * 43758.5453;
      return s - Math.floor(s);
    };
    for (let i = 0; i < numBlue; i++) {
      const sx = rng(i * 3.1 + 1) * W;
      const sy = rng(i * 3.1 + 2) * H * 0.75;
      const alpha = rng(i * 3.1 + 3) * 0.5 + 0.2;
      ctx.save();
      ctx.fillStyle = `rgba(120,180,255,${alpha * blueAmt})`;
      ctx.shadowColor = "rgba(100,160,255,0.4)";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    for (let i = 0; i < numRed; i++) {
      const sx = rng(i * 7.3 + 10) * W;
      const sy = (0.5 + rng(i * 7.3 + 11) * 0.45) * H;
      const alpha = rng(i * 7.3 + 12) * 0.5 + 0.15;
      ctx.save();
      ctx.fillStyle = `rgba(255,160,60,${alpha * (1 - blueAmt)})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    /* ── Wavelength scattering bar ── */
    const barX = W - 110; const barY = 30; const barW = 80; const barH = 16;
    SPECTRUM.forEach((s, i) => {
      const x = barX + (i / SPECTRUM.length) * barW;
      const w2 = barW / SPECTRUM.length + 1;
      const scatter = 1 / Math.pow(s.wavelengthNm / 400, 4);
      ctx.save();
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.min(1, scatter * 0.7);
      ctx.fillRect(x, barY, w2, barH);
      ctx.restore();
    });
    txt(ctx, "V", barX, barY + barH + 12, "#7c3aed", 9);
    txt(ctx, "R", barX + barW - 4, barY + barH + 12, "#dc2626", 9);
    txt(ctx, "Scattering →", barX, barY - 4, "#64748b", 9);

    /* ── Labels ── */
    ctx.save();
    ctx.fillStyle = sunHeight > 40 ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.7)";
    ctx.font = "bold 12px Inter, system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`Sun elevation: ${sunHeight}°`, W / 2, sunY - sunR - 10);
    ctx.restore();

    txt(ctx, "Rayleigh Scattering — Why the Sky Changes Colour", W / 2, H - 8, "#94a3b8", 11, false, "center");
  }, [sunHeight]);

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 320, borderRadius: 14, display: "block", overflow: "hidden" }}
      />
      <div style={{ marginTop: 12, padding: "0 4px" }}>
        <label style={{ color: "#94a3b8", fontSize: 13, display: "flex", justifyContent: "space-between" }}>
          <span>Sun Elevation</span>
          <strong style={{ color: "#fbbf24" }}>
            {sunHeight < 10 ? "🌅 Sunrise/Sunset" : sunHeight < 50 ? "☀ Morning/Evening" : "🌞 Midday"}
          </strong>
        </label>
        <input
          type="range" min={0} max={90} step={1} value={sunHeight}
          onChange={(e) => setSunHeight(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#fbbf24" }}
        />
        <p style={{ fontSize: 12, color: "#64748b", margin: "8px 0 0" }}>
          🔵 Blue light (short λ) scatters 9.4× more than red light (long λ). At midday the sky looks blue. At sunrise/sunset, light travels farther through air — most blue is scattered away, leaving red and orange.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * SIMULATION 4 — Human Eye Anatomy (Interactive Labels)
 * Shows a cross-section of the human eye with labelled parts.
 * Click any part to see its function.
 * ═══════════════════════════════════════════════════════════════ */
export function Sim_light_eye_anatomy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  /* Eye parts with positions relative to canvas */
  const EYE_PARTS = [
    { key: "cornea", label: "Cornea", color: "#7dd3fc", desc: "Transparent protective cover. Acts as the first and strongest lens — does about 70% of total focusing." },
    { key: "iris", label: "Iris", color: "#6366f1", desc: "Coloured part of the eye. Controls pupil size to regulate how much light enters." },
    { key: "pupil", label: "Pupil", color: "#0f172a", desc: "The dark opening in the iris. Dilates (opens wider) in dim light, contracts in bright light." },
    { key: "lens", label: "Crystalline Lens", color: "#a5f3fc", desc: "Adjustable convex lens made of protein fibres. The ciliary muscles change its shape to focus near and far objects (accommodation)." },
    { key: "retina", label: "Retina", color: "#f9a8d4", desc: "Light-sensitive screen at the back. Contains rod cells (dim light) and cone cells (colour vision). Real, inverted image forms here." },
    { key: "optic", label: "Optic Nerve", color: "#fde68a", desc: "Carries electrical signals from retina to the brain. The brain flips the inverted image so we see it correctly!" },
    { key: "vitreous", label: "Vitreous Humour", color: "#bfdbfe", desc: "Jelly-like fluid filling the eye. Maintains the eye's spherical shape and transmits light." },
    { key: "ciliary", label: "Ciliary Muscles", color: "#86efac", desc: "Ring of muscles attached to the lens. When they contract, the lens becomes thicker (fatter) for near vision. Relaxed → thin lens for far vision." },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;
    drawBg(ctx, W, H);

    const cx = W * 0.38;
    const cy = H * 0.5;
    const Rout = Math.min(W, H) * 0.3; /* outer eye radius */
    const Rin = Rout * 0.92;

    /* ── White sclera ── */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, Rout, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(241,245,249,0.15)";
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    /* ── Retina (inner pink layer) ── */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, Rin, 0, Math.PI * 2);
    ctx.strokeStyle = "#f9a8d4";
    ctx.lineWidth = 6;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.restore();

    /* ── Vitreous (inside fill) ── */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, Rin - 5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(191,219,254,0.06)";
    ctx.fill();
    ctx.restore();

    /* ── Cornea (front curved surface) ── */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx - Rout * 0.78, cy, Rout * 0.55, -Math.PI * 0.38, Math.PI * 0.38);
    ctx.strokeStyle = "#7dd3fc";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#7dd3fc";
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();

    /* ── Iris ── */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx - Rout * 0.52, cy, Rout * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(99,102,241,0.55)";
    ctx.fill();
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    /* ── Pupil ── */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx - Rout * 0.52, cy, Rout * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = "#030712";
    ctx.fill();
    ctx.restore();

    /* ── Crystalline Lens ── */
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx - Rout * 0.3, cy, Rout * 0.08, Rout * 0.22, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(165,243,252,0.4)";
    ctx.fill();
    ctx.strokeStyle = "#a5f3fc";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    /* ── Ciliary muscle rings ── */
    ctx.save();
    ctx.strokeStyle = "#86efac70";
    ctx.lineWidth = 3;
    [-1, 1].forEach(side => {
      ctx.beginPath();
      ctx.arc(cx - Rout * 0.3, cy + side * Rout * 0.27, Rout * 0.06, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();

    /* ── Optic nerve ── */
    ctx.save();
    ctx.strokeStyle = "#fde68a";
    ctx.lineWidth = 5;
    ctx.shadowColor = "#fde68a";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(cx + Rout * 0.78, cy);
    ctx.lineTo(cx + Rout * 1.05, cy);
    ctx.stroke();
    ctx.restore();

    /* ── Light ray path ── */
    ctx.save();
    ctx.strokeStyle = "#22d3ee70";
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 8;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(cx - Rout * 1.2, cy - Rout * 0.15);
    ctx.lineTo(cx - Rout * 0.8, cy - Rout * 0.05);
    ctx.lineTo(cx - Rout * 0.3, cy);
    ctx.lineTo(cx + Rin * 0.7, cy + Rin * 0.08);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    /* ── Label connectors ── */
    const labelPositions: Record<string, [number, number, number, number]> = {
      cornea:   [cx - Rout * 0.85, cy - Rout * 0.5,   W * 0.03, H * 0.12],
      iris:     [cx - Rout * 0.52, cy - Rout * 0.25,  W * 0.03, H * 0.3],
      pupil:    [cx - Rout * 0.52, cy,                 W * 0.03, H * 0.47],
      lens:     [cx - Rout * 0.3,  cy - Rout * 0.25,  W * 0.22, H * 0.1],
      retina:   [cx + Rout * 0.6,  cy - Rout * 0.5,   W * 0.72, H * 0.1],
      optic:    [cx + Rout * 0.95, cy,                 W * 0.72, H * 0.35],
      vitreous: [cx + Rout * 0.1,  cy + Rout * 0.4,   W * 0.62, H * 0.78],
      ciliary:  [cx - Rout * 0.3,  cy + Rout * 0.3,   W * 0.22, H * 0.78],
    };

    EYE_PARTS.forEach(({ key, label, color }) => {
      const [fromX, fromY, toX, toY] = labelPositions[key] || [cx, cy, W * 0.5, H * 0.5];
      ctx.save();
      ctx.strokeStyle = color + "60";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "bold 10px Inter, system-ui";
      ctx.fillStyle = color;
      ctx.textAlign = toX > W * 0.5 ? "right" : "left";
      ctx.fillText(label, toX + (toX > W * 0.5 ? -2 : 2), toY - 2);
      ctx.restore();
    });

    txt(ctx, "Human Eye — Cross Section", W / 2, 22, "#94a3b8", 12, false, "center");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 340, borderRadius: 14, display: "block", border: "1px solid #1e293b" }}
      />
      <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {EYE_PARTS.map(({ key, label, color, desc }) => (
          <button
            key={key}
            onClick={() => setActiveLabel(activeLabel === key ? null : key)}
            style={{
              background: activeLabel === key ? color + "20" : "rgba(15,23,42,0.6)",
              border: `1px solid ${color}50`,
              borderRadius: 8,
              color,
              padding: "4px 12px",
              fontSize: 11,
              cursor: "pointer",
              fontWeight: activeLabel === key ? 700 : 400,
              fontFamily: "Inter, system-ui",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {activeLabel && (
        <div style={{
          marginTop: 10,
          padding: "12px 14px",
          background: "rgba(15,23,42,0.8)",
          borderRadius: 10,
          border: "1px solid #1e293b",
          fontSize: 13,
          color: "#cbd5e1",
          lineHeight: 1.6,
        }}>
          <strong style={{ color: EYE_PARTS.find(p => p.key === activeLabel)?.color }}>
            {EYE_PARTS.find(p => p.key === activeLabel)?.label}:
          </strong>{" "}
          {EYE_PARTS.find(p => p.key === activeLabel)?.desc}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * SIMULATION 5 — Vision Defect Correction
 * Toggle between Normal, Myopia, and Hyperopia.
 * Shows where the image forms relative to the retina and
 * which corrective lens is needed.
 * ═══════════════════════════════════════════════════════════════ */
export function Sim_light_vision_defect_fix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"normal" | "myopia" | "hyperopia">("normal");
  const [corrected, setCorrected] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;
    drawBg(ctx, W, H);

    const eyeX = W * 0.55;
    const eyeY = H / 2;
    const eyeR = Math.min(W, H) * 0.22;

    /* Retina line */
    const retinaX = eyeX + eyeR * 0.85;

    /* ── Eye outline ── */
    ctx.save();
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    ctx.stroke();
    ctx.restore();

    /* ── Retina ── */
    ctx.save();
    ctx.strokeStyle = "#f9a8d4";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeR * 0.92, -Math.PI * 0.35, Math.PI * 0.35);
    ctx.stroke();
    ctx.restore();
    txt(ctx, "Retina", retinaX + 6, eyeY, "#f9a8d4", 10);

    /* ── Cornea ── */
    ctx.save();
    ctx.strokeStyle = "#7dd3fc";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(eyeX - eyeR * 0.78, eyeY, eyeR * 0.5, -Math.PI * 0.35, Math.PI * 0.35);
    ctx.stroke();
    ctx.restore();

    /* ── Lens ── */
    ctx.save();
    ctx.strokeStyle = "#a5f3fc";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(eyeX - eyeR * 0.3, eyeY, eyeR * 0.07, eyeR * 0.2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    /* Image focal point — depends on defect */
    let focalX: number;
    let focalColor: string;

    if (mode === "normal") {
      focalX = retinaX;
      focalColor = "#22d3ee";
    } else if (mode === "myopia") {
      /* Myopia: image forms in front of retina */
      focalX = corrected ? retinaX : retinaX - eyeR * 0.4;
      focalColor = corrected ? "#22d3ee" : "#ef4444";
    } else {
      /* Hyperopia: image forms behind retina */
      focalX = corrected ? retinaX : retinaX + eyeR * 0.45;
      focalColor = corrected ? "#22d3ee" : "#f59e0b";
    }

    /* Converging rays from object */
    const objX = eyeX - eyeR * 1.6;
    const rays3 = [-eyeR * 0.18, 0, eyeR * 0.18];
    rays3.forEach(offset => {
      ctx.save();
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#22d3ee";
      ctx.shadowBlur = 8;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.moveTo(objX, eyeY + offset * 2.5);
      ctx.lineTo(eyeX - eyeR * 0.55, eyeY + offset * 0.5);
      ctx.lineTo(focalX, eyeY);
      ctx.stroke();
      ctx.restore();
    });

    /* Corrective lens */
    if (corrected && mode !== "normal") {
      const lensX = eyeX - eyeR * 1.1;
      ctx.save();
      ctx.strokeStyle = mode === "myopia" ? "#ef4444" : "#f59e0b";
      ctx.lineWidth = 3;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 10;
      if (mode === "myopia") {
        /* Concave (diverging) for myopia */
        ctx.beginPath();
        ctx.moveTo(lensX - 6, eyeY - eyeR * 0.35);
        ctx.bezierCurveTo(lensX + 6, eyeY - eyeR * 0.1, lensX + 6, eyeY + eyeR * 0.1, lensX - 6, eyeY + eyeR * 0.35);
        ctx.stroke();
      } else {
        /* Convex (converging) for hyperopia */
        ctx.beginPath();
        ctx.moveTo(lensX + 6, eyeY - eyeR * 0.35);
        ctx.bezierCurveTo(lensX - 8, eyeY - eyeR * 0.1, lensX - 8, eyeY + eyeR * 0.1, lensX + 6, eyeY + eyeR * 0.35);
        ctx.stroke();
      }
      txt(ctx, mode === "myopia" ? "Concave\nlens" : "Convex\nlens", lensX - 30, eyeY - eyeR * 0.5, mode === "myopia" ? "#ef4444" : "#f59e0b", 10, true);
      ctx.restore();
    }

    /* Focal point marker */
    ctx.save();
    ctx.fillStyle = focalColor;
    ctx.shadowColor = focalColor;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(focalX, eyeY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* Status label */
    const statusText = mode === "normal"
      ? "Normal Vision — image on retina ✓"
      : mode === "myopia"
        ? corrected ? "Myopia corrected — image on retina ✓" : "Myopia — image in front of retina ✗"
        : corrected ? "Hyperopia corrected — image on retina ✓" : "Hyperopia — image behind retina ✗";

    txt(ctx, statusText, W / 2, H - 14, focalColor, 12, true, "center");
    txt(ctx, "Vision Defects & Correction", W / 2, 22, "#94a3b8", 12, false, "center");
  }, [mode, corrected]);

  const btnStyle = (active: boolean, c: string): React.CSSProperties => ({
    background: active ? c + "20" : "rgba(15,23,42,0.6)",
    border: `1px solid ${c}50`,
    borderRadius: 8,
    color: active ? c : "#64748b",
    padding: "6px 14px",
    fontSize: 12,
    cursor: "pointer",
    fontWeight: active ? 700 : 400,
    fontFamily: "Inter, system-ui",
  });

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 300, borderRadius: 14, display: "block", border: "1px solid #1e293b" }}
      />
      <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button style={btnStyle(mode === "normal", "#22d3ee")} onClick={() => { setMode("normal"); setCorrected(false); }}>Normal Eye</button>
        <button style={btnStyle(mode === "myopia", "#ef4444")} onClick={() => { setMode("myopia"); setCorrected(false); }}>Myopia (Short-sight)</button>
        <button style={btnStyle(mode === "hyperopia", "#f59e0b")} onClick={() => { setMode("hyperopia"); setCorrected(false); }}>Hyperopia (Long-sight)</button>
        {mode !== "normal" && (
          <button
            style={btnStyle(corrected, "#22d3ee")}
            onClick={() => setCorrected(!corrected)}
          >
            {corrected ? "✓ Corrected" : "Apply Correction"}
          </button>
        )}
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
        {mode === "myopia" && <span>👓 <strong style={{ color: "#ef4444" }}>Myopia</strong>: eyeball too long / lens too curved. Far objects blur. Corrected by a <em>concave (diverging) lens</em>.</span>}
        {mode === "hyperopia" && <span>🔍 <strong style={{ color: "#f59e0b" }}>Hyperopia</strong>: eyeball too short / lens too flat. Near objects blur. Corrected by a <em>convex (converging) lens</em>.</span>}
        {mode === "normal" && <span>✅ Normal eye — the lens correctly focuses all rays onto the retina. Clear vision at all distances.</span>}
      </div>
    </div>
  );
}
