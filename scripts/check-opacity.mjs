/**
 * Pre-build sanity check: every slash-opacity modifier used on a custom colour
 * token resolves to a step Tailwind will actually generate.
 *
 * Why this exists. Tailwind's slash modifier resolves the numeric step against
 * `theme.opacity`. If the step is absent, `asColor()` returns undefined and the
 * utility emits NO CSS AT ALL — no error, no warning, no class. The element
 * simply renders unstyled.
 *
 * This shipped four invisible hero scrims, including `from-ink/78`, the hard
 * anchor behind the white wordmark over bright wake. The gradient had no start
 * colour, so the "hero text is unreadable" bug was not a tuning problem at all.
 * A transparent nav bar shipped the same way earlier (`bg-ink/92`).
 *
 * The failure mode is invisible in review, in typecheck and in the build, so it
 * needs a build-time gate. Deploy-agnostic: pure text analysis, no bundler.
 */
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/** Tailwind 3.4's default opacity scale. */
const DEFAULT_STEPS = new Set([
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
]);

/** Custom tokens from tailwind.config.ts `theme.extend.colors`. */
const TOKENS = ["ink", "ink-2", "navy", "slate", "surface", "accent", "steel", "flare", "meta"];

/** Utilities that accept a colour + slash opacity. */
const PREFIXES = ["bg", "text", "border", "from", "via", "to", "ring", "fill", "stroke", "divide"];

function fail(message) {
  console.error(`[check-opacity] ${message}`);
  process.exit(1);
}

async function walk(dir, out = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      await walk(full, out);
    } else if (/\.(tsx?|css)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

// --- steps declared in the config -------------------------------------------
const config = await readFile(path.join(root, "tailwind.config.ts"), "utf8").catch(() =>
  fail("tailwind.config.ts not found"),
);

const opacityBlock = config.match(/opacity:\s*\{([^}]*)\}/s);
const declared = new Set(DEFAULT_STEPS);
if (opacityBlock) {
  for (const m of opacityBlock[1].matchAll(/(\d+)\s*:/g)) declared.add(Number(m[1]));
}

// --- steps actually used in source ------------------------------------------
const pattern = new RegExp(`\\b(?:${PREFIXES.join("|")})-(?:${TOKENS.join("|")})\\/(\\d+)\\b`, "g");

const files = await walk(path.join(root, "app"));
await walk(path.join(root, "components"), files);
await walk(path.join(root, "content"), files);

const missing = new Map();
const used = new Set();

for (const file of files) {
  const source = await readFile(file, "utf8");
  source.split("\n").forEach((line, i) => {
    // skip comment lines: they document the trap rather than use it
    const trimmed = line.trim();
    if (trimmed.startsWith("*") || trimmed.startsWith("//")) return;
    for (const match of line.matchAll(pattern)) {
      const step = Number(match[1]);
      used.add(step);
      if (!declared.has(step)) {
        const key = `${path.relative(root, file)}:${i + 1}`;
        if (!missing.has(key)) missing.set(key, new Set());
        missing.get(key).add(match[0]);
      }
    }
  });
}

if (missing.size > 0) {
  console.error(
    "[check-opacity] These classes emit NO CSS because their opacity step is not in theme.opacity:",
  );
  for (const [where, classes] of missing) {
    console.error(`  ${where}  ${[...classes].join(", ")}`);
  }
  fail(
    `${missing.size} location(s) affected. Add the step(s) to theme.extend.opacity ` +
      "in tailwind.config.ts, or snap the class to a default-scale step.",
  );
}

console.log(`[check-opacity] OK: ${used.size} distinct opacity steps, all generated`);
