const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const productionUrl = new URL(configured || "https://www.hackistan.club/");

if (productionUrl.protocol !== "https:" || productionUrl.pathname !== "/" || productionUrl.search || productionUrl.hash) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTPS origin without a path, query, or hash.");
}

export const siteOrigin = productionUrl.origin;
