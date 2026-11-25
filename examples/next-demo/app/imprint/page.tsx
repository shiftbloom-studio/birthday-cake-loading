import type { Metadata } from "next";
import { LegalPage, OperatorAddress, OperatorEmail, OperatorPhone } from "../_legal/legal";
import { operator } from "../_legal/operator";

export const metadata: Metadata = {
  title: "Imprint — Birthday-Cake Loading Demo",
  description: "Legal notice for the Birthday-Cake Loading demo.",
  alternates: { languages: { en: "/imprint", de: "/impressum" } }
};

export default function ImprintPage() {
  return (
    <LegalPage lang="en" kind="imprint" title="Imprint">
      <section className="legalSection">
        <h2>Information pursuant to § 5 DDG</h2>
        <OperatorAddress lang="en" />
      </section>

      <section className="legalSection">
        <h2>Contact</h2>
        <p>
          Email: <OperatorEmail />
          <OperatorPhone lang="en" />
        </p>
        {operator.vatId ? <p>VAT ID pursuant to § 27a UStG: {operator.vatId}</p> : null}
      </section>

      <section className="legalSection">
        <h2>Responsible for content pursuant to § 18 (2) MStV</h2>
        <OperatorAddress lang="en" />
      </section>

      <section className="legalSection">
        <h2>Consumer dispute resolution</h2>
        <p>We are not willing or obliged to take part in dispute resolution proceedings before a consumer arbitration board.</p>
      </section>

      <section className="legalSection">
        <h2>Liability for content and links</h2>
        <p>
          We put care into this page, but we can&apos;t guarantee that everything on it is accurate, complete or up to
          date. External sites we link to are the responsibility of whoever runs them. We saw nothing unlawful on them
          when we added the links.
        </p>
      </section>

      <section className="legalSection">
        <h2>Open source</h2>
        <p>
          Birthday-Cake Loading is an open-source project. The source of this demo lives on{" "}
          <a href="https://github.com/shiftbloom-studio/birthday-cake-loading" target="_blank" rel="noreferrer">
            GitHub
          </a>
          . This site is not affiliated with Cloudflare or any other company it mentions.
        </p>
      </section>
    </LegalPage>
  );
}
