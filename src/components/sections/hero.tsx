import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/fade-in";

const TECH_BADGES = ["Next.js", "TypeScript", "PostgreSQL", "AI Agents", "n8n"] as const;

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[90vh] items-center overflow-hidden"
      aria-label="Introduction"
    >
      {/* Animated gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="hero-glow-1 absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[128px]" />
        <div className="hero-glow-2 absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-accent/15 blur-[96px]" />
        <div className="hero-glow-3 absolute right-1/3 top-1/2 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Stop Hiring.{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Start Automating.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              RethinkAI builds AI-powered systems that replace manual busywork — so
              your team can focus on what actually moves the needle. We design and
              ship production automation pipelines, custom AI agents, and full-stack
              web applications for businesses that have outgrown spreadsheets.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#work"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                See Our Work
              </a>
              <a
                href="#contact"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-8 text-base font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Get in Touch
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.45}>
            <div className="mt-12 flex flex-wrap gap-2">
              {TECH_BADGES.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
