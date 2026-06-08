/**
 * FILE: study-aids.ts
 * LOCATION: src/lib/content/class10/science/light-reflection-and-refraction/study-aids/study-aids.ts
 * PURPOSE: Contains all flash card and mind map data for every topic in the
 *          Light - Reflection and Refraction chapter. This data enhances
 *          retention by providing quick-revision flash cards and visual
 *          concept maps that students can use for exam preparation.
 *
 * STRUCTURE:
 *   - topicFlashCards: Record of topic ID → array of front/back flash card pairs
 *   - topicMindMaps: Record of topic ID → array of hierarchical mind map nodes
 *
 * USED BY: Each topic file imports its flash cards and mind map from here.
 * LAST UPDATED: 2026-06-08
 */

/* ── Flash Card Data for All 6 Topics ── */

export const topicFlashCards: Record<string, { id: string; front: string; back: string }[]> = {

  /* ─── Topic 1: Introduction & Laws of Reflection ─── */
  "intro-and-laws-of-reflection": [
    { id: "fc1-1", front: "What is Rectilinear Propagation of Light?", back: "Light travels in straight lines in a uniform medium. This is called rectilinear propagation." },
    { id: "fc1-2", front: "What is the angle of incidence?", back: "The angle between the incident ray and the normal at the point of incidence." },
    { id: "fc1-3", front: "State the First Law of Reflection.", back: "The incident ray, the reflected ray, and the normal at the point of incidence all lie in the same plane." },
    { id: "fc1-4", front: "State the Second Law of Reflection.", back: "The angle of incidence (∠i) is always equal to the angle of reflection (∠r). i.e., ∠i = ∠r." },
    { id: "fc1-5", front: "What is a 'Normal' in optics?", back: "An imaginary line drawn perpendicular to the reflecting surface at the point where the incident ray strikes." },
    { id: "fc1-6", front: "Difference: Regular vs Diffused Reflection?", back: "Regular: parallel reflected rays from smooth surface (mirror). Diffused: scattered reflected rays from rough surface (wall)." },
    { id: "fc1-7", front: "What is a Virtual Image?", back: "An image that cannot be captured on a screen. It is formed when reflected/refracted rays appear to diverge from a point." },
    { id: "fc1-8", front: "What is a Real Image?", back: "An image that can be captured on a screen. It is formed when reflected/refracted rays actually converge at a point." },
    { id: "fc1-9", front: "Speed of light in vacuum?", back: "3 × 10⁸ m/s (approximately 300,000 km/s)." },
    { id: "fc1-10", front: "Why can we see non-luminous objects?", back: "Because they reflect light from luminous sources (like the sun) into our eyes." },
  ],

  /* ─── Topic 2: Spherical Mirrors ─── */
  "concave-convex-mirrors": [
    { id: "fc2-1", front: "What is a Concave Mirror?", back: "A spherical mirror whose reflecting surface is curved inwards (like the inside of a spoon). Also called a converging mirror." },
    { id: "fc2-2", front: "What is a Convex Mirror?", back: "A spherical mirror whose reflecting surface is curved outwards (like the back of a spoon). Also called a diverging mirror." },
    { id: "fc2-3", front: "Define 'Pole' of a mirror.", back: "The centre of the reflecting surface (geometric centre). Denoted by P." },
    { id: "fc2-4", front: "Define 'Centre of Curvature'.", back: "The centre of the sphere of which the mirror is a part. Denoted by C." },
    { id: "fc2-5", front: "What is the relationship between f and R?", back: "f = R/2. The focal length is half the radius of curvature." },
    { id: "fc2-6", front: "Where is the image when object is at C (concave mirror)?", back: "Image is at C itself. Real, inverted, and same size as object." },
    { id: "fc2-7", front: "Why are convex mirrors used as rear-view mirrors?", back: "They always form erect, diminished images and have a wider field of view." },
    { id: "fc2-8", front: "Concave mirror: Object at infinity → Image?", back: "Image is at the Focus (F). It is real, inverted, and highly diminished (point-sized)." },
    { id: "fc2-9", front: "When does a concave mirror form a virtual image?", back: "When the object is placed between the Pole (P) and the Focus (F)." },
    { id: "fc2-10", front: "Use of concave mirrors in daily life?", back: "Shaving mirrors, dentist mirrors, headlights, solar concentrators, satellite dishes." },
  ],

  /* ─── Topic 3: Mirror Formula & Magnification ─── */
  "mirror-formula-and-magnification": [
    { id: "fc3-1", front: "Write the Mirror Formula.", back: "1/v + 1/u = 1/f, where v = image distance, u = object distance, f = focal length." },
    { id: "fc3-2", front: "What is Magnification (m)?", back: "m = h'/h = -v/u. The ratio of image height to object height." },
    { id: "fc3-3", front: "Sign convention: Where is the positive direction?", back: "Distances measured in the direction of the incident light (right) are positive. Left is negative." },
    { id: "fc3-4", front: "If m > 1, what does it mean?", back: "The image is enlarged (bigger than the object)." },
    { id: "fc3-5", front: "If m is negative, what does it mean?", back: "The image is real and inverted." },
    { id: "fc3-6", front: "If m is positive, what does it mean?", back: "The image is virtual and erect." },
    { id: "fc3-7", front: "Object at 2F → Image at? (Concave)", back: "Image at 2F. Same size, real, inverted. m = -1." },
    { id: "fc3-8", front: "For a convex mirror, is f positive or negative?", back: "Positive. Focus is behind the mirror (on the same side as the observer)." },
    { id: "fc3-9", front: "For a concave mirror, is f positive or negative?", back: "Negative. Focus is in front of the mirror." },
    { id: "fc3-10", front: "What is the sign of u (object distance)?", back: "Always negative (object is always in front of the mirror, against the sign convention direction)." },
  ],

  /* ─── Topic 4: Laws of Refraction ─── */
  "laws-of-refraction-and-index": [
    { id: "fc4-1", front: "What causes Refraction of Light?", back: "Change in speed of light when passing from one transparent medium to another." },
    { id: "fc4-2", front: "State Snell's Law.", back: "sin i / sin r = constant (Refractive Index). The ratio of sine of angle of incidence to sine of angle of refraction is constant." },
    { id: "fc4-3", front: "What is Absolute Refractive Index?", back: "n = c/v. Ratio of speed of light in vacuum to speed of light in the medium." },
    { id: "fc4-4", front: "Light going from rarer to denser medium bends...?", back: "Towards the normal (angle of refraction < angle of incidence)." },
    { id: "fc4-5", front: "Light going from denser to rarer medium bends...?", back: "Away from the normal (angle of refraction > angle of incidence)." },
    { id: "fc4-6", front: "Refractive index of water?", back: "n = 1.33" },
    { id: "fc4-7", front: "Refractive index of glass?", back: "n = 1.5 (approximately)" },
    { id: "fc4-8", front: "Refractive index of diamond?", back: "n = 2.42 (one of the highest known)" },
    { id: "fc4-9", front: "What is Lateral Displacement?", back: "The perpendicular shift between the original incident ray and the emergent ray after passing through a glass slab." },
    { id: "fc4-10", front: "Why does a pencil look bent in water?", back: "Due to refraction. Light from the underwater part bends away from normal as it enters air, making the pencil appear shifted." },
  ],

  /* ─── Topic 5: Image Formation by Lenses ─── */
  "image-formation-by-lenses": [
    { id: "fc5-1", front: "What is a Convex Lens?", back: "A lens thicker in the middle and thinner at edges. Converges light rays. Also called a converging lens." },
    { id: "fc5-2", front: "What is a Concave Lens?", back: "A lens thinner in the middle and thicker at edges. Diverges light rays. Also called a diverging lens." },
    { id: "fc5-3", front: "What is the Optical Centre?", back: "The central point of a lens. A ray passing through it goes straight without any deviation." },
    { id: "fc5-4", front: "Concave lens ALWAYS forms what type of image?", back: "Virtual, erect, and diminished. Always. Regardless of object position." },
    { id: "fc5-5", front: "When does a convex lens form a virtual image?", back: "When the object is placed between the Optical Centre (O) and the Focus (F₁)." },
    { id: "fc5-6", front: "Object at 2F₁ → Image at? (Convex lens)", back: "At 2F₂. Real, inverted, same size." },
    { id: "fc5-7", front: "What does a magnifying glass use?", back: "A convex lens. Object is placed between O and F₁ to get an enlarged, virtual, erect image." },
    { id: "fc5-8", front: "Concave lens ~ which mirror?", back: "Convex mirror. Both always form virtual, erect, diminished images." },
    { id: "fc5-9", front: "Convex lens ~ which mirror?", back: "Concave mirror. Both can form real/virtual images depending on object position." },
    { id: "fc5-10", front: "Object at infinity → Image at? (Convex lens)", back: "At F₂. Highly diminished, point-sized, real, inverted." },
  ],

  /* ─── Topic 6: Lens Formula & Power ─── */
  "lens-formula-and-power": [
    { id: "fc6-1", front: "Write the Lens Formula.", back: "1/v - 1/u = 1/f. Note: differs from mirror formula by a minus sign." },
    { id: "fc6-2", front: "Magnification formula for lenses?", back: "m = h'/h = v/u. Note: no negative sign unlike mirrors." },
    { id: "fc6-3", front: "What is Power of a Lens?", back: "P = 1/f (where f is in meters). It measures the degree of convergence/divergence." },
    { id: "fc6-4", front: "Unit of Power of a Lens?", back: "Diopter (D). 1 D = 1 m⁻¹." },
    { id: "fc6-5", front: "Power of convex lens is...?", back: "Positive (because f is positive)." },
    { id: "fc6-6", front: "Power of concave lens is...?", back: "Negative (because f is negative)." },
    { id: "fc6-7", front: "Power of combination of lenses?", back: "P = P₁ + P₂ + P₃ + ... (algebraic sum of individual powers)." },
    { id: "fc6-8", front: "If P = +2.0 D, what is the focal length?", back: "f = 1/P = 1/2.0 = 0.5 m = 50 cm. It's a convex lens." },
    { id: "fc6-9", front: "If P = -4.0 D, what is the focal length?", back: "f = 1/P = 1/(-4.0) = -0.25 m = -25 cm. It's a concave lens." },
    { id: "fc6-10", front: "Why use Power instead of focal length for combinations?", back: "Because powers simply add up (P = P₁ + P₂), making calculations much simpler than using 1/F = 1/f₁ + 1/f₂." },
  ],
};

/* ── Mind Map Data for All 6 Topics ── */

export const topicMindMaps: Record<string, { id: string; label: string; children?: any[] }[]> = {

  /* ─── Topic 1: Intro & Laws of Reflection ─── */
  "intro-and-laws-of-reflection": [
    {
      id: "mm1-1", label: "Nature of Light", children: [
        { id: "mm1-1a", label: "Electromagnetic wave — no medium needed" },
        { id: "mm1-1b", label: "Speed: 3 × 10⁸ m/s in vacuum" },
        { id: "mm1-1c", label: "Rectilinear propagation (straight lines)" },
        { id: "mm1-1d", label: "Luminous vs Non-luminous objects" },
      ]
    },
    {
      id: "mm1-2", label: "Reflection of Light", children: [
        { id: "mm1-2a", label: "Incident ray, Reflected ray, Normal" },
        { id: "mm1-2b", label: "Angle of incidence (∠i) & Angle of reflection (∠r)" },
        {
          id: "mm1-2c", label: "Laws of Reflection", children: [
            { id: "mm1-2c1", label: "Law 1: All three rays lie in same plane" },
            { id: "mm1-2c2", label: "Law 2: ∠i = ∠r" },
          ]
        },
        {
          id: "mm1-2d", label: "Types of Reflection", children: [
            { id: "mm1-2d1", label: "Regular (Specular) — smooth surfaces" },
            { id: "mm1-2d2", label: "Diffused (Irregular) — rough surfaces" },
          ]
        },
      ]
    },
    {
      id: "mm1-3", label: "Image Formation", children: [
        { id: "mm1-3a", label: "Real Image: Can be captured on screen" },
        { id: "mm1-3b", label: "Virtual Image: Cannot be captured on screen" },
        { id: "mm1-3c", label: "Plane mirror: Virtual, erect, same size, laterally inverted" },
      ]
    },
  ],

  /* ─── Topic 2: Spherical Mirrors ─── */
  "concave-convex-mirrors": [
    {
      id: "mm2-1", label: "Key Terms", children: [
        { id: "mm2-1a", label: "Pole (P) — center of reflecting surface" },
        { id: "mm2-1b", label: "Centre of Curvature (C)" },
        { id: "mm2-1c", label: "Radius of Curvature (R)" },
        { id: "mm2-1d", label: "Principal Axis" },
        { id: "mm2-1e", label: "Focus (F) — R/2 from pole" },
        { id: "mm2-1f", label: "Aperture — effective diameter" },
      ]
    },
    {
      id: "mm2-2", label: "Concave Mirror", children: [
        { id: "mm2-2a", label: "Converging mirror" },
        {
          id: "mm2-2b", label: "Image Positions", children: [
            { id: "mm2-2b1", label: "Object at ∞ → Image at F (point-sized)" },
            { id: "mm2-2b2", label: "Object beyond C → Image between F and C" },
            { id: "mm2-2b3", label: "Object at C → Image at C (same size)" },
            { id: "mm2-2b4", label: "Object between F and C → Image beyond C" },
            { id: "mm2-2b5", label: "Object at F → Image at ∞" },
            { id: "mm2-2b6", label: "Object between P and F → Virtual, enlarged" },
          ]
        },
        { id: "mm2-2c", label: "Uses: Shaving mirror, headlights, solar furnace" },
      ]
    },
    {
      id: "mm2-3", label: "Convex Mirror", children: [
        { id: "mm2-3a", label: "Diverging mirror" },
        { id: "mm2-3b", label: "Always: Virtual, erect, diminished" },
        { id: "mm2-3c", label: "Uses: Rear-view mirrors, security mirrors" },
      ]
    },
  ],

  /* ─── Topic 3: Mirror Formula ─── */
  "mirror-formula-and-magnification": [
    {
      id: "mm3-1", label: "Sign Convention (Cartesian)", children: [
        { id: "mm3-1a", label: "Origin at Pole (P)" },
        { id: "mm3-1b", label: "Positive: direction of incident light" },
        { id: "mm3-1c", label: "u is always negative" },
        { id: "mm3-1d", label: "f (concave) = negative, f (convex) = positive" },
      ]
    },
    {
      id: "mm3-2", label: "Mirror Formula: 1/v + 1/u = 1/f", children: [
        { id: "mm3-2a", label: "v = image distance" },
        { id: "mm3-2b", label: "u = object distance" },
        { id: "mm3-2c", label: "f = focal length" },
      ]
    },
    {
      id: "mm3-3", label: "Magnification: m = -v/u = h'/h", children: [
        { id: "mm3-3a", label: "m > 0 → Virtual, erect" },
        { id: "mm3-3b", label: "m < 0 → Real, inverted" },
        { id: "mm3-3c", label: "|m| > 1 → Enlarged" },
        { id: "mm3-3d", label: "|m| < 1 → Diminished" },
        { id: "mm3-3e", label: "|m| = 1 → Same size" },
      ]
    },
  ],

  /* ─── Topic 4: Laws of Refraction ─── */
  "laws-of-refraction-and-index": [
    {
      id: "mm4-1", label: "Refraction", children: [
        { id: "mm4-1a", label: "Cause: Change in speed of light" },
        { id: "mm4-1b", label: "Rarer → Denser: Bends towards normal" },
        { id: "mm4-1c", label: "Denser → Rarer: Bends away from normal" },
        { id: "mm4-1d", label: "Perpendicular ray: No bending (speed still changes)" },
      ]
    },
    {
      id: "mm4-2", label: "Snell's Law", children: [
        { id: "mm4-2a", label: "sin i / sin r = constant (n)" },
        { id: "mm4-2b", label: "n₂₁ = v₁ / v₂ (Relative refractive index)" },
        { id: "mm4-2c", label: "n = c / v (Absolute refractive index)" },
      ]
    },
    {
      id: "mm4-3", label: "Important Values", children: [
        { id: "mm4-3a", label: "Water: n = 1.33" },
        { id: "mm4-3b", label: "Glass: n = 1.5" },
        { id: "mm4-3c", label: "Diamond: n = 2.42" },
        { id: "mm4-3d", label: "Air/Vacuum: n ≈ 1.0" },
      ]
    },
    {
      id: "mm4-4", label: "Glass Slab Experiment", children: [
        { id: "mm4-4a", label: "Emergent ray is parallel to incident ray" },
        { id: "mm4-4b", label: "Lateral displacement occurs" },
      ]
    },
  ],

  /* ─── Topic 5: Spherical Lenses ─── */
  "image-formation-by-lenses": [
    {
      id: "mm5-1", label: "Lens Types", children: [
        { id: "mm5-1a", label: "Convex: Thick middle, thin edges → Converging" },
        { id: "mm5-1b", label: "Concave: Thin middle, thick edges → Diverging" },
      ]
    },
    {
      id: "mm5-2", label: "Key Terms", children: [
        { id: "mm5-2a", label: "Optical Centre (O): No deviation" },
        { id: "mm5-2b", label: "Principal Focus (F₁, F₂)" },
        { id: "mm5-2c", label: "Focal Length (f)" },
        { id: "mm5-2d", label: "2F₁ and 2F₂ (centres of curvature)" },
      ]
    },
    {
      id: "mm5-3", label: "Convex Lens Images", children: [
        { id: "mm5-3a", label: "At ∞ → F₂ (point-sized, real)" },
        { id: "mm5-3b", label: "Beyond 2F₁ → Between F₂ and 2F₂ (diminished)" },
        { id: "mm5-3c", label: "At 2F₁ → At 2F₂ (same size)" },
        { id: "mm5-3d", label: "Between F₁ and 2F₁ → Beyond 2F₂ (enlarged)" },
        { id: "mm5-3e", label: "At F₁ → At ∞ (highly enlarged)" },
        { id: "mm5-3f", label: "Between O and F₁ → Same side (virtual, enlarged)" },
      ]
    },
    {
      id: "mm5-4", label: "Concave Lens: Always virtual, erect, diminished", children: [
        { id: "mm5-4a", label: "At ∞ → At F₁ (point-sized)" },
        { id: "mm5-4b", label: "Anywhere → Between F₁ and O" },
      ]
    },
  ],

  /* ─── Topic 6: Lens Formula & Power ─── */
  "lens-formula-and-power": [
    {
      id: "mm6-1", label: "Lens Formula: 1/v - 1/u = 1/f", children: [
        { id: "mm6-1a", label: "v = image distance" },
        { id: "mm6-1b", label: "u = object distance (always negative)" },
        { id: "mm6-1c", label: "f(convex) = positive, f(concave) = negative" },
      ]
    },
    {
      id: "mm6-2", label: "Magnification: m = v/u = h'/h", children: [
        { id: "mm6-2a", label: "No negative sign (unlike mirrors)" },
        { id: "mm6-2b", label: "+m → Virtual, erect" },
        { id: "mm6-2c", label: "-m → Real, inverted" },
      ]
    },
    {
      id: "mm6-3", label: "Power of a Lens", children: [
        { id: "mm6-3a", label: "P = 1/f (f in meters)" },
        { id: "mm6-3b", label: "Unit: Diopter (D)" },
        { id: "mm6-3c", label: "Convex → +P, Concave → -P" },
        { id: "mm6-3d", label: "Short f → More power → More bending" },
      ]
    },
    {
      id: "mm6-4", label: "Combination: P = P₁ + P₂ + P₃...", children: [
        { id: "mm6-4a", label: "Algebraic sum of individual powers" },
        { id: "mm6-4b", label: "Used in microscopes, cameras, telescopes" },
      ]
    },
  ],
};
