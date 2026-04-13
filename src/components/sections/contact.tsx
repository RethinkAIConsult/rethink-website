import { Mail } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export function Contact() {
  return (
    <section id="contact" className="border-t border-border/50 py-24" aria-labelledby="contact-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="contact-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Rethink How You Work?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tell us about your project. We&apos;ll get back within 24 hours with
            an honest assessment of how we can help.
          </p>
        </div>

        <div className="relative mt-12 rounded-xl border border-border/50 bg-card p-6 sm:p-8">
          <ContactForm />
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            Or email directly:{" "}
            <a
              href="mailto:jack@rethinkaiconsult.com"
              className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              jack@rethinkaiconsult.com
            </a>
          </p>
          <p className="text-xs text-muted-foreground/60">
            Prefer a call? We&apos;ll set one up after your initial message.
          </p>
        </div>
      </div>
    </section>
  );
}
