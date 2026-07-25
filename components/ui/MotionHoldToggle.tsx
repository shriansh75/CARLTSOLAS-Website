"use client";

import { useMotionHold } from "@/components/providers/MotionHold";
import { useLoaderGate } from "@/components/providers/LoaderGate";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Accessible global pause for ambient motion (WCAG 2.2.2). Fixed, subtle, mono.
 * Shown after the loader reveals, on every device: mobile drops the heavy layer
 * (video, WebGL, grain, marquee skew) but still runs continuous animations, the
 * marquee loop, the hero glint and the compass dial, so the pause control must
 * stay reachable there. Hidden only under reduced motion, where nothing moves.
 */
export function MotionHoldToggle() {
  const { held, toggle } = useMotionHold();
  const { revealed } = useLoaderGate();
  const reduced = useReducedMotion();
  if (reduced || !revealed) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={held}
      aria-label={held ? "Resume ambient motion" : "Pause ambient motion"}
      data-cursor="hover"
      className="fixed bottom-5 right-5 z-[65] flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-ink/90 px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-meta transition-colors duration-300 hover:border-steel/60 hover:text-white"
    >
      <span aria-hidden className="inline-flex h-2 w-2 items-center justify-center text-steel">
        {held ? (
          <svg viewBox="0 0 8 8" className="h-2 w-2 fill-current">
            <path d="M1 0.5 L7 4 L1 7.5 Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 8 8" className="h-2 w-2 fill-current">
            <rect x="1" y="0.5" width="2.2" height="7" />
            <rect x="4.8" y="0.5" width="2.2" height="7" />
          </svg>
        )}
      </span>
      {held ? "Resume" : "Hold"}
    </button>
  );
}
