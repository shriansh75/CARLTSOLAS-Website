"use client";

import { SectionIndex } from "@/components/ui/SectionIndex";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { NodeMarker } from "@/components/ui/NodeMarker";
import { site } from "@/content/site";

/** Teaser 1 — group story + three pillars (light section). */
export function Positioning() {
  const p = site.positioning;

  return (
    <section id="company" data-nav-theme="light" className="relative bg-surface text-navy">
      <div className="u-shell py-[clamp(5rem,12vh,10rem)]">
        <SectionIndex label={p.eyebrow} variant="onLight" className="mb-12" />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <TextReveal
              as="h2"
              text={p.heading}
              stagger={0.022}
              className="text-[clamp(1.6rem,3.4vw,3rem)] font-medium leading-[1.1] tracking-[-0.01em] text-navy"
            />
          </div>
          <div className="lg:col-span-4 lg:pt-3">
            <Reveal>
              <p className="text-[0.98rem] leading-relaxed text-slate">{p.body}</p>
            </Reveal>
          </div>
        </div>

        {/* group relationship */}
        <Reveal className="mt-16 flex flex-col items-stretch gap-4 md:flex-row md:items-center" y={20}>
          <div className="flex-1 rounded-lg border border-navy/15 bg-white/50 p-6">
            <div className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-slate">
              {p.parent.meta}
            </div>
            <div className="mt-2 text-lg font-medium text-navy">{p.parent.name}</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 text-accent md:flex-row">
            <span className="h-6 w-px bg-accent/40 md:h-px md:w-12" />
            <NodeMarker filled />
            <span className="h-6 w-px bg-accent/40 md:h-px md:w-12" />
          </div>
          <div className="flex-1 rounded-lg border border-accent/40 bg-white/50 p-6">
            <div className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent">
              {p.child.meta}
            </div>
            <div className="mt-2 text-lg font-medium text-navy">{p.child.name}</div>
          </div>
        </Reveal>

        {/* pillars */}
        <Reveal
          selector="[data-reveal]"
          stagger={0.12}
          className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-navy/10 bg-navy/10 md:grid-cols-3"
        >
          {p.pillars.map((pillar) => (
            <div key={pillar.no} data-reveal className="bg-surface p-8">
              <span className="font-mono text-sm text-accent">{pillar.no}</span>
              <h3 className="mt-4 text-lg font-medium text-navy">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">{pillar.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
