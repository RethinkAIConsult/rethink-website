import { Mail } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { FadeIn } from "@/components/fade-in";

const PROOF_POINTS = [
  { label: "Response time", value: "Within 24 hours" },
  { label: "First call", value: "No commitment" },
  { label: "Proposal", value: "Fixed scope, fixed price" },
] as const;

export function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-border py-20 lg:py-28"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <FadeIn>
          <div className="text-center">
            <p className="eyebrow mb-3">
              <span className="font-mono text-muted-foreground/50 mr-2">06</span>
              Get in touch
            </p>
            <h2
              id="contact-heading"
              className="display-lg text-foreground"
            >
              Ready to rethink how you work?
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-[40rem] mx-auto">
              Tell us about your project. We will respond within 24 hours with an honest read on whether we can help and what it would take.
            </p>
          </div>
        </FadeIn>

        <div className="mt-12 lg:mt-14 mx-auto max-w-3xl">

          {/* Proof points strip */}
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

          {/* Form card */}
          <FadeIn delay={0.15}>
            <div className="relative mt-6 rounded-lg border border-border bg-card p-7 sm:p-8">
              <ContactForm />
            </div>
          </FadeIn>

          {/* Direct email */}
          <FadeIn delay={0.2}>
            <div className="mt-6 flex flex-col items-center gap-1.5 text-center">
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
              <p className="text-xs text-muted-foreground/60">
                Prefer a call? We will set one up after your first message.
              </p>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}
