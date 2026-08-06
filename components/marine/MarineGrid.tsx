import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import type { ServiceImage } from "@/content/types";

/**
 * Bento image grid, four tiles, identical on every Marine page.
 *
 * The point is that tile size is a property of the LAYOUT, not of the source
 * file. The band this replaces sized itself from the image: a single entry
 * skipped `md:grid-cols-2` and rendered a full-width 3:2 slab, which is how a
 * 1200px hull photograph ended up as the largest element on the page.
 * Here the grid owns a fixed height and every tile is `object-cover`, so no
 * image can balloon and all pages match.
 *
 *   md+           +---------------+-------+
 *                 |   A  2x2      |   B   |
 *                 |               +---+---+
 *                 |               | C | D |
 *                 +---------------+---+---+
 *   mobile        2 columns of square tiles
 *
 * Hairline lattice per the house idiom: the container carries the hairline
 * colour and `gap-px`, cells are opaque, and no cell has a border, so seams
 * are exactly 1px and never double up.
 */
export function MarineGrid({ images, caption }: { images: ServiceImage[]; caption?: string }) {
  if (!images.length) return null;
  const tiles = images.slice(0, 4);

  return (
    <section data-nav-theme="dark" className="relative overflow-hidden bg-ink">
      <div className="u-shell relative py-[clamp(3rem,7vh,5rem)]">
        <Reveal
          selector="[data-tile]"
          stagger={0.08}
          className={cn(
            "grid grid-cols-2 gap-px overflow-hidden border border-[var(--hairline)] bg-[var(--hairline)]",
            // Fixed band height at md+ so the bento proportions are stable and
            // no tile can grow with its source image.
            "md:h-[clamp(24rem,46vh,34rem)] md:grid-cols-4 md:grid-rows-2",
          )}
        >
          {tiles.map((img, i) => (
            <figure
              key={img.jpg}
              data-tile
              className={cn(
                "relative m-0 overflow-hidden bg-ink",
                // first tile is the 2x2 feature
                i === 0 && "col-span-2 md:col-span-2 md:row-span-2",
              )}
            >
              <picture>
                <source srcSet={img.webp} type="image/webp" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.jpg}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    "h-full w-full object-cover",
                    // mobile has no fixed band height, so tiles carry a ratio
                    i === 0 ? "aspect-[4/3] md:aspect-auto" : "aspect-square md:aspect-auto",
                  )}
                />
              </picture>
            </figure>
          ))}
        </Reveal>
        {caption ? (
          <Reveal className="mt-5">
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.22em] text-meta">
              {caption}
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
