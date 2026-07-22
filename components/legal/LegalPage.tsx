import { LegalPageHero } from "./LegalPageHero";
import { splitEyebrow } from "./eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { CompassRose } from "@/components/ui/CompassRose";
import { Footer } from "@/components/chrome/Footer";
import type { LegalPageContent } from "@/content/types";

/**
 * Shared legal-page shell (Privacy, Terms). Blueprint hero, the body sections on
 * the light surface under the effective-date line, then the final section as the
 * dark closing band with the datum rosette, then the footer. Uses the site's own
 * TextReveal / Reveal / SectionIndex primitives and the section-aware nav themes.
 */
export function LegalPage({
  content,
  breadcrumb,
}: {
  content: LegalPageContent;
  breadcrumb: string;
}) {
  const body = content.sections.slice(0, -1);
  const closing = content.sections[content.sections.length - 1];
  const closingEy = splitEyebrow(closing.eyebrow);

  return (
    <>
      <main id="main">
        <LegalPageHero
          eyebrow={content.eyebrow}
          heading={content.heading}
          lede={content.lede}
          breadcrumb={breadcrumb}
        />

        {/* body sections on the light surface */}
        <section data-nav-theme="light" className="bg-surface">
          <div className="u-shell py-[clamp(4.5rem,10vh,8rem)]">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-slate">
              {content.effectiveDate}
            </p>
            <div className="mt-14 flex max-w-3xl flex-col gap-14">
              {body.map((section) => {
                const { index, label } = splitEyebrow(section.eyebrow);
                return (
                  <div key={section.eyebrow}>
                    <SectionIndex index={index} label={label} variant="onLight" />
                    <h2 className="mt-6 font-sans text-[clamp(1.375rem,2.4vw,1.875rem)] font-medium leading-tight tracking-[-0.01em] text-navy">
                      <TextReveal text={section.heading} />
                    </h2>
                    <Reveal className="mt-5 flex flex-col gap-4">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="text-[0.9375rem] leading-[1.75] text-slate">
                          {paragraph}
                        </p>
                      ))}
                    </Reveal>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* closing / contact band */}
        <section data-nav-theme="dark" className="bg-ink">
          <div className="u-shell py-[clamp(4rem,9vh,7rem)]">
            <SectionIndex index={closingEy.index} label={closingEy.label} variant="onDark" />
            <div className="mt-10 flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-12">
              <CompassRose size={96} className="shrink-0 text-steel" />
              <div className="flex flex-col gap-4">
                <h2 className="font-sans text-[clamp(1.375rem,2.6vw,2rem)] font-medium leading-tight text-white">
                  <TextReveal text={closing.heading} />
                </h2>
                <Reveal className="flex flex-col gap-3">
                  {closing.paragraphs.map((paragraph, i) => (
                    <p
                      key={paragraph}
                      className={
                        i === closing.paragraphs.length - 1
                          ? "font-mono text-[0.6875rem] tracking-[0.18em] text-steel"
                          : "max-w-xl text-[0.9375rem] leading-[1.7] text-white/70"
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
