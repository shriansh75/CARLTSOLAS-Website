"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Marine CTA link with the home page's magnetic pull.
 *
 * Why not MagneticButton: it hardcodes its own pill styling and renders a
 * plain <a>. Passing overrides would double up, because lib/cn is clsx only
 * with no tailwind-merge, so conflicting utilities both survive and win by
 * stylesheet order. It would also force a full document load on internal
 * routes. This keeps the Marine styling and next/link, and borrows only the
 * gsap.quickTo treatment.
 */
export function CtaLink({
  href,
  label,
  primary,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
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
      xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
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
  }, [reduced]);

  const className = primary
    ? "group inline-flex min-h-[44px] items-center gap-3 rounded-full border border-steel/40 bg-white/5 px-7 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:border-accent hover:bg-accent/10"
    : "group inline-flex min-h-[44px] items-center gap-3 rounded-full border border-[var(--hairline)] px-7 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-white/70 transition-colors duration-300 hover:border-steel/60 hover:text-white";

  const inner = (
    <>
      <span>{label}</span>
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </>
  );

  if (href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a
        ref={(n) => {
          ref.current = n;
        }}
        href={href}
        className={className}
        data-cursor="hover"
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      ref={(n) => {
        ref.current = n;
      }}
      href={href}
      className={className}
      data-cursor="hover"
    >
      {inner}
    </Link>
  );
}
