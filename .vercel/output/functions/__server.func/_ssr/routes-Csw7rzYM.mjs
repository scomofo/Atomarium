import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Minus, c as ArrowLeft, i as Pause, n as Plus, o as ArrowUpRight, r as Play, s as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Csw7rzYM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ORDER = [
	{
		n: 1,
		l: "s",
		cap: 2,
		orbitals: 1
	},
	{
		n: 2,
		l: "s",
		cap: 2,
		orbitals: 1
	},
	{
		n: 2,
		l: "p",
		cap: 6,
		orbitals: 3
	},
	{
		n: 3,
		l: "s",
		cap: 2,
		orbitals: 1
	},
	{
		n: 3,
		l: "p",
		cap: 6,
		orbitals: 3
	},
	{
		n: 4,
		l: "s",
		cap: 2,
		orbitals: 1
	},
	{
		n: 3,
		l: "d",
		cap: 10,
		orbitals: 5
	},
	{
		n: 4,
		l: "p",
		cap: 6,
		orbitals: 3
	}
];
function hund(count, orbitalCount) {
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
function configuration(electrons) {
	let left = Math.max(0, electrons);
	const fills = [];
	const perN = [
		0,
		0,
		0,
		0,
		0
	];
	for (const sub of ORDER) {
		if (left <= 0) break;
		const count = Math.min(sub.cap, left);
		fills.push({
			n: sub.n,
			l: sub.l,
			count,
			orbitals: hund(count, sub.orbitals)
		});
		perN[sub.n] += count;
		left -= count;
	}
	return {
		fills,
		perN
	};
}
var SHELL_RADIUS = [
	0,
	52,
	82,
	112,
	140
];
function shellsFor(electrons) {
	const { perN } = configuration(electrons);
	const shells = [];
	for (let n = 1; n <= 4; n += 1) if (perN[n] > 0) shells.push({
		n,
		count: perN[n],
		radius: SHELL_RADIUS[n] ?? 140
	});
	return shells;
}
var RYDBERG = 10967760;
var EH = 13.59844;
function levelEnergy(n) {
	return -13.59844 / (n * n);
}
var SERIES = [
	"",
	"Lyman",
	"Balmer",
	"Paschen",
	"Brackett",
	"Pfund"
];
function spectralBand(nm) {
	if (nm < 380) return "ultraviolet";
	if (nm > 740) return "infrared";
	return "visible";
}
function transition(high, low, absorption) {
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
		absorption
	};
}
/** Approximate sRGB for a visible wavelength. Null outside 380–740 nm. */
function wavelengthRgb(nm) {
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
	} else r = 1;
	let fade = 1;
	if (nm < 420) fade = .3 + .7 * (nm - 380) / 40;
	else if (nm > 700) fade = .3 + .7 * (740 - nm) / 40;
	const channel = (c) => Math.round(255 * (c * fade) ** .8);
	return `rgb(${channel(r)}, ${channel(g)}, ${channel(b)})`;
}
function chargeText(protons, electrons) {
	const q = protons - electrons;
	if (q === 0) return "0";
	const mag = Math.abs(q);
	const sign = q > 0 ? "+" : "−";
	return mag === 1 ? sign : `${mag}${sign}`;
}
function ionWord(protons, electrons) {
	const q = protons - electrons;
	if (q === 0) return "Neutral atom";
	if (q > 0) return "Positive ion";
	return "Negative ion";
}
var COULOMB = 105e4;
function stepScatter(body, cx, cy, dt, w, h) {
	const sub = 24;
	const hdt = dt / sub;
	for (let i = 0; i < sub; i += 1) {
		let dx = body.x - cx;
		let dy = body.y - cy;
		let r = Math.hypot(dx, dy);
		if (r < 8) {
			const nx = dx / (r || 1);
			const ny = dy / (r || 1);
			const radial = body.vx * nx + body.vy * ny;
			if (radial < 0) {
				body.vx -= 2 * radial * nx;
				body.vy -= 2 * radial * ny;
			}
			body.x = cx + nx * 8;
			body.y = cy + ny * 8;
			dx = body.x - cx;
			dy = body.y - cy;
			r = 8;
		}
		const force = COULOMB / (r * r);
		body.vx += force * dx / r * hdt;
		body.vy += force * dy / r * hdt;
		body.x += body.vx * hdt;
		body.y += body.vy * hdt;
		body.age += hdt;
	}
	if (body.age > .08 && (body.x < 6 || body.x > w - 6 || body.y < 6 || body.y > h - 6)) body.done = true;
}
function classifyScatter(body) {
	const deg = Math.abs(Math.atan2(body.vy, body.vx) * 180 / Math.PI);
	if (deg > 90) return "back";
	if (deg > 12) return "deflected";
	return "through";
}
var CENTER = 160;
function nucleonPoints(protons, neutrons) {
	const total = protons + neutrons;
	if (total === 0) return [];
	const kinds = [];
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
		const radius = total === 1 ? 0 : reach * Math.sqrt((i + .5) / total);
		const angle = i * golden;
		return {
			kind,
			dot,
			x: Math.cos(angle) * radius,
			y: Math.sin(angle) * radius
		};
	});
}
function AtomFigure({ protons, neutrons, electrons, caption }) {
	const shells = shellsFor(electrons);
	const nucleons = nucleonPoints(protons, neutrons);
	const label = caption ?? `${protons} protons, ${neutrons} neutrons, ${electrons} electrons`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "m-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 320 320",
			role: "img",
			"aria-label": label,
			className: "h-auto w-full",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "320",
				height: "320",
				fill: "var(--color-chamber)",
				rx: "16"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				transform: `translate(${CENTER} ${CENTER})`,
				children: [
					shells.map((shell) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						className: "orbit",
						style: {
							transformOrigin: "0px 0px",
							animationDuration: `${20 - shell.n * 3}s`,
							animationDirection: shell.n % 2 === 0 ? "reverse" : "normal"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							r: shell.radius,
							fill: "none",
							stroke: "var(--color-line)",
							strokeWidth: "1"
						}), Array.from({ length: shell.count }, (_, index) => {
							const angle = index / shell.count * Math.PI * 2;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: Math.cos(angle) * shell.radius,
								cy: Math.sin(angle) * shell.radius,
								r: "5.5",
								fill: "var(--color-ion)"
							}, index);
						})]
					}, shell.n)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						r: "18",
						fill: "var(--color-brass)",
						opacity: "0.12"
					}),
					nucleons.map((nucleon, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: nucleon.x,
						cy: nucleon.y,
						r: nucleon.dot,
						fill: nucleon.kind === "p" ? "var(--color-brass)" : "var(--color-stone)"
					}, index))
				]
			})]
		}), caption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
			className: "mt-2 text-center text-xs text-fog",
			children: caption
		}) : null]
	});
}
var STATIONS = [
	{
		id: "build",
		index: "01",
		title: "Build an atom",
		summary: "Protons name it. Neutrons weigh it. Electrons charge it."
	},
	{
		id: "models",
		index: "02",
		title: "Five models",
		summary: "Each picture of the atom kept something and dropped something."
	},
	{
		id: "light",
		index: "03",
		title: "Light from hydrogen",
		summary: "A jump between rungs is a photon with one exact color."
	},
	{
		id: "decay",
		index: "04",
		title: "Half-life",
		summary: "No atom carries a timer. The curve is just probability."
	},
	{
		id: "foil",
		index: "05",
		title: "Gold foil",
		summary: "Fire helium nuclei at gold and watch the empty atom."
	},
	{
		id: "check",
		index: "06",
		title: "Check yourself",
		summary: "Eight questions from the benches. The reason matters more than the score."
	}
];
var ELEMENTS = [
	{
		z: 1,
		symbol: "H",
		name: "Hydrogen",
		stable: [1, 2]
	},
	{
		z: 2,
		symbol: "He",
		name: "Helium",
		stable: [3, 4]
	},
	{
		z: 3,
		symbol: "Li",
		name: "Lithium",
		stable: [6, 7]
	},
	{
		z: 4,
		symbol: "Be",
		name: "Beryllium",
		stable: [9]
	},
	{
		z: 5,
		symbol: "B",
		name: "Boron",
		stable: [10, 11]
	},
	{
		z: 6,
		symbol: "C",
		name: "Carbon",
		stable: [12, 13]
	},
	{
		z: 7,
		symbol: "N",
		name: "Nitrogen",
		stable: [14, 15]
	},
	{
		z: 8,
		symbol: "O",
		name: "Oxygen",
		stable: [
			16,
			17,
			18
		]
	},
	{
		z: 9,
		symbol: "F",
		name: "Fluorine",
		stable: [19]
	},
	{
		z: 10,
		symbol: "Ne",
		name: "Neon",
		stable: [
			20,
			21,
			22
		]
	},
	{
		z: 11,
		symbol: "Na",
		name: "Sodium",
		stable: [23]
	},
	{
		z: 12,
		symbol: "Mg",
		name: "Magnesium",
		stable: [
			24,
			25,
			26
		]
	},
	{
		z: 13,
		symbol: "Al",
		name: "Aluminum",
		stable: [27]
	},
	{
		z: 14,
		symbol: "Si",
		name: "Silicon",
		stable: [
			28,
			29,
			30
		]
	},
	{
		z: 15,
		symbol: "P",
		name: "Phosphorus",
		stable: [31]
	},
	{
		z: 16,
		symbol: "S",
		name: "Sulfur",
		stable: [
			32,
			33,
			34,
			36
		]
	},
	{
		z: 17,
		symbol: "Cl",
		name: "Chlorine",
		stable: [35, 37]
	},
	{
		z: 18,
		symbol: "Ar",
		name: "Argon",
		stable: [
			36,
			38,
			40
		]
	},
	{
		z: 19,
		symbol: "K",
		name: "Potassium",
		stable: [39, 41]
	},
	{
		z: 20,
		symbol: "Ca",
		name: "Calcium",
		stable: [
			40,
			42,
			43,
			44,
			46
		]
	}
];
var PRESETS = [
	{
		label: "Hydrogen",
		p: 1,
		n: 0,
		e: 1
	},
	{
		label: "Carbon",
		p: 6,
		n: 6,
		e: 6
	},
	{
		label: "Oxygen",
		p: 8,
		n: 8,
		e: 8
	},
	{
		label: "Sodium",
		p: 11,
		n: 12,
		e: 11
	},
	{
		label: "Chlorine",
		p: 17,
		n: 18,
		e: 17
	},
	{
		label: "Calcium",
		p: 20,
		n: 20,
		e: 20
	}
];
var MODELS = [
	{
		id: "dalton",
		year: "1803",
		name: "Solid sphere",
		person: "John Dalton",
		body: "Dalton needed an atom that could explain why compounds always use the same ratios of mass. His answer was a tiny, indivisible ball, identical for a given element. It is the model you still sketch when you only care about counting.",
		kept: "Elements come in atoms, and compounds combine them in whole-number ratios.",
		dropped: "Atoms are not indivisible, and not every atom of an element is identical. Isotopes broke that second claim."
	},
	{
		id: "thomson",
		year: "1904",
		name: "Plum pudding",
		person: "J. J. Thomson",
		body: "Cathode rays showed something smaller than an atom, with a negative charge. Thomson embedded those electrons in a soft sphere of positive charge, like fruit in a pudding, so the whole atom stayed neutral.",
		kept: "The electron, and the fact that an atom's charges cancel.",
		dropped: "Positive charge is not smeared through the volume. The foil experiment put almost all the mass in one speck."
	},
	{
		id: "rutherford",
		year: "1911",
		name: "The nucleus",
		person: "Ernest Rutherford",
		body: "A few alpha particles bounced back from gold foil. That is only possible if they hit something small, massive, and positive. The rest of the atom is empty enough that most alphas never notice it.",
		kept: "A minute, massive, positive nucleus. The atom is mostly empty space.",
		dropped: "Nothing in classical physics explains an electron that orbits without radiating its energy away and falling in. It should, in a fraction of a nanosecond."
	},
	{
		id: "bohr",
		year: "1913",
		name: "Energy rungs",
		person: "Niels Bohr",
		body: "Bohr kept the nucleus and forbade the electron from sitting anywhere but a ladder of energies. A jump down releases one photon whose energy is exactly the gap. Hydrogen's spectrum fell out of the rule.",
		kept: "Quantized energy, and a photon for each jump. Hydrogen's lines match the formula.",
		dropped: "The electron is not a planet on a rail. The picture fails as soon as a second electron shows up."
	},
	{
		id: "quantum",
		year: "1926",
		name: "The cloud",
		person: "Schrödinger, Heisenberg",
		body: "The modern orbital is not a path. It is a map of where an electron is likely to be found if you look. The 1s cloud is thickest at the nucleus and thins outward. A 2p orbital has two lobes and a node of zero between them.",
		kept: "Probability, spin, and a shell structure that actually builds the periodic table.",
		dropped: "The comforting little orbit. What remains is a calculation that draws well and still is not a photograph."
	}
];
var DECAYS = [
	{
		id: "f18",
		symbol: "F-18",
		daughter: "O-18",
		mode: "β+",
		halfLife: "110 min",
		use: "The tracer in a PET scan. Short enough to be gone by tomorrow."
	},
	{
		id: "tc99m",
		symbol: "Tc-99m",
		daughter: "Tc-99",
		mode: "γ",
		halfLife: "6.0 h",
		use: "A gamma camera isotope. The nucleus sheds energy and stays technetium."
	},
	{
		id: "i131",
		symbol: "I-131",
		daughter: "Xe-131",
		mode: "β−",
		halfLife: "8.0 d",
		use: "Collected by the thyroid, which is why it is used against thyroid tissue."
	},
	{
		id: "c14",
		symbol: "C-14",
		daughter: "N-14",
		mode: "β−",
		halfLife: "5,730 y",
		use: "Radiocarbon dating. Living things refresh it; dead things only lose it."
	},
	{
		id: "co60",
		symbol: "Co-60",
		daughter: "Ni-60",
		mode: "β−",
		halfLife: "5.27 y",
		use: "A harsh gamma source for radiotherapy and for sterilizing equipment."
	},
	{
		id: "u238",
		symbol: "U-238",
		daughter: "Th-234",
		mode: "α",
		halfLife: "4.47 billion y",
		use: "The long clock. On this bench it ticks as fast as fluorine, which the universe does not."
	}
];
var QUESTIONS = [
	{
		prompt: "What does the atomic number count?",
		choices: [
			"Neutrons",
			"Protons",
			"The mass number",
			"Electron shells"
		],
		answer: 1,
		why: "The atomic number Z is the proton count. That count is the element's name. Neutrons change the isotope, not the element."
	},
	{
		prompt: "Carbon-12 and carbon-14 differ as",
		choices: [
			"elements",
			"ions",
			"isotopes",
			"orbitals"
		],
		answer: 2,
		why: "Same protons, different neutrons. Same element, different mass number. Carbon-14 is the radioactive one."
	},
	{
		prompt: "Which result forced a nucleus into the model of the atom?",
		choices: [
			"Oil drops balancing in an electric field",
			"A few alpha particles bouncing back from gold foil",
			"Light knocking electrons off a metal",
			"The colors of a hot blackbody"
		],
		answer: 1,
		why: "Geiger and Marsden's foil experiment. A bounce that sharp needs a small, heavy, positive target. The oil drop measured the electron's charge; it did not find the nucleus."
	},
	{
		prompt: "A visible line in hydrogen's Balmer series is a jump that ends on",
		choices: [
			"n = 1",
			"n = 2",
			"n = 3",
			"n = ∞"
		],
		answer: 1,
		why: "Balmer lines land on n = 2. Drops that land on n = 1 are the Lyman series, and they are ultraviolet."
	},
	{
		prompt: "After two half-lives, about what fraction of the parent atoms remain?",
		choices: [
			"One half",
			"One quarter",
			"None",
			"It depends how old each atom was"
		],
		answer: 1,
		why: "Each half-life leaves about half of whoever is still there. Half of a half is a quarter. The survivors are not internally older; they were lucky."
	},
	{
		prompt: "Most alpha particles went straight through the gold foil because",
		choices: [
			"gold atoms have no nucleus",
			"electrons swallowed them",
			"an atom is almost entirely empty space",
			"the foil contained no atoms"
		],
		answer: 2,
		why: "The nucleus is tiny next to the atom. Most trajectories never come close enough to feel it. On this course the nucleus is drawn far too big, so you will see more deflections than Geiger did."
	},
	{
		prompt: "Remove one electron from a neutral sodium atom. You have",
		choices: [
			"a neon atom",
			"a positive sodium ion",
			"a negative sodium ion",
			"a new isotope of sodium"
		],
		answer: 1,
		why: "The protons are still eleven, so it is still sodium. Fewer electrons than protons means a positive charge: Na⁺. Isotopes are a neutron story, not an electron story."
	},
	{
		prompt: "Bohr's hydrogen atom explains sharp spectral lines because",
		choices: [
			"the electron can sit at any radius and glow the whole time",
			"the nucleus itself changes color",
			"only certain energies are allowed, and a jump releases one photon",
			"neutrons decay in colored steps"
		],
		answer: 2,
		why: "The photon's energy is the difference between two allowed rungs, so only certain wavelengths come out. A classical electron would have smeared its light across every color."
	}
];
var useCourse = create()(persist((set) => ({
	view: "home",
	seen: [],
	bestScore: 0,
	attempts: 0,
	setView: (view) => set({ view }),
	markSeen: (id) => set((state) => ({ seen: state.seen.includes(id) ? state.seen : [...state.seen, id] })),
	recordScore: (score) => set((state) => ({
		bestScore: Math.max(state.bestScore, score),
		attempts: state.attempts + 1
	})),
	resetProgress: () => set({
		seen: [],
		bestScore: 0,
		attempts: 0,
		view: "home"
	})
}), {
	name: "atomarium-course",
	skipHydration: true,
	partialize: (state) => ({
		seen: state.seen,
		bestScore: state.bestScore,
		attempts: state.attempts
	})
}));
function Bench({ id, lede, notes, children }) {
	const station = STATIONS.find((item) => item.id === id);
	const setView = useCourse((state) => state.setView);
	const markSeen = useCourse((state) => state.markSeen);
	const next = STATIONS[STATIONS.findIndex((item) => item.id === id) + 1];
	(0, import_react.useEffect)(() => {
		markSeen(id);
	}, [id, markSeen]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "btn btn-quiet mb-5",
		onClick: () => setView("home"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
			className: "size-4",
			"aria-hidden": "true"
		}), "All benches"]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid items-start gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "order-2 lg:order-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-widest text-brass uppercase",
					children: station.index
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-4xl text-mist sm:text-5xl",
					children: station.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-base leading-relaxed text-fog",
					children: lede
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-4 text-sm leading-relaxed text-mist",
					children: notes
				}),
				next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "btn mt-8",
					onClick: () => setView(next.id),
					children: [
						"Next: ",
						next.title,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
							className: "size-4",
							"aria-hidden": "true"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn mt-8",
					onClick: () => setView("home"),
					children: "Back to the course"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "order-1 min-w-0 lg:order-2",
			children
		})]
	})] });
}
var MAX_P = 20;
var MAX_N = 40;
var MAX_E = 26;
function stabilityLine(protons, neutrons) {
	const element = ELEMENTS[protons - 1];
	if (!element) return "";
	const mass = protons + neutrons;
	if (element.stable.includes(mass)) return `${element.name}-${mass} is a stable isotope. It does not decay on any ordinary clock.`;
	if (mass < Math.min(...element.stable)) return `Too few neutrons for a stable ${element.name.toLowerCase()} nucleus. This one would not last.`;
	return `Too many neutrons for stable ${element.name.toLowerCase()}. A nucleus like this decays until the ratio is comfortable.`;
}
function Counter({ label, hint, value, swatch, onAdd, onRemove, addLabel, removeLabel, canAdd, canRemove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-panel p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "size-2.5 rounded-full",
					style: { background: swatch },
					"aria-hidden": "true"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-mist",
					children: label
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-fog",
				children: hint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-between gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-icon",
						"aria-label": removeLabel,
						onClick: onRemove,
						disabled: !canRemove,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {
							className: "size-4",
							"aria-hidden": "true"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-3xl text-mist tabular-nums",
						children: value
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-icon",
						"aria-label": addLabel,
						onClick: onAdd,
						disabled: !canAdd,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							className: "size-4",
							"aria-hidden": "true"
						})
					})
				]
			})
		]
	});
}
function BuildLab() {
	const [protons, setProtons] = (0, import_react.useState)(6);
	const [neutrons, setNeutrons] = (0, import_react.useState)(6);
	const [electrons, setElectrons] = (0, import_react.useState)(6);
	const element = protons > 0 ? ELEMENTS[protons - 1] : null;
	const mass = protons + neutrons;
	const { fills } = configuration(electrons);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bench, {
		id: "build",
		lede: "The periodic table is a list of proton counts. Neutrons change the mass. Electrons change the charge. Nothing else renames the element.",
		notes: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Six protons is carbon, whether or not the electrons are all home and whether or not a neutron wanders in. Take one electron off sodium and you still have sodium — the ion in table salt, not a new element." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This bench stops at calcium, element 20. That is far enough for shells, ions, and the common isotopes, and short of the messier middle of the table. The filling order here is the real one: 4s before 3d, Hund’s rule in the boxes." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-fog",
				children: "Brass is a proton. Stone is a neutron. The aqua dots are electrons. The rings are a drawing of shells, not orbits the electron travels."
			})
		] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-line bg-panel p-4 sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtomFigure, {
					protons,
					neutrons,
					electrons
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: element ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-5xl text-mist",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sup", {
								className: "mr-1 text-lg text-fog tabular-nums",
								children: mass
							}),
							element.symbol,
							protons !== electrons ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", {
								className: "ml-1 text-base text-brass",
								children: chargeText(protons, electrons)
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-fog",
						children: [
							element.name,
							" · ",
							ionWord(protons, electrons)
						]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl text-mist",
						children: "No element yet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-fog",
						children: "An atom needs at least one proton to have a name."
					})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid grid-cols-2 gap-x-4 gap-y-1 text-right text-sm tabular-nums",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-fog",
								children: "Z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: protons }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-fog",
								children: "A"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: mass })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 min-h-10 text-sm leading-relaxed text-mist",
					children: element ? stabilityLine(protons, neutrons) : "Add protons to choose an element from hydrogen through calcium."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn",
						onClick: () => {
							setProtons(preset.p);
							setNeutrons(preset.n);
							setElectrons(preset.e);
						},
						children: preset.label
					}, preset.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-quiet",
						onClick: () => {
							setProtons(0);
							setNeutrons(0);
							setElectrons(0);
						},
						children: "Clear"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Counter, {
							label: "Protons",
							hint: "Sets the element",
							value: protons,
							swatch: "var(--color-brass)",
							canAdd: protons < MAX_P,
							canRemove: protons > 0,
							addLabel: "Add a proton",
							removeLabel: "Remove a proton",
							onAdd: () => setProtons((value) => Math.min(MAX_P, value + 1)),
							onRemove: () => setProtons((value) => Math.max(0, value - 1))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Counter, {
							label: "Neutrons",
							hint: "Sets the isotope",
							value: neutrons,
							swatch: "var(--color-stone)",
							canAdd: neutrons < MAX_N,
							canRemove: neutrons > 0,
							addLabel: "Add a neutron",
							removeLabel: "Remove a neutron",
							onAdd: () => setNeutrons((value) => Math.min(MAX_N, value + 1)),
							onRemove: () => setNeutrons((value) => Math.max(0, value - 1))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Counter, {
							label: "Electrons",
							hint: "Sets the charge",
							value: electrons,
							swatch: "var(--color-ion)",
							canAdd: electrons < MAX_E,
							canRemove: electrons > 0,
							addLabel: "Add an electron",
							removeLabel: "Remove an electron",
							onAdd: () => setElectrons((value) => Math.min(MAX_E, value + 1)),
							onRemove: () => setElectrons((value) => Math.max(0, value - 1))
						})
					]
				}),
				fills.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-widest text-fog uppercase",
								children: "Configuration"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg text-mist",
								children: fills.map((fill) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mr-2",
									children: [
										fill.n,
										fill.l,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sup", { children: fill.count })
									]
								}, `${fill.n}${fill.l}`))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex gap-4 overflow-x-auto pb-1",
							children: fills.map((fill) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mb-1 text-xs text-fog",
									children: [fill.n, fill.l]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-1",
									children: fill.orbitals.map((occupancy, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex h-11 w-8 flex-col items-center justify-center rounded-md border border-line bg-chamber text-xs text-ion",
										"aria-label": `${fill.n}${fill.l} orbital ${index + 1}, ${occupancy} electrons`,
										children: [occupancy > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "↑" }) : null, occupancy > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "↓" }) : null]
									}, index))
								})]
							}, `${fill.n}${fill.l}-box`))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-fog",
							children: "Hund’s rule: within a subshell, electrons sit alone in orbitals before they pair."
						})
					]
				}) : null
			]
		})
	});
}
function CheckLab() {
	const recordScore = useCourse((state) => state.recordScore);
	const bestScore = useCourse((state) => state.bestScore);
	const attempts = useCourse((state) => state.attempts);
	const resetProgress = useCourse((state) => state.resetProgress);
	const [step, setStep] = (0, import_react.useState)(0);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [correct, setCorrect] = (0, import_react.useState)(0);
	const [picks, setPicks] = (0, import_react.useState)([]);
	const [done, setDone] = (0, import_react.useState)(false);
	const question = QUESTIONS[step];
	function choose(index) {
		if (picked !== null || !question) return;
		setPicked(index);
		if (index === question.answer) setCorrect((value) => value + 1);
	}
	function next() {
		if (picked === null) return;
		const history = [...picks, picked];
		if (step + 1 >= QUESTIONS.length) {
			const score = history.reduce((sum, choice, index) => {
				return sum + (choice === QUESTIONS[index]?.answer ? 1 : 0);
			}, 0);
			setPicks(history);
			setCorrect(score);
			setDone(true);
			recordScore(score);
			return;
		}
		setPicks(history);
		setPicked(null);
		setStep((value) => value + 1);
	}
	function again() {
		setStep(0);
		setPicked(null);
		setCorrect(0);
		setPicks([]);
		setDone(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bench, {
		id: "check",
		lede: "Eight questions taken from the benches. No timer. Read the reason either way.",
		notes: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "A right answer without the mechanism is just a memory. The note under each choice is the part worth keeping." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-fog tabular-nums",
				children: attempts > 0 ? `Best so far: ${bestScore} of ${QUESTIONS.length}.` : "No score yet."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn btn-quiet",
				onClick: resetProgress,
				children: "Clear saved progress"
			})
		] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-2xl border border-line bg-panel p-4 sm:p-5",
			children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-widest text-brass uppercase",
					children: "Result"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mt-2 text-4xl text-mist tabular-nums",
					children: [
						correct,
						" of ",
						QUESTIONS.length
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-fog",
					children: correct === QUESTIONS.length ? "Clean sweep. The benches have nothing left to hide." : "The misses are listed with the reason. The benches are still there if you want another look."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-5 space-y-4",
					children: QUESTIONS.map((item, index) => {
						const choice = picks[index];
						const ok = choice === item.answer;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-t border-line pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-mist",
								children: item.prompt
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: `mt-1 text-sm ${ok ? "text-brass" : "text-fog"}`,
								children: [ok ? "Right. " : `You chose “${item.choices[choice ?? 0]}”. `, item.why]
							})]
						}, item.prompt);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-brass mt-6",
					onClick: again,
					children: "Try again"
				})
			] }) : question ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs tracking-widest text-fog uppercase tabular-nums",
					children: [
						step + 1,
						" of ",
						QUESTIONS.length
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-2xl text-mist sm:text-3xl",
					children: question.prompt
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-2",
					children: question.choices.map((choice, index) => {
						const selected = picked === index;
						const isAnswer = picked !== null && index === question.answer;
						const wrong = selected && index !== question.answer;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `btn h-auto min-h-11 justify-start px-4 py-3 text-left ${isAnswer ? "btn-brass" : ""} ${wrong ? "border-fog text-fog" : ""}`,
							onClick: () => choose(index),
							disabled: picked !== null && !selected && !isAnswer,
							children: choice
						}, choice);
					})
				}),
				picked !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm leading-relaxed text-mist",
					children: question.why
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-brass mt-4",
					onClick: next,
					children: step + 1 === QUESTIONS.length ? "See the result" : "Next question"
				})] }) : null
			] }) : null
		})
	});
}
function makeAtoms(width, height) {
	const cols = 16;
	const rows = 9;
	const atoms = [];
	for (let i = 0; i < 144; i += 1) {
		const col = i % cols;
		const row = Math.floor(i / cols);
		atoms.push({
			x: (col + .5) / cols * width,
			y: (row + .5) / rows * height,
			dead: false
		});
	}
	return atoms;
}
function colorOf(name, fallback) {
	if (typeof document === "undefined") return fallback;
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}
function DecayLab() {
	const fieldRef = (0, import_react.useRef)(null);
	const chartRef = (0, import_react.useRef)(null);
	const atomsRef = (0, import_react.useRef)([]);
	const samplesRef = (0, import_react.useRef)([{
		t: 0,
		alive: 144
	}]);
	const timeRef = (0, import_react.useRef)(0);
	const runningRef = (0, import_react.useRef)(false);
	const isotopeRef = (0, import_react.useRef)(DECAYS[3] ?? DECAYS[0]);
	const [isotopeId, setIsotopeId] = (0, import_react.useState)(DECAYS[3]?.id ?? "c14");
	const [running, setRunning] = (0, import_react.useState)(false);
	const [alive, setAlive] = (0, import_react.useState)(144);
	const [halfLives, setHalfLives] = (0, import_react.useState)(0);
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
		if (atomsRef.current.length === 0) atomsRef.current = makeAtoms(fw, fh);
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
		const plotW = cw - 32;
		const plotH = ch - 32;
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
			const t = i / steps * maxT;
			const y = pad + plotH * (1 - .5 ** t);
			const x = pad + t / maxT * plotW;
			if (i === 0) cctx.moveTo(x, y);
			else cctx.lineTo(x, y);
		}
		cctx.stroke();
		cctx.setLineDash([]);
		cctx.strokeStyle = brass;
		cctx.lineWidth = 1.75;
		cctx.beginPath();
		samplesRef.current.forEach((sample, index) => {
			const x = pad + sample.t / maxT * plotW;
			const y = pad + plotH * (1 - sample.alive / 144);
			if (index === 0) cctx.moveTo(x, y);
			else cctx.lineTo(x, y);
		});
		cctx.stroke();
		cctx.fillStyle = fog;
		cctx.font = "11px IBM Plex Sans, sans-serif";
		cctx.fillText("theory", 24, 28);
		cctx.fillStyle = mist;
		cctx.fillText("this run", 74, 28);
	}
	function publish() {
		const left = atomsRef.current.filter((atom) => !atom.dead).length;
		setAlive(left);
		setHalfLives(timeRef.current);
		paint();
	}
	function reset(nextId = isotopeId) {
		const next = DECAYS.find((item) => item.id === nextId) ?? DECAYS[0];
		isotopeRef.current = next;
		const width = field?.clientWidth || 0;
		const height = field?.clientHeight || 0;
		atomsRef.current = width > 10 && height > 10 ? makeAtoms(width, height) : [];
		timeRef.current = 0;
		samplesRef.current = [{
			t: 0,
			alive: 144
		}];
		runningRef.current = false;
		setRunning(false);
		setIsotopeId(next.id);
		publish();
	}
	function jumpHalfLife() {
		for (const atom of atomsRef.current) if (!atom.dead && Math.random() < .5) atom.dead = true;
		timeRef.current += 1;
		const left = atomsRef.current.filter((atom) => !atom.dead).length;
		samplesRef.current = [...samplesRef.current, {
			t: timeRef.current,
			alive: left
		}];
		publish();
	}
	(0, import_react.useEffect)(() => {
		reset(isotopeId);
	}, []);
	(0, import_react.useEffect)(() => {
		runningRef.current = running;
		if (!running) return;
		let frame = 0;
		let last = performance.now();
		let publishAt = 0;
		const loop = (now) => {
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			if (runningRef.current) {
				const probability = 1 - Math.exp(-(Math.LN2 / 6) * dt);
				for (const atom of atomsRef.current) if (!atom.dead && Math.random() < probability) atom.dead = true;
				timeRef.current += dt / 6;
				const left = atomsRef.current.filter((atom) => !atom.dead).length;
				const samples = samplesRef.current;
				const lastSample = samples[samples.length - 1];
				if (!lastSample || timeRef.current - lastSample.t >= .08) samplesRef.current = [...samples, {
					t: timeRef.current,
					alive: left
				}];
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
	const expected = 144 * .5 ** halfLives;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bench, {
		id: "decay",
		lede: "Half-life is not a fuse inside each nucleus. It is the time in which each survivor has a fifty-fifty chance of still being here.",
		notes: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "After one half-life, about half remain. After another, about half of those. The atoms that last are not older on the inside. They were lucky, and their odds do not improve for having waited." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The clock on this bench is measured in half-lives, so fluorine-18 and uranium-238 play at the same speed. In a real lab they do not. The dashed curve is the ideal exponential. A few hundred atoms never sit on it exactly." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-fog",
				children: "A picture of the statistics, not a radioactive source. Nothing here is hot."
			})
		] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-line bg-panel p-4 sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: DECAYS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pill btn",
						"aria-pressed": item.id === isotope.id,
						onClick: () => reset(item.id),
						children: item.symbol
					}, item.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-mist",
					children: [
						isotope.symbol,
						" → ",
						isotope.daughter,
						" · ",
						isotope.mode,
						" · ",
						isotope.halfLife
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-fog",
					children: isotope.use
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: fieldRef,
					className: "mt-4 h-64 w-full rounded-xl border border-line"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex gap-4 text-xs text-fog",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-brass" }), " Parent"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full border border-ion" }), " Daughter"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-3 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-widest text-fog uppercase",
							children: "Parent left"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl text-mist tabular-nums",
							children: alive
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-widest text-fog uppercase",
							children: "Half-lives"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl text-mist tabular-nums",
							children: halfLives.toFixed(2)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-widest text-fog uppercase",
							children: "Ideal curve"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl text-mist tabular-nums",
							children: expected.toFixed(0)
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: chartRef,
					className: "mt-4 h-36 w-full rounded-xl border border-line"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn btn-brass",
							onClick: () => setRunning((value) => !value),
							children: [running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
								className: "size-4",
								"aria-hidden": "true"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
								className: "size-4",
								"aria-hidden": "true"
							}), running ? "Pause" : "Run"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn",
							onClick: jumpHalfLife,
							children: "Jump one half-life"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-quiet",
							onClick: () => reset(isotope.id),
							children: "Reset"
						})
					]
				})
			]
		})
	});
}
var SPEEDS = {
	low: 340,
	medium: 520,
	high: 760
};
var EMPTY = {
	through: 0,
	deflected: 0,
	back: 0
};
function token(name, fallback) {
	if (typeof document === "undefined") return fallback;
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}
function FoilLab() {
	const canvasRef = (0, import_react.useRef)(null);
	const sizeRef = (0, import_react.useRef)({
		w: 640,
		h: 360
	});
	const bodiesRef = (0, import_react.useRef)([]);
	const tallyRef = (0, import_react.useRef)({ ...EMPTY });
	const energyRef = (0, import_react.useRef)("medium");
	const loopRef = (0, import_react.useRef)(0);
	const [energy, setEnergy] = (0, import_react.useState)("medium");
	const [tally, setTally] = (0, import_react.useState)({ ...EMPTY });
	const [fired, setFired] = (0, import_react.useState)(0);
	function syncSize() {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const w = canvas.clientWidth;
		const h = canvas.clientHeight;
		sizeRef.current = {
			w,
			h
		};
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
	function drawStatic(ctx, w, h) {
		const cx = w * .48;
		const cy = h * .5;
		ctx.save();
		ctx.strokeStyle = token("--color-brass", "#d9a441");
		ctx.globalAlpha = .35;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(cx, h * .12);
		ctx.lineTo(cx, h * .88);
		ctx.stroke();
		ctx.restore();
		ctx.beginPath();
		ctx.fillStyle = token("--color-brass", "#d9a441");
		ctx.arc(cx, cy, 8, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = token("--color-fog", "#8b9c96");
		ctx.font = "12px IBM Plex Sans, sans-serif";
		ctx.textAlign = "center";
		ctx.fillText("gold", cx, h * .1);
	}
	function publish() {
		setTally({ ...tallyRef.current });
		setFired(tallyRef.current.through + tallyRef.current.deflected + tallyRef.current.back);
	}
	function drawFrame(dt) {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const { w, h } = sizeRef.current;
		ctx.fillStyle = hexAlpha(token("--color-chamber", "#071014"), .16);
		ctx.fillRect(0, 0, w, h);
		const cx = w * .48;
		const cy = h * .5;
		const ion = token("--color-ion", "#5ec4bc");
		const next = [];
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
		const loop = (now) => {
			const dt = Math.min(.032, (now - last) / 1e3);
			last = now;
			drawFrame(dt);
			if (bodiesRef.current.length > 0) loopRef.current = requestAnimationFrame(loop);
			else {
				loopRef.current = 0;
				publish();
			}
		};
		loopRef.current = requestAnimationFrame(loop);
	}
	function spawn(y) {
		const { h } = sizeRef.current;
		const speed = SPEEDS[energyRef.current];
		const clamped = Math.min(h - 16, Math.max(16, y));
		bodiesRef.current.push({
			x: 18,
			y: clamped,
			vx: speed,
			vy: 0,
			age: 0,
			done: false
		});
		ensureLoop();
	}
	function fireAt(fraction) {
		const { h } = sizeRef.current;
		spawn(h * fraction);
	}
	function fireBeam() {
		const { h } = sizeRef.current;
		for (let i = 0; i < 16; i += 1) {
			const fraction = .14 + i / 15 * .72;
			window.setTimeout(() => spawn(h * fraction), i * 40);
		}
		window.setTimeout(() => spawn(h * .5), 320);
	}
	function clearChamber() {
		bodiesRef.current = [];
		tallyRef.current = { ...EMPTY };
		if (loopRef.current) cancelAnimationFrame(loopRef.current);
		loopRef.current = 0;
		publish();
		syncSize();
	}
	(0, import_react.useEffect)(() => {
		energyRef.current = energy;
	}, [energy]);
	(0, import_react.useEffect)(() => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bench, {
		id: "foil",
		lede: "In 1909 Geiger and Marsden fired helium nuclei at gold a few hundred atoms thick. Almost everything went through. A few did not.",
		notes: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Rutherford said it was almost as incredible as if you fired a 15-inch shell at a piece of tissue paper and it came back and hit you. The mass of the atom had to sit in a speck. The rest was empty." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "About one alpha in eight thousand bounced back in that experiment. This bench draws the gold nucleus absurdly large, so you will scatter more than Geiger did. Lower energy deflects more. A head-on shot is the one that can turn around." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-fog",
				children: "Tap the chamber to choose a height and fire. A beam shows the famous mix: mostly straight through, a few bent, rarely a bounce."
			})
		] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-line bg-panel p-4 sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						["low", "Low energy"],
						["medium", "Medium"],
						["high", "High energy"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pill btn",
						"aria-pressed": energy === id,
						onClick: () => setEnergy(id),
						children: label
					}, id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					className: "mt-4 h-80 w-full rounded-xl border border-line",
					onClick: (event) => {
						const rect = event.currentTarget.getBoundingClientRect();
						fireAt((event.clientY - rect.top) / rect.height);
					},
					"aria-label": "Cloud chamber. Tap to fire an alpha particle at that height."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-3 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Straight through",
							value: tally.through
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Deflected",
							value: tally.deflected
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Bounced back",
							value: tally.back
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-fog tabular-nums",
					children: [fired, " alphas counted"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-brass",
							onClick: () => fireAt(.5),
							children: "Head-on"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn",
							onClick: () => fireAt(.42),
							children: "Graze"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn",
							onClick: fireBeam,
							children: "Fire a beam"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-quiet",
							onClick: clearChamber,
							children: "Clear"
						})
					]
				})
			]
		})
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs tracking-widest text-fog uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-display text-3xl text-mist tabular-nums",
		children: value
	})] });
}
function hexAlpha(hex, alpha) {
	const raw = hex.replace("#", "");
	if (raw.length !== 6) return `rgba(7, 16, 20, ${alpha})`;
	const n = Number.parseInt(raw, 16);
	return `rgba(${n >> 16 & 255}, ${n >> 8 & 255}, ${n & 255}, ${alpha})`;
}
var LEVELS = [
	1,
	2,
	3,
	4,
	5,
	6
];
var NM_MIN = 50;
var NM_MAX = 1600;
function nmPct(nm) {
	return (Math.min(NM_MAX, Math.max(NM_MIN, nm)) - NM_MIN) / 1550 * 100;
}
function formatNm(nm) {
	if (nm >= 100) return `${Math.round(nm)} nm`;
	return `${nm.toFixed(1)} nm`;
}
function LightLab() {
	const [n, setN] = (0, import_react.useState)(1);
	const [photon, setPhoton] = (0, import_react.useState)(null);
	const [lines, setLines] = (0, import_react.useState)([]);
	const visibleStart = nmPct(380);
	const visibleEnd = nmPct(740);
	const ladder = (0, import_react.useMemo)(() => LEVELS.map((level, index) => ({
		level,
		energy: levelEnergy(level),
		bottom: 8 + index * 14
	})), []);
	function jump(target) {
		if (target === n) return;
		const absorption = target > n;
		const next = transition(Math.max(n, target), Math.min(n, target), absorption);
		setN(target);
		setPhoton(next);
		if (!absorption) setLines((current) => {
			const key = `${next.high}-${next.low}`;
			if (current.some((line) => `${line.high}-${line.low}` === key)) return current;
			return [...current, next];
		});
	}
	const flash = photon && !photon.absorption ? wavelengthRgb(photon.nm) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bench, {
		id: "light",
		lede: "Hydrogen is the only atom this formula gets exactly right. One proton, one electron, and a ladder of allowed energies.",
		notes: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The photon’s energy is the gap between rungs, not the height of a rung. A drop from 3 to 2 is red light. The same electron falling from 2 to 1 is ultraviolet, and several times more energetic." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Emission lines are collected on the strip. Absorptions climb the ladder and do not paint a line — a line, in a discharge tube, is light leaving the atom." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-lg text-brass",
				children: "E = −13.6 eV / n²"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-fog",
				children: "The rungs are spaced for a finger, not for energy. The electron-volts on each rung are the real gaps, and they bunch up near zero."
			})
		] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-line bg-panel p-4 sm:p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,14rem)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-widest text-fog uppercase",
					children: "Energy ladder"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-3 h-96 rounded-xl border border-line bg-chamber",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pointer-events-none absolute right-6 left-24 h-px bg-line",
							style: { bottom: "94%" }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "pointer-events-none absolute top-3 right-4 text-xs text-fog",
							children: "0 eV"
						}),
						ladder.map((rung) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "absolute right-3 left-3 flex h-11 items-center gap-3 px-2 text-left",
							style: { bottom: `${rung.bottom}%` },
							onClick: () => jump(rung.level),
							"aria-pressed": n === rung.level,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `w-10 text-sm tabular-nums ${n === rung.level ? "text-brass" : "text-fog"}`,
									children: ["n=", rung.level]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-px flex-1 ${n === rung.level ? "bg-brass" : "bg-line"}` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "w-20 text-right text-xs text-fog tabular-nums",
									children: [rung.energy.toFixed(2), " eV"]
								})
							]
						}, rung.level)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "pointer-events-none absolute left-14 size-3 -translate-x-1/2 rounded-full bg-ion",
							style: { bottom: `calc(${ladder[n - 1]?.bottom ?? 8}% + 1rem)` },
							"aria-hidden": "true"
						})
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-28 items-end rounded-xl border border-line px-4 py-3",
						style: { background: flash ?? "var(--color-chamber)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-xs tracking-widest uppercase ${flash ? "text-chamber" : "text-fog"}`,
							children: "Discharge tube"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-line bg-chamber p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-widest text-fog uppercase",
							children: "Last photon"
						}), photon ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-2 space-y-1 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-fog",
										children: photon.absorption ? "Absorbed" : "Emitted"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "tabular-nums",
										children: photon.absorption ? `n=${photon.low} → n=${photon.high}` : `n=${photon.high} → n=${photon.low}`
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-fog",
										children: "Energy"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "tabular-nums",
										children: [photon.eV.toFixed(2), " eV"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-fog",
										children: "Wavelength"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "tabular-nums",
										children: formatNm(photon.nm)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-fog",
										children: "Series"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
										photon.series,
										" · ",
										photon.band
									] })]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-fog",
							children: "Tap a rung. Higher is an absorption. Lower is light leaving."
						})]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-widest text-fog uppercase",
							children: "Spectrum collected"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-fog tabular-nums",
							children: [lines.length, " emission lines"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mt-2 h-16 overflow-hidden rounded-xl border border-line bg-chamber",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "spectrum-window absolute top-0 bottom-0 opacity-80",
								style: {
									left: `${visibleStart}%`,
									width: `${visibleEnd - visibleStart}%`
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute bottom-1 left-2 text-xs text-mist",
								children: "UV"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute bottom-1 -translate-x-1/2 text-xs text-chamber",
								style: { left: `${(visibleStart + visibleEnd) / 2}%` },
								children: "visible"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-2 bottom-1 text-xs text-mist",
								children: "IR"
							}),
							lines.map((line) => {
								const color = wavelengthRgb(line.nm) ?? "var(--color-mist)";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute top-1 bottom-5 w-0.5",
									style: {
										left: `${nmPct(line.nm)}%`,
										background: color
									},
									title: `${line.series} ${formatNm(line.nm)}`
								}, `${line.high}-${line.low}`);
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-fog",
						children: "Ultraviolet sits left of the colored window, infrared to the right. A Balmer drop into n = 2 is the one that lands in the window."
					})
				]
			})]
		})
	});
}
function DaltonArt() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 320 220",
		className: "h-auto w-full",
		role: "img",
		"aria-label": "A solid sphere",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "320",
				height: "220",
				fill: "var(--color-chamber)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "160",
				cy: "110",
				r: "58",
				fill: "var(--color-brass)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "142",
				cy: "92",
				r: "16",
				fill: "var(--color-mist)",
				opacity: "0.18"
			})
		]
	});
}
function ThomsonArt() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 320 220",
		className: "h-auto w-full",
		role: "img",
		"aria-label": "Positive sphere with embedded electrons",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "320",
				height: "220",
				fill: "var(--color-chamber)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "160",
				cy: "112",
				r: "70",
				fill: "var(--color-brass)",
				opacity: "0.35"
			}),
			[
				[120, 80],
				[190, 78],
				[150, 120],
				[200, 130],
				[118, 145],
				[168, 156],
				[210, 96]
			].map(([x, y]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: x,
				cy: y,
				r: "6",
				fill: "var(--color-ion)"
			}, `${x}-${y}`))
		]
	});
}
function RutherfordArt() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 320 220",
		className: "h-auto w-full",
		role: "img",
		"aria-label": "Tiny nucleus and a deflected alpha path",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "320",
				height: "220",
				fill: "var(--color-chamber)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "168",
				cy: "112",
				r: "78",
				fill: "none",
				stroke: "var(--color-line)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 168 C 90 168, 120 140, 150 112",
				fill: "none",
				stroke: "var(--color-ion)",
				strokeWidth: "1.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M150 112 C 176 90, 210 40, 300 28",
				fill: "none",
				stroke: "var(--color-ion)",
				strokeWidth: "1.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "168",
				cy: "112",
				r: "7",
				fill: "var(--color-brass)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "100",
				cy: "70",
				r: "4",
				fill: "var(--color-ion)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "230",
				cy: "150",
				r: "4",
				fill: "var(--color-ion)"
			})
		]
	});
}
function BohrArt() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 320 220",
		className: "h-auto w-full",
		role: "img",
		"aria-label": "Three quantized orbits around a nucleus",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "320",
				height: "220",
				fill: "var(--color-chamber)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "150",
				cy: "114",
				r: "28",
				fill: "none",
				stroke: "var(--color-line)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "150",
				cy: "114",
				r: "52",
				fill: "none",
				stroke: "var(--color-line)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "150",
				cy: "114",
				r: "76",
				fill: "none",
				stroke: "var(--color-line)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "150",
				cy: "114",
				r: "6",
				fill: "var(--color-brass)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "202",
				cy: "114",
				r: "5",
				fill: "var(--color-ion)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M214 114 C 224 104, 232 124, 242 114 C 252 104, 260 124, 272 114",
				fill: "none",
				stroke: "var(--color-brass)",
				strokeWidth: "1.5"
			})
		]
	});
}
function CloudArt({ mode }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
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
				const lobe = rand() < .5 ? -1 : 1;
				x = gauss() * 28;
				y = lobe * (34 + Math.abs(gauss()) * 30);
			}
			const px = width / 2 + x;
			const py = height / 2 + y;
			ctx.globalAlpha = (mode === "s" ? .45 : .5) * (.35 + rand() * .65);
			ctx.beginPath();
			ctx.arc(px, py, 1.7, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 1;
	}, [mode]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		width: 640,
		height: 440,
		className: "h-auto w-full",
		role: "img",
		"aria-label": mode === "s" ? "A sketch of a 1s probability cloud" : "A sketch of a 2p orbital with two lobes"
	});
}
function ModelsLab() {
	const [index, setIndex] = (0, import_react.useState)(0);
	const [cloud, setCloud] = (0, import_react.useState)("s");
	const model = MODELS[index] ?? MODELS[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bench, {
		id: "models",
		lede: "Nobody threw the last model away whole. Each one was right about a measurement and wrong about a picture.",
		notes: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs tracking-widest text-brass uppercase",
				children: [
					model.year,
					" · ",
					model.person
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl text-mist",
				children: model.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: model.body }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-line bg-panel p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-widest text-brass uppercase",
						children: "Kept"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: model.kept
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-line bg-panel p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-widest text-fog uppercase",
						children: "Dropped"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: model.dropped
					})]
				})]
			})
		] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-line bg-panel p-4 sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: MODELS.map((item, itemIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pill btn",
						"aria-pressed": itemIndex === index,
						onClick: () => setIndex(itemIndex),
						children: item.year
					}, item.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 overflow-hidden rounded-xl border border-line",
					children: [
						model.id === "dalton" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DaltonArt, {}) : null,
						model.id === "thomson" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThomsonArt, {}) : null,
						model.id === "rutherford" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RutherfordArt, {}) : null,
						model.id === "bohr" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BohrArt, {}) : null,
						model.id === "quantum" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudArt, { mode: cloud }) : null
					]
				}),
				model.id === "quantum" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pill btn",
						"aria-pressed": cloud === "s",
						onClick: () => setCloud("s"),
						children: "1s cloud"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pill btn",
						"aria-pressed": cloud === "p",
						onClick: () => setCloud("p"),
						children: "2p lobes"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs text-fog",
					children: [
						model.year,
						" — ",
						model.name,
						". The next picture is a correction, not a new universe."
					]
				}),
				model.id === "quantum" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-fog",
					children: "A sketch of probability, denser where a measurement is more likely. Not a photograph, and not a track the electron follows."
				}) : null
			]
		})
	});
}
function Mark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: "size-8",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "3",
				fill: "var(--color-brass)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "8",
				fill: "none",
				stroke: "var(--color-ion)",
				strokeWidth: "1.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "8",
				r: "2",
				fill: "var(--color-ion)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "13",
				fill: "none",
				stroke: "var(--color-line)",
				strokeWidth: "1"
			})
		]
	});
}
function Header() {
	const setView = useCourse((state) => state.setView);
	const seen = useCourse((state) => state.seen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-20 border-b border-line bg-chamber/90 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex items-center gap-3",
				onClick: () => setView("home"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-2xl text-mist italic",
					children: "Atomarium"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs tracking-widest text-fog uppercase tabular-nums",
				children: [
					seen.length,
					" of ",
					STATIONS.length,
					" benches"
				]
			})]
		})
	});
}
function Syllabus() {
	const setView = useCourse((state) => state.setView);
	const seen = useCourse((state) => state.seen);
	const attempts = useCourse((state) => state.attempts);
	const bestScore = useCourse((state) => state.bestScore);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-widest text-brass uppercase",
					children: "Atomic physics"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-3 max-w-xl text-4xl text-mist sm:text-6xl",
					children: ["The atom, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-brass italic",
						children: "in your hands."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xl text-base leading-relaxed text-fog sm:text-lg",
					children: "Six benches. You assemble a nucleus, retire five historical models, pull colors out of hydrogen, watch a half-life refuse to be a clock, and fire alpha particles at gold."
				}),
				attempts > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm text-mist tabular-nums",
					children: [
						"Best check: ",
						bestScore,
						" of 8",
						attempts > 1 ? ` · ${attempts} tries` : ""
					]
				}) : null
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtomFigure, {
					protons: 6,
					neutrons: 6,
					electrons: 6,
					caption: "Carbon-12, drawn so the nucleus is visible. It is not."
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-10 border-t border-line",
			children: STATIONS.map((station) => {
				const opened = seen.includes(station.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "border-b border-line",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex w-full items-center gap-4 py-4 text-left sm:gap-6 sm:py-5",
						onClick: () => setView(station.id),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-10 shrink-0 font-display text-xl text-brass tabular-nums",
								children: station.index
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-lg text-mist",
									children: station.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-sm text-fog",
									children: station.summary
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-xs tracking-widest text-fog uppercase sm:block",
								children: opened ? "Open" : "Start"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
								className: "size-5 shrink-0 text-fog",
								"aria-hidden": "true"
							})
						]
					})
				}, station.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 text-xs leading-relaxed text-fog",
			children: "Every figure on this course is enlarged. A real nucleus is about a hundred-thousandth the width of the electron cloud. Progress stays in this browser."
		})
	] });
}
function Course() {
	const view = useCourse((state) => state.view);
	(0, import_react.useEffect)(() => {
		useCourse.persist.rehydrate();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-mist",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6",
			children: [
				view === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Syllabus, {}) : null,
				view === "build" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuildLab, {}) : null,
				view === "models" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelsLab, {}) : null,
				view === "light" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LightLab, {}) : null,
				view === "decay" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecayLab, {}) : null,
				view === "foil" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoilLab, {}) : null,
				view === "check" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckLab, {}) : null
			]
		})]
	});
}
var SplitComponent = Course;
//#endregion
export { SplitComponent as component };
