"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ContactFormData, ContactFormState } from "@/types";

const BUDGET_OPTIONS = [
  { value: "", label: "Select a range (optional)" },
  { value: "under-5k", label: "Under £5,000" },
  { value: "5k-15k", label: "£5,000 to £15,000" },
  { value: "15k-50k", label: "£15,000 to £50,000" },
  { value: "50k-plus", label: "£50,000+" },
] as const;

const REFERRAL_OPTIONS = [
  { value: "", label: "Select an option (optional)" },
  { value: "search", label: "Search engine" },
  { value: "social", label: "Social media" },
  { value: "referral", label: "Referral" },
  { value: "github", label: "GitHub" },
  { value: "other", label: "Other" },
] as const;

const INITIAL_FORM: ContactFormData = {
  name: "",
  email: "",
  company: "",
  budget: "",
  message: "",
  referral: "",
  website: "",
};

const labelClass =
  "block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1.5";

const inputClass =
  "flex h-11 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary";

const selectClass =
  "flex h-11 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary";

export function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);
  const [state, setState] = useState<ContactFormState>({
    status: "idle",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!form.message.trim()) {
      newErrors.message = "Please describe your project";
    } else if (form.message.trim().length < 20) {
      newErrors.message = "Please provide a bit more detail (20+ characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function updateField(field: keyof ContactFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setState({ status: "submitting", message: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      setState({ status: "success", message: "" });
      setForm(INITIAL_FORM);
      toast.success("Message sent. We will get back to you within 24 hours.");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setState({ status: "error", message });
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot, hidden from real users */}
      <div className="absolute -left-[9999px]" aria-hidden="true" tabIndex={-1}>
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          value={form.website}
          onChange={(e) => updateField("website", e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            className={inputClass}
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1.5 text-xs text-destructive" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-destructive">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-xs text-destructive" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className={labelClass}>
            Company
          </label>
          <input
            id="company"
            className={inputClass}
            value={form.company}
            onChange={(e) => updateField("company", e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div>
          <label htmlFor="budget" className={labelClass}>
            Budget Range
          </label>
          <select
            id="budget"
            value={form.budget}
            onChange={(e) => updateField("budget", e.target.value)}
            className={selectClass}
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-card text-foreground">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Project Description <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          className="flex w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary resize-none"
          value={form.message}
          onChange={(e) => updateField("message", e.target.value)}
          placeholder="What are you trying to solve, what tools are involved, and what does success look like?"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-xs text-destructive" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="referral" className={labelClass}>
          How did you find us?
        </label>
        <select
          id="referral"
          value={form.referral}
          onChange={(e) => updateField("referral", e.target.value)}
          className={selectClass}
        >
          {REFERRAL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-card text-foreground">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full sm:w-auto"
        disabled={state.status === "submitting"}
      >
        {state.status === "submitting" ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
