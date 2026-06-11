import { NextResponse } from "next/server";
import { fetchPageSignals, runAssessment } from "@/lib/assessment";
import { getResend } from "@/lib/resend";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

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
  return str.replace(/[<>]/g, "").trim().slice(0, 500);
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in an hour." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { url: rawUrl, email: rawEmail, name: rawName } = body;

    if (!rawUrl?.trim()) {
      return NextResponse.json({ error: "Website URL is required." }, { status: 400 });
    }

    if (!rawEmail?.trim()) {
      return NextResponse.json({ error: "Work email is required." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const cleanUrl = sanitize(rawUrl);
    const cleanEmail = sanitize(rawEmail);
    const cleanName = rawName ? sanitize(rawName) : "";

    // Fetch page signals and run assessment
    const { signals, url } = await fetchPageSignals(cleanUrl);
    const report = await runAssessment(signals, url);

    // Fire notification and optional user email in the background, do not block response
    void sendEmails({ email: cleanEmail, name: cleanName, url: url.toString(), score: report.score });

    return NextResponse.json({ ok: true, report: { ...report, url: url.toString() } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong.";

    // Return user-friendly messages for known validation/fetch errors
    const knownErrors = [
      "Invalid URL format",
      "Only http and https",
      "Private or reserved",
      "IP addresses are not accepted",
      "URL does not return an HTML page",
    ];
    const isKnown = knownErrors.some((s) => message.includes(s));

    if (isKnown) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "We could not reach that URL. Please check it and try again." },
      { status: 502 }
    );
  }
}

async function sendEmails(opts: {
  email: string;
  name: string;
  url: string;
  score: number;
}): Promise<void> {
  try {
    const resend = getResend();
    const fromEmail = process.env.FROM_EMAIL ?? "hello@rethinkaiconsult.com";
    const notifyEmail = process.env.CONTACT_EMAIL ?? "jack@rethinkaiconsult.com";

    await Promise.all([
      resend.emails.send({
        from: `RethinkAI Website <${fromEmail}>`,
        to: notifyEmail,
        subject: `New assessment lead: ${opts.url}`,
        html: `<p><strong>URL:</strong> ${opts.url}</p><p><strong>Email:</strong> ${opts.email}</p><p><strong>Name:</strong> ${opts.name || "(not provided)"}</p><p><strong>Score:</strong> ${opts.score}/100</p>`,
      }),
      opts.email
        ? resend.emails.send({
            from: `RethinkAI Consult <${fromEmail}>`,
            to: opts.email,
            subject: `Your free website assessment is ready`,
            html: `<p>Hi${opts.name ? ` ${opts.name}` : ""},</p><p>Your website assessment for <strong>${opts.url}</strong> has been completed. It scored <strong>${opts.score}/100</strong>.</p><p>If you would like to discuss the findings and explore how we can help, reply to this email or <a href="https://rethinkaiconsult.com/#contact">book a 20-minute call</a>.</p><p>The RethinkAI team</p>`,
          })
        : Promise.resolve(),
    ]);
  } catch {
    // Email errors are non-blocking
  }
}
