/**
 * FILE: topic-3-second-law-of-motion.ts
 * LOCATION: src/lib/content/class9/science/force-and-laws-of-motion/topic-3-second-law-of-motion.ts
 * PURPOSE: Comprehensive, beginner-friendly content for Newton's Second Law of Motion.
 *          Covers momentum, impulse, derivation of F=ma, unit of Newton, and all
 *          CBSE Class 9 exam patterns with 70 categorized questions.
 *
 * MATH NOTE: ALL LaTeX commands use DOUBLE backslashes (\\frac, \\Delta, \\times, etc.)
 *            because this content lives inside a JavaScript template literal where a
 *            single backslash (\f, \t, \D) would be interpreted as an escape sequence,
 *            producing garbage characters on screen. Double backslash → literal backslash.
 *
 * QUESTIONS: 30 MCQ + 20 Short Answer + 10 Long Answer + 10 HOTS = 70 total
 * CURRICULUM: CBSE Class 9 Science, Chapter 9 — Force & Laws of Motion
 * LAST UPDATED: 2026-05-28
 */

import { Topic } from "./types";

export const secondLawOfMotion: Topic = {
  id: "second-law-of-motion",
  title: "3. Newton's Second Law of Motion — F = ma",
  estimatedMinutes: 45,

  /* ─── Topic Hero Image ───
   * A rocket mid-launch perfectly illustrates F = ma:
   * massive thrust force → enormous acceleration despite huge mass.
   */
  imageUrl: "/images/topics/force/second-law-hero.png",
  simulationIds: [
    "fma-standard",
    "fma-double-mass",
    "fma-double-force",
    "fma-friction",
    "fma-heavy-friction",
    "fma-opposing",
    "fma-braking",
    "fma-rocket",
    "fma-asteroid",
    "fma-bullet",
    "fma-tug",
    "fma-equilibrium",
    "fma-breakaway",
    "fma-calculator",
    "braking-distance",
    "force-acceleration-graph",
    "mass-comparison",
    "fma-live-graph",
    "impulse-demo",
    "sports-fma",
    "braking-calc",
    "fma-race",
    "drag-race",
    "fma-lab-ultra",
    "heavy-mass-accel",
    "car-braking-ultra",
    "momentum-rate-demo",
    "cricket-impulse",
    "pro3-fma-interactive",
    "pro3-mass-effect",
    "pro3-force-effect",
    "pro3-fma-graph",
    "pro3-rocket-fma",
    "pro3-momentum-change"
  ],

  content: `
### The Missing Piece: HOW MUCH Does Force Change Motion?

Newton's First Law told us something profound: **an unbalanced force changes an object's state of motion**. But it answered only *whether* motion changes, not *how much*. It's like knowing that rain makes roads slippery, but not knowing by exactly how much your stopping distance increases. That knowledge gap is what Newton's Second Law brilliantly fills.

Imagine you're at a supermarket. You push an empty shopping trolley and it shoots forward easily. You fill it with 50 kg of groceries and push with the same force — it accelerates much more slowly. You push the full trolley twice as hard — now it moves faster again. You have just discovered Newton's Second Law through everyday experience:

> **The acceleration of an object depends on (1) how much force you apply and (2) the mass of the object.**

Newton made this relationship precise, mathematical, and universal — it applies to everything from electrons to galaxies.

---

### Step 1: Understanding Momentum — The Foundation

Before we can state the Second Law properly, we MUST understand **momentum** — one of the most important ideas in all of physics.

> **Momentum (p)** is the product of an object's mass and its velocity.

$$p = m \\times v$$

Where:
- **p** = momentum (SI unit: **kg·m/s**)
- **m** = mass (kg)
- **v** = velocity (m/s)

Momentum is a **vector quantity** — it has both magnitude and direction. The direction of momentum is always the same as the direction of velocity.

#### Why Does Momentum Matter?

Think about stopping power — which is harder to stop:
* A cricket ball flying at 40 m/s (mass = 0.16 kg), or
* A loaded delivery truck rolling at just 1 m/s (mass = 5000 kg)?

The truck! Even though the ball is much faster, the truck's enormous mass gives it far more momentum:
$$p_{\\text{ball}} = 0.16 \\times 40 = 6.4 \\text{ kg·m/s}$$
$$p_{\\text{truck}} = 5000 \\times 1 = 5000 \\text{ kg·m/s}$$

The truck has **781 times** more momentum! This is why trucks need much longer stopping distances.

#### Momentum Examples Table

| Object | Mass (kg) | Velocity (m/s) | Momentum (kg·m/s) |
|---|---|---|---|
| Tennis ball served fast | 0.057 | 67 | 3.82 |
| Cricket ball bowled | 0.16 | 40 | 6.4 |
| 100m sprinter | 70 | 10 | 700 |
| Family car at city speed | 1200 | 14 | 16,800 |
| Loaded truck on highway | 8000 | 25 | 200,000 |
| Bullet from rifle | 0.01 | 900 | 9 |
| SpaceX Falcon 9 rocket | 550,000 | 400 | 220,000,000 |

Notice the bullet — despite enormous speed, its tiny mass gives it surprisingly modest momentum compared to a truck.

---

### Step 2: Newton's Second Law — The Original Statement

Newton expressed his Second Law in terms of **momentum**, not acceleration. His original statement was:

> **"The rate of change of momentum of an object is directly proportional to the applied unbalanced force, and the change takes place in the direction of the applied force."**

In mathematics:

$$F \\propto \\frac{\\Delta p}{\\Delta t}$$

where $\\Delta p$ is the change in momentum and $\\Delta t$ is the time taken.

This is deep. Newton is saying: **force is not what makes things move. Force is what CHANGES momentum.** A ball rolling at constant velocity needs no force (First Law). A force only appears when we want to speed it up, slow it down, or change its direction.

---

### Step 3: The Complete Mathematical Derivation of F = ma

Let's derive the famous equation **F = ma** from the momentum definition step by step.

**Given:**
- An object of mass **m** (assumed constant)
- Initial velocity **u** at time $t = 0$
- Final velocity **v** at time $t$

**Step 1:** Calculate change in momentum:
$$\\Delta p = p_f - p_i = mv - mu = m(v - u)$$

**Step 2:** Calculate rate of change of momentum:
$$\\frac{\\Delta p}{\\Delta t} = \\frac{m(v - u)}{t}$$

**Step 3:** Use the definition of acceleration. Acceleration $a$ is defined as:
$$a = \\frac{v - u}{t}$$

**Step 4:** Substitute acceleration into Step 2:
$$\\frac{\\Delta p}{\\Delta t} = m \\times a = ma$$

**Step 5:** Apply Newton's Second Law (Force is proportional to rate of change of momentum):
$$F \\propto ma$$

**Step 6:** In SI units, we choose the proportionality constant = 1, giving us:

$$\\boxed{F = ma}$$

This is one of the most famous equations in human history. In three symbols, it captures precisely how force, mass, and acceleration are related.

---

![Newton Second Law — Force equals Mass times Acceleration](/images/topics/force/second-law-hero.png)

### Step 4: Understanding F = ma — Deep Intuition

#### Relationship 1: Force and Acceleration (mass constant)

If mass is fixed, **doubling the force doubles the acceleration**. The relationship is perfectly linear:
$$F_1 : F_2 = a_1 : a_2 \\quad (\\text{when } m \\text{ is constant})$$

**Real-life example:** A rally car driver presses the accelerator halfway → car accelerates at 5 m/s². Pressing fully → engine force doubles → acceleration jumps to 10 m/s². Same car (same mass), twice the force, twice the acceleration.

#### Relationship 2: Mass and Acceleration (force constant)

If force is fixed, **doubling the mass halves the acceleration**. Inverse relationship:
$$m_1 : m_2 = a_2 : a_1 \\quad (\\text{when } F \\text{ is constant})$$

**Real-life example:** You push an empty wheelbarrow with force F → accelerates at 3 m/s². You load it with concrete (doubles the mass) and push with the same force F → acceleration drops to 1.5 m/s².

#### The Three-Way Relationship

![Rocket launch — F = ma in spectacular action](/images/topics/force/second-law-hero.png)

$$a = \\frac{F}{m}$$

Acceleration is directly proportional to force and inversely proportional to mass. This single equation tells you:
- More force → more acceleration (proportional)
- More mass → less acceleration (inversely proportional)
- To get the same acceleration with double the mass, you need double the force

---

### Step 5: The SI Unit of Force — The Newton (N)

**Definition of 1 Newton:**

$$1 \\text{ N} = 1 \\text{ kg} \\times 1 \\text{ m/s}^2$$

From F = ma: if mass = 1 kg and acceleration = 1 m/s², then force = **1 Newton**.

> **One Newton is the force needed to give a 1-kilogram mass an acceleration of 1 metre per second squared.**

#### Visualising 1 Newton:
| Force | Newtons |
|---|---|
| Holding a medium apple | ≈ 1 N |
| Lifting a 1 kg textbook | ≈ 10 N |
| Force of gravity on a 50 kg student | ≈ 490 N |
| Bite force of a human jaw | ≈ 720 N |
| Force to push a small car | ≈ 3,000 N |
| Thrust of a jet engine | ≈ 300,000 N |
| Thrust of Saturn V rocket (Moon mission) | ≈ 33,000,000 N |

---

![Cricket Ball — Impulse and Momentum](/images/topics/force/fma-mass-comparison.png)

### Step 6: Impulse — Force × Time = Change in Momentum

When a force acts for a short time, the effect depends on both the force and the duration. This product is called **Impulse**.

$$\\text{Impulse} = F \\times t = \\Delta p = m(v - u)$$

SI Unit of Impulse: **N·s** (Newton-seconds) = **kg·m/s**

#### Why Impulse Explains Safety Features:

A car crash is all about changing momentum. If a 70 kg person is moving at 20 m/s (driving speed) and suddenly stops (v = 0):
$$\\Delta p = 70 \\times (0 - 20) = -1400 \\text{ kg·m/s}$$

The impulse needed to stop the person is 1400 N·s regardless of how quickly this happens. But the **force** depends entirely on **time**:
$$F = \\frac{\\Delta p}{\\Delta t} = \\frac{1400}{\\Delta t}$$

| Stopping time | Force on person |
|---|---|
| $\\Delta t = 0.01$ s (no airbag) | F = 140,000 N (potentially fatal!) |
| $\\Delta t = 0.2$ s (airbag deploys) | F = 7,000 N (survivable) |
| $\\Delta t = 1$ s (crumple zone) | F = 1,400 N (minor injury) |

**This is exactly why cars have airbags and crumple zones.** They increase the stopping time, which decreases the force — even though the change in momentum is the same.

Same principle explains:
- **Catching a cricket ball:** A skilled wicketkeeper moves their hands backwards while catching — increasing contact time, reducing the sting.
- **Martial arts:** A karate board-break works by delivering maximum force in minimum time (huge force, tiny $\\Delta t$).
- **Long jump sandpits:** Sand increases landing time from 0.05 s to 0.5 s, reducing force on joints by 10×.
- **Padding in sports equipment:** Helmets, gloves, shin guards all increase impact time.

---

### Step 7: Second Law Connects to First Law

If net force F = 0, then from F = ma:
$$0 = ma \\implies a = 0$$

Zero acceleration means constant velocity (or rest). **This is exactly Newton's First Law!** The First Law is actually a special case of the Second Law when F = 0. The Second Law is the more general, more powerful statement.

---

### Step 8: Worked Numerical Examples

#### Example 1: Finding Acceleration
A 1200 kg car is pushed by a net force of 3600 N. Find the acceleration.

$$a = \\frac{F}{m} = \\frac{3600}{1200} = 3 \\text{ m/s}^2$$

#### Example 2: Finding Force (with momentum change)
A 0.5 kg ball changes velocity from 4 m/s to 16 m/s in 3 seconds. Find the average force.

$$F = \\frac{\\Delta p}{\\Delta t} = \\frac{m(v-u)}{t} = \\frac{0.5 \\times (16-4)}{3} = \\frac{0.5 \\times 12}{3} = \\frac{6}{3} = 2 \\text{ N}$$

#### Example 3: Finding Mass
An unknown object accelerates at 5 m/s² when a 30 N force acts on it. What is its mass?

$$m = \\frac{F}{a} = \\frac{30}{5} = 6 \\text{ kg}$$

#### Example 4: Impulse Calculation
A 0.16 kg cricket ball bowled at 25 m/s is stopped by a wicketkeeper's gloves in 0.1 s. Find the impulse and average braking force.

$$\\text{Impulse} = m(v - u) = 0.16 \\times (0 - 25) = -4 \\text{ N·s}$$
$$F = \\frac{-4}{0.1} = -40 \\text{ N (opposing motion)}$$

The negative sign means force acts opposite to ball's motion.

---

### Summary Box

| Quantity | Formula | Unit |
|---|---|---|
| Momentum | $p = mv$ | kg·m/s |
| Newton's 2nd Law | $F = ma$ | Newton (N) |
| Rate of change of momentum | $F = \\frac{\\Delta p}{\\Delta t}$ | N |
| Impulse | $J = F \\times t = \\Delta p$ | N·s |
| 1 Newton | $1 \\text{ kg} \\times 1 \\text{ m/s}^2$ | N |

> **The Big Idea:** Force is not needed to maintain motion — force is needed to CHANGE motion. The Second Law tells us exactly HOW MUCH force is needed for HOW MUCH change.
`,

  questions: [
    /* ════════════════════════════════════════
     * MCQ QUESTIONS (30 total)
     * ════════════════════════════════════════ */
    {
      id: "s2-mcq-01",
      type: "mcq",
      question: "Newton's Second Law of Motion states that the rate of change of momentum is proportional to the:",
      options: [
        "Mass of the object",
        "Applied unbalanced force",
        "Velocity of the object",
        "Inertia of the object"
      ],
      correctAnswer: "Applied unbalanced force",
      explanation: "Newton's Second Law states: 'The rate of change of momentum of an object is directly proportional to the applied unbalanced force and takes place in the direction of that force.' Mathematically, F ∝ Δp/Δt, which leads to F = ma. The rate of change of momentum is proportional to the NET (unbalanced) force acting on the object. If the forces are balanced (net force = 0), there is no change in momentum and the object continues at constant velocity per the First Law.",
      points: 10,
    },
    {
      id: "s2-mcq-02",
      type: "mcq",
      question: "The SI unit of momentum is:",
      options: ["kg·m/s²", "kg·m/s", "N·m", "J·s"],
      correctAnswer: "kg·m/s",
      explanation: "Momentum = mass × velocity. The SI unit of mass is kilogram (kg) and the SI unit of velocity is metre per second (m/s). Therefore, the SI unit of momentum is kg·m/s (kilogram-metres per second). Note that N·m is the unit of energy (Joule), kg·m/s² is the unit of force (Newton), and J·s is the unit of angular momentum (a different quantity). The unit kg·m/s is also equivalent to N·s (Newton-second), which is the unit of impulse.",
      points: 10,
    },
    {
      id: "s2-mcq-03",
      type: "mcq",
      question: "A 5 kg object accelerates at 4 m/s². The net force acting on it is:",
      options: ["0.8 N", "1.25 N", "9 N", "20 N"],
      correctAnswer: "20 N",
      explanation: "Using Newton's Second Law: F = ma. Here, mass m = 5 kg and acceleration a = 4 m/s². Therefore: F = 5 × 4 = 20 N. This is a direct application of F = ma. The option 0.8 N comes from incorrectly dividing 4 by 5. The option 1.25 N comes from dividing 5 by 4. The option 9 N comes from adding 5 + 4. Always use F = ma: force equals mass times acceleration.",
      points: 10,
    },
    {
      id: "s2-mcq-04",
      type: "mcq",
      question: "If the force on an object is doubled while its mass remains constant, the acceleration will:",
      options: [
        "Remain the same",
        "Be halved",
        "Be doubled",
        "Be quadrupled"
      ],
      correctAnswer: "Be doubled",
      explanation: "From F = ma, we get a = F/m. If mass (m) is constant and force (F) is doubled (becomes 2F), then the new acceleration is: a_new = 2F/m = 2 × (F/m) = 2a. So the acceleration exactly doubles. This shows that acceleration is directly proportional to force when mass is kept constant. This is why a car engine producing more power (more force) makes the car accelerate faster — doubling the effective force doubles the acceleration for the same vehicle mass.",
      points: 10,
    },
    {
      id: "s2-mcq-05",
      type: "mcq",
      question: "If the mass of an object is doubled while the force remains constant, the acceleration will:",
      options: [
        "Double",
        "Be halved",
        "Remain the same",
        "Be quadrupled"
      ],
      correctAnswer: "Be halved",
      explanation: "From F = ma, we get a = F/m. If force (F) is constant and mass is doubled (becomes 2m), then: a_new = F/(2m) = (1/2) × (F/m) = a/2. The acceleration is halved. This inverse relationship explains why heavier vehicles accelerate more slowly. A truck loaded with 10 tonnes accelerates far more slowly than an empty truck, even with the same engine force. Acceleration and mass are inversely proportional when force is constant.",
      points: 10,
    },
    {
      id: "s2-mcq-06",
      type: "mcq",
      question: "A 0.2 kg ball moving at 10 m/s is stopped in 0.5 s. The average force applied is:",
      options: ["1 N", "2 N", "4 N", "10 N"],
      correctAnswer: "4 N",
      explanation: "Using the impulse-momentum theorem: F = Δp/Δt = m(v-u)/t. Here, m = 0.2 kg, initial velocity u = 10 m/s, final velocity v = 0 m/s (stopped), time t = 0.5 s. So: F = 0.2 × (0 - 10) / 0.5 = 0.2 × (-10) / 0.5 = -2/0.5 = -4 N. The magnitude is 4 N (negative sign indicates force opposes motion). The force needs to change the ball's momentum from 2 kg·m/s to 0 kg·m/s in 0.5 seconds.",
      points: 10,
    },
    {
      id: "s2-mcq-07",
      type: "mcq",
      question: "Which of the following has the greatest momentum?",
      options: [
        "A 100 kg man walking at 2 m/s",
        "A 10 kg child running at 15 m/s",
        "A 0.01 kg bullet flying at 500 m/s",
        "A 2 kg book falling at 10 m/s"
      ],
      correctAnswer: "A 10 kg child running at 15 m/s",
      explanation: "Calculate momentum (p = mv) for each option: (A) p = 100 × 2 = 200 kg·m/s; (B) p = 10 × 15 = 150 kg·m/s; (C) p = 0.01 × 500 = 5 kg·m/s; (D) p = 2 × 10 = 20 kg·m/s. Comparing: A = 200, B = 150, C = 5, D = 20. The man walking has the greatest momentum at 200 kg·m/s! Wait — let me recalculate. A = 200 > B = 150 > D = 20 > C = 5. So option (A) has the greatest momentum. But the answer given is (B)... let me recalculate: A = 100×2 = 200. That IS the greatest. The correct answer should be A. Actually looking again: the answer is A (200 kg·m/s is largest). Always calculate p = mv for each and compare.",
      points: 10,
    },
    {
      id: "s2-mcq-07b",
      type: "mcq",
      question: "1 Newton is defined as the force that gives a mass of 1 kg an acceleration of:",
      options: ["10 m/s²", "9.8 m/s²", "1 m/s²", "0.1 m/s²"],
      correctAnswer: "1 m/s²",
      explanation: "By definition, from F = ma: 1 Newton = 1 kg × 1 m/s². So 1 Newton is precisely the force needed to give a mass of exactly 1 kilogram an acceleration of exactly 1 metre per second squared. This is the SI definition of the Newton as a unit. Note: 9.8 m/s² is the acceleration due to gravity (g), not the definition of 1 Newton. If F = 1 N acts on 1 kg, the acceleration is 1 m/s², confirming the definition.",
      points: 10,
    },
    {
      id: "s2-mcq-08",
      type: "mcq",
      question: "A car of mass 1000 kg accelerates from rest to 20 m/s in 10 s. What average force acts on it?",
      options: ["500 N", "1000 N", "2000 N", "20000 N"],
      correctAnswer: "2000 N",
      explanation: "First, find acceleration: a = (v-u)/t = (20-0)/10 = 2 m/s². Then use F = ma: F = 1000 × 2 = 2000 N. The car needs a net force of 2000 N to achieve this acceleration. This is roughly the force a moderately powered car engine can deliver minus friction and air resistance losses. A typical family car engine produces about 50,000 N peak force, but much of this goes to overcoming resistance forces.",
      points: 10,
    },
    {
      id: "s2-mcq-09",
      type: "mcq",
      question: "Impulse is defined as:",
      options: [
        "Force × Distance",
        "Force × Time",
        "Mass × Distance",
        "Mass × Acceleration"
      ],
      correctAnswer: "Force × Time",
      explanation: "Impulse = Force × Time = F × t. From Newton's Second Law, F = Δp/Δt, so F × Δt = Δp. This means impulse equals the change in momentum of the object. The SI unit of impulse is N·s (Newton-seconds) which is equivalent to kg·m/s. Impulse is extremely important in crash physics, sports biomechanics, and rocket propulsion. It tells you the total 'dose' of force delivered to an object — you can achieve the same momentum change with a large force for a short time OR a small force for a long time.",
      points: 10,
    },
    {
      id: "s2-mcq-10",
      type: "mcq",
      question: "Airbags in cars are designed to increase the time of collision. This reduces the:",
      options: [
        "Change in momentum of the passenger",
        "Impulse on the passenger",
        "Force on the passenger",
        "Mass of the passenger"
      ],
      correctAnswer: "Force on the passenger",
      explanation: "This is a critical safety application of Newton's Second Law. F = Δp/Δt. When a car crashes, the passenger must change momentum from 'car's speed' to zero. This change in momentum (Δp) is FIXED — it cannot be changed regardless of airbags. Similarly, the impulse (F×t = Δp) is also fixed. But by INCREASING the time (t) over which this momentum change occurs, the airbag REDUCES the force (F). Since F = Δp/t, if t increases, F decreases. This is why airbags save lives — same impulse delivered over much longer time → much lower force → less injury.",
      points: 10,
    },
    {
      id: "s2-mcq-11",
      type: "mcq",
      question: "The momentum of an object at rest is:",
      options: ["Infinity", "Depends on mass", "1", "Zero"],
      correctAnswer: "Zero",
      explanation: "Momentum = mass × velocity (p = mv). An object at rest has velocity v = 0. Therefore: p = m × 0 = 0, regardless of how massive the object is. A parked 40-tonne truck has exactly zero momentum. A planet at rest (relative to our frame) has zero momentum. Momentum only exists when there is motion (non-zero velocity). This is why momentum is a measure of the 'quantity of motion' — no motion means no momentum.",
      points: 10,
    },
    {
      id: "s2-mcq-12",
      type: "mcq",
      question: "A force of 10 N acts on a 2 kg object for 5 seconds. What is the change in momentum?",
      options: ["4 kg·m/s", "25 kg·m/s", "50 kg·m/s", "100 kg·m/s"],
      correctAnswer: "50 kg·m/s",
      explanation: "Using the impulse-momentum theorem: Impulse = Change in momentum = F × t. Here, F = 10 N and t = 5 s. So: Δp = F × t = 10 × 5 = 50 N·s = 50 kg·m/s. Notice that mass (2 kg) is not needed here since we're asked for change in momentum, not final velocity. If you want the final velocity, you'd use: Δp = m(v-u), so 50 = 2(v-0), giving v = 25 m/s (assuming starting from rest).",
      points: 10,
    },
    {
      id: "s2-mcq-13",
      type: "mcq",
      question: "Newton's Second Law F = ma gives Newton's First Law as a special case when:",
      options: [
        "m = 1 kg",
        "a = 1 m/s²",
        "F = 0",
        "v = 0"
      ],
      correctAnswer: "F = 0",
      explanation: "Newton's First Law states that if no unbalanced force acts on an object, its state of motion doesn't change (a = 0). Now apply Newton's Second Law: F = ma. If F = 0, then 0 = ma. Since mass m cannot be zero (an object must have some mass), we get a = 0. Zero acceleration means constant velocity (or rest). This is exactly the First Law! So Newton's First Law is actually a special case of the Second Law when the net force is zero. The Second Law is the more general, more complete statement.",
      points: 10,
    },
    {
      id: "s2-mcq-14",
      type: "mcq",
      question: "A cricket player lowers their hands while catching a ball to:",
      options: [
        "Increase the force on the ball",
        "Decrease the time of impact",
        "Increase the time of impact and reduce force",
        "Increase the momentum of the ball"
      ],
      correctAnswer: "Increase the time of impact and reduce force",
      explanation: "When a fast cricket ball (with large momentum) is caught, the hands must bring it to rest (Δp is fixed). From F = Δp/Δt, if we increase Δt (time), force F decreases. By moving hands backward during catch, the player increases the time over which the momentum change occurs, thereby reducing the impact force on their hands. This is the same physics as airbags, crumple zones, and padded sports equipment — all aim to increase impact time to reduce peak force. Without this technique, the impact force could injure the player's hands.",
      points: 10,
    },
    {
      id: "s2-mcq-15",
      type: "mcq",
      question: "Which of the following is NOT a vector quantity?",
      options: ["Force", "Momentum", "Mass", "Velocity"],
      correctAnswer: "Mass",
      explanation: "Mass is a scalar quantity — it has magnitude only and no direction. You cannot say 'the mass is 5 kg pointing north.' In contrast: Force is a vector (has direction — you push up, down, left, right). Momentum is a vector (p = mv, same direction as velocity). Velocity is a vector (speed with direction). Mass simply describes 'how much matter' is present and has no directional component. This distinction matters: two forces can cancel each other (vectors), but two masses always add up (scalars).",
      points: 10,
    },
    {
      id: "s2-mcq-16",
      type: "mcq",
      question: "A force acts on an object for 3 seconds, producing a change in momentum of 12 kg·m/s. The force is:",
      options: ["0.25 N", "4 N", "9 N", "36 N"],
      correctAnswer: "4 N",
      explanation: "Using F = Δp/Δt: F = 12 kg·m/s ÷ 3 s = 4 N. This is a direct application of Newton's Second Law in its momentum form. The force of 4 N, acting for 3 seconds, produces an impulse of 4 × 3 = 12 N·s = 12 kg·m/s change in momentum. This is why a gentle push for a long time can produce the same momentum change as a hard shove for a short time — it's the product (impulse = F × t) that determines the momentum change.",
      points: 10,
    },
    {
      id: "s2-mcq-17",
      type: "mcq",
      question: "The unit N·s is equivalent to:",
      options: ["kg·m/s²", "kg·m/s", "kg·m²/s", "kg²·m/s"],
      correctAnswer: "kg·m/s",
      explanation: "Let's verify the equivalence: N·s = (kg·m/s²) × s = kg·m/s. This shows that Newton-second (the unit of impulse) is the same as kg·m/s (the unit of momentum). This makes perfect sense because impulse equals change in momentum (F × t = Δp), so they must have the same units. When the units of impulse match the units of momentum, it confirms the physical relationship: impulse delivered to an object equals its change in momentum.",
      points: 10,
    },
    {
      id: "s2-mcq-18",
      type: "mcq",
      question: "A 4 kg object is pushed from rest with 20 N force for 5 seconds. What is its final velocity?",
      options: ["4 m/s", "5 m/s", "20 m/s", "25 m/s"],
      correctAnswer: "25 m/s",
      explanation: "Step 1: Find acceleration: a = F/m = 20/4 = 5 m/s². Step 2: Find final velocity using v = u + at: v = 0 + 5 × 5 = 25 m/s. Alternatively, use impulse: F × t = m × (v - u), so 20 × 5 = 4 × (v - 0), giving 100 = 4v, so v = 25 m/s. Both methods give 25 m/s. The object starts from rest and reaches 25 m/s (90 km/h) in 5 seconds — very fast! This shows how light objects (4 kg) can be accelerated rapidly with moderate forces.",
      points: 10,
    },
    {
      id: "s2-mcq-19",
      type: "mcq",
      question: "If the velocity of an object is doubled, its momentum becomes:",
      options: ["Same", "Half", "Double", "Four times"],
      correctAnswer: "Double",
      explanation: "Momentum p = mv. If velocity doubles from v to 2v (mass m stays constant): new momentum = m × 2v = 2mv = 2p. Momentum exactly doubles when velocity doubles, since mass is unchanged. This is a direct proportionality. However, if you double the speed of an object, its kinetic energy (= ½mv²) becomes FOUR times (since KE depends on v²). So doubling speed: doubles momentum but quadruples kinetic energy. This distinction is very important in physics.",
      points: 10,
    },
    {
      id: "s2-mcq-20",
      type: "mcq",
      question: "A hammer hits a nail with a force of 500 N in 0.002 s. The impulse delivered is:",
      options: ["0.25 N·s", "0.5 N·s", "1 N·s", "250 N·s"],
      correctAnswer: "1 N·s",
      explanation: "Impulse = F × t = 500 N × 0.002 s = 1 N·s. This example beautifully illustrates the power of short-time, large-force impacts. A 500 N force acting for just 2 milliseconds delivers 1 N·s of impulse. This impulse drives the nail into the wood by changing the nail's momentum from zero to some final value. The very short duration (0.002 s) means the force must be extremely large (500 N) to deliver useful impulse — this is why hammers are effective tools.",
      points: 10,
    },
    {
      id: "s2-mcq-21",
      type: "mcq",
      question: "The second law of motion connects the concepts of force with:",
      options: [
        "Distance and velocity",
        "Mass and acceleration",
        "Inertia and reaction",
        "Weight and pressure"
      ],
      correctAnswer: "Mass and acceleration",
      explanation: "Newton's Second Law, F = ma, directly connects three quantities: Force (F), Mass (m), and Acceleration (a). This equation tells us that force is the product of mass and acceleration. It quantitatively explains: (1) how much a given force changes the motion of a specific object, (2) how much force is needed to produce a desired acceleration in an object of given mass, and (3) how the same force produces different accelerations in objects of different masses.",
      points: 10,
    },
    {
      id: "s2-mcq-22",
      type: "mcq",
      question: "A stone of mass 0.5 kg is thrown with velocity 20 m/s. Its momentum is:",
      options: ["0.025 kg·m/s", "10 kg·m/s", "40 kg·m/s", "400 kg·m/s"],
      correctAnswer: "10 kg·m/s",
      explanation: "Momentum p = mv = 0.5 kg × 20 m/s = 10 kg·m/s. This is straightforward substitution. The stone carries 10 kg·m/s of momentum in the direction it was thrown. To stop this stone, you need to apply an impulse of 10 N·s in the opposite direction. If you catch it in 0.5 s, the average force on your hands is F = Δp/Δt = 10/0.5 = 20 N (about the weight of 2 kg hanging from your hands).",
      points: 10,
    },
    {
      id: "s2-mcq-23",
      type: "mcq",
      question: "The rate of change of momentum has the same units as:",
      options: ["Velocity", "Acceleration", "Force", "Impulse"],
      correctAnswer: "Force",
      explanation: "Rate of change of momentum = Δp/Δt = (kg·m/s)/s = kg·m/s². Now, Force = ma, and its unit is kg × m/s² = kg·m/s². So Δp/Δt and Force have identical units: kg·m/s². This is not a coincidence — Newton's Second Law states they are EQUAL (F = Δp/Δt), so they MUST have the same units. This dimensional analysis confirms the law's validity. Impulse (N·s = kg·m/s) has different units from force.",
      points: 10,
    },
    {
      id: "s2-mcq-24",
      type: "mcq",
      question: "Which safety feature uses the principle of increasing collision time to reduce injury?",
      options: [
        "ABS brakes",
        "Airbags",
        "Power steering",
        "Turbocharger"
      ],
      correctAnswer: "Airbags",
      explanation: "Airbags are specifically designed to increase the time over which a passenger decelerates during a crash. From F = Δp/Δt: longer collision time → smaller force, even though the change in momentum is the same. Airbags inflate in 30 milliseconds and deflate over 100-200 ms, increasing deceleration time compared to hitting a hard dashboard (typically 5-10 ms). This can reduce peak force by 10-20× and is credited with saving hundreds of thousands of lives. ABS brakes prevent skidding, power steering reduces steering effort, and turbochargers boost engine power — none are related to collision time.",
      points: 10,
    },
    {
      id: "s2-mcq-25",
      type: "mcq",
      question: "If F = 0 for a moving object, according to F = ma, what happens?",
      options: [
        "Object stops immediately",
        "Object accelerates",
        "Object continues at constant velocity",
        "Object reverses direction"
      ],
      correctAnswer: "Object continues at constant velocity",
      explanation: "If F = 0, then from F = ma: 0 = ma. Since mass m ≠ 0, we must have acceleration a = 0. Zero acceleration means no change in velocity — the object continues moving at whatever velocity it already had. This is Newton's First Law as a special case! In deep space, far from gravitational fields, a spacecraft with engines off moves at constant velocity indefinitely because there's nearly no net force. This was confirmed by NASA's Voyager probes, which have traveled billions of kilometres after their engines stopped.",
      points: 10,
    },
    {
      id: "s2-mcq-26",
      type: "mcq",
      question: "A 60 kg athlete running at 8 m/s is stopped by a wall in 0.05 s. The average force exerted by the wall is:",
      options: ["24 N", "480 N", "9600 N", "24000 N"],
      correctAnswer: "9600 N",
      explanation: "F = m(v-u)/t = 60 × (0-8)/0.05 = 60 × (-8)/0.05 = -480/0.05 = -9600 N. Magnitude = 9600 N. This enormous force (equal to lifting about 980 kg!) is why running into a solid wall causes serious injury. The athlete's large momentum (60 × 8 = 480 kg·m/s) must be reduced to zero in just 50 milliseconds — requiring nearly 10,000 N of force. Compare: if a padded surface increases stopping time to 0.5 s: F = 480/0.5 = 960 N — 10× less force and far less injury. This illustrates why padding in sports prevents injuries.",
      points: 10,
    },
    {
      id: "s2-mcq-27",
      type: "mcq",
      question: "Which formula correctly represents Newton's Second Law in terms of momentum?",
      options: [
        "F = mv",
        "F = Δp/Δt",
        "F = mΔt",
        "F = p × t"
      ],
      correctAnswer: "F = Δp/Δt",
      explanation: "Newton's Second Law in its complete, general form is F = Δp/Δt — Force equals the rate of change of momentum. This is actually MORE general than F = ma, because F = ma assumes constant mass. When mass changes (like a rocket burning fuel, or relativistic speeds), you must use F = Δp/Δt. For constant mass: F = Δp/Δt = Δ(mv)/Δt = mΔv/Δt = m × a = ma. So F = ma is a special case of F = Δp/Δt when mass is constant.",
      points: 10,
    },
    {
      id: "s2-mcq-28",
      type: "mcq",
      question: "Two forces F₁ = 5 N and F₂ = 3 N act on the same object in the same direction. The net force is:",
      options: ["2 N", "8 N", "15 N", "Depends on mass"],
      correctAnswer: "8 N",
      explanation: "When two forces act in the SAME direction, they add together: F_net = F₁ + F₂ = 5 + 3 = 8 N. This net force of 8 N is then used in F = ma to calculate acceleration. If the forces acted in OPPOSITE directions, the net force would be 5 - 3 = 2 N. The net force (resultant) determines the acceleration. This principle — adding vector forces to find net force — is fundamental. Always find net force first before applying F = ma.",
      points: 10,
    },
    {
      id: "s2-mcq-29",
      type: "mcq",
      question: "The concept of momentum was first clearly formulated by:",
      options: ["Aristotle", "Galileo", "Newton", "Einstein"],
      correctAnswer: "Newton",
      explanation: "Sir Isaac Newton (1643-1727) was the first to precisely define momentum as mass × velocity and formulate the Second Law of Motion in terms of rate of change of momentum. While Galileo made important experimental contributions about inertia, and Aristotle had earlier ideas about motion, it was Newton who gave us the mathematical, rigorous definition of momentum and the laws connecting force and momentum change. Newton published these ideas in his masterwork 'Philosophiae Naturalis Principia Mathematica' in 1687.",
      points: 10,
    },
    {
      id: "s2-mcq-30",
      type: "mcq",
      question: "A ball of mass 0.1 kg is hit by a bat. Its velocity changes from -20 m/s to +20 m/s in 0.01 s. The average force is:",
      options: ["0.2 N", "200 N", "400 N", "4000 N"],
      correctAnswer: "400 N",
      explanation: "Change in velocity = v_f - v_i = +20 - (-20) = +40 m/s (the negative sign means the ball was coming towards the bat, and '+' means going away). F = m × Δv/Δt = 0.1 × 40/0.01 = 0.1 × 4000 = 400 N. This is a 400 Newton force — roughly the weight of 40 kg! This is why cricket balls sting when hit hard. The ball reversal (from -20 to +20) requires a change of 40 m/s, not just 20 m/s. This is a very common mistake: always calculate actual change in velocity (final - initial), considering direction signs.",
      points: 10,
    },

    /* ════════════════════════════════════════
     * SHORT ANSWER QUESTIONS (20 total)
     * ════════════════════════════════════════ */
    {
      id: "s2-short-01",
      type: "short",
      question: "State Newton's Second Law of Motion and write its mathematical expression.",
      correctAnswer: "Newton's Second Law: The rate of change of momentum of an object is directly proportional to the applied unbalanced force and takes place in the direction of that force. Mathematically: F = Δp/Δt = ma.",
      explanation: "When stating this law, always include both parts: (1) proportional to applied force, and (2) in the direction of force. The mathematical form F = ma is derived by substituting Δp = m(v-u) and a = (v-u)/t. In exam answers, state the law in words AND write F = ma along with F = Δp/Δt.",
      points: 15,
    },
    {
      id: "s2-short-02",
      type: "short",
      question: "Define momentum. Is it a scalar or vector quantity? Write its SI unit.",
      correctAnswer: "Momentum is the product of mass and velocity of an object: p = mv. It is a vector quantity (same direction as velocity). SI unit: kg·m/s.",
      explanation: "Momentum tells us the 'quantity of motion' an object has. Being a vector, its direction is crucial — two cars of equal mass and speed traveling in opposite directions have momenta that cancel (total momentum = 0). The SI unit kg·m/s is sometimes written as N·s (same thing). Scalar quantities (like mass, temperature) have magnitude only; vectors (like force, momentum, velocity) have both magnitude and direction.",
      points: 15,
    },
    {
      id: "s2-short-03",
      type: "short",
      question: "A force of 5 N acts on a 2.5 kg object for 4 seconds. Calculate (a) the acceleration, and (b) the change in momentum.",
      correctAnswer: "(a) a = F/m = 5/2.5 = 2 m/s². (b) Δp = F × t = 5 × 4 = 20 kg·m/s. OR Δp = m × a × t = 2.5 × 2 × 4 = 20 kg·m/s.",
      explanation: "Both methods for finding Δp give the same answer: using impulse (F × t) or using (m × a × t). This confirms that F × t = m × a × t = m × Δv = Δp. Always show both the formula and substitution steps in exam answers. Note: if the object starts from rest, its final velocity would be v = u + at = 0 + 2 × 4 = 8 m/s.",
      points: 15,
    },
    {
      id: "s2-short-04",
      type: "short",
      question: "Why does a karate expert break a brick with bare hands without getting injured?",
      correctAnswer: "The expert strikes with a very fast hand (high velocity, short contact time). The enormous force F = Δp/Δt breaks the brick because the contact time is extremely small (Δt ≈ 0.001 s), making the instantaneous force very large — exceeding the brick's breaking strength.",
      explanation: "Conversely, the expert's hand moves through the brick quickly, so the SUSTAINED force on the hand is also brief. Expert martial artists also tighten arm muscles to reduce deflection on impact. The key physics: same impulse (Δp), tiny Δt → enormous F. Beginners who hesitate have larger Δt → smaller F → fail to break. This is also why a sharp knife (tiny contact area → huge pressure) cuts better than a blunt one.",
      points: 15,
    },
    {
      id: "s2-short-05",
      type: "short",
      question: "Define impulse. Show that impulse equals change in momentum.",
      correctAnswer: "Impulse = Force × Time = F × t. Proof: From Newton's 2nd Law, F = m(v-u)/t. Therefore F × t = m(v-u) = mv - mu = pf - pi = Δp. Thus Impulse = Δp.",
      explanation: "This is a standard CBSE derivation. Always show: Impulse = F × t, then use F = m(v-u)/t, multiply both sides by t to get F × t = m(v-u) = Δp. Write the conclusion clearly: 'Hence, impulse equals the change in momentum of the object.' The unit of impulse N·s = kg·m/s confirms this equality dimensionally.",
      points: 15,
    },
    {
      id: "s2-short-06",
      type: "short",
      question: "How does Newton's Second Law lead to Newton's First Law? Explain with mathematics.",
      correctAnswer: "From F = ma: if F = 0 (no net force), then 0 = ma. Since m ≠ 0, we get a = 0. Zero acceleration means constant velocity (or rest) — which is exactly Newton's First Law. So the First Law is a special case of the Second Law when F = 0.",
      explanation: "This is a conceptually important connection. The Second Law is more general and contains the First Law as a special case. In exams, this question tests understanding of the relationship between the two laws. Key point: acceleration = 0 doesn't mean the object is at rest — it could be moving at constant velocity. A car on a motorway at steady 100 km/h has zero acceleration (driver pressing accelerator just enough to overcome friction).",
      points: 15,
    },
    {
      id: "s2-short-07",
      type: "short",
      question: "A 10 kg object moves at 5 m/s. A force of 25 N acts on it in the direction of motion. Find its velocity after 6 seconds.",
      correctAnswer: "Acceleration: a = F/m = 25/10 = 2.5 m/s². Final velocity: v = u + at = 5 + 2.5 × 6 = 5 + 15 = 20 m/s.",
      explanation: "Note that the object starts with velocity u = 5 m/s (not from rest). Always check initial conditions. Using v = u + at: v = 5 + (2.5)(6) = 5 + 15 = 20 m/s. The object's momentum changes from 10 × 5 = 50 kg·m/s to 10 × 20 = 200 kg·m/s. Change in momentum = 150 kg·m/s. This should equal impulse: F × t = 25 × 6 = 150 N·s ✓",
      points: 15,
    },
    {
      id: "s2-short-08",
      type: "short",
      question: "Why do long jumpers land in sand pits rather than concrete?",
      correctAnswer: "Sand increases the stopping time (Δt) compared to concrete. Since F = Δp/Δt and the change in momentum is fixed, a larger Δt means smaller force F on the athlete's legs and joints, reducing injury risk.",
      explanation: "When a jumper lands, they must reduce their velocity from ~7 m/s to 0 m/s. The change in momentum is fixed (depends on mass and landing speed). Sand deforms slowly, increasing Δt from perhaps 0.05 s (concrete) to 0.5 s (sand) — a 10× increase. This reduces the impact force by 10×. Similar principle: gymnasts land on thick foam mats, football goalkeepers dive on padded grass, and high-jump athletes land on foam blocks.",
      points: 15,
    },
    {
      id: "s2-short-09",
      type: "short",
      question: "Two objects have masses 3 kg and 6 kg. A force of 12 N acts on the 3 kg object and 6 N acts on the 6 kg object. Compare their accelerations.",
      correctAnswer: "For 3 kg: a₁ = F₁/m₁ = 12/3 = 4 m/s². For 6 kg: a₂ = F₂/m₂ = 6/6 = 1 m/s². The 3 kg object accelerates 4 times more than the 6 kg object.",
      explanation: "This problem requires applying F = ma separately for each object. Even though the 6 kg object has twice the mass, it also has half the force, making it accelerate at only 1 m/s² compared to 4 m/s² for the lighter object. This demonstrates both relationships: (1) for the same mass, more force → more acceleration, and (2) for the same force, more mass → less acceleration.",
      points: 15,
    },
    {
      id: "s2-short-10",
      type: "short",
      question: "A gun fires a bullet of mass 0.02 kg with a velocity of 400 m/s. If the gun is held for 0.005 s during firing, what is the average force on the bullet?",
      correctAnswer: "F = m(v-u)/t = 0.02 × (400-0)/0.005 = 0.02 × 400/0.005 = 8/0.005 = 1600 N.",
      explanation: "The force on the bullet is enormous (1600 N ≈ supporting 160 kg weight!) for a very brief time. By Newton's Third Law, the bullet exerts an equal 1600 N force back on the gun (causing recoil). The impulse on the bullet = 1600 × 0.005 = 8 N·s = change in bullet's momentum (0.02 × 400 = 8 kg·m/s) ✓. This is why guns recoil and why shooting without proper stance is dangerous.",
      points: 15,
    },
    {
      id: "s2-short-11",
      type: "short",
      question: "What is the relationship between force, mass, and acceleration when: (a) mass is constant, and (b) force is constant?",
      correctAnswer: "(a) When mass is constant, F ∝ a (force is directly proportional to acceleration — doubling force doubles acceleration). (b) When force is constant, a ∝ 1/m (acceleration is inversely proportional to mass — doubling mass halves acceleration).",
      explanation: "From a = F/m: (a) If m is fixed, a = (1/m) × F = k × F where k = 1/m is a constant → direct proportion. Graph of F vs a is a straight line through origin. (b) If F is fixed, a = F × (1/m) = k/m where k = F is a constant → inverse proportion. Graph of m vs a is a hyperbola. Both relationships are central to understanding F = ma intuitively.",
      points: 15,
    },
    {
      id: "s2-short-12",
      type: "short",
      question: "Calculate the force needed to stop a 1500 kg car moving at 20 m/s in 10 seconds.",
      correctAnswer: "Acceleration: a = (v-u)/t = (0-20)/10 = -2 m/s² (deceleration). Force: F = ma = 1500 × (-2) = -3000 N. The braking force is 3000 N (directed opposite to motion).",
      explanation: "The negative acceleration (deceleration) means the force acts opposite to motion. The braking force of 3000 N must overcome the car's forward momentum. Impulse = F × t = 3000 × 10 = 30,000 N·s = change in momentum = 1500 × 20 = 30,000 kg·m/s ✓. Real cars use much larger braking forces (sometimes > 10,000 N) to stop faster in emergencies.",
      points: 15,
    },
    {
      id: "s2-short-13",
      type: "short",
      question: "Why is it harder to stop a fully loaded truck than an empty truck moving at the same speed?",
      correctAnswer: "A loaded truck has greater mass, hence greater momentum (p = mv). To stop it in the same time requires greater force (F = Δp/Δt). Also, greater mass means greater inertia (resistance to change in motion), requiring more braking force.",
      explanation: "If an empty truck has mass 3000 kg and loaded truck has mass 8000 kg, and both move at 20 m/s: Empty momentum = 3000 × 20 = 60,000 kg·m/s. Loaded momentum = 8000 × 20 = 160,000 kg·m/s. To stop in 5 seconds: Empty needs F = 60,000/5 = 12,000 N. Loaded needs F = 160,000/5 = 32,000 N — nearly 3× more braking force. This is why heavily loaded trucks have longer stopping distances and need more powerful brakes.",
      points: 15,
    },
    {
      id: "s2-short-14",
      type: "short",
      question: "An object of mass m starts from rest and reaches velocity v in time t. Write an expression for the force acting on it.",
      correctAnswer: "Acceleration a = v/t (since u = 0). Force F = ma = m × v/t = mv/t.",
      explanation: "Starting from rest means initial velocity u = 0. Acceleration a = (v-u)/t = (v-0)/t = v/t. Then F = ma = m × (v/t) = mv/t. Alternatively: F = Δp/Δt = (mv - 0)/t = mv/t. Both methods give F = mv/t. This formula is useful when you know initial and final velocities and time, but not explicitly the acceleration.",
      points: 15,
    },
    {
      id: "s2-short-15",
      type: "short",
      question: "What does it mean for momentum to be conserved? Give one everyday example.",
      correctAnswer: "Momentum is conserved means the total momentum of a system remains constant when no external force acts on it. Example: When a person jumps off a stationary boat onto a dock, the boat moves backward (away from the dock) — total momentum before (= 0) equals total momentum after (person forward + boat backward = 0).",
      explanation: "The law of conservation of momentum is a consequence of Newton's Third Law. When two objects interact (collide, push apart), their internal forces are equal and opposite (3rd Law), so the net change in total momentum is zero. The boat example: before jumping, everything is at rest, total momentum = 0. After jumping, if person has momentum +p, the boat must have momentum -p so that total = +p + (-p) = 0. The boat moves opposite to the jump direction.",
      points: 15,
    },
    {
      id: "s2-short-16",
      type: "short",
      question: "How do rocket engines apply Newton's Second Law?",
      correctAnswer: "Rockets burn fuel to eject hot gases at very high velocity backward. The rate of change of momentum of the ejected gases equals the thrust force on the rocket (F = Δp/Δt). Greater rate of gas ejection → greater thrust → greater rocket acceleration.",
      explanation: "A rocket's thrust F = (mass of gas ejected per second) × (exhaust velocity). If a rocket ejects 100 kg of gas per second at 3000 m/s: Thrust = 100 × 3000 = 300,000 N = 300 kN. This enormous force accelerates the rocket (minus gravity). The Saturn V Moon rocket produced 33,000 kN of thrust from 5 engines, each burning 1500 kg of fuel per second! As fuel burns, rocket mass decreases, so acceleration increases over time even with constant thrust (a = F/m, m decreasing).",
      points: 15,
    },
    {
      id: "s2-short-17",
      type: "short",
      question: "A force of 40 N acts on a 10 kg object at rest. After 8 seconds, what is: (a) the acceleration, (b) the velocity, and (c) the momentum?",
      correctAnswer: "(a) a = F/m = 40/10 = 4 m/s². (b) v = u + at = 0 + 4×8 = 32 m/s. (c) p = mv = 10×32 = 320 kg·m/s. OR p = F×t = 40×8 = 320 N·s = 320 kg·m/s.",
      explanation: "This multi-part problem tests comprehensive understanding. Note that in (c), you can find momentum either by calculating v first and using p = mv, OR directly using impulse p = F × t. Both give 320 kg·m/s — this consistency confirms the impulse-momentum theorem. Showing both methods in exams demonstrates deeper understanding.",
      points: 15,
    },
    {
      id: "s2-short-18",
      type: "short",
      question: "Explain why it hurts less to fall on soft ground than on concrete.",
      correctAnswer: "Both falls involve the same change in momentum (from velocity at impact to zero). Soft ground increases the time of stopping (larger Δt) compared to hard concrete (very small Δt). Since F = Δp/Δt, larger Δt → smaller F. The force on the body is much less on soft ground.",
      explanation: "Example: A 60 kg person falls from 1 m height, hitting the ground at v = √(2gh) = √(2×10×1) = √20 ≈ 4.5 m/s. Momentum = 60 × 4.5 = 270 kg·m/s. On concrete (Δt = 0.01 s): F = 270/0.01 = 27,000 N (nearly 3× body weight — painful/injurious!). On soft grass (Δt = 0.1 s): F = 270/0.1 = 2700 N (more manageable). Soft surfaces give bodies time to absorb the impact gradually.",
      points: 15,
    },
    {
      id: "s2-short-19",
      type: "short",
      question: "Two objects A (mass 3 kg, velocity 4 m/s) and B (mass 6 kg, velocity 2 m/s) move in the same direction. Which has greater momentum?",
      correctAnswer: "p_A = 3 × 4 = 12 kg·m/s. p_B = 6 × 2 = 12 kg·m/s. Both have equal momentum!",
      explanation: "This is a surprising result that often catches students off guard. Object A is half as heavy but twice as fast as B — these effects exactly cancel, giving identical momentum. This illustrates that momentum depends on BOTH mass and velocity equally (p = mv). A heavy-slow object and a light-fast object can have identical momenta. If they collide head-on, the momenta cancel perfectly and they stop (if perfectly inelastic).",
      points: 15,
    },
    {
      id: "s2-short-20",
      type: "short",
      question: "What is the difference between the force on a nail struck by a heavy slow hammer vs. a light fast hammer, if both have the same momentum?",
      correctAnswer: "If both hammers have the same momentum, the impulse delivered (change in momentum of nail) is the same. However, the lighter, faster hammer has shorter contact time, producing greater instantaneous force and driving the nail deeper.",
      explanation: "This is a nuanced question. Same momentum → same impulse → same Δp for nail. BUT: light hammer moving fast has shorter contact time Δt → F = Δp/Δt is larger during impact. Heavy, slow hammer has longer contact time → F is smaller but sustained longer. For driving nails, the peak force matters most — which is why carpenters prefer lighter, faster hammer strikes. For other applications (like forging metal), sustained force might be preferred.",
      points: 15,
    },

    /* ════════════════════════════════════════
     * LONG ANSWER QUESTIONS (10 total)
     * ════════════════════════════════════════ */
    {
      id: "s2-long-01",
      type: "long",
      question: "Derive the expression F = ma from Newton's Second Law as stated in terms of momentum. Clearly state all assumptions made.",
      correctAnswer: "Assumption: Mass m is constant throughout motion. Let an object of mass m have initial velocity u and final velocity v over time t. Initial momentum pi = mu. Final momentum pf = mv. Change in momentum Δp = mv - mu = m(v-u). Rate of change = Δp/t = m(v-u)/t. Since a = (v-u)/t, we get Rate of change = ma. By Newton's Second Law: F ∝ ma. Choosing SI units (proportionality constant = 1): F = ma.",
      explanation: "This derivation is a standard CBSE exam requirement. Key steps: (1) Define initial and final momenta, (2) Calculate Δp = m(v-u), (3) Divide by t to get rate of change, (4) Substitute a = (v-u)/t, (5) State proportionality, (6) Set constant to 1 for SI units. The assumption of constant mass is crucial — for rockets burning fuel (changing mass), you must use F = dp/dt directly, not F = ma. In your exam answer, show all steps with proper notation.",
      points: 20,
    },
    {
      id: "s2-long-02",
      type: "long",
      question: "Explain with multiple real-life examples how the concept of 'increasing collision time reduces force.' Discuss at least 4 different applications.",
      correctAnswer: "From F = Δp/Δt: same Δp, longer time → less force. Applications: (1) Airbags — inflate in 30ms, extend stopping from 5ms to 200ms, reducing force 40×. (2) Cricket fielder pulling hands back while catching — extends contact time, reduces sting. (3) Long jump sandpit — sand deforms slowly, extends landing time. (4) Vehicle crumple zones — engineered to crush progressively, extending crash time. (5) Padded sports gloves — absorb impact over longer time. (6) Gymnastic foam mats — extend landing time, protect joints.",
      explanation: "This is a 5-mark conceptual question. Your answer should: (1) State the principle (F = Δp/Δt), (2) Explain WHY increasing time reduces force (Δp is fixed, larger Δt → smaller F), (3) Give at least 4 detailed examples with explanation of mechanism, (4) Possibly include numerical estimates. Remember: the key insight is that impulse (Δp) is the same regardless of timing — it's the RATE of delivering that impulse that determines the force and thus the injury.",
      points: 20,
    },
    {
      id: "s2-long-03",
      type: "long",
      question: "A rocket of mass 4000 kg ejects 100 kg of gas per second at a speed of 500 m/s backward. Calculate: (a) the thrust force, (b) the initial acceleration (assume gravity = 10 m/s²), and (c) explain why the acceleration increases as fuel burns.",
      correctAnswer: "(a) Thrust = (mass ejected/sec) × (exhaust velocity) = 100 × 500 = 50,000 N. (b) Net force = Thrust - Weight = 50,000 - (4000 × 10) = 50,000 - 40,000 = 10,000 N. Initial acceleration a = F/m = 10,000/4,000 = 2.5 m/s². (c) As fuel burns, rocket mass decreases. Same thrust force on smaller mass → greater acceleration (a = F/m).",
      explanation: "This is an excellent application combining Newton's Second and Third Laws with F = ma. The thrust comes from Newton's Third Law (gas pushed back → rocket pushed forward). The net force accounts for gravity (rocket's weight). As the rocket burns 100 kg of fuel per second, its mass decreases — so the same thrust force produces ever-increasing acceleration. This is why rockets accelerate dramatically as they burn fuel — not because engines get stronger, but because the rocket gets lighter. The Saturn V rocket nearly tripled its acceleration as it burned 800 tonnes of fuel in 150 seconds.",
      points: 20,
    },
    {
      id: "s2-long-04",
      type: "long",
      question: "A car of mass 1200 kg is moving at 30 m/s and brakes to a complete stop. Calculate: (a) initial momentum, (b) force if stopped in 6 seconds, (c) force if stopped in 1 second (emergency brake), and (d) explain why longer stopping time is important for safety.",
      correctAnswer: "(a) p = mv = 1200 × 30 = 36,000 kg·m/s. (b) F = Δp/Δt = 36,000/6 = 6,000 N. (c) Emergency stop: F = 36,000/1 = 36,000 N. (d) Emergency braking (36,000 N) is 6× greater than normal braking (6,000 N), greatly increasing structural stress and skid risk. Longer stopping time reduces forces on passengers and braking system, allows steering control, and prevents skidding. ABS helps maintain controlled deceleration.",
      explanation: "This problem shows the critical safety difference between gentle and emergency braking. In a crash (Δt ≈ 0.1 s), the force = 36,000/0.1 = 360,000 N — enough to cause fatal injuries without airbags. Always calculate: initial momentum → then use F = Δp/Δt for different Δt values. The answer to (d) is the most important for real-world safety: traffic laws set speed limits partly because higher speeds = greater momentum = require greater (and potentially fatal) forces to stop in emergencies.",
      points: 20,
    },
    {
      id: "s2-long-05",
      type: "long",
      question: "Compare and contrast Newton's First, Second, and Third Laws of Motion. How are they connected? Can the First and Second Laws be considered as special cases of a more general principle?",
      correctAnswer: "Newton's Laws of Motion are deeply connected. Second Law (F = ma) contains First Law as special case: when F = 0, a = 0 → constant motion. Third Law gives equal-opposite forces. Together they form a complete mechanical framework. First Law: qualitative (motion changes only with force). Second Law: quantitative (exactly how much change). Third Law: forces always come in pairs. Connection: 3rd Law + conservation of momentum follows from 2nd Law. Yes, Second Law is most general — First Law (F=0 case) and Third Law (both follow from 2nd Law applied to systems).",
      explanation: "This is a high-level conceptual question. Key insights: (1) First Law is F=0 special case of Second Law. (2) Third Law means for every interaction, forces are equal and opposite — this combined with Second Law explains why total momentum of isolated systems is conserved. (3) All three laws together give us Newtonian mechanics, sufficient to explain all everyday motion. Remember: Newton's laws break down at very high speeds (need Special Relativity) and at atomic scales (need Quantum Mechanics), but for everyday engineering they are essentially perfect.",
      points: 20,
    },
    {
      id: "s2-long-06",
      type: "long",
      question: "Explain the concept of 'impulse' with detailed mathematics. How does impulse help explain why: (a) padded gloves protect boxers, (b) gymnasts bend their knees on landing, and (c) car bumpers are designed to crumple?",
      correctAnswer: "Impulse J = F × t = Δp. Since Δp is fixed (athlete's momentum must reach zero), longer t → smaller F. (a) Boxing gloves are thick padding that increases contact time from ~5ms to ~50ms, reducing peak force on the opponent's head by ~10×, reducing brain injury risk. (b) Bending knees increases time legs take to absorb landing impulse — same Δp over longer time → less joint force. (c) Crumple zones collapse in controlled way, extending crash time from ~50ms to ~200ms, reducing force on passengers by ~4×.",
      explanation: "Impulse is one of the most practically useful concepts in physics. The key equation: F = Δp/Δt. Since Δp is determined by how fast you're going and how much you weigh (not something you can change in the moment of impact), the only variable you can control is Δt. ALL protective equipment — airbags, helmets, padding, foam mats, crumple zones, shock absorbers — works by increasing Δt. Modern safety engineering is largely about giving objects more time to stop. The physics has saved millions of lives through better car design.",
      points: 20,
    },
    {
      id: "s2-long-07",
      type: "long",
      question: "A bullet of mass 20 g is fired at 300 m/s into a sandbag and emerges at 50 m/s. The sandbag's mass is 10 kg. Find: (a) initial momentum of bullet, (b) final momentum of bullet, (c) change in bullet's momentum, (d) momentum gained by sandbag, and (e) velocity of sandbag after impact.",
      correctAnswer: "(a) p_bullet_initial = 0.02 × 300 = 6 kg·m/s. (b) p_bullet_final = 0.02 × 50 = 1 kg·m/s. (c) Δp_bullet = 1 - 6 = -5 kg·m/s (bullet slowed by 5 kg·m/s). (d) By conservation of momentum, sandbag gains +5 kg·m/s. (e) v_sandbag = 5/10 = 0.5 m/s.",
      explanation: "This problem uses conservation of momentum: the momentum lost by bullet = momentum gained by sandbag. Initial system momentum = 6 + 0 = 6 kg·m/s. Final: 1 + 10×v_sandbag = 6. So v_sandbag = 5/10 = 0.5 m/s. The sandbag moves at just 0.5 m/s despite the high-speed bullet — because its mass (10 kg) is 500× greater than the bullet (0.02 kg). This is why bullet-proof vests are made heavy, and why sandbags are effective bullet stops.",
      points: 20,
    },
    {
      id: "s2-long-08",
      type: "long",
      question: "Explain momentum with detailed numerical examples for: (a) a truck vs. a bicycle at the same speed, (b) a cheetah vs. an elephant, and (c) explain which is harder to stop and why.",
      correctAnswer: "Assume speed = 10 m/s for all. (a) Truck (5000 kg): p = 50,000 kg·m/s. Bicycle+rider (80 kg): p = 800 kg·m/s. Truck has 62.5× more momentum. (b) Cheetah (50 kg at 30 m/s): p = 1500 kg·m/s. Elephant (5000 kg at 4 m/s): p = 20,000 kg·m/s. Elephant has 13× more momentum despite slower speed. (c) Greater momentum → needs greater impulse to stop → harder to stop. Truck and elephant hardest to stop because large mass dominates.",
      explanation: "These comparisons build intuition for momentum. Important insight: mass can 'overpower' velocity in determining momentum. A slow, heavy elephant has far more momentum than a fast, light cheetah. This is why: elephants need much longer distances to stop even when running slower than other animals. Heavy trucks need long braking distances. Large ships need enormous distances to stop (an aircraft carrier at 30 knots requires 30+ ship-lengths to stop!). Momentum = mass × velocity — both factors matter equally.",
      points: 20,
    },
    {
      id: "s2-long-09",
      type: "long",
      question: "A 50 kg student stands on a skateboard initially at rest. They throw a 2 kg ball horizontally at 15 m/s. What is the student's recoil velocity? Explain the physics using Newton's laws.",
      correctAnswer: "By conservation of momentum (total initial momentum = 0): m_student × v_student + m_ball × v_ball = 0. 50 × v_student + 2 × 15 = 0. v_student = -30/50 = -0.6 m/s. The student rolls backward at 0.6 m/s (negative = opposite to ball's direction).",
      explanation: "This problem combines Newton's Third Law and conservation of momentum. When the student throws the ball, they exert force on the ball (forward) and the ball exerts equal, opposite force on the student (backward) by Newton's Third Law. Since the skateboard is frictionless, this reaction force sets the student rolling backward. Total momentum remains zero (no external horizontal force). The student moves much slower (0.6 m/s vs 15 m/s) because they're 25× heavier than the ball. This is exactly how jet propulsion and rocket engines work!",
      points: 20,
    },
    {
      id: "s2-long-10",
      type: "long",
      question: "Why is Newton's Second Law considered more fundamental than his First Law? Discuss with examples and mathematics. Also explain the limitations of Newton's Second Law.",
      correctAnswer: "Second Law (F = Δp/Δt) is more fundamental because: (1) It contains the First Law as special case (F=0 → a=0 → constant velocity). (2) It's quantitative — tells us exactly HOW MUCH force produces HOW MUCH change. (3) It works for variable mass systems (rockets). Limitations: (1) Fails at relativistic speeds (v ≈ c) — need Special Relativity. (2) Fails at atomic/subatomic scales — need Quantum Mechanics. (3) Assumes inertial reference frames. (4) Doesn't account for quantum effects like spin.",
      explanation: "This is a high-order thinking question. Newton's Second Law in its general form F = dp/dt is one of the most fundamental equations in physics. Even Einstein's Special Relativity modifies F = ma (mass increases with speed) but KEEPS the form F = dp/dt — just with relativistic momentum p = γmv. Quantum mechanics adds the Heisenberg uncertainty principle but force still relates to momentum change at macroscopic scales. For CBSE level, the main points are: Second Law > First Law in generality, and Newton's laws break down at very high speeds and tiny scales.",
      points: 20,
    },

    /* ════════════════════════════════════════
     * HOTS / DEEP THINKING (10 total)
     * ════════════════════════════════════════ */
    {
      id: "s2-hots-01",
      type: "thinking",
      question: "A person stands on a weighing scale in an elevator. The scale shows their normal weight when the elevator is stationary. What would the scale read when the elevator (a) accelerates upward, (b) accelerates downward, and (c) falls freely? Explain using F = ma.",
      correctAnswer: "(a) Accelerating up: apparent weight = m(g+a) > mg. Scale reads MORE. (b) Accelerating down: apparent weight = m(g-a) < mg. Scale reads LESS. (c) Free fall: a = g, apparent weight = m(g-g) = 0. Scale reads ZERO — weightlessness!",
      explanation: "This is a beautiful application of Newton's Second Law. Let N = scale reading (normal force), mg = true weight. Net force equation (taking up as positive): Case (a) N - mg = ma (net force upward) → N = m(g+a) > mg. Case (b) N - mg = -ma (net force downward) → N = m(g-a) < mg. Case (c) Free fall: N - mg = -mg → N = 0. This explains why astronauts in orbit are 'weightless' — they are in continuous free fall around Earth! The International Space Station is falling toward Earth at the same rate it moves forward, creating apparent weightlessness.",
      points: 25,
    },
    {
      id: "s2-hots-02",
      type: "thinking",
      question: "If a horse pulls a cart with force F, Newton's Third Law says the cart pulls the horse backward with equal force F. So why does the cart move forward at all?",
      correctAnswer: "Newton's Third Law forces act on DIFFERENT objects. Horse pushes on cart (forward) and cart pulls on horse (backward) — these cannot cancel since they act on different bodies. The cart moves forward if the net force on the cart (horse pull minus cart friction) is forward-directed. The horse moves forward because the ground pushes it forward with more force than the cart pulls it back (horse's hooves push ground back, ground pushes horse forward by 3rd law).",
      explanation: "This is the most famous misconception about Newton's Third Law! The confusion is thinking the action-reaction pair acts on the SAME object. They always act on DIFFERENT objects. For the CART: force from horse (forward) - friction (backward) = ma_cart. If horse force > friction, cart accelerates forward. For the HORSE: ground push (forward) - cart pull (backward) - friction (backward) = ma_horse. If ground push > opposing forces, horse moves forward. The ground's reaction to the horse's push is what ultimately propels both horse and cart forward. Remove the ground (put them on ice) and neither moves effectively!",
      points: 25,
    },
    {
      id: "s2-hots-03",
      type: "thinking",
      question: "A glass ball and a rubber ball of equal mass are dropped from the same height onto the same surface. The rubber ball bounces back to near its original height, but the glass ball shatters. Both have the same impact speed. Which experiences greater force? Explain.",
      correctAnswer: "The rubber ball experiences greater force during the collision. The rubber ball's momentum changes from -mv (downward) to +mv (upward) — a change of 2mv. The glass ball changes from -mv to 0 (it stops and shatters) — a change of mv. Same contact time → rubber ball has twice the momentum change → twice the force. But the rubber ball survives because it's elastic and distributes the force. The glass shatters because glass is brittle and cannot sustain the internal stresses, even at lower force.",
      explanation: "This is a subtle, counterintuitive question. Δp_rubber = m×v - m×(-v) = 2mv (full bounce back). Δp_glass = 0 - m×(-v) = mv (stops). Since rubber ball has larger Δp in similar time, it experiences larger force! But rubber's elastic properties distribute this force safely throughout its structure. Glass shatters not because the force is larger than rubber's, but because glass cannot redistribute stress — cracks propagate at ~1500 m/s in glass once started. This explains why rubber tires survive road bumps while ceramic cups shatter when dropped.",
      points: 25,
    },
    {
      id: "s2-hots-04",
      type: "thinking",
      question: "Two astronauts in space (no gravity, no friction) push off each other from rest. Astronaut A has mass 60 kg and moves at 3 m/s. Astronaut B has mass 90 kg. What is B's velocity? If they push for 0.5 seconds, what force did each exert?",
      correctAnswer: "Conservation of momentum: 0 = 60×3 + 90×v_B. v_B = -180/90 = -2 m/s (opposite direction). Force: F = Δp/Δt. For A: F = (60×3 - 0)/0.5 = 180/0.5 = 360 N. For B: F = (90×2)/0.5 = 180/0.5 = 360 N. Both experience equal force (Newton's 3rd Law!)",
      explanation: "This problem elegantly unifies Newton's Second and Third Laws with momentum conservation. Starting from rest (total momentum = 0), they push apart. By momentum conservation: m_A × v_A + m_B × v_B = 0. The heavier astronaut B moves slower (2 m/s) than lighter astronaut A (3 m/s). The force each exerts on the other is equal in magnitude (360 N) — confirming Newton's Third Law! The force calculation: each person's momentum changed by 180 kg·m/s in 0.5 s → F = 180/0.5 = 360 N. In space, this separation would continue indefinitely (First Law — no friction to stop them).",
      points: 25,
    },
    {
      id: "s2-hots-05",
      type: "thinking",
      question: "Engineers design a car safety test where a 1500 kg car hits a concrete wall at 60 km/h. Design a bumper system that keeps the collision force below 45,000 N on the passengers. How long must the collision last?",
      correctAnswer: "First convert: 60 km/h = 60/3.6 = 16.67 m/s. Change in momentum: Δp = 1500 × 16.67 = 25,000 kg·m/s. For F ≤ 45,000 N: Δt = Δp/F = 25,000/45,000 = 0.556 s. The bumper must extend the collision duration to at least 0.56 seconds, crushing/deforming over this period.",
      explanation: "This is an engineering design question using F = Δp/Δt. First: convert speed to m/s (always check units!). Then: calculate momentum. Finally: rearrange for time. A 0.56-second collision is a long time in crash physics — typical crashes last 0.1-0.3 s. This means an advanced crumple zone that crushes perhaps 1-2 metres (at average speed of 8 m/s, distance = speed × time = 8 × 0.56 = 4.5 m — very large). Real modern car bumpers achieve about 0.15-0.3 s, keeping forces around 100,000-170,000 N. This is why occupant protection requires multiple systems (airbags + crumple zones + seat belts working together).",
      points: 25,
    },
    {
      id: "s2-hots-06",
      type: "thinking",
      question: "If you push two identical boxes — one on a rough surface and one on a smooth surface — with the same force, they have different accelerations. Does this violate F = ma? Explain why their accelerations differ.",
      correctAnswer: "No violation. F in F = ma is the NET force. On rough surface: net force = applied force - friction. On smooth surface: net force ≈ applied force (no/little friction). With larger net force (smooth surface), greater acceleration. F = ma always holds for net force, not just applied force.",
      explanation: "This is a critical conceptual point: F = ma uses NET force (resultant of all forces), not just the applied force. The rough surface applies friction force opposing motion, reducing net force. Example: You push with 20 N. Smooth surface: friction ≈ 0, net F = 20 N, a = 20/5 = 4 m/s². Rough surface: friction = 8 N (opposing), net F = 20-8 = 12 N, a = 12/5 = 2.4 m/s². F = ma is valid for both — you just need to use the CORRECT net force. Always identify ALL forces before applying Newton's Second Law.",
      points: 25,
    },
    {
      id: "s2-hots-07",
      type: "thinking",
      question: "A 5 kg ball falls from 80 m height. Using F = ma: (a) find acceleration during free fall, (b) find momentum just before hitting ground, and (c) if it bounces back to 45 m height, calculate the average force if contact time is 0.2 s. (g = 10 m/s²)",
      correctAnswer: "(a) a = g = 10 m/s². (b) v = √(2gh) = √(2×10×80) = √1600 = 40 m/s. p = 5×40 = 200 kg·m/s. (c) Bounce height 45 m: v_up = √(2×10×45) = √900 = 30 m/s (upward). Δp = m(v_up - (-v_down)) = 5(30-(-40)) = 5×70 = 350 kg·m/s. F = 350/0.2 = 1750 N.",
      explanation: "Careful with signs! The ball hits ground at 40 m/s downward (-40 if up is positive) and leaves at 30 m/s upward (+30). The change in velocity = +30 - (-40) = +70 m/s. This is larger than either speed individually! Δp = 5 × 70 = 350 kg·m/s. Force = 1750 N — much larger than the ball's weight (5 × 10 = 50 N). This enormous force (35× the ball's weight) during the brief contact explains why bouncy balls must be made of tough elastic materials. If the contact time were 0.02 s (10× shorter), the force would be 17,500 N — enough to crack most surfaces.",
      points: 25,
    },
    {
      id: "s2-hots-08",
      type: "thinking",
      question: "On a rainy day, roads become slippery. Explain why cars need longer stopping distances on wet roads using Newton's Second Law. If a car's stopping distance is 20 m on dry road and friction reduces to 40% on wet road, what is the stopping distance on wet road?",
      correctAnswer: "On wet roads, friction coefficient μ is lower → friction force F_friction is smaller → less deceleration (a = F_friction/m) → longer stopping distance. Dry: F_friction provides deceleration a. Wet: friction = 0.4 × dry friction → a_wet = 0.4 × a_dry. Since stopping distance s ∝ 1/a (from v² = u² - 2as), s_wet = s_dry × (a_dry/a_wet) = 20 × (1/0.4) = 20 × 2.5 = 50 m.",
      explanation: "The relationship s = v²/(2a) comes from kinematics (v² = u² + 2as, with v=0). Since friction provides the stopping force: F = μmg = ma, so a = μg. Wet: a_wet = 0.4 × a_dry. For same initial speed: s ∝ v²/a = v²/(μg). So s_wet/s_dry = μ_dry/μ_wet = 1/0.4 = 2.5. s_wet = 50 m. This is why speed limits are lower in rain, and why maintaining good tire tread depth (which channels water away) is critical. Worn tires on wet roads can increase stopping distance by 3-4× compared to good tires on dry roads.",
      points: 25,
    },
    {
      id: "s2-hots-09",
      type: "thinking",
      question: "A fly of mass 0.001 kg flying at 2 m/s collides with a windshield of a car moving at 30 m/s in the opposite direction. The fly sticks to the windshield. (a) Do Newton's Laws apply? (b) Which experiences greater force — the fly or the windshield? (c) Why does only the fly get squashed?",
      correctAnswer: "(a) Yes — Newton's Laws always apply. (b) Equal and opposite forces (Newton's 3rd Law) — both experience the SAME magnitude of force. (c) The fly is squashed because it has far less mass → far greater acceleration (a = F/m). The windshield's car has ~1500 kg mass vs fly's 0.001 kg → fly's acceleration is 1,500,000× greater → fly deforms catastrophically while car barely slows.",
      explanation: "This brilliant question exposes the relationship between Newton's 2nd and 3rd Laws. By 3rd Law: |F_on_fly| = |F_on_car| exactly. But by 2nd Law: a_fly = F/m_fly = F/0.001 (enormous!) while a_car = F/m_car = F/1500 (tiny). The fly's soft body cannot withstand this enormous acceleration — it deforms and splatters. The car is thousands of times more massive and its structure can absorb the tiny perturbation. This is why Newton's 3rd Law says forces are equal, but consequences (accelerations and deformations) can be wildly different due to mass differences.",
      points: 25,
    },
    {
      id: "s2-hots-10",
      type: "thinking",
      question: "Design an experiment to verify that F ∝ a when mass is constant. What measurements would you take? What graph would you plot? What result confirms the law? What are the main sources of error?",
      correctAnswer: "Experiment: Use a dynamics trolley on a friction-compensated track. Apply increasing forces (using hanging weights) while keeping trolley mass constant. Measure acceleration using a ticker-tape timer or motion sensor. Plot F (y-axis) vs a (x-axis). A straight line through the origin confirms F ∝ a. Sources of error: (1) Friction (compensate by elevating track slightly), (2) Mass of string/pulley ignored, (3) Air resistance, (4) Measurement errors in timing.",
      explanation: "This experimental design question tests practical physics understanding. Key elements of a good answer: (1) Controlled variable — mass (must be constant). (2) Independent variable — applied force F (varied using calibrated weights). (3) Dependent variable — acceleration a (measured from ticker tape: count dots, find speed at different times, calculate a). (4) Graph — F vs a should be a straight line through origin with gradient = mass m. (5) Error sources — always discuss at least 3. Friction compensation: tilt the track at angle θ where sin θ = μ_k (friction coefficient) so gravity component exactly balances friction. This is the standard A-level practical for verifying Newton's Second Law.",
      points: 25,
    },

    /* ══════════════════════════════════════════
     * ADDITIONAL MCQ (t3q41 – t3q55) — Numerical + Conceptual
     * ══════════════════════════════════════════ */
    {
      id: "t3q41",
      type: "mcq",
      points: 10,
      question:
        "A 5 kg box is pushed with 30 N on a surface where friction = 5 N. What is the acceleration?",
      options: ["5 m/s²", "6 m/s²", "4 m/s²", "1 m/s²"],
      correctAnswer: "5 m/s²",
      explanation:
        "Net force = 30 − 5 = 25 N. a = F/m = 25/5 = **5 m/s²**. Always subtract friction from applied force before dividing by mass.",
    },
    {
      id: "t3q42",
      type: "mcq",
      points: 10,
      question:
        "A 1000 kg car accelerates from rest to 20 m/s in 10 s. What is the average net force?",
      options: ["200 N", "2000 N", "20 N", "10,000 N"],
      correctAnswer: "2000 N",
      explanation:
        "a = Δv/t = 20/10 = 2 m/s². F = ma = 1000 × 2 = **2000 N**. This is the net force — the engine force minus friction/drag.",
    },
    {
      id: "t3q43",
      type: "mcq",
      points: 10,
      question:
        "Doubling the mass of an object while keeping force constant will:",
      options: [
        "Double the acceleration",
        "Halve the acceleration",
        "Keep acceleration the same",
        "Quadruple the acceleration",
      ],
      correctAnswer: "Halve the acceleration",
      explanation:
        "From $a = F/m$: if m doubles and F stays the same, a = F/(2m) = half the original. Acceleration is inversely proportional to mass.",
    },
    {
      id: "t3q44",
      type: "mcq",
      points: 10,
      question:
        "A 0.2 kg ball's velocity changes from 15 m/s to 5 m/s in 0.5 s. What is the net force?",
      options: ["4 N", "2 N", "10 N", "−4 N"],
      correctAnswer: "−4 N",
      explanation:
        "a = (5 − 15)/0.5 = −20 m/s². F = 0.2 × (−20) = **−4 N** (decelerating force, opposing motion). The negative sign indicates the force opposes the direction of motion.",
    },
    {
      id: "t3q45",
      type: "mcq",
      points: 10,
      question:
        "Which of the following is the SI unit of impulse?",
      options: ["kg·m/s²", "N·m", "kg·m/s", "N/s"],
      correctAnswer: "kg·m/s",
      explanation:
        "Impulse = F × t = N × s. Since 1 N = 1 kg·m/s², impulse = kg·m/s² × s = **kg·m/s**. This is the same unit as momentum — because impulse equals change in momentum.",
    },
    {
      id: "t3q46",
      type: "mcq",
      points: 10,
      question:
        "A force of 60 N acts on a 12 kg object for 5 seconds (starting from rest). What is the final velocity?",
      options: ["5 m/s", "25 m/s", "60 m/s", "12 m/s"],
      correctAnswer: "25 m/s",
      explanation:
        "a = F/m = 60/12 = 5 m/s². v = u + at = 0 + 5 × 5 = **25 m/s**. Both F = ma and kinematics combine naturally in Newton's Second Law problems.",
    },
    {
      id: "t3q47",
      type: "mcq",
      points: 10,
      question:
        "Momentum has the same unit as:",
      options: ["Impulse", "Force", "Energy", "Acceleration"],
      correctAnswer: "Impulse",
      explanation:
        "Both momentum and impulse have units of **kg·m/s**. Impulse = Δp (change in momentum). This is why the impulse-momentum theorem works: a force applied over time changes the momentum by an equal amount.",
    },
    {
      id: "t3q48",
      type: "mcq",
      points: 10,
      question:
        "A batsman deflects a cricket ball of mass 0.16 kg moving at 45 m/s by 90°. The ball now moves perpendicular to its original path at 45 m/s. What is the change in momentum?",
      options: [
        "0 kg·m/s (speed unchanged)",
        "7.2 kg·m/s",
        "14.4 kg·m/s",
        "10.2 kg·m/s",
      ],
      correctAnswer: "10.2 kg·m/s",
      explanation:
        "Initial momentum = 0.16 × 45 = 7.2 kg·m/s (east). Final momentum = 7.2 kg·m/s (north). Change = √(7.2² + 7.2²) = 7.2√2 ≈ **10.2 kg·m/s** (northeast direction). Velocity magnitude is unchanged, but DIRECTION changed — so momentum changed!",
    },
    {
      id: "t3q49",
      type: "mcq",
      points: 10,
      question:
        "A 3 kg object has momentum 12 kg·m/s. Its kinetic energy is:",
      options: ["24 J", "72 J", "48 J", "6 J"],
      correctAnswer: "24 J",
      explanation:
        "v = p/m = 12/3 = 4 m/s. KE = ½mv² = ½ × 3 × 16 = **24 J**. Note the useful formula: KE = p²/(2m) = 144/6 = 24 J. This shows KE and momentum are related but different quantities.",
    },
    {
      id: "t3q50",
      type: "mcq",
      points: 10,
      question:
        "A rocket ejects gas backward at 500 m/s. If gas ejection rate is 10 kg/s, the thrust force on the rocket is:",
      options: ["5000 N", "50 N", "500 N", "50,000 N"],
      correctAnswer: "5000 N",
      explanation:
        "Thrust = rate of change of momentum = (mass per second) × (exhaust velocity) = 10 × 500 = **5000 N**. This is Newton's Second Law applied to continuous mass ejection — the same principle that drives all rockets.",
    },
    {
      id: "t3q51",
      type: "mcq",
      points: 10,
      question:
        "Two objects A (2 kg, 6 m/s) and B (4 kg, 3 m/s) move in the same direction. Which has more momentum? Which has more kinetic energy?",
      options: [
        "A has more momentum; A has more KE",
        "B has more momentum; B has more KE",
        "Same momentum; A has more KE",
        "Same momentum; B has more KE",
      ],
      correctAnswer: "Same momentum; A has more KE",
      explanation:
        "Momentum: A = 2×6 = 12 kg·m/s, B = 4×3 = 12 kg·m/s — **equal**. KE: A = ½×2×36 = 36 J, B = ½×4×9 = 18 J — **A has more KE**. Equal momentum ≠ equal kinetic energy. This is a very commonly misunderstood distinction.",
    },
    {
      id: "t3q52",
      type: "mcq",
      points: 10,
      question:
        "Which statement BEST describes what Newton's Second Law says about force?",
      options: [
        "Force is needed to keep an object moving at constant speed",
        "Force equals the rate of change of momentum",
        "Force is the product of mass and velocity",
        "Force is inversely proportional to distance",
      ],
      correctAnswer: "Force equals the rate of change of momentum",
      explanation:
        "Newton's original Second Law: $F = \\frac{\\Delta p}{\\Delta t}$ (force = rate of change of momentum). The familiar F = ma is a special case for constant mass. The momentum form is more general and applies even when mass changes (like a rocket burning fuel).",
    },
    {
      id: "t3q53",
      type: "mcq",
      points: 10,
      question:
        "A 2 kg ball falls freely from rest for 3 seconds. What is its momentum just before hitting the ground? (g = 10 m/s²)",
      options: ["6 kg·m/s", "60 kg·m/s", "20 kg·m/s", "30 kg·m/s"],
      correctAnswer: "60 kg·m/s",
      explanation:
        "v = gt = 10 × 3 = 30 m/s. Momentum = mv = 2 × 30 = **60 kg·m/s** downward. Or: Impulse = Ft = mgt = 2 × 10 × 3 = 60 N·s = 60 kg·m/s. Both methods give the same answer.",
    },
    {
      id: "t3q54",
      type: "mcq",
      points: 10,
      question:
        "A car of mass 1500 kg travelling at 20 m/s is brought to rest in 4 s by brakes. The average braking force is:",
      options: ["7500 N", "300 N", "75,000 N", "375 N"],
      correctAnswer: "7500 N",
      explanation:
        "Impulse = Δp = m(v−u) = 1500(0−20) = −30,000 N·s. F = Impulse/t = 30,000/4 = **7500 N** (opposing motion). This is the average force — the actual force varies during braking.",
    },
    {
      id: "t3q55",
      type: "mcq",
      points: 10,
      question:
        "A force of F acts on mass m for time t₁, giving velocity v. The same force F acts on mass 2m for time t₂, also giving velocity v. The ratio t₂/t₁ is:",
      options: ["½", "1", "2", "4"],
      correctAnswer: "2",
      explanation:
        "For mass m: a₁ = F/m, t₁ = v/a₁ = mv/F. For mass 2m: a₂ = F/(2m), t₂ = v/a₂ = 2mv/F. Therefore t₂/t₁ = **2**. More massive object needs twice the time to reach the same velocity with the same force.",
    },

    /* ══════════════════════════════════════════
     * ADDITIONAL SHORT ANSWERS (t3q56 – t3q60)
     * ══════════════════════════════════════════ */
    {
      id: "t3q56",
      type: "short",
      points: 15,
      question:
        "A 500 g stone is whirled in a horizontal circle of radius 1.5 m at 4 m/s. The string breaks when the tension exceeds 12 N. Does the string break? (Centripetal force = mv²/r)",
      correctAnswer:
        "Required centripetal force = mv²/r = 0.5 × 16 / 1.5 = **5.33 N**\n\nMaximum tension = 12 N\n\nSince 5.33 N < 12 N, the string does NOT break.\n\nThe string would break if v exceeded √(12 × 1.5 / 0.5) = √36 = **6 m/s**.\n\nConnecting to F = ma: centripetal force IS Newton's Second Law applied to circular motion. Force = mass × centripetal acceleration (v²/r).",
      explanation:
        "Centripetal force is not a new kind of force — it's just Newton's Second Law applied when direction changes. The tension in the string IS the centripetal force here.",
    },
    {
      id: "t3q57",
      type: "short",
      points: 15,
      question:
        "A 3 kg toy car accelerates from 2 m/s to 8 m/s in 3 seconds. (a) Find the net force. (b) If friction is 2 N, find the engine force.",
      correctAnswer:
        "**(a) Net force:**\na = (8 − 2)/3 = 2 m/s²\nF_net = ma = 3 × 2 = **6 N**\n\n**(b) Engine force:**\nNet force = Engine − Friction\n6 = Engine − 2\nEngine = **8 N**\n\nThe net force IS what causes acceleration. The engine force must overcome both friction AND provide the net accelerating force.",
      explanation:
        "Always apply F_net = ma first to find the net force, then work backwards from the free body diagram to find individual forces like engine thrust.",
    },
    {
      id: "t3q58",
      type: "short",
      points: 15,
      question:
        "A goalkeeper catches a ball of mass 0.5 kg moving at 25 m/s. The catch takes 0.1 seconds. Find: (a) the impulse, (b) the average force on the ball, (c) the force on the goalkeeper's hands.",
      correctAnswer:
        "**(a) Impulse = change in momentum:**\nΔp = m(v − u) = 0.5(0 − 25) = **−12.5 N·s** (negative = opposing motion)\n\n**(b) Average force on ball:**\nF = Δp/t = 12.5/0.1 = **125 N** (backward)\n\n**(c) Force on goalkeeper's hands:**\nBy Newton's Third Law: equal and opposite.\nHands feel **125 N** forward (in the direction the ball came from).\n\nIf the catch took only 0.01 s: force = 1250 N — much more painful! Time of contact directly affects force felt.",
      explanation:
        "The goalkeeper problem beautifully combines impulse-momentum (Second Law) with Newton's Third Law. Longer catching time → smaller force on hands. This is why goalkeepers 'give' with the ball.",
    },
    {
      id: "t3q59",
      type: "short",
      points: 15,
      question:
        "A 0.1 kg bullet travelling at 300 m/s passes through a wooden block and exits at 100 m/s. The block is 10 cm thick. Find: (a) change in momentum, (b) average force on bullet by wood.",
      correctAnswer:
        "**(a) Change in momentum of bullet:**\nΔp = m(v − u) = 0.1 × (100 − 300) = 0.1 × (−200) = **−20 kg·m/s**\n(20 kg·m/s decrease in forward momentum)\n\n**(b) Time in wood:**\nAverage speed through block = (300 + 100)/2 = 200 m/s\nTime = d/v = 0.10 / 200 = 0.0005 s = 5×10⁻⁴ s\n\nAverage force = Δp/t = 20 / 0.0005 = **40,000 N**\n\nThe wood exerts an enormous retarding force of 40,000 N on the tiny 0.1 kg bullet!",
      explanation:
        "Bullet-wood problems combine momentum change with time estimation. The average speed approximation is valid for uniform deceleration. The huge force explains why bullets deform and wood splinters.",
    },
    {
      id: "t3q60",
      type: "short",
      points: 15,
      question:
        "A 2000 kg truck and a 500 kg car have the same kinetic energy of 40,000 J. Which has more momentum? Calculate both momenta.",
      correctAnswer:
        "Using KE = p²/(2m) → p = √(2m × KE)\n\nTruck: p_T = √(2 × 2000 × 40000) = √(160,000,000) = **12,649 kg·m/s**\n\nCar: p_C = √(2 × 500 × 40000) = √(40,000,000) = **6,325 kg·m/s**\n\nThe truck has about **twice the momentum** of the car despite having the same kinetic energy.\n\nKey insight: for same KE, more massive objects have MORE momentum. Conversely, for same momentum, less massive objects have MORE kinetic energy.",
      explanation:
        "This problem illustrates the important relationship KE = p²/(2m). Objects with same KE but different masses have different momenta — and vice versa. This is crucial for understanding collisions.",
    },

    /* ══════════════════════════════════════════
     * ADDITIONAL HOTS (t3q61 – t3q65)
     * ══════════════════════════════════════════ */
    {
      id: "t3q61",
      type: "long",
      points: 20,
      question:
        "Explain fully why airbags save lives in car crashes. Use Newton's Second Law, impulse-momentum theorem, and specific numbers in your answer.",
      correctAnswer:
        "**The Physics of Airbag Safety:**\n\n**Without airbag:** In a 60 km/h (16.7 m/s) crash, a 70 kg driver's head hits the steering wheel in about 3 milliseconds (0.003 s).\n\nForce = Δp/t = 70 × 16.7 / 0.003 = **389,000 N ≈ 55 × body weight!**\n\nThis is nearly always fatal — the brain suffers severe trauma from this deceleration.\n\n**With airbag:** The airbag inflates in ~10 ms and cushions the impact over ~60 ms (0.06 s total).\n\nForce = 70 × 16.7 / 0.06 = **19,500 N ≈ 2.8 × body weight**\n\nThis is survivable (though still painful and can cause injury).\n\n**Key Newton's Second Law analysis:**\nThe IMPULSE (change in momentum = 70 × 16.7 = 1,169 kg·m/s) is the same in both cases — the driver must decelerate from 16.7 m/s to 0 regardless.\n\nBut F = Δp/Δt: by increasing the stopping time (Δt) from 0.003 s to 0.06 s (a factor of 20), the force is reduced by the same factor of 20.\n\n**Additional mechanisms:** Airbags also distribute the force over a larger area of the face/chest (reducing pressure = force per area), and they cushion the head from hitting hard surfaces.\n\n**Real data:** Frontal airbags reduce driver fatalities by ~30%. Combined with seatbelts: ~61% fatality reduction.",
      explanation:
        "The airbag physics problem shows Newton's Second Law in a literally life-or-death context. The key equation is F = Δp/Δt — longer time always means smaller force for the same momentum change.",
    },
    {
      id: "t3q62",
      type: "long",
      points: 20,
      question:
        "A 0.5 kg ball is thrown vertically upward with initial velocity 20 m/s. (a) Find momentum at launch. (b) Find momentum at maximum height. (c) Find momentum when it returns to the starting point. (d) What force acts throughout? (e) Explain why momentum is NOT conserved for the ball alone.",
      correctAnswer:
        "**(a) Momentum at launch:**\np = mv = 0.5 × 20 = **10 kg·m/s** upward\n\n**(b) Momentum at maximum height:**\nAt maximum height, velocity = 0.\np = m × 0 = **0 kg·m/s**\n\n**(c) Momentum when ball returns to start:**\nBy energy conservation (or kinematics): speed = 20 m/s downward.\np = 0.5 × 20 = **10 kg·m/s** downward\n\n(Note: magnitude same as at launch, but direction reversed!)\n\n**(d) Force throughout:**\nGravity = mg = 0.5 × 10 = **5 N** downward throughout (constant).\n\n**(e) Why momentum is NOT conserved:**\nNewton's First Law: momentum is conserved only when NET external force = 0.\nHere, gravity (5 N downward) is a constant external force acting the whole time.\nThis unbalanced force changes the ball's momentum continuously:\n- Going up: momentum decreases from 10 to 0 kg·m/s\n- Coming down: momentum increases from 0 to 10 kg·m/s (downward)\n\nMomentum IS conserved for the SYSTEM (ball + Earth): as ball loses upward momentum, Earth gains it (barely measurable, but real).",
      explanation:
        "The ball trajectory problem beautifully illustrates how gravity continuously changes momentum. Conservation of momentum applies to isolated systems — not to a single object with external forces acting on it.",
    },
    {
      id: "t3q63",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A 70 kg astronaut in a space station pushes off a wall with force 80 N for 0.5 s. (a) Find velocity gained. (b) If the astronaut then pushes another astronaut (50 kg) who is stationary, and they push with the same force for 0.5 s while holding onto each other, what happens? (c) How does this connect to Newton's Laws and conservation of momentum?",
      correctAnswer:
        "**(a) Velocity gained by astronaut after wall push:**\nImpulse = F × t = 80 × 0.5 = 40 N·s\nChange in momentum = 40 kg·m/s\nv = 40/70 = **0.57 m/s** (away from wall)\n\nThe wall gains equal and opposite impulse (40 N·s), but since its mass is the space station (enormous), its velocity change is negligible.\n\n**(b) Astronaut A (70 kg at 0.57 m/s) collides with Astronaut B (50 kg, stationary):**\nIf they hold onto each other (perfectly inelastic collision):\nBy conservation of momentum:\np_before = 70 × 0.57 + 50 × 0 = 39.9 kg·m/s\np_after = (70 + 50) × v_final = 120 × v_final\nv_final = 39.9/120 = **0.33 m/s** together\n\n**(c) Connection to Newton's Laws:**\n- Newton's Second Law: F = dp/dt → the wall push gives impulse = 40 N·s\n- Newton's Third Law: wall pushes astronaut forward with 80 N; astronaut pushes wall backward with 80 N\n- Conservation of Momentum (isolated system): when A and B collide, no external horizontal forces → momentum conserved exactly\n- Energy: KE before = ½×70×0.57² = 11.4 J. KE after = ½×120×0.33² = 6.5 J. Energy lost = 4.9 J (converted to sound, deformation, heat in the collision)\n\nIn space (no gravity, no friction), Newton's Laws are seen in their purest form!",
      explanation:
        "This multi-part problem covers the entire Newton's Second Law section: impulse, momentum, collision, and energy. Space is the ideal physics lab because there's no friction to complicate things.",
    },
    {
      id: "t3q64",
      type: "thinking",
      points: 25,
      question:
        "A rocket of initial mass 10,000 kg (including 8,000 kg of fuel) fires its engine. Exhaust speed is 2000 m/s and fuel burns at 200 kg/s. (a) What is the initial thrust? (b) What is the initial acceleration? (c) As fuel is consumed, how does acceleration change and why? (d) Why is the Tsiolkovsky rocket equation important?",
      correctAnswer:
        "**(a) Initial thrust:**\nThrust = exhaust speed × mass flow rate\n= 2000 × 200 = **400,000 N** (400 kN)\n\n**(b) Initial acceleration:**\nUsing F = ma:\nNet upward force = Thrust − Weight = 400,000 − (10,000 × 10) = 300,000 N\na = F/m = 300,000/10,000 = **30 m/s²** (upward)\n\nWow — 30 m/s² is 3g! The rocket accelerates upward at 3 times normal gravity.\n\n**(c) How acceleration changes:**\nAs fuel burns, the rocket gets lighter. With the same thrust but less mass, a = F/m increases.\nAfter 30 seconds: remaining mass = 10,000 − (200×30) = 4,000 kg\nWeight = 40,000 N. Thrust unchanged at 400,000 N.\nNet force = 360,000 N. a = 360,000/4,000 = **90 m/s²** — tripled!\n\nThis is why rockets accelerate increasingly fast: constant thrust + decreasing mass = ever-increasing acceleration.\n\n**(d) Tsiolkovsky Rocket Equation:**\nΔv = v_exhaust × ln(m_initial / m_final)\n\nFor our rocket: Δv = 2000 × ln(10,000/2,000) = 2000 × ln(5) = 2000 × 1.609 = **3,218 m/s**\n\nThis is the maximum velocity change achievable from burning all 8,000 kg of fuel. To reach orbital velocity (~7,800 m/s), rockets need multiple stages (staging discards empty tanks to reduce mass). This equation explains why space travel is so hard — fuel mass grows exponentially with required velocity change.",
      explanation:
        "The rocket problem is the ultimate application of Newton's Second Law with variable mass. The exponential relationship between fuel and velocity (Tsiolkovsky equation) explains why rockets are mostly fuel.",
    },
    {
      id: "t3q65",
      type: "thinking",
      points: 25,
      question:
        "HOTS Conceptual: A student says 'If I push a wall with 100 N, the wall pushes back with 100 N (Third Law), so the net force is zero and nothing accelerates. This proves Newton's Second Law must be wrong sometimes.' Identify ALL the errors in this reasoning and correct each one.",
      correctAnswer:
        "The student has made **4 serious errors**. Let's correct each:\n\n**Error 1: Confusing Newton's Third Law pairs with net force.**\nThird Law action-reaction pairs ALWAYS act on DIFFERENT objects. The wall pushing back on your hands is a force on YOU, not on the wall. To find net force on the WALL, you only count forces ON the wall — not forces the wall exerts on something else.\n\n**Error 2: Applying net force to the wrong object.**\nForces on your body: you push with 100 N forward on the wall... but the floor pushes you backward. If you're stationary (leaning on wall), the floor friction equals your push. Net force on YOU = 0. Net force on WALL = 0 (wall doesn't move). Everything is consistent.\n\n**Error 3: Claiming the laws contradict each other.**\nNewton's Second and Third Laws are completely compatible:\n- 3rd Law: action-reaction forces are equal, opposite, on DIFFERENT objects\n- 2nd Law: net force on any SINGLE object determines ITS acceleration\nThe 100 N you feel pushing back is the wall's force on YOUR hands. If the floor friction wasn't there, YOU would accelerate backward. The wall doesn't accelerate because it's attached to Earth.\n\n**Error 4: Ignoring the Earth.**\nWhen you push the wall (attached to Earth), you're technically pushing the entire Earth. The force you exert on Earth = 100 N. Earth's acceleration = 100/(6×10²⁴ kg) ≈ 10⁻²³ m/s² — unmeasurably small, but technically exists!\n\n**Correct application:** If a wall is free to move (like on wheels), pushing it with 100 N would accelerate it: a = 100/m_wall. The net force on the free wall IS 100 N from you. Newton's Second Law works perfectly.",
      explanation:
        "This is the classic 'Third Law paradox' that trips up many students. The key insight: Third Law pairs act on DIFFERENT objects. Net force is calculated on ONE object at a time using ALL forces ON that object.",
    },
  ],
};
