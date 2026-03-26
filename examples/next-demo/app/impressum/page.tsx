import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum — Birthday-Cake Loading Demo",
  description: "Impressum gemäß § 5 TMG für die Birthday-Cake Loading Demo von shiftbloom studio.",
};

export default function ImpressumPage() {
  return (
    <main id="content" className="container">
      <div className="legalPage">
        <Link href="/" className="legalBack">
          ← Zurück zur Demo
        </Link>

        <h1 className="legalTitle">Impressum</h1>
        <p className="legalSubtitle">Angaben gemäß § 5 TMG</p>

        <section className="legalSection">
          <h2>Diensteanbieter</h2>
          <p>
            Fabian Zimber
            <br />
            shiftbloom studio
            <br />
            Hamburg, Deutschland
          </p>
        </section>

        <section className="legalSection">
          <h2>Kontakt</h2>
          <p>
            E-Mail:{" "}
            <a href="mailto:fabian@shiftbloom.studio">fabian@shiftbloom.studio</a>
          </p>
        </section>

        <section className="legalSection">
          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>
            Fabian Zimber
            <br />
            Hamburg, Deutschland
          </p>
        </section>

        <section className="legalSection">
          <h2>Haftungsausschluss</h2>

          <h3>Haftung für Inhalte</h3>
          <p>
            Die Inhalte dieser Seite wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
            Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen.
          </p>

          <h3>Haftung für Links</h3>
          <p>
            Diese Website enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
            übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
            Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
            Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum
            Zeitpunkt der Verlinkung nicht erkennbar.
          </p>
        </section>

        <section className="legalSection">
          <h2>Urheberrecht</h2>
          <p>
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
            der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
            Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </section>

        <section className="legalSection">
          <h2>Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noreferrer"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <div className="legalFooter">
          <Link href="/datenschutz">Datenschutzerklärung</Link>
          {" • "}
          <Link href="/">Zurück zur Demo</Link>
        </div>
      </div>
    </main>
  );
}
