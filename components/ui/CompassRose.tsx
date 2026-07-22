"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMotionHold } from "@/components/providers/MotionHold";

interface CompassRoseProps {
  /** square box edge in px */
  size?: number;
  className?: string;
}

/**
 * Blueprint datum rosette: concentric hairlines, a fine crosshair graticule, a
 * slowly rotating tick dial, and the single accent node at the origin. The
 * drafting-instrument cousin of the loader hull, in CARLTSOLAS's own language.
 * Decorative. The dial rotation is CSS-only, dropped under reduced motion and
 * paused under the global motion hold.
 */
export function CompassRose({ size = 96, className }: CompassRoseProps) {
  const reduced = useReducedMotion();
  const { held } = useMotionHold();
  const ticks = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <span
      className={className}
      style={{ display: "inline-block", width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 120 120" fill="none" className="h-full w-full">
        <style>{`@keyframes datum-spin{to{transform:rotate(360deg)}}`}</style>

        {/* concentric rings + crosshair graticule, steel hairlines */}
        <g stroke="currentColor" className="text-steel">
          <circle cx="60" cy="60" r="57" strokeOpacity="0.28" />
          <circle cx="60" cy="60" r="40" strokeOpacity="0.16" />
          <circle cx="60" cy="60" r="10" strokeOpacity="0.22" />
          <path strokeOpacity="0.14" d="M60 3 V117 M3 60 H117" />
        </g>

        {/* slowly rotating tick dial */}
        <g
          className="text-steel"
          stroke="currentColor"
          strokeOpacity="0.5"
          style={
            reduced
              ? undefined
              : {
                  animation: "datum-spin 48s linear infinite",
                  animationPlayState: held ? "paused" : "running",
                  transformOrigin: "60px 60px",
                }
          }
        >
          {ticks.map((deg) => (
            <line
              key={deg}
              x1="60"
              y1="5"
              x2="60"
              y2={deg % 90 === 0 ? 14 : 10}
              transform={`rotate(${deg} 60 60)`}
            />
          ))}
        </g>

        {/* accent datum node: the single sanctioned fill */}
        <g className="text-accent">
          <path d="M60 44 L76 60 L60 76 L44 60 Z" fill="currentColor" fillOpacity="0.9" />
          <circle cx="60" cy="60" r="3" fill="rgb(var(--ink))" />
        </g>
      </svg>
    </span>
  );
}
