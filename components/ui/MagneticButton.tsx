"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
  ariaLabel?: string;
};

/** Button/link that eases toward the cursor on hover. */
export function MagneticButton({
  children,
  href,
  onClick,
  className,
  strength = 0.35,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "expo.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "expo.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [reduced, strength]);

  const cls = cn(
    "group relative inline-flex items-center gap-3 rounded-full border border-steel/30 bg-white/[0.02] px-6 py-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:border-steel/70 hover:bg-white/[0.06]",
    className,
  );

  if (href) {
    return (
      <a
        ref={(n) => {
          ref.current = n;
        }}
        href={href}
        className={cls}
        data-cursor="hover"
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      ref={(n) => {
        ref.current = n;
      }}
      type="button"
      onClick={onClick}
      className={cls}
      data-cursor="hover"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
