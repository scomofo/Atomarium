import { ELEMENTS } from "./course-data.ts";

// Explicit records only. A stable-isotope list cannot predict a decay mode.
// KAERI nuclide tables: Ar37 and C14 (links in docs/curriculum-corrections.md).
const RADIOACTIVE: Record<string, string> = {
  "18-37":
    "Argon-37 is radioactive. It decays by electron capture to chlorine-37: a proton becomes a neutron. It is not an example of too many neutrons.",
  "6-14":
    "Carbon-14 is radioactive. In beta-minus decay a neutron becomes a proton, producing nitrogen-14.",
};

export function stabilityLine(protons: number, neutrons: number): string {
  const element = ELEMENTS[protons - 1];
  if (!element) return "No element selected.";
  const mass = protons + neutrons;
  if (element.stable.includes(mass))
    return `${element.name}-${mass} is listed as stable: no radioactive decay has been observed.`;
  return (
    RADIOACTIVE[`${protons}-${mass}`] ??
    `${element.name}-${mass} is outside this bench’s verified nuclide records. The counters alone do not establish whether this combination is bound or how it decays.`
  );
}
