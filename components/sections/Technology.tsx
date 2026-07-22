"use client";

import { SectionIndex } from "@/components/ui/SectionIndex";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TickFrame } from "@/components/ui/TickFrame";
import { TechCenterpiece } from "@/components/three/TechCenterpiece";
import { site } from "@/content/site";

/** Technology section — CARLTSOLAS's two production-ready software offerings.
 *  Outcome-focused copy only; no tools, frameworks or methodology disclosed. */
export function Technology() {
  const t = site.technology;

  return (
    <section id="technology" data-nav-theme="dark" className="relative overflow-hidden bg-ink text-white">
      <div
        className="u-grid-bg pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_bottom,black,transparent_70%)]"
        aria-hidden
      />
      {/* WebGL blueprint centerpiece (fallback-first, reduced-motion safe) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.72] [mask-image:radial-gradient(ellipse_62%_74%_at_50%_46%,black,transparent)]"
        aria-hidden
      >
        <TechCenterpiece />
      </div>
      <div className="u-shell relative py-[clamp(5rem,12vh,10rem)]">
        <SectionIndex label={t.eyebrow} variant="onDark" className="mb-10" />

        <TextReveal
          as="h2"
          text={t.heading}
          stagger={0.022}
          className="max-w-4xl text-[clamp(1.5rem,3.2vw,2.8rem)] font-medium leading-[1.12] tracking-[-0.01em] text-white"
        />

        <Reveal>
          <p className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-white/55">{t.lede}</p>
        </Reveal>

        {/* offering cards */}
        <Reveal
          selector="[data-reveal]"
          stagger={0.1}
          className="mt-14 grid gap-px overflow-hidden border border-[var(--hairline)] bg-[var(--hairline)] md:grid-cols-2"
        >
          {t.offerings.map((o) => (
            <article
              key={o.title}
              data-reveal
              data-cursor="hover"
              className="group relative flex flex-col bg-ink p-8 md:p-10"
            >
              <TickFrame />
              <h3 className="text-xl font-medium text-white md:text-2xl">
                <span className="relative inline-block">
                  {o.title}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-expo group-hover:scale-x-100 [@media(hover:none)]:scale-x-100" />
                </span>
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55 md:text-[0.95rem]">
                {o.body}
              </p>
            </article>
          ))}
        </Reveal>

        <div className="mt-14">
          <MagneticButton href="#contact" ariaLabel={t.cta}>
            <span>{t.cta}</span>
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
