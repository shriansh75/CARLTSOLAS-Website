/** Shared types for standalone content pages (Privacy Policy, Terms). */

export interface PageMeta {
  title: string;
  description: string;
}

export interface LegalSection {
  /** e.g. "LEG 02 / SCOPE", the renderer splits this into an index + label. */
  eyebrow: string;
  heading: string;
  paragraphs: string[];
}

export interface LegalPageContent {
  meta: PageMeta;
  eyebrow: string;
  heading: string;
  lede: string;
  /** e.g. "EFFECTIVE 2026-07-22 · REV 1.0" */
  effectiveDate: string;
  /** Ordered sections; the final entry renders in the dark closing band. */
  sections: LegalSection[];
}

/* ------------------------------------------------------------------ *
 * Service pages (the Marine section). One shell renders all of them;
 * every section below the intro is optional, so a landing page and a
 * deep service page share the same type.
 * ------------------------------------------------------------------ */

/** A self-hosted image pair. Both files live under `public/images/`. */
export interface ServiceImage {
  webp: string;
  jpg: string;
  /** Real alternative text. Never leave empty on a content image. */
  alt: string;
}

export interface ServiceCapability {
  /** Drafting index, e.g. "01". */
  no: string;
  title: string;
  body: string;
  chips?: string[];
}

export interface ServiceStep {
  no: string;
  title: string;
  body: string;
}

/** A verifiable credential or delivered engagement. Never aspirational. */
export interface ServiceProofPoint {
  title: string;
  detail: string;
  /** Issuer and/or validity, e.g. "ISO · TO APR 2028". */
  meta?: string;
}

/** A card on the Marine landing page pointing at a service route. */
export interface ServiceCard {
  title: string;
  summary: string;
  href: string;
  meta: string;
}

export interface ServiceCta {
  label: string;
  href: string;
}

export interface ServicePageContent {
  meta: PageMeta;
  /** e.g. "HOME / MARINE / FLAG STATE INSPECTIONS" */
  breadcrumb: string;
  eyebrow: string;
  heading: string;
  lede: string;
  /** Optional hero photograph. Falls back to the blueprint treatment. */
  heroImage?: ServiceImage;
  /**
   * Sits under the heading in the light intro band, filling the column that
   * would otherwise run empty beside the body copy.
   */
  introImage?: ServiceImage;
  /**
   * Contained image band between sections. One image reads full width; two
   * read as a pair. `caption` is a short mono line, not a sentence.
   */
  feature?: {
    images: ServiceImage[];
    caption?: string;
  };
  intro: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    chips?: string[];
  };
  /** Landing pages only: cards linking to the service routes. */
  services?: {
    eyebrow: string;
    heading: string;
    lede?: string;
    items: ServiceCard[];
  };
  capabilities?: {
    eyebrow: string;
    heading: string;
    lede?: string;
    items: ServiceCapability[];
  };
  process?: {
    eyebrow: string;
    heading: string;
    lede?: string;
    steps: ServiceStep[];
  };
  proof?: {
    eyebrow: string;
    heading: string;
    lede?: string;
    points: ServiceProofPoint[];
    /** Scope caveat rendered under the points. Keeps claims precise. */
    note?: string;
  };
  cta: {
    eyebrow: string;
    heading: string;
    body: string;
    primary: ServiceCta;
    secondary?: ServiceCta;
  };
}
