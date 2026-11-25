import type { Metadata } from "next";
import { LegalPage, OperatorAddress, OperatorEmail, OperatorPhone } from "../_legal/legal";
import { operator } from "../_legal/operator";

export const metadata: Metadata = {
  title: "Impressum — Birthday-Cake Loading Demo",
  description: "Impressum der Birthday-Cake Loading Demo.",
  alternates: { languages: { en: "/imprint", de: "/impressum" } }
};

export default function ImpressumPage() {
  return (
    <LegalPage lang="de" kind="imprint" title="Impressum">
      <section className="legalSection">
        <h2>Angaben gemäß § 5 DDG</h2>
        <OperatorAddress lang="de" />
      </section>

      <section className="legalSection">
        <h2>Kontakt</h2>
        <p>
          E-Mail: <OperatorEmail />
          <OperatorPhone lang="de" />
        </p>
        {operator.vatId ? <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: {operator.vatId}</p> : null}
      </section>

      <section className="legalSection">
        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <OperatorAddress lang="de" />
      </section>

      <section className="legalSection">
        <h2>Verbraucherstreitbeilegung</h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>

      <section className="legalSection">
        <h2>Haftung für Inhalte und Links</h2>
        <p>
          Die Inhalte dieser Seite wurden mit Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität
          übernehmen wir keine Gewähr. Für die Inhalte verlinkter externer Seiten ist stets deren Anbieter
          verantwortlich. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar.
        </p>
      </section>

      <section className="legalSection">
        <h2>Open Source</h2>
        <p>
          Birthday-Cake Loading ist ein Open-Source-Projekt. Der Quellcode dieser Demo liegt auf{" "}
          <a href="https://github.com/shiftbloom-studio/birthday-cake-loading" target="_blank" rel="noreferrer">
            GitHub
          </a>
          . Die Seite steht in keiner Verbindung zu Cloudflare oder anderen genannten Unternehmen.
        </p>
      </section>
    </LegalPage>
  );
}
