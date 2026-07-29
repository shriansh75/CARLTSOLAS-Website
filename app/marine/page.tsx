import type { Metadata } from "next";
import { MarinePage } from "@/components/marine/MarinePage";
import { marinePage } from "@/content/pages/marine";
import { breadcrumbLd, serviceLd } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: marinePage.meta.title,
  description: marinePage.meta.description,
  alternates: { canonical: "/marine" },
  openGraph: {
    title: marinePage.meta.title,
    description: marinePage.meta.description,
    url: "/marine",
    type: "website",
  },
};

export default function Marine() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceLd({
              name: "Marine and Maritime Services",
              description: marinePage.meta.description,
              path: "/marine",
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd([{ name: "Marine", path: "/marine" }])),
        }}
      />
      <MarinePage content={marinePage} />
    </>
  );
}
