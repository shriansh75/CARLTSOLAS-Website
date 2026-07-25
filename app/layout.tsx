import type { Metadata, Viewport } from "next";
import { generalSans, jetbrainsMono } from "@/lib/fonts";
import { Providers } from "@/components/providers/Providers";
import { SITE_URL, absoluteUrl } from "@/lib/siteUrl";
import { site } from "@/content/site";
import "./globals.css";

const DESCRIPTION =
  "CARLTSOLAS Engineering is the technology-driven growth subsidiary of SOLAS MODU Marine Services. Marine and maritime engineering for India's next industrial decade.";

export const metadata: Metadata = {
  // Absolute-URL base for canonicals and the Open Graph image. Resolves to the
  // Vercel deployment URL until a custom domain is set (see lib/siteUrl.ts).
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CARLTSOLAS Engineering | Marine & Maritime Engineering",
    template: "%s · CARLTSOLAS Engineering",
  },
  description: DESCRIPTION,
  applicationName: "CARLTSOLAS Engineering",
  authors: [{ name: "CARLTSOLAS Engineering Private Limited" }],
  keywords: [
    "marine engineering",
    "offshore",
    "NDT",
    "survey",
    "SOLAS",
    "MODU",
    "SOLAS MODU",
    "CARLTSOLAS",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "CARLTSOLAS Engineering",
    description: "Marine and maritime engineering for India's next industrial decade.",
    siteName: "CARLTSOLAS Engineering",
    url: "/",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CARLTSOLAS Engineering",
    description: "Marine and maritime engineering for India's next industrial decade.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#081020",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * Organization structured data. Every claim here is drawn from the investor deck
 * or public SOLAS MODU material: no founding dates, registry details or personal
 * contacts, and the business address/email only.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CARLTSOLAS Engineering Private Limited",
  alternateName: "CARLTSOLAS",
  url: SITE_URL,
  logo: absoluteUrl("/icon.svg"),
  image: absoluteUrl("/opengraph-image.jpg"),
  description: DESCRIPTION,
  email: site.footer.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mumbai",
    addressCountry: "IN",
  },
  parentOrganization: {
    "@type": "Organization",
    name: "SOLAS MODU Marine Services",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${generalSans.variable} ${jetbrainsMono.variable} is-loading`}>
      <body>
        <noscript>
          <style>{`html.is-loading, html.is-loading body { overflow: auto !important; height: auto !important; } [role="status"][aria-label^="Loading"] { display: none !important; }`}</style>
        </noscript>
        <script
          type="application/ld+json"
          // Static, locally-authored object: no user input is ever interpolated here.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
