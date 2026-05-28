/**
 * FILE: topic-2-states-of-matter.ts
 * LOCATION: src/lib/content/class9/science/matter-in-our-surroundings/topic-2-states-of-matter.ts
 * PURPOSE: Deep content for Topic 2 — Three States of Matter (Solid, Liquid, Gas).
 *          Particle arrangement, properties, and real-world examples.
 * CURRICULUM: CBSE Class 9 Science Chapter 1
 * LAST UPDATED: 2026-05-28
 */
import { Topic } from "./types";

export const statesOfMatter: Topic = {
  id: "states-of-matter",
  title: "2. Three States of Matter — Solid, Liquid, Gas",
  estimatedMinutes: 30,
  imageUrl:
    "https://images.unsplash.com/photo-1616400619175-5beda3a17896?auto=format&fit=crop&q=80&w=1200",
  content: `
### The Same Substance in Three Forms

Here is something fascinating: **water (H₂O) is the only substance on Earth that exists naturally in all three states at the same time and place.** 

Right now, somewhere on Earth: ice caps (solid), oceans and rivers (liquid), and water vapour in clouds (gas) all exist simultaneously. Same atoms, same molecules (H₂O), but completely different behaviours — and the only reason is the strength of the forces between the molecules.

This is the key insight of this topic: **The state of matter depends entirely on how strongly the particles attract each other and how much kinetic energy they have.**

---

### State 1: Solid — The Rigid World

#### Particle Arrangement in Solids
In a solid, particles are arranged in a **tightly packed, regular pattern** called a **crystal lattice** (for crystalline solids). Each particle is surrounded by neighbours on all sides with very little space between them.

* Inter-particle distance: very small (0.3–0.5 nm for most metals)
* Inter-particle force: **very strong** — particles are locked in position
* Motion: particles only **vibrate** about their fixed mean positions (no translation)

#### Properties of Solids

**1. Definite Shape:**
Since particles are locked by strong forces, they cannot rearrange themselves. The shape of a solid remains fixed. A rock stays rocky, an ice cube stays cube-shaped (until it melts).

**2. Definite Volume:**
The strong inter-particle forces hold particles at fixed distances. Solids resist compression and expansion — they maintain their volume.

**3. High Density:**
Tightly packed particles = more mass per unit volume = high density. Metals like iron (7,870 kg/m³) and lead (11,340 kg/m³) are dense because their atoms pack tightly.

**4. Incompressible:**
Almost no space between particles → almost no room to compress. You cannot squeeze a steel block into a smaller volume under normal pressures.

**5. Cannot Flow:**
Particles are locked in position. They cannot slide past each other. Solids do not pour or take the shape of their container.

#### Two Types of Solids

**Crystalline Solids:** Particles arranged in a regular, repeating 3D pattern (lattice).
* Examples: Salt (NaCl), sugar, metals, diamond, quartz
* Have sharp, definite melting points (all lattice bonds break at the same temperature)
* Show cleavage planes (break along regular faces)

**Amorphous Solids:** Particles arranged in an irregular, random pattern.
* Examples: Glass, rubber, plastic, candle wax, butter
* Have no sharp melting point — they soften gradually over a temperature range
* Sometimes called "super-cooled liquids" (glass flows extremely slowly over centuries)

---

### State 2: Liquid — The Flowing World

#### Particle Arrangement in Liquids
In a liquid, particles are close together (similar spacing to solids) but they are NOT locked in fixed positions. They can slide past each other.

* Inter-particle distance: small (slightly larger than in solids)
* Inter-particle force: **moderate** — particles attract each other but can move
* Motion: particles **vibrate AND translate** (move from place to place)

#### Properties of Liquids

**1. No Definite Shape (Takes Container's Shape):**
Particles can flow and rearrange — they take the exact shape of any container. Water fills a round bowl as a round shape, fills a rectangular glass as a rectangle.

**2. Definite Volume:**
Even though shape changes, the total volume stays constant. 1 litre of water poured from a narrow bottle into a wide bowl is still 1 litre.

**3. Moderate Density:**
Particles are close but not as tightly packed as solids. Density is lower than most solids (water: 1000 kg/m³, compare to ice: 917 kg/m³ — ice floats on water because it's LESS dense!).

**4. Slightly Compressible:**
A tiny amount of space exists between liquid particles. Water compresses by about 0.005% per atmosphere — essentially incompressible for most purposes.

**5. Can Flow:**
Particles slide past each other → liquids flow, pour, and take any shape.

**6. Surface Tension:**
Particles at the surface of a liquid are attracted more strongly by particles below and beside them than by the sparse gas molecules above. This creates a 'skin' at the surface. Example: Water drops are spherical (minimising surface area). Insects like water striders walk on water's surface using surface tension.

#### Viscosity — Resistance to Flow
Different liquids flow at different rates — this is **viscosity**. 
* Water: low viscosity → flows easily
* Honey: high viscosity → flows slowly (molecules stick to each other more)
* Glass: extremely high viscosity → appears solid but technically flows (over thousands of years!)

---

### State 3: Gas — The Free World

#### Particle Arrangement in Gases
Gas particles are widely spaced, moving rapidly in all directions, colliding with each other and the container walls.

* Inter-particle distance: very large (molecules are on average 3–4 nm apart in air at room temperature — 10× the diameter of the molecules themselves)
* Inter-particle force: **very weak** (negligible at these distances)
* Motion: particles move at **high speeds** (~500 m/s for nitrogen at room temperature!) in random, straight-line paths until collision

#### Properties of Gases

**1. No Definite Shape:**
With negligible forces holding them together, gas particles fly freely and spread to fill any container completely.

**2. No Definite Volume:**
Gases expand to fill their container. A balloon of gas doubles its volume if you move it to a container twice as large (at constant temperature/pressure).

**3. Very Low Density:**
Huge inter-particle spaces → very little mass per unit volume. Air density = 1.2 kg/m³ vs water = 1,000 kg/m³ (about 800× less dense).

**4. Highly Compressible:**
Enormous spaces between gas particles → large compressibility. A car tyre holds compressed air at ~200 kPa (double normal atmospheric pressure) — gas compressed into half the volume it would occupy at atmospheric pressure.

**5. Flow and Diffuse Freely:**
Gas particles move at high speeds in random directions → gases spread rapidly to fill available space (diffusion).

**6. Exert Pressure:**
Gas particles constantly bombard container walls at high speed. This continuous bombardment is gas pressure. Car tyres, bike tyres, balloons all rely on gas pressure for their function.

---

### Comparing the Three States

| Property | Solid | Liquid | Gas |
|---|---|---|---|
| Shape | Definite | No (takes container's) | No (fills container) |
| Volume | Definite | Definite | No (fills any volume) |
| Density | High | Medium | Very low |
| Compressibility | Almost zero | Very slight | Very high |
| Inter-particle space | Very small | Small | Very large |
| Inter-particle force | Very strong | Moderate | Very weak |
| Particle motion | Vibration only | Vibrate + flow | Rapid random motion |
| Can flow? | No | Yes | Yes |

---

### The Fourth State: Plasma

Scientists recognise a fourth state of matter: **Plasma** — a super-hot ionised gas where electrons are stripped from atoms, creating a 'soup' of positively charged ions and free electrons.

* Temperature range: thousands to millions of Kelvin
* Makes up 99% of all visible matter in the universe (stars, including the Sun)
* Examples on Earth: lightning bolts, neon signs, welding arcs, the sun's corona, nuclear fusion reactors (tokamaks)

**Why does plasma matter?** Nuclear fusion — the process that powers the Sun — happens in plasma. Scientists are working to create controlled fusion in plasma to provide virtually limitless, clean energy on Earth (ITER project in France).
  `,
  questions: [
    {
      id: "m1t2q1", type: "mcq", points: 10,
      question: "Which state of matter has definite shape AND definite volume?",
      options: ["Gas", "Liquid", "Solid", "Plasma"],
      correctAnswer: "Solid",
      explanation: "Solids have both definite shape (particles locked in place) and definite volume (strong inter-particle forces maintain fixed distances). Liquids have definite volume but no definite shape. Gases have neither."
    },
    {
      id: "m1t2q2", type: "mcq", points: 10,
      question: "Why does ice float on water? This is because:",
      options: [
        "Ice has more mass than water",
        "Ice particles move faster than water particles",
        "Ice (solid) is less dense than liquid water",
        "Ice exerts more pressure than water"
      ],
      correctAnswer: "Ice (solid) is less dense than liquid water",
      explanation: "Water is unique — its solid form (ice, 917 kg/m³) is LESS dense than liquid water (1000 kg/m³). This is because water molecules form a hexagonal lattice structure in ice with more empty space than in liquid water. Less dense objects float on denser liquids."
    },
    {
      id: "m1t2q3", type: "mcq", points: 10,
      question: "The inter-particle forces are STRONGEST in which state?",
      options: ["Gas", "Liquid", "Solid", "Plasma"],
      correctAnswer: "Solid",
      explanation: "In solids, particles are packed closely with very strong inter-particle attractive forces that lock them in fixed positions. This is why solids have definite shape. In liquids, forces are moderate. In gases, forces are negligible."
    },
    {
      id: "m1t2q4", type: "mcq", points: 10,
      question: "A gas is easily compressible because:",
      options: [
        "Gas particles are very heavy",
        "Gas particles have no mass",
        "There are very large spaces between gas particles",
        "Gas particles move very slowly"
      ],
      correctAnswer: "There are very large spaces between gas particles",
      explanation: "Compression means pushing particles closer together. Gas particles are already very far apart (inter-particle distance >> particle size), leaving enormous space that allows compression. Solids and liquids have almost no free inter-particle space — they resist compression."
    },
    {
      id: "m1t2q5", type: "mcq", points: 10,
      question: "Glass is sometimes called a 'super-cooled liquid' because it is actually an amorphous solid. This means:",
      options: [
        "Glass can flow like water at room temperature",
        "Glass has no definite melting point — it softens gradually",
        "Glass particles have regular crystal structure",
        "Glass is the same as ice"
      ],
      correctAnswer: "Glass has no definite melting point — it softens gradually",
      explanation: "Amorphous solids like glass have randomly arranged particles (no crystal lattice). Because particle arrangements vary, bonds break at different temperatures — glass softens gradually rather than melting sharply. In contrast, crystalline NaCl melts sharply at exactly 801°C."
    },
    {
      id: "m1t2q6", type: "short", points: 15,
      question: "What are the differences between crystalline and amorphous solids? Give two examples of each.",
      correctAnswer: "Crystalline solids: regular, repeating particle arrangement (crystal lattice). Have sharp, definite melting points. Examples: NaCl (salt), ice, diamond, metals. Amorphous solids: irregular, random particle arrangement. Soften gradually over a temperature range, no sharp melting point. Examples: glass, rubber, wax, plastic, butter.",
      explanation: "Regular vs irregular arrangement. Sharp vs gradual melting. Two valid examples of each type required."
    },
    {
      id: "m1t2q7", type: "short", points: 15,
      question: "Why do gases have no definite volume but liquids do?",
      correctAnswer: "Liquids have moderate inter-particle forces — particles attract each other enough to stay close together, maintaining a fixed total volume even while changing shape. Gases have negligible inter-particle forces — particles barely attract each other and move at high speeds. They spread to fill any available space. Without strong enough forces to hold them together, there is no reason for gas particles to remain in a fixed volume.",
      explanation: "Must contrast force strengths: moderate for liquids (holds volume), negligible for gases (no volume constraint)."
    },
    {
      id: "m1t2q8", type: "short", points: 15,
      question: "What is surface tension? Give two examples of surface tension in everyday life.",
      correctAnswer: "Surface tension is the inward force at the surface of a liquid, caused by the stronger downward/sideward attraction of surface particles by particles below and beside them, compared to the weak upward attraction by gas molecules above. It creates a 'skin' effect. Examples: 1. Water strider insect walking on water's surface. 2. Water forms spherical droplets (sphere minimises surface area per volume). 3. A needle placed gently on water floats despite being denser than water. 4. Soap bubbles maintain their spherical shape.",
      explanation: "Definition explaining why surface tension occurs (unequal forces on surface molecules) + two real examples."
    },
    {
      id: "m1t2q9", type: "short", points: 15,
      question: "How does viscosity differ between water and honey? Explain using the particle theory.",
      correctAnswer: "Viscosity is resistance to flow. Water has low viscosity — water molecules are small (H₂O, mass 18 u) with relatively weak hydrogen bonds between them. They slide past each other easily. Honey has high viscosity — honey contains long sugar molecules (glucose, fructose, sucrose) that are much larger and interact strongly with each other through multiple hydrogen bonds and van der Waals forces. These large, entangled molecules resist sliding past each other, making honey thick and slow-flowing.",
      explanation: "Viscosity definition + particle-level reason for difference (molecule size and intermolecular forces). Water: small, weak forces. Honey: large molecules, strong forces."
    },
    {
      id: "m1t2q10", type: "short", points: 15,
      question: "What is plasma? Why is it considered the fourth state of matter? Give two examples.",
      correctAnswer: "Plasma is a super-hot, ionised state of matter where electrons are stripped from atoms, creating a mixture of positive ions and free electrons. It is the fourth state because it has properties distinct from all three classical states — it conducts electricity (free electrons), responds to magnetic fields, and exists only at extreme temperatures. Examples: 1. The Sun and stars (most common state in the universe — 99% of visible matter). 2. Lightning bolts. 3. Neon and fluorescent lights. 4. Nuclear fusion reactors.",
      explanation: "Definition (ionised, free electrons/ions) + why distinct (properties) + temperature requirement + two examples."
    },
    {
      id: "m1t2q11", type: "long", points: 20,
      question: "Compare and contrast the three states of matter (solid, liquid, gas) in terms of particle arrangement, inter-particle forces, particle motion, and physical properties. Use a table and real-world examples.",
      correctAnswer: "TABLE FORMAT (see content) — SOLID: Particles tightly packed in lattice. Forces very strong. Only vibrational motion. Properties: definite shape, definite volume, high density, incompressible, doesn't flow. Example: iron rod. LIQUID: Particles close but mobile. Forces moderate. Vibrational and translational motion. Properties: no definite shape, definite volume, medium density, slightly compressible, flows. Example: water. GAS: Particles widely spaced, random high-speed motion. Forces negligible. Properties: no shape, no fixed volume, very low density, highly compressible, flows freely. Example: oxygen in air. PARTICLE MOTION DETAIL: In all states, particles have kinetic energy. Adding heat increases this energy. When kinetic energy overcomes inter-particle forces → state change occurs (solid→liquid→gas). Removing heat decreases energy, forces pull particles back together → reverse state change.",
      explanation: "Full comparison across all properties. Must include particle motion description, force strengths, and at least one example per state. State change mechanism (KE vs forces) earns full marks."
    },
    {
      id: "m1t2q12", type: "long", points: 20,
      question: "Explain using the particle theory why: (a) a solid maintains its shape, (b) a liquid takes the shape of its container, (c) a gas fills its entire container, (d) gases can be compressed but solids cannot.",
      correctAnswer: "(a) SOLID MAINTAINS SHAPE: Particles are packed in a fixed lattice with very strong inter-particle forces. These forces act like rigid springs — they resist displacement of particles from their positions. Any attempt to change the shape requires breaking these forces (which needs enormous energy). Hence solids retain shape under normal conditions. (b) LIQUID TAKES CONTAINER SHAPE: Liquid particles have enough kinetic energy to overcome the positional constraint of inter-particle forces — they can slide past each other. When poured into a container, gravity pulls particles down, but they slide freely until they conform to the container's shape. The overall volume is maintained because forces still keep particles from flying apart. (c) GAS FILLS CONTAINER: Gas particles have very high kinetic energy, far exceeding the very weak inter-particle forces. They move at ~500 m/s in random directions. With nothing holding them together, they naturally spread to fill the entire available volume — every corner, every gap. (d) COMPRESSIBILITY DIFFERENCE: Compressing = pushing particles closer together. Gas particles are 10× farther apart than their own diameter — huge space exists. Pushing them together is easy initially. Solid particles are essentially touching — they cannot get closer without their electron clouds (which repel at short range) resisting. The electrostatic repulsion between electron clouds provides enormous resistance to solid compression.",
      explanation: "All four must be explained at the particle level with specific force and motion reasoning for each. The compressibility answer must mention electron cloud repulsion for full marks."
    },
    {
      id: "m1t2q13", type: "long", points: 20,
      question: "Why does ice float on water? Explain the unusual density behaviour of water and why this has profound implications for life on Earth.",
      correctAnswer: "NORMAL EXPECTATION: Usually, solids are denser than their liquid phase (particles pack closer in solid state). ICE IS EXCEPTION: Water molecules (H₂O) form hydrogen bonds. In liquid water, hydrogen bonds constantly form and break — molecules are somewhat randomly packed (density 1000 kg/m³). When water freezes into ice, hydrogen bonds lock water molecules into a hexagonal lattice structure with large hexagonal gaps. This open lattice actually has MORE space than liquid water — ice density is only 917 kg/m³. Less dense = floats. IMPLICATIONS FOR LIFE: 1. Lakes and ponds freeze from the TOP down, not bottom up. The floating ice layer insulates the water below from further freezing. Fish and aquatic life can survive in liquid water beneath the ice — entire ecosystems are preserved through winter. 2. If ice sank (like most solid metals), entire bodies of water would freeze solid from the bottom up, killing all aquatic life — potentially making Earth uninhabitable. 3. Ice sheets float on polar oceans — maintaining global ocean circulation patterns that regulate climate. 4. Water's maximum density is at 4°C — water at the bottom of a lake in winter is 4°C (densest), providing a liquid habitat for aquatic life.",
      explanation: "Hexagonal lattice structure → more space → less dense → floats. All four life implications must be stated. This is one of the most important anomalous properties of water in biology and Earth science."
    },
    {
      id: "m1t2q14", type: "long", points: 20,
      question: "Describe the particle model of gas pressure. How does increasing temperature OR reducing volume affect gas pressure? Explain using the particle theory (kinetic molecular theory).",
      correctAnswer: "GAS PRESSURE ORIGIN: Gas particles move at high speeds and constantly collide with the walls of their container. Each collision exerts a tiny force on the wall. Billions of collisions per second per cm² of wall create a steady, measurable pressure. TEMPERATURE EFFECT: Increase temperature → particles gain kinetic energy → move faster → collide with walls more frequently AND with greater force per collision → pressure increases. (At constant volume, P ∝ T — Gay-Lussac's Law). Example: Car tyre pressure increases slightly in summer heat, decreases in winter cold. VOLUME EFFECT: Reduce volume → same number of particles in smaller space → particles collide with walls more frequently per unit time (shorter path between walls) → pressure increases. (At constant temperature, PV = constant — Boyle's Law). Example: Pump compresses air into bike tyre (same number of molecules in smaller space → higher pressure). COMBINED: Both effects together → very high pressure. Example: Pressure cooker — heating water in a sealed container increases temperature AND evaporation adds more gas particles to the fixed space → high pressure → water boils at >100°C.",
      explanation: "Origin of pressure (particle-wall collisions). Temperature effect (faster + more frequent collisions). Volume effect (more frequent collisions in smaller space). Real examples for each. Boyle's Law and Gay-Lussac's Law named for bonus."
    },
    {
      id: "m1t2q15", type: "long", points: 20,
      question: "A student observes that a perfume bottle smells far stronger on a hot summer day than a cold winter day, even if the bottle is sealed. Explain this observation using the particle theory of matter and the properties of liquids and gases.",
      correctAnswer: "PERFUME IN BOTTLE: The sealed perfume bottle contains liquid perfume + some perfume vapour (gas) in the space above the liquid. The liquid and vapour are in equilibrium. HOT DAY EXPLANATION: High temperature → liquid perfume molecules have more kinetic energy → more molecules overcome the intermolecular forces of the liquid surface → more molecules EVAPORATE into the vapour phase per unit time. This increases the vapour pressure of perfume inside the bottle. When the cap is opened, a higher concentration of perfume molecules in gaseous form escapes. Once outside: higher temperature → gas particles move faster → diffuse more rapidly through the air → reach your nose more quickly. COLD DAY EXPLANATION: Low temperature → less kinetic energy → fewer molecules evaporate → lower vapour pressure → fewer molecules escape when opened → slower diffusion through colder, denser air → weaker smell detected. PARTICLE SUMMARY: (1) Higher T → more evaporation (more liquid molecules become gas). (2) Higher T → gas molecules move faster → faster diffusion → smell reaches nose faster. Both effects make perfume smell stronger in summer. ADDITIONAL: Even without opening, sealed bottles can build up pressure in summer heat — this is why aerosol cans have temperature warnings.",
      explanation: "Two separate temperature effects must be identified: (1) evaporation rate (more molecules enter gas phase), (2) diffusion rate (gas molecules spread faster). Both must be particle-theory explained."
    },
    {
      id: "m1t2q16", type: "thinking", points: 25,
      question: "HOTS: Most substances contract when they freeze (solid is denser than liquid). Water expands when it freezes (ice is less dense than water). Name THREE other consequences of this anomalous behaviour of water beyond the ones already discussed, and explain each using the particle theory.",
      correctAnswer: "1. PIPES BURST IN WINTER: Water in pipes freezes and EXPANDS (9% volume increase). In a rigid metal pipe, this expansion cannot occur outward → enormous internal pressure builds up → pipe bursts. Particle reason: hydrogen bonds in ice lattice occupy more space than random hydrogen bonds in liquid water. 2. ROCKS CRACK AND MOUNTAINS ERODE: Water seeps into rock crevices. When it freezes, it expands → exerts enormous pressure on the rock walls → cracks widen over years → eventually rocks split. This 'freeze-thaw weathering' is a major mechanism of mountain erosion and soil formation. Particle reason: same expansion physics as the pipe. 3. CELLS ARE NOT DAMAGED BY SLOW FREEZING (biological adaptation): Many organisms have antifreeze proteins that prevent ice crystal formation inside cells. Without these, water expansion inside cells would rupture cell membranes. Some organisms (e.g., wood frogs) allow controlled ice formation BETWEEN (not inside) cells. Particle reason: ice crystals grow along cell boundaries first, not inside cells, preserving cellular structure. 4. (BONUS) ICEBERGS FLOAT AND ARE NAVIGATION HAZARDS: Because ice floats, large icebergs can be 90% submerged with only 10% visible (density is 917/1000 = 91.7% below water). This is why the Titanic didn't see the iceberg in time.",
      explanation: "Three distinct consequences beyond fish survival and lake freezing from top. Each must be particle-theory explained. Pipes, rock weathering, and biological implications are the three strongest answers."
    },
    {
      id: "m1t2q17", type: "thinking", points: 25,
      question: "HOTS: On the International Space Station (ISS), water behaves differently than on Earth. Explain what happens to water in the microgravity environment of the ISS and why, using knowledge of intermolecular forces and states of matter.",
      correctAnswer: "ON EARTH: Gravity pulls liquid water down. Water takes the shape of its container, forms flat surfaces, settles at the bottom of vessels. Surface tension effects are usually overcome by gravity for large volumes. IN MICROGRAVITY (ISS): No significant gravitational force to 'pull' water down. Water is now governed ENTIRELY by inter-particle (intermolecular) forces, especially surface tension. EFFECTS: 1. FREE-FLOATING SPHERES: Released water forms perfect spheres. Surface tension pulls the surface to the minimum area — a sphere has minimum surface area for a given volume. On Earth, gravity distorts this shape, but in microgravity, surface tension wins and spheres form. 2. WATER CLINGS TO SURFACES: Adhesive forces (water molecules attracted to container walls) cause water to creep along surfaces. Drinking must be done from sealed pouches — open water floats away. 3. WATER DOESN'T SETTLE: Without gravity, water doesn't fall to the 'bottom' of a container — it forms films on all surfaces. 4. BUBBLES DON'T RISE: Without buoyancy-driving gravity, CO₂ bubbles in carbonated drinks don't rise and collect — they stay throughout the liquid, making carbonated drinks unpleasant in space. Astronauts prefer flat water. CONCLUSION: Gravity normally dominates over surface tension and inter-particle forces for large water volumes on Earth. In microgravity, intermolecular forces reveal their true character.",
      explanation: "Surface tension dominates in microgravity. Sphere formation (minimum surface area). Water on surfaces. Bubbles not rising. Each explained using intermolecular forces. This requires applying particle theory to a novel, real situation."
    },
    {
      id: "m1t2q18", type: "thinking", points: 25,
      question: "HOTS: Diamond and graphite are both pure carbon — same atoms, same element. Yet diamond is the hardest natural substance while graphite (pencil lead) is one of the softest. Explain this extreme difference using the particle/atomic arrangement in each solid.",
      correctAnswer: "DIAMOND STRUCTURE: Each carbon atom forms 4 covalent bonds with 4 other carbon atoms in a 3D tetrahedral network. This creates an incredibly strong, rigid 3D lattice where to move any atom, you must break 4 extremely strong C-C covalent bonds. Result: the hardest natural material (10 on Mohs scale), extremely high melting point (3550°C), and a highly symmetrical structure. GRAPHITE STRUCTURE: Carbon atoms form 3 covalent bonds in flat hexagonal rings, creating 2D flat sheets. Between the sheets, only very weak van der Waals forces hold them together. Within each sheet: very strong C-C bonds (like a net). Between sheets: very weak forces. Result: sheets slide over each other easily (why graphite is a lubricant and pencil lead writes). The 4th electron per carbon is delocalised between sheets — conducts electricity (unlike diamond). KEY INSIGHT: The SAME atoms in different arrangements create completely different macroscopic properties. This is the power of understanding material structure at the atomic level. Same principle applies to: charcoal vs. diamond (both carbon), oxygen gas (O₂) vs. ozone (O₃), different crystal polymorphs of calcium carbonate (calcite vs. aragonite).",
      explanation: "Diamond: 3D tetrahedral covalent network → all directions equally hard. Graphite: 2D hexagonal layers with weak inter-layer forces → easy to slide. The same atoms, different structure → completely different properties is the fundamental insight."
    },
    {
      id: "m1t2q19", type: "thinking", points: 25,
      question: "HOTS: A pressurised aerosol can has a warning: 'Do not store above 50°C. Do not puncture or incinerate.' Using the particle theory of gases and the properties of matter, explain each warning in detail.",
      correctAnswer: "'DO NOT STORE ABOVE 50°C': The can contains liquefied propellant (a substance that is liquid under the high pressure inside the can but gas at normal pressure). Inside the can: liquid + gas phase in equilibrium. Higher temperature → propellant molecules gain kinetic energy → more molecules evaporate → gas pressure inside increases significantly. Steel cans are designed to withstand certain pressure limits. Above 50°C, pressure may exceed the can's structural limit → can deforms, weakens, or EXPLODES, sending metal fragments at high velocity. Particle explanation: P ∝ T (Gay-Lussac's Law) — doubling absolute temperature doubles pressure. 'DO NOT PUNCTURE': Puncturing creates a hole in the pressurised container. The high-pressure gas inside (>>1 atm) rapidly escapes through the hole. The sudden pressure release is explosive — can propels backward like a rocket (Newton's 3rd Law). Additionally, liquefied propellant suddenly vaporises (pressure drops → liquid → gas, massive volume expansion), creating a violent burst. 'DO NOT INCINERATE': Throwing into fire combines both dangers: extreme temperature rapidly increases pressure, while the fire can melt the metal weakening the structure. The result is almost certain explosive failure at dangerously close proximity to the fire.",
      explanation: "All three warnings explained using particle theory: T→pressure for storage warning, pressure differential for puncture, combined for incinerate. Newton's 3rd Law and Boyle's Law connections earn full marks."
    },
    {
      id: "m1t2q20", type: "thinking", points: 25,
      question: "HOTS: Stars are made of plasma — the fourth state of matter. Explain what plasma is, how it forms inside stars, and why creating plasma on Earth (in nuclear fusion reactors) is one of humanity's greatest technological challenges.",
      correctAnswer: "WHAT IS PLASMA: Plasma is an ionised state of matter where electrons have enough energy to break free from their atoms, creating a 'soup' of free electrons and positively charged ions. The particle model: instead of neutral atoms, you have separated charged particles — all in rapid, random, energetic motion. FORMATION IN STARS: At the core of the Sun (~15 million K), temperature provides enough kinetic energy that when hydrogen atoms collide, the electrons are stripped off. The result is bare protons (hydrogen nuclei) and free electrons — a plasma. In this plasma, protons move fast enough to overcome their mutual electrostatic repulsion and collide, triggering nuclear fusion (H+H → He + energy). The Sun converts 4 million tonnes of mass to energy per second via E=mc². THE CHALLENGE ON EARTH: 1. TEMPERATURE: We need >100 million K (even hotter than the Sun's core, because we can't replicate its enormous gravitational pressure). At these temperatures, all materials vaporise instantly — you cannot contain plasma in any physical container. 2. MAGNETIC CONFINEMENT: Solution is magnetic fields in doughnut-shaped 'tokamak' reactors (ITER in France). But plasma is unstable — it constantly tries to touch the walls and cool. Maintaining stable plasma confinement for extended periods is extremely difficult. 3. ENERGY BREAKEVEN: We must get MORE energy out of fusion than we put in. In 2022, the National Ignition Facility achieved ignition — first time fusion released more energy than delivered to the fuel. A historic milestone. 4. MATERIAL ENGINEERING: Components around the plasma face extraordinary heat and neutron radiation. REWARD: Unlimited, clean, cheap energy using hydrogen fuel extracted from seawater. Helium waste product (harmless). No meltdown risk. The potential is immense — solving Earth's energy crisis permanently.",
      explanation: "Plasma definition (ionised matter). Star plasma formation (temperature strips electrons). Three specific engineering challenges for fusion. The potential reward. This answer spans chemistry, physics, and engineering in a beautifully integrated way."
    }
  ]
};
