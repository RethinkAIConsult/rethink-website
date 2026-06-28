// The free wedge CTA that outreach drives toward.
// Generic, no fabricated metrics. Describes the offer faithfully.

export interface Offer {
  name: string;
  oneLiner: string;
  scopeSentences: string[];
  forPrompt(): string;
}

export const OFFER: Offer = {
  name: "Automation Stack Review",

  oneLiner:
    "A fixed-scope, async review of where AI automation can reduce manual work in your current stack.",

  // Three sentences: what it covers / what you get / logistics.
  scopeSentences: [
    "We map your existing tools and workflows to identify where AI pipelines can replace manual steps.",
    "You receive a short written brief covering the highest-leverage opportunities and a suggested architecture, with no upsell attached.",
    "It is async, takes around a week from intake to delivery, and is free for the first few engagements while we build out this offering.",
  ],

  forPrompt(): string {
    return (
      `Offer: ${this.name}\n` +
      `What it is: ${this.oneLiner}\n` +
      `Scope:\n` +
      this.scopeSentences.map((s) => `- ${s}`).join("\n")
    );
  },
};
