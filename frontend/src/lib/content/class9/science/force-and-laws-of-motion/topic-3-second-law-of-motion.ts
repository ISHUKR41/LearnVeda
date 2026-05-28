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

![Figure 1: Under the same force, a larger mass accelerates slower than a smaller mass (a = F/m).](/images/second_law_fma.png)


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

![Figure 2: Cricketer pulling hands back to increase impact time, reducing the stopping force and preventing injury.](/images/cricketer_catching.png)


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

    /* ══════════════════════════════════════════
     *  5 MORE MCQ QUESTIONS (Total: 10 MCQ)
     * ══════════════════════════════════════════ */
    {
      id: "t3q21",
      type: "mcq",
      points: 10,
      question:
        "A 5 kg object at rest is acted upon by a force of 25 N for 4 seconds. What is the final velocity of the object?",
      options: ["5 m/s", "10 m/s", "20 m/s", "100 m/s"],
      correctAnswer: "20 m/s",
      explanation:
        "a = F/m = 25/5 = 5 m/s². Using v = u + at = 0 + 5 × 4 = 20 m/s. The force accelerates the 5 kg object from rest to 20 m/s in 4 seconds.",
    },
    {
      id: "t3q22",
      type: "mcq",
      points: 10,
      question:
        "The momentum of an object of mass 5 kg is 40 kg·m/s. What is its velocity?",
      options: ["200 m/s", "8 m/s", "45 m/s", "0.125 m/s"],
      correctAnswer: "8 m/s",
      explanation:
        "p = mv → v = p/m = 40/5 = 8 m/s. Velocity is calculated by dividing momentum by mass.",
    },
    {
      id: "t3q23",
      type: "mcq",
      points: 10,
      question:
        "Which of the following produces the maximum impulse on a body?",
      options: [
        "100 N applied for 0.5 seconds",
        "50 N applied for 2 seconds",
        "200 N applied for 0.2 seconds",
        "10 N applied for 8 seconds",
      ],
      correctAnswer: "50 N applied for 2 seconds",
      explanation:
        "Impulse J = F × t. (a) 100 × 0.5 = 50 N·s. (b) 50 × 2 = 100 N·s. (c) 200 × 0.2 = 40 N·s. (d) 10 × 8 = 80 N·s. 50 N for 2 seconds gives the largest impulse of 100 N·s.",
    },
    {
      id: "t3q24",
      type: "mcq",
      points: 10,
      question:
        "Two objects have the same momentum. Object A has mass 2 kg and Object B has mass 10 kg. Which has greater velocity?",
      options: [
        "Object A (2 kg)",
        "Object B (10 kg)",
        "Both have equal velocity",
        "Cannot be determined",
      ],
      correctAnswer: "Object A (2 kg)",
      explanation:
        "Since p = mv is the same for both, and mass of A < mass of B: v_A = p/2 and v_B = p/10. Since p/2 > p/10, Object A has the greater velocity. Lighter objects need higher velocity to carry the same momentum.",
    },
    {
      id: "t3q25",
      type: "mcq",
      points: 10,
      question:
        "A force of 10 N acts on a body of mass 2 kg. The body moves from rest. What distance does it cover in 4 seconds?",
      options: ["10 m", "20 m", "40 m", "80 m"],
      correctAnswer: "40 m",
      explanation:
        "a = F/m = 10/2 = 5 m/s². Using s = ut + ½at² = 0 + ½ × 5 × 4² = ½ × 5 × 16 = 40 m. The body covers 40 metres in 4 seconds starting from rest.",
    },

    /* ══════════════════════════════════════════
     *  5 MORE SHORT ANSWER (Total: 10 Short)
     * ══════════════════════════════════════════ */
    {
      id: "t3q26",
      type: "short",
      points: 15,
      question:
        "A body of mass 10 kg is moving with velocity 5 m/s. What force is required to stop it in 2 seconds?",
      correctAnswer:
        "Initial momentum = mv = 10 × 5 = 50 kg·m/s. Final momentum = 0 (stopped). Change in momentum Δp = 0 − 50 = −50 kg·m/s. Force = Δp/Δt = −50/2 = −25 N. The negative sign indicates the force acts opposite to the direction of motion. So a retarding force of 25 N is required.",
      explanation:
        "Apply F = Δp/Δt directly. The negative sign shows the force opposes motion (deceleration). Magnitude of force = 25 N.",
    },
    {
      id: "t3q27",
      type: "short",
      points: 15,
      question:
        "Why is it difficult to catch a cricket ball moving at high speed compared to a tennis ball moving at the same speed?",
      correctAnswer:
        "The cricket ball has greater mass (about 160 g) compared to a tennis ball (about 60 g). At the same speed, the cricket ball has more momentum (p = mv). To stop the ball (bring momentum to zero), a greater change in momentum is needed for the cricket ball. From F = Δp/Δt, greater Δp in the same time means greater force on the hands — which is more painful and difficult to handle.",
      explanation:
        "Same speed but different masses → different momenta → different forces needed to stop them in the same time. More massive = more momentum = more force = harder to catch.",
    },
    {
      id: "t3q28",
      type: "short",
      points: 15,
      question:
        "What happens to the acceleration of an object if the force on it is doubled while its mass remains constant?",
      correctAnswer:
        "From F = ma, if mass m is constant: a = F/m. When force is doubled (2F): new acceleration = 2F/m = 2(F/m) = 2a. The acceleration also doubles. This shows that acceleration is directly proportional to force when mass is constant (a ∝ F for fixed m).",
      explanation:
        "Direct proportionality: double the force → double the acceleration. This is one of the three key relationships in F = ma.",
    },
    {
      id: "t3q29",
      type: "short",
      points: 15,
      question:
        "Why do boxers wear padded gloves instead of fighting with bare fists?",
      correctAnswer:
        "Padded gloves increase the time of impact (Δt) when a punch lands. From the impulse-momentum theorem: F = Δp/Δt. The change in momentum (Δp) of the punch is the same with or without gloves. But with padded gloves, the contact time Δt is longer → the average force F is smaller → less damage to both the puncher's hand and the opponent. Bare fists have very short contact time → extremely high peak force → more injuries like fractures.",
      explanation:
        "Classic impulse application. Same Δp, longer Δt from padding → smaller F. This protects both fighters from bone fractures and brain injuries.",
    },
    {
      id: "t3q30",
      type: "short",
      points: 15,
      question:
        "A 0.2 kg ball is thrown with velocity 10 m/s and it bounces back with velocity 8 m/s. Calculate the change in momentum.",
      correctAnswer:
        "Taking the initial direction as positive: Initial momentum = m × v₁ = 0.2 × 10 = 2 kg·m/s. Final momentum = m × v₂ = 0.2 × (−8) = −1.6 kg·m/s (negative because it bounced back in the opposite direction). Change in momentum Δp = p_final − p_initial = −1.6 − 2 = −3.6 kg·m/s. The magnitude of change in momentum is 3.6 kg·m/s.",
      explanation:
        "When a ball bounces, the direction reverses, so the change in momentum is the sum of both momenta (initial forward + final backward). This is greater than if the ball simply stopped.",
    },

    /* ══════════════════════════════════════════
     *  5 MORE LONG ANSWER (Total: 10 Long)
     * ══════════════════════════════════════════ */
    {
      id: "t3q31",
      type: "long",
      points: 20,
      question:
        "A truck of mass 5000 kg is moving at 20 m/s. It applies brakes and comes to rest in 10 seconds. Calculate: (a) the initial momentum, (b) the final momentum, (c) the change in momentum, (d) the braking force, and (e) the deceleration.",
      correctAnswer:
        "(a) Initial momentum: p₁ = mv₁ = 5000 × 20 = 100,000 kg·m/s\n\n(b) Final momentum: p₂ = mv₂ = 5000 × 0 = 0 kg·m/s\n\n(c) Change in momentum: Δp = p₂ − p₁ = 0 − 100,000 = −100,000 kg·m/s\n(The negative sign means momentum decreased in the original direction)\n\n(d) Braking force: F = Δp/Δt = −100,000/10 = −10,000 N\nThe braking force is 10,000 N (10 kN) acting opposite to motion.\n\n(e) Deceleration: a = F/m = −10,000/5000 = −2 m/s²\nOr: a = (v₂ − v₁)/t = (0 − 20)/10 = −2 m/s²\nThe truck decelerates at 2 m/s².\n\nVerification: v = u + at = 20 + (−2)(10) = 20 − 20 = 0 ✓",
      explanation:
        "Complete step-by-step numerical problem covering momentum, impulse, force, and deceleration. The verification step at the end confirms the answer is consistent.",
    },
    {
      id: "t3q32",
      type: "long",
      points: 20,
      question:
        "Explain how Newton's Second Law helps us understand why the same engine can make different vehicles accelerate at different rates. Give numerical examples comparing a motorcycle and a truck.",
      correctAnswer:
        "Newton's Second Law: a = F/m. For the same engine force, acceleration depends inversely on mass.\n\n**Example:**\nSuppose an engine produces a net thrust of 5000 N.\n\n**Motorcycle (200 kg):**\na = F/m = 5000/200 = 25 m/s²\nThe motorcycle accelerates very rapidly — reaching 25 m/s (90 km/h) in just 1 second!\n\n**Car (1500 kg):**\na = F/m = 5000/1500 = 3.33 m/s²\nThe car accelerates much more slowly — taking about 7.5 seconds to reach 25 m/s.\n\n**Truck (10,000 kg):**\na = F/m = 5000/10000 = 0.5 m/s²\nThe truck barely accelerates — taking 50 seconds to reach the same speed!\n\n**Key Insight:** Acceleration is inversely proportional to mass for the same force (a ∝ 1/m). This is why:\n- Sports cars are designed to be lightweight (maximum acceleration)\n- Trucks need much more powerful engines (to get reasonable acceleration despite enormous mass)\n- Formula 1 cars use carbon fiber and exotic materials to minimize weight\n- Bicycles accelerate faster than buses even though your legs produce much less force than a bus engine — because the bicycle's mass is so much less\n\n**Quantitative relationship:** If mass doubles, acceleration halves for the same force. If mass triples, acceleration becomes one-third. This inverse relationship is one of the most practically important consequences of F = ma.",
      explanation:
        "The numerical comparison makes the abstract formula concrete. Students can directly see how mass determines acceleration for the same force, which is the core practical insight of Newton's Second Law.",
    },
    {
      id: "t3q33",
      type: "long",
      points: 20,
      question:
        "A ball of mass 0.5 kg is thrown against a wall at 10 m/s and bounces back at 8 m/s. The contact time with the wall is 0.02 seconds. Calculate: (a) the change in momentum, (b) the average force exerted by the wall on the ball, (c) the average force exerted by the ball on the wall.",
      correctAnswer:
        "Taking the initial direction (toward wall) as positive:\n\n(a) **Change in momentum:**\nInitial momentum = 0.5 × 10 = 5 kg·m/s (toward wall)\nFinal momentum = 0.5 × (−8) = −4 kg·m/s (away from wall, hence negative)\nΔp = p_final − p_initial = −4 − 5 = −9 kg·m/s\nMagnitude of change in momentum = 9 kg·m/s\n\n(b) **Average force by wall on ball:**\nF = Δp/Δt = −9/0.02 = −450 N\nThe wall exerts 450 N on the ball (in the direction away from the wall — pushing it back).\n\n(c) **Average force by ball on wall:**\nBy Newton's Third Law, the ball exerts an equal and opposite force on the wall.\nForce = 450 N (toward the wall — pushing into it).\n\n**Important note:** The change in momentum is 9 kg·m/s, NOT just 5 kg·m/s. When a ball bounces, both the stopping AND the reversing contribute to the momentum change. This is why bouncing balls exert more force on surfaces than balls that simply stick!",
      explanation:
        "This problem involves a direction reversal (bouncing), which makes the momentum change larger than if the ball simply stopped. The Third Law connection in part (c) reinforces the force pairs concept.",
    },
    {
      id: "t3q34",
      type: "long",
      points: 20,
      question:
        "Explain the relationship between force, mass, and acceleration using a real-life example of a bicycle rider. If the rider and bicycle together have a mass of 80 kg, and the rider pedals with a force of 160 N against a friction force of 40 N, calculate the acceleration and the speed after 10 seconds.",
      correctAnswer:
        "**Force Analysis:**\n- Applied force (pedaling): 160 N forward\n- Friction force: 40 N backward\n- Net force: F_net = 160 − 40 = 120 N forward\n\n**Acceleration:**\na = F_net/m = 120/80 = 1.5 m/s²\n\n**Speed after 10 seconds (starting from rest):**\nv = u + at = 0 + 1.5 × 10 = 15 m/s = 54 km/h\n\n**Relationship Explanation:**\n1. **Force → Acceleration:** The net force of 120 N causes acceleration. A larger net force (stronger pedaling or less friction) would cause greater acceleration.\n2. **Mass → Acceleration:** If the rider carried a heavy backpack (increasing mass to 100 kg), same net force of 120 N would give: a = 120/100 = 1.2 m/s² (less acceleration). Greater mass = less acceleration for the same force.\n3. **Combined:** Both force and mass determine acceleration through a = F/m. To go faster, either increase force (pedal harder) or decrease mass (lighter bicycle).\n\n**Additional calculation:** Distance covered in 10 seconds:\ns = ut + ½at² = 0 + ½ × 1.5 × 100 = 75 metres",
      explanation:
        "This problem integrates net force calculation, F = ma application, and kinematics equations. The additional mass comparison demonstrates the inverse relationship clearly.",
    },
    {
      id: "t3q35",
      type: "long",
      points: 20,
      question:
        "Explain in detail why high jumpers, pole vaulters, and gymnasts prefer to land on soft foam mats rather than hard surfaces. Use Newton's Second Law and the concept of impulse to justify your answer with calculations.",
      correctAnswer:
        "**The Physics of Landing:**\n\nWhen an athlete lands from a height, they have downward momentum: p = mv (where v depends on the height of fall). This momentum must be reduced to zero (they stop). The impulse required is: J = Δp = mv (constant — determined by mass and fall speed).\n\n**From F = Δp/Δt: F = mv/Δt**\n\n**Hard surface landing:** Contact time Δt ≈ 0.01 s (the body stops almost instantly).\nFor a 60 kg athlete falling from 2 m: v ≈ √(2gh) = √(2 × 10 × 2) = 6.3 m/s\np = mv = 60 × 6.3 = 378 kg·m/s\nF = 378/0.01 = **37,800 N** (about 63 times body weight!)\nThis force would cause severe injuries — broken bones, spinal damage.\n\n**Foam mat landing:** Contact time Δt ≈ 0.5 s (foam compresses slowly, cushioning the impact).\nF = 378/0.5 = **756 N** (about 1.26 times body weight)\nThis force is easily manageable — no injury.\n\n**Force reduction:** 37,800 ÷ 756 = **50 times less force!**\n\nThe foam mat extends the stopping time by 50× (from 0.01s to 0.5s), reducing the peak force by 50×. Same momentum change, dramatically different outcome.\n\n**Design principle:** All sports landing areas (foam mats, sand pits, water in diving) are designed to maximize Δt, minimizing F. This is pure Newton's Second Law applied to human safety.",
      explanation:
        "The numerical calculation makes the abstract concept viscerally real — a 50× force reduction is dramatic and clearly shows why soft landing surfaces are essential for athlete safety.",
    },

    /* ══════════════════════════════════════════
     *  5 MORE THINKING/HOTS (Total: 10 HOTS)
     * ══════════════════════════════════════════ */
    {
      id: "t3q36",
      type: "thinking",
      points: 25,
      question:
        "HOTS: If you are standing on a weighing machine in an elevator and the elevator cable breaks (free fall), what would the machine show? Use F = ma to explain why astronauts in the International Space Station appear weightless even though gravity acts on them.",
      correctAnswer:
        "**Elevator in free fall:**\nWhen the cable breaks, both you and the elevator fall together with acceleration g downward.\n\nApplying F = ma on you (taking downward as positive):\nmg − N = ma (where N = normal force = scale reading)\n\nIn free fall, a = g:\nmg − N = mg\nN = 0\n\nThe scale shows **ZERO!** You feel completely weightless even though gravity is pulling you at full strength. The scale reads zero because the floor is falling away at the same rate you are — it can't push up on you.\n\n**Astronauts in the ISS:**\nThe ISS orbits Earth at about 400 km altitude. At that height, gravity is about 90% of surface gravity — NOT zero! The astronauts ARE being pulled by gravity.\n\nBut the ISS and everything inside it are in continuous free fall around Earth (orbital motion = perpetual falling while moving sideways fast enough to miss the ground). Just like in the broken elevator, the astronauts and the ISS fall together → the floor can't push up on the astronauts → N = 0 → they feel weightless.\n\n**Key insight:** Weightlessness is NOT about absence of gravity. It's about the absence of Normal Force. You feel your weight through the floor pushing up. If the floor can't push (because it's falling too), you feel weightless. F = ma proves: when a = g, N must equal zero.\n\nAstronauts are in a state of continuous free fall — they just never hit the ground because their sideways velocity curves their fall into a circular orbit around Earth.",
      explanation:
        "This is one of the most profound applications of F = ma. Weightlessness in orbit is NOT due to lack of gravity — it's due to free fall. The mathematical proof (N = 0 when a = g) is elegant and surprising.",
    },
    {
      id: "t3q37",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A martial artist can break a concrete block with their hand. The hand's velocity just before impact is 10 m/s and it stops in 0.005 seconds. If the hand's mass is 0.7 kg, calculate the force. Why doesn't the hand break instead of the block?",
      correctAnswer:
        "**Force Calculation:**\nΔp = m(v_f − v_i) = 0.7 × (0 − 10) = −7 kg·m/s\nF = Δp/Δt = −7/0.005 = −1400 N\n\nThe hand exerts approximately **1400 N** (140 kg equivalent force) on the block.\n\n**Why the block breaks, not the hand:**\n\n1. **Material properties:** Human bone is surprisingly strong — it can withstand compressive forces of up to about 3400 N before fracturing. The 1400 N is within the hand's tolerance. Concrete blocks used in demonstrations are relatively thin and have lower flexural (bending) strength than compressive strength.\n\n2. **Force distribution:** The martial artist strikes with the heel of the palm or edge of the hand — a relatively large surface area. This distributes the force across the hand's strong bone structure. The block, supported at two ends and struck in the middle, experiences bending stress that concentrates at its weakest point.\n\n3. **Training:** Martial artists condition their bones through years of training, increasing bone density. Their striking technique minimizes contact time (maximizing force on the block) while aligning bones properly to handle the reaction force.\n\n4. **Follow-through:** The artist aims to strike THROUGH the block, not AT it. This means the hand's velocity is still high at the moment of contact, ensuring maximum momentum transfer.\n\n5. **Third Law:** By Newton's Third Law, the block exerts 1400 N back on the hand. The hand survives because this force is within its structural limits. If the block were too thick or strong, the reaction force could exceed the hand's breaking point — and the hand would break instead!",
      explanation:
        "This combines F = ma calculation with material science, anatomy, and Newton's Third Law. The numerical answer (1400 N) plus the structural analysis of why bone survives makes this a complete physics explanation.",
    },
    {
      id: "t3q38",
      type: "thinking",
      points: 25,
      question:
        "HOTS: Why is it much more dangerous to be hit by a small bullet (10 g at 800 m/s) than by a heavy football (450 g at 20 m/s), even though the football has more momentum? Explain using force and pressure concepts.",
      correctAnswer:
        "**Momentum comparison:**\nBullet: p = 0.01 × 800 = 8 kg·m/s\nFootball: p = 0.45 × 20 = 9 kg·m/s\n\nThe football has slightly MORE momentum! Yet the bullet is far more dangerous. Why?\n\n**1. Contact time (Δt):**\nBullet: Stops in approximately 0.001 seconds (penetrates and stops quickly)\nFootball: Stops in approximately 0.1 seconds (deforms on impact, bounces)\n\nBullet force: F = 8/0.001 = 8,000 N\nFootball force: F = 9/0.1 = 90 N\n\nThe bullet exerts about **89 times more force** despite having less momentum!\n\n**2. Contact area (Pressure):**\nBullet tip area: approximately 0.00003 m² (3 mm²)\nFootball contact area: approximately 0.01 m² (100 cm²)\n\nBullet pressure: P = 8000/0.00003 = 267,000,000 Pa (267 MPa)\nFootball pressure: P = 90/0.01 = 9,000 Pa (9 kPa)\n\nThe bullet exerts approximately **30,000 times more pressure!**\n\n**3. The combination is lethal:**\nThe bullet combines extremely short contact time (huge force from F = Δp/Δt) with extremely small contact area (huge pressure from P = F/A). This concentrated force over a tiny area easily penetrates skin, muscle, and bone.\n\nThe football, despite more momentum, has longer contact time (lower force) and larger contact area (lower pressure). It causes bruising at most.\n\n**Key lesson:** Danger depends not just on momentum, but on HOW that momentum is delivered — short time + small area = devastating. This is why armor-piercing rounds are pointed and why safety equipment increases both contact time and contact area.",
      explanation:
        "This brilliantly demonstrates that momentum alone doesn't determine damage. The TIME over which force acts and the AREA over which it's distributed are equally critical. This connects F = Δp/Δt with pressure P = F/A.",
    },
    {
      id: "t3q39",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A 50 kg person jumps from a 1 metre height. Compare the force on their legs when they (a) land with stiff, locked legs and (b) land by bending their knees. Assume landing time is 0.02 s for stiff legs and 0.5 s for bent knees. Which technique is safer and why?",
      correctAnswer:
        "**Step 1: Calculate velocity at landing:**\nUsing v² = u² + 2gs (u = 0, s = 1 m, g = 10 m/s²):\nv² = 0 + 2 × 10 × 1 = 20\nv = √20 ≈ 4.47 m/s\n\n**Step 2: Calculate momentum at landing:**\np = mv = 50 × 4.47 = 223.5 kg·m/s\n\n**Step 3: Calculate force for each landing:**\n\n**(a) Stiff legs (Δt = 0.02 s):**\nF = Δp/Δt = 223.5/0.02 = **11,175 N ≈ 11.2 kN**\nThis is about 22.7 times the person's body weight (50 × 10 = 500 N).\nThis force can easily cause ankle fractures, knee injuries, and spinal compression!\n\n**(b) Bent knees (Δt = 0.5 s):**\nF = Δp/Δt = 223.5/0.5 = **447 N ≈ 0.45 kN**\nThis is less than the person's own body weight!\nThis force is completely safe and comfortable.\n\n**Force comparison:** 11,175 ÷ 447 = **25 times less force** with bent knees!\n\n**Why bending knees works:** When you bend your knees during landing, your muscles and joints act as shock absorbers, extending the deceleration time from 0.02s to 0.5s (25× longer). Same momentum to absorb, but spread over much more time → much less force per instant.\n\n**Safety conclusion:** Landing with bent knees is dramatically safer — reducing impact force by 96%! This is why:\n- Paratroopers roll when landing\n- Gymnasts bend their knees on dismounts\n- Parkour practitioners use rolling landings\n- Cats bend their legs when landing from heights\n\nAll of these techniques maximize Δt to minimize F. This is Newton's Second Law saving bones!",
      explanation:
        "Complete numerical analysis showing a 25× force reduction. The comparison between stiff and bent-knee landing is vivid and practically important. The biological examples (cats, paratroopers) reinforce the physics.",
    },
    {
      id: "t3q40",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A student claims: 'If F = ma, then a heavier person should fall faster than a lighter person because the gravitational force on them is greater.' Use Newton's Second Law to prove this student wrong.",
      correctAnswer:
        "The student's argument seems logical but has a fatal flaw. Let's analyze:\n\n**For a heavy person (mass M):**\nGravitational force: F₁ = Mg\nAcceleration: a₁ = F₁/M = Mg/M = g\n\n**For a light person (mass m):**\nGravitational force: F₂ = mg\nAcceleration: a₂ = F₂/m = mg/m = g\n\n**Both accelerate at exactly g ≈ 9.8 m/s²!**\n\n**The student's error:** Yes, the heavier person has MORE gravitational force. But they also have MORE mass (more inertia resisting that force). These two effects perfectly cancel out!\n\nThe heavy person: more force pulling → wants to go faster. But more mass resisting → wants to go slower. Net effect: exactly the same acceleration as the light person.\n\n**Mathematically:** The mass appears in BOTH the force (F = mg) and the resistance to acceleration (F = ma). When you divide force by mass to get acceleration: a = mg/m = g. The mass cancels out completely!\n\n**Experimental proof:** Galileo demonstrated this at the Leaning Tower of Pisa (possibly). On the Moon (no air), Apollo 15 astronaut David Scott dropped a hammer (1.32 kg) and a feather (0.03 kg) — they hit the ground at exactly the same time.\n\n**On Earth with air:** Air resistance IS different for different shapes/sizes, so a feather does fall slower than a hammer in air. But this is due to air resistance (an additional force), NOT due to gravity discriminating by mass. In vacuum, all objects fall identically.\n\n**This is one of the most profound results in physics:** Gravitational mass (how much gravity pulls) and inertial mass (how much matter resists acceleration) are exactly equal. Einstein later made this 'equivalence principle' the foundation of General Relativity!",
      explanation:
        "This beautifully demonstrates why mass cancels in free fall. The student's error is focusing on force alone without considering that the same mass that increases force also increases resistance to acceleration. The mass cancellation (a = mg/m = g) is one of the deepest results in physics.",
    },
  ],
};
