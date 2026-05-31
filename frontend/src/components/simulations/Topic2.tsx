/**
 * FILE: Topic2.tsx
 * PURPOSE: 15 professional simulations — Topic 2: Newton's First Law (Inertia).
 *
 * "An object at rest stays at rest and an object in motion stays in motion
 *  unless acted upon by a net external force."
 *
 * Each simulation demonstrates a distinct facet of inertia:
 *   — Objects at rest (no net force → no motion)
 *   — Objects in motion continuing (space: no friction)
 *   — Friction gradually stopping motion (different surfaces)
 *   — Mass dependence (heavy vs. light objects)
 *   — Real-world inertia scenarios (trains, coins, books)
 */
"use client";
import React from "react";
import SimCanvas from "./engine/SimCanvas";

/* ── 1. Object at Rest — Frictionless Ice ────────────────────────────────── */
export function Sim_inertia_rest() {
  return (
    <SimCanvas config={{
      title:   "Inertia at Rest — Ice (No Force Applied)",
      desc:    "A block sits on near-frictionless ice with zero applied forces and zero initial velocity. Nothing happens — and that proves Newton's 1st Law.",
      concept: "Zero net force → zero acceleration → the block stays at rest. It will stay there forever unless a force is applied. This is inertia of rest — the tendency to resist starting motion.",
      mode: "force", env: "ice",
      mass: 10, initForceLeft: 0, initForceRight: 0, initVelocity: 0,
      allowForceChange: true, maxForce: 100,
      blockColor: ["#4f46e5", "#7c3aed"],
    }} />
  );
}

/* ── 2. Object in Motion — Deep Space (No Friction) ──────────────────────── */
export function Sim_inertia_motion_space() {
  return (
    <SimCanvas config={{
      title:   "Inertia of Motion — Deep Space",
      desc:    "An object launched with 3 m/s in space. With zero friction and zero gravity, it travels forever at constant velocity.",
      concept: "No force applied, μ = 0 → no friction → no deceleration. The object moves at exactly 3 m/s forever. This is the purest demonstration of Newton's 1st Law: motion without force continues unchanged.",
      mode: "force", env: "space",
      mass: 5, initForceLeft: 0, initForceRight: 0, initVelocity: 3,
      allowForceChange: false,
      blockColor: ["#1d4ed8", "#1e3a8a"],
    }} />
  );
}

/* ── 3. Heavy Object — Inertia Hard to Overcome (Wood) ──────────────────── */
export function Sim_inertia_heavy() {
  return (
    <SimCanvas config={{
      title:   "Inertia of Heavy Object — Wooden Floor",
      desc:    "A 50 kg block given an initial push (2 m/s). Wood friction decelerates it, but the high mass means it takes much longer to stop.",
      concept: "Kinetic friction = 0.35 × 50 × 9.8 = 171.5 N. Deceleration = 171.5 / 50 = 3.43 m/s². The block stops in about 0.58 s. Compare this to a lighter block — more mass means more inertia to overcome.",
      mode: "force", env: "wood",
      mass: 50, initForceLeft: 0, initForceRight: 0, initVelocity: 2,
      allowForceChange: false,
      blockColor: ["#374151", "#111827"],
    }} />
  );
}

/* ── 4. Light Object — Inertia Easy to Overcome (Rubber) ─────────────────── */
export function Sim_inertia_light() {
  return (
    <SimCanvas config={{
      title:   "Inertia of Light Object — Rubber Mat",
      desc:    "A 2 kg block given an initial push (2 m/s) on high-grip rubber. The small mass and high friction bring it to a rapid stop.",
      concept: "Kinetic friction = 0.80 × 2 × 9.8 = 15.68 N. Deceleration = 15.68 / 2 = 7.84 m/s². Stops in ~0.25 s. Less mass = less inertia = easier to decelerate. Same friction force, wildly different result.",
      mode: "force", env: "rubber",
      mass: 2, initForceLeft: 0, initForceRight: 0, initVelocity: 2,
      allowForceChange: false,
      blockColor: ["#065f46", "#064e3b"],
    }} />
  );
}

/* ── 5. Friction Stops Motion — Concrete ─────────────────────────────────── */
export function Sim_friction_stop() {
  return (
    <SimCanvas config={{
      title:   "Friction Stopping Motion — Concrete Floor",
      desc:    "A block slides at 4 m/s on rough concrete. Friction acts as the opposing force, decelerating it to zero.",
      concept: "Concrete μ = 0.65. Friction force = 0.65 × 10 × 9.8 = 63.7 N. Deceleration = 6.37 m/s². Stops in ~0.63 s. Without friction, the block would slide forever — friction is the external force breaking the state of motion.",
      mode: "force", env: "concrete",
      mass: 10, initForceLeft: 0, initForceRight: 0, initVelocity: 4,
      allowForceChange: false,
      blockColor: ["#78350f", "#451a03"],
    }} />
  );
}

/* ── 6. Long Slide — Low Friction (Ice) ──────────────────────────────────── */
export function Sim_ice_slide() {
  return (
    <SimCanvas config={{
      title:   "Long Slide on Ice — Inertia Persists",
      desc:    "Same 4 m/s initial push, but now on ice (μ = 0.02). The block slides much, much further before stopping.",
      concept: "Ice friction = 0.02 × 10 × 9.8 = 1.96 N. Deceleration = 0.196 m/s². Stops after ~20 s of sliding. Compare to concrete (stops in 0.6 s) — inertia is the same, but low friction lets it persist much longer.",
      mode: "force", env: "ice",
      mass: 10, initForceLeft: 0, initForceRight: 0, initVelocity: 4,
      allowForceChange: false,
      blockColor: ["#4f46e5", "#7c3aed"],
    }} />
  );
}

/* ── 7. Sudden Push — Then No Force ──────────────────────────────────────── */
export function Sim_sudden_push() {
  return (
    <SimCanvas config={{
      title:   "Sudden Push — Inertia Carries It Forward",
      desc:    "Apply a right force to push the block, then release it. The block continues moving by inertia until friction stops it.",
      concept: "During the push: net force accelerates the block. After releasing (set force to 0): the block continues at whatever speed it reached — inertia of motion. Friction gradually decelerates it to rest.",
      mode: "force", env: "wood",
      mass: 10, initForceLeft: 0, initForceRight: 80, initVelocity: 0,
      allowForceChange: true, maxForce: 150,
      blockColor: ["#0369a1", "#0c4a6e"],
    }} />
  );
}

/* ── 8. Braking — Inertia Resists Stopping ───────────────────────────────── */
export function Sim_sudden_pull() {
  return (
    <SimCanvas config={{
      title:   "Braking — Inertia Resists Deceleration",
      desc:    "Block moving at 3 m/s on steel. Apply a left force (brakes!) to decelerate it. The block resists stopping — that's inertia.",
      concept: "A moving object's inertia resists deceleration. The greater the mass, the greater the force (and time) needed to stop it. This is why trucks need much longer braking distances than bicycles.",
      mode: "force", env: "steel",
      mass: 15, initForceLeft: 60, initForceRight: 0, initVelocity: 3,
      allowForceChange: true, maxForce: 150,
      blockColor: ["#475569", "#334155"],
    }} />
  );
}

/* ── 9. Space Push — Constant Acceleration ───────────────────────────────── */
export function Sim_space_push() {
  return (
    <SimCanvas config={{
      title:   "Constant Force in Space",
      desc:    "A 30 N force is applied in space with no friction. The velocity grows at a constant rate — classic uniform acceleration.",
      concept: "No friction means F_net = F_applied = 30 N constantly. a = 30 / 10 = 3 m/s² — constant. Velocity increases by 3 m/s every second, indefinitely. This is uniform acceleration from Newton's 2nd Law.",
      mode: "force", env: "space",
      mass: 10, initForceLeft: 0, initForceRight: 30, initVelocity: 0,
      allowForceChange: true, maxForce: 100,
      blockColor: ["#1d4ed8", "#1e3a8a"],
    }} />
  );
}

/* ── 10. Space Coast — Inertia in Zero Gravity ───────────────────────────── */
export function Sim_space_coast() {
  return (
    <SimCanvas config={{
      title:   "Coasting in Space — Pure Inertia",
      desc:    "An object launched at 2 m/s with NO applied forces in deep space. It coasts forever at exactly the same speed.",
      concept: "Newton's 1st Law at its most dramatic: in the absence of any net force, an object moves at constant velocity FOREVER. This is why the Voyager probes (launched 1977) are still moving through interstellar space today.",
      mode: "force", env: "space",
      mass: 10, initForceLeft: 0, initForceRight: 0, initVelocity: 2,
      allowForceChange: false,
      blockColor: ["#1d4ed8", "#1e3a8a"],
    }} />
  );
}

/* ── 11. Train Accelerating — Passengers Feel Pushed Back ────────────────── */
export function Sim_train_start() {
  return (
    <SimCanvas config={{
      title:   "Train Starting — Passenger Inertia",
      desc:    "The train (block) accelerates. Passengers feel 'pushed back' because their bodies resist the change in motion — inertia of rest!",
      concept: "When the train accelerates (force applied), passengers' bodies resist the change. They appear to 'fall back' because their inertia keeps them at rest while the train moves forward. a = (80 − μmg) / m.",
      mode: "force", env: "concrete",
      mass: 20, initForceLeft: 0, initForceRight: 80, initVelocity: 0,
      allowForceChange: true, maxForce: 200,
      blockColor: ["#059669", "#065f46"],
    }} />
  );
}

/* ── 12. Train Braking — Passengers Lurch Forward ────────────────────────── */
export function Sim_train_stop() {
  return (
    <SimCanvas config={{
      title:   "Train Braking — Inertia Resists Stopping",
      desc:    "Train moving at 3 m/s — brakes applied (left force). Passengers lurch forward: their inertia keeps them moving when the train decelerates.",
      concept: "Passengers continue at 3 m/s while the train decelerates. They 'lurch forward' relative to the train. This is inertia of motion — a body in motion resists changing to rest. Seatbelts work against exactly this.",
      mode: "force", env: "concrete",
      mass: 20, initForceLeft: 80, initForceRight: 0, initVelocity: 3,
      allowForceChange: true, maxForce: 200,
      blockColor: ["#059669", "#065f46"],
    }} />
  );
}

/* ── 13. Coin Flick on Wood ───────────────────────────────────────────────── */
export function Sim_coin_flick() {
  return (
    <SimCanvas config={{
      title:   "Coin Flick — Small Mass, High Deceleration",
      desc:    "A 50 g coin flicked at 3 m/s on a wood table. Despite the tiny mass, friction brings it to a quick stop.",
      concept: "Friction deceleration = μg = 0.35 × 9.8 = 3.43 m/s² (independent of mass!). The coin stops in ~0.87 s. Notice: deceleration rate due to friction is the same regardless of mass — friction force and mass both scale together.",
      mode: "force", env: "wood",
      mass: 0.05, initForceLeft: 0, initForceRight: 0, initVelocity: 3,
      allowForceChange: false,
      blockColor: ["#d97706", "#92400e"],
    }} />
  );
}

/* ── 14. Book Sliding on Desk ────────────────────────────────────────────── */
export function Sim_book_slide() {
  return (
    <SimCanvas config={{
      title:   "Book Sliding on Steel Desk",
      desc:    "A 1 kg book pushed at 2 m/s along a smooth steel desk. Low friction lets it slide far before stopping.",
      concept: "Steel μ = 0.15. Friction = 0.15 × 1 × 9.8 = 1.47 N. Deceleration = 1.47 m/s². The book slides ~1.36 m before stopping. Add a rightward force to push it further — demonstrating that applied force can counteract friction.",
      mode: "force", env: "steel",
      mass: 1, initForceLeft: 0, initForceRight: 10, initVelocity: 2,
      allowForceChange: true, maxForce: 50,
      blockColor: ["#78350f", "#451a03"],
    }} />
  );
}

/* ── 15. Hovercraft — Near-Zero Friction ─────────────────────────────────── */
export function Sim_hovercraft() {
  return (
    <SimCanvas config={{
      title:   "Hovercraft — Cushion of Air (Near-Zero Friction)",
      desc:    "Hovercrafts ride on a thin air cushion, reducing friction to almost zero. Once moving, they glide for a very long time like space.",
      concept: "Water surface (μ = 0.08) approximates a hovercraft. Launch at 2 m/s: friction = 0.08 × 5 × 9.8 = 3.92 N, deceleration = 0.784 m/s² — stops in ~2.55 s. Compare to concrete (stops in 0.31 s): low friction dramatically extends inertial motion.",
      mode: "force", env: "water",
      mass: 5, initForceLeft: 0, initForceRight: 0, initVelocity: 2,
      allowForceChange: true, maxForce: 50,
      blockColor: ["#0e7490", "#164e63"],
    }} />
  );
}
