import type { ReactNode } from "react";

/**
 * Remounts on every App Router navigation and fades the incoming route in with
 * a CSS animation, so there is no per-route JS runtime and nothing that touches
 * scroll performance. Opacity only, never transform, so ScrollTrigger pinning
 * inside a page stays valid. The global reduced-motion rule in globals.css
 * collapses the fade to instant. The persistent chrome (Header, Preloader,
 * cursor) lives in the root layout, outside this wrapper.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="u-route-fade">{children}</div>;
}
