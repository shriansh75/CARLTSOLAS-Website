"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIsMobile } from "@/lib/useIsMobile";

/** Lagged dot + ring cursor. Desktop/fine-pointer only; off for reduced motion
 *  and on touch (so the inert mix-blend nodes never enter the mobile DOM). */
export function CustomCursor() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const dotEl = dot.current;
    const ringEl = ring.current;
    if (!dotEl || !ringEl) return;

    const xDot = gsap.quickTo(dotEl, "x", { duration: 0.12, ease: "power3" });
    const yDot = gsap.quickTo(dotEl, "y", { duration: 0.12, ease: "power3" });
    const xRing = gsap.quickTo(ringEl, "x", { duration: 0.42, ease: "power3" });
    const yRing = gsap.quickTo(ringEl, "y", { duration: 0.42, ease: "power3" });

    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        // hide the native cursor only once the custom one is actually tracking
        document.documentElement.classList.add("has-custom-cursor");
        gsap.to([dotEl, ringEl], { opacity: 1, duration: 0.3 });
      }
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
      const interactive = (e.target as Element)?.closest?.(
        "a,button,[data-cursor='hover'],input,textarea",
      );
      gsap.to(ringEl, { scale: interactive ? 1.9 : 1, duration: 0.3, ease: "power3" });
    };
    const leave = () => {
      shown = false;
      gsap.to([dotEl, ringEl], { opacity: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [reduced]);

  if (reduced || isMobile) return null;

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-[18px] -mt-[18px] h-9 w-9 rounded-full border border-steel/70 opacity-0 mix-blend-difference"
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-white opacity-0 mix-blend-difference"
      />
    </>
  );
}
