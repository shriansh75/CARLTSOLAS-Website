import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { privacyPage } from "@/content/pages/privacy";

export const metadata: Metadata = {
  title: privacyPage.meta.title,
  description: privacyPage.meta.description,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: privacyPage.meta.title,
    description: privacyPage.meta.description,
    url: "/privacy",
    type: "article",
  },
};

export default function PrivacyPage() {
  return <LegalPage content={privacyPage} breadcrumb="HOME / PRIVACY POLICY" />;
}
