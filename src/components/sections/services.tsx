import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/fade-in";
import { SERVICES } from "@/lib/data";

export function Services() {
  return (
    <section id="services" className="border-t border-border/50 py-24" aria-labelledby="services-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="max-w-2xl">
            <h2 id="services-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
              What We Build
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every engagement starts with understanding your operations and ends
              with systems that run without you. Here&apos;s what we deliver.
            </p>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <FadeIn key={service.title} delay={i * 0.1}>
              <Card
                className="group h-full border-border/50 bg-card transition-colors hover:border-primary/30"
              >
                <CardHeader>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-medium text-foreground">
                    {service.description}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {service.details}
                  </p>
                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">
                      What you get:
                    </p>
                    <ul className="space-y-1">
                      {service.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {service.techBadges.map((badge) => (
                      <Badge
                        key={badge}
                        variant="secondary"
                        className="text-xs text-muted-foreground"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
