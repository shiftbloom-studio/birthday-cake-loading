// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Metadata } from "next";

export const siteName = "Birthday-Cake Loading";
export const studioName = "shiftbloom studio";
export const studioUrl = "https://shiftbloom.studio";
export const repoUrl = "https://github.com/shiftbloom-studio/birthday-cake-loading";
export const npmUrl = "https://www.npmjs.com/package/@shiftbloom-studio/birthday-cake-loading";

export const homeTitle = "Birthday-Cake Loading · Progressive enhancement by device tier for React";
export const homeDescription =
  "A page that checks what your device can handle before it adds anything. Live demo of @shiftbloom-studio/birthday-cake-loading, the React and Next.js library that picks a tier from Save-Data, memory, CPU and network.";

export const socialImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Birthday-Cake Loading: base, lite, rich and ultra tiers stacked like cake layers"
};

export const siteUrl = resolveSiteUrl();

/** Per-page metadata with a self-referencing canonical, hreflang pair and social tags. */
export function pageMetadata({
  title,
  description,
  path,
  languages,
  locale = "en_US"
}: {
  title: string;
  description: string;
  path: string;
  languages?: { en: string; de: string };
  locale?: "en_US" | "de_DE";
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
      ...(languages ? { languages: { en: languages.en, de: languages.de, "x-default": languages.en } } : {})
    },
    openGraph: { title, description, url: path, locale, siteName, type: "website", images: [socialImage] },
    twitter: { card: "summary_large_image", title, description, images: [socialImage.url] }
  };
}

/** schema.org graph: the npm package, the demo site and the publisher. */
export function structuredData() {
  const home = siteUrl.toString();
  const org = { "@id": `${studioUrl}/#org` };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareSourceCode",
        "@id": `${home}#library`,
        name: siteName,
        alternateName: "@shiftbloom-studio/birthday-cake-loading",
        description:
          "Capability-first progressive enhancement for React and Next.js. Reads Save-Data, reduced-motion, device memory, CPU cores and network quality, assigns a tier (base, lite, rich, ultra) and renders or lazy-loads layers only when the device can afford them.",
        url: home,
        codeRepository: repoUrl,
        programmingLanguage: "TypeScript",
        runtimePlatform: "React, Next.js",
        license: "https://www.gnu.org/licenses/agpl-3.0.html",
        sameAs: [repoUrl, npmUrl],
        publisher: org
      },
      { "@type": "WebSite", "@id": `${home}#site`, name: `${siteName} demo`, url: home, inLanguage: "en", publisher: org },
      { "@type": "Organization", "@id": org["@id"], name: studioName, url: studioUrl }
    ]
  };
}

function resolveSiteUrl() {
  const fallback = "https://birthday-cake.shiftbloom.studio";
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.BCL_DEMO_HOSTNAME)?.trim();
  if (!raw) return new URL(fallback);
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return new URL(fallback);
  }
}
