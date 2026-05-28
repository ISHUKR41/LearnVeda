"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HackathonDetail.module.css";

interface TimelineEvent {
  event: string;
  time: string;
}

interface HackathonDetail {
  id: string;
  title: string;
  theme: string;
  description: string;
  date: string;
  prizePool: string;
  participants: number;
  image: string;
  status: "upcoming" | "active" | "completed";
  rules: string[];
  timeline: TimelineEvent[];
}

interface HackathonDetailClientProps {
  hackathon: HackathonDetail;
}

export default function HackathonDetailClient({ hackathon }: HackathonDetailClientProps) {
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = () => {
    // In a real app, this would call an API
    setIsRegistered(true);
    alert(`Successfully registered for ${hackathon.title}!`);
  };

  return (
    <main className={styles.main}>
      <div className={styles.heroBanner}>
        <Image 
          src={hackathon.image} 
          alt={hackathon.title}
          fill
          style={{ objectFit: 'cover', opacity: 0.4 }}
          priority
        />
        <div className={styles.heroGradient}></div>
        
        <div className={styles.heroContent}>
          <Link href="/hackathons" className={styles.backLink}>
            &larr; Back to Hackathons
          </Link>
          <span className={styles.themeTag}>{hackathon.theme}</span>
          <h1 className={styles.title}>{hackathon.title}</h1>
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>📅 {hackathon.date}</span>
            <span className={styles.metaItem}>👥 {hackathon.participants.toLocaleString()} Enrolled</span>
            <span className={styles.metaItem}>💰 {hackathon.prizePool} Prize Pool</span>
          </div>
        </div>
      </div>

      <div className={styles.contentLayout}>
        <div className={styles.mainColumn}>
          <section className={styles.section}>
            <h2>About this Hackathon</h2>
            <p className={styles.description}>{hackathon.description}</p>
          </section>

          <section className={styles.section}>
            <h2>Rules & Requirements</h2>
            <ul className={styles.rulesList}>
              {hackathon.rules.map((rule, idx) => (
                <li key={idx}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.checkIcon}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {rule}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className={styles.sideColumn}>
          <div className={styles.actionCard}>
            <div className={styles.actionCardHeader}>
              <h3>Registration</h3>
              <span className={`${styles.statusBadge} ${styles[hackathon.status]}`}>
                {hackathon.status.toUpperCase()}
              </span>
            </div>
            
            <button 
              className={`${styles.registerButton} ${isRegistered ? styles.registered : ''}`}
              onClick={handleRegister}
              disabled={isRegistered}
            >
              {isRegistered ? 'Registered ✓' : 'Register Now for Free'}
            </button>
            <p className={styles.actionNote}>Limited spots available. Register before August 14th.</p>
          </div>

          <div className={styles.timelineCard}>
            <h3>Timeline</h3>
            <div className={styles.timeline}>
              {hackathon.timeline.map((item, idx) => (
                <div key={idx} className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <p className={styles.timelineEvent}>{item.event}</p>
                    <p className={styles.timelineTime}>{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
