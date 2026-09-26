import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${siteOrigin}/`, changeFrequency: "monthly", priority: 1 }];
}
