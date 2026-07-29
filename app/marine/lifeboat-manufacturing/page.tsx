import type { Metadata } from "next";
import { MarinePage } from "@/components/marine/MarinePage";
import { lifeboatManufacturingPage } from "@/content/pages/marine-lifeboat-manufacturing";
import { breadcrumbLd, serviceLd } from "@/lib/structuredData";

const PATH = "/marine/lifeboat-manufacturing";

export const metadata: Metadata = {
  title: lifeboatManufacturingPage.meta.title,
  description: lifeboatManufacturingPage.meta.description,
  alternates: { canonical: PATH },
  openGraph: {
    title: lifeboatManufacturingPage.meta.title,
    description: lifeboatManufacturingPage.meta.description,
    url: PATH,
    type: "website",
  },
};

export default function LifeboatManufacturing() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceLd({
              name: "Lifeboat and Survival Craft Manufacturing",
              description: lifeboatManufacturingPage.meta.description,
              path: PATH,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbLd([
              { name: "Marine", path: "/marine" },
              { name: "Lifeboat Manufacturing", path: PATH },
            ]),
          ),
        }}
      />
      <MarinePage content={lifeboatManufacturingPage} />
    </>
  );
}
