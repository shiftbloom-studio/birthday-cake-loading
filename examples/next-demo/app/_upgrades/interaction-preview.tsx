"use client";

import React from "react";

export default function InteractionPreview({ prompt }: { prompt: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="card upgradeCard cardEmphasis">
      <div className="upgradeTitle">
        <strong>Interaction upgrade</strong>
        <span>loaded</span>
      </div>
      <p className="cardBody">{prompt}</p>

      <button type="button" className="button buttonPrimary" onClick={() => setOpen((v) => !v)}>
        {open ? "Hide frosting" : "Reveal frosting"}
      </button>

      {open ? (
        <div
          style={{
            marginTop: 10,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.14)",
            padding: 14,
            background:
              "radial-gradient(220px 150px at 40% 20%, rgba(255,255,255,0.14), transparent 60%), linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))"
          }}
        >
          <div style={{ fontWeight: 760, letterSpacing: "-0.01em" }}>Frosting controls</div>
          <div style={{ color: "rgba(255,255,255,0.70)", fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>
            You can load heavy interaction code only after the user shows intent.
          </div>
        </div>
      ) : null}
    </div>
  );
}

