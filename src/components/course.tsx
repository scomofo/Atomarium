import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { AtomFigure } from "@/components/atom-figure";
import { BuildLab } from "@/components/labs/build-lab";
import { CheckLab } from "@/components/labs/check-lab";
import { DecayLab } from "@/components/labs/decay-lab";
import { FoilLab } from "@/components/labs/foil-lab";
import { LightLab } from "@/components/labs/light-lab";
import { ModelsLab } from "@/components/labs/models-lab";
import { TrendsLab } from "@/components/labs/trends-lab";
import { STATIONS } from "@/lib/course-data";
import { useCourse } from "@/lib/store";

function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
      <circle cx="16" cy="16" r="3" fill="var(--color-brass)" />
      <circle cx="16" cy="16" r="8" fill="none" stroke="var(--color-ion)" strokeWidth="1.4" />
      <circle cx="16" cy="8" r="2" fill="var(--color-ion)" />
      <circle cx="16" cy="16" r="13" fill="none" stroke="var(--color-line)" strokeWidth="1" />
    </svg>
  );
}

function Header() {
  const setView = useCourse((state) => state.setView);
  const seen = useCourse((state) => state.seen);
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-chamber/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button type="button" className="flex items-center gap-3" onClick={() => setView("home")}>
          <Mark />
          <span className="font-display text-2xl text-mist italic">Atomarium</span>
        </button>
        <p className="text-xs tracking-widest text-fog uppercase tabular-nums">
          {seen.length} of {STATIONS.length} benches
        </p>
      </div>
    </header>
  );
}

function Syllabus() {
  const setView = useCourse((state) => state.setView);
  const seen = useCourse((state) => state.seen);
  const attempts = useCourse((state) => state.attempts);
  const bestScore = useCourse((state) => state.bestScore);

  return (
    <div>
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)]">
        <div>
          <p className="text-xs tracking-widest text-brass uppercase">Atomic physics</p>
          <h1 className="mt-3 max-w-xl text-4xl text-mist sm:text-6xl">
            The atom, <span className="text-brass italic">in your hands.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-fog sm:text-lg">
            Seven benches. You assemble a nucleus, retire five historical models, pull colors out
            of hydrogen, watch a half-life refuse to be a clock, fire alpha particles at gold,
            and read two trends across the table.
          </p>
          {attempts > 0 ? (
            <p className="mt-4 text-sm text-mist tabular-nums">
              Best check: {bestScore} of 8
              {attempts > 1 ? ` · ${attempts} tries` : ""}
            </p>
          ) : null}
        </div>
        <div className="mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none">
          <AtomFigure
            protons={6}
            neutrons={6}
            electrons={6}
            caption="Carbon-12, drawn so the nucleus is visible. It is not."
          />
        </div>
      </div>

      <ol className="mt-10 border-t border-line">
        {STATIONS.map((station) => {
          const opened = seen.includes(station.id);
          return (
            <li key={station.id} className="border-b border-line">
              <button
                type="button"
                className="flex w-full items-center gap-4 py-4 text-left sm:gap-6 sm:py-5"
                onClick={() => setView(station.id)}
              >
                <span className="w-10 shrink-0 font-display text-xl text-brass tabular-nums">
                  {station.index}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg text-mist">{station.title}</span>
                  <span className="mt-1 block text-sm text-fog">{station.summary}</span>
                </span>
                <span className="hidden text-xs tracking-widest text-fog uppercase sm:block">
                  {opened ? "Open" : "Start"}
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-fog" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-6 text-xs leading-relaxed text-fog">
        Every figure on this course is enlarged. A real nucleus is about a hundred-thousandth the
        width of the electron cloud. Progress stays in this browser.
      </p>
    </div>
  );
}

export function Course() {
  const view = useCourse((state) => state.view);

  useEffect(() => {
    void useCourse.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-screen text-mist">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6">
        {view === "home" ? <Syllabus /> : null}
        {view === "build" ? <BuildLab /> : null}
        {view === "models" ? <ModelsLab /> : null}
        {view === "light" ? <LightLab /> : null}
        {view === "decay" ? <DecayLab /> : null}
        {view === "foil" ? <FoilLab /> : null}
        {view === "trends" ? <TrendsLab /> : null}
        {view === "check" ? <CheckLab /> : null}
      </main>
    </div>
  );
}
