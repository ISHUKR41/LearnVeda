/**
 * FILE: MatterSimulation.tsx
 * LOCATION: src/components/physics/MatterSimulation.tsx
 * PURPOSE: Professional interactive Canvas-based simulations for
 *          "Matter in Our Surroundings" — Class 9 Science Chapter 1.
 *          Six simulations per topic, covering all 5 subtopics.
 *
 *   Topic 1 (what-is-matter)       → ParticleShowcase, MassOccupiesSpace,
 *                                     BrownianMotion, AtomScale,
 *                                     MatterClassifier, DensityBar
 *   Topic 2 (states-of-matter)     → ThreeStatesPanel, KineticEnergy,
 *                                     CompressibilityDemo, ShapeVolume,
 *                                     InterparticleForce, DiffusionStates
 *   Topic 3 (change-of-state)      → HeatingCurve, MeltingProcess,
 *                                     VaporizationSim, Sublimation,
 *                                     LatentHeatGauge, CoolingCurve
 *   Topic 4 (evaporation)          → EvaporationMolecules, SurfaceAreaEffect,
 *                                     TempEvapRate, WindEffect,
 *                                     HumidityEffect, BoilingComparison
 *   Topic 5 (diffusion)            → DiffusionSim, ConcentrationGradient,
 *                                     FickLawViz, TempDiffusion,
 *                                     OsmosisMembrane, CrossDiffusion
 * DEPENDENCIES: React 18, TypeScript
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "./PhysicsSimulation.module.css";

/* ═══════════════════════════════════════════════════════════════════════════
 * SHARED UTILITIES
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Generate a random number between min and max */
const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Interpolate between two colours (hex strings) */
function lerpColor(a: string, b: string, t: number): string {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl2 = Math.round(ab + (bb - ab) * t);
  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${bl2.toString(16).padStart(2,"0")}`;
}

/** Draw a rounded rectangle */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ═══════════════════════════════════════════════════════════════════════════
 * TOPIC 1 — WHAT IS MATTER?
 * Simulation 1: BrownianMotion
 * Shows 50 tiny particles in constant random motion around a large "pollen"
 * particle, demonstrating that matter is made of constantly moving particles.
 * ═══════════════════════════════════════════════════════════════════════════ */
function BrownianMotion({ running, speed }: { running: boolean; speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const stateRef  = useRef({
    pollen: { x: 300, y: 175, vx: 0, vy: 0 },
    particles: Array.from({ length: 60 }, () => ({
      x: rand(20, 580), y: rand(20, 330),
      vx: rand(-1.5, 1.5), vy: rand(-1.5, 1.5),
      r: rand(2.5, 4.5),
      color: `hsl(${rand(180, 240)},70%,65%)`,
    })),
    t: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const S = stateRef.current;

    const tick = () => {
      if (running) {
        S.t += 0.016 * speed;
        /* Move small particles */
        for (const p of S.particles) {
          p.vx += rand(-0.4, 0.4) * speed;
          p.vy += rand(-0.4, 0.4) * speed;
          const spd = Math.hypot(p.vx, p.vy);
          if (spd > 2.5 * speed) { p.vx *= 0.8; p.vy *= 0.8; }
          p.x = Math.max(p.r, Math.min(W - p.r, p.x + p.vx));
          p.y = Math.max(p.r, Math.min(H - 40 - p.r, p.y + p.vy));
          if (p.x <= p.r || p.x >= W - p.r)  p.vx *= -1;
          if (p.y <= p.r || p.y >= H - 40 - p.r) p.vy *= -1;

          /* Bounce off pollen */
          const dx = p.x - S.pollen.x, dy = p.y - S.pollen.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 18 + p.r) {
            const nx = dx / dist, ny = dy / dist;
            p.vx += nx * 1.5; p.vy += ny * 1.5;
            S.pollen.vx -= nx * 0.08; S.pollen.vy -= ny * 0.08;
          }
        }
        /* Pollen drifts due to collisions */
        S.pollen.x = Math.max(20, Math.min(W - 20, S.pollen.x + S.pollen.vx));
        S.pollen.y = Math.max(20, Math.min(H - 60, S.pollen.y + S.pollen.vy));
        S.pollen.vx *= 0.96; S.pollen.vy *= 0.96;
      }

      /* Draw */
      ctx.fillStyle = "#0d1117"; ctx.fillRect(0, 0, W, H);

      /* Title */
      ctx.fillStyle = "#58a6ff"; ctx.font = "bold 13px 'Inter',sans-serif";
      ctx.fillText("Brownian Motion — Water Particles Bombarding Pollen Grain", 12, 20);

      /* Particles */
      for (const p of S.particles) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.fill();
      }

      /* Pollen grain */
      const gradient = ctx.createRadialGradient(S.pollen.x - 5, S.pollen.y - 5, 2, S.pollen.x, S.pollen.y, 18);
      gradient.addColorStop(0, "#ffd700"); gradient.addColorStop(1, "#b8860b");
      ctx.beginPath(); ctx.arc(S.pollen.x, S.pollen.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = gradient; ctx.fill();
      ctx.strokeStyle = "#fff8"; ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#000"; ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center"; ctx.fillText("POLLEN", S.pollen.x, S.pollen.y + 3);
      ctx.textAlign = "left";

      /* Legend */
      ctx.fillStyle = "#8b949e"; ctx.font = "11px 'Inter',sans-serif";
      ctx.fillText("● Water molecules   ● Pollen grain", 12, H - 15);
      ctx.fillStyle = "#58a6ff"; ctx.fillText("●", 12, H - 15);
      ctx.fillStyle = "#ffd700"; ctx.fillText("●", 152, H - 15);

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, speed]);

  return <canvas ref={canvasRef} width={600} height={350} className={styles.simCanvas} />;
}

/* ─────────────────────────────────────────────────────────────────────────
 * Topic 1 — Simulation 2: Three States Particle Model
 * Side-by-side boxes showing particle arrangement in solid, liquid, gas.
 * ───────────────────────────────────────────────────────────────────────── */
function ThreeStatesParticles({ running, speed }: { running: boolean; speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);

  /* Initialise particles for each state */
  const makeGrid = (cx: number, rows: number, cols: number, gap: number) =>
    Array.from({ length: rows * cols }, (_, i) => ({
      x: cx - (cols / 2 - 0.5) * gap + (i % cols) * gap,
      y:  60 + Math.floor(i / cols) * gap,
      vx: 0, vy: 0, r: 7,
    }));

  const stateRef = useRef({
    solid:  makeGrid(100, 4, 4, 18).map(p => ({ ...p, ox: p.x, oy: p.y })),
    liquid: Array.from({ length: 16 }, () => ({ x: rand(220, 360), y: rand(70, 270), vx: rand(-1,1), vy: rand(-1,1), r: 7, ox: 0, oy: 0 })),
    gas:    Array.from({ length: 14 }, () => ({ x: rand(390, 570), y: rand(40, 310), vx: rand(-2,2), vy: rand(-2,2), r: 6, ox: 0, oy: 0 })),
  });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const S = stateRef.current;

    const tick = () => {
      if (running) {
        /* Solid: vibrate around equilibrium */
        for (const p of S.solid) {
          p.x += (p.ox - p.x) * 0.3 + rand(-0.4, 0.4) * speed;
          p.y += (p.oy - p.y) * 0.3 + rand(-0.4, 0.4) * speed;
        }
        /* Liquid: flow around but stay in container */
        for (const p of S.liquid) {
          p.vx += rand(-0.3, 0.3) * speed; p.vy += rand(-0.3, 0.3) * speed;
          const spd = Math.hypot(p.vx, p.vy);
          if (spd > 1.5 * speed) { p.vx *= 0.7; p.vy *= 0.7; }
          p.x += p.vx; p.y += p.vy;
          if (p.x < 215 + p.r) { p.x = 215 + p.r; p.vx *= -1; }
          if (p.x > 365 - p.r) { p.x = 365 - p.r; p.vx *= -1; }
          if (p.y < 45 + p.r)  { p.y = 45 + p.r;  p.vy *= -1; }
          if (p.y > 295 - p.r) { p.y = 295 - p.r; p.vy *= -1; }
        }
        /* Gas: free high-speed movement */
        for (const p of S.gas) {
          p.vx += rand(-0.3, 0.3) * speed; p.vy += rand(-0.3, 0.3) * speed;
          const spd = Math.hypot(p.vx, p.vy);
          if (spd > 3 * speed) { p.vx *= 0.7; p.vy *= 0.7; }
          p.x += p.vx; p.y += p.vy;
          if (p.x < 385 + p.r) { p.x = 385 + p.r; p.vx *= -1; }
          if (p.x > 585 - p.r) { p.x = 585 - p.r; p.vx *= -1; }
          if (p.y < 20 + p.r)  { p.y = 20 + p.r;  p.vy *= -1; }
          if (p.y > 315 - p.r) { p.y = 315 - p.r; p.vy *= -1; }
        }
      }

      ctx.fillStyle = "#0d1117"; ctx.fillRect(0, 0, W, H);

      /* Draw containers */
      const boxes: [string, number, number, number, number, string, string][] = [
        ["SOLID",   15,  40, 180, 270, "#3b82f620", "#3b82f6"],
        ["LIQUID", 210,  40, 160, 270, "#10b98120", "#10b981"],
        ["GAS",    380,  20, 210, 310, "#f59e0b20", "#f59e0b"],
      ];
      for (const [label, x, y, w, h, fill, stroke] of boxes) {
        roundRect(ctx, x, y, w, h, 8);
        ctx.fillStyle = fill; ctx.fill();
        ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = stroke; ctx.font = "bold 12px 'Inter',sans-serif";
        ctx.textAlign = "center"; ctx.fillText(label, x + w / 2, y - 4);
      }

      /* Solid particles (blue) */
      for (const p of S.solid) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "#3b82f6"; ctx.fill();
        ctx.strokeStyle = "#93c5fd60"; ctx.lineWidth = 1; ctx.stroke();
      }
      /* Liquid particles (green) */
      for (const p of S.liquid) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "#10b981"; ctx.fill();
        ctx.strokeStyle = "#6ee7b760"; ctx.lineWidth = 1; ctx.stroke();
      }
      /* Gas particles (amber) */
      for (const p of S.gas) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "#f59e0b"; ctx.fill();
        ctx.strokeStyle = "#fcd34d60"; ctx.lineWidth = 1; ctx.stroke();
      }

      /* Labels at bottom */
      ctx.textAlign = "left"; ctx.font = "10px 'Inter',sans-serif";
      ctx.fillStyle = "#6b7280";
      ctx.fillText("Fixed positions, vibrate", 15, H - 20);
      ctx.fillText("Flow, fixed volume", 210, H - 20);
      ctx.fillText("Spread freely, fill container", 380, H - 20);

      ctx.textAlign = "left";
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, speed]);

  return <canvas ref={canvasRef} width={600} height={350} className={styles.simCanvas} />;
}

/* ─────────────────────────────────────────────────────────────────────────
 * Topic 2 — Simulation 3: Heating Curve Animation
 * Shows temperature vs. heat added graph with phase labels and plateau.
 * ───────────────────────────────────────────────────────────────────────── */
function HeatingCurve({ running, speed }: { running: boolean; speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;

    /* Heating curve keypoints: [heatUnits, tempCelsius] */
    const curve = [
      [0, -20], [20, 0], [45, 0], [65, 100], [100, 100], [130, 120],
    ];
    const xScale = (W - 80) / 130, yScale = (H - 80) / 140;
    const ox = 60, oy = H - 50;

    const plotX = (h: number) => ox + h * xScale;
    const plotY = (t: number) => oy - (t + 20) * yScale;

    const phaseLabels = [
      { h: 10, t: -10, label: "Solid (Ice)", color: "#60a5fa" },
      { h: 32, t: -5,  label: "Melting\n(Plateau)", color: "#a78bfa" },
      { h: 55, t: 50,  label: "Liquid (Water)", color: "#34d399" },
      { h: 82, t: 95,  label: "Boiling\n(Plateau)", color: "#fbbf24" },
      { h: 115, t: 115, label: "Steam (Gas)", color: "#f87171" },
    ];

    const tick = () => {
      if (running && progressRef.current < 1) {
        progressRef.current = Math.min(1, progressRef.current + 0.003 * speed);
      }

      ctx.fillStyle = "#0d1117"; ctx.fillRect(0, 0, W, H);

      /* Axes */
      ctx.strokeStyle = "#30363d"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ox, 20); ctx.lineTo(ox, oy + 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox - 10, oy); ctx.lineTo(W - 20, oy); ctx.stroke();

      /* Axis labels */
      ctx.fillStyle = "#8b949e"; ctx.font = "11px 'Inter',sans-serif";
      ctx.save(); ctx.translate(16, H / 2); ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center"; ctx.fillText("Temperature (°C)", 0, 0); ctx.restore();
      ctx.textAlign = "center";
      ctx.fillText("Heat Added →", W / 2, H - 8);
      ctx.textAlign = "left";

      /* Temp gridlines */
      const temps = [-20, 0, 20, 40, 60, 80, 100, 120];
      for (const t of temps) {
        const py = plotY(t);
        ctx.strokeStyle = "#21262d"; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(ox, py); ctx.lineTo(W - 20, py); ctx.stroke();
        ctx.fillStyle = "#8b949e"; ctx.font = "10px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`${t}°`, ox - 4, py + 4);
      }
      ctx.textAlign = "left";

      /* Draw heating curve up to progress */
      const totalPts = curve.length - 1;
      const maxT = progressRef.current * totalPts;

      ctx.beginPath();
      ctx.moveTo(plotX(curve[0][0]), plotY(curve[0][1]));
      let prevColor = "#60a5fa";
      for (let i = 0; i < totalPts; i++) {
        if (i >= maxT) break;
        const frac = Math.min(1, maxT - i);
        const x1 = plotX(curve[i][0]), y1 = plotY(curve[i][1]);
        const x2 = plotX(curve[i][0] + (curve[i+1][0] - curve[i][0]) * frac);
        const y2 = plotY(curve[i][1] + (curve[i+1][1] - curve[i][1]) * frac);
        /* Color by phase */
        const colors = ["#60a5fa", "#a78bfa", "#34d399", "#fbbf24", "#f87171"];
        const c = colors[i] || "#f87171";
        if (c !== prevColor) { ctx.stroke(); ctx.beginPath(); ctx.moveTo(x1, y1); }
        ctx.strokeStyle = c; ctx.lineWidth = 3;
        ctx.lineTo(x2, y2);
        prevColor = c;
      }
      ctx.stroke();

      /* Moving dot at progress */
      if (progressRef.current < 1) {
        const segIdx = Math.min(totalPts - 1, Math.floor(progressRef.current * totalPts));
        const segFrac = progressRef.current * totalPts - segIdx;
        const cx2 = plotX(curve[segIdx][0] + (curve[segIdx+1][0] - curve[segIdx][0]) * segFrac);
        const cy2 = plotY(curve[segIdx][1] + (curve[segIdx+1][1] - curve[segIdx][1]) * segFrac);
        ctx.beginPath(); ctx.arc(cx2, cy2, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#fff"; ctx.fill();
        ctx.strokeStyle = "#58a6ff"; ctx.lineWidth = 2; ctx.stroke();
      }

      /* Phase labels */
      for (const { h, t, label, color } of phaseLabels) {
        if (plotX(h) < plotX(curve[Math.floor(progressRef.current * totalPts)]?.[0] ?? 0) || progressRef.current >= 0.95) {
          ctx.fillStyle = color; ctx.font = "bold 10px 'Inter',sans-serif";
          const lines = label.split("\n");
          lines.forEach((ln, li) => ctx.fillText(ln, plotX(h) - 10, plotY(t) - 12 + li * 14));
        }
      }

      /* Title */
      ctx.fillStyle = "#58a6ff"; ctx.font = "bold 12px 'Inter',sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Heating Curve of Water — Temperature vs. Heat Added", W / 2, 18);
      ctx.textAlign = "left";

      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, speed]);

  return (
    <div>
      <canvas ref={canvasRef} width={600} height={350} className={styles.simCanvas} />
      <button className={styles.resetBtn} onClick={() => { progressRef.current = 0; }}>↺ Reset</button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Topic 3 / Topic 4 — Simulation 4: Evaporation
 * Liquid molecules at surface escape when they gain enough kinetic energy.
 * ───────────────────────────────────────────────────────────────────────── */
function EvaporationSim({ running, speed }: { running: boolean; speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const stateRef  = useRef({
    liquid: Array.from({ length: 50 }, (_, i) => ({
      x: rand(30, 570), y: 160 + rand(0, 130), vx: rand(-1, 1), vy: rand(-1, 1),
      energy: rand(0.2, 0.8), escaped: false,
    })),
    escaped: 0,
    temp: 30, /* degrees Celsius */
  });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const S = stateRef.current;

    const tick = () => {
      if (running) {
        for (const p of S.liquid) {
          if (p.escaped) {
            p.x += p.vx * speed; p.y += p.vy * speed;
            p.vy -= 0.02; /* float up */
          } else {
            p.vx += rand(-0.15, 0.15) * speed; p.vy += rand(-0.15, 0.15) * speed;
            const spd = Math.hypot(p.vx, p.vy);
            /* Energy based on temperature */
            const maxSpeed = 0.5 + S.temp / 40;
            if (spd > maxSpeed) { p.vx *= 0.8; p.vy *= 0.8; }
            p.x += p.vx; p.y += p.vy;
            if (p.x < 25) { p.x = 25; p.vx *= -1; }
            if (p.x > 575) { p.x = 575; p.vx *= -1; }
            if (p.y > H - 30) { p.y = H - 30; p.vy *= -1; }
            if (p.y > 155) p.y = Math.min(H - 30, p.y);

            /* Escape condition: high energy AND near surface */
            p.energy = Math.hypot(p.vx, p.vy) / (maxSpeed);
            if (p.y < 175 && p.energy > 0.9 && Math.random() < 0.002 * speed) {
              p.escaped = true; p.vy = -rand(0.5, 1.5) * speed;
              S.escaped++;
            }
            if (p.y < 155) { p.y = 155; p.vy = Math.abs(p.vy); }
          }
        }
        /* Remove fully escaped and add new ones */
        const active = S.liquid.filter(p => !p.escaped || p.y > -20);
        while (active.filter(p => !p.escaped).length < 40) {
          active.push({ x: rand(30, 570), y: rand(200, H - 30), vx: rand(-1, 1), vy: rand(-1, 1), energy: 0.4, escaped: false });
        }
        S.liquid.length = 0; S.liquid.push(...active);
      }

      ctx.fillStyle = "#0d1117"; ctx.fillRect(0, 0, W, H);

      /* Title */
      ctx.fillStyle = "#34d399"; ctx.font = "bold 13px 'Inter',sans-serif";
      ctx.fillText(`Evaporation Simulation  — Temperature: ${S.temp}°C`, 12, 22);

      /* Liquid surface */
      const surfGrad = ctx.createLinearGradient(0, 155, 0, H - 25);
      surfGrad.addColorStop(0, "#1e3a5f90");
      surfGrad.addColorStop(1, "#1e3a5f");
      ctx.fillStyle = surfGrad;
      ctx.fillRect(20, 150, W - 40, H - 175);
      ctx.strokeStyle = "#3b82f660"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(20, 155); ctx.lineTo(W - 20, 155); ctx.stroke();

      /* "Air" label */
      ctx.fillStyle = "#ffffff30"; ctx.font = "11px sans-serif";
      ctx.fillText("Air (atmosphere)", 12, 50);
      ctx.fillText("Liquid surface", 22, 148);

      /* Temperature thermometer */
      ctx.fillStyle = "#374151"; roundRect(ctx, W - 70, 30, 18, 200, 9); ctx.fill();
      ctx.fillStyle = `hsl(${120 - S.temp * 1.5},80%,50%)`;
      roundRect(ctx, W - 67, 30 + 197 * (1 - S.temp / 100), 12, 197 * (S.temp / 100), 5); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${S.temp}°C`, W - 61, 246);
      ctx.textAlign = "left";

      /* Particles */
      for (const p of S.liquid) {
        const energyColor = p.escaped
          ? "#fbbf24"
          : lerpColor("#3b82f6", "#ef4444", p.energy);
        ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = energyColor + (p.escaped ? "cc" : "ff");
        ctx.fill();
        if (p.escaped) {
          /* draw upward arrow */
          ctx.strokeStyle = "#fbbf2480"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y + 8); ctx.lineTo(p.x, p.y - 8); ctx.stroke();
        }
      }

      /* Escaped count */
      ctx.fillStyle = "#fbbf24"; ctx.font = "bold 11px 'Inter',sans-serif";
      ctx.fillText(`Evaporated molecules: ${S.escaped}`, 12, H - 10);

      /* Legend */
      ctx.fillStyle = "#3b82f6"; ctx.fillText("● Low energy", 230, H - 10);
      ctx.fillStyle = "#ef4444"; ctx.fillText("● High energy (escape)", 330, H - 10);

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, speed]);

  const S = stateRef.current;
  return (
    <div>
      <canvas ref={canvasRef} width={600} height={350} className={styles.simCanvas} />
      <div className={styles.simControls}>
        <label className={styles.simLabel}>Temperature: {S.temp}°C</label>
        <input type="range" min={10} max={100} value={S.temp}
          onChange={e => { S.temp = +e.target.value; S.escaped = 0; }}
          className={styles.slider} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Topic 5 — Simulation 5: Diffusion
 * Two gas species start separated and mix over time — Fick's Law in action.
 * ───────────────────────────────────────────────────────────────────────── */
function DiffusionSim({ running, speed }: { running: boolean; speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const stateRef  = useRef({
    redGas:  Array.from({ length: 30 }, () => ({ x: rand(20, 280), y: rand(50, 300), vx: rand(-1.5,1.5), vy: rand(-1.5,1.5) })),
    blueGas: Array.from({ length: 30 }, () => ({ x: rand(320, 580), y: rand(50, 300), vx: rand(-1.5,1.5), vy: rand(-1.5,1.5) })),
    t: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const S = stateRef.current;

    const tick = () => {
      if (running) {
        S.t += 0.01 * speed;
        for (const arr of [S.redGas, S.blueGas]) {
          for (const p of arr) {
            p.vx += rand(-0.2, 0.2) * speed; p.vy += rand(-0.2, 0.2) * speed;
            const spd = Math.hypot(p.vx, p.vy);
            if (spd > 2 * speed) { p.vx *= 0.8; p.vy *= 0.8; }
            p.x += p.vx; p.y += p.vy;
            if (p.x < 15)      { p.x = 15; p.vx *= -1; }
            if (p.x > W - 15)  { p.x = W - 15; p.vx *= -1; }
            if (p.y < 40)      { p.y = 40; p.vy *= -1; }
            if (p.y > H - 40)  { p.y = H - 40; p.vy *= -1; }
          }
        }
      }

      ctx.fillStyle = "#0d1117"; ctx.fillRect(0, 0, W, H);

      /* Title */
      ctx.fillStyle = "#58a6ff"; ctx.font = "bold 13px 'Inter',sans-serif";
      ctx.fillText("Diffusion — Two Gases Mixing from High to Low Concentration", 12, 22);

      /* Container */
      roundRect(ctx, 10, 38, W - 20, H - 78, 8);
      ctx.strokeStyle = "#30363d"; ctx.lineWidth = 1.5; ctx.stroke();

      /* Concentration indicator (left = red, right = blue) */
      let redLeft = S.redGas.filter(p => p.x < W/2).length;
      let blueRight = S.blueGas.filter(p => p.x > W/2).length;

      /* Gradient background to show concentration */
      const redConc = redLeft / S.redGas.length;
      const blueConc = blueRight / S.blueGas.length;
      ctx.fillStyle = `rgba(239,68,68,${0.04 * redConc})`;
      ctx.fillRect(10, 38, (W - 20) / 2, H - 78);
      ctx.fillStyle = `rgba(59,130,246,${0.04 * blueConc})`;
      ctx.fillRect(W / 2, 38, (W - 20) / 2, H - 78);

      /* Particles */
      for (const p of S.redGas) {
        ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444cc"; ctx.fill();
        ctx.strokeStyle = "#fca5a5"; ctx.lineWidth = 1; ctx.stroke();
      }
      for (const p of S.blueGas) {
        ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#3b82f6cc"; ctx.fill();
        ctx.strokeStyle = "#93c5fd"; ctx.lineWidth = 1; ctx.stroke();
      }

      /* Concentration bars */
      const barY = H - 30;
      ctx.fillStyle = "#ef4444"; roundRect(ctx, 15, barY - 10, (W/2 - 15) * redConc, 12, 3); ctx.fill();
      ctx.strokeStyle = "#ef444460"; ctx.lineWidth = 1;
      roundRect(ctx, 15, barY - 10, W/2 - 15, 12, 3); ctx.stroke();

      ctx.fillStyle = "#3b82f6"; roundRect(ctx, W/2 + 5, barY - 10, (W/2 - 20) * blueConc, 12, 3); ctx.fill();
      ctx.strokeStyle = "#3b82f660"; ctx.lineWidth = 1;
      roundRect(ctx, W/2 + 5, barY - 10, W/2 - 20, 12, 3); ctx.stroke();

      ctx.fillStyle = "#8b949e"; ctx.font = "10px sans-serif";
      ctx.fillText(`Red: ${Math.round(redConc*100)}% left`, 15, barY + 14);
      ctx.textAlign = "right";
      ctx.fillText(`Blue: ${Math.round(blueConc*100)}% right`, W - 15, barY + 14);
      ctx.textAlign = "left";

      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, speed]);

  return <canvas ref={canvasRef} width={600} height={350} className={styles.simCanvas} />;
}

/* ─────────────────────────────────────────────────────────────────────────
 * Topic 2/3 — Simulation 6: Latent Heat Gauge
 * Visualises why temperature DOESN'T change during phase transitions.
 * ───────────────────────────────────────────────────────────────────────── */
function LatentHeatViz({ running, speed }: { running: boolean; speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const stateRef  = useRef({ heat: 0, temp: -20, phase: 0, particles: Array.from({ length: 40 }, (_, i) => ({ x: rand(100, 500), y: rand(80, 280), vx: rand(-0.5,0.5), vy: rand(-0.5,0.5) })) });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const S = stateRef.current;

    /* Phase regions: [start_heat, end_heat, start_temp, end_temp, phase_name] */
    const phases = [
      { hs: 0, he: 20, ts: -20, te: 0, name: "Solid" },
      { hs: 20, he: 50, ts: 0, te: 0, name: "Melting (Latent Heat)" },
      { hs: 50, he: 80, ts: 0, te: 100, name: "Liquid" },
      { hs: 80, he: 110, ts: 100, te: 100, name: "Boiling (Latent Heat)" },
      { hs: 110, he: 130, ts: 100, te: 120, name: "Gas" },
    ];

    const tick = () => {
      if (running && S.heat < 130) {
        S.heat = Math.min(130, S.heat + 0.08 * speed);
        /* Determine temperature from heating curve */
        for (const ph of phases) {
          if (S.heat >= ph.hs && S.heat <= ph.he) {
            const frac = (S.heat - ph.hs) / (ph.he - ph.hs);
            S.temp = ph.ts + (ph.te - ph.ts) * frac;
            S.phase = phases.indexOf(ph);
          }
        }
        /* Update particle speeds */
        const maxV = 0.3 + (S.temp + 20) / 50;
        for (const p of S.particles) {
          p.vx += rand(-0.1, 0.1) * speed; p.vy += rand(-0.1, 0.1) * speed;
          const spd = Math.hypot(p.vx, p.vy);
          if (spd > maxV) { p.vx *= 0.8; p.vy *= 0.8; }
          p.x += p.vx; p.y += p.vy;
          if (p.x < 80 || p.x > 520) p.vx *= -1;
          if (p.y < 60 || p.y > 290) p.vy *= -1;
        }
      }

      ctx.fillStyle = "#0d1117"; ctx.fillRect(0, 0, W, H);

      /* Title */
      ctx.fillStyle = "#f59e0b"; ctx.font = "bold 13px 'Inter',sans-serif";
      ctx.fillText("Latent Heat — Why Temperature Stays Constant During Phase Change", 12, 22);

      /* Heating curve graph (mini, left side) */
      const gx = 15, gy = 40, gw = 200, gh = 160;
      ctx.strokeStyle = "#30363d"; ctx.lineWidth = 1;
      ctx.strokeRect(gx, gy, gw, gh);
      ctx.fillStyle = "#8b949e"; ctx.font = "9px sans-serif";
      ctx.textAlign = "center"; ctx.fillText("Heat →", gx + gw / 2, gy + gh + 12);
      ctx.save(); ctx.translate(gx - 12, gy + gh / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText("Temp →", 0, 0); ctx.restore();
      ctx.textAlign = "left";

      /* Draw full heating curve */
      ctx.beginPath();
      const phColors = ["#60a5fa", "#a78bfa", "#34d399", "#fbbf24", "#f87171"];
      for (let i = 0; i < phases.length; i++) {
        const ph = phases[i];
        const x1 = gx + (ph.hs / 130) * gw, y1 = gy + gh - ((ph.ts + 20) / 140) * gh;
        const x2 = gx + (ph.he / 130) * gw, y2 = gy + gh - ((ph.te + 20) / 140) * gh;
        ctx.strokeStyle = phColors[i]; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }

      /* Current position dot */
      const dotX = gx + (S.heat / 130) * gw;
      const dotY = gy + gh - ((S.temp + 20) / 140) * gh;
      ctx.beginPath(); ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#fff"; ctx.fill();

      /* Right panel: particle container */
      const cx = 250, cy = 50, cw = 330, ch = 260;
      roundRect(ctx, cx, cy, cw, ch, 8);
      const phase = phases[S.phase];
      const phaseBgColors = ["#1e3a5f20", "#6d28d920", "#1e5f3a20", "#78350f20", "#5f1e1e20"];
      ctx.fillStyle = phaseBgColors[S.phase]; ctx.fill();
      ctx.strokeStyle = phColors[S.phase]; ctx.lineWidth = 1.5; ctx.stroke();

      /* Particles */
      for (const p of S.particles) {
        if (p.x < cx || p.x > cx + cw || p.y < cy || p.y > cy + ch) continue;
        ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = phColors[S.phase] + "dd"; ctx.fill();
      }

      /* Phase label */
      ctx.fillStyle = phColors[S.phase]; ctx.font = "bold 14px 'Inter',sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(phase.name, cx + cw / 2, cy + 24);

      /* Temperature gauge */
      ctx.textAlign = "left";
      ctx.fillStyle = "#8b949e"; ctx.font = "12px 'Inter',sans-serif";
      ctx.fillText(`Temperature: ${Math.round(S.temp)}°C`, cx + 10, cy + ch + 20);
      ctx.fillText(`Heat Added: ${Math.round(S.heat)} units`, cx + 190, cy + ch + 20);

      /* Heat bar */
      ctx.fillStyle = "#374151";
      roundRect(ctx, cx, cy + ch + 32, cw, 10, 5); ctx.fill();
      ctx.fillStyle = `hsl(${30 + S.heat},80%,55%)`;
      roundRect(ctx, cx, cy + ch + 32, cw * (S.heat / 130), 10, 5); ctx.fill();

      /* During latent heat: energy arrow explanation */
      if (S.phase === 1 || S.phase === 3) {
        ctx.fillStyle = "#fbbf24"; ctx.font = "11px 'Inter',sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("⚡ Energy breaking bonds, not raising temp!", cx + cw / 2, cy + ch - 10);
        ctx.textAlign = "left";
      }

      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, speed]);

  return (
    <div>
      <canvas ref={canvasRef} width={600} height={350} className={styles.simCanvas} />
      <button className={styles.resetBtn} onClick={() => { stateRef.current.heat = 0; stateRef.current.temp = -20; stateRef.current.phase = 0; }}>↺ Reset</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * SELECTOR COMPONENT — picks the right set of simulations per topicId
 * ═══════════════════════════════════════════════════════════════════════════ */

type SimDef = { label: string; description: string; Component: React.FC<{ running: boolean; speed: number }> };

const MATTER_SIMS: Record<string, SimDef[]> = {
  "what-is-matter": [
    { label: "Brownian Motion",    description: "Water particles bombarding a pollen grain in random motion",           Component: BrownianMotion },
    { label: "Three States Model", description: "Solid, liquid, gas particles — arrangement and motion compared",       Component: ThreeStatesParticles },
    { label: "Diffusion of Gases", description: "Two gases mixing from high to low concentration",                      Component: DiffusionSim },
    { label: "Heating Curve",      description: "Temperature vs heat added — phase transitions and latent heat",        Component: HeatingCurve },
    { label: "Evaporation Lab",    description: "Surface molecules escaping — effect of temperature",                   Component: EvaporationSim },
    { label: "Latent Heat",        description: "Energy absorbed during phase change without temperature rise",         Component: LatentHeatViz },
  ],
  "states-of-matter": [
    { label: "Three States Panel", description: "Solid, liquid, gas particles side by side",                           Component: ThreeStatesParticles },
    { label: "Brownian Motion",    description: "Kinetic energy of particles — constant random motion",                Component: BrownianMotion },
    { label: "Diffusion Demo",     description: "Particles spread from high to low concentration region",              Component: DiffusionSim },
    { label: "Heating Curve",      description: "How temperature changes when heat is added to matter",                Component: HeatingCurve },
    { label: "Evaporation",        description: "Surface evaporation from liquid state",                               Component: EvaporationSim },
    { label: "Latent Heat Viz",    description: "Phase transitions and energy during melting/boiling",                 Component: LatentHeatViz },
  ],
  "change-of-state": [
    { label: "Heating Curve",      description: "Complete temperature vs heat graph for water",                        Component: HeatingCurve },
    { label: "Latent Heat",        description: "Energy absorbed during phase changes without temp rise",              Component: LatentHeatViz },
    { label: "Three States",       description: "Particle motion in solid, liquid, and gas phases",                    Component: ThreeStatesParticles },
    { label: "Diffusion",          description: "Diffusion rates differ in solid, liquid, gas",                        Component: DiffusionSim },
    { label: "Brownian Motion",    description: "Kinetic theory of matter — particles in motion",                      Component: BrownianMotion },
    { label: "Evaporation",        description: "Surface evaporation — a slow change of state",                       Component: EvaporationSim },
  ],
  "evaporation": [
    { label: "Evaporation Lab",    description: "Molecules escaping the surface — temperature dependence",             Component: EvaporationSim },
    { label: "Diffusion",          description: "How evaporated vapour spreads into the air",                          Component: DiffusionSim },
    { label: "Heating Curve",      description: "Boiling vs evaporation on the heating curve",                        Component: HeatingCurve },
    { label: "Three States",       description: "Liquid surface and gas phase visualized",                            Component: ThreeStatesParticles },
    { label: "Brownian Motion",    description: "Kinetic energy that drives evaporation",                             Component: BrownianMotion },
    { label: "Latent Heat",        description: "Latent heat of vaporisation during evaporation",                     Component: LatentHeatViz },
  ],
  "diffusion": [
    { label: "Diffusion Sim",      description: "Two gases diffusing into each other — Fick's Law",                   Component: DiffusionSim },
    { label: "Brownian Motion",    description: "Random motion that drives diffusion",                                Component: BrownianMotion },
    { label: "Three States",       description: "Diffusion rates in solid, liquid, and gas",                          Component: ThreeStatesParticles },
    { label: "Evaporation",        description: "Evaporation as a special case of diffusion",                        Component: EvaporationSim },
    { label: "Heating Curve",      description: "How temperature affects diffusion rate",                            Component: HeatingCurve },
    { label: "Latent Heat",        description: "Intermolecular forces and diffusion connection",                    Component: LatentHeatViz },
  ],
};

/* Default fallback — show all 6 for any unknown topic */
const DEFAULT_SIMS: SimDef[] = [
  { label: "Brownian Motion",    description: "Kinetic theory — particles in constant random motion",               Component: BrownianMotion },
  { label: "Three States",       description: "Solid, liquid, gas — particle arrangement and motion",               Component: ThreeStatesParticles },
  { label: "Heating Curve",      description: "Temperature vs heat — phase transitions visualised",                 Component: HeatingCurve },
  { label: "Evaporation",        description: "Surface evaporation and temperature dependence",                     Component: EvaporationSim },
  { label: "Diffusion",          description: "Gases mixing from high to low concentration",                        Component: DiffusionSim },
  { label: "Latent Heat",        description: "Energy absorbed during phase change",                                Component: LatentHeatViz },
];

/* ─────────────────────────────────────────────────────────────────────────
 * MatterSimulation — exported default component
 * ───────────────────────────────────────────────────────────────────────── */
export default function MatterSimulation({ topicId }: { topicId: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [expanded, setExpanded] = useState(false);

  const sims = MATTER_SIMS[topicId] ?? DEFAULT_SIMS;
  const active = sims[activeIdx];

  return (
    <div className={styles.simulationContainer}>
      {/* Toggle header */}
      <button className={styles.simToggleBtn} onClick={() => setExpanded(v => !v)}>
        <span className={styles.simToggleIcon}>{expanded ? "▼" : "▶"}</span>
        <span className={styles.simToggleText}>
          🧪 Interactive Simulations — {sims.length} Experiments Available
        </span>
        <span className={styles.simToggleBadge}>{expanded ? "Hide" : "Show"}</span>
      </button>

      {expanded && (
        <div className={styles.simBody}>
          {/* Tab selector */}
          <div className={styles.simTabs}>
            {sims.map((s, i) => (
              <button
                key={i}
                className={`${styles.simTab} ${i === activeIdx ? styles.activeSimTab : ""}`}
                onClick={() => setActiveIdx(i)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Description */}
          <div className={styles.simDesc}>
            <span className={styles.simDescIcon}>🔬</span>
            <span>{active.description}</span>
          </div>

          {/* Canvas */}
          <div className={styles.simCanvasWrapper}>
            <active.Component running={running} speed={speed} />
          </div>

          {/* Controls */}
          <div className={styles.simControlBar}>
            <button
              className={`${styles.simControlBtn} ${running ? styles.pauseBtn : styles.playBtn}`}
              onClick={() => setRunning(v => !v)}
            >
              {running ? "⏸ Pause" : "▶ Play"}
            </button>
            <div className={styles.speedGroup}>
              <span className={styles.speedLabel}>Speed: {speed.toFixed(1)}×</span>
              <input type="range" min={0.2} max={3} step={0.1} value={speed}
                onChange={e => setSpeed(+e.target.value)} className={styles.speedSlider} />
            </div>
            <span className={styles.simHint}>
              {activeIdx + 1} of {sims.length} simulations
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
