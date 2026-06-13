import { Mail, ShieldCheck, Lock, Database } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { CalEmbed } from "@/components/cal-embed";

const PROOF_POINTS = [
  { label: "Response time", value: "Within 24 hours" },
  { label: "First call", value: "No commitment" },
  { label: "Engagement", value: "Flexible, fixed price" },
] as const;

export function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-border py-20 lg:py-28"
      aria-labelledby="contact-heading"
    >
      {/* Heading + trust + proof in a readable column */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <p className="eyebrow mb-3">
              <span className="font-mono text-muted-foreground/50 mr-2">06</span>
              Get in touch
            </p>
            <h2 id="contact-heading" className="display-lg text-foreground">
              Tell us what is eating your week.
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-[40rem] mx-auto">
              Grab a 20-minute intro call below. No commitment, we give you an honest read on whether we can help and what it would take.
            </p>
            <p className="mt-2 text-sm text-muted-foreground/70 max-w-[38rem] mx-auto">
              Projects run from £5,000 for a focused pipeline to £50,000 for a full product. We work flexibly with each team, and every engagement starts with a written proposal.
            </p>
          </div>
        </FadeIn>

        <div className="mt-12 lg:mt-14 mx-auto max-w-3xl">
          <FadeIn delay={0.05}>
            <ul className="mb-6 flex flex-col gap-3 sm:flex-row sm:gap-6 sm:justify-center" aria-label="Trust assurances">
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>We sign a DPA. Your data stays in region where your infrastructure allows.</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>You own the code on day one: repo, infrastructure, runbooks.</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Database className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>We build for your real data, not a clean demo.</span>
              </li>
            </ul>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
              {PROOF_POINTS.map((p) => (
                <div key={p.label} className="flex flex-col gap-0.5 bg-card px-4 py-5 text-center">
                  <span className="text-sm font-semibold text-foreground">{p.value}</span>
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{p.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Inline booking calendar, full width so Cal's date + time-slot columns fit without an inner scroll */}
      <FadeIn delay={0.12} className="mx-auto mt-8 w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <CalEmbed />
      </FadeIn>

      {/* Direct email */}
      <FadeIn delay={0.15} className="mx-auto mt-6 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="text-sm text-muted-foreground">
            Prefer to write directly?{" "}
            <a
              href="mailto:jack@rethinkaiconsult.com"
              className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors duration-200 hover:text-primary"
            >
              <Mail className="h-3.5 w-3.5" />
              jack@rethinkaiconsult.com
            </a>
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
