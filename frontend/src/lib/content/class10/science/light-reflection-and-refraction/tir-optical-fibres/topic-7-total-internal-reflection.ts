/**
 * FILE: topic-7-total-internal-reflection.ts
 * LOCATION: src/lib/content/class10/science/light-reflection-and-refraction/tir-optical-fibres/topic-7-total-internal-reflection.ts
 *
 * PURPOSE:
 *   Comprehensive content for Topic 7 of the Light – Reflection and Refraction chapter:
 *   "Total Internal Reflection and Optical Fibres."
 *
 *   This topic covers the concept of TIR (the complete reflection of a ray at a
 *   medium boundary when the angle of incidence exceeds the critical angle), the
 *   critical angle formula, real-life phenomena (mirages, sparkling diamonds,
 *   optical fibres, prism periscopes), and worked numerical examples.
 *
 * CONTENT STRUCTURE:
 *   1. Concept of TIR — what it is and why it happens
 *   2. Critical Angle — definition, formula, and table of values
 *   3. Conditions required for TIR
 *   4. Natural phenomena caused by TIR (mirages, sparkling gems, looming)
 *   5. Applications of TIR (optical fibres, prism periscopes, endoscopes)
 *   6. Exam Summary — quick-revision cards
 *   7. Practice Questions (40 total: 10 MCQ, 10 Short, 10 Long, 10 HOTS)
 *
 * SIMULATIONS USED:
 *   - light-tir            : Interactive TIR demo — drag angle to find critical angle
 *   - light-optical-fiber  : Animated optical fibre cross-section with TIR bounces
 *   - light-tir-explorer   : Critical angle calculator across different media
 *   - light-snell-calculator: Snell's law sandbox
 *
 * LAST UPDATED: 2026-06-08
 * AUTHOR NOTE: Every formula uses double-backslash (\\) because the content is
 *              inside a JavaScript template literal that is parsed by parseMarkdown.
 */

import { Topic } from "../../shared-types";

export const topic7TotalInternalReflection: Topic = {
  id: "total-internal-reflection",
  title: "7. Total Internal Reflection and Optical Fibres",
  estimatedMinutes: 55,
  simulationIds: [
    /* Dedicated critical angle interactive lab */
    "critical-angle-sim",         /* drag θ past θc → TIR snaps on — Glass/Water/Diamond/Fibre */
    /* New dedicated Topic 7 simulations */
    "light-tir-critical-angle",   /* drag angle → watch TIR snap on/off */
    "light-fiber-optic-path",     /* animated photon bouncing through bent fibre */
    "light-mirage-formation",     /* hot road → curved rays → virtual mirage */
    "light-diamond-sparkle",      /* gem facet ray tracing with TIR bounces */
    "light-snell-tir-calc",       /* n₁/n₂ sliders → live critical angle */
    /* Shared simulations from other topics */
    "light-tir",
    "light-tir-explorer",
    "light-optical-fiber",
    "light-snell-calculator",
  ],
  imageUrl: "/images/light/topic7-tir-optical-fibre.png",

  content: `
### What is Total Internal Reflection?

Imagine you are underwater in a swimming pool, looking up at the surface at a steep angle. You can see the sky and objects above the water. But as you tilt your gaze more and more towards the surface (increasing the angle with the normal), at a certain critical angle something remarkable happens — **the surface acts like a perfect mirror**. You can no longer see anything above the water at all. This is **Total Internal Reflection (TIR)**.

**Definition:**
> Total Internal Reflection is the phenomenon where light travelling from an optically denser medium to an optically rarer medium is completely reflected back into the denser medium when the angle of incidence in the denser medium exceeds a critical angle.

No light escapes into the rarer medium — 100% of the incident light is reflected. This is why it is called *total*.

---

### How Does TIR Happen? — Step by Step

Let's trace a ray of light going from glass (denser) to air (rarer):

**Case 1: Small angle of incidence ($i < i_c$)**
The ray partially refracts into air (bending away from the normal, $\\angle r > \\angle i$) and a small portion is also reflected. This is normal partial reflection.

**Case 2: Angle equals critical angle ($i = i_c$)**
The refracted ray grazes along the boundary surface — its angle of refraction becomes exactly $90^\\circ$. The refracted ray travels along the interface. This is the boundary condition for TIR.

**Case 3: Angle greater than critical angle ($i > i_c$)**
No refraction at all. All the light is reflected back into the denser medium following the normal laws of reflection. This is Total Internal Reflection.

---

### The Critical Angle

**Definition:**
> The critical angle ($i_c$) is the angle of incidence in the denser medium for which the angle of refraction in the rarer medium is exactly $90^\\circ$.

**Formula — Deriving the Critical Angle:**
Apply Snell's Law at the boundary between denser medium (refractive index $n$) and rarer medium (air, refractive index = 1):

$$n_1 \\sin(i_c) = n_2 \\sin(90^\\circ)$$

$$n \\times \\sin(i_c) = 1 \\times 1$$

$$\\boxed{\\sin(i_c) = \\frac{1}{n}}$$

where $n$ is the absolute refractive index of the denser medium.

This means: **Higher the refractive index, smaller the critical angle.**

---

### Critical Angles for Common Materials

| Material | Refractive Index ($n$) | Critical Angle ($i_c$) |
| :--- | :---: | :---: |
| Water | 1.33 | $48.75^\\circ$ |
| Glass (ordinary) | 1.50 | $41.8^\\circ$ |
| Dense glass | 1.70 | $36^\\circ$ |
| Diamond | 2.42 | $24.4^\\circ$ |
| Silicon | 3.42 | $17^\\circ$ |

> **Diamond's sparkle:** Diamond has a very high refractive index (2.42) and therefore a very small critical angle ($24.4^\\circ$). Diamond cutters shape diamonds so that most light undergoes TIR many times inside before finally emerging through the top facets. This causes the brilliant sparkle seen in a cut diamond — light bounces multiple times internally before escaping.

---

### Two Essential Conditions for TIR

TIR occurs ONLY when both conditions are simultaneously satisfied:

1. **Light must travel from optically denser to optically rarer medium.**
   (From glass → air, water → air, glass → water, etc. NOT air → glass.)

2. **The angle of incidence must exceed the critical angle.**
   ($\\angle i > i_c$)

If either condition fails, TIR does not occur and some light is refracted.

---

### Real-Life Phenomena Due to TIR

#### 1. Mirage — The Desert Illusion
On a very hot day, the ground heats the air immediately above it. This hot air near the ground is less dense (optically rarer) than the cooler air higher up. As a ray of light from the sky curves downward through layers of increasingly hotter air, the angle of incidence progressively increases until it exceeds the critical angle.

The light ray undergoes TIR and curves back upward. A distant observer sees this upward-curved light ray and interprets it as a reflection from water on the ground. This creates the **mirage** — an illusion of water in a desert or on a hot road.

*Real Life Example:* On a hot summer road, you see what looks like a puddle of water ahead. As you drive towards it, it disappears. This is a mirage caused by TIR in hot air layers.

#### 2. Sparkling of Diamonds
The critical angle of diamond is very small ($\\approx 24^\\circ$). A diamond cutter exploits this: most light entering the diamond's top facets hits the angled bottom faces at angles greater than $24^\\circ$, causing multiple total internal reflections. Eventually, the light exits through the top with maximum brightness. Poorly cut diamonds leak light from the bottom and appear dull.

#### 3. Shining of Air Bubble in Water
An air bubble in water acts as a small rarer-medium pocket. Light hitting the bubble from outside (water, denser) at angles beyond the critical angle undergoes TIR, making the bubble appear shiny/silvery rather than transparent.

#### 4. Optical Illusion of Looming (Arctic)
In polar regions, cold air near the ocean surface is denser than warmer air above. A ray of light curves upward, bends back down, creating mirages of ships or islands that appear to float above the horizon.

---

### Optical Fibres — TIR in Technology

**What is an Optical Fibre?**
An optical fibre is a thin, flexible strand of very pure glass or plastic, typically with a diameter of $8–62.5$ micrometres. It uses TIR to transmit light (and thus data) over very long distances with minimal loss.

**Structure of an Optical Fibre:**
*   **Core:** The central glass strand with higher refractive index ($n_1$).
*   **Cladding:** An outer layer of glass/plastic with lower refractive index ($n_2 < n_1$).
*   **Buffer Coating:** A protective plastic jacket around the cladding.

**Working Principle:**
A light ray enters the fibre core at one end. When it hits the core-cladding boundary, it does so at an angle greater than the critical angle (because $n_1 > n_2$). TIR occurs at the boundary. The ray bounces from wall to wall along the entire length of the fibre without any loss of intensity due to refraction.

$$\\text{Condition: } \\angle i > i_c = \\arcsin\\left(\\frac{n_2}{n_1}\\right)$$

**Why is TIR better than a mirror for fibres?**
*   A mirror absorbs and reflects light with about $95\\%$ efficiency. Over thousands of reflections, significant light is lost.
*   TIR reflects $100\\%$ of the light (when $i > i_c$). No energy is lost to refraction.
*   Result: Light can travel thousands of kilometres with minimal signal loss.

**Applications of Optical Fibres:**

| Application | How It Works |
| :--- | :--- |
| **Internet & Telecom** | Encodes data as pulses of light; transfers billions of bits per second |
| **Medical Endoscopes** | Fibre bundles carry light into the body AND return images to the doctor |
| **Cable TV** | Transmits thousands of TV channels simultaneously through one fibre |
| **Fibre Optic Sensors** | Detect temperature, pressure, chemicals in industrial plants |
| **Decorative Lighting** | Flexible, glowing lighting effects |

**Advantages over Copper Wire:**
1. Much higher data transfer rate (bandwidth)
2. No electrical interference or crosstalk
3. Lighter and thinner
4. Much longer distances without signal boosters
5. Completely immune to electromagnetic interference

---

### Prism Periscope Using TIR

A traditional periscope uses two plane mirrors at $45^\\circ$. A better design uses two right-angle glass prisms. When light hits the hypotenuse face of the prism at $45^\\circ$ (greater than the critical angle of glass ≈ $41.8^\\circ$), TIR occurs. The image is much brighter than with silvered mirrors (which absorb some light). This is used in submarine periscopes and binoculars.

---

### Comparison: TIR vs Ordinary Reflection

| Property | Total Internal Reflection | Ordinary Mirror Reflection |
| :--- | :--- | :--- |
| Medium requirement | Denser to rarer | Any surface |
| Condition | $\\angle i > i_c$ | Always occurs |
| Efficiency | 100% (no loss) | ~95% (some absorption) |
| Refraction | None | None (reflection only) |
| Applications | Optical fibres, diamonds | Mirrors, periscopes |

---

### Numericals — Worked Examples

**Example 1:**
The refractive index of glass is 1.5. Find the critical angle for the glass-air interface.

*Solution:*
$$\\sin(i_c) = \\frac{1}{n} = \\frac{1}{1.5} = 0.6667$$
$$i_c = \\arcsin(0.6667) \\approx 41.8^\\circ$$

**Example 2:**
The critical angle for a certain transparent medium to air is $30^\\circ$. Find the refractive index of the medium.

*Solution:*
$$\\sin(i_c) = \\frac{1}{n} \\implies n = \\frac{1}{\\sin(30^\\circ)} = \\frac{1}{0.5} = 2.0$$

---

### Exam Summary

#### 📌 Key Definitions
*   **TIR:** Complete reflection of light back into the denser medium; no refraction occurs; $\\angle i > i_c$.
*   **Critical Angle ($i_c$):** Angle of incidence in denser medium for which refraction angle = $90^\\circ$.
*   **Formula:** $\\sin(i_c) = \\frac{1}{n}$ (where $n$ = refractive index of denser medium relative to air/rarer medium).

#### 📌 Two Conditions for TIR
1. Light travels from denser to rarer medium.
2. $\\angle i > i_c$ (angle of incidence exceeds critical angle).

#### 📌 Critical Angles to Remember
*   Water: $\\approx 48.75^\\circ$
*   Glass: $\\approx 41.8^\\circ$
*   Diamond: $\\approx 24.4^\\circ$

#### 📌 Key Applications
*   **Optical fibres** — TIR carries light/data with 100% efficiency over long distances.
*   **Diamond sparkle** — low critical angle causes multiple TIR inside the gem.
*   **Mirages** — TIR in hot air layers near ground creates water illusion.
*   **Prism periscopes** — TIR at $45^\\circ$ prism face instead of silver mirror.
*   **Endoscopes** — fibre bundles carry light and images for medical imaging.

#### 📌 Formula Sheet
| Formula | Use |
| :--- | :--- |
| $\\sin(i_c) = 1/n$ | Find critical angle from refractive index |
| $n = 1/\\sin(i_c)$ | Find refractive index from critical angle |
| $n_1 \\sin \\theta_1 = n_2 \\sin \\theta_2$ | Snell's Law at boundary |
`,

  questions: [
    // ═══════════════════════════════════════════
    // MCQ QUESTIONS (10 total)
    // ═══════════════════════════════════════════

    {
      id: "t7q1",
      type: "mcq",
      question: "Total Internal Reflection occurs when light travels from:",
      options: [
        "Rarer medium to denser medium",
        "Denser medium to rarer medium at angles greater than the critical angle",
        "Any medium to any other medium",
        "Denser medium to rarer medium at any angle"
      ],
      correctAnswer: "Denser medium to rarer medium at angles greater than the critical angle",
      explanation: "TIR requires two conditions: (1) light must go from denser to rarer medium, AND (2) the angle of incidence must exceed the critical angle. Both must hold simultaneously.",
      points: 10
    },
    {
      id: "t7q2",
      type: "mcq",
      question: "If the refractive index of a medium is 2, the critical angle for the medium-air interface is:",
      options: [
        "$60^\\circ$",
        "$45^\\circ$",
        "$30^\\circ$",
        "$90^\\circ$"
      ],
      correctAnswer: "$30^\\circ$",
      explanation: "$\\sin(i_c) = 1/n = 1/2 = 0.5$. Therefore $i_c = \\arcsin(0.5) = 30^\\circ$.",
      points: 10
    },
    {
      id: "t7q3",
      type: "mcq",
      question: "Which material has the smallest critical angle?",
      options: [
        "Water (n = 1.33)",
        "Glass (n = 1.50)",
        "Diamond (n = 2.42)",
        "Ice (n = 1.31)"
      ],
      correctAnswer: "Diamond (n = 2.42)",
      explanation: "$\\sin(i_c) = 1/n$. Higher $n$ → smaller $i_c$. Diamond has the highest refractive index so smallest critical angle (~24.4°). This is why diamonds sparkle: light bounces multiple times inside before escaping.",
      points: 10
    },
    {
      id: "t7q4",
      type: "mcq",
      question: "In an optical fibre, light is transmitted by:",
      options: [
        "Refraction at the core-cladding interface",
        "Total internal reflection at the core-cladding interface",
        "Diffraction through the fibre",
        "Absorption and re-emission of light"
      ],
      correctAnswer: "Total internal reflection at the core-cladding interface",
      explanation: "The core has a higher refractive index than the cladding. Light hitting the boundary at angles greater than the critical angle undergoes TIR, bouncing along the entire length of the fibre without loss.",
      points: 10
    },
    {
      id: "t7q5",
      type: "mcq",
      question: "A mirage is caused by:",
      options: [
        "Reflection of light from a pool of water",
        "Refraction of light through water vapour",
        "Total internal reflection of light in hot air layers near the ground",
        "Diffraction of light around obstacles"
      ],
      correctAnswer: "Total internal reflection of light in hot air layers near the ground",
      explanation: "Hot air near the ground is less dense (rarer). Light from the sky curves downward through denser cool air to rarer hot air. When the critical angle is exceeded, TIR curves the ray back upward, creating the illusion of water.",
      points: 10
    },
    {
      id: "t7q6",
      type: "mcq",
      question: "At the critical angle, the angle of refraction is:",
      options: [
        "$0^\\circ$",
        "$45^\\circ$",
        "$90^\\circ$",
        "Equal to the angle of incidence"
      ],
      correctAnswer: "$90^\\circ$",
      explanation: "The critical angle is defined as the angle of incidence in the denser medium for which the angle of refraction in the rarer medium equals exactly 90°. Beyond this, no refraction occurs (TIR begins).",
      points: 10
    },
    {
      id: "t7q7",
      type: "mcq",
      question: "The core of an optical fibre has a refractive index of 1.62 and cladding has n = 1.52. Light can undergo TIR at the core-cladding interface if the angle of incidence (from core) is approximately greater than:",
      options: [
        "$20^\\circ$",
        "$30^\\circ$",
        "$70^\\circ$",
        "$90^\\circ$"
      ],
      correctAnswer: "$70^\\circ$",
      explanation: "Using $\\sin(i_c) = n_2/n_1 = 1.52/1.62 = 0.938$, so $i_c = \\arcsin(0.938) \\approx 69.6^\\circ \\approx 70^\\circ$. Any angle greater than this gives TIR.",
      points: 10
    },
    {
      id: "t7q8",
      type: "mcq",
      question: "Why is optical fibre communication preferred over copper wire?",
      options: [
        "Optical fibres are cheaper",
        "Optical fibres carry more data at higher speeds with less signal loss",
        "Copper wires cannot carry electrical signals",
        "Optical fibres are heavier and more durable"
      ],
      correctAnswer: "Optical fibres carry more data at higher speeds with less signal loss",
      explanation: "Optical fibres exploit TIR for 100% internal reflection efficiency. They carry data as light pulses at very high bandwidth, with far less signal degradation over long distances compared to copper.",
      points: 10
    },
    {
      id: "t7q9",
      type: "mcq",
      question: "An air bubble trapped inside glass appears shiny and silver-like because:",
      options: [
        "Air reflects light naturally",
        "Glass absorbs all light",
        "TIR occurs at the glass-air bubble boundary (glass is denser, air is rarer)",
        "The bubble acts as a convex lens"
      ],
      correctAnswer: "TIR occurs at the glass-air bubble boundary (glass is denser, air is rarer)",
      explanation: "Light going from glass (denser, n≈1.5) to the air bubble (rarer, n=1) hits the boundary at angles often exceeding the critical angle (~42°), causing TIR. The bubble appears shiny because no light escapes through it.",
      points: 10
    },
    {
      id: "t7q10",
      type: "mcq",
      question: "Which of the following is NOT a condition for Total Internal Reflection?",
      options: [
        "Light must travel from denser to rarer medium",
        "Angle of incidence must exceed the critical angle",
        "The two media must have different refractive indices",
        "The frequency of light must be very high"
      ],
      correctAnswer: "The frequency of light must be very high",
      explanation: "TIR depends only on: (1) direction of light travel (denser→rarer) and (2) angle of incidence exceeding the critical angle. Frequency does not need to be high. The critical angle depends on the refractive index, which does depend on frequency slightly, but high frequency is NOT a required condition.",
      points: 10
    },

    // ═══════════════════════════════════════════
    // SHORT ANSWER QUESTIONS (10 total)
    // ═══════════════════════════════════════════

    {
      id: "t7q11",
      type: "short",
      question: "Define Total Internal Reflection and state the two conditions necessary for it to occur.",
      correctAnswer: "Total Internal Reflection (TIR) is the phenomenon in which a ray of light travelling from a denser medium to a rarer medium is completely reflected back into the denser medium, with no refraction, when the angle of incidence exceeds the critical angle.\n\nTwo necessary conditions:\n1. Light must travel from an optically denser medium to an optically rarer medium.\n2. The angle of incidence in the denser medium must be greater than the critical angle ($\\angle i > i_c$).",
      explanation: "Both conditions must hold simultaneously. TIR cannot occur if light is going from rarer to denser medium regardless of the angle.",
      points: 15
    },
    {
      id: "t7q12",
      type: "short",
      question: "A ray of light travels from water (n = 1.33) to air. Find the critical angle. What happens if the angle of incidence is exactly 48.75°?",
      correctAnswer: "Critical angle: $\\sin(i_c) = 1/n = 1/1.33 = 0.7519$. So $i_c = \\arcsin(0.7519) \\approx 48.75^\\circ$.\n\nAt exactly $48.75^\\circ$: The refracted ray grazes along the water-air surface (angle of refraction = 90°). This is the boundary condition for TIR. Any angle slightly greater than this will cause Total Internal Reflection.",
      explanation: "The critical angle for water is ~48.75°. This explains why you see a shimmering mirror-like surface when you look at water from below at steep angles.",
      points: 15
    },
    {
      id: "t7q13",
      type: "short",
      question: "Explain the structure of an optical fibre and describe how light is transmitted through it.",
      correctAnswer: "Structure of Optical Fibre:\n• Core: Central glass/plastic strand with high refractive index (n₁)\n• Cladding: Surrounding layer with lower refractive index (n₂ < n₁)\n• Buffer: Protective outer plastic jacket\n\nTransmission: A light pulse enters the core. When it reaches the core-cladding boundary, its angle of incidence is greater than the critical angle (since n₁ > n₂). TIR occurs — the light reflects perfectly back into the core with 100% efficiency. By repeatedly bouncing off both walls through TIR, the light travels the entire length of the fibre with minimal signal loss.",
      explanation: "The key is that the core refractive index MUST be greater than the cladding. This is what ensures TIR at the boundary.",
      points: 15
    },
    {
      id: "t7q14",
      type: "short",
      question: "What is a mirage? Explain the role of Total Internal Reflection in its formation.",
      correctAnswer: "A mirage is an optical illusion where a person sees a shimmering pool of water or an inverted image of a distant object on hot ground, even though no water is actually present.\n\nFormation via TIR:\n1. On a hot day, the ground heats air near the surface. This layer is hot, less dense, and optically rarer.\n2. Light from the sky enters from the cooler, denser air above and travels toward the hot rarer air below.\n3. At the boundary of increasingly rarer air layers, the angle of incidence increases until it exceeds the critical angle.\n4. TIR curves the ray back upward toward the observer's eye.\n5. The observer sees the sky ray apparently coming from the ground — interpreted as a reflection from water.",
      explanation: "Mirages occur in deserts and on hot roads. The 'water' you see is actually the sky being totally internally reflected by hot air near the ground.",
      points: 15
    },
    {
      id: "t7q15",
      type: "short",
      question: "State three practical advantages of optical fibres over traditional copper cables for internet communication.",
      correctAnswer: "Three advantages of optical fibres over copper cables:\n1. Higher bandwidth: Optical fibres carry much more data per second (terabits vs megabits for copper) because light has a much higher frequency than electrical signals.\n2. Less signal loss: TIR ensures 100% internal reflection. Copper wires lose energy to heat and electromagnetic interference. Optical signals travel farther without needing repeaters.\n3. Immune to electromagnetic interference: Light signals are not affected by nearby electrical equipment, magnetic fields, or radio waves. Copper wires can pick up interference.",
      explanation: "Optical fibre communication has revolutionized the internet. A single fibre can carry thousands of simultaneous phone calls or TV channels.",
      points: 15
    },
    {
      id: "t7q16",
      type: "short",
      question: "Why does a diamond sparkle more brilliantly than a piece of ordinary glass, even if cut to the same shape?",
      correctAnswer: "Diamond sparkles more brilliantly because its refractive index is much higher (n ≈ 2.42) compared to glass (n ≈ 1.5).\n\nDue to its high n, diamond has a very small critical angle (~24.4°) compared to glass (~41.8°).\n\nWhen light enters a diamond, most rays hit the facets at angles greater than 24.4° and undergo TIR multiple times inside. The light bounces around internally many more times before finally escaping through the top facets.\n\nThis multiple TIR concentrates and channels light upward, causing the characteristic brilliant sparkle. Glass has a larger critical angle, so it cannot trap and redirect light as effectively.",
      explanation: "Diamond cutters maximize TIR by cutting facets at specific angles. A poorly cut diamond wastes light by letting it leak from the bottom.",
      points: 15
    },
    {
      id: "t7q17",
      type: "short",
      question: "The critical angle for a glass-air interface is 42°. Find the refractive index of glass.",
      correctAnswer: "Using: $\\sin(i_c) = \\frac{1}{n}$\n\n$\\sin(42^\\circ) = \\frac{1}{n}$\n\n$0.6691 = \\frac{1}{n}$\n\n$n = \\frac{1}{0.6691} \\approx 1.49 \\approx 1.5$\n\nThe refractive index of glass is approximately 1.5.",
      explanation: "This is a standard formula inversion. Remember: $n = 1/\\sin(i_c)$.",
      points: 15
    },
    {
      id: "t7q18",
      type: "short",
      question: "How is TIR used in a prism periscope? Why is it better than using a plane mirror?",
      correctAnswer: "Prism Periscope using TIR:\nA right-angle prism (45°-90°-45°) is placed with its hypotenuse face vertical. Light hits the hypotenuse at 45°, which exceeds the critical angle of glass (~41.8°). TIR occurs and the ray turns exactly 90°. Two such prisms arranged one above the other create a periscope.\n\nAdvantages over plane mirrors:\n1. Efficiency: TIR reflects 100% of light; a mirror absorbs ~5%, so over two reflections a periscope loses ~10% with mirrors vs 0% with prisms.\n2. Image quality: No tarnishing (silver mirrors can deteriorate); prism glass is permanent.\n3. Brightness: The image seen through a prism periscope is noticeably brighter and clearer.",
      explanation: "Prism periscopes are used in submarines and binoculars. TIR is more efficient than metallic reflection.",
      points: 15
    },
    {
      id: "t7q19",
      type: "short",
      question: "What is an endoscope and how does it use optical fibres?",
      correctAnswer: "An endoscope is a medical instrument used to view the inside of hollow organs (stomach, intestines, lungs, joints) without surgery.\n\nHow it uses optical fibres:\n• The endoscope contains TWO bundles of optical fibres:\n  1. Illumination bundle: Carries light from an external source INTO the body to illuminate the area.\n  2. Image bundle: Carries the reflected light from inside the body BACK to a camera/eyepiece.\n• Both bundles use TIR to carry light around bends without any energy loss.\n• The fibre bundles are flexible, so the endoscope can navigate through curved body passages.\n• Modern endoscopes are thin (5–10 mm diameter) and cause minimal discomfort.",
      explanation: "Endoscopes have revolutionized medicine — they allow diagnosis and even minor surgery without large incisions.",
      points: 15
    },
    {
      id: "t7q20",
      type: "short",
      question: "Light goes from medium A (n = 1.6) to medium B (n = 1.2). Find the critical angle at the A-B boundary.",
      correctAnswer: "When both media are not air, use: $\\sin(i_c) = n_B / n_A$ (where A is denser, B is rarer).\n\n$\\sin(i_c) = \\frac{n_B}{n_A} = \\frac{1.2}{1.6} = 0.75$\n\n$i_c = \\arcsin(0.75) \\approx 48.6^\\circ$\n\nSo TIR occurs at the A-B boundary when the angle of incidence in medium A exceeds approximately 48.6°.",
      explanation: "When neither medium is air, use the ratio $n_2/n_1$ instead of $1/n$. This is an important extension of the basic formula.",
      points: 15
    },

    // ═══════════════════════════════════════════
    // LONG ANSWER QUESTIONS (10 total)
    // ═══════════════════════════════════════════

    {
      id: "t7q21",
      type: "long",
      question: "With the help of a clearly labelled diagram, explain the phenomenon of Total Internal Reflection. Show what happens at three different angles: (a) below critical angle, (b) at critical angle, (c) above critical angle.",
      correctAnswer: "Diagram Description:\nA horizontal boundary separates glass (bottom, denser) from air (top, rarer). A normal is drawn perpendicular to the boundary.\n\n(a) Below critical angle ($\\angle i < i_c$):\nA ray in glass hits the boundary. Most light refracts into air (bends away from normal, $\\angle r > \\angle i$). A small portion is also reflected back into glass. Both refracted and reflected rays exist.\n\n(b) At critical angle ($\\angle i = i_c$):\nThe refracted ray travels along the boundary surface — angle of refraction = exactly 90°. The refracted ray grazes the surface. The reflected ray follows normal law of reflection.\n\n(c) Above critical angle ($\\angle i > i_c$):\nNo refracted ray exists at all. The entire incident ray is reflected back into glass following laws of reflection ($\\angle i = \\angle r$). This is Total Internal Reflection. 100% of light stays in the denser medium.\n\nKey conclusion: TIR only occurs in the denser medium when $\\angle i > i_c$. It is a 100% efficient reflection with no energy loss to the rarer medium.",
      explanation: "A good TIR diagram shows all three cases clearly with properly labelled normal, incident, refracted, and reflected rays.",
      points: 20
    },
    {
      id: "t7q22",
      type: "long",
      question: "Derive the formula for critical angle in terms of refractive index. Use Snell's Law as your starting point.",
      correctAnswer: "Derivation of Critical Angle Formula:\n\nConsider a ray of light travelling from an optically denser medium (refractive index $n_1 = n$) to an optically rarer medium (refractive index $n_2 = 1$ for air/vacuum).\n\nApply Snell's Law at the interface:\n$$n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)$$\n\nAt the critical angle, $\\theta_1 = i_c$ and $\\theta_2 = 90°$:\n$$n \\times \\sin(i_c) = 1 \\times \\sin(90°)$$\n$$n \\sin(i_c) = 1$$\n$$\\sin(i_c) = \\frac{1}{n}$$\n$$\\boxed{i_c = \\arcsin\\left(\\frac{1}{n}\\right)}$$\n\nPhysical Interpretation:\n• As n increases, $1/n$ decreases, so $i_c$ decreases → diamonds have smaller critical angles than water.\n• At $i_c$: refracted ray is parallel to surface ($90°$) — boundary condition.\n• For $i > i_c$: Snell's Law would give $\\sin r > 1$, which is physically impossible → instead TIR occurs.",
      explanation: "The derivation starts from Snell's Law and substitutes the condition for critical angle (refraction angle = 90°). This is a common 3-mark derivation question.",
      points: 20
    },
    {
      id: "t7q23",
      type: "long",
      question: "Explain in detail how optical fibres work. Draw a cross-sectional diagram of a fibre and trace a ray of light through it. Why is TIR 100% efficient whereas metallic reflection is not?",
      correctAnswer: "Optical Fibre Cross-Section Description:\n• Innermost layer: Core — glass/plastic with high n (e.g., 1.62)\n• Middle layer: Cladding — glass with lower n (e.g., 1.52)\n• Outer layer: Buffer jacket (protective plastic)\n\nRay Tracing:\n1. A ray of light enters the core at one end (input face).\n2. The ray travels diagonally and hits the core-cladding boundary.\n3. Since n_core > n_cladding, and angle of incidence > critical angle, TIR occurs.\n4. The ray reflects perfectly and hits the opposite wall.\n5. Again, TIR occurs. The ray zig-zags along the entire fibre length.\n6. At the far end, the ray exits the core face and is collected by a detector.\n\nWhy TIR is 100% Efficient:\n• Metallic reflection: Metal atoms absorb approximately 4-5% of incident photons. Over 1000 reflections in a long fibre, this compounds to $0.95^{1000} \\approx 0$ — essentially all light is lost.\n• TIR: When conditions are met (denser to rarer, $i > i_c$), ALL light is reflected — 0% is refracted into the cladding. Over millions of reflections, the signal remains strong.\n• This is why optical fibre signals can travel 100 km or more with only minimal boosting, whereas copper electrical signals need amplifiers every few km.",
      explanation: "Optical fibre technology is one of the most impactful applications of TIR. Understanding WHY TIR is more efficient than metallic reflection is key.",
      points: 20
    },
    {
      id: "t7q24",
      type: "long",
      question: "Explain with a diagram how a mirage is formed on a hot day. Why do you see the image of a tree but not the tree itself when viewing a mirage?",
      correctAnswer: "Mirage Formation — Detailed Explanation:\n\nDiagram Description:\n• Top layer: Cool, dense air (n slightly higher)\n• Middle layers: Progressively hotter, less dense air\n• Bottom layer: Very hot air immediately above ground (n slightly lower — rarer)\n• A ray from the top of a distant tree travels downward through these layers.\n\nStep-by-Step Formation:\n1. A ray of light from the top of a tree (or from the sky) travels at a slight downward angle.\n2. As it enters progressively hotter air layers near the ground, it enters media of decreasing refractive index (rarer).\n3. At each layer boundary, the ray bends slightly away from the normal (going from denser → rarer).\n4. The cumulative bending increases the angle of incidence progressively.\n5. When the angle exceeds the critical angle in the air boundary near the ground, TIR occurs.\n6. The ray curves back upward and reaches the observer's eyes.\n7. The observer's brain assumes light travels in straight lines → traces the ray back to the ground → sees an image of the tree below the tree itself.\n\nWhy inverted image:\nThe upward-curved ray appears to come from below ground level, creating an inverted image — just like a reflection in a pool of water. The observer therefore thinks water is on the ground.\n\nWhy the 'tree' disappears as you approach:\nAs you move closer, the angle needed for TIR in the air layers is no longer met, so the mirage vanishes.",
      explanation: "A mirage is not just TIR — it's continuous TIR through gradually changing air density. Understanding this requires combining Snell's Law with temperature gradients.",
      points: 20
    },
    {
      id: "t7q25",
      type: "long",
      question: "A fibre optic cable has a core of refractive index 1.55 and cladding of refractive index 1.45. (a) Find the critical angle at the core-cladding interface. (b) What is the maximum angle at which light can enter the outer face of the core (acceptance angle) for it to undergo TIR inside? (c) What happens if the cladding is removed and the core is surrounded by air?",
      correctAnswer: "(a) Critical angle at core-cladding interface:\n$\\sin(i_c) = n_{cladding}/n_{core} = 1.45/1.55 = 0.935$\n$i_c = \\arcsin(0.935) = 69.3^\\circ$\n\n(b) Acceptance angle (numerical aperture concept):\nUsing: $\\sin(\\theta_{acceptance}) = \\sqrt{n_{core}^2 - n_{cladding}^2} = \\sqrt{1.55^2 - 1.45^2} = \\sqrt{2.4025 - 2.1025} = \\sqrt{0.30} = 0.548$\n$\\theta_{acceptance} = \\arcsin(0.548) \\approx 33.2^\\circ$\n\nLight must enter within 33.2° of the fibre axis to undergo TIR.\n\n(c) If cladding is removed (core surrounded by air, n=1):\nNew critical angle: $\\sin(i_c) = 1/1.55 = 0.645$, so $i_c \\approx 40.2^\\circ$.\nThis is smaller than 69.3°, so light is more easily trapped (acceptance angle increases).\nHOWEVER: without cladding, the core surface is exposed. Dust, scratches, and moisture on the glass surface would scatter light and cause energy loss. The cladding protects the TIR surface and ensures signal integrity over long distances.",
      explanation: "This advanced numerical question tests understanding of numerical aperture and the practical importance of cladding even though removing it would actually increase TIR range.",
      points: 20
    },
    {
      id: "t7q26",
      type: "long",
      question: "Compare and contrast Total Internal Reflection with ordinary reflection at a plane mirror in terms of: (a) efficiency, (b) conditions required, (c) applications, (d) image quality.",
      correctAnswer: "(a) Efficiency:\n• TIR: 100% of light is reflected; 0% is refracted. No energy loss whatsoever at each reflection.\n• Plane mirror: Typically 85-95% reflectance. Best silvered mirrors achieve ~97%. Some light is always absorbed by the metal coating.\n\n(b) Conditions:\n• TIR: Requires (1) light going from denser to rarer medium, (2) $\\angle i > i_c$. These must both be met.\n• Plane mirror: No special conditions. Reflection occurs for any angle of incidence on any polished surface.\n\n(c) Applications:\n• TIR: Optical fibres (internet cables), endoscopes (medical), diamond cutting (jewellery), prism periscopes (submarines), mirages (natural phenomenon).\n• Plane mirror: Household mirrors, kaleidoscopes, basic periscopes, rear-view mirrors (though convex mirrors are better).\n\n(d) Image quality:\n• TIR (in prism periscopes): Brighter images due to 100% efficiency. No tarnishing. No colour distortion.\n• Plane mirror: Slightly dimmer (some absorption). Silver mirrors can tarnish over time, reducing reflectance. Slight colour tint possible.",
      explanation: "This comparison shows WHY TIR is preferred over conventional mirrors in precision optical applications.",
      points: 20
    },
    {
      id: "t7q27",
      type: "long",
      question: "Explain how 'looming' — the optical illusion seen in Arctic/cold regions — is the opposite phenomenon to a desert mirage, yet both are caused by Total Internal Reflection.",
      correctAnswer: "Desert Mirage vs Arctic Looming — Both Due to TIR in Air:\n\nDesert Mirage:\n• Condition: Ground is very hot → hot air near ground is LESS dense (rarer, lower n) than cool air above.\n• Light from sky travels downward (from cooler denser air to hotter rarer air).\n• Successive refraction bends the ray away from normal → eventually TIR → ray curves UPWARD.\n• Observer sees sky image on the ground → appears as water pool.\n• The object appears BELOW its actual position.\n\nArctic Looming:\n• Condition: Cold water/ice surface → cold dense air near sea level (DENSER, higher n) than warmer air above.\n• Light from a ship or land travels upward (from rarer warm air to denser cold air closer to surface).\n• The ray curves DOWNWARD along the earth's curvature.\n• Observer can see objects BEYOND the horizon — ships 'floating' in the air above their actual position.\n• The object appears ABOVE its actual position.\n\nContrast:\n• Mirage: Hot rarer air below → image appears below real object.\n• Looming: Cold denser air below → image appears above real object.\n• Both involve curved ray paths due to continuous refraction/TIR through atmospheric layers with varying density.",
      explanation: "Both mirages and looming are caused by continuous gradual bending of light through atmospheric density gradients — the temperature gradient determines whether the image appears above or below the object.",
      points: 20
    },
    {
      id: "t7q28",
      type: "long",
      question: "A glass slab has n = 1.6. (a) Find its critical angle. (b) A ray strikes the top face at 30° to the normal, refracts into the slab, then hits the vertical side face. Find the angle of incidence on the side face. (c) Does TIR occur on the side face?",
      correctAnswer: "(a) Critical angle:\n$\\sin(i_c) = 1/1.6 = 0.625$\n$i_c = \\arcsin(0.625) \\approx 38.7^\\circ$\n\n(b) Refraction at top face:\nUsing Snell's Law: $\\sin(30°) = 1.6 \\times \\sin(r)$\n$0.5 = 1.6 \\sin(r)$\n$\\sin(r) = 0.3125$\n$r \\approx 18.2^\\circ$ (angle of refraction from the normal to the top face)\n\nThe refracted ray travels at 18.2° from the vertical (normal to top face).\nWhen this ray hits the vertical side face, the normal to the side face is horizontal.\nThe angle of incidence on the side face = 90° - 18.2° = 71.8°.\n\n(c) Does TIR occur on side face?\nAngle of incidence on side face = 71.8°.\nCritical angle = 38.7°.\nSince 71.8° > 38.7°, YES — Total Internal Reflection occurs on the side face.",
      explanation: "This geometrical ray-tracing problem is a classic HOTS question. The key insight is that when a ray refracts at the top, it strikes the side face at a complementary angle.",
      points: 20
    },
    {
      id: "t7q29",
      type: "long",
      question: "Explain why optical fibres can be bent into curves and still transmit light effectively, whereas a straight copper wire carrying electricity is damaged if bent too sharply.",
      correctAnswer: "Optical Fibre Bending:\nOptical fibres can transmit light even when bent because the physics of TIR is independent of the overall shape of the fibre. As long as the angle between the light ray and the core-cladding boundary is greater than the critical angle at every point of reflection, TIR occurs regardless of the direction the fibre is pointing.\n\nPhysics of TIR in a curved fibre:\n• As the fibre curves, the boundary angle changes slightly.\n• Fibre design engineers ensure that even at maximum allowed bend radii, the ray angles exceed the critical angle at all reflection points.\n• Modern single-mode fibres can handle bend radii as small as 15 mm.\n\nWhy copper wires are different:\n• Copper wires carry electrical current through free electrons in the metal lattice.\n• Sharp bending introduces mechanical stress that can break the crystal lattice structure, causing cracks.\n• Electrical resistance increases at bends and cracks.\n• The electrical signal travels along the conductor surface — any break in material = signal loss.\n\nKey Contrast:\n• Light in fibre: TIR at each reflection is determined by LOCAL angle at that point → fibre can curve freely.\n• Electricity in copper: Requires unbroken metallic path throughout → structural integrity is critical.",
      explanation: "This question tests conceptual understanding of WHY optical fibres are flexible, linking TIR physics to fibre engineering.",
      points: 20
    },
    {
      id: "t7q30",
      type: "long",
      question: "A surgeon uses an endoscope to diagnose a patient. The endoscope uses optical fibres of core refractive index 1.50 and cladding index 1.40. (a) Calculate the critical angle. (b) Draw and describe the path of a light ray from the external light source, into the patient's stomach, and back to the camera. (c) Why can the endoscope be twisted and bent while the patient's stomach is being examined?",
      correctAnswer: "(a) Critical angle:\n$\\sin(i_c) = n_2/n_1 = 1.40/1.50 = 0.933$\n$i_c = \\arcsin(0.933) \\approx 68.9^\\circ$\n\n(b) Ray Path in Endoscope:\n[1] External light source (LED/halogen) → enters illumination fibre bundle at the handle end.\n[2] Light travels down the fibre via TIR at core-cladding boundary (angle of incidence > 68.9° maintained throughout).\n[3] Light exits at the tip of the endoscope → illuminates the stomach interior.\n[4] Reflected/scattered light from stomach tissues enters the image fibre bundle tip.\n[5] This light travels UP the image fibre bundle via TIR.\n[6] At the eyepiece/camera, the image light exits → focused onto camera sensor.\n[7] Camera displays image on monitor in real-time.\n\n(c) Why bending is fine:\nThe endoscope (like any optical fibre system) transmits light via TIR. Since TIR depends only on the LOCAL angle of incidence at each reflection point, and the fibre is designed with sufficient numerical aperture, bending within safe limits keeps all angles above the critical angle. The fibre bundles are flexible glass/plastic that bend without breaking. As long as bend radius exceeds a minimum (few mm), TIR continues uninterrupted throughout the entire curved path inside the patient.",
      explanation: "A complete endoscope answer covers: TIR calculation, dual fibre bundle system (illumination + imaging), and why flexibility is possible via TIR physics.",
      points: 20
    },

    // ═══════════════════════════════════════════
    // HOTS QUESTIONS (10 total)
    // ═══════════════════════════════════════════

    {
      id: "t7q31",
      type: "thinking",
      question: "If you could make a perfect optical fibre from a material with refractive index of 4.0, and surrounded it with air cladding (n=1), what would the critical angle be? How does this compare to a normal glass fibre (n=1.5)? Discuss the trade-offs in using ultra-high-n materials.",
      correctAnswer: "Critical angle for n=4.0:\n$\\sin(i_c) = 1/4 = 0.25$\n$i_c = \\arcsin(0.25) = 14.5°$\n\nCompared to glass (n=1.5):\n$\\sin(i_c) = 1/1.5 = 0.667$\n$i_c(glass) = 41.8°$\n\nThe ultra-high-n material has a much smaller critical angle (14.5° vs 41.8°).\n\nBenefit: Light can hit the boundary at almost ANY angle and still undergo TIR. The acceptance cone (numerical aperture) is huge → easier to couple light into the fibre.\n\nTrade-offs:\n1. High refractive index materials (like silicon, n~3.4, or diamond, n~2.4) are rare, expensive, and often opaque to visible light.\n2. Higher n → more dispersion (different wavelengths travel at different speeds) → signal pulses spread out over distance → reduces data rate.\n3. High-n materials are often mechanically fragile or difficult to draw into long thin fibres.\n4. Most high-n materials (Si, Ge) are transparent only in infrared, not visible light → need different light sources.\nConclusion: For telecommunications, n~1.5 silica glass is optimal — transparent, flexible, drawnable, low dispersion, and cost-effective.",
      explanation: "This HOTS question requires understanding how critical angle scales with n, and then reasoning about practical engineering trade-offs beyond the formula.",
      points: 25
    },
    {
      id: "t7q32",
      type: "thinking",
      question: "A person swimming underwater looks up at the surface of water. Explain the full optical experience: What do they see within the 'window' of the critical angle, and what do they see outside it? Calculate the angular radius of this window for water (n=1.33).",
      correctAnswer: "The Snell Window (or Optical Manhole):\n\nThe swimmer looks up at the water-air interface. Light from above (air → water) refracts inward. Due to Snell's Law, ALL the light from the entire hemisphere above (180° of air) is compressed into a cone of half-angle equal to the critical angle in water.\n\nAngular radius of the window:\n$\\sin(i_c) = 1/1.33 = 0.752$\n$i_c = 48.75°$\n\nSo the swimmer sees the ENTIRE WORLD ABOVE WATER compressed into a circular cone of half-angle 48.75° (a diameter angle of 97.5°) centered at the zenith (directly above).\n\nInside the window (within 48.75° of vertical):\n• The swimmer sees the entire world above water — sky, birds, people on a boat — but compressed and distorted (fish-eye effect).\n• The image is bright and clear at the center, increasingly distorted toward the edge of the window.\n\nOutside the window (beyond 48.75° from vertical):\n• TIR occurs for light trying to come from water side. The swimmer sees a mirror-like reflection of the underwater environment — the sandy bottom, fish, etc.\n• The underwater world is perfectly reflected in the surface, appearing like a perfect mirror.\n\nThis phenomenon, called 'Snell's window' or 'optical manhole,' is well-known to divers and underwater photographers.",
      explanation: "This brilliant TIR application shows why fish have an unusual visual experience — the entire above-water world compressed into a circular 'window' surrounded by mirror-like reflection.",
      points: 25
    },
    {
      id: "t7q33",
      type: "thinking",
      question: "Optical fibres can carry millions of conversations simultaneously. Explain the concept of 'wavelength division multiplexing (WDM)' — how different colours of light carry different data streams simultaneously in one fibre. Does TIR treat all colours the same way?",
      correctAnswer: "Wavelength Division Multiplexing (WDM):\nA single optical fibre can carry multiple independent signals simultaneously by assigning different wavelengths (colours) of light to each signal channel.\n\nHow it works:\n1. Multiple laser sources emit light at different wavelengths (e.g., 1530 nm, 1540 nm, 1550 nm, etc.) — each carrying different data.\n2. A 'multiplexer' combines all these different-wavelength beams into one fibre.\n3. They all travel through the same fibre simultaneously.\n4. At the receiving end, a 'demultiplexer' separates them back by wavelength.\n5. Each wavelength stream is detected by its own receiver.\n\nModern DWDM (Dense WDM) can carry 80+ wavelength channels in a single fibre, each at 100 Gbps → 8000 Gbps total from one hair-thin fibre.\n\nDoes TIR treat all colours the same?\nNot exactly. Refractive index depends slightly on wavelength (dispersion: n is slightly higher for shorter wavelengths). Therefore:\n• The critical angle is slightly different for each wavelength.\n• All wavelengths still undergo TIR in a well-designed fibre, but they travel at slightly different speeds.\n• This 'chromatic dispersion' causes different wavelengths to arrive at slightly different times, spreading the pulse.\n• Special 'dispersion-shifted fibres' or dispersion-compensating modules are used to counteract this in long-haul communication.",
      explanation: "WDM is why a single fibre can carry the internet traffic of an entire country. Chromatic dispersion is a real engineering challenge in long-distance fibre communication.",
      points: 25
    },
    {
      id: "t7q34",
      type: "thinking",
      question: "Consider a cat's eye reflector on a road (those small shiny devices that glow when headlights hit them). Explain how it uses a combination of TIR AND geometry to reflect light BACK toward the source, regardless of the angle at which the light hits it.",
      correctAnswer: "Cat's Eye Road Reflector — Retroreflection via TIR:\n\nStructure: A cat's eye reflector typically contains a small glass sphere (or two right-angle prisms) embedded in a rubber casing.\n\nFor the Corner Cube / Prism version:\n1. Headlight hits the front face of the prism at normal incidence (no refraction).\n2. Inside the prism, the ray hits the back face at 45° — which exceeds the critical angle of glass (~41.8°).\n3. TIR occurs, deflecting the ray by 90°.\n4. The ray hits another face at 45°, TIR again → deflected another 90°.\n5. Total deflection = 180° → ray exits EXACTLY back toward the source (retroreflection).\n\nWhy it works for any angle:\nA 3D corner reflector (three mutually perpendicular faces) has the property that any ray hitting it from any angle in the front hemisphere will be retroreflected back toward its source.\nThis is because the three TIR bounces always sum to exactly reverse the direction vector: $\\vec{v}_{out} = -\\vec{v}_{in}$.\n\nAdvantages over painted white lines:\n• Cat's eyes are visible from hundreds of meters → early warning for drivers.\n• They work via TIR (active reflection), not passive scattering.\n• Used on roads, runway markers, bicycle reflectors, and space applications (retroreflectors placed on the moon by Apollo astronauts, allowing laser ranging from Earth).",
      explanation: "Corner cube retroreflectors are elegant applications of TIR combined with geometry. The Apollo retroreflectors on the moon still work today — scientists bounce lasers off them to measure the moon's distance.",
      points: 25
    },
    {
      id: "t7q35",
      type: "thinking",
      question: "If the refractive index of water changes with temperature (n decreases as temperature increases), explain how this creates the temperature conditions for mirages. If a desert road surface reaches 80°C while air at 2 m height is 30°C, estimate how the refractive index gradient bends a light ray. What would happen on a cold Arctic ocean where water surface air is -10°C and air at 2 m height is 5°C?",
      correctAnswer: "Refractive Index and Temperature:\nFor air: n ≈ 1 + (0.000293 × P/P₀) × (273/T) where T is temperature in Kelvin.\nHotter air → lower n (less dense, fewer molecules to refract light).\nCooler air → higher n (denser, more molecules).\n\nDesert Road (Hot Ground → Mirage):\nAt 80°C (353 K): n₁ ≈ slightly lower (rarer)\nAt 30°C (303 K): n₂ ≈ slightly higher (denser)\nLight from sky travels through denser (cooler, n₂ higher) air downward toward the rarer (hotter, n₁ lower) air near the road.\n→ Going from denser to rarer → bends away from normal at each layer → eventually TIR.\n→ Ray curves back upward → observer sees sky reflected from ground → MIRAGE.\n\nArctic Ocean (Cold Surface → Looming):\nAt -10°C (263 K) near surface: n₁ ≈ higher (denser)\nAt 5°C (278 K) at 2 m: n₂ ≈ lower (rarer)\nLight from a ship at sea level travels through rarer warmer air downward to denser cooler air.\n→ Going from rarer to denser → bends TOWARD normal at each layer.\n→ The ray curves downward following Earth's curvature → can 'see' beyond the horizon!\n→ Observer sees ships or landmasses that are geometrically below the horizon → LOOMING.\n\nKey contrast: Desert = hot rarer air below = ray curves UP = object appears below actual position.\nArctic = cold denser air below = ray curves DOWN = object appears above actual position.",
      explanation: "This expert-level HOTS question links atmospheric physics (temperature-dependent refractive index) to TIR and produces both mirage and looming phenomena from first principles.",
      points: 25
    },
    {
      id: "t7q36",
      type: "thinking",
      question: "A jeweller claims a stone is diamond (n=2.42) but it might be cubic zirconia (n=2.15). Without any chemical tests, explain how you could use the concept of critical angle and a simple laser pointer to determine which material it is.",
      correctAnswer: "Using Critical Angle to Identify the Gem:\n\nCalculate critical angles:\n• Diamond (n=2.42): $\\sin(i_c) = 1/2.42 = 0.413 \\implies i_c = 24.4°$\n• Cubic Zirconia (n=2.15): $\\sin(i_c) = 1/2.15 = 0.465 \\implies i_c = 27.7°$\n\nExperimental Method:\n1. Place the stone flat-side down on an optical stage (or simply hold it).\n2. Shine the laser into the stone at progressively increasing angles from the bottom face.\n3. Observe from the top: at angles below the critical angle, some light passes through the top (you see a bright refracted spot).\n4. Gradually increase the angle until the refracted spot at the top surface disappears entirely (TIR begins).\n5. Measure the angle at which the refracted beam just disappears — this is $i_c$.\n\nConclusion:\n• If TIR begins at approximately 24°–25°: Likely DIAMOND.\n• If TIR begins at approximately 27°–28°: Likely CUBIC ZIRCONIA.\n\nLimitations:\n• Requires precise angle measurement.\n• Surface must be polished flat for accurate measurement.\n• Scratches or inclusions scatter light, making it harder to see the exact TIR onset.\n\nIn practice: Jewellers use a 'refractometer' that measures the critical angle directly by placing the gem on a glass prism and measuring the shadow boundary where TIR begins.",
      explanation: "This brilliant HOTS application shows how fundamental physics (critical angle) has direct practical use in gemology. The experiment is actually performed by professional gemologists using refractometers.",
      points: 25
    },
    {
      id: "t7q37",
      type: "thinking",
      question: "Optical fibres experience 'signal attenuation' even with TIR. Research-level fibres have attenuation of only 0.2 dB/km. (a) What causes this tiny remaining signal loss if TIR is 100% efficient? (b) Why is 1550 nm wavelength preferred for long-distance fibre communication?",
      correctAnswer: "(a) Sources of signal attenuation in optical fibres (despite TIR being 100% efficient):\n\n1. Rayleigh Scattering: At a microscopic level, glass has tiny density fluctuations (unavoidable due to its amorphous structure). These scatter light — more at shorter wavelengths (scales as 1/λ⁴). This is the dominant loss at most wavelengths.\n\n2. Absorption: Even ultra-pure silica glass absorbs a tiny fraction of light due to:\n   • OH⁻ (hydroxyl) ion impurities from water contamination during manufacturing\n   • Infrared absorption by Si-O bond vibrations at wavelengths >1800 nm\n   • Electronic absorption at UV wavelengths\n\n3. Macrobending losses: When the fibre is bent too sharply, some rays near the outer edge hit the core-cladding boundary at angles below the critical angle → some light escapes.\n\n4. Microbending losses: Tiny irregularities in the fibre surface from manufacturing, pressure, or winding can scatter light out.\n\n5. Connector losses: At joints and connectors, slight misalignment allows some light to escape.\n\n(b) Why 1550 nm is optimal:\nAt 1550 nm, silica glass has the minimum Rayleigh scattering loss (since λ⁴ is large → less scattering) AND it is below the infrared Si-O absorption band → minimum total loss of ~0.2 dB/km. This is called the 'third telecommunications window.' Earlier systems used 850 nm and 1310 nm windows, but 1550 nm was found to be optimal. Modern EDFA (erbium-doped fibre amplifiers) also work at 1550 nm, making signal amplification straightforward.",
      explanation: "Even in a system that uses 100% efficient TIR, real-world factors introduce tiny losses. Understanding Rayleigh scattering and absorption bands is key to fibre optic engineering.",
      points: 25
    },
    {
      id: "t7q38",
      type: "thinking",
      question: "Explain why you can see the bottom of a pool of water more clearly when you look straight down, but the bottom appears distorted and harder to see when you look at a steep angle from the side. How does the apparent depth change with viewing angle, and what is the 'apparent depth' formula for normal incidence?",
      correctAnswer: "Apparent Depth — Angle Dependence:\n\nNormal Incidence (looking straight down):\nWhen you look straight down into water, a ray from an object at the bottom exits vertically (angle of incidence = 0°). Your eye receives this ray without bending. The apparent position of the object is:\n$$d_{apparent} = \\frac{d_{real}}{n}$$\nFor water (n=1.33): A pool 2m deep appears only 1.5m deep. The image is clear and undistorted because all rays from the object near the normal direction exit water with minimal bending.\n\nOblique Viewing:\nWhen you look at an angle, rays from the bottom hit the water surface at larger angles. Each ray bends away from the normal as it exits (going from water to air, denser to rarer). Your brain traces the rays back in straight lines — they appear to come from a point higher up and SHIFTED laterally. Different rays from the same object exit at different angles and converge differently, causing distortion (astigmatism). The apparent depth formula $d/n$ only applies exactly at normal incidence.\n\nCritical Angle Effect:\nRays hitting the bottom at angles that, when refracted, emerge near the critical angle appear most distorted. Near the edge of the water surface, the pool bottom is nearly invisible due to the glare from TIR of skylight.\n\nPractical implication:\nA swimming pool inspector checks the bottom by looking straight down from above, not from the side. Same for sonar systems — normal incidence gives clearest readings.",
      explanation: "Apparent depth (d/n) is one of the most important results from Snell's Law. This HOTS question extends it to oblique angles and connects it to distortion effects.",
      points: 25
    },
    {
      id: "t7q39",
      type: "thinking",
      question: "Some submarines use fibre optic masts instead of traditional periscopes. Explain why a fibre optic mast is better than a conventional periscope (with mirrors) for a submarine in terms of: (a) signal quality, (b) stealth/safety, (c) data capability, (d) mechanical simplicity.",
      correctAnswer: "(a) Signal quality:\n• Traditional periscope (mirrors): Each reflection absorbs ~4% of light. With multiple mirrors, cumulative loss can be 20-30%. Image gets dimmer and can show aberrations from mirror imperfections.\n• Fibre optic mast: TIR reflects 100% efficiency at each bounce. The image signal can be digitized at the camera head and transmitted as a digital signal through fibres with essentially zero loss. Digital transmission is immune to image quality degradation.\n\n(b) Stealth and safety:\n• Traditional periscope: Extends physically above water surface. Can be spotted visually, by radar (it's a metal tube), or by laser rangefinders. Limits diving depth (mechanical seals must hold pressure).\n• Fibre optic mast: A very thin fibre optic cable can extend above water — far harder to detect by radar (no metal surfaces). Can be retractable quickly. The submarine itself stays deeper, safer from detection.\n\n(c) Data capability:\n• Traditional: Transmits ONLY visual optical image down the periscope tube.\n• Fibre optic: Can simultaneously transmit: HD video, radar signals, electronic warfare data, GPS signals, radio communications — ALL through the same thin fibre bundle at different wavelengths (WDM).\n\n(d) Mechanical simplicity:\n• Traditional: Complex rotating mechanisms, pressure seals, precision optical alignments, large hull penetration.\n• Fibre optic: Single thin flexible cable penetrating the hull (easily sealed). No moving optics inside the submarine. Camera and sensors at the mast head, display screens inside.",
      explanation: "Modern attack submarines (like the Virginia-class) have replaced traditional periscopes with photonic masts using fibre optics. This question tests application of TIR physics to real naval technology.",
      points: 25
    },
    {
      id: "t7q40",
      type: "thinking",
      question: "TIR is said to be 100% efficient. However, quantum mechanics reveals a phenomenon called 'evanescent waves' where light actually penetrates a tiny distance (~100 nm) into the rarer medium even during TIR. Explain what this means and describe one practical device that exploits evanescent waves.",
      correctAnswer: "Evanescent Waves — Beyond Classical TIR:\n\nClassical TIR explanation: No light penetrates into the rarer medium; all light is reflected.\n\nQuantum/Wave optics explanation:\nWhile the propagating wave (light that would travel through the rarer medium) does not exist during TIR, an evanescent wave does. An evanescent wave is an exponentially decaying oscillating electromagnetic field that exists just inside the rarer medium (within ~100-500 nm of the boundary). It is not a propagating wave — it does not carry energy away from the boundary. Its amplitude decays as $E \\sim E_0 e^{-z/d_p}$ where $d_p$ is the penetration depth (typically $\\lambda/4$ to $\\lambda$).\n\nKey: Despite TIR, some electric field energy momentarily exists in the rarer medium. If another high-n medium is brought within the penetration depth, the evanescent wave can couple into it — a phenomenon called 'frustrated TIR.'\n\nPractical Device: Frustrated TIR Touchscreen (used in some fingerprint scanners and early tablets):\n1. A glass surface (n=1.5) is illuminated from below at angle > critical angle.\n2. In air: TIR occurs, no light transmission through glass surface.\n3. When a finger touches the surface: skin (n~1.45) enters the evanescent zone.\n4. The evanescent wave couples into the finger, disrupting TIR where touched.\n5. Where touched: light is NOT totally internally reflected → appears as bright spot from below.\n6. Camera underneath captures this pattern → reveals fingerprint ridges precisely.\n\nAlso used in: TIRF microscopy (Total Internal Reflection Fluorescence) for imaging single molecules at cell membranes.",
      explanation: "Evanescent waves are a beautiful quantum-classical bridge. They're why TIR-based fingerprint scanners work, and why TIRF microscopy can image individual molecules on cell membranes.",
      points: 25
    },

    /* ── Additional Questions Set 3 (t7q41 to t7q50) ── */

    {
      id: "t7q41",
      type: "mcq",
      question: "The critical angle for diamond (n = 2.42) in air is approximately:",
      options: ["41.8°", "24.4°", "65°", "32.1°"],
      correctAnswer: "24.4°",
      explanation: "sin C = 1/n = 1/2.42 = 0.413. C = sin⁻¹(0.413) ≈ 24.4°. Diamond's critical angle is extremely small — only 24.4°! This means light hitting any face at more than 24.4° undergoes TIR. Inside a well-cut diamond, light bounces repeatedly via TIR before exiting — creating the brilliant sparkle. Cubic zirconia (n ≈ 2.17, C ≈ 27.5°) sparkles less than diamond for this reason.",
      points: 10
    },
    {
      id: "t7q42",
      type: "mcq",
      question: "For total internal reflection to occur, light must travel from:",
      options: [
        "A rarer medium to a denser medium at any angle",
        "A denser medium to a rarer medium, at or beyond the critical angle",
        "A denser medium to a rarer medium, at less than the critical angle",
        "Any medium to any other medium at 90°"
      ],
      correctAnswer: "A denser medium to a rarer medium, at or beyond the critical angle",
      explanation: "TWO conditions for TIR: (1) Light must travel from DENSER to RARER medium (e.g., glass to air, water to air). (2) The angle of incidence must be GREATER THAN OR EQUAL TO the critical angle. If either condition is violated, TIR does not occur — partial refraction and partial reflection happen instead.",
      points: 10
    },
    {
      id: "t7q43",
      type: "mcq",
      question: "An optical fibre uses TIR with core n = 1.50 and cladding n = 1.45. What is the critical angle?",
      options: ["74.9°", "75.2°", "65.4°", "80°"],
      correctAnswer: "75.2°",
      explanation: "sin C = n_cladding/n_core = 1.45/1.50 = 0.9667. C = sin⁻¹(0.9667) ≈ 75.2°. This very large critical angle means light must enter the fibre at a very specific narrow range of angles (within 14.8° of the axis) to undergo TIR. This is the acceptance angle of the fibre, defining its 'numerical aperture'.",
      points: 10
    },
    {
      id: "t7q44",
      type: "mcq",
      question: "In a hot desert, you sometimes see what appears to be water on the road ahead. This is a mirage caused by:",
      options: [
        "Reflection from the flat road surface",
        "TIR of light in a layer of very hot air near the ground",
        "Actual water evaporation from the road",
        "Diffraction of sunlight"
      ],
      correctAnswer: "TIR of light in a layer of very hot air near the ground",
      explanation: "In a mirage: The road heats the air directly above it to a very high temperature. Very hot air has a lower refractive index than cooler air above. Light from the sky travels downward (denser to rarer — from cool to hot air layers). When the angle of incidence exceeds the critical angle, TIR occurs. The reflected sky-light reaches the observer's eye, appearing to come from the ground — it looks like water reflecting the sky!",
      points: 10
    },
    {
      id: "t7q45",
      type: "mcq",
      question: "Why is the critical angle concept not applicable when light travels from a rarer to a denser medium?",
      options: [
        "Light speeds up in denser media",
        "Snell's law doesn't apply for rarer to denser",
        "Light bends toward the normal when entering denser media — refraction always occurs, never TIR",
        "TIR requires the angle to be 90°"
      ],
      correctAnswer: "Light bends toward the normal when entering denser media — refraction always occurs, never TIR",
      explanation: "When light goes from rarer (n₁) to denser (n₂) medium (n₂ > n₁), Snell's law: n₁ sin θ₁ = n₂ sin θ₂ → sin θ₂ = (n₁/n₂) sin θ₁ < sin θ₁ → θ₂ < θ₁. The refracted ray always exists — it bends toward the normal. sin θ₂ can never exceed 1, so refraction always occurs. TIR is only possible when going from denser to rarer medium.",
      points: 10
    },
    {
      id: "t7q46",
      type: "short",
      question: "What is meant by 'critical angle'? State the formula for it and give its value for glass (n = 1.5).",
      options: [],
      correctAnswer: "Critical Angle: The angle of incidence in the denser medium at which the refracted ray just grazes along the interface (angle of refraction = 90°). For angles of incidence greater than the critical angle, total internal reflection occurs.\n\nFormula: sin C = n₂/n₁ (where light goes from medium of n₁ to medium of n₂, with n₁ > n₂).\nFor glass to air: sin C = n_air/n_glass = 1/1.5 = 0.667.\nC = sin⁻¹(0.667) ≈ 41.8°.\n\nMeaning: Any ray in glass hitting the glass-air boundary at more than 41.8° will undergo total internal reflection.",
      explanation: "Critical angle is the key threshold for TIR. Below C → refraction occurs. Above C → TIR occurs. At exactly C → refracted ray grazes the surface (90°).",
      points: 15
    },
    {
      id: "t7q47",
      type: "short",
      question: "Describe three practical applications of total internal reflection.",
      options: [],
      correctAnswer: "1. Optical Fibres (Telecommunications and Medical):\nLight signals are transmitted through thin glass fibres by repeated TIR. The core (denser glass) is surrounded by cladding (rarer glass), so light bounces along the fibre with essentially 100% efficiency. Used in internet cables, endoscopes (to see inside the human body), and surgical instruments.\n\n2. Prism Periscopes (Submarine and Military):\nTotal reflecting prisms (glass prisms with 45°-90°-45° geometry) reflect light at 90° via TIR, more efficiently than silvered mirrors (which absorb some light). Used in periscopes, binoculars, and rangefinders.\n\n3. Brilliant Cut Diamonds:\nDiamond's very small critical angle (24.4°) ensures that light entering the top of a well-cut diamond undergoes multiple TIR reflections inside before exiting from the top faces. This traps light inside the gem and returns it through the crown — creating the brilliant sparkle (brilliance) that makes diamonds so visually striking.",
      explanation: "These three applications demonstrate TIR in three completely different domains: communications technology, precision optics, and gemology.",
      points: 15
    },
    {
      id: "t7q48",
      type: "short",
      question: "Light travels from water (n = 1.33) into air. At what angle of incidence will TIR first occur? If the angle is increased by 10°, what happens?",
      options: [],
      correctAnswer: "Critical angle: sin C = n_air/n_water = 1/1.33 = 0.752. C = sin⁻¹(0.752) ≈ 48.8°.\n\nAt exactly 48.8°: The refracted ray grazes along the water-air interface (angle of refraction = 90°). This is the onset of TIR.\n\nAt 48.8° + 10° = 58.8° (increased by 10°):\nThe angle exceeds the critical angle → Total Internal Reflection occurs. The light ray is COMPLETELY reflected back into the water according to the law of reflection (angle of reflection = 58.8°). No refracted ray exists in air. The interface acts as a perfect mirror from inside the water.",
      explanation: "The critical angle marks the precise boundary. Below it: partial refraction + partial reflection. At it: grazing refraction. Above it: TIR (100% reflection).",
      points: 15
    },
    {
      id: "t7q49",
      type: "long",
      question: "Explain how optical fibres work using the principle of TIR. Draw the cross-section and describe: (a) core and cladding, (b) how light propagates, (c) why it doesn't leak even when the fibre bends. Give two applications.",
      options: [],
      correctAnswer: "Optical Fibre Structure:\n• Core: Central, denser glass/silica (n₁ ≈ 1.50). Light travels here.\n• Cladding: Outer coating of slightly less dense glass (n₂ ≈ 1.45). Surrounds core.\n• Buffer coating: Protective plastic layer outside cladding.\n\n(a) Core and Cladding function:\nThe core-cladding interface creates the TIR boundary. Since n_core > n_cladding, light in the core hitting this boundary at angles > critical angle undergoes TIR and stays confined to the core.\nCritical angle: sin C = 1.45/1.50 ≈ 75.2°.\n\n(b) Light Propagation:\nLight is launched into the fibre end at an angle within the acceptance cone. It travels in a zigzag path: hitting the core-cladding interface at angles > 75.2° → TIR → bounce → TIR → bounce, repeatedly along the entire fibre length. Each TIR is 100% efficient (theoretically no light lost). Light travels at v = c/n₁ ≈ 2×10⁸ m/s inside the core.\n\n(c) Bending behaviour:\nEven when the fibre bends, the light still hits the core-cladding boundary at angles well above the critical angle (for gradual bends). TIR continues as long as the bend radius is not too sharp. Tight bends can cause light to hit below critical angle → light leaks (called bending loss). This is why optical fibres must not be bent too sharply.\n\nApplications:\n1. Telecommunications: Optical fibres carry internet data as light pulses across continents. A single hair-thin fibre can carry terabits of data per second using multiple wavelengths (WDM).\n2. Endoscopy: Flexible fibre bundles guide white light into the body and return the image to a camera — used in gastroscopy, colonoscopy, laparoscopy, for minimally invasive examination and surgery.",
      explanation: "Optical fibres are the backbone of global internet infrastructure. This complete answer covers structure, mechanism, bending physics, and real applications.",
      points: 20
    },
    {
      id: "t7q50",
      type: "thinking",
      question: "A glass prism (n = 1.5) has a 45°-90°-45° cross-section. A ray enters one of the 45° faces normally (perpendicularly). Show by calculation that TIR occurs at the hypotenuse face, and explain why prisms are preferred over silvered mirrors in periscopes.",
      options: [],
      correctAnswer: "Calculation:\nCritical angle for glass-air: sin C = 1/1.5 = 0.667 → C ≈ 41.8°.\n\nRay path:\n• Ray enters the vertical 45° face perpendicularly (angle of incidence = 0°) → passes through without bending (no refraction at normal incidence).\n• Travels horizontally inside the prism.\n• Hits the hypotenuse (the 90° angle face) at an angle of incidence of 45° (since the prism geometry dictates this by basic trigonometry: the hypotenuse face is at 45° to the horizontal ray).\n\nCheck: 45° > 41.8° (critical angle) ✓ → TIR OCCURS at the hypotenuse.\n\n• The ray reflects at 45° (TIR, law of reflection).\n• The reflected ray now travels vertically downward (or upward), having turned 90°.\n• The ray exits through the horizontal face perpendicularly → no refraction.\n\nWhy prisms beat silvered mirrors:\n1. TIR is 100% efficient (no absorption). Silvered mirrors absorb 5-10% of light at each reflection.\n2. Silver tarnishes over time — mirrors degrade. Glass prisms don't corrode.\n3. Prisms are more rugged and maintain their geometry precisely.\n4. In a periscope (two reflections), a prism periscope loses near 0% light; a mirror periscope loses ~10-20% — significant for military or night vision use.",
      explanation: "This calculation precisely demonstrates why the 45°-90°-45° prism is the standard for optical instruments. The TIR efficiency advantage over mirrors is why all quality binoculars, periscopes, and rangefinders use prisms.",
      points: 25
    }
  ]
};
