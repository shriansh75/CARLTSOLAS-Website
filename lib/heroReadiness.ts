"use client";

/**
 * Singleton bridge so the preloader can wait for the hero video before it
 * reveals the site. `HeroVideo` calls `markHeroReady()` once the clip fires
 * `canplaythrough`; the preloader awaits `heroReady(timeout)`, which resolves on
 * that signal OR a safety timeout, so it can never hang. This is what guarantees
 * the full-quality hero is buffered before the loader hands off (no poster pop).
 */
let resolveReady: (() => void) | null = null;
let ready = false;

const readyPromise = new Promise<void>((resolve) => {
  resolveReady = () => {
    if (ready) return;
    ready = true;
    resolve();
  };
});

/** Called by the hero video on `canplaythrough`. Idempotent. */
export function markHeroReady(): void {
  resolveReady?.();
}

export function isHeroReady(): boolean {
  return ready;
}

/** Resolve when the hero video is ready, or after `timeout` ms (safety net). */
export function heroReady(timeout = 18000): Promise<void> {
  return Promise.race([
    readyPromise,
    new Promise<void>((resolve) => {
      setTimeout(resolve, timeout);
    }),
  ]);
}
