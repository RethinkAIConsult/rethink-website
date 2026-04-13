import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from "@react-email/components";

interface ContactNotificationProps {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
  referral: string;
  submittedAt: string;
}

const BUDGET_LABELS: Record<string, string> = {
  "under-5k": "Under £5,000",
  "5k-15k": "£5,000 – £15,000",
  "15k-50k": "£15,000 – £50,000",
  "50k-plus": "£50,000+",
};

export function ContactNotification({
  name,
  email,
  company,
  budget,
  message,
  referral,
  submittedAt,
}: ContactNotificationProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#0A0A0F", color: "#E2E8F0" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
          <Heading style={{ fontSize: "24px", color: "#FFFFFF" }}>
            New Contact Form Submission
          </Heading>
          <Hr style={{ borderColor: "#1A1A2E" }} />

          <Section style={{ marginTop: "24px" }}>
            <Text style={{ fontSize: "14px", color: "#94A3B8" }}>Name</Text>
            <Text style={{ fontSize: "16px", color: "#E2E8F0", marginTop: "4px" }}>{name}</Text>
          </Section>

          <Section>
            <Text style={{ fontSize: "14px", color: "#94A3B8" }}>Email</Text>
            <Text style={{ fontSize: "16px", color: "#E2E8F0", marginTop: "4px" }}>{email}</Text>
          </Section>

          {company && (
            <Section>
              <Text style={{ fontSize: "14px", color: "#94A3B8" }}>Company</Text>
              <Text style={{ fontSize: "16px", color: "#E2E8F0", marginTop: "4px" }}>{company}</Text>
            </Section>
          )}

          {budget && (
            <Section>
              <Text style={{ fontSize: "14px", color: "#94A3B8" }}>Budget</Text>
              <Text style={{ fontSize: "16px", color: "#E2E8F0", marginTop: "4px" }}>
                {BUDGET_LABELS[budget] ?? budget}
              </Text>
            </Section>
          )}

          <Section>
            <Text style={{ fontSize: "14px", color: "#94A3B8" }}>Message</Text>
            <Text style={{ fontSize: "16px", color: "#E2E8F0", marginTop: "4px", whiteSpace: "pre-wrap" }}>
              {message}
            </Text>
          </Section>

          {referral && (
            <Section>
              <Text style={{ fontSize: "14px", color: "#94A3B8" }}>How they heard about us</Text>
              <Text style={{ fontSize: "16px", color: "#E2E8F0", marginTop: "4px" }}>{referral}</Text>
            </Section>
          )}

          <Hr style={{ borderColor: "#1A1A2E", marginTop: "24px" }} />
          <Text style={{ fontSize: "12px", color: "#64748B" }}>
            Submitted at {submittedAt}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
