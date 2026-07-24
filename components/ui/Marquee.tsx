"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIsMobile } from "@/lib/useIsMobile";
import { useMotionHold } from "@/components/providers/MotionHold";
import { cn } from "@/lib/cn";

interface MarqueeProps {
  children: ReactNode;
  /** seconds for one full track loop */
  duration?: number;
  /** clamp for the scroll-velocity skew, degrees */
  maxSkew?: number;
  className?: string;
  trackClassName?: string;
}

/**
 * Duplicated-track marquee driven by GSAP (xPercent 0 to -50, mechanical ease).
 * Pauses on hover, on keyboard focus within, under the global motion hold, and
 * offscreen. Reduced motion renders a static strip.
 *
 * The desktop scroll-velocity skew is applied to a SEPARATE wrapper from the
 * xPercent loop (never a shared target) and driven by one persistent quickTo, so
 * it can never overwrite or churn the loop. The previous version animated skewX
 * on the same element as the loop with `overwrite:true`, which killed the loop on
 * the first scroll — the "carousel stopped animating" bug. Skew is desktop-only.
 */
export function Marquee({ children, duration = 32, maxSkew = 6, className, trackClassName }: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const { held } = useMotionHold();
  const [paused, setPaused] = useState(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root || reduced) return;
    const track = root.querySelector<HTMLElement>("[data-marquee-track]");
    const skew = root.querySelector<HTMLElement>("[data-marquee-skew]");
    if (!track) return;

    const ctx = gsap.context(() => {
      tweenRef.current = gsap.to(track, { xPercent: -50, duration, ease: EASE.mech, repeat: -1 });

      const visibility = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          if (!self.isActive) tweenRef.current?.pause();
          else if (!pausedRef.current) tweenRef.current?.play();
        },
      });

      // scroll-velocity skew: desktop only, on its own wrapper, single quickTo
      if (skew && !isMobile) {
        const clamp = gsap.utils.clamp(-maxSkew, maxSkew);
        const setSkew = gsap.quickTo(skew, "skewX", { duration: 0.5, ease: EASE.soft });
        ScrollTrigger.create({
          onUpdate: (self) => {
            setSkew(visibility.isActive ? clamp(self.getVelocity() / -300) : 0);
          },
        });
      }
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, isMobile, duration, maxSkew]);

  useEffect(() => {
    pausedRef.current = held || paused;
    const tween = tweenRef.current;
    if (!tween) return;
    if (held || paused) tween.pause();
    else tween.play();
  }, [held, paused]);

  if (reduced) {
    return <div className={cn("flex flex-wrap gap-x-8 gap-y-2", className)}>{children}</div>;
  }

  return (
    <div
      ref={rootRef}
      className={cn("overflow-hidden", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div data-marquee-skew>
        <div data-marquee-track className={cn("flex w-max items-center will-change-transform", trackClassName)}>
          <div className="flex shrink-0 items-center">{children}</div>
          <div className="flex shrink-0 items-center" aria-hidden>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
