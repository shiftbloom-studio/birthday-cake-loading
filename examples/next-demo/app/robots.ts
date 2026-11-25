// SPDX-License-Identifier: AGPL-3.0-or-later
import type { MetadataRoute } from "next";
import { siteUrl } from "./_lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl).toString()
  };
}
