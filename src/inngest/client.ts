import { Inngest } from "inngest";

// Inngest v4: EventSchemas removed. Events are typed per-function via event.data casts.
export const inngest = new Inngest({
  id: "rethink-outbound",
  name: "RethinkAI Outbound",
});
