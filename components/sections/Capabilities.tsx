"use client";

import { SectionIndex } from "@/components/ui/SectionIndex";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Marquee } from "@/components/ui/Marquee";
import { Decode } from "@/components/ui/Decode";
import { site } from "@/content/site";

type Line = (typeof site.capabilities.lines)[number];

/** Teaser 2 — the SOLASMODU capability lines (dark section). */
export function Capabilities() {
  const c = site.capabilities;

  return (
    <section id="capabilities" data-nav-theme="dark" className="relative overflow-hidden bg-ink text-white">
      <div
        className="u-grid-bg pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        aria-hidden
      />
      <div className="u-shell relative py-[clamp(5rem,12vh,10rem)]">
        <SectionIndex label={c.eyebrow} variant="onDark" className="mb-10" />

        <TextReveal
          as="h2"
          text={c.heading}
          stagger={0.022}
          className="max-w-4xl text-[clamp(1.5rem,3.2vw,2.8rem)] font-medium leading-[1.12] tracking-[-0.01em] text-white"
        />

        <Reveal>
          <p className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-white/55">{c.lede}</p>
        </Reveal>

        {/* capability lines */}
        <Reveal as="ul" selector="li" stagger={0.09} className="mt-14 border-t border-[var(--hairline)]">
          {c.lines.map((line) => (
            <li key={line.id}>
              <CapabilityRow line={line} />
            </li>
          ))}
        </Reveal>

        {/* credential badges */}
        <Reveal
          selector="[data-reveal]"
          stagger={0.08}
          className="mt-16 grid grid-cols-2 gap-px overflow-hidden border border-[var(--hairline)] bg-[var(--hairline)] md:grid-cols-4"
        >
          {c.badges.map((b) => (
            <div key={b.k} data-reveal className="bg-ink p-6">
              <div className="font-sans text-lg font-semibold text-white">{b.k}</div>
              <div className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-meta">
                {b.v}
              </div>
            </div>
          ))}
        </Reveal>

        {/* where CARLTSOLAS extends beyond the SOLAS MODU foundation */}
        <div className="mt-16 border-t border-[var(--hairline)] pt-8">
          <div className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-steel">
            <span className="h-1.5 w-1.5 bg-flare" />
            <span>{c.distinction.eyebrow}</span>
          </div>
          <Reveal
            selector="[data-reveal]"
            stagger={0.1}
            className="mt-8 grid gap-px overflow-hidden border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2"
          >
            {c.distinction.items.map((item) => (
              <div key={item.title} data-reveal className="bg-ink p-7">
                <h3 className="text-lg font-medium text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{item.body}</p>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="mt-14">
          <MagneticButton href="#contact" ariaLabel={c.cta}>
            <span>{c.cta}</span>
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </MagneticButton>
        </div>
      </div>

      <div aria-hidden>
        <Marquee duration={34} className="border-y border-[var(--hairline)] py-5" trackClassName="whitespace-nowrap">
          {c.marquee.map((w, i) => (
            <span
              key={i}
              className="flex items-center gap-8 pr-8 font-mono text-sm uppercase tracking-[0.2em] text-white/40"
            >
              {w}
              <span className="text-accent/50">/</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function CapabilityRow({ line }: { line: Line }) {
  return (
    <div
      data-cursor="hover"
      className="group grid grid-cols-[3.5rem_1fr] items-baseline gap-x-5 gap-y-2 border-b border-[var(--hairline)] py-7 md:grid-cols-[6rem_1fr_1.15fr] md:gap-x-10"
    >
      <Decode text={line.id} className="font-mono text-sm text-steel" />
      <h3 className="text-xl font-medium text-white md:text-2xl">
        <span className="relative inline-block">
          {line.title}
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-expo group-hover:scale-x-100 [@media(hover:none)]:scale-x-100" />
        </span>
      </h3>
      <p className="col-start-2 text-sm leading-relaxed text-white/50 transition-colors duration-300 group-hover:text-white/70 md:col-start-3 md:text-[0.95rem] [@media(hover:none)]:text-white/70">
        {line.scope}
      </p>
    </div>
  );
}
