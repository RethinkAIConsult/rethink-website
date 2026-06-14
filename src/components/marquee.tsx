import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
}

/**
 * Infinite horizontal marquee. Content is rendered three times (copies are
 * aria-hidden) and the track scrolls one group width (-33.333%) on a loop, so
 * there is always content filling the viewport and the scroll never ends or
 * gaps, on any screen width. Pauses on hover and disables entirely under
 * prefers-reduced-motion (CSS handles both). Server-component safe.
 */
export function Marquee({ children, className }: MarqueeProps) {
  return (
    <div className={`marquee${className ? ` ${className}` : ""}`}>
      <div className="marquee-track">
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden="true">
          {children}
        </div>
        <div className="marquee-group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
