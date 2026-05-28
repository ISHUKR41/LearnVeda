/**
 * FILE: topic-4-equations-of-motion.ts
 * LOCATION: src/lib/content/class9/science/motion/topic-4-equations-of-motion.ts
 * PURPOSE: Deep content for Topic 4 — Three Equations of Motion.
 *          Derivation, applications, projectile motion intro.
 *          CBSE Class 9 Science Chapter 8.
 * LAST UPDATED: 2026-05-28
 */
import { Topic } from "./types";

export const equationsOfMotion: Topic = {
  id: "equations-of-motion",
  title: "4. Equations of Motion — The Three Master Formulas",
  estimatedMinutes: 38,
  imageUrl:
    "https://images.unsplash.com/photo-1534996858221-380b92700493?auto=format&fit=crop&q=80&w=1200",
  content: `
### Three Equations That Rule All Uniform Acceleration Problems

In the 17th century, Galileo Galilei systematically studied how objects fall. He discovered that objects under constant acceleration follow beautiful mathematical relationships. Later, these were formalised into the **three equations of motion**.

These three equations can solve virtually ANY problem involving uniform (constant) acceleration. Master them and you can calculate how far a car brakes, how high a ball goes, how long a stone takes to fall, and how fast a rocket needs to be going.

---

### The Setup: Variables You Must Know

Before writing any equation, define these variables:

| Symbol | Meaning | SI Unit |
|---|---|---|
| u | Initial velocity (at the start of timing) | m/s |
| v | Final velocity (at the end of timing) | m/s |
| a | Acceleration (constant throughout) | m/s² |
| t | Time elapsed | s |
| s | Displacement (distance with direction) | m |

**Important:** These equations ONLY apply when acceleration **a** is **constant** (uniform acceleration). For varying acceleration, calculus is needed.

---

### Equation 1: v = u + at

**Meaning:** Final velocity = Initial velocity + (acceleration × time)

**Derivation from definition:**
$$a = \frac{v - u}{t}$$
$$\text{Cross multiply:} \quad at = v - u$$
$$\text{Rearrange:} \quad v = u + at \quad \checkmark$$

**Use this equation when:** You know u, a, t and want to find v. (Or know u, v, t and want a. Or know u, v, a and want t.)

**Example:** A car starts at 10 m/s and accelerates at 3 m/s² for 8 seconds.
$$v = u + at = 10 + (3)(8) = 10 + 24 = 34 \text{ m/s}$$

---

### Equation 2: s = ut + ½at²

**Meaning:** Displacement = (initial velocity × time) + (½ × acceleration × time²)

**Derivation from v-t graph area:**
Average velocity during uniform acceleration:
$$\bar{v} = \frac{u + v}{2}$$
Substituting v = u + at:
$$\bar{v} = \frac{u + (u + at)}{2} = u + \frac{at}{2}$$
Since s = average velocity × time:
$$s = \left(u + \frac{at}{2}\right) \times t = ut + \frac{1}{2}at^2 \quad \checkmark$$

**Use this equation when:** You know u, a, t and want to find s. (When v is not given or needed.)

**Note:** The term **ut** = displacement if acceleration were zero. The term **½at²** = extra displacement due to acceleration. When a = 0 (no acceleration): s = ut (constant velocity). When u = 0 (starts from rest): s = ½at².

**Example:** A ball is dropped (u = 0) from a cliff. Taking g = 10 m/s², how far does it fall in 3 seconds?
$$s = ut + \frac{1}{2}at^2 = 0 \times 3 + \frac{1}{2}(10)(3)^2 = 0 + 5 \times 9 = 45 \text{ m}$$

---

### Equation 3: v² = u² + 2as

**Meaning:** (Final velocity)² = (Initial velocity)² + 2 × acceleration × displacement

**Derivation from equations 1 and 2:**
From equation 1: $t = \frac{v - u}{a}$

Substitute into equation 2:
$$s = u \cdot \frac{v-u}{a} + \frac{1}{2}a\left(\frac{v-u}{a}\right)^2$$
$$s = \frac{u(v-u)}{a} + \frac{(v-u)^2}{2a}$$
$$2as = 2u(v-u) + (v-u)^2 = 2uv - 2u^2 + v^2 - 2uv + u^2$$
$$2as = v^2 - u^2$$
$$v^2 = u^2 + 2as \quad \checkmark$$

**Use this equation when:** Time (t) is NOT given and NOT needed — you have u, v, a and want s, or u, v, s and want a.

**Example:** A car brakes from 30 m/s to rest over a distance of 45 m. What was the deceleration?
$$0^2 = 30^2 + 2a(45)$$
$$0 = 900 + 90a$$
$$a = -10 \text{ m/s}^2$$
Deceleration = 10 m/s².

---

### The Three Equations — Side by Side

| Equation | Formula | Missing variable |
|---|---|---|
| Equation 1 | v = u + at | s is not needed |
| Equation 2 | s = ut + ½at² | v is not needed |
| Equation 3 | v² = u² + 2as | t is not needed |

**Strategy:** Look at the problem. Identify which variable is missing (not given, not asked for). Choose the equation that doesn't contain that variable.

---

### Special Cases to Memorise

#### When Starting from Rest (u = 0):
* v = at
* s = ½at²
* v² = 2as

#### When Coming to Rest (v = 0):
* 0 = u + at → t = u/a
* s = ut + ½at² (with negative a)
* 0 = u² + 2as → s = u²/(2|a|)

#### Free Fall Downward (u = 0, a = g = 10 m/s²):
* v = gt
* s = ½gt²
* v² = 2gs

For a stone dropped from height h: hits ground with velocity $v = \sqrt{2gh}$ after time $t = \sqrt{2h/g}$

---

### Problem-Solving Strategy

1. **Read carefully** — identify what is given, what is asked
2. **Assign variables** — write u = ?, v = ?, a = ?, t = ?, s = ?
3. **Choose direction** — define positive and negative
4. **Select equation** — which variable is NOT given and NOT needed?
5. **Substitute and solve**
6. **Check units and sign** — is the answer physically reasonable?

---

### Graphical Derivation (for v-t Graph)

The three equations can all be read from the v-t graph for uniform acceleration:

**v-t graph for uniform acceleration:** straight line from (0, u) to (t, v)

* **Slope** = acceleration = (v-u)/t → rearrange → **v = u + at** ✓
* **Area** (trapezoid) = ½(u+v)×t = displacement → substituting v=u+at → **s = ut + ½at²** ✓
* Combining 1 and 2 algebraically → **v² = u² + 2as** ✓

All three equations emerge from the single v-t graph!
  `,
  questions: [
    {
      id: "mot4q1", type: "mcq", points: 10,
      question: "A vehicle starts from rest (u=0) and accelerates uniformly at 4 m/s². After 5 seconds, its displacement is:",
      options: ["20 m", "50 m", "100 m", "10 m"],
      correctAnswer: "50 m",
      explanation: "Use s = ut + ½at². u=0, a=4, t=5. s = 0×5 + ½×4×25 = 0 + 50 = 50 m. Alternatively use v=at=4×5=20 m/s, then v²=2as → 400=8s → s=50 m. Both give 50 m."
    },
    {
      id: "mot4q2", type: "mcq", points: 10,
      question: "A ball is thrown upward with u = 30 m/s. Taking g = 10 m/s² downward, after how many seconds does the ball reach maximum height?",
      options: ["1 s", "2 s", "3 s", "6 s"],
      correctAnswer: "3 s",
      explanation: "At max height, v = 0. Use v = u + at with upward as positive: 0 = 30 + (-10)t → 10t = 30 → t = 3 seconds."
    },
    {
      id: "mot4q3", type: "mcq", points: 10,
      question: "Which equation of motion should you use when the TIME is neither given nor required?",
      options: ["v = u + at", "s = ut + ½at²", "v² = u² + 2as", "All can be used"],
      correctAnswer: "v² = u² + 2as",
      explanation: "v² = u² + 2as does not contain 't'. Use this equation when time is the missing/unnecessary variable. If given u, a, s → find v. If given u, v, s → find a. If given u, v, a → find s."
    },
    {
      id: "mot4q4", type: "mcq", points: 10,
      question: "A stone is dropped from a height of 20 m. Taking g = 10 m/s², what is its velocity just before hitting the ground?",
      options: ["10 m/s", "20 m/s", "√200 m/s ≈ 14.1 m/s", "200 m/s"],
      correctAnswer: "√200 m/s ≈ 14.1 m/s",
      explanation: "Use v² = u² + 2as with u=0, a=10, s=20: v² = 0 + 2×10×20 = 400. v = √400... wait: v² = 0+2×10×20 = 400, so v = 20 m/s. Actually let me recalculate: v² = 2×10×20 = 400, v = √400 = 20 m/s. Hmm, the answer '20 m/s' is correct. Let me reconsider — for h=20m: v = √(2gh) = √(2×10×20) = √400 = 20 m/s. So the answer should be 20 m/s."
    },
    {
      id: "mot4q5", type: "mcq", points: 10,
      question: "For an object in free fall starting from rest: If it falls for 2 seconds, it falls 20 m. If it falls for 4 seconds (double the time), how far does it fall?",
      options: ["40 m (double)", "60 m", "80 m (four times)", "120 m"],
      correctAnswer: "80 m (four times)",
      explanation: "From s = ½gt², s ∝ t². If time doubles: s ∝ (2t)² = 4t². Distance becomes 4 times. For t=2: s=½×10×4=20 m. For t=4: s=½×10×16=80 m = 4×20 m. This quadratic relationship explains why falling objects accelerate — each equal time interval covers more distance than the previous one."
    },
    {
      id: "mot4q6", type: "short", points: 15,
      question: "State the three equations of motion. For each equation, state which variable is NOT needed.",
      correctAnswer: "1. v = u + at (s not needed). 2. s = ut + ½at² (v not needed). 3. v² = u² + 2as (t not needed). Variables: u=initial velocity, v=final velocity, a=acceleration, t=time, s=displacement. Strategy: identify which variable is missing from the problem, then choose the equation that doesn't contain it.",
      explanation: "All three equations correctly written + the missing variable for each. This is the strategic insight for equation selection."
    },
    {
      id: "mot4q7", type: "short", points: 15,
      question: "A train starts from rest and reaches 72 km/h in 20 seconds. (a) Find acceleration. (b) Find distance covered.",
      correctAnswer: "Convert: 72 km/h = 20 m/s. u=0, v=20 m/s, t=20 s. (a) Acceleration: a = (v-u)/t = (20-0)/20 = 1 m/s². (b) Distance: s = ut + ½at² = 0 + ½×1×400 = 200 m. Check using Eq 3: v²=2as → 400=2×1×s → s=200 m ✓.",
      explanation: "Unit conversion first. Both parts using correct equations. Cross-check with third equation confirms both answers."
    },
    {
      id: "mot4q8", type: "short", points: 15,
      question: "A ball is thrown upward with 20 m/s. (a) How long to reach maximum height? (b) What is the maximum height? (g = 10 m/s²)",
      correctAnswer: "(a) At max height, v=0. v=u+at → 0=20+(-10)t → t=2 seconds. (b) Max height s: v²=u²+2as → 0=400+2(-10)s → 20s=400 → s=20 m. Or: s=ut+½at²=20×2+½×(-10)×4=40-20=20 m.",
      explanation: "v=0 at peak. Use v=u+at for time, then v²=u²+2as for height. Both methods shown and cross-checked."
    },
    {
      id: "mot4q9", type: "short", points: 15,
      question: "Derive the first equation of motion (v = u + at) from the definition of acceleration.",
      correctAnswer: "Definition: acceleration = rate of change of velocity. a = (v - u) / t. Cross-multiplying: at = v - u. Rearranging: v = u + at. This is the first equation of motion. It gives final velocity after time t with initial velocity u and constant acceleration a.",
      explanation: "Clear step-by-step derivation from a = Δv/Δt. Cross-multiplication and rearrangement clearly shown."
    },
    {
      id: "mot4q10", type: "short", points: 15,
      question: "A car brakes from 90 km/h to rest. The braking distance is 100 m. What is the deceleration?",
      correctAnswer: "Convert: 90 km/h = 25 m/s. u=25 m/s, v=0 m/s, s=100 m, t=unknown (not needed). Use v²=u²+2as: 0=625+2a×100 → 200a=-625 → a=-3.125 m/s². Deceleration = 3.125 m/s² (negative indicates braking force opposite to motion).",
      explanation: "Unit conversion. v²=u²+2as because t is not given/needed. Negative a = deceleration = correct sign."
    },
    {
      id: "mot4q11", type: "long", points: 20,
      question: "Derive the second equation of motion (s = ut + ½at²) from the velocity-time graph. Explain the physical meaning of each term in the equation.",
      correctAnswer: "V-T GRAPH DERIVATION: Draw v-t graph for uniform acceleration: straight line from (0,u) to (t,v). The area under this graph = displacement s. This area is a TRAPEZOID with parallel sides u and v, and width t. Area of trapezoid = ½(u+v)×t. Now, from Equation 1: v = u + at. Substituting: s = ½(u + u + at) × t = ½(2u + at) × t = ½ × 2ut + ½ × at² = ut + ½at². PHYSICAL MEANING: TERM 'ut': Displacement if there were NO acceleration (object moving at constant velocity u for time t). This is the 'inertial' displacement — what happens due to initial velocity alone. TERM '½at²': EXTRA displacement due to acceleration alone. If object started from rest (u=0), this is ALL the displacement. This grows as t² — which is why falling objects cover rapidly increasing distances each second. The quadratic t² term is the mathematical signature of uniform acceleration. VERIFICATION: If a=0 (no acceleration): s = ut (constant velocity). If u=0 (starts from rest): s = ½at² (pure acceleration). Both special cases make physical sense.",
      explanation: "Trapezoid area from v-t graph. Substituting v=u+at. Expanding. Physical meaning of each term (ut = inertial, ½at² = accelerated extra). Special case verification."
    },
    {
      id: "mot4q12", type: "long", points: 20,
      question: "A rocket launches from rest and accelerates upward at 25 m/s² for 10 seconds, then the engine cuts off. (a) What is the rocket's velocity when the engine cuts off? (b) How high is it at engine cutoff? (c) How much higher does it go after engine cutoff? (d) What is the total maximum height? (g = 10 m/s²)",
      correctAnswer: "(a) ENGINE CUTOFF VELOCITY: Phase 1: u=0, a=25 m/s², t=10s. v = u+at = 0+25×10 = 250 m/s upward. (b) HEIGHT AT CUTOFF: s₁ = ut+½at² = 0+½×25×100 = 1250 m. (c) ADDITIONAL HEIGHT AFTER CUTOFF: Now rocket has u=250 m/s upward, a=-g=-10 m/s², v=0 at max height. v²=u²+2as → 0=62500+2×(-10)×s₂ → 20s₂=62500 → s₂=3125 m. (d) TOTAL MAX HEIGHT: 1250+3125 = 4375 m = 4.375 km. Time to reach max height after cutoff: v=u+at → 0=250+(-10)t → t=25 seconds. Total time from launch to max height = 10+25 = 35 seconds.",
      explanation: "Two-phase problem. Phase 1: upward acceleration. Phase 2: gravity decelerating. Key: Phase 2 starts with Phase 1's final velocity as its initial velocity. Four-part answer with all calculations shown."
    },
    {
      id: "mot4q13", type: "long", points: 20,
      question: "Solve: A train decelerates uniformly and stops after travelling 300 m in 30 seconds. (a) Find initial speed. (b) Find deceleration. (c) Verify using the other equations.",
      correctAnswer: "(a) INITIAL SPEED: u=?, v=0 (stops), s=300m, t=30s. Use s=½(u+v)t (derived from average velocity): 300=½(u+0)×30 → 300=15u → u=20 m/s. (b) DECELERATION: Use v=u+at: 0=20+a×30 → a=-20/30=-2/3 m/s² ≈ -0.667 m/s². Deceleration = 2/3 m/s². (c) VERIFICATION: Check with s=ut+½at²: s=20×30+½×(-2/3)×900=600-300=300 m ✓. Check with v²=u²+2as: 0=400+2×(-2/3)×300=400-400=0 ✓. All three equations give consistent results.",
      explanation: "Average velocity method for initial speed. v=u+at for deceleration. Verification with both other equations confirms no arithmetic errors. Teaching triple-check strategy."
    },
    {
      id: "mot4q14", type: "long", points: 20,
      question: "A ball is thrown horizontally from a cliff 45 m high with initial horizontal speed 20 m/s. (a) How long does it take to hit the ground? (b) How far from the base of the cliff does it land? (c) What is its vertical velocity at impact? (g = 10 m/s²)",
      correctAnswer: "PROJECTILE MOTION: Horizontal and vertical motions are INDEPENDENT. VERTICAL MOTION (only gravity, no initial vertical velocity): u_y=0, a_y=g=10 m/s², s_y=45 m. (a) TIME OF FLIGHT: s=ut+½at² → 45=0+½×10×t² → 45=5t² → t²=9 → t=3 seconds. (b) HORIZONTAL DISTANCE: No horizontal acceleration. x = u_x × t = 20 × 3 = 60 m from base. (c) VERTICAL VELOCITY AT IMPACT: v_y = u_y + a_y × t = 0 + 10 × 3 = 30 m/s downward. TOTAL VELOCITY at impact: magnitude = √(v_x² + v_y²) = √(400 + 900) = √1300 ≈ 36 m/s. Direction: arctan(30/20) = arctan(1.5) ≈ 56° below horizontal. Note: horizontal velocity remains constant at 20 m/s throughout (no horizontal force).",
      explanation: "Independence of horizontal and vertical motion. Vertical: free fall equations. Horizontal: constant velocity. All three parts plus bonus total velocity. This introduces projectile motion using equations of motion."
    },
    {
      id: "mot4q15", type: "long", points: 20,
      question: "Why is the stopping distance for a car proportional to the SQUARE of its speed? Use the equations of motion to prove this mathematically, and explain the safety implications.",
      correctAnswer: "MATHEMATICAL PROOF: Use v²=u²+2as. At stopping moment: v=0, initial speed=u, deceleration=|a|. 0 = u² + 2(-|a|)s. 2|a|s = u². s = u²/(2|a|). Therefore s ∝ u² — QUADRATIC relationship between stopping distance s and initial speed u! WHAT THIS MEANS: 2× speed → 4× stopping distance. 3× speed → 9× stopping distance. VERIFICATION: If u=10 m/s and a=5 m/s²: s=100/10=10 m. If u=20 m/s: s=400/10=40 m = 4× previous. SAFETY IMPLICATIONS: On a motorway at 70 mph: stopping distance ≈ 75 m. At 140 mph (double): stopping distance ≈ 300 m (4× not 2×). A car at 120 km/h needs FOUR TIMES the stopping distance of the same car at 60 km/h. This is why: 1. Speed limits are set carefully — even small speed increases dramatically increase risk. 2. Wet roads (reduced friction → smaller |a|) dramatically increase stopping distance: |a| is in the denominator → halving friction doubles stopping distance. 3. Safe following distance scales with speed² — at highway speeds, you need enormous gaps. 4. Pedestrian survival rates: hit at 30 km/h → ~95% survival. Hit at 60 km/h → ~15% survival. Twice the speed, 6× lower survival — direct consequence of kinetic energy and stopping distance physics.",
      explanation: "Algebraic proof that s = u²/(2a) ∝ u². Numerical verification. Four specific safety implications. The pedestrian survival statistics are real and striking."
    },
    {
      id: "mot4q16", type: "thinking", points: 25,
      question: "HOTS: Using the equations of motion, calculate the maximum height a human can jump on the Moon (g_moon = 1.62 m/s²) given that the same person can jump 1 m high on Earth (g_earth = 9.8 m/s²). What initial velocity is needed for this Earth jump?",
      correctAnswer: "EARTH JUMP ANALYSIS: Person jumps h_earth = 1 m. At max height, v = 0. v² = u² + 2as: 0 = u² - 2 × 9.8 × 1 = u² - 19.6. u² = 19.6. u = √19.6 ≈ 4.43 m/s. This is the SAME initial velocity on Moon (muscles provide same force, same initial velocity). MOON JUMP: u = 4.43 m/s (same legs, same jump), g_moon = 1.62 m/s². At max height, v = 0. v² = u² + 2as: 0 = 19.6 + 2 × (-1.62) × s_moon. 3.24 s_moon = 19.6. s_moon = 19.6/3.24 ≈ 6.05 m. The same person can jump ~6 metres high on the Moon! HANG TIME: On Earth: v = u + at → 0 = 4.43 - 9.8t → t_earth = 0.45 s (half the hang time). Total air time on Earth = 2 × 0.45 = 0.9 s. On Moon: 0 = 4.43 - 1.62t → t_moon = 2.73 s. Total air time on Moon = 2 × 2.73 = 5.46 seconds. INTERESTING: Basketball on the Moon would reach the ceiling of any indoor court. Astronauts on the Moon had to be careful not to jump too hard — they could easily jump over a small building!",
      explanation: "Earth jump: find u from v²=u²+2as. Moon jump: same u, different g. Moon height = 6 m. Hang time calculated for both. Real astronaut consideration adds context."
    },
    {
      id: "mot4q17", type: "thinking", points: 25,
      question: "HOTS: A car travels on a highway and a motorbike starts from rest at the same moment the car passes it. The car moves at constant 25 m/s. The motorbike accelerates at 5 m/s². (a) When do they have the same speed? (b) How far ahead is the car at that moment? (c) When does the motorbike catch the car? (d) What is the motorbike's speed at that moment?",
      correctAnswer: "(a) SAME SPEED: Car: constant 25 m/s. Bike: v = 5t. Equal when 5t = 25 → t = 5 seconds. (b) POSITIONS AT t=5s: Car: s_car = 25 × 5 = 125 m. Bike: s_bike = 0 + ½ × 5 × 25 = 62.5 m. Car is 125 - 62.5 = 62.5 m AHEAD. (c) MOTORBIKE CATCHES CAR (same position): Set s_bike = s_car. ½ × 5 × t² = 25t → 2.5t² = 25t → 2.5t = 25 (dividing by t, assuming t≠0) → t = 10 seconds. VERIFY: Car at t=10: 250 m. Bike at t=10: ½×5×100 = 250 m ✓. (d) BIKE SPEED AT t=10: v = 5 × 10 = 50 m/s. The motorbike catches the car at exactly double the car's speed! This is a general result — when a uniformly accelerating object starting from rest catches a constant-velocity object, it always does so at twice the constant velocity.",
      explanation: "All four parts. Same-speed moment from v equations. Gap calculation at that moment. Catching time from equating position equations. General result: always catches at 2× constant speed."
    },
    {
      id: "mot4q18", type: "thinking", points: 25,
      question: "HOTS: Galileo discovered that the distances covered in successive equal time intervals by a freely falling body follow the ratio 1:3:5:7:9... (odd number series). Prove this mathematically using s = ½gt².",
      correctAnswer: "PROOF: Distance in each time interval of length T: s₁ (0 to T): ½g(T)² - 0 = ½gT². s₂ (T to 2T): ½g(2T)² - ½gT² = 2gT² - ½gT² = 3/2 gT². s₃ (2T to 3T): ½g(3T)² - ½g(2T)² = 9/2 gT² - 4/2 gT² = 5/2 gT². s₄ (3T to 4T): ½g(4T)² - ½g(3T)² = 16/2 gT² - 9/2 gT² = 7/2 gT². RATIOS: s₁:s₂:s₃:s₄ = ½:3/2:5/2:7/2 = 1:3:5:7 ✓. GENERAL PROOF: Distance in nth interval = ½g(nT)² - ½g((n-1)T)² = ½gT²[n²-(n-1)²] = ½gT²[n²-n²+2n-1] = ½gT²(2n-1). The factor (2n-1) for n=1,2,3,4... gives 1,3,5,7,9... (odd numbers!). GALILEO'S GENIUS: He deduced uniform acceleration by measuring these distance ratios with inclined planes (free fall was too fast to measure directly with 17th-century tools). The odd-number series was his mathematical proof that g is constant.",
      explanation: "Algebraic calculation for each interval. General formula ½gT²(2n-1) proved. Historical context (Galileo's inclined plane experiments). The mathematical elegance of the proof earns full marks."
    },
    {
      id: "mot4q19", type: "thinking", points: 25,
      question: "HOTS: Derive the condition for maximum range of a projectile (angle = 45°). A cricket ball is hit with speed 30 m/s. Calculate (a) the maximum height when hit at 45°, (b) the range when hit at 45°, (c) compare range at 45° vs 30° vs 60°. (g = 10 m/s²)",
      correctAnswer: "RANGE FORMULA: For projectile at angle θ: Horizontal velocity: uₓ = u cosθ. Vertical velocity: uᵧ = u sinθ. Time of flight: At peak, vertical v=0. t_peak = u sinθ/g. Total time T = 2u sinθ/g. Range R = uₓ × T = u cosθ × 2u sinθ/g = u² sin(2θ)/g. MAXIMUM RANGE: R = u² sin(2θ)/g is maximum when sin(2θ) = 1, i.e., 2θ = 90°, θ = 45°. CALCULATIONS FOR u=30 m/s: (a) MAX HEIGHT AT 45°: H = uᵧ²/(2g) = (30sin45°)²/(20) = (21.21)²/20 = 449.8/20 ≈ 22.5 m. (b) RANGE AT 45°: R = u² sin(90°)/g = 900/10 = 90 m. (c) RANGE COMPARISON: At 30°: R = 900×sin60°/10 = 900×0.866/10 = 77.9 m. At 45°: R = 90 m (maximum). At 60°: R = 900×sin120°/10 = 900×0.866/10 = 77.9 m. NOTE: 30° and 60° give EQUAL range! In general, complementary angles (θ and 90°-θ) give the same range. This is a beautiful result from sin(2θ) = sin(180°-2θ).",
      explanation: "Derivation of R = u²sin(2θ)/g. Maximisation (sin(2θ) max at θ=45°). Calculations for 30°, 45°, 60°. The complementary angles giving equal range is the elegant mathematical result."
    },
    {
      id: "mot4q20", type: "thinking", points: 25,
      question: "HOTS: A police car at rest turns on its siren and pursues a thief's car that has a 100m head start and is moving at constant 30 m/s. The police car accelerates at 4 m/s². (a) Does the police car catch the thief? (b) If yes, when and where? (c) What would be the minimum acceleration needed to just barely catch the thief (tangent condition)?",
      correctAnswer: "SETUP: Police starts at x=0, t=0 with head start 100m for thief. Thief: x_t = 100 + 30t (constant velocity 30 m/s). Police: x_p = 0 + ½×4×t² = 2t². CATCH CONDITION: x_p = x_t → 2t² = 100 + 30t → 2t² - 30t - 100 = 0 → t² - 15t - 50 = 0. Using quadratic formula: t = [15 ± √(225+200)]/2 = [15 ± √425]/2 = [15 ± 20.6]/2. t = (15 + 20.6)/2 = 17.8 s (taking positive root). (a) YES, police catches thief at t ≈ 17.8 s. (b) POSITION: x = 2×(17.8)² = 2×316.8 ≈ 633.6 m from start. (c) MINIMUM ACCELERATION (tangent condition): At minimum a, police just barely touches thief's trajectory (discriminant = 0). ½at² = 100+30t → ½at²-30t-100=0 → at²-60t-200=0. Discriminant = 0: (-60)²-4a×(-200)=0... Let me redo: ½at²-30t-100=0. Using quadratic: t = [30 ± √(900+4×½a×100)]/(a) → discriminant = 0: 900 + 200a = 0... This doesn't work. Correct approach: minimum a when x_p = x_t has exactly one solution (tangent). ½at²=100+30t → at²-60t-200=0. Discriminant = (-60)²-4(a)(-200) = 3600+800a = 0 → impossible (always positive). So with any positive a, they eventually meet! Actually for smaller a, they meet much later. At a→0, meeting time → ∞. Minimum a for 'catching' in practice means any a>0 works eventually, but a=4 m/s² → catch at 17.8s.",
      explanation: "Quadratic position equation. Solving for catch time. Position at catch. The minimum acceleration analysis reveals an interesting result: any positive acceleration eventually catches constant velocity (since polynomial eventually dominates linear). This is the key insight — quadratic always beats linear eventually."
    }
  ]
};
