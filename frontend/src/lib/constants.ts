/**
 * FILE: constants.ts
 * LOCATION: src/lib/constants.ts
 * PURPOSE: App-wide constants — nav links, classes, subjects, engineering languages,
 *          level table, point values, footer links, and site config.
 * USED BY: Navbar, Footer, Home, Class pages, Engineering, Dashboard
 * DEPENDENCIES: None
 * LAST UPDATED: 2026-05-11
 */

/** Main navigation items shown in the top Navbar */
export const NAV_LINKS = [
  { label: "Home", href: "/", icon: "Home" },
  { label: "Class 9", href: "/class-9", icon: "BookOpen" },
  { label: "Class 10", href: "/class-10", icon: "BookOpen" },
  { label: "Class 11", href: "/class-11", icon: "GraduationCap" },
  { label: "Class 12", href: "/class-12", icon: "GraduationCap" },
  { label: "Engineering", href: "/engineering", icon: "Code2" },
  { label: "Tests", href: "/test", icon: "ClipboardCheck" },
  { label: "Battle", href: "/battle", icon: "Swords" },
  { label: "Leaderboard", href: "/leaderboard", icon: "BarChart3" },
  { label: "Community", href: "/community", icon: "Users" },
  { label: "Events", href: "/events", icon: "Trophy" },
] as const;

/** Class definitions with subjects for Class 9 and 10 */
export const CLASSES_SIMPLE = [
  {
    id: "class-9", name: "Class 9", shortName: "9th",
    description: "Foundation year — build strong basics in all subjects",
    gradient: "from-blue-500 to-cyan-500",
    subjects: [
      { id: "mathematics", name: "Mathematics", chapters: 15 },
      { id: "science", name: "Science", chapters: 15 },
      { id: "social-science", name: "Social Science", chapters: 20 },
      { id: "english", name: "English", chapters: 12 },
      { id: "hindi", name: "Hindi", chapters: 12 },
      { id: "computer-applications", name: "Computer Applications", chapters: 8 },
    ],
  },
  {
    id: "class-10", name: "Class 10", shortName: "10th",
    description: "Board exam prep — structured revision & practice",
    gradient: "from-violet-500 to-purple-500",
    subjects: [
      { id: "mathematics-standard", name: "Maths Standard", chapters: 15 },
      { id: "mathematics-basic", name: "Maths Basic", chapters: 15 },
      { id: "science", name: "Science", chapters: 16 },
      { id: "social-science", name: "Social Science", chapters: 20 },
      { id: "english", name: "English", chapters: 12 },
      { id: "hindi", name: "Hindi", chapters: 12 },
    ],
  },
] as const;

/** Stream-based class definitions for Class 11 and 12 */
export const CLASSES_STREAM = [
  {
    id: "class-11", name: "Class 11", shortName: "11th",
    description: "Stream-based deep learning — Science, Commerce, or Arts",
    gradient: "from-emerald-500 to-teal-500",
    streams: ["Science", "Commerce", "Arts / Humanities"],
  },
  {
    id: "class-12", name: "Class 12", shortName: "12th",
    description: "Board & entrance exam mastery — revision + mock tests",
    gradient: "from-amber-500 to-orange-500",
    streams: ["Science", "Commerce", "Arts / Humanities"],
  },
] as const;

/** Engineering programming languages with day-wise plan durations */
export const ENGINEERING_LANGUAGES = [
  { id: "c-language", name: "C", days: 30, difficulty: "Beginner", color: "#A8B9CC" },
  { id: "cpp", name: "C++", days: 30, difficulty: "Intermediate", color: "#00599C" },
  { id: "java", name: "Java", days: 45, difficulty: "Intermediate", color: "#ED8B00" },
  { id: "python", name: "Python", days: 45, difficulty: "Beginner", color: "#3776AB" },
  { id: "javascript", name: "JavaScript", days: 30, difficulty: "Beginner", color: "#F7DF1E" },
  { id: "typescript", name: "TypeScript", days: 25, difficulty: "Intermediate", color: "#3178C6" },
  { id: "rust", name: "Rust", days: 40, difficulty: "Advanced", color: "#CE412B" },
  { id: "kotlin", name: "Kotlin", days: 30, difficulty: "Intermediate", color: "#7F52FF" },
  { id: "swift", name: "Swift", days: 30, difficulty: "Intermediate", color: "#FA7343" },
  { id: "sql", name: "SQL", days: 20, difficulty: "Beginner", color: "#4479A1" },
  { id: "dart", name: "Dart", days: 25, difficulty: "Beginner", color: "#0175C2" },
  { id: "ruby", name: "Ruby", days: 25, difficulty: "Beginner", color: "#CC342D" },
] as const;

/** Engineering technical subjects (DSA, OS, DBMS, etc.) */
export const ENGINEERING_SKILLS = [
  { id: "dsa", name: "Data Structures & Algorithms", days: 60 },
  { id: "web-dev", name: "Web Development", days: 30 },
  { id: "system-design", name: "System Design", days: 25 },
  { id: "dbms", name: "Database Management", days: 20 },
  { id: "os", name: "Operating Systems", days: 20 },
  { id: "cn", name: "Computer Networks", days: 20 },
  { id: "git-github", name: "Git & GitHub", days: 10 },
  { id: "competitive-programming", name: "Competitive Programming", days: 60 },
  { id: "interview-prep", name: "Interview Preparation", days: 30 },
] as const;

/** XP point values for different user actions */
export const POINT_VALUES = {
  EASY_CORRECT: 10,
  MEDIUM_CORRECT: 20,
  HARD_CORRECT: 35,
  DAY_COMPLETE: 50,
  STREAK_7: 100,
  STREAK_30: 500,
  BATTLE_WIN: 75,
  BATTLE_PARTICIPATE: 15,
  CHAPTER_TEST_COMPLETE: 100,
} as const;

/** Site-wide metadata for SEO */
export const SITE_CONFIG = {
  name: "EduQuest",
  tagline: "Learn. Battle. Level Up.",
  description: "India's gamified learning platform for Class 9-12 and Engineering students.",
  url: "https://eduquest.in",
} as const;

/** Footer link columns */
export const FOOTER_LINKS = {
  platform: [
    { label: "About", href: "/about" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
  ],
  learn: [
    { label: "Class 9", href: "/class-9" },
    { label: "Class 10", href: "/class-10" },
    { label: "Class 11", href: "/class-11" },
    { label: "Class 12", href: "/class-12" },
    { label: "Engineering", href: "/engineering" },
  ],
  community: [
    { label: "Forums", href: "/community" },
    { label: "Tests", href: "/test" },
    { label: "Events", href: "/events" },
    { label: "Leaderboard", href: "/leaderboard" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
