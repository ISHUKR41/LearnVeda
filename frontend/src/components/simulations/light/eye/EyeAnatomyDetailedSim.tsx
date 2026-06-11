/**
 * FILE: EyeAnatomyDetailedSim.tsx
 * PURPOSE: Interactive human eye anatomy simulation.
 *          Clickable cross-section SVG with:
 *          - All major parts labelled (Cornea, Iris, Lens, Retina, etc.)
 *          - Click any part → detailed description + function
 *          - Animated light ray showing how vision works
 *          - Toggle between Normal vision, Myopia, Hypermetropia
 *          - Power of corrective lens shown
 *
 * EDUCATIONAL VALUE:
 *   Students can explore every part of the eye interactively.
 *   The three vision modes visually demonstrate how defects arise and
 *   how corrective lenses fix them — a key Class 10 exam topic.
 */

"use client";

import React, { useState } from "react";

/* ═══════════════════════════════════════════════════
 * EYE PARTS DATA
 * ═══════════════════════════════════════════════════ */
interface EyePart {
  id: string;
  name: string;
  icon: string;
  color: string;
  shortDesc: string;
  examNote: string;
}

const EYE_PARTS: EyePart[] = [
  {
    id: "cornea",
    name: "Cornea",
    icon: "👁️",
    color: "#38bdf8",
    shortDesc: "Transparent, curved outer layer of the eye. Accounts for about 70% of the eye's total focusing power.",
    examNote: "Cornea + Lens together focus light. Cornea alone provides most of the converging power.",
  },
  {
    id: "iris",
    name: "Iris",
    icon: "🔵",
    color: "#818cf8",
    shortDesc: "Coloured muscular ring that controls the size of the pupil. Adjusts how much light enters the eye.",
    examNote: "In bright light: iris contracts (pupil shrinks). In dim light: iris dilates (pupil expands). This is the eye's aperture control.",
  },
  {
    id: "pupil",
    name: "Pupil",
    icon: "⚫",
    color: "#1e293b",
    shortDesc: "The opening in the iris through which light enters the eye. Appears black because the inside of the eye is dark.",
    examNote: "Pupil diameter varies from 2mm (bright) to 8mm (dark). This 16× area change adjusts light intake dramatically.",
  },
  {
    id: "lens",
    name: "Eye Lens (Crystalline Lens)",
    icon: "🔬",
    color: "#fbbf24",
    shortDesc: "A flexible, transparent biconvex lens behind the iris. Changed in shape by ciliary muscles to focus at different distances.",
    examNote: "KEY EXAM TOPIC: The lens accommodates (changes shape). Near object → fat lens (more converging). Far object → flat lens (less converging). This is ACCOMMODATION.",
  },
  {
    id: "ciliary",
    name: "Ciliary Muscles",
    icon: "💪",
    color: "#f87171",
    shortDesc: "Ring of muscles that control the shape of the eye lens by relaxing and contracting.",
    examNote: "Ciliary muscles RELAX → lens becomes FLAT (far vision). Ciliary muscles CONTRACT → lens becomes THICK/ROUND (near vision). Opposite of what you expect!",
  },
  {
    id: "retina",
    name: "Retina",
    icon: "🖼️",
    color: "#34d399",
    shortDesc: "Light-sensitive inner lining of the eye containing photoreceptor cells (rods and cones). Where the image is formed.",
    examNote: "Image formed on retina is REAL, INVERTED, and DIMINISHED — just like an image formed by a convex lens between F and 2F. The brain flips it right-side-up.",
  },
  {
    id: "rods_cones",
    name: "Rods & Cones",
    icon: "🔦",
    color: "#c084fc",
    shortDesc: "Photoreceptor cells. Rods: sensitive to dim light (night vision). Cones: detect colour (3 types: red, green, blue).",
    examNote: "~120 million rods, ~6 million cones. Colour blindness = defective cones. Night blindness = defective/absent rods (Vitamin A deficiency).",
  },
  {
    id: "yellowspot",
    name: "Yellow Spot (Fovea)",
    icon: "⭐",
    color: "#fde047",
    shortDesc: "Point of maximum visual acuity — highest concentration of cone cells. Where the clearest, most detailed vision occurs.",
    examNote: "When you look directly at an object, its image falls on the fovea. Contains ONLY cones (no rods) — so it is BLIND in complete darkness.",
  },
  {
    id: "blindspot",
    name: "Blind Spot",
    icon: "🚫",
    color: "#64748b",
    shortDesc: "Point where the optic nerve exits the eye. No photoreceptors here — any image falling here is invisible.",
    examNote: "Everyone has a blind spot! Can be demonstrated experimentally. Not related to vision defects — it is a normal anatomical feature.",
  },
  {
    id: "opticnerve",
    name: "Optic Nerve",
    icon: "🧠",
    color: "#fb923c",
    shortDesc: "Bundle of ~1 million nerve fibres that carries visual signals from the retina to the brain's visual cortex.",
    examNote: "The eye only DETECTS light. The BRAIN processes and interprets the signals, including flipping the inverted retinal image right-side-up.",
  },
  {
    id: "vitreous",
    name: "Vitreous Humour",
    icon: "💧",
    color: "#bae6fd",
    shortDesc: "Clear gel filling the main cavity of the eye. Maintains the spherical shape and provides a clear medium for light.",
    examNote: "The eye has two fluids: Aqueous Humour (front, watery) and Vitreous Humour (back, gel-like). Both maintain eye pressure.",
  },
];

/* ═══════════════════════════════════════════════════
 * VISION MODES
 * ═══════════════════════════════════════════════════ */
type VisionMode = "normal" | "myopia" | "hypermetropia";

const VISION_DATA: Record<VisionMode, {
  label: string; icon: string; color: string;
  defect: string; imageForms: string;
  correction: string; lens: string;
}> = {
  normal: {
    label: "Normal Vision (Emmetropia)",
    icon: "✅",
    color: "#34d399",
    defect: "No defect. Ciliary muscles can accommodate for near and far objects.",
    imageForms: "Exactly ON the retina — clear vision.",
    correction: "No correction needed.",
    lens: "None",
  },
  myopia: {
    label: "Myopia (Near-sightedness)",
    icon: "😔",
    color: "#f87171",
    defect: "Eyeball too long OR cornea/lens too curved → too much converging power.",
    imageForms: "BEFORE the retina (in front) → blurry for distant objects.",
    correction: "Concave lens (diverging) — spreads rays before they hit eye lens.",
    lens: "Concave lens (−ve power, e.g. −2.5 D)",
  },
  hypermetropia: {
    label: "Hypermetropia (Far-sightedness)",
    icon: "🤓",
    color: "#fbbf24",
    defect: "Eyeball too short OR lens too flat → insufficient converging power.",
    imageForms: "BEHIND the retina → blurry for near objects.",
    correction: "Convex lens (converging) — helps focus closer objects.",
    lens: "Convex lens (+ve power, e.g. +1.5 D)",
  },
};

/* ═══════════════════════════════════════════════════
 * EYE SVG DIAGRAM
 * ═══════════════════════════════════════════════════ */
function EyeDiagram({
  selectedPart,
  onSelect,
  visionMode,
}: {
  selectedPart: string | null;
  onSelect: (id: string) => void;
  visionMode: VisionMode;
}) {
  const vm = VISION_DATA[visionMode];

  /* SVG coordinate space: 500 × 340 */
  return (
    <svg
      viewBox="0 0 500 340"
      style={{ width: "100%", maxHeight: "320px", display: "block" }}
    >
      {/* Background */}
      <rect width="500" height="340" fill="#040a14" />

      {/* Grid */}
      {Array.from({ length: 12 }, (_, i) => (
        <line key={`gv${i}`} x1={i * 42} y1="0" x2={i * 42} y2="340"
          stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`gh${i}`} x1="0" y1={i * 45} x2="500" y2={i * 45}
          stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      ))}

      {/* ── EYEBALL OUTLINE ── */}
      <ellipse cx="230" cy="170" rx="140" ry="130"
        fill="rgba(15,23,42,0.9)"
        stroke="rgba(148,163,184,0.4)" strokeWidth="2" />

      {/* ── VITREOUS HUMOUR (interior) ── */}
      <ellipse cx="240" cy="170" rx="115" ry="108"
        fill="rgba(186,230,253,0.05)"
        onClick={() => onSelect("vitreous")}
        style={{ cursor: "pointer" }}
      />

      {/* ── RETINA ── */}
      <ellipse cx="255" cy="170" rx="105" ry="100"
        fill="none"
        stroke={selectedPart === "retina" ? "#34d399" : "rgba(52,211,153,0.3)"}
        strokeWidth={selectedPart === "retina" ? 4 : 2}
        onClick={() => onSelect("retina")}
        style={{ cursor: "pointer" }}
      />

      {/* ── LIGHT RAY PATH ── */}
      {visionMode === "normal" && (
        <g>
          <line x1="20" y1="130" x2="94" y2="155" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7"/>
          <line x1="94" y1="155" x2="130" y2="165" stroke="#fbbf24" strokeWidth="1.5" opacity="0.7"/>
          <line x1="130" y1="165" x2="340" y2="170" stroke="#fbbf24" strokeWidth="1.5" opacity="0.7"/>
          <circle cx="340" cy="170" r="5" fill="#34d399" />
          <text x="330" y="186" fill="#34d399" fontSize="10" textAnchor="middle">ON retina ✓</text>
        </g>
      )}
      {visionMode === "myopia" && (
        <g>
          <line x1="20" y1="130" x2="94" y2="155" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7"/>
          <line x1="94" y1="155" x2="130" y2="163" stroke="#f87171" strokeWidth="1.5" opacity="0.7"/>
          <line x1="130" y1="163" x2="255" y2="170" stroke="#f87171" strokeWidth="1.5" opacity="0.7"/>
          <line x1="255" y1="170" x2="340" y2="185" stroke="#f87171" strokeWidth="1.5" opacity="0.4" strokeDasharray="3,2"/>
          <circle cx="255" cy="170" r="5" fill="#f87171" />
          <text x="220" y="160" fill="#f87171" fontSize="10" textAnchor="middle">BEFORE retina ✗</text>
        </g>
      )}
      {visionMode === "hypermetropia" && (
        <g>
          <line x1="20" y1="130" x2="94" y2="158" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7"/>
          <line x1="94" y1="158" x2="130" y2="168" stroke="#fbbf24" strokeWidth="1.5" opacity="0.7"/>
          <line x1="130" y1="168" x2="340" y2="170" stroke="#fbbf24" strokeWidth="1.5" opacity="0.4"/>
          <line x1="340" y1="170" x2="400" y2="170" stroke="#fbbf24" strokeWidth="1.5" opacity="0.4" strokeDasharray="3,2"/>
          <circle cx="395" cy="170" r="5" fill="#fbbf24" />
          <text x="395" y="162" fill="#fbbf24" fontSize="10" textAnchor="middle">BEHIND retina ✗</text>
        </g>
      )}

      {/* ── CORNEA ── */}
      <path d="M 90 140 Q 70 170 90 200"
        fill="none"
        stroke={selectedPart === "cornea" ? "#38bdf8" : "rgba(56,189,248,0.6)"}
        strokeWidth={selectedPart === "cornea" ? 5 : 3}
        onClick={() => onSelect("cornea")}
        style={{ cursor: "pointer" }}
      />

      {/* ── IRIS ── */}
      <ellipse cx="110" cy="170" rx="16" ry="24"
        fill="rgba(129,140,248,0.25)"
        stroke={selectedPart === "iris" ? "#818cf8" : "rgba(129,140,248,0.5)"}
        strokeWidth={selectedPart === "iris" ? 3 : 1.5}
        onClick={() => onSelect("iris")}
        style={{ cursor: "pointer" }}
      />

      {/* ── PUPIL ── */}
      <ellipse cx="110" cy="170" rx="6" ry="10"
        fill={selectedPart === "pupil" ? "#334155" : "#0f172a"}
        stroke="rgba(255,255,255,0.2)" strokeWidth="1"
        onClick={() => onSelect("pupil")}
        style={{ cursor: "pointer" }}
      />

      {/* ── EYE LENS ── */}
      <path d="M 128 155 Q 148 170 128 185"
        fill="rgba(251,191,36,0.08)"
        stroke={selectedPart === "lens" ? "#fbbf24" : "rgba(251,191,36,0.6)"}
        strokeWidth={selectedPart === "lens" ? 4 : 2}
        onClick={() => onSelect("lens")}
        style={{ cursor: "pointer" }}
      />
      <path d="M 128 155 Q 112 170 128 185"
        fill="rgba(251,191,36,0.08)"
        stroke={selectedPart === "lens" ? "#fbbf24" : "rgba(251,191,36,0.6)"}
        strokeWidth={selectedPart === "lens" ? 4 : 2}
        onClick={() => onSelect("lens")}
        style={{ cursor: "pointer" }}
      />

      {/* ── YELLOW SPOT / FOVEA ── */}
      <circle cx="343" cy="170" r="9"
        fill={selectedPart === "yellowspot" ? "rgba(253,224,71,0.35)" : "rgba(253,224,71,0.15)"}
        stroke={selectedPart === "yellowspot" ? "#fde047" : "rgba(253,224,71,0.5)"}
        strokeWidth={selectedPart === "yellowspot" ? 3 : 1.5}
        onClick={() => onSelect("yellowspot")}
        style={{ cursor: "pointer" }}
      />
      <text x="356" y="162" fill="#fde047" fontSize="9" opacity="0.8">Fovea</text>

      {/* ── BLIND SPOT ── */}
      <circle cx="358" cy="210" r="8"
        fill={selectedPart === "blindspot" ? "rgba(100,116,139,0.4)" : "rgba(100,116,139,0.15)"}
        stroke={selectedPart === "blindspot" ? "#64748b" : "rgba(100,116,139,0.4)"}
        strokeWidth={selectedPart === "blindspot" ? 3 : 1.5}
        onClick={() => onSelect("blindspot")}
        style={{ cursor: "pointer" }}
      />
      <text x="372" y="216" fill="#64748b" fontSize="9">Blind Spot</text>

      {/* ── OPTIC NERVE ── */}
      <line x1="358" y1="210" x2="430" y2="245"
        stroke={selectedPart === "opticnerve" ? "#fb923c" : "rgba(251,146,60,0.4)"}
        strokeWidth={selectedPart === "opticnerve" ? 4 : 2.5}
        onClick={() => onSelect("opticnerve")}
        style={{ cursor: "pointer" }}
      />

      {/* ── LABELS (always visible) ── */}
      {[
        { x: 44, y: 154, label: "Cornea", id: "cornea", anchor: "end" },
        { x: 100, y: 135, label: "Iris", id: "iris", anchor: "middle" },
        { x: 100, y: 220, label: "Pupil", id: "pupil", anchor: "middle" },
        { x: 138, y: 140, label: "Lens", id: "lens", anchor: "middle" },
        { x: 230, y: 90, label: "Vitreous Humour", id: "vitreous", anchor: "middle" },
        { x: 350, y: 125, label: "Retina", id: "retina", anchor: "start" },
        { x: 430, y: 252, label: "Optic Nerve", id: "opticnerve", anchor: "start" },
      ].map(({ x, y, label, id, anchor }) => (
        <text key={id} x={x} y={y}
          fill={selectedPart === id ? "#e2e8f0" : "#94a3b8"}
          fontSize="10" textAnchor={anchor as any}
          style={{ cursor: "pointer", userSelect: "none" }}
          onClick={() => onSelect(id)}
        >
          {label}
        </text>
      ))}

      {/* ── INCOMING LIGHT LABEL ── */}
      <text x="14" y="125" fill="rgba(255,255,255,0.4)" fontSize="10">→ Light</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════ */
export default function EyeAnatomyDetailedSim() {
  const [selectedPart, setSelectedPart] = useState<string | null>("lens");
  const [visionMode,  setVisionMode]    = useState<VisionMode>("normal");

  const selected  = EYE_PARTS.find(p => p.id === selectedPart);
  const vm        = VISION_DATA[visionMode];

  return (
    <div style={{
      background: "#040a14",
      borderRadius: "16px",
      overflow: "hidden",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Eye SVG */}
      <EyeDiagram
        selectedPart={selectedPart}
        onSelect={setSelectedPart}
        visionMode={visionMode}
      />

      {/* Vision mode buttons */}
      <div style={{
        display: "flex", gap: "8px", padding: "14px 20px 0",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        {(["normal", "myopia", "hypermetropia"] as VisionMode[]).map(mode => {
          const d = VISION_DATA[mode];
          const active = visionMode === mode;
          return (
            <button key={mode}
              onClick={() => setVisionMode(mode)}
              style={{
                flex: 1, padding: "8px 6px", borderRadius: "8px",
                border: active ? `2px solid ${d.color}` : "1px solid rgba(255,255,255,0.1)",
                background: active ? `${d.color}18` : "transparent",
                color: active ? d.color : "#64748b",
                fontSize: "11px", fontWeight: 700, cursor: "pointer",
              }}
            >
              {d.icon} {mode === "normal" ? "Normal" : mode === "myopia" ? "Myopia" : "Hypermetropia"}
            </button>
          );
        })}
      </div>

      {/* Vision mode info */}
      <div style={{
        margin: "12px 20px",
        padding: "12px 14px",
        background: `${vm.color}08`,
        border: `1px solid ${vm.color}30`,
        borderLeft: `3px solid ${vm.color}`,
        borderRadius: "0 8px 8px 0",
      }}>
        <div style={{ color: vm.color, fontWeight: 700, fontSize: "12px", marginBottom: "6px" }}>
          {vm.icon} {vm.label}
        </div>
        <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: 1.6 }}>
          <strong style={{ color: "#cbd5e1" }}>Defect:</strong> {vm.defect}<br />
          <strong style={{ color: "#cbd5e1" }}>Image forms:</strong> {vm.imageForms}<br />
          <strong style={{ color: "#cbd5e1" }}>Correction:</strong> {vm.correction}<br />
          <strong style={{ color: vm.color }}>Corrective lens:</strong> {vm.lens}
        </div>
      </div>

      {/* Selected part detail */}
      {selected && (
        <div style={{
          margin: "0 20px 16px",
          padding: "14px",
          background: `${selected.color}08`,
          border: `1px solid ${selected.color}25`,
          borderLeft: `3px solid ${selected.color}`,
          borderRadius: "0 10px 10px 0",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px",
          }}>
            <span style={{ fontSize: "20px" }}>{selected.icon}</span>
            <div style={{ color: selected.color, fontWeight: 700, fontSize: "14px" }}>
              {selected.name}
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: 1.65, marginBottom: "8px" }}>
            {selected.shortDesc}
          </div>
          <div style={{
            padding: "8px 12px",
            background: "rgba(251,191,36,0.06)",
            borderLeft: "3px solid #fbbf24",
            borderRadius: "0 6px 6px 0",
            fontSize: "11px", color: "#fde047",
          }}>
            📝 <strong>Exam note:</strong> {selected.examNote}
          </div>
        </div>
      )}

      {/* Parts grid */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "6px",
        padding: "0 20px 20px",
      }}>
        {EYE_PARTS.map(p => (
          <button key={p.id}
            onClick={() => setSelectedPart(p.id)}
            style={{
              padding: "4px 10px", borderRadius: "6px",
              border: selectedPart === p.id
                ? `1px solid ${p.color}` : "1px solid rgba(255,255,255,0.08)",
              background: selectedPart === p.id ? `${p.color}18` : "transparent",
              color: selectedPart === p.id ? p.color : "#64748b",
              fontSize: "11px", fontWeight: 600, cursor: "pointer",
            }}
          >
            {p.name.split(" ")[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
