/**
 * FILE: topic-6-lens-formula-and-power.ts
 * LOCATION: src/lib/content/class10/science/light-reflection-and-refraction/lens-formula/topic-6-lens-formula-and-power.ts
 * PURPOSE: Detailed study of the Lens Formula, Magnification for lenses, and Power of a Lens.
 * LAST UPDATED: 2026-06-08
 */

import { Topic } from "../../shared-types";

export const topic6LensFormulaAndPower: Topic = {
  id: "lens-formula-and-power",
  title: "6. Lens Formula and Power of a Lens",
  estimatedMinutes: 50,
  imageUrl: "https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?auto=format&fit=crop&q=80&w=1200",
  content: `
### Sign Convention for Spherical Lenses

For lenses, we follow sign conventions similar to the one used for spherical mirrors. We apply the rules for signs of distances, except that all measurements are taken from the **optical center ($O$)** of the lens instead of the pole.

*   **Object distance ($u$):** Always negative.
*   **Focal length of Convex Lens:** Positive ($+f$).
*   **Focal length of Concave Lens:** Negative ($-f$).

---

### Lens Formula

The lens formula gives the relationship between the object distance ($u$), image distance ($v$), and the focal length ($f$) of a spherical lens.

It is expressed as:
$$ \\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f} $$

*Note:* This formula differs from the mirror formula by a minus sign. It is general and valid in all situations for any spherical lens, provided proper sign conventions are used.

---

### Magnification for Lenses ($m$)

Magnification produced by a lens is defined as the ratio of the height of the image ($h'$) to the height of the object ($h$).
$$ m = \\frac{h'}{h} $$

Magnification is also related to the object distance ($u$) and image distance ($v$). For lenses, the relation is:
$$ m = \\frac{v}{u} $$

Combining the two:
$$ m = \\frac{h'}{h} = \\frac{v}{u} $$

*Note:* Unlike mirrors ($m = -v/u$), the magnification formula for lenses does not have a negative sign.

**Interpreting $m$ for lenses:**
*   **Positive $m$:** Virtual and erect image.
*   **Negative $m$:** Real and inverted image.

---

### Power of a Lens ($P$)

The degree of convergence or divergence of light rays achieved by a lens is expressed in terms of its power. A lens of short focal length bends the light rays more, meaning it has more power.

The power of a lens is defined as the reciprocal of its focal length.
$$ P = \\frac{1}{f} $$
*Where $f$ must be measured in meters (m).*

**Unit of Power:**
The SI unit of power of a lens is **diopter (D)**.
$$ 1 \\text{ D} = 1 \\text{ m}^{-1} $$
1 diopter is the power of a lens whose focal length is 1 meter.

**Sign of Power:**
*   Power of a **convex lens** is **positive** (since $f$ is positive).
*   Power of a **concave lens** is **negative** (since $f$ is negative).

*Example:* If an optician prescribes corrective lenses of $+2.0 \\text{ D}$, it means the lens is convex with a focal length of $+0.5 \\text{ m}$. If the prescription is $-2.5 \\text{ D}$, the lens is concave.

---

### Power of a Combination of Lenses

If several thin lenses are placed in contact with one another, the power of the combination is equal to the algebraic sum of the individual powers of the lenses.

$$ P = P_1 + P_2 + P_3 + \\dots $$

The use of powers instead of focal lengths simplifies the calculations for lens combinations in optical instruments like microscopes and cameras.

---
### Exam Summary

#### 📐 The Two Key Formulas for Lenses
$$\\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f} \\quad \\text{(Lens Formula)}$$
$$m = \\frac{h'}{h} = \\frac{v}{u} \\quad \\text{(Magnification — note: NO negative sign unlike mirrors!)}$$

#### 📌 Sign Convention for Lenses
*   **All distances** measured from **Optical Center** ($O$).
*   Object on left → $u$ is always **Negative**.
*   $f_{convex}$ = Positive; $f_{concave}$ = Negative.
*   Unlike mirrors: lens magnification formula is $m = v/u$ (no negative sign).

#### ⚡ Power of a Lens
$$P = \\frac{1}{f} \\quad \\text{(f in metres)}$$
*   Unit: **Dioptre (D)** — $1\\text{ D} = 1 \\text{ m}^{-1}$
*   **Convex lens:** $P$ is **Positive** (converging).
*   **Concave lens:** $P$ is **Negative** (diverging).

#### 🔗 Combination of Lenses (in contact)
$$P_{total} = P_1 + P_2 + P_3 + \\dots$$
*   Total focal length: $\\frac{1}{f} = \\frac{1}{f_1} + \\frac{1}{f_2} + \\dots$
*   Used in eyeglasses, camera lenses, telescopes for precise focusing.

#### 🔑 Mirrors vs. Lenses — Formula Comparison (High-yield for MCQ)
| Feature | Mirror | Lens |
|---|---|---|
| Formula | $1/v + 1/u = 1/f$ | $1/v - 1/u = 1/f$ |
| Magnification | $m = -v/u$ | $m = +v/u$ |
| Positive $f$ means | Convex mirror | Convex lens |
| Negative $f$ means | Concave mirror | Concave lens |

#### 🧮 Power of Human Eye Lens
*   Normal human eye: approximately **+59 D** (very powerful convex lens system).
*   Spectacle lenses used to correct defects: concave (myopia, negative power), convex (hyperopia, positive power).

#### ⚠️ Common Mistakes in Lens Numericals
*   Using mirror formula ($1/v + 1/u$) for a lens — it's $1/v - 1/u = 1/f$ for lenses.
*   Forgetting the unit of power: **Dioptre (D)**, not cm or m.
*   Not converting focal length to **metres** before calculating power.

#### 🧪 Standard Numerical: Spectacle Prescription
A person requires a lens of power $-2.5$ D. Find focal length and identify lens type.
*   $f = 1/P = 1/(-2.5) = -0.4 \\text{ m} = -40 \\text{ cm}$
*   Negative focal length → **Concave lens** → used for **Myopia (short-sightedness)**.
`,
  questions: [
    // --- MCQ ---
    {
      id: "t6q1",
      type: "mcq",
      question: "The power of a lens is defined as the reciprocal of its focal length. What must be the unit of focal length when calculating power in diopters?",
      options: [
        "Centimeters (cm)",
        "Millimeters (mm)",
        "Meters (m)",
        "Kilometers (km)"
      ],
      correctAnswer: "Meters (m)",
      explanation: "By definition, 1 Diopter = 1 m⁻¹. Therefore, focal length must be in meters.",
      points: 10
    },
    {
      id: "t6q2",
      type: "mcq",
      question: "Which of the following represents the correct lens formula?",
      options: [
        "$1/v + 1/u = 1/f$",
        "$1/v - 1/u = 1/f$",
        "$1/u - 1/v = 1/f$",
        "$u + v = f$"
      ],
      correctAnswer: "$1/v - 1/u = 1/f$",
      explanation: "This is the standard formula for lenses, differing from the mirror formula by the negative sign.",
      points: 10
    },
    {
      id: "t6q3",
      type: "mcq",
      question: "An optician prescribes spectacles with a power of -2.0 D. What type of lens is this?",
      options: [
        "Convex lens",
        "Concave lens",
        "Plano-convex lens",
        "Bifocal lens"
      ],
      correctAnswer: "Concave lens",
      explanation: "A negative power indicates a negative focal length, which is characteristic of a concave (diverging) lens.",
      points: 10
    },
    {
      id: "t6q4",
      type: "mcq",
      question: "For a lens, the magnification $m$ is given by the relation:",
      options: [
        "$m = -v/u$",
        "$m = u/v$",
        "$m = v/u$",
        "$m = -u/v$"
      ],
      correctAnswer: "$m = v/u$",
      explanation: "Unlike mirrors where $m = -v/u$, the magnification for lenses is simply $v/u$.",
      points: 10
    },
    {
      id: "t6q5",
      type: "mcq",
      question: "Two lenses of powers +3.5 D and -1.5 D are placed in contact. What is the power of the combination?",
      options: [
        "+5.0 D",
        "+2.0 D",
        "-2.0 D",
        "-5.0 D"
      ],
      correctAnswer: "+2.0 D",
      explanation: "The power of a combination of lenses is the algebraic sum of individual powers. $P = P_1 + P_2 = +3.5 + (-1.5) = +2.0 \\text{ D}$.",
      points: 10
    },

    // --- Short Answer ---
    {
      id: "t6q6",
      type: "short",
      question: "Define 1 diopter of power of a lens.",
      correctAnswer: "One diopter is defined as the power of a lens whose focal length is exactly 1 meter.",
      explanation: "This is the standard SI unit definition for optical power.",
      points: 15
    },
    {
      id: "t6q7",
      type: "short",
      question: "Find the focal length of a lens of power -2.0 D.",
      correctAnswer: "$P = -2.0 \\text{ D}$. \n$f = 1/P = 1 / (-2.0) = -0.5 \\text{ m}$. \nThe focal length is -0.5 meters (or -50 cm).",
      explanation: "Direct application of the power formula, remembering the result is in meters.",
      points: 15
    },
    {
      id: "t6q8",
      type: "short",
      question: "Why does a concave lens have a negative focal length according to the sign convention?",
      correctAnswer: "When parallel rays fall on a concave lens, they diverge. When extended backwards, they appear to meet at the principal focus on the same side as the object (left side). Since distances measured to the left of the optical center are negative, the focal length is negative.",
      explanation: "This explains the geometric reasoning behind the Cartesian sign convention.",
      points: 15
    },
    {
      id: "t6q9",
      type: "short",
      question: "A doctor has prescribed a corrective lens of power +1.5 D. Find the focal length of the lens. Is the prescribed lens diverging or converging?",
      correctAnswer: "$P = +1.5 \\text{ D}$.\n$f = 1/P = 1 / 1.5 = 10/15 = 2/3 \\text{ m} \\approx +0.67 \\text{ m}$ (or +66.7 cm).\nSince the power and focal length are positive, it is a converging (convex) lens.",
      explanation: "Positive power always indicates a convex/converging lens.",
      points: 15
    },
    {
      id: "t6q10",
      type: "short",
      question: "What is the advantage of combining multiple thin lenses in optical instruments?",
      correctAnswer: "Combining lenses helps to increase the magnification, increase the sharpness of the image, and minimize optical defects (aberrations) that might be present in a single lens.",
      explanation: "This is why cameras and microscopes use complex lens assemblies rather than a single simple lens.",
      points: 15
    },

    // --- Long Answer ---
    {
      id: "t6q11",
      type: "long",
      question: "A concave lens has focal length of 15 cm. At what distance should the object from the lens be placed so that it forms an image at 10 cm from the lens? Also, find the magnification produced by the lens.",
      correctAnswer: "A concave lens always forms a virtual, erect image on the same side as the object. Thus, image distance $v$ is negative.\n$v = -10 \\text{ cm}$. Focal length $f = -15 \\text{ cm}$ (concave lens).\nUsing lens formula: $1/v - 1/u = 1/f \\implies 1/u = 1/v - 1/f$\n$1/u = 1/(-10) - 1/(-15) = -1/10 + 1/15 = (-3+2)/30 = -1/30$.\nTherefore, $u = -30 \\text{ cm}$. The object should be placed 30 cm from the lens.\nMagnification $m = v/u = (-10) / (-30) = +1/3$.\nThe magnification is $+1/3$ (positive means virtual/erect, less than 1 means diminished).",
      explanation: "Standard numerical problem requiring careful application of signs for a concave lens.",
      points: 20
    },
    {
      id: "t6q12",
      type: "long",
      question: "A 2.0 cm tall object is placed perpendicular to the principal axis of a convex lens of focal length 10 cm. The distance of the object from the lens is 15 cm. Find the nature, position and size of the image. Also find its magnification.",
      correctAnswer: "$h = +2.0 \\text{ cm}$, $f = +10 \\text{ cm}$, $u = -15 \\text{ cm}$.\n$1/v - 1/u = 1/f \\implies 1/v = 1/f + 1/u = 1/10 + 1/(-15) = 1/10 - 1/15 = (3-2)/30 = 1/30$.\n$v = +30 \\text{ cm}$.\nPosition: 30 cm on the other side of the lens.\nNature: Real and inverted (since $v$ is positive).\nMagnification $m = v/u = 30 / (-15) = -2$.\nSize $h' = m \\times h = -2 \\times 2.0 = -4.0 \\text{ cm}$.\nThe image is 4.0 cm tall, real, and inverted.",
      explanation: "Standard numerical for a convex lens where the object is between F and 2F.",
      points: 20
    },
    {
      id: "t6q13",
      type: "long",
      question: "Two thin lenses of focal lengths +10 cm and -5 cm are kept in contact. What is the focal length and power of the combination?",
      correctAnswer: "Focal length of first lens, $f_1 = +10 \\text{ cm} = +0.1 \\text{ m}$.\nPower $P_1 = 1 / f_1 = 1 / 0.1 = +10 \\text{ D}$.\nFocal length of second lens, $f_2 = -5 \\text{ cm} = -0.05 \\text{ m}$.\nPower $P_2 = 1 / f_2 = 1 / (-0.05) = -20 \\text{ D}$.\nPower of combination $P = P_1 + P_2 = +10 \\text{ D} + (-20 \\text{ D}) = -10 \\text{ D}$.\nFocal length of combination $F = 1/P = 1 / (-10) = -0.1 \\text{ m} = -10 \\text{ cm}$.\nThe combination behaves as a concave lens of focal length 10 cm.",
      explanation: "It's easiest to calculate the powers individually, sum them up, and then find the combined focal length.",
      points: 20
    },
    {
      id: "t6q14",
      type: "long",
      question: "An object is placed at a distance of 10 cm from a convex lens of focal length 15 cm. Find the position and nature of the image.",
      correctAnswer: "Object distance $u = -10 \\text{ cm}$. Focal length $f = +15 \\text{ cm}$.\n$1/v = 1/f + 1/u = 1/15 + 1/(-10) = 1/15 - 1/10 = (2-3)/30 = -1/30$.\n$v = -30 \\text{ cm}$.\nSince $v$ is negative, the image is formed on the same side as the object (30 cm from the lens).\nThe nature of the image is Virtual and Erect.",
      explanation: "This numerical proves the case where object is placed between optical center and focus of a convex lens.",
      points: 20
    },
    {
      id: "t6q15",
      type: "long",
      question: "Explain the concept of 'Power of a lens'. How is it related to the focal length? If a lens converges light more strongly than another lens, what does it say about its power and focal length?",
      correctAnswer: "The power of a lens is a measure of the degree of convergence or divergence of light rays falling on it. It is defined as the reciprocal of the focal length of the lens measured in meters ($P = 1/f$).\nA lens that converges light more strongly bends the light rays at a sharper angle. This means the rays intersect closer to the optical center. \nTherefore, a strongly converging lens has a shorter focal length. Because power is the reciprocal of focal length, a shorter focal length means a higher (greater) power.",
      explanation: "Conceptual understanding of power relating physical bending to mathematical variables.",
      points: 20
    },

    // --- HOTS ---
    {
      id: "t6q16",
      type: "thinking",
      question: "A student uses a lens of focal length 40 cm and another of -20 cm. If he wants to form a combination that acts as a converging lens of focal length 40 cm, what should he do?",
      correctAnswer: "He should use two convex lenses of focal length 40 cm and one concave lens of -20 cm, or some other combination.\nLet's check the given lenses. $P_1 = 1/0.4 = +2.5 \\text{ D}$. $P_2 = 1/(-0.2) = -5.0 \\text{ D}$.\nIf he combines one of each: $P = +2.5 - 5.0 = -2.5 \\text{ D}$ (which is a diverging lens of -40 cm). This won't work.\nHe wants a converging lens of 40 cm, which means $P_{target} = 1/0.4 = +2.5 \\text{ D}$.\nHe already has one lens of +2.5 D. So he doesn't need to combine it with the -20 cm lens at all. He should just use the +40 cm lens by itself.",
      explanation: "This is a trick question. The student already has a +40 cm lens. Combining it with a diverging lens will only decrease the converging power.",
      points: 25
    },
    {
      id: "t6q17",
      type: "thinking",
      question: "You are given a convex lens. You place an object at $u = -f/2$. What is the magnification? Based on your answer, how does this lens act?",
      correctAnswer: "Let's use the lens formula: $1/v - 1/u = 1/f$.\n$u = -f/2$.\n$1/v - 1/(-f/2) = 1/f \\implies 1/v + 2/f = 1/f \\implies 1/v = 1/f - 2/f = -1/f$.\nSo, $v = -f$.\nNow calculate magnification: $m = v/u = (-f) / (-f/2) = 2$.\nThe magnification is +2. This means the image is virtual, erect, and twice the size of the object.\nThe lens is acting as a simple magnifying glass.",
      explanation: "Algebraic derivation of the magnifying glass principle.",
      points: 25
    },
    {
      id: "t6q18",
      type: "thinking",
      question: "If a convex lens of focal length $f$ is cut into two equal halves along its principal axis, what will be the focal length and power of each half?",
      correctAnswer: "If cut along the principal axis, the curvature of the spherical surfaces remains exactly the same. Therefore, the focal length of each half remains $f$.\nSince the focal length is unchanged, the power ($P = 1/f$) also remains unchanged.\nHowever, the aperture (area) of the lens is reduced to half, so the intensity (brightness) of the image formed will be halved.",
      explanation: "This tests the understanding that focal length depends on curvature, not the height or area of the lens. (Note: Cutting it *perpendicular* to the principal axis would make it a plano-convex lens with $2f$ focal length).",
      points: 25
    },
    {
      id: "t6q19",
      type: "thinking",
      question: "A lens forms an inverted image of an object. The size of the image is equal to the size of the object. If the distance between the object and its image is 80 cm, what is the power of the lens?",
      correctAnswer: "Since the image is inverted and of the same size, it must be a convex lens with the object placed at $2F_1$. The image is formed at $2F_2$.\nThe total distance between object and image is $u + v$ (in magnitudes). \nDistance = $2f + 2f = 4f$.\nWe are given $4f = 80 \\text{ cm}$.\nTherefore, $f = 20 \\text{ cm} = 0.2 \\text{ m}$.\nPower $P = 1/f = 1/0.2 = +5.0 \\text{ D}$.",
      explanation: "Recognizing that $u=v=2f$ when $m=-1$ is key to solving this rapidly.",
      points: 25
    },
    {
      id: "t6q20",
      type: "thinking",
      question: "Why do we use 'power' instead of 'focal length' when dealing with combinations of lenses?",
      correctAnswer: "When lenses are combined, their converging or diverging effects add up. Power is a direct measure of this converging/diverging ability. \nMathematically, the formula for combined focal length is complex: $1/F = 1/f_1 + 1/f_2 + \\dots$ \nBy defining Power as $P = 1/f$, the combination formula simplifies to a simple algebraic addition: $P = P_1 + P_2 + \\dots$ \nThis makes calculations much simpler and more intuitive for designing optical instruments.",
      explanation: "Understanding why a physical quantity is defined a certain way reveals the elegance of physics conventions.",
      points: 25
    }
  ]
};
