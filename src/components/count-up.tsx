"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}

/**
 * Animated number that counts up when scrolled into view.
 * Server-renders the FINAL value (SEO and no-JS safe); the animation only
 * kicks in client-side, and not at all under prefers-reduced-motion.
 */
export function CountUp({
  value,
  decimals = 0,
  duration = 1100,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(value * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display.toFixed(decimals)}
    </span>
  );
}
