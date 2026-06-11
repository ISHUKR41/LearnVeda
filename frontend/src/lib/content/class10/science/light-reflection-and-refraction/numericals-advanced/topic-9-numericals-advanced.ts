/**
 * FILE: topic-9-numericals-advanced.ts
 * LOCATION: src/lib/content/class10/science/light-reflection-and-refraction/numericals-advanced/
 * PURPOSE: Comprehensive numericals, advanced optical concepts, formula compilation,
 *          step-by-step solved examples, and 35+ practice questions for Class 10
 *          Light – Reflection and Refraction Chapter.
 *
 * CONTENT:
 *   - Complete New Cartesian Sign Convention
 *   - All formulas (mirror, lens, magnification, power)
 *   - 20+ fully solved numerical examples with step-by-step working
 *   - Real-life applications of optics formulas
 *   - Exam strategies and common mistake prevention
 *   - 50 practice questions (20 MCQ, 10 Short, 10 Long, 10 HOTS — all with full worked solutions)
 *   - 20 flash cards
 *   - Mind map of all optical formulas
 *
 * LAST UPDATED: 2026-06-09
 */

import { Topic } from "../../shared-types";

export const topic9NumericalsAdvanced: Topic = {
  id: "topic-9-numericals-advanced",
  title: "9. Numericals, Formulas & Advanced Optics",
  estimatedMinutes: 75,
  simulationIds: [
    /* ULTRA 2026: Mirror formula explorer with 6 labelled positions */
    "ultra-mirror-formula-sim",      /* u/f sliders · positions · image type auto */
    /* ULTRA 2026: Lens formula with power combination */
    "ultra-lens-formula-sim",        /* P = P₁+P₂ · 1/v−1/u=1/f live */
    /* ULTRA 2026: Full drag-object mirror lab */
    "ultra-concave-mirror-sim",      /* concave/convex · 3 glow rays · formula */
    /* ULTRA 2026: Full drag-object lens lab */
    "ultra-lens-ray-sim",            /* convex/concave · Power P display */
    /* NEW 2026: Full virtual optics bench for mirror/lens revision */
    "mirror-formula-lab-sim",        /* 3 principal rays live · concave/convex · f slider */
    "lens-ray-tracer-sim",           /* 3 rays · 1/v−1/u=1/f · image nature auto-detected */
    "light-mirror-formula-calc",
    "light-sign-convention",
    "light-lens-formula-calc",
    "light-power-lens",
    "light-magnification-demo",
    "adv-concave-mirror",
    "adv-convex-lens",
  ],
  imageUrl: "/images/light/topic9-numericals.png",
  content: `
## 🎯 Master All Formulas — The Complete Optics Formula Sheet

This topic is the backbone of the entire Light chapter. Every numerical, every board question, every entrance problem traces back to these formulas. Master them cold and you're guaranteed marks.

---

## 📐 Part 1: New Cartesian Sign Convention

### What is the Sign Convention?

Before using any formula, you MUST assign correct signs to distances. This is the **New Cartesian Sign Convention** — the universal rule for all mirrors and lenses in Class 10.

Think of it like a number line. The **optical centre (lens)** or **pole (mirror)** is at origin (0,0).

### The 6 Golden Rules

| Rule | Statement |
|------|-----------|
| **Rule 1** | All distances are measured **from the pole (P) for mirrors** or **optical centre (O) for lenses** |
| **Rule 2** | Distances measured in the **direction of incident light** (left → right) = **POSITIVE (+)** |
| **Rule 3** | Distances measured **against the direction of incident light** (right → left) = **NEGATIVE (−)** |
| **Rule 4** | Object is **always on the left side** → object distance **u is always NEGATIVE** |
| **Rule 5** | Heights **above the principal axis** = **POSITIVE (+)** |
| **Rule 6** | Heights **below the principal axis** = **NEGATIVE (−)** |

### Sign of Focal Length (Critical for Exams!)

| Optical Element | Position of Focus | Sign of f |
|----------------|-------------------|-----------|
| Concave Mirror | In front (left side) | **Negative (−)** |
| Convex Mirror | Behind (right side) | **Positive (+)** |
| Convex Lens | On right side | **Positive (+)** |
| Concave Lens | On left side | **Negative (−)** |

> 🔑 **Memory Trick:** "Concave always Collecting → focus in front → NEGATIVE. Convex mirror Diverging → focus behind → POSITIVE."

---

## 📏 Part 2: Mirror Formula

### The Formula

$$\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f} = \\frac{2}{R}$$

Where:
- **v** = image distance from mirror (+ if behind mirror, − if in front)
- **u** = object distance from mirror (ALWAYS negative for real objects)
- **f** = focal length (− for concave, + for convex)
- **R** = radius of curvature = **2f**

### Mirror Magnification

$$m = \\frac{h'}{h} = -\\frac{v}{u}$$

Where:
- **h'** = image height
- **h** = object height
- If m is **negative** → image is **real and inverted**
- If m is **positive** → image is **virtual and erect**
- |m| > 1 → image is **enlarged** (magnified)
- |m| < 1 → image is **diminished** (smaller)
- |m| = 1 → image is **same size as object**

---

## 🔬 Part 3: Lens Formula

### The Formula

$$\\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f}$$

> ⚠️ **IMPORTANT:** Note the MINUS sign between 1/v and 1/u. This is different from the mirror formula which uses PLUS!

Where:
- **v** = image distance from lens
- **u** = object distance from lens (always negative for real objects)
- **f** = focal length (+ for convex lens, − for concave lens)

### Lens Magnification

$$m = \\frac{h'}{h} = \\frac{v}{u}$$

> ⚠️ **Key Difference:** Lens magnification = v/u (NO negative sign!). Mirror magnification = −v/u (WITH negative sign!)

### Power of a Lens

$$P = \\frac{1}{f(\\text{in metres})}$$

- SI unit: **Dioptre (D)** = m⁻¹
- Convex lens: **P is positive**
- Concave lens: **P is negative**
- Lenses in contact: **P_total = P₁ + P₂ + P₃ + ...**

---

## 🔢 Part 4: Solved Numerical Examples

### Example 1: Concave Mirror — Finding Image Position

**Problem:** An object is placed 20 cm in front of a concave mirror of focal length 15 cm. Find (a) image distance (b) nature of image.

**Solution:**

Given:
- u = −20 cm (object in front of mirror, always negative)
- f = −15 cm (concave mirror, negative focal length)

Using Mirror Formula: $\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}$

$$\\frac{1}{v} = \\frac{1}{f} - \\frac{1}{u} = \\frac{1}{-15} - \\frac{1}{-20}$$

$$\\frac{1}{v} = -\\frac{1}{15} + \\frac{1}{20} = \\frac{-4 + 3}{60} = \\frac{-1}{60}$$

$$v = -60 \\text{ cm}$$

**Magnification:** $m = -\\frac{v}{u} = -\\frac{-60}{-20} = -3$

**Answer:**
- Image is at **60 cm in front of the mirror** (negative v = in front)
- **m = −3**: image is real, inverted, and 3 times enlarged

---

### Example 2: Convex Mirror — Vehicle Rear-View

**Problem:** A convex mirror has focal length 20 cm. An object is placed 30 cm in front of it. Find the image position and magnification.

**Solution:**

Given:
- u = −30 cm (always negative)
- f = +20 cm (convex mirror, positive)

$$\\frac{1}{v} = \\frac{1}{f} - \\frac{1}{u} = \\frac{1}{20} - \\frac{1}{-30} = \\frac{1}{20} + \\frac{1}{30}$$

$$\\frac{1}{v} = \\frac{3 + 2}{60} = \\frac{5}{60} = \\frac{1}{12}$$

$$v = +12 \\text{ cm}$$

**Magnification:** $m = -\\frac{v}{u} = -\\frac{12}{-30} = +0.4$

**Answer:**
- Image is **12 cm behind the mirror** (+v = behind mirror)
- **m = +0.4**: virtual, erect, diminished (0.4 times the object size)
- This is why convex mirrors are used in vehicles — wide field, upright image!

---

### Example 3: Concave Mirror at Focus

**Problem:** Where is the image when object is at focus of concave mirror of focal length 10 cm?

**Solution:**
- u = −10 cm, f = −10 cm

$$\\frac{1}{v} = \\frac{1}{f} - \\frac{1}{u} = \\frac{1}{-10} - \\frac{1}{-10} = 0$$

$$v = \\infty$$

**Answer:** Image forms at **infinity** → parallel rays after reflection. This is used in **torch lights and headlights**!

---

### Example 4: Convex Lens — Camera Application

**Problem:** A convex lens has focal length 10 cm. An object is placed 30 cm from the lens. Find image position and magnification.

**Solution:**

Given: u = −30 cm, f = +10 cm

Using Lens Formula: $\\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f}$

$$\\frac{1}{v} = \\frac{1}{f} + \\frac{1}{u} = \\frac{1}{10} + \\frac{1}{-30} = \\frac{1}{10} - \\frac{1}{30}$$

$$\\frac{1}{v} = \\frac{3-1}{30} = \\frac{2}{30} = \\frac{1}{15}$$

$$v = +15 \\text{ cm}$$

**Magnification:** $m = \\frac{v}{u} = \\frac{15}{-30} = -0.5$

**Answer:**
- Image at **15 cm on the other side of lens** (positive)
- **m = −0.5**: real, inverted, diminished (half the object size)
- This is how a **camera** captures images — real, inverted, smaller image on film/sensor!

---

### Example 5: Concave Lens

**Problem:** Object at 30 cm from a concave lens of focal length 15 cm. Find image position.

**Solution:**
- u = −30 cm, f = −15 cm (concave lens: negative)

$$\\frac{1}{v} = \\frac{1}{f} + \\frac{1}{u} = \\frac{1}{-15} + \\frac{1}{-30} = -\\frac{2}{30} - \\frac{1}{30} = -\\frac{3}{30} = -\\frac{1}{10}$$

$$v = -10 \\text{ cm}$$

**Magnification:** $m = \\frac{v}{u} = \\frac{-10}{-30} = +\\frac{1}{3}$$

**Answer:**
- Image at **10 cm on the same side as object** (negative = left side)
- **m = +1/3**: virtual, erect, diminished
- Concave lens ALWAYS gives virtual, erect, diminished image — no exceptions!

---

### Example 6: Power of Lens Combination

**Problem:** Two lenses, P₁ = +3.5 D and P₂ = −1.5 D are placed in contact. Find combined power and focal length.

**Solution:**

$$P_{total} = P_1 + P_2 = 3.5 + (-1.5) = +2.0 \\text{ D}$$

$$f = \\frac{1}{P} = \\frac{1}{2.0} = 0.5 \\text{ m} = 50 \\text{ cm}$$

**Answer:**
- Combined power = **+2.0 D** (positive → converging system)
- Combined focal length = **50 cm** (converging)

---

### Example 7: Using Radius of Curvature

**Problem:** A concave mirror has radius of curvature 30 cm. Object is at 45 cm. Find image.

**Solution:**
- R = 30 cm → f = R/2 = 15 cm → f = −15 cm (concave)
- u = −45 cm

$$\\frac{1}{v} = \\frac{1}{f} - \\frac{1}{u} = \\frac{1}{-15} - \\frac{1}{-45} = -\\frac{3}{45} + \\frac{1}{45} = -\\frac{2}{45}$$

$$v = -22.5 \\text{ cm}$$

**Magnification:** $m = -\\frac{v}{u} = -\\frac{-22.5}{-45} = -0.5$

**Answer:** Image at 22.5 cm in front (real, inverted, half the size)

---

### Example 8: Finding Object Position from Image

**Problem:** A concave mirror produces a real image 3 times the size of the object. Focal length is 12 cm. Find object distance.

**Solution:**

Image is real and 3× magnified → m = −3 (negative for real in mirrors)

$$m = -\\frac{v}{u} \\Rightarrow -3 = -\\frac{v}{u} \\Rightarrow v = 3u$$

Substituting in mirror formula:
$$\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}$$
$$\\frac{1}{3u} + \\frac{1}{u} = \\frac{1}{-12}$$
$$\\frac{1 + 3}{3u} = \\frac{1}{-12}$$
$$\\frac{4}{3u} = -\\frac{1}{12}$$
$$3u = -48$$
$$u = -16 \\text{ cm}$$

So v = 3u = −48 cm

**Answer:** Object at **16 cm in front**, image at **48 cm in front** (real, inverted, 3× enlarged)

---

### Example 9: Lens — Finding Focal Length from Object and Image Positions

**Problem:** An object placed 25 cm from a convex lens gives a real image at 75 cm on the other side. Find focal length and power.

**Solution:**
- u = −25 cm (always negative)
- v = +75 cm (real image, other side of lens = positive)

$$\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u} = \\frac{1}{75} - \\frac{1}{-25} = \\frac{1}{75} + \\frac{1}{25}$$

$$\\frac{1}{f} = \\frac{1}{75} + \\frac{3}{75} = \\frac{4}{75}$$

$$f = \\frac{75}{4} = 18.75 \\text{ cm} = 0.1875 \\text{ m}$$

$$P = \\frac{1}{f} = \\frac{1}{0.1875} ≈ +5.33 \\text{ D}$$

---

### Example 10: Mirror Rotation Problem

**Problem:** A ray hits a plane mirror at 30° to the surface. If mirror rotates by 15°, what angle does the reflected ray turn through?

**Solution:**
- Original angle of incidence = 90° − 30° = 60° (angle from normal)
- When mirror rotates by θ, reflected ray rotates by **2θ**
- Mirror rotated by 15° → reflected ray rotates by **2 × 15° = 30°**

---

## 📊 Part 5: Complete Formula Quick Reference

| Formula | Expression | Notes |
|---------|-----------|-------|
| Mirror Formula | 1/v + 1/u = 1/f | Note: PLUS between terms |
| Lens Formula | 1/v − 1/u = 1/f | Note: MINUS between terms |
| Mirror Magnification | m = −v/u | Note: NEGATIVE sign |
| Lens Magnification | m = v/u | Note: NO negative sign |
| Radius of Curvature | R = 2f | For both mirrors and lenses |
| Power of Lens | P = 1/f(m) | f must be in metres |
| Combined Power | P = P₁ + P₂ | When lenses in contact |

---

## ⚠️ Part 6: Most Common Exam Mistakes

### Mistake 1: Wrong Sign for u
❌ Writing u = +20 cm (WRONG)
✅ Always write u = −20 cm (object always on left side)

### Mistake 2: Wrong Mirror Formula for Lenses
❌ Using 1/v + 1/u = 1/f for a lens (WRONG)
✅ Lens formula has MINUS: 1/v − 1/u = 1/f

### Mistake 3: Wrong Magnification Formula
❌ m = v/u for mirror (WRONG)
✅ m = −v/u for mirror (negative sign needed)
✅ m = v/u for lens (no negative sign)

### Mistake 4: Forgetting Units for Power
❌ P = 1/f where f = 20 cm → P = 0.05 (WRONG — f not in metres)
✅ f = 20 cm = 0.20 m → P = 1/0.20 = **+5 D** (CORRECT)

### Mistake 5: Sign of f for Concave Lens
❌ f = +15 cm for concave lens (WRONG)
✅ f = −15 cm for concave lens (always negative)

---

## 🏆 Part 7: Exam Strategy for Numericals

**Step 1:** Write all "Given" data with correct signs
**Step 2:** Identify what formula to use (mirror vs lens)
**Step 3:** Substitute and solve step by step
**Step 4:** Interpret the answer:
  - v negative for mirror → real image in front
  - v positive for lens → real image on other side
  - m negative → real, inverted
  - m positive → virtual, erect
  - |m| > 1 → enlarged
  - |m| < 1 → diminished
**Step 5:** Write a complete sentence answer with nature, position, and size

---

## 🌐 Part 8: Real-Life Applications of Optics Formulas

| Application | Formula Used | How |
|-------------|-------------|-----|
| Headlights / Torch | Mirror formula | Object at focus → image at infinity (parallel beam) |
| Dentist's mirror | Mirror formula | Object inside focus → virtual, enlarged image |
| Rear-view mirror | Mirror formula | Convex gives wide field, virtual, erect image |
| Camera | Lens formula | Object beyond 2f → real, inverted, smaller image |
| Microscope eyepiece | Lens formula | Object inside f → virtual, enlarged image |
| Telescope objective | Lens formula | Object at infinity → image at focus |
| Reading glasses | Lens power | Convex lens corrects hypermetropia |
| Short-sight glasses | Lens power | Concave lens corrects myopia |
| Projector | Lens formula | Object between f and 2f → real, inverted, enlarged |

---

## 📐 Part 9: Height and Magnification Problems

### When both h and h' are given:

$$m = \\frac{h'}{h}$$

If h = 5 cm and h' = −15 cm:
m = −15/5 = −3 → image is real, inverted, 3× enlarged

### Finding image height when object height is known:

$$h' = m \\times h = \\left(-\\frac{v}{u}\\right) \\times h$$

---

## 🔁 Part 10: Quick Checks (Use These in Exam)

✅ **Concave mirror:** Can form both real AND virtual images depending on object position
✅ **Convex mirror:** ALWAYS forms virtual, erect, diminished image
✅ **Convex lens:** Can form both real AND virtual images
✅ **Concave lens:** ALWAYS forms virtual, erect, diminished image
✅ **Real image:** Formed by actual intersection of reflected/refracted rays → can be projected on screen
✅ **Virtual image:** Formed by apparent intersection → cannot be projected
`,

  questions: [
    /* ───────────── MCQ (15 Questions) ───────────── */
    {
      id: "q9-1",
      type: "mcq",
      question: "According to the New Cartesian Sign Convention, the object distance (u) for a real object is always:",
      options: [
        "Positive (+)",
        "Negative (−)",
        "Zero",
        "Either positive or negative depending on the mirror type"
      ],
      correctAnswer: "Negative (−)",
      explanation: "The object is always placed on the left side of the optical device (mirror/lens). Distances measured against the direction of incident light (from the optical centre towards the left) are always negative. Hence u is always negative.",
      points: 10
    },
    {
      id: "q9-2",
      type: "mcq",
      question: "The focal length of a concave lens is:",
      options: [
        "Always positive",
        "Always negative",
        "Sometimes positive, sometimes negative",
        "Zero"
      ],
      correctAnswer: "Always negative",
      explanation: "A concave (diverging) lens has its focal point on the same side as the object (left side). By sign convention, distances on the left are negative. Hence focal length of a concave lens is always negative.",
      points: 10
    },
    {
      id: "q9-3",
      type: "mcq",
      question: "An object is placed 20 cm from a concave mirror of focal length 10 cm. The image distance is:",
      options: [
        "+20 cm",
        "−20 cm",
        "+10 cm",
        "−10 cm"
      ],
      correctAnswer: "−20 cm",
      explanation: "Using mirror formula: 1/v + 1/u = 1/f → 1/v = 1/(−10) − 1/(−20) = −1/10 + 1/20 = (−2+1)/20 = −1/20. So v = −20 cm. Negative sign confirms image is in front of mirror (real).",
      points: 10
    },
    {
      id: "q9-4",
      type: "mcq",
      question: "If magnification m = +0.5, the image is:",
      options: [
        "Real, inverted, enlarged",
        "Virtual, erect, diminished",
        "Real, erect, enlarged",
        "Virtual, inverted, diminished"
      ],
      correctAnswer: "Virtual, erect, diminished",
      explanation: "Positive m → image is virtual and erect. |m| = 0.5 < 1 → image is diminished (smaller than object). So the image is virtual, erect, and diminished.",
      points: 10
    },
    {
      id: "q9-5",
      type: "mcq",
      question: "The power of a lens of focal length 25 cm is:",
      options: [
        "+0.25 D",
        "+4 D",
        "−4 D",
        "+25 D"
      ],
      correctAnswer: "+4 D",
      explanation: "P = 1/f(metres) = 1/0.25 = +4 D. First convert 25 cm to 0.25 m, then take reciprocal. The positive sign indicates a convex (converging) lens.",
      points: 10
    },
    {
      id: "q9-6",
      type: "mcq",
      question: "Two lenses of power +3 D and −1 D are placed in contact. The combined focal length is:",
      options: [
        "0.5 m",
        "2 m",
        "−0.5 m",
        "−2 m"
      ],
      correctAnswer: "0.5 m",
      explanation: "P_total = P₁ + P₂ = 3 + (−1) = +2 D. f = 1/P = 1/2 = 0.5 m = 50 cm. Positive combined power means the system is converging (acts like a convex lens).",
      points: 10
    },
    {
      id: "q9-7",
      type: "mcq",
      question: "A convex lens forms a virtual image when the object is placed:",
      options: [
        "Beyond 2F",
        "At 2F",
        "Between F and 2F",
        "Between F and the optical centre"
      ],
      correctAnswer: "Between F and the optical centre",
      explanation: "A convex lens forms a virtual, erect, magnified image ONLY when the object is placed between the focal point (F) and the optical centre. For all other positions, it forms real images.",
      points: 10
    },
    {
      id: "q9-8",
      type: "mcq",
      question: "The radius of curvature of a concave mirror is 30 cm. If an object is placed at C (centre of curvature), the image will be:",
      options: [
        "At infinity",
        "At F (focus)",
        "At C itself",
        "Between F and C"
      ],
      correctAnswer: "At C itself",
      explanation: "When object is at C (u = −R = −30 cm), focal length f = −R/2 = −15 cm. Using mirror formula: 1/v = 1/(−15) − 1/(−30) = −2/30 + 1/30 = −1/30. So v = −30 cm = C. Image forms at C: real, inverted, same size (m = −1).",
      points: 10
    },
    {
      id: "q9-9",
      type: "mcq",
      question: "Which of the following correctly states the lens formula?",
      options: [
        "1/v + 1/u = 1/f",
        "1/v − 1/u = 1/f",
        "1/u − 1/v = 1/f",
        "v − u = f"
      ],
      correctAnswer: "1/v − 1/u = 1/f",
      explanation: "The lens formula is 1/v − 1/u = 1/f (note: minus sign). This is different from mirror formula (1/v + 1/u = 1/f which uses plus). Confusing these two is the most common exam mistake!",
      points: 10
    },
    {
      id: "q9-10",
      type: "mcq",
      question: "A concave mirror has f = 15 cm. An object at u = −10 cm (between P and F). The image is:",
      options: [
        "Real, inverted, at 30 cm in front",
        "Virtual, erect, at 30 cm behind mirror",
        "At infinity",
        "Real, inverted, at 10 cm in front"
      ],
      correctAnswer: "Virtual, erect, at 30 cm behind mirror",
      explanation: "1/v = 1/(−15) − 1/(−10) = −1/15 + 1/10 = (−2+3)/30 = 1/30. v = +30 cm (behind mirror = virtual). m = −(30)/(−10) = +3 (positive = erect, enlarged). Image is virtual, erect, 3× magnified at 30 cm behind mirror.",
      points: 10
    },
    {
      id: "q9-11",
      type: "mcq",
      question: "If a concave mirror rotates by 10°, the reflected ray rotates by:",
      options: ["5°", "10°", "20°", "15°"],
      correctAnswer: "20°",
      explanation: "When a mirror rotates by angle θ, the reflected ray rotates by 2θ. This is because the normal rotates by θ, and both the angle of incidence and angle of reflection each change by θ, making the reflected ray deviate by 2θ.",
      points: 10
    },
    {
      id: "q9-12",
      type: "mcq",
      question: "The SI unit of power of a lens is:",
      options: [
        "Dioptre (D)",
        "Candela (cd)",
        "Lumen (lm)",
        "Newton (N)"
      ],
      correctAnswer: "Dioptre (D)",
      explanation: "Power of a lens is measured in Dioptres (D). 1 Dioptre = 1 m⁻¹. P = 1/f where f is in metres. A convex lens of f = 1 m has power +1 D.",
      points: 10
    },
    {
      id: "q9-13",
      type: "mcq",
      question: "Object at 40 cm from convex lens of f = 20 cm. Magnification is:",
      options: ["+1", "−1", "+0.5", "−0.5"],
      correctAnswer: "−1",
      explanation: "u = −40, f = +20. 1/v = 1/20 + 1/(−40) = 2/40 − 1/40 = 1/40. v = +40 cm. m = v/u = 40/(−40) = −1. Object at 2F gives same-size, real, inverted image at 2F on other side.",
      points: 10
    },
    {
      id: "q9-14",
      type: "mcq",
      question: "A person uses +2.5 D spectacle lens. Their eye defect and far point are:",
      options: [
        "Myopia; far point at 40 cm",
        "Hypermetropia; near point beyond 25 cm",
        "Presbyopia; near point at 25 cm",
        "Myopia; near point at 40 cm"
      ],
      correctAnswer: "Hypermetropia; near point beyond 25 cm",
      explanation: "Positive power lenses (convex lenses) correct hypermetropia (far-sightedness). A hypermetropic eye cannot see nearby objects clearly — its near point is further than the normal 25 cm. The convex lens converges light to help the eye focus on close objects.",
      points: 10
    },
    {
      id: "q9-15",
      type: "mcq",
      question: "In which case does a concave mirror form an enlarged, virtual image?",
      options: [
        "Object at infinity",
        "Object at center of curvature",
        "Object between focus and pole",
        "Object beyond center of curvature"
      ],
      correctAnswer: "Object between focus and pole",
      explanation: "When an object is placed between the focus (F) and the pole (P) of a concave mirror — i.e., inside the focal length — the mirror acts like a magnifying mirror. The image formed is virtual (behind the mirror), erect, and enlarged. This is used in dentist mirrors and makeup mirrors.",
      points: 10
    },

    /* ───────────── Short Answer (10 Questions) ───────────── */
    {
      id: "q9-16",
      type: "short",
      question: "State the New Cartesian Sign Convention for mirrors.",
      options: [],
      correctAnswer: "1. All distances measured from the pole of the mirror.\n2. Distances in the direction of incident light (right) are positive.\n3. Distances against the direction of incident light (left, in front of mirror) are negative.\n4. Heights above the principal axis are positive; below are negative.\n5. Object distance u is always negative for real objects.\n6. Focal length f is negative for concave mirror, positive for convex mirror.",
      explanation: "This convention ensures consistent signs across all numerical problems. Without it, mirror and lens formulas cannot be applied correctly.",
      points: 15
    },
    {
      id: "q9-17",
      type: "short",
      question: "What are the key differences between the mirror formula and the lens formula?",
      options: [],
      correctAnswer: "Mirror Formula: 1/v + 1/u = 1/f (uses PLUS sign)\nLens Formula: 1/v − 1/u = 1/f (uses MINUS sign)\nMirror Magnification: m = −v/u (HAS negative sign)\nLens Magnification: m = v/u (NO negative sign)",
      explanation: "These differences are crucial for exams. Confusing the two formulas or the magnification signs is the most common source of errors in optical numericals.",
      points: 15
    },
    {
      id: "q9-18",
      type: "short",
      question: "An object 4 cm tall is placed 30 cm from a concave mirror of focal length 15 cm. Find the height of the image.",
      options: [],
      correctAnswer: "u = −30 cm, f = −15 cm.\n1/v = 1/(−15) − 1/(−30) = −1/15 + 1/30 = −1/30. v = −30 cm.\nm = −v/u = −(−30)/(−30) = −1.\nh' = m × h = −1 × 4 = −4 cm.\nImage height = 4 cm (inverted, same size as object).",
      explanation: "m = −1 at C means image is same size, real, and inverted. The negative height confirms the image is below the axis (inverted).",
      points: 15
    },
    {
      id: "q9-19",
      type: "short",
      question: "A concave lens of focal length 20 cm forms an image 10 cm in front of it. Where is the object?",
      options: [],
      correctAnswer: "f = −20 cm (concave), v = −10 cm (same side as object = negative).\nUsing Lens Formula: 1/u = 1/v − 1/f = 1/(−10) − 1/(−20) = −1/10 + 1/20 = −1/20.\nu = −20 cm.\nObject is 20 cm in front of the lens.",
      explanation: "For a concave lens, both u and v are negative (both on the same side). The image is always between object and lens for concave lenses.",
      points: 15
    },
    {
      id: "q9-20",
      type: "short",
      question: "A doctor prescribes −2 D lens. What type of defect does the patient have and what is the far point?",
      options: [],
      correctAnswer: "Negative power lens = concave lens → corrects myopia (short-sightedness).\nFocal length f = 1/P = 1/(−2) = −0.5 m = −50 cm.\nThe concave lens will form a virtual image of infinity at 50 cm, which is the patient's far point.\nFar point = 50 cm.",
      explanation: "A myopic eye has a far point closer than infinity. The concave lens with f = 50 cm creates a virtual image of distant objects at 50 cm where the myopic eye can see clearly.",
      points: 15
    },
    {
      id: "q9-21",
      type: "short",
      question: "Why does the lens formula use a minus sign (1/v − 1/u) while the mirror formula uses a plus sign (1/v + 1/u)?",
      options: [],
      correctAnswer: "The difference arises from the geometry of reflection vs refraction. In a mirror, the object and image are on the same side (both use the same sign convention axis). In a lens, light passes through, and object and image are on opposite sides. The derivation of each formula using geometry/calculus naturally yields different signs due to these different geometrical setups.",
      explanation: "This is a fundamental difference between the two formulas. Students must memorize: MIRROR formula → PLUS, LENS formula → MINUS.",
      points: 15
    },
    {
      id: "q9-22",
      type: "short",
      question: "Calculate the power of a concave lens of focal length 40 cm.",
      options: [],
      correctAnswer: "f = 40 cm = 0.40 m (convert to metres).\nBut concave lens → f must be negative: f = −0.40 m.\nP = 1/f = 1/(−0.40) = −2.5 D.\nThe negative power confirms it is a diverging (concave) lens.",
      explanation: "Always convert focal length to metres before calculating power. The negative power of −2.5 D indicates a concave (diverging) lens.",
      points: 15
    },
    {
      id: "q9-23",
      type: "short",
      question: "An object 2 cm high is placed 10 cm from a convex mirror of focal length 15 cm. Find the image height.",
      options: [],
      correctAnswer: "u = −10 cm, f = +15 cm (convex mirror).\n1/v = 1/f − 1/u = 1/15 − 1/(−10) = 1/15 + 1/10 = 2/30 + 3/30 = 5/30 = 1/6.\nv = +6 cm.\nm = −v/u = −(6)/(−10) = +0.6.\nh' = m × h = 0.6 × 2 = +1.2 cm.\nImage height = 1.2 cm (positive = erect).",
      explanation: "Convex mirrors always give positive v, positive m, and smaller images. This is why the field of view is larger in convex rear-view mirrors.",
      points: 15
    },
    {
      id: "q9-24",
      type: "short",
      question: "Three lenses of power +1.5 D, +2.0 D and −0.5 D are placed in contact. Find combined focal length.",
      options: [],
      correctAnswer: "P_total = P₁ + P₂ + P₃ = 1.5 + 2.0 + (−0.5) = +3.0 D.\nf = 1/P = 1/3.0 = 0.333 m ≈ 33.3 cm.\nThe positive combined power means the system acts as a converging (convex) lens.",
      explanation: "For lenses in contact, just add powers algebraically. This principle is used in designing camera lens systems and spectacles.",
      points: 15
    },
    {
      id: "q9-25",
      type: "short",
      question: "A concave mirror forms a real image 4 times the size of the object. Object is at u = −12 cm. Find image distance and focal length.",
      options: [],
      correctAnswer: "Real image, 4× magnified → m = −4.\nm = −v/u → −4 = −v/(−12) → −4 = v/12 → v = −48 cm.\n1/f = 1/v + 1/u = 1/(−48) + 1/(−12) = −1/48 − 4/48 = −5/48.\nf = −48/5 = −9.6 cm.\nFocal length = 9.6 cm (negative confirming concave mirror).",
      explanation: "Using magnification to find v first, then substituting into mirror formula to find f is an elegant two-step approach for such problems.",
      points: 15
    },

    /* ───────────── Long Answer (5 Questions) ───────────── */
    {
      id: "q9-26",
      type: "long",
      question: "Explain the New Cartesian Sign Convention for spherical mirrors with a neat diagram. Why is this convention necessary?",
      options: [],
      correctAnswer: "New Cartesian Sign Convention:\n\nDiagram: Place mirror at origin (O). Draw principal axis horizontally. Object on left side.\n\nRules:\n1. All distances measured from pole (P) of mirror.\n2. Right side (direction of incident light) = Positive (+)\n3. Left side (against incident light) = Negative (−)\n4. Above axis = Positive (+)\n5. Below axis = Negative (−)\n\nConsequences:\n• u (object distance) is always NEGATIVE\n• f of concave mirror is NEGATIVE (focus in front)\n• f of convex mirror is POSITIVE (focus behind)\n• Real image → v is negative (in front of mirror)\n• Virtual image → v is positive (behind mirror)\n\nNecessity:\nThis convention is necessary to make mirror/lens formulas mathematically consistent and universal. Without a sign convention, we would need different formulas for each type of mirror and each position of the object. With this convention, ONE single formula (1/v + 1/u = 1/f) works for ALL cases — concave, convex, real, and virtual.",
      explanation: "The New Cartesian Sign Convention standardizes optics calculations. It was introduced to eliminate the confusion that arose from older 'real is positive' conventions.",
      points: 20
    },
    {
      id: "q9-27",
      type: "long",
      question: "Derive the expression for magnification of a concave mirror and explain what the sign of m tells us.",
      options: [],
      correctAnswer: "Derivation of Magnification:\n\nConsider an object AB placed in front of concave mirror M. Object is at distance u from P, object height = h.\nImage A'B' forms at distance v from P, image height = h'.\n\nIn the ray diagram, two triangles are similar:\nTriangle ABP ~ Triangle A'B'P\n\nFrom similar triangles:\nA'B'/AB = B'P/BP\n\nUsing sign convention:\nA'B' = h' (positive if above axis, negative if below)\nAB = h (positive, object above axis)\nB'P = |v| (image distance)\nBP = |u| (object distance)\n\nWith signs: h'/h = −v/u\n\nTherefore: m = h'/h = −v/u\n\nInterpretation of sign of m:\n• m is NEGATIVE: image is REAL and INVERTED\n  (h' is negative = below axis = upside down)\n• m is POSITIVE: image is VIRTUAL and ERECT\n  (h' is positive = above axis = right-side up)\n• |m| > 1: image is MAGNIFIED (enlarged)\n• |m| < 1: image is DIMINISHED (smaller)\n• |m| = 1: image is SAME SIZE as object",
      explanation: "The derivation using similar triangles is elegant. The negative sign in m = −v/u is a direct result of the sign convention and the geometry of image formation.",
      points: 20
    },
    {
      id: "q9-28",
      type: "long",
      question: "An object 3 cm high is placed 25 cm from a convex lens of focal length 10 cm. Find by calculation (a) image distance (b) image height (c) nature of image. Verify using object position rule.",
      options: [],
      correctAnswer: "Given: h = 3 cm, u = −25 cm, f = +10 cm\n\n(a) Lens Formula: 1/v − 1/u = 1/f\n1/v = 1/f + 1/u = 1/10 + 1/(−25) = 1/10 − 1/25\n1/v = 5/50 − 2/50 = 3/50\nv = 50/3 = +16.67 cm\n\n(b) Magnification: m = v/u = (50/3)/(−25) = −2/3\nh' = m × h = (−2/3) × 3 = −2 cm\nImage height = 2 cm (negative = inverted)\n\n(c) Nature:\n• v is positive → real image (on other side of lens)\n• m is negative (−2/3) → real and inverted\n• |m| < 1 → diminished (2 cm < 3 cm)\n\nVerification using object position rule:\nObject at u = −25 cm. 2F = 2×10 = 20 cm.\nObject is BEYOND 2F (25 > 20) → image should be between F and 2F, real, inverted, diminished.\nOur answer: v = 16.67 cm (which is between F=10 cm and 2F=20 cm). ✓ Consistent!",
      explanation: "This complete solution shows how all three quantities (v, h', nature) are found systematically, and how to cross-verify with the ray diagram rules.",
      points: 20
    },
    {
      id: "q9-29",
      type: "long",
      question: "Compare and contrast the mirror formula and lens formula. What are the key differences in signs and applications?",
      options: [],
      correctAnswer: "MIRROR FORMULA:\n• Formula: 1/v + 1/u = 1/f\n• Magnification: m = −v/u (WITH negative sign)\n• Concave mirror: f is negative\n• Convex mirror: f is positive\n• Image: v negative = real (in front); v positive = virtual (behind)\n• Applications: Headlights, dentist mirrors, rear-view mirrors\n\nLENS FORMULA:\n• Formula: 1/v − 1/u = 1/f\n• Magnification: m = v/u (WITHOUT negative sign)\n• Convex lens: f is positive\n• Concave lens: f is negative\n• Image: v positive = real (other side); v negative = virtual (same side)\n• Applications: Cameras, microscopes, telescopes, spectacles\n\nKEY DIFFERENCES:\n1. Sign between terms: Mirror uses '+', Lens uses '−'\n2. Magnification sign: Mirror uses '−v/u', Lens uses 'v/u'\n3. Concave mirror and convex lens both have their foci on the same relative side but with DIFFERENT signs (f = − for concave mirror, f = + for convex lens)\n4. Virtual image sign: Concave mirror virtual image has v positive (behind mirror), Concave lens virtual image has v negative (same side as object)\n\nCommon: Both use New Cartesian Sign Convention. Both require u to be negative for real objects.",
      explanation: "Understanding the differences prevents the most common exam mistakes. The different signs are not arbitrary — they arise from the different geometrical derivations of each formula.",
      points: 20
    },
    {
      id: "q9-30",
      type: "long",
      question: "Solve this advanced numerical: A converging lens of focal length 20 cm is placed in contact with a diverging lens of focal length 30 cm. (a) Find the combined power and focal length. (b) An object is placed 60 cm from this lens combination. Find the image position.",
      options: [],
      correctAnswer: "(a) Combined Power and Focal Length:\nP₁ = 1/f₁ = 1/(0.20) = +5 D (converging, positive)\nP₂ = 1/f₂ = 1/(−0.30) = −10/3 D (diverging, negative)\nP_total = P₁ + P₂ = 5 − 10/3 = 15/3 − 10/3 = 5/3 D\nf_combined = 1/P = 3/5 = 0.60 m = 60 cm\n(Positive f → system acts as converging lens)\n\n(b) Image Position:\nu = −60 cm, f = +60 cm\n1/v − 1/u = 1/f\n1/v = 1/f + 1/u = 1/60 + 1/(−60) = 1/60 − 1/60 = 0\nv = infinity\n\nThe image forms at infinity!\nThis makes sense: when u = f, the rays emerge parallel → image at infinity.\nThis combination is used in projectors to collimate (make parallel) the light beam.",
      explanation: "This problem combines power addition with lens formula application. The result (image at infinity when u = f) has a beautiful practical application in optical instruments that need parallel beams.",
      points: 25
    },

    /* ───────────── HOTS — Higher Order Thinking (5 Questions) ───────────── */
    {
      id: "q9-31",
      type: "thinking",
      question: "A magician places a coin inside a bowl. When you stand back, the coin disappears. When he pours water, the coin reappears. Explain using optics formulas what is happening and estimate how deep the coin appears to be if water depth is 10 cm and refractive index of water is 1.33.",
      options: [],
      correctAnswer: "Empty bowl: The coin is hidden behind the bowl rim — light from coin doesn't reach your eye.\n\nWith water: Refraction at water-air surface bends the light rays outward. The rays appear to come from a higher point — the coin appears to rise up (become visible).\n\nThis is the Apparent Depth phenomenon:\nApparent Depth = Real Depth / Refractive Index\n= 10 / 1.33\n= 7.52 cm\n\nSo the coin appears to be only 7.52 cm below the surface, not 10 cm.\nThe upward shift = 10 − 7.52 = 2.48 cm\n\nThis shift in apparent position makes the previously hidden coin visible above the rim from the observer's angle.",
      explanation: "This classic trick uses refraction and apparent depth. The formula Apparent Depth = Real Depth / n is derived from Snell's law for small angles (paraxial approximation).",
      points: 25
    },
    {
      id: "q9-32",
      type: "thinking",
      question: "If you take a glass convex lens and submerge it in water, its converging power decreases. If you submerge it in a medium whose refractive index equals that of the lens itself, it disappears! Explain this using the Lens Maker's equation concept.",
      options: [],
      correctAnswer: "The Lens Maker's Equation relates focal length to the relative refractive index:\n1/f ∝ (n_lens/n_medium − 1)\n\nCase 1: In air (n_medium = 1.0), n_glass ≈ 1.5\n(1.5/1.0 − 1) = 0.5 → Strong converging action\n\nCase 2: In water (n_medium = 1.33), n_glass ≈ 1.5\n(1.5/1.33 − 1) = 1.128 − 1 = 0.128 → Weakly converging\nPower drastically reduced!\n\nCase 3: In liquid with n_medium = 1.5 = n_glass\n(1.5/1.5 − 1) = 1 − 1 = 0 → 1/f = 0 → f = infinity → No converging power!\nThe lens neither converges nor diverges — it is optically invisible!\n\nThis is why an air bubble in water acts as a DIVERGING lens (n_air < n_water, reversing the sign).",
      explanation: "This conceptual problem reveals that lens power depends on the relative refractive index between the lens and its surrounding medium, not just the lens material alone.",
      points: 25
    },
    {
      id: "q9-33",
      type: "thinking",
      question: "A virtual image cannot be formed on a screen, yet we see virtual images all the time (in mirrors, through lenses). How is it that our eyes can see virtual images even though they cannot be projected?",
      options: [],
      correctAnswer: "This is a profound question about how vision works.\n\nA screen captures light by being in the PATH of actual light rays. Real images have light actually converging at that point — you can intercept those rays with a screen.\n\nVirtual images are different: the light rays NEVER actually pass through the virtual image point. They only APPEAR to diverge from that point when extended backwards. The light rays themselves travel outward.\n\nOur EYES work differently from a screen:\n1. The eye's crystalline lens is a CONVERGING LENS\n2. It intercepts the ACTUAL diverging rays coming from the mirror/lens\n3. Our lens then RECONVERGES these rays onto the retina\n4. The brain interprets the image as coming from the apparent source (the virtual image location)\n\nSo we can see virtual images because our eye lens performs a second focusing operation on the actual (diverging) light rays. The eye doesn't need the light to converge before entering it — it converges the light itself.\n\nThis is also why we can see through magnifying glasses (which form virtual images) — our eye lens completes the focusing.",
      explanation: "This question tests deep understanding of virtual image formation and how human vision works. The eye acts as a real-time optical processor that converts virtual image signals into real retinal images.",
      points: 25
    },
    {
      id: "q9-34",
      type: "thinking",
      question: "A student says: 'Since 1/v + 1/u = 1/f, if I put u = ∞ (object at infinity), then 1/∞ = 0, so 1/v = 1/f, giving v = f.' Verify this numerically for a concave mirror of f = 20 cm with object at u = −1000 cm and show that v approaches f as u → ∞.",
      options: [],
      correctAnswer: "f = −20 cm, u = −1000 cm\n\n1/v = 1/f − 1/u = 1/(−20) − 1/(−1000)\n= −1/20 + 1/1000\n= −50/1000 + 1/1000\n= −49/1000\nv = −1000/49 = −20.41 cm\n\nSo at u = −1000 cm, v = −20.41 cm ≈ −20 cm = f ✓\n\nAs u → ∞:\n1/u → 0\n1/v = 1/f − 0 = 1/f\nv = f = −20 cm\n\nAt u = −100 cm: v = 1/(1/−20 − 1/−100) = 1/(−5/100 + 1/100) = 1/(−4/100) = −25 cm\nAt u = −200 cm: v = 1/(1/−20 − 1/−200) = 1/(−10/200 + 1/200) = 1/(−9/200) = −22.2 cm\nAt u = −1000 cm: v = −20.41 cm\nAt u = −∞: v = −20 cm = f ✓\n\nClearly, v approaches f as u approaches infinity. Headlights use this — bulb at focus → parallel reflected beam (u = f → v = ∞ after reflection).",
      explanation: "This numerical verification proves why parallel rays (from very distant objects) converge at the focal point of a concave mirror. The approach to the limit demonstrates mathematical continuity of the mirror formula.",
      points: 25
    },
    {
      id: "q9-35",
      type: "thinking",
      question: "Design the CCTV camera lens system: The camera must capture objects at distances from 2 m to 50 m and project the image onto a sensor that is exactly 2 cm behind the lens. What range of focal lengths is needed, and what type of mechanism allows this (autofocus)?",
      options: [],
      correctAnswer: "Given: v = +2 cm = +0.02 m (sensor position, fixed)\nObject at u₁ = −2 m (nearest) and u₂ = −50 m (farthest)\n\nUsing Lens Formula: 1/v − 1/u = 1/f\n\nFor nearest object (u = −2 m):\n1/f = 1/0.02 − 1/(−2) = 50 + 0.5 = 50.5\nf = 1/50.5 = 0.01980 m = 1.980 cm\n\nFor farthest object (u = −50 m):\n1/f = 1/0.02 − 1/(−50) = 50 + 0.02 = 50.02\nf = 1/50.02 = 0.01999 m = 1.999 cm\n\nRequired focal length range: 1.980 cm to 1.999 cm\nThis is an extremely small change (only 0.019 cm = 0.19 mm!)\n\nAutofocus Mechanism:\nModern cameras don't change focal length — they change the LENS POSITION (distance between lens and sensor = v). A tiny motor shifts the lens by fractions of a millimetre. The formula 1/v − 1/u = 1/f is computed electronically in real-time. This is exactly the mathematics behind every smartphone autofocus system!\n\nFor very long zoom (telephoto), f is increased by using multiple lens elements — changing the effective combined focal length while the physical sensor stays fixed.",
      explanation: "Real-world camera design is pure applied optics. The negligible change in f explains why fixed-focus 'pancake lenses' work for most distances, while autofocus fine-tunes the position rather than the focal length.",
      points: 25
    },

    /* ───────────── Additional MCQ Numericals (5 Questions — total 20 MCQ) ───────────── */
    {
      id: "q9-36",
      type: "mcq",
      question: "A concave mirror has a radius of curvature 30 cm. An object is placed 45 cm in front of it. The image distance is:",
      options: [
        "−22.5 cm",
        "+22.5 cm",
        "−45 cm",
        "+45 cm"
      ],
      correctAnswer: "−22.5 cm",
      explanation: "R = 30 cm → f = R/2 = 15 cm. With sign convention, f = −15 cm, u = −45 cm.\n1/v = 1/f − 1/u = 1/(−15) − 1/(−45) = −1/15 + 1/45 = (−3+1)/45 = −2/45. v = −45/2 = −22.5 cm.\nNegative v confirms real image in front of mirror.",
      points: 10
    },
    {
      id: "q9-37",
      type: "mcq",
      question: "A convex mirror has focal length 20 cm. Where is the image of an object placed 60 cm in front of the mirror?",
      options: [
        "+15 cm behind the mirror",
        "−15 cm in front of the mirror",
        "+30 cm behind the mirror",
        "−30 cm in front of the mirror"
      ],
      correctAnswer: "+15 cm behind the mirror",
      explanation: "Convex mirror: f = +20 cm, u = −60 cm.\n1/v = 1/f − 1/u = 1/20 − 1/(−60) = 1/20 + 1/60 = 3/60 + 1/60 = 4/60 = 1/15.\nv = +15 cm. Positive v means image is behind the mirror — virtual image. This confirms the convex mirror always gives a virtual, erect image.",
      points: 10
    },
    {
      id: "q9-38",
      type: "mcq",
      question: "The magnification produced by a convex lens of focal length 10 cm for an object at 40 cm is:",
      options: [
        "−1/3",
        "+1/3",
        "−3",
        "+3"
      ],
      correctAnswer: "−1/3",
      explanation: "f = +10 cm, u = −40 cm.\n1/v = 1/f + 1/u = 1/10 + 1/(−40) = 4/40 − 1/40 = 3/40. v = +40/3 cm.\nm = v/u = (40/3)/(−40) = −1/3.\nNegative m confirms real, inverted image. |m| = 1/3 < 1 confirms diminished image.",
      points: 10
    },
    {
      id: "q9-39",
      type: "mcq",
      question: "Two thin lenses of focal lengths +15 cm and −15 cm are placed in contact. The equivalent focal length is:",
      options: [
        "Infinity (∞)",
        "30 cm",
        "7.5 cm",
        "0 cm"
      ],
      correctAnswer: "Infinity (∞)",
      explanation: "For lenses in contact: 1/f = 1/f₁ + 1/f₂ = 1/15 + 1/(−15) = 1/15 − 1/15 = 0. When 1/f = 0, f = ∞. The combination acts like a plane glass slab — no converging or diverging effect. This is equivalent to zero power (P = 0 D).",
      points: 10
    },
    {
      id: "q9-40",
      type: "mcq",
      question: "An object is placed 30 cm from a concave mirror of focal length 20 cm. The magnification of the image is:",
      options: [
        "+1",
        "−1",
        "+2",
        "−2"
      ],
      correctAnswer: "−2",
      explanation: "f = −20 cm, u = −30 cm.\n1/v = 1/f − 1/u = 1/(−20) − 1/(−30) = −1/20 + 1/30 = (−3+2)/60 = −1/60. v = −60 cm.\nm = −v/u = −(−60)/(−30) = −60/30 = −2.\nMagnification = −2: image is real (negative), inverted (negative), magnified twice (|m| = 2).",
      points: 10
    },

    /* ───────────── Additional Long Answer Numericals (5 Questions — total 10 Long) ───────────── */
    {
      id: "q9-41",
      type: "long",
      question: "A concave mirror produces a three-times magnified real image of an object placed 10 cm in front of it. Find (a) the image distance, (b) the focal length, and (c) the radius of curvature.",
      options: [],
      correctAnswer: "Given: Real image so m is negative → m = −3. u = −10 cm.\n\n(a) Image Distance:\nm = −v/u → −3 = −v/(−10) → −3 = v/10 → v = −30 cm\n(Negative confirms real image in front of mirror)\n\n(b) Focal Length:\nUsing mirror formula: 1/f = 1/v + 1/u\n1/f = 1/(−30) + 1/(−10) = −1/30 − 1/10 = −1/30 − 3/30 = −4/30 = −2/15\nf = −15/2 = −7.5 cm\n\n(c) Radius of Curvature:\nR = 2f = 2 × (−7.5) = −15 cm\n|R| = 15 cm\n\nVerification: Object at u = −10 cm is between F and P (since |f| = 7.5 cm). Wait — object should be beyond F for real image. Indeed −10 cm > −7.5 cm (numerically beyond F). ✓",
      explanation: "This problem works backwards from magnification to find focal length — a common CBSE board question type. The key insight is that real image → m is negative for concave mirrors.",
      points: 20
    },
    {
      id: "q9-42",
      type: "long",
      question: "A convex lens of focal length 15 cm is used as a magnifying glass. Find the magnifying power when (a) the image is at the near point (25 cm), (b) the image is at infinity. Explain which position is more comfortable for prolonged viewing.",
      options: [],
      correctAnswer: "Magnifying power (angular magnification) of a simple microscope:\n\n(a) Image at near point (D = 25 cm):\nM = 1 + D/f = 1 + 25/15 = 1 + 5/3 = 8/3 ≈ 2.67×\n\nVerification using lens formula:\nImage at v = −25 cm (virtual, same side), f = +15 cm.\n1/u = 1/v − 1/f = 1/(−25) − 1/15 = −3/75 − 5/75 = −8/75.\nu = −75/8 = −9.375 cm. (Object inside focal length ✓)\nm = v/u = (−25)/(−9.375) = 2.67 ✓\n\n(b) Image at infinity:\nM = D/f = 25/15 = 5/3 ≈ 1.67×\n(Object placed exactly at focal point)\n\nComfort Analysis:\n• At infinity: Eye muscles are fully relaxed (no accommodation needed). Best for prolonged viewing.\n• At near point: Eye muscles must strain to focus at 25 cm. Causes eye fatigue.\n\nConclusion: Image at infinity gives lower magnification but is far more comfortable. This is why telescopes and microscopes are usually adjusted for final image at infinity.",
      explanation: "Magnifying glass formula derivation shows how D/f gives the comparison with unaided eye viewing at the near point. The accommodation-free setting at infinity is the preferred working mode for all optical instruments.",
      points: 20
    },
    {
      id: "q9-43",
      type: "long",
      question: "A glass slab 6 cm thick has refractive index 1.5. A mark is made on a paper and placed under the slab. By how much does the mark appear to be shifted upwards? Show the full calculation and draw the ray diagram.",
      options: [],
      correctAnswer: "This uses the lateral (normal) shift in apparent position:\n\nGiven: Real thickness (t) = 6 cm, n = 1.5\n\nApparent Depth Concept:\nWhen light goes from glass (n = 1.5) to air (n = 1.0):\nApparent depth = Real depth / Refractive index\nApparent position of mark = 6 / 1.5 = 4 cm (from top of slab)\n\nShift in position:\nNormal shift = Real thickness − Apparent thickness\n= 6 − 4 = 2 cm\n\nThe mark appears to be 2 cm closer (shifted upward by 2 cm).\n\nRay Diagram:\n[Mark at bottom of slab → rays bend away from normal at glass-air interface → appear to come from virtual position 4 cm down, not 6 cm down]\n\nGeneral Formula:\nShift = t × (1 − 1/n) = 6 × (1 − 1/1.5) = 6 × (1 − 2/3) = 6 × 1/3 = 2 cm ✓\n\nApplications:\n• Why swimming pools appear shallower than they are\n• Why pencils look bent in water at an angle\n• Calculation of apparent depth of fish in aquariums",
      explanation: "The apparent depth formula and the lateral shift formula are both derived from Snell's law under paraxial (small angle) approximation. The shift formula t(1-1/n) is worth memorizing for numericals.",
      points: 20
    },
    {
      id: "q9-44",
      type: "long",
      question: "An object 4 cm tall is placed 20 cm in front of a concave mirror of radius of curvature 30 cm. Find the image position, magnification, image size, and nature. Verify with the object position rule.",
      options: [],
      correctAnswer: "Given: h = 4 cm, u = −20 cm, R = 30 cm → f = R/2 = 15 cm → f = −15 cm\n\n(a) Image Position (Mirror Formula):\n1/v = 1/f − 1/u = 1/(−15) − 1/(−20) = −1/15 + 1/20 = (−4+3)/60 = −1/60\nv = −60 cm\n\n(b) Magnification:\nm = −v/u = −(−60)/(−20) = −60/20 = −3\n\n(c) Image Size:\nh' = m × h = −3 × 4 = −12 cm\nImage height = 12 cm (inverted, so below axis)\n\n(d) Nature of Image:\n• v = −60 cm (negative) → Real image (in front of mirror) ✓\n• m = −3 (negative) → Inverted ✓\n• |m| = 3 > 1 → Magnified (enlarged) ✓\n• Image is real, inverted, magnified, 12 cm tall\n\nVerification using object position rule:\nf = 15 cm. Object at u = −20 cm is between F and C (since F = 15 cm, C = 30 cm, and 15 < 20 < 30).\nRule: Object between F and C → Image is beyond C, real, inverted, magnified. ✓\nOur answer: v = −60 cm > −30 cm (beyond C). Consistent!",
      explanation: "This complete worked example shows every step systematically. The object-position verification cross-check is essential exam technique — it catches calculation errors and shows understanding.",
      points: 20
    },
    {
      id: "q9-45",
      type: "long",
      question: "A person cannot see objects beyond 2 m (myopia). What type of lens and power of spectacle lens corrects this? Also calculate the focal length. If after wearing specs the person can see the eye chart (6 m away) clearly, verify your answer.",
      options: [],
      correctAnswer: "Diagnosis: Myopia (Short-sightedness). Far point = 2 m.\n\nCorrection Needed:\nThe corrective lens must form a virtual image of a distant object (at infinity) at the person's far point (2 m).\n\nSo: u = −∞, v = −2 m (virtual image at far point, same side as object)\n\nUsing Lens Formula:\n1/f = 1/v − 1/u = 1/(−2) − 1/(−∞) = −1/2 − 0 = −1/2\nf = −2 m = −200 cm\n\nType of Lens: Concave (diverging) — negative focal length ✓\n\nPower of Lens:\nP = 1/f = 1/(−2) = −0.5 D\n\nThe person needs −0.5 D concave lens.\n\nVerification for 6 m object:\nu = −6 m, f = −2 m\n1/v = 1/f + 1/u = 1/(−2) + 1/(−6) = −3/6 − 1/6 = −4/6 = −2/3\nv = −3/2 = −1.5 m\n\nVirtual image at 1.5 m — within the person's range (< 2 m). Person can see the 6 m chart through the lens. ✓\n\nNote: This confirms the lens prescription works not just for infinity but for all far objects.",
      explanation: "This is the classic myopia correction problem combining eye defects with lens formula. The key insight is that the corrective lens must bring the image to the person's far point, not make it appear at 6 m.",
      points: 20
    },

    /* ───────────── Additional HOTS (5 Questions — total 10 HOTS) ───────────── */
    {
      id: "q9-46",
      type: "thinking",
      question: "When you look at a road on a hot summer day, you see what appears to be water puddles that disappear as you approach. Explain this mirage phenomenon using total internal reflection concepts and the mathematical conditions needed.",
      options: [],
      correctAnswer: "Mirage Formation (Hot Road Mirage):\n\nOn a hot day, air near the road surface is very hot and less dense (lower refractive index). As altitude increases, air cools and refractive index gradually increases.\n\nLight from the sky travels downward through layers of air with gradually decreasing refractive index. At each interface, the angle of incidence increases. Eventually it reaches the critical angle → total internal reflection occurs.\n\nThe reflected sky light travels upward and reaches our eyes. Our brain interprets it as light coming from the ground — appearing as water (sky reflection on water looks identical).\n\nMathematical Condition:\nFor TIR: sin(i) ≥ sin(C) where sin(C) = n₂/n₁\nFor air layers: n₁ (hot air, near road) < n₂ (cool air, above)\nThis is unusual — normally TIR requires going from denser to rarer medium.\n\nIn mirages, the continuous gradation of refractive index creates a 'curved' light path. The condition is approximately: when the angle of incidence with the (curved) wavefront exceeds the critical angle for the air-layer gradient.\n\nWhy puddles disappear: As you approach, the angle geometry changes and TIR no longer occurs from your new viewing angle — the mirage dissolves.\n\nDesert mirage works identically — oasis appearances are sky reflections, not actual water.",
      explanation: "Mirages are TIR in a medium with a gradient (continuously varying) refractive index rather than a sharp interface. This is an advanced application covered in higher studies, but the qualitative explanation tests HOTS at Class 10 level.",
      points: 25
    },
    {
      id: "q9-47",
      type: "thinking",
      question: "A goldfish is swimming 15 cm below the surface of water (n = 4/3). A person looking from above sees the fish at an apparent depth of 11.25 cm. If the person is 30 cm above the water surface, what is the total apparent distance from the person's eye to the fish? Compare with the actual total distance.",
      options: [],
      correctAnswer: "Actual total distance (eye to fish):\n= height of person above water + real depth of fish\n= 30 + 15 = 45 cm\n\nApparent depth of fish (from water surface):\nApparent depth = Real depth / n = 15 / (4/3) = 15 × 3/4 = 11.25 cm ✓ (confirmed)\n\nApparent total distance (eye to fish):\n= height of person above water + apparent depth of fish\n= 30 + 11.25 = 41.25 cm\n\nComparison:\n• Actual distance: 45 cm\n• Apparent distance: 41.25 cm\n• The fish appears 3.75 cm closer than it actually is\n• The illusion reduces distance by: (45 − 41.25)/45 × 100 = 8.33%\n\nPractical Implication for Fishing:\nA person trying to spear a fish must aim BELOW where the fish appears to be. The fish appears higher (closer to surface) due to refraction. This explains why fishing with a spear is much harder than it appears — the target is not where it seems!\n\nNote: The refraction only affects the path through water (15 cm). The path through air (30 cm) is unchanged because there's no bending in a uniform medium.",
      explanation: "This multi-step problem combines apparent depth with real-world distance measurement. The fishing analogy beautifully illustrates why hunters need to compensate for refraction when spear fishing.",
      points: 25
    },
    {
      id: "q9-48",
      type: "thinking",
      question: "A concave mirror and a convex lens both have focal length 20 cm. If both are used to view the same distant object (very far away), compare the image sizes, positions, and natures. Under what conditions can the two devices produce identical results?",
      options: [],
      correctAnswer: "For a very distant object (u → ∞):\n\nCONCAVE MIRROR (f = −20 cm):\n1/v = 1/f − 1/u = 1/(−20) − 0 = −1/20 → v = −20 cm\nImage at focal point, in front of mirror.\nNature: Real, inverted, highly diminished (point image for point object)\nm = −v/u = −(−20)/(−∞) → m → 0 (very small)\n\nCONVEX LENS (f = +20 cm):\n1/v = 1/f + 1/u = 1/20 + 0 = 1/20 → v = +20 cm\nImage at focal point, on opposite side of lens.\nNature: Real, inverted, highly diminished (point image for point object)\nm = v/u = 20/(−∞) → m → 0 (very small)\n\nComparison:\n| Feature | Concave Mirror | Convex Lens |\n|---------|---------------|-------------|\n| Image position | 20 cm in front | 20 cm behind |\n| Image nature | Real, inverted | Real, inverted |\n| Image size | Point (m → 0) | Point (m → 0) |\n| Side of device | Same side as object | Opposite side |\n\nCondition for Identical Results:\nFor a nearby object at distance u, both give identical image CHARACTERISTICS (real, inverted) but at different positions. They give numerically identical |m| when:\n|−v_mirror/u| = |v_lens/u|\nThis happens when v_mirror = v_lens, which requires the same u and same |f|.\n\nIn photography, a concave mirror (used in reflecting telescopes) and a convex lens (in refracting telescopes) achieve the same goal by different optical paths.",
      explanation: "This comparison problem reveals the deep symmetry between concave mirrors and convex lenses — both converging devices with similar image-forming capabilities but different physical mechanisms.",
      points: 25
    },
    {
      id: "q9-49",
      type: "thinking",
      question: "Why does the power of a lens system increase when lenses are in contact versus separated? If a +5 D and +3 D lens are first placed in contact and then separated by 10 cm, calculate and compare the effective power in each case. (Use: P = P₁ + P₂ − d·P₁·P₂ for separated lenses)",
      options: [],
      correctAnswer: "CASE 1: Lenses in Contact (d = 0):\nP = P₁ + P₂ = 5 + 3 = +8 D\nf = 1/8 = 0.125 m = 12.5 cm\n\nCASE 2: Lenses Separated by d = 10 cm = 0.1 m:\nP = P₁ + P₂ − d·P₁·P₂\n= 5 + 3 − (0.1)(5)(3)\n= 8 − 1.5 = +6.5 D\nf = 1/6.5 = 0.1538 m = 15.38 cm\n\nComparison:\n• In contact: P = +8 D, f = 12.5 cm\n• Separated (10 cm): P = +6.5 D, f = 15.38 cm\n• Power DECREASED by 1.5 D when separated\n• Focal length INCREASED by 2.88 cm when separated\n\nPhysical Explanation:\nWhen lenses are in contact, light bends at both surfaces immediately. When separated, light has already started to converge (from lens 1) before hitting lens 2. The effective bending point shifts, reducing the net convergence.\n\nOptical Instrument Design:\n• Eyepieces use separated lenses to REDUCE spherical aberration while REDUCING power\n• Telephoto lenses use this principle: +ve lens + −ve lens separated = longer effective focal length in a shorter tube\n• The d·P₁·P₂ correction term is always positive for same-sign lenses → always reduces power",
      explanation: "The separated lens formula is beyond CBSE syllabus but tests genuine optical reasoning. Understanding WHY separation reduces power builds intuition for optical instrument design.",
      points: 25
    },
    {
      id: "q9-50",
      type: "thinking",
      question: "A student claims: 'A plane mirror can be considered a special case of a spherical mirror with radius of curvature = ∞.' Using the mirror formula, verify this claim by showing what happens to image formation when R → ∞, and confirm that plane mirror behavior emerges as a mathematical limiting case.",
      options: [],
      correctAnswer: "Claim: Plane mirror = Spherical mirror with R → ∞ (f → ∞)\n\nMathematical Verification:\nAs R → ∞, f = R/2 → ∞, so 1/f → 0.\n\nMirror Formula: 1/v + 1/u = 1/f = 0\nTherefore: 1/v + 1/u = 0 → 1/v = −1/u → v = −u\n\nResult: v = −u\nIf u = −20 cm (object 20 cm in front), v = +20 cm.\nPositive v → image is 20 cm BEHIND the mirror. ✓\nThis is exactly how a plane mirror works!\n\nMagnification Check:\nm = −v/u = −(+20)/(−20) = +1\nPositive m → virtual, erect. |m| = 1 → same size. ✓\nThis matches: plane mirror gives virtual, erect, same-size image. ✓\n\nGeneral Proof:\nFor ANY object distance u with R → ∞:\nv = −u (image always at same distance behind mirror)\nm = −v/u = −(−u)/u = +1 (always same size, erect) ✓\n\nConclusion: The claim is mathematically proven. A plane mirror IS the limiting case of a spherical mirror as R → ∞. This is why we can use a single unified mirror formula for all types of mirrors — plane, concave, and convex — simply by substituting the appropriate value of f (or ∞ for plane).",
      explanation: "This HOTS question bridges geometry and algebra beautifully. Taking limits in physics formulas often reveals deep connections between apparently different phenomena — here unifying all mirrors under one formula.",
      points: 25
    }
  ],

};
