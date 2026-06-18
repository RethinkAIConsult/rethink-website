import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { FloatingCta } from "@/components/floating-cta";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import {
  organizationSchema,
  personSchema,
  professionalServiceSchema,
  webSiteSchema,
} from "@/lib/schemas";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rethinkaiconsult.com"),
  title: {
    default: "RethinkAI Consult: AI Engineering Studio",
    template: "%s | RethinkAI Consult",
  },
  description:
    "RethinkAI Consult is an AI engineering studio that builds production automation pipelines, custom AI agents, and full-stack applications for ambitious teams.",
  keywords: [
    "AI engineering",
    "AI automation",
    "AI agents",
    "production AI",
    "LLM engineering",
    "automation consultancy",
    "AI pipelines",
    "Next.js",
    "Inngest",
    "full-stack development",
    "UK AI studio",
  ],
  authors: [{ name: "RethinkAI Consult", url: "https://rethinkaiconsult.com" }],
  creator: "RethinkAI Consult",
  publisher: "RethinkAI Consult",
  category: "Technology",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "RethinkAI Consult",
    title: "RethinkAI Consult: AI Engineering Studio",
    description:
      "We build AI-powered systems that replace manual busywork. Production automation pipelines, custom AI agents, and full-stack applications for teams that have outgrown manual processes.",
    url: "https://rethinkaiconsult.com",
    images: [
      {
        url: "https://rethinkaiconsult.com/opengraph-image",
        width: 1200,
        height: 630,
        alt: "RethinkAI Consult: AI Engineering Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rethinkaiconsult",
    title: "RethinkAI Consult: AI Engineering Studio",
    description:
      "We build AI-powered systems that replace manual busywork. Production automation pipelines, custom AI agents, and full-stack applications.",
    images: ["https://rethinkaiconsult.com/opengraph-image"],
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
    statusBarStyle: "default",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F9FB" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0F" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SkipToContent />
          <Header />
          {children}
          <Footer />
          <FloatingCta />
          <Toaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
