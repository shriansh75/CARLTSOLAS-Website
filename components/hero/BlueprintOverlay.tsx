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
      {/* Hard anchor under the wordmark.
          It used to be h-[30%], which only reached y≈630 on a 900px viewport
          while the wordmark sits at roughly y 520-660 — so most of the largest
          white type on the site had nothing behind it but the light /60 scrim
          above. Measured against the live video the wordmark came out at
          2.96:1, 3.04:1 and 3.80:1 on different frames: straddling the 3:1
          large-text floor and crossing it depending on how much wake was in
          shot. Taller, with a mid stop, so the whole wordmark is seated. */}
      <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-ink/90 via-ink/55 to-transparent" />
      {/* top header scrim — a touch stronger so the nav links stay legible */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/62 via-ink/16 to-transparent" />
      {/* soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_54%,rgba(8,16,32,0.22)_100%)]" />
      {/* blueprint grid texture */}
      <div className="u-grid-bg absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />
    </div>
  );
}
