/**
 * FILE: learning-catalog.ts
 * LOCATION: src/lib/curriculum/learning-catalog.ts
 * PURPOSE: Shared catalog for dynamic learning plan pages. This keeps class
 *          subject routes and engineering plan routes generated from typed data
 *          instead of hard-coded broken links.
 * USED BY: Dynamic class detail routes and engineering detail route
 * LAST UPDATED: 2026-05-11
 */

import { ENGINEERING_LANGUAGES, ENGINEERING_SKILLS } from "@/lib/constants";

export interface LearningPlan {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  durationDays: number;
  chapters: Array<string | {
    slug: string;
    name: string;
    description?: string;
    dayCount?: number;
    questionCount?: number;
    difficulty?: "easy" | "medium" | "hard";
  }>;
  accent: string;
  backHref: string;
  chapterHrefBase?: string;
  iconName?: string;
}

const CLASS_9_SUBJECTS: Record<string, Omit<LearningPlan, "slug" | "backHref">> = {
  "mathematics": { title: "Mathematics", eyebrow: "Class 9", description: "Number systems, algebra, geometry, mensuration, and statistics foundations.", durationDays: 45, accent: "#2563EB", chapters: ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations", "Triangles", "Statistics"] },
  "science": {
    title: "Science",
    eyebrow: "Class 9",
    description: "Complete NCERT Science — Physics, Chemistry, and Biology with deep explanations, real-life examples, and 20 questions per topic.",
    durationDays: 90,
    accent: "#059669",
    chapters: [
      { slug: "matter-in-our-surroundings", name: "Matter in Our Surroundings", description: "States of matter, particle nature, evaporation, and phase changes.", dayCount: 6, difficulty: "easy", questionCount: 20 },
      { slug: "is-matter-around-us-pure", name: "Is Matter Around Us Pure?", description: "Mixtures, solutions, suspensions, colloids, and separation techniques.", dayCount: 6, difficulty: "easy", questionCount: 20 },
      { slug: "atoms-and-molecules", name: "Atoms and Molecules", description: "Dalton's theory, atomic mass, molecular mass, mole concept.", dayCount: 7, difficulty: "medium", questionCount: 20 },
      { slug: "structure-of-the-atom", name: "Structure of the Atom", description: "Thomson, Rutherford, Bohr models, electrons, protons, neutrons.", dayCount: 7, difficulty: "medium", questionCount: 20 },
      { slug: "the-fundamental-unit-of-life", name: "The Fundamental Unit of Life", description: "Cell structure, organelles, plant vs animal cells.", dayCount: 6, difficulty: "easy", questionCount: 20 },
      { slug: "tissues", name: "Tissues", description: "Plant and animal tissues, meristematic, permanent, epithelial, connective.", dayCount: 6, difficulty: "medium", questionCount: 20 },
      { slug: "motion", name: "Motion", description: "Distance, displacement, speed, velocity, acceleration, graphs, equations.", dayCount: 7, difficulty: "medium", questionCount: 20 },
      { slug: "force-and-laws-of-motion", name: "Force and Laws of Motion", description: "Newton's three laws, inertia, momentum, conservation of momentum.", dayCount: 8, difficulty: "hard", questionCount: 100 },
      { slug: "gravitation", name: "Gravitation", description: "Universal law of gravitation, free fall, weight, mass, thrust, pressure.", dayCount: 7, difficulty: "hard", questionCount: 20 },
      { slug: "work-and-energy", name: "Work and Energy", description: "Work, kinetic energy, potential energy, power, conservation of energy.", dayCount: 7, difficulty: "hard", questionCount: 20 },
      { slug: "sound", name: "Sound", description: "Production, propagation, reflection, echo, ultrasound, human ear.", dayCount: 6, difficulty: "medium", questionCount: 20 },
      { slug: "why-do-we-fall-ill", name: "Why Do We Fall Ill?", description: "Health, disease, infectious and non-infectious diseases, prevention.", dayCount: 5, difficulty: "easy", questionCount: 20 },
      { slug: "natural-resources", name: "Natural Resources", description: "Air, water, soil pollution, biogeochemical cycles, ozone layer.", dayCount: 5, difficulty: "easy", questionCount: 20 },
      { slug: "improvement-in-food-resources", name: "Improvement in Food Resources", description: "Crop improvement, animal husbandry, bee-keeping, fishery.", dayCount: 5, difficulty: "easy", questionCount: 20 },
    ],
  },
  "social-science": { title: "Social Science", eyebrow: "Class 9", description: "History, geography, civics, and economics in one organized revision path.", durationDays: 40, accent: "#7C3AED", chapters: ["French Revolution", "India Size and Location", "Democracy", "Poverty", "Drainage", "Climate"] },
  "english": { title: "English", eyebrow: "Class 9", description: "Reading, grammar, writing, and literature practice for stronger expression.", durationDays: 30, accent: "#D97706", chapters: ["Reading Skills", "Grammar Basics", "Writing Practice", "Beehive Prose", "Poetry", "Moments"] },
  "hindi": { title: "Hindi", eyebrow: "Class 9", description: "Literature, grammar, and writing practice with chapter-wise checkpoints.", durationDays: 30, accent: "#DC2626", chapters: ["Gadya", "Padya", "Vyakaran", "Lekhan", "Path Abhyas", "Revision"] },
  "sanskrit": { title: "Sanskrit", eyebrow: "Class 9", description: "Shemushi textbook, grammar, shloka, and translation practice.", durationDays: 25, accent: "#B45309", chapters: ["Bharateevasantgeetih", "Svaranjanee", "Godohnam", "Kalpataruh", "Suktimouktikam", "Bhratrusnehe", "Prativatsyam", "Louhatulakooh", "Siktakakelikoushlam", "Jatayoh Shauryam"] },
  "information-technology": { title: "Information Technology (IT)", eyebrow: "Class 9", description: "Computer systems, digital documentation, spreadsheets, presentations, and web apps.", durationDays: 25, accent: "#0EA5E9", chapters: ["Communication Skills", "Self-Management", "IT Tools", "Entrepreneurial Skills", "Green Skills", "Electronic Spreadsheet", "Digital Documentation", "Web Applications"] },
  "artificial-intelligence": { title: "Artificial Intelligence (AI)", eyebrow: "Class 9", description: "Introduction to AI, machine learning, natural language processing, and ethics.", durationDays: 25, accent: "#8B5CF6", chapters: ["Introduction to AI", "AI Project Cycle", "Neural Networks", "AI Ethics", "Computer Vision", "Natural Language Processing", "AI Applications", "AI and Society"] },
  "computer-applications": { title: "Computer Applications", eyebrow: "Class 9", description: "Digital literacy, office tools, internet basics, and programming foundations.", durationDays: 25, accent: "#0891B2", chapters: ["Computer Basics", "Internet", "HTML", "Cyber Safety", "Spreadsheets", "Project"] },
  "physical-education": { title: "Physical Education", eyebrow: "Class 9", description: "Health, fitness, yoga, sports rules, and physical wellness.", durationDays: 20, accent: "#16A34A", chapters: ["Physical Fitness", "Athletics", "Yoga", "Traditional Games", "Health Education", "First Aid"] },
  "art-education": { title: "Art Education", eyebrow: "Class 9", description: "Visual arts, drawing, painting, and creative expression.", durationDays: 15, accent: "#EC4899", chapters: ["Elements of Art", "Drawing Techniques", "Painting", "Sculpture", "Indian Art Heritage"] },
  "work-education": { title: "Work Education", eyebrow: "Class 9", description: "Practical skills, community service, and vocational awareness.", durationDays: 15, accent: "#F97316", chapters: ["Self-Help Skills", "Community Living", "Vocational Skills", "Productive Work", "Health and Hygiene"] },
  "health-physical-activity": { title: "Health & Physical Activity", eyebrow: "Class 9", description: "Nutrition, mental health, hygiene, and active lifestyle.", durationDays: 15, accent: "#14B8A6", chapters: ["Nutrition Basics", "Mental Health Awareness", "Personal Hygiene", "Active Lifestyle", "Safety and First Aid"] },
};

const CLASS_10_SUBJECTS: Record<string, Omit<LearningPlan, "slug" | "backHref">> = {
  "mathematics-standard": { title: "Maths Standard", eyebrow: "Class 10", description: "Board-focused standard mathematics practice with timed revision.", durationDays: 50, accent: "#2563EB", chapters: ["Real Numbers", "Polynomials", "Pair of Equations", "Quadratic Equations", "Trigonometry", "Statistics"] },
  "mathematics-basic": { title: "Maths Basic", eyebrow: "Class 10", description: "Concept-first mathematics plan for confident board exam performance.", durationDays: 45, accent: "#4F46E5", chapters: ["Real Numbers", "Polynomials", "Linear Equations", "Triangles", "Circles", "Probability"] },
  "science": { title: "Science", eyebrow: "Class 10", description: "Chemistry, physics, and biology revision mapped to board-style practice.", durationDays: 50, accent: "#059669", chapters: ["Chemical Reactions", "Acids Bases Salts", "Life Processes", "Electricity", "Light", "Environment"] },
  "social-science": { title: "Social Science", eyebrow: "Class 10", description: "High-retention history, civics, geography, and economics revision.", durationDays: 45, accent: "#7C3AED", chapters: ["Nationalism", "Resources", "Power Sharing", "Money and Credit", "Manufacturing", "Globalization"] },
  "english": { title: "English", eyebrow: "Class 10", description: "Literature, writing, and grammar preparation with scoring practice.", durationDays: 30, accent: "#D97706", chapters: ["Reading", "Writing", "Grammar", "First Flight", "Footprints", "Sample Paper"] },
  "hindi": { title: "Hindi", eyebrow: "Class 10", description: "Chapter-wise Hindi literature and grammar support for board preparation.", durationDays: 30, accent: "#DC2626", chapters: ["Sparsh", "Sanchayan", "Vyakaran", "Lekhan", "Practice", "Revision"] },
};

const STREAM_SUBJECTS: Record<string, Record<string, Omit<LearningPlan, "slug" | "backHref">>> = {
  science: {
    physics: { title: "Physics", eyebrow: "Science Stream", description: "Concepts, formulas, derivations, and numerical practice.", durationDays: 60, accent: "#2563EB", chapters: ["Units", "Motion", "Laws", "Work Energy", "Thermodynamics", "Waves"] },
    chemistry: { title: "Chemistry", eyebrow: "Science Stream", description: "Physical, organic, and inorganic foundations with question practice.", durationDays: 60, accent: "#059669", chapters: ["Mole Concept", "Atomic Structure", "Bonding", "Thermodynamics", "Equilibrium", "Organic Basics"] },
    mathematics: { title: "Mathematics", eyebrow: "Science Stream", description: "Algebra, calculus, coordinate geometry, and probability mastery.", durationDays: 65, accent: "#7C3AED", chapters: ["Sets", "Relations", "Trigonometry", "Limits", "Derivatives", "Probability"] },
    biology: { title: "Biology", eyebrow: "Science Stream", description: "NCERT-aligned biology learning with diagrams and recall practice.", durationDays: 60, accent: "#D97706", chapters: ["Living World", "Plant Kingdom", "Cell", "Biomolecules", "Anatomy", "Physiology"] },
    "computer-science": { title: "Computer Science", eyebrow: "Science Stream", description: "Programming, logic, data handling, and project foundations.", durationDays: 45, accent: "#0891B2", chapters: ["Python Basics", "Control Flow", "Functions", "Data Structures", "Files", "Project"] },
    english: { title: "English", eyebrow: "Senior Secondary", description: "Reading, writing, grammar, and literature preparation.", durationDays: 30, accent: "#DC2626", chapters: ["Reading", "Writing", "Grammar", "Hornbill", "Snapshots", "Practice"] },
  },
  commerce: {
    accountancy: { title: "Accountancy", eyebrow: "Commerce Stream", description: "Journal, ledger, trial balance, and financial statement practice.", durationDays: 55, accent: "#059669", chapters: ["Accounting Basics", "Journal", "Ledger", "Trial Balance", "Depreciation", "Statements"] },
    "business-studies": { title: "Business Studies", eyebrow: "Commerce Stream", description: "Business concepts explained with case-based practice.", durationDays: 45, accent: "#2563EB", chapters: ["Business Nature", "Forms", "Private Public", "Services", "Trade", "Social Responsibility"] },
    economics: { title: "Economics", eyebrow: "Commerce Stream", description: "Micro and statistics concepts with exam-style application.", durationDays: 45, accent: "#D97706", chapters: ["Economy Basics", "Statistics", "Collection", "Presentation", "Measures", "Correlation"] },
    mathematics: { title: "Mathematics", eyebrow: "Commerce Stream", description: "Applied math foundations for commerce and entrance pathways.", durationDays: 55, accent: "#7C3AED", chapters: ["Sets", "Functions", "Linear Inequalities", "Permutations", "Statistics", "Probability"] },
    english: { title: "English", eyebrow: "Senior Secondary", description: "Reading, writing, grammar, and literature preparation.", durationDays: 30, accent: "#DC2626", chapters: ["Reading", "Writing", "Grammar", "Literature", "Practice", "Mock"] },
  },
  arts: {
    history: { title: "History", eyebrow: "Humanities Stream", description: "Chronology, themes, sources, and answer writing practice.", durationDays: 45, accent: "#D97706", chapters: ["Early Societies", "Empires", "Nomadic Empires", "Three Orders", "Changing Traditions", "Indigenous Peoples"] },
    geography: { title: "Geography", eyebrow: "Humanities Stream", description: "Physical geography, maps, and concept recall checkpoints.", durationDays: 45, accent: "#059669", chapters: ["Earth Origin", "Interior", "Landforms", "Climate", "Water", "Life"] },
    "political-science": { title: "Political Science", eyebrow: "Humanities Stream", description: "Constitution, political theory, and current relevance.", durationDays: 40, accent: "#2563EB", chapters: ["Constitution", "Rights", "Election", "Executive", "Legislature", "Judiciary"] },
    sociology: { title: "Sociology", eyebrow: "Humanities Stream", description: "Society, culture, institutions, and sociological thinking.", durationDays: 35, accent: "#7C3AED", chapters: ["Society", "Terms", "Culture", "Socialization", "Research", "Institutions"] },
    psychology: { title: "Psychology", eyebrow: "Humanities Stream", description: "Human behavior, learning, memory, and development basics.", durationDays: 35, accent: "#DC2626", chapters: ["Psychology Basics", "Methods", "Human Development", "Learning", "Memory", "Motivation"] },
    english: { title: "English", eyebrow: "Senior Secondary", description: "Reading, writing, grammar, and literature preparation.", durationDays: 30, accent: "#0891B2", chapters: ["Reading", "Writing", "Grammar", "Literature", "Practice", "Mock"] },
  },
};

/** Returns a plan for Class 9/10 subject detail pages. */
export function getSimpleClassPlan(classSlug: "class-9" | "class-10", subject: string): LearningPlan | null {
  const source = classSlug === "class-9" ? CLASS_9_SUBJECTS : CLASS_10_SUBJECTS;
  const plan = source[subject];
  return plan ? { ...plan, slug: subject, backHref: `/${classSlug}` } : null;
}

/** Returns a plan for Class 11/12 stream subject detail pages. */
export function getStreamClassPlan(classSlug: "class-11" | "class-12", stream: string, subject: string): LearningPlan | null {
  const plan = STREAM_SUBJECTS[stream]?.[subject];
  const suffix = classSlug === "class-12" ? " board and entrance revision." : " concept-building foundation.";
  return plan ? { ...plan, eyebrow: `${classSlug.replace("-", " ")} ${plan.eyebrow}`, description: `${plan.description}${suffix}`, slug: subject, backHref: `/${classSlug}` } : null;
}

/** Returns a plan for engineering language or skill detail pages. */
export function getEngineeringPlan(slug: string): LearningPlan | null {
  const language = ENGINEERING_LANGUAGES.find((item) => item.id === slug);
  if (language) {
    return {
      slug,
      title: language.name,
      eyebrow: "Engineering Track",
      description: `${language.name} learning path with daily coding practice and interview-ready checkpoints.`,
      durationDays: language.days,
      accent: language.color,
      backHref: "/engineering",
      chapters: ["Setup", "Syntax", "Control Flow", "Functions", "Data Structures", "Practice Project"],
    };
  }

  const skill = ENGINEERING_SKILLS.find((item) => item.id === slug);
  if (!skill) {
    return null;
  }

  return {
    slug,
    title: skill.name,
    eyebrow: "Core CS Skill",
    description: `${skill.name} plan with structured lessons, practice, and revision checkpoints.`,
    durationDays: skill.days,
    accent: "#4F46E5",
    backHref: "/engineering",
    chapters: ["Fundamentals", "Core Concepts", "Patterns", "Practice Set", "Mock Challenge", "Revision"],
  };
}

/** Static params for Class 9 and Class 10 dynamic subject pages. */
export function getSimpleClassParams(classSlug: "class-9" | "class-10") {
  const source = classSlug === "class-9" ? CLASS_9_SUBJECTS : CLASS_10_SUBJECTS;
  return Object.keys(source).map((subject) => ({ subject }));
}

/** Static params for Class 11 and Class 12 stream subject pages. */
export function getStreamClassParams() {
  return Object.entries(STREAM_SUBJECTS).flatMap(([stream, subjects]) =>
    Object.keys(subjects).map((subject) => ({ stream, subject })),
  );
}

/** Static params for engineering dynamic plan pages. */
export function getEngineeringParams() {
  return [...ENGINEERING_LANGUAGES, ...ENGINEERING_SKILLS].map((item) => ({ slug: item.id }));
}
