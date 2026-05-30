const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'frontend/src/components/simulations');

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR, { recursive: true });
}

// Ensure engine exists
const engineDir = path.join(DIR, 'engine');
if (!fs.existsSync(engineDir)) fs.mkdirSync(engineDir, { recursive: true });

const topics = [
  {
    name: "Topic1",
    prefix: "balanced",
    titleBase: "Balanced & Unbalanced Forces",
    scenarios: [
      { id: "balanced-ice", env: "Ice Surface", mu: 0.05, m: 50, fL: 50, fR: 50, desc: "Balanced forces on a slippery ice surface." },
      { id: "unbalanced-ice", env: "Ice Surface", mu: 0.05, m: 50, fL: 20, fR: 50, desc: "Unbalanced forces on ice. Watch it accelerate easily." },
      { id: "balanced-wood", env: "Wooden Floor", mu: 0.3, m: 50, fL: 100, fR: 100, desc: "High friction wooden floor with balanced strong forces." },
      { id: "unbalanced-wood", env: "Wooden Floor", mu: 0.3, m: 50, fL: 50, fR: 150, desc: "Overcoming static friction on wood." },
      { id: "balanced-space", env: "Deep Space", mu: 0, m: 100, fL: 10, fR: 10, desc: "Zero friction in space. Balanced forces keep it stationary." },
      { id: "unbalanced-space", env: "Deep Space", mu: 0, m: 100, fL: 0, fR: 10, desc: "Even a tiny force causes constant acceleration in space." },
      { id: "heavy-balanced", env: "Concrete", mu: 0.6, m: 100, fL: 200, fR: 200, desc: "A heavy object with strong balanced forces." },
      { id: "heavy-unbalanced", env: "Concrete", mu: 0.6, m: 100, fL: 0, fR: 200, desc: "Trying to move a heavy object. Friction fights back!" },
      { id: "light-balanced", env: "Glass", mu: 0.01, m: 5, fL: 2, fR: 2, desc: "Delicate balanced forces on a light object." },
      { id: "light-unbalanced", env: "Glass", mu: 0.01, m: 5, fL: 0, fR: 10, desc: "Light object shoots off quickly due to high acceleration." },
      { id: "tug-of-war-tie", env: "Mud", mu: 0.5, m: 70, fL: 150, fR: 150, desc: "A perfect tie in tug of war." },
      { id: "tug-of-war-win", env: "Mud", mu: 0.5, m: 70, fL: 100, fR: 180, desc: "Right side winning the tug of war." },
      { id: "extreme-balanced", env: "Asphalt", mu: 0.8, m: 80, fL: 500, fR: 500, desc: "Extreme forces, perfectly balanced." },
      { id: "extreme-unbalanced", env: "Asphalt", mu: 0.8, m: 80, fL: 0, fR: 500, desc: "Massive unbalanced force." },
      { id: "micro-forces", env: "Air Table", mu: 0.001, m: 1, fL: 0, fR: 1, desc: "Micro forces on an air table." }
    ]
  },
  {
    name: "Topic2",
    prefix: "firstlaw",
    titleBase: "Newton's First Law (Inertia)",
    scenarios: [
      { id: "inertia-rest", env: "Tabletop", mu: 0.2, m: 10, fL: 0, fR: 0, desc: "Object at rest stays at rest until acted upon." },
      { id: "inertia-motion-space", env: "Space", mu: 0, m: 50, fL: 0, fR: 0, v: 10, desc: "Object in motion stays in motion with no friction." },
      { id: "inertia-heavy", env: "Warehouse", mu: 0.4, m: 500, fL: 0, fR: 100, desc: "High mass means high inertia. Hard to start moving." },
      { id: "inertia-light", env: "Warehouse", mu: 0.4, m: 5, fL: 0, fR: 100, desc: "Low mass means low inertia. Easy to start moving." },
      { id: "friction-stop", env: "Grass", mu: 0.8, m: 20, fL: 0, fR: 0, v: 20, desc: "Friction is the unbalanced force that stops the object." },
      { id: "ice-slide", env: "Ice", mu: 0.02, m: 20, fL: 0, fR: 0, v: 10, desc: "Low friction means it keeps moving for a long time." },
      { id: "sudden-push", env: "Floor", mu: 0.3, m: 30, fL: 0, fR: 200, desc: "A sudden unbalanced force overcomes inertia of rest." },
      { id: "sudden-pull", env: "Floor", mu: 0.3, m: 30, fL: 200, fR: 0, desc: "Pulling left to overcome inertia." },
      { id: "space-push", env: "Space", mu: 0, m: 100, fL: 0, fR: 50, desc: "Pushing in space: constant acceleration." },
      { id: "space-coast", env: "Space", mu: 0, m: 100, fL: 0, fR: 0, v: 50, desc: "Coasting in space forever." },
      { id: "train-start", env: "Tracks", mu: 0.1, m: 1000, fL: 0, fR: 500, desc: "Massive train requires huge force to overcome inertia." },
      { id: "train-stop", env: "Tracks", mu: 0.1, m: 1000, fL: 500, fR: 0, v: 30, desc: "Massive train requires huge force to stop (inertia of motion)." },
      { id: "coin-flick", env: "Cardboard", mu: 0.15, m: 1, fL: 0, fR: 50, desc: "Flicking a coin: high force, low mass." },
      { id: "book-slide", env: "Desk", mu: 0.25, m: 3, fL: 0, fR: 0, v: 5, desc: "Book sliding on a desk until friction stops it." },
      { id: "hovercraft", env: "Air Cushion", mu: 0.005, m: 80, fL: 0, fR: 10, desc: "Hovercraft coasting with almost no friction." }
    ]
  },
  {
    name: "Topic3",
    prefix: "secondlaw",
    titleBase: "Newton's Second Law (F=ma)",
    scenarios: [
      { id: "fma-standard", env: "Lab", mu: 0, m: 10, fL: 0, fR: 50, desc: "F = 50, m = 10. Acceleration should be 5 m/s²." },
      { id: "fma-double-mass", env: "Lab", mu: 0, m: 20, fL: 0, fR: 50, desc: "Double the mass, half the acceleration (2.5 m/s²)." },
      { id: "fma-double-force", env: "Lab", mu: 0, m: 10, fL: 0, fR: 100, desc: "Double the force, double the acceleration (10 m/s²)." },
      { id: "fma-friction", env: "Wood", mu: 0.2, m: 10, fL: 0, fR: 50, desc: "Net force is Applied - Friction. F_net = ma." },
      { id: "fma-heavy-friction", env: "Rubber", mu: 0.8, m: 10, fL: 0, fR: 50, desc: "High friction might prevent acceleration completely!" },
      { id: "fma-micro", env: "Vacuum", mu: 0, m: 0.1, fL: 0, fR: 1, desc: "Small mass, small force. High acceleration." },
      { id: "fma-macro", env: "Space", mu: 0, m: 1000, fL: 0, fR: 1000, desc: "Large mass, large force. F=ma scales up." },
      { id: "fma-opposing", env: "Ice", mu: 0, m: 20, fL: 30, fR: 70, desc: "Net force is 40N right. a = 40/20 = 2 m/s²." },
      { id: "fma-braking", env: "Road", mu: 0.6, m: 50, fL: 100, fR: 0, v: 20, desc: "Force applied against motion. Negative acceleration." },
      { id: "fma-rocket", env: "Space", mu: 0, m: 100, fL: 0, fR: 300, desc: "Rocket thruster: constant high force." },
      { id: "fma-asteroid", env: "Space", mu: 0, m: 5000, fL: 0, fR: 100, desc: "Tiny force on massive asteroid. Very slow acceleration." },
      { id: "fma-bullet", env: "Air", mu: 0.01, m: 0.05, fL: 0, fR: 500, desc: "Huge force on tiny mass. Massive acceleration." },
      { id: "fma-tug", env: "Ice", mu: 0.1, m: 60, fL: 120, fR: 100, desc: "Net force left. Accelerates left." },
      { id: "fma-equilibrium", env: "Floor", mu: 0.3, m: 10, fL: 0, fR: 20, desc: "Applied force (20N) is less than max static friction (29.4N). a = 0." },
      { id: "fma-breakaway", env: "Floor", mu: 0.3, m: 10, fL: 0, fR: 30, desc: "Applied force (30N) just overcomes static friction (29.4N). a > 0." }
    ]
  },
  {
    name: "Topic4",
    prefix: "thirdlaw",
    titleBase: "Newton's Third Law",
    scenarios: [
      { id: "action-reaction-push", env: "Space", mu: 0, m: 50, fL: 0, fR: 100, desc: "Pushing a wall: The wall pushes back. (Simulated as force on object)" },
      { id: "recoil-gun", env: "Lab", mu: 0.1, m: 5, fL: 200, fR: 0, desc: "Gun recoils backward when firing bullet forward." },
      { id: "rocket-launch", env: "Space", mu: 0, m: 200, fL: 0, fR: 500, desc: "Rocket pushes gas back, gas pushes rocket forward." },
      { id: "swimmer-wall", env: "Pool", mu: 0.05, m: 60, fL: 0, fR: 150, desc: "Swimmer pushes wall, wall pushes swimmer." },
      { id: "walking-friction", env: "Road", mu: 0.5, m: 70, fL: 0, fR: 50, desc: "Foot pushes ground back, ground pushes person forward." },
      { id: "ice-skater", env: "Ice", mu: 0.01, m: 55, fL: 0, fR: 30, desc: "Skater throws object, moves backward." },
      { id: "bird-flight", env: "Air", mu: 0.1, m: 2, fL: 0, fR: 10, desc: "Wings push air down, air pushes bird up/forward." },
      { id: "boat-jump", env: "Water", mu: 0.05, m: 80, fL: 100, fR: 0, desc: "Jumping off boat: you go forward, boat goes backward." },
      { id: "balloon-air", env: "Air", mu: 0.02, m: 0.5, fL: 0, fR: 5, desc: "Air rushes out of balloon, balloon flies forward." },
      { id: "firehose", env: "Ground", mu: 0.4, m: 40, fL: 300, fR: 0, desc: "Water shoots forward, hose pushes backward." },
      { id: "hammer-nail", env: "Wood", mu: 0.8, m: 1, fL: 0, fR: 200, desc: "Hammer hits nail, nail stops hammer." },
      { id: "car-tires", env: "Asphalt", mu: 0.7, m: 1000, fL: 0, fR: 800, desc: "Tires push road backward, road pushes car forward." },
      { id: "spring-push", env: "Track", mu: 0.01, m: 10, fL: 0, fR: 100, desc: "Compressed spring releases against block." },
      { id: "magnet-repel", env: "Track", mu: 0.05, m: 5, fL: 0, fR: 40, desc: "Magnets push each other apart." },
      { id: "cannon-fire", env: "Ground", mu: 0.3, m: 500, fL: 1000, fR: 0, desc: "Cannon fires ball, cannon rolls back." }
    ]
  },
  {
    name: "Topic5",
    prefix: "momentum",
    titleBase: "Conservation of Momentum",
    scenarios: [
      { id: "momentum-heavy", env: "Ice", mu: 0.01, m: 100, fL: 0, fR: 0, v: 10, desc: "High mass, low velocity = high momentum." },
      { id: "momentum-fast", env: "Ice", mu: 0.01, m: 10, fL: 0, fR: 0, v: 100, desc: "Low mass, high velocity = high momentum." },
      { id: "momentum-collision", env: "Track", mu: 0.05, m: 50, fL: 0, fR: 0, v: 20, desc: "Momentum p = mv = 50 * 20 = 1000 kg m/s." },
      { id: "momentum-stop", env: "Track", mu: 0.5, m: 50, fL: 0, fR: 0, v: 20, desc: "Friction reduces momentum over time." },
      { id: "momentum-bullet", env: "Air", mu: 0.01, m: 0.02, fL: 0, fR: 0, v: 500, desc: "Tiny mass, huge velocity. p = 10 kg m/s." },
      { id: "momentum-train", env: "Rail", mu: 0.05, m: 5000, fL: 0, fR: 0, v: 5, desc: "Huge mass, small velocity. p = 25000 kg m/s." },
      { id: "momentum-change", env: "Ice", mu: 0.01, m: 20, fL: 0, fR: 50, v: 5, desc: "Force changes momentum (Impulse = F * t)." },
      { id: "momentum-braking", env: "Road", mu: 0.8, m: 100, fL: 200, fR: 0, v: 30, desc: "Negative force reduces momentum." },
      { id: "momentum-zero", env: "Space", mu: 0, m: 100, fL: 0, fR: 0, v: 0, desc: "Zero velocity = zero momentum." },
      { id: "momentum-asteroid", env: "Space", mu: 0, m: 10000, fL: 0, fR: 0, v: 2, desc: "Massive momentum, hard to stop." },
      { id: "momentum-pingpong", env: "Table", mu: 0.1, m: 0.005, fL: 0, fR: 0, v: 15, desc: "Very low momentum." },
      { id: "momentum-impulse1", env: "Ice", mu: 0, m: 10, fL: 0, fR: 100, v: 0, desc: "High force applies large impulse quickly." },
      { id: "momentum-impulse2", env: "Ice", mu: 0, m: 10, fL: 0, fR: 10, v: 0, desc: "Low force applies small impulse." },
      { id: "momentum-reverse", env: "Ice", mu: 0, m: 20, fL: 100, fR: 0, v: 20, desc: "Reversing momentum requires large impulse." },
      { id: "momentum-constant", env: "Space", mu: 0, m: 50, fL: 0, fR: 0, v: 15, desc: "Momentum is perfectly conserved with zero net force." }
    ]
  }
];

let registryExports = 'import React, { ComponentType } from "react";\nimport dynamic from "next/dynamic";\n\n';
let registryMap = 'export const SIMULATION_REGISTRY: Record<string, ComponentType<any>> = {\n';

topics.forEach(topic => {
  let fileContent = 'import React from "react";\nimport ForceEngine from "./engine/ForceEngine";\n\n';
  
  topic.scenarios.forEach(sc => {
    const componentName = "Sim_" + sc.id.replace(/-/g, '_');
    fileContent += "export function " + componentName + "() {\n" +
"  return <ForceEngine config={{\n" +
"    initialMass: " + sc.m + ",\n" +
"    initialVelocity: " + (sc.v || 0) + ",\n" +
"    frictionCoefficient: " + sc.mu + ",\n" +
"    environmentName: \"" + sc.env + "\",\n" +
"    presetForceLeft: " + sc.fL + ",\n" +
"    presetForceRight: " + sc.fR + ",\n" +
"    scenarioDescription: \"" + sc.desc + "\",\n" +
"    allowUserMassChange: false,\n" +
"    allowUserForceChange: true\n" +
"  }} />\n" +
"}\n\n";
    
    // Add to registry
    registryExports += "const " + componentName + " = dynamic(() => import('./" + topic.name + "').then(mod => mod." + componentName + "), { ssr: false });\n";
    registryMap += "  \"" + sc.id + "\": " + componentName + ",\n";
  });
  
  fs.writeFileSync(path.join(DIR, topic.name + '.tsx'), fileContent);
});

registryMap += "};\n\n";

registryExports += "\n" + registryMap;
registryExports += `interface SimulationRendererProps {
  simulationIds: string[];
}

export default function SimulationRenderer({ simulationIds }: SimulationRendererProps) {
  if (!simulationIds || simulationIds.length === 0) return null;

  return (
    <div className="flex flex-col gap-8 my-8">
      {simulationIds.map((id) => {
        const SimulationComponent = SIMULATION_REGISTRY[id];
        if (!SimulationComponent) {
          console.warn(\`Simulation with ID \${id} not found in registry.\`);
          return null;
        }
        return <SimulationComponent key={id} />;
      })}
    </div>
  );
}
`;

fs.writeFileSync(path.join(DIR, 'SimulationRegistry.tsx'), registryExports);
console.log("Successfully generated 75 simulations and registry!");
