"use client";

import React from "react";
import Link from "next/link";
import type { CakeFeatureKey, CakeTier } from "@shiftbloom-studio/birthday-cake-loading";
import { CAKE_TIERS, CakeLayer, useCake } from "@shiftbloom-studio/birthday-cake-loading";
import { CakeUpgrade } from "@shiftbloom-studio/birthday-cake-loading/upgrade";
import { Bloom } from "./bloom";

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

// Intentionally blocks the main thread with a busy loop to simulate jank in this demo.
// Do not copy this pattern into production code.
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
    <strong>tier</strong>
    <span className="pillValue">{tier}</span>
    {override ? <span>forced</span> : null}
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

const CakeVisual = ({ tier, moving }: { tier: CakeTier; moving: boolean }) => {
  const reached = CAKE_TIERS.indexOf(tier);
  return (
    <div className="heroVisualInner" aria-hidden>
      <div className={`cake ${moving ? "cakeMoving" : ""}`}>
        {CAKE_TIERS.map((layer, i) => (
          <div key={layer} data-layer={layer} className={`cakeLayer ${i <= reached ? "cakeLayerOn" : ""}`}>
            {layer}
          </div>
        ))}
        <span className="cakeSeed" />
      </div>
    </div>
  );
};

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
    if (typeof value === "number") return String(Number.parseFloat(value.toFixed(2)));
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

const RICH_TILES = ["#FF2E52", "#FF8FAB", "#FFE9EF", "#C81040", "#1A1216", "#FFC2D3"];

const RichImagesSwap = () => (
  <CakeLayer
    feature="richImages"
    fallback={
      <div className="card upgradeCard">
        <div className="upgradeTitle">
          <strong>richImages</strong>
          <span>fallback</span>
        </div>
        <p className="cardBody">
          Three grey boxes stand in for small, cheap images. From the lite tier on, <code>richImages</code> turns true
          and the full set loads.
        </p>
        <div className="tiles">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="tile" />
          ))}
        </div>
      </div>
    }
  >
    <div className="card upgradeCard cardEmphasis">
      <div className="upgradeTitle">
        <strong>richImages</strong>
        <span>on</span>
      </div>
      <p className="cardBody">
        <code>richImages</code> is on, so this card shows six tiles instead of three. In a real page this is where the
        2x images or the autoplaying video go.
      </p>
      <div className="tiles">
        {RICH_TILES.map((color, i) => (
          <div key={i} className="tile tileRich" style={{ background: color }} />
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
            <strong>privacyBanner</strong>
            <span>fallback</span>
          </div>
          <p className="cardBody">
            On slow connections or with Save-Data on, the consent prompt stays a single line of text.
          </p>
        </div>
      }
    >
      <div className="card upgradeCard cardEmphasis">
        <div className="upgradeTitle">
          <strong>privacyBanner</strong>
          <span>on</span>
        </div>
        <p className="cardBody">
          From the rich tier, and only without Save-Data, the full preferences panel renders.
        </p>

        <div className="inset">
          <label className="toggleRow">
            <span>Analytics</span>
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
          </label>
          <label className="toggleRow">
            <span>Personalization</span>
            <input
              type="checkbox"
              checked={personalization}
              onChange={(e) => setPersonalization(e.target.checked)}
            />
          </label>
          <div className="insetNote">These switches do nothing here. Connect them to your own consent tool.</div>
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
      <header className="topbar">
        <a className="brand" href="https://shiftbloom.studio" aria-label="shiftbloom studio">
          <Bloom />
          <span className="wordmark">
            shiftbloom <span>studio</span>
            <i aria-hidden="true" />
          </span>
        </a>
        <nav className="topLinks" aria-label="Project links">
          <a href="https://github.com/shiftbloom-studio/birthday-cake-loading" target="_blank" rel="noreferrer">
            github
          </a>
          <a
            href="https://www.npmjs.com/package/@shiftbloom-studio/birthday-cake-loading"
            target="_blank"
            rel="noreferrer"
          >
            npm
          </a>
        </nav>
      </header>

      <section className="hero" aria-label="Birthday-Cake Loading demo">
        <div className="heroInner">
          <div>
            <div className="eyebrow">
              <span className="eyebrowDot" aria-hidden />
              birthday-cake-loading demo
            </div>

            <h1 className="heroTitle">This page checks what your device can handle before it adds anything.</h1>
            <p className="heroLead">
              It starts as plain HTML that works on a ten-year-old phone. Then the library reads signals like your
              connection speed and Save-Data, picks one of four tiers and stacks layers on top. Yours landed on{" "}
              <strong>{cake.tier}</strong>.
            </p>

            <div className="heroActions" role="group" aria-label="Demo actions">
              <button className="button buttonPrimary" type="button" onClick={() => scrollTo("upgrades")}>
                See the upgrades
              </button>
              <button className="button" type="button" onClick={() => simulateJank()}>
                Block the main thread for 260 ms
              </button>
              <button
                className="button"
                type="button"
                onClick={() => void playChime()}
                disabled={!cake.features.audio}
                aria-disabled={!cake.features.audio}
                title={cake.features.audio ? "Plays a short tone through WebAudio." : "Audio is off for this tier."}
              >
                Play a sound
              </button>
              <button
                className="button"
                type="button"
                onClick={() => void copyDebug()}
                title="Copies tier, features and signals as JSON"
              >
                {copied ? "Copied" : "Copy state as JSON"}
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
                  <CakeVisual tier={cake.tier} moving={false} />
                  <div className="heroVisualCaption">
                    <strong>Still version</strong>
                    <span>Shown when motion is off, for example with reduced motion turned on.</span>
                  </div>
                </>
              }
            >
              <>
                <CakeVisual tier={cake.tier} moving />
                <div className="heroVisualCaption">
                  <strong>Animated version</strong>
                  <span>
                    Rendered because <code>motion</code> is on. Each filled layer is a tier your device reached.
                  </span>
                </div>
              </>
            </CakeLayer>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="layers-title">
        <h2 className="sectionTitle" id="layers-title">
          Layers by tier with <code>CakeLayer</code>
        </h2>
        <p className="sectionLead">
          Every layer renders its fallback first. Open the panel in the top right corner, force a different tier and
          watch the cards below swap.
        </p>

        <div className="grid">
          <div className="card cardEmphasis">
            <h3 className="cardTitle">Base</h3>
            <p className="cardBody">Always rendered. Text and layout, nothing that needs a fast device.</p>
          </div>

          <CakeLayer
            minTier="lite"
            fallback={
              <div className="card">
                <h3 className="cardTitle">Lite layer</h3>
                <p className="cardBody">
                  Waiting for the <strong>lite</strong> tier.
                </p>
              </div>
            }
          >
            <div className="card cardEmphasis">
              <h3 className="cardTitle">Lite layer</h3>
              <p className="cardBody">Better images and small touches, like hover states that animate.</p>
            </div>
          </CakeLayer>

          <CakeLayer
            minTier="rich"
            fallback={
              <div className="card">
                <h3 className="cardTitle">Rich layer</h3>
                <p className="cardBody">
                  Waiting for the <strong>rich</strong> tier.
                </p>
              </div>
            }
          >
            <div className="card cardEmphasis">
              <h3 className="cardTitle">Rich layer</h3>
              <p className="cardBody">Client-side upgrades and heavier interaction are fair game now.</p>
            </div>
          </CakeLayer>

          <CakeLayer
            minTier="ultra"
            fallback={
              <div className="card">
                <h3 className="cardTitle">Ultra layer</h3>
                <p className="cardBody">
                  Waiting for the <strong>ultra</strong> tier.
                </p>
              </div>
            }
          >
            <div className="card cardEmphasis">
              <h3 className="cardTitle">Ultra layer</h3>
              <p className="cardBody">The extras nobody needs, for the devices that can afford them.</p>
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
          Code that loads later with <code>CakeUpgrade</code>
        </h2>
        <p className="sectionLead">
          <code>CakeUpgrade</code> waits for a trigger before it imports a component. Each card below uses a different
          one, and none of their code is in the first download.
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
                <p className="cardBody">Loads once the browser has nothing else to do, or after 1.2 seconds at the latest.</p>
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
                <p className="cardBody">Loads when this card comes within 260 px of the viewport.</p>
              </div>
            }
          />

          <CakeUpgrade
            minTier="rich"
            strategy="interaction"
            loader={() => import("../_upgrades/interaction-preview")}
            props={{ prompt: "You pointed at the card, so this component was fetched just now." }}
            fallback={
              <div className="card upgradeCard">
                <div className="upgradeTitle">
                  <strong>Interaction upgrade</strong>
                  <span>strategy: interaction • gate: rich+</span>
                </div>
                <p className="cardBody">Point at this card or tab to it, and the import starts.</p>
              </div>
            }
          />

          <CakeUpgrade
            minTier="ultra"
            watchKey="ultra"
            strategy={{ type: "timeout", ms: 700 }}
            loader={() => import("../_upgrades/ultra-celebration")}
            props={{ message: "Ultra tier" }}
            fallback={
              <div className="card upgradeCard">
                <div className="upgradeTitle">
                  <strong>Ultra tier</strong>
                  <span>strategy: timeout • gate: ultra</span>
                </div>
                <p className="cardBody">Only on ultra, 700 ms after the page settles.</p>
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
          What your browser reported
        </h2>
        <p className="sectionLead">
          These values decide the tier. A dash means your browser didn&apos;t share it. With reduced motion turned on,{" "}
          <code>motion</code> stays off however fast the device is.
        </p>
        <SignalTable signals={cake.signals as unknown as Record<string, unknown>} />
      </section>

      <section className="section" aria-labelledby="features-title">
        <h2 className="sectionTitle" id="features-title">
          Gating on one feature
        </h2>
        <p className="sectionLead">
          Sometimes a tier is too coarse and the real question is narrower, like whether heavy images make sense on
          this connection. <code>CakeLayer</code> also takes a single feature.
        </p>

        <div className="grid">
          <RichImagesSwap />
          <PrivacyBannerSwap />
        </div>
      </section>
    </>
  );
};

export const DemoFooter = () => {
  const cake = useCake();
  return (
    <footer className="footer" aria-label="Footer">
      <div>
        The hero, the metrics, the gallery and the ultra card are watched. Press <strong>Block the main thread</strong>{" "}
        and they drop back to their fallbacks for a few seconds, then recover.
      </div>
      <div className="footerLinks">
        <a
          href="https://www.npmjs.com/package/@shiftbloom-studio/birthday-cake-loading"
          target="_blank"
          rel="noreferrer"
        >
          npm
        </a>
        <a href="https://github.com/shiftbloom-studio/birthday-cake-loading" target="_blank" rel="noreferrer">
          source on github
        </a>
        <span className="footerLegal">
          <Link href="/imprint">imprint</Link>
          <Link href="/privacy">privacy</Link>
        </span>
        <label>
          force tier
          <select
            className="select"
            value={cake.override ?? "auto"}
            onChange={(e) => {
              const v = e.target.value;
              cake.setTierOverride(v === "auto" ? undefined : (v as CakeTier));
            }}
          >
            <option value="auto">auto</option>
            {CAKE_TIERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>
    </footer>
  );
};
