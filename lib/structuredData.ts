import { SITE_URL, absoluteUrl } from "@/lib/siteUrl";

/**
 * schema.org builders for route-level structured data.
 *
 * The site-wide `Organization` node lives in `app/layout.tsx`; these helpers add
 * per-route `Service` and `BreadcrumbList` nodes. Every value is authored
 * locally, so `JSON.stringify` output is safe to inline (and the CSP already
 * allows inline scripts, so no header change is needed).
 *
 * Keep claims conservative: a Service node states what is offered and who
 * provides it, never a credential the business does not hold.
 */

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function serviceLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    serviceType: name,
    provider: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "CARLTSOLAS Engineering Private Limited",
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };
}

/**
 * Breadcrumb trail. Home is prepended automatically, so pass only the
 * route's own ancestry, deepest last.
 */
export function breadcrumbLd(trail: { name: string; path: string }[]) {
  const items = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
