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
  simulationIds: [
    "light-lens-formula-calc",
    "light-power-lens",
    "light-eye-defects",
    "light-prism-dispersion",
    "light-spectrum-prism",
  ],
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
    },

    // ═══════════════════════════════════════════════════
    // ADDITIONAL QUESTIONS — Set 2 (t6q21 to t6q35)
    // ═══════════════════════════════════════════════════

    // --- MCQ Set 2 ---
    {
      id: "t6q21",
      type: "mcq",
      question: "A concave lens has a focal length of $-25$ cm. What is its power?",
      options: [
        "+4 D",
        "$-4$ D",
        "+0.25 D",
        "$-0.025$ D"
      ],
      correctAnswer: "$-4$ D",
      explanation: "Power $P = 1/f$ where $f$ is in metres. $f = -25$ cm $= -0.25$ m. $P = 1/(-0.25) = -4$ D. Negative power indicates a diverging (concave) lens. The magnitude 4 D means it has 4 dioptres of diverging power.",
      points: 10
    },
    {
      id: "t6q22",
      type: "mcq",
      question: "Two lenses of powers $+3$ D and $-1$ D are placed in contact. What is the combined focal length?",
      options: [
        "$50$ cm",
        "$25$ cm",
        "$100$ cm",
        "$33.3$ cm"
      ],
      correctAnswer: "$50$ cm",
      explanation: "Combined power: $P = P_1 + P_2 = +3 + (-1) = +2$ D. Focal length: $f = 1/P = 1/2$ m $= 0.5$ m $= 50$ cm. Positive focal length → still a converging system.",
      points: 10
    },
    {
      id: "t6q23",
      type: "mcq",
      question: "A person wears spectacles of power $-2.5$ D. What defect do they have and what is their far point?",
      options: [
        "Hypermetropia; far point is 25 cm",
        "Myopia; far point is 40 cm",
        "Myopia; far point is 2.5 cm",
        "Hypermetropia; far point is 40 cm"
      ],
      correctAnswer: "Myopia; far point is 40 cm",
      explanation: "Negative power → concave lens → corrects MYOPIA. The far point is where the eye sees clearly without the glasses. $f = 1/P = 1/(-2.5) = -0.4$ m $= -40$ cm. The lens forms an image of distant objects at 40 cm — the person's far point. So the far point is 40 cm.",
      points: 10
    },
    {
      id: "t6q24",
      type: "mcq",
      question: "Using the lens formula for a convex lens ($f = +10$ cm), an object is at $u = -15$ cm. What is the magnification?",
      options: [
        "$m = -2$",
        "$m = +2$",
        "$m = -0.5$",
        "$m = +0.5$"
      ],
      correctAnswer: "$m = -2$",
      explanation: "$1/v = 1/f + 1/u = 1/10 + 1/(-15) = 3/30 - 2/30 = 1/30$. $v = +30$ cm. $m = v/u = 30/(-15) = -2$. Negative magnification → real, inverted image. Magnitude 2 → twice the size of object.",
      points: 10
    },
    {
      id: "t6q25",
      type: "mcq",
      question: "A lens forms an erect image of the same size as the object. What type of lens is this, and where is the object?",
      options: [
        "Convex lens, object at $2F_1$",
        "Plane mirror",
        "The situation is impossible for any single lens",
        "Concave lens, object at $2F_1$"
      ],
      correctAnswer: "The situation is impossible for any single lens",
      explanation: "For a lens to form an erect image of the same size as the object ($m = +1$), we would need $v = u$ (positive). From the lens formula: $1/v - 1/u = 1/f \\implies 1/u - 1/u = 0 = 1/f \\implies f = \\infty$ (a flat piece of glass, not a lens). So no real lens can form an erect same-sized image. (A plane mirror can, but not a lens.)",
      points: 10
    },

    // --- Short Answer Set 2 ---
    {
      id: "t6q26",
      type: "short",
      question: "Write the lens formula. How is it different from the mirror formula? Explain the sign difference for $v$.",
      correctAnswer: "Lens Formula: $\\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f}$\n\nMirror Formula: $\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}$\n\nKey Difference:\nIn the lens formula, it is $1/v - 1/u$ (subtraction), while in the mirror formula it is $1/v + 1/u$ (addition).\n\nSign of $v$:\n• Lens: $v > 0$ (positive) → real image (on opposite side from object). $v < 0$ (negative) → virtual image (same side as object).\n• Mirror: $v < 0$ (negative) → real image (in front of mirror). $v > 0$ (positive) → virtual image (behind mirror).\n\nThis reversal in sign convention for 'real' occurs because light passes through a lens but reflects from a mirror.",
      explanation: "The lens and mirror formulas are similar but opposite in sign for real images. Memorise: for lenses, positive v = real (transmitted); for mirrors, negative v = real (reflected).",
      points: 15
    },
    {
      id: "t6q27",
      type: "short",
      question: "A student needs spectacles of power $+3$ D. What is his defect and what is his near point? (Normal near point = 25 cm)",
      correctAnswer: "Positive power → CONVEX lens → corrects HYPERMETROPIA (far-sightedness).\n\nThe spectacle lens forms a virtual image of the near point (25 cm) at the person's actual near point:\n$f = 1/P = 1/3$ m $\\approx 33.3$ cm.\n\nUsing lens formula with $v = -d$ (near point, virtual image) and $u = -25$ cm:\n$1/v - 1/(-25) = 1/(33.3)$\n$1/v = 1/33.3 - 1/25 = 3/100 - 4/100 = -1/100$\n$v = -100$ cm.\n\nHis near point is 100 cm (1 m) — he cannot see objects closer than 1 m without glasses.",
      explanation: "Power +3D → hypermetropia. Near point is at 1 m instead of normal 25 cm. The spectacles bring the near point from 1 m to 25 cm.",
      points: 15
    },
    {
      id: "t6q28",
      type: "short",
      question: "An object is placed 40 cm from a concave lens of focal length 20 cm. Find the position and nature of the image using the lens formula.",
      correctAnswer: "Given: $u = -40$ cm, $f = -20$ cm (concave lens).\nLens formula: $1/v = 1/f + 1/u = 1/(-20) + 1/(-40) = -1/20 - 1/40 = -2/40 - 1/40 = -3/40$.\n$v = -40/3 \\approx -13.3$ cm.\n\nNature:\n• Negative $v$ → virtual image (same side as object)\n• $m = v/u = (-13.3)/(-40) = +1/3$ → erect, diminished\n\nThe image is 13.3 cm from the lens, on the same side as the object. Virtual, erect, and diminished.",
      explanation: "A concave lens always gives: negative v (virtual), positive m (erect), m < 1 (diminished). These properties hold regardless of object position.",
      points: 15
    },
    {
      id: "t6q29",
      type: "short",
      question: "What is the SI unit of power of a lens? Explain the physical meaning of 1 dioptre.",
      correctAnswer: "SI unit: Dioptre (D).\n\n1 dioptre = the power of a lens whose focal length is 1 metre.\n$P = 1/f(\\text{in metres})$, so $1 \\text{ D} = 1 \\text{ m}^{-1}$.\n\nPhysical meaning: A lens of 1 dioptre power focuses parallel rays to a point 1 metre away. A 2 D lens focuses them at 0.5 m. A 4 D lens at 0.25 m. Higher power = shorter focal length = more bending power.\n\nSign convention: Positive power → converging lens. Negative power → diverging lens.",
      explanation: "Dioptre is the standard unit for opticians. Eyeglass prescriptions always use dioptres — a prescription of +2.5 D means a converging lens of focal length 40 cm.",
      points: 15
    },
    {
      id: "t6q30",
      type: "short",
      question: "A convex lens has focal length 10 cm. How far from the lens must an object be placed to produce a magnification of $+5$ (virtual, erect)?",
      correctAnswer: "Virtual, erect image → $m = +5 > 0$. For a convex lens, $m = v/u$.\n$5 = v/u \\implies v = 5u$.\nBut for a virtual image from a convex lens, $v < 0$ (same side as object). So $v = 5u$ where both $u$ and $v$ are negative: $u = -x$, $v = -5x$.\n\nLens formula: $1/v - 1/u = 1/f$\n$1/(-5x) - 1/(-x) = 1/10$\n$-1/(5x) + 1/x = 1/10$\n$(-1 + 5)/(5x) = 1/10$\n$4/(5x) = 1/10 \\implies x = 8$ cm.\n$u = -8$ cm. Object is 8 cm from the lens.",
      explanation: "A magnifying glass with m=5: object must be closer than focal length (8 cm < 10 cm). The closer to F, the more magnification, but the image goes further and further from the lens.",
      points: 15
    },

    // --- Long Answer Set 2 ---
    {
      id: "t6q31",
      type: "long",
      question: "A person cannot see objects beyond 5 m. (a) What defect do they have? (b) What power of lens is needed to correct their vision to see objects at infinity? (c) If they also need to see nearby objects at 25 cm, what additional consideration might be needed?",
      correctAnswer: "(a) The person's far point is only 5 m. They cannot see distant objects clearly. This is MYOPIA (near-sightedness). The eye lens converges too strongly, forming images in front of the retina for distant objects.\n\n(b) A concave lens must be used. It must create a virtual image of distant objects (at infinity) at the person's far point (5 m).\nObject at $u = -\\infty$, image at $v = -5$ m.\n$1/f = 1/v - 1/u = 1/(-5) - 1/(-\\infty) = -1/5 - 0 = -1/5$.\n$f = -5$ m, $P = 1/f = 1/(-5) = -0.2$ D.\n\n(c) If the person also has difficulty with near vision (presbyopia/hypermetropia), they might need bifocal lenses — the upper part has the concave lens for distant vision, and the lower part has a convex lens for reading.",
      explanation: "Complete myopia correction: identify defect → far point → apply lens formula with u=∞ → find power. Always mention that near-far combined = bifocals.",
      points: 20
    },
    {
      id: "t6q32",
      type: "long",
      question: "Three lenses of powers $P_1 = +2$ D, $P_2 = -1.5$ D, and $P_3 = +4$ D are placed in contact. (a) Find the combined power. (b) Find the combined focal length. (c) Explain what type of overall lens system this represents.",
      correctAnswer: "(a) Combined power:\n$P = P_1 + P_2 + P_3 = +2 + (-1.5) + 4 = +4.5$ D.\n\n(b) Combined focal length:\n$f = 1/P = 1/4.5 = 0.222$ m $\\approx 22.2$ cm.\n\n(c) Type of system:\nPositive combined power (+4.5 D) → CONVERGING lens system.\nFocal length is 22.2 cm — a moderately converging system.\n\nSignificance: In camera lenses and microscopes, multiple lenses are combined to control aberrations while achieving the desired focal length. Here, the middle concave lens ($P_2$) reduces spherical aberration while the two convex lenses ($P_1$ and $P_3$) provide the main converging power. The net system still converges but with less distortion than a single lens of the same focal length.",
      explanation: "Lens combination formula: powers simply add. Multi-lens design reduces aberrations while controlling focal length — used in all modern optical instruments.",
      points: 20
    },
    {
      id: "t6q33",
      type: "long",
      question: "Explain the human eye as an optical instrument. What is accommodation? How does the eye adjust for near and far objects? Why does accommodation ability reduce with age?",
      correctAnswer: "Human Eye as an Optical Instrument:\nThe eye is a complex optical system. Key components:\n• Cornea: the outer curved transparent surface — provides most of the eye's converging power (fixed, ~43 D).\n• Eye lens: a flexible biconvex lens — provides adjustable focus.\n• Retina: the screen at the back where images must form — contains light-sensitive rods and cones.\n• Iris: controls the amount of light entering.\n• Ciliary muscles: control lens shape.\n\nAccommodation:\nThe ability of the eye lens to change its focal length by changing its shape (curvature) is called accommodation.\n\nNear objects: Ciliary muscles CONTRACT → lens becomes THICKER (more curved) → focal length DECREASES → stronger converging power → image forms on retina.\n\nFar objects: Ciliary muscles RELAX → lens becomes THINNER (flatter) → focal length INCREASES → weaker converging power → image still forms on retina.\n\nWhy Accommodation Decreases with Age:\nAs we age, the eye lens gradually loses its elasticity and the ciliary muscles weaken. The lens cannot change shape as much. This condition is called PRESBYOPIA — the near point gradually recedes to beyond 25 cm. Most people over 40 need reading glasses (+ve power lenses) to compensate.",
      explanation: "This comprehensive answer covers the full optical system of the eye, accommodation mechanism, and the age-related decline — a common 5-7 mark exam question.",
      points: 20
    },

    // --- HOTS Set 2 ---
    {
      id: "t6q34",
      type: "thinking",
      question: "A photographer wants to take a close-up photo of a flower using a camera with a convex lens of focal length 5 cm. The film (sensor) is 5.5 cm behind the lens. How far from the flower should the camera be held? What is the magnification on the film?",
      correctAnswer: "Given: $v = +5.5$ cm (film is on other side of lens), $f = +5$ cm.\n\nLens formula: $1/u = 1/v - 1/f = 1/5.5 - 1/5 = 10/55 - 11/55 = -1/55$.\n$u = -55$ cm.\n\nThe flower must be 55 cm in front of the lens.\n\nMagnification: $m = v/u = 5.5/(-55) = -0.1$.\n\nThe image on the film is 0.1 × (size of flower), i.e., 10 times smaller than real. Negative sign → real, inverted.\n\nInterpretation: In a camera, the film (sensor) is just slightly beyond the focal point, and objects are always much farther than the focal length. The image is always real, inverted (cameras flip images digitally), and diminished. To take a closer photo (macro photography), the camera's lens is physically extended — increasing $v$ so closer objects can be in focus.",
      explanation: "Camera optics is a direct application of the lens formula. The film position determines how far away objects must be for sharp focus.",
      points: 25
    },
    {
      id: "t6q35",
      type: "thinking",
      question: "A simple compound microscope uses two convex lenses: an objective (f = 0.4 cm, closer to object) and an eyepiece (f = 2.5 cm). The object is placed 0.5 cm from the objective. If the final image is at infinity (normal adjustment), find: (a) Position of image from objective. (b) Power of objective lens. (c) Why does a microscope need two lenses instead of one?",
      correctAnswer: "(a) Objective lens: $u = -0.5$ cm, $f = +0.4$ cm.\n$1/v = 1/f + 1/u = 1/0.4 + 1/(-0.5) = 2.5 - 2 = 0.5$.\n$v = 2$ cm from objective lens.\nThe intermediate image is 2 cm from the objective on the other side.\n\n(b) Power of objective: $P = 1/f = 1/0.004$ m $= 250$ D. (Very high power — extremely curved short-focal-length lens).\n\n(c) Why two lenses:\nA single lens of equivalent magnification would have an extremely short focal length (fraction of mm) and an extremely tiny aperture, making it physically impractical. Instead:\n• Objective (short f): creates a magnified REAL intermediate image.\n• Eyepiece (longer f): acts as a magnifying glass to view that intermediate image.\n• Combined magnification = (magnification by objective) × (angular magnification by eyepiece).\nThis two-stage design achieves very high magnifications (100× to 1000×) with practical-sized lenses.",
      explanation: "Compound microscope design = objective (creates real magnified image) × eyepiece (magnifies that image). Two-stage amplification is why it's so powerful.",
      points: 25
    }
  ]
};
