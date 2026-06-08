/**
 * FILE: study-aids.ts
 * LOCATION: src/lib/content/class10/science/light-reflection-and-refraction/study-aids/study-aids.ts
 * PURPOSE: Comprehensive flash cards (20+ per topic) and deep mind maps for all 6 topics
 *          in the Light – Reflection and Refraction chapter.
 *          Used for quick revision, exam preparation, and deep concept retention.
 *
 * STRUCTURE:
 *   - topicFlashCards: Record<topicId, FlashCard[]> — 20–25 cards per topic
 *   - topicMindMaps:   Record<topicId, MindMapNode[]> — hierarchical concept trees
 *
 * LAST UPDATED: 2026-06-08
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
  ],
};

/* ══════════════════════════════════════════════════════════════════
 * MIND MAPS — Deep hierarchical concept trees for all 6 topics
 * ══════════════════════════════════════════════════════════════════ */

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
};
