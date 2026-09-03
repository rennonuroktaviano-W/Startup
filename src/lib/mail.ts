import "server-only";

import nodemailer from "nodemailer";

type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

function transporter() {
  const provider = process.env.MAIL_PROVIDER ?? "log";
  if (provider === "smtp") {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }
  // "log" provider: pretend send success; only used in development.
  return {
    async sendMail(message: EmailMessage) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[mail:log] to=${message.to} subject="${message.subject}"`);
      }
    },
  } as unknown as nodemailer.Transporter;
}

export async function sendMail(message: EmailMessage): Promise<void> {
  try {
    const from = process.env.MAIL_FROM || "no-reply@localhost";
    await transporter().sendMail({ from, ...message });
  } catch (err) {
    // Email must never take down the main flow (e.g. inquiry persistence).
    console.error("[mail] gagal mengirim:", err instanceof Error ? err.message : err);
  }
}

export function mailFromEnv(): string {
  return process.env.MAIL_FROM || "no-reply@localhost";
}

export function adminNotificationEmails(): string[] {
  return (process.env.ADMIN_NOTIFICATION_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}
