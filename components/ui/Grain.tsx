"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";

/** Animated film-grain overlay — the cheapest "cinematic" signal. */
export function Grain() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden opacity-[0.055] mix-blend-overlay"
    >
      <div className="absolute inset-[-50%] h-[200%] w-[200%] [animation:grain-shift_0.7s_steps(3)_infinite]">
        <svg className="h-full w-full">
          <filter id="carltsolas-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#carltsolas-grain)" />
        </svg>
      </div>
    </div>
  );
}
