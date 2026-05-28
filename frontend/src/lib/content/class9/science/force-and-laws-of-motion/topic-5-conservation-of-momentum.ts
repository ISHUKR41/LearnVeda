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
  ],
};
