import { cn } from "@/lib/cn";

/**
 * Stylised naval-architecture body plan (hull cross-sections) — the deck's
 * signature cover visual. All drawable strokes use pathLength=1 with a full
 * dash offset so the Preloader can "draw" them via strokeDashoffset 1 -> 0.
 */
const CX = 400;
const BASE = 452;
const DECK = 132;

function stations(side: 1 | -1, count: number, fullness: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const halfBeam = (72 + t * 250) * side;
    const topY = DECK + (1 - t) * 30;
    const bilgeX = CX + halfBeam * 0.9;
    const bilgeY = BASE - 44 - t * 26 * fullness;
    const c1x = CX + halfBeam * (0.14 / fullness);
    out.push(
      `M ${CX} ${BASE} C ${c1x.toFixed(1)} ${BASE} ${bilgeX.toFixed(1)} ${bilgeY.toFixed(1)} ${(
        CX + halfBeam
      ).toFixed(1)} ${topY.toFixed(1)}`,
    );
  }
  return out;
}

const RIGHT = stations(1, 7, 1);
const LEFT = stations(-1, 7, 1.28);
const WATERLINES = [190, 250, 310, 370, 418];
const DWL_Y = 300;
const STATION_TICKS = [0, 1, 2, 3, 4, 5, 6];

const drawProps = {
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
} as const;

export function BlueprintHull({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 520"
      className={cn("h-full w-full overflow-visible", className)}
      fill="none"
      aria-hidden
    >
      {/* deck / sheer line */}
      <path
        d={`M 150 ${DECK + 30} Q 400 ${DECK - 14} 650 ${DECK + 30}`}
        className="hull-line"
        stroke="rgb(var(--steel))"
        strokeWidth={1}
        opacity={0.55}
        {...drawProps}
      />

      {/* waterlines */}
      {WATERLINES.map((y, i) => (
        <line
          key={`wl${i}`}
          x1={128}
          y1={y}
          x2={672}
          y2={y}
          className="hull-line"
          stroke="rgb(var(--steel))"
          strokeWidth={0.75}
          opacity={0.24}
          {...drawProps}
        />
      ))}

      {/* baseline */}
      <line
        x1={110}
        y1={BASE}
        x2={690}
        y2={BASE}
        className="hull-line"
        stroke="rgb(var(--steel))"
        strokeWidth={1.25}
        opacity={0.6}
        {...drawProps}
      />

      {/* centreline */}
      <line
        x1={CX}
        y1={DECK - 6}
        x2={CX}
        y2={BASE + 8}
        className="hull-line"
        stroke="rgb(var(--steel))"
        strokeWidth={0.75}
        opacity={0.5}
        {...drawProps}
      />

      {/* DWL — design waterline (flare) */}
      <line
        x1={118}
        y1={DWL_Y}
        x2={682}
        y2={DWL_Y}
        className="hull-dwl"
        stroke="rgb(var(--flare))"
        strokeWidth={1.5}
        {...drawProps}
      />

      {/* stations */}
      {[...RIGHT, ...LEFT].map((d, i) => (
        <path
          key={`st${i}`}
          d={d}
          className="hull-line"
          stroke="rgb(var(--accent))"
          strokeWidth={1.4}
          {...drawProps}
        />
      ))}

      {/* labels */}
      <text
        x={688}
        y={DWL_Y - 8}
        className="hull-label"
        fill="rgb(var(--flare))"
        fontSize={12}
        fontFamily="var(--font-mono)"
        textAnchor="end"
      >
        DWL
      </text>
      {WATERLINES.map((y, i) => (
        <text
          key={`wll${i}`}
          x={112}
          y={y - 5}
          className="hull-label"
          fill="rgb(var(--meta))"
          fontSize={10}
          fontFamily="var(--font-mono)"
        >
          WL{i + 1}
        </text>
      ))}
      {STATION_TICKS.map((s) => (
        <text
          key={`stk${s}`}
          x={CX + (s / 6) * 250}
          y={BASE + 22}
          className="hull-label"
          fill="rgb(var(--meta))"
          fontSize={10}
          fontFamily="var(--font-mono)"
          textAnchor="middle"
        >
          S{s}
        </text>
      ))}
    </svg>
  );
}
