/**
 * FILE: topic-2-first-law-of-motion.ts
 * LOCATION: src/lib/content/class9/science/force-and-laws-of-motion/topic-2-first-law-of-motion.ts
 * PURPOSE: Deep, richly detailed content for Topic 2 — Newton's First Law of Motion
 *          and the concept of Inertia. Absolute beginner friendly with real-life
 *          examples, deep intuition building, and 20 categorized questions.
 * CURRICULUM: CBSE Class 9 Science, Chapter 9 — Force & Laws of Motion
 * LAST UPDATED: 2026-05-28
 */
import { Topic } from "./types";

export const firstLawOfMotionInertia: Topic = {
  id: "first-law-of-motion-inertia",
  title: "2. Newton's First Law of Motion: The Law of Inertia",
  estimatedMinutes: 35,
  imageUrl:
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",

  content: `
### The Discovery That Changed Everything

Long before Newton, people believed that objects needed a constant force to keep them moving. Aristotle (ancient Greek philosopher) thought: "Push a cart. The moment you stop pushing, it stops." This seemed obvious from everyday experience.

But Newton — standing on the shoulders of Galileo's experiments — proved this completely **wrong**. The reason objects stop is not because motion needs a force to continue. Objects stop because of **friction** — an external force working against them.

Newton's brilliant insight: **If there were no friction, an object set in motion would continue moving forever.**

---

### Newton's First Law of Motion (The Complete Statement)

> **"An object at rest remains at rest, and an object in motion continues to move at constant velocity (constant speed in a straight line), unless acted upon by an external unbalanced force."**

Let us break this down into two separate but equally important statements:

**Part 1 — For Objects at Rest:**
*"An object at rest stays at rest unless an unbalanced force acts on it."*

**Everyday proof:** Your pen is sitting on your desk right now. It has been there since you put it down. The Earth isn't actively holding it still — it's simply that no unbalanced force is pushing the pen anywhere. It will sit there for years, decades, centuries unless something pushes or pulls it.

**Part 2 — For Objects in Motion:**
*"An object in motion continues at the same speed and in the same direction unless an unbalanced force acts on it."*

**Space proof:** Space probes like Voyager 1 (launched by NASA in 1977) are still traveling through deep space today at 17 km/s — without any engine. There is (almost) no friction in space, so no unbalanced force slows them down. They just... keep going.

---

### Understanding Inertia — The "Laziness" of Matter

Newton's First Law is fundamentally about **Inertia**. The word comes from the Latin *iners*, meaning "idle" or "lazy."

> **Inertia** is the natural tendency of matter to **resist any change** in its state of motion (whether at rest or moving).

Think of inertia as an object's stubbornness:
* **Resting objects are stubborn about staying still** — they don't want to start moving.
* **Moving objects are stubborn about staying in motion** — they don't want to stop or change direction.

Inertia is NOT a force. It is a **property of matter** — every object with mass has inertia.

---

### Mass is the Measure of Inertia

Here is a key insight: **the more mass an object has, the more inertia it has**.

Think about it intuitively:
* A ping pong ball vs. a bowling ball — which is harder to start moving? The bowling ball. More mass → more resistance to motion change.
* A loaded truck vs. an empty bicycle — which is harder to stop once moving? The truck. More mass → more inertia → needs more force to decelerate.

**Mathematical expression:**
Inertia does not have a separate formula — it IS mass. The unit of inertia is the **kilogram (kg)**.

---

### Three Types of Inertia

Physicists classify inertia into three types based on what kind of motion change is being resisted:

#### 1. Inertia of Rest
The tendency of a body to **remain at rest** and resist being set into motion.

**Classic Demonstration:** Pull a tablecloth out from under plates and glasses with a very quick jerk. If done fast enough, the dishes barely move! Their inertia of rest keeps them in place while the tablecloth slides under them.

**Another Example:** When a bus at a bus stop suddenly starts moving, passengers standing inside lurch backward. Their feet move with the bus (friction from the floor), but their upper bodies have inertia of rest — they resist the forward acceleration and appear to fall backward.

#### 2. Inertia of Motion
The tendency of a body to **continue moving** at the same speed and in the same direction.

**Example — Shaking a tree:** When you shake the branch of a fruit tree, the branch moves back and forth rapidly. But the fruit (attached by a smaller stem) cannot keep up with these rapid direction changes. The fruit's inertia of motion keeps it going in its original direction while the branch changes — causing it to detach and fall.

**Example — Athletic jump:** A long jumper runs fast to build up speed before the jump. During the jump, their inertia of motion carries them forward even though their feet are not in contact with the ground.

#### 3. Inertia of Direction
The tendency of a body to **continue moving in the same straight-line direction** and resist turning.

**Example — Spinning a stone on a string:** If you spin a stone attached to a string in a circle and the string breaks, the stone does NOT continue going in a circle. It flies off in a **straight line** (tangent to the circle). This is inertia of direction — the stone "wants" to go straight.

**Example — Water drops from a spinning wheel:** When a cyclist rides through a puddle, the tire spins rapidly. Water sticking to the tire gets carried in a circle. When it detaches, inertia of direction launches it in a straight tangential direction (which is why cyclists get a stripe of mud up their back!).

---

### Deep Real-World Applications

#### Why Seatbelts Save Lives

When a car crashes into a wall, the car stops almost instantly (an enormous braking force). But your body — due to its inertia of motion — continues moving forward at the original car speed. If there's no seatbelt, your body slams into the steering wheel or windshield with tremendous force. The seatbelt provides the necessary backward force to decelerate your body along with the car.

#### Karate Board Breaking

A skilled martial artist holds one hand still and strikes a wooden board with the other at very high speed. The board has inertia of rest — it resists the sudden change. But the force exceeds the board's structural strength, so it breaks rather than instantly accelerating.

#### Passengers Falling Backward in Buses

When a stationary bus suddenly accelerates, the floor (via friction) immediately moves the passengers' feet forward. But the passengers' bodies have inertia of rest — their upper bodies resist this sudden forward motion. Result: they appear to fall backward. In reality, their lower bodies have been pushed forward while their upper bodies have "stayed behind" momentarily.

---

### Galileo's Revolutionary Experiment

Before Newton, Galileo performed brilliant experiments on inclined planes. He found:
* A ball rolling down an incline accelerates.
* A ball rolling up an incline decelerates.
* A ball rolling on a perfectly flat, frictionless surface would neither accelerate nor decelerate — it would roll at constant speed forever.

Since a perfectly frictionless surface is impossible, Galileo could never prove this directly. But he deduced it logically. Newton formalized this deduction into the First Law, giving Galileo credit: *"I saw further because I stood on the shoulders of giants."*

---

### The "Natural State" Revolution

Aristotle's old idea: **The natural state of objects is rest.** Motion needs an explanation.

Newton/Galileo's revolution: **Both rest AND constant motion are equally natural.** Only *changes* in motion need an explanation (i.e., require a force).

This was one of the most profound shifts in scientific thinking in human history. It took genius to look at a cart stopping and not say "it stopped because that's natural" but instead ask "what external force stopped it?"

---

### When Does the First Law Apply?

The First Law (and all Newton's Laws) apply only in **Inertial Reference Frames** — frames of reference that are not themselves accelerating.

*Simplified:* If you are standing still or moving at a constant velocity (not turning, not speeding up, not slowing down), Newton's laws work perfectly for you. If you're in an accelerating reference frame (inside a spinning carousel, for instance), you'll perceive "fictitious forces" that seem to violate the First Law.

For Class 9, always assume you're in an inertial frame (ground level, not rotating).
  `,

  questions: [
    /* ── 5 MCQs ── */
    {
      id: "t2q1",
      type: "mcq",
      points: 10,
      question:
        "When a bus at a stop suddenly starts moving forward, a standing passenger falls backward. This is due to:",
      options: [
        "Inertia of rest of the passenger's body",
        "The bus pushing backward on the passenger",
        "Gravity increasing momentarily",
        "Friction between feet and floor",
      ],
      correctAnswer: "Inertia of rest of the passenger's body",
      explanation:
        "The passenger's body was at rest. When the bus accelerates forward, the floor (via friction) pulls the feet forward. The upper body resists this change due to inertia of rest, creating the 'falling backward' sensation.",
    },
    {
      id: "t2q2",
      type: "mcq",
      points: 10,
      question:
        "Voyager 1 was launched in 1977 and is still moving through deep space without any engine. What explains this?",
      options: [
        "Space has a special energy that keeps it moving",
        "The Sun constantly pulls it forward",
        "In the near-vacuum of space, there is negligible friction — Newton's First Law",
        "Its engines are on very low power",
      ],
      correctAnswer:
        "In the near-vacuum of space, there is negligible friction — Newton's First Law",
      explanation:
        "Newton's First Law states that an object in motion remains in motion unless acted on by an unbalanced force. In deep space, there is no significant friction or air resistance to slow Voyager down, so it continues at nearly constant velocity.",
    },
    {
      id: "t2q3",
      type: "mcq",
      points: 10,
      question:
        "Which of the following is the correct unit for measuring inertia?",
      options: ["Newton (N)", "Joule (J)", "Kilogram (kg)", "Pascal (Pa)"],
      correctAnswer: "Kilogram (kg)",
      explanation:
        "Inertia is not a force — it is a property of matter directly proportional to mass. Therefore, it is measured in kilograms (kg), the unit of mass. More mass = more inertia.",
    },
    {
      id: "t2q4",
      type: "mcq",
      points: 10,
      question:
        "You spin a stone on a string in a circle. The string suddenly breaks. The stone will:",
      options: [
        "Continue in a circle by inertia",
        "Fall straight down immediately",
        "Fly outward in a straight line tangent to the circle",
        "Stop moving immediately",
      ],
      correctAnswer: "Fly outward in a straight line tangent to the circle",
      explanation:
        "This is inertia of direction. The stone was moving in the direction tangent to the circle at the moment the string broke. Without the centripetal force from the string, the stone continues in the straight-line direction it was already traveling — a tangent to the circle.",
    },
    {
      id: "t2q5",
      type: "mcq",
      points: 10,
      question:
        "A heavy truck and a bicycle are moving at the same speed. The truck is harder to stop because:",
      options: [
        "It has a more powerful engine",
        "It has greater mass and therefore greater inertia of motion",
        "Its wheels create more friction",
        "It travels on bigger roads",
      ],
      correctAnswer:
        "It has greater mass and therefore greater inertia of motion",
      explanation:
        "Inertia is directly proportional to mass. The truck's much larger mass gives it far more inertia of motion — it resists the change from moving to rest much more strongly. Stopping requires a much larger force or a much longer distance.",
    },

    /* ── 5 Short Answer ── */
    {
      id: "t2q6",
      type: "short",
      points: 15,
      question: "State Newton's First Law of Motion in your own words.",
      correctAnswer:
        "Every object continues to be in its state of rest OR in its state of uniform motion (same speed, same direction) unless an unbalanced external force acts on it. This also means that objects naturally resist any change in their state of motion — a property called inertia.",
      explanation:
        "The answer must cover both parts: objects at rest stay at rest, AND objects in motion stay in motion. Mentioning inertia strengthens the answer.",
    },
    {
      id: "t2q7",
      type: "short",
      points: 15,
      question:
        "What is inertia? How is it related to mass? Give an example showing that more massive objects have greater inertia.",
      correctAnswer:
        "Inertia is the natural tendency of an object to resist any change in its state of motion. It is directly proportional to mass — more mass means more inertia. Example: It is much easier to push a bicycle from rest than to push a car from rest with the same force. The car, having far more mass, has far greater inertia and resists being set into motion more.",
      explanation:
        "Definition of inertia + relationship with mass (directly proportional) + concrete example showing more mass = more resistance to motion change.",
    },
    {
      id: "t2q8",
      type: "short",
      points: 15,
      question:
        "Explain 'inertia of rest' using the example of a tablecloth trick.",
      correctAnswer:
        "Inertia of rest is the tendency of an object to remain stationary. In the tablecloth trick, you pull the cloth quickly. The crockery on top has inertia of rest — it resists being set into motion. If the cloth is pulled fast enough, there isn't sufficient time for the small friction force between cloth and crockery to accelerate the crockery significantly. So the crockery stays nearly in place while the cloth slides away.",
      explanation:
        "The answer must name inertia of rest, explain it means resisting the start of motion, and correctly identify friction as the relevant force and why the speed of pulling matters.",
    },
    {
      id: "t2q9",
      type: "short",
      points: 15,
      question:
        "Why do athletes take a running start before a long jump even though the actual jump happens from a stationary board?",
      correctAnswer:
        "Athletes build up speed by running before the jump to create inertia of motion. At the moment of takeoff, their bodies are moving forward at high velocity. During the jump (when feet leave the ground), there's no ground-contact force to change their speed. Their inertia of motion carries them forward through the air, covering maximum horizontal distance.",
      explanation:
        "The key is that inertia of motion carries the jumper forward through the air — the running start creates the velocity, and inertia maintains it through the flight phase.",
    },
    {
      id: "t2q10",
      type: "short",
      points: 15,
      question:
        "Why is Newton's First Law sometimes called the 'Law of Inertia'?",
      correctAnswer:
        "Newton's First Law is called the Law of Inertia because it completely describes inertia as a concept. The law states that objects resist changes in their state — rest or motion — unless an external force acts. This resistance to change IS inertia. The law is essentially a formal, mathematical statement of the definition of inertia itself.",
      explanation:
        "The connection must be explicit: the law describes what inertia does (maintain current state) and therefore the law and inertia are the same concept stated in different ways.",
    },

    /* ── 5 Long Answer ── */
    {
      id: "t2q11",
      type: "long",
      points: 20,
      question:
        "Explain with three detailed real-life examples (one for each type) the three types of inertia: inertia of rest, inertia of motion, and inertia of direction.",
      correctAnswer:
        "INERTIA OF REST: When you quickly jerk a playing card placed under a coin, the coin remains in place and then falls into the glass. The coin's inertia of rest resists the change of state — it stays where it is while the card moves away. INERTIA OF MOTION: When a long-jumper leaves the ground, their body continues moving forward through the air because of inertia of motion. There is no external force (except the downward pull of gravity) to stop their horizontal motion. INERTIA OF DIRECTION: When a moving bus turns sharply to the left, passengers feel 'thrown' to the right. Their bodies were moving in a straight line (forward) and resist the change of direction. The bus turns left, but the passengers' bodies try to continue straight — appearing to be thrown right relative to the bus.",
      explanation:
        "All three types with distinct examples. Rest = resisting starting motion. Motion = resisting stopping motion. Direction = resisting changing direction of motion.",
    },
    {
      id: "t2q12",
      type: "long",
      points: 20,
      question:
        "Galileo's experiment on inclined planes was crucial to Newton's First Law. Describe what Galileo observed and how it led to the concept of inertia.",
      correctAnswer:
        "Galileo set up two inclined planes facing each other like a V-shape. He released a ball from one side and observed: (1) On a rough surface, the ball rose to a height slightly less than its starting height. (2) On a smoother surface, the ball rose closer to the original height. (3) Galileo deduced: on a perfectly frictionless surface, the ball would rise to exactly the original height. Now, what if the second ramp was made flat (horizontal)? The ball would never rise to its original height — it would travel forever, trying to reach that height. This means the ball, on a frictionless flat surface, would travel at constant speed indefinitely. This was the key insight that Newton formalized: without an external force (friction), moving objects maintain their motion. Galileo couldn't prove it directly (frictionless surfaces don't exist), but his logical deduction was correct.",
      explanation:
        "The inclined plane experiment, the effect of friction reduction, and the logical deduction about frictionless surfaces must all be covered.",
    },
    {
      id: "t2q13",
      type: "long",
      points: 20,
      question:
        "Explain in detail why seatbelts and headrests in cars save lives. Use Newton's First Law and the concept of inertia in your explanation.",
      correctAnswer:
        "SEATBELTS: During a frontal crash, the car decelerates suddenly due to a large unbalanced force (impact). The car's structure stops. But the passengers' bodies have inertia of motion — they were moving at 60 km/h and resist stopping. Without seatbelts, the body continues forward at 60 km/h and crashes into the steering wheel, dashboard, or windshield. The seatbelt applies a backward force on the torso, decelerating the passenger along with the car — spreading the stopping force over time. HEADRESTS: In a rear-end collision, the car is suddenly pushed forward. Passengers' bodies are accelerated by the seat. But the head (connected only by the neck) has inertia of rest — it tries to stay behind while the torso goes forward. This violent relative movement can break the neck (whiplash). The headrest catches the head and provides the forward force to accelerate it along with the body, preventing the neck from hyperextending.",
      explanation:
        "Two separate safety features with distinct force analyses. Seatbelts prevent forward body momentum (inertia of motion); headrests prevent backward head lag (inertia of rest) during rear collisions.",
    },
    {
      id: "t2q14",
      type: "long",
      points: 20,
      question:
        "How did Newton's First Law revolutionize our understanding of motion, overturning the 2000-year-old ideas of Aristotle? Explain the key conceptual difference.",
      correctAnswer:
        "ARISTOTLE'S VIEW (wrong): Aristotle believed the 'natural state' of all earthly objects is rest. Motion was unnatural and required a constant force. When you stop pushing a cart, it stops — this seemed to confirm his view. GALILEO/NEWTON'S REVOLUTION: Newton (building on Galileo) realized Aristotle was ignoring friction. The cart stops not because motion is unnatural, but because friction (an unbalanced force) decelerates it. In the absence of friction, the cart would continue forever. The KEY conceptual revolution: Rest and constant motion are equally 'natural' states — BOTH are inertial states requiring no force to maintain. Only CHANGES in motion require force. This shifted the fundamental question from 'Why does this object move?' to 'Why did this object CHANGE its motion?' — a dramatically more productive scientific framework that explains everything from bullet trajectories to planetary orbits.",
      explanation:
        "Aristotle's incorrect theory + why it seemed right (friction) + Newton's correction + the fundamental conceptual shift about natural states of motion.",
    },
    {
      id: "t2q15",
      type: "long",
      points: 20,
      question:
        "When fruits are shaken off a tree by shaking its branches, which type of inertia is demonstrated? Explain the forces and motion involved in detail.",
      correctAnswer:
        "This demonstrates INERTIA OF REST (primarily) with elements of inertia of direction. When you shake the branch, the branch rapidly moves back and forth (alternating in direction). The fruit, attached by a relatively weak stem connection, cannot perfectly follow every rapid direction change. The fruit's inertia of rest (and inertia of direction) resists these rapid back-and-forth accelerations. At each change of direction, the branch changes direction, but the fruit momentarily continues in the original direction. The repeated rapid force changes stress the connection between fruit and branch. Eventually, the stem connection breaks, and the fruit falls. The fruit doesn't follow the branch because it resists the changes in motion — its inertia is greater than the force the stem can transmit. If the shaking is slow, the stem force is small and the stem holds. Fast shaking requires large rapid forces that exceed the stem's strength.",
      explanation:
        "The inertia type must be correctly identified (inertia of rest/direction). The mechanism — rapid direction changes, stem transmitting force, inertia resisting — must be clearly explained.",
    },

    /* ── 5 HOTS/Deep Thinking ── */
    {
      id: "t2q16",
      type: "thinking",
      points: 25,
      question:
        "HOTS: Aristotle said 'motion requires a constant force.' A beginner student agrees: 'I have to keep pushing a box to keep it moving, so Aristotle was right!' How would you explain why this student is wrong, using Newton's framework?",
      correctAnswer:
        "The student is confusing the cause of the box moving with the cause of the box STOPPING. When the student pushes the box at constant speed, the pushing force is real. But so is friction — acting backward. To keep the box moving at constant speed (not accelerating), the forces must be BALANCED: push force = friction force. The student is providing force NOT to maintain motion itself, but to overcome friction which is trying to stop the motion. If friction didn't exist (imagine a frictionless ice rink), pushing the box once and letting go would result in it gliding forever. Newton's framework says: motion is natural; what needs explaining is deceleration (stopping), which requires an unbalanced force (friction). Aristotle never realized friction was secretly doing the stopping.",
      explanation:
        "The key is identifying that the student is unintentionally proving Newton right: a force IS needed to push the box — but only to overcome friction, not to 'sustain' motion itself.",
    },
    {
      id: "t2q17",
      type: "thinking",
      points: 25,
      question:
        "HOTS: In a rotating space station designed to simulate gravity, astronauts stand on the inside of the outer wall. If an astronaut releases a ball, the ball appears to 'fall' to the floor. But does the First Law apply here? Explain what is really happening.",
      correctAnswer:
        "This is an excellent example of an accelerating (non-inertial) reference frame. Inside the rotating station, the First Law appears to be violated — the ball seems to 'fall' without any real downward force. What is actually happening: when the astronaut releases the ball, it has a tangential velocity (it was spinning with the station). Once released, with no more centripetal force from the astronaut's hand, the ball's inertia of direction kicks in — it moves in a straight line (tangent to the circle) per Newton's First Law. Meanwhile, the station's floor curves toward the ball. From the astronaut's perspective inside the rotating frame, the ball appears to 'fall' outward. In reality, the ball is moving straight (First Law obeyed in the inertial frame) while the station rotates around it. The apparent 'gravity' in a space station is an artifact of rotation — not real gravitational force.",
      explanation:
        "This is a high-level application requiring understanding of rotating frames, inertia of direction, and the distinction between real forces and fictitious forces.",
    },
    {
      id: "t2q18",
      type: "thinking",
      points: 25,
      question:
        "HOTS: If all friction were removed from the Earth (roads, shoes, everything), would Newton's First Law be a problem or a blessing for life? Think about the consequences.",
      correctAnswer:
        "It would be catastrophically problematic. Newton's First Law says objects maintain their state unless an unbalanced force acts. With no friction: 1. You could not walk — your feet push backward on the ground; friction pushes your feet forward. Without friction, you'd have nothing to push against. 2. Vehicles couldn't accelerate or brake. 3. Everything placed on a slope would slide forever. 4. You couldn't pick anything up reliably — objects would slide from your hands. 5. Writing would be impossible — pens need friction with paper. However, the First Law itself isn't the problem — inertia would still exist. The problem is losing friction, which is the very force that allows us to START motion, STOP motion, and CHANGE DIRECTION intentionally. Newton's First Law is neither a blessing nor a curse — it describes reality. Friction is what makes controllable life possible on Earth.",
      explanation:
        "This creative synthesis requires understanding that friction is essential for VOLUNTARY motion changes. Newton's First Law would make everything stay as it is — but without friction, that 'as it is' would be completely chaotic.",
    },
    {
      id: "t2q19",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A magician pulls a tablecloth very quickly from under dishes. A slower pull would drag the dishes off the table. Explain this difference using Newton's First Law and the concept of impulse (force × time).",
      correctAnswer:
        "Both pulls involve friction between cloth and dishes. The key difference is TIME. SLOW PULL: The cloth moves slowly, meaning there is prolonged contact time between cloth and dishes. Friction acts for a long time = large impulse (force × time) = large change in momentum = the dishes move significantly and may fall off. FAST PULL: The cloth moves very quickly, meaning the contact time is very short. Even though the same friction force acts, it acts for a very short time = small impulse = very small change in momentum = dishes barely move. Newton's First Law (inertia of rest) means the dishes resist moving. The fast-pull technique exploits this: by minimizing the time friction can act, the impulse given to the dishes is too small to overcome their inertia significantly. Speed of execution is what makes the trick work.",
      explanation:
        "The concept of impulse (F × t) is key. Slow vs. fast pull = same force but different time = different impulse = different momentum change. Inertia of rest resists the small impulse of the fast pull.",
    },
    {
      id: "t2q20",
      type: "thinking",
      points: 25,
      question:
        "HOTS: Why is it harder to stop a rolling bowling ball than a rolling tennis ball moving at the same speed? And why does a heavier person walking slowly sometimes have more momentum than a lighter person running? Explain using inertia and momentum.",
      correctAnswer:
        "BOWLING VS TENNIS BALL: Both balls move at the same speed, but the bowling ball has far greater mass → greater inertia of motion → resists deceleration far more. To stop each ball in the same distance, you'd need to apply a much larger force to the bowling ball. The bowling ball's kinetic energy (½mv²) is also far greater since m is larger. HEAVY PERSON WALKING vs LIGHT PERSON RUNNING: Momentum = mass × velocity. A very heavy person (e.g., 120 kg) walking slowly (1 m/s) has momentum = 120 kg·m/s. A lighter person (60 kg) jogging at 1.5 m/s has momentum = 90 kg·m/s. The heavy slow person wins! This shows that both mass and velocity contribute to momentum — and a large enough mass can compensate for low velocity. This is why large trucks have speed limits much lower than cars — even at lower speeds, their enormous mass gives them dangerous momentum.",
      explanation:
        "Two-part answer. Part 1: inertia resists stopping (mass dependent, speed equal). Part 2: momentum = mv — shows mass can dominate velocity in determining momentum.",
    },
  ],
};
