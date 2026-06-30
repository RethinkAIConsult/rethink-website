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
- connectNote: the short note (UNDER 300 chars) on a LinkedIn connection request. Write it AS Jack: a sharp ex-operator with strong, slightly cynical opinions about AI hype. NOT a marketer, NOT polite-and-safe. Its job is to get a REPLY, not just an accept. THE TWO LAWS (non-negotiable):
    (1) OPEN with a POSITION they could disagree with: a sharp claim, a cynical take, or a checkable bet about THEIR specific world (use the angle / painHook). NOT their first name, NOT a soft "curious how you handle" / "I'd imagine" / "always wondered". Make them want to push back or agree.
    (2) CLOSE by doing ONE of: dare them to correct you ("Tell me I'm wrong", "Prove me wrong", "Tell me your X lives somewhere else"), attach a cost to their silence, or flatter their competence into a brag-reply. The note ENDS on this close and is fully self-contained.
  * SHAPES (pick one; VARY across notes so they are not all the same): (a) blunt two sentences, no warmup; (b) demonstrated-refusal: name the AI thing you'd tell them NOT to buy and the unglamorous thing that actually pays; (c) a pointed question with a real bet behind it; (d) cynical-insider take on the AI hype in their space.
  * CREDIBILITY: if Jack has real standing in their world (e.g. he is an ex-operator in their industry), use it ONCE, hard, as proof ("I ran X"), never as a signature line. Otherwise earn it through SPECIFICITY about their actual business (a named product, workflow, or move) so the note would not survive a company swap.
  * VOICE: plain spoken English, a genuine point of view, a bit of edge, never boring, never a McKinsey line. End on a COMPLETE sentence.
- closingInvite: return an EMPTY string "". The connectNote above already closes itself (on the dare/cost/flatter); do not add a separate invitation.
- companyType: "tech_product" if they build and sell their own software, platform, or AI product (SaaS, fintech, proptech, healthtech, marketplace, data product); otherwise "non_tech_operating".
- industry: a short lowercase sector label, e.g. "fintech", "insurance", "logistics", "proptech", "healthcare", "manufacturing", "professional services", "real estate", "construction".
- hqLocation: their headquarters location (city and country or state) only if the research shows it; otherwise an empty string. Never guess.
  * Vary the wording and structure every time. Sound like a real person, never a template.
  * HARD BANS: NEVER use any dash or hyphen of ANY kind (em-dash, en-dash, "-"); rephrase to avoid them. No listing three or more things in a row. NO PITCH and no offering of help: forbidden phrases include "senior AI engineering help", "without a full-time hire", "how we've helped", "I'd love to share how", "how I/we can help", and any mention of what Jack sells. The note starts a conversation; the offer waits. BANNED CLOSES (never end the note with these, they are dead and boring): "would love to compare notes", "curious how you handle that", "is that your situation / am I off base", "would be great to connect", "be keen to hear", "thought it'd be good to connect". No invented numbers unless verbatim in the research. No FAKE flattery (do not generically compliment their company or career). A cynical take, a checkable bet, or flattering their genuine competence into a brag-reply is GOOD and encouraged. No corporate jargon ("real time visibility", "throughput", "leverage", "streamline", "optimise", "scalable", "seamless", "ecosystem", "operational efficiency").

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
  // The note is self-contained now (it closes itself on a dare/cost/flatter), so
  // we do NOT append a closing invite. If the cheap model still tacks a soft
  // "would love to compare notes" onto the end, strip it (those are banned).
  const softCloseRe = /\s*(would (love|be (great|good)|enjoy)|be keen|keen to|happy to|look forward|love to (compare|hear|connect|swap)|compare notes|swap notes|hope (we|to)|i'?d (love|be))\b[^.?!]*[.?!]?\s*$/i;
  let note = clean(out.connectNote).replace(softCloseRe, "").trim();
  let seenGenuinely = false;
  note = note.replace(/\bgenuinely\s+/gi, (m) => (seenGenuinely ? "" : ((seenGenuinely = true), m)));
  if (!/[.?!]$/.test(note)) note = `${note}.`;
  return {
    summary: clean(out.summary),
    painHook: clean(out.painHook),
    angle: clean(out.angle),
    connectNote: trimAt(note, 300),
    closingInvite: "",
    companyType: out.companyType === "tech_product" ? "tech_product" : "non_tech_operating",
    industry: clean(out.industry).toLowerCase().slice(0, 40),
    hqLocation: clean(out.hqLocation).slice(0, 80),
  };
}
