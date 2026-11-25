// SPDX-License-Identifier: AGPL-3.0-or-later
import type { MetadataRoute } from "next";
import { siteUrl } from "./_lib/seo";

const url = (path: string) => new URL(path, siteUrl).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/imprint"), priority: 0.2, alternates: { languages: { de: url("/impressum") } } },
    { url: url("/impressum"), priority: 0.2, alternates: { languages: { en: url("/imprint") } } },
    { url: url("/privacy"), priority: 0.2, alternates: { languages: { de: url("/datenschutz") } } },
    { url: url("/datenschutz"), priority: 0.2, alternates: { languages: { en: url("/privacy") } } }
  ];
}
