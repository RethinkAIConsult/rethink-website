import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { Toaster } from "@/components/ui/sonner";
import {
  organizationSchema,
  professionalServiceSchema,
} from "@/lib/schemas";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rethinkaiconsult.com"),
  title: {
    default: "RethinkAI Consult — AI Automation Engineering",
    template: "%s | RethinkAI Consult",
  },
  description:
    "AI automation consultancy building production pipelines, custom AI agents, and full-stack web applications for businesses that have outgrown manual processes.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "RethinkAI Consult",
    title: "RethinkAI Consult — AI Automation Engineering",
    description:
      "We build AI-powered systems that replace manual busywork. Production automation pipelines, custom AI agents, and full-stack web applications.",
    url: "https://rethinkaiconsult.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "RethinkAI Consult — AI Automation Engineering",
    description:
      "We build AI-powered systems that replace manual busywork. Production automation pipelines, custom AI agents, and full-stack web applications.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    title: "RethinkAI Consult",
    statusBarStyle: "black-translucent",
  },
  alternates: {
    canonical: "https://rethinkaiconsult.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(professionalServiceSchema),
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <SkipToContent />
        <Header />
        {children}
        <Footer />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
