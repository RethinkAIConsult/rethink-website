"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "none";
}

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const y = direction === "up" ? 24 : direction === "down" ? -16 : 0;

  // LazyMotion + `m` ship only the DOM animation feature set instead of the full
  // `motion` proxy (drag/layout/gesture code), shrinking the client bundle.
  // Animate on mount, not whileInView: whileInView gates on a scroll observer
  // that fails to re-fire on client-side back-navigation, leaving content stuck
  // at opacity 0 (the "blank until refresh" bug). Mount-triggered animation
  // always fires, and everything reveals at once instead of waiting on scroll.
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay, ease: "easeOut" }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
