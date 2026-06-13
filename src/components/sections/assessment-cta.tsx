"use client";

import { useEffect, useRef } from "react";
import { FadeIn } from "@/components/fade-in";
import { ArrowLink } from "@/components/arrow-link";

const SCORE_BARS = [
  { label: "SEO Foundations", pct: 82 },
  { label: "Messaging Clarity", pct: 64 },
  { label: "Performance", pct: 91 },
  { label: "Trust Signals", pct: 73 },
];

const BAR_STAGGER_MS = 120;
const BAR_DURATION_MS = 700;

function AnimatedScoreBars() {
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      barRefs.current.forEach((el, i) => {
        if (el) el.style.width = `${SCORE_BARS[i].pct}%`;
      });
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();

        SCORE_BARS.forEach(({ pct }, i) => {
          const el = barRefs.current[i];
          if (!el) return;
          const delay = i * BAR_STAGGER_MS;
          const t0 = performance.now() + delay;

          const tick = (t: number) => {
            if (t < t0) { requestAnimationFrame(tick); return; }
            const p = Math.min((t - t0) / BAR_DURATION_MS, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.style.width = `${pct * eased}%`;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );

    io.observe(container);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="space-y-3">
      {SCORE_BARS.map(({ label, pct }, i) => (
        <div key={label}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-xs text-muted-foreground">
              {label}
            </span>
            <span className="font-mono text-xs text-foreground">{pct}</span>
          </div>
          <div className="h-1.5 rounded bg-muted overflow-hidden">
            <span
              ref={(el) => { barRefs.current[i] = el; }}
              className="block h-full rounded bg-primary"
              style={{ width: 0 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MockReportCard() {
  return (
    <div
      className="rounded-lg border border-border bg-card p-6 max-w-sm w-full"
      aria-hidden="true"
    >
      {/* URL row */}
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-block h-2 w-2 rounded-full bg-primary shrink-0" />
        <span className="font-mono text-sm text-muted-foreground">
          yourcompany.com
        </span>
      </div>

      <AnimatedScoreBars />

      {/* Bottom row */}
      <p className="font-mono text-xs text-primary mt-5">
        3 automation opportunities found
      </p>
    </div>
  );
}

export function AssessmentCta() {
  return (
    <section
      className="relative overflow-hidden border-t border-border py-24 lg:py-32"
      aria-label="Free website assessment"
    >
      {/* Dot grid backdrop */}
      <div
        className="bg-dots absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Left: copy */}
          <FadeIn className="flex-1">
            <p className="eyebrow text-primary">Free tool</p>
            <h2 className="display-lg text-foreground mt-4">
              Know your score before we talk
            </h2>
            <p className="mt-5 text-lg text-muted-foreground max-w-md">
              Paste a URL. We score your site across SEO foundations, messaging
              clarity, and performance, then surface the concrete automation
              opportunities specific to your business. No account required.
            </p>
            <div className="mt-8">
              <ArrowLink href="/assessment" tone="primary">
                Run a free assessment
              </ArrowLink>
            </div>
          </FadeIn>

          {/* Right: decorative mock report card */}
          <FadeIn className="flex lg:justify-end shrink-0">
            <MockReportCard />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
