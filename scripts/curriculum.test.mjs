import "./curriculum-loader.mjs";
import test from "node:test";
import assert from "node:assert/strict";
const { stabilityLine } = await import("../src/lib/isotopes.ts");
const { transition, stepScatter, COULOMB, configuration } = await import("../src/lib/physics.ts");
test("isotope records distinguish known decay from unknown combinations", () => {
  assert.match(stabilityLine(18, 19), /electron capture/);
  assert.match(stabilityLine(6, 8), /beta-minus/);
  assert.match(stabilityLine(6, 6), /listed as stable/);
  assert.match(stabilityLine(18, 0), /outside.*verified/);
  assert.match(stabilityLine(6, 40), /outside.*verified/);
});
test("all 15 selectable hydrogen transitions have finite positive photon values", () => {
  let count = 0,
    off = 0;
  for (let high = 2; high <= 6; high++)
    for (let low = 1; low < high; low++) {
      const p = transition(high, low, false);
      assert.ok(Number.isFinite(p.nm) && p.nm > 0 && p.eV > 0);
      assert.ok(Math.abs(p.eV - 13.59844 * (1 / low ** 2 - 1 / high ** 2)) < 1e-12);
      count++;
      if (p.nm > 1600) off++;
    }
  assert.equal(count, 15);
  assert.equal(off, 4);
  assert.ok(Math.abs(transition(6, 5, false).nm - 7459.88) < 0.1);
});
test("head-on alpha particles turn under repulsion and conserve energy at all offered speeds", () => {
  for (const speed of [340, 520, 760]) {
    const body = { x: 20, y: 180, vx: speed, vy: 0, age: 0, done: false };
    const energy = 0.5 * speed ** 2 + COULOMB / 300;
    let nearest = 300;
    for (let i = 0; i < 10000 && !body.done; i++) {
      stepScatter(body, 320, 180, 1 / 1000, 640, 360);
      nearest = Math.min(nearest, Math.hypot(body.x - 320, body.y - 180));
      const now =
        0.5 * (body.vx ** 2 + body.vy ** 2) + COULOMB / Math.hypot(body.x - 320, body.y - 180);
      assert.ok(Math.abs(now - energy) / energy < 0.002, `${speed}: energy drift`);
    }
    assert.ok(body.done && body.vx < 0, `speed ${speed} returns`);
    assert.ok(Math.abs(nearest - COULOMB / energy) < 0.15, `speed ${speed} closest approach`);
    if (speed >= 520) assert.ok(nearest < 8, "turning is inside the old drawn boundary");
  }
});
test("Coulomb trajectories are symmetric above and below the nucleus", () => {
  const a = { x: 20, y: 160, vx: 760, vy: 0, age: 0, done: false };
  const b = { ...a, y: 200 };
  for (let i = 0; i < 120; i++) {
    stepScatter(a, 320, 180, 1 / 60, 640, 360);
    stepScatter(b, 320, 180, 1 / 60, 640, 360);
  }
  assert.ok(Math.abs(a.x - b.x) < 1e-8);
  assert.ok(Math.abs(a.y + b.y - 360) < 1e-8);
});
test("neutral calcium filling has twenty electrons and expected shells", () => {
  const { fills, perN } = configuration(20);
  assert.equal(
    fills.reduce((n, f) => n + f.count, 0),
    20,
  );
  assert.deepEqual(perN.slice(1), [2, 8, 8, 2]);
});
