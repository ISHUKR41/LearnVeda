"use client";
/**
 * FILE: AdvancedSim1.tsx
 * LOCATION: src/components/physics/AdvancedSim1.tsx
 * PURPOSE: 15 professional canvas-based physics simulations for
 *          Topic 1: Balanced & Unbalanced Forces (Class 9 Science).
 *          Each simulation uses requestAnimationFrame, real physics
 *          equations, and interactive sliders.
 * EXPORTS: AdvancedTopic1Sims (renders all 15 as scrollable cards)
 * LAST UPDATED: 2026-05-30
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ════════════════════════════════════════════════════════
 * SHARED CANVAS DRAWING UTILITIES
 * ════════════════════════════════════════════════════════ */

function drawArrow(
  g: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number,
  color: string, lw = 2.5, headSize = 10
) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 4) return;
  const ang = Math.atan2(dy, dx);
  g.save();
  g.strokeStyle = color; g.fillStyle = color; g.lineWidth = lw; g.lineCap = "round";
  const hs = Math.min(headSize, len * 0.35);
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x2 - hs * 0.8 * Math.cos(ang), y2 - hs * 0.8 * Math.sin(ang));
  g.stroke();
  g.beginPath();
  g.moveTo(x2, y2);
  g.lineTo(x2 - hs * Math.cos(ang - 0.42), y2 - hs * Math.sin(ang - 0.42));
  g.lineTo(x2 - hs * Math.cos(ang + 0.42), y2 - hs * Math.sin(ang + 0.42));
  g.closePath(); g.fill();
  g.restore();
}

function txt(
  g: CanvasRenderingContext2D, s: string, x: number, y: number,
  color = "#e2e8f0", size = 11, align: CanvasTextAlign = "center"
) {
  g.save();
  g.font = `bold ${size}px 'Inter',sans-serif`;
  g.fillStyle = color; g.textAlign = align;
  g.fillText(s, x, y);
  g.restore();
}

function bg(g: CanvasRenderingContext2D, w: number, h: number) {
  const gr = g.createLinearGradient(0, 0, w, h);
  gr.addColorStop(0, "#0d1117"); gr.addColorStop(1, "#161b22");
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.strokeStyle = "rgba(255,255,255,0.03)"; g.lineWidth = 1;
  for (let x = 40; x < w; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  for (let y = 40; y < h; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
}

function rr(
  g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number,
  r: number, fill: string, stroke?: string, sw = 1.5
) {
  g.save();
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fillStyle = fill; g.fill();
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = sw; g.stroke(); }
  g.restore();
}

function infoBox(g: CanvasRenderingContext2D, lines: [string, string][], x: number, y: number, w = 170) {
  const pad = 8, lh = 16, h = lines.length * lh + pad * 2;
  rr(g, x, y, w, h, 6, "rgba(15,23,42,0.88)", "rgba(99,102,241,0.25)");
  lines.forEach(([label, val], i) => {
    txt(g, label, x + pad, y + pad + i * lh + 11, "#94a3b8", 10, "left");
    txt(g, val, x + w - pad, y + pad + i * lh + 11, "#60a5fa", 10, "right");
  });
}

const C = {
  blue: "#3b82f6", red: "#ef4444", green: "#10b981", amber: "#f59e0b",
  purple: "#8b5cf6", cyan: "#06b6d4", white: "#f1f5f9", dim: "#94a3b8",
  orange: "#f97316", pink: "#ec4899", teal: "#14b8a6",
};

const card: React.CSSProperties = {
  background: "linear-gradient(135deg,#0f172a 0%,#1a2332 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 14, padding: "16px 20px", marginBottom: 20,
};
const titleStyle: React.CSSProperties = {
  color: "#e2e8f0", fontSize: 14, fontWeight: 700,
  marginBottom: 10, display: "flex", alignItems: "center", gap: 6,
};
const eqStyle: React.CSSProperties = {
  color: "#94a3b8", fontSize: 11, fontFamily: "monospace",
  marginTop: 8, background: "rgba(99,102,241,0.08)",
  padding: "5px 10px", borderRadius: 6, display: "inline-block",
};

function SliderCtrl({
  label: l, value, min, max, step = 1, onChange, unit = "",
}: {
  label: string; value: number; min: number; max: number;
  step?: number; onChange: (v: number) => void; unit?: string;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{ color: "#94a3b8", fontSize: 11 }}>{l}</span>
        <span style={{ color: "#3b82f6", fontWeight: 700, fontSize: 12 }}>
          {typeof value === "number" && !Number.isInteger(value) ? value.toFixed(2) : value}{unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#3b82f6", cursor: "pointer" }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════
 * SIM 1: INCLINED PLANE FORCE DECOMPOSITION
 * Shows: Weight, Normal Force, Friction on a slope
 * ════════════════════════════════════════════════════════ */
function InclinedPlaneSim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [angleDeg, setAngle] = useState(30);
  const [mass, setMass] = useState(5);
  const [mu, setMu] = useState(0.35);
  const posRef = useRef(0.3); // 0-1 along incline
  const velRef = useRef(0);

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const GR = 9.8;
    const θ = angleDeg * Math.PI / 180;
    const N = mass * GR * Math.cos(θ);
    const fGrav = mass * GR * Math.sin(θ);
    const fFric = mu * N;
    const fNet = fGrav - fFric;
    const acc = fNet / mass;

    posRef.current = 0.25;
    velRef.current = 0;
    let raf = 0;

    const frame = () => {
      velRef.current += acc * 0.0166;
      posRef.current += velRef.current * 0.0166 * 0.8;
      if (posRef.current < 0.05) { posRef.current = 0.05; velRef.current = 0; }
      if (posRef.current > 0.85) { posRef.current = 0.85; velRef.current = 0; }

      g.clearRect(0, 0, W, H);
      bg(g, W, H);

      // Draw incline
      const len = 260, ox = 60, oy = H - 45;
      const tx = ox + len * Math.cos(θ), ty = oy - len * Math.sin(θ);

      g.save();
      g.beginPath();
      g.moveTo(ox, oy); g.lineTo(tx, ty); g.lineTo(tx, oy); g.closePath();
      g.fillStyle = "rgba(30,41,59,0.7)"; g.fill();
      g.strokeStyle = "#475569"; g.lineWidth = 2.5; g.stroke();
      g.restore();

      // Ground line
      g.strokeStyle = "#334155"; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(ox - 20, oy); g.lineTo(tx + 20, oy); g.stroke();

      // Angle arc
      g.strokeStyle = C.amber; g.lineWidth = 1.5;
      g.beginPath(); g.arc(ox, oy, 38, -θ, 0); g.stroke();
      txt(g, `θ=${angleDeg}°`, ox + 48, oy - 10, C.amber, 11);

      // Block position on incline
      const t = posRef.current;
      const bx = ox + (50 + t * (len - 90)) * Math.cos(θ);
      const by = oy - (50 + t * (len - 90)) * Math.sin(θ);
      const bw = 30, bh = 22;

      g.save();
      g.translate(bx, by);
      g.rotate(-θ);
      rr(g, -bw / 2, -bh, bw, bh, 4, "#1d4ed8", "#3b82f6");
      txt(g, `${mass}kg`, 0, -bh / 2 + 4, "#fff", 10);
      g.restore();

      // Weight arrow (straight down)
      const mgLen = Math.min(mass * 3.8, 75);
      drawArrow(g, bx, by - bh * 0.4, bx, by - bh * 0.4 + mgLen, C.red, 2.5);
      txt(g, `mg=${(mass * GR).toFixed(0)}N`, bx + 8, by + 35, C.red, 10, "left");

      // Normal force arrow (perpendicular to incline)
      const nLen = Math.min(N * 0.4, 65);
      drawArrow(g, bx, by - bh, bx - nLen * Math.sin(θ), by - bh - nLen * Math.cos(θ), C.green, 2.5);
      txt(g, `N=${N.toFixed(1)}N`, bx - 45, by - bh - 20, C.green, 10);

      // Friction arrow (opposing motion)
      if (fFric > 0.5) {
        const fDir = fNet > 0 ? -1 : 1;
        const fLen = Math.min(fFric * 0.4, 55);
        drawArrow(g, bx, by - bh / 2, bx + fDir * fLen * Math.cos(θ), by - bh / 2 + fDir * fLen * Math.sin(θ) * (-1), C.amber, 2.5);
        txt(g, `f=${fFric.toFixed(1)}N`, bx + 38, by - bh / 2 + 8, C.amber, 10, "left");
      }

      // Info box
      const balanced = Math.abs(fNet) < 0.3;
      infoBox(g, [
        ["Normal N", `${N.toFixed(1)} N`],
        ["Gravity ∥", `${fGrav.toFixed(1)} N`],
        ["Friction", `${fFric.toFixed(1)} N`],
        ["Net Force", `${fNet.toFixed(1)} N`],
        ["Status", balanced ? "Balanced ✓" : "Sliding ⚡"],
      ], W - 180, 12, 168);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [angleDeg, mass, mu]);

  return (
    <div style={card}>
      <div style={titleStyle}>📐 Sim 1 — Inclined Plane Force Decomposition</div>
      <canvas ref={cvs} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10 }}>
        <SliderCtrl label="Angle θ" value={angleDeg} min={1} max={65} onChange={setAngle} unit="°" />
        <SliderCtrl label="Mass" value={mass} min={1} max={20} onChange={setMass} unit=" kg" />
        <SliderCtrl label="Friction μ" value={mu} min={0} max={0.9} step={0.05} onChange={setMu} />
      </div>
      <div style={eqStyle}>N = mg·cosθ &nbsp;|&nbsp; F∥ = mg·sinθ &nbsp;|&nbsp; f = μN &nbsp;|&nbsp; Block slides when F∥ {">"} f</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
 * SIM 2: ATWOOD MACHINE / PULLEY BALANCE
 * ════════════════════════════════════════════════════════ */
function AtwoodMachineSim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [m1, setM1] = useState(4);
  const [m2, setM2] = useState(6);
  const posRef = useRef(0); // displacement of m1 (positive = m1 goes up)
  const velRef = useRef(0);

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const GR = 9.8;
    const mTotal = m1 + m2;
    const a = mTotal > 0 ? ((m2 - m1) * GR) / mTotal : 0;
    const T = mTotal > 0 ? (2 * m1 * m2 * GR) / mTotal : 0;

    posRef.current = 0;
    velRef.current = 0;
    let raf = 0;

    const frame = () => {
      velRef.current += a * 0.016;
      posRef.current += velRef.current * 0.016 * 15;
      if (Math.abs(posRef.current) > 70) {
        posRef.current = Math.sign(posRef.current) * 70;
        velRef.current = 0;
      }

      g.clearRect(0, 0, W, H);
      bg(g, W, H);

      const cx = W / 2, cy = 50;
      const ropeH = 140;

      // Pulley
      g.strokeStyle = "#64748b"; g.lineWidth = 2;
      g.beginPath(); g.arc(cx, cy, 18, 0, Math.PI * 2); g.stroke();
      g.fillStyle = "#1e293b"; g.fill();
      g.fillStyle = "#475569"; g.beginPath(); g.arc(cx, cy, 7, 0, Math.PI * 2); g.fill();

      // Support beam
      g.strokeStyle = "#475569"; g.lineWidth = 4;
      g.beginPath(); g.moveTo(cx - 40, cy - 25); g.lineTo(cx + 40, cy - 25); g.stroke();

      // Ropes
      const y1Top = cy + 18, y1Bot = cy + ropeH - posRef.current;
      const y2Top = cy + 18, y2Bot = cy + ropeH + posRef.current;

      g.strokeStyle = "#94a3b8"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(cx - 8, y1Top); g.lineTo(cx - 8, y1Bot - 25); g.stroke();
      g.beginPath(); g.moveTo(cx + 8, y2Top); g.lineTo(cx + 8, y2Bot - 25); g.stroke();

      // Mass 1 (left)
      const bw = 44, bh = 28;
      rr(g, cx - 8 - bw / 2, y1Bot - 25, bw, bh, 5, m1 < m2 ? "#1d4ed8" : "#7c3aed", "#60a5fa");
      txt(g, `m₁=${m1}kg`, cx - 8, y1Bot - 25 + bh / 2 + 4, "#fff", 11);
      // Weight arrow
      drawArrow(g, cx - 8, y1Bot + bh - 25, cx - 8, y1Bot + bh - 25 + m1 * 3.5, C.red, 2);
      txt(g, `${(m1 * GR).toFixed(0)}N`, cx - 8 - 30, y1Bot + bh + 5, C.red, 10, "left");
      // Tension arrow
      drawArrow(g, cx - 8, y1Bot - 25, cx - 8, y1Bot - 25 - Math.min(T * 0.18, 50), C.green, 2);

      // Mass 2 (right)
      rr(g, cx + 8 - bw / 2, y2Bot - 25, bw, bh, 5, m2 > m1 ? "#b45309" : "#7c3aed", "#f59e0b");
      txt(g, `m₂=${m2}kg`, cx + 8, y2Bot - 25 + bh / 2 + 4, "#fff", 11);
      // Weight arrow
      drawArrow(g, cx + 8, y2Bot + bh - 25, cx + 8, y2Bot + bh - 25 + m2 * 3.5, C.red, 2);
      txt(g, `${(m2 * GR).toFixed(0)}N`, cx + 8 + 4, y2Bot + bh + 5, C.red, 10, "left");
      // Tension arrow
      drawArrow(g, cx + 8, y2Bot - 25, cx + 8, y2Bot - 25 - Math.min(T * 0.18, 50), C.green, 2);

      infoBox(g, [
        ["Tension T", `${T.toFixed(1)} N`],
        ["Acceleration a", `${Math.abs(a).toFixed(2)} m/s²`],
        ["Direction", a > 0.1 ? "m₂ falls ↓" : a < -0.1 ? "m₁ falls ↓" : "Balanced ✓"],
      ], W - 175, 12, 163);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [m1, m2]);

  return (
    <div style={card}>
      <div style={titleStyle}>⚖️ Sim 2 — Atwood Machine (Pulley Balance)</div>
      <canvas ref={cvs} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <SliderCtrl label="Mass m₁ (left)" value={m1} min={1} max={20} onChange={setM1} unit=" kg" />
        <SliderCtrl label="Mass m₂ (right)" value={m2} min={1} max={20} onChange={setM2} unit=" kg" />
      </div>
      <div style={eqStyle}>T = 2m₁m₂g/(m₁+m₂) &nbsp;|&nbsp; a = (m₂-m₁)g/(m₁+m₂)</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
 * SIM 3: BUOYANCY EXPLORER
 * ════════════════════════════════════════════════════════ */
function BuoyancySim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [objDensity, setObjDensity] = useState(0.8);
  const [liquidType, setLiquidType] = useState<"water" | "oil" | "mercury">("water");
  const posRef = useRef(0.5); // 0=bottom, 1=floating at surface
  const velRef = useRef(0);

  const liquidDensity = liquidType === "water" ? 1.0 : liquidType === "oil" ? 0.85 : 13.6;
  const liquidColor = liquidType === "water" ? "rgba(59,130,246,0.35)" : liquidType === "oil" ? "rgba(180,150,20,0.35)" : "rgba(100,120,130,0.5)";
  const liquidLabel = liquidType === "water" ? "Water (1.0 g/cm³)" : liquidType === "oil" ? "Oil (0.85 g/cm³)" : "Mercury (13.6 g/cm³)";

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const GR = 9.8;
    const V = 0.001; // volume = 1 litre
    const objMass = objDensity * 1000 * V;
    const Fg = objMass * GR;
    const Fb = liquidDensity * 1000 * V * GR;
    const netUpForce = Fb - Fg;

    posRef.current = 0.45;
    velRef.current = 0;
    let raf = 0;

    const frame = () => {
      // Simple simulation: object moves based on net buoyant force
      const acc = netUpForce / objMass * 0.3;
      velRef.current += acc * 0.016;
      velRef.current *= 0.94; // damping
      posRef.current += velRef.current * 0.016;
      posRef.current = Math.max(0.05, Math.min(0.9, posRef.current));

      g.clearRect(0, 0, W, H);
      bg(g, W, H);

      // Liquid container
      const cx = W / 2, tankY = 40, tankH = 180, tankW = 200;
      rr(g, cx - tankW / 2, tankY, tankW, tankH, 6, "rgba(15,23,42,0.5)", "#334155", 2);

      // Liquid fill
      g.fillStyle = liquidColor;
      g.fillRect(cx - tankW / 2 + 2, tankY + 2, tankW - 4, tankH - 4);

      // Object (cube)
      const objY = tankY + 10 + (1 - posRef.current) * (tankH - 60);
      const objSize = 40;
      const submergedFrac = Math.min(1, liquidDensity > 0 ? objDensity / liquidDensity : 1);
      const submergedH = objSize * submergedFrac;
      const surfaceY = tankY + 2;

      // Clamp object within tank
      const clampedObjY = Math.min(tankY + tankH - objSize - 4, Math.max(tankY + 4, objY));

      // Draw submerged portion (darker)
      g.fillStyle = "#1e40af";
      g.fillRect(cx - objSize / 2, clampedObjY + objSize - submergedH, objSize, submergedH);
      // Draw above-water portion
      g.fillStyle = "#3b82f6";
      g.fillRect(cx - objSize / 2, clampedObjY, objSize, objSize - submergedH);
      g.strokeStyle = "#60a5fa"; g.lineWidth = 1.5;
      g.strokeRect(cx - objSize / 2, clampedObjY, objSize, objSize);
      txt(g, `${objDensity}`, cx, clampedObjY + objSize / 2 + 4, "#fff", 10);

      // Buoyancy force arrow (up)
      const fbLen = Math.min(Fb * 0.5, 60);
      drawArrow(g, cx + 30, clampedObjY + objSize / 2, cx + 30, clampedObjY + objSize / 2 - fbLen, C.green, 2.5);
      txt(g, `Fb=${Fb.toFixed(1)}N`, cx + 32, clampedObjY + objSize / 2 - fbLen - 5, C.green, 10, "left");

      // Weight arrow (down)
      drawArrow(g, cx - 30, clampedObjY + objSize / 2, cx - 30, clampedObjY + objSize / 2 + Fg * 0.5, C.red, 2.5);
      txt(g, `Fg=${Fg.toFixed(1)}N`, cx - 32, clampedObjY + objSize / 2 + Fg * 0.5 + 12, C.red, 10, "right");

      // Liquid label
      txt(g, liquidLabel, cx, tankY + tankH + 18, "#64748b", 10);

      // Status
      const status = netUpForce > 0.1 ? "FLOATS ↑" : netUpForce < -0.1 ? "SINKS ↓" : "NEUTRAL ⚡";
      const sc = netUpForce > 0.1 ? C.green : netUpForce < -0.1 ? C.red : C.amber;
      txt(g, status, cx, tankY - 12, sc, 13);

      infoBox(g, [
        ["Buoyant Fb", `${Fb.toFixed(2)} N`],
        ["Weight Fg", `${Fg.toFixed(2)} N`],
        ["Net Force", `${netUpForce.toFixed(2)} N`],
        ["Submerged %", `${(submergedFrac * 100).toFixed(0)}%`],
      ], W - 175, 12, 163);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [objDensity, liquidType, liquidDensity]);

  return (
    <div style={card}>
      <div style={titleStyle}>🌊 Sim 3 — Buoyancy vs Gravity (Archimedes&apos; Principle)</div>
      <canvas ref={cvs} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <SliderCtrl label="Object Density (g/cm³)" value={objDensity} min={0.2} max={3.0} step={0.05} onChange={setObjDensity} />
        <div>
          <span style={{ color: "#94a3b8", fontSize: 11 }}>Liquid Type</span>
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            {(["water", "oil", "mercury"] as const).map((t) => (
              <button key={t} onClick={() => setLiquidType(t)}
                style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: liquidType === t ? "#1d4ed8" : "rgba(255,255,255,0.04)", color: liquidType === t ? "#fff" : "#94a3b8" }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={eqStyle}>Fb = ρ_liquid × V × g &nbsp;|&nbsp; Object floats when ρ_obj {"<"} ρ_liquid</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
 * SIM 4: SPRING SCALE EQUILIBRIUM
 * ════════════════════════════════════════════════════════ */
function SpringScaleSim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [mass, setMass] = useState(4);
  const [k, setK] = useState(80);
  const posRef = useRef(0); // extension from equilibrium
  const velRef = useRef(0.5);

  const xEq = (mass * 9.8) / k;

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const GR = 9.8;
    const xEqPx = xEq * 60;

    posRef.current = 0;
    velRef.current = 0.5;
    let raf = 0;

    const frame = () => {
      const springF = -k * posRef.current;
      const gravF = mass * GR;
      const netF = springF + gravF;
      const acc = netF / mass;
      velRef.current += acc * 0.016;
      velRef.current *= 0.985; // damping
      posRef.current += velRef.current * 0.016;

      g.clearRect(0, 0, W, H);
      bg(g, W, H);

      const cx = W / 2, anchorY = 30;
      const naturalLen = 80;
      const ext = posRef.current * 60;
      const springLen = naturalLen + xEqPx + ext;
      const massY = anchorY + springLen;

      // Ceiling attachment
      g.strokeStyle = "#475569"; g.lineWidth = 4;
      g.beginPath(); g.moveTo(cx - 40, anchorY - 8); g.lineTo(cx + 40, anchorY - 8); g.stroke();

      // Draw spring (zigzag)
      const coils = 10;
      const coilH = springLen / coils;
      const coilW = 18;
      g.strokeStyle = "#8b5cf6"; g.lineWidth = 2; g.lineJoin = "round";
      g.beginPath();
      g.moveTo(cx, anchorY);
      for (let i = 0; i < coils; i++) {
        const y = anchorY + (i + 0.5) * coilH;
        g.lineTo(cx + (i % 2 === 0 ? coilW : -coilW), y);
      }
      g.lineTo(cx, anchorY + springLen);
      g.stroke();

      // Mass block
      const bw = 50, bh = 30;
      rr(g, cx - bw / 2, massY, bw, bh, 5, "#1d4ed8", "#3b82f6");
      txt(g, `${mass} kg`, cx, massY + bh / 2 + 4, "#fff", 11);

      // Spring force arrow (up)
      const sfPx = Math.min(Math.abs(springF + gravF * 0.5) * 2, 50);
      drawArrow(g, cx + 35, massY + bh / 2, cx + 35, massY + bh / 2 - (k * (posRef.current + xEq)) * 0.25, C.purple, 2.5);
      txt(g, `F_s=${(k * (posRef.current + xEq)).toFixed(1)}N`, cx + 37, massY - 8, C.purple, 9, "left");

      // Weight arrow (down)
      const wLen = Math.min(mass * GR * 0.3, 60);
      drawArrow(g, cx - 35, massY + bh / 2, cx - 35, massY + bh / 2 + wLen, C.red, 2.5);
      txt(g, `mg=${(mass * GR).toFixed(1)}N`, cx - 37, massY + bh + wLen + 8, C.red, 9, "right");

      // Equilibrium line
      g.strokeStyle = "rgba(16,185,129,0.4)"; g.lineWidth = 1; g.setLineDash([4, 4]);
      g.beginPath(); g.moveTo(cx - 70, anchorY + naturalLen + xEqPx); g.lineTo(cx + 70, anchorY + naturalLen + xEqPx); g.stroke();
      g.setLineDash([]);
      txt(g, "Equilibrium", cx + 72, anchorY + naturalLen + xEqPx + 4, "#10b981", 10, "left");

      infoBox(g, [
        ["Spring k", `${k} N/m`],
        ["Extension x", `${xEq.toFixed(3)} m`],
        ["Spring Force", `${(k * xEq).toFixed(1)} N`],
        ["Weight mg", `${(mass * GR).toFixed(1)} N`],
      ], 12, 12, 162);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [mass, k, xEq]);

  return (
    <div style={card}>
      <div style={titleStyle}>🔩 Sim 4 — Spring Scale Equilibrium (Hooke&apos;s Law)</div>
      <canvas ref={cvs} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <SliderCtrl label="Mass" value={mass} min={1} max={15} onChange={setMass} unit=" kg" />
        <SliderCtrl label="Spring Constant k" value={k} min={10} max={300} step={10} onChange={setK} unit=" N/m" />
      </div>
      <div style={eqStyle}>At equilibrium: F_spring = mg &nbsp;|&nbsp; kx = mg &nbsp;|&nbsp; x = mg/k = {xEq.toFixed(3)} m</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
 * SIM 5: SEESAW MOMENT BALANCE
 * ════════════════════════════════════════════════════════ */
function SeesawSim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [m1, setM1] = useState(6);
  const [d1, setD1] = useState(3);
  const [m2, setM2] = useState(4);
  const [d2, setD2] = useState(4);
  const angleRef = useRef(0);
  const angVelRef = useRef(0);

  const τ1 = m1 * 9.8 * d1;
  const τ2 = m2 * 9.8 * d2;
  const netTorque = τ1 - τ2;

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;

    angleRef.current = 0;
    angVelRef.current = 0;
    let raf = 0;

    const frame = () => {
      const restoreAcc = -netTorque * 0.0004;
      angVelRef.current += restoreAcc;
      angVelRef.current *= 0.97;
      angleRef.current += angVelRef.current;
      angleRef.current = Math.max(-0.35, Math.min(0.35, angleRef.current));

      g.clearRect(0, 0, W, H);
      bg(g, W, H);

      const cx = W / 2, cy = H / 2 + 10;
      const beamLen = 240;

      // Pivot triangle
      g.fillStyle = "#475569";
      g.beginPath();
      g.moveTo(cx, cy + 15); g.lineTo(cx - 20, cy + 45); g.lineTo(cx + 20, cy + 45);
      g.closePath(); g.fill();
      g.fillStyle = "#334155"; g.beginPath(); g.arc(cx, cy + 15, 5, 0, Math.PI * 2); g.fill();

      // Beam (rotated)
      g.save(); g.translate(cx, cy);
      g.rotate(angleRef.current);

      g.strokeStyle = "#64748b"; g.lineWidth = 8; g.lineCap = "round";
      g.beginPath(); g.moveTo(-beamLen, 0); g.lineTo(beamLen, 0); g.stroke();

      // Tick marks at d1 and d2
      const pxPerM = beamLen / 5;
      const x1 = -d1 * pxPerM, x2 = d2 * pxPerM;

      // Mass 1 (left)
      g.strokeStyle = "#334155"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(x1, 0); g.lineTo(x1, -35); g.stroke();
      rr(g, x1 - 22, -35 - 22, 44, 22, 4, "#1d4ed8", "#3b82f6");
      txt(g, `${m1}kg`, x1, -35 - 11 + 4, "#fff", 10);

      // Mass 2 (right)
      g.beginPath(); g.moveTo(x2, 0); g.lineTo(x2, -35); g.stroke();
      rr(g, x2 - 22, -35 - 22, 44, 22, 4, "#92400e", "#f59e0b");
      txt(g, `${m2}kg`, x2, -35 - 11 + 4, "#fff", 10);

      // Distance labels
      txt(g, `${d1}m`, x1 / 2, 16, "#94a3b8", 10);
      txt(g, `${d2}m`, x2 / 2, 16, "#94a3b8", 10);

      g.restore();

      // Torque display
      const balanced = Math.abs(netTorque) < 2;
      const statusColor = balanced ? C.green : C.amber;
      txt(g, balanced ? "⚖️ Balanced! τ₁ = τ₂" : `Net torque: ${netTorque.toFixed(1)} N·m`, cx, H - 18, statusColor, 12);

      infoBox(g, [
        ["Torque τ₁", `${τ1.toFixed(1)} N·m`],
        ["Torque τ₂", `${τ2.toFixed(1)} N·m`],
        ["Net τ", `${netTorque.toFixed(1)} N·m`],
      ], W - 170, 12, 158);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [m1, d1, m2, d2, netTorque]);

  return (
    <div style={card}>
      <div style={titleStyle}>⚖️ Sim 5 — Seesaw Moment Balance (Torque)</div>
      <canvas ref={cvs} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
        <SliderCtrl label="Mass m₁" value={m1} min={1} max={20} onChange={setM1} unit=" kg" />
        <SliderCtrl label="Distance d₁" value={d1} min={0.5} max={5} step={0.5} onChange={setD1} unit=" m" />
        <SliderCtrl label="Mass m₂" value={m2} min={1} max={20} onChange={setM2} unit=" kg" />
        <SliderCtrl label="Distance d₂" value={d2} min={0.5} max={5} step={0.5} onChange={setD2} unit=" m" />
      </div>
      <div style={eqStyle}>τ₁ = m₁×g×d₁ = {τ1.toFixed(1)} N·m &nbsp;|&nbsp; τ₂ = m₂×g×d₂ = {τ2.toFixed(1)} N·m &nbsp;|&nbsp; Balance when τ₁=τ₂</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
 * SIM 6: FLOATING BOAT WITH CARGO
 * ════════════════════════════════════════════════════════ */
function FloatingBoatSim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [boatMass, setBoatMass] = useState(10);
  const [cargoMass, setCargo] = useState(15);
  const waveRef = useRef(0);

  const totalMass = boatMass + cargoMass;
  const totalWeight = totalMass * 9.8;
  const waterDensity = 1000;
  const boatArea = 0.5; // m² (hull area)
  const draughtM = totalMass / (waterDensity * boatArea);
  const draughtPx = Math.min(draughtM * 800, 60);
  const maxDraught = 0.08; // boat sinks at 80mm
  const sinking = draughtM > maxDraught;

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    let raf = 0;

    const frame = (t: number) => {
      waveRef.current = t * 0.001;
      g.clearRect(0, 0, W, H);
      bg(g, W, H);

      const waterY = H / 2 + 20;

      // Water with wave
      g.fillStyle = "rgba(37,99,235,0.25)";
      g.beginPath(); g.moveTo(0, waterY);
      for (let x = 0; x <= W; x += 4) {
        g.lineTo(x, waterY + Math.sin(waveRef.current * 2 + x * 0.03) * 5);
      }
      g.lineTo(W, H); g.lineTo(0, H); g.closePath(); g.fill();

      // Water surface line
      g.strokeStyle = "rgba(96,165,250,0.5)"; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(0, waterY);
      for (let x = 0; x <= W; x += 4) {
        g.lineTo(x, waterY + Math.sin(waveRef.current * 2 + x * 0.03) * 5);
      }
      g.stroke();

      const cx = W / 2;
      const boatW = 140, boatTotalH = 50;
      const sinkOffset = sinking ? (waveRef.current * 20 % 40) : 0;
      const boatY = waterY - boatTotalH + draughtPx + sinkOffset;

      if (sinking) {
        txt(g, "⚠️ SINKING! Overloaded!", cx, waterY - 80, C.red, 13);
        rr(g, cx - boatW / 2 - 5, boatY - 10, boatW + 10, boatTotalH + 10, 6, "rgba(127,29,29,0.5)", C.red, 2);
      } else {
        // Draw boat hull
        g.fillStyle = "#92400e"; g.beginPath();
        g.moveTo(cx - boatW / 2, boatY);
        g.lineTo(cx - boatW / 2 + 10, boatY + boatTotalH);
        g.lineTo(cx + boatW / 2 - 10, boatY + boatTotalH);
        g.lineTo(cx + boatW / 2, boatY);
        g.closePath(); g.fill();
        g.strokeStyle = "#d97706"; g.lineWidth = 2; g.stroke();

        // Deck
        rr(g, cx - boatW / 2, boatY - 12, boatW, 14, 3, "#b45309", "#d97706");

        // Cargo on deck
        if (cargoMass > 0) {
          rr(g, cx - 30, boatY - 36, 60, 24, 3, "#1e293b", "#3b82f6");
          txt(g, `Cargo: ${cargoMass}kg`, cx, boatY - 24 + 4, "#60a5fa", 10);
        }

        // Draught indicator
        g.strokeStyle = "rgba(16,185,129,0.5)"; g.lineWidth = 1; g.setLineDash([3, 3]);
        g.beginPath(); g.moveTo(cx + boatW / 2 + 10, waterY); g.lineTo(cx + boatW / 2 + 10, boatY + boatTotalH); g.stroke();
        g.setLineDash([]);
        drawArrow(g, cx + boatW / 2 + 20, waterY, cx + boatW / 2 + 20, boatY + boatTotalH, C.green, 1.5);
        txt(g, `Draught:\n${(draughtM * 100).toFixed(1)}cm`, cx + boatW / 2 + 50, (waterY + boatY + boatTotalH) / 2, C.green, 9);
      }

      // Buoyant force arrow
      drawArrow(g, cx, waterY + 25, cx, waterY + 25 - Math.min(totalWeight * 0.25, 60), C.green, 2.5);
      txt(g, `Fb=${totalWeight.toFixed(0)}N`, cx, waterY + 42, C.green, 10);

      // Weight arrow
      drawArrow(g, cx - 80, boatY - 15, cx - 80, boatY - 15 + Math.min(totalWeight * 0.25, 55), C.red, 2.5);
      txt(g, `W=${totalWeight.toFixed(0)}N`, cx - 82, boatY - 15 + Math.min(totalWeight * 0.25, 55) + 12, C.red, 9, "right");

      infoBox(g, [
        ["Total Mass", `${totalMass} kg`],
        ["Draught", `${(draughtM * 100).toFixed(1)} cm`],
        ["Max Load", `${(maxDraught * waterDensity * boatArea).toFixed(0)} kg`],
        ["Status", sinking ? "SINKING ⚠️" : "FLOATING ✓"],
      ], 12, 12, 162);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [boatMass, cargoMass, draughtPx, sinking, totalWeight]);

  return (
    <div style={card}>
      <div style={titleStyle}>🚢 Sim 6 — Floating Boat with Cargo</div>
      <canvas ref={cvs} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <SliderCtrl label="Boat Mass" value={boatMass} min={5} max={30} onChange={setBoatMass} unit=" kg" />
        <SliderCtrl label="Cargo Mass" value={cargoMass} min={0} max={50} onChange={setCargo} unit=" kg" />
      </div>
      <div style={eqStyle}>Boat floats when Fb = W_total &nbsp;|&nbsp; Draught = M/(ρ_water × A)</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
 * SIM 7: WIND FORCE vs FRICTION
 * ════════════════════════════════════════════════════════ */
function WindFrictionSim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [windSpeed, setWind] = useState(15);
  const [mu, setMu] = useState(0.4);
  const [mass, setMass] = useState(8);
  const posRef = useRef(200);
  const velRef = useRef(0);

  const RHO_AIR = 1.2, A = 0.5, Cd = 1.2;
  const fWind = 0.5 * RHO_AIR * windSpeed * windSpeed * A * Cd;
  const fFric = mu * mass * 9.8;
  const fNet = fWind - fFric;

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const acc = fNet / mass;

    posRef.current = 100;
    velRef.current = 0;
    let raf = 0;

    const frame = (t: number) => {
      velRef.current += acc * 0.016;
      if (fNet <= 0) velRef.current = Math.max(0, velRef.current - 0.5);
      posRef.current += velRef.current * 0.016 * 8;
      if (posRef.current > W - 60) posRef.current = 100;

      g.clearRect(0, 0, W, H);
      bg(g, W, H);

      // Floor
      const floorY = H - 50;
      g.strokeStyle = "#334155"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(0, floorY); g.lineTo(W, floorY); g.stroke();
      // Floor texture
      g.strokeStyle = "rgba(255,255,255,0.06)"; g.lineWidth = 1;
      for (let x = 0; x < W; x += 20) {
        g.beginPath(); g.moveTo(x, floorY); g.lineTo(x + 10, floorY + 10); g.stroke();
      }

      // Wind particles
      const wt = t * 0.001;
      g.strokeStyle = "rgba(96,165,250,0.4)"; g.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        const px = ((wt * windSpeed * 5 + i * 70) % (W + 40)) - 20;
        const py = floorY - 80 + Math.sin(i * 2.1) * 30;
        const len = 20 + windSpeed;
        g.beginPath(); g.moveTo(px, py); g.lineTo(px + len, py); g.stroke();
        drawArrow(g, px + len - 12, py, px + len, py, "rgba(96,165,250,0.5)", 1.5, 7);
      }

      // Block
      const bx = posRef.current, by = floorY - 40;
      rr(g, bx - 25, by, 50, 40, 4, "#1d4ed8", "#3b82f6");
      txt(g, `${mass}kg`, bx, by + 22, "#fff", 11);

      // Wind force arrow
      if (fWind > 1) {
        drawArrow(g, bx - 60, by + 15, bx - 25, by + 15, C.cyan, 2.5);
        txt(g, `F_wind=${fWind.toFixed(1)}N`, bx - 43, by + 5, C.cyan, 9);
      }
      // Friction arrow
      if (fFric > 0) {
        const fDir = fNet > 0 ? -1 : 1;
        drawArrow(g, bx + 25, by + 25, bx + 25 + fDir * Math.min(fFric * 1.2, 55), by + 25, C.amber, 2.5);
        txt(g, `f=${fFric.toFixed(1)}N`, bx + 60, by + 14, C.amber, 9);
      }
      // Normal + weight
      drawArrow(g, bx, floorY, bx, floorY + 30, C.red, 1.5);
      drawArrow(g, bx, floorY, bx, floorY - 30, C.green, 1.5);

      const status = fNet > 0.5 ? "Moving →" : "Stationary ✓";
      const sc = fNet > 0.5 ? C.amber : C.green;
      txt(g, status, W / 2, 22, sc, 13);

      infoBox(g, [
        ["Wind Force", `${fWind.toFixed(1)} N`],
        ["Friction", `${fFric.toFixed(1)} N`],
        ["Net Force", `${fNet.toFixed(1)} N`],
        ["Speed v", `${Math.abs(velRef.current * 0.8).toFixed(1)} m/s`],
      ], W - 170, 12, 158);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [windSpeed, mu, mass, fWind, fFric, fNet]);

  return (
    <div style={card}>
      <div style={titleStyle}>💨 Sim 7 — Wind Force vs Friction</div>
      <canvas ref={cvs} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10 }}>
        <SliderCtrl label="Wind Speed" value={windSpeed} min={0} max={40} onChange={setWind} unit=" m/s" />
        <SliderCtrl label="Friction μ" value={mu} min={0} max={0.9} step={0.05} onChange={setMu} />
        <SliderCtrl label="Mass" value={mass} min={1} max={30} onChange={setMass} unit=" kg" />
      </div>
      <div style={eqStyle}>F_wind = ½ρv²ACd = {fWind.toFixed(1)}N &nbsp;|&nbsp; f = μmg = {fFric.toFixed(1)}N &nbsp;|&nbsp; Net = {fNet.toFixed(1)}N</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
 * SIM 8: OBJECT HANGING FROM TWO ROPES
 * ════════════════════════════════════════════════════════ */
function TwoRopeTensionSim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [alpha, setAlpha] = useState(40); // angle of rope 1 from vertical
  const [beta, setBeta] = useState(35);  // angle of rope 2 from vertical
  const [mass, setMass] = useState(5);

  const α = alpha * Math.PI / 180, β = beta * Math.PI / 180;
  const sinSum = Math.sin(α + β);
  const T1 = sinSum > 0.01 ? (mass * 9.8 * Math.cos(β)) / sinSum : 0;
  const T2 = sinSum > 0.01 ? (mass * 9.8 * Math.cos(α)) / sinSum : 0;

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    let raf = 0;

    const frame = () => {
      g.clearRect(0, 0, W, H);
      bg(g, W, H);

      const cx = W / 2, objY = H / 2 + 30;
      const ropeLen = 110;

      // Ceiling
      g.strokeStyle = "#475569"; g.lineWidth = 4;
      g.beginPath(); g.moveTo(40, 30); g.lineTo(W - 40, 30); g.stroke();

      // Compute anchor points
      const ax1 = cx - ropeLen * Math.sin(α);
      const ay1 = objY - ropeLen * Math.cos(α);
      const ax2 = cx + ropeLen * Math.sin(β);
      const ay2 = objY - ropeLen * Math.cos(β);

      // Draw ropes
      g.strokeStyle = "#94a3b8"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(ax1, ay1); g.lineTo(cx, objY); g.stroke();
      g.beginPath(); g.moveTo(ax2, ay2); g.lineTo(cx, objY); g.stroke();

      // Anchor pins
      g.fillStyle = "#64748b"; g.beginPath(); g.arc(ax1, ay1, 5, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#64748b"; g.beginPath(); g.arc(ax2, ay2, 5, 0, Math.PI * 2); g.fill();

      // Hanging mass
      rr(g, cx - 24, objY, 48, 30, 5, "#1d4ed8", "#3b82f6");
      txt(g, `${mass}kg`, cx, objY + 18, "#fff", 11);

      // Weight arrow (down)
      drawArrow(g, cx, objY + 30, cx, objY + 30 + mass * 9.8 * 0.4, C.red, 2.5);
      txt(g, `mg=${(mass * 9.8).toFixed(0)}N`, cx + 5, objY + 30 + mass * 9.8 * 0.4 + 12, C.red, 9, "left");

      // Tension T1 arrow (along rope 1)
      const t1Scale = Math.min(T1 * 0.35, 70);
      drawArrow(g, cx, objY, cx - t1Scale * Math.sin(α), objY - t1Scale * Math.cos(α), C.purple, 2.5);
      txt(g, `T₁=${T1.toFixed(1)}N`, ax1 - 10, (objY + ay1) / 2 + 5, C.purple, 10, "right");

      // Tension T2 arrow (along rope 2)
      const t2Scale = Math.min(T2 * 0.35, 70);
      drawArrow(g, cx, objY, cx + t2Scale * Math.sin(β), objY - t2Scale * Math.cos(β), C.cyan, 2.5);
      txt(g, `T₂=${T2.toFixed(1)}N`, ax2 + 10, (objY + ay2) / 2 + 5, C.cyan, 10, "left");

      // Angle arcs
      g.strokeStyle = C.purple; g.lineWidth = 1; g.beginPath(); g.arc(cx, objY, 30, -Math.PI / 2 - α, -Math.PI / 2); g.stroke();
      txt(g, `${alpha}°`, cx - 38, objY - 20, C.purple, 9);
      g.strokeStyle = C.cyan; g.lineWidth = 1; g.beginPath(); g.arc(cx, objY, 35, -Math.PI / 2, -Math.PI / 2 + β); g.stroke();
      txt(g, `${beta}°`, cx + 40, objY - 18, C.cyan, 9);

      infoBox(g, [
        ["Tension T₁", `${T1.toFixed(1)} N`],
        ["Tension T₂", `${T2.toFixed(1)} N`],
        ["Weight", `${(mass * 9.8).toFixed(1)} N`],
      ], W - 165, 12, 153);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [alpha, beta, mass, α, β, T1, T2]);

  return (
    <div style={card}>
      <div style={titleStyle}>🪢 Sim 8 — Object Hanging from Two Ropes (Tension Analysis)</div>
      <canvas ref={cvs} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10 }}>
        <SliderCtrl label="Rope 1 Angle α" value={alpha} min={1} max={80} onChange={setAlpha} unit="°" />
        <SliderCtrl label="Rope 2 Angle β" value={beta} min={1} max={80} onChange={setBeta} unit="°" />
        <SliderCtrl label="Mass" value={mass} min={1} max={20} onChange={setMass} unit=" kg" />
      </div>
      <div style={eqStyle}>T₁ = mg·cos(β)/sin(α+β) = {T1.toFixed(1)}N &nbsp;|&nbsp; T₂ = mg·cos(α)/sin(α+β) = {T2.toFixed(1)}N</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
 * SIM 9: STACKED BOXES NORMAL FORCE CASCADE
 * ════════════════════════════════════════════════════════ */
function BookStackSim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [m1, setM1] = useState(2);
  const [m2, setM2] = useState(3);
  const [m3, setM3] = useState(4);
  const [m4, setM4] = useState(5);

  const g_acc = 9.8;
  const N1 = m1 * g_acc;
  const N2 = (m1 + m2) * g_acc;
  const N3 = (m1 + m2 + m3) * g_acc;
  const N4 = (m1 + m2 + m3 + m4) * g_acc;

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    let raf = 0;

    const frame = () => {
      g.clearRect(0, 0, W, H);
      bg(g, W, H);

      const cx = W / 2, floorY = H - 40;
      const bw = 100, bh = 30, gap = 3;
      const masses = [m4, m3, m2, m1];
      const normals = [N4, N3, N2, N1];
      const colors = ["#1d4ed8", "#0d9488", "#7c3aed", "#b45309"];
      const labels = ["m₄", "m₃", "m₂", "m₁"];

      // Floor
      g.strokeStyle = "#334155"; g.lineWidth = 3;
      g.beginPath(); g.moveTo(cx - 120, floorY); g.lineTo(cx + 120, floorY); g.stroke();
      txt(g, "Floor (Rigid)", cx, floorY + 14, "#64748b", 10);

      masses.forEach((m, i) => {
        const y = floorY - (masses.length - i) * (bh + gap);
        rr(g, cx - bw / 2, y, bw, bh, 3, colors[i], "rgba(255,255,255,0.15)");
        txt(g, `${labels[i]} = ${m}kg`, cx, y + bh / 2 + 4, "#fff", 11);

        // Normal force arrow pointing up from below
        const nLen = Math.min(normals[i] * 0.12, 50);
        drawArrow(g, cx + bw / 2 + 30, y + bh, cx + bw / 2 + 30, y + bh - nLen, C.green, 2);
        txt(g, `N=${normals[i].toFixed(0)}N`, cx + bw / 2 + 32, y + bh + 12, C.green, 9, "left");
      });

      // Title
      txt(g, "Normal force at each level = weight of ALL boxes above", cx, 20, "#94a3b8", 10);
      txt(g, `Total weight on floor = N₄ = ${N4.toFixed(0)} N`, cx, H - 15, C.amber, 11);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [m1, m2, m3, m4, N1, N2, N3, N4]);

  return (
    <div style={card}>
      <div style={titleStyle}>📚 Sim 9 — Stacked Boxes: Normal Force Cascade</div>
      <canvas ref={cvs} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
        <SliderCtrl label="Top Box m₁" value={m1} min={1} max={10} onChange={setM1} unit=" kg" />
        <SliderCtrl label="2nd Box m₂" value={m2} min={1} max={10} onChange={setM2} unit=" kg" />
        <SliderCtrl label="3rd Box m₃" value={m3} min={1} max={10} onChange={setM3} unit=" kg" />
        <SliderCtrl label="Bottom m₄" value={m4} min={1} max={10} onChange={setM4} unit=" kg" />
      </div>
      <div style={eqStyle}>N at each level = (sum of masses above) × g &nbsp;|&nbsp; N_floor = {N4.toFixed(0)} N</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
 * SIM 10: TERMINAL VELOCITY (PARACHUTIST)
 * ════════════════════════════════════════════════════════ */
function TerminalVelocitySim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [mass, setMass] = useState(80);
  const [parachArea, setArea] = useState(20);
  const velRef = useRef(0);
  const posRef = useRef(0);
  const deployedRef = useRef(false);
  const [deployed, setDeployed] = useState(false);

  const Cd = 1.3, rhoAir = 1.2;
  const Ag = deployed ? parachArea : 0.5;
  const vTerm = Math.sqrt((2 * mass * 9.8) / (rhoAir * Cd * Ag));

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    deployedRef.current = deployed;

    velRef.current = 0;
    posRef.current = 20;
    let raf = 0;

    const frame = () => {
      const Ag_cur = deployedRef.current ? parachArea : 0.5;
      const Fdrag = 0.5 * rhoAir * Cd * Ag_cur * velRef.current * velRef.current;
      const Fgrav = mass * 9.8;
      const Fnet = Fgrav - Fdrag;
      const acc = Fnet / mass;

      velRef.current += acc * 0.016;
      velRef.current = Math.max(0, velRef.current);
      posRef.current += velRef.current * 0.016 * 2.5;

      if (posRef.current > H - 60) posRef.current = 20;

      g.clearRect(0, 0, W, H);
      bg(g, W, H);

      const cx = W / 2;
      const py = posRef.current;
      const isDeployed = deployedRef.current;

      // Sky gradient
      const skyGrad = g.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, "rgba(14,30,60,0.4)"); skyGrad.addColorStop(1, "rgba(15,23,42,0)");
      g.fillStyle = skyGrad; g.fillRect(0, 0, W, H);

      // Clouds
      g.fillStyle = "rgba(255,255,255,0.04)";
      [[120, 40, 60, 20], [320, 80, 80, 25], [450, 55, 55, 18]].forEach(([x, y, rw, rh]) => {
        g.beginPath(); g.ellipse(x, y, rw, rh, 0, 0, Math.PI * 2); g.fill();
      });

      // Parachute
      if (isDeployed) {
        g.fillStyle = "#dc2626"; g.beginPath();
        g.arc(cx, py, 35, Math.PI, Math.PI * 2); g.fill();
        g.strokeStyle = "#ef4444"; g.lineWidth = 1.5;
        for (let i = -2; i <= 2; i++) {
          g.beginPath(); g.moveTo(cx + i * 15, py); g.lineTo(cx, py + 45); g.stroke();
        }
      }

      // Person
      g.fillStyle = "#f97316";
      g.beginPath(); g.arc(cx, py + (isDeployed ? 50 : 0), 9, 0, Math.PI * 2); g.fill();
      rr(g, cx - 6, py + (isDeployed ? 59 : 9), 12, 18, 3, "#f97316");

      // Velocity arrow (down)
      const vLen = Math.min(velRef.current * 1.2, 60);
      drawArrow(g, cx + 18, py + 10, cx + 18, py + 10 + vLen, C.amber, 2.5);
      txt(g, `v=${velRef.current.toFixed(1)} m/s`, cx + 20, py + vLen + 22, C.amber, 10, "left");

      // Drag arrow (up)
      const dLen = Math.min((0.5 * rhoAir * Cd * Ag_cur * velRef.current * velRef.current) * 0.012, 55);
      drawArrow(g, cx - 18, py + 20, cx - 18, py + 20 - dLen, C.green, 2.5);
      txt(g, `Drag=${(0.5 * rhoAir * Cd * Ag_cur * velRef.current ** 2).toFixed(0)}N`, cx - 20, py + 20 - dLen - 6, C.green, 9, "right");

      const vT = Math.sqrt((2 * mass * 9.8) / (rhoAir * Cd * Ag_cur));
      const atTerminal = Math.abs(velRef.current - vT) < 0.5;

      infoBox(g, [
        ["Velocity", `${velRef.current.toFixed(1)} m/s`],
        ["Terminal v", `${vT.toFixed(1)} m/s`],
        ["Drag Force", `${(0.5 * rhoAir * Cd * Ag_cur * velRef.current ** 2).toFixed(0)} N`],
        ["Status", atTerminal ? "Terminal ✓" : "Accelerating"],
      ], W - 170, 12, 158);

      txt(g, atTerminal ? "⚡ Terminal Velocity Reached! Drag = Weight" : "Accelerating — drag increasing...", cx, H - 15, atTerminal ? C.green : C.amber, 11);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [mass, parachArea, deployed, Ag]);

  return (
    <div style={card}>
      <div style={titleStyle}>🪂 Sim 10 — Terminal Velocity (Parachutist)</div>
      <canvas ref={cvs} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10, alignItems: "end" }}>
        <SliderCtrl label="Mass" value={mass} min={40} max={150} onChange={setMass} unit=" kg" />
        <SliderCtrl label="Parachute Area" value={parachArea} min={1} max={50} onChange={setArea} unit=" m²" />
        <button onClick={() => setDeployed(d => !d)}
          style={{ padding: "8px 16px", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer", border: "none", background: deployed ? "#dc2626" : "#1d4ed8", color: "#fff" }}>
          {deployed ? "🪂 Deployed" : "🤸 Freefall — Deploy!"}
        </button>
      </div>
      <div style={eqStyle}>v_terminal = √(2mg / ρCdA) = {vTerm.toFixed(1)} m/s &nbsp;|&nbsp; At terminal: Drag = Weight</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
 * SIM 11: PASCAL'S HYDRAULIC PRESS
 * ════════════════════════════════════════════════════════ */
function HydraulicPressSim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [force1, setF1] = useState(100);
  const [areaRatio, setRatio] = useState(5);

  const A1 = 0.02, A2 = A1 * areaRatio;
  const P = force1 / A1;
  const F2 = P * A2;

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    let raf = 0;

    const frame = () => {
      g.clearRect(0, 0, W, H);
      bg(g, W, H);

      const floorY = H - 30;
      const f1PistonH = 20 + Math.min(force1 * 0.05, 30);

      // Small piston (left)
      const p1x = 120, p1y = floorY - 100;
      const p1w = 50, tubH = 80;

      // Tube
      rr(g, p1x - p1w / 2, p1y, p1w, tubH, 0, "rgba(30,41,59,0.8)", "#334155", 2);
      // Fluid
      g.fillStyle = "rgba(37,99,235,0.5)";
      g.fillRect(p1x - p1w / 2 + 2, p1y + f1PistonH + 2, p1w - 4, tubH - f1PistonH - 4);

      // Piston 1
      rr(g, p1x - p1w / 2 - 2, p1y, p1w + 4, f1PistonH, 3, "#475569", "#94a3b8", 2);
      txt(g, "Piston 1", p1x, p1y - 12, "#94a3b8", 10);
      txt(g, `A₁=${(A1 * 10000).toFixed(0)} cm²`, p1x, p1y + f1PistonH + tubH + 14, "#64748b", 10);
      drawArrow(g, p1x, p1y - 25, p1x, p1y - 5, C.amber, 2.5);
      txt(g, `F₁=${force1}N`, p1x, p1y - 28, C.amber, 10);

      // Horizontal pipe
      const p2x = 380, pipeY = floorY - 40;
      g.fillStyle = "rgba(37,99,235,0.5)";
      g.fillRect(p1x, pipeY, p2x - p1x, 28);
      g.strokeStyle = "#334155"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(p1x, pipeY); g.lineTo(p2x, pipeY); g.moveTo(p1x, pipeY + 28); g.lineTo(p2x, pipeY + 28); g.stroke();

      // Large piston (right)
      const p2w = 50 + areaRatio * 8, tubH2 = 90;
      const p2y = floorY - tubH2;
      const f2PistonH = 18;

      rr(g, p2x - p2w / 2, p2y, p2w, tubH2, 0, "rgba(30,41,59,0.8)", "#334155", 2);
      g.fillStyle = "rgba(37,99,235,0.5)";
      g.fillRect(p2x - p2w / 2 + 2, p2y + f2PistonH + 2, p2w - 4, tubH2 - f2PistonH - 4);
      rr(g, p2x - p2w / 2 - 2, p2y, p2w + 4, f2PistonH, 3, "#475569", "#94a3b8", 2);
      txt(g, "Piston 2", p2x, p2y - 12, "#94a3b8", 10);
      txt(g, `A₂=${(A2 * 10000).toFixed(0)} cm²`, p2x, p2y + f2PistonH + tubH2 + 14, "#64748b", 10);
      const f2Len = Math.min(F2 * 0.02, 55);
      drawArrow(g, p2x, p2y - 5, p2x, p2y - 5 - f2Len, C.green, 2.5);
      txt(g, `F₂=${F2.toFixed(0)}N ↑`, p2x, p2y - f2Len - 8, C.green, 11);

      // Pressure label
      txt(g, `P = F₁/A₁ = F₂/A₂ = ${(P / 1000).toFixed(1)} kPa`, W / 2, H - 12, C.blue, 11);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [force1, areaRatio, A1, A2, P, F2]);

  return (
    <div style={card}>
      <div style={titleStyle}>🔧 Sim 11 — Pascal&apos;s Hydraulic Press</div>
      <canvas ref={cvs} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <SliderCtrl label="Input Force F₁" value={force1} min={10} max={500} step={10} onChange={setF1} unit=" N" />
        <SliderCtrl label="Area Ratio A₂/A₁" value={areaRatio} min={1} max={20} onChange={setRatio} unit="×" />
      </div>
      <div style={eqStyle}>P = F₁/A₁ = F₂/A₂ &nbsp;|&nbsp; F₂ = F₁ × (A₂/A₁) = {F2.toFixed(0)} N (mechanical advantage = {areaRatio}×)</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
 * SIM 12: CRANE LOAD CABLE TENSION
 * ════════════════════════════════════════════════════════ */
function CraneTensionSim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [loadKg, setLoad] = useState(500);
  const [cableAngle, setCableAngle] = useState(60);

  const θ = cableAngle * Math.PI / 180;
  const W_load = loadKg * 9.8;
  const T = θ > 0.05 ? W_load / Math.sin(θ) : W_load;
  const Horizontal = T * Math.cos(θ);
  const Vertical = T * Math.sin(θ);

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    let raf = 0;

    const frame = () => {
      g.clearRect(0, 0, W, H);
      bg(g, W, H);

      // Crane tower
      const towerX = 80, towerY = 30, towerH = 200;
      rr(g, towerX - 15, towerY, 30, towerH, 3, "#334155", "#475569", 2);

      // Crane boom
      const boomLen = 200;
      const boomEndX = towerX + boomLen;
      const boomY = towerY + 20;
      g.strokeStyle = "#64748b"; g.lineWidth = 6; g.lineCap = "round";
      g.beginPath(); g.moveTo(towerX, boomY); g.lineTo(boomEndX, boomY); g.stroke();

      // Load hanging point
      const loadX = boomEndX, loadAnchorY = boomY;

      // Cable to wall at angle
      const wallX = towerX;
      const wallY = towerY + 10;
      g.strokeStyle = "#94a3b8"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(wallX, wallY); g.lineTo(loadX, loadAnchorY); g.stroke();

      // Cable angle arc
      g.strokeStyle = C.purple; g.lineWidth = 1; g.setLineDash([3, 3]);
      g.beginPath(); g.moveTo(loadX, loadAnchorY); g.lineTo(loadX, loadAnchorY + 40); g.stroke();
      g.setLineDash([]);
      g.beginPath(); g.arc(loadX, loadAnchorY, 30, Math.PI / 2, Math.PI); g.strokeStyle = C.purple; g.lineWidth = 1; g.stroke();
      txt(g, `${cableAngle}°`, loadX - 38, loadAnchorY + 28, C.purple, 10);

      // Load rope hanging down
      const ropeLen = 80;
      g.strokeStyle = "#94a3b8"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(loadX, loadAnchorY); g.lineTo(loadX, loadAnchorY + ropeLen); g.stroke();

      // Load box
      const bw = 56, bh = 36;
      rr(g, loadX - bw / 2, loadAnchorY + ropeLen, bw, bh, 4, "#92400e", "#d97706", 2);
      txt(g, `${loadKg}kg`, loadX, loadAnchorY + ropeLen + bh / 2 + 4, "#fff", 11);

      // Weight arrow
      drawArrow(g, loadX, loadAnchorY + ropeLen + bh, loadX, loadAnchorY + ropeLen + bh + 40, C.red, 2.5);
      txt(g, `W=${W_load.toFixed(0)}N`, loadX + 5, loadAnchorY + ropeLen + bh + 52, C.red, 9, "left");

      // Tension arrow along cable
      const tLen = Math.min(T * 0.04, 70);
      const cDir = { x: wallX - loadX, y: wallY - loadAnchorY };
      const cLen = Math.sqrt(cDir.x ** 2 + cDir.y ** 2);
      drawArrow(g, loadX, loadAnchorY, loadX + cDir.x / cLen * tLen, loadAnchorY + cDir.y / cLen * tLen, C.green, 2.5);
      txt(g, `T=${T.toFixed(0)}N`, loadX + cDir.x / cLen * tLen + 5, loadAnchorY + cDir.y / cLen * tLen - 5, C.green, 9, "left");

      infoBox(g, [
        ["Tension T", `${T.toFixed(0)} N`],
        ["Horizontal", `${Horizontal.toFixed(0)} N`],
        ["Vertical", `${Vertical.toFixed(0)} N`],
        ["Load Weight", `${W_load.toFixed(0)} N`],
      ], W - 172, 12, 160);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [loadKg, cableAngle, θ, T, Horizontal, Vertical, W_load]);

  return (
    <div style={card}>
      <div style={titleStyle}>🏗️ Sim 12 — Crane Cable Tension Analysis</div>
      <canvas ref={cvs} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <SliderCtrl label="Load Mass" value={loadKg} min={50} max={2000} step={50} onChange={setLoad} unit=" kg" />
        <SliderCtrl label="Cable Angle from vertical" value={cableAngle} min={10} max={80} onChange={setCableAngle} unit="°" />
      </div>
      <div style={eqStyle}>T = W/sin(θ) = {T.toFixed(0)} N &nbsp;|&nbsp; Horizontal = T·cos(θ) = {Horizontal.toFixed(0)} N</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
 * SIM 13: BUNGEE CORD EQUILIBRIUM
 * ════════════════════════════════════════════════════════ */
function BungeeSim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [mass, setMass] = useState(70);
  const [k, setK] = useState(40);
  const [naturalLen, setNLen] = useState(10);

  const GR = 9.8;
  const xEq = (mass * GR) / k;
  const totalLen = naturalLen + xEq;
  const posRef = useRef(0);
  const velRef = useRef(1);

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;

    posRef.current = xEq * 0.3;
    velRef.current = 1.5;
    let raf = 0;

    const frame = () => {
      const restoreF = -(k * (posRef.current - xEq));
      const acc = restoreF / mass;
      velRef.current += acc * 0.016;
      velRef.current *= 0.985;
      posRef.current += velRef.current * 0.016;
      posRef.current = Math.max(-xEq * 0.2, Math.min(xEq * 2, posRef.current));

      g.clearRect(0, 0, W, H);
      bg(g, W, H);

      const cx = W / 2, anchorY = 25;
      const scale = Math.min((H - 80) / (totalLen * 2), 4);
      const natLenPx = naturalLen * scale;
      const extPx = (posRef.current + xEq) * scale;
      const bungeeLen = natLenPx + extPx;

      // Bridge/Ceiling
      rr(g, cx - 60, anchorY - 8, 120, 12, 4, "#475569", "#64748b");

      // Bungee cord (zigzag if stretched, straight if not)
      const coils = 12;
      const coilH = bungeeLen / coils;
      const stretch = (posRef.current + xEq) / xEq;
      const coilW = Math.max(5, 22 - stretch * 6);
      g.strokeStyle = "#8b5cf6"; g.lineWidth = 2.5; g.lineJoin = "round";
      g.beginPath(); g.moveTo(cx, anchorY + 4);
      for (let i = 0; i < coils; i++) {
        const y = anchorY + 4 + (i + 0.5) * coilH;
        g.lineTo(cx + (i % 2 === 0 ? coilW : -coilW), y);
      }
      g.lineTo(cx, anchorY + 4 + bungeeLen); g.stroke();

      // Person
      const personY = anchorY + 4 + bungeeLen;
      g.fillStyle = "#f97316";
      g.beginPath(); g.arc(cx, personY, 10, 0, Math.PI * 2); g.fill();
      rr(g, cx - 7, personY + 10, 14, 22, 3, "#f97316");

      // Equilibrium line
      const eqY = anchorY + 4 + natLenPx + xEq * scale;
      g.strokeStyle = "rgba(16,185,129,0.35)"; g.lineWidth = 1; g.setLineDash([4, 4]);
      g.beginPath(); g.moveTo(cx - 70, eqY); g.lineTo(cx + 70, eqY); g.stroke();
      g.setLineDash([]);
      txt(g, "Equilibrium", cx + 72, eqY + 4, "#10b981", 9, "left");

      // Spring force arrow
      const sf = k * (posRef.current + xEq);
      drawArrow(g, cx + 22, personY, cx + 22, personY - Math.min(sf * 0.05, 50), C.purple, 2);
      txt(g, `F_b=${sf.toFixed(0)}N`, cx + 24, personY - 8, C.purple, 9, "left");

      // Weight arrow
      drawArrow(g, cx - 22, personY, cx - 22, personY + Math.min(mass * GR * 0.05, 45), C.red, 2);
      txt(g, `mg=${(mass * GR).toFixed(0)}N`, cx - 24, personY + 8, C.red, 9, "right");

      infoBox(g, [
        ["Natural Length", `${naturalLen} m`],
        ["Extension x_eq", `${xEq.toFixed(2)} m`],
        ["Total Length", `${totalLen.toFixed(2)} m`],
        ["Bungee k", `${k} N/m`],
      ], W - 170, 12, 158);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [mass, k, naturalLen, xEq, totalLen]);

  return (
    <div style={card}>
      <div style={titleStyle}>🪃 Sim 13 — Bungee Cord Equilibrium</div>
      <canvas ref={cvs} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10 }}>
        <SliderCtrl label="Mass" value={mass} min={30} max={150} onChange={setMass} unit=" kg" />
        <SliderCtrl label="Bungee k" value={k} min={10} max={200} step={10} onChange={setK} unit=" N/m" />
        <SliderCtrl label="Natural Length" value={naturalLen} min={5} max={30} onChange={setNLen} unit=" m" />
      </div>
      <div style={eqStyle}>At equilibrium: kx = mg &nbsp;|&nbsp; x = mg/k = {xEq.toFixed(2)} m &nbsp;|&nbsp; Total = {totalLen.toFixed(2)} m</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
 * SIM 14: ARCHIMEDES — OBJECTS IN DIFFERENT LIQUIDS
 * ════════════════════════════════════════════════════════ */
function ArchimedesDensitySim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [objDens, setObjDens] = useState(0.9);

  const liquids = [
    { name: "Fresh Water", density: 1.0, color: "rgba(37,99,235,0.35)" },
    { name: "Salt Water", density: 1.025, color: "rgba(59,130,246,0.4)" },
    { name: "Cooking Oil", density: 0.9, color: "rgba(234,179,8,0.35)" },
    { name: "Mercury", density: 13.6, color: "rgba(100,116,139,0.5)" },
  ];

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    let raf = 0;
    let t = 0;

    const frame = () => {
      t += 0.016;
      g.clearRect(0, 0, W, H);
      bg(g, W, H);

      const tankW = 90, tankH = 140, objSize = 30;
      const numLiquids = liquids.length;
      const spacing = W / (numLiquids + 1);

      liquids.forEach((liq, i) => {
        const cx = spacing * (i + 1);
        const tankTop = (H - tankH) / 2;

        // Tank
        rr(g, cx - tankW / 2, tankTop, tankW, tankH, 4, "rgba(15,23,42,0.6)", "#334155", 2);

        // Liquid
        g.fillStyle = liq.color;
        g.fillRect(cx - tankW / 2 + 2, tankTop + 2, tankW - 4, tankH - 4);

        // Liquid name
        txt(g, liq.name, cx, tankTop + tankH + 14, "#64748b", 9);
        txt(g, `ρ=${liq.density}g/cm³`, cx, tankTop + tankH + 25, "#475569", 9);

        // Object position
        const fracSubmerged = Math.min(1, objDens / liq.density);
        const objY = fracSubmerged < 1
          ? tankTop + tankH - 4 - objSize * (1 - fracSubmerged) - objSize * fracSubmerged // float at surface
          : tankTop + tankH - 4 - objSize; // sink to bottom

        const floatOscY = fracSubmerged < 1 ? Math.sin(t + i) * 2 : 0;
        const drawObjY = Math.max(tankTop + 4, objY + floatOscY);

        // Object
        rr(g, cx - objSize / 2, drawObjY, objSize, objSize, 3, "#1d4ed8", "#60a5fa");
        txt(g, `${objDens}`, cx, drawObjY + objSize / 2 + 4, "#fff", 9);

        // Status label
        const status = fracSubmerged < 1 ? `Floats (${(fracSubmerged * 100).toFixed(0)}% sub)` : "Sinks";
        const sc = fracSubmerged < 1 ? C.green : C.red;
        txt(g, status, cx, tankTop - 10, sc, 9);
      });

      txt(g, `Object density: ${objDens} g/cm³`, W / 2, 18, C.white, 12);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [objDens]);

  return (
    <div style={card}>
      <div style={titleStyle}>🧪 Sim 14 — Archimedes: Object in Different Liquids</div>
      <canvas ref={cvs} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div style={{ marginTop: 10 }}>
        <SliderCtrl label="Object Density (g/cm³)" value={objDens} min={0.1} max={2.0} step={0.05} onChange={setObjDens} />
      </div>
      <div style={eqStyle}>Fraction submerged = ρ_object / ρ_liquid &nbsp;|&nbsp; Floats when ρ_obj {"<"} ρ_liquid &nbsp;|&nbsp; Sinks when ρ_obj {">"} ρ_liquid</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
 * SIM 15: NORMAL FORCE ON DIFFERENT INCLINE ANGLES
 * ════════════════════════════════════════════════════════ */
function NormalForceAnglesSim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [mass, setMass] = useState(10);
  const [hoveredIdx, setHoveredIdx] = useState(-1);

  const angles = [0, 15, 30, 45, 60, 75, 90];

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    let raf = 0;

    const frame = () => {
      g.clearRect(0, 0, W, H);
      bg(g, W, H);

      const spacing = W / (angles.length + 1);
      const baseY = H - 35;

      angles.forEach((ang, i) => {
        const cx = spacing * (i + 1);
        const θ = ang * Math.PI / 180;
        const N = mass * 9.8 * Math.cos(θ);
        const nFrac = N / (mass * 9.8);

        // Incline surface
        const incLen = 45;
        g.save(); g.translate(cx, baseY); g.rotate(-θ);
        g.strokeStyle = hoveredIdx === i ? "#60a5fa" : "#475569"; g.lineWidth = 3;
        g.beginPath(); g.moveTo(-incLen, 0); g.lineTo(incLen, 0); g.stroke();
        // Block
        rr(g, -12, -24, 24, 18, 3, hoveredIdx === i ? "#1d4ed8" : "#1e3a5f", "#3b82f6");
        g.restore();

        // N arrow (perpendicular to incline, i.e. at angle θ from vertical)
        const nLen = N * 0.15;
        const nx = cx - nLen * Math.sin(θ);
        const ny = baseY - nLen * Math.cos(θ);
        drawArrow(g, cx, baseY - 24, nx, ny - 24, C.green, 2);

        // Labels
        txt(g, `${ang}°`, cx, baseY + 14, "#94a3b8", 10);
        txt(g, `N=${N.toFixed(0)}N`, cx, baseY - 65, C.green, 9);

        // Bar graph
        const barMaxH = 55;
        const barH = nFrac * barMaxH;
        const barY = 25;
        rr(g, cx - 10, barY + barMaxH - barH, 20, barH, 2, hoveredIdx === i ? "#1d4ed8" : "#1e3a5f", "#3b82f6");
      });

      txt(g, `Normal Force vs Incline Angle (mass = ${mass} kg)`, W / 2, 16, C.white, 12);
      txt(g, "N = mg·cosθ   (decreases as slope steepens)", W / 2, H - 12, "#64748b", 10);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [mass, hoveredIdx, angles]);

  return (
    <div style={card}>
      <div style={titleStyle}>📊 Sim 15 — Normal Force on Different Incline Angles</div>
      <canvas ref={cvs} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div style={{ marginTop: 10 }}>
        <SliderCtrl label="Mass" value={mass} min={1} max={20} onChange={setMass} unit=" kg" />
      </div>
      <div style={eqStyle}>N = mg·cosθ &nbsp;|&nbsp; N = mg at 0° &nbsp;|&nbsp; N = 0 at 90° &nbsp;|&nbsp; N = 0.707·mg at 45°</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
 * MAIN EXPORT — renders all 15 simulations
 * ════════════════════════════════════════════════════════ */
export function AdvancedTopic1Sims() {
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{
        background: "linear-gradient(90deg,rgba(99,102,241,0.15),transparent)",
        borderLeft: "3px solid #6366f1",
        padding: "10px 16px",
        marginBottom: 20,
        borderRadius: "0 8px 8px 0",
      }}>
        <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 15 }}>
          ⚡ Advanced Simulations — Balanced &amp; Unbalanced Forces
        </div>
        <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>
          15 interactive physics simulations with real-time force calculations
        </div>
      </div>
      <InclinedPlaneSim />
      <AtwoodMachineSim />
      <BuoyancySim />
      <SpringScaleSim />
      <SeesawSim />
      <FloatingBoatSim />
      <WindFrictionSim />
      <TwoRopeTensionSim />
      <BookStackSim />
      <TerminalVelocitySim />
      <HydraulicPressSim />
      <CraneTensionSim />
      <BungeeSim />
      <ArchimedesDensitySim />
      <NormalForceAnglesSim />
    </div>
  );
}
