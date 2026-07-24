"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIsMobile } from "@/lib/useIsMobile";
import { useMotionHold } from "@/components/providers/MotionHold";
import { markHeroReady } from "@/lib/heroReadiness";
import { site } from "@/content/site";

const { poster, posterWebp, mobilePoster, durationMs, crossfadeMs, sources } = site.heroVideo;
const CROSS_S = crossfadeMs / 1000;
const LOOP_AT = Math.max(0, (durationMs - crossfadeMs) / 1000); // seconds into the clip

type VFCVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: () => void) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

/**
 * Hero background. On handheld / touch devices the heavy ~1080p video is skipped
 * entirely and a single high-quality still is shown poster-only, so phones never
 * download or decode the clip.
 *
 * On desktop / fine-pointer it is the full-quality feed: poster-first for SSR,
 * then two stacked <video> of the same ~1080p encode that crossfade at the loop
 * seam for a seamless loop (frame-accurate via requestVideoFrameCallback with an
 * `ended` hard-swap safety net). The feed pauses when the hero scrolls offscreen,
 * when the tab is hidden, and under the global motion hold, and fully releases
 * its decoders on unmount. Autoplay refusal (e.g. Low Power Mode) shows a
 * tap-to-play control. Calls markHeroReady() so the preloader can wait for the
 * feed (desktop) or the still (mobile) before revealing the site.
 */
export function HeroVideo() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const { held } = useMotionHold();
  const heldRef = useRef(held);
  const [mounted, setMounted] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const controlRef = useRef<{ pause: () => void; resume: () => void } | null>(null);

  useEffect(() => setMounted(true), []);

  // Handheld is poster-only: there is no video to fire canplaythrough, so release
  // the preloader's hero gate as soon as we know we are on the mobile path.
  useEffect(() => {
    if (mounted && isMobile) markHeroReady();
  }, [mounted, isMobile]);

  useEffect(() => {
    if (!mounted || reduced || isMobile) return;
    const a = aRef.current as VFCVideo | null;
    const b = bRef.current as VFCVideo | null;
    if (!a || !b) return;

    let active = a;
    let standby = b;
    let crossing = false;
    let cancelled = false;
    let primed = false;
    let running = false;
    let inView = true;
    let rafId = 0;
    let rvfcId = 0;

    a.style.zIndex = "2";
    b.style.zIndex = "1";

    const cancelScheduled = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      if (rvfcId && typeof active.cancelVideoFrameCallback === "function") {
        active.cancelVideoFrameCallback(rvfcId);
        rvfcId = 0;
      }
    };

    const schedule = () => {
      if (cancelled || !running) return;
      if (typeof active.requestVideoFrameCallback === "function") {
        rvfcId = active.requestVideoFrameCallback(() => {
          rvfcId = 0;
          tick();
        });
      } else {
        rafId = window.requestAnimationFrame(() => {
          rafId = 0;
          tick();
        });
      }
    };

    const tick = () => {
      if (cancelled || !running) return;
      if (!crossing && active.currentTime >= LOOP_AT) {
        beginCross();
        return;
      }
      schedule();
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

    const shouldRun = () => inView && !heldRef.current && !document.hidden;

    const start = () => {
      if (cancelled || running || !shouldRun()) return;
      running = true;
      active.play().catch(() => {});
      schedule();
    };

    const stop = () => {
      running = false;
      cancelScheduled();
      a.pause();
      b.pause();
    };

    controlRef.current = { pause: stop, resume: start };

    const prime = () => {
      if (primed || cancelled) return;
      primed = true;
      markHeroReady();
      a.style.transition = "opacity 0.6s linear";
      a.style.opacity = "1"; // fade the feed up over the poster
      // stand up the standby off the warm cache (no second download until now)
      if (a.currentSrc) {
        b.src = a.currentSrc;
        b.load();
      }
      start();
    };

    const onEnded = () => {
      if (!crossing && running) beginCross();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    // pause the decode loop while the hero is scrolled out of view
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              inView = entry.isIntersecting;
              if (inView) start();
              else stop();
            },
            { rootMargin: "0px" },
          )
        : null;
    io?.observe(a);

    a.addEventListener("canplaythrough", prime, { once: true });
    a.addEventListener("ended", onEnded);
    b.addEventListener("ended", onEnded);
    document.addEventListener("visibilitychange", onVisibility);

    a.play().catch(() => {
      // autoplay refused (Low Power Mode / Data Saver): poster + manual start
      markHeroReady();
      setNeedsGesture(true);
    });
    if (a.readyState >= 4) prime();

    return () => {
      cancelled = true;
      running = false;
      cancelScheduled();
      io?.disconnect();
      a.removeEventListener("canplaythrough", prime);
      a.removeEventListener("ended", onEnded);
      b.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", onVisibility);
      // release both hardware decoders
      [a, b].forEach((v) => {
        v.pause();
        v.removeAttribute("src");
        v.load();
      });
      controlRef.current = null;
    };
  }, [mounted, reduced, isMobile]);

  // reflect the global motion hold into the running feed
  useEffect(() => {
    heldRef.current = held;
    if (held) controlRef.current?.pause();
    else controlRef.current?.resume();
  }, [held]);

  const manualStart = () => {
    setNeedsGesture(false);
    aRef.current?.play().catch(() => setNeedsGesture(true));
  };

  // Handheld gets the vessel still; everything else gets the video poster frame.
  const posterEl = isMobile ? (
    <picture>
      <source srcSet={mobilePoster.webp} type="image/webp" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mobilePoster.jpg}
        alt=""
        aria-hidden
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </picture>
  ) : (
    <picture>
      <source srcSet={posterWebp} type="image/webp" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        aria-hidden
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </picture>
  );

  if (!mounted || reduced || isMobile) {
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
      {needsGesture && (
        <button
          type="button"
          onClick={manualStart}
          className="pointer-events-auto absolute bottom-6 right-6 z-[3] border border-steel/30 bg-ink/70 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-steel transition-colors hover:border-accent hover:text-white"
        >
          Play Feed
        </button>
      )}
    </div>
  );
}
