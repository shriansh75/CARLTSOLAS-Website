/**
 * The premium grade layer over the hero video: cool colour-grade, multi-stop
 * scrims (top for the header, bottom to seat the type), a vignette, and a very
 * faint engineering grid masked toward the centre. Tuned lighter so more of the
 * footage reads through, with a near-solid anchor kept only at the very bottom
 * where the white wordmark sits over bright wake.
 */
export function BlueprintOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {/* full-height bottom scrim, kept light so the footage colour reads through */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/12 to-transparent" />
      {/* short hard anchor only where the wordmark sits */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-ink/78 to-transparent" />
      {/* top header scrim — a touch stronger so the nav links stay legible */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/62 via-ink/16 to-transparent" />
      {/* soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_54%,rgba(8,16,32,0.22)_100%)]" />
      {/* blueprint grid texture */}
      <div className="u-grid-bg absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />
    </div>
  );
}
