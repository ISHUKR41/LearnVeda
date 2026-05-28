/**
 * FILE: topic-1-distance-displacement.ts
 * LOCATION: src/lib/content/class9/science/motion/topic-1-distance-displacement.ts
 * PURPOSE: Deep, richly detailed content for Topic 1 — Rest & Motion,
 *          Distance vs Displacement. CBSE Class 9 Science Chapter 8 (Motion).
 * LAST UPDATED: 2026-05-28
 */
import { Topic } from "./types";

export const distanceDisplacement: Topic = {
  id: "distance-displacement",
  title: "1. Rest, Motion — Distance vs Displacement",
  estimatedMinutes: 28,
  imageUrl:
    "https://images.unsplash.com/photo-1590349279-63e1b877a1de?auto=format&fit=crop&q=80&w=1200",

  content: `
### The World Is Always Moving

Look outside your window. A leaf falls from a tree. A bus drives past. Clouds drift across the sky. A bee hovers near a flower. Even inside, a ceiling fan rotates. Your heart beats.

**Motion is everywhere.** Yet most people have never thought carefully about what "motion" actually means scientifically. That's what this chapter is about — building a precise, mathematical language for describing how things move.

---

### What is Motion?

> **Motion** is the change in position of an object with respect to its surroundings over time.

The critical phrase is "**with respect to**." Motion is not absolute — it depends on what you are comparing it to (your **reference point** or **frame of reference**).

**The Reference Point:**
A reference point is a fixed location from which you measure all other positions. You MUST specify a reference point to describe motion.

**Mind-bending example:**
* You are sitting in a moving bus.
* **With respect to the road:** You ARE in motion (your position relative to the road is changing).
* **With respect to the bus seat:** You are at REST (your position relative to the seat is NOT changing).
* Both statements are correct simultaneously! Motion is relative.

This is the foundation of Einstein's Theory of Relativity — there is no absolute "are you moving?" — only "are you moving relative to THIS reference point?"

---

### Distance — The Total Path Travelled

> **Distance** is the total length of the path travelled by an object, regardless of direction.

**Key properties of Distance:**
* **Scalar quantity** — only has magnitude (size), no direction
* **Always positive** — you can never travel a "negative distance"
* **Depends on the path** — take a longer route, distance increases even if start/end points are the same
* **SI unit:** metre (m) or kilometre (km)

**Example:**
You walk 4 km North, then 3 km East, then 4 km South.
Total distance = 4 + 3 + 4 = **11 km**

---

### Displacement — The Shortest Path from Start to End

> **Displacement** is the shortest straight-line distance between the initial position and the final position, in a specified direction.

**Key properties of Displacement:**
* **Vector quantity** — has both magnitude AND direction
* **Can be zero, positive, or negative** — depends on direction
* **Does NOT depend on the path** — only starting and ending points matter
* **SI unit:** metre (m), with direction (e.g. "3 m North")

**Same example continued:**
You walked 4 km North, then 3 km East, then 4 km South.
You started in the south. After going North and South equally, your North-South position = 0. Your East position = 3 km East.
Displacement = **3 km East** (only 3 km, even though you walked 11 km total)

---

### Distance vs Displacement — Side-by-Side

| Feature | Distance | Displacement |
|---|---|---|
| Type | Scalar | Vector |
| Direction required? | No | Yes |
| Can be zero? | Only if you don't move | Yes, if you return to start |
| Can be negative? | Never | Yes (opposite to reference direction) |
| Always equal? | No | Only if path is straight |
| Magnitude relationship | Distance ≥ \|Displacement\| | Always ≤ Distance |

**Critical rule:** Distance is ALWAYS greater than or equal to the magnitude of displacement.
* Equal only when: the object moves in a straight line in one direction.
* Distance > \|Displacement\| when: the path is curved, has turns, or the object returns toward the start.

---

### Four Classic Cases

#### Case 1: Straight-Line Motion
You walk 5 km East in a straight line.
* Distance = 5 km
* Displacement = 5 km East
* Distance = Displacement (magnitude) ✓

#### Case 2: Round Trip
You walk 5 km East, then 5 km West back to the start.
* Distance = 10 km
* Displacement = 0 m (you're at the same spot!)
* Distance ≫ Displacement

#### Case 3: Right-Angle Turn
You walk 3 km North, then 4 km East.
* Distance = 7 km
* Displacement = ? Use Pythagoras!
$$d = \sqrt{3^2 + 4^2} = \sqrt{9 + 16} = \sqrt{25} = 5 \text{ km, North-East}$$
* Distance (7 km) > Displacement (5 km)

#### Case 4: Circular Motion (Track)
You run exactly one complete lap of a 400 m circular track.
* Distance = 400 m
* Displacement = 0 m (same starting and ending point)
* Distance ≫ Displacement

---

### The Odometer and the GPS

**Odometer** in your car measures **distance** — the total path length, ticking up every metre you travel regardless of direction. It can never go backwards.

**GPS navigation** shows **displacement** when giving you "the distance to destination as the crow flies" — the straight-line distance between your current position and the destination.

When you drive through winding mountain roads, the GPS (direct distance to destination) might say "12 km to destination" even though the odometer will show you drove 25 km to get there!

---

### Uniform vs Non-Uniform Motion

After defining motion, let us categorise the type:

**Uniform Motion:**
An object covers **equal distances in equal intervals of time** (however small).
* The object moves at a **constant speed** in the **same direction**.
* Real example: A spacecraft far from all gravitational influences.
* Graph: distance-time graph is a **straight line**.

**Non-Uniform Motion (Accelerated Motion):**
An object covers **unequal distances in equal intervals of time**.
* Speed and/or direction is changing.
* Real example: A car in city traffic — constantly speeding up and slowing down.
* Graph: distance-time graph is **curved**.

> Most real-world motion is **non-uniform**. Uniform motion is an idealisation that rarely occurs naturally on Earth due to friction.

---

### The Distance-Time Graph — Your Motion's Signature

A **distance-time graph** (d-t graph) tells you everything about an object's motion at a glance:

* **Horizontal flat line** → Object at REST (distance not changing)
* **Straight diagonal line upward** → Uniform motion (equal distance per unit time)
* **Steeper diagonal line** → Faster uniform motion (more distance per unit time)
* **Curved line (concave up)** → Accelerating (covering more distance each second)
* **Curved line (concave down)** → Decelerating (covering less distance each second)

The **slope (gradient)** of the d-t graph = **speed** at that moment.

---

### Why This Foundation Matters

Everything in kinematics (the science of motion) builds on these definitions:
* Speed is calculated from **distance** and time
* Velocity is calculated from **displacement** and time
* Without clearly distinguishing distance from displacement, you cannot correctly calculate speed vs velocity, which are completely different concepts

Confusing distance and displacement is one of the most common errors in Class 9 Physics examinations.
  `,

  questions: [
    /* ── 5 MCQs ── */
    {
      id: "mot1q1",
      type: "mcq",
      points: 10,
      question:
        "A student walks 3 km North and then 4 km East. The total distance travelled and the magnitude of displacement are:",
      options: [
        "Distance = 7 km, Displacement = 7 km",
        "Distance = 7 km, Displacement = 5 km",
        "Distance = 5 km, Displacement = 7 km",
        "Distance = 5 km, Displacement = 5 km",
      ],
      correctAnswer: "Distance = 7 km, Displacement = 5 km",
      explanation:
        "Distance = 3 + 4 = 7 km (total path). Displacement = √(3² + 4²) = √(9+16) = √25 = 5 km (straight line from start to end, by Pythagoras theorem for the right-angled triangle formed).",
    },
    {
      id: "mot1q2",
      type: "mcq",
      points: 10,
      question:
        "An athlete completes exactly one full lap of a circular track of circumference 400 m. What is their displacement?",
      options: ["400 m", "200 m", "800 m", "0 m"],
      correctAnswer: "0 m",
      explanation:
        "Displacement is the straight-line distance from start to end position. After one complete lap, the athlete is back at exactly where they started. Start position = End position → displacement = 0 m. Distance = 400 m (the path length).",
    },
    {
      id: "mot1q3",
      type: "mcq",
      points: 10,
      question: "Displacement is a __________ quantity and distance is a __________ quantity.",
      options: [
        "Scalar, Scalar",
        "Vector, Vector",
        "Vector, Scalar",
        "Scalar, Vector",
      ],
      correctAnswer: "Vector, Scalar",
      explanation:
        "Displacement has both magnitude AND direction (e.g. '5 km North') → Vector. Distance has only magnitude, no direction (e.g. '7 km') → Scalar. This distinction is fundamental to the difference between speed and velocity.",
    },
    {
      id: "mot1q4",
      type: "mcq",
      points: 10,
      question:
        "On a distance-time graph, a straight horizontal line indicates that the object is:",
      options: [
        "Moving at constant speed",
        "Accelerating",
        "At rest",
        "Decelerating",
      ],
      correctAnswer: "At rest",
      explanation:
        "A horizontal line on a d-t graph means distance is not changing as time passes — the object is stationary (at rest). Constant speed = diagonal straight line. Acceleration = curved upward line. Deceleration = curved downward line.",
    },
    {
      id: "mot1q5",
      type: "mcq",
      points: 10,
      question:
        "Which of the following is an example of NON-UNIFORM motion?",
      options: [
        "A spacecraft far from all planets moving in a straight line",
        "A car speeding up from a traffic signal",
        "A train moving at exactly 80 km/h on a straight track",
        "A marble rolling on a perfectly frictionless flat surface",
      ],
      correctAnswer: "A car speeding up from a traffic signal",
      explanation:
        "Non-uniform motion means unequal distances in equal time intervals — i.e., the speed is changing. A car speeding up from 0 km/h clearly has changing speed → non-uniform motion. All other options describe constant speed (uniform motion).",
    },

    /* ── 5 Short Answer ── */
    {
      id: "mot1q6",
      type: "short",
      points: 15,
      question: "Distinguish between distance and displacement with one example each.",
      correctAnswer:
        "Distance: Total length of path travelled by an object. Scalar (no direction). Example: Walking 5 km around a park perimeter — distance = 5 km. Displacement: Straight-line distance from initial to final position, with direction. Vector. Example: Same park walk — if you end up where you started, displacement = 0 m.",
      explanation:
        "Both definitions with scalar/vector identification + a relevant example for each. Ideally the same scenario demonstrating both to highlight the contrast.",
    },
    {
      id: "mot1q7",
      type: "short",
      points: 15,
      question: "Can displacement ever be greater than distance? Can it be equal? Explain.",
      correctAnswer:
        "Displacement can NEVER be greater than distance — distance ≥ |displacement| always. They are EQUAL only when the object moves in a perfectly straight line in one direction without turning back. In all other cases (turns, curves, return trips), distance > displacement because the direct straight path (displacement) is always shorter than or equal to any actual path taken (distance).",
      explanation:
        "The rule distance ≥ |displacement| must be stated with explanation. Equal condition = straight-line motion. Greater-than condition = any turning or return.",
    },
    {
      id: "mot1q8",
      type: "short",
      points: 15,
      question: "What is a reference point? Why is it essential when describing motion?",
      correctAnswer:
        "A reference point is a fixed location from which positions and motions are measured. It is essential because motion is relative — whether something is 'moving' depends entirely on the reference point chosen. Example: A passenger in a train is at rest relative to other passengers but in motion relative to the ground. Without specifying a reference point, statements like 'the car is moving' are incomplete and ambiguous.",
      explanation:
        "Definition + explanation of relative nature of motion + concrete example showing same object can be both moving and at rest depending on reference.",
    },
    {
      id: "mot1q9",
      type: "short",
      points: 15,
      question: "What is uniform motion? Give one real-world example and explain why truly uniform motion is rare on Earth.",
      correctAnswer:
        "Uniform motion: An object covers equal distances in equal time intervals — constant speed in a fixed direction. Example: A spacecraft in deep space moving at constant velocity (no atmosphere, no friction). Rare on Earth because friction (from road, air, water) is always present, continuously removing kinetic energy and slowing objects down. A car on a highway APPEARS to have uniform motion but the engine must continuously provide force to overcome air resistance and road friction — truly constant speed without engine force is impossible on Earth.",
      explanation:
        "Definition + example + friction as reason for rarity. Understanding that the engine maintains speed (not inertia alone) is the key insight.",
    },
    {
      id: "mot1q10",
      type: "short",
      points: 15,
      question:
        "A car odometer reads 12,340 km at the start of a journey and 12,435 km at the end. Has the odometer measured distance or displacement? Why?",
      correctAnswer:
        "The odometer measures DISTANCE — the total path length travelled. It ticked up from 12,340 to 12,435 = 95 km of total path. It does NOT measure displacement because it counts every metre of road covered regardless of direction. If the car drove in circles and returned to its starting position, the odometer would show 95 km but displacement would be 0 m. An odometer can never go backwards (distance is always positive and additive).",
      explanation:
        "Odometer = distance (path length). Must explain why it cannot measure displacement (no direction, always positive). The circular driving example illustrates the difference clearly.",
    },

    /* ── 5 Long Answer ── */
    {
      id: "mot1q11",
      type: "long",
      points: 20,
      question:
        "Describe the distance-time graph for: (a) an object at rest, (b) uniform motion, (c) non-uniform accelerating motion, (d) non-uniform decelerating motion. What does the slope of the graph represent?",
      correctAnswer:
        "(a) AT REST: Horizontal straight line. Distance stays constant as time increases. Slope = 0. (b) UNIFORM MOTION: Straight diagonal line sloping upward. Equal distance covered in equal time. Slope = constant. Steeper line = higher speed. (c) ACCELERATING (non-uniform): Curve that gets steeper as time goes on (concave upward). Distance covered per unit time INCREASES. Slope increases with time. (d) DECELERATING: Curve that gets flatter as time goes on (concave downward, levelling off). Distance covered per unit time DECREASES. Slope decreases until flat. SLOPE SIGNIFICANCE: Slope of d-t graph = Δdistance/Δtime = SPEED. For a straight line: slope = speed at every point. For a curve: instantaneous speed at any point = slope of the tangent drawn to the curve at that point.",
      explanation:
        "All four graphs described with shape, what happens to slope, and real meaning. The slope-as-speed interpretation is critical and must be stated clearly.",
    },
    {
      id: "mot1q12",
      type: "long",
      points: 20,
      question:
        "A person walks 6 km East, then 8 km North. Calculate: (a) total distance, (b) magnitude of displacement, (c) direction of displacement from the starting point. Draw a labelled diagram description.",
      correctAnswer:
        "DIAGRAM: Start at O. Draw 6 km East to point A. From A draw 8 km North to point B. OA = 6 km (East), AB = 8 km (North), OB = displacement. (a) DISTANCE = OA + AB = 6 + 8 = 14 km. (b) DISPLACEMENT MAGNITUDE: Triangle OAB is right-angled at A. By Pythagoras theorem: OB² = OA² + AB² = 36 + 64 = 100. OB = √100 = 10 km. (c) DIRECTION: tan θ = AB/OA = 8/6 = 1.333. θ = arctan(1.333) = 53.13° ≈ 53° North of East (or equivalently, bearing 37° East of North). Complete answer: Displacement = 10 km at 53° North of East from starting point. Summary: Walked 14 km total but ended up only 10 km from start, in the North-East direction.",
      explanation:
        "Full calculation: distance (addition), displacement magnitude (Pythagoras), direction (arctan ratio). Direction must be stated with units. Diagram described in words earns credit.",
    },
    {
      id: "mot1q13",
      type: "long",
      points: 20,
      question:
        "Explain uniform and non-uniform motion with examples. Why is the distance-time graph for uniform motion a straight line and for non-uniform motion a curve?",
      correctAnswer:
        "UNIFORM MOTION: Speed is constant — equal distance in equal time. Example: Train moving at 120 km/h on a straight track; light travelling through a vacuum; Earth orbiting Sun (approximately). D-T GRAPH IS STRAIGHT: In equal time intervals (say, 1 second each), the object covers exactly the same distance (say, 5 m each). So points on the graph are: (1s, 5m), (2s, 10m), (3s, 15m) — these lie on a perfectly straight line. Slope = 5/1 = constant = speed. NON-UNIFORM MOTION: Speed changes — unequal distance in equal time. Example: Ball rolling down a ramp (accelerating), car braking at signal, ball thrown upward. D-T GRAPH IS CURVED: In equal time intervals, the object covers different distances. (1s, 1m), (2s, 4m), (3s, 9m) for constant acceleration — these don't lie on a straight line. They curve upward. The slope at each point (tangent to curve) gives the INSTANTANEOUS speed at that moment — it changes as you move along the curve, proving non-uniform motion.",
      explanation:
        "Both types defined with examples. The mathematical reason why uniform → straight (equal increments) and non-uniform → curved (unequal increments) must be demonstrated with actual coordinate examples.",
    },
    {
      id: "mot1q14",
      type: "long",
      points: 20,
      question:
        "Two friends A and B leave the same school and travel to the same market 3 km away. A takes the direct road (3 km). B takes a longer scenic route (5 km). Both arrive at the market. Compare their distance and displacement. Whose distance is greater? Whose displacement is greater? What does this tell us?",
      correctAnswer:
        "START POINT: School. END POINT: Market. FRIEND A (direct road): Distance = 3 km (path length). Displacement = 3 km in the direction of market from school. Since path is straight, distance = displacement. FRIEND B (scenic route): Distance = 5 km (longer path). Displacement = STILL 3 km in the direction of market from school. Because displacement only depends on starting and ending points, NOT the path taken! COMPARISON: Distance: B > A (5 km > 3 km). Displacement: A = B = 3 km. This demonstrates: (1) Displacement is path-INDEPENDENT — only initial and final positions matter. (2) Distance is path-DEPENDENT — longer route = more distance. (3) The maximum possible displacement equals the minimum possible distance (the straight-line path). For B, distance (5 km) > displacement (3 km) because the path is not straight. REAL-WORLD LESSON: This is exactly why GPS shows 'distance to destination = X km' (displacement) but your odometer shows more — you drove curved roads, not a straight line.",
      explanation:
        "Both A and B's distance and displacement calculated and compared. The KEY insight — same displacement, different distance — must be explicitly stated with reasoning. Path-independence of displacement is the core lesson.",
    },
    {
      id: "mot1q15",
      type: "long",
      points: 20,
      question:
        "What is the difference between the motion of an object seen by different observers? Give a detailed example showing how the same motion can be described differently by different observers. What does this tell us about the nature of motion?",
      correctAnswer:
        "EXAMPLE — Train Journey: Observer 1 (on the platform): Sees passengers in the train moving forward at 90 km/h. Sees the trees outside the train moving backward past the train. Observer 2 (inside the train): Sees other passengers as stationary. Sees the platform rushing backward past the train window. Sees trees alongside the track rushing backward. Observer 3 (in an airplane above): Sees both the train AND the platform moving at 90 km/h together (Earth is rotating at ~1600 km/h at equator). MEANING: ALL three descriptions are simultaneously correct — each for a different reference frame. This demonstrates that motion is RELATIVE — it has no absolute meaning. You cannot say 'the train is really moving' vs 'the platform is really moving' — both are equally valid from their respective reference frames. This insight is the foundation of Einstein's Special Theory of Relativity (1905): there is no privileged absolute frame of reference in the universe. The laws of physics are the same for all inertial (non-accelerating) observers.",
      explanation:
        "Multiple observers described for the SAME scenario. Each description must be internally consistent. The philosophical implication (motion is relative, no absolute rest) should be stated. Einstein connection is a high-mark bonus.",
    },

    /* ── 5 HOTS ── */
    {
      id: "mot1q16",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A car travels from City A to City B via route X (200 km) and then returns via route Y (150 km). What is the total distance and total displacement? Now, if the car makes this round trip every day for a year (365 days), what is the total distance and total displacement for the year? What does the annual displacement tell you?",
      correctAnswer:
        "SINGLE TRIP: Distance = 200 + 150 = 350 km (total path in both directions). Displacement = 0 km (returned to starting point City A). ANNUAL: Annual distance = 350 km × 365 = 127,750 km. Annual displacement = 0 km (every day ends where it started — City A). INTERPRETATION: The annual displacement of 0 km is NOT saying the car didn't move — it moved 127,750 km! It means that after all those trips, the net change in position is zero — the car is back at the same point it started from day 1. Displacement measures NET change in position, not total activity. This is why displacement alone is an insufficient measure of 'how much' something moved — you need DISTANCE for that. Practical significance: A postman delivering letters in a circular route has zero displacement at the end of the day but may have walked 20 km. Their distance is 20 km, displacement is 0. Displacement alone cannot reflect their workload.",
      explanation:
        "Calculations for single trip and annual totals. The interpretation of zero annual displacement — that it doesn't mean no motion — is the critical insight. Real-world analogy (postman) strengthens the answer.",
    },
    {
      id: "mot1q17",
      type: "thinking",
      points: 25,
      question:
        "HOTS: GPS navigation can calculate both the 'straight-line distance' to your destination and the 'actual driving distance.' Explain which one is distance and which is displacement. Why are they different? In what real scenario would they be EQUAL?",
      correctAnswer:
        "STRAIGHT-LINE DISTANCE on GPS = DISPLACEMENT (magnitude). It's the shortest possible path between your current location and destination, calculated using coordinates (essentially the hypotenuse of a geographic triangle). ACTUAL DRIVING DISTANCE on GPS = DISTANCE (or closely approximates it). It sums up all the road segments you must travel, accounting for roads that curve, detour around mountains, follow the coastline, etc. WHY DIFFERENT: Roads are not straight lines — they curve around hills, follow rivers, avoid private property. The actual path driven is always longer than the direct straight-line path. WHEN EQUAL: Theoretically, if there were a perfectly straight road from your exact starting point to your exact destination with no curves, no turns, and no detours — the driving distance would equal the straight-line displacement. In practice, this only approximately occurs on long, straight highways in flat regions (like some American Midwest interstate highways or Indian national highways in flat plains).",
      explanation:
        "GPS straight-line = displacement. GPS driving distance = distance. Clear reasoning why they differ (roads are curved). Condition for equality (perfectly straight path) well-explained.",
    },
    {
      id: "mot1q18",
      type: "thinking",
      points: 25,
      question:
        "HOTS: An ant starts from point A and walks along the edges of a 2 m × 3 m rectangular room back to point A (one complete perimeter). Calculate distance and displacement. Now the ant walks just 3 sides of the rectangle (3/4 of the perimeter). Calculate distance and displacement. What does this show about the relationship between distance and displacement?",
      correctAnswer:
        "CASE 1 — Complete perimeter: Distance = perimeter = 2(2+3) = 2×5 = 10 m. Displacement = 0 m (returned to A). CASE 2 — Three sides (say: 3m, 2m, 3m — going along length, width, then length back): Wait — let me reconsider. Rectangle has dimensions 2m × 3m. If ant walks 3 sides: say it goes Right (3m), Down (2m), Left (3m). Start: corner A (top-left). End: corner D (bottom-left). Distance = 3 + 2 + 3 = 8 m. Displacement = straight line from A (top-left) to D (bottom-left) = 2 m downward. Direction: straight down (southward). RELATIONSHIP SHOWN: (1) Distance (8 m) >> Displacement (2 m) — the ant walked 4 times the direct distance to travel from A to D! (2) The longer the detour, the greater the ratio distance/|displacement|. (3) The minimum path from A to D (2 m, directly down one side) has distance = displacement. Any other path from A to D has distance > 2 m. This shows displacement sets a LOWER BOUND on possible distance between two points.",
      explanation:
        "Both cases calculated. The interpretation — displacement as lower bound of distance — is the key insight. The ant walking 8m when it could have walked 2m is a vivid illustration.",
    },
    {
      id: "mot1q19",
      type: "thinking",
      points: 25,
      question:
        "HOTS: Earth orbits the Sun in an approximately circular orbit of radius 1.5×10⁸ km. What is Earth's displacement after (a) 6 months, (b) 1 year? Compare with the distance travelled. What does this reveal about using displacement to measure planetary motion?",
      correctAnswer:
        "SETUP: Earth's orbit circumference = 2π × 1.5×10⁸ = 9.42×10⁸ km. This is one year's travel. (a) AFTER 6 MONTHS: Earth has reached the opposite side of the Sun. Displacement = diameter of orbit = 2 × 1.5×10⁸ = 3×10⁸ km (from start to diametrically opposite point). Distance = half circumference = 4.71×10⁸ km. |Displacement| (3×10⁸) < Distance (4.71×10⁸) ✓. (b) AFTER 1 YEAR: Earth returns to exact starting position. Displacement = 0 km. Distance = 9.42×10⁸ km. REVELATION: Using displacement alone to measure planetary motion would be completely misleading. After 1 year of non-stop travel at 30 km/s, Earth's displacement is ZERO — as if it never moved! This is why astronomers use distance (arc length, orbital period, angular velocity) rather than displacement to describe orbital motion. It also shows why for CIRCULAR or PERIODIC motion, displacement is not the right measure of 'how much' the object moved.",
      explanation:
        "Both calculations correct with proper use of circumference/diameter formulas. The revelation — zero displacement despite enormous distance travelled — shows the limitation of displacement for periodic motion.",
    },
    {
      id: "mot1q20",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A student claims: 'If I run 5 km in 20 minutes, I can say I have a speed of 15 km/h AND a velocity of 15 km/h.' Is the student correct? Under what conditions would this be true? Under what conditions would it be wrong?",
      correctAnswer:
        "SPEED vs VELOCITY: Speed = distance/time. Velocity = displacement/time. They can be equal or different depending on the path. WHEN STUDENT IS CORRECT: If the student ran 5 km in a perfectly straight line in one direction — then distance = |displacement| = 5 km. Speed = 5/0.333 h = 15 km/h. Velocity = 5 km (in the running direction)/0.333 h = 15 km/h in that direction. Both equal — student is correct. WHEN STUDENT IS WRONG: If the student ran on a curved track, wound around, or partially returned toward the start — displacement < 5 km. Then speed = 15 km/h BUT velocity = |displacement|/0.333 h < 15 km/h. The student's claim holds ONLY when the path is perfectly straight and unidirectional. ADDITIONAL SUBTLETY: Even when magnitudes are equal, velocity must include a direction (e.g. '15 km/h North'), while speed has no direction. So technically, the student's statement is incomplete even in the best case — they should say 'velocity of 15 km/h North' not just '15 km/h.'",
      explanation:
        "Speed (distance/time) vs velocity (displacement/time). The condition for equality (straight-line unidirectional motion). Even when magnitudes match, velocity requires direction. This connects Topic 1 to Topic 2 (speed vs velocity).",
    },
  ],
};
