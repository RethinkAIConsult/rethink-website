import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { discoverProspects } from "@/inngest/functions/discover-prospects";
import { enrichCompany } from "@/inngest/functions/enrich-company";
import { researchProspect } from "@/inngest/functions/research-prospect";
import { draftMessagesFn } from "@/inngest/functions/draft-messages";
import { monitorEvent } from "@/inngest/functions/monitor-event";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [discoverProspects, enrichCompany, researchProspect, draftMessagesFn, monitorEvent],
});
