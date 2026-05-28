/**
 * FILE: topic-5-conservation-of-momentum.ts
 * LOCATION: src/lib/content/class9/science/force-and-laws-of-motion/topic-5-conservation-of-momentum.ts
 * PURPOSE: Deep, richly detailed content for Topic 5 — Conservation of Momentum.
 *          Covers the law of conservation, elastic vs inelastic collisions, explosions,
 *          derivation from Newton's Third Law, and real-world applications. 20 questions.
 * CURRICULUM: CBSE Class 9 Science, Chapter 9 — Force & Laws of Motion
 * LAST UPDATED: 2026-05-28
 */
import { Topic } from "./types";

export const conservationOfMomentum: Topic = {
  id: "conservation-of-momentum",
  title: "5. Law of Conservation of Momentum",
  estimatedMinutes: 40,
  imageUrl:
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200",

  content: `
### The Most Powerful Law in Classical Mechanics

Newton's three laws describe how individual objects respond to forces. But what about systems of multiple objects that interact with each other? What governs collisions, explosions, and complex interactions?

The answer is the **Law of Conservation of Momentum** — one of the most fundamental and universally powerful laws in all of physics.

---

### Recap: What is Momentum?

> **Momentum (p) = Mass × Velocity**
> $$p = mv$$

Momentum is a **vector** — it has both magnitude and direction. Its SI unit is **kg·m/s**.

Key examples:
* A slow, heavy truck can have more momentum than a fast, light bicycle.
* A stationary object has zero momentum, regardless of mass.
* Two objects moving in opposite directions can have momentums that partially or fully cancel.

---

### The Law of Conservation of Momentum

> **"The total momentum of an isolated system remains constant, provided no external unbalanced force acts on the system."**

In mathematical form, for a system of two objects before (i) and after (f) an interaction:

$$m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2$$

![Figure 1: Two balls colliding on a frictionless surface. Total momentum before collision equals total momentum after collision.](/images/momentum_conservation.png)


Where:
* $m_1$, $m_2$ = masses of the two objects
* $u_1$, $u_2$ = initial velocities (before collision/interaction)
* $v_1$, $v_2$ = final velocities (after collision/interaction)

**Critical condition:** This law holds only when there is **no external unbalanced force** acting on the system. Internal forces between the objects (like collision forces) do NOT change total momentum.

---

### Derivation from Newton's Third Law

The Law of Conservation of Momentum is NOT an independent law — it FOLLOWS directly from Newton's Third Law!

**Setup:** Two objects A and B collide for time $\Delta t$.

**Step 1:** During collision, A exerts force $F_{AB}$ on B. By Newton's Third Law, B exerts $F_{BA} = -F_{AB}$ on A.

**Step 2:** Impulse on A from B:
$$\Delta p_A = F_{BA} \times \Delta t$$

**Step 3:** Impulse on B from A:
$$\Delta p_B = F_{AB} \times \Delta t = -F_{BA} \times \Delta t = -\Delta p_A$$

**Step 4:** Total change in momentum of system:
$$\Delta p_{total} = \Delta p_A + \Delta p_B = \Delta p_A + (-\Delta p_A) = 0$$

**Conclusion:** Total momentum change = 0 → Total momentum is conserved!

This proof shows that momentum conservation is a direct consequence of Newton's Third Law (equal and opposite forces → equal and opposite impulses → zero total momentum change).

---

### Types of Collisions

Not all collisions behave the same way. Physicists classify collisions into three types:

#### 1. Elastic Collision
* Momentum is conserved ✓
* Kinetic energy is also conserved ✓
* Objects bounce off each other perfectly

**Real-world approximation:** Billiard/snooker balls, atoms and molecules at low speeds.

**Example:** Ball A (1 kg, 4 m/s) collides head-on with stationary Ball B (1 kg). After collision: A stops, B moves at 4 m/s. Momentum conserved: 1×4 + 0 = 0 + 1×4. KE conserved: ½×1×16 + 0 = 0 + ½×1×16. ✓

#### 2. Inelastic Collision
* Momentum is conserved ✓
* Kinetic energy is NOT conserved (some converted to heat/sound/deformation) ✗
* Most real-world collisions are inelastic

**Example:** A car crash — cars deform (kinetic energy converts to deformation energy). Momentum is still conserved, but kinetic energy is lost.

#### 3. Perfectly Inelastic Collision
* Momentum is conserved ✓
* Objects stick together after collision (maximum kinetic energy loss) ✗
* Most extreme case of inelastic collision

**Example:** A bullet embedding in a wooden block. After impact, bullet and block move together as one unit.

---

### Worked Problems — Step by Step

#### Problem 1: Classic Collision
**Two balls on a frictionless surface:** Ball A (mass 2 kg) moves at 3 m/s and collides with stationary Ball B (mass 2 kg). After the collision, Ball A stops. Find Ball B's velocity.

**Solution:**
$$p_{before} = m_A u_A + m_B u_B = 2 \times 3 + 2 \times 0 = 6 \text{ kg·m/s}$$
$$p_{after} = m_A v_A + m_B v_B = 2 \times 0 + 2 \times v_B = 2v_B$$
$$6 = 2v_B \Rightarrow v_B = 3 \text{ m/s}$$

Ball B moves at **3 m/s** in the direction Ball A was originally moving. ✓

#### Problem 2: Bullet and Block
**A 0.01 kg bullet moving at 500 m/s embeds in a 0.99 kg wooden block. Find their common velocity after impact.**

**Solution:**
$$p_{before} = 0.01 \times 500 + 0.99 \times 0 = 5 \text{ kg·m/s}$$
$$p_{after} = (0.01 + 0.99) \times v = 1 \times v$$
$$5 = v \Rightarrow v = 5 \text{ m/s}$$

Bullet+block system moves at **5 m/s** forward.

Note the massive kinetic energy loss:
$$KE_{before} = \frac{1}{2}(0.01)(500^2) = 1250 \text{ J}$$
$$KE_{after} = \frac{1}{2}(1)(5^2) = 12.5 \text{ J}$$
99% of kinetic energy converted to heat and sound!

#### Problem 3: Explosion (Reverse of Collision)
**A 10 kg shell at rest explodes into two pieces: 4 kg flying at 30 m/s forward, and 6 kg in the other direction. Find the 6 kg piece's velocity.**

**Solution:**
$$p_{before} = 0 \text{ (at rest)}$$
$$p_{after} = 4 \times 30 + 6 \times v_2 = 0$$
$$120 + 6v_2 = 0 \Rightarrow v_2 = -20 \text{ m/s}$$

The 6 kg piece moves at **20 m/s backward** (opposite to the 4 kg piece). ✓

---

### Explosions — Conservation in Reverse

Conservation of momentum works for explosions too. An explosion is essentially the reverse of a perfectly inelastic collision.

**Before explosion:** One stationary object (total momentum = 0).
**After explosion:** Multiple pieces fly apart.

The key: all pieces' momentums must add up to ZERO (the original total momentum).

![Figure 2: An explosion is the reverse of a collision. The momentums of all fragments sum to zero, conserving the initial stationary momentum.](/images/explosion_conservation.png)


**Real examples:**
* **Fireworks:** Shell explodes from rest. Colourful pieces scatter in all directions. If you could add all their momenta as vectors, the total is still zero!
* **Gun firing:** Bullet goes forward, gun recoils backward. Total momentum = 0 (same as before firing).
* **Rocket jettisoning fuel tanks:** Empty fuel tank detaches backward, rocket continues forward faster. Total momentum conserved.

---

### Applications in Real Life

#### Car Safety Testing (Crash Tests)
When two vehicles collide, momentum is conserved. Crash test engineers use this to predict how vehicles will behave in accidents — which direction they'll spin, how fast, etc. This data drives airbag timing, crumple zone design, and safety ratings.

#### Space Missions and Orbital Mechanics
NASA mission planners use momentum conservation to calculate every engine burn. When a spacecraft fires its engines (expelling gas backward), momentum is conserved. The spacecraft gains exactly as much forward momentum as the gas gains backward momentum.

#### Neutron Collisions in Nuclear Reactors
In nuclear reactors, neutron speed must be controlled (moderated) for controlled fission. Neutrons collide with moderator atoms (like water molecules). By conservation of momentum, a neutron colliding with an equal-mass hydrogen atom (in water) transfers nearly all its kinetic energy — slowing down dramatically. This is why water makes an excellent neutron moderator.

#### Astronomy — Star Formation and Black Holes
When massive gas clouds collapse under gravity to form stars, their momentum must be conserved. If the initial cloud was slowly rotating, the collapsing star rotates faster (like a figure skater pulling in arms — conservation of angular momentum, the rotational version). Rapidly spinning pulsars and neutron stars are formed this way.

---

### Important Points to Remember

1. **Total momentum is conserved only when no external force acts** on the system. Friction from ground, gravitational pull from outside — these are external forces that can change total momentum.

2. **Momentum is a VECTOR.** Direction matters. You must use + and − signs for opposite directions.

3. **Conservation of momentum applies to ALL types of interactions** — elastic collisions, inelastic collisions, explosions, even slow interactions like boats pushing off docks.

4. **Conservation of momentum and energy are different.** Momentum is always conserved in isolated systems. Kinetic energy is only conserved in perfectly elastic collisions.

5. **This law connects back to Newton's Third Law** — the mathematical derivation shows they are deeply related: Newton's Third Law implies momentum conservation.

---

### Summary: The Chapter at a Glance

| Topic | Key Formula | Key Concept |
|---|---|---|
| Force and Effects | $F = $ push/pull | Can change speed, direction, shape |
| Balanced/Unbalanced | $F_{net} = 0$ or $≠0$ | Zero net force = no acceleration |
| Newton's 1st Law | No force → constant velocity | Inertia: resistance to change |
| Newton's 2nd Law | $F = ma$ | More force/less mass = more acceleration |
| Newton's 3rd Law | $F_{AB} = -F_{BA}$ | Every action has equal-opposite reaction |
| Momentum | $p = mv$ | Quantity of motion |
| Conservation | $m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2$ | Total momentum unchanged in isolation |
  `,

  questions: [
    /* ── 5 MCQs ── */
    {
      id: "t5q1",
      type: "mcq",
      points: 10,
      question:
        "A 4 kg ball moving at 6 m/s collides with a 2 kg stationary ball. After collision, the 4 kg ball moves at 2 m/s in the same direction. What is the velocity of the 2 kg ball?",
      options: ["4 m/s", "8 m/s", "12 m/s", "6 m/s"],
      correctAnswer: "8 m/s",
      explanation:
        "Before: p = 4×6 + 2×0 = 24 kg·m/s. After: 4×2 + 2×v = 24. 8 + 2v = 24. 2v = 16. v = 8 m/s. Momentum is conserved.",
    },
    {
      id: "t5q2",
      type: "mcq",
      points: 10,
      question:
        "A gun recoils when fired. This is the best example of:",
      options: [
        "Newton's First Law — inertia",
        "Newton's Second Law — F = ma",
        "Conservation of momentum",
        "Conservation of energy",
      ],
      correctAnswer: "Conservation of momentum",
      explanation:
        "Before firing: total momentum = 0 (gun + bullet both at rest). After firing: bullet gains forward momentum = gun gains equal backward momentum. Total remains 0. This is conservation of momentum.",
    },
    {
      id: "t5q3",
      type: "mcq",
      points: 10,
      question:
        "The law of conservation of momentum holds ONLY when:",
      options: [
        "Objects are moving in the same direction",
        "Objects have equal masses",
        "No external unbalanced force acts on the system",
        "All collisions are elastic",
      ],
      correctAnswer: "No external unbalanced force acts on the system",
      explanation:
        "Conservation of momentum requires an isolated system — no external unbalanced force. Internal forces (collision forces between objects) do not change total momentum since they are equal and opposite (Newton's Third Law).",
    },
    {
      id: "t5q4",
      type: "mcq",
      points: 10,
      question:
        "A 5 kg shell at rest explodes into two equal pieces of 2.5 kg each. One piece flies at 20 m/s to the left. What is the velocity of the other piece?",
      options: ["20 m/s to the right", "10 m/s to the left", "40 m/s to the right", "0 m/s"],
      correctAnswer: "20 m/s to the right",
      explanation:
        "Initial momentum = 0. Final: 2.5×(−20) + 2.5×v = 0. −50 + 2.5v = 0. v = 20 m/s to the right. Equal masses flying apart at equal speeds in opposite directions.",
    },
    {
      id: "t5q5",
      type: "mcq",
      points: 10,
      question:
        "In which type of collision is kinetic energy conserved along with momentum?",
      options: [
        "Perfectly inelastic collision",
        "Inelastic collision",
        "Elastic collision",
        "Explosive collision",
      ],
      correctAnswer: "Elastic collision",
      explanation:
        "In an elastic collision, both momentum AND kinetic energy are conserved. In inelastic collisions, momentum is conserved but kinetic energy is partially converted to heat/sound/deformation. In perfectly inelastic, objects stick together — maximum KE loss.",
    },

    /* ── 5 Short Answer ── */
    {
      id: "t5q6",
      type: "short",
      points: 15,
      question:
        "State the Law of Conservation of Momentum and write its mathematical equation for a two-body system.",
      correctAnswer:
        "Law of Conservation of Momentum: The total momentum of an isolated system remains constant if no external unbalanced force acts on it. For two bodies: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂, where u = initial velocity, v = final velocity, m = mass. The total momentum before an interaction equals total momentum after.",
      explanation:
        "Statement with isolated-system condition + complete equation with variables defined.",
    },
    {
      id: "t5q7",
      type: "short",
      points: 15,
      question:
        "A 0.5 kg ball moving at 4 m/s collides with a 1.5 kg stationary ball and they stick together. Find their common velocity after collision.",
      correctAnswer:
        "Before: total momentum = 0.5×4 + 1.5×0 = 2 kg·m/s. After (stuck together): (0.5 + 1.5)×v = 2. 2v = 2. v = 1 m/s. Both move together at 1 m/s in the original direction. This is a perfectly inelastic collision.",
      explanation:
        "Apply conservation: total p before = total p after. Combined mass = 2 kg. v = 2/2 = 1 m/s.",
    },
    {
      id: "t5q8",
      type: "short",
      points: 15,
      question:
        "Prove that the Law of Conservation of Momentum follows from Newton's Third Law.",
      correctAnswer:
        "During collision, A exerts force F on B, B exerts −F on A (Newton's Third Law). Impulse on A = −F×Δt = Δp_A. Impulse on B = +F×Δt = Δp_B. Total change in momentum = Δp_A + Δp_B = −FΔt + FΔt = 0. Zero total change means total momentum is constant → conservation of momentum. Newton's Third Law directly implies momentum conservation.",
      explanation:
        "Derivation using Third Law forces → equal and opposite impulses → zero net momentum change → conservation.",
    },
    {
      id: "t5q9",
      type: "short",
      points: 15,
      question:
        "Why does a firework shell explode symmetrically outward from its launch point? Use conservation of momentum.",
      correctAnswer:
        "The firework shell was moving upward with a certain momentum. When it explodes, the fragments must collectively have the same total momentum as before (assuming no external force at the instant of explosion). For a shell designed to explode in all directions equally, the symmetry ensures momentum components cancel in all directions perpendicular to motion. The colourful fragments must collectively have the same upward momentum as the original shell.",
      explanation:
        "Conservation of momentum: total momentum of all fragments = original shell's momentum. Symmetric explosion means radial components cancel, net momentum = original direction.",
    },
    {
      id: "t5q10",
      type: "short",
      points: 15,
      question:
        "Two astronauts (60 kg and 80 kg) are stationary in space. The 60 kg astronaut pushes the 80 kg astronaut at 2 m/s. What happens to the 60 kg astronaut?",
      correctAnswer:
        "Initial momentum = 0. After push: 80×2 + 60×v = 0. 160 + 60v = 0. v = −160/60 = −2.67 m/s. The 60 kg astronaut moves at 2.67 m/s in the OPPOSITE direction. Lighter astronaut moves faster (inverse mass ratio). Both drift forever in space — Newton's First Law — no friction to stop them.",
      explanation:
        "Conservation: initial p = 0. 80×2 + 60×v = 0. v = −8/3 ≈ −2.67 m/s. Opposite direction to pushed astronaut.",
    },

    /* ── 5 Long Answer ── */
    {
      id: "t5q11",
      type: "long",
      points: 20,
      question:
        "Derive the Law of Conservation of Momentum mathematically from Newton's Second and Third Laws. Show each step clearly.",
      correctAnswer:
        "Consider two objects A (mass m₁) and B (mass m₂) interacting for time Δt. Initial velocities: u₁, u₂. Final velocities: v₁, v₂. BY NEWTON'S THIRD LAW: Force of A on B = F_AB. Force of B on A = F_BA = −F_AB. BY NEWTON'S SECOND LAW: F_AB = m₂(v₂−u₂)/Δt [force on B changes B's momentum]. F_BA = m₁(v₁−u₁)/Δt [force on A changes A's momentum]. Since F_BA = −F_AB: m₁(v₁−u₁)/Δt = −m₂(v₂−u₂)/Δt. Multiply both sides by Δt: m₁(v₁−u₁) = −m₂(v₂−u₂). m₁v₁ − m₁u₁ = −m₂v₂ + m₂u₂. Rearranging: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂. Total momentum before = Total momentum after. This is the Law of Conservation of Momentum — derived entirely from Newton's Second and Third Laws.",
      explanation:
        "Full step-by-step derivation from Third Law (equal opposite forces) through Second Law (F = Δp/Δt) to the conservation equation. Must be clearly labelled.",
    },
    {
      id: "t5q12",
      type: "long",
      points: 20,
      question:
        "Explain the three types of collisions (elastic, inelastic, perfectly inelastic) with examples and calculations. Which conserves both momentum and kinetic energy?",
      correctAnswer:
        "1. ELASTIC: Both momentum and KE conserved. Example: two billiard balls. Ball 1 (1 kg, 3 m/s) hits stationary Ball 2 (1 kg). After: Ball 1 stops, Ball 2 moves at 3 m/s. Momentum: 1×3 = 0 + 1×3 ✓. KE: ½×1×9 = ½×1×9 ✓. 2. INELASTIC: Momentum conserved, KE not conserved. Example: car crash. 1000 kg car (20 m/s) hits 1500 kg stationary car. They bounce off separately. Momentum conserved but some KE converts to heat/sound/deformation. 3. PERFECTLY INELASTIC: Momentum conserved, maximum KE loss. Objects stick together. Example: 0.01 kg bullet (500 m/s) embeds in 0.99 kg block. Combined velocity = (0.01×500)/(1) = 5 m/s. KE before = 1250 J. KE after = 12.5 J. 99% KE lost to heat/deformation! Only ELASTIC collisions conserve both.",
      explanation:
        "All three types with distinct examples and at least one quantitative calculation. The elastic collision as the only one conserving both quantities must be explicitly stated.",
    },
    {
      id: "t5q13",
      type: "long",
      points: 20,
      question:
        "A 3 kg trolley moving at 5 m/s collides with a 2 kg stationary trolley. After collision, the 3 kg trolley moves at 1 m/s in the same direction. (a) Find the velocity of the 2 kg trolley. (b) Calculate kinetic energy before and after. (c) Is this collision elastic or inelastic?",
      correctAnswer:
        "(a) MOMENTUM CONSERVATION: Before: p = 3×5 + 2×0 = 15 kg·m/s. After: 3×1 + 2×v = 15. 3 + 2v = 15. 2v = 12. v = 6 m/s. The 2 kg trolley moves at 6 m/s. (b) KE BEFORE: ½×3×5² + 0 = ½×3×25 = 37.5 J. KE AFTER: ½×3×1² + ½×2×6² = 1.5 + 36 = 37.5 J. (c) TYPE: Since KE before (37.5 J) = KE after (37.5 J), this is an ELASTIC collision — both momentum and kinetic energy are conserved! This is rare in everyday life but possible when collision surfaces are very rigid and springy (like billiard balls).",
      explanation:
        "Full calculation in three parts. The equality of KE before and after classifies it as elastic — a satisfying result that confirms the conservation laws are mutually consistent.",
    },
    {
      id: "t5q14",
      type: "long",
      points: 20,
      question:
        "Explain how NASA uses the Law of Conservation of Momentum to plan deep-space mission trajectory corrections (course burns). Use an example calculation.",
      correctAnswer:
        "BASIC PRINCIPLE: A spacecraft in deep space has total system momentum = spacecraft momentum + fuel momentum. When engines fire, fuel (exhaust gas) is expelled backward at high speed. By conservation of momentum, the spacecraft gains equal but opposite (forward) momentum. NASA calculates: Δp_spacecraft = −Δp_exhaust. If the spacecraft (mass 1000 kg) needs to increase velocity by 10 m/s (Δv): Required momentum change = 1000×10 = 10,000 kg·m/s. If exhaust velocity = 2000 m/s: Mass of fuel needed = 10,000/2000 = 5 kg. This is called the Tsiolkovsky Rocket Equation in practice. For long missions (like Mars), multiple burns are planned. Each burn is calculated using conservation of momentum. The precision is extraordinary — Mars missions must hit a target window just 1-2 km wide after traveling 225 million km! Conservation of momentum (combined with orbital mechanics) makes this possible. Every gram of fuel is precious, so exact calculations using momentum conservation are mission-critical.",
      explanation:
        "Conservation principle → calculation example → NASA application. The precision of space navigation showing how fundamental the law is makes this answer excellent.",
    },
    {
      id: "t5q15",
      type: "long",
      points: 20,
      question:
        "A 10,000 kg space shuttle at rest in space separates from a 2,000 kg fuel tank. The fuel tank moves backward at 3 m/s. Find the shuttle's forward velocity. Compare this to a 100,000 kg shuttle separating from the same tank.",
      correctAnswer:
        "CASE 1 (Shuttle 10,000 kg): Initial momentum = 0. After separation: 2000×(−3) + 10000×v = 0. −6000 + 10000v = 0. v = 0.6 m/s forward. CASE 2 (Shuttle 100,000 kg): 2000×(−3) + 100000×v = 0. −6000 + 100000v = 0. v = 0.06 m/s forward. COMPARISON: The heavier shuttle (10× heavier than Case 1) moves at only 1/10 the velocity (0.06 vs 0.6 m/s). This demonstrates a = F/m and p = mv — for the same fuel tank separation momentum, a heavier spacecraft gains less velocity. PRACTICAL LESSON: This is why spacecraft staging exists (dropping empty tanks). As mass decreases, the same thrust gives more acceleration. A fully loaded rocket is mostly fuel mass — once fuel is used and tanks dropped, the remaining structure is much lighter and accelerates far more efficiently. This is the fundamental reason multi-stage rockets (like Saturn V) are so much more effective than single-stage rockets.",
      explanation:
        "Full calculations for both cases. The mass-velocity inverse relationship must be noted. The staging insight (heavier = less velocity gain) connects to real rocket design.",
    },

    /* ── 5 HOTS / Deep Thinking ── */
    {
      id: "t5q16",
      type: "thinking",
      points: 25,
      question:
        "HOTS: In a perfectly inelastic collision, objects stick together and maximum kinetic energy is 'lost.' But energy cannot be created or destroyed (First Law of Thermodynamics). Where does the 'lost' kinetic energy actually go?",
      correctAnswer:
        "Energy is never truly lost — it is converted. In a perfectly inelastic collision, kinetic energy converts to other forms: 1. THERMAL ENERGY (heat): The violent deformation of materials during collision causes molecules to vibrate more rapidly — the objects heat up. Car crashes produce measurable heat. 2. SOUND ENERGY: Collisions produce sound waves — the 'bang' of a crash represents energy propagating as pressure waves through air. 3. DEFORMATION ENERGY (plastic deformation): If objects permanently deform (bend, crush, dent), energy goes into rearranging atoms and molecules — breaking bonds and reshaping the material. This is why car crumple zones are 'designed' to absorb energy — they deliberately convert kinetic energy to deformation energy to protect passengers. 4. ELASTIC POTENTIAL ENERGY: Some energy may temporarily store in elastic materials during impact before converting to heat. Total energy of the universe is always conserved (First Law of Thermodynamics). The 'missing' kinetic energy simply changed form — it didn't disappear.",
      explanation:
        "Energy conservation vs kinetic energy conservation. Four specific forms kinetic energy converts to in inelastic collisions. Connection to car safety (crumple zones) shows practical depth.",
    },
    {
      id: "t5q17",
      type: "thinking",
      points: 25,
      question:
        "HOTS: Can the total kinetic energy of a system increase after a collision? If so, how? If not, explain why using energy and momentum principles.",
      correctAnswer:
        "YES — total kinetic energy CAN increase after a 'collision' if there is an internal energy source releasing energy during the interaction. This is called a SUPERELASTIC collision or an explosion. EXAMPLE: Two compressed spring-loaded carts initially at rest. When they release, the spring energy (potential energy) converts to kinetic energy. Both carts fly apart — total KE after > total KE before (which was 0). Another example: A chemical explosive: initial KE = 0 (stationary shell), final KE = fragments flying at high speed. Chemical bond energy (stored internal energy) converts to kinetic energy during the explosion. This does NOT violate conservation of momentum (total momentum = 0 before = 0 after for symmetric explosion) OR energy conservation (internal potential energy converts to kinetic energy — total energy conserved). The 'extra' kinetic energy comes from INTERNAL stored energy (spring compression, chemical energy, nuclear energy). Without an internal energy source, kinetic energy cannot increase — it can only decrease or stay constant.",
      explanation:
        "Yes, KE can increase via explosion/superelastic collision — internal energy source releases stored energy. Must distinguish kinetic energy conservation (not always) from total energy conservation (always).",
    },
    {
      id: "t5q18",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A billiard ball hits two identical stationary balls simultaneously (both at the same time). Using conservation of momentum and energy, predict what happens. Why does this differ from hitting one ball at a time?",
      correctAnswer:
        "ONE BALL HIT: Classic elastic collision between equal masses. The moving ball stops completely, the struck ball moves at the same original speed. Total momentum and KE conserved perfectly. TWO BALLS HIT SIMULTANEOUSLY: Now total final mass receiving momentum = 2 balls. Conservation of momentum: m×v₀ = m×v₁ + 2m×v₂ (where v₁ = final speed of cue ball, v₂ = each target ball's speed). Energy conservation: ½mv₀² = ½mv₁² + 2×½mv₂². Solving: v₀ = v₁ + 2v₂ (momentum) AND v₀² = v₁² + 2v₂² (energy). Solving simultaneously: v₁ = v₀/3 (cue ball continues at 1/3 speed), v₂ = v₀/3 each (target balls move at 1/3 speed). Unlike one-ball case (cue ball stops), cue ball CONTINUES moving when hitting two balls simultaneously! This is why skilled billiard players understand geometric and physical constraints — hitting two balls at once changes the dynamics completely compared to hitting one.",
      explanation:
        "Solve the simultaneous collision using BOTH momentum and energy conservation. The cue ball NOT stopping (unlike single ball elastic) is the surprising result that requires deep mathematical analysis.",
    },
    {
      id: "t5q19",
      type: "thinking",
      points: 25,
      question:
        "HOTS: Conservation of momentum is often called 'more fundamental' than Newton's Laws. Explain why. Can momentum be conserved even when Newton's laws don't apply (e.g., in quantum mechanics or relativistic physics)?",
      correctAnswer:
        "CLASSICAL PERSPECTIVE: Momentum conservation follows from Newton's Third Law (equal-opposite forces → equal-opposite impulses → zero net momentum change). So at the classical level, they're equivalent. MORE FUNDAMENTAL: In advanced physics (Noether's Theorem, 1915), Emmy Noether proved that every conservation law corresponds to a fundamental symmetry of nature. Conservation of momentum corresponds to TRANSLATIONAL SYMMETRY — the laws of physics are the same everywhere in the universe (no special location). As long as this symmetry holds, momentum is conserved — regardless of whether Newton's Laws apply! QUANTUM MECHANICS: Newton's Laws don't apply to subatomic particles (quantum rules govern). But momentum IS still conserved in quantum mechanics — proven experimentally in particle accelerators. Particles collide, scatter, and momentum of the system is always conserved. SPECIAL RELATIVITY: Newton's Second Law must be modified at speeds near light (F ≠ ma exactly). But momentum is still conserved, using the relativistic definition: p = mv/√(1−v²/c²). Momentum conservation is deeper than Newton's Laws — it reflects the translational symmetry of spacetime itself.",
      explanation:
        "Noether's Theorem connection. Translational symmetry → momentum conservation. QM and relativistic examples showing conservation survives beyond Newton. This is genuinely advanced but accessible.",
    },
    {
      id: "t5q20",
      type: "thinking",
      points: 25,
      question:
        "HOTS: Two skaters (60 kg and 80 kg) stand on frictionless ice. They push off each other and the 60 kg skater moves at 4 m/s. (a) Find the 80 kg skater's velocity. (b) Calculate total KE of the system after. (c) Where did this KE come from? (d) If both were moving toward each other at 2 m/s before pushing off, how does this change the calculation?",
      correctAnswer:
        "(a) FRICTIONLESS ICE, START FROM REST: Total initial momentum = 0. 60×4 + 80×v = 0. 240 + 80v = 0. v = −3 m/s. The 80 kg skater moves at 3 m/s in the opposite direction. (b) TOTAL KE AFTER: ½×60×4² + ½×80×3² = ½×60×16 + ½×80×9 = 480 + 360 = 840 J. (c) SOURCE OF KE: Initially both skaters were at rest — KE = 0! The 840 J came entirely from the chemical energy stored in their muscles (ATP → mechanical energy). This is an explosion-type interaction where internal energy (muscle chemical energy) converts to kinetic energy. Momentum is conserved (total = 0 still). Energy is conserved (chemical → kinetic). (d) BOTH MOVING TOWARD EACH OTHER AT 2 m/s: Initial momentum = 60×2 + 80×(−2) = 120 − 160 = −40 kg·m/s (net toward 80 kg direction). After push off: 60×v₁ + 80×v₂ = −40. PLUS KE consideration — the push adds 840 J of kinetic energy: ½×60×v₁² + ½×80×v₂² = ½×60×4 + ½×80×9 + 840 = 840 + original KE = 840 + ½×60×4 + ½×80×4 = 840 + 120 + 160 = 1120 J. Two equations for two unknowns (momentum and energy) give v₁ and v₂.",
      explanation:
        "Four parts: (a) momentum conservation from rest, (b) total KE calculation, (c) identification of muscle energy as the source, (d) extension to non-zero initial momentum case. Part (c) is the key insight — KE came from chemical energy.",
    },

    /* ══════════════════════════════════════════
     *  5 MORE MCQ QUESTIONS (Total: 10 MCQ)
     * ══════════════════════════════════════════ */
    {
      id: "t5q21",
      type: "mcq",
      points: 10,
      question:
        "Two objects of masses 3 kg and 6 kg are moving toward each other at 4 m/s and 2 m/s respectively. They stick together after collision. What is their common velocity?",
      options: ["0 m/s", "1 m/s", "2 m/s", "3 m/s"],
      correctAnswer: "0 m/s",
      explanation:
        "Taking rightward as positive: p = 3×4 + 6×(−2) = 12 − 12 = 0 kg·m/s. After sticking: (3+6)×v = 0. v = 0 m/s. They come to a complete stop! The momenta were equal and opposite, so they perfectly cancelled.",
    },
    {
      id: "t5q22",
      type: "mcq",
      points: 10,
      question:
        "A bullet of mass 50 g is fired from a gun of mass 5 kg. If the bullet leaves with velocity 200 m/s, the recoil velocity of the gun is:",
      options: ["2 m/s", "20 m/s", "0.2 m/s", "200 m/s"],
      correctAnswer: "2 m/s",
      explanation:
        "Initial momentum = 0. After: 0.05 × 200 + 5 × v = 0. 10 + 5v = 0. v = −2 m/s. The gun recoils at 2 m/s in the opposite direction to the bullet.",
    },
    {
      id: "t5q23",
      type: "mcq",
      points: 10,
      question:
        "In a perfectly inelastic collision, which quantity is NOT conserved?",
      options: [
        "Momentum",
        "Mass",
        "Kinetic Energy",
        "Total Energy",
      ],
      correctAnswer: "Kinetic Energy",
      explanation:
        "In a perfectly inelastic collision, momentum is always conserved, mass is conserved, and total energy is conserved (energy just changes form). However, kinetic energy is NOT conserved — some converts to heat, sound, and deformation.",
    },
    {
      id: "t5q24",
      type: "mcq",
      points: 10,
      question:
        "A 2 kg ball moving at 3 m/s makes a head-on elastic collision with a stationary 2 kg ball. After collision, the first ball:",
      options: [
        "Continues at 3 m/s",
        "Bounces back at 3 m/s",
        "Stops completely",
        "Moves at 1.5 m/s",
      ],
      correctAnswer: "Stops completely",
      explanation:
        "In a head-on elastic collision between equal masses, the moving ball stops completely and the stationary ball moves with the original velocity. This is a classic result: full momentum and kinetic energy transfer between equal masses.",
    },
    {
      id: "t5q25",
      type: "mcq",
      points: 10,
      question:
        "A rocket ejects exhaust gases to move forward. This is an application of:",
      options: [
        "Conservation of energy only",
        "Conservation of momentum",
        "Newton's First Law only",
        "Conservation of mass only",
      ],
      correctAnswer: "Conservation of momentum",
      explanation:
        "The rocket + exhaust form a system. Before engine firing, total momentum = rocket's momentum. After: rocket gains forward momentum = exhaust gases gain backward momentum. Total stays the same. This is conservation of momentum in action.",
    },

    /* ══════════════════════════════════════════
     *  5 MORE SHORT ANSWER (Total: 10 Short)
     * ══════════════════════════════════════════ */
    {
      id: "t5q26",
      type: "short",
      points: 15,
      question:
        "A rifle of mass 4 kg fires a bullet of mass 40 g. The rifle recoils at 1 m/s. Calculate the velocity of the bullet.",
      correctAnswer:
        "Initial momentum = 0 (both at rest). By conservation: m_rifle × v_rifle + m_bullet × v_bullet = 0. 4 × (−1) + 0.04 × v = 0. −4 + 0.04v = 0. v = 4/0.04 = 100 m/s. The bullet exits at 100 m/s in the direction opposite to the rifle's recoil.",
      explanation:
        "Straightforward conservation of momentum from rest. Initial momentum = 0, so bullet momentum must be equal and opposite to rifle momentum.",
    },
    {
      id: "t5q27",
      type: "short",
      points: 15,
      question:
        "Why is it dangerous to fire a gun that is not held firmly against the shoulder?",
      correctAnswer:
        "When a gun fires, the bullet gains forward momentum and the gun gains equal backward momentum (recoil). If the gun is held firmly against the shoulder, the recoiling mass includes the gun + the person's body (perhaps 80 kg total) — so the recoil velocity is very small (F = ma: large mass, small acceleration). If the gun is not held firmly, only the gun's mass (perhaps 3 kg) absorbs the recoil — the recoil velocity is much larger. This can cause the gun to fly backward, potentially injuring the face, breaking the nose, or dislocating the shoulder. The physics: same recoil momentum, but distributed over much less mass = much higher velocity = dangerous impact.",
      explanation:
        "Same recoil momentum distributed over different masses: gun alone (high velocity, dangerous) vs gun + body (low velocity, manageable). This is conservation of momentum with practical safety implications.",
    },
    {
      id: "t5q28",
      type: "short",
      points: 15,
      question:
        "A 1 kg ball moving at 5 m/s hits a wall and bounces back at 3 m/s. What is the change in momentum of the ball?",
      correctAnswer:
        "Taking the initial direction as positive: Initial momentum = 1 × 5 = 5 kg·m/s. Final momentum = 1 × (−3) = −3 kg·m/s (negative because it reversed direction). Change in momentum = final − initial = −3 − 5 = −8 kg·m/s. The magnitude of change is 8 kg·m/s. Note: This is greater than the initial momentum because the ball reversed direction — both the stopping (5 kg·m/s) and the reversing (3 kg·m/s) contribute.",
      explanation:
        "When direction reverses, the total momentum change = initial + final magnitudes. This is why bouncing balls transfer more momentum to walls than balls that just stop.",
    },
    {
      id: "t5q29",
      type: "short",
      points: 15,
      question:
        "Two identical balls are moving toward each other with equal speeds. What happens when they collide elastically?",
      correctAnswer:
        "Since the balls are identical (same mass) and moving with equal speeds in opposite directions: initial total momentum = m×v + m×(−v) = 0. After elastic collision: momentum must still be zero AND kinetic energy must be conserved. The solution: each ball bounces back with the same speed but reversed direction. Ball 1 was moving right at v → now moves left at v. Ball 2 was moving left at v → now moves right at v. They effectively exchange velocities. Momentum: m×(−v) + m×v = 0 ✓. KE: ½mv² + ½mv² = same as before ✓.",
      explanation:
        "Symmetric elastic collision: equal masses, equal speeds, opposite directions → both reverse. Total momentum = 0 before and after. KE conserved. They swap directions.",
    },
    {
      id: "t5q30",
      type: "short",
      points: 15,
      question:
        "Why does a heavy truck cause more damage in a collision than a car moving at the same speed?",
      correctAnswer:
        "At the same speed, the truck has much more momentum (p = mv, truck mass >> car mass). In a collision, this larger momentum must be transferred or absorbed. By impulse-momentum theorem (F × t = Δp), to stop the truck in the same time as the car, a much larger force is required. This larger force causes more structural damage, more deformation, and more injury. Additionally, the truck's kinetic energy (½mv²) is much greater because of its larger mass — more energy is available to cause destruction. The heavier the vehicle at the same speed, the more momentum and energy it carries, and the more destructive its collision.",
      explanation:
        "More mass at same speed = more momentum = more force needed to stop it = more damage. Both momentum and kinetic energy scale with mass.",
    },

    /* ══════════════════════════════════════════
     *  5 MORE LONG ANSWER (Total: 10 Long)
     * ══════════════════════════════════════════ */
    {
      id: "t5q31",
      type: "long",
      points: 20,
      question:
        "A car of mass 1000 kg moving at 20 m/s collides with a stationary car of mass 1500 kg. After collision, they stick together. (a) Find their common velocity. (b) Calculate KE before and after. (c) What percentage of KE was lost? (d) Where did the lost energy go?",
      correctAnswer:
        "(a) **Common velocity:**\nm₁u₁ + m₂u₂ = (m₁ + m₂)v\n1000 × 20 + 1500 × 0 = (1000 + 1500) × v\n20,000 = 2500v\nv = 8 m/s\n\n(b) **KE before:**\nKE = ½ × 1000 × 20² = ½ × 1000 × 400 = 200,000 J = 200 kJ\n\n**KE after:**\nKE = ½ × 2500 × 8² = ½ × 2500 × 64 = 80,000 J = 80 kJ\n\n(c) **KE lost:**\nLost = 200,000 − 80,000 = 120,000 J = 120 kJ\nPercentage lost = (120,000/200,000) × 100 = **60%**\n\n(d) **Where the energy went:**\n- Heat generated from friction between metal surfaces during crushing\n- Sound energy (the loud crash noise)\n- Deformation energy: both cars crumple, dent, and permanently deform\n- Some goes into vibrations transmitted through the chassis\n\nMomentum was perfectly conserved (20,000 kg·m/s before = 20,000 kg·m/s after). But 60% of kinetic energy was converted to non-kinetic forms. This is a perfectly inelastic collision — the most energy-losing type of collision.",
      explanation:
        "Complete four-part calculation showing momentum conservation alongside 60% KE loss. The energy destination analysis connects physics to real-world car crash mechanics.",
    },
    {
      id: "t5q32",
      type: "long",
      points: 20,
      question:
        "Explain Newton's Cradle (the desk toy with 5 hanging steel balls). When you pull back one ball and release it, only one ball flies out the other end. Why doesn't two half-speed balls fly out instead? Use both momentum AND energy conservation.",
      correctAnswer:
        "**Newton's Cradle — The Physics:**\n\nWhen one ball (mass m) swings and hits the line at velocity v:\n\nInitial momentum = mv\nInitial KE = ½mv²\n\n**Scenario 1 (What actually happens): One ball flies out at v**\nMomentum: m×v = mv ✓\nKE: ½m×v² = ½mv² ✓\nBoth conserved! This is physically valid.\n\n**Scenario 2 (Why two balls at v/2 DON'T fly out):**\nMomentum: 2m × (v/2) = mv ✓ (Momentum IS conserved!)\nKE: 2 × ½m × (v/2)² = 2 × ½m × v²/4 = mv²/4 = ½ × (½mv²)\nKE = ½mv²/2 ≠ ½mv² ✗ (Only HALF the kinetic energy is conserved!)\n\n**The key insight:** Momentum conservation alone allows MANY possible outcomes (1 ball at v, 2 balls at v/2, 5 balls at v/5, etc.). But energy conservation restricts the options to only those that ALSO conserve kinetic energy.\n\nThe ONLY solution that satisfies BOTH conservation laws simultaneously (for these equal-mass elastic collisions) is: the same number of balls that went in comes out at the same speed.\n\nPull back 2 balls → 2 fly out the other end.\nPull back 3 balls → 3 fly out.\n\nThis is why Newton's Cradle is such a beautiful physics demonstration — it visually proves that BOTH momentum AND energy conservation are required to predict the outcome of elastic collisions.",
      explanation:
        "The crucial insight is that momentum conservation alone is insufficient — it allows multiple solutions. Adding energy conservation uniquely determines the outcome. This is why Newton's Cradle works the way it does.",
    },
    {
      id: "t5q33",
      type: "long",
      points: 20,
      question:
        "A cannon ball of mass 5 kg is fired horizontally from a cannon of mass 500 kg at 100 m/s. (a) Calculate the recoil velocity of the cannon. (b) If the cannon is mounted on wheels and there is a friction force of 200 N, how far does the cannon recoil before stopping?",
      correctAnswer:
        "(a) **Recoil velocity:**\nInitial momentum = 0.\n5 × 100 + 500 × v = 0\n500 + 500v = 0\nv = −1 m/s (backward)\n\n(b) **Distance before stopping (with friction):**\nFriction decelerates the cannon.\nKE of recoiling cannon = ½ × 500 × 1² = 250 J\n\nUsing Work-Energy theorem: Friction force × distance = KE\n200 × d = 250\nd = 250/200 = **1.25 m**\n\nAlternatively, using F = ma:\nDeceleration a = F/m = 200/500 = 0.4 m/s²\nUsing v² = u² − 2as (v = 0 when stopped):\n0 = 1² − 2 × 0.4 × s\ns = 1/(0.8) = 1.25 m ✓\n\nThe cannon recoils 1.25 metres before friction stops it.\n\n**Note:** This is why naval cannons historically were mounted on recoiling carriages with rope brakes — to absorb the recoil momentum safely within the ship's deck space.",
      explanation:
        "Two-part problem combining momentum conservation with friction/work-energy analysis. Two methods shown for part (b) with verification. The historical note adds context.",
    },
    {
      id: "t5q34",
      type: "long",
      points: 20,
      question:
        "Two railway wagons of equal mass (20,000 kg each) are on a frictionless track. Wagon A moves at 3 m/s and collides with stationary Wagon B. After collision, they couple together. (a) Find common velocity. (b) Calculate the loss in KE. (c) A spring buffer between them stores 50% of the lost KE. How much energy is in the spring?",
      correctAnswer:
        "(a) **Common velocity:**\n20000 × 3 + 20000 × 0 = (20000 + 20000) × v\n60,000 = 40,000v\nv = 1.5 m/s\n\n(b) **KE loss:**\nKE before = ½ × 20000 × 3² = ½ × 20000 × 9 = 90,000 J = 90 kJ\nKE after = ½ × 40000 × 1.5² = ½ × 40000 × 2.25 = 45,000 J = 45 kJ\nLoss = 90,000 − 45,000 = 45,000 J = 45 kJ\nPercentage lost = 50%\n\n(c) **Energy in spring:**\nSpring stores 50% of 45,000 J = 22,500 J = 22.5 kJ\n\n**Interesting observation:** In equal-mass perfectly inelastic collisions (where one is stationary), exactly 50% of KE is always lost! This is a mathematical property:\n\nFor m₁ = m₂ = m, u₂ = 0:\nv = mu₁/(2m) = u₁/2\nKE_after = ½(2m)(u₁/2)² = ½(2m)(u₁²/4) = mu₁²/4\nKE_before = ½mu₁²\nRatio = (mu₁²/4)/(mu₁²/2) = 1/2 = 50% always!\n\nSo equal-mass perfectly inelastic collisions always lose exactly half the kinetic energy — a beautiful mathematical result.",
      explanation:
        "Complete three-part calculation with the elegant proof that equal-mass perfectly inelastic collisions always lose exactly 50% KE. This is a satisfying mathematical result that deepens understanding.",
    },
    {
      id: "t5q35",
      type: "long",
      points: 20,
      question:
        "Describe how the law of conservation of momentum is used in forensic science to analyze crime scenes involving gunshots. How can investigators determine the type of gun used from the momentum of the bullet?",
      correctAnswer:
        "**Forensic Application of Momentum Conservation:**\n\n**1. Bullet trajectory analysis:**\nWhen a bullet hits a target (person, wall, object), momentum is transferred. By measuring the movement of the target after impact (how far it moved, in what direction), forensic scientists can calculate the bullet's momentum: p_bullet = (m_target + m_bullet) × v_after (for embedded bullet — perfectly inelastic collision).\n\n**2. Determining gun type:**\nDifferent guns fire bullets of known masses at known velocities:\n- Pistol (9mm): 8g bullet at 370 m/s → p = 2.96 kg·m/s\n- Rifle (7.62mm): 10g bullet at 715 m/s → p = 7.15 kg·m/s\n- Shotgun: 35g slug at 440 m/s → p = 15.4 kg·m/s\n\nBy calculating the bullet's momentum from the impact, investigators can narrow down the weapon type.\n\n**3. Ballistic pendulum:**\nClassic forensic tool: a heavy block suspended by strings. A bullet embeds in the block, which swings upward. The height of swing gives velocity (using energy conservation: ½mv² = mgh). Working backward: bullet velocity → bullet momentum → gun identification.\n\n**4. Blood spatter analysis:**\nBlood droplets follow momentum conservation. When a bullet hits a body, blood splatters in patterns determined by the momentum transferred. Forward spatter (in bullet's direction) and back spatter (opposite) give clues about entry point, angle, and bullet speed.\n\n**5. Ricochet analysis:**\nWhen bullets ricochet off surfaces, momentum is partially conserved (some lost to deformation). The ricochet angle and speed help reconstruct the shooter's position.\n\n**Real-world limitation:** Friction, air resistance, and deformation mean momentum isn't perfectly conserved in practice. But the principles provide crucial starting points for forensic calculations.",
      explanation:
        "Five practical forensic applications of momentum conservation — from ballistic pendulums to blood spatter analysis. This shows how fundamental physics has direct, real-world impact in crime investigation.",
    },

    /* ══════════════════════════════════════════
     *  5 MORE THINKING/HOTS (Total: 10 HOTS)
     * ══════════════════════════════════════════ */
    {
      id: "t5q36",
      type: "thinking",
      points: 25,
      question:
        "HOTS: Two identical clay balls are thrown at each other with equal speeds. They stick together on impact. What is their final velocity? Where did ALL their kinetic energy go? Is this the maximum possible KE loss in any collision?",
      correctAnswer:
        "**Final velocity:**\nBall 1: mass m, velocity +v (rightward)\nBall 2: mass m, velocity −v (leftward)\n\nInitial momentum = mv + m(−v) = 0\nAfter sticking: (2m) × v_final = 0\nv_final = 0\n\n**They stop completely!**\n\n**Where did the KE go?**\nKE before = ½mv² + ½mv² = mv²\nKE after = 0 (everything is stationary!)\n\n**100% of kinetic energy was lost!** All of it converted to:\n- Heat (the clay warms up from deformation)\n- Sound (the 'splat' of impact)\n- Deformation energy (clay permanently deforms/reshapes)\n\n**Is this maximum possible KE loss?**\nYES. In any collision, momentum must be conserved. If initial total momentum = 0 (equal and opposite), then the only way to conserve momentum with objects stuck together is to have v_final = 0. This means ALL kinetic energy is lost.\n\nThis is the absolute maximum KE loss possible in any collision — 100%. It occurs when:\n1. The collision is perfectly inelastic (objects stick)\n2. The initial total momentum is zero (equal and opposite momenta)\n\nNo collision can lose more than 100% of KE (that would violate energy conservation). And this scenario achieves that maximum.\n\n**Analogy:** This is how particle physics experiments work at CERN — protons collide head-on at equal speeds, maximizing the energy available for creating new particles (since all KE converts to other forms).",
      explanation:
        "Perfect example of maximum energy loss. Zero total momentum + perfectly inelastic = complete kinetic energy conversion. The CERN analogy shows this principle at the frontier of physics.",
    },
    {
      id: "t5q37",
      type: "thinking",
      points: 25,
      question:
        "HOTS: If a ball is dropped from height h onto a hard floor and bounces back to the same height h, is momentum conserved? Is energy conserved? Explain carefully, considering both the ball and the Earth as the system.",
      correctAnswer:
        "**System: Ball only**\nThe ball's momentum is NOT conserved — it changes direction at the floor (from downward to upward). An external force (from the floor) caused this momentum change.\nBut energy IS conserved for the ball: PE at top → KE at bottom → PE at top again (ball returns to height h). No KE lost = perfectly elastic bounce.\n\n**System: Ball + Earth (complete system)**\nMomentum IS conserved! When the ball falls:\n- Ball gains downward momentum (gravity pulls it)\n- Earth gains upward momentum (ball's gravity pulls Earth upward — Newton's Third Law)\n\nWhen the ball bounces off the floor:\n- Ball's momentum reverses (from down to up)\n- Earth's momentum also reverses (from up to down)\n\nTotal momentum of ball + Earth remains zero throughout (if we started from rest). The ball-Earth gravitational interaction is an internal force — it cannot change the system's total momentum.\n\n**Energy Analysis:**\nSince the ball returns to the same height, this is a perfectly elastic collision with the floor. KE is fully conserved. Total mechanical energy (PE + KE) is conserved.\n\n**Key insight:** Whether momentum is 'conserved' depends on what you define as the SYSTEM. The ball alone: no (external forces act). Ball + Earth: yes (all forces are internal).\n\n**If the ball bounces to a LOWER height** (realistic scenario): some KE is lost to heat and sound in the floor collision → inelastic. Momentum of ball + Earth system is still conserved, but KE is not.",
      explanation:
        "This question forces careful thinking about system boundaries. Momentum conservation depends on what's in your system. The ball alone has external forces; ball + Earth has only internal forces. This distinction is fundamental.",
    },
    {
      id: "t5q38",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A hunter fires a bullet (20 g) at a 2 kg wooden block hanging from a string (ballistic pendulum). The bullet embeds in the block and the block swings up to a height of 20 cm. Calculate the bullet's velocity. This method was historically used to measure bullet speeds before electronic methods existed.",
      correctAnswer:
        "**Step 1: Find velocity of block + bullet just after impact using energy conservation.**\n\nAfter the bullet embeds, the block+bullet system swings upward. At maximum height, all KE converts to PE:\n½(m_block + m_bullet)v² = (m_block + m_bullet)gh\n\n½v² = gh\nv² = 2gh = 2 × 10 × 0.2 = 4\nv = 2 m/s (velocity of block + bullet just after collision)\n\n**Step 2: Find bullet velocity using momentum conservation during the collision.**\n\nDuring the bullet embedding (perfectly inelastic collision):\nm_bullet × v_bullet = (m_bullet + m_block) × v_after\n\n0.02 × v_bullet = (0.02 + 2) × 2\n0.02 × v_bullet = 2.02 × 2 = 4.04\nv_bullet = 4.04/0.02 = **202 m/s**\n\n**Verification:**\nBullet momentum: 0.02 × 202 = 4.04 kg·m/s\nBlock+bullet momentum: 2.02 × 2 = 4.04 kg·m/s ✓\n\n**Historical significance:**\nThe ballistic pendulum was invented by Benjamin Robins in 1742 and was the standard method for measuring bullet velocities for over 200 years! It elegantly combines:\n- Conservation of momentum (during collision)\n- Conservation of energy (during swing)\n\nTwo different conservation laws applied to two different phases of the same experiment. Modern chronographs use electronic sensors, but the physics remains the same.",
      explanation:
        "Two-step problem using momentum conservation for the collision phase and energy conservation for the swing phase. This is a classic physics problem with genuine historical importance.",
    },
    {
      id: "t5q39",
      type: "thinking",
      points: 25,
      question:
        "HOTS: Explain why a spacecraft heading toward Mars cannot simply use the formula m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂ directly. What additional complications arise in real space missions that make momentum conservation harder to apply?",
      correctAnswer:
        "**The formula works in principle, but real space missions face complications:**\n\n**1. Gravity is an external force:**\nThe Sun's gravity constantly pulls the spacecraft. This is an external force on the spacecraft-exhaust system, meaning total momentum is NOT conserved for just the spacecraft+exhaust. Engineers must account for gravitational forces separately using orbital mechanics.\n\n**2. Continuous mass loss:**\nRockets don't fire in one instant — they burn fuel continuously over minutes. The spacecraft's mass changes continuously as fuel is expelled. The simple two-body formula becomes a differential equation (Tsiolkovsky Rocket Equation): Δv = v_exhaust × ln(m_initial/m_final).\n\n**3. Multiple gravitational bodies:**\nThe spacecraft is influenced by the Sun, Earth, Mars, Jupiter, and other planets. Each exerts external force, changing the system's momentum. NASA uses n-body gravitational simulations.\n\n**4. Relativistic effects (minor but real):**\nAt high speeds, Newton's momentum formula (p = mv) needs relativistic correction: p = mv/√(1-v²/c²). For current spacecraft speeds (~30 km/s), this correction is tiny but measurable by precision instruments.\n\n**5. Solar radiation pressure:**\nSunlight hitting the spacecraft exerts a tiny but continuous force (radiation pressure). Over months of travel, this adds up to measurable momentum changes.\n\n**6. Outgassing and micrometeorites:**\nSmall amounts of gas leak from the spacecraft (outgassing), creating tiny thrust. Micrometeorite impacts transfer momentum. Both must be accounted for.\n\n**What NASA actually does:**\nThey use the momentum conservation principle as the FOUNDATION, but wrap it in sophisticated numerical simulations that account for all these additional forces. The trajectory is computed using numerical integration of all forces over millions of time steps.\n\n**Key takeaway:** The law of conservation of momentum is absolutely valid, but the 'isolated system' condition is hard to achieve in practice. Engineers must carefully define system boundaries and account for all external forces.",
      explanation:
        "This exposes the gap between textbook physics (ideal isolated systems) and real engineering (complex external forces, continuous mass changes, multiple gravitational bodies). The conservation law is correct but its application requires sophisticated engineering.",
    },
    {
      id: "t5q40",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A student argues: 'If momentum is always conserved, then the total momentum of the entire universe must be constant. What is the total momentum of the universe?' Evaluate this philosophical and physical question.",
      correctAnswer:
        "**The student's logic is correct — and this is one of the deepest questions in physics!**\n\n**Is momentum conserved for the universe?**\nThe universe is the ultimate 'isolated system' — there's nothing outside it to exert external forces. By conservation of momentum, the total momentum of the universe should be constant.\n\n**What is the total momentum?**\nThere are several possibilities:\n\n**1. Total momentum = 0 (most likely)**\nIf the Big Bang was a symmetric explosion from a single point, all matter and radiation should have been ejected symmetrically in all directions. For every particle moving in one direction, there's a particle moving in the opposite direction. All momenta cancel out → total = 0.\n\nThis is supported by the Cosmic Microwave Background (CMB), which is almost perfectly uniform in all directions, suggesting symmetric expansion.\n\n**2. Total momentum ≠ 0 (possible but harder to define)**\nIf the Big Bang was slightly asymmetric, there could be a net momentum. But this raises the question: 'In what reference frame?' Momentum depends on the observer's reference frame. In the 'center of momentum frame' of the universe, the total is zero by definition.\n\n**3. The question might be meaningless (General Relativity)**\nIn Einstein's General Relativity, defining 'total momentum of the universe' is actually mathematically problematic. Momentum in curved spacetime isn't as simple as p = mv. For the universe as a whole, the concept may not be well-defined.\n\n**Deep philosophical implication:**\nIf total momentum = 0, then the universe has always had zero total momentum — even before the Big Bang. The Big Bang created equal amounts of 'forward' and 'backward' momentum that perfectly cancel. The universe, in a momentum sense, is 'nothing' — symmetric cancellation of all motion.\n\n**This connects to the question: 'Why is there something rather than nothing?'** Conservation of momentum suggests the universe might be, in a deep physical sense, 'nothing' — balanced quantities that sum to zero.",
      explanation:
        "This question bridges physics and philosophy. The conservation law applied to the entire universe leads to deep questions about the Big Bang, symmetry, and the nature of existence itself. A genuinely profound application of a seemingly simple law.",
    },
  ],
};
