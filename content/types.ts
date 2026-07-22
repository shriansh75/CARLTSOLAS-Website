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
