/**
 * FILE: Class11StreamSelector.tsx
 * LOCATION: src/app/class-11/Class11StreamSelector.tsx
 * PURPOSE: Interactive stream tabs and subject cards for Class 11.
 * USED BY: src/app/class-11/page.tsx
 * DEPENDENCIES: react, next/link, lucide-react, Class11.module.css
 * LAST UPDATED: 2026-05-17
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Atom,
  Beaker,
  Brain,
  Briefcase,
  Calculator,
  Clock,
  Code2,
  Dna,
  Landmark,
  Languages,
  MapPin,
  Receipt,
  TrendingUp,
  Users,
} from "lucide-react";
import styles from "./Class11.module.css";

const STREAMS = [
  {
    id: "science",
    name: "Science",
    subjects: [
      { id: "physics", name: "Physics", icon: Atom, chapters: 15, desc: "Concepts, formulas, derivations, and numerical practice.", color: "#2563EB", bg: "#EFF6FF" },
      { id: "chemistry", name: "Chemistry", icon: Beaker, chapters: 14, desc: "Physical, organic, and inorganic foundations.", color: "#059669", bg: "#ECFDF5" },
      { id: "mathematics", name: "Mathematics", icon: Calculator, chapters: 16, desc: "Algebra, calculus, coordinate geometry, and probability.", color: "#7C3AED", bg: "#F5F3FF" },
      { id: "biology", name: "Biology", icon: Dna, chapters: 14, desc: "NCERT-aligned biology learning with diagrams.", color: "#D97706", bg: "#FFFBEB" },
      { id: "computer-science", name: "Computer Science", icon: Code2, chapters: 10, desc: "Programming, logic, data handling, and project foundations.", color: "#0891B2", bg: "#ECFEFF" },
      { id: "english", name: "English", icon: Languages, chapters: 12, desc: "Reading, writing, grammar, and literature preparation.", color: "#DC2626", bg: "#FEF2F2" },
    ],
  },
  {
    id: "commerce",
    name: "Commerce",
    subjects: [
      { id: "accountancy", name: "Accountancy", icon: Receipt, chapters: 12, desc: "Journal, ledger, trial balance, and financial statements.", color: "#059669", bg: "#ECFDF5" },
      { id: "business-studies", name: "Business Studies", icon: Briefcase, chapters: 12, desc: "Business concepts explained with case-based practice.", color: "#2563EB", bg: "#EFF6FF" },
      { id: "economics", name: "Economics", icon: TrendingUp, chapters: 10, desc: "Micro and statistics concepts with exam-style application.", color: "#D97706", bg: "#FFFBEB" },
      { id: "mathematics", name: "Mathematics", icon: Calculator, chapters: 16, desc: "Applied math foundations for commerce and entrance pathways.", color: "#7C3AED", bg: "#F5F3FF" },
      { id: "english", name: "English", icon: Languages, chapters: 12, desc: "Reading, writing, grammar, and literature preparation.", color: "#DC2626", bg: "#FEF2F2" },
    ],
  },
  {
    id: "arts",
    name: "Arts / Humanities",
    subjects: [
      { id: "history", name: "History", icon: Clock, chapters: 11, desc: "Chronology, themes, sources, and answer writing practice.", color: "#D97706", bg: "#FFFBEB" },
      { id: "geography", name: "Geography", icon: MapPin, chapters: 10, desc: "Physical geography, maps, and concept recall.", color: "#059669", bg: "#ECFDF5" },
      { id: "political-science", name: "Political Science", icon: Landmark, chapters: 10, desc: "Constitution, political theory, and current relevance.", color: "#2563EB", bg: "#EFF6FF" },
      { id: "sociology", name: "Sociology", icon: Users, chapters: 10, desc: "Society, culture, institutions, and sociological thinking.", color: "#7C3AED", bg: "#F5F3FF" },
      { id: "psychology", name: "Psychology", icon: Brain, chapters: 10, desc: "Human behavior, learning, memory, and development.", color: "#DC2626", bg: "#FEF2F2" },
      { id: "english", name: "English", icon: Languages, chapters: 12, desc: "Reading, writing, grammar, and literature preparation.", color: "#0891B2", bg: "#ECFEFF" },
    ],
  },
] as const;

export default function Class11StreamSelector() {
  const [activeStream, setActiveStream] = useState<(typeof STREAMS)[number]["id"]>("science");
  const currentStream = STREAMS.find((stream) => stream.id === activeStream) ?? STREAMS[0];

  return (
    <>
      <div className={styles.streamTabs}>
        {STREAMS.map((stream) => (
          <button
            key={stream.id}
            className={`${styles.streamTab} ${activeStream === stream.id ? styles.streamTabActive : ""}`}
            onClick={() => setActiveStream(stream.id)}
          >
            {stream.name}
          </button>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>{currentStream.name} Subjects</h2>

      <div className={styles.subjectGrid}>
        {currentStream.subjects.map((subject) => {
          const SubjectIcon = subject.icon;

          return (
            <Link
              key={subject.id}
              href={`/class-11/${currentStream.id}/${subject.id}`}
              className={styles.subjectCard}
            >
              <div className={styles.cardHeader}>
                <div className={styles.subjectIcon} style={{ "--icon-bg": subject.bg, "--icon-color": subject.color } as React.CSSProperties}>
                  <SubjectIcon size={22} />
                </div>
                <h3 className={styles.subjectName}>{subject.name}</h3>
              </div>
              <p className={styles.subjectDesc}>{subject.desc}</p>
              <div className={styles.cardFooter}>
                <span className={styles.chapterCount}>{subject.chapters} Chapters</span>
                <span className={styles.startBtn}>Start Learning <ArrowRight size={14} /></span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
