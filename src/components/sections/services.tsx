import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { ArrowLink } from "@/components/arrow-link";
import { SERVICES } from "@/lib/data";

export function Services() {
  const coreServices = SERVICES.slice(0, 4);
  const featuredService = SERVICES[SERVICES.length - 1];

  return (
    <section
      id="services"
      className="border-t border-border py-20 lg:py-28"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <SectionHeading
          number="01"
          eyebrow="What We Build"
          headingId="services-heading"
          title={<>Engineering capabilities, end to end</>}
          lead="We start by understanding how your team actually works. Every delivery ends with systems that run without you."
          aside={<ArrowLink href="#work">See it in production</ArrowLink>}
        />

        {/* What we automate strip */}
        <div className="mt-10 lg:mt-12">
          <p className="eyebrow mb-4 text-muted-foreground">What we automate</p>
          <ul
            className="flex flex-wrap gap-2"
            role="list"
            aria-label="Workflows we automate"
          >
            {[
              "Lead routing and CRM enrichment",
              "Document processing and data extraction",
              "Automated reporting and dashboards",
              "Customer support triage and deflection",
              "Onboarding and HR workflow automation",
            ].map((workflow) => (
              <li
                key={workflow}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground"
              >
                {workflow}
              </li>
            ))}
          </ul>
        </div>

        {/* Service cards */}
        <div className="mt-12 lg:mt-14 grid gap-5 sm:grid-cols-2">
          {coreServices.map((service, i) => {
            const Icon = service.icon;
            return (
              <FadeIn key={service.title} delay={i * 0.06} className="min-w-0">
                <div className="group h-full rounded-lg border border-border bg-card p-6 transition-colors duration-200 hover:border-primary/40 lg:p-7">

                  {/* Icon chip */}
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {service.title}
                  </h3>

                  {/* Lead */}
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>

                  {/* Details */}
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {service.details}
                  </p>

                  {/* Deliverables */}
                  <div className="mt-5">
                    <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Deliverables
                    </p>
                    <ul className="space-y-2" role="list">
                      {service.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm text-muted-foreground"
                        >
                          <span
                            className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech badges */}
                  <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border/60 pt-4">
                    {service.techBadges.map((badge) => (
                      <Badge
                        key={badge}
                        variant="secondary"
                        className="h-5 rounded-full px-2 text-xs font-mono text-muted-foreground"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Featured service: GEO and AI Visibility */}
        {featuredService && (() => {
          const Icon = featuredService.icon;
          return (
            <FadeIn delay={0.28} className="mt-5">
              <div className="group rounded-lg border border-primary/30 bg-primary/[0.03] p-6 transition-colors duration-200 hover:border-primary/40 lg:p-8">

                {/* Top row: eyebrow label */}
                <p className="eyebrow mb-5 text-primary">New service</p>

                {/* Horizontal layout: left content / right deliverables */}
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">

                  {/* Left: icon, title, description, details */}
                  <div>
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {featuredService.title}
                    </h3>

                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                      {featuredService.description}
                    </p>

                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {featuredService.details}
                    </p>
                  </div>

                  {/* Right: deliverables */}
                  <div className="flex flex-col justify-start">
                    <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Deliverables
                    </p>
                    <ul className="space-y-2" role="list">
                      {featuredService.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm text-muted-foreground"
                        >
                          <span
                            className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tech badges along the bottom */}
                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-border/60 pt-4">
                  {featuredService.techBadges.map((badge) => (
                    <Badge
                      key={badge}
                      variant="secondary"
                      className="h-5 rounded-full px-2 text-xs font-mono text-muted-foreground"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </FadeIn>
          );
        })()}

        <FadeIn delay={0.34}>
          <div className="mt-10 text-center">
            <ArrowLink href="/services">Explore all services</ArrowLink>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
