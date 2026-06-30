import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppNav } from "@/components/outbound/app-nav";
import { StatsBar } from "@/components/outbound/stats-bar";
import { getFunnel } from "@/app/(app)/outbound/angle/actions";
import { hasClerk } from "@/lib/env";
import { Logo } from "@/components/logo";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth only activates when Clerk keys are present (i.e. on Vercel). Locally
  // the /outbound routes are open so the real app is usable without login.
  const authOn = hasClerk();
  if (authOn) await auth.protect();
  const f = await getFunnel();
  const stats = {
    queued: f["ready"] ?? 0,
    sentToday: f["sent_today"] ?? 0,
    contactedTotal:
      (f["connect_sent"] ?? 0) + (f["connected"] ?? 0) + (f["replied"] ?? 0) + (f["call_booked"] ?? 0) + (f["won"] ?? 0),
  };

  const shell = (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1760px] items-center justify-between px-6 lg:px-10 h-16">
          {/* Brand — same lockup as the marketing site */}
          <div className="flex items-center gap-8">
            <Link
              href="/outbound"
              className="flex items-center transition-opacity hover:opacity-80"
              aria-label="RethinkAI Outbound"
            >
              <Logo />
              <span className="ml-2.5 hidden border-l border-border pl-2.5 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground sm:inline-block">
                Outbound
              </span>
            </Link>
            {/* Primary nav */}
            <AppNav />
          </div>
          {/* Right side controls */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex">
              <StatsBar
                queued={stats.queued}
                sentToday={stats.sentToday}
                contactedTotal={stats.contactedTotal}
              />
            </span>
            <ThemeToggle />
            {authOn ? (
              <UserButton appearance={{ elements: { avatarBox: "h-7 w-7" } }} />
            ) : (
              <span
                className="rounded bg-muted px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground"
                title="Auth is disabled locally; it activates on Vercel"
              >
                Local
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto w-full max-w-[1760px] px-6 lg:px-10 py-8">
        {children}
      </main>
    </div>
  );

  return authOn ? <ClerkProvider>{shell}</ClerkProvider> : shell;
}
