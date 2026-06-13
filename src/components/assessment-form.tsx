"use client";

import { useState } from "react";
import { BOOKING_URL } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { AssessmentReport, AssessmentFinding, AutomationOpportunity } from "@/lib/assessment";

type FormState = {
  url: string;
  email: string;
  name: string;
};

type Status = "idle" | "loading" | "done" | "error";

const SEVERITY_COLOR: Record<AssessmentFinding["severity"], string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20",
  low: "bg-muted text-muted-foreground border-border",
};

const IMPACT_LABEL: Record<AutomationOpportunity["estimatedImpact"], string> = {
  high: "High impact",
  medium: "Medium impact",
  low: "Low impact",
};

function ScoreRing({ score }: { score: number }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const color =
    score >= 75 ? "#2563EB" : score >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--border)" strokeWidth="7" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div className="text-center">
        <span className="font-mono text-2xl font-bold tabular-nums" style={{ color }}>
          {score}
        </span>
        <span className="block font-mono text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

function FindingCard({ finding }: { finding: AssessmentFinding }) {
  return (
    <div className={`rounded-lg border p-4 ${SEVERITY_COLOR[finding.severity]}`}>
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-wider opacity-80">
          {finding.category}
        </span>
        <span className="font-mono text-xs uppercase tracking-wider opacity-60">
          {finding.severity}
        </span>
      </div>
      <p className="text-sm font-medium leading-snug">{finding.finding}</p>
      <p className="mt-1 text-sm opacity-80">{finding.recommendation}</p>
    </div>
  );
}

function OpportunityCard({ opportunity }: { opportunity: AutomationOpportunity }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 hover:border-primary/40 transition-colors">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h4 className="text-sm font-semibold leading-snug">{opportunity.title}</h4>
        <Badge variant="secondary" className="shrink-0 text-xs">
          {IMPACT_LABEL[opportunity.estimatedImpact]}
        </Badge>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{opportunity.description}</p>
    </div>
  );
}

function AssessmentResult({ report }: { report: AssessmentReport }) {
  return (
    <div className="mt-12 space-y-10">
      <div className="section-divider" />

      {/* Score header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <ScoreRing score={report.score} />
        <div className="min-w-0">
          <p className="eyebrow text-primary">Assessment complete</p>
          <h3 className="mt-1 text-xl font-semibold leading-snug">{report.url}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{report.summary}</p>
        </div>
      </div>

      {/* Signals */}
      <div>
        <p className="eyebrow mb-4 text-muted-foreground">Page signals</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {(
            [
              { label: "HTTPS", value: report.signals.isHttps ? "Yes" : "No", pass: report.signals.isHttps },
              { label: "Viewport", value: report.signals.hasViewportMeta ? "Yes" : "No", pass: report.signals.hasViewportMeta },
              { label: "OG Tags", value: report.signals.hasOgTags ? "Yes" : "No", pass: report.signals.hasOgTags },
              { label: "JSON-LD", value: report.signals.hasJsonLd ? "Yes" : "No", pass: report.signals.hasJsonLd },
              { label: "H1 Count", value: String(report.signals.h1Count), pass: report.signals.h1Count === 1 },
              { label: "Weight", value: `${report.signals.roughWeightKb} KB`, pass: report.signals.roughWeightKb < 1000 },
            ] as { label: string; value: string; pass: boolean }[]
          ).map((sig) => (
            <div key={sig.label} className="rounded-lg border border-border bg-card p-3 text-center">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{sig.label}</p>
              <p className={`mt-1 font-mono text-sm font-semibold ${sig.pass ? "text-primary" : "text-destructive"}`}>
                {sig.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Findings */}
      {report.findings.length > 0 && (
        <div>
          <p className="eyebrow mb-4 text-muted-foreground">Findings</p>
          <div className="space-y-3">
            {report.findings.map((f, i) => (
              <FindingCard key={i} finding={f} />
            ))}
          </div>
        </div>
      )}

      {/* Automation opportunities */}
      {report.opportunities.length > 0 && (
        <div>
          <p className="eyebrow mb-1 text-primary">AI automation opportunities</p>
          <p className="mb-4 text-sm text-muted-foreground">
            Based on what we found, here are the highest-value automation wins for this business.
          </p>
          <div className="space-y-3">
            {report.opportunities.map((op, i) => (
              <OpportunityCard key={i} opportunity={op} />
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="rounded-lg border border-border bg-card p-7">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Next step
        </p>
        <p className="mt-3 text-base font-semibold text-foreground">
          Ready to act on these findings?
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          We turn recommendations into a running system in weeks. Book a free 20-minute call and
          we will walk through what is possible for your stack.
        </p>
        <a
          href={BOOKING_URL || "/#contact"}
          {...(BOOKING_URL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Book a call
        </a>
      </div>
    </div>
  );
}

export function AssessmentForm() {
  const [form, setForm] = useState<FormState>({ url: "", email: "", name: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [report, setReport] = useState<AssessmentReport | null>(null);

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.url.trim()) newErrors.url = "Website URL is required.";
    if (!form.email.trim()) {
      newErrors.email = "Work email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setReport(null);

    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setReport(data.report as AssessmentReport);
      setStatus("done");
      toast.success("Assessment complete.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setStatus("error");
      toast.error(message);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="assess-url"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Website URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="assess-url"
              type="url"
              placeholder="https://yourcompany.com"
              value={form.url}
              onChange={(e) => updateField("url", e.target.value)}
              aria-invalid={!!errors.url}
              aria-describedby={errors.url ? "url-error" : undefined}
              disabled={status === "loading"}
            />
            {errors.url && (
              <p id="url-error" className="text-sm text-destructive" role="alert">
                {errors.url}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="assess-email"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Work email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="assess-email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={status === "loading"}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive" role="alert">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="assess-name"
            className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Your name (optional)
          </Label>
          <Input
            id="assess-name"
            type="text"
            placeholder="Alex Smith"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            disabled={status === "loading"}
            className="sm:max-w-xs"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={status === "loading"}
            className="min-w-40 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {status === "loading" ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Analysing...
              </span>
            ) : (
              "Run assessment"
            )}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Takes around 15 to 30 seconds. No account required.
          </p>
        </div>
      </form>

      {status === "done" && report && <AssessmentResult report={report} />}
    </div>
  );
}
