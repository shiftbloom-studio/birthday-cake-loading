import React from "react";
import type { CakeBootstrap } from "birthday-cake-loading";
import { CakeProvider, useCakeFeatures, useCakeTier } from "birthday-cake-loading";

const Content = () => {
  const tier = useCakeTier();
  const features = useCakeFeatures();
  return (
    <main style={{ fontFamily: "system-ui", padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>Birthday-Cake Loading — Astro demo</h1>
      <p>
        Tier: <strong>{tier}</strong>
      </p>
      <ul>
        <li>motion: {String(features.motion)}</li>
        <li>audio: {String(features.audio)}</li>
        <li>richImages: {String(features.richImages)}</li>
      </ul>
    </main>
  );
};

export default function App({ bootstrap }: { bootstrap?: CakeBootstrap }) {
  return (
    <CakeProvider bootstrap={bootstrap}>
      <Content />
    </CakeProvider>
  );
}

