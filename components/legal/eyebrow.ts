/** Split a legal-section eyebrow like "LEG 02 / SCOPE" into a SectionIndex
 *  index ("LEG 02") + label ("SCOPE"). Falls back to a bare label. */
export function splitEyebrow(eyebrow: string): { index?: string; label: string } {
  const parts = eyebrow.split(" / ");
  if (parts.length >= 2) return { index: parts[0], label: parts.slice(1).join(" / ") };
  return { label: eyebrow };
}
