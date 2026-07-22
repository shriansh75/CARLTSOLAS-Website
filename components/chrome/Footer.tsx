"use client";

import Link from "next/link";
import { TextReveal } from "@/components/ui/TextReveal";
import { AuroraBackground } from "@/components/ogl/AuroraBackground";
import { BlueprintMark } from "@/components/rive/BlueprintMark";
import { site } from "@/content/site";

/** Contact / CTA footer. Business contact only (no personal PII). */
export function Footer() {
  const f = site.footer;

  return (
    <footer id="contact" data-nav-theme="dark" className="relative overflow-hidden bg-ink text-white">
      {/* OGL aurora background (React Bits, adapted), fallback-first + masked */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.6] [mask-image:radial-gradient(120%_100%_at_50%_0%,black,transparent_72%)]"
        aria-hidden
      >
        <AuroraBackground />
      </div>
      <div className="u-shell relative py-[clamp(4rem,10vh,8rem)]">
        <div className="flex items-center gap-4">
          <BlueprintMark size={44} className="shrink-0 text-steel" />
          <div className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-meta">
            <span className="h-1.5 w-1.5 bg-flare" />
            <span>{site.coords}</span>
          </div>
        </div>

        <TextReveal
          as="h2"
          text={f.tagline}
          stagger={0.03}
          className="mt-8 max-w-4xl text-[clamp(2rem,5.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.02em] text-white"
        />

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
          <a
            href={`mailto:${f.email}`}
            className="inline-flex min-h-[24px] items-center text-white underline-offset-4 transition-colors hover:text-steel hover:underline"
            data-cursor="hover"
          >
            {f.email}
          </a>
          <a
            href={`https://${f.web}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[24px] items-center text-white underline-offset-4 transition-colors hover:text-steel hover:underline"
            data-cursor="hover"
          >
            {f.web}
          </a>
          <span className="text-meta">{f.location}</span>
        </div>

        <div className="mt-20 border-t border-[var(--hairline)] pt-8 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-meta">
          {/* instrument / drawing-block row */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <span>{f.legal}</span>
            <span>
              DWG NO. {site.drawing.no} · {site.drawing.disciplines}
            </span>
          </div>

          {/* copyright + legal links (the only place these are surfaced) */}
          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
            <span>{f.copyright}</span>
            <nav aria-label="Legal" className="flex gap-6">
              <Link
                href={site.legal.privacy.href}
                className="transition-colors hover:text-white"
                data-cursor="hover"
              >
                {site.legal.privacy.label}
              </Link>
              <Link
                href={site.legal.terms.href}
                className="transition-colors hover:text-white"
                data-cursor="hover"
              >
                {site.legal.terms.label}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
