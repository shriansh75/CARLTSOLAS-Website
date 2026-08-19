#!/usr/bin/env node
/**
 * Encode a source photograph into the site's `{webp,jpg}` pair.
 *
 * This exists because the encode settings for every image already on the site
 * were never written down. The intent was documented in CHANGELOG.md ("encoded
 * to webp + jpg at native resolution", "oversized sources downscaled", "a vessel
 * callsign removed with ffmpeg delogo") but not one actual command survived, so
 * "replace this image and match the rest" was not a reproducible task. It is now.
 *
 * Two rules this tool enforces rather than trusts:
 *
 * 1. NEVER UPSCALE. `withoutEnlargement: true` plus an explicit warning when the
 *    requested width exceeds the source. Several masters in this project are 4x
 *    upscales carrying no more information than their originals — a 776px file
 *    with 194px of real detail — so the true width is printed on every run and
 *    the target is clamped to it.
 * 2. Redaction is part of encoding, not a separate manual step. `--blur` regions
 *    are applied BEFORE the resize, in source pixel coordinates, so the numbers
 *    stay meaningful when the output tier changes.
 *
 * Usage:
 *   node scripts/encode-image.mjs --in "<src>" --out marine/hero-oilgas --width 1600
 *
 * Options:
 *   --in <path>        source file (any format sharp reads)
 *   --out <name>       output basename under public/images, may include a subdir
 *   --width <n>        target width; clamped to the source width
 *   --crop x,y,w,h     crop in SOURCE pixels, applied first
 *   --blur x,y,w,h     redact a region (repeatable), in post-crop pixels
 *   --cover x,y,w,h[,#rrggbb]
 *                      paint a flat rectangle over a region (repeatable).
 *                      For artefacts sitting on flat ground, where a blur just
 *                      leaves a recognisable smear — e.g. another site's gallery
 *                      UI captured in the white margin of a scanned drawing.
 *   --brighten <n>     linear brightness multiplier, e.g. 1.18 for underexposed
 *   --sharpen          light unsharp pass for images resized down a long way
 *   --jpg-q <n>        default 82
 *   --webp-q <n>       default 80
 */
import sharp from "sharp";
import { dirname, join } from "node:path";
import { existsSync, mkdirSync, statSync } from "node:fs";

function parseArgs(argv) {
  const out = { blur: [], cover: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === "--in") out.in = next();
    else if (a === "--out") out.out = next();
    else if (a === "--width") out.width = Number(next());
    else if (a === "--crop") out.crop = next().split(",").map(Number);
    else if (a === "--blur") out.blur.push(next().split(",").map(Number));
    else if (a === "--cover") {
      const parts = next().split(",");
      out.cover.push({
        left: Number(parts[0]),
        top: Number(parts[1]),
        width: Number(parts[2]),
        height: Number(parts[3]),
        color: parts[4] ?? "#ffffff",
      });
    }
    else if (a === "--brighten") out.brighten = Number(next());
    else if (a === "--sharpen") out.sharpen = true;
    else if (a === "--jpg-q") out.jpgQ = Number(next());
    else if (a === "--webp-q") out.webpQ = Number(next());
    else throw new Error(`unknown option: ${a}`);
  }
  return out;
}

const opts = parseArgs(process.argv.slice(2));
if (!opts.in || !opts.out || !opts.width) {
  console.error(
    "usage: --in <src> --out <name> --width <n> [--crop x,y,w,h] [--blur x,y,w,h] [--brighten n] [--sharpen]",
  );
  process.exit(1);
}
if (!existsSync(opts.in)) {
  console.error(`[encode] source not found: ${opts.in}`);
  process.exit(1);
}

const PUBLIC_IMAGES = join(process.cwd(), "public", "images");
const outBase = join(PUBLIC_IMAGES, opts.out);
mkdirSync(dirname(outBase), { recursive: true });

const srcMeta = await sharp(opts.in).metadata();
console.log(
  `[encode] source ${srcMeta.width}x${srcMeta.height} ${srcMeta.format} ` +
    `(${(statSync(opts.in).size / 1048576).toFixed(1)} MB)`,
);

let staged = await sharp(opts.in).rotate().toBuffer();

if (opts.crop) {
  const [left, top, width, height] = opts.crop;
  staged = await sharp(staged).extract({ left, top, width, height }).toBuffer();
  console.log(`[encode] crop  ${width}x${height} from (${left},${top})`);
}

// Redactions composite a heavily blurred copy of the region back over itself, so
// the patch keeps the surrounding colour and reads as camera defocus rather than
// as a black box drawn over evidence.
if (opts.blur.length) {
  const overlays = [];
  for (const [left, top, width, height] of opts.blur) {
    const patch = await sharp(staged)
      .extract({ left, top, width, height })
      // sigma scales with the region so a large area is not left legible
      .blur(Math.max(8, Math.round(Math.min(width, height) / 3)))
      .toBuffer();
    overlays.push({ input: patch, left, top });
    console.log(`[encode] blur  ${width}x${height} at (${left},${top})`);
  }
  staged = await sharp(staged).composite(overlays).toBuffer();
}

if (opts.cover.length) {
  const overlays = [];
  for (const { left, top, width, height, color } of opts.cover) {
    const patch = await sharp({
      create: { width, height, channels: 3, background: color },
    })
      .png()
      .toBuffer();
    overlays.push({ input: patch, left, top });
    console.log(`[encode] cover ${width}x${height} at (${left},${top}) ${color}`);
  }
  staged = await sharp(staged).composite(overlays).toBuffer();
}

const preMeta = await sharp(staged).metadata();
const target = Math.min(opts.width, preMeta.width);
if (target < opts.width) {
  console.warn(
    `[encode] WARNING requested ${opts.width}px but the source holds only ${preMeta.width}px. ` +
      `Encoding at ${target}px rather than inventing detail.`,
  );
}

let resized = sharp(staged).resize({ width: target, kernel: "lanczos3", withoutEnlargement: true });

if (opts.brighten) {
  resized = resized.linear(opts.brighten, 0);
  console.log(`[encode] brighten x${opts.brighten}`);
}
if (opts.sharpen) {
  resized = resized.sharpen({ sigma: 0.6, m1: 0.5, m2: 0.4 });
  console.log(`[encode] sharpen light`);
}

const body = await resized.toBuffer();

await sharp(body).webp({ quality: opts.webpQ ?? 80, effort: 5 }).toFile(`${outBase}.webp`);
await sharp(body).jpeg({ quality: opts.jpgQ ?? 82, mozjpeg: true, progressive: true }).toFile(`${outBase}.jpg`);

const finalMeta = await sharp(`${outBase}.jpg`).metadata();
const kb = (p) => `${(statSync(p).size / 1024) | 0}KB`;
console.log(
  `[encode] wrote ${opts.out}.{webp,jpg} at ${finalMeta.width}x${finalMeta.height} ` +
    `(webp ${kb(`${outBase}.webp`)}, jpg ${kb(`${outBase}.jpg`)})`,
);
console.log(`[encode] remember: node scripts/build-image-manifest.mjs`);
