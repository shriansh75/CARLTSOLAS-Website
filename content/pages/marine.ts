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
  heroImage: {
    // NOTE the filename: /images/* is immutable for a year, so an image whose
    // content changes must take a NEW path. Overwriting a path in place served
    // stale bytes to every returning visitor.
    webp: "/images/marine/hero-oilgas.webp",
    jpg: "/images/marine/hero-oilgas.jpg",
    alt: "An offshore oil and gas production platform at twilight, its flare boom to one side and a walkway bridge running out across the water.",
  },
  introImage: {
    webp: "/images/marine/marine-intro.webp",
    jpg: "/images/marine/marine-intro.jpg",
    alt: "Two offshore crew in survival coveralls at the rail of a platform, looking out over the sea.",
  },
  // Five images, not four. The bento is a 4x2 grid whose feature tile spans
  // 2x2, so four entries left the bottom-right cell empty and it rendered as a
  // pale hairline rectangle. Five fill it exactly.
  feature: {
    images: [
      {
        webp: "/images/marine/mo-rig-sunset.webp",
        jpg: "/images/marine/mo-rig-sunset.jpg",
        alt: "A jack-up drilling rig standing on its legs at sunset, a supply vessel on the horizon.",
      },
      {
        webp: "/images/marine/mo-confined-space.webp",
        jpg: "/images/marine/mo-confined-space.jpg",
        alt: "A technician in a gas-tight suit and breathing apparatus entering a tank hatch on deck.",
      },
      {
        webp: "/images/marine/mo-ultrasonic.webp",
        jpg: "/images/marine/mo-ultrasonic.jpg",
        alt: "An ultrasonic flaw detector and probe in use on a steel plate.",
      },
      {
        webp: "/images/marine/mo-co2-bank.webp",
        jpg: "/images/marine/mo-co2-bank.jpg",
        alt: "A bank of CO2 cylinders strapped in their frame with the actuation manifold above.",
      },
      {
        // Published with the individual's consent on file. The alt text names
        // nobody: there is no reason to put an employee's name in page source.
        webp: "/images/marine/mo-crew-night.webp",
        jpg: "/images/marine/mo-crew-night.jpg",
        alt: "A SOLAS MODU technician on an offshore structure at night.",
      },
    ],
    caption: "NON-DESTRUCTIVE TESTING · THICKNESS MEASUREMENT · WELD AND COATING INSPECTION",
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
