import { useEffect, useRef, useState } from "react";
import { Bench } from "@/components/bench";
import { classifyScatter, stepScatter, type ScatterBody, type ScatterClass } from "@/lib/physics";

type Energy = "low" | "medium" | "high";

const SPEEDS: Record<Energy, number> = {
  low: 340,
  medium: 520,
  high: 760,
};

type Tally = Record<ScatterClass, number>;

const EMPTY: Tally = { through: 0, deflected: 0, back: 0 };

function token(name: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

export function FoilLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 640, h: 360 });
  const bodiesRef = useRef<ScatterBody[]>([]);
  const tallyRef = useRef<Tally>({ ...EMPTY });
  const energyRef = useRef<Energy>("medium");
  const loopRef = useRef(0);
  const [energy, setEnergy] = useState<Energy>("medium");
  const [tally, setTally] = useState<Tally>({ ...EMPTY });
  const [fired, setFired] = useState(0);

  function syncSize() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    sizeRef.current = { w, h };
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = token("--color-chamber", "#071014");
    ctx.fillRect(0, 0, w, h);
    drawStatic(ctx, w, h);
  }

  function drawStatic(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const cx = w * 0.48;
    const cy = h * 0.5;
    ctx.save();
    ctx.strokeStyle = token("--color-brass", "#d9a441");
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.12);
    ctx.lineTo(cx, h * 0.88);
    ctx.stroke();
    ctx.restore();
    ctx.beginPath();
    ctx.fillStyle = token("--color-brass", "#d9a441");
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = token("--color-fog", "#8b9c96");
    ctx.font = "12px IBM Plex Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("gold", cx, h * 0.1);
  }

  function publish() {
    setTally({ ...tallyRef.current });
    setFired(tallyRef.current.through + tallyRef.current.deflected + tallyRef.current.back);
  }

  function drawFrame(dt: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = sizeRef.current;
    const chamber = token("--color-chamber", "#071014");
    ctx.fillStyle = hexAlpha(chamber, 0.16);
    ctx.fillRect(0, 0, w, h);
    const cx = w * 0.48;
    const cy = h * 0.5;
    const ion = token("--color-ion", "#5ec4bc");
    const next: ScatterBody[] = [];
    for (const body of bodiesRef.current) {
      stepScatter(body, cx, cy, dt, w, h);
      if (body.done) {
        const kind = classifyScatter(body);
        tallyRef.current[kind] += 1;
      } else {
        next.push(body);
        ctx.beginPath();
        ctx.fillStyle = ion;
        ctx.arc(body.x, body.y, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    bodiesRef.current = next;
    drawStatic(ctx, w, h);
    if (next.length === 0) {
      cancelAnimationFrame(loopRef.current);
      loopRef.current = 0;
      publish();
    }
  }

  function ensureLoop() {
    if (loopRef.current) return;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      drawFrame(dt);
      if (bodiesRef.current.length > 0) {
        loopRef.current = requestAnimationFrame(loop);
      } else {
        loopRef.current = 0;
        publish();
      }
    };
    loopRef.current = requestAnimationFrame(loop);
  }

  function spawn(y: number) {
    const { h } = sizeRef.current;
    const speed = SPEEDS[energyRef.current];
    const clamped = Math.min(h - 16, Math.max(16, y));
    bodiesRef.current.push({
      x: 18,
      y: clamped,
      vx: speed,
      vy: 0,
      age: 0,
      done: false,
    });
    ensureLoop();
  }

  function fireAt(fraction: number) {
    const { h } = sizeRef.current;
    spawn(h * fraction);
  }

  function fireBeam() {
    const { h } = sizeRef.current;
    for (let i = 0; i < 16; i += 1) {
      const fraction = 0.14 + (i / 15) * 0.72;
      window.setTimeout(() => spawn(h * fraction), i * 40);
    }
    window.setTimeout(() => spawn(h * 0.5), 8 * 40);
  }

  function clearChamber() {
    bodiesRef.current = [];
    tallyRef.current = { ...EMPTY };
    if (loopRef.current) cancelAnimationFrame(loopRef.current);
    loopRef.current = 0;
    publish();
    syncSize();
  }

  useEffect(() => {
    energyRef.current = energy;
  }, [energy]);

  useEffect(() => {
    syncSize();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      syncSize();
    });
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, []);

  return (
    <Bench
      id="foil"
      lede="In 1909 Geiger and Marsden fired helium nuclei at gold a few hundred atoms thick. Almost everything went through. A few did not."
      notes={
        <>
          <p>
            Large backward deflections showed that the atom’s positive charge and most of its mass
            are concentrated in a small nucleus. A positive alpha particle is repelled by the
            positive nucleus; it need not hit a solid surface to turn around.
          </p>
          <p>
            This is a qualitative, single-nucleus Coulomb-repulsion model. The visible nuclear disc
            does not set a collision boundary. At the same impact parameter (the incoming path’s
            offset from the centre), lower energy gives a larger deflection. A head-on shot reverses
            under repulsion.
          </p>
          <p className="text-fog">
            Tap the chamber to choose a height and fire. The beam deliberately samples offsets and
            includes a head-on shot. Its counts are not experimental scattering percentages; the
            drawing and coordinates are not a physical scale model of gold foil.
          </p>
        </>
      }
    >
      <div className="rounded-2xl border border-line bg-panel p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["low", "Low energy"],
              ["medium", "Medium"],
              ["high", "High energy"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className="pill btn"
              aria-pressed={energy === id}
              onClick={() => setEnergy(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <canvas
          ref={canvasRef}
          className="mt-4 h-80 w-full rounded-xl border border-line"
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const fraction = (event.clientY - rect.top) / rect.height;
            fireAt(fraction);
          }}
          aria-label="Cloud chamber. Tap to fire an alpha particle at that height."
        />
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="Straight through" value={tally.through} />
          <Stat label="Deflected" value={tally.deflected} />
          <Stat label="Bounced back" value={tally.back} />
        </div>
        <p className="mt-2 text-xs text-fog tabular-nums">{fired} alphas counted</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn btn-brass" onClick={() => fireAt(0.5)}>
            Head-on
          </button>
          <button type="button" className="btn" onClick={() => fireAt(0.42)}>
            Graze
          </button>
          <button type="button" className="btn" onClick={fireBeam}>
            Fire a beam
          </button>
          <button type="button" className="btn btn-quiet" onClick={clearChamber}>
            Clear
          </button>
        </div>
      </div>
    </Bench>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs tracking-widest text-fog uppercase">{label}</p>
      <p className="font-display text-3xl text-mist tabular-nums">{value}</p>
    </div>
  );
}

function hexAlpha(hex: string, alpha: number) {
  const raw = hex.replace("#", "");
  if (raw.length !== 6) return `rgba(7, 16, 20, ${alpha})`;
  const n = Number.parseInt(raw, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
