"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const CAL_LINK = "jack-costanzi/intro-call";
const NS = "intro";

/**
 * Inline Cal.com booking calendar embedded directly in the page (no form).
 * Uses Cal's official inline loader, which auto-resizes the iframe to its
 * content, so the page scrolls naturally with no scroll-within-scroll. The
 * loader script is deferred behind an IntersectionObserver: the calendar sits
 * in the last section of the page, so we only load Cal once it scrolls near the
 * viewport rather than blocking initial render. Themed to follow the site.
 */
export function CalEmbed() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const containerRef = useRef<HTMLDivElement>(null);
  const embedded = useRef(false);
  const [inView, setInView] = useState(false);

  // Defer loading until the calendar is near the viewport.
  useEffect(() => {
    if (inView) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    if (!inView) return;

    // Official Cal.com embed loader (namespaced).
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) {
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function (...args: any[]) {
          const cal = C.Cal;
          const ar = args;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api: any = function (...a2: any[]) {
              p(api, a2);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    const Cal = (window as any).Cal;
    if (!embedded.current) {
      embedded.current = true;
      Cal("init", NS, { origin: "https://cal.com" });
      Cal.ns[NS]("inline", {
        elementOrSelector: "#cal-inline",
        calLink: CAL_LINK,
        config: { layout: "month_view" },
      });
    }
    Cal.ns[NS]("ui", {
      theme,
      hideEventTypeDetails: false,
      layout: "month_view",
      cssVarsPerTheme: {
        light: { "cal-brand": "#2563EB" },
        dark: { "cal-brand": "#2563EB" },
      },
    });
  }, [inView, theme]);

  return (
    <div
      ref={containerRef}
      id="cal-inline"
      role="region"
      aria-label="Booking calendar"
      style={{ width: "100%", minHeight: 520 }}
    />
  );
}
