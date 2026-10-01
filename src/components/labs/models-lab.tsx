import { useEffect, useRef, useState } from "react";
import { Bench } from "@/components/bench";
import { MODELS } from "@/lib/course-data";

function DaltonArt() {
  return (
    <svg viewBox="0 0 320 220" className="h-auto w-full" role="img" aria-label="A solid sphere">
      <rect width="320" height="220" fill="var(--color-chamber)" />
      <circle cx="160" cy="110" r="58" fill="var(--color-brass)" />
      <circle cx="142" cy="92" r="16" fill="var(--color-mist)" opacity="0.18" />
    </svg>
  );
}

function ThomsonArt() {
  const plums = [
    [120, 80],
    [190, 78],
    [150, 120],
    [200, 130],
    [118, 145],
    [168, 156],
    [210, 96],
  ];
  return (
    <svg viewBox="0 0 320 220" className="h-auto w-full" role="img" aria-label="Positive sphere with embedded electrons">
      <rect width="320" height="220" fill="var(--color-chamber)" />
      <circle cx="160" cy="112" r="70" fill="var(--color-brass)" opacity="0.35" />
      {plums.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill="var(--color-ion)" />
      ))}
    </svg>
  );
}

function RutherfordArt() {
  return (
    <svg viewBox="0 0 320 220" className="h-auto w-full" role="img" aria-label="Tiny nucleus and a deflected alpha path">
      <rect width="320" height="220" fill="var(--color-chamber)" />
      <circle cx="168" cy="112" r="78" fill="none" stroke="var(--color-line)" />
      <path
        d="M16 168 C 90 168, 120 140, 150 112"
        fill="none"
        stroke="var(--color-ion)"
        strokeWidth="1.6"
      />
      <path
        d="M150 112 C 176 90, 210 40, 300 28"
        fill="none"
        stroke="var(--color-ion)"
        strokeWidth="1.6"
      />
      <circle cx="168" cy="112" r="7" fill="var(--color-brass)" />
      <circle cx="100" cy="70" r="4" fill="var(--color-ion)" />
      <circle cx="230" cy="150" r="4" fill="var(--color-ion)" />
    </svg>
  );
}

function BohrArt() {
  return (
    <svg viewBox="0 0 320 220" className="h-auto w-full" role="img" aria-label="Three quantized orbits around a nucleus">
      <rect width="320" height="220" fill="var(--color-chamber)" />
      <circle cx="150" cy="114" r="28" fill="none" stroke="var(--color-line)" />
      <circle cx="150" cy="114" r="52" fill="none" stroke="var(--color-line)" />
      <circle cx="150" cy="114" r="76" fill="none" stroke="var(--color-line)" />
      <circle cx="150" cy="114" r="6" fill="var(--color-brass)" />
      <circle cx="202" cy="114" r="5" fill="var(--color-ion)" />
      <path
        d="M214 114 C 224 104, 232 124, 242 114 C 252 104, 260 124, 272 114"
        fill="none"
        stroke="var(--color-brass)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CloudArt({ mode }: { mode: "s" | "p" }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-chamber").trim() || "#071014";
    ctx.fillRect(0, 0, width, height);
    const ion = getComputedStyle(document.documentElement).getPropertyValue("--color-ion").trim() || "#5ec4bc";
    let seed = mode === "s" ? 11 : 29;
    const rand = () => {
      seed = (seed * 16807 + 13) % 2147483647;
      return (seed & 2147483646) / 2147483647;
    };
    const gauss = () => {
      const u = Math.max(1e-6, rand());
      const v = rand();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
    ctx.fillStyle = ion;
    const count = mode === "s" ? 420 : 380;
    for (let i = 0; i < count; i += 1) {
      let x = 0;
      let y = 0;
      if (mode === "s") {
        x = gauss() * 46;
        y = gauss() * 46;
      } else {
        const lobe = rand() < 0.5 ? -1 : 1;
        x = gauss() * 28;
        y = lobe * (34 + Math.abs(gauss()) * 30);
      }
      const px = width / 2 + x;
      const py = height / 2 + y;
      const alpha = mode === "s" ? 0.45 : 0.5;
      ctx.globalAlpha = alpha * (0.35 + rand() * 0.65);
      ctx.beginPath();
      ctx.arc(px, py, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [mode]);

  return (
    <canvas
      ref={ref}
      width={640}
      height={440}
      className="h-auto w-full"
      role="img"
      aria-label={mode === "s" ? "A sketch of a 1s probability cloud" : "A sketch of a 2p orbital with two lobes"}
    />
  );
}

export function ModelsLab() {
  const [index, setIndex] = useState(0);
  const [cloud, setCloud] = useState<"s" | "p">("s");
  const model = MODELS[index] ?? MODELS[0];

  return (
    <Bench
      id="models"
      lede="Nobody threw the last model away whole. Each one was right about a measurement and wrong about a picture."
      notes={
        <>
          <p className="text-xs tracking-widest text-brass uppercase">
            {model.year} · {model.person}
          </p>
          <h2 className="text-2xl text-mist">{model.name}</h2>
          <p>{model.body}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-panel p-3">
              <p className="text-xs tracking-widest text-brass uppercase">Kept</p>
              <p className="mt-2">{model.kept}</p>
            </div>
            <div className="rounded-xl border border-line bg-panel p-3">
              <p className="text-xs tracking-widest text-fog uppercase">Dropped</p>
              <p className="mt-2">{model.dropped}</p>
            </div>
          </div>
        </>
      }
    >
      <div className="rounded-2xl border border-line bg-panel p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {MODELS.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              className="pill btn"
              aria-pressed={itemIndex === index}
              onClick={() => setIndex(itemIndex)}
            >
              {item.year}
            </button>
          ))}
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-line">
          {model.id === "dalton" ? <DaltonArt /> : null}
          {model.id === "thomson" ? <ThomsonArt /> : null}
          {model.id === "rutherford" ? <RutherfordArt /> : null}
          {model.id === "bohr" ? <BohrArt /> : null}
          {model.id === "quantum" ? <CloudArt mode={cloud} /> : null}
        </div>
        {model.id === "quantum" ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="pill btn" aria-pressed={cloud === "s"} onClick={() => setCloud("s")}>
              1s cloud
            </button>
            <button type="button" className="pill btn" aria-pressed={cloud === "p"} onClick={() => setCloud("p")}>
              2p lobes
            </button>
          </div>
        ) : (
          <p className="mt-3 text-xs text-fog">
            {model.year} — {model.name}. The next picture is a correction, not a new universe.
          </p>
        )}
        {model.id === "quantum" ? (
          <p className="mt-3 text-xs text-fog">
            A sketch of probability, denser where a measurement is more likely. Not a photograph, and not a track the electron follows.
          </p>
        ) : null}
      </div>
    </Bench>
  );
}
