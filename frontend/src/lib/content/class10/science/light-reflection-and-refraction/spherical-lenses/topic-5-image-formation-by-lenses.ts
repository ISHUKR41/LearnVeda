/**
 * FILE: topic-5-image-formation-by-lenses.ts
 * LOCATION: src/lib/content/class10/science/light-reflection-and-refraction/spherical-lenses/topic-5-image-formation-by-lenses.ts
 * PURPOSE: Detailed study of Spherical Lenses (Convex and Concave) and their image formation rules.
 * LAST UPDATED: 2026-06-08
 */

import { Topic } from "../../shared-types";

export const topic5ImageFormationByLenses: Topic = {
  id: "image-formation-by-lenses",
  title: "5. Spherical Lenses and Image Formation",
  estimatedMinutes: 60,
  simulationIds: [
    "light-convex-lens",
    "light-concave-lens",
    "light-lens-positions",
    "light-lens-compare",
    "light-lens-ray-tracer",
    "adv-convex-lens",
  ],
  imageUrl: "/images/light/topic5-spherical-lenses.png",
  content: `
### What is a Spherical Lens?

A transparent material bound by two surfaces, of which one or both surfaces are spherical, forms a lens.

1.  **Convex Lens (Double Convex):** A lens that is thicker at the middle and thinner at the edges. It converges light rays falling on it. Therefore, it is also called a **converging lens**.
2.  **Concave Lens (Double Concave):** A lens that is thicker at the edges and thinner at the middle. It diverges light rays falling on it. Therefore, it is also called a **diverging lens**.

---

### Key Terminology for Lenses

Because a lens has two spherical surfaces, it has two centers of curvature and two principal foci.

*   **Center of Curvature ($C_1$ and $C_2$):** The centers of the two spheres of which the lens surfaces are a part.
*   **Principal Axis:** An imaginary straight line passing through the two centers of curvature.
*   **Optical Center ($O$):** The central point of a lens. A ray of light passing through the optical center goes straight without suffering any deviation.
*   **Principal Focus ($F_1$ and $F_2$):**
    *   *Convex Lens:* When parallel rays of light fall on a convex lens, they converge at a point on the principal axis on the other side. This point is the principal focus.
    *   *Concave Lens:* When parallel rays fall on a concave lens, they diverge. When produced backwards, they appear to meet at a point on the principal axis on the same side. This point is its principal focus.
*   **Focal Length ($f$):** The distance between the optical center ($O$) and the principal focus ($F$).

*Note:* For drawing ray diagrams, we often mark $2F_1$ and $2F_2$ on the principal axis, which correspond to the centers of curvature ($C_1$ and $C_2$).

---

### Rules for Drawing Ray Diagrams for Lenses

To locate the image formed by lenses, we use the following standard incident rays:

1.  **Ray parallel to the principal axis:**
    *   *Convex Lens:* Passes through the principal focus ($F_2$) on the other side after refraction.
    *   *Concave Lens:* Appears to diverge from the principal focus ($F_1$) located on the same side.
2.  **Ray passing through the principal focus:**
    *   *Convex Lens:* A ray passing through $F_1$ becomes parallel to the principal axis after refraction.
    *   *Concave Lens:* A ray appearing to meet at $F_2$ becomes parallel to the principal axis after refraction.
3.  **Ray passing through the Optical Center ($O$):** Passes through the lens without any deviation.

---

### Image Formation by a Convex Lens

A convex lens can form both real and virtual images, similar to a concave mirror.

| Position of Object | Position of Image | Size of Image | Nature of Image |
| :--- | :--- | :--- | :--- |
| **At Infinity** | At $F_2$ | Highly diminished, point-sized | Real and inverted |
| **Beyond $2F_1$** | Between $F_2$ and $2F_2$ | Diminished | Real and inverted |
| **At $2F_1$** | At $2F_2$ | Same size | Real and inverted |
| **Between $F_1$ and $2F_1$** | Beyond $2F_2$ | Enlarged | Real and inverted |
| **At $F_1$** | At Infinity | Highly enlarged | Real and inverted |
| **Between $O$ and $F_1$** | On the same side as object | Enlarged | **Virtual and erect** |

*Application:* Convex lenses are used in magnifying glasses, microscopes, telescopes, and to correct hypermetropia (far-sightedness).

---

### Image Formation by a Concave Lens

A concave lens **always** forms a virtual, erect, and diminished image, regardless of the position of the object.

| Position of Object | Position of Image | Size of Image | Nature of Image |
| :--- | :--- | :--- | :--- |
| **At Infinity** | At $F_1$ | Highly diminished, point-sized | Virtual and erect |
| **Between Infinity and Optical Center ($O$)** | Between $F_1$ and $O$ | Diminished | Virtual and erect |

*Application:* Concave lenses are used in peepholes of doors and to correct myopia (near-sightedness).

---
### Exam Summary

#### 📌 Key Terminology for Lenses
*   **Optical Center ($O$):** The central point of the lens. A ray passing through $O$ passes undeviated.
*   **Principal Foci:** A lens has **two** focal points ($F_1$ and $F_2$), one on each side.
*   **Focal Length ($f$):** Distance from optical center to principal focus.
*   **Convex Lens:** Thicker at center. **Converging** — bends rays inward.
*   **Concave Lens:** Thinner at center. **Diverging** — bends rays outward.

#### 🔍 Convex Lens: Image Formation Table (must-memorize for 5-mark)
| Object Position | Image Position | Nature | Size |
|---|---|---|---|
| At infinity | At $F_2$ | Real, Inverted | Point-sized |
| Beyond $2F_1$ | Between $F_2$ and $2F_2$ | Real, Inverted | Diminished |
| At $2F_1$ | At $2F_2$ | Real, Inverted | Same size |
| Between $F_1$ and $2F_1$ | Beyond $2F_2$ | Real, Inverted | Enlarged |
| At $F_1$ | At infinity | Real, Inverted | Highly enlarged |
| Between $O$ and $F_1$ | Same side as object | **Virtual, Erect** | Enlarged |

> 🔑 **Concave Lens** ALWAYS gives Virtual, Erect, Diminished (VED) images — just like a Convex Mirror!

#### 🔄 Mirror–Lens Comparison (HOTS question favorite)
| Mirror | Equivalent Lens |
|---|---|
| Concave Mirror | Convex Lens (both converge, both can form real images) |
| Convex Mirror | Concave Lens (both diverge, both ALWAYS give VED images) |

#### 🧪 Three Ray Rules for Lenses
1. Ray parallel to principal axis → refracts through $F_2$ (convex) or appears to come from $F_1$ (concave).
2. Ray through optical center ($O$) → passes straight through without bending.
3. Ray through $F_1$ → emerges parallel to principal axis (convex only).

#### ⚠️ Common Mistakes
*   Labeling the focal point: convex lens has $F_2$ on the transmission side; do NOT mix this up with the mirror's focal point.
*   Forgetting that a convex lens acting as a magnifying glass requires the object to be **between $O$ and $F_1$**.
*   Confusing "real image" (formed on the other side of the lens — can be projected on screen) with "virtual image" (same side as object — cannot be projected).
`,
  questions: [
    // --- MCQ ---
    {
      id: "t5q1",
      type: "mcq",
      question: "Which type of lens always produces a virtual, erect, and diminished image?",
      options: [
        "Convex lens",
        "Concave lens",
        "Plano-convex lens",
        "Bifocal lens"
      ],
      correctAnswer: "Concave lens",
      explanation: "A concave (diverging) lens always forms a virtual, erect, and diminished image regardless of object position.",
      points: 10
    },
    {
      id: "t5q2",
      type: "mcq",
      question: "For a convex lens, if the object is placed at $2F_1$, where will the image be formed?",
      options: [
        "At $F_2$",
        "Beyond $2F_2$",
        "At $2F_2$",
        "Between $F_2$ and $2F_2$"
      ],
      correctAnswer: "At $2F_2$",
      explanation: "When an object is at $2F_1$ (center of curvature equivalent), a real, inverted image of the same size is formed at $2F_2$ on the other side.",
      points: 10
    },
    {
      id: "t5q3",
      type: "mcq",
      question: "A simple magnifying glass consists of a:",
      options: [
        "Concave mirror",
        "Convex mirror",
        "Concave lens",
        "Convex lens"
      ],
      correctAnswer: "Convex lens",
      explanation: "A convex lens is used as a magnifying glass. When the object is placed between the optical center and the focus, it forms an enlarged, erect, and virtual image.",
      points: 10
    },
    {
      id: "t5q4",
      type: "mcq",
      question: "What happens to a ray of light that passes exactly through the optical center of a lens?",
      options: [
        "It bends towards the principal axis.",
        "It bends away from the principal axis.",
        "It passes without any deviation.",
        "It gets reflected back."
      ],
      correctAnswer: "It passes without any deviation.",
      explanation: "The optical center is the central point of a lens. Any ray passing through it travels straight without suffering any deviation or lateral shift.",
      points: 10
    },
    {
      id: "t5q5",
      type: "mcq",
      question: "To get a real and enlarged image from a convex lens, the object should be placed:",
      options: [
        "At infinity",
        "Beyond $2F_1$",
        "Between $F_1$ and $2F_1$",
        "Between $O$ and $F_1$"
      ],
      correctAnswer: "Between $F_1$ and $2F_1$",
      explanation: "When placed between $F_1$ and $2F_1$, the image forms beyond $2F_2$ and is real, inverted, and enlarged. (Placing between $O$ and $F_1$ gives an enlarged but virtual image).",
      points: 10
    },

    // --- Short Answer ---
    {
      id: "t5q6",
      type: "short",
      question: "What is meant by the optical center of a spherical lens?",
      correctAnswer: "The optical center is the central point of a lens on the principal axis. A ray of light passing through the optical center emerges without any deviation.",
      explanation: "This is a fundamental property used in all ray diagrams for lenses.",
      points: 15
    },
    {
      id: "t5q7",
      type: "short",
      question: "Differentiate between a convex lens and a concave lens based on their physical shape and optical action.",
      correctAnswer: "1. Physical shape: A convex lens is thicker in the middle and thinner at the edges. A concave lens is thinner in the middle and thicker at the edges.\n2. Optical action: A convex lens converges parallel rays of light (converging lens). A concave lens diverges parallel rays of light (diverging lens).",
      explanation: "These are the two primary ways to identify and distinguish the lenses.",
      points: 15
    },
    {
      id: "t5q8",
      type: "short",
      question: "If an object is placed at infinity in front of a concave lens, where is the image formed?",
      correctAnswer: "The image is formed at the principal focus ($F_1$) on the same side as the object. It is highly diminished, virtual, and erect.",
      explanation: "Parallel rays from infinity diverge and appear to come from the focus.",
      points: 15
    },
    {
      id: "t5q9",
      type: "short",
      question: "Why do we mark $2F$ on the principal axis instead of $C$ for lenses?",
      correctAnswer: "$2F$ denotes a distance equal to twice the focal length from the optical center. For thin spherical lenses, this distance is approximately equal to the radius of curvature ($R = 2f$). Marking $2F$ makes it easier to relate object positions to focal length.",
      explanation: "It simplifies the geometric relationships for students learning basic ray optics.",
      points: 15
    },
    {
      id: "t5q10",
      type: "short",
      question: "State one use of a convex lens and one use of a concave lens.",
      correctAnswer: "Convex lens: Used in magnifying glasses, microscopes, and to correct hypermetropia.\nConcave lens: Used in peepholes of doors and to correct myopia.",
      explanation: "Lenses have wide practical applications based on their converging/diverging properties.",
      points: 15
    },

    // --- Long Answer ---
    {
      id: "t5q11",
      type: "long",
      question: "Explain the formation of an image by a convex lens when the object is placed between the optical center ($O$) and the principal focus ($F_1$). Also state its application.",
      correctAnswer: "When an object is placed between $O$ and $F_1$ of a convex lens:\n1. A ray parallel to the principal axis passes through $F_2$ after refraction.\n2. A ray passing through $O$ goes undeviated.\n3. These two refracted rays are diverging on the other side. When produced backwards, they appear to meet on the same side of the lens as the object.\n4. Therefore, a virtual, erect, and enlarged image is formed.\nApplication: This principle is used in a simple magnifying glass or a reading glass.",
      explanation: "This is the only case where a convex lens acts as a magnifying glass forming a virtual image.",
      points: 20
    },
    {
      id: "t5q12",
      type: "long",
      question: "Describe with the help of a ray diagram the nature, size, and position of the image formed when an object is placed beyond $2F_1$ in front of a convex lens.",
      correctAnswer: "1. The object is placed beyond $2F_1$.\n2. A ray parallel to the principal axis refracts through $F_2$.\n3. A ray passing through the optical center goes straight.\n4. The two refracted rays intersect between $F_2$ and $2F_2$ on the other side of the lens.\nNature: Real and inverted.\nSize: Diminished (smaller than the object).\nPosition: Between $F_2$ and $2F_2$ on the opposite side.",
      explanation: "This setup is analogous to an object placed beyond C for a concave mirror.",
      points: 20
    },
    {
      id: "t5q13",
      type: "long",
      question: "Compare the image formation characteristics of a concave lens with that of a convex mirror.",
      correctAnswer: "Both a concave lens and a convex mirror share similar image formation characteristics:\n1. Both always form virtual and erect images.\n2. Both always form diminished images (smaller than the object).\n3. The image is always formed between the optical center/pole and the principal focus.\n4. They are both diverging in nature (concave lens diverges refracted rays, convex mirror diverges reflected rays).",
      explanation: "This highlights the symmetry in optics: Diverging systems (concave lens, convex mirror) share characteristics, while converging systems (convex lens, concave mirror) share characteristics.",
      points: 20
    },
    {
      id: "t5q14",
      type: "long",
      question: "How can you experimentally find the approximate focal length of a convex lens? Describe the procedure.",
      correctAnswer: "Experiment:\n1. Hold a convex lens facing a distant object (like a distant tree or the sun).\n2. Place a white screen (like a piece of paper) behind the lens.\n3. Move the screen back and forth until a sharp, bright, and inverted image of the distant object is formed on the screen.\n4. Measure the distance between the optical center of the lens and the screen using a scale.\n5. This distance is the approximate focal length of the convex lens because parallel rays from a distant object converge at the principal focus.",
      explanation: "This simple school experiment relies on the fact that an object at infinity forms an image at the focus.",
      points: 20
    },
    {
      id: "t5q15",
      type: "long",
      question: "A convex lens forms a real and inverted image of a needle at a distance of 50 cm from it. Where is the needle placed in front of the convex lens if the image is equal to the size of the object?",
      correctAnswer: "Since the image is real, inverted, and equal in size to the object, the object must be placed at $2F_1$. In this case, the image is formed at $2F_2$.\nWe are given the image distance $v = +50 \\text{ cm}$.\nTherefore, $2F_2$ is at 50 cm. This means $2f = 50 \\implies f = 25 \\text{ cm}$.\nSince the object must be at $2F_1$, the object distance $u = -50 \\text{ cm}$.\nThe needle is placed 50 cm in front of the convex lens.",
      explanation: "This question tests the knowledge of the specific case where $|m|=1$, which occurs when object is at $2F$.",
      points: 20
    },

    // --- HOTS ---
    {
      id: "t5q16",
      type: "thinking",
      question: "If half of a convex lens is covered with black paper, will the lens produce a complete image of the object? Explain your answer.",
      correctAnswer: "Yes, the lens will still produce a complete image of the object.\nExplanation: Every small part of the lens can refract light rays from all parts of the object to form the full image. Covering half the lens merely reduces the number of light rays passing through it. As a result, the complete image is formed, but its intensity or brightness will be reduced (it will appear dimmer).",
      explanation: "This is a very common trick question. The entire lens is not needed to form the entire image; it only affects light gathering capability.",
      points: 25
    },
    {
      id: "t5q17",
      type: "thinking",
      question: "A water drop on a glass slide acts like a lens. What type of lens does it behave as, and why do objects viewed through it appear magnified?",
      correctAnswer: "A water drop behaves as a plano-convex lens or double convex lens (depending on its exact shape, but it is thicker in the middle). \nBecause it is a convex lens, when an object (like text on a paper underneath the slide) is very close to it (between the optical center and its focus), it forms a virtual, erect, and enlarged image. This is why it acts as a simple magnifying glass.",
      explanation: "Applying the physics of a convex lens to a real-world, naturally occurring shape.",
      points: 25
    },
    {
      id: "t5q18",
      type: "thinking",
      question: "Imagine you have two identical glass convex lenses. You place one in water and the other in air. Will their focal lengths be the same? Explain.",
      correctAnswer: "No, their focal lengths will not be the same. The focal length of the lens in water will be longer.\nExplanation: The converging power of a lens depends on the relative refractive index between the lens material and the surrounding medium. Glass has a higher refractive index than air, so light bends significantly. However, water also has a high refractive index (though less than glass). The difference in refractive index between glass and water is much smaller than between glass and air. Therefore, the lens bends light less in water, resulting in a longer focal length.",
      explanation: "Focal length is not an inherent property of the lens alone; it depends on the surrounding medium's refractive index (Lens Maker's Equation concept, simplified for Class 10).",
      points: 25
    },
    {
      id: "t5q19",
      type: "thinking",
      question: "An air bubble inside water behaves like a specific type of lens. Which one, and why?",
      correctAnswer: "An air bubble inside water behaves like a concave (diverging) lens.\nWhy: The air bubble has a spherical shape (like a convex lens). However, light is traveling from a denser medium (water) into a rarer medium (air inside the bubble). When light enters the convex boundary from a denser medium, it bends away from the normal, causing the rays to diverge. Thus, despite its shape, the relative refractive indices make it act as a diverging lens.",
      explanation: "This is a brilliant application of Snell's law. A convex shape made of a rarer medium inside a denser medium acts as a diverging lens.",
      points: 25
    },
    {
      id: "t5q20",
      type: "thinking",
      question: "A laser beam passing through a convex lens is observed in a smoke-filled room. As the beam passes the focus, does it remain a single point of light forever?",
      correctAnswer: "No. The convex lens converges the parallel laser beam to a single point at the focus. However, after passing through the focal point, the light rays continue to travel in straight lines, crossing over each other. Thus, the beam diverges again after the focus, spreading out into a cone of light.",
      explanation: "Light rays don't stop at the focus. The focus is merely the intersection point, after which rectilinear propagation continues.",
      points: 25
    },

    // ═══════════════════════════════════════════════════
    // ADDITIONAL QUESTIONS — Set 2 (t5q21 to t5q35)
    // ═══════════════════════════════════════════════════

    // --- MCQ Set 2 ---
    {
      id: "t5q21",
      type: "mcq",
      question: "Which lens is thicker at the edges and thinner at the centre?",
      options: [
        "Convex lens",
        "Biconcave lens",
        "Plano-convex lens",
        "Converging lens"
      ],
      correctAnswer: "Biconcave lens",
      explanation: "A biconcave (concave) lens curves inward on both surfaces, making it thicker at the edges and thinner at the centre. This shape causes light rays to diverge, which is why it is called a diverging lens. In contrast, a convex lens is thicker at the centre and thinner at the edges.",
      points: 10
    },
    {
      id: "t5q22",
      type: "mcq",
      question: "An object is placed at the focus of a convex lens. The image formed is:",
      options: [
        "At $2F_2$, real, inverted, same size",
        "At $F_2$, virtual, erect",
        "At infinity, real, inverted, highly magnified",
        "Between $F_2$ and $2F_2$, real, inverted"
      ],
      correctAnswer: "At infinity, real, inverted, highly magnified",
      explanation: "When the object is at $F_1$ (focus of a convex lens), the refracted rays emerge parallel to the principal axis and meet at infinity. The image is real, inverted, and infinitely magnified. This is the principle used in searchlights and theater spotlights — placing a light source at the focus creates a parallel beam.",
      points: 10
    },
    {
      id: "t5q23",
      type: "mcq",
      question: "Which defect of the eye is corrected by a concave lens?",
      options: [
        "Hypermetropia (far-sightedness)",
        "Myopia (near-sightedness)",
        "Presbyopia",
        "Astigmatism"
      ],
      correctAnswer: "Myopia (near-sightedness)",
      explanation: "In myopia, the eye lens is too converging — it focuses light in front of the retina. A concave (diverging) lens diverges the incoming rays before they enter the eye, effectively reducing convergence so the image falls correctly on the retina. Hypermetropia is corrected by a convex (converging) lens.",
      points: 10
    },
    {
      id: "t5q24",
      type: "mcq",
      question: "A convex lens of focal length 20 cm. An object is placed at 30 cm from the lens. Using lens formula, where is the image?",
      options: [
        "60 cm on the same side as object",
        "60 cm on the opposite side",
        "12 cm on the opposite side",
        "At infinity"
      ],
      correctAnswer: "60 cm on the opposite side",
      explanation: "Lens formula: $1/v - 1/u = 1/f$. Here $u = -30$ cm, $f = +20$ cm (convex). $1/v = 1/f + 1/u = 1/20 + 1/(-30) = 1/20 - 1/30 = 3/60 - 2/60 = 1/60$. $v = +60$ cm. Positive $v$ means the image is on the opposite side — real and inverted.",
      points: 10
    },
    {
      id: "t5q25",
      type: "mcq",
      question: "What happens to the focal length of a glass convex lens when it is completely immersed in water (n_glass > n_water)?",
      options: [
        "Focal length decreases",
        "Focal length increases",
        "Focal length remains unchanged",
        "Lens becomes a concave lens"
      ],
      correctAnswer: "Focal length increases",
      explanation: "The focal length of a lens depends on the relative refractive index (n_lens / n_medium). When immersed in water, the relative refractive index of glass decreases (because n_water is closer to n_glass than air is). A smaller relative refractive index means less bending of light, so the focal length INCREASES. The lens is still converging but weaker.",
      points: 10
    },

    // --- Short Answer Set 2 ---
    {
      id: "t5q26",
      type: "short",
      question: "A convex lens produces a virtual image. Where is the object placed? What are the properties of the image?",
      correctAnswer: "The object must be placed BETWEEN the optical centre (O) and the focus ($F_1$) of the convex lens — i.e., at a distance less than the focal length from the lens.\n\nProperties of the image:\n• Virtual (cannot be formed on screen; rays appear to diverge from image point)\n• Erect (same orientation as object)\n• Magnified (larger than the object)\n• On the SAME side as the object (in front of the lens)\n\nThis is the principle of a magnifying glass.",
      explanation: "Object between O and F of a convex lens → virtual, erect, magnified image on same side. This is a magnifying glass.",
      points: 15
    },
    {
      id: "t5q27",
      type: "short",
      question: "Define the 'optical centre' of a lens. Why does a ray of light passing through the optical centre not deviate?",
      correctAnswer: "Optical centre (O): A point on the principal axis of the lens such that a ray of light passing through it goes straight through without any refraction (deviation).\n\nWhy no deviation: At the optical centre, the two surfaces of the lens are locally parallel (like a glass slab). A ray passing through a glass slab with parallel surfaces emerges parallel to the incident ray, only laterally displaced. For a very thin lens, this lateral displacement is negligibly small, so the ray appears to pass through undeviated.",
      explanation: "The optical centre behaves like a zero-thickness glass slab. Practically, rays through O are undeviated — used as one of the principal rays in ray diagrams.",
      points: 15
    },
    {
      id: "t5q28",
      type: "short",
      question: "An object is placed at $2F_1$ of a convex lens. Where is the image formed? What are its properties? What is the practical application of this position?",
      correctAnswer: "Image position: At $2F_2$ on the other side of the lens (equal distance from lens as object).\n\nProperties:\n• Real and inverted\n• Same size as the object ($m = -1$)\n• At $2F_2$ (twice the focal length on the image side)\n\nPractical application: This is used in photocopiers and some cameras to produce a 1:1 copy of the original document. The object and image are the same size.",
      explanation: "Object at 2F → image at 2F on other side, same size. m = -1. Used in 1:1 imaging devices.",
      points: 15
    },
    {
      id: "t5q29",
      type: "short",
      question: "Differentiate between a real image and a virtual image formed by a convex lens.",
      correctAnswer: "Real Image (Convex Lens):\n• Formed when object is beyond $F_1$ (object distance > focal length)\n• Actual intersection of refracted rays\n• Can be formed on a screen\n• Inverted relative to object\n• Magnification is negative ($m < 0$)\n• $v$ is positive (image on other side of lens)\n\nVirtual Image (Convex Lens):\n• Formed when object is between O and $F_1$ (object distance < focal length)\n• Apparent intersection of extended refracted rays (diverging rays appear to meet behind the lens)\n• CANNOT be formed on a screen\n• Erect relative to object\n• Magnification is positive ($m > 0$)\n• $v$ is negative (image on same side as object)",
      explanation: "The lens formula sign for v determines real vs virtual. For a convex lens: +v = real, -v = virtual.",
      points: 15
    },
    {
      id: "t5q30",
      type: "short",
      question: "A student is told that a particular lens always forms a virtual, erect, and diminished image of any object placed in front of it. Identify the type of lens and explain why it always behaves this way.",
      correctAnswer: "The lens is a CONCAVE (diverging) lens.\n\nWhy it always forms virtual, erect, diminished images:\nA concave lens is a diverging lens. It has a virtual focus (the focus is on the same side as the incident light). Regardless of object position, refracted rays from a concave lens always diverge. When extended backwards, they appear to meet at a virtual focus behind the lens (on the same side as the object). This always produces a virtual, erect image. Because the virtual focus is between the lens and the object, the image is always smaller than the object (diminished).",
      explanation: "A concave lens ALWAYS produces virtual, erect, diminished images — no exceptions. This makes it predictable and useful for wide-angle viewing applications.",
      points: 15
    },

    // --- Long Answer Set 2 ---
    {
      id: "t5q31",
      type: "long",
      question: "An object of height 5 cm is placed 25 cm in front of a convex lens of focal length 15 cm. Find: (a) Position of image (b) Size of image (c) Nature of image. Also describe whether the image can be seen on a screen.",
      correctAnswer: "Given: $h_o = 5$ cm, $u = -25$ cm, $f = +15$ cm.\n\n(a) Lens formula: $1/v - 1/u = 1/f$\n$1/v = 1/f + 1/u = 1/15 + 1/(-25) = 1/15 - 1/25 = 5/75 - 3/75 = 2/75$\n$v = 75/2 = +37.5$ cm.\nImage is 37.5 cm from the lens on the other side (positive → other side).\n\n(b) Magnification: $m = v/u = (+37.5)/(-25) = -1.5$\n$h_i = m \\times h_o = -1.5 \\times 5 = -7.5$ cm.\nImage height is 7.5 cm. Negative → inverted.\n\n(c) Nature:\n• Real (v is positive for a convex lens → image on far side)\n• Inverted ($m < 0$)\n• Magnified ($|m| = 1.5 > 1$)\n\nThe image CAN be formed on a screen because it is real — the refracted rays actually converge at $v = 37.5$ cm. A screen placed 37.5 cm from the lens on the far side will show the image.",
      explanation: "For a convex lens: positive v = real = can be projected on a screen. Full procedure: 1/v calculation → magnification → size → nature interpretation.",
      points: 20
    },
    {
      id: "t5q32",
      type: "long",
      question: "With the help of ray diagrams, describe the image formed by a convex lens when: (a) Object is beyond $2F_1$ and (b) Object is between $F_1$ and $2F_1$.",
      correctAnswer: "(a) Object beyond $2F_1$:\nRay diagram description:\n• Ray 1 (parallel to axis) → refracts through $F_2$\n• Ray 2 (through $F_1$) → refracts parallel to axis\n• Both rays converge between $F_2$ and $2F_2$\n\nImage properties:\n• Real and inverted\n• Diminished (|m| < 1)\n• Between $F_2$ and $2F_2$\n• Application: Camera lens, human eye (distant objects).\n\n(b) Object between $F_1$ and $2F_1$:\nRay diagram description:\n• Ray 1 (parallel to axis) → refracts through $F_2$\n• Ray 2 (through $F_1$) → refracts parallel to axis\n• Both rays converge beyond $2F_2$\n\nImage properties:\n• Real and inverted\n• Magnified (|m| > 1)\n• Beyond $2F_2$\n• Application: Projector, slide projector, overhead projector.",
      explanation: "Two key cases for a convex lens: object beyond 2F gives diminished real image (camera); object between F and 2F gives magnified real image (projector).",
      points: 20
    },
    {
      id: "t5q33",
      type: "long",
      question: "Explain in detail how a convex lens can correct hypermetropia (far-sightedness). What happens to light in a hypermetropic eye, and how does the correcting lens fix it?",
      correctAnswer: "Hypermetropia (Far-sightedness):\nA person with hypermetropia can see distant objects clearly but cannot see near objects clearly. Their near point is farther than 25 cm.\n\nCause: The eyeball is shorter than normal, OR the eye lens is too flat (less converging). As a result, when looking at a nearby object (25 cm), the rays converge BEHIND the retina, not on it.\n\nCorrection with Convex Lens:\n1. A convex (converging) lens is placed in front of the eye.\n2. When looking at a near object at 25 cm, the convex lens converges the rays before they enter the eye.\n3. This extra convergence compensates for the eye's insufficient convergence.\n4. The eye can now focus the image exactly on the retina.\n5. Essentially, the convex lens creates a virtual, erect, magnified image of the near object at the person's far point (e.g., 100 cm), which the hypermetropic eye CAN see clearly.\n\nRequired lens power:\n$P = 1/f = 1/(\\text{near point in m}) - 1/(0.25)$ [adjusted for actual near point]",
      explanation: "Hypermetropia correction = convex lens + image shifts from behind retina to on retina. Always explain WHY the image was off-retina first.",
      points: 20
    },

    // --- HOTS Set 2 ---
    {
      id: "t5q34",
      type: "thinking",
      question: "Two identical convex lenses are placed coaxially (on the same axis) with their focal points coinciding. One lens faces the object, the other faces the image side. What is the effective focal length of this system? How does this compare to a single lens?",
      correctAnswer: "When the focal points of two lenses coincide, they are separated by a distance $d = f_1 + f_2$ (since each focal point is at $f$ from its lens, and they're back-to-back). Wait — if the lenses are placed so that the second focal point of lens 1 coincides with the first focal point of lens 2, then $d = f_1 + f_2$.\n\nUsing the formula for two thin lenses separated by distance $d$:\n$1/F = 1/f_1 + 1/f_2 - d/(f_1 \\cdot f_2)$\n\nFor identical lenses ($f_1 = f_2 = f$) with $d = 2f$:\n$1/F = 1/f + 1/f - 2f/f^2 = 2/f - 2/f = 0$\n$F = \\infty$.\n\nInterpretation: The system produces a PARALLEL beam from a parallel beam — it is a telescopic (afocal) system, like a simple beam expander or Galilean telescope principle. It doesn't focus light to a point at all!",
      explanation: "When two identical lenses are separated by their combined focal lengths, the power cancels to zero. This is the basis of telescopic optical systems.",
      points: 25
    },
    {
      id: "t5q35",
      type: "thinking",
      question: "A magnifying glass (convex lens) is used to read very small text. A student notices that if they hold the lens very close to the page, it magnifies well; but as they lift it away, at some point the image suddenly flips (becomes inverted) and they can no longer read. Explain this observation using optics principles.",
      correctAnswer: "Phase 1 — Object between O and F (lens close to page):\n• Object distance < focal length\n• Lens formula gives $v < 0$ → virtual, erect, magnified image\n• Student sees magnified text clearly (the magnifying glass function)\n\nTransition — Object at exactly F:\n• Object distance = focal length\n• $1/v = 0$ → $v = \\infty$ → no image formed\n• Student sees a bright blur (parallel rays)\n\nPhase 2 — Object beyond F (lens lifted higher than f from page):\n• Object distance > focal length\n• Lens formula gives $v > 0$ → real, inverted, image on other side\n• The real image forms somewhere in space above the lens\n• The student's eye, which is looking down at the page through the lens, now sees the inverted real image floating above the lens — text appears flipped\n\nConclusion: The critical transition point is when the object is at the focal length. Beyond it, the lens acts as a projector, not a magnifier.",
      explanation: "This beautifully demonstrates the complete behaviour of a convex lens in a single real scenario. The flip corresponds exactly to the object crossing the focal plane.",
      points: 25
    }
  ]
};
