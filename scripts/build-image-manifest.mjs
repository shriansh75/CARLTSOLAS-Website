/**
 * Generate lib/imageManifest.ts — intrinsic pixel dimensions for every image in
 * public/images.
 *
 * Why: an <img> with no width/height has no intrinsic aspect ratio until its
 * bytes arrive, so the browser reserves no space and everything below it jumps
 * when it lands. That is Cumulative Layout Shift, and the fix is to state the
 * dimensions up front. Reading them from the files means they cannot drift out
 * of sync with the assets the way hand-written numbers do.
 *
 * Run after adding or replacing imagery:
 *   node scripts/build-image-manifest.mjs
 *
 * Deliberately NOT wired into `npm run build`: the manifest is committed, and a
 * build step that silently rewrites a source file makes deploys non-reproducible
 * when the images are not in the tree.
 */
import { readdir, stat, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const IMAGES_DIR = join(ROOT, "public", "images");
const OUT = join(ROOT, "lib", "imageManifest.ts");

/** Raster formats worth measuring. SVG has no intrinsic pixel size worth using. */
const EXT = /\.(jpe?g|png|webp|avif)$/i;

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (EXT.test(e.name)) out.push(full);
  }
  return out;
}

const files = (await walk(IMAGES_DIR)).sort();
if (!files.length) {
  console.error("[image-manifest] no images found under public/images");
  process.exit(1);
}

const entries = [];
for (const file of files) {
  const { width, height } = await sharp(file).metadata();
  if (!width || !height) {
    console.warn(`[image-manifest] skipping unreadable ${file}`);
    continue;
  }
  // Public URL: always forward slashes, regardless of platform separator.
  const url = "/" + relative(join(ROOT, "public"), file).split(sep).join("/");
  entries.push([url, width, height]);
}

const body = entries.map(([url, w, h]) => `  ${JSON.stringify(url)}: [${w}, ${h}],`).join("\n");

const source = `/**
 * GENERATED FILE — do not edit by hand.
 * Regenerate with: node scripts/build-image-manifest.mjs
 *
 * Intrinsic pixel dimensions for everything under public/images, so <img> can
 * declare width/height and reserve its space before the bytes arrive. Without
 * these the page reflows as each image lands (Cumulative Layout Shift).
 */
export const imageManifest: Record<string, readonly [number, number]> = {
${body}
};

/** Intrinsic size for a public image path, or undefined if it is not tracked. */
export function intrinsicSize(src: string): readonly [number, number] | undefined {
  return imageManifest[src];
}
`;

await writeFile(OUT, source, "utf8");

const totalBytes = (await Promise.all(files.map((f) => stat(f).then((s) => s.size)))).reduce(
  (a, b) => a + b,
  0,
);
console.log(
  `[image-manifest] wrote ${entries.length} entries to lib/imageManifest.ts (${(totalBytes / 1048576).toFixed(1)} MB of source imagery)`,
);
