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
  imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1200",
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
*   **Sign Convention:** Pole is origin. Object on left ($u < 0$). Right is positive, Left is negative. Up is positive, Down is negative.
*   **Concave $f$:** Negative. **Convex $f$:** Positive.
*   **Mirror Formula:** $1/v + 1/u = 1/f$
*   **Magnification:** $m = h'/h = -v/u$
*   $m$ is Negative for real images, Positive for virtual images.
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
    }
  ]
};
