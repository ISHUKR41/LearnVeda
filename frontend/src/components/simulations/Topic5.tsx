/**
 * FILE: Topic5.tsx
 * PURPOSE: 15 professional simulations — Topic 5: Conservation of Momentum.
 *
 * "The total momentum of a closed system is conserved — it remains constant
 *  unless an external force acts on the system."
 *   p_total = m₁v₁ + m₂v₂ = constant
 *
 * Export names match the SimulationRegistry exactly.
 * Visual content (title, desc, concept) teaches distinct momentum scenarios.
 *
 * Covers:
 *   — Elastic collisions (KE and momentum conserved)
 *   — Inelastic collisions (KE lost, momentum conserved)
 *   — Perfectly inelastic (objects stick together)
 *   — Recoil, explosions, real-world crashes
 */
"use client";
import React from "react";
import SimCanvas from "./engine/SimCanvas";

/* ── 1. Elastic Collision — Equal Masses ─────────────────────────────────── */
export function Sim_momentum_heavy() {
  return (
    <SimCanvas config={{
      title:   "Elastic Collision — Equal Masses Exchange Velocity",
      desc:    "Two 10 kg blocks collide elastically on frictionless ice. Watch them swap velocities — a hallmark of equal-mass elastic collisions.",
      concept: "p_before = 10×3 + 10×0 = 30 kg·m/s. p_after = 10×0 + 10×3 = 30 kg·m/s. Momentum conserved! Equal-mass elastic collisions always result in complete velocity exchange. This is why Newton's Cradle works.",
      mode: "collision", env: "ice",
      mass: 10, mass2: 10,
      initVelocity: 3, initVelocity2: 0,
      collisionType: "elastic",
      blockColor:  ["#4f46e5", "#7c3aed"],
      block2Color: ["#d97706", "#92400e"],
    }} />
  );
}

/* ── 2. Heavy Hits Light — Momentum Transfer ─────────────────────────────── */
export function Sim_momentum_fast() {
  return (
    <SimCanvas config={{
      title:   "Heavy Hits Light — Dramatic Momentum Transfer",
      desc:    "8 kg block at 3 m/s hits stationary 2 kg block elastically. The light block shoots off at high speed; the heavy one barely slows.",
      concept: "v₁_final = (8−2)/(8+2) × 3 = 1.8 m/s. v₂_final = 2×8/(8+2) × 3 = 4.8 m/s. Verify: p = 8×1.8 + 2×4.8 = 14.4 + 9.6 = 24 = 8×3. Momentum perfectly conserved even though the two blocks behave very differently.",
      mode: "collision", env: "steel",
      mass: 8, mass2: 2,
      initVelocity: 3, initVelocity2: 0,
      collisionType: "elastic",
      blockColor:  ["#374151", "#111827"],
      block2Color: ["#d97706", "#92400e"],
    }} />
  );
}

/* ── 3. Head-On Elastic — Equal Masses Reverse ───────────────────────────── */
export function Sim_momentum_collision() {
  return (
    <SimCanvas config={{
      title:   "Head-On Elastic — Equal Masses Reverse Directions",
      desc:    "5 kg at +3 m/s meets 5 kg at −3 m/s head-on. After elastic collision, both perfectly reverse their velocities.",
      concept: "p_before = 5×3 + 5×(−3) = 0 kg·m/s. p_after = 5×(−3) + 5×3 = 0. Total momentum is zero before AND after — conserved. KE is also conserved (elastic). Equal-mass head-on elastic: velocities simply swap.",
      mode: "collision", env: "ice",
      mass: 5, mass2: 5,
      initVelocity: 3, initVelocity2: -3,
      collisionType: "elastic",
      blockColor:  ["#1d4ed8", "#1e3a8a"],
      block2Color: ["#991b1b", "#7f1d1d"],
    }} />
  );
}

/* ── 4. Perfectly Inelastic — Objects Stick, Combined Velocity ───────────── */
export function Sim_momentum_stop() {
  return (
    <SimCanvas config={{
      title:   "Perfectly Inelastic — They Stick Together",
      desc:    "6 kg at 4 m/s catches 4 kg at 1 m/s (same direction). They collide and stick together — what's their combined velocity?",
      concept: "p = 6×4 + 4×1 = 28 kg·m/s. Combined: 10 × v_f = 28 → v_f = 2.8 m/s. KE before = 50 J; after = 39.2 J. 10.8 J lost to heat/deformation. Momentum conserved; kinetic energy is NOT in inelastic collisions.",
      mode: "collision", env: "rubber",
      mass: 6, mass2: 4,
      initVelocity: 4, initVelocity2: 1,
      collisionType: "inelastic",
      blockColor:  ["#4f46e5", "#7c3aed"],
      block2Color: ["#065f46", "#064e3b"],
    }} />
  );
}

/* ── 5. Zero Total Momentum — Head-On Inelastic ──────────────────────────── */
export function Sim_momentum_bullet() {
  return (
    <SimCanvas config={{
      title:   "Head-On Inelastic — Total Momentum = 0, They Stop!",
      desc:    "5 kg at +3 m/s collides with 5 kg at −3 m/s. They stick together. Because total momentum = 0, they come to a complete stop.",
      concept: "p_before = 5×3 + 5×(−3) = 0. Inelastic: (5+5)×v_f = 0 → v_f = 0. All KE converts to heat. This demonstrates that when total momentum is zero, a perfectly inelastic collision produces zero final velocity — they stop dead.",
      mode: "collision", env: "concrete",
      mass: 5, mass2: 5,
      initVelocity: 3, initVelocity2: -3,
      collisionType: "inelastic",
      blockColor:  ["#1d4ed8", "#1e3a8a"],
      block2Color: ["#991b1b", "#7f1d1d"],
    }} />
  );
}

/* ── 6. Light Bounces Off Heavy Wall ─────────────────────────────────────── */
export function Sim_momentum_train() {
  return (
    <SimCanvas config={{
      title:   "Light Ball Bounces Off Massive Object",
      desc:    "2 kg block at 5 m/s hits a near-immovable 100 kg block. The light block bounces backward; the heavy block barely nudges.",
      concept: "v₁_final ≈ −5 m/s (nearly reversed). v₂_final ≈ 0.2 m/s. p before = 10; p after = 2×(−5) + 100×0.2 = −10 + 20 = 10. Conserved! This explains why a ball bounces off a wall — the wall's momentum change is tiny but real.",
      mode: "collision", env: "concrete",
      mass: 2, mass2: 100,
      initVelocity: 5, initVelocity2: 0,
      collisionType: "elastic",
      blockColor:  ["#d97706", "#92400e"],
      block2Color: ["#374151", "#111827"],
    }} />
  );
}

/* ── 7. Bullet Embeds in Block — Ballistic Pendulum ─────────────────────── */
export function Sim_momentum_change() {
  return (
    <SimCanvas config={{
      title:   "Ballistic Pendulum — Bullet Embeds in Block",
      desc:    "0.05 kg bullet at 100 m/s slams into 2 kg block. They stick together. Momentum is conserved; kinetic energy is mostly lost.",
      concept: "p = 0.05×100 = 5 kg·m/s. v_f = 5/(0.05+2) = 2.44 m/s. KE before = 250 J; after = only 6.1 J! 97.6% of kinetic energy lost to deformation and heat. Ballistic pendulums were historically used to measure bullet speeds — using exactly this calculation.",
      mode: "collision", env: "wood",
      mass: 0.05, mass2: 2,
      initVelocity: 100, initVelocity2: 0,
      collisionType: "inelastic",
      blockColor:  ["#d97706", "#92400e"],
      block2Color: ["#374151", "#111827"],
    }} />
  );
}

/* ── 8. Car Crash — Real-World Momentum ──────────────────────────────────── */
export function Sim_momentum_braking() {
  return (
    <SimCanvas config={{
      title:   "Car Crash Analysis — Real-World Momentum",
      desc:    "1500 kg car at 2 m/s vs. 1200 kg car at −1.5 m/s. They crumple together (inelastic). Forensic physics in action.",
      concept: "p = 1500×2 + 1200×(−1.5) = 3000 − 1800 = 1200 kg·m/s. v_f = 1200/2700 ≈ 0.44 m/s rightward. The heavier/faster car's momentum dominates. Accident investigators reconstruct crash speeds using exactly this equation.",
      mode: "collision", env: "concrete",
      mass: 1500, mass2: 1200,
      initVelocity: 2, initVelocity2: -1.5,
      collisionType: "inelastic",
      blockColor:  ["#374151", "#111827"],
      block2Color: ["#059669", "#065f46"],
    }} />
  );
}

/* ── 9. Explosion from Rest — Equal Fragments ────────────────────────────── */
export function Sim_momentum_zero() {
  return (
    <SimCanvas config={{
      title:   "Explosion from Rest — Equal Fragments Fly Apart",
      desc:    "Two equal-mass pieces start at rest (firework shell). An explosion sends them flying at equal and opposite speeds.",
      concept: "p_initial = 0. After: m×(+v) + m×(−v) = 0. Total momentum conserved at zero! Chemical energy → kinetic energy. Equal masses always fly apart at equal speeds. If masses differ: m₁v₁ = m₂v₂ → heavier fragment gets slower speed.",
      mode: "collision", env: "space",
      mass: 4, mass2: 4,
      initVelocity: 4, initVelocity2: -4,
      collisionType: "elastic",
      blockColor:  ["#d97706", "#92400e"],
      block2Color: ["#991b1b", "#7f1d1d"],
    }} />
  );
}

/* ── 10. Unequal Explosion — Asymmetric Recoil ───────────────────────────── */
export function Sim_momentum_asteroid() {
  return (
    <SimCanvas config={{
      title:   "Asymmetric Explosion — Unequal Fragment Speeds",
      desc:    "3 kg and 9 kg fragments start at rest. Explosion launches them. Because momenta must cancel: the lighter piece flies 3× faster.",
      concept: "p = 0. So 3×v₁ + 9×v₂ = 0 → v₁ = −3v₂. If heavy fragment gets 1 m/s, light gets 3 m/s. This is why rocket exhaust (high-speed, small-mass gas) produces modest rocket speed (large-mass vehicle). F=ma and momentum both govern it.",
      mode: "collision", env: "space",
      mass: 3, mass2: 9,
      initVelocity: 3, initVelocity2: -1,
      collisionType: "elastic",
      blockColor:  ["#1d4ed8", "#1e3a8a"],
      block2Color: ["#374151", "#111827"],
    }} />
  );
}

/* ── 11. Billiards — Equal-Mass Near-Perfect Transfer ────────────────────── */
export function Sim_momentum_pingpong() {
  return (
    <SimCanvas config={{
      title:   "Billiards Shot — Near-Perfect Momentum Transfer",
      desc:    "0.17 kg cue ball at 4 m/s hits stationary 0.17 kg object ball. In a perfect shot, the cue ball stops and the object ball rolls away.",
      concept: "Equal mass elastic: cue stops (v₁=0), object moves at 4 m/s (v₂=4). p = 0.17×4 = 0.68 kg·m/s before; 0.17×4 = 0.68 after. Professional players know this intuitively — they use it to control where both balls end up after each shot.",
      mode: "collision", env: "rubber",
      mass: 0.17, mass2: 0.17,
      initVelocity: 4, initVelocity2: 0,
      collisionType: "elastic",
      blockColor:  ["#f1f5f9", "#e2e8f0"],
      block2Color: ["#d97706", "#92400e"],
    }} />
  );
}

/* ── 12. Rocket Propulsion — Continuous Momentum ─────────────────────────── */
export function Sim_momentum_impulse1() {
  return (
    <SimCanvas config={{
      title:   "Rocket in Space — Momentum via Exhaust",
      desc:    "Rocket fires continuously. Exhaust goes backward carrying momentum; rocket moves forward gaining equal momentum. Closed system: p_total = 0.",
      concept: "Every bit of exhaust gas carries backward momentum. The rocket gains equal-and-opposite forward momentum. Total = 0 always. This is the Tsiolkovsky rocket equation: Δv = v_exhaust × ln(m_initial/m_final). Momentum conservation drives all space travel.",
      mode: "force", env: "space",
      mass: 10, initForceLeft: 0, initForceRight: 100,
      allowForceChange: true, maxForce: 300,
      blockColor: ["#1d4ed8", "#1e3a8a"],
    }} />
  );
}

/* ── 13. Impulse — Short Force, Big Momentum Change ─────────────────────── */
export function Sim_momentum_impulse2() {
  return (
    <SimCanvas config={{
      title:   "Impulse = Force × Time = Δ Momentum",
      desc:    "A short, powerful force is applied to a light block on ice. Impulse J = F × Δt = Δp. Watch how it changes momentum.",
      concept: "Impulse J = F × t. Here: 80 N for any Δt creates momentum p = J = 80t kg·m/s. This is why: (1) car crumple zones increase collision time to reduce peak force; (2) baseball bats 'follow through' to maximize contact time and impulse. J = Δp exactly.",
      mode: "force", env: "ice",
      mass: 2, initForceLeft: 0, initForceRight: 80,
      allowForceChange: true, maxForce: 200,
      blockColor: ["#d97706", "#92400e"],
    }} />
  );
}

/* ── 14. Ice Skaters Push Off — Opposite Momenta ─────────────────────────── */
export function Sim_momentum_reverse() {
  return (
    <SimCanvas config={{
      title:   "Ice Skaters Push Off — Momenta Must Cancel",
      desc:    "60 kg and 80 kg skaters push off each other from rest. Same force, same time → same impulse magnitude, opposite directions.",
      concept: "Initially p = 0. After: 60×v₁ + 80×v₂ = 0. Same force, so same |impulse|: 60×|v₁| = 80×|v₂|. Lighter skater (60 kg) moves faster. v₁/v₂ = 80/60 = 4/3. The lighter person always 'wins' in recoil speed!",
      mode: "collision", env: "ice",
      mass: 60, mass2: 80,
      initVelocity: 1.33, initVelocity2: -1,
      collisionType: "elastic",
      blockColor:  ["#4f46e5", "#7c3aed"],
      block2Color: ["#0369a1", "#0c4a6e"],
    }} />
  );
}

/* ── 15. Pool Table — Two Moving Balls ───────────────────────────────────── */
export function Sim_momentum_constant() {
  return (
    <SimCanvas config={{
      title:   "Pool — Two Moving Balls, Momentum Always Conserved",
      desc:    "0.17 kg ball at 4 m/s meets another at −2 m/s. Elastic collision. Before and after, verify p_total stays constant.",
      concept: "p_before = 0.17×4 + 0.17×(−2) = 0.34 kg·m/s. After: velocities swap → v₁=−2, v₂=4. p_after = 0.17×(−2) + 0.17×4 = 0.34 kg·m/s. Conserved regardless of which ball hits which, at what angle, how hard. Momentum conservation is absolute.",
      mode: "collision", env: "rubber",
      mass: 0.17, mass2: 0.17,
      initVelocity: 4, initVelocity2: -2,
      collisionType: "elastic",
      blockColor:  ["#f1f5f9", "#e2e8f0"],
      block2Color: ["#d97706", "#92400e"],
    }} />
  );
}
