import { ArrowLink } from "@/components/arrow-link";
import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import {
  SiTypescript,
  SiJavascript,
  SiPython,
  SiGo,
  SiRust,
  SiNodedotjs,
  SiNextdotjs,
  SiReact,
  SiVuedotjs,
  SiSvelte,
  SiAstro,
  SiRemix,
  SiTailwindcss,
  SiShadcnui,
  SiExpress,
  SiNestjs,
  SiFastapi,
  SiDjango,
  SiFlask,
  SiGraphql,
  SiTrpc,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,
  SiClickhouse,
  SiSnowflake,
  SiGooglebigquery,
  SiSupabase,
  SiPrisma,
  SiDrizzle,
  SiElasticsearch,
  SiVercel,
  SiNetlify,
  SiCloudflare,
  SiGooglecloud,
  SiDocker,
  SiKubernetes,
  SiTerraform,
  SiGithubactions,
  SiAnthropic,
  SiOpenai,
  SiGooglegemini,
  SiMeta,
  SiMistralai,
  SiHuggingface,
  SiOllama,
  SiPerplexity,
  SiLangchain,
  SiLanggraph,
  SiN8N,
  SiZapier,
  SiMake,
  SiTemporal,
  SiApacheairflow,
  SiSentry,
  SiDatadog,
  SiPosthog,
  SiGrafana,
  SiPrometheus,
  SiVitest,
  SiJest,
  SiClerk,
  SiAuth0,
} from "react-icons/si";
import type { IconType } from "react-icons";

// Tools RethinkAI leads with: subtly stronger visual treatment in both themes.
const CORE_TOOLS = new Set([
  "TypeScript",
  "Inngest",
  "Anthropic Claude",
  "Next.js",
  "PostgreSQL",
]);

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
      { kind: "icon", name: "Go", Icon: SiGo },
      { kind: "icon", name: "Rust", Icon: SiRust },
      { kind: "chip", name: "SQL" },
      { kind: "icon", name: "Node.js", Icon: SiNodedotjs },
    ],
  },
  {
    label: "Frameworks and UI",
    items: [
      { kind: "icon", name: "Next.js", Icon: SiNextdotjs },
      { kind: "icon", name: "React", Icon: SiReact },
      { kind: "icon", name: "Vue", Icon: SiVuedotjs },
      { kind: "icon", name: "Svelte", Icon: SiSvelte },
      { kind: "icon", name: "Astro", Icon: SiAstro },
      { kind: "icon", name: "Remix", Icon: SiRemix },
      { kind: "icon", name: "Tailwind CSS", Icon: SiTailwindcss },
      { kind: "icon", name: "shadcn/ui", Icon: SiShadcnui },
    ],
  },
  {
    label: "Backend and APIs",
    items: [
      { kind: "icon", name: "Express", Icon: SiExpress },
      { kind: "icon", name: "NestJS", Icon: SiNestjs },
      { kind: "icon", name: "FastAPI", Icon: SiFastapi },
      { kind: "icon", name: "Django", Icon: SiDjango },
      { kind: "icon", name: "Flask", Icon: SiFlask },
      { kind: "icon", name: "GraphQL", Icon: SiGraphql },
      { kind: "icon", name: "tRPC", Icon: SiTrpc },
    ],
  },
  {
    label: "Data and Storage",
    items: [
      { kind: "icon", name: "PostgreSQL", Icon: SiPostgresql },
      { kind: "icon", name: "MySQL", Icon: SiMysql },
      { kind: "icon", name: "MongoDB", Icon: SiMongodb },
      { kind: "icon", name: "Redis", Icon: SiRedis },
      { kind: "icon", name: "ClickHouse", Icon: SiClickhouse },
      { kind: "icon", name: "Snowflake", Icon: SiSnowflake },
      { kind: "icon", name: "BigQuery", Icon: SiGooglebigquery },
      { kind: "icon", name: "Supabase", Icon: SiSupabase },
      { kind: "chip", name: "Neon" },
      { kind: "icon", name: "Prisma", Icon: SiPrisma },
      { kind: "icon", name: "Drizzle", Icon: SiDrizzle },
      { kind: "icon", name: "Elasticsearch", Icon: SiElasticsearch },
      { kind: "chip", name: "pgvector" },
      { kind: "chip", name: "Pinecone" },
    ],
  },
  {
    label: "Cloud and Infra",
    items: [
      { kind: "icon", name: "Vercel", Icon: SiVercel },
      { kind: "chip", name: "AWS" },
      { kind: "icon", name: "Google Cloud", Icon: SiGooglecloud },
      { kind: "chip", name: "Azure" },
      { kind: "icon", name: "Cloudflare", Icon: SiCloudflare },
      { kind: "icon", name: "Netlify", Icon: SiNetlify },
      { kind: "icon", name: "Docker", Icon: SiDocker },
      { kind: "icon", name: "Kubernetes", Icon: SiKubernetes },
      { kind: "icon", name: "Terraform", Icon: SiTerraform },
      { kind: "icon", name: "GitHub Actions", Icon: SiGithubactions },
    ],
  },
  {
    label: "AI and Models",
    items: [
      { kind: "icon", name: "Anthropic Claude", Icon: SiAnthropic },
      { kind: "icon", name: "OpenAI", Icon: SiOpenai },
      { kind: "icon", name: "Google Gemini", Icon: SiGooglegemini },
      { kind: "icon", name: "Meta Llama", Icon: SiMeta },
      { kind: "icon", name: "Mistral", Icon: SiMistralai },
      { kind: "chip", name: "Cohere" },
      { kind: "icon", name: "Hugging Face", Icon: SiHuggingface },
      { kind: "icon", name: "Ollama", Icon: SiOllama },
      { kind: "icon", name: "Perplexity", Icon: SiPerplexity },
    ],
  },
  {
    label: "AI Tooling and Agents",
    items: [
      { kind: "chip", name: "Inngest AgentKit" },
      { kind: "icon", name: "LangChain", Icon: SiLangchain },
      { kind: "icon", name: "LangGraph", Icon: SiLanggraph },
      { kind: "chip", name: "Vercel AI SDK" },
    ],
  },
  {
    label: "Automation and Orchestration",
    items: [
      { kind: "chip", name: "Inngest" },
      { kind: "icon", name: "n8n", Icon: SiN8N },
      { kind: "icon", name: "Temporal", Icon: SiTemporal },
      { kind: "icon", name: "Zapier", Icon: SiZapier },
      { kind: "icon", name: "Make", Icon: SiMake },
      { kind: "icon", name: "Apache Airflow", Icon: SiApacheairflow },
    ],
  },
  {
    label: "Observability and Quality",
    items: [
      { kind: "icon", name: "Sentry", Icon: SiSentry },
      { kind: "icon", name: "Datadog", Icon: SiDatadog },
      { kind: "icon", name: "PostHog", Icon: SiPosthog },
      { kind: "icon", name: "Grafana", Icon: SiGrafana },
      { kind: "icon", name: "Prometheus", Icon: SiPrometheus },
      { kind: "chip", name: "Playwright" },
      { kind: "icon", name: "Vitest", Icon: SiVitest },
      { kind: "icon", name: "Jest", Icon: SiJest },
    ],
  },
  {
    label: "Auth and Security",
    items: [
      { kind: "icon", name: "Clerk", Icon: SiClerk },
      { kind: "icon", name: "Auth0", Icon: SiAuth0 },
      { kind: "chip", name: "WorkOS" },
    ],
  },
];

function TechPill({ item }: { item: TechItem }) {
  const isCore = CORE_TOOLS.has(item.name);

  if (item.kind === "icon") {
    const { Icon, name } = item;
    return (
      <span
        className={
          isCore
            ? "group inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/8 px-3 py-1.5 transition-colors duration-150 hover:border-primary/40"
            : "group inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 transition-colors duration-150 hover:border-primary/40"
        }
      >
        <Icon
          className={
            isCore
              ? "h-3.5 w-3.5 shrink-0 text-primary transition-colors duration-150"
              : "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-foreground"
          }
          aria-hidden="true"
        />
        <span
          className={
            isCore
              ? "font-mono text-xs font-medium text-primary transition-colors duration-150"
              : "font-mono text-xs font-medium text-muted-foreground transition-colors duration-150 group-hover:text-foreground"
          }
        >
          {name}
        </span>
      </span>
    );
  }

  return (
    <span
      className={
        isCore
          ? "group inline-flex items-center rounded-md border border-primary/20 bg-primary/8 px-3 py-1.5 transition-colors duration-150 hover:border-primary/40"
          : "group inline-flex items-center rounded-md border border-border px-3 py-1.5 transition-colors duration-150 hover:border-primary/40"
      }
    >
      <span
        className={
          isCore
            ? "font-mono text-xs font-medium text-primary transition-colors duration-150"
            : "font-mono text-xs font-medium text-muted-foreground transition-colors duration-150 group-hover:text-foreground"
        }
      >
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
          aside={<ArrowLink href="#work">See it in production</ArrowLink>}
        />

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          You do not need to know any of this. We pick the right tool for your process and document everything, so your team can own it.
        </p>

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
