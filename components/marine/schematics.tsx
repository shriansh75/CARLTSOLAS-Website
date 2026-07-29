import { cn } from "@/lib/cn";

/**
 * Naval-architecture schematics used as Marine hero backdrops.
 *
 * House idiom, matching components/loader/BlueprintHull.tsx: every drawable
 * stroke carries `pathLength={1}` and `data-draw`, so HeroSchematic can run
 * strokeDashoffset 1 -> 0 without measuring real path lengths. Annotations
 * carry `data-fade` and resolve after the linework.
 *
 * Deliberately NOT pre-offset in the markup: these render fully drawn by
 * default, so a no-JS / reduced-motion / handheld visitor sees the drawing
 * rather than an empty frame. Contrast BlueprintHull, which is owned by the
 * preloader timeline and may sit hidden until that timeline runs.
 *
 * All colours go through `rgb(var(--token))`; a raw `var(--token)` would emit
 * a bare channel triple and paint nothing.
 */

const STEEL = "rgb(var(--steel))";
const ACCENT = "rgb(var(--accent))";
const FLARE = "rgb(var(--flare))";
const META = "rgb(var(--meta))";

const draw = { pathLength: 1, "data-draw": "", fill: "none" } as const;

function Frame({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 1200 520"
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
      fill="none"
      aria-hidden
    >
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * /marine - body plan (transverse sections about a centreline)
 * ------------------------------------------------------------------ */

const CX = 600;
const BASE = 430;
const DECK = 150;

function stations(side: 1 | -1, count: number, fullness: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const halfBeam = (70 + t * 250) * side;
    const topY = DECK + (1 - t) * 34;
    const bilgeX = CX + halfBeam * 0.9;
    const bilgeY = BASE - 46 - t * 28 * fullness;
    const c1x = CX + halfBeam * (0.14 / fullness);
    out.push(
      `M ${CX} ${BASE} C ${c1x.toFixed(1)} ${BASE} ${bilgeX.toFixed(1)} ${bilgeY.toFixed(1)} ${(
        CX + halfBeam
      ).toFixed(1)} ${topY.toFixed(1)}`,
    );
  }
  return out;
}

const BODY_PLAN = [...stations(1, 7, 1), ...stations(-1, 7, 1.26)];
const WATERLINES = [206, 262, 318, 374, 412];

export function BodyPlanSchematic({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      {WATERLINES.map((y, i) => (
        <line
          key={`wl${i}`}
          x1={250}
          y1={y}
          x2={950}
          y2={y}
          stroke={STEEL}
          strokeWidth={0.75}
          opacity={0.22}
          {...draw}
        />
      ))}
      <line
        x1={230}
        y1={BASE}
        x2={970}
        y2={BASE}
        stroke={STEEL}
        strokeWidth={1.25}
        opacity={0.5}
        {...draw}
      />
      <line
        x1={CX}
        y1={DECK - 12}
        x2={CX}
        y2={BASE + 12}
        stroke={STEEL}
        strokeWidth={0.75}
        opacity={0.45}
        {...draw}
      />
      <line
        x1={238}
        y1={290}
        x2={962}
        y2={290}
        stroke={FLARE}
        strokeWidth={1.4}
        opacity={0.55}
        {...draw}
      />
      {BODY_PLAN.map((d, i) => (
        <path key={`st${i}`} d={d} stroke={ACCENT} strokeWidth={1.3} opacity={0.42} {...draw} />
      ))}
      <text
        x={968}
        y={282}
        fill={FLARE}
        fontSize={11}
        fontFamily="var(--font-mono)"
        textAnchor="end"
        opacity={0.65}
        data-fade=""
      >
        DWL
      </text>
      {WATERLINES.map((y, i) => (
        <text
          key={`wll${i}`}
          x={234}
          y={y - 6}
          fill={META}
          fontSize={9.5}
          fontFamily="var(--font-mono)"
          opacity={0.55}
          data-fade=""
        >
          WL{i + 1}
        </text>
      ))}
    </Frame>
  );
}

/* ------------------------------------------------------------------ *
 * /marine/flag-state-inspections - profile with inspection callouts
 * ------------------------------------------------------------------ */

const HULL =
  "M 150 300 L 150 366 C 150 388 162 398 190 398 L 985 398 C 1042 396 1064 360 1076 322 L 1086 300 Z";

const HATCHES = [
  "M 380 300 L 380 286 L 500 286 L 500 300",
  "M 580 300 L 580 286 L 700 286 L 700 300",
  "M 780 300 L 780 286 L 900 286 L 900 300",
];

const STATIONS_X = [300, 420, 540, 660, 780, 900];

/** Inspection zones, numbered the way a survey report indexes them. */
const CALLOUTS: { n: string; x: number; y: number }[] = [
  { n: "01", x: 272, y: 222 },
  { n: "02", x: 404, y: 268 },
  { n: "03", x: 648, y: 344 },
  { n: "04", x: 252, y: 358 },
  { n: "05", x: 872, y: 352 },
  { n: "06", x: 1032, y: 330 },
];

export function VesselProfileSchematic({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      {STATIONS_X.map((x) => (
        <line
          key={`fr${x}`}
          x1={x}
          y1={300}
          x2={x}
          y2={394}
          stroke={STEEL}
          strokeWidth={0.6}
          opacity={0.2}
          {...draw}
        />
      ))}

      <path d={HULL} stroke={ACCENT} strokeWidth={1.5} opacity={0.5} {...draw} />

      {/* superstructure, bridge deck and funnel */}
      <path
        d="M 205 300 L 205 236 L 340 236 L 340 300"
        stroke={ACCENT}
        strokeWidth={1.3}
        opacity={0.45}
        {...draw}
      />
      <path
        d="M 220 236 L 220 208 L 325 208 L 325 236"
        stroke={ACCENT}
        strokeWidth={1.2}
        opacity={0.42}
        {...draw}
      />
      <path
        d="M 258 208 L 264 168 L 296 168 L 302 208"
        stroke={ACCENT}
        strokeWidth={1.2}
        opacity={0.42}
        {...draw}
      />

      {HATCHES.map((d, i) => (
        <path key={`h${i}`} d={d} stroke={STEEL} strokeWidth={1} opacity={0.34} {...draw} />
      ))}

      {/* masts */}
      {[545, 745].map((x) => (
        <g key={`m${x}`}>
          <line
            x1={x}
            y1={300}
            x2={x}
            y2={214}
            stroke={STEEL}
            strokeWidth={1}
            opacity={0.38}
            {...draw}
          />
          <line
            x1={x - 23}
            y1={232}
            x2={x + 23}
            y2={232}
            stroke={STEEL}
            strokeWidth={1}
            opacity={0.38}
            {...draw}
          />
        </g>
      ))}

      {/* design waterline */}
      <line
        x1={140}
        y1={352}
        x2={1100}
        y2={352}
        stroke={FLARE}
        strokeWidth={1.4}
        opacity={0.5}
        {...draw}
      />

      {CALLOUTS.map((c) => (
        <g key={c.n} data-fade="" opacity={0.62}>
          <circle cx={c.x} cy={c.y} r={13} stroke={STEEL} strokeWidth={0.9} fill="none" />
          <text
            x={c.x}
            y={c.y + 3.6}
            fill={META}
            fontSize={10}
            fontFamily="var(--font-mono)"
            textAnchor="middle"
          >
            {c.n}
          </text>
        </g>
      ))}

      <text
        x={1096}
        y={344}
        fill={FLARE}
        fontSize={11}
        fontFamily="var(--font-mono)"
        textAnchor="end"
        opacity={0.6}
        data-fade=""
      >
        DWL
      </text>
    </Frame>
  );
}

/* ------------------------------------------------------------------ *
 * /marine/lifeboat-manufacturing - davit-launched survival craft
 * ------------------------------------------------------------------ */

const DAVITS = [
  { post: 380, head: 396 },
  { post: 640, head: 624 },
];

export function DavitSchematic({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      {/* embarkation deck and bulwark */}
      <line
        x1={180}
        y1={300}
        x2={1010}
        y2={300}
        stroke={STEEL}
        strokeWidth={1.2}
        opacity={0.42}
        {...draw}
      />
      <path
        d="M 180 300 L 180 282 M 1010 300 L 1010 282"
        stroke={STEEL}
        strokeWidth={1}
        opacity={0.3}
        {...draw}
      />

      {/* twin davit posts, heads and falls */}
      {DAVITS.map((d) => (
        <g key={d.post}>
          <path
            d={`M ${d.post} 300 L ${d.post} 200 Q ${d.post} 186 ${d.head} 186`}
            stroke={ACCENT}
            strokeWidth={1.5}
            opacity={0.5}
            {...draw}
          />
          <line
            x1={d.head}
            y1={188}
            x2={d.head}
            y2={348}
            stroke={STEEL}
            strokeWidth={0.9}
            opacity={0.4}
            {...draw}
          />
        </g>
      ))}

      {/* totally enclosed survival craft, side elevation */}
      <path
        d="M 372 366 C 372 400 396 414 432 416 L 588 416 C 624 414 648 400 648 366"
        stroke={ACCENT}
        strokeWidth={1.6}
        opacity={0.55}
        {...draw}
      />
      <line
        x1={372}
        y1={366}
        x2={648}
        y2={366}
        stroke={ACCENT}
        strokeWidth={1.1}
        opacity={0.4}
        {...draw}
      />
      <path
        d="M 388 366 C 396 330 440 316 510 316 C 580 316 624 330 632 366"
        stroke={ACCENT}
        strokeWidth={1.5}
        opacity={0.5}
        {...draw}
      />
      <path
        d="M 494 318 L 494 302 L 534 302 L 534 320"
        stroke={STEEL}
        strokeWidth={1}
        opacity={0.34}
        {...draw}
      />

      {[440, 480, 520, 560].map((x) => (
        <circle
          key={`w${x}`}
          cx={x}
          cy={344}
          r={6}
          stroke={STEEL}
          strokeWidth={0.9}
          fill="none"
          opacity={0.4}
          data-fade=""
        />
      ))}

      {/* sea surface and lowering path */}
      <line
        x1={180}
        y1={470}
        x2={1020}
        y2={470}
        stroke={FLARE}
        strokeWidth={1.4}
        opacity={0.5}
        {...draw}
      />
      <line
        x1={510}
        y1={424}
        x2={510}
        y2={458}
        stroke={META}
        strokeWidth={1}
        strokeDasharray="4 5"
        opacity={0.45}
        data-fade=""
      />
      <path
        d="M 504 452 L 510 462 L 516 452"
        stroke={META}
        strokeWidth={1}
        fill="none"
        opacity={0.45}
        data-fade=""
      />

      <text
        x={1014}
        y={462}
        fill={FLARE}
        fontSize={11}
        fontFamily="var(--font-mono)"
        textAnchor="end"
        opacity={0.6}
        data-fade=""
      >
        SEA
      </text>
      <text
        x={186}
        y={292}
        fill={META}
        fontSize={9.5}
        fontFamily="var(--font-mono)"
        opacity={0.55}
        data-fade=""
      >
        EMBARKATION DECK
      </text>
    </Frame>
  );
}
