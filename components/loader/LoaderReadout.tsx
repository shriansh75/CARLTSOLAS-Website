import { site } from "@/content/site";

/**
 * The loader's drafting HUD: coordinate eyebrow, drawing block, wordmark and
 * progress counter. Purely presentational — the Preloader animates its parts
 * by class name (.pl-eyebrow, .pl-callout, .pl-word, .pl-counter).
 */
export function LoaderReadout() {
  return (
    <div
      aria-hidden
      className="pl-fade pointer-events-none absolute inset-0 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-meta sm:text-[0.68rem] sm:tracking-[0.2em]"
    >
      {/* top-left — coordinates */}
      <div className="pl-eyebrow absolute left-[var(--gutter)] top-[var(--gutter)] flex items-center gap-3">
        <span className="h-1.5 w-1.5 bg-flare" />
        <span>{site.coords}</span>
      </div>

      {/* top-right — drawing block */}
      <div className="pl-callout absolute right-[var(--gutter)] top-[var(--gutter)] flex flex-col items-end gap-1 text-right">
        <span>DWG NO. {site.drawing.no}</span>
        <span className="text-white/40">SHEET {site.drawing.sheet}</span>
      </div>

      {/* wordmark */}
      <div className="absolute left-1/2 top-[15%] -translate-x-1/2 text-center">
        <span className="block overflow-hidden pb-[0.12em]">
          <span className="pl-word inline-block font-sans text-[clamp(1.9rem,6vw,3.4rem)] font-semibold tracking-tight text-white">
            {site.wordmark.primary}
          </span>
        </span>
        <span className="mt-1 block overflow-hidden">
          <span className="pl-word inline-block font-sans text-[clamp(0.6rem,1.6vw,0.9rem)] font-medium tracking-[0.55em] text-steel">
            {site.wordmark.secondary}
          </span>
        </span>
      </div>

      {/* bottom-left — title block */}
      <div className="pl-callout absolute bottom-[var(--gutter)] left-[var(--gutter)] flex max-w-[60vw] flex-col gap-1">
        <span className="text-white/70">{site.drawing.title}</span>
        <span>{site.drawing.disciplines}</span>
      </div>

      {/* bottom-right — counter */}
      <div className="absolute bottom-[var(--gutter)] right-[var(--gutter)] flex items-end gap-2">
        <span className="pl-counter font-sans text-[clamp(1.6rem,4vw,2.4rem)] font-medium leading-none text-white tabular-nums">
          00
        </span>
        <span className="pb-1">/ 100</span>
      </div>
    </div>
  );
}
