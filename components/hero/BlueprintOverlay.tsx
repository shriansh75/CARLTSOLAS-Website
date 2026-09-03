/**
 * The ONLY thing this puts over the hero footage is a soft pool behind the copy.
 *
 * It used to be five stacked layers — a full-height wash, a 44% bottom anchor, a
 * top scrim, a corner vignette and a blueprint grid texture — which composited
 * to roughly 77-81% ink across the bottom of the frame and 89% at the very top.
 * That is what made the vessel and the wake look flat, and it was never a
 * property of the video: the master is 1928x1076 at 31.75 Mbps and ships at
 * x264 CRF 18 with identical resolution, frame rate, duration and pixel format.
 * Nothing was cropped, recoloured or downscaled. The dullness was entirely this
 * file.
 *
 * What replaced it:
 *
 * - The top scrim is GONE, because it duplicated the one `Header.tsx` already
 *   draws. Two gradients were stacking to 0.886 alpha at the top edge where one
 *   at 0.70 was the intent. The header's own scrim is now the only darkening at
 *   the top of the frame, and it is the only darkening the client wants there.
 * - The vignette and the grid texture are gone. The grid LIGHTENED rather than
 *   darkened (steel at an effective 0.014 alpha), but it is still a modification
 *   of the footage, and the brief was none.
 * - One elliptical pool remains, anchored below the lower-left so it sits under
 *   the copy block and falls off before it reaches the vessel. The right and
 *   upper thirds of the frame are now untouched video.
 *
 * The numbers below are MEASURED, not chosen, and they are at a genuine floor.
 * They are the lightest pool that still clears every text minimum, verified
 * across three separate video frames:
 *
 *   wordmark   3.58 - 3.66 : 1   (needs 3, large text)
 *   ENGINEERING       ~5.8 : 1   (needs 3)
 *   tagline    4.72 - 4.80 : 1   (needs 4.5)  <- THIS is the binding constraint
 *   group line 5.22 - 5.32 : 1   (needs 4.5)
 *   eyebrow           ~7.3 : 1   (needs 4.5)
 *
 * The tagline is why it stops here: one step lighter and it drops under 4.5.
 *
 * And the footage genuinely reads brighter than the five-layer version, on the
 * same pinned video frame:
 *
 *   vessel + wake        mean 0.1783 -> 0.1870,  p50 0.0482 -> 0.0585
 *   open water, lower R  mean 0.0577 -> 0.0659,  p90 0.0624 -> 0.1174
 *   whole frame          mean 0.1129 -> 0.1294
 *
 * If you change these, re-measure BOTH sides — legibility and how bright the
 * footage reads. Do not eyeball it, and do not add a second layer: the whole
 * point is that one pool is all that touches the video.
 */
export function BlueprintOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(150%_95%_at_30%_108%,rgba(8,16,32,0.58)_0%,rgba(8,16,32,0.26)_45%,transparent_82%)]" />
    </div>
  );
}
