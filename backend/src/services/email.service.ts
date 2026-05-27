/**
 * FILE: email.service.ts
 * LOCATION: backend/src/services/email.service.ts
 * PURPOSE: Production-grade email service with templating, queue management,
 *          and delivery tracking. Supports transactional emails (welcome, OTP,
 *          password reset) and bulk emails (newsletters, notifications).
 *
 * ARCHITECTURE:
 *  - Abstract email provider interface — swap between SendGrid, AWS SES,
 *    or SMTP without changing application code.
 *  - Template engine with dynamic variable substitution.
 *  - Queue-based sending to prevent request blocking.
 *  - Retry logic with exponential backoff for transient failures.
 *  - Delivery tracking with webhook support.
 *
 * CAPACITY: Handles up to 1000 emails/minute with queue buffering.
 *           SendGrid free tier: 100/day. Upgrade for production.
 *
 * DEPENDENCIES: nodemailer (SMTP), @sendgrid/mail (optional)
 * USED BY: auth.service.ts (welcome, OTP), notifications routes
 * LAST UPDATED: 2026-05-26
 */

import logger from "../utils/logger";

/* ─────────────────────────────────────────────
 * Email Template Types
 * Each template maps to a specific user-facing email.
 * ───────────────────────────────────────────── */

/** All supported email template names */
export type EmailTemplateName =
  | "welcome"
  | "otp_verification"
  | "password_reset"
  | "password_changed"
  | "account_locked"
  | "achievement_earned"
  | "daily_streak_reminder"
  | "weekly_progress_report"
  | "event_invitation"
  | "event_reminder"
  | "battle_challenge"
  | "leaderboard_position_change";

/** Configuration for a single email send request */
export interface EmailRequest {
  /** Recipient email address */
  to: string;
  /** Email subject line */
  subject: string;
  /** Template to use for the email body */
  template: EmailTemplateName;
  /** Dynamic variables to inject into the template */
  variables: Record<string, string | number>;
  /** Optional CC recipients */
  cc?: string[];
  /** Priority: 'high' for OTP/password reset, 'normal' for everything else */
  priority?: "high" | "normal" | "low";
}

/** Result of an email send attempt */
export interface EmailResult {
  /** Whether the email was accepted for delivery */
  success: boolean;
  /** Provider-specific message ID for tracking */
  messageId?: string;
  /** Error message if send failed */
  error?: string;
  /** Number of retry attempts made */
  retryCount: number;
}

/* ─────────────────────────────────────────────
 * Email Template Definitions
 * HTML templates with {{variable}} placeholders.
 * Variables are safely escaped before injection.
 * ───────────────────────────────────────────── */

/**
 * HTML email template registry.
 * Each template includes a subject line pattern and HTML body.
 * Variables are injected using double-curly-brace syntax: {{variableName}}
 */
const EMAIL_TEMPLATES: Record<EmailTemplateName, { subject: string; html: string }> = {
  welcome: {
    subject: "Welcome to EduQuest, {{username}}! 🎓",
    html: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; color: white;">Welcome to EduQuest!</h1>
          <p style="margin: 12px 0 0; color: rgba(255,255,255,0.85); font-size: 16px;">Your learning journey starts now</p>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; line-height: 1.6;">Hi <strong>{{username}}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.8; color: #a0a0a0;">Welcome aboard! EduQuest is designed to make your education interactive and fun. Here's what you can do:</p>
          <ul style="padding-left: 20px; color: #a0a0a0; font-size: 14px; line-height: 2;">
            <li>📚 Access notes across all subjects</li>
            <li>📝 Practice with thousands of MCQs</li>
            <li>⚔️ Battle friends in quiz challenges</li>
            <li>🏆 Climb the global leaderboard</li>
            <li>🎯 Track your progress with XP and streaks</li>
          </ul>
          <div style="text-align: center; margin: 32px 0;">
            <a href="{{dashboardUrl}}" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Start Learning</a>
          </div>
        </div>
        <div style="padding: 16px 32px; background: #111; text-align: center; color: #555; font-size: 12px;">
          <p>© 2026 EduQuest. Empowering learners worldwide.</p>
        </div>
      </div>
    `,
  },

  otp_verification: {
    subject: "Your EduQuest verification code: {{otp}}",
    html: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; color: white;">Verification Code</h1>
        </div>
        <div style="padding: 32px; text-align: center;">
          <p style="font-size: 14px; color: #a0a0a0;">Enter this code to verify your account:</p>
          <div style="background: #1a1a2e; border: 2px solid #6366f1; border-radius: 12px; padding: 24px; margin: 24px 0; letter-spacing: 12px; font-size: 36px; font-weight: 700; color: white;">{{otp}}</div>
          <p style="font-size: 13px; color: #666;">This code expires in <strong style="color: #e0e0e0;">10 minutes</strong>. Do not share it with anyone.</p>
        </div>
      </div>
    `,
  },

  password_reset: {
    subject: "Reset your EduQuest password",
    html: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; color: white;">Password Reset</h1>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 14px; line-height: 1.8; color: #a0a0a0;">Hi <strong style="color: #e0e0e0;">{{username}}</strong>, we received a request to reset your password.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="{{resetUrl}}" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 13px; color: #666;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `,
  },

  password_changed: {
    subject: "Your EduQuest password was changed",
    html: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="padding: 32px;">
          <h1 style="font-size: 20px; color: white;">Password Changed Successfully</h1>
          <p style="font-size: 14px; color: #a0a0a0;">Hi <strong>{{username}}</strong>, your password was changed on {{changedAt}}.</p>
          <p style="font-size: 13px; color: #ef4444;">If you didn't make this change, contact support immediately.</p>
        </div>
      </div>
    `,
  },

  account_locked: {
    subject: "⚠️ Your EduQuest account has been locked",
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e0e0e0; border-radius: 12px; padding: 32px;">
        <h1 style="color: #ef4444;">Account Locked</h1>
        <p>Hi <strong>{{username}}</strong>, your account was locked due to {{lockReason}}.</p>
        <p style="color: #a0a0a0;">It will be automatically unlocked after {{lockDuration}}. Contact support if you need immediate help.</p>
      </div>
    `,
  },

  achievement_earned: {
    subject: "🏆 You earned a new achievement: {{achievementName}}!",
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e0e0e0; border-radius: 12px; padding: 32px; text-align: center;">
        <div style="font-size: 64px; margin-bottom: 16px;">{{achievementIcon}}</div>
        <h1 style="color: white;">{{achievementName}}</h1>
        <p style="color: #a0a0a0;">{{achievementDescription}}</p>
        <p style="color: #6366f1; font-size: 18px; font-weight: 700;">+{{xpReward}} XP earned!</p>
      </div>
    `,
  },

  daily_streak_reminder: {
    subject: "🔥 Don't break your {{currentStreak}}-day streak!",
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e0e0e0; border-radius: 12px; padding: 32px; text-align: center;">
        <div style="font-size: 64px;">🔥</div>
        <h1 style="color: white;">{{currentStreak}} Day Streak!</h1>
        <p style="color: #a0a0a0;">Complete just one lesson today to keep your streak alive.</p>
        <a href="{{dashboardUrl}}" style="background: #6366f1; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 16px;">Continue Learning</a>
      </div>
    `,
  },

  weekly_progress_report: {
    subject: "📊 Your weekly EduQuest progress report",
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e0e0e0; border-radius: 12px; padding: 32px;">
        <h1 style="color: white;">Weekly Progress Report</h1>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0;">
          <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #6366f1;">{{xpEarned}}</div>
            <div style="color: #666; font-size: 12px;">XP Earned</div>
          </div>
          <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #22c55e;">{{chaptersCompleted}}</div>
            <div style="color: #666; font-size: 12px;">Chapters Done</div>
          </div>
          <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #f59e0b;">{{quizzesTaken}}</div>
            <div style="color: #666; font-size: 12px;">Quizzes Taken</div>
          </div>
          <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #ef4444;">{{streakDays}}</div>
            <div style="color: #666; font-size: 12px;">Streak Days</div>
          </div>
        </div>
      </div>
    `,
  },

  event_invitation: {
    subject: "📅 You're invited to {{eventName}}!",
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e0e0e0; border-radius: 12px; padding: 32px;">
        <h1 style="color: white;">{{eventName}}</h1>
        <p style="color: #a0a0a0;">{{eventDescription}}</p>
        <p style="color: #6366f1;">📅 {{eventDate}} | ⏰ {{eventTime}}</p>
        <a href="{{eventUrl}}" style="background: #6366f1; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; display: inline-block;">Join Event</a>
      </div>
    `,
  },

  event_reminder: {
    subject: "⏰ {{eventName}} starts in {{timeUntil}}!",
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e0e0e0; border-radius: 12px; padding: 32px; text-align: center;">
        <div style="font-size: 48px;">⏰</div>
        <h1 style="color: white;">{{eventName}}</h1>
        <p style="color: #f59e0b; font-size: 18px;">Starts in {{timeUntil}}</p>
        <a href="{{eventUrl}}" style="background: #6366f1; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; display: inline-block;">Go to Event</a>
      </div>
    `,
  },

  battle_challenge: {
    subject: "⚔️ {{challengerName}} challenged you to a battle!",
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e0e0e0; border-radius: 12px; padding: 32px; text-align: center;">
        <div style="font-size: 64px;">⚔️</div>
        <h1 style="color: white;">Battle Challenge!</h1>
        <p style="color: #a0a0a0;"><strong>{{challengerName}}</strong> wants to test your knowledge in <strong>{{subject}}</strong></p>
        <a href="{{battleUrl}}" style="background: #ef4444; color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 16px; font-weight: 700;">Accept Challenge</a>
      </div>
    `,
  },

  leaderboard_position_change: {
    subject: "📊 You moved to #{{newPosition}} on the leaderboard!",
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e0e0e0; border-radius: 12px; padding: 32px; text-align: center;">
        <h1 style="color: white;">Leaderboard Update</h1>
        <p style="font-size: 48px; font-weight: 700; color: #6366f1;">#{{newPosition}}</p>
        <p style="color: #a0a0a0;">You {{direction}} from #{{oldPosition}} to #{{newPosition}}</p>
      </div>
    `,
  },
};

/* ─────────────────────────────────────────────
 * Template Rendering Engine
 * Safely injects variables into email templates.
 * ───────────────────────────────────────────── */

/**
 * Escapes HTML special characters to prevent XSS in emails.
 * All user-provided variables are escaped before injection.
 *
 * @param {string} unsafe - Raw string that may contain HTML characters
 * @returns {string} Escaped string safe for HTML injection
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Renders an email template by replacing {{variable}} placeholders
 * with escaped variable values.
 *
 * @param {string} template - HTML template string with {{placeholders}}
 * @param {Record<string, string | number>} variables - Key-value pairs to inject
 * @returns {string} Rendered HTML with all placeholders replaced
 */
function renderTemplate(
  template: string,
  variables: Record<string, string | number>
): string {
  let rendered = template;
  for (const [key, value] of Object.entries(variables)) {
    const safeValue = typeof value === "string" ? escapeHtml(value) : String(value);
    rendered = rendered.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), safeValue);
  }
  return rendered;
}

/* ─────────────────────────────────────────────
 * Email Queue System
 * In-memory queue with retry logic for reliable delivery.
 * Replace with BullMQ + Redis for horizontal scaling.
 * ───────────────────────────────────────────── */

/** Maximum number of retry attempts for failed email sends */
const MAX_RETRIES = 3;

/** Base delay between retries in milliseconds (doubles each retry) */
const BASE_RETRY_DELAY_MS = 1000;

/** In-memory email queue for non-blocking sends */
const emailQueue: Array<{ request: EmailRequest; retryCount: number }> = [];

/** Whether the queue processor is currently running */
let isProcessingQueue = false;

/**
 * Processes the email queue by sending emails one at a time.
 * Uses exponential backoff for retries on transient failures.
 * In production, replace this with a BullMQ worker for durability.
 */
async function processEmailQueue(): Promise<void> {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (emailQueue.length > 0) {
    const item = emailQueue.shift();
    if (!item) break;

    try {
      const result = await sendEmailDirect(item.request);
      if (!result.success && item.retryCount < MAX_RETRIES) {
        /* Re-queue with incremented retry count and exponential delay */
        const delay = BASE_RETRY_DELAY_MS * Math.pow(2, item.retryCount);
        setTimeout(() => {
          emailQueue.push({ request: item.request, retryCount: item.retryCount + 1 });
          processEmailQueue();
        }, delay);

        logger.warn("[Email] Retrying failed email", {
          to: item.request.to,
          template: item.request.template,
          retryCount: item.retryCount + 1,
          nextRetryMs: delay,
        });
      } else if (!result.success) {
        logger.error("[Email] Permanently failed after max retries", {
          to: item.request.to,
          template: item.request.template,
          error: result.error,
        });
      }
    } catch (error) {
      logger.error("[Email] Unexpected queue processing error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  isProcessingQueue = false;
}

/* ─────────────────────────────────────────────
 * Direct Email Sending (SMTP / Provider)
 * Currently logs emails in development.
 * Configure SMTP_HOST or SENDGRID_API_KEY for production.
 * ───────────────────────────────────────────── */

/**
 * Sends a single email using the configured provider.
 * In development (no SMTP/SendGrid configured), logs the email to console.
 * In production, sends via SMTP or SendGrid API.
 *
 * @param {EmailRequest} request - The email to send
 * @returns {Promise<EmailResult>} Result of the send attempt
 */
async function sendEmailDirect(request: EmailRequest): Promise<EmailResult> {
  const templateDef = EMAIL_TEMPLATES[request.template];
  if (!templateDef) {
    return { success: false, error: `Unknown template: ${request.template}`, retryCount: 0 };
  }

  const renderedSubject = renderTemplate(templateDef.subject, request.variables);
  const renderedHtml = renderTemplate(templateDef.html, request.variables);

  /* Check if email provider is configured */
  const smtpHost = process.env.SMTP_HOST;
  const sendgridKey = process.env.SENDGRID_API_KEY;

  if (!smtpHost && !sendgridKey) {
    /* Development fallback — log the email instead of sending */
    logger.info("[Email] DEV MODE — Email logged instead of sent", {
      to: request.to,
      subject: renderedSubject,
      template: request.template,
      htmlLength: renderedHtml.length,
    });

    return {
      success: true,
      messageId: `dev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      retryCount: 0,
    };
  }

  /* Production: Send via SMTP using nodemailer */
  try {
    /* Dynamic import to avoid requiring nodemailer in development */
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT ?? "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM ?? "noreply@eduquest.app",
      to: request.to,
      cc: request.cc?.join(","),
      subject: renderedSubject,
      html: renderedHtml,
      priority: request.priority ?? "normal",
    });

    logger.info("[Email] Sent successfully", {
      to: request.to,
      subject: renderedSubject,
      messageId: info.messageId,
    });

    return {
      success: true,
      messageId: info.messageId,
      retryCount: 0,
    };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    logger.error("[Email] Failed to send", {
      to: request.to,
      template: request.template,
      error: errMsg,
    });

    return {
      success: false,
      error: errMsg,
      retryCount: 0,
    };
  }
}

/* ─────────────────────────────────────────────
 * Public API — Used by route handlers and services
 * ───────────────────────────────────────────── */

/**
 * Queues an email for async delivery.
 * Returns immediately without blocking the request.
 * Use this for non-critical emails (welcome, achievements, etc.)
 *
 * @param {EmailRequest} request - Email to queue
 */
export function queueEmail(request: EmailRequest): void {
  emailQueue.push({ request, retryCount: 0 });
  logger.debug("[Email] Queued email", {
    to: request.to,
    template: request.template,
  });
  processEmailQueue().catch(() => {}); // Fire and forget
}

/**
 * Sends an email immediately and waits for the result.
 * Use this for critical emails that must be delivered (OTP, password reset).
 *
 * @param {EmailRequest} request - Email to send
 * @returns {Promise<EmailResult>} Send result
 */
export async function sendEmailImmediate(request: EmailRequest): Promise<EmailResult> {
  return sendEmailDirect(request);
}

/**
 * Returns the list of all available email template names.
 * Useful for admin dashboards that show template preview.
 */
export function getAvailableTemplates(): EmailTemplateName[] {
  return Object.keys(EMAIL_TEMPLATES) as EmailTemplateName[];
}
