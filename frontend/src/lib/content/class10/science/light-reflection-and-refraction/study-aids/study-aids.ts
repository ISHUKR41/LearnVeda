/**
 * FILE: study-aids.ts
 * LOCATION: src/lib/content/class10/science/light-reflection-and-refraction/study-aids/study-aids.ts
 * PURPOSE: Comprehensive flash cards (20+ per topic) and deep mind maps for all 8 topics
 *          in the Light – Reflection and Refraction chapter.
 *          Used for quick revision, exam preparation, and deep concept retention.
 *
 * STRUCTURE:
 *   - topicFlashCards: Record<topicId, FlashCard[]> — 30 cards per topic
 *   - topicMindMaps:   Record<topicId, MindMapNode[]> — hierarchical concept trees
 *
 * TOPICS COVERED:
 *   1. intro-and-laws-of-reflection     (30 cards)
 *   2. concave-convex-mirrors            (30 cards)
 *   3. mirror-formula-magnification      (30 cards)
 *   4. laws-of-refraction-and-index      (30 cards)
 *   5. image-formation-by-lenses         (30 cards)
 *   6. lens-formula-and-power            (30 cards)
 *   7. total-internal-reflection         (30 cards)
 *   8. dispersion-and-human-eye          (30 cards)
 *   9. topic-9-numericals-advanced       (20 cards)
 *
 * LAST UPDATED: 2026-06-09
 */

/* ══════════════════════════════════════════════════════════════════
 * FLASH CARDS — 20–25 per topic (120+ total)
 * ══════════════════════════════════════════════════════════════════ */

export const topicFlashCards: Record<string, { id: string; front: string; back: string }[]> = {

  /* ─────────────────────────────────────────────────────────────
   * Topic 1: Introduction & Laws of Reflection (22 cards)
   * ───────────────────────────────────────────────────────────── */
  "intro-and-laws-of-reflection": [
    { id: "fc1-1",  front: "What is Rectilinear Propagation of Light?",
      back: "Light travels in straight lines in a uniform medium. This property is called rectilinear propagation. Evidence: formation of shadows, eclipses, and pin-hole camera images." },
    { id: "fc1-2",  front: "What is the Angle of Incidence?",
      back: "The angle between the incident ray and the normal at the point of incidence. Always measured from the NORMAL, not from the surface." },
    { id: "fc1-3",  front: "State the First Law of Reflection.",
      back: "The incident ray, the reflected ray, and the normal to the reflecting surface at the point of incidence all lie in the same plane." },
    { id: "fc1-4",  front: "State the Second Law of Reflection.",
      back: "The angle of incidence (∠i) is ALWAYS equal to the angle of reflection (∠r). i.e., ∠i = ∠r. This law holds for ALL types of reflecting surfaces." },
    { id: "fc1-5",  front: "What is a 'Normal' in optics?",
      back: "An imaginary straight line drawn perpendicular (at 90°) to the reflecting surface at the point of incidence. It is the reference line for measuring angles." },
    { id: "fc1-6",  front: "Difference: Regular vs Diffuse Reflection?",
      back: "Regular (Specular): smooth surface → parallel reflected rays → forms clear image (mirror). Diffuse (Irregular): rough surface → scattered reflected rays in all directions → no image but makes object visible everywhere." },
    { id: "fc1-7",  front: "What is a Virtual Image?",
      back: "An image that CANNOT be captured on a screen. It is formed when reflected/refracted rays only APPEAR to diverge from a point behind the mirror. E.g., image in a plane mirror." },
    { id: "fc1-8",  front: "What is a Real Image?",
      back: "An image that CAN be captured on a screen. It is formed when reflected/refracted rays ACTUALLY converge at a point in front of the mirror. E.g., image on a cinema screen." },
    { id: "fc1-9",  front: "Speed of light in vacuum?",
      back: "c = 3 × 10⁸ m/s (exactly 299,792,458 m/s). In other media, light slows down: in water ≈ 2.25 × 10⁸ m/s, in glass ≈ 2 × 10⁸ m/s." },
    { id: "fc1-10", front: "Why can we see non-luminous objects?",
      back: "Non-luminous objects (like the moon, books) reflect light from luminous sources (sun, bulbs) into our eyes. We see them due to this reflected light." },
    { id: "fc1-11", front: "What is Lateral Inversion?",
      back: "The left side of an object appears as the right side of its mirror image, and vice versa. Left ↔ Right is swapped. Up ↔ Down is NOT swapped in a plane mirror." },
    { id: "fc1-12", front: "5 Properties of a Plane Mirror Image?",
      back: "1. Virtual 2. Erect (upright) 3. Same size as object (m = 1) 4. Laterally inverted 5. Image distance = Object distance (equidistant from mirror)" },
    { id: "fc1-13", front: "Why is AMBULANCE written backwards?",
      back: "Because a plane mirror causes lateral inversion. A driver seeing 'AMBULANCE' in their rear-view mirror will read it correctly as AMBULANCE (L→R reversed back to normal)." },
    { id: "fc1-14", front: "Number of images formed by two mirrors at angle θ?",
      back: "n = (360°/θ) - 1, provided 360°/θ is an even integer. E.g., at 90°: n = 3 images. At 60°: n = 5 images. At 45°: n = 7 images." },
    { id: "fc1-15", front: "Minimum length of mirror for full body image?",
      back: "Exactly HALF the person's height (h/2). This is independent of the person's distance from the mirror! The top of the mirror must be at eye level, bottom at halfway between eyes and feet." },
    { id: "fc1-16", front: "If a mirror rotates by angle θ, reflected ray rotates by?",
      back: "The reflected ray rotates by 2θ. This is because rotating the mirror by θ changes the normal direction by θ, which changes both incidence and reflection angles." },
    { id: "fc1-17", front: "What is Luminous vs Non-Luminous object?",
      back: "Luminous: emits its own light (sun, bulb, candle, stars, firefly). Non-Luminous: does not emit light but reflects it (moon, planets, paper, most objects we see)." },
    { id: "fc1-18", front: "Laws of Reflection apply to which type of surfaces?",
      back: "Both laws apply to ALL reflecting surfaces — plane mirrors, spherical mirrors (concave and convex), and even rough surfaces. The laws are universal." },
    { id: "fc1-19", front: "What is a Pin-hole Camera?",
      back: "A device with a tiny hole (pin-hole) in one face. Light through the hole forms an inverted, real image on the opposite face. Proves rectilinear propagation. Size of image: h' = (v × h) / u." },
    { id: "fc1-20", front: "If angle of incidence is 0° (ray hits normally), reflected ray?",
      back: "Angle of reflection = 0°. The ray retraces its path back exactly along the same direction it came from (normal incidence)." },
    { id: "fc1-21", front: "Difference: Incident ray vs Emergent ray in a glass slab?",
      back: "In a glass slab, the emergent ray is parallel to the incident ray but DISPLACED sideways. The lateral shift is called lateral displacement. The direction is unchanged." },
    { id: "fc1-22", front: "Why does a mirror reflect more clearly than a white wall?",
      back: "Mirror → regular (specular) reflection → parallel reflected rays → forms clear image. White wall → diffuse reflection → scattered rays in all directions → no image formed." },
    { id: "fc1-23", front: "What is a Periscope and how does it use plane mirrors?",
      back: "A periscope uses two plane mirrors at 45° to the vertical, one at the top and one at the bottom of a vertical tube. Light hits the top mirror → reflects 90° down the tube → hits bottom mirror → reflects 90° to the eye. Used in submarines and to see over crowds." },
    { id: "fc1-24", front: "Why does the printed word 'AMBULANCE' appear correct in a rear-view mirror?",
      back: "Because plane mirrors cause lateral (left-right) inversion. 'AMBULANCE' is written in reverse (mirror-image) on the vehicle front. A driver's rear-view mirror re-inverts it, so the driver reads it correctly as 'AMBULANCE'." },
    { id: "fc1-25", front: "Two mirrors at 90° — how many images are formed?",
      back: "n = (360°/θ) − 1 = (360°/90°) − 1 = 4 − 1 = 3 images. This is used in corner reflectors on roads — any light entering a 90° corner reflects straight back to the source regardless of direction." },
    { id: "fc1-26", front: "How does a Kaleidoscope work?",
      back: "Three plane mirrors placed at 60° to each other form a triangular tube. Objects inside create n = 360°/60° − 1 = 5 images. Coloured beads placed at one end appear as beautiful, symmetric 6-fold patterns due to multiple reflections." },
    { id: "fc1-27", front: "What is the speed of light in different media? (Key values)",
      back: "Vacuum: 3 × 10⁸ m/s = 3 × 10⁵ km/s. Air: ≈ 3 × 10⁸ m/s (same as vacuum, practically). Water: ≈ 2.25 × 10⁸ m/s. Glass: ≈ 2 × 10⁸ m/s. Diamond: ≈ 1.24 × 10⁸ m/s." },
    { id: "fc1-28", front: "What is a Silver Nitrate coating on a mirror?",
      back: "Mirrors are made by depositing a thin layer of silver (from silver nitrate solution) on the back of a glass pane, then protecting it with a layer of paint. The silver layer creates a highly reflective surface (95%+ reflectivity)." },
    { id: "fc1-29", front: "If you walk 2 m/s toward a plane mirror, how fast does your image approach?",
      back: "Your image moves at 2 m/s toward the mirror (same speed). But the rate of approach BETWEEN you and your image = 2 + 2 = 4 m/s (your speed + image speed). So you and your image close at 4 m/s." },
    { id: "fc1-30", front: "Explain: 'A shadow proves rectilinear propagation of light.'",
      back: "A shadow forms because light travels in straight lines and cannot bend around opaque objects. The sharp outline of a shadow (with a point source) proves light travels in straight lines. A diffuse source creates a penumbra (partial shadow) and umbra (full shadow)." },
  ],

  /* ─────────────────────────────────────────────────────────────
   * Topic 2: Spherical Mirrors (23 cards)
   * ───────────────────────────────────────────────────────────── */
  "concave-convex-mirrors": [
    { id: "fc2-1",  front: "What is a Spherical Mirror?",
      back: "A mirror whose reflecting surface is part of a hollow sphere. If silvered on the inner (concave) side → Concave mirror. If silvered on the outer (convex) side → Convex mirror." },
    { id: "fc2-2",  front: "What is a Concave Mirror?",
      back: "Reflecting surface is curved INWARDS (like the inside of a hollow sphere/spoon). Also called a CONVERGING mirror because parallel rays meet at Focus F after reflection." },
    { id: "fc2-3",  front: "What is a Convex Mirror?",
      back: "Reflecting surface is curved OUTWARDS (like the back of a spoon). Also called a DIVERGING mirror because parallel rays diverge after reflection (appear to come from Focus behind mirror)." },
    { id: "fc2-4",  front: "Define Pole (P) of a spherical mirror.",
      back: "The geometric centre of the reflecting surface of the spherical mirror. Denoted P. All measurements are made from P." },
    { id: "fc2-5",  front: "Define Centre of Curvature (C).",
      back: "The centre of the complete hollow sphere of which the mirror is a part. Lies on the principal axis. For concave mirror: in front. For convex mirror: behind the mirror." },
    { id: "fc2-6",  front: "Define Radius of Curvature (R).",
      back: "The radius of the hollow sphere of which the mirror is a part. R = distance from Pole (P) to Centre of Curvature (C). Relation: R = 2f (R = twice the focal length)." },
    { id: "fc2-7",  front: "Define Principal Focus (F).",
      back: "Concave: point on axis where incident rays parallel to axis ACTUALLY meet after reflection. Convex: point on axis from which incident parallel rays APPEAR to diverge after reflection. F is real for concave, virtual for convex." },
    { id: "fc2-8",  front: "Relation between focal length f and R?",
      back: "f = R/2 (for mirrors of small aperture). The focal length is exactly half the radius of curvature. This is derived geometrically by showing F is midpoint of PC." },
    { id: "fc2-9",  front: "3 Rules for drawing ray diagrams (spherical mirrors)?",
      back: "1. Ray parallel to axis → reflects through F (concave) or appears to come from F (convex). 2. Ray through F → reflects parallel to axis. 3. Ray through C → retraces its path (hits normally)." },
    { id: "fc2-10", front: "Concave mirror: Object at infinity → Image?",
      back: "Image at F. Real, inverted, highly diminished (point-sized). m is very small negative value." },
    { id: "fc2-11", front: "Concave mirror: Object beyond C → Image?",
      back: "Image between F and C. Real, inverted, diminished. |m| < 1." },
    { id: "fc2-12", front: "Concave mirror: Object at C → Image?",
      back: "Image at C. Real, inverted, same size as object. m = -1." },
    { id: "fc2-13", front: "Concave mirror: Object between C and F → Image?",
      back: "Image beyond C (far from mirror). Real, inverted, enlarged. |m| > 1." },
    { id: "fc2-14", front: "Concave mirror: Object at F → Image?",
      back: "Image at infinity (∞). Highly enlarged. This is used in headlights — object (bulb) at F produces parallel beam." },
    { id: "fc2-15", front: "Concave mirror: Object between P and F → Image?",
      back: "Image behind the mirror (virtual). Virtual, erect, enlarged. This is used in shaving mirrors and makeup mirrors." },
    { id: "fc2-16", front: "Convex mirror: Image is ALWAYS what?",
      back: "ALWAYS: Virtual + Erect + Diminished, regardless of where the object is placed. Image is always between P and F (behind the mirror)." },
    { id: "fc2-17", front: "Why are convex mirrors used as rear-view mirrors?",
      back: "1. Always forms erect image (right-side up). 2. Always diminished → wider field of view (more area visible). 3. Image is virtual — always behind mirror. The driver can see more traffic." },
    { id: "fc2-18", front: "Uses of Concave Mirrors (list 5)?",
      back: "1. Shaving/makeup mirrors (enlarged face image). 2. Dentist's mirror (enlarged view of teeth). 3. Headlights/torches (parallel beam). 4. Solar furnace/concentrator (concentrate sunlight at F). 5. Reflecting telescopes." },
    { id: "fc2-19", front: "Uses of Convex Mirrors (list 3)?",
      back: "1. Rear-view mirrors in vehicles (wider view). 2. Security/surveillance mirrors in shops/ATMs. 3. Road blind-corner mirrors." },
    { id: "fc2-20", front: "What is the Aperture of a mirror?",
      back: "The effective diameter of the reflecting surface. Denoted by MN. Smaller aperture → mirror formula is more accurate. Paraxial rays (close to axis) obey the formula precisely." },
    { id: "fc2-21", front: "Distinguish: Focus of Concave vs Convex mirror.",
      back: "Concave: Focus is REAL — reflected rays actually meet there. Convex: Focus is VIRTUAL — reflected rays appear to diverge FROM it (they don't actually meet)." },
    { id: "fc2-22", front: "What is 'Paraxial Approximation'?",
      back: "Only rays close to the principal axis (paraxial rays) satisfy the simple mirror formula. Rays far from axis (marginal rays) create spherical aberration and don't meet exactly at F." },
    { id: "fc2-23", front: "What is the Principal Axis?",
      back: "The straight line passing through the Pole (P) and the Centre of Curvature (C). It is the axis of symmetry of the spherical mirror." },
    { id: "fc2-24", front: "Why is a concave mirror used as a shaving mirror?",
      back: "When your face is between P and F, the concave mirror forms a virtual, erect, ENLARGED image — making it easy to see details while shaving or applying makeup. The image is larger than actual and upright." },
    { id: "fc2-25", front: "Why is a concave mirror used in a solar furnace?",
      back: "A large concave mirror (parabolic dish) converges all incoming parallel sunrays to its Focus F. The temperature at F can reach thousands of degrees Celsius. Solar furnaces use this to melt metals or generate electricity." },
    { id: "fc2-26", front: "Why is a concave mirror used in torch/headlights?",
      back: "The bulb is placed at Focus F of a concave mirror. Since a ray from F reflects parallel to the axis, the mirror produces a powerful, parallel beam of light (not diverging), giving directional illumination." },
    { id: "fc2-27", front: "What is Spherical Aberration?",
      back: "Marginal rays (far from the axis) reflect to a slightly different focus than paraxial rays in a spherical mirror. This blurs the image — called spherical aberration. Solution: use a PARABOLIC mirror (no spherical aberration)." },
    { id: "fc2-28", front: "How many images does a concave mirror form as the object moves from ∞ to P?",
      back: "∞ → F: real, inverted, diminished. As object moves closer, image moves away from F. At 2F: same size. Between F and 2F: magnified, real. At F: image at ∞. Between P and F: virtual, erect, magnified behind mirror." },
    { id: "fc2-29", front: "What is a Dentist's mirror, and why is it concave?",
      back: "A dentist holds the small mirror behind teeth (object very close, inside focal length). The concave mirror forms a VIRTUAL, ERECT, ENLARGED image of the tooth — much easier to see cavities and details." },
    { id: "fc2-30", front: "Convex mirror — object at ∞ → image location?",
      back: "Image forms at the Principal Focus F, which is BEHIND the convex mirror (virtual focus). The image is virtual, erect, and point-sized. Convex mirrors ALWAYS form images between P and F, regardless of object distance." },
  ],

  /* ─────────────────────────────────────────────────────────────
   * Topic 3: Mirror Formula & Magnification (21 cards)
   * ───────────────────────────────────────────────────────────── */
  "mirror-formula-and-magnification": [
    { id: "fc3-1",  front: "Write the Mirror Formula.",
      back: "1/v + 1/u = 1/f (or) 1/f = 1/v + 1/u. All three quantities (v, u, f) must be measured from the Pole and signed correctly per New Cartesian convention." },
    { id: "fc3-2",  front: "What is Magnification (m)?",
      back: "m = h'/h = −v/u. The ratio of image height (h') to object height (h). The negative sign accounts for real images being inverted." },
    { id: "fc3-3",  front: "State the 6 rules of New Cartesian Sign Convention.",
      back: "1. Origin at Pole P. 2. Incident light travels left → right. 3. All distances measured from P. 4. Right of P → positive. 5. Left of P → negative. 6. Heights above axis → positive, below → negative." },
    { id: "fc3-4",  front: "Object distance u: positive or negative (always)?",
      back: "ALWAYS NEGATIVE. Object is always to the left of the mirror (against the direction of incident light). u = −ve always." },
    { id: "fc3-5",  front: "Concave mirror focal length f: positive or negative?",
      back: "NEGATIVE. Focus of concave mirror is in front of mirror (to the left of P). f = −R/2 in sign convention. Example: f = −10 cm." },
    { id: "fc3-6",  front: "Convex mirror focal length f: positive or negative?",
      back: "POSITIVE. Focus of convex mirror is behind the mirror (to the right of P, virtual). f = +R/2. Example: f = +10 cm." },
    { id: "fc3-7",  front: "If image distance v is negative (mirror formula), the image is?",
      back: "REAL and in FRONT of the mirror. Real images have negative v (they form on the same side as the object, which is the negative side for mirrors)." },
    { id: "fc3-8",  front: "If image distance v is positive (mirror formula), the image is?",
      back: "VIRTUAL and BEHIND the mirror. Virtual images have positive v. This only happens for concave mirror (object between P and F) or convex mirror (always)." },
    { id: "fc3-9",  front: "If m > 0 (magnification is positive), image is?",
      back: "VIRTUAL and ERECT (upright). m > 0 → v and u have the same sign → virtual image behind mirror." },
    { id: "fc3-10", front: "If m < 0 (magnification is negative), image is?",
      back: "REAL and INVERTED. m < 0 → v and u have opposite signs → real image in front of mirror." },
    { id: "fc3-11", front: "If |m| > 1 (magnitude of m greater than 1)?",
      back: "Image is ENLARGED (bigger than the object). |h'| > |h|." },
    { id: "fc3-12", front: "If |m| < 1 (magnitude of m less than 1)?",
      back: "Image is DIMINISHED (smaller than the object). |h'| < |h|." },
    { id: "fc3-13", front: "If |m| = 1, image size?",
      back: "Image is the SAME SIZE as the object. This happens when the object is at C for a concave mirror." },
    { id: "fc3-14", front: "Object 20 cm from concave mirror (f = 10 cm). Find v.",
      back: "1/v = 1/f − 1/u = 1/(−10) − 1/(−20) = −1/10 + 1/20 = −1/20. So v = −20 cm. Image is real, at 20 cm in front. m = −v/u = −(−20)/(−20) = −1. Inverted, same size." },
    { id: "fc3-15", front: "Object 5 cm from concave mirror (f = 10 cm). Find image.",
      back: "1/v = 1/f − 1/u = 1/(−10) − 1/(−5) = −1/10 + 1/5 = 1/10. v = +10 cm. Positive → virtual, behind mirror. m = −v/u = −(10)/(−5) = +2. Virtual, erect, 2× enlarged." },
    { id: "fc3-16", front: "Object 15 cm from convex mirror (f = +10 cm). Find image.",
      back: "1/v = 1/f − 1/u = 1/(10) − 1/(−15) = 1/10 + 1/15 = 5/30 = 1/6. v = +6 cm. Virtual, behind mirror. m = −v/u = −6/(−15) = +0.4. Virtual, erect, diminished." },
    { id: "fc3-17", front: "CBSE 2023: Numerically, if object height = 3 cm, m = −2, what is image height and nature?",
      back: "m = h'/h → h' = m × h = (−2)(3) = −6 cm. Height = 6 cm, negative sign → image is INVERTED. So: image is real, inverted, 6 cm tall (enlarged by factor 2)." },
    { id: "fc3-18", front: "Mirror formula vs Lens formula — key difference?",
      back: "Mirror: 1/v + 1/u = 1/f. Lens: 1/v − 1/u = 1/f. Note the minus sign in lens formula. Also, sign convention origin is at Pole for mirrors and at Optical Centre for lenses." },
    { id: "fc3-19", front: "Magnification of a mirror vs lens — key difference?",
      back: "Mirror: m = −v/u (with negative sign). Lens: m = v/u (no negative sign). For mirrors, real images have m < 0; for lenses, real images also have m < 0 because v > 0 and u < 0." },
    { id: "fc3-20", front: "If image is real and size is 3× larger than object, what is m?",
      back: "m = −3 (negative because it's real and inverted, magnitude 3 because 3× enlarged). This happens with a concave mirror when object is between F and 2F." },
    { id: "fc3-21", front: "What is the power of a spherical mirror of focal length 20 cm?",
      back: "P = 1/f (in metres) = 1/(−0.20) = −5 D (concave mirror). For a convex mirror of f = +20 cm: P = +5 D. Note: power of a mirror = 2/R." },
    { id: "fc3-22", front: "CBSE Board Question: Object is at C of concave mirror. State image properties.",
      back: "Object at C (= 2f from pole). Image: At C, Real, Inverted, Same Size (m = −1). Using mirror formula: 1/v + 1/u = 1/f. u = −2f, f = −f. 1/v = 1/(−f) − 1/(−2f) = −1/f + 1/2f = −1/2f. v = −2f = same as object. m = −v/u = −(−2f)/(−2f) = −1." },
    { id: "fc3-23", front: "Object 40 cm in front of concave mirror (f = 15 cm). Find v and m.",
      back: "u = −40 cm, f = −15 cm. 1/v = 1/f − 1/u = 1/(−15) − 1/(−40) = −8/120 + 3/120 = −5/120. v = −24 cm. Image is real, 24 cm in front. m = −v/u = −(−24)/(−40) = −0.6. Real, inverted, diminished." },
    { id: "fc3-24", front: "How do you find the focal length of a concave mirror using a distant object?",
      back: "Point the concave mirror at a very distant object (tree, building). The image forms very close to F. Hold a screen and adjust until you get the sharpest, smallest image. Measure the distance from pole to screen = focal length f." },
    { id: "fc3-25", front: "A concave mirror forms a real image 3 times the size of the object. Where is the object?",
      back: "m = −3 (real and inverted). m = −v/u → −3 = −v/u → v = 3u. Using 1/v + 1/u = 1/f: 1/3u + 1/u = 1/f. (1 + 3)/3u = 1/f → 4/3u = 1/f → u = 4f/3. Object is at 4f/3 from the mirror (between F and C)." },
    { id: "fc3-26", front: "What is the difference between Linear, Transverse, and Axial magnification?",
      back: "Linear/Transverse magnification (m): ratio of image height to object height (perpendicular to axis). m = h'/h = −v/u. Axial magnification: ratio of image length to object length along the axis = m² (square of linear magnification)." },
    { id: "fc3-27", front: "If a concave mirror has R = 30 cm, what is f and the mirror formula?",
      back: "f = R/2 = 30/2 = 15 cm. Since it's concave, f = −15 cm (sign convention). Mirror formula: 1/v + 1/u = 1/(−15) → 1/v + 1/u = −1/15." },
    { id: "fc3-28", front: "Can a convex mirror EVER form a real image?",
      back: "No. A convex mirror ALWAYS forms a virtual image. The reflected rays always diverge and never actually meet in front of the mirror. Only a concave mirror can form real images (when object is beyond F)." },
    { id: "fc3-29", front: "HOTS: A dentist mirror is 3 cm from a tooth and shows the image 5 times larger. Find the focal length.",
      back: "Object inside F (virtual, erect, enlarged). u = −3 cm, m = +5 (virtual & erect). m = −v/u → 5 = −v/(−3) → v = +15 cm. 1/f = 1/v + 1/u = 1/15 + 1/(−3) = 1/15 − 5/15 = −4/15. f = −3.75 cm. Focal length = 3.75 cm." },
  ],

  /* ─────────────────────────────────────────────────────────────
   * Topic 4: Laws of Refraction & Refractive Index (22 cards)
   * ───────────────────────────────────────────────────────────── */
  "laws-of-refraction-and-index": [
    { id: "fc4-1",  front: "What is Refraction of Light?",
      back: "The change in direction of a light ray when it passes obliquely from one transparent medium to another. Caused by the CHANGE IN SPEED of light at the boundary." },
    { id: "fc4-2",  front: "Rarer medium vs Denser medium?",
      back: "Rarer: speed of light is HIGHER (e.g., air, vacuum, n ≈ 1). Denser: speed of light is LOWER (e.g., glass n=1.5, water n=1.33). Note: optically denser ≠ physically denser." },
    { id: "fc4-3",  front: "Light from rarer → denser medium bends?",
      back: "TOWARDS the normal. Angle of refraction < Angle of incidence. The ray bends toward the perpendicular as it slows down." },
    { id: "fc4-4",  front: "Light from denser → rarer medium bends?",
      back: "AWAY from the normal. Angle of refraction > Angle of incidence. The ray bends away from the perpendicular as it speeds up." },
    { id: "fc4-5",  front: "State the two Laws of Refraction (Snell's Laws).",
      back: "1st Law: The incident ray, refracted ray, and normal at the point of incidence all lie in the same plane. 2nd Law (Snell's): n₁ sin θ₁ = n₂ sin θ₂ (ratio sin i / sin r = constant = refractive index)." },
    { id: "fc4-6",  front: "State Snell's Law.",
      back: "n₁ sin θ₁ = n₂ sin θ₂, where n₁, n₂ are refractive indices of medium 1 and 2, and θ₁, θ₂ are angles with the normal in respective media." },
    { id: "fc4-7",  front: "Define Absolute Refractive Index.",
      back: "n = c/v = (speed of light in vacuum) / (speed of light in the medium). Always ≥ 1. Higher n → slower light → denser medium optically." },
    { id: "fc4-8",  front: "Refractive index of key media (memorize!)",
      back: "Vacuum/Air: n = 1.00 | Water: n = 1.33 | Crown Glass: n = 1.52 | Diamond: n = 2.42 | Ice: n = 1.31 | Kerosene: n = 1.44" },
    { id: "fc4-9",  front: "Why does a pencil in water appear bent?",
      back: "Light from the submerged pencil part bends AWAY from normal as it enters air (denser → rarer). Our brain projects the light back in a straight line, making the pencil appear bent/elevated at the surface." },
    { id: "fc4-10", front: "Why does a pool look shallower than it is?",
      back: "Light from the pool bottom bends away from normal entering air. The apparent image is at a shallower depth. Apparent depth = Real depth / n (for near-normal viewing)." },
    { id: "fc4-11", front: "What happens when light passes through a glass slab?",
      back: "1. Light enters and bends towards normal. 2. Travels straight through glass. 3. Exits and bends away from normal. 4. Emergent ray is PARALLEL to incident ray but displaced sideways (lateral displacement)." },
    { id: "fc4-12", front: "What is Lateral Displacement?",
      back: "The perpendicular distance between the original incident ray (extended) and the emergent ray after passing through a glass slab. Depends on slab thickness, angle of incidence, and refractive index." },
    { id: "fc4-13", front: "What is Total Internal Reflection (TIR)?",
      back: "When light passes from a denser to rarer medium at angle ≥ critical angle, ALL light is reflected back into the denser medium with no refraction. Used in optical fibers, diamonds, prisms." },
    { id: "fc4-14", front: "What is the Critical Angle?",
      back: "The angle of incidence in the denser medium for which the refracted ray grazes along the interface (angle of refraction = 90°). sin θ_c = n₂/n₁ = 1/n for air-medium interface." },
    { id: "fc4-15", front: "Critical angle for glass-air interface (n_glass = 1.5)?",
      back: "sin θ_c = 1/n = 1/1.5 = 0.667. θ_c = sin⁻¹(0.667) ≈ 41.8°. For diamond (n = 2.42): θ_c ≈ 24.4° (very small, causing maximum internal reflection → sparkle)." },
    { id: "fc4-16", front: "How does Optical Fiber use TIR?",
      back: "Light enters the glass/plastic core and hits the cladding (less dense) at angles > critical angle. Undergoes repeated TIR bouncing along the fiber. Can transmit data (internet) over thousands of km with almost zero loss." },
    { id: "fc4-17", front: "Why do stars twinkle?",
      back: "Starlight passes through Earth's atmosphere with varying density layers. Continuous refraction (turbulent refraction) causes the light path to change rapidly, making stars appear to twinkle (scintillation)." },
    { id: "fc4-18", front: "Why does sun appear oval at sunrise/sunset?",
      back: "The sun is actually BELOW the horizon but appears above due to atmospheric refraction. The bottom of the sun is refracted more than the top (different atmosphere thickness), making it appear oval/flattened." },
    { id: "fc4-19", front: "Relative Refractive Index n₂₁ means?",
      back: "n₂₁ = n₂/n₁ = v₁/v₂ = (speed of light in medium 1)/(speed of light in medium 2). It's the ratio of speeds and tells you how much light bends going from medium 1 to medium 2." },
    { id: "fc4-20", front: "If n_water = 1.33, speed of light in water?",
      back: "n = c/v → v = c/n = (3 × 10⁸)/1.33 ≈ 2.26 × 10⁸ m/s. Light is approximately 25% slower in water than in vacuum." },
    { id: "fc4-21", front: "What is Dispersion?",
      back: "Splitting of white light into its constituent colours (VIBGYOR) due to different refractive indices for different wavelengths. Violet has highest n (bends most), Red has lowest n (bends least)." },
    { id: "fc4-22", front: "Conditions for Total Internal Reflection?",
      back: "1. Light must travel from DENSER to RARER medium. 2. Angle of incidence must be GREATER THAN or EQUAL TO the critical angle. Both conditions must be met simultaneously." },
    { id: "fc4-23", front: "Why does light bend when going from air to glass?",
      back: "Glass is optically denser (n=1.5) than air (n=1). The speed of light DECREASES in glass. By Snell's Law (n₁ sin i = n₂ sin r), when speed decreases and n increases, sin r < sin i, so the refracted ray bends TOWARD the normal." },
    { id: "fc4-24", front: "What is apparent depth? Give formula.",
      back: "When viewed from above, an object in water appears closer than it actually is. Apparent depth = Real depth / n. For water (n=1.33): a pool 4 m deep appears only 4/1.33 ≈ 3 m deep. This is why reaching into water is deceptive." },
    { id: "fc4-25", front: "NCERT Numerical: Light from air hits glass (n=1.5) at 30°. Find angle of refraction.",
      back: "Snell's Law: n₁ sin i = n₂ sin r. 1 × sin 30° = 1.5 × sin r. sin r = 0.5/1.5 = 0.333. r = sin⁻¹(0.333) ≈ 19.47°. The ray bends toward the normal as expected (denser medium)." },
    { id: "fc4-26", front: "What is the formula for lateral displacement in a glass slab?",
      back: "d = t × sin(i − r) / cos(r), where t = thickness of slab, i = angle of incidence, r = angle of refraction (inside glass). Key insight: when i = 0°, r = 0° → d = 0 (no lateral shift for normal incidence)." },
    { id: "fc4-27", front: "Why does a straw in a glass of water appear broken at the surface?",
      back: "Light from the submerged part refracts when exiting from water (denser) to air (rarer), bending away from the normal. Our eyes/brain assumes straight-line propagation → perceives the straw part in water at a different (elevated) position → appears 'broken' at the surface." },
    { id: "fc4-28", front: "What is meant by 'optically rarer' and 'optically denser'?",
      back: "Optically denser medium: higher refractive index (n), SLOWER speed of light. Optically rarer medium: lower n, FASTER speed of light. Important: optically denser ≠ physically/mechanically denser. Water is physically denser than oil, but oil (n=1.46) is optically denser than water (n=1.33)." },
    { id: "fc4-29", front: "Prove that angle of incidence = angle of emergence for a glass slab.",
      back: "Entry: n_air sin i = n_glass sin r (Snell's Law, surface 1). Exit: n_glass sin r = n_air sin e (Snell's Law, surface 2, parallel surfaces so same r). Comparing both: sin i = sin e → i = e. ∴ Emergent ray is parallel to incident ray." },
    { id: "fc4-30", front: "HOTS: Why do swimming pools look shallower and what is the consequence?",
      back: "Apparent depth = Real depth/n. For water n=1.33, apparent depth ≈ 0.75 × real depth. A pool that is 2 m deep looks only 1.5 m deep. This is dangerous for non-swimmers who underestimate depth. Also causes a coin at the bottom to appear raised by about 25% of actual depth." },
  ],

  /* ─────────────────────────────────────────────────────────────
   * Topic 5: Image Formation by Lenses (22 cards)
   * ───────────────────────────────────────────────────────────── */
  "image-formation-by-lenses": [
    { id: "fc5-1",  front: "What is a Convex (Biconvex) Lens?",
      back: "A lens that is thicker at the centre and thinner at the edges. It CONVERGES parallel rays of light to a focus. Also called a converging lens. f is POSITIVE." },
    { id: "fc5-2",  front: "What is a Concave (Biconcave) Lens?",
      back: "A lens that is thinner at the centre and thicker at the edges. It DIVERGES parallel rays of light, making them appear to come from a virtual focus. f is NEGATIVE." },
    { id: "fc5-3",  front: "What is the Optical Centre (O)?",
      back: "The central point of the lens. A ray passing through the optical centre goes STRAIGHT through without any deviation or change in direction, regardless of angle." },
    { id: "fc5-4",  front: "What is the Principal Focus of a Convex Lens (F₂)?",
      back: "The point on the principal axis on the other side of the lens where rays parallel to the axis ACTUALLY converge after refraction. This is the REAL focus. f₂ is positive." },
    { id: "fc5-5",  front: "What is the Principal Focus of a Concave Lens (F₁)?",
      back: "The point on the principal axis on the SAME side as the incident rays from which diverged rays APPEAR to come after refraction. This is a VIRTUAL focus. f is negative." },
    { id: "fc5-6",  front: "3 Rules for drawing lens ray diagrams?",
      back: "1. Parallel to axis → refracts through F₂ (convex) or appears from F₁ (concave). 2. Through optical centre O → passes straight. 3. Through F₁ (convex) → refracts parallel to axis." },
    { id: "fc5-7",  front: "Convex lens: Object at ∞ → Image?",
      back: "At F₂. Real, inverted, highly diminished (point-sized). Used in cameras (far object → small image on film)." },
    { id: "fc5-8",  front: "Convex lens: Object beyond 2F₁ → Image?",
      back: "Between F₂ and 2F₂. Real, inverted, DIMINISHED. |m| < 1. Used in cameras and the human eye." },
    { id: "fc5-9",  front: "Convex lens: Object at 2F₁ → Image?",
      back: "At 2F₂. Real, inverted, SAME SIZE. m = −1. Used to produce a same-size real image." },
    { id: "fc5-10", front: "Convex lens: Object between F₁ and 2F₁ → Image?",
      back: "Beyond 2F₂. Real, inverted, ENLARGED. |m| > 1. Used in projectors and slide/movie projectors." },
    { id: "fc5-11", front: "Convex lens: Object at F₁ → Image?",
      back: "At infinity (∞). Highly enlarged. Used in searchlights — object at F₁ produces a parallel beam of light." },
    { id: "fc5-12", front: "Convex lens: Object between O and F₁ → Image?",
      back: "On the SAME SIDE as the object (behind lens from viewer perspective). Virtual, erect, ENLARGED. Used in magnifying glasses." },
    { id: "fc5-13", front: "Concave lens: ALWAYS forms what type of image?",
      back: "ALWAYS: Virtual, Erect, Diminished. Regardless of object position. Image is always between F₁ and O on the same side as the object." },
    { id: "fc5-14", front: "What is a Magnifying Glass? How does it work?",
      back: "A simple convex lens. Object placed between O and F → virtual, erect, enlarged image seen through the lens. Angular magnification = D/f where D = 25 cm (near point)." },
    { id: "fc5-15", front: "Analogy: Concave lens ↔ which mirror? Convex lens ↔ which mirror?",
      back: "Concave lens ↔ Convex mirror (both: always virtual, erect, diminished). Convex lens ↔ Concave mirror (both: can form real or virtual images depending on object position)." },
    { id: "fc5-16", front: "Define Two Principal Foci of a convex lens.",
      back: "F₁ (first focus): object here → image at ∞. F₂ (second focus): rays parallel to axis converge here. Both are at equal distances f from O (since both sides of lens are symmetric for biconvex)." },
    { id: "fc5-17", front: "What is meant by 'Real image on screen' for a lens?",
      back: "When the image is real, it can be caught on a screen placed at the image position. Real images form when object is beyond F₁ for a convex lens. They are always inverted." },
    { id: "fc5-18", front: "Object 30 cm from convex lens (f = 20 cm). Find image.",
      back: "1/v − 1/u = 1/f. u = −30, f = +20. 1/v = 1/20 + 1/(−30) = 3/60 − 2/60 = 1/60. v = +60 cm. Real, inverted image at 60 cm. m = v/u = 60/(−30) = −2. Enlarged 2×." },
    { id: "fc5-19", front: "Object 10 cm from concave lens (f = −15 cm). Find image.",
      back: "1/v = 1/f + 1/u = 1/(−15) + 1/(−10) = −2/30 − 3/30 = −5/30. v = −6 cm. Virtual, erect. m = v/u = −6/(−10) = +0.6. Diminished." },
    { id: "fc5-20", front: "What is the difference between a real focus and a virtual focus?",
      back: "Real focus: refracted rays actually meet/converge there (convex lens F₂, concave mirror F). Virtual focus: refracted rays appear to come from there but don't actually meet (concave lens F₁, convex mirror F)." },
    { id: "fc5-21", front: "Applications of convex lenses (list 5)?",
      back: "1. Magnifying glasses 2. Camera lenses 3. Microscope objective and eyepiece 4. Telescope objective lens 5. Human eye lens (converging) 6. Spectacles for hyperopia (+ve power)." },
    { id: "fc5-22", front: "Applications of concave lenses (list 3)?",
      back: "1. Spectacles for myopia (short-sightedness) — negative power. 2. Spy holes in doors. 3. Galilean telescope eyepiece. A concave lens as spectacle diverges light so the myopic eye can focus it." },
    { id: "fc5-23", front: "CBSE Board: Object 60 cm from convex lens (f = 20 cm). Find v and m.",
      back: "u = −60, f = +20. 1/v = 1/20 + 1/(−60) = 3/60 − 1/60 = 2/60. v = +30 cm. m = v/u = 30/(−60) = −0.5. Real, inverted, diminished (half the size). Image at 30 cm on the other side of lens." },
    { id: "fc5-24", front: "Convex lens: Object at 2F₁. Verify with lens formula.",
      back: "u = −2f, f = +f. 1/v = 1/f + 1/(−2f) = 1/f − 1/2f = 1/2f. v = +2f = same distance on other side. m = v/u = 2f/(−2f) = −1. Same size, real, inverted. Image at 2F₂." },
    { id: "fc5-25", front: "How is a camera analogous to the human eye?",
      back: "Camera: convex lens (eye lens), film/sensor (retina), aperture (pupil), shutter (eyelid). In both: far object → small image near lens; near object → larger image farther from lens. Camera adjusts lens position; eye adjusts lens curvature (accommodation)." },
    { id: "fc5-26", front: "HOTS: If you double the focal length of a convex lens, what happens to the image of an object at 2F₁?",
      back: "Original: object at 2f → image at 2f (same size). New f = 2f: object is now at 2f = 1×(new f) = F₁. Object at F₁ → image at ∞. The image goes to infinity! This dramatically demonstrates the sensitivity of image position to f near 2F." },
    { id: "fc5-27", front: "What is an erect image vs inverted image in terms of sign of magnification (lens)?",
      back: "For a lens: m = v/u. Object is always on left: u < 0. If virtual image: v < 0 → m = v/u = (−)/(−) = +ve → erect. If real image: v > 0 → m = v/u = (+)/(−) = −ve → inverted. Convex lens (object beyond F) → real, inverted. Between O and F → virtual, erect." },
    { id: "fc5-28", front: "Why is a convex lens called a 'converging lens'?",
      back: "A beam of parallel rays, after passing through a convex lens, all converge to a single point — the principal focus F₂. The lens bends (refracts) each ray toward the optical axis, bringing them together. Counterpart: concave lens diverges parallel rays — called 'diverging lens'." },
    { id: "fc5-29", front: "What are biconvex, plano-convex and concavo-convex lenses?",
      back: "Biconvex: both surfaces bulge outward (most converging). Plano-convex: one flat surface, one convex — still converging. Concavo-convex (meniscus): one convex, one concave surface — can converge or diverge depending on curvatures. Camera zoom lenses use combinations of these." },
    { id: "fc5-30", front: "In a simple microscope (magnifying glass), what is the maximum magnification?",
      back: "m = 1 + D/f, where D = 25 cm (near point), f = focal length in cm. For f = 5 cm: m = 1 + 25/5 = 6×. For f = 2.5 cm: m = 1 + 25/2.5 = 11×. Shorter focal length → higher magnification, but very small lens needed." },
  ],

  /* ─────────────────────────────────────────────────────────────
   * Topic 6: Lens Formula, Magnification & Power (22 cards)
   * ───────────────────────────────────────────────────────────── */
  "lens-formula-and-power": [
    { id: "fc6-1",  front: "Write the Lens Formula.",
      back: "1/v − 1/u = 1/f. Note: this has a MINUS sign (unlike mirror formula 1/v + 1/u = 1/f). All quantities signed per New Cartesian, measured from Optical Centre O." },
    { id: "fc6-2",  front: "Magnification formula for lenses?",
      back: "m = h'/h = v/u. Note: NO negative sign (unlike mirrors where m = −v/u). For real images (u < 0, v > 0): m is negative. For virtual images (u < 0, v < 0): m is positive." },
    { id: "fc6-3",  front: "Sign convention for lenses (key differences from mirrors)?",
      back: "Origin at Optical Centre O (not Pole). f: convex = positive, concave = negative. u: always negative (object on left). v: positive if image on RIGHT, negative if on LEFT." },
    { id: "fc6-4",  front: "What is Power of a Lens?",
      back: "P = 1/f where f is in METRES. Measures the ability of the lens to converge or diverge light. Higher power → shorter focal length → more bending." },
    { id: "fc6-5",  front: "Unit of Power of a Lens?",
      back: "Dioptre (D). 1 D = 1 m⁻¹. 1 D is the power of a lens whose focal length is 1 metre. Named after Johann Heinrich Diopter." },
    { id: "fc6-6",  front: "Power of convex lens: sign? Power of concave lens: sign?",
      back: "Convex: POSITIVE power (+D). Concave: NEGATIVE power (−D). A converging lens has positive power; diverging lens has negative power." },
    { id: "fc6-7",  front: "Convert f = 25 cm to power in Dioptres.",
      back: "P = 1/f(m) = 1/0.25 = +4 D. The lens has a power of +4 Dioptres (positive → convex lens)." },
    { id: "fc6-8",  front: "Convert P = −2.5 D to focal length.",
      back: "f = 1/P = 1/(−2.5) = −0.4 m = −40 cm. Negative focal length → concave (diverging) lens." },
    { id: "fc6-9",  front: "Power of combination of lenses in contact?",
      back: "P_total = P₁ + P₂ + P₃ + … (simple algebraic sum). Equivalently, 1/f_total = 1/f₁ + 1/f₂ + ... . This is why opticians specify spectacle power in dioptres." },
    { id: "fc6-10", front: "Why use Power instead of focal length for eyeglasses?",
      back: "Because powers ADD simply (P = P₁ + P₂), making it easy to combine lenses. A −2 D spectacle corrects myopia needing 2 D less convergence. Also standardizes international prescriptions." },
    { id: "fc6-11", front: "What is Myopia (Short-sightedness)?",
      back: "Defect where the eye can see NEAR objects clearly but FAR objects blurrily. Cause: eyeball too long OR lens too curved → image forms IN FRONT of retina. Correction: CONCAVE lens (−ve power)." },
    { id: "fc6-12", front: "What is Hyperopia/Hypermetropia (Long-sightedness)?",
      back: "Defect where eye can see FAR clearly but NEAR objects blurrily. Cause: eyeball too short OR lens too flat → image forms BEHIND retina. Correction: CONVEX lens (+ve power)." },
    { id: "fc6-13", front: "What is Presbyopia?",
      back: "Age-related hardening of the eye lens, reducing its ability to change shape (accommodate). Both near and far vision affected. Correction: bifocal lenses (concave on top + convex on bottom)." },
    { id: "fc6-14", front: "Object 40 cm from convex lens (f = 25 cm). Verify lens formula.",
      back: "u = −40, f = +25. 1/v = 1/f + 1/u = 1/25 + 1/(−40) = 8/200 − 5/200 = 3/200. v = 200/3 ≈ +66.7 cm. m = v/u = 66.7/(−40) = −1.67. Real, inverted, enlarged 1.67×." },
    { id: "fc6-15", front: "When does a convex lens act like a concave lens?",
      back: "When placed in a denser medium (e.g., glass lens in water). n_lens < n_medium → lens diverges. Also, a concave air-lens in glass converges. Shape and medium refractive indices both matter." },
    { id: "fc6-16", front: "CBSE Numerics: A doctor prescribes −3 D spectacles. What defect?",
      back: "Negative power → concave lens → corrects MYOPIA (short-sightedness). The focal length = 1/(−3) = −0.33 m = −33.3 cm." },
    { id: "fc6-17", front: "A person uses +2 D spectacles. What defect? What is f?",
      back: "Positive power → convex lens → corrects HYPEROPIA (long-sightedness). f = 1/(+2) = +0.5 m = +50 cm." },
    { id: "fc6-18", front: "Two lenses: P₁ = +5D, P₂ = −3D. Combined power and nature?",
      back: "P = P₁ + P₂ = 5 + (−3) = +2 D. Since positive → converging (convex) combination. f = 1/2 = 0.5 m = 50 cm." },
    { id: "fc6-19", front: "What is Dispersion by a Prism?",
      back: "White light splits into VIBGYOR (Violet, Indigo, Blue, Green, Yellow, Orange, Red) because different colours have different refractive indices. Violet (highest n) bends most, Red (lowest n) bends least." },
    { id: "fc6-20", front: "Rainbow formation — which optical phenomenon?",
      back: "Dispersion (splitting into colours) INSIDE water droplets, combined with internal reflection. The different colours emerge at different angles (40–42°). Red at top, violet at bottom of primary rainbow." },
    { id: "fc6-21", front: "Relation between focal lengths of two lenses in contact?",
      back: "1/F = 1/f₁ + 1/f₂. Or equivalently P = P₁ + P₂. This is derived by applying the lens formula sequentially, where the image of the first lens acts as the virtual object for the second." },
    { id: "fc6-22", front: "If a convex lens (f = 30 cm) and concave lens (f = −60 cm) are combined, effective f?",
      back: "1/F = 1/30 + 1/(−60) = 2/60 − 1/60 = 1/60. F = +60 cm. P = 1/0.6 ≈ +1.67 D. The combination is still converging but weaker than the convex lens alone." },
    { id: "fc6-23", front: "What is the power of the human eye lens? Does it change?",
      back: "At rest (far vision): P ≈ 59 D total (cornea ≈ 43D + lens ≈ 16D). For near vision (25 cm): total P increases to ≈ 70D by accommodation (lens thickening). The ability to change power (about 11D range) is called accommodation." },
    { id: "fc6-24", front: "A myopic person can see up to 1.5 m. What power lens corrects this?",
      back: "Need virtual image of ∞ at far point (1.5 m). f = −1.5 m. P = 1/(−1.5) = −0.67 D ≈ −0.7 D. The concave lens diverges the incoming parallel rays so they appear to come from 1.5 m — within the eye's range." },
    { id: "fc6-25", front: "A hypermetropic person's near point is 80 cm. Corrective lens power?",
      back: "Need virtual image of 25 cm object at 80 cm. u = −0.25 m, v = −0.80 m. 1/f = 1/v − 1/u = 1/(−0.80) − 1/(−0.25) = −1.25 + 4 = +2.75. P = +2.75 D (convex lens)." },
    { id: "fc6-26", front: "How do bifocal lenses work?",
      back: "Bifocal = two lens zones in one spectacle. Upper portion: concave (−ve power) for seeing distant objects. Lower portion: convex (+ve power) for reading/near vision. Used by people with presbyopia (both far and near vision defects)." },
    { id: "fc6-27", front: "HOTS: Why is it harder to see underwater without goggles?",
      back: "The eye's cornea provides most focusing power (43D) because air-cornea interface has a large n difference. Underwater, water-cornea interface has almost no n difference (both ≈ 1.33) → cornea contributes ~0D! The eye cannot compensate fully → blurry vision. Goggles restore the air-cornea interface." },
    { id: "fc6-28", front: "Why does a convex lens have positive power and a concave lens negative power?",
      back: "Power P = 1/f. Convex lens: f > 0 → P > 0 (converges light, brings focus closer). Concave lens: f < 0 → P < 0 (diverges light, pushes focus farther away). The sign tells you whether the lens adds (+) or removes (−) converging ability." },
    { id: "fc6-29", front: "CBSE 2024: A lens produces an image on the SAME side as the object. What type of lens?",
      back: "The lens forms a virtual image on the same side as the object. This can be: (a) Concave (diverging) lens — always forms virtual image on same side. (b) Convex lens with object BETWEEN O and F₁ — also forms virtual image on the same side. If no other info: most likely concave lens." },
    { id: "fc6-30", front: "NCERT Numerical: Two lenses of P₁ = +6D and P₂ = −4D. Combined focal length?",
      back: "P = P₁ + P₂ = 6 + (−4) = +2 D. f = 1/P = 1/2 = 0.5 m = 50 cm. The combination is converging (positive power) with f = 50 cm. If P₁ = P₂ = −3D: combined P = −6D, f = −1/6 m = −16.7 cm (diverging)." },
  ],

  /* ─────────────────────────────────────────────────────────────
   * Topic 7: Total Internal Reflection & Optical Fibres (22 cards)
   * ───────────────────────────────────────────────────────────── */
  "total-internal-reflection": [
    { id: "fc7-1",  front: "What is Total Internal Reflection (TIR)?",
      back: "When light travels from a denser medium to a rarer medium and the angle of incidence exceeds the critical angle, 100% of the light is reflected back into the denser medium. No refraction occurs." },
    { id: "fc7-2",  front: "State the TWO conditions necessary for TIR.",
      back: "1. Light must travel from a DENSER medium to a RARER medium (e.g., glass to air). 2. The angle of incidence must be GREATER than the critical angle (i > iₒ). BOTH must hold simultaneously." },
    { id: "fc7-3",  front: "Define Critical Angle (iₒ).",
      back: "The angle of incidence in the denser medium for which the refracted ray in the rarer medium grazes the surface (angle of refraction = 90°). Beyond this angle, TIR occurs." },
    { id: "fc7-4",  front: "Derive the formula for Critical Angle.",
      back: "Apply Snell's Law at critical angle: n₁ sin(iₒ) = n₂ sin(90°). So sin(iₒ) = n₂/n₁. For glass-air: sin(iₒ) = 1/n (where n = refractive index of glass). iₒ = sin⁻¹(1/n)." },
    { id: "fc7-5",  front: "Critical angle of glass (n = 1.5)?",
      back: "sin(iₒ) = 1/1.5 = 2/3 = 0.667. iₒ = sin⁻¹(0.667) ≈ 41.8°. Any ray hitting a glass-air surface at more than 41.8° undergoes TIR." },
    { id: "fc7-6",  front: "Why does diamond sparkle so brilliantly?",
      back: "Diamond has n ≈ 2.42, giving a tiny critical angle of about 24.4°. The gem is cut so nearly all light hitting a facet exceeds this angle → multiple TIRs → light exits only from the top, creating intense sparkle." },
    { id: "fc7-7",  front: "Compare critical angles: Water, Glass, Diamond.",
      back: "Water (n=1.33): iₒ ≈ 48.75°. Glass (n=1.50): iₒ ≈ 41.8°. Diamond (n=2.42): iₒ ≈ 24.4°. Higher refractive index → smaller critical angle → TIR easier to achieve." },
    { id: "fc7-8",  front: "What is a Mirage? Explain using TIR.",
      back: "In deserts, hot air near the ground is less dense (lower n). Light from distant objects curves progressively as it passes through layers of decreasing n, eventually exceeding the critical angle → TIR. Observer sees an inverted sky image on the 'ground' — looks like water." },
    { id: "fc7-9",  front: "Describe the structure of an optical fibre.",
      back: "Core: thin glass/plastic rod with high refractive index n₁. Cladding: outer layer with lower n₂ (n₁ > n₂) so TIR occurs. Buffer jacket: protective outer plastic coating. Light enters one end and TIR keeps it confined to the core along its entire length." },
    { id: "fc7-10", front: "How does light propagate through an optical fibre?",
      back: "Light enters at an angle > critical angle at the core-cladding interface → TIR. Every time light hits the boundary, it is totally internally reflected. The signal bounces along the core from one end to the other with virtually no loss, even through bends." },
    { id: "fc7-11", front: "Advantages of optical fibres over copper cables?",
      back: "1. Much higher bandwidth (terabits/s). 2. Very low signal loss — transmit over km without amplifiers. 3. Immune to electromagnetic interference (EMI). 4. Secure — cannot tap without breaking the fibre. 5. Lightweight. 6. No short-circuit risk." },
    { id: "fc7-12", front: "Medical use of optical fibres?",
      back: "Endoscopes: a bundle of fibres guides light into the body cavity (illumination bundle) and transmits the image back (imaging bundle). Enables non-invasive internal examination of stomach, intestine, lungs, joints." },
    { id: "fc7-13", front: "Why is a prism periscope better than a mirror periscope?",
      back: "A 45°-90°-45° prism uses TIR at its hypotenuse (45° > iₒ of glass ≈ 41.8°) → 100% light reflection. A silver mirror reflects only ~95% and tarnishes over time. Prism: brighter image, no maintenance." },
    { id: "fc7-14", front: "What happens when i = iₒ exactly?",
      back: "The refracted ray travels along the surface (r = 90°). This is the borderline case. Practically, a very faint refracted beam grazes the interface. Just above this angle, full TIR begins." },
    { id: "fc7-15", front: "What is Snell's Window?",
      back: "From underwater, the entire above-water world is visible through a circular cone (half-angle = 48.75° for water). Outside this cone, the surface looks like a perfect mirror due to TIR. Also called 'cone of silence' or 'Snell's window'." },
    { id: "fc7-16", front: "Why does an air bubble in glass appear silvery?",
      back: "The air inside has n = 1 (rarer) while glass has n ≈ 1.5 (denser). Light traveling in glass hits the glass-air interface of the bubble at angles exceeding the critical angle → TIR → bubble reflects light brilliantly, appearing silver." },
    { id: "fc7-17", front: "Can TIR occur when light goes from air to glass?",
      back: "NO. TIR only occurs when light travels from a DENSER medium to a RARER medium. Air (n=1) to glass (n=1.5): light goes from rarer to denser → it bends toward the normal → refraction, not TIR." },
    { id: "fc7-18", front: "What is the relation between critical angle and refractive index?",
      back: "sin(iₒ) = 1/n (for medium vs air). So n = 1/sin(iₒ). Higher n → smaller sin(iₒ) → smaller iₒ. A denser material has a smaller critical angle, making TIR easier to trigger." },
    { id: "fc7-19", front: "HOTS: Why do optical fibres work even when bent?",
      back: "As long as the bend radius is not too sharp, the angle of incidence at the core-cladding interface remains > critical angle at every point. TIR continues around bends. Very sharp bends can couple light out — hence minimum bend radius specifications for fibre optic cables." },
    { id: "fc7-20", front: "CBSE Exam: A ray in glass (n=1.5) hits glass-air interface at 45°. TIR or refraction?",
      back: "Critical angle = sin⁻¹(1/1.5) ≈ 41.8°. Given angle = 45° > 41.8° → TIR occurs. The ray is totally internally reflected; no refracted ray enters air." },
    { id: "fc7-21", front: "CBSE Exam: Calculate critical angle for a medium with n = √2.",
      back: "sin(iₒ) = 1/n = 1/√2 = 0.707. iₒ = sin⁻¹(0.707) = 45°. So the critical angle is exactly 45° for a medium of refractive index √2 (≈ 1.414)." },
    { id: "fc7-22", front: "Applications of TIR — list at least 5.",
      back: "1. Optical fibres (internet, telecom, medical). 2. Prism periscopes (submarines, binoculars). 3. Diamond cutting (gem sparkle). 4. Road reflectors/cat's eyes. 5. Endoscopes. 6. LASIK eye surgery guides. 7. Rear reflectors on vehicles. 8. Mirage (natural phenomenon)." },
    { id: "fc7-23", front: "How do cat's eyes on roads use TIR?",
      back: "Road cat's-eye reflectors contain two small glass prisms (45°-90°-45°). Light from headlights enters the prism and hits the hypotenuse at 45° > critical angle (~41.8°) → TIR → reflects straight back to the driver. More efficient than silvered mirrors and self-cleaning (rain washes them)." },
    { id: "fc7-24", front: "Why is TIR used in binoculars and not flat mirrors?",
      back: "Binoculars use two 45°-90°-45° Porro prisms instead of flat mirrors. Benefits: 100% light transmission (TIR vs ~95% from silvered mirrors), more compact design (prisms fold the light path, shortening the instrument), no tarnishing, image is erect. Also shortens the tube length significantly." },
    { id: "fc7-25", front: "CBSE: Does TIR occur for sound waves also?",
      back: "Yes! Acoustic TIR occurs when sound travels from a denser medium to a rarer one at a high angle. Example: sound from deep ocean water traveling toward the warmer surface layer can undergo TIR and stay within the deep ocean SOFAR channel, enabling communication over thousands of km by whales and submarines." },
    { id: "fc7-26", front: "Numerical: A medium has n = 1.732. Calculate its critical angle.",
      back: "sin(iᶜ) = 1/n = 1/1.732 = 0.577. iᶜ = sin⁻¹(0.577) ≈ 35.26°. Note: 1.732 ≈ √3, and sin 30° = 0.5, sin 35° ≈ 0.574. So critical angle ≈ 35.3°. Any ray hitting at >35.3° will undergo TIR." },
    { id: "fc7-27", front: "Explain Looming (Arctic Mirage) using TIR.",
      back: "In polar regions, cold air near the surface is denser. Warm air above is less dense. Light from distant ships bends gradually through increasing rarer layers → eventually TIR occurs → observer sees the ship floating above the horizon (looming) or inverted in the sky. Opposite of desert mirage." },
    { id: "fc7-28", front: "Why don't optical fibres need to be straight to transmit light?",
      back: "TIR occurs at EVERY point where light hits the core-cladding boundary, regardless of the fiber's local curvature — as long as the angle of incidence exceeds the critical angle at each point. Light 'zigzags' along the fiber, following its bends. Only very sharp bends (< minimum bend radius) can break TIR." },
    { id: "fc7-29", front: "What is numerical aperture (NA) of an optical fiber?",
      back: "NA = sin(θ_max) = √(n₁² − n₂²), where θ_max is the maximum angle at which light enters the fibre and still undergoes TIR (the acceptance cone). Higher NA → accepts light from a wider cone → easier to couple light in but more signal dispersion. Single-mode fibres have low NA." },
    { id: "fc7-30", front: "HOTS: If critical angle of glass is 41.8°, can a glass cube TOTALLY reflect a ray hitting its face at 45°?",
      back: "Yes. If the ray hits the glass-air interface at 45° > critical angle (41.8°), TIR occurs. This is exactly how right-angle prisms work in cameras, binoculars, and periscopes. The 45° geometry guarantees TIR for any glass with n ≥ 1/sin(45°) = √2 ≈ 1.414, which most optical glass satisfies." },
  ],

  /* ─────────────────────────────────────────────────────────────
   * Topic 8: Dispersion, Scattering, Atmosphere & Human Eye (22 cards)
   * ───────────────────────────────────────────────────────────── */
  "dispersion-and-human-eye": [
    { id: "fc8-1",  front: "What is Dispersion of Light?",
      back: "The splitting of white light into its constituent colours (VIBGYOR) when it passes through a prism. Caused by different wavelengths having different refractive indices — violet has highest n and bends most, red has lowest n and bends least." },
    { id: "fc8-2",  front: "What is the order of colours in the visible spectrum? Which bends most/least?",
      back: "VIBGYOR: Violet, Indigo, Blue, Green, Yellow, Orange, Red. Violet bends MOST (highest n ≈ 1.530 in glass). Red bends LEAST (lowest n ≈ 1.515 in glass). Remember: 'VIBGYOR' — first bends most, last bends least." },
    { id: "fc8-3",  front: "Why does a prism disperse white light?",
      back: "White light = mixture of all colours. Each colour has a different wavelength → different refractive index in glass (n ∝ 1/λ roughly). Different n → different bending by Snell's Law → colours separate spatially." },
    { id: "fc8-4",  front: "How can you recombine the spectrum back to white light?",
      back: "1. Use a second inverted prism — it recombines VIBGYOR → white light. 2. Spin a Newton's colour disc (sectors coloured VIBGYOR) at high speed → appears white due to persistence of vision." },
    { id: "fc8-5",  front: "Explain Primary Rainbow formation.",
      back: "Sunlight enters a spherical water droplet → refracts + disperses. Inside the droplet: ONE total internal reflection. Then exits → second refraction. Red light exits at 42°, violet at 40°. Red appears at top, violet at bottom. Sun must be behind the observer." },
    { id: "fc8-6",  front: "How does Secondary Rainbow differ from Primary?",
      back: "Secondary: TWO total internal reflections inside the droplet. Colours are REVERSED: violet at top (53°), red at bottom (51°). It appears above the primary rainbow. Dimmer because energy is lost at each reflection. Dark Alexander's band lies between the two." },
    { id: "fc8-7",  front: "State Rayleigh's Law of Scattering.",
      back: "Intensity of scattered light ∝ 1/λ⁴. Shorter wavelengths scatter far more than longer ones. Blue light (λ ≈ 450 nm) scatters ~5.5× more than red light (λ ≈ 700 nm). This explains sky colour, sunset colour, etc." },
    { id: "fc8-8",  front: "Why is the sky blue?",
      back: "Air molecules (O₂, N₂) are tiny — they scatter light via Rayleigh scattering (∝ 1/λ⁴). Blue light has short wavelength → scattered most → fills the entire sky. Red and orange scatter little → pass straight through." },
    { id: "fc8-9",  front: "Why does the sun appear red/orange at sunrise and sunset?",
      back: "At horizon, sunlight travels through maximum atmosphere thickness. Blue, violet, green scatter away en route. Only longer wavelengths (red, orange) reach the observer → sun looks red/orange. At noon, path is short → white/yellow sun." },
    { id: "fc8-10", front: "Why are clouds white?",
      back: "Cloud droplets are much larger than air molecules (>1 µm). Large particles → Mie scattering → all wavelengths scattered EQUALLY. All colours together → white cloud. (Rayleigh applies to small particles; Mie to large ones.)" },
    { id: "fc8-11", front: "Why are danger signals (traffic lights, vehicles) RED?",
      back: "Red has the longest wavelength → scattered LEAST by fog and atmospheric particles. It travels farthest before being scattered/absorbed. So red signals remain visible even in poor visibility conditions from long distances." },
    { id: "fc8-12", front: "What is the Tyndall Effect?",
      back: "When light passes through a colloidal solution or suspension, the path of the beam becomes visible when viewed from the side, because colloidal particles scatter light. Examples: dusty room sunbeam, foggy headlights, blue eye colour. Shorter λ scattered more." },
    { id: "fc8-13", front: "Why do stars twinkle but planets do not?",
      back: "Stars are point sources of light. Turbulent atmospheric layers with varying density/temperature refract starlight differently moment to moment → intensity fluctuates → twinkling. Planets are extended discs; fluctuations from different points average out → steady light." },
    { id: "fc8-14", front: "Why can we see the sun about 2 minutes before actual sunrise?",
      back: "Atmospheric refraction: atmosphere is denser near the ground. Sunlight bends (refracts) as it enters the atmosphere — it curves toward the earth. So the image of the sun is visible above the horizon even when the actual sun is still below it." },
    { id: "fc8-15", front: "Name the main parts of the human eye and their functions.",
      back: "Cornea: focuses most light. Iris: controls pupil size (light entry). Lens: fine-focuses (accommodation). Retina: converts light to nerve signals. Rods: dim light/B&W vision. Cones: colour vision. Fovea: sharpest vision. Optic nerve: carries signals to brain." },
    { id: "fc8-16", front: "What is Accommodation of the Eye?",
      back: "The ability of the eye to adjust its focal length by changing the shape of the crystalline lens. Ciliary muscles contract → lens becomes more curved (shorter f) for near objects. Muscles relax → lens becomes flatter (longer f) for distant objects." },
    { id: "fc8-17", front: "Near point and Far point of a normal human eye?",
      back: "Near point: 25 cm (Least Distance of Distinct Vision). Objects closer than 25 cm appear blurry. Far point: infinity. A normal eye can see clearly from 25 cm to ∞ using accommodation." },
    { id: "fc8-18", front: "What is Myopia? Cause and correction.",
      back: "Myopia (short-sightedness): near vision OK, far vision blurry. Cause: eyeball too long OR lens too converging → image forms in front of retina. Far point < ∞. Correction: CONCAVE lens with power P = −1/far-point(m) D." },
    { id: "fc8-19", front: "What is Hypermetropia? Cause and correction.",
      back: "Hypermetropia (long-sightedness): far vision OK, near vision blurry (near point > 25 cm). Cause: eyeball too short OR lens too flat → image forms behind retina. Correction: CONVEX lens whose virtual image of close object falls at person's actual near point." },
    { id: "fc8-20", front: "What is Presbyopia? Who gets it? How is it corrected?",
      back: "Age-related defect (40+): ciliary muscles weaken and crystalline lens hardens → reduced accommodation range. Near point recedes, may also have distant vision problems. Correction: bifocal lenses — upper half concave (far), lower half convex (near)." },
    { id: "fc8-21", front: "CBSE Numerics: A myopic person's far point is 2 m. Required corrective lens power?",
      back: "Need concave lens to form virtual image of ∞ at 2 m. f = −2 m. P = 1/f = 1/(−2) = −0.5 D. Prescribe −0.5 D concave lens." },
    { id: "fc8-22", front: "CBSE Numerics: A hypermetropic person's near point is 1 m. Corrective lens power?",
      back: "Need convex lens to form virtual image of object at 25 cm at the person's near point 1 m. Using lens formula: 1/v − 1/u = 1/f → u = −0.25 m, v = −1.0 m. 1/f = 1/(−1) − 1/(−0.25) = −1 + 4 = +3. P = +3 D." },
    { id: "fc8-23", front: "Why is the sky on the moon black even during 'day'?",
      back: "The moon has no atmosphere. Without air molecules, there is no Rayleigh scattering. Blue light cannot be scattered in all directions to fill the 'sky'. So even with the sun up, the sky appears black. Stars are visible during the day on the moon for the same reason." },
    { id: "fc8-24", front: "What is Newton's colour disc and what does it demonstrate?",
      back: "A disc divided into 7 sectors coloured VIBGYOR in the ratio of their wavelengths. When spun rapidly, due to persistence of vision, the sectors blend together and the disc appears WHITE (or light grey). Demonstrates that white light is a mixture of all spectral colours — Newton's synthesis experiment." },
    { id: "fc8-25", front: "Why does smoke from a chimney appear blue in sunlight but white against the sky?",
      back: "Smoke contains tiny particles (~100 nm) → Rayleigh-like scattering. Against dark background: scattered (blue) light is seen → smoke appears bluish. Against bright sky: transmitted (red-orange) light is seen → smoke appears whitish/reddish. Same Tyndall effect as milk in water." },
    { id: "fc8-26", front: "What is Alexander's Dark Band in a rainbow?",
      back: "Between the primary rainbow (42°) and secondary rainbow (51°), the sky appears noticeably darker — this is Alexander's Dark Band. Inside primary: sky brighter (light scattered toward observer). Outside secondary: also brighter. Between: no light reaches the observer from these angles → dark band." },
    { id: "fc8-27", front: "Why does the setting sun appear LARGER than when overhead?",
      back: "At the horizon, the sun appears oval/larger due to differential atmospheric refraction. The bottom of the sun is refracted more than the top (longer path through atmosphere). This vertical compression makes it appear oval. The angular diameter is actually the SAME; it's an illusion enhanced by foreground objects at the horizon." },
    { id: "fc8-28", front: "What is Astigmatism? How is it corrected?",
      back: "Astigmatism: the cornea or lens has different curvatures in different planes (not perfectly spherical). This means horizontal and vertical lines focus at different distances → images appear distorted/blurry in specific orientations. Correction: cylindrical lens (curved in only one direction) to compensate for the unequal curvatures." },
    { id: "fc8-29", front: "HOTS: Why do deep-sea fish eyes glow in photographs?",
      back: "Fish have a tapetum lucidum — a reflective layer behind the retina. Light passes through the retina, hits the tapetum, reflects back through the retina (double exposure → better night vision). Camera flash illuminates this reflective layer, which reflects light directly back into the camera lens → glowing 'eye shine'. Same principle: cat, dog eye shine at night." },
    { id: "fc8-30", front: "Explain why the Hubble Space Telescope is better than ground-based telescopes.",
      back: "Hubble orbits above Earth's atmosphere, so: 1. No atmospheric refraction blurring. 2. No twinkling (scintillation). 3. No absorption of UV/IR by atmosphere. 4. No light pollution. It can observe wavelengths (UV, near-IR) that the atmosphere blocks. Resolution is diffraction-limited only, not atmosphere-limited." },
  ],

  /* ─────────────────────────────────────────────────────────────
   * Topic 9: Numericals & Advanced Optical Concepts (20 cards)
   * ───────────────────────────────────────────────────────────── */
  "topic-9-numericals-advanced": [
    { id: "fc9-1",  front: "New Cartesian Sign Convention — 7 Rules?",
      back: "1. Pole/Optical Center at origin. 2. Object ALWAYS left → u ALWAYS negative. 3. Light travels left→right. 4. Distances right of pole: POSITIVE. 5. Distances left: NEGATIVE. 6. Heights above axis: POSITIVE. 7. Heights below: NEGATIVE." },
    { id: "fc9-2",  front: "Mirror Formula?",
      back: "1/v + 1/u = 1/f. Also: f = R/2. Where v = image distance, u = object distance, f = focal length. BOTH u and f for concave mirror are negative. Magnification m = -v/u." },
    { id: "fc9-3",  front: "Lens Formula?",
      back: "1/v - 1/u = 1/f. Note the MINUS sign (unlike mirror formula which has plus). Power P = 1/f (f in metres). For convex lens: f positive. For concave: f negative. Magnification m = v/u (no negative sign for lenses)." },
    { id: "fc9-4",  front: "Sign of focal length: all 4 cases?",
      back: "Concave mirror: f NEGATIVE (real focus, in front). Convex mirror: f POSITIVE (virtual focus, behind). Convex lens: f POSITIVE (real focus, on far side). Concave lens: f NEGATIVE (virtual focus, same side as object)." },
    { id: "fc9-5",  front: "Numerical strategy: mirror problem setup?",
      back: "Step 1: Identify mirror type (concave/convex). Step 2: Assign signs (u=negative, f=negative for concave). Step 3: Apply 1/v + 1/u = 1/f. Step 4: Solve for unknown. Step 5: m = -v/u, interpret sign (+ = virtual/erect, - = real/inverted)." },
    { id: "fc9-6",  front: "Example: Concave mirror f=-10cm, object at u=-30cm. Find v?",
      back: "1/v + 1/u = 1/f → 1/v + 1/(-30) = 1/(-10) → 1/v = -1/10 + 1/30 = -3/30 + 1/30 = -2/30 = -1/15. v = -15 cm. Real image, 15 cm in front of mirror." },
    { id: "fc9-7",  front: "Example: Convex lens f=+20cm, object at u=-30cm. Find v?",
      back: "1/v - 1/u = 1/f → 1/v - 1/(-30) = 1/20 → 1/v + 1/30 = 1/20 → 1/v = 1/20 - 1/30 = 3/60 - 2/60 = 1/60. v = +60 cm. Real image, 60 cm on far side of lens." },
    { id: "fc9-8",  front: "Power of a lens formula and unit?",
      back: "P = 1/f (where f is in METRES). Unit: Dioptre (D). 1D = 1 m⁻¹. Convex lens: P positive. Concave lens: P negative. f = 20 cm = 0.2 m → P = 1/0.2 = +5 D." },
    { id: "fc9-9",  front: "Combination of lenses in contact: net power?",
      back: "P_net = P₁ + P₂ + P₃ + ... (algebraic sum). Net focal length: 1/f_net = 1/f₁ + 1/f₂. This applies when lenses are in contact (touching). If not in contact, more complex formula needed." },
    { id: "fc9-10", front: "Magnification sign interpretation (mirrors)?",
      back: "m = -v/u. If m is POSITIVE: image is virtual and erect. If m is NEGATIVE: image is real and inverted. |m| > 1: magnified/enlarged. |m| < 1: diminished. |m| = 1: same size." },
    { id: "fc9-11", front: "Magnification sign interpretation (lenses)?",
      back: "m = v/u (NO negative sign for lenses!). If m is POSITIVE: image is virtual and erect (same side as object). If m is NEGATIVE: image is real and inverted. Sizes same as mirrors: |m| > 1 = magnified, etc." },
    { id: "fc9-12", front: "Example: m = -2, u = -15 cm. Find v and f (concave mirror)?",
      back: "m = -v/u → -2 = -v/(-15) → -2 = v/15 → v = -30 cm (real, inverted). 1/f = 1/v + 1/u = 1/(-30) + 1/(-15) = -1/30 - 2/30 = -3/30 = -1/10. f = -10 cm." },
    { id: "fc9-13", front: "Fermat's Principle of Least Time?",
      back: "Light travels from one point to another along the path that takes the LEAST time. This explains BOTH reflection (angle of incidence = angle of reflection gives shortest time) and refraction (Snell's law is the mathematical result of minimizing travel time)." },
    { id: "fc9-14", front: "Object at C (=2f) of concave mirror → image location?",
      back: "When u = -2f, image also forms at v = -2f (i.e., at C). Image is REAL, INVERTED, SAME SIZE (m = -1). This is used in rangefinders and is a symmetric configuration." },
    { id: "fc9-15", front: "Object at F of concave mirror → image?",
      back: "When u = -f, the mirror formula gives 1/v = 1/f - 1/u = -1/f - (-1/f) = 0 → v = ∞. Image forms at infinity. Rays emerge PARALLEL to principal axis. Used in torches, searchlights, car headlights." },
    { id: "fc9-16", front: "Object between F and P of concave mirror → image?",
      back: "When u is between 0 and -f: v comes out POSITIVE → image behind mirror. Virtual, erect, magnified. m > 1 (enlarged). This is how a shaving/makeup mirror works (use as a magnifier)." },
    { id: "fc9-17", front: "Numerical: A man 1.8 m tall stands 3 m from concave mirror f=-2 m. Find image height.",
      back: "1/v + 1/(-3) = 1/(-2) → 1/v = -1/2 + 1/3 = -1/6 → v = -6 m. m = -v/u = -(-6)/(-3) = -2. h' = m × h = -2 × 1.8 = -3.6 m (real, inverted, 3.6 m tall image)." },
    { id: "fc9-18", front: "What is the New Cartesian convention for 'object always on left'?",
      back: "By convention, the incident light always travels from left to right. The object is always placed on the left (in the path of incoming light). Therefore u (object distance from pole/optical center) is ALWAYS negative, in ALL problems." },
    { id: "fc9-19", front: "Concave vs Convex mirror: which one in rear-view mirror? Why?",
      back: "CONVEX mirror. Reason: (1) Always forms virtual, erect, diminished image → driver sees wider field of view. (2) Image is never inverted → no confusion. (3) Image is always in the focal region (behind mirror) regardless of object distance → useful for varying traffic distances." },
    { id: "fc9-20", front: "Concave mirror uses (4 key ones)?",
      back: "1. Shaving/makeup mirror: object between F and P → magnified, erect. 2. Doctor's headmirror/ENT mirror: concave → focuses light onto patient. 3. Solar furnace: parallel sun rays → converge at focus → extreme heat. 4. Torches/headlights: bulb at F → parallel beam emerges." },
  ],
};



export const topicMindMaps: Record<string, { id: string; label: string; children?: any[] }[]> = {

  /* ─────────────────────────────────────────────────────────────
   * Topic 1: Introduction & Laws of Reflection
   * ───────────────────────────────────────────────────────────── */
  "intro-and-laws-of-reflection": [
    {
      id: "mm1-1", label: "Nature of Light", children: [
        { id: "mm1-1a", label: "Electromagnetic wave — no medium needed" },
        { id: "mm1-1b", label: "Speed: c = 3 × 10⁸ m/s in vacuum" },
        {
          id: "mm1-1c", label: "Rectilinear Propagation", children: [
            { id: "mm1-1c1", label: "Travels in straight lines in uniform medium" },
            { id: "mm1-1c2", label: "Evidence: shadows, eclipses, pin-hole camera" },
          ]
        },
        {
          id: "mm1-1d", label: "Types of Objects", children: [
            { id: "mm1-1d1", label: "Luminous: emits own light (sun, bulb, candle)" },
            { id: "mm1-1d2", label: "Non-luminous: reflects light (moon, book, you!)" },
          ]
        },
      ]
    },
    {
      id: "mm1-2", label: "Reflection of Light", children: [
        {
          id: "mm1-2a", label: "Key Rays & Terms", children: [
            { id: "mm1-2a1", label: "Incident ray — hits the surface" },
            { id: "mm1-2a2", label: "Reflected ray — bounces back" },
            { id: "mm1-2a3", label: "Normal — perpendicular to surface at point of incidence" },
            { id: "mm1-2a4", label: "∠i = angle between incident ray and normal" },
            { id: "mm1-2a5", label: "∠r = angle between reflected ray and normal" },
          ]
        },
        {
          id: "mm1-2b", label: "Two Laws of Reflection", children: [
            { id: "mm1-2b1", label: "Law 1: Incident, reflected & normal — same plane" },
            { id: "mm1-2b2", label: "Law 2: ∠i = ∠r (ALWAYS, for any surface)" },
            { id: "mm1-2b3", label: "Apply to: plane AND spherical mirrors" },
          ]
        },
        {
          id: "mm1-2c", label: "Types of Reflection", children: [
            { id: "mm1-2c1", label: "Regular (Specular): smooth surface → parallel reflected rays → image" },
            { id: "mm1-2c2", label: "Diffuse (Irregular): rough surface → scattered rays → no image but visible everywhere" },
          ]
        },
      ]
    },
    {
      id: "mm1-3", label: "Plane Mirror Images", children: [
        { id: "mm1-3a", label: "Virtual — cannot be caught on screen" },
        { id: "mm1-3b", label: "Erect — right side up" },
        { id: "mm1-3c", label: "Same size (m = 1)" },
        { id: "mm1-3d", label: "Laterally inverted — left ↔ right swapped" },
        { id: "mm1-3e", label: "Equidistant — image distance = object distance" },
      ]
    },
    {
      id: "mm1-4", label: "Special Cases", children: [
        { id: "mm1-4a", label: "AMBULANCE written reversed — lateral inversion fix" },
        { id: "mm1-4b", label: "Min. mirror height = h/2 (independent of distance)" },
        { id: "mm1-4c", label: "2 mirrors at θ → n = (360/θ) − 1 images" },
        { id: "mm1-4d", label: "Mirror rotates θ → reflected ray rotates 2θ" },
      ]
    },
  ],

  /* ─────────────────────────────────────────────────────────────
   * Topic 2: Spherical Mirrors
   * ───────────────────────────────────────────────────────────── */
  "concave-convex-mirrors": [
    {
      id: "mm2-1", label: "Spherical Mirror Terminology", children: [
        { id: "mm2-1a", label: "Pole (P) — geometric centre of reflecting surface" },
        { id: "mm2-1b", label: "Centre of Curvature (C) — centre of full sphere" },
        { id: "mm2-1c", label: "Radius of Curvature (R) — sphere radius" },
        { id: "mm2-1d", label: "Principal Axis — line through P and C" },
        { id: "mm2-1e", label: "Focus (F) — where parallel rays converge/appear to diverge" },
        { id: "mm2-1f", label: "Focal Length (f) — PF distance = R/2" },
        { id: "mm2-1g", label: "Aperture — effective diameter of mirror" },
      ]
    },
    {
      id: "mm2-2", label: "Concave Mirror", children: [
        { id: "mm2-2a", label: "Reflecting surface curves INWARDS" },
        { id: "mm2-2b", label: "Converging mirror — brings parallel rays to focus" },
        { id: "mm2-2c", label: "Focus is REAL (reflected rays actually meet)" },
        {
          id: "mm2-2d", label: "6 Object Positions & Images", children: [
            { id: "mm2-2d1", label: "At ∞ → F: real, inv., point-sized" },
            { id: "mm2-2d2", label: "Beyond C → between F&C: real, inv., diminished" },
            { id: "mm2-2d3", label: "At C → at C: real, inv., same size" },
            { id: "mm2-2d4", label: "Between C & F → beyond C: real, inv., enlarged" },
            { id: "mm2-2d5", label: "At F → ∞: image at infinity" },
            { id: "mm2-2d6", label: "Between P & F → behind mirror: virtual, erect, enlarged" },
          ]
        },
        { id: "mm2-2e", label: "Uses: shaving mirror, dentist, headlights, solar furnace" },
      ]
    },
    {
      id: "mm2-3", label: "Convex Mirror", children: [
        { id: "mm2-3a", label: "Reflecting surface curves OUTWARDS" },
        { id: "mm2-3b", label: "Diverging mirror — spreads parallel rays apart" },
        { id: "mm2-3c", label: "Focus is VIRTUAL (behind mirror)" },
        { id: "mm2-3d", label: "ALWAYS: Virtual + Erect + Diminished" },
        { id: "mm2-3e", label: "Wider field of view than plane mirror" },
        { id: "mm2-3f", label: "Uses: rear-view mirrors, security mirrors" },
      ]
    },
    {
      id: "mm2-4", label: "3 Principal Rays for Ray Diagrams", children: [
        { id: "mm2-4a", label: "Ray 1: Parallel to axis → through F after reflection" },
        { id: "mm2-4b", label: "Ray 2: Through F → parallel to axis after reflection" },
        { id: "mm2-4c", label: "Ray 3: Through C → retraces path (hits normally, ∠i=0)" },
      ]
    },
  ],

  /* ─────────────────────────────────────────────────────────────
   * Topic 3: Mirror Formula & Magnification
   * ───────────────────────────────────────────────────────────── */
  "mirror-formula-and-magnification": [
    {
      id: "mm3-1", label: "New Cartesian Sign Convention", children: [
        { id: "mm3-1a", label: "ORIGIN = Pole P of mirror" },
        { id: "mm3-1b", label: "Incident light: left → right (positive direction)" },
        {
          id: "mm3-1c", label: "Sign Rules", children: [
            { id: "mm3-1c1", label: "Object distance u: ALWAYS negative" },
            { id: "mm3-1c2", label: "Concave mirror f: NEGATIVE" },
            { id: "mm3-1c3", label: "Convex mirror f: POSITIVE" },
            { id: "mm3-1c4", label: "Real image v: NEGATIVE (in front of mirror)" },
            { id: "mm3-1c5", label: "Virtual image v: POSITIVE (behind mirror)" },
            { id: "mm3-1c6", label: "Height above axis: POSITIVE" },
            { id: "mm3-1c7", label: "Height below axis: NEGATIVE" },
          ]
        },
      ]
    },
    {
      id: "mm3-2", label: "Mirror Formula", children: [
        { id: "mm3-2a", label: "1/v + 1/u = 1/f" },
        { id: "mm3-2b", label: "v = image distance from P" },
        { id: "mm3-2c", label: "u = object distance from P" },
        { id: "mm3-2d", label: "f = focal length = R/2" },
      ]
    },
    {
      id: "mm3-3", label: "Magnification m", children: [
        { id: "mm3-3a", label: "m = h'/h = −v/u (NOTE: negative sign for mirrors)" },
        {
          id: "mm3-3b", label: "Interpreting m", children: [
            { id: "mm3-3b1", label: "m > 0 → Virtual + Erect" },
            { id: "mm3-3b2", label: "m < 0 → Real + Inverted" },
            { id: "mm3-3b3", label: "|m| > 1 → Enlarged" },
            { id: "mm3-3b4", label: "|m| < 1 → Diminished" },
            { id: "mm3-3b5", label: "|m| = 1 → Same size" },
          ]
        },
      ]
    },
    {
      id: "mm3-4", label: "Common Numericals Checklist", children: [
        { id: "mm3-4a", label: "Step 1: Assign signs to u and f" },
        { id: "mm3-4b", label: "Step 2: Use 1/v = 1/f − 1/u" },
        { id: "mm3-4c", label: "Step 3: Calculate v, determine real/virtual from sign" },
        { id: "mm3-4d", label: "Step 4: Calculate m = −v/u, determine nature" },
        { id: "mm3-4e", label: "Step 5: If h given, find h' = m × h" },
      ]
    },
  ],

  /* ─────────────────────────────────────────────────────────────
   * Topic 4: Laws of Refraction & Refractive Index
   * ───────────────────────────────────────────────────────────── */
  "laws-of-refraction-and-index": [
    {
      id: "mm4-1", label: "Refraction of Light", children: [
        { id: "mm4-1a", label: "Definition: bending of light at medium boundary" },
        { id: "mm4-1b", label: "Cause: change in SPEED of light" },
        {
          id: "mm4-1c", label: "Bending Rules", children: [
            { id: "mm4-1c1", label: "Rarer → Denser: bends TOWARDS normal" },
            { id: "mm4-1c2", label: "Denser → Rarer: bends AWAY from normal" },
            { id: "mm4-1c3", label: "Normal incidence: NO bending (but speed changes)" },
          ]
        },
      ]
    },
    {
      id: "mm4-2", label: "Laws of Refraction", children: [
        { id: "mm4-2a", label: "1st Law: incident ray, refracted ray, normal — same plane" },
        {
          id: "mm4-2b", label: "2nd Law (Snell's Law): n₁ sin θ₁ = n₂ sin θ₂", children: [
            { id: "mm4-2b1", label: "n = c/v (absolute refractive index)" },
            { id: "mm4-2b2", label: "Higher n → denser medium → slower light" },
          ]
        },
      ]
    },
    {
      id: "mm4-3", label: "Refractive Index Values", children: [
        { id: "mm4-3a", label: "Vacuum/Air: n = 1.00" },
        { id: "mm4-3b", label: "Water: n = 1.33" },
        { id: "mm4-3c", label: "Glass (crown): n ≈ 1.52" },
        { id: "mm4-3d", label: "Diamond: n = 2.42 (highest common value)" },
        { id: "mm4-3e", label: "Ice: n = 1.31" },
      ]
    },
    {
      id: "mm4-4", label: "Total Internal Reflection (TIR)", children: [
        { id: "mm4-4a", label: "Conditions: denser → rarer + angle ≥ critical angle" },
        { id: "mm4-4b", label: "Critical angle: sin θ_c = 1/n (for medium-to-air)" },
        {
          id: "mm4-4c", label: "Applications of TIR", children: [
            { id: "mm4-4c1", label: "Optical Fibers: internet, endoscopes" },
            { id: "mm4-4c2", label: "Diamond brilliance (θ_c = 24.4°)" },
            { id: "mm4-4c3", label: "Periscopes and prisms in binoculars" },
            { id: "mm4-4c4", label: "Mirages (hot road optical illusion)" },
          ]
        },
      ]
    },
    {
      id: "mm4-5", label: "Real-Life Refraction Examples", children: [
        { id: "mm4-5a", label: "Bent pencil in water" },
        { id: "mm4-5b", label: "Pool appears shallower (apparent depth = real depth/n)" },
        { id: "mm4-5c", label: "Star twinkling (atmospheric refraction)" },
        { id: "mm4-5d", label: "Sun visible after setting (atmospheric refraction)" },
        { id: "mm4-5e", label: "Lateral displacement in glass slab" },
      ]
    },
  ],

  /* ─────────────────────────────────────────────────────────────
   * Topic 5: Image Formation by Lenses
   * ───────────────────────────────────────────────────────────── */
  "image-formation-by-lenses": [
    {
      id: "mm5-1", label: "Types of Lenses", children: [
        {
          id: "mm5-1a", label: "Convex (Biconvex) Lens", children: [
            { id: "mm5-1a1", label: "Thicker at centre, thinner at edges" },
            { id: "mm5-1a2", label: "Converging lens — f is POSITIVE" },
            { id: "mm5-1a3", label: "Focus is REAL" },
          ]
        },
        {
          id: "mm5-1b", label: "Concave (Biconcave) Lens", children: [
            { id: "mm5-1b1", label: "Thinner at centre, thicker at edges" },
            { id: "mm5-1b2", label: "Diverging lens — f is NEGATIVE" },
            { id: "mm5-1b3", label: "Focus is VIRTUAL" },
          ]
        },
      ]
    },
    {
      id: "mm5-2", label: "Lens Terminology", children: [
        { id: "mm5-2a", label: "Optical Centre O — ray through here: no deviation" },
        { id: "mm5-2b", label: "F₁ (first focus) — object here → image at ∞" },
        { id: "mm5-2c", label: "F₂ (second focus) — parallel rays converge here" },
        { id: "mm5-2d", label: "2F₁, 2F₂ — at twice the focal length" },
      ]
    },
    {
      id: "mm5-3", label: "Convex Lens — 6 Image Positions", children: [
        { id: "mm5-3a", label: "Object at ∞ → F₂: real, inv., point-sized" },
        { id: "mm5-3b", label: "Object beyond 2F₁ → between F₂ & 2F₂: real, inv., dim." },
        { id: "mm5-3c", label: "Object at 2F₁ → at 2F₂: real, inv., same size" },
        { id: "mm5-3d", label: "Object between F₁ & 2F₁ → beyond 2F₂: real, inv., enlarged" },
        { id: "mm5-3e", label: "Object at F₁ → at ∞: image at infinity" },
        { id: "mm5-3f", label: "Object between O & F₁ → same side: virtual, erect, enlarged" },
      ]
    },
    {
      id: "mm5-4", label: "Concave Lens", children: [
        { id: "mm5-4a", label: "ALWAYS: Virtual + Erect + Diminished" },
        { id: "mm5-4b", label: "Image always between F₁ and O" },
        { id: "mm5-4c", label: "Object at ∞ → at F₁ (virtual)" },
      ]
    },
    {
      id: "mm5-5", label: "3 Principal Rays for Lens Diagrams", children: [
        { id: "mm5-5a", label: "Ray 1: Parallel to axis → through F₂ (convex) or from F₁ (concave)" },
        { id: "mm5-5b", label: "Ray 2: Through Optical Centre O → straight, no deviation" },
        { id: "mm5-5c", label: "Ray 3: Through F₁ → emerges parallel to axis (convex only)" },
      ]
    },
    {
      id: "mm5-6", label: "Mirror-Lens Analogy", children: [
        { id: "mm5-6a", label: "Convex lens ↔ Concave mirror (both can form real/virtual images)" },
        { id: "mm5-6b", label: "Concave lens ↔ Convex mirror (both always virtual, erect, dim.)" },
      ]
    },
  ],

  /* ─────────────────────────────────────────────────────────────
   * Topic 6: Lens Formula & Power
   * ───────────────────────────────────────────────────────────── */
  "lens-formula-and-power": [
    {
      id: "mm6-1", label: "Lens Formula & Magnification", children: [
        { id: "mm6-1a", label: "Formula: 1/v − 1/u = 1/f (minus sign!)" },
        { id: "mm6-1b", label: "m = h'/h = v/u (no negative sign for lenses)" },
        {
          id: "mm6-1c", label: "Sign Convention for Lenses", children: [
            { id: "mm6-1c1", label: "Origin at Optical Centre O" },
            { id: "mm6-1c2", label: "u: always negative" },
            { id: "mm6-1c3", label: "f: convex = +ve, concave = −ve" },
            { id: "mm6-1c4", label: "v: real image = +ve, virtual = −ve" },
          ]
        },
      ]
    },
    {
      id: "mm6-2", label: "Power of a Lens", children: [
        { id: "mm6-2a", label: "P = 1/f (f in metres). Unit: Dioptre (D)" },
        { id: "mm6-2b", label: "Convex: P = +ve, Concave: P = −ve" },
        { id: "mm6-2c", label: "Short f → High P → More bending" },
        { id: "mm6-2d", label: "P = 100/f (when f is in cm)" },
        {
          id: "mm6-2e", label: "Combination of Lenses", children: [
            { id: "mm6-2e1", label: "P_total = P₁ + P₂ + P₃ ..." },
            { id: "mm6-2e2", label: "Simple addition — easier than 1/F = 1/f₁ + 1/f₂" },
            { id: "mm6-2e3", label: "Used in: microscopes, cameras, telescopes" },
          ]
        },
      ]
    },
    {
      id: "mm6-3", label: "Eye Defects & Corrections", children: [
        {
          id: "mm6-3a", label: "Myopia (Short-sightedness)", children: [
            { id: "mm6-3a1", label: "Sees near, not far clearly" },
            { id: "mm6-3a2", label: "Eyeball too long — image in front of retina" },
            { id: "mm6-3a3", label: "Correction: CONCAVE lens (−ve P)" },
          ]
        },
        {
          id: "mm6-3b", label: "Hyperopia (Long-sightedness)", children: [
            { id: "mm6-3b1", label: "Sees far, not near clearly" },
            { id: "mm6-3b2", label: "Eyeball too short — image behind retina" },
            { id: "mm6-3b3", label: "Correction: CONVEX lens (+ve P)" },
          ]
        },
        { id: "mm6-3c", label: "Presbyopia: age-related, bifocal correction" },
      ]
    },
    {
      id: "mm6-4", label: "Dispersion & Prisms", children: [
        { id: "mm6-4a", label: "Dispersion: white light → VIBGYOR" },
        { id: "mm6-4b", label: "Different colours → different n → different bending" },
        { id: "mm6-4c", label: "Violet: highest n, bends MOST" },
        { id: "mm6-4d", label: "Red: lowest n, bends LEAST" },
        { id: "mm6-4e", label: "Rainbow = dispersion by water droplets" },
      ]
    },
  ],

  /* ─────────────────────────────────────────────────────────────
   * Topic 8: Dispersion, Scattering, Atmosphere & Human Eye (mind map)
   * ───────────────────────────────────────────────────────────── */
  "dispersion-and-human-eye": [
    {
      id: "mm8-1", label: "Dispersion of White Light", children: [
        { id: "mm8-1a", label: "Definition: splitting of white light into VIBGYOR by prism" },
        { id: "mm8-1b", label: "Cause: different wavelengths → different n → different bending" },
        {
          id: "mm8-1c", label: "VIBGYOR Spectrum", children: [
            { id: "mm8-1c1", label: "Violet: highest n (~1.530) → bends MOST" },
            { id: "mm8-1c2", label: "Red: lowest n (~1.515) → bends LEAST" },
            { id: "mm8-1c3", label: "Order: V-I-B-G-Y-O-R (violet at bottom, red at top)" },
          ]
        },
        { id: "mm8-1d", label: "Recombination: 2nd inverted prism / Newton's disc → white" },
      ]
    },
    {
      id: "mm8-2", label: "Rainbow", children: [
        {
          id: "mm8-2a", label: "Primary Rainbow", children: [
            { id: "mm8-2a1", label: "Process: 2 refractions + 1 TIR inside water droplet" },
            { id: "mm8-2a2", label: "Red outside (42°), Violet inside (40°)" },
            { id: "mm8-2a3", label: "Sun behind you, rain in front" },
          ]
        },
        {
          id: "mm8-2b", label: "Secondary Rainbow", children: [
            { id: "mm8-2b1", label: "Process: 2 refractions + 2 TIR → reversed colours" },
            { id: "mm8-2b2", label: "Violet outside (53°), Red inside (51°) — REVERSED" },
            { id: "mm8-2b3", label: "Above primary; dimmer (energy loss in 2 TIRs)" },
            { id: "mm8-2b4", label: "Alexander's dark band between primary and secondary" },
          ]
        },
      ]
    },
    {
      id: "mm8-3", label: "Scattering of Light (Rayleigh)", children: [
        { id: "mm8-3a", label: "Scattering intensity ∝ 1/λ⁴ → shorter λ scattered MORE" },
        { id: "mm8-3b", label: "Blue sky: air molecules scatter blue most → fills sky" },
        { id: "mm8-3c", label: "Red sunset: long path → blue scattered away → red/orange remains" },
        { id: "mm8-3d", label: "White clouds: large droplets → Mie scattering → all colours equally → white" },
        { id: "mm8-3e", label: "Red danger signals: red scattered least → visible in fog from far away" },
        { id: "mm8-3f", label: "Tyndall Effect: scattering makes beam visible from side (dusty room, fog)" },
      ]
    },
    {
      id: "mm8-4", label: "Atmospheric Refraction", children: [
        { id: "mm8-4a", label: "Cause: varying air density (T) → varying n in layers" },
        { id: "mm8-4b", label: "Stars twinkle: point source + turbulent atmosphere → fluctuating intensity" },
        { id: "mm8-4c", label: "Planets steady: extended disc source → fluctuations average out" },
        { id: "mm8-4d", label: "Sunrise/sunset: sun visible ~2 min before/after geometric crossing" },
        { id: "mm8-4e", label: "Flattened sun: bottom edge refracted more than top edge → oval shape" },
      ]
    },
    {
      id: "mm8-5", label: "Human Eye Structure", children: [
        { id: "mm8-5a", label: "Cornea: front transparent curved surface (~70% of focusing)" },
        { id: "mm8-5b", label: "Iris + Pupil: control light entry (constricts in bright light)" },
        { id: "mm8-5c", label: "Crystalline Lens: adjustable biconvex; ciliary muscles change shape" },
        { id: "mm8-5d", label: "Retina: light-sensitive layer; rods (dim light/B&W), cones (colour)" },
        { id: "mm8-5e", label: "Fovea: highest cone density → sharpest vision" },
        { id: "mm8-5f", label: "Blind spot: optic nerve exit, no photoreceptors" },
        { id: "mm8-5g", label: "Accommodation: lens changes focal length for near/far objects" },
        {
          id: "mm8-5h", label: "Normal Eye Ranges", children: [
            { id: "mm8-5h1", label: "Near point: 25 cm (Least Distance of Distinct Vision)" },
            { id: "mm8-5h2", label: "Far point: infinity (relaxed lens focuses here)" },
          ]
        },
      ]
    },
    {
      id: "mm8-6", label: "Defects of Vision & Corrections", children: [
        {
          id: "mm8-6a", label: "Myopia (Short-sightedness)", children: [
            { id: "mm8-6a1", label: "Near clear, Far blurry" },
            { id: "mm8-6a2", label: "Cause: long eyeball OR strong lens" },
            { id: "mm8-6a3", label: "Image forms IN FRONT of retina" },
            { id: "mm8-6a4", label: "Fix: CONCAVE (diverging) lens; P = −1/far-point(m)" },
          ]
        },
        {
          id: "mm8-6b", label: "Hypermetropia (Long-sightedness)", children: [
            { id: "mm8-6b1", label: "Far clear, Near blurry (near point > 25 cm)" },
            { id: "mm8-6b2", label: "Cause: short eyeball OR weak lens" },
            { id: "mm8-6b3", label: "Image forms BEHIND retina" },
            { id: "mm8-6b4", label: "Fix: CONVEX (converging) lens" },
          ]
        },
        {
          id: "mm8-6c", label: "Presbyopia", children: [
            { id: "mm8-6c1", label: "Age-related: ciliary muscles weaken + lens stiffens" },
            { id: "mm8-6c2", label: "Cannot accommodate for near objects" },
            { id: "mm8-6c3", label: "Fix: reading glasses (convex); bifocals if also myopic" },
          ]
        },
        { id: "mm8-6d", label: "Astigmatism: non-spherical cornea → cylindrical lens correction" },
      ]
    },
  ],

  /* ─────────────────────────────────────────────────────────────
   * Topic 7: Total Internal Reflection & Optical Fibres
   * ───────────────────────────────────────────────────────────── */
  "total-internal-reflection": [
    {
      id: "mm7-1", label: "Total Internal Reflection (TIR)", children: [
        { id: "mm7-1a", label: "Definition: Complete reflection into denser medium" },
        { id: "mm7-1b", label: "Condition 1: Denser → Rarer medium" },
        { id: "mm7-1c", label: "Condition 2: Angle of incidence > Critical angle" },
        {
          id: "mm7-1d", label: "Three cases at boundary", children: [
            { id: "mm7-1d1", label: "∠i < iᶜ → Partial refraction + partial reflection" },
            { id: "mm7-1d2", label: "∠i = iᶜ → Refracted ray grazes surface (∠r=90°)" },
            { id: "mm7-1d3", label: "∠i > iᶜ → Total Internal Reflection (100%)" },
          ]
        },
      ]
    },
    {
      id: "mm7-2", label: "Critical Angle", children: [
        { id: "mm7-2a", label: "Definition: ∠i in denser for ∠r = 90° in rarer" },
        { id: "mm7-2b", label: "Formula: sin(iᶜ) = 1/n (medium to air)" },
        { id: "mm7-2c", label: "Formula (two media): sin(iᶜ) = n₂/n₁" },
        {
          id: "mm7-2d", label: "Critical Angles by Material", children: [
            { id: "mm7-2d1", label: "Water: ~48.75° (n=1.33)" },
            { id: "mm7-2d2", label: "Glass: ~41.8° (n=1.50)" },
            { id: "mm7-2d3", label: "Diamond: ~24.4° (n=2.42)" },
            { id: "mm7-2d4", label: "Rule: Higher n → Smaller critical angle" },
          ]
        },
      ]
    },
    {
      id: "mm7-3", label: "Natural Phenomena (TIR)", children: [
        {
          id: "mm7-3a", label: "Desert Mirage", children: [
            { id: "mm7-3a1", label: "Hot air near ground → rarer medium" },
            { id: "mm7-3a2", label: "Light bends → TIR → curves upward" },
            { id: "mm7-3a3", label: "Observer sees sky image on ground (looks like water)" },
          ]
        },
        {
          id: "mm7-3b", label: "Diamond Sparkle", children: [
            { id: "mm7-3b1", label: "Small critical angle (24.4°)" },
            { id: "mm7-3b2", label: "Multiple TIR inside gem" },
            { id: "mm7-3b3", label: "Light channels upward through top facets" },
          ]
        },
        { id: "mm7-3c", label: "Air bubble in glass: TIR → appears shiny/silvery" },
        { id: "mm7-3d", label: "Arctic Looming: cold dense air → inverted mirage above horizon" },
      ]
    },
    {
      id: "mm7-4", label: "Optical Fibres", children: [
        {
          id: "mm7-4a", label: "Structure", children: [
            { id: "mm7-4a1", label: "Core: high n (e.g., 1.55)" },
            { id: "mm7-4a2", label: "Cladding: lower n (e.g., 1.45)" },
            { id: "mm7-4a3", label: "Buffer: protective plastic jacket" },
          ]
        },
        { id: "mm7-4b", label: "Working: TIR at core-cladding boundary" },
        { id: "mm7-4c", label: "Efficiency: 100% (vs mirror's 95%)" },
        {
          id: "mm7-4d", label: "Applications", children: [
            { id: "mm7-4d1", label: "Internet & Telecom (terabits/second)" },
            { id: "mm7-4d2", label: "Medical endoscopes (dual bundle)" },
            { id: "mm7-4d3", label: "Cable TV, industrial sensors" },
          ]
        },
        {
          id: "mm7-4e", label: "Advantages over Copper", children: [
            { id: "mm7-4e1", label: "Higher bandwidth" },
            { id: "mm7-4e2", label: "No EM interference" },
            { id: "mm7-4e3", label: "Less signal loss (100+ km)" },
            { id: "mm7-4e4", label: "Lighter, thinner" },
          ]
        },
      ]
    },
    {
      id: "mm7-5", label: "Prism Periscope", children: [
        { id: "mm7-5a", label: "Right-angle prism (45°-90°-45°)" },
        { id: "mm7-5b", label: "Light hits hypotenuse at 45° > iᶜ (41.8°)" },
        { id: "mm7-5c", label: "TIR turns ray exactly 90°" },
        { id: "mm7-5d", label: "Brighter than plane mirror (100% vs 95%)" },
      ]
    },
  ],

  /* ─────────────────────────────────────────────────────────────
   * Topic 9: Numericals & Advanced Optical Concepts
   * ───────────────────────────────────────────────────────────── */
  "topic-9-numericals-advanced": [
    {
      id: "mm9-1", label: "New Cartesian Sign Convention", children: [
        { id: "mm9-1a", label: "Origin: Pole (mirror) / Optical Centre (lens)" },
        { id: "mm9-1b", label: "Object ALWAYS on left → u ALWAYS negative" },
        { id: "mm9-1c", label: "Positive: right of origin, above axis" },
        { id: "mm9-1d", label: "Negative: left of origin, below axis" },
        {
          id: "mm9-1e", label: "Focal Length Signs", children: [
            { id: "mm9-1e1", label: "Concave mirror: f < 0 (real focus, in front)" },
            { id: "mm9-1e2", label: "Convex mirror: f > 0 (virtual focus, behind)" },
            { id: "mm9-1e3", label: "Convex lens: f > 0 (real focus, far side)" },
            { id: "mm9-1e4", label: "Concave lens: f < 0 (virtual focus, near side)" },
          ]
        },
      ]
    },
    {
      id: "mm9-2", label: "Mirror Formula", children: [
        { id: "mm9-2a", label: "1/v + 1/u = 1/f" },
        { id: "mm9-2b", label: "f = R/2 (radius of curvature relationship)" },
        { id: "mm9-2c", label: "Magnification: m = -v/u (negative sign)" },
        {
          id: "mm9-2d", label: "Interpreting m (mirrors)", children: [
            { id: "mm9-2d1", label: "m > 0 → Virtual + Erect" },
            { id: "mm9-2d2", label: "m < 0 → Real + Inverted" },
            { id: "mm9-2d3", label: "|m| > 1 → Magnified" },
            { id: "mm9-2d4", label: "|m| < 1 → Diminished" },
          ]
        },
      ]
    },
    {
      id: "mm9-3", label: "Lens Formula", children: [
        { id: "mm9-3a", label: "1/v - 1/u = 1/f (NOTE: minus sign)" },
        { id: "mm9-3b", label: "Power: P = 1/f(m), unit = Dioptre (D)" },
        { id: "mm9-3c", label: "Magnification: m = v/u (NO negative sign)" },
        { id: "mm9-3d", label: "Net power: P₁ + P₂ + P₃ (lenses in contact)" },
      ]
    },
    {
      id: "mm9-4", label: "Key Object Positions (Concave Mirror)", children: [
        { id: "mm9-4a", label: "At ∞ → Image at F: point, real, inverted" },
        { id: "mm9-4b", label: "Beyond 2F → Between F & 2F: diminished, real" },
        { id: "mm9-4c", label: "At 2F (=C) → At 2F: same size, real, inverted" },
        { id: "mm9-4d", label: "Between F & 2F → Beyond 2F: magnified, real" },
        { id: "mm9-4e", label: "At F → At ∞: parallel beam (torches!)" },
        { id: "mm9-4f", label: "Between F & P → Behind: virtual, erect, magnified" },
      ]
    },
    {
      id: "mm9-5", label: "Applications & Fermat's Principle", children: [
        { id: "mm9-5a", label: "Fermat: light takes path of LEAST time" },
        { id: "mm9-5b", label: "Concave mirror: makeup mirror, solar furnace, torch" },
        { id: "mm9-5c", label: "Convex mirror: rear-view (wide field), security mirror" },
        { id: "mm9-5d", label: "Convex lens: camera, projector, magnifier" },
        { id: "mm9-5e", label: "Concave lens: myopia correction" },
      ]
    },
  ],
};
