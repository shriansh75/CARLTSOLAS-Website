import type { Metadata, Viewport } from "next";
import { generalSans, jetbrainsMono } from "@/lib/fonts";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CARLTSOLAS Engineering | Marine & Maritime Engineering",
    template: "%s · CARLTSOLAS Engineering",
  },
  description:
    "CARLTSOLAS Engineering is the technology-driven growth subsidiary of SOLAS MODU Marine Services. Marine and maritime engineering for India's next industrial decade.",
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
  openGraph: {
    title: "CARLTSOLAS Engineering",
    description: "Marine and maritime engineering for India's next industrial decade.",
    siteName: "CARLTSOLAS Engineering",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#081020",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${generalSans.variable} ${jetbrainsMono.variable} is-loading`}>
      <body>
        <noscript>
          <style>{`html.is-loading, html.is-loading body { overflow: auto !important; height: auto !important; } [role="status"][aria-label^="Loading"] { display: none !important; }`}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
