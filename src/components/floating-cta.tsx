"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Calendar } from "lucide-react";

// Show the floating CTA once the visitor has scrolled past the hero, so it never
// sits on top of the in-page "Book a call" button at the very top.
const SCROLL_THRESHOLD = 500;

export function FloatingCta() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [contactInView, setContactInView] = useState(false);

  // Reveal on scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide while the booking section is on screen so the pill never covers the
  // calendar. Re-bind on navigation because #contact only exists on the home page.
  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    const observer = new IntersectionObserver(
      ([entry]) => setContactInView(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px" },
    );
    observer.observe(contact);
    // Disconnect and clear on navigation: #contact only exists on the home page,
    // so without this the pill could stay hidden after leaving it.
    return () => {
      observer.disconnect();
      setContactInView(false);
    };
  }, [pathname]);

  const show = scrolled && !contactInView;

  return (
    <div
      className={`fixed bottom-5 right-4 z-40 transition-[opacity,transform] duration-300 motion-reduce:transition-none sm:bottom-6 sm:right-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <Link
        href="/#contact"
        aria-hidden={!show}
        tabIndex={show ? 0 : -1}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lg shadow-black/10 transition-colors duration-200 hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:shadow-black/40"
      >
        <Calendar className="h-4 w-4" aria-hidden="true" />
        Book a call
      </Link>
    </div>
  );
}
