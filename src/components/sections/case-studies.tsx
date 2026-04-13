import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/fade-in";
import { CASE_STUDIES } from "@/lib/data";

export function CaseStudies() {
  return (
    <section id="work" className="border-t border-border/50 py-24" aria-labelledby="work-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="max-w-2xl">
            <h2 id="work-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Work
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Real projects, real results. Every engagement is an end-to-end build —
              from architecture through to production deployment and ongoing support.
            </p>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {CASE_STUDIES.map((study, i) => (
            <FadeIn key={study.title} delay={i * 0.1}>
            <Card
              className="group h-full border-border/50 bg-card transition-colors hover:border-primary/30"
            >
              {/* Decorative header bar */}
              <div className="h-1.5 rounded-t-lg bg-gradient-to-r from-primary to-accent" />

              <CardHeader>
                <div className="flex flex-wrap gap-1.5 pb-2">
                  {study.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs text-muted-foreground"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-xl">{study.title}</CardTitle>
                <p className="text-sm font-medium text-primary">
                  {study.subtitle}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {study.description}
                </p>
                <ul className="space-y-1.5">
                  {study.results.map((result) => (
                    <li
                      key={result}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {result}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
