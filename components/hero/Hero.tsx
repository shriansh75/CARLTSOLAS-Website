"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIsMobile } from "@/lib/useIsMobile";
import { useLoaderGate } from "@/components/providers/LoaderGate";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { HeroVideo } from "./HeroVideo";
import { BlueprintOverlay } from "./BlueprintOverlay";
import { HeroContent } from "./HeroContent";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Mobile shows a static poster (no video), so skip the scale/parallax scrub
    // entirely — scaling a full-screen media layer every scroll frame is one of
    // the most expensive mobile effects. Desktop uses scrub:true (position maps
    // straight to scroll, no catch-up tween) so the heavy video layer never keeps
    // recompositing after the gesture stops — a numeric scrub reintroduced a
    // slight scroll trail here.
    if (reduced || isMobile) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true } as const;
      gsap.to(mediaRef.current, { yPercent: 12, scale: 1.12, ease: "none", scrollTrigger: trigger });
      gsap.to(".hero-content", { yPercent: -6, opacity: 0.12, ease: "none", scrollTrigger: trigger });
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced, isMobile]);

  return (
    <section ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden bg-ink" id="top" data-nav-theme="dark">
      <div ref={mediaRef} className={cn("absolute inset-0", !reduced && !isMobile && "will-change-transform")}>
        <HeroVideo />
      </div>
      <BlueprintOverlay />
      <div className="hero-content absolute inset-0 z-10">
        <HeroContent />
      </div>
      <ScrollCue />
    </section>
  );
}

function ScrollCue() {
  const { revealed } = useLoaderGate();
  return (
    <div
      className={cn(
        "absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 transition-opacity delay-1000 duration-1000 sm:flex",
        revealed ? "opacity-100" : "opacity-0",
      )}
    >
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/85 [text-shadow:0_1px_6px_rgba(8,16,32,0.75)]">
        {site.hero.scroll}
      </span>
      <span className="block h-10 w-px overflow-hidden bg-white/25">
        <span className="block h-full w-full origin-top bg-steel [animation:scroll-cue_2.2s_var(--ease-io)_infinite]" />
      </span>
    </div>
  );
}
