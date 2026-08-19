import { Reveal } from "@/components/ui/Reveal";
import { Pic } from "@/components/ui/Pic";
import { cn } from "@/lib/cn";
import type { ServiceImage } from "@/content/types";

/**
 * Bento image grid, FIVE tiles, identical on every Marine page.
 *
 * Five is not a style choice, it is what the grid holds. At md+ this is
 * `grid-cols-4 grid-rows-2` = 8 cells. Tile 0 spans 2x2 and takes 4 of them,
 * leaving exactly 4 single cells. With only four images the last cell stayed
 * empty, and because the container carries the hairline colour while the cells
 * are opaque, that hole rendered as a pale steel rectangle a quarter-shell wide
 * in the bottom-right corner. It was visible on /marine and on the lifeboat
 * page. Mobile had the same gap at r3c2. Five images close both.
 *
 *   md+           +---------------+---+---+
 *                 |   A  2x2      | B | C |
 *                 |               +---+---+
 *                 |               | D | E |
 *                 +---------------+---+---+
 *   mobile        A full width, then B C / D E as square tiles
 *
 * Tile size is a property of the LAYOUT, never of the source file. The band this
 * replaced sized itself from the image: a single entry skipped `md:grid-cols-2`
 * and rendered a full-width 3:2 slab, which is how a 1200px hull photograph
 * became the largest element on the page. Here the grid owns a fixed height and
 * every tile is `object-cover`, so no image can balloon and all pages match.
 *
 * Hairline lattice per the house idiom: the container carries the hairline
 * colour and `gap-px`, cells are opaque, and no cell has a border, so seams
 * are exactly 1px and never double up.
 */
export function MarineGrid({ images, caption }: { images: ServiceImage[]; caption?: string }) {
  if (!images.length) return null;
  // Exactly five fill the 8-cell grid: one 2x2 feature plus four singles.
  const tiles = images.slice(0, 5);

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
              <Pic
                image={img}
                // The feature tile is roughly half the shell at md+, the four
                // singles a quarter each; on mobile the grid is two columns and
                // tile 0 runs full width.
                sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                imgClassName={cn(
                  "h-full w-full object-cover",
                  // mobile has no fixed band height, so tiles carry a ratio
                  i === 0 ? "aspect-[4/3] md:aspect-auto" : "aspect-square md:aspect-auto",
                )}
              />
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
