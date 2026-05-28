/**
 * FILE: topic-5-conservation-of-momentum.ts
 * PURPOSE: Deep research content for Topic 5 of Force & Laws of Motion.
 *          Contains highly detailed explanations and 20 categorized questions.
 *          Modularized to ensure production-level scalability and readability.
 */
import { Topic } from "./types";

export const conservationOfMomentum: Topic = {
  /* ═══════════════════════════════════════════
   * TOPIC 5: Conservation of Momentum
     * ═══════════════════════════════════════════ */
      id: 'conservation-of-momentum',
      title: '5. Conservation of Momentum',
      estimatedMinutes: 35,
      imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800',
      content: `
### What is Conservation of Momentum?
The Law of Conservation of Momentum is one of the most powerful principles in all of physics. It says:

> **"When two or more bodies interact, the total momentum of the system remains constant, provided no external unbalanced force acts on it."**

In simple words: **Momentum can be transferred between objects, but it cannot be created or destroyed.**

### The Mathematical Formula

For a collision between two objects:

$$m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2$$

Where:
* $m_1$, $m_2$ = Masses of the two objects
* $u_1$, $u_2$ = Initial velocities (before collision)
* $v_1$, $v_2$ = Final velocities (after collision)

**Total momentum before collision = Total momentum after collision**

### Deriving Conservation from Newton's Third Law

Consider two objects A and B colliding:
1. Object A exerts force $F_{AB}$ on B (action).
2. Object B exerts force $F_{BA}$ on A (reaction).
3. By Newton's Third Law: $F_{AB} = -F_{BA}$ (equal magnitude, opposite direction).
4. By Newton's Second Law: $F = \\frac{\\Delta p}{\\Delta t}$
5. So: $\\frac{\\Delta p_A}{\\Delta t} = -\\frac{\\Delta p_B}{\\Delta t}$
6. This means: $\\Delta p_A + \\Delta p_B = 0$
7. Therefore: **Total momentum does not change!**

### Real-World Examples

#### Billiard (Pool) Balls
When the white cue ball hits a stationary red ball:
- Before: Only the cue ball has momentum. The red ball has zero momentum.
- After: The cue ball slows down or stops (loses momentum). The red ball starts moving (gains momentum).
- **Total momentum is conserved!** What the cue ball lost, the red ball gained.

#### Recoil of a Gun
Before firing: Both bullet and gun are stationary → Total momentum = 0.
After firing: Bullet moves forward (positive momentum) + Gun moves backward (negative momentum) = 0.
The momentum of the bullet forward exactly equals the momentum of the gun backward!

**Example Calculation:**
- Bullet mass = 50 g = 0.05 kg, velocity = 500 m/s forward
- Bullet momentum = 0.05 × 500 = 25 kg·m/s (forward)
- Gun mass = 5 kg
- Gun velocity = ? → 5 × v = -25 → v = -5 m/s (backward)
- The gun recoils backward at 5 m/s.

#### Rocket Propulsion
Before launch: Rocket + fuel are stationary → Total momentum = 0.
After launch: Hot gases move downward (negative momentum) + Rocket moves upward (positive momentum) = 0.
The downward momentum of the exhaust gases exactly equals the upward momentum of the rocket!

### Types of Collisions

#### 1. Elastic Collision
Both momentum AND kinetic energy are conserved. Objects bounce off each other.
* Example: Two hard billiard balls colliding.

#### 2. Inelastic Collision
Only momentum is conserved. Kinetic energy is NOT conserved (some is converted to heat, sound, deformation).
* Example: A car crash where the cars crumple and stick together.

#### 3. Perfectly Inelastic Collision
The objects stick together after collision. Maximum kinetic energy is lost.
* Example: A bullet embedding itself in a wooden block.

### Why is Conservation of Momentum So Important?
This principle applies to EVERYTHING — from subatomic particle collisions in CERN to galaxy mergers in space. It's used in:
- Designing safer cars (crash testing)
- Calculating rocket trajectories
- Solving forensic investigations (bullet analysis)
- Predicting asteroid impacts
      `,
      questions: [
        /* ── MCQs (5) ── */
        {
          id: 'q81', type: 'mcq', points: 10,
          question: 'The law of conservation of momentum states that total momentum is conserved when:',
          options: ['Any force acts on the system', 'No external unbalanced force acts on the system', 'Gravity is present', 'Objects are in contact'],
          correctAnswer: 'No external unbalanced force acts on the system',
          explanation: "Conservation of momentum applies only when there is no net external force on the system."
        },
        {
          id: 'q82', type: 'mcq', points: 10,
          question: 'A 2 kg ball moving at 3 m/s collides with a stationary 1 kg ball. If the 2 kg ball stops, what is the velocity of the 1 kg ball after collision?',
          options: ['3 m/s', '6 m/s', '2 m/s', '1 m/s'],
          correctAnswer: '6 m/s',
          explanation: 'By conservation: 2×3 + 1×0 = 2×0 + 1×v → 6 = v → v = 6 m/s.'
        },
        {
          id: 'q83', type: 'mcq', points: 10,
          question: 'Before firing, a gun and bullet system is at rest. The total momentum after firing is:',
          options: ['Equal to the momentum of the bullet', 'Equal to the momentum of the gun', 'Zero', 'Infinite'],
          correctAnswer: 'Zero',
          explanation: "Initial momentum = 0. By conservation, final momentum must also be 0. The bullet's forward momentum + gun's backward momentum = 0."
        },
        {
          id: 'q84', type: 'mcq', points: 10,
          question: 'In which type of collision is kinetic energy conserved?',
          options: ['Inelastic collision', 'Perfectly inelastic collision', 'Elastic collision', 'All types'],
          correctAnswer: 'Elastic collision',
          explanation: 'Only in elastic collisions is both momentum AND kinetic energy conserved. In inelastic collisions, some kinetic energy is converted to heat, sound, or deformation.'
        },
        {
          id: 'q85', type: 'mcq', points: 10,
          question: 'Conservation of momentum is derived from:',
          options: ["Newton's First Law", "Newton's Second and Third Laws", "Law of Gravitation", "Kepler's Laws"],
          correctAnswer: "Newton's Second and Third Laws",
          explanation: "The derivation uses F = Δp/Δt (Second Law) and action = -reaction (Third Law)."
        },

        /* ── Short Answer (5) ── */
        {
          id: 'q86', type: 'short', points: 15,
          question: 'State the law of conservation of momentum.',
          correctAnswer: "When two or more bodies interact with each other, the sum of their momenta remains constant, provided no external unbalanced force acts on the system. Mathematically: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂.",
          explanation: 'Formal statement with the mathematical expression.'
        },
        {
          id: 'q87', type: 'short', points: 15,
          question: 'Why does a gun recoil when a bullet is fired? Relate it to conservation of momentum.',
          correctAnswer: "Before firing, the total momentum of the gun-bullet system is zero (both at rest). After firing, the bullet gains forward momentum. To conserve total momentum (keep it zero), the gun must gain an equal amount of backward momentum. This backward motion is called recoil.",
          explanation: "Gun recoil as a direct consequence of momentum conservation."
        },
        {
          id: 'q88', type: 'short', points: 15,
          question: 'What is an elastic collision?',
          correctAnswer: "An elastic collision is one in which both momentum and kinetic energy are conserved. The objects bounce off each other without any loss of kinetic energy to heat, sound, or deformation. Example: collision between two hard billiard balls (approximately elastic).",
          explanation: "Definition of elastic collision with example."
        },
        {
          id: 'q89', type: 'short', points: 15,
          question: 'A boy of mass 40 kg jumps out of a stationary boat of mass 80 kg. If the boy jumps at 3 m/s, find the velocity of the boat.',
          correctAnswer: "Initial momentum = 0. Final: 40 × 3 + 80 × v = 0. So 120 + 80v = 0 → v = -1.5 m/s. The boat moves backward at 1.5 m/s.",
          explanation: "Numerical application of conservation of momentum."
        },
        {
          id: 'q90', type: 'short', points: 15,
          question: 'How is conservation of momentum used in rocket propulsion?',
          correctAnswer: "A rocket expels exhaust gases downward at high velocity, giving them large downward momentum. By conservation of momentum, the rocket gains an equal amount of upward momentum. As fuel burns continuously, the rocket keeps gaining upward momentum and accelerates into space.",
          explanation: "Connects conservation of momentum to rocket science."
        },

        /* ── Long Answer (5) ── */
        {
          id: 'q91', type: 'long', points: 20,
          question: "Derive the law of conservation of momentum from Newton's Second and Third Laws.",
          correctAnswer: "Consider two objects A (mass m₁) and B (mass m₂) moving with velocities u₁ and u₂. They collide and after collision move with velocities v₁ and v₂. During collision, A exerts force F_AB on B, and B exerts force F_BA on A. By Newton's Third Law: F_AB = -F_BA. By Newton's Second Law: F = (change in momentum)/time. Force on A: F_BA = m₁(v₁ - u₁)/t. Force on B: F_AB = m₂(v₂ - u₂)/t. Since F_AB = -F_BA: m₂(v₂ - u₂)/t = -m₁(v₁ - u₁)/t. Simplifying: m₂v₂ - m₂u₂ = -m₁v₁ + m₁u₁. Rearranging: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂. This proves total momentum before = total momentum after.",
          explanation: "Complete step-by-step derivation."
        },
        {
          id: 'q92', type: 'long', points: 20,
          question: "A bullet of mass 20 g is fired from a rifle of mass 4 kg with a velocity of 400 m/s. Calculate: (a) the recoil velocity of the rifle, and (b) the total momentum before and after firing.",
          correctAnswer: "(a) Mass of bullet m₁ = 20 g = 0.02 kg. Velocity of bullet v₁ = 400 m/s. Mass of rifle m₂ = 4 kg. Before firing, both are at rest, so u₁ = u₂ = 0. By conservation: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂. 0 + 0 = 0.02 × 400 + 4 × v₂. 0 = 8 + 4v₂. v₂ = -2 m/s. The rifle recoils at 2 m/s in the direction opposite to the bullet. (b) Total momentum before firing = 0. Total momentum after = 0.02 × 400 + 4 × (-2) = 8 - 8 = 0. Total momentum is conserved (remains zero).",
          explanation: "Numerical problem demonstrating conservation of momentum in gun recoil."
        },
        {
          id: 'q93', type: 'long', points: 20,
          question: 'Explain the difference between elastic, inelastic, and perfectly inelastic collisions with examples.',
          correctAnswer: "1. Elastic Collision: Both momentum and kinetic energy are conserved. Objects bounce off each other. Example: Two ideal billiard balls colliding. In reality, perfectly elastic collisions only happen at the atomic/molecular level. 2. Inelastic Collision: Momentum is conserved but kinetic energy is NOT fully conserved. Some KE is converted to heat, sound, or deformation. Example: A car accident where both cars bounce apart but are dented. 3. Perfectly Inelastic Collision: Momentum is conserved but maximum kinetic energy is lost. The objects stick together and move as one body after collision. Example: A bullet embedding in a wooden block, or two trains coupling together.",
          explanation: "Categorizes the three types of collisions with clear distinctions."
        },
        {
          id: 'q94', type: 'long', points: 20,
          question: 'Two objects of equal mass are moving towards each other with equal speeds. If they undergo a perfectly inelastic collision (stick together), what is their final velocity?',
          correctAnswer: "Let mass = m each. Object A moves at speed v (positive direction). Object B moves at speed v (negative direction). Momentum before = mv + m(-v) = mv - mv = 0. After perfectly inelastic collision, they stick together. Combined mass = 2m. Momentum after = 2m × V (where V is the final velocity). By conservation: 0 = 2m × V → V = 0. They come to a complete stop! All kinetic energy is converted to heat, sound, and deformation. This is the maximum energy loss scenario.",
          explanation: "Important special case of perfectly inelastic collision."
        },
        {
          id: 'q95', type: 'long', points: 20,
          question: 'A boy of mass 50 kg running at 4 m/s jumps onto a stationary skateboard of mass 2 kg. What is their combined velocity after he lands on the board?',
          correctAnswer: "Before: Boy momentum = 50 × 4 = 200 kg·m/s. Skateboard momentum = 2 × 0 = 0. Total initial momentum = 200 kg·m/s. After: Boy + skateboard move together (perfectly inelastic). Combined mass = 50 + 2 = 52 kg. By conservation: 200 = 52 × v. v = 200/52 = 3.85 m/s (approximately). The boy and skateboard move together at about 3.85 m/s in the original direction of the boy's motion. Some kinetic energy is lost during the landing impact.",
          explanation: "Real-world application with a numerical calculation."
        },

        /* ── Thinking / HOTS (5) ── */
        {
          id: 'q96', type: 'thinking', points: 25,
          question: "In a fireworks display, a rocket explodes into multiple fragments in mid-air. Is momentum conserved during the explosion? Explain.",
          correctAnswer: "Yes, momentum IS conserved. Before the explosion, the rocket has a certain momentum (mass × velocity). After the explosion, all the fragments fly in different directions. The VECTOR SUM of the momenta of all fragments equals the original momentum of the rocket. If you added up all the momentum vectors of every tiny piece, including the expanding gases, the total would exactly equal the momentum the rocket had just before exploding. Individual pieces may have very different momenta, but the total is conserved because the explosion forces are INTERNAL to the system.",
          explanation: "Tests understanding that conservation applies to the vector sum of all parts."
        },
        {
          id: 'q97', type: 'thinking', points: 25,
          question: "Two ice skaters are facing each other on a frictionless ice rink. Skater A (60 kg) pushes Skater B (40 kg). Both slide apart. If Skater B slides at 3 m/s, how fast does Skater A slide? Who pushes off harder?",
          correctAnswer: "Initial momentum = 0 (both stationary). After push: 60 × vA + 40 × 3 = 0. vA = -120/60 = -2 m/s. Skater A slides backward at 2 m/s. Who pushes harder? NEITHER! By Newton's Third Law, the force Skater A exerts on B equals the force B exerts on A. The forces are equal. Skater B moves faster because she has less mass (a = F/m). Skater A moves slower because he has more mass. But the FORCE is identical on both.",
          explanation: "Combines conservation of momentum with Newton's Third Law."
        },
        {
          id: 'q98', type: 'thinking', points: 25,
          question: 'If you fire a gun while standing on a frictionless frozen lake, and then catch the bullet when it returns (hypothetically), what is your final velocity?',
          correctAnswer: "Your final velocity would be ZERO — you'd end up exactly where you started (ignoring the bullet's travel time). When you fire the bullet, you recoil backward (momentum conservation). When you catch the returning bullet, its forward momentum transfers to you, pushing you forward. The forward push exactly cancels the backward recoil. The total momentum of the system (you + bullet) was zero at the start and must remain zero at the end. So you return to zero velocity at your original position.",
          explanation: "Elegant thought experiment showing momentum conservation is reversible."
        },
        {
          id: 'q99', type: 'thinking', points: 25,
          question: "A loaded railway car (20,000 kg) moving at 5 m/s couples with an empty stationary car (5,000 kg). What is their combined speed? How much kinetic energy was lost?",
          correctAnswer: "By conservation of momentum: 20000 × 5 + 5000 × 0 = 25000 × v. v = 100000/25000 = 4 m/s. Combined speed = 4 m/s. Kinetic energy before = ½ × 20000 × 5² = 250,000 J. Kinetic energy after = ½ × 25000 × 4² = 200,000 J. Energy lost = 250,000 - 200,000 = 50,000 J (20% of the original KE). This energy was converted to heat, sound, and deformation during the coupling impact.",
          explanation: "Complete numerical problem with energy analysis."
        },
        {
          id: 'q100', type: 'thinking', points: 25,
          question: 'Why do spacecraft use "gravitational slingshots" (gravity assists) around planets? Explain using conservation of momentum.',
          correctAnswer: "A gravitational slingshot uses a planet's gravity and orbital momentum to accelerate a spacecraft without using fuel. As a spacecraft approaches a moving planet, the planet's gravity pulls the spacecraft, changing its direction and speed. By conservation of momentum in the planet-spacecraft system: the spacecraft gains momentum (and therefore speed) while the planet loses an imperceptibly tiny amount of momentum. Since the planet is enormously massive, its velocity change is negligible. But for the small spacecraft, the velocity gain is significant. NASA's Voyager probes used this technique to visit multiple planets, gaining speed at each flyby. This is sometimes called a 'free lunch' in space travel!",
          explanation: "Advanced application of momentum conservation in space exploration."
        }
      ]
    };
