"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIsMobile } from "@/lib/useIsMobile";
import { cn } from "@/lib/cn";

/**
 * Draws a Marine hero schematic on mount, in the same idiom as the preloader's
 * BlueprintHull: strokes carry `pathLength="1"` so GSAP can run
 * strokeDashoffset 1 -> 0 regardless of each path's real length.
 *
 * Fallback-first, and deliberately the opposite way round from the naive
 * implementation: the SVG markup renders FULLY DRAWN. This effect is what
 * hides the strokes before animating them, so if it never runs - no JS,
 * reduced motion, or a handheld device - the schematic is simply visible
 * rather than invisible.
 *
 * One-shot: nothing here animates continuously, so there is no ongoing frame
 * cost and nothing for the global motion hold to pause.
 */
export function HeroSchematic({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;
    if (reduced || isMobile) return;

    const ctx = gsap.context(() => {
      const strokes = el.querySelectorAll<SVGGeometryElement>("[data-draw]");
      const fades = el.querySelectorAll<SVGElement>("[data-fade]");
      gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(fades, { opacity: 0 });
      gsap.to(strokes, {
        strokeDashoffset: 0,
        duration: 1.6,
        ease: "power2.out",
        stagger: 0.014,
      });
      gsap.to(fades, {
        opacity: 1,
        duration: 0.7,
        delay: 0.9,
        ease: "power2.out",
        stagger: 0.06,
      });
    }, el);

    return () => ctx.revert();
  }, [reduced, isMobile]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {children}
    </div>
  );
}
