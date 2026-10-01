export type StationId = "build" | "models" | "light" | "decay" | "foil" | "check";

export type Station = {
  id: StationId;
  index: string;
  title: string;
  summary: string;
};

export const STATIONS: Station[] = [
  {
    id: "build",
    index: "01",
    title: "Build an atom",
    summary: "Protons name it. Neutrons weigh it. Electrons charge it.",
  },
  {
    id: "models",
    index: "02",
    title: "Five models",
    summary: "Each picture of the atom kept something and dropped something.",
  },
  {
    id: "light",
    index: "03",
    title: "Light from hydrogen",
    summary: "An energy gap predicts a photon wavelength in this simplified model.",
  },
  {
    id: "decay",
    index: "04",
    title: "Half-life",
    summary: "No atom carries a timer. The curve is just probability.",
  },
  {
    id: "foil",
    index: "05",
    title: "Gold foil",
    summary: "Fire helium nuclei at gold and watch the empty atom.",
  },
  {
    id: "check",
    index: "06",
    title: "Check yourself",
    summary: "Eight questions from the benches. The reason matters more than the score.",
  },
];

export type ElementInfo = {
  z: number;
  symbol: string;
  name: string;
  stable: number[];
};

export const ELEMENTS: ElementInfo[] = [
  { z: 1, symbol: "H", name: "Hydrogen", stable: [1, 2] },
  { z: 2, symbol: "He", name: "Helium", stable: [3, 4] },
  { z: 3, symbol: "Li", name: "Lithium", stable: [6, 7] },
  { z: 4, symbol: "Be", name: "Beryllium", stable: [9] },
  { z: 5, symbol: "B", name: "Boron", stable: [10, 11] },
  { z: 6, symbol: "C", name: "Carbon", stable: [12, 13] },
  { z: 7, symbol: "N", name: "Nitrogen", stable: [14, 15] },
  { z: 8, symbol: "O", name: "Oxygen", stable: [16, 17, 18] },
  { z: 9, symbol: "F", name: "Fluorine", stable: [19] },
  { z: 10, symbol: "Ne", name: "Neon", stable: [20, 21, 22] },
  { z: 11, symbol: "Na", name: "Sodium", stable: [23] },
  { z: 12, symbol: "Mg", name: "Magnesium", stable: [24, 25, 26] },
  { z: 13, symbol: "Al", name: "Aluminum", stable: [27] },
  { z: 14, symbol: "Si", name: "Silicon", stable: [28, 29, 30] },
  { z: 15, symbol: "P", name: "Phosphorus", stable: [31] },
  { z: 16, symbol: "S", name: "Sulfur", stable: [32, 33, 34, 36] },
  { z: 17, symbol: "Cl", name: "Chlorine", stable: [35, 37] },
  { z: 18, symbol: "Ar", name: "Argon", stable: [36, 38, 40] },
  { z: 19, symbol: "K", name: "Potassium", stable: [39, 41] },
  { z: 20, symbol: "Ca", name: "Calcium", stable: [40, 42, 43, 44, 46] },
];

export type Preset = { label: string; p: number; n: number; e: number };

export const PRESETS: Preset[] = [
  { label: "Hydrogen", p: 1, n: 0, e: 1 },
  { label: "Carbon", p: 6, n: 6, e: 6 },
  { label: "Oxygen", p: 8, n: 8, e: 8 },
  { label: "Sodium", p: 11, n: 12, e: 11 },
  { label: "Chlorine", p: 17, n: 18, e: 17 },
  { label: "Calcium", p: 20, n: 20, e: 20 },
];

export type AtomModel = {
  id: string;
  year: string;
  name: string;
  person: string;
  body: string;
  kept: string;
  dropped: string;
};

export const MODELS: AtomModel[] = [
  {
    id: "dalton",
    year: "1803",
    name: "Solid sphere",
    person: "John Dalton",
    body: "Dalton needed an atom that could explain why compounds always use the same ratios of mass. His answer was a tiny, indivisible ball, identical for a given element. It is the model you still sketch when you only care about counting.",
    kept: "Elements come in atoms, and compounds combine them in whole-number ratios.",
    dropped:
      "Atoms are not indivisible, and not every atom of an element is identical. Isotopes broke that second claim.",
  },
  {
    id: "thomson",
    year: "1904",
    name: "Plum pudding",
    person: "J. J. Thomson",
    body: "Cathode rays showed something smaller than an atom, with a negative charge. Thomson embedded those electrons in a soft sphere of positive charge, like fruit in a pudding, so the whole atom stayed neutral.",
    kept: "The electron, and the fact that an atom's charges cancel.",
    dropped:
      "Positive charge is not smeared through the volume. The foil experiment put almost all the mass in one speck.",
  },
  {
    id: "rutherford",
    year: "1911",
    name: "The nucleus",
    person: "Ernest Rutherford",
    body: "A few alpha particles bounced back from gold foil. Large backward deflections supported a small, massive, positively charged nucleus. Coulomb repulsion can turn a particle around without a surface collision. The rest of the atom is empty enough that most alphas never notice it.",
    kept: "A minute, massive, positive nucleus. The atom is mostly empty space.",
    dropped:
      "Nothing in classical physics explains an electron that orbits without radiating its energy away and falling in. It should, in a fraction of a nanosecond.",
  },
  {
    id: "bohr",
    year: "1913",
    name: "Energy rungs",
    person: "Niels Bohr",
    body: "Bohr kept the nucleus and forbade the electron from sitting anywhere but a ladder of energies. A jump down releases one photon whose energy is exactly the gap. Hydrogen's spectrum fell out of the rule.",
    kept: "Quantized energy, and a photon for each jump. Hydrogen's lines match the formula.",
    dropped:
      "The electron is not a planet on a rail. The picture fails as soon as a second electron shows up.",
  },
  {
    id: "quantum",
    year: "1926",
    name: "The cloud",
    person: "Schrödinger, Heisenberg",
    body: "The modern orbital is not a path. It is a map of where an electron is likely to be found if you look. The 1s cloud is thickest at the nucleus and thins outward. A 2p orbital has two lobes and a node of zero between them.",
    kept: "Probability, spin, and a shell structure that actually builds the periodic table.",
    dropped:
      "The comforting little orbit. What remains is a calculation that draws well and still is not a photograph.",
  },
];

export type DecaySample = {
  id: string;
  symbol: string;
  daughter: string;
  mode: string;
  halfLife: string;
  use: string;
};

export const DECAYS: DecaySample[] = [
  {
    id: "f18",
    symbol: "F-18",
    daughter: "O-18",
    mode: "β+",
    halfLife: "110 min",
    use: "The tracer in a PET scan. Short enough to be gone by tomorrow.",
  },
  {
    id: "tc99m",
    symbol: "Tc-99m",
    daughter: "Tc-99",
    mode: "γ",
    halfLife: "6.0 h",
    use: "A gamma camera isotope. The nucleus sheds energy and stays technetium.",
  },
  {
    id: "i131",
    symbol: "I-131",
    daughter: "Xe-131",
    mode: "β−",
    halfLife: "8.0 d",
    use: "Collected by the thyroid, which is why it is used against thyroid tissue.",
  },
  {
    id: "c14",
    symbol: "C-14",
    daughter: "N-14",
    mode: "β−",
    halfLife: "5,730 y",
    use: "Radiocarbon dating. Living things refresh it; dead things only lose it.",
  },
  {
    id: "co60",
    symbol: "Co-60",
    daughter: "Ni-60",
    mode: "β−",
    halfLife: "5.27 y",
    use: "A harsh gamma source for radiotherapy and for sterilizing equipment.",
  },
  {
    id: "u238",
    symbol: "U-238",
    daughter: "Th-234",
    mode: "α",
    halfLife: "4.47 billion y",
    use: "The long clock. On this bench it ticks as fast as fluorine, which the universe does not.",
  },
];

export type Question = {
  prompt: string;
  choices: string[];
  answer: number;
  why: string;
};

export const QUESTIONS: Question[] = [
  {
    prompt: "What does the atomic number count?",
    choices: ["Neutrons", "Protons", "The mass number", "Electron shells"],
    answer: 1,
    why: "The atomic number Z is the proton count. That count is the element's name. Neutrons change the isotope, not the element.",
  },
  {
    prompt: "Carbon-12 and carbon-14 differ as",
    choices: ["elements", "ions", "isotopes", "orbitals"],
    answer: 2,
    why: "Same protons, different neutrons. Same element, different mass number. Carbon-14 is the radioactive one.",
  },
  {
    prompt: "Which result forced a nucleus into the model of the atom?",
    choices: [
      "Oil drops balancing in an electric field",
      "A few alpha particles bouncing back from gold foil",
      "Light knocking electrons off a metal",
      "The colors of a hot blackbody",
    ],
    answer: 1,
    why: "Geiger and Marsden's foil experiment. A bounce that sharp needs a small, heavy, positive target. The oil drop measured the electron's charge; it did not find the nucleus.",
  },
  {
    prompt: "A visible line in hydrogen's Balmer series is a jump that ends on",
    choices: ["n = 1", "n = 2", "n = 3", "n = ∞"],
    answer: 1,
    why: "Balmer lines land on n = 2. Drops that land on n = 1 are the Lyman series, and they are ultraviolet.",
  },
  {
    prompt: "After two half-lives, about what fraction of the parent atoms remain?",
    choices: ["One half", "One quarter", "None", "It depends how old each atom was"],
    answer: 1,
    why: "Each half-life leaves about half of whoever is still there. Half of a half is a quarter. The survivors are not internally older; they were lucky.",
  },
  {
    prompt: "Most alpha particles went straight through the gold foil because",
    choices: [
      "gold atoms have no nucleus",
      "electrons swallowed them",
      "an atom is almost entirely empty space",
      "the foil contained no atoms",
    ],
    answer: 2,
    why: "The nucleus is tiny next to the atom. Most trajectories never come close enough to feel it. This bench deliberately samples trajectories to demonstrate deflection; its counts do not predict experimental percentages.",
  },
  {
    prompt: "Remove one electron from a neutral sodium atom. You have",
    choices: [
      "a neon atom",
      "a positive sodium ion",
      "a negative sodium ion",
      "a new isotope of sodium",
    ],
    answer: 1,
    why: "The protons are still eleven, so it is still sodium. Fewer electrons than protons means a positive charge: Na⁺. Isotopes are a neutron story, not an electron story.",
  },
  {
    prompt: "Bohr's hydrogen atom explains sharp spectral lines because",
    choices: [
      "the electron can sit at any radius and glow the whole time",
      "the nucleus itself changes color",
      "only certain energies are allowed, and a jump releases one photon",
      "neutrons decay in colored steps",
    ],
    answer: 2,
    why: "The photon's energy is the difference between two allowed rungs, so only certain wavelengths come out. A classical electron would have smeared its light across every color.",
  },
];

export const ATOM_COUNT = 144;
export const HALF_LIFE_SECONDS = 6;
