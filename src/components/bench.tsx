import { useEffect, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { STATIONS, type StationId } from "@/lib/course-data";
import { useCourse } from "@/lib/store";

type BenchProps = {
  id: StationId;
  lede: string;
  notes: ReactNode;
  children: ReactNode;
};

export function Bench({ id, lede, notes, children }: BenchProps) {
  const station = STATIONS.find((item) => item.id === id)!;
  const setView = useCourse((state) => state.setView);
  const markSeen = useCourse((state) => state.markSeen);
  const index = STATIONS.findIndex((item) => item.id === id);
  const next = STATIONS[index + 1];

  useEffect(() => {
    markSeen(id);
  }, [id, markSeen]);

  return (
    <div>
      <button type="button" className="btn btn-quiet mb-5" onClick={() => setView("home")}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        All benches
      </button>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <section className="order-2 lg:order-1">
          <p className="text-xs tracking-widest text-brass uppercase">{station.index}</p>
          <h1 className="mt-2 text-4xl text-mist sm:text-5xl">{station.title}</h1>
          <p className="mt-3 text-base leading-relaxed text-fog">{lede}</p>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-mist">{notes}</div>
          {next ? (
            <button type="button" className="btn mt-8" onClick={() => setView(next.id)}>
              Next: {next.title}
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          ) : (
            <button type="button" className="btn mt-8" onClick={() => setView("home")}>
              Back to the course
            </button>
          )}
        </section>
        <div className="order-1 min-w-0 lg:order-2">{children}</div>
      </div>
    </div>
  );
}
