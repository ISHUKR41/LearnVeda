/**
 * FILE: topic-3-second-law-of-motion.ts
 * LOCATION: src/lib/content/class9/science/force-and-laws-of-motion/topic-3-second-law-of-motion.ts
 * PURPOSE: Deep, richly detailed content for Topic 3 — Newton's Second Law of Motion
 *          (F = ma). Covers momentum, impulse, and the mathematical relationship
 *          between force, mass, and acceleration with full derivation and applications.
 * CURRICULUM: CBSE Class 9 Science, Chapter 9 — Force & Laws of Motion
 * LAST UPDATED: 2026-05-28
 */
import { Topic } from "./types";

export const secondLawOfMotion: Topic = {
  id: "second-law-of-motion",
  title: "3. Newton's Second Law of Motion (F = ma)",
  estimatedMinutes: 40,
  imageUrl:
    "https://images.unsplash.com/photo-1581093196277-9f608bb3b511?auto=format&fit=crop&q=80&w=1200",

  content: `
### The Question Newton's First Law Left Unanswered

Newton's First Law told us something critical: **an unbalanced force changes an object's motion**. But it left the most important question unanswered:

*"How much change? How exactly does force relate to the resulting acceleration?"*

If you push a shopping cart gently, it rolls slowly. If you push it hard, it shoots forward. Clearly the amount of force matters. Newton's Second Law gives us the precise, mathematical answer.

---

### First: What is Momentum?

Before we state the Second Law, we need to understand **Momentum** — one of the most fundamental concepts in all of physics.

> **Momentum (p)** = Mass × Velocity
> $$p = m \times v$$

Momentum represents the **"quantity of motion"** an object possesses. It captures both how heavy something is and how fast it's going.

**Real-life intuition:**
* A slow-moving truck vs. a fast-moving ping pong ball — which is harder to stop? The truck! It has far more momentum because of its enormous mass, even at low speed.
* At equal speeds, a 10-tonne truck has 10,000 times more momentum than a 1 kg object.

**Properties of Momentum:**
* **Vector quantity** — has both magnitude and direction (same direction as velocity)
* **SI Unit:** kg·m/s (kilograms × metres per second)
* **Can be zero** — a stationary object (v = 0) has zero momentum regardless of mass

#### Momentum Examples:
| Object | Mass | Velocity | Momentum |
|---|---|---|---|
| Cricket ball bowled fast | 0.16 kg | 40 m/s | 6.4 kg·m/s |
| Loaded truck | 5000 kg | 20 m/s | 100,000 kg·m/s |
| Bullet from gun | 0.01 kg | 800 m/s | 8 kg·m/s |
| Person walking | 60 kg | 1.5 m/s | 90 kg·m/s |

---

### Newton's Second Law — The Derivation

Newton's original statement was in terms of momentum:

> **"The rate of change of momentum of an object is directly proportional to the applied unbalanced force, and takes place in the direction of the force."**

Mathematically:

$$F \propto \frac{\Delta p}{\Delta t}$$

Now let's derive **F = ma** from this:

**Step 1:** Change in momentum:
$$\Delta p = p_f - p_i = mv_f - mv_i = m(v_f - v_i)$$

where $v_i$ = initial velocity, $v_f$ = final velocity

**Step 2:** Rate of change of momentum:
$$\frac{\Delta p}{\Delta t} = \frac{m(v_f - v_i)}{\Delta t} = m \times \frac{(v_f - v_i)}{\Delta t}$$

**Step 3:** Recall that acceleration $a = \frac{v_f - v_i}{\Delta t}$, so:
$$\frac{\Delta p}{\Delta t} = m \times a$$

**Step 4:** Force is proportional to this rate of change:
$$F \propto ma$$

Using the SI unit definition of Newton (choosing the proportionality constant = 1):

$$\boxed{F = ma}$$

---

### Understanding F = ma — Three Key Relationships

This single equation tells us three profound things:

#### Relationship 1: Force ∝ Acceleration (if mass is constant)
**For the same mass, more force = more acceleration.**

$$a = \frac{F}{m}$$

**Example:** Push a bicycle with 50 N → modest acceleration. Push the same bicycle with 200 N → 4× the acceleration (quadruple!). The bicycle's mass hasn't changed.

#### Relationship 2: Acceleration ∝ 1/Mass (if force is constant)
**For the same force, more mass = less acceleration.**

**Example:** Push a bicycle and a truck with the same 200 N force. The bicycle (20 kg) accelerates at 10 m/s². The truck (5000 kg) accelerates at only 0.04 m/s². Same force, wildly different acceleration because of different masses.

This is mathematically the definition of inertia: heavy objects resist acceleration.

#### Relationship 3: Force = Product of Both
**Acceleration = Force ÷ Mass — both matter.**

**Example calculation:**
A 500 kg car has a net force of 2000 N applied to it. What is the acceleration?
$$a = \frac{F}{m} = \frac{2000 \text{ N}}{500 \text{ kg}} = 4 \text{ m/s}^2$$

---

### What is Impulse?

Newton's Second Law in terms of momentum leads directly to the concept of **Impulse**:

$$F = \frac{\Delta p}{\Delta t}$$
$$F \times \Delta t = \Delta p$$

**Impulse (J)** = Force × Time = Change in momentum

$$\boxed{J = F \cdot \Delta t = \Delta p = m(v_f - v_i)}$$

**Key insight:** You can achieve the SAME change in momentum (same impulse) by either:
* Applying a **large force for a short time**, OR
* Applying a **small force for a long time**

This is the most practically important aspect of the Second Law!

---

### Impulse in Real Life — This Saves and Destroys!

#### Why Cricketers Pull Their Hands Back When Catching a Fast Ball

A cricket ball hits your hands with a certain momentum. To stop the ball, you must apply an impulse equal to that momentum (in the opposite direction). $J = F \times t = \Delta p$ (constant).

If you keep your hands rigid (short $\Delta t$), you need a VERY LARGE force $F$ to produce that impulse in a short time → **Painful!** Could injure your hand.

If you pull your hands backward as the ball arrives (large $\Delta t$), you need only a SMALL force to produce the same impulse → **Comfortable and safe!**

The ball still stops — the momentum change is the same. But the force is spread over more time.

#### Why Airbags in Cars Save Lives

In a crash, a passenger's momentum must be reduced to zero. A bare steering wheel stops the person in perhaps 0.01 seconds (very short $\Delta t$) → enormous force → severe injury or death.

An airbag extends the stopping time to perhaps 0.1 seconds (10× longer) → force reduced by 10× → far less injury.

Same impulse required (same momentum to eliminate), but the airbag extends the time to make the force survivable.

#### Why Karate Experts Break Bricks with Short Impact Time

Counterintuitively, karate experts do the OPPOSITE. They want maximum force. By striking in a very short time ($\Delta t$ very small), for a given momentum ($\Delta p$ = striking force × time), they maximize force:

$$F = \frac{\Delta p}{\Delta t}$$

Short $\Delta t$ → enormous $F$ → enough to break the brick!

#### Why High Jumpers Land on Foam Mats, Not Concrete

Same principle as cricket catching. The foam mat deforms, extending the time of impact, reducing the peak force on the athlete's body.

---

### Worked Problems — Step by Step

#### Problem 1: Basic F = ma
**Question:** What force is needed to give a 2 kg ball an acceleration of 5 m/s²?

**Solution:**
$$F = ma = 2 \text{ kg} \times 5 \text{ m/s}^2 = 10 \text{ N}$$

#### Problem 2: Finding Acceleration
**Question:** A net force of 300 N acts on a 60 kg person. What is their acceleration?

**Solution:**
$$a = \frac{F}{m} = \frac{300 \text{ N}}{60 \text{ kg}} = 5 \text{ m/s}^2$$

#### Problem 3: Impulse and Momentum
**Question:** A 0.5 kg ball is moving at 20 m/s. It is stopped in 0.1 seconds. What average force was applied?

**Solution:**
$$\Delta p = m(v_f - v_i) = 0.5 \times (0 - 20) = -10 \text{ kg·m/s}$$
$$F = \frac{\Delta p}{\Delta t} = \frac{-10}{0.1} = -100 \text{ N}$$

The negative sign means the force was opposite to the ball's direction (deceleration). Magnitude: **100 N**.

#### Problem 4: The Definition of 1 Newton
**Question:** Confirm: why is 1 N defined as the force to accelerate 1 kg at 1 m/s²?

**Solution:**
$$F = ma = 1 \text{ kg} \times 1 \text{ m/s}^2 = 1 \text{ N}$$

This is the definition — Newton's Second Law itself defines the unit!

---

### The Second Law vs. The First Law — How They Connect

Newton's First Law is actually a **special case** of the Second Law:

If $F_{net} = 0$:
$$F = ma \Rightarrow 0 = ma \Rightarrow a = 0$$

Zero acceleration means constant velocity (or rest). That IS Newton's First Law!

The First Law is just the Second Law applied when $F = 0$.

---

### Why This Law is So Powerful

**F = ma** is arguably the most important equation in classical mechanics. With it, you can:
* Calculate exactly how fast a rocket accelerates given its thrust
* Predict stopping distances of vehicles
* Design safer cars with airbags and crumple zones
* Understand why planets orbit the Sun
* Calculate the trajectory of a cannonball

From the motion of electrons to the orbit of galaxies, $F = ma$ (in various forms) applies everywhere in classical physics.
  `,

  questions: [
    /* ── 5 MCQs ── */
    {
      id: "t3q1",
      type: "mcq",
      points: 10,
      question:
        "A net force of 15 N acts on a 3 kg object. What is its acceleration?",
      options: ["5 m/s²", "45 m/s²", "0.2 m/s²", "18 m/s²"],
      correctAnswer: "5 m/s²",
      explanation:
        "Using F = ma: a = F/m = 15 N ÷ 3 kg = 5 m/s². Always divide force by mass to get acceleration.",
    },
    {
      id: "t3q2",
      type: "mcq",
      points: 10,
      question:
        "A cricket player pulls their hands backward while catching a fast ball. This technique is based on:",
      options: [
        "Increasing the momentum of the ball",
        "Increasing the time of impact to reduce the force on hands",
        "Decreasing the speed of the ball before it arrives",
        "Reducing the mass of the ball",
      ],
      correctAnswer:
        "Increasing the time of impact to reduce the force on hands",
      explanation:
        "From F = Δp/Δt: if Δp (change in momentum to stop the ball) is constant, increasing Δt (time of impact) decreases F (force on hands). Pulling back increases impact time, reducing the painful stopping force.",
    },
    {
      id: "t3q3",
      type: "mcq",
      points: 10,
      question:
        "The SI unit of momentum is:",
      options: ["Newton (N)", "kg·m/s²", "kg·m/s", "Joule (J)"],
      correctAnswer: "kg·m/s",
      explanation:
        "Momentum = mass × velocity = kg × m/s = kg·m/s. It is not Newtons (which is kg·m/s², the unit of force).",
    },
    {
      id: "t3q4",
      type: "mcq",
      points: 10,
      question:
        "A 1000 kg car accelerates at 2 m/s². What net force acts on the car?",
      options: ["500 N", "1998 N", "2000 N", "0.002 N"],
      correctAnswer: "2000 N",
      explanation:
        "F = ma = 1000 kg × 2 m/s² = 2000 N. This is the net (resultant) forward force after accounting for all resistive forces.",
    },
    {
      id: "t3q5",
      type: "mcq",
      points: 10,
      question:
        "If the same force is applied to objects of masses 2 kg, 5 kg, and 10 kg, which one gets the greatest acceleration?",
      options: ["10 kg", "5 kg", "2 kg", "All get equal acceleration"],
      correctAnswer: "2 kg",
      explanation:
        "a = F/m. For the same force, the object with the SMALLEST mass gets the greatest acceleration (a ∝ 1/m). The 2 kg object has the least mass → greatest acceleration.",
    },

    /* ── 5 Short Answer ── */
    {
      id: "t3q6",
      type: "short",
      points: 15,
      question:
        "State Newton's Second Law of Motion and write the mathematical formula that is derived from it.",
      correctAnswer:
        "Newton's Second Law states: The rate of change of momentum of an object is directly proportional to the net applied unbalanced force and occurs in the direction of the force. Mathematically: F = ma (Force = mass × acceleration), derived from F ∝ Δp/Δt = m(v-u)/t = ma.",
      explanation:
        "The verbal statement + the mathematical expression F = ma + ideally showing the derivation steps linking momentum to F = ma.",
    },
    {
      id: "t3q7",
      type: "short",
      points: 15,
      question:
        "Define momentum. A motorcycle (mass 200 kg) moves at 15 m/s. Calculate its momentum.",
      correctAnswer:
        "Momentum (p) = mass × velocity. It is the quantity of motion of an object and is a vector. p = mv = 200 kg × 15 m/s = 3000 kg·m/s in the direction of motion.",
      explanation:
        "Definition + formula + correct calculation with units. The direction component (vector) is worth mentioning.",
    },
    {
      id: "t3q8",
      type: "short",
      points: 15,
      question:
        "What is impulse? How is it related to force and time? Give a real-life example.",
      correctAnswer:
        "Impulse = Force × Time = Change in Momentum (J = FΔt = Δp). Impulse is the total effect of a force acting over a period of time. Example: Airbags in cars — they extend the time of impact during a crash, reducing the force on passengers for the same change in momentum, preventing injury.",
      explanation:
        "Definition + formula (J = FΔt = Δp) + valid real-life example showing the force-time trade-off.",
    },
    {
      id: "t3q9",
      type: "short",
      points: 15,
      question:
        "How does Newton's Second Law explain why a gun recoils when fired?",
      correctAnswer:
        "When a gun fires, it exerts a large force on the bullet. By Newton's Third Law, the bullet exerts an equal and opposite force on the gun. From F = ma: the gun (much larger mass than bullet) experiences a much smaller acceleration (recoil) backward. The bullet (small mass) experiences a large forward acceleration. The gun recoils because the backward force from the explosion acts on the gun's mass, giving it backward momentum.",
      explanation:
        "Connects Second Law (F = ma with different masses) and Third Law (action-reaction). The mass difference explains why the gun recoils slowly while the bullet accelerates rapidly.",
    },
    {
      id: "t3q10",
      type: "short",
      points: 15,
      question:
        "Show that Newton's First Law is a special case of Newton's Second Law.",
      correctAnswer:
        "Newton's Second Law: F = ma. If the net force F = 0, then: 0 = ma → a = 0 (since mass m ≠ 0). Zero acceleration means the velocity does not change — the object remains at rest (if v=0) or continues at constant velocity (if v≠0). This is exactly Newton's First Law! The First Law is simply the Second Law applied in the case of zero net force.",
      explanation:
        "Mathematical derivation showing F = 0 → a = 0 → constant velocity (or rest) = First Law. This elegant proof earns full marks.",
    },

    /* ── 5 Long Answer ── */
    {
      id: "t3q11",
      type: "long",
      points: 20,
      question:
        "Derive Newton's Second Law (F = ma) mathematically starting from the definition of momentum. Clearly show each step.",
      correctAnswer:
        "Step 1: Define momentum. Momentum p = mv (mass × velocity). Step 2: Newton's original statement — force is proportional to the RATE OF CHANGE of momentum: F ∝ Δp/Δt. Step 3: Calculate change in momentum: Δp = mv₂ − mv₁ = m(v₂ − v₁). [Assuming constant mass] Step 4: Substitute: F ∝ m(v₂ − v₁)/Δt. Step 5: Recognize (v₂ − v₁)/Δt = a (acceleration by definition). Step 6: Therefore F ∝ ma. Step 7: Choosing the SI proportionality constant = 1 (which defines the Newton unit): F = ma. VERIFICATION: 1 N = 1 kg × 1 m/s² — the unit of Newton is defined to make this constant exactly 1.",
      explanation:
        "All derivation steps must be clearly shown. Starting from p = mv, through rate of change, through identifying acceleration, to F = ma.",
    },
    {
      id: "t3q12",
      type: "long",
      points: 20,
      question:
        "Explain the concept of impulse (J = FΔt) with detailed examples showing why extending the time of impact reduces injury in sports and car safety design.",
      correctAnswer:
        "Impulse = F × Δt = Δp (change in momentum). The key insight: to achieve a given change in momentum (Δp, which is FIXED by the physical situation), if you increase Δt, you decrease F, and vice versa. SPORTS: (1) Cricket fielder catching: must reduce ball's momentum to zero. By pulling hands back, Δt increases → F decreases → less pain. (2) Long jump landing: foam pit instead of hard ground increases Δt of deceleration → reduces peak force on joints. CAR SAFETY: (1) Airbags: inflate to slow passengers over 0.1s instead of 0.01s → force reduced ~10× for same Δp. (2) Crumple zones: front of car designed to crumple (deform) on impact → crash duration increases from 0.05s to 0.1s → force on passengers halved. (3) Seatbelts: stretch slightly to extend stopping time of body. All these designs share the same physics: same impulse (momentum change), longer time, smaller force.",
      explanation:
        "The formula J = FΔt = Δp must be central. Multiple examples from sports and vehicle safety. The physics must be explicitly linked: same Δp, longer Δt, smaller F.",
    },
    {
      id: "t3q13",
      type: "long",
      points: 20,
      question:
        "A 5 kg ball is moving at 10 m/s. A force brings it to rest in (a) 0.1 seconds and (b) 2 seconds. Calculate the average force needed in each case. What does the comparison reveal?",
      correctAnswer:
        "Initial momentum: p = mv = 5 kg × 10 m/s = 50 kg·m/s. Final momentum = 0 (at rest). Change in momentum: Δp = 50 − 0 = 50 kg·m/s (magnitude). CASE (a): Δt = 0.1 s. F = Δp/Δt = 50/0.1 = 500 N. CASE (b): Δt = 2 s. F = Δp/Δt = 50/2 = 25 N. COMPARISON: The same momentum change requires 500 N if done in 0.1s, but only 25 N if done in 2s — a 20× difference! This demonstrates the inverse relationship between force and time (impulse constant). This is why catching a ball slowly hurts less, why airbags are life-saving, and why crumple zones are built into cars — extending impact time dramatically reduces peak force.",
      explanation:
        "Complete calculation for both cases with correct units. Comparison and physics explanation required for full marks.",
    },
    {
      id: "t3q14",
      type: "long",
      points: 20,
      question:
        "Explain how F = ma applies to the launch of a rocket. Why must rockets burn fuel continuously to maintain acceleration in space? How does mass change during the journey affect the rocket's acceleration?",
      correctAnswer:
        "ROCKET LAUNCH: From F = ma, the rocket's acceleration = Thrust/Mass. The engine burns fuel, creating hot gases ejected backward (reaction force = thrust forward). At launch, thrust must exceed the rocket's weight (gravity force) to create upward unbalanced net force. In space, even a small thrust creates acceleration because there's no gravity to overcome (approximately). MASS CHANGE: As the rocket burns fuel, its mass DECREASES. From a = F/m — if thrust F is constant, and mass m decreases, then acceleration a = F/m INCREASES as the journey continues! This is why rockets often accelerate faster as they get lighter. This principle is captured in the Tsiolkovsky Rocket Equation (advanced concept). FUEL REQUIREMENT: In deep space, no force is technically needed to maintain constant velocity (First Law). But to CHANGE velocity (speed up, slow down, change direction), thrust must be applied. All direction changes and speed changes require fuel expenditure because F = ma tells us acceleration (change in velocity) requires force.",
      explanation:
        "Three components: F=ma at launch (thrust vs. weight), mass reduction increasing acceleration, and why fuel is needed only for velocity changes (not for maintaining constant velocity in space).",
    },
    {
      id: "t3q15",
      type: "long",
      points: 20,
      question:
        "Two balls, one of mass 1 kg and one of mass 4 kg, start from rest and the same force of 20 N is applied to each for 3 seconds. Compare their final velocities and momentums. What does this tell us about Newton's Second Law?",
      correctAnswer:
        "BALL 1 (1 kg): Acceleration a₁ = F/m = 20/1 = 20 m/s². Final velocity v₁ = u + at = 0 + 20×3 = 60 m/s. Momentum p₁ = mv = 1×60 = 60 kg·m/s. BALL 2 (4 kg): Acceleration a₂ = F/m = 20/4 = 5 m/s². Final velocity v₂ = 0 + 5×3 = 15 m/s. Momentum p₂ = mv = 4×15 = 60 kg·m/s. COMPARISON: Both balls gain the SAME momentum (60 kg·m/s)! But Ball 1 moves 4× faster. INSIGHT: Same force applied for the same time = same impulse = same change in momentum (regardless of mass). This is fundamental: F×t = Δp. Both balls received the same impulse (20 N × 3 s = 60 N·s = 60 kg·m/s). However, the lighter ball converted this into higher speed (a = F/m is higher), while the heavier ball moved slower but used its large mass to carry the same momentum.",
      explanation:
        "Full calculations for both balls. The KEY insight that same impulse = same momentum change (regardless of mass) must be stated and connected to F×t = Δp.",
    },

    /* ── 5 HOTS/Deep Thinking ── */
    {
      id: "t3q16",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A glass falling on a hard floor breaks. The same glass falling on a soft carpet usually doesn't break. Both come to rest (v = 0). The change in momentum is the SAME. How can the carpet prevent breaking if the impulse is equal? Explain using Newton's Second Law.",
      correctAnswer:
        "The glass must lose the same momentum (Δp = mv − 0 = mv) in both cases. The impulse J = Δp is identical. From J = F × Δt: on HARD FLOOR: the hard surface stops the glass almost instantly (very small Δt ≈ 0.001s). F = Δp/Δt = mv/0.001 → enormous force → exceeds glass's structural strength → breaks. On CARPET: the soft fibers compress slowly, extending the impact time (Δt ≈ 0.01s, 10× longer). F = Δp/Δt = mv/0.01 → force is 10× smaller → may be within the glass's structural tolerance → doesn't break. The physical structure of glass has a BREAKING STRENGTH — a maximum force it can withstand. The carpet reduces peak force below that threshold by extending impact time. This is also why egg cartons have individual soft cups — same principle!",
      explanation:
        "The critical insight is that impulse is constant, but breaking depends on PEAK FORCE, not total impulse. Extending time lowers peak force below the material's breaking strength.",
    },
    {
      id: "t3q17",
      type: "thinking",
      points: 25,
      question:
        "HOTS: Can a very small force produce a very large momentum? Can a very large force produce zero momentum change? Explain with examples and the formula F = Δp/Δt.",
      correctAnswer:
        "SMALL FORCE → LARGE MOMENTUM: YES. From J = F × Δt = Δp, if a small force acts for a VERY LONG time, the impulse (and hence momentum change) can be enormous. Example: The solar wind exerts a tiny force (perhaps 0.0000001 N) on a spacecraft. But acting for years (hundreds of millions of seconds), it can produce measurable changes in momentum and trajectory. Solar sails are designed to exploit exactly this! LARGE FORCE → ZERO MOMENTUM CHANGE: YES. If a large force acts for ZERO time (Δt = 0), then J = F × 0 = 0 = Δp. Also: if equal and opposite large forces act simultaneously, net force = 0 → a = 0 → no momentum change. Example: Two people pushing a car from opposite sides with equal force — each applies a large force, but the car doesn't move (and doesn't gain momentum in any direction). These examples reveal that it is the PRODUCT of force and time (impulse) that determines momentum change, not force alone.",
      explanation:
        "Both cases must be logically argued using J = F×Δt = Δp. The solar sail example is a beautiful real-world application. The zero-momentum case for balanced forces is the Second Law connecting back to the First Law.",
    },
    {
      id: "t3q18",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A 60 kg person stands in an elevator. When the elevator accelerates upward at 2 m/s², what force does the floor exert on them? When it decelerates (accelerates downward) at 2 m/s², what force does the floor exert? What does this reveal about apparent weight?",
      correctAnswer:
        "Weight of person: W = mg = 60 × 10 = 600 N (using g ≈ 10 m/s²). ACCELERATING UPWARD (a = 2 m/s² upward): Using Newton's Second Law (taking upward as positive): N − W = ma. N − 600 = 60 × 2 = 120. N = 720 N. The person feels HEAVIER (720 N > 600 N). DECELERATING (accelerating downward at 2 m/s²): N − W = m(−a) = −ma. N − 600 = 60 × (−2) = −120. N = 480 N. The person feels LIGHTER (480 N < 600 N). INSIGHT: 'Apparent weight' (N, the normal force floor exerts) is NOT equal to actual weight (W = mg) when the elevator accelerates. Upward acceleration → N > W → feel heavier. Downward acceleration → N < W → feel lighter. In free fall (a = g downward) → N = 0 → feel weightless! This is exactly how astronauts in orbit 'feel' weightless — they are in continuous free fall around Earth.",
      explanation:
        "Full calculation for both cases using F = ma. The connection between apparent weight, normal force, and acceleration — culminating in the weightlessness insight for orbiting astronauts.",
    },
    {
      id: "t3q19",
      type: "thinking",
      points: 25,
      question:
        "HOTS: Formula One racing cars are designed to be as light as possible even though they have enormously powerful engines. Why? Wouldn't it be better to just add more engine power instead of saving weight? Analyze using F = ma.",
      correctAnswer:
        "From a = F/m, acceleration is determined by the RATIO of force to mass, not just force alone. SAVING WEIGHT ARGUMENT: If you halve the mass while keeping the same engine force, acceleration DOUBLES. This is often more effective (and safer) than doubling engine power (which increases force). In practice, engines face diminishing returns — doubling power doesn't double usable thrust due to mechanical limitations. WEIGHT SAVING EXAMPLE: If a car has 600 kg mass and 6000 N force, a = 10 m/s². Reduce mass to 500 kg (same engine): a = 12 m/s² (20% faster!). Add 500 N more force instead (601 kg): a = 10.016 m/s² (barely 0.1% faster!). SAFETY REASON: Lighter cars also brake faster (same braking force, less mass), handle corners better (less centrifugal tendency), and consume less fuel. F1 regulations even set a MINIMUM weight to prevent dangerously light cars. This is why carbon fiber, titanium, and exotic alloys — all lighter than steel — are used in racing.",
      explanation:
        "The key insight is a = F/m is about the RATIO. Weight reduction is multiplicative (halving mass doubles acceleration) versus adding force which is additive. Numerical comparison clinches the argument.",
    },
    {
      id: "t3q20",
      type: "thinking",
      points: 25,
      question:
        "HOTS: During a collision between a car (1000 kg, 20 m/s) and a wall, the car comes to rest in 0.05 seconds. Calculate the average force. Then explain why modern cars are designed with 'crumple zones' that make the crash take 0.2 seconds instead. How much force is saved?",
      correctAnswer:
        "ORIGINAL COLLISION: Δp = m(vf − vi) = 1000 × (0 − 20) = −20,000 kg·m/s (magnitude 20,000). F₁ = Δp/Δt = 20,000/0.05 = 400,000 N = 400 kN. WITH CRUMPLE ZONES (Δt = 0.2s): F₂ = 20,000/0.2 = 100,000 N = 100 kN. FORCE SAVED: 400,000 − 100,000 = 300,000 N (75% reduction!). CRUMPLE ZONE DESIGN: The front section of the car is intentionally designed with a 'crushable' structure — reinforced but meant to progressively buckle. This extends the crash duration from ~0.05s to ~0.2s (4× longer). Same momentum change. 4× longer time → 4× smaller peak force on passengers. A 400 kN force is virtually always fatal. A 100 kN force, with seatbelts and airbags distributing it, is often survivable. This is engineering using Newton's Second Law to save human lives.",
      explanation:
        "Full calculation for both time scenarios with clear comparison. The 75% force reduction with 4× longer time must be explicitly shown. Connection to human survivability makes the physics meaningful.",
    },
  ],
};
