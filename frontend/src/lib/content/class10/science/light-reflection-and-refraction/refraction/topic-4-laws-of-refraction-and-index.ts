/**
 * FILE: topic-4-laws-of-refraction-and-index.ts
 * LOCATION: src/lib/content/class10/science/light-reflection-and-refraction/refraction/topic-4-laws-of-refraction-and-index.ts
 * PURPOSE: Detailed study of Refraction of Light, Snell's Law, and Refractive Index.
 * LAST UPDATED: 2026-06-08
 */

import { Topic } from "../../shared-types";

export const topic4LawsOfRefraction: Topic = {
  id: "laws-of-refraction-and-index",
  title: "4. Refraction of Light and Refractive Index",
  estimatedMinutes: 55,
  imageUrl: "https://images.unsplash.com/photo-1544265747-062e5b8ce1b2?auto=format&fit=crop&q=80&w=1200",
  content: `
### What is Refraction of Light?

When light travels from one transparent medium to another, its speed changes. This change in speed causes the ray of light to bend at the boundary separating the two media.

The phenomenon of the change in the direction of light when it passes obliquely from one transparent medium to another is called the **Refraction of Light**.

*   **Optically Rarer Medium:** A medium in which the speed of light is comparatively higher (e.g., air).
*   **Optically Denser Medium:** A medium in which the speed of light is comparatively lower (e.g., water, glass).

**Bending Rules:**
1.  When a ray of light travels from a **rarer medium to a denser medium** (e.g., air to glass), it bends **towards the normal**.
2.  When a ray of light travels from a **denser medium to a rarer medium** (e.g., glass to air), it bends **away from the normal**.

*Note:* If the incident ray falls normally (perpendicularly) on the surface, it goes straight without bending, although its speed still changes.

---

### Refraction through a Rectangular Glass Slab

When a ray of light passes through a rectangular glass slab, refraction occurs twice:
1.  First at the air-glass interface (bends towards the normal).
2.  Second at the glass-air interface (bends away from the normal).

Due to the parallel faces of the slab, the emergent ray is parallel to the incident ray, but it is laterally shifted. This shift is called **Lateral Displacement**.

---

### The Laws of Refraction

Refraction of light obeys the following two laws:

**First Law of Refraction:**
> The incident ray, the refracted ray, and the normal to the interface of two transparent media at the point of incidence, all lie in the same plane.

**Second Law of Refraction (Snell's Law):**
> The ratio of the sine of the angle of incidence ($\\sin i$) to the sine of the angle of refraction ($\\sin r$) is a constant, for the light of a given color and for the given pair of media.

$$ \\frac{\\sin i}{\\sin r} = \\text{constant} $$

This constant value is called the **Refractive Index** of the second medium with respect to the first.

---

### Refractive Index ($n$)

The extent of the change in direction that takes place in a given pair of media is expressed in terms of the refractive index. It is fundamentally linked to the relative speed of light in different media.

**Relative Refractive Index:**
The refractive index of medium 2 with respect to medium 1 ($n_{21}$) is given by the ratio of the speed of light in medium 1 ($v_1$) to the speed of light in medium 2 ($v_2$).
$$ n_{21} = \\frac{\\text{Speed of light in medium 1 } (v_1)}{\\text{Speed of light in medium 2 } (v_2)} = \\frac{v_1}{v_2} $$

Similarly, $n_{12} = v_2 / v_1$.

**Absolute Refractive Index:**
If medium 1 is a vacuum or air, then the refractive index of medium 2 is considered with respect to vacuum. This is called the absolute refractive index of the medium, denoted simply by $n$ (or $n_m$).
$$ n_m = \\frac{\\text{Speed of light in air/vacuum } (c)}{\\text{Speed of light in the medium } (v)} = \\frac{c}{v} $$

*Fact:* Since $c$ is always greater than $v$ in any material medium, the absolute refractive index is always greater than 1 ($n > 1$). Water has $n = 1.33$, and diamond has a very high $n = 2.42$.

---
### Exam Summary

#### 📌 Must-Know Definitions
*   **Refraction:** Bending of light as it passes from one transparent medium to another due to a **change in speed**.
*   **Refractive Index ($n$):** A dimensionless number that tells how much light slows down in a medium.
*   **Optically Denser Medium:** Higher $n$ → light travels *slower* → bends *towards* normal.
*   **Optically Rarer Medium:** Lower $n$ → light travels *faster* → bends *away from* normal.

#### 🔑 The Laws of Refraction (Snell's Law)
**First Law:** The incident ray, refracted ray, and normal at the point of incidence are all in the **same plane**.

**Second Law (Snell's Law):**
$$\\frac{\\sin i}{\\sin r} = n_{21} = \\frac{n_2}{n_1} = \\text{constant}$$

#### 📐 Refractive Index Formulas
$$n = \\frac{c}{v} \\quad \\text{(Absolute — from vacuum)}$$
$$n_{21} = \\frac{v_1}{v_2} = \\frac{n_2}{n_1} \\quad \\text{(Relative — medium 2 w.r.t. medium 1)}$$

#### 🔢 Standard Refractive Index Values (memorize for MCQs)
| Medium | Refractive Index ($n$) |
|---|---|
| Vacuum / Air | 1.0 |
| Water | 1.33 |
| Crown Glass | 1.52 |
| Diamond | 2.42 |

> 🔑 **Diamond has the highest refractive index** of common materials → responsible for its brilliance.

#### ⚠️ Common Mistakes
*   Confusing refraction (*bending when entering new medium*) with reflection (*bouncing back in same medium*).
*   Thinking light bends towards normal when going from denser to rarer — it bends **away** from normal.
*   Forgetting that **when light enters along the normal** (perpendicular), it does NOT bend ($i = 0°$, so $r = 0°$).

#### 🧪 Real-Life Examples (HOTS favorite)
*   **Apparent depth:** Objects in water appear closer than they are (pencil in glass of water looks bent).
*   **Mirage:** Light bends in hot air layers near the ground, making the sky appear reflected on road.
*   **Twinkling of stars:** Atmospheric refraction causes apparent position of stars to shift continuously.
`,
  questions: [
    // --- MCQ ---
    {
      id: "t4q1",
      type: "mcq",
      question: "What is the primary cause of the refraction of light when it passes from one medium to another?",
      options: [
        "Change in the temperature of the medium",
        "Change in the speed of light",
        "Reflection from the boundary",
        "Change in the color of light"
      ],
      correctAnswer: "Change in the speed of light",
      explanation: "Refraction occurs because light travels at different speeds in optically different media.",
      points: 10
    },
    {
      id: "t4q2",
      type: "mcq",
      question: "When a ray of light enters from air into glass, how does it bend?",
      options: [
        "Away from the normal",
        "Towards the normal",
        "It does not bend",
        "It reflects back"
      ],
      correctAnswer: "Towards the normal",
      explanation: "Air is an optically rarer medium and glass is an optically denser medium. Light bending from rarer to denser bends towards the normal.",
      points: 10
    },
    {
      id: "t4q3",
      type: "mcq",
      question: "Which mathematical formula represents Snell's Law?",
      options: [
        "$\\sin i \\times \\sin r = \\text{constant}$",
        "$\\sin i + \\sin r = \\text{constant}$",
        "$\\frac{\\sin i}{\\sin r} = \\text{constant}$",
        "$\\frac{\\cos i}{\\cos r} = \\text{constant}$"
      ],
      correctAnswer: "$\\frac{\\sin i}{\\sin r} = \\text{constant}$",
      explanation: "Snell's Law states that the ratio of the sine of the angle of incidence to the sine of the angle of refraction is a constant for a given pair of media.",
      points: 10
    },
    {
      id: "t4q4",
      type: "mcq",
      question: "If the refractive index of a medium is high, what does it imply about the speed of light in that medium?",
      options: [
        "The speed of light is very high.",
        "The speed of light is very low.",
        "The speed of light is equal to $3 \\times 10^8 \\text{ m/s}$.",
        "The speed is unrelated to the refractive index."
      ],
      correctAnswer: "The speed of light is very low.",
      explanation: "Refractive index $n = c/v$. Since $c$ is constant, $n$ is inversely proportional to $v$. Therefore, a higher refractive index means a lower speed of light.",
      points: 10
    },
    {
      id: "t4q5",
      type: "mcq",
      question: "In an experiment with a rectangular glass slab, the emergent ray is:",
      options: [
        "Perpendicular to the incident ray",
        "Intersecting the incident ray",
        "Parallel to the incident ray",
        "Reflected completely"
      ],
      correctAnswer: "Parallel to the incident ray",
      explanation: "Because the bending at the air-glass interface is exactly reversed at the glass-air interface, the emergent ray is parallel to the original incident ray but laterally shifted.",
      points: 10
    },

    // --- Short Answer ---
    {
      id: "t4q6",
      type: "short",
      question: "Define the term 'Absolute Refractive Index'.",
      correctAnswer: "The absolute refractive index of a medium is defined as the ratio of the speed of light in vacuum (or air) to the speed of light in that medium ($n = c/v$).",
      explanation: "This is the standard metric for comparing the optical density of different materials.",
      points: 15
    },
    {
      id: "t4q7",
      type: "short",
      question: "Why does a pencil partly immersed in water appear bent at the water surface?",
      correctAnswer: "This happens due to the refraction of light. The light rays coming from the underwater portion of the pencil bend away from the normal as they travel from water (denser) to air (rarer), making the pencil appear bent to the observer.",
      explanation: "This is a classic everyday example of refraction tricking our eyes, which assume light travels in a straight line.",
      points: 15
    },
    {
      id: "t4q8",
      type: "short",
      question: "The refractive index of diamond is 2.42. What is the meaning of this statement?",
      correctAnswer: "It means that the speed of light in vacuum is 2.42 times faster than the speed of light in a diamond. ($n = c/v \\implies 2.42 = c/v$).",
      explanation: "Because diamond has a very high refractive index, light travels extremely slowly through it, giving it its characteristic sparkle.",
      points: 15
    },
    {
      id: "t4q9",
      type: "short",
      question: "What is lateral displacement in the context of a rectangular glass slab?",
      correctAnswer: "Lateral displacement is the perpendicular shift or distance between the original path of the incident ray and the path of the emergent ray after passing through a glass slab.",
      explanation: "The light ray is shifted sideways but its final direction remains unchanged.",
      points: 15
    },
    {
      id: "t4q10",
      type: "short",
      question: "If a ray of light falls perpendicularly ($90^\\circ$ to the surface) on a glass slab, what will be its angle of refraction?",
      correctAnswer: "The angle of refraction will be $0^\\circ$. The ray will pass straight through without bending.",
      explanation: "When falling perpendicularly, the angle of incidence with the normal is $0^\\circ$. By Snell's Law, $\\sin(r) = \\sin(0)/n = 0$, so $r = 0^\\circ$.",
      points: 15
    },

    // --- Long Answer ---
    {
      id: "t4q11",
      type: "long",
      question: "Light enters from air to glass having refractive index 1.50. What is the speed of light in the glass? The speed of light in vacuum is $3 \\times 10^8 \\text{ m/s}$.",
      correctAnswer: "Refractive index of glass ($n$) = 1.50\nSpeed of light in vacuum ($c$) = $3 \\times 10^8 \\text{ m/s}$\nWe know that $n = c/v$, where $v$ is the speed of light in glass.\nTherefore, $v = c/n$\n$v = (3 \\times 10^8) / 1.50$\n$v = 2 \\times 10^8 \\text{ m/s}$.\nThe speed of light in glass is $2 \\times 10^8 \\text{ m/s}$.",
      explanation: "This is a direct application of the absolute refractive index formula.",
      points: 20
    },
    {
      id: "t4q12",
      type: "long",
      question: "Explain the refraction of light through a rectangular glass slab with the help of a labeled diagram (describe the diagram). Name the phenomenon that causes the emergent ray to be parallel to the incident ray.",
      correctAnswer: "1. Draw a rectangular slab ABCD. A ray falls obliquely on the top face AB. This is the incident ray.\n2. At the air-glass interface, it bends towards the normal because it enters a denser medium. This is the refracted ray.\n3. The refracted ray travels through the glass and strikes the bottom face CD.\n4. At the glass-air interface, it bends away from the normal because it enters a rarer medium. This is the emergent ray.\n5. The angle of bending at AB is exactly reversed at CD because the faces are parallel and the media (air) are the same on both sides.\n6. As a result, the emergent ray is parallel to the original incident ray path, but laterally shifted.\nThe phenomenon is called lateral displacement.",
      explanation: "Understanding the glass slab experiment is crucial for verifying the laws of refraction.",
      points: 20
    },
    {
      id: "t4q13",
      type: "long",
      question: "You are given kerosene, turpentine, and water. In which of these does light travel fastest? (Refractive indices: Kerosene = 1.44, Turpentine = 1.47, Water = 1.33). Justify your answer.",
      correctAnswer: "Light travels fastest in Water.\nJustification: The speed of light in a medium is inversely proportional to its refractive index ($v = c/n$). \nComparing the given values:\nWater (1.33) < Kerosene (1.44) < Turpentine (1.47).\nSince water has the lowest refractive index among the three, it is optically the rarest. Therefore, light will travel fastest in water.",
      explanation: "Optical density is measured by refractive index. The lower the index, the closer the speed of light is to $c$.",
      points: 20
    },
    {
      id: "t4q14",
      type: "long",
      question: "State Snell's law of refraction. If the angle of incidence in air is $45^\\circ$ and the angle of refraction in a medium is $30^\\circ$, calculate the refractive index of the medium.",
      correctAnswer: "Snell's Law: The ratio of the sine of the angle of incidence to the sine of the angle of refraction is a constant for a given pair of media and given color of light. ($\\sin i / \\sin r = \\text{constant}$). \nCalculation:\nAngle of incidence, $i = 45^\\circ$\nAngle of refraction, $r = 30^\\circ$\nRefractive index $n = \\sin i / \\sin r = \\sin(45^\\circ) / \\sin(30^\\circ)$\nWe know $\\sin(45^\\circ) = 1/\\sqrt{2}$ and $\\sin(30^\\circ) = 1/2$.\n$n = (1/\\sqrt{2}) / (1/2) = 2/\\sqrt{2} = \\sqrt{2}$.\nThe refractive index is $\\sqrt{2}$ or approximately 1.414.",
      explanation: "This directly tests the mathematical application of Snell's law using basic trigonometric values.",
      points: 20
    },
    {
      id: "t4q15",
      type: "long",
      question: "Define the term 'relative refractive index'. The refractive index of water with respect to air is 4/3 and that of glass with respect to air is 3/2. What is the refractive index of glass with respect to water?",
      correctAnswer: "Relative refractive index of medium 2 with respect to medium 1 is the ratio of the speed of light in medium 1 to the speed of light in medium 2 ($n_{21} = v_1 / v_2$).\nGiven:\n$n_w = 4/3$\n$n_g = 3/2$\nWe need refractive index of glass with respect to water ($n_{gw}$).\n$n_{gw} = n_g / n_w = (3/2) / (4/3) = (3/2) \\times (3/4) = 9/8$.\nThe refractive index of glass with respect to water is 9/8 (or 1.125).",
      explanation: "Using the chain rule for relative refractive indices is a common application: $n_{21} = n_2 / n_1$.",
      points: 20
    },

    // --- HOTS ---
    {
      id: "t4q16",
      type: "thinking",
      question: "A coin placed at the bottom of a beaker containing water appears to be raised. Does the apparent depth of the coin change if we view it from different angles?",
      correctAnswer: "Yes, the apparent depth changes when viewed from different angles.\nThe apparent depth is given by the formula: Apparent Depth = Real Depth / Refractive Index ($n$). However, this simple formula is only strictly true for viewing normally (straight down).\nWhen viewed at an angle, the light rays undergo a greater amount of refraction as they exit the water at a wider angle. This causes the virtual image (the apparent position of the coin) to shift further upwards and horizontally closer to the observer. Thus, the more oblique the viewing angle, the shallower the coin appears.",
      explanation: "This extends the basic concept of apparent depth by introducing the dependency on the viewing angle, requiring an understanding of how refraction angles change geometrically.",
      points: 25
    },
    {
      id: "t4q17",
      type: "thinking",
      question: "Consider three media A, B, and C with refractive indices $n_a$, $n_b$, and $n_c$ respectively. If a light ray bends towards the normal when passing from A to B, and bends away from the normal when passing from B to C, what can you conclude about the relative magnitudes of $n_a$, $n_b$, and $n_c$?",
      correctAnswer: "From A to B, the ray bends towards the normal. This means B is optically denser than A, so $n_b > n_a$.\nFrom B to C, the ray bends away from the normal. This means C is optically rarer than B, so $n_c < n_b$.\nTherefore, $n_b$ is the greatest. The relation is $n_b > n_a$ and $n_b > n_c$.\nWe cannot definitively determine the relationship between $n_a$ and $n_c$ without knowing the exact angles of bending.",
      explanation: "This tests logical deduction based on the rules of refraction. Bending towards/away directly indicates relative optical densities.",
      points: 25
    },
    {
      id: "t4q18",
      type: "thinking",
      question: "A laser beam is directed from underwater towards the surface. As the angle of incidence is gradually increased, the refracted ray bends closer and closer to the surface. What happens when the angle of incidence is increased beyond a certain critical angle?",
      correctAnswer: "When the angle of incidence in the denser medium (water) is increased beyond a certain 'critical angle', the light ray does not refract into the rarer medium (air) at all. \nInstead, it undergoes **Total Internal Reflection** (TIR). The entire light beam is reflected back into the water, obeying the laws of reflection as if the surface were a perfect mirror.",
      explanation: "This introduces Total Internal Reflection, a crucial phenomenon that occurs only when light travels from a denser to a rarer medium.",
      points: 25
    },
    {
      id: "t4q19",
      type: "thinking",
      question: "Why do stars twinkle, but planets do not?",
      correctAnswer: "Stars twinkle due to atmospheric refraction. Stars are point-sized sources of light far away. As their starlight passes through Earth's atmosphere, it undergoes continuous refraction due to varying air densities and temperatures. This causes the apparent position and brightness of the star to fluctuate rapidly, causing the twinkling effect.\nPlanets do not twinkle because they are much closer to Earth and appear as extended sources (a collection of point sources). The total variations in the amount of light entering our eye from all the individual point sources average out to zero, nullifying the twinkling effect.",
      explanation: "This applies the concept of atmospheric refraction to a real-world astronomical observation.",
      points: 25
    },
    {
      id: "t4q20",
      type: "thinking",
      question: "If you place a thick glass slab over some printed letters, the letters appear raised. If you replace the glass slab with a transparent plastic slab of the same thickness but lower refractive index, will the letters appear more raised or less raised?",
      correctAnswer: "The letters will appear **less raised**.\nThe apparent depth depends inversely on the refractive index ($n$). A higher refractive index means light bends more, making the object appear higher (more raised).\nSince the plastic slab has a lower refractive index than glass, it bends the light less. Consequently, the virtual image is formed deeper, meaning the letters appear less raised compared to when under the glass slab.",
      explanation: "This requires applying the relationship between refractive index, degree of bending, and apparent shift in position.",
      points: 25
    }
  ]
};
