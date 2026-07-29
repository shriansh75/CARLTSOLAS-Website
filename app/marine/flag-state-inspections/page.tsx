import type { Metadata } from "next";
import { MarinePage } from "@/components/marine/MarinePage";
import { flagStateInspectionsPage } from "@/content/pages/marine-flag-state-inspections";
import { breadcrumbLd, serviceLd } from "@/lib/structuredData";

const PATH = "/marine/flag-state-inspections";

export const metadata: Metadata = {
  title: flagStateInspectionsPage.meta.title,
  description: flagStateInspectionsPage.meta.description,
  alternates: { canonical: PATH },
  openGraph: {
    title: flagStateInspectionsPage.meta.title,
    description: flagStateInspectionsPage.meta.description,
    url: PATH,
    type: "website",
  },
};

export default function FlagStateInspections() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceLd({
              name: "Flag State Inspections",
              description: flagStateInspectionsPage.meta.description,
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
              { name: "Flag State Inspections", path: PATH },
            ]),
          ),
        }}
      />
      <MarinePage content={flagStateInspectionsPage} />
    </>
  );
}
