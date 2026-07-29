/**
 * Single source of on-site copy. Every string here is drawn from the CARLTSOLAS
 * investor presentation (the source of truth) or public SOLAS MODU material.
 * No external affiliations or inferred content.
 */
export const site = {
  wordmark: { primary: "CARLTSOLAS", secondary: "ENGINEERING" },
  group: "A SOLAS MODU GROUP COMPANY",
  coords: "19.076°N / 72.877°E · MUMBAI",
  drawing: {
    no: "CE-26-001",
    sheet: "01 / 19",
    title: "HULL LINES · BODY PLAN · CONCEPT",
    disciplines: "MARINE · OFFSHORE · TECHNOLOGY",
  },

  heroVideo: {
    poster: "/video/hero-poster.jpg",
    posterWebp: "/video/hero-poster.webp",
    durationMs: 15040,
    crossfadeMs: 600,
    // Desktop / fine-pointer: the ~1080p video below. Handheld / touch devices
    // get this still instead of the heavy video (poster-only mobile hero).
    mobilePoster: {
      webp: "/video/hero-mobile.webp",
      jpg: "/video/hero-mobile.jpg",
    },
    sources: {
      webm: "/video/hero.webm",
      mp4: "/video/hero.mp4",
    },
  },

  // Hash entries scroll to a home-page section; entries starting with "/" are
  // real routes and are client-navigated (see Header.onNav / MobileMenu.go).
  // `children` turns an entry into a dropdown: the parent link still navigates,
  // while a caret button discloses the children (Header) or expands them in
  // place (MobileMenu). Children are routes, so they take the same isRoute()
  // branch and never reach Lenis.
  nav: [
    { label: "Company", href: "#company" },
    { label: "Technology", href: "#technology" },
    {
      label: "Marine",
      href: "/marine",
      children: [
        { label: "Marine Overview", href: "/marine" },
        { label: "Flag State Inspections", href: "/marine/flag-state-inspections" },
        { label: "Lifeboat Manufacturing", href: "/marine/lifeboat-manufacturing" },
      ],
    },
    { label: "Capabilities", href: "#capabilities" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    eyebrow: "TECHNOLOGY · MARINE · MARITIME",
    tagline: "Marine engineering and modern software, built for the next industrial decade.",
    scroll: "SCROLL",
  },

  positioning: {
    eyebrow: "THE COMPANY",
    heading:
      "CARLTSOLAS is a technology-driven company, built on the marine engineering foundation of SOLAS MODU and serving the maritime sector and the wider software industry.",
    body:
      "SOLAS MODU Marine Services provides the proven marine and maritime engineering foundation. CARLTSOLAS builds on it as a technology company, delivering digital products, custom software and automation for businesses in any sector, while continuing to leverage SOLAS MODU’s marine expertise and network where it applies.",
    parent: { name: "SOLAS MODU MARINE SERVICES", meta: "MARINE & MARITIME SERVICES · SINCE 2013" },
    child: { name: "CARLTSOLAS ENGINEERING", meta: "TECHNOLOGY COMPANY · SOFTWARE + MARINE + SUPPLY" },
    pillars: [
      { no: "01", title: "Technology & Software", body: "Digital products, custom software and business automation for organizations in any industry." },
      { no: "02", title: "Marine Engineering", body: "SOLAS MODU’s surveys, NDT, survival systems and project management, delivered in collaboration." },
      { no: "03", title: "Equipment Sourcing", body: "Sourcing and supply of maritime safety equipment through the group’s network." },
    ],
  },

  technology: {
    eyebrow: "TECHNOLOGY",
    heading:
      "Production-ready software for the maritime sector and the wider software industry.",
    lede:
      "CARLTSOLAS engineers software and digital products end to end, from the systems that run a business to advanced, user-facing applications. Built to a professional standard for organizations that need more than off-the-shelf tools.",
    offerings: [
      {
        title: "Business Automation & Custom Software",
        body: "Custom software, automated workflows and internal systems tailored to how your organization runs. Modernize operations with scalable, cost-effective technology, with no in-house engineering team required.",
      },
      {
        title: "Digital Product Engineering",
        body: "Bespoke digital products engineered for scale and craft: web applications, custom platforms, dashboards, enterprise interfaces, and AI-powered, immersive experiences. Advanced software built to a standard that generic tools and templates cannot reach.",
      },
    ],
    cta: "Start a project",
  },

  capabilities: {
    eyebrow: "THE SOLAS MODU FOUNDATION",
    heading:
      "A decade of SOLAS MODU engineering for ships, rigs, platforms and yards, under SOLAS, MODU Code and Class requirements.",
    lede:
      "SOLAS, Safety of Life at Sea. MODU, Mobile Offshore Drilling Unit. Since 2013, SOLAS MODU Marine Services has delivered safety, compliance and integrity across ships, rigs, platforms and shipyards. This proven expertise is the marine foundation CARLTSOLAS builds on.",
    lines: [
      { id: "S.01", title: "Surveys & Certifications", scope: "Class and flag State survey attendance, statutory certification support and management system audits." },
      { id: "S.02", title: "Advanced NDT", scope: "UT, MPI, DP, radiography, LRUT and PAUT for hulls, pipelines, cranes and plant integrity." },
      { id: "S.03", title: "Survival Systems", scope: "Servicing, load testing and certification of lifeboats, liferafts, HRUs, davits and immersion suits." },
      { id: "S.04", title: "Project Management", scope: "New construction, repair, drydocking and offshore asset management, from contract to closeout." },
    ],
    marquee: ["UT", "LRUT", "PAUT", "MPI", "DP", "RADIOGRAPHY", "HARDNESS", "LSA", "FFA", "HRU", "IMMERSION SUITS", "DAVITS"],
    // Every badge must be a CURRENT, third-party credential. Removed here:
    // "2 FLAGS · ZMA · SKANREG" (the St Kitts appointment expired 26 Jun 2026
    // and Zanzibar was a spent, vessel-specific 2022 authorisation, so no
    // registry is named anywhere on the site), and "IADC ASSOCIATE MEMBER"
    // (latest membership on file is 2019). See docs/solas-modu-capability-record.md.
    badges: [
      { k: "TRIPLE ISO", v: "9001 · 14001 · 45001" },
      { k: "ABS", v: "RECOGNIZED SERVICE SUPPLIER" },
      { k: "IRS", v: "APPROVED SERVICE SUPPLIER" },
      { k: "SINCE 2013", v: "EXECUTING OFFSHORE" },
    ],
    distinction: {
      eyebrow: "WORKING WITH SOLAS MODU",
      items: [
        {
          title: "Equipment Sourcing",
          body: "Helping clients source and procure maritime safety equipment, supplying suitable products through SOLAS MODU’s network, and connecting qualified buyers with trusted suppliers where appropriate.",
        },
        {
          title: "Marine Delivery",
          body: "Where a project calls for marine or maritime engineering, CARLTSOLAS delivers it in collaboration with SOLAS MODU’s certified teams and systems.",
        },
      ],
    },
    cta: "Explore capabilities",
  },

  footer: {
    tagline: "Build the next decade of Indian maritime with us.",
    email: "office@solasmodu.net",
    web: "solasmodu.net",
    location: "Mumbai, India",
    legal: "CARLTSOLAS ENGINEERING PRIVATE LIMITED · A SOLAS MODU GROUP COMPANY",
    copyright: "© 2026 CARLTSOLAS ENGINEERING PRIVATE LIMITED · ALL RIGHTS RESERVED",
  },

  legal: {
    privacy: { label: "Privacy Policy", href: "/privacy" },
    terms: { label: "Terms & Conditions", href: "/terms" },
  },
} as const;

export type Site = typeof site;
