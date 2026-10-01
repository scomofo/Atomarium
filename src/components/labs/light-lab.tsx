import { useMemo, useState } from "react";
import { Bench } from "@/components/bench";
import { levelEnergy, transition, wavelengthRgb, type Photon } from "@/lib/physics";

const LEVELS = [1, 2, 3, 4, 5, 6];
const NM_MIN = 50;
const NM_MAX = 1600;

function nmPct(nm: number) {
  return ((Math.min(NM_MAX, Math.max(NM_MIN, nm)) - NM_MIN) / (NM_MAX - NM_MIN)) * 100;
}

function formatNm(nm: number) {
  if (nm >= 100) return `${Math.round(nm)} nm`;
  return `${nm.toFixed(1)} nm`;
}

export function LightLab() {
  const [n, setN] = useState(1);
  const [photon, setPhoton] = useState<Photon | null>(null);
  const [lines, setLines] = useState<Photon[]>([]);

  const visibleStart = nmPct(380);
  const visibleEnd = nmPct(740);

  const ladder = useMemo(
    () =>
      LEVELS.map((level, index) => ({
        level,
        energy: levelEnergy(level),
        bottom: 8 + index * 14,
      })),
    [],
  );

  function jump(target: number) {
    if (target === n) return;
    const absorption = target > n;
    const next = transition(Math.max(n, target), Math.min(n, target), absorption);
    setN(target);
    setPhoton(next);
    if (!absorption) {
      setLines((current) => {
        const key = `${next.high}-${next.low}`;
        if (current.some((line) => `${line.high}-${line.low}` === key)) return current;
        return [...current, next];
      });
    }
  }

  const flash = photon && !photon.absorption ? wavelengthRgb(photon.nm) : null;

  return (
    <Bench
      id="light"
      lede="Hydrogen is the only atom this formula gets exactly right. One proton, one electron, and a ladder of allowed energies."
      notes={
        <>
          <p>
            The photon’s energy is the gap between rungs, not the height of a rung. A drop from 3
            to 2 is red light. The same electron falling from 2 to 1 is ultraviolet, and several
            times more energetic.
          </p>
          <p>
            Emission lines are collected on the strip. Absorptions climb the ladder and do not
            paint a line — a line, in a discharge tube, is light leaving the atom.
          </p>
          <p className="font-display text-lg text-brass">E = −13.6 eV / n²</p>
          <p className="text-fog">
            The rungs are spaced for a finger, not for energy. The electron-volts on each rung are
            the real gaps, and they bunch up near zero.
          </p>
        </>
      }
    >
      <div className="rounded-2xl border border-line bg-panel p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,14rem)]">
          <div>
            <p className="text-xs tracking-widest text-fog uppercase">Energy ladder</p>
            <div className="relative mt-3 h-96 rounded-xl border border-line bg-chamber">
              <div
                className="pointer-events-none absolute right-6 left-24 h-px bg-line"
                style={{ bottom: "94%" }}
              />
              <span className="pointer-events-none absolute top-3 right-4 text-xs text-fog">0 eV</span>
              {ladder.map((rung) => (
                <button
                  key={rung.level}
                  type="button"
                  className="absolute right-3 left-3 flex h-11 items-center gap-3 px-2 text-left"
                  style={{ bottom: `${rung.bottom}%` }}
                  onClick={() => jump(rung.level)}
                  aria-pressed={n === rung.level}
                >
                  <span className={`w-10 text-sm tabular-nums ${n === rung.level ? "text-brass" : "text-fog"}`}>
                    n={rung.level}
                  </span>
                  <span className={`h-px flex-1 ${n === rung.level ? "bg-brass" : "bg-line"}`} />
                  <span className="w-20 text-right text-xs text-fog tabular-nums">
                    {rung.energy.toFixed(2)} eV
                  </span>
                </button>
              ))}
              <span
                className="pointer-events-none absolute left-14 size-3 -translate-x-1/2 rounded-full bg-ion"
                style={{ bottom: `calc(${ladder[n - 1]?.bottom ?? 8}% + 1rem)` }}
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div
              className="flex h-28 items-end rounded-xl border border-line px-4 py-3"
              style={{ background: flash ?? "var(--color-chamber)" }}
            >
              <p className={`text-xs tracking-widest uppercase ${flash ? "text-chamber" : "text-fog"}`}>
                Discharge tube
              </p>
            </div>
            <div className="rounded-xl border border-line bg-chamber p-3">
              <p className="text-xs tracking-widest text-fog uppercase">Last photon</p>
              {photon ? (
                <dl className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-fog">{photon.absorption ? "Absorbed" : "Emitted"}</dt>
                    <dd className="tabular-nums">
                      {photon.absorption
                        ? `n=${photon.low} → n=${photon.high}`
                        : `n=${photon.high} → n=${photon.low}`}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-fog">Energy</dt>
                    <dd className="tabular-nums">{photon.eV.toFixed(2)} eV</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-fog">Wavelength</dt>
                    <dd className="tabular-nums">{formatNm(photon.nm)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-fog">Series</dt>
                    <dd>
                      {photon.series} · {photon.band}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-2 text-sm text-fog">Tap a rung. Higher is an absorption. Lower is light leaving.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xs tracking-widest text-fog uppercase">Spectrum collected</p>
            <p className="text-xs text-fog tabular-nums">{lines.length} emission lines</p>
          </div>
          <div className="relative mt-2 h-16 overflow-hidden rounded-xl border border-line bg-chamber">
            <div
              className="spectrum-window absolute top-0 bottom-0 opacity-80"
              style={{ left: `${visibleStart}%`, width: `${visibleEnd - visibleStart}%` }}
            />
            <span className="absolute bottom-1 left-2 text-xs text-mist">UV</span>
            <span
              className="absolute bottom-1 -translate-x-1/2 text-xs text-chamber"
              style={{ left: `${(visibleStart + visibleEnd) / 2}%` }}
            >
              visible
            </span>
            <span className="absolute right-2 bottom-1 text-xs text-mist">IR</span>
            {lines.map((line) => {
              const color = wavelengthRgb(line.nm) ?? "var(--color-mist)";
              return (
                <span
                  key={`${line.high}-${line.low}`}
                  className="absolute top-1 bottom-5 w-0.5"
                  style={{ left: `${nmPct(line.nm)}%`, background: color }}
                  title={`${line.series} ${formatNm(line.nm)}`}
                />
              );
            })}
          </div>
          <p className="mt-2 text-xs text-fog">
            Ultraviolet sits left of the colored window, infrared to the right. A Balmer drop into n = 2 is the one that lands in the window.
          </p>
        </div>
      </div>
    </Bench>
  );
}
