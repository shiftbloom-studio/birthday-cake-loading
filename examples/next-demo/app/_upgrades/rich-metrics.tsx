"use client";

import React from "react";
import { useCakeSignals, useCakeTier } from "@shiftbloom-studio/birthday-cake-loading";

export default function RichMetrics({ label }: { label: string }) {
  const tier = useCakeTier();
  const signals = useCakeSignals();
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 650;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * 100));
      if (t < 1) raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [label]);

  return (
    <div className="card upgradeCard cardEmphasis">
      <div className="upgradeTitle">
        <strong>{label}</strong>
        <span>loaded</span>
      </div>

      <div className="metricRow">
        <div className="metric">
          <div className="metricValue">{value}%</div>
          <div className="metricLabel">headroom</div>
        </div>
        <div className="metric">
          <div className="metricValue">{tier}</div>
          <div className="metricLabel">tier</div>
        </div>
      </div>

      <div className="metaRow">
        <span>ECT: {signals.effectiveType ?? "—"}</span>
        <span>Memory: {signals.deviceMemoryGB ? `${signals.deviceMemoryGB}GB` : "—"}</span>
        <span>Cores: {signals.hardwareConcurrency ?? "—"}</span>
      </div>
    </div>
  );
}

