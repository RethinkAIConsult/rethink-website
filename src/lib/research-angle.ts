// Research a company with Exa, then have DeepSeek craft a LinkedIn connection
// angle + connect note for RethinkAI's outbound. Used by the /outbound/angle tool.
import { searchCompanies, searchPeople } from "./exa";
import { chatTool, MODELS, isLlmEnabled } from "./llm";

export { isLlmEnabled };

export type AngleResult = {
  summary: string;
  painHook: string;
  angle: string;
  connectNote: string;
  closingInvite: string;
};

const SYS = `You research a company and write a LinkedIn connection angle for Jack Costanzi, founder of RethinkAI, a SOLO UK AI engineering and automation consultant. Jack ships production AI for companies: for TECH product companies he builds AI features, agents and models into their product as senior AI engineering help without a full-time hire; for non-tech operating companies he builds AI automation that wraps their existing tools (CRM, ERP, spreadsheets). Fixed-scope projects or ongoing advisory.

From the research, return:
- summary: 1 to 2 sentences on what the company actually does.
- painHook: the single most likely operational OR engineering pain for a business like this, described QUALITATIVELY. For a non-tech operating company, the manual repetitive work (re-keying data between systems, manual scheduling and dispatch, chasing approvals, assembling reports by hand). For a tech product company, an AI or engineering stretch (a model or feature that needs senior help, a data pipeline, scaling an ML workflow, an AI capability they are clearly building toward). Specific to their business model. Do NOT cite revenue, employee counts, founding years, or ANY number unless it appears verbatim in the research.
- angle: the single most UNIQUE, specific, surprising thing about this company or person to lead with, in a few words (a personal background fact about them, an unusual origin or pivot, a notable specific project, a distinctive niche almost no competitor has, a recent move). NOT a generic fact anyone could guess (services they offer, founding year alone). Use only what the research supports; if nothing distinctive exists, say the most specific real thing you found.
- connectNote: the short note attached to a LinkedIn connection request. Write it AS Jack himself, a sharp, busy UK guy saying hi to a peer whose business he finds genuinely interesting. NOT a marketer, NOT AI, NOT outreach software. Its only job is to get accepted; the pitch comes later. RULES:
  * Structure it in two parts:
    (1) Start with their FIRST NAME, then LEAD straight with the single most unique or distinctive thing you found (the angle above), stated plainly like a peer who noticed it, and follow with real CURIOSITY about how they pulled it off or handle something specific ("curious how you...", "always wondered how...", "how do you..."). Do NOT open by editorialising that the fact "is interesting / remarkable / fascinating / a great story / a combo you don't see" — just state the fact and go to the curiosity. Prefer a distinctive or personal detail over generic facts; do NOT just list the services, markets, or disciplines they cover. Ask or muse; do NOT assert their internal process as fact. VARY your opening sentence across notes, never reuse the same frame. One to three sentences.
    (2) Do NOT write the closing invitation inside connectNote; it goes in the separate closingInvite field below. End connectNote on the curiosity.
  * USE THE SPACE: aim for 180 to 240 characters for connectNote (the closing invite is added after; the total stays under 300). Spend it on the unique detail and real texture, not filler, buzzwords, or padded lists.
- closingInvite: a short, warm, real, one-sentence invitation to chat about the specific thing raised in connectNote. Vary it every time; never reuse one verbatim and never a stiff salesy "interested in a quick chat?". Examples: "Would love to hear how you make it work." / "Be keen to swap notes on it sometime." / "Would be good to compare notes." / "Keen to hear how you approach it."
  * Vary the wording and structure every time. Sound like a real person, never a template.
  * HARD BANS (these read as AI/spam): NEVER use any dash or hyphen of ANY kind (em-dash, en-dash, or "-"); do not hyphenate words, rephrase to avoid hyphens entirely. No listing three or more things in a row (services, markets, disciplines, care types); pick ONE and go deep on it instead. No pitch, no "I help", no mention of AI / automation / what Jack does / the Stack Review. No invented numbers unless verbatim in the research. Use the word "genuinely" at most once in the whole note, ideally never. No flattery or editorialising about them or their story ("impressive", "remarkable", "fascinating", "striking", "interesting to see", "caught my eye", complimenting their career or company). No buzzwords.

HARD RULES for connectNote and all fields:
- Do NOT use generic flattery ("impressive", "compelling", "love your work", "caught my eye", "the science you apply").
- Do NOT add a sign-off or Jack's name at the end of the note (LinkedIn already shows his name).
- NO em-dashes or en-dashes (use commas or periods). No buzzwords (leverage as a verb, synergy, cutting-edge, seamless). No "I hope this finds you well".
- NEVER invent numbers, revenue, headcount, dates, client names, or facts. If you do not know a specific fact, stay general. Use only what the research supports.`;

const SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    painHook: { type: "string" },
    angle: { type: "string" },
    connectNote: { type: "string" },
    closingInvite: { type: "string" },
  },
  required: ["summary", "painHook", "angle", "connectNote", "closingInvite"],
};

// Cheap buyer-vs-seller gate run on the FREE masked search data (company + title)
// so we only spend reveal credits on real ICP buyers. Returns keep[] aligned to input.
export async function verifyBuyers(
  people: { firstName: string; title: string; company: string }[],
): Promise<boolean[]> {
  if (!people.length) return [];
  const list = people.map((p, i) => `[${i}] ${p.company} (role: ${p.title})`).join("\n");
  const SYS = `You filter outbound targets for a solo AI ENGINEERING and automation consultant. Clients include TECH PRODUCT companies (like a fraud/risk-decisioning platform and a property-tech portal) as well as non-tech operating companies. The ideal client is a real company with budget and a genuine need for senior AI engineering or automation help it cannot fully staff in-house.
The key test: a company that USES or BUILDS AI in its own product or operations is a BUYER (keep); a company that SELLS AI/automation/development services to others is a COMPETITOR (drop).
DROP (keep=false) when the company is clearly ANY of:
  (1) a COMPETITOR or reseller of the same service: an AI/ML/automation/RPA/"RevOps" consultancy or agency, a software-development shop or digital agency, an IT-services firm or systems integrator, an outsourcing/offshore dev shop, a staffing/recruiting firm, or a management/marketing consultancy. If it clearly SELLS dev/AI/automation services to others and you are unsure, DROP.
  (2) a CONSUMER-FACING or low-complexity small business that is a poor fit: single-location or small restaurants, cafes, bars, food service, retail stores and shops, consumer e-commerce, salons, spas, gyms and fitness, personal or consumer services, and tiny owner-operator trades (a single-crew roofer, plumber, electrician, or landscaper).
  (3) a non-profit or public body: charity, foundation, NGO, religious organisation, school/college/university, government/public-sector, or trade association (signals like "Foundation", "Charity", "University", "Church", "Council", "Department of").
KEEP (keep=true):
  - TECH PRODUCT companies that build and run their own product and would hire AI engineering help: SaaS platforms, fintech, insurtech, proptech, healthtech, marketplaces, and data or AI-driven products. (A fraud/risk decisioning platform or a property portal is a KEEP.) Remember: a product company that USES AI is a buyer; one that SELLS AI/dev services is a competitor (drop).
  - NON-TECH operating companies with real operational complexity: insurance and brokerages, finance, lending and credit, logistics, freight, 3PL, distribution and wholesale, healthcare practices and multi-site care groups, professional services (legal, accounting, engineering firms), property and facilities management, and manufacturing.
If it is a real operating or product business and you are merely unsure, LEAN KEEP.
Judge from the company name and the person's title.`;
  const SCHEMA = {
    type: "object",
    properties: {
      verdicts: {
        type: "array",
        items: {
          type: "object",
          properties: { index: { type: "integer" }, keep: { type: "boolean" } },
          required: ["index", "keep"],
        },
      },
    },
    required: ["verdicts"],
  };
  try {
    const out = await chatTool<{ verdicts: { index: number; keep: boolean }[] }>({
      model: MODELS.score,
      system: SYS,
      user: `Companies:\n${list}`,
      toolName: "filter",
      schema: SCHEMA,
      maxTokens: 1500,
    });
    const map = new Map(out.verdicts.map((v) => [v.index, v.keep]));
    return people.map((_, i) => map.get(i) ?? false);
  } catch {
    return people.map(() => false); // on error, drop — never spend reveal credits on unverified
  }
}

export async function researchAngle(input: {
  name: string;
  title?: string;
  company: string;
  companyUrl?: string;
}): Promise<AngleResult> {
  // 1. Two Exa searches in parallel: the company's STORY (not just "what they do")
  //    and the PERSON's background — the person research is where the genuinely
  //    unique, resonant hook usually lives (where they worked before, their story).
  let companyCtx = "";
  let personCtx = "";
  const [co, pe] = await Promise.allSettled([
    searchCompanies({
      query: `${input.company} ${input.companyUrl ?? ""} company story history founders origin recent news awards what makes them distinctive unusual`.trim(),
      numResults: 6,
    }),
    searchPeople({
      query: `${input.name} ${input.title ?? ""} ${input.company} background career history previously`.trim(),
      numResults: 4,
    }),
  ]);
  if (co.status === "fulfilled") {
    companyCtx = co.value.results
      .map((r, i) => `[C${i + 1}] ${r.name} (${r.url})\n${r.description}`)
      .join("\n\n")
      .slice(0, 3500);
  }
  if (pe.status === "fulfilled") {
    personCtx = pe.value.results
      .map((r, i) => `[P${i + 1}] ${r.name} (${r.url})\n${r.description}`)
      .join("\n\n")
      .slice(0, 1800);
  }

  // 2. DeepSeek synthesises the angle
  const user = `Contact: ${input.name}${input.title ? `, ${input.title}` : ""}
Company: ${input.company}${input.companyUrl ? ` (${input.companyUrl})` : ""}

COMPANY RESEARCH:
${companyCtx || "(none found — infer plausibly from the company name and the contact's title; invent nothing)"}

PERSON RESEARCH (specifically about ${input.name}; may be sparse or, if it clearly describes a different person, IGNORE it):
${personCtx || "(none found — do not invent any personal facts about this individual)"}`;

  // Retry if the model returns junk (occasionally it echoes the schema type
  // "string" or an empty note instead of writing one).
  let out: AngleResult | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await chatTool<AngleResult>({
      model: MODELS.draft,
      system: SYS,
      user,
      toolName: "angle",
      schema: SCHEMA,
      maxTokens: 1500,
    });
    const n = (r.connectNote ?? "").trim();
    if (n.length >= 40 && n.toLowerCase() !== "string") {
      out = r;
      break;
    }
  }
  if (!out) throw new Error("research-angle: model returned an unusable connect note after retries");

  // safety: remove EVERY dash/hyphen (em/en -> comma, hyphen -> space), then trim
  const clean = (s: string) =>
    (s || "")
      .replace(/\s*[—–]\s*/g, ", ")
      .replace(/(\w)-(\w)/g, "$1 $2")
      .replace(/\s*-\s*/g, " ")
      .replace(/\s{2,}/g, " ")
      .replace(/\s+([,.!?])/g, "$1")
      .trim();
  const trimAt = (s: string, max: number) => {
    if (s.length <= max) return s;
    const cut = s.slice(0, max);
    const end = Math.max(cut.lastIndexOf("."), cut.lastIndexOf("?"), cut.lastIndexOf("!"));
    return (end > max * 0.5 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, "")).trim();
  };
  // Deterministically assemble note + closing invite, so a CTA is ALWAYS present
  // exactly once at the end (the model gives them as separate fields; no fragile
  // detection). Fall back to a stable invite if the model leaves the field empty.
  const FALLBACK_INVITE = "Would love to hear how you make it work.";
  const note = clean(out.connectNote);
  const inviteRaw = clean(out.closingInvite);
  const invite = /[a-z]/i.test(inviteRaw) ? inviteRaw : FALLBACK_INVITE;
  const body = trimAt(note, 299 - invite.length - 1);
  let connectNote = `${/[.?!]$/.test(body) ? body : `${body}.`} ${invite}`;
  // keep at most one "genuinely" — a cheap-model verbal tic that repeats across notes
  let seenGenuinely = false;
  connectNote = connectNote.replace(/\bgenuinely\s+/gi, (m) => (seenGenuinely ? "" : ((seenGenuinely = true), m)));
  return {
    summary: clean(out.summary),
    painHook: clean(out.painHook),
    angle: clean(out.angle),
    connectNote: trimAt(connectNote, 300),
    closingInvite: invite,
  };
}
