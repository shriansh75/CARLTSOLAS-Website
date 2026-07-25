"use client";

import { useMotionHold } from "@/components/providers/MotionHold";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

interface ShinyTextProps {
  text: string;
  className?: string;
}

/**
 * A single glint sweeping across text. Adapted from React Bits ShinyText, but
 * driven by a CSS keyframe instead of the original's per-frame JS loop.
 *
 * This is a continuous (>5s) ambient animation that runs on every device,
 * mobile included, so it honors the global motion hold (WCAG 2.2.2) and
 * collapses to flat steel type under reduced motion.
 */
export function ShinyText({ text, className }: ShinyTextProps) {
  const { held } = useMotionHold();
  const reduced = useReducedMotion();

  // reduced motion: plain type inheriting the parent colour, no gradient or glint
  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      className={cn(
        "bg-clip-text text-transparent [background-size:200%_auto] [animation:shiny-text_5s_linear_infinite]",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(110deg, rgb(var(--steel)) 0%, rgb(var(--steel)) 42%, #ffffff 50%, rgb(var(--steel)) 58%, rgb(var(--steel)) 100%)",
        animationPlayState: held ? "paused" : "running",
      }}
    >
      {text}
    </span>
  );
}
