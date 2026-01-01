import React from "react";
import type { CakeTier } from "./types";
import { useCake } from "./context";

const TIERS: CakeTier[] = ["base", "lite", "rich", "ultra"];

export interface CakeDevToolsProps {
  initiallyOpen?: boolean;
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
}

export const CakeDevTools = ({ initiallyOpen = false, position = "bottom-left" }: CakeDevToolsProps) => {
  const cake = useCake();
  const [open, setOpen] = React.useState(initiallyOpen);

  const positionStyle = React.useMemo<React.CSSProperties>(() => {
    const base: React.CSSProperties = { position: "fixed", zIndex: 2147483647 };
    switch (position) {
      case "top-left":
        return { ...base, top: 12, left: 12 };
      case "top-right":
        return { ...base, top: 12, right: 12 };
      case "bottom-right":
        return { ...base, bottom: 12, right: 12 };
      case "bottom-left":
      default:
        return { ...base, bottom: 12, left: 12 };
    }
  }, [position]);

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <div style={positionStyle}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          font: "12px/1.2 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
          padding: "8px 10px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(20,20,20,0.85)",
          color: "white",
          cursor: "pointer"
        }}
        aria-expanded={open}
      >
        BCL {open ? "▾" : "▸"} {cake.tier}
      </button>

      {open ? (
        <div
          style={{
            marginTop: 8,
            width: 340,
            maxWidth: "calc(100vw - 24px)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(20,20,20,0.92)",
            color: "white",
            padding: 12,
            font: "12px/1.35 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ opacity: 0.8 }}>Override</span>
              <select
                value={cake.override ?? "auto"}
                onChange={(e) => {
                  const v = e.target.value;
                  cake.setTierOverride(v === "auto" ? undefined : (v as CakeTier));
                }}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8,
                  padding: "4px 6px"
                }}
              >
                <option value="auto">auto</option>
                {TIERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => cake.refresh()}
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
                padding: "4px 8px",
                cursor: "pointer"
              }}
            >
              refresh
            </button>
          </div>

          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "110px 1fr", gap: 6 }}>
            <div style={{ opacity: 0.8 }}>ready</div>
            <div>{String(cake.ready)}</div>

            <div style={{ opacity: 0.8 }}>tier</div>
            <div>{cake.tier}</div>

            <div style={{ opacity: 0.8 }}>features</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              {Object.entries(cake.features).map(([k, v]) => (
                <div key={k}>
                  <span style={{ opacity: 0.8 }}>{k}</span>: {String(v)}
                </div>
              ))}
            </div>

            <div style={{ opacity: 0.8 }}>signals</div>
            <div style={{ maxHeight: 140, overflow: "auto" }}>
              {Object.entries(cake.signals).length === 0 ? (
                <div style={{ opacity: 0.8 }}>none</div>
              ) : (
                Object.entries(cake.signals).map(([k, v]) => (
                  <div key={k}>
                    <span style={{ opacity: 0.8 }}>{k}</span>: {String(v)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

