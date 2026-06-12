"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Hackathons.module.css";

interface Hackathon {
  id: string;
  title: string;
  theme: string;
  date: string;
  prizePool: string;
  participants: number;
  image: string;
  status: "upcoming" | "active" | "completed";
}

interface HackathonsClientProps {
  hackathons: Hackathon[];
}

export default function HackathonsClient({ hackathons }: HackathonsClientProps) {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>VidyaBolt Professional</div>
          <h1 className={styles.heroTitle}>
            Build the Future.<br/>
            <span className={styles.gradientText}>Compete Globally.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Join 10,000+ developers in world-class hackathons. Win massive prizes, connect with top companies, and showcase your real-world skills.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.primaryButton}>Explore Challenges</button>
            <button className={styles.secondaryButton}>Host a Hackathon</button>
          </div>
        </div>
        
        {/* Dynamic Background Elements */}
        <div className={styles.glowOrb1}></div>
        <div className={styles.glowOrb2}></div>
      </section>

      {/* Hackathons Grid */}
      <section className={styles.gridSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Hackathons</h2>
          <div className={styles.filterTabs}>
            <button className={`${styles.filterTab} ${styles.activeTab}`}>All</button>
            <button className={styles.filterTab}>Active</button>
            <button className={styles.filterTab}>Upcoming</button>
          </div>
        </div>

        <div className={styles.grid}>
          {hackathons.map((hack) => (
            <Link href={`/hackathons/${hack.id}`} key={hack.id} className={styles.card}>
              <div className={styles.cardImageWrapper}>
                <Image 
                  src={hack.image} 
                  alt={hack.title} 
                  fill 
                  style={{ objectFit: 'cover' }}
                  className={styles.cardImage}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className={styles.statusBadgeWrapper}>
                  <span className={`${styles.statusBadge} ${styles[hack.status]}`}>
                    {hack.status === 'active' ? '🔥 Live Now' : '⏰ Upcoming'}
                  </span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <p className={styles.themeTag}>{hack.theme}</p>
                <h3 className={styles.cardTitle}>{hack.title}</h3>
                
                <div className={styles.cardMetaGrid}>
                  <div className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {hack.date}
                  </div>
                  <div className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87" />
                      <path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                    {hack.participants.toLocaleString()} Enrolled
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.prizeBox}>
                    <span className={styles.prizeLabel}>Prize Pool</span>
                    <span className={styles.prizeAmount}>{hack.prizePool}</span>
                  </div>
                  <span className={styles.viewDetailsText}>View Details &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
