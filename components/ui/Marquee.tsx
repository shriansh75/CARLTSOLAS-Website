"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { observeVisibility } from "@/lib/inView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMotionHold } from "@/components/providers/MotionHold";
import { cn } from "@/lib/cn";

interface MarqueeProps {
  children: ReactNode;
  /** seconds for one full track loop */
  duration?: number;
  className?: string;
  trackClassName?: string;
}

/**
 * Duplicated-track marquee driven by a CSS animation (`.u-marquee-track`,
 * `@keyframes marquee-x`). Pauses on hover, on keyboard focus within, under the
 * global motion hold, and offscreen. Reduced motion renders a static strip.
 *
 * Why CSS and not GSAP: an infinite loop is the one animation the compositor can
 * own outright. There is no per-frame main-thread work at all, and no tween to
 * be killed by an unrelated `overwrite` — which is exactly what used to stop it.
 * The earlier version drove the loop and a scroll-velocity skew from GSAP; the
 * skew's shared target killed the loop on first scroll (the "carousel stopped
 * animating" bug), and the fix at the time still left a TRIGGER-LESS global
 * ScrollTrigger firing `onUpdate` on every scroll tick for the life of the page
 * to move a decoration nobody asked for. Both are gone.
 *
 * Pausing is `animation-play-state` via a `data-paused` attribute, so there are
 * no kill/overwrite semantics to get wrong, and the global reduced-motion block
 * in globals.css stops it even before the JS branch runs.
 */
export function Marquee({ children, duration = 32, className, trackClassName }: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { held } = useMotionHold();
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    // Visibility only — IntersectionObserver, never a ScrollTrigger window.
    return observeVisibility(root, setVisible);
  }, [reduced]);

  if (reduced) {
    return <div className={cn("flex flex-wrap gap-x-8 gap-y-2", className)}>{children}</div>;
  }

  // Four independent reasons to hold still, collapsed to one attribute. All are
  // event-driven (hover, focus, hold toggle, scrolling past), never per-frame.
  const paused = held || hovered || !visible;

  return (
    <div
      ref={rootRef}
      className={cn("overflow-hidden", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <div
        data-paused={paused ? "true" : "false"}
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
        className={cn("u-marquee-track flex w-max items-center will-change-transform", trackClassName)}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
