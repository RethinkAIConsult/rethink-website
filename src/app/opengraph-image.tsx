import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "RethinkAI Consult — AI Automation Engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0A0A0F 0%, #12121A 50%, #1A1A2E 100%)",
        }}
      >
        {/* Decorative gradient orb */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            right: "120px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "200px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: "28px",
            fontWeight: 700,
            color: "#E2E8F0",
            marginBottom: "20px",
          }}
        >
          <span>Rethink</span>
          <span style={{ color: "#2563EB" }}>AI</span>
          <span style={{ color: "#64748B", fontWeight: 400, marginLeft: "12px" }}>
            Consult
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "56px",
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.2,
            maxWidth: "800px",
          }}
        >
          AI Automation Engineering
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "24px",
            color: "#94A3B8",
            marginTop: "24px",
            lineHeight: 1.5,
            maxWidth: "700px",
          }}
        >
          Production pipelines, custom AI agents, and full-stack web applications for businesses that have outgrown manual processes.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "40px",
            gap: "12px",
          }}
        >
          {["Next.js", "TypeScript", "PostgreSQL", "AI Agents"].map((tech) => (
            <div
              key={tech}
              style={{
                display: "flex",
                padding: "8px 16px",
                borderRadius: "6px",
                background: "rgba(255,255,255,0.08)",
                color: "#94A3B8",
                fontSize: "16px",
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
