"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { markHeroReady } from "@/lib/heroReadiness";
import { site } from "@/content/site";

const { poster, posterWebp, durationMs, crossfadeMs, sources } = site.heroVideo;
const CROSS_S = crossfadeMs / 1000;
const LOOP_AT = Math.max(0, (durationMs - crossfadeMs) / 1000); // seconds into the clip

type VFCVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: () => void) => number;
};

/**
 * Full-quality hero background. Poster-first for SSR + reduced motion, then two
 * stacked <video> elements of the same ~1080p encode that crossfade at the loop
 * seam for a seamless loop, so the clip keeps its original quality (no baked-in
 * crossfade) and every device gets the same high-fidelity feed. Frame-accurate
 * via requestVideoFrameCallback with an `ended` hard-swap safety net (worst case
 * is one hard cut, never a freeze). Calls markHeroReady() on canplaythrough so
 * the preloader can wait for the feed before revealing the site.
 */
export function HeroVideo() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || reduced) return;
    const a = aRef.current as VFCVideo | null;
    const b = bRef.current as VFCVideo | null;
    if (!a || !b) return;

    let active = a;
    let standby = b;
    let crossing = false;
    let cancelled = false;
    let primed = false;
    let rafId = 0;

    a.style.zIndex = "2";
    b.style.zIndex = "1";

    const prime = () => {
      if (primed || cancelled) return;
      primed = true;
      markHeroReady();
      a.style.transition = "opacity 0.6s linear";
      a.style.opacity = "1"; // fade the feed up over the poster
      a.play().catch(() => {});
      // stand up the standby off the warm cache (no second download until now)
      if (a.currentSrc) {
        b.src = a.currentSrc;
        b.load();
      }
    };

    const beginCross = () => {
      if (crossing || cancelled) return;
      crossing = true;
      const incoming = standby;
      const outgoing = active;
      incoming.currentTime = 0;
      incoming.style.transition = "none";
      incoming.style.opacity = "0";
      incoming.style.zIndex = "3";
      outgoing.style.zIndex = "2";
      incoming.play().catch(() => {});
      void incoming.offsetWidth; // reflow so the fade takes effect
      incoming.style.transition = `opacity ${CROSS_S}s linear`;
      incoming.style.opacity = "1";
      window.setTimeout(() => {
        if (cancelled) return;
        outgoing.pause();
        outgoing.currentTime = 0;
        outgoing.style.transition = "none";
        outgoing.style.opacity = "0";
        outgoing.style.zIndex = "1";
        active = incoming;
        standby = outgoing;
        crossing = false;
        schedule();
      }, crossfadeMs);
    };

    const tick = () => {
      if (cancelled) return;
      if (!crossing && active.currentTime >= LOOP_AT) {
        beginCross();
        return;
      }
      schedule();
    };

    const schedule = () => {
      if (cancelled) return;
      if (typeof active.requestVideoFrameCallback === "function") {
        active.requestVideoFrameCallback(() => tick());
      } else {
        rafId = window.requestAnimationFrame(() => tick());
      }
    };

    const onEnded = () => {
      if (!crossing) beginCross();
    };

    a.addEventListener("canplaythrough", prime, { once: true });
    a.addEventListener("ended", onEnded);
    b.addEventListener("ended", onEnded);
    a.play().catch(() => {});
    if (a.readyState >= 4) prime();
    schedule();

    return () => {
      cancelled = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      a.removeEventListener("canplaythrough", prime);
      a.removeEventListener("ended", onEnded);
      b.removeEventListener("ended", onEnded);
    };
  }, [mounted, reduced]);

  const posterEl = (
    <picture>
      <source srcSet={posterWebp} type="image/webp" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </picture>
  );

  if (!mounted || reduced) {
    return <div className="absolute inset-0">{posterEl}</div>;
  }

  return (
    <div className="absolute inset-0">
      {posterEl}
      <video
        ref={aRef}
        aria-hidden
        muted
        playsInline
        preload="auto"
        poster={poster}
        className="absolute inset-0 h-full w-full object-cover object-center opacity-0"
      >
        <source src={sources.webm} type="video/webm" />
        <source src={sources.mp4} type="video/mp4" />
      </video>
      <video
        ref={bRef}
        aria-hidden
        muted
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-0"
      />
    </div>
  );
}
