"use client";

import { useEffect, useState } from "react";

/**
 * Handheld / touch tier: coarse-pointer or narrow-viewport devices (phones,
 * most tablets). A comma list matches if ANY branch does, mirroring the SOLAS
 * MODU benchmark's device-class test.
 */
export const MOBILE_QUERY = "(hover: none), (pointer: coarse), (max-width: 767px)";

/**
 * Reactive "is this a handheld/touch device" flag. Mirrors `useReducedMotion`:
 * returns false on the server and the first client render, then updates after
 * mount (so there is no hydration mismatch). Treated as a first-class fallback
 * tier alongside reduced motion, so the heavy ambient layer (hero video, WebGL,
 * film grain, Lenis smooth-scroll) never runs on phones.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}
