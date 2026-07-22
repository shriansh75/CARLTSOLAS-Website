"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useLoaderGate } from "./LoaderGate";

/**
 * Lenis smooth-scroll wired into the GSAP ticker so ScrollTrigger stays in
 * sync. Scroll is locked until the preloader reveals the site, and disabled
 * entirely under prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reduced = useReducedMotion();
  const { revealed } = useLoaderGate();
  const pathname = usePathname();
  const firstPath = useRef(true);

  useEffect(() => {
    registerGsap();
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
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
  }, [reduced]);

  useEffect(() => {
    if (!revealed) return;
    lenisRef.current?.start();
    // recalculate ScrollTrigger start/end once the loader has lifted and
    // fonts/layout have settled, so below-the-fold reveals measure correctly
    ScrollTrigger.refresh();
    // honor a #hash on the initial load (e.g. a shared /#technology link)
    const hash = window.location.hash;
    if (hash && document.querySelector(hash)) {
      requestAnimationFrame(() => lenisRef.current?.scrollTo(hash, { offset: 0 }));
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
      const target = hash && document.querySelector(hash) ? hash : 0;
      const lenis = lenisRef.current;
      if (lenis) lenis.scrollTo(target, { immediate: true });
      else window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    });
  }, [pathname]);

  return <>{children}</>;
}
