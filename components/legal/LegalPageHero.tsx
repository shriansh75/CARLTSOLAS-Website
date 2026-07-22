"use client";

import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { splitEyebrow } from "./eyebrow";

/** Dark blueprint hero for the legal pages: breadcrumb, section marker, masked
 *  heading, and lede over the measurement grid. Matches the site's hero language
 *  without the video. */
export function LegalPageHero({
  eyebrow,
  heading,
  lede,
  breadcrumb,
}: {
  eyebrow: string;
  heading: string;
  lede: string;
  breadcrumb: string;
}) {
  const { index, label } = splitEyebrow(eyebrow);

  return (
    <section
      data-nav-theme="dark"
      className="relative flex min-h-[56svh] flex-col justify-end overflow-hidden bg-ink"
    >
      <div
        className="u-grid-bg absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,transparent_45%,rgba(8,16,32,0.55)_100%)]"
        aria-hidden
      />
      <div className="u-shell relative pb-[clamp(2.5rem,6vh,4.5rem)] pt-36">
        <p className="mb-7 font-mono text-[0.5625rem] uppercase tracking-[0.28em] text-meta">
          {breadcrumb}
        </p>
        <SectionIndex index={index} label={label} variant="onDark" />
        <h1 className="mt-6 max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-white">
          <TextReveal text={heading} play />
        </h1>
        <Reveal className="mt-6 max-w-xl" delay={0.2}>
          <p className="text-[clamp(1rem,1.6vw,1.25rem)] leading-snug text-white/75">{lede}</p>
        </Reveal>
      </div>
    </section>
  );
}
