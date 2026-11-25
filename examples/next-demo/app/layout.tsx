import type { Metadata } from "next";
import "./styles.css";
import { Providers } from "./providers";
import { homeDescription, homeTitle, siteName, siteUrl, socialImage, structuredData, studioName, studioUrl } from "./_lib/seo";
import { headers } from "next/headers";
import {
  getServerCakeBootstrapFromHeaders,
  getServerFeatures
} from "@shiftbloom-studio/birthday-cake-loading/server";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: homeTitle, template: `%s · ${siteName}` },
  description: homeDescription,
  applicationName: `${siteName} demo`,
  authors: [{ name: studioName, url: studioUrl }],
  publisher: studioName,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    type: "website",
    siteName,
    locale: "en_US",
    url: "/",
    title: homeTitle,
    description: homeDescription,
    images: [socialImage]
  },
  twitter: { card: "summary_large_image", title: homeTitle, description: homeDescription, images: [socialImage.url] }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const bootstrap = getServerCakeBootstrapFromHeaders(headerList);
  const features = getServerFeatures(bootstrap.tier, bootstrap.signals);

  return (
    <html
      lang="en"
      data-bcl-ready="true"
      data-bcl-tier={bootstrap.tier}
      data-bcl-motion={String(features.motion)}
      data-bcl-smooth-scroll={String(features.smoothScroll)}
      data-bcl-audio={String(features.audio)}
      data-bcl-privacy={String(features.privacyBanner)}
      data-bcl-rich-images={String(features.richImages)}
      data-bcl-save-data={String(Boolean(bootstrap.signals.saveData))}
      data-bcl-ect={bootstrap.signals.effectiveType}
      suppressHydrationWarning
    >
      <head>
        <link rel="stylesheet" href="/fonts/brand.css" />
      </head>
      <body>
        <script
          type="application/ld+json"
          // Static strings only; "<" is escaped so the JSON can never close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()).replace(/</g, "\\u003c") }}
        />
        <a className="skipLink" href="#content">
          Skip to content
        </a>
        <Providers bootstrap={bootstrap}>{children}</Providers>
      </body>
    </html>
  );
}
