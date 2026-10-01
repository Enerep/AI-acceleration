import { ImageResponse } from "next/og";

export const alt = "DON’T STOP. The future is worth building.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f1f0e9",
        padding: 60,
        color: "#171815",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 22, letterSpacing: 4 }}>
        {"/// THE CASE FOR AI ACCELERATION"}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 158,
          fontWeight: 900,
          letterSpacing: -10,
        }}
      >
        DON’T STOP<span style={{ color: "#fa4b19" }}>.</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "2px solid #171815",
          paddingTop: 25,
          fontSize: 27,
        }}
      >
        <span>The future is worth building.</span>
        <span style={{ color: "#fa4b19" }}>FULL SPEED AHEAD ↗</span>
      </div>
    </div>,
    size,
  );
}
