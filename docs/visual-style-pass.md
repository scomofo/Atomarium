# Illustration, motion, and local-server pass

Instrument-style atomic plates with shaded particles, shell labels and measurement marks; glass discharge-tube and spectrum treatments; continuous alpha-particle trails and clearer decay beads/graph guides. Shell rings remain schematic rather than continuously rotating.

All diagrams remain native SVG/canvas. Motion is brief and tied to learner
interaction; reduced-motion preferences disable decorative fades and pose
transitions. Scientific data and calculation models retain the corrections
recorded in `curriculum-corrections.md`.

## Desktop and ports

Desktop is the required target. Existing responsive layouts remain available;
mobile-specific work and QA are optional. `browser-smoke.mjs` defaults to desktop
and accepts `BROWSER_SMOKE_MOBILE=true` if a future task needs mobile.

There is no mandatory 8080/8081 port. Dev defaults to 5173, built preview to 4173,
and both select the next available port when occupied. Configure a starting port
with `DEV_PORT` / `PREVIEW_PORT` (each takes precedence over `PORT`), or pass
`--port` through the npm script. For example:

```sh
npm run dev -- --port 5300
npm run preview -- --port 5301
```

Use Vite's reported URL for checks. Pass it directly to browser smoke/auth checks,
or set `DEV_URL`. `npm run preview:restart` reports and saves the actual URL in
`.grok/preview.url`. Restart/stop verifies project ownership and never terminates
another project's listener. `startup.sh` resolves its own repository and reuses
only its own dev process. PID namespace translation prevents host/container PID
confusion in the Linux helpers.

## Verification

- Production build, TypeScript, and lint pass (existing lint warnings remain).
- Desktop development and built-output browser checks cover illustration states,
  all six apparatus views where applicable, animation resets and reduced motion.
- Curriculum regressions and 27 port/process/preview helper tests pass per repo.
- Concurrent desktop checks render all three apps on dev ports 5173/5174/5175
  and preview ports 4173/4174/4175. Per-app overrides, startup reuse, and preview
  restart/stop isolation also pass.
- 55 application-data/auth unit tests pass per repo.
- The full script suite retains the same eight existing share-card fixture
  failures documented in `curriculum-corrections.md`; no new failures were added.
