// Typed Inngest event schema for the outbound funnel.
// Naming convention: <project>/<entity>.<action>

export type Events = {
  // Discovery: a FindAll / Exa run is requested, then completes.
  "outbound/discovery.requested": {
    data: {
      runId: string;
      engine: "parallel_findall" | "parallel_entity" | "exa";
      objective: string;
      campaignId: string | null;
      matchLimit: number;
      createdBy: string;
    };
  };
  "outbound/discovery.completed": {
    data: {
      runId: string;
      engine: string;
      matchCount: number;
      campaignId: string | null;
    };
  };
  "outbound/candidate.promoted": {
    data: {
      candidateId: string;
      prospectId: string;
    };
  };
  // Always-on sourcing: a Parallel Monitor detected new matches.
  "outbound/monitor.detected": {
    data: {
      monitorRowId: string;
      monitorId: string;
      eventGroupId: string;
    };
  };

  // Build pipeline: created -> enriched -> researched -> drafted.
  "outbound/prospect.created": {
    data: {
      prospectId: string;
      companyName: string;
      companyUrl: string | null;
      contactName: string | null;
      contactLinkedinUrl: string | null;
      createdBy: string;
    };
  };
  "outbound/prospect.enriched": {
    data: {
      prospectId: string;
      apolloCompanyId: string | null;
      apolloContactId: string | null;
    };
  };
  "outbound/prospect.researched": {
    data: {
      prospectId: string;
      fitScore: number;
      hasUsableSignal: boolean;
    };
  };
  "outbound/prospect.drafted": {
    data: {
      prospectId: string;
    };
  };
  "outbound/prospect.failed": {
    data: {
      prospectId: string;
      stage: "enrich" | "research" | "draft" | "discovery";
      error: string;
    };
  };
  "outbound/followup.reminder.due": {
    data: {
      prospectId: string;
      action: "send_dm1" | "send_dm2" | "send_dm3" | "follow_up_connect_or_dm1";
    };
  };
};
