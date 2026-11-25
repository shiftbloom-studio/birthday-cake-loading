import type { Metadata } from "next";
import { pageMetadata } from "../_lib/seo";
import { LegalPage, OperatorAddress, OperatorEmail } from "../_legal/legal";
import { operator } from "../_legal/operator";

export const metadata: Metadata = pageMetadata({
  title: "Privacy policy",
  description: "What the Birthday-Cake Loading demo processes and why.",
  path: "/privacy",
  languages: { en: "/privacy", de: "/datenschutz" },
  locale: "en_US"
});

export default function PrivacyPage() {
  return (
    <LegalPage lang="en" kind="privacy" title="Privacy policy">
      <section className="legalSection">
        <p>
          This site is a technical demo of the open-source library Birthday-Cake Loading. There are no accounts, no
          ads, no analytics and no tracking. This policy explains the little that is processed when you open it.
        </p>
      </section>

      <section className="legalSection">
        <h2>Controller</h2>
        <OperatorAddress lang="en" />
        <p>
          Email: <OperatorEmail />
        </p>
      </section>

      <section className="legalSection">
        <h2>Hosting</h2>
        <p>
          Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA, delivers this site on our behalf and runs
          the Worker that renders it. To do that, Cloudflare processes your IP address, the page you request, the time
          and the headers your browser sends, such as the user agent. Without this data the page can&apos;t be shown.
        </p>
        <p>
          Requests to our Worker are logged, including the IP address, the approximate location Cloudflare derives
          from it, the requested address and the request headers. We use these logs only to fix errors and prevent
          abuse, and they are deleted after 7 days at the latest.
        </p>
        <p>
          The legal basis is our legitimate interest in running the site securely and reliably (Art. 6(1)(f) GDPR).
          Cloudflare acts as our processor under a data processing agreement (Art. 28 GDPR). Cloudflare, Inc. is
          certified under the EU-U.S. Data Privacy Framework, which is covered by an adequacy decision of the European
          Commission (Art. 45 GDPR); the agreement also includes the EU Standard Contractual Clauses. See{" "}
          <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer">
            Cloudflare&apos;s privacy policy
          </a>{" "}
          for details.
        </p>
      </section>

      <section className="legalSection">
        <h2>Fonts</h2>
        <p>
          All fonts are served from this domain. Your browser does not contact a font provider; our Worker fetches the
          files once and caches them.
        </p>
      </section>

      <section className="legalSection">
        <h2>Client Hints and device signals</h2>
        <p>
          The demo asks your browser for <strong>HTTP Client Hints</strong> (for example <code>Save-Data</code>,{" "}
          <code>Device-Memory</code> or <code>ECT</code>). If your browser supports them, it sends them with the next
          request, and the Worker uses them once to pick a starting tier for that page. In the browser, the library
          reads similar signals (connection type, reduced motion, memory) to decide which enhancements to load. None
          of this is stored, combined with other data or used to recognise you. Apart from the request logs described
          above, it never leaves the page.
        </p>
      </section>

      <section className="legalSection">
        <h2>Cookies and storage</h2>
        <p>
          The site sets no cookies. If you override the tier with the DevTools panel, your choice is kept in your
          browser&apos;s session storage until you close the tab. It is never sent to us. Storing it is strictly
          necessary for the feature you asked for (§ 25(2) no. 2 TDDDG).
        </p>
      </section>

      <section className="legalSection">
        <h2>Links to other sites</h2>
        <p>
          The demo links to GitHub and npm. They only receive data from you once you follow a link, under their own
          privacy policies.
        </p>
      </section>

      <section className="legalSection">
        <h2>Your rights</h2>
        <p>
          You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of
          processing (Art. 18), data portability (Art. 20) and the right to object to processing based on legitimate
          interests (Art. 21). To use them, email <OperatorEmail />.
        </p>
        <p>
          You can also complain to a data protection supervisory authority
          {operator.authority ? <>, for example {operator.authority}</> : null}.
        </p>
      </section>
    </LegalPage>
  );
}
