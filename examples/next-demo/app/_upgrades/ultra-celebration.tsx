"use client";

import React from "react";
import { useCakeFeatures } from "@shiftbloom-studio/birthday-cake-loading";

const COLORS = ["#FF2E52", "#FF8FAB", "#C81040", "#FFC2D3", "#FF7E9E"];

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
    <div className="card upgradeCard cardEmphasis">
      <div className="upgradeTitle">
        <strong>{message}</strong>
        <span>{motion ? "motion" : "static"}</span>
      </div>

      <p className="cardBody">
        Ultra is for fast devices with nothing holding them back. Even here, reduced motion wins and the seeds stay
        still.
      </p>

      <div className="stage">
        <div className="confetti" aria-hidden>
          {pieces.map((p, i) => (
            <span
              key={`${seed}-${i}`}
              className="confettiPiece"
              style={{
                left: `${p.leftPct}%`,
                top: 0,
                background: p.color,
                animationDelay: `${p.delayMs}ms`,
                animationDuration: `${p.durationMs}ms`,
                                opacity: motion ? 0.9 : 0.35
              }}
            />
          ))}
        </div>

        <div className="stageText">
          <div className="insetTitle">18 seeds, one shower</div>
          <div className="insetNote">
            {motion ? "Press the button for another round." : "Reduced motion is on, so nothing moves."}
          </div>
        </div>
      </div>

      <button type="button" className="button" onClick={() => setSeed((v) => v + 1)}>
        Drop them again
      </button>
    </div>
  );
}

