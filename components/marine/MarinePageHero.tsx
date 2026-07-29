"use client";

import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { splitEyebrow } from "@/components/legal/eyebrow";
import { HeroSchematic } from "./HeroSchematic";
import { BodyPlanSchematic, DavitSchematic, VesselProfileSchematic } from "./schematics";
import type { ServiceImage, ServicePageContent } from "@/content/types";

const SCHEMATICS = {
  bodyPlan: BodyPlanSchematic,
  vesselProfile: VesselProfileSchematic,
  davit: DavitSchematic,
} as const;

/**
 * Dark hero for the Marine service pages.
 *
 * Layer stack, back to front: ink ground, optional photograph under its
 * legibility scrim, the measurement grid, the route's naval-architecture
 * schematic, an accent bloom for depth, then top and bottom scrims that keep
 * the type readable over all of it. Everything is CSS or SVG - no WebGL
 * context is created here; the footer aurora stays the only one on the site.
 *
 * Type scale note: the heading was clamp(2.2rem, 5.4vw, 4.25rem), which suits
 * a two-word title but wrapped these sentence-length service headings onto
 * four lines and swamped the viewport. The cap is lower and the measure
 * tighter so headings settle at two or three lines.
 */
export function MarinePageHero({
  eyebrow,
  heading,
  lede,
  breadcrumb,
  image,
  schematic,
}: {
  eyebrow: string;
  heading: string;
  lede: string;
  breadcrumb: string;
  image?: ServiceImage;
  schematic?: ServicePageContent["schematic"];
}) {
  const { index, label } = splitEyebrow(eyebrow);
  const Schematic = schematic ? SCHEMATICS[schematic] : null;

  return (
    <section
      data-nav-theme="dark"
      className="relative flex min-h-[64svh] flex-col justify-end overflow-hidden bg-ink md:min-h-[72svh]"
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
          <div className="absolute inset-0 bg-ink/55" aria-hidden />
        </>
      ) : null}

      <div
        className="u-grid-bg absolute inset-0 opacity-[0.3] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
        aria-hidden
      />

      {Schematic ? (
        <HeroSchematic className="[mask-image:linear-gradient(to_top,transparent_4%,black_42%,black_82%,transparent_100%)]">
          <Schematic className={image ? "opacity-30" : "opacity-70"} />
        </HeroSchematic>
      ) : null}

      {/* single soft bloom: depth without another paint-heavy layer */}
      <div
        className="absolute inset-0 bg-[radial-gradient(58%_52%_at_76%_26%,rgba(29,91,216,0.22),transparent_68%)]"
        aria-hidden
      />

      {/* legibility scrims, mirroring the home hero's BlueprintOverlay grade */}
      <div
        className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-ink via-ink/70 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink/72 via-ink/20 to-transparent"
        aria-hidden
      />

      <div className="u-shell relative pb-[clamp(2.75rem,6vh,4.5rem)] pt-32">
        <p className="mb-7 font-mono text-[0.5625rem] uppercase tracking-[0.28em] text-meta">
          {breadcrumb}
        </p>
        <SectionIndex index={index} label={label} variant="onDark" />
        <h1 className="mt-8 max-w-[46rem] text-[clamp(1.85rem,3.4vw,3.05rem)] font-semibold leading-[1.08] tracking-[-0.018em] text-white [text-shadow:0_2px_16px_rgba(8,16,32,0.45)] [text-wrap:balance]">
          <TextReveal text={heading} play />
        </h1>
        <Reveal className="mt-6 max-w-[38rem]" delay={0.2}>
          <p className="text-[clamp(0.95rem,1.25vw,1.1rem)] leading-relaxed text-white/70">{lede}</p>
        </Reveal>
      </div>
    </section>
  );
}
