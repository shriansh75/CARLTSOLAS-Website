"use client";

import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { headProbe } from "@/lib/assetLoading";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** The Rive runtime is only imported once its .riv asset is confirmed present. */
const RiveCanvas = dynamic(() => import("./RiveCanvas").then((m) => m.RiveCanvas), { ssr: false });

type Phase = "probing" | "live" | "fallback";

interface RiveIconProps {
  /** self-hosted /rive/*.riv */
  src: string;
  stateMachine?: string;
  size?: number;
  className?: string;
  /** always-rendered SVG twin; the permanent render until the asset ships */
  fallback: ReactNode;
}

/**
 * Fallback-first Rive slot. HEAD-probes the .riv before loading the runtime, so
 * the @rive-app chunk (and its wasm) never loads unless a licensed asset is
 * present in /public/rive. Until then, and always under reduced motion, the SVG
 * twin renders and the strict CSP is untouched.
 */
export function RiveIcon({ src, stateMachine, size = 96, className, fallback }: RiveIconProps) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("probing");

  useEffect(() => {
    if (reduced) {
      setPhase("fallback");
      return;
    }
    let alive = true;
    headProbe(src).then((ok) => {
      if (alive) setPhase(ok ? "live" : "fallback");
    });
    return () => {
      alive = false;
    };
  }, [src, reduced]);

  return (
    <span className={className} style={{ display: "inline-block", width: size, height: size }}>
      {phase === "live" ? <RiveCanvas src={src} stateMachine={stateMachine} /> : fallback}
    </span>
  );
}
