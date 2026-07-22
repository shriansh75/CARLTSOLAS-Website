"use client";

import { cn } from "@/lib/cn";

interface ShinyTextProps {
  text: string;
  className?: string;
}

/**
 * A single glint sweeping across text. Adapted from React Bits ShinyText, but
 * driven by a CSS keyframe instead of the original's per-frame JS loop (lighter,
 * and it collapses to a static gradient under the global reduced-motion rule).
 * Steel base with one white glint, single-accent-safe.
 */
export function ShinyText({ text, className }: ShinyTextProps) {
  return (
    <span
      className={cn(
        "bg-clip-text text-transparent [background-size:200%_auto] [animation:shiny-text_5s_linear_infinite]",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(110deg, rgb(var(--steel)) 0%, rgb(var(--steel)) 42%, #ffffff 50%, rgb(var(--steel)) 58%, rgb(var(--steel)) 100%)",
      }}
    >
      {text}
    </span>
  );
}
