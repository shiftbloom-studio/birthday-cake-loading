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
        {open ? "Hide the panel" : "Open the panel"}
      </button>

      {open ? (
        <div className="inset">
          <div className="insetTitle">Nothing here was in the first download</div>
          <div className="insetNote">
            This is where an editor, a 3D viewer or a map would go: code you only pay for once someone shows they want
            it.
          </div>
        </div>
      ) : null}
    </div>
  );
}

