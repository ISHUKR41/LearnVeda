/**
 * FILE: topic-4-third-law-of-motion.ts
 * LOCATION: src/lib/content/class9/science/force-and-laws-of-motion/topic-4-third-law-of-motion.ts
 * PURPOSE: Deep, richly detailed content for Topic 4 — Newton's Third Law of Motion.
 *          Covers action-reaction pairs, mutual forces, and applications in walking,
 *          swimming, rockets, guns, and everyday life. 20 categorized questions.
 * CURRICULUM: CBSE Class 9 Science, Chapter 9 — Force & Laws of Motion
 * LAST UPDATED: 2026-05-28
 */
import { Topic } from "./types";

export const thirdLawOfMotion: Topic = {
  id: "third-law-of-motion",
  title: "4. Newton's Third Law of Motion: Action and Reaction",
  estimatedMinutes: 35,
  imageUrl:
    "https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?auto=format&fit=crop&q=80&w=1200",

  content: `
### The Most Surprising Law in Physics

If you think about Newton's First and Second Laws, they seem straightforward — force causes motion changes. But the Third Law is genuinely mind-bending when you first encounter it.

Sit quietly and think: **You are sitting on a chair right now. You are pushing down on the chair. Is the chair pushing back up on you?**

The answer is YES — with exactly the same force you push down with. This chair-vs-you interaction is the Third Law in action, happening everywhere, every second.

---

### Newton's Third Law — The Official Statement

> **"For every action, there is an equal and opposite reaction."**

Or more precisely:

> **"Whenever object A exerts a force on object B, object B simultaneously exerts an equal and opposite force on object A."**

Mathematically:
$$\vec{F}_{AB} = -\vec{F}_{BA}$$

Where:
* $\vec{F}_{AB}$ = force exerted BY A ON B (the action)
* $\vec{F}_{BA}$ = force exerted BY B ON A (the reaction)

The negative sign means the reaction force is exactly **opposite in direction** but equal in **magnitude**.

---

### Three Critical Points You MUST Understand

#### Point 1: Action and Reaction ALWAYS Occur Simultaneously

There is no time delay. The moment A pushes B, B pushes back on A at the EXACT same instant.

#### Point 2: Action and Reaction Forces Act on DIFFERENT Objects

This is the most commonly misunderstood point!
* Force A on B acts on **B**
* Force B on A acts on **A**

They NEVER cancel each other out because they act on different bodies.

#### Point 3: The Forces Are Equal in Magnitude, Opposite in Direction

If you push a wall with 50 N, the wall pushes you back with exactly 50 N. No exceptions.

---

### Why Action-Reaction Forces Do NOT Cancel Out

Balanced forces cancel because they act on the **SAME** object. Action-reaction pairs act on **DIFFERENT** objects — so they cannot cancel for any single object.

**Example:** A horse pulls a cart.
* Horse pulls cart forward → acts **on the cart**
* Cart pulls horse backward → acts **on the horse**

Each body has its own net force analysis. The cart accelerates forward if horse-pull exceeds wheel friction. The horse moves forward if its leg-push against the ground exceeds the cart's backward pull.

---

### How a Rocket Works in Space (No Air Needed!)

> "How can a rocket move in space? There is nothing to push against!"

The rocket does NOT push against space. Here is what actually happens:

1. Burning fuel creates hot, high-pressure gases.
2. The rocket **pushes gases backward** out of its nozzle — this is the ACTION.
3. The gases **push the rocket forward** with equal force — this is the REACTION.
4. The rocket accelerates forward via $F = ma$.

The rocket pushes its own exhaust gases. No external surface is needed. This is pure Newton's Third Law.

$$\text{Thrust} = \dot{m} \times v_{exhaust}$$

where $\dot{m}$ is mass of gas ejected per second. Faster ejection or more gas per second = greater thrust.

---

### Walking — Third Law in Every Step

How do you walk forward? Not by pushing your foot forward — that's the wrong mental picture.

1. Your foot pushes **backward** on the ground — ACTION.
2. Ground pushes your foot (and you) **forward** — REACTION.
3. This forward reaction force propels you!

**Why you can't walk on ice:** On a frictionless surface your foot slides backward — there's no traction for the ground to push you forward. Same physics as rocket in space but in reverse: no grip = no reaction.

**Same principle:** Swimming (hands push water back, water pushes swimmer forward), rowing (oar pushes water backward, water pushes boat forward), bird flight (wings push air down, air pushes bird up).

---

### Gun Recoil — Third Law with Mass Difference

When a gun fires:
* Gun pushes bullet **forward** (action) → bullet travels far at high speed
* Bullet pushes gun **backward** (reaction) → gun recoils slowly

Same force, but $a = F/m$:
* Bullet (0.01 kg) → huge forward acceleration → very fast
* Gun (1.5 kg) → small backward acceleration → gentle kick

Equal forces, very different accelerations because of mass ratio.

---

### Action-Reaction in Everyday Life

| Situation | Action | Reaction |
|---|---|---|
| Swimming | Hands push water backward | Water pushes swimmer forward |
| Rocket launch | Rocket pushes gas backward | Gas pushes rocket forward |
| Walking | Foot pushes ground backward | Ground pushes foot forward |
| Jumping | Legs push ground down | Ground pushes body up |
| Gun firing | Gun pushes bullet forward | Bullet pushes gun backward |
| Balloon released | Balloon pushes air out | Air pushes balloon forward |
| Rowing | Oar pushes water back | Water pushes boat forward |

---

### The Horse and Cart Paradox — Fully Solved

A horse pulls a cart. The cart pulls the horse backward equally. So how does the system move?

**Forces on the HORSE:**
1. Cart pulls horse backward (Third Law reaction)
2. Ground pushes horse **forward** (reaction to horse's hooves pushing backward)

If ground reaction > cart pull → net force on horse is FORWARD.

**Forces on the CART:**
1. Horse pulls cart forward
2. Wheel friction acts backward

If horse pull > friction → net force on cart is FORWARD.

The system moves because **external forces** (ground pushing horse, friction on wheels) determine motion — not the internal horse-cart pair. The internal pair is equal-and-opposite, but external forces create the net result.

---

### Balloon Rocket — The Simplest Demonstration

Blow up a balloon, hold it closed, then release. It flies wildly!
* Balloon pushes air out backward (action)
* Air pushes balloon forward (reaction)

Same physics as a rocket engine! The balloon's erratic path shows why rocket nozzles are precision-engineered — to direct thrust in one straight line.

---

### Newton's Third Law in Architecture

The weight of a building presses down on the foundation (action). The ground pushes the foundation upward with equal force (reaction). Net force = 0 → building stands still. If the ground's reaction force is insufficient (earthquakes, soft soil), the building sinks or collapses.
  `,

  questions: [
    /* ── 5 MCQs ── */
    {
      id: "t4q1",
      type: "mcq",
      points: 10,
      question: "You push a wall with 80 N. The wall pushes back on you with:",
      options: ["40 N", "0 N (walls cannot push)", "80 N", "160 N"],
      correctAnswer: "80 N",
      explanation:
        "Newton's Third Law: for every action there is an equal and opposite reaction. The wall exerts exactly 80 N back on you — that's why you feel resistance when you push.",
    },
    {
      id: "t4q2",
      type: "mcq",
      points: 10,
      question:
        "A rocket works in space even with no air to push against. This is best explained by:",
      options: [
        "Newton's First Law — objects in motion stay in motion",
        "Newton's Third Law — the rocket pushes exhaust gases backward, gases push rocket forward",
        "Gravity pulling the rocket forward",
        "Magnetic forces between rocket and stars",
      ],
      correctAnswer:
        "Newton's Third Law — the rocket pushes exhaust gases backward, gases push rocket forward",
      explanation:
        "The rocket pushes its own exhaust gases backward (action). By Newton's Third Law, the gases push the rocket forward with equal force (reaction). No external medium needed.",
    },
    {
      id: "t4q3",
      type: "mcq",
      points: 10,
      question:
        "Action and reaction forces in Newton's Third Law always act on:",
      options: [
        "The same object in opposite directions",
        "Different objects",
        "The same object in the same direction",
        "Stationary objects only",
      ],
      correctAnswer: "Different objects",
      explanation:
        "Action force acts ON B (from A). Reaction force acts ON A (from B). Since they act on different bodies, they cannot cancel each other — that's why systems can still accelerate.",
    },
    {
      id: "t4q4",
      type: "mcq",
      points: 10,
      question:
        "A swimmer pushes water backward with their arms. The swimmer moves forward because:",
      options: [
        "Water has no friction",
        "Water pushes the swimmer forward with an equal and opposite force",
        "The swimmer's weight decreases in water",
        "Buoyancy provides the forward force",
      ],
      correctAnswer:
        "Water pushes the swimmer forward with an equal and opposite force",
      explanation:
        "Action: swimmer's arms push water backward. Reaction: water pushes swimmer forward with equal force. This reaction force propels the swimmer.",
    },
    {
      id: "t4q5",
      type: "mcq",
      points: 10,
      question:
        "When you jump, you push Earth downward. Why does Earth not visibly move?",
      options: [
        "Earth is too far away to be affected",
        "Newton's Third Law doesn't apply to Earth",
        "Same force, Earth's huge mass gives it negligibly tiny acceleration",
        "The ground absorbs the force completely",
      ],
      correctAnswer:
        "Same force, Earth's huge mass gives it negligibly tiny acceleration",
      explanation:
        "Forces are equal but F = ma. Earth (6×10²⁴ kg) gets acceleration ≈ 10⁻²³ m/s² — completely undetectable. You (60 kg) get a large upward acceleration. Same force, incomparably different masses.",
    },

    /* ── 5 Short Answer ── */
    {
      id: "t4q6",
      type: "short",
      points: 15,
      question:
        "State Newton's Third Law of Motion. Identify the action and reaction pair when a person pushes off a wall.",
      correctAnswer:
        "Newton's Third Law: For every action force, there is an equal and opposite reaction force acting on a different body. Person-Wall: ACTION — person pushes the wall forward (with hands). REACTION — wall pushes the person backward with equal force. The person moves backward; the wall stays fixed.",
      explanation:
        "Statement + both forces identified with directions + which body each acts on.",
    },
    {
      id: "t4q7",
      type: "short",
      points: 15,
      question:
        "Why can't you walk on a perfectly frictionless surface? Use Newton's Third Law.",
      correctAnswer:
        "To walk, your foot pushes backward on the ground (action). The ground's reaction pushes you forward. On a frictionless surface, your foot cannot grip — it slides backward without transmitting force, so the ground provides no useful forward reaction. You cannot generate forward motion.",
      explanation:
        "Friction is needed to make the backward push work and generate the forward reaction. Without it, no reaction = no forward motion.",
    },
    {
      id: "t4q8",
      type: "short",
      points: 15,
      question:
        "Explain why action and reaction forces do NOT cancel each other out, even though they are equal and opposite.",
      correctAnswer:
        "Balanced forces cancel because they act on the SAME object. Action and reaction forces act on DIFFERENT objects — action on B, reaction on A. Since they act on different bodies, they cannot cancel for any single object. Each body has its own separate net force analysis.",
      explanation:
        "The key distinction: balanced forces (same object) vs action-reaction (different objects).",
    },
    {
      id: "t4q9",
      type: "short",
      points: 15,
      question: "Explain how a fish swims using Newton's Third Law.",
      correctAnswer:
        "A fish moves its tail/fins to push water backward (action). By Newton's Third Law, the water pushes the fish forward with equal and opposite force (reaction). The fish uses this forward reaction to propel itself through the water.",
      explanation:
        "Action-reaction pair clearly identified: fish pushes water back, water pushes fish forward.",
    },
    {
      id: "t4q10",
      type: "short",
      points: 15,
      question:
        "A gun (mass 2 kg) fires a bullet (mass 0.02 kg) at 400 m/s forward. What is the recoil velocity of the gun?",
      correctAnswer:
        "Using momentum conservation (consistent with Newton's Third Law): Initial total momentum = 0. Bullet momentum = 0.02 × 400 = 8 kg·m/s forward. Gun momentum = −8 kg·m/s. Recoil velocity = 8/2 = 4 m/s backward. The gun's much larger mass (100× bullet) means 100× less recoil speed.",
      explanation:
        "Momentum conservation: initial p = 0 → bullet momentum + gun momentum = 0. Gun recoils at 4 m/s backward.",
    },

    /* ── 5 Long Answer ── */
    {
      id: "t4q11",
      type: "long",
      points: 20,
      question:
        "Identify all Newton's Third Law action-reaction pairs in: (a) walking, (b) swimming, and (c) a rocket launch. For each, specify which body exerts the force and which receives it.",
      correctAnswer:
        "(a) WALKING: Action — foot pushes ground backward-downward. Reaction — ground pushes foot (person) forward-upward. Without friction (slippery floor), the ground cannot provide this horizontal reaction, so walking fails. (b) SWIMMING: Action — hands push water backward. Reaction — water pushes hands/body forward. More forceful push = stronger reaction = faster swimming. (c) ROCKET: Action — burning fuel in chamber pushes exhaust gases backward through nozzle at high speed. Reaction — exhaust gases push rocket forward. No external surface needed. More gas ejected per second (or faster ejection speed) = greater thrust = greater acceleration.",
      explanation:
        "All three must have clearly identified action and reaction with bodies specified. For rockets, the self-contained nature (no external surface needed) must be mentioned.",
    },
    {
      id: "t4q12",
      type: "long",
      points: 20,
      question:
        "Explain the Horse and Cart Paradox: if the cart pulls the horse backward with the same force the horse pulls the cart forward, how does the system ever move?",
      correctAnswer:
        "The horse-cart pull is an internal force pair — equal and opposite within the system. The system moves because of EXTERNAL forces. FORCES ON HORSE: (1) Cart pulls horse backward. (2) Ground pushes horse forward (reaction to horse's hooves pushing backward on ground). If ground reaction > cart pull → net force on horse is FORWARD. FORCES ON CART: (1) Horse pulls cart forward. (2) Wheel friction backward. If horse pull > friction → net force on cart is FORWARD. The horse-cart internal pair cannot determine system motion — only external forces do. On ice (no traction), the horse cannot generate ground reaction → system cannot move, confirming that external forces are decisive.",
      explanation:
        "Internal vs external forces analysis. Forces on EACH body separately. Ground reaction on horse is the key external force. Ice example confirms the analysis.",
    },
    {
      id: "t4q13",
      type: "long",
      points: 20,
      question:
        "Explain how birds fly using Newton's Third Law. Identify all action-reaction pairs for a bird in steady horizontal flight.",
      correctAnswer:
        "VERTICAL: Wings flap downward, pushing air downward (action). Air pushes wings upward — LIFT (reaction). For steady altitude: Lift = Weight (balanced vertical forces). HORIZONTAL: Muscular wing movement generates thrust forward. Air resistance (drag) acts backward. For constant speed: Thrust = Drag (balanced horizontal forces). ADDITIONAL: The aerofoil shape of wings creates faster airflow above and slower below → pressure difference adds to lift (Bernoulli effect combined with Third Law reaction). Four forces in steady flight: Lift upward = Weight downward; Thrust forward = Drag backward. All balanced → constant velocity.",
      explanation:
        "All four forces: Lift, Weight, Thrust, Drag. Each Third Law pair must be identified. Balanced condition for steady level flight must be stated.",
    },
    {
      id: "t4q14",
      type: "long",
      points: 20,
      question:
        "A person (60 kg) standing in a boat (120 kg) on still water jumps to the shore at 2 m/s. Use Newton's Third Law and momentum conservation to find the boat's recoil velocity.",
      correctAnswer:
        "THIRD LAW: Person pushes backward on boat (action). Boat pushes person forward (reaction). Equal and opposite forces → equal and opposite impulses → equal and opposite momentum changes. MOMENTUM CONSERVATION: Initial momentum = 0 (both at rest). Person's final momentum = 60 × 2 = 120 kg·m/s forward. Boat's momentum must be −120 kg·m/s. Boat's recoil velocity = 120/120 = 1 m/s backward. The boat (2× the person's mass) moves at half the speed of the person. This inverse mass-velocity relationship is a direct consequence of Newton's Third Law and momentum conservation.",
      explanation:
        "Third Law qualitative + momentum conservation quantitative. The inverse mass-speed relationship should be noted.",
    },
    {
      id: "t4q15",
      type: "long",
      points: 20,
      question:
        "A fire hose ejects water at 50 m/s with a mass flow rate of 20 kg/s. Calculate the recoil force on the hose. Why do fire services use two firefighters to hold the hose?",
      correctAnswer:
        "THIRD LAW: Hose pushes water forward (action). Water pushes hose backward with equal force (reaction) — this is recoil. CALCULATION: Recoil force = rate of change of momentum = mass flow rate × ejection velocity = 20 kg/s × 50 m/s = 1000 N. PRACTICAL: 1000 N ≈ weight of a 100 kg person — a very large continuous backward push. A single firefighter (typically 70-80 kg) cannot safely resist this without being pushed backward or losing control. Two firefighters together provide combined body weight and friction force to resist and aim the hose. Additionally, the hose must be aimed precisely at the fire — holding it steady under 1000 N requires teamwork.",
      explanation:
        "Third Law identification + calculation using F = mass flow rate × velocity. Connection of calculated 1000 N to the practical requirement for two firefighters.",
    },

    /* ── 5 HOTS / Deep Thinking ── */
    {
      id: "t4q16",
      type: "thinking",
      points: 25,
      question:
        "HOTS: In a tug-of-war, Team A and Team B pull the rope with equal force (Newton's Third Law). Shouldn't it always be a draw? Explain why one team wins.",
      correctAnswer:
        "The rope tension is indeed equal on both sides (Newton's Third Law). But winning depends on EXTERNAL ground friction, not the internal rope tension. For Team A: Net force = Friction_A (forward from ground) − Rope tension T. For Team B: Net force = Friction_B (forward from ground) − Rope tension T. The rope tension T is equal for both. But the ground friction each team generates depends on mass, foot grip, shoe type, body angle, and ground texture. The team with greater ground friction wins because their net forward force is higher. This is why tug-of-war teams: wear specialized grip shoes, dig heels into soft ground, lean backward at low angles (to increase normal force → maximize friction). Newton's Third Law (rope tension equality) is not what decides the winner — external friction with the ground is.",
      explanation:
        "Rope tension equal (Third Law). External ground friction is decisive. Low body angle and grip shoes maximize friction. Force analysis for each team separately.",
    },
    {
      id: "t4q17",
      type: "thinking",
      points: 25,
      question:
        "HOTS: If you punch a wall with full force, your hand hurts but the wall seems unaffected. The wall pushed your hand with the SAME force. So why doesn't the wall 'hurt'?",
      correctAnswer:
        "The forces ARE equal — wall pushes your hand exactly as hard as your hand pushes the wall. The wall's material DOES experience stress and micro-deformation at the contact point. But 'pain' requires a biological nervous system — walls have none. Additionally: your hand is soft tissue with pain receptors. The same 100 N force on a small, nerve-rich hand area → significant pain sensation. On the massive, rigid wall, the force spreads through enormous mass and dense material → no visible damage (usually). PROOF that force exists on the wall: punch a thin drywall or brittle surface — it breaks! The force was always there; it just exceeded the material's structural strength. The wall's apparent indifference is about material properties and pain biology, not force magnitude.",
      explanation:
        "Forces ARE equal. Pain is biological (wall has no nerves). Stress distribution in large rigid body vs. soft tissue. Drywall example proves force exists on wall side.",
    },
    {
      id: "t4q18",
      type: "thinking",
      points: 25,
      question:
        "HOTS: In deep space (no gravity, no friction), an astronaut pushes a spacecraft wall. Analyze using all three Newton's Laws. What happens to each body?",
      correctAnswer:
        "FIRST LAW: Initially both astronaut and spacecraft are at rest — they stay at rest without force. THIRD LAW: Astronaut pushes wall with force F (action). Wall pushes astronaut backward with force F (reaction). Forces are simultaneous, equal, opposite, on different bodies. SECOND LAW for each body: Astronaut (mass m_a): Force = F backward → acceleration = F/m_a backward. After push, astronaut drifts backward at constant velocity forever (no friction to stop them — First Law!). Spacecraft (mass m_s >> m_a): Force = F forward → acceleration = F/m_s forward. Much smaller acceleration than astronaut (larger mass). After push, spacecraft drifts forward at constant velocity forever. Total momentum remains zero (as it was initially) — equal and opposite momenta. CRITICAL: The astronaut cannot return to the spacecraft without another push — there is no air, no friction, nothing to slow them or turn them around.",
      explanation:
        "All three laws explicitly applied in sequence. Third Law for force identification, Second Law for each body's acceleration, First Law for what happens after the push ends (constant velocity forever).",
    },
    {
      id: "t4q19",
      type: "thinking",
      points: 25,
      question:
        "HOTS: Design a 'reaction-powered backpack' using Newton's Third Law. What fluid should you use, at what ejection rate, to lift a 70 kg person? What engineering challenges must be overcome?",
      correctAnswer:
        "PHYSICS REQUIREMENT: To lift 70 kg person, upward thrust must exceed weight. Weight = 70 × 10 = 700 N. Need thrust ≥ 700 N upward. THIRD LAW: Backpack ejects fluid downward (action). Fluid pushes backpack (and person) upward (reaction). Thrust = mass flow rate × ejection speed. FLUID CHOICE: Water: dense, easily available, but heavy tank. Compressed gas (CO2, air): much lighter, higher ejection speeds. For 700 N with CO2 at 500 m/s: mass flow rate = 700/500 = 1.4 kg/s. For a 5-minute flight: total gas = 1.4 × 300 = 420 kg of gas. Too heavy! Solution: liquid nitrogen (boils to gas rapidly) or hydrogen peroxide decomposition (used in real jetpacks). ENGINEERING CHALLENGES: (1) Tank weight vs. flight time trade-off — as fuel ejects, mass decreases, acceleration increases (F=ma). (2) Precision directional nozzles for stable hover and steering. (3) Safety systems for pressure relief. (4) Heat management — hot exhaust gases. This is why real jetpacks (e.g., Martin Jetpack) are engineering marvels using carefully optimized propulsion chemistry.",
      explanation:
        "Third Law principle → force requirement → mass flow calculation → real engineering constraints. Shows how simple Third Law physics encounters real-world challenges.",
    },
    {
      id: "t4q20",
      type: "thinking",
      points: 25,
      question:
        "HOTS: Why do astronauts tether themselves during spacewalks? What happens if an untethered astronaut accidentally pushes a tool away from themselves?",
      correctAnswer:
        "THIRD LAW SCENARIO: Astronaut pushes tool away (action). Tool pushes astronaut in the opposite direction (reaction). Equal forces, different masses → different accelerations (Second Law). Tool (small mass): large velocity in one direction. Astronaut (large mass, ~90 kg with suit): smaller but real velocity in opposite direction. FIRST LAW CONSEQUENCE: In the near-vacuum of space, essentially no friction exists. By Newton's First Law, once the astronaut starts drifting, they continue at constant velocity FOREVER with NOTHING to stop or redirect them. Even a tiny drift of 0.1 m/s means in 1 hour, the astronaut is 360 metres from the spacecraft — a fatal situation. TETHER SOLUTION: The tether acts as a physical link that can transmit a restoring force back to the spacecraft. If the astronaut drifts, the tether pulls taut and provides the reaction force to stop the drift and pull them back. It is literally a lifeline implementing Newton's Third Law as a safety mechanism. All spacewalks require tethers for exactly this reason.",
      explanation:
        "Third Law for force generation (push tool → react away), Second Law for mass-dependent velocities, First Law for why drifting never stops in space. The tether as a Third Law safety device is the key insight.",
    },
  ],
};
