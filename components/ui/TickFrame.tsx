"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { STAGGER } from "@/lib/motion";
import { observeOnce } from "@/lib/inView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

const CORNERS = [
  "left-0 top-0 rotate-0",
  "right-0 top-0 rotate-90",
  "right-0 bottom-0 rotate-180",
  "left-0 bottom-0 -rotate-90",
] as const;

/**
 * Four L-shaped reticle brackets that stroke-draw in on viewport entry (GSAP
 * strokeDashoffset). Concept ported from the sibling's anime.js TickFrame,
 * reimplemented with GSAP so it adds no dependency and runs a one-shot tween
 * (no continuous cost). Decorative; put inside a `relative` card.
 */
export function TickFrame({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;
    const paths = el.querySelectorAll<SVGPathElement>("path");
    if (reduced) {
      gsap.set(paths, { strokeDashoffset: 0 });
      return;
    }
    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
    });
    // One-shot visibility: IntersectionObserver, not ScrollTrigger. See lib/inView.
    return observeOnce(
      el,
      () =>
        gsap.to(paths, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out", stagger: STAGGER.ticks }),
      "top 88%",
    );
  }, [reduced]);

  return (
    <div ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {CORNERS.map((pos) => (
        <svg
          key={pos}
          viewBox="0 0 16 16"
          className={cn("absolute h-4 w-4 text-steel/70", pos)}
          fill="none"
        >
          <path d="M1 15 V1 H15" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      ))}
    </div>
  );
}
