import { ImageResponse } from "next/og";

export const alt = "RethinkAI Consult: AI Engineering Studio";
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
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#F8F9FB",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot-grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(13,17,23,0.10) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top row: wordmark + studio badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 1,
          }}
        >
          {/* Wordmark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
            }}
          >
            {/* Rethought R mark */}
            <svg
              viewBox="0 0 64 64"
              width="30"
              height="30"
              style={{ marginRight: 11 }}
            >
              <path
                fillRule="evenodd"
                fill="#0D1117"
                d="M 8 4 L 48 4 C 52 4 56 8 56 16 L 56 24 C 56 32 52 36 48 36 L 16 36 L 16 60 L 8 60 Z M 16 12 L 44 12 C 47 12 48 14 48 16 L 48 24 C 48 26 47 28 44 28 L 16 28 Z"
              />
              <path fill="#0D1117" d="M 41 42 L 47 38 L 60 57 L 55 60 Z" />
              <rect x="40" y="36" width="8" height="8" fill="#2563EB" />
            </svg>
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#0D1117",
                letterSpacing: "-0.02em",
              }}
            >
              Rethink
            </span>
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#2563EB",
                letterSpacing: "-0.02em",
              }}
            >
              AI
            </span>
            <span
              style={{
                fontSize: 26,
                fontWeight: 400,
                color: "rgba(13,17,23,0.45)",
                letterSpacing: "-0.01em",
                marginLeft: 10,
              }}
            >
              Consult
            </span>
          </div>

          {/* Studio badge */}
          <div
            style={{
              display: "flex",
              padding: "6px 14px",
              borderRadius: 20,
              border: "1px solid rgba(37,99,235,0.4)",
              background: "rgba(37,99,235,0.07)",
              color: "#2563EB",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            AI Engineering Studio
          </div>
        </div>

        {/* Centre block: headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            zIndex: 1,
            maxWidth: 900,
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: 800,
              color: "#0D1117",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            We wrap your stack with production AI.
          </div>
        </div>

        {/* Bottom row: proof metric + tech tags */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 1,
          }}
        >
          {/* Proof metric */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              borderLeft: "3px solid #2563EB",
              paddingLeft: 16,
            }}
          >
            <span
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#0D1117",
                letterSpacing: "-0.03em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              120+
            </span>
            <span
              style={{
                fontSize: 16,
                color: "rgba(13,17,23,0.55)",
                fontWeight: 400,
              }}
            >
              hours of manual work automated every month
            </span>
          </div>

          {/* Tech tags */}
          <div style={{ display: "flex", gap: 8 }}>
            {["Next.js", "TypeScript", "PostgreSQL", "Inngest"].map((tech) => (
              <div
                key={tech}
                style={{
                  display: "flex",
                  padding: "7px 14px",
                  borderRadius: 6,
                  background: "rgba(13,17,23,0.05)",
                  border: "1px solid rgba(13,17,23,0.12)",
                  color: "rgba(13,17,23,0.65)",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
