"use client";

import { RiveIcon } from "./RiveIcon";
import { CompassRose } from "@/components/ui/CompassRose";

/**
 * Footer datum mark. Plays /rive/datum.riv when that asset ships; until then
 * (and always under reduced motion) the CompassRose SVG twin is the permanent
 * render. Rive is wired and ready; no licensed .riv asset ships today.
 */
export function BlueprintMark({ size = 44, className }: { size?: number; className?: string }) {
  return (
    <RiveIcon
      src="/rive/datum.riv"
      stateMachine="idle"
      size={size}
      className={className}
      fallback={<CompassRose size={size} />}
    />
  );
}
