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
  const shells = shellsFor(electrons);
  const nucleons = nucleonPoints(protons, neutrons);
  const label = caption ?? `${protons} protons, ${neutrons} neutrons, ${electrons} electrons`;

  return (
    <figure className="m-0">
      <svg viewBox="0 0 320 320" role="img" aria-label={label} className="h-auto w-full">
        <rect width="320" height="320" fill="var(--color-chamber)" rx="16" />
        <g transform={`translate(${CENTER} ${CENTER})`}>
          {shells.map((shell) => (
            <g
              key={shell.n}
              className="orbit"
              style={{
                transformOrigin: "0px 0px",
                animationDuration: `${20 - shell.n * 3}s`,
                animationDirection: shell.n % 2 === 0 ? "reverse" : "normal",
              }}
            >
              <circle
                r={shell.radius}
                fill="none"
                stroke="var(--color-line)"
                strokeWidth="1"
              />
              {Array.from({ length: shell.count }, (_, index) => {
                const angle = (index / shell.count) * Math.PI * 2;
                return (
                  <circle
                    key={index}
                    cx={Math.cos(angle) * shell.radius}
                    cy={Math.sin(angle) * shell.radius}
                    r="5.5"
                    fill="var(--color-ion)"
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
              fill={nucleon.kind === "p" ? "var(--color-brass)" : "var(--color-stone)"}
            />
          ))}
        </g>
      </svg>
      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-fog">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
