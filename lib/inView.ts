/**
 * One-shot viewport entry, on IntersectionObserver rather than ScrollTrigger.
 *
 * Why this exists: `Reveal`, `TextReveal`, `Decode` and `TickFrame` are all
 * `once: true` with no scrub, i.e. pure visibility detection. ScrollTrigger is
 * the wrong instrument for that. Every instance joins ScrollTrigger's global
 * list, which is walked on every scroll tick and re-measured on every
 * `refresh()`. `Reveal` alone appears dozens of times per page, so the cost is
 * paid on the main thread for effects that fire exactly once and then have
 * nothing left to do.
 *
 * IntersectionObserver does the same job without a layout read from us and
 * unobserves itself the moment it fires. What remains on ScrollTrigger
 * afterwards is only the two genuine hero scrubs, which makes
 * `ScrollTrigger.refresh()` on route change close to free — and leaves mobile
 * (where the hero scrub is gated off) with no ScrollTriggers at all.
 */

/** Matches the historic GSAP defaults these components shipped with. */
const DEFAULT_START = "top 85%";

/** start-string -> rootMargin. Dozens of components share a handful of strings. */
const marginCache = new Map<string, string>();

/**
 * How far the observer root is extended ABOVE the viewport.
 *
 * This is not a nicety, it closes a real hole. IntersectionObserver notifies
 * only on a THRESHOLD CROSSING. An element that goes from entirely below the
 * viewport to entirely above it in one jump never intersects at all:
 * `isIntersecting` stays false, the ratio stays 0, and no callback is ever
 * delivered — so the reveal never runs and the content sits at opacity 0
 * forever. ScrollTrigger recomputed positions every tick and so never had this
 * problem. Real users reach it with an End-key jump, an in-page anchor, browser
 * scroll restoration, or a hard trackpad fling.
 *
 * Extending the root upwards makes anything already scrolled past count as
 * intersecting, so it fires on the first observation. Larger than any plausible
 * document, and free: a margin costs nothing to evaluate.
 */
const ABOVE_VIEWPORT_MARGIN = 100000;

/**
 * Translate GSAP's `start` syntax into an IntersectionObserver `rootMargin`.
 *
 * `"top 85%"` means "fire when the element's top reaches 85% down the
 * viewport". Shrinking the observer root's bottom edge by the remaining 15%
 * puts the IO boundary on exactly that line, so the trigger point for content
 * entering from below is unchanged. The top edge is extended per the note above.
 */
export function rootMarginFromStart(start: string = DEFAULT_START): string {
  const cached = marginCache.get(start);
  if (cached !== undefined) return cached;
  const match = /(-?\d+(?:\.\d+)?)\s*%\s*$/.exec(start);
  const pct = match ? Number(match[1]) : 85;
  const margin = `${ABOVE_VIEWPORT_MARGIN}px 0px ${-(100 - pct)}% 0px`;
  marginCache.set(start, margin);
  return margin;
}

/**
 * Call `onEnter` once, the first time `el` crosses the `start` line, then stop
 * observing. Returns a disposer that is safe to call at any point.
 */
export function observeOnce(el: Element, onEnter: () => void, start?: string): () => void {
  // No IO (very old browsers, some test environments): show the content rather
  // than leave it stuck at opacity 0. Failing visible is the only safe default.
  if (typeof IntersectionObserver === "undefined") {
    onEnter();
    return () => {};
  }

  let fired = false;
  const io = new IntersectionObserver(
    (entries) => {
      // Read the LAST record: a single callback can carry several coalesced
      // entries for one target and the earlier ones are already stale.
      const entry = entries[entries.length - 1];
      if (!entry) return;
      // `top < 0` catches an element that is ALREADY scrolled past on the first
      // observation (hash navigation, browser scroll restoration). ScrollTrigger
      // fired those on its initial refresh; without this branch they would sit
      // invisible forever.
      if (!entry.isIntersecting && entry.boundingClientRect.top >= 0) return;
      if (fired) return;
      fired = true;
      io.disconnect();
      onEnter();
    },
    { rootMargin: rootMarginFromStart(start) },
  );
  io.observe(el);
  return () => io.disconnect();
}

/**
 * Continuous visibility, for effects that must pause offscreen (the marquee).
 * Unlike `observeOnce` this keeps observing and reports both directions.
 */
export function observeVisibility(el: Element, onChange: (visible: boolean) => void): () => void {
  if (typeof IntersectionObserver === "undefined") {
    onChange(true);
    return () => {};
  }
  const io = new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1];
    if (entry) onChange(entry.isIntersecting);
  });
  io.observe(el);
  return () => io.disconnect();
}
