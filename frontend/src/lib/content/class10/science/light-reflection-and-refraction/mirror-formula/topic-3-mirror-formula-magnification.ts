/**
 * FILE: topic-3-mirror-formula-magnification.ts
 * LOCATION: src/lib/content/class10/science/light-reflection-and-refraction/mirror-formula/topic-3-mirror-formula-magnification.ts
 * PURPOSE: Detailed study of the mirror formula, magnification, and the New Cartesian Sign Convention.
 * LAST UPDATED: 2026-06-08
 */

import { Topic } from "../../shared-types";

export const topic3MirrorFormulaMagnification: Topic = {
  id: "mirror-formula-magnification",
  title: "3. Sign Convention, Mirror Formula, and Magnification",
  estimatedMinutes: 50,
  simulationIds: [
    "light-sign-convention",
    "light-mirror-formula-calc",
    "light-magnification-demo",
    "light-mirror-ray-builder",
  ],
  imageUrl: "/images/light/topic3-mirror-formula.png",
  content: `
### New Cartesian Sign Convention

To deal with the numerical problems related to spherical mirrors, we use a set of rules known as the **New Cartesian Sign Convention**. In this convention, the pole ($P$) of the mirror is taken as the origin, and the principal axis is taken as the x-axis of the coordinate system.

**The rules are as follows:**
1.  **Object Position:** The object is always placed to the left of the mirror. This implies that light from the object falls on the mirror from the left-hand side.
2.  **Origin:** All distances parallel to the principal axis are measured from the pole of the mirror.
3.  **Direction of Incident Light:** Distances measured in the direction of incident light (along the positive x-axis, to the right of the pole) are taken as **positive**.
4.  **Opposite to Incident Light:** Distances measured against the direction of incident light (along the negative x-axis, to the left of the pole) are taken as **negative**.
5.  **Heights Upwards:** Distances measured upwards and perpendicular to the principal axis (along the positive y-axis) are taken as **positive**.
6.  **Heights Downwards:** Distances measured downwards and perpendicular to the principal axis (along the negative y-axis) are taken as **negative**.

**Important Implications:**
*   Object distance ($u$) is **always negative**.
*   Focal length ($f$) of a **concave mirror is negative**.
*   Focal length ($f$) of a **convex mirror is positive**.

---

### Mirror Formula

The mirror formula is a mathematical relationship connecting object distance ($u$), image distance ($v$), and focal length ($f$) of a spherical mirror.

It is expressed as:
$$ \\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f} $$

Where:
*   $v =$ distance of the image from the pole
*   $u =$ distance of the object from the pole
*   $f =$ focal length of the mirror

This formula is valid in all situations for all spherical mirrors, provided the sign convention is applied correctly to the values substituted into the formula.

---

### Magnification ($m$)

Magnification produced by a spherical mirror gives the relative extent to which the image of an object is magnified with respect to the object size. It is defined as the ratio of the height of the image ($h'$) to the height of the object ($h$).

$$ m = \\frac{\\text{Height of the image } (h')}{\\text{Height of the object } (h)} $$
$$ m = \\frac{h'}{h} $$

Magnification is also related to the object distance ($u$) and image distance ($v$). It can be expressed as:
$$ m = - \\frac{v}{u} $$

Combining the two:
$$ m = \\frac{h'}{h} = - \\frac{v}{u} $$

**Interpreting Magnification:**
*   If $m$ is **negative**, the image is **real and inverted**.
*   If $m$ is **positive**, the image is **virtual and erect**.
*   If $|m| = 1$, the image is the **same size** as the object.
*   If $|m| > 1$, the image is **enlarged** (magnified).
*   If $|m| < 1$, the image is **diminished**.

---
### Exam Summary

#### 📌 New Cartesian Sign Convention (NCERT rules — must memorize)
*   All distances are measured from the **Pole** (origin).
*   Distances measured in the **direction of incident light** (left to right) → **Positive**.
*   Distances measured **against** incident light → **Negative**.
*   Heights measured **upward** → Positive. Heights measured **downward** → Negative.
*   **Object is always placed to the left**: so $u$ is always **Negative** ($u < 0$).

#### 📐 Sign of $f$ by Mirror Type
| Mirror | Focal Length $f$ | Reason |
|---|---|---|
| Concave | Negative ($f < 0$) | Focus is in front of mirror (real focus, opposite to incident light direction) |
| Convex  | Positive ($f > 0$) | Focus is behind mirror (virtual focus, same side as incident light direction) |

#### 🔑 The Two Key Formulas
$$\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f} \\quad \\text{(Mirror Formula)}$$
$$m = \\frac{h'}{h} = -\\frac{v}{u} \\quad \\text{(Magnification)}$$

#### 🧮 Interpreting Magnification ($m$)
| Value of $m$ | Meaning |
|---|---|
| $m < 0$ (negative) | Real and inverted image |
| $m > 0$ (positive) | Virtual and erect image |
| $\\|m\\| > 1$ | Image is enlarged |
| $\\|m\\| < 1$ | Image is diminished |
| $\\|m\\| = 1$ | Image is same size as object |

#### ⚠️ Common Mistakes in Numericals
*   Forgetting to put a **negative sign** on $u$ (object distance is always negative for real objects).
*   Using $f$ without the correct sign — for concave mirror, $f = -15$ cm, NOT $+15$ cm.
*   Confusing the mirror formula with the **lens formula** ($1/v - 1/u = 1/f$ for lenses vs. $1/v + 1/u = 1/f$ for mirrors).

#### 🧪 Step-by-Step Numerical Method
1. List known values with correct signs ($u$, $f$ or $v$).
2. Apply $1/f = 1/v + 1/u$; substitute and solve for unknown.
3. Calculate $m = -v/u$; interpret sign for nature of image.
4. State whether image is real/virtual, erect/inverted, enlarged/diminished.
`,
  questions: [
    // --- MCQ ---
    {
      id: "t3q1",
      type: "mcq",
      question: "According to the New Cartesian Sign Convention, the focal length of a convex mirror is:",
      options: [
        "Always positive",
        "Always negative",
        "Positive or negative depending on object position",
        "Zero"
      ],
      correctAnswer: "Always positive",
      explanation: "For a convex mirror, the principal focus lies behind the mirror (to the right of the pole). Distances measured to the right are taken as positive.",
      points: 10
    },
    {
      id: "t3q2",
      type: "mcq",
      question: "If the magnification produced by a mirror is -1, what does this indicate about the image?",
      options: [
        "Real, inverted, and same size as object",
        "Virtual, erect, and same size as object",
        "Real, inverted, and diminished",
        "Virtual, erect, and enlarged"
      ],
      correctAnswer: "Real, inverted, and same size as object",
      explanation: "A negative sign indicates the image is real and inverted. A magnitude of 1 ($|m|=1$) indicates the image is the same size as the object.",
      points: 10
    },
    {
      id: "t3q3",
      type: "mcq",
      question: "Which of the following formulas correctly relates object distance ($u$), image distance ($v$), and focal length ($f$) for spherical mirrors?",
      options: [
        "$1/v - 1/u = 1/f$",
        "$1/u + 1/f = 1/v$",
        "$1/v + 1/u = 1/f$",
        "$v + u = f$"
      ],
      correctAnswer: "$1/v + 1/u = 1/f$",
      explanation: "This is the standard mirror formula.",
      points: 10
    },
    {
      id: "t3q4",
      type: "mcq",
      question: "If an object is placed 20 cm in front of a concave mirror of focal length 15 cm, what will be the sign of the image distance ($v$)?",
      options: [
        "Positive",
        "Negative",
        "Zero",
        "Cannot be determined"
      ],
      correctAnswer: "Negative",
      explanation: "Since $f=-15$ and $u=-20$, the object is between $C$ (-30) and $F$ (-15). The image is formed beyond $C$, on the same side as the object (left side). Hence, $v$ will be negative.",
      points: 10
    },
    {
      id: "t3q5",
      type: "mcq",
      question: "For a plane mirror, what is the value of magnification ($m$)?",
      options: [
        "$m = -1$",
        "$m = +1$",
        "$m = 0$",
        "$m = \\infty$"
      ],
      correctAnswer: "$m = +1$",
      explanation: "A plane mirror forms an image of the same size ($|m|=1$) that is virtual and erect ($m$ is positive).",
      points: 10
    },

    // --- Short Answer ---
    {
      id: "t3q6",
      type: "short",
      question: "State the rule for measuring distances parallel to the principal axis in the New Cartesian Sign Convention.",
      correctAnswer: "All distances parallel to the principal axis are measured from the pole of the mirror, which is taken as the origin (0,0).",
      explanation: "The pole is the fundamental reference point for all horizontal measurements.",
      points: 15
    },
    {
      id: "t3q7",
      type: "short",
      question: "Why is the object distance ($u$) always taken as negative for spherical mirrors?",
      correctAnswer: "By convention, the object is always placed to the left of the mirror. Distances measured to the left of the pole (against the direction of incident light) are taken as negative.",
      explanation: "This standardizes calculations so light always travels from left to right across the coordinate system.",
      points: 15
    },
    {
      id: "t3q8",
      type: "short",
      question: "Define magnification produced by a mirror in terms of heights.",
      correctAnswer: "Magnification is defined as the ratio of the height of the image ($h'$) to the height of the object ($h$). $m = h'/h$.",
      explanation: "This definition relates the physical sizes of the object and image.",
      points: 15
    },
    {
      id: "t3q9",
      type: "short",
      question: "A mirror produces a magnification of $+0.5$. What is the nature and relative size of the image?",
      correctAnswer: "The positive sign means the image is virtual and erect. The magnitude $0.5$ (which is less than 1) means the image is diminished (half the size of the object).",
      explanation: "Positive $m$ = Virtual/Erect. $|m| < 1$ = Diminished.",
      points: 15
    },
    {
      id: "t3q10",
      type: "short",
      question: "Write down the expression relating magnification to object distance and image distance for mirrors.",
      correctAnswer: "Magnification ($m$) is equal to the negative ratio of image distance ($v$) to object distance ($u$). $m = -v/u$.",
      explanation: "This relation is crucial for solving numerical problems when heights are not given.",
      points: 15
    },

    // --- Long Answer ---
    {
      id: "t3q11",
      type: "long",
      question: "An object 5.0 cm in length is placed at a distance of 20 cm in front of a convex mirror of radius of curvature 30 cm. Find the position of the image, its nature, and its size.",
      correctAnswer: "Radius of curvature $R = +30 \\text{ cm}$ (convex mirror). Focal length $f = R/2 = +15 \\text{ cm}$.\nObject distance $u = -20 \\text{ cm}$. Object height $h = +5.0 \\text{ cm}$.\nUsing mirror formula: $1/v + 1/u = 1/f$\n$1/v = 1/f - 1/u = 1/15 - 1/(-20) = 1/15 + 1/20 = (4+3)/60 = 7/60$.\n$v = +60/7 \\approx +8.57 \\text{ cm}$.\nPosition: $8.57 \\text{ cm}$ behind the mirror.\nNature: Virtual and erect (since $v$ is positive).\nMagnification $m = -v/u = -(60/7) / (-20) = 3/7$.\nSize of image $h' = m \\times h = (3/7) \\times 5.0 = 15/7 \\approx +2.14 \\text{ cm}$.",
      explanation: "This is a standard numerical applying the mirror formula and magnification formula with the correct sign convention.",
      points: 20
    },
    {
      id: "t3q12",
      type: "long",
      question: "A concave mirror produces three times magnified (enlarged) real image of an object placed at 10 cm in front of it. Where is the image located?",
      correctAnswer: "Since the image is real, the magnification $m$ is negative. So, $m = -3$.\nObject distance $u = -10 \\text{ cm}$.\nWe know $m = -v/u$.\n$-3 = -v / (-10)$\n$-3 = v / 10$\n$v = -30 \\text{ cm}$.\nThe image is located 30 cm in front of the mirror.",
      explanation: "Real image means $m$ is negative. The negative $v$ confirms the image is formed on the same side as the object.",
      points: 20
    },
    {
      id: "t3q13",
      type: "long",
      question: "Explain the New Cartesian Sign Convention for spherical mirrors with the help of a labeled diagram (describe the diagram).",
      correctAnswer: "1. The pole ($P$) of the mirror is taken as the origin (0,0).\n2. The principal axis is taken as the X-axis ($X'X$).\n3. The object is placed to the left of the mirror. Incident light travels from left to right (positive X direction).\n4. Distances measured to the right of $P$ (+x direction) are positive.\n5. Distances measured to the left of $P$ (-x direction) are negative.\n6. Heights measured upwards (+y direction) above the principal axis are positive.\n7. Heights measured downwards (-y direction) below the principal axis are negative.",
      explanation: "Understanding this convention is the prerequisite for all optical calculations.",
      points: 20
    },
    {
      id: "t3q14",
      type: "long",
      question: "An object is placed at a distance of 15 cm from a concave mirror of focal length 10 cm. Find the position, nature, and magnification of the image.",
      correctAnswer: "Focal length of concave mirror, $f = -10 \\text{ cm}$.\nObject distance, $u = -15 \\text{ cm}$.\nUsing mirror formula: $1/v + 1/u = 1/f \\implies 1/v = 1/f - 1/u = 1/(-10) - 1/(-15) = -1/10 + 1/15 = (-3+2)/30 = -1/30$.\nSo, $v = -30 \\text{ cm}$.\nPosition: 30 cm in front of the mirror.\nNature: Real and inverted (since $v$ is negative).\nMagnification $m = -v/u = -(-30)/(-15) = -2$.\nThe image is real, inverted, and twice the size of the object.",
      explanation: "Calculation verifies the case where object is between F and C; image forms beyond C and is enlarged.",
      points: 20
    },
    {
      id: "t3q15",
      type: "long",
      question: "Calculate the focal length of a mirror which forms an erect image of height 4 cm of an object of height 1 cm placed 20 cm away from the mirror. State the type of mirror.",
      correctAnswer: "Image is erect, so $m$ is positive. $h' = +4 \\text{ cm}$, $h = +1 \\text{ cm}$.\n$m = h'/h = 4/1 = +4$.\nObject distance $u = -20 \\text{ cm}$.\n$m = -v/u \\implies 4 = -v/(-20) \\implies v = +80 \\text{ cm}$.\nUsing mirror formula: $1/f = 1/v + 1/u = 1/80 + 1/(-20) = 1/80 - 4/80 = -3/80$.\n$f = -80/3 = -26.67 \\text{ cm}$.\nSince the focal length is negative, it is a concave mirror.",
      explanation: "Only a concave mirror can form an *enlarged* erect image. Convex mirrors only form *diminished* erect images.",
      points: 20
    },

    // --- HOTS ---
    {
      id: "t3q16",
      type: "thinking",
      question: "A student finds that the magnification produced by a mirror is $+1/3$. Can you determine if the mirror is concave or convex? Justify your answer.",
      correctAnswer: "The mirror is convex.\nJustification: The magnification is positive, which means the image is virtual and erect. Both concave and convex mirrors can form virtual/erect images. However, the magnification magnitude is less than 1 ($1/3$), meaning the image is diminished. A concave mirror's virtual image is always enlarged ($m > 1$). Only a convex mirror always produces a virtual, erect, and diminished image ($0 < m < 1$).",
      explanation: "This requires synthesizing the rules for magnification signs and magnitudes with the specific image formation cases of both mirrors.",
      points: 25
    },
    {
      id: "t3q17",
      type: "thinking",
      question: "A driver looks in his rear-view mirror (focal length = 2 m) and sees a truck 10 m behind him. What is the magnification of the truck? If the truck is moving at 5 m/s towards the driver, will the image in the mirror move at a constant speed?",
      correctAnswer: "Rear-view mirror is convex, so $f = +2 \\text{ m}$. $u = -10 \\text{ m}$.\n$1/v = 1/f - 1/u = 1/2 - 1/(-10) = 5/10 + 1/10 = 6/10$.\n$v = 10/6 = 1.67 \\text{ m}$.\nMagnification $m = -v/u = -(10/6) / (-10) = +1/6$.\nThe image does NOT move at a constant speed. The relationship between $v$ and $u$ is non-linear ($1/v = 1/f - 1/u$). As the truck ($u$) approaches at a constant speed, the speed of the image ($v$) increases. The image appears to accelerate.",
      explanation: "Differentiating the mirror formula with respect to time ($dv/dt = -(v/u)^2 \\cdot du/dt$) shows that image velocity depends on the square of magnification, which changes as the object moves.",
      points: 25
    },
    {
      id: "t3q18",
      type: "thinking",
      question: "Prove mathematically that the virtual image formed by a convex mirror is always formed between the pole and the principal focus.",
      correctAnswer: "For a convex mirror, $f > 0$. The object is placed in front of the mirror, so $u < 0$ (let $u = -x$, where $x > 0$).\nMirror formula: $1/v + 1/u = 1/f \\implies 1/v = 1/f - 1/u = 1/f - 1/(-x) = 1/f + 1/x$.\nSince both $f$ and $x$ are positive, $1/f + 1/x > 1/f$.\nTherefore, $1/v > 1/f$, which means $v < f$.\nAlso, since $1/f + 1/x$ is positive, $v$ must be positive ($v > 0$).\nThus, $0 < v < f$. The image distance is positive and less than the focal length, meaning the image always forms between the pole and the focus.",
      explanation: "Using algebraic inequalities to prove geometric optical properties is a hallmark of higher-order thinking in physics.",
      points: 25
    },
    {
      id: "t3q19",
      type: "thinking",
      question: "Is it possible for a concave mirror to have a magnification of exactly $-1$? If so, where must the object be placed, and what are the coordinates of the image?",
      correctAnswer: "Yes, it is possible.\nA magnification of $-1$ means $m = -v/u = -1 \\implies v = u$.\nUsing the mirror formula: $1/v + 1/u = 1/f \\implies 1/u + 1/u = 1/f \\implies 2/u = 1/f \\implies u = 2f$.\nSince $R = 2f$, this means the object is placed at the center of curvature ($C$).\nThe coordinates of the image will be exactly the same as the coordinates of the object on the x-axis, but inverted on the y-axis. (If object is at $(2f, h)$, image is at $(2f, -h)$).",
      explanation: "This mathematically derives the specific case of object at C, proving that $u=v$ and the image is inverted and same size.",
      points: 25
    },
    {
      id: "t3q20",
      type: "thinking",
      question: "An object is placed at $u = f$ for a concave mirror. Using the mirror formula, determine the value of magnification. What is the physical interpretation of this result?",
      correctAnswer: "For a concave mirror, let $f = -x$ ($x > 0$). The object is at the focus, so $u = -x$.\nMirror formula: $1/v + 1/(-x) = 1/(-x) \\implies 1/v = 0$.\nTherefore, $v = \\infty$.\nMagnification $m = -v/u = -(\\infty) / (-x) = \\infty$.\nThe physical interpretation is that the reflected rays are perfectly parallel and never intersect in finite space. The image is formed at infinity and is infinitely large.",
      explanation: "Applying the limits of the formula ($1/0 = \\infty$) aligns with the geometric ray diagram where rays emerging from the focus become parallel after reflection.",
      points: 25
    },

    // ═══════════════════════════════════════════════════
    // ADDITIONAL QUESTIONS — Set 2 (t3q21 to t3q35)
    // ═══════════════════════════════════════════════════

    // --- MCQ Set 2 ---
    {
      id: "t3q21",
      type: "mcq",
      question: "In the New Cartesian Sign Convention for mirrors, distances measured in the direction of incident light are taken as:",
      options: [
        "Negative",
        "Positive",
        "Zero",
        "Depends on mirror type"
      ],
      correctAnswer: "Positive",
      explanation: "In the New Cartesian Convention: incident light travels from left to right. Distances measured in the direction of incident light (left to right, i.e., behind the mirror for reflected rays) are positive. Object is always on the left, so $u$ is negative. For a real image (in front of mirror), $v$ is also negative.",
      points: 10
    },
    {
      id: "t3q22",
      type: "mcq",
      question: "For a concave mirror of focal length $-15$ cm, an object is placed at $u = -10$ cm. Using the mirror formula, the image distance $v$ is:",
      options: [
        "$-30$ cm",
        "$+30$ cm",
        "$-6$ cm",
        "$+6$ cm"
      ],
      correctAnswer: "$+30$ cm",
      explanation: "Mirror formula: $1/v + 1/u = 1/f \\implies 1/v = 1/f - 1/u = 1/(-15) - 1/(-10) = -1/15 + 1/10 = -2/30 + 3/30 = 1/30$. So $v = +30$ cm. Positive $v$ means the image is behind the mirror — it is virtual.",
      points: 10
    },
    {
      id: "t3q23",
      type: "mcq",
      question: "A concave mirror produces a real, inverted image of magnification $-3$. If the object is 8 cm from the mirror, where is the image?",
      options: [
        "8 cm in front",
        "24 cm behind the mirror",
        "24 cm in front of the mirror",
        "6 cm in front"
      ],
      correctAnswer: "24 cm in front of the mirror",
      explanation: "$m = -v/u \\implies -3 = -v/(-8) \\implies -3 = v/8 \\implies v = -24$ cm. Negative $v$ means the image is 24 cm in front of the mirror (real image). The negative magnification confirms it is real and inverted.",
      points: 10
    },
    {
      id: "t3q24",
      type: "mcq",
      question: "What is the magnification produced by a plane mirror?",
      options: [
        "+2",
        "$-1$",
        "$+1$",
        "0"
      ],
      correctAnswer: "$+1$",
      explanation: "For a plane mirror, the image has the same size as the object ($h_i = h_o$) and is erect (same orientation). Therefore, magnification $m = +h_i/h_o = +1$. The positive sign confirms it is virtual and erect.",
      points: 10
    },
    {
      id: "t3q25",
      type: "mcq",
      question: "The focal length of a concave mirror is $-20$ cm. An object is placed at $u = -30$ cm. Using the mirror formula, the focal length of the image is at $v = $ _____.",
      options: [
        "$-60$ cm",
        "$+60$ cm",
        "$-12$ cm",
        "$+20$ cm"
      ],
      correctAnswer: "$-60$ cm",
      explanation: "$1/v = 1/f - 1/u = 1/(-20) - 1/(-30) = -1/20 + 1/30 = -3/60 + 2/60 = -1/60$. So $v = -60$ cm. The negative sign means the image is 60 cm in front of the mirror, i.e., real.",
      points: 10
    },

    // --- Short Answer Set 2 ---
    {
      id: "t3q26",
      type: "short",
      question: "Write the mirror formula. Define each symbol with its sign convention for a concave mirror forming a real image.",
      correctAnswer: "Mirror Formula: $\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$\n\nFor a concave mirror forming a real image:\n• $f$ = focal length: NEGATIVE (focus is in front of the mirror)\n• $u$ = object distance: NEGATIVE (object is always in front, i.e., to the left)\n• $v$ = image distance: NEGATIVE (real image is in front of the mirror)",
      explanation: "For a concave mirror, all three quantities (f, u, and v for real image) are negative. Only v is positive for a virtual image (object between P and F).",
      points: 15
    },
    {
      id: "t3q27",
      type: "short",
      question: "A magnification of $m = -1/2$ is produced by a mirror. Is the mirror concave or convex? Is the image real or virtual? Is it magnified or diminished?",
      correctAnswer: "• The magnification is negative ($m < 0$), which means the image is REAL and INVERTED.\n• $|m| = 1/2 < 1$, which means the image is DIMINISHED (smaller than the object).\n• A real image is only possible with a concave mirror (convex mirrors always form virtual images).\n• Therefore, it is a CONCAVE mirror.\n• Real, inverted, diminished images from a concave mirror occur when the object is beyond the center of curvature (C).",
      explanation: "Remember: negative $m$ → real + inverted. $|m| < 1$ → diminished. Only concave mirrors form real images.",
      points: 15
    },
    {
      id: "t3q28",
      type: "short",
      question: "An object is placed 30 cm in front of a concave mirror of focal length 20 cm. Calculate the position of the image and state whether it is real or virtual.",
      correctAnswer: "$u = -30$ cm, $f = -20$ cm.\nMirror formula: $1/v = 1/f - 1/u = -1/20 - (-1/30) = -1/20 + 1/30 = -3/60 + 2/60 = -1/60$.\n$v = -60$ cm.\nThe image is 60 cm in front of the mirror. Negative $v$ → real image.",
      explanation: "Standard mirror formula calculation. Object beyond C (30 > 2×20 is false; 30 > 20 = between C and F, wait: f=20, C=40, so 30 is between F and C). Image beyond C at 60 cm.",
      points: 15
    },
    {
      id: "t3q29",
      type: "short",
      question: "Define linear magnification for a mirror. When is it positive and when is it negative?",
      correctAnswer: "Linear magnification: $m = \\frac{\\text{Height of image } (h_i)}{\\text{Height of object } (h_o)} = \\frac{-v}{u}$\n\n• Positive magnification ($m > 0$): The image is virtual and erect (same orientation as object). This happens when the image is behind the mirror.\n• Negative magnification ($m < 0$): The image is real and inverted. This happens when the image is in front of the mirror.",
      explanation: "The sign of magnification directly tells you image orientation and nature. Learn: positive → virtual+erect, negative → real+inverted.",
      points: 15
    },
    {
      id: "t3q30",
      type: "short",
      question: "An erect image 3 times the size of the object is formed 18 cm behind a mirror. What type of mirror is it, and what is its focal length?",
      correctAnswer: "Image is erect and magnified → virtual image. Virtual images behind the mirror have $v > 0$, so $v = +18$ cm. Magnification is $+3$ (positive for erect), so $m = -v/u \\implies 3 = -18/u \\implies u = -6$ cm.\nMirror formula: $1/f = 1/v + 1/u = 1/18 + 1/(-6) = 1/18 - 3/18 = -2/18 = -1/9$.\n$f = -9$ cm (negative → concave mirror). It is a CONCAVE mirror with focal length 9 cm.",
      explanation: "Erect + magnified + behind mirror = virtual image from a concave mirror (object between P and F).",
      points: 15
    },

    // --- Long Answer Set 2 ---
    {
      id: "t3q31",
      type: "long",
      question: "A 2-cm tall object is placed perpendicular to the principal axis of a concave mirror. The object is at 12 cm from the mirror, and the focal length is 8 cm. Find: (a) Position of image, (b) Height of image, (c) Nature of image.",
      correctAnswer: "Given: $h_o = 2$ cm, $u = -12$ cm, $f = -8$ cm.\n\n(a) Mirror formula:\n$1/v = 1/f - 1/u = 1/(-8) - 1/(-12) = -1/8 + 1/12 = -3/24 + 2/24 = -1/24$\n$v = -24$ cm.\nImage is 24 cm in front of the mirror.\n\n(b) Magnification:\n$m = -v/u = -(-24)/(-12) = -24/12 = -2$\n$h_i = m \\times h_o = -2 \\times 2 = -4$ cm.\nImage is 4 cm tall. Negative sign → inverted.\n\n(c) Nature:\n• $v$ is negative → Real (in front of mirror)\n• $m$ is negative → Inverted\n• $|m| = 2 > 1$ → Magnified\n→ Real, Inverted, and Magnified image, 24 cm in front.",
      explanation: "Full 5-step solution: given → formula application → v → m → height → nature. Always interpret signs.",
      points: 20
    },
    {
      id: "t3q32",
      type: "long",
      question: "Explain the New Cartesian Sign Convention for mirrors. How does it help in solving problems systematically? Give one example of how wrong sign usage leads to an incorrect answer.",
      correctAnswer: "New Cartesian Sign Convention:\n1. All distances are measured from the pole (P) of the mirror.\n2. Distances measured in the direction of incident light (left to right, i.e., behind the mirror) are POSITIVE.\n3. Distances measured opposite to the direction of incident light (in front of the mirror) are NEGATIVE.\n4. Heights above the principal axis are POSITIVE.\n5. Heights below the principal axis are NEGATIVE.\n\nKey consequences:\n• Object distance ($u$) is always NEGATIVE (object in front of mirror).\n• Focal length of concave mirror ($f$) is NEGATIVE (focus in front).\n• Focal length of convex mirror ($f$) is POSITIVE (focus behind mirror).\n• Real image: $v$ is NEGATIVE. Virtual image: $v$ is POSITIVE.\n\nWhy it helps: It eliminates ambiguity — you never need to guess direction. The sign tells you everything.\n\nError Example: If a student incorrectly takes $u = +20$ cm instead of $-20$ cm for a concave mirror of $f = -15$ cm:\n$1/v = -1/15 - 1/20 = -4/60 - 3/60 = -7/60 \\implies v = -8.57$ cm.\nCorrect answer: $1/v = -1/15 + 1/20 = -4/60 + 3/60 = -1/60 \\implies v = -60$ cm.\nThe sign error gives a completely wrong position!",
      explanation: "Sign convention is not optional — it is the foundation of all optics calculations. One wrong sign can flip the entire answer.",
      points: 20
    },
    {
      id: "t3q33",
      type: "long",
      question: "Describe how the image formed by a concave mirror changes as an object is moved continuously from infinity to the pole. Include position, size, and nature at each key position.",
      correctAnswer: "As object moves from infinity to pole of a concave mirror:\n\n1. Object at INFINITY → Image at F; Real, inverted, point-sized (highly diminished).\n2. Object beyond C (>2f) → Image between F and C; Real, inverted, diminished (|m| < 1).\n3. Object AT C (=2f) → Image at C; Real, inverted, same size (m = -1).\n4. Object between F and C → Image beyond C; Real, inverted, magnified (|m| > 1).\n5. Object AT F → Image at infinity; Real, inverted, infinitely large.\n6. Object between F and P (<f) → Image behind mirror; Virtual, erect, magnified (m > +1).\n\nSummary pattern:\n• Moving from ∞ towards F: image moves from F towards C (real, getting bigger)\n• Moving from F towards P: image jumps to behind mirror and is virtual+erect",
      explanation: "This comprehensive table covers all 6 object positions for a concave mirror — a guaranteed exam question. Memorize the jump at F.",
      points: 20
    },

    // --- HOTS Set 2 ---
    {
      id: "t3q34",
      type: "thinking",
      question: "A doctor uses a concave mirror of focal length 2 cm to examine a patient's eye. If the eye is 3 cm from the mirror, find the position and magnification of the image. Is this image suitable for examination? Explain.",
      correctAnswer: "Given: $f = -2$ cm, $u = -3$ cm.\nMirror formula: $1/v = 1/f - 1/u = 1/(-2) - 1/(-3) = -1/2 + 1/3 = -3/6 + 2/6 = -1/6$.\n$v = +6$ cm (positive → behind the mirror).\n\nMagnification: $m = -v/u = -(+6)/(-3) = +2$.\n\nThe image is virtual (behind mirror), erect, and MAGNIFIED by 2 times.\n\nSuitability: YES, this is ideal for examination. The doctor sees a magnified, erect, virtual image of the patient's eye. The virtual image appears to be 6 cm behind the mirror, and since it is magnified × 2, fine details like blood vessels, iris, and pupil are much easier to examine.",
      explanation: "Object between P and F of concave mirror → virtual, erect, magnified image. This is why concave mirrors are used in medical examination tools.",
      points: 25
    },
    {
      id: "t3q35",
      type: "thinking",
      question: "You are given two concave mirrors A and B with focal lengths $f_A = 10$ cm and $f_B = 20$ cm. An object is placed at 30 cm in front of each. Compare the image positions and magnifications for mirrors A and B. What does this tell you about how focal length affects image properties?",
      correctAnswer: "Mirror A ($f = -10$ cm, $u = -30$ cm):\n$1/v_A = -1/10 + 1/30 = -3/30 + 1/30 = -2/30 \\implies v_A = -15$ cm.\n$m_A = -(-15)/(-30) = -0.5$. Image: real, inverted, at 15 cm, half the object size.\n\nMirror B ($f = -20$ cm, $u = -30$ cm):\n$1/v_B = -1/20 + 1/30 = -3/60 + 2/60 = -1/60 \\implies v_B = -60$ cm.\n$m_B = -(-60)/(-30) = -2$. Image: real, inverted, at 60 cm, twice the object size.\n\nConclusion: A longer focal length (Mirror B) places the image farther away and magnifies more for the same object distance. A shorter focal length (Mirror A) gives a closer, less magnified image. This is why cameras need different focal length lenses for telephoto vs wide-angle shots.",
      explanation: "Comparing two mirrors reveals the fundamental trade-off: longer focal length = more magnification + farther image = telephoto behavior.",
      points: 25
    },

    /* ── Additional Questions Set 3 (t3q36 to t3q50) ── */

    /* MCQ Set 3 */
    {
      id: "t3q36",
      type: "mcq",
      question: "An object is placed at u = −10 cm from a concave mirror of f = −15 cm. The image is:",
      options: [
        "Real, inverted at 30 cm in front",
        "Virtual, erect at 30 cm behind the mirror",
        "At infinity",
        "Real, inverted at 6 cm in front"
      ],
      correctAnswer: "Virtual, erect at 30 cm behind the mirror",
      explanation: "Object between P and F (u < f). 1/v = 1/(−15) − 1/(−10) = −2/30 + 3/30 = 1/30. v = +30 cm (positive → behind mirror = virtual). m = −30/(−10) = +3 (positive = erect, |m| > 1 = magnified). Virtual, erect, 3× magnified at 30 cm behind mirror.",
      points: 10
    },
    {
      id: "t3q37",
      type: "mcq",
      question: "If the magnification produced by a spherical mirror is +1, the image is:",
      options: [
        "Real, inverted, same size",
        "Virtual, erect, same size — mirror must be plane",
        "Virtual, erect, at the pole",
        "Real, inverted, at the pole"
      ],
      correctAnswer: "Virtual, erect, same size — mirror must be plane",
      explanation: "m = +1 means image is erect (positive) and same size (|m| = 1). For a spherical concave mirror, m = −1 (real, inverted, same size at C). m = +1 for a spherical mirror only occurs conceptually at u = 0, which is trivial. In practice, m = +1 consistently describes a PLANE mirror image: virtual, erect, same size for all object distances.",
      points: 10
    },
    {
      id: "t3q38",
      type: "mcq",
      question: "A concave mirror produces a real image 5 times magnified. Magnification m =",
      options: ["+5", "−5", "+1/5", "−1/5"],
      correctAnswer: "−5",
      explanation: "A real image in a mirror always has NEGATIVE magnification (m < 0). The image is 5 times larger, so |m| = 5. Therefore m = −5. If m were +5, it would indicate a virtual, erect image, which would be formed only if the object is between P and F of a concave mirror.",
      points: 10
    },
    {
      id: "t3q39",
      type: "mcq",
      question: "For a concave mirror, when the object is at 2f, the image distance v equals:",
      options: ["f", "2f", "3f", "∞"],
      correctAnswer: "2f",
      explanation: "Object at 2f means u = −2f. Mirror formula: 1/v = 1/f − 1/(−2f) = 1/f + 1/2f — Wait: 1/v + 1/u = 1/f → 1/v = 1/f − 1/u = 1/(−f) − 1/(−2f) = −1/f + 1/(2f) = −1/(2f). So v = −2f. Image is at 2f in front (same as u = 2f). Real, inverted, same size.",
      points: 10
    },
    {
      id: "t3q40",
      type: "mcq",
      question: "A person's face is 25 cm from a concave shaving mirror. The mirror produces a virtual image behind the mirror. If m = +3, how far is the image behind the mirror?",
      options: ["75 cm", "25 cm", "8.3 cm", "50 cm"],
      correctAnswer: "75 cm",
      explanation: "m = −v/u → +3 = −v/(−25) → 3 = v/25 → v = +75 cm. The image is 75 cm behind the mirror (positive v = behind mirror = virtual). This large virtual magnified image makes shaving mirrors so effective.",
      points: 10
    },

    /* Short Answer Set 3 */
    {
      id: "t3q41",
      type: "short",
      question: "A concave mirror has radius of curvature 30 cm. An object is placed 45 cm in front. Find (a) image distance (b) magnification.",
      options: [],
      correctAnswer: "R = 30 cm → f = R/2 = 15 cm → f = −15 cm (concave).\nu = −45 cm.\n\n(a) 1/v = 1/(−15) − 1/(−45) = −3/45 + 1/45 = −2/45.\nv = −22.5 cm. Image is 22.5 cm in front of mirror (real).\n\n(b) m = −v/u = −(−22.5)/(−45) = −0.5.\nImage is real, inverted, and half the size of the object.",
      explanation: "R = 2f is the key relationship. With the negative sign applied correctly, the formula gives a negative v (real image) and negative m (inverted) automatically.",
      points: 15
    },
    {
      id: "t3q42",
      type: "short",
      question: "In what way does the sign of the image distance (v) tell you whether the image in a mirror is real or virtual?",
      options: [],
      correctAnswer: "For MIRRORS (unlike lenses):\n• Negative v: Image is in FRONT of the mirror (same side as object) → image is REAL. Real light rays actually converge here — the image can be projected on a screen.\n• Positive v: Image is BEHIND the mirror (opposite side from object) → image is VIRTUAL. No real light passes through this point; the image exists only as an apparent intersection of extended rays.\n\nKey rule: Real image in mirror → v negative. Virtual image in mirror → v positive.",
      explanation: "This sign interpretation for mirrors is critical and must be memorized. Note: for lenses, the convention is reversed (positive v = real image).",
      points: 15
    },
    {
      id: "t3q43",
      type: "short",
      question: "A convex mirror of focal length 20 cm gives an image that is 1/4 the size of the object. How far is the object from the mirror?",
      options: [],
      correctAnswer: "f = +20 cm (convex). Convex always gives virtual erect image → m = +1/4.\nm = −v/u → +1/4 = −v/u → v = −u/4.\n(v is positive for convex mirror, so: v = +|u|/4, meaning u/4 in magnitude).\n\nLet u = −d (negative, object in front).\nm = −v/u → 1/4 = −v/(−d) → v = +d/4.\n\nMirror formula: 1/v + 1/u = 1/f\n1/(d/4) + 1/(−d) = 1/20\n4/d − 1/d = 1/20\n3/d = 1/20\nd = 60 cm.\nObject is 60 cm in front of the mirror.",
      explanation: "Convex mirror magnification is always positive (0 < m < 1). Setting up m = v/(-u) relation and substituting into mirror formula gives the object distance.",
      points: 15
    },
    {
      id: "t3q44",
      type: "short",
      question: "Explain with a formula why the focal length of a spherical mirror equals half its radius of curvature (R = 2f).",
      options: [],
      correctAnswer: "Geometric derivation:\nConsider a ray parallel to principal axis hitting a concave mirror at point A on the surface. The radius CA (C = center of curvature) is normal to the mirror at A.\n\nBy law of reflection, the ray reflects through F. Triangle CAF has:\n• Angle at A (angle of incidence = angle CA makes with the axis) = θ\n• Since CA is normal, angle of incidence = angle of reflection = θ\n• CF = FA (isoceles triangle, since the angles at A are equal)\n\nFor small angles (paraxial approximation): FA ≈ FP (since A is close to P).\nSo CF ≈ CP/2, meaning PF = PC/2.\nTherefore: f = R/2, or R = 2f.\n\nThis relation holds for small aperture mirrors (paraxial rays only).",
      explanation: "This geometric proof using the law of reflection and the isoceles triangle property is the foundation of mirror optics. It only holds for paraxial rays.",
      points: 15
    },
    {
      id: "t3q45",
      type: "short",
      question: "Object 4 cm tall at u = −20 cm. Concave mirror f = −10 cm. Find image height and state whether image is erect.",
      options: [],
      correctAnswer: "u = −20 cm, f = −10 cm, h = 4 cm.\n1/v = 1/(−10) − 1/(−20) = −2/20 + 1/20 = −1/20. v = −20 cm.\nm = −v/u = −(−20)/(−20) = −1.\nh' = m × h = −1 × 4 = −4 cm.\nImage height = 4 cm (same size). Negative sign → INVERTED (not erect).\nObject is at C, image forms at C: real, inverted, same size.",
      explanation: "The negative image height confirms the image is inverted (below the principal axis). At C, |m| = 1 confirms same size. This is the center-of-curvature special case.",
      points: 15
    },

    /* Long Answer Set 3 */
    {
      id: "t3q46",
      type: "long",
      question: "Explain the New Cartesian Sign Convention for mirrors and use it to solve: An object of height 3 cm is placed 30 cm from a concave mirror of focal length 15 cm. Find image position, height, and nature.",
      options: [],
      correctAnswer: "New Cartesian Sign Convention for Mirrors:\n1. All distances measured from pole P.\n2. In direction of incident light (to the right of mirror) = POSITIVE.\n3. Against direction of incident light (to the left, in front of mirror) = NEGATIVE.\n4. u (object distance) is ALWAYS NEGATIVE for real objects.\n5. Concave mirror: f is NEGATIVE (focus in front). Convex: f is POSITIVE (focus behind).\n6. Heights above axis: POSITIVE. Below axis: NEGATIVE.\n\nSolution:\nGiven: h = +3 cm, u = −30 cm, f = −15 cm.\n\nMirror formula: 1/v + 1/u = 1/f\n1/v = 1/f − 1/u = 1/(−15) − 1/(−30) = −2/30 + 1/30 = −1/30.\nv = −30 cm.\nImage is 30 cm in front of mirror (real).\n\nMagnification: m = −v/u = −(−30)/(−30) = −1.\nh' = m × h = −1 × 3 = −3 cm.\n\nImage height = 3 cm. Negative → inverted.\nNature: Real (v negative), Inverted (m negative), Same size (|m| = 1) at C.",
      explanation: "This is a complete worked example demonstrating sign convention application from start to finish. The object at 2f produces image at 2f with m = −1.",
      points: 20
    },
    {
      id: "t3q47",
      type: "long",
      question: "A student places an object at various distances from a concave mirror (f = 10 cm) and records the image distances. Fill in this table and draw conclusions:\nu = −∞, −30, −20, −15, −12, −5 cm.",
      options: [],
      correctAnswer: "f = −10 cm for all:\n\nu = −∞: 1/v = 1/(−10) → v = −10 cm = F. Image at F, real, inverted, point-sized.\nu = −30 cm: 1/v = −1/10 + 1/30 = −2/30 = −1/15. v = −15 cm. Between F and C.\nu = −20 cm (= 2f): 1/v = −1/10 + 1/20 = −1/20. v = −20 cm. At C, m = −1.\nu = −15 cm (between C and F): 1/v = −1/10 + 1/15 = −1/30. v = −30 cm. Beyond C, m = −2.\nu = −12 cm (close to F): 1/v = −1/10 + 1/12 = −1/60. v = −60 cm. Far beyond C, m = −5.\nu = −5 cm (between P and F): 1/v = −1/10 + 1/5 = 1/10. v = +10 cm. BEHIND mirror, m = +2.\n\nConclusions:\n1. As object moves FROM ∞ TO F: image moves from F to ∞ (real, getting larger).\n2. At F: image at infinity (parallel reflected beam — no image formed).\n3. Object between F and P: image virtual, erect, magnified behind mirror.\n4. Object at C: same-size real image at C.\n5. Only case giving virtual image: object between P and F.",
      explanation: "This systematic table is the ultimate study aid for concave mirror image positions. It reveals the continuous variation of v and m as u changes.",
      points: 20
    },

    /* HOTS Set 3 */
    {
      id: "t3q48",
      type: "thinking",
      question: "Prove mathematically that for a concave mirror, as the object distance u approaches the focal length f from beyond (u slightly greater than f), the image distance v approaches negative infinity. What does this mean physically?",
      options: [],
      correctAnswer: "Proof:\nLet u = f + ε where ε is a very small positive number (object just slightly beyond F).\nu = −(f + ε) [applying sign convention, f is positive magnitude].\n\nMirror formula: 1/v = 1/(−f) − 1/(−(f+ε)) = −1/f + 1/(f+ε)\n= [−(f+ε) + f] / [f(f+ε)]\n= −ε / [f(f+ε)]\n\nAs ε → 0:\n1/v = −ε / [f(f+ε)] → 0⁻ (approaches zero from negative side)\nTherefore v → −∞.\n\nPhysical meaning:\nWhen the object is at F, all reflected rays are parallel — they never converge (they meet at infinity). The image forms infinitely far in front of the mirror. This is why a light source at F of a concave mirror produces a perfectly parallel beam (used in headlights, searchlights, lighthouses). The beam 'focuses' at infinity — light travels parallel to the axis without converging.",
      explanation: "This mathematical proof shows the singular behaviour of the mirror formula at u = f. The physical interpretation — parallel beam from source at focus — is one of the most important applications of concave mirrors.",
      points: 25
    },
    {
      id: "t3q49",
      type: "thinking",
      question: "A clever engineer wants to read text on a page that is 5 cm from a concave mirror (mirror's f = 20 cm). Will this set up create a useful magnified image? Calculate the magnification and explain why this is better than a conventional magnifying lens.",
      options: [],
      correctAnswer: "u = −5 cm, f = −20 cm (concave, f negative).\n1/v = 1/(−20) − 1/(−5) = −1/20 + 1/5 = −1/20 + 4/20 = 3/20.\nv = +20/3 = +6.67 cm (positive → BEHIND mirror → virtual image).\n\nm = −v/u = −(6.67)/(−5) = +1.33.\n\nImage is virtual, erect, 1.33× magnified at 6.67 cm behind the mirror.\n\nComparison with magnifying lens (also works when object inside f):\n• Mirror advantage: No chromatic aberration (mirrors reflect all wavelengths equally; lenses refract different wavelengths at different angles, causing colour fringing).\n• Mirror advantage: Works in any wavelength — UV, IR, visible.\n• Mirror disadvantage: User must look into mirror from same side as the object, which can be awkward.\n\nIn electron microscopes and telescope systems, mirrors are preferred over lenses for exactly this reason — no chromatic aberration.",
      explanation: "Mirrors have an inherent advantage over lenses for precision optics because reflection obeys the same law for all wavelengths, eliminating chromatic aberration.",
      points: 25
    },
    {
      id: "t3q50",
      type: "thinking",
      question: "A manufacturer claims their 'new' spherical mirror has focal length f = −30 cm and that placing an object at u = −30 cm gives image at u = −30 cm (i.e., at the object itself). Verify or refute this claim using the mirror formula.",
      options: [],
      correctAnswer: "If u = −30 cm and f = −30 cm, let's use the mirror formula:\n1/v = 1/f − 1/u = 1/(−30) − 1/(−30) = −1/30 + 1/30 = 0.\nv = 1/0 = INFINITY.\n\nThis means when u = f (object at focus), the image forms at infinity — NOT at the object position. The manufacturer's claim is WRONG.\n\nFor image to form at the object (v = u):\n1/v + 1/u = 1/f → 1/u + 1/u = 1/f → 2/u = 1/f → u = 2f.\nWith f = −30 cm: u = −60 cm (the object must be at C = 2f, not at F).\n\nConclusion: The manufacturer has confused F (focus) with C (center of curvature). The image forms at the object only when the object is at C = 2f = 60 cm, not at f = 30 cm. At f, the image is at infinity (parallel beam). The claim is factually incorrect.",
      explanation: "This 'verification' problem teaches critical thinking: always test claims with the actual formula. The confusion of F and C is a common misconception.",
      points: 25
    }
  ]
};
