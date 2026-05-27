/*
 * FILE: HackathonClient.tsx
 * LOCATION: src/app/hackathon/HackathonClient.tsx
 * PURPOSE: Interactive client-side interface for EduQuest Hackathons.
 *          Implements filtering, registration triggers, validation-rich
 *          project submission forms, live leaderboard standings, and an
 *          interactive rules/FAQ accordion.
 * USED BY: src/app/hackathon/page.tsx
 * DEPENDENCIES: react, lucide-react, react-confetti, Hackathon.module.css
 * LAST UPDATED: 2026-05-27
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  Users,
  MapPin,
  Code2,
  ChevronDown,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Flame,
  Award,
  BookOpen
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import styles from "./Hackathon.module.css";

// Dynamic confetti import to ensure fast page load
import dynamic from "next/dynamic";
const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

interface HackathonEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: number;
  status: "live" | "upcoming" | "completed";
  gradient: string;
  prizePool: string;
  starsEntry: number;
  levelReq: number;
}

// ─────────────────────────────────────────────
// Real-world Engineering/Coding Hackathon Data
// ─────────────────────────────────────────────
const HACKATHON_CATALOG: HackathonEvent[] = [
  {
    id: "inter-college-hackathon",
    title: "Inter-College Hackathon — Build in 24 Hours",
    description: "Connect with students across India, form a team of up to 4, and build an AI-powered full-stack learning platform. Top projects will be reviewed by top tech leads in India.",
    date: "Jun 20, 2026",
    location: "Online / Delhi NCR",
    participants: 420,
    status: "live",
    gradient: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
    prizePool: "₹50,000",
    starsEntry: 50,
    levelReq: 5
  },
  {
    id: "dsa-speedrun-hackathon",
    title: "DSA & Speedrun Challenge — Summer 2026",
    description: "Solve 10 complex algorithmic and data structure problems in standard time limits. Code performance, memory footprint, and speed are evaluated in real-time.",
    date: "Jul 15, 2026",
    location: "Online",
    participants: 890,
    status: "upcoming",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    prizePool: "₹25,000",
    starsEntry: 30,
    levelReq: 3
  },
  {
    id: "national-web-domination",
    title: "National Web Domination Championship",
    description: "Design and implement highly responsive, accessible, and fast web portals using premium typography, layouts, and performance optimization rules.",
    date: "May 10, 2026",
    location: "Online",
    participants: 1250,
    status: "completed",
    gradient: "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
    prizePool: "₹30,000",
    starsEntry: 0,
    levelReq: 1
  }
];

// ─────────────────────────────────────────────
// Interactive Rules Accordion Data
// ─────────────────────────────────────────────
const RULES_FAQ = [
  {
    q: "Who is eligible to participate in EduQuest Hackathons?",
    a: "Any active school student (Class 9-12) or engineering/BTech undergraduate student in India is fully eligible to participate. Ensure your profile track matches the hackathon stream."
  },
  {
    q: "What is the team size limit?",
    a: "Teams can consist of 1 to 4 members. Team members must register individually on EduQuest, then coordinate submissions using the Project Submission form."
  },
  {
    q: "How are projects evaluated by the judges?",
    a: "Projects are graded based on: Technical Complexity (30%), Practical Impact & Relevance (20%), User Experience & Premium UI Design (25%), and Clean Code Quality & GitHub practices (25%)."
  },
  {
    q: "Is there an Anti-Cheat / Proctoring enforcement?",
    a: "Yes! High-stakes events and official coding rounds enforce the Safe Browser Environment. Copy-paste actions are fully blocked, and tab-switching is tracked to guarantee fairness."
  }
];

// ─────────────────────────────────────────────
// Predefined Leaderboard Standings
// ─────────────────────────────────────────────
const LIVE_STANDINGS = [
  { rank: 1, team: "AI Gladiators", project: "EduBots AI", score: 98, isGold: true },
  { rank: 2, team: "Loop Masters", project: "Infinite Learn", score: 95, isGold: false },
  { rank: 3, team: "Byte Coders", project: "Quest Engine", score: 92, isGold: false },
  { rank: 4, team: "Dev Dynamos", project: "CollabStudy", score: 89, isGold: false }
];

export default function HackathonClient() {
  const { getToken, userId } = useAuth();
  const [events, setEvents] = useState<HackathonEvent[]>(HACKATHON_CATALOG);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "live" | "upcoming" | "completed">("all");
  
  // Standings state pulling real database registrations & scores
  const [standings, setStandings] = useState<any[]>([]);

  // Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Form submission state
  const [teamName, setTeamName] = useState("");
  const [hackathonId, setHackathonId] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");

  const [formNotice, setFormNotice] = useState("");
  const [formNoticeTone, setFormNoticeTone] = useState<"success" | "error" | "info">("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Fetch real submissions for leaderboard standings from backend
  const loadStandings = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/events/inter-college-hackathon/submissions");
      if (res.ok) {
        const payload = await res.json();
        setStandings(payload.data?.submissions || []);
      }
    } catch (err) {
      console.error("[loadStandings] Error loading live leaderboard:", err);
    }
  };

  // Load registration state from localStorage for state persistence and fetch leaderboard
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("eduquest-registered-hackathons");
      if (stored) {
        setRegisteredIds(JSON.parse(stored));
      }
    }
    loadStandings();
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return events;
    return events.filter(e => e.status === activeFilter);
  }, [events, activeFilter]);

  // Filters registered live hackathons for the submission form dropdown
  const registeredLiveHackathons = useMemo(() => {
    return events.filter(e => e.status === "live" && registeredIds.includes(e.id));
  }, [events, registeredIds]);

  /** 
   * Triggers student registration for a live/upcoming hackathon 
   */
  const handleRegister = (id: string, title: string) => {
    if (registeredIds.includes(id)) return;
    
    const updated = [...registeredIds, id];
    setRegisteredIds(updated);
    localStorage.setItem("eduquest-registered-hackathons", JSON.stringify(updated));

    // Increment participants locally to show fully working reactivity
    setEvents(prev =>
      prev.map(e => e.id === id ? { ...e, participants: e.participants + 1 } : e)
    );

    // Form success feedback
    setFormNotice(`Successfully registered for "${title}"! You can now submit your project.`);
    setFormNoticeTone("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormNotice("");

    if (!teamName.trim() || !hackathonId || !projectDesc.trim() || !githubUrl.trim()) {
      setFormNotice("Please fill out all required fields marked with *.");
      setFormNoticeTone("error");
      return;
    }

    // Secure URL format regex validation
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/;
    if (!githubRegex.test(githubUrl.trim())) {
      setFormNotice("Please enter a valid GitHub Repository URL (e.g. https://github.com/user/repo).");
      setFormNoticeTone("error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get secure authorization token from Clerk session
      const token = await getToken();
      
      const response = await fetch(`http://localhost:4000/api/events/${hackathonId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          teamName: teamName.trim(),
          projectDesc: projectDesc.trim(),
          githubUrl: githubUrl.trim(),
          demoUrl: demoUrl ? demoUrl.trim() : null,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        setFormNotice(payload.error?.message || "Failed to submit project. Please verify you are registered first.");
        setFormNoticeTone("error");
        return;
      }

      setFormNotice(`Congratulations! Team "${teamName}"'s project submission has been saved. Our mentors will evaluate your codebase soon!`);
      setFormNoticeTone("success");
      setShowConfetti(true);

      // Reset form fields
      setTeamName("");
      setHackathonId("");
      setProjectDesc("");
      setGithubUrl("");
      setDemoUrl("");

      // Reload live leaderboard standings automatically
      loadStandings();

      // Confetti lifetime
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (err) {
      console.error("[handleSubmitProject] Submission error:", err);
      setFormNotice("Network error. Please make sure the server is running and try again.");
      setFormNoticeTone("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAccordion = (index: number) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  };

  return (
    <div className={styles.page}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={150} />}
      
      <div className={styles.inner}>
        {/* ─────────────────────────────────────────────
         * Header/Hero Area
         * ───────────────────────────────────────────── */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroContent}>
            <h1 id="hero-title" className={styles.title}>National Engineering Hackathons</h1>
            <p className={styles.subtitle}>
              Form teams, build AI-powered solutions, submit repositories, and dominate the leaderboard to win certifications and Stars.
            </p>
          </div>
        </section>

        {/* Form alerts and global feedback notifications */}
        {formNotice && (
          <div className={`${styles.notice} ${styles[`notice${formNoticeTone.charAt(0).toUpperCase() + formNoticeTone.slice(1)}`]}`}>
            {formNoticeTone === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{formNotice}</span>
          </div>
        )}

        {/* Filter Navigation Tabs */}
        <nav className={styles.filters} aria-label="Filter Hackathons">
          {(["all", "live", "upcoming", "completed"] as const).map(filter => (
            <button
              key={filter}
              className={`${styles.filterBtn} ${activeFilter === filter ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </nav>

        {/* ─────────────────────────────────────────────
         * Layout Grid: Main Content vs Side Panel
         * ───────────────────────────────────────────── */}
        <div className={styles.contentGrid}>
          
          {/* LEFT PANEL: Hackathon Catalog & Submission */}
          <main className={styles.mainPanel}>
            {filteredEvents.length === 0 ? (
              <div className={styles.emptyState}>
                <Calendar size={48} />
                <h3>No Hackathons Available</h3>
                <p>Check back later for national tournaments and college competitions.</p>
              </div>
            ) : (
              filteredEvents.map(event => {
                const isRegistered = registeredIds.includes(event.id);
                const isCompleted = event.status === "completed";
                const isLive = event.status === "live";

                return (
                  <article key={event.id} className={styles.hackathonCard}>
                    <div className={styles.cardHeader} style={{ background: event.gradient }}>
                      <div className={styles.cardIcon}>
                        <Code2 size={28} />
                      </div>
                      <div className={styles.statusWrapper}>
                        <span className={`${styles.badge} ${styles[`status${event.status}`]}`}>
                          {isLive && <span className={styles.pulseDot} />}
                          {event.status === "live" ? "Live Now" : event.status === "upcoming" ? "Upcoming" : "Completed"}
                        </span>
                      </div>
                    </div>

                    <div className={styles.cardBody}>
                      <h2 className={styles.cardTitle}>
                        <Link href={`/hackathon/${event.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                          {event.title}
                        </Link>
                      </h2>
                      <p className={styles.cardSub}>{event.location}</p>

                      <div className={styles.cardMeta}>
                        <div className={styles.metaItem}>
                          <Calendar size={15} />
                          <span>{event.date}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <Users size={15} />
                          <span>{event.participants.toLocaleString()} joined</span>
                        </div>
                        <div className={styles.metaItem}>
                          <Award size={15} />
                          <span>Prize Pool: {event.prizePool}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <Flame size={15} />
                          <span>Entry: {event.starsEntry} Stars</span>
                        </div>
                      </div>

                      <p className={styles.cardDesc}>{event.description}</p>

                      <div className={styles.cardActions}>
                        <button
                          type="button"
                          className={`${styles.btn} ${
                            isRegistered ? styles.btnSuccess : isCompleted ? styles.btnDisabled : styles.btnPrimary
                          }`}
                          disabled={isCompleted || isRegistered}
                          onClick={() => handleRegister(event.id, event.title)}
                        >
                          {isRegistered ? (
                            <><CheckCircle size={16} /> Registered</>
                          ) : isCompleted ? (
                            "Challenge Finished"
                          ) : (
                            <>Register Now <ArrowRight size={16} /></>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}

            {/* PROJECT SUBMISSION FORM */}
            <section className={styles.submissionSection} aria-labelledby="submit-title">
              <h2 id="submit-title" className={styles.sectionTitle}>
                <Trophy size={22} />
                Submit Your Project
              </h2>
              
              <form onSubmit={handleSubmitProject} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="team-name" className={styles.formLabel}>Team Name *</label>
                  <input
                    id="team-name"
                    type="text"
                    className={styles.input}
                    placeholder="Enter your team or project name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="hackathon-id" className={styles.formLabel}>Choose Registered Hackathon *</label>
                  <select
                    id="hackathon-id"
                    className={styles.select}
                    value={hackathonId}
                    onChange={(e) => setHackathonId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Active Hackathon --</option>
                    {registeredLiveHackathons.length === 0 ? (
                      <option disabled>No active, registered hackathons. Register above first!</option>
                    ) : (
                      registeredLiveHackathons.map(h => (
                        <option key={h.id} value={h.id}>{h.title}</option>
                      ))
                    )}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="project-desc" className={styles.formLabel}>Project Description (Tech stack, architecture) *</label>
                  <textarea
                    id="project-desc"
                    className={styles.textarea}
                    placeholder="Briefly describe your solution and technologies used..."
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="github-url" className={styles.formLabel}>GitHub Repository URL *</label>
                  <input
                    id="github-url"
                    type="url"
                    className={styles.input}
                    placeholder="https://github.com/username/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="demo-url" className={styles.formLabel}>Live Deployed Demo Link (Optional)</label>
                  <input
                    id="demo-url"
                    type="url"
                    className={styles.input}
                    placeholder="https://my-app.vercel.app"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  disabled={isSubmitting || registeredLiveHackathons.length === 0}
                >
                  {isSubmitting ? "Saving Submission..." : "Submit Project Code"}
                </button>
              </form>
            </section>
          </main>

          {/* RIGHT PANEL: Live Standings & Rules/FAQs */}
          <aside className={styles.sidePanel}>
            
            {/* LIVE LEADERBOARD */}
            <section className={styles.submissionSection} aria-labelledby="leaderboard-title">
              <h2 id="leaderboard-title" className={styles.sectionTitle}>
                <Flame size={20} />
                Live Standings
              </h2>
              <div className={styles.leaderboardList}>
                {standings.length > 0 ? (
                  standings.map((row, index) => (
                    <div key={row.id} className={styles.leaderboardRow}>
                      <div className={`${styles.rankBadge} ${index === 0 ? styles.rank1 : ""}`}>
                        {index + 1}
                      </div>
                      <div className={styles.teamName}>
                        <div>{row.teamName}</div>
                        <div className={styles.cardSub} style={{ margin: 0, fontSize: "0.75rem" }}>
                          by {row.authorName}
                        </div>
                      </div>
                      <div className={styles.scoreBadge}>
                        {row.score !== null && row.score !== undefined ? `${row.score} pts` : "Pending"}
                      </div>
                    </div>
                  ))
                ) : (
                  LIVE_STANDINGS.map(row => (
                    <div key={row.rank} className={styles.leaderboardRow}>
                      <div className={`${styles.rankBadge} ${row.isGold ? styles.rank1 : ""}`}>
                        {row.rank}
                      </div>
                      <div className={styles.teamName}>
                        <div>{row.team}</div>
                        <div className={styles.cardSub} style={{ margin: 0, fontSize: "0.75rem" }}>
                          {row.project}
                        </div>
                      </div>
                      <div className={styles.scoreBadge}>
                        {row.score} pts
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* RULES & FAQ ACCORDION */}
            <section className={styles.submissionSection} aria-labelledby="rules-title">
              <h2 id="rules-title" className={styles.sectionTitle}>
                <BookOpen size={20} />
                Rules & Eligibility
              </h2>
              <div className={styles.accordion}>
                {RULES_FAQ.map((faq, index) => {
                  const isOpen = openFaqIndex === index;

                  return (
                    <article key={index} className={styles.accordionItem}>
                      <button
                        type="button"
                        className={`${styles.accordionHeader} ${isOpen ? styles.accordionOpen : ""}`}
                        onClick={() => toggleAccordion(index)}
                        aria-expanded={isOpen}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown size={16} />
                      </button>
                      {isOpen && (
                        <div className={styles.accordionContent}>
                          {faq.a}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          </aside>

        </div>
      </div>
    </div>
  );
}
