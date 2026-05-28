/**
 * FILE: topic-3-second-law-of-motion.ts
 * PURPOSE: Deep research content for Topic 3 of Force & Laws of Motion.
 *          Contains highly detailed explanations and 20 categorized questions.
 *          Modularized to ensure production-level scalability and readability.
 */
import { Topic } from "./types";

export const secondLawOfMotion: Topic = {
  /* ═══════════════════════════════════════════
   * TOPIC 3: Newton's Second Law of Motion (F = ma)
     * ═══════════════════════════════════════════ */
      id: 'second-law-of-motion',
      title: "3. Newton's Second Law of Motion (F = ma)",
      estimatedMinutes: 35,
      imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800',
      content: `
### The Big Question the First Law Didn't Answer
Newton's First Law told us that unbalanced forces cause acceleration. But it didn't tell us **how much** acceleration! If you push a cart gently, it moves slowly. If you push it hard, it flies forward. The Second Law gives us the precise mathematical relationship.

### What is Momentum?
Before understanding the Second Law, we need to understand **Momentum**. 
> **Momentum (p)** = Mass × Velocity = **m × v**

Think of it this way: What is more dangerous — being hit by a bicycle going at 20 km/h or a truck going at 20 km/h? Obviously the truck! Even though both have the same speed, the truck has far more mass, and therefore far more momentum. Momentum is the "quantity of motion" an object has.

* **Units:** kg·m/s (kilogram meter per second)
* **Key Insight:** Momentum is a **vector** — it has both magnitude and direction.

#### Real-World Examples of Momentum
* A bullet has high momentum despite its small mass because its velocity is enormous (~900 m/s).
* A slow-moving loaded truck has high momentum because of its massive weight.
* A stationary object has zero momentum (v = 0, so p = m × 0 = 0).

### Newton's Second Law — The Equation
> **"The rate of change of momentum of an object is directly proportional to the unbalanced force applied and takes place in the direction of the force."**

Mathematically:
$$F = \\frac{\\Delta p}{\\Delta t} = \\frac{m(v - u)}{t} = m \\times a$$

Where:
* **F** = Force applied (in Newtons, N)
* **m** = Mass of the object (in kg)
* **a** = Acceleration produced (in m/s²)
* **u** = Initial velocity
* **v** = Final velocity
* **t** = Time taken

### What Does F = ma Actually Mean?
This is the most important equation in all of mechanics. It tells us three things:

1. **More force → More acceleration**: If you push harder, the object speeds up faster.
2. **More mass → Less acceleration**: A heavier object is harder to accelerate (it has more inertia!).
3. **Force and acceleration are in the same direction**: Push right, it accelerates right.

### Why Does a Cricket Player Move Their Hands Backwards While Catching?
When a fast cricket ball hits your hands, it has a lot of momentum. To stop the ball, you need to reduce its momentum to zero. By pulling your hands backward, you **increase the time** over which the ball's momentum changes. Since F = Δp/Δt, increasing time *decreases* the force on your hands, preventing injury.

### 1 Newton Defined
From F = ma, we can define: **1 Newton is the force required to give a mass of 1 kg an acceleration of 1 m/s².**

$$1 \\ N = 1 \\ kg \\times 1 \\ m/s^2$$

### Numerical Problem Example
**Problem:** A car of mass 1000 kg is moving at 20 m/s. The driver applies brakes and the car stops in 5 seconds. Calculate the braking force.

**Solution:**
- m = 1000 kg, u = 20 m/s, v = 0 m/s, t = 5 s
- a = (v - u) / t = (0 - 20) / 5 = -4 m/s²
- F = m × a = 1000 × (-4) = **-4000 N**
- The negative sign means the force acts in the opposite direction of motion (braking force).
      `,
      questions: [
        /* ── MCQs (5) ── */
        {
          id: 'q41', type: 'mcq', points: 10,
          question: "Newton's Second Law of Motion gives us the relationship between:",
          options: ['Speed and distance', 'Force, mass, and acceleration', 'Action and reaction forces', 'Inertia and friction'],
          correctAnswer: 'Force, mass, and acceleration',
          explanation: "The Second Law states F = ma, connecting force, mass, and acceleration."
        },
        {
          id: 'q42', type: 'mcq', points: 10,
          question: 'A force of 10 N acts on a body of mass 2 kg. The acceleration produced is:',
          options: ['5 m/s²', '20 m/s²', '0.2 m/s²', '12 m/s²'],
          correctAnswer: '5 m/s²',
          explanation: 'Using F = ma → a = F/m = 10/2 = 5 m/s².'
        },
        {
          id: 'q43', type: 'mcq', points: 10,
          question: 'The SI unit of momentum is:',
          options: ['N·s', 'kg·m/s', 'kg·m/s²', 'Both A and B'],
          correctAnswer: 'Both A and B',
          explanation: 'Momentum = mass × velocity = kg·m/s. Also, since F = Δp/Δt, N·s = kg·m/s. Both are equivalent.'
        },
        {
          id: 'q44', type: 'mcq', points: 10,
          question: 'If the same force is applied to two objects of masses 5 kg and 10 kg, which will accelerate more?',
          options: ['The 10 kg object', 'The 5 kg object', 'Both accelerate equally', 'Neither will accelerate'],
          correctAnswer: 'The 5 kg object',
          explanation: 'a = F/m. With the same force, the lighter object has greater acceleration.'
        },
        {
          id: 'q45', type: 'mcq', points: 10,
          question: 'A cricket player moves his hands backward while catching a ball. This is to:',
          options: ['Increase the force on the ball', 'Decrease the time of impact', 'Increase the time of impact, reducing force', 'Change the direction of the ball'],
          correctAnswer: 'Increase the time of impact, reducing force',
          explanation: "F = Δp/Δt. By increasing Δt, the force F decreases, protecting the player's hands."
        },

        /* ── Short Answer (5) ── */
        {
          id: 'q46', type: 'short', points: 15,
          question: 'Define momentum. Write its formula and SI unit.',
          correctAnswer: 'Momentum is the product of mass and velocity of a moving body. Formula: p = m × v. SI unit: kg·m/s.',
          explanation: 'Momentum measures the "quantity of motion" an object possesses.'
        },
        {
          id: 'q47', type: 'short', points: 15,
          question: "State Newton's Second Law of Motion.",
          correctAnswer: 'The rate of change of momentum of an object is directly proportional to the applied unbalanced force, and takes place in the direction of the force. Mathematically, F = ma.',
          explanation: 'The law connects force to the rate of change of momentum.'
        },
        {
          id: 'q48', type: 'short', points: 15,
          question: 'Define one Newton of force.',
          correctAnswer: 'One Newton is the force required to give a mass of 1 kilogram an acceleration of 1 metre per second squared. 1 N = 1 kg × 1 m/s².',
          explanation: 'Derived directly from F = ma.'
        },
        {
          id: 'q49', type: 'short', points: 15,
          question: 'Why is it easier to stop a tennis ball than a cricket ball moving at the same speed?',
          correctAnswer: 'A tennis ball has less mass than a cricket ball. Since momentum = mass × velocity, the tennis ball has less momentum. Less momentum means less force is needed to stop it (F = Δp/Δt).',
          explanation: 'Relates mass to momentum and the force required to change it.'
        },
        {
          id: 'q50', type: 'short', points: 15,
          question: "How does Newton's Second Law include the First Law as a special case?",
          correctAnswer: 'When F = 0 (no unbalanced force), then ma = 0, which means a = 0 (no acceleration). An object with zero acceleration maintains its state of rest or uniform motion — which is exactly the First Law!',
          explanation: 'Shows mathematical relationship between the two laws.'
        },

        /* ── Long Answer (5) ── */
        {
          id: 'q51', type: 'long', points: 20,
          question: "Derive the mathematical expression for Newton's Second Law of Motion: F = ma.",
          correctAnswer: "Consider an object of mass m. Let its initial velocity be u and final velocity be v after time t. Initial momentum = mu. Final momentum = mv. Change in momentum = mv - mu = m(v - u). Rate of change of momentum = m(v-u)/t. But (v-u)/t = acceleration (a). So rate of change of momentum = ma. According to Newton's Second Law, Force is proportional to rate of change of momentum: F ∝ ma. In SI units, the constant of proportionality is 1, so F = ma.",
          explanation: 'Step-by-step derivation from the definition of momentum.'
        },
        {
          id: 'q52', type: 'long', points: 20,
          question: 'A truck of mass 5000 kg is moving at 36 km/h. Calculate: (a) the momentum of the truck, (b) the force required to stop it in 10 seconds.',
          correctAnswer: "(a) First, convert 36 km/h to m/s: 36 × (5/18) = 10 m/s. Momentum p = mv = 5000 × 10 = 50,000 kg·m/s. (b) u = 10 m/s, v = 0, t = 10 s. a = (v-u)/t = (0-10)/10 = -1 m/s². F = ma = 5000 × (-1) = -5000 N. The braking force required is 5000 N acting opposite to the direction of motion.",
          explanation: 'Numerical problem combining momentum and force calculations.'
        },
        {
          id: 'q53', type: 'long', points: 20,
          question: "Explain why karate experts break bricks with their bare hands without injury, using Newton's Second Law.",
          correctAnswer: "Karate experts strike the bricks with extremely high velocity, delivering maximum momentum in an extremely short time interval. Since F = Δp/Δt, a very small Δt creates a very large force that breaks the bricks. For the expert's hand, the bricks break before the hand decelerates significantly, meaning the reaction time on the hand is also very short but the momentum change of the hand is distributed. Additionally, the hand is conditioned and the strike is concentrated on a small area, maximizing pressure.",
          explanation: 'Connects force, momentum, and time in a dramatic real-world example.'
        },
        {
          id: 'q54', type: 'long', points: 20,
          question: 'Two objects have the same momentum. Object A has a mass of 2 kg and Object B has a mass of 10 kg. Compare their velocities and accelerations if the same force is applied.',
          correctAnswer: "Since p = mv and both have the same momentum: 2 × vA = 10 × vB, so vA = 5 × vB. Object A must be moving 5 times faster than Object B. If the same force F is applied to both: aA = F/2, aB = F/10. So aA = 5 × aB. Object A will accelerate 5 times more than Object B because it has less mass (less inertia).",
          explanation: 'Compares momentum and acceleration for objects of different masses.'
        },
        {
          id: 'q55', type: 'long', points: 20,
          question: 'Explain why a fielder gradually pulls back his hands while catching a fast-moving ball.',
          correctAnswer: "A fast-moving cricket ball has significant momentum (p = mv). To catch it, the fielder must bring the ball's velocity to zero, i.e., change its momentum completely. The required change in momentum (Δp) is fixed. From F = Δp/Δt, if the fielder keeps his hands rigid (very small Δt), the force on his hands will be extremely large, potentially causing injury. By pulling the hands backward, the fielder increases the time interval (Δt) over which the ball's momentum changes to zero. This significantly reduces the impact force, making the catch safe and painless.",
          explanation: "Classic NCERT application of Newton's Second Law."
        },

        /* ── Thinking / HOTS (5) ── */
        {
          id: 'q56', type: 'thinking', points: 25,
          question: 'If the mass of an object is doubled and the force applied remains the same, what happens to the acceleration? What happens if the force is also doubled?',
          correctAnswer: "From F = ma: If mass doubles and force stays the same, a = F/(2m), so acceleration becomes half. If force is also doubled, a = 2F/(2m) = F/m, so acceleration remains the same as the original. This shows that acceleration depends on the RATIO of force to mass.",
          explanation: 'Tests proportional reasoning with the Second Law equation.'
        },
        {
          id: 'q57', type: 'thinking', points: 25,
          question: 'A bullet of mass 20g is fired from a gun at 500 m/s. The gun has a mass of 4 kg. Why does the gun recoil much slower than the bullet?',
          correctAnswer: "When the bullet is fired, the force on the bullet (forward) equals the force on the gun (backward) by Newton's Third Law. But F = ma: For the bullet, 500 = F/(0.02) → F = 10 N. For the gun, a = F/m = 10/4 = 2.5 m/s². So the gun's acceleration is 2.5 m/s² compared to the bullet's acceleration of 500 m/s². The gun recoils much slower because it has 200 times more mass, giving it 200 times less acceleration for the same force.",
          explanation: "Combines Second and Third Laws in a single problem."
        },
        {
          id: 'q58', type: 'thinking', points: 25,
          question: "An astronaut in outer space pushes a 100 kg satellite with a force of 50 N. The astronaut's mass is 80 kg. What happens to both the astronaut and the satellite?",
          correctAnswer: "The satellite accelerates: a = F/m = 50/100 = 0.5 m/s² (away from the astronaut). By Newton's Third Law, the satellite pushes back on the astronaut with 50 N. The astronaut accelerates: a = 50/80 = 0.625 m/s² (away from the satellite). Both drift apart! The lighter astronaut actually accelerates faster than the heavier satellite, which is a counterintuitive but important result of F = ma.",
          explanation: "Tests application of Newton's laws in zero-gravity conditions."
        },
        {
          id: 'q59', type: 'thinking', points: 25,
          question: 'Why are cars designed with "crumple zones" in the front and back? Explain using the concept of force and time.',
          correctAnswer: "In a collision, the car must stop (momentum must change to zero). Crumple zones are designed to crush slowly and gradually during impact, increasing the time over which the collision occurs. From F = Δp/Δt, increasing the collision time Δt dramatically reduces the peak force F on the passengers. A rigid car would stop almost instantly (tiny Δt), creating enormous force. The crumple zone trades structural damage for passenger safety by spreading the deceleration over a longer period.",
          explanation: 'Engineering application of impulse-momentum theorem.'
        },
        {
          id: 'q60', type: 'thinking', points: 25,
          question: 'Two identical balls, A and B, are dropped from the same height. Ball A lands on concrete and bounces back. Ball B lands on soft sand and stops. Which ball experiences a greater change in momentum? Which ball experiences a greater force?',
          correctAnswer: "Ball A experiences GREATER change in momentum because it bounces back (its velocity reverses direction), so Δp = m(v) - m(-v) = 2mv. Ball B simply stops, so Δp = mv. However, Ball A also experiences a GREATER force during the bounce because the time of contact with concrete is very short, and the momentum change is larger. Ball B experiences less force because sand increases the contact time AND the momentum change is smaller.",
          explanation: 'Distinguishes between momentum change and force — a common HOTS question.'
        }
      ]
    };
