"use client";

import { Fragment, useEffect, useRef, type ElementType, type FC, type ReactNode, type Ref } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { observeOnce } from "@/lib/inView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  wordClassName?: string;
  /** Controlled trigger. If a boolean, animate when true; if undefined, use scroll. */
  play?: boolean;
  delay?: number;
  stagger?: number;
  start?: string;
};

/**
 * Word-level masked reveal (words rise into a clip mask). Robust — no line
 * measurement needed. Scroll-triggered by default, or controlled via `play`.
 */
export function TextReveal({
  text,
  as,
  className,
  wordClassName,
  play,
  delay = 0,
  stagger = STAGGER.words,
  start = "top 82%",
}: Props) {
  // Typecheck Tag against the exact props this component passes, so a polymorphic
  // `as` still accepts a ref. No runtime change.
  const Tag = ((as ?? "span") as ElementType) as FC<{
    ref: Ref<HTMLElement>;
    className?: string;
    children?: ReactNode;
  }>;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const words = text.split(" ");

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>("[data-word]");
    if (!targets.length) return;

    if (reduced) {
      gsap.set(targets, { yPercent: 0, opacity: 1 });
      return;
    }

    gsap.set(targets, { yPercent: 118 });
    const run = () => {
      // Promote imperatively, at trigger time. `will-change` used to sit in the
      // static class, so EVERY word on the page held a compositor layer from
      // first paint and only released it in `onComplete` — words never scrolled
      // to kept theirs for the whole session, and the controlled `play={false}`
      // path never released at all. Asking for a layer just before the tween is
      // the only point at which the promise is worth anything.
      gsap.set(targets, { willChange: "transform" });
      gsap.to(targets, {
        yPercent: 0,
        duration: DUR.reveal,
        ease: EASE.expo,
        stagger,
        delay,
        // release the compositor layer once the word has landed (mobile layer budget)
        onComplete: () => gsap.set(targets, { willChange: "auto" }),
      });
    };

    if (typeof play === "boolean") {
      if (play) run();
      return;
    }

    // One-shot visibility: IntersectionObserver, not ScrollTrigger. See lib/inView.
    return observeOnce(el, run, start);
  }, [reduced, play, delay, stagger, start]);

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
              {/* No `will-change` here: it is applied imperatively at trigger
                  time (see the effect) so unscrolled words hold no layer. */}
              <span data-word className={cn("inline-block", wordClassName)}>
                {w}
              </span>
            </span>
            {i < words.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
