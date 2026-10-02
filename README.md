# Atomarium

An interactive atomic-physics course: seven benches where you assemble a nucleus, retire five
historical models of the atom, pull colors out of hydrogen, watch a half-life refuse to be a
clock, fire alpha particles at gold foil, and read periodic trends across the first twenty
elements.

## Stack

React 19 + Vite + TanStack Router, Tailwind v4, zustand (progress persists in `localStorage`).
No auth, no database.

## Develop

```sh
npm install
npm run dev
```

## Validate

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

`npm test` includes a content regression suite (`src/lib/course-data.test.ts`) covering
station ids, the Z 1–20 element records, preset isotopes, quiz answers, and trend values.
