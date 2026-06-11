import type { ReactNode } from "react";
import { FadeIn } from "@/components/fade-in";

interface SectionHeadingProps {
  /** Mono index shown before the eyebrow: "01", "02", ... */
  number: string;
  eyebrow: string;
  title: ReactNode;
  /** Short lead paragraph, rendered in the right column on desktop */
  lead?: ReactNode;
  /** Optional extra element under the lead (usually an ArrowLink) */
  aside?: ReactNode;
  headingId?: string;
}

/**
 * Standard section header: numbered eyebrow + display headline on the left,
 * lead copy and an optional link on the right. The two-column layout puts
 * the previously-empty right half of the header row to work.
 */
export function SectionHeading({
  number,
  eyebrow,
  title,
  lead,
  aside,
  headingId,
}: SectionHeadingProps) {
  return (
    <FadeIn>
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-end lg:gap-12">
        <div>
          <p className="eyebrow mb-3">
            <span className="mr-3 text-muted-foreground/50">{number}</span>
            {eyebrow}
          </p>
          <h2 id={headingId} className="display-lg text-foreground">
            {title}
          </h2>
        </div>
        {(lead || aside) ? (
          <div className="flex flex-col items-start gap-5 lg:pb-1.5">
            {lead ? (
              <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
                {lead}
              </p>
            ) : null}
            {aside}
          </div>
        ) : null}
      </div>
    </FadeIn>
  );
}
