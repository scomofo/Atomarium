import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AtomFigure } from "@/components/atom-figure";
import { Bench } from "@/components/bench";
import { ELEMENTS, PRESETS } from "@/lib/course-data";
import { chargeText, configuration, ionWord } from "@/lib/physics";

const MAX_P = 20;
const MAX_N = 40;
const MAX_E = 26;

function stabilityLine(protons: number, neutrons: number): string {
  const element = ELEMENTS[protons - 1];
  if (!element) return "";
  const mass = protons + neutrons;
  if (element.stable.includes(mass)) {
    return `${element.name}-${mass} is a stable isotope. It does not decay on any ordinary clock.`;
  }
  const least = Math.min(...element.stable);
  if (mass < least) {
    return `Too few neutrons for a stable ${element.name.toLowerCase()} nucleus. This one would not last.`;
  }
  return `Too many neutrons for stable ${element.name.toLowerCase()}. A nucleus like this decays until the ratio is comfortable.`;
}

function Counter({
  label,
  hint,
  value,
  swatch,
  onAdd,
  onRemove,
  addLabel,
  removeLabel,
  canAdd,
  canRemove,
}: {
  label: string;
  hint: string;
  value: number;
  swatch: string;
  onAdd: () => void;
  onRemove: () => void;
  addLabel: string;
  removeLabel: string;
  canAdd: boolean;
  canRemove: boolean;
}) {
  return (
    <div className="rounded-xl border border-line bg-panel p-3">
      <div className="flex items-center gap-2">
        <span className="size-2.5 rounded-full" style={{ background: swatch }} aria-hidden="true" />
        <span className="text-sm text-mist">{label}</span>
      </div>
      <p className="mt-1 text-xs text-fog">{hint}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <button type="button" className="btn btn-icon" aria-label={removeLabel} onClick={onRemove} disabled={!canRemove}>
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <span className="font-display text-3xl text-mist tabular-nums">{value}</span>
        <button type="button" className="btn btn-icon" aria-label={addLabel} onClick={onAdd} disabled={!canAdd}>
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function BuildLab() {
  const [protons, setProtons] = useState(6);
  const [neutrons, setNeutrons] = useState(6);
  const [electrons, setElectrons] = useState(6);
  const element = protons > 0 ? ELEMENTS[protons - 1] : null;
  const mass = protons + neutrons;
  const { fills } = configuration(electrons);

  return (
    <Bench
      id="build"
      lede="The periodic table is a list of proton counts. Neutrons change the mass. Electrons change the charge. Nothing else renames the element."
      notes={
        <>
          <p>
            Six protons is carbon, whether or not the electrons are all home and whether or not a
            neutron wanders in. Take one electron off sodium and you still have sodium — the ion in
            table salt, not a new element.
          </p>
          <p>
            This bench stops at calcium, element 20. That is far enough for shells, ions, and the
            common isotopes, and short of the messier middle of the table. The filling order here
            is the real one: 4s before 3d, Hund’s rule in the boxes.
          </p>
          <p className="text-fog">
            Brass is a proton. Stone is a neutron. The aqua dots are electrons. The rings are a
            drawing of shells, not orbits the electron travels.
          </p>
        </>
      }
    >
      <div className="rounded-2xl border border-line bg-panel p-4 sm:p-5">
        <AtomFigure protons={protons} neutrons={neutrons} electrons={electrons} />
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            {element ? (
              <>
                <p className="font-display text-5xl text-mist">
                  <sup className="mr-1 text-lg text-fog tabular-nums">{mass}</sup>
                  {element.symbol}
                  {protons !== electrons ? (
                    <sub className="ml-1 text-base text-brass">{chargeText(protons, electrons)}</sub>
                  ) : null}
                </p>
                <p className="mt-1 text-sm text-fog">
                  {element.name} · {ionWord(protons, electrons)}
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-3xl text-mist">No element yet</p>
                <p className="mt-1 text-sm text-fog">An atom needs at least one proton to have a name.</p>
              </>
            )}
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-right text-sm tabular-nums">
            <dt className="text-fog">Z</dt>
            <dd>{protons}</dd>
            <dt className="text-fog">A</dt>
            <dd>{mass}</dd>
          </dl>
        </div>
        <p className="mt-3 min-h-10 text-sm leading-relaxed text-mist">
          {element ? stabilityLine(protons, neutrons) : "Add protons to choose an element from hydrogen through calcium."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="btn"
              onClick={() => {
                setProtons(preset.p);
                setNeutrons(preset.n);
                setElectrons(preset.e);
              }}
            >
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => {
              setProtons(0);
              setNeutrons(0);
              setElectrons(0);
            }}
          >
            Clear
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Counter
            label="Protons"
            hint="Sets the element"
            value={protons}
            swatch="var(--color-brass)"
            canAdd={protons < MAX_P}
            canRemove={protons > 0}
            addLabel="Add a proton"
            removeLabel="Remove a proton"
            onAdd={() => setProtons((value) => Math.min(MAX_P, value + 1))}
            onRemove={() => setProtons((value) => Math.max(0, value - 1))}
          />
          <Counter
            label="Neutrons"
            hint="Sets the isotope"
            value={neutrons}
            swatch="var(--color-stone)"
            canAdd={neutrons < MAX_N}
            canRemove={neutrons > 0}
            addLabel="Add a neutron"
            removeLabel="Remove a neutron"
            onAdd={() => setNeutrons((value) => Math.min(MAX_N, value + 1))}
            onRemove={() => setNeutrons((value) => Math.max(0, value - 1))}
          />
          <Counter
            label="Electrons"
            hint="Sets the charge"
            value={electrons}
            swatch="var(--color-ion)"
            canAdd={electrons < MAX_E}
            canRemove={electrons > 0}
            addLabel="Add an electron"
            removeLabel="Remove an electron"
            onAdd={() => setElectrons((value) => Math.min(MAX_E, value + 1))}
            onRemove={() => setElectrons((value) => Math.max(0, value - 1))}
          />
        </div>

        {fills.length > 0 ? (
          <div className="mt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs tracking-widest text-fog uppercase">Configuration</p>
              <p className="font-display text-lg text-mist">
                {fills.map((fill) => (
                  <span key={`${fill.n}${fill.l}`} className="mr-2">
                    {fill.n}
                    {fill.l}
                    <sup>{fill.count}</sup>
                  </span>
                ))}
              </p>
            </div>
            <div className="mt-3 flex gap-4 overflow-x-auto pb-1">
              {fills.map((fill) => (
                <div key={`${fill.n}${fill.l}-box`} className="shrink-0">
                  <p className="mb-1 text-xs text-fog">
                    {fill.n}
                    {fill.l}
                  </p>
                  <div className="flex gap-1">
                    {fill.orbitals.map((occupancy, index) => (
                      <div
                        key={index}
                        className="flex h-11 w-8 flex-col items-center justify-center rounded-md border border-line bg-chamber text-xs text-ion"
                        aria-label={`${fill.n}${fill.l} orbital ${index + 1}, ${occupancy} electrons`}
                      >
                        {occupancy > 0 ? <span>↑</span> : null}
                        {occupancy > 1 ? <span>↓</span> : null}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-fog">
              Hund’s rule: within a subshell, electrons sit alone in orbitals before they pair.
            </p>
          </div>
        ) : null}
      </div>
    </Bench>
  );
}
