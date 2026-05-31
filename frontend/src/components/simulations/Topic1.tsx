/**
 * FILE: Topic1.tsx
 * PURPOSE: 15 professional simulations — Topic 1: Balanced & Unbalanced Forces.
 *
 * Each export is a distinct React component using SimCanvas with a unique
 * environment, mass, force config and educational concept.
 *
 * Covers:
 *   — Forces in balance on different surfaces (ice, wood, space, concrete, rubber, steel, water)
 *   — Unbalanced forces causing acceleration
 *   — Effect of friction (static vs. kinetic)
 *   — Mass effects on inertia
 *   — Tug-of-war (balanced vs. winning team)
 */
"use client";
import React from "react";
import SimCanvas from "./engine/SimCanvas";

/* ── 1. Balanced Forces — Ice ────────────────────────────────────────────── */
export function Sim_balanced_ice() {
  return (
    <SimCanvas config={{
      title:   "Balanced Forces on Ice",
      desc:    "Equal 40 N forces push from left and right on near-frictionless ice. The block stays perfectly still.",
      concept: "Net force = 40 − 40 = 0 N. Zero net force → zero acceleration. The block remains at rest no matter how long you wait. Ice has μ = 0.02 — almost no friction.",
      mode: "force", env: "ice",
      mass: 10, initForceLeft: 40, initForceRight: 40,
      allowForceChange: true, maxForce: 120,
      blockColor: ["#4f46e5", "#7c3aed"],
    }} />
  );
}

/* ── 2. Unbalanced Forces — Ice ──────────────────────────────────────────── */
export function Sim_unbalanced_ice() {
  return (
    <SimCanvas config={{
      title:   "Unbalanced Forces on Ice",
      desc:    "Right force 70 N, left force 30 N. Net = 40 N rightward. On near-frictionless ice the block accelerates rapidly.",
      concept: "Kinetic friction on ice = 0.02 × 10 × 9.8 = 1.96 N — almost nothing. Net force ≈ 38 N. Acceleration = 38 / 10 = 3.8 m/s². Unbalanced forces always produce acceleration.",
      mode: "force", env: "ice",
      mass: 10, initForceLeft: 30, initForceRight: 70,
      allowForceChange: true, maxForce: 120,
      blockColor: ["#4f46e5", "#7c3aed"],
    }} />
  );
}

/* ── 3. Balanced Forces — Wood ───────────────────────────────────────────── */
export function Sim_balanced_wood() {
  return (
    <SimCanvas config={{
      title:   "Balanced Forces on Wooden Floor",
      desc:    "50 N from each side on wood (μ = 0.35). Static friction has plenty of headroom to keep the block still.",
      concept: "Net applied force = 0 N. But even if one side were slightly larger, static friction (up to 34.3 N) would hold the block. The block is doubly secure — balanced forces plus high friction.",
      mode: "force", env: "wood",
      mass: 10, initForceLeft: 50, initForceRight: 50,
      allowForceChange: true, maxForce: 150,
      blockColor: ["#0369a1", "#0c4a6e"],
    }} />
  );
}

/* ── 4. Unbalanced Forces — Wood ─────────────────────────────────────────── */
export function Sim_unbalanced_wood() {
  return (
    <SimCanvas config={{
      title:   "Unbalanced Forces on Wooden Floor",
      desc:    "Right 80 N vs. left 20 N on wood. Net applied = 60 N but wood friction resists 34.3 N — the block still slides.",
      concept: "Net applied = 60 N. Kinetic friction = μmg = 0.35 × 10 × 9.8 = 34.3 N. Net force = 60 − 34.3 = 25.7 N → a = 2.57 m/s². High friction reduces but doesn't stop the acceleration.",
      mode: "force", env: "wood",
      mass: 10, initForceLeft: 20, initForceRight: 80,
      allowForceChange: true, maxForce: 150,
      blockColor: ["#0369a1", "#0c4a6e"],
    }} />
  );
}

/* ── 5. Balanced Forces — Deep Space ─────────────────────────────────────── */
export function Sim_balanced_space() {
  return (
    <SimCanvas config={{
      title:   "Balanced Forces in Deep Space",
      desc:    "Two equal rocket thrusters fire from opposite sides in a frictionless, weightless void. The object stays still between the stars.",
      concept: "No gravity, no friction (μ = 0). Net force = 50 − 50 = 0 N. This is Newton's 1st Law in its purest form — zero net force means zero change in motion, forever.",
      mode: "force", env: "space",
      mass: 10, initForceLeft: 50, initForceRight: 50,
      allowForceChange: true, maxForce: 200,
      blockColor: ["#1d4ed8", "#1e3a8a"],
    }} />
  );
}

/* ── 6. Unbalanced Force — Deep Space ────────────────────────────────────── */
export function Sim_unbalanced_space() {
  return (
    <SimCanvas config={{
      title:   "Unbalanced Force in Deep Space",
      desc:    "A single thruster fires with no friction, no gravity, no resistance. The object accelerates indefinitely and wraps around.",
      concept: "In space μ = 0, so F_net = F_applied = 50 N. a = 50 / 10 = 5 m/s². Velocity keeps growing without limit. This is exactly how spacecraft propulsion works.",
      mode: "force", env: "space",
      mass: 10, initForceLeft: 0, initForceRight: 50,
      allowForceChange: true, maxForce: 200,
      blockColor: ["#1d4ed8", "#1e3a8a"],
    }} />
  );
}

/* ── 7. Heavy Block — Balanced (Concrete) ────────────────────────────────── */
export function Sim_heavy_balanced() {
  return (
    <SimCanvas config={{
      title:   "Balanced Forces — 100 kg Block on Concrete",
      desc:    "Massive block, massive forces — 300 N from each side on rough concrete. They cancel perfectly.",
      concept: "300 − 300 = 0 N net force, regardless of mass or surface roughness. Balanced forces always produce zero acceleration. Mass and friction are irrelevant when forces cancel.",
      mode: "force", env: "concrete",
      mass: 100, initForceLeft: 300, initForceRight: 300,
      allowForceChange: true, maxForce: 600,
      blockColor: ["#374151", "#111827"],
    }} />
  );
}

/* ── 8. Heavy Block — Unbalanced (Concrete) ──────────────────────────────── */
export function Sim_heavy_unbalanced() {
  return (
    <SimCanvas config={{
      title:   "Unbalanced Forces — 100 kg Block on Concrete",
      desc:    "Right 400 N, left 150 N — net 250 N. But concrete static friction (μs=0.75) can resist up to 735 N. The block won't budge.",
      concept: "Max static friction = 0.75 × 100 × 9.8 = 735 N. Net applied = 250 N < 735 N. Friction wins — the block stays still. Try raising the right force above 885 N to overcome it.",
      mode: "force", env: "concrete",
      mass: 100, initForceLeft: 150, initForceRight: 400,
      allowForceChange: true, maxForce: 1000,
      blockColor: ["#374151", "#111827"],
    }} />
  );
}

/* ── 9. Light Block — Balanced (Rubber) ──────────────────────────────────── */
export function Sim_light_balanced() {
  return (
    <SimCanvas config={{
      title:   "Balanced Forces — 2 kg Block on Rubber",
      desc:    "A tiny 2 kg block on a grippy rubber mat. Even small 10 N forces from each side keep it in perfect balance.",
      concept: "Net force = 10 − 10 = 0 N. Balanced forces mean zero acceleration for any mass. Even though rubber has μ = 0.80, the forces don't need friction to be balanced — they cancel directly.",
      mode: "force", env: "rubber",
      mass: 2, initForceLeft: 10, initForceRight: 10,
      allowForceChange: true, maxForce: 60,
      blockColor: ["#065f46", "#064e3b"],
    }} />
  );
}

/* ── 10. Light Block — Unbalanced (Rubber) ───────────────────────────────── */
export function Sim_light_unbalanced() {
  return (
    <SimCanvas config={{
      title:   "Unbalanced Forces — 2 kg Block on Rubber",
      desc:    "Right 35 N, left 5 N on rubber (μ = 0.80). Net applied 30 N — enough to break rubber's high static grip.",
      concept: "Max static friction = 0.90 × 2 × 9.8 = 17.6 N. Net applied = 30 N > 17.6 N — the block breaks free. Kinetic friction = 15.7 N. a = (30−15.7)/2 ≈ 7.15 m/s². Small mass → rapid acceleration.",
      mode: "force", env: "rubber",
      mass: 2, initForceLeft: 5, initForceRight: 35,
      allowForceChange: true, maxForce: 60,
      blockColor: ["#065f46", "#064e3b"],
    }} />
  );
}

/* ── 11. Tug of War — Balanced ───────────────────────────────────────────── */
export function Sim_tug_of_war_tie() {
  return (
    <SimCanvas config={{
      title:   "Tug of War — Perfect Balance",
      desc:    "Both teams pull with 200 N. The centre knot stays exactly in the middle — the system is in static equilibrium.",
      concept: "Net force = 200 − 200 = 0 N. Balanced forces produce no motion, even when individual forces are large. This is equilibrium — the real-world demonstration of Newton's 1st Law.",
      mode: "tugofwar", env: "wood",
      mass: 10, teamA: 200, teamB: 200,
      blockColor: ["#1d4ed8", "#1e3a8a"],
    }} />
  );
}

/* ── 12. Tug of War — Team A Wins ────────────────────────────────────────── */
export function Sim_tug_of_war_win() {
  return (
    <SimCanvas config={{
      title:   "Tug of War — Unbalanced (Team A Wins)",
      desc:    "Team A: 260 N. Team B: 200 N. A 60 N net force pulls the knot toward Team A's side.",
      concept: "Net force = 260 − 200 = 60 N. Even a small imbalance creates unbalanced forces that cause motion. Team B accelerates toward Team A — they can't hold on against an unbalanced net force.",
      mode: "tugofwar", env: "wood",
      mass: 10, teamA: 260, teamB: 200,
      blockColor: ["#1d4ed8", "#1e3a8a"],
    }} />
  );
}

/* ── 13. Extreme Balanced Forces — Steel ─────────────────────────────────── */
export function Sim_extreme_balanced() {
  return (
    <SimCanvas config={{
      title:   "Extreme Balanced Forces — Steel Surface",
      desc:    "500 N pushing from each side on a steel-smooth floor. Despite enormous forces, they cancel completely.",
      concept: "500 − 500 = 0 N. The magnitude of individual forces never matters for balance — only the net force does. Two equal and opposite forces always produce equilibrium.",
      mode: "force", env: "steel",
      mass: 50, initForceLeft: 500, initForceRight: 500,
      allowForceChange: false,
      blockColor: ["#475569", "#334155"],
    }} />
  );
}

/* ── 14. Extreme Unbalanced — Tiny Difference ────────────────────────────── */
export function Sim_extreme_unbalanced() {
  return (
    <SimCanvas config={{
      title:   "Extreme Forces — Tiny Imbalance (Steel)",
      desc:    "500 N vs. 480 N — only 20 N difference. But steel's friction (μ = 0.15) means kinetic friction = 73.5 N, so the block actually stays still.",
      concept: "Net applied = 20 N. Max static friction on steel = 0.20 × 50 × 9.8 = 98 N. Static friction > net force → no motion. You need a 100+ N imbalance to start motion on this surface.",
      mode: "force", env: "steel",
      mass: 50, initForceLeft: 480, initForceRight: 500,
      allowForceChange: true, maxForce: 700,
      blockColor: ["#475569", "#334155"],
    }} />
  );
}

/* ── 15. Micro Forces — Water Surface ────────────────────────────────────── */
export function Sim_micro_forces() {
  return (
    <SimCanvas config={{
      title:   "Micro Forces — Tiny Object on Water",
      desc:    "A 0.5 kg object on a smooth water surface. Very small forces; see how Newton's Laws work at small scales.",
      concept: "Water: μ = 0.08. Max static friction = 0.10 × 0.5 × 9.8 = 0.49 N. Adjust forces below 0.49 N each and the block is balanced. Exceed that tiny threshold and it starts moving. Newton's Laws are scale-invariant.",
      mode: "force", env: "water",
      mass: 0.5, initForceLeft: 0.2, initForceRight: 0.2,
      allowForceChange: true, maxForce: 5,
      blockColor: ["#0e7490", "#164e63"],
    }} />
  );
}
