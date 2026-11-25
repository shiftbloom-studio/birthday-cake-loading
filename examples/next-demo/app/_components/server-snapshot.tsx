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
        The first guess happens on the server
      </h2>
      <p className="sectionLead">
        Before any JavaScript runs, the Worker reads Client Hints from the request headers and picks a starting tier.
        Browsers only send most hints from the second request on, so reload once if the table is mostly dashes.
      </p>

      <div className="grid">
        <div className="card">
          <h3 className="cardTitle">What the server decided</h3>
          <p className="cardBody">
            Tier <strong>{bootstrap.tier}</strong>. Features on:{" "}
            {Object.entries(serverFeatures)
              .filter(([, v]) => v)
              .map(([k]) => k)
              .join(", ") || "none"}
          </p>
          <details>
            <summary>Show the request headers it used</summary>
            <pre className="code">
              <code>
                {HEADER_KEYS.map(({ label, key }) => `${label}: ${h.get(key) ?? "—"}`).join("\n")}
              </code>
            </pre>
          </details>
        </div>

        <div className="card">
          <h3 className="cardTitle">The bootstrap object</h3>
          <p className="cardBody">
            Pass this to <code>CakeProvider</code> as <code>bootstrap</code> and the client starts from the same tier.
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
