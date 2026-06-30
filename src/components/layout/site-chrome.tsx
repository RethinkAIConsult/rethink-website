"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingCta } from "@/components/floating-cta";

// The marketing header/footer/CTA belong to the public site only. The /outbound
// app and the auth pages render their own chrome, so suppress the marketing
// shell there (otherwise you get two stacked headers).
const APP_PREFIXES = ["/outbound", "/sign-in", "/sign-up"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isApp = APP_PREFIXES.some((p) => pathname.startsWith(p));

  if (isApp) return <>{children}</>;

  return (
    <>
      <Header />
      {children}
      <Footer />
      <FloatingCta />
    </>
  );
}
