"use client";

import { useEffect, useRef, type ElementType, type FC, type ReactNode, type Ref } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion";
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
  // R3F's global JSX augmentation collapses bare ElementType JSX props to never,
  // so typecheck against the exact props this component passes. No runtime change.
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

    const ctx = gsap.context(() => {
      const tween = () => {
        doneRef.current = true;
        gsap.to(el, {
          duration: Math.max(DUR.cross, text.length * 0.02),
          delay,
          ease: EASE.soft,
          scrambleText: { text, chars: GLYPHS, speed: 0.4, revealDelay: 0.05 },
        });
      };
      if (controlled) {
        tween();
      } else {
        ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: tween });
      }
    }, ref);
    return () => ctx.revert();
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
