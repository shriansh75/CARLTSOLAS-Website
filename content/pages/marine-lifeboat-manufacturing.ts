import type { ServicePageContent } from "@/content/types";

/**
 * Lifeboat Manufacturing initiative page.
 *
 * SOURCING RULES FOR THIS FILE (do not relax):
 * - This is a DECLARED INITIATIVE, not a product line. No wording may imply we
 *   manufacture survival craft today, hold a type approval, or can supply a
 *   built boat. The opening section says so explicitly.
 * - The capability section describes servicing, testing, certification,
 *   installation and commissioning work that is evidenced by documents on file.
 *   The LSA service recognitions (ABS, BV) EXPIRED in 2013-2014, so that work
 *   is described in the past and never as a live "approved service station".
 *   Current third-party approvals are the ABS Recognized Service Supplier
 *   certificates, the IRS Approval for Service Suppliers, and ISO 9001/14001/
 *   45001; see docs/solas-modu-capability-record.md and re-check expiry dates.
 * - The platform lifeboat contract was SUPPLY, INSTALLATION AND COMMISSIONING
 *   of third-party boats (the tender priced them as foreign-sourced). It is not
 *   evidence of manufacture, and nothing on file shows class witnessing.
 * - No free-fall davit work is evidenced; the record is platform davits for
 *   totally enclosed boats. Do not reintroduce a free-fall claim.
 * - The Udyam registration carries manufacturing NIC codes. That is registered
 *   activity only and must NEVER be presented as a product or type approval.
 * - Regulatory statements come from public instruments (the LSA Code, IMO
 *   Resolution MSC.81(70), the Merchant Shipping life-saving appliance rules).
 * - Market figures come from published Government of India announcements and
 *   are labelled as market context, not as funding awarded to CARLTSOLAS.
 * - No competitor is named anywhere on this page.
 */
export const lifeboatManufacturingPage: ServicePageContent = {
  meta: {
    title: "Lifeboat Manufacturing",
    description:
      "A declared initiative to manufacture SOLAS survival craft in India, built on more than a decade of servicing, load testing and certifying lifeboats and launching appliances. Seeking technology partners, approvals and capital.",
  },
  breadcrumb: "HOME / MARINE / LIFEBOAT MANUFACTURING",
  eyebrow: "MAR 02 / LIFEBOAT MANUFACTURING",
  heading: "A decade servicing survival craft. Now building them.",
  lede:
    "A declared initiative, not a product line. We are assembling the approvals, partners and capital required to manufacture SOLAS survival craft in India.",
  heroImage: {
    // Totally enclosed lifeboats stowed in their davits. NEVER caption these
    // as free-fall craft: free-fall boats launch down a stern ramp and carry
    // no davit. The source filename is wrong; the photograph is not.
    webp: "/images/marine/lifeboat-hero.webp",
    jpg: "/images/marine/lifeboat-hero.jpg",
    alt: "Totally enclosed lifeboats stowed in their davits along a ship's side, ready for launch.",
  },
  introImage: {
    webp: "/images/marine/lifeboat-intro.webp",
    jpg: "/images/marine/lifeboat-intro.jpg",
    alt: "An enclosed lifeboat seated in its davit cradle on an offshore installation, open sea beyond.",
  },
  // Five images: the bento's feature tile spans 2x2 of a 4x2 grid, so four
  // entries left the bottom-right cell empty.
  feature: {
    images: [
      {
        webp: "/images/marine/lb-deployment.webp",
        jpg: "/images/marine/lb-deployment.jpg",
        alt: "A totally enclosed lifeboat seated in its davit cradle above the sea.",
      },
      {
        // A station code and a helmet brand were blurred out of the master.
        webp: "/images/marine/lb-service-crew.webp",
        jpg: "/images/marine/lb-service-crew.jpg",
        alt: "Two technicians on rope access servicing the release gear of an enclosed lifeboat suspended over the water.",
      },
      {
        webp: "/images/marine/lb-davit.webp",
        jpg: "/images/marine/lb-davit.jpg",
        alt: "A partially enclosed lifeboat stowed in gravity davits at a ship's side.",
      },
      {
        // The 4x upscale of this master invented ship-name-shaped lettering on
        // the wheelhouse that does not exist in the original. It is blurred out.
        webp: "/images/marine/lb-underway.webp",
        jpg: "/images/marine/lb-underway.jpg",
        alt: "An enclosed lifeboat underway at sea under its own power.",
      },
      {
        webp: "/images/marine/lb-ga-drawing.webp",
        jpg: "/images/marine/lb-ga-drawing.jpg",
        alt: "General arrangement drawing of a fast rescue craft, showing the flying bridge and main deck plan views.",
      },
    ],
    caption: "SERVICING · LOAD TESTING · RELEASE GEAR · INSTALLATION AND COMMISSIONING",
  },

  intro: {
    eyebrow: "MAR 02.1 / POSITION",
    heading: "Where this stands today, stated plainly.",
    paragraphs: [
      "CARLTSOLAS Engineering is developing a survival craft manufacturing capability in India. It is at the development stage. We do not manufacture lifeboats today, we do not hold a lifeboat type approval, and nothing on this page is an offer to supply a manufactured boat.",
      "What exists today is the engineering foundation. Through SOLAS MODU Marine Services, our teams have serviced, inspected, load tested, certified, installed and commissioned survival craft and their launching appliances for offshore operators and shipowners since 2011. Manufacturing extends that work rather than departing from it.",
      "We are looking for technology partners and licensors, a recognised organisation to take the approval route with us, fabrication capacity, and investors who understand marine equipment.",
    ],
    chips: ["DEVELOPMENT STAGE", "SEEKING PARTNERS", "LSA CODE", "MANUFACTURE IN INDIA"],
  },

  capabilities: {
    eyebrow: "MAR 02.2 / FOUNDATION",
    heading: "The capability that already exists.",
    lede:
      "Delivered work, carried out under class society and client certification. This is what a manufacturing programme would be built on.",
    items: [
      {
        no: "01",
        title: "Survival craft servicing and certification",
        body:
          "Periodic servicing, inspection and certification of lifeboats, liferafts, hydrostatic release units and immersion suits, carried out under class society service recognitions held for this work.",
        chips: ["LIFEBOATS", "LIFERAFTS", "HRU", "IMMERSION SUITS"],
      },
      {
        no: "02",
        title: "Davits and launching appliances",
        body:
          "Examination, repair and load testing of davits and launching appliances, including dynamic winch brake testing to the LSA Code and examination and operational testing of on-load release gear under SOLAS III/20.11, so that a boat can actually be released at the moment it is needed.",
        chips: ["DAVITS", "WINCH BRAKE TEST", "RELEASE GEAR"],
      },
      {
        no: "03",
        title: "Installation and commissioning",
        body:
          "Supply, installation and commissioning of survival craft on an offshore platform for a national oil and gas operator, closed out to the client's satisfaction.",
        chips: ["OFFSHORE PLATFORM", "COMMISSIONED"],
      },
      {
        no: "04",
        title: "Failure knowledge",
        body:
          "More than a decade of finding what actually goes wrong with survival craft in service: corrosion at the release gear, davit wire condition, hydrostatic units past date, structures that pass a visual inspection and fail a load test. That is design input a first-time manufacturer does not have.",
        chips: ["IN-SERVICE DATA", "DESIGN INPUT"],
      },
    ],
  },

  process: {
    eyebrow: "MAR 02.3 / REGULATORY PATH",
    heading: "What manufacturing a SOLAS lifeboat actually requires.",
    lede:
      "The route is well defined. We publish it because we would rather be measured against the real standard than a brochure.",
    steps: [
      {
        no: "01",
        title: "Design to the LSA Code",
        body:
          "Structure, buoyancy, seating, fire protection and release arrangements engineered to the International Life-Saving Appliance Code and the SOLAS chapter III requirements that govern survival craft.",
      },
      {
        no: "02",
        title: "Prototype testing",
        body:
          "Prototype testing to IMO Resolution MSC.81(70), the recommendation on testing of life-saving appliances: drop, load, stability, fire and release gear testing, witnessed by the approving body.",
      },
      {
        no: "03",
        title: "Type approval",
        body:
          "Type approval issued by a recognised organisation, assessing the design, the test evidence and the production arrangements together rather than the boat alone.",
      },
      {
        no: "04",
        title: "National approval and production",
        body:
          "Approval for use on Indian flag vessels by the Nautical Adviser to the Government of India under the Merchant Shipping life-saving appliance rules, supported by a production quality system and periodic surveillance.",
      },
    ],
  },

  proof: {
    eyebrow: "MAR 02.4 / WHY NOW",
    heading: "India is funding exactly this.",
    lede:
      "The commercial case is not ours alone. Indigenous marine equipment manufacture is current national policy.",
    points: [
      {
        title: "Maritime package",
        detail:
          "A ₹69,725 crore package for shipbuilding and maritime infrastructure, supporting the goal of placing India among the top five shipbuilding nations by 2047.",
        meta: "GOVT OF INDIA",
      },
      {
        title: "Maritime Development Fund",
        detail:
          "A ₹25,000 crore fund providing long term financing, comprising a ₹20,000 crore investment fund and a ₹5,000 crore interest incentivisation fund, with a fund manager appointed in May 2026.",
        meta: "MDF · 2026",
      },
      {
        title: "Component localisation",
        detail:
          "A promotional scheme in preparation for the domestic manufacture of ship components, expected to combine capital support with production linked incentives, alongside financial assistance tied to the level of domestic content in a build.",
        meta: "MOPSW",
      },
      {
        title: "A thin domestic supply base",
        detail:
          "Indigenous type approved survival craft manufacturing in India remains limited, and most tonnage is still fitted from imported supply. The distance between demand and domestic capacity is the opportunity.",
        meta: "MARKET",
      },
    ],
    note:
      "Policy figures are drawn from published Government of India announcements current at the time of writing. They describe the market context for this initiative. They are not a statement of funding awarded to, applied for by, or committed to CARLTSOLAS Engineering Private Limited.",
  },

  cta: {
    eyebrow: "MAR 02.5 / PARTNERSHIP",
    heading: "We are looking for the partners who close the gap.",
    body:
      "Specifically: a technology partner or licensor with proven SOLAS survival craft designs, a recognised organisation willing to take the approval route with us, fabrication or yard capacity on the Indian coast, and investors who understand marine equipment. If you are one of those, we would like to talk.",
    primary: { label: "Start a partnership conversation", href: "mailto:office@solasmodu.net" },
    secondary: { label: "Back to Marine", href: "/marine" },
  },
};
