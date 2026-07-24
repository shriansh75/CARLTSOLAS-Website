"use client";

import { useLoaderGate } from "@/components/providers/LoaderGate";
import { TextReveal } from "@/components/ui/TextReveal";
import { ShinyText } from "@/components/ui/ShinyText";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";

/** Hero type layer — reveals after the preloader lifts (via `revealed`). */
export function HeroContent() {
  const { revealed } = useLoaderGate();

  return (
    <div className="u-shell flex h-full flex-col justify-end pb-[clamp(2.5rem,9vh,6rem)] pt-[22vh] sm:pt-[28vh]">
      <h1 className="sr-only">CARLTSOLAS Engineering Private Limited</h1>

      {/* eyebrow */}
      <div
        className={cn(
          "mb-7 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-steel transition-opacity duration-1000",
          revealed ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="h-1.5 w-1.5 bg-flare" />
        <ShinyText text={site.hero.eyebrow} />
      </div>

      {/* wordmark */}
      <div aria-hidden className="leading-[0.92]">
        <TextReveal
          text={site.wordmark.primary}
          play={revealed}
          delay={0.1}
          className="block"
          wordClassName="text-[clamp(2.4rem,12.5vw,11rem)] font-semibold tracking-[-0.02em] text-white [text-shadow:0_2px_16px_rgba(8,16,32,0.55),0_1px_3px_rgba(8,16,32,0.4)]"
        />
        <TextReveal
          text={site.wordmark.secondary}
          play={revealed}
          delay={0.28}
          className="mt-2 block"
          wordClassName="text-[clamp(0.7rem,2.1vw,1.5rem)] font-medium uppercase tracking-[0.2em] text-steel sm:tracking-[0.32em]"
        />
      </div>

      {/* tagline + group line */}
      <div className="mt-10 flex flex-col gap-6 border-t border-[var(--hairline)] pt-7 [text-shadow:0_1px_12px_rgba(8,16,32,0.7)] md:flex-row md:items-end md:justify-between md:gap-16">
        <TextReveal
          as="p"
          text={site.hero.tagline}
          play={revealed}
          delay={0.5}
          stagger={0.03}
          className="max-w-xl text-[clamp(0.9rem,1.35vw,1.2rem)] font-normal leading-snug text-white"
        />
        <span
          className={cn(
            "shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-meta transition-opacity delay-700 duration-1000",
            revealed ? "opacity-100" : "opacity-0",
          )}
        >
          {site.group}
        </span>
      </div>
    </div>
  );
}
