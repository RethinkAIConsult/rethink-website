import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import {
  SiTypescript,
  SiJavascript,
  SiPython,
  SiNodedotjs,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiShadcnui,
  SiPostgresql,
  SiSupabase,
  SiRedis,
  SiVercel,
  SiDocker,
  SiGithubactions,
  SiN8N,
  SiZapier,
  SiMake,
  SiTemporal,
  SiAnthropic,
  SiOpenai,
  SiLangchain,
  SiHuggingface,
  SiSalesforce,
  SiHubspot,
  SiStripe,
  SiXero,
  SiAirtable,
  SiSlack,
  SiTwilio,
  SiResend,
  SiGoogle,
  SiClerk,
  SiSentry,
} from "react-icons/si";
import type { IconType } from "react-icons";

type TechItem =
  | { kind: "icon"; name: string; Icon: IconType }
  | { kind: "chip"; name: string };

interface TechCategory {
  label: string;
  items: TechItem[];
}

const TECH_CATEGORIES: TechCategory[] = [
  {
    label: "Languages",
    items: [
      { kind: "icon", name: "TypeScript", Icon: SiTypescript },
      { kind: "icon", name: "JavaScript", Icon: SiJavascript },
      { kind: "icon", name: "Python", Icon: SiPython },
      { kind: "icon", name: "Node.js", Icon: SiNodedotjs },
      { kind: "chip", name: "SQL" },
    ],
  },
  {
    label: "Frameworks and UI",
    items: [
      { kind: "icon", name: "Next.js", Icon: SiNextdotjs },
      { kind: "icon", name: "React", Icon: SiReact },
      { kind: "icon", name: "Tailwind CSS", Icon: SiTailwindcss },
      { kind: "icon", name: "shadcn/ui", Icon: SiShadcnui },
    ],
  },
  {
    label: "Data and Infra",
    items: [
      { kind: "icon", name: "PostgreSQL", Icon: SiPostgresql },
      { kind: "chip", name: "Neon" },
      { kind: "icon", name: "Supabase", Icon: SiSupabase },
      { kind: "icon", name: "Redis", Icon: SiRedis },
      { kind: "icon", name: "Vercel", Icon: SiVercel },
      { kind: "chip", name: "AWS" },
      { kind: "icon", name: "Docker", Icon: SiDocker },
      { kind: "icon", name: "GitHub Actions", Icon: SiGithubactions },
    ],
  },
  {
    label: "Automation",
    items: [
      { kind: "chip", name: "Inngest" },
      { kind: "icon", name: "n8n", Icon: SiN8N },
      { kind: "icon", name: "Zapier", Icon: SiZapier },
      { kind: "icon", name: "Make", Icon: SiMake },
      { kind: "icon", name: "Temporal", Icon: SiTemporal },
    ],
  },
  {
    label: "AI and Agents",
    items: [
      { kind: "icon", name: "Anthropic Claude", Icon: SiAnthropic },
      { kind: "icon", name: "OpenAI", Icon: SiOpenai },
      { kind: "icon", name: "LangChain", Icon: SiLangchain },
      { kind: "chip", name: "Vercel AI SDK" },
      { kind: "icon", name: "Hugging Face", Icon: SiHuggingface },
    ],
  },
  {
    label: "Integrations",
    items: [
      { kind: "icon", name: "Salesforce", Icon: SiSalesforce },
      { kind: "icon", name: "HubSpot", Icon: SiHubspot },
      { kind: "icon", name: "Stripe", Icon: SiStripe },
      { kind: "icon", name: "Xero", Icon: SiXero },
      { kind: "icon", name: "Airtable", Icon: SiAirtable },
      { kind: "icon", name: "Slack", Icon: SiSlack },
      { kind: "icon", name: "Twilio", Icon: SiTwilio },
      { kind: "icon", name: "Resend", Icon: SiResend },
      { kind: "icon", name: "Google Workspace", Icon: SiGoogle },
    ],
  },
  {
    label: "Auth and Quality",
    items: [
      { kind: "icon", name: "Clerk", Icon: SiClerk },
      { kind: "chip", name: "Playwright" },
      { kind: "icon", name: "Sentry", Icon: SiSentry },
    ],
  },
];

function TechPill({ item }: { item: TechItem }) {
  if (item.kind === "icon") {
    const { Icon, name } = item;
    return (
      <span className="group inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 transition-colors duration-150 hover:border-primary/40">
        <Icon
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-foreground"
          aria-hidden="true"
        />
        <span className="font-mono text-xs font-medium text-muted-foreground transition-colors duration-150 group-hover:text-foreground">
          {name}
        </span>
      </span>
    );
  }

  return (
    <span className="group inline-flex items-center rounded-md border border-border px-3 py-1.5 transition-colors duration-150 hover:border-primary/40">
      <span className="font-mono text-xs font-medium text-muted-foreground transition-colors duration-150 group-hover:text-foreground">
        {item.name}
      </span>
    </span>
  );
}

export function TechStack() {
  return (
    <section
      id="stack"
      className="border-t border-border py-20 lg:py-28"
      aria-labelledby="tech-stack-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="02"
          eyebrow="The Stack"
          headingId="tech-stack-heading"
          title={<>The stack we build on</>}
          lead="Every tool earns its place. Battle-tested primitives first, specialised platforms only when they reduce complexity. Active across current and recent engagements. We onboard to client-mandated tooling without friction."
        />

        <div className="mt-12 space-y-7 lg:mt-14">
          {TECH_CATEGORIES.map((category, categoryIndex) => (
            <FadeIn key={category.label} delay={categoryIndex * 0.06}>
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="eyebrow">{category.label}</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <TechPill key={item.name} item={item} />
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
