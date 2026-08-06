import Link from "next/link";
import { MarinePageHero } from "./MarinePageHero";
import { splitEyebrow } from "@/components/legal/eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { TickFrame } from "@/components/ui/TickFrame";
import { NodeMarker } from "@/components/ui/NodeMarker";
import { Decode } from "@/components/ui/Decode";
import { Footer } from "@/components/chrome/Footer";
import { CtaLink } from "./CtaLink";
import { MarineGrid } from "./MarineGrid";
import { cn } from "@/lib/cn";
import type { ServiceImage, ServicePageContent } from "@/content/types";

/**
 * Shared shell for every Marine route (the landing page and the two service
 * pages). Sections below the intro are optional, so each page renders only what
 * its content object declares. Section order and nav themes are fixed here so
 * the light/dark rhythm stays consistent and the header can always resolve a
 * theme band.
 */
export function MarinePage({ content }: { content: ServicePageContent }) {
  const intro = splitEyebrow(content.intro.eyebrow);
  const cta = splitEyebrow(content.cta.eyebrow);

  return (
    <>
      <main id="main" tabIndex={-1}>
        <MarinePageHero
          eyebrow={content.eyebrow}
          heading={content.heading}
          lede={content.lede}
          breadcrumb={content.breadcrumb}
          image={content.heroImage}
        />

        {/* intro, light surface */}
        <section data-nav-theme="light" className="bg-surface">
          <div className="u-shell py-[clamp(4.5rem,10vh,8rem)]">
            <SectionIndex index={intro.index} label={intro.label} variant="onLight" />
            <div className="mt-10 grid gap-x-16 gap-y-8 lg:grid-cols-12">
              {/* Heading spans the full width; below it the copy and a
                  CONTAINED image sit side by side. Previously the heading and
                  image shared the wide 7-column track while three paragraphs
                  were squeezed into the narrow 5-column one, which made the
                  image the widest element on the page below the hero. */}
              <h2 className="font-sans text-[clamp(1.5rem,3vw,2.5rem)] font-medium leading-[1.14] tracking-[-0.01em] text-navy lg:col-span-12">
                <TextReveal text={content.intro.heading} stagger={0.022} />
              </h2>
              <Reveal className="flex flex-col gap-4 lg:col-span-6">
                {content.intro.paragraphs.map((p) => (
                  <p key={p} className="text-[0.9375rem] leading-[1.75] text-slate">
                    {p}
                  </p>
                ))}
              </Reveal>
              {content.introImage ? (
                <Reveal className="lg:col-span-5 lg:col-start-8" y={32}>
                  <FramedImage image={content.introImage} ratio="aspect-[4/3]" />
                </Reveal>
              ) : null}
            </div>
            {content.intro.chips?.length ? (
              <Reveal selector="[data-chip]" stagger={0.06} className="mt-12 flex flex-wrap gap-2">
                {content.intro.chips.map((chip) => (
                  <span
                    key={chip}
                    data-chip
                    className="border border-navy/15 px-3 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-slate"
                  >
                    {chip}
                  </span>
                ))}
              </Reveal>
            ) : null}
          </div>
        </section>

        {/* four-tile bento, identical on every Marine page */}
        {content.feature?.images.length ? (
          <MarineGrid images={content.feature.images} caption={content.feature.caption} />
        ) : null}

        {/* service cards (landing page), dark */}
        {content.services ? (
          <SectionBand
            eyebrow={content.services.eyebrow}
            heading={content.services.heading}
            lede={content.services.lede}
          >
            <Reveal
              selector="[data-reveal]"
              stagger={0.1}
              className="mt-14 grid gap-px overflow-hidden border border-[var(--hairline)] bg-[var(--hairline)] md:grid-cols-2"
            >
              {content.services.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-reveal
                  data-cursor="hover"
                  className="group relative flex flex-col bg-ink p-8 transition-colors duration-300 hover:bg-ink-2 md:p-10"
                >
                  <TickFrame />
                  <span className="font-mono text-[0.5625rem] uppercase tracking-[0.22em] text-meta">
                    {item.meta}
                  </span>
                  <h3 className="mt-5 text-xl font-medium text-white md:text-2xl">
                    <span className="relative inline-block">
                      {item.title}
                      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-expo group-hover:scale-x-100 [@media(hover:none)]:scale-x-100" />
                    </span>
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55 md:text-[0.95rem]">
                    {item.summary}
                  </p>
                  <span
                    aria-hidden
                    className="mt-8 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-steel transition-transform duration-300 group-hover:translate-x-1"
                  >
                    View service →
                  </span>
                </Link>
              ))}
            </Reveal>
          </SectionBand>
        ) : null}

        {/* capabilities / scope, dark */}
        {content.capabilities ? (
          <SectionBand
            eyebrow={content.capabilities.eyebrow}
            heading={content.capabilities.heading}
            lede={content.capabilities.lede}
          >
            <Reveal selector="[data-reveal]" stagger={0.08} className="mt-14 border-t border-[var(--hairline)]">
              {content.capabilities.items.map((item) => (
                <div
                  key={item.no}
                  data-reveal
                  data-cursor="hover"
                  className="group grid grid-cols-[3rem_1fr] items-baseline gap-x-5 gap-y-3 border-b border-[var(--hairline)] py-7 md:grid-cols-[5rem_1fr_1.1fr] md:gap-x-10"
                >
                  <Decode text={item.no} className="font-mono text-sm leading-normal text-steel" />
                  <h3 className="text-lg font-medium text-white md:text-xl">
                    <span className="relative inline-block">
                      {item.title}
                      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-expo group-hover:scale-x-100 [@media(hover:none)]:scale-x-100" />
                    </span>
                  </h3>
                  <div className="col-start-2 md:col-start-3">
                    <p className="text-sm leading-relaxed text-white/55 transition-colors duration-300 group-hover:text-white/75 md:text-[0.95rem] [@media(hover:none)]:text-white/75">
                      {item.body}
                    </p>
                    {item.chips?.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.chips.map((chip) => (
                          <span
                            key={chip}
                            className="border border-[var(--hairline)] px-2.5 py-1 font-mono text-[0.5rem] uppercase tracking-[0.18em] text-meta"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </Reveal>
          </SectionBand>
        ) : null}

        {/* process, light */}
        {content.process ? (
          <section data-nav-theme="light" className="bg-surface">
            <div className="u-shell py-[clamp(4.5rem,10vh,8rem)]">
              <ProcessHeader
                eyebrow={content.process.eyebrow}
                heading={content.process.heading}
                lede={content.process.lede}
              />
              <Reveal
                selector="[data-reveal]"
                stagger={0.09}
                className="mt-14 grid gap-px overflow-hidden border border-navy/10 bg-navy/10 md:grid-cols-2 lg:grid-cols-4"
              >
                {content.process.steps.map((step) => (
                  <div
                    key={step.no}
                    data-reveal
                    data-cursor="hover"
                    className="group relative flex flex-col bg-surface p-7 transition-colors duration-300 hover:bg-white"
                  >
                    <TickFrame />
                    <div className="flex items-center gap-3">
                      <NodeMarker filled />
                      <Decode
                        text={step.no}
                        className="font-mono text-[0.625rem] uppercase leading-normal tracking-[0.22em] text-accent"
                      />
                    </div>
                    <h3 className="mt-5 text-base font-medium leading-snug text-navy">
                      <span className="relative inline-block">
                        {step.title}
                        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-expo group-hover:scale-x-100 [@media(hover:none)]:scale-x-100" />
                      </span>
                    </h3>
                    <p className="mt-3 text-[0.875rem] leading-[1.7] text-slate">{step.body}</p>
                  </div>
                ))}
              </Reveal>
            </div>
          </section>
        ) : null}

        {/* proof, dark */}
        {content.proof ? (
          <SectionBand
            eyebrow={content.proof.eyebrow}
            heading={content.proof.heading}
            lede={content.proof.lede}
          >
            <Reveal selector="[data-reveal]" stagger={0.08} className="mt-14 border-t border-[var(--hairline)]">
              {content.proof.points.map((point) => (
                <div
                  key={point.title}
                  data-reveal
                  data-cursor="hover"
                  className="group flex flex-col gap-2 border-b border-[var(--hairline)] py-6 md:flex-row md:items-baseline md:justify-between md:gap-10"
                >
                  <h3 className="text-base font-medium text-white md:w-1/3">
                    <span className="relative inline-block">
                      {point.title}
                      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-expo group-hover:scale-x-100 [@media(hover:none)]:scale-x-100" />
                    </span>
                  </h3>
                  <p className="text-sm leading-relaxed text-white/55 transition-colors duration-300 group-hover:text-white/75 md:flex-1 [@media(hover:none)]:text-white/75">
                    {point.detail}
                  </p>
                  {point.meta ? (
                    <span className="shrink-0 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-steel transition-colors duration-300 group-hover:text-white">
                      {point.meta}
                    </span>
                  ) : null}
                </div>
              ))}
            </Reveal>
            {content.proof.note ? (
              <Reveal className="mt-8 max-w-3xl">
                <p className="font-mono text-[0.625rem] leading-[1.9] tracking-[0.06em] text-meta">
                  {content.proof.note}
                </p>
              </Reveal>
            ) : null}
          </SectionBand>
        ) : null}

        {/* CTA, dark */}
        <section data-nav-theme="dark" className="relative overflow-hidden bg-ink">
          <div
            className="u-grid-bg pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
            aria-hidden
          />
          <div className="u-shell relative py-[clamp(4rem,9vh,7rem)]">
            <SectionIndex index={cta.index} label={cta.label} variant="onDark" />
            <h2 className="mt-8 max-w-3xl text-[clamp(1.5rem,3.4vw,2.6rem)] font-medium leading-[1.12] tracking-[-0.01em] text-white">
              <TextReveal text={content.cta.heading} stagger={0.022} />
            </h2>
            <Reveal className="mt-6 max-w-2xl">
              <p className="text-[0.95rem] leading-relaxed text-white/55">{content.cta.body}</p>
            </Reveal>
            <Reveal className="mt-12 flex flex-wrap items-center gap-4" delay={0.1}>
              <CtaLink href={content.cta.primary.href} label={content.cta.primary.label} primary />
              {content.cta.secondary ? (
                <CtaLink href={content.cta.secondary.href} label={content.cta.secondary.label} />
              ) : null}
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/**
 * Content image inside the drafting-bracket frame, so photography inherits the
 * same visual language as the cards rather than floating loose in the layout.
 * Below the fold by definition, hence lazy.
 */
function FramedImage({ image, ratio }: { image: ServiceImage; ratio: string }) {
  return (
    <div className="relative overflow-hidden border border-navy/10">
      <TickFrame />
      <picture>
        <source srcSet={image.webp} type="image/webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.jpg}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          className={cn("w-full object-cover", ratio)}
        />
      </picture>
    </div>
  );
}

/** Dark band with the standard section header. */
function SectionBand({
  eyebrow,
  heading,
  lede,
  children,
}: {
  eyebrow: string;
  heading: string;
  lede?: string;
  children: React.ReactNode;
}) {
  const { index, label } = splitEyebrow(eyebrow);
  return (
    <section data-nav-theme="dark" className="relative overflow-hidden bg-ink">
      <div
        className="u-grid-bg pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_at_bottom,black,transparent_70%)]"
        aria-hidden
      />
      <div className="u-shell relative py-[clamp(4.5rem,10vh,8rem)]">
        <SectionIndex index={index} label={label} variant="onDark" />
        <h2 className="mt-8 max-w-4xl text-[clamp(1.5rem,3.2vw,2.6rem)] font-medium leading-[1.14] tracking-[-0.01em] text-white">
          <TextReveal text={heading} stagger={0.022} />
        </h2>
        {lede ? (
          <Reveal className="mt-6 max-w-2xl">
            <p className="text-[0.95rem] leading-relaxed text-white/55">{lede}</p>
          </Reveal>
        ) : null}
        {children}
      </div>
    </section>
  );
}

function ProcessHeader({ eyebrow, heading, lede }: { eyebrow: string; heading: string; lede?: string }) {
  const { index, label } = splitEyebrow(eyebrow);
  return (
    <>
      <SectionIndex index={index} label={label} variant="onLight" />
      <h2 className="mt-8 max-w-4xl font-sans text-[clamp(1.5rem,3vw,2.4rem)] font-medium leading-[1.14] tracking-[-0.01em] text-navy">
        <TextReveal text={heading} stagger={0.022} />
      </h2>
      {lede ? (
        <Reveal className="mt-6 max-w-2xl">
          <p className="text-[0.9375rem] leading-[1.75] text-slate">{lede}</p>
        </Reveal>
      ) : null}
    </>
  );
}

