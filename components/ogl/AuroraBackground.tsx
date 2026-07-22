"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { LazyMount } from "@/components/ui/LazyMount";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMotionHold } from "@/components/providers/MotionHold";

/** ogl stays out of the shared bundle: loaded on demand, client only. */
const Aurora = dynamic(() => import("./Aurora").then((m) => m.Aurora), { ssr: false });

// navy, accent, steel: a restrained electric-blue aurora on the dark footer
const COLOR_STOPS: [string, string, string] = ["#082030", "#1d5bd8", "#78b0f0"];

function AuroraLive() {
  const { held } = useMotionHold();
  const [docHidden, setDocHidden] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setDocHidden(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const active = inView && !held && !docHidden;

  return (
    <div ref={ref} className="absolute inset-0">
      <Aurora colorStops={COLOR_STOPS} amplitude={1.15} blend={0.5} speed={0.5} active={active} />
    </div>
  );
}

/** OGL aurora background, fallback-first. Under reduced motion nothing mounts
 *  (the static bg-ink is the fallback). */
export function AuroraBackground() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <LazyMount rootMargin="200px" className="absolute inset-0">
      <AuroraLive />
    </LazyMount>
  );
}
