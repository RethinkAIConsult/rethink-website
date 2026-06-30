"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/outbound" },
  { label: "Queue", href: "/outbound/angle" },
  { label: "Pipeline", href: "/outbound/pipeline" },
] as const;

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-5" aria-label="Primary navigation">
      {NAV_ITEMS.map(({ label, href }) => {
        // Exact match for /outbound so Pipeline doesn't highlight on sub-routes
        const isActive =
          href === "/outbound"
            ? pathname === "/outbound"
            : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "border-b-2 pb-0.5 font-mono text-xs uppercase tracking-[0.12em] transition-colors duration-200 hover:text-foreground",
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
