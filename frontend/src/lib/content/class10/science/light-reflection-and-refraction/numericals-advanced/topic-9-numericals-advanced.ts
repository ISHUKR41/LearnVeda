import { Topic } from "../../shared-types";

export const topic9NumericalsAdvanced: Topic = {
  id: "topic-9-numericals-advanced",
  title: "9. Numericals and Advanced Optical Concepts",
  estimatedMinutes: 30,
  simulationIds: [
    "light-mirror-formula-calc",
    "light-sign-convention",
    "light-lens-formula-calc",
    "light-power-lens",
    "adv-concave-mirror",
    "adv-convex-lens",
  ],
  imageUrl: "/images/light/topic9-numericals.png",
  content: `
# Numericals and Advanced Optical Concepts

The entire universe of optics is governed by strict mathematical laws, primarily the **Mirror Formula** and the **Lens Formula**, working under the strict rules of the **New Cartesian Sign Convention**. By mastering these formulas and recognizing that nature always favors geometric logic (like Fermat's Principle of least time), anyone can accurately predict, trace, and control the exact path of light.

## The New Cartesian Sign Convention
To solve mathematical problems and find exactly where an image will appear, we use a fixed set of math rules called the New Cartesian Sign Convention:

1. The Pole (P) or Optical Center (O) of the mirror/lens is exactly at the zero point (0,0) of the graph.
2. The object is absolutely always placed on the left side of the mirror/lens. Therefore, the object distance ($u$) is strictly always a negative ($-$) number.
3. Light travels from left to right. Any distance measured on the right side (behind the mirror/lens) is positive ($+$).
4. Any distance measured on the left side (in front of the mirror/lens) is negative ($-$).
5. The Focal length ($f$) of a **concave** mirror or lens is always **negative**.
6. The Focal length ($f$) of a **convex** mirror or lens is always **positive**.
7. Heights pointing up (above the axis) are positive ($+$). Heights pointing down (below the axis, upside down) are negative ($-$).

## Mathematical Formulas

### Mirror Formula
$\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}$

### Lens Formula
$\\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f}$

### Magnification ($m$)
Magnification compares the height of the image ($h'$) to the height of the object ($h$).
For mirrors: $m = \\frac{h'}{h} = -\\frac{v}{u}$
For lenses: $m = \\frac{h'}{h} = \\frac{v}{u}$

* If your final $m$ answer is negative, the image is real and inverted.
* If your final $m$ answer is positive, the image is virtual and erect.

## Real-Life Application
Imagine a car company designing a new headlight. They want the light bulb to shoot a perfectly straight beam of light down the dark highway. To do this, the engineers use the Mirror Formula. They know they must place the light bulb exactly at the focus. By knowing the curve of the metal dish (radius of curvature), they calculate the focal length ($f$). Then they build the bulb holder to place the bulb at exactly that negative distance ($-f$) so that the final light beam reflects out perfectly to infinity.
  `,
  questions: [
    {
      id: "q9-1",
      type: "mcq",
      question: "In mirror and lens calculations, what is the sign of the object distance (u)?",
      options: [
        "It is always positive",
        "It depends on the type of mirror/lens",
        "It is always completely negative",
        "It is positive for virtual objects only"
      ],
      correctAnswer: "It is always completely negative",
      explanation: "According to the New Cartesian Sign Convention, the object is always placed on the left side of the mirror/lens, meaning its distance is strictly always a negative number.",
      points: 10
    },
    {
      id: "q9-2",
      type: "short",
      question: "A student writes the focal length of a concave mirror as a positive number. Is this a mistake? Why?",
      options: [],
      correctAnswer: "Yes, this is a massive mistake. The focus of a concave mirror is located in front of the mirror, on the left side. According to the New Cartesian Sign Convention, everything on the left side must be negative. It should be a negative number.",
      explanation: "Concave mirrors have their focus in front of the reflecting surface (left side). Therefore, the focal length is negative.",
      points: 15
    },
    {
      id: "q9-3",
      type: "thinking",
      question: "A mirror forms a real image that is exactly 4 times the size of the original object. If the object is placed 10 cm away from the mirror (u = -10 cm), calculate where the image is located without using the mirror formula.",
      options: [],
      correctAnswer: "We know the image is real, which means it must be upside down (inverted). Therefore, the magnification (m) must be a negative number. Because it is 4 times bigger, m = -4. We know the simple magnification rule for mirrors: m = -v/u. Plug in the numbers: -4 = -v / -10. The two negatives on the bottom cancel out: -4 = v / 10. Multiply by 10: v = -40 cm. The image is located 40 cm in front of the mirror on the left side.",
      explanation: "Magnification directly relates object distance and image distance. For a real image in a mirror, m is negative. Using m = -v/u, we can easily find the image distance.",
      points: 25
    }
  ],
  flashCards: [
    {
      id: "fc9-1",
      front: "What is the sign of the focal length ($f$) for a concave mirror/lens?",
      back: "Always **negative** ($-$), because the focus lies on the left side."
    },
    {
      id: "fc9-2",
      front: "What does a negative magnification ($m$) mean?",
      back: "The image is **real** and **inverted** (upside down)."
    },
    {
      id: "fc9-3",
      front: "What is the Mirror Formula?",
      back: "$\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}$"
    }
  ]
};
