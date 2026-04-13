import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
} from "@react-email/components";

interface ContactConfirmationProps {
  name: string;
}

export function ContactConfirmation({ name }: ContactConfirmationProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#0A0A0F", color: "#E2E8F0" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
          <Heading style={{ fontSize: "24px", color: "#FFFFFF" }}>
            Thanks for reaching out, {name}
          </Heading>
          <Hr style={{ borderColor: "#1A1A2E" }} />

          <Section style={{ marginTop: "24px" }}>
            <Text style={{ fontSize: "16px", color: "#E2E8F0", lineHeight: "1.6" }}>
              We&apos;ve received your message and will get back to you within 24
              hours with an honest assessment of how we can help.
            </Text>
            <Text style={{ fontSize: "16px", color: "#E2E8F0", lineHeight: "1.6" }}>
              In the meantime, feel free to check out our work on{" "}
              <Link href="https://github.com/RethinkAIConsult" style={{ color: "#2563EB" }}>
                GitHub
              </Link>{" "}
              or connect on{" "}
              <Link href="https://linkedin.com/in/jackcostanzi" style={{ color: "#2563EB" }}>
                LinkedIn
              </Link>
              .
            </Text>
          </Section>

          <Hr style={{ borderColor: "#1A1A2E", marginTop: "32px" }} />
          <Text style={{ fontSize: "14px", color: "#94A3B8", marginTop: "16px" }}>
            — Jack Costanzi, RethinkAI Consult
          </Text>
          <Text style={{ fontSize: "12px", color: "#64748B" }}>
            rethinkaiconsult.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
