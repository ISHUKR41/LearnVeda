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
  simulationIds: [
    "light-refraction-demo",
    "light-snells-law",
    "light-tir",
    "light-optical-fiber",
    "light-apparent-depth",
    "light-snell-calculator",
    "light-tir-explorer",
    "adv-snells-law",
  ],
  imageUrl: "/images/light/topic4-refraction.png",
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
    },

    // ═══════════════════════════════════════════════════
    // ADDITIONAL QUESTIONS — Set 2 (t4q21 to t4q35)
    // ═══════════════════════════════════════════════════

    // --- MCQ Set 2 ---
    {
      id: "t4q21",
      type: "mcq",
      question: "The refractive index of glass with respect to air is $3/2$. What is the speed of light in glass? (Speed of light in air = $3 \\times 10^8$ m/s)",
      options: [
        "$4.5 \\times 10^8$ m/s",
        "$2 \\times 10^8$ m/s",
        "$1.5 \\times 10^8$ m/s",
        "$3 \\times 10^8$ m/s"
      ],
      correctAnswer: "$2 \\times 10^8$ m/s",
      explanation: "Refractive index $n = c/v \\implies v = c/n = (3 \\times 10^8) / (3/2) = (3 \\times 10^8) \\times (2/3) = 2 \\times 10^8$ m/s. Light slows down in a denser medium.",
      points: 10
    },
    {
      id: "t4q22",
      type: "mcq",
      question: "Which of the following has the highest refractive index?",
      options: [
        "Water (n = 1.33)",
        "Crown glass (n = 1.52)",
        "Diamond (n = 2.42)",
        "Ice (n = 1.31)"
      ],
      correctAnswer: "Diamond (n = 2.42)",
      explanation: "Diamond has the highest refractive index of common substances at $n = 2.42$. This means light travels slowest in diamond. The high refractive index also gives diamond its high critical angle property, causing brilliant internal reflections (sparkle).",
      points: 10
    },
    {
      id: "t4q23",
      type: "mcq",
      question: "Total internal reflection occurs when light travels from:",
      options: [
        "Rarer to denser medium at any angle",
        "Denser to rarer medium at angle less than critical angle",
        "Denser to rarer medium at angle greater than or equal to critical angle",
        "Rarer to denser medium at angle greater than critical angle"
      ],
      correctAnswer: "Denser to rarer medium at angle greater than or equal to critical angle",
      explanation: "Two conditions for TIR: (1) Light must travel from a denser medium to a rarer medium. (2) The angle of incidence must be greater than or equal to the critical angle. When both are met, NO refraction occurs — all light is reflected back into the denser medium.",
      points: 10
    },
    {
      id: "t4q24",
      type: "mcq",
      question: "A ray of light passes through air into water (n = 1.33) at an angle of incidence of $0^\\circ$. The angle of refraction is:",
      options: [
        "$0^\\circ$",
        "$53^\\circ$",
        "$90^\\circ$",
        "$45^\\circ$"
      ],
      correctAnswer: "$0^\\circ$",
      explanation: "When light falls perpendicular to the surface (angle of incidence = $0^\\circ$), it passes straight through without bending regardless of the refractive index. However, its speed still changes. The light continues along the same straight path.",
      points: 10
    },
    {
      id: "t4q25",
      type: "mcq",
      question: "The critical angle for total internal reflection in diamond is approximately $24^\\circ$. This means:",
      options: [
        "Any ray in diamond at $>24^\\circ$ to the surface will exit",
        "Any ray in diamond at $>24^\\circ$ to the normal will undergo TIR",
        "Rays hitting from air at $<24^\\circ$ are totally reflected",
        "Diamond only reflects light; it never transmits it"
      ],
      correctAnswer: "Any ray in diamond at $>24^\\circ$ to the normal will undergo TIR",
      explanation: "The critical angle is measured from the normal (not the surface). For diamond, if the angle of incidence (measured from normal) inside the diamond exceeds $24^\\circ$, total internal reflection occurs. This is an extremely small critical angle — most light bouncing inside is trapped, causing diamond's famous brilliance.",
      points: 10
    },

    // --- Short Answer Set 2 ---
    {
      id: "t4q26",
      type: "short",
      question: "A ray of light travels from water (n = 1.33) into air. At what angle does total internal reflection begin? (i.e., find the critical angle. $\\sin^{-1}(1/1.33) \\approx 48.8^\\circ$)",
      correctAnswer: "Critical angle $\\theta_c$ satisfies: $\\sin \\theta_c = 1/n = 1/1.33 \\approx 0.752$.\nTherefore, $\\theta_c = \\sin^{-1}(0.752) \\approx 48.8^\\circ$.\nFor any angle of incidence $> 48.8^\\circ$, light in water undergoes total internal reflection and cannot exit into air.",
      explanation: "The formula $\\sin \\theta_c = n_{rarer}/n_{denser}$ gives the critical angle. For water-air, $n_{air} = 1$, so $\\sin \\theta_c = 1/n_{water}$.",
      points: 15
    },
    {
      id: "t4q27",
      type: "short",
      question: "Why does a glass of water appear to have a silvery bottom when you look at it from above at a very low angle?",
      correctAnswer: "When you look at the water surface from below at a low angle (grazing angle), the angle of incidence from inside the water exceeds the critical angle for water-air interface (~48.8°). This causes total internal reflection — no light exits. The surface appears shiny/silvery like a mirror because all light is reflected back. This is the same phenomenon seen under swimming pools.",
      explanation: "Total internal reflection makes the water-air interface act like a perfect mirror when viewed from steep angles inside the water.",
      points: 15
    },
    {
      id: "t4q28",
      type: "short",
      question: "Explain why a pencil appears bent when placed in a glass of water, even though it is straight.",
      correctAnswer: "The pencil appears bent due to refraction. Light rays from the submerged part of the pencil travel from water (denser medium) to air (rarer medium). At the water-air surface, they bend AWAY from the normal. When our eyes trace these refracted rays back in a straight line, they appear to come from a position higher than the actual position. So the submerged part of the pencil appears shifted upward and the pencil seems bent at the water surface.",
      explanation: "This is apparent shift due to refraction — the same principle as apparent depth. Our brain assumes light travels in straight lines.",
      points: 15
    },
    {
      id: "t4q29",
      type: "short",
      question: "State Snell's Law. If the angle of incidence is $30^\\circ$ and the refractive index of the medium is $\\sqrt{3}$, find the angle of refraction.",
      correctAnswer: "Snell's Law: $n_1 \\sin i = n_2 \\sin r$ (or equivalently $\\sin i / \\sin r = n_{21}$).\n\nGiven: $i = 30^\\circ$, $n_1 = 1$ (air), $n_2 = \\sqrt{3}$.\n$\\sin r = \\sin i / n_2 = \\sin 30^\\circ / \\sqrt{3} = 0.5 / \\sqrt{3} = 0.5 / 1.732 \\approx 0.289$.\n$r = \\sin^{-1}(0.289) \\approx 17^\\circ$.\n(Exact: $r = 17^\\circ$, since $\\sin 17^\\circ \\approx 0.289$).",
      explanation: "Direct application of Snell's Law. Remember: light bends towards normal when entering a denser medium, so r < i.",
      points: 15
    },
    {
      id: "t4q30",
      type: "short",
      question: "Explain 'lateral displacement' of light through a rectangular glass slab.",
      correctAnswer: "When a ray of light passes through a rectangular glass slab, it refracts twice — once at the air-glass interface (bends towards normal) and once at the glass-air interface (bends away from normal). Because the two faces are parallel, the emergent ray is parallel to the incident ray. However, it is shifted sideways — this perpendicular distance between the incident ray and emergent ray is called 'lateral displacement'. Lateral displacement increases with: (1) greater slab thickness, (2) higher refractive index, (3) larger angle of incidence.",
      explanation: "The emergent ray is parallel but shifted. The shift depends on thickness, n, and angle — a common practical exam question.",
      points: 15
    },

    // --- Long Answer Set 2 ---
    {
      id: "t4q31",
      type: "long",
      question: "Describe the phenomenon of Total Internal Reflection (TIR). State the conditions required. Explain how optical fibres use TIR to transmit data at the speed of light.",
      correctAnswer: "Total Internal Reflection (TIR):\nWhen a ray of light traveling in a denser medium hits the boundary of a rarer medium, if the angle of incidence exceeds the critical angle, no refraction occurs — all the light is completely reflected back into the denser medium. This is called Total Internal Reflection.\n\nConditions for TIR:\n1. Light must be traveling from a DENSER medium to a RARER medium.\n2. The angle of incidence must be GREATER THAN the critical angle ($\\theta_c$) for that pair of media.\n\nOptical Fibre Principle:\nAn optical fibre is a thin, flexible tube of glass or plastic. It has two layers:\n• Core: dense glass/plastic with high refractive index.\n• Cladding: less dense glass with lower refractive index.\n\nWhen light is sent into the core at a shallow angle, it hits the core-cladding boundary at an angle greater than the critical angle. TIR occurs, and the light bounces along the fibre without exiting, even through bends. This continues for thousands of kilometers with minimal signal loss.\n\nApplications:\n1. Internet data transmission (undersea fibre optic cables carry internet traffic between continents).\n2. Medical endoscopes (doctors view internal organs without surgery).\n3. Telecommunications (telephone, TV signals).",
      explanation: "TIR + optical fibres is a 5-7 mark question. The key points: denser-to-rarer, exceeds critical angle, core > cladding refractive index.",
      points: 20
    },
    {
      id: "t4q32",
      type: "long",
      question: "Explain the phenomenon of 'atmospheric refraction' and use it to explain: (a) Why the sun is visible about 2 minutes before actual sunrise and 2 minutes after actual sunset. (b) Why stars twinkle but planets do not.",
      correctAnswer: "Atmospheric Refraction:\nEarth's atmosphere is not uniform — it has layers of varying density (denser near the ground, rarer higher up). As light travels through these layers, it continuously refracts (bends). This bending is called atmospheric refraction.\n\n(a) Early Sunrise / Extended Sunset:\nBefore actual sunrise, when the sun is still below the horizon, its light enters Earth's atmosphere. The atmosphere acts like an optical medium with gradually increasing density. Sunlight bends (refracts) as it curves around the Earth towards our eyes. We see the sun's image before the actual disc has crossed the horizon. The same happens at sunset — we see the sun after it has actually set below the horizon. This extends our day by about 4 minutes total (2 min each end).\n\n(b) Stars Twinkle, Planets Don't:\n• Stars are enormous distances away, appearing as point sources of light.\n• As starlight passes through the atmosphere with constantly changing density (winds, temperature), the refraction changes rapidly and randomly. The star's apparent position and brightness fluctuate → twinkling.\n• Planets are much closer to Earth and appear as extended discs (a collection of many point sources). The random fluctuations in refraction average out across the disc, so no net twinkling is observed.",
      explanation: "Atmospheric refraction explains both phenomena. The key to the star/planet difference is 'point source vs extended disc' — the averaging effect.",
      points: 20
    },
    {
      id: "t4q33",
      type: "long",
      question: "A coin is placed at the bottom of a container that is 20 cm deep and filled with water (n = 1.33). Find the apparent depth of the coin as seen from above. How does the apparent depth change if the water is replaced with glass (n = 1.5)?",
      correctAnswer: "Formula: Apparent depth = Real depth / n.\n\nWith water ($n = 1.33$):\nApparent depth = $20 / 1.33 \\approx 15.04$ cm.\nThe coin appears to be only about 15 cm below the surface.\n\nWith glass ($n = 1.5$):\nApparent depth = $20 / 1.5 \\approx 13.33$ cm.\nThe coin appears even shallower — only about 13.3 cm below.\n\nConclusion: As refractive index increases, apparent depth DECREASES. The object appears even closer to the surface. This is because a higher refractive index means more bending — the refracted rays appear to come from a point higher up than the actual position.",
      explanation: "Apparent depth formula: Apparent depth = Real depth / n. Higher n → shallower apparent depth. This causes pools to look shallower than they are.",
      points: 20
    },

    // --- HOTS Set 2 ---
    {
      id: "t4q34",
      type: "thinking",
      question: "A diver under water looks upward at an angle. Explain why she can only see the outside world within a cone. Calculate the half-angle of this cone if $n_{water} = 4/3$.",
      correctAnswer: "Explanation:\nLight from the outside world enters water and refracts. Conversely, light from inside water trying to reach the diver's eyes from outside can only enter through a cone-shaped window in the surface (called 'Snell's window').\n\nAt the critical angle for water-air, light from outside world strikes at $90^\\circ$ (grazing incidence from outside → enters water at exactly the critical angle). Beyond this 'window', TIR prevents outside light from entering.\n\nCalculation:\n$\\sin \\theta_c = n_{rarer}/n_{denser} = 1 / (4/3) = 3/4 = 0.75$.\n$\\theta_c = \\sin^{-1}(0.75) \\approx 48.6^\\circ$.\n\nThe diver sees the entire above-water world compressed into a circular cone of half-angle $\\approx 48.6^\\circ$ around the vertical. Outside this cone, only the reflections from the underwater environment are visible (TIR).",
      explanation: "Snell's window is a real phenomenon seen by divers. The circular window corresponds directly to the critical angle — an elegant application of TIR.",
      points: 25
    },
    {
      id: "t4q35",
      type: "thinking",
      question: "When you look at a rainbow, you see red on the outer arc and violet on the inner arc. Using your knowledge of refractive index and refraction, explain why this is the case. Which colour has a higher refractive index in glass — red or violet?",
      correctAnswer: "Dispersion and Refractive Index:\nWhite light (sunlight) contains all wavelengths (colours) of the visible spectrum. The refractive index of any material VARIES with wavelength (colour) — this is called dispersion.\n\nViolet light has a HIGHER refractive index than red light in glass/water. (General rule: shorter wavelength = higher n). This means violet bends MORE than red when entering a prism or water droplet.\n\nRainbow Formation:\n1. Sunlight enters millions of tiny water droplets in the sky.\n2. Inside the droplet, light undergoes refraction + internal reflection + refraction again.\n3. The different colours exit the droplet at slightly different angles due to their different refractive indices.\n4. Violet light exits at a smaller angle (~40°) to the sun-observer line.\n5. Red light exits at a larger angle (~42°).\n6. Since violet exits at a smaller angle to the sun direction, it comes from droplets lower in the sky (inner arc). Red comes from droplets higher up (outer arc).\n\nConclusion: Violet has a higher refractive index in water/glass than red light.",
      explanation: "Understanding the rainbow requires combining wavelength-dependent refractive index with the geometry of spherical water droplets — a beautiful application of optics.",
      points: 25
    },

    /* ── Additional Questions Set 3 (t4q36 to t4q50) ── */

    /* MCQ Set 3 */
    {
      id: "t4q36",
      type: "mcq",
      question: "A ray of light travels from air (n = 1) into glass (n = 1.5). If the angle of incidence is 30°, the angle of refraction is approximately:",
      options: ["30°", "45°", "19.47°", "48.59°"],
      correctAnswer: "19.47°",
      explanation: "Snell's law: n₁ sin θ₁ = n₂ sin θ₂ → 1 × sin 30° = 1.5 × sin θ₂ → sin θ₂ = 0.5/1.5 = 0.333. θ₂ = sin⁻¹(0.333) ≈ 19.47°. The ray bends TOWARDS the normal when entering a denser medium — angle decreases from 30° to 19.47°.",
      points: 10
    },
    {
      id: "t4q37",
      type: "mcq",
      question: "The refractive index of diamond is 2.42. The speed of light in diamond is approximately:",
      options: [
        "7.3 × 10⁷ m/s",
        "1.24 × 10⁸ m/s",
        "2.42 × 10⁸ m/s",
        "3 × 10⁸ m/s"
      ],
      correctAnswer: "1.24 × 10⁸ m/s",
      explanation: "n = c/v → v = c/n = (3 × 10⁸)/2.42 ≈ 1.24 × 10⁸ m/s. Diamond has an extremely high refractive index (2.42), meaning light travels at only 41% of its vacuum speed inside diamond. This extremely slow speed inside diamond, combined with its critical angle of only 24.4°, causes total internal reflection inside the gem — making diamonds sparkle.",
      points: 10
    },
    {
      id: "t4q38",
      type: "mcq",
      question: "A glass slab of thickness 5 cm and refractive index 1.5 is placed in the path of a light ray. The lateral shift of the emergent ray compared to the incident ray is:",
      options: [
        "Zero — it shifts only in angle",
        "Greater than 5 cm",
        "A non-zero value less than 5 cm",
        "Exactly 5 cm"
      ],
      correctAnswer: "A non-zero value less than 5 cm",
      explanation: "A glass slab produces lateral displacement (shift) of a ray without changing its direction. The emergent ray is parallel to the incident ray but shifted sideways. The shift depends on thickness, refractive index, and angle of incidence. It is always less than the thickness of the slab and greater than zero (for non-zero angle of incidence). This is why objects appear shifted when seen through a glass slab.",
      points: 10
    },
    {
      id: "t4q39",
      type: "mcq",
      question: "Which of the following correctly states Snell's Law?",
      options: [
        "n₁ cos θ₁ = n₂ cos θ₂",
        "sin θ₁ / sin θ₂ = n₁ / n₂",
        "n₁ sin θ₁ = n₂ sin θ₂",
        "n₂ sin θ₁ = n₁ sin θ₂"
      ],
      correctAnswer: "n₁ sin θ₁ = n₂ sin θ₂",
      explanation: "Snell's Law: n₁ sin θ₁ = n₂ sin θ₂. This can be rearranged as sin θ₁/sin θ₂ = n₂/n₁. Note: the refractive index is on the OPPOSITE side from the angle. When going into a denser medium (n₂ > n₁), sin θ₂ < sin θ₁, so θ₂ < θ₁ — the ray bends toward the normal.",
      points: 10
    },
    {
      id: "t4q40",
      type: "mcq",
      question: "The apparent depth of a fish in water (n = 1.33) is 60 cm from the surface as seen by a person above. The actual depth of the fish is:",
      options: ["45 cm", "60 cm", "79.8 cm", "80 cm"],
      correctAnswer: "79.8 cm",
      explanation: "Apparent Depth = Real Depth / n → Real Depth = Apparent Depth × n = 60 × 1.33 = 79.8 cm. Fish appears shallower than it actually is because light bends away from the normal when exiting water into air. The fish is actually at 79.8 cm, but appears to be at only 60 cm — important for spearfishing: aim deeper than the apparent position!",
      points: 10
    },

    /* Short Answer Set 3 */
    {
      id: "t4q41",
      type: "short",
      question: "Define refractive index. Give its formula and state two factors that affect it.",
      options: [],
      correctAnswer: "Refractive Index (n): The ratio of the speed of light in vacuum (c) to its speed in the given medium (v).\nFormula: n = c/v = sin(angle of incidence) / sin(angle of refraction)\n\nFactors affecting refractive index:\n1. Nature of the medium (optical density): Denser media (glass, diamond) have higher n because they slow light more.\n2. Wavelength of light: Shorter wavelengths (violet) are refracted more than longer wavelengths (red) — this causes dispersion. n is slightly different for each color.",
      explanation: "Refractive index has no unit (it is a ratio). It is always ≥ 1 for real media (since light is always slower in matter than in vacuum). It depends on the medium AND the wavelength of light.",
      points: 15
    },
    {
      id: "t4q42",
      type: "short",
      question: "State the two laws of refraction of light.",
      options: [],
      correctAnswer: "First Law of Refraction:\nThe incident ray, the refracted ray, and the normal to the interface at the point of incidence — all three lie in the same plane.\n\nSecond Law of Refraction (Snell's Law):\nThe ratio of the sine of the angle of incidence to the sine of the angle of refraction is a constant for a given pair of media and for a given colour of light:\nsin(i) / sin(r) = n₂₁ (a constant called the refractive index of medium 2 with respect to medium 1).\nOr equivalently: n₁ sin θ₁ = n₂ sin θ₂.",
      explanation: "Both laws must be stated for full marks. The first law is about geometry (coplanarity), the second law gives the mathematical relationship (Snell's Law).",
      points: 15
    },
    {
      id: "t4q43",
      type: "short",
      question: "A ray of light travels from water (n = 1.33) into glass (n = 1.5). Does it bend towards or away from the normal? Calculate the refraction angle if the angle of incidence in water is 45°.",
      options: [],
      correctAnswer: "Glass (n = 1.5) is denser than water (n = 1.33), so the ray enters a denser medium → it bends TOWARDS the normal (angle decreases).\n\nSnell's law: n₁ sin θ₁ = n₂ sin θ₂\n1.33 × sin 45° = 1.5 × sin θ₂\n1.33 × 0.7071 = 1.5 × sin θ₂\n0.9404 = 1.5 × sin θ₂\nsin θ₂ = 0.9404 / 1.5 = 0.627\nθ₂ = sin⁻¹(0.627) ≈ 38.8°\nRefraction angle ≈ 38.8° (less than 45°, confirming bending towards normal).",
      explanation: "When going from less dense to more dense (both n > 1), the ray bends towards normal. The key comparison is n₁ vs n₂, not the medium names.",
      points: 15
    },
    {
      id: "t4q44",
      type: "short",
      question: "Why does a pencil appear bent when placed in a glass of water at an angle? Explain using refraction.",
      options: [],
      correctAnswer: "The pencil appears bent (broken) because of refraction at the water-air interface.\n\nExplanation:\nLight rays from the submerged part of the pencil travel from water (denser, n = 1.33) into air (rarer, n = 1). When entering a less dense medium, light bends AWAY from the normal. So the rays from the underwater part emerge at different angles than their actual path.\n\nWhen the observer's eye traces these refracted rays backwards in a straight line, they appear to come from a higher position than the actual pencil tip. This makes the pencil appear to bend upward at the water surface.\n\nThe bending is more pronounced at greater angles of incidence — this is why the pencil appears more bent when more tilted.",
      explanation: "The bent pencil is one of the most classic demonstrations of refraction. Understanding it requires tracing the actual light path and the apparent path separately.",
      points: 15
    },
    {
      id: "t4q45",
      type: "short",
      question: "The refractive index of glass with respect to air is 3/2, and of water with respect to air is 4/3. Find the refractive index of glass with respect to water.",
      options: [],
      correctAnswer: "Given: ₐnᵍ = 3/2 (glass w.r.t. air), ₐnʷ = 4/3 (water w.r.t. air).\n\nUsing the chain rule for refractive indices:\nₙᵍ (glass w.r.t. water) = ₐnᵍ / ₐnʷ = (3/2) ÷ (4/3) = (3/2) × (3/4) = 9/8 = 1.125.\n\nThe refractive index of glass with respect to water is 9/8 = 1.125.\nSince 1.125 > 1, glass is optically denser than water — light slows down when going from water into glass.",
      explanation: "The chain rule: n(A w.r.t. C) = n(A w.r.t. B) × n(B w.r.t. C). This is frequently asked in boards and entrances.",
      points: 15
    },

    /* Long Answer Set 3 */
    {
      id: "t4q46",
      type: "long",
      question: "Explain the phenomenon of refraction of light through a glass slab. What is lateral displacement? How does it depend on (a) angle of incidence, (b) thickness of slab, (c) refractive index?",
      options: [],
      correctAnswer: "Refraction through Glass Slab:\nWhen a ray hits a glass slab:\n1. At first surface (air→glass): Ray bends TOWARDS normal (enters denser medium).\n2. Travels through glass (straight line).\n3. At second surface (glass→air): Ray bends AWAY from normal (enters rarer medium).\n\nSince both surfaces are parallel, the emergent ray is parallel to the incident ray but shifted sideways. This shift is called LATERAL DISPLACEMENT.\n\nFormula: d = t × sin(i − r) / cos(r)\nwhere d = lateral displacement, t = thickness, i = angle of incidence, r = angle of refraction.\n\n(a) Effect of angle of incidence (i):\nHigher angle of incidence → more lateral displacement. At i = 0° (normal incidence), lateral displacement = 0. At larger angles, displacement increases.\n\n(b) Effect of thickness (t):\nMore thickness → more lateral displacement (direct proportionality).\n\n(c) Effect of refractive index (n):\nHigher n → smaller r (more bending at first surface) → (i − r) increases → more lateral displacement.\n\nConclusion: A glass slab changes the position of a ray (lateral shift) but NOT its direction — the emergent ray remains parallel to the incident ray.",
      explanation: "The glass slab result — unchanged direction, lateral shift — is important for many optical instruments and explains why glass windows don't distort our view of the outside world.",
      points: 20
    },
    {
      id: "t4q47",
      type: "long",
      question: "Compare and contrast refraction at a plane surface and refraction by a glass slab. A student says 'a glass slab acts like two opposite prisms.' Is this correct? Explain.",
      options: [],
      correctAnswer: "Refraction at a Plane Surface:\n• Single interface (one medium to another).\n• Ray changes direction (bends) permanently.\n• Emergent ray is NOT parallel to incident ray (unless normal incidence).\n• Example: Pencil appearing bent in water.\n\nRefraction through a Glass Slab:\n• Two interfaces (air→glass→air), both parallel.\n• First interface bends ray one way; second interface bends it back equally.\n• Net direction change = ZERO — emergent ray is parallel to incident ray.\n• Only lateral displacement occurs.\n• Example: Viewing through window glass — direction unchanged.\n\nIs 'Two opposite prisms' correct? PARTIALLY YES:\n• A glass slab CAN be thought of as two prisms placed base-to-base (or apex-to-apex). The first prism deviates the ray one way; the second reverses it.\n• This analogy explains why the direction is restored but lateral shift remains.\n• However, prisms have non-parallel surfaces and cause net deviation. A slab has parallel surfaces ensuring zero net deviation.\n\nConclusion: The analogy is helpful but not perfectly accurate — prisms deviate, slabs don't.",
      explanation: "This comparison reveals the fundamental geometry that determines optical behaviour: parallel surfaces = zero net deviation; non-parallel surfaces = deviation.",
      points: 20
    },

    /* HOTS Set 3 */
    {
      id: "t4q48",
      type: "thinking",
      question: "A swimming pool appears to be 1.5 m deep when viewed from outside. The refractive index of water is 1.33. (a) Find the actual depth. (b) A swimmer at the bottom looks up at a person standing at the edge — does the person appear to be at a greater or lesser height? Calculate the apparent height if the person is 1.8 m tall and the person's feet are at the water surface.",
      options: [],
      correctAnswer: "(a) Actual depth:\nApparent depth = Real depth / n → Real depth = 1.5 × 1.33 = 1.995 ≈ 2 m.\nActual pool depth ≈ 2 m.\n\n(b) Swimmer looking up:\nNow the observer is in water (n = 1.33) looking into air (n = 1.0).\nRefractive index of air w.r.t. water = 1/1.33 ≈ 0.75.\nApparent depth formula: Apparent distance = Real distance × (n_observer / n_object medium).\nHere: Apparent height = Real height × (n_water / n_air) = 1.8 × 1.33 = 2.394 m.\n\nThe person appears TALLER to the swimmer (2.39 m instead of 1.8 m), because now the observer is in the denser medium looking into the rarer medium — the effect is reversed. Objects in air appear farther/taller to an observer in water.\n\nThis is why divers wearing goggles (which trap air) see objects their normal size, but without goggles, the water directly on the eye makes objects appear larger.",
      explanation: "Refraction effects are asymmetric: from air into water, objects appear closer/shallower. From water into air, objects appear farther/taller. The key is identifying which medium the observer is in.",
      points: 25
    },
    {
      id: "t4q49",
      type: "thinking",
      question: "Snell's Law can be derived from Fermat's Principle of Least Time, which states that light takes the path that minimizes travel time. Using this principle (without calculus), explain qualitatively why light bends towards the normal when entering a denser medium.",
      options: [],
      correctAnswer: "Fermat's Principle: Light takes the path that minimizes total travel time.\n\nSetup: Light travels from point A in air (fast medium) to point B in glass (slow medium).\n\nCase 1 — Straight line (no bending):\nLight goes straight through. It spends equal amounts of path in each medium. Total time = distance_air/c + distance_glass/v_glass.\n\nCase 2 — Bending towards normal:\nBy bending towards normal at the interface, the ray spends a bit more distance in air (fast) and a bit less distance in glass (slow). Since glass is slower, reducing the distance in glass saves significant time. The extra air distance costs relatively little time (since speed is high in air).\n\nOptimal path:\nFermat's principle predicts the exact path that minimizes total time — this turns out to be exactly the path predicted by Snell's Law (n₁ sin θ₁ = n₂ sin θ₂).\n\nIntuitive analogy: A lifeguard running on sand (fast) to save a swimmer in water (slow) should run farther along the beach before entering the water — spending more time in the fast medium and less in the slow medium. This exactly parallels how light refracts!",
      explanation: "Fermat's Principle provides a beautiful physical motivation for Snell's Law without equations. The lifeguard analogy makes the physics intuitive and memorable.",
      points: 25
    },
    {
      id: "t4q50",
      type: "thinking",
      question: "Optical fibres carry data as light pulses. A single fibre has a core (n = 1.62) and cladding (n = 1.52). (a) Calculate the critical angle. (b) For total internal reflection in 1 km of fibre, how many reflections occur if the fibre has diameter 0.1 mm and the ray travels at 30° to the axis?",
      options: [],
      correctAnswer: "(a) Critical angle:\nsin C = n₂/n₁ = 1.52/1.62 = 0.938.\nC = sin⁻¹(0.938) ≈ 69.6°.\nFor TIR, angle of incidence at the core-cladding boundary must exceed 69.6°.\n\n(b) Number of reflections:\nIf the ray travels at 30° to the axis, it makes an angle of 90° − 30° = 60° with the normal to the fibre wall. But 60° < 69.6° (critical angle) — this ray would NOT undergo TIR and would leak out! \n\nFor a valid calculation, let's say the ray travels at 10° to the axis:\nAngle with normal = 90° − 10° = 80° > 69.6° ✓ (TIR occurs).\nFor each reflection, the ray travels across the diameter (0.1 mm) at 10° to axis.\nHorizontal distance per reflection = d/tan(10°) = 0.1mm / 0.176 = 0.568 mm.\nIn 1 km = 10⁶ mm: reflections = 10⁶ / 0.568 ≈ 1.76 million reflections per kilometre!\n\nDespite 1.76 million reflections per km, modern optical fibres lose <0.2 dB per km — nearly perfect TIR for broadband data transmission.",
      explanation: "This problem combines critical angle calculation with the practical geometry of optical fibre design — showing why TIR-based fibres can carry terabits of data per second.",
      points: 25
    }
  ]
};
