"use client";

import React from "react";
import { useCakeFeatures } from "@shiftbloom-studio/birthday-cake-loading";

const COLORS = ["#38bdf8", "#fb7185", "#a78bfa", "#f59e0b", "#22c55e"];

type Piece = {
  leftPct: number;
  delayMs: number;
  durationMs: number;
  color: string;
  rotateDeg: number;
};

const makePieces = (seed: number, count: number): Piece[] => {
  let s = seed;
  const next = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };

  return Array.from({ length: count }).map((_, i) => ({
    leftPct: Math.round(next() * 100),
    delayMs: Math.round(next() * 520),
    durationMs: 1200 + Math.round(next() * 900),
    rotateDeg: Math.round(next() * 360),
    color: COLORS[i % COLORS.length]
  }));
};

export default function UltraCelebration({ message }: { message: string }) {
  const { motion } = useCakeFeatures();
  const [seed, setSeed] = React.useState(1);
  const pieces = React.useMemo(() => makePieces(seed, 18), [seed]);

  return (
    <div className="card upgradeCard cardEmphasis" style={{ overflow: "hidden" }}>
      <div className="upgradeTitle">
        <strong>{message}</strong>
        <span>{motion ? "motion" : "static"}</span>
      </div>

      <p className="cardBody">
        Ultra is the “go wild” tier. This component still respects reduced-motion by rendering without animations when
        needed.
      </p>

      <div
        style={{
          position: "relative",
          minHeight: 120,
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(0,0,0,0.25)"
        }}
      >
        <div className="confetti" aria-hidden>
          {pieces.map((p, i) => (
            <span
              key={`${seed}-${i}`}
              className="confettiPiece"
              style={{
                left: `${p.leftPct}%`,
                top: 0,
                background: `linear-gradient(180deg, ${p.color}, rgba(255,255,255,0.85))`,
                animationDelay: `${p.delayMs}ms`,
                animationDuration: `${p.durationMs}ms`,
                transform: `translate3d(0,-20px,0) rotate(${p.rotateDeg}deg)`,
                opacity: motion ? 0.9 : 0.35
              }}
            />
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            padding: 12,
            textAlign: "center"
          }}
        >
          <div style={{ fontWeight: 780, letterSpacing: "-0.01em" }}>Cinematic sprinkle shower</div>
          <div style={{ color: "rgba(255,255,255,0.70)", fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
            {motion ? "Animating…" : "Reduced motion detected — no animation."}
          </div>
        </div>
      </div>

      <button type="button" className="button" onClick={() => setSeed((v) => v + 1)}>
        Reroll confetti
      </button>
    </div>
  );
}

