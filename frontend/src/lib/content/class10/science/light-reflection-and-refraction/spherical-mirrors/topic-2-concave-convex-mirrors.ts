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
  imageUrl: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=1200",
  content: `
### What is a Spherical Mirror?

A spherical mirror is a mirror whose reflecting surface is a part of a hollow sphere of glass. 

Depending on which side of the spherical surface is silvered, there are two types of spherical mirrors:
1. **Concave Mirror:** A spherical mirror whose reflecting surface is curved inwards (faces towards the center of the sphere). It is also known as a **converging mirror** because it converges parallel rays of light.
2. **Convex Mirror:** A spherical mirror whose reflecting surface is curved outwards. It is also known as a **diverging mirror** because it diverges parallel rays of light.

---

### Key Terminology

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
    }
  ]
};
