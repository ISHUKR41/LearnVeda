/**
 * FILE: topic-5-diffusion.ts
 * LOCATION: src/lib/content/class9/science/matter-in-our-surroundings/topic-5-diffusion.ts
 * PURPOSE: Deep content for Topic 5 — Diffusion and Applications.
 *          Diffusion in solids, liquids, and gases. Rate, factors, and osmosis intro.
 *          CBSE Class 9 Science Chapter 1.
 * LAST UPDATED: 2026-05-28
 */
import { Topic } from "./types";

export const diffusion: Topic = {
  id: "diffusion",
  title: "5. Diffusion — Nature's Mixing Mechanism",
  estimatedMinutes: 25,
  imageUrl:
    "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?auto=format&fit=crop&q=80&w=1200",
  content: `
### The Invisible Mixing Force

You open a bottle of perfume across the room. Within minutes, you can smell it without any wind or fan. How did the smell reach you?

You dissolve a few crystals of copper sulphate in water without stirring. Over days, the blue colour slowly spreads through the whole glass. Why?

The answer to both is **diffusion** — the spontaneous mixing of particles due to their random, continuous motion.

---

### Diffusion: Definition and Cause

> **Diffusion** is the net movement of particles (atoms, molecules, or ions) from a region of **higher concentration** to a region of **lower concentration**, driven by random particle motion.

Key points:
* It occurs WITHOUT any external force — just random particle motion
* It moves from HIGH → LOW concentration (down the concentration gradient)
* It continues until concentration is uniform throughout (equilibrium)
* It is a direct consequence of particles being in constant, random motion

**Why particles move from high to low concentration:**
In a high-concentration region, there are more particles colliding and bouncing randomly. Statistically, more particles will randomly move AWAY from the crowded high-concentration zone than will move into it from the low-concentration zone. The NET movement is therefore from high to low concentration — purely due to random motion probability, not any directed force.

---

### Diffusion in Different States of Matter

#### Diffusion in Gases — The Fastest!

Gas particles move at very high speeds (hundreds of m/s) with very large spaces between them. Random collisions change their directions, but they cover large distances rapidly.

**Rate of diffusion in gases:**
* Very fast — measurable in seconds to minutes
* Depends on molecular mass: lighter molecules diffuse faster (Graham's Law: rate ∝ 1/√mass)

**Examples:**
* Perfume spreading across a room (minutes to hours)
* Smell of food cooking reaching other rooms
* Carbon dioxide spreading from a fire extinguisher
* Smells of garbage/flowers detected from a distance

**Graham's Law:**
$$\frac{r_1}{r_2} = \sqrt{\frac{M_2}{M_1}}$$

Where r = diffusion rate, M = molar mass. Lighter gas diffuses faster.

Example: Hydrogen (M=2) diffuses 4× faster than oxygen (M=32) because √(32/2) = √16 = 4.

#### Diffusion in Liquids — Slower Than Gases

In liquids, particles are close together and intermolecular forces slow them down. They can still move but must push past neighbouring molecules.

**Rate of diffusion in liquids:**
* Slower than gases (hours to days for visible diffusion)
* Increases with temperature (more energy → faster movement)
* Decreases with molecular size (larger molecules push through with more difficulty)

**Examples:**
* Blue ink dropped in water slowly spreading throughout (visible over minutes to hours)
* KMnO₄ crystals in water — purple colour slowly diffuses upward
* Sugar dissolving: even without stirring, sugar molecules eventually spread everywhere
* CO₂ dissolved in blood: diffuses from tissues (high CO₂) to blood vessels

#### Diffusion in Solids — The Slowest

In solids, particles are locked in lattice positions and can only diffuse through defects, vacancies, or grain boundaries. This is extremely slow at room temperature but significant at high temperatures.

**Examples:**
* Gold-silver diffusion: pressing gold and silver plates together for years → a few micrometres of mixing at the interface (visible with microscope)
* Carbon diffuses into iron at high temperature → steel is formed! (This is carburising — industrial steel hardening process)
* Lead pipe contamination: lead atoms slowly diffuse into the water over years (historical public health concern — why Roman plumbing caused lead poisoning)
* Silicon chip manufacturing: precise diffusion of dopants into silicon crystal

---

### Factors Affecting Rate of Diffusion

1. **Temperature:** Higher T → faster particle motion → faster diffusion. Diffusion rate roughly doubles per 10°C rise.

2. **Concentration gradient:** Steeper gradient (bigger concentration difference) → faster net movement. Example: 100x more concentrated source → much faster diffusion than 2x more concentrated.

3. **Molecular mass:** Lighter molecules diffuse faster (Graham's Law). Hydrogen diffuses 4× faster than oxygen.

4. **State of medium:** Gas > Liquid > Solid diffusion rate. The less dense the medium, the faster diffusion.

5. **Pressure:** Higher pressure in gases → more collisions → faster diffusion rates.

6. **Size of diffusing particle:** Smaller particles diffuse faster than larger ones in the same medium.

---

### Diffusion vs Osmosis

**Diffusion** is the movement of ANY substance (gas, liquid, dissolved substance) from high to low concentration.

**Osmosis** is a special case: the movement of WATER (solvent) molecules through a **semi-permeable membrane** from a region of high water concentration (dilute solution) to low water concentration (concentrated solution).

The membrane allows water to pass but blocks dissolved particles.

**Examples of osmosis:**
* Water absorption by plant roots from soil (soil water is more dilute than root cell contents → water moves in by osmosis)
* Raisins (dried grapes) swell when placed in water (water moves into shrivelled cells by osmosis)
* Red blood cells: in water → swell and burst (water rushes in). In concentrated salt water → shrink (water leaves)
* Kidney: dialysis machines use osmosis to remove waste from blood

---

### Diffusion in Biology — Critical for Life

Diffusion is one of life's most fundamental processes:

**1. Oxygen delivery:** In the lungs, O₂ concentration in alveolar air > O₂ in blood → O₂ diffuses into blood. In tissues: O₂ in blood > O₂ in tissue cells → O₂ diffuses from blood to cells.

**2. Carbon dioxide removal:** In tissues: CO₂ from metabolism > CO₂ in blood → CO₂ diffuses into blood. In lungs: CO₂ in blood > CO₂ in alveolar air → CO₂ diffuses out of blood.

**3. Nutrient absorption:** In small intestine: glucose, amino acids, fatty acids diffuse from high concentration (after digestion) into blood.

**4. Neurotransmission:** Neurotransmitters diffuse across the synaptic cleft (nanometre scale — very fast) to trigger next nerve cell.

Life at the cellular level is essentially a carefully orchestrated set of diffusion gradients.

---

### Diffusion in Industry and Technology

**1. Semiconductor doping:** Silicon chips work because specific impurities (phosphorus, boron) are diffused into precise regions of silicon at high temperature. This creates n-type and p-type semiconductor regions that form transistors. Without solid-state diffusion, no microchips, no computers, no smartphones.

**2. Dialysis:** Kidney failure patients use dialysis machines that clean blood using diffusion through semi-permeable membranes. Waste products (urea, creatinine) diffuse from blood into dialysis fluid. Life-saving application of diffusion.

**3. Gas separation (Gaseous diffusion plants):** U-235 and U-238 hexafluoride gases diffuse at slightly different rates (Graham's Law — mass difference). Many thousands of diffusion stages separate U-235 for nuclear fuel/weapons. Historically the most energy-intensive process ever performed by humans.

**4. Perfume and flavour encapsulation:** Slow-release capsules use controlled diffusion. The perfume/flavour is trapped in a shell; it slowly diffuses out over hours or days (e.g., long-lasting deodorants, slow-release drug capsules).
  `,
  questions: [
    {
      id: "m1t5q1", type: "mcq", points: 10,
      question: "Diffusion occurs because particles move:",
      options: [
        "From low concentration to high concentration",
        "From high concentration to low concentration due to random motion",
        "Only when heat is applied",
        "Only in gases, not in liquids or solids"
      ],
      correctAnswer: "From high concentration to low concentration due to random motion",
      explanation: "Diffusion is driven by the random motion of particles — statistical probability causes net movement from crowded high-concentration regions to less crowded low-concentration regions. No external energy is needed. It occurs in all states, though at very different rates."
    },
    {
      id: "m1t5q2", type: "mcq", points: 10,
      question: "According to Graham's Law, nitrogen (M=28 g/mol) and hydrogen (M=2 g/mol) are released simultaneously. Which diffuses faster and by how much?",
      options: [
        "Nitrogen, 14× faster",
        "Hydrogen, √14 ≈ 3.74× faster",
        "They diffuse at the same rate",
        "Nitrogen, √14 times faster"
      ],
      correctAnswer: "Hydrogen, √14 ≈ 3.74× faster",
      explanation: "Graham's Law: rate ∝ 1/√M. Rate ratio = √(M_N₂/M_H₂) = √(28/2) = √14 ≈ 3.74. Lighter hydrogen diffuses ~3.74× faster than heavier nitrogen."
    },
    {
      id: "m1t5q3", type: "mcq", points: 10,
      question: "In which state of matter is diffusion fastest?",
      options: ["Solid", "Liquid", "Gas", "Same in all states"],
      correctAnswer: "Gas",
      explanation: "Gas particles move at high speeds (~500 m/s) with large inter-particle spaces. Liquid particles are close together and move slowly. Solid particles barely move at all (only vibration). Diffusion rate: Gas >> Liquid >> Solid."
    },
    {
      id: "m1t5q4", type: "mcq", points: 10,
      question: "Raisins (dried grapes) swell when placed in water. This is an example of:",
      options: ["Diffusion of sugar from raisins into water", "Osmosis — water enters raisin cells through semi-permeable membrane", "Evaporation", "Chemical reaction between water and raisins"],
      correctAnswer: "Osmosis — water enters raisin cells through semi-permeable membrane",
      explanation: "Raisins have concentrated cell contents (water left during drying). Water outside is more dilute (high water concentration). Water molecules pass through the semi-permeable cell membranes from dilute (outside) to concentrated (inside) — osmosis. The cells swell as water enters."
    },
    {
      id: "m1t5q5", type: "mcq", points: 10,
      question: "How is oxygen delivered from the lungs to blood? This is an example of:",
      options: [
        "Active transport (requires energy)",
        "Osmosis through lung membranes",
        "Diffusion from high O₂ concentration in alveoli to lower O₂ in blood",
        "Mechanical pumping by the diaphragm"
      ],
      correctAnswer: "Diffusion from high O₂ concentration in alveoli to lower O₂ in blood",
      explanation: "In the lungs, alveolar air has high O₂ (freshly inhaled). Deoxygenated blood arriving from tissues has low O₂. Oxygen diffuses from the high-concentration alveoli across the thin membrane into blood. No active transport needed — pure concentration-gradient diffusion."
    },
    {
      id: "m1t5q6", type: "short", points: 15,
      question: "Define diffusion. Describe the ink-drop experiment to demonstrate diffusion in liquids.",
      correctAnswer: "Diffusion: spontaneous net movement of particles from high to low concentration due to their random motion. EXPERIMENT: Place a drop of ink (e.g., blue ink or KMnO₄) very carefully at the bottom of a tall glass of still water. Do not disturb. Observe over the next few hours/days. OBSERVATION: The coloured region slowly expands upward and outward. Eventually the entire water becomes uniformly coloured. CONCLUSION: Ink particles moved from high concentration (the drop) to low concentration (rest of water) by random motion — diffusion. The slow rate confirms liquid diffusion is slower than gas diffusion.",
      explanation: "Definition + experiment with observation and conclusion. Rate comparison (slow in liquid vs fast in gas) shows understanding."
    },
    {
      id: "m1t5q7", type: "short", points: 15,
      question: "State Graham's Law of diffusion. Which diffuses faster: carbon dioxide (M=44) or oxygen (M=32)? Calculate.",
      correctAnswer: "Graham's Law: Rate of diffusion of a gas is inversely proportional to the square root of its molar mass. r ∝ 1/√M. Comparison of CO₂ and O₂: r_O₂/r_CO₂ = √(M_CO₂/M_O₂) = √(44/32) = √(1.375) ≈ 1.17. Oxygen diffuses ~1.17 times faster than CO₂ because it is lighter. CO₂ is heavier (M=44 vs 32) so it diffuses more slowly.",
      explanation: "Graham's Law stated + formula + numerical calculation. Correct identification of which is faster (lighter = faster)."
    },
    {
      id: "m1t5q8", type: "short", points: 15,
      question: "How does the body use diffusion to remove carbon dioxide? Trace the path of CO₂ from a muscle cell to exhaled air.",
      correctAnswer: "1. In MUSCLE CELL: CO₂ is produced by cellular respiration. High CO₂ concentration builds up. 2. MUSCLE → CAPILLARY: CO₂ diffuses from high-concentration muscle cell, through cell membrane, into surrounding fluid, into blood capillary (low CO₂). Diffusion driven by concentration gradient. 3. BLOOD TRANSPORT: CO₂ dissolves in blood plasma and is carried as HCO₃⁻ ions to lungs. 4. CAPILLARY → ALVEOLUS: In lungs, blood arriving has high CO₂. Fresh air in alveoli has low CO₂. CO₂ diffuses from blood through the thin alveolar-capillary membrane into the alveolus. 5. EXHALATION: CO₂-rich air in alveoli is exhaled. Every step in this chain is driven by diffusion down concentration gradients — no pumps used.",
      explanation: "Complete 5-step pathway from cell to exhaled air. Each step identifies the direction and driving force (concentration gradient)."
    },
    {
      id: "m1t5q9", type: "short", points: 15,
      question: "What is osmosis? How does it differ from diffusion? Give one example from biology.",
      correctAnswer: "Osmosis: movement of WATER molecules through a semi-permeable membrane from a region of high water concentration (dilute solution) to low water concentration (concentrated solution). DIFFERENCE FROM DIFFUSION: Diffusion = any substance moving from high to low concentration. Osmosis = specifically WATER moving through a SEMI-PERMEABLE MEMBRANE (which blocks dissolved particles). Direction: diffusion goes from high solute to low solute concentration. Osmosis: water moves from LOW solute to HIGH solute concentration (water goes toward the more concentrated solution). BIOLOGY EXAMPLE: Plant root hair cells absorb water from soil by osmosis — soil water is more dilute than cell cytoplasm. Water enters root cells down the osmotic gradient.",
      explanation: "Osmosis definition + key differences (water only, membrane required, direction). Biology example with correct osmotic direction."
    },
    {
      id: "m1t5q10", type: "short", points: 15,
      question: "Name two industrial applications of diffusion and explain the role of diffusion in each.",
      correctAnswer: "1. SEMICONDUCTOR CHIP MANUFACTURING: Transistors are made by diffusing specific impurities (phosphorus for n-type, boron for p-type) into precise regions of a silicon crystal wafer at high temperatures (~1000°C). The dopant atoms diffuse from a high-concentration source into silicon, creating precisely controlled semiconductor regions. The depth and concentration of diffusion determines transistor performance. Without controlled solid-state diffusion, no microchips exist. 2. KIDNEY DIALYSIS: Patients with kidney failure use dialysis machines. Blood is passed along one side of a semi-permeable membrane; dialysis fluid on the other side. Waste products (urea, creatinine, excess salts) diffuse from blood (high concentration) through the membrane into dialysis fluid (low concentration) — mimicking kidney function. Cleaned blood returns to patient.",
      explanation: "Two industrial applications. Each explains what diffuses, in which direction, through what medium, and the practical outcome."
    },
    {
      id: "m1t5q11", type: "long", points: 20,
      question: "Compare the rate and characteristics of diffusion in solids, liquids, and gases using the particle theory. Give two real-world examples for each state.",
      correctAnswer: "GASES — FASTEST: Particles move at ~300-1500 m/s (lighter = faster), large inter-particle spaces. Mean free path ~70 nm between collisions. Diffusion visible in seconds-minutes. Examples: (1) Perfume spreading across a room in minutes. (2) LPG gas detector alarm triggered within seconds of gas leak — fast diffusion. Graham's Law governs rate. LIQUIDS — MEDIUM: Particles close together, move slower (~1-10 m/s in liquid), intermolecular forces slow movement. Must push past neighbours. Diffusion visible over hours-days. Examples: (1) KMnO₄ crystal in water — purple colour spreads over hours. (2) Sugar in tea — without stirring, fully mixed over many hours. Temperature increases rate. SOLIDS — SLOWEST: Particles locked in lattice, motion limited to vibration. Diffusion through vacancies/defects only. Room temperature: essentially unmeasurable. High temperature required for significant solid diffusion. Examples: (1) Case-hardening steel: carbon diffuses into iron surface at 900°C to create hard steel skin. (2) Gold-silver diffusion: pressed together for years → micrometres of mixing visible only under microscope. RATE ORDER: Gas > Liquid >> Solid (by factors of millions).",
      explanation: "All three states with particle-theory explanation of speed, inter-particle spacing, and force effects. Two examples per state. Quantitative rate comparison (gases millions of times faster than solids)."
    },
    {
      id: "m1t5q12", type: "long", points: 20,
      question: "Explain how diffusion enables the exchange of gases in the human lungs. Why are the alveoli specifically designed (surface area, wall thickness) to maximise diffusion efficiency?",
      correctAnswer: "GAS EXCHANGE VIA DIFFUSION: Fick's Law governs diffusion rate: Rate ∝ (Surface Area × Concentration Gradient) / (Membrane Thickness). The lungs maximise each factor: SURFACE AREA: Each lung contains ~300 million alveoli. Total alveolar surface area ≈ 70 m² — roughly the size of a tennis court! Contrast with a simple pipe (1 cm diameter, same lung volume) that would have ~0.01 m² surface area. 7000× more surface area means 7000× faster diffusion. MEMBRANE THICKNESS: Alveolar walls are only ~0.1-0.2 μm thick (0.0001-0.0002 mm). This is 1/5000th of a millimetre — extraordinarily thin. Diffusion rate ∝ 1/thickness → thinner = faster. CONCENTRATION GRADIENT: At rest, alveolar O₂ concentration ~100 mmHg, blood O₂ arriving from tissues ~40 mmHg. Gradient of 60 mmHg drives O₂ into blood rapidly. Blood CO₂ ~45 mmHg, alveolar CO₂ ~40 mmHg — gradient drives CO₂ out. CAPILLARY CONTACT: Every alveolus is surrounded by a dense capillary mesh — red blood cells pass within 0.3 μm of alveolar air. Entire RBC is exchanged within ~0.75 seconds of capillary transit time — matching the heart rate. RESULT: 250 mL O₂/min absorbed at rest, up to 5000 mL/min during intense exercise — all by passive diffusion, no energy used.",
      explanation: "Fick's Law stated. Three design features (surface area, membrane thickness, concentration gradient) each explained quantitatively. The 70 m² comparison is memorable. Clinical implications (exercise capacity) for full marks."
    },
    {
      id: "m1t5q13", type: "long", points: 20,
      question: "How does diffusion operate in kidney dialysis? Explain the mechanism at the molecular level and compare dialysis to natural kidney function.",
      correctAnswer: "NATURAL KIDNEY: Filters blood through ~1 million nephrons. Each nephron has a glomerulus — a tight bundle of capillaries where blood pressure forces fluid and small molecules (glucose, urea, salts, water) out of blood into the nephron tubule (ultrafiltration). Useful molecules (glucose, amino acids) are reabsorbed. Waste (urea, excess salts) is concentrated as urine. Healthy kidneys filter all blood every 20-25 minutes. KIDNEY DIALYSIS MECHANISM: Blood is pumped through narrow dialysis tubes made of semi-permeable membrane (pore size ~8 nm — allows urea, small ions; blocks blood cells, large proteins). The tubes are bathed in dialysis fluid (isotonic saline + glucose + bicarbonate — similar composition to normal blood but NO waste products). MOLECULAR LEVEL: Urea in blood: ~50 mmol/L (high). Urea in dialysis fluid: 0 (low). Urea diffuses OUT through membrane. Bicarbonate in blood: low (kidney failure → acidosis). Bicarbonate in dialysis fluid: high. Bicarbonate diffuses INTO blood → corrects acidosis. K⁺, Na⁺ imbalances corrected similarly. COMPARISON: Natural kidney: active reabsorption (uses energy) + diffusion. Selective recovery of nutrients, concentrated urine output. Dialysis: passive diffusion only. More crude — cannot recover specific molecules. Takes 3-4 hours, 3×/week. Artificial kidney never matches biological complexity.",
      explanation: "Molecular-level diffusion mechanism in dialysis. Concentration gradients for each substance. Comparison with natural kidney. The pore-size selectivity and active vs passive processes distinguish dialysis from natural filtration."
    },
    {
      id: "m1t5q14", type: "long", points: 20,
      question: "A student adds a small amount of food colouring to the centre of a large, still water tank. Describe what would happen (a) immediately, (b) after one hour, (c) after one week, (d) after one month. Use diffusion principles to explain each stage.",
      correctAnswer: "(a) IMMEDIATELY: The food colouring drops to the bottom (if denser) or rises/spreads (if less dense) due to gravity and fluid dynamics. A concentrated coloured spot forms. Very little diffusion has occurred yet — just initial dispersion from the addition. (b) AFTER ONE HOUR: The coloured region has spread noticeably from the initial spot. Diffusion from high concentration (the drop) to lower concentration surroundings has created a visible gradient. The boundary between coloured and uncoloured water is still visible but blurry. Rate: slow because liquid diffusion is slow (temperature-dependent; at room temperature, small molecule diffusion coefficient ~10⁻⁹ m²/s). (c) AFTER ONE WEEK: The coloured zone has spread significantly. The concentration gradient has flattened considerably. The colour is now detectable throughout much of the tank, though concentration decreases with distance from original drop location. Mathematically, diffusion in 3D creates a spreading Gaussian concentration profile. (d) AFTER ONE MONTH: Given a reasonably sized tank (1m³) and typical liquid diffusion coefficient (~10⁻⁹ m²/s), after 30 days = 2.6×10⁶ s: diffusion length ~√(D×t) = √(10⁻⁹ × 2.6×10⁶) ≈ √0.0026 ≈ 0.05 m = 5 cm. Still not fully mixed! Full mixing of 1m tank by diffusion alone would take years. This shows why stirring is needed — convection is millions of times faster than diffusion for mixing large volumes.",
      explanation: "All four stages with correct description. Quantitative estimate for one month using √(Dt). The conclusion that mixing large volumes by diffusion alone takes years (need stirring) is the key practical insight."
    },
    {
      id: "m1t5q15", type: "long", points: 20,
      question: "Explain how smell-detecting animals (dogs) exploit diffusion to track scents. Why can dogs detect smells humans cannot? What is the physical limit to scent tracking?",
      correctAnswer: "SCENT DIFFUSION: Scent molecules (small organic compounds) evaporate from a scent source and diffuse through air. Concentration gradient: high near source → decreasing with distance. Turbulence and wind create complex concentration patterns rather than smooth gradients. DOG SCENT DETECTION: Dogs have ~300 million olfactory receptors (humans: ~6 million = 50× fewer). Dogs can detect odors at concentrations of ~1-10 parts per trillion (ppt) — one teaspoon of a substance diluted in 20 Olympic swimming pools! Dog nose design: Turbinate bones create enormous surface area for odor contact. They can detect a person's scent on a trail hours old. PHYSICAL MECHANISM: Following a trail: person's skin cells, sweat, breath molecules diffuse/settle on ground and nearby surfaces. Concentration is highest on the actual footstep path. Dog's sensitive receptors detect concentration gradient → move toward higher concentration. PHYSICAL LIMITS: Below a threshold concentration, even dog receptors cannot detect. Brownian motion randomises scent positions at molecular scale. Wind disrupts concentration gradients. Rain washes away settled molecules. Temperature affects evaporation and diffusion rates. OLD TRAILS: Evaporation reduces concentration. Diffusion spreads molecules → gradient flattens → harder to follow direction. Bacteria degrade organic molecules. After ~48 hours in warm weather, trails become very difficult even for dogs.",
      explanation: "Diffusion as physical mechanism for scent trails. Dog vs human receptor comparison (50×). Detection threshold (ppt). Physical limits to tracking (wind, rain, temperature, time). This connects diffusion physics to animal sensory biology."
    },
    {
      id: "m1t5q16", type: "thinking", points: 25,
      question: "HOTS: The separation of uranium-235 from uranium-238 for nuclear fuel uses gaseous diffusion. Uranium hexafluoride (UF₆) gas containing both isotopes is diffused through porous barriers. Calculate the relative diffusion rate ratio and explain why this separation requires thousands of stages.",
      correctAnswer: "CALCULATION: M(²³⁵UF₆) = 235 + 6×19 = 235+114 = 349 g/mol. M(²³⁸UF₆) = 238+114 = 352 g/mol. Rate ratio by Graham's Law: r₂₃₅/r₂₃₈ = √(352/349) = √(1.0086) ≈ 1.0043. SEPARATION FACTOR α = 1.0043. This means in ONE diffusion stage: the fraction of ²³⁵UF₆ in the faster-diffusing gas is only 0.43% higher than in the original mixture. MULTIPLE STAGES: Natural uranium is only 0.72% U-235 (rest is U-238). Nuclear weapons grade: >90% U-235. Reactor grade: 3-5% U-235. Each stage enriches by factor α. After n stages: enrichment = α^n. To go from 0.72% to 3-5% (reactor grade): needs ~1200 stages! For weapons grade (90%): ~4000 stages. WHY SO MANY: The mass difference between ²³⁵U and ²³⁸U is only 3 u out of ~350 — less than 1%. Graham's Law has the square root: even this small mass difference gives very close diffusion rates. Each stage barely separates — thousands of stages cascade the tiny separations into significant enrichment. HISTORICAL: The K-25 gaseous diffusion plant at Oak Ridge, Tennessee (1945) was the world's largest building by floor area. Used massive electricity to separate U-235 for the Manhattan Project. Its energy use alone could power a small city.",
      explanation: "Correct calculation using √(352/349) = 1.0043 separation factor. Number of stages argument. The tiny mass difference → tiny rate difference → many stages required. Historical Manhattan Project context."
    },
    {
      id: "m1t5q17", type: "thinking", points: 25,
      question: "HOTS: Scientists studying global warming measure CO₂ concentrations at Mauna Loa Observatory in Hawaii. The measurements show steady increase from ~315 ppm in 1960 to ~420 ppm today. Explain how diffusion is involved in: (a) CO₂ spreading globally from emission sources, (b) CO₂ absorption by oceans, and (c) why CO₂ doesn't separate out of the atmosphere despite being heavier than N₂ and O₂.",
      correctAnswer: "(a) GLOBAL SPREAD: CO₂ emissions from burning fossil fuels occur mostly in Northern Hemisphere (Europe, North America, East Asia). Yet CO₂ concentration is nearly uniform globally within a few years of emission. Primary mechanism: atmospheric ADVECTION (wind transport, not molecular diffusion) on large scales. But diffusion is responsible for the local mixing from emission sources into the atmosphere and from atmosphere into oceans/soils. Molecular diffusion at local scale + advection at global scale = uniform global distribution. (b) OCEAN ABSORPTION: CO₂ in atmosphere > dissolved CO₂ in ocean surface → CO₂ diffuses from air into ocean. In seawater, CO₂ + H₂O ⇌ H₂CO₃ ⇌ HCO₃⁻ + H⁺ → CO₂ is converted to bicarbonate (removing it from solution). This maintains the concentration gradient → more CO₂ enters. Oceans have absorbed ~30% of all anthropogenic CO₂ emissions. BUT: increasing ocean CO₂ → ocean acidification (pH dropping from 8.2 to 8.1 — 26% more acidic since industrialisation). Harms coral reefs and shellfish (CaCO₃ dissolves in acid). (c) WHY CO₂ DOESN'T SEPARATE: CO₂ (M=44) is heavier than N₂ (M=28) and O₂ (M=32). Naively, heavier gases should settle. BUT: thermal diffusion (kinetic energy of ~300 K atmosphere) causes constant random mixing. The atmosphere's constant turbulence, convection, and advection thoroughly mix gases far faster than gravitational separation can act. Only at very high altitude (above ~100 km, the 'homopause') does gravity begin to separate gases by mass — heaviest near the bottom. Below that, the well-mixed atmosphere persists through continuous diffusion-driven mixing.",
      explanation: "Three complex, real phenomena. (a) Diffusion vs advection distinction at different scales. (b) CO₂ dissolution with chemistry and ocean acidification consequence. (c) Why thermal diffusion overcomes gravitational separation (homopause altitude where separation begins)."
    },
    {
      id: "m1t5q18", type: "thinking", points: 25,
      question: "HOTS: Red blood cells placed in pure water swell and burst, while those in concentrated salt water shrink. Explain both observations using osmosis. What salt concentration prevents change — and why is this the same as blood plasma? Name this solution.",
      correctAnswer: "RED BLOOD CELL IN PURE WATER (HYPOTONIC): Pure water: water concentration = very high (~55.5 mol/L). RBC cytoplasm: water concentration = lower (because dissolved proteins, salts, etc. reduce water's effective concentration). NET OSMOSIS: Water moves from high concentration (pure water) to lower (inside RBC) through the semi-permeable RBC membrane. Water rushes in rapidly. RBC SWELLS → BURSTS (haemolysis). The internal pressure exceeds the membrane's tensile strength. RED BLOOD CELL IN CONCENTRATED SALT (HYPERTONIC): Concentrated NaCl: water concentration = low (lots of dissolved salt reduces water's effective concentration). RBC cytoplasm: water concentration = higher than outside. NET OSMOSIS: Water moves OUT of RBC into concentrated solution. RBC shrinks → becomes a spiky, shrunken shape (crenation or plasmolysis). ISOTONIC SOLUTION: 0.9% NaCl solution (9g NaCl per litre) = ISOTONIC = same osmotic concentration as human blood plasma. Water concentration inside RBC equals water concentration in 0.9% NaCl. NET OSMOSIS = ZERO. RBC maintains normal shape and volume. WHY BLOOD PLASMA IS 0.9% NaCl: Blood plasma evolved to maintain RBC integrity. If plasma were too dilute → cells burst, no blood function. Too concentrated → cells crenate, cannot flow through capillaries. 0.9% NaCl is the evolutionary osmotic optimum. Called NORMAL SALINE (isotonic saline). Used in hospitals for IV drips — IV fluids must be isotonic or they damage blood cells.",
      explanation: "Hypotonic (swell/burst), hypertonic (shrink), isotonic (no change) all explained with osmotic mechanism. 0.9% NaCl identification. Why this matches blood plasma (evolutionary optimum). Medical application (normal saline IV drip)."
    },
    {
      id: "m1t5q19", type: "thinking", points: 25,
      question: "HOTS: A student claims 'diffusion is too slow to be useful in biology — cells need active transport.' Evaluate this claim. For which processes is diffusion fast enough and efficient? For which is active transport necessary? What factors make diffusion adequate at the cellular scale?",
      correctAnswer: "STUDENT CLAIM — PARTIALLY CORRECT: Diffusion IS slow for large distances. Einstein's diffusion equation: x² = 2Dt. Diffusion time t ≈ x²/2D. For a glucose molecule (D ≈ 6×10⁻¹⁰ m²/s): to diffuse 1 cm (10⁻² m): t = (10⁻²)²/(2×6×10⁻¹⁰) = 10⁻⁴/1.2×10⁻⁹ ≈ 83,000 s = 23 hours! TOO SLOW for whole-body transport. WHERE DIFFUSION IS FAST ENOUGH: Within cells (1-10 μm across): t ≈ (10⁻⁵)²/(2×6×10⁻¹⁰) ≈ 0.08 seconds. Fast enough! Across cell membranes (5-10 nm): nearly instantaneous. Gas exchange in alveoli (0.3 μm diffusion distance): t ≈ milliseconds. Synapse (20 nm gap): neurotransmitter crosses in microseconds. SCALE LAW: Diffusion time ∝ distance². Cells evolved to be small (1-100 μm) specifically because diffusion is only fast at microscopic scales! WHERE ACTIVE TRANSPORT NEEDED: (1) Against concentration gradients: Na⁺-K⁺ pump maintains high K⁺ inside cell (active). (2) Long distances: blood circulation physically moves O₂/glucose (convection). Neurons use electrical signals. (3) Selective uptake: glucose into cells uses carrier proteins (glucose transporters — semi-active). CONCLUSION: Student is wrong at cellular scale (diffusion is fast enough) but right at organ/body scale. Biology has evolved to use diffusion efficiently by minimising diffusion distances (thin alveolar walls, short synaptic gaps, small cell size) while using active transport and convection for longer distances.",
      explanation: "Quantitative calculation showing diffusion time ∝ x². Fast at cellular scale (μm), too slow at cm scale. Cell size evolved to make diffusion adequate. Active transport needed for uphill gradients and long distances. This integrates mathematical analysis with evolutionary biology."
    },
    {
      id: "m1t5q20", type: "thinking", points: 25,
      question: "HOTS: Carbon monoxide (CO) poisoning is deadly because CO diffuses into red blood cells and binds haemoglobin (Hb) 200× more tightly than oxygen. Explain the diffusion and chemistry involved, why CO poisoning is insidious (victims feel sleepy, not suffocated), and why 100% oxygen treatment works.",
      correctAnswer: "CO ENTRY INTO BLOOD: CO is produced by incomplete combustion (faulty heaters, cars in closed garages, charcoal indoors). CO diffuses from high concentration in inhaled air, through alveolar membrane into blood capillaries, then through RBC membrane into cytoplasm — same diffusion pathway as O₂. HAEMOGLOBIN BINDING: In RBC, Hb carries O₂ by reversible binding at haem iron sites. CO binds the same Fe²⁺ sites BUT 200-250× more strongly. Once CO binds, it DOESN'T release at tissues — permanently occupies O₂ binding sites. Forms carboxyhaemoglobin (HbCO). At 50% HbCO (50% of Hb sites occupied by CO), patient is severely incapacitated. At 70%, fatal. WHY INSIDIOUS: O₂ deficiency (hypoxia) causes shortness of breath. Brain stem detects CO₂ BUILDUP, not O₂ depletion. CO poisoning doesn't cause CO₂ buildup (you're still breathing normally, just not absorbing O₂). Brain stem doesn't trigger panic/suffocation sensation. Victim feels drowsy, confused, headache — not 'I can't breathe' — and may fall asleep and die. This is why CO detectors save lives — victims cannot detect the threat themselves. 100% OXYGEN TREATMENT: At normal air (21% O₂), CO releases from Hb very slowly (half-life of HbCO ≈ 4-5 hours). With 100% O₂: O₂ concentration in alveoli rises 5× → outcompetes CO for Hb binding (Le Chatelier's principle) → CO is displaced faster (half-life ≈ 60-90 minutes). Hyperbaric O₂ (3 atm): half-life drops to ~20 minutes — fastest displacement.",
      explanation: "CO diffusion pathway identical to O₂. 200× binding affinity vs O₂. No CO₂ buildup → no suffocation sensation (the insidious part). 100% O₂ uses mass action to displace CO — Le Chatelier. Hyperbaric oxygen as fastest treatment."
    }
  ]
};
