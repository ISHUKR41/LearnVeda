import React from "react";
import ForceEngine from "./engine/ForceEngine";

export function Sim_inertia_rest() {
  return <ForceEngine config={{
    initialMass: 10,
    initialVelocity: 0,
    frictionCoefficient: 0.2,
    environmentName: "Tabletop",
    presetForceLeft: 0,
    presetForceRight: 0,
    scenarioDescription: "Object at rest stays at rest until acted upon.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_inertia_motion_space() {
  return <ForceEngine config={{
    initialMass: 50,
    initialVelocity: 10,
    frictionCoefficient: 0,
    environmentName: "Space",
    presetForceLeft: 0,
    presetForceRight: 0,
    scenarioDescription: "Object in motion stays in motion with no friction.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_inertia_heavy() {
  return <ForceEngine config={{
    initialMass: 500,
    initialVelocity: 0,
    frictionCoefficient: 0.4,
    environmentName: "Warehouse",
    presetForceLeft: 0,
    presetForceRight: 100,
    scenarioDescription: "High mass means high inertia. Hard to start moving.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_inertia_light() {
  return <ForceEngine config={{
    initialMass: 5,
    initialVelocity: 0,
    frictionCoefficient: 0.4,
    environmentName: "Warehouse",
    presetForceLeft: 0,
    presetForceRight: 100,
    scenarioDescription: "Low mass means low inertia. Easy to start moving.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_friction_stop() {
  return <ForceEngine config={{
    initialMass: 20,
    initialVelocity: 20,
    frictionCoefficient: 0.8,
    environmentName: "Grass",
    presetForceLeft: 0,
    presetForceRight: 0,
    scenarioDescription: "Friction is the unbalanced force that stops the object.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_ice_slide() {
  return <ForceEngine config={{
    initialMass: 20,
    initialVelocity: 10,
    frictionCoefficient: 0.02,
    environmentName: "Ice",
    presetForceLeft: 0,
    presetForceRight: 0,
    scenarioDescription: "Low friction means it keeps moving for a long time.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_sudden_push() {
  return <ForceEngine config={{
    initialMass: 30,
    initialVelocity: 0,
    frictionCoefficient: 0.3,
    environmentName: "Floor",
    presetForceLeft: 0,
    presetForceRight: 200,
    scenarioDescription: "A sudden unbalanced force overcomes inertia of rest.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_sudden_pull() {
  return <ForceEngine config={{
    initialMass: 30,
    initialVelocity: 0,
    frictionCoefficient: 0.3,
    environmentName: "Floor",
    presetForceLeft: 200,
    presetForceRight: 0,
    scenarioDescription: "Pulling left to overcome inertia.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_space_push() {
  return <ForceEngine config={{
    initialMass: 100,
    initialVelocity: 0,
    frictionCoefficient: 0,
    environmentName: "Space",
    presetForceLeft: 0,
    presetForceRight: 50,
    scenarioDescription: "Pushing in space: constant acceleration.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_space_coast() {
  return <ForceEngine config={{
    initialMass: 100,
    initialVelocity: 50,
    frictionCoefficient: 0,
    environmentName: "Space",
    presetForceLeft: 0,
    presetForceRight: 0,
    scenarioDescription: "Coasting in space forever.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_train_start() {
  return <ForceEngine config={{
    initialMass: 1000,
    initialVelocity: 0,
    frictionCoefficient: 0.1,
    environmentName: "Tracks",
    presetForceLeft: 0,
    presetForceRight: 500,
    scenarioDescription: "Massive train requires huge force to overcome inertia.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_train_stop() {
  return <ForceEngine config={{
    initialMass: 1000,
    initialVelocity: 30,
    frictionCoefficient: 0.1,
    environmentName: "Tracks",
    presetForceLeft: 500,
    presetForceRight: 0,
    scenarioDescription: "Massive train requires huge force to stop (inertia of motion).",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_coin_flick() {
  return <ForceEngine config={{
    initialMass: 1,
    initialVelocity: 0,
    frictionCoefficient: 0.15,
    environmentName: "Cardboard",
    presetForceLeft: 0,
    presetForceRight: 50,
    scenarioDescription: "Flicking a coin: high force, low mass.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_book_slide() {
  return <ForceEngine config={{
    initialMass: 3,
    initialVelocity: 5,
    frictionCoefficient: 0.25,
    environmentName: "Desk",
    presetForceLeft: 0,
    presetForceRight: 0,
    scenarioDescription: "Book sliding on a desk until friction stops it.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_hovercraft() {
  return <ForceEngine config={{
    initialMass: 80,
    initialVelocity: 0,
    frictionCoefficient: 0.005,
    environmentName: "Air Cushion",
    presetForceLeft: 0,
    presetForceRight: 10,
    scenarioDescription: "Hovercraft coasting with almost no friction.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

