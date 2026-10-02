import { useMemo, useState } from "react";
import { Bench } from "@/components/bench";
import { TRENDS } from "@/lib/course-data";

type Mode = "radius" | "en";

const W = 640;
const H = 340;
const PAD_L = 46;
const PAD_R = 16;
const PAD_T = 14;
const PAD_B = 44;
const CHART_W = W - PAD_L - PAD_R;
const CHART_H = H - PAD_T - PAD_B;

const RADIUS_TICKS = [0, 50, 100, 150, 200, 250];
const EN_TICKS = [0, 1, 2, 3, 4];

const TAKEAWAYS: Record<Mode, string> = {
  radius:
    "Across a period the radius shrinks: more protons pull the same shell tighter. Down a group it jumps: a whole new shell joins the atom. Watch lithium to neon fall, then sodium leap back up.",
  en: "Across a period the pull strengthens; down a group it weakens, because the outer electrons sit farther from the nucleus. Noble gases sit out — a full shell has nothing to gain.",
};

function valueOf(point: (typeof TRENDS)[number], mode: Mode): number | null {
  return mode === "radius" ? point.radiusPm : point.electronegativity;
}

function formatValue(mode: Mode, value: number): string {
  return mode === "radius" ? `${value} pm` : value.toFixed(2);
}

export function TrendsLab() {
  const [mode, setMode] = useState<Mode>("radius");
  const [hovered, setHovered] = useState<number | null>(null);

  const max = mode === "radius" ? 250 : 4.2;
  const ticks = mode === "radius" ? RADIUS_TICKS : EN_TICKS;
  const slot = CHART_W / TRENDS.length;
  const barW = Math.max(4, slot - 7);

  const bars = useMemo(
    () =>
      TRENDS.map((point, index) => {
        const value = valueOf(point, mode);
        const x = PAD_L + index * slot + (slot - barW) / 2;
        const height = value === null ? 5 : Math.max(3, (value / max) * CHART_H);
        const y = PAD_T + CHART_H - height;
        return { point, x, y, height, value };
      }),
    [mode, max, slot, barW],
  );

  const hoveredPoint = hovered === null ? null : TRENDS[hovered];

  return (
    <Bench
      id="trends"
      lede="Twenty elements, two numbers each. Flip between size and pull and watch the shape of the table appear."
      notes={
        <>
          <p>
            An empirical atomic radius is a measured half-distance between bonded nuclei, in
            picometres (pm). A picometre is a trillionth of a metre; a hydrogen atom is about 50
            of them across.
          </p>
          <p>
            Electronegativity is Pauling&apos;s score, roughly 0 to 4, for how hard an atom tugs
            shared electrons in a bond. Fluorine, at 3.98, is the hungriest element on this bench.
          </p>
          <p className="text-fog">
            Noble gases carry no Pauling value: a full outer shell has nothing to gain by pulling,
            so the scale leaves them blank. Their bars are drawn as stubs.
          </p>
        </>
      }
    >
      <div className="rounded-2xl border border-line bg-panel p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2" role="tablist" aria-label="Trend to display">
            {(
              [
                { id: "radius", label: "Atomic radius" },
                { id: "en", label: "Electronegativity" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={mode === tab.id}
                onClick={() => {
                  setMode(tab.id);
                  setHovered(null);
                }}
                className={
                  mode === tab.id
                    ? "rounded-full border border-brass bg-brass px-4 py-2 text-sm text-chamber transition-colors"
                    : "rounded-full border border-line px-4 py-2 text-sm text-fog transition-colors hover:border-fog hover:text-mist"
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
          <p className="min-h-6 text-sm text-mist tabular-nums" aria-live="polite">
            {hoveredPoint
              ? (() => {
                  const value = valueOf(hoveredPoint, mode);
                  return value === null
                    ? `${hoveredPoint.symbol} · no Pauling value (noble gas)`
                    : `${hoveredPoint.symbol} · ${mode === "radius" ? "radius" : "electronegativity"} ${formatValue(mode, value)}`;
                })()
              : "Hover a bar for its value."}
          </p>
        </div>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mt-3 w-full"
          role="img"
          aria-label={
            mode === "radius"
              ? "Bar chart of empirical atomic radii for elements 1 to 20"
              : "Bar chart of Pauling electronegativity for elements 1 to 20"
          }
        >
          {ticks.map((tick) => {
            const y = PAD_T + CHART_H - (tick / max) * CHART_H;
            return (
              <g key={tick}>
                <line x1={PAD_L} x2={W - PAD_R} y1={y} y2={y} stroke="var(--color-line)" strokeWidth="1" />
                <text x={PAD_L - 8} y={y + 4} textAnchor="end" fontSize="11" fill="var(--color-fog)" className="tabular-nums">
                  {tick}
                </text>
              </g>
            );
          })}
          {bars.map(({ point, x, y, height, value }, index) => {
            const isHover = hovered === index;
            return (
              <g key={point.z}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={height}
                  rx="2"
                  fill={value === null ? "none" : isHover ? "var(--color-ion)" : "var(--color-brass)"}
                  stroke={value === null ? "var(--color-fog)" : "none"}
                  strokeDasharray={value === null ? "3 3" : undefined}
                  opacity={hovered === null || isHover ? 1 : 0.45}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(index)}
                  onBlur={() => setHovered(null)}
                  tabIndex={0}
                  role="img"
                  aria-label={
                    value === null
                      ? `${point.symbol}: no Pauling value`
                      : `${point.symbol}: ${formatValue(mode, value)}`
                  }
                >
                  <title>
                    {value === null
                      ? `${point.symbol}: no Pauling value`
                      : `${point.symbol}: ${formatValue(mode, value)}`}
                  </title>
                </rect>
                <text
                  x={x + barW / 2}
                  y={H - PAD_B + 20}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isHover ? "var(--color-mist)" : "var(--color-fog)"}
                >
                  {point.symbol}
                </text>
              </g>
            );
          })}
          <text
            x={PAD_L - 8}
            y={PAD_T - 2}
            textAnchor="end"
            fontSize="11"
            fill="var(--color-fog)"
          >
            {mode === "radius" ? "pm" : "Pauling"}
          </text>
        </svg>

        <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-mist">
          {TAKEAWAYS[mode]}
        </p>
      </div>
    </Bench>
  );
}
