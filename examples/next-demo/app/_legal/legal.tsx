import Link from "next/link";
import type { ReactNode } from "react";
import { isConfigured, operator, type Lang } from "./operator";

export const UPDATED: Record<Lang, string> = {
  en: "Last updated 25 November 2026",
  de: "Stand: 25. November 2026"
};

const LINKS = {
  imprint: { en: "/imprint", de: "/impressum" },
  privacy: { en: "/privacy", de: "/datenschutz" }
} as const;

export function OperatorAddress({ lang }: { lang: Lang }) {
  if (!isConfigured) {
    return (
      <p className="legalWarn">
        {lang === "de"
          ? "Die Angaben zum Betreiber sind noch nicht eingetragen (OPERATOR_* in der Build-Konfiguration)."
          : "The operator details have not been configured yet (OPERATOR_* build settings)."}
      </p>
    );
  }
  const lines = [operator.name, operator.business, operator.street, operator.city, operator.country[lang]].filter(
    Boolean
  ) as string[];
  return (
    <address className="legalAddress">
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          <br />
        </span>
      ))}
    </address>
  );
}

export function OperatorEmail() {
  return operator.email ? <a href={`mailto:${operator.email}`}>{operator.email}</a> : null;
}

export function OperatorPhone({ lang }: { lang: Lang }) {
  if (!operator.phone) return null;
  return (
    <>
      <br />
      {lang === "de" ? "Telefon" : "Phone"}:{" "}
      <a href={`tel:${operator.phone.replace(/[^\d+]/g, "")}`}>{operator.phone}</a>
    </>
  );
}

export function LegalPage({
  lang,
  kind,
  title,
  children
}: {
  lang: Lang;
  kind: "imprint" | "privacy";
  title: string;
  children: ReactNode;
}) {
  const other: Lang = lang === "de" ? "en" : "de";
  const otherKind = kind === "imprint" ? "privacy" : "imprint";
  return (
    <main id="content" className="container" lang={lang}>
      <div className="legalPage">
        <div className="legalTop">
          <Link href="/" className="legalBack">
            {lang === "de" ? "← Zurück zur Demo" : "← Back to the demo"}
          </Link>
          <Link href={LINKS[kind][other]} hrefLang={other} className="legalBack">
            {other === "de" ? "Deutsch" : "English"}
          </Link>
        </div>

        <h1 className="legalTitle">{title}</h1>
        <p className="legalSubtitle">{UPDATED[lang]}</p>

        {children}

        <div className="legalFooter">
          <Link href={LINKS[otherKind][lang]}>
            {otherKind === "privacy"
              ? lang === "de"
                ? "Datenschutzerklärung"
                : "Privacy policy"
              : lang === "de"
                ? "Impressum"
                : "Imprint"}
          </Link>
          {" • "}
          <Link href="/">{lang === "de" ? "Zurück zur Demo" : "Back to the demo"}</Link>
        </div>
      </div>
    </main>
  );
}
