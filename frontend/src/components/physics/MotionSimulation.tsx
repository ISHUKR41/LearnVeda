/**
 * FILE: MotionSimulation.tsx
 * LOCATION: src/components/physics/MotionSimulation.tsx
 * PURPOSE: Professional interactive Canvas-based simulations for
 *          "Motion" — Class 9 Science Chapter 8.
 *          Six simulations per topic, covering all 5 subtopics.
 *
 *   Topic 1 (distance-displacement)   → PathTracer, VectorArrow,
 *                                        ZeroDisplacement, NegativeDisp,
 *                                        ScalarVsVector, GPS
 *   Topic 2 (speed-velocity)          → SpeedometerSim, AverageSpeed,
 *                                        InstantaneousSpeed, VelocityVector,
 *                                        RelativeSpeed, Odometer
 *   Topic 3 (acceleration)            → AccelTrack, VelocityTimeGraph,
 *                                        NegativeAccel, AccelDirection,
 *                                        UniformAccel, FreeBodyAccel
 *   Topic 4 (equations-of-motion)     → SUVATAnimator, VTGraphArea,
 *                                        FreeFall, VerticalThrow,
 *                                        BrakingDistance, TrainProblem
 *   Topic 5 (uniform-circular-motion) → CircularOrbit, CentripetalForce,
 *                                        AngularVelocity, SatelliteOrbit,
 *                                        BankedRoad, UCMvsLinear
 * DEPENDENCIES: React 18, TypeScript
 */

"use client";

import React, { useRef, useEffect, useState } from "react";
import styles from "./PhysicsSimulation.module.css";

/* ═══════════════════════════════════════════════════════════════════════════
 * SHARED UTILITIES
 * ═══════════════════════════════════════════════════════════════════════════ */

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, width = 2, headLen = 12) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color; ctx.lineWidth = width;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLen * Math.cos(angle - 0.4), y2 - headLen * Math.sin(angle - 0.4));
  ctx.lineTo(x2 - headLen * Math.cos(angle + 0.4), y2 - headLen * Math.sin(angle + 0.4));
  ctx.closePath(); ctx.fill();
}

/* ═══════════════════════════════════════════════════════════════════════════
 * SIMULATION 1: PathTracer — Distance vs Displacement
 * Object walks along a curved path; shows path length (distance) and
 * straight-line arrow from start to current position (displacement).
 * ═══════════════════════════════════════════════════════════════════════════ */
function PathTracer({ running, speed }: { running: boolean; speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const stateRef  = useRef({ t: 0, trail: [] as [number,number][] });

  /* Pre-defined curved path (parametric) */
  const path = (t: number): [number, number] => {
    const T = t % (2 * Math.PI);
    return [
      90 + 220 * Math.cos(T) + 90 * Math.cos(2 * T),
      175 + 120 * Math.sin(T),
    ];
  };

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const S = stateRef.current;

    const tick = () => {
      if (running) {
        S.t += 0.008 * speed;
        if (S.t > 2 * Math.PI) S.t -= 2 * Math.PI;
        const pos = path(S.t);
        S.trail.push(pos);
        if (S.trail.length > 400) S.trail.shift();
      }

      ctx.fillStyle = "#0d1117"; ctx.fillRect(0, 0, W, H);

      /* Title */
      ctx.fillStyle = "#58a6ff"; ctx.font = "bold 13px 'Inter',sans-serif";
      ctx.fillText("Distance vs Displacement — Path Length vs Straight Line", 12, 22);

      /* Draw trail (path / distance) */
      if (S.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(S.trail[0][0], S.trail[0][1]);
        for (const [x, y] of S.trail) ctx.lineTo(x, y);
        ctx.strokeStyle = "#3b82f660"; ctx.lineWidth = 2; ctx.stroke();
      }

      const start: [number, number] = S.trail.length > 0 ? S.trail[0] : path(0);
      const cur = path(S.t);

      /* Distance label along path */
      let dist = 0;
      for (let i = 1; i < S.trail.length; i++) {
        dist += Math.hypot(S.trail[i][0] - S.trail[i-1][0], S.trail[i][1] - S.trail[i-1][1]);
      }

      /* Displacement arrow */
      if (S.trail.length > 1) {
        drawArrow(ctx, start[0], start[1], cur[0], cur[1], "#10b981", 2.5, 14);
      }

      /* Moving object */
      ctx.beginPath(); ctx.arc(cur[0], cur[1], 10, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(cur[0] - 3, cur[1] - 3, 2, cur[0], cur[1], 10);
      grad.addColorStop(0, "#fbbf24"); grad.addColorStop(1, "#b45309");
      ctx.fillStyle = grad; ctx.fill();
      ctx.strokeStyle = "#fff4"; ctx.lineWidth = 1; ctx.stroke();

      /* Start dot */
      if (S.trail.length > 0) {
        ctx.beginPath(); ctx.arc(start[0], start[1], 7, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444"; ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("START", start[0], start[1] - 12);
        ctx.textAlign = "left";
      }

      /* Info panel */
      roundRect(ctx, W - 170, 35, 155, 100, 8);
      ctx.fillStyle = "#161b22"; ctx.fill();
      ctx.strokeStyle = "#30363d"; ctx.lineWidth = 1; ctx.stroke();

      ctx.fillStyle = "#3b82f6"; ctx.font = "bold 11px 'Inter',sans-serif";
      ctx.fillText("Distance (path):", W - 163, 58);
      ctx.fillStyle = "#e2e8f0"; ctx.font = "13px 'Inter',sans-serif";
      ctx.fillText(`${Math.round(dist)} px`, W - 163, 75);

      ctx.fillStyle = "#10b981"; ctx.font = "bold 11px 'Inter',sans-serif";
      ctx.fillText("Displacement (→):", W - 163, 98);
      ctx.fillStyle = "#e2e8f0"; ctx.font = "13px 'Inter',sans-serif";
      if (S.trail.length > 0) {
        const d = Math.hypot(cur[0] - start[0], cur[1] - start[1]);
        ctx.fillText(`${Math.round(d)} px`, W - 163, 115);
      }

      /* Legend */
      ctx.strokeStyle = "#3b82f660"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(12, H-18); ctx.lineTo(42, H-18); ctx.stroke();
      ctx.fillStyle = "#8b949e"; ctx.font = "10px sans-serif";
      ctx.fillText("Path (distance)", 50, H-14);
      drawArrow(ctx, 180, H-18, 210, H-18, "#10b981", 2, 8);
      ctx.fillText("Displacement vector", 218, H-14);

      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, speed]);

  return <canvas ref={canvasRef} width={600} height={350} className={styles.simCanvas} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * SIMULATION 2: SpeedometerSim — Speed & Velocity
 * Animated speedometer dial + velocity vector showing direction changes.
 * ═══════════════════════════════════════════════════════════════════════════ */
function SpeedometerSim({ running, speed }: { running: boolean; speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const stateRef  = useRef({
    t: 0,
    carX: 60, carY: 220,
    carVx: 2, carVy: 0,
    spd: 0, heading: 0,
    trail: [] as [number,number][],
  });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const S = stateRef.current;

    /* Circular road path */
    const roadCX = 240, roadCY = 195, roadR = 130;

    const tick = () => {
      if (running) {
        S.t += 0.018 * speed;
        S.carX = roadCX + roadR * Math.cos(S.t - Math.PI / 2);
        S.carY = roadCY + roadR * Math.sin(S.t - Math.PI / 2);
        S.heading = S.t;
        S.spd = roadR * 0.018 * speed * 60; /* pixels/sec → display as km/h-like */
        S.trail.push([S.carX, S.carY]);
        if (S.trail.length > 600) S.trail.shift();
      }

      ctx.fillStyle = "#0d1117"; ctx.fillRect(0, 0, W, H);

      /* Title */
      ctx.fillStyle = "#58a6ff"; ctx.font = "bold 13px 'Inter',sans-serif";
      ctx.fillText("Speed vs Velocity — Magnitude vs Direction", 12, 22);

      /* Road circle */
      ctx.beginPath(); ctx.arc(roadCX, roadCY, roadR + 15, 0, Math.PI * 2);
      ctx.strokeStyle = "#374151"; ctx.lineWidth = 30; ctx.stroke();
      ctx.beginPath(); ctx.arc(roadCX, roadCY, roadR + 15, 0, Math.PI * 2);
      ctx.strokeStyle = "#4b5563"; ctx.lineWidth = 26; ctx.stroke();
      /* Road markings */
      for (let a = 0; a < 2 * Math.PI; a += Math.PI / 6) {
        const rx = roadCX + (roadR + 15) * Math.cos(a);
        const ry = roadCY + (roadR + 15) * Math.sin(a);
        ctx.beginPath(); ctx.arc(rx, ry, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#fff6"; ctx.fill();
      }

      /* Car trail */
      if (S.trail.length > 1) {
        ctx.beginPath(); ctx.moveTo(S.trail[0][0], S.trail[0][1]);
        for (const [x, y] of S.trail) ctx.lineTo(x, y);
        ctx.strokeStyle = "#f59e0b40"; ctx.lineWidth = 2; ctx.stroke();
      }

      /* Car */
      ctx.save();
      ctx.translate(S.carX, S.carY);
      ctx.rotate(S.heading);
      roundRect(ctx, -16, -9, 32, 18, 4);
      ctx.fillStyle = "#2563eb"; ctx.fill();
      ctx.fillStyle = "#93c5fd"; roundRect(ctx, -8, -7, 18, 8, 3); ctx.fill();
      /* wheels */
      for (const [wx, wy] of [[-10, -10], [8, -10], [-10, 8], [8, 8]]) {
        ctx.beginPath(); ctx.arc(wx, wy, 4, 0, Math.PI*2);
        ctx.fillStyle = "#1f2937"; ctx.fill();
      }
      ctx.restore();

      /* Velocity vector (direction of motion) */
      const vx = Math.cos(S.heading) * 50, vy = Math.sin(S.heading) * 50;
      drawArrow(ctx, S.carX, S.carY, S.carX + vx, S.carY + vy, "#10b981", 2.5, 12);
      ctx.fillStyle = "#10b981"; ctx.font = "bold 10px sans-serif";
      ctx.fillText("velocity →", S.carX + vx + 5, S.carY + vy);

      /* Centripetal arrow (toward centre) */
      const cx2 = roadCX - S.carX, cy2 = roadCY - S.carY;
      const clen = Math.hypot(cx2, cy2);
      if (clen > 0) {
        drawArrow(ctx, S.carX, S.carY, S.carX + cx2 / clen * 40, S.carY + cy2 / clen * 40, "#ef4444", 2, 10);
        ctx.fillStyle = "#ef4444"; ctx.font = "9px sans-serif";
        ctx.fillText("centripetal", S.carX + cx2 / clen * 45, S.carY + cy2 / clen * 45);
      }

      /* Right panel — Speedometer */
      const spX = 420, spY = 60, spR = 80;
      ctx.beginPath(); ctx.arc(spX, spY + spR, spR, Math.PI, 2 * Math.PI);
      ctx.strokeStyle = "#30363d"; ctx.lineWidth = 8; ctx.stroke();
      /* Speed arc */
      const maxSpd = 100;
      const fraction = Math.min(1, S.spd / maxSpd);
      ctx.beginPath(); ctx.arc(spX, spY + spR, spR, Math.PI, Math.PI + fraction * Math.PI);
      ctx.strokeStyle = fraction > 0.7 ? "#ef4444" : fraction > 0.4 ? "#f59e0b" : "#10b981";
      ctx.lineWidth = 8; ctx.stroke();
      /* Needle */
      const needleAngle = Math.PI + fraction * Math.PI;
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(spX, spY + spR);
      ctx.lineTo(spX + (spR - 10) * Math.cos(needleAngle), spY + spR + (spR - 10) * Math.sin(needleAngle));
      ctx.stroke();
      /* Speed display */
      ctx.fillStyle = "#e2e8f0"; ctx.font = "bold 22px 'JetBrains Mono',monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${Math.round(S.spd)}`, spX, spY + spR + 30);
      ctx.fillStyle = "#8b949e"; ctx.font = "11px sans-serif";
      ctx.fillText("km/h  (SPEED = constant)", spX, spY + spR + 48);

      /* Key insight box */
      roundRect(ctx, 385, spY + spR + 60, 190, 60, 6);
      ctx.fillStyle = "#161b22"; ctx.fill();
      ctx.strokeStyle = "#30363d"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#8b949e"; ctx.font = "10px 'Inter',sans-serif"; ctx.textAlign = "left";
      ctx.fillText("Speed = |velocity| = constant", 393, spY + spR + 80);
      ctx.fillStyle = "#f59e0b";
      ctx.fillText("⚡ Velocity CHANGES direction", 393, spY + spR + 98);
      ctx.fillText("   every instant on the curve!", 393, spY + spR + 111);

      ctx.textAlign = "left";
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, speed]);

  return <canvas ref={canvasRef} width={600} height={350} className={styles.simCanvas} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * SIMULATION 3: AccelTrack — Uniformly Accelerating Car + Live v-t Graph
 * ═══════════════════════════════════════════════════════════════════════════ */
function AccelTrack({ running, speed }: { running: boolean; speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const stateRef  = useRef({ t: 0, u: 5, a: 3, v: 5, x: 40, vtData: [] as [number,number][] });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const S = stateRef.current;

    const tick = () => {
      if (running) {
        S.t  += 0.04 * speed;
        S.v   = Math.max(0, S.u + S.a * S.t);
        S.x  += S.v * 0.3 * speed;
        S.vtData.push([S.t, S.v]);
        if (S.vtData.length > 200) S.vtData.shift();
        /* Reset when car leaves screen */
        if (S.x > W + 20) { S.t = 0; S.v = S.u; S.x = 40; S.vtData = []; }
      }

      ctx.fillStyle = "#0d1117"; ctx.fillRect(0, 0, W, H);

      /* Title */
      ctx.fillStyle = "#58a6ff"; ctx.font = "bold 13px 'Inter',sans-serif";
      ctx.fillText(`Uniform Acceleration: u=${S.u} m/s, a=${S.a} m/s²`, 12, 22);

      /* Road */
      ctx.fillStyle = "#1f2937"; ctx.fillRect(0, 155, W, 60);
      ctx.fillStyle = "#374151"; ctx.fillRect(0, 155, W, 3);
      ctx.fillStyle = "#374151"; ctx.fillRect(0, 212, W, 3);
      /* Road markings */
      for (let x = 0; x < W; x += 60) {
        ctx.fillStyle = "#fbbf2480";
        ctx.fillRect(x, 183, 35, 4);
      }

      /* Distance ruler */
      ctx.fillStyle = "#30363d"; ctx.fillRect(0, 218, W, 20);
      for (let i = 0; i <= 12; i++) {
        const rx = i * 50;
        ctx.fillStyle = "#6b7280"; ctx.fillRect(rx, 218, 1, i % 5 === 0 ? 12 : 7);
        if (i % 5 === 0) {
          ctx.fillStyle = "#9ca3af"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
          ctx.fillText(`${i * 5}m`, rx, 244);
        }
      }
      ctx.textAlign = "left";

      /* Car */
      const carX = S.x;
      ctx.save(); ctx.translate(carX, 175);
      /* Car body */
      roundRect(ctx, -25, -16, 50, 28, 5);
      ctx.fillStyle = "#dc2626"; ctx.fill();
      /* Windshield */
      ctx.fillStyle = "#93c5fd50"; roundRect(ctx, -15, -14, 28, 12, 3); ctx.fill();
      /* Exhaust particles */
      if (running) {
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(-28 - i * 6 + rand(-2,2), rand(-4, 4), rand(2, 4), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(156,163,175,${0.6 - i * 0.2})`; ctx.fill();
        }
      }
      /* Wheels */
      for (const [wx, wy] of [[-16, 12], [14, 12]]) {
        ctx.beginPath(); ctx.arc(wx, wy, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#1f2937"; ctx.fill();
        ctx.strokeStyle = "#6b7280"; ctx.lineWidth = 2; ctx.stroke();
        /* Rotating spokes */
        const angle = (S.t * 3) % (Math.PI * 2);
        for (let j = 0; j < 4; j++) {
          const sa = angle + j * Math.PI / 2;
          ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(wx, wy);
          ctx.lineTo(wx + 5 * Math.cos(sa), wy + 5 * Math.sin(sa)); ctx.stroke();
        }
      }
      ctx.restore();

      /* Speed display above car */
      ctx.fillStyle = "#fff"; ctx.font = "bold 13px 'JetBrains Mono',monospace";
      ctx.textAlign = "center";
      ctx.fillText(`v = ${S.v.toFixed(1)} m/s`, carX, 150);
      ctx.textAlign = "left";

      /* v-t Graph (right half of bottom) */
      const gx = 20, gy = 255, gw = W - 40, gh = 75;
      roundRect(ctx, gx, gy, gw, gh, 6);
      ctx.fillStyle = "#161b22"; ctx.fill();
      ctx.strokeStyle = "#30363d"; ctx.lineWidth = 1; ctx.stroke();

      ctx.fillStyle = "#8b949e"; ctx.font = "10px sans-serif";
      ctx.fillText("v-t Graph", gx + 4, gy + 14);
      ctx.textAlign = "right"; ctx.fillText("v(m/s)", gx + gw - 4, gy + 14);
      ctx.textAlign = "left";

      /* Plot v-t data */
      if (S.vtData.length > 1) {
        const maxT = 25, maxV = 90;
        ctx.beginPath();
        for (let i = 0; i < S.vtData.length; i++) {
          const [tt, vv] = S.vtData[i];
          const px = gx + (tt / maxT) * (gw - 20) + 10;
          const py = gy + gh - 10 - (vv / maxV) * (gh - 20);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2; ctx.stroke();

        /* Fill area under curve = displacement */
        const firstT = S.vtData[0][0], lastT = S.vtData[S.vtData.length - 1][0];
        ctx.beginPath();
        for (const [tt, vv] of S.vtData) {
          const px = gx + (tt / maxT) * (gw - 20) + 10;
          const py = gy + gh - 10 - (vv / maxV) * (gh - 20);
          ctx.lineTo(px, py);
        }
        const lpx = gx + (lastT / maxT) * (gw - 20) + 10;
        const fpx = gx + (firstT / maxT) * (gw - 20) + 10;
        ctx.lineTo(lpx, gy + gh - 10); ctx.lineTo(fpx, gy + gh - 10);
        ctx.closePath();
        ctx.fillStyle = "#f59e0b20"; ctx.fill();
      }

      /* Equations */
      const eqX = W - 200, eqY = 260;
      ctx.fillStyle = "#8b949e"; ctx.font = "10px 'Inter',sans-serif";
      ctx.fillText(`v = u + at = ${S.u} + ${S.a}×${S.t.toFixed(1)} = ${S.v.toFixed(1)}`, eqX, eqY);
      const disp = S.u * S.t + 0.5 * S.a * S.t * S.t;
      ctx.fillText(`s = ut + ½at² = ${disp.toFixed(1)} m`, eqX, eqY + 18);

      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, speed]);

  return <canvas ref={canvasRef} width={600} height={350} className={styles.simCanvas} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * SIMULATION 4: FreeFall — Galileo's experiment + live s-t graph
 * ═══════════════════════════════════════════════════════════════════════════ */
function FreeFall({ running, speed }: { running: boolean; speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const stateRef  = useRef({ t: 0, y: 50, v: 0, trail: [] as number[], stData: [] as [number,number][] });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const S = stateRef.current;
    const g = 9.8;

    const tick = () => {
      if (running) {
        S.t += 0.03 * speed;
        S.v = g * S.t;
        S.y = 50 + 0.5 * g * S.t * S.t * 2.5; /* scaled for visibility */
        S.trail.push(S.y);
        if (S.trail.length > 300) S.trail.shift();
        S.stData.push([S.t, S.y - 50]);
        if (S.stData.length > 150) S.stData.shift();
        if (S.y > H - 40) { S.t = 0; S.y = 50; S.v = 0; S.trail = []; S.stData = []; }
      }

      ctx.fillStyle = "#0d1117"; ctx.fillRect(0, 0, W, H);

      /* Title */
      ctx.fillStyle = "#f59e0b"; ctx.font = "bold 13px 'Inter',sans-serif";
      ctx.fillText("Free Fall Under Gravity  (g = 9.8 m/s²)", 12, 22);

      /* Building / tower */
      ctx.fillStyle = "#1e3a5f"; ctx.fillRect(40, 30, 70, H - 50);
      /* Floor levels */
      for (let fy = 50; fy < H; fy += 40) {
        ctx.fillStyle = "#1a2e4a"; ctx.fillRect(40, fy, 70, 2);
        ctx.fillStyle = "#4b5563"; ctx.font = "9px sans-serif";
        ctx.fillText(`${Math.round((fy - 30) * 0.4)}m`, 14, fy + 4);
      }

      /* Drop trail */
      for (let i = 1; i < S.trail.length; i++) {
        ctx.beginPath(); ctx.arc(75, S.trail[i], 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251,191,36,${i / S.trail.length * 0.5})`; ctx.fill();
      }

      /* Ball */
      const ballGrad = ctx.createRadialGradient(72, S.y - 3, 2, 75, S.y, 12);
      ballGrad.addColorStop(0, "#fde68a"); ballGrad.addColorStop(1, "#b45309");
      ctx.beginPath(); ctx.arc(75, S.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = ballGrad; ctx.fill();
      ctx.strokeStyle = "#fff3"; ctx.lineWidth = 1; ctx.stroke();

      /* Velocity vector */
      if (S.v > 0) {
        drawArrow(ctx, 95, S.y, 95, S.y + Math.min(60, S.v * 2), "#ef4444", 2, 10);
        ctx.fillStyle = "#ef4444"; ctx.font = "10px sans-serif";
        ctx.fillText(`v=${S.v.toFixed(1)}m/s`, 102, S.y + 15);
      }

      /* Gravity arrow */
      drawArrow(ctx, 20, S.y - 20, 20, S.y + 30, "#f59e0b", 2, 8);
      ctx.fillStyle = "#f59e0b"; ctx.font = "10px sans-serif";
      ctx.fillText("g", 24, S.y);

      /* Right panel: s-t and v-t displays */
      const gx = 150, gy = 40, gw = 430, gh = 130;
      /* s-t graph */
      roundRect(ctx, gx, gy, gw / 2 - 5, gh, 6);
      ctx.fillStyle = "#161b22"; ctx.fill(); ctx.strokeStyle = "#30363d"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#8b949e"; ctx.font = "10px sans-serif";
      ctx.fillText("s-t graph (curved = acceleration)", gx + 5, gy + 14);

      if (S.stData.length > 1) {
        const maxT = 8, maxS = 300;
        ctx.beginPath();
        for (let i = 0; i < S.stData.length; i++) {
          const px = gx + 8 + (S.stData[i][0] / maxT) * (gw / 2 - 20);
          const py = gy + gh - 8 - (S.stData[i][1] / maxS) * (gh - 20);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 2; ctx.stroke();
      }

      /* v-t graph */
      const gx2 = gx + gw / 2 + 5;
      roundRect(ctx, gx2, gy, gw / 2 - 5, gh, 6);
      ctx.fillStyle = "#161b22"; ctx.fill(); ctx.strokeStyle = "#30363d"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#8b949e"; ctx.font = "10px sans-serif";
      ctx.fillText("v-t graph (straight = uniform a)", gx2 + 5, gy + 14);

      if (S.stData.length > 1) {
        const maxT = 8, maxV = 80;
        ctx.beginPath();
        for (let i = 0; i < S.stData.length; i++) {
          const [tt] = S.stData[i];
          const vv = g * tt;
          const px = gx2 + 8 + (tt / maxT) * (gw / 2 - 20);
          const py = gy + gh - 8 - (vv / maxV) * (gh - 20);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "#f87171"; ctx.lineWidth = 2; ctx.stroke();
      }

      /* Data readout */
      ctx.fillStyle = "#e2e8f0"; ctx.font = "12px 'JetBrains Mono',monospace";
      ctx.fillText(`t = ${S.t.toFixed(2)} s`, gx, gy + gh + 25);
      ctx.fillText(`v = gt = ${S.v.toFixed(1)} m/s`, gx + 140, gy + gh + 25);
      ctx.fillText(`s = ½gt² = ${(0.5 * g * S.t * S.t).toFixed(2)} m`, gx + 310, gy + gh + 25);

      /* Equations */
      ctx.fillStyle = "#8b949e"; ctx.font = "11px 'Inter',sans-serif";
      ctx.fillText("v = gt    s = ½gt²    v² = 2gs", gx, gy + gh + 45);

      /* Ground */
      ctx.fillStyle = "#374151"; ctx.fillRect(0, H - 25, W, 25);
      ctx.fillStyle = "#6b7280"; ctx.font = "10px sans-serif";
      ctx.fillText("GROUND", W / 2 - 25, H - 10);

      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, speed]);

  return <canvas ref={canvasRef} width={600} height={350} className={styles.simCanvas} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * SIMULATION 5: CircularMotion — UCM with centripetal force & acceleration
 * ═══════════════════════════════════════════════════════════════════════════ */
function CircularMotion({ running, speed }: { running: boolean; speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const stateRef  = useRef({ theta: 0, trail: [] as [number,number][] });

  const R = 100, cx = 220, cy = 175, mass = 0.5;

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const S = stateRef.current;
    const omega = 1.5; /* angular velocity rad/s */

    const tick = () => {
      if (running) {
        S.theta += omega * 0.016 * speed;
        const px = cx + R * Math.cos(S.theta);
        const py = cy + R * Math.sin(S.theta);
        S.trail.push([px, py]);
        if (S.trail.length > 200) S.trail.shift();
      }

      ctx.fillStyle = "#0d1117"; ctx.fillRect(0, 0, W, H);

      /* Title */
      ctx.fillStyle = "#58a6ff"; ctx.font = "bold 13px 'Inter',sans-serif";
      ctx.fillText("Uniform Circular Motion — Centripetal Force & Acceleration", 12, 22);

      /* Orbit circle */
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "#30363d"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.stroke();
      ctx.setLineDash([]);

      /* Trail */
      if (S.trail.length > 1) {
        ctx.beginPath(); ctx.moveTo(S.trail[0][0], S.trail[0][1]);
        for (const [x, y] of S.trail) ctx.lineTo(x, y);
        ctx.strokeStyle = "#3b82f640"; ctx.lineWidth = 2; ctx.stroke();
      }

      const px = cx + R * Math.cos(S.theta);
      const py = cy + R * Math.sin(S.theta);
      const vx = -Math.sin(S.theta), vy = Math.cos(S.theta); /* tangent */

      /* String */
      ctx.strokeStyle = "#78716c"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();

      /* Centre pivot */
      ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#94a3b8"; ctx.fill();

      /* Velocity vector (tangential) */
      drawArrow(ctx, px, py, px + vx * 55, py + vy * 55, "#10b981", 2.5, 12);
      ctx.fillStyle = "#10b981"; ctx.font = "bold 10px sans-serif";
      ctx.fillText("v (velocity)", px + vx * 60, py + vy * 60);

      /* Centripetal force arrow (inward) */
      const fx = cx - px, fy = cy - py, flen = Math.hypot(fx, fy);
      drawArrow(ctx, px, py, px + fx / flen * 45, py + fy / flen * 45, "#ef4444", 2.5, 12);
      ctx.fillStyle = "#ef4444"; ctx.font = "bold 10px sans-serif";
      ctx.fillText("Fc", px + fx / flen * 50, py + fy / flen * 50);

      /* Ball */
      const bg = ctx.createRadialGradient(px - 4, py - 4, 2, px, py, 14);
      bg.addColorStop(0, "#818cf8"); bg.addColorStop(1, "#4338ca");
      ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.fillStyle = bg; ctx.fill();
      ctx.strokeStyle = "#a5b4fc50"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = "bold 8px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("m", px, py + 3); ctx.textAlign = "left";

      /* Right panel: formulas and values */
      const px2 = 360, py2 = 40;
      roundRect(ctx, px2, py2, 225, 265, 8);
      ctx.fillStyle = "#161b22"; ctx.fill();
      ctx.strokeStyle = "#30363d"; ctx.lineWidth = 1; ctx.stroke();

      const v = omega * R;
      const ac = omega * omega * R;
      const Fc = mass * ac;
      const T = (2 * Math.PI / omega).toFixed(2);

      ctx.fillStyle = "#58a6ff"; ctx.font = "bold 11px 'Inter',sans-serif";
      ctx.fillText("Live Values:", px2 + 10, py2 + 22);

      const entries: [string, string, string][] = [
        ["Radius",    "r",  `${R} m`],
        ["ω (omega)", "ω",  `${omega} rad/s`],
        ["Speed",     "v",  `${v.toFixed(1)} m/s`],
        ["Mass",      "m",  `${mass} kg`],
        ["Centripetal acc.", "ac", `${ac.toFixed(1)} m/s²`],
        ["Centripetal force","Fc", `${Fc.toFixed(1)} N`],
        ["Time period", "T", `${T} s`],
      ];

      entries.forEach(([name, , val], i) => {
        const ey = py2 + 42 + i * 28;
        ctx.fillStyle = "#6b7280"; ctx.font = "10px sans-serif";
        ctx.fillText(name, px2 + 10, ey);
        ctx.fillStyle = "#e2e8f0"; ctx.font = "bold 11px 'JetBrains Mono',monospace";
        ctx.fillText(val, px2 + 140, ey);
      });

      /* Formulas */
      roundRect(ctx, px2, py2 + 270, 225, 65, 6);
      ctx.fillStyle = "#0d1117"; ctx.fill();
      ctx.strokeStyle = "#3b82f630"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#60a5fa"; ctx.font = "11px 'JetBrains Mono',monospace";
      ctx.fillText("ac = v²/r = ω²r", px2 + 8, py2 + 290);
      ctx.fillText("Fc = mv²/r = mω²r", px2 + 8, py2 + 310);
      ctx.fillStyle = "#fbbf24";
      ctx.fillText("v = ωr  |  T = 2π/ω", px2 + 8, py2 + 328);

      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, speed]);

  return <canvas ref={canvasRef} width={600} height={350} className={styles.simCanvas} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * SIMULATION 6: SUVATAnimator — all 3 equations of motion animated
 * ═══════════════════════════════════════════════════════════════════════════ */
function SUVATAnimator({ running, speed }: { running: boolean; speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const stateRef  = useRef({ t: 0, u: 10, a: 2, vtPts: [] as [number,number][], stPts: [] as [number,number][] });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const S = stateRef.current;

    const tick = () => {
      if (running) {
        S.t += 0.05 * speed;
        if (S.t > 12) { S.t = 0; S.vtPts = []; S.stPts = []; }
        const v = S.u + S.a * S.t;
        const s = S.u * S.t + 0.5 * S.a * S.t * S.t;
        S.vtPts.push([S.t, v]);
        S.stPts.push([S.t, s]);
        if (S.vtPts.length > 300) S.vtPts.shift();
        if (S.stPts.length > 300) S.stPts.shift();
      }

      ctx.fillStyle = "#0d1117"; ctx.fillRect(0, 0, W, H);

      /* Title */
      ctx.fillStyle = "#f59e0b"; ctx.font = "bold 13px 'Inter',sans-serif";
      ctx.fillText("Three Equations of Motion — SUVAT Visualised", 12, 22);

      const v = S.u + S.a * S.t;
      const s = S.u * S.t + 0.5 * S.a * S.t * S.t;
      const v2 = S.u * S.u + 2 * S.a * s;

      /* Left: equation display cards */
      const eqs: [string, string, string, string][] = [
        ["#60a5fa", "Equation 1", "v = u + at", `${S.u} + ${S.a}×${S.t.toFixed(1)} = ${v.toFixed(1)}`],
        ["#34d399", "Equation 2", "s = ut + ½at²", `${S.u}×${S.t.toFixed(1)} + ½×${S.a}×${(S.t*S.t).toFixed(1)} = ${s.toFixed(1)}`],
        ["#f87171", "Equation 3", "v² = u² + 2as", `${(S.u*S.u).toFixed(0)} + 2×${S.a}×${s.toFixed(1)} = ${v2.toFixed(1)}`],
      ];

      eqs.forEach(([color, title, formula, value], i) => {
        const ey = 38 + i * 82;
        roundRect(ctx, 12, ey, 220, 75, 8);
        ctx.fillStyle = color + "18"; ctx.fill();
        ctx.strokeStyle = color + "60"; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = color; ctx.font = "bold 11px 'Inter',sans-serif";
        ctx.fillText(title, 20, ey + 18);
        ctx.fillStyle = "#e2e8f0"; ctx.font = "bold 14px 'JetBrains Mono',monospace";
        ctx.fillText(formula, 20, ey + 38);
        ctx.fillStyle = "#8b949e"; ctx.font = "11px 'Inter',sans-serif";
        ctx.fillText(`= ${value}`, 20, ey + 57);
      });

      /* Right: v-t graph (top) */
      const gx = 245, gy = 35, gw = 345, ghalf = 130;
      roundRect(ctx, gx, gy, gw, ghalf, 6);
      ctx.fillStyle = "#161b22"; ctx.fill();
      ctx.strokeStyle = "#30363d"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#8b949e"; ctx.font = "10px sans-serif";
      ctx.fillText("v-t graph: slope = acceleration (a)", gx + 5, gy + 14);

      if (S.vtPts.length > 1) {
        const maxT = 12, maxV = 40;
        ctx.beginPath();
        for (let i = 0; i < S.vtPts.length; i++) {
          const px2 = gx + 8 + (S.vtPts[i][0] / maxT) * (gw - 16);
          const py2 = gy + ghalf - 8 - (S.vtPts[i][1] / maxV) * (ghalf - 18);
          if (i === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
        }
        ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 2.5; ctx.stroke();

        /* Shaded area = displacement */
        const [lt, lv] = S.vtPts[S.vtPts.length - 1];
        ctx.beginPath();
        S.vtPts.forEach(([tt, vv], i) => {
          const px2 = gx + 8 + (tt / maxT) * (gw - 16);
          const py2 = gy + ghalf - 8 - (vv / maxV) * (ghalf - 18);
          if (i === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
        });
        ctx.lineTo(gx + 8 + (lt / maxT) * (gw - 16), gy + ghalf - 8);
        ctx.lineTo(gx + 8, gy + ghalf - 8);
        ctx.closePath();
        ctx.fillStyle = "#3b82f625"; ctx.fill();
        ctx.fillStyle = "#60a5fa80"; ctx.font = "9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("area = displacement s", gx + gw / 2, gy + ghalf - 20);
        ctx.textAlign = "left";
      }

      /* s-t graph (bottom) */
      const gy2 = gy + ghalf + 10;
      roundRect(ctx, gx, gy2, gw, ghalf, 6);
      ctx.fillStyle = "#161b22"; ctx.fill();
      ctx.strokeStyle = "#30363d"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#8b949e"; ctx.font = "10px sans-serif";
      ctx.fillText("s-t graph: parabola (uniform acceleration)", gx + 5, gy2 + 14);

      if (S.stPts.length > 1) {
        const maxT = 12, maxS = 600;
        ctx.beginPath();
        for (let i = 0; i < S.stPts.length; i++) {
          const px2 = gx + 8 + (S.stPts[i][0] / maxT) * (gw - 16);
          const py2 = gy2 + ghalf - 8 - (Math.min(S.stPts[i][1], maxS) / maxS) * (ghalf - 18);
          if (i === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
        }
        ctx.strokeStyle = "#34d399"; ctx.lineWidth = 2.5; ctx.stroke();
      }

      /* Current values */
      ctx.fillStyle = "#e2e8f0"; ctx.font = "11px 'JetBrains Mono',monospace";
      ctx.fillText(`t=${S.t.toFixed(1)}s  v=${v.toFixed(1)}m/s  s=${s.toFixed(1)}m`, gx + 4, gy2 + ghalf + 22);

      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, speed]);

  return <canvas ref={canvasRef} width={600} height={350} className={styles.simCanvas} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * TOPIC-TO-SIMULATION MAP
 * ═══════════════════════════════════════════════════════════════════════════ */

type SimDef = { label: string; description: string; Component: React.FC<{ running: boolean; speed: number }> };

const MOTION_SIMS: Record<string, SimDef[]> = {
  "distance-displacement": [
    { label: "Path Tracer",         description: "Distance (path length) vs displacement (straight line) — live comparison", Component: PathTracer },
    { label: "Speed vs Velocity",   description: "Car on circular road: constant speed, ever-changing velocity direction",    Component: SpeedometerSim },
    { label: "Acceleration Track",  description: "Uniform acceleration — v grows linearly with time",                        Component: AccelTrack },
    { label: "Free Fall",           description: "Galileo's free fall — s-t curve and v-t straight line",                   Component: FreeFall },
    { label: "Circular Motion",     description: "UCM: velocity is tangential, centripetal force is inward",                Component: CircularMotion },
    { label: "SUVAT Equations",     description: "All 3 equations of motion animated side by side",                         Component: SUVATAnimator },
  ],
  "speed-velocity": [
    { label: "Speed vs Velocity",   description: "Speedometer + velocity vector on circular track",                         Component: SpeedometerSim },
    { label: "Path Tracer",         description: "Scalar distance vs vector displacement illustrated",                      Component: PathTracer },
    { label: "Acceleration Track",  description: "How velocity changes with uniform acceleration",                          Component: AccelTrack },
    { label: "Circular Motion",     description: "Constant speed but velocity direction changes every instant",             Component: CircularMotion },
    { label: "SUVAT Equations",     description: "v = u + at — velocity equation animated live",                           Component: SUVATAnimator },
    { label: "Free Fall",           description: "Terminal velocity and speed vs velocity in free fall",                    Component: FreeFall },
  ],
  "acceleration": [
    { label: "Acceleration Track",  description: "Uniform acceleration: v-t graph is a straight line with slope = a",      Component: AccelTrack },
    { label: "SUVAT Equations",     description: "Three equations showing how acceleration affects s, v, and t",           Component: SUVATAnimator },
    { label: "Free Fall",           description: "Acceleration due to gravity — s-t parabola, v-t line",                  Component: FreeFall },
    { label: "Circular Motion",     description: "Centripetal acceleration: ac = v²/r = ω²r",                             Component: CircularMotion },
    { label: "Speed vs Velocity",   description: "Velocity changes during circular motion → centripetal acceleration",     Component: SpeedometerSim },
    { label: "Path Tracer",         description: "How displacement and distance relate to acceleration",                   Component: PathTracer },
  ],
  "equations-of-motion": [
    { label: "SUVAT Equations",     description: "All 3 SUVAT equations — v-t and s-t graphs animated together",          Component: SUVATAnimator },
    { label: "Free Fall",           description: "Galileo's experiment — v = gt and s = ½gt² in action",                  Component: FreeFall },
    { label: "Acceleration Track",  description: "Equation 1: v = u + at shown with animated car",                        Component: AccelTrack },
    { label: "Circular Motion",     description: "Derived equations: v = ωr, ac = ω²r, T = 2π/ω",                        Component: CircularMotion },
    { label: "Speed vs Velocity",   description: "Speed and velocity in different types of motion",                        Component: SpeedometerSim },
    { label: "Path Tracer",         description: "Displacement from equations vs path traced",                             Component: PathTracer },
  ],
  "uniform-circular-motion": [
    { label: "Circular Motion",     description: "Full UCM: centripetal force, acceleration, velocity, period",            Component: CircularMotion },
    { label: "Speed vs Velocity",   description: "Speed constant, velocity direction changes — UCM is NOT uniform velocity", Component: SpeedometerSim },
    { label: "SUVAT Equations",     description: "UCM compared with linear uniform acceleration",                          Component: SUVATAnimator },
    { label: "Acceleration Track",  description: "Linear uniform acceleration vs circular centripetal acceleration",       Component: AccelTrack },
    { label: "Free Fall",           description: "Satellites: free fall + circular orbit",                                 Component: FreeFall },
    { label: "Path Tracer",         description: "Circular path: distance = 2πr but displacement = 0 per revolution",    Component: PathTracer },
  ],
};

const DEFAULT_MOTION_SIMS: SimDef[] = [
  { label: "Path Tracer",         description: "Distance vs displacement — a fundamental distinction",          Component: PathTracer },
  { label: "Speed vs Velocity",   description: "Speedometer + direction — speed is scalar, velocity is vector", Component: SpeedometerSim },
  { label: "Acceleration",        description: "Uniformly accelerating car with live v-t graph",                Component: AccelTrack },
  { label: "SUVAT",               description: "All three equations of motion animated together",               Component: SUVATAnimator },
  { label: "Free Fall",           description: "Gravity, s-t curve, and v-t straight line",                    Component: FreeFall },
  { label: "Circular Motion",     description: "Uniform circular motion: centripetal force and velocity",       Component: CircularMotion },
];

/* ─────────────────────────────────────────────────────────────────────────
 * MotionSimulation — exported default component
 * ───────────────────────────────────────────────────────────────────────── */
export default function MotionSimulation({ topicId }: { topicId: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [running, setRunning]     = useState(true);
  const [speed, setSpeed]         = useState(1);
  const [expanded, setExpanded]   = useState(false);

  const sims   = MOTION_SIMS[topicId] ?? DEFAULT_MOTION_SIMS;
  const active = sims[activeIdx];

  return (
    <div className={styles.simulationContainer}>
      <button className={styles.simToggleBtn} onClick={() => setExpanded(v => !v)}>
        <span className={styles.simToggleIcon}>{expanded ? "▼" : "▶"}</span>
        <span className={styles.simToggleText}>
          📐 Interactive Simulations — {sims.length} Experiments Available
        </span>
        <span className={styles.simToggleBadge}>{expanded ? "Hide" : "Show"}</span>
      </button>

      {expanded && (
        <div className={styles.simBody}>
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

          <div className={styles.simDesc}>
            <span className={styles.simDescIcon}>🔬</span>
            <span>{active.description}</span>
          </div>

          <div className={styles.simCanvasWrapper}>
            <active.Component running={running} speed={speed} />
          </div>

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
            <span className={styles.simHint}>{activeIdx + 1} of {sims.length} simulations</span>
          </div>
        </div>
      )}
    </div>
  );
}
