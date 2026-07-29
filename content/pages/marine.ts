import type { ServicePageContent } from "@/content/types";

/**
 * Marine landing page. Explains the two-company delivery model and routes to
 * the individual services. Every claim here is drawn from the investor deck,
 * public SOLAS MODU material, or documents held on file.
 */
export const marinePage: ServicePageContent = {
  meta: {
    title: "Marine",
    description:
      "Marine and maritime services from CARLTSOLAS Engineering, delivered with SOLAS MODU Marine Services: flag State inspections for registries, and a lifeboat manufacturing initiative for India.",
  },
  breadcrumb: "HOME / MARINE",
  eyebrow: "MAR / MARINE",
  heading: "Marine services, delivered with SOLAS MODU.",
  lede:
    "CARLTSOLAS is a technology company built on a marine engineering foundation. Where a project calls for marine and maritime work, we deliver it together with SOLAS MODU Marine Services.",
  schematic: "bodyPlan",
  heroImage: {
    webp: "/images/marine/marine-overview.webp",
    jpg: "/images/marine/marine-overview.jpg",
    alt: "Crew testing a fire main on the deck of an offshore support vessel, seen from above, with an enclosed lifeboat stowed alongside.",
  },

  intro: {
    eyebrow: "MAR 00.1 / THE MODEL",
    heading: "One commercial relationship, two companies behind it.",
    paragraphs: [
      "CARLTSOLAS Engineering Private Limited manages the commercial engagement: scope, scheduling, reporting and the client relationship.",
      "SOLAS MODU Marine Services Private Limited provides the operational and technical execution, with the approvals, attending surveyors and offshore record the work requires.",
      "For a client or an administration that means a single point of contact, with a certified marine services business standing behind it.",
    ],
    chips: ["FLAG STATE INSPECTION", "SURVIVAL CRAFT", "OFFSHORE SINCE 2013", "MUMBAI"],
  },

  services: {
    eyebrow: "MAR 00.2 / SERVICES",
    heading: "Two marine services, open for engagement.",
    lede:
      "One is delivered today for a ship registry. The other is a declared initiative we are building partners and approvals around.",
    items: [
      {
        title: "Flag State Inspections",
        summary:
          "Independent, convention-wide inspection of ships flying your flag, reported in a form your administration can act on. Delivered by surveyors qualified to the standard registries specify, under certified management systems.",
        href: "/marine/flag-state-inspections",
        meta: "FOR FLAG ADMINISTRATIONS",
      },
      {
        title: "Lifeboat Manufacturing",
        summary:
          "An initiative to manufacture SOLAS survival craft in India, built on more than a decade of servicing, load testing and certifying the boats and davits other people made. Seeking partners, approvals and capital.",
        href: "/marine/lifeboat-manufacturing",
        meta: "DEVELOPMENT STAGE",
      },
    ],
  },

  cta: {
    eyebrow: "MAR 00.3 / CONTACT",
    heading: "Tell us what the project needs.",
    body:
      "Whether you are a registry looking for inspection coverage, an operator with survival craft due for service, or a partner interested in manufacturing, the same address reaches us.",
    primary: { label: "Get in touch", href: "mailto:office@solasmodu.net" },
    secondary: { label: "Explore technology", href: "/#technology" },
  },
};
