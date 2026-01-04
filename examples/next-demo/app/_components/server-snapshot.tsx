import { headers } from "next/headers";
import {
  getServerCakeBootstrapFromHeaders,
  getServerFeatures
} from "@shiftbloom-studio/birthday-cake-loading/server";

const HEADER_KEYS: Array<{ label: string; key: string }> = [
  { label: "Save-Data", key: "save-data" },
  { label: "ECT", key: "ect" },
  { label: "Downlink", key: "downlink" },
  { label: "RTT", key: "rtt" },
  { label: "Device-Memory", key: "device-memory" },
  { label: "DPR", key: "dpr" },
  { label: "Viewport-Width", key: "viewport-width" },
  { label: "Viewport-Height", key: "viewport-height" },
  { label: "Sec-CH-UA-Mobile", key: "sec-ch-ua-mobile" },
  { label: "Sec-CH-Prefers-Reduced-Motion", key: "sec-ch-prefers-reduced-motion" },
  { label: "Sec-CH-Prefers-Reduced-Data", key: "sec-ch-prefers-reduced-data" }
];

export const ServerSnapshot = async () => {
  const h = await headers();
  const bootstrap = getServerCakeBootstrapFromHeaders(h);
  const serverFeatures = getServerFeatures(bootstrap.tier, bootstrap.signals);

  return (
    <section className="section" aria-labelledby="server-title">
      <h2 className="sectionTitle" id="server-title">
        5) Server bootstrap (SSR)
      </h2>
      <p className="sectionLead">
        On the server, BCL can precompute signals and a tier from request headers (Client Hints). This keeps SSR and
        hydration consistent and avoids guessing.
      </p>

      <div className="grid">
        <div className="card">
          <h3 className="cardTitle">Computed on the server</h3>
          <p className="cardBody">
            Tier: <strong>{bootstrap.tier}</strong> • Features:{" "}
            {Object.entries(serverFeatures)
              .map(([k, v]) => `${k}=${v ? "on" : "off"}`)
              .join(" • ")}
          </p>
          <details style={{ marginTop: 12 }}>
            <summary style={{ cursor: "pointer", color: "rgba(255,255,255,0.86)" }}>
              View request headers used
            </summary>
            <pre className="code">
              <code>
                {HEADER_KEYS.map(({ label, key }) => `${label}: ${h.get(key) ?? "—"}`).join("\n")}
              </code>
            </pre>
          </details>
        </div>

        <div className="card">
          <h3 className="cardTitle">Bootstrap JSON</h3>
          <p className="cardBody">
            The exact object you can pass to <code>CakeProvider</code> as <code>bootstrap</code>.
          </p>
          <pre className="code">
            <code>{JSON.stringify(bootstrap, null, 2)}</code>
          </pre>
        </div>
      </div>

      <CodeExample />
    </section>
  );
};

const CodeExample = () => (
  <pre className="code">
    <code>
      {`// app/layout.tsx (Next.js App Router)
import { headers } from "next/headers";
import { getServerCakeBootstrapFromHeaders } from "@shiftbloom-studio/birthday-cake-loading/server";

export default async function RootLayout({ children }) {
  const bootstrap = getServerCakeBootstrapFromHeaders(await headers());
  return <Providers bootstrap={bootstrap}>{children}</Providers>;
}`}
    </code>
  </pre>
);
