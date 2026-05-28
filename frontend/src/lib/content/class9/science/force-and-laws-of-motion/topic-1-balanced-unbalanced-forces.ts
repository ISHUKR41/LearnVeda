/**
 * FILE: topic-1-balanced-unbalanced-forces.ts
 * PURPOSE: Deep research content for Topic 1 of Force & Laws of Motion.
 *          Contains highly detailed explanations and 20 categorized questions.
 *          Modularized to ensure production-level scalability and readability.
 */
import { Topic } from "./types";

export const balancedUnbalancedForces: Topic = {
  /* ═══════════════════════════════════════════
   * TOPIC 1: Introduction to Force — Balanced & Unbalanced Forces
     * ═══════════════════════════════════════════ */
      id: 'balanced-unbalanced-forces',
      title: '1. Introduction to Force: Balanced & Unbalanced Forces',
      estimatedMinutes: 25,
      imageUrl: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&q=80&w=800',
      content: `
### What is Force? (Basic to Advanced)
Imagine you are standing in front of a heavy wooden door. It won't open on its own. You have to either **push** it or **pull** it. This simple push or pull is what we call **Force**. 

In the real world, force is happening everywhere, every second. When you kick a football, you apply force. When you stretch a rubber band, you apply force. Even when you are just sitting on a chair, the Earth is pulling you down with a force called gravity!

> **Scientific Definition:** Force is an external agency (push or pull) that can change or tend to change the state of rest or of uniform motion of a body, or can change its direction or shape.

#### Effects of Force
A force cannot be seen, but its *effects* can be felt and seen. A force can:
1. **Move a stationary object:** Kicking a resting football.
2. **Stop a moving object:** A goalkeeper catching a fast-moving ball.
3. **Change the speed of an object:** Pressing the accelerator of a car.
4. **Change the direction of an object:** A batsman hitting a cricket ball.
5. **Change the shape/size of an object:** Squeezing a toothpaste tube or stretching a spring.

#### The SI Unit of Force
Force is measured in **Newtons (N)**, named after Sir Isaac Newton. One Newton is the force needed to accelerate a 1 kg object at 1 m/s².

### Balanced Forces
When multiple forces act on an object simultaneously, but the object **does not change its state of rest or motion**, the forces are said to be balanced. 
* **Real-world Example:** Think of a game of Tug-of-War. If Team A pulls the rope to the left with a force of 100 Newtons, and Team B pulls to the right with exactly 100 Newtons, the rope won't move. The net force is ZERO ($F_{net} = 0$). 
* **Another Example:** A book resting on a table. Gravity pulls it downward, but the table pushes it upward with an equal "normal force." The book stays still.
* **Key Concept:** Balanced forces do *not* cause acceleration. The object either stays at rest or continues moving at the same speed in the same direction.

### Unbalanced Forces
When the forces acting on an object do not cancel each other out, resulting in a **net force greater than zero**, they are called unbalanced forces. 
* **Real-world Example:** In that same Tug-of-War, if Team A suddenly pulls with 150 Newtons while Team B only pulls with 100 Newtons, the rope (and Team B!) will start moving towards Team A. The net force is $150N - 100N = 50N$ to the left.
* **Key Concept:** Unbalanced forces are *required* to change the speed or direction of an object. If you stop pedaling a bicycle, it eventually stops because of the unbalanced force of **friction** acting against it.

### Why is This Important?
Understanding balanced and unbalanced forces is the foundation for all three of Newton's Laws. Every motion you see — from a rocket launch to a leaf falling from a tree — can be explained using these concepts.
      `,
      questions: [
        /* ── MCQs (5) ── */
        {
          id: 'q1', type: 'mcq', points: 10,
          question: 'Which of the following is NOT an effect of force?',
          options: ['Changing the mass of an object', 'Changing the shape of an object', 'Changing the direction of an object', 'Stopping a moving object'],
          correctAnswer: 'Changing the mass of an object',
          explanation: 'Mass is a fundamental property of matter and remains constant regardless of force applied. Force can change shape, speed, or direction, but not mass.'
        },
        {
          id: 'q2', type: 'mcq', points: 10,
          question: 'In a game of tug-of-war, the rope does not move. What kind of forces are acting on it?',
          options: ['Unbalanced forces', 'Balanced forces', 'Frictional forces only', 'Gravitational forces only'],
          correctAnswer: 'Balanced forces',
          explanation: 'Since the rope does not move, the net force is zero, meaning the forces pulling on both sides are balanced.'
        },
        {
          id: 'q3', type: 'mcq', points: 10,
          question: 'What is required to accelerate a stationary object?',
          options: ['Balanced force', 'Zero net force', 'Unbalanced force', 'Massive weight'],
          correctAnswer: 'Unbalanced force',
          explanation: "Newton's laws tell us that only an unbalanced (net) force can cause an object to accelerate or start moving."
        },
        {
          id: 'q4', type: 'mcq', points: 10,
          question: "If you push a heavy box but it doesn't move, the force you applied is balanced by:",
          options: ['Gravity', 'Air resistance', 'Static friction', 'Magnetic force'],
          correctAnswer: 'Static friction',
          explanation: 'Static friction matches your pushing force exactly up to a certain point, keeping the net force zero and the box stationary.'
        },
        {
          id: 'q5', type: 'mcq', points: 10,
          question: 'The SI unit of force is:',
          options: ['Joule', 'Newton', 'Pascal', 'Watt'],
          correctAnswer: 'Newton',
          explanation: 'Force is measured in Newtons (N), named after Sir Isaac Newton. 1 N = 1 kg × 1 m/s².'
        },

        /* ── Short Answer (5) ── */
        {
          id: 'q6', type: 'short', points: 15,
          question: 'Define balanced forces with a real-life example.',
          correctAnswer: 'Balanced forces occur when equal forces act in opposite directions, resulting in a zero net force. Example: A book resting on a table — gravity pulling down equals the normal force pushing up.',
          explanation: 'The definition must state zero net force, and the example should clearly show opposite, equal forces.'
        },
        {
          id: 'q7', type: 'short', points: 15,
          question: 'Why does a rolling ball eventually stop on a flat surface?',
          correctAnswer: 'A rolling ball stops because of the unbalanced force of friction acting in the opposite direction of its motion, gradually reducing its speed to zero.',
          explanation: 'Friction provides the necessary unbalanced force to decelerate the ball.'
        },
        {
          id: 'q8', type: 'short', points: 15,
          question: 'Can a balanced force change the shape of an object? Give an example.',
          correctAnswer: 'Yes, balanced forces can change the shape of an object. Example: Squeezing a rubber ball evenly from both sides changes its shape without moving it.',
          explanation: "Balanced forces don't change motion, but they can compress or stretch materials."
        },
        {
          id: 'q9', type: 'short', points: 15,
          question: 'What is an unbalanced force?',
          correctAnswer: 'An unbalanced force is when the total net force on an object is not zero, causing a change in its state of motion (speed or direction).',
          explanation: 'Focus on the non-zero net force and its effect on motion.'
        },
        {
          id: 'q10', type: 'short', points: 15,
          question: 'List three changes a force can bring to a moving object.',
          correctAnswer: '1) Increase its speed, 2) Decrease its speed (stop it), 3) Change its direction of motion.',
          explanation: 'Force alters velocity, which includes both speed and direction.'
        },

        /* ── Long Answer (5) ── */
        {
          id: 'q11', type: 'long', points: 20,
          question: 'Explain the difference between balanced and unbalanced forces using the example of a moving bicycle. Include what happens when you pedal and when you stop pedaling.',
          correctAnswer: 'When riding a bicycle at a constant speed, the force you apply through pedaling is exactly balanced by the frictional forces (air resistance and road friction). Because the forces are balanced, the speed remains constant. If you pedal harder (apply more force), the forward force becomes greater than friction, creating an unbalanced force, and the bicycle accelerates. If you stop pedaling, the forward force becomes zero, but friction is still acting backward. This creates an unbalanced force in the opposite direction, causing the bicycle to decelerate and eventually stop.',
          explanation: 'This requires breaking down the forces during constant motion, acceleration, and deceleration.'
        },
        {
          id: 'q12', type: 'long', points: 20,
          question: 'Describe an experiment to demonstrate that an unbalanced force is required to change the state of motion.',
          correctAnswer: 'Take a smooth wooden block and place it on a table. Tie strings to opposite ends of the block. If you pull both strings with equal effort (balanced force), the block does not move. However, if you pull the right string harder than the left string, the force becomes unbalanced, and the block slides to the right. This demonstrates that an object at rest will only move when subjected to an unbalanced force.',
          explanation: 'A classic textbook experiment illustrating the transition from balanced to unbalanced forces.'
        },
        {
          id: 'q13', type: 'long', points: 20,
          question: 'Discuss all the possible effects of force with at least one practical example for each.',
          correctAnswer: '1. Moving a stationary object (kicking a stationary ball). 2. Stopping a moving object (applying brakes to a car). 3. Changing speed (pedaling a bicycle faster). 4. Changing direction (hitting a tennis ball back over the net). 5. Changing shape and size (stretching a rubber band or kneading dough).',
          explanation: 'Comprehensive list of the 5 main effects of force with valid examples.'
        },
        {
          id: 'q14', type: 'long', points: 20,
          question: 'Why do we fall forward when a moving bus suddenly stops? Explain using the concept of forces.',
          correctAnswer: "When we are in a moving bus, our body shares the motion of the bus. When the driver applies brakes, an unbalanced force (friction) stops the bus. The lower part of our body, in contact with the seat/floor, comes to rest with the bus. However, the upper part of our body tends to remain in its state of motion due to inertia. Because there is no backward unbalanced force acting directly on our upper body to stop it simultaneously, it falls forward.",
          explanation: 'Links the concept of unbalanced forces acting on different parts of the system.'
        },
        {
          id: 'q15', type: 'long', points: 20,
          question: 'How do frictional forces interact with applied forces? Explain static vs. kinetic situations.',
          correctAnswer: "When you push a heavy object, static friction acts in the opposite direction. As long as your push is less than the maximum static friction, the forces remain balanced and the object doesn't move. Once your applied force exceeds static friction, the force becomes unbalanced, and the object moves. At this point, kinetic friction takes over, which is usually less than static friction. You must continue to apply a force equal to kinetic friction to keep the object moving at a constant speed (balanced forces), or apply more to accelerate it.",
          explanation: 'Detailed breakdown of how friction opposes applied force.'
        },

        /* ── Thinking / HOTS (5) ── */
        {
          id: 'q16', type: 'thinking', points: 25,
          question: 'Imagine a universe with zero friction. If you push a block of ice on a flat surface, what will happen to its motion? Will it ever stop?',
          correctAnswer: 'In a frictionless universe, once you apply an unbalanced force to start the block moving, it will accelerate. The moment you stop pushing, the net force becomes exactly zero. Without friction or air resistance to act as an unbalanced opposing force, the block will continue moving in a straight line at a constant speed forever, or until it hits another object.',
          explanation: 'Tests the understanding that stopping requires an opposing force.'
        },
        {
          id: 'q17', type: 'thinking', points: 25,
          question: 'A skydiver is falling through the air. Initially, they accelerate, but eventually, they fall at a constant speed called terminal velocity. Explain the forces acting on the skydiver during these two phases.',
          correctAnswer: 'Phase 1: When the skydiver jumps, gravity pulls them down. Air resistance pushes up but is weaker than gravity. The net force is unbalanced downwards, causing acceleration. Phase 2: As speed increases, air resistance also increases. Eventually, the upward air resistance exactly equals the downward pull of gravity. The forces become balanced (Net force = 0), so acceleration stops, and they fall at a constant speed.',
          explanation: 'Applies balanced/unbalanced forces to fluid dynamics (air resistance).'
        },
        {
          id: 'q18', type: 'thinking', points: 25,
          question: 'If unbalanced forces cause acceleration, how can a rocket accelerate in space where there is no air to push against?',
          correctAnswer: "A rocket does not need air to push against. It burns fuel and pushes exhaust gases backward out of its engine. According to Newton's Third Law (Action-Reaction), the gases push the rocket forward with an equal and opposite force. This forward thrust is an unbalanced force that causes the rocket to accelerate in the vacuum of space.",
          explanation: 'Clarifies a common misconception about how forces work in a vacuum.'
        },
        {
          id: 'q19', type: 'thinking', points: 25,
          question: 'Two identical cars are traveling at 50 km/h. Car A hits a concrete wall. Car B hits a massive haystack. Both stop. Compare the forces involved in stopping both cars.',
          correctAnswer: 'Both cars experience an unbalanced force that brings their speed to zero. However, Car A stops almost instantly, meaning a massive unbalanced force is applied over a very short time. Car B stops gradually as it plunges into the hay, meaning a much smaller unbalanced force is applied over a longer period of time. (This introduces the concept of impulse = Force × Time).',
          explanation: 'Links force to time and deceleration.'
        },
        {
          id: 'q20', type: 'thinking', points: 25,
          question: 'You are floating in a swimming pool. Explain the balanced forces that keep you from sinking to the bottom or floating up into the air.',
          correctAnswer: 'Two main forces are acting on your body. Gravity is pulling your mass downward. Simultaneously, the water is exerting an upward force called buoyancy (Archimedes\' Principle). When you float perfectly still, the downward force of gravity is exactly balanced by the upward buoyant force of the water. The net force is zero.',
          explanation: 'Applies force concepts to buoyancy.'
        }
      ]
    };
