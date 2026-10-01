export type OrbitalL = "s" | "p" | "d";

export type SubshellFill = {
  n: number;
  l: OrbitalL;
  count: number;
  orbitals: number[];
};

const ORDER: { n: number; l: OrbitalL; cap: number; orbitals: number }[] = [
  { n: 1, l: "s", cap: 2, orbitals: 1 },
  { n: 2, l: "s", cap: 2, orbitals: 1 },
  { n: 2, l: "p", cap: 6, orbitals: 3 },
  { n: 3, l: "s", cap: 2, orbitals: 1 },
  { n: 3, l: "p", cap: 6, orbitals: 3 },
  { n: 4, l: "s", cap: 2, orbitals: 1 },
  { n: 3, l: "d", cap: 10, orbitals: 5 },
  { n: 4, l: "p", cap: 6, orbitals: 3 },
];

function hund(count: number, orbitalCount: number): number[] {
  const slots = Array.from({ length: orbitalCount }, () => 0);
  let left = count;
  for (let i = 0; i < orbitalCount && left > 0; i += 1) {
    slots[i] = 1;
    left -= 1;
  }
  for (let i = 0; i < orbitalCount && left > 0; i += 1) {
    slots[i] = 2;
    left -= 1;
  }
  return slots;
}

export function configuration(electrons: number): { fills: SubshellFill[]; perN: number[] } {
  let left = Math.max(0, electrons);
  const fills: SubshellFill[] = [];
  const perN = [0, 0, 0, 0, 0];
  for (const sub of ORDER) {
    if (left <= 0) break;
    const count = Math.min(sub.cap, left);
    fills.push({
      n: sub.n,
      l: sub.l,
      count,
      orbitals: hund(count, sub.orbitals),
    });
    perN[sub.n] += count;
    left -= count;
  }
  return { fills, perN };
}

export type ShellDraw = { n: number; count: number; radius: number };

const SHELL_RADIUS = [0, 52, 82, 112, 140];

export function shellsFor(electrons: number): ShellDraw[] {
  const { perN } = configuration(electrons);
  const shells: ShellDraw[] = [];
  for (let n = 1; n <= 4; n += 1) {
    if (perN[n] > 0) {
      shells.push({ n, count: perN[n], radius: SHELL_RADIUS[n] ?? 140 });
    }
  }
  return shells;
}

const RYDBERG = 1.096776e7;
const EH = 13.59844;

export function levelEnergy(n: number): number {
  return -EH / (n * n);
}

const SERIES = ["", "Lyman", "Balmer", "Paschen", "Brackett", "Pfund"];

export type Band = "ultraviolet" | "visible" | "infrared";

export function spectralBand(nm: number): Band {
  if (nm < 380) return "ultraviolet";
  if (nm > 740) return "infrared";
  return "visible";
}

export type Photon = {
  nm: number;
  eV: number;
  series: string;
  band: Band;
  high: number;
  low: number;
  absorption: boolean;
};

export function transition(high: number, low: number, absorption: boolean): Photon {
  const upper = Math.max(high, low);
  const lower = Math.min(high, low);
  const inv = 1 / (lower * lower) - 1 / (upper * upper);
  const nm = 1e9 / (RYDBERG * inv);
  return {
    nm,
    eV: EH * inv,
    series: SERIES[lower] ?? "series",
    band: spectralBand(nm),
    high: upper,
    low: lower,
    absorption,
  };
}

/** Approximate sRGB for a visible wavelength. Null outside 380–740 nm. */
export function wavelengthRgb(nm: number): string | null {
  if (nm < 380 || nm > 740) return null;
  let r = 0;
  let g = 0;
  let b = 0;
  if (nm < 440) {
    r = (440 - nm) / 60;
    b = 1;
  } else if (nm < 490) {
    g = (nm - 440) / 50;
    b = 1;
  } else if (nm < 510) {
    g = 1;
    b = (510 - nm) / 20;
  } else if (nm < 580) {
    r = (nm - 510) / 70;
    g = 1;
  } else if (nm < 645) {
    r = 1;
    g = (645 - nm) / 65;
  } else {
    r = 1;
  }
  let fade = 1;
  if (nm < 420) fade = 0.3 + (0.7 * (nm - 380)) / 40;
  else if (nm > 700) fade = 0.3 + (0.7 * (740 - nm)) / 40;
  const channel = (c: number) => Math.round(255 * (c * fade) ** 0.8);
  return `rgb(${channel(r)}, ${channel(g)}, ${channel(b)})`;
}

export function chargeText(protons: number, electrons: number): string {
  const q = protons - electrons;
  if (q === 0) return "0";
  const mag = Math.abs(q);
  const sign = q > 0 ? "+" : "−";
  return mag === 1 ? sign : `${mag}${sign}`;
}

export function ionWord(protons: number, electrons: number): string {
  const q = protons - electrons;
  if (q === 0) return "Neutral atom";
  if (q > 0) return "Positive ion";
  return "Negative ion";
}

export type ScatterClass = "through" | "deflected" | "back";

export type ScatterBody = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  done: boolean;
};

export const COULOMB = 1_050_000;

export function stepScatter(
  body: ScatterBody,
  cx: number,
  cy: number,
  dt: number,
  w: number,
  h: number,
) {
  let remaining = dt;
  while (remaining > 1e-12) {
    const dx = body.x - cx;
    const dy = body.y - cy;
    const r = Math.hypot(dx, dy);
    if (r === 0) throw new RangeError("Scattering cannot start at the point nucleus.");
    const speed = Math.hypot(body.vx, body.vy);
    const hdt = Math.min(
      remaining,
      0.0002,
      (0.02 * r) / Math.max(1, speed),
      0.02 * Math.sqrt(r ** 3 / COULOMB),
    );
    const ax = (COULOMB * dx) / r ** 3;
    const ay = (COULOMB * dy) / r ** 3;
    body.x += body.vx * hdt + 0.5 * ax * hdt ** 2;
    body.y += body.vy * hdt + 0.5 * ay * hdt ** 2;
    const nextDx = body.x - cx;
    const nextDy = body.y - cy;
    const nextR = Math.hypot(nextDx, nextDy);
    body.vx += 0.5 * (ax + (COULOMB * nextDx) / nextR ** 3) * hdt;
    body.vy += 0.5 * (ay + (COULOMB * nextDy) / nextR ** 3) * hdt;
    body.age += hdt;
    remaining -= hdt;
  }
  if (body.age > 0.08 && (body.x < 6 || body.x > w - 6 || body.y < 6 || body.y > h - 6)) {
    body.done = true;
  }
}

export function classifyScatter(body: ScatterBody): ScatterClass {
  const deg = Math.abs((Math.atan2(body.vy, body.vx) * 180) / Math.PI);
  if (deg > 90) return "back";
  if (deg > 12) return "deflected";
  return "through";
}
