import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { termsPage } from "@/content/pages/terms";

export const metadata: Metadata = {
  title: termsPage.meta.title,
  description: termsPage.meta.description,
  alternates: { canonical: "/terms" },
  openGraph: {
    title: termsPage.meta.title,
    description: termsPage.meta.description,
    url: "/terms",
    type: "article",
  },
};

export default function TermsPage() {
  return <LegalPage content={termsPage} breadcrumb="HOME / TERMS & CONDITIONS" />;
}
