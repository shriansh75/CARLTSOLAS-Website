/**
 * Security headers, also mirrored in `public/_headers` for Cloudflare Pages.
 * CSP uses 'unsafe-inline' because the current static build has no per-request
 * nonce (Next injects inline bootstrap scripts and next/font injects inline
 * styles). Tightening to nonce-based CSP is a future step that needs SSR
 * middleware. Do not remove entries without checking the site still renders.
 */
// Next.js dev mode relies on eval (HMR runtime, dev source maps) and a websocket,
// which a strict CSP blocks. Relax those in development only; the production CSP
// below is unchanged (no 'unsafe-eval', no ws:, keeps upgrade-insecure-requests).
const isDev = process.env.NODE_ENV !== "production";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "media-src 'self' blob:",
      "font-src 'self'",
      `connect-src 'self'${isDev ? " ws:" : ""}`,
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      ...(isDev ? [] : ["upgrade-insecure-requests"]),
    ].join("; "),
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // hide implementation details from the public surface
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  // the site uses no next/image (plain video + inline SVG), so skip any host
  // image optimizer for deploy-portability (Vercel, Cloudflare, static)
  images: { unoptimized: true },
  compiler: {
    // strip console.* in production (keep console.error) to reduce info leakage
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  async headers() {
    // Everything under /fonts, /images and /video is content-addressed BY
    // CONVENTION: an asset whose bytes change ships under a new filename. That
    // rule is already enforced socially (replacing marine-overview.* in place
    // served the old photograph to every returning visitor for a day, and the
    // fix was to rename it marine-rig.*), so the honest cache policy is
    // `immutable` rather than a daily revalidation of a ~28 MB video.
    //
    // `immutable` means a revisit re-fetches NOTHING and does not even send a
    // conditional request. It is also what makes the shortened repeat-visit
    // preloader honest: there is no point compressing the loader to 2.2s if the
    // hero video behind it is being revalidated on every load.
    //
    // The corollary is strict: NEVER change an asset's bytes at an existing
    // path. A stale copy now persists for a year, not a day.
    const immutableCache = "public, max-age=31536000, immutable";
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: immutableCache }] },
      { source: "/video/:path*", headers: [{ key: "Cache-Control", value: immutableCache }] },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: immutableCache }] },
    ];
  },
};

export default nextConfig;
