import { useId } from "react";
import { shellsFor } from "@/lib/physics";

type AtomFigureProps = {
  protons: number;
  neutrons: number;
  electrons: number;
  caption?: string;
};

const CENTER = 160;

function nucleonPoints(protons: number, neutrons: number) {
  const total = protons + neutrons;
  if (total === 0) return [];
  const kinds: Array<"p" | "n"> = [];
  let p = protons;
  let n = neutrons;
  while (p > 0 || n > 0) {
    if (p > 0) {
      kinds.push("p");
      p -= 1;
    }
    if (n > 0) {
      kinds.push("n");
      n -= 1;
    }
  }
  const reach = Math.min(34, 10 + 4.2 * Math.sqrt(total));
  const dot = total > 28 ? 4.2 : total > 14 ? 5.2 : 6.4;
  const golden = Math.PI * (3 - Math.sqrt(5));
  return kinds.map((kind, i) => {
    const radius = total === 1 ? 0 : reach * Math.sqrt((i + 0.5) / total);
    const angle = i * golden;
    return {
      kind,
      dot,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });
}

export function AtomFigure({ protons, neutrons, electrons, caption }: AtomFigureProps) {
  const id = useId();
  const shells = shellsFor(electrons);
  const nucleons = nucleonPoints(protons, neutrons);
  const label = caption ?? `${protons} protons, ${neutrons} neutrons, ${electrons} electrons`;

  return (
    <figure className="m-0">
      <svg viewBox="0 0 320 320" role="img" aria-label={label} className="atom-plate h-auto w-full">
        <defs>
          {[
            ["p", "--color-brass"],
            ["n", "--color-stone"],
            ["e", "--color-ion"],
          ].map(([kind, color]) => (
            <radialGradient key={kind} id={`${id}-${kind}`} cx="32%" cy="28%" r="75%">
              <stop stopColor="var(--color-mist)" />
              <stop offset="0.3" stopColor={`var(${color})`} />
              <stop offset="1" stopColor={`var(${color})`} stopOpacity="0.65" />
            </radialGradient>
          ))}
        </defs>
        <rect width="320" height="320" fill="var(--color-chamber)" rx="16" />
        <g className="instrument-grid" aria-hidden="true">
          <path d="M160 16V304 M16 160H304" />
          <circle cx="160" cy="160" r="146" />
          {Array.from({ length: 36 }, (_, i) => (
            <path
              key={i}
              d={`M160 14V${i % 3 === 0 ? 22 : 18}`}
              transform={`rotate(${i * 10} 160 160)`}
            />
          ))}
        </g>
        <g transform={`translate(${CENTER} ${CENTER})`}>
          {shells.map((shell) => (
            <g key={shell.n}>
              <circle r={shell.radius} fill="none" stroke="var(--color-line)" strokeWidth="1.2" />
              <text x="6" y={-shell.radius + 12} className="shell-label">
                n={shell.n}
              </text>
              {Array.from({ length: shell.count }, (_, index) => {
                const angle = (index / shell.count) * Math.PI * 2;
                return (
                  <circle
                    key={`${shell.count}-${index}`}
                    className="atom-particle"
                    cx={Math.cos(angle) * shell.radius}
                    cy={Math.sin(angle) * shell.radius}
                    r="5.5"
                    fill={`url(#${id}-e)`}
                    stroke="var(--color-ion)"
                    strokeWidth="0.8"
                  />
                );
              })}
            </g>
          ))}
          <circle r="18" fill="var(--color-brass)" opacity="0.12" />
          {nucleons.map((nucleon, index) => (
            <circle
              key={index}
              cx={nucleon.x}
              cy={nucleon.y}
              r={nucleon.dot}
              fill={`url(#${id}-${nucleon.kind})`}
              stroke="var(--color-chamber)"
              strokeWidth="0.8"
            />
          ))}
        </g>
        <text x="20" y="298" className="shell-label">
          SHELL SCHEMATIC · ENLARGED NUCLEUS
        </text>
      </svg>
      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-fog">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
