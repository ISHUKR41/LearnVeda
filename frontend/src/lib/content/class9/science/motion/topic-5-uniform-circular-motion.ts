/**
 * FILE: topic-5-uniform-circular-motion.ts
 * LOCATION: src/lib/content/class9/science/motion/topic-5-uniform-circular-motion.ts
 * PURPOSE: Deep content for Topic 5 — Uniform Circular Motion and Graphical Analysis.
 *          Circular motion, centripetal acceleration, velocity-time graphs analysis.
 *          CBSE Class 9 Science Chapter 8.
 * LAST UPDATED: 2026-05-28
 */
import { Topic } from "./types";

export const uniformCircularMotion: Topic = {
  id: "uniform-circular-motion",
  title: "5. Uniform Circular Motion and Graphical Analysis",
  estimatedMinutes: 30,
  imageUrl:
    "https://images.unsplash.com/photo-1479659929431-4342107adfc1?auto=format&fit=crop&q=80&w=1200",
  content: `
### Circles and the Deception of "Constant Speed"

A car drives around a perfectly circular roundabout at exactly 20 km/h — constant speed, no variation. Is the car accelerating?

Most people answer "No." But in physics, the answer is a resounding **YES**.

This is the heart of uniform circular motion — one of the most counterintuitive ideas in all of physics, and the bridge between kinematics and Newton's Laws.

---

### Uniform Circular Motion — Definition

> **Uniform Circular Motion** is the motion of an object along a circular path at **constant speed**.

"Uniform" refers to constant speed (magnitude of velocity). The direction continuously changes.

**Why is velocity (not speed) changing?**
Velocity is a vector. For velocity to be constant, BOTH magnitude AND direction must be constant.

In circular motion:
* **Speed** (magnitude of velocity) = constant ✓
* **Direction** = continuously changing ✗

Therefore: **velocity is NOT constant** → acceleration EXISTS.

---

### The Direction of Velocity in Circular Motion

At any point on a circular path, the velocity vector is **tangent** to the circle.

Tangent means: pointing along the circle's edge at that exact point — always perpendicular to the radius at that point.

**Think of it this way:** If a ball on a string is swung in a circle and the string is cut, the ball flies off in a straight line tangent to the circle — not along the radius and not continuing to curve. This tangent direction was the ball's velocity at the moment of release.

---

### Centripetal Acceleration — Always Toward the Centre

Since velocity direction changes continuously, acceleration must exist. The direction of this acceleration is always **toward the centre** of the circular path.

> **Centripetal acceleration** = acceleration toward the centre of a circular path

$$a_c = \frac{v^2}{r}$$

Where:
* $v$ = speed (constant)
* $r$ = radius of the circular path

The word "centripetal" comes from Latin: *centrum* (centre) + *petere* (to seek) = "centre-seeking."

**Why toward the centre?**
Compare velocity vectors at two nearby points on the circle. Both have the same magnitude but slightly different directions. The change in velocity (Δv = v₂ − v₁) points toward the centre of the circle. As Δt → 0, this gives centripetal acceleration directed toward the centre.

---

### Centripetal Force

From Newton's Second Law: F = ma.

Since centripetal acceleration exists (directed toward centre), a centripetal force must also be directed toward the centre:

$$F_c = m \times a_c = \frac{mv^2}{r}$$

**CRITICAL INSIGHT:** Centripetal force is NOT a new type of force. It is simply the name for whatever force provides the centripetal acceleration in a specific situation.

| Situation | What provides centripetal force |
|---|---|
| Ball on a string | Tension in string |
| Earth orbiting Sun | Gravitational attraction |
| Car turning on road | Friction between tyres and road |
| Satellite orbiting Earth | Gravity |
| Electron orbiting nucleus | Electromagnetic attraction |
| Roller coaster loop | Normal force (at bottom) |

---

### Period and Frequency

For uniform circular motion:

**Period (T):** Time for one complete revolution (seconds)

**Frequency (f):** Number of revolutions per second (Hertz, Hz)

$$T = \frac{1}{f}$$

**Speed in circular motion:**
$$v = \frac{\text{circumference}}{\text{period}} = \frac{2\pi r}{T}$$

Therefore:
$$a_c = \frac{v^2}{r} = \frac{(2\pi r/T)^2}{r} = \frac{4\pi^2 r}{T^2}$$

**Example:** Earth's orbit — period T = 1 year = 3.15×10⁷ s, r = 1.5×10¹¹ m.
$$v = \frac{2\pi \times 1.5 \times 10^{11}}{3.15 \times 10^7} \approx 29,900 \text{ m/s} \approx 30 \text{ km/s}$$

Earth races around the Sun at 30 km/s — 100,000 km/h!

---

### What Happens When Centripetal Force Disappears?

If the force providing centripetal acceleration suddenly disappears, the object flies off in a STRAIGHT LINE tangent to the circle — the direction of its velocity at that instant.

**Examples:**
* String breaks → ball flies tangentially (not outward radially!)
* Tyre loses friction while turning → car goes straight (skids forward, not sideward)
* Satellite engine OFF (orbit maintained by gravity, which doesn't disappear) → stays in orbit

This is Newton's First Law in action: without a net force, objects continue in a straight line.

---

### Distance-Time and Velocity-Time Graphs — Complete Analysis

#### d-t Graph for Uniform Circular Motion
For a complete revolution: distance = circumference = 2πr (measured along path).
* Plot: straight diagonal line (constant speed → equal distance in equal time)
* Wait — but DISPLACEMENT returns to zero after each revolution!
* d-t graph measures DISTANCE (scalar, always increasing)
* DISPLACEMENT-time graph: oscillates (increases then decreases) — sinusoidal!

#### v-t Graph for Uniform Circular Motion
The SPEED (magnitude of velocity) is constant → horizontal line on speed-time graph.
But the VELOCITY vector (including direction) changes sinusoidally.

---

### Summary: Key Graphs and What They Tell You

| Graph type | Horizontal line | Diagonal line | Curved line |
|---|---|---|---|
| d-t | At rest (d constant) | Uniform motion | Non-uniform motion |
| v-t | Uniform velocity (a=0) | Uniform acceleration | Non-uniform acceleration |

**Interpreting any motion graph:**
1. Is it at rest? → d-t is horizontal
2. Uniform motion? → d-t is straight diagonal; v-t is horizontal
3. Uniform acceleration? → v-t is straight diagonal; d-t is curved (parabola)
4. Non-uniform acceleration? → v-t is curved
5. Decelerating? → v-t line goes downward (negative slope)
  `,
  questions: [
    {
      id: "mot5q1", type: "mcq", points: 10,
      question: "An object moves in a circle at constant speed. Which of these is TRUE?",
      options: [
        "Both speed and velocity are constant",
        "Speed is constant but velocity is changing",
        "Velocity is constant but speed is changing",
        "Both speed and velocity are changing"
      ],
      correctAnswer: "Speed is constant but velocity is changing",
      explanation: "Uniform circular motion: speed (magnitude of velocity) is constant. But velocity is a vector — its direction changes continuously as the object goes around the circle. Changing direction = changing velocity = acceleration exists."
    },
    {
      id: "mot5q2", type: "mcq", points: 10,
      question: "A satellite orbits Earth in uniform circular motion. The centripetal force acting on it is provided by:",
      options: ["The rocket engines", "Earth's gravity", "The satellite's velocity", "Atmospheric drag"],
      correctAnswer: "Earth's gravity",
      explanation: "Gravity from Earth acts on the satellite, pulling it toward Earth's center. This provides the centripetal force that keeps the satellite in circular orbit. Centripetal force is not a new force type — it's always provided by an existing force (here, gravity)."
    },
    {
      id: "mot5q3", type: "mcq", points: 10,
      question: "If the speed of an object in circular motion doubles, what happens to the centripetal acceleration?",
      options: ["Doubles", "Stays the same", "Quadruples", "Halves"],
      correctAnswer: "Quadruples",
      explanation: "a_c = v²/r. If v doubles: a_c = (2v)²/r = 4v²/r = 4 × original acceleration. Centripetal acceleration is proportional to v², so doubling speed quadruples the required centripetal acceleration (and force)."
    },
    {
      id: "mot5q4", type: "mcq", points: 10,
      question: "When a car turns on a level road, what provides the centripetal force?",
      options: [
        "The engine thrust",
        "Friction between the tyres and road, directed toward the centre of the turn",
        "The car's weight",
        "Air resistance"
      ],
      correctAnswer: "Friction between the tyres and road, directed toward the centre of the turn",
      explanation: "Turning requires centripetal force directed toward the centre of the turn. On a level road, the only horizontal force available is friction between tyres and road. This friction acts sideways (toward the turn centre) and provides the centripetal force. On a wet road (low friction), this force is insufficient → car skids."
    },
    {
      id: "mot5q5", type: "mcq", points: 10,
      question: "A stone on a string is swung in a circle. The string suddenly breaks. The stone will:",
      options: [
        "Continue in a circular path",
        "Move outward radially (directly away from centre)",
        "Fly off tangentially — in the direction of velocity at that instant",
        "Stop immediately"
      ],
      correctAnswer: "Fly off tangentially — in the direction of velocity at that instant",
      explanation: "When the string breaks, the centripetal force (string tension) disappears. By Newton's First Law, the stone continues in a straight line in the direction it was moving — tangent to the circle at that point. Not radially outward (that would require a new outward force)."
    },
    {
      id: "mot5q6", type: "short", points: 15,
      question: "Define uniform circular motion. Why is it considered accelerated motion despite constant speed?",
      correctAnswer: "Uniform circular motion: motion along a circular path at constant speed. It is accelerated motion because acceleration is the RATE OF CHANGE OF VELOCITY (not speed). Velocity is a vector — magnitude and direction. In circular motion, speed is constant but direction changes continuously. Changing direction = changing velocity = acceleration exists. This centripetal acceleration always points toward the center of the circle. Therefore, uniform circular motion is always accelerated even though speed is constant.",
      explanation: "Definition + velocity-as-vector argument + centripetal acceleration direction. The speed vs velocity distinction is the core of the answer."
    },
    {
      id: "mot5q7", type: "short", points: 15,
      question: "Calculate the centripetal acceleration of a car moving at 20 m/s around a curve of radius 50 m.",
      correctAnswer: "a_c = v²/r = 20²/50 = 400/50 = 8 m/s². The centripetal acceleration is 8 m/s², directed toward the centre of the curve. For a 1000 kg car: centripetal force = ma = 1000 × 8 = 8000 N. This must be provided by friction — 8000 N of friction is needed to navigate this corner at 20 m/s.",
      explanation: "Formula a_c = v²/r, substitution, result with direction. Bonus: centripetal force calculation for the car."
    },
    {
      id: "mot5q8", type: "short", points: 15,
      question: "What is the period and frequency of a ball completing 5 revolutions in 10 seconds? What is its speed if the radius is 2 m?",
      correctAnswer: "Period T = time for 1 revolution = 10/5 = 2 seconds. Frequency f = 1/T = 0.5 Hz (0.5 revolutions per second). Speed: circumference = 2πr = 2π×2 = 4π ≈ 12.57 m. Speed = circumference/period = 4π/2 = 2π ≈ 6.28 m/s.",
      explanation: "Period = total time / revolutions. f = 1/T. Speed = 2πr/T. All three calculated with units."
    },
    {
      id: "mot5q9", type: "short", points: 15,
      question: "Describe the distance-time graph for an object moving in a circle at constant speed. How does it differ from the displacement-time graph?",
      correctAnswer: "DISTANCE-TIME GRAPH: Straight diagonal line with constant positive slope. Distance increases uniformly as the object travels equal arc lengths in equal times. Slope = speed = constant. After each revolution (distance = 2πr), the line continues without interruption. DISPLACEMENT-TIME GRAPH: Oscillates in a wave (sinusoidal) pattern. Displacement changes direction as object goes around — maximum displacement (radius) after quarter lap, zero displacement at half lap (directly opposite start), maximum again at 3/4 lap, zero again at full lap. The pattern repeats with period T = one revolution. KEY DIFFERENCE: Distance only increases. Displacement oscillates — the same reason distance and displacement differ in circular motion.",
      explanation: "Both graphs described with shape and reasoning. The distance increases monotonically while displacement oscillates — this distinction is often tested."
    },
    {
      id: "mot5q10", type: "short", points: 15,
      question: "Why is it more dangerous to take a sharp turn at high speed than a gentle curve at the same speed? Use centripetal force.",
      correctAnswer: "Centripetal force F_c = mv²/r. Speed v is the same in both cases. But radius r is SMALLER for a sharp turn. F_c = mv²/r → smaller r → LARGER centripetal force needed. This force must come from friction between tyres and road. Friction has a maximum limit (depends on tyre-road coefficient). If required centripetal force > maximum friction → tyres skid. Sharp turn (smaller r) needs more centripetal force → more likely to exceed friction limit → skid/accident. This is why sharp turns have lower speed limits (hairpin bends on mountain roads: 15-20 km/h vs motorway curves: 100+ km/h).",
      explanation: "F_c = mv²/r shows inverse relationship with r. Same speed + smaller radius = larger force needed. Friction limit exceeded → skid. Speed limit justification."
    },
    {
      id: "mot5q11", type: "long", points: 20,
      question: "Describe a velocity-time graph for a complete journey: (a) acceleration from rest to 15 m/s in 5s, (b) constant velocity 15 m/s for 10s, (c) deceleration to 5 m/s in 4s, (d) constant velocity 5 m/s for 8s, (e) deceleration to rest in 2s. Calculate total distance and total displacement (assuming straight-line motion throughout).",
      correctAnswer: "V-T GRAPH: (a) 0-5s: straight line from v=0 to v=15 m/s. Slope = 3 m/s². (b) 5-15s: horizontal line at v=15 m/s. Slope = 0. (c) 15-19s: straight line from 15 to 5 m/s. Slope = (5-15)/4 = -2.5 m/s². (d) 19-27s: horizontal at v=5 m/s. Slope = 0. (e) 27-29s: straight line from 5 to 0 m/s. Slope = -2.5 m/s². DISTANCES (area under graph): (a) Triangle: ½×5×15 = 37.5 m. (b) Rectangle: 10×15 = 150 m. (c) Trapezoid: ½(15+5)×4 = 40 m. (d) Rectangle: 8×5 = 40 m. (e) Triangle: ½×2×5 = 5 m. TOTAL DISTANCE = 37.5+150+40+40+5 = 272.5 m. TOTAL DISPLACEMENT = 272.5 m (same as distance, because always moving forward — positive velocity throughout). If the motion were not all in one direction, displacement could differ.",
      explanation: "All five phases described on v-t graph. Accelerations as slopes for each phase. Areas calculated as geometric shapes for distances. Total correctly summed."
    },
    {
      id: "mot5q12", type: "long", points: 20,
      question: "Why does the Moon not fall into Earth despite being attracted by Earth's gravity? Explain using circular motion and the concept of orbital velocity.",
      correctAnswer: "The Moon IS falling toward Earth — constantly. But it's also moving sideways fast enough that Earth's surface 'curves away' at the same rate. CIRCULAR ORBIT BALANCE: Centripetal force needed = gravitational force provided. mv²/r = GMm/r². Cancel m: v² = GM/r. v_orbital = √(GM/r). The Moon must have EXACTLY this speed to maintain orbit. MOON'S ACTUAL SPEED: r = 3.84×10⁸ m, GM_Earth = 3.99×10¹⁴ m³/s². v = √(3.99×10¹⁴ / 3.84×10⁸) ≈ 1022 m/s ≈ 1 km/s. At 1 km/s sideways speed, the Moon 'falls' exactly as much as Earth's gravity pulls it downward per unit time — resulting in circular orbit. ANALOGY: Newton's cannon — fire a cannonball faster and faster from a mountain. Eventually it falls around the curve of the Earth and never hits it — it's in orbit. Free fall + sideways motion = orbit. WHY NOT FALL IN: If Moon slows → not enough sideways speed → orbit decays (falls closer). If Moon speeds up → too much energy → orbit rises (spirals out). Current Moon: speed exactly right for current r — stable orbit. Future: Moon is actually slowly spiraling OUTWARD (gaining energy from tidal interactions) — moving about 3.8 cm farther from Earth each year.",
      explanation: "Free-fall + sideways motion = orbit argument. Mathematical balance: mv²/r = GMm/r². Orbital velocity formula. Moon's actual numbers. Newton's cannon analogy. Moon spiraling outward is advanced but real."
    },
    {
      id: "mot5q13", type: "long", points: 20,
      question: "A disc jockey spins a music record. The record has radius 15 cm and rotates at 33.3 rpm. (a) Find angular velocity in rad/s. (b) Find the linear speed of a point on the rim. (c) Find centripetal acceleration of a point on the rim. (d) Compare with a point halfway between centre and rim.",
      correctAnswer: "(a) ANGULAR VELOCITY: 33.3 rpm = 33.3 revolutions/minute = 33.3/60 rev/s = 0.555 rev/s. Each revolution = 2π radians. ω = 0.555 × 2π = 3.49 rad/s. Period T = 1/0.555 = 1.8 seconds. (b) LINEAR SPEED (rim, r=0.15m): v = ωr = 3.49 × 0.15 = 0.524 m/s. Or: v = 2πr/T = 2π×0.15/1.8 = 0.524 m/s ✓. (c) CENTRIPETAL ACCELERATION (rim): a_c = v²/r = (0.524)²/0.15 = 0.275/0.15 = 1.83 m/s². Or: a_c = ω²r = (3.49)² × 0.15 = 12.18 × 0.15 = 1.83 m/s² ✓. (d) HALFWAY POINT (r₂ = 0.075m): Angular velocity ω is SAME for all points on rigid disc (3.49 rad/s). Linear speed v₂ = ωr₂ = 3.49×0.075 = 0.262 m/s (half the rim speed). Centripetal acceleration a₂ = ω²r₂ = 12.18×0.075 = 0.913 m/s² (half the rim acceleration). INSIGHT: All points on a rotating rigid body have the same angular velocity. Linear speed and centripetal acceleration are proportional to radius — points further from centre move faster and experience more centripetal acceleration.",
      explanation: "RPM → rad/s conversion. Linear speed using v=ωr. Centripetal acceleration. Halfway comparison. All points same ω but different v and a (proportional to r)."
    },
    {
      id: "mot5q14", type: "long", points: 20,
      question: "From a velocity-time graph, how can you determine: (a) whether acceleration is uniform or non-uniform, (b) the displacement in each phase, (c) average acceleration and instantaneous acceleration at a point?",
      correctAnswer: "(a) UNIFORM VS NON-UNIFORM ACCELERATION: Uniform acceleration → STRAIGHT LINE on v-t graph (constant slope). Non-uniform acceleration → CURVED LINE (changing slope). To check: does every equal time interval show the same change in velocity? If yes: uniform. If no: non-uniform. (b) DISPLACEMENT FROM EACH PHASE: Area under the v-t curve for that phase. Geometric shapes: rectangle (constant velocity) = v×t, triangle (from/to zero) = ½×v_max×t, trapezoid (between two non-zero velocities) = ½(v₁+v₂)×t, curved region = integration or counting grid squares. Positive area above x-axis = positive displacement. Negative area below = negative displacement. Net displacement = algebraic sum. (c) AVERAGE ACCELERATION: For any phase: a_avg = Δv/Δt = (v_final - v_initial)/(time interval). This equals the SLOPE OF THE CHORD connecting start and end points on v-t graph. INSTANTANEOUS ACCELERATION: At a specific time t: draw a tangent to the v-t curve at that point. a_instantaneous = slope of tangent = (Δv_tangent/Δt_tangent). For a straight-line graph, tangent slope = chord slope = constant, confirming uniform acceleration.",
      explanation: "Three separate analytical techniques from v-t graphs. Shape identification for uniform/non-uniform. Area method for displacement with geometric formulas. Average (chord slope) vs instantaneous (tangent slope) acceleration."
    },
    {
      id: "mot5q15", type: "long", points: 20,
      question: "Compare the motion of a simple pendulum, a planet in orbit, and a car in a roundabout. In what ways are all three examples of uniform circular motion? In what ways do they differ?",
      correctAnswer: "SIMILARITIES — ALL UNIFORM CIRCULAR MOTION: All three involve an object moving along a curved path with centripetal acceleration directed toward a central point. All three require a centripetal force. All three have velocity tangent to the path. SIMPLE PENDULUM: Path: arc (approximately circular for small angles). Centripetal force: component of tension directed toward pivot. But: speed is NOT constant — fastest at bottom, slowest at ends. NOT truly uniform circular motion — it's oscillatory (simple harmonic) motion. APPROXIMATE circular motion only for very small angles and short arc. PLANET IN ORBIT: Path: ellipse (approximately circular for nearly circular orbits like Earth). Centripetal force: gravity from Sun. Speed: varies (Kepler's Second Law — faster when closer to Sun). NOT purely uniform — but approximately uniform for nearly circular orbits. Earth's speed varies only ±3% throughout the year. ROUNDABOUT: Path: circular (by road design). Centripetal force: tyre friction. Speed: can be held constant by driver (most uniform of the three). Truly uniform circular motion if driver maintains constant speed. DIFFERENCES: Scale (nm to AU), force provider (tension, gravity, friction), speed constancy (pendulum most variable, roundabout most uniform), plane of motion (pendulum vertical, orbit in orbital plane, roundabout horizontal).",
      explanation: "All three share centripetal acceleration. But each differs: pendulum has variable speed (SHM), planet has variable speed (Kepler), roundabout can have constant speed. The distinctions show depth of understanding."
    },
    {
      id: "mot5q16", type: "thinking", points: 25,
      question: "HOTS: A car of mass 1200 kg takes a turn on a banked road with angle 15° and radius 80 m. (a) Find the ideal speed for no friction. (b) At this speed, what centripetal acceleration acts? (c) What happens if speed is doubled? Will friction be enough to prevent skidding if μ = 0.4?",
      correctAnswer: "(a) IDEAL SPEED: From banked road analysis (no friction): tan θ = v²/(rg). tan(15°) = 0.268. v² = 0.268 × 80 × 9.8 = 210 m²/s². v = √210 ≈ 14.5 m/s ≈ 52 km/h. (b) CENTRIPETAL ACCELERATION: a_c = v²/r = 210/80 = 2.625 m/s². Check: g tan θ = 9.8 × 0.268 = 2.626 m/s² ✓. (c) DOUBLED SPEED: v' = 2 × 14.5 = 29 m/s. Required centripetal force: F_c = mv'²/r = 1200 × 841/80 = 12,615 N. Forces available: Component of normal force (N cos θ provides vertical balance, N sin θ provides centripetal): N = mg/cosθ = 1200×9.8/cos15° = 11760/0.966 = 12,174 N. N sin θ = 12,174 × sin15° = 3,150 N (bank provides this). Friction available: μN = 0.4 × 12,174 = 4,870 N (maximum friction). Total centripetal force available: N sin θ + μN cos θ = 3,150 + 4,870×cos15° = 3,150 + 4,704 = 7,854 N. Required centripetal force at double speed: 12,615 N. 7,854 N < 12,615 N → INSUFFICIENT. The car WILL skid outward. Maximum safe speed: solve (Nsinθ + μNcosθ) = mv²/r → v_max ≈ 22.8 m/s ≈ 82 km/h.",
      explanation: "Ideal speed from tanθ = v²/rg. At double speed, required force vs available force (bank component + friction). Conclusion: skids. Maximum safe speed from force balance."
    },
    {
      id: "mot5q17", type: "thinking", points: 25,
      question: "HOTS: The International Space Station must periodically boost its orbit because Earth's atmosphere exerts drag even at 400 km altitude. Explain why drag causes the ISS to SPEED UP before it eventually falls to a lower orbit. This seems paradoxical — explain the physics.",
      correctAnswer: "PARADOX SETUP: Drag removes kinetic energy from ISS → ISS slows down. Slower speed means less centripetal force available → ISS 'falls' to lower orbit. Lower orbit → ISS speeds up (orbital mechanics: lower orbit = faster speed). NET RESULT: Drag → speed decreases momentarily → orbit decays to lower altitude → speed INCREASES at new lower orbit. Paradox explained! ORBITAL MECHANICS DETAIL: Orbital speed v = √(GM/r). Smaller r → larger v. As r decreases (orbit decays): v actually increases! The ISS at 400 km: v ≈ 7.7 km/s. At 300 km: v ≈ 7.8 km/s. The satellite loses TOTAL MECHANICAL ENERGY (kinetic + potential), but loses more potential energy than kinetic energy gained — net energy loss to atmosphere. ANALOGY: Like a ball rolling down a slide — it gains speed as it loses height, but total energy (kinetic + potential) decreases due to friction. The ball actually speeds up even though friction removes energy. Similarly, ISS speeds up as it descends, even though drag removes total energy. REAL CONCERN: Without periodic boost burns (~4 km/s per year total), the ISS would gradually spiral inward and reenter atmosphere. The increasing speed paradox means the final reentry is very fast.",
      explanation: "The orbital speed paradox: drag → lower orbit → faster speed. v = √(GM/r) shows inverse relationship. Total energy (KE+PE) decreases, but the PE decrease more than compensates → KE increases. The sliding ball analogy explains the paradox intuitively."
    },
    {
      id: "mot5q18", type: "thinking", points: 25,
      question: "HOTS: In a washing machine spin cycle (600-1600 rpm), clothes are pressed against the drum. Water is removed through holes in the drum. Explain the physics: why do clothes go outward, and why is calling it 'centrifugal force' technically incorrect?",
      correctAnswer: "WHAT HAPPENS: Drum rotates at 600-1600 rpm. Clothes inside are pushed against drum wall. Water is squeezed outward through holes in drum wall. INERTIA EXPLANATION (correct physics): As drum rotates, drum wall exerts centripetal force on clothes → clothes move in circular path. BUT the water in wet clothes has less contact with the clothing fibres — it doesn't receive as much centripetal force. Water's tendency is to continue in a straight line (inertia). The drum wall holes provide an opening → water exits through holes in the direction of its inertia (outward), not due to a 'centrifugal force.' THE CENTRIFUGAL FORCE MISCONCEPTION: 'Centrifugal force' = the apparent force felt toward the outside in a rotating reference frame. From OUTSIDE the drum (inertial frame): there is NO outward force. The water simply goes straight when released (Newton's 1st Law). From INSIDE the rotating frame (non-inertial): you can add a 'centrifugal force' term mathematically, but it's a fictitious force — it doesn't exist in reality. PRACTICAL: At 1600 rpm with drum radius 0.25 m: a_c = ω²r = (167.5)² × 0.25 ≈ 7,000 m/s² ≈ 700g. Water molecules experience 700 times their weight as centripetal acceleration. This enormous 'effective gravity' extracts water rapidly. Higher rpm = more water removal but more wear on fabrics.",
      explanation: "Correct physics: inertia carries water outward (not fictitious centrifugal force). Centrifugal force explained as fictitious in rotating frame. Quantitative centripetal acceleration at 1600 rpm. The inertial vs rotating frame distinction is the key conceptual point."
    },
    {
      id: "mot5q19", type: "thinking", points: 25,
      question: "HOTS: A motorcyclist on a 'Wall of Death' (vertical circular cylinder) maintains contact with the wall at horizontal height. Analyse the forces on the rider at different heights. What minimum speed is needed to prevent sliding down?",
      correctAnswer: "WALL OF DEATH SETUP: Vertical cylinder wall, radius r. Rider moves horizontally in a circle at some height. FORCES ON RIDER: 1. Weight mg downward. 2. Normal force N from wall, pointing horizontally toward centre (centripetal direction). 3. Friction force f from wall, pointing upward (preventing rider from sliding down). CONDITION FOR NOT SLIDING: The rider doesn't slide if friction ≥ weight: f ≥ mg. Maximum static friction: f_max = μN. For horizontal circular motion (no vertical acceleration): Net vertical force = 0 → f - mg = 0 → f = mg. Net horizontal force = centripetal force → N = mv²/r. MINIMUM SPEED CONDITION: For rider to not fall: μN ≥ mg → μ(mv²/r) ≥ mg. Cancel m: μv²/r ≥ g → v² ≥ gr/μ. Minimum speed: v_min = √(gr/μ). EXAMPLE: r = 5 m, μ = 0.8 (rubber on steel), g = 10 m/s². v_min = √(10×5/0.8) = √62.5 ≈ 7.9 m/s ≈ 28.4 km/h. Below this speed: friction cannot support rider's weight → slides down. INTERESTING: Higher μ (better grip) allows lower minimum speed. This is why walls of death use textured surfaces and riders use rubberised suits.",
      explanation: "Force analysis: weight, normal force (centripetal), friction (vertical support). Condition f = mg (no vertical acceleration). N = mv²/r. μN ≥ mg gives minimum speed. Numerical example."
    },
    {
      id: "mot5q20", type: "thinking", points: 25,
      question: "HOTS: Why do astronauts on the ISS experience weightlessness, yet astronauts in a hypothetical rotating space station would feel artificial gravity? Design a rotating space station that produces 1g at its rim, specifying the required radius and rotation period.",
      correctAnswer: "ISS WEIGHTLESSNESS: ISS is in free fall — both ISS and astronauts fall toward Earth at the same rate (g_eff ≈ 8.7 m/s² at 400 km). No relative acceleration between astronaut and floor → no normal force → apparent weightlessness. Not 'no gravity' — gravity acts at 8.7 m/s². ROTATING STATION ARTIFICIAL GRAVITY: A spinning station provides centripetal acceleration. Astronauts pressed against outer wall (their 'floor'). Normal force from wall provides centripetal force. This normal force = apparent weight. For 1g artificial gravity: centripetal acceleration a_c = g = 9.8 m/s² at the rim. a_c = ω²r = 4π²r/T² = 9.8 m/s². This is one equation with two unknowns (r and T). Engineering constraints: T > ~20-30 seconds (faster rotation causes Coriolis effects that induce nausea). Choose T = 30 seconds: r = 9.8 × T²/(4π²) = 9.8 × 900/(39.48) = 8820/39.48 ≈ 223 m radius. For T = 60 seconds: r = 9.8 × 3600/39.48 ≈ 893 m radius. GRADIENT ISSUE: In a small station (r=10m): a_c = 9.8 m/s² at rim but head (r=8m) experiences 8.1 m/s² — 20% difference → uncomfortable. Larger radius → more uniform gravity → more comfortable. This is why theoretical designs (e.g., Arthur C. Clarke's 2001 space station) use large radii (~900m).",
      explanation: "ISS weightlessness vs rotating station artificial gravity. Full design calculation: a_c = ω²r = g → r = gT²/4π². Two examples with different T. The Coriolis constraint and gravity gradient problem. Real design reference (2001 space station)."
    }
  ]
};
