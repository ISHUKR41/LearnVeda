/**
 * FILE: questions.ts
 * LOCATION: src/lib/curriculum/chapters/force-laws-of-motion/questions.ts
 * PURPOSE: Complete question bank for "Force and Laws of Motion" (Class 9 Science, Ch 9).
 *          Contains 5 MCQs, 5 Short Answer, 5 Long Answer, and 5 Thinking Questions
 *          for EACH of the 5 topics — totaling 100 questions.
 * SOURCE: Synthesized from three Google Docs research reports and NCERT-aligned question patterns.
 * USED BY: ChapterStudyClient.tsx, MCQ practice pages, test generators
 * DEPENDENCIES: ./types (TopicQuestionBank, MCQ, WrittenQuestion)
 * LAST UPDATED: 2026-05-27
 */

import type { TopicQuestionBank } from "./types";

/* ═══════════════════════════════════════════════════
 * FORCE_AND_LAWS_QUESTIONS — Complete question bank.
 * Each entry covers one of the 5 major topics.
 * ═══════════════════════════════════════════════════ */
export const FORCE_AND_LAWS_QUESTIONS: TopicQuestionBank[] = [

  /* ─────────────────────────────────────────────
   * TOPIC 1 QUESTIONS: Force and Its Real-World Interactions
   * ───────────────────────────────────────────── */
  {
    topicId: 1,
    topicTitle: "Force and Its Real-World Interactions",
    mcqs: [
      {
        question: "Which of the following is the most accurate definition of force?",
        options: [
          { label: "a", text: "Energy stored in an object" },
          { label: "b", text: "An external effort in the form of a push, pull, or twist that changes or tries to change the state of an object" },
          { label: "c", text: "The weight of an object" },
          { label: "d", text: "The speed at which an object moves" }
        ],
        correctAnswer: "b",
        explanation: "Force is defined as a push, pull, or twist applied to an object. In the real world, opening a door is a pull (force), and shutting a drawer is a push (force). Force always causes or attempts to cause a change in an object's state."
      },
      {
        question: "If you squeeze a completely inflated balloon between your hands, what effect of force are you observing?",
        options: [
          { label: "a", text: "Change in speed" },
          { label: "b", text: "Change in direction" },
          { label: "c", text: "Change in shape and size" },
          { label: "d", text: "Starting motion from rest" }
        ],
        correctAnswer: "c",
        explanation: "The balloon does not move across the room because the forces from your left and right hands are balanced. Instead, the force is absorbed by the material, causing the round balloon to become flat and distorted — its shape changes."
      },
      {
        question: "A heavy desk is being pushed by a person, but it does not move. What is the reason?",
        options: [
          { label: "a", text: "The applied force is balanced by an equal and opposite frictional force from the floor" },
          { label: "b", text: "The desk has no mass" },
          { label: "c", text: "Gravity is too strong" },
          { label: "d", text: "The person is not applying any force" }
        ],
        correctAnswer: "a",
        explanation: "Until the person pushes harder than the maximum limit of the floor's friction, the net force remains zero (balanced forces). The desk stays stationary because the friction exactly matches and cancels the pushing force."
      },
      {
        question: "What is the SI standard unit used to measure the magnitude of force?",
        options: [
          { label: "a", text: "Joule (J)" },
          { label: "b", text: "Watt (W)" },
          { label: "c", text: "Pascal (Pa)" },
          { label: "d", text: "Newton (N)" }
        ],
        correctAnswer: "d",
        explanation: "Named after Sir Isaac Newton, the Newton (N) is the global standard for measuring force. 1 Newton = the force needed to accelerate a 1 kg mass at 1 m/s²."
      },
      {
        question: "Which force naturally opposes the motion of all objects sliding on the ground?",
        options: [
          { label: "a", text: "Gravitational force" },
          { label: "b", text: "Friction" },
          { label: "c", text: "Magnetic force" },
          { label: "d", text: "Electrostatic force" }
        ],
        correctAnswer: "b",
        explanation: "Friction exists anywhere two physical surfaces interact, acting as an invisible brake pulling against the direction of travel. It is caused by microscopic irregularities on surfaces locking together."
      }
    ],
    shortAnswer: [
      {
        question: "Define balanced forces using a simple real-world example.",
        answer: "Balanced forces occur when multiple forces act on an object simultaneously, but their combined total effect is zero. A real-world example is a perfectly matched game of tug-of-war. If Team A pulls left with the exact same power that Team B pulls right, the rope stays completely still — the forces are balanced.",
        difficulty: "easy"
      },
      {
        question: "Explain the difference between balanced and unbalanced forces.",
        answer: "The primary difference is the net force. Balanced forces cancel each other out, resulting in a net force of zero, meaning the object's motion does not change. Unbalanced forces do not cancel out, leaving a net force greater than zero, which forces the object to start moving, stop, or change speed.",
        difficulty: "easy"
      },
      {
        question: "What happens when an unbalanced force acts on an object that is already moving?",
        answer: "The moving object will experience a change in its motion. Depending on the direction of the unbalanced force, the object will either speed up (if pushed from behind), slow down (if pushed from the front), or change direction (if pushed from the side).",
        difficulty: "medium"
      },
      {
        question: "List any three distinct effects that a force can have on an object.",
        answer: "1) A force can stop a moving object, like a car's brakes stopping the spinning wheels. 2) A force can change the direction of an object, like a bat hitting a baseball. 3) A force can change the shape of an object, like hands kneading bread dough.",
        difficulty: "easy"
      },
      {
        question: "Why does a bicycle gradually slow down and stop if the rider stops pedaling?",
        answer: "When the rider stops pedaling, the forward driving force becomes zero. However, the force of friction from the road on the tires, along with air resistance against the rider's body, continues to act backward. These form an unbalanced opposing force that brings the bicycle to a halt.",
        difficulty: "medium"
      }
    ],
    longAnswer: [
      {
        question: "Discuss the five major effects of force in extreme detail, linking each to a real-world scenario found in a game of football.",
        answer: "Force has five distinct effects, all visible in football. First, force moves a stationary object: A penalty kick involves a player striking a completely still ball, providing an unbalanced force that rockets it into motion. Second, force stops a moving object: The goalkeeper catches the incredibly fast penalty shot, applying a massive opposing force to bring it to a dead stop. Third, force changes speed: A player receives a slow pass and kicks it forward aggressively while running, turning a slow-moving ball into a fast-moving pass. Fourth, force changes direction: A defender deflects a forward pass with their head, making the ball bounce out of bounds at a totally different angle. Fifth, force changes shape: When the player kicks the ball with maximum power, slow-motion cameras show the round ball temporarily flattening like a pancake at the exact moment of impact.",
        difficulty: "medium"
      },
      {
        question: "Explain the concept of frictional force. Why is it considered both an advantage and a disadvantage in the real world?",
        answer: "Frictional force is the resistance that occurs whenever two surfaces slide against each other. It always points in the opposite direction of the attempted motion. It is an advantage because it allows human life to function safely — without friction, we could not walk without endlessly slipping, and cars could not steer because their tires would just spin on the asphalt without gripping. However, friction is also a disadvantage because it causes wear and tear. The soles of our shoes wear down over time because the ground's friction grinds the rubber away. Car engines require expensive oil constantly to stop the metal parts from melting due to frictional heat. Energy is wasted in every machine overcoming friction.",
        difficulty: "medium"
      },
      {
        question: "Using a horizontal force of 300 N, a worker wants to push a heavy crate across a warehouse floor at a constant, steady speed. What frictional force must the floor exert, and why?",
        answer: "The frictional force exerted by the floor must be exactly 300 N in the opposite direction. The key lies in the phrase 'constant, steady speed.' If an object moves at constant speed without speeding up or slowing down, the net force acting on it is exactly zero (balanced forces). For the worker's forward push of 300 N to be balanced, the floor's backward friction must be an identical 300 N. If friction were less, the crate would accelerate; if it were more, the crate would decelerate. At exactly 300 N, equilibrium is maintained.",
        difficulty: "hard"
      },
      {
        question: "A team of horses is trying to pull a heavy wagon out of deep mud. Initially, the wagon does not move. Suddenly, it breaks free and moves forward. Explain the forces in both stages.",
        answer: "In the first stage, the wagon is stuck. The horses are pulling forward with immense force, but the deep mud is exerting an equally massive frictional grip backward on the wheels. These are balanced forces (net force = zero), so the wagon remains stationary. In the second stage, the horses apply even more effort, finally exceeding the maximum frictional force the mud can provide (called 'limiting static friction'). Now, the forward force is greater than the backward force. This creates an unbalanced force pointing forward, which successfully accelerates the wagon out of the mud.",
        difficulty: "hard"
      },
      {
        question: "Explain why a book placed on a table does not fall through the table even though gravity pulls it downward.",
        answer: "When a book is placed on a table, gravity exerts a downward force on the book (its weight, W = mg). However, the table's surface exerts an equal and opposite upward force on the book called the 'normal force.' The table's molecular structure is rigid enough to resist the book's weight. These two forces — gravity downward and normal force upward — are perfectly balanced, resulting in zero net force. The book is in equilibrium and remains stationary. If the book were too heavy and exceeded the table's structural strength, the table would break and the book would fall — the forces would no longer be balanced.",
        difficulty: "medium"
      }
    ],
    thinkingQuestions: [
      {
        question: "If all friction suddenly disappeared from Earth for exactly 10 seconds, describe three specific things that would happen and why.",
        answer: "1) All moving vehicles would lose control — their tires could not grip the road, brakes would be useless, and they would slide in whatever direction they were already moving. 2) Every person standing would collapse because their shoes cannot push backward against the ground without friction. Walking requires friction between shoes and ground. 3) All nuts, bolts, and screws in buildings would loosen because friction between threads is what holds them tight. Buildings, bridges, and machines would begin falling apart. Friction is the invisible glue holding our civilization together.",
        difficulty: "hard"
      },
      {
        question: "A magician pulls a tablecloth from under dishes without disturbing them. Which concept from this topic explains this trick?",
        answer: "This is a demonstration of balanced and unbalanced forces combined with the concept of inertia. The key is that the tablecloth must be pulled extremely fast. When pulled quickly, the time of contact between the cloth and dishes is so short that the frictional force (cloth pulling dishes sideways) acts for an insignificantly tiny time. The dishes, due to their inertia of rest, resist the sudden horizontal motion. The downward gravitational force and the table's upward normal force remain balanced throughout, keeping the dishes in place. If the cloth is pulled slowly, friction acts for a longer time and the dishes slide off.",
        difficulty: "hard"
      },
      {
        question: "A car moving at 60 km/h has the same kinetic energy as a truck moving at 20 km/h. Which one is harder to stop and why?",
        answer: "Even though they have the same kinetic energy, stopping difficulty depends on momentum (p = mv), not energy alone. The truck, despite moving slower, must have significantly more mass to have the same kinetic energy at lower speed. Momentum = mv, so the truck's much larger mass gives it more momentum than the car. Since stopping force × time = change in momentum (impulse-momentum theorem), the truck requires either more force or more time to stop. In practice, the truck needs a longer stopping distance and stronger brakes. This is why heavily loaded trucks have special braking systems.",
        difficulty: "hard"
      },
      {
        question: "Why do parachutes work? Explain using the concept of balanced and unbalanced forces.",
        answer: "When a skydiver jumps from a plane, gravity pulls them down (weight = mg) while air resistance pushes upward. Initially, gravity is much stronger than air resistance — the forces are unbalanced — so the skydiver accelerates downward. As speed increases, air resistance grows (it depends on speed and surface area). When the parachute opens, the surface area exposed to air increases dramatically, causing air resistance to spike. For a brief moment, air resistance exceeds gravity — unbalanced forces decelerate the skydiver. Eventually, gravity downward exactly equals air resistance upward — the forces become balanced — and the skydiver descends at a safe, constant speed called 'terminal velocity.'",
        difficulty: "hard"
      },
      {
        question: "Astronauts on the International Space Station experience 'weightlessness.' Are they truly free from gravity? Explain using forces.",
        answer: "No, astronauts on the ISS are NOT free from gravity. The ISS orbits at about 400 km altitude, where Earth's gravity is still about 90% as strong as on the surface. The astronauts experience 'apparent weightlessness' because both the ISS and the astronauts inside it are falling toward Earth at the same rate (free fall). It's like being in an elevator whose cable snapped — everything inside falls together, so nothing pushes against anything else. The astronauts don't feel the floor pushing up on them (no normal force), so they feel weightless. They are actually in continuous free fall, but because they also have sideways velocity, they keep 'missing' Earth — this curved free-fall path is what we call an orbit.",
        difficulty: "hard"
      }
    ]
  },

  /* ─────────────────────────────────────────────
   * TOPIC 2 QUESTIONS: Newton's First Law & Inertia
   * ───────────────────────────────────────────── */
  {
    topicId: 2,
    topicTitle: "Newton's First Law of Motion and Inertia",
    mcqs: [
      {
        question: "Newton's First Law of Motion is also called the:",
        options: [
          { label: "a", text: "Law of Acceleration" },
          { label: "b", text: "Law of Conservation" },
          { label: "c", text: "Law of Inertia" },
          { label: "d", text: "Law of Gravitation" }
        ],
        correctAnswer: "c",
        explanation: "Newton's First Law describes how objects resist changes to their motion — this resistance is called inertia. Hence, it is also known as the Law of Inertia."
      },
      {
        question: "When a bus suddenly starts, passengers standing inside jerk backward. This is due to:",
        options: [
          { label: "a", text: "Inertia of motion" },
          { label: "b", text: "Inertia of rest" },
          { label: "c", text: "Inertia of direction" },
          { label: "d", text: "Conservation of energy" }
        ],
        correctAnswer: "b",
        explanation: "The passengers' bodies were at rest. When the bus suddenly moves forward, their feet (in contact with the bus floor) move with the bus, but their upper body resists the change and stays behind — this is inertia of rest."
      },
      {
        question: "A ball is rolling on a perfectly smooth, frictionless surface. According to Newton's First Law, it will:",
        options: [
          { label: "a", text: "Stop after some time" },
          { label: "b", text: "Accelerate continuously" },
          { label: "c", text: "Keep rolling at constant speed forever" },
          { label: "d", text: "Change direction randomly" }
        ],
        correctAnswer: "c",
        explanation: "On a frictionless surface, there is no unbalanced force to change the ball's velocity. According to the First Law, it will continue in uniform motion in a straight line indefinitely."
      },
      {
        question: "Which scientist first proved that objects stop due to friction, not due to the absence of force?",
        options: [
          { label: "a", text: "Isaac Newton" },
          { label: "b", text: "Albert Einstein" },
          { label: "c", text: "Galileo Galilei" },
          { label: "d", text: "Aristotle" }
        ],
        correctAnswer: "c",
        explanation: "Galileo Galilei performed his famous inclined plane thought experiments in the early 1600s, overturning Aristotle's 2,000-year-old belief that continuous force was needed to maintain motion."
      },
      {
        question: "Which property determines how much inertia an object has?",
        options: [
          { label: "a", text: "Volume" },
          { label: "b", text: "Color" },
          { label: "c", text: "Mass" },
          { label: "d", text: "Temperature" }
        ],
        correctAnswer: "c",
        explanation: "Mass is the direct measure of inertia. A heavier object has more inertia and is harder to start moving, harder to stop, and harder to change direction. A 10 kg object has ten times the inertia of a 1 kg object."
      }
    ],
    shortAnswer: [
      {
        question: "State Newton's First Law of Motion in your own words.",
        answer: "An object that is not moving will stay still, and an object that is moving in a straight line at constant speed will keep moving that way — unless an outside unbalanced force acts on it. Essentially, objects are 'lazy' — they resist any change to what they are currently doing.",
        difficulty: "easy"
      },
      {
        question: "Explain why dust particles fall off when you beat a carpet with a stick.",
        answer: "When you beat the carpet, the carpet moves suddenly. However, the dust particles resting on the carpet's fibers were at rest and, due to inertia of rest, they resist the sudden motion. They stay behind while the carpet moves away underneath them, causing them to detach and fall off due to gravity.",
        difficulty: "easy"
      },
      {
        question: "Why is it dangerous to jump out of a moving bus?",
        answer: "When you are inside a moving bus, your entire body is moving forward with the bus (inertia of motion). When you jump out, your feet touch the stationary ground and stop suddenly, but your upper body continues moving forward due to inertia. This mismatch causes you to fall forward and potentially get injured.",
        difficulty: "medium"
      },
      {
        question: "Distinguish between mass and weight.",
        answer: "Mass is the amount of matter in an object, measured in kg, and stays the same everywhere. Weight is the gravitational force on that mass (W = mg), measured in Newtons, and changes with gravity. Your mass on the Moon equals your mass on Earth, but your weight on the Moon is only 1/6th of your Earth weight because Moon's gravity is weaker.",
        difficulty: "medium"
      },
      {
        question: "Why does a heavier object have more inertia than a lighter object?",
        answer: "Inertia is directly proportional to mass. A heavier object contains more matter, which means more resistance to any change in its state of motion. It requires greater force to accelerate, decelerate, or turn a heavier object compared to a lighter one, because F = ma — same force produces less acceleration on a heavier mass.",
        difficulty: "medium"
      }
    ],
    longAnswer: [
      {
        question: "Describe Galileo's inclined plane experiment in detail and explain how it led to Newton's First Law.",
        answer: "Galileo imagined two inclined planes facing each other. He released a ball from a height on the first slope. The ball rolled down, reached the bottom, and climbed the second slope, always trying to reach the same height it started from. When the second slope was made gentler, the ball traveled farther to reach that height. When the second slope was made completely flat (horizontal), the ball would never reach the original height and would therefore roll forever in a straight line.\n\nGalileo concluded that objects don't need a continuous force to keep moving — they stop only because of friction. If friction were eliminated, motion would continue indefinitely. Newton built upon this insight and formalized it as his First Law: an object remains in its state of rest or uniform motion unless acted upon by an external unbalanced force.",
        difficulty: "medium"
      },
      {
        question: "Explain the three types of inertia with two examples each from daily life.",
        answer: "1) Inertia of Rest — tendency of a resting body to stay at rest. Example 1: When a branch of a tree is shaken, fruits fall because the branch moves but the fruits resist (stay at rest). Example 2: When a bus starts suddenly, standing passengers jerk backward — their feet move with the bus but their body stays at rest.\n\n2) Inertia of Motion — tendency of a moving body to keep moving. Example 1: A person running fast cannot stop instantly — their body wants to keep moving forward. Example 2: When a moving bus brakes suddenly, passengers lurch forward because their bodies want to continue moving.\n\n3) Inertia of Direction — tendency of a moving body to keep moving in the same direction. Example 1: When a car turns right sharply, passengers slide to the left — their bodies resist the directional change. Example 2: Mud flying off a spinning wheel always flies tangentially — it continues in the direction it was moving when it detached.",
        difficulty: "medium"
      },
      {
        question: "A boy of mass 50 kg is standing on a weighing scale inside an elevator. What will the scale read when (a) the elevator is stationary, (b) the elevator accelerates upward at 2 m/s², and (c) the elevator is in free fall? (g = 10 m/s²)",
        answer: "(a) When stationary: The scale reads the boy's true weight = mg = 50 × 10 = 500 N. The normal force from the scale equals gravity exactly (balanced forces).\n\n(b) When accelerating upward at 2 m/s²: The scale must push harder to both support the boy against gravity AND accelerate him upward. Apparent weight = m(g + a) = 50 × (10 + 2) = 50 × 12 = 600 N. The boy feels heavier.\n\n(c) During free fall (a = g = 10 m/s² downward): Apparent weight = m(g - g) = m × 0 = 0 N. The scale reads zero. Both the boy and the elevator are falling at the same rate, so there is no contact force between them. The boy experiences weightlessness — this is the same experience astronauts have on the ISS.",
        difficulty: "hard"
      },
      {
        question: "Why do we use seatbelts in cars? Explain using Newton's First Law and the concept of inertia.",
        answer: "When a car is moving, everything inside it — including the driver and passengers — is also moving at the same speed (inertia of motion). If the car suddenly stops due to a crash or emergency braking, the car's body stops because of the impact or braking force. However, the passengers' bodies continue moving forward at the original speed due to inertia of motion. Without seatbelts, passengers would fly forward, smashing into the dashboard or windshield at full speed.\n\nSeatbelts provide the external unbalanced force needed to stop the passengers along with the car. They spread this stopping force across the chest and lap, reducing pressure on any single point. Modern seatbelts also have 'pretensioners' that tighten instantly during a crash, and 'load limiters' that allow slight give to increase the stopping time, thereby reducing the peak force on the body (F = Δp/t — larger t means smaller F).",
        difficulty: "hard"
      },
      {
        question: "A spacecraft travels through deep space with its engines off. Will it eventually stop? Explain using Newton's First Law.",
        answer: "No, the spacecraft will never stop. In deep space, there is no air, no ground, no water — essentially no friction or air resistance. According to Newton's First Law, an object in uniform motion continues in that state unless acted upon by an external unbalanced force. Since there is no unbalanced force acting on the spacecraft in the vacuum of space (gravity from distant stars is negligible), it will continue at the same speed in the same direction indefinitely.\n\nThis is exactly what happens with the Voyager 1 and Voyager 2 probes launched by NASA in 1977. Their engines have been off for decades, yet they continue traveling through interstellar space at about 17 km/s, and they will continue doing so for millions of years — a perfect real-world demonstration of Newton's First Law.",
        difficulty: "medium"
      }
    ],
    thinkingQuestions: [
      {
        question: "If Newton's First Law says objects in motion stay in motion, why do all moving objects on Earth eventually stop?",
        answer: "This is precisely the question that confused humanity for 2,000 years (Aristotle believed force was needed to maintain motion). The key is the phrase 'unless acted upon by an external unbalanced force.' On Earth, friction (ground friction, air resistance) is ALWAYS present as an external unbalanced force opposing motion. It is this ever-present friction — not the absence of force — that stops objects. Newton's First Law is perfectly valid; it simply acknowledges that in the real world, truly force-free conditions are impossible on Earth's surface. In the vacuum of space, where friction doesn't exist, objects DO continue moving indefinitely.",
        difficulty: "hard"
      },
      {
        question: "If you are on a perfectly frictionless frozen lake and need to reach the shore, how would you do it without walking? Explain the physics.",
        answer: "On a frictionless surface, your feet cannot push backward against the ice (no friction = no grip), so normal walking is impossible. However, you can use Newton's Third Law: throw an object (like your jacket) in the OPPOSITE direction from the shore. When you throw the jacket, your hands push the jacket one way (action), and the jacket pushes you the other way (reaction). This reaction force propels you toward the shore. Alternatively, you could blow air from your mouth in one direction — the reaction pushes you the other way (though this force is extremely small). This is the same principle rockets use in the vacuum of space.",
        difficulty: "hard"
      },
      {
        question: "Two identical balls are placed on smooth surfaces — one on a flat table and one inside a moving train. The train suddenly brakes. What happens to each ball and why?",
        answer: "Ball on the table: Nothing happens. The table is stationary, and the ball is at rest. No change in conditions occurs, so the ball remains at rest (First Law — no unbalanced force acts on it).\n\nBall in the train: The ball rolls FORWARD. Before braking, the ball was moving forward at the train's speed (inertia of motion). When the train brakes, the train floor decelerates, but the ball (on a smooth surface with negligible friction) cannot receive the braking force. It continues moving forward at its original speed due to inertia of motion, appearing to roll forward relative to the decelerating train. This is the same reason passengers lurch forward when a bus brakes — their inertia of motion keeps them going while the vehicle stops.",
        difficulty: "hard"
      },
      {
        question: "Why is it easier to push a shopping cart that is already moving than to start it from rest?",
        answer: "This relates to the difference between static friction and kinetic friction. When the cart is at rest, you must first overcome 'static friction' between the wheels and the floor — static friction is always greater than kinetic (moving) friction. Once the cart starts moving, the friction drops to the lower 'kinetic friction' value. Additionally, Newton's First Law tells us that a body at rest has inertia of rest — it resists being set into motion. Once it IS moving, inertia of motion actually helps it continue moving. The combination of lower friction and favorable inertia makes it easier to keep a moving cart going than to start it from scratch.",
        difficulty: "medium"
      },
      {
        question: "A person stands on a bathroom scale in a moving elevator. The scale shows different readings at different times. Explain how Newton's laws account for this.",
        answer: "The scale measures the normal force (apparent weight), not true weight. When the elevator is stationary or moving at constant speed, forces are balanced (First Law) — the scale reads true weight (mg). When the elevator accelerates upward, an additional upward force is needed beyond gravity — the scale pushes harder, reading more than mg. When the elevator accelerates downward, less upward force is needed — the scale reads less than mg. In free fall (cable snaps), the person and scale accelerate together at g — no contact force exists — the scale reads zero (apparent weightlessness). This beautifully connects the First Law (balanced forces → constant velocity) and Second Law (unbalanced forces → acceleration) in one practical scenario.",
        difficulty: "hard"
      }
    ]
  },

  /* ─────────────────────────────────────────────
   * TOPIC 3 QUESTIONS: Newton's Second Law & Momentum
   * ───────────────────────────────────────────── */
  {
    topicId: 3,
    topicTitle: "Newton's Second Law of Motion and Momentum",
    mcqs: [
      {
        question: "The momentum of an object is defined as:",
        options: [
          { label: "a", text: "Mass divided by velocity" },
          { label: "b", text: "Mass multiplied by velocity" },
          { label: "c", text: "Force multiplied by time" },
          { label: "d", text: "Mass multiplied by acceleration" }
        ],
        correctAnswer: "b",
        explanation: "Momentum (p) = mass × velocity. It is a vector quantity measured in kg⋅m/s. A 5 kg object moving at 10 m/s has a momentum of 50 kg⋅m/s."
      },
      {
        question: "A force of 10 N acts on an object of mass 2 kg. What is the acceleration produced?",
        options: [
          { label: "a", text: "20 m/s²" },
          { label: "b", text: "5 m/s²" },
          { label: "c", text: "12 m/s²" },
          { label: "d", text: "0.2 m/s²" }
        ],
        correctAnswer: "b",
        explanation: "Using F = ma → a = F/m = 10/2 = 5 m/s². The object accelerates at 5 metres per second squared in the direction of the applied force."
      },
      {
        question: "Why do cricketers pull their hands backward while catching a fast ball?",
        options: [
          { label: "a", text: "To look stylish" },
          { label: "b", text: "To increase the time of impact, reducing the force on their hands" },
          { label: "c", text: "To increase the force of the catch" },
          { label: "d", text: "To make the ball bounce back" }
        ],
        correctAnswer: "b",
        explanation: "From F = Δp/t, pulling hands backward increases the time 't' over which the ball's momentum changes to zero. A larger 't' means a smaller force 'F' — making the catch less painful and safer."
      },
      {
        question: "What is the SI unit of momentum?",
        options: [
          { label: "a", text: "kg/m" },
          { label: "b", text: "N⋅s" },
          { label: "c", text: "kg⋅m/s" },
          { label: "d", text: "Both b and c" }
        ],
        correctAnswer: "d",
        explanation: "Momentum = mass × velocity = kg⋅m/s. Since Force = dp/dt → Force × time = momentum → N⋅s = kg⋅m/s. Both units are equivalent and correct."
      },
      {
        question: "A body of mass 5 kg is moving with a velocity of 10 m/s. A force is applied for 5 seconds, bringing it to rest. The force applied is:",
        options: [
          { label: "a", text: "10 N" },
          { label: "b", text: "50 N" },
          { label: "c", text: "-10 N" },
          { label: "d", text: "25 N" }
        ],
        correctAnswer: "c",
        explanation: "F = m(v-u)/t = 5(0-10)/5 = 5(-10)/5 = -10 N. The negative sign indicates the force is in the opposite direction to the initial motion (it's a braking force)."
      }
    ],
    shortAnswer: [
      {
        question: "Define momentum and state its SI unit.",
        answer: "Momentum is the quantity of motion possessed by a moving body. It is defined as the product of mass and velocity: p = mv. The SI unit of momentum is kg⋅m/s (kilogram metre per second). Momentum is a vector quantity — it has both magnitude and direction, same as the velocity.",
        difficulty: "easy"
      },
      {
        question: "State Newton's Second Law of Motion.",
        answer: "The rate of change of momentum of a body is directly proportional to the applied unbalanced force, and takes place in the direction of the force. Mathematically, F = dp/dt = m(v-u)/t = ma, where F is force, m is mass, and a is acceleration.",
        difficulty: "easy"
      },
      {
        question: "Why does a heavy truck cause more damage in an accident than a light car moving at the same speed?",
        answer: "Because the truck has much more momentum (p = mv). At the same speed, the truck's much larger mass gives it far greater momentum. During the collision, this massive momentum must change to zero, requiring an enormous force (F = Δp/t). This larger force causes more destruction and damage.",
        difficulty: "medium"
      },
      {
        question: "Explain why airbags in cars save lives during crashes.",
        answer: "During a crash, the passenger's momentum must drop to zero. The force experienced = Δp/t. Airbags inflate to create a soft cushion that increases the time 't' over which the passenger's head and chest decelerate. Since the momentum change Δp is the same, a longer time 't' means a significantly smaller force F — reducing injuries and saving lives.",
        difficulty: "medium"
      },
      {
        question: "A stationary object has zero velocity. Does it have zero momentum? What about zero inertia?",
        answer: "Yes, it has zero momentum because p = mv, and v = 0 means p = 0 regardless of mass. However, it does NOT have zero inertia. Inertia depends on mass alone, not velocity. A 100 kg boulder sitting still has zero momentum but enormous inertia — it strongly resists being moved.",
        difficulty: "medium"
      }
    ],
    longAnswer: [
      {
        question: "Derive the mathematical expression F = ma from Newton's Second Law of Motion.",
        answer: "Consider an object of mass 'm' moving with initial velocity 'u'. An unbalanced force 'F' acts on it for time 't', changing its velocity to 'v'.\n\nStep 1: Initial momentum = mu\nStep 2: Final momentum = mv\nStep 3: Change in momentum = mv - mu = m(v - u)\nStep 4: Rate of change of momentum = m(v - u) / t\nStep 5: But acceleration a = (v - u) / t\nStep 6: Therefore, rate of change of momentum = m × a\nStep 7: According to Newton's Second Law, F ∝ ma\nStep 8: Choosing SI units such that the constant of proportionality = 1:\n\nF = m × a\n\nThis tells us force equals mass times acceleration. 1 Newton is the force that gives 1 kg mass an acceleration of 1 m/s².",
        difficulty: "medium"
      },
      {
        question: "A car of mass 1000 kg is moving at 20 m/s. It is brought to rest in 10 seconds by applying the brakes. Calculate (a) the initial momentum, (b) the final momentum, (c) the change in momentum, and (d) the braking force.",
        answer: "(a) Initial momentum = mu = 1000 × 20 = 20,000 kg⋅m/s\n(b) Final momentum = mv = 1000 × 0 = 0 kg⋅m/s\n(c) Change in momentum = final - initial = 0 - 20,000 = -20,000 kg⋅m/s (negative means opposite to initial motion)\n(d) Braking force = change in momentum / time = -20,000 / 10 = -2,000 N\n\nThe braking force is 2,000 N applied in the direction opposite to the car's motion. The negative sign confirms it's a retarding (stopping) force.",
        difficulty: "medium"
      },
      {
        question: "Explain why a karate expert can break a stack of bricks with a bare hand without getting injured.",
        answer: "A karate expert exploits Newton's Second Law: F = m(v-u)/t. The expert moves their hand at very high velocity (v is large) and stops it in an extremely short time upon impact (t is tiny — less than a hundredth of a second). Since F = mv/t, a large v divided by a tiny t produces an enormous force — enough to crack solid bricks.\n\nThe expert doesn't get injured because: (1) The hand moves through the bricks, maintaining high velocity throughout, so the deceleration is distributed across multiple bricks rather than concentrated on the first one. (2) The hand is conditioned and strikes with a specific part (the edge/palm) to distribute pressure. (3) The bricks are more brittle than human bone — they break before the hand's bones can fracture. (4) Follow-through ensures the hand doesn't stop at the surface (which would increase impact time on one point and increase local force).",
        difficulty: "hard"
      },
      {
        question: "Two objects have the same momentum. One has mass 2 kg and the other has mass 8 kg. Which one has greater velocity and by what factor?",
        answer: "Since p = mv and both have the same momentum p:\nFor object 1: p = 2 × v₁ → v₁ = p/2\nFor object 2: p = 8 × v₂ → v₂ = p/8\n\nRatio: v₁/v₂ = (p/2)/(p/8) = 8/2 = 4\n\nThe lighter object (2 kg) has 4 times greater velocity than the heavier object (8 kg). This makes intuitive sense — to have the same momentum with less mass, you need proportionally more velocity. It's like a bullet (small mass, huge velocity) having comparable momentum to a slowly moving truck (huge mass, small velocity).",
        difficulty: "medium"
      },
      {
        question: "Explain with a numerical example how changing the time of impact affects the force experienced during a collision.",
        answer: "Consider a 70 kg person in a car crash, decelerating from 20 m/s to 0 m/s.\n\nMomentum change = 70 × (0 - 20) = -1400 kg⋅m/s (same in both cases)\n\nCase 1 — Without seatbelt/airbag (rigid crash, t = 0.05 s):\nF = Δp/t = -1400/0.05 = -28,000 N (about 2,857 kg-force — fatal!)\n\nCase 2 — With seatbelt + airbag (cushioned deceleration, t = 0.5 s):\nF = Δp/t = -1400/0.5 = -2,800 N (about 286 kg-force — survivable)\n\nBy increasing the stopping time from 0.05s to 0.5s (just 10 times longer), the force drops by a factor of 10 — from a fatal 28,000 N to a survivable 2,800 N. This is exactly why modern cars are engineered with crumple zones, airbags, and seatbelts — all designed to increase the collision time 't'.",
        difficulty: "hard"
      }
    ],
    thinkingQuestions: [
      {
        question: "If a mosquito hits the windshield of a moving bus, does the mosquito exert a force on the bus? If so, why doesn't the bus slow down noticeably?",
        answer: "Yes! By Newton's Third Law, the mosquito exerts exactly the same force on the bus as the bus exerts on the mosquito (just in opposite directions). However, while the mosquito is destroyed by this force (tiny mass → huge deceleration), the bus doesn't noticeably slow down because of Newton's Second Law: a = F/m. The same force F acting on the bus's enormous mass produces an infinitesimally small deceleration — so small it's unmeasurable. The bus's change in velocity is perhaps 0.000001 m/s — practically zero. The forces are equal, but the effects are dramatically different because the masses are dramatically different.",
        difficulty: "hard"
      },
      {
        question: "A ball is thrown vertically upward. At the highest point, its velocity is zero. Is the force on the ball also zero at that point? Explain.",
        answer: "No! This is a very common misconception. At the highest point, velocity is momentarily zero, but the force (gravity) is NOT zero. Gravity acts on the ball at ALL times — on the way up, at the top, and on the way down. At the highest point, gravity is pulling the ball downward with force mg, which is why the ball doesn't stay at the top forever — gravity immediately begins accelerating it back down. If the force were truly zero at the top, the ball would float there indefinitely (Newton's First Law). The fact that it comes back down proves a force (gravity) is acting even when velocity = 0.",
        difficulty: "hard"
      },
      {
        question: "If two forces of 5 N each act on an object, is the resultant force always 10 N? When could it be zero?",
        answer: "No! Two forces of 5 N each can produce a resultant ranging from 0 N to 10 N, depending on their directions. If both forces act in the SAME direction: resultant = 5 + 5 = 10 N (maximum). If they act in OPPOSITE directions: resultant = 5 - 5 = 0 N (minimum). If they act at right angles (90°): resultant = √(5² + 5²) = √50 ≈ 7.07 N. For any angle θ between them: resultant = √(5² + 5² + 2×5×5×cos θ). The resultant is zero when θ = 180° (directly opposing forces). This is why understanding force as a vector quantity is crucial — direction matters as much as magnitude.",
        difficulty: "hard"
      },
      {
        question: "Can an object have acceleration even if it is moving at constant speed? Explain using the concept of force.",
        answer: "Yes! Acceleration is the rate of change of VELOCITY, not speed. Velocity is a vector (speed + direction). If an object changes direction while maintaining constant speed, its velocity changes, meaning it IS accelerating. Example: A car going around a circular roundabout at a constant 40 km/h is constantly changing direction — it is accelerating toward the center of the circle. This 'centripetal acceleration' requires an unbalanced force (provided by friction between tires and road) directed toward the center. Without this force, the car would fly off in a straight line (First Law). The Moon orbiting Earth at roughly constant speed is another example — gravity provides the centripetal force for continuous acceleration without speed change.",
        difficulty: "hard"
      },
      {
        question: "Two identical trucks carry the same load. Truck A has a rigid steel bumper and Truck B has a foam-padded bumper. Both crash into the same wall at the same speed. Which truck's driver experiences less force? Why?",
        answer: "Truck B's driver (foam-padded bumper) experiences significantly less force. Both trucks have the same mass and same initial speed, so both have the same initial momentum (p = mv). Both come to rest, so the change in momentum (Δp) is identical. However, F = Δp/t. Truck A's rigid bumper stops in a very short time (t₁ is tiny) — producing enormous force. Truck B's foam bumper compresses and deforms during impact, increasing the stopping time (t₂ > t₁) — producing less force. If the foam bumper doubles the stopping time, the force on the driver is halved. This is the engineering principle behind crumple zones, airbags, and crash barriers.",
        difficulty: "hard"
      }
    ]
  },

  /* ─────────────────────────────────────────────
   * TOPIC 4 QUESTIONS: Newton's Third Law
   * ───────────────────────────────────────────── */
  {
    topicId: 4,
    topicTitle: "Newton's Third Law of Motion",
    mcqs: [
      {
        question: "Newton's Third Law states that action and reaction forces:",
        options: [
          { label: "a", text: "Act on the same body" },
          { label: "b", text: "Act on different bodies" },
          { label: "c", text: "Are unequal in magnitude" },
          { label: "d", text: "Act one after the other" }
        ],
        correctAnswer: "b",
        explanation: "Action and reaction forces ALWAYS act on DIFFERENT bodies. This is why they don't cancel each other out. If you push a wall (action on wall), the wall pushes back on you (reaction on you) — two different objects."
      },
      {
        question: "When you walk forward, what pushes you forward?",
        options: [
          { label: "a", text: "Your muscles" },
          { label: "b", text: "Air resistance" },
          { label: "c", text: "The ground" },
          { label: "d", text: "Gravity" }
        ],
        correctAnswer: "c",
        explanation: "Your foot pushes backward on the ground (action). The ground pushes your foot forward (reaction). This forward push from the ground is what actually propels you. Your muscles generate the push, but it's the ground's reaction that moves you."
      },
      {
        question: "A rocket works in the vacuum of space by pushing against:",
        options: [
          { label: "a", text: "The air molecules" },
          { label: "b", text: "The ground" },
          { label: "c", text: "Its own exhaust gases" },
          { label: "d", text: "The Earth's magnetic field" }
        ],
        correctAnswer: "c",
        explanation: "A rocket pushes its own exhaust gases backward at high speed (action). The gases push the rocket forward (reaction). The rocket doesn't need air or ground — it pushes against its own propellant. This is why rockets work in space."
      },
      {
        question: "When a gun fires a bullet, the gun recoils backward. This is an example of:",
        options: [
          { label: "a", text: "Newton's First Law" },
          { label: "b", text: "Newton's Second Law" },
          { label: "c", text: "Newton's Third Law" },
          { label: "d", text: "Law of Conservation of Energy" }
        ],
        correctAnswer: "c",
        explanation: "The gun pushes the bullet forward (action). The bullet pushes the gun backward (reaction). Equal and opposite forces on different bodies — a textbook example of Newton's Third Law."
      },
      {
        question: "If the action force is the Earth pulling a ball downward, what is the reaction force?",
        options: [
          { label: "a", text: "The ball pushing the ground" },
          { label: "b", text: "The ball pulling the Earth upward" },
          { label: "c", text: "Air resistance on the ball" },
          { label: "d", text: "Friction on the ball" }
        ],
        correctAnswer: "b",
        explanation: "The reaction to Earth's gravity pulling the ball down is the ball pulling the Earth UP with the same force. We don't notice Earth's upward movement because Earth's mass is enormous — F = ma → a = F/m → incredibly tiny acceleration for Earth."
      }
    ],
    shortAnswer: [
      {
        question: "State Newton's Third Law of Motion.",
        answer: "To every action, there is an equal and opposite reaction. This means whenever Object A exerts a force on Object B, Object B simultaneously exerts an equal force back on Object A, but in the opposite direction. These action-reaction forces always act on different bodies.",
        difficulty: "easy"
      },
      {
        question: "Why don't action and reaction forces cancel each other out?",
        answer: "Because action and reaction forces act on DIFFERENT bodies. Forces cancel only when they act on the SAME body. When you push a wall, the action is on the wall and the reaction is on you — two different objects. Since each force is on a separate body, they cannot cancel each other.",
        difficulty: "medium"
      },
      {
        question: "Explain how a swimmer moves forward in water.",
        answer: "The swimmer pushes water backward with their hands and feet (action force on water). By Newton's Third Law, the water pushes the swimmer forward with an equal force (reaction force on swimmer). The harder and faster the swimmer pushes water backward, the greater the forward reaction force, and the faster the swimmer moves.",
        difficulty: "easy"
      },
      {
        question: "Why does a gun recoil when a bullet is fired?",
        answer: "When the gun fires, it exerts a forward force on the bullet (action). By Newton's Third Law, the bullet exerts an equal backward force on the gun (reaction). This backward force causes the gun to jerk backward — this is recoil. The gun recoils slowly because its mass is much larger than the bullet's mass (a = F/m).",
        difficulty: "medium"
      },
      {
        question: "How does an inflated balloon released without tying demonstrate the Third Law?",
        answer: "When released, compressed air rushes out backward through the opening (action). The escaping air exerts an equal force pushing the balloon forward (reaction). This is a miniature rocket engine — the balloon zooms forward exactly because of the Third Law. When all the air escapes, the forward force stops and the balloon falls.",
        difficulty: "easy"
      }
    ],
    longAnswer: [
      {
        question: "Explain how rockets work in the vacuum of space using Newton's Third Law. Why don't they need air to push against?",
        answer: "A common misconception is that rockets push against the air beneath them. In reality, rockets work by Newton's Third Law — they push against their OWN exhaust gases.\n\nThe rocket carries fuel (like liquid hydrogen and oxygen) that burns to produce extremely hot, rapidly expanding gases. These gases are expelled downward through the rocket's nozzle at tremendous speed (action force — rocket pushes gases down). By the Third Law, the gases exert an equal upward force on the rocket (reaction force — gases push rocket up). This upward force is called 'thrust.'\n\nThe rocket doesn't need air because it carries its own reaction mass (the fuel/exhaust). It pushes this mass in one direction and moves in the opposite direction. In fact, rockets work BETTER in the vacuum of space because there is no air resistance to oppose their motion.\n\nAs the rocket burns fuel, its total mass decreases. Since F = ma, the same thrust force produces greater acceleration as mass drops. This is why rockets accelerate faster and faster as they climb higher.",
        difficulty: "hard"
      },
      {
        question: "A girl weighing 40 kg stands on a skateboard and pushes against a wall with a force of 30 N. What happens to her, and what is her acceleration? Assume no friction.",
        answer: "When the girl pushes the wall with 30 N (action force on wall), the wall pushes back on her with 30 N (reaction force on her) — Newton's Third Law. Since she is on a skateboard (frictionless), there is no friction to prevent her from moving.\n\nThe 30 N reaction force from the wall accelerates her backward (away from the wall).\nUsing F = ma: a = F/m = 30/40 = 0.75 m/s²\n\nShe accelerates at 0.75 m/s² away from the wall. The wall doesn't move because it is firmly attached to the ground and has essentially infinite effective mass.\n\nNote: The girl accelerates despite pushing the wall, NOT being pushed by someone else. She creates her own propulsion using the Third Law — just like an astronaut pushing off a space station wall to float across a module.",
        difficulty: "medium"
      },
      {
        question: "The 'Horse and Cart Paradox': If action and reaction are always equal, how can a horse pull a cart forward? Shouldn't the cart pull the horse back with equal force, resulting in zero net force?",
        answer: "This is a famous paradox that confuses many students. The resolution lies in understanding that action and reaction act on DIFFERENT bodies.\n\nThe horse pushes backward on the ground with its hooves (action). The ground pushes the horse FORWARD (reaction). This forward force from the ground propels the horse.\n\nThe horse also pulls the cart forward through the rope (action on cart). The cart pulls the horse backward through the rope (reaction on horse).\n\nFor the horse: The ground pushes it forward, and the cart pulls it backward. If the forward push from the ground is greater than the backward pull from the cart, the horse experiences a net forward force and accelerates forward.\n\nFor the cart: The horse pulls it forward, and friction pulls it backward. If the forward pull from the horse is greater than the friction, the cart accelerates forward.\n\nThe key insight: Action-reaction pairs act on different bodies. To determine motion, we look at ALL forces on ONE body at a time, not the action-reaction pair together.",
        difficulty: "hard"
      },
      {
        question: "A 4 kg rifle fires a 50 g bullet at 35 m/s. Calculate the recoil velocity of the rifle.",
        answer: "Before firing, total momentum = 0 (both gun and bullet are at rest).\nAfter firing, by conservation of momentum:\n\nm(bullet) × v(bullet) + m(rifle) × v(rifle) = 0\n\n0.05 × 35 + 4 × v(rifle) = 0\n1.75 + 4 × v(rifle) = 0\n4 × v(rifle) = -1.75\nv(rifle) = -1.75 / 4 = -0.4375 m/s\n\nThe rifle recoils backward at 0.4375 m/s (about 1.575 km/h). The negative sign indicates direction opposite to the bullet. The bullet moves at 35 m/s but the rifle only recoils at 0.4375 m/s — 80 times slower — because the rifle is 80 times heavier (4 kg vs 0.05 kg). This demonstrates both the Third Law (equal forces) and the Second Law (F = ma → larger mass = smaller acceleration).",
        difficulty: "hard"
      },
      {
        question: "Explain with examples how Newton's Third Law applies to everyday life — walking, swimming, and jumping.",
        answer: "Walking: Your foot pushes backward against the ground (action). The ground pushes your foot forward (reaction). This forward push from the ground is what propels you. On ice (low friction), your foot cannot push backward effectively, so the ground can't push you forward — you slip.\n\nSwimming: A swimmer pushes water backward with their hands and feet (action). The water pushes the swimmer forward (reaction). The harder and faster they push water backward, the faster they move forward. Fish use their tails to push water backward for the same reason.\n\nJumping: Your legs push the ground downward (action). The ground pushes your body upward (reaction). The harder you push down, the more the ground pushes up, and the higher you jump. This is why you bend your knees before jumping — to apply force for a longer distance, generating more impulse.\n\nIn all three cases, the key insight is the same: you can only move yourself by pushing something ELSE. You push the ground, it pushes you. You push water, it pushes you. There is no self-propulsion without a reaction force.",
        difficulty: "medium"
      }
    ],
    thinkingQuestions: [
      {
        question: "If you stand on a bathroom scale inside a rocket that is accelerating upward at 20 m/s², what would the scale read compared to your normal weight? (Take g = 10 m/s²)",
        answer: "The scale reads apparent weight = m(g + a) = m(10 + 20) = m × 30. This is 3 times your normal weight (which is mg = m × 10). So if you normally weigh 700 N, the scale would read 2,100 N. You would feel three times heavier. This is called 'g-force' — astronauts during rocket launches experience 3-4g, meaning they feel 3-4 times their normal weight. Fighter pilots experience up to 9g during extreme maneuvers. Above about 5g sustained, most people lose consciousness because blood cannot reach the brain.",
        difficulty: "hard"
      },
      {
        question: "Two people of different masses are ice skating and push off each other. Do they experience the same force? The same acceleration? The same speed?",
        answer: "Same force: YES — Newton's Third Law guarantees equal and opposite forces. If Person A pushes B with 100 N, B pushes A with 100 N.\n\nSame acceleration: NO — since F = ma, the lighter person gets more acceleration (a = F/m). If A is 50 kg and B is 100 kg, A accelerates at 100/50 = 2 m/s² while B accelerates at 100/100 = 1 m/s².\n\nSame speed: NO — since both start from rest and the lighter person accelerates more, after any given time the lighter person will be moving faster. However, they have the SAME magnitude of momentum (by conservation of momentum: m₁v₁ = m₂v₂). The lighter person moves faster but has less mass, while the heavier person moves slower but has more mass — their momenta are equal and opposite.",
        difficulty: "hard"
      },
      {
        question: "Can you move a sailboat by standing on it and blowing air into the sail with a fan mounted on the boat? Explain.",
        answer: "No, this would NOT work. The fan pushes air forward into the sail (action force on air). The air pushes back on the fan (reaction force on fan) — pushing the boat BACKWARD. Simultaneously, the air hits the sail and pushes the sail forward. But these two forces (backward on fan, forward on sail) are both acting on the SAME system (the boat). They cancel each other out, giving zero net force. The system cannot push itself using its own internal forces. This is different from a regular sailboat where EXTERNAL wind provides the force, or a rocket where exhaust gases are EXPELLED (removed from the system), allowing net motion. You can only propel yourself by pushing something OUTSIDE your system.",
        difficulty: "hard"
      },
      {
        question: "During a space walk, an astronaut's tether breaks and they start drifting away from the space station. How could they use Newton's Third Law to return?",
        answer: "The astronaut should throw any object (tool, glove, camera) as hard as possible in the direction AWAY from the space station. When the astronaut throws the object, their hands push the object one way (action). The object pushes the astronaut the opposite way (reaction) — toward the station. By conservation of momentum: m(astronaut) × v(astronaut) = m(object) × v(object). The heavier the object and the faster they throw it, the more velocity they gain toward the station.\n\nAlternatively, astronaut spacesuits have small nitrogen thrusters called SAFER (Simplified Aid For EVA Rescue). These work exactly like miniature rockets — expelling nitrogen gas in one direction, pushing the astronaut in the opposite direction. This is a life-saving application of Newton's Third Law.",
        difficulty: "hard"
      },
      {
        question: "If the Earth pulls an apple with a force of 1 N, the apple also pulls the Earth with 1 N. Why doesn't the Earth move toward the apple?",
        answer: "Actually, the Earth DOES move toward the apple! But the movement is so incredibly tiny that it's completely immeasurable. By Newton's Second Law: a = F/m. The apple (mass ≈ 0.1 kg) accelerates at a = 1/0.1 = 10 m/s² toward Earth — we see this as the apple falling. The Earth (mass ≈ 6 × 10²⁴ kg) accelerates at a = 1/(6 × 10²⁴) ≈ 1.67 × 10⁻²⁵ m/s² toward the apple. This acceleration is so fantastically small — about 0.000000000000000000000000017 m/s² — that the Earth moves an immeasurably tiny distance (less than the diameter of a proton) by the time the apple hits the ground. So technically, the Earth DOES move, but the effect is utterly negligible due to Earth's enormous mass.",
        difficulty: "hard"
      }
    ]
  },

  /* ─────────────────────────────────────────────
   * TOPIC 5 QUESTIONS: Conservation of Momentum
   * ───────────────────────────────────────────── */
  {
    topicId: 5,
    topicTitle: "The Law of Conservation of Momentum",
    mcqs: [
      {
        question: "The law of conservation of momentum applies to:",
        options: [
          { label: "a", text: "Only elastic collisions" },
          { label: "b", text: "Only inelastic collisions" },
          { label: "c", text: "All collisions in an isolated system" },
          { label: "d", text: "Only explosions" }
        ],
        correctAnswer: "c",
        explanation: "Conservation of momentum applies to ALL types of interactions (elastic, inelastic collisions, and explosions) as long as no external unbalanced force acts on the system. It is a universal law derived from Newton's Third Law."
      },
      {
        question: "A bomb at rest explodes into two fragments. The total momentum of both fragments is:",
        options: [
          { label: "a", text: "Greater than zero" },
          { label: "b", text: "Less than zero" },
          { label: "c", text: "Exactly zero" },
          { label: "d", text: "Cannot be determined" }
        ],
        correctAnswer: "c",
        explanation: "Before explosion, total momentum = 0 (bomb was at rest). By conservation of momentum, total momentum after = 0. One fragment's forward momentum exactly cancels the other's backward momentum."
      },
      {
        question: "Object A (2 kg) moving at 3 m/s collides with stationary Object B (1 kg). If A stops after collision, B's velocity is:",
        options: [
          { label: "a", text: "3 m/s" },
          { label: "b", text: "6 m/s" },
          { label: "c", text: "2 m/s" },
          { label: "d", text: "1 m/s" }
        ],
        correctAnswer: "b",
        explanation: "Initial momentum = 2×3 + 1×0 = 6 kg⋅m/s. Final momentum: 2×0 + 1×v₂ = 6. Therefore v₂ = 6 m/s. All momentum was transferred from A to B."
      },
      {
        question: "Conservation of momentum is a direct consequence of which law?",
        options: [
          { label: "a", text: "Newton's First Law" },
          { label: "b", text: "Newton's Second Law" },
          { label: "c", text: "Newton's Third Law" },
          { label: "d", text: "Law of Gravitation" }
        ],
        correctAnswer: "c",
        explanation: "Conservation of momentum is derived from Newton's Third Law. During a collision, Object A pushes B with force F, and B pushes A with force -F. Equal forces for equal time means equal and opposite momentum changes — total momentum is conserved."
      },
      {
        question: "Two objects of equal mass collide head-on with equal speeds. If they stick together, their combined velocity after collision is:",
        options: [
          { label: "a", text: "Double the original speed" },
          { label: "b", text: "Half the original speed" },
          { label: "c", text: "Zero" },
          { label: "d", text: "The same speed in one direction" }
        ],
        correctAnswer: "c",
        explanation: "If mass m moves right at speed v, momentum = +mv. The other mass m moves left at speed v, momentum = -mv. Total = mv + (-mv) = 0. After sticking together, total momentum must still be 0 → velocity = 0. They stop dead."
      }
    ],
    shortAnswer: [
      {
        question: "State the law of conservation of momentum.",
        answer: "The total momentum of an isolated system of objects remains constant if no external unbalanced force acts on it. In any interaction, the total momentum before equals the total momentum after: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂.",
        difficulty: "easy"
      },
      {
        question: "What is meant by an 'isolated system' in the context of momentum conservation?",
        answer: "An isolated system is a collection of objects on which no external unbalanced forces (like friction, gravity, or applied forces) act. Only internal forces (between the objects themselves) exist. In practice, we approximate real collisions as isolated because they happen so fast that external forces don't have time to significantly affect the outcome.",
        difficulty: "medium"
      },
      {
        question: "Two ice skaters of equal mass stand facing each other and push off. Describe their motion after pushing.",
        answer: "Before pushing, total momentum = 0 (both stationary). After pushing, by conservation of momentum, total must still = 0. So they move in opposite directions with equal speeds. If each has mass 'm' and one moves right at velocity 'v', the other moves left at velocity '-v'. Their momenta (+mv and -mv) cancel to zero.",
        difficulty: "medium"
      },
      {
        question: "How do forensic investigators use conservation of momentum in car accident investigations?",
        answer: "Investigators measure the masses of the vehicles and analyze skid marks, final positions, and deformation to determine post-crash velocities. Using m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂, they work backward to calculate the pre-crash velocities. This reveals which car was speeding and is used as evidence in court cases to establish fault.",
        difficulty: "hard"
      },
      {
        question: "Explain why the total momentum of fragments from an explosion is zero if the object was initially at rest.",
        answer: "Before the explosion, the object was at rest, so its total momentum was zero (p = mv = m×0 = 0). By conservation of momentum, the total momentum after the explosion must also be zero. This means every fragment going in one direction is exactly balanced by fragments going in the opposite direction. Their momenta cancel out to maintain a total of zero.",
        difficulty: "medium"
      }
    ],
    longAnswer: [
      {
        question: "Prove mathematically that momentum is conserved during a collision between two objects, using Newton's Third Law.",
        answer: "Consider two objects A and B of masses m₁ and m₂ moving with initial velocities u₁ and u₂. They collide, and the collision lasts for time 't'. After collision, their velocities become v₁ and v₂.\n\nDuring the collision:\nForce of A on B: F_AB = m₂(v₂ - u₂)/t [Newton's Second Law]\nForce of B on A: F_BA = m₁(v₁ - u₁)/t [Newton's Second Law]\n\nBy Newton's Third Law: F_AB = -F_BA\nTherefore: m₂(v₂ - u₂)/t = -m₁(v₁ - u₁)/t\n\nMultiplying both sides by t:\nm₂v₂ - m₂u₂ = -m₁v₁ + m₁u₁\n\nRearranging:\nm₁u₁ + m₂u₂ = m₁v₁ + m₂v₂\n\nThis proves total momentum before collision = total momentum after collision. Q.E.D.",
        difficulty: "hard"
      },
      {
        question: "A 10 kg ball moving at 5 m/s collides head-on with a 5 kg ball moving at 3 m/s in the opposite direction. After collision, the 10 kg ball moves at 1 m/s in its original direction. Find the velocity of the 5 kg ball after collision.",
        answer: "Let the direction of the 10 kg ball be positive.\n\nBefore collision:\nMomentum of 10 kg ball = 10 × 5 = 50 kg⋅m/s\nMomentum of 5 kg ball = 5 × (-3) = -15 kg⋅m/s (negative: opposite direction)\nTotal initial momentum = 50 + (-15) = 35 kg⋅m/s\n\nAfter collision:\nMomentum of 10 kg ball = 10 × 1 = 10 kg⋅m/s\nMomentum of 5 kg ball = 5 × v₂\n\nBy conservation: 35 = 10 + 5v₂\n5v₂ = 25\nv₂ = 5 m/s (positive direction)\n\nThe 5 kg ball bounces back and moves at 5 m/s in the direction the 10 kg ball was originally moving. Total momentum is conserved: 10 + 25 = 35 kg⋅m/s ✓",
        difficulty: "hard"
      },
      {
        question: "Explain how rocket propulsion works using the law of conservation of momentum. Include a numerical example.",
        answer: "A rocket on the launch pad has total momentum = 0 (stationary). When it fires, hot exhaust gases are expelled downward at high speed. By conservation of momentum, the rocket must gain equal momentum upward.\n\nLet rocket mass = M and exhaust gas mass per second = m, expelled at velocity v(gas).\nMomentum of exhaust per second = m × v(gas) downward\nMomentum of rocket gained per second = m × v(gas) upward\n\nNumerical example: A 500 kg rocket expels 2 kg of gas per second at 3000 m/s.\nThrust = m × v(gas) = 2 × 3000 = 6000 N\nWeight of rocket = 500 × 10 = 5000 N\nNet upward force = 6000 - 5000 = 1000 N\nAcceleration = F/m = 1000/500 = 2 m/s² upward\n\nAs fuel burns, the rocket gets lighter (say 490 kg after 5 seconds), so acceleration increases: a = (6000 - 4900)/490 ≈ 2.24 m/s². The rocket accelerates faster and faster as it gets lighter — beautifully combining conservation of momentum with F = ma.",
        difficulty: "hard"
      },
      {
        question: "A bullet of mass 20 g is fired from a rifle of mass 5 kg. If the bullet leaves the rifle at 400 m/s, find: (a) the recoil velocity of the rifle, (b) the total momentum before and after firing.",
        answer: "(a) Before firing, total momentum = 0 (both at rest).\nAfter firing: m(bullet)×v(bullet) + m(rifle)×v(rifle) = 0\n0.02 × 400 + 5 × v(rifle) = 0\n8 + 5 × v(rifle) = 0\nv(rifle) = -8/5 = -1.6 m/s\n\nThe rifle recoils backward at 1.6 m/s.\n\n(b) Before firing: Total momentum = 0 kg⋅m/s (everything at rest)\nAfter firing:\nBullet momentum = 0.02 × 400 = +8 kg⋅m/s (forward)\nRifle momentum = 5 × (-1.6) = -8 kg⋅m/s (backward)\nTotal = 8 + (-8) = 0 kg⋅m/s\n\nTotal momentum before (0) = Total momentum after (0). Conservation of momentum is verified. ✓",
        difficulty: "medium"
      },
      {
        question: "Two cars A (1200 kg) and B (800 kg) are moving in the same direction. Car A at 15 m/s rear-ends Car B at 10 m/s. After the collision, they move together. Find their common velocity.",
        answer: "Before collision:\nMomentum of A = 1200 × 15 = 18,000 kg⋅m/s\nMomentum of B = 800 × 10 = 8,000 kg⋅m/s\nTotal initial momentum = 18,000 + 8,000 = 26,000 kg⋅m/s\n\nAfter collision (they stick together):\nCombined mass = 1200 + 800 = 2000 kg\nLet common velocity = v\nTotal final momentum = 2000 × v\n\nBy conservation: 26,000 = 2000 × v\nv = 26,000 / 2000 = 13 m/s\n\nBoth cars move together at 13 m/s in the original direction of travel. This is a perfectly inelastic collision — momentum is conserved but kinetic energy is not (some energy goes into deforming the cars, producing heat and sound).",
        difficulty: "medium"
      }
    ],
    thinkingQuestions: [
      {
        question: "If momentum is always conserved, where does the momentum 'go' when a ball bouncing on the floor eventually stops?",
        answer: "Momentum is conserved only in ISOLATED systems (no external forces). A ball bouncing on a floor is NOT an isolated system — external forces (gravity, friction, air resistance) act on it. Each time the ball bounces, some momentum is transferred to the Earth. The ball pushes the Earth downward, and the Earth pushes the ball upward (Third Law). The Earth gains a tiny amount of momentum with each bounce. Additionally, air resistance transfers momentum to air molecules. Eventually, all the ball's momentum has been transferred to the Earth and surrounding air — but the total momentum of the entire system (ball + Earth + air) is still conserved. The Earth's massive mass means its velocity change is utterly immeasurable.",
        difficulty: "hard"
      },
      {
        question: "In a game of pool, the cue ball hits a stationary ball of equal mass head-on and stops. The stationary ball moves with the cue ball's original speed. Explain this using conservation of momentum.",
        answer: "Before collision: Total momentum = m × v (cue ball) + m × 0 (stationary ball) = mv. After collision: Total momentum = m × 0 (cue ball stopped) + m × v₂ (target ball). By conservation: mv = mv₂ → v₂ = v. The target ball moves at exactly the cue ball's original speed. ALL momentum is transferred from the cue ball to the target ball. This perfect transfer happens only when: (1) the masses are equal, (2) the collision is head-on (not angled), and (3) the collision is elastic (no energy lost to deformation). In real pool, collisions aren't perfectly elastic, so the cue ball doesn't fully stop — it usually continues slowly or spins. But the momentum transfer is a near-perfect demonstration of conservation.",
        difficulty: "hard"
      },
      {
        question: "A spacecraft in deep space needs to slow down but has no fuel left. Can it use conservation of momentum to decelerate? How?",
        answer: "Without fuel, the spacecraft cannot expel mass in the conventional rocket way. However, it could theoretically: (1) Throw objects out the front — if the spacecraft has anything disposable (tools, cargo, structural panels), throwing them forward would create a backward reaction force, slowing the spacecraft. The more mass thrown and the faster it's thrown, the more deceleration. (2) Use a solar sail — light from the Sun carries momentum. A reflective sail catches photons, which bounce off and transfer momentum. By angling the sail, the spacecraft can use photon pressure to gradually decelerate. (3) Aerobraking — if the spacecraft passes through a planet's atmosphere, atmospheric friction transfers its momentum to air molecules, slowing it down. All these methods conserve total system momentum while transferring momentum from the spacecraft to something else.",
        difficulty: "hard"
      },
      {
        question: "Two astronauts of equal mass are floating in space, connected by a rope. One pulls the rope. What happens to each astronaut, and is momentum conserved?",
        answer: "When Astronaut A pulls the rope, the rope transmits the force to Astronaut B, pulling B toward A. But by Newton's Third Law, pulling B toward A also means B pulls A toward B. Both astronauts accelerate toward each other. Since they have equal mass and the forces are equal (Third Law), they accelerate equally and meet exactly at their center of mass (the midpoint of the rope).\n\nMomentum IS conserved: Before pulling, total momentum = 0 (both stationary). After pulling, A moves toward B with momentum +mv, and B moves toward A with momentum -mv. Total = mv + (-mv) = 0. They have equal and opposite momenta at all times. When they collide at the center, if they grab hold of each other, they stop together (total momentum = 0). If they bounce off, they separate with reversed velocities (total momentum still = 0).",
        difficulty: "hard"
      },
      {
        question: "NASA's DART mission crashed a spacecraft into an asteroid to change its orbit. How does conservation of momentum explain this? Was all the spacecraft's momentum transferred?",
        answer: "The DART spacecraft (570 kg) hit the asteroid Dimorphos (~5 billion kg) at 6.6 km/s. By conservation of momentum: spacecraft momentum = 570 × 6600 = 3,762,000 kg⋅m/s. If only momentum transfer occurred, the asteroid's velocity change would be ≈ 3,762,000 / (5 × 10⁹) ≈ 0.00075 m/s — extremely tiny.\n\nHowever, the actual velocity change was about 10 times larger! This is because the collision ejected a massive plume of debris (called ejecta) from the asteroid's surface. This ejecta was like rocket exhaust — material flying off in one direction pushed the asteroid in the other direction (Third Law). The momentum of the ejecta was ADDED to the spacecraft's momentum transfer, amplifying the effect dramatically.\n\nTotal momentum was still conserved: spacecraft momentum = change in asteroid momentum + momentum of all ejecta. The ejecta acted as a 'momentum multiplier,' making the technique far more effective than simple momentum transfer alone. This proved that kinetic impaction is a viable planetary defense strategy.",
        difficulty: "hard"
      }
    ]
  }
];
