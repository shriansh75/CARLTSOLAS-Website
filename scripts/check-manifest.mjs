#!/usr/bin/env node
/**
 * Build gate: lib/imageManifest.ts must match public/images exactly.
 *
 * The manifest is GENERATED and COMMITTED, and it is the only source of the
 * intrinsic width/height that `components/ui/Pic.tsx` puts on every <img>.
 * When a path is missing from it, `intrinsicSize()` returns undefined and Pic
 * silently omits the attributes — so the browser reserves no space, the page
 * reflows as the image lands, and NOTHING reports an error. Type-checking
 * passes, the build passes, the page looks right in review. The only symptom is
 * layout shift on a cold load, which is exactly the class of regression that
 * survives review.
 *
 * So: forgetting `node scripts/build-image-manifest.mjs` after adding or
 * removing imagery now fails the build instead of shipping.
 */
import { readdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const IMAGES_DIR = join(ROOT, "public", "images");
const MANIFEST = join(ROOT, "lib", "imageManifest.ts");
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

const onDisk = new Set(
  (await walk(IMAGES_DIR)).map((f) => "/" + relative(join(ROOT, "public"), f).split(sep).join("/")),
);

const source = readFileSync(MANIFEST, "utf8");
const inManifest = new Set([...source.matchAll(/"(\/images\/[^"]+)":\s*\[\d+,\s*\d+\]/g)].map((m) => m[1]));

const missing = [...onDisk].filter((p) => !inManifest.has(p)).sort();
const stale = [...inManifest].filter((p) => !onDisk.has(p)).sort();

if (missing.length || stale.length) {
  console.error("[check-manifest] lib/imageManifest.ts is out of sync with public/images.\n");
  for (const p of missing) console.error(`  on disk but NOT in the manifest (no width/height -> layout shift): ${p}`);
  for (const p of stale) console.error(`  in the manifest but NOT on disk (stale entry): ${p}`);
  console.error("\n  Fix: node scripts/build-image-manifest.mjs   (then commit lib/imageManifest.ts)");
  process.exit(1);
}

console.log(`[check-manifest] OK: ${onDisk.size} images, all present in the manifest`);
