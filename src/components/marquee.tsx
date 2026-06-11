import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
}

/**
 * Infinite horizontal marquee. Content is duplicated once (the copy is
 * aria-hidden) and the track scrolls -50% on a loop. Pauses on hover and
 * disables entirely under prefers-reduced-motion (CSS handles both).
 * Server-component safe.
 */
export function Marquee({ children, className }: MarqueeProps) {
  return (
    <div className={`marquee${className ? ` ${className}` : ""}`}>
      <div className="marquee-track">
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
