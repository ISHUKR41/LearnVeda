/**
 * FILE: Topic4.tsx
 * PURPOSE: 15 professional simulations — Topic 4: Newton's Third Law (Action-Reaction).
 *
 * "For every action there is an equal and opposite reaction."
 *
 * Uses collision mode to show two objects exerting forces on each other,
 * plus force mode for propulsion / thrust scenarios.
 *
 * Covers:
 *   — Equal and opposite forces in direct contact (push, collision)
 *   — Recoil (gun/bullet, cannon/ball)
 *   — Propulsion (rocket, jet, balloon)
 *   — Everyday action-reaction (walking, swimming, bird flight)
 */
"use client";
import React from "react";
import SimCanvas from "./engine/SimCanvas";

/* ── 1. Two Equal-Mass Blocks — Elastic Collision ────────────────────────── */
export function Sim_action_reaction_push() {
  return (
    <SimCanvas config={{
      title:   "Action-Reaction — Equal Mass Elastic Collision",
      desc:    "Two 10 kg blocks approach each other. When they collide, each exerts an equal and opposite force on the other.",
      concept: "Block 1 exerts force F on Block 2 → Block 2 exerts −F on Block 1. Forces are equal in magnitude, opposite in direction. In elastic collision with equal mass: they exchange velocities. This IS Newton's 3rd Law.",
      mode: "collision", env: "ice",
      mass: 10, mass2: 10,
      initVelocity: 3, initVelocity2: -2,
      collisionType: "elastic",
      blockColor:  ["#4f46e5", "#7c3aed"],
      block2Color: ["#d97706", "#92400e"],
    }} />
  );
}

/* ── 2. Gun and Bullet — Recoil ───────────────────────────────────────────── */
export function Sim_recoil_gun() {
  return (
    <SimCanvas config={{
      title:   "Gun Recoil — Action-Reaction",
      desc:    "Bullet (0.05 kg) fires right at high speed; gun (5 kg) recoils left. Equal forces, opposite directions — very different accelerations due to mass difference.",
      concept: "Bullet: 0.05 × 500 = 25 kg·m/s rightward. Gun: 5 × v_recoil = 25 kg·m/s leftward. v_recoil = −5 m/s. SAME force duration, same impulse, opposite directions — 3rd Law. But a = F/m differs enormously due to mass difference.",
      mode: "collision", env: "space",
      mass: 5, mass2: 0.05,
      initVelocity: -5, initVelocity2: 500,
      collisionType: "elastic",
      blockColor:  ["#374151", "#111827"],
      block2Color: ["#d97706", "#92400e"],
    }} />
  );
}

/* ── 3. Rocket Propulsion in Space ───────────────────────────────────────── */
export function Sim_rocket_launch() {
  return (
    <SimCanvas config={{
      title:   "Rocket Propulsion — Exhaust & Lift",
      desc:    "A rocket in deep space fires its thruster. Exhaust gas is pushed backward; the rocket is pushed forward — classic action-reaction.",
      concept: "The engine pushes gas backward (action). The gas pushes the rocket forward (reaction). No air or ground needed — Newton's 3rd Law works in a complete vacuum. This is how ALL rockets and spacecraft move.",
      mode: "force", env: "space",
      mass: 8, initForceLeft: 0, initForceRight: 120,
      allowForceChange: true, maxForce: 300,
      blockColor: ["#1d4ed8", "#1e3a8a"],
    }} />
  );
}

/* ── 4. Swimmer Pushing Wall ─────────────────────────────────────────────── */
export function Sim_swimmer_wall() {
  return (
    <SimCanvas config={{
      title:   "Swimmer Pushes Off Wall",
      desc:    "A swimmer (5 kg) at rest pushes off the wall. The wall pushes back with equal force, launching the swimmer.",
      concept: "Swimmer pushes wall left → wall pushes swimmer right (equal force). The wall doesn't move (infinite mass), but the swimmer accelerates right. Every swimming turn uses this: the harder you push the wall, the faster you rebound.",
      mode: "collision", env: "water",
      mass: 5, mass2: 1000,
      initVelocity: -2, initVelocity2: 0,
      collisionType: "elastic",
      blockColor:  ["#0e7490", "#164e63"],
      block2Color: ["#374151", "#111827"],
    }} />
  );
}

/* ── 5. Walking on Concrete — Foot vs. Ground ────────────────────────────── */
export function Sim_walking_friction() {
  return (
    <SimCanvas config={{
      title:   "Walking — Foot Pushes Ground Back",
      desc:    "Your foot pushes the ground backward (action). The ground pushes your foot forward (reaction). That reaction force is what moves you.",
      concept: "When you walk, you push the Earth backward. The Earth pushes you forward. Because Earth's mass is ~6×10²⁴ kg, its acceleration from your push is immeasurably tiny. But YOU accelerate significantly from the reaction force.",
      mode: "force", env: "concrete",
      mass: 10, initForceLeft: 0, initForceRight: 80,
      allowForceChange: true, maxForce: 200,
      blockColor: ["#059669", "#065f46"],
    }} />
  );
}

/* ── 6. Two Ice Skaters — Different Masses ───────────────────────────────── */
export function Sim_ice_skater() {
  return (
    <SimCanvas config={{
      title:   "Ice Skaters — Different Mass, Same Force",
      desc:    "60 kg and 80 kg skaters push off each other. Same force on each, but different accelerations because of different masses.",
      concept: "F is equal for both skaters (3rd Law). But a₁ = F/60 > a₂ = F/80. The lighter skater moves FASTER. They separate at different speeds. Verify: p_total before = 0; after = m₁v₁ + m₂v₂ = 0 (momentum conserved).",
      mode: "collision", env: "ice",
      mass: 60, mass2: 80,
      initVelocity: 1.5, initVelocity2: -1,
      collisionType: "elastic",
      blockColor:  ["#4f46e5", "#7c3aed"],
      block2Color: ["#065f46", "#064e3b"],
    }} />
  );
}

/* ── 7. Bird in Flight — Wings Push Air Down ─────────────────────────────── */
export function Sim_bird_flight() {
  return (
    <SimCanvas config={{
      title:   "Bird Flight — Wings Push Air Downward",
      desc:    "A bird's wings push air down (action). The air pushes the bird up (reaction). Here shown as horizontal thrust for visualization.",
      concept: "Bird pushes air molecules downward → air pushes bird upward. This IS Newton's 3rd Law. The downward momentum given to air equals the upward momentum gained by the bird. Lift = rate of change of downward momentum of air.",
      mode: "force", env: "space",
      mass: 0.5, initForceLeft: 0, initForceRight: 30,
      allowForceChange: true, maxForce: 100,
      blockColor: ["#059669", "#065f46"],
    }} />
  );
}

/* ── 8. Jumping from Boat — Person vs. Boat ──────────────────────────────── */
export function Sim_boat_jump() {
  return (
    <SimCanvas config={{
      title:   "Person Jumps from Boat",
      desc:    "70 kg person jumps forward; the 300 kg boat moves backward. Equal forces, wildly different velocities.",
      concept: "Person pushes boat back (action) → boat pushes person forward (reaction). Same force, but person (70 kg) accelerates far more than boat (300 kg). Momentum conserved: 70×v_p + 300×v_b = 0. If v_p = 3 m/s, v_b = −0.7 m/s.",
      mode: "collision", env: "water",
      mass: 70, mass2: 300,
      initVelocity: 3, initVelocity2: 0,
      collisionType: "elastic",
      blockColor:  ["#0e7490", "#164e63"],
      block2Color: ["#0369a1", "#0c4a6e"],
    }} />
  );
}

/* ── 9. Balloon Jet — Air Escapes Backward ───────────────────────────────── */
export function Sim_balloon_air() {
  return (
    <SimCanvas config={{
      title:   "Balloon Jet — Air Escapes Backward",
      desc:    "Air is released backward (action). The balloon is pushed forward (reaction). A simple rocket-like demonstration.",
      concept: "Balloon pushes air molecules backward → air pushes balloon forward. As more air escapes, momentum is transferred. This is identical to a rocket engine — the only difference is scale. Both rely purely on Newton's 3rd Law.",
      mode: "force", env: "space",
      mass: 0.05, initForceLeft: 0, initForceRight: 5,
      allowForceChange: true, maxForce: 20,
      blockColor: ["#d97706", "#92400e"],
    }} />
  );
}

/* ── 10. Firehose Recoil ─────────────────────────────────────────────────── */
export function Sim_firehose() {
  return (
    <SimCanvas config={{
      title:   "Firehose Recoil — Water Jet",
      desc:    "A firehose jets water forward (action). The hose and firefighter are pushed backward (reaction). That's why hoses are hard to hold.",
      concept: "Water is pushed forward at high velocity → water pushes hose backward. Force = rate of change of momentum = mass_flow_rate × velocity. A firehose can easily knock a person over — the reaction force is real and substantial.",
      mode: "force", env: "concrete",
      mass: 10, initForceLeft: 80, initForceRight: 0,
      allowForceChange: true, maxForce: 200,
      blockColor: ["#0369a1", "#0c4a6e"],
    }} />
  );
}

/* ── 11. Hammer Hits Nail ─────────────────────────────────────────────────── */
export function Sim_hammer_nail() {
  return (
    <SimCanvas config={{
      title:   "Hammer Hits Nail — Equal Forces",
      desc:    "Heavy hammer (0.5 kg) collides with tiny nail (0.01 kg). The hammer exerts force on nail — the nail exerts equal force back.",
      concept: "The nail pushes back on the hammer just as hard as the hammer pushes on the nail — same force, opposite direction. Yet the nail accelerates enormously (small mass) while the hammer barely slows (large mass). a = F/m explains the difference.",
      mode: "collision", env: "wood",
      mass: 0.5, mass2: 0.01,
      initVelocity: 5, initVelocity2: 0,
      collisionType: "elastic",
      blockColor:  ["#374151", "#111827"],
      block2Color: ["#d97706", "#92400e"],
    }} />
  );
}

/* ── 12. Car Tyres — Road Reaction ───────────────────────────────────────── */
export function Sim_car_tires() {
  return (
    <SimCanvas config={{
      title:   "Car Tyres — Road Pushes Car Forward",
      desc:    "The tyre pushes the road backward (friction, action). The road pushes the tyre — and car — forward (reaction). That's what accelerates a car.",
      concept: "Without the ground reaction force, no car could accelerate. When wheels spin, they push road backward. Road pushes car forward via friction. No friction = no traction = no acceleration. This is exactly why cars slip on ice.",
      mode: "force", env: "concrete",
      mass: 20, initForceLeft: 0, initForceRight: 120,
      allowForceChange: true, maxForce: 300,
      blockColor: ["#374151", "#111827"],
    }} />
  );
}

/* ── 13. Spring Release — Two Blocks Fly Apart ───────────────────────────── */
export function Sim_spring_push() {
  return (
    <SimCanvas config={{
      title:   "Compressed Spring — Equal Mass Fly Apart",
      desc:    "Two 5 kg blocks held together by a compressed spring. Release: they fly apart at equal and opposite speeds.",
      concept: "Spring pushes block 1 right (action) AND block 2 left (reaction) simultaneously. Equal forces, equal masses → equal speeds, opposite directions. Total momentum before = 0; after = 5×(+3) + 5×(−3) = 0. Momentum conserved!",
      mode: "collision", env: "ice",
      mass: 5, mass2: 5,
      initVelocity: 3, initVelocity2: -3,
      collisionType: "elastic",
      blockColor:  ["#4f46e5", "#7c3aed"],
      block2Color: ["#d97706", "#92400e"],
    }} />
  );
}

/* ── 14. Magnets Repelling ────────────────────────────────────────────────── */
export function Sim_magnet_repel() {
  return (
    <SimCanvas config={{
      title:   "Magnetic Repulsion — Action at a Distance",
      desc:    "Two magnets (3 kg each) with same poles approaching. They repel each other — equal forces, opposite directions — without touching.",
      concept: "Newton's 3rd Law operates even without contact. Magnet A pushes Magnet B with force F → Magnet B pushes Magnet A with force −F. This is an action-reaction pair even across a distance, via the magnetic field.",
      mode: "collision", env: "steel",
      mass: 3, mass2: 3,
      initVelocity: 2, initVelocity2: -2,
      collisionType: "elastic",
      blockColor:  ["#1d4ed8", "#1e3a8a"],
      block2Color: ["#991b1b", "#7f1d1d"],
    }} />
  );
}

/* ── 15. Cannon Fire — Recoil ─────────────────────────────────────────────── */
export function Sim_cannon_fire() {
  return (
    <SimCanvas config={{
      title:   "Cannon Fire — Massive Recoil",
      desc:    "Cannonball (10 kg) fires at 30 m/s rightward; cannon (500 kg) recoils left. Same force, vastly different speeds.",
      concept: "Momentum: p_ball = 10 × 30 = 300 kg·m/s. Cannon recoil: 500 × v = −300 → v = −0.6 m/s. The cannon barely moves! But if mounted on a frictionless surface (ice), you'd clearly feel the 0.6 m/s kick — that's the 3rd Law reaction.",
      mode: "collision", env: "concrete",
      mass: 500, mass2: 10,
      initVelocity: -0.6, initVelocity2: 30,
      collisionType: "elastic",
      blockColor:  ["#374151", "#111827"],
      block2Color: ["#d97706", "#92400e"],
    }} />
  );
}
