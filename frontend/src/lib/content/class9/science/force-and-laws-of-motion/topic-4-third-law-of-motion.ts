/**
 * FILE: topic-4-third-law-of-motion.ts
 * PURPOSE: Deep research content for Topic 4 of Force & Laws of Motion.
 *          Contains highly detailed explanations and 20 categorized questions.
 *          Modularized to ensure production-level scalability and readability.
 */
import { Topic } from "./types";

export const thirdLawOfMotion: Topic = {
  /* ═══════════════════════════════════════════
   * TOPIC 4: Newton's Third Law of Motion (Action-Reaction)
     * ═══════════════════════════════════════════ */
      id: 'third-law-of-motion',
      title: "4. Newton's Third Law of Motion: Action & Reaction",
      estimatedMinutes: 30,
      imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800',
      content: `
### The Law of Interaction
Newton's Third Law is the most intuitive of all three laws. It describes how forces always come in **pairs**:

> **"For every action, there is an equal and opposite reaction."**

This means: whenever Object A pushes on Object B, Object B pushes back on Object A with the **same magnitude** of force but in the **opposite direction**.

### Key Points About the Third Law

#### 1. Action and Reaction Act on DIFFERENT Bodies
This is the most important point students miss! The action force acts on one object, and the reaction force acts on a different object. They NEVER cancel each other out because they act on different bodies.

* **Example (Walking):** When you walk, your foot pushes the ground backward (action). The ground pushes your foot forward (reaction). The action is on the ground; the reaction is on you. That's what makes you move forward!

#### 2. Both Forces Act Simultaneously
There is no delay between action and reaction. They exist at exactly the same instant. You cannot have one without the other.

#### 3. They Are Always Equal in Magnitude
No matter what, the forces are exactly equal. A small ant pushing against a wall exerts a force on the wall, and the wall exerts the exact same force back on the ant.

### Real-World Examples

#### Walking
Your foot pushes backward on the ground (action). The ground pushes forward on your foot (reaction). You move forward because the reaction force of the ground acts on your body.

#### Swimming
A swimmer pushes water backward with their hands and feet (action). The water pushes the swimmer forward (reaction). This is why you can swim — by pushing water one way, you go the other way!

#### Rocket Propulsion
A rocket engine burns fuel and pushes hot exhaust gases downward at extremely high speed (action). The exhaust gases push the rocket upward with an equal and opposite force (reaction). **This is why rockets work in space even though there is no air to push against!** The rocket pushes against its own exhaust, not against air.

#### Gun Recoil
When a gun fires a bullet forward (action), the bullet pushes the gun backward (reaction). This backward push is called **recoil**. The gun jumps backward in your hand. Since the gun is much heavier than the bullet, it moves backward much slower (F = ma: same force, bigger mass, smaller acceleration).

#### Why Don't Action-Reaction Forces Cancel?
Students often ask: "If every force has an equal and opposite reaction, why doesn't everything just stay still?" The answer is that action and reaction act on **different objects**. 

When you push a wall:
- Your force on the wall (action) → acts on the wall
- Wall's force on you (reaction) → acts on you
These are on different bodies, so they don't cancel. The wall doesn't move because it's fixed to the ground. You don't fall backward because friction holds your feet.

### Jet Engines and Propulsion
Jet engines work on the same principle as rockets. They suck in air from the front, mix it with fuel, burn it, and blast the hot gases out the back at tremendous speed (action). The hot gases push the airplane forward (reaction). This is called **thrust**.
      `,
      questions: [
        /* ── MCQs (5) ── */
        {
          id: 'q61', type: 'mcq', points: 10,
          question: "Newton's Third Law states that action and reaction forces:",
          options: ['Act on the same body', 'Act on different bodies', 'Cancel each other out', 'Are unequal in magnitude'],
          correctAnswer: 'Act on different bodies',
          explanation: "The action force is on one object, the reaction force is on the other. They never cancel because they're on different bodies."
        },
        {
          id: 'q62', type: 'mcq', points: 10,
          question: 'When you walk, what provides the forward force?',
          options: ['Your leg muscles directly', 'Air resistance', "The ground's reaction force", 'Gravity'],
          correctAnswer: "The ground's reaction force",
          explanation: "Your foot pushes the ground backward (action). The ground pushes your foot forward (reaction). The ground's reaction is what moves you forward."
        },
        {
          id: 'q63', type: 'mcq', points: 10,
          question: 'A rocket works in space because:',
          options: ['It pushes against air', 'Exhaust gases push the rocket forward', 'Gravity pulls it forward', 'Magnetic fields in space'],
          correctAnswer: 'Exhaust gases push the rocket forward',
          explanation: "The rocket pushes exhaust gases backward (action), and the gases push the rocket forward (reaction). No air is needed."
        },
        {
          id: 'q64', type: 'mcq', points: 10,
          question: 'When a bullet is fired from a gun, the gun recoils because of:',
          options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Conservation of Energy"],
          correctAnswer: "Newton's Third Law",
          explanation: "The gun pushes the bullet forward (action). The bullet pushes the gun backward (reaction). This backward push is recoil."
        },
        {
          id: 'q65', type: 'mcq', points: 10,
          question: 'A man is standing on a weighing scale in an elevator. If the elevator accelerates upward, the scale reading will:',
          options: ['Decrease', 'Remain the same', 'Increase', 'Become zero'],
          correctAnswer: 'Increase',
          explanation: "When the elevator accelerates upward, the floor pushes up harder on the man (to accelerate him), so the scale reads more than his actual weight."
        },

        /* ── Short Answer (5) ── */
        {
          id: 'q66', type: 'short', points: 15,
          question: "State Newton's Third Law of Motion.",
          correctAnswer: "For every action, there is an equal and opposite reaction. When one body exerts a force on a second body, the second body exerts an equal force in the opposite direction on the first body.",
          explanation: "The formal statement of the Third Law."
        },
        {
          id: 'q67', type: 'short', points: 15,
          question: "Why can't a person swim in the air?",
          correctAnswer: "Swimming works because water is dense enough to push back. When you push water backward with your hands, the water exerts a forward reaction force. Air is too thin (low density) to provide a significant reaction force. The reaction force from pushing air is negligible, so you cannot propel yourself forward.",
          explanation: "Compares reaction forces in different mediums."
        },
        {
          id: 'q68', type: 'short', points: 15,
          question: 'If action and reaction are equal and opposite, why do objects still move?',
          correctAnswer: "Because action and reaction act on DIFFERENT objects, not on the same object. They don't cancel each other out. The net force on each individual object determines its motion independently.",
          explanation: "Addresses the most common misconception about the Third Law."
        },
        {
          id: 'q69', type: 'short', points: 15,
          question: 'What provides the reaction force when a swimmer pushes water backward?',
          correctAnswer: "The water provides the reaction force. When the swimmer's hands push water backward (action), the water pushes the swimmer forward (reaction), propelling the swimmer ahead.",
          explanation: "Action-reaction pair in swimming."
        },
        {
          id: 'q70', type: 'short', points: 15,
          question: 'Why does a gun recoil when a bullet is fired?',
          correctAnswer: "When the gun fires the bullet forward (action force on bullet), the bullet exerts an equal and opposite force on the gun (reaction force on gun). This reaction force pushes the gun backward, causing recoil.",
          explanation: "Classic Third Law application."
        },

        /* ── Long Answer (5) ── */
        {
          id: 'q71', type: 'long', points: 20,
          question: "Explain how a rocket works in the vacuum of space using Newton's Third Law. Why doesn't it need air to push against?",
          correctAnswer: "A rocket carries its own fuel and oxidizer. When the fuel burns inside the combustion chamber, it produces hot exhaust gases at very high pressure. These gases are forced out of the rocket nozzle at tremendous speed — this is the ACTION force (rocket pushing gases downward). By Newton's Third Law, the gases push the rocket upward with an equal REACTION force — this is the thrust. The rocket pushes against its own exhaust gases, NOT against air. This is why rockets work perfectly in the vacuum of space where there is no air at all. In fact, rockets are slightly MORE efficient in space because there is no air resistance to fight against.",
          explanation: "Detailed explanation of rocket propulsion."
        },
        {
          id: 'q72', type: 'long', points: 20,
          question: "A person is standing in a boat near the shore. Explain what happens when they try to step onto the shore, and why. Use Newton's Third Law.",
          correctAnswer: "When the person pushes the shore/dock with their front foot to step off (or pushes the boat with their back foot), their foot exerts a backward force on the boat (action). By Newton's Third Law, the boat exerts a forward force on the person (reaction). However, the boat is free to move on the water (no friction). So the boat moves BACKWARD while the person moves forward. If the person pushes too hard, the boat slides back quickly, and the person may fall into the water because their back foot loses support. The same principle explains why you should step gently off a small boat.",
          explanation: "Real-world Third Law scenario with consequences."
        },
        {
          id: 'q73', type: 'long', points: 20,
          question: 'Identify the action-reaction pairs in the following situation: A ball is falling towards the ground due to gravity.',
          correctAnswer: "There are two action-reaction pairs: Pair 1: The Earth pulls the ball downward with gravitational force (action). The ball pulls the Earth upward with an equal gravitational force (reaction). The ball accelerates noticeably because it has small mass, but the Earth accelerates imperceptibly because it has enormous mass. Pair 2: When the ball hits the ground — the ball pushes the ground with a contact force (action), and the ground pushes the ball back upward (reaction), causing it to bounce.",
          explanation: "Identifies multiple action-reaction pairs in a single scenario."
        },
        {
          id: 'q74', type: 'long', points: 20,
          question: "Explain with examples how jet engines, propeller boats, and fire hoses all work on the principle of Newton's Third Law.",
          correctAnswer: "Jet Engines: Hot gases are expelled backward at high speed (action). The plane is pushed forward (reaction). Propeller Boats: The propeller pushes water backward (action). The water pushes the boat forward (reaction). Fire Hoses: Water rushes out of the hose at high speed forward (action). The hose pushes backward on the firefighter (reaction), which is why firefighters must brace themselves. In all three cases, the device pushes a fluid (gas or liquid) in one direction and moves in the opposite direction due to the reaction force.",
          explanation: "Connects the Third Law to multiple engineering applications."
        },
        {
          id: 'q75', type: 'long', points: 20,
          question: 'A horse is pulling a cart. According to the Third Law, the cart pulls the horse back with an equal force. Then how does the horse-cart system move forward?',
          correctAnswer: "This is a classic puzzle. The key is to look at the external forces on the SYSTEM (horse + cart together). The horse pushes the ground backward with its hooves (action). The ground pushes the horse forward with friction (reaction). This forward friction force is an EXTERNAL force on the horse-cart system. The horse pulling the cart and the cart pulling the horse back are INTERNAL forces that cancel within the system. As long as the forward friction from the ground exceeds the backward friction on the cart's wheels, there is a net external forward force, and the entire system accelerates forward.",
          explanation: "Resolves the classic horse-cart paradox by analyzing internal vs. external forces."
        },

        /* ── Thinking / HOTS (5) ── */
        {
          id: 'q76', type: 'thinking', points: 25,
          question: "If you are standing on a perfectly frictionless frozen lake and you throw your backpack in one direction, what happens to you? Calculate the direction and estimate why.",
          correctAnswer: "You will move in the OPPOSITE direction to the backpack. When you throw the backpack forward (action), the backpack pushes you backward (reaction). On a frictionless surface, there is nothing to stop this backward motion, so you will slide backward indefinitely. If you throw the backpack at 5 m/s and it weighs 5 kg, and you weigh 50 kg, by conservation of momentum: 5 × 5 = 50 × v, so v = 0.5 m/s backward. This is actually how astronauts would propel themselves in space!",
          explanation: "Combines the Third Law with conservation of momentum on a frictionless surface."
        },
        {
          id: 'q77', type: 'thinking', points: 25,
          question: "When the Earth attracts an apple downward with gravity, the apple also attracts the Earth upward with the same force. Why don't we see the Earth move?",
          correctAnswer: "The force IS equal on both. But acceleration = Force/Mass. The Earth's mass is approximately 6 × 10²⁴ kg, while the apple is about 0.1 kg. The apple's acceleration due to Earth's gravity = 9.8 m/s² (very noticeable). The Earth's acceleration due to the apple = F/(6 × 10²⁴), which is an incredibly tiny number (approximately 10⁻²⁵ m/s²). This acceleration is so unimaginably small that it is completely undetectable. The Earth DOES move, just by an amount far too small to ever measure.",
          explanation: "Resolves a deep conceptual puzzle about the Third Law and gravity."
        },
        {
          id: 'q78', type: 'thinking', points: 25,
          question: 'An astronaut is floating in space, completely untethered, with no tools. How can they get back to the spacecraft using only physics?',
          correctAnswer: "They can use Newton's Third Law by throwing something in the direction OPPOSITE to the spacecraft. If they take off a glove and throw it away from the spacecraft, the reaction force will push them toward the spacecraft. They could also blow air in one direction, though this would produce very little force. Alternatively, they could use the propulsion system in their spacesuit (if available) which works on the same principle — expelling gas in one direction to move in the other.",
          explanation: "Creative survival application of the Third Law in space."
        },
        {
          id: 'q79', type: 'thinking', points: 25,
          question: 'During a head-on collision between a truck and a small car, both experience the same force (Third Law). But the small car suffers more damage. Why?',
          correctAnswer: "By Newton's Third Law, the forces are indeed equal and opposite. However, by Newton's Second Law (F = ma), the smaller car experiences much greater ACCELERATION (deceleration, in this case) because it has much less mass. Greater deceleration means the passengers and structure of the car undergo a more violent change in velocity. The truck, being much heavier, decelerates much less. Additionally, the crumple zones of the smaller car absorb less energy, leading to more structural damage and higher risk of injury to passengers.",
          explanation: "Combines the Third Law with the Second Law to explain a real-world observation."
        },
        {
          id: 'q80', type: 'thinking', points: 25,
          question: "Birds fly by flapping their wings. Explain the action-reaction pairs involved in bird flight and how birds generate both lift and forward thrust.",
          correctAnswer: "When a bird flaps its wings downward, the wings push air downward (action). By Newton's Third Law, the air pushes the wings (and hence the bird) upward (reaction) — this provides LIFT. On the forward stroke, the wings are angled so they push air backward and downward. The reaction force has both an upward component (lift) and a forward component (thrust). The wing shape (airfoil) also creates a pressure difference: lower pressure above the wing and higher pressure below, adding to the lift. This combination of Third Law forces allows birds to fly.",
          explanation: "Advanced application of the Third Law to aerodynamics."
        }
      ]
    };
