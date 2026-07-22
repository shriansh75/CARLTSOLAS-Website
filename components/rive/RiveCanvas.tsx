"use client";

import { useRive, RuntimeLoader } from "@rive-app/react-canvas";

// Self-host the wasm so the strict CSP never needs a CDN. Only reached once a
// .riv asset is confirmed present (see RiveIcon), so this chunk stays unloaded
// until a licensed asset is dropped into /public/rive.
if (typeof window !== "undefined") {
  RuntimeLoader.setWasmUrl("/rive/rive.wasm");
}

/** The live Rive surface. Loaded on demand only when its .riv asset exists. */
export function RiveCanvas({ src, stateMachine }: { src: string; stateMachine?: string }) {
  const { RiveComponent } = useRive({
    src,
    stateMachines: stateMachine,
    autoplay: true,
  });
  return <RiveComponent className="h-full w-full" />;
}
