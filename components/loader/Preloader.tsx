"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { registerGsap, gsap } from "@/lib/gsap";
import { useLoaderGate } from "@/components/providers/LoaderGate";
import { fontsReady, imagesReady, delay } from "@/lib/assetLoading";
import { heroReady } from "@/lib/heroReadiness";
import { MOBILE_QUERY } from "@/lib/useIsMobile";
import { site } from "@/content/site";
import { BlueprintHull } from "./BlueprintHull";
import { LoaderReadout } from "./LoaderReadout";

/** Minimum on-screen time (ms) so the cinematic sequence never truncates.
 *  ~6.6s floor + ~1.4s exit wipe ≈ 8s total. */
const MIN_DURATION = 6600;

/** Upper bound (ms) the loader waits for the full-quality hero video to buffer
 *  before revealing anyway, so it can never hang on a slow connection. */
const HERO_TIMEOUT = 18000;

/** Mobile is poster-only (no video to buffer), so the hero gate resolves on the
 *  still — never keep a phone scroll-locked waiting on a clip it won't load. */
const MOBILE_HERO_TIMEOUT = 6000;

/**
 * "Blueprint-to-Render" preloader. Draws the hull body plan, ticks the drafting
 * callouts + counter, then dissolves the linework and wipes up to the hero.
 * Gated on fonts + poster + the hero video (canplaythrough) AND a ~8s floor, so
 * the full-quality hero is buffered before reveal; short-circuited for reduced
 * motion. Every wait is timeout-raced, so it can never hang.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const { reveal } = useLoaderGate();
  const [done, setDone] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Off-home routes (the legal pages) never run the hero "Blueprint-to-Render"
  // sequence: they have no hero video, so the video gate would stall to its
  // timeout. Reveal immediately and unlock scroll.
  useEffect(() => {
    if (isHome || startedRef.current) return;
    startedRef.current = true;
    reveal();
    setDone(true);
  }, [isHome, reveal]);

  useEffect(() => {
    if (!isHome) return;
    const root = rootRef.current;
    // Run the sequence exactly once. React StrictMode double-invokes effects in
    // development; without this guard the synthetic unmount's ctx.revert() would
    // tear the timeline down and freeze the loader. Production runs it once too.
    if (!root || startedRef.current) return;
    startedRef.current = true;
    registerGsap();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia(MOBILE_QUERY).matches;

    const counterEl = root.querySelector<HTMLElement>(".pl-counter");
    const setCounter = (v: number) => {
      if (counterEl) counterEl.textContent = String(Math.round(v)).padStart(2, "0");
    };

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      reveal();
      setDone(true);
    };

    let mainTl: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      // reduced motion: static blueprint, brief hold, fade out
      if (reduced) {
        gsap.set([".hull-line", ".hull-dwl"], { strokeDashoffset: 0 });
        gsap.set(".pl-grid", { opacity: 1 });
        setCounter(100);
        return;
      }

      gsap.set([".pl-eyebrow", ".pl-callout"], { opacity: 0, y: 10 });
      gsap.set(".pl-word", { yPercent: 125 });
      gsap.set(".hull-label", { opacity: 0 });

      const counter = { v: 0 };
      const tl = gsap.timeline();
      tl.to(".pl-grid", { opacity: 1, duration: 1.2, ease: "power2.out" }, 0);
      tl.to(".pl-eyebrow", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.35);
      tl.to(".pl-callout", { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out" }, 0.5);
      tl.to(".pl-word", { yPercent: 0, duration: 0.9, stagger: 0.12, ease: "expo.out" }, 0.6);
      tl.to(".hull-line", { strokeDashoffset: 0, duration: 2.8, stagger: 0.1, ease: "power2.inOut" }, 1.3);
      tl.to(".hull-dwl", { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, "<+=0.9");
      tl.to(".hull-label", { opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }, 2.7);
      tl.to(counter, { v: 99, duration: 6.0, ease: "power1.inOut", onUpdate: () => setCounter(counter.v) }, 0.6);
      mainTl = tl;
    }, root);

    // reduced motion: hold briefly, then fade out to the hero
    if (reduced) {
      gsap.to(root, { opacity: 0, duration: 0.5, delay: 1.5, ease: "power2.in", onComplete: finish });
      return;
    }

    const startExit = () => {
      ctx.add(() => {
        const counter = { v: 99 };
        const ex = gsap.timeline({ onComplete: finish });
        ex.to(counter, { v: 100, duration: 0.4, onUpdate: () => setCounter(counter.v) }, 0);
        ex.to([".hull-line", ".hull-dwl"], { opacity: 0, duration: 0.6, ease: "power2.in" }, 0.1);
        ex.to([".pl-fade", ".pl-grid"], { opacity: 0, duration: 0.55, ease: "power2.in" }, 0.15);
        ex.to(root, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.95, ease: "power4.inOut" }, 0.45);
      });
    };

    Promise.all([
      fontsReady(4000),
      imagesReady([isMobile ? site.heroVideo.mobilePoster.jpg : site.heroVideo.poster], 4000),
      heroReady(isMobile ? MOBILE_HERO_TIMEOUT : HERO_TIMEOUT),
      delay(MIN_DURATION),
    ])
      .then(() => {
        if (mainTl && mainTl.progress() < 1) {
          mainTl.eventCallback("onComplete", startExit);
        } else {
          startExit();
        }
      })
      .catch(() => {
        // never leave the site scroll-locked if gating ever rejects
        startExit();
      });
  }, [reveal, isHome]);

  if (!isHome || done) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      className="fixed inset-0 z-[80] overflow-hidden bg-ink"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <span className="sr-only">Loading CARLTSOLAS Engineering, please wait.</span>
      <div className="pl-grid u-grid-bg absolute inset-0 opacity-0" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(8,16,32,0.92)_100%)]"
        aria-hidden
      />
      <div className="absolute left-1/2 top-1/2 w-[min(760px,86vw)] -translate-x-1/2 -translate-y-1/2">
        <BlueprintHull />
      </div>
      <LoaderReadout />
    </div>
  );
}
