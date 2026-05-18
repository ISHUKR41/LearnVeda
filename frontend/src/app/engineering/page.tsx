/**
 * FILE: page.tsx
 * LOCATION: src/app/engineering/page.tsx
 * PURPOSE: Engineering track landing page — shows all programming languages
 *          and technical skills available for engineering students.
 * USED BY: Next.js App Router — renders at "/engineering"
 * DEPENDENCIES: lucide-react, Engineering.module.css, constants.ts
 * LAST UPDATED: 2026-05-12
 */

import Link from "next/link";
import Image from "next/image";
import {
  Code2, Database,
  GitBranch, Globe, HardDrive, Network,
  Trophy, UserCheck, Workflow, ArrowRight
} from "lucide-react";
import { ENGINEERING_LANGUAGES, ENGINEERING_SKILLS } from "@/lib/constants";
import styles from "./Engineering.module.css";

export const metadata = {
  title: "Engineering Track",
  description: "Master 12+ programming languages and core CS subjects with structured day-wise learning plans.",
};

/** Map skill IDs to Lucide icons */
const SKILL_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  dsa: GitBranch, "web-dev": Globe, "system-design": Workflow,
  dbms: Database, os: HardDrive, cn: Network,
  "git-github": GitBranch, "competitive-programming": Trophy,
  "interview-prep": UserCheck,
};

export default function EngineeringPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Banner */}
        <div className={styles.banner}>
          <Image
            src="/images/engineering-hero.png"
            alt="Engineering learner working through programming and systems concepts"
            fill
            priority
            className={styles.bannerMedia}
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div className={styles.bannerOverlay} aria-hidden="true" />
          <div className={styles.bannerContent}>
            <div className={styles.bannerLabel}><Code2 size={14} /> Engineering Track</div>
            <h1 className={styles.bannerTitle}>Code Your Future</h1>
            <p className={styles.bannerSubtitle}>
              Master programming languages and core CS subjects with structured day-wise plans.
              From beginner to interview-ready.
            </p>
          </div>
        </div>

        {/* Programming Languages */}
        <h2 className={styles.sectionTitle}>Programming Languages</h2>
        <div className={styles.langGrid}>
          {ENGINEERING_LANGUAGES.map((lang) => {
            const diffClass = lang.difficulty === "Beginner" ? styles.diffBeginner
              : lang.difficulty === "Intermediate" ? styles.diffIntermediate
              : styles.diffAdvanced;

            return (
              <Link key={lang.id} href={`/engineering/${lang.id}`} className={`${styles.langCard} ${styles[`lang_${lang.id.replace(/-/g, "_")}`]}`}>
                <div className={styles.langIcon}>
                  {lang.name.charAt(0)}
                </div>
                <h3 className={styles.langName}>{lang.name}</h3>
                <span className={styles.langMeta}>{lang.days}-Day Plan</span>
                <span className={`${styles.langDifficulty} ${diffClass}`}>
                  {lang.difficulty}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Technical Skills */}
        <h2 className={styles.sectionTitle}>Core CS Subjects & Skills</h2>
        <div className={styles.skillGrid}>
          {ENGINEERING_SKILLS.map((skill) => {
            const SkillIcon = SKILL_ICONS[skill.id] || Code2;
            return (
              <Link key={skill.id} href={`/engineering/${skill.id}`} className={styles.skillCard}>
                <div className={styles.skillIcon}><SkillIcon size={18} /></div>
                <div className={styles.skillInfo}>
                  <div className={styles.skillName}>{skill.name}</div>
                  <div className={styles.skillDays}>{skill.days}-Day Plan</div>
                </div>
                <ArrowRight size={16} className={styles.skillArrow} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
