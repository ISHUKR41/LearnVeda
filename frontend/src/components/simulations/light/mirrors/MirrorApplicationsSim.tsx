/**
 * FILE: MirrorApplicationsSim.tsx
 * LOCATION: src/components/simulations/light/mirrors/MirrorApplicationsSim.tsx
 *
 * PURPOSE:
 *   Real-world applications gallery for concave and convex mirrors.
 *   Students click through 6 interactive scenes to see exactly HOW each
 *   application works with animated light rays.
 *
 * APPLICATIONS SHOWN:
 *   1. 🔦 Torch/Headlight — concave mirror with bulb at F → parallel beam
 *   2. 🌞 Solar Furnace — concave mirror, distant source → rays converge at F
 *   3. 💄 Makeup Mirror — concave, object between F and P → virtual, enlarged
 *   4. 🚗 Rear-View Mirror — convex mirror → wide field, always virtual upright
 *   5. 🔭 Telescope Primary Mirror — large concave gathers starlight → focus
 *   6. 🛡️ Security/ATM Mirror — convex gives wide field of view for surveillance
 *
 * INTERACTIONS:
 *   - Six application cards at the bottom — click to select
 *   - Selected card shows animated ray diagram with labelled elements
 *   - "Why it works" explanation panel updates with each selection
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════
 * APPLICATIONS DATA
 * ═══════════════════════════════════════════════════ */
const APPS = [
  {
    id: "torch",
    icon: "🔦",
    title: "Torch / Headlight",
    mirror: "Concave",
    color: "#fde047",
    why: "The bulb is placed AT the principal focus F. Rays reflecting off the concave mirror emerge as a parallel beam — strong, directed light. Same principle in car headlights, searchlights, projectors.",
    objectPos: "at F",
  },
  {
    id: "furnace",
    icon: "🌞",
    title: "Solar Furnace",
    mirror: "Concave",
    color: "#f97316",
    why: "Parallel rays from the Sun (∞) reflect off a large concave mirror and converge at F, creating extreme heat (>3000°C). Used in Odeillo Solar Furnace (France) to melt metals and produce hydrogen.",
    objectPos: "at ∞",
  },
  {
    id: "makeup",
    icon: "💄",
    title: "Makeup / Shaving Mirror",
    mirror: "Concave",
    color: "#ec4899",
    why: "Object (face) placed BETWEEN F and P. Concave mirror forms a virtual, erect, MAGNIFIED image behind the mirror — perfect for seeing detail. The image is right-side up and larger than the face.",
    objectPos: "between F & P",
  },
  {
    id: "rearview",
    icon: "🚗",
    title: "Rear-View Mirror",
    mirror: "Convex",
    color: "#22c55e",
    why: "Convex mirror ALWAYS forms a virtual, erect, DIMINISHED image for ANY object position. The curved shape gives a much wider field of view than a flat mirror — drivers see more of the road behind them.",
    objectPos: "any distance",
  },
  {
    id: "telescope",
    icon: "🔭",
    title: "Telescope Primary Mirror",
    mirror: "Concave",
    color: "#8b5cf6",
    why: "Large concave mirror (e.g., Hubble: 2.4m diameter) collects light from distant stars (∞) and focuses it. Larger mirror = more light gathered = fainter stars visible. Mirrors can be made larger than lenses.",
    objectPos: "at ∞",
  },
  {
    id: "security",
    icon: "🛡️",
    title: "Security / ATM Mirror",
    mirror: "Convex",
    color: "#06b6d4",
    why: "Convex mirror gives a wide, panoramic field of view — a guard can see a large area in one small mirror. Image is always diminished and virtual. Same type used in shop corners, blind road bends, ATM safety.",
    objectPos: "any distance",
  },
];

/* ═══════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════ */
export default function MirrorApplicationsSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState(0);
  const [time, setTime] = useState(0);

  /* Animation */
  useEffect(() => {
    let raf: number;
    let t = 0;
    const loop = () => { t += 0.022; setTime(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const app = APPS[selected];

  /* ── Draw ─────────────────────────────────────── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H * 0.52;

    ctx.fillStyle = "#070d1a";
    ctx.fillRect(0, 0, W, H);

    /* Mirror geometry */
    const isConcave = app.mirror === "Concave";
    const R = W * 0.28;    /* radius of curvature */
    const f = R / 2;       /* focal length */
    const poleX = cx + W * 0.12;

    /* Draw mirror arc */
    ctx.save();
    ctx.strokeStyle = "rgba(147,197,253,0.9)";
    ctx.lineWidth = 3.5;
    ctx.shadowColor = "rgba(147,197,253,0.4)";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    /* Concave: centre of curvature is to the LEFT (object side) */
    /* Convex: centre of curvature is to the RIGHT (behind mirror) */
    const arcDir = isConcave ? -1 : 1;
    /* Draw arc approximating a spherical mirror cross-section */
    const arcAngle = 0.45; /* radians, half-angle subtended */
    const arcCX = poleX + arcDir * R;
    for (let a = Math.PI - arcAngle; a <= Math.PI + arcAngle; a += 0.01) {
      const px = arcCX + R * Math.cos(a);
      const py = cy + R * Math.sin(a);
      if (a === Math.PI - arcAngle) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    /* Principal axis */
    ctx.strokeStyle = "rgba(148,163,184,0.2)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(W, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    /* Focus point F */
    const fX = poleX - f;
    ctx.save();
    ctx.fillStyle = app.color;
    ctx.shadowColor = app.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(fX, cy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = app.color;
    ctx.font = `bold ${Math.max(10, W * 0.022)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("F", fX, cy - 12);

    /* Pole P */
    ctx.fillStyle = "rgba(147,197,253,0.7)";
    ctx.font = `bold ${Math.max(10, W * 0.022)}px 'Space Grotesk', sans-serif`;
    ctx.fillText("P", poleX, cy - 12);

    /* ── Application-specific ray diagram ─────────── */
    const numRays = 4;
    const raySpacing = H * 0.09;

    if (app.id === "torch" || app.id === "makeup") {
      /* Object between F and P (makeup) or at F (torch) */
      const objX = app.id === "torch" ? fX : fX + f * 0.4;
      const objH = H * 0.18;

      /* Animated parallel output rays */
      for (let i = 0; i < numRays; i++) {
        const rayY = cy - raySpacing * 1.5 + i * raySpacing;
        const phase = (time * 0.5 + i * 0.2) % 1;

        /* Incoming horizontal ray (heading right toward mirror) */
        ctx.save();
        ctx.strokeStyle = `rgba(${app.color.slice(1).match(/../g)!.map(h => parseInt(h, 16)).join(",")},0.7)`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, rayY);
        ctx.lineTo(objX - phase * (objX), rayY);
        ctx.stroke();
        ctx.restore();

        /* After mirror: converge toward F for concave torch */
        const reflX = poleX - 5;
        const slope = (rayY - cy) / (reflX - fX);
        const endX = fX - 60;
        const endY = cy + slope * (endX - fX);

        ctx.save();
        ctx.strokeStyle = `rgba(${app.color.slice(1).match(/../g)!.map(h => parseInt(h, 16)).join(",")},0.9)`;
        ctx.lineWidth = 2;
        ctx.shadowColor = app.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(reflX, rayY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();
      }

    } else if (app.id === "furnace" || app.id === "telescope") {
      /* Parallel rays from infinity → converge at F */
      for (let i = 0; i < numRays; i++) {
        const rayY = cy - raySpacing * 1.5 + i * raySpacing;
        const phase = (time * 0.5 + i * 0.18) % 1;
        const frontX = phase * poleX;

        /* Horizontal incident ray */
        ctx.save();
        ctx.strokeStyle = `rgba(${hexToRgb(app.color)},0.75)`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, rayY);
        ctx.lineTo(frontX, rayY);
        ctx.stroke();
        ctx.restore();

        /* Reflected ray toward F */
        ctx.save();
        ctx.strokeStyle = `rgba(${hexToRgb(app.color)},0.9)`;
        ctx.lineWidth = 2;
        ctx.shadowColor = app.color;
        ctx.shadowBlur = 7;
        ctx.beginPath();
        ctx.moveTo(poleX - 5, rayY);
        ctx.lineTo(fX, cy);
        ctx.stroke();
        ctx.restore();
      }

      /* Hot spot at F */
      ctx.save();
      ctx.shadowColor = app.color;
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(fX, cy, 8, 0, Math.PI * 2);
      ctx.fillStyle = app.color;
      ctx.fill();
      ctx.restore();

    } else if (app.id === "rearview" || app.id === "security") {
      /* Convex mirror: parallel rays appear to diverge from virtual F behind mirror */
      for (let i = 0; i < numRays; i++) {
        const rayY = cy - raySpacing * 1.5 + i * raySpacing;
        const phase = (time * 0.5 + i * 0.2) % 1;

        /* Incident ray */
        ctx.save();
        ctx.strokeStyle = `rgba(${hexToRgb(app.color)},0.75)`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(phase * poleX, rayY);
        ctx.lineTo(poleX - 5, rayY);
        ctx.stroke();
        ctx.restore();

        /* Reflected: diverges (appears to come from virtual F BEHIND mirror) */
        const vFX = poleX + f; /* virtual focus behind mirror */
        const slope2 = (cy - rayY) / (vFX - poleX);
        const refEndX = 0;
        const refEndY = rayY + slope2 * (poleX - refEndX);
        ctx.save();
        ctx.strokeStyle = `rgba(${hexToRgb(app.color)},0.85)`;
        ctx.lineWidth = 2;
        ctx.shadowColor = app.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(poleX - 5, rayY);
        ctx.lineTo(refEndX, refEndY);
        ctx.stroke();
        ctx.restore();

        /* Virtual dotted lines to F */
        ctx.save();
        ctx.strokeStyle = `rgba(${hexToRgb(app.color)},0.3)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(poleX - 5, rayY);
        ctx.lineTo(vFX, cy);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      /* Virtual focus F */
      ctx.fillStyle = `rgba(${hexToRgb(app.color)},0.5)`;
      ctx.font = `${Math.max(10, W * 0.02)}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("F (virtual)", poleX + f, cy + 16);
    }

    /* ── Mirror type label ─────────────────────────── */
    ctx.fillStyle = "rgba(147,197,253,0.5)";
    ctx.font = `${Math.max(9, W * 0.019)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText(`${app.mirror} Mirror`, W - 8, 18);

  }, [selected, time, app]);

  /* Canvas setup */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      canvas.width = w;
      canvas.height = Math.round(w * 0.52);
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div style={{
      background: "linear-gradient(135deg,#070d1a 0%,#0f172a 100%)",
      borderRadius: 16,
      overflow: "hidden",
      border: "1px solid rgba(147,197,253,0.18)",
      fontFamily: "'Space Grotesk','Inter',sans-serif",
    }}>

      {/* Header */}
      <div style={{
        padding: "14px 20px 10px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>🪞</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
            Mirror Applications — Real World
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
            Click an application to see the ray diagram
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ width: "100%", background: "#070d1a" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      </div>

      {/* Application selector grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 8,
        padding: "12px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        {APPS.map((a, i) => (
          <button
            key={a.id}
            onClick={() => setSelected(i)}
            style={{
              background: selected === i
                ? `rgba(${hexToRgb(a.color)},0.18)`
                : "rgba(255,255,255,0.04)",
              border: `1.5px solid ${selected === i ? a.color : "rgba(255,255,255,0.08)"}`,
              borderRadius: 10, padding: "8px 6px",
              cursor: "pointer", textAlign: "center",
              transition: "all 0.15s",
            }}
          >
            <div style={{ fontSize: 18 }}>{a.icon}</div>
            <div style={{
              color: selected === i ? a.color : "rgba(255,255,255,0.6)",
              fontSize: 11, fontWeight: 600, marginTop: 3, lineHeight: 1.2,
            }}>
              {a.title}
            </div>
            <div style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 9, marginTop: 2,
            }}>
              {a.mirror}
            </div>
          </button>
        ))}
      </div>

      {/* Explanation panel */}
      <div style={{
        padding: "14px 20px",
        background: "rgba(0,0,0,0.35)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
        }}>
          <span style={{ fontSize: 22 }}>{app.icon}</span>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{app.title}</div>
            <div style={{
              background: app.mirror === "Concave" ? "rgba(99,102,241,0.25)" : "rgba(34,197,94,0.2)",
              color: app.mirror === "Concave" ? "#a5b4fc" : "#4ade80",
              border: `1px solid ${app.mirror === "Concave" ? "rgba(99,102,241,0.4)" : "rgba(34,197,94,0.35)"}`,
              borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700,
              display: "inline-block",
            }}>
              {app.mirror} Mirror · Object {app.objectPos}
            </div>
          </div>
        </div>
        <div style={{
          color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.65,
          background: `rgba(${hexToRgb(app.color)},0.06)`,
          border: `1px solid rgba(${hexToRgb(app.color)},0.15)`,
          borderRadius: 10, padding: "10px 14px",
        }}>
          {app.why}
        </div>
      </div>
    </div>
  );
}

/* ── Helper: hex color to RGB string ──────────────── */
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
