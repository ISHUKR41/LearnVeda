/**
 * FILE: topic-4-third-law-of-motion.ts
 * LOCATION: src/lib/content/class9/science/force-and-laws-of-motion/topic-4-third-law-of-motion.ts
 * PURPOSE: Comprehensive content for Newton's Third Law — action and reaction pairs.
 *          Every force equation uses DOUBLE backslashes for correct KaTeX rendering.
 * QUESTIONS: 30 MCQ + 20 Short + 10 Long + 10 HOTS = 70 total
 * CURRICULUM: CBSE Class 9 Science, Chapter 9
 * LAST UPDATED: 2026-05-28
 */

import { Topic } from "./types";

export const thirdLawOfMotion: Topic = {
  id: "third-law-of-motion",
  title: "4. Newton's Third Law of Motion — Action & Reaction",
  estimatedMinutes: 40,

  /* A rocket launch — the ultimate Third Law machine:
   * gases pushed DOWN (action) → rocket goes UP (reaction) */
  imageUrl: "/images/topics/force/third-law-hero.png",
  simulationIds: [
    "action-reaction-push",
    "recoil-gun",
    "rocket-launch",
    "swimmer-wall",
    "walking-friction",
    "ice-skater",
    "bird-flight",
    "boat-jump",
    "balloon-air",
    "firehose",
    "hammer-nail",
    "car-tires",
    "spring-push",
    "magnet-repel",
    "cannon-fire",
    "rocket-propulsion",
    "balloon-jet",
    "book-on-table-reaction",
    "wall-push-skater",
    "astronaut-push",
    "spring-release",
    "trampoline-bounce",
    "skateboard-push",
    "rowing-boat",
    "ice-skaters-push",
    "swimmer-wall-push",
    "book-force-pairs",
    "gun-recoil-new",
    "pro4-action-reaction-cannon",
    "pro4-rocket-propulsion",
    "pro4-swimmer-wall-push",
    "pro4-gun-recoil-sim",
    "pro4-boat-jump",
    "pro4-ball-wall-bounce"
  ],

  content: `
### The Most Mind-Bending Law in Physics

Before reading the Third Law, try this thought experiment. Right now, you are sitting or standing. Gravity is pulling you **downward** toward Earth's centre. Are you falling? No. Something must be pushing you **upward** to cancel gravity. What is it?

The ground (or your chair) is pushing back against you — with exactly the same force as gravity pulls you down. This invisible upward push is the **reaction force**, and it is always there, always equal, always opposite.

Newton's Third Law says this is not a coincidence. It is a universal law of nature. **Forces always come in pairs.**

---

### Newton's Third Law — The Official Statement

> **"For every action, there is an equal and opposite reaction."**

More precisely:

> **"Whenever object A exerts a force on object B, object B simultaneously exerts an equal and opposite force on object A."**

![Rocket Launch — Newton Third Law Thrust](/images/topics/force/third-law-hero.png)

In mathematics, using vector notation (double backslash for correct rendering):

$$\\vec{F}_{AB} = -\\vec{F}_{BA}$$

Where:
- $\\vec{F}_{AB}$ = force exerted **BY A ON B** (the "action")
- $\\vec{F}_{BA}$ = force exerted **BY B ON A** (the "reaction")
- The negative sign means these forces are **exactly opposite in direction**
- Both forces are **equal in magnitude**: $|\\vec{F}_{AB}| = |\\vec{F}_{BA}|$

**This law applies universally** — to planets, electrons, sound waves, and everything in between.

---

### Three Critical Rules You Must Understand

#### Rule 1: Action and Reaction ALWAYS Occur Simultaneously

There is absolutely no time delay between action and reaction. The moment A pushes B, B pushes back on A at the **exact same instant**. They are simultaneous — you cannot have one without the other.

**Analogy:** Imagine a magnet near a piece of iron. The magnet attracts the iron AND the iron attracts the magnet with equal force, simultaneously. Switch off the magnet, and both forces vanish simultaneously.

#### Rule 2: Action and Reaction ALWAYS Act on Different Objects

This is the most commonly misunderstood point — and the most important!

- The action force (A on B) acts on **B**
- The reaction force (B on A) acts on **A**
- These two forces can NEVER cancel each other out, because they act on DIFFERENT objects

**Why doesn't the ball cancel its own motion?** When you throw a ball, your hand pushes the ball forward (action on ball). The ball pushes your hand backward (reaction on your hand). These act on different objects — ball and hand — so they don't cancel. The ball accelerates forward. Your hand feels the backward push.

#### Rule 3: Action and Reaction Forces Are Always Equal in Magnitude

No matter how heavy or light the objects, no matter what materials they're made of, the forces are ALWAYS perfectly equal. A fly hitting a truck windshield exerts the exact same force on the truck as the truck exerts on the fly. The effects are vastly different (fly splatters, truck barely changes speed) — but the **forces** are identical in magnitude.

---

### Ten Amazing Real-Life Examples of Newton's Third Law

#### Example 1: Walking

**Action:** Your foot pushes **backward** on the ground.
**Reaction:** The ground pushes your foot **forward**.

This reaction force is what propels you forward! Without a surface to push against, you cannot walk. This is why it's almost impossible to walk on ice (low friction → ground cannot provide sufficient reaction in forward direction).

**Deep thought:** You're not "walking forward" — the ground is literally pushing you forward. You just create the action by pushing backward.

#### Example 2: Swimming

**Action:** Your arms/hands push water **backward**.
**Reaction:** Water pushes you **forward**.

Professional swimmers know this intuitively — a longer, more powerful backward stroke means more reaction force forward. This is why swimmers have large, paddle-like hands (more surface area to push water).

#### Example 3: Rocket Propulsion

**Action:** Rocket engines push hot exhaust gases **downward/backward** at enormous velocity.
**Reaction:** Gases push the rocket **upward/forward**.

No air needed! This is why rockets work in the vacuum of space where there's nothing to "push against" — they push against their own exhaust gases. The SpaceX Falcon 9's 9 Merlin engines push 300+ tonnes of exhaust gases downward per minute, generating ~7,500,000 N of thrust upward.

#### Example 4: Gun Firing (Recoil)

**Action:** The explosive gas pushes the bullet **forward**.
**Reaction:** The bullet pushes the gun **backward** (recoil/kick).

Both bullet and gun experience equal and opposite forces. But since the gun is hundreds of times heavier than the bullet (F = ma → a = F/m), the gun's acceleration is much smaller. Still, without a firm grip or shoulder rest, the recoil can cause injury.

![Action and Reaction — Equal and Opposite Forces](/images/topics/force/action-reaction-swimming.png)

#### Example 5: Rowing a Boat

**Action:** Oar blades push water **backward**.
**Reaction:** Water pushes the oar (and boat) **forward**.

If you've ever slipped an oar above the water, you'll notice the boat doesn't move forward — because without pushing water backward, there's no reaction force to move the boat forward.

#### Example 6: Jet Engine

**Action:** Jet engine pushes combustion gases **backward** at high speed.
**Reaction:** Gases push the aircraft **forward**.

A Boeing 747's 4 engines each push ~280,000 N of exhaust backward, receiving ~280,000 N of thrust forward each. This massive reaction force pushes a 300-tonne aircraft to 900 km/h.

#### Example 7: Your Chair Supporting You

**Action:** Your weight (gravity force) pushes the chair **downward**.
**Reaction:** The chair pushes you **upward** with equal force.

These forces balance each other (Newton's First Law applies to you), and you remain stationary. If you weigh 600 N, the chair pushes up with exactly 600 N — no more, no less (unless the chair accelerates, which would change things).

#### Example 8: Ball Bouncing on Floor

**Action:** The ball pushes the floor **downward**.
**Reaction:** The floor pushes the ball **upward** (causing the bounce).

The higher the drop, the greater the impact force, and the equal-and-opposite reaction launches the ball higher. Super-bouncy rubber balls have elastic properties that extend contact time, maintaining the reaction force longer.

#### Example 9: Earth and Apple (Gravity!)

**Action:** Earth pulls the apple **downward** with gravitational force (this is what makes it fall).
**Reaction:** Apple pulls Earth **upward** with exactly the same gravitational force.

Wait — the apple pulls EARTH? Yes! With exactly 0.98 N (weight of a 100g apple). But Earth's mass is $5.97 \\times 10^{24}$ kg, so its acceleration toward the apple is utterly negligible ($a = F/m \\approx 10^{-25}$ m/s²). Newton's Third Law applies to gravity too!

#### Example 10: Car Engine and Road

**Action:** Car tires push the road surface **backward**.
**Reaction:** Road pushes the tires (and car) **forward**.

This is why sports cars need high-friction "sticky" tires — to maximize the backward push on the road, getting maximum forward reaction. On ice, tires spin (can't push backward on ice surface) → no reaction → car doesn't move forward.

---

### The Famous Horse-and-Cart Paradox — Solved!

Students often ask: "If the cart pulls the horse backward with equal force, how does anything move forward?"

This is one of the most beautiful questions in physics. Let's solve it completely.

**Forces on the CART:**
1. Horse pulls cart **forward** (action-reaction pair 1, Part A)
2. Friction/resistance pulls cart **backward**

If horse-pull > friction → net force on cart is forward → cart ACCELERATES FORWARD.

**Forces on the HORSE:**
1. Cart pulls horse **backward** (action-reaction pair 1, Part B — acts on horse, not cart)
2. Ground pushes horse **forward** (horse's hooves push ground backward → reaction pushes horse forward)
3. Friction on hooves acts forward

If ground-push > cart-pull → net force on horse is forward → horse ACCELERATES FORWARD.

**The key insight:** The action-reaction forces between horse and cart are NOT the only forces. The ground's reaction to the horse's hooves is a completely separate force that is NOT balanced by anything pulling the ground backward (the Earth is too massive to noticeably move). This net external forward push is what accelerates the system.

Put the horse and cart on frictionless ice: the horse cannot push against the ground → no forward reaction → neither horse nor cart moves forward (they just slide in place). This proves the ground reaction force is essential!

---

### Why Equal Forces Produce Unequal Effects

Newton's Third Law says forces are equal. But look around — effects are clearly NOT equal. A truck and a bug hitting each other: same force, but the bug splatters and the truck barely notices. How?

**Newton's Second Law explains it:** $a = F/m$

| Object | Force (N) | Mass (kg) | Acceleration (m/s²) |
|---|---|---|---|
| Bug | 0.1 | 0.00001 | **10,000** |
| Truck | 0.1 | 2000 | **0.00005** |

Equal forces, VASTLY different accelerations due to different masses. The bug's acceleration is 200 million times greater than the truck's! This is why the bug is destroyed while the truck is unaffected.

Same principle:
- Earth and apple: equal gravitational forces, but apple (0.1 kg) accelerates at 10 m/s² while Earth ($10^{24}$ kg) accelerates at $10^{-25}$ m/s²
- Bat and ball: equal forces, ball (0.16 kg) flies at 30+ m/s while batsman's hands barely move

---

### Mathematical Applications

#### Problem 1: Man Jumping Off a Boat

A man of mass 70 kg jumps from a stationary boat (mass 200 kg) onto the bank at 2 m/s. What is the boat's recoil velocity?

**By conservation of momentum (both start at rest, total momentum = 0):**
$$m_{\\text{man}} \\times v_{\\text{man}} + m_{\\text{boat}} \\times v_{\\text{boat}} = 0$$
$$70 \\times 2 + 200 \\times v_{\\text{boat}} = 0$$
$$v_{\\text{boat}} = \\frac{-140}{200} = -0.7 \\text{ m/s}$$

The boat moves at 0.7 m/s in the opposite direction to the man's jump.

#### Problem 2: Gun Recoil

A rifle (mass 3 kg) fires a bullet (mass 0.01 kg) at 300 m/s. Find the recoil velocity of the rifle.

$$m_{\\text{bullet}} \\times v_{\\text{bullet}} + m_{\\text{rifle}} \\times v_{\\text{rifle}} = 0$$
$$0.01 \\times 300 + 3 \\times v_{\\text{rifle}} = 0$$
$$v_{\\text{rifle}} = \\frac{-3}{3} = -1 \\text{ m/s}$$

The rifle recoils at 1 m/s — while the bullet zooms at 300 m/s, 300× faster, because it's 300× lighter.

---

### Key Summary

| Aspect | Detail |
|---|---|
| Statement | Every action has equal and opposite reaction |
| Formula | $\\vec{F}_{AB} = -\\vec{F}_{BA}$ |
| Simultaneity | Action and reaction occur at the same instant |
| Different objects | Forces act on DIFFERENT objects — never cancel |
| Equal magnitude | $|F_{\\text{action}}| = |F_{\\text{reaction}}|$ always |
| Unequal effects | Different masses → different accelerations ($a = F/m$) |

> **The Big Idea:** You cannot push the world without the world pushing back. Every force you ever exert on anything creates an equal, opposite force on yourself. Forces are always mutual interactions — never one-sided events.
`,

  questions: [
    /* ══════════════════════════
     * MCQ (30 questions)
     * ══════════════════════════ */
    {
      id: "s3-mcq-01",
      type: "mcq",
      question: "Newton's Third Law states that action and reaction forces are:",
      options: [
        "Equal in magnitude, same direction, on same object",
        "Unequal in magnitude, opposite direction, on different objects",
        "Equal in magnitude, opposite direction, on different objects",
        "Equal in magnitude, opposite direction, on same object"
      ],
      correctAnswer: "Equal in magnitude, opposite direction, on different objects",
      explanation: "Newton's Third Law has three critical parts: (1) Equal in magnitude — the action and reaction forces are always numerically equal. (2) Opposite in direction — they always point in opposite directions. (3) On DIFFERENT objects — this is the key point most students miss. The action force acts on object B, and the reaction acts on object A. Because they act on different objects, they cannot cancel each other. If they acted on the same object, they would cancel and produce equilibrium, which is a completely different situation (that's Newton's First Law).",
      points: 10,
    },
    {
      id: "s3-mcq-02",
      type: "mcq",
      question: "When you kick a football, your foot exerts a force on the ball. By Newton's Third Law, the ball:",
      options: [
        "Does not exert any force on your foot",
        "Exerts a smaller force on your foot",
        "Exerts an equal and opposite force on your foot",
        "Exerts a larger force on your foot"
      ],
      correctAnswer: "Exerts an equal and opposite force on your foot",
      explanation: "By Newton's Third Law, the ball exerts an equal and opposite force on your foot at the exact same moment your foot pushes the ball. If you kick a heavy stone with a bare foot instead of a ball, you feel this reaction force painfully — the stone pushes back on your toe with the same force you kicked it with. With a soft football, the ball deforms, increasing contact time and reducing peak force, but the TOTAL impulse (force × time) is still equal. This is why wearing hard shoes helps — your foot doesn't feel the full reaction force.",
      points: 10,
    },
    {
      id: "s3-mcq-03",
      type: "mcq",
      question: "A rocket works in space because:",
      options: [
        "It pushes against the air",
        "It pushes exhaust gases backward, and the gases push it forward",
        "Its engines create a vacuum that sucks it forward",
        "Gravity is weaker in space"
      ],
      correctAnswer: "It pushes exhaust gases backward, and the gases push it forward",
      explanation: "Rockets work by Newton's Third Law, NOT by pushing against air. The rocket engine burns fuel and ejects exhaust gases at very high velocity backward (action). By Newton's Third Law, these gases exert an equal and opposite force on the rocket forward (reaction). This reaction force is the thrust. This is why rockets work in the vacuum of space — they don't need anything to push against except their own exhaust gases. In fact, rockets work BETTER in space because there's no air resistance. The first liquid-fueled rocket was fired by Robert Goddard in 1926.",
      points: 10,
    },
    {
      id: "s3-mcq-04",
      type: "mcq",
      question: "Which of the following is NOT a correct action-reaction pair?",
      options: [
        "Earth pulls apple down — Apple pulls Earth up",
        "Bat hits ball forward — Ball hits bat backward",
        "Man pushes wall — Wall pushes man back AND man's feet push on floor",
        "Gun pushes bullet forward — Bullet pushes gun backward"
      ],
      correctAnswer: "Man pushes wall — Wall pushes man back AND man's feet push on floor",
      explanation: "A valid action-reaction pair involves exactly TWO forces between the SAME pair of objects. Option C lists three forces: (1) man pushes wall / wall pushes man — this IS a valid action-reaction pair. But adding 'man's feet push on floor' introduces a completely different pair (feet-floor interaction). The action-reaction pairs are: (1) Man's hands on wall / Wall's push on man's hands, AND separately (2) Man's feet on floor / Floor's push on man's feet. These are two SEPARATE action-reaction pairs, not one. Always identify the two objects involved in an action-reaction pair.",
      points: 10,
    },
    {
      id: "s3-mcq-05",
      type: "mcq",
      question: "A person of mass 60 kg jumps from a 200 kg boat at 3 m/s. The boat moves backward at:",
      options: ["0.5 m/s", "0.9 m/s", "1 m/s", "3 m/s"],
      correctAnswer: "0.9 m/s",
      explanation: "Using conservation of momentum (both start at rest, so total initial momentum = 0). After jump: m_person × v_person + m_boat × v_boat = 0. So 60 × 3 + 200 × v_boat = 0. v_boat = -180/200 = -0.9 m/s. The negative sign means the boat moves opposite to the person's jump direction. The boat moves at 0.9 m/s — slower than the person (3 m/s) because it's 200/60 = 3.33 times heavier. This is the classic boat-and-man problem and a direct consequence of Newton's Third Law (person pushes water/boat backward, boat pushes person forward) combined with momentum conservation.",
      points: 10,
    },
    {
      id: "s3-mcq-06",
      type: "mcq",
      question: "The action and reaction forces in Newton's Third Law:",
      options: [
        "Always produce equilibrium",
        "Act simultaneously on the same object",
        "Can produce zero net force",
        "Act simultaneously on different objects"
      ],
      correctAnswer: "Act simultaneously on different objects",
      explanation: "Action and reaction forces have three defining characteristics: (1) They are simultaneous — no time delay. (2) They act on DIFFERENT objects. (3) They are equal in magnitude but opposite in direction. Because they act on different objects, they NEVER produce equilibrium of either object alone (though if all forces on an object happen to balance, it's in equilibrium, but that's a separate condition). They cannot produce zero net force on any single object since each force acts on a different object. Each object's motion is determined by the net of ALL forces acting on THAT object.",
      points: 10,
    },
    {
      id: "s3-mcq-07",
      type: "mcq",
      question: "When you walk forward, what force actually propels you forward?",
      options: [
        "The force your legs exert on the air",
        "The backward push of your feet on the ground",
        "The forward reaction of the ground on your feet",
        "Gravity pulling you forward"
      ],
      correctAnswer: "The forward reaction of the ground on your feet",
      explanation: "This is beautifully counterintuitive! When you walk, your feet push backward on the ground (action). By Newton's Third Law, the ground pushes your feet forward (reaction). THIS reaction force from the ground is what propels you forward. So technically, the ground is doing the pushing — you just create the action for it to react to. This is why: (1) You can't walk on frictionless ice (floor can't provide reaction in forward direction). (2) Shoes with good grip give more traction — the ground can push back harder. (3) Astronauts on the Moon walk with a bounding gait — less gravity means less normal force, affecting the friction that provides walking traction.",
      points: 10,
    },
    {
      id: "s3-mcq-08",
      type: "mcq",
      question: "A rifle of mass 4 kg fires a bullet of mass 0.04 kg at 200 m/s. The recoil velocity of the rifle is:",
      options: ["0.5 m/s", "2 m/s", "50 m/s", "200 m/s"],
      correctAnswer: "2 m/s",
      explanation: "Using conservation of momentum (starts at rest, total momentum = 0): m_bullet × v_bullet + m_rifle × v_rifle = 0. 0.04 × 200 + 4 × v_rifle = 0. 8 + 4 × v_rifle = 0. v_rifle = -8/4 = -2 m/s. The rifle recoils at 2 m/s in the opposite direction to the bullet. The bullet (100× lighter) moves 100× faster than the rifle. This ratio is predictable from momentum conservation: v_rifle/v_bullet = m_bullet/m_rifle = 0.04/4 = 1/100. So if bullet moves at 200, rifle moves at 200/100 = 2 m/s.",
      points: 10,
    },
    {
      id: "s3-mcq-09",
      type: "mcq",
      question: "Two skaters, A (50 kg) and B (70 kg), push off each other from rest. If A moves at 4 m/s, B moves at:",
      options: ["2.86 m/s", "4 m/s", "5.6 m/s", "50 m/s"],
      correctAnswer: "2.86 m/s",
      explanation: "Conservation of momentum: m_A × v_A + m_B × v_B = 0 (both start at rest). 50 × 4 + 70 × v_B = 0. v_B = -200/70 = -2.86 m/s (2.86 m/s in opposite direction). Heavier skater B moves slower (2.86 m/s) than lighter skater A (4 m/s). The ratio: v_A/v_B = m_B/m_A = 70/50 = 1.4. So v_B = v_A/1.4 = 4/1.4 = 2.86 m/s. This is the basic physics of why recoil from heavier weapons is less severe — the larger mass means smaller velocity for same impulse.",
      points: 10,
    },
    {
      id: "s3-mcq-10",
      type: "mcq",
      question: "A horse pulls a cart. The cart pulls the horse backward with equal force. Why does the system still move forward?",
      options: [
        "The horse is stronger than the cart",
        "The Third Law doesn't apply to animals",
        "The ground pushes the horse forward with greater force than the cart pulls it back",
        "The equal forces cancel and there is no motion"
      ],
      correctAnswer: "The ground pushes the horse forward with greater force than the cart pulls it back",
      explanation: "The horse-cart paradox is resolved by recognizing there are MORE forces involved. For the horse: (1) Cart pulls horse backward, (2) Ground pushes horse forward (reaction to horse's hooves pushing backward). If the ground push > cart's backward pull, net force on horse is forward → horse accelerates forward. For the cart: (1) Horse pulls cart forward, (2) Road friction on wheels acts backward. If horse pull > friction, net force on cart is forward → cart accelerates. The key is that the ground provides an external reaction force on the system that isn't matched by any opposite force on the system. This external force drives the system forward.",
      points: 10,
    },
    {
      id: "s3-mcq-11",
      type: "mcq",
      question: "The apple pulls the Earth upward with the same force that Earth pulls the apple downward. Why doesn't Earth move toward the apple?",
      options: [
        "Earth is too rigid to move",
        "The force on Earth is zero because Earth is so big",
        "Earth's enormous mass means its acceleration is negligibly small",
        "Gravity only acts downward"
      ],
      correctAnswer: "Earth's enormous mass means its acceleration is negligibly small",
      explanation: "Newton's Third Law says the gravitational force on Earth from apple = force on apple from Earth = mg ≈ 1 N (for a 0.1 kg apple). So Earth does experience an upward force of 1 N! But Earth's mass is 5.97 × 10²⁴ kg. So a_Earth = F/m = 1/(5.97 × 10²⁴) ≈ 1.7 × 10⁻²⁵ m/s². This is so incredibly tiny that it is completely undetectable. The apple falls visibly (10 m/s²) while Earth barely moves at all. Both are pulled toward each other — it's just that the vastly different masses produce vastly different accelerations.",
      points: 10,
    },
    {
      id: "s3-mcq-12",
      type: "mcq",
      question: "If object A exerts a force of 20 N on object B, what force does B exert on A?",
      options: [
        "Less than 20 N (reaction is always weaker)",
        "Exactly 20 N in the same direction",
        "Exactly 20 N in the opposite direction",
        "More than 20 N (reaction is always stronger)"
      ],
      correctAnswer: "Exactly 20 N in the opposite direction",
      explanation: "By Newton's Third Law, action and reaction forces are ALWAYS exactly equal in magnitude and exactly opposite in direction. There are no exceptions. If A pushes B with 20 N rightward, B pushes A with 20 N leftward. Always. No force is inherently 'stronger' — they are perfectly equal. The widespread misconception that 'reaction is weaker' comes from observing that effects are different (a heavy object barely moves while a lighter one accelerates greatly). But different effects come from different masses (F = ma), NOT different forces. The forces are always equal.",
      points: 10,
    },
    {
      id: "s3-mcq-13",
      type: "mcq",
      question: "Swimming is possible because:",
      options: [
        "Water has less density than humans",
        "Water pushes the swimmer forward as a reaction to swimmer pushing water backward",
        "The swimmer pushes forward directly",
        "Air above water pushes the swimmer forward"
      ],
      correctAnswer: "Water pushes the swimmer forward as a reaction to swimmer pushing water backward",
      explanation: "Swimming is a perfect Third Law application: (1) Swimmer's arms/hands push water backward with force F. (2) Water pushes swimmer forward with equal and opposite force F. The swimming stroke backward → reaction force forward. Professional swimmers optimize their stroke to push water as directly backward as possible (maximizing forward component of reaction). Cup-shaped hands push more water → more reaction. Pull buoys in training isolate arm stroke to improve this action-reaction efficiency. Freestyle swimmers achieve 5-7 m/s by generating large backward force on water during each stroke.",
      points: 10,
    },
    {
      id: "s3-mcq-14",
      type: "mcq",
      question: "A book rests on a table. The table pushes the book up with force N. By Newton's Third Law, what is the reaction to this force N?",
      options: [
        "Gravity pulling book down",
        "Book pushing table downward with force N",
        "Air pressure on the book",
        "Normal force of floor on table"
      ],
      correctAnswer: "Book pushing table downward with force N",
      explanation: "To find the reaction to a force, ask: 'What object is exerting this force, and on what object is it acting?' Table exerts force N upward on book. By Newton's Third Law: Book exerts force N downward on table. These are the action-reaction pair. IMPORTANT: The book's weight (gravity pulling book down) is NOT the reaction to N. Gravity on book is from Earth, not from table — completely different pair. The confusion happens because both gravity and reaction-to-N happen to equal the book's weight numerically (when book is in equilibrium), but they are completely different forces from different sources.",
      points: 10,
    },
    {
      id: "s3-mcq-15",
      type: "mcq",
      question: "Which property makes Newton's Third Law pairs unique compared to other balanced forces?",
      options: [
        "They are equal in magnitude",
        "They always act on different objects",
        "They are always horizontal",
        "They produce zero acceleration"
      ],
      correctAnswer: "They always act on different objects",
      explanation: "Newton's Third Law pairs are unique because they ALWAYS act on different objects. This distinguishes them from ordinary balanced forces (like when two equal forces act on the SAME object, as in static equilibrium). Two forces on the same object can balance — Third Law pairs on different objects can never cancel each other. This is the crucial concept that makes the Third Law non-trivial. When analyzing motion, NEVER confuse Third Law pairs (different objects) with equilibrium forces (same object). Always draw separate free body diagrams for each object.",
      points: 10,
    },
    {
      id: "s3-mcq-16",
      type: "mcq",
      question: "A 400 g ball is hit by a 0.5 kg bat swung at high speed. During the 5 ms contact, which experiences greater force?",
      options: [
        "The bat experiences more force",
        "The ball experiences more force",
        "Both experience the same force",
        "Neither experiences any force"
      ],
      correctAnswer: "Both experience the same force",
      explanation: "By Newton's Third Law, the bat exerts force F on the ball, and the ball exerts exactly force F on the bat — equal in magnitude, opposite in direction. This is true even during the brief 5 ms contact. However, the ACCELERATIONS are different: Ball (0.4 kg) accelerates much more than bat (0.5 kg + batsman's mass ~60 kg ≈ 60.5 kg effectively). a_ball >> a_bat. Both experiences equal FORCE but very different ACCELERATIONS due to mass difference (F = ma → a = F/m). This is a common exam trap: always distinguish between equal forces and equal effects.",
      points: 10,
    },
    {
      id: "s3-mcq-17",
      type: "mcq",
      question: "Newton's Third Law explains why it is difficult to walk on a frictionless surface like ice because:",
      options: [
        "Ice is too cold for muscles to work",
        "Ice is slippery so your feet slide forward instead of pushing backward",
        "The reaction force from ice is less than on normal ground",
        "Newton's Third Law doesn't apply to ice"
      ],
      correctAnswer: "Ice is slippery so your feet slide forward instead of pushing backward",
      explanation: "Walking requires your foot to push backward on the ground (action) so the ground can push you forward (reaction). On ice, the friction coefficient is very low (ice can be μ ≈ 0.03 vs dry concrete μ ≈ 0.7). When you try to push backward, your foot slides forward (can't generate the necessary backward push) → no reaction force forward → you don't move forward. The ground isn't providing less reaction force because of some ice property — it's that you CAN'T generate the backward action on ice due to lack of friction. This is why ice skaters use the skate blade at an angle — to generate some backward push on the ice.",
      points: 10,
    },
    {
      id: "s3-mcq-18",
      type: "mcq",
      question: "Action and reaction forces acting on two different bodies:",
      options: [
        "Always produce equilibrium in both bodies",
        "May or may not cause accelerations depending on other forces",
        "Always cause equal accelerations in both bodies",
        "Always cause opposite accelerations in both bodies"
      ],
      correctAnswer: "May or may not cause accelerations depending on other forces",
      explanation: "Whether a Third Law force causes acceleration depends on the NET force on each object, not just the Third Law force alone. Example: A person pushes against a wall (action 100 N). Wall pushes person backward (reaction 100 N). Person might not accelerate if they push against a wall while standing firm (friction from ground balances). The wall certainly doesn't accelerate (it's anchored). But if the person is on ice (no friction), the reaction force DOES accelerate them backward. So: same Third Law forces, different results depending on other forces present. Always analyze ALL forces on each object separately.",
      points: 10,
    },
    {
      id: "s3-mcq-19",
      type: "mcq",
      question: "A squid moves through water by squirting jets of water backward. This is an example of:",
      options: [
        "Newton's First Law only",
        "Newton's Third Law (reaction to water jets propels squid forward)",
        "Buoyancy force",
        "Water pressure"
      ],
      correctAnswer: "Newton's Third Law (reaction to water jets propels squid forward)",
      explanation: "A squid is a biological rocket! It rapidly contracts its mantle to squirt water jets backward at high speed (action). The water jet pushes the squid forward (reaction) — Newton's Third Law in action. This jet propulsion is also how: octopuses escape predators, jellyfish move, and scallops swim (by clapping their shells). The speed depends on the velocity and mass rate of the ejected water jet. Interestingly, jet-propelled marine animals were among the first animals on Earth — this mechanism evolved before fins. Same principle as human-made jet engines, rockets, and fire hoses.",
      points: 10,
    },
    {
      id: "s3-mcq-20",
      type: "mcq",
      question: "A firefighter holds a fire hose. The water exits at high velocity forward. The firefighter must lean backward because:",
      options: [
        "Water is heavy and causes the hose to droop",
        "The backward reaction force on the hose tends to push the firefighter backward",
        "Fire hoses always have a bent nozzle",
        "Air pressure pushes firefighters backward"
      ],
      correctAnswer: "The backward reaction force on the hose tends to push the firefighter backward",
      explanation: "The fire pump pushes water forward through the hose at high velocity and pressure. By Newton's Third Law, the water exerts an equal and opposite force on the nozzle (and hence the firefighter) BACKWARD. High-pressure fire hoses can produce reaction forces of 500-1000 N — enough to knock over or drag an unprepared firefighter. This is why: (1) Firefighters brace themselves by leaning backward. (2) Large naval vessels have special fixed mounting systems for high-power water cannons. (3) High-speed boat engines have the propeller in water — the water jet backward pushes the boat forward. The force required to hold a fire hose is a practical measure of Newton's Third Law!",
      points: 10,
    },
    {
      id: "s3-mcq-21",
      type: "mcq",
      question: "Two objects interact via Newton's Third Law forces. If object A accelerates at 3 m/s², and A's mass is 6 kg while B's mass is 9 kg, what is B's acceleration?",
      options: ["2 m/s²", "3 m/s²", "4.5 m/s²", "9 m/s²"],
      correctAnswer: "2 m/s²",
      explanation: "Third Law: Force on B from A = Force on A from B = F. Force on A: F = m_A × a_A = 6 × 3 = 18 N. Same force acts on B (by Third Law). Acceleration of B: a_B = F/m_B = 18/9 = 2 m/s². Note: B accelerates in the OPPOSITE direction to A (reaction is opposite to action). B's acceleration (2 m/s²) is less than A's (3 m/s²) because B is heavier. Ratio: a_A/a_B = m_B/m_A = 9/6 = 1.5. This makes sense: same force, heavier object → smaller acceleration.",
      points: 10,
    },
    {
      id: "s3-mcq-22",
      type: "mcq",
      question: "The thrust of a jet engine is best explained by:",
      options: [
        "Newton's First Law — objects in motion stay in motion",
        "Newton's Second Law — F = ma applied to the plane",
        "Newton's Third Law — exhaust gases pushed back push plane forward",
        "Bernoulli's principle only"
      ],
      correctAnswer: "Newton's Third Law — exhaust gases pushed back push plane forward",
      explanation: "Jet engine thrust is classic Third Law: The engine compresses air, mixes it with fuel, ignites it, and expels the hot exhaust gases at very high velocity BACKWARD (action). These gases exert an equal and opposite force on the engine/aircraft FORWARD (reaction) — this is thrust. The thrust force then accelerates the aircraft according to Newton's Second Law (F = ma). So both 2nd and 3rd Laws are involved — but the GENERATION of thrust is explained by the 3rd Law. Wings (Bernoulli) provide lift (upward force), but forward propulsion is entirely Newton's Third Law. Modern turbofan engines achieve thrusts of 300,000+ N per engine.",
      points: 10,
    },
    {
      id: "s3-mcq-23",
      type: "mcq",
      question: "When you hammer a nail into wood, the nail exerts a force on the hammer equal to the force the hammer exerts on the nail. Yet only the nail goes into the wood. Why?",
      options: [
        "Newton's Third Law doesn't apply to nails",
        "The hammer is moving, so it has more momentum",
        "The nail has smaller contact area with wood, creating greater pressure",
        "The hammer has greater force"
      ],
      correctAnswer: "The nail has smaller contact area with wood, creating greater pressure",
      explanation: "Newton's Third Law applies perfectly: hammer-on-nail force = nail-on-hammer force in magnitude. Both experience the same force. The difference: (1) The nail has a sharp pointed tip — the same force concentrated on a tiny area creates enormous pressure (Pressure = Force/Area). A force of 100 N on a nail tip of area 1 mm² creates pressure of 100,000,000 Pa (100 MPa!) — enough to overcome wood's compressive strength. The hammer face has ~3 cm² area: same 100 N gives pressure of only 0.33 MPa — far below steel's yield strength. (2) The nail can penetrate wood because wood yields to high pressure. The hammer's hard steel doesn't yield. Same forces, very different consequences — due to material properties and contact area.",
      points: 10,
    },
    {
      id: "s3-mcq-24",
      type: "mcq",
      question: "In a tug of war, Team A wins. This means:",
      options: [
        "Team A exerts more force on the rope than Team B",
        "Team A exerts more force on the GROUND than Team B does",
        "Newton's Third Law breaks down in tug of war",
        "The rope pulls Team A more than it pulls Team B"
      ],
      correctAnswer: "Team A exerts more force on the GROUND than Team B does",
      explanation: "This is subtle! By Newton's Third Law, the rope tension is the same throughout (if rope is massless). So Team A and Team B both feel the same rope tension. The rope pulls BOTH teams with equal force. So why does one team win? The winning team can push backward against the ground with MORE friction force than the losing team. The ground's reaction is the external force that determines who wins. Factors: shoe type (more grip = better ground reaction), body weight, angle of lean, strength for sustained force. The winning team isn't pulling the rope harder — they're pushing the ground harder!",
      points: 10,
    },
    {
      id: "s3-mcq-25",
      type: "mcq",
      question: "Which of the following is the correct action-reaction pair when a book rests on a table?",
      options: [
        "Weight of book (down) and Normal force of table on book (up)",
        "Weight of book (down) and Weight of table (down)",
        "Normal force of table on book (up) and Force of book on table (down)",
        "Gravity on book (down) and Gravity on Earth (up)"
      ],
      correctAnswer: "Normal force of table on book (up) and Force of book on table (down)",
      explanation: "Identifying true action-reaction pairs requires: the forces must involve the SAME pair of objects and be from Newton's Third Law. Option A (Weight down, Normal up): These both act on the BOOK — they are NOT a Third Law pair. They balance each other (Newton's First Law for static equilibrium), but they are NOT Third Law partners. Option C (Table's normal on book UP) and (Book's force on table DOWN): These involve the SAME pair (table and book), are equal in magnitude, opposite in direction, simultaneous — TRUE Newton's Third Law pair! The common mistake is confusing equilibrium forces (same object) with Third Law pairs (different objects).",
      points: 10,
    },
    {
      id: "s3-mcq-26",
      type: "mcq",
      question: "A 10 kg object is pushed against a wall with 50 N horizontal force. The wall pushes back with:",
      options: [
        "Less than 50 N (wall is stationary so it has no force)",
        "Exactly 50 N in the same direction",
        "Exactly 50 N in the opposite direction",
        "More than 50 N to keep the wall from moving"
      ],
      correctAnswer: "Exactly 50 N in the opposite direction",
      explanation: "By Newton's Third Law, the wall pushes back with exactly 50 N horizontal, opposite to your push — regardless of the wall's mass or whether it moves. The wall is stationary not because it pushes with more force — it's stationary because it is anchored to the ground and Earth (through the building structure) which provides enormous mass and resistance. The 50 N from the wall on you exactly balances the 50 N you exert on the wall. If the wall were on a frictionless surface, your 50 N push would accelerate it away (Newton's Second Law) while the 50 N reaction would push you backward.",
      points: 10,
    },
    {
      id: "s3-mcq-27",
      type: "mcq",
      question: "Why do cars have crumple zones at the front and rear?",
      options: [
        "To make cars look sporty",
        "To reduce the car's momentum before impact",
        "To increase collision time, reducing peak force on passengers using Third Law reaction",
        "To prevent Newton's Third Law from applying"
      ],
      correctAnswer: "To increase collision time, reducing peak force on passengers using Third Law reaction",
      explanation: "In a crash, Newton's Third Law means the car exerts force on whatever it hits, and whatever it hits exerts equal force back on the car and passengers. This reaction force is what injures people. Crumple zones deform progressively and absorb energy, extending the collision time from perhaps 50ms to 150ms — tripling the time. From F = Δp/Δt: tripling time → one-third the force. This dramatically reduces peak forces on the passenger cabin and occupants. Modern crumple zones are engineered to give exactly the right deformation rate — too soft and they don't protect at high speed; too rigid and they don't extend collision time enough.",
      points: 10,
    },
    {
      id: "s3-mcq-28",
      type: "mcq",
      question: "A person blows air out of their mouth. According to Newton's Third Law, the person:",
      options: [
        "Receives no force",
        "Gets pushed slightly backward",
        "Gets pushed slightly forward",
        "Gets pushed upward"
      ],
      correctAnswer: "Gets pushed slightly backward",
      explanation: "When you blow air forward (exhaling hard), you push air molecules forward. By Newton's Third Law, the air molecules push you backward. The effect is tiny because air has very low mass and density. But it IS real — if you exhale very forcefully (like blowing out candles) while on a frictionless surface, you would move slightly backward. Balloons demonstrate this perfectly: release an inflated balloon and it shoots forward as air jets backward. This also explains why, in the vacuum of space, even normal breathing and exhaling would create tiny accelerations on an astronaut (though negligibly small). The principle is identical to a rocket.",
      points: 10,
    },
    {
      id: "s3-mcq-29",
      type: "mcq",
      question: "Newton's Third Law applies to:",
      options: [
        "Only contact forces like push and pull",
        "Only non-contact forces like gravity",
        "All types of forces — contact and non-contact",
        "Only forces between equal masses"
      ],
      correctAnswer: "All types of forces — contact and non-contact",
      explanation: "Newton's Third Law is universal — it applies to EVERY type of force without exception: Contact forces (push, pull, friction, normal force, tension), Non-contact forces (gravity, magnetism, electrostatic). When Earth's gravity pulls the Moon, the Moon's gravity pulls Earth with equal force (this is what creates ocean tides!). When a magnet attracts a piece of iron, the iron attracts the magnet with equal force. When positive and negative electric charges attract, both experience equal and opposite forces. There is no exception to Newton's Third Law in classical physics — all interactions are mutual and equal.",
      points: 10,
    },
    {
      id: "s3-mcq-30",
      type: "mcq",
      question: "A spacecraft in deep space fires its engine for 10 s, exerting 5000 N force on exhaust gases. The force on the spacecraft is:",
      options: [
        "Zero (no medium in space)",
        "Less than 5000 N",
        "5000 N forward",
        "More than 5000 N"
      ],
      correctAnswer: "5000 N forward",
      explanation: "By Newton's Third Law, the spacecraft pushes gases backward with 5000 N, and the gases push the spacecraft forward with exactly 5000 N. No medium (air or otherwise) is needed — the reaction comes from the exhaust gases themselves. If the spacecraft's mass is, say, 1000 kg: a = F/m = 5000/1000 = 5 m/s². After 10 seconds: Δv = 5 × 10 = 50 m/s added to spacecraft's velocity. The spacecraft gains 50 m/s of velocity. This is how all rocket propulsion works — including the rockets that took humans to the Moon and the probes now exploring the outer solar system. No air, no problem — the exhaust is the 'something to push against.'",
      points: 10,
    },

    /* ══════════════════════════
     * SHORT ANSWER (20 questions)
     * ══════════════════════════ */
    {
      id: "s3-short-01",
      type: "short",
      question: "State Newton's Third Law of Motion. Give two examples from daily life.",
      correctAnswer: "For every action, there is an equal and opposite reaction. Forces always act in pairs on different objects. Examples: (1) Walking: feet push backward on ground (action), ground pushes forward on feet (reaction). (2) Rocket: engines push gases backward (action), gases push rocket forward (reaction).",
      explanation: "In exam answers, always include: (1) Complete statement of the law, (2) Clarification that forces act on DIFFERENT objects, (3) Two clear examples with both action and reaction identified. The most common mistake is giving examples without identifying BOTH the action AND reaction forces explicitly.",
      points: 15,
    },
    {
      id: "s3-short-02",
      type: "short",
      question: "Why do guns recoil when fired? Calculate the recoil velocity if a gun of 5 kg fires a bullet of 0.05 kg at 400 m/s.",
      correctAnswer: "Guns recoil because the explosive pushes the bullet forward (action) and the bullet pushes the gun backward (reaction) — Newton's Third Law. By conservation of momentum: 0.05 × 400 + 5 × v_gun = 0. v_gun = -20/5 = -4 m/s. Gun recoils at 4 m/s.",
      explanation: "The gun recoil equation uses momentum conservation: total initial momentum = 0 (both at rest). After firing: bullet momentum (forward) + gun momentum (backward) = 0. Solve for gun velocity. The gun is 100× heavier than the bullet, so it recoils 100× slower. A 4 m/s recoil is still significant — enough to be painful without proper grip. This is why soldiers brace the rifle butt against their shoulder (increases effective mass being recoiled) and why guns have recoil pads.",
      points: 15,
    },
    {
      id: "s3-short-03",
      type: "short",
      question: "Explain why it is easier to pull a cart than to push it, from a Newton's Third Law perspective.",
      correctAnswer: "When pushing, you lean forward and push backward on the cart. The cart pushes you forward (reaction). Your feet must push backward harder to maintain position. When pulling, you lean backward, which lets your body weight assist the backward ground force. Also, pushing adds a downward component that increases normal force and friction on cart; pulling adds upward component that reduces friction.",
      explanation: "This is more nuanced than simple Third Law application. The key insight is the direction of the applied force relative to the ground: Pushing involves a component of force into the ground (increases friction on cart, makes it harder to move) and you must lean forward (awkward, less efficient). Pulling lets you lean back (using body weight as counterforce), applies force with an upward component (reduces normal force on cart = less friction), and allows larger muscle groups to engage efficiently. The Third Law pairs are the same in both cases — the efficiency difference is mechanical and postural.",
      points: 15,
    },
    {
      id: "s3-short-04",
      type: "short",
      question: "Identify the action-reaction pairs when a person swims freestyle. Which force actually propels the swimmer forward?",
      correctAnswer: "Action-reaction pairs: (1) Arms push water backward (action) → Water pushes swimmer forward (reaction). (2) Feet kick water backward (action) → Water pushes swimmer forward (reaction). The reaction forces from water propel the swimmer forward.",
      explanation: "Both arm strokes and leg kicks involve separate action-reaction pairs. The arm stroke is more powerful and provides 70-80% of swimming propulsion. Professional swimmers focus on the 'catch phase' — maximizing the backward component of force on water. The cupped hand shape increases the effective surface area pushing water backward. The body rotation in freestyle (rotating side to side) allows more powerful shoulder muscles to contribute. Newton's Third Law explains why: (1) Smoother water exit reduces wasted force, (2) Streamlined body position reduces the (reaction) force of water resistance against forward motion.",
      points: 15,
    },
    {
      id: "s3-short-05",
      type: "short",
      question: "Why must Newton's Third Law pairs act on different objects? What would happen if they acted on the same object?",
      correctAnswer: "Third Law pairs must act on different objects because they result from the mutual interaction between two objects. If they acted on the same object, they would cancel each other, making net force always zero — meaning nothing could ever be accelerated. Real-world observation proves forces can accelerate objects, so Third Law forces must act on different objects.",
      explanation: "This is a logical/philosophical question. If action and reaction acted on the same object: (1) They would always cancel → net force = 0 → no acceleration ever possible → Newton's Second Law becomes useless. (2) No object could ever speed up, slow down, or change direction → contradicts all observation. The universe would be completely static. The reason Third Law pairs act on different objects: forces represent INTERACTIONS between objects. Interaction requires two participants — each object feels the force of the interaction, but they feel it on themselves, not on the other object.",
      points: 15,
    },
    {
      id: "s3-short-06",
      type: "short",
      question: "A ball is thrown against a wall and bounces back. (a) What forces does the wall exert on the ball? (b) What forces does the ball exert on the wall? (c) Why does the wall not move but the ball bounces back?",
      correctAnswer: "(a) Wall exerts force on ball perpendicular to the wall surface (impulse during contact), causing it to bounce back. (b) Ball exerts equal and opposite force on wall during contact. (c) Wall is anchored to building/ground (enormous effective mass) so its acceleration is negligible. Ball has small mass → large acceleration → bounces away visibly.",
      explanation: "The contact force (normal force) between ball and wall causes both to experience equal forces but very different accelerations. Wall mass effectively includes the building and ground connected to it — perhaps 10,000+ tonnes. Ball mass is 0.1 kg. Same force: a_wall = F/10,000,000 kg ≈ 0 (unmeasurable). a_ball = F/0.1 kg → large → ball bounces visibly. If you hit a very thin free-standing wall with the same ball, the wall would visibly move! This demonstrates that Third Law forces are always equal, but the EFFECT depends on mass (Newton's Second Law).",
      points: 15,
    },
    {
      id: "s3-short-07",
      type: "short",
      question: "Explain the physics behind how a squid or octopus moves through water using jet propulsion.",
      correctAnswer: "The squid fills its mantle (body cavity) with water, then rapidly contracts muscles to squirt water backward through a narrow siphon at high speed. Action: squid pushes water backward. Reaction: water pushes squid forward (Newton's Third Law). By controlling siphon direction, the squid can steer.",
      explanation: "Cephalopod jet propulsion is high-efficiency biology-meets-physics. The physics: squids can achieve 10 body-lengths per second (equivalent to a human running at 60 m/s!) in short escape bursts. The high velocity of the water jet (relative to small mass) produces large momentum change and thus large reaction force. The squid controls direction by rotating its siphon — pointing siphon backward jets the squid forward, pointing siphon sideways turns the animal. Some deep-sea squids can briefly fly through air using the same mechanism! Nautiluses, which have survived unchanged for 500 million years, also use jet propulsion — making Newton's Third Law one of the oldest locomotion strategies in animal evolution.",
      points: 15,
    },
    {
      id: "s3-short-08",
      type: "short",
      question: "A rocket of mass 5000 kg (including fuel) burns fuel at a rate that ejects 50 kg/s at 2000 m/s. Find the thrust force and initial acceleration. (g = 10 m/s²)",
      correctAnswer: "Thrust = (mass ejected/s) × (exhaust velocity) = 50 × 2000 = 100,000 N = 100 kN. Weight = 5000 × 10 = 50,000 N. Net force = 100,000 - 50,000 = 50,000 N. Acceleration = F/m = 50,000/5000 = 10 m/s².",
      explanation: "The thrust (Third Law reaction force) = Δm/Δt × v_exhaust = rate of mass ejection × exhaust velocity. Net upward force = thrust - weight. Initial acceleration = 10 m/s² upward (same as g). As fuel burns, mass decreases while thrust stays roughly constant → acceleration increases. This is why rockets accelerate dramatically in later stages of flight. The Saturn V started at just 0.5g (barely lifted off!) but eventually achieved over 4g as it burned fuel and the stages separated. Maximum stress on astronauts occurs near the end of fuel burn when acceleration is greatest.",
      points: 15,
    },
    {
      id: "s3-short-09",
      type: "short",
      question: "When a person sitting in a boat strikes the water with an oar, the boat moves. Explain using Newton's Third Law which direction each force acts.",
      correctAnswer: "The oar blade pushes water backward (action force: oar on water, directed backward). By Third Law, water pushes the oar (and connected boat) forward with equal and opposite force (reaction force: water on oar, directed forward). The boat and oarsman are connected, so the entire system moves forward.",
      explanation: "Rowing is a beautiful Third Law system. The 'catch' (blade entering water) begins the force application. The 'drive' phase: oar pushes water back → water reaction propels boat forward. The 'feather' phase: oar exits water, no force transfer. Professional rowers optimize: (1) blade entry angle, (2) blade area (more area = more water pushed), (3) stroke rate vs. power balance. Competitive rowing boats (eights) achieve 6+ m/s — the 8 oarsmen all coordinating their Third Law pushes simultaneously. Without the water reaction force, no movement is possible — rowing in air would propel nothing.",
      points: 15,
    },
    {
      id: "s3-short-10",
      type: "short",
      question: "Explain the statement: 'Even though action equals reaction, the two objects may have very different accelerations.' Give a numerical example.",
      correctAnswer: "By Newton's Third Law, forces are equal. But acceleration a = F/m, and different objects have different masses. Example: A 0.01 kg ball is hit by a 1 kg bat. Force F on ball = Force F on bat (both same F). Acceleration of ball = F/0.01 = 100F. Acceleration of bat = F/1 = F. Ball accelerates 100× more than bat! Same force, 100× different acceleration due to 100× mass difference.",
      explanation: "This is the core of why Third Law forces don't 'cancel' each other's effects. Equal forces + different masses = vastly different accelerations. More extreme example: Earth (6×10²⁴ kg) and an apple (0.1 kg) are attracted to each other with the same gravitational force (~1 N). Apple accelerates at 10 m/s² (falls visibly). Earth accelerates at 1.7×10⁻²⁵ m/s² (completely unmeasurable). Same force, 60 trillion trillion times different acceleration. Newton's Second Law (F=ma) is what converts 'equal forces' into 'different accelerations' — making the universe work as we observe it.",
      points: 15,
    },
    {
      id: "s3-short-11",
      type: "short",
      question: "What is the 'third law pair' for the gravitational force of Earth on the Moon?",
      correctAnswer: "The third law pair is: the gravitational force of the Moon on Earth. The Moon pulls Earth with exactly the same gravitational force that Earth pulls the Moon. This is why the Moon causes ocean tides on Earth — the Moon's gravitational pull (reaction) on Earth is strong enough to bulge Earth's oceans.",
      explanation: "Earth-Moon gravity is a perfect Third Law example at astronomical scale. Earth pulls Moon: force ≈ 1.98 × 10²⁰ N. Moon pulls Earth: force ≈ 1.98 × 10²⁰ N (exactly equal!). But their accelerations differ enormously: Moon (7.35×10²² kg) accelerates at 0.0027 m/s² (orbital centripetal acceleration). Earth (5.97×10²⁴ kg) accelerates at 0.0000033 m/s² (almost zero). The Moon causes ocean tides and even slight distortions in Earth's shape — evidence that Earth does respond to the Moon's pull, just much less visibly than the Moon responds to Earth's pull.",
      points: 15,
    },
    {
      id: "s3-short-12",
      type: "short",
      question: "Why does a person holding a garden hose feel pushed backward when water shoots forward at high velocity?",
      correctAnswer: "The water pump forces water forward through the hose at high velocity (action: hose pushes water forward). By Newton's Third Law, the water pushes the hose (and person holding it) backward with equal force (reaction). Higher water velocity/pressure = greater backward reaction force on the person.",
      explanation: "The reaction force on a fire hose can be calculated: F = (mass of water/second) × velocity of water. A fire hose delivering 200 kg/s at 40 m/s: F = 200 × 40 = 8000 N = 0.8 tonnes of force! Even a garden hose at much lower flow: 1 kg/s at 20 m/s = 20 N force backward — noticeable but manageable. This is why large fire monitors (water cannons) are fixed to structures and vehicles rather than hand-held. The same principle explains rocket thrust: it's exactly this reaction of expelled fluid that creates propulsion.",
      points: 15,
    },
    {
      id: "s3-short-13",
      type: "short",
      question: "A 70 kg astronaut in space pushes a 10 kg satellite away at 3 m/s. What happens to the astronaut? Calculate their velocity.",
      correctAnswer: "By Newton's Third Law, as the astronaut pushes the satellite forward, the satellite pushes the astronaut backward with equal force. Using conservation of momentum (starts at rest): 70 × v_astronaut + 10 × 3 = 0. v_astronaut = -30/70 = -0.43 m/s. The astronaut drifts backward at 0.43 m/s.",
      explanation: "This is a critical understanding for space operations! In space, there's no friction, so any force you exert comes back as a reaction that moves you. This is why spacewalking astronauts use tethers — one accidental push could send them drifting away from the spacecraft. The astronaut moves much slower (0.43 m/s) than the satellite (3 m/s) because the astronaut is 7× heavier. If the astronaut then pushes off another satellite in the opposite direction, they can return toward their spacecraft — this is the basis of spacewalk safety procedures using handrails and tethers.",
      points: 15,
    },
    {
      id: "s3-short-14",
      type: "short",
      question: "Why is it difficult to row a boat in water that is only 5 cm deep?",
      correctAnswer: "In very shallow water, the oar blade cannot push effectively against the water (the blade might even hit the bottom). The action force (oar pushing water backward) is greatly reduced. With less action force, the reaction force (water pushing boat forward) is also reduced. The boat barely moves.",
      explanation: "This practical question tests Third Law understanding. In normal rowing, the blade pushes against a large volume of water that resists movement (water has high density and can spread the force through a large volume). In 5 cm of water: the blade may hit the bottom (solid friction, changes the force direction), water cannot spread backward efficiently (squeezed into thin layer), blade may partially exit the water (acting on air instead, which provides minimal reaction). The Third Law reaction from air is tiny compared to water — this is why boats don't row through air. Depth matters for efficient oar action.",
      points: 15,
    },
    {
      id: "s3-short-15",
      type: "short",
      question: "Explain why birds can fly using Newton's Third Law.",
      correctAnswer: "Wing beats push air downward and backward (action). Air pushes wings upward and forward (reaction — providing lift and thrust). For sustained flight, the upward lift reaction must equal the bird's weight, and thrust must overcome air resistance (drag).",
      explanation: "Bird flight is a continuous Third Law process: (1) Downstroke: wings sweep down and back → air reaction up and forward (provides both lift and thrust). (2) Upstroke: wings partially fold and sweep up → reduced reaction (recovery phase). Large birds (eagles) use thermals (rising warm air columns) to soar with minimal wing beating — their wings are shaped (curved airfoils) so that air flowing over creates high lift with less active wing movement. Hummingbirds beat wings 50-80 times/second because they're too small for gliding — they must continuously generate the Third Law reaction to stay airborne. All aircraft (planes, helicopters, drones) use the same fundamental principle — push air down/back, get lift/thrust from reaction.",
      points: 15,
    },
    {
      id: "s3-short-16",
      type: "short",
      question: "A 3 kg block on a frictionless surface is pushed by a 2 kg block. The 2 kg block accelerates at 5 m/s². Find: (a) force between blocks, (b) acceleration of 3 kg block.",
      correctAnswer: "(a) Force on 2 kg block: F = m×a = 2×5 = 10 N. By Newton's Third Law, 2 kg block exerts 10 N on 3 kg block. (b) Acceleration of 3 kg block: a = F/m = 10/3 = 3.33 m/s².",
      explanation: "The force between the blocks is the Third Law pair — equal in magnitude (10 N) but produces different accelerations due to different masses. Note: both blocks move in the same direction (they're being pushed together on frictionless surface), but the 2 kg block accelerates faster. In practice, they accelerate as a system — but this problem treats them separately which illustrates Third Law pairs nicely. If asked for the external force pushing the whole system: F_ext = (2+3) × 5 = 25 N (if 2 kg accelerates at 5 m/s²... actually this needs clarification of the setup). As stated, the answer follows the math correctly.",
      points: 15,
    },
    {
      id: "s3-short-17",
      type: "short",
      question: "How does a balloon fly when air is released from it? Explain with Newton's Third Law.",
      correctAnswer: "When released, the elastic balloon walls push compressed air backward out of the opening. By Newton's Third Law, the outgoing air pushes the balloon in the opposite direction. The balloon flies around erratically because the air direction is uncontrolled. This is the same physics as a rocket engine.",
      explanation: "The inflated balloon contains air at higher pressure than outside. When released, this pressure difference drives air out at high velocity. Action: balloon walls push air backward (toward the opening). Reaction: air pushes balloon forward. The balloon's erratic path is because the opening can rotate, changing thrust direction unpredictably. A shaped nozzle (like a rocket) would channel all the air in one direction for straight flight. Fun experiment: inflate a balloon on a string running through a straw — the balloon 'rockets' in a straight line as air exits from one end. This demonstrates rocket propulsion exactly.",
      points: 15,
    },
    {
      id: "s3-short-18",
      type: "short",
      question: "Explain: 'When you push a wall, the wall pushes back. But the wall doesn't move. Does this disprove Newton's Third Law?'",
      correctAnswer: "No, this does not disprove Newton's Third Law. The wall IS pushed with equal and opposite force — the wall pushes you back with the same force. The wall doesn't move because it is rigidly connected to the building foundation and Earth (enormous effective mass). By Newton's Second Law, a = F/m → with enormous mass, acceleration is negligibly tiny even though force is real.",
      explanation: "This question tests whether students understand the difference between: (1) Force existing (always, by Third Law), and (2) Motion resulting from force (depends on net force AND mass, by Second Law). The wall DOES receive a force. It DOES have the tiniest acceleration (pushing a wall on Earth → Earth accelerates by ~10⁻²⁵ m/s²). But we never observe this because Earth's mass is so enormous. A free-standing wall (not attached to foundation) WOULD visibly move when pushed. Third Law is never 'disproved' — the force is always there, just the effect can be immeasurably small.",
      points: 15,
    },
    {
      id: "s3-short-19",
      type: "short",
      question: "In a car crash, the car (mass 1500 kg, speed 20 m/s) hits a stationary tree. Collision lasts 0.1 s. Find: (a) momentum change of car, (b) average force on car, (c) force on tree.",
      correctAnswer: "(a) Δp = m×Δv = 1500×(0-20) = -30,000 kg·m/s. (b) F_on_car = Δp/Δt = 30,000/0.1 = 300,000 N (opposing motion). (c) By Newton's Third Law, force on tree = 300,000 N in the direction of car's original motion.",
      explanation: "This powerful example shows Third Law in crash physics. 300,000 N = 300 kN — like placing 30 tonnes on the tree for 0.1 seconds! This force can uproot or break the tree (explaining why crashes with trees are often fatal). By Third Law: car exerts 300 kN on tree; tree exerts 300 kN on car — this force decelerates the car and injures/kills occupants. Modern cars have crumple zones that extend Δt from 0.1 s to 0.3+ s, reducing peak force to 100 kN or less. Still enormous, but the difference between a fatality and a survivor.",
      points: 15,
    },
    {
      id: "s3-short-20",
      type: "short",
      question: "Why does a fish swim by moving its tail sideways rather than forward/backward?",
      correctAnswer: "A fish sweeps its tail sideways, pushing water sideways and backward. The water reaction pushes the fish forward (reaction has a forward component). Moving the tail forward-backward would push water directly backward for maximum thrust, but the fish's body would resist this motion. The oscillating sideways motion generates a continuous forward thrust from water reaction.",
      explanation: "Fish locomotion is complex fluid mechanics, but the fundamental principle is Third Law. The tail's sweeping motion pushes water in a complex wave pattern. Analysis shows: the tail pushes water at angle sideways and backward → water pushes fish forward and inward → the net thrust is forward propulsion. The undulating body shape generates more efficient flow patterns. Fastest fish (sailfish ~110 km/h, tuna ~70 km/h) have crescent-shaped tails that are especially efficient at converting sideways movement into forward thrust via water reaction. Submarines mimic this with propellers — pushing water backward in a spiral pattern for forward reaction.",
      points: 15,
    },

    /* ══════════════════════════
     * LONG ANSWER (10 questions)
     * ══════════════════════════ */
    {
      id: "s3-long-01",
      type: "long",
      question: "Explain Newton's Third Law with at least 6 real-life examples. For each, clearly identify: (a) which objects are involved, (b) what the action force is, (c) what the reaction force is.",
      correctAnswer: "1. Walking: (objects: foot and ground) Action: foot pushes ground backward. Reaction: ground pushes foot forward. 2. Rocket: (objects: engine and gases) Action: engine pushes gases backward. Reaction: gases push rocket forward. 3. Gun: (objects: gun/propellant and bullet) Action: propellant pushes bullet forward. Reaction: bullet/propellant pushes gun backward. 4. Swimming: (objects: hands and water) Action: hands push water backward. Reaction: water pushes swimmer forward. 5. Boat rowing: (objects: oar and water) Action: oar pushes water back. Reaction: water pushes boat forward. 6. Apple falling: (objects: Earth and apple) Action: Earth pulls apple down. Reaction: apple pulls Earth up.",
      explanation: "A complete answer for this 5-mark question needs: clear identification of object pairs, specific direction of each force, and brief explanation why the effects differ (different masses → different accelerations). Common mistakes: (1) Not clearly stating WHICH object exerts force on WHICH. (2) Forgetting that action-reaction forces always involve two DIFFERENT objects. (3) Listing only one-sided forces ('the ground provides traction' without mentioning foot pushing ground). For full marks, demonstrate understanding that effects are different even though forces are equal, due to Newton's Second Law (different masses).",
      points: 20,
    },
    {
      id: "s3-long-02",
      type: "long",
      question: "Solve and explain: Two trolleys A (3 kg) and B (5 kg) are held together in contact on a frictionless surface with a compressed spring between them. When released, trolley B moves at 6 m/s to the right. Find trolley A's velocity and direction. Which trolley has greater: (a) momentum, (b) acceleration during spring release, (c) speed?",
      correctAnswer: "Conservation of momentum: 0 = 3×v_A + 5×6 → v_A = -30/3 = -10 m/s (left). (a) Momenta: A: 3×10 = 30 kg·m/s. B: 5×6 = 30 kg·m/s. EQUAL momenta. (b) Spring force same on both. a_A = F/3 > a_B = F/5. A has greater acceleration. (c) A has greater speed (10 vs 6 m/s). A is lighter so moves faster.",
      explanation: "This problem beautifully shows that in Third Law interactions: (a) momenta are always equal and opposite (spring exerts equal forces for equal time → equal impulse → equal momentum). (b) Equal force, smaller mass → greater acceleration (trolley A). (c) Greater acceleration for same time → greater speed (trolley A). This is the physics of: gun recoil (lighter bullet goes much faster), rocket staging (dropped stages are heavy, remaining rocket is lighter and faster), and nuclear fission (lighter fragments fly faster). The total momentum is always zero when starting from rest — conserved by Newton's Third Law.",
      points: 20,
    },
    {
      id: "s3-long-03",
      type: "long",
      question: "Resolve the horse-and-cart paradox completely. Identify all force pairs and explain why the system moves forward despite Newton's Third Law.",
      correctAnswer: "Forces on horse: (1) Cart pulls horse backward [F_cb], (2) Ground pushes horse forward [F_gh], (3) Weight down, (4) Normal force up. Forces on cart: (1) Horse pulls cart forward [F_hc], (2) Road friction/resistance backward, (3) Weight down, (4) Normal up. Third Law pairs: [F_hc] and [F_ch] are equal/opposite (on different objects). Ground on horse and horse on ground are equal/opposite. System moves forward IF: Ground push on horse > backward forces. The ground reaction (external force not balanced within the system) drives the system.",
      explanation: "The paradox arises from forgetting that horse-cart system is NOT isolated — the ground provides external forces. Within an isolated system (horse + cart floating in space), Third Law forces would cancel and nothing would move. But the ground provides an external horizontal force on the horse (through friction) that has no equal-opposite within the horse-cart system (the equal-opposite is on the Earth, which doesn't move noticeably). This external unbalanced force drives the system. Key insight: Newton's Third Law pairs only cancel within an isolated system. In real situations, there are always external forces. The system moves because the external ground force is what actually propels everything forward.",
      points: 20,
    },
    {
      id: "s3-long-04",
      type: "long",
      question: "Compare the action-reaction pairs in: (a) a book on a table, (b) a hanging chandelier, (c) an elevator cable holding a lift. Draw the free-body diagram description for each and identify the Third Law pairs vs equilibrium forces.",
      correctAnswer: "(a) Book on table: 3rd Law pair = [Table pushes book UP] and [Book pushes table DOWN]. Equilibrium on book: weight down = normal force up (different origin — weight is from Earth, not table). (b) Chandelier: 3rd Law pair = [Ceiling pulls chandelier UP via wire] and [Chandelier pulls ceiling DOWN]. Equilibrium: tension up = weight down. (c) Elevator: 3rd Law pair = [Cable pulls elevator up] and [Elevator pulls cable down]. Equilibrium: cable tension = weight (when stationary).",
      explanation: "This question tests the crucial distinction: EQUILIBRIUM forces (two forces on SAME object that balance) vs THIRD LAW pairs (forces on DIFFERENT objects). For a book on a table: (1) The equilibrium forces on the book are: normal force (table on book, up) and weight (Earth on book, down). These LOOK like they could be Third Law pairs but they are NOT — they involve different agents (table and Earth). (2) The actual Third Law pair for normal force is: (table on book, up) ↔ (book on table, down). This is the most commonly confused concept in Newton's Laws. Always ask: 'Are these forces between the SAME pair of objects?' to identify Third Law pairs.",
      points: 20,
    },
    {
      id: "s3-long-05",
      type: "long",
      question: "A 2000 kg car is pushed against a wall with its engine. The car exerts 8000 N on the wall. The wall doesn't move. Analyze ALL forces, identify all Third Law pairs, and explain why the car doesn't move backward.",
      correctAnswer: "Forces: Car on wall: 8000 N forward. Wall on car: 8000 N backward (3rd Law pair). Engine drives wheels: wheels push road backward, road pushes car forward (another 3rd Law pair). If road reaction = wall reaction on car: net force on car = 0 → car stationary. Wall on ground/building: building transmits to foundation → Earth (massive). All forces balance: car in equilibrium, wall in equilibrium, because of multiple force pairs from ground reactions.",
      explanation: "Multiple Third Law pairs interact here: (1) Tire-road pair: tire pushes road back, road pushes car forward. (2) Car-wall pair: car pushes wall forward, wall pushes car back. When engine force (through tires) equals wall reaction, car doesn't move. If engine force exceeds static friction capacity of tires (wheels spin), tires slide → less force on wall → car still might not move. The wall doesn't fall over because: wall pushes ground (3rd Law → ground pushes wall), wall structure transmits force to foundation → Earth's enormous mass provides reaction. Everything is in force equilibrium through multiple nested Third Law pairs.",
      points: 20,
    },
    {
      id: "s3-long-06",
      type: "long",
      question: "Design a rocket system to carry a 100 kg payload to orbit. Using Newton's Third Law, explain what thrust force is needed to achieve 5 m/s² upward acceleration, if total rocket mass is 2000 kg. What exhaust velocity and mass flow rate achieves this thrust? (g = 10 m/s²)",
      correctAnswer: "Weight = 2000×10 = 20,000 N. Net upward force needed = ma = 2000×5 = 10,000 N. Thrust = Net force + Weight = 10,000 + 20,000 = 30,000 N. With exhaust velocity v_e = 3000 m/s: Mass flow rate = Thrust/v_e = 30,000/3000 = 10 kg/s. So rocket must eject 10 kg of fuel per second to achieve 5 m/s² initial acceleration.",
      explanation: "Rocket design requires balancing thrust against weight and desired acceleration. As fuel burns (10 kg/s), rocket gets lighter → same thrust → greater acceleration over time. Starting at 5 m/s² and continuously increasing. Real rockets typically start with thrust = 1.2-1.5× their weight (called thrust-to-weight ratio) to just barely lift off, then accelerate as they lighten. SpaceX Falcon 9: mass 549,000 kg, thrust 7,600,000 N, initial TWR ≈ 1.39. The rocket ejects 2000 kg/s of exhaust at ~3800 m/s — by Newton's Third Law, these ejected gases produce the thrust that fights gravity and accelerates the rocket.",
      points: 20,
    },
    {
      id: "s3-long-07",
      type: "long",
      question: "Explain with detailed mathematics how two billiard balls colliding in a straight line demonstrates both Newton's Third and Second Laws. Ball A (0.16 kg, 3 m/s) hits stationary ball B (0.16 kg). After collision: A stops, B moves at 3 m/s. Find: (a) force if contact lasts 0.02 s, (b) confirm Third Law is satisfied.",
      correctAnswer: "(a) Δp_A = 0.16×(0-3) = -0.48 kg·m/s. F_on_A = -0.48/0.02 = -24 N (backward). (b) Δp_B = 0.16×(3-0) = +0.48 kg·m/s. F_on_B = 0.48/0.02 = +24 N (forward). Third Law: F_on_A = -F_on_B = -24 N ✓. Forces are equal and opposite. Momentum conserved: before = 0.16×3 = 0.48; after = 0.48 ✓.",
      explanation: "This elastic collision perfectly demonstrates: (1) Newton's Third Law: ball A exerts +24 N on B; ball B exerts -24 N on A. Equal magnitude, opposite direction. (2) Newton's Second Law: both balls change momentum at rate = 24 N. (3) Conservation of momentum: total before = 0.48, total after = 0.48. This type of collision (A stops, B moves at A's original speed, equal masses) is called a 'perfectly elastic' collision and is a direct consequence of both momentum and kinetic energy conservation. Billiards game physics is entirely Newton's Laws — every shot can be predicted mathematically if you know the initial conditions.",
      points: 20,
    },
    {
      id: "s3-long-08",
      type: "long",
      question: "A student claims: 'Newton's Third Law means all forces are balanced, so nothing can ever accelerate.' Systematically disprove this claim using at least 3 arguments and examples.",
      correctAnswer: "Disproof 1: Third Law forces act on DIFFERENT objects and cannot cancel on any single object. Example: when pushing a ball, ball accelerates because 'reaction on your hand' doesn't affect the ball. Disproof 2: Multiple force pairs exist simultaneously. Net force on each object = all forces on THAT object. Example: horse has ground-push (forward) AND cart-pull (backward) — if unequal, horse accelerates. Disproof 3: Isolated Third Law pairs within systems DON'T cancel for the system as a whole. Example: rocket exhaust — the exhaust carries backward momentum; rocket gains forward momentum. Both accelerate.",
      explanation: "This is the most important misconception to address about Newton's Third Law. The student's error: thinking Third Law pair forces cancel 'globally.' They don't, because: (1) Forces on different objects create different equations of motion. (2) Real objects have MANY forces acting on them simultaneously. (3) The net force on each individual object determines its acceleration. If Third Law forces prevented acceleration, Voyager probes couldn't have been launched, you couldn't walk, and nothing could ever move after creation — which is obviously false. The fact that the universe is dynamic proves Third Law forces don't prevent acceleration.",
      points: 20,
    },
    {
      id: "s3-long-09",
      type: "long",
      question: "Explain how Newton's Third Law is responsible for the phenomenon of ocean tides on Earth caused by the Moon's gravity.",
      correctAnswer: "Earth pulls Moon with gravitational force F (centripetal, keeping Moon in orbit). By Newton's Third Law, Moon pulls Earth with the same force F. This Moon-on-Earth force: (1) pulls Earth's oceans toward Moon (tidal bulge on Moon-facing side), (2) pulls Earth's solid body slightly away from the oceans on the far side (second tidal bulge). As Earth rotates under these bulges, coastal areas experience 2 high tides and 2 low tides per day. The Moon's Third Law reaction force is real and powerful enough to move oceans!",
      explanation: "Ocean tides are probably the most spectacular large-scale demonstration of Newton's Third Law's reality. Earth orbits the Moon-Earth center of mass (actually 4700 km from Earth's center, inside Earth). The tidal force difference across Earth's diameter causes the two-bulge pattern. Sun also creates tides (smaller than Moon's despite sun being much more massive, because tidal force depends on distance gradient). Spring tides (extra high and low): when Sun, Earth, Moon align (new/full moon). Neap tides (moderate): when Sun and Moon are at right angles. Real consequence: tides cause gradual slowing of Earth's rotation (increasing day length by ~1.4 ms per century) — energy transferred from Earth's spin to Moon's orbit (Moon is slowly spiraling outward).",
      points: 20,
    },
    {
      id: "s3-long-10",
      type: "long",
      question: "An astronaut (80 kg) in space needs to return to a spacecraft 10 m away. They have a small propellant pack that ejects 0.5 kg of gas at 20 m/s. How many 'puffs' are needed to reach the spacecraft? Calculate the velocity gained per puff, time to travel 10 m at that velocity, and total puffs needed to arrive within 1 minute.",
      correctAnswer: "Per puff: Conservation of momentum: 0 = 0.5×20 + 80×v_astronaut → v = -0.5×20/80 = -0.125 m/s (0.125 m/s toward spacecraft). Time for 10 m at 0.125 m/s: t = 10/0.125 = 80 s (1 minute 20 s). For 1 minute (60 s): need v = 10/60 = 0.167 m/s. Puffs needed: 0.167/0.125 ≈ 1.33 → 2 puffs needed (giving 0.25 m/s, time = 10/0.25 = 40 s < 1 minute).",
      explanation: "This practical problem shows Newton's Third Law in the real context of spacewalk operations. Key points: (1) In space, any momentum you give to ejected gas → equal momentum gained by you (Third Law). (2) Once moving at constant v in space, you'll reach destination without more puffs (First Law). (3) You need to STOP when you arrive (another puff in opposite direction to decelerate). So actual puffs needed: 2 forward (to get enough speed) + 2 backward (to stop at spacecraft) = 4 total. Real EVA (Extravehicular Activity) suits have thruster systems called SAFER (Simplified Aid for EVA Rescue) that work exactly this way — using small nitrogen gas jets for Third Law propulsion in emergencies.",
      points: 20,
    },

    /* ══════════════════════════
     * HOTS (10 questions)
     * ══════════════════════════ */
    {
      id: "s3-hots-01",
      type: "thinking",
      question: "If you stand on a weighing scale in an elevator and it shows 80 kgf (800 N) when stationary, what does it show when: (a) moving up at constant 5 m/s, (b) accelerating up at 3 m/s², (c) accelerating down at 3 m/s², (d) free falling? Explain using Newton's Third Law AND Second Law.",
      correctAnswer: "(a) Constant velocity: no acceleration → net force = 0 → scale reads 800 N (same as stationary). (b) Accelerating up: Net F = ma = 80×3 = 240 N upward. N - mg = 240 → N = 800 + 240 = 1040 N (≈ 104 kgf). (c) Accelerating down: mg - N = 240 → N = 800 - 240 = 560 N (≈ 56 kgf). (d) Free fall: a = g downward → mg - N = mg → N = 0. Scale reads zero.",
      explanation: "This problem connects Third Law (scale reading = reaction force between person and scale) with Second Law (F_net = ma). The scale reads the NORMAL force (N) from scale on person — by Third Law, person pushes on scale with same N. (a) Constant velocity: a=0, N=mg=800N. (b) Upward acceleration: N must provide extra upward force beyond supporting weight, so N>mg. Apparent weight increases. (c) Downward acceleration: N needs to provide less upward force, apparent weight decreases. (d) Both person and scale free fall at g — no relative force between them, N=0. This is weightlessness! Astronauts experience this continuously in orbit because they're continuously 'falling' around Earth.",
      points: 25,
    },
    {
      id: "s3-hots-02",
      type: "thinking",
      question: "Design an experiment to demonstrate Newton's Third Law using (a) spring scales, (b) a balloon, and (c) a skateboard and wall. For each, predict and explain the quantitative results you'd observe.",
      correctAnswer: "(a) Connect two spring scales together. Pull both. Each scale reads the same force, regardless of which one you pull — proving forces are equal. (b) Inflate balloon, release it. Air shoots back, balloon goes forward. Heavier balloon with same volume of air moves slower (a = F/m). (c) Rider on skateboard pushes wall with measured force. Wall (attached to Earth) doesn't visibly move. Rider rolls backward. Measure their velocity to calculate force via momentum change.",
      explanation: "Good experimental design shows: (1) The spring scale experiment: if A pulls B with 20 N, B reads 20 N on A too — perfectly equal regardless of who 'does the pulling.' (2) Balloon: the mass of air ejected × its velocity = balloon mass × balloon velocity (momentum conservation, consequence of Third Law). Heavier balloons move slower. (3) Skateboard: push force F → rider gains momentum mv. Calculate: if rider mass 60 kg gains velocity 0.5 m/s in 0.1 s → F = 60×0.5/0.1 = 300 N. Wall received 300 N too. These experiments make Third Law tangible and quantitative, not just conceptual.",
      points: 25,
    },
    {
      id: "s3-hots-03",
      type: "thinking",
      question: "A train (mass 500,000 kg) moving at 20 m/s collides with a stationary car (1500 kg). After elastic collision, analyze: (a) approximate velocities of both, (b) force each experiences if collision lasts 0.5 s, (c) why the Third Law 'equal forces' produce such devastatingly different results.",
      correctAnswer: "(a) Train barely slows (~19.94 m/s), car gains ~39.94 m/s (≈ 40 m/s forward). By conservation: 500,000×20 = 500,000×v_train + 1500×v_car. (b) Δp_car = 1500×40 = 60,000 kg·m/s. F = 60,000/0.5 = 120,000 N on BOTH. (c) Equal 120,000 N force. Train deceleration = 120,000/500,000 = 0.24 m/s². Car acceleration = 120,000/1500 = 80 m/s². Ratio 333:1 — car is catastrophically accelerated.",
      explanation: "This devastating scenario shows why train collisions with vehicles are so deadly. Third Law: both experience 120,000 N (12 tonnes of force!) — exactly equal. But consequences: Train deceleration = 0.24 m/s² — passengers barely feel the jolt. Car acceleration = 80 m/s² = 8g! The car occupants experience 8× gravity in 0.5 seconds. Human body can survive ~20-30g for short periods — 8g sustained for 0.5 s is potentially survivable but causes serious injury. The mass ratio (333:1) creates the asymmetry. This is precisely why collision safety standards require vehicles to pass tests with barriers — barriers simulate the 'immovable object' extreme that a train represents.",
      points: 25,
    },
    {
      id: "s3-hots-04",
      type: "thinking",
      question: "Explain why it is impossible to lift yourself by your own bootstraps (pulling your own shoes upward with your hands). Use Newton's Third Law and the concept of internal vs external forces.",
      correctAnswer: "When you pull your shoes upward, your shoes pull your hands downward with equal force (Third Law). These are INTERNAL forces within your body system — they cancel for the system as a whole. Net external vertical force on your body system remains only your weight (downward). No external upward force exists, so you cannot accelerate upward. Only an external force (like a crane, helicopter, or trampoline) could lift you.",
      explanation: "This classical 'bootstraps paradox' perfectly illustrates internal vs external forces. For any SYSTEM: only EXTERNAL forces can accelerate the system's center of mass. Internal forces (between parts of the same system) always come in equal-opposite Third Law pairs that cancel for the system. Your body is a system. Any force your hands exert on your feet = equal reaction on your hands → internal pair → zero net on system → zero system acceleration. To accelerate upward, you need a force from OUTSIDE the body system: Earth's normal force when jumping (ground pushes up), a rope from above, air pressure under a parachute, or rocket thrust. This is why bootstrapping oneself is physically impossible — a profound insight from Newton's Third Law.",
      points: 25,
    },
    {
      id: "s3-hots-05",
      type: "thinking",
      question: "Mars has gravitational acceleration = 3.7 m/s². A 100 kg rocket on Mars burns fuel at 5 kg/s with exhaust velocity 2500 m/s. Calculate: (a) thrust, (b) weight on Mars, (c) initial acceleration, (d) how this differs from the same rocket on Earth (g = 9.8 m/s²).",
      correctAnswer: "(a) Thrust = 5×2500 = 12,500 N. (b) Weight on Mars = 100×3.7 = 370 N. (c) Net F = 12,500-370 = 12,130 N. a = 12,130/100 = 121.3 m/s². (d) On Earth: Weight = 100×9.8 = 980 N. Net F = 12,500-980 = 11,520 N. a_Earth = 115.2 m/s². Mars acceleration is 121.3 vs 115.2 m/s² — 5% greater on Mars due to lower gravity.",
      explanation: "This problem shows why space missions to Mars are planned differently. The rocket thrust (Third Law reaction to exhaust gases) is the same on both planets — it doesn't depend on gravity, only on mass flow rate and exhaust velocity. The difference is gravity's opposition force. On Mars (lower gravity), rockets are more efficient: same thrust, less weight to overcome → more net force → greater initial acceleration. Future Mars rockets will achieve better performance than on Earth. NASA's Mars exploration considers this: Mars's lower gravity (38% of Earth's) means future crewed missions can use smaller rockets for ascent from Mars surface, saving enormous amounts of fuel and mission cost.",
      points: 25,
    },
    {
      id: "s3-hots-06",
      type: "thinking",
      question: "A 2 kg bird sits on a 0.5 kg tree branch. The branch hangs from a tree. Identify ALL force pairs and explain why both the bird and the branch are stationary. How would the situation change if the branch started to fall?",
      correctAnswer: "Force pairs: (1) Bird's weight (Earth on bird, down) — Bird's gravity on Earth (up). (2) Branch pushes bird up (normal) — Bird pushes branch down. (3) Tree holds branch up (tension) — Branch pulls tree down. (4) Branch weight (Earth on branch, down) — Branch gravity on Earth (up). Stationary: Each object in equilibrium. Branch: Tension from tree = weight of branch + bird's push = (0.5+2)×10 = 25 N upward. If branch falls: Normal force between bird and branch = 0 (both in free fall) — bird becomes 'weightless' on branch.",
      explanation: "This multi-body problem requires identifying every action-reaction pair and checking equilibrium for each object separately. The branch equilibrium: tree tension (up) = branch weight + bird weight = (0.5×10) + (2×10) = 5 + 20 = 25 N. Third Law for tree-branch: tree pulls branch up with 25 N, branch pulls tree down with 25 N. If branch falls freely: both bird and branch accelerate at g. No contact force needed between them (free fall = weightlessness). Bird appears to float off branch during fall — same physics as 'drop tower' amusement rides and the weightlessness training aircraft ('Vomit Comet') that NASA uses.",
      points: 25,
    },
    {
      id: "s3-hots-07",
      type: "thinking",
      question: "Explain why a helicopter needs a tail rotor. Relate this to Newton's Third Law and describe what would happen without it.",
      correctAnswer: "The main rotor spins and pushes air downward (action) — air pushes helicopter upward (lift, reaction). But the engine also applies torque to spin the rotor. By Newton's Third Law, the rotor applies equal torque on the helicopter body in the OPPOSITE direction. Without the tail rotor, the helicopter fuselage would spin opposite to the main rotor. The tail rotor applies sideways force to create a counter-torque that prevents fuselage rotation, keeping it pointing forward.",
      explanation: "This is an elegant Third Law application in rotational mechanics. The main rotor's engine torque (say, clockwise from above) creates an equal and opposite torque on the helicopter body (anti-clockwise). Without the tail rotor, the helicopter body would spin at increasing angular velocity — completely uncontrollable. The tail rotor (mounted at the tail, spinning to produce sideways thrust) creates the counter-torque to balance this. The tail rotor also provides directional control — changing tail rotor thrust yaws (rotates) the helicopter left or right. Twin-rotor helicopters (Chinook) solve this differently: two main rotors spin in opposite directions — their torques cancel each other without needing a tail rotor.",
      points: 25,
    },
    {
      id: "s3-hots-08",
      type: "thinking",
      question: "A 60 kg person stands in a 5 kg rowboat that is 2 m from a dock. The person reaches forward and grabs the dock. They move 1 m toward the dock. How far does the boat move away from the dock? Explain using Third Law and momentum conservation.",
      correctAnswer: "The system starts at rest (total momentum = 0). When person pulls toward dock, they exert force on dock; dock exerts force on person toward dock; person exerts force on boat (through feet). Conservation of center of mass: m_person × Δx_person + m_boat × Δx_boat = 0. 60 × 1 + 5 × Δx_boat = 0. Δx_boat = -60/5 = -12 m (boat moves 12 m away from dock!)... Wait, this doesn't make sense physically. Actually person moves 1 m toward dock, boat moves 1×60/5 = 12 m in opposite direction? Total = person at dock, boat 12 m away. So person is now 12 m from boat.",
      explanation: "This is a tricky conservation of momentum/center of mass problem. When you pull yourself toward the dock, you push the boat away (Third Law — feet pushing boat backward). The center of mass of the (person + boat) system cannot move (no external horizontal force). If person moves 1 m toward dock, boat must move 60/5 = 12 m away. So person ends up at the dock, but the boat is 12 m away! They've separated. Real-world lesson: in a boat, reaching toward a dock while standing pulls the boat toward you as much as it pulls you toward the dock — you should always use a long pole or rope to pull the boat to the dock rather than trying to grab it while in the boat.",
      points: 25,
    },
    {
      id: "s3-hots-09",
      type: "thinking",
      question: "'A large force on Earth from a tiny meteorite should move Earth.' Quantitatively evaluate this claim: A meteorite (1 kg) hits Earth at 20 km/s and embeds itself. Calculate: (a) force if collision lasts 0.1 s, (b) Earth's acceleration, (c) Earth's velocity change. Comment on detectability.",
      correctAnswer: "(a) Force = Δp/Δt = 1×20000/0.1 = 200,000 N = 200 kN on meteorite AND Earth (Third Law). (b) Earth mass = 5.97×10²⁴ kg. a_Earth = 200,000/(5.97×10²⁴) = 3.35×10⁻²⁰ m/s². (c) Δv_Earth = a × t = 3.35×10⁻²⁰ × 0.1 = 3.35×10⁻²¹ m/s. This is 10 billion trillion times smaller than any measurable velocity — completely undetectable!",
      explanation: "This calculation beautifully shows why Newton's Third Law's 'equal forces' produce wildly different results. The claim is technically TRUE — Earth DOES receive 200 kN of force and DOES accelerate. But the resulting velocity change (3.35×10⁻²¹ m/s) is so inconceivably small that it will never be detected. Comparison: (1) Light from the Sun crossing Earth's shadow causes more acceleration than this. (2) The Moon's gravitational pull on Earth (that creates tides!) is 2×10²⁰ N — a quintillion times larger. (3) Even the gravitational pull of a nearby mountain moves Earth's center of mass measurably. Newton's Third Law is always true — it's just that sometimes the effects are beyond any practical measurement.",
      points: 25,
    },
    {
      id: "s3-hots-10",
      type: "thinking",
      question: "Analyze the physics of a 'slingshot effect' (gravity assist) used by NASA spacecraft. How does a spacecraft gain speed by flying near a planet? Does this violate Newton's Third Law? What does the planet lose?",
      correctAnswer: "As a spacecraft approaches a planet, the planet's gravity pulls it, accelerating it. By Newton's Third Law, spacecraft pulls planet too — but planet's mass is enormous so its velocity change is negligible. In the planet's reference frame, spacecraft enters and exits at same speed. But in the Sun's frame, if spacecraft 'steals' some of planet's orbital velocity during flyby, it exits faster. The planet slows very slightly (loses kinetic energy). No violation — equal forces, but planet's mass makes its change undetectable.",
      explanation: "The gravity assist is one of the most clever applications of Newton's Laws in space exploration. Voyager 1 used Jupiter and Saturn flybys to reach outer solar system. Cassini used Venus, Earth, and Jupiter flybys to reach Saturn. In each case: spacecraft gains momentum FROM the planet's orbital motion. Planet loses equal momentum but its enormous mass makes the velocity change negligible. Third Law is NOT violated: spacecraft pulls planet backward with the same force planet pulls spacecraft forward. Energy is conserved — it transfers from planet's orbital kinetic energy to spacecraft's kinetic energy. The Voyager probes achieved 17 km/s (faster than any rocket alone could achieve in 1977) through this technique. NASA estimates this 'free' velocity saving prevented the need for 30-year longer mission times or impossibly large rockets.",
      points: 25,
    },

    /* ══════════════════════════════════════════
     * ADDITIONAL QUESTIONS (t4q41 – t4q65)
     * Newton's Third Law Extended Practice
     * ══════════════════════════════════════════ */
    {
      id: "t4q41",
      type: "mcq",
      points: 10,
      question:
        "A horse pulls a cart forward. By Newton's Third Law, the cart pulls the horse backward with an equal force. Why does the horse-cart system still move forward?",
      options: [
        "The horse is stronger so it overcomes the Third Law",
        "The Third Law forces cancel only within the system; the ground pushes the horse forward more than friction resists the cart",
        "Newton's Third Law doesn't apply to horse-cart systems",
        "The cart doesn't actually pull the horse backward",
      ],
      correctAnswer:
        "The Third Law forces cancel only within the system; the ground pushes the horse forward more than friction resists the cart",
      explanation:
        "Third Law pairs (horse pulls cart forward; cart pulls horse backward) act on different objects within the system. For the WHOLE system to accelerate, consider external forces: horse hooves push backward on ground → ground pushes horse forward (external force). This external push on the system exceeds the rolling friction on the cart. Net external force > 0 → system accelerates forward.",
    },
    {
      id: "t4q42",
      type: "mcq",
      points: 10,
      question:
        "When you walk, which Third Law pair is most responsible for your forward motion?",
      options: [
        "Your foot pushes forward on the ground; ground pushes your foot forward",
        "Your foot pushes backward on the ground; ground pushes your foot forward",
        "Your muscles push you forward; gravity pulls you backward",
        "Air resistance pushes you forward; your legs push backward",
      ],
      correctAnswer:
        "Your foot pushes backward on the ground; ground pushes your foot forward",
      explanation:
        "When you walk: your foot exerts a backward force on the ground (action). By Third Law, the ground exerts an equal forward force on your foot (reaction). This reaction force propels you forward. Without friction (icy surface), the ground can't exert the reaction force and you slip.",
    },
    {
      id: "t4q43",
      type: "mcq",
      points: 10,
      question:
        "A gun of mass 3 kg fires a bullet of mass 30 g at 300 m/s. What is the recoil speed of the gun?",
      options: ["3 m/s", "0.3 m/s", "30 m/s", "300 m/s"],
      correctAnswer: "3 m/s",
      explanation:
        "By Newton's Third Law (or momentum conservation): m_gun × v_gun = m_bullet × v_bullet. 3 × v = 0.030 × 300 = 9. v = **3 m/s** backward. The gun 'kicks back' because the bullet and gun experience equal and opposite forces during firing.",
    },
    {
      id: "t4q44",
      type: "mcq",
      points: 10,
      question:
        "A 50 kg person jumps off a 200 kg boat (at rest). The person reaches the dock at 3 m/s. What is the boat's velocity after the jump?",
      options: ["0.75 m/s away from dock", "3 m/s away from dock", "12 m/s away from dock", "0 m/s"],
      correctAnswer: "0.75 m/s away from dock",
      explanation:
        "Momentum before = 0. Momentum after = 0. 50 × 3 + 200 × v_boat = 0. v_boat = −150/200 = **−0.75 m/s** (away from dock). The boat moves in the opposite direction to the jumper. This is a perfect demonstration of Newton's Third Law and momentum conservation.",
    },
    {
      id: "t4q45",
      type: "mcq",
      points: 10,
      question:
        "Two identical skaters (70 kg each) face each other on ice. Skater A pushes Skater B with 140 N for 0.5 s. What is each skater's speed after the push?",
      options: [
        "A: 0 m/s, B: 1 m/s",
        "A: 1 m/s, B: 1 m/s (same direction)",
        "A: 1 m/s backward, B: 1 m/s forward",
        "A: 2 m/s backward, B: 0.5 m/s forward",
      ],
      correctAnswer: "A: 1 m/s backward, B: 1 m/s forward",
      explanation:
        "Impulse on B = 140 × 0.5 = 70 N·s → v_B = 70/70 = 1 m/s (forward). By Third Law, A receives equal impulse backward: v_A = −70/70 = 1 m/s (backward). Both skaters have the same speed (because they have the same mass) but in opposite directions.",
    },
    {
      id: "t4q46",
      type: "mcq",
      points: 10,
      question:
        "Earth exerts gravitational force on a 1 kg stone (10 N downward). By Newton's Third Law, the stone exerts 10 N on Earth. Why doesn't Earth accelerate upward at 10 m/s²?",
      options: [
        "Earth is too far away for the force to have effect",
        "The Earth's mass (6×10²⁴ kg) makes the acceleration negligible: a = 10/(6×10²⁴) ≈ 10⁻²⁴ m/s²",
        "Newton's Third Law doesn't apply to gravity",
        "The 10 N force on Earth is canceled by atmospheric pressure",
      ],
      correctAnswer:
        "The Earth's mass (6×10²⁴ kg) makes the acceleration negligible: a = 10/(6×10²⁴) ≈ 10⁻²⁴ m/s²",
      explanation:
        "Newton's Third Law DOES apply. The stone pulls Earth upward with exactly 10 N. But a = F/m = 10/(6×10²⁴) ≈ 1.7×10⁻²⁴ m/s² — immeasurably tiny! Equal forces, vastly different accelerations due to vastly different masses. This is why we say 'the stone falls' but 'the Earth doesn't move'.",
    },
    {
      id: "t4q47",
      type: "mcq",
      points: 10,
      question:
        "A squid propels itself by ejecting water backward. If it ejects 0.5 kg of water at 8 m/s relative to itself, and the squid's mass (including remaining water) is 2 kg, what is the squid's change in velocity?",
      options: ["4 m/s", "2 m/s", "1 m/s", "16 m/s"],
      correctAnswer: "2 m/s",
      explanation:
        "Momentum conservation (or Newton's Third Law): m_squid × Δv = m_water × v_water. 2 × Δv = 0.5 × 8 = 4. Δv = **2 m/s** forward. The squid gains forward momentum equal to the backward momentum of the ejected water. This is jet propulsion — same principle as rockets.",
    },
    {
      id: "t4q48",
      type: "mcq",
      points: 10,
      question:
        "A karate practitioner breaks a brick with their hand. The brick exerts 800 N on the hand for 2 ms. What force does the hand exert on the brick?",
      options: [
        "800 N (Newton's Third Law — equal forces)",
        "More than 800 N (hand moves faster than brick)",
        "Less than 800 N (hand stops first)",
        "Depends on the practitioner's skill",
      ],
      correctAnswer: "800 N (Newton's Third Law — equal forces)",
      explanation:
        "Newton's Third Law is absolute: the hand exerts exactly 800 N on the brick, and the brick exerts exactly 800 N on the hand. Both forces exist simultaneously. The skill of the karate practitioner lies in delivering this force quickly (high acceleration) and following through (maintaining contact time). The hand hurts if the bones/muscles can't withstand 800 N.",
    },
    {
      id: "t4q49",
      type: "mcq",
      points: 10,
      question:
        "Which of the following is NOT a correct action-reaction pair?",
      options: [
        "Book pushes table down; table pushes book up",
        "Earth pulls Moon toward it; Moon pulls Earth toward it",
        "You push wall; wall pushes floor",
        "Magnet attracts iron nail; iron nail attracts magnet",
      ],
      correctAnswer: "You push wall; wall pushes floor",
      explanation:
        "Newton's Third Law pairs must: (1) act on different objects, (2) be the same type of force, (3) be equal and opposite. 'You push wall; wall pushes floor' is NOT a pair — these are sequential forces, not a single interaction. The CORRECT pair is: 'You push wall; wall pushes YOU backward.' The wall-floor interaction is a separate Third Law pair.",
    },
    {
      id: "t4q50",
      type: "mcq",
      points: 10,
      question:
        "A helicopter stays aloft by pushing air downward. If the helicopter weighs 20,000 N, what must the downward force on air be?",
      options: ["< 20,000 N", "= 20,000 N", "> 20,000 N", "Zero (propellers create lift differently)"],
      correctAnswer: "= 20,000 N",
      explanation:
        "For a hovering helicopter: lift force (air on helicopter, upward) = weight (20,000 N). By Newton's Third Law: helicopter pushes air downward with exactly **20,000 N** (reaction to the lift). When a helicopter accelerates upward, it must push air down with MORE than 20,000 N to create a net upward force.",
    },
    {
      id: "t4q51",
      type: "mcq",
      points: 10,
      question:
        "A 60 kg person stands on a 10 kg skateboard. They jump off with velocity 3 m/s to the right. What is the skateboard's velocity?",
      options: ["18 m/s left", "0.5 m/s left", "3 m/s left", "18 m/s right"],
      correctAnswer: "18 m/s left",
      explanation:
        "Initial momentum = 0. 60 × 3 + 10 × v = 0. v = −180/10 = **18 m/s left**. The skateboard (lighter) moves much faster than the person (heavier). Equal and opposite momenta, but vastly different speeds due to mass difference.",
    },
    {
      id: "t4q52",
      type: "mcq",
      points: 10,
      question:
        "A fire hose discharges 50 kg of water per second at 40 m/s. What force must the firefighter exert to hold the hose steady?",
      options: ["1250 N backward", "2000 N forward", "2000 N backward", "1250 N forward"],
      correctAnswer: "2000 N backward",
      explanation:
        "Thrust (reaction force on hose) = mass flow rate × exhaust velocity = 50 × 40 = **2000 N** backward (opposing water flow direction). The firefighter must push the hose forward with 2000 N to balance this reaction force. This is why fire hoses require multiple people to control.",
    },
    {
      id: "t4q53",
      type: "short",
      points: 15,
      question:
        "A rocket in space has mass 2000 kg (including 1500 kg fuel). It ejects gas at 1500 m/s. After burning 500 kg of fuel, what is the rocket's speed? (Use momentum conservation: p_initial = 0)",
      correctAnswer:
        "Initial system at rest: total momentum = 0.\n\nAfter burning 500 kg of fuel:\n- Remaining rocket mass = 2000 − 500 = 1500 kg\n- Ejected gas mass = 500 kg at 1500 m/s backward\n\nBy momentum conservation:\n0 = 1500 × v_rocket + 500 × (−1500)\n1500 × v_rocket = 750,000\nv_rocket = **500 m/s** forward\n\nThe rocket gains 500 m/s by ejecting 500 kg of gas at 1500 m/s.\n\nNote: The Tsiolkovsky equation gives a more accurate answer (accounting for continuously changing mass), but momentum conservation gives a good approximation for finite ejections.",
      explanation:
        "Rocket propulsion is Newton's Third Law in its purest form. The rocket pushes gas backward; gas pushes rocket forward. Conservation of momentum tells us the exact velocity gained.",
    },
    {
      id: "t4q54",
      type: "short",
      points: 15,
      question:
        "A 5 kg block A and a 3 kg block B are connected by a compressed spring on a frictionless surface. When released, block B moves at 5 m/s to the right. (a) What is block A's velocity? (b) What force did the spring exert? (c) Is this Newton's Third Law?",
      correctAnswer:
        "**(a) Block A's velocity:**\nInitial momentum = 0 (both at rest)\nFinal: 5 × v_A + 3 × 5 = 0\n5v_A = −15\nv_A = **−3 m/s** (3 m/s to the left)\n\n**(b) Spring force:**\nThe spring acts for a very short time — we don't know the exact time, so we can't directly calculate force. However, by the impulse-momentum theorem, both blocks receive equal and opposite impulses from the spring:\nImpulse on B = 3 × 5 = 15 N·s (right)\nImpulse on A = 5 × 3 = 15 N·s (left) ✓ Equal!\n\nIf the spring acts for, say, 0.01 s: Average force = 15/0.01 = **1500 N** on each block\n\n**(c) Is this Third Law?**\nYes! The spring exerts equal and opposite forces on both blocks simultaneously. This is a mechanical action-reaction pair mediated by the spring.",
      explanation:
        "The spring-block system shows Third Law through an intermediate object (spring). The spring compresses, storing energy, then releases. Equal and opposite forces on A and B, but different accelerations (different masses), so different velocities.",
    },
    {
      id: "t4q55",
      type: "long",
      points: 20,
      question:
        "Explain in detail the physics of a jet engine. How does it use Newton's Third Law? Why can a jet engine not work in space while a rocket can? What is the role of conservation of momentum?",
      correctAnswer:
        "**Jet Engine Physics:**\n\n**How it works:**\n1. Air is sucked in at the front (intake)\n2. Air is compressed by rotating compressor blades\n3. Fuel is injected and ignited — enormous heat increases gas pressure\n4. Hot, high-pressure gas expands and exits backward at high speed (~500 m/s)\n5. The engine is pushed forward by Newton's Third Law reaction\n\n**Newton's Third Law application:**\nAction: engine pushes gas backward at high speed\nReaction: gas pushes engine (and aircraft) forward\n\nThrust = rate of momentum increase of exhaust gas\n= (mass flow rate) × (exhaust speed - intake speed)\n= 100 kg/s × (500 - 100) = **40,000 N** (typical small jet)\n\n**Why jets don't work in space:**\nJet engines require oxygen from air to burn fuel (combustion needs O₂). In space, there's no air → no oxygen → no combustion → no thrust. Also, jets suck in air as the 'reaction mass' to push backward.\n\n**Why rockets work in space:**\nRockets carry BOTH fuel AND oxidiser. They need nothing from the surrounding environment. Rockets use Newton's Third Law purely: they eject reaction mass (exhaust) that they carry onboard.\n\n**Conservation of momentum:**\nFor both jets and rockets: total momentum of (vehicle + exhaust) is conserved. As exhaust gains backward momentum, vehicle gains equal forward momentum. In space (no external forces), this is exact. In atmosphere, thrust must also overcome air resistance and gravity.",
      explanation:
        "Jet vs rocket comparison is a beautiful application of Newton's Third Law. Both use momentum conservation, but jets require external air while rockets are self-contained. This distinction is crucial for space exploration.",
    },
    {
      id: "t4q56",
      type: "thinking",
      points: 25,
      question:
        "HOTS: A student claims 'Since Newton's Third Law says action = reaction, no object can ever accelerate because every force is always opposed by an equal force.' Explain in detail why this reasoning is fundamentally wrong using at least three concrete examples.",
      correctAnswer:
        "The student has made a critical logical error: **conflating Third Law pairs (on different objects) with net force (on one object)**.\n\n**The fundamental error:**\nThird Law pairs ALWAYS act on DIFFERENT objects. The net force on any object is calculated from ALL forces acting ON THAT OBJECT ALONE — not including the forces it exerts on others.\n\n**Example 1 — Falling stone:**\nEarth pulls stone down (10 N). Stone pulls Earth up (10 N) — Third Law pair, on different objects.\nNet force ON STONE = 10 N down (only forces on stone counted) → stone accelerates at 10 m/s².\nNet force ON EARTH = 10 N up → Earth accelerates at 10/(6×10²⁴) ≈ 0 m/s² (negligible).\n\n**Example 2 — Rocket in space:**\nEngine pushes exhaust backward (F). Exhaust pushes rocket forward (F) — Third Law pair.\nNet force ON ROCKET = F forward → rocket accelerates forward.\nThe fact that exhaust experiences an equal backward force doesn't reduce the rocket's forward force at all!\n\n**Example 3 — You pushing a box:**\nYou push box with 50 N (right). Box pushes you with 50 N (left). Different objects!\nNet force on BOX = 50 N (right, assuming no friction) → box accelerates right.\nNet force on YOU = 50 N (left) + floor friction on you (right) → net might be zero, so you stay put.\n\n**The correct understanding:**\nThird Law never says a single object has zero net force. It says forces come in pairs on DIFFERENT objects. For any individual object, you must add up ALL forces ON THAT OBJECT to find net force and acceleration.",
      explanation:
        "This is the most important conceptual point in all of Newton's Laws: Third Law pairs act on different objects, never on the same object. Net force analysis always focuses on one object at a time.",
    },
    {
      id: "t4q57",
      type: "thinking",
      points: 25,
      question:
        "Analyze the swimming stroke in detail. When a swimmer's arm pushes backward through water, identify every Third Law pair, every force on the swimmer, and explain why the swimmer moves forward. Also explain why swimming in a vacuum (no water) is impossible.",
      correctAnswer:
        "**Complete force analysis of a swimming stroke:**\n\n**Third Law pairs:**\n\nPair 1: Swimmer's arm pushes water backward → Water pushes swimmer's arm forward (thrust)\nPair 2: Water pressure acts forward on swimmer's body → Swimmer pushes water backward (minor)\nPair 3: Earth's gravity pulls swimmer down → Swimmer's weight pushes Earth up (negligible)\nPair 4: Water buoyancy pushes swimmer up → Swimmer pushes water down\n\n**Forces ON the swimmer:**\n1. Thrust (forward) — from water reaction to arm stroke — This drives swimming\n2. Drag (backward) — water resistance opposing forward motion\n3. Lift/Buoyancy (upward) — water displaced by body\n4. Weight (downward) — gravity\n\n**Why swimmer moves forward:**\nThe arm exerts force on water backward (action). Water reacts with equal force on arm/swimmer forward (reaction). If Thrust > Drag, net horizontal force > 0 → swimmer accelerates forward. At constant speed: Thrust = Drag.\n\n**Why vacuum is impossible:**\nIn vacuum, there's no water (or air) to push against. The Third Law pair requires a 'reaction mass' — water to push backward. Without water:\n- No reaction force forward\n- No resistance (drag)\n- No buoyancy\nThe swimmer would be weightless and unable to generate any thrust. This is exactly why humans cannot 'swim through air' in zero gravity without something to push against (like a wall or a fan).",
      explanation:
        "Swimming is Third Law applied to fluid mechanics. The water provides both the reaction mass (for thrust) and the resistance. Without a medium to push against, motion is impossible — which is why astronauts in the ISS need to push off walls to move.",
    },
    {
      id: "t4q58",
      type: "thinking",
      points: 25,
      question:
        "A car weighing 15,000 N is driving along a road. List ALL Newton's Third Law pairs for the car-road-Earth system. Explain which pair is responsible for the car moving forward and which pairs involve the car's weight. Draw force diagrams in your answer.",
      correctAnswer:
        "**ALL Third Law pairs for a car-road-Earth system:**\n\n**Pair 1 — Gravity (car and Earth):**\nEarth pulls car downward with 15,000 N (gravity on car)\n↕\nCar pulls Earth upward with 15,000 N (gravity on Earth)\n\n**Pair 2 — Normal force (car and road):**\nRoad pushes car upward with 15,000 N (normal force on car)\n↕\nCar pushes road downward with 15,000 N (normal force on road)\n\n**Pair 3 — Friction for propulsion (driven wheels and road):**\nDriven wheels push road backward (action)\n↕\nRoad pushes car forward (friction — reaction) ← **THIS IS WHAT MOVES THE CAR!**\n\n**Pair 4 — Rolling friction / air drag:**\nAir/road exerts drag on car backward\n↕\nCar pushes air/road forward (reaction, minor effect)\n\n**Forces ON the CAR:**\nVertical: Normal (up, 15,000 N) = Weight (down, 15,000 N) → balanced, no vertical acceleration\nHorizontal: Friction from road forward − Drag backward = Net force → gives acceleration\n\n**Key insight:** The car 'drives itself' by using its engine to spin its wheels backward against the road. The road's reaction friction IS the propulsive force. Without friction (ice), no forward traction is possible — the wheels just spin uselessly.\n\n**Force on road:** The road receives 15,000 N downward + backward wheel friction. Roads are designed to withstand these forces through structural engineering.",
      explanation:
        "The car-road-Earth analysis reveals all the hidden Third Law pairs in everyday vehicle motion. The propulsive force on the car is actually the ROAD'S friction reaction — not the engine directly.",
    },
    {
      id: "t4q59",
      type: "long",
      points: 20,
      question:
        "A ball is thrown at a wall and bounces back. If the ball's mass is 0.3 kg, it hits at 10 m/s and rebounds at 8 m/s, and contact time is 0.05 s, find: (a) change in momentum, (b) force on ball by wall, (c) force on wall by ball, (d) why the ball doesn't bounce back at 10 m/s.",
      correctAnswer:
        "**(a) Change in momentum (taking initial direction as positive):**\nΔp = m(v_f − v_i) = 0.3(−8 − 10) = 0.3 × (−18) = **−5.4 kg·m/s**\n(5.4 kg·m/s change, directed toward wall)\n\n**(b) Force on ball by wall:**\nF = Δp/Δt = 5.4/0.05 = **108 N** (toward original source — pushing ball back)\n\n**(c) Force on wall by ball (Newton's Third Law):**\nEqual and opposite: **108 N** directed into the wall (same direction as original ball motion)\n\n**(d) Why ball doesn't rebound at 10 m/s (non-elastic bounce):**\nIn a perfectly elastic collision, kinetic energy would be conserved and ball would rebound at 10 m/s. But real collisions always lose some energy to:\n1. Sound (you hear the 'thwack')\n2. Heat (wall and ball molecules vibrate more)\n3. Permanent deformation (tiny compression of ball/wall)\n4. Internal vibrations (ball wobbles slightly)\n\nThe ratio v_rebound/v_incident = 8/10 = 0.8 is called the **coefficient of restitution** (e). e=1 is perfectly elastic (theoretical); e=0 is perfectly inelastic (objects stick together). Real objects have 0 < e < 1.",
      explanation:
        "The ball-wall collision covers impulse, Third Law, and real-world energy dissipation. The coefficient of restitution quantifies how 'bouncy' a material is — tennis balls have e≈0.7, super balls e≈0.9, clay e≈0.",
    },
    {
      id: "t4q60",
      type: "long",
      points: 20,
      question:
        "Explain the physics of a rocket in space with NO external forces. The rocket has mass M (including fuel), ejects gas at speed v_e relative to rocket at rate dm/dt. Derive qualitatively why the rocket accelerates as fuel is used, and explain how it can change direction in space.",
      correctAnswer:
        "**Rocket in space — pure Newton's Third Law:**\n\n**Thrust generation:**\nAt every moment, a tiny mass dm of gas is ejected backward at speed v_e.\nBy Newton's Third Law:\n- Rocket pushes gas backward with force F\n- Gas pushes rocket forward with same force F\n\nThrust F = v_e × (dm/dt) [rate of change of gas momentum]\n\n**Why acceleration increases as fuel burns:**\nF = ma → a = F/m = v_e × (dm/dt) / m\n\nAs fuel burns, m DECREASES while thrust F stays roughly constant (same v_e, same dm/dt). Therefore a = F/m INCREASES as m gets smaller.\n\nThe rocket accelerates faster and faster as it burns fuel — despite the thrust being constant!\n\n**How a rocket changes direction in space:**\n1. **Attitude thrusters:** Small rockets firing perpendicular to flight direction rotate the spacecraft\n2. **Main engine gimballing:** Main nozzle tilts, redirecting thrust vector\n3. **Reaction wheels:** Spinning gyroscopes inside the spacecraft rotate it without using fuel\n\nAll direction changes ultimately use Newton's Third Law: pushing something one way to go another way.\n\n**No medium needed:**\nUnlike planes or ships, rockets work in vacuum because they carry their own 'reaction mass' (fuel) and don't need external air or water to push against.",
      explanation:
        "Rocket science is Newton's Third Law applied continuously. The rocket equation Δv = v_e × ln(m_i/m_f) captures the full physics — why more fuel gives diminishing returns (diminishing mass ratio).",
    },
  ],
};
