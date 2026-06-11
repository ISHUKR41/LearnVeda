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
    /* ULTRA 2026: Fully interactive reflection laws lab with glow rays + photons */
    "ultra-reflection-lab",       /* ∠i=∠r live · diffuse mode · AMBULANCE lateral inversion */
    /* NEW 2026: Shadow formation — umbra/penumbra/eclipses */
    "shadow-formation-sim",      /* point vs extended source · solar/lunar eclipse modes */
    /* NEW 2026: Additive RGB colour mixing lab */
    "color-mixing-light-sim",    /* three spotlights · R+G+B=White · hex code display */
    /* NEW 2026: Periscope — two plane mirrors at 45° */
    "periscope-sim",             /* animated photon · adjust mirror angle · submarine demo */
    /* NEW 2026: Kaleidoscope — multiple mirror reflections */
    "kaleidoscope-sim",          /* 3–12 mirrors · n-fold symmetry · formula: 360/θ−1 images */
    /* NEW 2026: Pinhole camera — rectilinear propagation proof */
    "pinhole-camera-sim",        /* inverted image · magnification = v/u · adjust hole size */
    /* NEW: Wave nature of light — EM wave animation with c=fλ */
    "wave-nature-light-sim",
    /* Fully draggable live reflection lab */
    "reflection-interactive-sim",
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

![What is Light - Dual Nature](/images/light/topic1-reflection-laws.png)
![Light propagation](/images/light/media__1781201710451.png)

Light is a form of energy that enables us to see the world around us. Although light itself is invisible, it makes objects visible when it bounces off them and enters our eyes.

Light exhibits dual nature: it acts both as a wave (electromagnetic wave) and as a particle (photon). However, for the scope of Class 10, we primarily treat light as a **ray** that travels in a straight line.

**Key Properties of Light:**
1. **Electromagnetic Wave:** Light does not require any material medium to travel. It can travel through a vacuum.
2. **Speed:** The speed of light is maximum in a vacuum, which is $c = 3 \\times 10^8 \\text{ m/s}$.
3. **Rectilinear Propagation:** Light travels in a straight line. This is why shadows are formed when an opaque object blocks the path of light.
4. **Transverse Wave:** Light is a transverse wave, meaning its electric and magnetic fields oscillate perpendicular to the direction of propagation.

---

### Reflection of Light

![Reflection of light](/images/light/light_reflection_nano_banana_1781202845384.png)
![Specular vs diffuse reflection](/images/light/media__1781206235525.png)

When light falls on the surface of an object, some of it bounces back into the same medium. This bouncing back of light rays is called **Reflection of Light**.

Highly polished surfaces, such as mirrors, reflect most of the light falling on them.

#### Types of Reflection
1. **Regular (Specular) Reflection:** Occurs when parallel beams of light fall on a smooth, highly polished surface (like a plane mirror) and are reflected as parallel beams. This type of reflection forms sharp images.
2. **Irregular (Diffuse) Reflection:** Occurs when parallel beams of light fall on a rough surface (like a wall or paper) and are reflected in various different directions. This does not form an image but allows us to see the object from any angle.

---

### Terminology Related to Reflection

![Reflection terminology](/images/light/topic2-spherical-mirrors.png)

Before understanding the laws of reflection, let's define the key terms:
*   **Incident Ray:** The ray of light that falls on the reflecting surface.
*   **Reflected Ray:** The ray of light that bounces back from the reflecting surface.
*   **Point of Incidence:** The point on the surface where the incident ray strikes.
*   **Normal:** A line drawn perpendicular to the reflecting surface at the point of incidence.
*   **Angle of Incidence ($i$):** The angle between the incident ray and the normal.
*   **Angle of Reflection ($r$):** The angle between the reflected ray and the normal.

---

### The Laws of Reflection

![Laws of Reflection](/images/light/light_laws_reflection_1781203058464.png)
![Laws of Reflection 3D](/images/light/media__1781206240893.png)

The reflection of light by any surface (plane or curved) obeys the following two laws of reflection:

**First Law of Reflection:**
> The angle of incidence is always equal to the angle of reflection.
> $$ \\angle i = \\angle r $$

**Second Law of Reflection:**
> The incident ray, the reflected ray, and the normal at the point of incidence, all lie in the same plane.

:::formula 📐 The Golden Rule of Reflection|∠i = ∠r — The angle of incidence ALWAYS equals the angle of reflection. This holds true for ALL surfaces — plane mirrors, concave, and convex.:::

:::warning ⚠️ Common Mistake|Students often measure the angle of incidence from the mirror surface itself. ALWAYS measure from the Normal (the perpendicular line), never from the surface!:::

:::keypoint 🔑 Exam Must-Know|Both laws of reflection apply universally to ALL reflecting surfaces — plane mirrors AND spherical mirrors (concave/convex). No exceptions!:::

---

### Image Formation by a Plane Mirror

![Plane mirror lateral inversion](/images/light/topic10-optical-phenomena.png)

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
*   Images in two mirrors at angle $\\theta$: $n = \\dfrac{360°}{\\theta} - 1$ (when $360°/\\theta$ is a whole number).

---

### 📝 Solved Numericals

**Example 1: Law of Reflection**
**Question:** A ray of light strikes a plane mirror such that the angle between the incident ray and the mirror surface is 35°. What is the angle of reflection?
**Solution:**
1. The angle between the incident ray and the mirror surface = 35°.
2. The normal is perpendicular to the mirror surface (90°).
3. Angle of incidence ($\\angle i$) = 90° - 35° = 55°.
4. According to the first law of reflection, Angle of incidence = Angle of reflection ($\\angle i = \\angle r$).
5. Therefore, the angle of reflection ($\\angle r$) = **55°**.

**Example 2: Distance in a Plane Mirror**
**Question:** An object is placed 15 cm in front of a plane mirror. If the object is moved 5 cm towards the mirror, what will be the distance between the object and its image?
**Solution:**
1. Initial distance of object from mirror = 15 cm.
2. New distance of object from mirror = 15 cm - 5 cm = 10 cm.
3. In a plane mirror, the image is formed at the same distance behind the mirror as the object is in front of it.
4. Image distance = 10 cm behind the mirror.
5. Total distance between object and image = Object distance + Image distance = 10 cm + 10 cm = **20 cm**.

**Example 3: Lateral Inversion**
**Question:** If the word "PHYSICS" is held in front of a plane mirror, which letters will appear unchanged in their reflected image?
**Solution:**
1. Plane mirrors cause lateral inversion (left appears right and vice versa).
2. Letters that have a vertical axis of symmetry remain unchanged.
3. Checking each letter: P (changes), H (unchanged), Y (unchanged), S (changes), I (unchanged), C (changes).
4. Therefore, the letters **H, Y, and I** will appear unchanged.

**Example 4: Rotating Mirror**
**Question:** A light ray is incident on a plane mirror at an angle of 30°. If the mirror is rotated by 10° keeping the incident ray fixed, what is the new angle of reflection?
**Solution:**
1. Initial angle of incidence ($\\angle i$) = 30°.
2. When the mirror rotates by $\\theta$, the normal also rotates by $\\theta$.
3. The new angle of incidence becomes $\\angle i' = 30^\\circ + 10^\\circ = 40^\\circ$.
4. By the law of reflection, the new angle of reflection $\\angle r'$ = **40°**.

---

### Real-life Applications of Reflection

#### 🔦 Regular (Specular) Reflection in Everyday Life

*   **Periscopes in Submarines:** Two plane mirrors (or 45°-90°-45° prisms) at 45° to the horizontal redirect light around corners. Allows operators to see above water while the submarine is submerged. Prism periscopes use TIR for 100% reflection efficiency vs silver mirrors (~95%).
*   **Kaleidoscopes:** Three plane mirrors at 60° to each other form $360°/60° - 1 = 5$ images plus the object = 6-fold symmetry. Rotating the mirrors creates mesmerising patterns used in art, architecture, and entertainment.
*   **Solar Cookers:** A large concave mirror (or a plane mirror array angled to collect sunlight) focuses parallel solar rays. Box-type solar cookers using plane reflector panels can reach 120–140°C — enough to cook rice, pulses, and vegetables with zero fuel cost.
*   **Searchlights and Torches:** The light bulb is placed at the principal focus of a concave parabolic reflector. Rays from focus reflect parallel to the axis → concentrated parallel beam that travels long distances without spreading.

#### 🌧️ Diffuse (Irregular) Reflection in Everyday Life

*   **Reading a Book:** Paper has microscopic rough fibres that scatter light in all directions (diffuse). This means you can read from any angle without glare — contrast with a shiny mirror, which would show a blinding hotspot.
*   **Cinema/Projector Screens:** Made of fine-grain matt white material. Regular (specular) screens would create a bright hot-spot only in one direction; diffuse screens distribute light evenly to all seats.
*   **Road Visibility:** Road surface paint uses diffuse reflection to be visible from all angles. Cats-eye road studs (glass bead retroreflectors) return headlight beams directly to the driver's eyes using two curved mirror faces — very small critical angle geometry.
*   **Photography Lighting:** Photographers bounce flash off white ceilings/walls to convert specular harsh light into soft diffuse illumination, eliminating harsh shadows.

#### 🏥 Medical & Scientific Applications

*   **Dental/ENT Mirrors:** A small concave mirror held inside the focal length gives a magnified, virtual, erect image of teeth or the tympanic membrane. The same principle applies to the ophthalmoscope (examining the retina).
*   **Hubble Space Telescope:** Uses a 2.4 m diameter concave parabolic primary mirror. Mirrors are preferred over lenses for large telescopes because: (a) no chromatic aberration, (b) can be supported from behind (lenses sag under gravity at large diameters), (c) can be ground to extremely precise parabolic shapes.
*   **Solar Furnaces:** The Odeillo Solar Furnace (France) uses 63 flat sun-tracking mirrors directing light to one large 1830 m² parabolic concave mirror, achieving temperatures over 3500°C — used for testing materials that must survive extreme heat (spacecraft re-entry tiles, nuclear reactor components).
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
    },

    /* ── Additional Questions Set 3 (t1q36 to t1q50) ── */

    /* MCQ Set 3 */
    {
      id: "t1q36",
      type: "mcq",
      question: "A periscope uses two plane mirrors placed parallel to each other at an angle of 45° to the tube. If an observer sees a ship 3 km away, the image formed is:",
      options: [
        "Real, inverted, magnified",
        "Virtual, erect, same size",
        "Real, erect, diminished",
        "Virtual, inverted, same size"
      ],
      correctAnswer: "Virtual, erect, same size",
      explanation: "Each plane mirror produces a virtual, erect, same-size image. The periscope has two plane mirrors at 45°, so there are two reflections total. Each reflection inverts once; two reflections cancel out — the final image is virtual, erect (same orientation as object), and same size. This is why periscopes don't flip the view.",
      points: 10
    },
    {
      id: "t1q37",
      type: "mcq",
      question: "The angle between the incident ray and the reflected ray is 70°. The angle of incidence is:",
      options: ["70°", "35°", "140°", "20°"],
      correctAnswer: "35°",
      explanation: "The angle between the incident ray and reflected ray = 2 × angle of incidence (since angle of incidence = angle of reflection, and the incident and reflected rays are symmetrical about the normal). So: 2 × angle of incidence = 70° → angle of incidence = 35°. Note: This is NOT the angle between the ray and the mirror surface — the question asks for the angle of incidence (measured from the normal).",
      points: 10
    },
    {
      id: "t1q38",
      type: "mcq",
      question: "A ray of light strikes a plane mirror at 90° (i.e., along the normal). After reflection, the ray will:",
      options: [
        "Reflect at 90° to the original direction",
        "Retrace its original path (reflect back along itself)",
        "Reflect at 45° to the mirror surface",
        "Absorb into the mirror"
      ],
      correctAnswer: "Retrace its original path (reflect back along itself)",
      explanation: "If the angle of incidence = 0° (ray hits mirror along its normal — perpendicularly), then by the law of reflection, angle of reflection = 0°. The reflected ray goes back exactly the way it came. This is called normal incidence, and the ray retraces its own path. This principle is used in reflectors and laser cavities.",
      points: 10
    },
    {
      id: "t1q39",
      type: "mcq",
      question: "How many images are formed when two plane mirrors are placed at 60° to each other?",
      options: ["2", "3", "5", "6"],
      correctAnswer: "5",
      explanation: "Number of images = (360°/θ) − 1 = (360°/60°) − 1 = 6 − 1 = 5. This formula applies when 360°/θ is a whole number. At 60°, you get 5 images arranged symmetrically. This is the principle behind a kaleidoscope — with two mirrors at 60°, an object creates a beautiful 6-fold symmetric pattern (5 images + 1 object).",
      points: 10
    },
    {
      id: "t1q40",
      type: "mcq",
      question: "Which of the following is an example of regular (specular) reflection?",
      options: [
        "A book page reflecting light to your eyes",
        "A white wall illuminating a room",
        "Your reflection in a still lake",
        "Fog making car headlights visible from the side"
      ],
      correctAnswer: "Your reflection in a still lake",
      explanation: "A still lake has an extremely smooth water surface — parallel incident light rays reflect as parallel rays in one direction, forming a clear image (regular reflection). A book page, white wall, and fog all involve rough/irregular surfaces or particles that scatter light in all directions (diffuse reflection). Still water vs rippled water is a good test: smooth → regular, rippled → diffuse.",
      points: 10
    },

    /* Short Answer Set 3 */
    {
      id: "t1q41",
      type: "short",
      question: "A person stands 1.5 m in front of a plane mirror. How far is the image from the person? If the person walks 0.5 m towards the mirror, what is the new distance between the person and their image?",
      options: [],
      correctAnswer: "Initial situation:\nImage in plane mirror forms behind mirror at same distance = 1.5 m.\nDistance from person to image = 1.5 m (person in front) + 1.5 m (image behind) = 3.0 m.\n\nAfter walking 0.5 m closer:\nNew distance from mirror = 1.5 − 0.5 = 1.0 m.\nImage is now 1.0 m behind mirror.\nNew person-to-image distance = 1.0 + 1.0 = 2.0 m.\n\nWhen the person moved 0.5 m closer to the mirror, the image moved 0.5 m closer to the mirror from the other side. Total gap reduced by 1.0 m (0.5 m from person + 0.5 m from image).",
      explanation: "This is a standard problem. Key insight: both person and image move toward the mirror simultaneously — the total distance decreases twice as fast as the individual approach speed.",
      points: 15
    },
    {
      id: "t1q42",
      type: "short",
      question: "State the two laws of reflection. Which law tells you the direction of the reflected ray, and which tells you the magnitude of the angles?",
      options: [],
      correctAnswer: "Laws of Reflection:\n\n1. First Law: The incident ray, the reflected ray, and the normal to the reflecting surface at the point of incidence — all three lie in the same plane.\n→ This law tells you the DIRECTION — the reflected ray stays in the same geometric plane as the incident ray. It cannot jump out of the plane.\n\n2. Second Law: The angle of incidence (i) equals the angle of reflection (r). [∠i = ∠r]\n→ This law gives the MAGNITUDE — the angular measure of reflection equals the angular measure of incidence.\n\nBoth angles are always measured from the NORMAL (not from the mirror surface).",
      explanation: "The two laws work together: the first constrains the plane, the second constrains the angle. Both are needed to completely determine the reflected ray's path.",
      points: 15
    },
    {
      id: "t1q43",
      type: "short",
      question: "What are the four main characteristics of the image formed by a plane mirror? State each property briefly.",
      options: [],
      correctAnswer: "Four Characteristics of Plane Mirror Image:\n\n1. Virtual: The image is formed behind the mirror where no actual light rays converge. It cannot be projected on a screen.\n\n2. Erect (Upright): The image is right-side up — same orientation as the object vertically.\n\n3. Same size: The image has the same height and width as the object (magnification = +1).\n\n4. Laterally inverted: The image is left-right reversed. Your right hand appears as your left hand in the mirror. (Also known as 'mirror image' or 'lateral inversion').\n\nBonus property: Image distance = Object distance (image is as far behind mirror as object is in front).",
      explanation: "Lateral inversion is one of the most interesting and frequently confused properties of plane mirrors. Vertical is preserved, horizontal is reversed — not up-down.",
      points: 15
    },
    {
      id: "t1q44",
      type: "short",
      question: "What is lateral inversion? Explain with the example of a word written on a plane mirror.",
      options: [],
      correctAnswer: "Lateral Inversion: The apparent reversal of left and right (not up and down) in the image formed by a plane mirror. The right side of the object appears as the left side of the image, and vice versa.\n\nExample — Word in mirror:\nWhen you write 'AMBULANCE' on a vehicle, the plane mirror image reads it correctly when drivers see it in their rear-view mirror. The original word is deliberately written in mirror script (laterally inverted) so that when reflected, it reads normally.\n\nAnother example: Hold up the word 'MOM' in front of a mirror. The letters M and M look similar, but 'O' stays recognizable. Now hold up 'BOOK' — it appears as 'XOOD' (approximately), showing clear left-right flip.\n\nKey point: Lateral inversion flips LEFT ↔ RIGHT only. TOP ↔ BOTTOM is NOT inverted in a vertical plane mirror.",
      explanation: "Lateral inversion is why writing on ambulances is in mirror script. The concept of which axis is inverted (left-right, not up-down) is a common source of confusion and exam questions.",
      points: 15
    },
    {
      id: "t1q45",
      type: "short",
      question: "Calculate the number of images formed when two plane mirrors are placed (a) at 90°, (b) at 72°, (c) at 45° to each other.",
      options: [],
      correctAnswer: "Formula: Number of images = (360°/θ) − 1 (when 360°/θ is an integer)\n\n(a) θ = 90°: n = (360/90) − 1 = 4 − 1 = 3 images.\n\n(b) θ = 72°: n = (360/72) − 1 = 5 − 1 = 4 images.\n\n(c) θ = 45°: n = (360/45) − 1 = 8 − 1 = 7 images.\n\nPattern: As the angle between mirrors decreases, the number of images increases. At 0° (parallel mirrors), theoretically infinite images form (but they get dimmer with each reflection). This is used in dressing rooms and infinite mirror installations.",
      explanation: "This formula is important for board exams. Always check that 360/θ is a whole number for the formula to apply cleanly. If 360/θ is not an integer, the calculation is more complex.",
      points: 15
    },

    /* Long Answer Set 3 */
    {
      id: "t1q46",
      type: "long",
      question: "Light is incident on a plane mirror at an angle of incidence of 40°. The mirror is then rotated by 20° (while the incident ray remains fixed). By how much does the reflected ray rotate? Derive the principle and apply it.",
      options: [],
      correctAnswer: "Principle: Law of Mirror Rotation\nWhen a plane mirror is rotated by an angle θ (while the incident ray is fixed), the reflected ray rotates by 2θ in the same direction.\n\nDerivation:\nInitial state:\n• Angle of incidence = 40°.\n• Angle of reflection = 40°.\n• The reflected ray makes 40° with the normal (= 50° with mirror surface).\n\nAfter mirror rotates 20°:\n• The normal rotates 20° (normal is always perpendicular to mirror).\n• New angle of incidence = 40° − 20° = 20° (since the incident ray is fixed but normal rotated).\n\nWait — more carefully:\nIf the incident ray is fixed and mirror rotates by α = 20°, the angle of incidence changes by 20°.\nNew angle of incidence = 40° − 20° = 20° (if rotating toward the ray).\nNew angle of reflection = 20°.\nThe reflected ray is now at 20° on the other side of new normal.\n\nChange in reflected ray angle from initial position:\nOriginal reflected ray: 40° on right of original normal.\nNew reflected ray: 20° on right of new normal (which is 20° from old).\nTotal shift of reflected ray = 20° + 20° = 40° = 2 × 20° = 2α.\n\nResult: Reflected ray rotates by 2 × 20° = 40°.\n\nApplication: Used in galvanometers and spectrometers to measure tiny angle changes with doubled sensitivity.",
      explanation: "The 2θ law is a fundamental property of mirror rotation. Galvanometers use this to convert tiny current-induced coil rotations into large deflections of a light spot.",
      points: 20
    },
    {
      id: "t1q47",
      type: "long",
      question: "Explain the concept of 'echo' and 'reverberation' in sound and draw a parallel with light reflection. How does architectural design use knowledge of reflection (of both light and sound) in concert halls?",
      options: [],
      correctAnswer: "Reflection Parallels — Light and Sound:\n\nSound Reflection:\n• Echo: Reflected sound heard distinctly after a delay (sound must travel at least 34 m round trip — 17 m to reflector and back — for the echo to be perceptible separately from original).\n• Reverberation: Multiple reflections in an enclosed space cause sound to persist. Good reverberation: 1-2 seconds for music. Too much reverberation makes speech unintelligible.\n\nLight Reflection:\n• Multiple reflections in a room from walls, ceiling, floor create ambient light (indirect illumination).\n• Specular surfaces (mirrors) create visible reflections; diffuse surfaces (walls) create even ambient light.\n\nArchitectural Design Parallels:\n\nConcert Hall Design:\n1. Sound: Walls are curved (concave sections) at specific points to focus reflected sound towards audience seating — same principle as concave mirror focusing light. Curved ceiling panels reflect and distribute sound evenly.\n2. Sound: Absorptive materials (fabric seats, carpets) prevent excessive reverberation that muddles music — analogous to black (non-reflective) surfaces in optics.\n3. Light: Skylights and reflective panels direct natural light without glare — using reflection and diffusion principles from optics.\n4. Both: The architect considers the 'ray' paths of both sound and light to achieve clarity (sharp focus) without overwhelming reverberation/glare.",
      explanation: "This cross-disciplinary answer demonstrates that reflection laws are universal — applying to light, sound, water waves. Architects and acoustic engineers routinely apply these principles.",
      points: 20
    },

    /* HOTS Set 3 */
    {
      id: "t1q48",
      type: "thinking",
      question: "A plane mirror is fixed on the ceiling of a room, horizontal. A person stands directly below it and looks up. (a) What does the person see in the mirror? (b) A ball is thrown vertically upward at 5 m/s. Describe the motion of the ball's image in the ceiling mirror. (c) At what speed does the image approach the mirror just before the ball reaches its highest point?",
      options: [],
      correctAnswer: "(a) What the person sees:\nLooking up at a horizontal ceiling mirror, the person sees an image of themselves (and the entire room) directly below the mirror — but the image is inverted top-to-bottom (head at bottom, feet at top as seen from below). The horizontal mirror flips vertical orientation instead of horizontal.\n\nNote: A horizontal mirror on the ceiling inverts UP-DOWN rather than LEFT-RIGHT. This is because 'up-down' is now the axis perpendicular to the mirror surface.\n\n(b) Ball's image motion:\nFor a horizontal ceiling mirror:\n• As the ball rises at 5 m/s, the image (behind the mirror — above the ceiling) descends at 5 m/s towards the mirror surface (from the other side).\n• Both ball and image approach the mirror at the same speed.\n• The distance from ball to mirror decreases; image distance behind mirror = real distance in front → image also rises toward the mirror (from behind).\n• Ball and image approach each other at 5 + 5 = 10 m/s relative to each other.\n\n(c) Speed just before highest point:\nJust before the ball reaches its highest point, its velocity → 0 (decelerating under gravity). So the ball's image also slows to 0 m/s simultaneously — both ball and image stop momentarily at the closest point (ball's maximum height). Then both fall/rise together in reverse.",
      explanation: "Ceiling mirrors are a delightful twist on standard mirror problems. The key insight is that the mirror normal is now vertical — so up-down is what gets inverted, not left-right.",
      points: 25
    },
    {
      id: "t1q49",
      type: "thinking",
      question: "Light takes approximately 8 minutes 20 seconds to travel from the Sun to Earth. A giant plane mirror the size of a planet is placed at the midpoint between Sun and Earth. (a) If you look in this mirror from Earth, what would you see and how old would the image be? (b) What does this tell us about the nature of mirrors and time?",
      options: [],
      correctAnswer: "(a) What you see and the age of the image:\nSun-to-Earth distance = 8 min 20 s × speed of light = 8.33 minutes × c.\nMirror is at the midpoint = 4.17 minutes from Earth.\n\nLight from the Sun travels: 4.17 min to mirror, reflects, then 4.17 min back to Earth.\nTotal travel time = 8.33 minutes + 8.33 minutes = 16 min 40 sec from sun to mirror to Earth.\n\nBut the actual Sun → Earth direct light takes 8.33 minutes.\n\nSo looking in the mirror, you see the Sun as it was 16 min 40 sec ago (8.33 min for light to reach mirror + 8.33 min to return to you).\nYou'd see the Sun's image that is 8 min 20 seconds OLDER than the direct view of the Sun.\n\n(b) What this tells us:\nMirrors don't show 'the present' — they show the past. The image is always from the moment light LEFT the object, not the moment you see it. For nearby objects (fraction of a millimetre from the mirror), the delay is unmeasurably small (~10⁻¹² seconds). But for cosmic distances, mirrors reveal the ancient past.\n\nPhilosophically: you never see 'real-time' reflections — only historical ones. The universe you see (in mirrors or directly) is always a reconstruction of the past based on light that was emitted before it reached your eyes.",
      explanation: "This question reveals the deep connection between the finite speed of light and perception. All vision is time-delayed — mirrors just make this explicit when distances are large.",
      points: 25
    },
    {
      id: "t1q50",
      type: "thinking",
      question: "A laser beam hits a plane mirror at angle of incidence 30°. The laser then hits a second plane mirror. The two mirrors are arranged so the final beam exits parallel to the original beam but 20 cm shifted sideways. Design the geometry: (a) What angle does the second mirror make with the first? (b) Verify that the exit beam is indeed parallel to the entry beam.",
      options: [],
      correctAnswer: "(a) Geometry Design:\nFor the exit beam to be parallel to the entry beam with a lateral shift:\n\nThe two-mirror system must be configured as a retroreflector-style geometry.\n\nLet first mirror be horizontal. Laser hits at angle of incidence i₁ = 30°.\nReflected ray from mirror 1 makes 60° with the mirror surface (30° from normal = 60° from surface).\n\nFor exit beam parallel to entry:\nThe second mirror must be perpendicular to the first mirror's reflected ray such that after reflection from mirror 2, the exit ray is parallel to the original.\n\nIf the angle between the two mirrors is φ:\nBy geometry, for exit beam to be antiparallel (parallel but opposite direction) to entry:\nφ = 90°. This gives the retroreflector (light returns exactly backward).\n\nFor exit beam to be PARALLEL (same direction, laterally shifted):\nThis requires more thought. Two reflections each rotate the beam. For zero total angular change:\nEach mirror must turn the beam by opposite equal amounts.\n\nFor i₁ = 30° on mirror 1:\nAfter reflection: beam deflects by 2×30° = 60° from original direction.\nSecond mirror must deflect by 60° back → mirror 2 is tilted at 60° to horizontal (or 30° to the reflected beam from mirror 1).\n\nThe two mirrors form a V-shape with the opening angle = 180° − 60° = 120° between their surfaces.\n\n(b) Verification:\nEntry beam angle to horizontal: say 30° below. Mirror 1 reflects it 30° above horizontal (total rotation 60°). Mirror 2 (tilted at 60° from horizontal) presents a normal at 30° from the incoming ray. Reflects it 30° back → exits parallel to original entry direction ✓.\nThe 20 cm lateral shift is determined by the distance between the two mirror surfaces.",
      explanation: "Multi-mirror systems that preserve beam direction with lateral shifts are used in optical instruments like interferometers and retroreflectors. The geometry follows directly from repeated application of the law of reflection.",
      points: 25
    }
  ],

  /* ══════════════════════════════════════════════════════
   * WORKED EXAMPLES — 5 step-by-step numericals
   * Each follows: Given → Find → Steps → Answer → Real-life
   * ══════════════════════════════════════════════════════ */
  workedExamples: [
    {
      id: "ex1-t1",
      title: "Angle of Reflection Calculation",
      difficulty: "easy",
      topic: "Laws of Reflection",
      given: ["Angle between incident ray and mirror surface = 30°"],
      find: ["Angle of incidence (∠i)", "Angle of reflection (∠r)"],
      steps: [
        {
          step: 1,
          title: "Understand the given angle",
          work: "The angle between the ray and the SURFACE of the mirror is 30°. This is called the glancing angle.",
          note: "⚠️ The angle of incidence is ALWAYS measured from the Normal, NOT from the surface!",
        },
        {
          step: 2,
          title: "Find the angle of incidence",
          work: "Since the Normal is perpendicular (90°) to the mirror surface:\n∠i = 90° − Glancing angle\n∠i = 90° − 30° = 60°",
        },
        {
          step: 3,
          title: "Apply the First Law of Reflection",
          work: "By the First Law of Reflection: ∠i = ∠r\n∴ ∠r = 60°",
        },
      ],
      answer: "Angle of incidence = Angle of reflection = 60°",
      realLifeConnect: "This exact geometry is used in laser rangefinders — the reflected laser beam angle must be calculated precisely to measure distances to distant objects.",
    },
    {
      id: "ex2-t1",
      title: "Object-Image Distance in Plane Mirror",
      difficulty: "easy",
      topic: "Plane Mirror Image Properties",
      given: [
        "Object distance from mirror (u) = 15 cm",
        "Object height (h) = 4 cm",
      ],
      find: [
        "Image distance from mirror (v)",
        "Height of image (h')",
        "Total object-to-image distance",
      ],
      steps: [
        {
          step: 1,
          title: "Apply the equal-distance property",
          work: "For a plane mirror: Image distance = Object distance\nv = u = 15 cm (behind the mirror)",
          note: "The image is always formed as far BEHIND the mirror as the object is in FRONT of it.",
        },
        {
          step: 2,
          title: "Find image height using magnification",
          work: "For a plane mirror, magnification m = 1 (always)\nSince m = h'/h → h' = m × h = 1 × 4 = 4 cm",
        },
        {
          step: 3,
          title: "Calculate total object-to-image distance",
          work: "Total distance = Object distance + Image distance\n= 15 cm + 15 cm = 30 cm",
          note: "The object is in FRONT of the mirror and the image is BEHIND it — they are on opposite sides.",
        },
      ],
      answer: "Image is 15 cm behind the mirror, height = 4 cm, total object-to-image distance = 30 cm",
      realLifeConnect: "Tailors use this property — if you stand 1.5 m from a fitting mirror, your image is 1.5 m behind the mirror (3 m total separation), showing the full outfit with correct proportions.",
    },
    {
      id: "ex3-t1",
      title: "Number of Images Between Two Mirrors",
      difficulty: "medium",
      topic: "Multiple Mirror Reflections",
      given: ["Angle between two plane mirrors (θ) = 60°"],
      find: ["Number of images formed (n)"],
      steps: [
        {
          step: 1,
          title: "Check the condition for the formula",
          work: "Formula: n = (360° / θ) − 1\nThis formula applies when 360°/θ is an even integer.\n360° / 60° = 6 (even integer ✓ — formula applies)",
        },
        {
          step: 2,
          title: "Apply the formula",
          work: "n = (360° / θ) − 1\nn = (360° / 60°) − 1\nn = 6 − 1 = 5",
        },
        {
          step: 3,
          title: "Verify with a different angle",
          work: "At θ = 90°: n = (360/90) − 1 = 4 − 1 = 3 images ✓ (classic result)\nAt θ = 45°: n = (360/45) − 1 = 8 − 1 = 7 images\nAt θ = 120°: n = (360/120) − 1 = 3 − 1 = 2 images",
          note: "As θ decreases toward 0° (parallel mirrors), n approaches ∞.",
        },
      ],
      answer: "5 images are formed when two mirrors are placed at 60° to each other",
      realLifeConnect: "A kaleidoscope uses 3 mirrors at 60° to each other, creating 5 images of the coloured beads — forming the beautiful 6-fold symmetrical pattern.",
    },
    {
      id: "ex4-t1",
      title: "Minimum Mirror Length for Full Body Image",
      difficulty: "medium",
      topic: "Plane Mirror — Minimum Mirror Size",
      given: ["Height of person (H) = 1.6 m", "Eye level from floor = 1.5 m"],
      find: ["Minimum length of mirror required to see full body"],
      steps: [
        {
          step: 1,
          title: "Establish the geometry",
          work: "To see the top of the head (0.1 m above eyes), the ray from the top of the head must reflect to the eyes.\nThe mirror point needed = midpoint between top of head and eyes = (0 + 0.1)/2 = 0.05 m above eye level.",
          note: "The mirror point is always at the MIDPOINT between the object point and the eye.",
        },
        {
          step: 2,
          title: "Find the mirror point for feet",
          work: "Eye level = 1.5 m from floor. Feet = 0 m from floor.\nMirror point for feet = midpoint between eyes and feet = (1.5 + 0)/2 = 0.75 m from floor",
        },
        {
          step: 3,
          title: "Calculate mirror length",
          work: "Top of mirror = 1.5 m + 0.05 m = 1.55 m from floor\nBottom of mirror = 0.75 m from floor\nMinimum mirror length = 1.55 − 0.75 = 0.80 m = H/2",
          note: "Minimum length = H/2 = 1.6/2 = 0.8 m. This result is INDEPENDENT of the person's distance from the mirror!",
        },
      ],
      answer: "Minimum mirror length = 0.8 m (exactly half the person's height of 1.6 m)",
      realLifeConnect: "Fashion boutiques install mirrors exactly half the customer's average height (80 cm) to ensure full-body views while saving wall space and mirror cost.",
    },
    {
      id: "ex5-t1",
      title: "Mirror Rotation — Reflected Ray Angle",
      difficulty: "hard",
      topic: "Mirror Rotation Theorem (2θ Rule)",
      given: [
        "Initial angle of incidence = 40°",
        "Mirror is rotated by θ = 20° (incident ray stays fixed)",
      ],
      find: ["New angle of reflection", "Total rotation of reflected ray"],
      steps: [
        {
          step: 1,
          title: "State the Mirror Rotation Theorem",
          work: "When a mirror rotates by angle θ (while the incident ray is fixed), the reflected ray rotates by 2θ.",
          note: "This is because rotating the mirror by θ rotates the Normal by θ, changing both ∠i and ∠r by θ — total effect on reflected ray = 2θ.",
        },
        {
          step: 2,
          title: "Calculate initial and final angles",
          work: "Initial: ∠i = 40°, ∠r = 40°\nAfter mirror rotates 20°:\nNew ∠i = 40° − 20° = 20° (Normal moves toward the ray)\nNew ∠r = 20° (by law of reflection)",
        },
        {
          step: 3,
          title: "Find total rotation of reflected ray",
          work: "Original reflected ray: 40° from the (original) normal\nNew reflected ray: 20° from the new normal (which is 20° from the old)\nTotal rotation of reflected ray = 20° + 20° = 40° = 2 × θ = 2 × 20° ✓",
        },
      ],
      answer: "Reflected ray rotates by 40° (= 2 × 20°). This confirms the 2θ theorem.",
      realLifeConnect: "Galvanometers (current-measuring instruments) use this principle: a tiny coil rotates by angle θ when current flows, rotating a mirror which deflects a light beam by 2θ — doubling the sensitivity of the instrument.",
    },
  ],
};
