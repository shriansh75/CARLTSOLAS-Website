"use client";

import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { splitEyebrow } from "@/components/legal/eyebrow";
import type { ServiceImage } from "@/content/types";

/**
 * Dark hero for the Marine service pages.
 *
 * Photography-first. When an image is supplied the only layers over it are the
 * scrims that keep the type legible: no measurement grid, no schematic, no
 * accent bloom. Those treatments were built for an empty navy hero and, over a
 * real photograph, they read as noise and cut the image's clarity.
 *
 * The blueprint fallback (grid + bloom) survives for the no-image case so the
 * component still degrades sensibly, but every Marine route ships a photo.
 *
 * Type scale: the heading was clamp(2.2rem, 5.4vw, 4.25rem), which suits a
 * two-word title but wrapped these sentence-length service headings onto four
 * lines. The cap is lower and the measure tighter so they settle at two or
 * three lines.
 */
export function MarinePageHero({
  eyebrow,
  heading,
  lede,
  breadcrumb,
  image,
}: {
  eyebrow: string;
  heading: string;
  lede: string;
  breadcrumb: string;
  image?: ServiceImage;
}) {
  const { index, label } = splitEyebrow(eyebrow);

  return (
    <section
      data-nav-theme="dark"
      className="relative flex min-h-[64svh] flex-col justify-end overflow-hidden bg-ink md:min-h-[74svh]"
    >
      {image ? (
        <>
          <picture>
            <source srcSet={image.webp} type="image/webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.jpg}
              alt={image.alt}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </picture>
          {/* Contrast stack. The copy is left-aligned inside u-shell, so a
              LEFT-WEIGHTED scrim protects it while leaving the right of the
              photograph clean — necessary now the heroes are bright (sunset
              sky, daylit tanker deck) rather than a dark engine room.
              The /72 and /12 steps only render because theme.opacity declares
              them; they emitted no CSS at all until 2026-08-06. */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/12"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-ink via-ink/72 to-transparent"
            aria-hidden
          />
        </>
      ) : (
        <>
          <div
            className="u-grid-bg absolute inset-0 opacity-[0.3] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(58%_52%_at_76%_26%,rgba(29,91,216,0.22),transparent_68%)]"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-ink via-ink/70 to-transparent"
            aria-hidden
          />
        </>
      )}

      <div className="u-shell relative pb-[clamp(2.75rem,6vh,4.5rem)] pt-32">
        {/* Both sit near the top of the frame, above the bottom scrim's reach,
            so they carry their own shadow rather than relying on it. */}
        <p className="mb-7 font-mono text-[0.5625rem] uppercase tracking-[0.28em] text-white/70 [text-shadow:0_1px_8px_rgba(8,16,32,0.7)]">
          {breadcrumb}
        </p>
        <div className="[text-shadow:0_1px_8px_rgba(8,16,32,0.7)]">
          <SectionIndex index={index} label={label} variant="onDark" />
        </div>
        <h1 className="mt-8 max-w-[46rem] text-[clamp(1.85rem,3.4vw,3.05rem)] font-semibold leading-[1.08] tracking-[-0.018em] text-white [text-shadow:0_2px_18px_rgba(8,16,32,0.5)] [text-wrap:balance]">
          <TextReveal text={heading} play />
        </h1>
        <Reveal className="mt-6 max-w-[38rem]" delay={0.2}>
          <p className="text-[clamp(0.95rem,1.25vw,1.1rem)] leading-relaxed text-white/75 [text-shadow:0_1px_10px_rgba(8,16,32,0.45)]">
            {lede}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
