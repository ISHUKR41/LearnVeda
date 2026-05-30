/**
 * FILE: HackathonDetailClient.tsx
 * LOCATION: src/app/hackathon/[id]/HackathonDetailClient.tsx
 * PURPOSE: Interactive client-side portal for an individual Hackathon.
 *          Handles fetching hackathon specs, checking user register state,
 *          triggering database registrations, handling repository submissions,
 *          rendering dynamic countdowns, and rendering the live standings.
 * USED BY: src/app/hackathon/[id]/page.tsx
 * DEPENDENCIES: react, next/link, lucide-react, @clerk/nextjs, react-confetti
 * LAST UPDATED: 2026-05-27
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ArrowLeft,
  Flame,
  Award,
  Lock,
  Eye,
  ShieldCheck,
  Send,
  Timer
} from "lucide-react";
import styles from "./HackathonDetail.module.css";

// Dynamic confetti import to ensure fast page load
import dynamic from "next/dynamic";
const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

interface Hackathon {
  id: string;
  title: string;
  description: string;
  eventType: string;
  venue: string;
  maxParticipants: number;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  isProctored: boolean;
  requiresSafeBrowser: boolean;
  status: string;
  bannerUrl: string;
  collegeName: string;
  registrationCount: number;
}

interface Submission {
  id: string;
  teamName: string;
  projectDesc: string;
  githubUrl: string;
  demoUrl: string | null;
  score: number | null;
  submittedAt: string;
  authorName: string;
}

interface HackathonDetailClientProps {
  id: string;
}

export default function HackathonDetailClient({ id }: HackathonDetailClientProps) {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => setIsSignedIn(r.ok))
      .catch(() => setIsSignedIn(false));
  }, []);

  // API states
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [standings, setStandings] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // User status state
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Form state
  const [teamName, setTeamName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UX states
  const [formNotice, setFormNotice] = useState("");
  const [formNoticeTone, setFormNoticeTone] = useState<"success" | "error" | "info">("info");
  const [showConfetti, setShowConfetti] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Live countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Load hackathon details & standings
  const loadHackathonData = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");

      // 1. Fetch details
      const detailRes = await fetch(`http://localhost:4000/api/hackathons/${id}`);
      if (!detailRes.ok) {
        throw new Error("Hackathon details could not be found.");
      }
      const detailPayload = await detailRes.json();
      setHackathon(detailPayload?.data?.hackathon || null);

      // 2. Fetch standings
      const standingsRes = await fetch(`http://localhost:4000/api/hackathons/${id}/submissions`);
      if (standingsRes.ok) {
        const standingsPayload = await standingsRes.json();
        setStandings(standingsPayload?.data?.submissions || []);
      }
    } catch (err: any) {
      console.error("[HackathonDetailClient] loadError:", err);
      setErrorMsg(err.message || "Failed to connect to the backend database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHackathonData();
  }, [id]);

  // Sync user's registration state from localStorage or API
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("eduquest-registered-hackathons");
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        if (ids.includes(id)) {
          setIsRegistered(true);
        }
      }
    }
  }, [id]);

  // Countdown timer logic
  useEffect(() => {
    if (!hackathon?.endTime) return;

    const timer = setInterval(() => {
      const target = new Date(hackathon.endTime).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [hackathon?.endTime]);

  const handleRegister = async () => {
    if (!isSignedIn) {
      router.push("/sign-in?redirect=" + encodeURIComponent(`/hackathon/${id}`));
      return;
    }

    setIsRegistering(true);
    setFormNotice("");

    try {
      const res = await fetch(`http://localhost:4000/api/hackathons/${id}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const payload = await res.json();
      if (!res.ok || !payload.ok) {
        setFormNotice(payload.error?.message || "Registration failed. Please try again.");
        setFormNoticeTone("error");
        return;
      }

      // Success
      setIsRegistered(true);
      setFormNotice("Success! You are now registered. Form your team and prepare your submission.");
      setFormNoticeTone("success");

      // Save to localStorage persistence
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("eduquest-registered-hackathons");
        const list = stored ? JSON.parse(stored) : [];
        if (!list.includes(id)) {
          list.push(id);
          localStorage.setItem("eduquest-registered-hackathons", JSON.stringify(list));
        }
      }

      // Increment local count
      if (hackathon) {
        setHackathon({ ...hackathon, registrationCount: hackathon.registrationCount + 1 });
      }
    } catch (err) {
      console.error("[handleRegister] Error:", err);
      setFormNotice("Network error. Please make sure the server is online.");
      setFormNoticeTone("error");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormNotice("");

    if (!teamName.trim() || !projectDesc.trim() || !githubUrl.trim()) {
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
      const response = await fetch(`http://localhost:4000/api/hackathons/${id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          teamName: teamName.trim(),
          projectDesc: projectDesc.trim(),
          githubUrl: githubUrl.trim(),
          demoUrl: demoUrl ? demoUrl.trim() : null,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        setFormNotice(payload.error?.message || "Failed to submit project.");
        setFormNoticeTone("error");
        return;
      }

      setFormNotice(`Congratulations! Team "${teamName}"'s project submission has been saved.`);
      setFormNoticeTone("success");
      setShowConfetti(true);

      // Reset fields
      setTeamName("");
      setProjectDesc("");
      setGithubUrl("");
      setDemoUrl("");

      // Reload standings
      const standingsRes = await fetch(`http://localhost:4000/api/hackathons/${id}/submissions`);
      if (standingsRes.ok) {
        const standingsPayload = await standingsRes.json();
        setStandings(standingsPayload?.data?.submissions || []);
      }

      // Hide confetti after 5 seconds
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

  // Predefined FAQs
  const rulesFaq = [
    {
      q: "What are the rules regarding safe browser proctoring?",
      a: "This hackathon enforces strict anti-cheat rules. If Proctoring is enabled, opening new tabs, resizing browser windows, or copying code is actively monitored. Exceeding 3 window violations will result in disqualification."
    },
    {
      q: "Can I edit my project submission after saving?",
      a: "Yes! Submissions are idempotent. Submitting again with the same team details will overwrite your previous entry. Standings updates are real-time."
    },
    {
      q: "How are evaluations scored?",
      a: "Projects are graded by mentors out of 100 points based on: Code structure & GitHub commits (30%), UI Design & responsiveness (30%), Complexity (20%), and Video Demo/Description (20%)."
    }
  ];

  if (isLoading) {
    return (
      <div className={styles.loadingSkeleton}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonText}></div>
        <div className={styles.skeletonGrid}>
          <div className={styles.skeletonCol}></div>
          <div className={styles.skeletonCol}></div>
        </div>
      </div>
    );
  }

  if (errorMsg || !hackathon) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={48} className={styles.errorIcon} />
        <h2>Hackathon Not Found</h2>
        <p>{errorMsg || "The requested event is not active or has been archived."}</p>
        <Link href="/hackathon" className={styles.btnPrimary}>
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    );
  }

  const isCompleted = hackathon.status === "COMPLETED" || new Date(hackathon.endTime) < new Date();

  return (
    <div className={styles.page}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={180} />}
      
      <div className={styles.inner}>
        {/* Back Link */}
        <Link href="/hackathon" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Hackathons
        </Link>

        {/* Banners & Header */}
        <header className={styles.header} style={{ backgroundImage: `linear-gradient(180deg, rgba(5,13,26,0.3) 0%, rgba(5,13,26,0.95) 100%), url(${hackathon.bannerUrl || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"})` }}>
          <div className={styles.headerInfo}>
            <span className={`${styles.badge} ${styles[`status${hackathon.status}`]}`}>
              {hackathon.status === "live" ? "Live Now" : "Upcoming"}
            </span>
            <h1 className={styles.title}>{hackathon.title}</h1>
            <p className={styles.subtitle}>Hosted by: <strong>{hackathon.collegeName}</strong></p>
            
            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <MapPin size={16} />
                <span>{hackathon.venue}</span>
              </div>
              <div className={styles.metaItem}>
                <Users size={16} />
                <span>{hackathon.registrationCount} / {hackathon.maxParticipants || 1000} registered</span>
              </div>
              <div className={styles.metaItem}>
                <Award size={16} />
                <span>Prize Pool: ₹50,000</span>
              </div>
            </div>
          </div>
        </header>

        {/* Global form message notices */}
        {formNotice && (
          <div className={`${styles.notice} ${styles[`notice${formNoticeTone.charAt(0).toUpperCase() + formNoticeTone.slice(1)}`]}`}>
            {formNoticeTone === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{formNotice}</span>
          </div>
        )}

        <div className={styles.layoutGrid}>
          {/* LEFT COLUMN: About, Submit, FAQs */}
          <main className={styles.mainCol}>
            
            {/* Countdown Widget */}
            {!isCompleted && (
              <section className={styles.card} aria-labelledby="timer-title">
                <h2 id="timer-title" className={styles.cardTitle}>
                  <Timer size={20} /> Time Remaining
                </h2>
                <div className={styles.timerGrid}>
                  <div className={styles.timerBlock}>
                    <span className={styles.timerNum}>{timeLeft.days}</span>
                    <span className={styles.timerUnit}>Days</span>
                  </div>
                  <div className={styles.timerBlock}>
                    <span className={styles.timerNum}>{timeLeft.hours}</span>
                    <span className={styles.timerUnit}>Hours</span>
                  </div>
                  <div className={styles.timerBlock}>
                    <span className={styles.timerNum}>{timeLeft.minutes}</span>
                    <span className={styles.timerUnit}>Min</span>
                  </div>
                  <div className={styles.timerBlock}>
                    <span className={styles.timerNum}>{timeLeft.seconds}</span>
                    <span className={styles.timerUnit}>Sec</span>
                  </div>
                </div>
              </section>
            )}

            {/* Description Card */}
            <section className={styles.card} aria-labelledby="about-title">
              <h2 id="about-title" className={styles.cardTitle}>About the Event</h2>
              <p className={styles.descText}>{hackathon.description}</p>
            </section>

            {/* SUBMISSION FORM OR LOCK OUT */}
            <section className={styles.card} aria-labelledby="submission-title">
              <h2 id="submission-title" className={styles.cardTitle}>
                <Trophy size={20} /> Project Submission
              </h2>

              {!isRegistered ? (
                <div className={styles.lockedState}>
                  <Lock size={36} />
                  <h3>Locked</h3>
                  <p>You must register for this hackathon before you can submit a project.</p>
                  <button
                    className={styles.btnPrimary}
                    onClick={handleRegister}
                    disabled={isRegistering || isCompleted}
                  >
                    {isRegistering ? "Registering..." : "Register Now"}
                  </button>
                </div>
              ) : isCompleted ? (
                <div className={styles.lockedState}>
                  <CheckCircle size={36} />
                  <h3>Hackathon Ended</h3>
                  <p>Submissions are closed for this event. View final scores in the scoreboard.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitProject} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="team-name" className={styles.formLabel}>Team Name *</label>
                    <input
                      id="team-name"
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Code Knights"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="project-desc" className={styles.formLabel}>Project Description * (Min 15 chars)</label>
                    <textarea
                      id="project-desc"
                      rows={4}
                      className={styles.textarea}
                      placeholder="Explain what problem your project solves and the technologies used."
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
                      placeholder="e.g. https://github.com/username/repository"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="demo-url" className={styles.formLabel}>Live Demo URL (Optional)</label>
                    <input
                      id="demo-url"
                      type="url"
                      className={styles.input}
                      placeholder="e.g. https://my-app.vercel.app"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.btnPrimary}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : <><Send size={15} /> Submit Project</>}
                  </button>
                </form>
              )}
            </section>

            {/* Accordion Q&A */}
            <section className={styles.card} aria-labelledby="faq-title">
              <h2 id="faq-title" className={styles.cardTitle}>Event Guidelines</h2>
              <div className={styles.faqList}>
                {rulesFaq.map((item, idx) => (
                  <div key={idx} className={styles.faqItem}>
                    <button
                      className={styles.faqBtn}
                      onClick={() => toggleAccordion(idx)}
                      aria-expanded={openFaqIndex === idx}
                    >
                      <span>{item.q}</span>
                      <ChevronDown size={18} className={openFaqIndex === idx ? styles.rotate : ""} />
                    </button>
                    {openFaqIndex === idx && (
                      <div className={styles.faqAnswer}>
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* RIGHT COLUMN: Standings Leaderboard */}
          <aside className={styles.sideCol}>
            <section className={styles.card} aria-labelledby="standings-title">
              <h2 id="standings-title" className={styles.cardTitle}>
                <Trophy size={18} /> Live Scoreboard
              </h2>
              <p className={styles.sideSubtitle}>Updated in real-time as mentors evaluate repos.</p>

              {standings.length === 0 ? (
                <div className={styles.emptyStandings}>
                  <Code2 size={32} />
                  <p>No project submissions yet. Be the first to submit!</p>
                </div>
              ) : (
                <div className={styles.standingsList}>
                  {standings.map((sub, index) => {
                    const rank = index + 1;
                    return (
                      <div key={sub.id} className={styles.standingsItem}>
                        <div className={styles.rankBadge} data-rank={rank}>
                          {rank}
                        </div>
                        <div className={styles.standingsDetails}>
                          <h4 className={styles.teamName}>{sub.teamName}</h4>
                          <span className={styles.author}>Submitted by: {sub.authorName}</span>
                          
                          <div className={styles.linksRow}>
                            <a href={sub.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>
                              Repo <ExternalLink size={11} />
                            </a>
                            {sub.demoUrl && (
                              <a href={sub.demoUrl} target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>
                                Live <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        </div>
                        <div className={styles.scoreBadge}>
                          {sub.score !== null ? `${sub.score} pts` : "Pending"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
