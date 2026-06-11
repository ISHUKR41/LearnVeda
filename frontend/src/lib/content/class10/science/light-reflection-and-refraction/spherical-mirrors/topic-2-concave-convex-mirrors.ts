/**
 * FILE: topic-2-concave-convex-mirrors.ts
 * LOCATION: src/lib/content/class10/science/light-reflection-and-refraction/spherical-mirrors/topic-2-concave-convex-mirrors.ts
 * PURPOSE: Detailed study of spherical mirrors (concave and convex).
 *          Covers terminology, ray diagrams, and image formation rules.
 * LAST UPDATED: 2026-06-08
 */

import { Topic } from "../../shared-types";

export const topic2SphericalMirrors: Topic = {
  id: "concave-convex-mirrors",
  title: "2. Spherical Mirrors: Concave and Convex",
  estimatedMinutes: 60,
  simulationIds: [
    /* ULTRA 2026: Drag object · 3 principal rays glow · mirror formula live */
    "ultra-concave-mirror-sim",  /* concave/convex toggle · image properties card · formula 1/v+1/u=1/f */
    /* NEW 2026: Real-world mirror applications gallery */
    "mirror-applications-sim",   /* 6 scenes: torch, furnace, makeup, rear-view, telescope, security */
    /* All-6-positions interactive object-image lab — NEW */
    "mirror-object-image-sim",
    "mirror-terms-diagram",
    "light-concave-rays",
    "light-convex-rays",
    "light-concave-positions",
    "light-mirror-uses",
    "light-mirror-ray-tracer",
    "adv-concave-mirror",
  ],
  imageUrl: "/images/light/light_spherical_mirrors_1781203071616.png",
  content: `
### What is a Spherical Mirror?

![Convex and Concave Mirrors](/images/light/light_convex_concave_1781203107265.png)

A spherical mirror is a mirror whose reflecting surface is a part of a hollow sphere of glass. 

Depending on which side of the spherical surface is silvered, there are two types of spherical mirrors:
1. **Concave Mirror:** A spherical mirror whose reflecting surface is curved inwards (faces towards the center of the sphere). It is also known as a **converging mirror** because it converges parallel rays of light.
2. **Convex Mirror:** A spherical mirror whose reflecting surface is curved outwards. It is also known as a **diverging mirror** because it diverges parallel rays of light.

---

### Key Terminology

![Spherical Mirrors Terminology](/images/light/light_spherical_mirrors_1781203071616.png)

To understand image formation, we must define the following terms related to spherical mirrors:

*   **Pole ($P$):** The geometric center of the reflecting surface of a spherical mirror. It lies on the surface of the mirror.
*   **Center of Curvature ($C$):** The center of the hollow glass sphere of which the mirror is a part. Note that $C$ is not a part of the mirror; it lies outside its reflecting surface. (In front of a concave mirror, behind a convex mirror).
*   **Radius of Curvature ($R$):** The radius of the hollow glass sphere of which the mirror is a part. It is the distance between the pole and the center of curvature ($PC = R$).
*   **Principal Axis:** The straight line passing through the pole ($P$) and the center of curvature ($C$) of the mirror.
*   **Principal Focus ($F$):**
    *   *For Concave Mirror:* The point on the principal axis where all rays parallel to the principal axis converge after reflection.
    *   *For Convex Mirror:* The point on the principal axis from which all rays parallel to the principal axis appear to diverge after reflection.
*   **Focal Length ($f$):** The distance between the pole ($P$) and the principal focus ($F$). ($PF = f$). 
    *   *Relation:* For spherical mirrors of small apertures, the radius of curvature is twice the focal length: **$R = 2f$**.
*   **Aperture:** The diameter of the reflecting surface of the spherical mirror.

---

### Rules for Drawing Ray Diagrams

To construct ray diagrams to find the position, size, and nature of images, we use any two of the following standard incident rays:

1.  **Ray parallel to the principal axis:** After reflection, it passes through the principal focus $F$ (concave mirror) or appears to diverge from $F$ (convex mirror).
2.  **Ray passing through the principal focus ($F$):** After reflection, it becomes parallel to the principal axis.
3.  **Ray passing through the center of curvature ($C$):** After reflection, it retraces its path. (Because a line from the center to the sphere is normal to the surface, meaning $\\angle i = 0^\\circ$ and $\\angle r = 0^\\circ$).
4.  **Ray incident obliquely to the principal axis at the pole ($P$):** It reflects obliquely, following the laws of reflection ($\\angle i = \\angle r$).

---

### Image Formation by a Concave Mirror

A concave mirror can form both real and virtual images, depending on the position of the object relative to the mirror.

| Position of Object | Position of Image | Size of Image | Nature of Image |
| :--- | :--- | :--- | :--- |
| **At Infinity** | At the Focus ($F$) | Highly diminished, point-sized | Real and inverted |
| **Beyond $C$** | Between $F$ and $C$ | Diminished | Real and inverted |
| **At $C$** | At $C$ | Same size | Real and inverted |
| **Between $C$ and $F$** | Beyond $C$ | Enlarged | Real and inverted |
| **At $F$** | At Infinity | Highly enlarged | Real and inverted |
| **Between $P$ and $F$** | Behind the mirror | Enlarged | **Virtual and erect** |

*Application:* Concave mirrors are used as shaving mirrors, dentist mirrors, and in the headlights of vehicles to get a powerful parallel beam of light (object placed at focus).

---

### Image Formation by a Convex Mirror

A convex mirror **always** forms a virtual, erect, and diminished image, regardless of the object's position in front of it.

| Position of Object | Position of Image | Size of Image | Nature of Image |
| :--- | :--- | :--- | :--- |
| **At Infinity** | At the Focus ($F$), behind mirror | Highly diminished, point-sized | Virtual and erect |
| **Between Infinity and Pole ($P$)** | Between $P$ and $F$, behind mirror | Diminished | Virtual and erect |

*Application:* Convex mirrors are widely used as rear-view mirrors in vehicles because they always give an erect image and have a wider field of view as they are curved outwards.

---
### Exam Summary

#### 📌 Key Terminology
*   **Pole ($P$):** Geometric center of the mirror's reflecting surface.
*   **Center of Curvature ($C$):** Center of the sphere the mirror is part of. Distance from $P$ = Radius of Curvature ($R$).
*   **Principal Focus ($F$):** Parallel rays converge here (concave) or appear to diverge from here (convex).
*   **Focal Length ($f$):** Distance from $P$ to $F$. Relation: $\\boxed{R = 2f}$
*   **Aperture:** Diameter of the reflecting surface.

#### 🪞 Concave vs. Convex — Key Differences (Classic exam table)
| Feature | Concave Mirror | Convex Mirror |
|---|---|---|
| Also called | Converging mirror | Diverging mirror |
| Focal length | Negative ($f < 0$) | Positive ($f > 0$) |
| Image type | Real/inverted (mostly) | Virtual, erect, **always** |
| Magnification | Can be >1, <1, or =1 | Always < 1 (diminished) |
| Uses | Torch, doctor's headlamp, shaving mirror | Rear-view mirror, street light reflector |

#### 📍 Image Formation by Concave Mirror (5-mark table — memorize positions)
| Object Position | Image Position | Nature | Size |
|---|---|---|---|
| At infinity ($\\infty$) | At $F$ | Real, Inverted | Point-sized |
| Beyond $C$ | Between $F$ and $C$ | Real, Inverted | Diminished |
| At $C$ | At $C$ | Real, Inverted | Same size |
| Between $C$ and $F$ | Beyond $C$ | Real, Inverted | Enlarged |
| At $F$ | At infinity | Real, Inverted | Highly enlarged |
| Between $F$ and $P$ | Behind mirror | **Virtual, Erect** | Enlarged |

> 🔑 **Memory Tip:** Convex mirror ALWAYS gives Virtual, Erect, Diminished (VED) images, regardless of object position.

#### ⚠️ Common Mistakes
*   Saying focus of a convex mirror is "real" — it is a **virtual focus** (rays only appear to diverge from it).
*   Confusing concave mirror (inward curve) with convex mirror (outward curve).
*   Forgetting that convex mirrors are used as rear-view mirrors because they have a **wider field of view**.

#### 🧪 Ray Diagram Rules (3 standard rays)
1. Ray parallel to principal axis → reflects through $F$ (concave) or appears to come from $F$ (convex).
2. Ray through $F$ → reflects parallel to principal axis.
3. Ray through $C$ → reflects back along the same path.

---

### 📝 Solved Numericals

**Example 1: Focal Length and Radius of Curvature**
**Question:** The radius of curvature of a spherical mirror is 20 cm. What is its focal length?
**Solution:**
1. Radius of curvature ($R$) = 20 cm.
2. The focal length ($f$) is half of the radius of curvature.
3. Formula: $f = R / 2$
4. $f = 20 / 2$ = 10 cm.
5. Therefore, the focal length is **10 cm**.

**Example 2: Image Formation by Concave Mirror**
**Question:** An object is placed at a distance of 10 cm from a concave mirror of focal length 15 cm. Find the position and nature of the image.
**Solution:**
1. Object distance ($u$) = -10 cm (using sign convention, object is always in front).
2. Focal length ($f$) = -15 cm (concave mirror focus is in front).
3. Using the mirror formula: $\frac{1}{f} = \frac{1}{v} + \frac{1}{u}$
4. $\frac{1}{v} = \frac{1}{f} - \frac{1}{u} = \frac{1}{-15} - \frac{1}{-10} = \frac{-2 + 3}{30} = \frac{1}{30}$
5. Image distance ($v$) = +30 cm.
6. Since $v$ is positive, the image is formed behind the mirror.
7. Nature: **Virtual, erect, and magnified**.

**Example 3: Magnification of a Convex Mirror**
**Question:** A convex mirror used for rear-view on an automobile has a radius of curvature of 3.00 m. If a bus is located at 5.00 m from this mirror, find the position, nature, and magnification of the image.
**Solution:**
1. Radius of curvature ($R$) = +3.00 m (convex mirror).
2. Focal length ($f$) = $R/2$ = +1.50 m.
3. Object distance ($u$) = -5.00 m.
4. $\frac{1}{v} = \frac{1}{f} - \frac{1}{u} = \frac{1}{1.50} - \frac{1}{-5.00} = \frac{1}{1.50} + \frac{1}{5.00} = \frac{5 + 1.5}{7.5} = \frac{6.5}{7.5}$
5. $v = \frac{7.5}{6.5}$ = +1.15 m.
6. Magnification ($m$) = $-\frac{v}{u} = -\frac{1.15}{-5.00}$ = +0.23.
7. The image is 1.15 m at the back of the mirror. Nature: **Virtual, erect, and diminished by a factor of 0.23**.

**Example 4: Real Image Magnification**
**Question:** A concave mirror produces three times magnified (enlarged) real image of an object placed at 10 cm in front of it. Where is the image located?
**Solution:**
1. Magnification ($m$) = -3 (real image is inverted).
2. Object distance ($u$) = -10 cm.
3. Formula: $m = -\frac{v}{u}$
4. $-3 = -\frac{v}{-10} \implies -3 = \frac{v}{10}$
5. $v = -30$ cm.
6. The image is located **30 cm in front of the mirror**.

---

### Real-life Applications & Engineering Context

#### 🚗 Convex Mirrors: Safety Through Wide Field of View

A convex mirror always gives a **virtual, erect, diminished** image regardless of object position. The key advantage: it covers a **much wider field of view** than a flat mirror of the same size. This is why:
*   **Rear-view side mirrors** on vehicles are convex — drivers can see a broader sweep of lanes and following traffic.
*   **Shop security mirrors** (the large convex mirrors at supermarket corners) allow one mirror to cover an entire aisle.
*   **ATM anti-theft mirrors** give tellers and users a wide view of the surroundings.

**Trade-off:** The diminished image makes objects appear farther away than they actually are. This is why many countries legally require the text **"Objects in mirror are closer than they appear"** on convex side mirrors.

#### 🔦 Concave Mirrors: Power of Convergence

The concave mirror's converging property creates two distinct modes of use:

| Mode | Object Position | Image | Use Case |
|---|---|---|---|
| Parallel beam (torch) | Object at $F$ | Image at $\\infty$ | Headlights, searchlights |
| Magnifier | Object between $P$ and $F$ | Virtual, magnified | Shaving/makeup mirrors, dentist's mirror |
| Same-size copy | Object at $C = 2f$ | Real, same-size at $C$ | Optical copying systems |

*   **Solar Energy Collectors:** Large concave parabolic dishes focus sunlight to a boiler at the focal point. Concentrated Solar Power (CSP) plants use fields of curved mirrors (heliostats) to generate electricity from solar heat.
*   **Ophthalmoscope:** A concave mirror with a small central hole lets doctors shine focused light into the eye while observing the reflected image of the retina through the hole.
*   **Reflecting Telescopes (Newton/Cassegrain):** Concave primary mirrors can be made far larger and lighter than equivalent lenses, with no chromatic aberration. The 30-metre Telescope (TMT) under construction will use a 30 m diameter concave segmented mirror.

#### 📐 Spherical vs. Parabolic Mirrors: Spherical Aberration

The mirror formula $\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}$ applies only for **paraxial rays** (rays making very small angles with the principal axis, close to the pole). For large-aperture spherical mirrors, **marginal rays** (rays that strike far from the pole) focus at a slightly different point than paraxial rays — this blurring is called **spherical aberration**.

**Solution:** Use a **parabolic mirror** instead. A paraboloid focuses ALL parallel rays at exactly one point, regardless of where they hit the mirror. This is why:
*   Car headlight reflectors are parabolic.
*   Satellite dish antennas are parabolic.
*   Astronomical telescope primary mirrors are parabolic.
*   The Hubble Space Telescope's primary mirror was famously ground to the wrong parabolic shape (by 1.3 µm), causing serious spherical aberration — corrected by installing corrective optics (COSTAR) in 1993.
`,
  questions: [
    // --- MCQ ---
    {
      id: "t2q1",
      type: "mcq",
      question: "Which type of mirror is used by a dentist to see an enlarged image of a tooth?",
      options: [
        "Plane mirror",
        "Convex mirror",
        "Concave mirror",
        "Cylindrical mirror"
      ],
      correctAnswer: "Concave mirror",
      explanation: "A concave mirror forms an enlarged, virtual, and erect image when an object (the tooth) is placed close to it (between the pole and the focus).",
      points: 10
    },
    {
      id: "t2q2",
      type: "mcq",
      question: "The radius of curvature of a spherical mirror is 20 cm. What is its focal length?",
      options: [
        "20 cm",
        "40 cm",
        "10 cm",
        "5 cm"
      ],
      correctAnswer: "10 cm",
      explanation: "The focal length is half of the radius of curvature. $f = R/2 = 20/2 = 10 \\text{ cm}$.",
      points: 10
    },
    {
      id: "t2q3",
      type: "mcq",
      question: "For a concave mirror, if an object is placed exactly at the center of curvature ($C$), where is the image formed?",
      options: [
        "At the focus ($F$)",
        "Beyond $C$",
        "At $C$",
        "Between $F$ and $C$"
      ],
      correctAnswer: "At $C$",
      explanation: "When an object is placed at the center of curvature of a concave mirror, a real, inverted image of the same size is formed exactly at $C$.",
      points: 10
    },
    {
      id: "t2q4",
      type: "mcq",
      question: "A full-length image of a distant tall building can definitely be seen by using:",
      options: [
        "a concave mirror",
        "a convex mirror",
        "a plane mirror",
        "both concave and plane mirrors"
      ],
      correctAnswer: "a convex mirror",
      explanation: "A convex mirror always forms a diminished, virtual, and erect image. Because the image is highly diminished, it offers a wide field of view, allowing you to see the entire tall building.",
      points: 10
    },
    {
      id: "t2q5",
      type: "mcq",
      question: "A light ray passing through the center of curvature of a concave mirror falls on the mirror. What is its angle of incidence?",
      options: [
        "$90^\\circ$",
        "$0^\\circ$",
        "$180^\\circ$",
        "$45^\\circ$"
      ],
      correctAnswer: "$0^\\circ$",
      explanation: "Any line passing through the center of curvature of a sphere acts as a normal to the surface of the sphere at the point of intersection. Since the ray travels along the normal, the angle between the ray and the normal is zero.",
      points: 10
    },

    // --- Short Answer ---
    {
      id: "t2q6",
      type: "short",
      question: "Why is a convex mirror preferred as a rear-view mirror in vehicles?",
      correctAnswer: "Convex mirrors are preferred because they always form an erect (upright) image, and since the image is diminished, they provide a much wider field of view compared to plane mirrors, allowing the driver to see a larger area of the traffic behind.",
      explanation: "This is a classic reasoning question combining the nature of the image (erect) with its size (diminished) yielding a specific advantage (wide field of view).",
      points: 15
    },
    {
      id: "t2q7",
      type: "short",
      question: "Define the principal focus of a concave mirror.",
      correctAnswer: "The principal focus of a concave mirror is a point on its principal axis to which all the light rays which are parallel and close to the principal axis converge after reflection from the mirror.",
      explanation: "The focus is the point of convergence for a concave mirror, hence it is called a converging mirror.",
      points: 15
    },
    {
      id: "t2q8",
      type: "short",
      question: "If an object is placed between the pole ($P$) and the focus ($F$) of a concave mirror, what is the nature of the image formed?",
      correctAnswer: "The image formed is virtual, erect, and enlarged (magnified).",
      explanation: "This is the only case where a concave mirror forms a virtual image. It is the principle used in shaving or makeup mirrors.",
      points: 15
    },
    {
      id: "t2q9",
      type: "short",
      question: "What happens to a ray of light that is directed towards the principal focus of a convex mirror after reflection?",
      correctAnswer: "After reflection, the ray of light will emerge parallel to the principal axis.",
      explanation: "This is one of the standard rules for drawing ray diagrams, representing the principle of reversibility of light.",
      points: 15
    },
    {
      id: "t2q10",
      type: "short",
      question: "What is meant by the 'aperture' of a spherical mirror?",
      correctAnswer: "The aperture of a spherical mirror is the diameter of its circular outline or reflecting surface.",
      explanation: "It essentially defines the size of the mirror and how much light it can collect.",
      points: 15
    },

    // --- Long Answer ---
    {
      id: "t2q11",
      type: "long",
      question: "Explain with the help of ray diagrams, the position, size, and nature of the image formed by a concave mirror when the object is placed (a) Beyond C (b) Between C and F.",
      correctAnswer: "(a) Object Beyond C: The image is formed between F and C. It is real, inverted, and diminished (smaller than the object).\n(b) Object Between C and F: The image is formed beyond C. It is real, inverted, and enlarged (larger than the object).",
      explanation: "When answering this in an exam, the student must draw the ray diagrams. The text describes the expected results of the standard geometric construction.",
      points: 20
    },
    {
      id: "t2q12",
      type: "long",
      question: "A concave mirror produces a three times magnified real image of an object placed at 10 cm in front of it. Where is the image located?",
      correctAnswer: "Since the image is real, magnification ($m$) is negative. $m = -3$.\nObject distance, $u = -10 \\text{ cm}$.\nWe know $m = -v/u$.\nTherefore, $-3 = -v / (-10)$.\n$-3 = v / 10$.\n$v = -30 \\text{ cm}$.\nThe image is located 30 cm in front of the mirror.",
      explanation: "Real images are inverted, thus magnification is negative. Using the magnification formula for mirrors gives the image distance.",
      points: 20
    },
    {
      id: "t2q13",
      type: "long",
      question: "State three uses of a concave mirror and explain the underlying principle for each use.",
      correctAnswer: "1. Headlights/Searchlights: The bulb is placed at the focus to produce a powerful parallel beam of light.\n2. Shaving/Dentist Mirrors: When placed close to the face/teeth (between P and F), it produces a virtual, erect, and magnified image.\n3. Solar Furnaces: Large concave mirrors are used to converge sunlight at the focus to produce intense heat.",
      explanation: "Concave mirrors are useful because of their converging property and their ability to form magnified virtual images.",
      points: 20
    },
    {
      id: "t2q14",
      type: "long",
      question: "Why does a concave mirror form a real image while a convex mirror always forms a virtual image? Explain geometrically.",
      correctAnswer: "A concave mirror converges light rays. If the object is placed beyond the focal point, the reflected rays actually intersect in front of the mirror, forming a real image that can be captured on a screen.\nA convex mirror diverges light rays. The reflected rays spread outwards and never intersect in reality. However, if extended backwards, they appear to intersect at a point behind the mirror, forming a virtual image. Since they never actually meet, the image can never be real.",
      explanation: "Real images require actual intersection of light rays, which only a converging mirror can achieve (for real objects).",
      points: 20
    },
    {
      id: "t2q15",
      type: "long",
      question: "Describe the image formation by a convex mirror when the object is at infinity. Where is the focus of a convex mirror located?",
      correctAnswer: "When an object is at infinity, the incident rays are parallel to the principal axis. After reflection from the convex mirror, these rays diverge. When extended backwards, they appear to meet at a point behind the mirror, which is the Principal Focus (F).\nThe image is formed at the focus (F) behind the mirror. It is virtual, erect, and highly diminished (point-sized).\nThe focus of a convex mirror is located behind the reflecting surface.",
      explanation: "This describes the fundamental converging/diverging behavior that defines the principal focus of the mirrors.",
      points: 20
    },

    // --- HOTS ---
    {
      id: "t2q16",
      type: "thinking",
      question: "You are given three mirrors: plane, concave, and convex. How can you identify them without touching their surfaces?",
      correctAnswer: "You can identify them by looking at your image in each mirror from a close distance and then slowly moving away:\n1. If the image is erect and of the same size, and remains so as you move away, it is a Plane Mirror.\n2. If the image is erect and magnified when close, but becomes inverted as you move further away, it is a Concave Mirror.\n3. If the image is erect and diminished, and remains erect and diminished as you move away, it is a Convex Mirror.",
      explanation: "Identifying mirrors requires knowing how magnification and orientation change with object distance.",
      points: 25
    },
    {
      id: "t2q17",
      type: "thinking",
      question: "An object is placed at a distance of 12 cm in front of a concave mirror. It forms a real image four times larger than the object. Calculate the distance of the image from the mirror and the radius of curvature.",
      correctAnswer: "Since the image is real, $m = -4$. Object distance $u = -12 \\text{ cm}$.\n$m = -v/u \\implies -4 = -v / (-12) \\implies v = -48 \\text{ cm}$.\nSo, image is 48 cm in front of the mirror.\nUsing mirror formula: $1/f = 1/v + 1/u = -1/48 - 1/12 = -1/48 - 4/48 = -5/48$.\n$f = -48/5 = -9.6 \\text{ cm}$.\nRadius of curvature $R = 2f = 2 \\times (-9.6) = -19.2 \\text{ cm}$.",
      explanation: "This problem combines magnification, the mirror formula, and the relation between focal length and radius of curvature, applying sign conventions throughout.",
      points: 25
    },
    {
      id: "t2q18",
      type: "thinking",
      question: "Imagine a concave mirror made of a material that is slightly transparent. How would this affect the image formed, and why?",
      correctAnswer: "If the mirror is slightly transparent, some light will be transmitted through the mirror rather than reflected. \nThis means less light energy is contributing to the formation of the reflected image. As a result, the real or virtual image formed by the mirror will be less bright (dimmer) than it would be with a fully opaque, perfectly reflecting mirror. The position and size of the image would not change, only its intensity.",
      explanation: "Image characteristics (position, size) are governed by geometry. Image brightness is governed by the conservation of energy and the reflectivity coefficient of the surface.",
      points: 25
    },
    {
      id: "t2q19",
      type: "thinking",
      question: "A student looks into a spherical mirror and sees their image is erect but smaller in size. They move closer to the mirror, and the image remains erect but gets slightly larger (though still smaller than the student). What type of mirror is it, and what happens to the image if they move to infinity?",
      correctAnswer: "It is a Convex Mirror. \nA convex mirror always forms a virtual, erect, and diminished image. \nIf the student moves to infinity, the image will continue to shrink until it becomes a highly diminished, point-sized image located exactly at the Principal Focus (F) behind the mirror.",
      explanation: "Only a convex mirror satisfies the condition of always having a diminished, erect image. As $u \\to \\infty$, $v \\to f$.",
      points: 25
    },
    {
      id: "t2q20",
      type: "thinking",
      question: "Suppose you cover the lower half of a concave mirror with an opaque black paper. How will the image of an object placed in front of the mirror be affected?",
      correctAnswer: "The full image of the object will still be formed. \nEvery small part of the mirror's surface can form a complete image by reflecting rays from all parts of the object. \nHowever, since half the reflecting surface is blocked, only half the amount of light reaches the image point. Therefore, the image will be complete but its brightness will be reduced to half.",
      explanation: "A common misconception is that half the mirror means half the image. However, rays from the top and bottom of the object strike all unblocked parts of the mirror.",
      points: 25
    },

    // ═══════════════════════════════════════════════════
    // ADDITIONAL QUESTIONS — Set 2 (t2q21 to t2q35)
    // ═══════════════════════════════════════════════════

    // --- MCQ Set 2 ---
    {
      id: "t2q21",
      type: "mcq",
      question: "Which mirror is used by dentists to get a magnified view of the patient's teeth?",
      options: [
        "Plane mirror",
        "Concave mirror",
        "Convex mirror",
        "Both concave and convex"
      ],
      correctAnswer: "Concave mirror",
      explanation: "When the object (teeth) is placed between the pole and focus of a concave mirror, it gives a virtual, erect, and MAGNIFIED image. This is why dentists use small concave mirrors on handles.",
      points: 10
    },
    {
      id: "t2q22",
      type: "mcq",
      question: "An object is placed between the pole (P) and focus (F) of a concave mirror. The image formed will be:",
      options: [
        "Real, inverted, magnified",
        "Real, inverted, diminished",
        "Virtual, erect, magnified",
        "Virtual, inverted, magnified"
      ],
      correctAnswer: "Virtual, erect, magnified",
      explanation: "When the object is between P and F of a concave mirror, the reflected rays diverge and appear to come from a point behind the mirror. The image is virtual (cannot be formed on screen), erect (same orientation as object), and magnified.",
      points: 10
    },
    {
      id: "t2q23",
      type: "mcq",
      question: "A concave mirror has a radius of curvature of 40 cm. What is its focal length?",
      options: [
        "80 cm",
        "40 cm",
        "20 cm",
        "10 cm"
      ],
      correctAnswer: "20 cm",
      explanation: "The relationship between radius of curvature and focal length is $f = R/2$. Therefore, $f = 40/2 = 20$ cm. For a concave mirror, using sign convention: $f = -20$ cm.",
      points: 10
    },
    {
      id: "t2q24",
      type: "mcq",
      question: "Which mirror always produces a virtual, erect, and diminished image irrespective of object position?",
      options: [
        "Plane mirror",
        "Concave mirror",
        "Convex mirror",
        "None of the above"
      ],
      correctAnswer: "Convex mirror",
      explanation: "A convex mirror is a diverging mirror. Because its focus and center of curvature are behind the reflecting surface, it can NEVER form a real image. Regardless of object position, it always forms a virtual, erect, and diminished image — hence its use as a rear-view mirror.",
      points: 10
    },
    {
      id: "t2q25",
      type: "mcq",
      question: "For a concave mirror of focal length $f$, at what object distance does the image have the same size as the object?",
      options: [
        "At $f$",
        "At $2f$",
        "Between $f$ and $2f$",
        "At infinity"
      ],
      correctAnswer: "At $2f$",
      explanation: "When the object is at $C$ (center of curvature, distance $= 2f$ from the mirror), the image is also formed at $C$. The image is real, inverted, and of the SAME size as the object (magnification $= -1$).",
      points: 10
    },

    // --- Short Answer Set 2 ---
    {
      id: "t2q26",
      type: "short",
      question: "State two practical uses of a concave mirror. Explain the reason for each use based on image properties.",
      correctAnswer: "1. In torches and headlights: When a lamp is placed at the focus of a concave mirror, it reflects light as a powerful, parallel beam (rays from focus become parallel after reflection). This provides a concentrated, far-reaching beam of light.\n2. As a shaving/makeup mirror: When the face is placed between P and F, the concave mirror forms a virtual, erect, and magnified image of the face, making it easier to see details.",
      explanation: "Always justify mirror uses by linking to the specific image property that makes it useful.",
      points: 15
    },
    {
      id: "t2q27",
      type: "short",
      question: "Define 'principal axis', 'center of curvature', and 'radius of curvature' of a spherical mirror.",
      correctAnswer: "Principal Axis: The imaginary straight line passing through the pole (P) and the center of curvature (C) of the spherical mirror.\nCenter of Curvature (C): The center of the hollow sphere of which the spherical mirror is a part. It lies at a distance R from the mirror's pole.\nRadius of Curvature (R): The radius of the hollow sphere of which the mirror is a part. It equals the distance between the pole and the center of curvature.",
      explanation: "These are foundational definitions. Remember: C is always in front of a concave mirror and behind a convex mirror.",
      points: 15
    },
    {
      id: "t2q28",
      type: "short",
      question: "An object is placed at infinity in front of a concave mirror of focal length 15 cm. Where is the image formed and what are its characteristics?",
      correctAnswer: "When the object is at infinity, the incident rays are parallel to the principal axis. After reflection, they converge at the principal focus (F). Image is formed at F, i.e., 15 cm in front of the mirror. The image is real, inverted, and highly diminished (point-sized).",
      explanation: "Object at infinity → Image at F. Object at F → Image at infinity. These are mirror pairs you must know.",
      points: 15
    },
    {
      id: "t2q29",
      type: "short",
      question: "Why is a convex mirror preferred over a plane mirror as a rear-view mirror in automobiles?",
      correctAnswer: "A convex mirror is preferred because:\n1. It always forms a virtual, erect image — the driver always sees objects upright.\n2. It has a much wider field of view than a plane mirror of the same size because it is a diverging mirror.\n3. The diminished image allows the driver to see a larger area behind the vehicle.\nA plane mirror would only show a narrow field directly behind, making it less safe.",
      explanation: "The convex mirror sacrifices image size but gains a wide-angle view — safety over magnification.",
      points: 15
    },
    {
      id: "t2q30",
      type: "short",
      question: "A concave mirror produces an inverted image of the same size as the object. If the object is 20 cm from the mirror, find the focal length and radius of curvature.",
      correctAnswer: "An inverted, same-sized image means the object is at the center of curvature (C). So $u = R = 20$ cm. Therefore, $R = 20$ cm, and focal length $f = R/2 = 10$ cm.",
      explanation: "Magnification $m = -1$ → object at $C = 2f$. So $2f = 20$, giving $f = 10$ cm.",
      points: 15
    },

    // --- Long Answer Set 2 ---
    {
      id: "t2q31",
      type: "long",
      question: "Draw a ray diagram showing image formation when an object is placed between the focus (F) and center of curvature (C) of a concave mirror. State the position, nature, and size of the image.",
      correctAnswer: "Ray Diagram Description (object between F and C):\n1. Ray 1: Parallel to principal axis → reflects through focus F.\n2. Ray 2: Passing through focus F → reflects parallel to principal axis.\n3. These two reflected rays diverge slightly but their extensions backwards meet the x-axis. Wait — actually both rays converge. They are NOT diverging in this case.\nCorrect analysis: Both reflected rays actually intersect BEYOND C (i.e., at a distance > 2f from the mirror).\n\nImage Properties (object between F and C):\n• Position: Beyond center of curvature C (i.e., beyond 2f)\n• Nature: Real and Inverted\n• Size: Magnified (larger than the object)\n\nThis is used in projectors where a magnified real image is needed.",
      explanation: "The image moves to beyond C when the object is between F and C — one of the trickier positions to memorize.",
      points: 20
    },
    {
      id: "t2q32",
      type: "long",
      question: "An object of height 6 cm is placed 20 cm in front of a concave mirror of focal length 12 cm. Find: (a) Position of image using mirror formula. (b) Height of image using magnification. (c) State the nature of the image.",
      correctAnswer: "Given: $h_o = 6$ cm, $u = -20$ cm, $f = -12$ cm.\n\n(a) Mirror formula: $1/f = 1/v + 1/u$\n$1/(-12) = 1/v + 1/(-20)$\n$1/v = -1/12 + 1/20 = -5/60 + 3/60 = -2/60 = -1/30$\n$v = -30$ cm.\nThe image is 30 cm in front of the mirror.\n\n(b) Magnification: $m = -v/u = -(-30)/(-20) = -30/20 = -1.5$\n$h_i = m \\times h_o = -1.5 \\times 6 = -9$ cm.\nThe image is 9 cm tall. The negative sign confirms it is inverted.\n\n(c) Nature: Real (v is negative, so image is in front of the mirror), Inverted (magnification is negative), Magnified (|m| > 1).",
      explanation: "A complete numerical answer requires: mirror formula for v, magnification formula for size, and interpreting signs for nature.",
      points: 20
    },
    {
      id: "t2q33",
      type: "long",
      question: "Explain with ray diagram the use of concave mirrors as solar concentrators for heating purposes. What image-forming property makes them suitable?",
      correctAnswer: "Solar Concentrator (Concave Mirror):\n\nPrinciple: Sunlight comes from a very large distance (effectively infinity). When parallel rays from the sun fall on a large concave mirror, they all converge at the principal focus (F) after reflection.\n\nRay Diagram Description:\nParallel rays (from sun) → strike concave mirror surface → all reflect and converge at focus F → enormous heat is generated at F.\n\nProperty That Makes It Suitable:\n1. Object at infinity (sun) → image at F (real, point-sized).\n2. All the light energy from the large mirror surface is concentrated to one tiny focal point.\n3. This massively concentrates solar energy, generating temperatures over $1000^\\circ$C at the focus.\n\nApplications: Solar cookers use small concave mirrors to cook food. Large parabolic concave mirrors in solar power plants concentrate sunlight to generate steam and drive turbines.",
      explanation: "Connecting the 'object at infinity → image at F' rule to real-world solar energy is a frequently asked application question.",
      points: 20
    },

    // --- HOTS Set 2 ---
    {
      id: "t2q34",
      type: "thinking",
      question: "A concave mirror of focal length 10 cm forms a real image twice the size of the object. (a) Find the object distance. (b) If the object is moved 5 cm further away from this position, qualitatively describe what happens to the image — does it become larger or smaller, move closer or farther?",
      correctAnswer: "(a) Real image twice as large: $m = -2$ (real = negative magnification).\n$m = -v/u \\implies -2 = -v/u \\implies v = 2u$.\nMirror formula: $1/f = 1/v + 1/u \\implies 1/(-10) = 1/(2u) + 1/u = 3/(2u)$\n$2u = -30 \\implies u = -15$ cm.\nObject is 15 cm in front of the mirror.\n\n(b) Currently, object is between F and C (at 15 cm, with f = 10 cm and C = 20 cm). Moving 5 cm further places the object at 20 cm = exactly at C.\nAt C: Image forms at C itself — same size ($m = -1$). So the image becomes SMALLER (from 2× to 1× size) and MOVES CLOSER (from 30 cm to 20 cm).",
      explanation: "As object moves away from F towards C, real image shrinks and moves closer to mirror — the relationship is inversely tied through the mirror formula.",
      points: 25
    },
    {
      id: "t2q35",
      type: "thinking",
      question: "In SONAR systems and some satellite dishes, parabolic (rather than spherical) mirrors are used instead of spherical mirrors. Explain qualitatively why a parabolic mirror is more ideal for focusing parallel rays than a spherical mirror.",
      correctAnswer: "Spherical Mirror Limitation (Spherical Aberration):\nFor a spherical mirror, rays parallel to the principal axis but far from it (marginal rays) do not converge to exactly the same focus as paraxial rays (close to the axis). This means a spherical mirror has a blurred focus — it doesn't form a perfect point image from parallel rays.\n\nParabolic Mirror Advantage:\nA paraboloid has the unique geometric property that ALL rays parallel to its axis — regardless of their distance from the axis — converge to one perfectly sharp focal point. This eliminates spherical aberration entirely.\n\nPractical Implication:\nFor large mirrors (like satellite dishes or radio telescopes), a spherical mirror wastes energy because not all radiation is focused precisely. A parabolic mirror concentrates ALL incoming energy to a single receiver. That's why all large reflector telescopes, satellite dishes, and flashlight reflectors are parabolic, not spherical.",
      explanation: "Spherical aberration is the key concept here. Parabolic mirrors eliminate it by exact geometry, but their manufacturing is more expensive.",
      points: 25
    },

    /* ── Additional Questions Set 3 (t2q36 to t2q50) ── */

    /* MCQ Set 3 */
    {
      id: "t2q36",
      type: "mcq",
      question: "An object is placed at the center of curvature C of a concave mirror. The image formed is:",
      options: [
        "At F, real, inverted, diminished",
        "At C, real, inverted, same size",
        "Behind the mirror, virtual, erect, enlarged",
        "At infinity, real, inverted, magnified"
      ],
      correctAnswer: "At C, real, inverted, same size",
      explanation: "When object is at C (= 2f), using mirror formula: 1/v = 1/f − 1/u = 1/(−f) − 1/(−2f) = −1/f + 1/2f = −1/2f, so v = −2f = −C. Image forms at C: real, inverted, same size (m = −v/u = −(−2f)/(−2f) = −1).",
      points: 10
    },
    {
      id: "t2q37",
      type: "mcq",
      question: "For which type of mirror is the focal length always positive according to the New Cartesian Sign Convention?",
      options: [
        "Concave mirror",
        "Convex mirror",
        "Plane mirror",
        "Both concave and convex"
      ],
      correctAnswer: "Convex mirror",
      explanation: "A convex mirror's focus lies behind the mirror (on the right side, in the direction of incident light). Distances in the direction of incident light are positive. So the focal length of a convex mirror is always positive. Concave mirror's focus is in front (negative direction), making its focal length negative.",
      points: 10
    },
    {
      id: "t2q38",
      type: "mcq",
      question: "Large concave mirrors are used in solar furnaces because:",
      options: [
        "They produce a virtual image at the focus",
        "Parallel rays from the sun converge to a point (focus), generating intense heat",
        "They reflect all colors equally",
        "They have a wide field of view"
      ],
      correctAnswer: "Parallel rays from the sun converge to a point (focus), generating intense heat",
      explanation: "Sunlight comes from effectively infinity. A concave mirror focuses all parallel rays to one point — the principal focus. This concentration of solar energy at one tiny point creates extremely high temperatures (>1000°C), which can melt metals and generate steam for power generation.",
      points: 10
    },
    {
      id: "t2q39",
      type: "mcq",
      question: "A mirror has a focal length of −20 cm. What type of mirror is it and what is its radius of curvature?",
      options: [
        "Convex mirror, R = 40 cm",
        "Concave mirror, R = 40 cm",
        "Concave mirror, R = 20 cm",
        "Plane mirror, R = ∞"
      ],
      correctAnswer: "Concave mirror, R = 40 cm",
      explanation: "Negative focal length → concave mirror (focus is in front). |f| = 20 cm. R = 2|f| = 2 × 20 = 40 cm. The negative sign of f tells us it is concave; the magnitude gives us the actual distance.",
      points: 10
    },
    {
      id: "t2q40",
      type: "mcq",
      question: "In a kaleidoscope, how many images are formed when the angle between the mirrors is 60°?",
      options: ["3", "5", "6", "12"],
      correctAnswer: "5",
      explanation: "Number of images = (360°/θ) − 1 = (360°/60°) − 1 = 6 − 1 = 5 images. A kaleidoscope at 60° creates 5 beautiful symmetric images, producing 6-fold symmetry when combined with the object itself. Decreasing the angle increases the number of images.",
      points: 10
    },

    /* Short Answer Set 3 */
    {
      id: "t2q41",
      type: "short",
      question: "A candle is placed 25 cm from a concave mirror of focal length 20 cm. Find the image distance and state whether it is real or virtual.",
      options: [],
      correctAnswer: "u = −25 cm, f = −20 cm.\n1/v = 1/f − 1/u = 1/(−20) − 1/(−25) = −1/20 + 1/25 = (−5 + 4)/100 = −1/100.\nv = −100 cm.\nNegative v → image is in front of mirror → REAL image at 100 cm in front.",
      explanation: "The candle is just slightly beyond F (25 cm vs f = 20 cm), so it falls between F and C. Image is beyond C, which explains the large v = 100 cm.",
      points: 15
    },
    {
      id: "t2q42",
      type: "short",
      question: "Explain why a concave mirror is used as a reflector in torches and headlights.",
      options: [],
      correctAnswer: "In a torch or headlight, the bulb is placed exactly at the principal focus (F) of the concave mirror. According to mirror optics, when an object is at F, the reflected rays emerge parallel to the principal axis (image at infinity). This creates a strong, parallel, focused beam of light that travels a long distance without spreading. The concave mirror concentrates all the light from the bulb into a directional beam.",
      explanation: "The F → ∞ mirror rule is the physical basis for all directional light sources: headlights, torches, searchlights, and theatre spotlights.",
      points: 15
    },
    {
      id: "t2q43",
      type: "short",
      question: "Compare the images formed by a concave mirror and a convex mirror when an object is very close (just near the pole). Which gives a more useful magnified image?",
      options: [],
      correctAnswer: "Near the pole (between P and F for concave):\n• Concave mirror: Virtual, erect, MAGNIFIED image (m > 1) — very useful for makeup/shaving mirrors.\n• Convex mirror: Virtual, erect, DIMINISHED image (m < 1, always) — not useful for magnification.\n\nConcave mirror is far more useful for close-up magnification. It acts as a magnifying mirror when the object is inside the focal length.",
      explanation: "This comparison highlights why concave mirrors are chosen for magnifying applications while convex mirrors are chosen for wide-field applications.",
      points: 15
    },
    {
      id: "t2q44",
      type: "short",
      question: "What is 'aperture' of a spherical mirror? How does a small aperture help in forming clearer images?",
      options: [],
      correctAnswer: "Aperture: The diameter of the circular reflecting surface of a spherical mirror.\n\nA small aperture (paraxial rays only, close to the principal axis) ensures that all reflected rays from parallel incident rays converge to essentially the same focal point. This prevents 'spherical aberration' — the blurring caused by marginal rays (far from axis) focusing at slightly different points. Small-aperture mirrors obey the mirror formula accurately and form sharp, clear images.",
      explanation: "The mirror formula 1/v + 1/u = 1/f is exact only for paraxial rays. Large apertures cause spherical aberration — real optical systems use paraboloid mirrors to correct this.",
      points: 15
    },
    {
      id: "t2q45",
      type: "short",
      question: "An object placed 30 cm from a mirror gives a virtual, erect image 10 cm behind the mirror. Calculate the focal length and identify the type of mirror.",
      options: [],
      correctAnswer: "u = −30 cm, v = +10 cm (virtual image → behind mirror → positive).\nMirror formula: 1/f = 1/v + 1/u = 1/10 + 1/(−30) = 3/30 − 1/30 = 2/30 = 1/15.\nf = +15 cm.\nPositive focal length → CONVEX mirror.\nThe convex mirror with f = 15 cm placed an object 30 cm in front gives a virtual, erect image 10 cm behind itself.",
      explanation: "A positive focal length (from the mirror formula) immediately tells you it's a convex mirror. Always verify: for convex mirrors, v is always positive and smaller than |u|.",
      points: 15
    },

    /* Long Answer Set 3 */
    {
      id: "t2q46",
      type: "long",
      question: "With the help of ray diagrams, describe the image formed when an object is placed (a) at infinity, (b) at C, and (c) between F and P in a concave mirror. State position, size, and nature for each case.",
      options: [],
      correctAnswer: "(a) Object at Infinity:\n• Incident rays are parallel to principal axis.\n• After reflection, they converge at F.\n• Image: AT F, Real, Inverted, Highly diminished (point-sized).\n• Application: Satellite dishes, solar furnaces.\n\n(b) Object at C (= 2f):\n• Two rays: one parallel to axis (reflects through F), one through F (reflects parallel to axis).\n• Both converge at C on the same side.\n• Image: AT C, Real, Inverted, Same size (m = −1).\n• Application: Used in optical experiments needing same-size real images.\n\n(c) Object between F and P:\n• Reflected rays diverge; their extensions meet behind the mirror.\n• Image: BEHIND MIRROR (virtual), Erect, Magnified (m > 1).\n• Application: Shaving mirrors, makeup mirrors, dentist mirrors.\n\nKey insight: As object moves from ∞ towards P, the image starts at F (real, tiny), grows through C (same size), goes to ∞ (at F), then jumps to virtual behind mirror (when past F).",
      explanation: "Knowing all 6 standard object positions for a concave mirror is absolutely essential for board exams. Memorize the table and understand the physics behind each case.",
      points: 20
    },
    {
      id: "t2q47",
      type: "long",
      question: "A 5 cm tall object is placed 40 cm in front of a convex mirror of focal length 25 cm. Find: (a) image position, (b) image height, (c) nature of image. Comment on whether this image can be projected on a screen.",
      options: [],
      correctAnswer: "Given: h = 5 cm, u = −40 cm, f = +25 cm (convex mirror: positive).\n\n(a) Mirror formula: 1/v = 1/f − 1/u = 1/25 − 1/(−40) = 1/25 + 1/40\n= 8/200 + 5/200 = 13/200\nv = 200/13 ≈ +15.38 cm\nImage is 15.38 cm BEHIND the mirror (positive = behind).\n\n(b) m = −v/u = −(15.38)/(−40) = +0.384\nh' = m × h = 0.384 × 5 = +1.92 cm\nImage height ≈ 1.92 cm (positive = erect).\n\n(c) Nature: Virtual (v positive = behind mirror), Erect (m positive), Diminished (|m| < 1).\n\nProjection: This image CANNOT be projected on a screen. Virtual images are formed by apparent intersection of reflected rays extended backwards behind the mirror. No actual light converges at this point, so a screen placed there would show nothing.",
      explanation: "Convex mirrors always give these characteristics: v positive, m positive and < 1, image behind mirror, cannot be projected. These are universal for all object positions.",
      points: 20
    },

    /* HOTS Set 3 */
    {
      id: "t2q48",
      type: "thinking",
      question: "A concave mirror of focal length 10 cm is held 30 cm from a lighted candle. (a) Where is the image? (b) The mirror is now moved 5 cm closer to the candle (now at u = −25 cm). Does the image move towards or away from the mirror? Calculate and explain.",
      options: [],
      correctAnswer: "(a) u = −30 cm, f = −10 cm.\n1/v = 1/(−10) − 1/(−30) = −3/30 + 1/30 = −2/30 = −1/15.\nv = −15 cm. Image at 15 cm in front.\n\n(b) u = −25 cm, f = −10 cm.\n1/v = 1/(−10) − 1/(−25) = −5/50 + 2/50 = −3/50.\nv = −50/3 = −16.67 cm.\nImage is now at 16.67 cm (moved AWAY from mirror from 15 to 16.67 cm).\n\nPhysical interpretation: Object moved closer to F (from 30 cm to 25 cm towards F at 10 cm). As object approaches F, image moves towards infinity. So moving from 30 cm to 25 cm (closer to F) pushes image farther from mirror. This is why movie projectors work: moving the film slightly in or out shifts the focused image dramatically on the screen.",
      explanation: "The non-linear relationship between u and v in the mirror formula means image position responds dramatically as u approaches f. This sensitivity is exploited in optical instruments.",
      points: 25
    },
    {
      id: "t2q49",
      type: "thinking",
      question: "A driver uses a convex rear-view mirror of radius of curvature 3 m. A truck 2 m wide is 10 m behind. (a) Find the image width of the truck. (b) Why does the convex mirror make the truck appear farther away than it really is?",
      options: [],
      correctAnswer: "(a) f = R/2 = 3/2 = 1.5 m (positive, convex).\nAssuming u = −10 m for the centre of the truck:\n1/v = 1/1.5 − 1/(−10) = 2/3 + 1/10 = 20/30 + 3/30 = 23/30.\nv = 30/23 ≈ +1.30 m.\nm = −v/u = −(1.30)/(−10) = +0.13.\nImage width = |m| × 2 m = 0.13 × 2 = 0.26 m ≈ 26 cm.\n\n(b) Why trucks appear farther:\nThe convex mirror creates a diminished image (m ≈ 0.13). Our brain judges distance partly by the apparent size of known objects. A truck that appears 0.13 times its actual size is interpreted as being at a distance 1/0.13 ≈ 7.7× farther than it would appear in a flat mirror. So the driver perceives the truck as farther away (safer), but this is a visual illusion — the actual distance is only 10 m. This is why 'Objects in mirror are closer than they appear' warnings are legally required on convex rear-view mirrors!",
      explanation: "This combines real optics calculation with human visual perception — the safety warning on convex mirrors directly comes from this magnification math.",
      points: 25
    },
    {
      id: "t2q50",
      type: "thinking",
      question: "A concave mirror forms a virtual image of an object placed between P and F. If you gradually move the object from just inside F towards P (making u smaller and smaller), what happens to the image position and magnification? Support with two numerical examples.",
      options: [],
      correctAnswer: "General analysis (f = −15 cm):\nAs object moves from near-F towards P (u decreases from near −15 to near 0):\n\nExample 1: u = −12 cm (just inside F)\n1/v = 1/(−15) − 1/(−12) = −4/60 + 5/60 = 1/60.\nv = +60 cm. m = −60/(−12) = +5. Image: 60 cm BEHIND, m = +5 (magnified).\n\nExample 2: u = −5 cm (very close to P)\n1/v = 1/(−15) − 1/(−5) = −1/15 + 1/5 = −1/15 + 3/15 = 2/15.\nv = +7.5 cm. m = −7.5/(−5) = +1.5. Image: 7.5 cm behind, m = +1.5.\n\nConclusion:\n• As u → 0 (object approaches P): v → 0 (image also approaches P), m → +1.\n• As u → −f (object approaches F from inside): v → +∞, m → +∞.\n\nSo moving from P towards F: image moves from P (behind) outward to infinity behind the mirror, with magnification growing from 1 to infinity. This is why a concave mirror is such a powerful magnifier — even small movements near the focus cause dramatic magnification changes.",
      explanation: "This continuity analysis reveals the full behaviour of virtual image formation in concave mirrors — the magnification grows unboundedly as the object approaches the focal point from inside.",
      points: 25
    }
  ],

  /* ══════════════════════════════════════════════════════
   * WORKED EXAMPLES — 5 step-by-step numericals
   * ══════════════════════════════════════════════════════ */
  workedExamples: [
    {
      id: "ex1-t2",
      title: "Focal Length from Radius of Curvature",
      difficulty: "easy",
      topic: "Spherical Mirror Terminology",
      given: ["Radius of Curvature (R) = 30 cm", "Mirror type: Concave"],
      find: ["Focal length (f)"],
      steps: [
        {
          step: 1,
          title: "Recall the R–f relationship",
          work: "For spherical mirrors of small aperture:\nf = R / 2\nThis relationship holds for BOTH concave and convex mirrors.",
          note: "This works because the centre of curvature is twice as far from the pole as the principal focus.",
        },
        {
          step: 2,
          title: "Substitute and calculate",
          work: "f = R / 2 = 30 / 2 = 15 cm",
        },
        {
          step: 3,
          title: "Apply sign convention",
          work: "For a CONCAVE mirror, the focus is in front of the mirror (real focus).\nBy New Cartesian Sign Convention: f = −15 cm (negative, since it is in front of the mirror, i.e., in the direction opposite to incident light).",
          note: "Concave mirror: f is negative. Convex mirror: f is positive.",
        },
      ],
      answer: "Focal length f = −15 cm (concave mirror, real focus in front of mirror)",
      realLifeConnect: "A car headlight uses a parabolic concave mirror with R ≈ 20 cm (f = 10 cm). The bulb is placed exactly at the focus, so reflected rays emerge as a powerful parallel beam.",
    },
    {
      id: "ex2-t2",
      title: "Image Position: Object Beyond Centre of Curvature",
      difficulty: "medium",
      topic: "Image Formation by Concave Mirror",
      given: [
        "Object distance (u) = −40 cm",
        "Focal length (f) = −15 cm",
        "Mirror type: Concave",
      ],
      find: ["Image distance (v)", "Nature of image"],
      steps: [
        {
          step: 1,
          title: "Write the Mirror Formula",
          work: "Mirror formula: 1/v + 1/u = 1/f",
        },
        {
          step: 2,
          title: "Substitute the values",
          work: "1/v + 1/(−40) = 1/(−15)\n1/v = 1/(−15) − 1/(−40)\n1/v = −1/15 + 1/40",
        },
        {
          step: 3,
          title: "Find LCM and simplify",
          work: "LCM of 15 and 40 = 120\n1/v = (−8 + 3)/120 = −5/120 = −1/24\nv = −24 cm",
          note: "Since u = −40 cm (beyond C where R = 30 cm), the object is beyond C, so image is between F and C.",
        },
        {
          step: 4,
          title: "Determine nature of image",
          work: "v = −24 cm → negative → image is in front of mirror → REAL\nImage is between F (−15) and C (−30) ✓\nNature: Real, Inverted, Diminished (since |v| < |u|)",
        },
      ],
      answer: "v = −24 cm. Image is real, inverted, and diminished, formed between F and C",
      realLifeConnect: "When you hold an object beyond 2f in front of a concave shaving mirror, you see a smaller, inverted image — this is the 'beyond C' case every morning!",
    },
    {
      id: "ex3-t2",
      title: "Magnification and Image Height",
      difficulty: "medium",
      topic: "Magnification in Spherical Mirrors",
      given: [
        "Object distance (u) = −20 cm",
        "Object height (h) = 2 cm",
        "Focal length (f) = −30 cm",
        "Mirror type: Concave",
      ],
      find: ["Image distance (v)", "Magnification (m)", "Image height (h')"],
      steps: [
        {
          step: 1,
          title: "Apply Mirror Formula",
          work: "1/v + 1/u = 1/f\n1/v + 1/(−20) = 1/(−30)\n1/v = −1/30 + 1/20 = (−2 + 3)/60 = 1/60\nv = +60 cm",
        },
        {
          step: 2,
          title: "Find magnification",
          work: "m = −v/u = −(+60)/(−20) = +3",
          note: "Positive m (+3) → image is VIRTUAL and ERECT. |m| = 3 → image is 3× enlarged.",
        },
        {
          step: 3,
          title: "Find image height",
          work: "m = h'/h\nh' = m × h = 3 × 2 = 6 cm\nImage height = 6 cm (erect, same side as object in virtual image)",
        },
      ],
      answer: "v = +60 cm (virtual, behind mirror), m = +3, Image height = 6 cm (enlarged, erect)",
      realLifeConnect: "This is exactly how a dental/ENT mirror works! When placed within the focal length (object between F and P), the concave mirror gives a magnified, erect, virtual image — making it easy for the doctor to examine teeth or throat.",
    },
    {
      id: "ex4-t2",
      title: "Convex Mirror — Driver's Rear-View Mirror",
      difficulty: "medium",
      topic: "Image Formation by Convex Mirror",
      given: [
        "Object distance (u) = −3 m = −300 cm",
        "Focal length (f) = +15 cm (convex mirror, positive f)",
      ],
      find: ["Image distance (v)", "Magnification (m)", "Nature of image"],
      steps: [
        {
          step: 1,
          title: "Apply Mirror Formula for convex mirror",
          work: "1/v + 1/u = 1/f\n1/v + 1/(−300) = 1/(+15)\n1/v = 1/15 + 1/300",
        },
        {
          step: 2,
          title: "Simplify",
          work: "LCM(15, 300) = 300\n1/v = 20/300 + 1/300 = 21/300\nv = 300/21 ≈ +14.3 cm",
          note: "v is POSITIVE → image is behind the mirror (virtual) — always true for convex mirror.",
        },
        {
          step: 3,
          title: "Find magnification",
          work: "m = −v/u = −(+14.3)/(−300) = +0.048\nImage is highly diminished (only 4.8% of object size) and erect.",
        },
      ],
      answer: "v ≈ +14.3 cm (virtual, behind mirror), m ≈ +0.048 (diminished, erect)",
      realLifeConnect: "A car's convex rear-view mirror always gives a virtual, erect, diminished image — allowing the driver to see a wide field of view. The warning 'Objects in mirror are closer than they appear' is precisely because the image is diminished (appears smaller = looks farther away).",
    },
    {
      id: "ex5-t2",
      title: "Finding Focal Length from Image and Object Distance",
      difficulty: "hard",
      topic: "Mirror Formula — Reverse Calculation",
      given: [
        "Object distance (u) = −50 cm",
        "Image distance (v) = −25 cm",
        "Image nature: Real",
      ],
      find: ["Focal length (f)", "Type of mirror", "Radius of Curvature (R)"],
      steps: [
        {
          step: 1,
          title: "Apply Mirror Formula",
          work: "1/f = 1/v + 1/u\n1/f = 1/(−25) + 1/(−50)\n1/f = −1/25 − 1/50",
        },
        {
          step: 2,
          title: "Calculate f",
          work: "LCM(25, 50) = 50\n1/f = −2/50 − 1/50 = −3/50\nf = −50/3 ≈ −16.7 cm",
          note: "f is negative → the mirror is CONCAVE (real, negative focal length).",
        },
        {
          step: 3,
          title: "Find Radius of Curvature",
          work: "R = 2f = 2 × (−50/3) = −100/3 ≈ −33.3 cm\n|R| = 33.3 cm",
        },
        {
          step: 4,
          title: "Verify: object is beyond C?",
          work: "|u| = 50 cm, |R| = 33.3 cm → Object (50 cm) IS beyond C (33.3 cm) ✓\nFor concave mirror with object beyond C: image is between F and C, real, inverted, diminished ✓",
        },
      ],
      answer: "f = −16.7 cm (concave mirror), R = −33.3 cm. Mirror is CONCAVE.",
      realLifeConnect: "Solar cooker design uses this reverse calculation — engineers specify where to focus sunlight (image position = cooking pot) and where the sunlight source effectively is (object = sun at ∞), then compute the needed focal length for the parabolic reflector.",
    },
  ],
};
