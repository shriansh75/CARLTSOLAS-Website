"use client";

import dynamic from "next/dynamic";
import { LazyMount } from "@/components/ui/LazyMount";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** three/R3F stay out of the shared bundle: loaded on demand, client only. */
const BlueprintLines = dynamic(() => import("./BlueprintLines").then((m) => m.BlueprintLines), {
  ssr: false,
  loading: () => <StaticBlueprint />,
});

/**
 * Static body-plan linework: the permanent fallback for reduced motion and
 * missing WebGL, and the placeholder while the R3F chunk loads. Decorative.
 */
function StaticBlueprint() {
  const stations = [0, 1, 2, 3, 4, 5];
  return (
    <svg aria-hidden viewBox="0 0 400 300" className="h-full w-full" fill="none" preserveAspectRatio="xMidYMid meet">
      <g stroke="rgb(var(--steel))" strokeOpacity="0.3" strokeWidth="1">
        {stations.map((i) => (
          <path key={`r${i}`} d={`M200 252 C ${210 + i * 22} 252 ${222 + i * 26} ${214 - i * 6} ${216 + i * 22} ${128 + i * 3}`} />
        ))}
        {stations.map((i) => (
          <path key={`l${i}`} d={`M200 252 C ${190 - i * 22} 252 ${178 - i * 26} ${214 - i * 6} ${184 - i * 22} ${128 + i * 3}`} />
        ))}
        <line x1="56" y1="252" x2="344" y2="252" />
        <line x1="200" y1="118" x2="200" y2="260" />
      </g>
      <line x1="70" y1="182" x2="330" y2="182" stroke="rgb(var(--accent))" strokeOpacity="0.6" strokeWidth="1.4" />
    </svg>
  );
}

/** WebGL blueprint centerpiece with fallback-first mounting. Never mounts the
 *  canvas under reduced motion. */
export function TechCenterpiece() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <StaticBlueprint />
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <LazyMount rootMargin="200px" className="h-full w-full" placeholder={<StaticBlueprint />}>
        <BlueprintLines />
      </LazyMount>
    </div>
  );
}
