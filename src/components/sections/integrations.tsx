import { FadeIn } from "@/components/fade-in";
import {
  SiSalesforce, SiHubspot, SiZoho, SiXero, SiQuickbooks, SiSage, SiStripe,
  SiPaypal, SiSquare, SiWise, SiGoogle, SiGmail, SiSlack, SiNotion, SiZoom,
  SiDiscord, SiZendesk, SiIntercom, SiHelpscout, SiAirtable, SiClickup, SiAsana,
  SiJira, SiLinear, SiTrello, SiBasecamp, SiMailchimp, SiSendgrid, SiResend,
  SiPostgresql, SiSnowflake, SiGooglebigquery, SiDatabricks, SiZapier, SiMake,
  SiN8N, SiGithub, SiGitlab, SiShopify, SiWoocommerce, SiBigcommerce,
  SiSquarespace, SiWebflow, SiBamboo, SiHibob, SiGreenhouse, SiDropbox,
} from "react-icons/si";
import type { IconType } from "react-icons";

type IntegrationItem =
  | { kind: "icon"; name: string; Icon: IconType }
  | { kind: "chip"; name: string };

interface IntegrationGroup {
  label: string;
  items: IntegrationItem[];
}

const INTEGRATION_GROUPS: IntegrationGroup[] = [
  {
    label: "CRM",
    items: [
      { kind: "icon", name: "Salesforce", Icon: SiSalesforce },
      { kind: "icon", name: "HubSpot", Icon: SiHubspot },
      { kind: "chip", name: "Pipedrive" },
      { kind: "icon", name: "Zoho", Icon: SiZoho },
      { kind: "chip", name: "Dynamics 365" },
      { kind: "chip", name: "Close" },
      { kind: "chip", name: "Copper" },
    ],
  },
  {
    label: "Finance and Payments",
    items: [
      { kind: "icon", name: "Xero", Icon: SiXero },
      { kind: "icon", name: "QuickBooks", Icon: SiQuickbooks },
      { kind: "icon", name: "Sage", Icon: SiSage },
      { kind: "chip", name: "NetSuite" },
      { kind: "icon", name: "Stripe", Icon: SiStripe },
      { kind: "icon", name: "PayPal", Icon: SiPaypal },
      { kind: "icon", name: "Square", Icon: SiSquare },
      { kind: "chip", name: "GoCardless" },
      { kind: "icon", name: "Wise", Icon: SiWise },
      { kind: "chip", name: "Chargebee" },
    ],
  },
  {
    label: "Comms and Productivity",
    items: [
      { kind: "chip", name: "Microsoft 365" },
      { kind: "chip", name: "Teams" },
      { kind: "chip", name: "Outlook" },
      { kind: "icon", name: "Google Workspace", Icon: SiGoogle },
      { kind: "icon", name: "Gmail", Icon: SiGmail },
      { kind: "icon", name: "Slack", Icon: SiSlack },
      { kind: "icon", name: "Notion", Icon: SiNotion },
      { kind: "icon", name: "Zoom", Icon: SiZoom },
      { kind: "icon", name: "Discord", Icon: SiDiscord },
    ],
  },
  {
    label: "Support",
    items: [
      { kind: "icon", name: "Zendesk", Icon: SiZendesk },
      { kind: "icon", name: "Intercom", Icon: SiIntercom },
      { kind: "chip", name: "Freshdesk" },
      { kind: "icon", name: "Help Scout", Icon: SiHelpscout },
      { kind: "chip", name: "Front" },
    ],
  },
  {
    label: "Project and Ops",
    items: [
      { kind: "icon", name: "Airtable", Icon: SiAirtable },
      { kind: "chip", name: "Monday.com" },
      { kind: "icon", name: "ClickUp", Icon: SiClickup },
      { kind: "icon", name: "Asana", Icon: SiAsana },
      { kind: "icon", name: "Jira", Icon: SiJira },
      { kind: "icon", name: "Linear", Icon: SiLinear },
      { kind: "icon", name: "Trello", Icon: SiTrello },
      { kind: "icon", name: "Basecamp", Icon: SiBasecamp },
      { kind: "chip", name: "Smartsheet" },
    ],
  },
  {
    label: "Marketing and Email",
    items: [
      { kind: "icon", name: "Mailchimp", Icon: SiMailchimp },
      { kind: "chip", name: "Klaviyo" },
      { kind: "chip", name: "ActiveCampaign" },
      { kind: "icon", name: "SendGrid", Icon: SiSendgrid },
      { kind: "icon", name: "Resend", Icon: SiResend },
      { kind: "chip", name: "Brevo" },
    ],
  },
  {
    label: "Data and Warehouse",
    items: [
      { kind: "icon", name: "PostgreSQL", Icon: SiPostgresql },
      { kind: "icon", name: "Snowflake", Icon: SiSnowflake },
      { kind: "icon", name: "BigQuery", Icon: SiGooglebigquery },
      { kind: "icon", name: "Databricks", Icon: SiDatabricks },
      { kind: "chip", name: "Redshift" },
      { kind: "chip", name: "Segment" },
      { kind: "chip", name: "Fivetran" },
    ],
  },
  {
    label: "Automation and Dev",
    items: [
      { kind: "chip", name: "Inngest" },
      { kind: "icon", name: "Zapier", Icon: SiZapier },
      { kind: "icon", name: "Make", Icon: SiMake },
      { kind: "icon", name: "n8n", Icon: SiN8N },
      { kind: "icon", name: "GitHub", Icon: SiGithub },
      { kind: "icon", name: "GitLab", Icon: SiGitlab },
      { kind: "chip", name: "Webhooks" },
      { kind: "chip", name: "REST APIs" },
    ],
  },
  {
    label: "E-commerce",
    items: [
      { kind: "icon", name: "Shopify", Icon: SiShopify },
      { kind: "icon", name: "WooCommerce", Icon: SiWoocommerce },
      { kind: "icon", name: "BigCommerce", Icon: SiBigcommerce },
      { kind: "icon", name: "Squarespace", Icon: SiSquarespace },
      { kind: "chip", name: "Magento" },
      { kind: "icon", name: "Webflow", Icon: SiWebflow },
    ],
  },
  {
    label: "HR and Hiring",
    items: [
      { kind: "icon", name: "BambooHR", Icon: SiBamboo },
      { kind: "icon", name: "HiBob", Icon: SiHibob },
      { kind: "icon", name: "Greenhouse", Icon: SiGreenhouse },
      { kind: "chip", name: "Workable" },
      { kind: "chip", name: "Lever" },
      { kind: "chip", name: "Personio" },
      { kind: "chip", name: "Rippling" },
    ],
  },
  {
    label: "Docs and Storage",
    items: [
      { kind: "chip", name: "DocuSign" },
      { kind: "chip", name: "PandaDoc" },
      { kind: "icon", name: "Dropbox", Icon: SiDropbox },
      { kind: "chip", name: "Google Drive" },
      { kind: "chip", name: "Adobe Sign" },
    ],
  },
];

function IntegrationPill({ item }: { item: IntegrationItem }) {
  if (item.kind === "icon") {
    const { Icon, name } = item;
    return (
      <span className="group inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 transition-colors duration-150 hover:border-primary/40">
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
    <span className="group inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 transition-colors duration-150 hover:border-primary/40">
      <span className="font-mono text-xs font-medium text-muted-foreground transition-colors duration-150 group-hover:text-foreground">
        {item.name}
      </span>
    </span>
  );
}

export function Integrations() {
  return (
    <section
      className="border-t border-border py-20 lg:py-28"
      aria-label="Integrations"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div>
          <p className="eyebrow">Works with your stack</p>
          <h2 className="display-lg mt-3 text-foreground">
            Plugs into the tools you already run.
          </h2>
          <p className="mt-4 max-w-[40rem] text-lg text-muted-foreground">
            We onboard to your existing stack. No rip and replace. If you use it
            and it has an API, we connect it. If it does not, we build the
            bridge.
          </p>
        </div>

        <div className="mt-12 space-y-7 lg:mt-14">
          {INTEGRATION_GROUPS.map((group, groupIndex) => (
            <FadeIn key={group.label} delay={groupIndex * 0.06}>
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="eyebrow">{group.label}</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <IntegrationPill key={item.name} item={item} />
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
