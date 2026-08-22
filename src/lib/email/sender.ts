/**
 * Email Sender Utility
 * Supports: AICLEX default Resend, Org custom Resend key, or Org SMTP
 */
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

const DEFAULT_RESEND = new Resend(process.env.RESEND_API_KEY);
const FROM_DEFAULT = "Nexdoc <noreply@nexdoc.in>";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload, orgId?: string) {
  if (!orgId) {
    // System email (no org context — e.g., signup confirmation)
    await DEFAULT_RESEND.emails.send({ from: FROM_DEFAULT, ...payload });
    return;
  }

  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (!org) throw new Error("Organization not found");

  if (org.email_provider === "RESEND" && org.resend_api_key) {
    const resend = new Resend(org.resend_api_key);
    await resend.emails.send({
      from: org.from_email ? `${org.name} <${org.from_email}>` : FROM_DEFAULT,
      ...payload,
    });
    return;
  }

  if (org.email_provider === "SMTP" && org.smtp_host && org.smtp_user && org.smtp_pass) {
    const transporter = nodemailer.createTransport({
      host: org.smtp_host,
      port: org.smtp_port ?? 587,
      secure: (org.smtp_port ?? 587) === 465,
      auth: { user: org.smtp_user, pass: org.smtp_pass },
    });
    await transporter.sendMail({
      from: org.from_email ? `"${org.name}" <${org.from_email}>` : FROM_DEFAULT,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
    return;
  }

  // Fallback: AICLEX default
  await DEFAULT_RESEND.emails.send({ from: FROM_DEFAULT, ...payload });
}
