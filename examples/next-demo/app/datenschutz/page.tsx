import type { Metadata } from "next";
import { pageMetadata } from "../_lib/seo";
import { LegalPage, OperatorAddress, OperatorEmail } from "../_legal/legal";
import { operator } from "../_legal/operator";

export const metadata: Metadata = pageMetadata({
  title: "Datenschutzerklärung",
  description: "Was die Birthday-Cake Loading Demo verarbeitet und warum.",
  path: "/datenschutz",
  languages: { en: "/privacy", de: "/datenschutz" },
  locale: "de_DE"
});

export default function DatenschutzPage() {
  return (
    <LegalPage lang="de" kind="privacy" title="Datenschutzerklärung">
      <section className="legalSection">
        <p>
          Diese Seite ist eine technische Demo der Open-Source-Bibliothek Birthday-Cake Loading. Es gibt keine
          Konten, keine Werbung, keine Analyse und kein Tracking. Hier steht, was beim Aufruf trotzdem verarbeitet
          wird.
        </p>
      </section>

      <section className="legalSection">
        <h2>Verantwortlicher</h2>
        <OperatorAddress lang="de" />
        <p>
          E-Mail: <OperatorEmail />
        </p>
      </section>

      <section className="legalSection">
        <h2>Hosting</h2>
        <p>
          Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA, liefert diese Seite in unserem Auftrag
          aus und betreibt den Worker, der sie rendert. Dazu verarbeitet Cloudflare deine IP-Adresse, die aufgerufene
          Seite, den Zeitpunkt und die Header, die dein Browser mitsendet, etwa den User-Agent. Ohne diese Daten kann
          die Seite nicht angezeigt werden.
        </p>
        <p>
          Anfragen an unseren Worker werden protokolliert, samt IP-Adresse, dem ungefähren Standort, den Cloudflare
          daraus ableitet, der aufgerufenen Adresse und den Request-Headern. Wir nutzen die Protokolle nur, um Fehler
          zu beheben und Missbrauch zu verhindern, und sie werden nach spätestens 7 Tagen gelöscht.
        </p>
        <p>
          Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren und zuverlässigen Betrieb (Art. 6 Abs. 1
          lit. f DSGVO). Cloudflare verarbeitet die Daten als unser Auftragsverarbeiter auf Grundlage eines
          Auftragsverarbeitungsvertrags (Art. 28 DSGVO). Cloudflare, Inc. ist nach dem EU-U.S. Data Privacy Framework
          zertifiziert, für das ein Angemessenheitsbeschluss der Europäischen Kommission besteht (Art. 45 DSGVO); der
          Vertrag enthält zusätzlich die EU-Standardvertragsklauseln. Mehr dazu in der{" "}
          <a href="https://www.cloudflare.com/de-de/privacypolicy/" target="_blank" rel="noreferrer">
            Datenschutzerklärung von Cloudflare
          </a>
          .
        </p>
      </section>

      <section className="legalSection">
        <h2>Schriften</h2>
        <p>
          Alle Schriften werden von dieser Domain ausgeliefert. Dein Browser kontaktiert keinen Schriftanbieter; unser
          Worker lädt die Dateien einmal und speichert sie zwischen.
        </p>
      </section>

      <section className="legalSection">
        <h2>Client Hints und Gerätesignale</h2>
        <p>
          Die Demo bittet deinen Browser um <strong>HTTP Client Hints</strong> (etwa <code>Save-Data</code>,{" "}
          <code>Device-Memory</code> oder <code>ECT</code>). Unterstützt dein Browser sie, sendet er sie bei der
          nächsten Anfrage mit, und der Worker wählt damit einmalig eine Start-Stufe für diese Seite. Im Browser liest
          die Bibliothek ähnliche Signale (Verbindungstyp, reduzierte Bewegung, Arbeitsspeicher), um zu entscheiden,
          welche Erweiterungen geladen werden. Nichts davon wird gespeichert, mit anderen Daten zusammengeführt oder
          genutzt, um dich wiederzuerkennen. Abgesehen von den oben beschriebenen Protokollen verlässt es die Seite
          nicht.
        </p>
      </section>

      <section className="legalSection">
        <h2>Cookies und Speicher</h2>
        <p>
          Die Seite setzt keine Cookies. Wenn du die Stufe im DevTools-Panel überschreibst, merkt sich dein Browser
          die Wahl im Session Storage, bis du den Tab schließt. Sie wird nie an uns übertragen. Das Speichern ist für
          die Funktion, die du nutzt, unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG).
        </p>
      </section>

      <section className="legalSection">
        <h2>Links zu anderen Seiten</h2>
        <p>
          Die Demo verlinkt auf GitHub und npm. Diese Anbieter erhalten erst Daten von dir, wenn du einem Link
          folgst, und verarbeiten sie nach ihren eigenen Datenschutzerklärungen.
        </p>
      </section>

      <section className="legalSection">
        <h2>Deine Rechte</h2>
        <p>
          Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung
          der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und auf Widerspruch gegen Verarbeitungen, die auf
          berechtigtem Interesse beruhen (Art. 21). Schreib uns dazu an <OperatorEmail />.
        </p>
        <p>
          Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren
          {operator.authority ? <>, zum Beispiel bei {operator.authority}</> : null}.
        </p>
      </section>
    </LegalPage>
  );
}
