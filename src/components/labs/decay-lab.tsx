import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Bench } from "@/components/bench";
import { ATOM_COUNT, DECAYS, HALF_LIFE_SECONDS, type DecaySample } from "@/lib/course-data";

type Atom = { x: number; y: number; dead: boolean };
type Sample = { t: number; alive: number };

function makeAtoms(width: number, height: number): Atom[] {
  const cols = 16;
  const rows = 9;
  const atoms: Atom[] = [];
  for (let i = 0; i < ATOM_COUNT; i += 1) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    atoms.push({
      x: ((col + 0.5) / cols) * width,
      y: ((row + 0.5) / rows) * height,
      dead: false,
    });
  }
  return atoms;
}

function colorOf(name: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export function DecayLab() {
  const fieldRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const atomsRef = useRef<Atom[]>([]);
  const samplesRef = useRef<Sample[]>([{ t: 0, alive: ATOM_COUNT }]);
  const timeRef = useRef(0);
  const runningRef = useRef(false);
  const isotopeRef = useRef<DecaySample>(DECAYS[3] ?? DECAYS[0]);

  const [isotopeId, setIsotopeId] = useState(DECAYS[3]?.id ?? "c14");
  const [running, setRunning] = useState(false);
  const [alive, setAlive] = useState(ATOM_COUNT);
  const [halfLives, setHalfLives] = useState(0);

  const isotope = DECAYS.find((item) => item.id === isotopeId) ?? DECAYS[0];

  function paint() {
    const field = fieldRef.current;
    const chart = chartRef.current;
    if (!field || !chart) return;
    const fctx = field.getContext("2d");
    const cctx = chart.getContext("2d");
    if (!fctx || !cctx) return;
    const brass = colorOf("--color-brass", "#d9a441");
    const ion = colorOf("--color-ion", "#5ec4bc");
    const chamber = colorOf("--color-chamber", "#071014");
    const line = colorOf("--color-line", "#2c3c3a");
    const fog = colorOf("--color-fog", "#8b9c96");
    const mist = colorOf("--color-mist", "#e4efe9");

    const fw = field.clientWidth;
    const fh = field.clientHeight;
    if (fw < 10 || fh < 10) return;
    if (atomsRef.current.length === 0) atomsRef.current = makeAtoms(fw, fh);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (field.width !== Math.floor(fw * dpr) || field.height !== Math.floor(fh * dpr)) {
      field.width = Math.floor(fw * dpr);
      field.height = Math.floor(fh * dpr);
    }
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fctx.fillStyle = chamber;
    fctx.fillRect(0, 0, fw, fh);
    if (atomsRef.current.length === 0) {
      atomsRef.current = makeAtoms(fw, fh);
    }
    for (const atom of atomsRef.current) {
      fctx.beginPath();
      if (atom.dead) {
        fctx.strokeStyle = ion;
        fctx.lineWidth = 1.5;
        fctx.arc(atom.x, atom.y, 6, 0, Math.PI * 2);
        fctx.stroke();
      } else {
        fctx.fillStyle = brass;
        fctx.arc(atom.x, atom.y, 6, 0, Math.PI * 2);
        fctx.fill();
      }
    }

    const cw = chart.clientWidth;
    const ch = chart.clientHeight;
    if (chart.width !== Math.floor(cw * dpr) || chart.height !== Math.floor(ch * dpr)) {
      chart.width = Math.floor(cw * dpr);
      chart.height = Math.floor(ch * dpr);
    }
    cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cctx.fillStyle = chamber;
    cctx.fillRect(0, 0, cw, ch);
    const pad = 16;
    const plotW = cw - pad * 2;
    const plotH = ch - pad * 2;
    const maxT = Math.max(4, timeRef.current, ...samplesRef.current.map((sample) => sample.t));
    cctx.strokeStyle = line;
    cctx.lineWidth = 1;
    cctx.beginPath();
    cctx.moveTo(pad, pad);
    cctx.lineTo(pad, pad + plotH);
    cctx.lineTo(pad + plotW, pad + plotH);
    cctx.stroke();

    cctx.strokeStyle = fog;
    cctx.setLineDash([3, 4]);
    cctx.beginPath();
    const steps = 80;
    for (let i = 0; i <= steps; i += 1) {
      const t = (i / steps) * maxT;
      const y = pad + plotH * (1 - 0.5 ** t);
      const x = pad + (t / maxT) * plotW;
      if (i === 0) cctx.moveTo(x, y);
      else cctx.lineTo(x, y);
    }
    cctx.stroke();
    cctx.setLineDash([]);

    cctx.strokeStyle = brass;
    cctx.lineWidth = 1.75;
    cctx.beginPath();
    samplesRef.current.forEach((sample, index) => {
      const x = pad + (sample.t / maxT) * plotW;
      const y = pad + plotH * (1 - sample.alive / ATOM_COUNT);
      if (index === 0) cctx.moveTo(x, y);
      else cctx.lineTo(x, y);
    });
    cctx.stroke();
    cctx.fillStyle = fog;
    cctx.font = "11px IBM Plex Sans, sans-serif";
    cctx.fillText("theory", pad + 8, pad + 12);
    cctx.fillStyle = mist;
    cctx.fillText("this run", pad + 58, pad + 12);
  }

  function publish() {
    const left = atomsRef.current.filter((atom) => !atom.dead).length;
    setAlive(left);
    setHalfLives(timeRef.current);
    paint();
  }

  function reset(nextId = isotopeId) {
    const next = DECAYS.find((item) => item.id === nextId) ?? DECAYS[0];
    if (!next) return;
    isotopeRef.current = next;
    const field = fieldRef.current;
    const width = field?.clientWidth || 0;
    const height = field?.clientHeight || 0;
    atomsRef.current = width > 10 && height > 10 ? makeAtoms(width, height) : [];
    timeRef.current = 0;
    samplesRef.current = [{ t: 0, alive: ATOM_COUNT }];
    runningRef.current = false;
    setRunning(false);
    setIsotopeId(next.id);
    publish();
  }

  function jumpHalfLife() {
    for (const atom of atomsRef.current) {
      if (!atom.dead && Math.random() < 0.5) atom.dead = true;
    }
    timeRef.current += 1;
    const left = atomsRef.current.filter((atom) => !atom.dead).length;
    samplesRef.current = [...samplesRef.current, { t: timeRef.current, alive: left }];
    publish();
  }

  useEffect(() => {
    reset(isotopeId);
    // mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    runningRef.current = running;
    if (!running) return;
    let frame = 0;
    let last = performance.now();
    let publishAt = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (runningRef.current) {
        const lambda = Math.LN2 / HALF_LIFE_SECONDS;
        const probability = 1 - Math.exp(-lambda * dt);
        for (const atom of atomsRef.current) {
          if (!atom.dead && Math.random() < probability) atom.dead = true;
        }
        timeRef.current += dt / HALF_LIFE_SECONDS;
        const left = atomsRef.current.filter((atom) => !atom.dead).length;
        const samples = samplesRef.current;
        const lastSample = samples[samples.length - 1];
        if (!lastSample || timeRef.current - lastSample.t >= 0.08) {
          samplesRef.current = [...samples, { t: timeRef.current, alive: left }];
        }
        if (now - publishAt > 120) {
          publishAt = now;
          setAlive(left);
          setHalfLives(timeRef.current);
        }
        paint();
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  const expected = ATOM_COUNT * 0.5 ** halfLives;

  return (
    <Bench
      id="decay"
      lede="Half-life is not a fuse inside each nucleus. It is the time in which each survivor has a fifty-fifty chance of still being here."
      notes={
        <>
          <p>
            After one half-life, about half remain. After another, about half of those. The atoms
            that last are not older on the inside. They were lucky, and their odds do not improve
            for having waited.
          </p>
          <p>
            The clock on this bench is measured in half-lives, so fluorine-18 and uranium-238 play
            at the same speed. In a real lab they do not. The dashed curve is the ideal
            exponential. A few hundred atoms never sit on it exactly.
          </p>
          <p className="text-fog">
            A picture of the statistics, not a radioactive source. Nothing here is hot.
          </p>
        </>
      }
    >
      <div className="rounded-2xl border border-line bg-panel p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {DECAYS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="pill btn"
              aria-pressed={item.id === isotope.id}
              onClick={() => reset(item.id)}
            >
              {item.symbol}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-mist">
          {isotope.symbol} → {isotope.daughter} · {isotope.mode} · {isotope.halfLife}
        </p>
        <p className="mt-1 text-sm text-fog">{isotope.use}</p>

        <canvas ref={fieldRef} className="mt-4 h-64 w-full rounded-xl border border-line" />
        <div className="mt-2 flex gap-4 text-xs text-fog">
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-brass" /> Parent
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-full border border-ion" /> Daughter
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs tracking-widest text-fog uppercase">Parent left</p>
            <p className="font-display text-3xl text-mist tabular-nums">{alive}</p>
          </div>
          <div>
            <p className="text-xs tracking-widest text-fog uppercase">Half-lives</p>
            <p className="font-display text-3xl text-mist tabular-nums">{halfLives.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs tracking-widest text-fog uppercase">Ideal curve</p>
            <p className="font-display text-3xl text-mist tabular-nums">{expected.toFixed(0)}</p>
          </div>
        </div>

        <canvas ref={chartRef} className="mt-4 h-36 w-full rounded-xl border border-line" />

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn btn-brass" onClick={() => setRunning((value) => !value)}>
            {running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
            {running ? "Pause" : "Run"}
          </button>
          <button type="button" className="btn" onClick={jumpHalfLife}>
            Jump one half-life
          </button>
          <button type="button" className="btn btn-quiet" onClick={() => reset(isotope.id)}>
            Reset
          </button>
        </div>
      </div>
    </Bench>
  );
}
