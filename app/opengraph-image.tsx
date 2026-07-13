import { ImageResponse } from "next/og";

export const alt = "ThiamSmart — Électroménager en ligne";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#111111",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 140,
              height: 140,
              borderRadius: 32,
              background: "#fb6c08",
              color: "white",
              fontSize: 90,
              fontWeight: 800,
            }}
          >
            T
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 88, fontWeight: 800 }}>
              <span style={{ color: "white" }}>Thiam</span>
              <span style={{ color: "#fb6c08" }}>mart</span>
            </div>
            <div
              style={{
                fontSize: 32,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: 6,
                textTransform: "uppercase",
              }}
            >
              Électroménager
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
