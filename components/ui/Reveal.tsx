"use client";

import { useEffect, useRef, type ElementType, type FC, type ReactNode, type Ref } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion";
import { observeOnce } from "@/lib/inView";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  y?: number;
  delay?: number;
  start?: string;
  stagger?: number;
  /** If set, animate matching descendants (staggered) instead of the element itself. */
  selector?: string;
};

/** Generic scroll-in reveal (opacity + rise). Honors reduced motion. */
export function Reveal({
  children,
  as,
  className,
  y = 26,
  delay = 0,
  start = "top 85%",
  stagger = 0,
  selector,
}: Props) {
  // Typecheck Tag against the exact props this component passes, so a polymorphic
  // `as` still accepts a ref. No runtime change.
  const Tag = ((as ?? "div") as ElementType) as FC<{
    ref: Ref<HTMLElement>;
    className?: string;
    children?: ReactNode;
  }>;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;
    const targets: Element[] = selector
      ? Array.from(el.querySelectorAll(selector))
      : [el];
    if (!targets.length) return;

    if (reduced) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(targets, { opacity: 0, y });
    // One-shot visibility: IntersectionObserver, not ScrollTrigger. See lib/inView.
    return observeOnce(
      el,
      () => gsap.to(targets, { opacity: 1, y: 0, duration: DUR.base, ease: EASE.soft, delay, stagger }),
      start,
    );
  }, [reduced, y, delay, start, stagger, selector]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
