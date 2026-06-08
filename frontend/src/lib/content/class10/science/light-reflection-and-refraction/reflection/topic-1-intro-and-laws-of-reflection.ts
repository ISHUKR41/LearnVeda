/**
 * FILE: topic-1-intro-and-laws-of-reflection.ts
 * LOCATION: src/lib/content/class10/science/light-reflection-and-refraction/reflection/topic-1-intro-and-laws-of-reflection.ts
 * PURPOSE: Contains the detailed content, explanations, and practice questions for
 *          Topic 1: Introduction to Light and Laws of Reflection.
 *          Provides comprehensive notes, diagrams (via markdown), and 20 practice questions.
 * LAST UPDATED: 2026-06-08
 */

import { Topic } from "../../shared-types";

export const topic1IntroAndLawsOfReflection: Topic = {
  id: "intro-and-laws-of-reflection",
  title: "1. Introduction to Light and Laws of Reflection",
  estimatedMinutes: 45,
  imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200",
  content: `
### What is Light?

Light is a form of energy that enables us to see the world around us. Although light itself is invisible, it makes objects visible when it bounces off them and enters our eyes.

Light exhibits dual nature: it acts both as a wave (electromagnetic wave) and as a particle (photon). However, for the scope of Class 10, we primarily treat light as a **ray** that travels in a straight line.

**Key Properties of Light:**
1. **Electromagnetic Wave:** Light does not require any material medium to travel. It can travel through a vacuum.
2. **Speed:** The speed of light is maximum in a vacuum, which is $c = 3 \\times 10^8 \\text{ m/s}$.
3. **Rectilinear Propagation:** Light travels in a straight line. This is why shadows are formed when an opaque object blocks the path of light.
4. **Transverse Wave:** Light is a transverse wave, meaning its electric and magnetic fields oscillate perpendicular to the direction of propagation.

---

### Reflection of Light

When light falls on the surface of an object, some of it bounces back into the same medium. This bouncing back of light rays is called **Reflection of Light**.

Highly polished surfaces, such as mirrors, reflect most of the light falling on them.

#### Types of Reflection
1. **Regular (Specular) Reflection:** Occurs when parallel beams of light fall on a smooth, highly polished surface (like a plane mirror) and are reflected as parallel beams. This type of reflection forms sharp images.
2. **Irregular (Diffuse) Reflection:** Occurs when parallel beams of light fall on a rough surface (like a wall or paper) and are reflected in various different directions. This does not form an image but allows us to see the object from any angle.

---

### Terminology Related to Reflection

Before understanding the laws of reflection, let's define the key terms:
*   **Incident Ray:** The ray of light that falls on the reflecting surface.
*   **Reflected Ray:** The ray of light that bounces back from the reflecting surface.
*   **Point of Incidence:** The point on the surface where the incident ray strikes.
*   **Normal:** A line drawn perpendicular to the reflecting surface at the point of incidence.
*   **Angle of Incidence ($i$):** The angle between the incident ray and the normal.
*   **Angle of Reflection ($r$):** The angle between the reflected ray and the normal.

---

### The Laws of Reflection

The reflection of light by any surface (plane or curved) obeys the following two laws of reflection:

**First Law of Reflection:**
> The angle of incidence is always equal to the angle of reflection.
> $$ \\angle i = \\angle r $$

**Second Law of Reflection:**
> The incident ray, the reflected ray, and the normal at the point of incidence, all lie in the same plane.

*Note:* These laws are universally applicable to all types of reflecting surfaces, including spherical surfaces (concave and convex mirrors).

---

### Image Formation by a Plane Mirror

A plane mirror is a flat glass surface with a thin layer of silver (the reflecting layer) on the back, protected by a coat of paint.

**Characteristics of the image formed by a plane mirror:**
1.  **Virtual and Erect:** The image cannot be obtained on a screen (virtual) and is upright (erect).
2.  **Same Size:** The size of the image is exactly equal to the size of the object.
3.  **Same Distance:** The distance of the image behind the mirror is equal to the distance of the object in front of the mirror. ($u = v$)
4.  **Laterally Inverted:** The image undergoes lateral inversion, meaning the right side of the object appears as the left side of the image, and vice versa. (This is why the word "AMBULANCE" is written in reverse on emergency vehicles).

---
### Exam Summary
*   **Light:** Electromagnetic wave, travels at $3 \\times 10^8 \\text{ m/s}$ in a vacuum. Travels in straight lines (Rectilinear propagation).
*   **Reflection:** Bouncing back of light into the same medium.
*   **Laws of Reflection:** (1) $\\angle i = \\angle r$. (2) Incident ray, reflected ray, and normal lie in the same plane.
*   **Plane Mirror Image:** Virtual, erect, same size, same distance, laterally inverted.
`,
  questions: [
    // --- MCQ (5 Questions) ---
    {
      id: "t1q1",
      type: "mcq",
      question: "Which of the following describes the nature of light as considered in classical ray optics?",
      options: [
        "Light bends around all macroscopic objects.",
        "Light travels in a straight line.",
        "Light requires a material medium to propagate.",
        "Light travels slower in a vacuum than in glass."
      ],
      correctAnswer: "Light travels in a straight line.",
      explanation: "In classical ray optics (geometrical optics), light is considered to travel in a straight line, which is known as rectilinear propagation.",
      points: 10
    },
    {
      id: "t1q2",
      type: "mcq",
      question: "According to the laws of reflection, if the angle of incidence is $45^\\circ$, what is the angle of reflection?",
      options: [
        "$90^\\circ$",
        "$0^\\circ$",
        "$45^\\circ$",
        "$22.5^\\circ$"
      ],
      correctAnswer: "$45^\\circ$",
      explanation: "The first law of reflection states that the angle of incidence is exactly equal to the angle of reflection ($\\angle i = \\angle r$).",
      points: 10
    },
    {
      id: "t1q3",
      type: "mcq",
      question: "An object is placed 10 cm in front of a plane mirror. What is the distance between the object and its image?",
      options: [
        "10 cm",
        "20 cm",
        "5 cm",
        "0 cm"
      ],
      correctAnswer: "20 cm",
      explanation: "The image is formed 10 cm behind the mirror. Therefore, the total distance between the object and the image is $10 \\text{ cm} + 10 \\text{ cm} = 20 \\text{ cm}$.",
      points: 10
    },
    {
      id: "t1q4",
      type: "mcq",
      question: "Which phenomenon is responsible for us being able to read a book from different angles in a room?",
      options: [
        "Regular reflection",
        "Refraction",
        "Irregular (Diffuse) reflection",
        "Dispersion"
      ],
      correctAnswer: "Irregular (Diffuse) reflection",
      explanation: "The rough surface of the paper causes irregular or diffuse reflection, scattering the light in all directions, which allows us to read the book from any angle.",
      points: 10
    },
    {
      id: "t1q5",
      type: "mcq",
      question: "If a light ray strikes a plane mirror normally (perpendicular to the surface), what will be its angle of reflection?",
      options: [
        "$90^\\circ$",
        "$180^\\circ$",
        "$0^\\circ$",
        "$45^\\circ$"
      ],
      correctAnswer: "$0^\\circ$",
      explanation: "When a ray strikes normally, it coincides with the normal. Thus, the angle of incidence $\\angle i = 0^\\circ$. By the law of reflection, $\\angle r = 0^\\circ$, meaning it retraces its path.",
      points: 10
    },

    // --- Short Answer (5 Questions) ---
    {
      id: "t1q6",
      type: "short",
      question: "State the two laws of reflection of light.",
      correctAnswer: "1. The angle of incidence is equal to the angle of reflection ($\\angle i = \\angle r$). \n2. The incident ray, the normal to the mirror at the point of incidence, and the reflected ray, all lie in the same plane.",
      explanation: "These are the fundamental laws that govern the reflection of light from any surface, smooth or rough, plane or spherical.",
      points: 15
    },
    {
      id: "t1q7",
      type: "short",
      question: "What is meant by the rectilinear propagation of light?",
      correctAnswer: "Rectilinear propagation of light is the property by which light travels in a straight line in a uniform medium.",
      explanation: "This property is the reason why shadows are formed when an opaque object blocks light.",
      points: 15
    },
    {
      id: "t1q8",
      type: "short",
      question: "Write two distinct characteristics of an image formed by a plane mirror.",
      correctAnswer: "1. The image is virtual and erect.\n2. The image is of the same size as the object.\n(Additional acceptable answers: Laterally inverted, formed at the same distance behind the mirror as the object is in front of it).",
      explanation: "A plane mirror always forms a virtual, erect, and laterally inverted image of the exact same size as the object.",
      points: 15
    },
    {
      id: "t1q9",
      type: "short",
      question: "Why is the word 'AMBULANCE' written laterally inverted on the front of an ambulance?",
      correctAnswer: "It is written laterally inverted so that the driver of a vehicle ahead can see it as the correct word 'AMBULANCE' in their rear-view mirror due to lateral inversion, and give way.",
      explanation: "Mirrors cause lateral inversion, swapping the left and right sides. Writing it in reverse compensates for this effect in the driver's mirror.",
      points: 15
    },
    {
      id: "t1q10",
      type: "short",
      question: "Define the term 'Normal' in the context of reflection of light.",
      correctAnswer: "The normal is an imaginary straight line drawn perpendicular to the reflecting surface at the point of incidence.",
      explanation: "The normal serves as the reference line for measuring the angles of incidence and reflection.",
      points: 15
    },

    // --- Long Answer (5 Questions) ---
    {
      id: "t1q11",
      type: "long",
      question: "Differentiate between regular reflection and irregular (diffuse) reflection. Provide one example for each.",
      correctAnswer: "Regular Reflection:\n1. Occurs on smooth and polished surfaces.\n2. Parallel incident rays reflect as parallel rays.\n3. Forms a clear image.\nExample: Reflection from a plane mirror.\n\nIrregular (Diffuse) Reflection:\n1. Occurs on rough and uneven surfaces.\n2. Parallel incident rays reflect in various different directions.\n3. Does not form a clear image, but makes objects visible.\nExample: Reflection from a wall or a piece of paper.",
      explanation: "The smoothness of the surface at a microscopic level determines whether reflection is regular or diffuse. Even though diffuse reflection scatters light, the laws of reflection still hold true at every single microscopic point.",
      points: 20
    },
    {
      id: "t1q12",
      type: "long",
      question: "Explain the properties of the image formed by a plane mirror in detail. How would the image of the letter 'P' appear?",
      correctAnswer: "Properties of the image formed by a plane mirror:\n1. Virtual: The image cannot be captured on a screen as the light rays only appear to diverge from the image behind the mirror.\n2. Erect: The image is upright relative to the object.\n3. Same Size: The height of the image equals the height of the object.\n4. Equidistant: The image is formed as far behind the mirror as the object is in front of it.\n5. Laterally Inverted: The left side of the object appears as the right side of the image.\n\nThe letter 'P' would appear laterally inverted, looking like the letter 'q'.",
      explanation: "Plane mirrors create images through the geometric extension of reflected rays backwards, resulting in virtual, identical-sized, and equidistant images with left-right reversal.",
      points: 20
    },
    {
      id: "t1q13",
      type: "long",
      question: "A boy of height 1.5 m is standing 3 m away from a plane mirror. (a) What is the distance between the boy and his image? (b) What is the height of his image? (c) If he moves 1 m towards the mirror, what will be the new distance between him and his image?",
      correctAnswer: "(a) The image is 3 m behind the mirror. Distance between boy and image = $3 \\text{ m} + 3 \\text{ m} = 6 \\text{ m}$.\n(b) The height of the image is the same as the object, so it is 1.5 m.\n(c) If he moves 1 m towards the mirror, his distance from the mirror is 2 m. The image is 2 m behind the mirror. The new distance is $2 \\text{ m} + 2 \\text{ m} = 4 \\text{ m}$.",
      explanation: "This tests the knowledge that object distance equals image distance ($u = v$) and object height equals image height ($h = h'$).",
      points: 20
    },
    {
      id: "t1q14",
      type: "long",
      question: "Describe an experiment to prove that the angle of incidence is equal to the angle of reflection.",
      correctAnswer: "Experiment:\n1. Fix a white sheet of paper on a drawing board and draw a straight line. Place a plane mirror vertically on this line.\n2. Draw a normal (perpendicular line) to the mirror at the center.\n3. Draw a line making an angle (e.g., $30^\\circ$) with the normal. This is the incident ray.\n4. Place two pins (P and Q) vertically on this incident ray line.\n5. Look at the images of pins P and Q in the mirror from the other side of the normal.\n6. Fix two more pins (R and S) such that they are in a straight line with the images of P and Q.\n7. Remove the mirror and pins, draw the line connecting R and S to the mirror. This is the reflected ray.\n8. Measure the angle between the reflected ray and the normal (angle of reflection). It will be found exactly equal to the angle of incidence ($30^\\circ$).",
      explanation: "This classic pin experiment visually demonstrates the geometric path of light rays and verifies the first law of reflection.",
      points: 20
    },
    {
      id: "t1q15",
      type: "long",
      question: "What would happen if the speed of light was infinite? How would this affect our observation of distant celestial bodies like stars?",
      correctAnswer: "If the speed of light were infinite, light would take zero time to travel any distance. \n1. We would see events happening in the universe instantaneously, without any time delay.\n2. Currently, we see stars as they were years ago because light takes time to reach us. If the speed were infinite, we would see the stars exactly as they are at this very moment, eliminating the concept of 'looking back in time' when observing the cosmos.",
      explanation: "The finite speed of light ($3 \\times 10^8 \\text{ m/s}$) means that looking at distant objects is looking into the past. Infinite speed would mean instantaneous information transfer.",
      points: 20
    },

    // --- Higher Order Thinking Skills (HOTS) (5 Questions) ---
    {
      id: "t1q16",
      type: "thinking",
      question: "Two plane mirrors are placed at an angle of $90^\\circ$ to each other. A ray of light strikes the first mirror at an angle of incidence of $30^\\circ$. What will be its angle of reflection from the second mirror?",
      correctAnswer: "The ray strikes the first mirror at $30^\\circ$ and reflects at $30^\\circ$. \nThe glancing angle with the first mirror is $90^\\circ - 30^\\circ = 60^\\circ$. \nBecause the mirrors are at $90^\\circ$, they form a right-angled triangle with the ray's path. The glancing angle at the second mirror is $90^\\circ - 60^\\circ = 30^\\circ$. \nThe angle of incidence at the second mirror is the angle with the normal, which is $90^\\circ - 30^\\circ = 60^\\circ$.\nTherefore, the angle of reflection from the second mirror is $60^\\circ$.",
      explanation: "This requires applying geometry along with the law of reflection across multiple surfaces. The sum of the angles of incidence at two perpendicular mirrors is always $90^\\circ$.",
      points: 25
    },
    {
      id: "t1q17",
      type: "thinking",
      question: "A person wants to see their full image in a plane mirror. What is the minimum length of the mirror required, in terms of the person's height? Provide a brief geometrical reasoning.",
      correctAnswer: "The minimum length of the mirror required is exactly half the height of the person.\nReasoning: To see the top of the head, light must travel from the head, hit the mirror, and reflect to the eyes. The point on the mirror must be exactly halfway between the head and eyes. To see the feet, light must travel from the feet, hit the mirror, and reflect to the eyes. This point must be halfway between the feet and eyes. The distance between these two points on the mirror is exactly half the total height of the person.",
      explanation: "This classic geometric optics problem demonstrates that the required mirror size is independent of the person's distance from the mirror.",
      points: 25
    },
    {
      id: "t1q18",
      type: "thinking",
      question: "If a plane mirror is rotated by an angle $\\theta$ while keeping the incident ray fixed, by what angle does the reflected ray rotate?",
      correctAnswer: "The reflected ray rotates by an angle of $2\\theta$.",
      explanation: "When the mirror rotates by $\\theta$, the normal also rotates by $\\theta$. If the original angle of incidence was $i$, the new angle of incidence becomes $i + \\theta$. Since the new angle of reflection is also $i + \\theta$, the total angle between the incident and reflected ray is $2(i + \\theta)$. The original angle was $2i$. The difference is $2(i + \\theta) - 2i = 2\\theta$.",
      points: 25
    },
    {
      id: "t1q19",
      type: "thinking",
      question: "You are in a completely dark room. A very smooth, perfectly clean plane mirror and a sheet of white paper are on the table. You shine a narrow laser beam at an angle onto both. Which object will appear brighter when viewed from various angles around the room? Why?",
      correctAnswer: "The sheet of white paper will appear brighter from various angles. \nThe plane mirror undergoes regular reflection, meaning the laser beam bounces off in one specific direction. Unless your eye is directly in the path of that reflected beam, the mirror will look dark.\nThe white paper undergoes diffuse (irregular) reflection, scattering the laser light in all directions. Therefore, some light will reach your eyes regardless of your position in the room.",
      explanation: "This tests the practical difference between specular and diffuse reflection. Diffuse reflection is what makes non-luminous objects visible to us.",
      points: 25
    },
    {
      id: "t1q20",
      type: "thinking",
      question: "A watch shows the time as 3:25. If you look at the watch through a plane mirror, what time will the image appear to show?",
      correctAnswer: "The image will appear to show 8:35.",
      explanation: "A plane mirror causes lateral inversion. For a standard analog clock face without numbers, the mirror image time can be calculated by subtracting the actual time from 11:60 (which is 12:00). So, $11:60 - 3:25 = 8:35$. The hands are flipped horizontally across the 12-6 axis.",
      points: 25
    }
  ]
};
