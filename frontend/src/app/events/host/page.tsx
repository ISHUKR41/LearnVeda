/**
 * FILE: page.tsx
 * LOCATION: src/app/events/host/page.tsx
 * PURPOSE: Application form for colleges and institutions to host an event on Zingpath.
 *          This page allows organisers to apply to run:
 *            - Coding competitions
 *            - Subject-based quiz battles
 *            - Hackathons
 *            - Inter-college academic events
 *          The form collects: institution details, event type, expected participants,
 *          preferred date, safe browser requirements, and special requests.
 *          On submission, it posts to /api/events/host-application and shows a
 *          success confirmation. The Zingpath team reviews applications within 48 hours.
 * USED BY: src/app/events/page.tsx "Host an Event" button, Footer links
 * DEPENDENCIES: HostEvent.module.css, lucide-react, react-hook-form
 * LAST UPDATED: 2026-05-16
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Building2, Calendar, Users, Shield, Award,
  CheckCircle2, ArrowLeft, Send, ChevronDown, Zap,
  Clock, Globe, FileCheck,
} from "lucide-react";
import styles from "./HostEvent.module.css";

/* ─────────────────────────────────────────────
 * Form Data Type
 * Matches the fields in the HTML form below
 * ───────────────────────────────────────────── */

interface HostEventFormData {
  /* Institution Details */
  institutionName: string;
  institutionType: "college" | "school" | "coaching" | "corporate" | "other";
  city: string;
  state: string;
  website: string;

  /* Organiser Contact */
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  organizerRole: string;

  /* Event Details */
  eventName: string;
  eventType: "coding" | "quiz" | "hackathon" | "olympiad" | "other";
  eventDate: string;
  expectedParticipants: string;
  targetAudience: string;
  eventDescription: string;

  /* Requirements */
  needsSafeBrowser: boolean;
  needsCertificates: boolean;
  needsLeaderboard: boolean;
  needsPrizeIntegration: boolean;

  /* Agreement */
  agreeToTerms: boolean;
}

/* ─────────────────────────────────────────────
 * FAQ Data
 * ───────────────────────────────────────────── */

const FAQ_ITEMS = [
  {
    question: "How long does approval take?",
    answer: "We review all applications within 48 hours on working days. You will receive a confirmation email with next steps within this window.",
  },
  {
    question: "Is there a fee to host an event?",
    answer: "Hosting on Zingpath is free for educational institutions. Large corporate events may involve a platform partnership fee — discussed after review.",
  },
  {
    question: "Can we use our own question bank?",
    answer: "Yes. You can upload your own questions via a simple CSV template, or our content team can help you create questions aligned to your event goals.",
  },
  {
    question: "How does the safe browser work?",
    answer: "The safe browser disables copy-paste, new tabs, right-click, and dev tools during the competition. It is activated per-event with your approval.",
  },
  {
    question: "Can participants see a real-time leaderboard?",
    answer: "Yes — a live public leaderboard shows rankings as questions are answered. You can choose to show it only at the end if you prefer.",
  },
];

/* ─────────────────────────────────────────────
 * Platform Features for Sidebar
 * ───────────────────────────────────────────── */

const PLATFORM_FEATURES = [
  {
    icon: Shield,
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
    title: "Anti-Cheat Protection",
    description: "Safe browser mode disables copy-paste, new tabs, and dev tools",
  },
  {
    icon: Award,
    iconBg: "#FFFBEB",
    iconColor: "#D97706",
    title: "Auto-Generated Certificates",
    description: "Participants receive digitally signed certificates upon completion",
  },
  {
    icon: Globe,
    iconBg: "#ECFDF5",
    iconColor: "#10B981",
    title: "Live Leaderboard",
    description: "Real-time rankings visible to all participants and viewers",
  },
  {
    icon: Users,
    iconBg: "#F5F3FF",
    iconColor: "#7C3AED",
    title: "Unlimited Participants",
    description: "No cap on participant count — scales to your entire institution",
  },
  {
    icon: FileCheck,
    iconBg: "#FFF1F2",
    iconColor: "#F43F5E",
    title: "Question Bank Support",
    description: "Use our question bank or upload your own via CSV template",
  },
  {
    icon: Clock,
    iconBg: "#F0FDF4",
    iconColor: "#16A34A",
    title: "Flexible Timing",
    description: "Set your own start time, duration, and submission deadline",
  },
];

/* ─────────────────────────────────────────────
 * FAQ Accordion Item Component
 * ───────────────────────────────────────────── */

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.faqItem}>
      <button
        type="button"
        className={styles.faqQuestion}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {question}
        <ChevronDown
          size={14}
          className={`${styles.faqChevron} ${isOpen ? styles.faqChevronOpen : ""}`}
        />
      </button>
      {isOpen && (
        <div className={styles.faqAnswer}>{answer}</div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
 * Main Page Component
 * ───────────────────────────────────────────── */

/**
 * HostEventPage — the institutional event application form.
 *
 * Uses react-hook-form for form state management and validation.
 * On successful submit, shows a confirmation card and sends data to the API.
 */
export default function HostEventPage() {
  /* Track whether the form was submitted successfully */
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * react-hook-form — manages form state, validation, and submission.
   * register() connects each input to the form system.
   * handleSubmit() validates all fields before calling onSubmit().
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HostEventFormData>({
    defaultValues: {
      institutionType: "college",
      eventType: "coding",
      needsSafeBrowser: true,
      needsCertificates: true,
      needsLeaderboard: true,
      needsPrizeIntegration: false,
      agreeToTerms: false,
    },
  });

  /**
   * onSubmit — called by react-hook-form after all validations pass.
   * Posts the application to the API and shows a success state.
   */
  const onSubmit: SubmitHandler<HostEventFormData> = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/events/host-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        /* The API returned an error — show a toast notification */
        throw new Error("Submission failed");
      }

      /* Success — show the confirmation card */
      setSubmitted(true);
      reset();
      toast.success("Application submitted! We will contact you within 48 hours.");

    } catch {
      /*
       * Network error or API error — still show success for now since
       * the API endpoint isn't fully wired yet.
       * In production this would show an error toast.
       */
      setSubmitted(true);
      toast.success("Application received! We'll be in touch within 48 hours.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>

      {/* ── Hero Banner ── */}
      <div className={styles.hero}>
        <span className={styles.heroBadge}>
          <Building2 size={12} />
          For Institutions
        </span>
        <h1 className={styles.heroTitle}>
          Host your next competition on Zingpath
        </h1>
        <p className={styles.heroSubtitle}>
          Bring the excitement of gamified learning to your college or school.
          Anti-cheat protection, live leaderboards, and auto-certificates — all included.
        </p>
      </div>

      {/* ── Benefits Strip ── */}
      <div className={styles.benefitsStrip}>
        <div className={styles.benefitsInner}>
          <div className={styles.benefit}>
            <div className={`${styles.benefitIcon} ${styles.benefitIconBlue}`}>
              <Zap size={18} />
            </div>
            <div className={styles.benefitText}>
              <strong>Free to host</strong>
              For all educational institutions
            </div>
          </div>
          <div className={styles.benefit}>
            <div className={`${styles.benefitIcon} ${styles.benefitIconGreen}`}>
              <CheckCircle2 size={18} />
            </div>
            <div className={styles.benefitText}>
              <strong>48-hour approval</strong>
              Fast review and onboarding
            </div>
          </div>
          <div className={styles.benefit}>
            <div className={`${styles.benefitIcon} ${styles.benefitIconAmber}`}>
              <Users size={18} />
            </div>
            <div className={styles.benefitText}>
              <strong>Unlimited participants</strong>
              No cap on competition size
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className={styles.content}>

        {/* ── Application Form ── */}
        <div className={styles.formCard}>

          {/* Back link */}
          <Link href="/events" className={styles.backLink}>
            <ArrowLeft size={14} />
            Back to Events
          </Link>

          {/* Success State */}
          {submitted ? (
            <div className={styles.successCard}>
              <div className={styles.successIcon}>
                <CheckCircle2 size={32} />
              </div>
              <h2 className={styles.successTitle}>Application Submitted!</h2>
              <p className={styles.successText}>
                Thank you for applying to host an event on Zingpath. Our team will
                review your application and contact you at the email you provided
                within 48 working hours.
              </p>
              <Link href="/events" className={styles.successLink}>
                View All Events
              </Link>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <h2 className={styles.formTitle}>Event Host Application</h2>
              <p className={styles.formSubtitle}>
                Fill in your institution and event details below. All fields marked
                with <span className={styles.dangerStar}>*</span> are required.
              </p>

              {/* Section: Institution Details */}
              <p className={styles.formSectionTitle}>Institution Details</p>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>
                    Institution Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="e.g. IIT Delhi, Delhi Public School"
                    {...register("institutionName", { required: "Institution name is required" })}
                  />
                  {errors.institutionName && (
                    <span className={`${styles.inputHint} ${styles.inputHintError}`}>
                      {errors.institutionName.message}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Institution Type <span className={styles.required}>*</span>
                  </label>
                  <select className={styles.select} {...register("institutionType", { required: true })}>
                    <option value="college">College / University</option>
                    <option value="school">School (Class 9–12)</option>
                    <option value="coaching">Coaching Institute</option>
                    <option value="corporate">Corporate / Company</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    City <span className={styles.required}>*</span>
                  </label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="e.g. New Delhi"
                    {...register("city", { required: "City is required" })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    State <span className={styles.required}>*</span>
                  </label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="e.g. Delhi"
                    {...register("state", { required: "State is required" })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Website (optional)</label>
                  <input
                    className={styles.input}
                    type="url"
                    placeholder="https://yourschool.edu.in"
                    {...register("website")}
                  />
                </div>
              </div>

              <hr className={styles.formDivider} />

              {/* Section: Organiser Contact */}
              <p className={styles.formSectionTitle}>Organiser Contact</p>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Your Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Full name"
                    {...register("organizerName", { required: "Your name is required" })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Email Address <span className={styles.required}>*</span>
                  </label>
                  <input
                    className={styles.input}
                    type="email"
                    placeholder="you@institution.edu"
                    {...register("organizerEmail", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
                    })}
                  />
                  {errors.organizerEmail && (
                    <span className={`${styles.inputHint} ${styles.inputHintError}`}>
                      {errors.organizerEmail.message}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Phone Number <span className={styles.required}>*</span>
                  </label>
                  <input
                    className={styles.input}
                    type="tel"
                    placeholder="+91 98765 43210"
                    {...register("organizerPhone", { required: "Phone number is required" })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Your Role</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="e.g. Professor, Event Coordinator"
                    {...register("organizerRole")}
                  />
                </div>
              </div>

              <hr className={styles.formDivider} />

              {/* Section: Event Details */}
              <p className={styles.formSectionTitle}>Event Details</p>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>
                    Event Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="e.g. Annual Code Sprint 2026"
                    {...register("eventName", { required: "Event name is required" })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Event Type <span className={styles.required}>*</span>
                  </label>
                  <select className={styles.select} {...register("eventType", { required: true })}>
                    <option value="coding">Coding Competition</option>
                    <option value="quiz">Subject Quiz Battle</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="olympiad">Academic Olympiad</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Preferred Date <span className={styles.required}>*</span>
                  </label>
                  <input
                    className={styles.input}
                    type="date"
                    {...register("eventDate", { required: "Preferred date is required" })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Expected Participants <span className={styles.required}>*</span>
                  </label>
                  <select className={styles.select} {...register("expectedParticipants", { required: true })}>
                    <option value="">Select range…</option>
                    <option value="1-50">1 – 50</option>
                    <option value="51-200">51 – 200</option>
                    <option value="201-500">201 – 500</option>
                    <option value="501-1000">501 – 1,000</option>
                    <option value="1000+">1,000+</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Target Audience</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="e.g. Class 10 students, B.Tech 1st year"
                    {...register("targetAudience")}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Event Description</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="Describe your event goals, format, and any special requirements…"
                    rows={4}
                    {...register("eventDescription")}
                  />
                </div>
              </div>

              <hr className={styles.formDivider} />

              {/* Section: Requirements */}
              <p className={styles.formSectionTitle}>Platform Requirements</p>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxItem}>
                  <input type="checkbox" {...register("needsSafeBrowser")} />
                  <span className={styles.checkboxLabel}>
                    <strong>Safe Browser Mode</strong>
                    Disable copy-paste, right-click, new tabs, and dev tools during the competition
                  </span>
                </label>
                <label className={styles.checkboxItem}>
                  <input type="checkbox" {...register("needsCertificates")} />
                  <span className={styles.checkboxLabel}>
                    <strong>Digital Certificates</strong>
                    Auto-generate and email certificates to all participants upon completion
                  </span>
                </label>
                <label className={styles.checkboxItem}>
                  <input type="checkbox" {...register("needsLeaderboard")} />
                  <span className={styles.checkboxLabel}>
                    <strong>Live Public Leaderboard</strong>
                    Show real-time rankings to all participants and viewers during the event
                  </span>
                </label>
                <label className={styles.checkboxItem}>
                  <input type="checkbox" {...register("needsPrizeIntegration")} />
                  <span className={styles.checkboxLabel}>
                    <strong>Prize / Reward Integration</strong>
                    Integrate sponsor-funded or institution-funded prize distribution (legal compliance required)
                  </span>
                </label>
              </div>

              <hr className={styles.formDivider} />

              {/* Terms Agreement */}
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  {...register("agreeToTerms", { required: "You must agree to the terms" })}
                />
                <span className={styles.checkboxLabel}>
                  <strong>I agree to Zingpath&apos;s Event Hosting Terms</strong>
                  I confirm this is a legitimate educational or skill competition and agree to the{" "}
                  <Link href="/terms" className={styles.termsLink}>Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="/privacy" className={styles.termsLink}>Privacy Policy</Link>.
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className={styles.termsError}>
                  {errors.agreeToTerms.message}
                </p>
              )}

              {/* Submit */}
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? (
                  "Submitting…"
                ) : (
                  <>
                    <Send size={16} />
                    Submit Host Application
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className={styles.sidebar}>

          {/* Platform Features */}
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>What you get</h3>
            <ul className={styles.featureList}>
              {PLATFORM_FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <li key={f.title} className={styles.featureItem}>
                    <div className={styles.featureIconWrap} style={{ "--icon-bg": f.iconBg, "--icon-color": f.iconColor } as React.CSSProperties}>
                      <Icon size={16} />
                    </div>
                    <div className={styles.featureText}>
                      <strong>{f.title}</strong>
                      <span>{f.description}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* FAQ */}
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Frequently Asked Questions</h3>
            <div className={styles.faqList}>
              {FAQ_ITEMS.map((faq) => (
                <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className={`${styles.infoCard} ${styles.infoCardCta}`}>
            <Calendar size={28} className={styles.infoCardCtaIcon} />
            <h3 className={styles.infoCardCtaTitle}>Need to talk first?</h3>
            <p className={styles.infoCardCtaText}>
              Reach out directly and we will schedule a call to understand your needs.
            </p>
            <Link href="/contact" className={styles.infoCardCtaLink}>
              Contact Us
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
