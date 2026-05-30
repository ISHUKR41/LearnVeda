import React, { ComponentType } from "react";
import dynamic from "next/dynamic";

const Sim_balanced_ice = dynamic(() => import('./Topic1').then(mod => mod.Sim_balanced_ice), { ssr: false });
const Sim_unbalanced_ice = dynamic(() => import('./Topic1').then(mod => mod.Sim_unbalanced_ice), { ssr: false });
const Sim_balanced_wood = dynamic(() => import('./Topic1').then(mod => mod.Sim_balanced_wood), { ssr: false });
const Sim_unbalanced_wood = dynamic(() => import('./Topic1').then(mod => mod.Sim_unbalanced_wood), { ssr: false });
const Sim_balanced_space = dynamic(() => import('./Topic1').then(mod => mod.Sim_balanced_space), { ssr: false });
const Sim_unbalanced_space = dynamic(() => import('./Topic1').then(mod => mod.Sim_unbalanced_space), { ssr: false });
const Sim_heavy_balanced = dynamic(() => import('./Topic1').then(mod => mod.Sim_heavy_balanced), { ssr: false });
const Sim_heavy_unbalanced = dynamic(() => import('./Topic1').then(mod => mod.Sim_heavy_unbalanced), { ssr: false });
const Sim_light_balanced = dynamic(() => import('./Topic1').then(mod => mod.Sim_light_balanced), { ssr: false });
const Sim_light_unbalanced = dynamic(() => import('./Topic1').then(mod => mod.Sim_light_unbalanced), { ssr: false });
const Sim_tug_of_war_tie = dynamic(() => import('./Topic1').then(mod => mod.Sim_tug_of_war_tie), { ssr: false });
const Sim_tug_of_war_win = dynamic(() => import('./Topic1').then(mod => mod.Sim_tug_of_war_win), { ssr: false });
const Sim_extreme_balanced = dynamic(() => import('./Topic1').then(mod => mod.Sim_extreme_balanced), { ssr: false });
const Sim_extreme_unbalanced = dynamic(() => import('./Topic1').then(mod => mod.Sim_extreme_unbalanced), { ssr: false });
const Sim_micro_forces = dynamic(() => import('./Topic1').then(mod => mod.Sim_micro_forces), { ssr: false });
const Sim_inertia_rest = dynamic(() => import('./Topic2').then(mod => mod.Sim_inertia_rest), { ssr: false });
const Sim_inertia_motion_space = dynamic(() => import('./Topic2').then(mod => mod.Sim_inertia_motion_space), { ssr: false });
const Sim_inertia_heavy = dynamic(() => import('./Topic2').then(mod => mod.Sim_inertia_heavy), { ssr: false });
const Sim_inertia_light = dynamic(() => import('./Topic2').then(mod => mod.Sim_inertia_light), { ssr: false });
const Sim_friction_stop = dynamic(() => import('./Topic2').then(mod => mod.Sim_friction_stop), { ssr: false });
const Sim_ice_slide = dynamic(() => import('./Topic2').then(mod => mod.Sim_ice_slide), { ssr: false });
const Sim_sudden_push = dynamic(() => import('./Topic2').then(mod => mod.Sim_sudden_push), { ssr: false });
const Sim_sudden_pull = dynamic(() => import('./Topic2').then(mod => mod.Sim_sudden_pull), { ssr: false });
const Sim_space_push = dynamic(() => import('./Topic2').then(mod => mod.Sim_space_push), { ssr: false });
const Sim_space_coast = dynamic(() => import('./Topic2').then(mod => mod.Sim_space_coast), { ssr: false });
const Sim_train_start = dynamic(() => import('./Topic2').then(mod => mod.Sim_train_start), { ssr: false });
const Sim_train_stop = dynamic(() => import('./Topic2').then(mod => mod.Sim_train_stop), { ssr: false });
const Sim_coin_flick = dynamic(() => import('./Topic2').then(mod => mod.Sim_coin_flick), { ssr: false });
const Sim_book_slide = dynamic(() => import('./Topic2').then(mod => mod.Sim_book_slide), { ssr: false });
const Sim_hovercraft = dynamic(() => import('./Topic2').then(mod => mod.Sim_hovercraft), { ssr: false });
const Sim_fma_standard = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_standard), { ssr: false });
const Sim_fma_double_mass = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_double_mass), { ssr: false });
const Sim_fma_double_force = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_double_force), { ssr: false });
const Sim_fma_friction = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_friction), { ssr: false });
const Sim_fma_heavy_friction = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_heavy_friction), { ssr: false });
const Sim_fma_micro = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_micro), { ssr: false });
const Sim_fma_macro = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_macro), { ssr: false });
const Sim_fma_opposing = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_opposing), { ssr: false });
const Sim_fma_braking = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_braking), { ssr: false });
const Sim_fma_rocket = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_rocket), { ssr: false });
const Sim_fma_asteroid = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_asteroid), { ssr: false });
const Sim_fma_bullet = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_bullet), { ssr: false });
const Sim_fma_tug = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_tug), { ssr: false });
const Sim_fma_equilibrium = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_equilibrium), { ssr: false });
const Sim_fma_breakaway = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_breakaway), { ssr: false });
const Sim_action_reaction_push = dynamic(() => import('./Topic4').then(mod => mod.Sim_action_reaction_push), { ssr: false });
const Sim_recoil_gun = dynamic(() => import('./Topic4').then(mod => mod.Sim_recoil_gun), { ssr: false });
const Sim_rocket_launch = dynamic(() => import('./Topic4').then(mod => mod.Sim_rocket_launch), { ssr: false });
const Sim_swimmer_wall = dynamic(() => import('./Topic4').then(mod => mod.Sim_swimmer_wall), { ssr: false });
const Sim_walking_friction = dynamic(() => import('./Topic4').then(mod => mod.Sim_walking_friction), { ssr: false });
const Sim_ice_skater = dynamic(() => import('./Topic4').then(mod => mod.Sim_ice_skater), { ssr: false });
const Sim_bird_flight = dynamic(() => import('./Topic4').then(mod => mod.Sim_bird_flight), { ssr: false });
const Sim_boat_jump = dynamic(() => import('./Topic4').then(mod => mod.Sim_boat_jump), { ssr: false });
const Sim_balloon_air = dynamic(() => import('./Topic4').then(mod => mod.Sim_balloon_air), { ssr: false });
const Sim_firehose = dynamic(() => import('./Topic4').then(mod => mod.Sim_firehose), { ssr: false });
const Sim_hammer_nail = dynamic(() => import('./Topic4').then(mod => mod.Sim_hammer_nail), { ssr: false });
const Sim_car_tires = dynamic(() => import('./Topic4').then(mod => mod.Sim_car_tires), { ssr: false });
const Sim_spring_push = dynamic(() => import('./Topic4').then(mod => mod.Sim_spring_push), { ssr: false });
const Sim_magnet_repel = dynamic(() => import('./Topic4').then(mod => mod.Sim_magnet_repel), { ssr: false });
const Sim_cannon_fire = dynamic(() => import('./Topic4').then(mod => mod.Sim_cannon_fire), { ssr: false });
const Sim_momentum_heavy = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_heavy), { ssr: false });
const Sim_momentum_fast = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_fast), { ssr: false });
const Sim_momentum_collision = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_collision), { ssr: false });
const Sim_momentum_stop = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_stop), { ssr: false });
const Sim_momentum_bullet = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_bullet), { ssr: false });
const Sim_momentum_train = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_train), { ssr: false });
const Sim_momentum_change = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_change), { ssr: false });
const Sim_momentum_braking = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_braking), { ssr: false });
const Sim_momentum_zero = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_zero), { ssr: false });
const Sim_momentum_asteroid = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_asteroid), { ssr: false });
const Sim_momentum_pingpong = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_pingpong), { ssr: false });
const Sim_momentum_impulse1 = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_impulse1), { ssr: false });
const Sim_momentum_impulse2 = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_impulse2), { ssr: false });
const Sim_momentum_reverse = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_reverse), { ssr: false });
const Sim_momentum_constant = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_constant), { ssr: false });

export const SIMULATION_REGISTRY: Record<string, ComponentType<any>> = {
  "balanced-ice": Sim_balanced_ice,
  "unbalanced-ice": Sim_unbalanced_ice,
  "balanced-wood": Sim_balanced_wood,
  "unbalanced-wood": Sim_unbalanced_wood,
  "balanced-space": Sim_balanced_space,
  "unbalanced-space": Sim_unbalanced_space,
  "heavy-balanced": Sim_heavy_balanced,
  "heavy-unbalanced": Sim_heavy_unbalanced,
  "light-balanced": Sim_light_balanced,
  "light-unbalanced": Sim_light_unbalanced,
  "tug-of-war-tie": Sim_tug_of_war_tie,
  "tug-of-war-win": Sim_tug_of_war_win,
  "extreme-balanced": Sim_extreme_balanced,
  "extreme-unbalanced": Sim_extreme_unbalanced,
  "micro-forces": Sim_micro_forces,
  "inertia-rest": Sim_inertia_rest,
  "inertia-motion-space": Sim_inertia_motion_space,
  "inertia-heavy": Sim_inertia_heavy,
  "inertia-light": Sim_inertia_light,
  "friction-stop": Sim_friction_stop,
  "ice-slide": Sim_ice_slide,
  "sudden-push": Sim_sudden_push,
  "sudden-pull": Sim_sudden_pull,
  "space-push": Sim_space_push,
  "space-coast": Sim_space_coast,
  "train-start": Sim_train_start,
  "train-stop": Sim_train_stop,
  "coin-flick": Sim_coin_flick,
  "book-slide": Sim_book_slide,
  "hovercraft": Sim_hovercraft,
  "fma-standard": Sim_fma_standard,
  "fma-double-mass": Sim_fma_double_mass,
  "fma-double-force": Sim_fma_double_force,
  "fma-friction": Sim_fma_friction,
  "fma-heavy-friction": Sim_fma_heavy_friction,
  "fma-micro": Sim_fma_micro,
  "fma-macro": Sim_fma_macro,
  "fma-opposing": Sim_fma_opposing,
  "fma-braking": Sim_fma_braking,
  "fma-rocket": Sim_fma_rocket,
  "fma-asteroid": Sim_fma_asteroid,
  "fma-bullet": Sim_fma_bullet,
  "fma-tug": Sim_fma_tug,
  "fma-equilibrium": Sim_fma_equilibrium,
  "fma-breakaway": Sim_fma_breakaway,
  "action-reaction-push": Sim_action_reaction_push,
  "recoil-gun": Sim_recoil_gun,
  "rocket-launch": Sim_rocket_launch,
  "swimmer-wall": Sim_swimmer_wall,
  "walking-friction": Sim_walking_friction,
  "ice-skater": Sim_ice_skater,
  "bird-flight": Sim_bird_flight,
  "boat-jump": Sim_boat_jump,
  "balloon-air": Sim_balloon_air,
  "firehose": Sim_firehose,
  "hammer-nail": Sim_hammer_nail,
  "car-tires": Sim_car_tires,
  "spring-push": Sim_spring_push,
  "magnet-repel": Sim_magnet_repel,
  "cannon-fire": Sim_cannon_fire,
  "momentum-heavy": Sim_momentum_heavy,
  "momentum-fast": Sim_momentum_fast,
  "momentum-collision": Sim_momentum_collision,
  "momentum-stop": Sim_momentum_stop,
  "momentum-bullet": Sim_momentum_bullet,
  "momentum-train": Sim_momentum_train,
  "momentum-change": Sim_momentum_change,
  "momentum-braking": Sim_momentum_braking,
  "momentum-zero": Sim_momentum_zero,
  "momentum-asteroid": Sim_momentum_asteroid,
  "momentum-pingpong": Sim_momentum_pingpong,
  "momentum-impulse1": Sim_momentum_impulse1,
  "momentum-impulse2": Sim_momentum_impulse2,
  "momentum-reverse": Sim_momentum_reverse,
  "momentum-constant": Sim_momentum_constant,
};

interface SimulationRendererProps {
  simulationIds: string[];
}

export default function SimulationRenderer({ simulationIds }: SimulationRendererProps) {
  if (!simulationIds || simulationIds.length === 0) return null;

  return (
    <div className="flex flex-col gap-8 my-8">
      {simulationIds.map((id) => {
        const SimulationComponent = SIMULATION_REGISTRY[id];
        if (!SimulationComponent) {
          console.warn(`Simulation with ID ${id} not found in registry.`);
          return null;
        }
        return <SimulationComponent key={id} />;
      })}
    </div>
  );
}
