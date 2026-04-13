import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { ContactNotification } from "@/emails/contact-notification";
import { ContactConfirmation } from "@/emails/contact-confirmation";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count++;
  return true;
}

function sanitize(str: string): string {
  return str.replace(/[<>]/g, "").trim().slice(0, 2000);
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, company, budget, message, referral, website } = body;

    // Honeypot — bots fill hidden fields
    if (website) {
      return NextResponse.json({ ok: true });
    }

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanName = sanitize(name);
    const cleanEmail = sanitize(email);
    const cleanCompany = sanitize(company ?? "");
    const cleanBudget = sanitize(budget ?? "");
    const cleanMessage = sanitize(message);
    const cleanReferral = sanitize(referral ?? "");

    const contactEmail = process.env.CONTACT_EMAIL ?? "jack@rethinkaiconsult.com";
    const fromEmail = process.env.FROM_EMAIL ?? "hello@rethinkaiconsult.com";
    const submittedAt = new Date().toISOString();

    const resend = getResend();

    await Promise.all([
      // Notification to Jack
      resend.emails.send({
        from: `RethinkAI Website <${fromEmail}>`,
        to: contactEmail,
        subject: `New enquiry from ${cleanName}`,
        replyTo: cleanEmail,
        react: ContactNotification({
          name: cleanName,
          email: cleanEmail,
          company: cleanCompany,
          budget: cleanBudget,
          message: cleanMessage,
          referral: cleanReferral,
          submittedAt,
        }),
      }),
      // Confirmation to submitter
      resend.emails.send({
        from: `RethinkAI Consult <${fromEmail}>`,
        to: cleanEmail,
        subject: "We've received your message — RethinkAI",
        react: ContactConfirmation({ name: cleanName }),
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email us directly." },
      { status: 500 }
    );
  }
}
