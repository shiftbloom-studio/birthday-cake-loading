import { CakeLayer, useCakeFeatures, useCakeTier } from "@birthday-cake/loading";
import { CakeUpgrade } from "@birthday-cake/loading/upgrade";

const TierBadge = () => {
  const tier = useCakeTier();
  const features = useCakeFeatures();
  return (
    <div className="badge">
      <strong>Tier:</strong> {tier}
      <span>Motion: {features.motion ? "on" : "off"}</span>
      <span>Audio: {features.audio ? "on" : "off"}</span>
    </div>
  );
};

export default function Page() {
  return (
    <main className="container">
      <header>
        <h1>Birthday-Cake Loading Demo</h1>
        <p>Baseline-first marketing experience with optional cinematic layers.</p>
      </header>
      <TierBadge />
      <section className="card-grid">
        <div className="card">
          <h2>Base layer</h2>
          <p>Always available, fast, and accessible.</p>
        </div>
        <CakeLayer minTier="rich" fallback={<div className="card">Static hero</div>}>
          <div className="card rich">Rich hero content</div>
        </CakeLayer>
      </section>
      <CakeUpgrade
        minTier="rich"
        strategy="idle"
        loader={() => import("./rich-section")}
        fallback={<div className="card">Lazy fallback content</div>}
      />
    </main>
  );
}
