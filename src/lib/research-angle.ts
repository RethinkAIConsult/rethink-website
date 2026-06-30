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
  // firmographic classification — saved per contact so outcomes (replied/won)
  // can be analysed by attribute to learn the real ICP over time.
  companyType: string; // "tech_product" | "non_tech_operating"
  industry: string; // short label, e.g. "fintech", "insurance", "logistics", "proptech"
  hqLocation: string; // city/state/country if known, else ""
};

const SYS = `You research a company and write a LinkedIn connection angle for Jack Costanzi, founder of RethinkAI, a SOLO UK AI engineering and automation consultant. Jack ships production AI for companies: for TECH product companies he builds AI features, agents and models into their product as senior AI engineering help without a full-time hire; for non-tech operating companies he builds AI automation that wraps their existing tools (CRM, ERP, spreadsheets). Fixed-scope projects or ongoing advisory.

From the research, return:
- summary: 1 to 2 sentences on what the company actually does.
- painHook: the single most likely operational OR engineering pain for a business like this, described QUALITATIVELY. For a non-tech operating company, the manual repetitive work (re-keying data between systems, manual scheduling and dispatch, chasing approvals, assembling reports by hand). For a tech product company, an AI or engineering stretch (a model or feature that needs senior help, a data pipeline, scaling an ML workflow, an AI capability they are clearly building toward). Specific to their business model. Do NOT cite revenue, employee counts, founding years, or ANY number unless it appears verbatim in the research.
- angle: the BRIDGE from a specific, real detail about their business to the operational or engineering challenge where AI, automation, or engineering is the natural lever (i.e. where Jack could actually help). Anchor on something concrete and true about THEM (a process they run, their product, their scale, a recent move) that leads into where it gets manual, hard, or hard to scale. This is what makes the note RELEVANT to an AI engineering and automation consultant. NOT a generic founder/career fact, NOT just "they exist". Use only what the research supports.
- connectNote: the short note attached to a LinkedIn connection request. Write it AS Jack himself, a sharp, busy UK guy saying hi to a peer whose business he finds genuinely interesting. NOT a marketer, NOT AI, NOT outreach software. Its only job is to get accepted; the pitch comes later. RULES:
  * Structure it in two parts:
    (1) Start with their FIRST NAME, then anchor on ONE specific, real thing about THEIR business from the research (a process they run, their product, how they are structured, their scale, a recent move) and turn it toward the OPERATIONAL or ENGINEERING challenge where it gets manual, hard, or hard to scale — the part where AI, automation, or engineering is the natural lever (use the angle / painHook). Frame it as genuine CURIOSITY about how they handle THAT specific thing ("curious how you handle...", "curious how you're approaching...", "always wondered how a team like yours keeps..."). The thing you are curious about MUST be something an AI engineering and automation consultant could genuinely help with — it is the bridge to the follow-up conversation, with NO pitch. Do NOT lead with their career, their founder origin story, or that they "wear multiple hats" — those are warm but do not connect to the work. Do NOT editorialise ("is interesting / remarkable / fascinating"). Stay specific to their business, never generic. Ask or muse; do NOT assert their internal process as fact. VARY your opening across notes. One to three sentences.
    (2) Do NOT write the closing invitation inside connectNote; it goes in the separate closingInvite field below. End connectNote on the curiosity.
  * LENGTH: connectNote must be 150 to 210 characters and MUST end on a COMPLETE sentence. Never trail off mid-thought or end on "and" / "with" / "the" / a dangling list. Better to say less and finish the sentence than to pack in detail and get cut.
  * VOICE (most important): sound like a sharp real person talking to a peer over coffee, NOT a consultant, an analyst, or a strategy slide. Plain everyday words, contractions, natural spoken rhythm. A bit of empathy lands well ("I'd imagine...", "that's got to be...", "bet that..."). Describe their reality the way a normal person would say it OUT LOUD, not the way a report would write it. BANNED corporate/analyst jargon: "real time visibility", "operational coordination", "data orchestration", "throughput", "subsystems", "leverage", "streamline", "optimise", "optimize", "robust", "seamless", "scalable", "ecosystem", "drive efficiency", "manage the complexity of", "distributed assets", "operational efficiency", "the engineering coordination challenge". If a line sounds like it belongs in a McKinsey deck, rewrite it plainer. Example: not "how you maintain real time visibility into production data from distributed platform assets" but "how you keep a clean picture of what's happening across all those rigs".
- closingInvite: ONE short, generic, warm line of about 6 to 10 words. Vary it. Keep it GENERIC, not topic-specific, so it never bloats the note. Examples: "Would love to compare notes sometime." / "Be keen to hear how you approach it." / "Would be good to swap notes." / "Keen to hear how you handle it." NEVER a pitch and never a stiff "interested in a quick chat?".
- companyType: "tech_product" if they build and sell their own software, platform, or AI product (SaaS, fintech, proptech, healthtech, marketplace, data product); otherwise "non_tech_operating".
- industry: a short lowercase sector label, e.g. "fintech", "insurance", "logistics", "proptech", "healthcare", "manufacturing", "professional services", "real estate", "construction".
- hqLocation: their headquarters location (city and country or state) only if the research shows it; otherwise an empty string. Never guess.
  * Vary the wording and structure every time. Sound like a real person, never a template.
  * HARD BANS (these read as AI/spam): NEVER use any dash or hyphen of ANY kind (em-dash, en-dash, or "-"); do not hyphenate words, rephrase to avoid hyphens entirely. No listing three or more things in a row (services, markets, disciplines, care types); pick ONE and go deep on it instead. ABSOLUTELY NO PITCH anywhere in the note or the invite. The topic is AI-relevant but you NEVER offer help: forbidden phrases include "senior AI engineering help", "without a full-time hire", "how we've helped", "I'd love to share how", "I've approached similar", "how I/we can help", "AI could tighten", and any mention of what Jack does or sells. The bridge is the topic, the offer waits for the next message. No invented numbers unless verbatim in the research. Use the word "genuinely" at most once in the whole note, ideally never. No flattery or editorialising about them or their story ("impressive", "remarkable", "fascinating", "striking", "interesting to see", "caught my eye", complimenting their career or company). No buzzwords.

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
    companyType: { type: "string", enum: ["tech_product", "non_tech_operating"] },
    industry: { type: "string" },
    hqLocation: { type: "string" },
  },
  required: ["summary", "painHook", "angle", "connectNote", "closingInvite", "companyType", "industry", "hqLocation"],
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
  (4) a very early or pre-seed micro-startup where the contact holds MULTIPLE simultaneous C-level titles (e.g. "Co-Founder, COO & CTO", "Founder/COO/CTO", "CEO & CTO"). One person wearing every hat signals no real leadership team and no budget. We want companies established enough to have a distinct, separate leadership team (a single clear title like CTO, or COO, or VP Engineering is the good signal).
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
    // reject junk: too short, the literal schema type, or a leaked instruction
    const leaked = /\b(first name|anchor on|one real thing|connectnote|the curiosity|150 to 210|do not lead|closinginvite)\b/i.test(n);
    if (n.length >= 40 && n.toLowerCase() !== "string" && !leaked) {
      out = r;
      break;
    }
  }
  if (!out) throw new Error("research-angle: model returned an unusable connect note after retries");

  // safety: remove EVERY dash/hyphen (em/en -> comma, hyphen -> space), then trim
  const clean = (s: string) =>
    (s || "")
      // strip control chars (incl. null byte 0x00) and lone surrogates that
      // Postgres rejects with "invalid byte sequence for encoding UTF8"
      .replace(/[\u0000-\u001F\u007F]/g, " ")
      .replace(/[\uD800-\uDFFF]/g, "")
      .replace(/\s*[—–]\s*/g, ", ")
      .replace(/(\w)-(\w)/g, "$1 $2")
      .replace(/\s*-\s*/g, " ")
      .replace(/\s{2,}/g, " ")
      .replace(/\s+([,.!?])/g, "$1")
      .trim();
  const trimAt = (s: string, max: number) => {
    if (s.length <= max) return s;
    const cut = s.slice(0, max);
    // prefer a real sentence end; else back up to the last comma (a clean clause
    // end) so we never leave a dangling "...becoming a." fragment; else word-cut.
    const sent = Math.max(cut.lastIndexOf("."), cut.lastIndexOf("?"), cut.lastIndexOf("!"));
    if (sent > max * 0.5) return cut.slice(0, sent + 1).trim();
    const comma = cut.lastIndexOf(", ");
    if (comma > max * 0.5) return cut.slice(0, comma).trim();
    // word-cut, then drop trailing dangling stopwords so we never end on "...and"
    let w = cut.replace(/\s+\S*$/, "").trim();
    while (/[\s,]+(and|or|but|with|the|a|an|to|of|into|across|both|as|for|that|while|when|on|in|at)$/i.test(w)) {
      w = w.replace(/[\s,]+\S+$/, "").trim();
    }
    return w;
  };
  // Deterministically assemble note + closing invite, so a CTA is ALWAYS present
  // exactly once at the end (the model gives them as separate fields; no fragile
  // detection). Fall back to a stable invite if the model leaves the field empty.
  const FALLBACK_INVITE = "Would love to compare notes sometime.";
  const inviteRe = /(would (love|be (great|good)|enjoy)|be keen|keen to|happy to|look forward|love to (compare|hear|connect|swap)|compare notes|swap notes|hear your|trade (notes|ideas))/i;
  let note = clean(out.connectNote);
  // if the model tacked an invitation onto the note body, drop it so we don't
  // double up when we append closingInvite
  const sents = note.split(/(?<=[.!?])\s+/);
  if (sents.length > 1 && inviteRe.test(sents[sents.length - 1])) {
    sents.pop();
    note = sents.join(" ").trim();
  }
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
    companyType: out.companyType === "tech_product" ? "tech_product" : "non_tech_operating",
    industry: clean(out.industry).toLowerCase().slice(0, 40),
    hqLocation: clean(out.hqLocation).slice(0, 80),
  };
}
