"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/outbound/copy-button";
import { researchAndSave, type OutreachRow } from "./actions";

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function AngleForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OutreachRow | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const res = await researchAndSave({ name, title, company, companyUrl });
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? "Something went wrong");
      return;
    }
    setResult(res.row ?? null);
    setName("");
    setTitle("");
    setCompany("");
    setCompanyUrl("");
    router.refresh(); // re-fetch the server-rendered log so the new row appears
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={onSubmit}
        className="rounded-xl border-0 ring-1 ring-foreground/10 bg-card p-5 space-y-3"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            className={inputCls}
            placeholder="Contact name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className={inputCls}
            placeholder="Title (e.g. COO)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className={inputCls}
            placeholder="Company *"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
          <input
            className={inputCls}
            placeholder="Company website (optional)"
            value={companyUrl}
            onChange={(e) => setCompanyUrl(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Researching…" : "Research & draft angle"}
          </Button>
          {loading && (
            <span className="text-xs text-muted-foreground">
              Exa is researching the company, DeepSeek is writing the angle…
            </span>
          )}
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </form>

      {result && (
        <div className="rounded-xl border-0 ring-1 ring-primary/30 bg-primary/5 p-5 space-y-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {result.contact_name}
              {result.contact_title && (
                <span className="text-muted-foreground font-normal">
                  {" "}· {result.contact_title}
                </span>
              )}
            </h3>
            <p className="text-sm font-medium text-foreground">{result.company_name}</p>
          </div>

          {result.research_summary && (
            <Field label="What they do">{result.research_summary}</Field>
          )}
          {result.pain_hook && <Field label="Likely manual pain">{result.pain_hook}</Field>}
          {result.angle && <Field label="Your angle">{result.angle}</Field>}

          {result.connect_note && (
            <div className="rounded-lg border border-border bg-background px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="eyebrow text-muted-foreground">LinkedIn connect note</p>
                <CopyButton text={result.connect_note} />
              </div>
              <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                {result.connect_note}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {result.connect_note.length} / 300 characters
              </p>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Saved to your log below. Mark it contacted once you send the request.
          </p>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm text-foreground leading-relaxed">{children}</p>
    </div>
  );
}
