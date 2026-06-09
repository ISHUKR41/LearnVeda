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
  simulationIds: [
    "light-plane-mirror",
    "light-regular-diffuse",
    "light-lateral-inversion",
    "light-two-mirrors",
    "light-min-mirror",
    "light-glass-slab-lab",
    "adv-plane-mirror",
  ],
  imageUrl: "/images/light/topic1-reflection-laws.png",
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

#### 📌 Must-Know Definitions
*   **Light:** A form of energy; electromagnetic wave that travels at $c = 3 \\times 10^8 \\text{ m/s}$ in a vacuum. Travels in straight lines — called **Rectilinear Propagation**.
*   **Reflection:** Bouncing back of light into the *same* medium after striking a surface. (Distinct from refraction, which is *bending* into a new medium.)
*   **Incident Ray:** The light ray that *hits* the surface.
*   **Reflected Ray:** The light ray that *bounces back* from the surface.
*   **Normal:** A line drawn *perpendicular* to the surface at the point of incidence.
*   **Angle of Incidence ($i$):** Angle between incident ray and the normal.
*   **Angle of Reflection ($r$):** Angle between reflected ray and the normal.

#### 📐 The Two Laws of Reflection (Learn these word-for-word)
1. $\\angle i = \\angle r$ — The angle of incidence is ALWAYS equal to the angle of reflection.
2. The incident ray, reflected ray, and the normal at the point of incidence — all lie in the **same plane**.

> 🔑 **Exam Tip:** These laws apply to BOTH plane mirrors and spherical mirrors.

#### ✅ Properties of Image in a Plane Mirror (Classic 5-mark question)
| Property | Description |
|---|---|
| Nature | Virtual and Erect |
| Size | Same as object (magnification = 1) |
| Distance | Image distance behind mirror = Object distance in front |
| Orientation | Laterally Inverted |

#### ⚠️ Common Mistakes
*   Confusing angle of incidence with the angle the ray makes with the *surface* (always measure from the **normal**, not the surface).
*   Saying reflected image is "behind the mirror" without adding "virtual" — virtual is essential.
*   Lateral inversion ≠ vertical inversion. Only left-right is reversed.

#### 🧪 Quick Numerical Facts
*   Speed of light in vacuum: $c = 3 \\times 10^8 \\text{ m/s}$
*   For full image in plane mirror: minimum mirror height = **half your height** (independent of distance).
*   When mirror rotates by $\\theta$, reflected ray rotates by $2\\theta$.
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
    },

    // ═══════════════════════════════════════════════════
    // ADDITIONAL QUESTIONS — Set 2 (t1q21 to t1q35)
    // Deeper coverage: numericals, real-life, edge cases
    // ═══════════════════════════════════════════════════

    // --- MCQ Set 2 ---
    {
      id: "t1q21",
      type: "mcq",
      question: "A ray of light makes an angle of $30^\\circ$ with the surface of a plane mirror. What is the angle of reflection?",
      options: [
        "$30^\\circ$",
        "$60^\\circ$",
        "$90^\\circ$",
        "$15^\\circ$"
      ],
      correctAnswer: "$60^\\circ$",
      explanation: "The angle with the surface is $30^\\circ$, but the angle of incidence is measured from the NORMAL, not the surface. Since the normal is perpendicular to the surface, $\\angle i = 90^\\circ - 30^\\circ = 60^\\circ$. By the law of reflection, $\\angle r = 60^\\circ$.",
      points: 10
    },
    {
      id: "t1q22",
      type: "mcq",
      question: "How many images are formed when two plane mirrors are placed parallel to each other?",
      options: [
        "1",
        "2",
        "3",
        "Infinite"
      ],
      correctAnswer: "Infinite",
      explanation: "When two mirrors are parallel ($\\theta = 0^\\circ$), the formula for the number of images is $n = (360^\\circ / \\theta) - 1$, which gives infinity. In practice, the number is very large but decreases due to absorption at each reflection.",
      points: 10
    },
    {
      id: "t1q23",
      type: "mcq",
      question: "The angle between the incident ray and the reflected ray is $90^\\circ$. What is the angle of incidence?",
      options: [
        "$30^\\circ$",
        "$45^\\circ$",
        "$60^\\circ$",
        "$90^\\circ$"
      ],
      correctAnswer: "$45^\\circ$",
      explanation: "The angle between the incident ray and reflected ray = $\\angle i + \\angle r = 2 \\times \\angle i$ (since $\\angle i = \\angle r$). If $2\\angle i = 90^\\circ$, then $\\angle i = 45^\\circ$.",
      points: 10
    },
    {
      id: "t1q24",
      type: "mcq",
      question: "Which of the following is NOT a property of the image formed by a plane mirror?",
      options: [
        "Virtual and erect",
        "Same size as object",
        "Laterally inverted",
        "Real and inverted"
      ],
      correctAnswer: "Real and inverted",
      explanation: "A plane mirror always forms a virtual, erect, same-sized, and laterally inverted image. It NEVER forms a real or inverted image. 'Real and inverted' is a property of images formed by concave mirrors for certain object positions.",
      points: 10
    },
    {
      id: "t1q25",
      type: "mcq",
      question: "A person stands 4 m in front of a plane mirror. He walks 1.5 m towards the mirror. How far is the person now from his image?",
      options: [
        "5 m",
        "4 m",
        "2.5 m",
        "5.5 m"
      ],
      correctAnswer: "5 m",
      explanation: "After walking 1.5 m, the person is $(4 - 1.5) = 2.5$ m from the mirror. The image is always 2.5 m behind the mirror. Total distance = $2.5 + 2.5 = 5$ m.",
      points: 10
    },

    // --- Short Answer Set 2 ---
    {
      id: "t1q26",
      type: "short",
      question: "A plane mirror is placed horizontally. An object is placed 25 cm above the mirror. Where is the image formed, and what is the distance between the object and the image?",
      correctAnswer: "The image is formed 25 cm below the mirror (i.e., 25 cm behind the surface). The distance between the object and image = 25 cm (above) + 25 cm (below) = 50 cm.",
      explanation: "Image distance always equals object distance in a plane mirror, regardless of orientation.",
      points: 15
    },
    {
      id: "t1q27",
      type: "short",
      question: "When two mirrors are inclined at $60^\\circ$ to each other, how many images of an object placed between them are formed? Use the formula.",
      correctAnswer: "Number of images = $(360^\\circ / \\theta) - 1 = (360^\\circ / 60^\\circ) - 1 = 6 - 1 = 5$ images.",
      explanation: "The formula $n = (360/\\theta) - 1$ applies when $360/\\theta$ is an even integer. For $\\theta = 60^\\circ$, exactly 5 images are formed.",
      points: 15
    },
    {
      id: "t1q28",
      type: "short",
      question: "Why can you see your reflection in a still pond but not in rough, choppy water?",
      correctAnswer: "A still pond has a smooth surface, so it acts like a plane mirror and causes regular (specular) reflection, forming a clear image. Choppy water has an uneven, rough surface that causes irregular (diffuse) reflection, scattering light in all directions, so no clear image is formed.",
      explanation: "This is a perfect real-life application of the difference between regular and diffuse reflection.",
      points: 15
    },
    {
      id: "t1q29",
      type: "short",
      question: "State the principle of reversibility of light in reflection.",
      correctAnswer: "The principle of reversibility states that if a ray of light is reversed after reflection (i.e., the reflected ray becomes the incident ray), it will retrace its original path exactly. This means the original incident ray becomes the new reflected ray.",
      explanation: "This principle follows directly from the law of reflection: if $\\angle i = \\angle r$ in the forward direction, it holds equally in the reverse direction.",
      points: 15
    },
    {
      id: "t1q30",
      type: "short",
      question: "A mirror makes an angle of $\\theta$ with the horizontal. A ray of light travels horizontally and strikes the mirror. Express the angle of reflection in terms of $\\theta$.",
      correctAnswer: "If the mirror makes angle $\\theta$ with the horizontal, the normal to the mirror makes angle $\\theta$ with the vertical (or $(90^\\circ - \\theta)$ with the horizontal). A horizontal ray makes angle $(90^\\circ - \\theta)$ with the normal. So, angle of incidence = angle of reflection = $(90^\\circ - \\theta)$.",
      explanation: "Drawing the geometry carefully is key here — the normal is always perpendicular to the mirror surface.",
      points: 15
    },

    // --- Long Answer Set 2 ---
    {
      id: "t1q31",
      type: "long",
      question: "Describe, with the help of a ray diagram, how the image of a candle flame is formed in a plane mirror. Explain why the image cannot be caught on a screen.",
      correctAnswer: "Ray Diagram Description:\n1. Two diverging rays from a point on the candle flame travel towards the plane mirror.\n2. Each ray reflects according to the law of reflection ($\\angle i = \\angle r$).\n3. The reflected rays diverge from the mirror and reach the observer's eyes.\n4. When the observer extends the reflected rays backwards (behind the mirror), they appear to meet at a single point. This is the image.\n\nWhy the image cannot be caught on a screen:\nThe reflected rays diverge outward from the mirror — they do not actually converge at any real point in front of the mirror. They only APPEAR to come from a point behind the mirror. Since no actual light rays pass through the image point, no image is formed on a screen placed there. Such an image is called a VIRTUAL image. Only real images (formed by actual convergence of rays) can be caught on a screen.",
      explanation: "Understanding why virtual images cannot be projected is a key conceptual difference from real images.",
      points: 20
    },
    {
      id: "t1q32",
      type: "long",
      question: "Two mirrors $M_1$ and $M_2$ are placed at $90^\\circ$ to each other. A ray of light strikes $M_1$ at an angle of incidence of $50^\\circ$. (a) What is the angle of reflection from $M_1$? (b) Find the angle of incidence on $M_2$. (c) Find the final direction of the reflected ray from $M_2$ with respect to the original incident ray.",
      correctAnswer: "(a) Angle of reflection from $M_1$ = $50^\\circ$ (by law of reflection).\n\n(b) The reflected ray from $M_1$ makes an angle of $(90^\\circ - 50^\\circ) = 40^\\circ$ with $M_1$. Since $M_1$ and $M_2$ are perpendicular, the angle of incidence on $M_2$ = $(90^\\circ - 40^\\circ) = 40^\\circ$.\n\n(c) The angle of reflection from $M_2$ = $40^\\circ$. Geometrically, when two mirrors are at $90^\\circ$, the final reflected ray is always PARALLEL to the original incident ray but travels in exactly the opposite direction. This is the principle of a corner reflector and is used in cat's-eye retroreflectors.",
      explanation: "Two perpendicular mirrors always reflect light back parallel to its incident direction — a beautiful and useful property.",
      points: 20
    },
    {
      id: "t1q33",
      type: "long",
      question: "Explain, with examples, how 'regular reflection' and 'diffuse reflection' differ in terms of surface type, ray behavior, and practical applications. Why do both still obey the laws of reflection?",
      correctAnswer: "Regular (Specular) Reflection:\n• Surface: Smooth, highly polished (mirrors, calm water, polished metal).\n• Ray behavior: All parallel incident rays reflect as parallel rays in ONE specific direction.\n• Result: Forms a clear, sharp image.\n• Example: Seeing your reflection in a mirror.\n\nDiffuse (Irregular) Reflection:\n• Surface: Rough or uneven (walls, paper, fabric, matte objects).\n• Ray behavior: Parallel incident rays reflect in MANY different directions.\n• Result: No image formed, but objects become visible from all angles.\n• Example: A book is readable from any position in a lit room.\n\nWhy both obey laws of reflection:\nAt the microscopic level, even a 'rough' surface consists of countless tiny, locally flat facets. At each tiny facet, the law of reflection ($\\angle i = \\angle r$ measured from the local normal) is perfectly obeyed. Because the orientations of these micro-facets vary randomly, the reflected rays go in different macroscopic directions. The law is not violated — it is applied at every microscopic point.",
      explanation: "This is a common 5-mark question — remember that the laws hold at every single microscopic point even for diffuse reflection.",
      points: 20
    },

    // --- HOTS Set 2 ---
    {
      id: "t1q34",
      type: "thinking",
      question: "A flat mirror is attached to a wall so its reflecting surface is vertical. A person who is exactly 1.8 m tall stands 2 m in front of it. He wants to see his full image. The top of the mirror must be at least at the height of his eyes (1.7 m). Using geometry, find the minimum height the BOTTOM of the mirror must be placed, and hence the minimum mirror length. (Assume eyes are at 1.7 m height.)",
      correctAnswer: "To see the bottom of his feet, light must travel from his feet (height 0 m), reflect from the mirror at some point, and reach his eyes (height 1.7 m).\n\nBy the law of reflection, the mirror point must be exactly halfway between his feet and his eyes vertically:\nMirror bottom = $(0 + 1.7) / 2 = 0.85$ m from the floor.\n\nThe mirror top must be at least halfway between his eyes (1.7 m) and the top of his head (1.8 m):\nMirror top = $(1.7 + 1.8) / 2 = 1.75$ m from the floor.\n\nMinimum mirror length = $1.75 - 0.85 = 0.90$ m = exactly HALF his height of $1.8$ m.\n\nNote: This minimum length is INDEPENDENT of his distance (2 m) from the mirror.",
      explanation: "The classic 'minimum mirror' problem — the answer is always half the person's height, regardless of distance. This is a frequently asked HOTS question.",
      points: 25
    },
    {
      id: "t1q35",
      type: "thinking",
      question: "Light from a source S hits a plane mirror and reflects to point P on the wall. If the mirror is rotated by $15^\\circ$ while keeping S fixed, by what angle will the reflected spot on the wall rotate? If the wall is 3 m from the mirror, calculate approximately how far the spot moves on the wall.",
      correctAnswer: "When the mirror rotates by $15^\\circ$, the normal also rotates by $15^\\circ$. This changes the angle of incidence by $15^\\circ$, making the angle of reflection also change by $15^\\circ$. The total change in direction of the reflected ray = $2 \\times 15^\\circ = 30^\\circ$.\n\nDistance the spot moves on the wall:\nThe reflected ray rotates by $30^\\circ$. If the wall is 3 m from the mirror:\nArc length = $r \\times \\theta$ (in radians) = $3 \\times (30^\\circ \\times \\pi / 180^\\circ) = 3 \\times 0.524 \\approx 1.57$ m.\n\nThis principle (reflected ray rotates twice as fast as the mirror) is used in optical galvanometers to measure small currents.",
      explanation: "The $2\\theta$ rotation rule for mirrors has practical applications in precision measurement instruments.",
      points: 25
    }
  ]
};
