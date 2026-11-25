import type { Metadata } from "next";
import Link from "next/link";
import { operator, OperatorAddress, OperatorEmail, OperatorPhone } from "../_legal/operator";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — Birthday-Cake Loading Demo",
  description:
    "Datenschutzerklärung gemäß DSGVO für die Birthday-Cake Loading Demo von shiftbloom studio.",
};

export default function DatenschutzPage() {
  return (
    <main id="content" className="container">
      <div className="legalPage">
        <Link href="/" className="legalBack">
          ← Zurück zur Demo
        </Link>

        <h1 className="legalTitle">Datenschutzerklärung</h1>
        <p className="legalSubtitle">Stand: März 2026</p>

        {/* 1. Verantwortlicher */}
        <section className="legalSection">
          <h2>1. Verantwortlicher</h2>
          <OperatorAddress />
          <p>
            E-Mail: <OperatorEmail />
            <OperatorPhone />
          </p>
        </section>

        {/* 2. Überblick */}
        <section className="legalSection">
          <h2>2. Überblick der Verarbeitungen</h2>
          <p>
            Diese Datenschutzerklärung informiert Sie über die Art, den Umfang
            und den Zweck der Verarbeitung personenbezogener Daten innerhalb
            dieser Website. Diese Website ist eine technische Demo für die
            Open-Source-Bibliothek &bdquo;Birthday-Cake Loading&ldquo; und
            verarbeitet nur die für den Betrieb technisch notwendigen Daten.
          </p>
        </section>

        {/* 3. Rechtsgrundlagen */}
        <section className="legalSection">
          <h2>3. Rechtsgrundlagen</h2>
          <p>
            Die Verarbeitung personenbezogener Daten erfolgt auf Grundlage
            folgender Rechtsgrundlagen:
          </p>
          <ul>
            <li>
              <strong>
                Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse):
              </strong>{" "}
              Bereitstellung und Sicherstellung der technischen
              Funktionsfähigkeit der Website.
            </li>
            <li>
              <strong>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung):</strong> Sofern
              Sie eine Einwilligung erteilt haben, z.&thinsp;B. für optionale
              Funktionen.
            </li>
          </ul>
        </section>

        {/* 4. Hosting */}
        <section className="legalSection">
          <h2>4. Hosting</h2>
          <p>
            Diese Website wird bei <strong>Vercel Inc.</strong> (440 N Barranca
            Ave #4133, Covina, CA 91723, USA) gehostet. Vercel verarbeitet dabei
            Zugriffsdaten (IP-Adresse, Zeitpunkt des Zugriffs, angeforderte
            Seite, Browser-Typ) in Server-Logfiles. Die Verarbeitung erfolgt auf
            Grundlage unseres berechtigten Interesses an einer effizienten und
            sicheren Bereitstellung der Website (Art. 6 Abs. 1 lit. f DSGVO).
          </p>
          <p>
            Die Datenübermittlung in die USA erfolgt auf Basis des EU-US Data
            Privacy Framework. Weitere Informationen finden Sie in der{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noreferrer"
            >
              Datenschutzerklärung von Vercel
            </a>
            .
          </p>
        </section>

        {/* 5. Zugriffsdaten */}
        <section className="legalSection">
          <h2>5. Erfassung von Zugriffsdaten (Server-Logfiles)</h2>
          <p>
            Bei jedem Zugriff auf diese Website werden automatisch folgende
            Informationen erfasst:
          </p>
          <ul>
            <li>IP-Adresse des anfragenden Geräts</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>Name und URL der abgerufenen Seite</li>
            <li>Übertragene Datenmenge</li>
            <li>Browsertyp und -version</li>
            <li>Betriebssystem</li>
            <li>Referrer-URL (zuvor besuchte Seite)</li>
          </ul>
          <p>
            Diese Daten werden für die technische Bereitstellung der Website
            benötigt und nach spätestens 30 Tagen automatisch gelöscht. Eine
            Zusammenführung mit anderen Datenquellen findet nicht statt.
          </p>
        </section>

        {/* 6. Client Hints */}
        <section className="legalSection">
          <h2>6. Client Hints und Gerätedaten</h2>
          <p>
            Diese Demo-Website nutzt <strong>HTTP Client Hints</strong>{" "}
            (z.&thinsp;B. <code>Save-Data</code>, <code>Device-Memory</code>,{" "}
            <code>ECT</code>), um die Darstellung der Seite an die Fähigkeiten
            Ihres Geräts anzupassen (Progressive Enhancement). Diese Daten
            werden ausschließlich clientseitig im Browser verarbeitet und{" "}
            <strong>nicht an Server übertragen oder gespeichert</strong>. Es
            erfolgt kein Tracking oder Fingerprinting.
          </p>
        </section>

        {/* 7. Cookies */}
        <section className="legalSection">
          <h2>7. Cookies</h2>
          <p>
            Diese Website verwendet <strong>keine Cookies</strong> für Tracking-
            oder Analysezwecke. Es werden ausschließlich technisch notwendige
            Cookies verwendet, die für den Betrieb der Website erforderlich sind
            (z.&thinsp;B. Session-Handling durch den Hosting-Anbieter). Diese
            Cookies werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gesetzt.
          </p>
        </section>

        {/* 8. Keine Analysetools */}
        <section className="legalSection">
          <h2>8. Analyse- und Tracking-Tools</h2>
          <p>
            Diese Website verwendet{" "}
            <strong>keine Analyse- oder Tracking-Tools</strong> wie Google
            Analytics, Matomo oder ähnliche Dienste. Es findet kein
            Nutzer-Tracking statt.
          </p>
        </section>

        {/* 9. Externe Links */}
        <section className="legalSection">
          <h2>9. Links zu externen Websites</h2>
          <p>
            Diese Website enthält Links zu externen Seiten (z.&thinsp;B. GitHub,
            npm). Beim Anklicken dieser Links verlassen Sie unsere Website. Wir
            haben keinen Einfluss auf die Datenschutzpraktiken dieser externen
            Anbieter. Bitte informieren Sie sich direkt bei den jeweiligen
            Anbietern über deren Datenschutzbestimmungen.
          </p>
        </section>

        {/* 10. Betroffenenrechte */}
        <section className="legalSection">
          <h2>10. Ihre Rechte</h2>
          <p>Sie haben gemäß DSGVO folgende Rechte:</p>
          <ul>
            <li>
              <strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie können
              Auskunft über Ihre bei uns verarbeiteten personenbezogenen Daten
              verlangen.
            </li>
            <li>
              <strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Sie können
              die Berichtigung unrichtiger Daten verlangen.
            </li>
            <li>
              <strong>Löschungsrecht (Art. 17 DSGVO):</strong> Sie können die
              Löschung Ihrer Daten verlangen, sofern keine gesetzliche
              Aufbewahrungspflicht besteht.
            </li>
            <li>
              <strong>Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong>{" "}
              Sie können die Einschränkung der Verarbeitung Ihrer Daten
              verlangen.
            </li>
            <li>
              <strong>Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können
              verlangen, dass wir Ihnen Ihre Daten in einem maschinenlesbaren
              Format übermitteln.
            </li>
            <li>
              <strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie können der
              Verarbeitung Ihrer Daten jederzeit widersprechen.
            </li>
          </ul>
          <p>
            Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:{" "}
            <OperatorEmail />
          </p>
        </section>

        {/* 11. Beschwerderecht */}
        <section className="legalSection">
          <h2>11. Beschwerderecht bei einer Aufsichtsbehörde</h2>
          <p>
            Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
            über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
            Zuständig ist die Datenschutz-Aufsichtsbehörde am Sitz des Betreibers.
          </p>
          {operator.authority ? <p>{operator.authority}</p> : null}
        </section>

        {/* 12. Änderungen */}
        <section className="legalSection">
          <h2>12. Änderungen dieser Datenschutzerklärung</h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie
            stets den aktuellen rechtlichen Anforderungen entsprechen zu lassen
            oder um Änderungen unserer Leistungen umzusetzen. Für Ihren erneuten
            Besuch gilt dann die neue Datenschutzerklärung.
          </p>
        </section>

        <div className="legalFooter">
          <Link href="/impressum">Impressum</Link>
          {" • "}
          <Link href="/">Zurück zur Demo</Link>
        </div>
      </div>
    </main>
  );
}
