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

![Voyager spacecraft — Newton's First Law in deep space](https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80)

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

![Inertia of Rest — Coins on a Card](https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80)


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

![Seatbelt Safety — Inertia of Motion](https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80)


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

    /* ══════════════════════════════════════════
     *  5 MORE MCQ QUESTIONS (Total: 10 MCQ)
     * ══════════════════════════════════════════ */
    {
      id: "t2q21",
      type: "mcq",
      points: 10,
      question:
        "A passenger in a moving car leans to the right when the car takes a sharp left turn. This is an example of:",
      options: [
        "Inertia of rest",
        "Inertia of motion",
        "Inertia of direction",
        "Gravitational pull",
      ],
      correctAnswer: "Inertia of direction",
      explanation:
        "The passenger's body was moving in a straight line. When the car turns left, the body resists the change in direction and continues straight — appearing to lean right relative to the car. This is inertia of direction.",
    },
    {
      id: "t2q22",
      type: "mcq",
      points: 10,
      question:
        "According to Newton's First Law, a book lying on a table will remain at rest because:",
      options: [
        "The forces acting on it are unbalanced",
        "No forces act on it",
        "The net external force on it is zero",
        "Gravity is not acting on it",
      ],
      correctAnswer: "The net external force on it is zero",
      explanation:
        "Forces DO act on the book — gravity pulls it down and the table pushes it up. But these forces are equal and opposite, making the net force zero. By Newton's First Law, zero net force means the book stays at rest.",
    },
    {
      id: "t2q23",
      type: "mcq",
      points: 10,
      question:
        "Which of the following has the GREATEST inertia?",
      options: [
        "A cricket ball (160 g)",
        "A football (450 g)",
        "A bowling ball (6 kg)",
        "A table tennis ball (3 g)",
      ],
      correctAnswer: "A bowling ball (6 kg)",
      explanation:
        "Inertia is directly proportional to mass. The bowling ball at 6 kg has the greatest mass, so it has the greatest inertia. It would require the most force to start moving or to stop once moving.",
    },
    {
      id: "t2q24",
      type: "mcq",
      points: 10,
      question:
        "When you shake a wet umbrella, water drops fly off. This happens because of:",
      options: [
        "Gravity pulling the drops down",
        "Inertia of motion — drops continue moving when umbrella stops/changes direction",
        "Air pushing the drops away",
        "Electric charge on the umbrella",
      ],
      correctAnswer: "Inertia of motion — drops continue moving when umbrella stops/changes direction",
      explanation:
        "When you shake the umbrella rapidly, the umbrella changes direction quickly. The water drops, due to their inertia of motion, continue moving in the original direction and detach from the umbrella surface.",
    },
    {
      id: "t2q25",
      type: "mcq",
      points: 10,
      question:
        "Newton's First Law is valid only in:",
      options: [
        "Any reference frame",
        "Inertial reference frames (non-accelerating frames)",
        "Only on Earth's surface",
        "Only in space with zero gravity",
      ],
      correctAnswer: "Inertial reference frames (non-accelerating frames)",
      explanation:
        "Newton's laws apply in inertial frames — frames that are not accelerating. If you're in an accelerating car or a spinning carousel, you observe 'fictitious forces' that seem to violate the First Law. On solid ground (approximately inertial), the laws work perfectly.",
    },

    /* ══════════════════════════════════════════
     *  5 MORE SHORT ANSWER (Total: 10 Short)
     * ══════════════════════════════════════════ */
    {
      id: "t2q26",
      type: "short",
      points: 15,
      question:
        "Why do dust particles come out of a carpet when it is beaten with a stick?",
      correctAnswer:
        "When the carpet is beaten with a stick, the carpet fibers suddenly move forward due to the force of the stick. However, the dust particles lodged in the carpet have inertia of rest — they resist the sudden motion and tend to stay in their original position. As the carpet moves forward rapidly while the dust stays behind, the dust separates from the carpet and falls out.",
      explanation:
        "Classic inertia of rest example. The carpet moves (force applied), but the dust resists the change and stays put, effectively separating from the carpet.",
    },
    {
      id: "t2q27",
      type: "short",
      points: 15,
      question:
        "A bullet fired from a gun hits a glass window and makes a clean hole. But a stone thrown at the same window shatters it. Why?",
      correctAnswer:
        "The bullet moves extremely fast and the contact time with the glass is incredibly short. Due to inertia of rest, only the small area of glass in direct contact with the bullet is affected — it gets pushed through before the rest of the glass has time to respond. The surrounding glass stays in place. The stone moves much slower, so the contact time is longer. The force spreads across a large area of the glass, giving the whole pane time to respond. The entire sheet of glass absorbs the force and shatters.",
      explanation:
        "This is about inertia of rest + contact time. Fast impact = short time = only local area affected. Slow impact = longer time = force spreads = entire pane breaks.",
    },
    {
      id: "t2q28",
      type: "short",
      points: 15,
      question:
        "Give two examples of inertia of direction from daily life.",
      correctAnswer:
        "1. When a car takes a sharp turn to the left, passengers inside feel pushed to the right. Their bodies were moving straight ahead (inertia of direction) and resist the change in direction caused by the turning car. 2. When a spinning disc attached to a motor is suddenly stopped, loose particles on the disc fly off tangentially. The particles were moving in circles, and when released from the circular constraint, their inertia of direction sends them in straight lines tangent to the circle.",
      explanation:
        "Both examples show objects continuing in a straight line when the force maintaining circular/curved motion is removed or when the reference frame changes direction.",
    },
    {
      id: "t2q29",
      type: "short",
      points: 15,
      question:
        "A cyclist has to apply brakes well before the stopping point. Why can't the cyclist stop instantly?",
      correctAnswer:
        "The cyclist and bicycle have inertia of motion — they resist any change in their forward motion. Due to this inertia, even after applying brakes, the bicycle continues to move forward for some distance before stopping. The mass (of cyclist + bicycle) determines the inertia, and the friction force from brakes determines the deceleration. Greater mass or higher speed means more inertia and a longer stopping distance. This is why cyclists must apply brakes early.",
      explanation:
        "Inertia of motion means moving objects resist stopping. The stopping distance depends on speed and mass. Professional cyclists at high speeds need significant braking distance.",
    },
    {
      id: "t2q30",
      type: "short",
      points: 15,
      question:
        "Explain why it is easier to push an empty shopping cart than a fully loaded one.",
      correctAnswer:
        "An empty shopping cart has less mass, so it has less inertia — it resists changes in motion less. A fully loaded cart has much more mass, giving it much greater inertia. To accelerate the loaded cart from rest, you need to apply a larger force to overcome its greater inertia. Similarly, the loaded cart is harder to stop or change direction once moving. The relationship is: more mass = more inertia = more force needed for the same acceleration.",
      explanation:
        "This directly illustrates the relationship between mass and inertia. F = ma: for the same acceleration, more mass requires more force.",
    },

    /* ══════════════════════════════════════════
     *  5 MORE LONG ANSWER (Total: 10 Long)
     * ══════════════════════════════════════════ */
    {
      id: "t2q31",
      type: "long",
      points: 20,
      question:
        "Describe in detail how Newton's First Law applies to space travel. Why can spacecraft travel for millions of kilometers without fuel? What would happen if the First Law were not true?",
      correctAnswer:
        "Newton's First Law states that an object in motion continues at constant velocity unless acted upon by an unbalanced force. In space, this has profound implications:\n\n**Why spacecraft travel without fuel:** Once a spacecraft reaches its desired velocity (using rocket engines), it can shut off its engines completely. In the vacuum of space, there is no air resistance, no friction, and negligible gravitational drag (in deep space). With essentially zero external unbalanced forces, the spacecraft continues at constant velocity indefinitely. Voyager 1 has been traveling for 49+ years without engines, covering over 24 billion kilometers!\n\n**Fuel usage in space:** Fuel is needed only for (1) initial acceleration from Earth, (2) course corrections (changing direction), and (3) slowing down at the destination. The coasting phase between planets needs zero fuel.\n\n**If the First Law were not true:** If objects naturally slowed down in space (like Aristotle thought), spacecraft would need to carry fuel for the entire journey — not just for launch and landing. The amount of fuel required would be enormous (millions of times more), making interplanetary travel practically impossible with current technology. Mars missions, asteroid visits, and deep space exploration would all be impossible.\n\n**Real-world example:** The New Horizons probe took 9.5 years to reach Pluto (about 5 billion km). Its engine fired for only a few minutes during the entire journey — the rest was pure coasting due to Newton's First Law.",
      explanation:
        "Space travel is the ultimate real-world application of Newton's First Law. The near-absence of friction in space allows the law to manifest perfectly, enabling long-distance travel with minimal fuel.",
    },
    {
      id: "t2q32",
      type: "long",
      points: 20,
      question:
        "Explain in detail all the safety features in a car that are designed based on Newton's First Law and the concept of inertia. Describe at least four features.",
      correctAnswer:
        "**1. Seatbelts:** During a collision, the car stops suddenly but the passenger's body continues forward due to inertia of motion. The seatbelt applies a backward restraining force across the chest and hips, decelerating the passenger with the car. Without it, the passenger would hit the dashboard or windshield at the car's original speed.\n\n**2. Headrests:** In a rear-end collision, the car is pushed forward suddenly. The seat pushes the torso forward, but the head (connected by the flexible neck) lags behind due to inertia of rest. This can cause severe whiplash neck injuries. The headrest catches the head and pushes it forward with the body, preventing hyperextension.\n\n**3. Airbags:** When a crash occurs, the passenger's body surges forward (inertia of motion). The airbag inflates in milliseconds, providing a large, soft cushion. Instead of hitting the hard steering wheel, the passenger's head and chest hit the soft airbag, which spreads the decelerating force over a larger area and a longer time — reducing the peak force on the body.\n\n**4. Crumple zones:** The front and rear of the car are designed to crumple (deform) during a collision. This crumpling extends the time over which the car decelerates. A longer deceleration time means a smaller deceleration force on the passengers (impulse = force × time). Without crumple zones, the car would stop almost instantly, creating enormous forces on passengers.\n\n**5. Anti-lock Braking System (ABS):** During hard braking, wheels can lock up and slide. ABS rapidly pulses the brakes to prevent locking, maintaining friction between tires and road. This relates to inertia because locked wheels have less control — the car's inertia carries it forward in a skid rather than controlled deceleration.",
      explanation:
        "All these safety features address the same fundamental problem: inertia makes passengers continue at the car's original velocity during a crash. Each feature provides a controlled way to decelerate passengers safely.",
    },
    {
      id: "t2q33",
      type: "long",
      points: 20,
      question:
        "Compare and contrast Aristotle's and Newton's understanding of motion. Why was Newton correct and Aristotle wrong? Give evidence that supports Newton's view.",
      correctAnswer:
        "**Aristotle's View (4th century BC):**\n- Natural state of objects is REST\n- Objects move only when a force acts on them\n- Heavier objects fall faster than lighter ones\n- Objects stop when the force is removed\n- This was based on everyday observation without controlled experiments\n\n**Newton's View (17th century AD):**\n- Both rest AND uniform motion are natural states\n- Objects change their motion only when an unbalanced force acts\n- In vacuum, all objects fall at the same rate regardless of mass\n- Objects stop on Earth because friction acts — not because motion is unnatural\n- Based on rigorous mathematical analysis and controlled experiments\n\n**Why Newton was correct:**\n\n*Evidence 1 — Galileo's inclined planes:* Smoother surfaces allowed balls to roll longer distances. Extrapolating to zero friction → infinite motion. This directly contradicts Aristotle.\n\n*Evidence 2 — Space probes:* Voyager 1 moves through space without engines for decades. No friction = no stopping. Aristotle cannot explain this.\n\n*Evidence 3 — Apollo 15 hammer-feather drop:* On the Moon (no air), a hammer and feather dropped simultaneously hit the ground at the same time — disproving Aristotle's claim that heavier objects fall faster.\n\n*Evidence 4 — Ice hockey puck:* On smooth ice, a puck glides far with minimal deceleration. Reduce friction more → it glides even farther. This supports Newton, not Aristotle.\n\n**Aristotle's fundamental error:** He didn't account for friction as a separate force. He saw objects stopping and concluded motion was unnatural, rather than recognizing that friction was the cause of stopping.",
      explanation:
        "This historical comparison is important for understanding how scientific understanding evolves. Aristotle's views dominated for 2000 years until Galileo and Newton provided better explanations backed by evidence.",
    },
    {
      id: "t2q34",
      type: "long",
      points: 20,
      question:
        "Explain with a detailed example why heavy objects seem harder to set in motion AND harder to stop once moving. How does this relate to mass, inertia, and Newton's First Law?",
      correctAnswer:
        "**Example: Pushing a car vs. pushing a bicycle from rest on a flat road.**\n\n**Starting from rest (inertia of rest):**\nBicycle mass: ~15 kg. Car mass: ~1500 kg. If you push both with 100 N of force:\n- Bicycle acceleration = F/m = 100/15 = 6.67 m/s² (starts moving easily)\n- Car acceleration = F/m = 100/1500 = 0.067 m/s² (barely moves)\n\nThe car has 100 times more mass → 100 times more inertia of rest → resists starting motion 100 times more. You'd need 100× the force to accelerate the car at the same rate as the bicycle.\n\n**Stopping once moving (inertia of motion):**\nBoth moving at 10 m/s. Apply 200 N braking force:\n- Bicycle deceleration = 200/15 = 13.3 m/s² → stops in about 0.75 seconds\n- Car deceleration = 200/1500 = 0.133 m/s² → takes about 75 seconds to stop!\n\nThe car's greater mass means greater inertia of motion — it resists the change from moving to rest much more strongly.\n\n**Connection to Newton's First Law:**\nThe First Law says objects resist changes in their state of motion. This resistance (inertia) is proportional to mass. Heavy objects have more inertia, so they require more force (or more time) to change their state — whether starting from rest or stopping from motion. Mass is literally the measure of how much an object 'fights back' against changes.\n\n**Real-world importance:** This is why fully loaded trucks need much longer braking distances than empty cars. It's also why train engineers start braking kilometers before the station — trains have enormous mass and enormous inertia.",
      explanation:
        "This question builds deep intuition about the mass-inertia relationship using concrete numerical examples. The F = ma calculation makes the concept quantitative rather than just qualitative.",
    },
    {
      id: "t2q35",
      type: "long",
      points: 20,
      question:
        "What are inertial and non-inertial reference frames? Give examples of each and explain why Newton's First Law appears to be violated in non-inertial frames.",
      correctAnswer:
        "**Inertial Reference Frame:** A reference frame that is either stationary or moving at constant velocity (not accelerating). Newton's laws work perfectly in these frames.\n\nExamples:\n- Standing on solid ground (approximately inertial)\n- Sitting in a train moving at constant speed on a straight track\n- A laboratory on a space station moving at constant velocity\n\n**Non-Inertial Reference Frame:** A reference frame that is accelerating (speeding up, slowing down, or changing direction). Newton's laws appear to be violated in these frames — objects seem to experience mysterious forces.\n\nExamples:\n- Inside an accelerating car (you feel pushed back into the seat)\n- Inside a turning bus (you feel pushed outward)\n- On a spinning merry-go-round (you feel pushed outward — centrifugal 'force')\n\n**Why the First Law seems violated:**\nIn a non-inertial frame, objects appear to accelerate without any visible force acting on them. For example, in a braking bus, a ball on the floor rolls forward — but nothing pushed it. In reality, the ball is obeying Newton's First Law perfectly (continuing at constant velocity in the inertial frame). It's the BUS that is decelerating (non-inertial frame), making the ball appear to accelerate relative to the bus.\n\nTo 'fix' Newton's laws in non-inertial frames, physicists introduce fictitious forces (pseudo-forces) like the centrifugal force. These aren't real forces — they're mathematical corrections that make the laws work in accelerating frames.\n\n**For Class 9:** Always work in the inertial frame (ground level) unless specifically asked about non-inertial frames.",
      explanation:
        "This is an advanced topic but important for complete understanding. The distinction between inertial and non-inertial frames explains many confusing everyday experiences like feeling pushed in turning cars.",
    },

    /* ══════════════════════════════════════════
     *  5 MORE THINKING/HOTS (Total: 10 HOTS)
     * ══════════════════════════════════════════ */
    {
      id: "t2q36",
      type: "thinking",
      points: 25,
      question:
        "HOTS: If Newton's First Law says that objects in motion stay in motion forever without force, then why does the Moon not fly off into space? It's moving, but it stays near Earth. Does this violate the First Law?",
      correctAnswer:
        "This does NOT violate the First Law! The key is understanding what 'stays in motion' means precisely.\n\nNewton's First Law says objects continue in **uniform motion** (constant speed in a straight line) without force. The Moon is NOT in uniform motion — it's constantly changing direction (moving in a circle/ellipse around Earth). A change in direction IS a change in velocity (even if speed stays the same), which IS acceleration.\n\nWhat's causing this acceleration? **Earth's gravitational force!** Gravity is the unbalanced external force that continuously pulls the Moon toward Earth, bending its otherwise straight-line path into a circular orbit.\n\nIf gravity suddenly disappeared, the Moon WOULD fly off in a straight line — exactly as the First Law predicts. The Moon's natural tendency (inertia of direction) is to go straight. Gravity constantly fights this tendency, curving its path into an orbit.\n\nSo the Moon's orbital motion is actually a PERFECT demonstration of the First Law:\n- Without force → straight line (which the Moon would follow if gravity vanished)\n- With unbalanced force (gravity) → curved path (the orbit we observe)\n\nThe First Law is not violated — it's beautifully confirmed!",
      explanation:
        "Orbital motion often confuses students because the Moon 'keeps going' but also 'stays near Earth.' The resolution is that gravity is an ever-present unbalanced force changing the Moon's direction continuously.",
    },
    {
      id: "t2q37",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A clever student argues: 'Newton's First Law is useless because it's just a special case of the Second Law (F=ma). When F=0, a=0, which is the First Law. So why do we need a separate law?' Is the student correct? Defend or refute this argument.",
      correctAnswer:
        "The student's mathematical observation is technically correct: setting F=0 in F=ma gives a=0, which describes the First Law's scenario. However, the student is WRONG to call the First Law 'useless.' Here's why:\n\n**1. The First Law establishes the concept of inertial frames.** Before we can use F=ma, we need to know WHICH reference frames are valid for applying Newton's laws. The First Law defines this: inertial frames are those where objects with zero net force have zero acceleration. Without the First Law, we wouldn't know where F=ma is valid.\n\n**2. The First Law challenges our intuition.** It's not obvious that objects maintain constant velocity without force. Aristotle got it wrong for 2000 years! The First Law explicitly states this counterintuitive fact, while the Second Law buries it in a formula.\n\n**3. Historical importance.** The First Law overturned millennia of wrong thinking about motion. It deserves recognition as a separate, foundational principle.\n\n**4. The First Law defines force.** It tells us what force does (changes motion) by telling us what happens without force (motion stays constant). This is the conceptual foundation that makes F=ma meaningful.\n\nSo while mathematically F=0 in F=ma reproduces the First Law, the First Law carries deeper conceptual, definitional, and philosophical weight that makes it far more than a 'special case.'",
      explanation:
        "This is a genuinely deep philosophical question about the structure of Newtonian mechanics. The First Law is not just a formula — it's a conceptual framework that defines the arena (inertial frames) in which physics operates.",
    },
    {
      id: "t2q38",
      type: "thinking",
      points: 25,
      question:
        "HOTS: Imagine you're inside a closed room (with no windows) on a smooth train. The train is moving at a constant 200 km/h. Can you design any experiment INSIDE the room to determine whether the train is moving or stationary? What does this tell you about Newton's First Law?",
      correctAnswer:
        "**You CANNOT determine whether the train is moving at constant velocity or is stationary!** No experiment performed inside the closed room can distinguish between the two states. This is a profound consequence of Newton's First Law.\n\n**Why not:** In both cases (stationary or constant velocity), the net force on everything inside the room is zero. A ball placed on the floor stays still. A pendulum hangs straight down. A glass of water sits level. Everything behaves identically because the physics of zero acceleration is the same whether v=0 or v=200 km/h.\n\n**Experiments that DON'T work:**\n- Drop a ball → it falls straight down in both cases (the ball has the same horizontal velocity as the train)\n- Throw a ball forward → it travels the same distance as throwing backward\n- Check a pendulum → hangs vertically in both cases\n- Toss a coin → goes straight up and comes straight back down\n\n**What this means:** Newton's First Law tells us that rest and constant velocity are fundamentally equivalent states — you cannot tell them apart from inside the system. This is actually the principle of Galilean relativity, which later inspired Einstein's Special Theory of Relativity!\n\n**When CAN you tell you're moving?** Only when the train ACCELERATES (speeds up, slows down, or turns). Then you feel pushed (pseudo-forces in a non-inertial frame) — objects slide, pendulums deflect, water tilts. Acceleration breaks the symmetry between motion and rest.",
      explanation:
        "This thought experiment reveals the deep symmetry between rest and uniform motion — they are physically identical. This principle of relativity is one of the most profound ideas in all of physics.",
    },
    {
      id: "t2q39",
      type: "thinking",
      points: 25,
      question:
        "HOTS: Why do fast bowlers in cricket take a long run-up before bowling? Why don't they just stand at the crease and throw? Explain using Newton's First Law and inertia.",
      correctAnswer:
        "Fast bowlers take a long run-up for several physics reasons, all related to inertia and Newton's First Law:\n\n**1. Building momentum through inertia of motion:** During the run-up, the bowler accelerates to high speed (typically 25-30 km/h). At the point of delivery, both the bowler's body and the ball (held in their hand) are already moving forward at this speed. The ball inherits this forward velocity through inertia of motion.\n\n**2. Adding arm speed to running speed:** When the bowler's arm swings during delivery, the ball's final speed = arm delivery speed + running speed. A bowler running at 30 km/h who delivers the ball with an arm speed of 120 km/h gets a ball speed of about 150 km/h. Standing still, they'd only get 120 km/h. The run-up adds 30+ km/h for 'free' through inertia.\n\n**3. Inertia of motion as energy storage:** The run-up is essentially converting the bowler's chemical energy (muscles) into kinetic energy over a sustained period. At delivery, this accumulated kinetic energy is transferred to the ball. It's like winding up a spring — the run-up 'winds up' the bowler's momentum.\n\n**4. Newton's First Law application:** Once the ball leaves the bowler's hand, there's no more muscular force on it. The ball continues at the release speed due to inertia of motion (First Law). The higher the release speed (achieved through run-up + arm speed), the more dangerous the delivery.\n\n**Why not stand and throw?** Standing bowlers can only generate arm speed. They miss the 25-30 km/h bonus from running. This makes the delivery significantly slower and easier for the batsman to play. Physics dictates that run-up = faster ball!",
      explanation:
        "Cricket bowling is a beautiful real-world example of how inertia of motion allows velocity to be accumulated and transferred. The run-up exploits the First Law: the ball inherits the bowler's forward velocity.",
    },
    {
      id: "t2q40",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A student says 'An object always moves in the direction of the net force acting on it.' Is this statement always true? Give a counter-example and explain using Newton's Laws.",
      correctAnswer:
        "This statement is **FALSE!** An object does NOT always move in the direction of the net force. An object ACCELERATES in the direction of the net force, but its VELOCITY (direction of motion) can be different.\n\n**Counter-example 1 — Ball thrown upward:**\nJust after throwing a ball upward, the ball is moving UPWARD, but the only force (gravity) acts DOWNWARD. The net force (downward) and the motion (upward) are in opposite directions! The ball's velocity is upward but decreasing (decelerating), and the acceleration is downward (matching the force direction).\n\n**Counter-example 2 — Circular motion (Moon):**\nThe Moon moves tangentially (roughly sideways), but the gravitational force points toward Earth (inward, perpendicular to motion). The net force and the velocity are at right angles to each other!\n\n**Counter-example 3 — Car braking:**\nA car braking is still moving forward, but the friction force from brakes acts backward. Again, motion and force are in opposite directions.\n\n**The correct statement should be:** 'An object always ACCELERATES in the direction of the net force acting on it.' Velocity can be in any direction — it depends on the object's history of motion. Force determines the direction of acceleration (change in velocity), not the direction of velocity itself.\n\n**Newton's Second Law (F = ma):** Force = mass × acceleration. Force determines acceleration, not velocity. This is a critical distinction that many students confuse.",
      explanation:
        "This is a crucial conceptual clarification. Force → acceleration (not velocity). Velocity and acceleration can be in completely different directions. Confusing these leads to fundamental errors in physics problem-solving.",
    },

    /* ══════════════════════════════════════════
     *  10 ADDITIONAL MCQ — NUMERICAL & ADVANCED (t2q41–t2q50)
     * ══════════════════════════════════════════ */
    {
      id: "t2q41",
      type: "mcq",
      points: 10,
      question:
        "A 4 kg block moves at 12 m/s on a frictionless surface. What net force is needed to maintain this velocity?",
      options: ["48 N", "12 N", "4 N", "0 N"],
      correctAnswer: "0 N",
      explanation:
        "Newton's First Law: an object in motion on a frictionless surface (no unbalanced force) continues at constant velocity. Zero net force is needed to maintain constant velocity — not 4 N, not 12 N. This is the single most important concept in the First Law.",
    },
    {
      id: "t2q42",
      type: "mcq",
      points: 10,
      question:
        "A 10 kg object at rest has a force of 50 N applied for 4 seconds, then removed. What is the object's velocity after the force is removed (assuming no friction)?",
      options: ["0 m/s — it stops when force is removed", "20 m/s — it maintains this velocity", "5 m/s", "50 m/s"],
      correctAnswer: "20 m/s — it maintains this velocity",
      explanation:
        "During force: a = F/m = 50/10 = 5 m/s². After 4 s: v = at = 5 × 4 = 20 m/s. After force removed: Newton's First Law → object maintains 20 m/s (no friction, no unbalanced force). It does NOT stop when force is removed — a common misconception!",
    },
    {
      id: "t2q43",
      type: "mcq",
      points: 10,
      question:
        "Which has more inertia: a 400 g cricket ball moving at 150 km/h, or a 5 kg medicine ball at rest?",
      options: [
        "Cricket ball — it has higher velocity",
        "Medicine ball — inertia depends on mass only",
        "Both have equal inertia",
        "Cricket ball — moving objects have more inertia than resting ones",
      ],
      correctAnswer: "Medicine ball — inertia depends on mass only",
      explanation:
        "Inertia depends ONLY on mass, not on velocity or kinetic energy. The medicine ball at 5 kg has far more inertia than the cricket ball at 0.4 kg. This is a very common misconception — students often confuse momentum (mass × velocity) with inertia.",
    },
    {
      id: "t2q44",
      type: "mcq",
      points: 10,
      question:
        "A ball is rolling on a rough floor and gradually slows down. This is because:",
      options: [
        "The ball naturally wants to slow down (objects prefer rest)",
        "Friction is an unbalanced force opposing motion and causing deceleration",
        "Gravity pulls the ball backward",
        "The ball's inertia reverses over time",
      ],
      correctAnswer:
        "Friction is an unbalanced force opposing motion and causing deceleration",
      explanation:
        "The ball slows down because friction acts as an unbalanced external force opposing motion. Without friction (e.g., on a perfectly smooth surface or in space), the ball would roll forever — Newton's First Law. The ball does NOT 'naturally' want to stop.",
    },
    {
      id: "t2q45",
      type: "mcq",
      points: 10,
      question:
        "You push a 5 kg box and a 25 kg box for 3 seconds with the same force of 50 N (no friction). Which box has more inertia? Which has higher velocity after 3 seconds?",
      options: [
        "Same inertia; same velocity because same force applied",
        "25 kg box has more inertia; 5 kg box has higher velocity (a = F/m)",
        "5 kg box has more inertia; 25 kg box has higher velocity",
        "Same inertia; 25 kg box has higher velocity because it's heavier",
      ],
      correctAnswer:
        "25 kg box has more inertia; 5 kg box has higher velocity (a = F/m)",
      explanation:
        "Inertia ∝ mass → 25 kg box has 5× more inertia. For 5 kg: a = 50/5 = 10 m/s², v = 30 m/s. For 25 kg: a = 50/25 = 2 m/s², v = 6 m/s. Same force produces lower acceleration (and velocity) in the more massive (higher inertia) object.",
    },
    {
      id: "t2q46",
      type: "mcq",
      points: 10,
      question:
        "A passenger standing on a bus reaches up to hold the overhead strap. When the bus brakes suddenly, the passenger swings forward. What is the correct force analysis?",
      options: [
        "A forward force from the bus floor pushes the passenger forward",
        "The passenger's inertia of motion causes them to continue forward while the bus decelerates — no actual forward force acts on the passenger",
        "Gravity pulls the passenger forward during braking",
        "The overhead strap pulls the passenger forward",
      ],
      correctAnswer:
        "The passenger's inertia of motion causes them to continue forward while the bus decelerates — no actual forward force acts on the passenger",
      explanation:
        "No actual forward force pushes the passenger forward. The passenger's body had forward velocity (matching the bus). When the bus brakes, friction decelerates the bus quickly but the passenger's body (via the strap) takes longer to decelerate. The body's inertia of motion makes it continue forward relative to the decelerating bus.",
    },
    {
      id: "t2q47",
      type: "mcq",
      points: 10,
      question:
        "A satellite orbits Earth at constant speed. Which statement is correct?",
      options: [
        "No force acts on it — First Law applies (constant velocity = no force)",
        "Gravity acts as an unbalanced centripetal force — it changes direction, so velocity changes, so First Law doesn't apply",
        "Rocket engines keep it moving at constant speed",
        "Inertia balances gravity perfectly — net force = 0",
      ],
      correctAnswer:
        "Gravity acts as an unbalanced centripetal force — it changes direction, so velocity changes, so First Law doesn't apply",
      explanation:
        "Constant speed ≠ constant velocity. The satellite changes direction continuously (circular motion). A change in direction is a change in velocity (acceleration), which requires an unbalanced force. That force is Earth's gravity (centripetal force). The First Law would only apply if the satellite moved in a straight line at constant speed.",
    },
    {
      id: "t2q48",
      type: "mcq",
      points: 10,
      question:
        "Galileo performed experiments on inclined planes to study motion. What was his key insight that led Newton to formulate the First Law?",
      options: [
        "Heavier objects roll down faster than lighter ones",
        "On smoother surfaces, objects rolled farther — implying that in the absence of friction, objects would roll forever",
        "Objects always stop at the bottom of the incline",
        "Friction increases with steeper angles",
      ],
      correctAnswer:
        "On smoother surfaces, objects rolled farther — implying that in the absence of friction, objects would roll forever",
      explanation:
        "Galileo's critical observation: as surfaces got smoother, balls rolled farther and farther before stopping. He extrapolated to the ideal case of zero friction: the ball would roll forever. This directly inspired Newton's First Law — not friction, but the absence of external force, is the natural condition for continued motion.",
    },
    {
      id: "t2q49",
      type: "mcq",
      points: 10,
      question:
        "A 2000 kg truck moving at 20 m/s and a 500 kg car moving at 20 m/s both brake to rest. The same braking force F is applied to both. Which takes longer to stop?",
      options: [
        "Both take equal time — they have equal speed",
        "The car takes longer — it has less mass",
        "The truck takes longer — it has more inertia (mass), so same force produces less deceleration",
        "Both take the same time because same force is applied",
      ],
      correctAnswer:
        "The truck takes longer — it has more inertia (mass), so same force produces less deceleration",
      explanation:
        "Truck: a = F/2000. Car: a = F/500 = 4× more deceleration. Time to stop: t = v/a. Truck: t = 20/(F/2000) = 40000/F. Car: t = 20/(F/500) = 10000/F. Truck takes 4× longer. Greater mass → greater inertia → same force produces less deceleration → longer stopping time.",
    },
    {
      id: "t2q50",
      type: "mcq",
      points: 10,
      question:
        "A stone tied to a string is swung in a horizontal circle. The string breaks. Where does the stone go?",
      options: [
        "It continues in a circle due to centrifugal force",
        "It flies outward radially (directly away from the center)",
        "It flies off tangentially in a straight line — inertia of direction",
        "It falls straight down due to gravity",
      ],
      correctAnswer:
        "It flies off tangentially in a straight line — inertia of direction",
      explanation:
        "The stone was moving tangentially (sideways to the radius). When the string breaks, the centripetal force is gone. The stone's inertia of direction causes it to continue in a straight line tangent to the circle at the break point. Gravity eventually curves it downward, but the initial direction is tangential. This is a classic demonstration of inertia of direction.",
    },

    /* ══════════════════════════════════════════
     *  5 SHORT NUMERICAL ANSWERS (t2q51–t2q55)
     * ══════════════════════════════════════════ */
    {
      id: "t2q51",
      type: "short",
      points: 15,
      question:
        "A 1200 kg car is traveling at 72 km/h on a level road. The engine is switched off. If friction provides 400 N of retardation, how long does the car take to come to rest? How far does it travel before stopping?",
      correctAnswer:
        "First convert velocity: 72 km/h = 72 × (1000/3600) = 20 m/s.\n\nDeceleration: a = F/m = 400/1200 = 1/3 m/s²\n\nTime to stop (v = u − at → 0 = 20 − (1/3)t):\nt = 20 / (1/3) = **60 seconds**\n\nDistance (v² = u² − 2as → 0 = 400 − 2 × (1/3) × s):\ns = 400 / (2/3) = **600 m**\n\nAfter engine cuts off, only friction (unbalanced backward force) acts. Newton's First Law confirms: without this friction, the car would travel 600 m and never stop!",
      explanation:
        "After the engine cuts off, friction is the only horizontal force — an unbalanced backward force causing deceleration. Use v = u + at for time and v² = u² + 2as for distance.",
    },
    {
      id: "t2q52",
      type: "short",
      points: 15,
      question:
        "A bullet of mass 20 g is fired from a rifle of mass 4 kg. The bullet leaves the barrel at 600 m/s. Using the principle related to Newton's First and Third Laws, find the recoil velocity of the rifle (initial momentum = 0).",
      correctAnswer:
        "By conservation of momentum (follows from Newton's Laws): total momentum before = total momentum after.\n\nInitial momentum = 0 (both at rest).\n\nLet rifle recoil velocity = v (backward).\n\n0 = m_bullet × v_bullet + m_rifle × v_rifle\n0 = (0.020 × 600) + (4 × v)\n0 = 12 + 4v\nv = −3 m/s\n\nRifle recoils at **3 m/s** backward.\n\nNewton's First Law connection: before firing, both are at rest (inertia of rest). The explosion provides unbalanced internal force, changing both objects' states of motion. Newton's Third Law ensures equal and opposite impulses on bullet and rifle.",
      explanation:
        "Conservation of momentum is the combined result of Newton's Second and Third Laws. When initial momentum = 0, the two pieces must fly apart with equal and opposite momenta: m₁v₁ = m₂v₂.",
    },
    {
      id: "t2q53",
      type: "short",
      points: 15,
      question:
        "A 60 kg person is in a car moving at 80 km/h. The car hits a wall and stops in 0.1 seconds. What average force does the person experience (without a seatbelt)? Compare this to their body weight.",
      correctAnswer:
        "Convert: 80 km/h = 80/3.6 = 22.2 m/s\n\nDeceleration: a = Δv/t = 22.2 / 0.1 = 222 m/s² (extremely high!)\n\nForce on person = ma = 60 × 222 = **13,333 N**\n\nWeight of person = mg = 60 × 9.8 = 588 N\n\n13,333 / 588 ≈ **22.7 times** their body weight!\n\nThis is why car crashes are so deadly. The person's inertia of motion carries their body forward at 80 km/h while the car stops instantly. Without a seatbelt, the body slams into the dashboard with a force ~23× their body weight. Seatbelts increase the stopping time from 0.1 s to ~0.5 s, reducing the force by 5×.",
      explanation:
        "This calculation reveals why car crashes are so dangerous: the combination of high speed and very short stopping time creates enormous forces on the human body. Seatbelts and airbags work by increasing stopping time (and thus reducing force).",
    },
    {
      id: "t2q54",
      type: "short",
      points: 15,
      question:
        "A 100 g ball is rolling at 5 m/s on a rough floor. A friction force of 0.2 N acts on it. (a) What is the deceleration? (b) How long until it stops? (c) How does this demonstrate Newton's First Law?",
      correctAnswer:
        "**(a) Deceleration:**\na = F/m = 0.2 / 0.1 = **2 m/s²** (deceleration)\n\n**(b) Time to stop:**\nt = v/a = 5 / 2 = **2.5 seconds**\n\n**(c) Newton's First Law demonstration:**\nNewton's First Law states that the ball would continue at 5 m/s forever if NO external unbalanced force acts. But friction IS an external unbalanced force acting backward. This force changes the ball's velocity from 5 m/s to 0 m/s over 2.5 seconds. The ball stops BECAUSE OF friction, not because motion is unnatural. On a frictionless surface (μ = 0), the ball would roll forever — directly demonstrating the First Law.",
      explanation:
        "This calculation demonstrates First Law by contrast: without friction, v stays at 5 m/s forever. With friction (unbalanced force), v decreases. The deceleration is the rate of change caused by the unbalanced force.",
    },
    {
      id: "t2q55",
      type: "short",
      points: 15,
      question:
        "Explain, with the help of Newton's First Law, why a passenger in a bus leans backward when the bus starts moving forward from rest.",
      correctAnswer:
        "**Why passengers lean backward during forward acceleration:**\n\nBefore the bus moves: Passenger and bus are both at rest. The passenger has **inertia of rest** — tendency to remain stationary.\n\nWhen the bus starts moving forward: The bus seat pushes the lower body of the passenger forward (contact force). But the passenger's UPPER BODY and head tend to remain at rest (inertia of rest — Newton's First Law). Since the lower body moves forward but the upper body momentarily stays behind, the passenger **leans backward** relative to the bus.\n\n**Formally:** An external unbalanced force is needed to change a body's state from rest. The seat provides this force to the lower body through friction/contact. The upper body has no direct forward force immediately — inertia keeps it stationary while the rest of the body moves forward.\n\n**How it corrects:** The muscles in the person's back and the fact that the whole body is connected eventually cause the upper body to catch up. But the initial lean is purely inertia of rest in action.",
      explanation:
        "Lean-backward-on-acceleration is the direct physical manifestation of inertia of rest. The body's natural tendency is to remain at rest. The bus applies forward force to the feet/seat contact; the upper body's inertia makes it lag behind momentarily.",
    },

    /* ══════════════════════════════════════════
     *  5 LONG ANSWERS / HOTS (t2q56–t2q60)
     * ══════════════════════════════════════════ */
    {
      id: "t2q56",
      type: "long",
      points: 20,
      question:
        "Explain in detail the physics of how a magician pulls a tablecloth from under dishes without disturbing them. What role does inertia play? What conditions must be met for this to work?",
      correctAnswer:
        "**The Physics Behind the Tablecloth Trick:**\n\nThis classic trick is a perfect demonstration of inertia of rest (Newton's First Law).\n\n**What happens physically:**\nThe tablecloth is pulled away very rapidly. During the brief moment of contact between tablecloth and dishes, the tablecloth exerts a small friction force on the dishes. However, the contact time is SO short that this force gives the dishes negligible velocity before the tablecloth is completely gone.\n\n**Role of Inertia:**\nThe dishes have inertia of rest — they strongly resist any change in their state of rest. Since the tablecloth is pulled very quickly, the contact time is minimal (perhaps 0.05 seconds). The friction impulse (force × time) transferred to the dishes is tiny. The dishes barely move.\n\n**Mathematical insight:**\nImpulse = F × t = change in momentum = mv\nIf t is extremely small (fast pull), mv ≈ 0, so v ≈ 0. Dishes barely move!\n\n**Conditions for success:**\n1. **Pull the cloth fast** — the faster, the smaller the contact time, the less impulse transferred to dishes.\n2. **Pull horizontally** (downward angled pull would add friction).\n3. **Low friction between cloth and dishes** — smooth cloth, smooth plate bottoms.\n4. **Heavy dishes** — more mass → more inertia → harder to move for the same impulse.\n5. **Smooth pull** — no jerking that would transfer more force.\n\n**Why it fails with slow pull:**\nSlow pull → longer contact time → more impulse (F × t) transferred → larger velocity given to dishes → dishes slide off.\n\nThis experiment is literally a physics lab in a restaurant!",
      explanation:
        "The tablecloth trick is one of the most dramatic demonstrations of inertia of rest. The key formula is impulse = Ft = mv. Minimizing contact time minimizes velocity transferred to dishes. Massive dishes (more inertia) are harder to move.",
    },
    {
      id: "t2q57",
      type: "long",
      points: 20,
      question:
        "A 500 kg roller skater (person + skates) is initially at rest on a smooth rink. The skater pushes off a wall with 200 N for 0.5 seconds. (a) Find the impulse. (b) Find the velocity after push. (c) After separating from the wall, what forces act? Does velocity change? (d) How does this connect to Newton's First Law?",
      correctAnswer:
        "**(a) Impulse:**\nImpulse = Force × time = 200 × 0.5 = **100 N·s**\n\n**(b) Velocity after push:**\nImpulse = change in momentum = mv\n100 = 500 × v\nv = **0.2 m/s** away from the wall\n\n**(c) Forces after separating from wall:**\nHorizontal forces: None (smooth rink = no friction). Vertical forces: Normal force from rink = Weight (balanced).\nNet horizontal force = 0.\nTherefore, horizontal velocity stays constant at 0.2 m/s.\n\n**(d) Connection to Newton's First Law:**\nAfter the push, the skater is in the situation directly described by the First Law: an object in motion (0.2 m/s away from wall) with zero net force continues at constant velocity. The skater glides forever at 0.2 m/s on the frictionless rink.\n\n**If the rink had friction:** Friction would be an unbalanced backward force. The skater would decelerate and eventually stop. This shows that it's not motion that is unnatural — it's the FORCE (friction) that causes the stopping.\n\n**Energy perspective:** During the push, chemical energy (muscles) converted to kinetic energy (½ × 500 × 0.2² = 10 J). After the push, this 10 J stays as kinetic energy forever (no friction to dissipate it).",
      explanation:
        "This problem combines impulse-momentum theorem with Newton's First Law: the push gives the skater velocity, and then First Law takes over to maintain that velocity. The frictionless surface ensures no unbalanced force acts after the push.",
    },
    {
      id: "t2q58",
      type: "long",
      points: 20,
      question:
        "A team of physicists is designing protective gear for motorcyclists. Using Newton's First Law and the concept of inertia, explain: (a) why motorcyclists are more vulnerable than car passengers in a crash, (b) how helmets protect the brain, (c) how leather jackets with padding work, and (d) what 'crumple zone' equivalent exists for motorcycles.",
      correctAnswer:
        "**(a) Why motorcyclists are more vulnerable:**\nIn a crash, the motorcycle stops suddenly. The rider, due to inertia of motion, continues forward at the original speed. Unlike car passengers, motorcyclists:\n1. Have no seatbelt to slow them down\n2. Have no crumple zone/airbag between them and the ground/obstacle\n3. Are physically separated from the motorcycle on impact\n4. Their body travels through air and impacts the ground or other objects\nThe inertia of motion carries the rider forward with full momentum, with no gradual deceleration system.\n\n**(b) How helmets protect the brain:**\nThe brain floats in cerebrospinal fluid inside the skull. In a crash, the head stops suddenly but the brain, due to its own inertia of motion, continues forward inside the skull — slamming into the skull wall. This causes concussion or traumatic brain injury.\nThe helmet works by: (1) Spreading the impact over a larger area of the skull. (2) The foam lining compresses on impact, extending the stopping time from milliseconds to tens of milliseconds. Longer stopping time → smaller force (F = mv/t). (3) The hard outer shell distributes the load.\n\n**(c) Leather jackets with padding:**\nPaddling on elbows/shoulders works like mini crumple zones. On impact, padding compresses, extending contact time, reducing peak force on bones/joints. Leather resists abrasion, reducing road rash as the inertia of motion skids the rider along the road.\n\n**(d) Crumple zone equivalent for motorcycles:**\nModern innovations: (1) Motorcycle airbags (in racing suits and some jackets) — inflate in microseconds, creating a cushion that extends stopping time for the torso. (2) Air fence barriers on race tracks — large air-filled cylinders that compress on impact, much gentler than solid walls. (3) Soft barriers (TecPro barriers) in racing circuits.",
      explanation:
        "Crash physics is entirely about managing inertia of motion. The goal is always to extend the stopping time (increase Δt in F·Δt = mΔv), which reduces the peak force. All protective gear works on this principle.",
    },
    {
      id: "t2q59",
      type: "long",
      points: 20,
      question:
        "Explain the phenomenon of 'weightlessness' experienced by astronauts in the International Space Station (ISS). Are they truly weightless? How does Newton's First Law apply? What physiological effects does long-term weightlessness have?",
      correctAnswer:
        "**Are astronauts truly weightless?** NO! Astronauts in the ISS (orbiting at ~400 km altitude) still experience about 90% of Earth's surface gravity (g at that altitude ≈ 8.7 m/s²). Earth's gravity definitely acts on them — it's what keeps the ISS in orbit!\n\n**Why do they 'feel' weightless?** The sensation of weight comes from the Normal Force — the force that a floor, chair, or scale exerts on your body. In the ISS, both the astronaut and the ISS itself are in free fall around Earth. The ISS would fall straight down if it weren't moving so fast horizontally. Because the ISS is accelerating toward Earth at exactly the same rate as the astronaut, the floor never needs to push on the astronaut's feet. Normal Force = 0. Hence: weightless feeling.\n\n**Newton's First Law connection:** In an inertial frame (Earth), both the ISS and astronaut are accelerating (falling toward Earth). In the ISS's reference frame (non-inertial), the astronaut floats because both they and the ISS undergo the same acceleration — no relative motion. This is like being inside an elevator in free fall — you float.\n\n**Why the ISS doesn't fall:** The ISS moves at 7.66 km/s horizontally. It falls toward Earth, but Earth's surface curves away at the same rate (Newton's cannon thought experiment). The ISS perpetually 'falls around' Earth.\n\n**Physiological effects of long-term weightlessness:**\n1. **Bone density loss:** Bones need weight-bearing stress to stay strong. Without gravity loading, bones lose calcium and weaken.\n2. **Muscle atrophy:** Muscles (especially leg muscles) shrink from disuse.\n3. **Fluid redistribution:** Fluid shifts toward the upper body — puffy face, thinner legs.\n4. **Cardiovascular changes:** Heart doesn't need to pump blood 'uphill' against gravity.\n5. **Vision problems:** Increased intracranial pressure can affect optic nerve.",
      explanation:
        "Weightlessness is not the absence of gravity — it's the absence of Normal Force. It occurs in free fall conditions. This distinction reveals the deep physics of gravity, orbital mechanics, and the difference between gravitational force and the sensation of weight.",
    },
    {
      id: "t2q60",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A physicist claims: 'Newton's First Law is not really a law about force — it is a definition of what an inertial frame is.' Critically evaluate this statement. What would 'physics' look like in a completely non-inertial frame?",
      correctAnswer:
        "**Evaluating the claim:**\nThe physicist is largely correct, and this is actually a deep insight into the foundations of Newtonian mechanics.\n\n**Newton's First Law as a definition of inertial frames:**\nThe First Law states: in the absence of external forces, objects move at constant velocity. But this is only observationally true in certain reference frames — inertial frames. The First Law implicitly DEFINES inertial frames as those frames where this law holds. So the law and the definition are circular in a sense.\n\n**Example:** In an accelerating car (non-inertial frame), a ball on the seat slides backward even though no visible horizontal force acts on it. The First Law 'fails.' But this isn't really a failure — it's a signal that the car is a non-inertial frame.\n\n**What physics looks like in a non-inertial frame:**\nTo apply Newton's Laws in accelerating frames, physicists introduce 'fictitious forces' (pseudo-forces):\n- **In an accelerating car:** A backward pseudo-force ma acts on all objects (makes things slide backward)\n- **On a rotating Earth:** The Coriolis force deflects moving objects sideways (causes hurricanes to rotate!)\n- **On a spinning space station:** Centrifugal pseudo-force creates artificial gravity\n\nThese forces are NOT real — they don't have reaction partners (Newton's Third Law) and disappear when you switch to an inertial frame. But mathematically, adding pseudo-forces makes Newton's equations work in any frame.\n\n**Conclusion:** The First Law DOES double as a definition of inertial frames, but it also DOES contain physical content: the observation that such frames exist, that they're not arbitrarily rare, and that they're related by constant-velocity transformations (Galilean relativity). Without this physical observation, there would be no reason to expect inertial frames to exist at all.",
      explanation:
        "This is a genuinely advanced topic in the philosophy of physics. The circularity of Newton's First Law — it simultaneously is a law and defines the frames where it applies — was recognized by philosophers like Mach, and ultimately led Einstein to general relativity, where gravity itself is understood as curved spacetime, not a force.",
    },
  ],
};
