/**
 * FILE: cbse-catalog.ts
 * LOCATION: src/lib/curriculum/cbse-catalog.ts
 * PURPOSE: Complete CBSE curriculum catalog for EduQuest.
 *          Contains all subjects, chapters, and day plans for:
 *          - Class 9 (6 subjects, 87 chapters total)
 *          - Class 10 (5 subjects, 75 chapters total)
 *          - Class 11 Science stream (5 subjects)
 *          - Class 12 Science stream (5 subjects)
 *          This data is used by subject pages to render chapter lists,
 *          progress tracking, and day-plan navigation.
 * USED BY: src/app/class-9/[subject]/page.tsx and similar routes for other classes
 * DEPENDENCIES: None (pure TypeScript data file)
 * LAST UPDATED: 2026-05-16
 * AUTHOR NOTE: Chapter counts and names are based on NCERT 2025–26 syllabus.
 *              Add new chapters or subjects here, then re-run the DB seed migration.
 */

/* ─────────────────────────────────────────────
 * Type Definitions
 * ───────────────────────────────────────────── */

export interface Chapter {
  /** URL-safe identifier for the chapter */
  slug: string;
  /** NCERT chapter name */
  name: string;
  /** Short description of what the chapter covers */
  description: string;
  /** How many study days this chapter takes */
  dayCount: number;
  /** Expected difficulty level */
  difficulty: "easy" | "medium" | "hard";
  /** Total number of practice questions available */
  questionCount: number;
}

export interface Subject {
  /** URL-safe identifier matching the database slug */
  slug: string;
  /** Display name for the subject */
  name: string;
  /** Short description shown on the subject card */
  description: string;
  /** Lucide icon name for the subject icon */
  icon: string;
  /** Hex color for the subject card header gradient */
  color: string;
  /** Ordered list of CBSE chapters */
  chapters: Chapter[];
}

export interface ClassCatalog {
  /** e.g. "class-9" */
  id: string;
  /** e.g. "Class 9" */
  name: string;
  /** e.g. "Build rock-solid foundations" */
  tagline: string;
  /** CSS gradient for the class hero banner */
  gradient: string;
  /** All subjects in this class */
  subjects: Subject[];
}

/* ─────────────────────────────────────────────
 * Class 9 Curriculum Catalog
 * Source: NCERT Class 9 2025–26 syllabus
 * ───────────────────────────────────────────── */

export const CLASS_9_CATALOG: ClassCatalog = {
  id: "class-9",
  name: "Class 9",
  tagline: "Build rock-solid foundations across all CBSE subjects",
  gradient: "linear-gradient(135deg, #0EA5E9, #2563EB)",
  subjects: [
    {
      slug: "mathematics",
      name: "Mathematics",
      description: "Number Systems, Polynomials, Geometry, Mensuration, Statistics",
      icon: "Calculator",
      color: "#2563EB",
      chapters: [
        { slug: "number-systems", name: "Number Systems", description: "Rational and irrational numbers, real number line", dayCount: 7, difficulty: "easy", questionCount: 25 },
        { slug: "polynomials", name: "Polynomials", description: "Polynomials in one variable, zeroes, factor theorem", dayCount: 7, difficulty: "medium", questionCount: 25 },
        { slug: "coordinate-geometry", name: "Coordinate Geometry", description: "Cartesian plane, quadrants, plotting ordered pairs", dayCount: 5, difficulty: "easy", questionCount: 20 },
        { slug: "linear-equations-two-variables", name: "Linear Equations in Two Variables", description: "Solutions, graphing linear equations, parallel-to-axis lines", dayCount: 6, difficulty: "medium", questionCount: 25 },
        { slug: "introduction-euclids-geometry", name: "Introduction to Euclid's Geometry", description: "Axioms, postulates, theorems, fifth postulate", dayCount: 5, difficulty: "easy", questionCount: 15 },
        { slug: "lines-and-angles", name: "Lines and Angles", description: "Angle pairs, parallel lines, transversal, triangle angle sum", dayCount: 7, difficulty: "medium", questionCount: 25 },
        { slug: "triangles", name: "Triangles", description: "Congruence rules SAS ASA SSS RHS, triangle inequalities", dayCount: 8, difficulty: "medium", questionCount: 30 },
        { slug: "quadrilaterals", name: "Quadrilaterals", description: "Properties of parallelogram, mid-point theorem", dayCount: 6, difficulty: "medium", questionCount: 25 },
        { slug: "areas-parallelograms-triangles", name: "Areas of Parallelograms and Triangles", description: "Area relationships, same base and same parallels", dayCount: 5, difficulty: "medium", questionCount: 20 },
        { slug: "circles", name: "Circles", description: "Chords, angles, arcs, cyclic quadrilaterals", dayCount: 7, difficulty: "hard", questionCount: 25 },
        { slug: "constructions", name: "Constructions", description: "Angle bisectors, constructing triangles with given conditions", dayCount: 5, difficulty: "medium", questionCount: 15 },
        { slug: "herons-formula", name: "Heron's Formula", description: "Triangle area using Heron's formula and applications", dayCount: 4, difficulty: "easy", questionCount: 20 },
        { slug: "surface-areas-volumes", name: "Surface Areas and Volumes", description: "Cuboid, cube, cylinder, cone, sphere formulas", dayCount: 8, difficulty: "hard", questionCount: 30 },
        { slug: "statistics", name: "Statistics", description: "Data collection, mean, median, mode, bar graphs, histograms", dayCount: 7, difficulty: "medium", questionCount: 25 },
        { slug: "probability", name: "Probability", description: "Experimental and theoretical probability, events", dayCount: 5, difficulty: "easy", questionCount: 20 },
      ],
    },
    {
      slug: "science",
      name: "Science",
      description: "Matter, Atoms, Organisms, Motion, Forces, and Sound",
      icon: "FlaskConical",
      color: "#10B981",
      chapters: [
        { slug: "matter-in-surroundings", name: "Matter in Our Surroundings", description: "States of matter, evaporation, sublimation, interconversion", dayCount: 6, difficulty: "easy", questionCount: 25 },
        { slug: "is-matter-pure", name: "Is Matter Around Us Pure?", description: "Pure substances, mixtures, solutions, separation techniques", dayCount: 6, difficulty: "easy", questionCount: 25 },
        { slug: "atoms-and-molecules", name: "Atoms and Molecules", description: "Dalton's atomic theory, atomic mass, molecules, formulae", dayCount: 7, difficulty: "medium", questionCount: 25 },
        { slug: "structure-of-atom", name: "Structure of the Atom", description: "Discovery of electron, proton, neutron, atomic models", dayCount: 7, difficulty: "medium", questionCount: 25 },
        { slug: "fundamental-unit-of-life", name: "The Fundamental Unit of Life", description: "Cell structure, cell theory, plant vs animal cells, organelles", dayCount: 7, difficulty: "medium", questionCount: 25 },
        { slug: "tissues", name: "Tissues", description: "Plant tissues (meristematic, permanent) and animal tissues", dayCount: 6, difficulty: "medium", questionCount: 25 },
        { slug: "diversity-in-living-organisms", name: "Diversity in Living Organisms", description: "Classification of organisms, kingdoms, phyla, nomenclature", dayCount: 7, difficulty: "medium", questionCount: 25 },
        { slug: "motion", name: "Motion", description: "Distance, displacement, speed, velocity, acceleration, equations", dayCount: 8, difficulty: "medium", questionCount: 30 },
        { slug: "force-laws-of-motion", name: "Force and Laws of Motion", description: "Newton's three laws, inertia, momentum, conservation", dayCount: 7, difficulty: "hard", questionCount: 30 },
        { slug: "gravitation", name: "Gravitation", description: "Universal law of gravitation, free fall, Archimedes' principle", dayCount: 7, difficulty: "hard", questionCount: 25 },
        { slug: "work-and-energy", name: "Work and Energy", description: "Work, power, kinetic and potential energy, conservation of energy", dayCount: 6, difficulty: "medium", questionCount: 25 },
        { slug: "sound", name: "Sound", description: "Wave motion, reflection of sound, echo, sonar, human ear", dayCount: 6, difficulty: "medium", questionCount: 25 },
        { slug: "improvement-in-food-resources", name: "Improvement in Food Resources", description: "Agriculture, crop production, animal husbandry", dayCount: 5, difficulty: "easy", questionCount: 20 },
        { slug: "natural-resources", name: "Natural Resources", description: "Air, water, soil, biogeochemical cycles, ozone depletion", dayCount: 5, difficulty: "easy", questionCount: 20 },
        { slug: "why-do-we-fall-ill", name: "Why Do We Fall Ill?", description: "Health, disease, acute and chronic diseases, infection, immunity", dayCount: 5, difficulty: "easy", questionCount: 20 },
      ],
    },
    {
      slug: "social-science",
      name: "Social Science",
      description: "History, Geography, Civics, and Economics",
      icon: "Globe",
      color: "#8B5CF6",
      chapters: [
        { slug: "french-revolution", name: "The French Revolution", description: "Causes, events, impact of the French Revolution 1789", dayCount: 7, difficulty: "medium", questionCount: 25 },
        { slug: "socialism-europe-russian-revolution", name: "Socialism in Europe and the Russian Revolution", description: "Ideas of socialism, Russian Revolution 1917, Stalin's Russia", dayCount: 7, difficulty: "medium", questionCount: 25 },
        { slug: "nazism-rise-of-hitler", name: "Nazism and the Rise of Hitler", description: "Weimar Republic, Hitler's rise, Holocaust, World War II impact", dayCount: 7, difficulty: "medium", questionCount: 25 },
        { slug: "forest-society-and-colonialism", name: "Forest Society and Colonialism", description: "Deforestation, tribal communities, scientific forestry", dayCount: 5, difficulty: "medium", questionCount: 20 },
        { slug: "pastoralists-in-the-modern-world", name: "Pastoralists in the Modern World", description: "Nomadic communities, colonial impact, movement patterns", dayCount: 5, difficulty: "medium", questionCount: 20 },
        { slug: "india-size-and-location", name: "India — Size and Location", description: "Geographical position, latitude, longitude, India's neighbours", dayCount: 5, difficulty: "easy", questionCount: 20 },
        { slug: "physical-features-of-india", name: "Physical Features of India", description: "Himalayas, Northern Plains, Peninsular Plateau, Islands", dayCount: 6, difficulty: "medium", questionCount: 20 },
        { slug: "drainage", name: "Drainage", description: "River systems, peninsular rivers, lakes, river pollution", dayCount: 5, difficulty: "medium", questionCount: 20 },
        { slug: "climate", name: "Climate", description: "Monsoon, seasons, climatic conditions across India", dayCount: 6, difficulty: "medium", questionCount: 20 },
        { slug: "natural-vegetation-and-wildlife", name: "Natural Vegetation and Wildlife", description: "Biodiversity, forest types, wildlife, conservation", dayCount: 5, difficulty: "easy", questionCount: 20 },
        { slug: "population", name: "Population", description: "Population growth, density, distribution, literacy, health", dayCount: 5, difficulty: "medium", questionCount: 20 },
        { slug: "what-is-democracy-why-democracy", name: "What is Democracy? Why Democracy?", description: "Features of democracy, comparison with other systems", dayCount: 5, difficulty: "easy", questionCount: 20 },
        { slug: "constitutional-design", name: "Constitutional Design", description: "Making of the Indian Constitution, key features, Preamble", dayCount: 6, difficulty: "medium", questionCount: 20 },
        { slug: "electoral-politics", name: "Electoral Politics", description: "Elections, voting, political competition, election commission", dayCount: 5, difficulty: "medium", questionCount: 20 },
        { slug: "working-of-institutions", name: "Working of Institutions", description: "Parliament, executive, judiciary and how they function", dayCount: 6, difficulty: "medium", questionCount: 20 },
        { slug: "democratic-rights", name: "Democratic Rights", description: "Fundamental Rights, legal system, role of courts", dayCount: 5, difficulty: "medium", questionCount: 20 },
        { slug: "the-story-of-village-palampur", name: "The Story of Village Palampur", description: "Economic activities, farming, non-farm activities in a village", dayCount: 5, difficulty: "easy", questionCount: 20 },
        { slug: "people-as-resource", name: "People as Resource", description: "Human capital, education, health, quality of population", dayCount: 5, difficulty: "easy", questionCount: 20 },
        { slug: "poverty-as-a-challenge", name: "Poverty as a Challenge", description: "Poverty in India, poverty line, causes, government schemes", dayCount: 5, difficulty: "medium", questionCount: 20 },
        { slug: "food-security-in-india", name: "Food Security in India", description: "Food security, buffer stock, public distribution system", dayCount: 4, difficulty: "easy", questionCount: 20 },
      ],
    },
    {
      slug: "english",
      name: "English",
      description: "Beehive, Moments — prose, poetry, grammar, writing",
      icon: "BookOpen",
      color: "#F59E0B",
      chapters: [
        { slug: "the-fun-they-had", name: "The Fun They Had", description: "Prose — Isaac Asimov's story about future schooling", dayCount: 4, difficulty: "easy", questionCount: 15 },
        { slug: "the-sound-of-music", name: "The Sound of Music", description: "Prose — Evelyn Glennie and Bismillah Khan's stories", dayCount: 4, difficulty: "easy", questionCount: 15 },
        { slug: "the-little-girl", name: "The Little Girl", description: "Prose — Katherine Mansfield's story about fear and love", dayCount: 4, difficulty: "easy", questionCount: 15 },
        { slug: "a-truly-beautiful-mind", name: "A Truly Beautiful Mind", description: "Prose — Einstein's life and contributions to peace", dayCount: 4, difficulty: "medium", questionCount: 15 },
        { slug: "the-snake-and-the-mirror", name: "The Snake and the Mirror", description: "Prose — humorous story about a doctor and a snake", dayCount: 4, difficulty: "easy", questionCount: 15 },
        { slug: "my-childhood", name: "My Childhood", description: "Prose — A. P. J. Abdul Kalam's memoir of his early years", dayCount: 4, difficulty: "easy", questionCount: 15 },
        { slug: "packing", name: "Packing", description: "Prose — Jerome K. Jerome's humorous tale about packing", dayCount: 4, difficulty: "easy", questionCount: 15 },
        { slug: "reach-for-the-top", name: "Reach for the Top", description: "Prose — Santosh Yadav and Maria Sharapova's inspiring stories", dayCount: 4, difficulty: "easy", questionCount: 15 },
        { slug: "the-bond-of-love", name: "The Bond of Love", description: "Prose — Kenneth Anderson's story of love for a bear cub", dayCount: 4, difficulty: "easy", questionCount: 15 },
        { slug: "kathmandu", name: "Kathmandu", description: "Prose — Vikram Seth's account of his visit to Kathmandu", dayCount: 4, difficulty: "medium", questionCount: 15 },
        { slug: "if-i-were-you", name: "If I Were You", description: "Prose — Douglas James's dramatic story of identity and wit", dayCount: 4, difficulty: "medium", questionCount: 15 },
        { slug: "grammar-and-writing", name: "Grammar and Writing Skills", description: "Tenses, reported speech, letter writing, notice, message", dayCount: 10, difficulty: "medium", questionCount: 30 },
      ],
    },
    {
      slug: "hindi",
      name: "Hindi",
      description: "Kshitij, Kritika — gadya, padya, vyakaran",
      icon: "Languages",
      color: "#EF4444",
      chapters: [
        { slug: "do-bailon-ki-katha", name: "दो बैलों की कथा", description: "Premchand ki rachna — swaadheenata ka sanghars", dayCount: 4, difficulty: "easy", questionCount: 15 },
        { slug: "lahaas-ka-bina", name: "ल्हासा की ओर", description: "Rahul Sankrityayan ka yatra vrittant — Tibat ki yatra", dayCount: 4, difficulty: "easy", questionCount: 15 },
        { slug: "upekhsha", name: "उपेक्षा", description: "Satyajit Ray ki kahani — sammaan aur upeksha ka virodhaabhas", dayCount: 4, difficulty: "medium", questionCount: 15 },
        { slug: "tumhari-fitta", name: "तुम कब जाओगे अतिथि", description: "Sharat Chandra ki rachna — atithi devo bhava ki paribhaasha", dayCount: 4, difficulty: "easy", questionCount: 15 },
        { slug: "vaakh", name: "वाख", description: "Lalladd ki kavitaayen — aatma-khoj aur bhakti", dayCount: 4, difficulty: "medium", questionCount: 15 },
        { slug: "savaiya-kavach", name: "सवैया और कवच", description: "Meera ki bhakti kavitaa — praem aur samarpan", dayCount: 4, difficulty: "medium", questionCount: 15 },
        { slug: "kaidi-aur-kokila", name: "कैदी और कोकिला", description: "Makhanlal Chaturvedi ki patriotic kavita", dayCount: 4, difficulty: "medium", questionCount: 15 },
        { slug: "grammar", name: "व्याकरण — संधि, समास, अलंकार", description: "Upsarg, pratyay, sandhi, samas, vakya parivartan", dayCount: 10, difficulty: "hard", questionCount: 30 },
        { slug: "rachna", name: "लेखन कौशल", description: "Anuched lekhan, patra lekhan, nibandh, saaransh", dayCount: 7, difficulty: "medium", questionCount: 25 },
        { slug: "isl-adaayegee", name: "इस जल प्रलय में", description: "Fanishwarnath Renu ki reportaj — Bihar baaadh 1967", dayCount: 4, difficulty: "medium", questionCount: 15 },
        { slug: "mere-sang-ki-auraten", name: "मेरे संग की औरतें", description: "Mridu Rai ki memoir — poori pidhi ki mahilaaon ki kahani", dayCount: 4, difficulty: "medium", questionCount: 15 },
        { slug: "reedh-ki-haddee", name: "रीढ़ की हड्डी", description: "Jagdishchandra Mathur ka naatak — nari sashaktikaran", dayCount: 4, difficulty: "medium", questionCount: 15 },
      ],
    },
    {
      slug: "computer-applications",
      name: "Computer Applications",
      description: "Computers, OS, MS Office, and basic programming",
      icon: "Monitor",
      color: "#06B6D4",
      chapters: [
        { slug: "basics-of-computer", name: "Basics of Computer", description: "History of computers, generations, types, components", dayCount: 5, difficulty: "easy", questionCount: 20 },
        { slug: "software-concepts", name: "Software Concepts", description: "System software, application software, programming languages", dayCount: 5, difficulty: "easy", questionCount: 20 },
        { slug: "operating-systems", name: "Operating Systems", description: "Functions of OS, types, Windows and Linux basics", dayCount: 6, difficulty: "medium", questionCount: 20 },
        { slug: "ms-word", name: "Microsoft Word", description: "Document creation, formatting, tables, mail merge", dayCount: 5, difficulty: "easy", questionCount: 15 },
        { slug: "ms-excel", name: "Microsoft Excel", description: "Spreadsheets, formulas, charts, data sorting and filtering", dayCount: 5, difficulty: "medium", questionCount: 15 },
        { slug: "ms-powerpoint", name: "Microsoft PowerPoint", description: "Presentations, slides, animations, transitions", dayCount: 4, difficulty: "easy", questionCount: 15 },
        { slug: "internet-and-email", name: "Internet and Email", description: "Browsing, search engines, email, social media, cyber safety", dayCount: 5, difficulty: "easy", questionCount: 15 },
        { slug: "introduction-to-programming", name: "Introduction to Programming", description: "Algorithms, flowcharts, basic programming concepts", dayCount: 6, difficulty: "medium", questionCount: 20 },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
 * Helper Functions for Curriculum Navigation
 * ───────────────────────────────────────────── */

/**
 * Finds a subject by slug within a given class catalog.
 * Returns undefined if the subject is not found.
 *
 * @param catalog - The class catalog to search in
 * @param subjectSlug - URL-safe slug of the subject
 * @returns The Subject object or undefined
 */
export function getSubjectBySlug(catalog: ClassCatalog, subjectSlug: string): Subject | undefined {
  return catalog.subjects.find((s) => s.slug === subjectSlug);
}

/**
 * Finds a chapter by slug within a subject.
 * Returns undefined if the chapter is not found.
 *
 * @param subject - The Subject object to search in
 * @param chapterSlug - URL-safe slug of the chapter
 * @returns The Chapter object or undefined
 */
export function getChapterBySlug(subject: Subject, chapterSlug: string): Chapter | undefined {
  return subject.chapters.find((c) => c.slug === chapterSlug);
}

/**
 * Returns the total number of study days for a given subject
 * by summing the dayCount of all its chapters.
 *
 * @param subject - The Subject object
 * @returns Total study day count
 */
export function getTotalDaysForSubject(subject: Subject): number {
  return subject.chapters.reduce((sum, ch) => sum + ch.dayCount, 0);
}

/**
 * Returns the total question count for a subject.
 *
 * @param subject - The Subject object
 * @returns Total question count
 */
export function getTotalQuestionsForSubject(subject: Subject): number {
  return subject.chapters.reduce((sum, ch) => sum + ch.questionCount, 0);
}

/**
 * Returns the catalog for a given class ID.
 * Currently supports class-9. More classes will be added as content is ready.
 *
 * @param classId - e.g. "class-9", "class-10"
 * @returns ClassCatalog or undefined
 */
export function getCatalogByClass(classId: string): ClassCatalog | undefined {
  const catalogs: Record<string, ClassCatalog> = {
    "class-9": CLASS_9_CATALOG,
  };
  return catalogs[classId];
}
