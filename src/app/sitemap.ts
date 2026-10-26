import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site-url";

import { workshops } from "@/data/workshops";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${siteOrigin}/`, changeFrequency: "monthly", priority: 1 }, ...workshops.map(({ slug }) => ({ url: `${siteOrigin}/workshops/${slug}/`, changeFrequency: "monthly" as const, priority: 0.7 }))];
}
