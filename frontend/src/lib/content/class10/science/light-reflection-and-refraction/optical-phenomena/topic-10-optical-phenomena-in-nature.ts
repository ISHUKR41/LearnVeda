/**
 * FILE: topic-10-optical-phenomena-in-nature.ts
 * LOCATION: src/lib/content/class10/science/light-reflection-and-refraction/
 *           optical-phenomena/topic-10-optical-phenomena-in-nature.ts
 *
 * PURPOSE:
 *   Comprehensive content for Topic 10 of the Light chapter:
 *   "Optical Phenomena in Nature and Technology"
 *
 *   This is a synthesis and applications topic that brings together ALL the optics
 *   concepts from Topics 1–9 and shows where they appear in the real world.
 *
 * TOPICS COVERED:
 *   1. Why the sky is blue — Rayleigh Scattering (I ∝ 1/λ⁴)
 *   2. Why sunsets are red/orange — long atmosphere path → blue scattered away
 *   3. Rainbow formation — refraction + TIR + dispersion in water droplets
 *   4. Twinkling of stars vs steadiness of planets
 *   5. Advance of sunrise and delay of sunset (atmospheric refraction)
 *   6. Optical fibre technology — internet, medical endoscopes
 *   7. Mirage formation — TIR in layered hot air
 *   8. Sparkling of diamonds and gems
 *   9. Why clouds are white (Mie scattering)
 *  10. The human eye as an optical instrument
 *
 * SIMULATIONS USED:
 *   - scattering-blue-sky-sim     : NEW — time-of-day sky with Rayleigh scatter particles
 *   - optical-fibre-tir-sim       : NEW — animated photon in bent fibre
 *   - rainbow-formation-sim       : Existing — rainbow in a water droplet
 *   - eye-defects-ray-diagram-sim : NEW — canvas eye with corrective lens toggle
 *   - apparent-depth-sim          : Existing — coin in water illusion
 *   - prism-advanced-sim          : Existing — full VIBGYOR prism
 *
 * QUESTIONS: 35 total (10 MCQ, 10 Short Answer, 8 Long Answer, 7 HOTS/Thinking)
 *
 * LAST UPDATED: 2026-06-11
 */

import { Topic } from "../../shared-types";

export const topic10OpticalPhenomena: Topic = {
  id: "optical-phenomena-in-nature",
  title: "10. Optical Phenomena in Nature and Technology",
  estimatedMinutes: 65,
  imageUrl: "/images/light/topic10-optical-phenomena.png",

  simulationIds: [
    /* NEW 2026: Atmospheric refraction — twinkling stars · early sunrise · mirage */
    "ultra-atmospheric-refraction-sim",  /* 3 modes: stars vs planets · apparent sun +2 min · road mirage TIR */
    /* ULTRA 2026: Prism + rainbow mode */
    "ultra-prism-sim",               /* VIBGYOR with Cauchy eq · rainbow droplet formation */
    /* ULTRA 2026: TIR + fibre + diamond */
    "ultra-tir-sim",                 /* TIR lab · optical fibre · diamond brilliance */
    /* ULTRA 2026: Human eye defects */
    "ultra-human-eye-sim",           /* Normal/Myopia/Hypermetropia · corrective lens */
    /* NEW 2026 dedicated simulations */
    "rainbow-droplet-sim",           /* NEW: Real Snell's law through 1 droplet → VIBGYOR */
    "scattering-blue-sky-sim",       /* Time-of-day → blue sky / red sunset */
    "optical-fibre-tir-sim",         /* Animated photon inside bent fibre */
    "eye-defects-ray-diagram-sim",   /* Canvas eye defects with correction toggle */
    /* Existing simulations used as cross-links */
    "rainbow-formation-sim",         /* Water droplet rainbow */
    "apparent-depth-sim",            /* Coin in water apparent depth */
    "prism-advanced-sim",            /* VIBGYOR with Cauchy equation */
    "eye-anatomy-detailed-sim",      /* Interactive eye anatomy */
    "critical-angle-sim",            /* TIR / critical angle explorer */
    "light-mirage-formation",        /* Hot road mirage via TIR */
    "light-diamond-sparkle",         /* Diamond TIR sparkle */
  ],

  content: `
### Optical Phenomena in Nature and Technology

This topic is your **"See the Physics Everywhere"** tour. Every concept from reflection, refraction, TIR, dispersion, and scattering appears daily — in the sky, in diamonds, inside your phone's internet connection, and in your own eyes.

---

## 1. Why Is the Sky Blue?

### Rayleigh Scattering
When sunlight (white light) enters the Earth's atmosphere, it collides with tiny gas molecules (N₂, O₂, Ar). These molecules scatter the sunlight in all directions. This process is called **Rayleigh Scattering**.

The key formula is:

$$I \\propto \\frac{1}{\\lambda^4}$$

where **I** = intensity of scattered light and **λ** = wavelength of light.

This means:
- **Shorter wavelengths** (blue, violet) are scattered **much more** than longer wavelengths (red, orange).
- Blue light (λ ≈ 450 nm) is scattered about **9.4×** more than red light (λ ≈ 680 nm).
- When you look anywhere in the sky (except directly at the sun), scattered blue light enters your eye → **sky appears blue**.

### Why Not Violet?
Although violet (λ ≈ 400 nm) is scattered even more than blue, it appears blue to us because:
1. The Sun emits less violet light than blue.
2. The human eye is less sensitive to violet.
3. Some violet is absorbed in the upper atmosphere.

---

## 2. Why Are Sunsets Red and Orange?

At **sunset or sunrise**, the Sun is near the horizon. Sunlight must travel through a **much greater thickness** of the atmosphere to reach your eyes — sometimes 10–40 times longer than at noon.

Over this long path:
- All blue and violet light is **completely scattered away** in other directions.
- Only the longer wavelengths — **red, orange, yellow** — survive the long journey and reach your eyes.
- Result: **the sky near the horizon appears orange-red** at sunrise/sunset.

**Comparison:**
| Time of Day | Path Length | Sky Colour |
|---|---|---|
| Noon (sun overhead) | Short (1×) | Deep blue |
| Morning / Evening | 3–5× longer | Orange-yellow |
| Sunrise / Sunset | 10–40× longer | Red-orange |

**Real-life connection:** Danger signals (traffic lights, fire trucks) use **red light** because it is scattered the **least** — it travels through fog, rain, and dust the farthest.

---

## 3. Why Are Clouds White?

Clouds are made of **water droplets** that are much larger than gas molecules. These large droplets scatter ALL wavelengths of visible light almost equally — this is called **Mie Scattering**.

Since all colours are scattered equally, they combine to form **white light** → clouds appear white.

When clouds become very thick, less light passes through → they appear **grey or dark** (storm clouds).

---

## 4. Rainbow Formation

A rainbow is the most spectacular optical phenomenon — it requires three processes happening simultaneously inside **millions of water droplets**.

### How a Rainbow Forms (Step by Step)

**Step 1 — Refraction (Entry):** White sunlight enters a water droplet. Since different colours have different refractive indices in water, they bend by different amounts (**dispersion**). Violet bends the most, red the least.

**Step 2 — Total Internal Reflection:** The refracted light hits the **back inner surface** of the droplet. The angle exceeds the critical angle for water (≈ 48.6°) → **Total Internal Reflection** occurs. The light bounces back inside.

**Step 3 — Refraction (Exit):** The reflected light exits the front of the droplet, refracted again. This second refraction further spreads the colours.

**The Result:** Each water droplet in the sky acts like a tiny prism. An observer on the ground sees:
- **Red** at the **outer** edge (top) of the rainbow — from droplets at 42° from the anti-solar point.
- **Violet** at the **inner** edge (bottom) — from droplets at 40°.
- The colours VIBGYOR appear in order from top to bottom.

### Primary vs Secondary Rainbow

| Feature | Primary Rainbow | Secondary Rainbow |
|---|---|---|
| How formed | 1 internal reflection | 2 internal reflections |
| Colour order | Red outside, Violet inside | Violet outside, Red inside (REVERSED) |
| Brightness | Bright | Dimmer (second reflection loses intensity) |
| Angle from anti-solar | 40°–42° | 51°–53° |

---

## 5. Twinkling of Stars

### Why Stars Twinkle
Stars are so far away that they appear as **point sources** of light. As starlight enters our atmosphere, it passes through layers of air at different temperatures and densities. These layers constantly move, so:
- The **refractive index** of the air changes continuously.
- Starlight is continuously **refracted in varying directions**.
- The apparent position of the star shifts slightly and rapidly.
- This rapid fluctuation of position and intensity → **twinkling** (scintillation).

### Why Planets Don't Twinkle
Planets are much closer — they appear as **extended discs** (small circles, not points). Light from different parts of the disc averages out the atmospheric fluctuations → **planets appear steady**.

Quick memory trick: **Stars scintillate, Planets placid.**

---

## 6. Advance of Sunrise and Delay of Sunset

Due to **atmospheric refraction**, the Sun is visible slightly before it actually rises above the horizon, and slightly after it has set below the horizon.

**How it works:** The atmosphere acts as a medium with gradually increasing refractive index from top to bottom (denser air near ground). A ray of sunlight entering the atmosphere bends progressively — the curved path means the Sun appears about **2 minutes early at sunrise** and stays visible about **2 minutes after actual sunset**.

**Total day extended:** About 4 minutes extra per day due to atmospheric refraction.

The Sun also appears **oval/flattened** near the horizon because the lower edge is refracted more than the upper edge.

---

## 7. Mirage Formation

A mirage is an optical illusion caused by **Total Internal Reflection in hot air**.

### Desert Mirage (Inferior Mirage)
On a hot road or desert, the layer of air near the surface is very hot. Hot air is less dense → lower refractive index. Layers at increasing height have increasing refractive index.

When a ray of light from the sky travels downward through progressively less-dense air:
- It bends away from the normal continuously.
- Eventually the angle of incidence exceeds the critical angle.
- **TIR occurs** — the ray bounces upward.
- The observer sees an image of the sky on the ground → looks like water reflecting the sky!

### Looming (Superior Mirage)
Over cold water, air density increases downward → rays bend downward → objects appear elevated or "floating" above their real position.

---

## 8. Sparkling of Diamonds

Diamonds are cut to maximize **Total Internal Reflection**. Diamond has:
- Refractive index: n = 2.42 (highest of any common gem)
- Critical angle: θ_c = arcsin(1/2.42) ≈ **24.4°**

This tiny critical angle means light entering a diamond hits multiple facets at angles **larger than 24.4°** → undergoes multiple TIR bounces inside before exiting through the top → each exit produces a brilliant flash of coloured light.

The gem-cutter's art is to create facet angles that ensure maximum TIR from every direction.

**Comparison:** 
- Water: θ_c ≈ 48.6°
- Glass: θ_c ≈ 41.8°  
- Diamond: θ_c ≈ 24.4° ← much easier to achieve → maximum sparkle

---

## 9. Optical Fibre Technology

**How it works:** An optical fibre is a thin glass or plastic fibre. Light enters one end and undergoes repeated **TIR** at the fibre-air boundary → light zigzags along the fibre, trapped inside, with virtually no energy loss.

**Key facts:**
- Core refractive index (n₁) > Cladding refractive index (n₂)
- Light must enter at less than the **acceptance angle**
- **Bandwidth:** A single fibre can carry millions of phone calls simultaneously
- **Signal loss:** Less than 0.2 dB/km (vs. copper wire: 5–10 dB/km)

**Applications:**
| Application | How optics is used |
|---|---|
| Internet (broadband) | Data as light pulses at 200 Tbps |
| Medical endoscope | Doctor looks inside body without surgery |
| Decorative lighting | Light escapes only at bent ends → glowing tips |
| Sensors | Pressure/temperature changes fibre properties |

---

## 10. The Human Eye as an Optical Instrument

The eye is a remarkable optical device that combines:
- **Cornea** (fixed convex surface): provides ~70% of total converging power
- **Iris** (aperture control): adjusts pupil size from 2mm to 8mm
- **Crystalline lens** (variable focal length): controlled by ciliary muscles for accommodation
- **Retina** (screen): converts light to nerve signals via rods and cones
- **Fovea**: region of maximum resolution (cone-rich centre)
- **Blind spot**: where optic nerve exits — no photoreceptors

### Power of the Eye Lens
The eye can change its focal length. Total power ranges from about **+58 D** (far vision) to **+64 D** (near vision at 25 cm). This range of about 4–6 D is called the **amplitude of accommodation**.

### Common Defects

| Defect | Cause | Image forms | Correction |
|---|---|---|---|
| Myopia (Short-sight) | Eyeball too long OR lens too converging | In front of retina | Concave lens (negative power) |
| Hypermetropia (Long-sight) | Eyeball too short OR lens too weak | Behind retina | Convex lens (positive power) |
| Presbyopia | Ciliary muscles weaken (age) | Cannot focus both near and far | Bifocal lenses |
| Astigmatism | Irregular cornea curvature | Blurry in all distances | Cylindrical lens |

### Corrective Lens Power (typical)
- Myopia: lens power = 1/f_far  (negative value, e.g., −2.0 D for f = −50 cm)
- Hypermetropia: P = 1/v − 1/u (where v = near point distance, u = −25 cm)

### 📝 Solved Numericals

**Example 1: Atmospheric Refraction and Day Length**
**Question:** If the Earth had no atmosphere, by how much would the duration of the day change?
**Solution:**
1. Due to atmospheric refraction, the sun appears to rise 2 minutes before the actual sunrise and set 2 minutes after the actual sunset.
2. Therefore, the day is longer by $2 + 2 = 4$ minutes due to the atmosphere.
3. If there were no atmosphere, the duration of the day would decrease by **4 minutes**.

**Example 2: Refractive Index and Critical Angle**
**Question:** The critical angle for a diamond-air interface is approximately $24.4^\\circ$. What is the refractive index of diamond? (Given $\\sin(24.4^\\circ) = 0.413$).
**Solution:**
1. The formula relating critical angle and refractive index is $\\sin(i_c) = \\frac{1}{n}$.
2. Rearranging for $n$, we get $n = \\frac{1}{\\sin(i_c)}$.
3. $n = \\frac{1}{\\sin(24.4^\\circ)} = \\frac{1}{0.413} \\approx 2.42$.
4. The refractive index of diamond is approximately **2.42**.

**Example 3: Accommodation Power**
**Question:** A person with normal vision has a near point of 25 cm and a far point at infinity. Calculate the change in the optical power of the eye lens when shifting focus from infinity to the near point. (Assume the distance from the lens to the retina is 2 cm).
**Solution:**
1. Let the distance to the retina be $v = +2$ cm = $+0.02$ m.
2. For far vision (infinity), $u = -\\infty$. Power $P_{far} = \\frac{1}{v} - \\frac{1}{u} = \\frac{1}{0.02} - 0 = +50$ D.
3. For near vision (25 cm), $u = -25$ cm = $-0.25$ m. Power $P_{near} = \\frac{1}{v} - \\frac{1}{u} = \\frac{1}{0.02} - \\frac{1}{-0.25} = 50 + 4 = +54$ D.
4. The change in optical power (amplitude of accommodation) is $P_{near} - P_{far} = 54 - 50 = \\mathbf{4 \\text{ D}}$.

**Example 4: Scattering and Wavelength**
**Question:** The wavelength of red light is roughly 1.5 times that of blue light. Compare the intensity of Rayleigh scattering for blue light with that for red light.
**Solution:**
1. According to Rayleigh's law of scattering, the intensity of scattered light $I \\propto \\frac{1}{\\lambda^4}$.
2. Let $\\lambda_b$ be the wavelength of blue light and $\\lambda_r$ be the wavelength of red light. We are given $\\lambda_r = 1.5 \\lambda_b$.
3. The ratio of scattering intensities is $\\frac{I_b}{I_r} = \\frac{\\lambda_r^4}{\\lambda_b^4} = (\\frac{\\lambda_r}{\\lambda_b})^4$.
4. $\\frac{I_b}{I_r} = (1.5)^4 = (\\frac{3}{2})^4 = \\frac{81}{16} \\approx 5.06$.
5. Therefore, blue light is scattered roughly **5 times more** than red light.

---
## Key Exam Summary

| Phenomenon | Physics Behind It |
|---|---|
| Blue sky | Rayleigh scattering, I ∝ 1/λ⁴, blue scattered most |
| Red sunset | Long atmosphere path → blue scattered away → red transmitted |
| White clouds | Mie scattering (large droplets scatter all λ equally) |
| Rainbow | Refraction (entry) + TIR + Dispersion + Refraction (exit) in water drops |
| Twinkling stars | Point source → atmospheric refraction fluctuations |
| Steady planets | Extended disc → fluctuations average out |
| Mirage | TIR in hot air layers near ground |
| Diamond sparkle | TIR — critical angle only 24.4° (n = 2.42) |
| Optical fibre | TIR — light trapped in core (n_core > n_cladding) |
| Early sunrise | Atmospheric refraction bends sunlight towards Earth |
`,

  questions: [
    /* ─── MCQ (10 questions) ─── */
    {
      id: "t10-mcq-1",
      type: "mcq",
      points: 10,
      question: "The sky appears blue during the day because of:",
      options: [
        "A. Reflection of blue light from the ocean",
        "B. Rayleigh scattering — blue light is scattered more than red (I ∝ 1/λ⁴)",
        "C. The atmosphere absorbs all colours except blue",
        "D. Blue light travels faster than red light in air",
      ],
      correctAnswer: "B",
      explanation: "Rayleigh scattering intensity is proportional to 1/λ⁴. Blue light (λ ≈ 450 nm) is scattered about 9× more than red (λ ≈ 680 nm). This scattered blue light reaches our eyes from all directions → sky looks blue.",
    },
    {
      id: "t10-mcq-2",
      type: "mcq",
      points: 10,
      question: "During sunset, the sky near the horizon appears orange-red because:",
      options: [
        "A. Red light slows down near the horizon",
        "B. Sunlight travels a much longer path through the atmosphere — all blue is scattered away",
        "C. The Sun emits only red light at sunset",
        "D. Red light has higher frequency so it is more visible",
      ],
      correctAnswer: "B",
      explanation: "At sunset, sunlight travels through 10–40× more atmosphere than at noon. Over this long path, all blue and violet is scattered sideways. Only red and orange wavelengths survive the journey to your eyes.",
    },
    {
      id: "t10-mcq-3",
      type: "mcq",
      points: 10,
      question: "A rainbow is formed due to:",
      options: [
        "A. Only reflection inside water droplets",
        "B. Only dispersion through water droplets",
        "C. Refraction + Total Internal Reflection + Dispersion inside water droplets",
        "D. Scattering of light by water vapour",
      ],
      correctAnswer: "C",
      explanation: "Rainbow formation requires all three: (1) Refraction at entry — white light disperses as it enters the droplet. (2) TIR at the back of the droplet. (3) Refraction at exit — further separation of colours. The observer sees different colours from droplets at different angles (40°–42° from anti-solar point).",
    },
    {
      id: "t10-mcq-4",
      type: "mcq",
      points: 10,
      question: "Stars twinkle but planets appear steady because:",
      options: [
        "A. Planets are luminous objects and stars are not",
        "B. Stars emit coloured light; planets emit white light",
        "C. Stars appear as point sources — atmospheric refraction fluctuations are noticeable; planets appear as discs — fluctuations average out",
        "D. Planets are closer to the Sun and receive more stable light",
      ],
      correctAnswer: "C",
      explanation: "Stars are so far away they are essentially point sources. Tiny fluctuations in atmospheric refractive index rapidly shift the apparent position → twinkling. Planets are close enough to appear as extended discs — light from different points averages out the fluctuations → steady appearance.",
    },
    {
      id: "t10-mcq-5",
      type: "mcq",
      points: 10,
      question: "Diamond sparkles brilliantly because:",
      options: [
        "A. Its refractive index is 2.42 — giving a critical angle of only ≈ 24.4°, maximising TIR bounces",
        "B. Its flat surfaces reflect all colours equally",
        "C. Diamonds emit their own visible light",
        "D. Diamonds scatter light by the Rayleigh mechanism",
      ],
      correctAnswer: "A",
      explanation: "Diamond has n = 2.42, giving θ_c = arcsin(1/2.42) ≈ 24.4°. This tiny critical angle means most light entering the diamond hits facets at angles > 24.4° → multiple TIR bounces before exiting → maximum brilliance.",
    },
    {
      id: "t10-mcq-6",
      type: "mcq",
      points: 10,
      question: "An optical fibre works by:",
      options: [
        "A. Regular reflection from a silvered surface",
        "B. Total Internal Reflection — light is trapped inside the core because n_core > n_cladding",
        "C. Refraction that repeatedly bends light to stay in the fibre",
        "D. Diffraction of light around the curved fibre walls",
      ],
      correctAnswer: "B",
      explanation: "In an optical fibre, the glass core has higher n than the cladding. When light hits the core-cladding boundary at an angle > critical angle, TIR occurs — 100% of light is reflected back into the core. This continues for kilometres with near-zero energy loss.",
    },
    {
      id: "t10-mcq-7",
      type: "mcq",
      points: 10,
      question: "Clouds appear white (not blue) because:",
      options: [
        "A. Water vapour reflects all colours equally",
        "B. Mie scattering — large water droplets scatter ALL wavelengths almost equally",
        "C. Clouds are above the atmosphere where scattering doesn't occur",
        "D. Water absorbs only blue and violet light",
      ],
      correctAnswer: "B",
      explanation: "Water droplets in clouds are much larger than air molecules. This causes Mie scattering (not Rayleigh), which does NOT strongly favour any particular wavelength. All visible wavelengths are scattered roughly equally → white appearance.",
    },
    {
      id: "t10-mcq-8",
      type: "mcq",
      points: 10,
      question: "Due to atmospheric refraction, sunrise is seen:",
      options: [
        "A. About 2 minutes LATER than actual rise time",
        "B. At exactly the time the Sun crosses the horizon",
        "C. About 2 minutes EARLIER than actual rise time",
        "D. About 1 hour earlier than actual rise time",
      ],
      correctAnswer: "C",
      explanation: "The atmosphere bends light from the Sun toward the Earth even when the Sun is still slightly below the horizon (due to gradient of increasing refractive index near ground). We see the Sun about 2 minutes early at sunrise and about 2 minutes late at sunset — extending the day by ~4 minutes.",
    },
    {
      id: "t10-mcq-9",
      type: "mcq",
      points: 10,
      question: "In a primary rainbow, the colour order from top (outer) to bottom (inner) is:",
      options: [
        "A. Violet, Indigo, Blue, Green, Yellow, Orange, Red",
        "B. Red, Orange, Yellow, Green, Blue, Indigo, Violet",
        "C. Green at centre, Red and Violet at edges",
        "D. Yellow, Green, Blue, Purple (only 4 colours visible)",
      ],
      correctAnswer: "B",
      explanation: "In a PRIMARY rainbow: Red is at the OUTER (top) edge at 42°, Violet at the INNER (bottom) edge at 40°. In a SECONDARY rainbow, the order is reversed (Violet outside, Red inside) because of a second internal reflection.",
    },
    {
      id: "t10-mcq-10",
      type: "mcq",
      points: 10,
      question: "A desert mirage (inferior mirage) is formed by:",
      options: [
        "A. Reflection of sky from actual pools of water on the desert",
        "B. Total Internal Reflection in hot air layers near the ground — light bends upward, simulating water",
        "C. Dispersion of white sunlight by hot sand",
        "D. Refraction through multiple glass-like layers of hot air",
      ],
      correctAnswer: "B",
      explanation: "Hot air near the ground is less dense → lower refractive index. As light from the sky travels downward through progressively rarer (less dense) air, it bends away from the normal. When angle > critical angle, TIR occurs and the ray curves back upward — the observer sees an image of the sky on the ground, resembling water.",
    },

    /* ─── Short Answer (10 questions) ─── */
    {
      id: "t10-sa-1",
      type: "short",
      points: 15,
      question: "State Rayleigh's scattering law and explain in ONE sentence why the sky is blue.",
      correctAnswer: "Rayleigh's law: scattered intensity I ∝ 1/λ⁴ (inversely proportional to the fourth power of wavelength). Blue light (short λ) is scattered much more than red (long λ) by atmospheric molecules — the scattered blue light comes to our eyes from all directions, making the sky appear blue.",
    },
    {
      id: "t10-sa-2",
      type: "short",
      points: 15,
      question: "Explain why danger signals on roads, trains, and fire engines are RED in colour.",
      correctAnswer: "Red light has the longest wavelength in visible spectrum (≈ 700 nm). By Rayleigh's law (I ∝ 1/λ⁴), red light is scattered the LEAST by dust, fog, and raindrops. It therefore travels the farthest and is visible even in poor weather conditions — making it ideal for danger signals.",
    },
    {
      id: "t10-sa-3",
      type: "short",
      points: 15,
      question: "What three optical phenomena combine to form a rainbow? In what order do they occur?",
      correctAnswer: "1. Refraction (at entry): white light enters water droplet and disperses (different λ → different n → different bending). 2. Total Internal Reflection: at the back inner surface of the droplet (angle > critical angle ≈ 48.6° for water). 3. Refraction (at exit): colours further separate. The result: different colours exit at slightly different angles → VIBGYOR spread over 40°–42°.",
    },
    {
      id: "t10-sa-4",
      type: "short",
      points: 15,
      question: "Why do stars twinkle but planets do not?",
      correctAnswer: "Stars are so distant they appear as POINT SOURCES. Atmospheric turbulence (varying refractive index) causes the apparent position to fluctuate rapidly → twinkling. Planets appear as tiny DISCS (extended sources). Light from different parts of the disc averages out the fluctuations → steady appearance.",
    },
    {
      id: "t10-sa-5",
      type: "short",
      points: 15,
      question: "What is the critical angle for diamond (n = 2.42) and how does it explain diamond's brilliance?",
      correctAnswer: "θ_c = arcsin(n₂/n₁) = arcsin(1.00/2.42) ≈ 24.4°. This very small critical angle means light entering a cut diamond hits most facets at angles GREATER than 24.4° → Total Internal Reflection occurs at nearly every internal surface → light bounces many times before exiting → maximum brilliance and sparkle.",
    },
    {
      id: "t10-sa-6",
      type: "short",
      points: 15,
      question: "Why does the Sun appear oval (flattened) near the horizon?",
      correctAnswer: "Near the horizon, sunlight must pass through a much thicker layer of atmosphere. The lower edge of the Sun is refracted MORE than the upper edge (atmospheric refraction increases as ray travels through more atmosphere). This unequal refraction compresses the Sun's vertical dimension → it appears oval/flattened, not circular.",
    },
    {
      id: "t10-sa-7",
      type: "short",
      points: 15,
      question: "Give two applications of optical fibres and explain the physics principle used in each.",
      correctAnswer: "1. Internet/Telecom: Data encoded as light pulses travels via TIR through glass core (n_core > n_cladding) for thousands of kilometres with minimal loss. 2. Medical endoscope: A bundle of fibres carries light to illuminate internal organs and returns the image to the doctor — all via TIR — without any surgery needed.",
    },
    {
      id: "t10-sa-8",
      type: "short",
      points: 15,
      question: "What is the Tyndall effect? Give a real-life example.",
      correctAnswer: "The Tyndall effect is the scattering of a beam of light by colloidal particles (intermediate sized particles) in a solution. When light passes through a colloidal solution, the path of the beam becomes visible from the side because particles scatter the light. Examples: (1) Blue colour of sea water (scattering of blue by colloidal particles). (2) Visible beam of car headlights in fog. (3) Blue colour of cigarette smoke.",
    },
    {
      id: "t10-sa-9",
      type: "short",
      points: 15,
      question: "How does a secondary rainbow differ from a primary rainbow? Give TWO differences.",
      correctAnswer: "1. Colour order: Primary — Red outside, Violet inside (ROYGBIV top to bottom). Secondary — Violet outside, Red inside (order REVERSED due to second internal reflection). 2. Brightness: Primary is brighter (one internal reflection); secondary is dimmer (two internal reflections — each reflection loses some intensity).",
    },
    {
      id: "t10-sa-10",
      type: "short",
      points: 15,
      question: "Explain why the sky near the horizon is a lighter blue than directly overhead.",
      correctAnswer: "When you look directly overhead, sunlight has passed through the minimum thickness of atmosphere — maximum blue scattering (deep blue). Near the horizon, sunlight has traveled through MUCH more atmosphere — more blue has been scattered away, and some orange/yellow light mixes in → lighter, paler blue near the horizon.",
    },

    /* ─── Long Answer (8 questions) ─── */
    {
      id: "t10-la-1",
      type: "long",
      points: 20,
      question: "Describe in detail how a rainbow is formed. Your answer should mention the role of refraction, total internal reflection, and dispersion. Also explain the difference between a primary and secondary rainbow.",
      correctAnswer: `**Rainbow Formation:**

A rainbow forms when sunlight interacts with millions of water droplets suspended in the atmosphere. Three optical processes work together inside each droplet:

**Step 1 — Refraction at Entry:**
White sunlight enters the front surface of a spherical water droplet. Since water has different refractive indices for different wavelengths (dispersion), each colour bends by a different amount:
- Violet (n_water ≈ 1.344) bends the most
- Red (n_water ≈ 1.331) bends the least
This separates the white light into its constituent colours (VIBGYOR).

**Step 2 — Total Internal Reflection:**
The dispersed light hits the back inner surface of the droplet. The critical angle for water-air is ≈ 48.6°. The geometry of a spherical droplet ensures that for sunlight hitting droplets in the right angular position, the angle of incidence at the back surface EXCEEDS the critical angle → Total Internal Reflection occurs (100% reflection, no energy loss through the back).

**Step 3 — Refraction at Exit:**
The reflected light exits through the front surface again, undergoing a second refraction. This further separates the colours and sends them toward the observer.

**Why we see an arc:**
The observer on the ground sees red light from droplets at 42° from the anti-solar point (directly opposite the Sun), and violet from droplets at 40°. The arc shape arises because all droplets at the same angle from the anti-solar point produce the same colour.

**Primary vs Secondary Rainbow:**
- Primary (1 TIR): Red outside at 42°, Violet inside at 40°. Bright.
- Secondary (2 TIR): Violet outside at 51°, Red inside at 53°. Dimmer, colours reversed. The dark band between primary and secondary arcs is called Alexander's Dark Band.`,
    },
    {
      id: "t10-la-2",
      type: "long",
      points: 20,
      question: "Explain in detail how Total Internal Reflection is responsible for (a) optical fibre communication and (b) formation of mirages.",
      correctAnswer: `**Optical Fibre Communication:**
An optical fibre consists of a glass core (high n) surrounded by cladding (lower n). When light enters the core at less than the acceptance angle, it hits the core-cladding boundary at an angle GREATER than the critical angle → TIR occurs → light bounces back into the core. This repeats for the entire length of the fibre — even if bent — with near-zero energy loss. Modern fibres lose < 0.2 dB/km. A single fibre carries 200 Tbps of data as light pulses. Used for internet, telephone, medical endoscopes.

**Mirage Formation:**
On a hot sunny day, the road surface heats the air immediately above it. This creates layers of air:
- Hottest (least dense, n ≈ 1.0001) near the road
- Progressively cooler (denser, n slightly larger) above

A ray of light from the sky traveling downward enters progressively rarer (less n) air. By Snell's law at each layer, it bends AWAY from the normal (since it's going from denser to rarer). The bending increases with each layer until the angle of incidence exceeds the critical angle → TIR occurs in the air → the ray curves back upward. The observer sees an image of the bright sky on the road → it looks like water (a mirage). This is called an "inferior mirage" because the image appears below the object.`,
    },
    {
      id: "t10-la-3",
      type: "long",
      points: 20,
      question: "What is atmospheric refraction? Explain with TWO distinct phenomena caused by it, including the advance of sunrise.",
      correctAnswer: `**Atmospheric Refraction:** The Earth's atmosphere is not uniform — it has layers of varying density (higher density near the ground, lower at altitude). Since n is higher for denser air, the atmosphere acts as a medium of gradually varying refractive index. Light passing through it bends gradually (atmospheric refraction) rather than at a sharp boundary.

**Phenomenon 1 — Advance of Sunrise / Delay of Sunset:**
When the Sun is just below the horizon, light from it enters the atmosphere obliquely. The increasing density toward the ground causes the ray to curve downward progressively. The observer sees the Sun even before it geometrically rises above the horizon — about 2 minutes early. Similarly, at sunset, the Sun appears 2 minutes after it has actually gone below the horizon. This extends the visible day by about 4 minutes. The Sun also appears flattened/oval near the horizon because the lower edge is refracted more than the upper.

**Phenomenon 2 — Twinkling of Stars:**
Stars are extremely distant — they are essentially point sources. Their light passes through many different atmospheric layers (with varying temperature, density, and refractive index) that are constantly moving due to wind and convection. This causes the apparent position and intensity of the star to fluctuate rapidly and randomly → twinkling (scintillation). Planets, being close enough to appear as extended discs, do not twinkle because light from different parts of the disc averages out the fluctuations.`,
    },
    {
      id: "t10-la-4",
      type: "long",
      points: 20,
      question: "Describe the defects of vision Myopia, Hypermetropia, and Presbyopia. For each: state the cause, how the image forms, and how it is corrected with a lens. Include the power calculation for Myopia correction where far point = 2 m.",
      correctAnswer: `**Myopia (Short-sightedness):**
Cause: Eyeball too long OR eye lens too converging. Image of distant objects forms IN FRONT of the retina, not on it. The person can see near objects clearly but cannot see distant objects.
Correction: Concave lens (negative power). It diverges the incoming parallel rays (from infinity) so that the eye perceives them as coming from the far point.
Power calculation: If far point = 2 m, the corrective lens must form a virtual image at −2 m from the eye when object is at infinity.
Using 1/v − 1/u = 1/f: v = −2 m, u = −∞, so 1/f = 1/(−2) − 0 = −0.5 D
Power = −0.5 D (concave lens of focal length −2 m)

**Hypermetropia (Long-sightedness):**
Cause: Eyeball too short OR eye lens too weak. Image of nearby objects forms BEHIND the retina. Person can see distant objects but not near ones (near point farther than 25 cm).
Correction: Convex lens (positive power). It converges the rays from a near object so that the eye perceives them as coming from the near point distance.

**Presbyopia (Age-related):**
Cause: With age, ciliary muscles weaken and the eye lens becomes rigid — it cannot change shape (accommodation fails). Both near and distant vision become blurry.
Correction: Bifocal lenses — the upper half is concave (for distance) and the lower half is convex (for near reading).`,
    },
    {
      id: "t10-la-5",
      type: "long",
      points: 20,
      question: "Write a detailed note on optical fibres: their structure, working principle (with formula), types, and applications in medicine and telecommunications.",
      correctAnswer: `**Structure of an Optical Fibre:**
An optical fibre has three layers:
1. Core: thin glass/silica with refractive index n₁ (higher)
2. Cladding: surrounding glass with refractive index n₂ < n₁
3. Protective jacket: plastic sheath for physical protection

**Working Principle (TIR):**
Light enters the core end at an angle less than the acceptance angle (cone of acceptance). At the core-cladding boundary, the angle of incidence > critical angle θ_c, where:
θ_c = arcsin(n₂/n₁)
Example: n₁ = 1.50, n₂ = 1.48 → θ_c = arcsin(1.48/1.50) ≈ 80.6°
TIR bounces the light back into the core — this repeats for thousands of kilometres.

**Types:**
1. Single-mode fibre: very thin core (≈ 9 μm), one path of light, used in long-distance telecom
2. Multi-mode fibre: thicker core (≈ 50 μm), multiple paths, used in shorter distances and medical

**Applications:**
1. Telecommunications/Internet: Data as light pulses at speeds > 200 Tbps. Negligible signal loss (< 0.2 dB/km) compared to copper. India's fibre backbone carries billions of WhatsApp messages daily.
2. Medical endoscopy: A gastroscope (endoscope for stomach) has two fibre bundles — one carries light into the body, another brings the image out. Doctors can view, biopsy, and even operate without any incision.
3. Decorative/Sensing: Fibre sensors detect pressure, temperature, and chemical changes. Fibre lighting creates ambient effects with light emerging only at bent tips.`,
    },
    {
      id: "t10-la-6",
      type: "long",
      points: 20,
      question: "Explain Rayleigh Scattering in detail and use it to explain: (a) blue sky, (b) red sunset, (c) white clouds, and (d) why the Sun appears pale yellow at noon instead of pure white.",
      correctAnswer: `**Rayleigh Scattering:**
When electromagnetic waves encounter particles much smaller than their wavelength, they scatter in all directions. The intensity of scattering follows:
I ∝ (1/λ⁴)
This means shorter wavelengths (blue, violet) scatter approximately 9.4× more than red (700/450)⁴ ≈ 9.4.

**(a) Blue sky:** Sunlight enters the atmosphere and blue/violet photons scatter off N₂, O₂ molecules in all directions. When you look at any part of the sky (not directly at the Sun), scattered blue light reaches your eyes → sky appears blue. (Violet scatters even more but eye sensitivity + more blue in sunlight = perceived blue.)

**(b) Red sunset:** At sunset, sunlight travels through 10–40× more atmosphere than at noon. Over this long path, essentially ALL blue light (and violet, indigo, green) is scattered sideways far before reaching your eyes. Only the long-wavelength red and orange photons, which scatter least, survive the entire journey → sky near horizon appears orange-red.

**(c) White clouds:** Cloud droplets are 1–100 μm across — much LARGER than air molecules (≈ 0.3 nm). With such large particles, the scattering mechanism is Mie scattering (not Rayleigh), which does NOT differentiate by wavelength — all visible colours are scattered equally → combined → white light → white clouds.

**(d) Sun's colour at noon:** Even at noon, a small fraction of blue light from the direct solar beam is scattered away as it passes through the few km of atmosphere directly above you. The Sun loses some blue → appears slightly yellow-white rather than pure white. On the Moon (no atmosphere) → Sun appears pure white.`,
    },
    {
      id: "t10-la-7",
      type: "long",
      points: 20,
      question: "The refractive index of diamond is 2.42 and that of glass is 1.50. (a) Calculate the critical angle for each. (b) Explain how diamond is cut to maximize brilliance using TIR. (c) Why is it harder to achieve TIR in glass than in diamond?",
      correctAnswer: `**(a) Critical Angles:**
Critical angle θ_c = arcsin(n_air / n_material) = arcsin(1/n)

For Diamond: θ_c = arcsin(1/2.42) = arcsin(0.4132) ≈ **24.4°**
For Glass: θ_c = arcsin(1/1.50) = arcsin(0.6667) ≈ **41.8°**

**(b) Diamond Cut for Maximum Brilliance:**
A skilled gem-cutter designs the facets so that:
- Light enters through the top facets (table and crown)
- Upon reaching the pavilion facets (bottom), the angle of incidence is > 24.4°
- Multiple TIR bounces occur inside — typically 4–7 reflections
- Light exits only through the top (crown) — not through the sides or bottom
- Each exit produces a flash of dispersed coloured light (because diamond also has high dispersion — n varies strongly with λ)
- The "round brilliant cut" with 57 facets is mathematically optimised for maximum TIR

**(c) Why glass is harder:**
Glass has θ_c ≈ 41.8° — much larger than diamond's 24.4°. This means rays must hit glass surfaces at angles > 41.8° (more grazing) to undergo TIR. In a typical glass gem cut, many rays hit surfaces at angles < 41.8° and escape through the back → less brilliance. Diamond's tiny critical angle (24.4°) means even nearly head-on rays undergo TIR → glass can never match diamond's sparkle.`,
    },
    {
      id: "t10-la-8",
      type: "long",
      points: 20,
      question: "Describe the structure and function of the human eye as an optical instrument. Include: (a) role of each part, (b) the process of accommodation, (c) range of power of the eye, and (d) why the blind spot is called so.",
      correctAnswer: `**Human Eye as an Optical Instrument:**

The human eye is an incredibly sophisticated camera-like device with a variable-focus lens and an adjustable aperture.

**(a) Role of Each Part:**
- **Cornea:** Transparent curved front surface. Provides ~70% of total converging power (~43 D). Fixed — does not change shape. Acts as the primary converging element.
- **Iris:** Coloured muscular ring. Controls pupil size from 2 mm (bright light) to 8 mm (dim light). Acts as the aperture (f/stop) of the eye.
- **Pupil:** Opening in the iris. Appears black because inside the eye is dark and absorbs light. Size controlled by reflex arcs.
- **Crystalline lens:** Biconvex flexible lens behind the iris. Power varies from about +15 D to +21 D. Controlled by ciliary muscles for accommodation.
- **Vitreous humour:** Transparent gel filling the eyeball. Maintains eye shape and transmits light.
- **Retina:** Curved "screen" at the back. Contains 120M rods (detect light intensity, work in dim light) and 6M cones (detect colour, work in bright light).
- **Fovea (Yellow spot):** Region of maximum visual acuity — highest cone density. All fine detail (reading, recognising faces) is done here.
- **Optic nerve:** Carries electrical signals from retina to brain for visual processing.

**(b) Accommodation:**
The ability of the eye to change its focal length to see objects at different distances. Ciliary muscles control the tension on the lens via suspensory ligaments:
- Far object: ciliary muscles RELAX → ligaments pull lens FLAT → longer f → lower power
- Near object: ciliary muscles CONTRACT → ligaments relax → lens becomes MORE CONVEX → shorter f → higher power

**(c) Range of Power:**
Total eye power (cornea + lens):
- Far vision (looking at ∞): about +58 D (minimum)
- Near vision (25 cm): about +64 D (maximum)
Range of accommodation = +6 D

**(d) Blind Spot:**
The point where the optic nerve exits the eye (onto the retina) has NO photoreceptors — no rods or cones. Light falling on this spot produces no visual signal. So any object whose image falls on the blind spot becomes INVISIBLE. This is called the blind spot. (Normally the brain fills in the missing information using the other eye and context clues — you don't normally notice it.)`,
    },

    /* ─── HOTS / Thinking (7 questions) ─── */
    {
      id: "t10-hots-1",
      type: "thinking",
      points: 25,
      question: "If the atmosphere had no gas molecules at all (no scattering), what would the daytime sky look like? What colour would the Sun appear? Justify your answer using physics.",
      correctAnswer: "Without any scattering molecules, the sky would appear COMPLETELY BLACK even during the day — just as astronauts see on the Moon. Scattering is what makes the sky bright away from the direct solar disc. The Sun itself would appear PURE WHITE (its actual colour — all wavelengths present) or blindingly bright. On Earth, the blue sky is entirely due to Rayleigh scattering by N₂, O₂ molecules. No molecules → no scattering → no sky brightness away from Sun → black sky.",
    },
    {
      id: "t10-hots-2",
      type: "thinking",
      points: 25,
      question: "Why does the secondary rainbow have its colours in the REVERSE order compared to the primary rainbow? Use a step-by-step ray diagram in words to justify.",
      correctAnswer: "The secondary rainbow is formed by light that undergoes TWO Total Internal Reflections inside the water droplet (vs one for primary). Each additional TIR 'flips' the light path. After the first TIR, red exits at the bottom of the first arc. After the second TIR, the path is inverted again — red now ends up on the INSIDE of the secondary arc (at ≈51°) and violet on the OUTSIDE (at ≈53°). The two reversals (once from refraction+TIR, once from the second TIR) cause the colour sequence to be fully reversed. The secondary rainbow is also dimmer because each TIR loses some intensity.",
    },
    {
      id: "t10-hots-3",
      type: "thinking",
      points: 25,
      question: "You are inside a swimming pool looking upward. What phenomenon would you observe at the water surface? At what angle range would you see the outside world, and what would you see beyond that angle? Calculate the relevant angle for water (n = 1.33).",
      correctAnswer: "From inside water looking upward at the surface: the outside world (above water) is only visible within a cone (sometimes called Snell's window or Snell's cone). The half-angle of this cone equals the critical angle. For water: θ_c = arcsin(1/1.33) = arcsin(0.752) ≈ 48.6°. So: within ±48.6° of the vertical (directly upward), you see the entire outside world compressed into a bright circular 'window'. Outside this 48.6° cone (i.e., at steeper angles toward the horizontal), TIR occurs — you see only reflections of the pool bottom and sides — the water surface acts as a perfect mirror. The entire 180° of the outside world is compressed into a 48.6° half-angle cone — approximately a 97° solid angle.",
    },
    {
      id: "t10-hots-4",
      type: "thinking",
      points: 25,
      question: "Why is it impossible to see a rainbow at noon when the Sun is directly overhead? What is the best time to see a rainbow and where should you look?",
      correctAnswer: "A rainbow is always centred at the 'anti-solar point' — the point directly opposite the Sun from the observer (the observer's shadow points there). For a primary rainbow, the bow is at 42° from the anti-solar point. When the Sun is directly overhead (90° above horizon), the anti-solar point is directly below the observer (90° below horizon). The rainbow arc would be 42° from 90° below horizon = 48° below the horizon — completely underground and invisible. Best time for rainbow: when Sun is LOW in the sky (morning or late afternoon, less than 42° altitude). At sunrise/sunset with a rainbow, the bow is nearly a full semicircle. Look toward the part of the sky OPPOSITE the Sun — toward your shadow.",
    },
    {
      id: "t10-hots-5",
      type: "thinking",
      points: 25,
      question: "An astronaut on the Moon (no atmosphere) looks at Earth. Would they see: (a) the Earth's sky to be blue, (b) twinkling stars, (c) early sunrise over Earth? Give physics reasons for each.",
      correctAnswer: "(a) Earth's sky FROM the Moon: The Moon has no atmosphere, so the astronaut is in space. They would see Earth as a beautiful blue marble — blue because Earth's atmosphere scatters blue light (which can be seen from outside). But standing on the Moon looking at the horizon there is no sky — just black space. (b) Twinkling: NO twinkling! Stars twinkle because of Earth's atmospheric turbulence. On the airless Moon, stars appear as steady bright points — no atmosphere to cause fluctuations. (c) Advance of sunrise over Earth: Not applicable from the Moon. Atmospheric refraction is an Earth-specific effect. The Moon has no atmosphere — moonrise and moonset follow strict geometric calculations with no advance/delay.",
    },
    {
      id: "t10-hots-6",
      type: "thinking",
      points: 25,
      question: "Why does a swimming pool appear shallower than it actually is? If a pool has a real depth of 3.2 m and water has n = 1.33, calculate the apparent depth. If a swimmer at the bottom drops a coin, where exactly does it appear to an observer on the pool deck?",
      correctAnswer: "Apparent depth phenomenon occurs because light from the coin at the bottom refracts as it exits the water surface. By Snell's Law for near-normal incidence: Apparent Depth = Real Depth / n. Calculation: Apparent depth = 3.2 / 1.33 = 2.41 m. The coin appears to be only 2.41 m below the surface — 0.79 m shallower than actual. The observer at the pool deck sees the coin at 2.41 m depth, directly below its real position. This is why swimmers always seem closer to the bottom than they are when viewed from outside, and why people misjudge pool depths — important safety consideration.",
    },
    {
      id: "t10-hots-7",
      type: "thinking",
      points: 25,
      question: "Why does a thick piece of glass appear less thick than it really is? A glass block 6 cm thick (n = 1.5) is placed over a coin. Where does the coin appear to be, and by how much is it shifted upward? Compare this to the same experiment done underwater (n = 1.33).",
      correctAnswer: "A glass block 6 cm thick (n = 1.5) makes the coin appear at: Apparent thickness = Real thickness / n = 6 / 1.5 = 4 cm. The coin appears to be 4 cm below the top of the glass (shifted UP by 6 − 4 = 2 cm). For water (n = 1.33): Apparent thickness = 6 / 1.33 = 4.51 cm. Shift upward = 6 − 4.51 = 1.49 cm. Comparison: Glass (n=1.5) shifts the coin MORE (2 cm) than water (n=1.33) because glass has a higher refractive index → greater apparent depth reduction → more apparent upward shift. The formula for the upward apparent shift is: shift = real depth × (1 − 1/n).",
    },
  ],

  /* ══════════════════════════════════════════════════════
   * WORKED EXAMPLES — 5 step-by-step numericals
   * Atmospheric Phenomena, Scattering, Rainbow Angles
   * ══════════════════════════════════════════════════════ */
  workedExamples: [
    {
      id: "ex1-t10",
      title: "Rainbow Angle Calculation — Primary Rainbow",
      difficulty: "medium",
      topic: "Rainbow — Refraction + TIR + Dispersion in Water Droplets",
      given: [
        "Refractive index of water for Violet light: nᵥ = 1.342",
        "Refractive index of water for Red light: n_R = 1.331",
        "Light enters a spherical water droplet at angle of incidence i = 60°",
      ],
      find: ["Minimum angle of deviation for Violet and Red (rainbow angles)"],
      steps: [
        {
          step: 1,
          title: "Find refraction angle at entry (Snell's Law)",
          work: "For Violet: sin r_V = sin 60° / 1.342 = 0.8660 / 1.342 = 0.6453 → r_V ≈ 40.2°\nFor Red: sin r_R = sin 60° / 1.331 = 0.8660 / 1.331 = 0.6507 → r_R ≈ 40.6°",
        },
        {
          step: 2,
          title: "Trace the ray inside the droplet",
          work: "Inside the droplet, ray reflects off the back surface (TIR or partial reflection), then exits.\nMinimum deviation angle: D_min = 180° + 2i − 4r (for primary rainbow, one internal reflection)\nFor Violet: D_V = 180° + 2(60°) − 4(40.2°) = 180° + 120° − 160.8° = 139.2°\nFor Red: D_R = 180° + 2(60°) − 4(40.6°) = 180° + 120° − 162.4° = 137.6°",
          note: "The minimum deviation angle determines which direction light exits most strongly — this is the rainbow angle.",
        },
        {
          step: 3,
          title: "Convert to 'rainbow angles' (from anti-solar point)",
          work: "Rainbow angle = 180° − D_min\nViolet rainbow angle = 180° − 139.2° = 40.8°\nRed rainbow angle = 180° − 137.6° = 42.4°\nAngular width of rainbow = 42.4° − 40.8° = 1.6°",
          note: "Red is always on the OUTSIDE of the rainbow (larger angle); Violet is on the inside (smaller angle). The rainbow is about 1.8° wide in practice.",
        },
      ],
      answer: "Violet rainbow angle ≈ 40.8°, Red ≈ 42.4°. Rainbow width ≈ 1.6°. Red arcs above Violet in primary rainbow.",
      realLifeConnect: "This is the actual physics of every rainbow you've ever seen! The exact angles (Red at 42°, Violet at 40°) were first calculated by René Descartes in 1637 — the same calculation you just did, but without a calculator.",
    },
    {
      id: "ex2-t10",
      title: "Atmospheric Refraction — Apparent Height of the Sun",
      difficulty: "medium",
      topic: "Atmospheric Refraction — Sunset Delay",
      given: [
        "Speed of light in air at ground level ≈ 0.9997c (n_ground ≈ 1.0003)",
        "The Sun is actually below the horizon by about 0.5° at apparent sunrise",
        "Angular diameter of Sun = 0.5°",
      ],
      find: ["By how many minutes is sunrise advanced (how early do we see the Sun due to atmospheric refraction)", "Conceptual explanation"],
      steps: [
        {
          step: 1,
          title: "Understand the mechanism",
          work: "Light from the Sun curves as it enters Earth's denser atmosphere.\nThe atmosphere acts like a lens — denser near the ground, rarer at altitude.\nRays from the Sun below the horizon are bent downward by the atmosphere, making them reach our eyes.",
          note: "This is called atmospheric refraction — the same phenomenon that makes stars twinkle and the sky remain bright after sunset.",
        },
        {
          step: 2,
          title: "Calculate time advance",
          work: "The atmosphere refracts the Sun's image upward by approximately 0.5° (equal to the Sun's angular diameter).\nEarth rotates 360° in 24 hours = 1° per 4 minutes.\n0.5° × 4 min/degree = 2 minutes\nSunrise appears 2 minutes EARLIER than actual sunrise.\nSimilarly, sunset appears 2 minutes LATER than actual sunset.",
        },
        {
          step: 3,
          title: "Total extra daylight",
          work: "Extra daylight = 2 min (early sunrise) + 2 min (late sunset) = 4 minutes per day.\nOver a year: 4 × 365 = 1,460 extra minutes ≈ 24 extra hours of daylight purely due to atmospheric refraction!",
        },
      ],
      answer: "Sunrise is advanced by ~2 minutes; sunset is delayed by ~2 minutes. Total extra daylight: ~4 minutes/day due to atmospheric refraction.",
      realLifeConnect: "Before GPS and atomic clocks, sailors used a table of atmospheric refraction corrections to determine exact local time from Sun/star observations. A 0.5° error in the Sun's position meant a 2-minute time error, which at sea translates to 50 km longitude error at the equator!",
    },
    {
      id: "ex3-t10",
      title: "Rayleigh Scattering — Blue Sky Intensity Ratio",
      difficulty: "hard",
      topic: "Rayleigh Scattering: I ∝ 1/λ⁴",
      given: [
        "Wavelength of Blue light (λ_B) = 450 nm",
        "Wavelength of Red light (λ_R) = 700 nm",
        "Rayleigh Scattering: Scattering intensity I ∝ 1/λ⁴",
      ],
      find: ["Ratio of scattering of Blue to Red light", "Why sky is blue"],
      steps: [
        {
          step: 1,
          title: "Write the Rayleigh scattering ratio",
          work: "I_Blue / I_Red = (λ_R / λ_B)⁴\n= (700 / 450)⁴\n= (1.556)⁴",
        },
        {
          step: 2,
          title: "Calculate",
          work: "(1.556)² = 2.421\n(1.556)⁴ = (2.421)² = 5.86 ≈ 5.9",
          note: "Blue light is scattered ~5.9 times more intensely than red light by air molecules!",
        },
        {
          step: 3,
          title: "Interpret for sky colour",
          work: "Blue light (λ = 450 nm) is scattered 5.9× more than red light (λ = 700 nm).\nLooking at the sky (not directly at the Sun), we see scattered light — predominantly blue.\nAt sunset: light travels through much more atmosphere → even more red transmission (less blue survives) → orange/red sunset.\nTyndall effect: same principle — milk appears blue-ish in scattered light because milk particles scatter blue more.",
        },
      ],
      answer: "Blue is scattered 5.9× more intensely than red. This makes the sky appear blue in all directions except toward the Sun.",
      realLifeConnect: "Mars has a thin atmosphere (100× less dense than Earth), so Rayleigh scattering is negligible. Mars's sky appears butterscotch/orange — coloured by dust, not scattered blue light. The Curiosity rover's photos confirm this!",
    },
    {
      id: "ex4-t10",
      title: "Twinkling of Stars — Scintillation Calculation",
      difficulty: "medium",
      topic: "Star Twinkling vs Planet Steadiness",
      given: [
        "Angular diameter of a star (as seen from Earth) ≈ 0.00001 arcseconds (essentially a point source)",
        "Angular diameter of Jupiter (as seen from Earth) ≈ 40 arcseconds",
        "Atmospheric turbulence deflects light by up to ±0.5 arcseconds",
      ],
      find: [
        "Why stars twinkle but planets do not",
        "Quantitative explanation using angular sizes",
      ],
      steps: [
        {
          step: 1,
          title: "Understand the physics",
          work: "Stars appear as point sources (angular size ≈ 0.00001 arcsec).\nPlanets are extended sources (Jupiter ≈ 40 arcsec across).\nAtmospheric turbulence causes random deflections of ±0.5 arcsec.",
        },
        {
          step: 2,
          title: "Effect on stars (point sources)",
          work: "Turbulence deflects the single beam from a star by ±0.5 arcsec.\nThis deflection is enormous compared to the star's angular size (0.00001 arcsec).\nResult: star appears to jump around rapidly → TWINKLES (scintillation).",
        },
        {
          step: 3,
          title: "Effect on planets (extended sources)",
          work: "Jupiter's disc is 40 arcsec wide — emitting light from thousands of different directions.\nTurbulence shifts each point on Jupiter by ±0.5 arcsec.\nBut 0.5 arcsec is only 0.5/40 = 1.25% of Jupiter's disc width → random shifts average out.\nResult: planet's image is stable → DOES NOT TWINKLE.",
          note: "Ratio: deflection/planet size = 0.5/40 = 1.25% — so twinkling averages out across the disc.",
        },
      ],
      answer: "Stars twinkle because turbulence deflection (±0.5 arcsec) >> star angular size. Planets don't twinkle because turbulence (0.5 arcsec) << planet size (40 arcsec) — deflections average out.",
      realLifeConnect: "Adaptive optics in modern telescopes (like the VLT in Chile) measure this turbulence 1000 times per second and deform a mirror to cancel it — allowing ground-based telescopes to achieve Hubble-like resolution without going to space.",
    },
    {
      id: "ex5-t10",
      title: "Mirage — Critical Angle in Atmosphere",
      difficulty: "hard",
      topic: "Mirage — Atmospheric TIR (Gradient Refraction)",
      given: [
        "Temperature at ground level: 50°C (desert road surface)",
        "Temperature at 1 m height: 30°C (normal air)",
        "Refractive index of air: n ≈ 1 + 0.000293 × (273/T) where T is in Kelvin",
      ],
      find: ["Refractive index at ground vs 1 m height", "Why mirage forms (qualitative + quantitative)"],
      steps: [
        {
          step: 1,
          title: "Calculate n at 1 m (T = 303 K = 30°C + 273)",
          work: "n₁ᵐ = 1 + 0.000293 × (273/303) = 1 + 0.000293 × 0.9010 = 1 + 0.0002640 = 1.000264",
        },
        {
          step: 2,
          title: "Calculate n at ground (T = 323 K = 50°C + 273)",
          work: "n_ground = 1 + 0.000293 × (273/323) = 1 + 0.000293 × 0.8452 = 1 + 0.0002476 = 1.000248",
          note: "n_ground (1.000248) < n₁ᵐ (1.000264) — the HOT ground air is LESS dense (lower n) than cooler air above!",
        },
        {
          step: 3,
          title: "Explain TIR in atmosphere",
          work: "Light from sky travels downward through progressively hotter (less dense, lower n) air layers.\nAs it nears the ground, n decreases → light bends AWAY from normal at each layer.\nEventually the bending becomes so large that the ray curves back upward → complete reflection.\nThis is atmospheric TIR — the ray never touches the ground but appears to come from below → mirage!",
        },
        {
          step: 4,
          title: "Approximate critical angle",
          work: "Using Snell's Law between 1m air and ground air:\nsin θ_c = n_ground / n₁ᵐ = 1.000248 / 1.000264 = 0.999984\nθ_c = sin⁻¹(0.999984) ≈ 89.9°\nThis critical angle is nearly 90° — light must travel almost perfectly horizontal to undergo this atmospheric TIR!",
          note: "This explains why mirages appear only near the horizon — at very shallow angles, nearly horizontal rays undergo the atmospheric TIR.",
        },
      ],
      answer: "n at 30°C = 1.000264 > n at 50°C = 1.000248. Rays at ~90° to vertical (nearly horizontal) undergo atmospheric TIR, creating the mirage.",
      realLifeConnect: "Desert mirages, road mirages on hot tarmac, and the 'Fata Morgana' (superior mirage) over cold lakes all arise from this same physics — varying air temperature creates varying refractive index gradients that bend light just like a glass lens. Sailors in polar regions see ships appear to float above the horizon due to the opposite effect (cold air near water is denser).",
    },
  ],

};
