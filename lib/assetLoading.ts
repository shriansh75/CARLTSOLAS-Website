"use client";

/** Resolve after `ms`. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Resolve when web fonts are ready, or after a safety timeout. */
export function fontsReady(timeout = 4000): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return Promise.resolve();
  }
  return Promise.race([document.fonts.ready.then(() => undefined), delay(timeout)]);
}

/** Resolve once every image URL has loaded (or errored), or after a timeout. */
export function imagesReady(urls: string[], timeout = 4000): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const loads = urls.map(
    (src) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      }),
  );
  return Promise.race([Promise.all(loads).then(() => undefined), delay(timeout)]);
}

/**
 * Module-level HEAD-probe cache: each asset URL is checked once per session.
 * Fallback-first contract for the Rive/WebGL slots, heavy runtimes mount only
 * after the probed URL responds ok; failures leave the fallback permanent.
 */
const probeCache = new Map<string, Promise<boolean>>();

/** HEAD-check a same-origin asset URL, cached per session. */
export function headProbe(url: string): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  const cached = probeCache.get(url);
  if (cached) return cached;
  const result = fetch(url, { method: "HEAD" })
    .then((res) => res.ok)
    .catch(() => false);
  probeCache.set(url, result);
  return result;
}
