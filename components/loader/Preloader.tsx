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

/** Full first-visit floor (ms) so the cinematic sequence never truncates.
 *  ~6.6s floor + ~1.4s exit wipe ≈ 8s total. The intro timeline below is tuned
 *  to exactly this length, which is why shortening one without the other does
 *  nothing: the gate would clear early and then sit waiting on the animation. */
const FULL_MS = 6600;

/** Repeat-visit floor (ms). Not a truncation — `SCALE` compresses the whole
 *  timeline to fit, so the same sequence plays as a faster cut. Nobody wants the
 *  full overture on their third page view of the session. */
const SHORT_MS = 2200;

/** Session flag marking "this browser tab has already watched the loader".
 *  sessionStorage, not localStorage: a genuine return visit on a later day
 *  should still get the full piece. */
const SEEN_KEY = "cs:loader-seen";

/** Safari in private mode throws on storage access, so both sides are guarded
 *  and simply fall back to the full sequence. */
function hasSeenLoader(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markLoaderSeen(): void {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage unavailable: every load gets the full sequence, which is safe */
  }
}

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

    // Repeat visits inside the same tab get a compressed cut, not a truncated
    // one: SCALE multiplies EVERY duration, stagger and position below, so the
    // choreography is identical and simply plays faster. Shortening the floor
    // alone would just leave the gate waiting on an unchanged timeline.
    const minMs = hasSeenLoader() ? SHORT_MS : FULL_MS;
    const SCALE = minMs / FULL_MS;
    // The exit wipe is compressed more gently — below about 0.6 it stops
    // reading as a wipe and starts reading as a flicker.
    const EXIT_SCALE = Math.max(SCALE, 0.6);

    const counterEl = root.querySelector<HTMLElement>(".pl-counter");
    const setCounter = (v: number) => {
      if (counterEl) counterEl.textContent = String(Math.round(v)).padStart(2, "0");
    };

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      // Only mark it seen once the sequence has actually played through, so an
      // abandoned or errored load does not rob the next one of the full piece.
      markLoaderSeen();
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
      // Every number below is scaled, including the relative position on
      // .hull-dwl — miss one and the repeat-visit cut desynchronises.
      tl.to(".pl-grid", { opacity: 1, duration: 1.2 * SCALE, ease: "power2.out" }, 0);
      tl.to(".pl-eyebrow", { opacity: 1, y: 0, duration: 0.7 * SCALE, ease: "power2.out" }, 0.35 * SCALE);
      tl.to(
        ".pl-callout",
        { opacity: 1, y: 0, duration: 0.7 * SCALE, stagger: 0.12 * SCALE, ease: "power2.out" },
        0.5 * SCALE,
      );
      tl.to(
        ".pl-word",
        { yPercent: 0, duration: 0.9 * SCALE, stagger: 0.12 * SCALE, ease: "expo.out" },
        0.6 * SCALE,
      );
      tl.to(
        ".hull-line",
        { strokeDashoffset: 0, duration: 2.8 * SCALE, stagger: 0.1 * SCALE, ease: "power2.inOut" },
        1.3 * SCALE,
      );
      tl.to(
        ".hull-dwl",
        { strokeDashoffset: 0, duration: 1.4 * SCALE, ease: "power2.inOut" },
        `<+=${0.9 * SCALE}`,
      );
      tl.to(
        ".hull-label",
        { opacity: 1, duration: 0.5 * SCALE, stagger: 0.05 * SCALE, ease: "power2.out" },
        2.7 * SCALE,
      );
      tl.to(
        counter,
        { v: 99, duration: 6.0 * SCALE, ease: "power1.inOut", onUpdate: () => setCounter(counter.v) },
        0.6 * SCALE,
      );
      mainTl = tl;
    }, root);

    // reduced motion: hold briefly, then fade out to the hero
    if (reduced) {
      gsap.to(root, {
        opacity: 0,
        duration: 0.5,
        delay: 1.5 * SCALE,
        ease: "power2.in",
        onComplete: finish,
      });
      return;
    }

    const startExit = () => {
      ctx.add(() => {
        const counter = { v: 99 };
        const ex = gsap.timeline({ onComplete: finish });
        ex.to(counter, { v: 100, duration: 0.4 * EXIT_SCALE, onUpdate: () => setCounter(counter.v) }, 0);
        ex.to(
          [".hull-line", ".hull-dwl"],
          { opacity: 0, duration: 0.6 * EXIT_SCALE, ease: "power2.in" },
          0.1 * EXIT_SCALE,
        );
        ex.to(
          [".pl-fade", ".pl-grid"],
          { opacity: 0, duration: 0.55 * EXIT_SCALE, ease: "power2.in" },
          0.15 * EXIT_SCALE,
        );
        ex.to(
          root,
          { clipPath: "inset(0% 0% 100% 0%)", duration: 0.95 * EXIT_SCALE, ease: "power4.inOut" },
          0.45 * EXIT_SCALE,
        );
      });
    };

    Promise.all([
      fontsReady(4000),
      imagesReady([isMobile ? site.heroVideo.mobilePoster.jpg : site.heroVideo.poster], 4000),
      heroReady(isMobile ? MOBILE_HERO_TIMEOUT : HERO_TIMEOUT),
      // The asset gate above stays the binding constraint on a slow link; this
      // is only the artistic floor, and it is the part that shortens on repeat.
      delay(minMs),
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
