"use client";

import { useEffect, useRef, type ElementType, type FC, type ReactNode, type Ref } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion";
import { observeOnce } from "@/lib/inView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

const GLYPHS = "▪01·/\\-+<>#ABCDEF";

interface DecodeProps {
  text: string;
  /** wait for this to become true (hero/loader handoff); default: scroll-triggered */
  play?: boolean;
  /** delay in seconds once triggered */
  delay?: number;
  as?: ElementType;
  className?: string;
}

/**
 * "Instrument acquiring a reading" reveal: mono text resolves left-to-right out
 * of a scramble (GSAP ScrambleText). Real text stays in the DOM for screen
 * readers; the animated copy is aria-hidden. Ported from the SOLAS MODU sibling.
 */
export function Decode({ text, play, delay = 0, as: Tag = "span", className }: DecodeProps) {
  // Typecheck Tag against the exact props this component passes, so a polymorphic
  // `as` still accepts a ref. No runtime change.
  const Comp = Tag as FC<{ ref: Ref<HTMLElement>; className?: string; children?: ReactNode }>;
  const ref = useRef<HTMLElement>(null);
  const doneRef = useRef(false);
  const reduced = useReducedMotion();
  const controlled = play !== undefined;

  useEffect(() => {
    registerGsap();
    const el = ref.current?.querySelector<HTMLElement>("[data-decode-target]");
    if (!el || doneRef.current) return;
    if (reduced) {
      el.textContent = text;
      return;
    }
    if (controlled && !play) return;

    let tween: gsap.core.Tween | null = null;
    const run = () => {
      doneRef.current = true;
      tween = gsap.to(el, {
        duration: Math.max(DUR.cross, text.length * 0.02),
        delay,
        ease: EASE.soft,
        scrambleText: { text, chars: GLYPHS, speed: 0.4, revealDelay: 0.05 },
      });
    };
    // Killing the tween (rather than reverting a gsap.context) leaves the node
    // alone, so we settle it on the real text: a context revert would restore
    // the placeholder and, with `doneRef` blocking a re-run, strand it blank.
    const settle = () => {
      if (!tween) return;
      tween.kill();
      el.textContent = text;
    };

    if (controlled) {
      run();
      return settle;
    }
    // One-shot visibility: IntersectionObserver, not ScrollTrigger. See lib/inView.
    const dispose = observeOnce(el, run, "top 88%");
    return () => {
      dispose();
      settle();
    };
  }, [text, play, controlled, delay, reduced]);

  return (
    <Comp ref={ref} className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden data-decode-target>
        {reduced ? text : " "}
      </span>
    </Comp>
  );
}
