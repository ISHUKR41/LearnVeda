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

![Figure 1: The rocket pushes exhaust gases backward (Action), and the gases push the rocket forward with equal force (Reaction).](/images/third_law_rocket.png)


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

![Figure 2: Gun recoil is the equal and opposite reaction force acting on the heavier gun when a bullet is accelerated forward.](/images/gun_recoil.png)


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

    /* ══════════════════════════════════════════
     *  5 MORE MCQ QUESTIONS (Total: 10 MCQ)
     * ══════════════════════════════════════════ */
    {
      id: "t4q21",
      type: "mcq",
      points: 10,
      question:
        "When a boat is rowed, the oar pushes water backward. The boat moves forward because of:",
      options: [
        "The weight of the water displaced",
        "Newton's Third Law — water pushes the oar (and boat) forward",
        "The wind pushing the boat",
        "Gravity pulling the boat downstream",
      ],
      correctAnswer:
        "Newton's Third Law — water pushes the oar (and boat) forward",
      explanation:
        "Action: oar pushes water backward. Reaction: water pushes oar (and through it, the boat) forward. This is a classic Third Law application in marine propulsion.",
    },
    {
      id: "t4q22",
      type: "mcq",
      points: 10,
      question:
        "A person leans against a wall. The wall does not fall because:",
      options: [
        "The wall has no inertia",
        "The person's weight is transferred to the floor, not the wall",
        "The wall exerts a reaction force equal and opposite to the person's push",
        "The wall is fixed to the ground by gravity alone",
      ],
      correctAnswer:
        "The wall exerts a reaction force equal and opposite to the person's push",
      explanation:
        "The person pushes the wall horizontally (action). The wall pushes back equally (reaction). These forces balance, so neither moves. The wall transmits the force through its structure to the foundation.",
    },
    {
      id: "t4q23",
      type: "mcq",
      points: 10,
      question:
        "A gun of mass 3 kg fires a bullet of mass 30 g at 600 m/s. The recoil velocity of the gun is:",
      options: ["6 m/s", "60 m/s", "0.6 m/s", "600 m/s"],
      correctAnswer: "6 m/s",
      explanation:
        "By momentum conservation: m_gun × v_gun = m_bullet × v_bullet → 3 × v = 0.03 × 600 = 18 → v = 18/3 = 6 m/s backward. The gun recoils at 6 m/s in the opposite direction to the bullet.",
    },
    {
      id: "t4q24",
      type: "mcq",
      points: 10,
      question:
        "Which of the following is NOT an action-reaction pair?",
      options: [
        "Earth pulling a ball down and ball pulling Earth up",
        "A book on a table: gravity pulling book down and table pushing book up",
        "Hammer hitting nail and nail pushing hammer back",
        "Swimmer pushing water back and water pushing swimmer forward",
      ],
      correctAnswer:
        "A book on a table: gravity pulling book down and table pushing book up",
      explanation:
        "Gravity (Earth pulls book) and normal force (table pushes book) act on the SAME object (the book) — they are balanced forces, not an action-reaction pair. The correct pairs are: Earth pulls book / book pulls Earth; and table pushes book / book pushes table.",
    },
    {
      id: "t4q25",
      type: "mcq",
      points: 10,
      question:
        "An inflated balloon is released without tying its mouth. It flies around the room because:",
      options: [
        "Air outside pushes the balloon",
        "The balloon pushes air out backward, and by Newton's Third Law, air pushes balloon forward",
        "The rubber contracts and pushes the balloon",
        "Gravity accelerates the balloon",
      ],
      correctAnswer:
        "The balloon pushes air out backward, and by Newton's Third Law, air pushes balloon forward",
      explanation:
        "The compressed air inside escapes from the mouth (balloon pushes air backward — action). The escaping air pushes the balloon forward (reaction). This is the same principle as a rocket engine.",
    },

    /* ══════════════════════════════════════════
     *  5 MORE SHORT ANSWER (Total: 10 Short)
     * ══════════════════════════════════════════ */
    {
      id: "t4q26",
      type: "short",
      points: 15,
      question:
        "When you hit a table with your hand, your hand also hurts. Explain this using Newton's Third Law.",
      correctAnswer:
        "When you hit the table, your hand exerts a force on the table (action). By Newton's Third Law, the table exerts an equal and opposite force on your hand (reaction). This reaction force is what causes pain in your hand. The harder you hit the table (greater action force), the greater the reaction force on your hand — and the more it hurts. Both forces are equal in magnitude, simultaneous, and opposite in direction.",
      explanation:
        "Classic Third Law example — the table 'hits back' with the same force you used. The pain is evidence of the reaction force.",
    },
    {
      id: "t4q27",
      type: "short",
      points: 15,
      question:
        "Why does a person stepping out of a boat cause the boat to move backward? Explain with Newton's Third Law.",
      correctAnswer:
        "When a person steps forward from a boat onto the shore, their foot pushes the boat backward (action). By Newton's Third Law, the boat pushes the person forward (reaction), helping them reach the shore. The boat moves backward because the person's push applies a force on it. On water, there is very little friction, so even a small force makes the boat move noticeably. This is why boats drift away from the dock when passengers step off carelessly.",
      explanation:
        "The person pushes the boat backward (action) and the boat pushes the person forward (reaction). Low friction on water means the boat moves noticeably.",
    },
    {
      id: "t4q28",
      type: "short",
      points: 15,
      question:
        "Explain how a squid or octopus uses Newton's Third Law to move through water.",
      correctAnswer:
        "A squid takes in water and then forcefully expels it backward through a siphon (jet of water — action). By Newton's Third Law, the water pushes the squid forward with an equal and opposite force (reaction). This is called jet propulsion — the same principle as a rocket engine but using water instead of exhaust gases. The squid can control the direction of its siphon to steer, and the force of expulsion to control speed. Some squids can reach speeds of 40 km/h using this method.",
      explanation:
        "Jet propulsion in marine animals — Third Law applied naturally. Water expelled backward = animal propelled forward. Same physics as rockets.",
    },
    {
      id: "t4q29",
      type: "short",
      points: 15,
      question:
        "Two ice skaters standing face to face push each other. Skater A (40 kg) and Skater B (80 kg) push off. Who moves faster and why?",
      correctAnswer:
        "By Newton's Third Law, the push force on both skaters is equal and opposite. But by Newton's Second Law (a = F/m), the lighter skater accelerates more. Skater A (40 kg): a = F/40 → larger acceleration. Skater B (80 kg): a = F/80 → half the acceleration of A. Since force acts for the same time on both, by momentum conservation: 40 × v_A = 80 × v_B → v_A = 2 × v_B. Skater A moves at twice the speed of Skater B. The lighter skater always moves faster when equal forces act.",
      explanation:
        "Equal forces (Third Law), different masses → different accelerations (Second Law). Lighter skater moves faster. Momentum conservation confirms: lighter = faster.",
    },
    {
      id: "t4q30",
      type: "short",
      points: 15,
      question:
        "Why does a garden sprinkler rotate? Explain using Newton's Third Law.",
      correctAnswer:
        "A garden sprinkler has angled nozzles that eject water in a specific direction (action — water pushed outward). By Newton's Third Law, the water exerts an equal and opposite reaction force on the nozzle, pushing it in the opposite direction. Since the nozzles are angled tangentially on a rotating base, these reaction forces create a torque (turning effect) that makes the sprinkler spin. The faster the water flow or more angled the nozzles, the faster the sprinkler rotates. This is the same principle used in reaction turbines and Hero's engine (aeolipile).",
      explanation:
        "Water exits tangentially (action), nozzle is pushed opposite (reaction). The angled nozzles convert this reaction into rotational motion — a practical Third Law device.",
    },

    /* ══════════════════════════════════════════
     *  5 MORE LONG ANSWER (Total: 10 Long)
     * ══════════════════════════════════════════ */
    {
      id: "t4q31",
      type: "long",
      points: 20,
      question:
        "Explain in detail how ALL three of Newton's Laws work together during a car's normal operation — starting, cruising, and braking.",
      correctAnswer:
        "**STARTING (Accelerating from rest):**\n\n- Third Law: Engine spins the wheels. Tires push backward on the road (action). Road pushes tires forward (reaction) — this reaction is the driving force.\n- Second Law: The forward reaction force minus all resistive forces (air drag, rolling friction) = net force. a = F_net/m. The car accelerates proportionally to this net force.\n- First Law: Before the engine started, the car was at rest and remained so (no unbalanced force). Once the engine provides force, the state changes.\n\n**CRUISING (Constant velocity):**\n\n- Third Law: Tires still push road backward, road pushes forward. This driving force exactly equals air drag + friction.\n- First Law: Net force = 0 (driving force = resistive forces). By First Law, velocity stays constant. No acceleration.\n- Second Law: F = ma → F = 0 → a = 0. Confirms constant velocity.\n\n**BRAKING (Decelerating to rest):**\n\n- Third Law: Brake pads push against brake disc (action). Disc pushes back on pads (reaction). This creates friction that opposes wheel rotation.\n- The ground now pushes backward on the tires (friction from braking) — this is the external force decelerating the car.\n- Second Law: Net force is backward (braking force > driving force). a = F_brake/m → negative acceleration → car slows down.\n- First Law: When velocity reaches zero and brakes hold, net force = 0 again → car stays at rest.\n\nAll three laws operate simultaneously during every phase of a car's operation.",
      explanation:
        "Comprehensive analysis showing all three laws in three different driving phases. This demonstrates that Newton's laws are not separate — they work as an integrated system.",
    },
    {
      id: "t4q32",
      type: "long",
      points: 20,
      question:
        "A rocket has a mass of 10,000 kg (including fuel). Its engines eject exhaust gases at 3000 m/s with a mass flow rate of 50 kg/s. Calculate: (a) the thrust, (b) the initial acceleration, (c) the acceleration after 100 seconds (when 5000 kg of fuel has been burnt).",
      correctAnswer:
        "(a) **Thrust:**\nThrust = mass flow rate × exhaust velocity = 50 × 3000 = 150,000 N = 150 kN\n\n(b) **Initial acceleration:**\nWeight = mg = 10,000 × 10 = 100,000 N downward\nNet upward force = Thrust − Weight = 150,000 − 100,000 = 50,000 N\nAcceleration = F/m = 50,000/10,000 = 5 m/s²\n\n(c) **After 100 seconds:**\nFuel burnt = 50 × 100 = 5000 kg\nRemaining mass = 10,000 − 5000 = 5000 kg\nWeight now = 5000 × 10 = 50,000 N\nThrust remains = 150,000 N (same engine, same fuel burn rate)\nNet force = 150,000 − 50,000 = 100,000 N\nAcceleration = 100,000/5000 = 20 m/s²\n\n**Key insight:** The acceleration QUADRUPLED (from 5 to 20 m/s²) as fuel was burnt! This is because:\n1. Mass decreased by half → acceleration doubles (from F/m)\n2. Net force also increased (weight decreased while thrust stayed constant)\n\nThis is why rockets accelerate faster as they burn fuel — Newton's Second Law with changing mass.",
      explanation:
        "Full numerical calculation showing the dramatic acceleration increase as fuel is consumed. This is a real rocket engineering principle — rockets accelerate fastest just before fuel exhaustion.",
    },
    {
      id: "t4q33",
      type: "long",
      points: 20,
      question:
        "Describe in detail how Newton's Third Law is used in: (a) jet engines in airplanes, (b) helicopter rotors, and (c) submarines. For each, identify the action and reaction forces clearly.",
      correctAnswer:
        "**(a) Jet Engines:**\nAction: The engine compresses air, mixes it with fuel, ignites it, and expels hot exhaust gases backward at very high speed.\nReaction: The exhaust gases push the engine (and airplane) forward with equal force.\nThe airplane flies forward due to this continuous reaction force. More fuel burned per second or faster exhaust = more thrust = faster airplane.\n\n**(b) Helicopter Rotors:**\nAction: The spinning rotor blades push air DOWNWARD (downwash).\nReaction: The air pushes the rotor blades (and helicopter) UPWARD — this is lift.\nFor hovering: Lift (reaction) = Weight of helicopter (balanced).\nFor climbing: Rotor speed increases → more air pushed down → greater upward reaction → net upward force → helicopter rises.\nIMPORTANT: The rotor also creates a torque on the helicopter body. Without a tail rotor (which pushes air sideways), the helicopter body would spin opposite to the main rotor — also a Third Law effect!\n\n**(c) Submarines:**\nAction: The propeller pushes water backward.\nReaction: Water pushes propeller (and submarine) forward.\nFor depth control: Ballast tanks fill with water (increase weight → sink) or compressed air (decrease weight → rise). The buoyancy force is a reaction to displaced water pressure.\n\nAll three use the same fundamental principle: push a fluid backward, get pushed forward.",
      explanation:
        "Three different applications of the same Third Law principle with different fluids and contexts. The helicopter tail rotor detail shows an advanced understanding of rotational Third Law effects.",
    },
    {
      id: "t4q34",
      type: "long",
      points: 20,
      question:
        "A girl (40 kg) and a boy (60 kg) are standing on two separate skateboards facing each other on a smooth floor. The girl pushes the boy. After the push, the boy moves backward at 2 m/s. Find the velocity of the girl. Also calculate the force if the push lasted 0.5 seconds.",
      correctAnswer:
        "**Using momentum conservation (from Third Law):**\nInitial total momentum = 0 (both at rest)\nFinal total momentum = 0 (momentum is conserved)\n\nBoy's momentum = 60 × 2 = 120 kg·m/s (backward)\nGirl's momentum must be 120 kg·m/s (forward) to make total zero.\n\nGirl's velocity = 120/40 = **3 m/s forward**\n\n**Force calculation:**\nImpulse on boy = change in momentum = 60 × 2 = 120 kg·m/s\nF × t = 120\nF = 120/0.5 = **240 N**\n\nBy Newton's Third Law, the girl also experiences 240 N (in opposite direction).\n\n**Verification:**\nImpulse on girl = F × t = 240 × 0.5 = 120 kg·m/s\nGirl's velocity = 120/40 = 3 m/s ✓\n\n**Key observations:**\n- Same force on both (Third Law: 240 N each)\n- Girl moves faster (3 m/s vs 2 m/s) because she's lighter (Second Law: a = F/m)\n- Total momentum remains zero — the system's center of mass stays in place",
      explanation:
        "Complete numerical problem using momentum conservation, impulse, and Newton's Third Law. The verification step confirms consistency. The observation about center of mass is a bonus insight.",
    },
    {
      id: "t4q35",
      type: "long",
      points: 20,
      question:
        "Explain why it is impossible to pull yourself up by your own shoelaces or hair. Use Newton's Third Law to explain. Then explain how the Baron Munchausen story (pulling himself out of a swamp by his own hair) violates physics.",
      correctAnswer:
        "**Why you can't pull yourself up:**\n\nWhen you pull your shoelaces upward (action), the shoelaces pull your hand downward (reaction — Third Law). But BOTH forces act on the SAME system (your body). The upward pull on the shoelaces is transmitted through the shoelaces back to your feet, while the reaction pulls your hand down.\n\nNet force analysis:\n- Your hand pulls up with force F\n- Your feet (via shoelaces) are pulled up with force F\n- BUT the reaction: shoelaces pull your hand down with force F\n- Your body weight pulls you down with force mg\n\nThe internal forces (hand pulling laces up, laces pulling hand down) cancel because they are within the same system. The only external force is gravity (downward). You cannot generate an external upward force by pulling on yourself.\n\n**The Baron Munchausen Fallacy:**\nThe famous story says Baron Munchausen pulled himself (and his horse!) out of a swamp by his own hair. This violates Newton's Third Law because:\n\n1. His hand pulls hair upward (force on hair = part of his body)\n2. Hair pulls hand downward (reaction — force on hand = part of his body)\n3. These are internal forces within the same body — they cancel\n4. No external upward force is generated\n5. Only external forces (gravity down, swamp resistance) act on him\n6. Without an external upward force, he cannot rise\n\n**How you CAN get out:** You need something EXTERNAL to push against — a tree branch, solid ground, a rope tied to something outside you. The external object provides the reaction force that your own body cannot.",
      explanation:
        "This elegantly demonstrates the internal vs. external force distinction. Internal forces within a system always cancel — you need an external reaction to change your system's motion. The Baron Munchausen story is a famous physics-violating tale.",
    },

    /* ══════════════════════════════════════════
     *  5 MORE THINKING/HOTS (Total: 10 HOTS)
     * ══════════════════════════════════════════ */
    {
      id: "t4q36",
      type: "thinking",
      points: 25,
      question:
        "HOTS: Earth pulls an apple with gravitational force. By Newton's Third Law, the apple also pulls Earth. If the forces are equal, why does the apple fall to Earth and not Earth rise to the apple?",
      correctAnswer:
        "The forces ARE equal — this is Newton's Third Law, no exceptions.\n\nApple pulls Earth upward: F = mg (same force)\nEarth pulls apple downward: F = mg\n\nBut by Newton's Second Law (a = F/m):\n\nApple (mass ≈ 0.1 kg): a_apple = F/0.1 = mg/0.1 = g ≈ 10 m/s² (large acceleration downward)\n\nEarth (mass ≈ 6 × 10²⁴ kg): a_Earth = F/(6×10²⁴) = (0.1 × 10)/(6×10²⁴) = 1.67 × 10⁻²⁵ m/s² (impossibly tiny acceleration upward)\n\nThe apple accelerates at 10 m/s² downward. Earth accelerates at 0.000000000000000000000000167 m/s² upward.\n\nIn the time the apple falls 1 metre, Earth moves approximately 10⁻²⁵ metres — less than the diameter of a single proton!\n\nBoth bodies DO accelerate toward each other. But the mass ratio is about 6 × 10²⁵:1. So while the apple moves noticeably, Earth's motion is completely immeasurable.\n\n**Technically:** Every time you drop anything, Earth rises an immeasurably tiny amount to meet it. Newton's Third Law is satisfied perfectly — but the mass asymmetry makes only the apple's motion visible.",
      explanation:
        "Equal forces but vastly different masses → vastly different accelerations. The Earth DOES move toward the apple — just by an amount smaller than atomic dimensions. This is Third Law + Second Law working together.",
    },
    {
      id: "t4q37",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A student says: 'Newton's Third Law means nothing can ever accelerate, because for every forward force there's an equal backward force.' Explain why this student is wrong.",
      correctAnswer:
        "The student makes the classic mistake of thinking action and reaction act on the SAME object. They don't!\n\n**Why the student is wrong:**\n\nAction and reaction forces act on DIFFERENT objects. They cannot cancel each other because cancellation requires forces on the SAME body.\n\n**Example — Person walking:**\n- Person pushes ground backward (action on ground)\n- Ground pushes person forward (reaction on person)\n\nThe forward force on the PERSON is the only horizontal force on the person → person accelerates forward. The backward force on the GROUND is absorbed by Earth's enormous mass → negligible effect.\n\nEach object has its own net force analysis:\n- Person: forward force from ground − friction/air = net forward → accelerates\n- Ground: backward force from person + all other forces → negligible effect due to huge mass\n\n**If the student were right:** Nothing in the universe could move. No cars, no rockets, no people, no planets. Everything would be frozen. Since things clearly DO move, the student's interpretation must be wrong.\n\n**The correct understanding:** Forces in an action-reaction pair act on different objects. For any SINGLE object, you only count forces acting ON that object. If those forces are unbalanced, the object accelerates.",
      explanation:
        "The fundamental error: thinking action-reaction forces act on the same body. They act on different bodies and cannot cancel for either one individually.",
    },
    {
      id: "t4q38",
      type: "thinking",
      points: 25,
      question:
        "HOTS: In a collision between a heavy truck and a light car, the car gets badly damaged while the truck barely shows a dent. But Newton's Third Law says the forces are equal! How can the damage be so different if the forces are equal?",
      correctAnswer:
        "**The forces ARE equal** — Newton's Third Law has no exceptions.\n\nTruck pushes car backward with force F.\nCar pushes truck backward with exactly the same force F.\n\n**Why damage is different:**\n\n**1. Different accelerations (F = ma):**\nCar (1000 kg): a = F/1000 → large deceleration → large velocity change\nTruck (10,000 kg): a = F/10,000 → small deceleration → small velocity change\n\nThe car experiences 10× more deceleration. The passengers and structure undergo much more violent changes in motion.\n\n**2. Different structural capacity:**\nThe same force F distributed over the truck's massive, heavy frame → relatively low stress per unit area. The truck's heavier structure can absorb this force.\nThe same force F applied to the car's lighter, smaller frame → much higher stress per unit area → exceeds material strength → crumpling and damage.\n\n**3. Different kinetic energy changes:**\nThe car loses much more kinetic energy in the collision (larger velocity change). This energy goes into deforming the car's structure — hence more visible damage.\n\n**Analogy:** Step on a concrete block with 500 N → no damage. Step on a cardboard box with 500 N → box crumples. Same force, different structural strength.\n\n**Key lesson:** Equal forces do NOT mean equal effects. The EFFECT depends on the mass, structure, and material properties of each object.",
      explanation:
        "Equal forces, unequal effects. Mass difference → different accelerations. Structural capacity difference → different damage levels. Force equality is about magnitude, not consequences.",
    },
    {
      id: "t4q39",
      type: "thinking",
      points: 25,
      question:
        "HOTS: Design a thought experiment to prove that Newton's Third Law is always true — even when one object is moving and another is stationary, or when objects have very different masses.",
      correctAnswer:
        "**Thought Experiment: The Space Scale**\n\nImagine two astronauts (A: 50 kg, B: 100 kg) floating motionless in space, connected by a spring scale (force meter) between them.\n\n**Test 1 — A pushes B:**\nA pushes B through the scale. The scale shows 200 N.\nQuestion: What force does B exert on A?\n\nThe scale reads 200 N on BOTH sides because the scale measures the tension in it — which is the same at both ends (Newton's Third Law). A pushes with 200 N on B; B pushes with 200 N on A.\n\nResult: A (lighter) accelerates away at a_A = 200/50 = 4 m/s²\nB (heavier) accelerates away at a_B = 200/100 = 2 m/s²\nA moves faster (Third Law: equal forces, Second Law: different masses).\n\n**Test 2 — Both push simultaneously:**\nBoth push each other with maximum effort. The scale still reads the same on both sides — always equal, always opposite.\n\n**Test 3 — Moving bodies:**\nA is moving at 5 m/s toward stationary B. They collide through the spring scale. During collision, the scale reads the same on both sides at every instant.\n\n**Why this proves Third Law universally:**\nThe spring scale is a physical measurement device between the two bodies. It cannot show different forces on its two ends (that would violate its own structural physics). In every test — different masses, moving or stationary, pushing or pulling — the scale confirms equal and opposite forces.\n\n**Real-world equivalent:** This is actually how force plates in physics labs work. Two surfaces connected by sensors always measure equal forces on both sides.",
      explanation:
        "The spring scale thought experiment provides direct physical evidence of force equality regardless of mass difference or motion state. It cannot show different readings on two ends — confirming the Third Law universally.",
    },
    {
      id: "t4q40",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A magician claims he can stand on a platform and levitate by pushing down on the platform with his hands while pulling up with his feet (since his feet are attached to the platform with straps). Can he fly? Analyze using Newton's Third Law and the concept of internal vs. external forces.",
      correctAnswer:
        "**The magician CANNOT fly.** Here's why:\n\n**System analysis:**\nThe magician + platform form a single system. All forces between the magician and platform are INTERNAL forces.\n\n**What happens when he pushes down with hands:**\n- Hands push platform down (action on platform)\n- Platform pushes hands up (reaction on hands)\n- These are internal forces — they cancel within the system\n\n**What happens when he pulls up with feet:**\n- Feet pull platform up (via straps — action on platform)\n- Platform pulls feet down (reaction on feet)\n- These are also internal forces — they cancel within the system\n\n**Net internal force on the system = 0**\n(Every push/pull within the system has an equal-opposite counterpart)\n\n**The only external force = Gravity (downward)**\n\nSince gravity is the only unbalanced external force, the system (magician + platform) will accelerate downward — it will fall, not levitate!\n\n**This is the 'Bootstrap Paradox':**\nYou cannot lift yourself by your own bootstraps (or any part of yourself). Internal forces always cancel. You need an EXTERNAL force to change your system's motion.\n\n**How real levitation tricks work:** Hidden wires (external upward force), electromagnetic platforms (external magnetic force), or compressed air jets (Third Law reaction from ejected air — an external interaction).\n\n**Key principle:** No system can accelerate without an external force. Internal forces, no matter how clever, always cancel within the system. This is a direct consequence of Newton's Third Law applied to systems.",
      explanation:
        "This is the definitive internal-vs-external force problem. The magician-platform system has only internal forces between its parts — these cancel. Only external forces (gravity, or a hidden wire) can change the system's motion. No internal trick can generate flight.",
    },
  ],
};
