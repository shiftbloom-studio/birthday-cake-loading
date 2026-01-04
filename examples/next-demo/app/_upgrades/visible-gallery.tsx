"use client";

import React from "react";

const PALETTES = [
  ["#38bdf8", "#22c55e", "#f59e0b"],
  ["#fb7185", "#a78bfa", "#38bdf8"],
  ["#f472b6", "#60a5fa", "#34d399"]
];

const tileStyle = (palette: string[], i: number): React.CSSProperties => ({
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.12)",
  background: `radial-gradient(120px 120px at 30% 30%, ${palette[i % palette.length]}55, transparent 60%),
linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))`,
  boxShadow: "0 14px 40px rgba(0,0,0,0.30)",
  minHeight: 72
});

export default function VisibleGallery() {
  const [paletteIndex, setPaletteIndex] = React.useState(0);
  const palette = PALETTES[paletteIndex % PALETTES.length];

  return (
    <div className="card upgradeCard cardEmphasis">
      <div className="upgradeTitle">
        <strong>Visible upgrade</strong>
        <span>loaded</span>
      </div>

      <p className="cardBody">
        This module is imported only when its placeholder approaches the viewport. It is a good fit for below-the-fold
        sections (galleries, carousels, charts).
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 8 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={tileStyle(palette, i)} />
        ))}
      </div>

      <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button type="button" className="button" onClick={() => setPaletteIndex((v) => (v + 1) % PALETTES.length)}>
          Switch palette
        </button>
        <span style={{ color: "rgba(255,255,255,0.62)", fontSize: 12 }}>
          (pure CSS tiles — replace with your own rich media)
        </span>
      </div>
    </div>
  );
}

