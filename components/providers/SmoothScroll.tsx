"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIsMobile } from "@/lib/useIsMobile";
import { useLoaderGate } from "./LoaderGate";

/**
 * Lenis smooth-scroll (desktop / fine-pointer) wired into the GSAP ticker so
 * ScrollTrigger stays in sync. Scroll is locked until the preloader reveals the
 * site. On touch/handheld devices — and under prefers-reduced-motion — Lenis is
 * NOT initialised: iOS native momentum scrolling is smoother than JS-driven
 * scroll and the benchmark sibling ships the same native-touch behaviour.
 * ScrollTrigger falls back to the native scroller automatically.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const { revealed } = useLoaderGate();
  const pathname = usePathname();
  const firstPath = useRef(true);

  useEffect(() => {
    registerGsap();
    if (reduced || isMobile) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;
    (window as unknown as { lenis?: Lenis }).lenis = lenis;
    lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, [reduced, isMobile]);

  useEffect(() => {
    if (!revealed) return;
    lenisRef.current?.start();
    // recalculate ScrollTrigger start/end once the loader has lifted and
    // fonts/layout have settled, so below-the-fold reveals measure correctly
    ScrollTrigger.refresh();
    // honor a #hash on the initial load (e.g. a shared /#technology link);
    // native scrollIntoView when Lenis is off (touch)
    const hash = window.location.hash;
    if (hash && document.querySelector(hash)) {
      requestAnimationFrame(() => {
        const lenis = lenisRef.current;
        if (lenis) lenis.scrollTo(hash, { offset: 0 });
        else document.querySelector(hash)?.scrollIntoView();
      });
    }
  }, [revealed]);

  // On a client-side route change, honor a #hash target or reset to the top,
  // then re-measure ScrollTrigger for the freshly mounted route.
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    requestAnimationFrame(() => {
      const hash = window.location.hash;
      const targetEl = hash ? document.querySelector(hash) : null;
      const lenis = lenisRef.current;
      if (lenis) lenis.scrollTo(targetEl ? hash : 0, { immediate: true });
      else if (targetEl) targetEl.scrollIntoView();
      else window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    });
  }, [pathname]);

  return <>{children}</>;
}
