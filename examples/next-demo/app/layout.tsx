import type { Metadata } from "next";
import "./styles.css";
import { Providers } from "./providers";
import { headers } from "next/headers";
import {
  getServerCakeBootstrapFromHeaders,
  getServerFeatures
} from "@shiftbloom-studio/birthday-cake-loading/server";

export const metadata: Metadata = {
  title: "Birthday-Cake Loading — Next.js Demo",
  description: "Capability-first progressive enhancement demo for @shiftbloom-studio/birthday-cake-loading."
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
      <body>
        <a className="skipLink" href="#content">
          Skip to content
        </a>
        <Providers bootstrap={bootstrap}>{children}</Providers>
      </body>
    </html>
  );
}
