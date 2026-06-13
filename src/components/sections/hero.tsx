"use client";

import { ArrowLink } from "@/components/arrow-link";
import { CountUp } from "@/components/count-up";
import { FadeIn } from "@/components/fade-in";
import { Marquee } from "@/components/marquee";
import { useCallback, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Syntax-highlighted pipeline snippet: real Inngest research-and-outreach function.
type Tok = { t: string; c?: "kw" | "str" | "num" | "fn" | "comment" | "dim" };
const TOKEN_CLASS: Record<NonNullable<Tok["c"]>, string> = {
  kw: "text-[#79B8FF]",
  str: "text-[#9ECBFF]",
  num: "text-[#F8C555]",
  fn: "text-[#B392F0]",
  comment: "italic text-[#6A737D]",
  dim: "text-[#586069]",
};
const CODE: Tok[][] = [
  [{ t: "// Durable outbound pipeline: research, score, draft", c: "comment" }],
  [],
  [{ t: "export const", c: "kw" }, { t: " researchProspect = inngest." }, { t: "createFunction", c: "fn" }, { t: "(" }],
  [{ t: "  { id: " }, { t: '"outbound/research-prospect"', c: "str" }, { t: ", concurrency: " }, { t: "3", c: "num" }, { t: " }," }],
  [{ t: "  { event: " }, { t: '"outbound/prospect.qualified"', c: "str" }, { t: " }," }],
  [{ t: "  async", c: "kw" }, { t: " ({ event, step }) => {" }],
  [],
  [{ t: "    // Step 1: parallel AI research (durable, retried automatically)", c: "comment" }],
  [{ t: "    const", c: "kw" }, { t: " signals = " }, { t: "await", c: "kw" }, { t: " step." }, { t: "run", c: "fn" }, { t: "(" }, { t: '"parallel-research"', c: "str" }, { t: "," }],
  [{ t: "      () => " }, { t: "research", c: "fn" }, { t: "(event.data.company, event.data.domain)" }],
  [{ t: "    )" }],
  [],
  [{ t: "    // Step 2: deterministic ICP score", c: "comment" }],
  [{ t: "    const", c: "kw" }, { t: " score = " }, { t: "await", c: "kw" }, { t: " step." }, { t: "run", c: "fn" }, { t: "(" }, { t: '"score-icp"', c: "str" }, { t: ", () => " }, { t: "rankIcp", c: "fn" }, { t: "(signals))" }],
  [],
  [{ t: "    // Step 3: draft outreach only for high-fit accounts", c: "comment" }],
  [{ t: "    if", c: "kw" }, { t: " (score.fit === " }, { t: '"high"', c: "str" }, { t: ") {" }],
  [{ t: "      return", c: "kw" }, { t: " step." }, { t: "run", c: "fn" }, { t: "(" }, { t: '"draft-outreach"', c: "str" }, { t: ", () => " }, { t: "draftEmail", c: "fn" }, { t: "(score))" }],
  [{ t: "    }" }],
  [{ t: "  }" }],
  [{ t: ")" }],
];

// How many code lines to show in the mobile compact panel (first N lines).
const MOBILE_CODE_LINES = 7;

function CodeLines({
  lines,
  animate,
  reduced,
}: {
  lines: Tok[][];
  animate: boolean;
  reduced: boolean;
}) {
  return (
    <>
      {lines.map((line, i) => (
        <div
          key={i}
          className="text-[#CDD9E5] whitespace-pre"
          style={
            animate && !reduced
              ? {
                  opacity: 0,
                  transform: "translateY(6px)",
                  animation: `hero-line-in 0.3s ease forwards`,
                  animationDelay: `${i * 35}ms`,
                }
              : undefined
          }
        >
          {line.length === 0
            ? " "
            : line.map((tok, j) => (
                <span key={j} className={tok.c ? TOKEN_CLASS[tok.c] : undefined}>
                  {tok.t}
                </span>
              ))}
        </div>
      ))}
    </>
  );
}

function HeroCodePanel({
  compact = false,
  animate = false,
  reduced = false,
}: {
  compact?: boolean;
  animate?: boolean;
  reduced?: boolean;
}) {
  const lines = compact ? CODE.slice(0, MOBILE_CODE_LINES) : CODE;

  return (
    <div
      className="relative min-w-0 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0D1117] shadow-2xl shadow-black/40"
      aria-label="Example Inngest pipeline function"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-white/[0.08] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" aria-hidden="true" />
        <span className="ml-3 font-mono text-[11px] text-[#6A737D]">
          inngest/outbound/research-prospect.ts
        </span>
      </div>

      {/* Code */}
      <div className="overflow-x-auto p-5 font-mono text-[12px] leading-[1.75]">
        <CodeLines lines={lines} animate={animate} reduced={reduced} />
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-2.5 border-t border-white/[0.08] bg-[#0A0D12] px-4 py-2.5 font-mono text-[11px]">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#28C840] opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#28C840]" />
        </span>
        <span className="text-[#8B949E]">durable, retried automatically</span>
        <span
          className="cursor-blink ml-auto inline-block h-[14px] w-[7px] bg-[#2563EB]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

const TECH_ITEMS = [
  "Next.js",
  "TypeScript",
  "PostgreSQL",
  "Inngest",
  "Anthropic Claude",
  "Vercel",
  "n8n",
  "Salesforce",
  "HubSpot",
  "Clerk",
  "Resend",
  "Playwright",
] as const;

function GlowBackdrop({ reduced }: { reduced: boolean }) {
  if (reduced) return null;
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Dot-grid layer, theme-aware, fades toward bottom */}
      <div className="bg-dots-fade absolute inset-0" />
      {/* Dark-mode-only glows: invisible in light, so don't render/animate them there */}
      <div className="hero-glow-1 absolute -top-32 left-1/4 hidden h-[36rem] w-[36rem] rounded-full bg-[#2563EB] opacity-[0.07] blur-[130px] mix-blend-screen dark:block" />
      <div className="hero-glow-2 absolute top-10 right-10 hidden h-[28rem] w-[28rem] rounded-full bg-[#7C3AED] opacity-[0.05] blur-[110px] mix-blend-screen dark:block" />
      <div className="hero-glow-3 absolute bottom-0 left-1/3 hidden h-[22rem] w-[22rem] rounded-full bg-[#2563EB] opacity-[0.04] blur-[100px] mix-blend-screen dark:block" />
    </div>
  );
}

// Cursor-tracking spotlight backdrop.
// Reads --mouse-x / --mouse-y CSS custom properties set on the section element.
function SpotlightBackdrop({ reduced }: { reduced: boolean }) {
  if (reduced) return null;
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 40%), rgba(37,99,235,0.06), transparent 70%)",
      }}
    />
  );
}

export function Hero() {
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);

  // Cursor-tracking spotlight: update CSS custom properties on the section.
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (reduced) return;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mouse-x", `${x}%`);
      el.style.setProperty("--mouse-y", `${y}%`);
    },
    [reduced]
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative overflow-hidden border-b border-border"
      aria-label="Introduction"
      onPointerMove={handlePointerMove}
    >
      <GlowBackdrop reduced={reduced} />
      <SpotlightBackdrop reduced={reduced} />

      <div className="mx-auto grid w-full max-w-none items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:px-8 lg:py-20 xl:grid-cols-[1.1fr_0.9fr]">

        {/* Left column: copy */}
        <div className="min-w-0 flex flex-col">

          <FadeIn>
            <p className="eyebrow">AI Engineering Studio</p>
          </FadeIn>

          <h1 className="display-xl mt-4">
            We wrap your stack
            <br />
            <span className="text-muted-foreground">with production AI.</span>
          </h1>

          <FadeIn delay={0.16}>
            <p className="mt-6 max-w-[42rem] text-lg leading-relaxed text-muted-foreground">
              RethinkAI plugs into the tools your team already runs, adds durable
              AI pipelines on top, and retires the analyst work that eats your
              week. Fixed scope, shipped in weeks, owned by your team from day one.
            </p>
          </FadeIn>

          {/* Mobile-only compact code panel: visible below lg, hidden at lg+ */}
          <div className="mt-8 block lg:hidden" aria-hidden="true">
            <HeroCodePanel compact animate reduced={reduced} />
          </div>

          <FadeIn delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <a
                href="#contact"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-7 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Book a call
              </a>
              <ArrowLink href="#work">See our work</ArrowLink>
            </div>
          </FadeIn>

          {/* Proof metric strip */}
          <FadeIn delay={0.32}>
            <div className="mt-10 border-t border-border pt-8">
              <div className="flex flex-wrap items-start gap-x-10 gap-y-6">

                {/* Primary metric */}
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    Engineering and automation
                  </p>
                  <p className="metric mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    <CountUp value={8} /><span className="text-primary">+</span>
                    <span className="text-sm text-muted-foreground ml-1">yrs</span>
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground/70 uppercase tracking-wider">
                    3+ years shipping production AI
                  </p>
                </div>

                <div className="hidden h-12 w-px bg-border sm:block" />

                {/* Secondary metric */}
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    Working software in
                  </p>
                  <p className="metric mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    Week <span className="text-primary">1</span>
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground/70 uppercase tracking-wider">
                    Not month three
                  </p>
                </div>

                <div className="hidden h-12 w-px bg-border sm:block" />

                {/* Tertiary metric: promoted from code panel */}
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    Agentic AI agents in production
                  </p>
                  <p className="metric mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    <CountUp value={200} /><span className="text-primary">+</span>
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground/70 uppercase tracking-wider">
                    Autonomous, multi-step, across client stacks
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Trust / credibility line */}
          <FadeIn delay={0.38}>
            <p className="mt-8 text-sm text-muted-foreground/80">
              Built by engineers who ship production AI, not consultants with slide decks.
            </p>
          </FadeIn>
        </div>

        {/* Right column: full code panel, desktop only (hidden on mobile) */}
        <div className="min-w-0 hidden lg:block">
          <HeroCodePanel animate reduced={reduced} />
          <p className="mt-3 text-center font-mono text-[11px] text-muted-foreground/70">
            A real RethinkAI pipeline: it researches, scores, and drafts outreach on its own.
          </p>
        </div>
      </div>

      {/* Tech marquee strip */}
      <div className="border-t border-border py-5">
        <Marquee>
          {TECH_ITEMS.map((item) => (
            <span
              key={item}
              className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground whitespace-nowrap mx-6"
            >
              {item}
            </span>
          ))}
        </Marquee>
      </div>

      {/* Keyframe for code-line stagger reveal */}
      <style>{`
        @keyframes hero-line-in {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
