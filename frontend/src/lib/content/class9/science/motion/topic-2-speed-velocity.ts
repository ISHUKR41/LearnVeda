/**
 * FILE: topic-2-speed-velocity.ts
 * LOCATION: src/lib/content/class9/science/motion/topic-2-speed-velocity.ts
 * PURPOSE: Deep content for Topic 2 — Speed and Velocity.
 *          Average speed, average velocity, instantaneous speed, velocity-time graphs.
 *          CBSE Class 9 Science Chapter 8.
 * LAST UPDATED: 2026-05-28
 */
import { Topic } from "./types";

export const speedVelocity: Topic = {
  id: "speed-velocity",
  title: "2. Speed and Velocity — How Fast and Which Way",
  estimatedMinutes: 32,
  imageUrl:
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200",
  content: `
### Two Words That Mean Different Things in Physics

In everyday life, people use "speed" and "velocity" interchangeably. "The car was going at high velocity." "What's your speed?" "What velocity were you going when the accident happened?"

In physics, these two words mean completely different things — and confusing them leads to wrong answers in exams and real errors in engineering calculations.

**The fundamental difference:**
* **Speed** tells you HOW FAST something is moving (scalar — magnitude only)
* **Velocity** tells you HOW FAST AND IN WHICH DIRECTION (vector — magnitude + direction)

---

### Speed — The Rate of Distance Covered

> **Speed** is the rate of change of distance. It measures how much distance an object covers per unit time.

$$\text{Speed} = \frac{\text{Distance}}{\text{Time}} = \frac{d}{t}$$

**Key properties:**
* **Scalar** — no direction specified
* **Always positive or zero** — cannot be negative
* **SI unit:** metres per second (m/s) or km/h

**Unit conversions:**
$$1 \text{ km/h} = \frac{1000 \text{ m}}{3600 \text{ s}} = \frac{5}{18} \text{ m/s}$$
$$1 \text{ m/s} = \frac{18}{5} \text{ km/h} = 3.6 \text{ km/h}$$

**Quick tips:**
* To convert km/h → m/s: multiply by **5/18**
* To convert m/s → km/h: multiply by **18/5** (or 3.6)

---

### Average Speed vs Instantaneous Speed

**Average Speed:**
Total distance divided by total time for an entire journey — regardless of how speed varied during the trip.

$$\text{Average Speed} = \frac{\text{Total Distance}}{\text{Total Time}}$$

**Example:** You drive 120 km in 2 hours, stopping for 15 minutes for fuel.
Total time = 2 hours 15 minutes = 2.25 hours
Average speed = 120/2.25 = 53.3 km/h

(Even though you might have been going 80 km/h on the highway and 0 km/h at the fuel stop — your average is 53.3 km/h)

**Instantaneous Speed:**
The speed of an object at one specific moment in time — what your car's speedometer reads right now.

$$v_{inst} = \lim_{\Delta t \to 0} \frac{\Delta d}{\Delta t}$$

For a d-t graph: instantaneous speed at any point = slope of the tangent to the curve at that point.

---

### Velocity — Speed with Direction

> **Velocity** is the rate of change of displacement. It measures how much displacement occurs per unit time and in what direction.

$$\text{Velocity} = \frac{\text{Displacement}}{\text{Time}} = \frac{s}{t}$$

**Key properties:**
* **Vector** — has both magnitude and direction
* **Can be positive, negative, or zero** — negative velocity means moving in the opposite direction to chosen positive direction
* **SI unit:** m/s (in a specified direction, e.g. "5 m/s northward")

**Example:**
A person walks 30 m East in 10 seconds, then 30 m West in 10 seconds.
* Total distance = 60 m. Total time = 20 s.
* Average speed = 60/20 = **3 m/s**
* Total displacement = 0 m (back to start)
* Average velocity = 0/20 = **0 m/s**

Speed (3 m/s) ≠ Velocity (0 m/s) — dramatic difference!

---

### Average Velocity

$$\bar{v} = \frac{\text{Total Displacement}}{\text{Total Time}} = \frac{s}{t}$$

Average velocity can be zero even for a moving object (if total displacement is zero — e.g., completing a round trip).

**When average speed = magnitude of average velocity:**
Only when the object moves in a straight line in one direction throughout.

---

### Uniform vs Non-Uniform Velocity

**Uniform Velocity:**
Object covers equal displacement in equal time intervals AND in the same direction. Constant speed + constant direction = uniform velocity.

**Non-uniform velocity (changing velocity = acceleration):**
Either speed changes, OR direction changes, OR both.

**Critical insight:** An object moving in a circle at constant speed has NON-UNIFORM velocity because its direction is constantly changing! A merry-go-round moves at constant speed but the velocity is always changing direction → this IS acceleration (centripetal acceleration). This is why circular motion requires centripetal force.

---

### Velocity-Time Graphs (v-t Graphs)

The velocity-time graph is even more information-rich than the d-t graph:

**What the v-t graph tells you:**

| Graph shape | Meaning |
|---|---|
| Horizontal line (v = constant) | Uniform velocity (no acceleration) |
| Straight line going up | Constant positive acceleration (speeding up) |
| Straight line going down | Constant deceleration (slowing down) |
| Horizontal line at v = 0 | Object at rest |
| Curve | Non-constant acceleration |

**SLOPE of v-t graph = ACCELERATION:**
$$a = \frac{\Delta v}{\Delta t} = \text{slope of v-t graph}$$

**AREA under v-t graph = DISPLACEMENT:**
$$s = \int v \, dt = \text{area between graph and time axis}$$

This is because: displacement = velocity × time (for uniform velocity).
For non-uniform velocity, the area under the v-t curve gives total displacement.

**Example calculation:**
A car accelerates uniformly from 0 to 20 m/s in 5 seconds. The v-t graph is a straight line from (0,0) to (5,20).
* Slope = 20/5 = **4 m/s²** = acceleration
* Area = ½ × base × height = ½ × 5 × 20 = **50 m** = displacement

---

### The Speedometer vs the Navigation System

Your car's **speedometer** measures instantaneous **speed** (how fast right now, no direction).

Your car's **GPS/navigation** uses **velocity** (speed AND direction) to tell you "turn left in 200 m" — it knows your direction and speed.

When your GPS says "recalculating" — it measured your velocity vector and found you're heading the wrong way.

---

### Real Speed Records

| Object | Speed |
|---|---|
| Human walking | ~1.4 m/s (5 km/h) |
| Usain Bolt (100m) | ~10.4 m/s (37.6 km/h) |
| Formula 1 car (top speed) | ~97 m/s (350 km/h) |
| Speed of sound in air | ~340 m/s (Mach 1) |
| Bullet (rifle) | ~900 m/s |
| International Space Station | ~7,700 m/s (27,600 km/h) |
| Speed of light | 3×10⁸ m/s (the universal speed limit) |
  `,
  questions: [
    {
      id: "mot2q1", type: "mcq", points: 10,
      question: "A car travels 150 km in 3 hours. Its average speed is:",
      options: ["50 m/s", "50 km/h", "450 km/h", "0.5 km/h"],
      correctAnswer: "50 km/h",
      explanation: "Average speed = distance/time = 150 km / 3 h = 50 km/h. Note the units — the answer in m/s would be 50×(5/18) ≈ 13.9 m/s, not 50 m/s."
    },
    {
      id: "mot2q2", type: "mcq", points: 10,
      question: "A person runs around a circular track once in 100 seconds. Their average velocity is:",
      options: ["Depends on track circumference", "Same as their speed", "Zero", "Cannot be calculated"],
      correctAnswer: "Zero",
      explanation: "After one complete lap, the person returns to the starting position. Displacement = 0. Average velocity = displacement/time = 0/100 = 0 m/s. Their speed is NOT zero (they ran the full circumference), but velocity is zero because net displacement is zero."
    },
    {
      id: "mot2q3", type: "mcq", points: 10,
      question: "72 km/h is equal to how many m/s?",
      options: ["72 m/s", "20 m/s", "25.9 m/s", "4 m/s"],
      correctAnswer: "20 m/s",
      explanation: "To convert km/h to m/s, multiply by 5/18. 72 × 5/18 = 360/18 = 20 m/s. Alternatively: 72 km/h = 72,000 m/3600 s = 20 m/s."
    },
    {
      id: "mot2q4", type: "mcq", points: 10,
      question: "The slope of a velocity-time (v-t) graph represents:",
      options: ["Displacement", "Speed", "Distance", "Acceleration"],
      correctAnswer: "Acceleration",
      explanation: "Slope = Δv/Δt = change in velocity per unit time = acceleration. Area under v-t graph = displacement. Slope of d-t graph = speed."
    },
    {
      id: "mot2q5", type: "mcq", points: 10,
      question: "An object moves in a circular path at constant speed. Its velocity is:",
      options: [
        "Constant, because speed is constant",
        "Zero, because displacement is zero",
        "Changing, because direction is continuously changing",
        "Infinite, because it rotates continuously"
      ],
      correctAnswer: "Changing, because direction is continuously changing",
      explanation: "Velocity is a vector — both magnitude AND direction must be constant for velocity to be constant. In circular motion, even at constant speed, direction changes at every point. Changing direction = changing velocity = acceleration is present (centripetal acceleration)."
    },
    {
      id: "mot2q6", type: "short", points: 15,
      question: "Distinguish between speed and velocity. Can speed be equal to the magnitude of velocity? When?",
      correctAnswer: "Speed: scalar quantity = distance/time. No direction. Always ≥ 0. Velocity: vector quantity = displacement/time. Has direction. Can be negative. They are equal in magnitude ONLY when the object moves in a straight line in one direction throughout — because in that case distance = |displacement|. For any curved path or return trip, speed > |velocity|.",
      explanation: "Scalar vs vector. Rate of distance vs rate of displacement. Condition for equality: straight-line unidirectional motion."
    },
    {
      id: "mot2q7", type: "short", points: 15,
      question: "A train travels from Station A to Station B (100 km away) in 2 hours. It then travels back to Station A in 1.5 hours. Calculate: (a) average speed for the whole journey, (b) average velocity for the whole journey.",
      correctAnswer: "(a) Total distance = 100 + 100 = 200 km. Total time = 2 + 1.5 = 3.5 hours. Average speed = 200/3.5 = 57.1 km/h. (b) Total displacement = 0 km (returned to starting point). Average velocity = 0/3.5 = 0 km/h. The train moved 200 km but has zero average velocity — because it returned to its starting point.",
      explanation: "Speed uses total distance (200 km), velocity uses total displacement (0 km). Different totals give dramatically different answers."
    },
    {
      id: "mot2q8", type: "short", points: 15,
      question: "What is instantaneous speed? How is it read from a distance-time graph?",
      correctAnswer: "Instantaneous speed is the speed of an object at a specific instant in time — the speedometer reading at that exact moment. On a d-t graph: for uniform motion (straight line), instantaneous speed = average speed = slope of the line. For non-uniform motion (curved line), instantaneous speed at any point = slope of the tangent drawn to the curve at that point. The steeper the tangent, the higher the instantaneous speed.",
      explanation: "Definition + how to read from d-t graph (tangent slope for curves, line slope for straight)."
    },
    {
      id: "mot2q9", type: "short", points: 15,
      question: "Convert: (a) 90 km/h to m/s, (b) 15 m/s to km/h.",
      correctAnswer: "(a) 90 km/h × (5/18) = 450/18 = 25 m/s. (b) 15 m/s × (18/5) = 270/5 = 54 km/h. Memory trick: km/h → m/s: multiply by 5/18 (÷3.6). m/s → km/h: multiply by 18/5 (×3.6).",
      explanation: "Both conversions using the standard factors. The 5/18 and 18/5 factors should be memorised."
    },
    {
      id: "mot2q10", type: "short", points: 15,
      question: "What does the area under a velocity-time graph represent? How do you calculate it for uniform and non-uniform motion?",
      correctAnswer: "Area under v-t graph = displacement (distance travelled in a specific direction). For UNIFORM motion (horizontal line or straight slope): Area = geometric shapes (rectangles and triangles). Example: v=20 m/s for 5s → area = rectangle = 20×5 = 100 m displacement. For NON-UNIFORM motion (curved graph): Divide into small time intervals, calculate area of each small strip, sum them up (numerical integration). For a triangle-shaped area: ½ × base × height.",
      explanation: "Area = displacement. Calculation method for both uniform (simple geometry) and non-uniform (small strips / integration) cases."
    },
    {
      id: "mot2q11", type: "long", points: 20,
      question: "A car starts from rest and reaches 60 m/s in 10 seconds (constant acceleration). It then maintains 60 m/s for 20 seconds. Finally, it brakes and comes to rest in 5 seconds. Draw a description of the v-t graph, calculate the acceleration in each phase, and find total displacement.",
      correctAnswer: "PHASE 1 (0–10s): Speed increases from 0 to 60 m/s. V-t graph: straight line from (0,0) to (10,60). Acceleration = Δv/Δt = 60/10 = 6 m/s². Displacement = area = ½ × 10 × 60 = 300 m. PHASE 2 (10–30s): Speed constant at 60 m/s. V-t graph: horizontal line at v=60 from t=10 to t=30. Acceleration = 0 m/s². Displacement = area = 60 × 20 = 1200 m. PHASE 3 (30–35s): Speed decreases from 60 to 0 m/s. V-t graph: straight line from (30,60) to (35,0). Acceleration = (0-60)/5 = -12 m/s² (deceleration). Displacement = area = ½ × 5 × 60 = 150 m. TOTAL DISPLACEMENT = 300 + 1200 + 150 = 1650 m = 1.65 km. TOTAL TIME = 35 seconds.",
      explanation: "All three phases: v-t graph shape described, acceleration calculated as slope (Δv/Δt), displacement calculated as area (½bh for triangles, l×w for rectangles)."
    },
    {
      id: "mot2q12", type: "long", points: 20,
      question: "Explain the difference between average speed and instantaneous speed with the example of a journey. Why might a speedometer reading never show the actual average speed of a trip?",
      correctAnswer: "AVERAGE SPEED: Calculated over an entire journey. Total distance ÷ total time. Does not reflect what happened at any specific moment. Example: A 60 km trip that takes 1.5 hours has average speed = 40 km/h. INSTANTANEOUS SPEED: The speed at one specific moment — what the speedometer shows right now. Can vary continuously throughout a journey. EXAMPLE OF DIFFERENCE: A person drives 60 km from home to a friend's house in 1.5 hours. During the journey: highway (80 km/h), city streets (30 km/h), traffic jams (0 km/h). Speedometer ranged from 0 to 80 km/h. Average speed = 40 km/h. The speedometer NEVER showed 40 km/h throughout the trip — yet that's the average! WHY SPEEDOMETER NEVER SHOWS AVERAGE: The speedometer responds instantaneously to current wheel rotation speed. It cannot know the total distance remaining or total time elapsed for the journey. Average speed requires knowing the ENTIRE journey's data — it's a retrospective calculation. The speedometer is a real-time instrument; average speed is a journey-level statistic.",
      explanation: "Clear distinction with formulas. Example showing the range of instantaneous speeds vs average speed. Explanation of why a real-time instrument cannot display a retrospective average."
    },
    {
      id: "mot2q13", type: "long", points: 20,
      question: "Two trains start from the same station at the same time. Train A moves at 40 km/h toward City X (100 km away). Train B moves at 60 km/h toward City Y (120 km away), in the SAME direction as City X. After 2 hours: (a) Where is each train? (b) What is the velocity of Train B relative to Train A?",
      correctAnswer: "(a) Train A after 2h: distance = 40 × 2 = 80 km from station (toward X, 20 km remaining). Train B after 2h: distance = 60 × 2 = 120 km from station — Train B has already REACHED City Y! (b) RELATIVE VELOCITY: Train B's velocity = 60 km/h (forward). Train A's velocity = 40 km/h (forward, same direction). Velocity of B relative to A = 60 - 40 = 20 km/h in the forward direction. This means from Train A's perspective (as a reference frame), Train B appears to be moving forward at 20 km/h — slowly pulling ahead. After 2 hours: Train B is 120 km from station, Train A is 80 km. Separation = 40 km. At 20 km/h relative velocity, it took 120/20 = ... let's verify: at t=0, same position. Separation grows at 20 km/h. After 2 hours, separation = 20 × 2 = 40 km ✓.",
      explanation: "Position calculations for both trains. Relative velocity = V_B - V_A (same direction → subtract). Verification using relative velocity × time = separation."
    },
    {
      id: "mot2q14", type: "long", points: 20,
      question: "A ball is thrown vertically upward at 20 m/s. Taking upward as positive and g = 10 m/s²: (a) What is the ball's speed and velocity after 1 second? (b) After 3 seconds? (c) At what moment does the ball have zero velocity? (d) What is the ball's speed at that moment?",
      correctAnswer: "(a) After 1 second: velocity = u + at = 20 + (−10)(1) = 20 − 10 = +10 m/s (still moving upward). Speed = |10| = 10 m/s. (b) After 3 seconds: velocity = 20 + (−10)(3) = 20 − 30 = −10 m/s (now moving DOWNWARD — past the top). Speed = |−10| = 10 m/s. (c) ZERO VELOCITY (at the top): 0 = 20 + (−10)t → 10t = 20 → t = 2 seconds. At exactly 2 seconds, the ball is at its highest point with zero velocity. (d) SPEED AT ZERO VELOCITY: Speed = |velocity| = |0| = 0 m/s. Note: acceleration is still −10 m/s² at this point — gravity never stops. Only velocity is zero at the top, not acceleration. This is a common exam mistake.",
      explanation: "All four parts using v = u + at. The distinction between speed (always positive) and velocity (can be negative = downward) is clearly shown. The critical point: zero velocity ≠ zero acceleration."
    },
    {
      id: "mot2q15", type: "long", points: 20,
      question: "What is uniform velocity and non-uniform velocity? Explain why an object moving in a circle at constant speed has non-uniform velocity. What force does this require?",
      correctAnswer: "UNIFORM VELOCITY: Object moves with BOTH constant speed AND constant direction. Equal displacement in equal time intervals, always in the same direction. Example: A car on a perfectly straight highway at exactly 80 km/h with no changes. NON-UNIFORM VELOCITY: Either speed changes, OR direction changes, OR both. CIRCULAR MOTION — NON-UNIFORM VELOCITY: Consider a ball on a string moving in a horizontal circle at constant speed v. At every point on the circle, the velocity vector is tangent to the circle — pointing in a different direction. Even though |v| is constant, the DIRECTION of v changes continuously. Changing velocity (even just direction) = acceleration. This acceleration always points toward the center of the circle — CENTRIPETAL ACCELERATION: a = v²/r. REQUIRED FORCE: From Newton's Second Law, F = ma. Since centripetal acceleration exists (pointing toward center), there must be a centripetal force directed toward the center. For the ball on string: tension in the string provides the centripetal force. For Earth orbiting Sun: gravity provides centripetal force. For a car turning: friction from tires provides centripetal force.",
      explanation: "Uniform vs non-uniform velocity. The direction-change argument for circular motion is critical. Centripetal acceleration = v²/r. Force sources for real circular motion examples."
    },
    {
      id: "mot2q16", type: "thinking", points: 25,
      question: "HOTS: The speed of light is ~3×10⁸ m/s in vacuum — the absolute universal speed limit. Nothing with mass can reach this speed. Yet light from the Sun takes ~8 minutes to reach Earth. Calculate the Earth-Sun distance using this data. If the Sun suddenly 'turned off,' how long would it take before we knew?",
      correctAnswer: "EARTH-SUN DISTANCE: Light speed = 3×10⁸ m/s. Time = 8 minutes = 8 × 60 = 480 seconds. Distance = speed × time = 3×10⁸ × 480 = 1.44×10¹¹ m = 1.44×10⁸ km ≈ 150 million km (1.5×10¹¹ m — matches the actual value of 1 Astronomical Unit). SUN TURNING OFF: Since light (including the last light from the Sun) travels at 3×10⁸ m/s, and it takes 8 minutes for light to travel from Sun to Earth, we would NOT immediately know. We would continue seeing the Sun normally for 8 minutes after it turned off. After exactly 8 minutes, the sky would go dark (daylight would end). GRAVITY: Interestingly, gravitational effects also propagate at the speed of light. So Earth's orbit would be disturbed ALSO 8 minutes after the Sun turned off — not instantly. This means for 8 minutes, Earth would orbit a gravitational source it can no longer see — and a source that no longer exists. This fact — that both light and gravity travel at the same finite speed — was one of the key insights confirmed by LIGO's detection of gravitational waves from merging neutron stars simultaneously observed as light.",
      explanation: "Distance calculation using d = v × t (correct unit conversion for minutes → seconds). The 8-minute delay revelation. Bonus: gravity also travels at light speed — LIGO confirmation."
    },
    {
      id: "mot2q17", type: "thinking", points: 25,
      question: "HOTS: A police speed radar gun measures the speed of vehicles. It works by bouncing radio waves off a moving car and measuring the change in frequency (Doppler effect). Explain the physics involved. Why does the radar give SPEED, not velocity? How do traffic cameras then determine direction?",
      correctAnswer: "DOPPLER EFFECT PHYSICS: The radar gun emits radio waves at frequency f₀. These waves bounce off the moving car and return to the gun. If the car moves TOWARD the gun: reflected waves are compressed (higher frequency f_reflected > f₀). If car moves AWAY: waves are stretched (lower frequency < f₀). The shift Δf = f_reflected − f₀ is proportional to the car's speed: v_car ≈ c × Δf/(2f₀), where c = speed of radio waves (~3×10⁸ m/s). GIVES SPEED, NOT VELOCITY: The Doppler radar measures the MAGNITUDE of the speed component along the radar beam direction. It cannot automatically determine if the car is going left-to-right or right-to-left when the radar gun is placed perpendicular to the road. It measures how fast the car is approaching or receding — a scalar speed component. HOW CAMERAS DETERMINE DIRECTION: Traffic cameras use visual image analysis (the license plate direction, the car's appearance in successive frames) OR use multiple radar antennas at different angles. The direction of travel is identified by: (1) which direction the car appears to be facing/moving in the camera image, (2) comparing two radar readings (are the waves being compressed = approaching, or stretched = receding), (3) time-stamped image sequences showing the car moving in a particular direction across the frame.",
      explanation: "Doppler principle for radar. Why it gives speed (not direction). How visual cameras supplement radar for direction. This applies physics to real law enforcement technology."
    },
    {
      id: "mot2q18", type: "thinking", points: 25,
      question: "HOTS: Two cars approach each other: Car A (40 m/s) and Car B (60 m/s). They are 500 m apart. How long before they collide? Now: same scenario but both are moving in the SAME direction. How long before the faster one (B) catches up with A? What concept explains the difference?",
      correctAnswer: "OPPOSITE DIRECTIONS (head-on): Relative speed = 40 + 60 = 100 m/s (they approach each other, so speeds add). Time to collision = distance/relative speed = 500/100 = 5 seconds. SAME DIRECTION: Car B is behind Car A. Relative speed of B relative to A = 60 - 40 = 20 m/s (B approaches A at 20 m/s). Time for B to close 500 m gap = 500/20 = 25 seconds. KEY CONCEPT — RELATIVE VELOCITY: When two objects move toward each other (opposite directions): relative speed = sum of individual speeds. When moving in same direction: relative speed = difference of individual speeds. This is the principle of relative velocity. In the reference frame of Car A, Car B approaches at 20 m/s (same direction) or 100 m/s (opposite direction). SAFETY IMPLICATION: Head-on collisions are far more dangerous than rear-end collisions at comparable speeds. A head-on collision at 60 km/h each = relative impact speed of 120 km/h. Same direction at 80 km/h vs 60 km/h = relative impact speed of only 20 km/h. This is why divided highways (with median barriers) dramatically reduce fatality rates.",
      explanation: "Relative velocity: opposite directions = add speeds, same direction = subtract speeds. Time calculations for both cases. Safety implication (head-on vs rear-end) connects physics to real consequences."
    },
    {
      id: "mot2q19", type: "thinking", points: 25,
      question: "HOTS: A car odometer shows 1000 km at the start of a week and 1800 km at the end. The driver made several trips during the week. Can you find: (a) the exact average speed, (b) the average velocity? What additional information would you need for an accurate average speed?",
      correctAnswer: "(a) AVERAGE SPEED — NOT EXACTLY: The odometer shows total distance = 1800 - 1000 = 800 km was driven. But without knowing the TOTAL TIME spent driving (including rest stops), you cannot calculate average speed. If the week had 168 hours total: average speed over week = 800/168 = 4.76 km/h (meaninglessly low since the car was parked most of the time). If the car was driven for 16 hours total: average speed = 800/16 = 50 km/h (more meaningful). You need the TOTAL DRIVING TIME (not calendar time) for meaningful average speed. (b) AVERAGE VELOCITY — NOT POSSIBLE AT ALL: Velocity requires knowing displacement — the straight-line distance from start to end position. The odometer tells you 800 km was driven but gives NO information about in what direction(s) or where the car ended up relative to where it started. If the driver made all local trips returning home each time, net displacement = 0 km, average velocity = 0 km/h. If they relocated 300 km away: displacement = 300 km in some direction. Without GPS tracking or exact route information, displacement is unknown. LESSON: Distance (800 km) is easily measured by odometer. Speed requires timing. Velocity requires both direction tracking and displacement measurement — much more complex data.",
      explanation: "Average speed requires total time (not calendar time). Average velocity requires displacement (unknown from odometer alone). This question tests deep understanding of what each measurement actually requires."
    },
    {
      id: "mot2q20", type: "thinking", points: 25,
      question: "HOTS: The International Space Station orbits Earth at approximately 400 km altitude and completes one orbit every 92 minutes. Calculate its orbital speed in m/s and km/h. What is its average velocity over any complete number of orbits? Why does it experience weightlessness despite being in Earth's gravitational field?",
      correctAnswer: "ORBITAL PARAMETERS: Earth's radius ≈ 6,371 km. ISS altitude = 400 km. Orbital radius = 6,371 + 400 = 6,771 km. Orbital circumference = 2π × 6,771 = 42,540 km. ORBITAL SPEED: Speed = circumference/period = 42,540 km / (92 min × 1/60 h/min) = 42,540 / 1.533 h ≈ 27,750 km/h. In m/s: 27,750 × 1000/3600 ≈ 7,708 m/s ≈ 7.7 km/s. AVERAGE VELOCITY OVER COMPLETE ORBITS: Zero. After any complete number of orbits, the ISS returns to the same orbital position — displacement = 0. Average velocity = displacement/time = 0. WEIGHTLESSNESS EXPLANATION: Gravity at 400 km altitude is approximately 8.7 m/s² (slightly less than 9.8 m/s² at surface — gravity decreases with altitude but never reaches zero). The ISS and everything inside it are in FREE FALL — constantly falling toward Earth. But the ISS moves forward so fast (7.7 km/s) that as it falls, Earth's surface curves away beneath it at exactly the same rate. This is orbiting: continuous free fall in a curved path. Astronauts float not because gravity is absent but because they are ALL falling at the same rate — there is no relative force between them and the floor of the ISS. It's like being in an elevator with the cable cut — apparent weightlessness.",
      explanation: "Full calculation of orbital speed with correct unit conversion. Zero average velocity for complete orbits. The free-fall explanation of weightlessness (not absence of gravity) is the key conceptual insight."
    }
  ]
};
