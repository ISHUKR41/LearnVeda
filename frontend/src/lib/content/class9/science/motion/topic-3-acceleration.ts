/**
 * FILE: topic-3-acceleration.ts
 * LOCATION: src/lib/content/class9/science/motion/topic-3-acceleration.ts
 * PURPOSE: Deep content for Topic 3 — Acceleration.
 *          Definition, types (uniform/non-uniform), deceleration, free fall, g.
 *          CBSE Class 9 Science Chapter 8.
 * LAST UPDATED: 2026-05-28
 */
import { Topic } from "./types";

export const acceleration: Topic = {
  id: "acceleration",
  title: "3. Acceleration — The Rate of Change of Velocity",
  estimatedMinutes: 32,
  imageUrl:
    "/images/topics/motion/acceleration.png",
  content: `
### What Happens When Velocity Changes?

You are sitting in a car at a red light. The signal turns green. The driver presses the accelerator. The car's velocity changes from 0 km/h to 60 km/h over 10 seconds.

Something is happening here that Newton's Laws are built around — the velocity is **changing**. This rate of change of velocity is called **acceleration**.

But here's the deep insight: acceleration is not just "speeding up." It is **any change in velocity** — including:
* Speeding up (increasing speed)
* Slowing down (decreasing speed)
* **Changing direction** (even at constant speed!)

---

### Definition of Acceleration

> **Acceleration** is the rate of change of velocity of an object.

$$a = \frac{\Delta v}{\Delta t} = \frac{v - u}{t}$$

Where:
* $a$ = acceleration (m/s²)
* $v$ = final velocity (m/s)
* $u$ = initial velocity (m/s)
* $t$ = time taken for the change (s)

**Key properties:**
* **Vector quantity** — has both magnitude and direction
* **SI unit:** m/s² (metres per second squared)
* Can be positive (speeding up in positive direction), negative (decelerating or speeding up in negative direction), or zero (constant velocity)

---

### Intuitive Understanding: What Does m/s² Mean?

An acceleration of **5 m/s²** means:
* Every second, the velocity increases by **5 m/s**.
* After 1 second: velocity = 0 + 5 = 5 m/s
* After 2 seconds: velocity = 0 + 5 + 5 = 10 m/s
* After 3 seconds: velocity = 15 m/s
* Etc.

**Real comparison of accelerations:**

| Situation | Acceleration |
|---|---|
| Human walking to running | ~1–2 m/s² |
| Car starting from traffic light | ~2–4 m/s² |
| Sports car (0–100 in 4s) | ~7 m/s² |
| Free fall on Earth | 9.8 m/s² |
| Fighter jet taking off | ~30–50 m/s² |
| Bullet leaving a gun barrel | ~1,000,000 m/s² |

---

### Types of Acceleration

#### 1. Uniform Acceleration
The velocity changes by the **same amount in equal time intervals**.

* v-t graph: **straight diagonal line** (constant slope)
* Slope = acceleration = constant
* Examples: Free-falling object (approximately), ball rolling down a smooth ramp, car on a highway with constant engine thrust on a flat road

$$a = \frac{v - u}{t} = \text{constant for all time intervals}$$

#### 2. Non-Uniform Acceleration
The velocity changes by **different amounts in equal time intervals** — acceleration itself is changing.

* v-t graph: **curved line** (changing slope)
* Real-world example: A car in city traffic — speeding up, slowing down, stopping, turning. The rate of velocity change is never constant.

#### 3. Zero Acceleration (Uniform Velocity)
Velocity does NOT change — same speed, same direction.

* v-t graph: horizontal line
* a = 0
* Examples: spacecraft far from gravitational bodies, object on frictionless surface after initial push

---

### Deceleration — Negative Acceleration

When an object slows down, we say it **decelerates**. In physics, this is simply **negative acceleration** — acceleration in the direction opposite to motion.

**Example:**
A car moving at 30 m/s applies brakes and stops in 10 seconds.
$$a = \frac{v - u}{t} = \frac{0 - 30}{10} = \frac{-30}{10} = -3 \text{ m/s}^2$$

The negative sign tells us the acceleration is OPPOSITE to the direction of motion — the car is decelerating.

**Important:** In physics, "deceleration" is not a separate type — it's just negative acceleration. The formula is the same.

**Common mistake:** Students often think deceleration means "slowing down from a negative velocity." No — it simply means the acceleration vector is opposite to the velocity vector.

---

### Free Fall — Acceleration Due to Gravity (g)

The most important example of uniform acceleration in nature is **free fall** — the acceleration of an object falling under gravity alone (no air resistance).

> **g = 9.8 m/s² ≈ 10 m/s²** (downward, on Earth's surface)

This means: every second, a freely falling object gains 9.8 m/s of downward velocity.

| Time (s) | Velocity (m/s downward) |
|---|---|
| 0 | 0 |
| 1 | 9.8 |
| 2 | 19.6 |
| 3 | 29.4 |
| 4 | 39.2 |
| 5 | 49.0 |

**Galileo's revolutionary experiment:**
Aristotle believed heavy objects fall faster. Galileo (allegedly) dropped two cannonballs of different masses from the Leaning Tower of Pisa — they hit the ground simultaneously! (Actually, he used inclined planes.) All objects fall with the same acceleration g regardless of mass. A feather falls slower only because of air resistance — in a vacuum, a feather and a hammer fall at EXACTLY the same rate (demonstrated on the Moon by astronaut David Scott in 1971!).

**Why does mass not affect free-fall acceleration?**
From Newton's Second Law: a = F/m = mg/m = g. The mass cancels out! More massive objects have more gravitational force on them (mg increases with m), but they also have more inertia to overcome (m in denominator). These effects cancel exactly, giving the same g for all masses.

---

### Centripetal Acceleration — Changing Direction

An object moving in a circle at constant speed has **zero change in speed** but constantly changing **direction**. Therefore it has acceleration!

$$a_c = \frac{v^2}{r}$$

Where $v$ = speed and $r$ = radius of circular path.

This centripetal acceleration always points toward the center of the circle.

**Why does circular motion require force?**
From F = ma: centripetal acceleration exists → there must be a force (centripetal force) directed toward the center. For Earth orbiting Sun: gravity IS the centripetal force. For a car turning: friction IS the centripetal force. For a satellite: gravity IS the centripetal force.

---

### Reading Acceleration from a v-t Graph

The **slope** of the v-t graph = acceleration.

**Positive slope** (line going up): positive acceleration (speeding up in positive direction)
**Negative slope** (line going down): deceleration (slowing down, or negative acceleration)
**Horizontal line**: zero acceleration (constant velocity)
**Curved line**: non-uniform acceleration (acceleration is changing)

**Calculating from graph:**
If at t=0, v=5 m/s and at t=4, v=25 m/s (straight line):
$$a = \text{slope} = \frac{25-5}{4-0} = \frac{20}{4} = 5 \text{ m/s}^2$$
  `,
  questions: [
    {
      id: "mot3q1", type: "mcq", points: 10,
      question: "A car increases its speed from 20 m/s to 50 m/s in 6 seconds. Its acceleration is:",
      options: ["5 m/s²", "30 m/s²", "6 m/s²", "0.2 m/s²"],
      correctAnswer: "5 m/s²",
      explanation: "a = (v − u)/t = (50 − 20)/6 = 30/6 = 5 m/s². The car's velocity increases by 5 m/s every second."
    },
    {
      id: "mot3q2", type: "mcq", points: 10,
      question: "An object has acceleration = −8 m/s². This means:",
      options: [
        "The object is speeding up at 8 m/s²",
        "The object is at rest",
        "The object is decelerating — acceleration is opposite to direction of motion",
        "The object is moving at −8 m/s"
      ],
      correctAnswer: "The object is decelerating — acceleration is opposite to direction of motion",
      explanation: "Negative acceleration means the acceleration vector points opposite to the direction of motion. If the object was moving forward (positive direction), negative acceleration means it is slowing down. If the object was already moving backward (negative direction), negative acceleration means speeding up backward."
    },
    {
      id: "mot3q3", type: "mcq", points: 10,
      question: "A ball is thrown straight up. At the highest point, its velocity is 0. What is its acceleration at that point?",
      options: ["0 m/s²", "9.8 m/s² upward", "9.8 m/s² downward", "Cannot be determined"],
      correctAnswer: "9.8 m/s² downward",
      explanation: "Gravity continuously accelerates the ball downward at 9.8 m/s² throughout its flight — including at the top when velocity = 0. Acceleration and velocity are independent. The ball has zero velocity for an instant at the top, but gravity never stops acting."
    },
    {
      id: "mot3q4", type: "mcq", points: 10,
      question: "A car moves in a circle at constant speed. Its acceleration is:",
      options: [
        "Zero, because speed is constant",
        "Non-zero, directed toward the center of the circle",
        "Non-zero, directed outward from the center",
        "Non-zero, in the direction of motion"
      ],
      correctAnswer: "Non-zero, directed toward the center of the circle",
      explanation: "Velocity is a vector. Even at constant speed, continuously changing direction means continuously changing velocity vector = acceleration. This centripetal acceleration = v²/r and points toward the center of the circular path."
    },
    {
      id: "mot3q5", type: "mcq", points: 10,
      question: "On a velocity-time graph, what does the area under the curve represent?",
      options: ["Acceleration", "Speed", "Displacement", "Distance only for straight-line motion"],
      correctAnswer: "Displacement",
      explanation: "Area under the v-t graph = displacement. For displacement = ∫v dt. This works for any v-t graph — straight line or curved. The area gives the net displacement (vector), not just total distance."
    },
    {
      id: "mot3q6", type: "short", points: 15,
      question: "Define acceleration. What does a negative acceleration indicate? Give one example.",
      correctAnswer: "Acceleration is the rate of change of velocity: a = (v-u)/t. SI unit: m/s². It is a vector — magnitude and direction. Negative acceleration (deceleration) means acceleration opposes the direction of motion — the object slows down. Example: a braking car decelerating at −4 m/s² (moving forward but slowing down). A car initially at 40 m/s stops in 10s: a = (0-40)/10 = -4 m/s².",
      explanation: "Definition + formula + vector nature + negative = deceleration + numerical example."
    },
    {
      id: "mot3q7", type: "short", points: 15,
      question: "Explain why all objects fall with the same acceleration due to gravity (g), regardless of mass. Show this using Newton's laws.",
      correctAnswer: "Gravitational force on object = mg (mass × g). From Newton's 2nd Law: F = ma → mg = ma → a = g. The mass cancels from both sides! More mass means more gravitational force, but also more inertia (resistance to acceleration) — these effects cancel exactly. All objects fall with the same acceleration g ≈ 9.8 m/s² in the absence of air resistance. Proof: In a vacuum (no air resistance), a feather and a hammer fall together — demonstrated on the Moon by Apollo 15 astronaut David Scott in 1971.",
      explanation: "F = mg → a = g by cancellation. The mass-inertia cancellation is the key insight. Moon experiment example shows it's real."
    },
    {
      id: "mot3q8", type: "short", points: 15,
      question: "A train starts from rest and reaches 72 km/h in 20 seconds. Calculate its acceleration in m/s².",
      correctAnswer: "Convert 72 km/h to m/s: 72 × 5/18 = 20 m/s. u = 0 (starts from rest), v = 20 m/s, t = 20 s. a = (v-u)/t = (20-0)/20 = 1 m/s².",
      explanation: "Unit conversion first (km/h → m/s). Then a = (v-u)/t. Always check units — acceleration must be in m/s²."
    },
    {
      id: "mot3q9", type: "short", points: 15,
      question: "Distinguish between uniform and non-uniform acceleration with examples. What does each look like on a v-t graph?",
      correctAnswer: "Uniform acceleration: velocity changes by equal amounts in equal time intervals — constant acceleration. v-t graph: straight diagonal line (constant slope). Example: free fall under gravity (approximately), ball rolling down smooth ramp. Non-uniform acceleration: velocity changes by different amounts in equal time intervals — acceleration itself varies. v-t graph: curved line (changing slope). Example: car in city traffic, projectile with air resistance, rocket (mass decreases as fuel burns → acceleration increases).",
      explanation: "Both types defined with formula/description + v-t graph appearance + one real example each."
    },
    {
      id: "mot3q10", type: "short", points: 15,
      question: "How is acceleration related to the velocity-time graph? Calculate the acceleration from a v-t graph where velocity changes from 10 m/s to 40 m/s between t = 2s and t = 8s.",
      correctAnswer: "Acceleration = slope of v-t graph = Δv/Δt. From graph: Δv = 40-10 = 30 m/s. Δt = 8-2 = 6 s. a = 30/6 = 5 m/s². The line goes from point (2, 10) to (8, 40) — a straight line indicates uniform acceleration of 5 m/s².",
      explanation: "Slope = a formula + calculation with correct values from the described graph."
    },
    {
      id: "mot3q11", type: "long", points: 20,
      question: "A ball is dropped from rest from a height of 80 m. Taking g = 10 m/s²: (a) How long does it take to reach the ground? (b) What is its velocity just before hitting the ground? (c) What is its velocity after 2 seconds of fall?",
      correctAnswer: "(a) Using s = ut + ½at²: s = 80 m, u = 0 (dropped, not thrown), a = g = 10 m/s². 80 = 0 + ½ × 10 × t² = 5t². t² = 16. t = 4 seconds. (b) Using v² = u² + 2as: v² = 0 + 2 × 10 × 80 = 1600. v = √1600 = 40 m/s downward. Check: v = u + at = 0 + 10 × 4 = 40 m/s ✓ (c) After 2 seconds: v = u + at = 0 + 10 × 2 = 20 m/s downward. At this point the ball has fallen only s = ½×10×4 = 20 m — halfway through the fall but already at half the final velocity.",
      explanation: "Three-part problem using equations of motion. (a) s = ut + ½at² for time. (b) v² = u² + 2as for final velocity (or v = u + at with answer from a). (c) v = u + at directly."
    },
    {
      id: "mot3q12", type: "long", points: 20,
      question: "Explain uniform circular motion. Why is it a case of accelerated motion even though speed is constant? What direction is the acceleration and what provides it?",
      correctAnswer: "UNIFORM CIRCULAR MOTION: Object moves in a circle at constant speed. Speed is constant — but VELOCITY is constantly changing because direction changes at every point. Velocity is tangent to the circle — at every point on the circle, the tangent direction is different. Changing velocity = ACCELERATION must exist. CENTRIPETAL ACCELERATION: a_c = v²/r, directed toward the center of the circle. (Centripetal means 'centre-seeking.') It's always perpendicular to the velocity vector, which is why it changes direction but not magnitude of velocity. CENTRIPETAL FORCE SOURCES: This acceleration requires a centripetal force F = mv²/r toward center. Different situations provide this force differently: 1. Stone on string: TENSION in string → centripetal force. 2. Earth orbiting Sun: GRAVITY from Sun → centripetal force. 3. Car turning: FRICTION from road → centripetal force. 4. Satellite orbiting Earth: GRAVITY from Earth → centripetal force. 5. Electron orbiting nucleus: ELECTROMAGNETIC force → centripetal force. If centripetal force disappears (string breaks, engine off), the object flies off in a straight line tangent to the circle (Newton's 1st Law).",
      explanation: "Why constant speed ≠ constant velocity (direction changes). Centripetal acceleration direction and formula. Five different centripetal force sources. What happens when force disappears."
    },
    {
      id: "mot3q13", type: "long", points: 20,
      question: "A car brakes from 90 km/h and stops in 50 m. Calculate (a) the deceleration, (b) the braking time. If the same car is travelling at 180 km/h (double the speed), and the same braking force is applied (same deceleration), what is the stopping distance? Explain why this is dangerous.",
      correctAnswer: "Convert: 90 km/h = 25 m/s. u = 25 m/s, v = 0 m/s, s = 50 m. (a) DECELERATION: v² = u² + 2as → 0 = 625 + 2a × 50 → 100a = −625 → a = −6.25 m/s². Deceleration = 6.25 m/s². (b) BRAKING TIME: v = u + at → 0 = 25 + (−6.25)t → t = 25/6.25 = 4 seconds. AT DOUBLE SPEED (180 km/h = 50 m/s): Same deceleration −6.25 m/s². v² = u² + 2as → 0 = 2500 + 2(−6.25)s → 12.5s = 2500 → s = 200 m. COMPARISON: 90 km/h → 50 m stopping. 180 km/h (2× speed) → 200 m stopping (4× the distance!). WHY DANGEROUS: Stopping distance ∝ v² (quadratic relationship). Doubling speed quadruples stopping distance. At 180 km/h, the car covers 200 m after braking starts — if an obstacle appears 150 m ahead, collision is unavoidable even with immediate braking. Speed limits exist precisely because of this quadratic relationship.",
      explanation: "Both calculations using v² = u² + 2as and v = u + at. The quadratic relationship (2× speed → 4× stopping distance) from v² ∝ s is the critical safety insight."
    },
    {
      id: "mot3q14", type: "long", points: 20,
      question: "Describe a velocity-time graph for a ball thrown vertically upward that goes up, reaches maximum height, then falls back down. Label all phases, state the acceleration in each phase, and explain the graph's shape.",
      correctAnswer: "THROW PHASE (instantaneous): Ball given initial upward velocity v₀ (e.g., +20 m/s). GOING UP (phase 1): Velocity decreases from +20 m/s toward 0. v-t graph: straight line from (0, +20) sloping DOWNWARD. Acceleration = −g = −10 m/s² (gravity opposes upward motion). AT TOP (point): v = 0. On v-t graph: line crosses zero velocity axis. Time to top = v₀/g = 20/10 = 2 seconds. FALLING DOWN (phase 2): Velocity increases from 0 in NEGATIVE direction (downward = negative). v-t graph: straight line continues downward from 0, becoming increasingly negative. Acceleration = still −g = −10 m/s² (same! gravity always pulls down). After another 2 seconds: v = −20 m/s (same speed as thrown, opposite direction). GRAPH SHAPE: One continuous straight line from +v₀ to −v₀ with constant slope −g throughout. The line crosses zero at t = v₀/g (the top). CRITICAL INSIGHT: Acceleration is constant at −g = −10 m/s² throughout the ENTIRE flight — on the way up, at the top, and on the way down. Many students incorrectly think acceleration is zero at the top. At the top, velocity is zero but acceleration is still −10 m/s². Zero velocity ≠ zero acceleration.",
      explanation: "Full graph description for both phases. Constant acceleration throughout (−g always). The critical distinction: zero velocity at top ≠ zero acceleration at top."
    },
    {
      id: "mot3q15", type: "long", points: 20,
      question: "Explain with a real-world example how the same physical event involves multiple types of motion simultaneously. Use a cricket ball being bowled as your example, analyzing all accelerations involved.",
      correctAnswer: "CRICKET BALL BOWLING — MULTIPLE ACCELERATIONS: 1. RELEASE (run-up): During the bowler's run-up, the ball in hand undergoes approximately uniform acceleration as the bowler builds speed — forward acceleration from muscle force. 2. DELIVERY SWING: The bowler's arm swings in approximately circular motion — the ball undergoes centripetal acceleration toward the bowler's shoulder (changing direction continuously). 3. IN-FLIGHT (idealized, no spin): After release, only gravity acts. Ball undergoes constant downward acceleration of g = 9.8 m/s² (projectile motion — parabolic path). 4. IN-FLIGHT (real, with spin/swing): Air pressure differences create additional lateral forces → lateral acceleration (swing bowling). Air resistance creates backward acceleration (slowing). Spin creates Magnus effect → additional curved acceleration. 5. HITTING THE BAT: Enormous deceleration over very short contact time (~0.001s) to reverse ball direction — peak acceleration ~10,000 m/s². 6. AFTER HIT: Projectile motion again under gravity, modified by spin (top-spin, back-spin). INSIGHT: At any real moment in a cricket match, the ball experiences multiple accelerations simultaneously in different directions — gravity (constant, downward), air resistance (opposite to motion), spin effects (perpendicular to motion), and occasional impact forces (enormous, brief).",
      explanation: "Multiple simultaneous accelerations identified (centripetal, gravitational, drag, Magnus effect, impact). Each described with direction and cause. The integration of different acceleration types in one real example shows mastery."
    },
    {
      id: "mot3q16", type: "thinking", points: 25,
      question: "HOTS: A roller coaster car goes over a hill of radius 20 m at 15 m/s. (a) What centripetal acceleration does it experience? (b) At the top of the hill, what is the normal force on a 70 kg passenger? Will they feel lighter or heavier than normal? (c) What speed would make the passenger feel 'weightless' (apparent weight = 0)?",
      correctAnswer: "(a) Centripetal acceleration: a_c = v²/r = 15²/20 = 225/20 = 11.25 m/s² (directed downward, toward the center of the hill). (b) At the TOP of the hill, centripetal acceleration points DOWNWARD (toward center = ground). Weight W = mg = 70 × 9.8 = 686 N (downward). Net downward force = ma_c = 70 × 11.25 = 787.5 N. F_net = W − N (where N = normal force upward from seat). 686 − N = 787.5 → N = 686 − 787.5 = −101.5 N. Since N cannot be negative (seat can only push, not pull), this means the passenger would fly OFF the track at this speed — the car needs restraints! At 15 m/s over this hill, the passenger is actually trying to go faster than what circular motion requires — they'd be launched upward if not for the safety harness. (c) WEIGHTLESS (N = 0): mg − N = mv²/r → mg = mv²/r → v² = gr = 9.8 × 20 = 196 → v = 14 m/s. At 14 m/s, the passenger feels weightless — they are in free fall along with the car. At speeds > 14 m/s (like 15 m/s), passengers would need to be physically restrained (centripetal force required > gravity can supply).",
      explanation: "All three parts. Centripetal acceleration calculation. Normal force from F_net = W − N at hilltop. Finding weightless speed by setting N = 0. The restraint conclusion is sophisticated."
    },
    {
      id: "mot3q17", type: "thinking", points: 25,
      question: "HOTS: Astronaut Scott Kelly spent 340 days on the ISS. When he returned to Earth, he needed months of rehabilitation — his muscles had atrophied and his body had adapted to near-zero acceleration. Using your knowledge of acceleration due to gravity and Newton's laws, explain what his body experienced in space vs. on Earth.",
      correctAnswer: "ON EARTH: Every cell in Scott's body constantly experiences the effects of g = 9.8 m/s². Muscles must continuously contract against gravity to maintain posture, support bones, push blood upward. The heart must pump against gravity (head is above heart — blood must be pumped up). Bones bear compressive loads from body weight above them. IN SPACE (ISS in free fall): The ISS and everything inside falls around Earth continuously. Scott and the ISS share the same free-fall acceleration — there is no relative force between Scott and the ISS floor. APPARENT WEIGHTLESSNESS: No normal force from floor, no compressive force on bones, muscles need minimal effort to maintain posture (any gentle push sends him floating). BODY ADAPTATIONS AFTER 340 DAYS: MUSCLE ATROPHY: Without gravity resistance, muscles shrink (they have no load to work against). Particularly leg and core muscles. BONE DENSITY LOSS: Bones lose calcium when not bearing loads. Bone remodelling slows. CARDIOVASCULAR CHANGES: Heart doesn't need to pump against gravity → becomes weaker. Fluid redistribution (blood shifts to upper body in zero-g) changes blood vessel tone. RETURN TO EARTH: Suddenly g = 9.8 m/s² again. Weakened muscles must suddenly support body weight. Standing causes fainting (blood pools to legs, weakened cardiovascular system can't compensate). Rehabilitation: gradual exercise to rebuild muscles/bones, adapt cardiovascular system. The body literally doesn't know what g is — it optimises for the environment it's in.",
      explanation: "Physics of weightlessness (free fall). Body adaptations to zero-g (each system: muscle, bone, cardiovascular). Re-adaptation challenges on return. Connects acceleration physics to real human biology."
    },
    {
      id: "mot3q18", type: "thinking", points: 25,
      question: "HOTS: Why do engineers design roads with banked turns? Calculate the ideal banking angle for a car travelling at 20 m/s around a curve of radius 100 m. At this angle, no friction is needed — why?",
      correctAnswer: "WHY BANK ROADS: On a flat turn, friction provides the entire centripetal force. If v is too high or road is wet/icy (low friction), the car slides outward. Banking (tilting the road inward) allows gravity's horizontal component to provide centripetal force — reducing or eliminating friction requirement. ANALYSIS OF BANKED CURVE: For a car on a banked road (angle θ), the normal force N is perpendicular to the road surface, tilted inward by angle θ from vertical. Components: N sin θ = centripetal force = mv²/r (horizontal, toward center). N cos θ = weight mg (vertical, balancing gravity). Dividing: tan θ = v²/(rg). CALCULATION: v = 20 m/s, r = 100 m, g = 10 m/s². tan θ = 20²/(100×10) = 400/1000 = 0.4. θ = arctan(0.4) = 21.8° ≈ 22°. WHY NO FRICTION NEEDED AT THIS ANGLE: At exactly 22°, the horizontal component of N (inward) equals exactly the required centripetal force mv²/r. The vertical component of N equals mg. The car is in perfect balance with no tendency to slide up or down the bank. No friction is needed to supply centripetal force — gravity and the normal force together do it. At speeds above 20 m/s: car tends to slide UP the bank. Friction acts downward along bank. Below 20 m/s: car tends to slide DOWN the bank. Friction acts upward along bank. This is why mountain roads and racetracks use banked curves — especially important at high speeds.",
      explanation: "Force resolution on banked curve. tan θ = v²/rg derivation. Numerical answer (22°). Explanation of why friction is zero at ideal angle. Effects of speed above/below ideal."
    },
    {
      id: "mot3q19", type: "thinking", points: 25,
      question: "HOTS: A racing driver experiences 5g of lateral acceleration when cornering. If the driver has a mass of 70 kg: (a) What centripetal force does their body experience? (b) If corner radius is 50 m, what is their speed? (c) Why do racing drivers wear G-suits and helmets with head restraints?",
      correctAnswer: "(a) CENTRIPETAL FORCE: 5g acceleration means a = 5 × 9.8 = 49 m/s². F = ma = 70 × 49 = 3430 N. Compare: at rest, weight = 70 × 9.8 = 686 N. The driver's lateral load = 5 × their weight. Their body effectively 'weighs' 5× normal sideways. (b) SPEED FROM CENTRIPETAL FORMULA: a = v²/r → 49 = v²/50 → v² = 2450 → v = √2450 ≈ 49.5 m/s ≈ 178 km/h around a 50 m radius corner. (c) G-SUIT AND HEAD RESTRAINTS: G-SUIT: During high-g corners, blood pools toward the outer side of the body (away from corner center, outward). 5g can pull blood away from the driver's brain → G-LOC (g-induced loss of consciousness). Fighter pilot G-suits inflate with air around legs and abdomen, squeezing blood back toward the heart and brain. Racing drivers use similar systems in extreme cars. HALO AND HEAD RESTRAINTS: At 5g lateral: the driver's head (mass ~5 kg with helmet) exerts 5g × 5 kg = 245 N on the neck — sideways. Over 2-hour races with hundreds of corners, repeated neck stress. Head Restraint Systems (HANS device) prevent head from snapping in crashes. The helmet itself adds mass → increases neck force at high g. Engineers minimise helmet mass while maximising protection.",
      explanation: "Force calculation (F = ma). Speed from a = v²/r. G-suit physiology (blood pooling, G-LOC). HANS device mechanics. All connected through centripetal acceleration physics."
    },
    {
      id: "mot3q20", type: "thinking", points: 25,
      question: "HOTS: A satellite in circular orbit at height h above Earth's surface has a specific orbital speed. Derive an expression for orbital speed, calculate it for a satellite at 400 km altitude (Earth radius = 6400 km, g_surface = 9.8 m/s²), and explain why satellites in lower orbits move faster.",
      correctAnswer: "DERIVATION: For circular orbit, centripetal force = gravitational force. mv²/r = mg_h × m (where g_h = gravity at height h, r = orbital radius). Note: m cancels. v² = g_h × r. GRAVITY AT HEIGHT h: g_h = g_surface × (R/(R+h))² where R = Earth's radius. For h = 400 km: r = R + h = 6400 + 400 = 6800 km = 6,800,000 m. g_h = 9.8 × (6400/6800)² = 9.8 × (0.9412)² = 9.8 × 0.8858 = 8.68 m/s². ORBITAL SPEED: v = √(g_h × r) = √(8.68 × 6,800,000) = √(59,024,000) ≈ 7,683 m/s ≈ 7.7 km/s ≈ 27,700 km/h. This matches the known ISS orbital speed! WHY LOWER ORBITS = FASTER: v = √(g_h × r). As altitude decreases: (1) r decreases → v tends to decrease. But (2) g_h increases as we get closer to Earth → v tends to increase. The gravity effect dominates: v = √(GM/r) where GM = constant. As r decreases, v increases. Lower orbit = stronger gravity = must go faster to maintain orbit. Geosynchronous orbit (35,786 km): v ≈ 3.07 km/s (much slower). ISS (400 km): 7.7 km/s (must be faster to not fall). Skimming orbit (h→0): v ≈ 7.9 km/s (fastest possible orbit). A useful rule: orbital speed × orbital period × 2πr = constant — Kepler's Third Law.",
      explanation: "Derivation of v = √(gr). Numerical calculation for ISS altitude. Explanation of lower = faster relationship using v = √(GM/r). Comparison with GEO confirms the relationship."
    }
  ]
};
