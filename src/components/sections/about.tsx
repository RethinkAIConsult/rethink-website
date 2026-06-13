import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { CountUp } from "@/components/count-up";
import { ArrowLink } from "@/components/arrow-link";
import type { SVGProps } from "react";

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const CREDENTIALS = [
  { label: "Engineering and automation", value: "8+ yrs", numeric: null, suffix: null },
  { label: "Production AI systems shipped", value: null, numeric: 12, suffix: "+" },
  { label: "Senior engineers only", value: "No juniors", numeric: null, suffix: null },
  { label: "Engagement model", value: "Flexible", numeric: null, suffix: null },
] as const;

const PRINCIPLES = [
  {
    title: "Strict TypeScript",
    body: "No any types, no shortcuts. Type safety cuts entire bug categories before they reach production.",
  },
  {
    title: "Event-driven architecture",
    body: "Systems that react instead of poll. Durable execution means nothing fails silently in the background.",
  },
  {
    title: "AI as first-class tooling",
    body: "Models are designed in, not bolted on. We automate what AI is genuinely good at and keep humans in the loop where it matters.",
  },
  {
    title: "Ship fast, iterate faster",
    body: "Working software in week one. Tight scope, incremental deploys, outcomes over effort.",
  },
  {
    title: "Clean handover",
    body: "Every project ships with full documentation, a working CI/CD pipeline, and a codebase your own developers can maintain. We write code for the team who inherits it.",
  },
] as const;

export function About() {
  return (
    <section
      id="about"
      className="border-t border-border py-20 lg:py-28"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <SectionHeading
          number="04"
          eyebrow="About RethinkAI"
          headingId="about-heading"
          title={<>A studio built for the way AI actually works</>}
          lead="Founded by Jack Costanzi, RethinkAI is a senior engineering studio that turns the hours your team loses to repetitive work into leverage."
          aside={<ArrowLink href="#contact">Work with us</ArrowLink>}
        />

        {/* Stats strip */}
        <FadeIn delay={0.1}>
          <div className="mt-12 lg:mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
            {CREDENTIALS.map((c) => (
              <div
                key={c.label}
                className="flex flex-col gap-1 bg-card px-6 py-6"
              >
                <span className="metric text-2xl font-bold text-foreground">
                  {c.numeric !== null ? (
                    <>
                      <CountUp value={c.numeric} className="metric text-2xl font-bold text-foreground" />
                      {c.suffix}
                    </>
                  ) : (
                    c.value
                  )}
                </span>
                <span className="text-sm text-muted-foreground">{c.label}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Narrative + principles */}
        <div className="mt-12 lg:mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Narrative */}
          <FadeIn delay={0.1}>
            <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                One client&apos;s reporting and reconciliation work was eating more than 120 hours of analyst time a month. We replaced it with a pipeline that runs overnight, so the pack is ready before the team logs in, untouched by hand.
              </p>
              <p>
                We work with companies that have outgrown spreadsheets and manual processes but have not yet built an in-house AI engineering team. We step in, build the right thing, and hand you a system your team can own.
              </p>
              <p>
                RethinkAI is led by Jack Costanzi, a hands-on engineer who builds the systems we ship: durable pipelines, AI agents, and the full-stack tools around them. We have put complete AI stacks into production for venture-backed and established companies, and only senior engineers touch client work. Client names are held under NDA, and we are happy to walk through the work on a call.
              </p>
              <blockquote className="border-l-2 border-primary pl-5 text-foreground">
                <p className="font-medium">
                  &ldquo;The best automation is invisible. You stop thinking about the process because it simply works.&rdquo;
                </p>
                <footer className="mt-2 text-sm font-normal text-muted-foreground">
                  Jack Costanzi, on how we build
                </footer>
              </blockquote>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://linkedin.com/in/jackcostanzi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  aria-label="Jack Costanzi on LinkedIn"
                >
                  <LinkedInIcon className="h-4 w-4" />
                  Jack Costanzi
                </a>
                <span className="text-border">|</span>
                <span className="text-sm text-muted-foreground">Founder, RethinkAI Consult</span>
              </div>
            </div>
          </FadeIn>

          {/* Principles */}
          <FadeIn delay={0.2}>
            <div>
              <p className="eyebrow mb-6">How we work</p>
              <div className="space-y-4">
                {PRINCIPLES.map((p, i) => (
                  <FadeIn key={p.title} delay={0.2 + i * 0.06}>
                    <div className="rounded-lg border border-border bg-card p-6 transition-colors duration-200 hover:border-primary/40">
                      <div className="flex items-start gap-4">
                        <span className="metric text-xs font-bold text-primary shrink-0 mt-0.5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground">{p.title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {p.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
