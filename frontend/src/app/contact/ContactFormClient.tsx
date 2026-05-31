/**
 * FILE: ContactFormClient.tsx
 * LOCATION: src/app/contact/ContactFormClient.tsx
 * PURPOSE: Client-side interactive contact form with real-time validation,
 *          async submission to /api/contact, and toast feedback.
 *          Extracted as a "use client" component so the parent contact/page.tsx
 *          can remain a server component (metadata, ISR revalidation, etc.).
 * LAST UPDATED: 2026-05-31
 */

"use client";

import React, { useState, useRef } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import styles from "./Contact.module.css";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function ContactFormClient() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      firstName: (data.get("firstName") as string)?.trim() ?? "",
      lastName:  (data.get("lastName")  as string)?.trim() ?? "",
      email:     (data.get("email")     as string)?.trim() ?? "",
      subject:   (data.get("subject")   as string)         ?? "",
      message:   (data.get("message")   as string)?.trim() ?? "",
    };

    /* Basic client-side validation before hitting the network */
    if (payload.firstName.length < 2)   { setErrorMsg("First name must be at least 2 characters."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!payload.subject) { setErrorMsg("Please select a subject."); return; }
    if (payload.message.length < 20)  { setErrorMsg("Your message must be at least 20 characters."); return; }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res  = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const json = await res.json() as { ok: boolean; error?: { message: string } };

      if (json.ok) {
        setStatus("success");
        formRef.current?.reset();
      } else {
        setStatus("error");
        setErrorMsg(json.error?.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error — please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.formSuccessBanner}>
        <CheckCircle2 size={36} className={styles.successIcon} />
        <h3 className={styles.successTitle}>Message sent successfully!</h3>
        <p className={styles.successText}>
          We&apos;ve received your message and will respond within 24–72 hours, Mon–Sat.
          Check your inbox (and spam folder) for our reply.
        </p>
        <button
          type="button"
          className={styles.successReset}
          onClick={() => setStatus("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>

      {/* Error banner */}
      {status === "error" && errorMsg && (
        <div className={styles.formErrorBanner} role="alert">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Client-side validation error (before submit) */}
      {status === "idle" && errorMsg && (
        <div className={styles.formErrorBanner} role="alert">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="firstName">First Name *</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            className={styles.input}
            placeholder="Rahul"
            required
            minLength={2}
            maxLength={100}
            disabled={status === "loading"}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className={styles.input}
            placeholder="Sharma"
            maxLength={100}
            disabled={status === "loading"}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="email">Email Address *</label>
        <input
          id="email"
          name="email"
          type="email"
          className={styles.input}
          placeholder="rahul@example.com"
          required
          disabled={status === "loading"}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="subject">Subject *</label>
        <select
          id="subject"
          name="subject"
          className={styles.select}
          required
          disabled={status === "loading"}
        >
          <option value="">Select a topic…</option>
          <option value="student-support">Student Support</option>
          <option value="institution">School / Institution Partnership</option>
          <option value="events">Events &amp; Sponsorship</option>
          <option value="content">Content Creator Collaboration</option>
          <option value="bug">Bug Report</option>
          <option value="feature">Feature Request</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="message">Message * <span className={styles.labelHint}>(min 20 chars)</span></label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={styles.textarea}
          placeholder="Describe your question or issue in detail…"
          required
          minLength={20}
          maxLength={5000}
          disabled={status === "loading"}
        />
      </div>

      <button
        type="submit"
        className={`${styles.submitBtn} ${status === "loading" ? styles.submitBtnLoading : ""}`}
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <Loader2 size={15} className={styles.spinnerIcon} />
            Sending…
          </>
        ) : (
          <>
            <Send size={15} />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
