"use client";

import { type ReactNode } from "react";
import { LoaderGateProvider } from "./LoaderGate";
import { MotionHoldProvider } from "./MotionHold";
import { SmoothScroll } from "./SmoothScroll";
import { Preloader } from "@/components/loader/Preloader";
import { Grain } from "@/components/ui/Grain";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { MotionHoldToggle } from "@/components/ui/MotionHoldToggle";
import { Header } from "@/components/chrome/Header";

/** Composes global providers + persistent chrome around the page. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <LoaderGateProvider>
      <MotionHoldProvider>
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
        >
          Skip to content
        </a>
        <Header />
        <SmoothScroll>{children}</SmoothScroll>
        <Grain />
        <CustomCursor />
        <MotionHoldToggle />
        <Preloader />
      </MotionHoldProvider>
    </LoaderGateProvider>
  );
}
