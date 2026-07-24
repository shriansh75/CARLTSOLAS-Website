"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

let registered = false;

/** Register GSAP plugins once, client-side only. */
export function registerGsap(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
  // iOS Safari fires resize continuously as the URL bar shows/hides while
  // scrolling; without this every ScrollTrigger re-measures mid-gesture and
  // reflows the page, which was a primary source of the mobile scroll jank.
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

export { gsap, ScrollTrigger };
