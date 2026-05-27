/**
 * FILE: content.ts
 * LOCATION: src/lib/curriculum/chapters/force-laws-of-motion/content.ts
 * PURPOSE: Complete educational content for "Force and Laws of Motion" (Class 9 Science, Chapter 9).
 *          Contains all 5 major topics, each with multiple subtopics, key points,
 *          formulas, and real-world examples — written from basic to advanced level.
 * SOURCE: Synthesized from three published Google Docs research reports on this chapter.
 * USED BY: ChapterStudyClient.tsx, chapter study page at /class-9/science/force-laws-of-motion
 * DEPENDENCIES: ./types (ChapterContent, Topic, Subtopic interfaces)
 * LAST UPDATED: 2026-05-27
 * NCERT ALIGNMENT: Chapter 9, Class 9 Science (2025–26 syllabus)
 */

import type { ChapterContent } from "./types";

/* ─────────────────────────────────────────────
 * FORCE_AND_LAWS_CONTENT — The complete chapter data.
 * This is the single source of truth for the chapter.
 * Every topic, subtopic, formula, example, and key point
 * used by the study page comes from this constant.
 * ───────────────────────────────────────────── */
export const FORCE_AND_LAWS_CONTENT: ChapterContent = {
  slug: "force-laws-of-motion",
  title: "Force and Laws of Motion",
  classLevel: "Class 9",
  subject: "Science",
  chapterNumber: 9,
  estimatedHours: 14,
  difficulty: "hard",
  overview:
    "This chapter explains why objects move, stop, or change direction. It covers Newton's three laws of motion, the concept of momentum, and the conservation of momentum — the fundamental principles governing all motion in the universe.",

  /* ═══════════════════════════════════════════════
   * TOPICS ARRAY — 5 major topics, each with 3–4 subtopics.
   * Ordered to match NCERT textbook progression.
   * ═══════════════════════════════════════════════ */
  topics: [
    /* ─────────────────────────────────────────────
     * TOPIC 1: Force and Its Real-World Interactions
     * Covers the definition of force, its effects,
     * balanced vs unbalanced forces, and friction.
     * ───────────────────────────────────────────── */
    {
      id: 1,
      title: "Force and Its Real-World Interactions",
      summary:
        "Understand what force is, how it affects objects, and the critical difference between balanced and unbalanced forces that governs whether objects move or stay still.",
      subtopics: [
        {
          id: "1.1",
          title: "The Fundamental Concept of Force",
          content:
            "Look at the world around you. A book resting on a table will sit there forever unless someone picks it up. A football lying on the grass will not move until someone kicks it. This effort that causes a change is known as force. In the simplest English, a force is a push, a pull, a hit, or a twist applied to an object.\n\nForce is a vector quantity, which means it requires two things to exist: a magnitude (which tells us how powerful the push or pull is) and a direction (which tells us where the push or pull is aimed). You cannot just say 'I applied 10 units of force.' You must say 'I applied 10 units of force to the right.'\n\nThe SI unit of force is the Newton (N), named after Sir Isaac Newton. One Newton is defined as the force needed to accelerate a 1 kg object by 1 metre per second squared (1 N = 1 kg × 1 m/s²). Forces can be classified as contact forces (push, pull, friction — requiring physical touch) and non-contact forces (gravity, magnetism, electrostatic — acting from a distance without touching).",
          keyPoints: [
            {
              point: "Force is a push or pull that changes or tends to change the state of an object.",
              detail: "It requires physical interaction — either contact or non-contact."
            },
            {
              point: "Force is a vector quantity — it has both magnitude and direction.",
              detail: "10 N to the right is different from 10 N to the left."
            },
            {
              point: "The SI unit of force is the Newton (N).",
              detail: "1 N = 1 kg × 1 m/s² — the force to accelerate 1 kg by 1 m/s²."
            },
            {
              point: "Forces can be contact (friction, tension) or non-contact (gravity, magnetism)."
            }
          ],
          examples: [
            {
              title: "Opening a Door",
              explanation:
                "When you open a door, you apply a pulling force on the handle. The direction of your pull determines which way the door swings. If you push from the other side, the door moves the opposite way."
            },
            {
              title: "Magnetic Attraction",
              explanation:
                "A magnet can pull an iron nail from a distance without touching it. This is a non-contact force — gravity works exactly the same way, pulling objects toward Earth without any physical contact."
            }
          ],
          illustration: {
            url: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=600&auto=format&fit=crop",
            caption: "Figure 1.1: Forces are vector quantities representing a push, pull, or twist acting in a specific direction with a measurable magnitude (Newtons)."
          }
        },
        {
          id: "1.2",
          title: "The Five Major Effects of Force",
          content:
            "We cannot see force itself with our eyes. We cannot hold a handful of force. However, we can clearly see the effects that a force creates in the real world. Whenever a force acts upon an object, it does one of five specific things:\n\n1. A force can MOVE a stationary object: If a shopping cart is standing still in a supermarket, it has zero motion. When you apply a pushing force with your hands, the cart begins to roll forward.\n\n2. A force can STOP a moving object: A cricket ball flying through the air toward a fielder has motion. The fielder places their hands in front of the ball, applying a stopping force. The moving ball comes to a complete halt.\n\n3. A force can CHANGE THE SPEED of an object: If you are riding a bicycle slowly and suddenly start pedaling very hard, you are applying more forward force. This extra force makes the bicycle go faster. Pulling the brakes applies a stopping force that slows the bicycle down.\n\n4. A force can CHANGE THE DIRECTION of an object: A tennis machine shoots a ball straight at a player. The player swings their racket and hits the ball back. The racket applies a force at an angle, completely changing the direction the ball was originally traveling.\n\n5. A force can CHANGE THE SHAPE AND SIZE of an object: If you take a piece of soft clay and squeeze it in your hand, you are applying force from all sides. The clay does not move away, but its physical shape changes. Stretching a rubber band is another example of force changing the size of an object.",
          keyPoints: [
            { point: "Force can start motion in a stationary object." },
            { point: "Force can stop a moving object." },
            { point: "Force can speed up or slow down a moving object." },
            { point: "Force can change the direction of motion." },
            {
              point: "Force can change the shape and size of an object.",
              detail: "This happens when equal forces act from opposite sides — balanced forces change shape without causing motion."
            }
          ],
          examples: [
            {
              title: "Football Match — All 5 Effects",
              explanation:
                "In a football game: (1) A penalty kick moves the stationary ball. (2) The goalkeeper catches it, stopping it dead. (3) A midfielder receives a slow pass and kicks it hard, increasing its speed. (4) A defender heads the ball, deflecting its direction. (5) Slow-motion cameras show the ball temporarily flattening like a pancake on impact — its shape changed."
            },
            {
              title: "Kneading Bread Dough",
              explanation:
                "When a baker kneads dough, they apply pushing and pulling forces from multiple directions. The dough doesn't fly across the room — it simply changes shape. This is a classic example of force altering the shape of an object."
            }
          ]
        },
        {
          id: "1.3",
          title: "Balanced and Unbalanced Forces",
          content:
            "In the real world, it is extremely rare for only one single force to act on an object. Usually, multiple forces act on a single object at the exact same time. The final behavior of the object depends entirely on whether these competing forces are balanced or unbalanced.\n\nWhen multiple forces push and pull on an object, but they completely cancel each other out, we call them BALANCED FORCES. The net result of balanced forces is exactly zero. Because the net force is zero, balanced forces cannot make a stationary object move, nor can they stop a moving object. Example: Imagine a heavy wooden box on the floor. You push the box from the left side with 50 N. Your friend pushes the box from the right side with 50 N. Because both forces are equal but fighting in opposite directions, they cancel out. The box will not move. However, balanced forces CAN change the shape of an object — like squeezing a balloon equally from both sides.\n\nIf the forces acting on an object do not cancel each other out, they are called UNBALANCED FORCES. Unbalanced forces always result in a net force greater than zero, and they are the ONLY reason things move, speed up, or slow down. Using the previous example, if you push with 100 N and your friend pushes back with only 50 N, the forces are unbalanced. Your side has 50 N of extra force left over. This leftover unbalanced force will cause the box to slide towards your friend.\n\nCRITICAL RULE: An object at rest will ONLY start moving when an unbalanced force acts on it. An object in uniform motion will ONLY change speed or direction when an unbalanced force acts on it.",
          keyPoints: [
            {
              point: "Balanced forces have a net force of zero — no change in motion.",
              detail: "Equal and opposite forces cancel out completely."
            },
            {
              point: "Unbalanced forces have a net force > 0 — they ALWAYS cause a change in motion.",
              detail: "Objects accelerate, decelerate, or change direction."
            },
            {
              point: "Balanced forces can change shape but NOT the state of motion."
            },
            {
              point: "Only unbalanced forces cause acceleration (Newton's key insight)."
            }
          ],
          examples: [
            {
              title: "Tug of War",
              explanation:
                "If Team A and Team B pull the rope with equal force, the rope doesn't move — balanced forces. If Team A suddenly pulls harder, the net force is now toward Team A, and the rope moves — unbalanced forces in action."
            },
            {
              title: "Book Resting on a Table",
              explanation:
                "Gravity pulls the book downward. The table pushes the book upward with an equal 'normal force.' These two forces are balanced — the net force is zero — so the book stays perfectly still."
            }
          ],
          illustration: {
            url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600&auto=format&fit=crop",
            caption: "Figure 1.2: Tug-of-war demonstrating balanced forces (net force = zero, no movement) and unbalanced forces (net force > zero, causing acceleration toward the stronger pull)."
          }
        },
        {
          id: "1.4",
          title: "The Force of Friction",
          content:
            "To truly understand motion in the real world, we must introduce an invisible force called friction. Friction is a natural force that always opposes motion. Whenever two surfaces touch each other, friction is born.\n\nIf you slide a book across a wooden table, it moves for a short distance and then stops on its own. Why? Because the microscopic bumps on the bottom of the book lock into the microscopic bumps on the table. This creates a frictional force pulling in the exact opposite direction of the book's motion.\n\nFriction is both an ADVANTAGE and a DISADVANTAGE:\n\nAdvantages: Without friction, walking would be impossible because our shoes would simply slide backward on the ground forever. Cars would never be able to use brakes. Writing with a pen would be impossible because the pen tip would just glide over paper without leaving a mark.\n\nDisadvantages: The soles of our shoes wear down over time because the ground's friction grinds the rubber away. Car engines require expensive oil constantly to stop the metal parts from melting due to frictional heat. Energy is wasted overcoming friction in every machine.\n\nFriction is the most common unbalanced force that brings moving objects to a stop in our everyday lives. When a cyclist stops pedaling, the bike doesn't stop because of some invisible wall — it stops because road friction and air resistance (also a type of friction) gradually drain its kinetic energy.",
          keyPoints: [
            {
              point: "Friction always opposes the direction of motion.",
              detail: "It acts between any two surfaces in contact."
            },
            {
              point: "Friction is caused by microscopic irregularities on surfaces locking together."
            },
            {
              point: "Friction is essential for walking, driving, writing, and gripping objects."
            },
            {
              point: "Friction wastes energy as heat and causes wear and tear on surfaces."
            }
          ],
          examples: [
            {
              title: "Walking on Ice vs. Pavement",
              explanation:
                "Ice has very low friction, so your shoe slips backward when you push. Pavement has high friction, gripping your shoe firmly so your push propels you forward. This is why people slip on icy roads but walk confidently on asphalt."
            },
            {
              title: "Stopping a Car",
              explanation:
                "When you press the brake pedal, brake pads squeeze against the wheel's disc rotor. The friction between the pads and rotor converts the car's kinetic energy into heat energy, slowing the wheel rotation until the car stops."
            }
          ],
          illustration: {
            url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
            caption: "Figure 1.3: Frictional force acts parallel to the contact surface and in the exact opposite direction to the relative motion of the surfaces."
          }
        }
      ]
    },

    /* ─────────────────────────────────────────────
     * TOPIC 2: Newton's First Law of Motion & Inertia
     * Covers Galileo's experiments, the first law statement,
     * the three types of inertia, and mass as inertia measure.
     * ───────────────────────────────────────────── */
    {
      id: 2,
      title: "Newton's First Law of Motion and Inertia",
      summary:
        "Discover how Galileo challenged Aristotle's 2,000-year-old ideas, and how Newton formalized the revolutionary concept that objects naturally resist changes to their state of motion — a property called inertia.",
      subtopics: [
        {
          id: "2.1",
          title: "Galileo's Experiments with Slopes",
          content:
            "For nearly 2,000 years, the great Greek philosopher Aristotle taught that an external force was necessary to keep a body in motion. People believed this because everyday experience seems to confirm it — if you stop pushing a cart, it stops moving. Aristotle's logic seemed bulletproof.\n\nThen, in the early 1600s, the Italian scientist Galileo Galilei performed a brilliant thought experiment using two inclined planes facing each other. He imagined releasing a ball from one slope. The ball would roll down, reach the bottom, and then roll up the opposite slope. Galileo noticed that the ball would always try to reach the same height it started from. If the second slope was made less steep, the ball would travel a longer distance to reach that height. If the second slope was made completely flat (zero degrees), the ball would roll forever because it could never reach its original height.\n\nGalileo's revolutionary conclusion: An object in motion does NOT need a continuous force to keep moving. It stops only because of external opposing forces like friction. If friction could be completely removed, the object would continue moving in a straight line at constant speed indefinitely. This was a complete overthrow of Aristotle's 2,000-year-old belief.",
          keyPoints: [
            {
              point: "Aristotle believed a continuous force was needed to maintain motion — this was WRONG.",
              detail: "He was fooled by friction, which is always present in everyday life."
            },
            {
              point: "Galileo proved that objects stop because of friction, NOT because of a lack of force."
            },
            {
              point: "On a frictionless surface, an object in motion would continue forever at constant speed."
            },
            {
              point: "Galileo's inclined plane experiment laid the foundation for Newton's First Law."
            }
          ],
          examples: [
            {
              title: "Ball on a Frictionless Ramp",
              explanation:
                "Release a ball from height h on Slope A. It rolls down, crosses the bottom, and climbs Slope B to the same height h. Flatten Slope B — the ball rolls forever seeking height h it can never reach."
            },
            {
              title: "Spacecraft in Deep Space",
              explanation:
                "Once a spacecraft's rockets fire and then shut off in the vacuum of space, the spacecraft does not slow down. There's no air friction, no road friction — nothing to oppose its motion. It coasts at the same speed indefinitely, proving Galileo right."
            }
          ]
        },
        {
          id: "2.2",
          title: "The Statement of Newton's First Law",
          content:
            "Building on Galileo's breakthrough, Sir Isaac Newton published his three laws of motion in his monumental book 'Principia Mathematica' in 1687. Newton's First Law of Motion, also called the Law of Inertia, states:\n\n'An object at rest stays at rest, and an object in uniform motion in a straight line stays in uniform motion in a straight line, unless acted upon by an external unbalanced force.'\n\nLet us break this statement into two crystal-clear parts:\n\nPart 1 — 'An object at rest stays at rest unless acted upon by an external unbalanced force.' This means a football on the ground will sit there for eternity. It will never spontaneously start moving. Only when someone kicks it (applies an unbalanced force) does it begin to move.\n\nPart 2 — 'An object in uniform motion stays in uniform motion unless acted upon by an external unbalanced force.' This means that once the football is kicked and is rolling on a perfectly smooth, frictionless surface, it would roll in a straight line at the same speed forever. It stops in the real world ONLY because friction (an unbalanced force) acts against it.\n\nThe first law also gives us the definition of force: Force is something which changes or tends to change the state of rest or of uniform motion of a body.",
          keyPoints: [
            {
              point: "Newton's First Law: Objects resist changes to their state of rest or uniform motion."
            },
            {
              point: "Also known as the 'Law of Inertia.'"
            },
            {
              point: "Defines force as that which changes or tends to change the state of rest or motion."
            },
            {
              point: "The first law applies only when net external force = 0."
            }
          ],
          formulas: [
            {
              name: "Condition for First Law",
              expression: "If F_net = 0, then a = 0",
              description: "When net external force is zero, acceleration is zero — the object maintains its current velocity (either at rest or moving uniformly).",
              variables: {
                "F_net": "Total net force acting on the object (Newtons)",
                "a": "Acceleration of the object (m/s²)"
              }
            }
          ],
          examples: [
            {
              title: "Coin on a Card Trick",
              explanation:
                "Place a smooth card on a glass and a coin on top of the card. Flick the card quickly sideways. The card flies away, but the coin drops straight into the glass. The coin was at rest and resisted the sudden change — it stayed put while the card was pulled from under it."
            },
            {
              title: "Shaking a Tree",
              explanation:
                "When you shake a tree's trunk, the trunk moves suddenly but the fruits and leaves were at rest. They resist the sudden motion (inertia of rest) and detach from the branches, falling to the ground."
            }
          ],
          illustration: {
            url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=600&auto=format&fit=crop",
            caption: "Figure 2.1: A spacecraft in the vacuum of deep space will coast forever in a straight line at constant speed without firing its engines, perfectly exemplifying Newton's First Law of Motion."
          }
        },
        {
          id: "2.3",
          title: "The Three Types of Inertia",
          content:
            "Inertia is the natural tendency of an object to resist any change in its state of motion. Newton's First Law is actually a law ABOUT inertia. There are three distinct types:\n\n1. INERTIA OF REST — The tendency of a body at rest to remain at rest. Example: When a bus suddenly starts from a bus stop, passengers standing inside jerk backward. Their lower body (touching the bus floor) moves forward with the bus, but their upper body was at rest and resists the change, causing them to fall backward.\n\nAnother example: When you beat a dusty carpet with a stick, the carpet moves forward suddenly, but the dust particles remain at rest (due to inertia of rest) and separate from the carpet, falling off.\n\n2. INERTIA OF MOTION — The tendency of a moving body to continue moving at the same speed and in the same direction. Example: When a running bus suddenly applies brakes, the passengers jerk forward. Their lower body stops with the bus, but their upper body was moving forward and wants to CONTINUE moving forward. This is why seatbelts are mandatory — they provide the external force needed to stop your body along with the car.\n\n3. INERTIA OF DIRECTION — The tendency of a body to continue moving in the same direction. Example: When a car takes a sharp right turn, passengers inside are thrown to the LEFT. The car's wheels grip the road and turn right, but the passengers' bodies want to continue going straight (inertia of direction). Their bodies resist the directional change.",
          keyPoints: [
            {
              point: "Inertia of Rest: A body at rest resists being set into motion.",
              detail: "Dust falls off when you beat a carpet — the carpet moves, dust doesn't."
            },
            {
              point: "Inertia of Motion: A moving body resists being stopped or slowed.",
              detail: "Passengers lurch forward when a bus brakes suddenly."
            },
            {
              point: "Inertia of Direction: A moving body resists changing its path.",
              detail: "Passengers slide sideways when a car turns sharply."
            },
            {
              point: "Seatbelts, airbags, and headrests are all designed to overcome dangerous inertia."
            }
          ],
          examples: [
            {
              title: "Athlete's Run-up Before a Jump",
              explanation:
                "A long-jump athlete runs fast before jumping. When they leave the ground, their body's inertia of motion carries them forward through the air. The faster they run (more inertia), the farther they jump."
            },
            {
              title: "Wet Dog Shaking",
              explanation:
                "When a wet dog shakes its body, the dog's fur moves rapidly, but the water droplets — due to inertia of rest — resist the sudden motion and fly off the fur. This is exactly the same principle as shaking a tree."
            }
          ]
        },
        {
          id: "2.4",
          title: "Mass as the Measure of Inertia",
          content:
            "If inertia is the resistance to change, then what determines HOW MUCH resistance an object has? The answer is mass. Mass is the direct measure of inertia.\n\nA heavier object has more inertia — it is harder to start moving, harder to stop, and harder to change direction. A lighter object has less inertia — it is easier to start, stop, and turn.\n\nReal-world proof: It is easy to push an empty shopping cart (low mass = low inertia). But try pushing a shopping cart loaded with heavy groceries (high mass = high inertia) — you need to push much harder to get it moving, and much harder to stop it once it IS moving.\n\nAnother proof: A massive truck traveling at 40 km/h is much harder to stop than a bicycle traveling at 40 km/h. The truck has enormously more mass, and therefore enormously more inertia. This is why heavy vehicles have more powerful brakes and require longer stopping distances.\n\nImportant distinction: Mass and weight are NOT the same thing. Mass is the amount of matter in an object — it stays the same everywhere in the universe. Weight is the gravitational force on that mass — it changes depending on gravity. Your mass on the Moon is the same as on Earth, but your weight on the Moon is only 1/6th of your weight on Earth.",
          keyPoints: [
            {
              point: "Mass is the measure of inertia — more mass means more inertia.",
              detail: "A 10 kg ball is harder to push than a 1 kg ball."
            },
            {
              point: "Mass is measured in kilograms (kg) and does NOT change with location."
            },
            {
              point: "Weight = mass × gravity (W = mg). It DOES change with gravity.",
              detail: "On Moon (g = 1.6 m/s²), you weigh 1/6th of your Earth weight."
            },
            {
              point: "Heavier vehicles need more powerful brakes because of greater inertia."
            }
          ],
          formulas: [
            {
              name: "Weight Formula",
              expression: "W = m × g",
              description: "Weight is the force of gravity acting on an object's mass.",
              variables: {
                "W": "Weight (Newtons)",
                "m": "Mass (kg)",
                "g": "Acceleration due to gravity (9.8 m/s² on Earth)"
              }
            }
          ],
          examples: [
            {
              title: "Empty vs. Loaded Truck",
              explanation:
                "An empty truck can brake and stop quickly. The same truck loaded with 20 tonnes of cargo takes much longer to stop because the extra mass gives it much more inertia of motion."
            },
            {
              title: "Pushing a Car vs. a Bicycle",
              explanation:
                "You can easily push a bicycle from standstill with one hand. To push a car from standstill, you need multiple people pushing hard. The car has hundreds of times more mass (and therefore hundreds of times more inertia) than the bicycle."
            }
          ]
        }
      ]
    },

    /* ─────────────────────────────────────────────
     * TOPIC 3: Newton's Second Law of Motion & Momentum
     * Covers momentum, the second law statement,
     * the F = ma derivation, and real-world applications.
     * ───────────────────────────────────────────── */
    {
      id: 3,
      title: "Newton's Second Law of Motion and Momentum",
      summary:
        "Learn the concept of momentum — the 'power of motion' — and understand how Newton's Second Law mathematically connects force, mass, and acceleration through the famous equation F = ma.",
      subtopics: [
        {
          id: "3.1",
          title: "Understanding Momentum — The Power of Motion",
          content:
            "Before understanding the second law, we must understand a new concept called momentum. Momentum is the 'quantity of motion' that a moving object possesses.\n\nThink about it: A heavy truck moving slowly and a light bicycle moving fast can both be difficult to stop. This suggests that the 'difficulty to stop' depends on BOTH the mass AND the velocity of the object. This combined property is called momentum.\n\nMathematically: Momentum (p) = Mass (m) × Velocity (v), or p = mv.\n\nMomentum is a vector quantity — it has both magnitude and direction (same direction as the velocity). Its SI unit is kg⋅m/s (kilogram metre per second).\n\nKey insight: A stationary object (v = 0) has ZERO momentum regardless of its mass. A 10,000 kg parked truck has zero momentum. But a 0.05 kg bullet fired from a gun at 300 m/s has a momentum of 15 kg⋅m/s — small mass, enormous velocity.\n\nWhy momentum matters: In physics, force is fundamentally about CHANGING momentum. The more momentum an object has, the more force is needed to change its motion. This is why a speeding truck is far more destructive in a crash than a speeding bicycle — the truck carries vastly more momentum.",
          keyPoints: [
            {
              point: "Momentum (p) = mass × velocity → p = mv",
              detail: "SI unit: kg⋅m/s. It is a vector quantity."
            },
            {
              point: "A stationary object always has zero momentum (v = 0 → p = 0)."
            },
            {
              point: "Momentum depends on BOTH mass AND velocity.",
              detail: "A light bullet moving fast can have more momentum than a heavy ball moving slowly."
            },
            {
              point: "Greater momentum = harder to stop = more destructive in collisions."
            }
          ],
          formulas: [
            {
              name: "Momentum",
              expression: "p = m × v",
              description: "The momentum of an object equals its mass multiplied by its velocity.",
              variables: {
                "p": "Momentum (kg⋅m/s)",
                "m": "Mass (kg)",
                "v": "Velocity (m/s)"
              }
            }
          ],
          examples: [
            {
              title: "Truck vs. Bicycle",
              explanation:
                "A 5,000 kg truck at 20 m/s has momentum = 100,000 kg⋅m/s. A 15 kg bicycle at 10 m/s has momentum = 150 kg⋅m/s. The truck has nearly 667 times more momentum — that's why truck accidents are so much more devastating."
            },
            {
              title: "Cricket Ball vs. Tennis Ball",
              explanation:
                "A cricket ball (0.16 kg) bowled at 40 m/s has momentum = 6.4 kg⋅m/s. A tennis ball (0.058 kg) served at 60 m/s has momentum = 3.48 kg⋅m/s. Despite moving faster, the tennis ball has less momentum because of its lower mass."
            }
          ],
          illustration: {
            url: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=600&auto=format&fit=crop",
            caption: "Figure 3.1: A heavy cargo truck possesses massive momentum even at low velocities because of its large mass, requiring substantial force to stop."
          }
        },
        {
          id: "3.2",
          title: "The Statement and Derivation of Newton's Second Law",
          content:
            "Newton's Second Law of Motion states: 'The rate of change of momentum of an object is directly proportional to the applied unbalanced force, and takes place in the direction of the force.'\n\nLet us derive the mathematical formula step by step:\n\nConsider an object of mass 'm' moving with initial velocity 'u'. An unbalanced force 'F' acts on it for time 't', changing its velocity to 'v'.\n\nStep 1: Initial momentum = m × u\nStep 2: Final momentum = m × v\nStep 3: Change in momentum = mv - mu = m(v - u)\nStep 4: Rate of change of momentum = Change in momentum ÷ Time = m(v - u) / t\nStep 5: Since acceleration a = (v - u) / t, we get: Rate of change = m × a\nStep 6: According to the Second Law, F ∝ m × a\nStep 7: Using appropriate units (SI), the proportionality constant = 1\n\nTherefore: F = m × a\n\nThis is the most important equation in classical mechanics. It tells us:\n- If mass is constant, greater force produces greater acceleration.\n- If force is constant, greater mass produces smaller acceleration.\n- Force, mass, and acceleration are forever linked.\n\nThe unit of force: 1 Newton = the force needed to give a 1 kg mass an acceleration of 1 m/s².",
          keyPoints: [
            {
              point: "F = m × a — Force equals mass times acceleration.",
              detail: "The most fundamental equation in Newtonian mechanics."
            },
            {
              point: "Force is directly proportional to the rate of change of momentum."
            },
            {
              point: "More force → more acceleration (for the same mass)."
            },
            {
              point: "More mass → less acceleration (for the same force)."
            },
            {
              point: "1 Newton = 1 kg × 1 m/s²"
            }
          ],
          formulas: [
            {
              name: "Newton's Second Law",
              expression: "F = m × a",
              description: "The net force on an object equals its mass multiplied by its acceleration.",
              variables: {
                "F": "Net force (Newtons, N)",
                "m": "Mass (kilograms, kg)",
                "a": "Acceleration (m/s²)"
              }
            },
            {
              name: "Force from Momentum Change",
              expression: "F = m(v - u) / t",
              description: "Force equals mass times the change in velocity divided by the time taken.",
              variables: {
                "F": "Force (N)",
                "m": "Mass (kg)",
                "v": "Final velocity (m/s)",
                "u": "Initial velocity (m/s)",
                "t": "Time interval (seconds)"
              }
            }
          ],
          examples: [
            {
              title: "Pushing a Supermarket Cart",
              explanation:
                "An empty cart (10 kg) with a push of 20 N accelerates at a = F/m = 20/10 = 2 m/s². Fill it with 40 kg of groceries (total 50 kg) — same push gives a = 20/50 = 0.4 m/s². Five times less acceleration because of five times more mass."
            },
            {
              title: "Rocket Launching",
              explanation:
                "A rocket produces millions of Newtons of thrust force. Despite its enormous mass, the massive force produces enough acceleration to escape Earth's gravity. As fuel burns and mass decreases, the same thrust produces even greater acceleration — the rocket speeds up faster and faster."
            }
          ]
        },
        {
          id: "3.3",
          title: "Real-World Applications of the Second Law",
          content:
            "Newton's Second Law (F = ma, or equivalently F = m(v-u)/t) has profound real-world applications that explain many everyday phenomena:\n\n1. WHY CATCHING A FAST BALL HURTS: When a fielder catches a fast cricket ball, they must change the ball's momentum from 'mv' to '0'. The force felt = m(v-u)/t. If the fielder keeps their hands rigid (small t), the force is enormous and it hurts badly. But if the fielder pulls their hands backward while catching (increasing t), the same momentum change happens over a longer time, resulting in much less force. This is why cricketers always pull their hands back when catching.\n\n2. WHY CARS HAVE CRUMPLE ZONES: In a car crash, the car's momentum must drop to zero. F = m(v-0)/t. Modern cars are designed with crumple zones that crush slowly during impact, increasing the collision time 't'. A longer 't' means less force on the passengers, saving lives.\n\n3. WHY AIRBAGS WORK: Same principle — airbags inflate to create a soft cushion that increases the time over which a passenger's head decelerates, reducing the impact force dramatically.\n\n4. WHY KARATE EXPERTS BREAK BRICKS: A karate strike moves the hand at very high velocity and stops it in an extremely short time (t is tiny). Since F = m(v)/t, a tiny t makes the force enormous — enough to crack solid bricks.\n\n5. WHY HIGH JUMPERS LAND ON FOAM: Landing on hard ground = tiny stopping time = huge force = broken bones. Landing on foam = long stopping time = small force = safe landing.",
          keyPoints: [
            {
              point: "Increasing collision time reduces impact force: F = Δp/t",
              detail: "This is the principle behind airbags, crumple zones, and soft landings."
            },
            {
              point: "Decreasing collision time increases impact force.",
              detail: "This is the principle behind karate strikes and hammering nails."
            },
            {
              point: "Sports techniques like pulling hands back while catching reduce injury."
            },
            {
              point: "F = m × a can be rearranged as a = F/m — heavier objects accelerate less."
            }
          ],
          examples: [
            {
              title: "Jumping from Height",
              explanation:
                "If you jump from a wall onto concrete, your legs stop in 0.01 seconds — massive force on your joints. Jump onto sand, your legs sink in over 0.5 seconds — 50 times less force. Same momentum change, but time matters enormously."
            },
            {
              title: "Egg Drop Experiment",
              explanation:
                "Drop an egg onto a concrete floor — it breaks instantly (tiny t, huge F). Drop it onto a thick pillow — it survives (large t, small F). The pillow increases the deceleration time, reducing the impact force below the egg's breaking threshold."
            }
          ],
          illustration: {
            url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop",
            caption: "Figure 3.2: Modern cars are engineered with front crumple zones that collapse slowly on impact, increasing the collision duration to drastically reduce the peak force felt by passengers."
          }
        }
      ]
    },

    /* ─────────────────────────────────────────────
     * TOPIC 4: Newton's Third Law of Motion
     * Covers action-reaction pairs, real-world applications,
     * gun recoil mechanics, and apparent weight in elevators.
     * ───────────────────────────────────────────── */
    {
      id: 4,
      title: "Newton's Third Law of Motion",
      summary:
        "Understand the universal truth that every action has an equal and opposite reaction, why these forces act on DIFFERENT bodies, and how this principle enables walking, swimming, and rocket propulsion.",
      subtopics: [
        {
          id: "4.1",
          title: "Action and Reaction Forces",
          content:
            "Newton's Third Law of Motion states: 'To every action, there is an equal and opposite reaction.'\n\nThis means whenever Object A exerts a force on Object B, Object B simultaneously exerts an equal force back on Object A, but in the opposite direction. These two forces are called an 'action-reaction pair.'\n\nCRITICAL POINT: The action and reaction forces ALWAYS act on DIFFERENT bodies. They never act on the same body. This is why they don't cancel each other out.\n\nExample: When you push against a wall with your hand, your hand exerts a force on the wall (action). Simultaneously, the wall pushes back on your hand with an equal force (reaction). You can feel this — your hand gets compressed. The action is on the wall, the reaction is on your hand — different bodies.\n\nWhy don't they cancel? Because cancellation only happens when two forces act on the SAME object. Action and reaction act on DIFFERENT objects. When you push a wall and it doesn't move, it's because the wall is heavy and anchored — the reaction force pushes YOU backward (your feet might slip on a smooth floor).",
          keyPoints: [
            {
              point: "Newton's Third Law: Every action has an equal and opposite reaction."
            },
            {
              point: "Action and reaction forces ALWAYS act on DIFFERENT bodies.",
              detail: "This is why they don't cancel each other out."
            },
            {
              point: "Both forces are EQUAL in magnitude and OPPOSITE in direction."
            },
            {
              point: "Action and reaction are simultaneous — neither comes first."
            }
          ],
          examples: [
            {
              title: "Pushing a Wall",
              explanation:
                "You push the wall with 50 N (action on wall). The wall pushes you back with 50 N (reaction on you). If you're on a smooth floor, the reaction force slides you backward."
            },
            {
              title: "Hammer Hitting a Nail",
              explanation:
                "The hammer exerts a force on the nail (driving it into wood). The nail exerts an equal force back on the hammer (stopping it). The nail goes into the wood because the wood is softer than the hammer."
            }
          ]
        },
        {
          id: "4.2",
          title: "How Walking and Swimming Work (Third Law Applications)",
          content:
            "Many everyday activities that seem simple are actually powered by Newton's Third Law:\n\nWALKING: When you walk, your foot pushes backward against the ground (action). The ground pushes your foot forward (reaction). This forward push from the ground is what propels you forward. On ice or a very smooth surface, your foot cannot push backward effectively (low friction), so the ground can't push you forward — you slip.\n\nSWIMMING: A swimmer pushes water backward with their hands and feet (action). The water pushes the swimmer forward (reaction). The harder and faster the swimmer pushes water backward, the faster they are propelled forward.\n\nROWING A BOAT: The oar pushes water backward (action). The water pushes the oar (and the boat) forward (reaction). Each stroke pushes the boat further.\n\nJUMPING: When you jump, your legs push the ground downward (action). The ground pushes you upward (reaction). The harder you push down, the higher you fly up.\n\nFLYING A BIRD: A bird's wings push air downward and backward (action). The air pushes the bird upward and forward (reaction), keeping it aloft and moving.",
          keyPoints: [
            {
              point: "Walking: Foot pushes ground backward → ground pushes foot forward."
            },
            {
              point: "Swimming: Hands push water backward → water pushes swimmer forward."
            },
            {
              point: "Jumping: Legs push ground downward → ground pushes body upward."
            },
            {
              point: "All locomotion relies on the Third Law — you can only move by pushing something else."
            }
          ],
          examples: [
            {
              title: "Astronaut in Space",
              explanation:
                "If an astronaut is floating in space with nothing to push against, they cannot move by 'swimming' through empty space (no air to push). But they CAN throw an object in one direction — the reaction force pushes them in the opposite direction."
            },
            {
              title: "Skateboarding Off a Wall",
              explanation:
                "A skateboarder pushes against a wall with their hands (action on wall). The wall pushes back on the skateboarder (reaction). Since the skateboarder is on wheels (low friction), the reaction force propels them backward — rolling away from the wall."
            }
          ]
        },
        {
          id: "4.3",
          title: "The Mechanics of Gun Recoil",
          content:
            "One of the most dramatic demonstrations of Newton's Third Law is the recoil of a gun.\n\nWhen a gun fires a bullet:\n- The gun exerts a forward force on the bullet (action), accelerating it out of the barrel at extreme speed.\n- The bullet exerts an equal backward force on the gun (reaction), pushing the gun backward.\n\nThis backward push is called 'recoil.' The gun jerks backward when fired. The recoil force is exactly equal to the force that propels the bullet forward.\n\nWhy doesn't the gun fly backward as fast as the bullet? Because of F = ma. The force is the same on both, but the gun has a much larger mass than the bullet. Since a = F/m, the gun (large mass) gets a very small backward acceleration, while the bullet (tiny mass) gets an enormous forward acceleration.\n\nNumerical example: A 4 kg gun fires a 50 g (0.05 kg) bullet at 35 m/s.\nBullet momentum = 0.05 × 35 = 1.75 kg⋅m/s forward.\nBy conservation of momentum, the gun's momentum = 1.75 kg⋅m/s backward.\nGun recoil velocity = 1.75 / 4 = 0.4375 m/s backward.\nThe bullet moves at 35 m/s, but the gun only recoils at 0.4375 m/s — 80 times slower — because it is 80 times heavier.",
          keyPoints: [
            {
              point: "Gun recoil: The gun and bullet experience equal and opposite forces."
            },
            {
              point: "The bullet moves fast because it has small mass; the gun recoils slowly because it has large mass."
            },
            {
              point: "This demonstrates both the Third Law (equal forces) and Second Law (a = F/m)."
            }
          ],
          formulas: [
            {
              name: "Recoil Velocity",
              expression: "v_gun = -(m_bullet × v_bullet) / m_gun",
              description: "The gun's recoil velocity is calculated from the conservation of momentum, with the negative sign indicating opposite direction.",
              variables: {
                "v_gun": "Recoil velocity of gun (m/s)",
                "m_bullet": "Mass of bullet (kg)",
                "v_bullet": "Velocity of bullet (m/s)",
                "m_gun": "Mass of gun (kg)"
              }
            }
          ],
          examples: [
            {
              title: "Soldier Bracing for Recoil",
              explanation:
                "Soldiers brace their rifles firmly against their shoulders. This effectively increases the 'mass' of the gun system (gun + human body), reducing the recoil velocity and preventing the gun from jerking dangerously backward."
            },
            {
              title: "Cannon on a Ship",
              explanation:
                "Old naval cannons recoiled violently when fired. They were mounted on wheeled carriages with rope restraints to absorb the recoil. Without restraints, the cannon would roll backward across the deck, crushing sailors."
            }
          ]
        },
        {
          id: "4.4",
          title: "Rocket Propulsion — Third Law in Space",
          content:
            "The most spectacular application of Newton's Third Law is rocket propulsion. In the vacuum of space, there is no air, no ground, and no water to push against. Yet rockets can accelerate — how?\n\nA rocket carries fuel that burns to produce hot, expanding gases. These gases are expelled at tremendous speed from the rocket's nozzle in the DOWNWARD direction (action). By Newton's Third Law, the gases exert an equal force UPWARD on the rocket (reaction). This upward force — called thrust — lifts the rocket.\n\nThe rocket doesn't push against the ground or the air. It pushes against its OWN exhaust gases. This is why rockets work in the vacuum of space where there's nothing else to push against.\n\nAs the rocket burns fuel, its mass decreases continuously. Since F = ma, the same thrust force produces greater and greater acceleration as mass drops. This is why rockets accelerate faster and faster as they climb higher.\n\nJet engines work on the same principle, except they take in air from the atmosphere, mix it with fuel, burn it, and expel hot gases backward. The reaction force pushes the aircraft forward.",
          keyPoints: [
            {
              point: "Rockets push exhaust gases downward → gases push rocket upward (Third Law)."
            },
            {
              point: "Rockets do NOT push against air or ground — they push against their own exhaust."
            },
            {
              point: "As fuel burns and mass decreases, the rocket accelerates faster (F = ma)."
            },
            {
              point: "The same principle powers jet engines, garden hoses (whipping motion), and fire extinguishers."
            }
          ],
          examples: [
            {
              title: "Inflated Balloon Release",
              explanation:
                "Inflate a balloon and let it go without tying. Air rushes out backward (action). The balloon zooms forward (reaction). This is a miniature rocket engine — same exact principle as a space rocket."
            },
            {
              title: "Garden Hose Whipping",
              explanation:
                "When you turn on a garden hose at full pressure, the hose whips backward. Water shoots forward out of the nozzle (action), and the hose recoils backward (reaction). Firefighters must brace themselves firmly to control high-pressure hoses."
            }
          ],
          illustration: {
            url: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=600&auto=format&fit=crop",
            caption: "Figure 4.1: Rocket engines produce forward thrust by expelling high-velocity exhaust gases backward, satisfying Newton's Third Law (action = reaction)."
          }
        }
      ]
    },

    /* ─────────────────────────────────────────────
     * TOPIC 5: The Law of Conservation of Momentum
     * Covers the conservation principle, mathematical proof,
     * collision mechanics, and real-world applications.
     * ───────────────────────────────────────────── */
    {
      id: 5,
      title: "The Law of Conservation of Momentum",
      summary:
        "Understand the fundamental law that in any collision or interaction where no external forces act, the total momentum before and after is always exactly the same — one of the most powerful principles in all of physics.",
      subtopics: [
        {
          id: "5.1",
          title: "The Principle of Conservation of Momentum",
          content:
            "The Law of Conservation of Momentum states: 'The total momentum of an isolated system of objects remains constant if no external unbalanced force acts on it.'\n\nIn simpler words: when two or more objects interact (collide, explode, separate), the total momentum of ALL the objects BEFORE the interaction is exactly equal to the total momentum of ALL the objects AFTER the interaction.\n\nTotal momentum before = Total momentum after\nm₁u₁ + m₂u₂ = m₁v₁ + m₂v₂\n\nThis law is a direct consequence of Newton's Third Law. When two objects collide, Object A pushes Object B with force F (gaining momentum). Object B pushes Object A with force -F (losing the same amount of momentum). The total change in momentum of the SYSTEM is zero — momentum is neither created nor destroyed, only transferred.\n\nIMPORTANT: This law applies ONLY to isolated systems (systems where no external forces like friction, gravity, or applied forces interfere). In practice, we approximate collisions as isolated because the collision happens so fast that external forces don't have time to make a significant difference.",
          keyPoints: [
            {
              point: "Total momentum before interaction = Total momentum after interaction.",
              detail: "m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂"
            },
            {
              point: "Applies only to isolated systems (no external unbalanced forces)."
            },
            {
              point: "Momentum is conserved in ALL interactions: collisions, explosions, separations."
            },
            {
              point: "This law is derived from Newton's Third Law (action = -reaction)."
            }
          ],
          formulas: [
            {
              name: "Conservation of Momentum",
              expression: "m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂",
              description: "The total momentum of a system before collision equals the total momentum after collision.",
              variables: {
                "m₁": "Mass of object 1 (kg)",
                "m₂": "Mass of object 2 (kg)",
                "u₁": "Initial velocity of object 1 (m/s)",
                "u₂": "Initial velocity of object 2 (m/s)",
                "v₁": "Final velocity of object 1 (m/s)",
                "v₂": "Final velocity of object 2 (m/s)"
              }
            }
          ],
          examples: [
            {
              title: "Billiard Ball Collision",
              explanation:
                "When the cue ball hits a stationary red ball head-on, the cue ball often stops completely while the red ball moves forward at almost the same speed. All the momentum is transferred from the cue ball to the red ball. Total momentum before = total momentum after."
            },
            {
              title: "Two Ice Skaters Pushing Apart",
              explanation:
                "Two ice skaters stand facing each other and push off. Before pushing, total momentum = 0 (both stationary). After pushing, Skater A moves left with momentum p, Skater B moves right with momentum -p. Total = p + (-p) = 0. Momentum is conserved."
            }
          ],
          illustration: {
            url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
            caption: "Figure 5.1: The head-on collision of billiard balls demonstrates a near-perfect elastic transfer of momentum from the active cue ball to the stationary target ball, keeping the total momentum constant."
          }
        },
        {
          id: "5.2",
          title: "Mathematical Proof of Conservation of Momentum",
          content:
            "Let us prove the law mathematically using Newton's Third Law.\n\nConsider two objects A and B of masses m₁ and m₂ moving with velocities u₁ and u₂ respectively. They collide and the collision lasts for time 't'. After collision, their velocities become v₁ and v₂.\n\nDuring the collision:\n- Force exerted by A on B: F_AB = m₂(v₂ - u₂) / t ... (using F = ma = m(v-u)/t)\n- Force exerted by B on A: F_BA = m₁(v₁ - u₁) / t\n\nBy Newton's Third Law: F_AB = -F_BA\nTherefore: m₂(v₂ - u₂) / t = -m₁(v₁ - u₁) / t\n\nMultiplying both sides by t:\nm₂(v₂ - u₂) = -m₁(v₁ - u₁)\nm₂v₂ - m₂u₂ = -m₁v₁ + m₁u₁\n\nRearranging:\nm₁u₁ + m₂u₂ = m₁v₁ + m₂v₂\n\nThis proves that the total momentum before the collision (left side) equals the total momentum after the collision (right side). Q.E.D.\n\nThis proof works for ANY interaction between two bodies, whether they collide head-on, at angles, or even explode apart from rest.",
          keyPoints: [
            {
              point: "The proof uses Newton's Third Law: F_AB = -F_BA"
            },
            {
              point: "Both forces act for the same duration 't' during collision."
            },
            {
              point: "Algebraic rearrangement gives: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂"
            },
            {
              point: "This proof is valid for all types of collisions and interactions."
            }
          ],
          examples: [
            {
              title: "Numerical Example — Head-on Collision",
              explanation:
                "Object A (3 kg, 4 m/s) collides with Object B (2 kg, stationary). Total initial momentum = 3×4 + 2×0 = 12 kg⋅m/s. After collision, A moves at 1 m/s. B's velocity: 12 = 3×1 + 2×v₂ → v₂ = 4.5 m/s. Total final momentum = 3 + 9 = 12 kg⋅m/s. Conserved!"
            }
          ]
        },
        {
          id: "5.3",
          title: "Real-World Applications — Car Crashes and Rockets",
          content:
            "Conservation of momentum has powerful real-world applications:\n\n1. CAR CRASH ANALYSIS: Forensic investigators use conservation of momentum to analyze car accidents. By measuring the masses of the cars and their final positions/velocities after a crash, they can calculate the exact speeds of the cars before the crash. This is used in court cases to determine who was speeding.\n\n2. ROCKET PROPULSION: A rocket on the launch pad has zero total momentum (it's stationary). When it fires, the exhaust gases go down with momentum p. By conservation, the rocket must go up with momentum -p. Total = p + (-p) = 0. Momentum is perfectly conserved. The faster the exhaust gases are expelled, the greater the rocket's upward momentum.\n\n3. GUN RECOIL (revisited): Before firing, total momentum = 0 (gun + bullet stationary). After firing, bullet goes forward with momentum m_b × v_b. Gun recoils backward with momentum m_g × v_g. Total = m_b×v_b + m_g×v_g = 0 (positive forward cancels negative backward).\n\n4. NUCLEAR EXPLOSIONS: A stationary bomb has zero momentum. When it explodes, fragments fly in all directions. The total momentum of ALL fragments combined is exactly zero — every fragment going one way is balanced by fragments going the opposite way.\n\n5. ASTEROID DEFLECTION: Space agencies plan to deflect dangerous asteroids by crashing a spacecraft into them. The spacecraft transfers its momentum to the asteroid, slightly changing the asteroid's trajectory. NASA's DART mission in 2022 successfully demonstrated this technique.",
          keyPoints: [
            {
              point: "Forensic investigators use momentum conservation to analyze car crash speeds."
            },
            {
              point: "Rockets: exhaust momentum downward = rocket momentum upward."
            },
            {
              point: "Explosions: total momentum of all fragments = zero (if starting from rest)."
            },
            {
              point: "NASA's DART mission used momentum transfer to deflect an asteroid."
            }
          ],
          examples: [
            {
              title: "Two Cars Colliding Head-On",
              explanation:
                "Car A (1000 kg, 20 m/s east) and Car B (1500 kg, 10 m/s west). Total momentum = 1000×20 + 1500×(-10) = 20000 - 15000 = 5000 kg⋅m/s east. After collision (if they stick together), combined velocity = 5000/2500 = 2 m/s east. Both cars move east together at 2 m/s."
            },
            {
              title: "Firework Explosion",
              explanation:
                "A firework rocket rises, then explodes at the top. Before explosion, it has momentum p (upward). After explosion, all the colorful fragments fly in different directions, but their total momentum still equals p. The center of mass continues moving along the original path."
            }
          ]
        }
      ]
    }
  ]
};
