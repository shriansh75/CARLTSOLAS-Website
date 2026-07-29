import type { ServicePageContent } from "@/content/types";

/**
 * Flag State Inspections service page.
 *
 * SOURCING RULES FOR THIS FILE (do not relax):
 * - Nothing here describes any individual vessel, inspection, crew member or
 *   client. Inspection reports are confidential; only the general process,
 *   scope and standards are public.
 * - Regulatory statements are drawn from public instruments (SOLAS I/6, the IMO
 *   Code for Recognized Organizations MSC.349(92) and MEPC.237(65)).
 * - NO REGISTRY IS NAMED. The St Kitts and Nevis appointment on file expired
 *   26 June 2026, its renewal is unavailable, and the original agreement named
 *   an individual as "the Inspector" rather than the company. Do not restore a
 *   registry claim without a current document that names the company.
 * - Zanzibar is deliberately omitted: the only evidence is a spent,
 *   vessel-specific 2022 authorisation, which cannot support a standing claim.
 * - TERMINOLOGY (RO Code s1.2 makes "authorization" the term of art for RO
 *   delegation): use "appointed" or "nominated". Never "authorised by" or
 *   "recognised by" a registry, "acting on behalf of the Administration",
 *   "IMO-approved", or "we certify vessels". Avoid "Flag State Survey", which
 *   is not a defined IMO term.
 * - Credentials are stated only from certificates that are current. See
 *   docs/solas-modu-capability-record.md, and re-check expiry dates before
 *   any future revision.
 */
export const flagStateInspectionsPage: ServicePageContent = {
  meta: {
    title: "Flag State Inspections",
    description:
      "Independent flag State inspections for ship registries: full convention scope across SOLAS, MARPOL, ISM, ISPS, MLC and Load Line, delivered by qualified surveyors and reported for the administration to act on.",
  },
  breadcrumb: "HOME / MARINE / FLAG STATE INSPECTIONS",
  eyebrow: "MAR 01 / FLAG STATE INSPECTIONS",
  heading: "Flag State Inspections for registries that hold their fleet to a standard.",
  lede:
    "Independent, convention-wide inspection of ships flying your flag, carried out by qualified surveyors and reported in a form your administration can act on.",
  schematic: "vesselProfile",
  heroImage: {
    webp: "/images/marine/flag-state-inspections.webp",
    jpg: "/images/marine/flag-state-inspections.jpg",
    alt: "A ship's machinery space photographed along the length of the engine platform, showing cylinder heads, handrails and access stairs.",
  },

  intro: {
    eyebrow: "MAR 01.1 / THE SERVICE",
    heading: "An administration's own eyes on board, wherever the ship trades.",
    paragraphs: [
      "A flag State inspection is the administration's own check on a ship it has registered. It is distinct from a class survey and from port State control, and it looks at the whole convention picture at once: certificates, fire safety and life-saving, navigation and radio, pollution prevention, management and security systems, seafarer welfare, load line and machinery.",
      "Registries use these inspections to keep the standard of the register high and to reduce the risk of a detention abroad. Under SOLAS regulation I/6 an administration may entrust inspections and surveys either to surveyors nominated for the purpose, or to organisations it recognises under the IMO Code for Recognized Organizations.",
      "CARLTSOLAS Engineering manages the commercial engagement, scheduling and reporting interface. SOLAS MODU Marine Services provides the operational and technical execution, with attending surveyors holding the certificates of competency registries require for this work.",
    ],
    chips: ["SOLAS", "MARPOL", "ISM CODE", "ISPS CODE", "MLC 2006", "LOAD LINE"],
  },

  capabilities: {
    eyebrow: "MAR 01.2 / SCOPE",
    heading: "What a full inspection covers.",
    lede:
      "The scope follows the conventions themselves, so an administration receives a complete picture rather than a spot check.",
    items: [
      {
        no: "01",
        title: "Certificates and documentation",
        body:
          "Statutory and class certificates with their endorsements and survey status, the continuous synopsis record, minimum safe manning, and the trading and operational documents that keep a ship lawful in port.",
        chips: ["STATUTORY", "CLASS", "TRADING"],
      },
      {
        no: "02",
        title: "Fire safety and life-saving",
        body:
          "Detection and alarm systems, fixed and portable fire-fighting arrangements, survival craft and launching appliances, distress signalling, and the servicing records behind all of them.",
        chips: ["SOLAS II-2", "SOLAS III", "FSS CODE", "LSA CODE"],
      },
      {
        no: "03",
        title: "Navigation and radio",
        body:
          "Bridge equipment and its performance records, charts and publications with their corrections, voyage planning and bridge procedures, and the GMDSS installation with its power supplies, testing and operator certification.",
        chips: ["SOLAS V", "SOLAS IV", "GMDSS"],
      },
      {
        no: "04",
        title: "Pollution prevention",
        body:
          "MARPOL Annexes I to VI: oil record keeping and separation equipment, sewage and garbage arrangements, air emissions, energy efficiency documentation, and the approved plans that support them.",
        chips: ["MARPOL I-VI", "SEEMP", "ORB"],
      },
      {
        no: "05",
        title: "Management, security and welfare",
        body:
          "Safety management system implementation and the evidence behind it, ship security arrangements, drills and records, and seafarer employment conditions, accommodation, catering and medical care.",
        chips: ["ISM", "ISPS", "MLC 2006"],
      },
      {
        no: "06",
        title: "Structure, load line and machinery",
        body:
          "Load line marks and closing appliances, hull and deck condition, watertight integrity, main and auxiliary machinery, steering gear, bilge systems, emergency power and the ship's emergency preparedness.",
        chips: ["LL 66", "SOLAS II-1", "EMERGENCY"],
      },
    ],
  },

  process: {
    eyebrow: "MAR 01.3 / METHOD",
    heading: "How an inspection runs.",
    lede:
      "A repeatable sequence, agreed with the administration before anyone boards, so findings arrive in a form that can be acted on.",
    steps: [
      {
        no: "01",
        title: "Appointment and scope",
        body:
          "We agree the scope with the administration, confirm the vessel, port and attendance window, and align on the reporting format and any flag-specific checklist.",
      },
      {
        no: "02",
        title: "Attendance on board",
        body:
          "Surveyors attend the ship alongside or afloat, brief the master, and work through every convention area with the ship's officers, examining equipment and records together.",
      },
      {
        no: "03",
        title: "Findings and classification",
        body:
          "Each finding is recorded against the convention or regulation it engages and graded by severity, separating observations from items to rectify within a timeframe and from anything detainable.",
      },
      {
        no: "04",
        title: "Report and close-out",
        body:
          "A structured report is issued to the administration, acknowledged by the master on board, with corrective actions and deadlines stated and copies distributed to the parties the administration nominates.",
      },
    ],
  },

  proof: {
    eyebrow: "MAR 01.4 / CREDENTIALS",
    heading: "Audited, approved, and on record.",
    points: [
      {
        title: "Certified management systems",
        detail:
          "ISO 9001:2015, ISO 14001:2015 and ISO 45001:2018, certified against a registered scope that expressly covers surveys and certifications of ships and rigs, class surveyors, and flag State inspectors and auditors.",
        meta: "ISO · TO APR 2028",
      },
      {
        title: "Class society service approvals",
        detail:
          "Recognized Service Supplier for nondestructive inspection and for enhanced survey programme hull gauging with the American Bureau of Shipping, and Approval for Service Suppliers covering thickness measurement on all ships including ESP ships with the Indian Register of Shipping.",
        meta: "ABS · IRS",
      },
      {
        title: "Surveyor qualifications",
        detail:
          "Attending surveyors hold the qualifications registries specify for this work: a Master or Chief Engineer certificate of competency, or a naval architecture degree with professional membership, supported by post-qualification marine surveying experience.",
        meta: "STCW II/2 · III/2",
      },
      {
        title: "Offshore and merchant attendance",
        detail:
          "A continuous record of survey, inspection and certification attendance on merchant vessels, offshore drilling units and fixed platforms in Indian ports and offshore fields, under long running contracts with national oil and gas operators.",
        meta: "OFFSHORE RECORD",
      },
    ],
    note:
      "Flag State inspections are performed by SOLAS MODU Marine Services Private Limited as the operational and technical partner; CARLTSOLAS Engineering Private Limited manages the commercial engagement. Neither company is a Recognized Organization, and neither performs statutory certification or classification services. An inspection and its report do not constitute a certification or warranty of a vessel's seaworthiness. Reports are confidential to the administration and the owner, and nothing on this page describes an individual vessel, client or inspection.",
  },

  cta: {
    eyebrow: "MAR 01.5 / FOR ADMINISTRATIONS",
    heading: "Appoint us to inspect ships flying your flag.",
    body:
      "Of the two routes SOLAS I/6 gives you, ours is the first: surveyors nominated for the purpose, working to your scheme rather than issuing statutory certificates. We are equipped for that role and open to appointment by registries needing dependable attendance on the Indian coast and across the wider region. Tell us your inspection scheme, your reporting format and the ports you need covered, and we will tell you plainly what we can and cannot do.",
    primary: { label: "Discuss an appointment", href: "mailto:office@solasmodu.net" },
    secondary: { label: "Back to Marine", href: "/marine" },
  },
};
