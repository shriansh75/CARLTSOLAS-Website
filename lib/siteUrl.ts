/**
 * Canonical production origin, used for metadataBase, canonical URLs, the
 * sitemap and absolute Open Graph image URLs.
 *
 * Resolution order, so no manual environment variable is required on Vercel:
 *   1. NEXT_PUBLIC_SITE_URL   set this once a custom domain is live
 *   2. NEXT_PUBLIC_VERCEL_URL injected automatically by Vercel per deployment
 *   3. localhost              local development
 *
 * Pointing the site at a real domain later is a one-line change (step 1).
 */
const FALLBACK_ORIGIN = "http://localhost:3000";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;

  return FALLBACK_ORIGIN;
}

export const SITE_URL = resolveSiteUrl();

/** Absolute URL for a site-relative path, e.g. absoluteUrl("/privacy"). */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}
