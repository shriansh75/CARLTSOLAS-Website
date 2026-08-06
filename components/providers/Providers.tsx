"use client";

import { type ReactNode } from "react";
import { LoaderGateProvider } from "./LoaderGate";
import { MotionHoldProvider } from "./MotionHold";
import { SmoothScroll } from "./SmoothScroll";
import { Preloader } from "@/components/loader/Preloader";
import { Grain } from "@/components/ui/Grain";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Header } from "@/components/chrome/Header";

/** Composes global providers + persistent chrome around the page. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <LoaderGateProvider>
      <MotionHoldProvider>
        {/* #main exists on every route (home + legal); #top is hero-only */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
        >
          Skip to content
        </a>
        <Header />
        <SmoothScroll>{children}</SmoothScroll>
        <Grain />
        <CustomCursor />
        {/* The visible HOLD control was removed at the client's instruction
            (2026-08-06) after the WCAG 2.2.2 implication was raised. The
            MotionHold provider and every useMotionHold() consumer stay wired,
            so restoring a control is a one-line change here. The marquee runs
            on CSS keyframes, so the global prefers-reduced-motion block still
            stops ambient motion for users who set that preference. */}
        <Preloader />
      </MotionHoldProvider>
    </LoaderGateProvider>
  );
}
