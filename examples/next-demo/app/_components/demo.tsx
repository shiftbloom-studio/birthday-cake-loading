"use client";

import React from "react";
import type { CakeFeatureKey, CakeTier } from "@shiftbloom-studio/birthday-cake-loading";
import { CAKE_TIERS, CakeLayer, useCake } from "@shiftbloom-studio/birthday-cake-loading";
import { CakeUpgrade } from "@shiftbloom-studio/birthday-cake-loading/upgrade";

const playChime = async () => {
  const AudioContextConstructor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) return;

  const ctx = new AudioContextConstructor();
  await ctx.resume();

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, ctx.currentTime);

  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.24);

  oscillator.onended = () => {
    void ctx.close();
  };
};

const simulateJank = (ms = 260) => {
  const start = performance.now();
  while (performance.now() - start < ms) {
    Math.sqrt(Math.random());
  }
};

const Chip = ({ label, on }: { label: string; on: boolean }) => (
  <span className={`chip ${on ? "chipOn" : ""}`}>
    <span className="chipDot" aria-hidden />
    {label}
  </span>
);

const TierPill = ({ tier, override }: { tier: CakeTier; override?: CakeTier }) => (
  <div className="pill">
    <strong>Tier</strong>
    <span className="pillValue">{tier}</span>
    {override ? (
      <span className="pillValue" style={{ opacity: 0.75 }}>
        ({override})
      </span>
    ) : null}
  </div>
);

const FeatureRow = ({ features }: { features: Record<CakeFeatureKey, boolean> }) => (
  <div className="chipGrid" aria-label="Enabled features">
    <Chip label="motion" on={features.motion} />
    <Chip label="smoothScroll" on={features.smoothScroll} />
    <Chip label="richImages" on={features.richImages} />
    <Chip label="audio" on={features.audio} />
    <Chip label="privacyBanner" on={features.privacyBanner} />
  </div>
);

const Code = ({ children }: { children: string }) => (
  <pre className="code">
    <code>{children}</code>
  </pre>
);

const StaticHeroVisual = () => (
  <div className="heroVisualInner" aria-hidden>
    <div className="cake" />
  </div>
);

const AnimatedHeroVisual = () => (
  <div className="heroVisualInner" aria-hidden>
    <div className="cake">
      <div className="sprinkles" aria-hidden>
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className="sprinkle"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 29) % 100}%`,
              transform: `rotate(${(i * 33) % 360}deg)`,
              animationDelay: `${(i % 7) * 120}ms`,
              animationDuration: `${4200 + (i % 6) * 420}ms`
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

const SignalTable = ({ signals }: { signals: Record<string, unknown> }) => {
  const rows: Array<[string, unknown]> = [
    ["saveData", signals.saveData],
    ["prefersReducedData", signals.prefersReducedData],
    ["prefersReducedMotion", signals.prefersReducedMotion],
    ["effectiveType", signals.effectiveType],
    ["downlinkMbps", signals.downlinkMbps],
    ["rttMs", signals.rttMs],
    ["deviceMemoryGB", signals.deviceMemoryGB],
    ["hardwareConcurrency", signals.hardwareConcurrency],
    ["devicePixelRatio", signals.devicePixelRatio],
    ["screenWidth", signals.screenWidth],
    ["screenHeight", signals.screenHeight],
    ["userAgentMobile", signals.userAgentMobile]
  ];

  const formatValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "number") return String(Math.round(value * 100) / 100);
    return String(value);
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Signal</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{formatValue(value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const RichImagesSwap = () => (
  <CakeLayer
    feature="richImages"
    fallback={
      <div className="card upgradeCard">
        <div className="upgradeTitle">
          <strong>Feature gate: richImages</strong>
          <span>fallback</span>
        </div>
        <p className="cardBody">
          Keep imagery conservative on the lowest tier. When <code>richImages</code> becomes true (lite+), you can safely
          upgrade image density and presentation.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 10 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                minHeight: 54,
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.05)"
              }}
            />
          ))}
        </div>
      </div>
    }
  >
    <div className="card upgradeCard cardEmphasis">
      <div className="upgradeTitle">
        <strong>Feature gate: richImages</strong>
        <span>enabled</span>
      </div>
      <p className="cardBody">
        Rich imagery is allowed. This is where you can increase image quality, enable richer art-direction, or swap to
        heavier components.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 10 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              minHeight: 54,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.12)",
              background:
                "radial-gradient(120px 120px at 30% 30%, rgba(56,189,248,0.26), transparent 60%), radial-gradient(120px 120px at 70% 70%, rgba(251,113,133,0.22), transparent 60%), rgba(255,255,255,0.06)"
            }}
          />
        ))}
      </div>
    </div>
  </CakeLayer>
);

const PrivacyBannerSwap = () => {
  const [analytics, setAnalytics] = React.useState(false);
  const [personalization, setPersonalization] = React.useState(true);

  return (
    <CakeLayer
      feature="privacyBanner"
      fallback={
        <div className="card upgradeCard">
          <div className="upgradeTitle">
            <strong>Feature gate: privacyBanner</strong>
            <span>fallback</span>
          </div>
          <p className="cardBody">
            In low-data contexts, keep consent UX minimal. When allowed, you can render a richer preferences banner.
          </p>
        </div>
      }
    >
      <div className="card upgradeCard cardEmphasis">
        <div className="upgradeTitle">
          <strong>Feature gate: privacyBanner</strong>
          <span>enabled</span>
        </div>
        <p className="cardBody">
          Render a richer consent UI only when BCL says it is safe (rich+ and not Save-Data).
        </p>

        <div
          style={{
            marginTop: 10,
            display: "grid",
            gap: 10,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.12)",
            padding: 12,
            background: "rgba(0,0,0,0.25)"
          }}
        >
          <label style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 650 }}>Analytics</span>
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
          </label>
          <label style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 650 }}>Personalization</span>
            <input
              type="checkbox"
              checked={personalization}
              onChange={(e) => setPersonalization(e.target.checked)}
            />
          </label>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, lineHeight: 1.45 }}>
            (Demo UI — wire this up to your real consent system.)
          </div>
        </div>
      </div>
    </CakeLayer>
  );
};

export const Demo = () => {
  const cake = useCake();
  const [copied, setCopied] = React.useState(false);

  const scrollTo = React.useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({
        behavior: cake.features.smoothScroll ? "smooth" : "auto",
        block: "start"
      });
    },
    [cake.features.smoothScroll]
  );

  const copyDebug = React.useCallback(async () => {
    const payload = {
      tier: cake.tier,
      override: cake.override ?? null,
      features: cake.features,
      signals: cake.signals
    };
    const text = JSON.stringify(payload, null, 2);

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }, [cake.features, cake.override, cake.signals, cake.tier]);

  return (
    <>
      <section className="hero" aria-label="Birthday-Cake Loading demo">
        <div className="heroInner">
          <div>
            <div className="eyebrow">
              <span className="eyebrowDot" aria-hidden />
              Next.js 16 • React 19 • BCL
            </div>

            <h1 className="heroTitle">Capability-first progressive enhancement.</h1>
            <p className="heroLead">
              Ship a baseline-first page, then selectively upgrade visuals and interactivity when the device (and user
              preferences) say it is safe.
            </p>

            <div className="heroActions" role="group" aria-label="Demo actions">
              <button className="button buttonPrimary" type="button" onClick={() => scrollTo("upgrades")}>
                Jump to upgrades
              </button>
              <button className="button" type="button" onClick={() => simulateJank()}>
                Simulate jank (watchtower)
              </button>
              <button
                className="button"
                type="button"
                onClick={() => void playChime()}
                disabled={!cake.features.audio}
                aria-disabled={!cake.features.audio}
                title={cake.features.audio ? "Plays a short WebAudio chime." : "Audio is disabled for this tier/signals."}
              >
                Play chime
              </button>
              <button
                className="button"
                type="button"
                onClick={() => void copyDebug()}
                title="Copy tier/features/signals JSON"
              >
                {copied ? "Copied!" : "Copy state"}
              </button>
            </div>

            <div className="statusRow">
              <TierPill tier={cake.tier} override={cake.override} />
              <FeatureRow features={cake.features} />
            </div>
          </div>

          <div className="heroVisualWrap">
            <CakeLayer
              watchKey="hero"
              feature="motion"
              fallback={
                <>
                  <StaticHeroVisual />
                  <div className="heroVisualCaption">
                    <strong>Base visual</strong>
                    <span>Static (fast, always available).</span>
                  </div>
                </>
              }
            >
              <>
                <AnimatedHeroVisual />
                <div className="heroVisualCaption">
                  <strong>Motion visual</strong>
                  <span>Gated by the `motion` feature (respects reduced motion).</span>
                </div>
              </>
            </CakeLayer>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="layers-title">
        <h2 className="sectionTitle" id="layers-title">
          1) Render by tier with <code>CakeLayer</code>
        </h2>
        <p className="sectionLead">
          Each layer has a built-in baseline fallback. Try overriding tiers via the BCL DevTools (top-right) to see the
          swaps.
        </p>

        <div className="grid">
          <div className="card cardEmphasis">
            <h3 className="cardTitle">Base (always)</h3>
            <p className="cardBody">Readable layout, crisp typography, no assumptions.</p>
          </div>

          <CakeLayer
            minTier="lite"
            fallback={
              <div className="card">
                <h3 className="cardTitle">Lite layer</h3>
                <p className="cardBody">
                  Locked until the tier reaches <strong>lite</strong>.
                </p>
              </div>
            }
          >
            <div className="card cardEmphasis">
              <h3 className="cardTitle">Lite layer</h3>
              <p className="cardBody">Now we can safely opt into richer imagery and minor UX polish.</p>
            </div>
          </CakeLayer>

          <CakeLayer
            minTier="rich"
            fallback={
              <div className="card">
                <h3 className="cardTitle">Rich layer</h3>
                <p className="cardBody">
                  Locked until the tier reaches <strong>rich</strong>.
                </p>
              </div>
            }
          >
            <div className="card cardEmphasis">
              <h3 className="cardTitle">Rich layer</h3>
              <p className="cardBody">Eligible for client-side upgrades and premium interactions.</p>
            </div>
          </CakeLayer>

          <CakeLayer
            minTier="ultra"
            fallback={
              <div className="card">
                <h3 className="cardTitle">Ultra layer</h3>
                <p className="cardBody">
                  Locked until the tier reaches <strong>ultra</strong>.
                </p>
              </div>
            }
          >
            <div className="card cardEmphasis">
              <h3 className="cardTitle">Ultra layer</h3>
              <p className="cardBody">Top-tier device: you can afford the cinematic extras.</p>
            </div>
          </CakeLayer>
        </div>

        <Code>
          {`import { CakeLayer } from "@shiftbloom-studio/birthday-cake-loading";

<CakeLayer minTier="rich" fallback={<HeroStatic />}>
  <HeroAnimated />
</CakeLayer>`}
        </Code>
      </section>

      <section className="section" id="upgrades" aria-labelledby="upgrades-title">
        <h2 className="sectionTitle" id="upgrades-title">
          2) Lazy-load enhancements with <code>CakeUpgrade</code>
        </h2>
        <p className="sectionLead">
          Use strategies like <strong>idle</strong>, <strong>visible</strong>, and <strong>interaction</strong> so upgrades
          load only when needed.
        </p>

        <div className="grid">
          <CakeUpgrade
            feature="motion"
            watchKey="metrics"
            strategy={{ type: "idle", timeoutMs: 1200 }}
            loader={() => import("../_upgrades/rich-metrics")}
            props={{ label: "Idle upgrade" }}
            fallback={
              <div className="card upgradeCard">
                <div className="upgradeTitle">
                  <strong>Idle upgrade</strong>
                  <span>strategy: idle • gate: motion</span>
                </div>
                <p className="cardBody">Waits for idle time before loading. Great for non-critical polish.</p>
              </div>
            }
          />

          <CakeUpgrade
            minTier="rich"
            watchKey="gallery"
            strategy={{ type: "visible", rootMargin: "260px" }}
            loader={() => import("../_upgrades/visible-gallery")}
            fallback={
              <div className="card upgradeCard">
                <div className="upgradeTitle">
                  <strong>Visible upgrade</strong>
                  <span>strategy: visible • gate: rich+</span>
                </div>
                <p className="cardBody">Loads only once the card scrolls near the viewport.</p>
              </div>
            }
          />

          <CakeUpgrade
            minTier="rich"
            strategy="interaction"
            loader={() => import("../_upgrades/interaction-preview")}
            props={{ prompt: "This module is loaded only after a pointer/focus interaction." }}
            fallback={
              <div className="card upgradeCard">
                <div className="upgradeTitle">
                  <strong>Interaction upgrade</strong>
                  <span>strategy: interaction • gate: rich+</span>
                </div>
                <p className="cardBody">Hover, focus, or click to trigger the import.</p>
              </div>
            }
          />

          <CakeUpgrade
            minTier="ultra"
            watchKey="ultra"
            strategy={{ type: "timeout", ms: 700 }}
            loader={() => import("../_upgrades/ultra-celebration")}
            props={{ message: "Ultra tier unlocked 🎂" }}
            fallback={
              <div className="card upgradeCard">
                <div className="upgradeTitle">
                  <strong>Ultra celebration</strong>
                  <span>strategy: timeout • gate: ultra</span>
                </div>
                <p className="cardBody">A small delight reserved for the highest tier.</p>
              </div>
            }
          />
        </div>

        <Code>
          {`import { CakeUpgrade } from "@shiftbloom-studio/birthday-cake-loading/upgrade";

<CakeUpgrade
  strategy={{ type: "visible", rootMargin: "300px" }}
  minTier="rich"
  loader={() => import("./RichGallery")}
  fallback={<GalleryStatic />}
/>`}
        </Code>
      </section>

      <section className="section" aria-labelledby="signals-title">
        <h2 className="sectionTitle" id="signals-title">
          3) Signals and feature gates
        </h2>
        <p className="sectionLead">
          BCL derives features from capability + preferences. For example: <code>motion</code> is off when reduced-motion is
          on.
        </p>
        <SignalTable signals={cake.signals as unknown as Record<string, unknown>} />
      </section>

      <section className="section" aria-labelledby="features-title">
        <h2 className="sectionTitle" id="features-title">
          4) Feature-first gates
        </h2>
        <p className="sectionLead">
          Sometimes you want to gate on a concrete feature (like <code>richImages</code> or <code>privacyBanner</code>)
          instead of thinking in tiers. BCL lets you do that.
        </p>

        <div className="grid">
          <RichImagesSwap />
          <PrivacyBannerSwap />
        </div>
      </section>

      <section className="footer" aria-label="Footer">
        <div>
          Try the built-in DevTools (top-right) to override tiers. This demo also enables the Watchtower: click{" "}
          <strong>Simulate jank</strong> and watched layers (hero/metrics/gallery/ultra) will temporarily swap back to
          their fallbacks.
        </div>
        <div style={{ marginTop: 8 }}>
          <a
            href="https://www.npmjs.com/package/@shiftbloom-studio/birthday-cake-loading"
            target="_blank"
            rel="noreferrer"
          >
            npm package
          </a>
          {" • "}
          <a href="https://github.com/shiftbloom-studio/birthday-cake-loading" target="_blank" rel="noreferrer">
            GitHub
          </a>
          {" • "}
          <span>
            Override tier:{" "}
            <select
              value={cake.override ?? "auto"}
              onChange={(e) => {
                const v = e.target.value;
                cake.setTierOverride(v === "auto" ? undefined : (v as CakeTier));
              }}
              style={{
                marginLeft: 6,
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.86)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 10,
                padding: "6px 10px"
              }}
            >
              <option value="auto">auto</option>
              {CAKE_TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </span>
        </div>
      </section>
    </>
  );
};
