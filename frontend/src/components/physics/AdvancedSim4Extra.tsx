"use client";
/**
 * FILE: AdvancedSim4Extra.tsx
 * LOCATION: src/components/physics/AdvancedSim4Extra.tsx
 * PURPOSE: 9 additional professional canvas-based physics simulations for
 *          Topic 4 — Newton's Third Law (Action & Reaction) (Class 9 Science).
 *          Every force has an equal and opposite reaction force.
 * EXPORTS: AdvancedTopic4ExtraSims
 * LAST UPDATED: 2026-05-31
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ── Shared helpers ──────────────────────────────────────────────────── */
function arrow(g: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, lw = 2.5, hs = 10) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
  if (len < 4) return;
  const ang = Math.atan2(dy, dx), h = Math.min(hs, len * 0.35);
  g.save(); g.strokeStyle = color; g.fillStyle = color; g.lineWidth = lw; g.lineCap = "round";
  g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2 - h * 0.8 * Math.cos(ang), y2 - h * 0.8 * Math.sin(ang)); g.stroke();
  g.beginPath(); g.moveTo(x2, y2);
  g.lineTo(x2 - h * Math.cos(ang - 0.42), y2 - h * Math.sin(ang - 0.42));
  g.lineTo(x2 - h * Math.cos(ang + 0.42), y2 - h * Math.sin(ang + 0.42));
  g.closePath(); g.fill(); g.restore();
}
function lbl(g: CanvasRenderingContext2D, s: string, x: number, y: number, color = "#e2e8f0", size = 11, align: CanvasTextAlign = "center") {
  g.save(); g.font = `bold ${size}px 'Inter',sans-serif`; g.fillStyle = color; g.textAlign = align; g.fillText(s, x, y); g.restore();
}
function bg(g: CanvasRenderingContext2D, w: number, h: number) {
  const gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, "#0d1117"); gr.addColorStop(1, "#0b1120");
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.strokeStyle = "rgba(255,255,255,0.022)"; g.lineWidth = 1;
  for (let x = 50; x < w; x += 50) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  for (let y = 50; y < h; y += 50) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
}
function Card({ title, tag, desc, children }: { title: string; tag: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "linear-gradient(135deg,#0f172a,#0d1b2a)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16, padding: "22px 24px", marginBottom: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ background: "rgba(239,68,68,0.18)", color: "#fca5a5", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "3px 9px", borderRadius: 6 }}>{tag}</span>
        <h3 style={{ color: "#f1f5f9", fontSize: 17, fontWeight: 800, margin: 0 }}>{title}</h3>
      </div>
      <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 14px", lineHeight: 1.6 }}>{desc}</p>
      {children}
    </div>
  );
}
function Sld({ label: l, value, min, max, step = 1, color = "#ef4444", onChange }: { label: string; value: number; min: number; max: number; step?: number; color?: string; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
        <span style={{ color: "#94a3b8" }}>{l}</span>
        <span style={{ color, fontFamily: "monospace" }}>{value.toFixed(step < 1 ? 2 : 0)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: color }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E4-1 — Rocket Propulsion (Action-Reaction in Space)
 * Exhaust gases pushed backward (action) → rocket pushed forward (reaction)
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_RocketPropulsion() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [exhaustSpeed, setExhaustSpeed] = useState(2500);
  const [massFlow, setMassFlow]         = useState(10);
  const ph = useRef({ x: 80, v: 0, t: 0 });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    /* Thrust = exhaust_speed * mass_flow_rate */
    const thrust = exhaustSpeed * massFlow;
    const mass   = 1000; /* kg simplified */
    const a      = thrust / mass;
    s.v += a * dt;
    s.x += s.v * dt * 0.02;
    if (s.x > W * 0.7) s.x = 80;
    s.t += dt;

    bg(g, W, H);

    /* Stars */
    for (let i = 0; i < 70; i++) {
      const sx = (i * 183 + 31) % W, sy = (i * 97 + 53) % H;
      const b = 0.2 + 0.8 * Math.abs(Math.sin(i + s.t * (i % 5)));
      g.fillStyle = `rgba(255,255,255,${b * 0.6})`;
      g.beginPath(); g.arc(sx, sy, 1 + (i % 2) * 0.5, 0, Math.PI * 2); g.fill();
    }

    const rx = s.x, ry = H / 2;

    /* Exhaust plume */
    for (let i = 0; i < 12; i++) {
      const ox = rx - 30 - i * 12;
      const oy = ry + (Math.sin(s.t * 20 + i) * 8 * (i / 12));
      const alpha = (1 - i / 12) * 0.7;
      const radius2 = 4 + i * 1.8;
      g.fillStyle = `rgba(251,146,60,${alpha})`;
      g.beginPath(); g.ellipse(ox, oy, radius2, radius2 * 0.5, 0, 0, Math.PI * 2); g.fill();
    }
    /* Inner hot plume */
    for (let i = 0; i < 6; i++) {
      g.fillStyle = `rgba(253,224,71,${(1 - i / 6) * 0.6})`;
      g.beginPath(); g.ellipse(rx - 28 - i * 8, ry, 3 + i, 3, 0, 0, Math.PI * 2); g.fill();
    }

    /* Rocket body */
    const bodyGr = g.createLinearGradient(rx - 25, ry - 14, rx + 50, ry + 14);
    bodyGr.addColorStop(0, "#94a3b8"); bodyGr.addColorStop(1, "#475569");
    g.fillStyle = bodyGr; g.beginPath(); g.roundRect(rx - 25, ry - 14, 75, 28, 6); g.fill();
    g.strokeStyle = "#cbd5e1"; g.lineWidth = 1.5; g.beginPath(); g.roundRect(rx - 25, ry - 14, 75, 28, 6); g.stroke();
    /* Nose */
    g.fillStyle = "#dc2626"; g.beginPath(); g.moveTo(rx + 50, ry); g.lineTo(rx + 68, ry - 8); g.lineTo(rx + 68, ry + 8); g.closePath(); g.fill();
    /* Window */
    g.fillStyle = "#0ea5e9"; g.beginPath(); g.arc(rx + 28, ry, 7, 0, Math.PI * 2); g.fill();
    /* Fins */
    g.fillStyle = "#64748b";
    g.beginPath(); g.moveTo(rx - 18, ry - 14); g.lineTo(rx - 30, ry - 28); g.lineTo(rx - 5, ry - 14); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(rx - 18, ry + 14); g.lineTo(rx - 30, ry + 28); g.lineTo(rx - 5, ry + 14); g.closePath(); g.fill();

    /* Action arrow (exhaust backward) */
    arrow(g, rx - 30, ry + 45, rx - 30 - Math.min(thrust * 0.003, 100), ry + 45, "#ef4444", 3, 12);
    lbl(g, `Action: ${(thrust / 1000).toFixed(1)} kN`, rx - 110, ry + 38, "#ef4444", 10);
    /* Reaction arrow (rocket forward) */
    arrow(g, rx + 68, ry - 40, rx + 68 + Math.min(thrust * 0.003, 100), ry - 40, "#10b981", 3, 12);
    lbl(g, `Reaction: ${(thrust / 1000).toFixed(1)} kN`, rx + 68 + 50, ry - 38, "#10b981", 10, "left");

    lbl(g, `Thrust = ve × ṁ = ${exhaustSpeed}×${massFlow} = ${thrust.toFixed(0)} N`, W / 2, H - 30, "#94a3b8", 11);
    lbl(g, `Newton 3rd: gas pushed BACK → rocket pushed FORWARD  |  v = ${s.v.toFixed(1)} m/s`, W / 2, H - 12, "#64748b", 10);

    raf.current = requestAnimationFrame(draw);
  }, [exhaustSpeed, massFlow]);

  useEffect(() => {
    ph.current = { x: 80, v: 0, t: 0 };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E4-01" title="Rocket Propulsion — Action-Reaction in Space" desc="Thrust = exhaust_speed × mass_flow. The rocket pushes gas backward (action); gas pushes rocket forward (reaction). No air needed — Newton's 3rd Law works in vacuum!">
      <canvas ref={cvs} width={700} height={280} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Exhaust Speed ve (m/s)" value={exhaustSpeed} min={500} max={5000} step={100} color="#ef4444" onChange={setExhaustSpeed} />
        <Sld label="Mass Flow ṁ (kg/s)" value={massFlow} min={1} max={50} color="#10b981" onChange={setMassFlow} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E4-2 — Gun Recoil (Bullet Forward ↔ Gun Backward)
 * Conservation of momentum: m_b·v_b = m_g·v_g  (Newton's 3rd Law)
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_GunRecoil() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [bulletMass, setBulletM] = useState(0.01);
  const [bulletV, setBulletV]    = useState(300);
  const [gunMass, setGunMass]    = useState(3);
  const ph = useRef({ bulletX: 0, gunX: 0, fired: false, bulletVel: 0, gunVel: 0 });

  const fire = () => {
    if (ph.current.fired) {
      ph.current = { bulletX: 0, gunX: 0, fired: false, bulletVel: 0, gunVel: 0 };
    } else {
      /* Conservation of momentum: p_before = 0 */
      const vBullet = bulletV;
      const vGun    = -(bulletMass * bulletV) / gunMass;
      ph.current = { bulletX: 0, gunX: 0, fired: true, bulletVel: vBullet, gunVel: vGun };
    }
  };

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;

    if (s.fired) {
      s.bulletX += s.bulletVel * dt * 0.5;
      s.gunX    += s.gunVel    * dt * 0.8;
      if (s.bulletX > W * 0.8) s.bulletVel = 0;
      if (s.gunX < -100)       s.gunVel    = 0;
    }

    bg(g, W, H);

    const gy = H / 2;

    /* Ground */
    g.fillStyle = "#1e293b"; g.fillRect(0, gy + 60, W, 40);

    /* Gun body */
    const gx = W / 2 + s.gunX;
    g.fillStyle = "#475569"; g.beginPath(); g.roundRect(gx - 50, gy - 20, 80, 40, 8); g.fill();
    /* Gun barrel */
    g.fillStyle = "#374151"; g.fillRect(gx + 30, gy - 8, 50, 16);
    /* Person silhouette */
    g.fillStyle = "#334155";
    g.beginPath(); g.arc(gx - 30, gy - 35, 14, 0, Math.PI * 2); g.fill();
    g.fillRect(gx - 42, gy - 21, 24, 40);

    /* Bullet */
    const bx = W / 2 + s.bulletX + (s.fired ? 80 : 0);
    if (bx < W - 10) {
      const bGr = g.createLinearGradient(bx, gy - 4, bx + 20, gy + 4);
      bGr.addColorStop(0, "#fbbf24"); bGr.addColorStop(1, "#d97706");
      g.fillStyle = bGr; g.beginPath(); g.roundRect(bx, gy - 4, 20, 8, 4); g.fill();
      /* Muzzle flash */
      if (s.fired && s.bulletX < 60) {
        g.fillStyle = "rgba(251,191,36,0.8)"; g.beginPath(); g.ellipse(W / 2 + 83, gy, 18, 10, 0, 0, Math.PI * 2); g.fill();
      }
    }

    /* Force arrows */
    if (s.fired) {
      arrow(g, gx + 30, gy - 40, gx + 30 + Math.min(bulletMass * bulletV * 4, 90), gy - 40, "#10b981", 3, 12);
      lbl(g, `F on bullet →`, gx + 80, gy - 55, "#10b981", 10);
      arrow(g, gx - 18, gy + 44, gx - 18 - Math.min(bulletMass * bulletV * 4, 90), gy + 44, "#ef4444", 3, 12);
      lbl(g, `← F on gun`, gx - 80, gy + 56, "#ef4444", 10);
    }

    const vGun = -(bulletMass * bulletV) / gunMass;
    lbl(g, `Bullet: m=${bulletMass}kg  v=${bulletV}m/s  p=${(bulletMass * bulletV).toFixed(2)} kg·m/s →`, W / 2, H - 32, "#10b981", 10);
    lbl(g, `Gun recoil: m=${gunMass}kg  v=${Math.abs(vGun).toFixed(2)}m/s ←  (equal & opposite momentum)`, W / 2, H - 14, "#ef4444", 10);
    if (!s.fired) lbl(g, "Press FIRE to launch", W / 2, gy - 60, "#6366f1", 12);

    raf.current = requestAnimationFrame(draw);
  }, [bulletMass, bulletV, gunMass]);

  useEffect(() => {
    ph.current = { bulletX: 0, gunX: 0, fired: false, bulletVel: 0, gunVel: 0 };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E4-02" title="Gun Recoil — Equal & Opposite Momentum" desc="Before firing: total momentum = 0. After: bullet goes forward, gun recoils backward. Same magnitude of force on both — Newton's 3rd Law + conservation of momentum.">
      <canvas ref={cvs} width={700} height={280} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b", alignItems: "end" }}>
        <Sld label="Bullet Mass (kg)" value={bulletMass} min={0.005} max={0.1} step={0.005} color="#10b981" onChange={setBulletM} />
        <Sld label="Bullet Speed (m/s)" value={bulletV} min={100} max={1000} step={50} color="#22d3ee" onChange={setBulletV} />
        <Sld label="Gun Mass (kg)" value={gunMass} min={0.5} max={15} step={0.5} color="#f59e0b" onChange={setGunMass} />
        <button onClick={fire} style={{ padding: "12px 16px", borderRadius: 8, background: ph.current.fired ? "#334155" : "#dc2626", color: "#fff", border: "none", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
          {ph.current.fired ? "↺ Reset" : "🔫 FIRE"}
        </button>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E4-3 — Person Jumps Off a Boat
 * Person pushes boat backward (action); boat pushes person forward (reaction)
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_BoatJump() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [personMass, setPersonM] = useState(70);
  const [jumpSpeed, setJumpSpeed] = useState(3);
  const [boatMass, setBoatMass]   = useState(150);
  const ph = useRef({ personX: 0, boatX: 0, jumped: false, pVel: 0, bVel: 0 });

  const jump = () => {
    if (ph.current.jumped) {
      ph.current = { personX: 0, boatX: 0, jumped: false, pVel: 0, bVel: 0 };
    } else {
      const boatV = -(personMass * jumpSpeed) / boatMass;
      ph.current = { personX: 0, boatX: 0, jumped: true, pVel: jumpSpeed, bVel: boatV };
    }
  };

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    if (s.jumped) {
      s.personX += s.pVel * dt * 40;
      s.boatX   += s.bVel * dt * 40;
    }

    bg(g, W, H);

    /* Water */
    const waterY = H * 0.58;
    const waterGr = g.createLinearGradient(0, waterY, 0, H);
    waterGr.addColorStop(0, "rgba(59,130,246,0.4)"); waterGr.addColorStop(1, "rgba(29,78,216,0.6)");
    g.fillStyle = waterGr; g.fillRect(0, waterY, W, H - waterY);
    /* Ripples */
    g.strokeStyle = "rgba(147,197,253,0.4)"; g.lineWidth = 1.5;
    for (let i = 0; i < 5; i++) {
      g.beginPath(); g.moveTo(i * 140 + 20, waterY + 10); g.lineTo(i * 140 + 80, waterY + 10); g.stroke();
    }
    lbl(g, "Water", W / 2, waterY + 20, "rgba(147,197,253,0.6)", 10);

    /* Boat */
    const boatCX = W / 2 + 30 + s.boatX;
    const boatGr = g.createLinearGradient(boatCX - 80, waterY - 20, boatCX + 80, waterY + 10);
    boatGr.addColorStop(0, "#854d0e"); boatGr.addColorStop(1, "#713f12");
    g.fillStyle = boatGr;
    g.beginPath();
    g.moveTo(boatCX - 90, waterY - 20);
    g.lineTo(boatCX - 70, waterY + 10);
    g.lineTo(boatCX + 70, waterY + 10);
    g.lineTo(boatCX + 90, waterY - 20);
    g.closePath(); g.fill();
    g.strokeStyle = "#a16207"; g.lineWidth = 2;
    g.beginPath();
    g.moveTo(boatCX - 90, waterY - 20);
    g.lineTo(boatCX - 70, waterY + 10);
    g.lineTo(boatCX + 70, waterY + 10);
    g.lineTo(boatCX + 90, waterY - 20);
    g.stroke();
    lbl(g, `Boat ${boatMass}kg`, boatCX, waterY - 8, "#fbbf24", 11);

    /* Person */
    const px2 = W / 2 - 40 + s.personX;
    const py  = waterY - 60;
    g.fillStyle = "#fca5a5"; g.beginPath(); g.arc(px2, py - 14, 11, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#f87171"; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(px2, py - 3); g.lineTo(px2, py + 20); g.stroke();
    if (s.jumped) {
      /* Arms back (jumping pose) */
      g.beginPath(); g.moveTo(px2, py + 8); g.lineTo(px2 - 18, py + 18); g.stroke();
      g.beginPath(); g.moveTo(px2, py + 8); g.lineTo(px2 + 18, py + 18); g.stroke();
    } else {
      g.beginPath(); g.moveTo(px2, py + 8); g.lineTo(px2 - 12, py + 3); g.stroke();
      g.beginPath(); g.moveTo(px2, py + 8); g.lineTo(px2 + 12, py + 3); g.stroke();
    }
    lbl(g, `${personMass}kg`, px2, py - 28, "#fca5a5", 10);

    /* Arrows */
    if (s.jumped) {
      arrow(g, px2, waterY - 35, px2 + Math.min(s.pVel * 20, 90), waterY - 35, "#10b981", 3, 12);
      lbl(g, `Reaction: ${s.pVel.toFixed(1)}m/s`, px2 + 50, waterY - 49, "#10b981", 10);
      arrow(g, boatCX, waterY - 35, boatCX + Math.min(s.bVel * 20, -30), waterY - 35, "#ef4444", 3, 12);
      const boatV = -(personMass * jumpSpeed) / boatMass;
      lbl(g, `Action: ${Math.abs(boatV).toFixed(2)}m/s`, boatCX - 60, waterY - 49, "#ef4444", 10);
    } else {
      lbl(g, "Press JUMP", W / 2, H * 0.3, "#6366f1", 13);
    }

    const boatVCalc = -(personMass * jumpSpeed) / boatMass;
    lbl(g, `Person: v=${jumpSpeed}m/s forward   |   Boat: v=${Math.abs(boatVCalc).toFixed(2)}m/s backward`, W / 2, H - 28, "#94a3b8", 11);
    lbl(g, `p_total = m_p·v_p + m_b·v_b = ${(personMass * jumpSpeed + boatMass * boatVCalc).toFixed(2)} kg·m/s ≈ 0`, W / 2, H - 10, "#64748b", 10);

    raf.current = requestAnimationFrame(draw);
  }, [personMass, jumpSpeed, boatMass]);

  useEffect(() => {
    ph.current = { personX: 0, boatX: 0, jumped: false, pVel: 0, bVel: 0 };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E4-03" title="Person Jumps Off Boat — Newton's 3rd Law" desc="Person pushes the boat backward with their feet (action). The boat pushes the person forward equally (reaction). Momentum is conserved: p_person + p_boat = 0.">
      <canvas ref={cvs} width={700} height={280} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b", alignItems: "end" }}>
        <Sld label="Person Mass (kg)" value={personMass} min={30} max={120} color="#fca5a5" onChange={setPersonM} />
        <Sld label="Jump Speed (m/s)" value={jumpSpeed} min={0.5} max={8} step={0.5} color="#10b981" onChange={setJumpSpeed} />
        <Sld label="Boat Mass (kg)" value={boatMass} min={50} max={400} step={10} color="#f59e0b" onChange={setBoatMass} />
        <button onClick={jump} style={{ padding: "12px 16px", borderRadius: 8, background: ph.current.jumped ? "#334155" : "#2563eb", color: "#fff", border: "none", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
          {ph.current.jumped ? "↺ Reset" : "🏊 JUMP"}
        </button>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E4-4 — Balloon Propulsion (Air Action → Balloon Reaction)
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_Balloon() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [released, setReleased] = useState(false);
  const [airPressure, setAirPressure] = useState(60);
  const ph = useRef({ x: W_VAL(), y: 0, vx: 0, vy: 0, size: 1, t: 0 });

  function W_VAL() { return 350; }

  const doRelease = () => {
    ph.current = { x: 350, y: 0, vx: 0, vy: 0, size: 1, t: 0 };
    setReleased(true);
  };

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    s.t += dt;
    const thrust = airPressure * 0.8;
    const mass   = 0.05 + s.size * 0.02;

    if (released) {
      /* Random-ish erratic path (balloon wobble) */
      const ax = (Math.sin(s.t * 8) * thrust * 0.3) / mass;
      const ay = (-thrust * 0.6 + Math.sin(s.t * 5) * thrust * 0.2) / mass;
      s.vx += ax * dt; s.vy += ay * dt;
      s.vx *= 0.97; s.vy *= 0.97;
      s.x += s.vx * dt * 5;
      s.y += s.vy * dt * 5;
      s.size = Math.max(0.1, s.size - 0.003); /* deflating */
    }

    /* Boundary */
    if (s.x < 20 || s.x > W - 20) s.vx *= -0.7;
    if (s.y > H - 60) { s.y = H - 60; s.vy *= -0.5; }

    bg(g, W, H);

    /* Ceiling */
    g.fillStyle = "#1e293b"; g.fillRect(0, 0, W, 16);
    /* Walls */
    g.fillStyle = "#1e293b"; g.fillRect(0, 0, 16, H); g.fillRect(W - 16, 0, 16, H);
    g.fillStyle = "#1e293b"; g.fillRect(0, H - 40, W, 40);

    /* Balloon */
    const bR = (30 + airPressure * 0.3) * s.size;
    const bx = s.x, by = H * 0.3 + s.y;
    const bGr = g.createRadialGradient(bx - bR * 0.3, by - bR * 0.3, 2, bx, by, bR);
    bGr.addColorStop(0, "rgba(248,113,113,0.9)"); bGr.addColorStop(0.7, "rgba(220,38,38,0.8)"); bGr.addColorStop(1, "rgba(127,29,29,0.7)");
    g.fillStyle = bGr; g.beginPath(); g.ellipse(bx, by, bR, bR * 1.1, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#fca5a5"; g.lineWidth = 1.5; g.beginPath(); g.ellipse(bx, by, bR, bR * 1.1, 0, 0, Math.PI * 2); g.stroke();

    /* Knot + string */
    g.fillStyle = "#dc2626"; g.beginPath(); g.arc(bx, by + bR * 1.1, 5, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#94a3b8"; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(bx, by + bR * 1.1 + 5); g.lineTo(bx + 15, by + bR * 1.1 + 40); g.stroke();

    /* Air jet (action) */
    if (released && s.size > 0.3) {
      for (let i = 0; i < 8; i++) {
        const jy = by + bR * 1.1 + 10 + i * 12;
        const jx = bx + (Math.random() - 0.5) * 16;
        const alpha = (1 - i / 8) * 0.6;
        g.fillStyle = `rgba(203,213,225,${alpha})`;
        g.beginPath(); g.ellipse(jx, jy, 4 - i * 0.3, 4, 0, 0, Math.PI * 2); g.fill();
      }
      /* Air ejection arrow (action) */
      arrow(g, bx, by + bR + 25, bx, by + bR + 80, "#ef4444", 2.5, 10);
      lbl(g, "Air ejected ↓", bx + 8, by + bR + 60, "#ef4444", 9, "left");
      /* Balloon motion arrow (reaction) */
      arrow(g, bx, by - bR, bx + s.vx * 15, by - bR + s.vy * 15, "#10b981", 2.5, 10);
      lbl(g, "Balloon moves", bx + s.vx * 15 + 5, by - bR + s.vy * 15, "#10b981", 9, "left");
    }

    if (!released) {
      lbl(g, "Press RELEASE to let go", W / 2, H * 0.7, "#6366f1", 13);
      /* Nozzle indicator */
      g.strokeStyle = "#f59e0b"; g.lineWidth = 2; g.setLineDash([3, 3]);
      g.beginPath(); g.moveTo(bx, by + bR + 5); g.lineTo(bx, by + bR + 50); g.stroke();
      g.setLineDash([]);
      lbl(g, "Nozzle (air escapes here)", bx + 5, by + bR + 30, "#f59e0b", 9, "left");
    }

    lbl(g, `Action: air pushed DOWN  |  Reaction: balloon pushed UP (& sideways)`, W / 2, H - 14, "#94a3b8", 11);

    raf.current = requestAnimationFrame(draw);
  }, [released, airPressure]);

  useEffect(() => {
    ph.current = { x: 350, y: 0, vx: 0, vy: 0, size: 1, t: 0 };
    setReleased(false);
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E4-04" title="Balloon Propulsion — Air Jet Action-Reaction" desc="Air escapes from the balloon's nozzle downward (action force). The air pushes back on the balloon upward/forward (reaction force). Same physics as a rocket!">
      <canvas ref={cvs} width={700} height={320} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Air Pressure (inflated amount)" value={airPressure} min={20} max={100} color="#ef4444" onChange={(v) => { setAirPressure(v); ph.current = { x: 350, y: 0, vx: 0, vy: 0, size: 1, t: 0 }; setReleased(false); }} />
        <button onClick={doRelease} style={{ padding: "0 24px", borderRadius: 8, background: "#dc2626", color: "#fff", border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>🎈 RELEASE</button>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E4-5 — Swimming Strokes (Push Water Back → Move Forward)
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_Swimming() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [power, setPower] = useState(60);
  const ph = useRef({ x: 80, t: 0, vx: 0, bubbles: [] as { x: number; y: number; r: number; vy: number; alpha: number }[] });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    s.t += dt;

    /* Periodic stroke */
    const strokeCycle = Math.sin(s.t * 3);
    const strokeForce = power * Math.max(0, strokeCycle);
    s.vx += (strokeForce * 0.01 - 0.3) * dt;
    s.vx = Math.max(0.5, Math.min(s.vx, power * 0.15));
    s.x += s.vx * dt * 30;
    if (s.x > W - 80) s.x = 80;

    /* Bubbles (water pushed backward) */
    if (strokeForce > 5) {
      s.bubbles.push({
        x: s.x - 30 + Math.random() * 20,
        y: H * 0.45 + (Math.random() - 0.5) * 30,
        r: 2 + Math.random() * 4,
        vy: -0.5 - Math.random() * 1.5,
        alpha: 0.7,
      });
    }
    s.bubbles = s.bubbles.filter(b => b.alpha > 0.05);
    s.bubbles.forEach(b => { b.x -= (power * 0.05); b.vy -= 0.1; b.y += b.vy; b.alpha -= 0.012; });

    bg(g, W, H);

    /* Pool */
    const waterGr = g.createLinearGradient(0, 0, 0, H);
    waterGr.addColorStop(0, "rgba(14,116,144,0.4)"); waterGr.addColorStop(1, "rgba(7,89,133,0.7)");
    g.fillStyle = waterGr; g.fillRect(0, 0, W, H);

    /* Lane ropes */
    for (let i = 0; i < 3; i++) {
      const ry = H * 0.2 + i * H * 0.3;
      g.strokeStyle = "rgba(251,191,36,0.5)"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(0, ry); g.lineTo(W, ry); g.stroke();
      for (let x2 = 0; x2 < W; x2 += 30) {
        g.fillStyle = x2 % 60 === 0 ? "rgba(239,68,68,0.6)" : "rgba(251,191,36,0.6)";
        g.beginPath(); g.arc(x2, ry, 5, 0, Math.PI * 2); g.fill();
      }
    }

    /* Bubbles */
    s.bubbles.forEach(b => {
      g.fillStyle = `rgba(255,255,255,${b.alpha})`;
      g.beginPath(); g.arc(b.x, b.y, b.r, 0, Math.PI * 2); g.fill();
    });

    /* Swimmer */
    const swimX = s.x, swimY = H * 0.45;
    const armAngle = Math.sin(s.t * 3) * 0.8;
    g.save(); g.translate(swimX, swimY);
    /* Body */
    g.fillStyle = "#1d4ed8"; g.beginPath(); g.roundRect(-30, -8, 60, 16, 8); g.fill();
    /* Head */
    g.fillStyle = "#fca5a5"; g.beginPath(); g.arc(35, 0, 10, 0, Math.PI * 2); g.fill();
    /* Arms (animated) */
    g.strokeStyle = "#fca5a5"; g.lineWidth = 4; g.lineCap = "round";
    /* Right arm (pulling) */
    g.beginPath(); g.moveTo(10, 0); g.lineTo(10 - 30 * Math.cos(armAngle), -25 * Math.sin(armAngle)); g.stroke();
    /* Left arm (recovering) */
    g.beginPath(); g.moveTo(-10, 0); g.lineTo(-10 - 30 * Math.cos(-armAngle), 25 * Math.sin(-armAngle)); g.stroke();
    /* Legs */
    const legK = Math.sin(s.t * 6) * 0.3;
    g.beginPath(); g.moveTo(-22, 0); g.lineTo(-22 - 18, 12 + legK * 20); g.stroke();
    g.beginPath(); g.moveTo(-22, 0); g.lineTo(-22 - 18, 12 - legK * 20); g.stroke();
    g.restore();

    /* Stroke force arrows */
    if (strokeForce > 10) {
      /* Water pushed backward */
      arrow(g, swimX - 30, swimY - 30, swimX - 30 - strokeForce * 0.8, swimY - 30, "#ef4444", 2.5, 10);
      lbl(g, "Water ←", swimX - 30 - strokeForce * 0.4, swimY - 44, "#ef4444", 9);
      /* Swimmer moves forward */
      arrow(g, swimX + 40, swimY + 28, swimX + 40 + strokeForce * 0.8, swimY + 28, "#10b981", 2.5, 10);
      lbl(g, "→ Swimmer", swimX + 40 + strokeForce * 0.5, swimY + 42, "#10b981", 9);
    }

    lbl(g, `Stroke force = ${strokeForce.toFixed(0)}N  |  Swimming speed = ${s.vx.toFixed(2)} m/s`, W / 2, H - 14, "#94a3b8", 11);

    raf.current = requestAnimationFrame(draw);
  }, [power]);

  useEffect(() => {
    ph.current = { x: 80, t: 0, vx: 0, bubbles: [] };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E4-05" title="Swimming — Push Water Back (Action) → Move Forward (Reaction)" desc="The swimmer's hands push water backward (action). The water pushes the swimmer forward (reaction). Stronger strokes → faster swimming.">
      <canvas ref={cvs} width={700} height={280} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Stroke Power (N)" value={power} min={10} max={120} color="#22d3ee" onChange={setPower} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E4-6 — Two Ice Skaters Push Apart (Action-Reaction Pairs)
 * Both start at rest; push → equal and opposite momenta
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_SkatersPush() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [m1, setM1] = useState(60);
  const [m2, setM2] = useState(90);
  const ph = useRef({ x1: 0, x2: 0, v1: 0, v2: 0, pushed: false });

  const push = () => {
    if (ph.current.pushed) {
      ph.current = { x1: 0, x2: 0, v1: 0, v2: 0, pushed: false };
    } else {
      /* v1 * m1 = -v2 * m2  (momentum conservation), choose v1=3 */
      const v1 = 3, v2 = -(m1 * v1) / m2;
      ph.current = { x1: 0, x2: 0, v1, v2, pushed: true };
    }
  };

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    if (s.pushed) {
      s.x1 += s.v1 * dt * 30;
      s.x2 += s.v2 * dt * 30;
    }

    bg(g, W, H);

    /* Ice rink */
    const iceGr = g.createLinearGradient(0, H * 0.55, 0, H);
    iceGr.addColorStop(0, "rgba(219,234,254,0.1)"); iceGr.addColorStop(1, "rgba(191,219,254,0.06)");
    g.fillStyle = iceGr; g.fillRect(0, H * 0.55, W, H * 0.45);
    g.strokeStyle = "rgba(147,197,253,0.3)"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(0, H * 0.55); g.lineTo(W, H * 0.55); g.stroke();
    lbl(g, "Frictionless Ice", W / 2, H * 0.55 + 14, "rgba(147,197,253,0.5)", 10);

    /* Skater 1 */
    const s1x = W / 2 - 50 + s.x1;
    const sy  = H * 0.55 - 80;
    g.save(); g.translate(s1x, sy);
    g.fillStyle = "#dc2626"; g.beginPath(); g.roundRect(-15, 10, 30, 44, 6); g.fill();
    g.fillStyle = "#fca5a5"; g.beginPath(); g.arc(0, 0, 14, 0, Math.PI * 2); g.fill();
    if (s.pushed) { g.strokeStyle = "#fca5a5"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(15, 20); g.lineTo(38, 30); g.stroke(); }
    g.restore();
    lbl(g, `${m1}kg`, s1x, sy - 20, "#ef4444", 11);

    /* Skater 2 */
    const s2x = W / 2 + 50 + s.x2;
    g.save(); g.translate(s2x, sy);
    g.fillStyle = "#2563eb"; g.beginPath(); g.roundRect(-15, 10, 30, 44, 6); g.fill();
    g.fillStyle = "#bfdbfe"; g.beginPath(); g.arc(0, 0, 14, 0, Math.PI * 2); g.fill();
    if (s.pushed) { g.strokeStyle = "#bfdbfe"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-15, 20); g.lineTo(-38, 30); g.stroke(); }
    g.restore();
    lbl(g, `${m2}kg`, s2x, sy - 20, "#3b82f6", 11);

    if (s.pushed) {
      arrow(g, s1x, sy + 25, s1x - 60, sy + 25, "#ef4444", 2.5, 10);
      arrow(g, s2x, sy + 25, s2x + 60, sy + 25, "#3b82f6", 2.5, 10);
      lbl(g, `v=${s.v1.toFixed(2)}m/s`, s1x - 70, sy + 15, "#ef4444", 10);
      lbl(g, `v=${Math.abs(s.v2).toFixed(2)}m/s`, s2x + 70, sy + 15, "#3b82f6", 10);
    } else {
      lbl(g, "Both at rest — total momentum = 0", W / 2, H * 0.3, "#64748b", 12);
      lbl(g, "Press PUSH to see them separate", W / 2, H * 0.3 + 20, "#6366f1", 11);
    }

    const v2 = -(m1 * 3) / m2;
    lbl(g, `p₁ = ${m1}×3 = ${(m1 * 3).toFixed(0)} kg·m/s   |   p₂ = ${m2}×${Math.abs(v2).toFixed(2)} = ${(m2 * Math.abs(v2)).toFixed(0)} kg·m/s`, W / 2, H - 28, "#94a3b8", 11);
    lbl(g, `Total momentum = ${(m1 * 3 + m2 * v2).toFixed(2)} kg·m/s ≈ 0  (conserved!)`, W / 2, H - 10, "#64748b", 10);

    raf.current = requestAnimationFrame(draw);
  }, [m1, m2]);

  useEffect(() => {
    ph.current = { x1: 0, x2: 0, v1: 0, v2: 0, pushed: false };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E4-06" title="Ice Skaters Push Apart — Equal & Opposite" desc="Both skaters start at rest (total p=0). They push each other: action on skater 1 = reaction on skater 2. Total momentum remains zero; lighter skater moves faster.">
      <canvas ref={cvs} width={700} height={280} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 14, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b", alignItems: "end" }}>
        <Sld label="Skater 1 Mass (kg)" value={m1} min={30} max={100} color="#ef4444" onChange={setM1} />
        <Sld label="Skater 2 Mass (kg)" value={m2} min={30} max={150} color="#3b82f6" onChange={setM2} />
        <button onClick={push} style={{ padding: "12px 18px", borderRadius: 8, background: ph.current.pushed ? "#334155" : "#2563eb", color: "#fff", border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
          {ph.current.pushed ? "↺ Reset" : "🤜 PUSH"}
        </button>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E4-7 — Walking: Foot Pushes Ground Back, Ground Pushes Forward
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_Walking() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [speed, setSpeed] = useState(4);
  const ph = useRef({ x: 100, t: 0 });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    s.t += 0.016 * speed * 0.5;
    s.x += speed * 0.04;
    if (s.x > W - 80) s.x = 80;

    bg(g, W, H);

    /* Ground */
    g.fillStyle = "#1e293b"; g.fillRect(0, H * 0.7, W, H * 0.3);
    g.strokeStyle = "#334155"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, H * 0.7); g.lineTo(W, H * 0.7); g.stroke();
    /* Ground texture */
    for (let x = 0; x < W; x += 30) {
      g.strokeStyle = "#475569"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(x, H * 0.7); g.lineTo(x + 15, H * 0.7 + 8); g.stroke();
    }

    const gY = H * 0.7, px = s.x, bodyY = gY - 80;

    /* Walking stick figure */
    const phase = s.t;
    const legAngle = Math.sin(phase) * 0.5;
    const legAngle2 = Math.sin(phase + Math.PI) * 0.5;
    const armAngle = Math.sin(phase + Math.PI) * 0.4;

    g.save(); g.translate(px, bodyY + 40);
    /* Head */
    g.fillStyle = "#fca5a5"; g.beginPath(); g.arc(0, -55, 14, 0, Math.PI * 2); g.fill();
    /* Body */
    g.strokeStyle = "#fca5a5"; g.lineWidth = 3; g.lineCap = "round";
    g.beginPath(); g.moveTo(0, -41); g.lineTo(0, 0); g.stroke();
    /* Arms */
    g.beginPath(); g.moveTo(0, -30); g.lineTo(-20 + armAngle * 20, -15); g.stroke();
    g.beginPath(); g.moveTo(0, -30); g.lineTo(20 - armAngle * 20, -15); g.stroke();
    /* Legs */
    const foot1y = 35, foot1x = 15 * legAngle;
    const foot2y = 35, foot2x = 15 * legAngle2;
    g.beginPath(); g.moveTo(0, 0); g.lineTo(foot1x, foot1y); g.stroke();
    g.beginPath(); g.moveTo(0, 0); g.lineTo(foot2x, foot2y); g.stroke();

    /* Ground reaction force at active foot */
    const activeFootX = foot1x, activeFootY = foot1y;
    arrow(g, activeFootX, activeFootY + 5, activeFootX - 12, activeFootY + 5, "#ef4444", 2.5, 10);
    lbl(g, "Foot pushes\nground →", activeFootX, activeFootY + 22, "#ef4444", 8);
    arrow(g, activeFootX, activeFootY - 5, activeFootX + 12, activeFootY - 5, "#10b981", 2.5, 10);
    lbl(g, "← Ground pushes\nperson forward", activeFootX + 14, activeFootY - 8, "#10b981", 8, "left");

    g.restore();

    /* Velocity arrow */
    arrow(g, px + 24, bodyY + 5, px + 24 + Math.min(speed * 10, 80), bodyY + 5, "#22d3ee", 2.5, 10);
    lbl(g, `v=${speed}m/s`, px + 24 + Math.min(speed * 10, 80) + 5, bodyY + 9, "#22d3ee", 9, "left");

    lbl(g, "Foot pushes ground BACKWARD (action) → Ground pushes person FORWARD (reaction)", W / 2, H - 14, "#94a3b8", 11);

    raf.current = requestAnimationFrame(draw);
  }, [speed]);

  useEffect(() => { raf.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(raf.current); }, [draw]);

  return (
    <Card tag="E4-07" title="Walking — Ground Reaction Force" desc="Each footstep pushes the ground backward (action). The ground's normal + friction reaction pushes the person forward. Without this reaction, walking would be impossible (like on a frictionless surface)!">
      <canvas ref={cvs} width={700} height={280} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Walking Speed (m/s)" value={speed} min={0.5} max={8} step={0.5} color="#22d3ee" onChange={setSpeed} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E4-8 — Magnetic Repulsion (Contact-free Action-Reaction)
 * Two magnets repel; forces are equal and opposite at all distances
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_MagneticRepulsion() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [m1, setM1] = useState(2);
  const [m2, setM2] = useState(4);
  const ph = useRef({ x1: 200, x2: 500, v1: 0, v2: 0 });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const dist = Math.max(10, s.x2 - s.x1);
    const Frep = 30000 / (dist * dist);
    s.v1 -= (Frep / m1) * dt; s.v2 += (Frep / m2) * dt;
    s.v1 *= 0.99; s.v2 *= 0.99;
    s.x1 += s.v1 * dt * 30; s.x2 += s.v2 * dt * 30;
    if (s.x1 < 60)  { s.x1 = 60;  s.v1 *= -0.7; }
    if (s.x2 > W - 60) { s.x2 = W - 60; s.v2 *= -0.7; }

    bg(g, W, H);

    const cy = H / 2;
    /* Field lines */
    for (let i = -3; i <= 3; i++) {
      const y = cy + i * 30;
      const midX = (s.x1 + s.x2) / 2;
      const arc = (s.x2 - s.x1) * 0.3;
      g.strokeStyle = `rgba(99,102,241,${0.08 + Math.abs(i) * 0.02})`; g.lineWidth = 1; g.setLineDash([4, 4]);
      g.beginPath(); g.moveTo(s.x1, y); g.quadraticCurveTo(midX, y - arc * (i % 2 === 0 ? 1 : -1), s.x2, y); g.stroke();
    }
    g.setLineDash([]);

    /* Magnet 1 (left) */
    const mag1Gr = g.createLinearGradient(s.x1 - 30, cy - 20, s.x1 + 30, cy + 20);
    mag1Gr.addColorStop(0, "#b91c1c"); mag1Gr.addColorStop(0.5, "#7f1d1d"); mag1Gr.addColorStop(1, "#1d4ed8");
    g.fillStyle = mag1Gr; g.beginPath(); g.roundRect(s.x1 - 30, cy - 22, 60, 44, 8); g.fill();
    g.strokeStyle = "#f87171"; g.lineWidth = 2; g.beginPath(); g.roundRect(s.x1 - 30, cy - 22, 60, 44, 8); g.stroke();
    lbl(g, "N    S", s.x1, cy + 5, "#fff", 12);
    lbl(g, `m₁=${m1}kg`, s.x1, cy - 30, "#ef4444", 10);

    /* Magnet 2 (right, flipped) */
    const mag2Gr = g.createLinearGradient(s.x2 - 30, cy - 20, s.x2 + 30, cy + 20);
    mag2Gr.addColorStop(0, "#1d4ed8"); mag2Gr.addColorStop(0.5, "#1e3a8a"); mag2Gr.addColorStop(1, "#b91c1c");
    g.fillStyle = mag2Gr; g.beginPath(); g.roundRect(s.x2 - 30, cy - 22, 60, 44, 8); g.fill();
    g.strokeStyle = "#93c5fd"; g.lineWidth = 2; g.beginPath(); g.roundRect(s.x2 - 30, cy - 22, 60, 44, 8); g.stroke();
    lbl(g, "N    S", s.x2, cy + 5, "#fff", 12);
    lbl(g, `m₂=${m2}kg`, s.x2, cy - 30, "#3b82f6", 10);

    /* Force arrows */
    const fl = Math.min(Frep * 0.5, 80);
    arrow(g, s.x1 + 30, cy - 40, s.x1 + 30 - fl, cy - 40, "#ef4444", 3, 12);
    lbl(g, `${Frep.toFixed(1)}N`, s.x1 + 30 - fl - 8, cy - 52, "#ef4444", 9, "right");
    arrow(g, s.x2 - 30, cy - 40, s.x2 - 30 + fl, cy - 40, "#3b82f6", 3, 12);
    lbl(g, `${Frep.toFixed(1)}N`, s.x2 - 30 + fl + 8, cy - 52, "#3b82f6", 9, "left");

    lbl(g, `Gap = ${(dist / 30).toFixed(1)} cm   |   F_repulsion = ${Frep.toFixed(1)} N (equal on both magnets!)`, W / 2, H - 28, "#94a3b8", 11);
    lbl(g, `Newton's 3rd: magnet 1 pushes magnet 2 = magnet 2 pushes magnet 1 (action at a distance)`, W / 2, H - 10, "#64748b", 10);

    raf.current = requestAnimationFrame(draw);
  }, [m1, m2]);

  useEffect(() => {
    ph.current = { x1: 200, x2: 500, v1: 0, v2: 0 };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E4-08" title="Magnetic Repulsion — Action-Reaction at a Distance" desc="Two N poles repel with equal and opposite forces even without contact. Newton's 3rd Law holds for ALL forces including gravity and electromagnetic fields.">
      <canvas ref={cvs} width={700} height={280} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Magnet 1 Mass (kg)" value={m1} min={0.5} max={10} step={0.5} color="#ef4444" onChange={(v) => { setM1(v); ph.current = { x1: 200, x2: 500, v1: 0, v2: 0 }; }} />
        <Sld label="Magnet 2 Mass (kg)" value={m2} min={0.5} max={10} step={0.5} color="#3b82f6" onChange={(v) => { setM2(v); ph.current = { x1: 200, x2: 500, v1: 0, v2: 0 }; }} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E4-9 — Trampoline Bounce (Action-Reaction Elastic Potential)
 * Person pushes trampoline down; trampoline pushes person up
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_Trampoline() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [mass, setMass]   = useState(60);
  const [k, setK]         = useState(8000);
  const ph = useRef({ y: 0, v: 8, sag: 0 });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const frameY = H * 0.6;

    /* Physics */
    if (s.y <= 0) {
      /* On trampoline */
      s.sag = Math.max(0, -s.y);
      const Fspring = k * s.sag;
      const Fnet    = Fspring - mass * 9.8;
      s.v += (Fnet / mass) * dt;
    } else {
      s.sag = 0;
      s.v -= 9.8 * dt;
    }
    s.y += s.v * dt * 18;
    if (s.y < -80) s.y = -80; /* max sag */

    bg(g, W, H);

    /* Frame poles */
    g.fillStyle = "#475569";
    g.fillRect(W * 0.18 - 10, frameY, 20, 60);
    g.fillRect(W * 0.82 - 10, frameY, 20, 60);
    g.beginPath(); g.arc(W * 0.18, frameY, 14, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(W * 0.82, frameY, 14, 0, Math.PI * 2); g.fill();

    /* Trampoline mat (sags with person) */
    const tramL = W * 0.18, tramR = W * 0.82;
    const sag   = s.y < 0 ? Math.min(-s.y, 80) : 0;
    g.strokeStyle = "#10b981"; g.lineWidth = 5;
    g.beginPath();
    g.moveTo(tramL, frameY);
    g.quadraticCurveTo(W / 2, frameY + sag, tramR, frameY);
    g.stroke();
    /* Springs */
    const springColors = ["#6366f1", "#818cf8", "#a78bfa"];
    for (let i = 0; i < 6; i++) {
      const sx = tramL + (i + 0.5) * ((tramR - tramL) / 6);
      const sy = frameY + (Math.abs(i - 2.5) * 0.1) * sag;
      g.strokeStyle = springColors[i % 3]; g.lineWidth = 2;
      g.beginPath(); g.moveTo(sx, frameY + 6); g.lineTo(sx, frameY + 40); g.stroke();
    }

    /* Person */
    const personY = frameY + s.y;
    const personR = 14;
    g.fillStyle = "#fca5a5"; g.beginPath(); g.arc(W / 2, personY - 40, personR, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#f87171"; g.lineWidth = 3; g.lineCap = "round";
    g.beginPath(); g.moveTo(W / 2, personY - 26); g.lineTo(W / 2, personY - 5); g.stroke();
    /* Arms (spread when airborne, close when landing) */
    const armSpread = s.y > 0 ? 25 : 10;
    g.beginPath(); g.moveTo(W / 2, personY - 18); g.lineTo(W / 2 - armSpread, personY - 8); g.stroke();
    g.beginPath(); g.moveTo(W / 2, personY - 18); g.lineTo(W / 2 + armSpread, personY - 8); g.stroke();
    g.beginPath(); g.moveTo(W / 2, personY - 5); g.lineTo(W / 2 - 12, personY + 14); g.stroke();
    g.beginPath(); g.moveTo(W / 2, personY - 5); g.lineTo(W / 2 + 12, personY + 14); g.stroke();
    lbl(g, `${mass}kg`, W / 2, personY - 58, "#fca5a5", 10);

    /* Force arrows on trampoline contact */
    if (s.y < 0) {
      const Fspring = k * sag;
      const sc = 0.008;
      /* Person pushes down (action) */
      arrow(g, W / 2 + 50, personY, W / 2 + 50, personY + Math.min(mass * 9.8 * sc, 70), "#ef4444", 3, 12);
      lbl(g, `Person ↓\n${(mass * 9.8).toFixed(0)}N`, W / 2 + 60, personY + 36, "#ef4444", 9, "left");
      /* Trampoline pushes up (reaction) */
      arrow(g, W / 2 - 50, personY, W / 2 - 50, personY - Math.min(Fspring * sc, 80), "#10b981", 3, 12);
      lbl(g, `Spring ↑\n${Fspring.toFixed(0)}N`, W / 2 - 60, personY - 40, "#10b981", 9, "right");
    } else {
      lbl(g, s.v > 0 ? "Airborne! (reaction launched)" : "Falling...", W / 2, frameY - 80, "#22d3ee", 11);
    }

    lbl(g, `Spring force F=k·x = ${k}×${sag.toFixed(1)}cm = ${(k * sag / 100).toFixed(0)} N  |  height = ${s.y.toFixed(1)} px  |  v = ${s.v.toFixed(1)} m/s`, W / 2, H - 14, "#94a3b8", 10);

    raf.current = requestAnimationFrame(draw);
  }, [mass, k]);

  useEffect(() => {
    ph.current = { y: 0, v: 8, sag: 0 };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E4-09" title="Trampoline Bounce — Elastic Action-Reaction" desc="Person pushes the trampoline down (action). The stretched trampoline springs push the person upward (reaction). The harder you push down, the higher you bounce!">
      <canvas ref={cvs} width={700} height={340} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Person Mass (kg)" value={mass} min={20} max={120} color="#fca5a5" onChange={(v) => { setMass(v); ph.current = { y: 0, v: 8, sag: 0 }; }} />
        <Sld label="Trampoline Spring k (N/m)" value={k} min={2000} max={20000} step={500} color="#10b981" onChange={(v) => { setK(v); ph.current = { y: 0, v: 8, sag: 0 }; }} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * MAIN EXPORT
 * ══════════════════════════════════════════════════════════════════════ */
export function AdvancedTopic4ExtraSims() {
  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, padding: "14px 20px", background: "linear-gradient(90deg,rgba(239,68,68,0.12),rgba(99,102,241,0.08))", borderRadius: 12, border: "1px solid rgba(239,68,68,0.2)" }}>
        <div style={{ background: "rgba(239,68,68,0.2)", color: "#fca5a5", fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 8, whiteSpace: "nowrap" }}>EXTRA SIMS 1–9</div>
        <div>
          <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15 }}>Topic 4 — Newton&apos;s 3rd Law Extended Lab</div>
          <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>Rocket · Gun Recoil · Boat Jump · Balloon · Swimming · Ice Skaters · Walking · Magnetic Repulsion · Trampoline</div>
        </div>
      </div>
      <Sim_RocketPropulsion />
      <Sim_GunRecoil />
      <Sim_BoatJump />
      <Sim_Balloon />
      <Sim_Swimming />
      <Sim_SkatersPush />
      <Sim_Walking />
      <Sim_MagneticRepulsion />
      <Sim_Trampoline />
    </div>
  );
}
