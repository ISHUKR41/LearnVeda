/**
 * FILE: topic-2-first-law-of-motion.ts
 * PURPOSE: Deep research content for Topic 2 of Force & Laws of Motion.
 *          Contains highly detailed explanations and 20 categorized questions.
 *          Modularized to ensure production-level scalability and readability.
 */
import { Topic } from "./types";

export const firstLawOfMotionInertia: Topic = {
  /* ═══════════════════════════════════════════
   * TOPIC 2: Newton's First Law of Motion — The Law of Inertia
     * ═══════════════════════════════════════════ */
      id: 'first-law-of-motion-inertia',
      title: "2. Newton's First Law of Motion: The Law of Inertia",
      estimatedMinutes: 30,
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
      content: `
### What is the First Law?
Sir Isaac Newton gave us three fundamental laws that describe how the universe moves. The First Law states:
> **"An object at rest remains at rest, and an object in motion remains in motion at constant speed and in a straight line unless acted on by an unbalanced force."**

This law is essentially the definition of **Inertia**. 
Inertia is the natural tendency of objects to resist any change in their state of motion. If they are sleeping (at rest), they want to keep sleeping. If they are running, they want to keep running!

### Mass is the Measure of Inertia
Heavier objects have more inertia than lighter objects. 
* **Real-world Example:** Imagine kicking a football versus kicking a solid iron ball of the same size. The football flies away easily. The iron ball barely moves and hurts your foot! Why? Because the iron ball has more mass, hence more *inertia*. It heavily resists your attempt to change its state of rest.

### Types of Inertia

#### 1. Inertia of Rest
The tendency of a body to remain at rest.
* **Example (The Carpet Dust):** When you beat a dusty carpet with a stick, the carpet is suddenly pushed forward (unbalanced force). But the dust particles try to remain at rest due to inertia. Consequently, the carpet moves away, and the dust falls down due to gravity.
* **Example (The Coin on the Card):** Place a card on a glass tumbler and a coin on top. Flick the card fast. The card flies away, but the coin drops straight into the glass because of its inertia of rest.

#### 2. Inertia of Motion
The tendency of a moving body to continue moving in a straight line.
* **Example (The Moving Bus):** When you are standing in a moving bus and the driver suddenly hits the brakes, you fall *forward*. The bus stopped, but your body (due to inertia of motion) wants to keep moving forward!
* **Example (The Athlete):** A long jumper runs a considerable distance before taking a jump. The inertia of motion gained by running helps them jump a longer distance.

#### 3. Inertia of Direction
The tendency of a body to oppose any change in its direction of motion.
* **Example (The Sharp Turn):** When a fast-moving car takes a sharp turn to the left, you feel pushed to the right side of the car. Your body wants to continue going straight, but the car is turning.
* **Example (Wet Umbrella):** When you spin a wet umbrella, the water drops fly off tangentially. They want to keep moving in a straight line, but the umbrella forces a circular path.

### Why do we need Seatbelts?
Seatbelts are life-savers based entirely on Newton's First Law. If a car is traveling at 100 km/h and crashes into a wall, the car stops immediately. However, the passengers inside are still traveling at 100 km/h! Due to inertia of motion, they will fly forward into the windshield unless an unbalanced force stops them. The seatbelt provides that necessary unbalanced force safely across the strong bones of the body.

### Galileo's Thought Experiment
Before Newton, the Italian scientist **Galileo Galilei** proposed a thought experiment: If you roll a ball on a smooth, level surface with no friction, the ball would continue rolling forever. This idea directly inspired Newton's First Law. Galileo showed that it is the *natural state* of objects to keep moving — it's friction and air resistance that stop them, not some inherent tendency to "want" to stop.
      `,
      questions: [
        /* ── MCQs (5) ── */
        {
          id: 'q21', type: 'mcq', points: 10,
          question: "Newton's First Law of motion is also known as:",
          options: ['Law of momentum', 'Law of inertia', 'Law of action and reaction', 'Law of gravitation'],
          correctAnswer: 'Law of inertia',
          explanation: 'The first law describes inertia, which is the resistance of any physical object to any change in its velocity.'
        },
        {
          id: 'q22', type: 'mcq', points: 10,
          question: 'Which has more inertia: a 5kg bowling ball or a 50g tennis ball?',
          options: ['Tennis ball', 'Bowling ball', 'Both have the same inertia', 'Inertia depends on speed, not mass'],
          correctAnswer: 'Bowling ball',
          explanation: 'Inertia is directly proportional to mass. The bowling ball has much more mass, therefore more inertia.'
        },
        {
          id: 'q23', type: 'mcq', points: 10,
          question: 'When a hanging carpet is beaten with a stick, dust particles fall out. This is due to:',
          options: ['Inertia of motion', 'Inertia of direction', 'Inertia of rest', 'Conservation of momentum'],
          correctAnswer: 'Inertia of rest',
          explanation: 'The dust particles tend to remain at rest while the carpet moves away when beaten, causing them to separate.'
        },
        {
          id: 'q24', type: 'mcq', points: 10,
          question: 'If you are in a spaceship far from any gravity and you throw a rock, what will the rock do?',
          options: ['It will eventually stop', 'It will continue moving in a straight line at a constant speed', 'It will curve downwards', 'It will speed up'],
          correctAnswer: 'It will continue moving in a straight line at a constant speed',
          explanation: 'According to the first law, with no unbalanced forces (like gravity or air friction), an object in motion stays in motion.'
        },
        {
          id: 'q25', type: 'mcq', points: 10,
          question: 'A passenger in a moving train tosses a coin up. If the coin falls behind him, the train must be:',
          options: ['Moving with uniform speed', 'Accelerating', 'Decelerating', 'Moving in a circle'],
          correctAnswer: 'Accelerating',
          explanation: 'The coin maintains the initial horizontal velocity of the train. If the train accelerates, it moves faster than the coin, making the coin land behind.'
        },

        /* ── Short Answer (5) ── */
        {
          id: 'q26', type: 'short', points: 15,
          question: 'Define inertia.',
          correctAnswer: 'Inertia is the inherent property of an object to resist any change in its state of rest or uniform motion in a straight line. It is measured by the mass of the object.',
          explanation: 'Inertia is resistance to change in velocity.'
        },
        {
          id: 'q27', type: 'short', points: 15,
          question: "State Newton's first law of motion.",
          correctAnswer: 'An object will remain at rest or in uniform motion in a straight line unless acted upon by an external, unbalanced force.',
          explanation: 'Exact definition of the first law.'
        },
        {
          id: 'q28', type: 'short', points: 15,
          question: 'Why do leaves fall when we vigorously shake the branch of a tree?',
          correctAnswer: "When the branch is shaken, it comes into motion. However, the leaves tend to remain in their state of rest due to inertia of rest. This tug breaks their connection, causing them to fall.",
          explanation: 'Application of inertia of rest.'
        },
        {
          id: 'q29', type: 'short', points: 15,
          question: 'Why does an athlete run a certain distance before taking a long jump?',
          correctAnswer: "The running builds up velocity, giving the athlete's body inertia of motion. This inertia helps propel them further forward when they jump, increasing the distance covered.",
          explanation: 'Application of inertia of motion.'
        },
        {
          id: 'q30', type: 'short', points: 15,
          question: 'What is the relationship between mass and inertia?',
          correctAnswer: 'Mass is the quantitative measure of inertia. The greater the mass of a body, the greater is its inertia (its resistance to change in motion).',
          explanation: 'Directly proportional relationship.'
        },

        /* ── Long Answer (5) ── */
        {
          id: 'q31', type: 'long', points: 20,
          question: 'Explain with an example why it is dangerous to jump out of a moving bus.',
          correctAnswer: "When you are in a moving bus, your entire body is moving at the speed of the bus (inertia of motion). If you jump out, your feet suddenly come to rest the moment they touch the ground due to friction. However, the upper part of your body continues to move forward due to its inertia of motion. This massive difference causes you to fall forward violently, which can lead to severe injuries. To prevent this, one must run a short distance in the direction of the bus after alighting to safely decelerate.",
          explanation: 'Detailed breakdown of the differential inertia on the human body.'
        },
        {
          id: 'q32', type: 'long', points: 20,
          question: 'Describe the three types of inertia with one detailed, real-world example for each.',
          correctAnswer: "1. Inertia of Rest: A coin placed on a playing card over a glass. When the card is flicked sharply, it moves away, but the coin drops into the glass because it resists the change and stays at rest. 2. Inertia of Motion: Passengers falling forward when a driver brakes suddenly. The car stops, but their bodies want to keep moving at the original speed. 3. Inertia of Direction: Water flying off tangentially from a rotating grinding stone or a wet umbrella when spun. The water droplets resist the circular change and fly in a straight line.",
          explanation: 'Categorizes inertia into three distinct concepts.'
        },
        {
          id: 'q33', type: 'long', points: 20,
          question: "How do seatbelts utilize the principles of Newton's First Law to save lives?",
          correctAnswer: "In a car crash, the car experiences a massive unbalanced force and stops almost instantly. According to Newton's First Law, the passengers will continue moving forward at the car's initial high speed because of their inertia of motion. Without a seatbelt, they would hit the windshield or dashboard. The seatbelt provides a controlled, external unbalanced force that holds the passengers back, stopping their motion safely and preventing fatal impacts. Modern seatbelts also have a slight stretch to reduce the peak force on the body (impulse).",
          explanation: "Applies physics to modern safety engineering."
        },
        {
          id: 'q34', type: 'long', points: 20,
          question: "An object is moving continuously at a constant speed in a straight line on a perfectly frictionless surface. Does it require any force to keep it moving? Explain.",
          correctAnswer: "No, it does not require any force to keep it moving. According to Newton's First Law, an object in motion will stay in motion at a constant velocity unless an unbalanced force acts upon it. In the real world, we only have to apply a continuous force to keep things moving because we have to counteract friction (creating a net force of zero). On a frictionless surface, there is no opposing force, so the object's inertia alone keeps it moving forever without any pushing.",
          explanation: 'Clarifies the misconception that force is needed for motion.'
        },
        {
          id: 'q35', type: 'long', points: 20,
          question: 'Explain why it is easier to push an empty shopping cart compared to a full one.',
          correctAnswer: "This is due to the relationship between mass and inertia. The cart full of groceries has significantly more mass than the empty cart. Because it has more mass, it has much greater inertia, meaning it strongly resists your attempt to accelerate it from a state of rest. Therefore, a larger unbalanced force is required to get the full cart moving, making it feel 'harder' to push.",
          explanation: 'Practical example of mass as the measure of inertia.'
        },

        /* ── Thinking / HOTS (5) ── */
        {
          id: 'q36', type: 'thinking', points: 25,
          question: 'If you place a cup of hot coffee on your dashboard and drive off quickly, the coffee spills into your lap. If you stop suddenly, it spills onto the windshield. Explain both events using inertia.',
          correctAnswer: "When you accelerate quickly, the car moves forward, but the coffee cup and liquid want to stay at rest (Inertia of Rest). The dashboard moves out from under the cup, spilling it backward into your lap. When you stop suddenly, the car halts, but the moving coffee wants to keep moving forward (Inertia of Motion), causing it to spill forward onto the windshield.",
          explanation: 'Combines inertia of rest and motion in a single scenario.'
        },
        {
          id: 'q37', type: 'thinking', points: 25,
          question: "A magician pulls a tablecloth out from under a fully set table without breaking any dishes. What physics principle allows this trick to work?",
          correctAnswer: "This trick relies on the Inertia of Rest. The heavy dishes have high inertia and want to stay stationary. For the trick to work, the magician must pull the tablecloth extremely quickly and smoothly. This minimizes the time friction can act between the cloth and the dishes, meaning the unbalanced force transferred to the dishes is too small to overcome their inertia significantly.",
          explanation: 'Explains a magic trick using friction and inertia.'
        },
        {
          id: 'q38', type: 'thinking', points: 25,
          question: 'Why does a dog shake its body vigorously to dry itself after a bath?',
          correctAnswer: "The dog uses Inertia of Direction. By twisting its body back and forth rapidly, the dog's fur changes direction very quickly. The water droplets on the fur, however, tend to continue moving in a straight line due to inertia. This causes the droplets to detach from the fur and fly off tangentially, drying the dog.",
          explanation: 'Biological application of inertia.'
        },
        {
          id: 'q39', type: 'thinking', points: 25,
          question: 'If a massive truck and a small bicycle are moving at the exact same speed, which one is harder to stop and why?',
          correctAnswer: "The massive truck is much harder to stop. Even though they have the same speed, the truck has vastly more mass. Therefore, it has significantly more inertia of motion. It takes a much larger unbalanced force (brakes) applied over time to change the truck's state of motion compared to the bicycle. This is also related to momentum (mass × velocity).",
          explanation: 'Differentiates between speed and inertia (leading to momentum).'
        },
        {
          id: 'q40', type: 'thinking', points: 25,
          question: 'Imagine a person standing in a closed, soundproof train car moving at a perfectly constant speed. Without looking outside, is there any experiment they can do to prove they are moving?',
          correctAnswer: "No, there is no physical experiment they can do to prove they are moving at a constant speed. According to the principle of Galilean Relativity (which Newton built upon), the laws of physics are identical in any inertial (non-accelerating) frame of reference. Because there is no acceleration, there is no 'feeling' of motion. A dropped ball will fall straight down, just as it would if the train were completely stopped.",
          explanation: 'Advanced conceptual understanding of inertial reference frames.'
        }
      ]
    };
