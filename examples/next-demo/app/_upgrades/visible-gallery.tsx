"use client";

import React from "react";

const PALETTES = [
  ["#FF2E52", "#FFE9EF", "#1A1216"],
  ["#FF8FAB", "#C81040", "#FAF6F4"],
  ["#FFC2D3", "#FF7E9E", "#FF2E52"]
];

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
        This component was imported when its placeholder came close to the viewport. Galleries, carousels and charts
        below the fold are good candidates.
      </p>

      <div className="tiles">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="tile tileRich" style={{ background: palette[i % palette.length] }} />
        ))}
      </div>

      <div className="metaRow">
        <button type="button" className="button" onClick={() => setPaletteIndex((v) => (v + 1) % PALETTES.length)}>
          Try another palette
        </button>
        <span>plain CSS tiles, swap in your own media</span>
      </div>
    </div>
  );
}

