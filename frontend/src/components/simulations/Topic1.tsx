import React from "react";
import ForceEngine from "./engine/ForceEngine";

export function Sim_balanced_ice() {
  return <ForceEngine config={{
    initialMass: 50,
    initialVelocity: 0,
    frictionCoefficient: 0.05,
    environmentName: "Ice Surface",
    presetForceLeft: 50,
    presetForceRight: 50,
    scenarioDescription: "Balanced forces on a slippery ice surface.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_unbalanced_ice() {
  return <ForceEngine config={{
    initialMass: 50,
    initialVelocity: 0,
    frictionCoefficient: 0.05,
    environmentName: "Ice Surface",
    presetForceLeft: 20,
    presetForceRight: 50,
    scenarioDescription: "Unbalanced forces on ice. Watch it accelerate easily.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_balanced_wood() {
  return <ForceEngine config={{
    initialMass: 50,
    initialVelocity: 0,
    frictionCoefficient: 0.3,
    environmentName: "Wooden Floor",
    presetForceLeft: 100,
    presetForceRight: 100,
    scenarioDescription: "High friction wooden floor with balanced strong forces.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_unbalanced_wood() {
  return <ForceEngine config={{
    initialMass: 50,
    initialVelocity: 0,
    frictionCoefficient: 0.3,
    environmentName: "Wooden Floor",
    presetForceLeft: 50,
    presetForceRight: 150,
    scenarioDescription: "Overcoming static friction on wood.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_balanced_space() {
  return <ForceEngine config={{
    initialMass: 100,
    initialVelocity: 0,
    frictionCoefficient: 0,
    environmentName: "Deep Space",
    presetForceLeft: 10,
    presetForceRight: 10,
    scenarioDescription: "Zero friction in space. Balanced forces keep it stationary.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_unbalanced_space() {
  return <ForceEngine config={{
    initialMass: 100,
    initialVelocity: 0,
    frictionCoefficient: 0,
    environmentName: "Deep Space",
    presetForceLeft: 0,
    presetForceRight: 10,
    scenarioDescription: "Even a tiny force causes constant acceleration in space.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_heavy_balanced() {
  return <ForceEngine config={{
    initialMass: 100,
    initialVelocity: 0,
    frictionCoefficient: 0.6,
    environmentName: "Concrete",
    presetForceLeft: 200,
    presetForceRight: 200,
    scenarioDescription: "A heavy object with strong balanced forces.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_heavy_unbalanced() {
  return <ForceEngine config={{
    initialMass: 100,
    initialVelocity: 0,
    frictionCoefficient: 0.6,
    environmentName: "Concrete",
    presetForceLeft: 0,
    presetForceRight: 200,
    scenarioDescription: "Trying to move a heavy object. Friction fights back!",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_light_balanced() {
  return <ForceEngine config={{
    initialMass: 5,
    initialVelocity: 0,
    frictionCoefficient: 0.01,
    environmentName: "Glass",
    presetForceLeft: 2,
    presetForceRight: 2,
    scenarioDescription: "Delicate balanced forces on a light object.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_light_unbalanced() {
  return <ForceEngine config={{
    initialMass: 5,
    initialVelocity: 0,
    frictionCoefficient: 0.01,
    environmentName: "Glass",
    presetForceLeft: 0,
    presetForceRight: 10,
    scenarioDescription: "Light object shoots off quickly due to high acceleration.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_tug_of_war_tie() {
  return <ForceEngine config={{
    initialMass: 70,
    initialVelocity: 0,
    frictionCoefficient: 0.5,
    environmentName: "Mud",
    presetForceLeft: 150,
    presetForceRight: 150,
    scenarioDescription: "A perfect tie in tug of war.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_tug_of_war_win() {
  return <ForceEngine config={{
    initialMass: 70,
    initialVelocity: 0,
    frictionCoefficient: 0.5,
    environmentName: "Mud",
    presetForceLeft: 100,
    presetForceRight: 180,
    scenarioDescription: "Right side winning the tug of war.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_extreme_balanced() {
  return <ForceEngine config={{
    initialMass: 80,
    initialVelocity: 0,
    frictionCoefficient: 0.8,
    environmentName: "Asphalt",
    presetForceLeft: 500,
    presetForceRight: 500,
    scenarioDescription: "Extreme forces, perfectly balanced.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_extreme_unbalanced() {
  return <ForceEngine config={{
    initialMass: 80,
    initialVelocity: 0,
    frictionCoefficient: 0.8,
    environmentName: "Asphalt",
    presetForceLeft: 0,
    presetForceRight: 500,
    scenarioDescription: "Massive unbalanced force.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_micro_forces() {
  return <ForceEngine config={{
    initialMass: 1,
    initialVelocity: 0,
    frictionCoefficient: 0.001,
    environmentName: "Air Table",
    presetForceLeft: 0,
    presetForceRight: 1,
    scenarioDescription: "Micro forces on an air table.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

